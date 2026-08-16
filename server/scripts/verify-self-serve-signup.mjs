/**
 * E2E: public self-serve signup creates owner + agency + trial, without Super Admin.
 *
 *   npm run test:signup:e2e
 */
import 'dotenv/config';
if (process.env.E2E_USE_PROD !== 'true') delete process.env.MONGODB_URI;
import mongoose from 'mongoose';

process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'e2e-self-serve-signup-secret-min-32-chars!!';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
};
const pass = (msg) => console.log(`PASS: ${msg}`);

async function connectDb() {
  if (process.env.MONGODB_URI) {
    const { buildMongoUri } = await import('../configs/db.js');
    await mongoose.connect(buildMongoUri(process.env.MONGODB_URI));
    return { stop: async () => mongoose.disconnect() };
  }
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri('car-rental-signup-e2e'));
  return {
    stop: async () => {
      await mongoose.disconnect();
      await mem.stop();
    },
  };
}

async function main() {
  const db = await connectDb();
  const { default: User } = await import('../models/User.js');
  const { default: Agency } = await import('../models/Agency.js');
  const { default: AgencySubscription } = await import('../models/AgencySubscription.js');
  const { TRIAL_DAYS } = await import('../services/licenseService.js');
  const { registerSelfServeAgency, getSignupInfo } = await import('../services/selfServeSignup.js');
  const { loginUser } = await import('../controllers/userController.js');
  const { getUserData } = await import('../controllers/userController.js');
  const jwt = (await import('jsonwebtoken')).default;

  const info = getSignupInfo();
  if (info.trialDays === TRIAL_DAYS) pass(`signup-info trialDays=${TRIAL_DAYS}`);
  else fail(`trialDays mismatch ${info.trialDays} vs ${TRIAL_DAYS}`);

  const tag = `sg-${Date.now()}`;
  const email = `${tag}@signup.test`;
  const payload = {
    name: 'Sara Owner',
    email,
    password: 'StrongPass9',
    confirmPassword: 'StrongPass9',
    agencyName: `${tag} Rentals`,
    phone: '212600000001',
    country: 'Morocco',
    city: 'Casablanca',
  };

  try {
    await registerSelfServeAgency({ ...payload, password: 'short' });
    fail('short password should be rejected');
  } catch (err) {
    if (err.status === 400) pass('short password rejected');
    else fail(`short password: ${err.message}`);
  }

  const created = await registerSelfServeAgency(payload);
  if (created.token && created.user?.role === 'owner' && !created.onboardingRequired) {
    pass('signup returns JWT and active owner');
  } else fail('signup token/user incomplete');

  const user = await User.findById(created.user._id);
  const agency = await Agency.findById(created.agency._id);
  if (user.accountStatus === 'active' && user.passwordSetAt && user.onboardingCompletedAt) {
    pass('owner is active with password and completed onboarding');
  } else fail('owner not fully activated');

  if (
    String(agency.primaryOwnerUserId) === String(user._id) &&
    String(agency.legacyOwnerId) === String(user._id) &&
    String(user.agencyId) === String(agency._id) &&
    agency.status === 'active' &&
    agency.isPublicStorefront === false
  ) {
    pass('agency owner relationship is correct');
  } else fail('agency/owner link incorrect');

  if (user.licenseStatus === 'trial' && user.trialEndsAt) pass('user trial initialized');
  else fail('user trial missing');

  const sub = await AgencySubscription.findOne({ agencyId: agency._id, isCurrent: true });
  if (sub?.planCode === 'free_trial' && sub.status === 'trialing') pass('billing subscription is free_trial/trialing');
  else fail(`subscription unexpected: ${sub?.planCode} ${sub?.status}`);

  try {
    await registerSelfServeAgency(payload);
    fail('duplicate email should be rejected');
  } catch (err) {
    if (err.status === 409) pass('duplicate email rejected');
    else fail(`duplicate email: ${err.message}`);
  }

  const decoded = jwt.verify(created.token, process.env.JWT_SECRET);
  if (String(decoded._id) === String(user._id)) pass('JWT subject is the new owner');
  else fail('JWT subject mismatch');

  const mockRes = () => {
    const res = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };
    return res;
  };

  const loginRes = mockRes();
  await loginUser({ body: { email, password: 'StrongPass9' } }, loginRes);
  if (loginRes.statusCode === 200 && loginRes.body?.token && loginRes.body?.onboardingRequired === false) {
    pass('new owner can log in to dashboard');
  } else fail(`login after signup: ${loginRes.statusCode} ${JSON.stringify(loginRes.body)}`);

  const dataRes = mockRes();
  await getUserData({ user }, dataRes);
  if (dataRes.body?.success && dataRes.body?.onboardingRequired !== true && dataRes.body?.user?.agencyId) {
    pass('getUserData opens owner workspace');
  } else fail('getUserData after signup unexpected');

  await User.deleteOne({ _id: user._id });
  await Agency.deleteOne({ _id: agency._id });
  await AgencySubscription.deleteMany({ agencyId: agency._id });
  await db.stop();
  console.log('\nSelf-serve signup E2E complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
