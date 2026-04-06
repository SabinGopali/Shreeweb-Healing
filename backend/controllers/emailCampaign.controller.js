import EmailCampaign from '../models/EmailCampaign.model.js';
import EmailCapture from '../models/EmailCapture.model.js';
import emailService from '../utils/emailService.js';
import { errorHandler } from '../utils/error.js';

// Get all campaigns
export const getAllCampaigns = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [campaigns, total] = await Promise.all([
      EmailCampaign.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      EmailCampaign.countDocuments(filter)
    ]);

    // Recalculate recipient counts for draft campaigns
    const updatedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        if (campaign.status === 'draft' || campaign.status === 'scheduled') {
          const recipientFilter = buildRecipientFilter(campaign.recipients?.filterBy);
          const actualCount = await EmailCapture.countDocuments(recipientFilter);
          
          if (actualCount !== campaign.recipients?.totalCount) {
            campaign.recipients.totalCount = actualCount;
            await campaign.save();
          }
        }
        return campaign.toObject();
      })
    );

    return res.status(200).json({
      success: true,
      data: updatedCampaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    next(error);
  }
};

// Get single campaign
export const getCampaign = async (req, res, next) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);

    if (!campaign) {
      return next(errorHandler(404, 'Campaign not found'));
    }

    return res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    next(error);
  }
};

// Create campaign
export const createCampaign = async (req, res, next) => {
  try {
    const { name, subject, htmlContent, textContent, recipients, scheduledFor } = req.body;

    if (!name || !subject || !htmlContent) {
      return next(errorHandler(400, 'Name, subject, and content are required'));
    }

    // Calculate recipient count
    const filter = buildRecipientFilter(recipients?.filterBy);
    console.log('📝 Creating campaign with filterBy:', JSON.stringify(recipients?.filterBy, null, 2));
    console.log('📝 Built filter for count:', JSON.stringify(filter, null, 2));
    const totalCount = await EmailCapture.countDocuments(filter);
    console.log('📝 Total recipients found:', totalCount);

    const campaign = await EmailCampaign.create({
      name,
      subject,
      htmlContent,
      textContent: textContent || '',
      recipients: {
        filterBy: recipients?.filterBy || { subscribedOnly: true },
        totalCount
      },
      scheduledFor: scheduledFor || null,
      status: scheduledFor ? 'scheduled' : 'draft',
      createdBy: req.user?.id
    });

    return res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    next(error);
  }
};

// Update campaign
export const updateCampaign = async (req, res, next) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);

    if (!campaign) {
      return next(errorHandler(404, 'Campaign not found'));
    }

    if (campaign.status === 'sent') {
      return next(errorHandler(400, 'Cannot update a sent campaign'));
    }

    const { name, subject, htmlContent, textContent, recipients, scheduledFor } = req.body;

    if (name) campaign.name = name;
    if (subject) campaign.subject = subject;
    if (htmlContent) campaign.htmlContent = htmlContent;
    if (textContent !== undefined) campaign.textContent = textContent;
    
    if (recipients) {
      campaign.recipients.filterBy = recipients.filterBy;
      const filter = buildRecipientFilter(recipients.filterBy);
      campaign.recipients.totalCount = await EmailCapture.countDocuments(filter);
    }

    if (scheduledFor !== undefined) {
      campaign.scheduledFor = scheduledFor;
      campaign.status = scheduledFor ? 'scheduled' : 'draft';
    }

    await campaign.save();

    return res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    next(error);
  }
};

// Delete campaign
export const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);

    if (!campaign) {
      return next(errorHandler(404, 'Campaign not found'));
    }

    if (campaign.status === 'sending') {
      return next(errorHandler(400, 'Cannot delete a campaign that is currently sending'));
    }

    await campaign.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    next(error);
  }
};

