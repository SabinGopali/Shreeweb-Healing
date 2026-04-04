import { useCallback, useEffect, useState } from 'react';

/**
 * Session for the public ShreeWeb site via httpOnly cookie from `/backend/user/login`.
 */
export function useShreewebAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/backend/user/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    const onAuthChange = () => refresh();
    window.addEventListener('focus', onFocus);
    window.addEventListener('shreeweb-auth-change', onAuthChange);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('shreeweb-auth-change', onAuthChange);
    };
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await fetch('/backend/user/signout', { method: 'POST', credentials: 'include' });
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  return { user, loading, refresh, logout };
}
