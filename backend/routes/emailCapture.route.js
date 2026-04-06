import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  captureEmail,
  getAllEmailCaptures,
  deleteEmailCapture,
  updateSubscriptionStatus,
  exportEmailCaptures
} from '../controllers/emailCapture.controller.js';

const router = express.Router();

// Public route - capture email
router.post('/capture', captureEmail);

// Protected routes - require admin authentication
router.get('/', verifyToken, requireAdmin, getAllEmailCaptures);
router.delete('/:id', verifyToken, requireAdmin, deleteEmailCapture);
router.patch('/:id/subscription', verifyToken, requireAdmin, updateSubscriptionStatus);
router.get('/export', verifyToken, requireAdmin, exportEmailCaptures);

export default router;
