import express from 'express';
import {
  getLoginSettings,
  getAdminLoginSettings,
  updateLoginSettings,
  resetLoginSettings
} from '../controllers/shreeWebLoginSettings.controller.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';

const router = express.Router();

// Public route - get login settings for login page
router.get('/settings', getLoginSettings);

// Admin routes - require authentication
router.get('/admin/settings', verifyToken, requireAdmin, getAdminLoginSettings);
router.put('/admin/settings', verifyToken, requireAdmin, updateLoginSettings);
router.post('/admin/settings/reset', verifyToken, requireAdmin, resetLoginSettings);

export default router;