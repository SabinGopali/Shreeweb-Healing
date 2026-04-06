import mongoose from 'mongoose';

const emailCampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  htmlContent: {
    type: String,
    required: true
  },
  textContent: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
    default: 'draft'
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  sentAt: {
    type: Date,
    default: null
  },
  recipients: {
    filterBy: {
      source: { type: String, default: 'all' },
      tags: { type: [String], default: [] },
      subscribedOnly: { type: Boolean, default: true }
    },
    totalCount: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 }
  },
  analytics: {
    opens: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    uniqueOpens: { type: [String], default: [] },
    uniqueClicks: { type: [String], default: [] }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShreeWebAdmin'
  }
}, {
  timestamps: true
});

const EmailCampaign = mongoose.model('EmailCampaign', emailCampaignSchema);

export default EmailCampaign;
