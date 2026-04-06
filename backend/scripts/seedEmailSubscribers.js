import mongoose from 'mongoose';
import EmailCapture from '../models/EmailCapture.model.js';
import dotenv from 'dotenv';

dotenv.config();

const testSubscribers = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    source: 'shreeweb',
    subscribed: true,
    tags: ['interested', 'vip']
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    source: 'newsletter',
    subscribed: true,
    tags: ['newsletter']
  },
  {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    source: 'contact_form',
    subscribed: true,
    tags: []
  },
  {
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    source: 'shreeweb',
    subscribed: false,
    tags: ['unsubscribed']
  }
];

async function seedEmailSubscribers() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB');

    // Add test subscribers (skip if email already exists)
    for (const subscriber of testSubscribers) {
      try {
        const existing = await EmailCapture.findOne({ email: subscriber.email });
        if (!existing) {
          await EmailCapture.create(subscriber);
          console.log(`✅ Added: ${subscriber.email}`);
        } else {
          console.log(`⏭️  Skipped (exists): ${subscriber.email}`);
        }
      } catch (error) {
        console.log(`❌ Error adding ${subscriber.email}:`, error.message);
      }
    }

    const total = await EmailCapture.countDocuments({});
    const subscribed = await EmailCapture.countDocuments({ subscribed: true });
    
    console.log('\n📊 Summary:');
    console.log(`   Total subscribers: ${total}`);
    console.log(`   Subscribed: ${subscribed}`);
    console.log(`   Unsubscribed: ${total - subscribed}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedEmailSubscribers();
