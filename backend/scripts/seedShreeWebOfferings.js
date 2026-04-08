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
    detailedDescription: 'This complimentary session is designed to create space for an honest conversation about where you are right now. We\'ll explore what\'s present for you—whether that\'s a specific challenge, a transition you\'re navigating, or simply a sense that something needs to shift. There\'s no pressure, no sales pitch—just clarity on whether this work resonates with what you need at this moment.',
    whoIsThisFor: 'This is for anyone who is curious about the work but wants to understand how it applies to their specific situation before committing. It\'s also ideal for those who value alignment and want to ensure there\'s a genuine fit before moving forward.',
    whatYouWillReceive: 'A 30-minute conversation where we discuss your current state, what you\'re seeking, and how this work might support you. You\'ll leave with clarity on next steps—whether that\'s booking a session, exploring a program, or simply knowing this isn\'t the right fit right now.',
    price: 'Complimentary',
    category: 'introductory',
    featured: false,
    order: 0,
    isActive: true,
    features: [
      'Understand your current state',
      'Explore alignment with the work',
      'No commitment required'
    ],
    highlights: [
      'Honest, pressure-free conversation',
      'Clarity on whether this work is right for you',
      'Understanding of how sessions work',
      'Personalized recommendations for next steps'
    ],
    outcomes: [
      'Clear sense of alignment with the work',
      'Understanding of what to expect from sessions',
      'Confidence in your next steps',
      'No obligation to continue'
    ]
  },
  
  // Single Sessions
  {
    title: 'Single Session',
    subtitle: 'One-Time Support',
    duration: '60 Minutes',
    description: 'A standalone session for those seeking clarity, energetic alignment, or support with a specific situation. Ideal for addressing immediate needs or exploring the work before committing further.',
    detailedDescription: 'This 60-minute session is designed for focused work on a specific area of your life. Whether you\'re facing an important decision, navigating a challenging situation, or simply feeling stuck, this session creates space for clarity and energetic recalibration. The work is intuitive and responsive—we address what\'s most present for you in the moment, clearing blocks and restoring flow where it\'s needed most.',
    whoIsThisFor: 'Perfect for those who need immediate support with a specific challenge, are new to this work and want to experience it before committing to a program, or simply prefer working on an as-needed basis rather than ongoing sessions.',
    whatYouWillReceive: 'A full 60-minute session combining conversation, energy work, and practical guidance. You\'ll receive clarity on your situation, energetic clearing and alignment, and actionable insights you can apply immediately. Sessions are conducted remotely via video call.',
    price: '$45',
    category: 'single',
    featured: false,
    order: 1,
    isActive: true,
    features: [
      'Focused energy work',
      'Address specific concerns',
      'Immediate clarity and support'
    ],
    highlights: [
      'Immediate clarity on pressing issues',
      'Energetic clearing and alignment',
      'Practical, actionable guidance',
      'No long-term commitment required',
      'Remote sessions via video call'
    ],
    outcomes: [
      'Greater clarity on your situation',
      'Reduced mental and emotional overwhelm',
      'Restored sense of flow and alignment',
      'Confidence in your next steps',
      'Tangible shifts you can feel immediately'
    ]
  },
  
  {
    title: 'Extended Session',
    subtitle: 'Deeper Work',
    duration: '90 Minutes',
    description: 'For those who need more time and space to work through deeper patterns, blocks, or transitions. This extended format allows for a more thorough exploration and integration.',
    detailedDescription: 'The extended session provides additional time and space for deeper work. This format is ideal when you\'re dealing with complex patterns, multiple layers of a situation, or significant life transitions that require more thorough attention. The extra 30 minutes allows for more comprehensive energy work, deeper exploration of root causes, and better integration of the shifts that occur during the session.',
    whoIsThisFor: 'Best suited for those working through significant transitions or complex situations, dealing with deeply rooted patterns that need more time to address, or who have experienced single sessions and know they need more space for the work to unfold.',
    whatYouWillReceive: 'A comprehensive 90-minute session with extended time for both conversation and energy work. You\'ll receive deeper pattern exploration and clearing, more thorough energetic recalibration, enhanced integration support, and detailed guidance for continuing the work between sessions.',
    price: '$65',
    category: 'single',
    featured: true,
    order: 2,
    isActive: true,
    features: [
      'Extended time for deeper work',
      'Thorough pattern exploration',
      'Enhanced integration support'
    ],
    highlights: [
      'Extra time for complex situations',
      'Deeper root cause exploration',
      'More comprehensive energy clearing',
      'Enhanced integration practices',
      'Detailed post-session guidance'
    ],
    outcomes: [
      'Profound shifts in long-standing patterns',
      'Deeper understanding of root causes',
      'More sustainable energetic alignment',
      'Greater capacity for integration',
      'Lasting clarity and direction'
    ]
  },
  
  // Recurring Sessions
  {
    title: 'Monthly Support',
    subtitle: 'Ongoing Alignment',
    duration: '4 Sessions / Month',
    description: 'Consistent support for those navigating ongoing shifts, building momentum, or maintaining energetic clarity. Sessions are scheduled weekly or bi-weekly based on your needs.',
    detailedDescription: 'Monthly support provides consistent, ongoing work for those who are actively building something, navigating sustained periods of growth or transition, or maintaining the clarity and alignment they\'ve cultivated. Regular sessions create momentum and prevent old patterns from re-establishing themselves. This format allows us to work more strategically over time, addressing layers as they emerge and supporting you through the natural ebbs and flows of your journey.',
    whoIsThisFor: 'Ideal for entrepreneurs and leaders who need consistent energetic support, those in active growth phases who want to maintain momentum, anyone navigating extended transitions or life changes, or those who have completed a program and want ongoing maintenance.',
    whatYouWillReceive: 'Four 60-minute sessions per month, scheduled weekly or bi-weekly based on your preference. You\'ll receive priority booking access, flexible scheduling to accommodate your needs, continuous momentum and accountability, and the ability to address issues as they arise rather than waiting for them to compound.',
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
    ],
    highlights: [
      'Consistent weekly or bi-weekly support',
      'Priority access to booking slots',
      'Sustained momentum and progress',
      'Proactive pattern management',
      'Flexible scheduling options'
    ],
    outcomes: [
      'Sustained clarity and alignment',
      'Consistent forward momentum',
      'Prevention of pattern regression',
      'Deeper integration over time',
      'Greater resilience during challenges'
    ]
  },
  
  // Programs
  {
    title: 'Realignment Program',
    subtitle: 'Structured Transformation',
    duration: '8 Sessions',
    description: 'A focused container for those ready to address core patterns, recalibrate their energy, and create sustainable shifts. This program provides structure, accountability, and deeper integration over time.',
    detailedDescription: 'The Realignment Program is an 8-session container designed for focused, intentional transformation. Unlike single sessions that address immediate needs, this program allows us to work strategically with the deeper patterns that shape your experience. We\'ll identify core blocks, clear accumulated energetic debris, and recalibrate your system for sustained clarity and flow. The structured format ensures consistent momentum while allowing flexibility to address what emerges along the way.',
    whoIsThisFor: 'Perfect for those who are ready to commit to deeper work and sustainable change, recognize that their challenges stem from deeper patterns rather than surface issues, want structure and accountability in their transformation process, or are at a significant crossroads and need comprehensive support.',
    whatYouWillReceive: 'Eight 60-minute sessions scheduled over 8-12 weeks, structured progression through core patterns and blocks, personalized integration practices between sessions, email support for questions and guidance between sessions, and a clear framework for continuing the work independently after completion.',
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
    ],
    highlights: [
      'Comprehensive 8-session structure',
      'Strategic pattern clearing',
      'Personalized integration practices',
      'Email support between sessions',
      'Sustainable transformation focus',
      'Clear progression framework'
    ],
    outcomes: [
      'Significant shifts in core patterns',
      'Sustained energetic clarity',
      'Greater self-awareness and insight',
      'Improved decision-making capacity',
      'Tools for ongoing self-maintenance',
      'Lasting transformation that integrates into daily life'
    ]
  },
  
  {
    title: 'Transformation Program',
    subtitle: 'Complete Recalibration',
    duration: '12 Sessions',
    description: 'The most comprehensive offering. For visionaries, leaders, and those committed to profound personal evolution. This extended program allows for deep work, sustained momentum, and lasting transformation.',
    detailedDescription: 'The Transformation Program is the most comprehensive container for those committed to profound, lasting change. Over 12 sessions, we work through multiple layers of patterns, beliefs, and energetic blocks that have shaped your experience. This extended format allows for deeper work, more thorough integration, and the time needed for sustainable transformation to take root. It\'s designed for those who are ready to fundamentally shift how they show up in their life and work—not through force or willpower, but through deep recalibration and alignment.',
    whoIsThisFor: 'Designed for visionaries and leaders who are building something significant and need sustained support, those ready for profound personal evolution and willing to commit to the process, anyone navigating major life or business transitions that require comprehensive support, or those who have done significant personal work and are ready for the next level of transformation.',
    whatYouWillReceive: 'Twelve 60-minute sessions scheduled over 12-16 weeks, comprehensive work through multiple layers of patterns and blocks, personalized integration plan tailored to your specific needs, priority scheduling with flexible booking options, ongoing email support throughout the program, access to a curated resource library of practices and tools, and a clear framework for maintaining your transformation long-term.',
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
    ],
    highlights: [
      'Most comprehensive program available',
      'Deep multi-layered transformation',
      'Personalized integration plan',
      'Priority scheduling and flexibility',
      'Continuous email support',
      'Exclusive resource library access',
      'Long-term sustainability focus'
    ],
    outcomes: [
      'Profound shifts in how you experience life',
      'Fundamental recalibration of your energetic system',
      'Sustained clarity and alignment',
      'Enhanced leadership and decision-making capacity',
      'Greater ease and flow in all areas of life',
      'Deep self-trust and inner knowing',
      'Lasting transformation that continues beyond the program'
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
