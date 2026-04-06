import ShreeWebAbout from '../models/ShreeWebAbout.model.js';

// Get About page content
export const getAboutContent = async (req, res, next) => {
  try {
    let aboutContent = await ShreeWebAbout.findOne({ isActive: true }).sort({ createdAt: -1 });

    // If no content exists, create default content
    if (!aboutContent) {
      aboutContent = new ShreeWebAbout({
        hero: {
          tag: 'About',
          title: 'OMSHREEGUIDANCE',
          subtitle: 'Energy Sessions',
          description: 'A calm, structured approach to help you scan your energetic field, release what\'s stuck, and return to balance.',
          backgroundColor: 'from-[#F4EFE6] via-amber-50 to-orange-50'
        },
        aboutMe: {
          title: 'About me',
          subtitle: 'Holding space for visionaries.',
          content: 'This work didn\'t begin as something I planned — it grew quietly, through people who came to me when they needed support.\n\nAt first, it was physical — chronic pain, ongoing issues, things that felt stuck. But over time, I started noticing something more. The shifts weren\'t just in the body. They were happening in the moments that mattered.\n\nConfidence before important conversations. Clarity before big decisions. Things opening up… before they needed to. That\'s when I began to understand the deeper nature of this work.\n\nYour external reality — your business, your results, the way life responds to you — is deeply connected to your internal state. When that internal space is clear, things move differently. With more ease. More precision. Less force.\n\nWhat started as helping people heal has naturally expanded into supporting alignment, clarity, and energetic balance — especially for those who are building and leading.\n\nIt\'s not about doing more. It\'s about being clear enough to let it flow.',
          backgroundColor: 'from-stone-50 to-amber-50'
        },
        whatWeDo: {
          title: 'What we do',
          description: 'The sessions work with your energetic system to cleanse, balance, and strengthen internal stability. The goal is to reduce internal resistance so you can hold your success with more ease.',
          backgroundColor: '#F4EFE6',
          services: [
            {
              title: 'Scanning',
              description: 'Identify energy leaks and blocks that create friction in your daily experience.',
              icon: 'circle',
              order: 1
            },
            {
              title: 'Cleansing',
              description: 'Release stagnant energy and clear external "noise" that no longer serves you.',
              icon: 'filled-circle',
              order: 2
            },
            {
              title: 'Balancing',
              description: 'Restore harmony and guide you back to a state of grounded power.',
              icon: 'grid',
              order: 3
            }
          ]
        },
        philosophy: {
          title: 'The OMSHREEGUIDANCE Approach',
          description: 'Inspired by the minimalist principles of Japanese and Scandinavian design, our approach emphasizes simplicity, natural harmony, and sustainable well-being.',
          backgroundColor: 'from-stone-50 to-amber-50',
          principles: [
            {
              title: 'Simplicity',
              description: 'We focus on what\'s essential, removing energetic clutter to reveal your natural clarity and strength.',
              icon: 'lightning',
              order: 1
            },
            {
              title: 'Natural Harmony',
              description: 'Working with your body\'s innate wisdom to restore balance rather than forcing change.',
              icon: 'heart',
              order: 2
            },
            {
              title: 'Sustainable Growth',
              description: 'Building internal capacity that supports long-term expansion without burnout.',
              icon: 'chart',
              order: 3
            },
            {
              title: 'Mindful Presence',
              description: 'Cultivating awareness and presence as the foundation for all meaningful transformation.',
              icon: 'bulb',
              order: 4
            }
          ]
        },
        howToStart: {
          title: 'How to get started',
          description: 'Your journey toward energetic alignment begins with a simple, structured process',
          backgroundColor: '#F4EFE6',
          steps: [
            {
              number: 1,
              title: 'Choose Your Path',
              description: 'Select an offering that matches your current capacity and desired expansion.',
              buttonText: 'View Offerings',
              buttonLink: '/shreeweb/offers',
              order: 1
            },
            {
              number: 2,
              title: 'Complete Setup',
              description: 'Complete payment and submit the intake form to help us understand your needs.',
              buttonText: 'Secure Process',
              buttonLink: '',
              order: 2
            },
            {
              number: 3,
              title: 'Begin Your Journey',
              description: 'Book your session and receive personalized guidance for your transformation.',
              buttonText: 'Book Session',
              buttonLink: '/shreeweb/booking',
              order: 3
            }
          ]
        },
        callToAction: {
          title: 'Ready to begin?',
          description: 'Start with a complimentary Discovery Call to explore what\'s possible for you.',
          primaryButtonText: 'Schedule Discovery Call',
          primaryButtonLink: '/shreeweb/booking?plan=discovery',
          secondaryButtonText: 'View All Offerings',
          secondaryButtonLink: '/shreeweb/offers',
          quote: '"The journey of a thousand miles begins with a single step." - Lao Tzu',
          backgroundColor: 'from-stone-100 via-amber-50 to-orange-100'
        }
      });

      await aboutContent.save();
    }

    res.status(200).json({
      success: true,
      data: aboutContent
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    next(error);
  }
};

// Update About page content
export const updateAboutContent = async (req, res, next) => {
  try {
    const updates = req.body;
    updates.lastUpdated = new Date();

    let aboutContent = await ShreeWebAbout.findOne({ isActive: true });

    if (!aboutContent) {
      aboutContent = new ShreeWebAbout(updates);
    } else {
      Object.assign(aboutContent, updates);
    }

    await aboutContent.save();

    res.status(200).json({
      success: true,
      message: 'About content updated successfully',
      data: aboutContent
    });
  } catch (error) {
    console.error('Error updating about content:', error);
    next(error);
  }
};

// Update specific section
export const updateAboutSection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const updates = req.body;

    let aboutContent = await ShreeWebAbout.findOne({ isActive: true });

    if (!aboutContent) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }

    if (!aboutContent[section]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name'
      });
    }

    aboutContent[section] = { ...aboutContent[section].toObject(), ...updates };
    aboutContent.lastUpdated = new Date();

    await aboutContent.save();

    res.status(200).json({
      success: true,
      message: `${section} section updated successfully`,
      data: aboutContent
    });
  } catch (error) {
    console.error(`Error updating ${req.params.section} section:`, error);
    next(error);
  }
};