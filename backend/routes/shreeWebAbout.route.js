import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import upload from '../middleware/multer.js';
import { 
  getAboutContent, 
  updateAboutContent, 
  updateAboutSection,
  uploadGalleryImage,
  uploadMultipleGalleryImages,
  uploadAboutMeImage,
  uploadPranicHealingImage
} from '../controllers/shreeWebAbout.controller.js';

const router = express.Router();

// Public routes for frontend
router.get('/public', getAboutContent);

// Admin routes - require authentication
router.get('/', verifyToken, requireAdmin, getAboutContent);
router.put('/', verifyToken, requireAdmin, updateAboutContent);
router.put('/section/:section', verifyToken, requireAdmin, updateAboutSection);
router.post('/upload-gallery-image', verifyToken, requireAdmin, upload.single('galleryImage'), uploadGalleryImage);
router.post('/upload-multiple-gallery-images', verifyToken, requireAdmin, upload.array('galleryImages', 10), uploadMultipleGalleryImages);
router.post('/upload-about-me-image', verifyToken, requireAdmin, upload.single('aboutMeImage'), uploadAboutMeImage);
router.post('/upload-pranic-healing-image', verifyToken, requireAdmin, upload.single('pranicHealingImage'), uploadPranicHealingImage);

export default router;