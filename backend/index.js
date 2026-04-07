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
      // Connect to MongoDB
      await connectDB();
      console.log('✓ Database connection established');
      break;
    } catch (error) {
      console.error(`✗ Database connection failed (${retries} attempts remaining):`, error.message);
      retries--;
      
      if (retries === 0) {
        console.error('✗ Failed to connect to database after multiple attempts');
        console.error('\nPlease check:');
        console.error('  1. Your internet connection');
        console.error('  2. MongoDB Atlas IP whitelist (Network Access)');
        console.error('  3. MongoDB connection string in .env file');
        console.error('  4. If using VPN/proxy, try disabling it');
        process.exit(1);
      }
      
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  // Middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
    credentials: true
  }));
  app.use(cookieParser()); // Parse cookies
  
  // Shopify webhook route - MUST come before express.json() to preserve raw body
  app.use('/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
    // Store raw body for signature verification
    req.rawBody = req.body.toString('utf8');
    // Parse the body for the controller to use
    try {
      req.body = JSON.parse(req.rawBody);
    } catch (e) {
      console.error('Failed to parse webhook body:', e);
    }
    next();
  }, shopifyWebhookRoute);
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Serve static files with proper headers for video streaming
  app.use('/uploads', (req, res, next) => {
    // Enable CORS for uploaded files
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Enable range requests for video streaming
    res.header('Accept-Ranges', 'bytes');
    
    // Set proper cache headers
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
  
  // Public user authentication routes
  app.use('/backend/auth', shreeWebUserAuthRoute);
  app.use('/backend/user', shreeWebUserAuthRoute); // Alias for backward compatibility
  
  // Email capture routes
  app.use('/backend/email-captures', emailCaptureRoute);
  
  // Email campaign routes
  app.use('/backend/email-campaigns', emailCampaignRoute);
  
  // Contact routes
  app.use('/backend/contact', contactRoute);
  
  // Booking routes
  app.use('/backend/bookings', bookingRoute);
  
  // 404 handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Route not found',
      path: req.originalUrl 
    });
  });
  
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
    console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
  });
};

// Import mongoose for health check
import mongoose from 'mongoose';

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log and exit gracefully
  process.exit(1);
});

// Start the application
startServer();