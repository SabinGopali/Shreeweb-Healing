# How to Check Shopify Webhook Deliveries

## Quick Access

**Direct URL:**
```
https://admin.shopify.com/store/YOUR_STORE_NAME/settings/notifications
```

Replace `YOUR_STORE_NAME` with your actual Shopify store name.

## Step-by-Step Instructions

### Step 1: Navigate to Webhooks

1. Log in to **Shopify Admin**
2. Click **Settings** (gear icon, bottom left)
3. Click **Notifications**
4. Scroll down to **Webhooks** section

### Step 2: Locate Your Webhook

Look for:
- **Event:** Order creation
- **URL:** `https://omshreeguidance.com/webhook/order-confirmation`
- **Format:** JSON
- **API version:** (Latest stable)

### Step 3: View Webhook Details

Click on the webhook to see:

```
┌─────────────────────────────────────────────┐
│ Order creation webhook                       │
├─────────────────────────────────────────────┤
│ URL: https://omshreeguidance.com/webhook/  │
│      order-confirmation                      │
│ Format: JSON                                 │
│ API version: 2024-01                        │
│                                              │
│ [Send test notification]                    │
└─────────────────────────────────────────────┘
```

### Step 4: Check Recent Deliveries

Scroll down to see **Recent deliveries** (last 30 days):

```
┌──────────────────────────────────────────────────────────┐
│ Recent deliveries                                         │
├──────────────┬──────────────┬──────────────┬─────────────┤
│ Date/Time    │ Order        │ Status       │ Response    │
├──────────────┼──────────────┼──────────────┼─────────────┤
│ Apr 7, 10:30 │ #1001        │ ❌ 404       │ Not Found   │
│ Apr 6, 15:20 │ #1000        │ ❌ 404       │ Not Found   │
│ Apr 5, 12:10 │ #999         │ ❌ 404       │ Not Found   │
└──────────────┴──────────────┴──────────────┴─────────────┘
```

### Step 5: View Delivery Details

Click on any delivery to see full details:

```
┌─────────────────────────────────────────────────────────┐
│ Delivery Details                                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ REQUEST                                                  │
│ ├─ Method: POST                                         │
│ ├─ URL: https://omshreeguidance.com/webhook/           │
│ │        order-confirmation                             │
│ ├─ Headers:                                             │
│ │   ├─ Content-Type: application/json                  │
│ │   ├─ X-Shopify-Topic: orders/create                  │
│ │   ├─ X-Shopify-Hmac-Sha256: abc123...                │
│ │   └─ X-Shopify-Shop-Domain: your-store.myshopify.com│
│ └─ Body: { "id": 123, "order_number": 1001, ... }      │
│                                                          │
│ RESPONSE                                                 │
│ ├─ Status: 404 Not Found                               │
│ ├─ Response Time: 45ms                                  │
│ └─ Body: {"error":"API endpoint not found"}            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## What Each Status Means

### ✅ 200 OK - Success
```json
{
  "success": true,
  "message": "Order confirmation email sent",
  "order_number": "1001"
}
```
**Meaning:** Webhook received, email sent successfully

### ❌ 404 Not Found - Endpoint Missing
```json
{
  "error": "API endpoint not found"
}
```
**Meaning:** Backend doesn't have the webhook route (CURRENT ISSUE)
**Solution:** Deploy backend with webhook code

### ❌ 401 Unauthorized - Invalid Signature
```json
{
  "error": "Invalid signature"
}
```
**Meaning:** Webhook secret doesn't match
**Solution:** Update `SHOPIFY_WEBHOOK_SECRET` in .env

### ❌ 500 Internal Server Error
```json
{
  "error": "Failed to process order webhook",
  "message": "Email sending failed"
}
```
**Meaning:** Backend error (email, database, etc.)
**Solution:** Check server logs for details

### ⏱️ Timeout
```
Request timed out after 5 seconds
```
**Meaning:** Backend took too long to respond
**Solution:** Optimize webhook handler, check server performance

## Testing Your Webhook

### Method 1: Send Test Notification (Recommended)

1. Go to webhook details page
2. Click **Send test notification** button
3. Shopify sends sample order data
4. Check delivery status immediately

**Note:** Test notifications use sample data, not real orders.

### Method 2: Make a Test Purchase

1. Create a test product (free or $0.01)
2. Complete checkout on your website
3. Check webhook deliveries
4. Verify email was sent

### Method 3: Use Webhook Testing Tool

Use a tool like **webhook.site** temporarily:

1. Go to https://webhook.site
2. Copy the unique URL
3. Temporarily change webhook URL in Shopify
4. Make test purchase
5. See the exact data Shopify sends
6. Change URL back to your production URL

## Current Status Check

Based on your setup, here's what you should see:

### Before Deployment (Current State)
```
Status: 404 Not Found
Response: {"error":"API endpoint not found"}
```

### After Deployment (Expected)
```
Status: 200 OK
Response: {
  "success": true,
  "message": "Order confirmation email sent",
  "order_number": "1001"
}
```

## Troubleshooting Guide

### If you see 404 errors:
- [ ] Backend not deployed with webhook code
- [ ] Webhook URL is incorrect
- [ ] Backend server is down

### If you see 401 errors:
- [ ] `SHOPIFY_WEBHOOK_SECRET` not set in .env
- [ ] Webhook secret doesn't match Shopify
- [ ] Raw body not preserved in middleware

### If you see 500 errors:
- [ ] Check backend server logs
- [ ] Email credentials incorrect
- [ ] Database connection failed
- [ ] Code error in webhook handler

### If you see timeouts:
- [ ] Backend server slow or overloaded
- [ ] Email sending taking too long
- [ ] Database query slow

## Getting Webhook Secret

You'll need this for signature verification:

1. Go to webhook details page
2. Look for **Webhook signing secret** or **Secret**
3. Copy the secret value
4. Add to production .env:
   ```env
   SHOPIFY_WEBHOOK_SECRET=your_secret_here
   ```
5. Restart backend server

## Monitoring Best Practices

### Regular Checks
- Check webhook deliveries daily
- Monitor for failed deliveries
- Set up alerts for failures

### After Deployment
- Make test purchase immediately
- Verify 200 OK response
- Check customer email inbox
- Test booking calendar flow

### Ongoing Monitoring
- Check weekly for any failures
- Monitor email delivery rates
- Track booking completion rates

## Quick Reference

| Status Code | Meaning | Action Required |
|------------|---------|-----------------|
| 200 | Success | None - working correctly |
| 404 | Not Found | Deploy backend code |
| 401 | Unauthorized | Fix webhook secret |
| 500 | Server Error | Check server logs |
| Timeout | Too Slow | Optimize code |

## Support Resources

**Shopify Documentation:**
- https://shopify.dev/docs/apps/webhooks

**Your Backend Logs:**
```bash
# If using PM2
pm2 logs

# If using systemd
journalctl -u your-service -f

# If using Docker
docker logs your-container -f
```

**Test Scripts:**
```bash
# Test production webhook
node backend/scripts/testProductionWebhook.js

# Test email sending
node backend/scripts/testWebhookEmail.js
```

---

**Next Steps:**
1. Check current webhook deliveries (should show 404)
2. Deploy backend with webhook code
3. Send test notification
4. Verify 200 OK response
5. Make test purchase
6. Confirm email received with "Schedule Now" button
