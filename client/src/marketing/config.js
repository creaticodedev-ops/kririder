/**
 * KRIRIDER marketing site copy & commercial presentation.
 *
 * Pricing / limits below mirror `server/services/planCatalog.js` public plans
 * (basic, pro, enterprise). Display names are marketing labels only —
 * do not change application billing logic from this file.
 *
 * Edit prices here when the commercial offering changes.
 */
export const BRAND = 'KRIRIDER'

export const SEO = {
  title: 'KRIRIDER — Car Rental Management Software',
  description:
    'KRIRIDER is an all-in-one car rental management platform for reservations, fleet, customers, contracts, accounting and daily operations.',
}

export const CONTACT_EMAIL = String(import.meta.env.VITE_PLATFORM_SUPPORT_EMAIL || '').trim()
export const CONTACT_WHATSAPP = String(import.meta.env.VITE_PLATFORM_SUPPORT_WHATSAPP || '').replace(/\D/g, '')
export const TRIAL_DAYS = 7

/** Agencies operating on KRIRIDER — presented only as clients, never as the product. */
export const CLIENTS = [
  { name: 'HDN Car', note: 'Rental agency' },
  { name: 'Americonfort', note: 'Rental agency' },
]

export const PLANS = [
  {
    id: 'starter',
    productCode: 'basic',
    name: 'Starter',
    audience: 'For small rental businesses starting to centralize their operations.',
    price: '299',
    currency: 'MAD',
    interval: 'month',
    cta: 'Start Free Trial',
    intent: 'trial',
    features: [
      'Up to 15 vehicles',
      '2 staff seats',
      'Reservations and walk-in bookings',
      'Customer records',
      'Digital contracts (PDF)',
      'WhatsApp operational settings',
      'Agency subdomain storefront',
    ],
  },
  {
    id: 'professional',
    productCode: 'pro',
    name: 'Professional',
    audience: 'For growing rental companies that need more automation and operational control.',
    price: '599',
    currency: 'MAD',
    interval: 'month',
    popular: true,
    cta: 'Start Free Trial',
    intent: 'trial',
    features: [
      'Up to 50 vehicles',
      '5 staff seats',
      'Everything in Starter',
      'Analytics dashboards',
      'Custom domain',
      'Promotions',
      'Priority support',
    ],
  },
  {
    id: 'business',
    productCode: 'enterprise',
    name: 'Business',
    audience: 'For established rental companies requiring advanced operational and financial capabilities.',
    price: 'Custom',
    currency: '',
    interval: '',
    cta: 'Book a Demo',
    intent: 'demo',
    features: [
      'Custom vehicle and staff limits',
      'Everything in Professional',
      'API access',
      'Priority support',
      'Tailored commercial terms',
    ],
  },
]
