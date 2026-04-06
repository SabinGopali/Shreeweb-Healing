import ShreeWebNotification from '../models/ShreeWebNotification.model.js';
import { errorHandler } from '../utils/error.js';

// Get all notifications for current admin
export const getNotifications = async (req, res, next) => {
  try {
    const adminId = req.admin.adminId;
    const { limit = 50, skip = 0, unreadOnly = false } = req.query;

    const query = { adminId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await ShreeWebNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await ShreeWebNotification.countDocuments(query);
    const unreadCount = await ShreeWebNotification.getUnreadCount(adminId);

    res.status(200).json({
      success: true,
      notifications,
      total,
      unreadCount,
      hasMore: total > parseInt(skip) + notifications.length
    });
  } catch (error) {
    next(error);
  }
};

// Get unread count
export const getUnreadCount = async (req, res, next) => {
  try {
    const adminId = req.admin.adminId;
    const unreadCount = await ShreeWebNotification.getUnreadCount(adminId);

    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.adminId;

    const notification = await ShreeWebNotification.markAsRead(id, adminId);

    if (!notification) {
      return next(errorHandler(404, 'Notification not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    const adminId = req.admin.adminId;

    await ShreeWebNotification.markAllAsRead(adminId);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.adminId;

    const notification = await ShreeWebNotification.findOneAndDelete({
      _id: id,
      adminId
    });

    if (!notification) {
      return next(errorHandler(404, 'Notification not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
};

// Delete all read notifications
export const deleteAllRead = async (req, res, next) => {
  try {
    const adminId = req.admin.adminId;

    const result = await ShreeWebNotification.deleteMany({
      adminId,
      isRead: true
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications deleted`
    });
  } catch (error) {
    next(error);
  }
};

// Create notification (for system use or testing)
export const createNotification = async (req, res, next) => {
  try {
    const { type, title, message, link, icon, priority, metadata } = req.body;
    const adminId = req.admin.adminId;

    if (!type || !title || !message) {
      return next(errorHandler(400, 'Type, title, and message are required'));
    }

    const notification = await ShreeWebNotification.createNotification({
      adminId,
      type,
      title,
      message,
      link,
      icon,
      priority,
      metadata
    });

    res.status(201).json({
      success: true,
      message: 'Notification created',
      notification
    });
  } catch (error) {
    next(error);
  }
};
