import mongoose from 'mongoose';

const shreeWebGrowthSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'When growth begins to feel' },
    subtitle: { type: String, default: 'heavier than it should' },

    introduction: { type: String, default: '' },
    description1: { type: String, default: '' },
    description2: { type: String, default: '' },

    signsTitle: { type: String, default: 'Signs you may recognize' },
    ctaText: { type: String, default: '' },
    ctaButtonText: { type: String, default: 'Explore a Discovery Call' },

    backgroundImage: { type: String, default: '/healing.webp' },
    overlayOpacity: { type: Number, default: 70 },

    signs: [
      {
        id: { type: String, required: true },
        text: { type: String, default: '' },
        featured: { type: Boolean, default: false },
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShreeWebGrowthSection = mongoose.model('ShreeWebGrowthSection', shreeWebGrowthSectionSchema);

export default ShreeWebGrowthSection;

