import express from 'express';
import { 
  getPublicClaritySection,
  getClaritySection,
  updateClaritySection,
  resetClaritySection
} from '../controllers/shreeWebClaritySection.controller.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicClaritySection);

// Admin routes (require authentication)
router.get('/', verifyToken, requireAdmin, getClaritySection);
router.put('/', verifyToken, requireAdmin, updateClaritySection);
router.post('/reset', verifyToken, requireAdmin, resetClaritySection);

export default router;