import express from 'express';
import {
  getCookiePolicyData,
  updateSection,
  updateLastUpdated,
  updateCookieType,
  updateBrowserInstructions,
  getPublicCookiePolicyData
} from '../controllers/shreeWebCookiePolicy.controller.js';

const router = express.Router();

// Public route for frontend
router.get('/public', getPublicCookiePolicyData);

// CMS routes (protected)
router.get('/', getCookiePolicyData);
router.put('/section/:section', updateSection);
router.put('/last-updated', updateLastUpdated);
router.put('/cookie-type/:type', updateCookieType);
router.put('/browser-instructions', updateBrowserInstructions);

export default router;