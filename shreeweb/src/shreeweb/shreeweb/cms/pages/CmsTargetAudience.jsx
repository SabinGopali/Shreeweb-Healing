import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview, isEditorEmpty } from '../cmsRichTextUtils';
const API_BASE = '/backend/shreeweb-target-audience-section';

function uid() {
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultAudience = {
  title: 'This work is designed for',
  subtitle: 'Individuals ready to address the energetic foundations of sustainable success',
  ctaQuote: 'Ready to explore what\'s possible when your energy and ambition are aligned?',
  ctaText: 'Start with a Discovery Call',
  audiences: [
    {
      id: uid(),
      title: 'Entrepreneurs & Business Owners',
      description: 'Leaders seeking to maintain high performance without sacrificing well-being',
      colorScheme: 'stone'
    },
    {
      id: uid(),
      title: 'Ambitious Professionals',
      description: 'High-achievers experiencing stress, burnout, or feeling stuck despite their efforts',
      colorScheme: 'amber'
    },
    {
      id: uid(),
      title: 'Growth & Transition Navigators',
      description: 'Individuals moving through periods of expansion or life transition',
      colorScheme: 'stone'
    },
    {
      id: uid(),
      title: 'Energetic Alignment Seekers',
      description: 'People interested in deeper energetic work and holistic approaches to success',
      colorScheme: 'orange'
    },
    {
      id: uid(),
      title: 'Clarity & Balance Seekers',
      description: 'People seeking greater clarity, stability, and internal balance to support their highest vision',
      colorScheme: 'amber',
      featured: true
    }
  ]
};

export default function CmsTargetAudience() {
  const [form, setForm] = useState(defaultAudience);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchAudience();
  }, []);

  const fetchAudience = async () => {
    try {
      const res = await fetch(API_BASE, { credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to fetch target audience (${res.status})`);
      const data = await res.json();
      if (data?.success && data?.data && typeof data.data === 'object') {
        setForm((prev) => ({ ...prev, ...data.data }));
      }
    } catch (error) {
      // keep defaults
    }
  };

  const updateField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateAudience = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      audiences: prev.audiences.map(audience => 
        audience.id === id ? { ...audience, [field]: value } : audience
      )
    }));
    setSaved(false);
  };

  const addAudience = () => {
    setForm((prev) => ({
      ...prev,
      audiences: [...prev.audiences, {
        id: uid(),
        title: '',
        description: '',
        colorScheme: 'stone',
        featured: false
      }]
    }));
    setSaved(false);
  };

  const removeAudience = (id) => {
    setForm((prev) => ({
      ...prev,
      audiences: prev.audiences.filter(audience => audience.id !== id)
    }));
    setSaved(false);
  };

  const save = (e) => {
    e.preventDefault();
    doSave();
  };

  const doSave = async () => {
    try {
      const res = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        const msg = data?.message || data?.error || `Failed to save (${res.status})`;
        alert(msg);
        return;
      }
      if (data?.data && typeof data.data === 'object') {
        setForm((prev) => ({ ...prev, ...data.data }));
      }
      setSaved(true);
    } catch (error) {
      alert('Failed to save target audience section');
    }
  };

  const colorOptions = [
    { value: 'stone', label: 'Stone (gray)' },
    { value: 'amber', label: 'Amber (yellow)' },
    { value: 'orange', label: 'Orange' }
  ];

  return (
    <form onSubmit={save} className={cmsTheme.pageWrap}>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Section Header</h2>
        
        <CmsRichTextEditor
          label="Main Title"
          value={form.title}
          onChange={updateField('title')}
          placeholder="This work is designed for"
          minHeight="sm"
        />
        
        <CmsRichTextEditor
          label="Subtitle"
          value={form.subtitle}
          onChange={updateField('subtitle')}
          placeholder="Individuals ready to address the energetic foundations..."
          minHeight="md"
        />
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Call-to-Action</h2>
        
        <CmsRichTextEditor
          label="CTA Quote"
          value={form.ctaQuote}
          onChange={updateField('ctaQuote')}
          placeholder="Ready to explore what's possible..."
          minHeight="md"
        />
        
        <CmsRichTextEditor
          label="CTA Button Text"
          value={form.ctaText}
          onChange={updateField('ctaText')}
          placeholder="Start with a Discovery Call"
          minHeight="sm"
        />
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`${cmsTheme.title} text-lg`}>Target Audiences ({form.audiences.length})</h2>
          <button
            type="button"
            onClick={addAudience}
            className={cmsTheme.btnGhost}
          >
            Add Audience
          </button>
        </div>
        
        <div className="space-y-6">
          {form.audiences.map((audience, index) => (
            <div key={audience.id} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-stone-600">Audience {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeAudience(audience.id)}
                  className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className={cmsTheme.label}>Title</label>
                  <input
                    type="text"
                    value={audience.title}
                    onChange={(e) => updateAudience(audience.id, 'title', e.target.value)}
                    placeholder="Entrepreneurs & Business Owners"
                    className={cmsTheme.input}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={cmsTheme.label}>Description</label>
                  <textarea
                    value={audience.description}
                    onChange={(e) => updateAudience(audience.id, 'description', e.target.value)}
                    placeholder="Leaders seeking to maintain high performance..."
                    className={`${cmsTheme.input} h-20 resize-none`}
                  />
                </div>
                <div>
                  <label className={cmsTheme.label}>Color Scheme</label>
                  <select
                    value={audience.colorScheme}
                    onChange={(e) => updateAudience(audience.id, 'colorScheme', e.target.value)}
                    className={cmsTheme.input}
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={audience.featured || false}
                        onChange={(e) => updateAudience(audience.id, 'featured', e.target.checked)}
                        className="rounded"
                      />
                      Featured (wider card)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={cmsTheme.btnPrimary}>
          Save Target Audience
        </button>
        {saved ? <span className="text-sm text-amber-800">Saved.</span> : null}
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
          <p className="mt-1 text-sm text-stone-600">How the target audience section will appear on the site.</p>
        </div>
        <div className="p-6 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <CmsHtmlPreview 
                html={form.title} 
                className="text-3xl font-serif text-stone-800 mb-4" 
              />
              <div className="w-32 h-0.5 bg-amber-400 mx-auto mb-6"></div>
              <CmsHtmlPreview 
                html={form.subtitle} 
                className="text-lg text-stone-600 max-w-3xl mx-auto" 
              />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {form.audiences.map((audience) => (
                <div 
                  key={audience.id} 
                  className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200/50 h-full flex flex-col ${
                    audience.featured ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                    audience.colorScheme === 'stone' ? 'bg-gradient-to-br from-stone-200 to-stone-300' :
                    audience.colorScheme === 'amber' ? 'bg-gradient-to-br from-amber-200 to-amber-300' :
                    'bg-gradient-to-br from-orange-200 to-orange-300'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg ${
                      audience.colorScheme === 'stone' ? 'bg-stone-600' :
                      audience.colorScheme === 'amber' ? 'bg-amber-600' :
                      'bg-orange-600'
                    }`}></div>
                  </div>
                  <h3 className="text-lg font-serif text-stone-800 text-center mb-3">
                    {audience.title}
                  </h3>
                  <p className="text-stone-600 text-center text-sm leading-relaxed flex-grow">
                    {audience.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200/50 max-w-3xl mx-auto">
                <CmsHtmlPreview 
                  html={form.ctaQuote} 
                  className="text-lg text-stone-700 mb-4 italic" 
                />
                <div className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white rounded-full font-semibold shadow-xl">
                  <CmsHtmlPreview html={isEditorEmpty(form.ctaText) ? 'Start with a Discovery Call' : form.ctaText} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}