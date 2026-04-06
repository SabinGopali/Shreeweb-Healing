import mongoose from 'mongoose';
import EmailCampaign from '../models/EmailCampaign.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function testCampaignAPI() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    // Check campaigns in database
    const campaigns = await EmailCampaign.find({});
    console.log('📊 Campaigns in database:', campaigns.length);
    
    if (campaigns.length > 0) {
      console.log('\nCampaigns:');
      campaigns.forEach((camp, i) => {
        console.log(`\n${i + 1}. ${camp.name}`);
        console.log(`   ID: ${camp._id}`);
        console.log(`   Status: ${camp.status}`);
        console.log(`   Subject: ${camp.subject}`);
        console.log(`   Recipients: ${camp.recipients.totalCount}`);
        console.log(`   Created: ${camp.createdAt}`);
      });
    } else {
      console.log('\n⚠️  No campaigns found in database');
      console.log('   This is normal if you haven\'t created any campaigns yet');
    }

    // Test the API endpoint using environment variable or localhost for local testing
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://omshreeguidance.com' 
      : 'http://localhost:3000';
    
    console.log(`\n🧪 Testing API endpoint at ${baseUrl}...`);
    const fetch = (await import('node-fetch')).default;
    
    try {
      const response = await fetch(`${baseUrl}/backend/email-campaigns?page=1&limit=20`);
      console.log('   Status:', response.status, response.statusText);
      
      if (response.status === 401 || response.status === 403) {
        console.log('   ⚠️  Authentication required (this is expected)');
        console.log('   The frontend will send auth token automatically');
      } else if (response.ok) {
        const data = await response.json();
        console.log('   Response:', JSON.stringify(data, null, 2).substring(0, 500));
      }
    } catch (fetchError) {
      console.log('   ❌ API Error:', fetchError.message);
      console.log('   Make sure backend server is running');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testCampaignAPI();