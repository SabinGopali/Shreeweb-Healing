import React, { useState, useEffect } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [aboutData, setAboutData] = useState(null);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/backend/shreeweb-about', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch about data');
      }

      if (data.success) {
        setAboutData(data.data);
        setServicesData(data.data.whatWeDo?.services || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError(err.message || 'Failed to load about data');
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section, updates) => {
    try {
      setSaving(true);
      setError('');

      const response = await fetch(`/backend/shreeweb-about/section/${section}`, {
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
        setAboutData(data.data);
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

  const handleHeroUpdate = (e) => {
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

  const handleWhatWeDoUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      title: formData.get('title'),
      description: formData.get('description'),
    };
    updateSection('whatWeDo', updates);
  };

  const handlePhilosophyUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      title: formData.get('title'),
      description: formData.get('description'),
    };
    updateSection('philosophy', updates);
  };

  const handleHowToStartUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      title: formData.get('title'),
      description: formData.get('description'),
    };
    updateSection('howToStart', updates);
  };

  const handleCallToActionUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      title: formData.get('title'),
      description: formData.get('description'),
      primaryButtonText: formData.get('primaryButtonText'),
      secondaryButtonText: formData.get('secondaryButtonText'),
      quote: formData.get('quote'),
    };
    updateSection('callToAction', updates);
  };

  const updateServiceField = (index, field, value) => {
    const updatedServices = [...servicesData];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServicesData(updatedServices);
  };

  const handleServicesUpdate = async () => {
    try {
      setSaving(true);
      setError('');

      const updates = {
        services: servicesData
      };

      const response = await fetch(`/backend/shreeweb-about/section/whatWeDo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update services');
      }

      if (data.success) {
        setAboutData(data.data);
        setServicesData(data.data.whatWeDo?.services || []);
        alert('Services updated successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error updating services:', err);
      setError(err.message || 'Failed to update services');
      alert(err.message || 'Failed to update services');
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
            <p className="text-stone-600">Loading about page data...</p>
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
          <h3 className="text-lg font-medium text-stone-900 mb-2">Failed to Load About Page</h3>
          <p className="text-stone-600 mb-4">{error}</p>
          <button
            onClick={fetchAboutData}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="text-center py-12">
          <p className="text-stone-600">No about page data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cmsTheme.pageWrap}>
      <div className="mb-8">
        <h1 className={`${cmsTheme.title} text-2xl`}>About Page Management</h1>
        <p className="text-stone-600 mt-2">Manage all sections of the About page content</p>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Hero Section</h2>
          <form onSubmit={handleHeroUpdate} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Tag</label>
              <input
                type="text"
                name="tag"
                defaultValue={aboutData.hero?.tag}
                className={cmsTheme.input}
                placeholder="About"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={aboutData.hero?.title}
                  className={cmsTheme.input}
                  placeholder="OMSHREEGUIDANCE"
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={aboutData.hero?.subtitle}
                  className={cmsTheme.input}
                  placeholder="Energy Sessions"
                />
              </div>
            </div>
            <div>
              <label className={cmsTheme.label}>Description</label>
              <textarea
                name="description"
                defaultValue={aboutData.hero?.description}
                rows={3}
                className={cmsTheme.input}
                placeholder="A calm, structured approach..."
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

        {/* About Me Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>About Me Section</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updates = {
              title: formData.get('title'),
              subtitle: formData.get('subtitle'),
              content: formData.get('content'),
            };
            updateSection('aboutMe', updates);
          }} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Title</label>
              <input
                type="text"
                name="title"
                defaultValue={aboutData.aboutMe?.title}
                className={cmsTheme.input}
                placeholder="About me"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                defaultValue={aboutData.aboutMe?.subtitle}
                className={cmsTheme.input}
                placeholder="Holding space for visionaries."
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Content</label>
              <textarea
                name="content"
                defaultValue={aboutData.aboutMe?.content}
                rows={12}
                className={cmsTheme.input}
                placeholder="This work didn't begin as something I planned..."
              />
              <p className="text-xs text-stone-500 mt-1">
                Use double line breaks (press Enter twice) to create new paragraphs
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update About Me Section'}
            </button>
          </form>
        </div>

        {/* What We Do Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>What We Do Section</h2>
          <form onSubmit={handleWhatWeDoUpdate} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Title</label>
              <input
                type="text"
                name="title"
                defaultValue={aboutData.whatWeDo?.title}
                className={cmsTheme.input}
                placeholder="What we do"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Description</label>
              <textarea
                name="description"
                defaultValue={aboutData.whatWeDo?.description}
                rows={3}
                className={cmsTheme.input}
                placeholder="The sessions work with your energetic system..."
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update What We Do Section'}
            </button>
          </form>
        </div>

        {/* What We Do Services */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>What We Do - Services</h2>
          <div className="space-y-4">
            {servicesData?.map((service, index) => (
              <div key={index} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-stone-600">Service {index + 1}</span>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className={cmsTheme.label}>Icon Style</label>
                    <select
                      value={service.icon || 'circle'}
                      onChange={(e) => updateServiceField(index, 'icon', e.target.value)}
                      className={cmsTheme.input}
                    >
                      <option value="circle">Circle outline</option>
                      <option value="filled-circle">Filled circle</option>
                      <option value="grid">Grid pattern</option>
                      <option value="square">Square</option>
                      <option value="diamond">Diamond</option>
                    </select>
                  </div>
                  <div>
                    <label className={cmsTheme.label}>Service Title</label>
                    <input
                      type="text"
                      value={service.title || ''}
                      onChange={(e) => updateServiceField(index, 'title', e.target.value)}
                      placeholder="Scanning"
                      className={cmsTheme.input}
                    />
                  </div>
                  <div>
                    <label className={cmsTheme.label}>Description</label>
                    <textarea
                      value={service.description || ''}
                      onChange={(e) => updateServiceField(index, 'description', e.target.value)}
                      placeholder="Identify energy leaks and blocks..."
                      className={`${cmsTheme.input} h-20 resize-none`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleServicesUpdate}
            disabled={saving}
            className={cmsTheme.btnPrimary}
          >
            {saving ? 'Saving...' : 'Update Services'}
          </button>
        </div>

        {/* Philosophy Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Philosophy Section</h2>
          <form onSubmit={handlePhilosophyUpdate} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Title</label>
              <input
                type="text"
                name="title"
                defaultValue={aboutData.philosophy?.title}
                className={cmsTheme.input}
                placeholder="The OMSHREEGUIDANCE Approach"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Description</label>
              <textarea
                name="description"
                defaultValue={aboutData.philosophy?.description}
                rows={3}
                className={cmsTheme.input}
                placeholder="Inspired by the minimalist principles..."
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update Philosophy Section'}
            </button>
          </form>
        </div>

        {/* How to Get Started Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>How to Get Started Section</h2>
          <form onSubmit={handleHowToStartUpdate} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Title</label>
              <input
                type="text"
                name="title"
                defaultValue={aboutData.howToStart?.title}
                className={cmsTheme.input}
                placeholder="How to get started"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Description</label>
              <textarea
                name="description"
                defaultValue={aboutData.howToStart?.description}
                rows={2}
                className={cmsTheme.input}
                placeholder="Your journey toward energetic alignment..."
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update How to Start Section'}
            </button>
          </form>
        </div>

        {/* Call to Action Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Call to Action Section</h2>
          <form onSubmit={handleCallToActionUpdate} className="space-y-4">
            <div>
              <label className={cmsTheme.label}>Title</label>
              <input
                type="text"
                name="title"
                defaultValue={aboutData.callToAction?.title}
                className={cmsTheme.input}
                placeholder="Ready to begin?"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Description</label>
              <textarea
                name="description"
                defaultValue={aboutData.callToAction?.description}
                rows={2}
                className={cmsTheme.input}
                placeholder="Start with a complimentary Discovery Call..."
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Primary Button Text</label>
                <input
                  type="text"
                  name="primaryButtonText"
                  defaultValue={aboutData.callToAction?.primaryButtonText}
                  className={cmsTheme.input}
                  placeholder="Schedule Discovery Call"
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Secondary Button Text</label>
                <input
                  type="text"
                  name="secondaryButtonText"
                  defaultValue={aboutData.callToAction?.secondaryButtonText}
                  className={cmsTheme.input}
                  placeholder="View All Offerings"
                />
              </div>
            </div>
            <div>
              <label className={cmsTheme.label}>Quote</label>
              <input
                type="text"
                name="quote"
                defaultValue={aboutData.callToAction?.quote}
                className={cmsTheme.input}
                placeholder='"The journey of a thousand miles begins with a single step." - Lao Tzu'
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update Call to Action Section'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}