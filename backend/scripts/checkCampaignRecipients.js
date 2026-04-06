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
  },
  analytics: Object,
  createdAt: Date
});

const EmailCampaign = mongoose.model('EmailCampaign', EmailCampaignSchema);

async function checkCampaigns() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    const campaigns = await EmailCampaign.find();
    
    console.log(`📊 Found ${campaigns.length} campaigns:\n`);
    
    campaigns.forEach((campaign, i) => {
      console.log(`${i + 1}. ${campaign.name}`);
      console.log(`   Status: ${campaign.status}`);
      console.log(`   Subject: ${campaign.subject}`);
      console.log(`   Recipients: ${campaign.recipients?.totalCount || 0}`);
      console.log(`   Filter: ${JSON.stringify(campaign.recipients?.filterBy || {})}`);
      console.log('');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCampaigns();
