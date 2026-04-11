# Shopify Checkout Troubleshooting Guide

## "Link no longer exists" Error

This error occurs when Shopify cannot find the product or the checkout link format is incorrect.

### Solution Implemented

We've updated the checkout system to use Shopify's official Storefront API instead of direct cart URLs. This creates proper checkout links that don't expire.

### How It Works Now

1. **Product Lookup**: Uses Shopify Storefront API to fetch product details
2. **Cart Creation**: Creates a new cart with the product via API
3. **Checkout URL**: Shopify returns a valid checkout URL
4. **Redirect**: User is redirected to the checkout page

### Configuration Requirements

For each offering in the CMS, you need:

#### Option 1: Product ID Only (Recommended)
- **Shopify Product ID**: The numeric ID from your Shopify product
- Example: `8123456789012`

#### Option 2: Variant ID (For products with variants)
- **Shopify Variant ID**: The numeric ID of a specific variant
- Example: `44123456789012`

#### Option 3: Buy Button Embed (For custom domain/token)
- **Shopify Buy Button Embed Code**: Full embed code from Shopify
- Used to extract domain and access token automatically

### How to Find Your IDs

#### Finding Product ID:
1. Go to Shopify Admin
2. Click **Products**
3. Click on your product
4. Look at the URL: `admin.shopify.com/products/8123456789012`
5. The number at the end is your Product ID

#### Finding Variant ID:
1. Go to Shopify Admin
2. Click **Products**
3. Click on your product
4. Scroll to **Variants** section
5. Click on a variant
6. Look at the URL: `admin.shopify.com/products/8123456789012/variants/44123456789012`
7. The last number is your Variant ID

### Common Issues and Solutions

#### Issue 1: "Product not found in Shopify"
**Cause**: Invalid Product ID or product doesn't exist

**Solutions**:
- Verify the Product ID is correct
- Check the product exists in Shopify Admin
- Ensure the product is not archived
- Make sure you're using the numeric ID, not the handle

#### Issue 2: "No variants available for this product"
**Cause**: Product has no variants or all variants are unavailable

**Solutions**:
- Check product has at least one variant in Shopify
- Ensure variant inventory is available
- Check variant is not set to "Continue selling when out of stock" = false

#### Issue 3: "Could not load product from Shopify"
**Cause**: API connection issue or invalid credentials

**Solutions**:
- Check Shopify domain is correct
- Verify Storefront Access Token is valid
- Ensure product is published to "Online Store" sales channel
- Check Shopify API status

#### Issue 4: "Checkout information not available"
**Cause**: Product loaded but checkout info missing

**Solutions**:
- Refresh the page
- Check browser console for errors
- Verify product has a price set
- Ensure variant is available for sale

#### Issue 5: Button shows "Currently unavailable"
**Cause**: Product variant is not available for sale

**Solutions**:
- Check inventory in Shopify
- Verify variant is not set to "Track quantity" with 0 stock
- Ensure product is active and published

### Testing Checklist

Before going live, test each offering:

- [ ] Product ID is correctly entered in CMS
- [ ] Clicking "Checkout" button loads (shows spinner)
- [ ] Redirects to Shopify checkout page
- [ ] Correct product appears in cart
- [ ] Price matches offering price
- [ ] Can complete checkout successfully
- [ ] After payment, redirects back to booking page
- [ ] Works on mobile devices
- [ ] Works in different browsers

### Debug Mode

In development, the component shows debug information:

1. Open browser console (F12)
2. Look for messages starting with "Shopify"
3. Check for:
   - "Shopify product loaded: ..." (success)
   - "Shopify product fetch error: ..." (failure)
   - "Creating checkout with variant: ..." (checkout start)
   - "Redirecting to checkout: ..." (redirect)

### API Configuration

The system uses these defaults (can be overridden via embed code):

- **Domain**: `yxpnpq-d0.myshopify.com`
- **Storefront Access Token**: `4af1e40438135ba379f6f66ab171c799`
- **API Version**: `2024-10`

To use different credentials:
1. Paste Buy Button embed code in CMS
2. System extracts domain and token automatically

### Shopify Storefront API

The checkout uses these API operations:

1. **Product Query**: Fetches product and variant details
2. **Cart Create**: Creates cart with line items
3. **Checkout URL**: Returns valid checkout link

### Error Messages Explained

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Product not found in Shopify" | Invalid Product ID | Check Product ID in CMS |
| "No variants available" | Product has no variants | Add variants in Shopify |
| "Could not load product" | API connection failed | Check credentials |
| "Checkout information not available" | Missing checkout data | Refresh page |
| "Could not start checkout" | Cart creation failed | Try again |
| "Currently unavailable" | Product out of stock | Update inventory |

### Advanced Troubleshooting

#### Check Shopify Product Status:
```
1. Go to Shopify Admin → Products
2. Find your product
3. Check:
   - Status: Active (not Draft or Archived)
   - Sales channels: Online Store is checked
   - Variants: At least one exists
   - Inventory: Available quantity > 0
   - Price: Set and valid
```

#### Verify Storefront API Access:
```
1. Go to Shopify Admin → Apps
2. Click "Develop apps"
3. Find your app or create new one
4. Check Storefront API permissions:
   - read_products
   - write_checkouts
5. Copy Storefront Access Token
6. Paste in Buy Button embed code in CMS
```

#### Test API Directly:
```javascript
// Open browser console on booking page
// Check if Shopify config is loaded
console.log('Shopify Config:', shopifyConfig);

// Check if product info is loaded
console.log('Checkout Info:', checkoutInfo);
```

### Performance Optimization

The component:
- Loads product info on mount (not on click)
- Caches product data
- Shows loading state during API calls
- Handles errors gracefully
- Provides retry mechanism

### Security Considerations

- Storefront Access Token is public (safe to expose)
- Product IDs are public (safe to expose)
- No sensitive data in checkout flow
- All payments handled by Shopify
- HTTPS enforced for all API calls

### Support Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Shopify Buy Button Guide](https://help.shopify.com/en/manual/online-sales-channels/buy-button)
- [Shopify Product Setup](https://help.shopify.com/en/manual/products)
- [Shopify Checkout Settings](https://help.shopify.com/en/manual/checkout-settings)

### Contact Support

If issues persist:
1. Check all items in Testing Checklist
2. Review browser console errors
3. Verify Shopify product configuration
4. Test with a different product
5. Contact Shopify support for product/API issues
