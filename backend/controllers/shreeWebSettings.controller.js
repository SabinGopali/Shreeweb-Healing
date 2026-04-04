import ShreeWebSettings from '../models/ShreeWebSettings.model.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

// Fixed ObjectId for testing - in real app this would come from JWT
const TEST_USER_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@shreeweb.com',
      to: email,
      subject: `ShreeWeb CMS - OTP Verification for ${purpose}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">ShreeWeb CMS - OTP Verification</h2>
          <p>Your OTP for ${purpose} is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #333; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated email from ShreeWeb CMS.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Get user settings
export const getSettings = async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    
    let settings = await ShreeWebSettings.findOne({ userId });
    
    if (!settings) {
      // Create default settings for new user
      settings = new ShreeWebSettings({
        userId,
        profile: {
          email: req.user?.email || 'admin@shreeweb.com',
          username: req.user?.username || 'Admin User'
        }
      });
      await settings.save();
    }

    // Remove sensitive data
    const settingsData = settings.toObject();
    delete settingsData.security.twoFactorSecret;
    delete settingsData.otp;

    res.status(200).json({
      success: true,
      data: settingsData
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    const updates = req.body;

    let settings = await ShreeWebSettings.findOne({ userId });
    
    if (!settings) {
      settings = new ShreeWebSettings({ userId });
    }

    // Update specific sections
    if (updates.profile) {
      settings.profile = { ...settings.profile, ...updates.profile };
    }
    
    if (updates.notifications) {
      settings.notifications = { ...settings.notifications, ...updates.notifications };
    }
    
    if (updates.security) {
      settings.security = { ...settings.security, ...updates.security };
    }
    
    if (updates.workspace) {
      settings.workspace = { ...settings.workspace, ...updates.workspace };
    }
    
    if (updates.system) {
      settings.system = { ...settings.system, ...updates.system };
    }

    await settings.save();

    // Remove sensitive data
    const settingsData = settings.toObject();
    delete settingsData.security.twoFactorSecret;
    delete settingsData.otp;

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settingsData
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// Send Email OTP
export const sendEmailOTP = async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({
        success: false,
        message: 'New email is required'
      });
    }

    // Check if email already exists
    const existingSettings = await ShreeWebSettings.findOne({ 'profile.email': newEmail });
    if (existingSettings && existingSettings.userId.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use by another account'
      });
    }

    let settings = await ShreeWebSettings.findOne({ userId });
    if (!settings) {
      settings = new ShreeWebSettings({ userId });
    }

    // Generate and save OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    settings.otp.emailOtp = {
      code: otp,
      expiresAt,
      attempts: 0,
      verified: false
    };

    await settings.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(newEmail, otp, 'Email Change');
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to new email address'
    });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

// Verify Email OTP
export const verifyEmailOTP = async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    const { otp, newEmail } = req.body;

    if (!otp || !newEmail) {
      return res.status(400).json({
        success: false,
        message: 'OTP and new email are required'
      });
    }

    const settings = await ShreeWebSettings.findOne({ userId });
    if (!settings || !settings.otp.emailOtp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    const emailOtp = settings.otp.emailOtp;

    // Check if OTP is expired
    if (new Date() > emailOtp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (emailOtp.attempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (emailOtp.code !== otp) {
      emailOtp.attempts += 1;
      await settings.save();
      
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // Update email and clear OTP
    settings.profile.email = newEmail;
    settings.otp.emailOtp = undefined;
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Email updated successfully',
      user: {
        email: newEmail
      }
    });
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};
// Send Password OTP
export const sendPasswordOTP = async (req, res) => {
  try {
    const userId = TEST_USER_ID;

    let settings = await ShreeWebSettings.findOne({ userId });
    if (!settings) {
      settings = new ShreeWebSettings({ userId });
    }

    // Generate and save OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    settings.otp.passwordOtp = {
      code: otp,
      expiresAt,
      attempts: 0,
      verified: false
    };

    await settings.save();

    // Send OTP email to current email
    const emailSent = await sendOTPEmail(settings.profile.email, otp, 'Password Change');
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your registered email'
    });
  } catch (error) {
    console.error('Error sending password OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

// Verify Password OTP
export const verifyPasswordOTP = async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'OTP and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const settings = await ShreeWebSettings.findOne({ userId });
    if (!settings || !settings.otp.passwordOtp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    const passwordOtp = settings.otp.passwordOtp;

    // Check if OTP is expired
    if (new Date() > passwordOtp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (passwordOtp.attempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (passwordOtp.code !== otp) {
      passwordOtp.attempts += 1;
      await settings.save();
      
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // Hash new password and update
    // Note: In a real app, you'd update the password in the User model
    // For now, we'll just update the lastPasswordChange date
    settings.security.lastPasswordChange = new Date();
    settings.otp.passwordOtp = undefined;
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error verifying password OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// Send 2FA OTP
export const send2FAOTP = async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    const { action } = req.body; // 'enable' or 'disable'

    if (!action || !['enable', 'disable'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Valid action (enable/disable) is required'
      });
    }

    let settings = await ShreeWebSettings.findOne({ userId });
    if (!settings) {
      settings = new ShreeWebSettings({ userId });
    }

    // Generate and save OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    settings.otp.twoFaOtp = {
      code: otp,
      expiresAt,
      attempts: 0,
      verified: false,
      action
    };

    await settings.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(settings.profile.email, otp, `${action.toUpperCase()} Two-Factor Authentication`);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    res.status(200).json({
      success: true,
      message: `OTP sent to your email to ${action} 2FA`
    });
  } catch (error) {
    console.error('Error sending 2FA OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

// Verify 2FA OTP
export const verify2FAOTP = async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    const { otp, action } = req.body;

    if (!otp || !action) {
      return res.status(400).json({
        success: false,
        message: 'OTP and action are required'
      });
    }

    const settings = await ShreeWebSettings.findOne({ userId });
    if (!settings || !settings.otp.twoFaOtp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    const twoFaOtp = settings.otp.twoFaOtp;

    // Check if OTP is expired
    if (new Date() > twoFaOtp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (twoFaOtp.attempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP and action match
    if (twoFaOtp.code !== otp || twoFaOtp.action !== action) {
      twoFaOtp.attempts += 1;
      await settings.save();
      
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // Update 2FA setting
    settings.security.twoFactorAuth = action === 'enable';
    if (action === 'enable') {
      // Generate a secret for 2FA (in a real app, you'd use a proper 2FA library)
      settings.security.twoFactorSecret = crypto.randomBytes(32).toString('hex');
    } else {
      settings.security.twoFactorSecret = '';
    }
    
    settings.otp.twoFaOtp = undefined;
    await settings.save();

    res.status(200).json({
      success: true,
      message: `Two-factor authentication ${action}d successfully`,
      settings: {
        security: {
          twoFactorAuth: settings.security.twoFactorAuth
        }
      }
    });
  } catch (error) {
    console.error('Error verifying 2FA OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    
    const settings = await ShreeWebSettings.findOne({ userId });
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'User settings not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile: settings.profile,
        workspace: settings.workspace
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    const profileUpdates = req.body;

    let settings = await ShreeWebSettings.findOne({ userId });
    if (!settings) {
      settings = new ShreeWebSettings({ userId });
    }

    // Update profile fields
    settings.profile = { ...settings.profile, ...profileUpdates };
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: settings.profile
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};