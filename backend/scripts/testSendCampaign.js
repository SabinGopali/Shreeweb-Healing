import mongoose from 'mongoose';
import EmailCampaign from '../models/EmailCampaign.model.js';
import EmailCapture from '../models/EmailCapture.model.js';
import emailService from '../utils/emailService.js';
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

async function testSendCampaign() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    // Get the first draft campaign
    const campaign = await EmailCampaign.findOne({ status: 'draft' });
    
    if (!campaign) {
      console.log('⚠️  No draft campaigns found');
      console.log('   Create a campaign first from the CMS');
      process.exit(0);
    }

    console.log('📧 Campaign:', campaign.name);
    console.log('   Subject:', campaign.subject);
    console.log('   Status:', campaign.status);
    console.log('   Recipients (stored):', campaign.recipients.totalCount);

    // Get actual recipients
    const filter = buildRecipientFilter(campaign.recipients.filterBy);
    console.log('\n🔍 Filter:', JSON.stringify(filter, null, 2));
    
    const recipients = await EmailCapture.find(filter).lean();
    console.log('📧 Found recipients:', recipients.length);
    
    if (recipients.length === 0) {
      console.log('\n⚠️  No recipients found!');
      console.log('   Add subscribers first or adjust campaign filters');
      process.exit(0);
    }

    console.log('\n📧 Recipients:');
    recipients.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.email} (${r.name || 'No name'})`);
    });

    // Verify email service
    console.log('\n🔍 Verifying email service...');
    const verification = await emailService.verifyConnection();
    if (!verification.success) {
      console.log('❌ Email service not ready:', verification.message);
      process.exit(1);
    }
    console.log('✅ Email service ready!');

    // Ask for confirmation
    console.log('\n⚠️  This will send REAL emails to the recipients above!');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('📤 Sending campaign...\n');

    // Update campaign status
    campaign.status = 'sending';
    await campaign.save();

    // Send emails
    const results = await emailService.sendBulkEmails(recipients, {
      subject: campaign.subject,
      html: campaign.htmlContent,
      text: campaign.textContent
    });

    // Update campaign with results
    campaign.recipients.sentCount = results.sent;
    campaign.recipients.failedCount = results.failed;
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    await campaign.save();

    console.log('\n✅ Campaign sent!');
    console.log(`   Successful: ${results.sent}`);
    console.log(`   Failed: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(err => {
        console.log(`   ${err.email}: ${err.error}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSendCampaign();
