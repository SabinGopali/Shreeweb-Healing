import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function CmsProfile() {
  const { admin } = useAuth();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/backend/shreeweb-auth/profile', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch profile');
      }

      if (data.success && data.admin) {
        setProfile({
          firstName: data.admin.profile?.firstName || '',
          lastName: data.admin.profile?.lastName || '',
          email: data.admin.email || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await fetch('/backend/shreeweb-auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update profile');
      }

      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-stone-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-stone-600 mt-1">Manage your professional information and account details</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

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
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Your last name"
              />
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
            <EmailIcon />
            Account Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={admin?.username || ''}
                disabled
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl bg-stone-50 text-stone-500 cursor-not-allowed"
              />
              <p className="text-xs text-stone-500 mt-1">Username cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
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
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                disabled
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl bg-stone-50 text-stone-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-6">Account Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stone-50 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Account Status</p>
            <p className="text-lg font-medium text-stone-900">
              {admin?.isActive ? (
                <span className="inline-flex items-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Active
                </span>
              ) : (
                <span className="text-red-600">Inactive</span>
              )}
            </p>
          </div>

          <div className="bg-stone-50 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Last Login</p>
            <p className="text-lg font-medium text-stone-900">
              {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
            </p>
          </div>

          <div className="bg-stone-50 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Member Since</p>
            <p className="text-lg font-medium text-stone-900">
              {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Preview */}
      {(profile.firstName || profile.lastName) && (
        <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Profile Preview</h3>
          <div className="bg-white rounded-xl p-6 border border-stone-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <span className="text-lg font-bold">
                  {profile.firstName?.[0] || profile.lastName?.[0] || 'A'}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-serif text-stone-900">
                  {[profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Your Name'}
                </h4>
                {profile.email && (
                  <p className="text-stone-600 text-sm mt-1 flex items-center gap-2">
                    <EmailIcon />
                    {profile.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
