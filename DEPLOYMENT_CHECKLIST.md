# Deployment Checklist - Custom Order Confirmation Emails

## Current Status
- ✅ All webhook code is complete locally
- ✅ `/webhook/test` endpoint works in production
- ❌ `/webhook/order-confirmation` returns 404 (missing in production)
- ❌ Custom emails not being sent (backend not deployed)

## Root Cause
The production backend server doesn't have the latest code with:
- Webhook controller (`backend/controllers/shopifyWebhook.controller.js`)
- Webhook routes (`backend/routes/shopifyWebhook.route.js`)
- Updated `backend/index.js` with webhook route registration

## Files That MUST Be Deployed

### 1. Backend Files (Critical)
```
backend/controllers/shopifyWebhook.controller.js
backend/routes/shopifyWebhook.route.js
backend/controllers/booking.controller.js
backend/routes/booking.route.js
backend/models/Booking.model.js
backend/index.js (updated with webhook routes)
backend/.env (with correct email credentials)
```

### 2. Environment Variables (Production .env)
Ensure your production `.env` file has:
```env
# Email Configuration
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=bookings@omshreeguidance.com
EMAIL_PASS=OrYjnnJsTnhDKj67
EMAIL_FROM=bookings@omshreeguidance.com

# Shopify Webhook Secret (get from Shopify Admin)
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret_here

# Frontend URL
FRONTEND_URL=https://omshreeguidance.com
CLIENT_URL=https://omshreeguidance.com
NODE_ENV=production
```

## Deployment Steps

### Step 1: Deploy Backend Code
1. Upload all backend files to your production server
2. Ensure `node_modules` are installed: `npm install`
3. Verify `nodemailer` is installed: `npm list nodemailer`
4. Restart your backend server

### Step 2: Verify Deployment
Test the webhook endpoint:
```bash
curl https://omshreeguidance.com/webhook/order-confirmation
```

Expected response (should NOT be 404):
```json
{"error": "Invalid signature"}
```
or
```json
{"error": "Order missing email address"}
```

### Step 3: Configure Shopify Webhook
1. Go to Shopify Admin > Settings > Notifications > Webhooks
2. Find the "Order confirmation" webhook
3. Verify URL is: `https://omshreeguidance.com/webhook/order-confirmation`
4. Format: JSON
5. API version: Latest stable

### Step 4: Get Webhook Secret
1. In Shopify webhook settings, copy the webhook signing secret
2. Add it to production `.env`:
   ```env
   SHOPIFY_WEBHOOK_SECRET=your_actual_secret_here
   ```
3. Restart backend server

### Step 5: Test End-to-End
1. Make a test purchase on your site
2. Check Shopify Admin > Settings > Notifications > Webhooks
3. Click on the webhook and view "Recent deliveries"
4. Should show HTTP 200 success response
5. Check customer email inbox for order confirmation with "Schedule Now" button

## Troubleshooting

### If webhook still returns 404:
- Verify `backend/index.js` has this line:
  ```javascript
  app.use('/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
    req.rawBody = req.body.toString('utf8');
    next();
  }, shopifyWebhookRoute);
  ```
- Verify the route is registered BEFORE `express.json()` middleware
- Check server logs for startup errors

### If emails aren't being sent:
- Check server logs for email errors
- Verify Lark SMTP credentials are correct
- Test email sending with: `node backend/scripts/testEmailSending.js`
- Check spam folder in customer email

### If signature verification fails:
- Verify `SHOPIFY_WEBHOOK_SECRET` matches Shopify Admin
- Check that raw body is being preserved (no JSON parsing before webhook route)

## Alternative Solution (No Deployment Required)

If you can't deploy immediately, you can add the booking button to Shopify's default email template:

1. Go to Shopify Admin > Settings > Notifications
2. Click "Order confirmation"
3. Add this HTML at the bottom of the email template:

```liquid
{% if first_time_accessed %}
<div style="margin: 20px 0; padding: 20px; background: #fef3c7; border-left: 4px solid #F59E0B; border-radius: 8px; text-align: center;">
  <h3 style="margin: 0 0 10px 0; color: #92400e;">🎉 Next Step: Schedule Your Session</h3>
  <p style="margin: 0 0 15px 0; color: #78716c;">Your payment is confirmed! Let's find the perfect time.</p>
  <a href="https://omshreeguidance.com/shreeweb/booking-confirmation?order_id={{ order.id }}&order_number={{ order.order_number }}&email={{ order.email }}" 
     style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
    Schedule Now →
  </a>
</div>
{% endif %}
```

This will add the booking button to Shopify's email immediately without requiring backend deployment.

## Expected Behavior After Deployment

1. Customer completes purchase on website
2. Shopify sends webhook to your backend
3. Your backend sends beautiful custom email with "Schedule Now" button
4. Customer clicks button → redirected to booking calendar
5. Customer selects date/time → booking confirmed
6. Customer receives booking confirmation email

## Support
If issues persist after deployment, check:
- Server logs: `pm2 logs` or `journalctl -u your-service`
- Shopify webhook delivery logs
- Email service logs (Lark dashboard)
