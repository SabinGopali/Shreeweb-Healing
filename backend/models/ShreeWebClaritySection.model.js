import mongoose from 'mongoose';

const shreeWebClaritySectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Restore clarity.'
  },
  subtitle: {
    type: String,
    required: true,
    default: 'Expand naturally.'
  },
  description: {
    type: String,
    required: true,
    default: 'Take the first step towards untangling the energetic knots holding you back. Let\'s explore what\'s possible when you are fully aligned.'
  },
  buttonText: {
    type: String,
    required: true,
    default: 'Book a Discovery Call'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShreeWebAdmin'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShreeWebAdmin'
  }
}, {
  timestamps: true
});

// Index for efficient queries
shreeWebClaritySectionSchema.index({ createdAt: 1 });

const ShreeWebClaritySection = mongoose.model('ShreeWebClaritySection', shreeWebClaritySectionSchema);

export default ShreeWebClaritySection;