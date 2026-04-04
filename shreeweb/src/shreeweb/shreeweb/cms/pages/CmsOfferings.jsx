import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmsTheme } from '../shreewebCmsTheme';
import Toast from '../components/Toast';

export default function CmsOfferings() {
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Section settings state
  const [sectionSettings, setSectionSettings] = useState({
    sectionTitle: 'Curated Offerings',
    sectionDescription: 'Select the container that aligns with your current capacity and desired expansion.',
    backgroundColor: '#F4EFE6',
    cardBackground: '#EDE7DC'
  });
  
  // Additional programs state
  const [additionalPrograms, setAdditionalPrograms] = useState({
    enabled: true,
    title: 'Looking for deeper transformation?',
    programs: [
      { name: 'Realignment Program', sessions: '8 Sessions' },
      { name: 'Transformation Program', sessions: '12 Sessions' }
    ]
  });
  
  const [settingsLoading, setSettingsLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  useEffect(() => {
    fetchOfferings();
    fetchSectionSettings();
  }, []);

  const fetchSectionSettings = async () => {
    try {
      const response = await fetch('/backend/shreeweb-offerings/settings', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          if (data.settings.section) {
            setSectionSettings(prev => ({ ...prev, ...data.settings.section }));
          }
          if (data.settings.additionalPrograms) {
            setAdditionalPrograms(prev => ({ ...prev, ...data.settings.additionalPrograms }));
          }
        }
      } else {
        console.log('Settings API not available, using default settings');
      }
    } catch (error) {
      console.error('Error fetching section settings:', error);
      console.log('Using default settings');
    }
  };

  const saveSectionSettings = async () => {
    try {
      setSettingsLoading(true);

      const response = await fetch('/backend/shreeweb-offerings/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          section: sectionSettings,
          additionalPrograms: additionalPrograms
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));

        throw new Error(errorData.message || 'Failed to save settings');
      }

      const data = await response.json();
      showToast('Section settings saved successfully', 'success');
      // Re-fetch to ensure UI stays in sync with backend-persisted values.
      fetchSectionSettings();
    } catch (error) {
      console.error('Error saving section settings:', error);
      showToast(`Failed to save section settings: ${error.message}`, 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/backend/shreeweb-offerings', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch offerings');
      }

      const data = await response.json();
      if (data.success) {
        setOfferings(data.offerings || []);
      }
    } catch (error) {
      console.error('Error fetching offerings:', error);
      setError('Failed to load offerings');
      showToast('Failed to load offerings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
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
      fetchOfferings(); // Refresh the list
    } catch (error) {
      console.error('Error deleting offering:', error);
      showToast(error.message || 'Failed to delete offering', 'error');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/backend/shreeweb-offerings/${id}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to toggle status');
      }

      const data = await response.json();
      showToast(data.message, 'success');
      fetchOfferings(); // Refresh the list
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast(error.message || 'Failed to toggle status', 'error');
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      introductory: 'Introductory',
      single: 'Single Session',
      recurring: 'Recurring Sessions',
      program: 'Program'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      introductory: 'bg-green-100 text-green-800',
      single: 'bg-blue-100 text-blue-800',
      recurring: 'bg-purple-100 text-purple-800',
      program: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Loading offerings...</p>
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`${cmsTheme.title} text-2xl`}>Service Offerings</h1>
            <p className="text-sm text-stone-600 mt-1">Manage your wellness practice offerings and pricing</p>
          </div>
          <button
            onClick={() => navigate('/shreeweb/cms/offerings/add')}
            className={cmsTheme.btnPrimary}
          >
            + Add New Offering
          </button>
        </div>

        {/* Section Settings */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} mb-6`}>
          <h2 className={`${cmsTheme.title} text-lg mb-4`}>Section Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Section Title</label>
              <input
                type="text"
                value={sectionSettings.sectionTitle}
                onChange={(e) => setSectionSettings(prev => ({ ...prev, sectionTitle: e.target.value }))}
                className={cmsTheme.input}
                placeholder="Curated Offerings"
              />
            </div>
            
            <div>
              <label className={cmsTheme.label}>Section Description</label>
              <textarea
                value={sectionSettings.sectionDescription}
                onChange={(e) => setSectionSettings(prev => ({ ...prev, sectionDescription: e.target.value }))}
                className={cmsTheme.input}
                rows={3}
                placeholder="Select the container that aligns with your current capacity and desired expansion."
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Section Background Color</label>
                <input
                  type="color"
                  value={sectionSettings.backgroundColor}
                  onChange={(e) => setSectionSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Card Background Color</label>
                <input
                  type="color"
                  value={sectionSettings.cardBackground}
                  onChange={(e) => setSectionSettings(prev => ({ ...prev, cardBackground: e.target.value }))}
                  className={cmsTheme.input}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Programs Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`${cmsTheme.title} text-lg`}>Additional Programs Section</h2>
              <p className="text-sm text-stone-600 mt-1">Manage the additional programs that appear below the main offerings</p>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={additionalPrograms.enabled}
                onChange={(e) => setAdditionalPrograms(prev => ({ ...prev, enabled: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-stone-600">Enable Section</span>
              <span className={`px-2 py-1 text-xs rounded-full ${additionalPrograms.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {additionalPrograms.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
          
          {additionalPrograms.enabled && (
            <div className="space-y-4">
              <div>
                <label className={cmsTheme.label}>Section Title</label>
                <p className="text-xs text-stone-500 mb-2">The heading that appears above the program buttons</p>
                <input
                  type="text"
                  value={additionalPrograms.title}
                  onChange={(e) => setAdditionalPrograms(prev => ({ ...prev, title: e.target.value }))}
                  className={cmsTheme.input}
                  placeholder="Looking for deeper transformation?"
                />
              </div>
              
              <div>
                <label className={cmsTheme.label}>Programs</label>
                <p className="text-xs text-stone-500 mb-3">Add programs that will be displayed as buttons in the additional programs section</p>
                <div className="space-y-3">
                  {additionalPrograms.programs.length === 0 ? (
                    <div className="text-center py-8 bg-stone-50 rounded-lg border-2 border-dashed border-stone-200">
                      <p className="text-stone-500 mb-4">No programs added yet</p>
                      <button
                        onClick={() => {
                          setAdditionalPrograms(prev => ({ 
                            ...prev, 
                            programs: [
                              { name: 'Realignment Program', sessions: '8 Sessions' },
                              { name: 'Transformation Program', sessions: '12 Sessions' }
                            ]
                          }));
                        }}
                        className="px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors mr-2"
                      >
                        Add Default Programs
                      </button>
                      <button
                        onClick={() => {
                          setAdditionalPrograms(prev => ({ 
                            ...prev, 
                            programs: [{ name: '', sessions: '' }]
                          }));
                        }}
                        className="px-4 py-2 text-sm text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Add Empty Program
                      </button>
                    </div>
                  ) : (
                    <>
                      {additionalPrograms.programs.map((program, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-stone-600 mb-1">Program Name</label>
                            <input
                              type="text"
                              value={program.name || ''}
                              onChange={(e) => {
                                const newPrograms = [...additionalPrograms.programs];
                                newPrograms[index].name = e.target.value;
                                setAdditionalPrograms(prev => ({ ...prev, programs: newPrograms }));
                              }}
                              className={cmsTheme.input}
                              placeholder="e.g., Realignment Program"
                            />
                          </div>
                          <div className="w-40">
                            <label className="block text-xs font-medium text-stone-600 mb-1">Sessions</label>
                            <input
                              type="text"
                              value={program.sessions || ''}
                              onChange={(e) => {
                                const newPrograms = [...additionalPrograms.programs];
                                newPrograms[index].sessions = e.target.value;
                                setAdditionalPrograms(prev => ({ ...prev, programs: newPrograms }));
                              }}
                              className={cmsTheme.input}
                              placeholder="e.g., 8 Sessions"
                            />
                          </div>
                          <div className="pt-6">
                            <button
                              onClick={() => {
                                const newPrograms = additionalPrograms.programs.filter((_, i) => i !== index);
                                setAdditionalPrograms(prev => ({ ...prev, programs: newPrograms }));
                              }}
                              className="px-3 py-2 text-xs text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                              title="Remove this program"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newPrograms = [...additionalPrograms.programs, { name: '', sessions: '' }];
                          setAdditionalPrograms(prev => ({ ...prev, programs: newPrograms }));
                        }}
                        className="px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        + Add Program
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Settings Button */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={saveSectionSettings}
            disabled={settingsLoading}
            className={`${cmsTheme.btnPrimary} ${settingsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {settingsLoading ? 'Saving...' : 'Save Section Settings'}
          </button>
        </div>

        {offerings.length === 0 ? (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} text-center py-12`}>
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">No offerings yet</h3>
            <p className="text-stone-600 mb-4">Create your first service offering to get started.</p>
            <button
              onClick={() => navigate('/shreeweb/cms/offerings/add')}
              className={cmsTheme.btnPrimary}
            >
              Add Your First Offering
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {offerings.map((offering) => (
              <div key={offering._id} className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-stone-900">{offering.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(offering.category)}`}>
                        {getCategoryLabel(offering.category)}
                      </span>
                      {offering.featured && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        offering.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {offering.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {offering.subtitle && (
                      <p className="text-sm text-stone-600 mb-1">{offering.subtitle}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-stone-600 mb-2">
                      {offering.duration && <span>Duration: {offering.duration}</span>}
                      {offering.price && <span>Price: {offering.price}</span>}
                    </div>
                    
                    {offering.description && (
                      <p className="text-sm text-stone-700 line-clamp-2">{offering.description}</p>
                    )}
                    
                    {offering.features && offering.features.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-stone-500 mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {offering.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded">
                              {feature}
                            </span>
                          ))}
                          {offering.features.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded">
                              +{offering.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleStatus(offering._id, offering.isActive)}
                      className={`px-3 py-1 text-xs font-medium rounded ${
                        offering.isActive 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {offering.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => navigate(`/shreeweb/cms/offerings/edit/${offering._id}`)}
                      className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offering._id, offering.title)}
                      className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Section */}
        <div className={`${cmsTheme.card} w-full overflow-hidden p-0 mb-6`}>
          <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
            <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
            <p className="mt-1 text-sm text-stone-600">How the offerings section will appear on the site.</p>
          </div>
          <div className="p-6" style={{ backgroundColor: sectionSettings.backgroundColor }}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif text-stone-800 mb-3">
                {sectionSettings.sectionTitle}
              </h2>
              <p className="text-lg text-stone-600 mb-8">
                {sectionSettings.sectionDescription}
              </p>
              
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                {offerings.map((offering) => (
                  <article
                    key={offering._id}
                    className="rounded-3xl p-6 shadow-sm flex flex-col h-full"
                    style={{ backgroundColor: sectionSettings.cardBackground }}
                  >
                    <div className="text-sm font-medium text-stone-600 mb-2 tracking-wide uppercase">
                      {getCategoryLabel(offering.category)}
                    </div>
                    <h3 className="text-xl font-serif text-stone-800 mb-2 italic leading-tight">
                      {offering.title}
                    </h3>
                    <div className="text-sm text-stone-600 mb-4 font-medium">
                      {offering.duration}
                    </div>
                    
                    <p className="text-sm text-stone-700 mb-6 leading-relaxed flex-grow">
                      {offering.description}
                    </p>
                    
                    <div className="text-2xl font-serif text-stone-800 mb-4 font-medium">
                      {offering.price}
                    </div>

                    <div className="mt-auto">
                      <div className="inline-flex w-full items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800">
                        Book Now
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Additional Programs Preview */}
              {additionalPrograms.enabled && (
                <div className="mt-12 text-center">
                  <h3 className="text-xl font-serif text-stone-800 mb-6">
                    {additionalPrograms.title || 'Looking for deeper transformation?'}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {additionalPrograms.programs.length > 0 ? (
                      additionalPrograms.programs.map((program, index) => (
                        <div
                          key={index}
                          className="px-6 py-3 rounded-full border border-stone-300 bg-white/80 text-stone-700 font-medium"
                        >
                          {program.name || 'Program Name'} ({program.sessions || 'Sessions'})
                        </div>
                      ))
                    ) : (
                      <div className="px-6 py-3 rounded-full border border-stone-300 bg-stone-100 text-stone-500 font-medium">
                        No programs configured
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

