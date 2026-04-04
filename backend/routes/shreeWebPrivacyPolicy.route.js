import express from 'express';
import {
  getPrivacyPolicyContent,
  updatePrivacyPolicyContent,
  updatePrivacyPolicySection
} from '../controllers/shreeWebPrivacyPolicy.controller.js';

const router = express.Router();

// Get privacy policy content
router.get('/', getPrivacyPolicyContent);

// Update entire privacy policy content
router.put('/', updatePrivacyPolicyContent);

// Update specific section
router.put('/section/:section', updatePrivacyPolicySection);

export default router;