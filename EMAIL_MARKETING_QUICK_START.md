# Email Marketing - Quick Start Guide

## ✅ What's Been Implemented

A complete email marketing system with:
- Campaign creation and management
- Bulk email sending
- Recipient segmentation (by source, tags, subscription status)
- Test email functionality
- Campaign analytics tracking
- Email templates with variable substitution

## 🚀 Quick Setup (5 Minutes)

### Step 1: Configure Email Service

Edit `backend/.env` and add your email credentials:

```env
# For Gmail (easiest for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

**Getting Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App passwords
4. Generate password for "Mail"
5. Copy the 16-character password

### Step 2: Restart Backend

```bash
cd backend
npm run dev
```

### Step 3: Access Email Campaigns

1. Go to http://localhost:5173/shreeweb/cms/login
2. Login with your admin credentials
3. Click "Email Campaigns" in the sidebar

## 📧 Creating Your First Campaign

1. Click "Create Campaign"
2. Fill in:
   - **Name**: "Welcome Email" (internal name)
   - **Subject**: "Welcome to Our Community!"
   - **Content**: Use the template below
   - **Recipients**: Select "All Sources" and check "Only subscribed users"
3. Click "Create Campaign"
4. Send a test email to yourself
5. Click "Send" to launch

### Simple Email Template

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #F4EFE6; padding: 30px; text-align: center;">
    <h1 style="color: #78716C; margin: 0;">Hello, {{name}}!</h1>
  </div>
  
  <div style="padding: 30px; background: white;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Thank you for subscribing to our updates. We're excited to share our journey with you.
    </p>
    
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Stay tuned for exclusive offerings, insights, and updates.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:5173/shreeweb/offers" 
         style="display: inline-block; padding: 12px 30px; background: #F59E0B; 
                color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">
        View Our Offerings
      </a>
    </div>
  </div>
  
  <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>You're receiving this at {{email}}</p>
    <p><a href="{{unsubscribe_link}}" style="color: #F59E0B;">Unsubscribe</a></p>
  </div>
</div>
```

## 🎯 Available Variables

Use these in your email content:
- `{{name}}` - Recipient's name (or "there" if not provided)
- `{{email}}` - Recipient's email address
- `{{unsubscribe_link}}` - Unsubscribe link (required by law)

## 📊 Viewing Your Subscribers

1. Go to "Email Subscribers" in CMS sidebar
2. See all captured emails from your website
3. Filter by source, subscription status
4. Export to CSV

## 🔍 Campaign Status

- **Draft**: Campaign is being created/edited
- **Scheduled**: Set to send at a future time
- **Sending**: Currently being sent
- **Sent**: Successfully sent to all recipients
- **Failed**: Encountered errors during sending

## ⚠️ Important Notes

1. **Always send a test email first** before launching to all subscribers
2. **Include unsubscribe link** - it's required by law (CAN-SPAM, GDPR)
3. **Start small** - test with 5-10 recipients before sending to everyone
4. **Check spam folder** - test emails might land there initially
5. **Gmail limits** - Free Gmail accounts have daily sending limits (~500/day)

## 🛠️ Troubleshooting

### "Failed to send test email"
- Check your EMAIL_USER and EMAIL_PASS in `.env`
- For Gmail, use App Password, not your regular password
- Restart the backend after changing `.env`

### "Campaign stuck in sending"
- Check backend console for errors
- Large campaigns take time (100ms delay per email)
- Campaign will auto-update when complete

### "Emails going to spam"
- Add proper sender name in EMAIL_FROM
- Include unsubscribe link
- Avoid spam trigger words
- Consider using a professional email service (SendGrid, Mailgun)

## 📈 Next Steps

1. Create your first campaign
2. Send to a small test group
3. Review analytics
4. Create more targeted campaigns using filters
5. Consider setting up a professional email service for production

## 🎨 Advanced Features

- **Segment by tags**: Tag subscribers and send targeted campaigns
- **Filter by source**: Send different content to different sources
- **Schedule campaigns**: Set future send dates (backend ready)
- **Track analytics**: Monitor opens and clicks (backend ready)

## 📞 Need Help?

Check the full documentation in `EMAIL_MARKETING_SYSTEM_COMPLETE.md` for:
- Detailed API documentation
- Advanced email templates
- Integration guides
- Security best practices
