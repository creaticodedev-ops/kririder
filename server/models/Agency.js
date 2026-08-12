import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const slugify = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

const contractBrandingSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: '', trim: true },
    logoUrl: { type: String, default: '' },
    showLogoOnPdf: { type: Boolean, default: true },
    footerNote: { type: String, default: '', trim: true, maxlength: 500 },
  },
  { _id: false },
);

const socialsSchema = new mongoose.Schema(
  {
    instagram: { type: String, default: '', trim: true },
    facebook: { type: String, default: '', trim: true },
    tiktok: { type: String, default: '', trim: true },
    youtube: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
  },
  { _id: false },
);

const seoSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 320 },
    ogImageUrl: { type: String, default: '' },
  },
  { _id: false },
);

const heroSchema = new mongoose.Schema(
  {
    headline: { type: String, default: '', trim: true, maxlength: 160 },
    subheadline: { type: String, default: '', trim: true, maxlength: 320 },
    badgeText: { type: String, default: '', trim: true, maxlength: 80 },
    imageUrl: { type: String, default: '' },
  },
  { _id: false },
);

/**
 * Tenant root for KRI RIDER multi-tenant SaaS.
 * Business data is scoped by Agency._id (agencyId).
 */
const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'disabled'],
      default: 'active',
      index: true,
    },
    primaryOwnerUserId: {
      type: ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    legacyOwnerId: {
      type: ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    isPublicStorefront: { type: Boolean, default: false },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    phone: { type: String, default: '', trim: true },
    whatsapp: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    address: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
    postalCode: { type: String, default: '', trim: true },
    addressRegion: { type: String, default: '', trim: true },
    legalName: { type: String, default: '', trim: true },
    taxId: { type: String, default: '', trim: true },
    primaryBrandColor: { type: String, default: '', trim: true },
    secondaryBrandColor: { type: String, default: '', trim: true },
    socials: { type: socialsSchema, default: () => ({}) },
    seo: { type: seoSchema, default: () => ({}) },
    hero: { type: heroSchema, default: () => ({}) },
    contractBranding: { type: contractBrandingSchema, default: () => ({}) },
    onboardingCompletedAt: { type: Date, default: null },
    timezone: { type: String, default: 'Africa/Casablanca' },
    currency: { type: String, default: 'MAD' },
    locale: { type: String, default: 'fr-MA' },
  },
  { timestamps: true },
);

agencySchema.index(
  { isPublicStorefront: 1 },
  {
    unique: true,
    partialFilterExpression: { isPublicStorefront: true },
  },
);

agencySchema.statics.slugify = slugify;

agencySchema.statics.ensureUniqueSlug = async function ensureUniqueSlug(base, excludeId = null) {
  let slug = slugify(base) || `agency-${Date.now().toString(36)}`;
  let n = 0;
  while (true) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const existing = await this.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
      .select('_id')
      .lean();
    if (!existing) return candidate;
    n += 1;
    if (n > 1000) return `${slug}-${Date.now().toString(36)}`;
  }
};

const Agency = mongoose.model('Agency', agencySchema);
export default Agency;
export { slugify };
