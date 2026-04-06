import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const EmailCaptureSchema = new mongoose.Schema({
  email: String,
  name: String,
  subscribed: Boolean,
  source: String,
  tags: [String],
  metadata: Object,
  createdAt: Date
});

const EmailCapture = mongoose.model('EmailCapture', EmailCaptureSchema);

async function checkSubscribers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    const total = await EmailCapture.countDocuments();
    const subscribed = await EmailCapture.countDocuments({ subscribed: true });
    const unsubscribed = await EmailCapture.countDocuments({ subscribed: false });

    console.log('📊 Email Subscribers Summary:');
    console.log(`Total emails: ${total}`);
    console.log(`Subscribed: ${subscribed}`);
    console.log(`Unsubscribed: ${unsubscribed}\n`);

    if (total > 0) {
      console.log('📧 Sample subscribers:');
      const samples = await EmailCapture.find({ subscribed: true }).limit(5);
      samples.forEach((sub, i) => {
        console.log(`${i + 1}. ${sub.email} - ${sub.name || 'No name'} (${sub.source || 'unknown source'})`);
      });
    } else {
      console.log('⚠️  No email subscribers found in database!');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSubscribers();
