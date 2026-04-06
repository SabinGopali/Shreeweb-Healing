import mongoose from 'mongoose';

const shreeWebHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'OMSHREEGUIDANCE'
  },
  subtitle: {
    type: String,
    required: true,
    default: 'Energetic alignment for sustainable expansion'
  },
  ctaText: {
    type: String,
    required: true,
    default: 'Begin Your Journey'
  },
  backgroundType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  backgroundImage: {
    type: String,
    default: '/healing.webp'
  },
  backgroundVideo: {
    type: String,
    default: ''
  },
  overlayOpacity: {
    type: Number,
    min: 0,
    max: 80,
    default: 20
  },
  titleSize: {
    type: String,
    enum: ['text-6xl md:text-7xl', 'text-7xl md:text-8xl', 'text-8xl md:text-9xl', 'text-9xl md:text-10xl'],
    default: 'text-8xl md:text-9xl'
  },
  titleColor: {
    type: String,
    default: 'text-white'
  },
  subtitleColor: {
    type: String,
    default: 'text-white/80'
  },
  ctaStyle: {
    type: String,
    enum: ['transparent', 'gradient', 'solid'],
    default: 'transparent'
  },
  isActive: {
    type: Boolean,
    default: true
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

// Ensure only one active hero section at a time
shreeWebHeroSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

const ShreeWebHero = mongoose.model('ShreeWebHero', shreeWebHeroSchema);

export default ShreeWebHero;