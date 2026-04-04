import React, { useEffect, useMemo, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview } from '../cmsRichTextUtils';
import SingleImageUploader from '../components/ImageUploader';

const API_BASE = '/backend/shreeweb-growth-section';

function uid() {
  return `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultGrowth = {
  title: 'When growth begins to feel',
  subtitle: 'heavier than it should',
  introduction: 'Many entrepreneurs and high-performing professionals reach a stage where <span className="text-stone-800 font-normal"> effort alone stops creating the results they expect.</span>',
  description1: 'Often, these challenges are connected not only to mindset or strategy, but also to <span className="text-stone-700 font-medium"> imbalances within the energetic system.</span>',
  description2: 'When the energy body carries accumulated stress or blockages, it can affect emotional balance, decision making, resilience, and the ability to sustain growth.',
  signsTitle: 'Signs you may recognize',
  ctaText: 'If these resonate with you, energetic alignment may be the missing piece.',
  ctaButtonText: 'Explore a Discovery Call',
  backgroundImage: '/healing.webp',
  overlayOpacity: 70,
  signs: [
    {
      id: uid(),
      text: 'Persistent mental fatigue causing difficulty in decision making'
    },
    {
      id: uid(),
      text: 'Difficulty maintaining focus or clarity'
    },
    {
      id: uid(),
      text: 'Recurring stress or burnout cycles'
    },
    {
      id: uid(),
      text: 'Internal resistance when stepping into larger opportunities'
    },
    {
      id: uid(),
      text: 'The feeling that something deeper needs to shift',
      featured: true
    }
  ]
};

export default function CmsGrowthSection() {
  const [form, setForm] = useState(defaultGrowth);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchGrowth();
  }, []);

  const resolveUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    if (url.startsWith('/uploads/')) return `${backendUrl}${url}`;
    return url;
  };

  const fetchGrowth = async () => {
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

  const updateSign = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      signs: prev.signs.map(sign => 
        sign.id === id ? { ...sign, [field]: value } : sign
      )
    }));
    setSaved(false);
  };

  const addSign = () => {
    setForm((prev) => ({
      ...prev,
      signs: [...prev.signs, {
        id: uid(),
        text: '',
        featured: false
      }]
    }));
    setSaved(false);
  };

  const removeSign = (id) => {
    setForm((prev) => ({
      ...prev,
      signs: prev.signs.filter(sign => sign.id !== id)
    }));
    setSaved(false);
  };

  const moveSign = (id, direction) => {
    const currentIndex = form.signs.findIndex(sign => sign.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= form.signs.length) return;
    
    const newSigns = [...form.signs];
    [newSigns[currentIndex], newSigns[newIndex]] = [newSigns[newIndex], newSigns[currentIndex]];
    
    setForm((prev) => ({ ...prev, signs: newSigns }));
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
        alert(data?.message || data?.error || `Failed to save growth section (HTTP ${res.status})`);
      }
    } catch (err) {
      alert(err?.message || 'Network error while saving growth section');
    }
  };

  const overlayBg = useMemo(() => {
    const val = typeof form.overlayOpacity === 'number' ? form.overlayOpacity : 70;
    return `rgba(255,255,255,${val / 100})`;
  }, [form.overlayOpacity]);

  return (
    <form onSubmit={save} className={cmsTheme.pageWrap}>
      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2">
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Section Header</h2>
          
          <CmsRichTextEditor
            label="Main Title"
            value={form.title}
            onChange={updateField('title')}
            placeholder="When growth begins to feel"
            minHeight="sm"
          />
          
          <CmsRichTextEditor
            label="Subtitle"
            value={form.subtitle}
            onChange={updateField('subtitle')}
            placeholder="heavier than it should"
            minHeight="sm"
          />
          
          <CmsRichTextEditor
            label="Introduction"
            value={form.introduction}
            onChange={updateField('introduction')}
            placeholder="Many entrepreneurs and high-performing professionals..."
            minHeight="md"
          />
        </div>

        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Visual Settings</h2>
          
          <SingleImageUploader
            image={form.backgroundImage}
            onChange={updateField('backgroundImage')}
            label="Background Image"
            accept="image/*"
            uploadText="Upload Background Image"
            description="Click to browse or drag and drop your background image"
            recommendation="High-quality healing/meditation images • PNG, JPG, GIF"
            previewAlt="Background image preview"
            successMessage="Background image uploaded successfully"
            successDescription="This image will be used as the section background with overlay"
          />
          
          <div>
            <label className={cmsTheme.label}>Overlay Opacity (%)</label>
            <input
              type="range"
              min="0"
              max="90"
              value={form.overlayOpacity}
              onChange={(e) => updateField('overlayOpacity')(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-stone-600">{form.overlayOpacity}%</span>
          </div>
        </div>
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Description Content</h2>
        
        <CmsRichTextEditor
          label="First Description"
          value={form.description1}
          onChange={updateField('description1')}
          placeholder="Often, these challenges are connected..."
          minHeight="md"
        />
        
        <CmsRichTextEditor
          label="Second Description"
          value={form.description2}
          onChange={updateField('description2')}
          placeholder="When the energy body carries accumulated stress..."
          minHeight="md"
        />
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`${cmsTheme.title} text-lg`}>Signs Section</h2>
          <button
            type="button"
            onClick={addSign}
            className={cmsTheme.btnGhost}
          >
            Add Sign
          </button>
        </div>
        
        <CmsRichTextEditor
          label="Signs Section Title"
          value={form.signsTitle}
          onChange={updateField('signsTitle')}
          placeholder="Signs you may recognize"
          minHeight="sm"
        />
        
        <div className="space-y-4">
          {form.signs.map((sign, index) => (
            <div key={sign.id} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-stone-600">Sign {index + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveSign(sign.id, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSign(sign.id, 'down')}
                    disabled={index === form.signs.length - 1}
                    className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSign(sign.id)}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="grid gap-3 md:grid-cols-4">
                <div className="md:col-span-3">
                  <label className={cmsTheme.label}>Sign Text</label>
                  <textarea
                    value={sign.text}
                    onChange={(e) => updateSign(sign.id, 'text', e.target.value)}
                    placeholder="Persistent mental fatigue causing difficulty..."
                    className={`${cmsTheme.input} h-20 resize-none`}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={sign.featured || false}
                      onChange={(e) => updateSign(sign.id, 'featured', e.target.checked)}
                      className="rounded"
                    />
                    Featured (highlighted)
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Call-to-Action</h2>
        
        <CmsRichTextEditor
          label="CTA Text"
          value={form.ctaText}
          onChange={updateField('ctaText')}
          placeholder="If these resonate with you, energetic alignment may be the missing piece."
          minHeight="md"
        />
        
        <CmsRichTextEditor
          label="CTA Button Text"
          value={form.ctaButtonText}
          onChange={updateField('ctaButtonText')}
          placeholder="Explore a Discovery Call"
          minHeight="sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={cmsTheme.btnPrimary}>
          Save Growth Section
        </button>
        {saved ? <span className="text-sm text-amber-800">Saved.</span> : null}
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
          <p className="mt-1 text-sm text-stone-600">How the growth section will appear on the site.</p>
        </div>
        <div 
          className="p-6 relative min-h-96 flex items-center"
          style={{
            backgroundImage: `url(${resolveUrl(form.backgroundImage)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: overlayBg }}
          ></div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center space-y-8">
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-xl">
                <CmsHtmlPreview 
                  html={form.title} 
                  className="text-2xl font-light text-stone-800 leading-relaxed tracking-wide" 
                />
                <CmsHtmlPreview 
                  html={form.subtitle} 
                  className="block text-stone-600 italic font-extralight mt-2 text-xl" 
                />
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg max-w-3xl mx-auto">
                <CmsHtmlPreview 
                  html={form.introduction} 
                  className="text-lg text-stone-700 leading-relaxed font-light mb-4" 
                />
                <CmsHtmlPreview 
                  html={form.description1} 
                  className="text-base text-stone-600 leading-relaxed mb-4" 
                />
                <CmsHtmlPreview 
                  html={form.description2} 
                  className="text-base text-stone-600 leading-relaxed" 
                />
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/25 shadow-2xl">
                <h3 className="text-lg font-light text-stone-700 mb-8 tracking-wide">
                  {form.signsTitle}
                </h3>
                
                <div className="space-y-4 max-w-2xl mx-auto">
                  {form.signs.map((sign) => (
                    <div 
                      key={sign.id} 
                      className={`flex items-start space-x-3 p-4 rounded-2xl transition-all duration-500 shadow-lg ${
                        sign.featured 
                          ? 'bg-gradient-to-r from-white/25 to-orange-100/30 border border-orange-200/40' 
                          : 'bg-white/20 border border-white/30'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 shadow-md ${
                        sign.featured 
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500' 
                          : 'bg-gradient-to-br from-orange-300 to-orange-400'
                      }`}></div>
                      <span className={`leading-relaxed font-light ${
                        sign.featured ? 'text-stone-800 font-normal text-center w-full' : 'text-stone-700'
                      }`}>
                        {sign.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/25 shadow-2xl">
                <CmsHtmlPreview 
                  html={form.ctaText} 
                  className="text-stone-600 italic font-light leading-relaxed text-lg mb-6" 
                />
                <div className="inline-flex items-center px-8 py-3 bg-white/30 backdrop-blur-md border border-white/40 text-stone-700 rounded-full font-light tracking-wide shadow-xl">
                  <CmsHtmlPreview html={form.ctaButtonText} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}