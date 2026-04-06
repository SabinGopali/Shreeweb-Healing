/**
 * Image URL Resolution Utilities
 * 
 * These utilities ensure that images uploaded through the CMS are properly
 * resolved to include the backend URL, while leaving static assets and
 * external URLs unchanged.
 */

/**
 * Resolves an image URL to include the backend URL if needed
 * 
 * @param {string} url - The image URL to resolve
 * @returns {string} - The resolved URL
 * 
 * Behavior:
 * - Blob URLs (blob:) and data URLs (data:) are returned as-is
 * - Full HTTP/HTTPS URLs are returned as-is
 * - Relative paths starting with /uploads/ are prepended with backend URL
 * - Other relative paths are returned as-is (assumed to be static assets)
 */
export const resolveImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  // Blob URLs and data URLs - use as-is
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Full URLs - use as-is
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  
  // Uploaded CMS assets are under /uploads/ and should be fetched from backend
  if (url.startsWith('/uploads/')) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    return `${backendUrl}${url}`;
  }
  
  // Frontend static assets (e.g., /healing.webp) stay as-is
  return url;
};

/**
 * Resolves a video URL to include the backend URL if needed
 * Same logic as resolveImageUrl but specifically for video files
 * 
 * @param {string} url - The video URL to resolve
 * @returns {string} - The resolved URL
 */
export const resolveVideoUrl = (url) => {
  return resolveImageUrl(url); // Same logic applies
};

/**
 * Checks if a URL points to a video file based on extension
 * 
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL appears to be a video file
 */
export const isVideoFileUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return /\.(mp4|mov|avi|mkv|webm)(\?|#|$)/i.test(url.trim());
};

/**
 * Resolves any backend asset URL (images, videos, documents, etc.)
 * This is the most general-purpose resolver
 * 
 * @param {string} url - The asset URL to resolve
 * @returns {string} - The resolved URL
 */
export const resolveBackendUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
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
