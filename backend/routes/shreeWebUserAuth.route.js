import express from 'express';
import {
  signup,
  verifyOTP,
  login,
  googleAuth,
  logout,
  getCurrentUser,
  verifyUserToken,
  resendOTP
} from '../controllers/shreeWebUserAuth.controller.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.post('/resend-otp', resendOTP);

// Protected routes
router.get('/me', verifyUserToken, getCurrentUser);

// Verification route
router.get('/verify', verifyUserToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    user: {
      userId: req.user.userId,
      username: req.user.username,
      email: req.user.email
    }
  });
});

export default router;
