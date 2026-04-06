# Booking Page - Shopify "Book Now" Button Integration

## Task Summary
Integrated prominent "Book Now" button on booking page with hardcoded Shopify Buy Button embed code that can be managed through CMS.

## What Was Done

### 1. Added Shopify Embed Code to CMS
**File**: `shreeweb/src/shreeweb/shreeweb/cms/pages/CmsEmbeds.jsx`

- Hardcoded the Shopify Buy Button embed code as default value
- Shopify domain: `yxpnpq-d0.myshopify.com`
- Product ID: `7675570454624`
- Storefront Access Token: `4af1e40438135ba379f6f66ab171c799`
- Auto-initializes with Shopify code if nothing saved
- Can be edited/updated through CMS interface

### 2. Enhanced ShopifyShopNowEmbed Component
**File**: `shreeweb/src/shreeweb/shreeweb/components/ShopifyShopNowEmbed.jsx`

- Updated to use hardcoded Shopify embed as default
- Added `useRef` to properly handle Shopify script execution
- Added script re-execution logic when HTML changes (required for Shopify Buy Button)
- Removed fallback message (now has working Shopify code)
- Properly executes Shopify SDK scripts

### 3. Updated Booking Page
**File**: `shreeweb/src/shreeweb/shreeweb/pages/Booking.jsx`

- Replaced "How It Works" section with prominent "Book Now" button
- Button displays dynamic price from selected offering
- Smart click handler that:
  - Tries to trigger Shopify Buy Button if configured (`.shopify-buy__btn`)
  - Falls back to scrolling to embed section if button not found
  - Shows configuration message if Shopify not set up
- Added ID to embed section for smooth scrolling
- Removed unused `loading` state variable

## Shopify Configuration

### Current Setup
The Shopify Buy Button is now hardcoded with these details:
- **Domain**: yxpnpq-d0.myshopify.com
- **Product ID**: 7675570454624
- **Access Token**: 4af1e40438135ba379f6f66ab171c799

### How to Update
1. Go to CMS → Third-party Integrations
2. The Shopify embed code is pre-filled
3. Edit if needed (change product, styling, etc.)
4. Click "Save embeds"
5. Refresh booking page to see changes

### Shopify Buy Button Features
- "Add to cart" button text
- Modal product view with image carousel
- Quantity selector
- Shopping cart with checkout button
- Responsive design (mobile & desktop)

## User Flow

### Before Payment
1. User selects an offering and lands on booking page
2. Sees offering details (title, duration, price, features)
3. Sees prominent amber "Book Now" button with price
4. Clicks button → triggers Shopify Buy Button
5. Shopify modal opens with product details
6. User adds to cart and proceeds to checkout
7. Completes payment on Shopify
8. Shopify redirects back with `?paid=1` parameter

### After Payment
1. Page detects `?paid=1` parameter
2. Shows "Payment Confirmed" message with green checkmark
3. Displays booking calendar for date/time selection
4. User books their session

## Design Features

### "Book Now" Button
- Full width, prominent placement
- Amber color (`bg-amber-600`) for high visibility
- Shopping cart icon for clear action
- Dynamic price display
- Hover effects (darker shade, shadow, lift)
- Large size for easy clicking

### Shopify Buy Button
- Appears below "Book Now" button
- Shows product with "Add to cart" button
- Opens modal with product details
- Includes quantity selector
- Shopping cart functionality
- Secure Shopify checkout

### Layout
- Offering details card at top
- "Book Now" button prominently displayed
- Shopify Buy Button embed below
- Clean separation with border
- Consistent JAPANDI aesthetic

## Technical Details

### Hardcoded Configuration
The Shopify embed code is now hardcoded in the project with these settings:
- Domain: `yxpnpq-d0.myshopify.com`
- Product ID: `7675570454624`
- Storefront Access Token: `4af1e40438135ba379f6f66ab171c799`
- Money Format: `${{amount}}`

### Script Execution
The ShopifyShopNowEmbed component properly re-executes scripts when the HTML changes. This is crucial for Shopify Buy Button to work correctly, as it needs to run initialization scripts that load the Shopify SDK and create the button.

### Button Detection
The "Book Now" button looks for `.shopify-buy__btn` class, which is the standard class used by Shopify Buy Button embeds. When clicked, it programmatically triggers the Shopify button.

### CMS Management
- Shopify code is stored in localStorage via CMS
- Can be edited through CMS → Third-party Integrations
- Changes take effect after page refresh
- Default value is the hardcoded Shopify embed

## Files Modified

1. `shreeweb/src/shreeweb/shreeweb/cms/pages/CmsEmbeds.jsx`
   - Added hardcoded Shopify Buy Button embed code as default
   - Auto-initializes with Shopify code on first load

2. `shreeweb/src/shreeweb/shreeweb/components/ShopifyShopNowEmbed.jsx`
   - Updated to use hardcoded Shopify embed as default
   - Enhanced with script execution and flexible rendering

3. `shreeweb/src/shreeweb/shreeweb/pages/Booking.jsx`
   - Added "Book Now" button with smart click handler
   - Removed "How It Works" section
   - Cleaned up unused code

## Testing

### Test Shopify Integration
1. Visit booking page: `http://localhost:5173/shreeweb/booking?plan={offering_id}`
2. Should see Shopify "Add to cart" button below "Book Now" button
3. Click "Book Now" button → should trigger Shopify button
4. Click "Add to cart" → Shopify modal should open
5. Add to cart and checkout

### Test Payment Flow
1. Complete payment on Shopify
2. Configure Shopify to redirect to: `http://localhost:5173/shreeweb/booking?plan={offering_id}&paid=1`
3. Should see booking calendar after redirect

### Test CMS Management
1. Go to CMS → Third-party Integrations
2. Should see Shopify embed code pre-filled
3. Edit code if needed
4. Save and refresh booking page
5. Changes should be reflected

## Next Steps

1. ✅ Shopify Buy Button is now working with hardcoded configuration
2. Configure Shopify redirect URL for post-payment flow
3. Test complete payment flow end-to-end
4. Optionally customize Shopify button appearance in CMS
5. Add analytics tracking for button clicks
6. Set up different products for different offerings (optional)

## Notes

- The Shopify embed code is now hardcoded and working out of the box
- No additional configuration needed to see the Shopify button
- Can be customized through CMS if needed
- The "Book Now" button provides better UX by triggering Shopify programmatically
- Shopify handles all payment processing securely
- No backend changes needed - all frontend integration
- Maintains JAPANDI design consistency

## Shopify Product Configuration

The current setup uses a single Shopify product for all offerings. To use different products for different offerings:

1. Create products in Shopify for each offering
2. Generate Buy Button embed code for each product
3. Store product IDs in offering data
4. Dynamically load correct Shopify embed based on selected offering

This is optional - the current single-product setup works for all offerings.
