# Postman Testing Guide for Webhook

## 📥 Import the Collection

### Method 1: Import JSON File
1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop `OMSHREEGUIDANCE_Webhook_Tests.postman_collection.json`
4. Click **Import**

### Method 2: Manual Setup
Follow the manual setup instructions below if you prefer to create requests manually.

---

## 🧪 Test Requests (In Order)

### Test 1: Health Check ✅
**Purpose:** Verify the test endpoint is working

**Request:**
```
GET https://omshreeguidance.com/webhook/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Shopify webhook endpoint is active",
  "timestamp": "2026-04-07T..."
}
```

**Status:** Should return `200 OK`

---

### Test 2: Simple Endpoint Check 🔍
**Purpose:** Check if the order-confirmation endpoint exists

**Request:**
```
POST https://omshreeguidance.com/webhook/order-confirmation
Content-Type: application/json

{
  "test": true
}
```

**Expected Responses:**

**Before Deployment (Current):**
```json
{
  "error": "API endpoint not found"
}
```
Status: `404 Not Found` ❌

**After Deployment:**
```json
{
  "error": "Order missing email address"
}
```
or
```json
{
  "error": "Invalid signature"
}
```
Status: `400 Bad Request` or `401 Unauthorized` ✅ (This is GOOD! Means endpoint exists)

---

### Test 3: Minimal Order Data 📦
**Purpose:** Test with basic order structure

**Request:**
```
POST https://omshreeguidance.com/webhook/order-confirmation
Content-Type: application/json
X-Shopify-Topic: orders/create
X-Shopify-Shop-Domain: test-store.myshopify.com

{
  "id": 123456789,
  "order_number": 1001,
  "email": "test@example.com",
  "customer": {
    "first_name": "Test",
    "last_name": "Customer"
  },
  "line_items": [
    {
      "title": "Free Discovery Call",
      "variant_title": null,
      "quantity": 1,
      "price": "0.00"
    }
  ],
  "total_price": "0.00",
  "subtotal_price": "0.00",
  "total_tax": "0.00",
  "currency": "USD",
  "created_at": "2026-04-07T10:00:00Z"
}
```

**Expected Response (if deployed and no webhook secret):**
```json
{
  "success": true,
  "message": "Order confirmation email sent",
  "order_number": "1001"
}
```
Status: `200 OK`

**Expected Response (if webhook secret is set):**
```json
{
  "error": "Invalid signature"
}
```
Status: `401 Unauthorized` (This is normal - signature verification is working)

---

### Test 4: Full Order Data 📋
**Purpose:** Test with complete Shopify order structure

**Request:**
```
POST https://omshreeguidance.com/webhook/order-confirmation
Content-Type: application/json
X-Shopify-Topic: orders/create
X-Shopify-Shop-Domain: test-store.myshopify.com

{
  "id": 123456789,
  "order_number": 1001,
  "email": "customer@example.com",
  "customer": {
    "id": 987654321,
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-0123"
  },
  "line_items": [
    {
      "id": 111111111,
      "title": "Free Discovery Call - 30 Minutes",
      "variant_title": "Standard Session",
      "quantity": 1,
      "price": "0.00",
      "sku": "DISCOVERY-30",
      "vendor": "OMSHREEGUIDANCE",
      "product_id": 222222222,
      "variant_id": 333333333
    }
  ],
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "name": "John Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "San Francisco",
    "province": "California",
    "province_code": "CA",
    "country": "United States",
    "country_code": "US",
    "zip": "94102",
    "phone": "+1-555-0123"
  },
  "billing_address": {
    "first_name": "John",
    "last_name": "Doe",
    "name": "John Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "San Francisco",
    "province": "California",
    "province_code": "CA",
    "country": "United States",
    "country_code": "US",
    "zip": "94102",
    "phone": "+1-555-0123"
  },
  "total_price": "0.00",
  "subtotal_price": "0.00",
  "total_tax": "0.00",
  "total_shipping_price_set": {
    "shop_money": {
      "amount": "0.00",
      "currency_code": "USD"
    }
  },
  "currency": "USD",
  "financial_status": "paid",
  "fulfillment_status": null,
  "created_at": "2026-04-07T10:30:00Z",
  "updated_at": "2026-04-07T10:30:00Z",
  "order_status_url": "https://test-store.myshopify.com/account/orders/123456789",
  "note": "Test order for webhook verification",
  "tags": "test, webhook"
}
```

---

### Test 5: Test Email Delivery 📧
**Purpose:** Receive actual email to verify email sending works

**⚠️ IMPORTANT:** Replace `YOUR_EMAIL@example.com` with your actual email!

