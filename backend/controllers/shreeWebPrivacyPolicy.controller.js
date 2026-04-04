import ShreeWebPrivacyPolicy from '../models/ShreeWebPrivacyPolicy.model.js';

// Get Privacy Policy content
export const getPrivacyPolicyContent = async (req, res, next) => {
  try {
    let privacyContent = await ShreeWebPrivacyPolicy.findOne({ isActive: true }).sort({ createdAt: -1 });

    // If no content exists, create default content
    if (!privacyContent) {
      privacyContent = new ShreeWebPrivacyPolicy({});
      await privacyContent.save();
    }

    res.status(200).json({
      success: true,
      data: privacyContent
    });
  } catch (error) {
    console.error('Error fetching privacy policy content:', error);
    next(error);
  }
};

// Update Privacy Policy content
export const updatePrivacyPolicyContent = async (req, res, next) => {
  try {
    const updates = req.body;
    updates.lastUpdated = new Date();

    let privacyContent = await ShreeWebPrivacyPolicy.findOne({ isActive: true });

    if (!privacyContent) {
      privacyContent = new ShreeWebPrivacyPolicy(updates);
    } else {
      Object.assign(privacyContent, updates);
    }

    await privacyContent.save();

    res.status(200).json({
      success: true,
      message: 'Privacy policy content updated successfully',
      data: privacyContent
    });
  } catch (error) {
    console.error('Error updating privacy policy content:', error);
    next(error);
  }
};

// Update specific section
export const updatePrivacyPolicySection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const updates = req.body;

    let privacyContent = await ShreeWebPrivacyPolicy.findOne({ isActive: true });

    if (!privacyContent) {
      return res.status(404).json({
        success: false,
        message: 'Privacy policy content not found'
      });
    }

    if (!privacyContent[section]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name'
      });
    }

    privacyContent[section] = { ...privacyContent[section].toObject(), ...updates };
    privacyContent.lastUpdated = new Date();

    await privacyContent.save();

    res.status(200).json({
      success: true,
      message: `${section} section updated successfully`,
      data: privacyContent
    });
  } catch (error) {
    console.error(`Error updating ${req.params.section} section:`, error);
    next(error);
  }
};