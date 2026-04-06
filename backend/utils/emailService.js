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
    // Ensure transporter is initialized
    if (!this.initialized) {
      this.initializeTransporter();
    }
    
    if (!this.transporter) {
      console.log('??  [EMAIL SIMULATION]', { to, subject });
      return { success: true, messageId: 'simulated-' + Date.now() };
    }

    try {
      console.log('?? Sending email to:', to);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const unsubscribeLink = `${frontendUrl}/unsubscribe?email=${encodeURIComponent(to)}`;
      const finalHtml = this.wrapEmailHtml(html, { unsubscribeLink });
      const finalText = text || this.htmlToText(finalHtml);
      const info = await this.transporter.sendMail({
        from: this.getFromAddress(),
        to,
        subject,
        replyTo: process.env.EMAIL_REPLY_TO?.trim() || process.env.EMAIL_FROM?.trim() || process.env.EMAIL_USER?.trim(),
        html: finalHtml,
        text: finalText,
        headers: {
          'List-Unsubscribe': `<${unsubscribeLink}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          'Precedence': 'bulk',
          'X-Auto-Response-Suppress': 'All'
        }
      });

      console.log('? Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('? Error sending email:', error);
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

    console.log(`?? Starting bulk email send to ${recipients.length} recipients...`);

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
          console.log(`? Sent to ${recipient.email}`);
        } else {
          results.failed++;
          results.errors.push({ email: recipient.email, error: result.error });
          console.log(`? Failed to send to ${recipient.email}:`, result.error);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.failed++;
        results.errors.push({ email: recipient.email, error: error.message });
        console.log(`? Exception sending to ${recipient.email}:`, error.message);
      }
    }

    console.log(`?? Bulk send complete: ${results.sent} sent, ${results.failed} failed`);
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