// Send campaign
export const sendCampaign = async (req, res, next) => {
  try {
    console.log('📧 [1] Starting sendCampaign function');
    const campaign = await EmailCampaign.findById(req.params.id);

    if (!campaign) {
      return next(errorHandler(404, 'Campaign not found'));
    }

    console.log('📧 [2] Campaign found:', campaign.name);

    if (campaign.status === 'sent') {
      if ((campaign.recipients?.sentCount || 0) > 0) {
        return next(errorHandler(400, 'Campaign has already been sent'));
      }
      campaign.status = 'draft';
      campaign.sentAt = null;
      campaign.recipients.failedCount = 0;
    }

    if (campaign.status === 'sending') {
      return next(errorHandler(400, 'Campaign is currently being sent'));
    }

    // Get recipients
    const filterBy = campaign.recipients?.filterBy || { subscribedOnly: true };
    const filter = buildRecipientFilter(filterBy);
    console.log('📧 [3] Building recipient filter');
    
    let recipients = await EmailCapture.find(filter).lean();
    console.log('📧 [4] Found recipients:', recipients.length);

    if (recipients.length === 0) {
      const subscribedCount = await EmailCapture.countDocuments({ subscribed: true });
      if (subscribedCount > 0) {
        console.warn('⚠️ No recipients matched filter. Falling back to all subscribed users.');
        recipients = await EmailCapture.find({ subscribed: true }).lean();
        campaign.recipients.filterBy = { subscribedOnly: true };
        campaign.recipients.totalCount = recipients.length;
        await campaign.save();
      }
    }
    
    if (recipients.length === 0) {
      campaign.status = 'failed';
      campaign.recipients.totalCount = 0;
      await campaign.save();
      return next(errorHandler(400, 'No subscribed recipients found for this campaign'));
    }

    console.log('📧 [5] About to verify email service...');
    
    // Add try-catch specifically for email service
    let emailReady;
    try {
      console.log('📧 [5a] Importing/accessing emailService...');
      console.log('📧 [5b] emailService type:', typeof emailService);
      console.log('📧 [5c] emailService.verifyConnection type:', typeof emailService.verifyConnection);
      
      emailReady = await emailService.verifyConnection();
      console.log('📧 [6] Email service verification result:', emailReady);
    } catch (serviceError) {
      console.error('📧 [ERROR] Email service verification threw an exception:', serviceError.message);
      console.error(serviceError.stack);
      campaign.status = 'failed';
      await campaign.save();
      return next(errorHandler(500, `Email service error: ${serviceError.message}`));
    }

    if (!emailReady.success) {
      console.error('📧 [7] Email service not ready:', emailReady.message);
      campaign.status = 'failed';
      await campaign.save();
      return next(errorHandler(500, `Email service is not ready: ${emailReady.message}`));
    }

    console.log('📧 [8] Email service ready, updating campaign status...');
    campaign.status = 'sending';
    await campaign.save();

    console.log('📧 [9] Starting background email sending...');
    // Send emails in background (don't await)
    sendCampaignEmails(campaign._id, recipients, {
      subject: campaign.subject,
      html: campaign.htmlContent,
      text: campaign.textContent
    });

    console.log('📧 [10] Campaign send initiated successfully');
    return res.status(200).json({
      success: true,
      message: 'Campaign is being sent',
      data: {
        recipientCount: recipients.length
      }
    });
  } catch (error) {
    console.error('📧 [ERROR] sendCampaign caught exception:', error);
    console.error('Stack:', error.stack);
    next(error);
  }
};

// Send test email
export const sendTestEmail = async (req, res, next) => {
  try {
    const { campaignId, testEmail } = req.body;

    if (!testEmail) {
      return next(errorHandler(400, 'Test email address is required'));
    }

    const campaign = await EmailCampaign.findById(campaignId);

    if (!campaign) {
      return next(errorHandler(404, 'Campaign not found'));
    }

    const result = await emailService.sendEmail({
      to: testEmail,
      subject: `[TEST] ${campaign.subject}`,
      html: campaign.htmlContent,
      text: campaign.textContent
    });

    if (!result.success) {
      return next(errorHandler(500, `Failed to send test email: ${result.error}`));
    }

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    next(error);
  }
};

