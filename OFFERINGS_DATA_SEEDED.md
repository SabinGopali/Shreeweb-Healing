# Offerings Data Seeded - COMPLETE ✅

## Task Summary
Added sample data to the offerings section with 6 comprehensive service offerings.

## What Was Done

### Created Seed Script
- Built `backend/scripts/seedShreeWebOfferings.js`
- Configured to load environment variables correctly
- Clears existing offerings before seeding
- Inserts 6 sample offerings with complete details

### Offerings Added

#### 1. Discovery Call (Introductory)
- **Duration**: 30 Minutes
- **Price**: Complimentary
- **Description**: A brief, focused conversation to explore where you are, what you're seeking, and whether this work aligns with your current path.
- **Features**:
  - Understand your current state
  - Explore alignment with the work
  - No commitment required

#### 2. Single Session (Single)
- **Duration**: 60 Minutes
- **Price**: $45
- **Description**: A standalone session for those seeking clarity, energetic alignment, or support with a specific situation. Ideal for addressing immediate needs or exploring the work before committing further.
- **Features**:
  - Focused energy work
  - Address specific concerns
  - Immediate clarity and support

#### 3. Extended Session (Single) ⭐ Featured
- **Duration**: 90 Minutes
- **Price**: $65
- **Description**: For those who need more time and space to work through deeper patterns, blocks, or transitions. This extended format allows for a more thorough exploration and integration.
- **Features**:
  - Extended time for deeper work
  - Thorough pattern exploration
  - Enhanced integration support

#### 4. Monthly Support (Recurring)
- **Duration**: 4 Sessions / Month
- **Price**: $160 / month
- **Description**: Consistent support for those navigating ongoing shifts, building momentum, or maintaining energetic clarity. Sessions are scheduled weekly or bi-weekly based on your needs.
- **Features**:
  - 4 sessions per month
  - Flexible scheduling
  - Continuous momentum
  - Priority booking

#### 5. Realignment Program (Program) ⭐ Featured
- **Duration**: 8 Sessions
- **Price**: $320
- **Description**: A focused container for those ready to address core patterns, recalibrate their energy, and create sustainable shifts. This program provides structure, accountability, and deeper integration over time.
- **Features**:
  - 8 structured sessions
  - Core pattern work
  - Accountability and support
  - Integration practices
  - Email support between sessions

#### 6. Transformation Program (Program) ⭐ Featured
- **Duration**: 12 Sessions
- **Price**: $450
- **Description**: The most comprehensive offering. For visionaries, leaders, and those committed to profound personal evolution. This extended program allows for deep work, sustained momentum, and lasting transformation.
- **Features**:
  - 12 comprehensive sessions
  - Deep transformational work
  - Personalized integration plan
  - Priority scheduling
  - Ongoing email support
  - Resource library access

## Offerings by Category

### Introductory (1)
- Discovery Call - Free entry point

### Single Sessions (2)
- Single Session - $45
- Extended Session - $65 (Featured)

### Recurring (1)
- Monthly Support - $160/month

### Programs (2)
- Realignment Program - $320 (Featured)
- Transformation Program - $450 (Featured)

## Data Structure

Each offering includes:
- **title**: Main offering name
- **subtitle**: Category label (e.g., "Start Here", "One-Time Support")
- **duration**: Time commitment
- **description**: Detailed explanation
- **price**: Cost in INR (₹) or "Complimentary"
- **category**: One of: introductory, single, recurring, program
- **featured**: Boolean flag for highlighting
- **order**: Display order (0-5)
- **isActive**: Visibility status
- **features**: Array of key benefits/features

## Where Offerings Appear

### Public Pages
1. **Home Page** - Offerings section with all active offerings
2. **Offerings Page** - Dedicated page with full offerings grid
3. **About Page** - Call-to-action linking to offerings

