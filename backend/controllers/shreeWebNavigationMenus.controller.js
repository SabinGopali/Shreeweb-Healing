import ShreeWebNavigationMenus from '../models/ShreeWebNavigationMenus.model.js';
import { errorHandler } from '../utils/error.js';

function uid() {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultPayload = {
  navbarBrand: {
    logoText: 'J',
    brandTitle: 'JAPANDI',
    brandSubtitle: 'Energetic Alignment',
  },
  navbarItems: [
    { id: uid(), label: 'Home', url: '/shreeweb/home', external: false, newTab: false, order: 0 },
    { id: uid(), label: 'About', url: '/shreeweb/about', external: false, newTab: false, order: 1 },
    { id: uid(), label: 'Offerings', url: '/shreeweb/offers', external: false, newTab: false, order: 2 },
    { id: uid(), label: 'Socials', url: '/shreeweb/socials', external: false, newTab: false, order: 3 },
    { id: uid(), label: 'Contact', url: '/shreeweb/contact', external: false, newTab: false, order: 4 },
  ],
  footerBrand: {
    logoText: 'J',
    brandTitle: 'JAPANDI',
    brandSubtitle: 'Energetic Alignment',
    description:
      'Energetic Alignment for Sustainable Expansion. A calm, structured approach to help you restore clarity and expand naturally through Pranic Healing sessions.',
    newsletterTitle: 'Stay Aligned',
    newsletterSubtitle: 'Get updates on new sessions and insights',
    newsletterPlaceholder: 'Your email',
    newsletterButtonText: 'Join',
    bottomText1: 'Made with intention',
    bottomText2: 'Designed for clarity',
    cmsLinkLabel: 'Content studio',
    copyrightSuffix: 'All rights reserved.',
  },
  footerQuickLinks: [
    { id: uid(), label: 'Home', url: '/shreeweb/home', external: false, newTab: false, order: 0 },
    { id: uid(), label: 'About', url: '/shreeweb/about', external: false, newTab: false, order: 1 },
    { id: uid(), label: 'Offerings', url: '/shreeweb/offers', external: false, newTab: false, order: 2 },
    { id: uid(), label: 'Contact', url: '/shreeweb/contact', external: false, newTab: false, order: 3 },
    { id: uid(), label: 'Book Now', url: '/shreeweb/booking', external: false, newTab: false, order: 4 },
  ],
  footerConnectLinks: [
    { id: uid(), label: 'Social Media', url: '/shreeweb/socials', external: false, newTab: false, order: 0 },
    { id: uid(), label: 'Privacy Policy', url: '/shreeweb/privacy-policy', external: false, newTab: false, order: 1 },
    { id: uid(), label: 'Cookie Policy', url: '/shreeweb/cookie-policy', external: false, newTab: false, order: 2 },
    { id: uid(), label: 'Terms of Service', url: '/shreeweb/terms-of-service', external: false, newTab: false, order: 3 },
  ],
};

const normalizeItems = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((x) => x && typeof x === 'object')
    .map((x, i) => ({
      id: typeof x.id === 'string' && x.id.trim() ? x.id : uid(),
      label: typeof x.label === 'string' ? x.label : '',
      url: typeof x.url === 'string' ? x.url : '',
      external: Boolean(x.external),
      newTab: Boolean(x.newTab),
      order: Number.isFinite(Number(x.order)) ? Number(x.order) : i,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

function toData(doc) {
  if (!doc) return { ...defaultPayload };
  const obj = doc.toObject ? doc.toObject() : doc;

  const navbarBrand = {
    ...defaultPayload.navbarBrand,
    ...(obj.navbarBrand || {}),
  };

  const footerBrand = {
    ...defaultPayload.footerBrand,
    ...(obj.footerBrand || {}),
  };

  const navbarItems = normalizeItems(obj.navbarItems);
  const footerQuickLinks = normalizeItems(obj.footerQuickLinks);
  const footerConnectLinks = normalizeItems(obj.footerConnectLinks);

  return {
    navbarBrand,
    navbarItems: navbarItems.length ? navbarItems : defaultPayload.navbarItems,
    footerBrand,
    footerQuickLinks: footerQuickLinks.length ? footerQuickLinks : defaultPayload.footerQuickLinks,
    footerConnectLinks: footerConnectLinks.length ? footerConnectLinks : defaultPayload.footerConnectLinks,
  };
}

async function getOrCreateActiveDoc() {
  const existing = await ShreeWebNavigationMenus.findOne({ isActive: true }).sort({ updatedAt: -1 });
  if (existing) return existing;
  return ShreeWebNavigationMenus.create({ ...defaultPayload, isActive: true });
}

export const getPublicNavigationMenus = async (req, res, next) => {
  try {
    const doc = await ShreeWebNavigationMenus.findOne({ isActive: true }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: toData(doc) });
  } catch {
    return next(errorHandler(500, 'Failed to fetch navigation menu data'));
  }
};

export const getNavigationMenus = async (req, res, next) => {
  try {
    const doc = await ShreeWebNavigationMenus.findOne({ isActive: true }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: toData(doc) });
  } catch {
    return next(errorHandler(500, 'Failed to fetch navigation menu data'));
  }
};

export const updateNavbarItems = async (req, res, next) => {
  try {
    const items = req.body?.navbarItems;
    const brand = req.body?.navbarBrand;
    if (!Array.isArray(items)) return next(errorHandler(400, 'navbarItems must be an array'));
    const doc = await getOrCreateActiveDoc();
    doc.navbarItems = normalizeItems(items);
    if (brand && typeof brand === 'object') {
      doc.navbarBrand = {
        ...doc.navbarBrand.toObject?.() || doc.navbarBrand,
        ...brand,
      };
    }
    await doc.save();
    return res.status(200).json({ success: true, data: toData(doc) });
  } catch {
    return next(errorHandler(500, 'Failed to update navbar menu items'));
  }
};

export const updateFooterItems = async (req, res, next) => {
  try {
    const quick = req.body?.footerQuickLinks;
    const connect = req.body?.footerConnectLinks;
    const brand = req.body?.footerBrand;
    if (!Array.isArray(quick) || !Array.isArray(connect)) {
      return next(errorHandler(400, 'footerQuickLinks and footerConnectLinks must be arrays'));
    }
    const doc = await getOrCreateActiveDoc();
    doc.footerQuickLinks = normalizeItems(quick);
    doc.footerConnectLinks = normalizeItems(connect);
    if (brand && typeof brand === 'object') {
      doc.footerBrand = {
        ...doc.footerBrand.toObject?.() || doc.footerBrand,
        ...brand,
      };
    }
    await doc.save();
    return res.status(200).json({ success: true, data: toData(doc) });
  } catch {
    return next(errorHandler(500, 'Failed to update footer menu items'));
  }
};

export const uploadNavbarLogo = async (req, res, next) => {
  try {
    if (!req.file) return next(errorHandler(400, 'No logo file uploaded'));
    const logoImageUrl = `/backend/uploads/${req.file.filename}`;
    const doc = await getOrCreateActiveDoc();
    doc.navbarBrand.logoImageUrl = logoImageUrl;
    await doc.save();
    return res.status(200).json({ success: true, logoImageUrl, data: toData(doc) });
  } catch {
    return next(errorHandler(500, 'Failed to upload navbar logo'));
  }
};

export const uploadFooterLogo = async (req, res, next) => {
  try {
    if (!req.file) return next(errorHandler(400, 'No logo file uploaded'));
    const logoImageUrl = `/backend/uploads/${req.file.filename}`;
    const doc = await getOrCreateActiveDoc();
    doc.footerBrand.logoImageUrl = logoImageUrl;
    await doc.save();
    return res.status(200).json({ success: true, logoImageUrl, data: toData(doc) });
  } catch {
    return next(errorHandler(500, 'Failed to upload footer logo'));
  }
};

