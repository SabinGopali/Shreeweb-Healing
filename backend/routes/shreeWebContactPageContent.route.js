import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicContactPageContent,
  getContactPageContent,
  updateContactPageContent,
} from '../controllers/shreeWebContactPageContent.controller.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicContactPageContent);

// Admin routes
router.get('/', verifyToken, requireAdmin, getContactPageContent);
router.put('/', verifyToken, requireAdmin, updateContactPageContent);

export default router;

