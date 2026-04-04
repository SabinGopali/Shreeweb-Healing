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
    lastUpdatedDate: { type: String, default: 'March 2026' },

    // Information Collection Section
    informationCollection: {
      title: { type: String, default: 'Information We Collect' },
      personalInfo: {
        title: { type: String, default: 'Personal Information' },
        items: [
          { type: String, default: 'Name and contact information (email, phone number)' },
          { type: String, default: 'Demographic information (age, location if relevant to services)' },
          { type: String, default: 'Session preferences and wellness goals' },
          { type: String, default: 'Payment information (processed securely through third-party providers)' }
        ]
      },
      sessionInfo: {
        title: { type: String, default: 'Session Information' },
        items: [
          { type: String, default: 'Intake form responses and wellness assessments' },
          { type: String, default: 'Session notes and progress tracking (with your consent)' },
          { type: String, default: 'Booking history and scheduling preferences' },
          { type: String, default: 'Communication records related to your sessions' }
        ]
      },
      technicalInfo: {
        title: { type: String, default: 'Technical Information' },
        items: [
          { type: String, default: 'Website usage data and analytics' },
          { type: String, default: 'Device information and browser type' },
          { type: String, default: 'IP address and general location data' },
          { type: String, default: 'Cookies and similar tracking technologies' }
        ]
      }
    },

    // How We Use Information Section
    howWeUse: {
      title: { type: String, default: 'How We Use Your Information' },
      serviceDelivery: {
        title: { type: String, default: 'Service Delivery' },
        items: [
          { type: String, default: 'Schedule and conduct energetic alignment sessions' },
          { type: String, default: 'Provide personalized wellness recommendations' },
          { type: String, default: 'Track progress and session outcomes' },
          { type: String, default: 'Send appointment reminders and follow-ups' }
        ]
      },
      communication: {
        title: { type: String, default: 'Communication' },
        items: [
          { type: String, default: 'Respond to inquiries and support requests' },
          { type: String, default: 'Send service updates and wellness tips' },
          { type: String, default: 'Share relevant educational content' },
          { type: String, default: 'Notify about new offerings or schedule changes' }
        ]
      },
      businessOps: {
        title: { type: String, default: 'Business Operations' },
        items: [
          { type: String, default: 'Process payments and manage billing' },
          { type: String, default: 'Maintain accurate client records' },
          { type: String, default: 'Improve service quality and offerings' },
          { type: String, default: 'Comply with legal and regulatory requirements' }
        ]
      },
      websiteEnhancement: {
        title: { type: String, default: 'Website Enhancement' },
        items: [
          { type: String, default: 'Analyze website usage and performance' },
          { type: String, default: 'Optimize user experience and navigation' },
          { type: String, default: 'Troubleshoot technical issues' },
          { type: String, default: 'Develop new features and functionality' }
        ]
      }
    },

    // Data Sharing Section
    dataSharing: {
      title: { type: String, default: 'Information Sharing & Disclosure' },
      commitment: {
        title: { type: String, default: 'Our Commitment' },
        description: { type: String, default: 'We never sell, rent, or trade your personal information to third parties for marketing purposes. Your privacy and trust are fundamental to our practice.' }
      },
      serviceProviders: {
        title: { type: String, default: 'Service Providers' },
        description: { type: String, default: 'We may share information with trusted service providers (payment processors, scheduling platforms) who assist in delivering our services under strict confidentiality agreements.' }
      },
      legalRequirements: {
        title: { type: String, default: 'Legal Requirements' },
        description: { type: String, default: 'We may disclose information when required by law, court order, or to protect the rights, property, or safety of our practice, clients, or others.' }
      },
      businessTransfers: {
        title: { type: String, default: 'Business Transfers' },
        description: { type: String, default: 'In the unlikely event of a business sale or merger, client information may be transferred to the new entity under the same privacy protections.' }
      }
    },

    // Data Security Section
    dataSecurity: {
      title: { type: String, default: 'Data Security & Retention' },
      securityMeasures: {
        title: { type: String, default: 'Security Measures' },
        items: [
          { type: String, default: 'SSL encryption for data transmission' },
          { type: String, default: 'Secure cloud storage with access controls' },
          { type: String, default: 'Regular security audits and updates' },
          { type: String, default: 'Limited access on a need-to-know basis' }
        ]
      },
      retentionPeriods: {
        title: { type: String, default: 'Retention Periods' },
        items: [
          { type: String, default: 'Active client records: Duration of relationship + 7 years' },
          { type: String, default: 'Payment information: As required by law' },
          { type: String, default: 'Website analytics: 26 months maximum' },
          { type: String, default: 'Marketing communications: Until unsubscribed' }
        ]
      }
    },

    // Privacy Rights Section
    privacyRights: {
      title: { type: String, default: 'Your Privacy Rights' },
      accessPortability: {
        title: { type: String, default: 'Access & Portability' },
        description: { type: String, default: 'Request a copy of your personal information in a commonly used format.' },
        responseTime: { type: String, default: 'Within 30 days' }
      },
      correction: {
        title: { type: String, default: 'Correction & Updates' },
        description: { type: String, default: 'Request corrections to inaccurate or incomplete personal information.' },
        responseTime: { type: String, default: 'Within 30 days' }
      },
      deletion: {
        title: { type: String, default: 'Deletion' },
        description: { type: String, default: 'Request deletion of your personal information (subject to legal retention requirements).' },
        responseTime: { type: String, default: 'Within 30 days' }
      },
      optOut: {
        title: { type: String, default: 'Opt-Out' },
        description: { type: String, default: 'Unsubscribe from marketing communications or withdraw consent for certain data processing.' },
        responseTime: { type: String, default: 'Immediately' }
      },
      exerciseRights: {
        title: { type: String, default: 'How to Exercise Your Rights' },
        description: { type: String, default: 'Contact us through our contact page or email us directly. We may need to verify your identity before processing certain requests to protect your privacy and security.' }
      }
    },

    // International Compliance Section
    internationalCompliance: {
      title: { type: String, default: 'International Users & Compliance' },
      gdpr: {
        title: { type: String, default: 'GDPR Compliance' },
        description: { type: String, default: 'For users in the European Union, we comply with the General Data Protection Regulation (GDPR) and provide additional rights including data portability and the right to be forgotten.' }
      },
      ccpa: {
        title: { type: String, default: 'CCPA Compliance' },
        description: { type: String, default: 'For California residents, we comply with the California Consumer Privacy Act (CCPA) and provide additional rights regarding personal information disclosure and sale.' }
      }
    },

    // Contact Section
    contactSection: {
      title: { type: String, default: 'Contact Our Privacy Team' },
      generalQuestions: {
        title: { type: String, default: 'General Privacy Questions' },
        description: { type: String, default: 'For questions about this privacy policy or our data practices, please reach out through our contact page.' }
      },
      dataProtectionOfficer: {
        title: { type: String, default: 'Data Protection Officer' },
        description: { type: String, default: 'For formal privacy complaints or data protection concerns, you may contact our designated privacy officer.' },
        responseTime: { type: String, default: 'Within 72 hours for urgent matters' }
      },
      footerText: { type: String, default: 'Questions about our privacy practices? We\'re here to help.' }
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