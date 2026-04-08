import React, { useState, useEffect } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [aboutData, setAboutData] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [pranicBenefits, setPranicBenefits] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({});

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

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
        setGalleryImages(data.data.imageGallery?.images || []);
        setPranicBenefits(data.data.pranicHealing?.benefits || []);
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

  const updatePranicBenefitField = (index, field, value) => {
    const updatedBenefits = [...pranicBenefits];
    updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
    setPranicBenefits(updatedBenefits);
  };

  const addPranicBenefit = () => {
    setPranicBenefits([...pranicBenefits, { title: '', description: '', icon: 'heart', order: pranicBenefits.length + 1 }]);
  };

  const removePranicBenefit = (index) => {
    const updatedBenefits = pranicBenefits.filter((_, i) => i !== index);
    setPranicBenefits(updatedBenefits);
  };

  const updateGalleryImageField = (index, field, value) => {
    const updatedImages = [...galleryImages];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setGalleryImages(updatedImages);
  };

  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, { url: '', alt: '', caption: '', order: galleryImages.length + 1 }]);
  };

  const removeGalleryImage = (index) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
  };

  const handleImageGalleryUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      enabled: formData.get('enabled') === 'true',
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      images: galleryImages
    };
    updateSection('imageGallery', updates);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    // Create local preview URL
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrls(prev => ({ ...prev, [index]: localPreviewUrl }));

    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('galleryImage', file);

      const response = await fetch('/backend/shreeweb-about/upload-gallery-image', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to upload image');
      }

      if (data.success) {
        // Update the image URL in the gallery
        const updatedImages = [...galleryImages];
        updatedImages[index] = { 
          ...updatedImages[index], 
          url: data.imageUrl 
        };
        setGalleryImages(updatedImages);
        
        // Clean up local preview URL
        URL.revokeObjectURL(localPreviewUrl);
        setPreviewUrls(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[index];
          return newPreviews;
        });
        
        alert('Image uploaded successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert(err.message || 'Failed to upload image');
      
      // Clean up preview on error
      URL.revokeObjectURL(localPreviewUrl);
      setPreviewUrls(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMultipleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('galleryImages', file);
      });

      const response = await fetch('/backend/shreeweb-about/upload-multiple-gallery-images', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to upload images');
      }

      if (data.success && data.images) {
        // Add all uploaded images to the gallery
        const newImages = data.images.map((img, idx) => ({
          url: img.url,
          alt: '',
          caption: '',
          order: galleryImages.length + idx + 1
        }));
        
        setGalleryImages([...galleryImages, ...newImages]);
        alert(`${data.images.length} image(s) uploaded successfully!`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      alert(err.message || 'Failed to upload images');
    } finally {
      setUploadingImage(false);
    }
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
              image: aboutData.aboutMe?.image || '',
              imageAlt: formData.get('imageAlt'),
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

            {/* Image Upload */}
            <div className="border-t border-stone-200 pt-4">
              <label className={cmsTheme.label}>Section Image (Right Side)</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      setUploadingImage(true);
                      const formData = new FormData();
                      formData.append('aboutMeImage', file);

                      const response = await fetch('/backend/shreeweb-about/upload-about-me-image', {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                      });

                      const data = await response.json();

                      if (response.ok && data.success) {
                        // Update aboutData with new image
                        setAboutData(prev => ({
                          ...prev,
                          aboutMe: {
                            ...prev.aboutMe,
                            image: data.imageUrl
                          }
                        }));
                        alert('Image uploaded successfully!');
                      } else {
                        throw new Error(data?.message || 'Failed to upload image');
                      }
                    } catch (err) {
                      console.error('Error uploading image:', err);
                      alert(err.message || 'Failed to upload image');
                    } finally {
                      setUploadingImage(false);
                    }
                  }
                  e.target.value = ''; // Reset input
                }}
                disabled={uploadingImage}
                className={`${cmsTheme.input} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100`}
              />
              <p className="text-xs text-stone-500 mt-1">
                {uploadingImage ? 'Uploading...' : 'Recommended: 800x1000px (4:5 aspect ratio)'}
              </p>
              
              {aboutData.aboutMe?.image && (
                <div className="mt-3">
                  <p className="text-xs text-green-600 mb-2">✓ Current image: {aboutData.aboutMe.image}</p>
                  <img
                    src={aboutData.aboutMe.image}
                    alt="About Me preview"
                    className="w-full max-w-xs h-auto object-cover rounded-lg border-2 border-stone-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label className={cmsTheme.label}>Image Alt Text</label>
              <input
                type="text"
                name="imageAlt"
                defaultValue={aboutData.aboutMe?.imageAlt || 'About me'}
                className={cmsTheme.input}
                placeholder="About me"
              />
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

        {/* Pranic Healing Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Pranic Healing Section</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updates = {
              enabled: formData.get('enabled') === 'true',
              title: formData.get('title'),
              subtitle: formData.get('subtitle'),
              content: formData.get('content'),
              image: aboutData.pranicHealing?.image || '',
              imageAlt: formData.get('imageAlt'),
              benefits: pranicBenefits
            };
            updateSection('pranicHealing', updates);
          }} className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="enabled"
                  value="true"
                  defaultChecked={aboutData.pranicHealing?.enabled !== false}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span className={cmsTheme.label}>Enable Pranic Healing Section</span>
              </label>
            </div>
            <div>
              <label className={cmsTheme.label}>Title</label>
              <input
                type="text"
                name="title"
                defaultValue={aboutData.pranicHealing?.title}
                className={cmsTheme.input}
                placeholder="About Pranic Healing"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                defaultValue={aboutData.pranicHealing?.subtitle}
                className={cmsTheme.input}
                placeholder="Ancient wisdom for modern transformation"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Content</label>
              <textarea
                name="content"
                defaultValue={aboutData.pranicHealing?.content}
                rows={12}
                className={cmsTheme.input}
                placeholder="Pranic Healing is a highly evolved and tested system..."
              />
              <p className="text-xs text-stone-500 mt-1">
                Use double line breaks (press Enter twice) to create new paragraphs
              </p>
            </div>

            {/* Image Upload */}
            <div className="border-t border-stone-200 pt-4">
              <label className={cmsTheme.label}>Section Image (Left Side)</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      setUploadingImage(true);
                      const formData = new FormData();
                      formData.append('pranicHealingImage', file);

                      const response = await fetch('/backend/shreeweb-about/upload-pranic-healing-image', {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                      });

                      const data = await response.json();

                      if (response.ok && data.success) {
                        setAboutData(prev => ({
                          ...prev,
                          pranicHealing: {
                            ...prev.pranicHealing,
                            image: data.imageUrl
                          }
                        }));
                        alert('Image uploaded successfully!');
                      } else {
                        throw new Error(data?.message || 'Failed to upload image');
                      }
                    } catch (err) {
                      console.error('Error uploading image:', err);
                      alert(err.message || 'Failed to upload image');
                    } finally {
                      setUploadingImage(false);
                    }
                  }
                  e.target.value = '';
                }}
                disabled={uploadingImage}
                className={`${cmsTheme.input} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100`}
              />
              <p className="text-xs text-stone-500 mt-1">
                {uploadingImage ? 'Uploading...' : 'Recommended: 800x1000px (4:5 aspect ratio)'}
              </p>
              
              {aboutData.pranicHealing?.image && (
                <div className="mt-3">
                  <p className="text-xs text-green-600 mb-2">✓ Current image: {aboutData.pranicHealing.image}</p>
                  <img
                    src={aboutData.pranicHealing.image}
                    alt="Pranic Healing preview"
                    className="w-full max-w-xs h-auto object-cover rounded-lg border-2 border-stone-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label className={cmsTheme.label}>Image Alt Text</label>
              <input
                type="text"
                name="imageAlt"
                defaultValue={aboutData.pranicHealing?.imageAlt || 'Pranic Healing energy work'}
                className={cmsTheme.input}
                placeholder="Pranic Healing energy work"
              />
            </div>

            {/* Benefits */}
            <div className="border-t border-stone-200 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className={`${cmsTheme.label} mb-0`}>Benefits</label>
                <button
                  type="button"
                  onClick={addPranicBenefit}
                  className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  + Add Benefit
                </button>
              </div>
              
              {pranicBenefits.map((benefit, index) => (
                <div key={index} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-stone-600">Benefit {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removePranicBenefit(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <label className={cmsTheme.label}>Icon</label>
                      <select
                        value={benefit.icon || 'heart'}
                        onChange={(e) => updatePranicBenefitField(index, 'icon', e.target.value)}
                        className={cmsTheme.input}
                      >
                        <option value="heart">Heart</option>
                        <option value="brain">Brain/Mind</option>
                        <option value="lightning">Energy/Lightning</option>
                        <option value="shield">Protection/Shield</option>
                      </select>
                    </div>
                    <div>
                      <label className={cmsTheme.label}>Title</label>
                      <input
                        type="text"
                        value={benefit.title || ''}
                        onChange={(e) => updatePranicBenefitField(index, 'title', e.target.value)}
                        placeholder="Physical Wellness"
                        className={cmsTheme.input}
                      />
                    </div>
                    <div>
                      <label className={cmsTheme.label}>Order</label>
                      <input
                        type="number"
                        value={benefit.order || index + 1}
                        onChange={(e) => updatePranicBenefitField(index, 'order', parseInt(e.target.value))}
                        className={cmsTheme.input}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className={cmsTheme.label}>Description</label>
                    <textarea
                      value={benefit.description || ''}
                      onChange={(e) => updatePranicBenefitField(index, 'description', e.target.value)}
                      placeholder="Accelerates the body's natural healing ability..."
                      className={`${cmsTheme.input} h-20 resize-none`}
                    />
                  </div>
                </div>
              ))}

              {pranicBenefits.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-stone-300 rounded-xl">
                  <p className="text-stone-600 mb-2">No benefits added yet</p>
                  <button
                    type="button"
                    onClick={addPranicBenefit}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    Add your first benefit
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update Pranic Healing Section'}
            </button>
          </form>
        </div>

        {/* Image Gallery Section */}
        <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
          <h2 className={`${cmsTheme.title} text-xl mb-4`}>Image Gallery Section</h2>
          <form onSubmit={handleImageGalleryUpdate} className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="enabled"
                  value="true"
                  defaultChecked={aboutData.imageGallery?.enabled !== false}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span className={cmsTheme.label}>Enable Image Gallery Section</span>
              </label>
            </div>
            <div>
              <label className={cmsTheme.label}>Section Title</label>
              <input
                type="text"
                name="title"
                defaultValue={aboutData.imageGallery?.title || 'Experience the Journey'}
                className={cmsTheme.input}
                placeholder="Experience the Journey"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Section Subtitle</label>
              <input
                type="text"
                name="subtitle"
                defaultValue={aboutData.imageGallery?.subtitle || 'Moments of transformation and clarity'}
                className={cmsTheme.input}
                placeholder="Moments of transformation and clarity"
              />
            </div>

            {/* Gallery Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className={`${cmsTheme.label} mb-0`}>Gallery Images</label>
                <div className="flex gap-2">
                  <label className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleMultipleImageUpload(files);
                        }
                        e.target.value = ''; // Reset input
                      }}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    + Upload Multiple
                  </label>
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    + Add Slot
                  </button>
                </div>
              </div>
              
              {uploadingImage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-700">Uploading images...</span>
                  </div>
                </div>
              )}
              
              {galleryImages.map((image, index) => (
                <div key={index} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-stone-600">Image {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className={cmsTheme.label}>Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(index, file);
                          }
                        }}
                        disabled={uploadingImage}
                        className={`${cmsTheme.input} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100`}
                      />
                      <p className="text-xs text-stone-500 mt-1">
                        {uploadingImage ? 'Uploading...' : 'Select an image file to upload (JPG, PNG, WebP)'}
                      </p>
                      {image.url && !previewUrls[index] && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Image uploaded: {image.url}
                        </p>
                      )}
                      {previewUrls[index] && (
                        <p className="text-xs text-blue-600 mt-1">
                          ⏳ Uploading image...
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className={cmsTheme.label}>Alt Text</label>
                        <input
                          type="text"
                          value={image.alt || ''}
                          onChange={(e) => updateGalleryImageField(index, 'alt', e.target.value)}
                          placeholder="Energy healing session"
                          className={cmsTheme.input}
                        />
                      </div>
                      <div>
                        <label className={cmsTheme.label}>Order</label>
                        <input
                          type="number"
                          value={image.order || index + 1}
                          onChange={(e) => updateGalleryImageField(index, 'order', parseInt(e.target.value))}
                          className={cmsTheme.input}
                          min="1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={cmsTheme.label}>Caption (optional)</label>
                      <textarea
                        value={image.caption || ''}
                        onChange={(e) => updateGalleryImageField(index, 'caption', e.target.value)}
                        placeholder="A moment of transformation..."
                        className={`${cmsTheme.input} h-16 resize-none`}
                      />
                    </div>
                    
                    {/* Image Preview */}
                    {(image.url || previewUrls[index]) && (
                      <div className="mt-3">
                        <label className={`${cmsTheme.label} mb-2 block`}>Preview</label>
                        <div className="relative rounded-xl overflow-hidden border-2 border-stone-200 bg-stone-50">
                          <img
                            src={previewUrls[index] || image.url}
                            alt={image.alt || 'Preview'}
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-64 items-center justify-center bg-stone-100">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-stone-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <p className="text-stone-500 text-sm">Failed to load image</p>
                            </div>
                          </div>
                          {previewUrls[index] && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-sm font-medium">Uploading...</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {image.url && !previewUrls[index] && (
                          <p className="text-xs text-stone-500 mt-2">
                            Aspect ratio: 4:5 (portrait) • Recommended: 800x1000px
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {galleryImages.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-stone-300 rounded-xl">
                  <svg className="w-12 h-12 text-stone-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-stone-600 mb-2">No images added yet</p>
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    Add your first image
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className={cmsTheme.btnPrimary}
            >
              {saving ? 'Saving...' : 'Update Image Gallery'}
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