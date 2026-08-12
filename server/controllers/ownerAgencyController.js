import {
  buildStorefrontPath,
  buildStorefrontUrl,
} from '../services/publicTenant.js';

/**
 * Owner-facing agency profile + public storefront URL for dashboard/settings.
 */
export const getOwnerAgency = async (req, res) => {
  try {
    const agency = req.agency;
    if (!agency) {
      return res.status(500).json({
        success: false,
        code: 'AGENCY_CONTEXT_MISSING',
        message: 'Agency context missing',
      });
    }

    const slug = agency.slug || '';
    res.json({
      success: true,
      agency: {
        _id: agency._id,
        name: agency.name || '',
        slug,
        status: agency.status || 'active',
        logoUrl: agency.logoUrl || '',
        phone: agency.phone || '',
        whatsapp: agency.whatsapp || '',
        address: agency.address || '',
        city: agency.city || '',
        country: agency.country || '',
        primaryBrandColor: agency.primaryBrandColor || '',
        isPublicStorefront: Boolean(agency.isPublicStorefront),
        storefrontPath: buildStorefrontPath(slug),
        storefrontUrl: buildStorefrontUrl(slug),
      },
    });
  } catch (error) {
    console.error('[getOwnerAgency]', error.message);
    res.status(500).json({ success: false, message: 'Failed to load agency' });
  }
};

export default { getOwnerAgency };
