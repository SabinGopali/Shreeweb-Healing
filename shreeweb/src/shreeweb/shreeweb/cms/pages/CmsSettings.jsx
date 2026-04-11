import { useEffect, useMemo, useState, useRef } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';
import CmsRichTextEditor, { plainToHtml } from '../components/CmsRichTextEditor';
import { isEditorEmpty } from '../cmsRichTextUtils';
import Toast from '../components/Toast';
import {
  SHREEWEB_CMS_SETTINGS_KEY,
  SHREEWEB_CMS_ALL_KEYS,
  SHREEWEB_CMS_SITE_KEY,
  SHREEWEB_CMS_TESTIMONIALS_KEY,
  SHREEWEB_CMS_OFFERINGS_KEY,
  SHREEWEB_CMS_FAQ_KEY,
  SHREEWEB_CMS_SOCIAL_KEY,
  SHREEWEB_EMAIL_CAPTURE_KEY,
  SHREEWEB_CMS_CONTACT_INBOX_KEY,
  readJsonStorage,
  writeJsonStorage,
} from '../../lib/shreewebStorage';
import { 
  FaUser,
  FaBell,
  FaShieldAlt,
  FaEnvelope,
  FaSave,
  FaLock,
  FaCheckCircle,
  FaDownload,
  FaUpload,
  FaTrash,
  FaDatabase
} from 'react-icons/fa';

const STORAGE_LABEL = {
  [SHREEWEB_CMS_SITE_KEY]: 'Site content',
  [SHREEWEB_CMS_TESTIMONIALS_KEY]: 'Testimonials',
  [SHREEWEB_CMS_OFFERINGS_KEY]: 'Offerings',
  [SHREEWEB_CMS_FAQ_KEY]: 'FAQ',
  [SHREEWEB_CMS_SOCIAL_KEY]: 'Social links',
  [SHREEWEB_EMAIL_CAPTURE_KEY]: 'Email captures',
  [SHREEWEB_CMS_CONTACT_INBOX_KEY]: 'Contact inbox',
  [SHREEWEB_CMS_SETTINGS_KEY]: 'Workspace settings',
  'shreeweb_cms_media_notes_v1': 'Media notes',
  'shreeweb_cms_bookings_placeholder_v1': 'Booking placeholders',
};

function storageAreaLabel(key) {
  return STORAGE_LABEL[key] || key.replace(/^shreeweb_/, '').replace(/_v\d+$/, '').replace(/_/g, ' ');
}

function storageHint(raw) {
  if (raw == null) return 'empty';
  if (typeof raw === 'string') return raw.trim() ? 'note saved' : 'empty';
  if (Array.isArray(raw)) return `${raw.length} item(s)`;
  if (typeof raw === 'object') return `${Object.keys(raw).length} field(s)`;
  return 'set';
}

