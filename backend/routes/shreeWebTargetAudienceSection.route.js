import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicTargetAudienceSection,
  getTargetAudienceSection,
  updateTargetAudienceSection,
} from '../controllers/shreeWebTargetAudienceSection.controller.js';

const router = express.Router();

router.get('/public', getPublicTargetAudienceSection);
router.get('/', verifyToken, requireAdmin, getTargetAudienceSection);
router.put('/', verifyToken, requireAdmin, updateTargetAudienceSection);

export default router;

