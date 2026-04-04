import express from 'express';
import {
  getActiveHero,
  getHero,
  updateHero,
  resetHero
} from '../controllers/shreeWebHero.controller.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveHero);

// Protected routes (require admin authentication)
router.get('/', verifyToken, requireAdmin, getHero);
router.put('/', verifyToken, requireAdmin, updateHero);
router.post('/reset', verifyToken, requireAdmin, resetHero);

export default router;