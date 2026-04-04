import mongoose from 'mongoose';

const shreeWebSettingsSchema = new mongoose.Schema({
  // User Profile Settings
  profile: {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    }
  },

  // Notification Settings
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    contentUpdates: {
      type: Boolean,
      default: true
    },
    systemAlerts: {
      type: Boolean,
      default: true
    },
    backupReminders: {
      type: Boolean,
      default: true
    }
  },

  // Security Settings
  security: {
    twoFactorAuth: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: ''
    },
    sessionTimeout: {
      type: Number,
      default: 60 // minutes
    },
    requirePasswordChange: {
      type: Boolean,
      default: false
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
    }
  },

  // Workspace Settings
  workspace: {
    workspaceLabel: {
      type: String,
      default: 'Content studio'
    },
    editorNote: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    }
  },

  // System Settings
  system: {
    autoBackup: {
      type: Boolean,
      default: true
    },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    dataRetention: {
      type: Number,
      default: 90 // days
    }
  },

  // OTP Settings for verification
  otp: {
    emailOtp: {
      code: String,
      expiresAt: Date,
      attempts: { type: Number, default: 0 },
      verified: { type: Boolean, default: false }
    },
    passwordOtp: {
      code: String,
      expiresAt: Date,
      attempts: { type: Number, default: 0 },
      verified: { type: Boolean, default: false }
    },
    twoFaOtp: {
      code: String,
      expiresAt: Date,
      attempts: { type: Number, default: 0 },
      verified: { type: Boolean, default: false },
      action: String // 'enable' or 'disable'
    }
  },

  // Metadata
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'shreeweb_settings'
});

// Indexes for better performance (only define once here, not in schema fields)
shreeWebSettingsSchema.index({ userId: 1 }, { unique: true });
shreeWebSettingsSchema.index({ 'profile.email': 1 }, { unique: true });
shreeWebSettingsSchema.index({ createdAt: -1 });

// Virtual for full name
shreeWebSettingsSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
});

// Method to check if account is locked
shreeWebSettingsSchema.methods.isLocked = function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
};

// Method to increment login attempts
shreeWebSettingsSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'security.lockUntil': 1 },
      $set: { 'security.loginAttempts': 1 }
    });
  }
  
  const updates = { $inc: { 'security.loginAttempts': 1 } };
  
  // Lock account after 5 attempts for 2 hours
  if (this.security.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { 'security.lockUntil': Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
shreeWebSettingsSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { 'security.lockUntil': 1, 'security.loginAttempts': 1 }
  });
};

// Pre-save middleware to ensure default values
shreeWebSettingsSchema.pre('save', function(next) {
  // Initialize nested objects if they don't exist
  if (!this.profile) this.profile = {};
  if (!this.notifications) this.notifications = {};
  if (!this.security) this.security = {};
  if (!this.workspace) this.workspace = {};
  if (!this.system) this.system = {};
  if (!this.otp) this.otp = {};
  
  next();
});

const ShreeWebSettings = mongoose.model('ShreeWebSettings', shreeWebSettingsSchema);

export default ShreeWebSettings;