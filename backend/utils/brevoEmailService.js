import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

let client = null;

function getClient() {
  if (client) return client;

  console.log("📧 Initializing Brevo client...");
  console.log(
    "API Key configured:",
    process.env.BREVO_API_KEY ? "YES" : "NO"
  );

  client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
  });

  console.log("✅ Brevo client initialized");

  return client;
}

const brevoEmailService = {
  async sendEmail({ to, subject, html, text }) {
    try {
      console.log(`📧 Sending email to: ${to}`);

      const client = getClient();

      const response =
        await client.transactionalEmails.sendTransacEmail({
          sender: {
            name: "Om Shree Guidance",
            email:
              process.env.EMAIL_FROM ||
              "marketing@omshreeguidance.com"
          },

          to: [{ email: to }],

          subject,

          htmlContent: html,

          textContent:
            text ||
            html.replace(/<[^>]*>/g, "")
        });

      console.log(`✅ Email sent to ${to}`);

      return {
        success: true,
        messageId: response.messageId
      };

    } catch (error) {

      console.error(
        `❌ Failed to send to ${to}:`,
        error.message
      );

      return {
        success: false,
        error: error.message
      };
    }
  },

  async verifyConnection() {
    try {
      const client = getClient();

      await client.transactionalEmails.sendTransacEmail({
        sender: {
          name: "Om Shree Guidance",
          email: process.env.EMAIL_FROM
        },

        to: [
          { email: process.env.EMAIL_FROM }
        ],

        subject: "Brevo connection test",

        htmlContent:
          "<p>Brevo API working correctly</p>"
      });

      console.log("✅ Brevo API connection verified");

      return {
        success: true,
        message: "API service is ready"
      };

    } catch (error) {

      console.error(
        "❌ Brevo API verification failed:",
        error.message
      );

      return {
        success: false,
        message: error.message
      };
    }
  }
};

export default brevoEmailService;