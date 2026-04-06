import ShreeWebHero from '../models/ShreeWebHero.model.js';
import { errorHandler } from '../utils/error.js';

// Get active hero section (public endpoint)
export const getActiveHero = async (req, res, next) => {
  try {
    let hero = await ShreeWebHero.findOne({ isActive: true });
    
    // If no hero exists, create default one
    if (!hero) {
      hero = new ShreeWebHero({
        title: 'OMSHREEGUIDANCE',
        subtitle: 'Energetic alignment for sustainable expansion',
        ctaText: 'Begin Your Journey',
        backgroundType: 'image',
        backgroundImage: '/healing.webp',
        backgroundVideo: '',
        overlayOpacity: 20,
        titleSize: 'text-8xl md:text-9xl',
        titleColor: 'text-white',
        subtitleColor: 'text-white/80',
        ctaStyle: 'transparent',
        isActive: true
      });
      await hero.save();
    }
    
    res.status(200).json({
      success: true,
      hero
    });
  } catch (error) {
    next(error);
  }
};

// Get hero section for admin (protected)
export const getHero = async (req, res, next) => {
  try {
    let hero = await ShreeWebHero.findOne({ isActive: true });
    
    // If no hero exists, create default one
    if (!hero) {
      hero = new ShreeWebHero({
        title: 'OMSHREEGUIDANCE',
        subtitle: 'Energetic alignment for sustainable expansion',
        ctaText: 'Begin Your Journey',
        backgroundType: 'image',
        backgroundImage: '/healing.webp',
        backgroundVideo: '',
        overlayOpacity: 20,
        titleSize: 'text-8xl md:text-9xl',
        titleColor: 'text-white',
        subtitleColor: 'text-white/80',
        ctaStyle: 'transparent',
        isActive: true,
        createdBy: req.admin.adminId
      });
      await hero.save();
    }
    
    res.status(200).json({
      success: true,
      hero
    });
  } catch (error) {
    next(error);
  }
};

// Update hero section (admin only)
export const updateHero = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      ctaText,
      backgroundType,
      backgroundImage,
      backgroundVideo,
      overlayOpacity,
      titleSize,
      titleColor,
      subtitleColor,
      ctaStyle
    } = req.body;

    // Validate background type
    const validBackgroundTypes = ['image', 'video'];
    if (backgroundType && !validBackgroundTypes.includes(backgroundType)) {
      return next(errorHandler(400, 'Invalid background type'));
    }

    // Validate overlay opacity
    if (overlayOpacity !== undefined && (overlayOpacity < 0 || overlayOpacity > 80)) {
      return next(errorHandler(400, 'Overlay opacity must be between 0 and 80'));
    }

    // Validate title size
    const validTitleSizes = ['text-6xl md:text-7xl', 'text-7xl md:text-8xl', 'text-8xl md:text-9xl', 'text-9xl md:text-10xl'];
    if (titleSize && !validTitleSizes.includes(titleSize)) {
      return next(errorHandler(400, 'Invalid title size'));
    }

    // Validate CTA style
    const validCtaStyles = ['transparent', 'gradient', 'solid'];
    if (ctaStyle && !validCtaStyles.includes(ctaStyle)) {
      return next(errorHandler(400, 'Invalid CTA style'));
    }

    let hero = await ShreeWebHero.findOne({ isActive: true });
    
    if (!hero) {
      // Create new hero if none exists
      hero = new ShreeWebHero({
        title: title || 'OMSHREEGUIDANCE',
        subtitle: subtitle || 'Energetic alignment for sustainable expansion',
        ctaText: ctaText || 'Begin Your Journey',
        backgroundType: backgroundType || 'image',
        backgroundImage: backgroundImage || '/healing.webp',
        backgroundVideo: backgroundVideo || '',
        overlayOpacity: overlayOpacity !== undefined ? overlayOpacity : 20,
        titleSize: titleSize || 'text-8xl md:text-9xl',
        titleColor: titleColor || 'text-white',
        subtitleColor: subtitleColor || 'text-white/80',
        ctaStyle: ctaStyle || 'transparent',
        isActive: true,
        createdBy: req.admin.adminId,
        updatedBy: req.admin.adminId
      });
    } else {
      // Update existing hero
      if (title !== undefined) hero.title = title;
      if (subtitle !== undefined) hero.subtitle = subtitle;
      if (ctaText !== undefined) hero.ctaText = ctaText;
      if (backgroundType !== undefined) hero.backgroundType = backgroundType;
      if (backgroundImage !== undefined) hero.backgroundImage = backgroundImage;
      if (backgroundVideo !== undefined) hero.backgroundVideo = backgroundVideo;
      if (overlayOpacity !== undefined) hero.overlayOpacity = overlayOpacity;
      if (titleSize !== undefined) hero.titleSize = titleSize;
      if (titleColor !== undefined) hero.titleColor = titleColor;
      if (subtitleColor !== undefined) hero.subtitleColor = subtitleColor;
      if (ctaStyle !== undefined) hero.ctaStyle = ctaStyle;
      
      hero.updatedBy = req.admin.adminId;
    }

    await hero.save();

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      hero
    });
  } catch (error) {
    next(error);
  }
};

// Reset hero section to defaults (admin only)
export const resetHero = async (req, res, next) => {
  try {
    let hero = await ShreeWebHero.findOne({ isActive: true });
    
    if (!hero) {
      hero = new ShreeWebHero({
        createdBy: req.admin.adminId
      });
    } else {
      // Reset to defaults
      hero.title = 'OMSHREEGUIDANCE';
      hero.subtitle = 'Energetic alignment for sustainable expansion';
      hero.ctaText = 'Begin Your Journey';
      hero.backgroundType = 'image';
      hero.backgroundImage = '/healing.webp';
      hero.backgroundVideo = '';
      hero.overlayOpacity = 20;
      hero.titleSize = 'text-8xl md:text-9xl';
      hero.titleColor = 'text-white';
      hero.subtitleColor = 'text-white/80';
      hero.ctaStyle = 'transparent';
      hero.updatedBy = req.admin.adminId;
    }

    await hero.save();

    res.status(200).json({
      success: true,
      message: 'Hero section reset to defaults successfully',
      hero
    });
  } catch (error) {
    next(error);
  }
};