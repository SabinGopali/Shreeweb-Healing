import mongoose from 'mongoose';
import EmailCampaign from '../models/EmailCampaign.model.js';
import EmailCapture from '../models/EmailCapture.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to build recipient filter
function buildRecipientFilter(filterBy = {}) {
  const filter = {};

  if (filterBy.subscribedOnly !== false) {
    filter.subscribed = true;
  }

  if (filterBy.source && filterBy.source !== 'all' && typeof filterBy.source === 'string') {
    filter.source = filterBy.source;
  }

  if (filterBy.tags && Array.isArray(filterBy.tags) && filterBy.tags.length > 0) {
    filter.tags = { $in: filterBy.tags };
  }

  return filter;
}

async function updateCampaignRecipients() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    // Get all campaigns
    const campaigns = await EmailCampaign.find({});
    console.log(`📊 Found ${campaigns.length} campaign(s)\n`);

    if (campaigns.length === 0) {
      console.log('⚠️  No campaigns to update');
      process.exit(0);
    }

    // Update each campaign's recipient count
    for (const campaign of campaigns) {
      console.log(`Updating campaign: ${campaign.name}`);
      console.log(`  Current recipient count: ${campaign.recipients.totalCount}`);
      
      // Build filter based on campaign settings
      const filter = buildRecipientFilter(campaign.recipients.filterBy);
      console.log(`  Filter:`, JSON.stringify(filter, null, 2));
      
      // Count recipients
      const newCount = await EmailCapture.countDocuments(filter);
      console.log(`  New recipient count: ${newCount}`);
      
      // Update campaign
      campaign.recipients.totalCount = newCount;
      await campaign.save();
      
      console.log(`  ✅ Updated!\n`);
    }

    console.log('✅ All campaigns updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateCampaignRecipients();
