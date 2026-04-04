import ShreeWebLoginSettings from '../models/ShreeWebLoginSettings.model.js';
import { errorHandler } from '../utils/error.js';

// Get login settings (public endpoint for login page)
export const getLoginSettings = async (req, res, next) => {
  try {
    let settings = await ShreeWebLoginSettings.findOne({ isActive: true });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new ShreeWebLoginSettings({});
      await settings.save();
    }
    
    // Return only public-facing settings (exclude sensitive admin info)
    const publicSettings = {
      brandName: settings.brandName,
      brandInitial: settings.brandInitial,
      subtitle: settings.subtitle,
      logoUrl: settings.logoUrl,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      backgroundColor: settings.backgroundColor,
      welcomeMessage: settings.welcomeMessage,
      footerText: settings.footerText,
      usernameLabel: settings.usernameLabel,
      passwordLabel: settings.passwordLabel,
      loginButtonText: settings.loginButtonText,
      usernamePlaceholder: settings.usernamePlaceholder,
      passwordPlaceholder: settings.passwordPlaceholder,
      loadingText: settings.loadingText,
      signingInText: settings.signingInText,
      showDevCredentials: process.env.NODE_ENV === 'development' ? settings.showDevCredentials : false,
      devCredentialsTitle: settings.devCredentialsTitle,
      roleRequirementMessage: settings.roleRequirementMessage,
      securityWarning: settings.securityWarning
    };
    
    res.status(200).json({
      success: true,
      settings: publicSettings
    });
  } catch (error) {
    next(error);
  }
};

// Get full login settings (admin only)
export const getAdminLoginSettings = async (req, res, next) => {
  try {
    let settings = await ShreeWebLoginSettings.findOne({ isActive: true });
    
    if (!settings) {
      settings = new ShreeWebLoginSettings({});
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// Update login settings (admin only)
export const updateLoginSettings = async (req, res, next) => {
  try {
    const {
      brandName,
      brandInitial,
      subtitle,
      logoUrl,
      primaryColor,
      secondaryColor,
      backgroundColor,
      welcomeMessage,
      footerText,
      usernameLabel,
      passwordLabel,
      loginButtonText,
      usernamePlaceholder,
      passwordPlaceholder,
      showDevCredentials,
      devCredentialsTitle,
      roleRequirementMessage,
      securityWarning,
      loadingText,
      signingInText
    } = req.body;

    // Validate color formats if provided
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (primaryColor && !colorRegex.test(primaryColor)) {
      return next(errorHandler(400, 'Invalid primary color format. Use hex format (#RRGGBB or #RGB)'));
    }
    if (secondaryColor && !colorRegex.test(secondaryColor)) {
      return next(errorHandler(400, 'Invalid secondary color format. Use hex format (#RRGGBB or #RGB)'));
    }

    // Validate brand initial length
    if (brandInitial && brandInitial.length > 3) {
      return next(errorHandler(400, 'Brand initial must be 3 characters or less'));
    }

    let settings = await ShreeWebLoginSettings.findOne({ isActive: true });
    
    if (!settings) {
      settings = new ShreeWebLoginSettings({});
    }

    // Update fields if provided
    if (brandName !== undefined) settings.brandName = brandName;
    if (brandInitial !== undefined) settings.brandInitial = brandInitial;
    if (subtitle !== undefined) settings.subtitle = subtitle;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;
    if (secondaryColor !== undefined) settings.secondaryColor = secondaryColor;
    if (backgroundColor !== undefined) settings.backgroundColor = backgroundColor;
    if (welcomeMessage !== undefined) settings.welcomeMessage = welcomeMessage;
    if (footerText !== undefined) settings.footerText = footerText;
    if (usernameLabel !== undefined) settings.usernameLabel = usernameLabel;
    if (passwordLabel !== undefined) settings.passwordLabel = passwordLabel;
    if (loginButtonText !== undefined) settings.loginButtonText = loginButtonText;
    if (usernamePlaceholder !== undefined) settings.usernamePlaceholder = usernamePlaceholder;
    if (passwordPlaceholder !== undefined) settings.passwordPlaceholder = passwordPlaceholder;
    if (showDevCredentials !== undefined) settings.showDevCredentials = showDevCredentials;
    if (devCredentialsTitle !== undefined) settings.devCredentialsTitle = devCredentialsTitle;
    if (roleRequirementMessage !== undefined) settings.roleRequirementMessage = roleRequirementMessage;
    if (securityWarning !== undefined) settings.securityWarning = securityWarning;
    if (loadingText !== undefined) settings.loadingText = loadingText;
    if (signingInText !== undefined) settings.signingInText = signingInText;

    settings.updatedBy = req.admin.adminId;
    
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Login settings updated successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
};

// Reset to default settings (admin only)
export const resetLoginSettings = async (req, res, next) => {
  try {
    await ShreeWebLoginSettings.deleteMany({});
    
    const defaultSettings = new ShreeWebLoginSettings({
      updatedBy: req.admin.adminId
    });
    await defaultSettings.save();

    res.status(200).json({
      success: true,
      message: 'Login settings reset to defaults successfully',
      settings: defaultSettings
    });
  } catch (error) {
    next(error);
  }
};