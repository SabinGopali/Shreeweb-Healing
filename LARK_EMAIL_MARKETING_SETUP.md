# Lark (Feishu) Email Setup for Email Marketing

## Overview

Lark provides enterprise email services that can be used for sending marketing campaigns. This guide will help you configure your Lark email for the email marketing system.

## Prerequisites

- A Lark/Feishu account with email service enabled
- Admin access to your Lark workspace
- Your Lark email address

## Lark SMTP Configuration Options

Lark supports multiple SMTP configurations depending on your region and setup:

### Option 1: Standard Lark SMTP (Recommended)

```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-lark-password
EMAIL_FROM=your-email@yourdomain.com
```

### Option 2: Alternative Port (TLS)

```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-lark-password
EMAIL_FROM=your-email@yourdomain.com
```

### Option 3: International Lark (LarkSuite)

```env
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-lark-password
EMAIL_FROM=your-email@yourdomain.com
```

## Step-by-Step Setup

### Step 1: Get Your Lark Email Credentials

1. **Login to Lark Admin Console**
   - Go to: https://www.feishu.cn/admin (China)
   - Or: https://www.larksuite.com/admin (International)

2. **Navigate to Email Settings**
   - Click on your profile/avatar
   - Go to "Settings" or "Account Settings"
   - Find "Email" or "Mail" section

3. **Note Your Email Address**
   - Your Lark email format: `username@yourdomain.com`
   - Or: `username@yourcompany.feishu.cn`

4. **Get/Reset Your Password**
   - If you don't know your email password, you may need to reset it
   - Contact your Lark admin if you don't have access

### Step 2: Enable SMTP Access (If Required)

Some Lark accounts require SMTP to be explicitly enabled:

1. Go to Lark Admin Console
2. Navigate to "Security Settings" or "Email Settings"
3. Look for "SMTP Access" or "External Email Access"
4. Enable it if it's disabled
5. Note any specific SMTP settings provided

### Step 3: Update Backend Configuration

Open your `backend/.env` file and update:

```env
# Lark Email Configuration
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=yourname@yourcompany.com
EMAIL_PASS=your-actual-password
EMAIL_FROM=yourname@yourcompany.com
FRONTEND_URL=http://localhost:5173
```

**Replace:**
- `yourname@yourcompany.com` with your actual Lark email
- `your-actual-password` with your Lark email password

**Example:**
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=marketing@healingsessions.com
EMAIL_PASS=MySecurePassword123
EMAIL_FROM=marketing@healingsessions.com
FRONTEND_URL=http://localhost:5173
```

### Step 4: Restart Backend Server

```bash
cd backend
npm run dev
```

### Step 5: Test the Configuration

1. Go to: http://localhost:5173/shreeweb/cms/login
2. Login to your CMS
3. Navigate to: **Email Campaigns** → **Create Campaign**
4. Fill in test content
5. Scroll to "Send Test Email"
6. Enter your email address
7. Click "Send Test"
8. Check your inbox

## Troubleshooting

### Issue: "Invalid login" or "Authentication failed"

**Solutions:**
1. Verify your email address is correct
2. Check your password (try resetting it)
3. Ensure SMTP access is enabled in Lark admin
4. Try alternative SMTP settings:
   ```env
   EMAIL_HOST=smtp.larksuite.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   ```

### Issue: "Connection timeout" or "ECONNREFUSED"

**Solutions:**
1. Check if your network allows SMTP connections
2. Try alternative port:
   ```env
   EMAIL_PORT=587
   EMAIL_SECURE=false
   ```
3. Verify the SMTP host is correct for your region:
   - China: `smtp.feishu.cn`
   - International: `smtp.larksuite.com`

### Issue: "Self-signed certificate" error

**Solution:**
Add this to your email configuration (temporary fix):
```env
EMAIL_SECURE=false
EMAIL_PORT=587
```

### Issue: Emails not being received

**Solutions:**
1. Check spam/junk folder
2. Verify sender email is correct
3. Check Lark email sending limits
4. Ensure recipient email is valid
5. Check Lark admin console for blocked/bounced emails

## Lark Email Sending Limits

Lark email limits vary by plan:

| Plan Type | Daily Limit | Notes |
|-----------|-------------|-------|
| Free | ~500 emails/day | May vary |
| Standard | ~1,000 emails/day | Contact support for exact limits |
| Enterprise | Custom | Negotiable with Lark |

**Note:** These are approximate. Check with your Lark admin or support for exact limits.

## Best Practices for Lark Email

1. **Use a Dedicated Email**: Create a specific email like `marketing@yourdomain.com`
2. **Professional Sender Name**: Set up a proper display name
3. **Warm Up**: Start with small batches (10-20 emails)
4. **Monitor**: Check Lark admin console for delivery reports
5. **Compliance**: Always include unsubscribe links

## Alternative SMTP Settings to Try

If the standard configuration doesn't work, try these alternatives:

### Configuration A (SSL/TLS on 465)
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
```

### Configuration B (STARTTLS on 587)
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=587
EMAIL_SECURE=false
```

### Configuration C (International)
```env
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

### Configuration D (Alternative International)
```env
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## Verifying Your Setup

After configuration, check the backend console logs:

**Success:**
```
[EMAIL SIMULATION] { to: 'test@example.com', subject: 'Test Email' }
```
or
```
Email sent successfully
```

**Failure:**
```
Error sending email: Invalid login
```
or
```
Error: Connection timeout
```

## Getting Help from Lark Support

If you're still having issues:

1. **Contact Lark Support**
   - China: https://www.feishu.cn/hc/zh-CN
   - International: https://www.larksuite.com/hc/en-US

2. **Ask for:**
   - SMTP server address
   - SMTP port number
   - SSL/TLS requirements
   - Authentication method
   - Sending limits

3. **Provide:**
   - Your Lark email address
   - Error messages from backend logs
   - What you're trying to accomplish

## Security Notes

1. ✅ Never commit `.env` file to Git
2. ✅ Use strong passwords for Lark email
3. ✅ Enable 2FA on your Lark account if available
4. ✅ Regularly rotate passwords
5. ✅ Monitor email sending activity in Lark admin

## Production Deployment

When deploying to production:

1. Update `FRONTEND_URL` to your actual domain
2. Use environment variables instead of `.env` file
3. Set up SPF/DKIM records for your domain
4. Monitor bounce rates in Lark admin console
5. Have a backup email service ready

## Alternative: Lark Open Platform API

For advanced users, Lark also provides an API for sending emails:

- More control over email sending
- Better for high-volume campaigns
- Requires API key setup
- More complex integration

Documentation: https://open.feishu.cn/document/

## Quick Reference

**Your Lark Email Configuration:**

```
Email Address: _______________________
SMTP Host: smtp.feishu.cn (or smtp.larksuite.com)
SMTP Port: 465 (SSL) or 587 (TLS)
Password: _______________________
Date Configured: _______________________
```

## Next Steps

After successful setup:

1. ✅ Send test email to yourself
2. ✅ Send test campaign to 5-10 people
3. ✅ Monitor delivery in Lark admin
4. ✅ Check spam folder placement
5. ✅ Gradually increase sending volume
6. ✅ Set up proper email authentication (SPF, DKIM)

---

**Need Help?** Check the backend console logs for specific error messages and refer to the troubleshooting section above.
