import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createBookingFromOrder } from './booking.controller.js';

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// Verify Shopify webhook signature
function verifyShopifyWebhook(req) {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET;
  
  if (!hmac || !shopifySecret) {
    return false;
  }

  const hash = crypto
    .createHmac('sha256', shopifySecret)
    .update(req.rawBody, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmac));
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Generate order confirmation email HTML
function generateOrderConfirmationEmail(order) {
  const {
    id,
    order_number,
    email,
    customer,
    line_items,
    total_price,
    subtotal_price,
    total_tax,
    total_shipping_price_set,
    shipping_address,
    billing_address,
    created_at,
    currency,
    order_status_url,
  } = order;

  const customerName = customer?.first_name || 'Valued Customer';
  const shippingPrice = total_shipping_price_set?.shop_money?.amount || '0.00';

  // Generate booking URL
  const bookingUrl = `https://omshreeguidance.com/shreeweb/booking-confirmation?order_id=${id}&order_number=${order_number}&email=${encodeURIComponent(email)}`;

  // Generate line items HTML
  const lineItemsHtml = line_items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e7e5e4;">
        <div style="font-weight: 500; color: #1c1917; margin-bottom: 4px;">${item.title}</div>
        ${item.variant_title ? `<div style="font-size: 14px; color: #78716c;">${item.variant_title}</div>` : ''}
        <div style="font-size: 14px; color: #78716c;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e7e5e4; text-align: right; white-space: nowrap;">
        ${formatCurrency(item.price, currency)}
      </td>
    </tr>
  `
    )
    .join('');

  // Generate shipping address HTML
  const shippingAddressHtml = shipping_address
    ? `
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 16px; font-weight: 600; color: #1c1917; margin: 0 0 8px 0;">Shipping Address</h3>
      <div style="color: #44403c; line-height: 1.6;">
        ${shipping_address.name ? `<div>${shipping_address.name}</div>` : ''}
        ${shipping_address.address1 ? `<div>${shipping_address.address1}</div>` : ''}
        ${shipping_address.address2 ? `<div>${shipping_address.address2}</div>` : ''}
        <div>
          ${shipping_address.city ? `${shipping_address.city}, ` : ''}
          ${shipping_address.province_code || shipping_address.province || ''} 
          ${shipping_address.zip || ''}
        </div>
        ${shipping_address.country ? `<div>${shipping_address.country}</div>` : ''}
        ${shipping_address.phone ? `<div>Phone: ${shipping_address.phone}</div>` : ''}
      </div>
    </div>
  `
    : '';

  const orderDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f7f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Thank You for Your Order!</h1>
      <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Order #${order_number}</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 32px 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Greeting -->
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #1c1917;">Hello ${customerName},</h2>
        <p style="margin: 0; color: #44403c; line-height: 1.6;">
          We've received your order and will send you a shipping confirmation email as soon as your order ships.
        </p>
      </div>

      <!-- BOOKING CALL-TO-ACTION - PROMINENT & GMAIL-COMPATIBLE -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
        <tr>
          <td style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-left: 4px solid #F59E0B; padding: 24px; border-radius: 8px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <h2 style="margin: 0 0 12px 0; font-size: 22px; color: #92400E;">🎉 Next Step: Schedule Your Session</h2>
                  <p style="margin: 0 0 20px 0; color: #78716c; font-size: 16px; line-height: 1.6;">
                    Your payment is confirmed! Now let's find the perfect time for your session.
                  </p>
                  <!-- Button as table for maximum compatibility -->
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td align="center" style="background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <a href="${bookingUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 18px; font-family: Arial, sans-serif;">
                          Schedule Now →
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 16px 0 0 0; color: #57534e; font-size: 14px;">
                    Click the button above to choose your preferred date and time
                  </p>
                  <!-- Fallback link in case button doesn't render -->
                  <p style="margin: 12px 0 0 0; color: #78716c; font-size: 12px;">
                    Button not working? <a href="${bookingUrl}" target="_blank" style="color: #D97706; text-decoration: underline;">Click here to schedule</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Order Details -->
      <div style="background: #fef3c7; border-left: 4px solid #F59E0B; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
        <div style="color: #92400E; font-size: 14px; margin-bottom: 4px;">Order Date</div>
        <div style="color: #1c1917; font-weight: 500;">${orderDate}</div>
      </div>

      <!-- Order Items -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 18px; font-weight: 600; color: #1c1917; margin: 0 0 16px 0;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f4;">
              <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: 600; color: #57534e;">Item</th>
              <th style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: #57534e;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHtml}
          </tbody>
        </table>
      </div>

      <!-- Order Totals -->
      <div style="border-top: 2px solid #e7e5e4; padding-top: 16px; margin-bottom: 24px;">
        <table style="width: 100%; margin-left: auto; max-width: 300px;">
          <tr>
            <td style="padding: 8px 0; color: #44403c;">Subtotal</td>
            <td style="padding: 8px 0; text-align: right; color: #1c1917;">${formatCurrency(subtotal_price, currency)}</td>
          </tr>
          ${
            parseFloat(shippingPrice) > 0
              ? `
          <tr>
            <td style="padding: 8px 0; color: #44403c;">Shipping</td>
            <td style="padding: 8px 0; text-align: right; color: #1c1917;">${formatCurrency(shippingPrice, currency)}</td>
          </tr>
          `
              : ''
          }
          ${
            parseFloat(total_tax) > 0
              ? `
          <tr>
            <td style="padding: 8px 0; color: #44403c;">Tax</td>
            <td style="padding: 8px 0; text-align: right; color: #1c1917;">${formatCurrency(total_tax, currency)}</td>
          </tr>
          `
              : ''
          }
          <tr style="border-top: 2px solid #e7e5e4;">
            <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: 600; color: #1c1917;">Total</td>
            <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 600; color: #D97706;">${formatCurrency(total_price, currency)}</td>
          </tr>
        </table>
      </div>

      <!-- Shipping Address -->
      ${shippingAddressHtml}

      <!-- View Order Button -->
      ${
        order_status_url
          ? `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="background: #f5f5f4; border-radius: 8px; border: 1px solid #e7e5e4;">
                  <a href="${order_status_url}" target="_blank" style="display: inline-block; padding: 12px 24px; color: #44403c; text-decoration: none; font-weight: 500; font-size: 14px; font-family: Arial, sans-serif;">
                    View Order Status
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      `
          : ''
      }

      <!-- Support Info -->
      <div style="background: #f5f5f4; padding: 20px; border-radius: 8px; margin-top: 24px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1c1917;">Need Help?</h3>
        <p style="margin: 0; color: #44403c; font-size: 14px; line-height: 1.6;">
          If you have any questions about your order or booking, please contact us at 
          <a href="mailto:${process.env.EMAIL_FROM}" style="color: #D97706; text-decoration: none;">${process.env.EMAIL_FROM}</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px; color: #78716c; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">OMSHREEGUIDANCE - Energetic Alignment</p>
      <p style="margin: 0;">© ${new Date().getFullYear()} All rights reserved</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Handle order creation webhook
export const handleOrderCreated = async (req, res) => {
  try {
    // Verify webhook signature (if secret is configured)
    if (process.env.SHOPIFY_WEBHOOK_SECRET) {
      const isValid = verifyShopifyWebhook(req);
      if (!isValid) {
        console.error('Invalid Shopify webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const order = req.body;
    
    console.log('📦 Received Shopify order webhook:', {
      order_number: order.order_number,
      email: order.email,
      total: order.total_price,
      currency: order.currency,
    });

    // Validate required fields
    if (!order.email) {
      console.error('Order missing email address');
      return res.status(400).json({ error: 'Order missing email address' });
    }

    // Generate email HTML
    const emailHtml = generateOrderConfirmationEmail(order);
    const customerName = order.customer?.first_name || 'Valued Customer';

    // Send confirmation email
    const mailOptions = {
      from: `"OMSHREEGUIDANCE" <${process.env.EMAIL_FROM}>`,
      to: order.email,
      subject: `Order Confirmation #${order.order_number} - OMSHREEGUIDANCE`,
      html: emailHtml,
      text: `Thank you for your order #${order.order_number}! We've received your order and will send you a shipping confirmation email as soon as your order ships.`,
    };

    console.log('📤 Attempting to send email to:', order.email);
    console.log('📧 Email config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM,
      hasPassword: !!process.env.EMAIL_PASS
    });

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Order confirmation email sent to:', order.email);
    console.log('📬 Message ID:', info.messageId);

    // Create booking record for calendar scheduling
    try {
      const booking = await createBookingFromOrder(order);
      console.log('✅ Booking record created:', booking._id);
    } catch (bookingError) {
      console.error('⚠️ Failed to create booking record:', bookingError.message);
      // Don't fail the webhook if booking creation fails
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Order confirmation email sent',
      order_number: order.order_number,
    });
  } catch (error) {
    console.error('❌ Error processing order webhook:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    res.status(500).json({
      success: false,
      error: 'Failed to process order webhook',
      message: error.message,
    });
  }
};

// Test endpoint to verify webhook is working
export const testWebhook = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shopify webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
};
