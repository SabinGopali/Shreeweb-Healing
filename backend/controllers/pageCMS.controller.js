import PageCMS from "../models/pageCMS.model.js";
import { errorHandler, catchAsyncError } from "../utils/error.js";
import mongoose from "mongoose";
import path from "path";

const normalizeFilesToData = (files = []) => {
  if (!files.length) return {};
  return files.reduce((acc, file) => {
    // Convert absolute file path to relative URL path
    let normalizedPath = file.path.replace(/\\/g, "/");
    
    // Extract the part after 'uploads' directory
    const uploadsIndex = normalizedPath.toLowerCase().indexOf("uploads/");
    if (uploadsIndex !== -1) {
      normalizedPath = "/" + normalizedPath.substring(uploadsIndex);
    } else {
      // Fallback: if 'uploads' not found, use the filename with appropriate folder
      const filename = file.filename || path.basename(normalizedPath);
      const fieldname = file.fieldname || "file";
      
      // Determine subfolder based on fieldname (similar to multer config)
      let subfolder = "others";
      if (fieldname === "pageCmsImage") {
        subfolder = "page-cms";
      }
      normalizedPath = `/uploads/${subfolder}/${filename}`;
    }
    
    // Ensure it starts with /uploads/
    if (!normalizedPath.startsWith("/uploads/")) {
      normalizedPath = `/uploads/page-cms/${file.filename || path.basename(normalizedPath)}`;
    }
    
    acc[file.fieldname] = normalizedPath;
    return acc;
  }, {});
};

const pickScalar = (value, fallback = "") => {
  if (Array.isArray(value)) {
    return value.length ? value[0] : fallback;
  }
  return typeof value === "undefined" || value === null ? fallback : value;
};

const buildPayload = (req) => {
  const { status, order, page, section, ...rest } = req.body || {};
  const scalarStatus = pickScalar(status, "Draft");
  const scalarOrder = pickScalar(order, 0);
  const numericOrder =
    scalarOrder !== "" && scalarOrder !== null ? Number(scalarOrder) : 0;

  return {
    status: scalarStatus || "Draft",
    order: Number.isNaN(numericOrder) ? 0 : numericOrder,
    data: Object.entries(rest).reduce((acc, [key, value]) => {
      const scalarValue = pickScalar(value, "");
      
      // Try to parse JSON strings (for arrays sent from frontend)
      if (typeof scalarValue === 'string' && (scalarValue.startsWith('[') || scalarValue.startsWith('{'))) {
        try {
          acc[key] = JSON.parse(scalarValue);
        } catch (e) {
          // If parsing fails, keep as string
          acc[key] = scalarValue;
        }
      } else {
        acc[key] = scalarValue;
      }
      
      return acc;
    }, {}),
  };
};

const formatEntryForClient = (entry, req = null) => {
  const formatted = {
    id: entry._id,
    page: entry.page,
    section: entry.section,
    status: entry.status,
    order: entry.order,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    ...entry.data,
    owner: entry.createdBy,
  };
  
  // Normalize image URLs to full URLs if req is provided
  // This ensures image previews work correctly in the frontend
  if (req) {
    const imageFields = ['image', 'heroImage', 'bannerImage', 'mainImage', 'backgroundImage', 'sectionImage', 'pageCmsImage'];
    imageFields.forEach(field => {
      if (formatted[field] && typeof formatted[field] === 'string' && formatted[field].trim()) {
        const url = formatted[field].trim();
        // Only normalize if it's a relative path, not already a full URL
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:') && !url.startsWith('blob:')) {
          // Ensure it starts with /uploads
          const normalizedPath = url.startsWith('/') ? url : `/${url}`;
          formatted[field] = `${req.protocol}://${req.get('host')}${normalizedPath}`;
        }
      }
    });
  }
  
  return formatted;
};

const isOwner = (entry, userId) => {
  if (!userId) return false;
  return String(entry.createdBy) === String(userId);
};

