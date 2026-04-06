import mongoose from 'mongoose';

const shreeWebPrivacyPolicySchema = new mongoose.Schema(
  {
    // Hero Section
    hero: {
      tag: { type: String, default: 'Privacy Policy' },
      title: { type: String, default: 'Your data,' },
      subtitle: { type: String, default: 'handled with care' },
      description: { type: String, default: 'We are committed to protecting your privacy and handling your personal information with the utmost care and transparency.' }
    },

    // Last Updated
    lastUpdatedDate: { type: String, default: '6 April 2026' },

    // Introduction
    introduction: {
      title: { type: String, default: 'Your privacy is respected and handled with care.' },
      description: { type: String, default: 'This policy outlines how your information is collected, used, and protected when you engage with Om Shree Guidance, its website, and services.' }
    },

    // Information Collection Section
    informationCollection: {
      title: { type: String, default: '1. Information We Collect' },
      description: { type: String, default: 'When you interact with this space, you may choose to provide:' },
      items: [
        { type: String, default: 'Name' },
        { type: String, default: 'Email address' },
        { type: String, default: 'Contact details' },
        { type: String, default: 'Information shared through forms, bookings, or sessions' }
      ],
      technicalData: { type: String, default: 'In addition, limited technical data (such as browser type, device, and general usage patterns) may be collected to ensure a smooth and refined experience.' }
    },

    // How We Use Information Section
    howWeUse: {
      title: { type: String, default: '2. How Your Information Is Used' },
      description: { type: String, default: 'Your information is used with intention, only where necessary, to:' },
      items: [
        { type: String, default: 'Facilitate bookings and deliver services' },
        { type: String, default: 'Communicate regarding sessions, inquiries, or updates' },
        { type: String, default: 'Improve the overall experience and offerings' }
      ],
      optInNote: { type: String, default: 'You will only receive communication beyond service-related updates if you have explicitly opted in.' },
      noSelling: { type: String, default: 'Your information is never sold, rented, or shared for external marketing purposes.' }
    },

    // Confidentiality Section
    confidentiality: {
      title: { type: String, default: '3. Confidentiality' },
      description: { type: String, default: 'All personal information, as well as anything shared during sessions, is treated with strict confidentiality and professional discretion.' }
    },

    // Data Protection Section
    dataProtection: {
      title: { type: String, default: '4. Data Protection' },
      description: { type: String, default: 'Appropriate measures are in place to protect your data. However, as with all digital platforms, absolute security cannot be guaranteed.' }
    },

    // Third Party Services Section
    thirdPartyServices: {
      title: { type: String, default: '5. Third-Party Services' },
      description: { type: String, default: 'Trusted third-party platforms (such as payment processors or booking systems) may be used to support operations. These services operate under their own privacy policies.' }
    },

    // Your Rights Section
    yourRights: {
      title: { type: String, default: '6. Your Rights' },
      description: { type: String, default: 'You may request to:' },
      items: [
        { type: String, default: 'Access your personal data' },
        { type: String, default: 'Update or correct your information' },
        { type: String, default: 'Request deletion of your data' }
      ],
      contactEmail: { type: String, default: 'omshreeguidance@gmail.com' },
      contactNote: { type: String, default: 'For any such requests, contact:' }
    },

    // Policy Updates Section
    policyUpdates: {
      title: { type: String, default: '7. Policy Updates' },
      description: { type: String, default: 'This policy may be refined over time. Continued use of this website and services indicates acceptance of any updates.' }
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
shreeWebPrivacyPolicySchema.index({ isActive: 1 });
shreeWebPrivacyPolicySchema.index({ createdAt: -1 });

const ShreeWebPrivacyPolicy = mongoose.model('ShreeWebPrivacyPolicy', shreeWebPrivacyPolicySchema);

export default ShreeWebPrivacyPolicy;