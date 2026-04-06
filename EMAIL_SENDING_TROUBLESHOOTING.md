# Email Sending Troubleshooting

## Current Status

✅ Email service is configured correctly
✅ Nodemailer is working
❌ Authentication with Lark is failing

## Error Message

```
535 Error: authentication failed, system busy
```

## Possible Causes

### 1. Incorrect Password
- Double-check your Lark email password
- Make sure there are no extra spaces or special characters

### 2. SMTP Not Enabled in Lark
Lark might require you to enable SMTP access:
1. Log in to your Lark admin console
2. Go to Settings → Email Settings
3. Enable SMTP/IMAP access
4. You might need to generate an app-specific password

### 3. Lark SMTP Configuration
Try these alternative Lark SMTP settings:

**Option 1: Standard SMTP**
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
```

**Option 2: TLS SMTP**
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Option 3: Alternative Host**
```env
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

## Quick Fix: Use Gmail Instead

If you want to test the email marketing system immediately, use Gmail:

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "Shreeweb Email Marketing"
4. Copy the 16-character password

### Step 3: Update .env
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=your-gmail@gmail.com
```

### Step 4: Restart Backend
```bash
cd backend
npm run dev
```

## Testing Email Sending

Run this command to test:
```bash
cd backend
node scripts/testEmailSending.js
```

## If Still Not Working

### Check Lark Documentation
- Visit: https://www.larksuite.com/hc/en-US/articles/360046836333
- Look for SMTP configuration guide
- Check if you need to enable "Less secure app access" or similar

### Contact Lark Support
- They can verify if SMTP is enabled for your account
- They can provide the correct SMTP settings
- They can check if there are any account restrictions

### Alternative: Use SendGrid (Free Tier)
1. Sign up at https://sendgrid.com (100 emails/day free)
2. Create an API key
3. Update .env:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=your-verified-sender@yourdomain.com
```

## Current Configuration

Your `.env` file has:
```
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=bookings@omshreeguidance.com
EMAIL_PASS=$shr33@hell0
EMAIL_FROM=bookings@omshreeguidance.com
```

## Next Steps

1. **Verify Lark Password**: Make sure `$shr33@hell0` is the correct password
2. **Check Lark Settings**: Enable SMTP in your Lark admin panel
3. **Try Alternative**: Use Gmail for testing (easier setup)
4. **Contact Support**: Reach out to Lark support if issues persist

## Email Marketing System Status

✅ Backend code is working
✅ Database has subscribers
✅ Campaign creation works
✅ Email service is configured
❌ SMTP authentication needs to be fixed

Once authentication is working, emails will send automatically!
