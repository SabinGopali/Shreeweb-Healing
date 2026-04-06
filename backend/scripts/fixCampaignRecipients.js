import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const EmailCampaignSchema = new mongoose.Schema({
  name: String,
  subject: String,
  status: String,
  recipients: {
    filterBy: Object,
    totalCount: Number,
    sentCount: Number,
    failedCount: Number
  }
}, { strict: false });

const EmailCaptureSchema = new mongoose.Schema({
  email: String,
  subscribed: Boolean,
  source: String,
  tags: [String]
});

const EmailCampaign = mongoose.model('EmailCampaign', EmailCampaignSchema);
const EmailCapture = mongoose.model('EmailCapture', EmailCaptureSchema);

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

async function fixCampaigns() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    const campaigns = await EmailCampaign.find();
    
    console.log(`📊 Found ${campaigns.length} campaigns to check:\n`);
    
    for (const campaign of campaigns) {
      console.log(`\n🔍 Checking campaign: ${campaign.name}`);
      console.log(`   Current recipients: ${campaign.recipients?.totalCount || 0}`);
      console.log(`   Current filter:`, campaign.recipients?.filterBy);
      
      // Recalculate recipient count
      const filter = buildRecipientFilter(campaign.recipients?.filterBy);
      console.log(`   Built filter:`, filter);
      
      const actualCount = await EmailCapture.countDocuments(filter);
      console.log(`   Actual matching recipients: ${actualCount}`);
      
      if (actualCount !== campaign.recipients?.totalCount) {
        console.log(`   ⚠️  Mismatch detected! Updating...`);
        campaign.recipients.totalCount = actualCount;
        await campaign.save();
        console.log(`   ✅ Updated to ${actualCount} recipients`);
      } else {
        console.log(`   ✓ Count is correct`);
      }
    }

    console.log('\n✅ All campaigns checked and updated!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixCampaigns();
