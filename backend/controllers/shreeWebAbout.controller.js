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
          image: '',
          imageAlt: 'About me',
          backgroundColor: 'from-stone-50 to-amber-50'
        },
        imageGallery: {
          enabled: true,
          title: 'Experience the Journey',
          subtitle: 'Moments of transformation and clarity',
          backgroundColor: '#EDE7DC',
          images: []
        },
        pranicHealing: {
          enabled: true,
          title: 'About Pranic Healing',
          subtitle: 'Ancient wisdom for modern transformation',
          content: 'Pranic Healing is a highly evolved and tested system of energy healing that utilizes prana to balance, harmonize and transform the body\'s energy processes. Prana is the Sanskrit word that means life-force, the invisible bio-energy or vital energy that keeps the body alive and maintains good health.\n\nThis no-touch energy healing system is based on the fundamental principle that the body has the innate ability to heal itself. Pranic Healing works on the principle that the healing process is accelerated by increasing the life force or vital energy on the affected part of the physical body.\n\nIn our sessions, we use Pranic Healing techniques to cleanse and energize your energy body, removing energetic blockages and diseased energy that may be causing physical, emotional, or mental imbalances. The result is a clearer, more balanced state that allows your natural vitality and clarity to emerge.',
          image: '',
          imageAlt: 'Pranic Healing energy work',
          backgroundColor: 'from-amber-50 to-orange-50',
          benefits: [
            {
              title: 'Physical Wellness',
              description: 'Accelerates the body\'s natural healing ability for physical ailments and chronic conditions.',
              icon: 'heart',
              order: 1
            },
            {
              title: 'Mental Clarity',
              description: 'Clears mental fog and enhances focus, decision-making, and cognitive function.',
              icon: 'brain',
              order: 2
            },
            {
              title: 'Emotional Balance',
              description: 'Releases emotional blockages and promotes inner peace and emotional stability.',
              icon: 'lightning',
              order: 3
            },
            {
              title: 'Energetic Protection',
              description: 'Strengthens your energy field and builds resilience against external stressors.',
              icon: 'shield',
              order: 4
            }
          ]
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

// Upload gallery image
export const uploadGalleryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Convert absolute file path to relative URL path
    let imageUrl = req.file.path.replace(/\\/g, '/');
    
    // Extract the part after 'uploads' directory
    const uploadsIndex = imageUrl.toLowerCase().indexOf('uploads/');
    if (uploadsIndex !== -1) {
      imageUrl = '/' + imageUrl.substring(uploadsIndex);
    } else {
      // Fallback: use the filename
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Ensure it starts with /uploads/
    if (!imageUrl.startsWith('/uploads/')) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    next(error);
  }
};

// Upload multiple gallery images
export const uploadMultipleGalleryImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedImages = req.files.map(file => {
      let imageUrl = file.path.replace(/\\/g, '/');
      
      const uploadsIndex = imageUrl.toLowerCase().indexOf('uploads/');
      if (uploadsIndex !== -1) {
        imageUrl = '/' + imageUrl.substring(uploadsIndex);
      } else {
        imageUrl = `/uploads/${file.filename}`;
      }

      if (!imageUrl.startsWith('/uploads/')) {
        imageUrl = `/uploads/${file.filename}`;
      }

      return {
        url: imageUrl,
        filename: file.filename,
        originalName: file.originalname
      };
    });

    res.status(200).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Error uploading multiple gallery images:', error);
    next(error);
  }
};

// Upload About Me image
export const uploadAboutMeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    let imageUrl = req.file.path.replace(/\\/g, '/');
    
    const uploadsIndex = imageUrl.toLowerCase().indexOf('uploads/');
    if (uploadsIndex !== -1) {
      imageUrl = '/' + imageUrl.substring(uploadsIndex);
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl.startsWith('/uploads/')) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    res.status(200).json({
      success: true,
      message: 'About Me image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading About Me image:', error);
    next(error);
  }
};

// Upload Pranic Healing image
export const uploadPranicHealingImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    let imageUrl = req.file.path.replace(/\\/g, '/');
    
    const uploadsIndex = imageUrl.toLowerCase().indexOf('uploads/');
    if (uploadsIndex !== -1) {
      imageUrl = '/' + imageUrl.substring(uploadsIndex);
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl.startsWith('/uploads/')) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    res.status(200).json({
      success: true,
      message: 'Pranic Healing image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading Pranic Healing image:', error);
    next(error);
  }
};