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

    console.log('?? Initializing email service...');
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
        console.log('? Email transporter created successfully');
      } catch (error) {
        console.error('? Failed to create email transporter:', error.message);
        console.error('   Nodemailer object:', Object.keys(nodemailer));
      }
    } else {
      console.warn('??  Email credentials not configured. Email sending will be simulated.');
    }
    
    this.initialized = true;
  }

  async sendEmail({ to, subject, html, text }) {
  console.log(`📧 [sendEmail] Starting for: ${to}`);
  
  if (!this.initialized) {
    console.log('📧 [sendEmail] Initializing transporter...');
    this.initializeTransporter();
  }
  
  if (!this.transporter) {
    console.log('⚠️ [sendEmail] No transporter - simulating email');
    return { success: true, messageId: 'simulated-' + Date.now() };
  }

  try {
    console.log(`📧 [sendEmail] Preparing mail options for: ${to}`);
    
    const mailOptions = {
      from: this.getFromAddress(),
      to,
      subject,
      html: this.wrapEmailHtml(html, { unsubscribeLink: `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(to)}` }),
      text: text || this.htmlToText(html)
    };
    
    console.log(`📧 [sendEmail] Mail options ready, calling sendMail...`);
    const info = await this.transporter.sendMail(mailOptions);
    console.log(`✅ [sendEmail] SUCCESS! Email sent to: ${to}`);
    console.log(`✅ [sendEmail] Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [sendEmail] FAILED for: ${to}`);
    console.error(`❌ [sendEmail] Error code: ${error.code}`);
    console.error(`❌ [sendEmail] Error message: ${error.message}`);
    console.error(`❌ [sendEmail] Command: ${error.command}`);
    console.error(`❌ [sendEmail] Response: ${error.response}`);
    if (error.responseCode) console.error(`❌ [sendEmail] Response code: ${error.responseCode}`);
    return { success: false, error: error.message, code: error.code };
  }
}

  async sendBulkEmails(recipients, { subject, html, text }) {
  console.log(`📧 [Bulk] Starting bulk email send to ${recipients.length} recipients...`);
  
  const results = {
    sent: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    console.log(`📧 [Bulk] Processing recipient ${i + 1}/${recipients.length}: ${recipient.email}`);
    
    try {
      const result = await this.sendEmail({
        to: recipient.email,
        subject,
        html: this.personalizeContent(html, recipient),
        text: text ? this.personalizeContent(text, recipient) : null
      });

      if (result.success) {
        results.sent++;
        console.log(`✅ [Bulk] Sent to ${recipient.email} (${results.sent}/${recipients.length})`);
      } else {
        results.failed++;
        results.errors.push({ email: recipient.email, error: result.error });
        console.log(`❌ [Bulk] Failed to send to ${recipient.email}: ${result.error}`);
      }

      // Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.failed++;
      results.errors.push({ email: recipient.email, error: error.message });
      console.log(`❌ [Bulk] Exception for ${recipient.email}:`, error.message);
    }
  }

  console.log(`📧 [Bulk] Complete: ${results.sent} sent, ${results.failed} failed`);
  return results;
}

  personalizeContent(content, recipient) {
    return content
      .replace(/\{\{email\}\}/g, recipient.email || '')
      .replace(/\{\{name\}\}/g, recipient.name || 'there')
      .replace(/\{\{unsubscribe_link\}\}/g, `${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?email=${encodeURIComponent(recipient.email)}`);
  }

  getFromAddress() {
    const address = process.env.EMAIL_FROM?.trim() || process.env.EMAIL_USER?.trim();
    const name = process.env.EMAIL_FROM_NAME?.trim() || 'Om Shree Guidance';
    if (!address) return undefined;
    if (address.includes('<')) return address;
    return `"${name.replace(/"/g, '')}" <${address}>`;
  }

  wrapEmailHtml(html, { unsubscribeLink } = {}) {
    const raw = String(html || '').trim();
    const content = raw || '<p>Hello {{name}},</p><p>Thank you for being with us.</p>';
    const footer = `
      <hr style="border:none;border-top:1px solid #e7e5e4;margin:24px 0 16px 0;" />
      <p style="font-size:12px;color:#78716c;line-height:1.6;margin:0;">
        You are receiving this email because you subscribed to Om Shree Guidance updates.
      </p>
      <p style="font-size:12px;color:#78716c;line-height:1.6;margin:8px 0 0 0;">
        <a href="${unsubscribeLink || '#'}" style="color:#a16207;text-decoration:underline;">Unsubscribe</a>
      </p>
    `;

    // If sender provides a full HTML document, append footer before </body>.
    if (/<html[\s>]/i.test(content)) {
      if (/<\/body>/i.test(content)) {
        return content.replace(/<\/body>/i, `${footer}</body>`);
      }
      return `${content}${footer}`;
    }

    const preheader = this.htmlToText(content).slice(0, 120);
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Email</title>
  </head>
  <body style="margin:0;padding:0;background:#f8f7f4;">
    <div style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
      ${preheader}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f7f4;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e7e5e4;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:28px;font-family:Arial,Helvetica,sans-serif;color:#292524;line-height:1.65;font-size:15px;">
                ${content}
                ${footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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
