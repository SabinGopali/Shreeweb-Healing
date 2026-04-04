import mongoose from 'mongoose';

const shreeWebHiddenCostSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'The Hidden cost of high performance' },
    paragraph1: {
      type: String,
      default:
        'Many successful professionals experience burnout, mental fatigue, and internal pressure despite strong strategies and discipline.',
    },
    paragraph2: {
      type: String,
      default:
        'When your energetic system is misaligned, even the most perfect business strategy feels heavy. True expansion requires more than just mindset shifts—it requires energetic capacity.',
    },
    image: { type: String, default: '/healing2.png' },
    imageAlt: { type: String, default: 'Healing and wellness imagery' },

    // These are mostly used by the CMS preview; Home currently uses the same typography.
    backgroundColor: { type: String, default: 'white' },
    textColor: { type: String, default: 'stone-800' },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShreeWebHiddenCostSection = mongoose.model(
  'ShreeWebHiddenCostSection',
  shreeWebHiddenCostSectionSchema
);

export default ShreeWebHiddenCostSection;

