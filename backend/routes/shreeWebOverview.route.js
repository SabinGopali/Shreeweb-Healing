import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import { getOverviewData } from '../controllers/shreeWebOverview.controller.js';

const router = express.Router();

// Admin routes - require authentication
router.get('/', verifyToken, requireAdmin, getOverviewData);

export default router;