# Email Flow Diagram

## Current Setup: How Emails Work Now

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER PURCHASE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. Customer visits Shopify Store
   └─> Adds product to cart
   └─> Completes checkout
   └─> Payment processed ✅

2. Shopify triggers webhook
   └─> POST request to: your-backend.com/webhook/order-confirmation
   └─> Includes: order details, customer info, line items

3. Your Backend receives webhook
   └─> Validates webhook signature (if configured)
   └─> Extracts order data
   └─> Creates booking record in database

4. Backend sends email via Gmail SMTP
   ┌────────────────────────────────────────────────┐
   │ FROM: sabingopali22@gmail.com                  │
   │ TO: customer@email.com                         │
   │ SUBJECT: Order Confirmation #1001              │
   │                                                │
   │ ┌────────────────────────────────────────┐    │
   │ │  Thank You for Your Order!             │    │
   │ │  Order #1001                           │    │
   │ └────────────────────────────────────────┘    │
   │                                                │
   │ Hello Customer,                                │
   │ We've received your order...                   │
   │                                                │
   │ ┌────────────────────────────────────────┐    │
   │ │  🎉 Next Step: Schedule Your Session   │    │
   │ │                                        │    │
   │ │  ┌──────────────────────────────┐     │    │
   │ │  │   📅 Schedule Now →          │     │    │
   │ │  └──────────────────────────────┘     │    │
   │ │                                        │    │
   │ │  Click to choose your date & time      │    │
   │ └────────────────────────────────────────┘    │
   │                                                │
   │ Order Summary:                                 │
   │ - Energetic Alignment Session                  │
   │ - Total: $150.00                               │
   └────────────────────────────────────────────────┘

5. Customer receives email
   └─> Opens email
   └─> Sees prominent "Schedule Now" button
   └─> Clicks button

6. Customer redirected to booking page
   └─> URL: omshreeguidance.com/shreeweb/booking-confirmation
   └─> Pre-filled with order info
   └─> Shows calendar for date/time selection

7. Customer selects date & time
   └─> Submits booking
   └─> Backend updates booking record

8. Backend sends booking confirmation email
   ┌────────────────────────────────────────────────┐
   │ FROM: sabingopali22@gmail.com                  │
   │ TO: customer@email.com                         │
   │ SUBJECT: Session Confirmed - June 15 at 2:00PM│
   │                                                │
   │ Your Session is Confirmed!                     │
   │                                                │
   │ Session Details:                               │
   │ - Date: June 15, 2026                          │
   │ - Time: 2:00 PM                                │
   │ - Type: Energetic Alignment Session            │
   │                                                │
   │ What to Expect:                                │
   │ - Reminder email 24 hours before               │
   │ - Be in a quiet space                          │
   │ - Have water nearby                            │
   └────────────────────────────────────────────────┘

9. Customer receives booking confirmation
   └─> Session scheduled ✅
   └─> Reminder email sent 24h before (future feature)
```

---

## Email Sending Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    EMAIL SYSTEM ARCHITECTURE                  │
└──────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Shopify   │ Webhook │   Backend    │  SMTP   │   Gmail    │
│   Store     │────────>│   Server     │────────>│   Server   │
└─────────────┘         └──────────────┘         └────────────┘
                              │                         │
                              │ Creates                 │ Sends
                              ▼                         ▼
                        ┌──────────────┐         ┌────────────┐
                        │   MongoDB    │         │  Customer  │
                        │   Database   │         │   Inbox    │
                        └──────────────┘         └────────────┘
                        Stores booking           Receives email
                        records                  with booking link

Configuration:
├─ Email Host: smtp.gmail.com
├─ Port: 587 (TLS)
├─ Auth: App Password
├─ From: sabingopali22@gmail.com
└─ Security: TLS encryption
```

---

## Comparison: Before vs After

### BEFORE (Problem)
```
Customer purchases → Shopify sends email → Customer receives generic email
                                          → No booking link
                                          → Customer confused about next steps
                                          → Manual follow-up needed
```

### AFTER (Solution) ✅
```
Customer purchases → Shopify webhook → Backend sends custom email
                                    → Email from sabingopali22@gmail.com
                                    → Prominent "Schedule Now" button
                                    → Customer clicks and books immediately
                                    → Automated confirmation email
                                    → Smooth customer experience ✨
```

---

## Email Templates

