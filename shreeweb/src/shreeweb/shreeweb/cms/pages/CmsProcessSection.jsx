import React, { useEffect, useState } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor from '../components/CmsRichTextEditor';
import { CmsHtmlPreview, isEditorEmpty } from '../cmsRichTextUtils';

const API_BASE = '/backend/shreeweb-process-section';

function uid() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultProcess = {
  title: 'Energetic Alignment for <em className="italic text-stone-600">Sustainable Expansion</em>',
  description: 'Sessions work deeply with your energetic system to cleanse, balance, and strengthen internal stability, allowing you to hold more success with less resistance.',
  steps: [
    {
      id: uid(),
      title: 'Scanning',
      description: 'Identifying energetic leaks and blockages in your field that are creating friction in your daily life.',
      icon: 'circle'
    },
    {
      id: uid(),
      title: 'Cleansing',
      description: 'Releasing stagnant energy and external pressures that no longer serve your highest vision.',
      icon: 'filled-circle'
    },
    {
      id: uid(),
      title: 'Balancing',
      description: 'Restoring harmony to your chakras, anchoring you back into a state of grounded power.',
      icon: 'grid'
    }
  ]
};

export default function CmsProcessSection() {
  const [form, setForm] = useState(defaultProcess);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProcess();
  }, []);

  const fetchProcess = async () => {
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

  const updateStep = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === id ? { ...step, [field]: value } : step
      )
    }));
    setSaved(false);
  };

  const addStep = () => {
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, {
        id: uid(),
        title: '',
        description: '',
        icon: 'circle'
      }]
    }));
    setSaved(false);
  };

  const removeStep = (id) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== id)
    }));
    setSaved(false);
  };

  const moveStep = (id, direction) => {
    const currentIndex = form.steps.findIndex(step => step.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= form.steps.length) return;
    
    const newSteps = [...form.steps];
    [newSteps[currentIndex], newSteps[newIndex]] = [newSteps[newIndex], newSteps[currentIndex]];
    
    setForm((prev) => ({ ...prev, steps: newSteps }));
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
        alert(data?.message || data?.error || `Failed to save process section (HTTP ${res.status})`);
      }
    } catch (err) {
      alert(err?.message || 'Network error while saving process section');
    }
  };

  const iconOptions = [
    { value: 'circle', label: 'Circle outline' },
    { value: 'filled-circle', label: 'Filled circle' },
    { value: 'grid', label: 'Grid pattern' },
    { value: 'square', label: 'Square' },
    { value: 'diamond', label: 'Diamond' }
  ];

  return (
    <form onSubmit={save} className={cmsTheme.pageWrap}>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Process Section Header</h2>
        
        <CmsRichTextEditor
          label="Section Title"
          value={form.title}
          onChange={updateField('title')}
          placeholder="Energetic Alignment for Sustainable Expansion"
          minHeight="md"
        />
        
        <CmsRichTextEditor
          label="Section Description"
          value={form.description}
          onChange={updateField('description')}
          placeholder="Sessions work deeply with your energetic system..."
          minHeight="lg"
        />
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`${cmsTheme.title} text-lg`}>Process Steps ({form.steps.length})</h2>
          <button
            type="button"
            onClick={addStep}
            className={cmsTheme.btnGhost}
          >
            Add Step
          </button>
        </div>
        
        <div className="space-y-6">
          {form.steps.map((step, index) => (
            <div key={step.id} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-stone-600">Step {index + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveStep(step.id, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(step.id, 'down')}
                    disabled={index === form.steps.length - 1}
                    className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={cmsTheme.label}>Icon Style</label>
                  <select
                    value={step.icon}
                    onChange={(e) => updateStep(step.id, 'icon', e.target.value)}
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
                  <label className={cmsTheme.label}>Step Title</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                    placeholder="Scanning"
                    className={cmsTheme.input}
                  />
                </div>
                <div>
                  <label className={cmsTheme.label}>Description</label>
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                    placeholder="Identifying energetic leaks and blockages..."
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
          Save Process Section
        </button>
        {saved ? <span className="text-sm text-amber-800">Saved.</span> : null}
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
          <p className="mt-1 text-sm text-stone-600">How the process section will appear on the site.</p>
        </div>
        <div className="p-6 bg-stone-50">
          <div className="max-w-4xl mx-auto text-center">
            <CmsHtmlPreview 
              html={form.title} 
              className="text-2xl font-serif text-stone-800 mb-4" 
            />
            <CmsHtmlPreview 
              html={form.description} 
              className="text-lg text-stone-600 mb-8" 
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              {form.steps.map((step, index) => (
                <div key={step.id} className="bg-[#EDE7DC] rounded-2xl p-6">
                  <div className="w-16 h-16 bg-stone-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {step.icon === 'circle' && <div className="w-8 h-8 border-2 border-stone-600 rounded-full"></div>}
                    {step.icon === 'filled-circle' && <div className="w-8 h-8 bg-stone-600 rounded-full"></div>}
                    {step.icon === 'grid' && (
                      <div className="grid grid-cols-2 gap-1 w-8 h-8">
                        <div className="bg-stone-600 rounded-sm"></div>
                        <div className="bg-stone-600 rounded-sm"></div>
                        <div className="bg-stone-600 rounded-sm"></div>
                        <div className="bg-stone-600 rounded-sm"></div>
                      </div>
                    )}
                    {step.icon === 'square' && <div className="w-8 h-8 bg-stone-600 rounded-lg"></div>}
                    {step.icon === 'diamond' && <div className="w-8 h-8 bg-stone-600 transform rotate-45"></div>}
                  </div>
                  <h3 className="text-xl font-serif text-stone-800 mb-3">{step.title}</h3>
                  <p className="text-stone-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}