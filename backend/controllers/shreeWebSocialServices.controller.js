import ShreeWebSocialServices from '../models/ShreeWebSocialServices.model.js';

// Get social services data (public endpoint)
export const getPublicSocialServices = async (req, res, next) => {
  try {
    let socialServices = await ShreeWebSocialServices.findOne()
      .sort({ createdAt: 1 })
      .select('-createdBy -updatedBy');

    // If no section exists, create default one
    if (!socialServices) {
      socialServices = new ShreeWebSocialServices({});
      await socialServices.save();
      
      // Remove sensitive fields for public response
      socialServices = socialServices.toObject();
      delete socialServices.createdBy;
      delete socialServices.updatedBy;
    }

    res.status(200).json({
      success: true,
      socialServices
    });
  } catch (error) {
    next(error);
  }
};

// Get social services data (admin endpoint)
export const getSocialServices = async (req, res, next) => {
  try {
    let socialServices = await ShreeWebSocialServices.findOne()
      .sort({ createdAt: 1 })
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    // If no section exists, create default one
    if (!socialServices) {
      socialServices = new ShreeWebSocialServices({
        createdBy: req.admin?.adminId,
        updatedBy: req.admin?.adminId
      });
      await socialServices.save();
      
      // Populate the response
      await socialServices.populate('createdBy', 'username email');
      await socialServices.populate('updatedBy', 'username email');
    }

    res.status(200).json({
      success: true,
      socialServices
    });
  } catch (error) {
    next(error);
  }
};

// Update social services data
export const updateSocialServices = async (req, res, next) => {
  try {
    const {
      socialMedia,
      mainHeading,
      description,
      primaryButton,
      secondaryButton,
      styling,
      isActive,
      communitySection,
      callToAction
    } = req.body;

    // Validation
    if (!mainHeading?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Main heading is required'
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    // Find existing or create new
    let socialServices = await ShreeWebSocialServices.findOne().sort({ createdAt: 1 });
    
    if (!socialServices) {
      socialServices = new ShreeWebSocialServices({
        createdBy: req.admin?.adminId
      });
    }

    // Update fields
    if (socialMedia) socialServices.socialMedia = socialMedia;
    if (mainHeading) socialServices.mainHeading = mainHeading;
    if (description) socialServices.description = description;
    if (primaryButton) socialServices.primaryButton = primaryButton;
    if (secondaryButton) socialServices.secondaryButton = secondaryButton;
    if (styling) socialServices.styling = styling;
    if (typeof isActive === 'boolean') socialServices.isActive = isActive;
    if (communitySection) socialServices.communitySection = communitySection;
    if (callToAction) socialServices.callToAction = callToAction;
    
    socialServices.updatedBy = req.admin?.adminId;

    await socialServices.save();

    // Populate for response
    await socialServices.populate('createdBy', 'username email');
    await socialServices.populate('updatedBy', 'username email');

    res.status(200).json({
      success: true,
      message: 'Social services section updated successfully',
      socialServices
    });
  } catch (error) {
    next(error);
  }
};

// Reset social services to defaults
export const resetSocialServices = async (req, res, next) => {
  try {
    // Delete existing
    await ShreeWebSocialServices.deleteMany({});
    
    // Create new with defaults
    const socialServices = new ShreeWebSocialServices({
      createdBy: req.admin?.adminId,
      updatedBy: req.admin?.adminId
    });
    
    await socialServices.save();
    
    // Populate for response
    await socialServices.populate('createdBy', 'username email');
    await socialServices.populate('updatedBy', 'username email');

    res.status(200).json({
      success: true,
      message: 'Social services section reset to defaults',
      socialServices
    });
  } catch (error) {
    next(error);
  }
};