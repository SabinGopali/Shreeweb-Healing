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

async function removeTags() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    const campaign = await EmailCampaign.findOne({ name: 'cascac' });
    
    if (!campaign) {
      console.log('❌ Campaign not found');
      return;
    }

    console.log('📝 Current campaign filter:', campaign.recipients.filterBy);
    console.log('📝 Current recipient count:', campaign.recipients.totalCount);
    
    // Remove tags filter
    campaign.recipients.filterBy.tags = [];
    
    // Recalculate count
    const filter = { subscribed: true };
    if (campaign.recipients.filterBy.source && campaign.recipients.filterBy.source !== 'all') {
      filter.source = campaign.recipients.filterBy.source;
    }
    
    const newCount = await EmailCapture.countDocuments(filter);
    campaign.recipients.totalCount = newCount;
    
    await campaign.save();
    
    console.log('\n✅ Updated campaign filter:', campaign.recipients.filterBy);
    console.log('✅ New recipient count:', campaign.recipients.totalCount);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeTags();
