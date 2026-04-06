import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmailCapture from './EmailCapture';

const resolveImage = (image) => {
  if (!image) return '';
  if (image.startsWith('blob:') || image.startsWith('data:')) return image;
  if (/^https?:\/\//i.test(image)) return image;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  return image.startsWith('/') ? `${backendUrl}${image}` : `${backendUrl}/${image}`;
};

export default function ShreeWebFooter() {
  const [quickLinks, setQuickLinks] = useState([
    { label: 'Home', url: '/shreeweb/home', external: false, newTab: false },
    { label: 'About', url: '/shreeweb/about', external: false, newTab: false },
    { label: 'Offerings', url: '/shreeweb/offers', external: false, newTab: false },
    { label: 'Contact', url: '/shreeweb/contact', external: false, newTab: false },
    { label: 'Book Now', url: '/shreeweb/booking', external: false, newTab: false },
  ]);
  const [connectLinks, setConnectLinks] = useState([
    { label: 'Social Media', url: '/shreeweb/socials', external: false, newTab: false },
    { label: 'Privacy Policy', url: '/shreeweb/privacy-policy', external: false, newTab: false },
    { label: 'Cookie Policy', url: '/shreeweb/cookie-policy', external: false, newTab: false },
    { label: 'Terms of Service', url: '/shreeweb/terms-of-service', external: false, newTab: false },
  ]);

  const fallbackFooterBrand = {
    logoText: 'J',
    logoImageUrl: '',
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
  };

  const [footerBrand, setFooterBrand] = useState(fallbackFooterBrand);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/backend/shreeweb-navigation-menus/public', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (!mounted || !res.ok || !data?.success) return;
        const quick = Array.isArray(data.data?.footerQuickLinks) ? data.data.footerQuickLinks : [];
        const connect = Array.isArray(data.data?.footerConnectLinks) ? data.data.footerConnectLinks : [];
        if (data?.data?.footerBrand && typeof data.data.footerBrand === 'object') {
          setFooterBrand((prev) => ({ ...prev, ...data.data.footerBrand }));
        }
        if (quick.length) setQuickLinks(quick);
        if (connect.length) setConnectLinks(connect);
      } catch {
        // keep fallbacks
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const renderMenuLink = (item, className, bulletClassName) => {
    const content = (
      <>
        <div className={bulletClassName}></div>
        {item.label}
      </>
    );
    if (item.external) {
      return (
        <a
          key={`${item.url}-${item.label}`}
          className={className}
          href={item.url}
          target={item.newTab ? '_blank' : '_self'}
          rel={item.newTab ? 'noreferrer' : undefined}
        >
          {content}
        </a>
      );
    }
    return (
      <Link key={`${item.url}-${item.label}`} className={className} to={item.url}>
        {content}
      </Link>
    );
  };

  return (
    <footer 
      className="relative bg-gradient-to-br from-stone-100 via-amber-50 to-orange-100 overflow-hidden -mt-0"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-8 left-8 w-32 h-32 border border-stone-400 rounded-full"></div>
        <div className="absolute bottom-8 right-8 w-20 h-20 border border-amber-400 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 border border-orange-400 rounded-full"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
          {/* Brand Section */}
          <div 
            className="space-y-6 lg:col-span-2"
          >
            <div className="flex items-center gap-4">
              {footerBrand.logoImageUrl ? (
                <img 
                  src={resolveImage(footerBrand.logoImageUrl)} 
                  alt={footerBrand.brandTitle}
                  className="h-20 w-20 flex-shrink-0 object-contain"
                  onError={(e) => {
                    console.error('Footer logo failed to load:', footerBrand.logoImageUrl);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-stone-800 to-stone-700 text-white shadow-lg">
                  <span className="text-2xl font-bold tracking-widest">{footerBrand.logoText}</span>
                </div>
              )}
              <div className="leading-tight">
                <div className="text-2xl font-serif tracking-wide text-stone-800">{footerBrand.brandTitle}</div>
                <div className="text-sm text-stone-600 font-medium">{footerBrand.brandSubtitle}</div>
              </div>
            </div>
            <p className="text-stone-600 leading-relaxed max-w-lg text-lg">{footerBrand.description}</p>
            
            {/* Newsletter Signup */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50">
              <h4 className="text-lg font-serif text-stone-800 mb-3">{footerBrand.newsletterTitle}</h4>
              <p className="text-stone-600 text-sm mb-4">{footerBrand.newsletterSubtitle}</p>
              <EmailCapture 
                context="footer-newsletter"
                buttonText={footerBrand.newsletterButtonText}
                placeholderText={footerBrand.newsletterPlaceholder}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div 
            className="space-y-6"
          >
            <h3 className="text-xl font-serif text-stone-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-amber-400 rounded-full"></div>
              Quick Links
            </h3>
            <div className="flex flex-col gap-3 text-stone-600">
              {quickLinks.map((item) =>
                renderMenuLink(
                  item,
                  'hover:text-stone-800 transition-colors flex items-center gap-2 group',
                  'w-1.5 h-1.5 bg-stone-400 rounded-full group-hover:bg-amber-400 transition-colors'
                )
              )}
            </div>
          </div>

          {/* Connect & Legal */}
          <div 
            className="space-y-6"
          >
            <h3 className="text-xl font-serif text-stone-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-400 rounded-full"></div>
              Connect
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-3 text-stone-600">
                {connectLinks.map((item) =>
                  renderMenuLink(
                    item,
                    'hover:text-stone-800 transition-colors flex items-center gap-2 group',
                    'w-1.5 h-1.5 bg-stone-400 rounded-full group-hover:bg-orange-400 transition-colors'
                  )
                )}
              </div>
              
              {/* Social Media Icons */}
              <div className="pt-2">
                <p className="text-sm text-stone-600 mb-3 font-medium">Follow Our Journey</p>
                <div className="flex gap-3">
                  <a
                    className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all duration-300 shadow-sm border border-stone-200/50"
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-pink-100 hover:scale-110 transition-all duration-300 shadow-sm border border-stone-200/50"
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.876.876 1.366 2.027 1.366 3.324s-.49 2.448-1.366 3.323c-.875.876-2.026 1.366-3.323 1.366zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.876-.875-1.366-2.026-1.366-3.323s.49-2.448 1.366-3.323c.875-.876 2.026-1.366 3.323-1.366s2.448.49 3.323 1.366c.876.875 1.366 2.026 1.366 3.323s-.49 2.448-1.366 3.323c-.875.876-2.026 1.366-3.323 1.366z"/>
                    </svg>
                  </a>
                  <a
                    className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-sm border border-stone-200/50"
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div 
          className="mt-16 pt-8 border-t border-stone-300/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-sm">
              © {new Date().getFullYear()} {footerBrand.brandTitle}. {footerBrand.copyrightSuffix}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-stone-500 text-sm">
              <span>{footerBrand.bottomText1}</span>
              <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
              <span>{footerBrand.bottomText2}</span>
              <div className="w-1 h-1 bg-stone-400 rounded-full hidden sm:block"></div>
              <Link to="/shreeweb/cms/overview" className="text-xs text-stone-400 hover:text-stone-700">
                {footerBrand.cmsLinkLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

