import mongoose from 'mongoose';

const shreeWebTermsOfServiceSchema = new mongoose.Schema(
  {
    // Hero Section
    hero: {
      tag: { type: String, default: 'Terms of Service' },
      title: { type: String, default: 'Clear expectations' },
      subtitle: { type: String, default: 'for your journey' },
      description: { type: String, default: 'These terms are designed to create clarity, mutual respect, and energetic integrity within this work.' }
    },

    // Last Updated
    lastUpdatedDate: { type: String, default: '6 April 2026' },

    // Introduction
    introduction: {
      description: { type: String, default: 'By accessing this website or engaging with Om Shree Guidance, you agree to the following:' }
    },

    // 1. Nature of Services
    natureOfServices: {
      title: { type: String, default: '1. Nature of Services' },
      description: { type: String, default: 'All services are conducted online and are based on subtle energy work and personal support practices.' },
      note: { type: String, default: 'This work is intended to support clarity, alignment, and energetic balance. No physical sessions are provided.' }
    },

    // 2. Scope & Expectations
    scopeExpectations: {
      title: { type: String, default: '2. Scope & Expectations' },
      description: { type: String, default: 'This work operates on an energetic and experiential level. Results may vary based on individual readiness, openness, and external factors.' },
      note: { type: String, default: 'No specific outcomes are guaranteed.' }
    },

    // 3. Not a Substitute
    notSubstitute: {
      title: { type: String, default: '3. Not a Substitute for Professional Advice' },
      description: { type: String, default: 'These services do not replace medical, psychological, legal, or financial guidance.' },
      note: { type: String, default: 'You are advised to consult a qualified professional for any such matters.' }
    },

    // 4. Personal Responsibility
    personalResponsibility: {
      title: { type: String, default: '4. Personal Responsibility' },
      description: { type: String, default: 'By engaging in this work, you acknowledge that:' },
      items: [
        { type: String, default: 'You are fully responsible for your decisions, actions, and outcomes' },
        { type: String, default: 'You are participating voluntarily and with awareness' }
      ]
    },

    // 5. Payments & Commitment
    paymentsCommitment: {
      title: { type: String, default: '5. Payments & Commitment' },
      items: [
        { type: String, default: 'All sessions must be booked in advance' },
        { type: String, default: 'Payment is required to confirm your booking' },
        { type: String, default: 'Sessions may be rescheduled up to three times' },
        { type: String, default: 'All payments are final. Refunds are not provided once a booking is confirmed.' }
      ]
    },

    // 6. Rescheduling & Missed Sessions
    reschedulingMissed: {
      title: { type: String, default: '6. Rescheduling & Missed Sessions' },
      items: [
        { type: String, default: 'A minimum of 24 hours\' notice is required for rescheduling' },
        { type: String, default: 'Missed sessions or late cancellations may not be accommodated or refunded' }
      ]
    },

    // 7. Energetic Boundaries
    energeticBoundaries: {
      title: { type: String, default: '7. Energetic Boundaries' },
      description: { type: String, default: 'This work is offered within clear energetic and professional boundaries.' },
      note: { type: String, default: 'Respect for time, space, and process is essential. Any form of misuse, disrespect, or misalignment may result in refusal or discontinuation of services.' }
    },

    // 8. Intellectual Property
    intellectualProperty: {
      title: { type: String, default: '8. Intellectual Property' },
      description: { type: String, default: 'All content, materials, and branding associated with Om Shree Guidance are protected.' },
      note: { type: String, default: 'They may not be copied, distributed, or reused without explicit permission.' }
    },

    // 9. Limitation of Liability
    limitationLiability: {
      title: { type: String, default: '9. Limitation of Liability' },
      description: { type: String, default: 'By engaging in these services, you agree that Om Shree Guidance is not liable for any direct or indirect outcomes arising from your participation.' }
    },

    // 10. Updates to Terms
    updatesToTerms: {
      title: { type: String, default: '10. Updates to Terms' },
      description: { type: String, default: 'These terms may evolve as the work expands. Continued use indicates acceptance of any updates.' }
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
shreeWebTermsOfServiceSchema.index({ isActive: 1 });
shreeWebTermsOfServiceSchema.index({ createdAt: -1 });

const ShreeWebTermsOfService = mongoose.model('ShreeWebTermsOfService', shreeWebTermsOfServiceSchema);

export default ShreeWebTermsOfService;
