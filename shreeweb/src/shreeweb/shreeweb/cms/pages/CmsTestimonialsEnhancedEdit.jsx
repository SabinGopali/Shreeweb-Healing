import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsTestimonialsEnhancedEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchTestimonial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/backend/shreeweb-testimonials-enhanced/testimonials/${id}`, {
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        throw new Error(data?.message || 'Failed to fetch testimonial');
      }

      if (data?.testimonial) {
        // Strip HTML tags if they exist from previous rich text editor usage
        const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, '') : '';
        
        setName(stripHtml(data.testimonial.name) || '');
        setRole(stripHtml(data.testimonial.role) || '');
        setQuote(stripHtml(data.testimonial.quote) || '');
        setRating(Number.isFinite(Number(data.testimonial.rating)) ? Number(data.testimonial.rating) : 5);
      }
    } catch (e) {
      alert(e?.message || 'Failed to load testimonial');
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!quote.trim()) {
      alert('Quote is required');
      return;
    }

    const safeRating = Math.max(1, Math.min(5, Number(rating) || 5));

    try {
      setSaving(true);
      const res = await fetch(`/backend/shreeweb-testimonials-enhanced/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim(),
          quote: quote.trim(),
          rating: safeRating,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to update testimonial');
      }

      navigate('/shreeweb/cms/testimonials-enhanced');
    } catch (err) {
      alert(err?.message || 'Failed to update testimonial');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-600">Loading testimonial...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="text-center py-12">
          <h1 className={`${cmsTheme.title} text-2xl mb-4`}>Testimonial Not Found</h1>
          <p className="text-stone-600 mb-6">The testimonial you're trying to edit doesn't exist.</p>
          <button type="button" onClick={() => navigate('/shreeweb/cms/testimonials-enhanced')} className={cmsTheme.btnPrimary}>
            ← Back to Testimonials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cmsTheme.pageWrap}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${cmsTheme.title} text-2xl`}>Edit Testimonial</h1>
          <p className="text-sm text-stone-600 mt-1">Update the quote and rating.</p>
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
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className={cmsTheme.input}>
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
              placeholder="Update the quote..."
              rows={4}
              className={cmsTheme.input}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className={cmsTheme.btnPrimary} disabled={saving}>
              {saving ? 'Saving...' : 'Update Testimonial'}
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

