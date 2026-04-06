import React, { useEffect, useMemo, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview } from '../cmsRichTextUtils';
import SingleImageUploader from '../components/ImageUploader';

const API_BASE = '/backend/shreeweb-hidden-cost-section';

const defaultHiddenCost = {
  title: 'The Hidden cost of high performance',
  paragraph1: 'Many successful professionals experience burnout, mental fatigue, and internal pressure despite strong strategies and discipline.',
  paragraph2: 'When your energetic system is misaligned, even the most perfect business strategy feels heavy. True expansion requires more than just mindset shifts—it requires energetic capacity.',
  image: '',
  imageAlt: 'Healing and wellness imagery',
  backgroundColor: 'white',
  textColor: 'stone-800'
};

export default function CmsHiddenCostSection() {
  const [form, setForm] = useState(defaultHiddenCost);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchHiddenCost();
  }, []);

  const resolveUrl = (url) => {
    if (!url || typeof url !== 'string') {
      console.log('resolveUrl: Empty or invalid URL:', url);
      return '';
    }
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      console.log('resolveUrl: Blob/Data URL, using as-is:', url);
      return url;
    }
    if (/^https?:\/\//i.test(url)) {
      console.log('resolveUrl: Full URL, using as-is:', url);
      return url;
    }
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    
    // Uploaded CMS assets live under `/uploads/...` (served by backend)
    if (url.startsWith('/uploads/')) {
      const resolved = `${backendUrl}${url}`;
      console.log('resolveUrl: Uploaded asset, resolved to:', resolved);
      return resolved;
    }
    
    // Frontend static assets like `/healing2.png` stay as-is
    console.log('resolveUrl: Static asset, using as-is:', url);
    return url;
  };

  const fetchHiddenCost = async () => {
    try {
      setSaved(false);
      const res = await fetch(`${API_BASE}`, { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success && data?.data) {
        setForm((f) => ({ ...f, ...data.data }));
      }
    } catch {
      // keep defaults
    }
  };

  const updateField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        const msg =
          data?.message ||
          data?.error ||
          data?.statusCode ||
          `Failed to save hidden cost section (HTTP ${res.status})`;
        // Useful in dev when alert isn't enough
        // eslint-disable-next-line no-console
        console.error('HiddenCost save failed:', { status: res.status, msg, data });
        alert(String(msg));
      }
    } catch (err) {
      alert(err?.message || 'Network error while saving');
    }
  };

  const backgroundColorMap = useMemo(
    () => ({
      white: '#ffffff',
      'stone-50': '#fbfbfb',
      'amber-50': '#fffbeb',
      'orange-50': '#fff7ed',
    }),
    []
  );

  return (
    <form onSubmit={save} className={cmsTheme.pageWrap}>
      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2">
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Content</h2>
          
          <CmsRichTextEditor
            label="Section Title"
            value={form.title}
            onChange={updateField('title')}
            placeholder="The Hidden cost of high performance"
            minHeight="sm"
          />
          
          <CmsRichTextEditor
            label="First Paragraph"
            value={form.paragraph1}
            onChange={updateField('paragraph1')}
            placeholder="Many successful professionals experience burnout..."
            minHeight="md"
          />
          
          <CmsRichTextEditor
            label="Second Paragraph"
            value={form.paragraph2}
            onChange={updateField('paragraph2')}
            placeholder="When your energetic system is misaligned..."
            minHeight="md"
          />
        </div>

        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Visual Settings</h2>
          
          <SingleImageUploader
            image={form.image}
            onChange={updateField('image')}
            label="Section Image"
            accept="image/*"
            uploadText="Upload Section Image"
            description="Click to browse or drag and drop your section image"
            recommendation="High-quality wellness/healing images • PNG, JPG, GIF"
            previewAlt="Section image preview"
            successMessage="Section image uploaded successfully"
            successDescription="This image will be displayed in the hidden cost section"
          />
          
          <div>
            <label className={cmsTheme.label}>Image Alt Text</label>
            <input
              type="text"
              value={form.imageAlt}
              onChange={(e) => updateField('imageAlt')(e.target.value)}
              placeholder="Healing and wellness imagery"
              className={cmsTheme.input}
            />
          </div>
          
          <div>
            <label className={cmsTheme.label}>Background Color</label>
            <select
              value={form.backgroundColor}
              onChange={(e) => updateField('backgroundColor')(e.target.value)}
              className={cmsTheme.input}
            >
              <option value="white">White</option>
              <option value="stone-50">Light Stone</option>
              <option value="amber-50">Light Amber</option>
              <option value="orange-50">Light Orange</option>
            </select>
          </div>
          
          <div>
            <label className={cmsTheme.label}>Text Color</label>
            <select
              value={form.textColor}
              onChange={(e) => updateField('textColor')(e.target.value)}
              className={cmsTheme.input}
            >
              <option value="stone-800">Dark Stone</option>
              <option value="stone-700">Medium Stone</option>
              <option value="stone-600">Light Stone</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={cmsTheme.btnPrimary}>
          Save Hidden Cost Section
        </button>
        {saved ? <span className="text-sm text-amber-800">Saved locally.</span> : null}
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
          <p className="mt-1 text-sm text-stone-600">How the hidden cost section will appear on the site.</p>
        </div>
        <div
          className="p-6"
          style={{ backgroundColor: backgroundColorMap[form.backgroundColor] || '#ffffff' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="border-t-2 border-stone-300 pt-4 mb-6">
                  <CmsHtmlPreview 
                    html={form.title} 
                    className="text-2xl font-serif text-stone-800 italic mb-4" 
                  />
                  <CmsHtmlPreview 
                    html={form.paragraph1} 
                    className={`text-stone-600 mb-3`} 
                  />
                  <CmsHtmlPreview 
                    html={form.paragraph2} 
                    className={`text-stone-600`} 
                  />
                </div>
              </div>
              <div className="relative">
                {form.image ? (
                  <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={resolveUrl(form.image)} 
                      alt={form.imageAlt} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', form.image, 'Resolved to:', resolveUrl(form.image));
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', resolveUrl(form.image));
                      }}
                    />
                    <div className="w-full h-64 bg-stone-200 rounded-2xl hidden items-center justify-center text-stone-500 text-sm">
                      Image failed to load
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-stone-100 flex items-center justify-center">
                    <div className="text-center text-stone-400">
                      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No image uploaded</p>
                      <p className="text-xs mt-1">Upload an image above to see preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}