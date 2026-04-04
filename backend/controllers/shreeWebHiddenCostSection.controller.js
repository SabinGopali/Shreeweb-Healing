import ShreeWebHiddenCostSection from '../models/ShreeWebHiddenCostSection.model.js';
import { errorHandler } from '../utils/error.js';

const defaultPayload = {
  title: 'The Hidden cost of high performance',
  paragraph1:
    'Many successful professionals experience burnout, mental fatigue, and internal pressure despite strong strategies and discipline.',
  paragraph2:
    'When your energetic system is misaligned, even the most perfect business strategy feels heavy. True expansion requires more than just mindset shifts—it requires energetic capacity.',
  image: '/healing2.png',
  imageAlt: 'Healing and wellness imagery',
  backgroundColor: 'white',
  textColor: 'stone-800',
};

const toSectionData = (doc) => {
  if (!doc) return { ...defaultPayload };
  // Convert Mongoose doc into plain object while preserving paths
  const obj = doc.toObject();
  return {
    ...defaultPayload,
    ...obj,
    // Normalize empty fields to defaults for cleaner UI
    title: obj.title ?? defaultPayload.title,
    paragraph1: obj.paragraph1 ?? defaultPayload.paragraph1,
    paragraph2: obj.paragraph2 ?? defaultPayload.paragraph2,
    image: obj.image ?? defaultPayload.image,
    imageAlt: obj.imageAlt ?? defaultPayload.imageAlt,
    backgroundColor: obj.backgroundColor ?? defaultPayload.backgroundColor,
    textColor: obj.textColor ?? defaultPayload.textColor,
  };
};

export const getPublicHiddenCostSection = async (req, res, next) => {
  try {
    const section = await ShreeWebHiddenCostSection.findOne({ isActive: true });
    return res.status(200).json({
      success: true,
      data: toSectionData(section),
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to fetch hidden cost section data'));
  }
};

export const getHiddenCostSection = async (req, res, next) => {
  try {
    const section = await ShreeWebHiddenCostSection.findOne({ isActive: true });
    return res.status(200).json({
      success: true,
      data: toSectionData(section),
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to fetch hidden cost section data'));
  }
};

export const updateHiddenCostSection = async (req, res, next) => {
  try {
    const payload = req.body || {};

    const {
      title,
      paragraph1,
      paragraph2,
      image,
      imageAlt,
      backgroundColor,
      textColor,
    } = payload;

    let section = await ShreeWebHiddenCostSection.findOne({ isActive: true });
    if (!section) {
      section = new ShreeWebHiddenCostSection({ ...defaultPayload, isActive: true });
    }

    // Only apply fields the client provided (allows partial updates).
    if (typeof title !== 'undefined') section.title = title;
    if (typeof paragraph1 !== 'undefined') section.paragraph1 = paragraph1;
    if (typeof paragraph2 !== 'undefined') section.paragraph2 = paragraph2;
    if (typeof image !== 'undefined') section.image = image;
    if (typeof imageAlt !== 'undefined') section.imageAlt = imageAlt;
    if (typeof backgroundColor !== 'undefined') section.backgroundColor = backgroundColor;
    if (typeof textColor !== 'undefined') section.textColor = textColor;

    await section.save();

    return res.status(200).json({
      success: true,
      message: 'Hidden cost section updated successfully',
      data: section,
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to update hidden cost section'));
  }
};

