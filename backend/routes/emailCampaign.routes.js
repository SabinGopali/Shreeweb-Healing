import express from 'express';
import {
  getAllCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  sendTestEmail,
  getCampaignAnalytics,
  fixCampaignRecipients
} from '../controllers/emailCampaign.controller.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';

const router = express.Router();

// All routes require admin authentication
router.use(verifyToken, requireAdmin);

// Campaign CRUD
router.get('/', getAllCampaigns);
router.get('/:id', getCampaign);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

// Campaign actions
router.post('/:id/send', sendCampaign);
router.post('/:id/fix-recipients', fixCampaignRecipients);
router.post('/test-email', sendTestEmail);
router.get('/:id/analytics', getCampaignAnalytics);

export default router;
