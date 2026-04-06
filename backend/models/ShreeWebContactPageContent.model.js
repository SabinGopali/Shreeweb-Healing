import mongoose from 'mongoose';

const ShreeWebContactPageContentSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },

    logo: {
      text: { type: String, default: 'OMSHREEGUIDANCE' },
      subtext: { type: String, default: 'Energetic Alignment' },
      letter: { type: String, default: 'J' },
      imageUrl: { type: String, default: '' },
    },

    hero: {
      tag: { type: String, default: 'CONTACT' },
      title: { type: String, default: "We'd love to hear from you" },
      description: {
        type: String,
        default: 'Send a message and we\'ll get back to you as soon as possible.',
      },
    },

    form: {
      heading: { type: String, default: 'Send us a message' },
    },

    connect: {
      heading: { type: String, default: 'Other ways to connect' },
      description: {
        type: String,
        default:
          'Prefer a direct message? Connect with us on social media or reach out through the contact details below.',
      },
    },

    location: {
      line1: { type: String, default: 'Kathmandu, Nepal' },
      line2: {
        type: String,
        default: '(Online sessions available worldwide)',
      },
    },

    contactInfo: {
      email: { type: String, default: 'info@OMSHREEGUIDANCE.example' },
      phone: { type: String, default: '+977-98XXXXXXXX' },
    },

    follow: {
      description: {
        type: String,
        default:
          'Stay connected and get updates on our latest offerings and insights.',
      },
      socials: {
        facebookUrl: { type: String, default: '#' },
        instagramUrl: { type: String, default: '#' },
        tiktokUrl: { type: String, default: '#' },
        youtubeUrl: { type: String, default: '#' },
      },
    },

    callToAction: {
      heading: { type: String, default: 'Ready to start your journey?' },
      description: {
        type: String,
        default: 'Book a complimentary Discovery Call to explore what\'s possible for you.',
      },
      buttonText: { type: String, default: 'Schedule Discovery Call' },
      buttonLink: { type: String, default: '/shreeweb/booking?plan=discovery' },
    },
  },
  { timestamps: true }
);

ShreeWebContactPageContentSchema.index({ createdAt: 1 });

const ShreeWebContactPageContent = mongoose.model(
  'ShreeWebContactPageContent',
  ShreeWebContactPageContentSchema
);

export default ShreeWebContactPageContent;

