import mongoose from 'mongoose';
import Agency from '../models/Agency.js';
import User from '../models/User.js';

/**
 * P1 public-tenant resolution — returns one Agency for the storefront.
 * Never merges fleets across agencies.
 *
 * Priority:
 * 1. PUBLIC_AGENCY_ID
 * 2. PUBLIC_OWNER_ID → Agency.legacyOwnerId (P0 compat)
 * 3. Exactly one Agency with isPublicStorefront=true
 * 4. Exactly one active Agency
 * 5. Fail closed (503)
 */

export class PublicTenantError extends Error {
  constructor(
    message = 'Public catalog unavailable: set PUBLIC_AGENCY_ID (or PUBLIC_OWNER_ID) or mark one agency as public storefront',
  ) {
    super(message);
    this.name = 'PublicTenantError';
    this.status = 503;
    this.code = 'PUBLIC_TENANT_UNRESOLVED';
  }
}

let cachedAgency = undefined;
let cachedAt = 0;
const CACHE_MS = 30_000;

export const clearPublicTenantCache = () => {
  cachedAgency = undefined;
  cachedAt = 0;
};

const toPublicAgency = (agency) => ({
  agencyId: agency._id,
  legacyOwnerId: agency.legacyOwnerId || agency.primaryOwnerUserId,
  primaryOwnerUserId: agency.primaryOwnerUserId,
  slug: agency.slug,
  name: agency.name,
});

/**
 * @returns {Promise<{ agencyId, legacyOwnerId, primaryOwnerUserId, slug, name }>}
 * @throws {PublicTenantError}
 */
export const resolvePublicAgency = async () => {
  const now = Date.now();
  if (cachedAgency !== undefined && now - cachedAt < CACHE_MS) {
    if (cachedAgency === null) throw new PublicTenantError();
    return cachedAgency;
  }

  const fromAgencyEnv = String(process.env.PUBLIC_AGENCY_ID || '').trim();
  if (fromAgencyEnv) {
    if (!mongoose.isValidObjectId(fromAgencyEnv)) {
      throw new PublicTenantError('PUBLIC_AGENCY_ID is not a valid ObjectId');
    }
    const agency = await Agency.findById(fromAgencyEnv).lean();
    if (!agency) {
      throw new PublicTenantError('PUBLIC_AGENCY_ID does not match any agency');
    }
    const resolved = toPublicAgency(agency);
    cachedAgency = resolved;
    cachedAt = now;
    return resolved;
  }

  const fromOwnerEnv = String(process.env.PUBLIC_OWNER_ID || '').trim();
  if (fromOwnerEnv) {
    if (!mongoose.isValidObjectId(fromOwnerEnv)) {
      throw new PublicTenantError('PUBLIC_OWNER_ID is not a valid ObjectId');
    }
    let agency = await Agency.findOne({ legacyOwnerId: fromOwnerEnv }).lean();
    if (!agency) {
      // Pre-migration / ensure path: map owner → create link if user exists
      const owner = await User.findOne({ _id: fromOwnerEnv, role: 'owner' }).select('_id agencyId').lean();
      if (owner?.agencyId) {
        agency = await Agency.findById(owner.agencyId).lean();
      }
    }
    if (!agency) {
      throw new PublicTenantError('PUBLIC_OWNER_ID does not map to an agency');
    }
    const resolved = toPublicAgency(agency);
    cachedAgency = resolved;
    cachedAt = now;
    return resolved;
  }

  const storefront = await Agency.find({ isPublicStorefront: true, status: 'active' })
    .select('_id legacyOwnerId primaryOwnerUserId slug name')
    .limit(2)
    .lean();
  if (storefront.length === 1) {
    const resolved = toPublicAgency(storefront[0]);
    cachedAgency = resolved;
    cachedAt = now;
    return resolved;
  }
  if (storefront.length > 1) {
    cachedAgency = null;
    cachedAt = now;
    console.error('[publicTenant] Multiple isPublicStorefront agencies — fail closed');
    throw new PublicTenantError();
  }

  const active = await Agency.find({ status: 'active' })
    .select('_id legacyOwnerId primaryOwnerUserId slug name')
    .limit(2)
    .lean();
  if (active.length === 1) {
    const resolved = toPublicAgency(active[0]);
    cachedAgency = resolved;
    cachedAt = now;
    return resolved;
  }

  // Last-resort P0 compat before agencies exist: sole active owner
  if (active.length === 0) {
    const owners = await User.find({
      role: 'owner',
      $or: [
        { accountStatus: 'active' },
        { accountStatus: { $exists: false } },
        { accountStatus: null },
      ],
    })
      .select('_id')
      .limit(2)
      .lean();
    if (owners.length === 1) {
      const resolved = {
        agencyId: null,
        legacyOwnerId: owners[0]._id,
        primaryOwnerUserId: owners[0]._id,
        slug: null,
        name: null,
        ownerOnlyFallback: true,
      };
      cachedAgency = resolved;
      cachedAt = now;
      return resolved;
    }
  }

  cachedAgency = null;
  cachedAt = now;
  console.error(
    `[publicTenant] Cannot resolve public agency: activeAgencies=${active.length}. ` +
      'Set PUBLIC_AGENCY_ID or PUBLIC_OWNER_ID.',
  );
  throw new PublicTenantError();
};

/** @returns {Promise<string>} agencyId (or legacy owner id in ownerOnlyFallback) */
export const resolvePublicAgencyId = async () => {
  const agency = await resolvePublicAgency();
  if (agency.agencyId) return String(agency.agencyId);
  if (agency.ownerOnlyFallback && agency.legacyOwnerId) return String(agency.legacyOwnerId);
  throw new PublicTenantError();
};

/**
 * Legacy helper — returns the public agency's legacyOwnerId (primary owner user id).
 * Prefer resolvePublicAgency() for new code.
 */
export const resolvePublicOwnerId = async () => {
  const agency = await resolvePublicAgency();
  return String(agency.legacyOwnerId || agency.primaryOwnerUserId);
};

export const requirePublicAgency = async (res) => {
  try {
    return await resolvePublicAgency();
  } catch (error) {
    if (error instanceof PublicTenantError) {
      res.status(error.status).json({
        success: false,
        message: error.message,
        code: error.code,
      });
      return null;
    }
    throw error;
  }
};

/** @deprecated use requirePublicAgency — kept for P0 call-site compat during transition */
export const requirePublicOwnerId = async (res) => {
  const agency = await requirePublicAgency(res);
  if (!agency) return null;
  return String(agency.legacyOwnerId || agency.primaryOwnerUserId);
};

export default {
  resolvePublicAgency,
  resolvePublicAgencyId,
  resolvePublicOwnerId,
  requirePublicAgency,
  requirePublicOwnerId,
  clearPublicTenantCache,
  PublicTenantError,
};
