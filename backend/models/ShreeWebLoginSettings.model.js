import mongoose from 'mongoose';

const shreeWebLoginSettingsSchema = new mongoose.Schema({
  // Brand Information
  brandName: {
    type: String,
    default: 'OMSHREEGUIDANCE Studio',
    required: true,
    trim: true
  },
  brandInitial: {
    type: String,
    default: 'J',
    required: true,
    maxlength: 3,
    trim: true
  },
  subtitle: {
    type: String,
    default: 'CMS Administrator Access',
    required: true,
    trim: true
  },
  
  // Logo and Branding
  logoUrl: {
    type: String,
    default: null
  },
  
  // Color Scheme
  primaryColor: {
    type: String,
    default: '#f59e0b', // amber-500
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  },
  secondaryColor: {
    type: String,
    default: '#ea580c', // orange-600
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  },
  backgroundColor: {
    type: String,
    default: 'from-amber-50 via-orange-50 to-yellow-50',
    required: true
  },
  
  // Content
  welcomeMessage: {
    type: String,
    default: 'Welcome back! Please sign in to access the CMS.',
    trim: true
  },
  footerText: {
    type: String,
    default: 'Back to Website',
    trim: true
  },
  
  // Form Labels
  usernameLabel: {
    type: String,
    default: 'Username or Email',
    required: true,
    trim: true
  },
  passwordLabel: {
    type: String,
    default: 'Password',
    required: true,
    trim: true
  },
  loginButtonText: {
    type: String,
    default: 'Sign In to CMS',
    required: true,
    trim: true
  },
  
  // Placeholders
  usernamePlaceholder: {
    type: String,
    default: 'Enter your username or email',
    trim: true
  },
  passwordPlaceholder: {
    type: String,
    default: 'Enter your password',
    trim: true
  },
  
  // Development Info
  showDevCredentials: {
    type: Boolean,
    default: true
  },
  devCredentialsTitle: {
    type: String,
    default: 'Development Admin Credentials',
    trim: true
  },
  
  // Security Messages
  roleRequirementMessage: {
    type: String,
    default: 'Only admin and super_admin roles can access this CMS!',
    trim: true
  },
  securityWarning: {
    type: String,
    default: 'Change these credentials in production!',
    trim: true
  },
  
  // Loading Messages
  loadingText: {
    type: String,
    default: 'Loading...',
    trim: true
  },
  signingInText: {
    type: String,
    default: 'Signing In...',
    trim: true
  },
  
  // Meta Information
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShreeWebAdmin'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
shreeWebLoginSettingsSchema.index({}, { unique: true });

// Update lastUpdated on save
shreeWebLoginSettingsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const ShreeWebLoginSettings = mongoose.model('ShreeWebLoginSettings', shreeWebLoginSettingsSchema);

export default ShreeWebLoginSettings;