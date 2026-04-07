import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🧪 Testing Complete Email Flow (Simulating Shopify Order)\n');

// Remove spaces from password
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');

// Create transporter (same as in webhook controller)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
});

// Simulate a Shopify order
const mockOrder = {
  id: 5678901234,
  order_number: 1001,
  email: process.env.EMAIL_USER, // Send to yourself for testing
  customer: {
    first_name: 'Test',
    last_name: 'Customer',
    phone: '+1234567890'
  },
  line_items: [
    {
      title: 'Energetic Alignment Session',
      variant_title: '60 Minutes',
      quantity: 1,
      price: '150.00',
      sku: 'EAS-60'
    }
  ],
  total_price: '150.00',
  subtotal_price: '150.00',
  total_tax: '0.00',
  currency: 'USD',
  shipping_address: {
    name: 'Test Customer',
    address1: '123 Main Street',
    city: 'New York',
    province: 'NY',
    zip: '10001',
    country: 'United States',
    phone: '+1234567890'
  },
  created_at: new Date().toISOString(),
  order_status_url: 'https://omshreeguidance.com/orders/status'
};

// Generate booking URL
const bookingUrl = `https://omshreeguidance.com/shreeweb/booking-confirmation?order_id=${mockOrder.id}&order_number=${mockOrder.order_number}&email=${encodeURIComponent(mockOrder.email)}`;

console.log('📦 Mock Order Details:');
console.log('- Order Number:', mockOrder.order_number);
console.log('- Customer:', `${mockOrder.customer.first_name} ${mockOrder.customer.last_name}`);
console.log('- Email:', mockOrder.email);
console.log('- Product:', mockOrder.line_items[0].title);
console.log('- Total:', `$${mockOrder.total_price}`);
console.log('- Booking URL:', bookingUrl);
console.log('');

// Generate email HTML (simplified version)
const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f7f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Thank You for Your Order!</h1>
      <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Order #${mockOrder.order_number}</p>
    </div>

    <div style="background: white; padding: 32px 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #1c1917;">Hello ${mockOrder.customer.first_name},</h2>
        <p style="margin: 0; color: #44403c; line-height: 1.6;">
          We've received your order and are excited to connect with you!
        </p>
      </div>

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
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 18px; font-weight: 600; color: #1c1917; margin: 0 0 16px 0;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f5f5f4;">
            <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: 600; color: #57534e;">Item</th>
            <th style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: #57534e;">Price</th>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e7e5e4;">
              <div style="font-weight: 500; color: #1c1917; margin-bottom: 4px;">${mockOrder.line_items[0].title}</div>
              <div style="font-size: 14px; color: #78716c;">${mockOrder.line_items[0].variant_title}</div>
              <div style="font-size: 14px; color: #78716c;">Qty: ${mockOrder.line_items[0].quantity}</div>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e7e5e4; text-align: right; white-space: nowrap;">
              $${mockOrder.line_items[0].price}
            </td>
          </tr>
        </table>
      </div>

      <div style="border-top: 2px solid #e7e5e4; padding-top: 16px; margin-bottom: 24px;">
        <table style="width: 100%; margin-left: auto; max-width: 300px;">
          <tr style="border-top: 2px solid #e7e5e4;">
            <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: 600; color: #1c1917;">Total</td>
            <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 600; color: #D97706;">$${mockOrder.total_price}</td>
          </tr>
        </table>
      </div>

      <div style="background: #f5f5f4; padding: 20px; border-radius: 8px; margin-top: 24px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1c1917;">Need Help?</h3>
        <p style="margin: 0; color: #44403c; font-size: 14px; line-height: 1.6;">
          If you have any questions, contact us at 
          <a href="mailto:${process.env.EMAIL_FROM}" style="color: #D97706; text-decoration: none;">${process.env.EMAIL_FROM}</a>
        </p>
      </div>
    </div>

    <div style="text-align: center; padding: 24px; color: #78716c; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">OMSHREEGUIDANCE - Energetic Alignment</p>
      <p style="margin: 0;">© ${new Date().getFullYear()} All rights reserved</p>
      <p style="margin: 8px 0 0 0; font-size: 10px; color: #a8a29e;">This is a test email</p>
    </div>
  </div>
</body>
</html>
`;

async function testEmailFlow() {
  try {
    console.log('📡 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified\n');

    console.log('📧 Sending order confirmation email...');
    const mailOptions = {
      from: `"OMSHREEGUIDANCE" <${process.env.EMAIL_FROM}>`,
      to: mockOrder.email,
      subject: `Order Confirmation #${mockOrder.order_number} - OMSHREEGUIDANCE`,
      html: emailHtml,
      text: `Thank you for your order #${mockOrder.order_number}! Click here to schedule your session: ${bookingUrl}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Order confirmation email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📬 Response:', info.response);
    console.log('');
    console.log('✨ Complete email flow test successful!');
    console.log('');
    console.log('📥 Check your inbox:', mockOrder.email);
    console.log('📋 You should see:');
    console.log('   - Order confirmation details');
    console.log('   - Prominent "Schedule Now" button');
    console.log('   - Order summary');
    console.log('   - Total amount');
    console.log('');
    console.log('🎯 Next: Click the "Schedule Now" button to test the booking flow');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('🔧 Make sure:');
    console.error('1. You have a valid Gmail App Password in .env');
    console.error('2. EMAIL_PASS has no spaces');
    console.error('3. Your Gmail account has 2-Step Verification enabled');
    
    if (error.code) {
      console.error('\nError code:', error.code);
    }
  }
}

testEmailFlow();