export default function CmsSettings() {
  const [workspaceLabel, setWorkspaceLabel] = useState('Content studio');
  const [editorNote, setEditorNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState('');
  const [importMsg, setImportMsg] = useState('');
  const [clearMsg, setClearMsg] = useState('');
  
  // Account Settings (Email & Password)
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [emailData, setEmailData] = useState({
    currentEmail: '',
    newEmail: '',
    confirmEmail: '',
    otp: '',
    step: 'email',
    otpSent: false,
    otpVerified: false,
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    otp: '',
    step: 'password',
    otpSent: false,
    otpVerified: false,
  });

  // Two-Factor Authentication (2FA)
  const [twoFAData, setTwoFAData] = useState({
    action: null, // 'enable' | 'disable'
    otp: '',
    step: 'idle', // idle | otp | success
    otpSent: false,
  });

  const [otpTimer, setOtpTimer] = useState(0);
  const otpInputRefs = useRef([]);

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    contentUpdates: true,
    systemAlerts: true,
    backupReminders: true
  });
  const [notificationToggleSaving, setNotificationToggleSaving] = useState({});

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    requirePasswordChange: false
  });
  useEffect(() => {
    const s = readJsonStorage(SHREEWEB_CMS_SETTINGS_KEY, {});
    if (typeof s?.workspaceLabel === 'string') setWorkspaceLabel(s.workspaceLabel);
    if (typeof s?.editorNote === 'string') setEditorNote(s.editorNote);
    
    // Load settings from backend
    loadSettings();
  }, []);

  // OTP Timer
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer]);

  const summary = useMemo(() => {
    return SHREEWEB_CMS_ALL_KEYS.map((key) => {
      const raw = readJsonStorage(key, null);
      const has = raw != null && !(typeof raw === 'string' && raw.trim() === '');
      return { key, has, hint: has ? storageHint(raw) : 'empty' };
    });
  }, [saved, msg, importMsg, clearMsg]);

  const loadSettings = async () => {
    try {
      const response = await fetch('/backend/shreeweb-settings', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data.profile) {
          setEmailData(prev => ({ ...prev, currentEmail: data.data.profile.email || 'admin@shreeweb.com' }));
        }
        if (data.data.notifications) {
          setNotificationSettings(data.data.notifications);
        }
        if (data.data.security) {
          setSecuritySettings(data.data.security);
        }
      } else {
        // Set default values if backend not available
        setEmailData(prev => ({ ...prev, currentEmail: 'admin@shreeweb.com' }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Set default values if backend not available
      setEmailData(prev => ({ ...prev, currentEmail: 'admin@shreeweb.com' }));
    }
  };
  // OTP Input Handlers
  const handleOtpInput = (index, value, type) => {
    let data, setData;
    if (type === 'email') {
      data = emailData;
      setData = setEmailData;
    } else if (type === 'password') {
      data = passwordData;
      setData = setPasswordData;
    } else if (type === 'twofa') {
      data = twoFAData;
      setData = setTwoFAData;
    } else return;

    if (value.length > 1) value = value.slice(0, 1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = (data.otp || '').split('');
    while (newOtp.length < 6) newOtp.push('');
    newOtp[index] = value;
    setData({ ...data, otp: newOtp.join('') });

    if (value && index < 5 && otpInputRefs.current[type]?.[index + 1]) {
      otpInputRefs.current[type][index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e, type) => {
    let data = type === 'email' ? emailData : type === 'password' ? passwordData : twoFAData;
    if (e.key === 'Backspace' && !data.otp[index] && index > 0) {
      otpInputRefs.current[type]?.[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e, type) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    let setData =
      type === 'email' ? setEmailData : type === 'password' ? setPasswordData : type === 'twofa' ? setTwoFAData : null;
    if (!setData) return;

    setData((prev) => ({ ...prev, otp: pastedData }));

    const lastIndex = Math.min(pastedData.length - 1, 5);
    if (otpInputRefs.current[type]?.[lastIndex]) {
      otpInputRefs.current[type][lastIndex].focus();
    }
  };

  // Notification Handlers
  const handleNotificationChange = async (field, value) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }));
    await updateNotificationToggle(field, value);
  };

  const updateNotificationToggle = async (field, value) => {
    setNotificationToggleSaving((prev) => ({ ...prev, [field]: true }));
    
    try {
      const response = await fetch('/backend/shreeweb-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notifications: { [field]: value } }),
      });

      if (response.ok) {
        setToast({
          show: true,
          message: `${field.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}!`,
          type: 'success'
        });
      } else {
        setNotificationSettings((prev) => ({ ...prev, [field]: !value }));
        setToast({
          show: true,
          message: `Failed to update ${field}`,
          type: 'error'
        });
      }
    } catch (error) {
      setNotificationSettings((prev) => ({ ...prev, [field]: !value }));
      setToast({
        show: true,
        message: `Failed to update ${field}`,
        type: 'error'
      });
    } finally {
      setNotificationToggleSaving((prev) => ({ ...prev, [field]: false }));
    }
  };
  // API functions for OTP
  const sendOtp = async (type) => {
    try {
      setSaving(true);
      
      if (type === 'email') {
        if (!emailData.newEmail || !emailData.confirmEmail) {
          setToast({ show: true, message: 'Please fill in all email fields', type: 'error' });
          return;
        }
        if (emailData.newEmail !== emailData.confirmEmail) {
          setToast({ show: true, message: 'New email and confirm email do not match', type: 'error' });
          return;
        }
        if (emailData.newEmail === emailData.currentEmail) {
          setToast({ show: true, message: 'New email must be different from current email', type: 'error' });
          return;
        }

        const response = await fetch('/backend/shreeweb-auth/send-email-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ newEmail: emailData.newEmail }),
        });

        if (response.ok) {
          setEmailData((prev) => ({ ...prev, step: 'otp', otpSent: true, otp: '' }));
          setOtpTimer(300);
          setToast({ show: true, message: 'OTP sent to your new email address!', type: 'success' });
        } else {
          const error = await response.json();
          setToast({ show: true, message: error.message || 'Failed to send OTP', type: 'error' });
        }
      } else {
        if (!passwordData.newPassword || !passwordData.confirmPassword) {
          setToast({ show: true, message: 'Please fill in all password fields', type: 'error' });
          return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setToast({ show: true, message: 'Passwords do not match', type: 'error' });
          return;
        }
        if (passwordData.newPassword.length < 6) {
          setToast({ show: true, message: 'Password must be at least 6 characters', type: 'error' });
          return;
        }

        const response = await fetch('/backend/shreeweb-auth/send-password-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          setPasswordData((prev) => ({ ...prev, step: 'otp', otpSent: true, otp: '' }));
          setOtpTimer(300);
          setToast({ show: true, message: 'OTP sent to your registered email!', type: 'success' });
        } else {
          const error = await response.json();
          setToast({ show: true, message: error.message || 'Failed to send OTP', type: 'error' });
        }
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setToast({ show: true, message: 'An error occurred while sending OTP', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  const sendTwoFaOtp = async (action) => {
    try {
      setSaving(true);
      
      const response = await fetch('/backend/shreeweb-auth/send-2fa-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setTwoFAData({ action, otp: '', step: 'otp', otpSent: true });
        setOtpTimer(300);
        setToast({ show: true, message: `OTP sent to your email to ${action} 2FA`, type: 'success' });
      } else {
        const error = await response.json();
        setToast({ show: true, message: error.message || 'Failed to send OTP', type: 'error' });
      }
    } catch (err) {
      console.error('Error sending 2FA OTP:', err);
      setToast({ show: true, message: 'An error occurred while sending OTP', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      setSaving(true);
      
      if (emailData.otp.length !== 6) {
        setToast({ show: true, message: 'Please enter the complete 6-digit OTP', type: 'error' });
        return;
      }

      const response = await fetch('/backend/shreeweb-auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ otp: emailData.otp, newEmail: emailData.newEmail }),
      });

      if (response.ok) {
        setEmailData((prev) => ({ ...prev, step: 'success', currentEmail: prev.newEmail, otpVerified: true }));
        setToast({ show: true, message: 'Email changed successfully!', type: 'success' });
        
        setTimeout(() => {
          setEmailData({
            currentEmail: emailData.newEmail,
            newEmail: '',
            confirmEmail: '',
            otp: '',
            step: 'email',
            otpSent: false,
            otpVerified: false,
          });
          setOtpTimer(0);
        }, 3000);
      } else {
        const error = await response.json();
        setToast({ show: true, message: error.message || 'Invalid OTP. Please try again.', type: 'error' });
        setEmailData((prev) => ({ ...prev, otp: '' }));
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setToast({ show: true, message: 'An error occurred while verifying OTP', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  const verifyPasswordOtp = async () => {
    try {
      setSaving(true);
      
      if (passwordData.otp.length !== 6) {
        setToast({ show: true, message: 'Please enter the complete 6-digit OTP', type: 'error' });
        return;
      }

      const response = await fetch('/backend/shreeweb-auth/verify-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ otp: passwordData.otp, newPassword: passwordData.newPassword }),
      });

      if (response.ok) {
        setPasswordData((prev) => ({ ...prev, step: 'success', otpVerified: true }));
        setToast({ show: true, message: 'Password changed successfully!', type: 'success' });
        
        setTimeout(() => {
          setPasswordData({
            newPassword: '',
            confirmPassword: '',
            otp: '',
            step: 'password',
            otpSent: false,
            otpVerified: false,
          });
          setOtpTimer(0);
        }, 3000);
      } else {
        const error = await response.json();
        setToast({ show: true, message: error.message || 'Invalid OTP. Please try again.', type: 'error' });
        setPasswordData((prev) => ({ ...prev, otp: '' }));
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setToast({ show: true, message: 'An error occurred while verifying OTP', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const verifyTwoFaOtp = async () => {
    try {
      setSaving(true);
      
      if (!twoFAData.otp || twoFAData.otp.length !== 6) {
        setToast({ show: true, message: 'Please enter the complete 6-digit OTP', type: 'error' });
        return;
      }

      const response = await fetch('/backend/shreeweb-auth/verify-2fa-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ otp: twoFAData.otp, action: twoFAData.action }),
      });

      if (response.ok) {
        const result = await response.json();
        const enabled = twoFAData.action === 'enable';
        setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: enabled, ...(result.settings?.security || {}) }));
        setTwoFAData((prev) => ({ ...prev, step: 'success' }));
        setToast({ show: true, message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully!`, type: 'success' });

        setTimeout(() => {
          setTwoFAData({ action: null, otp: '', step: 'idle', otpSent: false });
          setOtpTimer(0);
        }, 3000);
      } else {
        const error = await response.json();
        setToast({ show: true, message: error.message || 'Invalid OTP. Please try again.', type: 'error' });
        setTwoFAData((prev) => ({ ...prev, otp: '' }));
      }
    } catch (err) {
      console.error('Error verifying 2FA OTP:', err);
      setToast({ show: true, message: 'An error occurred while verifying OTP', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  const bundle = () => {
    const data = {};
    SHREEWEB_CMS_ALL_KEYS.forEach((k) => {
      data[k] = readJsonStorage(k, null);
    });
    return {
      exportedAt: new Date().toISOString(),
      source: 'OMSHREEGUIDANCE-shreeweb-cms',
      data,
    };
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(bundle(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `OMSHREEGUIDANCE-cms-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg('Backup file download started.');
  };

  const saveWorkspace = (e) => {
    e.preventDefault();
    const prev = readJsonStorage(SHREEWEB_CMS_SETTINGS_KEY, {});
    writeJsonStorage(SHREEWEB_CMS_SETTINGS_KEY, {
      ...prev,
      workspaceLabel: isEditorEmpty(workspaceLabel) ? plainToHtml('Content studio') : workspaceLabel,
      editorNote,
    });
    setSaved(true);
    window.dispatchEvent(new Event('shreeweb-cms-settings'));
    setTimeout(() => setSaved(false), 2000);
  };

  const onImportFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    setImportMsg('');
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        const data = parsed?.data && typeof parsed.data === 'object' ? parsed.data : parsed;
        if (!data || typeof data !== 'object') {
          setImportMsg('Invalid backup file: use a file exported from this CMS.');
          return;
        }
        let n = 0;
        SHREEWEB_CMS_ALL_KEYS.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            writeJsonStorage(key, data[key]);
            n += 1;
          }
        });
        setImportMsg(`Restored ${n} data area(s). Refresh other CMS tabs if open.`);
        window.dispatchEvent(new Event('shreeweb-cms-settings'));
      } catch {
        setImportMsg('Could not read that backup file.');
      }
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (!window.confirm('Remove all OMSHREEGUIDANCE CMS data from this browser localStorage? This cannot be undone.')) return;
    SHREEWEB_CMS_ALL_KEYS.forEach((k) => {
      try {
        window.localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });
    setClearMsg('All CMS keys cleared.');
    setWorkspaceLabel(plainToHtml('Content studio'));
    setEditorNote('');
    window.dispatchEvent(new Event('shreeweb-cms-settings'));
  };
  return (
    <div className={cmsTheme.pageWrap}>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />

      {/* Account Settings - Change Email */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-white">
            <FaEnvelope className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`${cmsTheme.title} text-lg`}>Change Email</h2>
            <p className={cmsTheme.subtitle}>Update your email address with OTP verification</p>
          </div>
        </div>
        
        {emailData.step === 'email' && (
          <>
            <div>
              <label className={cmsTheme.label}>Current Email</label>
              <input
                type="email"
                value={emailData.currentEmail}
                className={`${cmsTheme.input} bg-stone-50`}
                disabled
              />
            </div>
            <div>
              <label className={cmsTheme.label}>New Email</label>
              <input
                type="email"
                value={emailData.newEmail}
                onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                className={cmsTheme.input}
                placeholder="new@email.com"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Confirm New Email</label>
              <input
                type="email"
                value={emailData.confirmEmail}
                onChange={(e) => setEmailData(prev => ({ ...prev, confirmEmail: e.target.value }))}
                className={cmsTheme.input}
                placeholder="new@email.com"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => sendOtp('email')}
                disabled={saving}
                className={`${cmsTheme.btnPrimary} disabled:opacity-50 flex items-center gap-2`}
              >
                <FaEnvelope className="w-4 h-4" />
                {saving ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </>
        )}
        {emailData.step === 'otp' && (
          <>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
              <p className="text-sm font-semibold text-stone-700">
                OTP sent to <strong>{emailData.newEmail}</strong>
              </p>
            </div>
            <div>
              <label className={cmsTheme.label}>Enter OTP</label>
              <div className="flex gap-2 justify-center mt-2" onPaste={(e) => handlePasteOtp(e, 'email')}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (!otpInputRefs.current['email']) otpInputRefs.current['email'] = [];
                      otpInputRefs.current['email'][index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={emailData.otp[index] || ''}
                    onChange={(e) => handleOtpInput(index, e.target.value, 'email')}
                    onKeyDown={(e) => handleOtpKeyDown(index, e, 'email')}
                    className="w-12 h-12 text-center text-lg font-bold border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-800/10 focus:border-stone-400"
                  />
                ))}
              </div>
              <div className="flex justify-center mt-4">
                {otpTimer > 0 ? (
                  <p className="text-sm text-stone-600">
                    Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                  </p>
                ) : (
                  <button
                    onClick={() => sendOtp('email')}
                    className="text-sm text-stone-800 hover:text-stone-600 font-semibold"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEmailData((prev) => ({ ...prev, step: 'email', otp: '', otpSent: false }))}
                className={cmsTheme.btnGhost}
              >
                Back
              </button>
              <button
                onClick={verifyEmailOtp}
                disabled={saving || emailData.otp.length !== 6}
                className={`${cmsTheme.btnPrimary} disabled:opacity-50 flex items-center gap-2`}
              >
                <FaCheckCircle className="w-4 h-4" />
                Verify & Change
              </button>
            </div>
          </>
        )}

        {emailData.step === 'success' && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
            <FaCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-green-900">Email Changed Successfully!</p>
          </div>
        )}
      </div>
      {/* Account Settings - Change Password */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-white">
            <FaLock className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`${cmsTheme.title} text-lg`}>Change Password</h2>
            <p className={cmsTheme.subtitle}>Update your account password with OTP verification</p>
          </div>
        </div>
        
        {passwordData.step === 'password' && (
          <>
            <div>
              <label className={cmsTheme.label}>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className={cmsTheme.input}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className={cmsTheme.label}>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={cmsTheme.input}
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => sendOtp('password')}
                disabled={saving}
                className={`${cmsTheme.btnPrimary} disabled:opacity-50 flex items-center gap-2`}
              >
                <FaLock className="w-4 h-4" />
                {saving ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </>
        )}

        {passwordData.step === 'otp' && (
          <>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
              <p className="text-sm font-semibold text-stone-700">
                OTP sent to your registered email
              </p>
            </div>
            <div>
              <label className={cmsTheme.label}>Enter OTP</label>
              <div className="flex gap-2 justify-center mt-2" onPaste={(e) => handlePasteOtp(e, 'password')}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (!otpInputRefs.current['password']) otpInputRefs.current['password'] = [];
                      otpInputRefs.current['password'][index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={passwordData.otp[index] || ''}
                    onChange={(e) => handleOtpInput(index, e.target.value, 'password')}
                    onKeyDown={(e) => handleOtpKeyDown(index, e, 'password')}
                    className="w-12 h-12 text-center text-lg font-bold border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-800/10 focus:border-stone-400"
                  />
                ))}
              </div>
              <div className="flex justify-center mt-4">
                {otpTimer > 0 ? (
                  <p className="text-sm text-stone-600">
                    Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                  </p>
                ) : (
                  <button
                    onClick={() => sendOtp('password')}
                    className="text-sm text-stone-800 hover:text-stone-600 font-semibold"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPasswordData((prev) => ({ ...prev, step: 'password', otp: '', otpSent: false }))}
                className={cmsTheme.btnGhost}
              >
                Back
              </button>
              <button
                onClick={verifyPasswordOtp}
                disabled={saving || passwordData.otp.length !== 6}
                className={`${cmsTheme.btnPrimary} disabled:opacity-50 flex items-center gap-2`}
              >
                <FaCheckCircle className="w-4 h-4" />
                Verify & Change
              </button>
            </div>
          </>
        )}

        {passwordData.step === 'success' && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
            <FaCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-green-900">Password Changed Successfully!</p>
          </div>
        )}
      </div>
      {/* Notification Settings */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-white">
            <FaBell className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`${cmsTheme.title} text-lg`}>Notifications</h2>
            <p className={cmsTheme.subtitle}>Configure your notification preferences</p>
          </div>
        </div>
        
        {Object.entries(notificationSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-stone-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                {key.includes('email') && 'Receive email notifications'}
                {key.includes('content') && 'Get alerts for content updates'}
                {key.includes('system') && 'Get alerts for system activities'}
                {key.includes('backup') && 'Get reminders for data backups'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleNotificationChange(key, e.target.checked)}
                disabled={notificationToggleSaving[key]}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-stone-800/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-800"></div>
            </label>
          </div>
        ))}
      </div>
      {/* Security Settings */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-white">
            <FaShieldAlt className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`${cmsTheme.title} text-lg`}>Security</h2>
            <p className={cmsTheme.subtitle}>Manage your account security settings</p>
          </div>
        </div>
        
        {/* 2FA enable/disable with OTP */}
        {twoFAData.step === 'idle' && (
          <div className="p-4 bg-stone-50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-900">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-stone-500 mt-1">
                  {securitySettings.twoFactorAuth ? '2FA is currently enabled.' : '2FA is currently disabled.'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${securitySettings.twoFactorAuth ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-700'}`}>
                {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              {!securitySettings.twoFactorAuth && (
                <button
                  onClick={() => sendTwoFaOtp('enable')}
                  disabled={saving}
                  className={`${cmsTheme.btnPrimary} disabled:opacity-50`}
                >
                  {saving ? 'Sending OTP...' : 'Enable 2FA (OTP)'}
                </button>
              )}
              {securitySettings.twoFactorAuth && (
                <button
                  onClick={() => sendTwoFaOtp('disable')}
                  disabled={saving}
                  className={`${cmsTheme.btnGhost} disabled:opacity-50`}
                >
                  {saving ? 'Sending OTP...' : 'Disable 2FA (OTP)'}
                </button>
              )}
            </div>
          </div>
        )}

        {twoFAData.step === 'otp' && (
          <div className="space-y-4 p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-700">
                  Enter OTP to {twoFAData.action === 'enable' ? 'enable' : 'disable'} 2FA
                </p>
                <p className="text-xs text-stone-600">OTP sent to your registered email.</p>
              </div>
              <span className="text-xs font-semibold text-stone-600 bg-white px-3 py-1 rounded-full border border-stone-200">
                Expires in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex gap-2 justify-center" onPaste={(e) => handlePasteOtp(e, 'twofa')}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    if (!otpInputRefs.current['twofa']) otpInputRefs.current['twofa'] = [];
                    otpInputRefs.current['twofa'][index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={twoFAData.otp[index] || ''}
                  onChange={(e) => handleOtpInput(index, e.target.value, 'twofa')}
                  onKeyDown={(e) => handleOtpKeyDown(index, e, 'twofa')}
                  className="w-12 h-12 text-center text-lg font-bold border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-800/10 focus:border-stone-400"
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              {otpTimer > 0 ? (
                <p className="text-xs text-stone-600">
                  Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                </p>
              ) : (
                <button
                  onClick={() => sendTwoFaOtp(twoFAData.action)}
                  className="text-xs text-stone-700 font-semibold hover:text-stone-800"
                >
                  Resend OTP
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTwoFAData({ action: null, otp: '', step: 'idle', otpSent: false });
                    setOtpTimer(0);
                  }}
                  className={cmsTheme.btnGhost}
                >
                  Cancel
                </button>
                <button
                  onClick={verifyTwoFaOtp}
                  disabled={saving || twoFAData.otp.length !== 6}
                  className={`${cmsTheme.btnPrimary} disabled:opacity-50`}
                >
                  {saving ? 'Verifying...' : 'Verify & Apply'}
                </button>
              </div>
            </div>
          </div>
        )}

        {twoFAData.step === 'success' && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
            <FaCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-green-900">
              2FA {twoFAData.action === 'enable' ? 'Enabled' : 'Disabled'} Successfully!
            </p>
          </div>
        )}
      </div>
      {/* Workspace Settings */}
      <form onSubmit={saveWorkspace} className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-white">
            <FaUser className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`${cmsTheme.title} text-lg`}>Workspace</h2>
            <p className={cmsTheme.subtitle}>Configure your workspace settings</p>
          </div>
        </div>
        
        <p className="text-sm text-stone-600">
          The label below appears as the small eyebrow above each CMS page title. Internal note is for your team only (stored locally).
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <CmsRichTextEditor
            label="Eyebrow label"
            value={workspaceLabel}
            onChange={setWorkspaceLabel}
            placeholder="Shown above each CMS page title (plain text is extracted for display)"
            minHeight="sm"
          />
          <CmsRichTextEditor
            label="Internal note"
            value={editorNote}
            onChange={setEditorNote}
            placeholder="Team-only reminder — rich text supported"
            minHeight="md"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={`${cmsTheme.btnPrimary} flex items-center gap-2`}>
            <FaSave className="w-4 h-4" />
            Save workspace
          </button>
          {saved ? <span className="text-sm text-green-700 font-semibold">Saved.</span> : null}
        </div>
      </form>
      {/* Data Management */}
      <div className={`${cmsTheme.card} w-full overflow-hidden p-0`}>
        <div className={`${cmsTheme.cardPadding} border-b border-stone-200/90 flex items-center gap-3`}>
          <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-white">
            <FaDatabase className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`${cmsTheme.title} text-lg`}>Local data overview</h2>
            <p className={cmsTheme.subtitle}>What is saved in this browser for the OMSHREEGUIDANCE CMS.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-100/80 text-xs font-semibold uppercase tracking-wider text-stone-600">
              <tr>
                <th className="px-4 py-3">Data area</th>
                <th className="w-28 px-4 py-3">Status</th>
                <th className="px-4 py-3">Summary</th>
              </tr>
            </thead>
            <tbody>
              {summary.map(({ key, has, hint }) => (
                <tr key={key} className="border-b border-stone-100 align-top hover:bg-white/80">
                  <td className="px-4 py-3 font-medium text-stone-900">{storageAreaLabel(key)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        has ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200/80 text-stone-600'
                      }`}
                    >
                      {has ? 'In use' : 'Empty'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{hint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full space-y-4`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-white">
            <FaDownload className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`${cmsTheme.title} text-lg`}>Backup & restore</h2>
            <p className={cmsTheme.subtitle}>Download or upload a single backup file (used only for this CMS).</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={`${cmsTheme.btnPrimary} flex items-center gap-2`} onClick={download}>
            <FaDownload className="w-4 h-4" />
            Download backup
          </button>
          <label className={`${cmsTheme.btnGhost} cursor-pointer flex items-center gap-2`}>
            <FaUpload className="w-4 h-4" />
            <input type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} />
            Restore from backup
          </label>
        </div>
        {msg ? <p className="text-sm text-stone-700 font-semibold">{msg}</p> : null}
        {importMsg ? <p className="text-sm text-stone-800 font-semibold">{importMsg}</p> : null}
      </div>
      {/* Danger Zone */}
      <div className={`${cmsTheme.card} ${cmsTheme.cardPadding} w-full border-red-200/80 bg-red-50/40`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
            <FaTrash className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`${cmsTheme.title} text-lg text-red-900`}>Danger zone</h2>
            <p className="text-sm text-red-600">Removes every CMS-related key listed above from localStorage on this device.</p>
          </div>
        </div>
        
        <button 
          type="button" 
          className="rounded-full border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-800 hover:bg-red-50 flex items-center gap-2" 
          onClick={clearAll}
        >
          <FaTrash className="w-4 h-4" />
          Clear all CMS local data
        </button>
        {clearMsg ? <p className="mt-3 text-sm text-red-900 font-semibold">{clearMsg}</p> : null}
      </div>

    </div>
  );
}