import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
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
import CmsTermsOfService from './pages/CmsTermsOfService';
import CmsOfferings from './pages/CmsOfferings';
import CmsOfferingsAdd from './pages/CmsOfferingsAdd';
import CmsOfferingsEdit from './pages/CmsOfferingsEdit';
import CmsFaqSocial from './pages/CmsFaqSocial';
import CmsMedia from './pages/CmsMedia';
import CmsLeads from './pages/CmsLeads';
import CmsEmailCampaigns from './pages/CmsEmailCampaigns';
import CmsEmailCampaignCreate from './pages/CmsEmailCampaignCreate';
import CmsEmailCampaignEdit from './pages/CmsEmailCampaignEdit';
import CmsEmailCampaignView from './pages/CmsEmailCampaignView';
import CmsContacts from './pages/CmsContacts';
import CmsBookings from './pages/CmsBookings';
import CmsProfile from './pages/CmsProfile';
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
    <ProtectedRoute>
      <Routes>
        <Route element={<ShreeWebCmsLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<CmsOverview />} />
          
          {/* Content Management - Requires canManageContent permission */}
          <Route path="site-content" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsSiteContent />
            </ProtectedRoute>
          } />
          <Route path="hero-section" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsHeroSection />
            </ProtectedRoute>
          } />
          <Route path="video-section" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsVideoSection />
            </ProtectedRoute>
          } />
          <Route path="process-section" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsProcessSection />
            </ProtectedRoute>
          } />
          <Route path="target-audience" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsTargetAudience />
            </ProtectedRoute>
          } />
          <Route path="hidden-cost-section" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsHiddenCostSection />
            </ProtectedRoute>
          } />
          <Route path="growth-section" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsGrowthSection />
            </ProtectedRoute>
          } />
          <Route path="clarity-section" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsClaritySection />
            </ProtectedRoute>
          } />
          <Route path="social-services" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsSocialServices />
            </ProtectedRoute>
          } />
          <Route path="email-capture" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsEmailCapture />
            </ProtectedRoute>
          } />
          <Route path="navbar-menu" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsNavbarMenu />
            </ProtectedRoute>
          } />
          <Route path="footer-menu" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsFooterMenu />
            </ProtectedRoute>
          } />
          <Route path="about" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsAbout />
            </ProtectedRoute>
          } />
          <Route path="privacy-policy" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsPrivacyPolicy />
            </ProtectedRoute>
          } />
          <Route path="cookie-policy" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsCookiePolicy />
            </ProtectedRoute>
          } />
          <Route path="terms-of-service" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsTermsOfService />
            </ProtectedRoute>
          } />
          <Route path="testimonials" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsTestimonials />
            </ProtectedRoute>
          } />
          <Route path="testimonials-enhanced" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsTestimonialsEnhanced />
            </ProtectedRoute>
          } />
          <Route path="testimonials-enhanced/add" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsTestimonialsEnhancedAdd />
            </ProtectedRoute>
          } />
          <Route path="testimonials-enhanced/edit/:id" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsTestimonialsEnhancedEdit />
            </ProtectedRoute>
          } />
          <Route path="offerings" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsOfferings />
            </ProtectedRoute>
          } />
          <Route path="offerings/add" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsOfferingsAdd />
            </ProtectedRoute>
          } />
          <Route path="offerings/edit/:id" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsOfferingsEdit />
            </ProtectedRoute>
          } />
          <Route path="faq-social" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsFaqSocial />
            </ProtectedRoute>
          } />
          <Route path="media" element={
            <ProtectedRoute requirePermission="canManageContent">
              <CmsMedia />
            </ProtectedRoute>
          } />
          
          {/* Data Access - All admins can view */}
          <Route path="leads" element={<CmsLeads />} />
          <Route path="email-campaigns" element={<CmsEmailCampaigns />} />
          <Route path="email-campaigns/create" element={<CmsEmailCampaignCreate />} />
          <Route path="email-campaigns/edit/:id" element={<CmsEmailCampaignEdit />} />
          <Route path="email-campaigns/view/:id" element={<CmsEmailCampaignView />} />
          <Route path="contacts" element={<CmsContacts />} />
          <Route path="bookings" element={<CmsBookings />} />
          
          {/* Profile - All admins can access */}
          <Route path="profile" element={<CmsProfile />} />
          
          {/* Settings - Requires canManageSettings */}
          <Route path="settings" element={
            <ProtectedRoute requirePermission="canManageSettings">
              <CmsSettings />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}
