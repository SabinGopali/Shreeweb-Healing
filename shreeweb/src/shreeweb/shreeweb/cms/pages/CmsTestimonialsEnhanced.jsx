import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';

const defaultSettings = {
  sectionTitle: 'What People Are Saying',
  sectionDescription: 'A few words from people who chose alignment for sustainable growth.',
  initialVisible: 3,
  loadMoreText: 'Load More Stories',
  backgroundColor: '#EDE7DC'
};

export default function CmsTestimonialsEnhanced() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(defaultSettings);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('/backend/shreeweb-testimonials-enhanced', { credentials: 'include' });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to fetch testimonials');
      }

      if (data?.data) {
        // Strip HTML tags from settings if they exist from previous rich text editor usage
        const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, '') : '';
        const cleanSettings = { ...defaultSettings };
        
        if (data.data.settings) {
          cleanSettings.sectionTitle = stripHtml(data.data.settings.sectionTitle) || defaultSettings.sectionTitle;
          cleanSettings.sectionDescription = stripHtml(data.data.settings.sectionDescription) || defaultSettings.sectionDescription;
          cleanSettings.initialVisible = data.data.settings.initialVisible || defaultSettings.initialVisible;
          cleanSettings.loadMoreText = data.data.settings.loadMoreText || defaultSettings.loadMoreText;
          cleanSettings.backgroundColor = data.data.settings.backgroundColor || defaultSettings.backgroundColor;
        }
        
        setSettings(cleanSettings);
        setTestimonials(Array.isArray(data.data.testimonials) ? data.data.testimonials : []);
      }
    } catch (e) {
      setError(e?.message || 'Failed to load testimonials enhanced');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key) => (value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      setSavingSettings(true);
      setError('');

      const res = await fetch('/backend/shreeweb-testimonials-enhanced/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settings }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to save testimonials settings');
      }

      setSettings((prev) => ({ ...prev, ...(data.data?.settings || {}) }));
    } catch (e) {
      setError(e?.message || 'Failed to save testimonials settings');
      alert(e?.message || 'Failed to save testimonials settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch(`/backend/shreeweb-testimonials-enhanced/testimonials/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to delete testimonial');
      }
      await fetchSection();
    } catch (e) {
      alert(e?.message || 'Failed to delete testimonial');
    }
  };

  // Swap order with adjacent testimonial for simple reordering.
  const moveTestimonial = async (id, direction) => {
    const currentIndex = testimonials.findIndex((r) => r.id === id);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0 || nextIndex >= testimonials.length) return;

    const a = testimonials[currentIndex];
    const b = testimonials[nextIndex];

    try {
      // Swap order fields.
      await Promise.all([
        fetch(`/backend/shreeweb-testimonials-enhanced/testimonials/${a.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ order: b.order }),
        }),
        fetch(`/backend/shreeweb-testimonials-enhanced/testimonials/${b.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ order: a.order }),
        }),
      ]);

      await fetchSection();
    } catch (e) {
      // Best-effort reorder.
      alert('Failed to reorder testimonial');
    }
  };

  const sortedTestimonials = useMemo(() => testimonials, [testimonials]);

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-600">Loading testimonials...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cmsTheme.pageWrap}>
      {error ? (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      ) : null}

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Section Settings</h2>
        
        <div>
          <label className={cmsTheme.label}>Section Title</label>
          <input
            type="text"
            value={settings.sectionTitle}
            onChange={(e) => updateSetting('sectionTitle')(e.target.value)}
            placeholder="What People Are Saying"
            className={cmsTheme.input}
          />
        </div>
        
        <div>
          <label className={cmsTheme.label}>Section Description</label>
          <textarea
            value={settings.sectionDescription}
            onChange={(e) => updateSetting('sectionDescription')(e.target.value)}
            placeholder="A few words from people who chose alignment..."
            rows={3}
            className={cmsTheme.input}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={cmsTheme.label}>Initially Visible</label>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.initialVisible}
              onChange={(e) => updateSetting('initialVisible')(Number(e.target.value))}
              className={cmsTheme.input}
            />
          </div>
          <div>
            <label className={cmsTheme.label}>Load More Button Text</label>
            <input
              type="text"
              value={settings.loadMoreText}
              onChange={(e) => updateSetting('loadMoreText')(e.target.value)}
              placeholder="Load More Stories"
              className={cmsTheme.input}
            />
          </div>
          <div>
            <label className={cmsTheme.label}>Background Color</label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => updateSetting('backgroundColor')(e.target.value)}
              className={cmsTheme.input}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveSettings}
            className={cmsTheme.btnGhost}
            disabled={savingSettings}
          >
            {savingSettings ? 'Saving...' : 'Save Section Settings'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/shreeweb/cms/testimonials-enhanced/add')}
            className={cmsTheme.btnPrimary}
          >
            + Add Testimonial
          </button>
        </div>
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className={`${cmsTheme.title} text-lg`}>
          Client quotes ({sortedTestimonials.length})
        </h2>
        <ul className="mt-4 space-y-4">
          {sortedTestimonials.length === 0 ? (
            <li className="text-sm text-stone-500">No testimonials yet.</li>
          ) : null}
          {sortedTestimonials.map((t, index) => {
            // Strip HTML tags for display
            const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, '') : '';
            
            return (
              <li key={t.id} className={`rounded-xl border border-stone-200 bg-white/80 p-4`}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-serif text-lg text-stone-900">{stripHtml(t.name)}</span>
                      {t.role && stripHtml(t.role) ? (
                        <span className="text-sm text-stone-600">
                          — {stripHtml(t.role)}
                        </span>
                      ) : null}
                      <div className="flex items-center gap-1 ml-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < (t.rating || 5) ? 'text-amber-500' : 'text-stone-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {t.quote && stripHtml(t.quote) ? (
                      <blockquote className="text-sm text-stone-700 italic border-l-2 border-amber-300 pl-3">
                        {stripHtml(t.quote)}
                      </blockquote>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveTestimonial(t.id, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTestimonial(t.id, 'down')}
                      disabled={index === sortedTestimonials.length - 1}
                      className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className={cmsTheme.btnGhost}
                      onClick={() => navigate(`/shreeweb/cms/testimonials-enhanced/edit/${t.id}`)}
                    >
                      Edit
                    </button>
                    <button type="button" className={cmsTheme.btnGhost} onClick={() => handleDelete(t.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
          <p className="mt-1 text-sm text-stone-600">How the testimonials section will appear on the site.</p>
        </div>
        <div className="p-6" style={{ backgroundColor: settings.backgroundColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-serif text-stone-800 mb-3">{settings.sectionTitle}</h3>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">{settings.sectionDescription}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {sortedTestimonials.slice(0, Math.min(3, settings.initialVisible)).map((t) => {
                const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, '') : '';
                
                return (
                  <article
                    key={t.id}
                    className="bg-white rounded-3xl p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-stone-800 text-white rounded-full flex items-center justify-center font-medium text-sm">
                        {stripHtml(t.name)?.slice(0, 1) || 'A'}
                      </div>
                      <div>
                        <div className="font-serif text-stone-800 text-sm">{stripHtml(t.name)}</div>
                        <div className="text-xs text-stone-600">{stripHtml(t.role)}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < (t.rating || 5) ? 'text-amber-500' : 'text-stone-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    
                    <blockquote className="text-stone-700 leading-relaxed italic text-sm">
                      "{stripHtml(t.quote)}"
                    </blockquote>
                  </article>
                );
              })}
            </div>

            {sortedTestimonials.length > settings.initialVisible && (
              <div className="mt-8 text-center">
                <div className="px-6 py-2 bg-stone-200 text-stone-800 rounded-full font-medium text-sm inline-block">
                  {settings.loadMoreText}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}