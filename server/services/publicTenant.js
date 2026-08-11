import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * P0 public-tenant resolution (no host/Agency model yet).
 *
 * Priority:
 * 1. PUBLIC_OWNER_ID env (explicit single-agency public storefront)
 * 2. Exactly one active owner in the DB (preserves today's single-agency deploy)
 * 3. Otherwise fail closed — never merge multiple owners' fleets/locations
 */

export class PublicTenantError extends Error {
  constructor(
    message = 'Public catalog unavailable: set PUBLIC_OWNER_ID or run with a single active agency',
  ) {
    super(message);
    this.name = 'PublicTenantError';
    this.status = 503;
    this.code = 'PUBLIC_TENANT_UNRESOLVED';
  }
}

let cachedSoleOwnerId = undefined;
let cachedAt = 0;
const CACHE_MS = 30_000;

export const clearPublicTenantCache = () => {
  cachedSoleOwnerId = undefined;
  cachedAt = 0;
};

const activeOwnerFilter = {
  role: 'owner',
  $or: [
    { accountStatus: 'active' },
    { accountStatus: { $exists: false } },
    { accountStatus: null },
  ],
};

/**
 * @returns {Promise<string>} owner id as string
 * @throws {PublicTenantError}
 */
export const resolvePublicOwnerId = async () => {
  const fromEnv = String(process.env.PUBLIC_OWNER_ID || '').trim();
  if (fromEnv) {
    if (!mongoose.isValidObjectId(fromEnv)) {
      throw new PublicTenantError('PUBLIC_OWNER_ID is not a valid ObjectId');
    }
    return fromEnv;
  }

  const now = Date.now();
  if (cachedSoleOwnerId !== undefined && now - cachedAt < CACHE_MS) {
    if (cachedSoleOwnerId === null) {
      throw new PublicTenantError();
    }
    return cachedSoleOwnerId;
  }

  const owners = await User.find(activeOwnerFilter).select('_id').limit(2).lean();
  if (owners.length === 1) {
    cachedSoleOwnerId = String(owners[0]._id);
    cachedAt = now;
    return cachedSoleOwnerId;
  }

  cachedSoleOwnerId = null;
  cachedAt = now;
  console.error(
    `[publicTenant] Cannot resolve public owner: found ${owners.length} active owner(s). ` +
      'Set PUBLIC_OWNER_ID to the agency that owns the public storefront.',
  );
  throw new PublicTenantError();
};

/** Express helper: sends 503 and returns null when unresolved. */
export const requirePublicOwnerId = async (res) => {
  try {
    return await resolvePublicOwnerId();
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

export default {
  resolvePublicOwnerId,
  requirePublicOwnerId,
  clearPublicTenantCache,
  PublicTenantError,
};
