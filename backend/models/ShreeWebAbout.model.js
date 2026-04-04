import mongoose from 'mongoose';

const shreeWebAboutSchema = new mongoose.Schema(
  {
    // Hero Section
    hero: {
      tag: { type: String, default: 'About' },
      title: { type: String, default: 'JAPANDI' },
      subtitle: { type: String, default: 'Energy Sessions' },
      description: { type: String, default: 'A calm, structured approach to help you scan your energetic field, release what\'s stuck, and return to balance.' },
      backgroundColor: { type: String, default: 'from-[#F4EFE6] via-amber-50 to-orange-50' }
    },

    // What We Do Section
    whatWeDo: {
      title: { type: String, default: 'What we do' },
      description: { type: String, default: 'The sessions work with your energetic system to cleanse, balance, and strengthen internal stability. The goal is to reduce internal resistance so you can hold your success with more ease.' },
      backgroundColor: { type: String, default: '#F4EFE6' },
      services: [
        {
          title: { type: String, default: 'Scanning' },
          description: { type: String, default: 'Identify energy leaks and blocks that create friction in your daily experience.' },
          icon: { type: String, default: 'circle' },
          order: { type: Number, default: 1 }
        }
      ]
    },

    // Philosophy Section
    philosophy: {
      title: { type: String, default: 'The Japandi Approach' },
      description: { type: String, default: 'Inspired by the minimalist principles of Japanese and Scandinavian design, our approach emphasizes simplicity, natural harmony, and sustainable well-being.' },
      backgroundColor: { type: String, default: 'from-stone-50 to-amber-50' },
      principles: [
        {
          title: { type: String, default: 'Simplicity' },
          description: { type: String, default: 'We focus on what\'s essential, removing energetic clutter to reveal your natural clarity and strength.' },
          icon: { type: String, default: 'lightning' },
          order: { type: Number, default: 1 }
        }
      ]
    },

    // How to Get Started Section
    howToStart: {
      title: { type: String, default: 'How to get started' },
      description: { type: String, default: 'Your journey toward energetic alignment begins with a simple, structured process' },
      backgroundColor: { type: String, default: '#F4EFE6' },
      steps: [
        {
          number: { type: Number, default: 1 },
          title: { type: String, default: 'Choose Your Path' },
          description: { type: String, default: 'Select an offering that matches your current capacity and desired expansion.' },
          buttonText: { type: String, default: 'View Offerings' },
          buttonLink: { type: String, default: '/shreeweb/offers' },
          order: { type: Number, default: 1 }
        }
      ]
    },

    // Call to Action Section
    callToAction: {
      title: { type: String, default: 'Ready to begin?' },
      description: { type: String, default: 'Start with a complimentary Discovery Call to explore what\'s possible for you.' },
      primaryButtonText: { type: String, default: 'Schedule Discovery Call' },
      primaryButtonLink: { type: String, default: '/shreeweb/booking?plan=discovery' },
      secondaryButtonText: { type: String, default: 'View All Offerings' },
      secondaryButtonLink: { type: String, default: '/shreeweb/offers' },
      quote: { type: String, default: '"The journey of a thousand miles begins with a single step." - Lao Tzu' },
      backgroundColor: { type: String, default: 'from-stone-100 via-amber-50 to-orange-100' }
    },

    // Meta
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
shreeWebAboutSchema.index({ isActive: 1 });
shreeWebAboutSchema.index({ createdAt: -1 });

const ShreeWebAbout = mongoose.model('ShreeWebAbout', shreeWebAboutSchema);

export default ShreeWebAbout;