import React, { useState, useEffect } from 'react';
import { SHREEWEB_CMS_SETTINGS_KEY, writeJsonStorage, readJsonStorage } from '../../lib/shreewebStorage';

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const BusinessIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const WebsiteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function CmsProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    location: '',
    website: '',
    bio: '',
    specialties: '',
    certifications: '',
    experience: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = readJsonStorage(SHREEWEB_CMS_SETTINGS_KEY, {});
    if (settings.profile) {
      setProfile(settings.profile);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const settings = readJsonStorage(SHREEWEB_CMS_SETTINGS_KEY, {});
    const updatedSettings = {
      ...settings,
      profile
    };
    writeJsonStorage(SHREEWEB_CMS_SETTINGS_KEY, updatedSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white">
            <UserIcon />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-stone-900">Practitioner Profile</h2>
            <p className="text-stone-600 mt-1">Manage your professional information and practice details</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
            <UserIcon />
            Personal Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <EmailIcon />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <PhoneIcon />
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
            <BusinessIcon />
            Business Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Business/Practice Name
              </label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Your practice name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <LocationIcon />
                Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="City, State/Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <WebsiteIcon />
                Website URL
              </label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-6">Professional Details</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Bio/About
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
              placeholder="Brief description of your practice and approach..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Specialties
            </label>
            <textarea
              value={profile.specialties}
              onChange={(e) => handleInputChange('specialties', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
              placeholder="Energy healing, chakra alignment, meditation..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Certifications
            </label>
            <textarea
              value={profile.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
              placeholder="List your relevant certifications..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Years of Experience
            </label>
            <input
              type="text"
              value={profile.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="e.g., 5+ years in energy healing"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          <SaveIcon />
          {saved ? 'Profile Saved!' : 'Save Profile'}
        </button>
      </div>

      {/* Profile Preview */}
      {(profile.name || profile.businessName) && (
        <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Profile Preview</h3>
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <UserIcon />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-serif text-stone-900">
                  {profile.name || 'Your Name'}
                </h4>
                {profile.businessName && (
                  <p className="text-amber-700 font-medium">{profile.businessName}</p>
                )}
                {profile.location && (
                  <p className="text-stone-600 text-sm mt-1">{profile.location}</p>
                )}
                {profile.bio && (
                  <p className="text-stone-700 mt-3 leading-relaxed">{profile.bio}</p>
                )}
                {profile.specialties && (
                  <div className="mt-3">
                    <span className="text-sm font-medium text-stone-600">Specialties: </span>
                    <span className="text-sm text-stone-700">{profile.specialties}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}