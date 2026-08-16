import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Agency from '../models/Agency.js';
import { normalizeEmail, findUserByEmail } from '../utils/emailUtils.js';
import { createTrialDefaults, serializeLicense, TRIAL_DAYS } from './licenseService.js';
import { getOrCreateAgencySettings } from './agencySettingsService.js';
import { ensureAgencySubscription } from './billingService.js';
import { ensureDefaultTemplates } from '../controllers/exportTemplateController.js';
import { ensureOwnerDefaultLocations } from '../controllers/pickupLocationController.js';
import { clearPublicTenantCache } from './publicTenant.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const inFlightEmails = new Set();

const generateToken = (user) =>
  jwt.sign(
    { _id: user._id.toString(), tv: user.tokenVersion || 0 },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

const trim = (value, max = 160) => String(value || '').trim().slice(0, max);

export const getSignupInfo = () => ({
  trialDays: TRIAL_DAYS,
  passwordMinLength: MIN_PASSWORD,
});

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  accountStatus: user.accountStatus,
  agencyId: user.agencyId,
  agencyName: user.agencyName,
  permissions: user.permissions || [],
});

/**
 * Self-serve owner + agency creation.
 * Does not use Super Admin invites. Does not mark the agency as the public storefront.
 * One trial per new agency via free_trial subscription + User.license* dual-write.
 */
export const registerSelfServeAgency = async (body = {}) => {
  const name = trim(body.name, 80);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const confirmPassword = body.confirmPassword != null ? String(body.confirmPassword) : password;
  const agencyName = trim(body.agencyName || body.company, 120);
  const phone = trim(body.phone, 40);
  const country = trim(body.country, 80);
  const city = trim(body.city, 80);
  const address = trim(body.address, 200);
  const whatsapp = trim(body.whatsapp || body.phone, 40);
  const notes = trim(body.notes || body.fleetSize, 240);

  if (!name) {
    const err = new Error('Full name is required');
    err.status = 400;
    throw err;
  }
  if (!email || !EMAIL_RE.test(email)) {
    const err = new Error('A valid work email is required');
    err.status = 400;
    throw err;
  }
  if (!agencyName) {
    const err = new Error('Company / agency name is required');
    err.status = 400;
    throw err;
  }
  if (password.length < MIN_PASSWORD) {
    const err = new Error(`Password must be at least ${MIN_PASSWORD} characters`);
    err.status = 400;
    throw err;
  }
  if (password !== confirmPassword) {
    const err = new Error('Passwords do not match');
    err.status = 400;
    throw err;
  }

  if (inFlightEmails.has(email)) {
    const err = new Error('This signup is already in progress');
    err.status = 429;
    err.code = 'SIGNUP_IN_PROGRESS';
    throw err;
  }
  inFlightEmails.add(email);

  let createdUserId = null;
  let createdAgencyId = null;

  try {
    const existing = await findUserByEmail(User, email);
    if (existing) {
      const err = new Error('An account with this email already exists');
      err.status = 409;
      err.code = 'EMAIL_EXISTS';
      throw err;
    }

    const trial = createTrialDefaults();
    const hashed = await bcrypt.hash(password, 10);
    const now = new Date();

    let user;
    try {
      user = await User.create({
        name,
        email,
        password: hashed,
        role: 'owner',
        agencyName,
        accountStatus: 'active',
        permissions: [],
        notes,
        passwordSetAt: now,
        onboardingCompletedAt: now,
        inviteTokenHash: null,
        inviteExpiresAt: null,
        inviteUsedAt: now,
        lastLoginAt: now,
        ...trial,
      });
    } catch (dupErr) {
      if (dupErr?.code === 11000) {
        const err = new Error('An account with this email already exists');
        err.status = 409;
        err.code = 'EMAIL_EXISTS';
        throw err;
      }
      throw dupErr;
    }
    createdUserId = user._id;

    const slug = await Agency.ensureUniqueSlug(agencyName);
    const agency = await Agency.create({
      name: agencyName,
      slug,
      status: 'active',
      primaryOwnerUserId: user._id,
      legacyOwnerId: user._id,
      isPublicStorefront: false,
      phone,
      whatsapp,
      email,
      city,
      country,
      address,
      onboardingCompletedAt: now,
      contractBranding: {
        companyName: agencyName,
        logoUrl: '',
        showLogoOnPdf: true,
        footerNote: '',
      },
    });
    createdAgencyId = agency._id;

    user.agencyId = agency._id;
    await user.save();

    await getOrCreateAgencySettings(user._id, agency._id);
    await ensureAgencySubscription(agency._id, {
      planCode: 'free_trial',
      status: 'trialing',
      trialStartedAt: trial.trialStartedAt,
      trialEndsAt: trial.trialEndsAt,
      actorType: 'owner',
      actorId: user._id,
      notes: 'Self-serve signup trial',
    });
    await ensureDefaultTemplates(user._id);
    await ensureOwnerDefaultLocations(user._id, agency._id);
    clearPublicTenantCache();

    const token = generateToken(user);
    return {
      token,
      onboardingRequired: false,
      trialDays: TRIAL_DAYS,
      license: serializeLicense(user),
      redirectTo: '/owner',
      user: publicUser(user),
      agency: {
        _id: agency._id,
        name: agency.name,
        slug: agency.slug,
        status: agency.status,
        primaryOwnerUserId: agency.primaryOwnerUserId,
        legacyOwnerId: agency.legacyOwnerId,
      },
    };
  } catch (error) {
    if (!error.status && createdUserId && !createdAgencyId) {
      await User.deleteOne({ _id: createdUserId }).catch(() => {});
    }
    throw error;
  } finally {
    inFlightEmails.delete(email);
  }
};

export default { registerSelfServeAgency, getSignupInfo };
