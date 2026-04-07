# Email System Deployment Checklist

Use this checklist to ensure your email system is fully configured and working.

---

## Pre-Deployment Setup

### ✅ 1. Gmail Configuration
- [ ] Gmail account: sabingopali22@gmail.com
- [ ] 2-Step Verification enabled
- [ ] App Password generated
- [ ] App Password copied (16 characters, no spaces)

**How to verify:**
```bash
# Go to: https://myaccount.google.com/security
# Check: 2-Step Verification is ON
# Generate: App passwords → Mail → Other (OMSHREEGUIDANCE)
```

---

### ✅ 2. Environment Variables
- [ ] `.env` file exists in `backend/` folder
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USER=sabingopali22@gmail.com`
- [ ] `EMAIL_PASS=` (App Password, no spaces)
- [ ] `EMAIL_FROM=sabingopali22@gmail.com`

**How to verify:**
```bash
cd backend
cat .env | grep EMAIL
```

---

### ✅ 3. Backend Code
- [x] `shopifyWebhook.controller.js` updated
- [x] `booking.controller.js` updated
- [x] Email transporter configured
- [x] TLS settings optimized
- [x] Error handling added

**Status:** ✅ Already completed

---

## Testing Phase

### ✅ 4. SMTP Connection Test
- [ ] Test script runs without errors
- [ ] Connection verified message shown
- [ ] Test email received in inbox

**Run test:**
```bash
cd backend
node scripts/testGmailConnection.js
```

**Expected output:**
```
✅ SMTP connection verified successfully!
✅ Test email sent successfully!
📬 Message ID: <...>
✨ Your Gmail SMTP is configured correctly!
```

---

### ✅ 5. Complete Email Flow Test
- [ ] Test script runs without errors
- [ ] Order confirmation email received
- [ ] Email has "Schedule Now" button
- [ ] Booking link works

**Run test:**
```bash
cd backend
node scripts/testCompleteEmailFlow.js
```

**Expected output:**
```
✅ Order confirmation email sent successfully!
📬 Message ID: <...>
✨ Complete email flow test successful!
```

**Check your inbox:**
- [ ] Email from "OMSHREEGUIDANCE <sabingopali22@gmail.com>"
- [ ] Subject: "Order Confirmation #1001 - OMSHREEGUIDANCE"
- [ ] Orange gradient header
- [ ] "Schedule Now" button visible
- [ ] Order summary included
- [ ] Professional design

---

## Shopify Configuration

### ✅ 6. Webhook Setup
- [ ] Logged into Shopify Admin
- [ ] Navigated to Settings → Notifications → Webhooks
- [ ] Webhook created or verified:
  - Event: `Order creation`
  - Format: `JSON`
  - URL: `https://your-domain.com/webhook/order-confirmation`
  - Status: Active

**How to verify:**
```
1. Go to Shopify Admin
2. Settings → Notifications → Webhooks
3. Look for "Order creation" webhook
4. Verify URL matches your backend
5. Check status is "Active"
```

---

### ✅ 7. Webhook Secret (Optional but Recommended)
- [ ] Webhook signing secret copied from Shopify
- [ ] Added to `.env` as `SHOPIFY_WEBHOOK_SECRET=`
- [ ] Backend restarted after adding secret

**How to get:**
```
1. In Shopify webhook settings
2. Click on the webhook
3. Copy "Signing secret"
4. Add to backend/.env
5. Restart backend
```

---

## Production Testing

### ✅ 8. Backend Server
- [ ] Backend server is running
- [ ] No errors in logs
- [ ] Webhook endpoint accessible
- [ ] Database connected

**How to verify:**
```bash
# Check if running
pm2 status
# or
ps aux | grep node

# Check logs
pm2 logs backend --lines 50

# Test health endpoint
curl http://localhost:3000/api/health
```

---

### ✅ 9. Test Purchase
- [ ] Shopify store accessible
- [ ] Test mode enabled (if available)
- [ ] Product added to cart
- [ ] Checkout completed
- [ ] Payment processed

**Test order details:**
- Order number: _______
- Customer email: _______
- Product: _______
- Amount: _______

---

### ✅ 10. Email Verification
- [ ] Order confirmation email received
- [ ] Email from sabingopali22@gmail.com
- [ ] Subject line correct
- [ ] Order details accurate
- [ ] "Schedule Now" button visible
- [ ] Button links to booking page
- [ ] Email not in spam folder

