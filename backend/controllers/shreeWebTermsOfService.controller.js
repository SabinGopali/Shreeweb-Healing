import ShreeWebTermsOfService from '../models/ShreeWebTermsOfService.model.js';

// Get Terms of Service content
export const getTermsOfServiceContent = async (req, res, next) => {
  try {
    let termsContent = await ShreeWebTermsOfService.findOne({ isActive: true }).sort({ createdAt: -1 });

    // If no content exists, create default content
    if (!termsContent) {
      termsContent = new ShreeWebTermsOfService({});
      await termsContent.save();
    }

    res.status(200).json({
      success: true,
      data: termsContent
    });
  } catch (error) {
    console.error('Error fetching terms of service content:', error);
    next(error);
  }
};

// Update Terms of Service content
export const updateTermsOfServiceContent = async (req, res, next) => {
  try {
    const updates = req.body;
    updates.lastUpdated = new Date();

    let termsContent = await ShreeWebTermsOfService.findOne({ isActive: true });

    if (!termsContent) {
      termsContent = new ShreeWebTermsOfService(updates);
    } else {
      Object.assign(termsContent, updates);
    }

    await termsContent.save();

    res.status(200).json({
      success: true,
      message: 'Terms of service content updated successfully',
      data: termsContent
    });
  } catch (error) {
    console.error('Error updating terms of service content:', error);
    next(error);
  }
};

// Update specific section
export const updateTermsOfServiceSection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const updates = req.body;

    let termsContent = await ShreeWebTermsOfService.findOne({ isActive: true });

    if (!termsContent) {
      return res.status(404).json({
        success: false,
        message: 'Terms of service content not found'
      });
    }

    // Handle special case for lastUpdatedDate (string field)
    if (section === 'lastUpdatedDate') {
      termsContent.lastUpdatedDate = updates;
    } else if (section === 'introduction') {
      // Handle introduction section
      termsContent.introduction = { ...termsContent.introduction.toObject(), ...updates };
    } else if (!termsContent[section]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name'
      });
    } else {
      // Handle object sections
      termsContent[section] = { ...termsContent[section].toObject(), ...updates };
    }

    termsContent.lastUpdated = new Date();

    await termsContent.save();

    res.status(200).json({
      success: true,
      message: `${section} section updated successfully`,
      data: termsContent
    });
  } catch (error) {
    console.error(`Error updating ${req.params.section} section:`, error);
    next(error);
  }
};
