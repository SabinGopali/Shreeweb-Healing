import mongoose from 'mongoose';

const cookieTypeSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  examples: { type: [String], default: [] },
  duration: { type: String, default: '' },
  icon: { type: String, default: '' }
}, { _id: false });

const browserInstructionSchema = new mongoose.Schema({
  category: { type: String, required: true }, // 'desktop' or 'mobile'
  instructions: [{ type: String }]
}, { _id: false });

const shreeWebCookiePolicySchema = new mongoose.Schema({
  // Hero Section
  hero: {
    tag: { type: String, default: 'Cookie Policy' },
    title: { type: String, default: 'Cookie' },
    subtitle: { type: String, default: 'transparency' },
    description: { type: String, default: 'Understanding how we use cookies and similar technologies to enhance your experience on our website.' }
  },

  // Last Updated Date
  lastUpdatedDate: { type: String, default: 'March 2026' },

  // Understanding Cookies Section
  understandingCookies: {
    title: { type: String, default: 'Understanding Cookies & Similar Technologies' },
    whatAreCookies: {
      title: { type: String, default: 'What Are Cookies?' },
      description: { type: String, default: 'Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, improve your experience, and understand how you interact with our site. We use cookies responsibly and transparently.' }
    },
    cookieTypes: {
      firstParty: {
        title: { type: String, default: 'First-Party Cookies' },
        description: { type: String, default: 'Set directly by our website to remember your preferences and improve functionality.' }
      },
      session: {
        title: { type: String, default: 'Session Cookies' },
        description: { type: String, default: 'Temporary cookies that expire when you close your browser, used for essential site functions.' }
      },
      persistent: {
        title: { type: String, default: 'Persistent Cookies' },
        description: { type: String, default: 'Remain on your device for a set period to remember your preferences across visits.' }
      }
    }
  },

  // Types of Cookies We Use
  cookieTypesWeUse: {
    title: { type: String, default: 'Types of Cookies We Use' },
    essential: { type: cookieTypeSchema, default: () => ({}) },
    functional: { type: cookieTypeSchema, default: () => ({}) },
    analytics: { type: cookieTypeSchema, default: () => ({}) }
  },

  // Managing Cookie Preferences
  managingPreferences: {
    title: { type: String, default: 'Managing Your Cookie Preferences' },
    browserSettings: {
      title: { type: String, default: 'Browser Settings' },
      description: { type: String, default: 'Most browsers allow you to view, delete, and block cookies. You can usually find these settings in your browser\'s privacy or security section.' },
      note: { type: String, default: 'Note: Blocking essential cookies may affect website functionality.' }
    },
    cookieConsent: {
      title: { type: String, default: 'Cookie Consent' },
      description: { type: String, default: 'When you first visit our site, you\'ll see a cookie consent banner. You can choose which types of cookies to accept or reject.' },
      tip: { type: String, default: 'Tip: You can change your preferences at any time through our cookie settings.' }
    },
    browserInstructions: { type: [browserInstructionSchema], default: [] }
  },

  // Contact Section
  contactSection: {
    description: { type: String, default: 'Questions about our cookie practices? We\'re transparent about our approach.' },
    buttonText: { type: String, default: 'Contact Us' }
  }
}, {
  timestamps: true
});

// Default data for cookie types
shreeWebCookiePolicySchema.pre('save', function(next) {
  if (this.isNew) {
    // Initialize cookieTypesWeUse if it doesn't exist
    if (!this.cookieTypesWeUse) {
      this.cookieTypesWeUse = {};
    }

    // Set default essential cookies data
    if (!this.cookieTypesWeUse.essential || !this.cookieTypesWeUse.essential.title) {
      this.cookieTypesWeUse.essential = {
        title: 'Essential Cookies (Always Active)',
        description: 'These cookies are necessary for the website to function properly and cannot be disabled. They enable core functionality like security, network management, and accessibility.',
        examples: ['Session management', 'Security tokens', 'Load balancing', 'Form submission data'],
        duration: 'Session or up to 24 hours',
        icon: 'lock'
      };
    }

    // Set default functional cookies data
    if (!this.cookieTypesWeUse.functional || !this.cookieTypesWeUse.functional.title) {
      this.cookieTypesWeUse.functional = {
        title: 'Functional Cookies',
        description: 'These cookies remember your preferences and choices to provide a personalized experience. They help us remember your settings and improve your user experience.',
        examples: ['Language preferences', 'Theme settings', 'Form auto-fill data', 'Accessibility options'],
        duration: 'Up to 12 months',
        icon: 'settings'
      };
    }

    // Set default analytics cookies data
    if (!this.cookieTypesWeUse.analytics || !this.cookieTypesWeUse.analytics.title) {
      this.cookieTypesWeUse.analytics = {
        title: 'Analytics Cookies',
        description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.',
        examples: ['Page views and traffic', 'User journey tracking', 'Performance metrics', 'Error reporting'],
        duration: 'Up to 26 months',
        icon: 'chart'
      };
    }

    // Initialize managingPreferences if it doesn't exist
    if (!this.managingPreferences) {
      this.managingPreferences = {};
    }

    // Set default browser instructions
    if (!this.managingPreferences.browserInstructions || !this.managingPreferences.browserInstructions.length) {
      this.managingPreferences.browserInstructions = [
        {
          category: 'Desktop Browsers',
          instructions: [
            'Chrome: Settings → Privacy and Security → Cookies',
            'Firefox: Settings → Privacy & Security → Cookies',
            'Safari: Preferences → Privacy → Cookies',
            'Edge: Settings → Cookies and Site Permissions'
          ]
        },
        {
          category: 'Mobile Browsers',
          instructions: [
            'iOS Safari: Settings → Safari → Privacy & Security',
            'Android Chrome: Settings → Site Settings → Cookies',
            'Mobile Firefox: Settings → Data Management',
            'Samsung Internet: Settings → Sites and Downloads'
          ]
        }
      ];
    }
  }
  next();
});

export default mongoose.model('ShreeWebCookiePolicy', shreeWebCookiePolicySchema);