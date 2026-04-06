import mongoose from 'mongoose';
import EmailCampaign from '../models/EmailCampaign.model.js';
import EmailCapture from '../models/EmailCapture.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function resetCampaigns() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    // Get all campaigns
    const campaigns = await EmailCampaign.find({});
    console.log(`📊 Found ${campaigns.length} campaign(s)\n`);

    for (const campaign of campaigns) {
      console.log(`Campaign: ${campaign.name}`);
      console.log(`  Current status: ${campaign.status}`);
      console.log(`  Current recipients: ${campaign.recipients.totalCount}`);
      
      // Reset to draft
      campaign.status = 'draft';
      campaign.recipients.sentCount = 0;
      campaign.recipients.failedCount = 0;
      campaign.sentAt = null;
      
      // Update filters to "All Sources"
      campaign.recipients.filterBy = {
        source: 'all',
        tags: [],
        subscribedOnly: true
      };
      
      // Recalculate recipient count
      const filter = { subscribed: true };
      const newCount = await EmailCapture.countDocuments(filter);
      campaign.recipients.totalCount = newCount;
      
      await campaign.save();
      
      console.log(`  ✅ Reset to draft`);
      console.log(`  New recipient count: ${newCount}\n`);
    }

    console.log('✅ All campaigns reset!');
    console.log('\n📧 You can now send campaigns from the CMS');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetCampaigns();
