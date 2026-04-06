# Gmail Setup - Quick Reference Card

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get App Password
1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Click **App passwords**
4. Select: Mail → Other (Custom name)
5. Name it: "Email Marketing"
6. Click **Generate**
7. Copy the 16-character password (remove spaces)

### Step 2: Update .env File
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-password
EMAIL_FROM=your-email@gmail.com
```

### Step 3: Restart Backend
```bash
cd backend
npm run dev
```

### Step 4: Test
1. Login to CMS
2. Go to Email Campaigns
3. Create campaign
4. Send test email to yourself

## ✅ Checklist

- [ ] 2-Step Verification enabled
- [ ] App Password generated
- [ ] .env file updated
- [ ] Backend restarted
- [ ] Test email sent successfully

## 📊 Gmail Limits

| Account Type | Daily Limit | Hourly Limit |
|-------------|-------------|--------------|
| Free Gmail  | 500 emails  | ~100 emails  |
| Workspace   | 2,000 emails| ~400 emails  |

## 🔧 Common Issues

### "Invalid login"
→ Check App Password is correct (no spaces)
→ Verify 2-Step Verification is enabled

### "Quota exceeded"
→ Wait 24 hours
→ Upgrade to Google Workspace
→ Use professional email service

### Emails in spam
→ Include unsubscribe link
→ Avoid spam words
→ Send to engaged users only

## 📝 Your Configuration

Fill this out for reference:

```
Gmail Address: _______________________
App Password: _______________________
Date Created: _______________________
```

## 🎯 Best Practices

1. Start with 10-20 test emails
2. Gradually increase volume
3. Always include unsubscribe link
4. Monitor spam complaints
5. Keep email list clean

## 🔗 Quick Links

- Google Account Security: https://myaccount.google.com/security
- App Passwords: https://myaccount.google.com/apppasswords
- 2-Step Verification: https://myaccount.google.com/signinoptions/two-step-verification

## 📞 Need Help?

Check the full guide: `GMAIL_EMAIL_MARKETING_SETUP.md`
