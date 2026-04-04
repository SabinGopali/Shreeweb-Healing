import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ShreeWebCmsLayout from './ShreeWebCmsLayout';
import CmsOverview from './pages/CmsOverview';
import CmsSiteContent from './pages/CmsSiteContent';
import CmsTestimonials from './pages/CmsTestimonials';
import CmsTestimonialsEnhanced from './pages/CmsTestimonialsEnhanced';
import CmsTestimonialsEnhancedAdd from './pages/CmsTestimonialsEnhancedAdd';
import CmsTestimonialsEnhancedEdit from './pages/CmsTestimonialsEnhancedEdit';
import CmsAbout from './pages/CmsAbout';
import CmsPrivacyPolicy from './pages/CmsPrivacyPolicy';
import CmsCookiePolicy from './pages/CmsCookiePolicy';
import CmsOfferings from './pages/CmsOfferings';
import CmsOfferingsAdd from './pages/CmsOfferingsAdd';
import CmsOfferingsEdit from './pages/CmsOfferingsEdit';
import CmsFaqSocial from './pages/CmsFaqSocial';
import CmsMedia from './pages/CmsMedia';
import CmsLeads from './pages/CmsLeads';
import CmsContacts from './pages/CmsContacts';
import CmsBookings from './pages/CmsBookings';
import CmsProfile from './pages/CmsProfile';
import CmsEmbeds from './pages/CmsEmbeds';
import CmsSettings from './pages/CmsSettings';
import CmsHeroSection from './pages/CmsHeroSection';
import CmsVideoSection from './pages/CmsVideoSection';
import CmsProcessSection from './pages/CmsProcessSection';
import CmsTargetAudience from './pages/CmsTargetAudience';
import CmsHiddenCostSection from './pages/CmsHiddenCostSection';
import CmsGrowthSection from './pages/CmsGrowthSection';
import CmsClaritySection from './pages/CmsClaritySection';
import CmsSocialServices from './pages/CmsSocialServices';
import CmsEmailCapture from './pages/CmsEmailCapture';
import CmsNavbarMenu from './pages/CmsNavbarMenu';
import CmsFooterMenu from './pages/CmsFooterMenu';

export default function ShreeWebCmsRoutes() {
  return (
    <Routes>
      <Route element={<ShreeWebCmsLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<CmsOverview />} />
        <Route path="site-content" element={<CmsSiteContent />} />
        <Route path="hero-section" element={<CmsHeroSection />} />
        <Route path="video-section" element={<CmsVideoSection />} />
        <Route path="process-section" element={<CmsProcessSection />} />
        <Route path="target-audience" element={<CmsTargetAudience />} />
        <Route path="hidden-cost-section" element={<CmsHiddenCostSection />} />
        <Route path="growth-section" element={<CmsGrowthSection />} />
        <Route path="clarity-section" element={<CmsClaritySection />} />
        <Route path="social-services" element={<CmsSocialServices />} />
        <Route path="email-capture" element={<CmsEmailCapture />} />
        <Route path="navbar-menu" element={<CmsNavbarMenu />} />
        <Route path="footer-menu" element={<CmsFooterMenu />} />
        <Route path="about" element={<CmsAbout />} />
        <Route path="privacy-policy" element={<CmsPrivacyPolicy />} />
        <Route path="cookie-policy" element={<CmsCookiePolicy />} />
        <Route path="testimonials" element={<CmsTestimonials />} />
        <Route path="testimonials-enhanced" element={<CmsTestimonialsEnhanced />} />
        <Route path="testimonials-enhanced/add" element={<CmsTestimonialsEnhancedAdd />} />
        <Route path="testimonials-enhanced/edit/:id" element={<CmsTestimonialsEnhancedEdit />} />
        <Route path="offerings" element={<CmsOfferings />} />
        <Route path="offerings/add" element={<CmsOfferingsAdd />} />
        <Route path="offerings/edit/:id" element={<CmsOfferingsEdit />} />
        <Route path="faq-social" element={<CmsFaqSocial />} />
        <Route path="media" element={<CmsMedia />} />
        <Route path="leads" element={<CmsLeads />} />
        <Route path="contacts" element={<CmsContacts />} />
        <Route path="bookings" element={<CmsBookings />} />
        <Route path="profile" element={<CmsProfile />} />
        <Route path="embeds" element={<CmsEmbeds />} />
        <Route path="settings" element={<CmsSettings />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>
    </Routes>
  );
}
