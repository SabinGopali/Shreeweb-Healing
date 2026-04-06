import dotenv from 'dotenv';
import emailService from '../utils/emailService.js';

dotenv.config();

async function testEmailSending() {
  console.log('🔧 Email Configuration:');
  console.log('   HOST:', process.env.EMAIL_HOST);
  console.log('   PORT:', process.env.EMAIL_PORT);
  console.log('   SECURE:', process.env.EMAIL_SECURE);
  console.log('   USER:', process.env.EMAIL_USER);
  console.log('   FROM:', process.env.EMAIL_FROM);
  console.log('   PASS:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');

  console.log('\n🔍 Verifying email service connection...');
  const verification = await emailService.verifyConnection();
  
  if (verification.success) {
    console.log('✅ Email service is ready!');
    console.log('   Message:', verification.message);
  } else {
    console.log('❌ Email service connection failed!');
    console.log('   Error:', verification.message);
    process.exit(1);
  }

  console.log('\n📧 Sending test email...');
  const result = await emailService.sendEmail({
    to: process.env.EMAIL_USER, // Send to yourself
    subject: 'Test Email from Shreeweb',
    html: '<h1>Test Email</h1><p>If you receive this, email sending is working!</p>',
    text: 'Test Email - If you receive this, email sending is working!'
  });

  if (result.success) {
    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', result.messageId);
    console.log('\n📬 Check your inbox:', process.env.EMAIL_USER);
  } else {
    console.log('❌ Failed to send test email!');
    console.log('   Error:', result.error);
  }

  process.exit(0);
}

testEmailSending();
