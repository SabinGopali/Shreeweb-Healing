import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  initializeTransporter() {
    if (this.initialized) return;
    
    // Configure your email service here
    // For development, you can use ethereal.email or mailtrap
    // For production, use your actual SMTP service (Gmail, SendGrid, etc.)
    
    const emailConfig = {
      host: process.env.EMAIL_HOST?.trim() || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER?.trim(),
        pass: process.env.EMAIL_PASS?.trim()
      }
    };

    console.log('📧 Initializing email service...');
    console.log('   Host:', emailConfig.host);
    console.log('   Port:', emailConfig.port);
    console.log('   Secure:', emailConfig.secure);
    console.log('   User:', emailConfig.auth.user ? '***configured***' : 'NOT SET');
    console.log('   Pass:', emailConfig.auth.pass ? '***configured***' : 'NOT SET');

    // Only create transporter if credentials are provided
    if (emailConfig.auth.user && emailConfig.auth.pass) {
      try {
        // Use nodemailer.default if needed for ES modules
        const createTransport = nodemailer.createTransport || nodemailer.default?.createTransport;
        if (!createTransport) {
          throw new Error('nodemailer.createTransport is not available');
        }
        this.transporter = createTransport.call(nodemailer.default || nodemailer, emailConfig);
        console.log('✅ Email transporter created successfully');
      } catch (error) {
        console.error('❌ Failed to create email transporter:', error.message);
        console.error('   Nodemailer object:', Object.keys(nodemailer));
      }
    } else {
      console.warn('⚠️  Email credentials not configured. Email sending will be simulated.');
    }
    
    this.initialized = true;
  }

  async sendEmail({ to, subject, html, text }) {
    // Ensure transporter is initialized
    if (!this.initialized) {
      this.initializeTransporter();
    }
    
    if (!this.transporter) {
      console.log('⚠️  [EMAIL SIMULATION]', { to, subject });
      return { success: true, messageId: 'simulated-' + Date.now() };
    }

    try {
      console.log('📧 Sending email to:', to);
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM?.trim() || process.env.EMAIL_USER?.trim(),
        to,
        subject,
        html,
        text: text || this.htmlToText(html)
      });

      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendBulkEmails(recipients, { subject, html, text }) {
    // Ensure transporter is initialized
    if (!this.initialized) {
      this.initializeTransporter();
    }
    
    const results = {
      sent: 0,
      failed: 0,
      errors: []
    };

    console.log(`📧 Starting bulk email send to ${recipients.length} recipients...`);

    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail({
          to: recipient.email,
          subject,
          html: this.personalizeContent(html, recipient),
          text: text ? this.personalizeContent(text, recipient) : null
        });

        if (result.success) {
          results.sent++;
          console.log(`✅ Sent to ${recipient.email}`);
        } else {
          results.failed++;
          results.errors.push({ email: recipient.email, error: result.error });
          console.log(`❌ Failed to send to ${recipient.email}:`, result.error);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.failed++;
        results.errors.push({ email: recipient.email, error: error.message });
        console.log(`❌ Exception sending to ${recipient.email}:`, error.message);
      }
    }

    console.log(`📊 Bulk send complete: ${results.sent} sent, ${results.failed} failed`);
    return results;
  }

  personalizeContent(content, recipient) {
    return content
      .replace(/\{\{email\}\}/g, recipient.email || '')
      .replace(/\{\{name\}\}/g, recipient.name || 'there')
      .replace(/\{\{unsubscribe_link\}\}/g, `${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?email=${encodeURIComponent(recipient.email)}`);
  }

  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async verifyConnection() {
    // Ensure transporter is initialized
    if (!this.initialized) {
      this.initializeTransporter();
    }
    
    if (!this.transporter) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service is ready' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new EmailService();
