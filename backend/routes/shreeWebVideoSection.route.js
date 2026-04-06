import express from 'express';
import {
  getVideoSection,
  updateVideoSection,
  createVideoSection,
  deleteVideoSection
} from '../controllers/shreeWebVideoSection.controller.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';

const router = express.Router();

// Public route for frontend
router.get('/public', getVideoSection);

// Protected routes for CMS (require admin authentication)
router.get('/', verifyToken, requireAdmin, getVideoSection);
router.put('/', verifyToken, requireAdmin, updateVideoSection);
router.post('/', verifyToken, requireAdmin, createVideoSection);
router.delete('/:id', verifyToken, requireAdmin, deleteVideoSection);

export default router;