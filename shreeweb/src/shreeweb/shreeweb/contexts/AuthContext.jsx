import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = '/backend/shreeweb-auth';

  // Check if admin is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE}/verify`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Get full profile
          const profileResponse = await fetch(`${API_BASE}/profile`, {
            credentials: 'include'
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setAdmin(profileData.admin);
          } else {
            // If profile fetch fails, clear admin state
            setAdmin(null);
          }
        } else {
          // If verification fails, clear admin state
          setAdmin(null);
        }
      } else {
        // If verification request fails, clear admin state
        setAdmin(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        setAdmin(data.admin);
        return { success: true };
      }

      throw new Error(data.message || 'Login failed');
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      if (data.success) {
        setAdmin(data.admin);
        return { success: true };
      }

      throw new Error(data.message || 'Profile update failed');
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return { success: true, message: data.message };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
    isAuthenticated: !!admin,
    isSuperAdmin: admin?.role === 'super_admin',
    hasPermission: (permission) => admin?.permissions?.[permission] || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};