import ShreeWebVideoSection from '../models/ShreeWebVideoSection.model.js';
import { errorHandler } from '../utils/error.js';

// Get video section data
export const getVideoSection = async (req, res, next) => {
  try {
    const videoSection = await ShreeWebVideoSection.findOne({ isActive: true });
    
    if (!videoSection) {
      return res.status(404).json({
        success: false,
        message: 'No video section configured. Please create one in the CMS.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: videoSection
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to fetch video section data'));
  }
};

// Update video section data
export const updateVideoSection = async (req, res, next) => {
  try {
    const {
      videoImage,
      youtubeUrl,
      youtubeRedirectUrl,
      title,
      description,
      cta1Text,
      cta2Text,
      cta1Link,
      cta2Link,
      socialLinks
    } = req.body;

    // Find existing video section or create new one
    let videoSection = await ShreeWebVideoSection.findOne({ isActive: true });
    
    if (!videoSection) {
      videoSection = new ShreeWebVideoSection();
    }

    // Update fields
    if (videoImage !== undefined) videoSection.videoImage = videoImage;
    if (youtubeUrl !== undefined) videoSection.youtubeUrl = youtubeUrl;
    if (youtubeRedirectUrl !== undefined) videoSection.youtubeRedirectUrl = youtubeRedirectUrl;
    if (title !== undefined) videoSection.title = title;
    if (description !== undefined) videoSection.description = description;
    if (cta1Text !== undefined) videoSection.cta1Text = cta1Text;
    if (cta2Text !== undefined) videoSection.cta2Text = cta2Text;
    if (cta1Link !== undefined) videoSection.cta1Link = cta1Link;
    if (cta2Link !== undefined) videoSection.cta2Link = cta2Link;
    if (socialLinks !== undefined) videoSection.socialLinks = socialLinks;

    await videoSection.save();

    res.status(200).json({
      success: true,
      message: 'Video section updated successfully',
      data: videoSection
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to update video section'));
  }
};

// Create new video section
export const createVideoSection = async (req, res, next) => {
  try {
    const {
      videoImage,
      youtubeUrl,
      youtubeRedirectUrl,
      title,
      description,
      cta1Text,
      cta2Text,
      cta1Link,
      cta2Link,
      socialLinks
    } = req.body;

    // Validate required fields
    if (!videoImage || !title || !description || !cta1Text || !cta2Text) {
      return next(errorHandler(400, 'Missing required fields: videoImage, title, description, cta1Text, cta2Text'));
    }

    // Deactivate existing video sections
    await ShreeWebVideoSection.updateMany({}, { isActive: false });

    const videoSection = new ShreeWebVideoSection({
      videoImage,
      youtubeUrl: youtubeUrl || '',
      youtubeRedirectUrl: youtubeRedirectUrl || '',
      title,
      description,
      cta1Text,
      cta2Text,
      cta1Link: cta1Link || '/shreeweb/booking?plan=discovery',
      cta2Link: cta2Link || '/shreeweb/booking?plan=session',
      socialLinks: socialLinks || [],
      isActive: true
    });

    await videoSection.save();

    res.status(201).json({
      success: true,
      message: 'Video section created successfully',
      data: videoSection
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to create video section'));
  }
};

// Delete video section
export const deleteVideoSection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const videoSection = await ShreeWebVideoSection.findByIdAndDelete(id);
    
    if (!videoSection) {
      return next(errorHandler(404, 'Video section not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Video section deleted successfully'
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to delete video section'));
  }
};