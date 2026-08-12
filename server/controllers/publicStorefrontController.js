import Agency from '../models/Agency.js';
import {
  requirePublicAgency,
  buildStorefrontPath,
  buildStorefrontUrl,
} from '../services/publicTenant.js';
import {
  getOrCreateAgencySettings,
  serializeAgencySettings,
} from '../services/agencySettingsService.js';

/**
 * Public agency profile for a slug storefront (or default public tenant).
 * Safe fields only — never exposes owner password, invite tokens, or internals.
 */
export const getPublicStorefront = async (req, res) => {
  try {
    const agency = await requirePublicAgency(req, res);
    if (!agency) return;

    if (!agency.agencyId) {
      return res.json({
        success: true,
        storefront: {
          agencyId: null,
          name: agency.name || '',
          slug: agency.slug || null,
          logoUrl: '',
          phone: '',
          whatsapp: '',
          address: '',
          city: '',
          country: '',
          primaryBrandColor: '',
          storefrontPath: agency.slug ? buildStorefrontPath(agency.slug) : '/',
          storefrontUrl: agency.slug ? buildStorefrontUrl(agency.slug) : buildStorefrontUrl(''),
        },
      });
    }

    const doc = await Agency.findById(agency.agencyId)
      .select(
        'name slug logoUrl phone whatsapp address city country primaryBrandColor status',
      )
      .lean();
    if (!doc || doc.status !== 'active') {
      return res.status(404).json({
        success: false,
        code: 'PUBLIC_AGENCY_NOT_FOUND',
        message: 'Agency storefront not found',
      });
    }

    let whatsapp = doc.whatsapp || '';
    try {
      const settings = await serializeAgencySettings(
        agency.legacyOwnerId,
        await getOrCreateAgencySettings(agency.legacyOwnerId, agency.agencyId),
        agency.agencyId,
      );
      if (!whatsapp) {
        whatsapp = settings.whatsappReservationNumber || '';
      }
    } catch {
      /* settings optional for public profile */
    }

    res.json({
      success: true,
      storefront: {
        agencyId: String(doc._id),
        name: doc.name || '',
        slug: doc.slug || '',
        logoUrl: doc.logoUrl || '',
        phone: doc.phone || '',
        whatsapp,
        address: doc.address || '',
        city: doc.city || '',
        country: doc.country || '',
        primaryBrandColor: doc.primaryBrandColor || '',
        storefrontPath: buildStorefrontPath(doc.slug),
        storefrontUrl: buildStorefrontUrl(doc.slug),
      },
    });
  } catch (error) {
    console.error('[getPublicStorefront]', error.message);
    res.status(500).json({ success: false, message: 'Failed to load storefront' });
  }
};

export default { getPublicStorefront };
