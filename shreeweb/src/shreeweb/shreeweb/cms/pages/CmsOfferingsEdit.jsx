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
    price: '',
    category: 'single',
    featured: false,
    features: [''],
    shopifyProductId: '',
    shopifyVariantId: '',
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
          price: offering.price || '',
          category: offering.category || 'single',
          featured: offering.featured || false,
          features: offering.features && offering.features.length > 0 ? offering.features : [''],
          shopifyProductId: offering.shopifyProductId || '',
          shopifyVariantId: offering.shopifyVariantId || '',
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
          features: form.features.filter(f => f.trim())
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
              Link this offering to a product in Shopify so booking opens the correct paid item. Find the numeric
              product ID in Shopify Admin → Products → product → URL or “API” section. Variant ID is only needed if
              the product has multiple variants.
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
                  placeholder="Numeric or gid://shopify/ProductVariant/…"
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