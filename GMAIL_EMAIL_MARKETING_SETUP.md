# Gmail Setup for Email Marketing - Complete Guide

## Prerequisites
- A Gmail account
- Access to your backend `.env` file

## Step-by-Step Setup

### 1. Enable 2-Step Verification (Required)

Gmail requires 2-Step Verification to generate App Passwords for security.

1. Go to: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Click **Get Started**
5. Follow the prompts:
   - Enter your password
   - Add your phone number
   - Choose how to receive codes (text or call)
   - Enter the verification code sent to your phone
   - Click **Turn On**

✅ 2-Step Verification is now enabled!

### 2. Generate App Password

App Passwords allow apps to access your Gmail without using your actual password.

1. Go back to: https://myaccount.google.com/security
2. Under "How you sign in to Google", click **App passwords**
   - If you don't see this option, make sure 2-Step Verification is enabled
3. You may need to sign in again
4. In the dropdown menus:
   - **Select app**: Choose "Mail"
   - **Select device**: Choose "Other (Custom name)"
5. Type a name: `Email Marketing System` or `Healing Website`
6. Click **Generate**
7. Google shows a 16-character password like: `abcd efgh ijkl mnop`
8. **IMPORTANT**: Copy this password immediately!
   - Remove the spaces: `abcdefghijklmnop`
   - You won't be able to see it again
   - If you lose it, you'll need to generate a new one

### 3. Update Backend Configuration

Open your `backend/.env` file and update these lines:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM=your-actual-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

**Replace:**
- `your-actual-email@gmail.com` with your Gmail address
- `abcdefghijklmnop` with your 16-character App Password (no spaces)

**Example:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=healing@gmail.com
EMAIL_PASS=xyzw1234abcd5678
EMAIL_FROM=healing@gmail.com
FRONTEND_URL=http://localhost:5173
```

### 4. Restart Your Backend

After updating `.env`, restart your backend server:

```bash
cd backend
npm run dev
```

The server will now use your Gmail credentials to send emails.

### 5. Test the Setup

1. Go to: http://localhost:5173/shreeweb/cms/login
2. Login to your CMS
3. Navigate to: **Email Campaigns**
4. Click **Create Campaign**
5. Fill in the form with test content
6. In the "Send Test Email" section:
   - Enter your email address
   - Click "Send Test"
7. Check your inbox (and spam folder)

✅ If you receive the test email, setup is complete!

## Important Notes

### Gmail Sending Limits

**Free Gmail Account:**
- 500 emails per day
- 100-150 emails per hour (to avoid triggering spam filters)

**Google Workspace (Paid):**
- 2,000 emails per day
- Better deliverability

### Best Practices

1. **Start Small**: Send to 10-20 people first to test
2. **Warm Up**: Gradually increase sending volume over days
3. **Monitor**: Check if emails land in spam
4. **Clean List**: Remove bounced/invalid emails
5. **Unsubscribe Link**: Always include (it's required by law)

### Avoiding Spam Folder

1. **Authenticate Your Domain**: Set up SPF, DKIM, DMARC records
2. **Good Content**: Avoid spam trigger words
3. **Engagement**: Send to engaged subscribers
4. **Consistent Sending**: Regular schedule builds reputation
5. **Low Complaint Rate**: Make unsubscribe easy

## Troubleshooting

### "Invalid login" or "Authentication failed"

**Solution:**
1. Double-check your email address in `EMAIL_USER`
2. Verify the App Password is correct (no spaces)
3. Make sure 2-Step Verification is enabled
4. Try generating a new App Password

### "Connection timeout" or "ETIMEDOUT"

**Solution:**
1. Check your internet connection
2. Verify `EMAIL_HOST=smtp.gmail.com`
3. Verify `EMAIL_PORT=587`
4. Try `EMAIL_SECURE=true` with `EMAIL_PORT=465`

### Emails going to spam

**Solution:**
1. Ask recipients to mark as "Not Spam"
2. Include unsubscribe link
3. Use a professional email signature
4. Avoid spam trigger words (FREE, URGENT, etc.)
5. Send from a consistent email address

### "Daily sending quota exceeded"

**Solution:**
1. You've hit Gmail's 500 emails/day limit
2. Wait 24 hours for the quota to reset
3. Consider upgrading to Google Workspace
4. Or use a professional email service (SendGrid, Mailgun)

## Alternative: Google Workspace

For serious email marketing, consider Google Workspace:

**Benefits:**
- 2,000 emails per day (4x more)
- Better deliverability
- Professional email address (you@yourdomain.com)
- Custom domain support

**Cost:** $6-12/month per user

**Setup:** Same process, just use your Workspace email

## Alternative: Professional Email Services

For high-volume sending (1000+ emails/day):

### SendGrid
- Free: 100 emails/day
- Paid: Starting at $15/month for 40,000 emails
- Better deliverability and analytics

### Mailgun
- Free: 5,000 emails/month
- Paid: Pay as you go
- Developer-friendly

### AWS SES
- Very cheap: $0.10 per 1,000 emails
- Requires AWS account
- More technical setup

## Security Reminders

1. ✅ Never commit `.env` file to Git
2. ✅ Keep App Password secret
3. ✅ Revoke App Passwords you're not using
4. ✅ Use different App Passwords for different apps
5. ✅ Monitor your Google Account activity

## Next Steps

After setup is complete:

1. ✅ Send test emails to yourself
2. ✅ Create your first campaign
3. ✅ Send to a small test group (5-10 people)
4. ✅ Check deliverability
5. ✅ Gradually increase volume
6. ✅ Monitor analytics

## Support

If you encounter issues:

1. Check backend console logs for error messages
2. Verify all `.env` values are correct
3. Test with a simple test email first
4. Review Gmail's sending limits
5. Check Google Account security settings

## Production Deployment

When deploying to production:

1. Update `FRONTEND_URL` to your actual domain
2. Consider using environment variables instead of `.env`
3. Use a professional email service for better deliverability
4. Set up proper domain authentication (SPF, DKIM, DMARC)
5. Monitor bounce rates and spam complaints

---

**You're all set!** Your email marketing system is now configured to send campaigns through Gmail.
