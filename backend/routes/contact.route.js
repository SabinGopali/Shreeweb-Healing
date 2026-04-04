import express from 'express';
import {
  createContact,
  getAllContacts,
  getContact,
  updateContact,
  deleteContact,
} from '../controllers/contact.controller.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/create', createContact);

// Admin routes - require authentication
router.get('/getall', verifyToken, requireAdmin, getAllContacts);
router.get('/:id', verifyToken, requireAdmin, getContact);
router.put('/:id', verifyToken, requireAdmin, updateContact);
router.delete('/:id', verifyToken, requireAdmin, deleteContact);

export default router;

