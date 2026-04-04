import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicEmailCaptureSection,
  getEmailCaptureSection,
  updateEmailCaptureSection,
} from '../controllers/shreeWebEmailCaptureSection.controller.js';

const router = express.Router();

router.get('/public', getPublicEmailCaptureSection);
router.get('/', verifyToken, requireAdmin, getEmailCaptureSection);
router.put('/', verifyToken, requireAdmin, updateEmailCaptureSection);

export default router;

