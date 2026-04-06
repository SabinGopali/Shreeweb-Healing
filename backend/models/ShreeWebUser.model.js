import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const shreeWebUserSchema = new mongoose.Schema({
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
    minlength: 6
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    bio: String
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password (only for local auth)
shreeWebUserSchema.pre('save', async function(next) {
  // Only hash password if it's modified and exists (local auth)
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
shreeWebUserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcryptjs.compare(candidatePassword, this.password);
};

// Method to update last login
shreeWebUserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

const ShreeWebUser = mongoose.model('ShreeWebUser', shreeWebUserSchema);

export default ShreeWebUser;
