import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import ShreeWebNotification from '../models/ShreeWebNotification.model.js';
import ShreeWebAdmin from '../models/ShreeWebAdmin.model.js';

const sampleNotifications = [
  {
    type: 'lead',
    title: 'New Email Subscriber',
    message: 'Sarah Johnson subscribed to your newsletter',
    link: '/shreeweb/cms/leads',
    icon: 'email',
    priority: 'medium'
  },
  {
    type: 'contact',
    title: 'New Contact Message',
    message: 'Michael Chen sent you a message about alignment sessions',
    link: '/shreeweb/cms/contacts',
    icon: 'message',
    priority: 'high'
  },
  {
    type: 'booking',
    title: 'Session Booking Request',
    message: 'Emma Williams requested a discovery call for tomorrow',
    link: '/shreeweb/cms/bookings',
    icon: 'calendar',
    priority: 'high'
  },
  {
    type: 'system',
    title: 'Content Update Reminder',
    message: 'Your testimonials section hasn\'t been updated in 30 days',
    link: '/shreeweb/cms/testimonials-enhanced',
    icon: 'info',
    priority: 'low'
  },
  {
    type: 'content',
    title: 'Hero Section Updated',
    message: 'Your hero section content was successfully updated',
    link: '/shreeweb/cms/hero-section',
    icon: 'info',
    priority: 'low'
  }
];

async function seedNotifications() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO);
    console.log('✓ Connected to MongoDB');

    // Find the first admin
    const admin = await ShreeWebAdmin.findOne();
    
    if (!admin) {
      console.log('✗ No admin found. Please create an admin first.');
      process.exit(1);
    }

    console.log(`✓ Found admin: ${admin.username}`);

    // Clear existing notifications for this admin
    await ShreeWebNotification.deleteMany({ adminId: admin._id });
    console.log('✓ Cleared existing notifications');

    // Create sample notifications
    const notifications = sampleNotifications.map(notif => ({
      ...notif,
      adminId: admin._id
    }));

    await ShreeWebNotification.insertMany(notifications);
    console.log(`✓ Created ${notifications.length} sample notifications`);

    const unreadCount = await ShreeWebNotification.getUnreadCount(admin._id);
    console.log(`✓ Unread count: ${unreadCount}`);

    console.log('\n✓ Notification seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding notifications:', error);
    process.exit(1);
  }
}

seedNotifications();
