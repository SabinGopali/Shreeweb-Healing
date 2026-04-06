import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getTermsOfServiceContent,
  updateTermsOfServiceContent,
  updateTermsOfServiceSection
} from '../controllers/shreeWebTermsOfService.controller.js';

const router = express.Router();

// Public route for frontend
router.get('/public', getTermsOfServiceContent);

// Protected routes for CMS
router.get('/', verifyToken, requireAdmin, getTermsOfServiceContent);
router.put('/', verifyToken, requireAdmin, updateTermsOfServiceContent);
router.put('/section/:section', verifyToken, requireAdmin, updateTermsOfServiceSection);

export default router;
