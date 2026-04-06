# Email Marketing Backend - Complete Implementation

## Task Summary
Implemented complete email marketing backend system to capture emails from "Stay Connected" sections throughout the site and display them in the CMS leads page with proper backend handling.

## What Was Done

### 1. Created Backend Controller
**File**: `backend/controllers/emailCapture.controller.js`

#### Endpoints Implemented:
- **POST `/backend/email-captures/capture`** (Public) - Capture email from forms
- **GET `/backend/email-captures`** (Protected) - Get all email captures with pagination and filters
- **DELETE `/backend/email-captures/:id`** (Protected) - Delete an email capture
- **PATCH `/backend/email-captures/:id/subscription`** (Protected) - Update subscription status
- **GET `/backend/email-captures/export`** (Protected) - Export email captures as CSV

#### Features:
- Email validation
- Duplicate email handling (updates existing entry)
- Context tracking (where the email was captured)
- Tags support
- Metadata storage
- Pagination support
- Search functionality
- Filter by source and subscription status
- CSV export

### 2. Created Backend Route
**File**: `backend/routes/emailCapture.route.js`

- Public route for capturing emails
- Protected routes for CMS management (requires admin authentication)
- RESTful API design

### 3. Updated Backend Index
**File**: `backend/index.js`

- Added email capture route import
- Registered route at `/backend/email-captures`

### 4. Updated EmailCapture Component
**File**: `shreeweb/src/shreeweb/shreeweb/components/EmailCapture.jsx`

#### Changes:
- Removed localStorage dependency
- Now saves to backend API via POST request
- Sends context information (where the form was used)
- Sends source and tags for better organization
- Proper error handling with user-friendly messages
- Success message after submission

#### API Integration:
```javascript
POST /backend/email-captures/capture
Body: {
  email: string,
  source: 'shreeweb',
  context: string (e.g., 'booking', 'footer', 'home'),
  tags: string[]
}
```

### 5. Completely Rewrote CMS Leads Page
**File**: `shreeweb/src/shreeweb/shreeweb/cms/pages/CmsLeads.jsx`

#### Features:
- **Real-time Data**: Fetches from backend API instead of localStorage
- **Search**: Search by email or name
- **Filters**: 
  - Filter by source (shreeweb, newsletter, contact_form, other)
  - Filter by subscription status (subscribed/unsubscribed)
- **Pagination**: Navigate through pages of leads (50 per page)
- **Stats**: Shows total email captures
- **Export**: Export filtered leads as CSV
- **Delete**: Remove individual email captures
- **Context Display**: Shows where each email was captured
- **Status Badges**: Visual indicators for subscription status and source

#### UI Improvements:
- Clean table layout
- Color-coded status badges
- Responsive design
- Loading states
- Error handling
- Empty states

## Database Model

### EmailCapture Schema
```javascript
{
  name: String (optional),
  email: String (required, unique, lowercase),
  source: String (enum: ['shreeweb', 'newsletter', 'contact_form', 'other']),
  subscribed: Boolean (default: true),
  tags: [String],
  metadata: Mixed (stores context and other data),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes:
- `email` (unique)
- `createdAt` (descending)
- `source + subscribed` (compound)

## Email Capture Locations

### 1. Home Page
- "Stay Connected" section
- Context: 'home'

### 2. Footer
- Newsletter signup
- Context: 'footer'

### 3. Booking Page
- "Stay Updated" sidebar
- Context: booking offering name (e.g., 'Single Session')

### 4. Other Pages
- Any page using the EmailCapture component
- Context passed as prop

## API Endpoints

### Public Endpoints

#### Capture Email
```
POST /backend/email-captures/capture
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "name": "John Doe" (optional),
  "source": "shreeweb",
  "context": "booking",
  "tags": ["interested", "booking"]
}

