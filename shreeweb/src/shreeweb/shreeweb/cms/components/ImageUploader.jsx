import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

/* -------------------------------------------------------
   Helper: Resolve backend image URLs
-------------------------------------------------------- */
const resolveImage = (image) => {
  if (!image) return '';
  
  // Blob URLs and data URLs - use as-is
  if (image.startsWith('blob:') || image.startsWith('data:')) {
    return image;
  }
  
  // Full URLs - use as-is
  if (/^https?:\/\//i.test(image)) {
    return image;
  }
  
  // Relative paths - prepend backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  return image.startsWith('/') ? `${backendUrl}${image}` : `${backendUrl}/${image}`;
};

/* -------------------------------------------------------
   ImageUploader Component
   Generic image uploader for ShreeWeb CMS
-------------------------------------------------------- */
export default function ImageUploader({
  image = '',
  onChange,
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  uploadText = 'Upload Image',
  description = 'Click to browse or drag and drop',
  recommendation = 'High-quality images • PNG, JPG, GIF',
  previewAlt = 'Image preview',
  successMessage = 'Image uploaded successfully',
  successDescription = 'This image will be displayed on the site',
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  /* -------------------------------------------------------
     Handle file selection
  -------------------------------------------------------- */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert(`File "${file.name}" is not a valid image`);
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      alert(`File "${file.name}" exceeds ${maxSize / 1024 / 1024}MB limit`);
      e.target.value = '';
      return;
    }

    // Upload file
    await uploadImage(file);
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /* -------------------------------------------------------
     Upload single image
  -------------------------------------------------------- */
  const uploadImage = async (file) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('pageCmsImage', file);

      console.log('Uploading file:', file.name, 'to /backend/shreeweb-cms/upload-image');
      console.log('Request details:', {
        method: 'POST',
        credentials: 'include',
        body: 'FormData with pageCmsImage field'
      });

      const response = await fetch('/backend/shreeweb-cms/upload-image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to the ShreeWeb CMS.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}`;
        let responseText = '';
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
          responseText = JSON.stringify(errorData);
        } catch (e) {
          // If response is not JSON, try to get text
          try {
            responseText = await response.text();
            errorMessage = responseText || response.statusText || errorMessage;
          } catch (textError) {
            errorMessage = response.statusText || errorMessage;
          }
        }
        console.error('Upload failed:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          responseText
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Upload response data:', data);
      
      if (data.success && data.imageUrl) {
        onChange?.(data.imageUrl);
        console.log('Successfully uploaded:', file.name, 'URL:', data.imageUrl);
      } else {
        throw new Error(data?.message || 'No image URL returned');
      }

    } catch (err) {
      console.error(`Error uploading ${file.name}:`, err);
      
      // Show user-friendly error messages
      if (err.message.includes('Authentication required')) {
        alert(`Upload failed: ${err.message}\n\nPlease make sure you're logged in to the ShreeWeb CMS.`);
      } else if (err.message.includes('Access denied')) {
        alert(`Upload failed: ${err.message}\n\nPlease contact an administrator for access.`);
      } else {
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  /* -------------------------------------------------------
     Remove image
  -------------------------------------------------------- */
  const handleRemove = () => {
    onChange?.('');
  };

  /* -------------------------------------------------------
     Drag and drop handlers
  -------------------------------------------------------- */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (uploading) return; // Prevent drop during upload

    const file = e.dataTransfer.files?.[0];
    
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert(`File "${file.name}" is not a valid image`);
      return;
    }

    if (file.size > maxSize) {
      alert(`File "${file.name}" exceeds ${maxSize / 1024 / 1024}MB limit`);
      return;
    }

    // Upload file
    await uploadImage(file);
  };

  /* -------------------------------------------------------
     Render
  -------------------------------------------------------- */
  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Current Image Display */}
      {image && (
        <div className="relative group mb-4">
          <div className="bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden">
            <img
              src={resolveImage(image)}
              alt={previewAlt}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                console.error('Image load error:', image);
                e.currentTarget.src = '/placeholder-product.svg';
              }}
            />
            
            {/* Image overlay with info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Image Preview</p>
                <p className="text-xs opacity-90">Click remove button to delete</p>
              </div>
            </div>
          </div>
          
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
            title="Remove image"
          >
            <X size={18} />
          </button>

          {/* Image details */}
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-green-700 font-medium">{successMessage}</p>
            </div>
            <p className="text-xs text-green-600 mt-1">{successDescription}</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          uploading 
            ? 'border-blue-300 bg-blue-50 cursor-not-allowed' 
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        
        <label
          htmlFor="image-upload"
          className={`flex flex-col items-center gap-4 ${
            uploading ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            uploading 
              ? 'bg-blue-100 animate-pulse' 
              : 'bg-gray-200 group-hover:bg-blue-200'
          }`}>
            <Upload className={`w-10 h-10 transition-colors duration-300 ${
              uploading ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-600'
            }`} />
          </div>
          
          <div>
            <p className={`text-lg font-semibold mb-2 ${
              uploading ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {uploading ? 'Uploading image...' : uploadText}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              {image ? 'Replace current image' : description}
            </p>
            <p className="text-xs text-gray-500">
              {recommendation} up to {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </label>

        {/* Upload progress indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-blue-50/80 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-medium text-blue-700">Processing image...</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-blue-700">Uploading image...</span>
              </div>
              <span className="text-xs text-blue-600">Please wait</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full animate-pulse rounded-full" />
            </div>
            <p className="text-xs text-blue-600 text-center mt-2">Processing and optimizing your image...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!image && !uploading && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">No image uploaded</p>
          <p className="text-xs text-gray-500">Upload an image to enhance your content</p>
        </div>
      )}
    </div>
  );
}