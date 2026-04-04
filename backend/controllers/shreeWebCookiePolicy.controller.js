import ShreeWebCookiePolicy from '../models/ShreeWebCookiePolicy.model.js';

// Get cookie policy data
const getCookiePolicyData = async (req, res) => {
  try {
    let cookiePolicy = await ShreeWebCookiePolicy.findOne();
    
    if (!cookiePolicy) {
      // Create default cookie policy data if none exists
      cookiePolicy = new ShreeWebCookiePolicy({});
      await cookiePolicy.save();
    }

    res.json({
      success: true,
      data: cookiePolicy
    });
  } catch (error) {
    console.error('Error fetching cookie policy data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cookie policy data',
      error: error.message
    });
  }
};

// Update specific section
const updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const updates = req.body;

    let cookiePolicy = await ShreeWebCookiePolicy.findOne();
    
    if (!cookiePolicy) {
      cookiePolicy = new ShreeWebCookiePolicy({});
    }

    // Update the specific section
    if (cookiePolicy[section] !== undefined) {
      if (typeof cookiePolicy[section] === 'object' && cookiePolicy[section] !== null) {
        cookiePolicy[section] = { ...cookiePolicy[section].toObject(), ...updates };
      } else {
        cookiePolicy[section] = updates;
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Invalid section: ${section}`
      });
    }

    await cookiePolicy.save();

    res.json({
      success: true,
      message: `${section} section updated successfully`,
      data: cookiePolicy
    });
  } catch (error) {
    console.error('Error updating cookie policy section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cookie policy section',
      error: error.message
    });
  }
};

// Update last updated date
const updateLastUpdated = async (req, res) => {
  try {
    const { lastUpdatedDate } = req.body;

    let cookiePolicy = await ShreeWebCookiePolicy.findOne();
    
    if (!cookiePolicy) {
      cookiePolicy = new ShreeWebCookiePolicy({});
    }

    cookiePolicy.lastUpdatedDate = lastUpdatedDate;
    await cookiePolicy.save();

    res.json({
      success: true,
      message: 'Last updated date updated successfully',
      data: cookiePolicy
    });
  } catch (error) {
    console.error('Error updating last updated date:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update last updated date',
      error: error.message
    });
  }
};

// Update cookie type
const updateCookieType = async (req, res) => {
  try {
    const { type } = req.params; // essential, functional, analytics
    const updates = req.body;

    let cookiePolicy = await ShreeWebCookiePolicy.findOne();
    
    if (!cookiePolicy) {
      cookiePolicy = new ShreeWebCookiePolicy({});
    }

    if (!cookiePolicy.cookieTypesWeUse[type]) {
      return res.status(400).json({
        success: false,
        message: `Invalid cookie type: ${type}`
      });
    }

    cookiePolicy.cookieTypesWeUse[type] = { ...cookiePolicy.cookieTypesWeUse[type].toObject(), ...updates };
    await cookiePolicy.save();

    res.json({
      success: true,
      message: `${type} cookie type updated successfully`,
      data: cookiePolicy
    });
  } catch (error) {
    console.error('Error updating cookie type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cookie type',
      error: error.message
    });
  }
};

// Update browser instructions
const updateBrowserInstructions = async (req, res) => {
  try {
    const { browserInstructions } = req.body;

    let cookiePolicy = await ShreeWebCookiePolicy.findOne();
    
    if (!cookiePolicy) {
      cookiePolicy = new ShreeWebCookiePolicy({});
    }

    cookiePolicy.managingPreferences.browserInstructions = browserInstructions;
    await cookiePolicy.save();

    res.json({
      success: true,
      message: 'Browser instructions updated successfully',
      data: cookiePolicy
    });
  } catch (error) {
    console.error('Error updating browser instructions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update browser instructions',
      error: error.message
    });
  }
};

// Get public cookie policy data (for frontend)
const getPublicCookiePolicyData = async (req, res) => {
  try {
    let cookiePolicy = await ShreeWebCookiePolicy.findOne();
    
    if (!cookiePolicy) {
      // Create default cookie policy data if none exists
      cookiePolicy = new ShreeWebCookiePolicy({});
      await cookiePolicy.save();
    }

    // Return data without timestamps and MongoDB metadata
    const publicData = {
      hero: cookiePolicy.hero,
      lastUpdatedDate: cookiePolicy.lastUpdatedDate,
      understandingCookies: cookiePolicy.understandingCookies,
      cookieTypesWeUse: cookiePolicy.cookieTypesWeUse,
      managingPreferences: cookiePolicy.managingPreferences,
      contactSection: cookiePolicy.contactSection
    };

    res.json({
      success: true,
      data: publicData
    });
  } catch (error) {
    console.error('Error fetching public cookie policy data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cookie policy data',
      error: error.message
    });
  }
};

export {
  getCookiePolicyData,
  updateSection,
  updateLastUpdated,
  updateCookieType,
  updateBrowserInstructions,
  getPublicCookiePolicyData
};