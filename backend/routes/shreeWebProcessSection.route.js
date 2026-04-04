import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicProcessSection,
  getProcessSection,
  updateProcessSection,
} from '../controllers/shreeWebProcessSection.controller.js';

const router = express.Router();

// Public read for Home page rendering
router.get('/public', getPublicProcessSection);

// Protected read + update for CMS
router.get('/', verifyToken, requireAdmin, getProcessSection);
router.put('/', verifyToken, requireAdmin, updateProcessSection);

export default router;

