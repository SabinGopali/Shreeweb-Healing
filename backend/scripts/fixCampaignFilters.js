import mongoose from 'mongoose';
import EmailCampaign from '../models/EmailCampaign.model.js';
import EmailCapture from '../models/EmailCapture.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixCampaignFilters() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    // Get all campaigns
    const campaigns = await EmailCampaign.find({});
    
    if (campaigns.length === 0) {
      console.log('⚠️  No campaigns found');
      process.exit(0);
    }

    console.log(`📊 Found ${campaigns.length} campaign(s)\n`);

    for (const campaign of campaigns) {
      console.log(`Campaign: ${campaign.name}`);
      console.log(`  Current filters:`, JSON.stringify(campaign.recipients.filterBy, null, 2));
      
      // Update to "All Sources" and no tags
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
      
      console.log(`  ✅ Updated to "All Sources"`);
      console.log(`  New recipient count: ${newCount}\n`);
    }

    console.log('✅ All campaigns fixed!');
    console.log('\n📧 Refresh the campaigns page to see updated counts');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixCampaignFilters();