**Check:**
- From: OMSHREEGUIDANCE <sabingopali22@gmail.com>
- To: [customer email]
- Subject: Order Confirmation #[number] - OMSHREEGUIDANCE

---

### ✅ 11. Booking Flow
- [ ] Clicked "Schedule Now" button
- [ ] Booking page loaded
- [ ] Order info pre-filled
- [ ] Calendar displayed
- [ ] Date/time selected
- [ ] Booking submitted
- [ ] Booking confirmation email received

**Booking confirmation check:**
- [ ] Email from sabingopali22@gmail.com
- [ ] Subject includes date and time
- [ ] Session details correct
- [ ] Instructions included

---

## Post-Deployment

### ✅ 12. Monitoring
- [ ] Backend logs monitored
- [ ] Email delivery rate tracked
- [ ] Booking conversion tracked
- [ ] Customer feedback collected

**Set up monitoring:**
```bash
# Watch logs in real-time
pm2 logs backend --lines 100

# Check for errors
pm2 logs backend --err

# Monitor email sending
grep "email sent" backend/logs/*.log
```

---

### ✅ 13. Shopify Email Settings (Optional)
- [ ] Decided: Keep or disable Shopify's order confirmation
- [ ] If disabling: Settings → Notifications → Order confirmation → Disable
- [ ] If keeping: Both emails will be sent

**Recommendation:**
- Keep both initially
- Monitor customer feedback
- Disable Shopify's after confirming yours works well

---

### ✅ 14. Documentation
- [x] Setup guide created (GMAIL_SMTP_SETUP.md)
- [x] Quick start guide created (QUICK_START_EMAIL_SETUP.md)
- [x] Complete summary created (EMAIL_SETUP_COMPLETE.md)
- [x] Flow diagram created (EMAIL_FLOW_DIAGRAM.md)
- [x] This checklist created

---

## Troubleshooting

### If emails not sending:

**Check 1: SMTP Connection**
```bash
node backend/scripts/testGmailConnection.js
```
- If fails: Check App Password in .env
- If succeeds: Issue is with webhook

**Check 2: Webhook Receiving**
```bash
pm2 logs backend | grep webhook
```
- Look for: "Received Shopify order webhook"
- If not found: Check Shopify webhook configuration

**Check 3: Backend Errors**
```bash
pm2 logs backend --err
```
- Look for: Email sending errors
- Common issues: SMTP auth, connection timeout

**Check 4: Gmail Blocking**
- Go to: https://myaccount.google.com/notifications
- Check for: Blocked sign-in attempts
- Action: Approve the sign-in

---

## Success Criteria

Your email system is fully working when:

- [x] Test emails send successfully
- [ ] Shopify webhook configured
- [ ] Test purchase triggers email
- [ ] Email received from sabingopali22@gmail.com
- [ ] "Schedule Now" button works
- [ ] Booking form loads correctly
- [ ] Booking confirmation email sent
- [ ] No errors in backend logs
- [ ] Customer experience is smooth

---

## Final Verification

Run all tests one more time:

```bash
# Test 1: SMTP Connection
cd backend
node scripts/testGmailConnection.js

# Test 2: Complete Email Flow
node scripts/testCompleteEmailFlow.js

# Test 3: Backend Health
curl http://localhost:3000/api/health

# Test 4: Check Logs
pm2 logs backend --lines 50
```

All tests passing? ✅ **You're ready for production!**

---

## Support Contacts

- **Gmail Issues:** https://support.google.com/mail
- **Shopify Webhooks:** https://help.shopify.com/en/manual/orders/notifications/webhooks
- **Backend Logs:** `pm2 logs backend`

---

## Notes

Date completed: _______________
Completed by: _______________
Test order number: _______________
Any issues encountered: _______________
_______________________________________________
_______________________________________________

---

## Quick Commands Reference

```bash
# Start backend
cd backend && npm start

# Test email
node backend/scripts/testGmailConnection.js

# View logs
pm2 logs backend

# Restart backend
pm2 restart backend

# Check status
pm2 status

# Stop backend
pm2 stop backend
```

---

**Status:** Ready for deployment ✅

Once you complete all checkboxes, your email system will be fully operational!
