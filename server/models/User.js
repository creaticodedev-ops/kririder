import mongoose from "mongoose";

export const OWNER_PERMISSIONS = [
  'dashboard',
  'analytics',
  'fleet',
  'bookings',
  'customers',
  'locations',
  'calendar',
  'maintenance',
  'reports',
  'audit',
  'contracts',
  'templates',
];

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    /** Always stored as bcrypt hash — never plaintext. */
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'owner', 'superadmin'],
        default: 'user',
    },
    image: { type: String, default: '' },

    /** Display name for the agency this admin operates */
    agencyName: { type: String, default: '' },

    /**
     * Canonical tenant membership (P1).
     * Required for role=owner after agency migration; null for superadmin.
     */
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency',
        default: null,
        index: true,
    },

    /**
     * Account gate (independent of license trial).
     * pending   → invited; must complete onboarding before dashboard
     * active    → can log in (subject to license for owners)
     * suspended → temporary lock
     * disabled  → permanent lock
     */
    accountStatus: {
        type: String,
        enum: ['pending', 'active', 'suspended', 'disabled'],
        default: 'active',
    },

    /**
     * Feature permissions for owner admins.
     * Empty array = all permissions (default full access).
     */
    permissions: {
        type: [String],
        default: [],
    },

    /**
     * Product license (owners only — ignored for superadmin).
     * trial | active | expired
     */
    licenseStatus: {
        type: String,
        enum: ['trial', 'active', 'expired'],
        default: 'trial',
    },
    trialStartedAt: { type: Date },
    trialEndsAt: { type: Date },
    licensedAt: { type: Date },

    lastLoginAt: { type: Date },
    notes: { type: String, default: '' },

    /** Bumped on password reset / lock to invalidate existing JWTs */
    tokenVersion: { type: Number, default: 0 },

    /** SHA-256 of single-use onboarding invite token (raw token never stored). */
    inviteTokenHash: { type: String, default: null, index: true },
    inviteExpiresAt: { type: Date, default: null },
    inviteUsedAt: { type: Date, default: null },
    /** Set when owner chooses their own password via invite link. */
    passwordSetAt: { type: Date, default: null },
    onboardingCompletedAt: { type: Date, default: null },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
