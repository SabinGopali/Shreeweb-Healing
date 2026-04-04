import express from 'express';
import mongoose from 'mongoose';
import {
  getSettings,
  updateSettings,
  sendEmailOTP,
  verifyEmailOTP,
  sendPasswordOTP,
  verifyPasswordOTP,
  send2FAOTP,
  verify2FAOTP,
  getProfile,
  updateProfile
} from '../controllers/shreeWebSettings.controller.js';

const router = express.Router();

// Middleware to simulate authentication (replace with real auth middleware)
const authenticateUser = (req, res, next) => {
  // In a real app, you'd verify JWT token here
  req.user = {
    id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    email: 'admin@shreeweb.com',
    username: 'Admin User'
  };
  next();
};

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Settings routes
router.get('/', getSettings);
router.post('/', updateSettings);

// Profile routes
router.get('/profile', getProfile);
router.post('/profile', updateProfile);

// Email change routes
router.post('/send-email-otp', sendEmailOTP);
router.post('/verify-email-otp', verifyEmailOTP);

// Password change routes
router.post('/send-password-otp', sendPasswordOTP);
router.post('/verify-password-otp', verifyPasswordOTP);

// 2FA routes
router.post('/send-2fa-otp', send2FAOTP);
router.post('/verify-2fa-otp', verify2FAOTP);

export default router;