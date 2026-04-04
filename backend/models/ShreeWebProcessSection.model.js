import mongoose from 'mongoose';

const shreeWebProcessStepSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: {
      type: String,
      enum: ['circle', 'filled-circle', 'grid', 'square', 'diamond'],
      default: 'circle',
    },
  },
  { _id: false }
);

const shreeWebProcessSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    steps: { type: [shreeWebProcessStepSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShreeWebProcessSection = mongoose.model('ShreeWebProcessSection', shreeWebProcessSectionSchema);

export default ShreeWebProcessSection;

