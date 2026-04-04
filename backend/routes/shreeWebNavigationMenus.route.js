import express from 'express';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';
import {
  getPublicNavigationMenus,
  getNavigationMenus,
  updateNavbarItems,
  updateFooterItems,
} from '../controllers/shreeWebNavigationMenus.controller.js';

const router = express.Router();

router.get('/public', getPublicNavigationMenus);
router.get('/', verifyToken, requireAdmin, getNavigationMenus);
router.put('/navbar', verifyToken, requireAdmin, updateNavbarItems);
router.put('/footer', verifyToken, requireAdmin, updateFooterItems);

export default router;

