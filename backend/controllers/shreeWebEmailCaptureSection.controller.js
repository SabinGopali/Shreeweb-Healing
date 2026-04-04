import ShreeWebEmailCaptureSection from '../models/ShreeWebEmailCaptureSection.model.js';
import { errorHandler } from '../utils/error.js';

function uid() {
  return `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultPayload = {
  title: 'Stay Connected',
  description: 'Get updates when new sessions become available.',
  subtitle: 'No spam, just clarity.',
  buttonText: 'Stay Updated',
  placeholderText: 'your@email.com',
  backgroundColor: 'gradient-to-br from-stone-100 via-amber-50 to-orange-100',
  benefits: [
    {
      id: uid(),
      title: 'Early Access',
      description: 'Be the first to know about new session openings and special offerings',
      icon: 'clock',
    },
    {
      id: uid(),
      title: 'Insights & Tips',
      description: 'Receive practical guidance on energetic alignment and sustainable growth',
      icon: 'lightbulb',
    },
    {
      id: uid(),
      title: 'Curated Content',
      description: 'Thoughtfully selected resources to support your journey toward clarity',
      icon: 'heart',
    },
  ],
  bottomNote: 'Join a community focused on sustainable growth and energetic alignment',
  isActive: true,
};

const allowedBackgrounds = new Set([
  'gradient-to-br from-stone-100 via-amber-50 to-orange-100',
  'gradient-to-br from-amber-50 to-orange-100',
  'stone-100',
  'amber-50',
  'orange-50',
  'white',
]);

function toSectionData(doc) {
  if (!doc) return { ...defaultPayload };
  const obj = doc.toObject ? doc.toObject() : doc;

  const safeBenefits = Array.isArray(obj.benefits) ? obj.benefits : [];
  const normalizedBenefits = safeBenefits
    .filter((b) => b && typeof b === 'object')
    .map((b) => ({
      id: typeof b.id === 'string' && b.id.trim() ? b.id : uid(),
      title: typeof b.title === 'string' ? b.title : '',
      description: typeof b.description === 'string' ? b.description : '',
      icon: ['clock', 'lightbulb', 'heart', 'star', 'shield', 'gift'].includes(b.icon) ? b.icon : 'star',
    }));

  return {
    title: typeof obj.title === 'string' ? obj.title : defaultPayload.title,
    description: typeof obj.description === 'string' ? obj.description : defaultPayload.description,
    subtitle: typeof obj.subtitle === 'string' ? obj.subtitle : defaultPayload.subtitle,
    buttonText: typeof obj.buttonText === 'string' ? obj.buttonText : defaultPayload.buttonText,
    placeholderText:
      typeof obj.placeholderText === 'string' ? obj.placeholderText : defaultPayload.placeholderText,
    backgroundColor: allowedBackgrounds.has(obj.backgroundColor) ? obj.backgroundColor : defaultPayload.backgroundColor,
    benefits: normalizedBenefits.length ? normalizedBenefits : defaultPayload.benefits,
    bottomNote: typeof obj.bottomNote === 'string' ? obj.bottomNote : defaultPayload.bottomNote,
    isActive: obj.isActive !== undefined ? Boolean(obj.isActive) : true,
  };
}

export const getPublicEmailCaptureSection = async (req, res, next) => {
  try {
    const doc = await ShreeWebEmailCaptureSection.findOne({ isActive: true }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: toSectionData(doc) });
  } catch (error) {
    return next(errorHandler(500, 'Failed to fetch email capture section data'));
  }
};

export const getEmailCaptureSection = async (req, res, next) => {
  try {
    const doc = await ShreeWebEmailCaptureSection.findOne({ isActive: true }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: toSectionData(doc) });
  } catch (error) {
    return next(errorHandler(500, 'Failed to fetch email capture section data'));
  }
};

export const updateEmailCaptureSection = async (req, res, next) => {
  try {
    const updates = req.body && typeof req.body === 'object' ? req.body : {};

    const allowedKeys = [
      'title',
      'description',
      'subtitle',
      'buttonText',
      'placeholderText',
      'backgroundColor',
      'benefits',
      'bottomNote',
      'isActive',
    ];

    const patch = {};
    for (const key of allowedKeys) {
      if (updates[key] !== undefined) patch[key] = updates[key];
    }

    if (patch.benefits !== undefined && !Array.isArray(patch.benefits)) {
      return next(errorHandler(400, 'benefits must be an array'));
    }

    if (patch.backgroundColor !== undefined && !allowedBackgrounds.has(patch.backgroundColor)) {
      return next(errorHandler(400, 'Invalid backgroundColor value'));
    }

    const existing = await ShreeWebEmailCaptureSection.findOne({ isActive: true }).sort({ updatedAt: -1 });
    const merged = toSectionData({ ...(existing ? existing.toObject() : defaultPayload), ...patch });

    let doc;
    if (existing) {
      existing.title = merged.title;
      existing.description = merged.description;
      existing.subtitle = merged.subtitle;
      existing.buttonText = merged.buttonText;
      existing.placeholderText = merged.placeholderText;
      existing.backgroundColor = merged.backgroundColor;
      existing.benefits = merged.benefits;
      existing.bottomNote = merged.bottomNote;
      existing.isActive = merged.isActive;
      doc = await existing.save();
    } else {
      doc = await ShreeWebEmailCaptureSection.create(merged);
    }

    if (doc.isActive) {
      await ShreeWebEmailCaptureSection.updateMany({ _id: { $ne: doc._id } }, { $set: { isActive: false } });
    }

    return res.status(200).json({
      success: true,
      message: 'Email capture section updated successfully',
      data: toSectionData(doc),
    });
  } catch (error) {
    return next(errorHandler(500, 'Failed to update email capture section'));
  }
};

