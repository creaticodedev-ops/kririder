import express from 'express';
import { rateLimit } from '../middleware/rateLimit.js';
import upload, { handleMulterError } from '../middleware/multer.js';
import { requireOnboardingSession } from '../middleware/onboardingAuth.js';
import {
  getInvitePreview,
  setPasswordFromInvite,
  getOnboardingSession,
  updateOnboardingSession,
  uploadOnboardingLogo,
  completeOnboarding,
} from '../controllers/agencyOnboardingController.js';

const router = express.Router();

const tokenLimit = rateLimit({
  windowMs: 60_000,
  max: 30,
  message: 'Too many onboarding requests',
});

// Session routes first so they are not captured by :token
router.get('/session/me', ...requireOnboardingSession, getOnboardingSession);
router.patch('/session/me', ...requireOnboardingSession, updateOnboardingSession);
router.post(
  '/session/logo',
  ...requireOnboardingSession,
  upload.single('logo'),
  handleMulterError,
  uploadOnboardingLogo,
);
router.post('/session/complete', ...requireOnboardingSession, completeOnboarding);

router.get('/:token', tokenLimit, getInvitePreview);
router.post('/:token/set-password', tokenLimit, setPasswordFromInvite);

export default router;
