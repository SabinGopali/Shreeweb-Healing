# Shopify Buy Button Configuration Guide

## How to Create a Buy Button with "Checkout" Text

### Step 1: Access Shopify Buy Button
1. Log in to your Shopify Admin
2. Go to **Sales channels** → **Buy Button**
3. Click **Create buy button**

### Step 2: Select Product
1. Choose **Product** as the button type
2. Select the product you want to sell
3. Click **Next**

### Step 3: Customize Button Appearance
1. In the customization screen, look for **Button** section
2. Find the **Button text** field
3. Change the text from "Add to cart" or "Buy now" to **"Checkout"**
4. Customize other appearance options if desired:
   - Button color (will be overridden by our custom styles)
   - Show/hide product image (recommend: hide)
   - Show/hide product title (recommend: hide)
   - Show/hide product price (recommend: hide)

### Step 4: Configure Layout
1. Under **Layout** settings:
   - Choose **Vertical** layout
   - Disable **Show quantity selector** (we don't need it)
   - Disable **Show product image** (cleaner look)
   - Disable **Show product title** (we show it separately)
   - Disable **Show product price** (we show it separately)

### Step 5: Generate Code
1. Click **Generate code**
2. Copy the entire code block (both the `<div>` and `<script>` tags)
3. The code should look something like:
   ```html
   <div id='product-component-1234567890'></div>
   <script type="text/javascript">
   // ... Shopify Buy Button code ...
   </script>
   ```

### Step 6: Add to CMS
1. Go to your CMS → **Offerings**
2. Create new or edit existing offering
3. Scroll to **Shopify Integration** section
4. Paste the entire code in the **Shopify Buy Button Embed Code** textarea
5. Save the offering

## What the Button Will Look Like

After configuration, the button will:
- Display only the text "Checkout"
- Have a rounded pill shape (full border-radius)
- Use an amber/orange gradient background
- Show hover effects (lift and darker gradient)
- Be full-width on mobile, centered on desktop
- Match your site's design aesthetic

## Custom Styling Applied

Our custom CSS automatically:
- Hides product images, titles, and prices (shown separately)
- Hides quantity selectors
- Applies custom colors and gradients
- Adds hover animations
- Ensures responsive design
- Maintains accessibility (focus states)

## Troubleshooting

### Button Shows Wrong Text
If the button still shows "Add to cart" or other text:
1. Check that you set the button text to "Checkout" in Shopify
2. Our JavaScript will attempt to change it automatically after 1 second
3. Clear browser cache and reload the page

### Button Not Showing
1. Check browser console for errors
2. Verify the embed code is complete (both div and script)
3. Ensure the product is active in Shopify
4. Check that the Shopify domain and access token are correct

### Styling Issues
1. The custom styles are applied via CSS in the component
2. Shopify's inline styles may override some properties
3. Check browser DevTools to see which styles are being applied
4. Modify the `<style>` block in `ShopifyCheckout.jsx` if needed

### Button Opens Wrong Product
1. Verify you copied the code for the correct product
2. Check the product ID in the embed code
3. Ensure the product is available for sale in Shopify

## Advanced Configuration

### Multiple Variants
If your product has multiple variants (sizes, colors, etc.):
1. Shopify will show a dropdown selector
2. Our CSS hides this by default for a cleaner look
3. If you need variant selection, modify the CSS to show `.shopify-buy__product__variant-selectors`

### Custom Button Text
To use different text than "Checkout":
1. Set your desired text in Shopify Buy Button settings
2. Or modify the JavaScript in `ShopifyCheckout.jsx` line ~50:
   ```javascript
   buttonText.textContent = 'Your Custom Text';
   ```

### Discount Codes
To apply discount codes automatically:
1. This requires custom Shopify Storefront API integration
2. The Buy Button doesn't support automatic discount application
3. Users can enter codes during checkout

## Testing Checklist

- [ ] Button displays "Checkout" text
- [ ] Button has rounded pill shape
- [ ] Button uses amber/orange gradient
- [ ] Hover effect works (lift + darker color)
- [ ] Button is full-width on mobile
- [ ] Clicking opens Shopify checkout
- [ ] Correct product loads in checkout
- [ ] Price matches offering price
- [ ] No console errors
- [ ] Works on different browsers
- [ ] Works on mobile devices

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the Shopify product is active and available
3. Test the embed code on a simple HTML page first
4. Contact Shopify support for Buy Button issues
5. Check the implementation documentation in `SHOPIFY_BUY_BUTTON_IMPLEMENTATION.md`
