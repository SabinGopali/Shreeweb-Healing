# Image Gallery Section - About Page (File Upload Based)

## Overview
Added a beautiful image gallery section to the About page (`/shreeweb/about`) with full CMS management capabilities and direct file upload support.

## Features

### Frontend Display
- **Responsive Grid Layout**: 2-3 column grid that adapts to screen sizes
- **Elegant Image Cards**: Rounded corners with hover effects
- **Image Zoom on Hover**: Smooth scale animation when hovering over images
- **Caption Overlay**: Captions slide up on hover with gradient overlay
- **Placeholder Support**: Shows elegant placeholder when no image is uploaded
- **Consistent Design**: Matches the existing About page aesthetic with stone/amber color scheme

### CMS Management
Location: CMS Dashboard → About Page Management → Image Gallery Section

#### Controls:
1. **Enable/Disable Toggle**: Show or hide the entire gallery section
2. **Section Title**: Customize the gallery heading
3. **Section Subtitle**: Add descriptive subtitle text
4. **Bulk Upload**: Upload multiple images at once (up to 10 images)
5. **Individual Upload**: Add images one by one to specific slots
6. **Image Management**:
   - Add unlimited images
   - Remove images individually
   - **Direct file upload** (JPG, PNG, WebP, GIF, SVG)
   - **Multiple file selection** for bulk uploads
   - Reorder images with order numbers
   - Add alt text for accessibility
   - Add optional captions that appear on hover
   - Live image preview after upload

## Files Modified

### Backend
1. **`backend/models/ShreeWebAbout.model.js`**
   - Added `imageGallery` schema with:
     - `enabled` (Boolean)
     - `title` (String)
     - `subtitle` (String)
     - `backgroundColor` (String)
     - `images` array with url, alt, caption, order

2. **`backend/controllers/shreeWebAbout.controller.js`**
   - Added default imageGallery initialization
   - Added `uploadGalleryImage` function for file uploads
   - Handles file upload and returns image URL
   - Existing update endpoints support the new section

3. **`backend/routes/shreeWebAbout.route.js`**
   - Added POST `/upload-gallery-image` endpoint
   - Uses multer middleware for file handling
   - Field name: `galleryImage`
   - Requires authentication (verifyToken, requireAdmin)

4. **`backend/middleware/multer.js`**
   - Existing multer configuration supports image uploads
   - Accepts: JPG, PNG, GIF, WebP, SVG
   - Max file size: 100MB
   - Auto-generates unique filenames
   - Stores in `/backend/uploads/` directory

### Frontend
5. **`shreeweb/src/shreeweb/shreeweb/pages/About.jsx`**
   - Added Image Gallery section between "About Me" and "What We Do"
   - Responsive grid layout (1-2-3 columns)
   - Hover effects with image zoom and caption reveal
   - Conditional rendering based on enabled flag
   - Placeholder images when no file is uploaded

6. **`shreeweb/src/shreeweb/shreeweb/cms/pages/CmsAbout.jsx`**
   - Added Image Gallery management section
   - **File upload input** instead of URL input
   - Add/remove image functionality
   - `handleImageUpload` function for async file uploads
   - Image preview after successful upload
   - Upload progress indicator
   - Field validation and ordering
   - Integrated with existing save functionality

## Design Consistency

