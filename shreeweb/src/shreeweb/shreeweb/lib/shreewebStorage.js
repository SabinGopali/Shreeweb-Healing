export const SHREEWEB_PAID_KEY = 'shreeweb_paid_v1';

/** Email capture list (same key as `EmailCapture.jsx`) */
export const SHREEWEB_EMAIL_CAPTURE_KEY = 'shreeweb_email_capture_v1';

/** CMS drafts (frontend-only until backend is wired) */
export const SHREEWEB_CMS_SITE_KEY = 'shreeweb_cms_site_v1';
export const SHREEWEB_CMS_TESTIMONIALS_KEY = 'shreeweb_cms_testimonials_v1';
export const SHREEWEB_CMS_OFFERINGS_KEY = 'shreeweb_cms_offerings_v1';
export const SHREEWEB_CMS_FAQ_KEY = 'shreeweb_cms_faq_v1';
export const SHREEWEB_CMS_SOCIAL_KEY = 'shreeweb_cms_social_v1';
export const SHREEWEB_CMS_EMBEDS_KEY = 'shreeweb_cms_embeds_v1';
/** Mirror of successful contact form submissions (for CMS inbox until API listing exists) */
export const SHREEWEB_CMS_CONTACT_INBOX_KEY = 'shreeweb_cms_contact_inbox_v1';
/** CMS workspace preferences (display name, etc.) */
export const SHREEWEB_CMS_SETTINGS_KEY = 'shreeweb_cms_settings_v1';

/** All localStorage keys owned by shreeweb CMS (export / import / clear) */
export const SHREEWEB_CMS_ALL_KEYS = [
  SHREEWEB_CMS_SITE_KEY,
  SHREEWEB_CMS_TESTIMONIALS_KEY,
  SHREEWEB_CMS_OFFERINGS_KEY,
  SHREEWEB_CMS_FAQ_KEY,
  SHREEWEB_CMS_SOCIAL_KEY,
  SHREEWEB_EMAIL_CAPTURE_KEY,
  SHREEWEB_CMS_CONTACT_INBOX_KEY,
  SHREEWEB_CMS_SETTINGS_KEY,
  'shreeweb_cms_media_notes_v1',
  'shreeweb_cms_bookings_placeholder_v1',
];

export function readJsonStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null || raw === '') return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJsonStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getEmailCaptureEntries() {
  const list = readJsonStorage(SHREEWEB_EMAIL_CAPTURE_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function getContactInboxEntries() {
  const list = readJsonStorage(SHREEWEB_CMS_CONTACT_INBOX_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function appendContactInboxEntry(payload) {
  const id = `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const entry = { ...payload, id, at: new Date().toISOString() };
  const prev = getContactInboxEntries();
  const next = [entry, ...prev].slice(0, 500);
  writeJsonStorage(SHREEWEB_CMS_CONTACT_INBOX_KEY, next);
  return entry;
}

export function removeContactInboxEntry(id) {
  const prev = getContactInboxEntries();
  const next = prev.filter((row) => row.id !== id);
  writeJsonStorage(SHREEWEB_CMS_CONTACT_INBOX_KEY, next);
}

export function isShreewebPaid() {
  try {
    return String(window.localStorage.getItem(SHREEWEB_PAID_KEY) || '') === 'true';
  } catch {
    return false;
  }
}

export function setShreewebPaid(value = true) {
  try {
    window.localStorage.setItem(SHREEWEB_PAID_KEY, value ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function clearShreewebPaid() {
  try {
    window.localStorage.removeItem(SHREEWEB_PAID_KEY);
  } catch {
    // ignore
  }
}

