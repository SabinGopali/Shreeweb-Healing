import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ShreeWebOffering from '../models/ShreeWebOffering.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const sampleOfferings = [
  // Introductory
  {
    title: 'Discovery Call',
    subtitle: 'Start Here',
    duration: '30 Minutes',
    description: 'A brief, focused conversation to explore where you are, what you\'re seeking, and whether this work aligns with your current path.',
    price: 'Complimentary',
    category: 'introductory',
    featured: false,
    order: 0,
    isActive: true,
    features: [
      'Understand your current state',
      'Explore alignment with the work',
      'No commitment required'
    ]
  },
  
  // Single Sessions
  {
    title: 'Single Session',
    subtitle: 'One-Time Support',
    duration: '60 Minutes',
    description: 'A standalone session for those seeking clarity, energetic alignment, or support with a specific situation. Ideal for addressing immediate needs or exploring the work before committing further.',
    price: '$45',
    category: 'single',
    featured: false,
    order: 1,
    isActive: true,
    features: [
      'Focused energy work',
      'Address specific concerns',
      'Immediate clarity and support'
    ]
  },
  
  {
    title: 'Extended Session',
    subtitle: 'Deeper Work',
    duration: '90 Minutes',
    description: 'For those who need more time and space to work through deeper patterns, blocks, or transitions. This extended format allows for a more thorough exploration and integration.',
    price: '$65',
    category: 'single',
    featured: true,
    order: 2,
    isActive: true,
    features: [
      'Extended time for deeper work',
      'Thorough pattern exploration',
      'Enhanced integration support'
    ]
  },
  
  // Recurring Sessions
  {
    title: 'Monthly Support',
    subtitle: 'Ongoing Alignment',
    duration: '4 Sessions / Month',
    description: 'Consistent support for those navigating ongoing shifts, building momentum, or maintaining energetic clarity. Sessions are scheduled weekly or bi-weekly based on your needs.',
    price: '$160 / month',
    category: 'recurring',
    featured: false,
    order: 3,
    isActive: true,
    features: [
      '4 sessions per month',
      'Flexible scheduling',
      'Continuous momentum',
      'Priority booking'
    ]
  },
  
  // Programs
  {
    title: 'Realignment Program',
    subtitle: 'Structured Transformation',
    duration: '8 Sessions',
    description: 'A focused container for those ready to address core patterns, recalibrate their energy, and create sustainable shifts. This program provides structure, accountability, and deeper integration over time.',
    price: '$320',
    category: 'program',
    featured: true,
    order: 4,
    isActive: true,
    features: [
      '8 structured sessions',
      'Core pattern work',
      'Accountability and support',
      'Integration practices',
      'Email support between sessions'
    ]
  },
  
  {
    title: 'Transformation Program',
    subtitle: 'Complete Recalibration',
    duration: '12 Sessions',
    description: 'The most comprehensive offering. For visionaries, leaders, and those committed to profound personal evolution. This extended program allows for deep work, sustained momentum, and lasting transformation.',
    price: '$450',
    category: 'program',
    featured: true,
    order: 5,
    isActive: true,
    features: [
      '12 comprehensive sessions',
      'Deep transformational work',
      'Personalized integration plan',
      'Priority scheduling',
      'Ongoing email support',
      'Resource library access'
    ]
  }
];

async function seedOfferings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');

    // Clear existing offerings
    await ShreeWebOffering.deleteMany({});
    console.log('Cleared existing offerings');

    // Insert sample offerings
    const result = await ShreeWebOffering.insertMany(sampleOfferings);
    console.log(`✅ Successfully seeded ${result.length} offerings:`);
    
    result.forEach((offering, index) => {
      console.log(`${index + 1}. ${offering.title} (${offering.category}) - ${offering.price}`);
    });

    console.log('\n📊 Offerings by category:');
    const categories = ['introductory', 'single', 'recurring', 'program'];
    for (const cat of categories) {
      const count = result.filter(o => o.category === cat).length;
      console.log(`   ${cat}: ${count} offering(s)`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding offerings:', error);
    process.exit(1);
  }
}

seedOfferings();
