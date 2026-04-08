import SibApiV3Sdk from '@getbrevo/brevo';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize Brevo API client
let apiClient = null;

function getApiClient() {
  if (apiClient) return apiClient;
  
  console.log('📧 Initializing Brevo API client...');
  console.log('   API Key configured:', process.env.BREVO_API_KEY ? 'YES' : 'NO');
  
  apiClient = new SibApiV3Sdk.TransactionalEmailsApi();
  apiClient.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  
  console.log('✅ Brevo API client initialized');
  return apiClient;
}

const brevoEmailService = {
  async sendEmail({ to, subject, html, text }) {
    try {
      console.log(`📧 Sending email to: ${to}`);
      
      const apiInstance = getApiClient();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = html;
      sendSmtpEmail.textContent = text || html.replace(/<[^>]*>/g, '');
      sendSmtpEmail.sender = { 
        name: 'Om Shree Guidance', 
        email: process.env.EMAIL_FROM || 'marketing@omshreeguidance.com' 
      };
      sendSmtpEmail.to = [{ email: to }];
      sendSmtpEmail.replyTo = { email: process.env.EMAIL_FROM || 'marketing@omshreeguidance.com' };
      
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(`✅ Email sent to ${to}:`, response.messageId);
      return { success: true, messageId: response.messageId };
      
    } catch (error) {
      console.error(`❌ Failed to send to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  },

  async sendBulkEmails(recipients, { subject, html, text }) {
    let sent = 0;
    let failed = 0;
    
    console.log(`📧 Starting bulk email to ${recipients.length} recipients using Brevo API`);
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail({
          to: recipient.email,
          subject,
          html,
          text
        });
        
        if (result.success) {
          sent++;
        } else {
          failed++;
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        failed++;
        console.error(`Failed to send to ${recipient.email}:`, error.message);
      }
    }
    
    console.log(`📧 Bulk send complete: ${sent} sent, ${failed} failed`);
    return { sent, failed };
  },
  
  async verifyConnection() {
    try {
      const apiInstance = getApiClient();
      // Just check if we can get account info
      const accountApi = new SibApiV3Sdk.AccountApi();
      accountApi.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, process.env.BREVO_API_KEY);
      await accountApi.getAccount();
      console.log('✅ Brevo API connection verified');
      return { success: true, message: 'API service is ready' };
    } catch (error) {
      console.error('❌ Brevo API verification failed:', error.message);
      return { success: false, message: error.message };
    }
  }
};

export default brevoEmailService;