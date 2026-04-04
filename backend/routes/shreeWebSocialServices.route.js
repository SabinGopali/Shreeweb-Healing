import express from 'express';
import { 
  getPublicSocialServices,
  getSocialServices,
  updateSocialServices,
  resetSocialServices
} from '../controllers/shreeWebSocialServices.controller.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicSocialServices);

// Admin routes (require authentication)
router.get('/', verifyToken, requireAdmin, getSocialServices);
router.put('/', verifyToken, requireAdmin, updateSocialServices);
router.post('/reset', verifyToken, requireAdmin, resetSocialServices);

export default router;