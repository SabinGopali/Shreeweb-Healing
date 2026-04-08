import mongoose from 'mongoose';

const shreeWebAboutSchema = new mongoose.Schema(
  {
    // Hero Section
    hero: {
      tag: { type: String, default: 'About' },
      title: { type: String, default: 'OMSHREEGUIDANCE' },
      subtitle: { type: String, default: 'Energy Sessions' },
      description: { type: String, default: 'A calm, structured approach to help you scan your energetic field, release what\'s stuck, and return to balance.' },
      backgroundColor: { type: String, default: 'from-[#F4EFE6] via-amber-50 to-orange-50' }
    },

    // About Me Section
    aboutMe: {
      title: { type: String, default: 'About me' },
      subtitle: { type: String, default: 'Holding space for visionaries.' },
      content: { type: String, default: 'This work didn\'t begin as something I planned — it grew quietly, through people who came to me when they needed support.\n\nAt first, it was physical — chronic pain, ongoing issues, things that felt stuck. But over time, I started noticing something more. The shifts weren\'t just in the body. They were happening in the moments that mattered.\n\nConfidence before important conversations. Clarity before big decisions. Things opening up… before they needed to. That\'s when I began to understand the deeper nature of this work.\n\nYour external reality — your business, your results, the way life responds to you — is deeply connected to your internal state. When that internal space is clear, things move differently. With more ease. More precision. Less force.\n\nWhat started as helping people heal has naturally expanded into supporting alignment, clarity, and energetic balance — especially for those who are building and leading.\n\nIt\'s not about doing more. It\'s about being clear enough to let it flow.' },
      image: { type: String, default: '' },
      imageAlt: { type: String, default: 'About me' },
      backgroundColor: { type: String, default: 'from-stone-50 to-amber-50' }
    },

    // Image Gallery Section
    imageGallery: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: 'Experience the Journey' },
      subtitle: { type: String, default: 'Moments of transformation and clarity' },
      backgroundColor: { type: String, default: '#EDE7DC' },
      images: [
        {
          url: { type: String, default: '' },
          alt: { type: String, default: 'Energy healing session' },
          caption: { type: String, default: '' },
          order: { type: Number, default: 1 }
        }
      ]
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

    // Pranic Healing Section
    pranicHealing: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: 'About Pranic Healing' },
      subtitle: { type: String, default: 'Ancient wisdom for modern transformation' },
      content: { type: String, default: 'Pranic Healing is a highly evolved and tested system of energy healing that utilizes prana to balance, harmonize and transform the body\'s energy processes. Prana is the Sanskrit word that means life-force, the invisible bio-energy or vital energy that keeps the body alive and maintains good health.\n\nThis no-touch energy healing system is based on the fundamental principle that the body has the innate ability to heal itself. Pranic Healing works on the principle that the healing process is accelerated by increasing the life force or vital energy on the affected part of the physical body.\n\nIn our sessions, we use Pranic Healing techniques to cleanse and energize your energy body, removing energetic blockages and diseased energy that may be causing physical, emotional, or mental imbalances. The result is a clearer, more balanced state that allows your natural vitality and clarity to emerge.' },
      image: { type: String, default: '' },
      imageAlt: { type: String, default: 'Pranic Healing energy work' },
      backgroundColor: { type: String, default: 'from-amber-50 to-orange-50' },
      benefits: [
        {
          title: { type: String, default: 'Physical Wellness' },
          description: { type: String, default: 'Accelerates the body\'s natural healing ability for physical ailments and chronic conditions.' },
          icon: { type: String, default: 'heart' },
          order: { type: Number, default: 1 }
        }
      ]
    },

    // Philosophy Section
    philosophy: {
      title: { type: String, default: 'The OMSHREEGUIDANCE Approach' },
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