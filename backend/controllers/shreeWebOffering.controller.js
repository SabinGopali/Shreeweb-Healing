import ShreeWebOffering from '../models/ShreeWebOffering.model.js';
import ShreeWebOfferingsSettings from '../models/ShreeWebOfferingsSettings.model.js';
import { errorHandler } from '../utils/error.js';

const defaultOfferingsSettings = {
  section: {
    sectionTitle: 'Curated Offerings',
    sectionDescription: 'Select the container that aligns with your current capacity and desired expansion.',
    backgroundColor: '#F4EFE6',
    cardBackground: '#EDE7DC',
  },
  additionalPrograms: {
    enabled: true,
    title: 'Looking for deeper transformation?',
    programs: [
      { name: 'Realignment Program', sessions: '8 Sessions' },
      { name: 'Transformation Program', sessions: '12 Sessions' },
    ],
  },
};

async function getActiveOfferingsSettingsDoc() {
  return ShreeWebOfferingsSettings.findOne({ isActive: true }).sort({ updatedAt: -1 });
}

function normalizeSettingsDoc(doc) {
  if (!doc) return defaultOfferingsSettings;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    section: { ...defaultOfferingsSettings.section, ...(obj.section || {}) },
    additionalPrograms: {
      ...defaultOfferingsSettings.additionalPrograms,
      ...(obj.additionalPrograms || {}),
      programs: Array.isArray(obj.additionalPrograms?.programs)
        ? obj.additionalPrograms.programs.map((p) => ({
            name: typeof p?.name === 'string' ? p.name : '',
            sessions: typeof p?.sessions === 'string' ? p.sessions : '',
          }))
        : defaultOfferingsSettings.additionalPrograms.programs,
    },
  };
}

// Get all offerings (public endpoint)
export const getPublicOfferings = async (req, res, next) => {
  try {
    const offerings = await ShreeWebOffering.find({ isActive: true })
      .sort({ category: 1, order: 1, createdAt: 1 })
      .select('-createdBy -updatedBy');

    // Group by category
    const groupedOfferings = {
      introductory: offerings.filter(o => o.category === 'introductory'),
      single: offerings.filter(o => o.category === 'single'),
      recurring: offerings.filter(o => o.category === 'recurring'),
      program: offerings.filter(o => o.category === 'program')
    };

    res.status(200).json({
      success: true,
      offerings: groupedOfferings,
      total: offerings.length
    });
  } catch (error) {
    next(error);
  }
};

// Get all offerings (admin endpoint)
export const getAllOfferings = async (req, res, next) => {
  try {
    const offerings = await ShreeWebOffering.find()
      .sort({ category: 1, order: 1, createdAt: 1 })
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    res.status(200).json({
      success: true,
      offerings,
      total: offerings.length
    });
  } catch (error) {
    next(error);
  }
};

// Get single offering by ID
export const getOfferingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const offering = await ShreeWebOffering.findById(id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!offering) {
      return next(errorHandler(404, 'Offering not found'));
    }

    res.status(200).json({
      success: true,
      offering
    });
  } catch (error) {
    next(error);
  }
};

// Create new offering
export const createOffering = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      duration,
      description,
      price,
      category,
      featured,
      order,
      isActive,
      image,
      features
    } = req.body;

    // Validate required fields
    if (!title || !duration || !description || !price || !category) {
      return next(errorHandler(400, 'Title, duration, description, price, and category are required'));
    }

    // Validate category
    const validCategories = ['introductory', 'single', 'recurring', 'program'];
    if (!validCategories.includes(category)) {
      return next(errorHandler(400, 'Invalid category'));
    }

    const offering = new ShreeWebOffering({
      title: title.trim(),
      subtitle: subtitle?.trim() || '',
      duration: duration.trim(),
      description: description.trim(),
      price: price.trim(),
      category,
      featured: featured || false,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      image: image || '',
      features: Array.isArray(features) ? features.filter(f => f.trim()).map(f => f.trim()) : [],
      createdBy: req.admin.adminId,
      updatedBy: req.admin.adminId
    });

    await offering.save();

    // Populate the response
    await offering.populate('createdBy', 'username email');
    await offering.populate('updatedBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Offering created successfully',
      offering
    });
  } catch (error) {
    next(error);
  }
};

