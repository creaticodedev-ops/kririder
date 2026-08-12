import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const slugify = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

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
      enum: ['active', 'suspended', 'disabled'],
      default: 'active',
      index: true,
    },
    /** Founding owner account (P1: one owner per agency). */
    primaryOwnerUserId: {
      type: ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    /**
     * Former User._id that was the tenant root before P1.
     * Equals primaryOwnerUserId for migrated agencies; used for PUBLIC_OWNER_ID compat
     * and owner-namespaced upload paths.
     */
    legacyOwnerId: {
      type: ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    /** At most one public storefront agency (enforced in app + partial unique index). */
    isPublicStorefront: { type: Boolean, default: false },
    /** Minimal branding stub — full NAP/theme is P2. */
    logoUrl: { type: String, default: '' },
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
