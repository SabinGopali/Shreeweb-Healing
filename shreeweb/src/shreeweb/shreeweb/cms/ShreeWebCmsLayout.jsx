import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CmsNavbar from './components/CmsNavbar';
import CmsSidebar from './components/CmsSidebar';
import { SHREEWEB_CMS_SETTINGS_KEY, readJsonStorage } from '../lib/shreewebStorage';
import { stripHtmlToText } from './cmsRichTextUtils';
import ProtectedRoute from '../components/ProtectedRoute';

const titles = {
  '/shreeweb/cms/overview': ['Dashboard Overview', 'Site analytics, recent activity, and content management shortcuts for your wellness practice.'],
  '/shreeweb/cms/site-content': ['Global Site Content', 'Manage global content elements, hero copy, CTAs, and shared text across the site.'],
  '/shreeweb/cms/hero-section': ['Hero Section', 'Main landing section with background image, title, subtitle, and call-to-action button.'],
  '/shreeweb/cms/video-section': ['Video Section', 'Video content area with thumbnail image, overlay text, and social media links.'],
  '/shreeweb/cms/process-section': ['Process Section', 'Step-by-step energetic alignment process with icons and detailed descriptions.'],
  '/shreeweb/cms/target-audience': ['Target Audience', 'Define audience segments and messaging for the "This work is designed for" section.'],
  '/shreeweb/cms/hidden-cost-section': ['Hidden Cost Section', 'Content highlighting the hidden costs of high performance with supporting imagery.'],
  '/shreeweb/cms/growth-section': ['Growth Section', 'Manage the "When growth feels heavy" section with signs, background, and overlay content.'],
  '/shreeweb/cms/email-capture': ['Email Capture', 'Configure the "Stay Connected" section with email signup form and subscriber benefits.'],
  '/shreeweb/cms/navbar-menu': ['Navbar Menu', 'Manage public site header navigation links.'],
  '/shreeweb/cms/footer-menu': ['Footer Menu', 'Manage public site footer quick links and connect links.'],
  '/shreeweb/cms/about': ['About Page', 'Manage all sections of the About page including hero, philosophy, services, and call-to-action content.'],
  '/shreeweb/cms/privacy-policy': ['Privacy Policy', 'Manage Privacy Policy page content including hero section, contact information, and last updated date.'],
  '/shreeweb/cms/testimonials': ['Client Testimonials', 'Basic testimonials management for client quotes and reviews.'],
  '/shreeweb/cms/testimonials-enhanced': ['Client Testimonials', 'Advanced testimonials management with ratings, categories, and section customization.'],
  '/shreeweb/cms/testimonials-enhanced/add': ['Add Testimonial', 'Create a new client testimonial entry with rating.'],
  '/shreeweb/cms/offerings': ['Service Offerings', 'Manage service offerings, programs, and session packages with pricing and descriptions.'],
  '/shreeweb/cms/offerings/add': ['Add New Offering', 'Create a new service offering with details, pricing, and description.'],
  '/shreeweb/cms/offerings/edit': ['Edit Offering', 'Modify existing service offering details and settings.'],
  '/shreeweb/cms/faq-social': ['FAQ & Social Links', 'Manage frequently asked questions and social media links.'],
  '/shreeweb/cms/media': ['Media Library', 'Organize and manage images, videos, and other digital assets for your wellness content.'],
  '/shreeweb/cms/leads': ['Email Subscribers', 'View and manage email subscribers and lead generation data from your wellness practice.'],
  '/shreeweb/cms/contacts': ['Contact Messages', 'Handle contact form submissions and customer inquiries from potential clients.'],
  '/shreeweb/cms/bookings': ['Session Bookings', 'Manage discovery calls, session bookings, and appointment scheduling for your practice.'],
  '/shreeweb/cms/profile': ['Practitioner Profile', 'Manage your professional information, practice details, and personal bio for your wellness practice.'],
  '/shreeweb/cms/settings': ['System Settings', 'System configuration, workspace settings, and data export options for your CMS.'],
};

export default function ShreeWebCmsLayout() {
  const { pathname } = useLocation();
  const [title, desc] = titles[pathname] || ['OMSHREEGUIDANCE CMS', ''];
  const [workspaceEyebrow, setWorkspaceEyebrow] = useState('Content studio');

  const refreshWorkspaceLabel = useCallback(() => {
    const s = readJsonStorage(SHREEWEB_CMS_SETTINGS_KEY, {});
    const raw = s?.workspaceLabel;
    const label = stripHtmlToText(typeof raw === 'string' ? raw : '') || 'Content studio';
    setWorkspaceEyebrow(label);
  }, []);

  useEffect(() => {
    refreshWorkspaceLabel();
  }, [pathname, refreshWorkspaceLabel]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SHREEWEB_CMS_SETTINGS_KEY || e.key === null) refreshWorkspaceLabel();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('shreeweb-cms-settings', refreshWorkspaceLabel);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('shreeweb-cms-settings', refreshWorkspaceLabel);
    };
  }, [refreshWorkspaceLabel]);

  useEffect(() => {
    const prevPad = document.body.style.paddingTop;
    document.body.style.paddingTop = '0px';
    return () => {
      document.body.style.paddingTop = prevPad;
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-[#F4EFE6] text-stone-900">
        <CmsNavbar />
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col lg:flex-row">
          <CmsSidebar />
          <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
            <div className="w-full border-b border-stone-200/90 bg-[#F4EFE6]/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8 lg:py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">{workspaceEyebrow}</p>
              <h1 className="font-serif text-2xl text-stone-900 sm:text-3xl">{title}</h1>
              {desc ? <p className="mt-1 w-full text-sm text-stone-600">{desc}</p> : null}
            </div>
            <main className="w-full min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
              <div className="w-full min-w-0 max-w-none">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
