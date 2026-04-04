import ShreeWebGrowthSection from '../models/ShreeWebGrowthSection.model.js';
import { errorHandler } from '../utils/error.js';

const defaultPayload = {
  title: 'When growth begins to feel',
  subtitle: 'heavier than it should',
  introduction:
    'Many entrepreneurs and high-performing professionals reach a stage where <span className="text-stone-800 font-normal"> effort alone stops creating the results they expect.</span>',
  description1:
    'Often, these challenges are connected not only to mindset or strategy, but also to <span className="text-stone-700 font-medium"> imbalances within the energetic system.</span>',
  description2:
    'When the energy body carries accumulated stress or blockages, it can affect emotional balance, decision making, resilience, and the ability to sustain growth.',
  signsTitle: 'Signs you may recognize',
  ctaText: 'If these resonate with you, energetic alignment may be the missing piece.',
  ctaButtonText: 'Explore a Discovery Call',
  backgroundImage: '/healing.webp',
  overlayOpacity: 70,
  signs: [
    { id: 'g1', text: 'Persistent mental fatigue causing difficulty in decision making', featured: false },
    { id: 'g2', text: 'Difficulty maintaining focus or clarity', featured: false },
    { id: 'g3', text: 'Recurring stress or burnout cycles', featured: false },
    { id: 'g4', text: 'Internal resistance when stepping into larger opportunities', featured: false },
    { id: 'g5', text: 'The feeling that something deeper needs to shift', featured: true },
  ],
};

const toSectionData = (doc) => {
  if (!doc) return { ...defaultPayload };
  const obj = doc.toObject();
  return {
    ...defaultPayload,
    ...obj,
    title: obj.title ?? defaultPayload.title,
    subtitle: obj.subtitle ?? defaultPayload.subtitle,
    introduction: obj.introduction ?? defaultPayload.introduction,
    description1: obj.description1 ?? defaultPayload.description1,
    description2: obj.description2 ?? defaultPayload.description2,
    signsTitle: obj.signsTitle ?? defaultPayload.signsTitle,
    ctaText: obj.ctaText ?? defaultPayload.ctaText,
    ctaButtonText: obj.ctaButtonText ?? defaultPayload.ctaButtonText,
    backgroundImage: obj.backgroundImage ?? defaultPayload.backgroundImage,
    overlayOpacity:
      typeof obj.overlayOpacity === 'number' ? obj.overlayOpacity : defaultPayload.overlayOpacity,
    signs: Array.isArray(obj.signs) && obj.signs.length ? obj.signs : defaultPayload.signs,
  };
};

export const getPublicGrowthSection = async (req, res, next) => {
  try {
    const section = await ShreeWebGrowthSection.findOne({ isActive: true });
    return res.status(200).json({ success: true, data: toSectionData(section) });
  } catch (error) {
    next(errorHandler(500, 'Failed to fetch growth section data'));
  }
};

export const getGrowthSection = async (req, res, next) => {
  try {
    const section = await ShreeWebGrowthSection.findOne({ isActive: true });
    return res.status(200).json({ success: true, data: toSectionData(section) });
  } catch (error) {
    next(errorHandler(500, 'Failed to fetch growth section data'));
  }
};

export const updateGrowthSection = async (req, res, next) => {
  try {
    const payload = req.body || {};

    let section = await ShreeWebGrowthSection.findOne({ isActive: true });
    if (!section) {
      section = new ShreeWebGrowthSection({ ...defaultPayload, isActive: true });
    }

    const fields = [
      'title',
      'subtitle',
      'introduction',
      'description1',
      'description2',
      'signsTitle',
      'ctaText',
      'ctaButtonText',
      'backgroundImage',
      'overlayOpacity',
      'signs',
    ];

    fields.forEach((key) => {
      if (typeof payload[key] !== 'undefined') section[key] = payload[key];
    });

    // Basic validation: ensure signs is an array if provided
    if (typeof payload.signs !== 'undefined' && !Array.isArray(payload.signs)) {
      return next(errorHandler(400, '`signs` must be an array'));
    }

    await section.save();

    return res.status(200).json({
      success: true,
      message: 'Growth section updated successfully',
      data: section,
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to update growth section'));
  }
};

