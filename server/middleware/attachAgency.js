import Agency from '../models/Agency.js';
import { ensureAgencyForOwner } from '../services/agencyMigration.js';

/**
 * Attaches req.agencyId / req.agency / req.agencyLegacyOwnerId for owner routes.
 * Auto-provisions a missing Agency for legacy owners (idempotent, non-destructive).
 */
export const attachAgency = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'owner') {
      return next();
    }

    let agency = null;
    if (req.user.agencyId) {
      agency = await Agency.findById(req.user.agencyId).lean();
    }
    if (!agency) {
      agency = await ensureAgencyForOwner(req.user);
      if (agency && !req.user.agencyId) {
        req.user.agencyId = agency._id;
      }
    }

    if (!agency) {
      console.error(`[attachAgency] Failed to resolve agency for owner ${req.user._id}`);
      return res.status(500).json({
        success: false,
        code: 'AGENCY_CONTEXT_MISSING',
        message: 'Agency context could not be established for this account',
      });
    }

    if (agency.status && agency.status !== 'active') {
      return res.status(403).json({
        success: false,
        code: 'AGENCY_LOCKED',
        message: 'This agency has been suspended or disabled',
      });
    }

    req.agency = agency;
    req.agencyId = agency._id;
    req.agencyLegacyOwnerId = agency.legacyOwnerId || agency.primaryOwnerUserId || req.user._id;
    return next();
  } catch (error) {
    console.error('[attachAgency]', error.message);
    return res.status(500).json({
      success: false,
      code: 'AGENCY_CONTEXT_MISSING',
      message: 'Agency context could not be established',
    });
  }
};

export default attachAgency;