export const getPageContent = catchAsyncError(async (req, res, next) => {
  const { page } = req.params;
  if (!page) {
    return next(errorHandler(400, "Page is required"));
  }

  const filter = { page };

  // Only admins can see all entries, others see only their own or public ones
  if (!req.user?.isAdmin) {
    let userId = null;
    if (req.user?.isSubUser) {
      userId = req.user.supplierId || req.user.supplierRef || req.user.id || req.user._id;
    } else {
      userId = req.user.id || req.user._id;
    }

    if (userId) {
      try {
        const userObjectId = mongoose.Types.ObjectId.isValid(userId)
          ? new mongoose.Types.ObjectId(userId)
          : userId;
        filter.$or = [
          { createdBy: userObjectId },
          { createdBy: null },
        ];
      } catch (err) {
        filter.$or = [
          { createdBy: String(userId) },
          { createdBy: null },
        ];
      }
    } else {
      filter.createdBy = null;
    }
  }

  const entries = await PageCMS.find(filter).sort({
    section: 1,
    order: 1,
    createdAt: 1,
  });

  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.section]) {
      acc[entry.section] = [];
    }
    acc[entry.section].push(formatEntryForClient(entry, req));
    return acc;
  }, {});

  res.json({ success: true, sections: grouped });
});

export const getPageSection = catchAsyncError(async (req, res, next) => {
  const { page, section } = req.params;
  if (!page || !section) {
    return next(errorHandler(400, "Page and section are required"));
  }

  const filter = { page, section };

  if (!req.user?.isAdmin) {
    let userId = null;
    if (req.user?.isSubUser) {
      userId = req.user.supplierId || req.user.supplierRef || req.user.id || req.user._id;
    } else {
      userId = req.user.id || req.user._id;
    }

    if (userId) {
      try {
        const userObjectId = mongoose.Types.ObjectId.isValid(userId)
          ? new mongoose.Types.ObjectId(userId)
          : userId;
        filter.$or = [
          { createdBy: userObjectId },
          { createdBy: null },
        ];
      } catch (err) {
        filter.$or = [
          { createdBy: String(userId) },
          { createdBy: null },
        ];
      }
    } else {
      filter.createdBy = null;
    }
  }

  const entries = await PageCMS.find(filter).sort({
    order: 1,
    createdAt: 1,
  });

  res.json({
    success: true,
    entries: entries.map(entry => formatEntryForClient(entry, req)),
  });
});

export const getPublicPageContent = catchAsyncError(async (req, res, next) => {
  const { page } = req.params;
  if (!page) {
    return next(errorHandler(400, "Page is required"));
  }

  const entries = await PageCMS.find({ page, status: "Live" }).sort({
    section: 1,
    order: 1,
    createdAt: 1,
  });

  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.section]) {
      acc[entry.section] = [];
    }
    acc[entry.section].push(formatEntryForClient(entry, req));
    return acc;
  }, {});

  res.json({
    success: true,
    sections: grouped,
  });
});

export const getPublicPageSection = catchAsyncError(async (req, res, next) => {
  const { page, section } = req.params;
  if (!page || !section) {
    return next(errorHandler(400, "Page and section are required"));
  }

  const entries = await PageCMS.find({ page, section, status: "Live" }).sort({
    order: 1,
    createdAt: 1,
  });

  res.json({
    success: true,
    entries: entries.map(entry => formatEntryForClient(entry, req)),
  });
});

export const getEntryById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(errorHandler(400, "Entry ID is required"));
  }

  const entry = await PageCMS.findById(id);
  if (!entry) {
    return next(errorHandler(404, "Entry not found"));
  }

  const canView =
    req.user?.isAdmin ||
    isOwner(entry, req.user?.id) ||
    entry.createdBy === null;
  if (!canView) {
    return next(errorHandler(403, "You do not have permission to view this entry"));
  }

  res.json({
    success: true,
    entry: formatEntryForClient(entry, req),
  });
});

