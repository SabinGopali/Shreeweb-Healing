import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview, isEditorEmpty } from '../cmsRichTextUtils';
const API_BASE = '/backend/shreeweb-email-capture-section';

function uid() {
  return `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultEmailCapture = {
  title: 'Stay Connected',
  description: 'Get updates when new sessions become available.',
  subtitle: 'No spam, just clarity.',
  buttonText: 'Stay Updated',
  placeholderText: 'your@email.com',
  backgroundColor: 'gradient-to-br from-stone-100 via-amber-50 to-orange-100',
  benefits: [
    {
      id: uid(),
      title: 'Early Access',
      description: 'Be the first to know about new session openings and special offerings',
      icon: 'clock'
    },
    {
      id: uid(),
      title: 'Insights & Tips',
      description: 'Receive practical guidance on energetic alignment and sustainable growth',
      icon: 'lightbulb'
    },
    {
      id: uid(),
      title: 'Curated Content',
      description: 'Thoughtfully selected resources to support your journey toward clarity',
      icon: 'heart'
    }
  ],
  bottomNote: 'Join a community focused on sustainable growth and energetic alignment'
};

export default function CmsEmailCapture() {
  const [form, setForm] = useState(defaultEmailCapture);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchEmailCapture();
  }, []);

  const fetchEmailCapture = async () => {
    try {
      const res = await fetch(API_BASE, { credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to fetch email capture (${res.status})`);
      const data = await res.json();
      if (data?.success && data?.data && typeof data.data === 'object') {
        setForm((prev) => ({ ...prev, ...data.data }));
      }
    } catch {
      // keep defaults
    }
  };

  const updateField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateBenefit = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.map(benefit => 
        benefit.id === id ? { ...benefit, [field]: value } : benefit
      )
    }));
    setSaved(false);
  };

  const addBenefit = () => {
    setForm((prev) => ({
      ...prev,
      benefits: [...prev.benefits, {
        id: uid(),
        title: '',
        description: '',
        icon: 'star'
      }]
    }));
    setSaved(false);
  };

  const removeBenefit = (id) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit.id !== id)
    }));
    setSaved(false);
  };

  const moveBenefit = (id, direction) => {
    const currentIndex = form.benefits.findIndex(benefit => benefit.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= form.benefits.length) return;
    
    const newBenefits = [...form.benefits];
    [newBenefits[currentIndex], newBenefits[newIndex]] = [newBenefits[newIndex], newBenefits[currentIndex]];
    
    setForm((prev) => ({ ...prev, benefits: newBenefits }));
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
    } catch {
      alert('Failed to save email capture section');
    }
  };

  const iconOptions = [
    { value: 'clock', label: 'Clock (Early Access)' },
    { value: 'lightbulb', label: 'Lightbulb (Ideas)' },
    { value: 'heart', label: 'Heart (Care)' },
    { value: 'star', label: 'Star (Quality)' },
    { value: 'shield', label: 'Shield (Protection)' },
    { value: 'gift', label: 'Gift (Benefits)' }
  ];

  const backgroundOptions = [
    { value: 'gradient-to-br from-stone-100 via-amber-50 to-orange-100', label: 'Stone to Orange Gradient' },
    { value: 'gradient-to-br from-amber-50 to-orange-100', label: 'Amber to Orange' },
    { value: 'stone-100', label: 'Light Stone' },
    { value: 'amber-50', label: 'Light Amber' },
    { value: 'orange-50', label: 'Light Orange' },
    { value: 'white', label: 'White' }
  ];

  return (
    <form onSubmit={save} className={cmsTheme.pageWrap}>
      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2">
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Section Content</h2>
          
          <CmsRichTextEditor
            label="Main Title"
            value={form.title}
            onChange={updateField('title')}
            placeholder="Stay Connected"
            minHeight="sm"
          />
          
          <CmsRichTextEditor
            label="Description"
            value={form.description}
            onChange={updateField('description')}
            placeholder="Get updates when new sessions become available."
            minHeight="md"
          />
          
          <CmsRichTextEditor
            label="Subtitle"
            value={form.subtitle}
            onChange={updateField('subtitle')}
            placeholder="No spam, just clarity."
            minHeight="sm"
          />
          
          <CmsRichTextEditor
            label="Bottom Note"
            value={form.bottomNote}
            onChange={updateField('bottomNote')}
            placeholder="Join a community focused on sustainable growth..."
            minHeight="md"
          />
        </div>

        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} min-w-0 space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Form Settings</h2>
          
          <CmsRichTextEditor
            label="Button Text"
            value={form.buttonText}
            onChange={updateField('buttonText')}
            placeholder="Stay Updated"
            minHeight="sm"
          />
          
          <div>
            <label className={cmsTheme.label}>Email Placeholder</label>
            <input
              type="text"
              value={form.placeholderText}
              onChange={(e) => updateField('placeholderText')(e.target.value)}
              placeholder="your@email.com"
              className={cmsTheme.input}
            />
          </div>
          
          <div>
            <label className={cmsTheme.label}>Background Style</label>
            <select
              value={form.backgroundColor}
              onChange={(e) => updateField('backgroundColor')(e.target.value)}
              className={cmsTheme.input}
            >
              {backgroundOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`${cmsTheme.title} text-lg`}>Benefits Section ({form.benefits.length})</h2>
          <button
            type="button"
            onClick={addBenefit}
            className={cmsTheme.btnGhost}
          >
            Add Benefit
          </button>
        </div>
        
        <div className="space-y-4">
          {form.benefits.map((benefit, index) => (
            <div key={benefit.id} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-stone-600">Benefit {index + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveBenefit(benefit.id, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBenefit(benefit.id, 'down')}
                    disabled={index === form.benefits.length - 1}
                    className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBenefit(benefit.id)}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={cmsTheme.label}>Icon</label>
                  <select
                    value={benefit.icon}
                    onChange={(e) => updateBenefit(benefit.id, 'icon', e.target.value)}
                    className={cmsTheme.input}
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cmsTheme.label}>Title</label>
                  <input
                    type="text"
                    value={benefit.title}
                    onChange={(e) => updateBenefit(benefit.id, 'title', e.target.value)}
                    placeholder="Early Access"
                    className={cmsTheme.input}
                  />
                </div>
                <div>
                  <label className={cmsTheme.label}>Description</label>
                  <textarea
                    value={benefit.description}
                    onChange={(e) => updateBenefit(benefit.id, 'description', e.target.value)}
                    placeholder="Be the first to know about new session openings..."
                    className={`${cmsTheme.input} h-20 resize-none`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={cmsTheme.btnPrimary}>
          Save Email Capture Section
        </button>
        {saved ? <span className="text-sm text-amber-800">Saved.</span> : null}
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
          <p className="mt-1 text-sm text-stone-600">How the email capture section will appear on the site.</p>
        </div>
        <div className={`p-6 bg-${form.backgroundColor} relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-12 left-12 w-36 h-36 border border-stone-400 rounded-full"></div>
            <div className="absolute bottom-12 right-12 w-24 h-24 border border-amber-400 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-orange-400 rounded-full"></div>
          </div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-stone-200 to-amber-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Heading */}
            <CmsHtmlPreview 
              html={form.title} 
              className="text-3xl font-serif text-stone-800 mb-4 leading-tight" 
            />
            
            {/* Decorative Line */}
            <div className="w-24 h-0.5 bg-amber-400 mx-auto mb-6"></div>
            
            {/* Description */}
            <CmsHtmlPreview 
              html={form.description} 
              className="text-lg text-stone-600 mb-2 leading-relaxed max-w-2xl mx-auto" 
            />
            <CmsHtmlPreview 
              html={form.subtitle} 
              className="font-medium text-stone-700 mb-8" 
            />
            
            {/* Email Form */}
            <div className="max-w-md mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder={form.placeholderText}
                  className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none"
                  disabled
                />
                <button
                  type="button"
                  className="rounded-full bg-orange-100 px-6 py-3 text-orange-800 font-medium whitespace-nowrap"
                  disabled
                >
                  <CmsHtmlPreview html={form.buttonText} />
                </button>
              </div>
            </div>
            
            {/* Benefits Section */}
            <div className="mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
                {form.benefits.map((benefit) => (
                  <div key={benefit.id} className="flex flex-col items-center group">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${
                      benefit.icon === 'clock' ? 'bg-stone-100 group-hover:bg-stone-200' :
                      benefit.icon === 'lightbulb' ? 'bg-amber-100 group-hover:bg-amber-200' :
                      benefit.icon === 'heart' ? 'bg-orange-100 group-hover:bg-orange-200' :
                      'bg-stone-100 group-hover:bg-stone-200'
                    }`}>
                      {benefit.icon === 'clock' && (
                        <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {benefit.icon === 'lightbulb' && (
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                      {benefit.icon === 'heart' && (
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                      {!['clock', 'lightbulb', 'heart'].includes(benefit.icon) && (
                        <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-lg font-serif text-stone-800 mb-2">{benefit.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bottom Note */}
            <div className="border-t border-stone-300/50 pt-6">
              <CmsHtmlPreview 
                html={form.bottomNote} 
                className="text-stone-500 italic leading-relaxed" 
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}