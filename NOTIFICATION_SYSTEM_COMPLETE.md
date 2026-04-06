# Notification System - Complete Implementation

## Overview
Fully dynamic notification system for the ShreeWeb CMS with real-time updates, backend integration, and comprehensive notification management.

## Backend Implementation

### 1. Model: `ShreeWebNotification.model.js`
**Location**: `backend/models/ShreeWebNotification.model.js`

**Schema Fields**:
- `adminId`: Reference to ShreeWebAdmin (indexed)
- `type`: Enum ['lead', 'contact', 'booking', 'system', 'content', 'user']
- `title`: String (max 200 chars)
- `message`: String (max 500 chars)
- `link`: Optional navigation link
- `icon`: Enum ['email', 'message', 'calendar', 'alert', 'info', 'user', 'bell']
- `priority`: Enum ['low', 'medium', 'high']
- `isRead`: Boolean (indexed)
- `readAt`: Date
- `metadata`: Mixed (for additional data)
- `timestamps`: createdAt, updatedAt

**Static Methods**:
- `createNotification(data)` - Create new notification
- `markAsRead(notificationId, adminId)` - Mark single as read
- `markAllAsRead(adminId)` - Mark all as read
- `getUnreadCount(adminId)` - Get unread count

**Indexes**:
- Compound: `{ adminId: 1, isRead: 1, createdAt: -1 }`
- Single: `{ createdAt: -1 }`

### 2. Controller: `shreeWebNotification.controller.js`
**Location**: `backend/controllers/shreeWebNotification.controller.js`

**Endpoints**:
1. `getNotifications` - Get all notifications with pagination
   - Query params: limit, skip, unreadOnly
   - Returns: notifications, total, unreadCount, hasMore

2. `getUnreadCount` - Get unread notification count
   - Returns: unreadCount

3. `markAsRead` - Mark single notification as read
   - Params: id
   - Returns: updated notification

4. `markAllAsRead` - Mark all notifications as read
   - Returns: success message

5. `deleteNotification` - Delete single notification
   - Params: id
   - Returns: success message

6. `deleteAllRead` - Delete all read notifications
   - Returns: count of deleted notifications

7. `createNotification` - Create new notification (for testing/system use)
   - Body: type, title, message, link, icon, priority, metadata
   - Returns: created notification

### 3. Routes: `shreeWebNotification.route.js`
**Location**: `backend/routes/shreeWebNotification.route.js`

**All routes require authentication** (`verifyToken`, `requireAdmin`)

```
GET    /backend/shreeweb-notifications              - Get notifications
GET    /backend/shreeweb-notifications/unread-count - Get unread count
PUT    /backend/shreeweb-notifications/:id/read     - Mark as read
PUT    /backend/shreeweb-notifications/mark-all-read - Mark all as read
DELETE /backend/shreeweb-notifications/:id          - Delete notification
DELETE /backend/shreeweb-notifications/read/all     - Delete all read
POST   /backend/shreeweb-notifications              - Create notification
```

### 4. Server Integration
**Location**: `backend/index.js`

Added route:
```javascript
import shreeWebNotificationRoute from './routes/shreeWebNotification.route.js';
app.use('/backend/shreeweb-notifications', shreeWebNotificationRoute);
```

## Frontend Implementation

### 1. CmsNavbar Component Updates
**Location**: `shreeweb/src/shreeweb/shreeweb/cms/components/CmsNavbar.jsx`

**New State Variables**:
- `showNotifications` - Toggle notification dropdown
- `notifications` - Array of notification objects
- `unreadCount` - Number of unread notifications
- `notificationsLoading` - Loading state
- `notificationsRef` - Ref for click-outside detection

**New Functions**:
1. `fetchUnreadCount()` - Fetch unread count from API
   - Polls every 30 seconds
   - Updates badge count

2. `fetchNotifications()` - Fetch notification list
   - Called when dropdown opens
   - Limits to 10 most recent

3. `handleNotificationClick(notification)` - Handle notification click
   - Marks as read if unread
   - Navigates to link if exists
   - Closes dropdown

4. `handleMarkAllAsRead()` - Mark all notifications as read
   - Updates backend
   - Updates local state

5. `toggleNotifications()` - Toggle notification dropdown
   - Fetches notifications on open

**UI Features**:
- Bell icon with dynamic badge (shows count, "9+" for 10+)
- Dropdown panel with:
  - Header with "Mark all read" button
  - Scrollable notification list (max 400px)
  - Loading spinner
  - Empty state
  - Individual notification cards with:
    - Icon based on type
    - Title and message
    - Timestamp
    - Unread indicator (amber dot)
    - Priority-based color coding
    - Click to navigate and mark as read

**Desktop View**:
- Positioned in top-right navbar
- Dropdown appears below button
- Width: 384px (w-96)

**Mobile View**:
- Button in mobile menu
- Shows unread count badge
- Clicking opens notifications (can be expanded to show list)

## Seeding Script

### `seedNotifications.js`
**Location**: `backend/scripts/seedNotifications.js`

