import express from 'express';
import mongoose from 'mongoose';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  requireAdmin
} from '../controllers/shreeWebAuth.controller.js';
import {
  sendEmailOTP,
  verifyEmailOTP,
  sendPasswordOTP,
  verifyPasswordOTP,
  send2FAOTP,
  verify2FAOTP
} from '../controllers/shreeWebSettings.controller.js';

const router = express.Router();

// Authentication routes (no auth required)
router.post('/register', register); // Temporary registration endpoint
router.post('/login', login);
router.post('/logout', logout);

// Verification route (requires token)
router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    admin: {
      _id: req.admin.adminId,
      role: req.admin.role,
      permissions: req.admin.permissions,
      username: req.admin.username,
      email: req.admin.email
    }
  });
});

// Profile routes (requires auth)
router.get('/profile', verifyToken, requireAdmin, getProfile);
router.put('/profile', verifyToken, requireAdmin, updateProfile);

// Password change route (requires auth)
router.put('/change-password', verifyToken, requireAdmin, changePassword);

// OTP routes (requires auth)
router.post('/send-email-otp', verifyToken, requireAdmin, sendEmailOTP);
router.post('/verify-email-otp', verifyToken, requireAdmin, verifyEmailOTP);
router.post('/send-password-otp', verifyToken, requireAdmin, sendPasswordOTP);
router.post('/verify-password-otp', verifyToken, requireAdmin, verifyPasswordOTP);
router.post('/send-2fa-otp', verifyToken, requireAdmin, send2FAOTP);
router.post('/verify-2fa-otp', verifyToken, requireAdmin, verify2FAOTP);

export default router;