import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import { 
  getAboutContent, 
  updateAboutContent, 
  updateAboutSection 
} from '../controllers/shreeWebAbout.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAboutContent);

// Admin routes - require authentication
router.put('/', verifyToken, requireAdmin, updateAboutContent);
router.put('/section/:section', verifyToken, requireAdmin, updateAboutSection);

export default router;