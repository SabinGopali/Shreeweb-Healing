#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShreeWebClaritySection from '../models/ShreeWebClaritySection.model.js';
import { connectMongo } from '../utils/connectMongo.js';

dotenv.config();

const defaultClaritySection = {
  title: 'Restore clarity.',
  subtitle: 'Expand naturally.',
  description: 'Take the first step towards untangling the energetic knots holding you back. Let\'s explore what\'s possible when you are fully aligned.',
  buttonText: 'Book a Discovery Call'
};

async function seedClaritySection() {
  try {
    console.log('🌱 Seeding ShreeWeb Clarity Section...');
    
    await connectMongo();
    console.log('✅ Connected to MongoDB');

    // Check if clarity section already exists
    const existingSection = await ShreeWebClaritySection.findOne();
    
    if (existingSection) {
      console.log('📋 Clarity section already exists, updating with default values...');
      
      // Update existing section with default values
      Object.assign(existingSection, defaultClaritySection);
      await existingSection.save();
      
      console.log('✅ Updated existing clarity section with default values');
    } else {
      // Create new clarity section
      const claritySection = new ShreeWebClaritySection(defaultClaritySection);
      await claritySection.save();
      
      console.log('✅ Created new clarity section with default values');
    }

    console.log('\n🎉 ShreeWeb clarity section seeded successfully!');
    console.log('📝 Section details:');
    console.log(`   Title: ${defaultClaritySection.title}`);
    console.log(`   Subtitle: ${defaultClaritySection.subtitle}`);
    console.log(`   Button: ${defaultClaritySection.buttonText}`);
    
  } catch (error) {
    console.error('❌ Error seeding clarity section:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
  }
}

// Run the seeder
seedClaritySection();