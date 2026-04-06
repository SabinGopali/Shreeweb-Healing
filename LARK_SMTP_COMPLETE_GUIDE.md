# Complete Guide: Lark SMTP Setup for Email Marketing

## Important Discovery! 🔑

**NO, you cannot use your normal Lark login password for SMTP!**

Lark requires you to generate a **special password** for third-party email clients (like our email marketing system). This is similar to Gmail's "App Passwords".

## Step-by-Step Setup Guide

### Step 1: Access Lark Admin Console

**Option 1: Direct URL**
- Go to: https://www.larksuite.com/admin
- Log in with your Lark account

**Option 2: Through Lark App**
- Open Lark desktop app or web version
- Click on your profile/organization name
- Look for "Admin Console" or "Admin" option

**Note:** Only organization administrators can access the Admin Console. If you don't see this option, you might need admin permissions.

### Step 2: Enable Third-Party Email Client Access

1. In the Lark Admin Console, navigate to:
   ```
   Product Settings > Mail > Third-party Email Client Access
   ```
   OR
   ```
   Settings > Mail Settings > Allow third-party email clients
   ```

2. Enable the option: **"Allow members to access Lark Mail using third-party email clients"**

3. This setting allows you (and your team members) to generate special passwords for SMTP access.

### Step 3: Generate SMTP Password

**As a User (not admin):**

1. Open Lark Mail in the Lark app
2. Go to **Settings** (gear icon)
3. Look for **"Third-party email client"** or **"IMAP/SMTP Settings"**
4. Click **"Generate Password"** or **"Create Password"**
5. Select the device type (you can choose "Other" or "Desktop")
6. Lark will generate a special password for you
7. **Copy this password immediately** - you won't be able to see it again!

**This generated password is what you need to use in your `.env` file, NOT your regular Lark login password!**

### Step 4: Get SMTP Server Details

While generating the password, Lark should also show you the SMTP server details:

**Standard Configuration:**
```
SMTP Server: smtp.feishu.cn (or smtp.larksuite.com)
SMTP Port: 465 (SSL) or 587 (TLS)
Username: Your full Lark email address (bookings@omshreeguidance.com)
Password: The generated password from Step 3
```

### Step 5: Update Your .env File

Replace the password in your `backend/.env` file:

```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=bookings@omshreeguidance.com
EMAIL_PASS=YOUR_GENERATED_PASSWORD_HERE
EMAIL_FROM=bookings@omshreeguidance.com
```

**Important:** Replace `YOUR_GENERATED_PASSWORD_HERE` with the password you generated in Step 3.

### Step 6: Restart Backend and Test

```bash
cd backend
npm run dev
```

Then test email sending:
```bash
cd backend
node scripts/testEmailSending.js
```

## Troubleshooting

### "I can't find the Admin Console"

**Solution 1:** You might not be an admin
- Ask your organization's Lark administrator to:
  1. Enable third-party email client access
  2. Give you admin permissions
  3. Or generate the SMTP password for you

**Solution 2:** Create your own Lark organization
- If you're using a personal account, you might need to create your own organization
- Go to: https://www.larksuite.com/
- Sign up for a free account
- Create a new organization (you'll be the admin)

### "I can't find the password generation option"

This means the admin hasn't enabled third-party email client access yet.

**As Admin:**
1. Go to Admin Console
2. Navigate to: Product Settings > Mail
3. Enable "Allow third-party email clients"
4. Save changes

**As User:**
1. Ask your admin to enable this feature
2. Once enabled, you'll see the option in Lark Mail settings

### "Authentication still fails after generating password"

**Check these:**
1. Make sure you copied the entire generated password (no spaces)
2. Verify your email address is correct
3. Try port 587 with `EMAIL_SECURE=false` instead of 465
4. Make sure the password hasn't expired (some systems expire them)

### Alternative SMTP Settings to Try

**Option 1: TLS instead of SSL**
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Option 2: Alternative host**
```env
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

**Option 3: International domain**
```env
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## Quick Reference

| Setting | Value |
|---------|-------|
| Admin Console URL | https://www.larksuite.com/admin |
| SMTP Host | smtp.feishu.cn or smtp.larksuite.com |
| SMTP Port (SSL) | 465 |
| SMTP Port (TLS) | 587 |
| Username | Your full Lark email address |
| Password | **Generated password** (NOT login password) |
| Daily Limit | 450 emails (free tier) |
| Monthly Limit | ~15,000 emails (free tier) |

## Important Notes

✅ **DO use:** The generated SMTP password from Lark Mail settings
❌ **DON'T use:** Your regular Lark login password

✅ **DO:** Keep the generated password secure
❌ **DON'T:** Share it or commit it to version control

✅ **DO:** Generate a new password if you lose it
❌ **DON'T:** Try to recover the old one (you can't)

## Still Having Issues?

### Option 1: Contact Lark Support
- Visit: https://www.larksuite.com/hc/en-US/
- Search for "SMTP" or "third-party email client"
- Contact support if needed

### Option 2: Use Gmail Instead (Easier)
If Lark is too complicated, Gmail is much easier to set up:
1. Enable 2-Step Verification
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Use Gmail SMTP settings (see `GMAIL_EMAIL_MARKETING_SETUP.md`)

### Option 3: Use SendGrid (Professional)
- Free tier: 100 emails/day
- Easier setup than Lark
- Better deliverability
- Sign up at: https://sendgrid.com

## Summary

The key issue was: **You need a special generated password for SMTP, not your regular login password!**

Follow the steps above to:
1. Access Lark Admin Console
2. Enable third-party email client access
3. Generate SMTP password
4. Update .env file
5. Test and send emails!

---

**Need help?** Check the other documentation files or switch to Gmail for easier setup.