export const createPageEntry = catchAsyncError(async (req, res, next) => {
  const { page, section } = req.params;
  if (!page || !section) {
    return next(errorHandler(400, "Page and section are required"));
  }

  const fileData = normalizeFilesToData(req.files);
  const payload = buildPayload(req);

  // Debug log to see what's being saved
  console.log('Creating page entry with data:', {
    page,
    section,
    status: payload.status,
    order: payload.order,
    data: payload.data,
    fileData
  });

  const entry = await PageCMS.create({
    page,
    section,
    status: payload.status,
    order: payload.order,
    data: { ...payload.data, ...fileData },
    createdBy: req.user?.id || null,
    updatedBy: req.user?.id || null,
  });

  res.status(201).json({
    success: true,
    entry: formatEntryForClient(entry, req),
  });
});

export const updatePageEntry = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const fileData = normalizeFilesToData(req.files);
  const payload = buildPayload(req);

  const entry = await PageCMS.findById(id);
  if (!entry) {
    return next(errorHandler(404, "Entry not found"));
  }

  const canModify =
    req.user?.isAdmin ||
    isOwner(entry, req.user?.id) ||
    entry.createdBy === null;
  if (!canModify) {
    return next(errorHandler(403, "You cannot modify this entry"));
  }

  // Debug log to see what's being updated
  console.log('Updating page entry with data:', {
    id,
    status: payload.status,
    order: payload.order,
    data: payload.data,
    fileData
  });

  if (req.body.page) entry.page = req.body.page;
  if (req.body.section) entry.section = req.body.section;
  entry.status = payload.status;
  entry.order = payload.order;
  entry.data = { ...entry.data, ...payload.data, ...fileData };
  entry.updatedBy = req.user?._id || entry.updatedBy;

  await entry.save();

  res.json({
    success: true,
    entry: formatEntryForClient(entry, req),
  });
});

export const deletePageEntry = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const entry = await PageCMS.findById(id);
  if (!entry) {
    return next(errorHandler(404, "Entry not found"));
  }

  const canDelete =
    req.user?.isAdmin ||
    isOwner(entry, req.user?.id) ||
    entry.createdBy === null;
  if (!canDelete) {
    return next(errorHandler(403, "You cannot delete this entry"));
  }

  await entry.deleteOne();
  res.json({ success: true, message: "Entry deleted" });
});

// Upload CMS image
export const uploadCmsImage = catchAsyncError(async (req, res, next) => {
  // Check for both req.user (regular auth) and req.admin (ShreeWeb auth)
  const userId = req.user?.id || req.admin?.adminId;
  if (!userId) {
    return next(errorHandler(401, "Unauthorized"));
  }

  if (!req.file) {
    return next(errorHandler(400, "No file uploaded"));
  }

  // Convert absolute file path to relative URL path
  // req.file.path is like: C:/Users/.../Backend/uploads/page-cms/filename.jpg
  // We need: /uploads/page-cms/filename.jpg
  let imageUrl = req.file.path.replace(/\\/g, "/");
  
  // Extract the part after 'uploads' directory
  const uploadsIndex = imageUrl.toLowerCase().indexOf("uploads/");
  if (uploadsIndex !== -1) {
    imageUrl = "/" + imageUrl.substring(uploadsIndex);
  } else {
    // Fallback: if 'uploads' not found, assume it's relative to uploads
    const pathParts = imageUrl.split("/");
    const uploadsIdx = pathParts.findIndex(p => p.toLowerCase() === "uploads");
    if (uploadsIdx !== -1) {
      imageUrl = "/" + pathParts.slice(uploadsIdx).join("/");
    } else {
      // Last resort: use the filename and assume page-cms folder
      imageUrl = `/uploads/page-cms/${req.file.filename}`;
    }
  }

  // Ensure it starts with /uploads/
  if (!imageUrl.startsWith("/uploads/")) {
    imageUrl = `/uploads/page-cms/${req.file.filename}`;
  }

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    imageUrl: imageUrl,
  });
});

