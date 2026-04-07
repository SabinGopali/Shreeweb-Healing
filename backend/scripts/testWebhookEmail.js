import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🧪 Testing Webhook Email Sending\n');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Mock order data
const mockOrder = {
  id: 'test_order_123',
  order_number: '1001',
  email: process.env.EMAIL_USER, // Send to yourself for testing
  customer: {
    first_name: 'Test',
    last_name: 'Customer',
  },
  line_items: [
    {
      title: 'Free Discovery Call',
      variant_title: null,
      quantity: 1,
      price: '0.00',
    },
  ],
  total_price: '0.00',
  subtotal_price: '0.00',
  total_tax: '0.00',
  total_shipping_price_set: {
    shop_money: {
      amount: '0.00',
    },
  },
  currency: 'USD',
  created_at: new Date().toISOString(),
  shipping_address: {
    name: 'Test Customer',
    address1: '123 Test Street',
    city: 'Test City',
    province: 'CA',
    zip: '12345',
    country: 'United States',
    phone: '555-0123',
  },
  order_status_url: 'https://omshreeguidance.com/orders/test',
};

// Generate booking URL
const bookingUrl = `https://omshreeguidance.com/shreeweb/booking-confirmation?order_id=${mockOrder.id}&order_number=${mockOrder.order_number}&email=${encodeURIComponent(mockOrder.email)}`;

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
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Thank You for Your Order!</h1>
      <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Order #${mockOrder.order_number}</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 32px 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Greeting -->
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #1c1917;">Hello ${mockOrder.customer.first_name},</h2>
        <p style="margin: 0; color: #44403c; line-height: 1.6;">
          This is a test email to verify the webhook email system is working correctly.
        </p>
      </div>

      <!-- BOOKING CALL-TO-ACTION -->
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
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Test Info -->
      <div style="background: #f5f5f4; padding: 20px; border-radius: 8px; margin-top: 24px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1c1917;">✅ Test Email</h3>
        <p style="margin: 0; color: #44403c; font-size: 14px; line-height: 1.6;">
          If you received this email, the webhook email system is configured correctly!
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

async function testEmail() {
  console.log('📧 Email Configuration:');
  console.log('   HOST:', process.env.EMAIL_HOST);
  console.log('   PORT:', process.env.EMAIL_PORT);
  console.log('   SECURE:', process.env.EMAIL_SECURE);
  console.log('   USER:', process.env.EMAIL_USER);
  console.log('   FROM:', process.env.EMAIL_FROM);
  console.log('   PASS:', process.env.EMAIL_PASS ? '***configured***' : '❌ NOT SET');
  console.log('');

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration incomplete! Check your .env file.');
    process.exit(1);
  }

  try {
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    console.log('📤 Sending test email to:', process.env.EMAIL_USER);
    const info = await transporter.sendMail({
      from: `"OMSHREEGUIDANCE" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      subject: `TEST: Order Confirmation #${mockOrder.order_number} - OMSHREEGUIDANCE`,
      html: emailHtml,
      text: `Test order confirmation email. If you receive this, the webhook email system is working!`,
    });

    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('\n📬 Check your inbox:', process.env.EMAIL_USER);
    console.log('   Subject: TEST: Order Confirmation #1001 - OMSHREEGUIDANCE');
    console.log('\n✅ If you received the email with the "Schedule Now" button, the system is working!');
  } catch (error) {
    console.error('❌ Failed to send test email!');
    console.error('   Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n💡 Authentication failed. Check:');
      console.error('   - EMAIL_USER is correct');
      console.error('   - EMAIL_PASS is correct');
      console.error('   - SMTP credentials are valid');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n💡 Connection failed. Check:');
      console.error('   - EMAIL_HOST is correct');
      console.error('   - EMAIL_PORT is correct');
      console.error('   - Firewall allows SMTP connections');
    }
    
    process.exit(1);
  }
}

testEmail();
