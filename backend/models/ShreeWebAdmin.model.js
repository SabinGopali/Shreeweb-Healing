import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const shreeWebAdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String
  },
  permissions: {
    canManageContent: { type: Boolean, default: true },
    canManageUsers: { type: Boolean, default: false },
    canManageSettings: { type: Boolean, default: true },
    canViewAnalytics: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Virtual for account lock status
shreeWebAdminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
shreeWebAdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
shreeWebAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

// Method to increment login attempts
shreeWebAdminSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
shreeWebAdminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Static method to get reasons for authentication failure
shreeWebAdminSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2,
  ACCOUNT_LOCKED: 3,
  ACCOUNT_INACTIVE: 4
};

const ShreeWebAdmin = mongoose.model('ShreeWebAdmin', shreeWebAdminSchema);

export default ShreeWebAdmin;