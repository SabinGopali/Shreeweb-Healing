import mongoose from 'mongoose';

const shreeWebNotificationSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShreeWebAdmin',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['lead', 'contact', 'booking', 'system', 'content', 'user'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  link: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    enum: ['email', 'message', 'calendar', 'alert', 'info', 'user', 'bell'],
    default: 'bell'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient queries
shreeWebNotificationSchema.index({ adminId: 1, isRead: 1, createdAt: -1 });
shreeWebNotificationSchema.index({ createdAt: -1 });

// Static method to create notification
shreeWebNotificationSchema.statics.createNotification = async function(data) {
  return await this.create(data);
};

// Static method to mark as read
shreeWebNotificationSchema.statics.markAsRead = async function(notificationId, adminId) {
  return await this.findOneAndUpdate(
    { _id: notificationId, adminId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

// Static method to mark all as read
shreeWebNotificationSchema.statics.markAllAsRead = async function(adminId) {
  return await this.updateMany(
    { adminId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Static method to get unread count
shreeWebNotificationSchema.statics.getUnreadCount = async function(adminId) {
  return await this.countDocuments({ adminId, isRead: false });
};

const ShreeWebNotification = mongoose.model('ShreeWebNotification', shreeWebNotificationSchema);

export default ShreeWebNotification;
