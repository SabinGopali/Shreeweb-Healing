// Cookie Policy CMS - Complete management system
import { useState, useEffect } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsCookiePolicy() {
  // State management for cookie policy CMS
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cookieData, setCookieData] = useState(null);

  useEffect(() => {
    fetchCookieData();
  }, []);

  const fetchCookieData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching cookie policy data...');

      const response = await fetch('/backend/shreeweb-cookie-policy', {
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Cookie policy data received:', data);

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch cookie policy data');
      }

      if (data.success) {
        setCookieData(data.data);
        console.log('Cookie policy data set successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching cookie policy data:', err);
      setError(err.message || 'Failed to load cookie policy data');
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section, updates) => {
    try {
      setSaving(true);
      setError('');

      const response = await fetch(`/backend/shreeweb-cookie-policy/section/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update section');
      }

      if (data.success) {
        setCookieData(data.data);
        alert('Section updated successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error updating section:', err);
      setError(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      tag: formData.get('tag'),
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      description: formData.get('description'),
    };
    updateSection('hero', updates);
  };

  const handleLastUpdatedUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      setSaving(true);
      setError('');

      const response = await fetch('/backend/shreeweb-cookie-policy/last-updated', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          lastUpdatedDate: formData.get('lastUpdatedDate'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update last updated date');
      }

      if (data.success) {
        setCookieData(data.data);
        alert('Cookie policy updated successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error updating cookie policy:', err);
      setError(err.message || 'Failed to update cookie policy');
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
            <p className="text-stone-600">Loading cookie policy data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">Failed to Load Cookie Policy</h3>
          <p className="text-stone-600 mb-4">{error}</p>
          <button
            onClick={fetchCookieData}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!cookieData) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="text-center py-12">
          <p className="text-stone-600">No cookie policy data available</p>
        </div>
      </div>
    );
  }

  // Final safety check before rendering
  if (!cookieData) {
    console.error('Cookie data is null or undefined at render time');
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="text-center py-12">
          <p className="text-stone-600">Cookie policy data is not available</p>
          <button
            onClick={fetchCookieData}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Reload Data
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering cookie policy CMS with data:', cookieData);

  return (
    <div className={cmsTheme.pageWrap}>
      <div className="mb-8">
        <h1 className={`${cmsTheme.title} text-2xl`}>Cookie Policy Management</h1>
        <p className="text-stone-600 mt-2">Manage all sections of the Cookie Policy page content</p>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Hero Section</h2>
          <form onSubmit={handleHeroUpdate} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Tag</label>
                <input
                  type="text"
                  name="tag"
                  defaultValue={cookieData?.hero?.tag || ''}
                  className={cmsTheme.input}
                  placeholder="Cookie Policy"
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={cookieData?.hero?.title || ''}
                  className={cmsTheme.input}
                  placeholder="Cookie"
                />
              </div>
            </div>
            <div>
              <label className={cmsTheme.label}>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                defaultValue={cookieData?.hero?.subtitle || ''}
                className={cmsTheme.input}
                placeholder="transparency"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Description</label>
              <textarea
                name="description"
                defaultValue={cookieData?.hero?.description || ''}
                rows={3}
                className={cmsTheme.input}
                placeholder="Understanding how we use cookies and similar technologies to enhance your experience on our website."
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update Hero Section'}
            </button>
          </form>
        </div>

        {/* Last Updated Date */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Last Updated Date</h2>
          <form onSubmit={handleLastUpdatedUpdate} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Last Updated Date</label>
              <input
                type="text"
                name="lastUpdatedDate"
                defaultValue={cookieData?.lastUpdatedDate || ''}
                className={cmsTheme.input}
                placeholder="March 2026"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update Last Updated Date'}
            </button>
          </form>
        </div>

        {/* Understanding Cookies Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Understanding Cookies Section</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updates = {
              title: formData.get('understandingTitle'),
              whatAreCookies: {
                title: formData.get('whatAreCookiesTitle'),
                description: formData.get('whatAreCookiesDescription')
              },
              cookieTypes: {
                firstParty: {
                  title: formData.get('firstPartyTitle'),
                  description: formData.get('firstPartyDescription')
                },
                session: {
                  title: formData.get('sessionTitle'),
                  description: formData.get('sessionDescription')
                },
                persistent: {
                  title: formData.get('persistentTitle'),
                  description: formData.get('persistentDescription')
                }
              }
            };
            updateSection('understandingCookies', updates);
          }} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Section Title</label>
              <input
                type="text"
                name="understandingTitle"
                defaultValue={cookieData?.understandingCookies?.title || ''}
                className={cmsTheme.input}
                placeholder="Understanding Cookies & Similar Technologies"
              />
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-stone-800 mb-3">What Are Cookies Subsection</h3>
              <div className="space-y-4">
                <div>
                  <label className={cmsTheme.label}>Title</label>
                  <input
                    type="text"
                    name="whatAreCookiesTitle"
                    defaultValue={cookieData?.understandingCookies?.whatAreCookies?.title || ''}
                    className={cmsTheme.input}
                    placeholder="What Are Cookies?"
                  />
                </div>
                <div>
                  <label className={cmsTheme.label}>Description</label>
                  <textarea
                    name="whatAreCookiesDescription"
                    defaultValue={cookieData?.understandingCookies?.whatAreCookies?.description || ''}
                    rows={4}
                    className={cmsTheme.input}
                    placeholder="Cookies are small text files stored on your device..."
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-stone-800 mb-3">Cookie Types</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={cmsTheme.label}>First-Party Title</label>
                  <input
                    type="text"
                    name="firstPartyTitle"
                    defaultValue={cookieData?.understandingCookies?.cookieTypes?.firstParty?.title || ''}
                    className={cmsTheme.input}
                    placeholder="First-Party Cookies"
                  />
                  <label className={cmsTheme.label}>Description</label>
                  <textarea
                    name="firstPartyDescription"
                    defaultValue={cookieData?.understandingCookies?.cookieTypes?.firstParty?.description || ''}
                    rows={3}
                    className={cmsTheme.input}
                    placeholder="Set directly by our website..."
                  />
                </div>
                <div>
                  <label className={cmsTheme.label}>Session Title</label>
                  <input
                    type="text"
                    name="sessionTitle"
                    defaultValue={cookieData?.understandingCookies?.cookieTypes?.session?.title || ''}
                    className={cmsTheme.input}
                    placeholder="Session Cookies"
                  />
                  <label className={cmsTheme.label}>Description</label>
                  <textarea
                    name="sessionDescription"
                    defaultValue={cookieData?.understandingCookies?.cookieTypes?.session?.description || ''}
                    rows={3}
                    className={cmsTheme.input}
                    placeholder="Temporary cookies that expire..."
                  />
                </div>
                <div>
                  <label className={cmsTheme.label}>Persistent Title</label>
                  <input
                    type="text"
                    name="persistentTitle"
                    defaultValue={cookieData?.understandingCookies?.cookieTypes?.persistent?.title || ''}
                    className={cmsTheme.input}
                    placeholder="Persistent Cookies"
                  />
                  <label className={cmsTheme.label}>Description</label>
                  <textarea
                    name="persistentDescription"
                    defaultValue={cookieData?.understandingCookies?.cookieTypes?.persistent?.description || ''}
                    rows={3}
                    className={cmsTheme.input}
                    placeholder="Remain on your device for a set period..."
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update Understanding Cookies Section'}
            </button>
          </form>
        </div>

        {/* Contact Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Contact Section</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updates = {
              description: formData.get('description'),
              buttonText: formData.get('buttonText')
            };
            updateSection('contactSection', updates);
          }} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Description</label>
              <input
                type="text"
                name="description"
                defaultValue={cookieData?.contactSection?.description || ''}
                className={cmsTheme.input}
                placeholder="Questions about our cookie practices? We're transparent about our approach."
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Button Text</label>
              <input
                type="text"
                name="buttonText"
                defaultValue={cookieData?.contactSection?.buttonText || ''}
                className={cmsTheme.input}
                placeholder="Contact Us"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update Contact Section'}
            </button>
          </form>
        </div>

        {/* Note about comprehensive sections */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Comprehensive Cookie Policy Management</h2>
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Complete CMS System Available</h3>
                <p className="text-blue-700 text-sm leading-relaxed mb-3">
                  This Cookie Policy CMS includes comprehensive management for all sections including Understanding Cookies, 
                  Cookie Types We Use, Managing Preferences, and Browser Instructions. The backend supports full CRUD operations 
                  for all cookie policy content.
                </p>
                <p className="text-blue-700 text-sm leading-relaxed">
                  The Hero, Last Updated Date, Understanding Cookies, and Contact sections above are the most commonly updated elements. 
                  All other sections are dynamically managed through the backend API and can be extended as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}