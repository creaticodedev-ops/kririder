import PickupLocation from "../models/PickupLocation.js";
import { safeErrorMessage } from "../utils/helpers.js";
import { requirePublicOwnerId, resolvePublicOwnerId } from "../services/publicTenant.js";

const defaultLocations = [
    { name: 'Casablanca Airport', city: 'Casablanca', address: 'Mohammed V International Airport, Casablanca', locationType: 'airport', deliveryFee: 0, isActive: true },
    { name: 'Marrakech Airport', city: 'Marrakech', address: 'Marrakech Menara Airport', locationType: 'airport', deliveryFee: 0, isActive: true },
    { name: 'Rabat City Center', city: 'Rabat', address: 'Avenue Mohammed V, Rabat', locationType: 'office', deliveryFee: 0, isActive: true },
    { name: 'Sale Office', city: 'Sale', address: 'Boulevard Mohammed VI, Sale', locationType: 'office', deliveryFee: 0, isActive: true },
];

const ALLOWED_TYPES = new Set(['airport', 'office', 'hotel', 'custom']);

const parseDeliveryFee = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.round(n * 100) / 100;
};

/** Empty / null clears the coordinate; otherwise validates range. */
const parseCoordinate = (value, { min, max }) => {
    if (value === undefined || value === null || value === '') return null;
    const n = Number(value);
    if (!Number.isFinite(n) || n < min || n > max) {
        const err = new Error(`Coordinate must be between ${min} and ${max}`);
        err.status = 400;
        throw err;
    }
    return Math.round(n * 1e6) / 1e6;
};

const applyLocationFields = (location, body, { requireCore = false } = {}) => {
    const {
        name,
        city,
        address,
        googleMapsLink,
        locationType,
        deliveryFee,
        latitude,
        longitude,
        isActive,
    } = body;

    if (requireCore || name !== undefined) {
        const trimmed = String(name ?? '').trim();
        if (!trimmed) {
            const err = new Error('Name, city, and address are required');
            err.status = 400;
            throw err;
        }
        location.name = trimmed;
    }
    if (requireCore || city !== undefined) {
        const trimmed = String(city ?? '').trim();
        if (!trimmed) {
            const err = new Error('Name, city, and address are required');
            err.status = 400;
            throw err;
        }
        location.city = trimmed;
    }
    if (requireCore || address !== undefined) {
        const trimmed = String(address ?? '').trim();
        if (!trimmed) {
            const err = new Error('Name, city, and address are required');
            err.status = 400;
            throw err;
        }
        location.address = trimmed;
    }
    if (googleMapsLink !== undefined) {
        location.googleMapsLink = String(googleMapsLink || '').trim();
    }
    if (locationType !== undefined) {
        if (ALLOWED_TYPES.has(locationType)) location.locationType = locationType;
    }
    if (deliveryFee !== undefined) {
        location.deliveryFee = parseDeliveryFee(deliveryFee);
    }
    if (latitude !== undefined) {
        location.latitude = parseCoordinate(latitude, { min: -90, max: 90 });
    }
    if (longitude !== undefined) {
        location.longitude = parseCoordinate(longitude, { min: -180, max: 180 });
    }
    if (isActive !== undefined) {
        location.isActive = Boolean(isActive);
    }
};

/** Seed default locations for one owner when they have none. */
export const ensureOwnerDefaultLocations = async (ownerId) => {
    if (!ownerId) return;
    const count = await PickupLocation.countDocuments({ owner: ownerId });
    if (count > 0) return;
    await PickupLocation.insertMany(
        defaultLocations.map((loc) => ({ ...loc, owner: ownerId })),
    );
    console.log(`[pickupLocations] Seeded defaults for owner ${ownerId}`);
};

/**
 * Backfill ownerless pickup rows to the resolved public owner (or sole active owner).
 * Safe no-op when there are no orphans or public owner cannot be resolved.
 */
