import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: '' }, // stored as TipTap HTML
    role: { type: String, default: '' }, // stored as TipTap HTML (optional)
    quote: { type: String, default: '' }, // stored as TipTap HTML
    rating: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    sectionTitle: { type: String, default: 'What People Are Saying' }, // TipTap HTML
    sectionDescription: {
      type: String,
      default: 'A few words from people who chose alignment for sustainable growth.',
    }, // TipTap HTML
    initialVisible: { type: Number, default: 3, min: 1, max: 20 },
    loadMoreText: { type: String, default: 'Load More Stories' },
    backgroundColor: { type: String, default: '#EDE7DC' },
  },
  { _id: false }
);

const shreeWebTestimonialsEnhancedSchema = new mongoose.Schema(
  {
    settings: { type: settingsSchema, default: () => ({}) },
    testimonials: { type: [testimonialSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShreeWebTestimonialsEnhanced = mongoose.model(
  'ShreeWebTestimonialsEnhanced',
  shreeWebTestimonialsEnhancedSchema
);

export default ShreeWebTestimonialsEnhanced;

