import EmailCapture from '../models/EmailCapture.model.js';
import { errorHandler } from '../utils/error.js';

// Public endpoint - capture email
export const captureEmail = async (req, res, next) => {
  try {
    const { email, name, source, context, tags } = req.body;

    if (!email || typeof email !== 'string') {
      return next(errorHandler(400, 'Email is required'));
    }

    const emailLower = email.trim().toLowerCase();
    
    // Basic email validation
    if (!/^\S+@\S+\.\S+$/.test(emailLower)) {
      return next(errorHandler(400, 'Invalid email format'));
    }

    // Check if email already exists
    const existing = await EmailCapture.findOne({ email: emailLower });
    
    if (existing) {
      // Update existing entry
      if (name && !existing.name) existing.name = name;
      if (source) existing.source = source;
      if (context) {
        existing.metadata = {
          ...existing.metadata,
          lastContext: context,
          contexts: [...(existing.metadata?.contexts || []), context]
        };
      }
      if (tags && Array.isArray(tags)) {
        existing.tags = [...new Set([...existing.tags, ...tags])];
      }
      
      await existing.save();
      
      return res.status(200).json({
        success: true,
        message: 'Email updated successfully',
        data: {
          email: existing.email,
          name: existing.name
        }
      });
    }

    // Create new entry
    const newCapture = await EmailCapture.create({
      email: emailLower,
      name: name || '',
      source: source || 'shreeweb',
      subscribed: true,
      tags: tags || [],
      metadata: {
        context: context || '',
        contexts: context ? [context] : []
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Email captured successfully',
      data: {
        email: newCapture.email,
        name: newCapture.name
      }
    });
  } catch (error) {
    console.error('Error capturing email:', error);
    next(error);
  }
};

// Protected endpoint - get all email captures
export const getAllEmailCaptures = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    // Filter by subscription status
    if (req.query.subscribed !== undefined) {
      filter.subscribed = req.query.subscribed === 'true';
    }
    
    // Filter by source
    if (req.query.source) {
      filter.source = req.query.source;
    }
    
    // Search by email or name
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { email: searchRegex },
        { name: searchRegex }
      ];
    }

    const [captures, total] = await Promise.all([
      EmailCapture.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EmailCapture.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: captures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching email captures:', error);
    next(error);
  }
};

// Protected endpoint - delete email capture
export const deleteEmailCapture = async (req, res, next) => {
  try {
    const { id } = req.params;

    const capture = await EmailCapture.findByIdAndDelete(id);

    if (!capture) {
      return next(errorHandler(404, 'Email capture not found'));
    }

    return res.status(200).json({
      success: true,
      message: 'Email capture deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting email capture:', error);
    next(error);
  }
};

// Protected endpoint - update subscription status
export const updateSubscriptionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subscribed } = req.body;

    if (typeof subscribed !== 'boolean') {
      return next(errorHandler(400, 'Subscribed status must be a boolean'));
    }

    const capture = await EmailCapture.findByIdAndUpdate(
      id,
      { subscribed },
      { new: true }
    );

    if (!capture) {
      return next(errorHandler(404, 'Email capture not found'));
    }

    return res.status(200).json({
      success: true,
      message: 'Subscription status updated successfully',
      data: capture
    });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    next(error);
  }
};

// Protected endpoint - export email captures
export const exportEmailCaptures = async (req, res, next) => {
  try {
    const filter = {};
    
    // Filter by subscription status
    if (req.query.subscribed !== undefined) {
      filter.subscribed = req.query.subscribed === 'true';
    }
    
    // Filter by source
    if (req.query.source) {
      filter.source = req.query.source;
    }

    const captures = await EmailCapture.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Format as CSV
    const csvRows = [
      ['Email', 'Name', 'Source', 'Subscribed', 'Tags', 'Created At'].join(',')
    ];

    captures.forEach(capture => {
      csvRows.push([
        capture.email,
        capture.name || '',
        capture.source,
        capture.subscribed ? 'Yes' : 'No',
        (capture.tags || []).join('; '),
        new Date(capture.createdAt).toISOString()
      ].join(','));
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=email-captures.csv');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting email captures:', error);
    next(error);
  }
};
