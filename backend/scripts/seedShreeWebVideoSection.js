import mongoose from 'mongoose';
import ShreeWebVideoSection from '../models/ShreeWebVideoSection.model.js';
import dotenv from 'dotenv';

dotenv.config();

const seedVideoSection = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');

    // Clear existing video sections
    await ShreeWebVideoSection.deleteMany({});
    console.log('Cleared existing video sections');

    // Create new video section with sample data
    const videoSection = new ShreeWebVideoSection({
      videoImage: '/healing2.png',
      youtubeUrl: '',
      youtubeRedirectUrl: '',
      title: 'Your next level of success may require more than strategy.',
      description: 'Through structured sessions using Pranic Healing, I help entrepreneurs and ambitious professionals clear energetic blockages, restore balance, and strengthen their internal capacity for growth.',
      cta1Text: 'Schedule a Discovery Call',
      cta2Text: 'Book a Session',
      cta1Link: '/shreeweb/booking?plan=discovery',
      cta2Link: '/shreeweb/booking?plan=session',
      socialLinks: [
        { name: 'Facebook', url: 'https://facebook.com/japandi' },
        { name: 'Instagram', url: 'https://instagram.com/japandi' },
        { name: 'TikTok', url: 'https://tiktok.com/@japandi' }
      ],
      isActive: true
    });

    await videoSection.save();
    console.log('✅ Video section seeded successfully');
    console.log('Video section data:', JSON.stringify(videoSection, null, 2));

  } catch (error) {
    console.error('❌ Error seeding video section:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedVideoSection();