import ShreeWebUser from '../models/ShreeWebUser.model.js';
import ShreeWebOTP from '../models/ShreeWebOTP.model.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import nodemailer from 'nodemailer';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId, type: 'shreeweb_user' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Email transporter (configure with your email service)
const createEmailTransporter = () => {
  // For development, use ethereal email or configure your SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose) => {
  try {
    const transporter = createEmailTransporter();
    
    const subject = purpose === 'signup' 
      ? 'Verify your JAPANDI account' 
      : 'Reset your JAPANDI password';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D97706;">JAPANDI - Energetic Alignment</h2>
        <p>Your verification code is:</p>
        <h1 style="background: #FEF3C7; padding: 20px; text-align: center; letter-spacing: 8px; font-size: 32px; color: #92400E;">
          ${otp}
        </h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="color: #6B7280; font-size: 12px;">
          JAPANDI - Your journey to energetic alignment and sustainable growth
        </p>
      </div>
    `;
    
    await transporter.sendMail({
      from: `"JAPANDI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html
    });
    
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

// Signup - Step 1: Create user and send OTP
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    console.log('Signup attempt:', { username, email });

    // Validate input
    if (!username || !email || !password) {
      return next(errorHandler(400, 'Username, email, and password are required'));
    }

    if (password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters long'));
    }

    // Check if username exists
    const existingUsername = await ShreeWebUser.findOne({ 
      username: username.toLowerCase() 
    });

    if (existingUsername) {
      return next(errorHandler(400, 'Username is already taken'));
    }

    // Check if email exists
    const existingEmail = await ShreeWebUser.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingEmail) {
      return next(errorHandler(400, 'Email is already registered'));
    }

    // Create user (unverified)
    const newUser = new ShreeWebUser({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
      authProvider: 'local',
      isVerified: false,
      profile: {
        firstName: username
      }
    });

    await newUser.save();
    console.log('User created (unverified):', newUser.username);

    // Generate and send OTP
    const otpDoc = await ShreeWebOTP.createOTP(email.toLowerCase(), 'signup');
    
    // Send OTP email
    const emailSent = await sendOTPEmail(email, otpDoc.otp, 'signup');
    
    if (!emailSent) {
      console.log('Email not sent (check EMAIL_USER and EMAIL_PASS in .env)');
      // For development, return OTP in response
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          success: true,
          message: 'Account created. Verification code generated.',
          otp: otpDoc.otp, // Only in development!
          email: email
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      email: email
    });

  } catch (error) {
    console.error('Signup error:', error);
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, purpose } = req.body;

    if (!email || !otp || !purpose) {
      return next(errorHandler(400, 'Email, OTP, and purpose are required'));
    }

    // Verify OTP
    const result = await ShreeWebOTP.verifyOTP(email.toLowerCase(), otp, purpose);

    if (!result.success) {
      // Increment attempts
      await ShreeWebOTP.incrementAttempts(email.toLowerCase(), otp, purpose);
      return next(errorHandler(400, result.message));
    }

    // If signup verification, mark user as verified
    if (purpose === 'signup') {
      const user = await ShreeWebUser.findOneAndUpdate(
        { email: email.toLowerCase() },
        { isVerified: true },
        { new: true }
      );

      if (!user) {
        return next(errorHandler(404, 'User not found'));
      }

      console.log('User verified:', user.username);
    }

    res.status(200).json({
      success: true,
      message: 'Verification successful'
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Validate input
    if (!email || !password) {
      return next(errorHandler(400, 'Email and password are required'));
    }

    // Find user
    const user = await ShreeWebUser.findOne({ 
      email: email.toLowerCase() 
    });

    if (!user) {
      return next(errorHandler(401, 'Invalid credentials'));
    }

    // Check if user is verified
    if (!user.isVerified) {
      return next(errorHandler(403, 'Please verify your email first'));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(errorHandler(403, 'Account is deactivated'));
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return next(errorHandler(401, 'Invalid credentials'));
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      profile: user.profile,
      authProvider: user.authProvider,
      createdAt: user.createdAt
    };

    // Set HTTP-only cookie
    res.cookie('shreeweb_user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    console.log('Login successful:', user.username);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// Google OAuth
export const googleAuth = async (req, res, next) => {
  try {
    const { name, email, googlePhotoUrl } = req.body;

    console.log('Google auth attempt:', { name, email });

    if (!email) {
      return next(errorHandler(400, 'Email is required'));
    }

    // Check if user exists
    let user = await ShreeWebUser.findOne({ email: email.toLowerCase() });

    if (user) {
      // User exists - login
      if (!user.isActive) {
        return next(errorHandler(403, 'Account is deactivated'));
      }

      // Update profile picture if changed
      if (googlePhotoUrl && user.profilePicture !== googlePhotoUrl) {
        user.profilePicture = googlePhotoUrl;
        await user.save();
      }

      await user.updateLastLogin();
    } else {
      // Create new user
      const username = email.split('@')[0].toLowerCase() + Math.random().toString(36).slice(-4);
      
      user = new ShreeWebUser({
        username,
        email: email.toLowerCase(),
        profilePicture: googlePhotoUrl,
        authProvider: 'google',
        isVerified: true, // Google accounts are pre-verified
        isActive: true,
        profile: {
          firstName: name?.split(' ')[0] || username,
          lastName: name?.split(' ').slice(1).join(' ') || ''
        }
      });

      await user.save();
      console.log('New Google user created:', user.username);
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      profile: user.profile,
      authProvider: user.authProvider,
      createdAt: user.createdAt
    };

    // Set HTTP-only cookie
    res.cookie('shreeweb_user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    console.log('Google auth successful:', user.username);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Google auth error:', error);
    next(error);
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('shreeweb_user_token');
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await ShreeWebUser.findById(req.user.userId).select('-password');
    
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Verify token middleware
export const verifyUserToken = async (req, res, next) => {
  try {
    const token = req.cookies.shreeweb_user_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(errorHandler(401, 'Access denied. No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'shreeweb_user') {
      return next(errorHandler(401, 'Invalid token type'));
    }

    const user = await ShreeWebUser.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(errorHandler(401, 'User not found'));
    }

    if (!user.isActive) {
      return next(errorHandler(403, 'Account is deactivated'));
    }

    req.user = { 
      userId: user._id, 
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(errorHandler(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(errorHandler(401, 'Token expired'));
    }
    next(error);
  }
};

// Resend OTP
export const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return next(errorHandler(400, 'Email and purpose are required'));
    }

    // Generate new OTP
    const otpDoc = await ShreeWebOTP.createOTP(email.toLowerCase(), purpose);
    
    // Send OTP email
    const emailSent = await sendOTPEmail(email, otpDoc.otp, purpose);
    
    if (!emailSent && process.env.NODE_ENV === 'development') {
      return res.status(200).json({
        success: true,
        message: 'New verification code generated',
        otp: otpDoc.otp // Only in development!
      });
    }

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    next(error);
  }
};
