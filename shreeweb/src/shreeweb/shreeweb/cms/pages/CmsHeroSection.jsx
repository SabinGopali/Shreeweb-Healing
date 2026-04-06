import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview, isEditorEmpty } from '../cmsRichTextUtils';
import SingleImageUploader from '../components/ImageUploader';
import VideoUploader from '../components/VideoUploader';
import Toast from '../components/Toast';

/* -------------------------------------------------------
   Helper: Resolve backend URLs (same as VideoUploader)
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

const defaultHero = {
  title: 'OMSHREEGUIDANCE',
  subtitle: 'Energetic alignment for sustainable expansion',
  ctaText: 'Begin Your Journey',
  backgroundType: 'image',
  backgroundImage: '/healing.webp',
  backgroundVideo: '',
  overlayOpacity: 20,
  titleSize: 'text-8xl md:text-9xl',
  titleColor: 'text-white',
  subtitleColor: 'text-white/80',
  ctaStyle: 'transparent', // transparent, gradient, solid
};

export default function CmsHeroSection() {
  const [form, setForm] = useState(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const API_BASE = '/backend/shreeweb-hero';

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hero data');
      }

      const data = await response.json();
      if (data.success && data.hero) {
        setForm(data.hero);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      setError('Failed to load hero section data');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setError('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save hero section');
      }

      const data = await response.json();
      if (data.success) {
        setSaved(true);
        setForm(data.hero);
        showToast('Hero section saved successfully!', 'success');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving hero data:', error);
      const errorMessage = error.message || 'Failed to save hero section';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (!window.confirm('Are you sure you want to reset the hero section to default values? This cannot be undone.')) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/reset`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset hero section');
      }

      const data = await response.json();
      if (data.success) {
        setForm(data.hero);
        setSaved(true);
        showToast('Hero section reset to defaults successfully!', 'success');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error resetting hero data:', error);
      const errorMessage = error.message || 'Failed to reset hero section';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Loading hero section...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
        duration={4000}
      />
      
      <form onSubmit={save} className={cmsTheme.pageWrap}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2">
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Hero Content</h2>
          
          <CmsRichTextEditor
            label="Main Title"
            value={form.title}
            onChange={updateField('title')}
            placeholder="OMSHREEGUIDANCE"
            minHeight="sm"
          />
          
          <CmsRichTextEditor
            label="Subtitle"
            value={form.subtitle}
            onChange={updateField('subtitle')}
            placeholder="Energetic alignment for sustainable expansion"
            minHeight="sm"
          />
          
          <CmsRichTextEditor
            label="CTA Button Text"
            value={form.ctaText}
            onChange={updateField('ctaText')}
            placeholder="Begin Your Journey"
            minHeight="sm"
          />
        </div>

        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Visual Settings</h2>
          
          <div>
            <label className={cmsTheme.label}>Background Type</label>
            <select
              value={form.backgroundType || 'image'}
              onChange={(e) => updateField('backgroundType')(e.target.value)}
              className={cmsTheme.input}
            >
              <option value="image">Image Background</option>
              <option value="video">Video Background</option>
            </select>
          </div>

          {form.backgroundType === 'image' ? (
            <SingleImageUploader
              image={form.backgroundImage}
              onChange={updateField('backgroundImage')}
              label="Background Image"
              accept="image/*"
              uploadText="Upload Background Image"
              description="Click to browse or drag and drop your hero background"
              recommendation="High-quality landscape images • PNG, JPG, GIF"
              previewAlt="Hero background preview"
              successMessage="Background image uploaded successfully"
              successDescription="This image will be used as the hero section background"
            />
          ) : (
            <VideoUploader
              value={form.backgroundVideo}
              onChange={updateField('backgroundVideo')}
              label="Background Video"
              accept="video/*"
              onToast={showToast}
            />
          )}
          
          <div>
            <label className={cmsTheme.label}>Overlay Opacity (%)</label>
            <input
              type="range"
              min="0"
              max="80"
              value={form.overlayOpacity}
              onChange={(e) => updateField('overlayOpacity')(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-stone-600">{form.overlayOpacity}%</span>
          </div>

          <div>
            <label className={cmsTheme.label}>Title Size</label>
            <select
              value={form.titleSize}
              onChange={(e) => updateField('titleSize')(e.target.value)}
              className={cmsTheme.input}
            >
              <option value="text-6xl md:text-7xl">Small</option>
              <option value="text-7xl md:text-8xl">Medium</option>
              <option value="text-8xl md:text-9xl">Large</option>
              <option value="text-9xl md:text-10xl">Extra Large</option>
            </select>
          </div>
          
          <div>
            <label className={cmsTheme.label}>CTA Button Style</label>
            <select
              value={form.ctaStyle}
              onChange={(e) => updateField('ctaStyle')(e.target.value)}
              className={cmsTheme.input}
            >
              <option value="transparent">Transparent with border</option>
              <option value="gradient">Orange gradient</option>
              <option value="solid">Solid color</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button 
          type="submit" 
          disabled={saving}
          className={`${cmsTheme.btnPrimary} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Saving...' : 'Save Hero Section'}
        </button>
        
        <button
          type="button"
          onClick={resetToDefaults}
          disabled={saving}
          className={`px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Reset to Defaults
        </button>
        
        {saved && <span className="text-sm text-green-600">✓ Saved successfully!</span>}
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
          <p className="mt-1 text-sm text-stone-600">How the hero section will appear on the site.</p>
        </div>
        <div className="p-6 bg-stone-50">
          <div 
            className="relative h-64 rounded-xl overflow-hidden flex items-center justify-center"
            style={form.backgroundType === 'image' ? {
              backgroundImage: `url(${resolveUrl(form.backgroundImage)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          >
            {form.backgroundType === 'video' && form.backgroundVideo ? (
              <>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  src={resolveUrl(form.backgroundVideo)}
                  onLoadStart={() => {
                    console.log('Preview video loading started:', resolveUrl(form.backgroundVideo));
                  }}
                  onLoadedData={() => {
                    console.log('Preview video loaded successfully:', resolveUrl(form.backgroundVideo));
                  }}
                  onError={(e) => {
                    console.error('Preview video load error:', resolveUrl(form.backgroundVideo));
                    console.error('Error details:', e);
                  }}
                />
              </>
            ) : form.backgroundType === 'video' && !form.backgroundVideo ? (
              <div className="absolute inset-0 bg-stone-300 flex items-center justify-center">
                <div className="text-center text-stone-600">
                  <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">No video selected</p>
                </div>
              </div>
            ) : null}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${form.overlayOpacity / 100})`, zIndex: 1 }}
            ></div>
            <div className="relative z-20 text-center">
              <CmsHtmlPreview 
                html={form.title} 
                className="text-4xl font-serif tracking-wider text-white drop-shadow-2xl mb-4" 
              />
              <CmsHtmlPreview 
                html={form.subtitle} 
                className="text-lg text-white/80 font-light tracking-wide mb-6" 
              />
              <div className={`inline-flex items-center px-6 py-2 rounded-full text-sm ${
                form.ctaStyle === 'transparent' ? 'border-2 border-white/40 text-white' :
                form.ctaStyle === 'gradient' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' :
                'bg-white text-stone-800'
              }`}>
                <CmsHtmlPreview html={form.ctaText} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    </>
  );
}