// Get campaign analytics
export const getCampaignAnalytics = async (req, res, next) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);

    if (!campaign) {
      return next(errorHandler(404, 'Campaign not found'));
    }

    const analytics = {
      totalRecipients: campaign.recipients.totalCount,
      sent: campaign.recipients.sentCount,
      failed: campaign.recipients.failedCount,
      opens: campaign.analytics.opens,
      uniqueOpens: campaign.analytics.uniqueOpens.length,
      clicks: campaign.analytics.clicks,
      uniqueClicks: campaign.analytics.uniqueClicks.length,
      openRate: campaign.recipients.sentCount > 0 
        ? ((campaign.analytics.uniqueOpens.length / campaign.recipients.sentCount) * 100).toFixed(2)
        : 0,
      clickRate: campaign.recipients.sentCount > 0
        ? ((campaign.analytics.uniqueClicks.length / campaign.recipients.sentCount) * 100).toFixed(2)
        : 0
    };

    return res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    next(error);
  }
};

// Fix campaign recipients - recalculate based on filters
export const fixCampaignRecipients = async (req, res, next) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);

    if (!campaign) {
      return next(errorHandler(404, 'Campaign not found'));
    }

    // Recalculate recipient count
    const filter = buildRecipientFilter(campaign.recipients?.filterBy);
    const actualCount = await EmailCapture.countDocuments(filter);
    
    const oldCount = campaign.recipients.totalCount;
    campaign.recipients.totalCount = actualCount;
    await campaign.save();

    return res.status(200).json({
      success: true,
      message: 'Campaign recipients recalculated',
      data: {
        oldCount,
        newCount: actualCount,
        filter: campaign.recipients.filterBy
      }
    });
  } catch (error) {
    console.error('Error fixing campaign recipients:', error);
    next(error);
  }
};

// Helper function to build recipient filter
function buildRecipientFilter(filterBy = {}) {
  const filter = {};

  console.log('🔍 buildRecipientFilter input:', JSON.stringify(filterBy, null, 2));

  // Always filter by subscribed unless explicitly set to false
  if (filterBy.subscribedOnly !== false) {
    filter.subscribed = true;
    console.log('🔍 Added subscribed filter: true');
  }

  // Only include valid email rows for campaign sending.
  filter.email = { $type: 'string', $regex: /\S+@\S+\.\S+/i };

  // Only add source filter if it's not 'all' and is a valid string
  if (filterBy.source && filterBy.source !== 'all' && typeof filterBy.source === 'string') {
    filter.source = filterBy.source;
    console.log('🔍 Added source filter:', filterBy.source);
  }

  // Only add tags filter if tags exist and array has items.
  // Be defensive here because legacy campaigns may store non-string tag values.
  if (filterBy.tags && Array.isArray(filterBy.tags) && filterBy.tags.length > 0) {
    const validTags = filterBy.tags
      .map(tag => (typeof tag === 'string' ? tag.trim() : ''))
      .filter(tag => tag.length > 0);
    if (validTags.length > 0) {
      // Case-insensitive tag matching; keeps campaign sends resilient to tag casing.
      filter.tags = {
        $in: validTags.map(tag => new RegExp(`^${escapeRegex(tag)}$`, 'i'))
      };
      console.log('🔍 Added tags filter:', validTags);
    } else {
      console.log('🔍 Tags array was empty after sanitizing, skipping tags filter');
    }
  } else {
    console.log('🔍 No valid tags to filter by');
  }

  console.log('🔍 Final MongoDB filter:', JSON.stringify(filter, null, 2));

  return filter;
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Background function to send campaign emails
async function sendCampaignEmails(campaignId, recipients, emailContent) {
  try {
    const campaign = await EmailCampaign.findById(campaignId);
    if (!campaign) return;

    const results = await emailService.sendBulkEmails(recipients, emailContent);

    campaign.recipients.sentCount = results.sent;
    campaign.recipients.failedCount = results.failed;
    if (results.sent > 0) {
      campaign.status = 'sent';
      campaign.sentAt = new Date();
    } else {
      campaign.status = 'failed';
    }
    await campaign.save();

    console.log(`Campaign ${campaignId} sent: ${results.sent} successful, ${results.failed} failed`);
  } catch (error) {
    console.error(`Error sending campaign ${campaignId}:`, error);
    
    const campaign = await EmailCampaign.findById(campaignId);
    if (campaign) {
      campaign.status = 'failed';
      await campaign.save();
    }
  }
}
