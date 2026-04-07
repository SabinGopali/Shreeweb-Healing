import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🔍 Testing Gmail SMTP Connection...\n');

// Remove spaces from password
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');

console.log('Configuration:');
console.log('- Host:', process.env.EMAIL_HOST);
console.log('- Port:', process.env.EMAIL_PORT);
console.log('- User:', process.env.EMAIL_USER);
console.log('- Password length:', emailPass?.length || 0);
console.log('- From:', process.env.EMAIL_FROM);
console.log('');

// Create transporter
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
  debug: true,
  logger: true
});

async function testConnection() {
  try {
    console.log('📡 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `"OMSHREEGUIDANCE Test" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email from OMSHREEGUIDANCE',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #D97706;">✅ Email Configuration Working!</h2>
          <p>This is a test email from your OMSHREEGUIDANCE backend.</p>
          <p>If you received this, your Gmail SMTP configuration is working correctly.</p>
          <hr style="border: 1px solid #e7e5e4; margin: 20px 0;">
          <p style="color: #78716c; font-size: 12px;">
            Sent at: ${new Date().toISOString()}<br>
            From: ${process.env.EMAIL_FROM}
          </p>
        </div>
      `,
      text: 'Email configuration test successful!'
    });

    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📬 Response:', info.response);
    console.log('\n✨ Your Gmail SMTP is configured correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Make sure you\'re using a Gmail App Password (not your regular password)');
    console.error('2. Enable 2-Step Verification in your Google Account');
    console.error('3. Generate an App Password at: https://myaccount.google.com/apppasswords');
    console.error('4. Update EMAIL_PASS in your .env file with the App Password (no spaces)');
    console.error('5. Make sure "Less secure app access" is not required (use App Password instead)');
    
    if (error.code) {
      console.error('\nError code:', error.code);
    }
    if (error.response) {
      console.error('Server response:', error.response);
    }
  }
}

testConnection();
