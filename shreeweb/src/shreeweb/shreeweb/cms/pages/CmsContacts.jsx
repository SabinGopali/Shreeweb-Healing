import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';
import SingleImageUploader from '../components/ImageUploader';

export default function CmsContacts() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const defaultPageContent = {
    isActive: true,
    logo: {
      text: 'OMSHREEGUIDANCE',
      subtext: 'Energetic Alignment',
      letter: 'J',
    },
    hero: {
      tag: 'CONTACT',
      title: "We'd love to hear from you",
      description: "Send a message and we'll get back to you as soon as possible.",
    },
    form: { heading: 'Send us a message' },
    connect: {
      heading: 'Other ways to connect',
      description:
        'Prefer a direct message? Connect with us on social media or reach out through the contact details below.',
    },
    location: {
      line1: 'Kathmandu, Nepal',
      line2: '(Online sessions available worldwide)',
    },
    contactInfo: { email: 'info@OMSHREEGUIDANCE.example', phone: '+977-98XXXXXXXX' },
    follow: {
      description: 'Stay connected and get updates on our latest offerings and insights.',
      socials: {
        facebookUrl: '#',
        instagramUrl: '#',
        tiktokUrl: '#',
        youtubeUrl: '#',
      },
    },
    callToAction: {
      heading: 'Ready to start your journey?',
      description:
        "Book a complimentary Discovery Call to explore what's possible for you.",
      buttonText: 'Schedule Discovery Call',
      buttonLink: '/shreeweb/booking?plan=discovery',
    },
  };

  const [pageContentLoading, setPageContentLoading] = useState(true);
  const [pageContentSaving, setPageContentSaving] = useState(false);
  const [pageContent, setPageContent] = useState(defaultPageContent);
  const [pageContentError, setPageContentError] = useState('');
  const [pageContentSuccess, setPageContentSuccess] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.phone, r.subject, r.message]
        .map((x) => String(x || '').toLowerCase())
        .some((s) => s.includes(q))
    );
  }, [rows, query]);

  const fetchContacts = async () => {
    try {
      setErrorMessage('');
      setLoading(true);

      const searchTerm = query.trim();
      const res = await fetch(
        `/backend/contact/getall?searchTerm=${encodeURIComponent(searchTerm)}&sort=createdAt&order=desc`,
        { credentials: 'include' }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to fetch contact messages');
      }

      setRows(Array.isArray(data.contacts) ? data.contacts : []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setErrorMessage(err?.message || 'Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce requests so fast typing doesn't spam the server
    const t = window.setTimeout(() => {
      fetchContacts();
    }, 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setPageContentError('');
        setPageContentSuccess('');
        setPageContentLoading(true);

        const res = await fetch('/backend/shreeweb-contact-page', {
          credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message || 'Failed to load contact page content');
        }
        if (data?.success && data?.contactPageContent) {
          setPageContent(data.contactPageContent);
        }
      } catch (err) {
        console.error('Failed to load contact page content:', err);
        setPageContentError(err?.message || 'Failed to load contact page content');
      } finally {
        setPageContentLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  const updateField = (path, value) => {
    setPageContent((prev) => {
      const next = { ...prev };
      const keys = path.split('.');
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        current[k] = { ...(current[k] || {}) };
        current = current[k];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSavePageContent = async (e) => {
    if (e) e.preventDefault();
    try {
      setPageContentSaving(true);
      setPageContentError('');
      setPageContentSuccess('');

      const res = await fetch('/backend/shreeweb-contact-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(pageContent),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to save contact page content');
      }

      setPageContentSuccess('Contact page content saved successfully!');
    } catch (err) {
      console.error('Error saving contact page content:', err);
      setPageContentError(err?.message || 'Failed to save contact page content');
    } finally {
      setPageContentSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      setSubmitting(true);
      const res = await fetch(`/backend/contact/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to delete message');
      await fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
      setErrorMessage(err?.message || 'Failed to delete message');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, nextStatus) => {
    try {
      setSubmitting(true);
      const res = await fetch(`/backend/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to update status');
      await fetchContacts();
    } catch (err) {
      console.error('Error updating contact status:', err);
      setErrorMessage(err?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cmsTheme.pageWrap}>
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <p className="text-sm text-stone-600">
          Review and manage messages sent from the public{' '}
          <Link
            to="/contact"
            className="font-medium text-amber-900 underline decoration-amber-400/70 hover:text-stone-900"
          >
            Contact
          </Link>
          page.
        </p>
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full`}>
        <h2 className={`${cmsTheme.title} text-lg`}>Contact Page Content</h2>

        {pageContentError ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {pageContentError}
          </div>
        ) : null}

        {pageContentSuccess ? (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {pageContentSuccess}
          </div>
        ) : null}

        <form onSubmit={handleSavePageContent} className="mt-4 space-y-6">
          {/* Logo Section */}
          <div className="border-b border-stone-200 pb-6">
            <h3 className="text-base font-medium text-stone-800 mb-4">Logo Settings</h3>
            
            <SingleImageUploader
              image={pageContent.logo?.imageUrl || ''}
              onChange={(url) => updateField('logo.imageUrl', url)}
              label="Logo Image"
              accept="image/*"
              uploadText="Upload Logo Image"
              description="Click to browse or drag and drop your logo"
              recommendation="High-quality logo images • PNG, JPG, GIF, SVG"
              previewAlt="Contact page logo preview"
              successMessage="Logo uploaded successfully"
              successDescription="This logo will be displayed on the contact page"
            />
            <p className="text-xs text-stone-500 mt-2">If no image is uploaded, the logo text below will be displayed.</p>

            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <div>
                <label className={cmsTheme.label}>Logo Text (Fallback)</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.logo?.text || ''}
                  onChange={(e) => updateField('logo.text', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                  placeholder="OMSHREEGUIDANCE"
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Logo Subtext</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.logo?.subtext || ''}
                  onChange={(e) => updateField('logo.subtext', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                  placeholder="Energetic Alignment"
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Logo Letter</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.logo?.letter || ''}
                  onChange={(e) => updateField('logo.letter', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                  placeholder="J"
                  maxLength="1"
                />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="border-b border-stone-200 pb-6">
            <h3 className="text-base font-medium text-stone-800 mb-4">Hero Section</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Hero Tag</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.hero.tag}
                  onChange={(e) => updateField('hero.tag', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Hero Title</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.hero.title}
                  onChange={(e) => updateField('hero.title', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={cmsTheme.label}>Hero Description</label>
              <textarea
                className={`${cmsTheme.input} h-28 resize-none`}
                value={pageContent.hero.description}
                onChange={(e) => updateField('hero.description', e.target.value)}
                disabled={pageContentLoading || pageContentSaving}
              />
            </div>
          </div>

          {/* Form & Connect Section */}
          <div className="border-b border-stone-200 pb-6">
            <h3 className="text-base font-medium text-stone-800 mb-4">Form & Connect Settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Form Heading</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.form.heading}
                  onChange={(e) => updateField('form.heading', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Connect Heading</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.connect.heading}
                  onChange={(e) => updateField('connect.heading', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={cmsTheme.label}>Connect Description</label>
              <textarea
                className={`${cmsTheme.input} h-24 resize-none`}
                value={pageContent.connect.description}
                onChange={(e) => updateField('connect.description', e.target.value)}
                disabled={pageContentLoading || pageContentSaving}
              />
            </div>
          </div>

          {/* Location & Contact Info */}
          <div className="border-b border-stone-200 pb-6">
            <h3 className="text-base font-medium text-stone-800 mb-4">Location & Contact Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Location Line 1</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.location.line1}
                  onChange={(e) => updateField('location.line1', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Location Line 2</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.location.line2}
                  onChange={(e) => updateField('location.line2', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <label className={cmsTheme.label}>Contact Email</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.contactInfo.email}
                  onChange={(e) => updateField('contactInfo.email', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Contact Phone</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.contactInfo.phone}
                  onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="border-b border-stone-200 pb-6">
            <h3 className="text-base font-medium text-stone-800 mb-4">Social Media Settings</h3>
            <div className="mb-4">
              <label className={cmsTheme.label}>Follow Us Description</label>
              <textarea
                className={`${cmsTheme.input} h-24 resize-none`}
                value={pageContent.follow.description}
                onChange={(e) => updateField('follow.description', e.target.value)}
                disabled={pageContentLoading || pageContentSaving}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Facebook URL</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.follow.socials.facebookUrl}
                  onChange={(e) => updateField('follow.socials.facebookUrl', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Instagram URL</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.follow.socials.instagramUrl}
                  onChange={(e) => updateField('follow.socials.instagramUrl', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>TikTok URL</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.follow.socials.tiktokUrl}
                  onChange={(e) => updateField('follow.socials.tiktokUrl', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>YouTube URL</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.follow.socials.youtubeUrl}
                  onChange={(e) => updateField('follow.socials.youtubeUrl', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pb-6">
            <h3 className="text-base font-medium text-stone-800 mb-4">Call to Action Section</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>CTA Heading</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.callToAction.heading}
                  onChange={(e) => updateField('callToAction.heading', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>CTA Button Text</label>
                <input
                  className={cmsTheme.input}
                  value={pageContent.callToAction.buttonText}
                  onChange={(e) => updateField('callToAction.buttonText', e.target.value)}
                  disabled={pageContentLoading || pageContentSaving}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={cmsTheme.label}>CTA Description</label>
              <textarea
                className={`${cmsTheme.input} h-24 resize-none`}
                value={pageContent.callToAction.description}
                onChange={(e) => updateField('callToAction.description', e.target.value)}
                disabled={pageContentLoading || pageContentSaving}
              />
            </div>

            <div className="mt-4">
              <label className={cmsTheme.label}>CTA Button Link</label>
              <input
                className={cmsTheme.input}
                value={pageContent.callToAction.buttonLink}
                onChange={(e) => updateField('callToAction.buttonLink', e.target.value)}
                disabled={pageContentLoading || pageContentSaving}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={pageContentLoading || pageContentSaving}
              className={`${cmsTheme.btnPrimary} ${pageContentSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {pageContentSaving ? 'Saving...' : 'Save Contact Content'}
            </button>
          </div>
        </form>
      </div>

      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} flex w-full flex-col gap-3 sm:flex-row sm:items-end`}>
        <div className="min-w-0 flex-1">
          <label className={cmsTheme.label}>Search</label>
          <input
            className={cmsTheme.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, email, phone, subject, message"
          />
        </div>
        <button type="button" className={cmsTheme.btnGhost} onClick={fetchContacts} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        {errorMessage ? (
          <div className="px-4 py-3 border-b border-stone-200 bg-red-50 text-red-700 text-sm">{errorMessage}</div>
        ) : null}

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-100/80 text-xs font-semibold uppercase tracking-wider text-stone-600">
              <tr>
                <th className="w-[14%] px-3 py-3">Received</th>
                <th className="w-[14%] px-3 py-3">Name</th>
                <th className="w-[18%] px-3 py-3">Email</th>
                <th className="w-[12%] px-3 py-3">Phone</th>
                <th className="w-[12%] px-3 py-3">Subject</th>
                <th className="px-3 py-3">Message</th>
                <th className="w-[17%] px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-stone-600">
                    <p>Loading messages...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-stone-600">
                    <p className="font-medium text-stone-800">No contact messages found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id} className="border-b border-stone-100 align-top hover:bg-white/80">
                    <td className="px-3 py-3 text-xs text-stone-500 whitespace-nowrap">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-3 py-3 font-medium break-words text-stone-900">{r.name || '—'}</td>
                    <td className="px-3 py-3 break-all text-stone-700">{r.email || '—'}</td>
                    <td className="px-3 py-3 break-words text-stone-600">{r.phone || '—'}</td>
                    <td className="px-3 py-3 break-words text-stone-700">{r.subject || '—'}</td>
                    <td className="px-3 py-3 break-words text-sm text-stone-600">{r.message || '—'}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className={`${cmsTheme.btnGhost} !px-2 !py-1 text-xs`}
                          onClick={() => updateStatus(r._id, 'read')}
                          disabled={submitting}
                        >
                          Read
                        </button>
                        <button
                          type="button"
                          className={`${cmsTheme.btnGhost} !px-2 !py-1 text-xs`}
                          onClick={() => updateStatus(r._id, 'archived')}
                          disabled={submitting}
                        >
                          Archive
                        </button>
                        <button
                          type="button"
                          className={`${cmsTheme.btnGhost} !px-2 !py-1 text-xs`}
                          onClick={() => remove(r._id)}
                          disabled={submitting}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