**Request:**
```
POST https://omshreeguidance.com/webhook/order-confirmation
Content-Type: application/json
X-Shopify-Topic: orders/create
X-Shopify-Shop-Domain: omshreeguidance.myshopify.com

{
  "id": 999888777,
  "order_number": 9999,
  "email": "YOUR_EMAIL@example.com",
  "customer": {
    "first_name": "Your",
    "last_name": "Name"
  },
  "line_items": [
    {
      "title": "Free Discovery Call",
      "variant_title": null,
      "quantity": 1,
      "price": "0.00"
    }
  ],
  "shipping_address": {
    "name": "Your Name",
    "address1": "123 Test Street",
    "city": "Test City",
    "province": "CA",
    "zip": "12345",
    "country": "United States",
    "phone": "555-0123"
  },
  "total_price": "0.00",
  "subtotal_price": "0.00",
  "total_tax": "0.00",
  "total_shipping_price_set": {
    "shop_money": {
      "amount": "0.00"
    }
  },
  "currency": "USD",
  "created_at": "2026-04-07T10:00:00Z",
  "order_status_url": "https://omshreeguidance.com/orders/test"
}
```

**If successful, you should:**
1. Get `200 OK` response
2. Receive email at your address
3. Email should have "Schedule Now" button
4. Button should link to booking calendar

---

## 📊 Understanding Responses

### ✅ Success Indicators

**Endpoint Exists:**
- Status: `200`, `400`, or `401` (NOT 404)
- Any response other than "API endpoint not found"

**Email Sent Successfully:**
- Status: `200 OK`
- Response: `{"success": true, "message": "Order confirmation email sent"}`

**Signature Verification Working:**
- Status: `401 Unauthorized`
- Response: `{"error": "Invalid signature"}`
- This is GOOD - means security is working!

### ❌ Error Indicators

**Endpoint Not Deployed:**
- Status: `404 Not Found`
- Response: `{"error": "API endpoint not found"}`
- Action: Deploy backend code

**Email Configuration Issue:**
- Status: `500 Internal Server Error`
- Response: Contains email-related error
- Action: Check email credentials in .env

**Missing Required Data:**
- Status: `400 Bad Request`
- Response: `{"error": "Order missing email address"}`
- Action: Add email field to request body

---

## 🔧 Manual Setup in Postman

If you prefer to create requests manually:

### Request 1: Health Check
1. Create new request
2. Method: `GET`
3. URL: `https://omshreeguidance.com/webhook/test`
4. Send

### Request 2: Order Confirmation Test
1. Create new request
2. Method: `POST`
3. URL: `https://omshreeguidance.com/webhook/order-confirmation`
4. Headers:
   - `Content-Type: application/json`
5. Body (raw JSON):
   ```json
   {
     "id": 123456789,
     "order_number": 1001,
     "email": "test@example.com",
     "customer": {
       "first_name": "Test",
       "last_name": "Customer"
     },
     "line_items": [
       {
         "title": "Free Discovery Call",
         "quantity": 1,
         "price": "0.00"
       }
     ],
     "total_price": "0.00",
     "subtotal_price": "0.00",
     "total_tax": "0.00",
     "currency": "USD",
     "created_at": "2026-04-07T10:00:00Z"
   }
   ```
6. Send

---

## 🎯 Testing Checklist

- [ ] Test 1: Health check returns success
- [ ] Test 2: Order endpoint returns something other than 404
- [ ] Test 3: Minimal order data processes correctly
- [ ] Test 4: Full order data processes correctly
- [ ] Test 5: Email is received with "Schedule Now" button
- [ ] Verify booking calendar link works
- [ ] Check email arrives in inbox (not spam)
- [ ] Confirm email design looks correct

---

## 💡 Tips

1. **Start Simple:** Run Test 1 and Test 2 first to verify endpoint exists
2. **Check Responses:** Read error messages carefully - they tell you what's wrong
3. **Test Email Last:** Only test email delivery after confirming endpoint works
4. **Use Your Email:** Replace test email with your own to verify email delivery
5. **Check Spam:** If email doesn't arrive, check spam folder
6. **Monitor Logs:** Check backend server logs while testing

---

## 🐛 Troubleshooting

### 404 Error
**Problem:** Endpoint not found  
**Solution:** Deploy backend with webhook code

### 401 Error
**Problem:** Invalid signature  
**Solution:** This is normal! Signature verification is working. Real Shopify webhooks will have valid signatures.

### 500 Error
**Problem:** Server error  
**Solution:** Check backend logs for details. Usually email or database issue.

### No Email Received
**Problem:** Email not sent  
**Solution:** 
- Check response status (should be 200)
- Check spam folder
- Verify email credentials in .env
- Check backend logs for email errors

---

## 📞 Next Steps After Testing

1. ✅ Verify endpoint exists (not 404)
2. ✅ Confirm email is received
3. ✅ Test booking calendar link
4. ✅ Configure webhook in Shopify Admin
5. ✅ Make real test purchase
6. ✅ Monitor Shopify webhook delivery logs

---

**Collection File:** `OMSHREEGUIDANCE_Webhook_Tests.postman_collection.json`

Import this file into Postman to get all 5 test requests pre-configured!
