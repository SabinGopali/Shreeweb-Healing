#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShreeWebOffering from '../models/ShreeWebOffering.model.js';
import { connectMongo } from '../utils/connectMongo.js';

dotenv.config();

const defaultOfferings = [
  {
    title: 'Discovery Call',
    subtitle: 'Introductory',
    duration: '45 Min',
    description: 'A complimentary session to explore your current energetic landscape and discuss a customized plan for you.',
    price: 'Free',
    category: 'introductory',
    featured: false,
    order: 0,
    isActive: true,
    features: ['Energetic assessment', 'Customized plan discussion', 'No commitment required']
  },
  {
    title: 'Energetic Alignment',
    subtitle: 'Single Session',
    duration: '90 Min',
    description: 'A deep-dive single session for immediate clarity, cleansing, and recalibration.',
    price: '$111',
    category: 'single',
    featured: true,
    order: 1,
    isActive: true,
    features: ['Deep energetic cleansing', 'Immediate clarity', 'Recalibration session']
  },
  {
    title: 'Energetic Reset',
    subtitle: 'Recurring Sessions',
    duration: '2 Sessions Over 2 Weeks',
    description: 'A structured two week program to clear deep-seated burnout and restore baseline stability.',
    price: '$333',
    category: 'recurring',
    featured: false,
    order: 2,
    isActive: true,
    features: ['Burnout clearing', 'Baseline stability restoration', 'Structured program']
  },
  {
    title: 'Realignment Program',
    subtitle: 'Looking for deeper transformation?',
    duration: '8 Sessions',
    description: 'Comprehensive transformation program for deep energetic realignment and sustainable change.',
    price: 'Contact for Pricing',
    category: 'program',
    featured: false,
    order: 3,
    isActive: true,
    features: ['8 comprehensive sessions', 'Deep transformation', 'Sustainable change']
  },
  {
    title: 'Transformation Program',
    subtitle: 'Looking for deeper transformation?',
    duration: '12 Sessions',
    description: 'Ultimate transformation journey for complete energetic overhaul and life alignment.',
    price: 'Contact for Pricing',
    category: 'program',
    featured: false,
    order: 4,
    isActive: true,
    features: ['12 comprehensive sessions', 'Complete energetic overhaul', 'Life alignment']
  }
];

async function seedOfferings() {
  try {
    console.log('🌱 Seeding ShreeWeb Offerings...');
    
    await connectMongo();
    console.log('✅ Connected to MongoDB');

    // Clear existing offerings
    await ShreeWebOffering.deleteMany({});
    console.log('🗑️  Cleared existing offerings');

    // Insert default offerings
    const offerings = await ShreeWebOffering.insertMany(defaultOfferings);
    console.log(`✅ Created ${offerings.length} offerings:`);
    
    offerings.forEach((offering, index) => {
      console.log(`   ${index + 1}. ${offering.title} (${offering.category}) - ${offering.price}`);
    });

    console.log('\n🎉 ShreeWeb offerings seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding offerings:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
  }
}

// Run the seeder
seedOfferings();