export const backfillPickupLocationOwners = async () => {
    const orphanFilter = {
        $or: [{ owner: { $exists: false } }, { owner: null }],
    };
    const orphanCount = await PickupLocation.countDocuments(orphanFilter);
    if (orphanCount === 0) return { updated: 0 };

    let ownerId;
    try {
        ownerId = await resolvePublicOwnerId();
    } catch (error) {
        console.warn(
            `[pickupLocations] ${orphanCount} ownerless location(s) found but public owner unresolved — skipping backfill`,
        );
        return { updated: 0, skipped: orphanCount };
    }

    const result = await PickupLocation.updateMany(orphanFilter, { $set: { owner: ownerId } });
    const updated = result.modifiedCount || 0;
    if (updated > 0) {
        console.log(`[pickupLocations] Backfilled owner=${ownerId} on ${updated} location(s)`);
    }
    return { updated, ownerId };
};

/** @deprecated use backfillPickupLocationOwners + ensureOwnerDefaultLocations */
export const seedPickupLocations = async () => {
    await backfillPickupLocationOwners();
    try {
        const ownerId = await resolvePublicOwnerId();
        await ensureOwnerDefaultLocations(ownerId);
    } catch {
        /* multi-owner / unset PUBLIC_OWNER_ID: do not plant global rows */
    }
};

export const getActivePickupLocations = async (req, res) => {
    try {
        const ownerId = await requirePublicOwnerId(res);
        if (!ownerId) return;

        await ensureOwnerDefaultLocations(ownerId);
        const locations = await PickupLocation.find({ owner: ownerId, isActive: true })
            .sort({ city: 1, name: 1 });
        res.json({ success: true, locations });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to load pickup locations' });
    }
};

export const getAllPickupLocations = async (req, res) => {
    try {
        const ownerId = req.user._id;
        await ensureOwnerDefaultLocations(ownerId);
        const locations = await PickupLocation.find({ owner: ownerId }).sort({ createdAt: -1 });
        res.json({ success: true, locations });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to load locations' });
    }
};

export const createPickupLocation = async (req, res) => {
    try {
        const location = new PickupLocation({ owner: req.user._id });
        applyLocationFields(location, {
            ...req.body,
            locationType: ALLOWED_TYPES.has(req.body.locationType) ? req.body.locationType : 'custom',
            deliveryFee: req.body.deliveryFee ?? 0,
            googleMapsLink: req.body.googleMapsLink ?? '',
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
            latitude: req.body.latitude ?? null,
            longitude: req.body.longitude ?? null,
        }, { requireCore: true });

        await location.save();
        res.status(201).json({ success: true, message: 'Pickup location added', location });
    } catch (error) {
        console.error(error.message);
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: status === 400 ? error.message : safeErrorMessage(error, 'Failed to create location'),
        });
    }
};

export const updatePickupLocation = async (req, res) => {
    try {
        const { locationId } = req.body;

        const location = await PickupLocation.findOne({ _id: locationId, owner: req.user._id });
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        applyLocationFields(location, req.body);
        await location.save();
        res.json({ success: true, message: 'Pickup location updated', location });
    } catch (error) {
        console.error(error.message);
        const status = error.status || 500;
        res.status(status).json({
            success: false,
            message: status === 400 ? error.message : safeErrorMessage(error, 'Failed to update location'),
        });
    }
};

export const deletePickupLocation = async (req, res) => {
    try {
        const { locationId } = req.body;
        const location = await PickupLocation.findOneAndDelete({
            _id: locationId,
            owner: req.user._id,
        });

        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        res.json({ success: true, message: 'Pickup location deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to delete location' });
    }
};

export const togglePickupLocation = async (req, res) => {
    try {
        const { locationId } = req.body;
        const location = await PickupLocation.findOne({ _id: locationId, owner: req.user._id });

        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        location.isActive = !location.isActive;
        await location.save();

        res.json({
            success: true,
            message: `Location ${location.isActive ? 'enabled' : 'disabled'}`,
            location
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to toggle location' });
    }
};