### CMS Management
- **URL**: `http://localhost:5173/shreeweb/cms/offerings`
- Manage all offerings (create, edit, delete, reorder)
- Toggle active/inactive status
- Set featured offerings
- Configure section settings

### Booking Integration
- Each offering links to booking page with pre-selected plan
- Format: `/shreeweb/booking?plan={offering_id}`

## API Endpoints

### Public Endpoints
```
GET /backend/shreeweb-offerings/public
GET /backend/shreeweb-offerings/public/with-settings
```

### Protected CMS Endpoints
```
GET /backend/shreeweb-offerings
POST /backend/shreeweb-offerings
GET /backend/shreeweb-offerings/:id
PUT /backend/shreeweb-offerings/:id
DELETE /backend/shreeweb-offerings/:id
PUT /backend/shreeweb-offerings/:id/toggle
POST /backend/shreeweb-offerings/reorder
GET /backend/shreeweb-offerings/settings
POST /backend/shreeweb-offerings/settings
```

## Running the Seed Script

### First Time Setup
```bash
node backend/scripts/seedShreeWebOfferings.js
```

### Re-seed (Clears existing data)
```bash
node backend/scripts/seedShreeWebOfferings.js
```

**Note**: The script clears all existing offerings before seeding, so use with caution in production.

## Customization

### Adding More Offerings
Edit `backend/scripts/seedShreeWebOfferings.js` and add to the `sampleOfferings` array:

```javascript
{
  title: 'Your Offering Name',
  subtitle: 'Category Label',
  duration: 'Time Duration',
  description: 'Detailed description...',
  price: '$XXX',
  category: 'single', // or introductory, recurring, program
  featured: false,
  order: 6, // Next order number
  isActive: true,
  features: [
    'Feature 1',
    'Feature 2',
    'Feature 3'
  ]
}
```

### Pricing Format
- Use US Dollar symbol: $
- Format: $45, $65, $320, $450
- For free offerings: "Complimentary"
- For recurring: "$160 / month"

### Categories
- **introductory**: Free or low-commitment entry points
- **single**: One-time sessions
- **recurring**: Ongoing monthly support
- **program**: Multi-session packages

## Design Consistency

All offerings follow the JAPANDI aesthetic:
- Clean, minimalist cards
- Serif fonts for titles
- Stone and amber color palette
- Subtle shadows and borders
- Responsive grid layout

## Testing

### View Offerings
1. **Home Page**: `http://localhost:5173/shreeweb/home` - Scroll to offerings section
2. **Offerings Page**: `http://localhost:5173/shreeweb/offers` - Full offerings grid
3. **Booking**: Click any offering to go to booking with pre-selected plan

### Manage in CMS
1. Navigate to: `http://localhost:5173/shreeweb/cms/offerings`
2. Must be logged in as admin
3. Create, edit, delete, or reorder offerings
4. Toggle active/inactive status
5. Set featured offerings

## Files Created/Modified

### Created
- `backend/scripts/seedShreeWebOfferings.js` - Seed script with sample data
- `OFFERINGS_DATA_SEEDED.md` - This documentation

### Existing Files (No Changes)
- `backend/models/ShreeWebOffering.model.js` - Model definition
- `backend/controllers/shreeWebOffering.controller.js` - API controllers
- `shreeweb/src/shreeweb/shreeweb/pages/Offerings.jsx` - Public offerings page
- `shreeweb/src/shreeweb/shreeweb/components/OffersSection.jsx` - Offerings component

## Status
**✅ COMPLETE** - 6 sample offerings successfully added to the database!

## Summary

Successfully seeded the offerings section with 6 comprehensive service offerings:
- 1 complimentary discovery call
- 2 single sessions ($45 & $65)
- 1 monthly recurring support package ($160/month)
- 2 transformation programs ($320 & $450)

All offerings include detailed descriptions, pricing in USD, features, and proper categorization. The data is now visible on the home page, offerings page, and manageable through the CMS.
