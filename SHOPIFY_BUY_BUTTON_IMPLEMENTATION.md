# Shopify Buy Button Implementation

## Overview
This document describes the complete implementation of Shopify Buy Button integration for offerings, with proper backend handling.

## Architecture

### Backend Implementation

#### 1. Database Model (`backend/models/ShreeWebOffering.model.js`)
- Added `shopifyBuyButtonEmbed` field to store the complete Shopify Buy Button HTML/JavaScript code
- Field type: String with trim and default empty string
- Stored alongside existing `shopifyProductId` and `shopifyVariantId` fields

#### 2. Controller (`backend/controllers/shreeWebOffering.controller.js`)
Updated both `createOffering` and `updateOffering` functions to handle the new field:
- Accepts `shopifyBuyButtonEmbed` from request body
- Validates and trims the embed code
- Saves to database
- Returns in API responses

#### 3. API Endpoints
- **GET** `/backend/shreeweb-offerings/public` - Returns all active offerings including embed codes
- **GET** `/backend/shreeweb-offerings/:id` - Returns single offering with embed code (admin)
- **POST** `/backend/shreeweb-offerings/` - Create offering with embed code (admin)
- **PUT** `/backend/shreeweb-offerings/:id` - Update offering with embed code (admin)

### Frontend Implementation

#### 1. CMS Pages

**Add Page** (`shreeweb/src/shreeweb/shreeweb/cms/pages/CmsOfferingsAdd.jsx`)
- Added "Shopify Integration" section with:
  - Textarea for pasting Shopify Buy Button embed code
  - Instructions on where to get the code
  - Alternative section for Product ID and Variant ID
- Form state includes `shopifyBuyButtonEmbed` field
- Submits to backend API

**Edit Page** (`shreeweb/src/shreeweb/shreeweb/cms/pages/CmsOfferingsEdit.jsx`)
- Same UI as Add page
- Loads existing embed code from backend
- Updates via PUT request

#### 2. Booking Page (`shreeweb/src/shreeweb/shreeweb/pages/Booking.jsx`)
- Fetches offerings from `/backend/shreeweb-offerings/public`
- Passes selected offering to `ShopifyCheckout` component
- Displays offering details and checkout button

#### 3. ShopifyCheckout Component (`shreeweb/src/shreeweb/shreeweb/components/ShopifyCheckout.jsx`)
Complete rewrite to handle embed codes:
- Receives offering object as prop
- Extracts `shopifyBuyButtonEmbed` from offering
- Dynamically injects HTML and JavaScript into the page
- Handles script execution properly
- Shows loading state while initializing
- Displays error if embed code is missing
- Shows discount pricing if enabled
- Applies custom styling to Shopify button

## How to Use

### For Admins (CMS)

1. **Get Shopify Buy Button Code:**
   - Go to Shopify Admin
   - Navigate to: Sales channels → Buy Button
   - Click "Create buy button"
   - Select your product
   - Customize the button appearance
   - Click "Generate code"
   - Copy the entire code block

2. **Add to Offering:**
   - Go to CMS → Offerings
   - Create new or edit existing offering
   - Scroll to "Shopify Integration" section
   - Paste the embed code in the textarea
   - Save the offering

3. **Alternative Method:**
   - Instead of embed code, you can use Product ID and Variant ID
   - This is for custom checkout flows (legacy method)

### For Users (Frontend)

1. User visits offerings page and clicks "Book Now"
2. Redirected to booking page with plan parameter (e.g., `/shreeweb/booking?plan=69d61039d42ebdde49fd01f8`)
3. Page fetches offering details from backend
4. ShopifyCheckout component renders the Shopify Buy Button
5. User clicks the button to proceed to Shopify checkout
6. After payment, user is redirected back to schedule their session

## Data Flow

```
CMS (Add/Edit Offering)
  ↓
  Paste Shopify Buy Button Code
  ↓
Backend API (POST/PUT /shreeweb-offerings)
  ↓
MongoDB (ShreeWebOffering collection)
  ↓
Backend API (GET /shreeweb-offerings/public)
  ↓
Booking Page (Fetch offerings)
  ↓
ShopifyCheckout Component (Render embed code)
  ↓
Shopify Checkout (User completes payment)
  ↓
Redirect back to booking page with paid=true
  ↓
User schedules session
```

## Security Considerations

1. **XSS Protection:**
   - Embed code is stored as-is in database
   - Only admin users can add/edit embed codes
   - Code is injected using controlled DOM manipulation
   - Scripts are executed in isolated container

2. **Admin Authentication:**
   - All write operations require admin token
   - Token verified via `verifyToken` middleware
   - Admin role checked via `requireAdmin` middleware

3. **Input Validation:**
   - Embed code is trimmed before storage
   - Empty strings are handled gracefully
   - Frontend validates offering exists before rendering

## Removed Components

The following were removed as they're no longer needed:
- `shreeweb/src/shreeweb/shreeweb/cms/pages/CmsEmbeds.jsx` - Global embeds page
- `shreeweb/src/shreeweb/shreeweb/components/ShopifyShopNowEmbed.jsx` - Unused component
- CMS navigation links to embeds page
- `SHREEWEB_CMS_EMBEDS_KEY` from localStorage

## Benefits of This Approach

1. **Per-Offering Configuration:** Each offering has its own Shopify product/button
2. **Flexibility:** Admins can customize button appearance per offering
3. **No Global Config:** No need for global Shopify settings
4. **Easy Updates:** Change embed code without code deployment
5. **Backend Storage:** Embed codes stored in database, not localStorage
6. **Proper API:** RESTful API for all operations
7. **Type Safety:** Proper validation and error handling

## Testing

To test the implementation:

1. **Backend Test:**
   ```bash
   # Create offering with embed code
   curl -X POST http://localhost:3000/backend/shreeweb-offerings \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -d '{
       "title": "Test Offering",
       "duration": "60 Min",
       "description": "Test description",
       "price": "$100",
       "category": "single",
       "shopifyBuyButtonEmbed": "<div>...</div><script>...</script>"
     }'
   
   # Fetch public offerings
   curl http://localhost:3000/backend/shreeweb-offerings/public
   ```

2. **Frontend Test:**
   - Add offering in CMS with Shopify embed code
   - Visit booking page: `http://localhost:5173/shreeweb/booking?plan=OFFERING_ID`
   - Verify Shopify Buy Button renders
   - Click button and verify checkout opens

3. **Console Logs:**
   - Check browser console for debug messages
   - Look for "ShopifyCheckout: Loading embed code for offering"
   - Verify no errors in console

## Troubleshooting

### Button Not Showing
- Check browser console for errors
- Verify offering has `shopifyBuyButtonEmbed` field populated
- Check network tab for API response
- Ensure embed code is valid HTML/JavaScript

### Checkout Not Opening
- Verify Shopify domain and access token in embed code
- Check if product is available in Shopify
- Look for JavaScript errors in console
- Ensure scripts are executing (check Network tab)

### Styling Issues
- Custom styles are applied via `<style>` tag in component
- Shopify button classes: `.shopify-buy__btn`
- Modify styles in `ShopifyCheckout.jsx` if needed

## Future Enhancements

1. **Embed Code Validation:** Validate embed code format before saving
2. **Preview:** Show preview of button in CMS before saving
3. **Multiple Products:** Support multiple products per offering
4. **Analytics:** Track button clicks and conversions
5. **A/B Testing:** Test different button styles
6. **Webhook Integration:** Handle Shopify webhooks for order updates