// Update offering
export const updateOffering = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      duration,
      description,
      price,
      category,
      featured,
      order,
      isActive,
      image,
      features
    } = req.body;

    const offering = await ShreeWebOffering.findById(id);
    if (!offering) {
      return next(errorHandler(404, 'Offering not found'));
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['introductory', 'single', 'recurring', 'program'];
      if (!validCategories.includes(category)) {
        return next(errorHandler(400, 'Invalid category'));
      }
    }

    // Update fields
    if (title !== undefined) offering.title = title.trim();
    if (subtitle !== undefined) offering.subtitle = subtitle.trim();
    if (duration !== undefined) offering.duration = duration.trim();
    if (description !== undefined) offering.description = description.trim();
    if (price !== undefined) offering.price = price.trim();
    if (category !== undefined) offering.category = category;
    if (featured !== undefined) offering.featured = featured;
    if (order !== undefined) offering.order = order;
    if (isActive !== undefined) offering.isActive = isActive;
    if (image !== undefined) offering.image = image;
    if (features !== undefined) {
      offering.features = Array.isArray(features) ? features.filter(f => f.trim()).map(f => f.trim()) : [];
    }
    
    offering.updatedBy = req.admin.adminId;

    await offering.save();

    // Populate the response
    await offering.populate('createdBy', 'username email');
    await offering.populate('updatedBy', 'username email');

    res.status(200).json({
      success: true,
      message: 'Offering updated successfully',
      offering
    });
  } catch (error) {
    next(error);
  }
};

// Delete offering
export const deleteOffering = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offering = await ShreeWebOffering.findById(id);
    if (!offering) {
      return next(errorHandler(404, 'Offering not found'));
    }

    await offering.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Offering deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Toggle offering status
export const toggleOfferingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offering = await ShreeWebOffering.findById(id);
    if (!offering) {
      return next(errorHandler(404, 'Offering not found'));
    }

    offering.isActive = !offering.isActive;
    offering.updatedBy = req.admin.adminId;
    await offering.save();

    res.status(200).json({
      success: true,
      message: `Offering ${offering.isActive ? 'activated' : 'deactivated'} successfully`,
      offering: {
        _id: offering._id,
        title: offering.title,
        isActive: offering.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// Reorder offerings
export const reorderOfferings = async (req, res, next) => {
  try {
    const { offerings } = req.body;

    if (!Array.isArray(offerings)) {
      return next(errorHandler(400, 'Offerings must be an array'));
    }

    // Update order for each offering
    const updatePromises = offerings.map((item, index) => {
      return ShreeWebOffering.findByIdAndUpdate(
        item.id,
        { 
          order: index,
          updatedBy: req.admin.adminId
        },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Offerings reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get offerings settings
export const getOfferingsSettings = async (req, res, next) => {
  try {
    const doc = await getActiveOfferingsSettingsDoc();
    res.status(200).json({
      success: true,
      settings: normalizeSettingsDoc(doc),
    });
  } catch (error) {
    next(error);
  }
};

// Save offerings settings
export const saveOfferingsSettings = async (req, res, next) => {
  try {
    const { section, additionalPrograms } = req.body;

    const existing = await getActiveOfferingsSettingsDoc();
    const doc =
      existing ||
      (await ShreeWebOfferingsSettings.create({
        ...defaultOfferingsSettings,
        section: defaultOfferingsSettings.section,
        additionalPrograms: defaultOfferingsSettings.additionalPrograms,
        isActive: true,
      }));

    if (section && typeof section === 'object') {
      doc.section = { ...doc.section.toObject?.() || doc.section, ...section };
    }

    if (additionalPrograms && typeof additionalPrograms === 'object') {
      const ap = { ...(doc.additionalPrograms?.toObject?.() || doc.additionalPrograms), ...additionalPrograms };
      if (Array.isArray(ap.programs)) {
        ap.programs = ap.programs.map((p) => ({
          name: typeof p?.name === 'string' ? p.name : '',
          sessions: typeof p?.sessions === 'string' ? p.sessions : '',
        }));
      }
      doc.additionalPrograms = ap;
    }

    await doc.save();

    if (doc.isActive) {
      await ShreeWebOfferingsSettings.updateMany({ _id: { $ne: doc._id } }, { $set: { isActive: false } });
    }

    const normalized = normalizeSettingsDoc(doc);

    res.status(200).json({
      success: true,
      message: 'Settings saved successfully',
      settings: normalized,
    });
  } catch (error) {
    next(error);
  }
};

// Get public offerings with settings (for frontend display)
export const getPublicOfferingsWithSettings = async (req, res, next) => {
  try {
    const offerings = await ShreeWebOffering.find({ isActive: true })
      .sort({ category: 1, order: 1, createdAt: 1 })
      .select('-createdBy -updatedBy');

    // Group by category
    const groupedOfferings = {
      introductory: offerings.filter(o => o.category === 'introductory'),
      single: offerings.filter(o => o.category === 'single'),
      recurring: offerings.filter(o => o.category === 'recurring'),
      program: offerings.filter(o => o.category === 'program')
    };

    const doc = await getActiveOfferingsSettingsDoc();
    const normalizedSettings = normalizeSettingsDoc(doc);

    res.status(200).json({
      success: true,
      offerings: groupedOfferings,
      settings: normalizedSettings,
      total: offerings.length
    });
  } catch (error) {
    next(error);
  }
};