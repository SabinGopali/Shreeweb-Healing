import React, { useState, useEffect } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import Toast from '../components/Toast';

export default function CmsClaritySection() {
  const [form, setForm] = useState({
    title: 'Restore clarity.',
    subtitle: 'Expand naturally.',
    description: 'Take the first step towards untangling the energetic knots holding you back. Let\'s explore what\'s possible when you are fully aligned.',
    buttonText: 'Book a Discovery Call'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  useEffect(() => {
    fetchClaritySection();
  }, []);

  const fetchClaritySection = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/backend/shreeweb-clarity-section/', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clarity section data');
      }

      const data = await response.json();
      if (data.success && data.claritySection) {
        setForm(data.claritySection);
      }
    } catch (error) {
      console.error('Error fetching clarity section:', error);
      showToast('Failed to load clarity section data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }

    if (!form.description.trim()) {
      showToast('Please enter a description', 'error');
      return;
    }

    setSaving(true);
    
    try {
      const response = await fetch('/backend/shreeweb-clarity-section/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save clarity section');
      }

      showToast('Clarity section saved successfully!', 'success');
      
    } catch (error) {
      console.error('Error saving clarity section:', error);
      showToast(error.message || 'Failed to save clarity section. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset to default values? This will overwrite all current settings.')) {
      return;
    }

    try {
      const response = await fetch('/backend/shreeweb-clarity-section/reset', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset clarity section');
      }

      setForm(data.claritySection);
      showToast('Clarity section reset to defaults successfully', 'success');
      
    } catch (error) {
      console.error('Error resetting clarity section:', error);
      showToast(error.message || 'Failed to reset clarity section', 'error');
    }
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Loading clarity section...</p>
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
      
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`${cmsTheme.title} text-2xl`}>Clarity Section</h1>
            <p className="text-sm text-stone-600 mt-1">Manage the call-to-action section that encourages visitors to book a discovery call</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg border border-stone-200"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <h2 className={`${cmsTheme.title} text-lg`}>Content</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title')(e.target.value)}
                  placeholder="Restore clarity."
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
                  placeholder="Expand naturally."
                  className={cmsTheme.input}
                />
              </div>
            </div>
            
            <div>
              <label className={cmsTheme.label}>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description')(e.target.value)}
                placeholder="Take the first step towards untangling the energetic knots holding you back. Let's explore what's possible when you are fully aligned."
                className={`${cmsTheme.input} h-24 resize-none`}
                rows={3}
                required
              />
            </div>

            <div>
              <label className={cmsTheme.label}>Button Text *</label>
              <input
                type="text"
                value={form.buttonText}
                onChange={(e) => updateField('buttonText')(e.target.value)}
                placeholder="Book a Discovery Call"
                className={cmsTheme.input}
                required
              />
            </div>
          </div>

          <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
            <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
              <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
              <p className="mt-1 text-sm text-stone-600">How this section will appear on the site.</p>
            </div>
            <div className="p-6" style={{ backgroundColor: '#f8f9fa' }}>
              <div 
                className="rounded-2xl p-8 text-center"
                style={{ 
                  backgroundColor: '#F4EFE6',
                  color: '#1C1917'
                }}
              >
                <h2 className="text-3xl font-serif mb-2" style={{ color: '#1C1917' }}>
                  {form.title || 'Restore clarity.'}
                </h2>
                {form.subtitle && (
                  <h3 className="text-xl font-serif mb-6 opacity-80" style={{ color: '#1C1917' }}>
                    {form.subtitle}
                  </h3>
                )}
                <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#1C1917' }}>
                  {form.description || 'Take the first step towards untangling the energetic knots holding you back. Let\'s explore what\'s possible when you are fully aligned.'}
                </p>
                <button
                  className="inline-flex items-center px-8 py-4 rounded-full font-medium text-lg transition-all hover:shadow-lg"
                  style={{ 
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF'
                  }}
                >
                  {form.buttonText || 'Book a Discovery Call'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`${cmsTheme.btnPrimary} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}