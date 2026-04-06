import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useShreewebAuth } from '../hooks/useShreewebAuth';

const resolveImage = (image) => {
  if (!image) return '';
  if (image.startsWith('blob:') || image.startsWith('data:')) return image;
  if (/^https?:\/\//i.test(image)) return image;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  return image.startsWith('/') ? `${backendUrl}${image}` : `${backendUrl}/${image}`;
};

const navItemClass = ({ isActive }) =>
  `block rounded-full px-4 py-2 text-sm font-medium transition lg:inline-block ${
    isActive ? 'bg-orange-100 text-orange-800' : 'text-stone-700 hover:bg-orange-50'
  }`;

const fallbackLinks = [
  { to: '/shreeweb/home', label: 'Home' },
  { to: '/shreeweb/about', label: 'About' },
  { to: '/shreeweb/offers', label: 'Offerings' },
  { to: '/shreeweb/socials', label: 'Socials' },
  { to: '/shreeweb/contact', label: 'Contact' },
];

const fallbackBrand = {
  logoText: 'J',
  logoImageUrl: '',
  brandTitle: 'OMSHREEGUIDANCE',
  brandSubtitle: 'Energetic Alignment',
};

function displayName(user) {
  if (!user) return '';
  const n = user.name || user.username || user.email;
  return typeof n === 'string' ? n : '';
}

export default function ShreeWebNavbar({ fullWidth = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [links, setLinks] = useState(fallbackLinks);
  const [brand, setBrand] = useState(fallbackBrand);
  const { user, loading, logout } = useShreewebAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/backend/shreeweb-navigation-menus/public', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (!mounted || !res.ok || !data?.success) return;
        const items = Array.isArray(data?.data?.navbarItems) ? data.data.navbarItems : [];
        if (data?.data?.navbarBrand && typeof data.data.navbarBrand === 'object') {
          setBrand((prev) => ({ ...prev, ...data.data.navbarBrand }));
        }
        const mapped = items
          .filter((x) => x?.label && x?.url)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((x) => ({ to: x.url, label: x.label, external: !!x.external, newTab: !!x.newTab }));
        if (mapped.length) setLinks(mapped);
      } catch {
        // keep fallback links
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const shellClass = fullWidth
    ? 'w-full px-4 sm:px-6 lg:px-8'
    : 'mx-auto w-full max-w-7xl px-6';

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#F4EFE6]/80 backdrop-blur supports-[backdrop-filter]:bg-[#F4EFE6]/60">
      <div className={`${shellClass} flex items-center justify-between gap-2 py-3 sm:gap-3 sm:py-4`}>
        <Link
          to="/shreeweb/home"
          className="flex min-w-0 flex-shrink items-center gap-2 sm:gap-3"
          onClick={() => setMobileOpen(false)}
        >
          {brand.logoImageUrl && (
            <img 
              src={resolveImage(brand.logoImageUrl)} 
              alt={brand.brandTitle}
              className="h-12 w-12 flex-shrink-0 object-contain sm:h-14 sm:w-14"
              onError={(e) => {
                console.error('Navbar logo failed to load:', brand.logoImageUrl);
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="min-w-0 leading-tight">
            <div className="truncate text-base font-serif tracking-wide text-stone-800 sm:text-lg">{brand.brandTitle}</div>
            <div className="truncate text-xs text-stone-600">{brand.brandSubtitle}</div>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex xl:gap-2">
          {links.map(({ to, label, external, newTab }) => (
            external ? (
              <a
                key={`${to}-${label}`}
                href={to}
                target={newTab ? '_blank' : '_self'}
                rel={newTab ? 'noreferrer' : undefined}
                className="block rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-orange-50"
              >
                {label}
              </a>
            ) : (
              <NavLink key={`${to}-${label}`} to={to} className={navItemClass}>
                {label}
              </NavLink>
            )
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
          {!loading && user ? (
            <div className="hidden items-center gap-2 sm:flex sm:max-w-[140px]">
              <span className="truncate text-xs font-medium text-stone-600" title={user.email || ''}>
                {displayName(user)}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="group shrink-0 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-800 transition-all duration-200 hover:bg-orange-100 hover:shadow-md"
              >
                Log out
              </button>
            </div>
          ) : null}
          <Link
            to="/shreeweb/offers"
            className="group relative hidden overflow-hidden rounded-full border border-orange-200 bg-[#F4EFE6] px-4 py-2 text-xs font-semibold text-orange-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-md active:translate-y-0 sm:px-6 sm:py-2.5 sm:text-sm lg:inline-flex"
          >
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              Book Now
              <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white p-2 text-stone-800 transition-all duration-200 hover:bg-stone-50 hover:shadow-md lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {/* Hamburger Icon */}
            <svg 
              className="h-6 w-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                // X icon when menu is open
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                // Hamburger icon when menu is closed
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-stone-200/80 bg-[#F4EFE6] px-4 py-4 lg:hidden animate-slideDown">
          <nav className="flex flex-col gap-1">
            {links.map(({ to, label, external, newTab }) => (
              external ? (
                <a
                  key={`${to}-${label}`}
                  href={to}
                  target={newTab ? '_blank' : '_self'}
                  rel={newTab ? 'noreferrer' : undefined}
                  className="block rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-orange-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </a>
              ) : (
                <NavLink
                  key={`${to}-${label}`}
                  to={to}
                  className={navItemClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </NavLink>
              )
            ))}
            {!loading && user ? (
              <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3">
                <p className="truncate text-xs text-stone-500">Signed in</p>
                <p className="truncate font-medium text-stone-900">{displayName(user)}</p>
                <button
                  type="button"
                  className="mt-2 w-full rounded-full border border-orange-200 bg-orange-50 py-2 text-sm font-medium text-orange-800 hover:bg-orange-100 transition-colors"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  Log out
                </button>
              </div>
            ) : null}
            <Link
              to="/shreeweb/offers"
              className="group relative overflow-hidden mt-2 block rounded-full border border-orange-200 bg-[#F4EFE6] px-4 py-3 text-center text-sm font-semibold text-orange-900 transition-all duration-300 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md"
              onClick={() => setMobileOpen(false)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Book Now
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
