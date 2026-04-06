import ShreeWebAdmin from '../models/ShreeWebAdmin.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

// Generate JWT token
const generateToken = (adminId) => {
  return jwt.sign(
    { adminId, type: 'shreeweb_admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new admin (temporary - for initial setup)
export const register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    console.log('ShreeWeb Admin Registration Attempt:', { username, email, timestamp: new Date().toISOString() });

    // Validate input
    if (!username || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return next(errorHandler(400, 'Username, email, and password are required'));
    }

    if (password.length < 6) {
      console.log('Registration failed: Password too short');
      return next(errorHandler(400, 'Password must be at least 6 characters long'));
    }

    // Check if username already exists
    const existingUsername = await ShreeWebAdmin.findOne({ 
      username: username.toLowerCase() 
    });

    if (existingUsername) {
      console.log('Registration failed: Username already exists');
      return next(errorHandler(400, 'Username is already taken'));
    }

    // Check if email already exists
    const existingEmail = await ShreeWebAdmin.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingEmail) {
      console.log('Registration failed: Email already exists');
      return next(errorHandler(400, 'Email is already registered'));
    }

    // Create new admin
    const newAdmin = new ShreeWebAdmin({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
      role: 'super_admin', // First admin gets super_admin role
      isActive: true,
      profile: {
        firstName: firstName || username,
        lastName: lastName || ''
      },
      permissions: {
        canManageContent: true,
        canManageUsers: true,
        canManageSettings: true,
        canViewAnalytics: true
      }
    });

    await newAdmin.save();
    console.log('Admin registered successfully:', newAdmin.username);

    // Generate token
    const token = generateToken(newAdmin._id);

    // Remove password from response
    const adminResponse = {
      _id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      role: newAdmin.role,
      isActive: newAdmin.isActive,
      profile: newAdmin.profile,
      permissions: newAdmin.permissions,
      createdAt: newAdmin.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: adminResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// Login admin
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    console.log('ShreeWeb Admin Login Attempt:', { username, timestamp: new Date().toISOString() });

    // Validate input
    if (!username || !password) {
      console.log('Login failed: Missing username or password');
      return next(errorHandler(400, 'Username and password are required'));
    }

    let admin = null;
    let isMainAdmin = false;

    // First, try to find in ShreeWebAdmin collection
    admin = await ShreeWebAdmin.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });

    if (admin) {
      isMainAdmin = true;
      console.log('ShreeWeb Admin found:', { 
        id: admin._id, 
        username: admin.username, 
        email: admin.email, 
        role: admin.role,
        isActive: admin.isActive,
        isLocked: admin.isLocked
      });
    } else {
      // If not found in ShreeWebAdmin, try the main User collection for admin users
      const { default: User } = await import('../models/user.model.js');
      
      const user = await User.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() }
        ]
      });

      if (user && (user.isAdmin || user.role === 'admin' || user.role === 'superadmin')) {
        // Check password for main User
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
          console.log('Login failed: Invalid password for main user');
          return next(errorHandler(401, 'Invalid credentials'));
        }

        // Create a compatible admin object from User
        admin = {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role === 'superadmin' ? 'super_admin' : 'admin',
          isActive: true,
          isLocked: false,
          loginAttempts: 0,
          profile: {
            firstName: user.username,
            lastName: ''
          },
          permissions: {
            canManageContent: true,
            canManageUsers: user.role === 'superadmin',
            canManageSettings: true,
            canViewAnalytics: true
          },
          lastLogin: new Date(),
          save: async () => {
            // Update last login in User collection
            await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
          },
          resetLoginAttempts: async () => {}, // No-op for main users
          incLoginAttempts: async () => {} // No-op for main users
        };

        console.log('Main User with admin role found:', { 
          id: admin._id, 
          username: admin.username, 
          email: admin.email, 
          role: admin.role
        });
      }
    }

    if (!admin) {
      console.log('Login failed: Admin not found for username/email:', username);
      return next(errorHandler(401, 'Invalid credentials'));
    }

    // Check if user has valid admin role
    if (!admin.role || !['admin', 'super_admin'].includes(admin.role)) {
      console.log('Login failed: Invalid role:', admin.role);
      return next(errorHandler(403, 'Access denied. Admin privileges required'));
    }

    // For ShreeWebAdmin users, check additional constraints
    if (isMainAdmin) {
      // Check if account is locked
      if (admin.isLocked) {
        console.log('Login failed: Account is locked');
        await admin.incLoginAttempts();
        return next(errorHandler(423, 'Account is temporarily locked due to too many failed login attempts'));
      }

      // Check if account is active
      if (!admin.isActive) {
        console.log('Login failed: Account is not active');
        return next(errorHandler(403, 'Account is deactivated. Contact system administrator'));
      }

      // Verify password for ShreeWebAdmin
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        console.log('Login failed: Invalid password');
        await admin.incLoginAttempts();
        return next(errorHandler(401, 'Invalid credentials'));
      }

      console.log('Password verification successful');

      // Reset login attempts on successful login
      if (admin.loginAttempts > 0) {
        await admin.resetLoginAttempts();
        console.log('Login attempts reset');
      }
    }

    // Update last login
    await admin.save();
    console.log('Last login updated');

    // Generate token
    const token = generateToken(admin._id);

    // Remove password from response
    const adminResponse = {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      profile: admin.profile,
      permissions: admin.permissions,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };

    // Set HTTP-only cookie
    res.cookie('shreeweb_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('Login successful for admin:', admin.username);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      admin: adminResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// Logout admin
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('shreeweb_admin_token');
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// Get current admin profile
export const getProfile = async (req, res, next) => {
  try {
    let admin = null;

    // First try ShreeWebAdmin collection
    admin = await ShreeWebAdmin.findById(req.admin.adminId).select('-password -loginAttempts -lockUntil');
    
    if (!admin) {
      // Try main User collection
      const { default: User } = await import('../models/user.model.js');
      const user = await User.findById(req.admin.adminId).select('-password');
      
      if (!user) {
        return next(errorHandler(404, 'Admin not found'));
      }

      // Create compatible admin response from User
      admin = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role === 'superadmin' ? 'super_admin' : 'admin',
        isActive: true,
        profile: {
          firstName: user.username,
          lastName: '',
          phone: user.phone || '',
          avatar: user.profilePicture || ''
        },
        permissions: {
          canManageContent: true,
          canManageUsers: user.role === 'superadmin',
          canManageSettings: true,
          canViewAnalytics: true
        },
        lastLogin: user.lastLogin || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }

    res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    next(error);
  }
};

// Update admin profile
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email } = req.body;
    const adminId = req.admin.adminId;

    // Check if email is already taken by another admin
    if (email) {
      const existingAdmin = await ShreeWebAdmin.findOne({
        email: email.toLowerCase(),
        _id: { $ne: adminId }
      });

      if (existingAdmin) {
        return next(errorHandler(400, 'Email is already in use'));
      }
    }

    const updateData = {};
    if (firstName !== undefined) updateData['profile.firstName'] = firstName;
    if (lastName !== undefined) updateData['profile.lastName'] = lastName;
    if (phone !== undefined) updateData['profile.phone'] = phone;
    if (email !== undefined) updateData.email = email.toLowerCase();

    const admin = await ShreeWebAdmin.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!admin) {
      return next(errorHandler(404, 'Admin not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.adminId;

    if (!currentPassword || !newPassword) {
      return next(errorHandler(400, 'Current password and new password are required'));
    }

    if (newPassword.length < 6) {
      return next(errorHandler(400, 'New password must be at least 6 characters long'));
    }

    const admin = await ShreeWebAdmin.findById(adminId);
    if (!admin) {
      return next(errorHandler(404, 'Admin not found'));
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return next(errorHandler(400, 'Current password is incorrect'));
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Verify token (for protected routes)
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.shreeweb_admin_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(errorHandler(401, 'Access denied. No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'shreeweb_admin') {
      return next(errorHandler(401, 'Invalid token type'));
    }

    let admin = null;

    // First try to find in ShreeWebAdmin collection
    admin = await ShreeWebAdmin.findById(decoded.adminId).select('-password -loginAttempts -lockUntil');
    
    if (admin) {
      // Check ShreeWebAdmin constraints
      if (!admin.isActive) {
        return next(errorHandler(403, 'Account is deactivated'));
      }

      // Verify admin role
      if (!admin.role || !['admin', 'super_admin'].includes(admin.role)) {
        return next(errorHandler(403, 'Access denied. Admin privileges required'));
      }

      req.admin = { 
        adminId: admin._id, 
        role: admin.role, 
        permissions: admin.permissions,
        username: admin.username,
        email: admin.email
      };
    } else {
      // If not found in ShreeWebAdmin, try main User collection
      const { default: User } = await import('../models/user.model.js');
      const user = await User.findById(decoded.adminId).select('-password');
      
      if (!user) {
        return next(errorHandler(401, 'Admin not found'));
      }

      // Check if user has admin privileges
      if (!user.isAdmin && user.role !== 'admin' && user.role !== 'superadmin') {
        return next(errorHandler(403, 'Access denied. Admin privileges required'));
      }

      // Create compatible admin object
      req.admin = { 
        adminId: user._id, 
        role: user.role === 'superadmin' ? 'super_admin' : 'admin', 
        permissions: {
          canManageContent: true,
          canManageUsers: user.role === 'superadmin',
          canManageSettings: true,
          canViewAnalytics: true
        },
        username: user.username,
        email: user.email
      };
    }

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

// Check if user is super admin
export const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return next(errorHandler(403, 'Super admin access required'));
  }
  next();
};

// Check if user has admin role (admin or super_admin)
export const requireAdmin = (req, res, next) => {
  if (!req.admin.role || !['admin', 'super_admin'].includes(req.admin.role)) {
    return next(errorHandler(403, 'Admin privileges required'));
  }
  next();
};

// Check specific permissions
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin.permissions[permission]) {
      return next(errorHandler(403, `Permission required: ${permission}`));
    }
    next();
  };
};