import ShreeWebTestimonialsEnhanced from '../models/ShreeWebTestimonialsEnhanced.model.js';
import { errorHandler } from '../utils/error.js';

function uid() {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultSettings = {
  sectionTitle: 'What People Are Saying',
  sectionDescription: 'A few words from people who chose alignment for sustainable growth.',
  initialVisible: 3,
  loadMoreText: 'Load More Stories',
  backgroundColor: '#EDE7DC',
};

function normalizeSection(doc) {
  if (!doc) {
    return {
      settings: { ...defaultSettings },
      testimonials: [],
    };
  }

  const obj = doc.toObject ? doc.toObject() : doc;
  const settings = { ...defaultSettings, ...(obj.settings || {}) };

  const testimonials = Array.isArray(obj.testimonials) ? obj.testimonials : [];
  const normalizedTestimonials = testimonials
    .filter((t) => t && typeof t === 'object')
    .map((t) => ({
      id: typeof t.id === 'string' && t.id.trim() ? t.id : uid(),
      name: typeof t.name === 'string' ? t.name : '',
      role: typeof t.role === 'string' ? t.role : '',
      quote: typeof t.quote === 'string' ? t.quote : '',
      rating: Number.isFinite(Number(t.rating)) ? Math.max(1, Math.min(5, Number(t.rating))) : 5,
      order: Number.isFinite(Number(t.order)) ? Number(t.order) : 0,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return { settings, testimonials: normalizedTestimonials };
}

export const getPublicTestimonialsEnhanced = async (req, res, next) => {
  try {
    const section = await ShreeWebTestimonialsEnhanced.findOne({ isActive: true }).sort({ updatedAt: -1 });
    const normalized = normalizeSection(section);
    return res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    return next(errorHandler(500, 'Failed to fetch testimonials enhanced section data'));
  }
};

export const getTestimonialsEnhanced = async (req, res, next) => {
  try {
    const section = await ShreeWebTestimonialsEnhanced.findOne({ isActive: true }).sort({ updatedAt: -1 });
    const normalized = normalizeSection(section);
    return res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    return next(errorHandler(500, 'Failed to fetch testimonials enhanced section data'));
  }
};

export const updateTestimonialsEnhancedSettings = async (req, res, next) => {
  try {
    const payload = req.body && typeof req.body === 'object' ? req.body : {};
    const updates = payload.settings && typeof payload.settings === 'object' ? payload.settings : {};

    const section = await ShreeWebTestimonialsEnhanced.findOne({ isActive: true });
    const doc =
      section ||
      (await ShreeWebTestimonialsEnhanced.create({
        settings: { ...defaultSettings },
        testimonials: [],
        isActive: true,
      }));

    if (updates.sectionTitle !== undefined) doc.settings.sectionTitle = String(updates.sectionTitle);
    if (updates.sectionDescription !== undefined) doc.settings.sectionDescription = String(updates.sectionDescription);

    if (updates.initialVisible !== undefined) {
      const n = Number(updates.initialVisible);
      doc.settings.initialVisible = Number.isFinite(n) ? Math.max(1, Math.min(20, n)) : doc.settings.initialVisible;
    }

    if (updates.loadMoreText !== undefined) doc.settings.loadMoreText = String(updates.loadMoreText);
    if (updates.backgroundColor !== undefined) doc.settings.backgroundColor = String(updates.backgroundColor);

    await doc.save();

    if (doc.isActive) {
      await ShreeWebTestimonialsEnhanced.updateMany({ _id: { $ne: doc._id } }, { $set: { isActive: false } });
    }

    return res.status(200).json({ success: true, data: normalizeSection(doc) });
  } catch (error) {
    return next(errorHandler(500, 'Failed to update testimonials enhanced settings'));
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const payload = req.body && typeof req.body === 'object' ? req.body : {};

    const quote = typeof payload.quote === 'string' ? payload.quote : '';
    if (!quote || quote.trim() === '' || quote === '<p></p>') {
      return next(errorHandler(400, '`quote` is required'));
    }

    const rating = payload.rating !== undefined ? Number(payload.rating) : 5;
    const safeRating = Number.isFinite(rating) ? Math.max(1, Math.min(5, rating)) : 5;

    const existing = await ShreeWebTestimonialsEnhanced.findOne({ isActive: true });
    const doc =
      existing ||
      (await ShreeWebTestimonialsEnhanced.create({
        settings: { ...defaultSettings },
        testimonials: [],
        isActive: true,
      }));

    const currentOrders = Array.isArray(doc.testimonials) ? doc.testimonials.map((t) => Number(t.order) || 0) : [];
    const nextOrder = currentOrders.length ? Math.max(...currentOrders) + 1 : 0;

    const testimonial = {
      id: uid(),
      name: typeof payload.name === 'string' ? payload.name : '',
      role: typeof payload.role === 'string' ? payload.role : '',
      quote,
      rating: safeRating,
      order: nextOrder,
    };

    doc.testimonials = Array.isArray(doc.testimonials) ? [...doc.testimonials, testimonial] : [testimonial];
    await doc.save();

    return res.status(201).json({
      success: true,
      data: normalizeSection(doc),
      testimonial,
    });
  } catch (error) {
    return next(errorHandler(500, 'Failed to create testimonial'));
  }
};

export const getTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const section = await ShreeWebTestimonialsEnhanced.findOne({ isActive: true });
    if (!section) return next(errorHandler(404, 'Testimonials section not found'));

    const t = (section.testimonials || []).find((x) => x && x.id === id);
    if (!t) return next(errorHandler(404, 'Testimonial not found'));

    return res.status(200).json({ success: true, data: normalizeSection(section), testimonial: t });
  } catch (error) {
    return next(errorHandler(500, 'Failed to fetch testimonial'));
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body && typeof req.body === 'object' ? req.body : {};

    const section = await ShreeWebTestimonialsEnhanced.findOne({ isActive: true });
    if (!section) return next(errorHandler(404, 'Testimonials section not found'));

    const idx = (section.testimonials || []).findIndex((x) => x && x.id === id);
    if (idx === -1) return next(errorHandler(404, 'Testimonial not found'));

    const quote = payload.quote !== undefined ? String(payload.quote) : undefined;
    if (quote !== undefined) {
      if (!quote || quote.trim() === '' || quote === '<p></p>') {
        return next(errorHandler(400, '`quote` cannot be empty'));
      }
    }

    if (payload.name !== undefined) section.testimonials[idx].name = String(payload.name);
    if (payload.role !== undefined) section.testimonials[idx].role = String(payload.role);
    if (payload.quote !== undefined) section.testimonials[idx].quote = quote;
    if (payload.rating !== undefined) {
      const r = Number(payload.rating);
      section.testimonials[idx].rating = Number.isFinite(r) ? Math.max(1, Math.min(5, r)) : section.testimonials[idx].rating;
    }
    if (payload.order !== undefined) {
      const o = Number(payload.order);
      section.testimonials[idx].order = Number.isFinite(o) ? o : section.testimonials[idx].order;
    }

    await section.save();

    return res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: normalizeSection(section),
      testimonial: section.testimonials[idx],
    });
  } catch (error) {
    return next(errorHandler(500, 'Failed to update testimonial'));
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const section = await ShreeWebTestimonialsEnhanced.findOne({ isActive: true });
    if (!section) return next(errorHandler(404, 'Testimonials section not found'));

    const before = (section.testimonials || []).length;
    section.testimonials = (section.testimonials || []).filter((x) => x && x.id !== id);
    const after = section.testimonials.length;

    if (after === before) return next(errorHandler(404, 'Testimonial not found'));

    // Re-normalize order to keep it tidy
    section.testimonials = section.testimonials
      .map((t, i) => ({ ...t, order: i }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    await section.save();

    return res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
      data: normalizeSection(section),
    });
  } catch (error) {
    return next(errorHandler(500, 'Failed to delete testimonial'));
  }
};

