import express from 'express';
import upload from '../middleware/multer.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import { uploadCmsImage } from '../controllers/pageCMS.controller.js';

const router = express.Router();

// Apply ShreeWeb authentication middleware
router.use(verifyToken);
router.use(requireAdmin);

// Upload endpoint for ShreeWeb CMS
router.post('/upload-image', upload.single('pageCmsImage'), uploadCmsImage);

export default router;