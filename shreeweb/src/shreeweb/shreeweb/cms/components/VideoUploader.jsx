import React, { useState, useRef, useEffect } from 'react';

/* -------------------------------------------------------
   Helper: Resolve backend URLs
-------------------------------------------------------- */
const resolveUrl = (url) => {
  if (!url) return '';
  
  // Blob URLs and data URLs - use as-is
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Full URLs - use as-is
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  
  // Relative paths - prepend backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`;
};

export default function VideoUploader({ value, onChange, label = "Video", accept = "video/*", onToast }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const blobUrlRef = useRef(null);

  /* -------------------------------------------------------
     Sync preview from value (EDIT MODE)
  -------------------------------------------------------- */
  useEffect(() => {
    // If we have a blob URL, don't override
    if (blobUrlRef.current) {
      return;
    }

    // Set preview from value (existing video from backend)
    if (value && typeof value === 'string' && value.trim()) {
      setPreview(resolveUrl(value.trim()));
    } else {
      setPreview('');
    }
  }, [value]);

  /* -------------------------------------------------------
     Cleanup blob URLs on unmount
  -------------------------------------------------------- */
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    if (!file.type.startsWith('video/')) {
      const errorMsg = 'Please select a valid video file';
      setError(errorMsg);
      if (onToast) {
        onToast(errorMsg, 'error');
      }
      return;
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      const errorMsg = 'Video file size must be less than 100MB';
      setError(errorMsg);
      if (onToast) {
        onToast(errorMsg, 'error');
      }
      return;
    }

    // Create blob preview immediately
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const blobUrl = URL.createObjectURL(file);
    blobUrlRef.current = blobUrl;
    setPreview(blobUrl);

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('pageCmsImage', file);

      console.log('Uploading video file:', file.name, 'Size:', file.size);

      const response = await fetch('/backend/shreeweb-cms/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (!response.ok) {
        throw new Error(data?.message || 'Upload failed');
      }

      const videoUrl = data.imageUrl || data.url;
      console.log('Video URL from backend:', videoUrl);

      if (!videoUrl) {
        throw new Error('No video URL returned from server');
      }

      // Cleanup blob URL
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }

      // Set the backend URL
      const resolvedUrl = resolveUrl(videoUrl);
      console.log('Resolved video URL:', resolvedUrl);
      
      setPreview(resolvedUrl);
      onChange(videoUrl); // Pass the relative URL to parent
      setError('');
      
      // Show success toast
      if (onToast) {
        onToast('Video uploaded successfully!', 'success');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error.message);
      
      if (onToast) {
        onToast(`Failed to upload video: ${error.message}`, 'error');
      }
      
      // Keep blob preview on error
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setPreview('');
    setError('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-medium text-stone-700">
        {label}
      </label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-stone-200 bg-black">
          <video
            key={preview} // Force re-render when src changes
            src={preview}
            controls
            className="w-full h-48 object-contain"
            style={{ maxHeight: '200px' }}
            onLoadStart={() => {
              console.log('Video loading started:', preview);
            }}
            onLoadedData={() => {
              console.log('Video loaded successfully:', preview);
            }}
            onError={(e) => {
              console.error('Video load error:', preview);
              console.error('Error details:', e);
              setError('Failed to load video preview');
            }}
          >
            Your browser does not support the video tag.
          </video>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            title="Remove video"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed border-stone-300 rounded-lg p-8 text-center transition-all ${
            uploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-stone-400 hover:bg-stone-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-stone-600">Uploading video...</p>
              <p className="text-xs text-stone-500">This may take a moment for large files</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">
                  Click to upload video
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  MP4, MOV, AVI, MKV, WEBM (Max 100MB)
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose Video
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 mt-1">
          Error: {error}
        </p>
      )}

      {preview && !error && (
        <p className="text-xs text-stone-500 mt-1">
          Video uploaded successfully
        </p>
      )}
    </div>
  );
}