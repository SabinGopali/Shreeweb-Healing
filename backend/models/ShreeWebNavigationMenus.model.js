import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, default: '' },
    url: { type: String, default: '' },
    external: { type: Boolean, default: false },
    newTab: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const shreeWebNavigationMenusSchema = new mongoose.Schema(
  {
    navbarBrand: {
      logoText: { type: String, default: 'J' },
      logoImageUrl: { type: String, default: '' },
      brandTitle: { type: String, default: 'OMSHREEGUIDANCE' },
      brandSubtitle: { type: String, default: 'Energetic Alignment' },
    },
    navbarItems: { type: [menuItemSchema], default: [] },
    footerBrand: {
      logoText: { type: String, default: 'J' },
      logoImageUrl: { type: String, default: '' },
      brandTitle: { type: String, default: 'OMSHREEGUIDANCE' },
      brandSubtitle: { type: String, default: 'Energetic Alignment' },
      description: {
        type: String,
        default:
          'Energetic Alignment for Sustainable Expansion. A calm, structured approach to help you restore clarity and expand naturally through Pranic Healing sessions.',
      },
      newsletterTitle: { type: String, default: 'Stay Aligned' },
      newsletterSubtitle: { type: String, default: 'Get updates on new sessions and insights' },
      newsletterPlaceholder: { type: String, default: 'Your email' },
      newsletterButtonText: { type: String, default: 'Join' },
      bottomText1: { type: String, default: 'Made with intention' },
      bottomText2: { type: String, default: 'Designed for clarity' },
      cmsLinkLabel: { type: String, default: 'Content studio' },
      copyrightSuffix: { type: String, default: 'All rights reserved.' },
    },
    footerQuickLinks: { type: [menuItemSchema], default: [] },
    footerConnectLinks: { type: [menuItemSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShreeWebNavigationMenus = mongoose.model('ShreeWebNavigationMenus', shreeWebNavigationMenusSchema);

export default ShreeWebNavigationMenus;

