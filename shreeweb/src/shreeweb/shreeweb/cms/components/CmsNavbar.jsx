import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/** Grouped nav — Browse menu + search metadata */
export const CMS_NAV_GROUPS = [
  {
    title: 'Dashboard & Analytics',
    items: [
      { to: '/shreeweb/cms/overview', label: 'Dashboard Overview', keywords: ['dashboard', 'home', 'summary', 'stats', 'analytics'] },
    ],
  },
  {
    title: 'Page Content Sections',
    items: [
      { to: '/shreeweb/cms/hero-section', label: 'Hero Section', keywords: ['hero', 'banner', 'main', 'title', 'background', 'landing'] },
      { to: '/shreeweb/cms/video-section', label: 'Video Section', keywords: ['video', 'youtube', 'media', 'overlay', 'thumbnail'] },
      { to: '/shreeweb/cms/process-section', label: 'Process Section', keywords: ['process', 'steps', 'workflow', 'alignment', 'methodology'] },
      { to: '/shreeweb/cms/target-audience', label: 'Target Audience', keywords: ['audience', 'target', 'segments', 'designed for', 'clients'] },
      { to: '/shreeweb/cms/hidden-cost-section', label: 'Hidden Cost Section', keywords: ['cost', 'hidden', 'performance', 'price', 'investment'] },
      { to: '/shreeweb/cms/growth-section', label: 'Growth Section', keywords: ['growth', 'heavy', 'signs', 'expansion', 'scaling'] },
      { to: '/shreeweb/cms/email-capture', label: 'Email Capture', keywords: ['email', 'capture', 'signup', 'newsletter', 'stay connected', 'subscribe'] },
      { to: '/shreeweb/cms/navbar-menu', label: 'Navbar Menu', keywords: ['navbar', 'header', 'navigation', 'menu'] },
      { to: '/shreeweb/cms/footer-menu', label: 'Footer Menu', keywords: ['footer', 'links', 'navigation', 'menu'] },
    ],
  },
  {
    title: 'Content & Media',
    items: [
      { to: '/shreeweb/cms/site-content', label: 'Global Site Content', keywords: ['site', 'content', 'copy', 'cta', 'brand', 'global', 'text'] },
      { to: '/shreeweb/cms/offerings', label: 'Service Offerings', keywords: ['offerings', 'programs', 'packages', 'services', 'sessions', 'pricing'] },
      { to: '/shreeweb/cms/testimonials-enhanced', label: 'Client Testimonials', keywords: ['testimonials', 'reviews', 'quotes', 'clients', 'feedback', 'social proof'] },
      { to: '/shreeweb/cms/faq-social', label: 'FAQ & Social Links', keywords: ['faq', 'questions', 'social', 'instagram', 'facebook', 'links'] },
      { to: '/shreeweb/cms/media', label: 'Media Library', keywords: ['media', 'images', 'assets', 'files', 'library', 'uploads'] },
    ],
  },
  {
    title: 'Lead Management',
    items: [
      { to: '/shreeweb/cms/leads', label: 'Email Subscribers', keywords: ['leads', 'email', 'capture', 'signups', 'subscribers', 'newsletter'] },
      { to: '/shreeweb/cms/contacts', label: 'Contact Messages', keywords: ['contacts', 'inbox', 'messages', 'forms', 'inquiries', 'communication'] },
      { to: '/shreeweb/cms/bookings', label: 'Session Bookings', keywords: ['bookings', 'calendar', 'sessions', 'appointments', 'scheduling', 'discovery calls'] },
    ],
  },
  {
    title: 'Account & Profile',
    items: [
      { to: '/shreeweb/cms/profile', label: 'Practitioner Profile', keywords: ['profile', 'account', 'personal', 'bio', 'practitioner', 'information', 'details'] },
    ],
  },
  {
    title: 'System Configuration',
    items: [
      { to: '/shreeweb/cms/embeds', label: 'Third-party Integrations', keywords: ['integrations', 'embeds', 'shopify', 'calendar', 'payment', 'external'] },
      { to: '/shreeweb/cms/settings', label: 'System Settings', keywords: ['settings', 'backup', 'export', 'workspace', 'configuration', 'preferences'] },
    ],
  },
];

const flatNavItems = CMS_NAV_GROUPS.flatMap((g) => g.items.map((item) => ({ ...item, group: g.title })));

function matchesQuery(item, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.label.toLowerCase().includes(q)) return true;
  if (item.to.toLowerCase().includes(q)) return true;
  if (item.keywords?.some((k) => k.includes(q))) return true;
  return false;
}

function SearchIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function CmsNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [brandData, setBrandData] = useState({
    logoText: 'J',
    brandTitle: 'JAPANDI',
    brandSubtitle: 'Energetic Alignment',
  });

  const { admin, logout } = useAuth();
  const searchWrapRef = useRef(null);
  const inputRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch brand data from navbar menu settings
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const res = await fetch('/backend/shreeweb-navigation-menus/public', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.success && data?.data?.navbarBrand) {
          setBrandData(prev => ({ ...prev, ...data.data.navbarBrand }));
        }
      } catch (error) {
        // Keep fallback brand data
      }
    };
    fetchBrandData();
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return flatNavItems;
    return flatNavItems.filter((item) => matchesQuery(item, q));
  }, [searchQuery]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [searchQuery, searchOpen]);

  useEffect(() => {
    const onDoc = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  const go = useCallback(
    (to) => {
      navigate(to);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileOpen(false);
    },
    [navigate]
  );

  const handleLogout = async () => {
    await logout();
    navigate('/shreeweb/cms-login');
  };

  const onSearchKeyDown = (e) => {
    if (!searchOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setSearchOpen(true);
      return;
    }
    if (!filteredItems.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(filteredItems[highlightIndex].to);
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#EDE8DF]/95 backdrop-blur supports-[backdrop-filter]:bg-[#EDE8DF]/88">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-5 lg:px-8">
        {/* Mobile: logo + actions row; lg: contents → logo & actions become flex siblings with search between */}
        <div className="flex items-center justify-between gap-3 lg:contents">
          <Link
            to="/shreeweb/cms/overview"
            className="flex min-w-0 flex-shrink-0 items-center gap-2.5 sm:gap-3 lg:order-1"
            onClick={() => setMobileOpen(false)}
          >
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 text-white shadow-md ring-2 ring-white/20">
              <span className="text-sm font-bold tracking-widest">{brandData.logoText}</span>
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate font-serif text-base tracking-wide text-stone-900 sm:text-lg">{brandData.brandTitle}</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-900/70">Studio CMS</div>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:order-3 lg:ml-auto">
            {/* Notifications Icon */}
            <button
              type="button"
              className="relative flex items-center justify-center rounded-xl border border-stone-300/90 bg-white p-2.5 text-stone-600 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 hover:text-stone-800"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification badge - you can conditionally show this based on unread notifications */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-xl border border-stone-300/90 bg-white px-3 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {admin?.profile?.firstName?.[0] || admin?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="hidden sm:inline">{admin?.profile?.firstName || admin?.username || 'Admin'}</span>
                <svg className={`w-4 h-4 text-stone-500 transition ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-[55] w-64 rounded-2xl border border-stone-200 bg-white py-2 shadow-xl">
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="text-sm font-medium text-stone-900">
                      {admin?.profile?.firstName && admin?.profile?.lastName 
                        ? `${admin.profile.firstName} ${admin.profile.lastName}`
                        : admin?.username || 'Administrator'
                      }
                    </p>
                    <p className="text-xs text-stone-500">{admin?.email}</p>
                    <p className="text-xs text-amber-600 font-medium mt-1 capitalize">{admin?.role?.replace('_', ' ')}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/shreeweb/cms/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/shreeweb/home"
              className="hidden items-center gap-2 rounded-xl bg-stone-800 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-stone-900 sm:inline-flex"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View {brandData.brandTitle}
            </Link>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white p-2.5 text-stone-800 shadow-sm lg:hidden"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => {
                setMobileOpen((v) => !v);
              }}
            >
              <span className="text-lg leading-none">{mobileOpen ? '×' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Single search instance — full width on mobile, centered flex on desktop */}
        <div className="min-w-0 w-full lg:order-2 lg:max-w-2xl lg:flex-1" ref={searchWrapRef}>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              <SearchIcon />
            </div>
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search CMS pages…"
              autoComplete="off"
              className="w-full rounded-xl border border-stone-200/90 bg-white py-2.5 pl-10 pr-10 text-sm text-stone-900 shadow-sm outline-none ring-stone-800/5 placeholder:text-stone-400 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-200/60"
              aria-expanded={searchOpen}
              aria-controls="cms-nav-search-results"
              aria-autocomplete="list"
            />
            {searchQuery ? (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                onClick={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
              >
                Clear
              </button>
            ) : null}

            {searchOpen ? (
              <div
                id="cms-nav-search-results"
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-[60] max-h-[min(70vh,22rem)] overflow-y-auto rounded-xl border border-stone-200 bg-white py-2 shadow-xl"
                role="listbox"
              >
                {filteredItems.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-stone-500">
                    {searchQuery.trim() ? `No pages match “${searchQuery.trim()}”.` : 'Start typing to filter pages.'}
                  </p>
                ) : (
                  <ul className="divide-y divide-stone-100">
                    {filteredItems.map((item, idx) => (
                      <li key={item.to} role="option" aria-selected={idx === highlightIndex}>
                        <button
                          type="button"
                          onMouseEnter={() => setHighlightIndex(idx)}
                          onClick={() => go(item.to)}
                          className={`flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition ${
                            idx === highlightIndex ? 'bg-amber-50/90' : 'hover:bg-stone-50'
                          }`}
                        >
                          <span className="mt-0.5 w-16 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                            {item.group}
                          </span>
                          <span className="font-medium text-stone-900">{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="border-t border-stone-100 px-4 py-2 text-[10px] text-stone-400">↑↓ move · Enter open · Esc close</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-stone-200/80 bg-[#EDE8DF] lg:hidden">
          <nav className="max-h-[min(70vh,480px)] overflow-y-auto px-4 py-4">
            {/* Mobile Notifications */}
            <div className="mb-4 flex items-center justify-between rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-stone-200/80">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-sm font-medium text-stone-800">Notifications</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </div>
            
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">All pages</p>
            <ul className="space-y-1">
              {flatNavItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium ${
                        isActive ? 'bg-stone-800 text-white' : 'bg-white/80 text-stone-800 ring-1 ring-stone-200/80'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-normal uppercase tracking-wider text-stone-400">{item.group}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link
              to="/shreeweb/home"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-stone-800 py-3 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View {brandData.brandTitle}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
