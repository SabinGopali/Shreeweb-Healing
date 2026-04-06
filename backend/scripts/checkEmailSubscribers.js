import mongoose from 'mongoose';
import EmailCapture from '../models/EmailCapture.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkEmailSubscribers() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB');

    const allSubscribers = await EmailCapture.find({});
    console.log('\n📊 Total Email Subscribers:', allSubscribers.length);

    if (allSubscribers.length > 0) {
      console.log('\n📧 Subscribers:');
      allSubscribers.forEach((sub, index) => {
        console.log(`${index + 1}. ${sub.email} - Source: ${sub.source} - Subscribed: ${sub.subscribed}`);
      });

      const subscribedOnly = await EmailCapture.find({ subscribed: true });
      console.log('\n✅ Subscribed Users:', subscribedOnly.length);

      const unsubscribed = await EmailCapture.find({ subscribed: false });
      console.log('❌ Unsubscribed Users:', unsubscribed.length);
    } else {
      console.log('\n⚠️  No email subscribers found in database!');
      console.log('\n💡 To add test subscribers, you can:');
      console.log('   1. Visit your website and subscribe via email capture form');
      console.log('   2. Or run: node backend/scripts/seedEmailSubscribers.js');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkEmailSubscribers();
