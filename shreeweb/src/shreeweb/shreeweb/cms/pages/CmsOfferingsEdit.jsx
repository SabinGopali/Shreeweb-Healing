import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';
import Toast from '../components/Toast';

export default function CmsOfferingsEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    duration: '',
    description: '',
    detailedDescription: '',
    whoIsThisFor: '',
    whatYouWillReceive: '',
    price: '',
    hasDiscount: false,
    originalPrice: '',
    discountedPrice: '',
    category: 'single',
    featured: false,
    features: [''],
    highlights: [''],
    outcomes: [''],
    shopifyProductId: '',
    shopifyVariantId: '',
    shopifyBuyButtonEmbed: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  useEffect(() => {
    fetchOffering();
  }, [id]);

  const fetchOffering = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/backend/shreeweb-offerings/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        throw new Error('Failed to fetch offering');
      }

      const data = await response.json();
      if (data.success && data.offering) {
        const offering = data.offering;
        setForm({
          title: offering.title || '',
          subtitle: offering.subtitle || '',
          duration: offering.duration || '',
          description: offering.description || '',
          detailedDescription: offering.detailedDescription || '',
          whoIsThisFor: offering.whoIsThisFor || '',
          whatYouWillReceive: offering.whatYouWillReceive || '',
          price: offering.price || '',
          hasDiscount: offering.hasDiscount || false,
          originalPrice: offering.originalPrice || '',
          discountedPrice: offering.discountedPrice || '',
          category: offering.category || 'single',
          featured: offering.featured || false,
          features: offering.features && offering.features.length > 0 ? offering.features : [''],
          highlights: offering.highlights && offering.highlights.length > 0 ? offering.highlights : [''],
          outcomes: offering.outcomes && offering.outcomes.length > 0 ? offering.outcomes : [''],
          shopifyProductId: offering.shopifyProductId || '',
          shopifyVariantId: offering.shopifyVariantId || '',
          shopifyBuyButtonEmbed: offering.shopifyBuyButtonEmbed || '',
        });
      }
    } catch (error) {
      console.error('Error fetching offering:', error);
      showToast('Failed to load offering', 'error');
    } finally {
      setLoading(false);
    }
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

  const addHighlight = () => {
    setForm(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const updateHighlight = (index, value) => {
    setForm(prev => ({
      ...prev,
      highlights: prev.highlights.map((highlight, i) => i === index ? value : highlight)
    }));
  };

  const removeHighlight = (index) => {
    setForm(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addOutcome = () => {
    setForm(prev => ({
      ...prev,
      outcomes: [...prev.outcomes, '']
    }));
  };

  const updateOutcome = (index, value) => {
    setForm(prev => ({
      ...prev,
      outcomes: prev.outcomes.map((outcome, i) => i === index ? value : outcome)
    }));
  };

  const removeOutcome = (index) => {
    setForm(prev => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index)
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
      const response = await fetch(`/backend/shreeweb-offerings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          features: form.features.filter(f => f.trim()),
          highlights: form.highlights.filter(h => h.trim()),
          outcomes: form.outcomes.filter(o => o.trim())
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update offering');
      }

      showToast('Offering updated successfully!', 'success');
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/shreeweb/cms/offerings');
      }, 1500);
      
    } catch (error) {
      console.error('Error updating offering:', error);
      showToast(error.message || 'Failed to update offering. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/shreeweb/cms/offerings');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this offering? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/backend/shreeweb-offerings/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete offering');
      }

      showToast('Offering deleted successfully', 'success');
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/shreeweb/cms/offerings');
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting offering:', error);
      showToast(error.message || 'Failed to delete offering', 'error');
    }
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Loading offering...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="text-center py-12">
          <h1 className={`${cmsTheme.title} text-2xl mb-4`}>Offering Not Found</h1>
          <p className="text-stone-600 mb-6">The offering you're looking for doesn't exist or may have been deleted.</p>
          <button
            onClick={handleCancel}
            className={cmsTheme.btnPrimary}
          >
            ← Back to Offerings
          </button>
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
      
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`${cmsTheme.title} text-2xl`}>Edit Offering</h1>
            <p className="text-sm text-stone-600 mt-1">Update your service offering details</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
            >
              Delete Offering
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={cmsTheme.btnGhost}
            >
              ← Back to Offerings
            </button>
          </div>
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
                <label className={cmsTheme.label}>Price (USD) *</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => updateField('price')(e.target.value)}
                  placeholder="e.g. $45 or Complimentary"
                  className={cmsTheme.input}
                />
                <p className="mt-1 text-xs text-stone-500">Regular price or display price</p>
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

            {/* Discount Pricing Section */}
            <div className="border-t border-stone-200 pt-4 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasDiscount"
                  checked={form.hasDiscount}
                  onChange={(e) => updateField('hasDiscount')(e.target.checked)}
                  className="rounded border-stone-300"
                />
                <label htmlFor="hasDiscount" className="text-sm font-medium text-stone-700">
                  Enable discount pricing
                </label>
              </div>

              {form.hasDiscount && (
                <div className="grid gap-4 md:grid-cols-2 bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div>
                    <label className={cmsTheme.label}>Original Price</label>
                    <input
                      type="text"
                      value={form.originalPrice}
                      onChange={(e) => updateField('originalPrice')(e.target.value)}
                      placeholder="e.g. $100"
                      className={cmsTheme.input}
                    />
                    <p className="mt-1 text-xs text-stone-500">Will be shown with strikethrough</p>
                  </div>
                  <div>
                    <label className={cmsTheme.label}>Discounted Price</label>
                    <input
                      type="text"
                      value={form.discountedPrice}
                      onChange={(e) => updateField('discountedPrice')(e.target.value)}
                      placeholder="e.g. $75"
                      className={cmsTheme.input}
                    />
                    <p className="mt-1 text-xs text-stone-500">Highlighted discount price</p>
                  </div>
                </div>
              )}
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
              <label className={cmsTheme.label}>Short Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description')(e.target.value)}
                placeholder="A brief overview that appears in the card preview"
                className={`${cmsTheme.input} h-24 resize-none`}
                rows={3}
                required
              />
              <p className="text-xs text-stone-500 mt-1">This appears in the compact card view</p>
            </div>

            <div>
              <label className={cmsTheme.label}>Detailed Description</label>
              <textarea
                value={form.detailedDescription}
                onChange={(e) => updateField('detailedDescription')(e.target.value)}
                placeholder="A more detailed explanation of what to expect from this offering"
                className={`${cmsTheme.input} h-32 resize-none`}
                rows={5}
              />
              <p className="text-xs text-stone-500 mt-1">Appears in the "What to Expect" section on the offers page</p>
            </div>

            <div>
              <label className={cmsTheme.label}>Who This Is For</label>
              <textarea
                value={form.whoIsThisFor}
                onChange={(e) => updateField('whoIsThisFor')(e.target.value)}
                placeholder="Describe the ideal client or situation for this offering"
                className={`${cmsTheme.input} h-32 resize-none`}
                rows={5}
              />
              <p className="text-xs text-stone-500 mt-1">Helps clients identify if this offering is right for them</p>
            </div>

            <div>
              <label className={cmsTheme.label}>What You'll Receive</label>
              <textarea
                value={form.whatYouWillReceive}
                onChange={(e) => updateField('whatYouWillReceive')(e.target.value)}
                placeholder="Detail what's included in this offering"
                className={`${cmsTheme.input} h-32 resize-none`}
                rows={5}
              />
              <p className="text-xs text-stone-500 mt-1">Specific deliverables and what clients can expect</p>
            </div>
          </div>

          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className={`${cmsTheme.title} text-lg`}>Key Benefits (Highlights)</h2>
              <button
                type="button"
                onClick={addHighlight}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                + Add Benefit
              </button>
            </div>
            <p className="text-sm text-stone-600">Main benefits or key points about this offering</p>
            
            {form.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => updateHighlight(index, e.target.value)}
                  placeholder="e.g., Immediate clarity and focus"
                  className={`${cmsTheme.input} flex-1`}
                />
                {form.highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className={`${cmsTheme.title} text-lg`}>Expected Outcomes</h2>
              <button
                type="button"
                onClick={addOutcome}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                + Add Outcome
              </button>
            </div>
            <p className="text-sm text-stone-600">Results clients can expect after completing this offering</p>
            
            {form.outcomes.map((outcome, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => updateOutcome(index, e.target.value)}
                  placeholder="e.g., Reduced stress and increased mental clarity"
                  className={`${cmsTheme.input} flex-1`}
                />
                {form.outcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOutcome(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
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
            <h2 className={`${cmsTheme.title} text-lg`}>Shopify Integration</h2>
            <p className="text-sm text-stone-600">
              Configure direct checkout for this offering. You need either the Product ID or Variant ID from Shopify.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">How to Find Your Shopify IDs:</h3>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Go to Shopify Admin → Products</li>
                <li>Click on your product</li>
                <li>Look at the URL: <code className="bg-blue-100 px-1 rounded">admin.shopify.com/products/12345678</code></li>
                <li>The number at the end is your Product ID</li>
                <li>For Variant ID, scroll down to Variants section and click on a variant to see its ID in the URL</li>
              </ol>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Shopify Product ID (Required)</label>
                <input
                  type="text"
                  value={form.shopifyProductId}
                  onChange={(e) => updateField('shopifyProductId')(e.target.value)}
                  placeholder="e.g. 8123456789012"
                  className={`${cmsTheme.input} font-mono text-sm`}
                />
                <p className="text-xs text-stone-500 mt-1">
                  Numeric ID from product URL
                </p>
              </div>
              <div>
                <label className={cmsTheme.label}>Shopify Variant ID (Optional)</label>
                <input
                  type="text"
                  value={form.shopifyVariantId}
                  onChange={(e) => updateField('shopifyVariantId')(e.target.value)}
                  placeholder="e.g. 44123456789012"
                  className={`${cmsTheme.input} font-mono text-sm`}
                />
                <p className="text-xs text-stone-500 mt-1">
                  Use if product has multiple variants
                </p>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4">
              <label className={cmsTheme.label}>Shopify Buy Button Embed Code (Optional)</label>
              <textarea
                value={form.shopifyBuyButtonEmbed}
                onChange={(e) => updateField('shopifyBuyButtonEmbed')(e.target.value)}
                placeholder='Optional: Paste Shopify Buy Button code here to extract domain automatically'
                className={`${cmsTheme.input} h-24 resize-none font-mono text-xs`}
                rows={4}
              />
              <p className="text-xs text-stone-500 mt-1">
                Only needed if your Shopify domain is different from the default. The domain will be extracted from this code.
              </p>
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
                  
                  {form.hasDiscount && form.originalPrice && form.discountedPrice ? (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-serif text-stone-500 line-through">
                          {form.originalPrice}
                        </span>
                        <span className="text-2xl font-serif text-amber-700 font-medium">
                          {form.discountedPrice}
                        </span>
                      </div>
                      <div className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full border border-amber-200">
                        Limited Time
                      </div>
                    </div>
                  ) : form.price && form.price.trim() ? (
                    <div className="text-2xl font-serif text-stone-800 mb-4 font-medium">
                      {form.price}
                    </div>
                  ) : null}

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
              {saving ? 'Saving...' : 'Update Offering'}
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
