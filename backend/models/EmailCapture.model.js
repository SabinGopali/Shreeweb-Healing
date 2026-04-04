import mongoose from 'mongoose';

const emailCaptureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      default: 'shreeweb',
      enum: ['shreeweb', 'newsletter', 'contact_form', 'other'],
    },
    subscribed: {
      type: Boolean,
      default: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
emailCaptureSchema.index({ email: 1 }, { unique: true });
emailCaptureSchema.index({ createdAt: -1 });
emailCaptureSchema.index({ source: 1, subscribed: 1 });

const EmailCapture = mongoose.model('EmailCapture', emailCaptureSchema);

export default EmailCapture;