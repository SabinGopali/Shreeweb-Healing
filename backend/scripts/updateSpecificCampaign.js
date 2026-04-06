import mongoose from 'mongoose';
import EmailCampaign from '../models/EmailCampaign.model.js';
import EmailCapture from '../models/EmailCapture.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function updateSpecificCampaign() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    const campaignId = '69d359e74616df7b9ab1a70b';
    
    // Get the campaign
    const campaign = await EmailCampaign.findById(campaignId);
    
    if (!campaign) {
      console.log('❌ Campaign not found');
      process.exit(1);
    }

    console.log('📧 Campaign:', campaign.name);
    console.log('   Current status:', campaign.status);
    console.log('   Current recipients:', campaign.recipients.totalCount);
    console.log('   Current filters:', JSON.stringify(campaign.recipients.filterBy, null, 2));

    // Update filters to "All Sources"
    campaign.recipients.filterBy = {
      source: 'all',
      tags: [],
      subscribedOnly: true
    };

    // Count actual subscribers
    const subscribedCount = await EmailCapture.countDocuments({ subscribed: true });
    console.log('\n📊 Actual subscribed users in database:', subscribedCount);

    // Update campaign
    campaign.recipients.totalCount = subscribedCount;
    campaign.status = 'draft'; // Reset to draft if needed
    campaign.recipients.sentCount = 0;
    campaign.recipients.failedCount = 0;
    
    await campaign.save();

    console.log('\n✅ Campaign updated!');
    console.log('   New recipient count:', campaign.recipients.totalCount);
    console.log('   Status:', campaign.status);
    console.log('\n📧 Refresh the campaigns page to see the update');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateSpecificCampaign();
