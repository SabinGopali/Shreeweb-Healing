import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPrivacyPolicyContent,
  updatePrivacyPolicyContent,
  updatePrivacyPolicySection
} from '../controllers/shreeWebPrivacyPolicy.controller.js';

const router = express.Router();

// Public route for frontend
router.get('/public', getPrivacyPolicyContent);

// Protected routes for CMS
router.get('/', verifyToken, requireAdmin, getPrivacyPolicyContent);
router.put('/', verifyToken, requireAdmin, updatePrivacyPolicyContent);
router.put('/section/:section', verifyToken, requireAdmin, updatePrivacyPolicySection);

export default router;