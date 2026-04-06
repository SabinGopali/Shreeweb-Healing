import mongoose from 'mongoose';

const shreeWebOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['signup', 'password-reset', 'email-verification'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - MongoDB will auto-delete expired documents
  },
  attempts: {
    type: Number,
    default: 0
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
shreeWebOTPSchema.index({ email: 1, purpose: 1, isUsed: 1 });

// Static method to generate OTP
shreeWebOTPSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Static method to create OTP
shreeWebOTPSchema.statics.createOTP = async function(email, purpose, expiryMinutes = 10) {
  const otp = this.generateOTP();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  
  // Delete any existing OTPs for this email and purpose
  await this.deleteMany({ email, purpose, isUsed: false });
  
  return await this.create({
    email,
    otp,
    purpose,
    expiresAt
  });
};

// Static method to verify OTP
shreeWebOTPSchema.statics.verifyOTP = async function(email, otp, purpose) {
  const otpDoc = await this.findOne({
    email,
    otp,
    purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });
  
  if (!otpDoc) {
    return { success: false, message: 'Invalid or expired OTP' };
  }
  
  // Check attempts
  if (otpDoc.attempts >= 5) {
    return { success: false, message: 'Too many attempts. Request a new OTP' };
  }
  
  // Mark as used
  otpDoc.isUsed = true;
  await otpDoc.save();
  
  return { success: true, message: 'OTP verified successfully' };
};

// Static method to increment attempts
shreeWebOTPSchema.statics.incrementAttempts = async function(email, otp, purpose) {
  await this.updateOne(
    { email, otp, purpose, isUsed: false },
    { $inc: { attempts: 1 } }
  );
};

const ShreeWebOTP = mongoose.model('ShreeWebOTP', shreeWebOTPSchema);

export default ShreeWebOTP;
