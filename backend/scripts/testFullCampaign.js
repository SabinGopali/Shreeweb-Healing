import mongoose from 'mongoose';
import EmailCampaign from '../models/EmailCampaign.model.js';
import EmailCapture from '../models/EmailCapture.model.js';
import emailService from '../utils/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testFullCampaign() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    // Check subscribers
    const subscribers = await EmailCapture.find({ subscribed: true });
    console.log('📧 Subscribed Users:', subscribers.length);
    subscribers.forEach((sub, i) => {
      console.log(`   ${i + 1}. ${sub.email} (${sub.name || 'No name'})`);
    });

    // Check campaigns
    const campaigns = await EmailCampaign.find({});
    console.log('\n📊 Total Campaigns:', campaigns.length);
    
    if (campaigns.length > 0) {
      console.log('\nCampaigns:');
      campaigns.forEach((camp, i) => {
        console.log(`   ${i + 1}. ${camp.name}`);
        console.log(`      Status: ${camp.status}`);
        console.log(`      Recipients: ${camp.recipients.totalCount}`);
        console.log(`      Sent: ${camp.recipients.sentCount}`);
        console.log(`      Created: ${camp.createdAt.toLocaleDateString()}`);
      });
    }

    // Verify email service
    console.log('\n🔍 Verifying email service...');
    const verification = await emailService.verifyConnection();
    if (verification.success) {
      console.log('✅ Email service is ready!');
    } else {
      console.log('❌ Email service error:', verification.message);
    }

    console.log('\n✅ System Check Complete!');
    console.log('\n🚀 Ready to send campaigns!');
    console.log('   Go to: http://localhost:5173/shreeweb/cms/email-campaigns');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testFullCampaign();
