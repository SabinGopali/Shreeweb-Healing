import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicHiddenCostSection,
  getHiddenCostSection,
  updateHiddenCostSection,
} from '../controllers/shreeWebHiddenCostSection.controller.js';

const router = express.Router();

// Public read for Home page rendering
router.get('/public', getPublicHiddenCostSection);

// Protected read + update for CMS
router.get('/', verifyToken, requireAdmin, getHiddenCostSection);
router.put('/', verifyToken, requireAdmin, updateHiddenCostSection);

export default router;

