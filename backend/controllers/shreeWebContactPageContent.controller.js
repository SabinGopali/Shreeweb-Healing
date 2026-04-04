import ShreeWebContactPageContent from '../models/ShreeWebContactPageContent.model.js';

const pickSafeToObject = (doc) => {
  const obj = doc?.toObject ? doc.toObject() : doc;
  return obj;
};

export const getPublicContactPageContent = async (req, res, next) => {
  try {
    let content = await ShreeWebContactPageContent.findOne().sort({ createdAt: 1 });

    if (!content) {
      content = new ShreeWebContactPageContent({});
      await content.save();
    }

    return res.status(200).json({
      success: true,
      contactPageContent: pickSafeToObject(content),
    });
  } catch (error) {
    next(error);
  }
};

export const getContactPageContent = async (req, res, next) => {
  try {
    let content = await ShreeWebContactPageContent.findOne().sort({ createdAt: 1 });

    if (!content) {
      content = new ShreeWebContactPageContent({});
      await content.save();
    }

    return res.status(200).json({
      success: true,
      contactPageContent: pickSafeToObject(content),
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactPageContent = async (req, res, next) => {
  try {
    const {
      isActive,
      logo,
      hero,
      form,
      connect,
      location,
      contactInfo,
      follow,
      callToAction,
    } = req.body || {};

    let content = await ShreeWebContactPageContent.findOne().sort({ createdAt: 1 });
    if (!content) {
      content = new ShreeWebContactPageContent({});
    }

    if (typeof isActive === 'boolean') content.isActive = isActive;
    if (logo) content.logo = logo;
    if (hero) content.hero = hero;
    if (form) content.form = form;
    if (connect) content.connect = connect;
    if (location) content.location = location;
    if (contactInfo) content.contactInfo = contactInfo;
    if (follow) content.follow = follow;
    if (callToAction) content.callToAction = callToAction;

    await content.save();

    return res.status(200).json({
      success: true,
      message: 'Contact page content updated successfully',
      contactPageContent: pickSafeToObject(content),
    });
  } catch (error) {
    next(error);
  }
};

