import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ShreeWebGoogleButton, { ShreeWebAuthDivider } from '../components/ShreeWebGoogleButton';

export default function ShreeWebLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get('registered') === '1';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/backend/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || 'Sign in failed. Check your credentials.');
        return;
      }
      window.dispatchEvent(new Event('shreeweb-auth-change'));
      navigate('/shreeweb/home', { replace: true });
    } catch {
      setError('Network error. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Enhanced Healing Background Patterns */}
      <div className="absolute inset-0">
        {/* Base gradient background with healing colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50"></div>
        
        {/* Organic flowing patterns */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
            <path d="M0,150 Q300,50 600,150 T1200,150 L1200,0 L0,0 Z" fill="url(#loginGradient1)" opacity="0.4"/>
            <path d="M0,650 Q400,550 800,650 T1200,650 L1200,800 L0,800 Z" fill="url(#loginGradient2)" opacity="0.3"/>
            <path d="M0,300 Q200,200 400,300 Q600,400 800,300 Q1000,200 1200,300 L1200,500 Q1000,600 800,500 Q600,400 400,500 Q200,600 0,500 Z" fill="url(#loginGradient3)" opacity="0.25"/>
            <defs>
              <linearGradient id="loginGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2"/>
                <stop offset="50%" stopColor="#EC4899" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.2"/>
              </linearGradient>
              <linearGradient id="loginGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78716C" stopOpacity="0.15"/>
                <stop offset="50%" stopColor="#F472B6" stopOpacity="0.08"/>
                <stop offset="100%" stopColor="#D6D3D1" stopOpacity="0.15"/>
              </linearGradient>
              <linearGradient id="loginGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.12"/>
                <stop offset="50%" stopColor="#F9A8D4" stopOpacity="0.06"/>
                <stop offset="100%" stopColor="#FB923C" stopOpacity="0.12"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Floating healing elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 right-20 w-32 h-32 border border-amber-300/40 rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 border border-rose-300/35 rounded-full animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 border border-orange-300/40 rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
          <div className="absolute top-1/4 right-1/3 w-28 h-28 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-gradient-to-br from-rose-200/15 to-pink-200/15 rounded-full blur-2xl animate-pulse" style={{animationDuration: '7s', animationDelay: '3s'}}></div>
        </div>
        
        {/* Healing particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/5 left-1/6 w-2 h-2 bg-amber-400/50 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-3/4 right-1/5 w-1.5 h-1.5 bg-rose-400/40 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/6 w-2.5 h-2.5 bg-orange-400/45 rounded-full animate-ping" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-pink-400/35 rounded-full animate-ping" style={{animationDuration: '6s', animationDelay: '3s'}}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <section className="px-4 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-4xl">
            {/* Enhanced Header with Glass Morphism */}
            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl mb-8">
              <div className="mb-6 text-sm font-medium tracking-wider text-stone-700 uppercase">
                <span className="inline-flex items-center gap-2">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                  Account Access
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                </span>
              </div>
              <h1 className="mb-6 font-serif text-4xl text-stone-800 sm:text-5xl leading-tight">
                Welcome back to
                <span className="block text-amber-700 italic mt-2">OMSHREEGUIDANCE</span>
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
                Continue your journey of energetic alignment and sustainable growth
              </p>
              
              {/* Decorative Element */}
              <div className="flex items-center justify-center space-x-3 mt-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"></div>
                <div className="w-3 h-3 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-lg"></div>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto max-w-md">
            <div className="bg-white/40 backdrop-blur-lg rounded-3xl border border-white/30 p-8 shadow-2xl">
            {registered ? (
              <div className="mb-6 rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm px-6 py-4 text-sm text-stone-800 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Account created successfully!</span>
                </div>
                <p className="mt-1 text-stone-600">Sign in with your email and password to continue.</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <label className="block group">
                  <span className="mb-3 block font-medium text-stone-700 group-focus-within:text-stone-800 transition-colors">
                    Email Address
                  </span>
                  <div className="relative">
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-stone-200/60 bg-white/60 backdrop-blur-sm px-5 py-4 text-stone-800 outline-none transition-all duration-300 focus:border-amber-400/60 focus:bg-white/80 focus:ring-4 focus:ring-amber-400/20 focus:shadow-lg placeholder:text-stone-400"
                      placeholder="Enter your email"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/5 to-orange-400/5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none"></div>
                  </div>
                </label>
                
                <label className="block group">
                  <span className="mb-3 block font-medium text-stone-700 group-focus-within:text-stone-800 transition-colors">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-stone-200/60 bg-white/60 backdrop-blur-sm px-5 py-4 text-stone-800 outline-none transition-all duration-300 focus:border-amber-400/60 focus:bg-white/80 focus:ring-4 focus:ring-amber-400/20 focus:shadow-lg placeholder:text-stone-400"
                      placeholder="Enter your password"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/5 to-orange-400/5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none"></div>
                  </div>
                </label>
              </div>

              {/* Enhanced Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-800 transition-colors duration-200 group"
                >
                  <span className="underline decoration-orange-400/50 group-hover:decoration-orange-500/70 transition-colors">
                    Forgot password?
                  </span>
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-full border border-orange-200 bg-orange-50 backdrop-blur-md py-4 text-sm font-semibold text-orange-900 transition-all duration-300 hover:bg-orange-100 hover:border-orange-300 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to OMSHREEGUIDANCE
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </button>
            </form>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-300/60 bg-gradient-to-r from-red-50/80 to-pink-50/80 backdrop-blur-sm px-6 py-4 text-sm text-red-800 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            ) : null}

            <ShreeWebAuthDivider />
            <ShreeWebGoogleButton variant="login" onError={setError} />

            {/* Enhanced Footer Link */}
            <div className="mt-8 text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-sm text-stone-600">
                  New to OMSHREEGUIDANCE?{' '}
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center gap-1 font-semibold text-orange-700 hover:text-orange-800 transition-colors duration-200 group"
                  >
                    <span className="underline decoration-orange-400/50 group-hover:decoration-orange-500/70 transition-colors">
                      Create your account
                    </span>
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
