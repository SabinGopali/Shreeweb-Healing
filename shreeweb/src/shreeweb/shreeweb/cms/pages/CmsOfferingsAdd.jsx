import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';
import Toast from '../components/Toast';

export default function CmsOfferingsAdd() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    duration: '',
    description: '',
    price: '',
    category: 'single',
    featured: false,
    features: [''],
    shopifyProductId: '',
    shopifyVariantId: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const updateField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addFeature = () => {
    setForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      showToast('Please enter a title for the offering', 'error');
      return;
    }

    if (!form.description.trim()) {
      showToast('Please enter a description for the offering', 'error');
      return;
    }

    setSaving(true);
    
    try {
      const response = await fetch('/backend/shreeweb-offerings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          features: form.features.filter(f => f.trim())
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create offering');
      }

      showToast('Offering created successfully!', 'success');
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/shreeweb/cms/offerings');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving offering:', error);
      showToast(error.message || 'Failed to save offering. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/shreeweb/cms/offerings');
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
        duration={4000}
      />
      
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`${cmsTheme.title} text-2xl`}>Add New Offering</h1>
            <p className="text-sm text-stone-600 mt-1">Create a new service offering for your wellness practice</p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className={cmsTheme.btnGhost}
          >
            ← Back to Offerings
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <h2 className={`${cmsTheme.title} text-lg`}>Basic Information</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title')(e.target.value)}
                  placeholder="e.g. Discovery Call"
                  className={cmsTheme.input}
                  required
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => updateField('subtitle')(e.target.value)}
                  placeholder="e.g. Introductory"
                  className={cmsTheme.input}
                />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className={cmsTheme.label}>Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => updateField('duration')(e.target.value)}
                  placeholder="e.g. 45 Min"
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Price (USD)</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => updateField('price')(e.target.value)}
                  placeholder="e.g. $45 or Complimentary"
                  className={cmsTheme.input}
                />
                <p className="mt-1 text-xs text-stone-500">All amounts are in US dollars (USD).</p>
              </div>
              <div>
                <label className={cmsTheme.label}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category')(e.target.value)}
                  className={cmsTheme.input}
                >
                  <option value="introductory">Introductory</option>
                  <option value="single">Single Session</option>
                  <option value="recurring">Recurring Sessions</option>
                  <option value="program">Program</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => updateField('featured')(e.target.checked)}
                className="rounded border-stone-300"
              />
              <label htmlFor="featured" className="text-sm font-medium text-stone-700">
                Featured offering
              </label>
            </div>
          </div>

          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <h2 className={`${cmsTheme.title} text-lg`}>Description</h2>
            
            <div>
              <label className={cmsTheme.label}>Full Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description')(e.target.value)}
                placeholder="A complimentary session to explore your current energetic landscape and discuss a customized plan for you."
                className={`${cmsTheme.input} h-32 resize-none`}
                rows={4}
                required
              />
            </div>
          </div>

          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className={`${cmsTheme.title} text-lg`}>Features</h2>
              <button
                type="button"
                onClick={addFeature}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                + Add Feature
              </button>
            </div>
            
            {form.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Feature description"
                  className={`${cmsTheme.input} flex-1`}
                />
                {form.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <h2 className={`${cmsTheme.title} text-lg`}>Shopify checkout</h2>
            <p className="text-sm text-stone-600">
              Optional: set the Shopify product (and variant if needed) so this offering checks out with the correct
              line item and price.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Shopify product ID</label>
                <input
                  type="text"
                  value={form.shopifyProductId}
                  onChange={(e) => updateField('shopifyProductId')(e.target.value)}
                  placeholder="e.g. 8123456789012"
                  className={`${cmsTheme.input} font-mono text-sm`}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Shopify variant ID (optional)</label>
                <input
                  type="text"
                  value={form.shopifyVariantId}
                  onChange={(e) => updateField('shopifyVariantId')(e.target.value)}
                  placeholder="Numeric or gid://…"
                  className={`${cmsTheme.input} font-mono text-sm`}
                />
              </div>
            </div>
          </div>

          <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
            <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
              <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
              <p className="mt-1 text-sm text-stone-600">How this offering will appear on the site.</p>
            </div>
            <div className="p-6 bg-stone-50">
              <div className="max-w-sm mx-auto">
                <article className="rounded-3xl p-6 shadow-sm bg-white border border-stone-200">
                  {form.subtitle && form.subtitle.trim() && (
                    <div className="text-sm font-medium text-stone-600 mb-2 tracking-wide uppercase">
                      {form.subtitle}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-serif text-stone-800 mb-2 italic leading-tight">
                    {form.title || 'Offering Title'}
                  </h3>
                  
                  {form.duration && form.duration.trim() && (
                    <div className="text-sm text-stone-600 mb-4 font-medium">
                      {form.duration}
                    </div>
                  )}
                  
                  {form.description && form.description.trim() && (
                    <p className="text-sm text-stone-700 mb-6 leading-relaxed">
                      {form.description}
                    </p>
                  )}
                  
                  {form.price && form.price.trim() && (
                    <div className="text-2xl font-serif text-stone-800 mb-4 font-medium">
                      {form.price}
                    </div>
                  )}

                  <div className="inline-flex w-full items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800">
                    Book Now
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`${cmsTheme.btnPrimary} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Saving...' : 'Save Offering'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={cmsTheme.btnGhost}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}