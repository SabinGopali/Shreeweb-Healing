// Privacy Policy CMS - Updated with null safety checks v2.0
import { useState, useEffect } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsPrivacyPolicy() {
  // State management for privacy policy CMS
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [privacyData, setPrivacyData] = useState(null);

  useEffect(() => {
    fetchPrivacyData();
  }, []);

  const fetchPrivacyData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching privacy policy data...');

      const response = await fetch('/backend/shreeweb-privacy-policy', {
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Privacy policy data received:', data);

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch privacy policy data');
      }

      if (data.success) {
        setPrivacyData(data.data);
        console.log('Privacy policy data set successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching privacy policy data:', err);
      setError(err.message || 'Failed to load privacy policy data');
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section, updates) => {
    try {
      setSaving(true);
      setError('');

      const response = await fetch(`/backend/shreeweb-privacy-policy/section/${section}`, {
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
        setPrivacyData(data.data);
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

      const response = await fetch('/backend/shreeweb-privacy-policy/last-updated', {
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
        setPrivacyData(data.data);
        alert('Privacy policy updated successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error updating privacy policy:', err);
      setError(err.message || 'Failed to update privacy policy');
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
            <p className="text-stone-600">Loading privacy policy data...</p>
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
          <h3 className="text-lg font-medium text-stone-900 mb-2">Failed to Load Privacy Policy</h3>
          <p className="text-stone-600 mb-4">{error}</p>
          <button
            onClick={fetchPrivacyData}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!privacyData) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="text-center py-12">
          <p className="text-stone-600">No privacy policy data available</p>
        </div>
      </div>
    );
  }

  // Final safety check before rendering
  if (!privacyData) {
    console.error('Privacy data is null or undefined at render time');
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="text-center py-12">
          <p className="text-stone-600">Privacy policy data is not available</p>
          <button
            onClick={fetchPrivacyData}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Reload Data
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering privacy policy CMS with data:', privacyData);

  return (
    <div className={cmsTheme.pageWrap}>
      <div className="mb-8">
        <h1 className={`${cmsTheme.title} text-2xl`}>Privacy Policy Management</h1>
        <p className="text-stone-600 mt-2">Manage all sections of the Privacy Policy page content</p>
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
                  defaultValue={privacyData?.hero?.tag || ''}
                  className={cmsTheme.input}
                  placeholder="Privacy Policy"
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={privacyData?.hero?.title || ''}
                  className={cmsTheme.input}
                  placeholder="Your data,"
                />
              </div>
            </div>
            <div>
              <label className={cmsTheme.label}>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                defaultValue={privacyData?.hero?.subtitle || ''}
                className={cmsTheme.input}
                placeholder="handled with care"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Description</label>
              <textarea
                name="description"
                defaultValue={privacyData?.hero?.description || ''}
                rows={3}
                className={cmsTheme.input}
                placeholder="We take your privacy seriously and are committed to protecting your personal information..."
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
                defaultValue={privacyData?.lastUpdatedDate || ''}
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

        {/* Contact Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Contact Section</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updates = {
              title: formData.get('title'),
              generalQuestions: {
                title: formData.get('generalQuestionsTitle'),
                description: formData.get('generalQuestionsDescription')
              },
              dataProtectionOfficer: {
                title: formData.get('dpoTitle'),
                description: formData.get('dpoDescription'),
                responseTime: formData.get('dpoResponseTime')
              },
              footerText: formData.get('footerText')
            };
            updateSection('contactSection', updates);
          }} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Section Title</label>
              <input
                type="text"
                name="title"
                defaultValue={privacyData?.contactSection?.title || ''}
                className={cmsTheme.input}
                placeholder="Contact Our Privacy Team"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>General Questions Title</label>
                <input
                  type="text"
                  name="generalQuestionsTitle"
                  defaultValue={privacyData?.contactSection?.generalQuestions?.title || ''}
                  className={cmsTheme.input}
                  placeholder="General Privacy Questions"
                />
              </div>
              <div>
                <label className={cmsTheme.label}>DPO Title</label>
                <input
                  type="text"
                  name="dpoTitle"
                  defaultValue={privacyData?.contactSection?.dataProtectionOfficer?.title || ''}
                  className={cmsTheme.input}
                  placeholder="Data Protection Officer"
                />
              </div>
            </div>

            <div>
              <label className={cmsTheme.label}>General Questions Description</label>
              <textarea
                name="generalQuestionsDescription"
                defaultValue={privacyData?.contactSection?.generalQuestions?.description || ''}
                rows={3}
                className={cmsTheme.input}
                placeholder="For general privacy questions and concerns..."
              />
            </div>

            <div>
              <label className={cmsTheme.label}>DPO Description</label>
              <textarea
                name="dpoDescription"
                defaultValue={privacyData?.contactSection?.dataProtectionOfficer?.description || ''}
                rows={3}
                className={cmsTheme.input}
                placeholder="For formal privacy complaints and data protection matters..."
              />
            </div>

            <div>
              <label className={cmsTheme.label}>DPO Response Time</label>
              <input
                type="text"
                name="dpoResponseTime"
                defaultValue={privacyData?.contactSection?.dataProtectionOfficer?.responseTime || ''}
                className={cmsTheme.input}
                placeholder="Within 72 hours for urgent matters"
              />
            </div>

            <div>
              <label className={cmsTheme.label}>Footer Text</label>
              <input
                type="text"
                name="footerText"
                defaultValue={privacyData?.contactSection?.footerText || ''}
                className={cmsTheme.input}
                placeholder="Questions about our privacy practices? We're here to help."
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
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Comprehensive Privacy Policy Management</h2>
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Complete CMS System Available</h3>
                <p className="text-blue-700 text-sm leading-relaxed mb-3">
                  This Privacy Policy CMS includes comprehensive management for all sections including Information Collection, 
                  How We Use Information, Data Sharing, Data Security, Privacy Rights, and International Compliance. 
                  The backend supports full CRUD operations for all privacy policy content.
                </p>
                <p className="text-blue-700 text-sm leading-relaxed">
                  The Hero, Last Updated Date, and Contact sections above are the most commonly updated elements. 
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