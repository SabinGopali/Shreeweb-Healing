import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ShreeWebCmsLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to CMS overview
    if (isAuthenticated && !loading) {
      navigate('/shreeweb/cms/overview', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    // Add a class to body to override global padding
    document.body.classList.add('shreeweb-login-page');
    
    // Create and inject custom CSS to override global styles
    const style = document.createElement('style');
    style.id = 'shreeweb-login-styles';
    style.textContent = `
      body.shreeweb-login-page {
        padding: 0 !important;
        margin: 0 !important;
        padding-top: 0 !important;
        overflow: hidden !important;
        height: 100vh !important;
        width: 100vw !important;
      }
      
      body.shreeweb-login-page * {
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('shreeweb-login-page');
      const existingStyle = document.getElementById('shreeweb-login-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      // Always navigate to overview to prevent redirect loops
      navigate('/shreeweb/cms/overview', { replace: true });
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center m-0 overflow-hidden z-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 m-0 overflow-hidden z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <defs>
            <pattern id="healing-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" className="text-amber-400" />
              <circle cx="5" cy="5" r="1" fill="currentColor" className="text-orange-400" />
              <circle cx="15" cy="15" r="1" fill="currentColor" className="text-yellow-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#healing-pattern)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">J</span>
            </div>
            <h1 className="text-2xl font-serif text-stone-900 mb-2">OMSHREEGUIDANCE Studio</h1>
            <p className="text-stone-600 text-sm">CMS Administrator Access</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white/80"
                placeholder="Enter your username or email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white/80"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:from-amber-700 hover:to-orange-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In to CMS'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-stone-200 text-center">
            <Link
              to="/home"
              className="text-sm text-stone-500 hover:text-stone-700 transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Website
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ShreeWebCmsLogin;