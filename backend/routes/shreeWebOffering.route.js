import express from 'express';
import {
  getPublicOfferings,
  getAllOfferings,
  getOfferingById,
  createOffering,
  updateOffering,
  deleteOffering,
  toggleOfferingStatus,
  reorderOfferings,
  getOfferingsSettings,
  saveOfferingsSettings,
  getPublicOfferingsWithSettings
} from '../controllers/shreeWebOffering.controller.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicOfferings);
router.get('/public/with-settings', getPublicOfferingsWithSettings);

// Protected routes (require admin authentication)
router.get('/', verifyToken, requireAdmin, getAllOfferings);
router.get('/settings', verifyToken, requireAdmin, getOfferingsSettings);
router.post('/settings', verifyToken, requireAdmin, saveOfferingsSettings);
router.get('/:id', verifyToken, requireAdmin, getOfferingById);
router.post('/', verifyToken, requireAdmin, createOffering);
router.put('/:id', verifyToken, requireAdmin, updateOffering);
router.delete('/:id', verifyToken, requireAdmin, deleteOffering);
router.patch('/:id/toggle-status', verifyToken, requireAdmin, toggleOfferingStatus);
router.post('/reorder', verifyToken, requireAdmin, reorderOfferings);

export default router;