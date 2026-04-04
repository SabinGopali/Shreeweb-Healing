import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firebase';

/** Matches JAPANDI auth cards: stone borders, warm white, serif-adjacent rhythm */
export function ShreeWebAuthDivider() {
  return (
    <div className="relative my-7">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-stone-200/90" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
          Or
        </span>
      </div>
    </div>
  );
}

/**
 * Continue with Google — same backend as main app (`POST /backend/auth/google`), cookie session.
 * @param {'login' | 'signup'} variant
 * @param {(msg: string) => void} [onError]
 */
export default function ShreeWebGoogleButton({ variant = 'login', onError }) {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);

  const label =
    variant === 'signup' ? 'Sign up with Google' : 'Continue with Google';
  const loadingLabel = variant === 'signup' ? 'Creating account…' : 'Signing in…';

  const handleClick = async () => {
    if (loading) return;
    onError?.('');
    setLoading(true);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch('/backend/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        onError?.(data?.message || data?.error || 'Google sign-in failed.');
        return;
      }

      window.dispatchEvent(new Event('shreeweb-auth-change'));
      navigate('/shreeweb/home', { replace: true });
    } catch (err) {
      let message = 'Google sign-in failed. Please try again.';
      if (err?.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in was closed. Try again when you’re ready.';
      } else if (err?.code === 'auth/popup-blocked') {
        message = 'Popup was blocked. Allow popups for this site and try again.';
      } else if (err?.code === 'auth/cancelled-popup-request') {
        message = 'Sign-in was cancelled.';
      } else if (err?.message) {
        message = err.message;
      }
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-orange-200 bg-[#F4EFE6] py-3 pl-4 pr-5 text-sm font-medium text-orange-900 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <svg
            className="h-5 w-5 animate-spin text-stone-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <GoogleMark className="h-5 w-5 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

/** Official four-color G mark (compact) for brand consistency */
function GoogleMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