The image gallery maintains design consistency with the rest of the About page:
- **Colors**: Stone and amber palette (#EDE7DC background)
- **Typography**: Playfair Display font (hardcoded)
- **Spacing**: Consistent padding and margins
- **Animations**: Smooth transitions matching other sections
- **Shadows**: Subtle elevation with hover effects
- **Border Radius**: Rounded-3xl for modern look

## Usage Instructions

### For Admins (CMS):
1. Navigate to CMS Dashboard
2. Click "About Page Management"
3. Scroll to "Image Gallery Section"
4. Toggle "Enable Image Gallery Section" checkbox
5. Set section title and subtitle

#### Option 1: Upload Multiple Images at Once
6. Click "+ Upload Multiple" button
7. Select multiple image files (hold Ctrl/Cmd to select multiple)
8. All images upload automatically
9. Images are added to gallery with default settings
10. Edit alt text, captions, and order for each image
11. Click "Update Image Gallery" to save

#### Option 2: Add Images One by One
6. Click "+ Add Slot" to create an empty image slot
7. Click "Choose File" for that slot
8. Select a single image file
9. Image uploads automatically
10. Add alt text, caption, and order
11. Repeat for more images
12. Click "Update Image Gallery" to save

### Image Upload Process:
1. Click the file input for an image slot
2. Select an image file (JPG, PNG, WebP, GIF, SVG)
3. **Instant preview appears** while uploading
4. File uploads automatically to `/backend/uploads/`
5. Upload progress indicator shows status
6. Success message shows the uploaded path
7. Final preview appears with uploaded image
8. Image URL is stored in database
9. Click "Update Image Gallery" to save

### Supported Formats:
- JPEG/JPG
- PNG
- WebP
- GIF
- SVG

### File Size:
- Maximum: 100MB per image
- Recommended: 800x1000px (4:5 aspect ratio)
- Optimized images load faster

## Technical Details

### Upload Endpoint:
- **Single Upload**: `POST /backend/shreeweb-about/upload-gallery-image`
  - Method: POST (multipart/form-data)
  - Field Name: `galleryImage`
  - Response: `{ success: true, imageUrl: "/uploads/filename.jpg", filename: "..." }`

- **Multiple Upload**: `POST /backend/shreeweb-about/upload-multiple-gallery-images`
  - Method: POST (multipart/form-data)
  - Field Name: `galleryImages` (array)
  - Max Files: 10 per request
  - Response: `{ success: true, images: [{ url, filename, originalName }, ...] }`

- **Authentication**: Required (admin only) for both endpoints

### Grid Layout:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Gap: 1.5rem (24px)

### Image Container:
- Aspect ratio: 4:5 (portrait orientation)
- Object-fit: cover
- Hover scale: 110%
- Transition: 700ms

### Hover Effects:
- Image scales up smoothly
- Dark gradient overlay fades in
- Caption slides up from bottom
- All transitions: 500-700ms

### File Upload Flow:
1. User selects file in CMS
2. **Instant local preview** created using `URL.createObjectURL()`
3. Upload progress overlay shown on preview
4. `handleImageUpload` function triggered
5. FormData created with file
6. POST request to `/backend/shreeweb-about/upload-gallery-image`
7. Multer processes file and saves to disk
8. Controller returns image URL
9. Local preview replaced with server URL
10. Preview displayed with uploaded image
11. User clicks "Update Image Gallery" to persist to database

### Preview Features:
- **Instant Preview**: Shows selected image immediately before upload
- **Upload Progress**: Animated spinner overlay during upload
- **Error Handling**: Fallback UI if image fails to load
- **Aspect Ratio Info**: Shows recommended dimensions
- **Clean Preview Box**: Rounded corners with border
- **Responsive**: Scales to container width
- **Memory Management**: Automatic cleanup of preview URLs

## Example Configuration

```javascript
imageGallery: {
  enabled: true,
  title: "Experience the Journey",
  subtitle: "Moments of transformation and clarity",
  backgroundColor: "#EDE7DC",
  images: [
    {
      url: "/uploads/session-1-1234567890.jpg",
      alt: "Energy healing session in progress",
      caption: "Finding clarity through guided energy work",
      order: 1
    },
    {
      url: "/uploads/meditation-space-9876543210.jpg",
      alt: "Peaceful meditation space",
      caption: "A space designed for inner transformation",
      order: 2
    }
  ]
}
```

## Benefits

1. **Easy Upload**: Direct file upload, no need to manually copy URLs
2. **Automatic Processing**: Files are automatically renamed and stored
3. **Secure**: Only authenticated admins can upload
4. **Visual Feedback**: Immediate preview after upload
5. **Professional**: Polished design matches brand aesthetic
6. **Accessible**: Proper alt text for screen readers
7. **Responsive**: Works beautifully on all devices
8. **Flexible**: Support for multiple image formats

## Security Features

- Authentication required (admin only)
- File type validation (images only)
- File size limits (100MB max)
- Unique filename generation (prevents overwrites)
- Sanitized filenames (removes special characters)

## Next Steps

To populate the gallery:
1. Log into CMS Dashboard
2. Navigate to About Page Management
3. Scroll to Image Gallery Section
4. Click "+ Add Image"
5. Upload high-quality images
6. Add descriptive alt text and captions
7. Set display order
8. Click "Update Image Gallery"
9. View changes on the About page
