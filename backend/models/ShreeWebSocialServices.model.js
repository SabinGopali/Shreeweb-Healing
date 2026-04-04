import mongoose from 'mongoose';

const shreeWebSocialServicesSchema = new mongoose.Schema({
  // Social Media Links
  socialMedia: {
    facebook: {
      url: {
        type: String,
        default: '#'
      },
      enabled: {
        type: Boolean,
        default: true
      }
    },
    instagram: {
      url: {
        type: String,
        default: '#'
      },
      enabled: {
        type: Boolean,
        default: true
      }
    },
    tiktok: {
      url: {
        type: String,
        default: '#'
      },
      enabled: {
        type: Boolean,
        default: true
      }
    },
    youtube: {
      url: {
        type: String,
        default: '#'
      },
      enabled: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Main Content
  mainHeading: {
    type: String,
    required: true,
    default: 'Your next level of success may require more than strategy.'
  },
  
  description: {
    type: String,
    required: true,
    default: 'Through structured sessions using Pranic Healing, I help entrepreneurs and ambitious professionals clear energetic blockages, restore balance, and strengthen their internal capacity for growth.'
  },
  
  // Call-to-Action Buttons
  primaryButton: {
    text: {
      type: String,
      required: true,
      default: 'Schedule a Discovery Call'
    },
    enabled: {
      type: Boolean,
      default: true
    }
  },
  
  secondaryButton: {
    text: {
      type: String,
      required: true,
      default: 'Book a Session'
    },
    enabled: {
      type: Boolean,
      default: true
    }
  },
  
  // Styling Options
  styling: {
    backgroundColor: {
      type: String,
      default: '#F4EFE6'
    },
    textColor: {
      type: String,
      default: '#1C1917'
    },
    primaryButtonColor: {
      type: String,
      default: '#EA580C'
    },
    primaryButtonTextColor: {
      type: String,
      default: '#FFFFFF'
    },
    secondaryButtonColor: {
      type: String,
      default: '#F97316'
    },
    secondaryButtonTextColor: {
      type: String,
      default: '#FFFFFF'
    }
  },
  
  // Meta
  isActive: {
    type: Boolean,
    default: true
  },

  // Community Section (shown below social services)
  communitySection: {
    heading: {
      type: String,
      default: 'Join Our Community',
    },
    description: {
      type: String,
      default:
        'Connect with like-minded individuals on their journey toward energetic alignment and sustainable expansion.',
    },
    cards: {
      type: [
        new mongoose.Schema(
          {
            title: { type: String, default: '' },
            description: { type: String, default: '' },
          },
          { _id: false }
        ),
      ],
      default: [
        { title: 'Daily Insights', description: 'Gentle reminders and practices to support your energetic well-being.' },
        { title: 'Community Support', description: 'Connect with others on similar journeys of growth and transformation.' },
        { title: 'Live Sessions', description: 'Join live Q&A sessions and group practices for deeper connection.' },
      ],
    },
  },

  // Bottom CTA Section (shown below community cards)
  callToAction: {
    heading: { type: String, default: 'Ready to begin your journey?' },
    description: {
      type: String,
      default: 'Start with a complimentary Discovery Call to explore what\'s possible for you.',
    },
    buttonText: { type: String, default: 'Schedule Discovery Call' },
    buttonLink: { type: String, default: '/shreeweb/booking?plan=discovery' },
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
shreeWebSocialServicesSchema.index({ createdAt: 1 });

const ShreeWebSocialServices = mongoose.model('ShreeWebSocialServices', shreeWebSocialServicesSchema);

export default ShreeWebSocialServices;