import mongoose from 'mongoose';
import Agency from '../models/Agency.js';
import User from '../models/User.js';

/**
 * P1 public-tenant resolution — returns exactly one Agency for the storefront.
 * Never merges fleets across agencies.
 *
 * Slug storefronts (no custom domains / P3):
 * - When a slug is provided (query/header/body), resolve that active agency only
 * - Default `/` storefront keeps env / isPublicStorefront / single-agency rules
 *
 * Ops compatibility (default storefront):
 * - Single active agency → resolved automatically (no PUBLIC_AGENCY_ID required)
 * - PUBLIC_AGENCY_ID is optional and only needed when multiple agencies exist
 * - PUBLIC_OWNER_ID remains as legacy compat (maps via Agency.legacyOwnerId)
 *
 * Priority (default, no slug):
 * 1. PUBLIC_AGENCY_ID
 * 2. PUBLIC_OWNER_ID → Agency.legacyOwnerId
 * 3. Exactly one Agency with isPublicStorefront=true
 * 4. Exactly one active Agency
 * 5. Sole active owner fallback (pre-migration)
 * 6. Fail closed (503) — never merge
 */

export class PublicTenantError extends Error {
  constructor(
    message = 'Public catalog unavailable: with multiple agencies set PUBLIC_AGENCY_ID (or PUBLIC_OWNER_ID); single-agency deploys resolve automatically',
  ) {
    super(message);
    this.name = 'PublicTenantError';
    this.status = 503;
    this.code = 'PUBLIC_TENANT_UNRESOLVED';
  }
}

export class PublicAgencyNotFoundError extends Error {
  constructor(message = 'Agency storefront not found') {
    super(message);
    this.name = 'PublicAgencyNotFoundError';
    this.status = 404;
    this.code = 'PUBLIC_AGENCY_NOT_FOUND';
  }
}

const cache = new Map();
const CACHE_MS = 30_000;
const DEFAULT_KEY = '__default__';

export const clearPublicTenantCache = () => {
  cache.clear();
};

const cacheGet = (key) => {
  const hit = cache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at >= CACHE_MS) {
    cache.delete(key);
    return undefined;
  }
  return hit.value;
};

const cacheSet = (key, value) => {
  cache.set(key, { value, at: Date.now() });
};

const toPublicAgency = (agency, extras = {}) => ({
  agencyId: agency._id,
  legacyOwnerId: agency.legacyOwnerId || agency.primaryOwnerUserId,
  primaryOwnerUserId: agency.primaryOwnerUserId,
  slug: agency.slug,
  name: agency.name,
  ...extras,
});

export const normalizeAgencySlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

/** Read storefront slug from query, header, or body (POST booking flows). */
export const extractPublicAgencySlug = (req) => {
  if (!req) return '';
  const fromQuery = normalizeAgencySlug(req.query?.agency || req.query?.slug);
  if (fromQuery) return fromQuery;
  const header = req.headers?.['x-agency-slug'] || req.headers?.['X-Agency-Slug'];
  const fromHeader = normalizeAgencySlug(header);
  if (fromHeader) return fromHeader;
  return normalizeAgencySlug(req.body?.agencySlug || req.body?.agency);
};

const resolveBySlug = async (slug) => {
  const key = `slug:${slug}`;
  const cached = cacheGet(key);
  if (cached !== undefined) {
    if (cached === null) throw new PublicAgencyNotFoundError();
    return cached;
  }

  const agency = await Agency.findOne({ slug, status: 'active' })
    .select('_id legacyOwnerId primaryOwnerUserId slug name')
    .lean();
  if (!agency) {
    cacheSet(key, null);
    throw new PublicAgencyNotFoundError(`No active storefront for agency "${slug}"`);
  }
  const resolved = toPublicAgency(agency);
  cacheSet(key, resolved);
  return resolved;
};

