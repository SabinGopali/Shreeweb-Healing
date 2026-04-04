import mongoose from 'mongoose';

const shreeWebEmailBenefitSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: {
      type: String,
      enum: ['clock', 'lightbulb', 'heart', 'star', 'shield', 'gift'],
      default: 'star',
    },
  },
  { _id: false }
);

const shreeWebEmailCaptureSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Stay Connected' },
    description: { type: String, default: 'Get updates when new sessions become available.' },
    subtitle: { type: String, default: 'No spam, just clarity.' },
    buttonText: { type: String, default: 'Stay Updated' },
    placeholderText: { type: String, default: 'your@email.com' },
    backgroundColor: {
      type: String,
      default: 'gradient-to-br from-stone-100 via-amber-50 to-orange-100',
    },
    benefits: { type: [shreeWebEmailBenefitSchema], default: [] },
    bottomNote: {
      type: String,
      default: 'Join a community focused on sustainable growth and energetic alignment',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShreeWebEmailCaptureSection = mongoose.model(
  'ShreeWebEmailCaptureSection',
  shreeWebEmailCaptureSectionSchema
);

export default ShreeWebEmailCaptureSection;

