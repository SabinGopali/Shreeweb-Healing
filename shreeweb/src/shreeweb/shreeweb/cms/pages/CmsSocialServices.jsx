import { useState, useEffect } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import Toast from '../components/Toast';

export default function CmsSocialServices() {
  const [form, setForm] = useState({
    socialMedia: {
      facebook: { url: 'https://facebook.com/yourpage', enabled: true },
      instagram: { url: 'https://instagram.com/yourpage', enabled: true },
      tiktok: { url: 'https://tiktok.com/@yourpage', enabled: true },
      youtube: { url: 'https://youtube.com/@yourpage', enabled: true }
    },
    mainHeading: 'Your next level of success may require more than strategy.',
    description: 'Through structured sessions using Pranic Healing, I help entrepreneurs and ambitious professionals clear energetic blockages, restore balance, and strengthen their internal capacity for growth.',
    primaryButton: {
      text: 'Schedule a Discovery Call',
      enabled: true
    },
    secondaryButton: {
      text: 'Book a Session',
      enabled: true
    },
    styling: {
      backgroundColor: '#F4EFE6',
      textColor: '#1C1917',
      primaryButtonColor: '#EA580C',
      primaryButtonTextColor: '#FFFFFF',
      secondaryButtonColor: '#F97316',
      secondaryButtonTextColor: '#FFFFFF'
    },
    communitySection: {
      heading: 'Join Our Community',
      description:
        'Connect with like-minded individuals on their journey toward energetic alignment and sustainable expansion.',
      cards: [
        {
          title: 'Daily Insights',
          description: 'Gentle reminders and practices to support your energetic well-being.',
        },
        {
          title: 'Community Support',
          description: 'Connect with others on similar journeys of growth and transformation.',
        },
        {
          title: 'Live Sessions',
          description: 'Join live Q&A sessions and group practices for deeper connection.',
        },
      ],
    },
    callToAction: {
      heading: 'Ready to begin your journey?',
      description:
        'Start with a complimentary Discovery Call to explore what\'s possible for you.',
      buttonText: 'Schedule Discovery Call',
      buttonLink: '/shreeweb/booking?plan=discovery',
    },
    isActive: true
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
    fetchSocialServices();
  }, []);

  const fetchSocialServices = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/backend/shreeweb-social-services', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch social services data');
      }

      const data = await response.json();
      if (data.success && data.socialServices) {
        setForm((prev) => ({
          ...prev,
          ...data.socialServices,
          communitySection:
            data.socialServices.communitySection ?? prev.communitySection,
          callToAction: data.socialServices.callToAction ?? prev.callToAction,
        }));
      }
    } catch (error) {
      console.error('Error fetching social services:', error);
      showToast('Failed to load social services data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (path, value) => {
    setForm(prev => {
      const newForm = { ...prev };
      const keys = path.split('.');
      let current = newForm;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newForm;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!form.mainHeading.trim()) {
      showToast('Please enter a main heading', 'error');
      return;
    }

    if (!form.description.trim()) {
      showToast('Please enter a description', 'error');
      return;
    }

    setSaving(true);
    
    try {
      const response = await fetch('/backend/shreeweb-social-services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save social services section');
      }

      showToast('Social services section saved successfully!', 'success');
      
    } catch (error) {
      console.error('Error saving social services:', error);
      showToast(error.message || 'Failed to save social services section. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset to default values? This will overwrite all current settings.')) {
      return;
    }

    try {
      const response = await fetch('/backend/shreeweb-social-services/reset', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset social services section');
      }

      setForm((prev) => ({
        ...prev,
        ...data.socialServices,
      }));
      showToast('Social services section reset to defaults successfully', 'success');
      
    } catch (error) {
      console.error('Error resetting social services:', error);
      showToast(error.message || 'Failed to reset social services section', 'error');
    }
  };

  if (loading) {
    return (
      <div className={cmsTheme.pageWrap}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Loading social services section...</p>
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
            <h1 className={`${cmsTheme.title} text-2xl`}>Social Services Section</h1>
            <p className="text-sm text-stone-600 mt-1">Manage social media links, main content, and call-to-action buttons</p>
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
          {/* Social Media Section */}
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <h2 className={`${cmsTheme.title} text-lg`}>Social Media Links</h2>
            
            <div className="grid gap-4 md:grid-cols-4">
              {/* Facebook */}
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={form.socialMedia.facebook.enabled}
                    onChange={(e) => updateField('socialMedia.facebook.enabled', e.target.checked)}
                    className="mr-2 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className={cmsTheme.label}>Facebook</span>
                </label>
                <input
                  type="url"
                  value={form.socialMedia.facebook.url}
                  onChange={(e) => updateField('socialMedia.facebook.url', e.target.value)}
                  placeholder="Facebook URL"
                  className={cmsTheme.input}
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={form.socialMedia.instagram.enabled}
                    onChange={(e) => updateField('socialMedia.instagram.enabled', e.target.checked)}
                    className="mr-2 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className={cmsTheme.label}>Instagram</span>
                </label>
                <input
                  type="url"
                  value={form.socialMedia.instagram.url}
                  onChange={(e) => updateField('socialMedia.instagram.url', e.target.value)}
                  placeholder="Instagram URL"
                  className={cmsTheme.input}
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={form.socialMedia.tiktok.enabled}
                    onChange={(e) => updateField('socialMedia.tiktok.enabled', e.target.checked)}
                    className="mr-2 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className={cmsTheme.label}>TikTok</span>
                </label>
                <input
                  type="url"
                  value={form.socialMedia.tiktok.url}
                  onChange={(e) => updateField('socialMedia.tiktok.url', e.target.value)}
                  placeholder="TikTok URL"
                  className={cmsTheme.input}
                />
              </div>

              {/* YouTube */}
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={form.socialMedia.youtube.enabled}
                    onChange={(e) => updateField('socialMedia.youtube.enabled', e.target.checked)}
                    className="mr-2 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className={cmsTheme.label}>YouTube</span>
                </label>
                <input
                  type="url"
                  value={form.socialMedia.youtube.url}
                  onChange={(e) => updateField('socialMedia.youtube.url', e.target.value)}
                  placeholder="YouTube URL"
                  className={cmsTheme.input}
                />
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <h2 className={`${cmsTheme.title} text-lg`}>Main Content</h2>
            
            <div>
              <label className={cmsTheme.label}>Main Heading *</label>
              <input
                type="text"
                value={form.mainHeading}
                onChange={(e) => updateField('mainHeading', e.target.value)}
                placeholder="Your main heading"
                className={cmsTheme.input}
                required
              />
            </div>

            <div>
              <label className={cmsTheme.label}>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe your services"
                rows={4}
                className={`${cmsTheme.input} h-24 resize-none`}
                required
              />
            </div>
          </div>

          {/* Buttons Section */}
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <h2 className={`${cmsTheme.title} text-lg`}>Call-to-Action Buttons</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Primary Button */}
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={form.primaryButton.enabled}
                    onChange={(e) => updateField('primaryButton.enabled', e.target.checked)}
                    className="mr-2 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className={cmsTheme.label}>Primary Button</span>
                </label>
                <input
                  type="text"
                  value={form.primaryButton.text}
                  onChange={(e) => updateField('primaryButton.text', e.target.value)}
                  placeholder="Button text"
                  className={cmsTheme.input}
                />
              </div>

              {/* Secondary Button */}
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={form.secondaryButton.enabled}
                    onChange={(e) => updateField('secondaryButton.enabled', e.target.checked)}
                    className="mr-2 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className={cmsTheme.label}>Secondary Button</span>
                </label>
                <input
                  type="text"
                  value={form.secondaryButton.text}
                  onChange={(e) => updateField('secondaryButton.text', e.target.value)}
                  placeholder="Button text"
                  className={cmsTheme.input}
                />
              </div>
            </div>
          </div>

          {/* Community Section */}
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <h2 className={`${cmsTheme.title} text-lg`}>Community Section</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>Community Heading</label>
                <input
                  type="text"
                  value={form.communitySection.heading}
                  onChange={(e) => updateField('communitySection.heading', e.target.value)}
                  placeholder="Community heading"
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>Community Description</label>
                <textarea
                  value={form.communitySection.description}
                  onChange={(e) => updateField('communitySection.description', e.target.value)}
                  placeholder="Community description"
                  rows={4}
                  className={`${cmsTheme.input} h-24 resize-none`}
                />
              </div>
            </div>

            <div>
              <h3 className={`${cmsTheme.title} text-base`}>Community Cards</h3>
              <div className="grid gap-4 md:grid-cols-3 mt-3">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="space-y-3">
                    <label className={cmsTheme.label}>Card {idx + 1} Title</label>
                    <input
                      type="text"
                      value={form.communitySection.cards?.[idx]?.title || ''}
                      onChange={(e) =>
                        updateField(`communitySection.cards.${idx}.title`, e.target.value)
                      }
                      placeholder={`Card ${idx + 1} title`}
                      className={cmsTheme.input}
                    />
                    <label className={cmsTheme.label}>Card {idx + 1} Description</label>
                    <textarea
                      value={form.communitySection.cards?.[idx]?.description || ''}
                      onChange={(e) =>
                        updateField(`communitySection.cards.${idx}.description`, e.target.value)
                      }
                      placeholder={`Card ${idx + 1} description`}
                      rows={4}
                      className={`${cmsTheme.input} h-24 resize-none`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call To Action Section */}
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} space-y-4`}>
            <h2 className={`${cmsTheme.title} text-lg`}>CTA Section</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cmsTheme.label}>CTA Heading</label>
                <input
                  type="text"
                  value={form.callToAction.heading}
                  onChange={(e) => updateField('callToAction.heading', e.target.value)}
                  placeholder="CTA heading"
                  className={cmsTheme.input}
                />
              </div>
              <div>
                <label className={cmsTheme.label}>CTA Button Text</label>
                <input
                  type="text"
                  value={form.callToAction.buttonText}
                  onChange={(e) => updateField('callToAction.buttonText', e.target.value)}
                  placeholder="CTA button text"
                  className={cmsTheme.input}
                />
              </div>
            </div>

            <div>
              <label className={cmsTheme.label}>CTA Description</label>
              <textarea
                value={form.callToAction.description}
                onChange={(e) => updateField('callToAction.description', e.target.value)}
                placeholder="CTA description"
                rows={4}
                className={`${cmsTheme.input} h-24 resize-none`}
              />
            </div>

            {/* CTA button link is intentionally fixed (no manual editing) */}
          </div>

          {/* Section Status */}
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField('isActive', e.target.checked)}
                className="mr-2 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span className={cmsTheme.label}>Section Active (Show on website)</span>
            </label>
          </div>

          {/* Preview Section */}
          <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
            <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90`}>
              <h2 className={`${cmsTheme.title} text-lg`}>Preview</h2>
              <p className="mt-1 text-sm text-stone-600">How this section will appear on the site.</p>
            </div>
            <div className="p-6" style={{ backgroundColor: '#f8f9fa' }}>
              <div 
                className="rounded-2xl p-8 text-center relative overflow-hidden"
                style={{ backgroundColor: form.styling.backgroundColor }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-current"></div>
                  <div className="absolute top-32 right-20 w-24 h-24 rounded-full border border-current"></div>
                  <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full border border-current"></div>
                  <div className="absolute bottom-32 right-1/3 w-20 h-20 rounded-full border border-current"></div>
                </div>

                <div className="relative z-10">
                  {/* Social Media Links inline with text */}
                  <div className="mb-8">
                    <div className="flex justify-center items-center gap-2 mb-6 flex-wrap">
                      {form.socialMedia.facebook.enabled && (
                        <span className="inline-flex items-center" style={{ color: form.styling.textColor }}>
                          <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook
                        </span>
                      )}
                      
                      {form.socialMedia.instagram.enabled && (
                        <span className="inline-flex items-center" style={{ color: form.styling.textColor }}>
                          <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                          </svg>
                          Instagram
                        </span>
                      )}
                      
                      {form.socialMedia.tiktok.enabled && (
                        <span className="inline-flex items-center" style={{ color: form.styling.textColor }}>
                          <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                          TikTok
                        </span>
                      )}

                      {form.socialMedia.youtube.enabled && (
                        <span className="inline-flex items-center" style={{ color: form.styling.textColor }}>
                          <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          YouTube
                        </span>
                      )}
                    </div>

                    {/* Main Heading */}
                    <h2 
                      className="text-2xl md:text-3xl font-serif mb-6 leading-tight"
                      style={{ color: form.styling.textColor }}
                    >
                      {form.mainHeading || 'Your next level of success may require more than strategy.'}
                    </h2>
                    
                    {/* Description */}
                    <p 
                      className="text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed"
                      style={{ color: form.styling.textColor }}
                    >
                      {form.description || 'Through structured sessions using Pranic Healing, I help entrepreneurs and ambitious professionals clear energetic blockages, restore balance, and strengthen their internal capacity for growth.'}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {form.primaryButton.enabled && (
                      <button
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-base transition-all hover:shadow-lg"
                        style={{ 
                          backgroundColor: form.styling.primaryButtonColor,
                          color: form.styling.primaryButtonTextColor
                        }}
                      >
                        {form.primaryButton.text || 'Schedule a Discovery Call'}
                      </button>
                    )}
                    
                    {form.secondaryButton.enabled && (
                      <button
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-base transition-all hover:shadow-lg border-2"
                        style={{ 
                          backgroundColor: form.styling.secondaryButtonColor,
                          color: form.styling.secondaryButtonTextColor,
                          borderColor: form.styling.secondaryButtonColor
                        }}
                      >
                        {form.secondaryButton.text || 'Book a Session'}
                      </button>
                    )}
                  </div>
              </div>

              {/* Community Section Preview */}
              <section className="py-16 px-4 bg-[#EDE7DC] rounded-2xl mt-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h2
                    className="text-3xl font-serif text-stone-800 mb-6"
                    style={{ color: form.styling.textColor }}
                  >
                    {form.communitySection.heading}
                  </h2>
                  <p
                    className="text-lg text-stone-600 mb-8 leading-relaxed"
                    style={{ color: form.styling.textColor }}
                  >
                    {form.communitySection.description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6">
                      <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-stone-800 mb-2" style={{ color: form.styling.textColor }}>
                        {form.communitySection.cards?.[0]?.title}
                      </h3>
                      <p className="text-stone-600 text-sm" style={{ color: form.styling.textColor }}>
                        {form.communitySection.cards?.[0]?.description}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                      <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-stone-800 mb-2" style={{ color: form.styling.textColor }}>
                        {form.communitySection.cards?.[1]?.title}
                      </h3>
                      <p className="text-stone-600 text-sm" style={{ color: form.styling.textColor }}>
                        {form.communitySection.cards?.[1]?.description}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                      <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-stone-800 mb-2" style={{ color: form.styling.textColor }}>
                        {form.communitySection.cards?.[2]?.title}
                      </h3>
                      <p className="text-stone-600 text-sm" style={{ color: form.styling.textColor }}>
                        {form.communitySection.cards?.[2]?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA Preview */}
              <section className="py-20 px-4 bg-gradient-to-br from-amber-200 to-orange-200 text-stone-800 rounded-2xl mt-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-serif mb-6" style={{ color: form.styling.textColor }}>
                    {form.callToAction.heading}
                  </h2>
                  <p className="text-lg mb-8 opacity-90" style={{ color: form.styling.textColor }}>
                    {form.callToAction.description}
                  </p>
                  <a
                    href={form.callToAction.buttonLink}
                    className="inline-block px-8 py-4 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors font-medium shadow-sm"
                  >
                    {form.callToAction.buttonText}
                  </a>
                </div>
              </section>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`${cmsTheme.btnPrimary} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        </form>
      </div>
    </>
  );
}