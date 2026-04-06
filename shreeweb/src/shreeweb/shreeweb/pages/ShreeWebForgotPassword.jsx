import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ShreeWebForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/backend/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        setError(data?.message || 'Failed to send reset email. Please try again.');
        return;
      }
      
      setSuccess(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full">
        <section className="px-4 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-4xl">
            {/* Logo */}
            <div 
              className="flex items-center justify-center gap-3 mb-8"
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay="100"
            >
              <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-stone-800 text-white">
                <span className="text-xl font-bold tracking-widest">J</span>
              </div>
              <div className="min-w-0 leading-tight">
                <div className="truncate text-2xl font-serif tracking-wide text-stone-800">OMSHREEGUIDANCE</div>
                <div className="truncate text-sm text-stone-600">Energetic Alignment</div>
              </div>
            </div>
            
            <div className="mb-4 text-sm font-medium tracking-wider text-stone-600">PASSWORD RESET</div>
            <h1 className="mb-4 font-serif text-4xl text-stone-800 sm:text-5xl">Check your email</h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              We've sent password reset instructions to <strong>{email}</strong>. 
              Please check your inbox and follow the link to reset your password.
            </p>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto max-w-md">
            <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-serif text-stone-800 mb-4">Email sent successfully</h3>
              <p className="text-stone-600 mb-6 leading-relaxed">
                If you don't see the email in your inbox, please check your spam folder.
              </p>
              
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full rounded-full bg-orange-100 py-3 text-sm font-medium text-orange-800 transition hover:bg-orange-200"
                >
                  Back to Sign In
                </Link>
                
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                    setError('');
                  }}
                  className="block w-full rounded-full border border-stone-200 bg-white py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  Send another email
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="px-4 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Logo */}
          <div 
            className="flex items-center justify-center gap-3 mb-8"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="100"
          >
            <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-stone-800 text-white">
              <span className="text-xl font-bold tracking-widest">J</span>
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-2xl font-serif tracking-wide text-stone-800">OMSHREEGUIDANCE</div>
              <div className="truncate text-sm text-stone-600">Energetic Alignment</div>
            </div>
          </div>
          
          <div className="mb-4 text-sm font-medium tracking-wider text-stone-600">PASSWORD RESET</div>
          <h1 className="mb-4 font-serif text-4xl text-stone-800 sm:text-5xl">Forgot your password?</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            No worries. Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block font-medium text-stone-700">Email address</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-400/30"
                  placeholder="you@example.com"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-orange-100 py-3 text-sm font-medium text-orange-800 transition hover:bg-orange-200 disabled:opacity-60"
              >
                {loading ? 'Sending reset email…' : 'Send reset instructions'}
              </button>
            </form>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-sm font-medium text-stone-600 hover:text-stone-800 underline decoration-stone-400/70"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}