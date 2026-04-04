import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicTestimonialsEnhanced,
  getTestimonialsEnhanced,
  updateTestimonialsEnhancedSettings,
  createTestimonial,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/shreeWebTestimonialsEnhanced.controller.js';

const router = express.Router();

router.get('/public', getPublicTestimonialsEnhanced);

router.get('/', verifyToken, requireAdmin, getTestimonialsEnhanced);
router.put('/settings', verifyToken, requireAdmin, updateTestimonialsEnhancedSettings);

router.post('/testimonials', verifyToken, requireAdmin, createTestimonial);
router.get('/testimonials/:id', verifyToken, requireAdmin, getTestimonialById);
router.put('/testimonials/:id', verifyToken, requireAdmin, updateTestimonial);
router.delete('/testimonials/:id', verifyToken, requireAdmin, deleteTestimonial);

export default router;

