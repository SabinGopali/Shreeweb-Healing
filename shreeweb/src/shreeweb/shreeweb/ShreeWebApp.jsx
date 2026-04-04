import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ShreeWebCmsRoutes from './cms/ShreeWebCmsRoutes';
import ShreeWebLayout from './ShreeWebLayout';
import ShreeWebHome from './pages/Home';
import ShreeWebAbout from './pages/About';
import ShreeWebOffers from './pages/Offerings';
import ShreeWebSocials from './pages/Socials';
import ShreeWebContact from './pages/Contact';
import ShreeWebPrivacyPolicy from './pages/PrivacyPolicy';
import ShreeWebCookiePolicy from './pages/CookiePolicy';
import ShreeWebTermsOfService from './pages/TermsOfService';
import ShreeWebBooking from './pages/Booking';
import ShreeWebPaymentConfirmation from './pages/PaymentConfirmation';
import ShreeWebLogin from './pages/ShreeWebLogin';
import ShreeWebSignup from './pages/ShreeWebSignup';
import ShreeWebForgotPassword from './pages/ShreeWebForgotPassword';
import ShreeWebCmsLogin from './pages/ShreeWebCmsLogin';
import { AuthProvider } from './contexts/AuthContext';

export default function ShreeWebApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="cms-login" element={<ShreeWebCmsLogin />} />
        <Route path="cms/*" element={<ShreeWebCmsRoutes />} />
        <Route element={<ShreeWebLayout />}>
          <Route index element={<ShreeWebHome />} />
          <Route path="home" element={<ShreeWebHome />} />
          <Route path="login" element={<ShreeWebLogin />} />
          <Route path="signup" element={<ShreeWebSignup />} />
          <Route path="forgot-password" element={<ShreeWebForgotPassword />} />
          <Route path="about" element={<ShreeWebAbout />} />
          <Route path="offers" element={<ShreeWebOffers />} />
          <Route path="socials" element={<ShreeWebSocials />} />
          <Route path="contact" element={<ShreeWebContact />} />
          <Route path="privacy-policy" element={<ShreeWebPrivacyPolicy />} />
          <Route path="cookie-policy" element={<ShreeWebCookiePolicy />} />
          <Route path="terms-of-service" element={<ShreeWebTermsOfService />} />
          <Route path="booking" element={<ShreeWebBooking />} />
          <Route path="payment-confirmation" element={<ShreeWebPaymentConfirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