**Purpose**: Create sample notifications for testing

**Sample Notifications**:
1. New Email Subscriber (lead, medium priority)
2. New Contact Message (contact, high priority)
3. Session Booking Request (booking, high priority)
4. Content Update Reminder (system, low priority)
5. Hero Section Updated (content, low priority)

**Usage**:
```bash
cd backend
node scripts/seedNotifications.js
```

## Notification Types & Icons

| Type | Icon | Use Case |
|------|------|----------|
| lead | email | Email subscribers, newsletter signups |
| contact | message | Contact form submissions |
| booking | calendar | Session bookings, appointments |
| system | info | System alerts, reminders |
| content | info | Content updates, changes |
| user | user | User-related notifications |

## Priority Levels

| Priority | Badge Color | Use Case |
|----------|-------------|----------|
| high | Red (bg-red-100) | Urgent actions required |
| medium | Amber (bg-amber-100) | Normal notifications |
| low | Stone (bg-stone-100) | Informational only |

## Auto-Polling

The notification system automatically polls for new notifications:
- **Interval**: Every 30 seconds
- **Endpoint**: `/backend/shreeweb-notifications/unread-count`
- **Purpose**: Keep badge count updated without page refresh

## Integration Points

### Creating Notifications Programmatically

When integrating with other systems (e.g., contact forms, bookings), create notifications:

```javascript
import ShreeWebNotification from '../models/ShreeWebNotification.model.js';

// Example: New contact form submission
await ShreeWebNotification.createNotification({
  adminId: adminId,
  type: 'contact',
  title: 'New Contact Message',
  message: `${name} sent you a message about ${subject}`,
  link: '/shreeweb/cms/contacts',
  icon: 'message',
  priority: 'high',
  metadata: {
    contactId: contact._id,
    email: contact.email
  }
});
```

### Notification Triggers

Recommended triggers for automatic notifications:
1. **Email Capture**: New subscriber → 'lead' notification
2. **Contact Form**: New message → 'contact' notification
3. **Booking Request**: New booking → 'booking' notification
4. **Content Updates**: Admin edits → 'content' notification
5. **System Events**: Errors, warnings → 'system' notification

## Testing

### Manual Testing
1. Start backend server: `cd backend && node index.js`
2. Seed notifications: `node scripts/seedNotifications.js`
3. Open CMS: `http://localhost:5173/shreeweb/cms/overview`
4. Click bell icon to view notifications
5. Click notification to mark as read and navigate
6. Click "Mark all read" to clear all

### API Testing with curl

```bash
# Get unread count
curl http://localhost:3000/backend/shreeweb-notifications/unread-count \
  -H "Cookie: shreeweb_admin_token=YOUR_TOKEN"

# Get notifications
curl http://localhost:3000/backend/shreeweb-notifications \
  -H "Cookie: shreeweb_admin_token=YOUR_TOKEN"

# Mark as read
curl -X PUT http://localhost:3000/backend/shreeweb-notifications/NOTIFICATION_ID/read \
  -H "Cookie: shreeweb_admin_token=YOUR_TOKEN"

# Create notification
curl -X POST http://localhost:3000/backend/shreeweb-notifications \
  -H "Content-Type: application/json" \
  -H "Cookie: shreeweb_admin_token=YOUR_TOKEN" \
  -d '{
    "type": "system",
    "title": "Test Notification",
    "message": "This is a test",
    "icon": "bell",
    "priority": "medium"
  }'
```

## Future Enhancements

### Potential Features
1. **Real-time Updates**: WebSocket integration for instant notifications
2. **Notification Preferences**: Allow admins to configure which notifications they receive
3. **Email Notifications**: Send email for high-priority notifications
4. **Notification History**: Archive and search old notifications
5. **Bulk Actions**: Select multiple notifications for batch operations
6. **Notification Templates**: Predefined templates for common notification types
7. **Sound Alerts**: Audio notification for new high-priority items
8. **Desktop Notifications**: Browser push notifications
9. **Notification Categories**: Filter by type/priority
10. **Snooze Feature**: Temporarily dismiss and remind later

## Files Created/Modified

### Created
- `backend/models/ShreeWebNotification.model.js`
- `backend/controllers/shreeWebNotification.controller.js`
- `backend/routes/shreeWebNotification.route.js`
- `backend/scripts/seedNotifications.js`
- `NOTIFICATION_SYSTEM_COMPLETE.md`

### Modified
- `backend/index.js` - Added notification routes
- `shreeweb/src/shreeweb/shreeweb/cms/components/CmsNavbar.jsx` - Added dynamic notifications

## Summary

The notification system is now fully functional with:
✅ Complete backend API with CRUD operations
✅ Dynamic frontend with real-time badge updates
✅ Auto-polling every 30 seconds
✅ Mark as read functionality
✅ Navigation to related pages
✅ Priority-based styling
✅ Mobile and desktop responsive
✅ Seeding script for testing
✅ Comprehensive documentation

The system is production-ready and can be integrated with other CMS features to provide real-time updates to administrators.
