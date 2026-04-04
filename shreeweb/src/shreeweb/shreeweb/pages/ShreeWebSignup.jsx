import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShreeWebGoogleButton, { ShreeWebAuthDivider } from '../components/ShreeWebGoogleButton';

export default function ShreeWebSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' | 'otp'

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !email.trim() || !password) {
      setError('Username, email, and password are required.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/backend/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          isSupplier: false,
          businessTypes: [],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || 'Could not start signup.');
        return;
      }
      setStep('otp');
    } catch {
      setError('Network error. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim()) {
      setError('Enter the code from your email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/backend/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          purpose: 'signup',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || 'Invalid or expired code.');
        return;
      }
      navigate('/shreeweb/login?registered=1', { replace: true });
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Enhanced Healing Background Patterns */}
      <div className="absolute inset-0">
        {/* Base gradient background with healing colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"></div>
        
        {/* Organic flowing patterns */}
        <div className="absolute inset-0 opacity-18">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
            <path d="M0,120 Q250,40 500,120 Q750,200 1000,120 Q1100,80 1200,120 L1200,0 L0,0 Z" fill="url(#signupGradient1)" opacity="0.5"/>
            <path d="M0,680 Q300,580 600,680 Q900,780 1200,680 L1200,800 L0,800 Z" fill="url(#signupGradient2)" opacity="0.4"/>
            <path d="M0,350 Q150,250 300,350 Q450,450 600,350 Q750,250 900,350 Q1050,450 1200,350 L1200,450 Q1050,550 900,450 Q750,350 600,450 Q450,550 300,450 Q150,550 0,450 Z" fill="url(#signupGradient3)" opacity="0.3"/>
            <defs>
              <linearGradient id="signupGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2"/>
                <stop offset="50%" stopColor="#FB923C" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.2"/>
              </linearGradient>
              <linearGradient id="signupGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.18"/>
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="#FB923C" stopOpacity="0.18"/>
              </linearGradient>
              <linearGradient id="signupGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.15"/>
                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.08"/>
                <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.15"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Enhanced floating healing elements */}
        <div className="absolute inset-0 opacity-12">
          <div className="absolute top-16 right-24 w-40 h-40 border border-amber-300/40 rounded-full animate-pulse" style={{animationDuration: '5s'}}></div>
          <div className="absolute bottom-24 left-20 w-28 h-28 border border-orange-300/45 rounded-full animate-pulse" style={{animationDuration: '7s', animationDelay: '1.5s'}}></div>
          <div className="absolute top-2/5 left-1/5 w-24 h-24 border border-yellow-300/40 rounded-full animate-pulse" style={{animationDuration: '6s', animationDelay: '0.8s'}}></div>
          <div className="absolute top-1/6 right-1/4 w-36 h-36 bg-gradient-to-br from-amber-200/18 to-orange-200/18 rounded-full blur-xl animate-pulse" style={{animationDuration: '9s'}}></div>
          <div className="absolute bottom-1/5 right-1/6 w-32 h-32 bg-gradient-to-br from-orange-200/15 to-yellow-200/15 rounded-full blur-2xl animate-pulse" style={{animationDuration: '8s', animationDelay: '2.5s'}}></div>
          <div className="absolute top-3/5 left-2/5 w-20 h-20 bg-gradient-to-br from-yellow-200/12 to-amber-200/12 rounded-full blur-lg animate-pulse" style={{animationDuration: '7.5s', animationDelay: '1.2s'}}></div>
        </div>
        
        {/* Enhanced healing particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/8 w-2.5 h-2.5 bg-amber-400/45 rounded-full animate-ping" style={{animationDuration: '3.5s'}}></div>
          <div className="absolute top-4/5 right-1/8 w-1.5 h-1.5 bg-orange-400/50 rounded-full animate-ping" style={{animationDuration: '4.2s', animationDelay: '1.8s'}}></div>
          <div className="absolute top-1/2 right-1/5 w-2 h-2 bg-yellow-400/40 rounded-full animate-ping" style={{animationDuration: '5.1s', animationDelay: '0.9s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-amber-400/35 rounded-full animate-ping" style={{animationDuration: '6.3s', animationDelay: '2.7s'}}></div>
          <div className="absolute top-1/8 left-3/5 w-2.5 h-2.5 bg-orange-300/50 rounded-full animate-ping" style={{animationDuration: '4.8s', animationDelay: '1.1s'}}></div>
        </div>
        
        {/* Sacred geometry for signup */}
        <div className="absolute inset-0 opacity-6">
          <svg className="absolute top-1/5 left-1/6 w-28 h-28" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="35" stroke="url(#sacredSignup1)" strokeWidth="0.5" opacity="0.7"/>
            <circle cx="50" cy="50" r="25" stroke="url(#sacredSignup1)" strokeWidth="0.4" opacity="0.5"/>
            <circle cx="50" cy="50" r="15" stroke="url(#sacredSignup1)" strokeWidth="0.3" opacity="0.4"/>
            <defs>
              <linearGradient id="sacredSignup1">
                <stop offset="0%" stopColor="#F59E0B"/>
                <stop offset="50%" stopColor="#FB923C"/>
                <stop offset="100%" stopColor="#D97706"/>
              </linearGradient>
            </defs>
          </svg>
          <svg className="absolute bottom-1/4 right-1/8 w-20 h-20" viewBox="0 0 100 100" fill="none">
            <polygon points="50,15 85,85 15,85" stroke="url(#sacredSignup2)" strokeWidth="0.4" fill="none" opacity="0.6"/>
            <polygon points="50,30 70,70 30,70" stroke="url(#sacredSignup2)" strokeWidth="0.3" fill="none" opacity="0.4"/>
            <defs>
              <linearGradient id="sacredSignup2">
                <stop offset="0%" stopColor="#FBBF24"/>
                <stop offset="50%" stopColor="#F59E0B"/>
                <stop offset="100%" stopColor="#FDBA74"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <section className="px-4 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-4xl">
            {/* Enhanced Header with Glass Morphism */}
            <div className="bg-white/25 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
              <div className="mb-6 text-sm font-medium tracking-wider text-stone-700 uppercase">
                <span className="inline-flex items-center gap-2">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                  Join JAPANDI
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                </span>
              </div>
              <h1 className="mb-6 font-serif text-4xl text-stone-800 sm:text-5xl leading-tight">
                {step === 'form' ? (
                  <>
                    Begin your journey of
                    <span className="block text-amber-700 italic mt-2">energetic alignment</span>
                  </>
                ) : (
                  <>
                    Almost there!
                    <span className="block text-orange-700 italic mt-2 text-3xl">Verify your email</span>
                  </>
                )}
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
                {step === 'form'
                  ? 'Create your account to access personalized healing sessions and energetic alignment tools'
                  : 'We sent a verification code to your email address. Please check your inbox and enter the code below.'}
              </p>
              
              {/* Decorative Element */}
              <div className="flex items-center justify-center space-x-3 mt-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
                <div className="w-3 h-3 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full shadow-lg"></div>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto max-w-md">
            <div className="bg-white/35 backdrop-blur-xl rounded-3xl border border-white/25 p-8 shadow-2xl">
            {step === 'form' ? (
              <>
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-5">
                    <label className="block group">
                      <span className="mb-3 block font-medium text-stone-700 group-focus-within:text-stone-800 transition-colors">
                        Display Name
                      </span>
                      <div className="relative">
                        <input
                          type="text"
                          autoComplete="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full rounded-2xl border border-stone-200/60 bg-white/60 backdrop-blur-sm px-5 py-4 text-stone-800 outline-none transition-all duration-300 focus:border-amber-400/60 focus:bg-white/80 focus:ring-4 focus:ring-amber-400/20 focus:shadow-lg placeholder:text-stone-400"
                          placeholder="How should we address you?"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/5 to-orange-400/5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none"></div>
                      </div>
                    </label>
                    
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
                          placeholder="Enter your email address"
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
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-2xl border border-stone-200/60 bg-white/60 backdrop-blur-sm px-5 py-4 text-stone-800 outline-none transition-all duration-300 focus:border-amber-400/60 focus:bg-white/80 focus:ring-4 focus:ring-amber-400/20 focus:shadow-lg placeholder:text-stone-400"
                          placeholder="Create a secure password (6+ characters)"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/5 to-orange-400/5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none"></div>
                      </div>
                    </label>
                    
                    <label className="block group">
                      <span className="mb-3 block font-medium text-stone-700 group-focus-within:text-stone-800 transition-colors">
                        Confirm Password
                      </span>
                      <div className="relative">
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          className="w-full rounded-2xl border border-stone-200/60 bg-white/60 backdrop-blur-sm px-5 py-4 text-stone-800 outline-none transition-all duration-300 focus:border-amber-400/60 focus:bg-white/80 focus:ring-4 focus:ring-amber-400/20 focus:shadow-lg placeholder:text-stone-400"
                          placeholder="Confirm your password"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/5 to-orange-400/5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none"></div>
                      </div>
                    </label>
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
                          Creating your account...
                        </>
                      ) : (
                        <>
                          Continue to verification
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
                  <div className="mt-6 rounded-2xl border border-red-300/60 bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-sm px-6 py-4 text-sm text-red-800 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                ) : null}

                <ShreeWebAuthDivider />
                <ShreeWebGoogleButton variant="signup" onError={setError} />
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-800">Verification code sent!</p>
                      <p className="text-xs text-stone-600">Check your email: <span className="font-medium text-stone-800">{email}</span></p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                  <label className="block group">
                    <span className="mb-3 block font-medium text-stone-700 group-focus-within:text-stone-800 transition-colors">
                      Enter Verification Code
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                        className="w-full rounded-2xl border border-stone-200/60 bg-white/60 backdrop-blur-sm px-5 py-4 text-center font-mono text-xl tracking-widest text-stone-800 outline-none transition-all duration-300 focus:border-amber-400/60 focus:bg-white/80 focus:ring-4 focus:ring-amber-400/20 focus:shadow-lg placeholder:text-stone-400"
                        placeholder="000000"
                        maxLength="8"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/5 to-orange-400/5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none"></div>
                    </div>
                  </label>

                  {error ? (
                    <div className="rounded-2xl border border-red-300/60 bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-sm px-6 py-4 text-sm text-red-800 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="font-medium">{error}</span>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                    className="group relative w-full overflow-hidden rounded-full border border-orange-200 bg-orange-50 backdrop-blur-md py-4 text-sm font-semibold text-orange-900 transition-all duration-300 hover:bg-orange-100 hover:border-orange-300 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Verifying...
                          </>
                        ) : (
                          <>
                            Complete account creation
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setStep('form');
                        setOtp('');
                        setError('');
                      }}
                      className="w-full rounded-full border border-orange-200 bg-[#F4EFE6] backdrop-blur-sm py-3 text-sm font-medium text-orange-900 transition-all duration-300 hover:bg-orange-50 hover:border-orange-300"
                    >
                      ← Back to form
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Enhanced Footer Link */}
            <div className="mt-8 text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-sm text-stone-600">
                  Already part of JAPANDI?{' '}
                  <Link 
                    to="/shreeweb/login" 
                    className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800 transition-colors duration-200 group"
                  >
                    <span className="underline decoration-amber-400/50 group-hover:decoration-amber-500/70 transition-colors">
                      Sign in to your account
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
