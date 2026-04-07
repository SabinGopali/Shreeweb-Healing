# Gmail SMTP Setup Guide for OMSHREEGUIDANCE

## Current Issue
Shopify is sending order confirmation emails from their own system instead of using your custom Gmail account (sabingopali22@gmail.com).

## Solution Overview
Configure your backend to send custom order confirmation emails from your Gmail account when Shopify webhooks are triggered.

---

## Step 1: Enable Gmail App Password

Since you're using Gmail, you need to create an App Password (not your regular Gmail password).

### Instructions:

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "How you sign in to Google", enable "2-Step Verification" if not already enabled
4. Once 2-Step Verification is enabled, go back to Security
5. Under "How you sign in to Google", click on "App passwords"
6. Select "Mail" as the app and "Other" as the device
7. Name it "OMSHREEGUIDANCE Backend"
8. Click "Generate"
9. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

---

## Step 2: Update .env File

Your `.env` file has been updated with the correct configuration:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=sabingopali22@gmail.com
EMAIL_PASS=kwajaygyzuxewnci  # Replace with your App Password (no spaces)
EMAIL_FROM=sabingopali22@gmail.com
```

**Important:** Replace `EMAIL_PASS` with the App Password you generated in Step 1 (remove all spaces).

---

## Step 3: Test Email Configuration

Run the test script to verify your Gmail SMTP connection:

```bash
cd backend
node scripts/testGmailConnection.js
```

This will:
- Verify the SMTP connection
- Send a test email to your Gmail account
- Show any errors if the configuration is incorrect

---

## Step 4: Configure Shopify Webhook

### Option A: Disable Shopify's Default Order Confirmation Email

1. Go to Shopify Admin
2. Navigate to: Settings → Notifications
3. Find "Order confirmation" email
4. Click on it and disable it OR customize it to not send

### Option B: Keep Both Emails (Recommended)

Keep Shopify's order confirmation AND send your custom email with booking link:
- Shopify email: Basic order details
- Your custom email: Order details + prominent booking calendar link

---

## Step 5: Set Up Shopify Webhook (If Not Already Done)

1. Go to Shopify Admin
2. Navigate to: Settings → Notifications → Webhooks
3. Click "Create webhook"
4. Configure:
   - Event: `Order creation`
   - Format: `JSON`
   - URL: `https://your-domain.com/webhook/order-confirmation`
   - API version: Latest

5. (Optional) Add webhook secret for security:
   - Copy the webhook signing secret
   - Add to `.env`: `SHOPIFY_WEBHOOK_SECRET=your_secret_here`

---

## Step 6: Restart Your Backend Server

After updating the `.env` file:

```bash
cd backend
npm start
```

Or if using PM2:

```bash
pm2 restart backend
```

---

## Testing the Complete Flow

### Test 1: Email Configuration
```bash
node backend/scripts/testGmailConnection.js
```

### Test 2: Webhook Endpoint
```bash
node backend/scripts/testWebhookEmail.js
```

### Test 3: Make a Test Purchase
1. Go to your Shopify store
2. Add a product to cart
3. Complete checkout with a test order
4. Check your email for:
   - Shopify's order confirmation (if enabled)
   - Your custom email from sabingopali22@gmail.com with booking link

---

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution:** You're using your regular Gmail password instead of an App Password.
- Follow Step 1 to generate an App Password
- Update `EMAIL_PASS` in `.env` with the App Password (no spaces)

### Error: "Connection timeout"

**Solution:** 
- Check your firewall/antivirus settings
- Make sure port 587 is not blocked
- Try using port 465 with `EMAIL_PORT=465` and `EMAIL_SECURE=true`

### Error: "self signed certificate in certificate chain"

**Solution:** Already handled in the code with:
```javascript
tls: {
  rejectUnauthorized: false,
  ciphers: 'SSLv3'
}
```

### Emails Not Sending from Webhook

**Check:**
1. Webhook is properly configured in Shopify
2. Backend server is running and accessible
3. Check backend logs for errors: `pm2 logs backend` or check console output
4. Verify webhook URL is correct and publicly accessible

### Gmail Blocks the Email

**Solution:**
- Make sure you're using an App Password (not regular password)
- Check Gmail's "Less secure app access" is not blocking (shouldn't be needed with App Password)
- Check if Gmail flagged the login attempt: https://myaccount.google.com/notifications

---

## What Changed

### Files Modified:

1. **backend/.env**
   - Removed spaces from `EMAIL_PASS`
   - Updated comments

2. **backend/controllers/shopifyWebhook.controller.js**
   - Added password space removal: `EMAIL_PASS?.replace(/\s+/g, '')`
   - Enhanced TLS configuration
   - Better error logging

3. **backend/controllers/booking.controller.js**
   - Same email configuration improvements
   - Consistent with webhook controller

### Files Created:

1. **backend/scripts/testGmailConnection.js**
   - Test script to verify Gmail SMTP configuration
   - Sends test email to verify everything works

2. **GMAIL_SMTP_SETUP.md** (this file)
   - Complete setup and troubleshooting guide

---

## Email Flow After Setup

1. Customer completes purchase on Shopify
2. Shopify triggers webhook to your backend
3. Your backend receives order data
4. Backend sends custom email from `sabingopali22@gmail.com` with:
   - Order confirmation details
   - Prominent "Schedule Now" button
   - Booking calendar link
5. Customer clicks button and schedules their session
6. Backend sends booking confirmation email

---

## Next Steps

1. ✅ Generate Gmail App Password
2. ✅ Update `.env` with App Password (no spaces)
3. ✅ Run test script: `node backend/scripts/testGmailConnection.js`
4. ✅ Restart backend server
5. ✅ Make a test purchase to verify complete flow
6. ✅ (Optional) Disable Shopify's default order confirmation if desired

---

## Support

If you continue to have issues:
- Check backend logs for detailed error messages
- Verify all environment variables are loaded correctly
- Make sure your domain/server is publicly accessible for webhooks
- Test with the provided test scripts before making real purchases
