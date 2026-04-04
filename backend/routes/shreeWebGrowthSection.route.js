import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicGrowthSection,
  getGrowthSection,
  updateGrowthSection,
} from '../controllers/shreeWebGrowthSection.controller.js';

const router = express.Router();

// Public read for Home page rendering
router.get('/public', getPublicGrowthSection);

// Protected read + update for CMS
router.get('/', verifyToken, requireAdmin, getGrowthSection);
router.put('/', verifyToken, requireAdmin, updateGrowthSection);

export default router;

