# Email Marketing System - Complete Implementation

## Overview
A complete email marketing system has been implemented for managing and sending campaigns to email subscribers.

## Features Implemented

### 1. Email Campaign Management
- ✅ Create, edit, and delete email campaigns
- ✅ Draft campaigns before sending
- ✅ Schedule campaigns for later (backend ready)
- ✅ Send bulk emails to subscribers
- ✅ Track campaign status (draft, scheduled, sending, sent, failed)

### 2. Recipient Segmentation
- ✅ Filter by source (shreeweb, newsletter, contact_form, etc.)
- ✅ Filter by tags
- ✅ Filter by subscription status
- ✅ Real-time recipient count preview

### 3. Email Templates
- ✅ HTML email content support
- ✅ Plain text fallback
- ✅ Variable substitution:
  - `{{name}}` - Recipient name
  - `{{email}}` - Recipient email
  - `{{unsubscribe_link}}` - Unsubscribe link

### 4. Testing & Preview
- ✅ Send test emails before campaign launch
- ✅ Preview campaign content
- ✅ View sent campaign details

### 5. Analytics (Backend Ready)
- ✅ Track emails sent/failed
- ✅ Track unique opens (ready for implementation)
- ✅ Track unique clicks (ready for implementation)
- ✅ Calculate open rate and click rate

## Files Created

### Backend
1. `backend/models/EmailCampaign.model.js` - Campaign data model
2. `backend/controllers/emailCampaign.controller.js` - Campaign logic
3. `backend/routes/emailCampaign.routes.js` - API routes
4. `backend/utils/emailService.js` - Email sending service

### Frontend
1. `shreeweb/src/shreeweb/shreeweb/cms/pages/CmsEmailCampaigns.jsx` - Campaign management UI

### Modified Files
1. `backend/index.js` - Added email campaign routes
2. `shreeweb/src/shreeweb/shreeweb/cms/ShreeWebCmsRoutes.jsx` - Added campaign route
3. `shreeweb/src/shreeweb/shreeweb/cms/components/CmsSidebar.jsx` - Added navigation link
4. `backend/.env` - Added email configuration

## Setup Instructions

### 1. Email Service Configuration

#### For Gmail (Recommended for Testing):
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to Security > 2-Step Verification > App passwords
4. Generate an app password for "Mail"
5. Update `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

#### For Other Email Services:
- **SendGrid**: Use SMTP relay with API key
- **Mailgun**: Use SMTP credentials
- **AWS SES**: Configure SMTP settings
- **Lark/Feishu**: Use Lark SMTP settings

### 2. Install Dependencies
```bash
cd backend
npm install
# nodemailer is already in package.json
```

### 3. Restart Backend
```bash
cd backend
npm run dev
```

## Usage Guide

### Creating a Campaign

1. Navigate to CMS > Email Campaigns
2. Click "Create Campaign"
3. Fill in:
   - Campaign Name (internal reference)
   - Email Subject
   - HTML Content (use variables for personalization)
   - Recipient filters (source, tags, subscription status)
4. Preview recipient count
5. Save as draft

### Sending Test Emails

1. Edit a campaign
2. Scroll to "Send Test Email" section
3. Enter your test email address
4. Click "Send Test"
5. Check your inbox

### Launching a Campaign

1. From campaigns list, click "Send" on a draft campaign
2. Confirm the action
3. Campaign status changes to "sending" then "sent"
4. View analytics after sending

### Viewing Analytics

1. Click "View" on a sent campaign
2. See:
   - Total sent
   - Unique opens
   - Unique clicks
   - Failed deliveries

## API Endpoints

### Campaign Management
- `GET /backend/email-campaigns` - List all campaigns
- `GET /backend/email-campaigns/:id` - Get single campaign
- `POST /backend/email-campaigns` - Create campaign
- `PUT /backend/email-campaigns/:id` - Update campaign
- `DELETE /backend/email-campaigns/:id` - Delete campaign

### Campaign Actions
- `POST /backend/email-campaigns/:id/send` - Send campaign
- `POST /backend/email-campaigns/test-email` - Send test email
- `GET /backend/email-campaigns/:id/analytics` - Get analytics

## Email Template Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #F4EFE6; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background: #F59E0B; color: white; text-decoration: none; border-radius: 25px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome, {{name}}!</h1>
    </div>
    <div class="content">
      <p>Hi {{name}},</p>
      <p>Thank you for subscribing to our updates. We're excited to share our latest offerings with you.</p>
      <p style="text-align: center;">
        <a href="https://yoursite.com/offers" class="button">View Offerings</a>
      </p>
    </div>
    <div class="footer">
      <p>You're receiving this because you subscribed at {{email}}</p>
      <p><a href="{{unsubscribe_link}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
```

## Security Considerations

1. **Email Credentials**: Never commit `.env` file with real credentials
2. **Rate Limiting**: Email service includes 100ms delay between sends
3. **Authentication**: All endpoints require admin authentication
4. **Unsubscribe**: Always include unsubscribe link in emails

## Troubleshooting

### Emails Not Sending
1. Check EMAIL_USER and EMAIL_PASS in `.env`
2. For Gmail, ensure you're using App Password, not regular password
3. Check backend console for error messages
4. Verify SMTP settings for your email provider

### Test Email Not Received
1. Check spam/junk folder
2. Verify test email address is correct
3. Check backend logs for sending errors

### Campaign Stuck in "Sending"
1. Check backend logs for errors
2. Campaign will auto-update to "sent" or "failed" when complete
3. Large campaigns may take several minutes

## Future Enhancements

### Planned Features
- [ ] Email open tracking (pixel tracking)
- [ ] Click tracking (link wrapping)
- [ ] A/B testing
- [ ] Email templates library
- [ ] Drag-and-drop email builder
- [ ] Automated campaigns (drip sequences)
- [ ] Campaign scheduling UI
- [ ] Advanced analytics dashboard
- [ ] Export campaign reports

### Integration Opportunities
- [ ] Integrate with Shopify for order-based campaigns
- [ ] Booking confirmation emails
- [ ] Abandoned cart emails
- [ ] Welcome email series

## Support

For issues or questions:
1. Check backend console logs
2. Verify email service configuration
3. Test with a simple campaign first
4. Review this documentation

## Notes

- Email sending is done in the background to avoid blocking
- Failed emails are tracked but don't stop the campaign
- Campaigns can only be edited in "draft" status
- Sent campaigns cannot be modified or resent
- Always test with a small group before sending to all subscribers
