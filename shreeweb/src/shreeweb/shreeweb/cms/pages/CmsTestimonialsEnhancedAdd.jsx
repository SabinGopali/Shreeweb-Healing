import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsTestimonialsEnhancedAdd() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!quote.trim()) {
      alert('Quote is required');
      return;
    }

    const safeName = name.trim() || 'Client';
    const safeRole = role.trim();
    const safeRating = Math.max(1, Math.min(5, Number(rating) || 5));

    try {
      setSaving(true);
      const res = await fetch('/backend/shreeweb-testimonials-enhanced/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: safeName,
          role: safeRole,
          quote: quote.trim(),
          rating: safeRating,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to save testimonial');
      }

      navigate('/shreeweb/cms/testimonials-enhanced');
    } catch (err) {
      alert(err?.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={cmsTheme.pageWrap}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${cmsTheme.title} text-2xl`}>Add Testimonial</h1>
          <p className="text-sm text-stone-600 mt-1">Create a new client quote with rating.</p>
        </div>
        <button type="button" onClick={() => navigate('/shreeweb/cms/testimonials-enhanced')} className={cmsTheme.btnGhost}>
          ← Back
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
          <h2 className={`${cmsTheme.title} text-lg`}>Testimonial Content</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={cmsTheme.label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                className={cmsTheme.input}
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Entrepreneur"
                className={cmsTheme.input}
              />
            </div>
          </div>

          <div>
            <label className={cmsTheme.label}>Rating (1-5 stars)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className={cmsTheme.input}
            >
              <option value={5}>5 stars</option>
              <option value={4}>4 stars</option>
              <option value={3}>3 stars</option>
              <option value={2}>2 stars</option>
              <option value={1}>1 star</option>
            </select>
          </div>

          <div>
            <label className={cmsTheme.label}>Quote</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="The session felt calm and deeply focused..."
              rows={4}
              className={cmsTheme.input}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className={cmsTheme.btnPrimary} disabled={saving}>
              {saving ? 'Saving...' : 'Save Testimonial'}
            </button>
            <button type="button" className={cmsTheme.btnGhost} onClick={() => navigate('/shreeweb/cms/testimonials-enhanced')}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

