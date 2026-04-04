import ShreeWebClaritySection from '../models/ShreeWebClaritySection.model.js';

// Get clarity section data (public endpoint)
export const getPublicClaritySection = async (req, res, next) => {
  try {
    let claritySection = await ShreeWebClaritySection.findOne()
      .sort({ createdAt: 1 })
      .select('-createdBy -updatedBy');

    // If no section exists, create default one
    if (!claritySection) {
      claritySection = new ShreeWebClaritySection({});
      await claritySection.save();
      
      // Remove sensitive fields for public response
      claritySection = claritySection.toObject();
      delete claritySection.createdBy;
      delete claritySection.updatedBy;
    }

    res.status(200).json({
      success: true,
      claritySection
    });
  } catch (error) {
    next(error);
  }
};

// Get clarity section data (admin endpoint)
export const getClaritySection = async (req, res, next) => {
  try {
    let claritySection = await ShreeWebClaritySection.findOne()
      .sort({ createdAt: 1 })
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    // If no section exists, create default one
    if (!claritySection) {
      claritySection = new ShreeWebClaritySection({
        createdBy: req.admin?.adminId,
        updatedBy: req.admin?.adminId
      });
      await claritySection.save();
      
      // Populate the response
      await claritySection.populate('createdBy', 'username email');
      await claritySection.populate('updatedBy', 'username email');
    }

    res.status(200).json({
      success: true,
      claritySection
    });
  } catch (error) {
    next(error);
  }
};

// Update clarity section
export const updateClaritySection = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      buttonText
    } = req.body;

    let claritySection = await ShreeWebClaritySection.findOne();

    // If no section exists, create one
    if (!claritySection) {
      claritySection = new ShreeWebClaritySection({
        createdBy: req.admin.adminId,
        updatedBy: req.admin.adminId
      });
    }

    // Update fields
    if (title !== undefined) claritySection.title = title.trim();
    if (subtitle !== undefined) claritySection.subtitle = subtitle.trim();
    if (description !== undefined) claritySection.description = description.trim();
    if (buttonText !== undefined) claritySection.buttonText = buttonText.trim();
    
    claritySection.updatedBy = req.admin.adminId;

    await claritySection.save();

    // Populate the response
    await claritySection.populate('createdBy', 'username email');
    await claritySection.populate('updatedBy', 'username email');

    res.status(200).json({
      success: true,
      message: 'Clarity section updated successfully',
      claritySection
    });
  } catch (error) {
    next(error);
  }
};

// Reset clarity section to defaults
export const resetClaritySection = async (req, res, next) => {
  try {
    let claritySection = await ShreeWebClaritySection.findOne();

    if (!claritySection) {
      claritySection = new ShreeWebClaritySection({
        createdBy: req.admin.adminId,
        updatedBy: req.admin.adminId
      });
    } else {
      // Reset to default values
      claritySection.title = 'Restore clarity.';
      claritySection.subtitle = 'Expand naturally.';
      claritySection.description = 'Take the first step towards untangling the energetic knots holding you back. Let\'s explore what\'s possible when you are fully aligned.';
      claritySection.buttonText = 'Book a Discovery Call';
      claritySection.updatedBy = req.admin.adminId;
    }

    await claritySection.save();

    // Populate the response
    await claritySection.populate('createdBy', 'username email');
    await claritySection.populate('updatedBy', 'username email');

    res.status(200).json({
      success: true,
      message: 'Clarity section reset to defaults successfully',
      claritySection
    });
  } catch (error) {
    next(error);
  }
};