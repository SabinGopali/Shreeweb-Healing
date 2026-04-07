# Quick Start: Fix Shopify Email Issue

## Problem
Shopify sends emails from their account, not from your Gmail (sabingopali22@gmail.com).

## Solution Status
✅ Backend code updated and tested
✅ Gmail SMTP connection verified
⚠️ Need to complete one more step

---

## What You Need to Do NOW

### Step 1: Get Gmail App Password (5 minutes)

Your current password in `.env` won't work with Gmail SMTP. You need an "App Password":

1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not already enabled)
3. Go back to Security page
4. Click "App passwords" (under "How you sign in to Google")
5. Select:
   - App: "Mail"
   - Device: "Other" → Type "OMSHREEGUIDANCE"
6. Click "Generate"
7. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Open `backend/.env` and replace this line:

```env
EMAIL_PASS=kwajaygyzuxewnci
```

With your new App Password (remove all spaces):

```env
EMAIL_PASS=abcdefghijklmnop
```

### Step 3: Restart Backend

```bash
cd backend
npm start
```

Or if using PM2:
```bash
pm2 restart backend
```

### Step 4: Test It

```bash
cd backend
node scripts/testGmailConnection.js
```

You should see: ✅ Test email sent successfully!

---

## What Happens After Setup

When a customer purchases from Shopify:

1. ✅ Shopify processes the payment
2. ✅ Shopify sends webhook to your backend
3. ✅ Your backend sends email from **sabingopali22@gmail.com** with:
   - Order confirmation
   - Prominent "Schedule Now" button
   - Booking calendar link
4. ✅ Customer schedules their session
5. ✅ Backend sends booking confirmation

---

## Optional: Disable Shopify's Email

If you don't want Shopify to send their own order confirmation:

1. Go to Shopify Admin
2. Settings → Notifications
3. Find "Order confirmation"
4. Disable it

**Recommendation:** Keep both emails initially, then disable Shopify's once you confirm yours is working.

---

## Files Changed

✅ `backend/.env` - Email configuration
✅ `backend/controllers/shopifyWebhook.controller.js` - Email sending logic
✅ `backend/controllers/booking.controller.js` - Booking confirmation emails
✅ `backend/scripts/testGmailConnection.js` - Test script (NEW)

---

## Testing Checklist

- [ ] Generated Gmail App Password
- [ ] Updated `EMAIL_PASS` in `.env`
- [ ] Restarted backend server
- [ ] Ran test script successfully
- [ ] Made test purchase on Shopify
- [ ] Received email from sabingopali22@gmail.com
- [ ] Clicked "Schedule Now" button
- [ ] Booking calendar works

---

## Need Help?

See detailed guide: `GMAIL_SMTP_SETUP.md`

Common issues:
- "Invalid login" → Use App Password, not regular password
- "Connection timeout" → Check firewall/port 587
- No email received → Check spam folder, verify webhook is configured in Shopify
