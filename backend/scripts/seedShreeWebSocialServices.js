#!/usr/bin/env node

/**
 * Seed script for ShreeWeb Social Services
 * Creates initial social services data in the database
 */

import mongoose from 'mongoose';
import ShreeWebSocialServices from '../models/ShreeWebSocialServices.model.js';
import { config } from 'dotenv';

// Load environment variables
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/archphaze';

async function seedSocialServices() {
  try {
    console.log('🌱 Seeding ShreeWeb Social Services...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingData = await ShreeWebSocialServices.findOne();
    
    if (existingData) {
      console.log('📋 Social services data already exists');
      console.log('   Main Heading:', existingData.mainHeading);
      console.log('   Social Media:', Object.keys(existingData.socialMedia).filter(key => existingData.socialMedia[key].enabled));
      console.log('   Is Active:', existingData.isActive);
      
      await mongoose.disconnect();
      return;
    }

    // Create default social services data
    const defaultData = {
      socialMedia: {
        facebook: {
          url: 'https://facebook.com/yourpage',
          enabled: true
        },
        instagram: {
          url: 'https://instagram.com/yourpage',
          enabled: true
        },
        tiktok: {
          url: 'https://tiktok.com/@yourpage',
          enabled: true
        },
        youtube: {
          url: 'https://youtube.com/@yourpage',
          enabled: true
        }
      },
      mainHeading: 'Your next level of success may require more than strategy.',
      description: 'Through structured sessions using Pranic Healing, I help entrepreneurs and ambitious professionals clear energetic blockages, restore balance, and strengthen their internal capacity for growth.',
      primaryButton: {
        text: 'Schedule a Discovery Call',
        enabled: true
      },
      secondaryButton: {
        text: 'Book a Session',
        enabled: true
      },
      styling: {
        backgroundColor: '#F4EFE6',
        textColor: '#1C1917',
        primaryButtonColor: '#EA580C',
        primaryButtonTextColor: '#FFFFFF',
        secondaryButtonColor: '#F97316',
        secondaryButtonTextColor: '#FFFFFF'
      },
      isActive: true
    };

    const socialServices = new ShreeWebSocialServices(defaultData);
    await socialServices.save();

    console.log('✅ Social services data seeded successfully!');
    console.log('📋 Created data:');
    console.log('   Main Heading:', socialServices.mainHeading);
    console.log('   Social Media:', Object.keys(socialServices.socialMedia).filter(key => socialServices.socialMedia[key].enabled));
    console.log('   Primary Button:', socialServices.primaryButton.text);
    console.log('   Secondary Button:', socialServices.secondaryButton.text);
    console.log('   Is Active:', socialServices.isActive);

    console.log('\n🎉 Seeding completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:5173/shreeweb/socials to see the social services section');
    console.log('   2. Visit http://localhost:5173/shreeweb/cms/social-services to manage content');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedSocialServices();