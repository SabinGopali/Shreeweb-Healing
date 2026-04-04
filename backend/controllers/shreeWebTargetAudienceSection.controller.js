import ShreeWebTargetAudienceSection from '../models/ShreeWebTargetAudienceSection.model.js';
import { errorHandler } from '../utils/error.js';

function uid() {
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultPayload = {
  title: 'This work is designed for',
  subtitle: 'Individuals ready to address the energetic foundations of sustainable success',
  ctaQuote: "Ready to explore what's possible when your energy and ambition are aligned?",
  ctaText: 'Start with a Discovery Call',
  audiences: [
    {
      id: uid(),
      title: 'Entrepreneurs & Business Owners',
      description: 'Leaders seeking to maintain high performance without sacrificing well-being',
      colorScheme: 'stone',
      featured: false,
    },
    {
      id: uid(),
      title: 'Ambitious Professionals',
      description: 'High-achievers experiencing stress, burnout, or feeling stuck despite their efforts',
      colorScheme: 'amber',
      featured: false,
    },
    {
      id: uid(),
      title: 'Growth & Transition Navigators',
      description: 'Individuals moving through periods of expansion or life transition',
      colorScheme: 'stone',
      featured: false,
    },
    {
      id: uid(),
      title: 'Energetic Alignment Seekers',
      description: 'People interested in deeper energetic work and holistic approaches to success',
      colorScheme: 'orange',
      featured: false,
    },
    {
      id: uid(),
      title: 'Clarity & Balance Seekers',
      description: 'People seeking greater clarity, stability, and internal balance to support their highest vision',
      colorScheme: 'amber',
      featured: true,
    },
  ],
  isActive: true,
};

function toSectionData(doc) {
  if (!doc) return { ...defaultPayload };

  const safeAudiences = Array.isArray(doc.audiences) ? doc.audiences : [];
  const normalizedAudiences = safeAudiences
    .filter((a) => a && typeof a === 'object')
    .map((a) => ({
      id: typeof a.id === 'string' && a.id.trim() ? a.id : uid(),
      title: typeof a.title === 'string' ? a.title : '',
      description: typeof a.description === 'string' ? a.description : '',
      colorScheme: ['stone', 'amber', 'orange'].includes(a.colorScheme) ? a.colorScheme : 'stone',
      featured: Boolean(a.featured),
    }));

  return {
    title: typeof doc.title === 'string' ? doc.title : defaultPayload.title,
    subtitle: typeof doc.subtitle === 'string' ? doc.subtitle : defaultPayload.subtitle,
    ctaQuote: typeof doc.ctaQuote === 'string' ? doc.ctaQuote : defaultPayload.ctaQuote,
    ctaText: typeof doc.ctaText === 'string' ? doc.ctaText : defaultPayload.ctaText,
    audiences: normalizedAudiences.length ? normalizedAudiences : defaultPayload.audiences,
    isActive: doc.isActive !== undefined ? Boolean(doc.isActive) : true,
  };
}

export const getPublicTargetAudienceSection = async (req, res, next) => {
  try {
    const doc = await ShreeWebTargetAudienceSection.findOne({ isActive: true }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: toSectionData(doc) });
  } catch (error) {
    return next(errorHandler(500, 'Failed to fetch target audience section data'));
  }
};

export const getTargetAudienceSection = async (req, res, next) => {
  try {
    const doc = await ShreeWebTargetAudienceSection.findOne({ isActive: true }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: toSectionData(doc) });
  } catch (error) {
    return next(errorHandler(500, 'Failed to fetch target audience section data'));
  }
};

export const updateTargetAudienceSection = async (req, res, next) => {
  try {
    const updates = req.body && typeof req.body === 'object' ? req.body : {};

    const allowed = ['title', 'subtitle', 'ctaQuote', 'ctaText', 'audiences', 'isActive'];
    const patch = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) patch[key] = updates[key];
    }

    if (patch.audiences !== undefined && !Array.isArray(patch.audiences)) {
      return next(errorHandler(400, 'audiences must be an array'));
    }

    const existing = await ShreeWebTargetAudienceSection.findOne({ isActive: true }).sort({ updatedAt: -1 });

    const merged = toSectionData({ ...(existing ? existing.toObject() : defaultPayload), ...patch });

    let doc;
    if (existing) {
      existing.title = merged.title;
      existing.subtitle = merged.subtitle;
      existing.ctaQuote = merged.ctaQuote;
      existing.ctaText = merged.ctaText;
      existing.audiences = merged.audiences;
      existing.isActive = merged.isActive;
      doc = await existing.save();
    } else {
      doc = await ShreeWebTargetAudienceSection.create(merged);
    }

    if (doc.isActive) {
      await ShreeWebTargetAudienceSection.updateMany({ _id: { $ne: doc._id } }, { $set: { isActive: false } });
    }

    return res.status(200).json({
      success: true,
      message: 'Target audience section updated successfully',
      data: toSectionData(doc),
    });
  } catch (error) {
    return next(errorHandler(500, 'Failed to update target audience section'));
  }
};

