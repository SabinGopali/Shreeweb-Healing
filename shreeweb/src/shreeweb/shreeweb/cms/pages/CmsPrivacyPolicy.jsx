import { useState, useEffect } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsPrivacyPolicy() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [privacyData, setPrivacyData] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchPrivacyData();
  }, []);

  const fetchPrivacyData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/backend/shreeweb-privacy-policy', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch privacy policy data');
      }

      if (data.success) {
        setPrivacyData(data.data);
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
      alert(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const updateArrayField = (section, field, index, value) => {
    const updatedData = { ...privacyData };
    updatedData[section][field][index] = value;
    setPrivacyData(updatedData);
  };

  const addArrayItem = (section, field) => {
    const updatedData = { ...privacyData };
    if (!updatedData[section][field]) {
      updatedData[section][field] = [];
    }
    updatedData[section][field].push('');
    setPrivacyData(updatedData);
  };

  const removeArrayItem = (section, field, index) => {
    const updatedData = { ...privacyData };
    updatedData[section][field].splice(index, 1);
    setPrivacyData(updatedData);
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

  const tabs = [
    { id: 'hero', label: 'Hero & Intro' },
    { id: 'collection', label: '1. Information Collection' },
    { id: 'usage', label: '2. How We Use' },
    { id: 'confidentiality', label: '3. Confidentiality' },
    { id: 'protection', label: '4. Data Protection' },
    { id: 'thirdparty', label: '5. Third-Party' },
    { id: 'rights', label: '6. Your Rights' },
    { id: 'updates', label: '7. Policy Updates' },
  ];

  return (
    <div className={cmsTheme.pageWrap}>
      <div className="mb-8">
        <h1 className={`${cmsTheme.title} text-2xl`}>Privacy Policy Management</h1>
        <p className="text-stone-600 mt-2">Manage all sections of the Privacy Policy content</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-stone-200 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Hero & Introduction Tab */}
        {activeTab === 'hero' && (
          <>
            <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
              <h2 className={`${cmsTheme.title} text-xl mb-4`}>Hero Section</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                updateSection('hero', {
                  tag: formData.get('tag'),
                  title: formData.get('title'),
                  subtitle: formData.get('subtitle'),
                });
              }} className="space-y-4">
                <div>
                  <label className={cmsTheme.label}>Tag</label>
                  <input
                    type="text"
                    name="tag"
                    defaultValue={privacyData.hero?.tag}
                    className={cmsTheme.input}
                    placeholder="Privacy Policy"
                  />
                </div>
                <div>
                  <label className={cmsTheme.label}>Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={privacyData.hero?.title}
                    className={cmsTheme.input}
                    placeholder="Your privacy is respected"
                  />
                </div>
                <div>
                  <label className={cmsTheme.label}>Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    defaultValue={privacyData.hero?.subtitle}
                    className={cmsTheme.input}
                    placeholder="and handled with care"
                  />
                </div>
                <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>
                  {saving ? 'Saving...' : 'Update Hero Section'}
                </button>
              </form>
            </div>

            <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
              <h2 className={`${cmsTheme.title} text-xl mb-4`}>Last Updated & Introduction</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                await updateSection('lastUpdatedDate', formData.get('lastUpdatedDate'));
                await updateSection('introduction', {
                  description: formData.get('introDescription'),
                });
              }} className="space-y-4">
                <div>
                  <label className={cmsTheme.label}>Last Updated Date</label>
                  <input
                    type="text"
                    name="lastUpdatedDate"
                    defaultValue={privacyData.lastUpdatedDate}
                    className={cmsTheme.input}
                    placeholder="6 April 2026"
                  />
                </div>
                <div>
                  <label className={cmsTheme.label}>Introduction Text</label>
                  <textarea
                    name="introDescription"
                    defaultValue={privacyData.introduction?.description}
                    rows={3}
                    className={cmsTheme.input}
                    placeholder="This policy outlines..."
                  />
                </div>
                <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>
                  {saving ? 'Saving...' : 'Update Date & Introduction'}
                </button>
              </form>
            </div>
          </>
        )}

        {/* 1. Information Collection Tab */}
        {activeTab === 'collection' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <label className={cmsTheme.label}>Section Title</label>
                <input
                  type="text"
                  value={privacyData.informationCollection?.title || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.informationCollection.title = e.target.value;
                    setPrivacyData(updated);
                  }}
                  className={cmsTheme.input}
                  placeholder="1. Information We Collect"
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Description</label>
                <textarea
                  value={privacyData.informationCollection?.description || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.informationCollection.description = e.target.value;
                    setPrivacyData(updated);
                  }}
                  rows={2}
                  className={cmsTheme.input}
                  placeholder="When you interact with this space..."
                />
              </div>
              
              <div>
                <label className={cmsTheme.label}>Information Items</label>
                {privacyData.informationCollection?.items?.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateArrayField('informationCollection', 'items', index, e.target.value)}
                      className={cmsTheme.input}
                      placeholder="Item"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('informationCollection', 'items', index)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('informationCollection', 'items')}
                  className="mt-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm"
                >
                  + Add Item
                </button>
              </div>

              <div>
                <label className={cmsTheme.label}>Technical Data Note</label>
                <textarea
                  value={privacyData.informationCollection?.technicalData || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.informationCollection.technicalData = e.target.value;
                    setPrivacyData(updated);
                  }}
                  rows={2}
                  className={cmsTheme.input}
                  placeholder="In addition, limited technical data..."
                />
              </div>

              <button
                onClick={() => updateSection('informationCollection', privacyData.informationCollection)}
                disabled={saving}
                className={cmsTheme.btnPrimary}
              >
                {saving ? 'Saving...' : 'Update Information Collection'}
              </button>
            </div>
          </div>
        )}

        {/* 2. How We Use Tab */}
        {activeTab === 'usage' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>2. How Your Information Is Used</h2>
            <div className="space-y-4">
              <div>
                <label className={cmsTheme.label}>Section Title</label>
                <input
                  type="text"
                  value={privacyData.howWeUse?.title || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.howWeUse.title = e.target.value;
                    setPrivacyData(updated);
                  }}
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Description</label>
                <textarea
                  value={privacyData.howWeUse?.description || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.howWeUse.description = e.target.value;
                    setPrivacyData(updated);
                  }}
                  rows={2}
                  className={cmsTheme.input}
                />
              </div>
              
              <div>
                <label className={cmsTheme.label}>Usage Items</label>
                {privacyData.howWeUse?.items?.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateArrayField('howWeUse', 'items', index, e.target.value)}
                      className={cmsTheme.input}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('howWeUse', 'items', index)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('howWeUse', 'items')}
                  className="mt-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm"
                >
                  + Add Item
                </button>
              </div>

              <div>
                <label className={cmsTheme.label}>Opt-In Note</label>
                <input
                  type="text"
                  value={privacyData.howWeUse?.optInNote || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.howWeUse.optInNote = e.target.value;
                    setPrivacyData(updated);
                  }}
                  className={cmsTheme.input}
                />
              </div>

              <div>
                <label className={cmsTheme.label}>No Selling Statement</label>
                <input
                  type="text"
                  value={privacyData.howWeUse?.noSelling || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.howWeUse.noSelling = e.target.value;
                    setPrivacyData(updated);
                  }}
                  className={cmsTheme.input}
                />
              </div>

              <button
                onClick={() => updateSection('howWeUse', privacyData.howWeUse)}
                disabled={saving}
                className={cmsTheme.btnPrimary}
              >
                {saving ? 'Saving...' : 'Update How We Use'}
              </button>
            </div>
          </div>
        )}

        {/* 3. Confidentiality Tab */}
        {activeTab === 'confidentiality' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>3. Confidentiality</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              updateSection('confidentiality', {
                title: formData.get('title'),
                description: formData.get('description'),
              });
            }} className="space-y-4">
              <div>
                <label className={cmsTheme.label}>Section Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={privacyData.confidentiality?.title}
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Description</label>
                <textarea
                  name="description"
                  defaultValue={privacyData.confidentiality?.description}
                  rows={3}
                  className={cmsTheme.input}
                />
              </div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>
                {saving ? 'Saving...' : 'Update Confidentiality'}
              </button>
            </form>
          </div>
        )}

        {/* 4. Data Protection Tab */}
        {activeTab === 'protection' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>4. Data Protection</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              updateSection('dataProtection', {
                title: formData.get('title'),
                description: formData.get('description'),
              });
            }} className="space-y-4">
              <div>
                <label className={cmsTheme.label}>Section Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={privacyData.dataProtection?.title}
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Description</label>
                <textarea
                  name="description"
                  defaultValue={privacyData.dataProtection?.description}
                  rows={3}
                  className={cmsTheme.input}
                />
              </div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>
                {saving ? 'Saving...' : 'Update Data Protection'}
              </button>
            </form>
          </div>
        )}

        {/* 5. Third-Party Services Tab */}
        {activeTab === 'thirdparty' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>5. Third-Party Services</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              updateSection('thirdPartyServices', {
                title: formData.get('title'),
                description: formData.get('description'),
              });
            }} className="space-y-4">
              <div>
                <label className={cmsTheme.label}>Section Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={privacyData.thirdPartyServices?.title}
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Description</label>
                <textarea
                  name="description"
                  defaultValue={privacyData.thirdPartyServices?.description}
                  rows={3}
                  className={cmsTheme.input}
                />
              </div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>
                {saving ? 'Saving...' : 'Update Third-Party Services'}
              </button>
            </form>
          </div>
        )}

        {/* 6. Your Rights Tab */}
        {activeTab === 'rights' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>6. Your Rights</h2>
            <div className="space-y-4">
              <div>
                <label className={cmsTheme.label}>Section Title</label>
                <input
                  type="text"
                  value={privacyData.yourRights?.title || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.yourRights.title = e.target.value;
                    setPrivacyData(updated);
                  }}
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Description</label>
                <textarea
                  value={privacyData.yourRights?.description || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.yourRights.description = e.target.value;
                    setPrivacyData(updated);
                  }}
                  rows={2}
                  className={cmsTheme.input}
                />
              </div>
              
              <div>
                <label className={cmsTheme.label}>Rights Items</label>
                {privacyData.yourRights?.items?.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateArrayField('yourRights', 'items', index, e.target.value)}
                      className={cmsTheme.input}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('yourRights', 'items', index)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('yourRights', 'items')}
                  className="mt-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm"
                >
                  + Add Item
                </button>
              </div>

              <div>
                <label className={cmsTheme.label}>Contact Note</label>
                <input
                  type="text"
                  value={privacyData.yourRights?.contactNote || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.yourRights.contactNote = e.target.value;
                    setPrivacyData(updated);
                  }}
                  className={cmsTheme.input}
                />
              </div>

              <div>
                <label className={cmsTheme.label}>Contact Email</label>
                <input
                  type="email"
                  value={privacyData.yourRights?.contactEmail || ''}
                  onChange={(e) => {
                    const updated = { ...privacyData };
                    updated.yourRights.contactEmail = e.target.value;
                    setPrivacyData(updated);
                  }}
                  className={cmsTheme.input}
                  placeholder="omshreeguidance@gmail.com"
                />
              </div>

              <button
                onClick={() => updateSection('yourRights', privacyData.yourRights)}
                disabled={saving}
                className={cmsTheme.btnPrimary}
              >
                {saving ? 'Saving...' : 'Update Your Rights'}
              </button>
            </div>
          </div>
        )}

        {/* 7. Policy Updates Tab */}
        {activeTab === 'updates' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>7. Policy Updates</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              updateSection('policyUpdates', {
                title: formData.get('title'),
                description: formData.get('description'),
              });
            }} className="space-y-4">
              <div>
                <label className={cmsTheme.label}>Section Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={privacyData.policyUpdates?.title}
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Description</label>
                <textarea
                  name="description"
                  defaultValue={privacyData.policyUpdates?.description}
                  rows={3}
                  className={cmsTheme.input}
                />
              </div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>
                {saving ? 'Saving...' : 'Update Policy Updates'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