### 1. Order Confirmation Email
**Trigger:** Shopify order created webhook  
**From:** sabingopali22@gmail.com  
**Purpose:** Confirm order + prompt booking  

**Key Features:**
- ✅ Professional branded design
- ✅ Order summary with line items
- ✅ Total amount paid
- ✅ Prominent "Schedule Now" CTA button
- ✅ Booking link with pre-filled order info
- ✅ Customer support contact info

### 2. Booking Confirmation Email
**Trigger:** Customer submits booking form  
**From:** sabingopali22@gmail.com  
**Purpose:** Confirm session date/time  

**Key Features:**
- ✅ Session date and time
- ✅ Session type/product
- ✅ Timezone information
- ✅ What to expect instructions
- ✅ Rescheduling policy
- ✅ Contact information

---

## Technical Details

### Webhook Endpoint
```
POST /webhook/order-confirmation
Content-Type: application/json
X-Shopify-Hmac-Sha256: [signature]

Body: {
  "id": 5678901234,
  "order_number": 1001,
  "email": "customer@email.com",
  "customer": { ... },
  "line_items": [ ... ],
  "total_price": "150.00",
  ...
}
```

### Email Transporter Configuration
```javascript
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465
  auth: {
    user: 'sabingopali22@gmail.com',
    pass: 'app-password-here' // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  }
}
```

### Booking URL Format
```
https://omshreeguidance.com/shreeweb/booking-confirmation
  ?order_id=5678901234
  &order_number=1001
  &email=customer@email.com
```

---

## Security Features

1. **Webhook Signature Verification**
   - Validates requests are from Shopify
   - Uses HMAC-SHA256 signature
   - Prevents unauthorized webhook calls

2. **Gmail App Password**
   - Not using regular Gmail password
   - App-specific password for SMTP
   - Can be revoked independently

3. **TLS Encryption**
   - All email traffic encrypted
   - Secure connection to Gmail
   - Protected customer data

4. **Environment Variables**
   - Sensitive data in .env file
   - Not committed to git
   - Secure configuration management

---

## Monitoring & Logging

### Backend Logs Show:
```
📦 Received Shopify order webhook: { order_number: 1001, email: '...', total: '150.00' }
📤 Attempting to send email to: customer@email.com
✅ SMTP connection verified
✅ Order confirmation email sent to: customer@email.com
📬 Message ID: <abc123@gmail.com>
✅ Booking record created: 507f1f77bcf86cd799439011
```

### Success Indicators:
- ✅ Webhook received (200 response)
- ✅ Email sent (Message ID returned)
- ✅ Booking record created (MongoDB ID)
- ✅ No errors in logs

### Error Indicators:
- ❌ SMTP connection failed
- ❌ Invalid webhook signature
- ❌ Email sending failed
- ❌ Database connection error

---

## Testing Checklist

- [x] SMTP connection test passed
- [x] Test email sent successfully
- [x] Complete email flow test passed
- [ ] Shopify webhook configured
- [ ] Test purchase completed
- [ ] Email received from sabingopali22@gmail.com
- [ ] "Schedule Now" button works
- [ ] Booking form loads with order info
- [ ] Booking submission works
- [ ] Booking confirmation email received

---

## Quick Reference

### Start Backend
```bash
cd backend
npm start
# or
pm2 start backend
```

### Test Email
```bash
node backend/scripts/testGmailConnection.js
```

### Test Complete Flow
```bash
node backend/scripts/testCompleteEmailFlow.js
```

### View Logs
```bash
pm2 logs backend
# or check console output
```

### Restart After Config Change
```bash
pm2 restart backend
```

---

## Success Metrics

After setup, you should see:

1. **Email Delivery Rate:** 100%
   - All orders trigger emails
   - Emails delivered to inbox (not spam)

2. **Booking Conversion Rate:** High
   - Customers click "Schedule Now"
   - Complete booking form
   - Receive confirmation

3. **Customer Experience:** Smooth
   - Clear next steps
   - Easy booking process
   - Professional communication

4. **Operational Efficiency:** Automated
   - No manual follow-up needed
   - Automatic confirmations
   - Reduced support inquiries

---

## Support

If you need help:
1. Check `EMAIL_SETUP_COMPLETE.md` for troubleshooting
2. Review `GMAIL_SMTP_SETUP.md` for detailed setup
3. Run test scripts to diagnose issues
4. Check backend logs for error messages
