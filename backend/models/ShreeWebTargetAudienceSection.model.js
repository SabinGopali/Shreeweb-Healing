import mongoose from 'mongoose';

const shreeWebAudienceItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    colorScheme: { type: String, enum: ['stone', 'amber', 'orange'], default: 'stone' },
    featured: { type: Boolean, default: false },
  },
  { _id: false }
);

const shreeWebTargetAudienceSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'This work is designed for' },
    subtitle: {
      type: String,
      default: 'Individuals ready to address the energetic foundations of sustainable success',
    },
    ctaQuote: {
      type: String,
      default: "Ready to explore what's possible when your energy and ambition are aligned?",
    },
    ctaText: { type: String, default: 'Start with a Discovery Call' },
    audiences: { type: [shreeWebAudienceItemSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShreeWebTargetAudienceSection = mongoose.model(
  'ShreeWebTargetAudienceSection',
  shreeWebTargetAudienceSectionSchema
);

export default ShreeWebTargetAudienceSection;

