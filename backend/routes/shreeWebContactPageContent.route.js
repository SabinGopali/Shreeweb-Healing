import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicContactPageContent,
  getContactPageContent,
  updateContactPageContent,
  uploadContactLogo,
} from '../controllers/shreeWebContactPageContent.controller.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicContactPageContent);

// Admin routes
router.get('/', verifyToken, requireAdmin, getContactPageContent);
router.put('/', verifyToken, requireAdmin, updateContactPageContent);
router.post('/logo', verifyToken, requireAdmin, upload.single('logo'), uploadContactLogo);

export default router;