const resolveDefaultAgency = async () => {
  const cached = cacheGet(DEFAULT_KEY);
  if (cached !== undefined) {
    if (cached === null) throw new PublicTenantError();
    return cached;
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
    cacheSet(DEFAULT_KEY, resolved);
    return resolved;
  }

  const fromOwnerEnv = String(process.env.PUBLIC_OWNER_ID || '').trim();
  if (fromOwnerEnv) {
    if (!mongoose.isValidObjectId(fromOwnerEnv)) {
      throw new PublicTenantError('PUBLIC_OWNER_ID is not a valid ObjectId');
    }
    let agency = await Agency.findOne({ legacyOwnerId: fromOwnerEnv }).lean();
    if (!agency) {
      const owner = await User.findOne({ _id: fromOwnerEnv, role: 'owner' }).select('_id agencyId').lean();
      if (owner?.agencyId) {
        agency = await Agency.findById(owner.agencyId).lean();
      }
    }
    if (!agency) {
      throw new PublicTenantError('PUBLIC_OWNER_ID does not map to an agency');
    }
    const resolved = toPublicAgency(agency);
    cacheSet(DEFAULT_KEY, resolved);
    return resolved;
  }

  const storefront = await Agency.find({ isPublicStorefront: true, status: 'active' })
    .select('_id legacyOwnerId primaryOwnerUserId slug name')
    .limit(2)
    .lean();
  if (storefront.length === 1) {
    const resolved = toPublicAgency(storefront[0]);
    cacheSet(DEFAULT_KEY, resolved);
    return resolved;
  }
  if (storefront.length > 1) {
    cacheSet(DEFAULT_KEY, null);
    console.error('[publicTenant] Multiple isPublicStorefront agencies — fail closed');
    throw new PublicTenantError();
  }

  const active = await Agency.find({ status: 'active' })
    .select('_id legacyOwnerId primaryOwnerUserId slug name')
    .limit(2)
    .lean();
  if (active.length === 1) {
    const resolved = toPublicAgency(active[0]);
    cacheSet(DEFAULT_KEY, resolved);
    return resolved;
  }

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
      cacheSet(DEFAULT_KEY, resolved);
      return resolved;
    }
  }

  cacheSet(DEFAULT_KEY, null);
  if (active.length > 1) {
    console.error(
      `[publicTenant] ${active.length} active agencies — automatic resolution disabled. ` +
        'Set PUBLIC_AGENCY_ID to the storefront agency (PUBLIC_OWNER_ID still accepted as legacy).',
    );
  } else {
    console.error(
      `[publicTenant] Cannot resolve public agency: activeAgencies=${active.length}.`,
    );
  }
  throw new PublicTenantError();
};

/**
 * @param {string|{ slug?: string }|undefined} slugOrOpts
 * @returns {Promise<{ agencyId, legacyOwnerId, primaryOwnerUserId, slug, name }>}
 */
export const resolvePublicAgency = async (slugOrOpts) => {
  const slug =
    typeof slugOrOpts === 'string'
      ? normalizeAgencySlug(slugOrOpts)
      : normalizeAgencySlug(slugOrOpts?.slug);
  if (slug) return resolveBySlug(slug);
  return resolveDefaultAgency();
};

export const resolvePublicAgencyId = async (slugOrOpts) => {
  const agency = await resolvePublicAgency(slugOrOpts);
  if (agency.agencyId) return String(agency.agencyId);
  if (agency.ownerOnlyFallback && agency.legacyOwnerId) return String(agency.legacyOwnerId);
  throw new PublicTenantError();
};

export const resolvePublicOwnerId = async (slugOrOpts) => {
  const agency = await resolvePublicAgency(slugOrOpts);
  return String(agency.legacyOwnerId || agency.primaryOwnerUserId);
};

/**
 * Express helper. Accepts (req, res) or legacy (res).
 * @returns {Promise<object|null>}
 */
export const requirePublicAgency = async (reqOrRes, maybeRes) => {
  const hasReq = Boolean(maybeRes);
  const req = hasReq ? reqOrRes : null;
  const res = hasReq ? maybeRes : reqOrRes;
  const slug = extractPublicAgencySlug(req);

  try {
    return await resolvePublicAgency(slug ? { slug } : undefined);
  } catch (error) {
    if (error instanceof PublicTenantError || error instanceof PublicAgencyNotFoundError) {
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

/** @deprecated use requirePublicAgency */
export const requirePublicOwnerId = async (reqOrRes, maybeRes) => {
  const agency = await requirePublicAgency(reqOrRes, maybeRes);
  if (!agency) return null;
  return String(agency.legacyOwnerId || agency.primaryOwnerUserId);
};

export const buildStorefrontPath = (slug) => {
  const safe = normalizeAgencySlug(slug);
  return safe ? `/s/${safe}` : '/';
};

export const buildStorefrontUrl = (slug) => {
  const base = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')[0]
    .trim()
    .replace(/\/$/, '');
  const path = buildStorefrontPath(slug);
  return path === '/' ? `${base}/` : `${base}${path}`;
};

export default {
  resolvePublicAgency,
  resolvePublicAgencyId,
  resolvePublicOwnerId,
  requirePublicAgency,
  requirePublicOwnerId,
  extractPublicAgencySlug,
  normalizeAgencySlug,
  buildStorefrontPath,
  buildStorefrontUrl,
  clearPublicTenantCache,
  PublicTenantError,
  PublicAgencyNotFoundError,
};
