import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview, isEditorEmpty } from '../cmsRichTextUtils';
import VideoUploader from '../components/VideoUploader';

// Helper function to extract YouTube video ID from various URL formats
const extractYouTubeId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

// Helper function to generate embed URL from video ID
const generateEmbedUrl = (videoId, params = {}) => {
  if (!videoId) return '';
  
  const defaultParams = {
    autoplay: 1,
    mute: 1,
    loop: 1,
    playlist: videoId,
    controls: 1,
    showinfo: 0,
    rel: 0
  };
  
  const finalParams = { ...defaultParams, ...params };
  const paramString = Object.entries(finalParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
    
  return `https://www.youtube.com/embed/${videoId}?${paramString}`;
};

// Helper function to generate short URL from video ID
const generateShortUrl = (videoId) => {
  if (!videoId) return '';
  return `https://youtu.be/${videoId}`;
};

// Resolve backend URLs (same approach as `CmsHeroSection`)
const resolveUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`;
};

const isVideoFileUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return /\.(mp4|mov|avi|mkv|webm)(\?|#|$)/i.test(url.trim());
};

const defaultVideo = {
  videoImage: '',
  youtubeUrl: '',
  youtubeRedirectUrl: '',
  title: '',
  description: '',
  cta1Text: '',
  cta2Text: '',
  cta1Link: '/shreeweb/booking?plan=discovery',
  cta2Link: '/shreeweb/booking?plan=session',
  socialLinks: []
};

export default function CmsVideoSection() {
  const [form, setForm] = useState(defaultVideo);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    fetchVideoData();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/backend/shreeweb-auth/verify', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        setAuthStatus(result);
        console.log('Auth status:', result);
      } else {
        setAuthStatus({ success: false, message: 'Not authenticated' });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({ success: false, message: 'Auth check failed' });
    }
  };

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      console.log('CMS: Fetching video data from /backend/shreeweb-video-section');
      
      const response = await fetch('/backend/shreeweb-video-section');
      console.log('CMS: Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('CMS: API Response:', result);
        
        if (result.success && result.data) {
          console.log('CMS: Setting form data:', result.data);
          setForm(result.data);
        } else {
          console.warn('CMS: Invalid response format:', result);
        }
      } else {
        console.error('CMS: Failed to fetch video data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('CMS: Error fetching video data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateSocialLink = (index, field, value) => {
    const newLinks = [...form.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setForm((prev) => ({ ...prev, socialLinks: newLinks }));
    setSaved(false);
  };

  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: '', url: '' }]
    }));
    setSaved(false);
  };

  const removeSocialLink = (index) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
    setSaved(false);
  };

  const save = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await fetch('/backend/shreeweb-video-section', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        } else {
          throw new Error('Failed to save video section');
        }
      } else {
        throw new Error('Failed to save video section');
      }
    } catch (error) {
      console.error('Error saving video section:', error);
      alert('Failed to save video section. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <span className="ml-3 text-stone-600">Loading video section...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={save} className={cmsTheme.pageWrap}>
      {/* Authentication Status */}
      {authStatus && (
        <div className={`mb-4 p-3 rounded-lg ${
          authStatus.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              authStatus.success ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              authStatus.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {authStatus.success ? 'Authenticated' : 'Authentication Required'}
            </span>
          </div>
          {!authStatus.success && (
            <p className="text-xs text-red-600 mt-1">
              Please log in to upload images and save changes.
            </p>
          )}
        </div>
      )}
      
      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2">
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Video Content</h2>
          
          <VideoUploader
            value={form.videoImage}
            onChange={updateField('videoImage')}
            label="Background Video"
            accept="video/*"
          />
          
          <div>
            <label className={cmsTheme.label}>YouTube Video URL</label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
              className={cmsTheme.input}
              onChange={(e) => {
                const url = e.target.value;
                const videoId = extractYouTubeId(url);
                
                if (videoId) {
                  const embedUrl = generateEmbedUrl(videoId);
                  const shortUrl = generateShortUrl(videoId);
                  
                  updateField('youtubeUrl')(embedUrl);
                  updateField('youtubeRedirectUrl')(shortUrl);
                }
              }}
            />
            <p className="text-xs text-stone-500 mt-1">
              Paste any YouTube URL here and we'll automatically generate the embed and redirect URLs
            </p>
          </div>
          
          <div>
            <label className={cmsTheme.label}>YouTube Embed URL</label>
            <input
              type="url"
              value={form.youtubeUrl}
              onChange={(e) => updateField('youtubeUrl')(e.target.value)}
              placeholder="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1..."
              className={cmsTheme.input}
            />
            <p className="text-xs text-stone-500 mt-1">
              Full YouTube embed URL with parameters (autoplay, mute, loop, etc.)
            </p>
          </div>
          
          <div>
            <label className={cmsTheme.label}>YouTube Redirect URL</label>
            <input
              type="url"
              value={form.youtubeRedirectUrl}
              onChange={(e) => updateField('youtubeRedirectUrl')(e.target.value)}
              placeholder="https://youtu.be/VIDEO_ID"
              className={cmsTheme.input}
            />
            <p className="text-xs text-stone-500 mt-1">
              Short YouTube URL for when users click on the video overlay
            </p>
          </div>
          
          <CmsRichTextEditor
            label="Overlay Title"
            value={form.title}
            onChange={updateField('title')}
            placeholder="Your next level of success may require more than strategy."
            minHeight="md"
          />
          
          <CmsRichTextEditor
            label="Overlay Description"
            value={form.description}
            onChange={updateField('description')}
            placeholder="Through structured sessions using Pranic Healing..."
            minHeight="lg"
          />
        </div>

        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Call-to-Action Buttons</h2>
          
          <CmsRichTextEditor
            label="Primary CTA Text"
            value={form.cta1Text}
            onChange={updateField('cta1Text')}
            placeholder="Schedule a Discovery Call"
            minHeight="sm"
          />

          <CmsRichTextEditor
            label="Secondary CTA Text"
            value={form.cta2Text}
            onChange={updateField('cta2Text')}
            placeholder="Book a Session"
            minHeight="sm"
          />
        </div>
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`${cmsTheme.title} text-lg`}>Social Media Links</h2>
          <button
            type="button"
            onClick={addSocialLink}
            className={cmsTheme.btnGhost}
          >
            Add Link
          </button>
        </div>
        
        <div className="space-y-3">
          {form.socialLinks.map((link, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className={cmsTheme.label}>Platform Name</label>
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                  placeholder="Facebook"
                  className={cmsTheme.input}
                />
              </div>
              <div className="flex-1">
                <label className={cmsTheme.label}>URL</label>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className={cmsTheme.input}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button 
          type="submit" 
          disabled={saving}
          className={`${cmsTheme.btnPrimary} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Saving...' : 'Save Video Section'}
        </button>
        
        <button 
          type="button" 
          onClick={() => {
            fetchVideoData();
            checkAuthStatus();
          }}
          disabled={loading}
          className={`${cmsTheme.btnGhost} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
        
        {saved ? <span className="text-sm text-green-600">✅ Saved successfully!</span> : null}
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
          <p className="mt-1 text-sm text-stone-600">How the video section will appear on the site.</p>
        </div>
        <div className="p-6 bg-stone-50">
          {/* YouTube Video Preview */}
          {form.youtubeUrl ? (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-stone-700 mb-2">YouTube Video Preview</h3>
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={resolveUrl(form.youtubeUrl)}
                  title="YouTube Video Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Redirect URL: {form.youtubeRedirectUrl || 'Not set'}
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-stone-700 mb-2">YouTube Video Preview</h3>
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-stone-200 flex items-center justify-center">
                <div className="text-center text-stone-500">
                  <div className="w-12 h-12 mx-auto mb-3 bg-stone-300 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium">No YouTube video configured</p>
                  <p className="text-xs">Add a YouTube URL above to see preview</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Overlay Preview */}
          <div>
            <h3 className="text-sm font-medium text-stone-700 mb-2">Overlay Preview</h3>
            <div className="bg-black rounded-xl overflow-hidden aspect-video relative">
              {isVideoFileUrl(form.videoImage) ? (
                <video
                  src={resolveUrl(form.videoImage)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${resolveUrl(form.videoImage)})` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
                <div className="text-white max-w-2xl">
                  <CmsHtmlPreview 
                    html={form.title} 
                    className="text-2xl font-serif italic mb-4 leading-tight text-white" 
                  />
                  <CmsHtmlPreview 
                    html={form.description} 
                    className="text-sm mb-6 opacity-90 leading-relaxed text-white" 
                  />
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full text-white text-sm">
                      <CmsHtmlPreview html={form.cta1Text} />
                    </div>
                    <div className="px-4 py-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full text-white text-sm">
                      <CmsHtmlPreview html={form.cta2Text} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center space-x-6 text-sm text-stone-500">
            {form.socialLinks.map((link, index) => (
              <span key={index} className="font-serif">{link.name}</span>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}