import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicNavigationMenus,
  getNavigationMenus,
  updateNavbarItems,
  updateFooterItems,
  uploadNavbarLogo,
  uploadFooterLogo,
} from '../controllers/shreeWebNavigationMenus.controller.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/public', getPublicNavigationMenus);
router.get('/', verifyToken, requireAdmin, getNavigationMenus);
router.put('/navbar', verifyToken, requireAdmin, updateNavbarItems);
router.put('/footer', verifyToken, requireAdmin, updateFooterItems);
router.post('/navbar/logo', verifyToken, requireAdmin, upload.single('logo'), uploadNavbarLogo);
router.post('/footer/logo', verifyToken, requireAdmin, upload.single('logo'), uploadFooterLogo);

export default router;

