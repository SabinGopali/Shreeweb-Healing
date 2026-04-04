import ShreeWebProcessSection from '../models/ShreeWebProcessSection.model.js';
import { errorHandler } from '../utils/error.js';

const defaultPayload = {
  title: 'Energetic Alignment for <em className="italic text-stone-600">Sustainable Expansion</em>',
  description:
    'Sessions work deeply with your energetic system to cleanse, balance, and strengthen internal stability, allowing you to hold more success with less resistance.',
  steps: [
    {
      id: 'p1',
      title: 'Scanning',
      description:
        'Identifying energetic leaks and blockages in your field that are creating friction in your daily life.',
      icon: 'circle',
    },
    {
      id: 'p2',
      title: 'Cleansing',
      description:
        'Releasing stagnant energy and external pressures that no longer serve your highest vision.',
      icon: 'filled-circle',
    },
    {
      id: 'p3',
      title: 'Balancing',
      description:
        'Restoring harmony to your chakras, anchoring you back into a state of grounded power.',
      icon: 'grid',
    },
  ],
};

const toSectionData = (doc) => {
  if (!doc) return { ...defaultPayload };
  const obj = doc.toObject();
  return {
    ...defaultPayload,
    ...obj,
    title: obj.title ?? defaultPayload.title,
    description: obj.description ?? defaultPayload.description,
    steps: Array.isArray(obj.steps) && obj.steps.length ? obj.steps : defaultPayload.steps,
  };
};

export const getPublicProcessSection = async (req, res, next) => {
  try {
    const section = await ShreeWebProcessSection.findOne({ isActive: true });
    return res.status(200).json({ success: true, data: toSectionData(section) });
  } catch (error) {
    next(errorHandler(500, 'Failed to fetch process section data'));
  }
};

export const getProcessSection = async (req, res, next) => {
  try {
    const section = await ShreeWebProcessSection.findOne({ isActive: true });
    return res.status(200).json({ success: true, data: toSectionData(section) });
  } catch (error) {
    next(errorHandler(500, 'Failed to fetch process section data'));
  }
};

export const updateProcessSection = async (req, res, next) => {
  try {
    const payload = req.body || {};

    let section = await ShreeWebProcessSection.findOne({ isActive: true });
    if (!section) {
      section = new ShreeWebProcessSection({ ...defaultPayload, isActive: true });
    }

    if (typeof payload.title !== 'undefined') section.title = payload.title;
    if (typeof payload.description !== 'undefined') section.description = payload.description;
    if (typeof payload.steps !== 'undefined') {
      if (!Array.isArray(payload.steps)) {
        return next(errorHandler(400, '`steps` must be an array'));
      }
      section.steps = payload.steps;
    }

    await section.save();

    return res.status(200).json({
      success: true,
      message: 'Process section updated successfully',
      data: section,
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to update process section'));
  }
};

