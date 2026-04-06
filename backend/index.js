import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST - with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Check if env vars are loaded
console.log('Environment check:');
console.log('- PORT:', process.env.PORT || 'NOT SET');
console.log('- MONGO:', process.env.MONGO ? 'SET' : 'NOT SET');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('');

import connectDB from './config/db.js';

// Import routes
import shreeWebAuthRoute from './routes/shreeWebAuth.route.js';
import shreeWebCMSRoute from './routes/shreeWebCMS.route.js';
import shreeWebHeroRoute from './routes/shreeWebHero.route.js';
import shreeWebOfferingRoute from './routes/shreeWebOffering.route.js';
import shreeWebClaritySectionRoute from './routes/shreeWebClaritySection.route.js';
import shreeWebSocialServicesRoute from './routes/shreeWebSocialServices.route.js';
import shreeWebVideoSectionRoute from './routes/shreeWebVideoSection.route.js';
import shreeWebHiddenCostSectionRoute from './routes/shreeWebHiddenCostSection.route.js';
import shreeWebGrowthSectionRoute from './routes/shreeWebGrowthSection.route.js';
import shreeWebProcessSectionRoute from './routes/shreeWebProcessSection.route.js';
import shreeWebTargetAudienceSectionRoute from './routes/shreeWebTargetAudienceSection.route.js';
import shreeWebEmailCaptureSectionRoute from './routes/shreeWebEmailCaptureSection.route.js';
import shreeWebTestimonialsEnhancedRoute from './routes/shreeWebTestimonialsEnhanced.route.js';
import shreeWebNavigationMenusRoute from './routes/shreeWebNavigationMenus.route.js';
import shreeWebContactPageContentRoute from './routes/shreeWebContactPageContent.route.js';
import shreeWebAboutRoute from './routes/shreeWebAbout.route.js';
import shreeWebPrivacyPolicyRoute from './routes/shreeWebPrivacyPolicy.route.js';
import shreeWebCookiePolicyRoute from './routes/shreeWebCookiePolicy.route.js';
import shreeWebTermsOfServiceRoute from './routes/shreeWebTermsOfService.route.js';
import shreeWebOverviewRoute from './routes/shreeWebOverview.route.js';
import shreeWebSettingsRoute from './routes/shreeWebSettings.route.js';
import shreeWebNotificationRoute from './routes/shreeWebNotification.route.js';
import shreeWebUserAuthRoute from './routes/shreeWebUserAuth.route.js';
import emailCaptureRoute from './routes/emailCapture.route.js';
import emailCampaignRoute from './routes/emailCampaign.routes.js';
import contactRoute from './routes/contact.route.js';
import shopifyWebhookRoute from './routes/shopifyWebhook.route.js';
import bookingRoute from './routes/booking.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection with retry logic
const startServer = async () => {
  let retries = 5;
  
  while (retries) {
    try {
      await connectDB();
      console.log('✓ Database connection established');
      break;
    } catch (error) {
      console.error(`✗ Database connection failed (${retries} attempts remaining):`, error.message);
      retries--;
      
      if (retries === 0) {
        console.error('✗ Failed to connect to database after multiple attempts');
        process.exit(1);
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  // CORS middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }));
  
  app.use(cookieParser());
  
  // Shopify webhook route - MUST come before express.json() to preserve raw body
  app.use('/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
    req.rawBody = req.body.toString('utf8');
    next();
  }, shopifyWebhookRoute);
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Serve static files with proper headers for video streaming
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Accept-Ranges', 'bytes');
    res.header('Cache-Control', 'public, max-age=31536000');
    next();
  }, express.static(path.join(__dirname, 'uploads')));
  
  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
  });
  
  // Test endpoint
  app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Node.js backend!' });
  });
  
  // API Routes
  app.use('/backend/shreeweb-auth', shreeWebAuthRoute);
  app.use('/backend/shreeweb-cms', shreeWebCMSRoute);
  app.use('/backend/shreeweb-hero', shreeWebHeroRoute);
  app.use('/backend/shreeweb-offerings', shreeWebOfferingRoute);
  app.use('/backend/shreeweb-clarity-section', shreeWebClaritySectionRoute);
  app.use('/backend/shreeweb-social-services', shreeWebSocialServicesRoute);
  app.use('/backend/shreeweb-video-section', shreeWebVideoSectionRoute);
  app.use('/backend/shreeweb-hidden-cost-section', shreeWebHiddenCostSectionRoute);
  app.use('/backend/shreeweb-growth-section', shreeWebGrowthSectionRoute);
  app.use('/backend/shreeweb-process-section', shreeWebProcessSectionRoute);
  app.use('/backend/shreeweb-target-audience-section', shreeWebTargetAudienceSectionRoute);
  app.use('/backend/shreeweb-email-capture-section', shreeWebEmailCaptureSectionRoute);
  app.use('/backend/shreeweb-testimonials-enhanced', shreeWebTestimonialsEnhancedRoute);
  app.use('/backend/shreeweb-navigation-menus', shreeWebNavigationMenusRoute);
  app.use('/backend/shreeweb-contact-page', shreeWebContactPageContentRoute);
  app.use('/backend/shreeweb-about', shreeWebAboutRoute);
  app.use('/backend/shreeweb-privacy-policy', shreeWebPrivacyPolicyRoute);
  app.use('/backend/shreeweb-cookie-policy', shreeWebCookiePolicyRoute);
  app.use('/backend/shreeweb-terms-of-service', shreeWebTermsOfServiceRoute);
  app.use('/backend/shreeweb-overview', shreeWebOverviewRoute);
  app.use('/backend/shreeweb-settings', shreeWebSettingsRoute);
  app.use('/backend/shreeweb-notifications', shreeWebNotificationRoute);
  app.use('/backend/auth', shreeWebUserAuthRoute);
  app.use('/backend/user', shreeWebUserAuthRoute);
  app.use('/backend/email-captures', emailCaptureRoute);
  app.use('/backend/email-campaigns', emailCampaignRoute);
  app.use('/backend/contact', contactRoute);
  app.use('/backend/bookings', bookingRoute);
  
  // ========== SERVE FRONTEND IN PRODUCTION ==========
  if (process.env.NODE_ENV === 'production') {
    // Serve static files from the 'public' directory (where frontend builds to)
    app.use(express.static(path.join(__dirname, 'public')));
    
    // For any route that doesn't start with /backend or /api, serve index.html
    app.get('*', (req, res) => {
      // Skip API and backend routes
      if (req.path.startsWith('/backend') || req.path.startsWith('/api') || req.path.startsWith('/webhook')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      // Serve the React app
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  } else {
    // Development mode - helpful message
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/backend') && !req.path.startsWith('/api') && !req.path.startsWith('/webhook')) {
        res.status(200).json({ 
          message: 'Frontend not served in development mode',
          instruction: 'Run: cd shreeweb && npm run dev',
          frontendUrl: 'http://localhost:5173'
        });
      }
    });
  }
  
  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
      error: 'Something went wrong!',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
  
  // Start server
  app.listen(PORT, () => {
    console.log(`\n✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`✓ Frontend available at http://localhost:${PORT}/shreeweb/home`);
    }
  });
};

import mongoose from 'mongoose';

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();