Response:
{
  "success": true,
  "message": "Email captured successfully",
  "data": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Protected Endpoints (Require Admin Auth)

#### Get All Email Captures
```
GET /backend/email-captures?page=1&limit=50&search=john&source=shreeweb&subscribed=true
Authorization: Cookie (JWT)

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

#### Delete Email Capture
```
DELETE /backend/email-captures/:id
Authorization: Cookie (JWT)

Response:
{
  "success": true,
  "message": "Email capture deleted successfully"
}
```

#### Update Subscription Status
```
PATCH /backend/email-captures/:id/subscription
Authorization: Cookie (JWT)
Content-Type: application/json

Body:
{
  "subscribed": false
}

Response:
{
  "success": true,
  "message": "Subscription status updated successfully",
  "data": {...}
}
```

#### Export Email Captures
```
GET /backend/email-captures/export?source=shreeweb&subscribed=true
Authorization: Cookie (JWT)

Response: CSV file download
```

## User Flow

### Frontend (Public Site)

1. User visits any page with EmailCapture component
2. Enters email address
3. Clicks "Stay Updated" button
4. Component sends POST request to `/backend/email-captures/capture`
5. Backend validates email and saves to database
6. User sees success message: "Thanks! We'll reach out with updates and availability."

### Backend (CMS)

1. Admin logs into CMS
2. Navigates to "Email Subscribers" page (`/shreeweb/cms/leads`)
3. Sees list of all captured emails with:
   - Email address
   - Name (if provided)
   - Source
   - Context (where captured)
   - Subscription status
   - Capture date
4. Can:
   - Search by email or name
   - Filter by source
   - Filter by subscription status
   - Export to CSV
   - Delete individual entries
   - Navigate through pages

## Features

### Duplicate Handling
- If email already exists, updates the existing entry
- Adds new context to contexts array
- Merges tags
- Updates metadata

### Context Tracking
- Tracks where each email was captured
- Stores in `metadata.context` and `metadata.contexts` array
- Useful for understanding which pages/sections are most effective

### CSV Export
- Exports filtered results
- Includes: Email, Name, Source, Subscribed, Tags, Created At
- Filename includes date: `email-captures-2026-04-05.csv`

### Pagination
- 50 leads per page
- Previous/Next navigation
- Page indicator

### Search
- Search by email address
- Search by name
- Case-insensitive
- Real-time filtering

### Filters
- Source: shreeweb, newsletter, contact_form, other
- Status: subscribed, unsubscribed, all

## Security

### Authentication
- All CMS endpoints require admin authentication
- Uses JWT token in HTTP-only cookie
- Verified via `verifyToken` and `requireAdmin` middleware

### Validation
- Email format validation
- Required field validation
- Type checking

### Data Protection
- Emails stored in lowercase
- Trimmed whitespace
- Unique constraint on email field

## Testing

### Test Email Capture
1. Visit: `http://localhost:5173/shreeweb/booking?plan={offering_id}`
2. Find "Stay Updated" section in sidebar
3. Enter email address
4. Click "Stay Updated"
5. Should see success message

### Test CMS Display
1. Login to CMS
2. Visit: `http://localhost:5173/shreeweb/cms/leads`
3. Should see captured email in the list
4. Try search, filters, and export

### Test Other Locations
1. Home page - "Stay Connected" section
2. Footer - Newsletter signup
3. Any page with EmailCapture component

## Files Created/Modified

### Created:
1. `backend/controllers/emailCapture.controller.js` - Email capture controller
2. `backend/routes/emailCapture.route.js` - Email capture routes

### Modified:
1. `backend/index.js` - Added email capture route
2. `shreeweb/src/shreeweb/shreeweb/components/EmailCapture.jsx` - Updated to use backend API
3. `shreeweb/src/shreeweb/shreeweb/cms/pages/CmsLeads.jsx` - Completely rewritten with backend integration

### Existing (Used):
1. `backend/models/EmailCapture.model.js` - Email capture model (already existed)

## Benefits

### For Administrators:
- Centralized email list management
- Easy export for email marketing tools
- Context tracking for analytics
- Search and filter capabilities
- No data loss (stored in database, not localStorage)

### For Users:
- Simple, one-click email capture
- Clear success/error messages
- No account required
- Privacy-focused (minimal data collection)

### For Business:
- Build email list for marketing
- Track which pages/sections drive signups
- Export for email campaigns
- Understand user interest patterns

## Next Steps

1. ✅ Backend API implemented
2. ✅ Frontend component updated
3. ✅ CMS page rewritten
4. ✅ Email validation working
5. ✅ CSV export functional
6. Integrate with email marketing service (Mailchimp, SendGrid, etc.)
7. Add email verification/confirmation
8. Add unsubscribe functionality
9. Add email templates
10. Add automated welcome emails

## Notes

- All email captures are stored in MongoDB
- Emails are unique (duplicate emails update existing entry)
- Context tracking helps understand user journey
- CSV export makes it easy to use with external email tools
- Admin authentication required for all CMS operations
- Public endpoint has no authentication (by design)
