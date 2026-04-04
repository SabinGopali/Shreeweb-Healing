import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-stone-600 font-medium">Verifying access...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, requirePermission = null, requireSuperAdmin = false }) => {
  const { admin, loading, isAuthenticated, isSuperAdmin, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/shreeweb/cms-login" state={{ from: location }} replace />;
  }

  // Check if user has valid admin role
  if (!admin?.role || !['admin', 'super_admin'].includes(admin.role)) {
    return (
      <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-serif text-stone-900 mb-2">Admin Access Required</h2>
          <p className="text-stone-600 mb-4">This area requires admin privileges. Your account does not have the necessary permissions.</p>
          <button
            onClick={() => window.location.href = '/shreeweb/cms-login'}
            className="px-4 py-2 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-serif text-stone-900 mb-2">Super Admin Required</h2>
          <p className="text-stone-600 mb-4">Super admin privileges required to access this area.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (requirePermission && !hasPermission(requirePermission)) {
    return (
      <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-amber-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-serif text-stone-900 mb-2">Permission Required</h2>
          <p className="text-stone-600 mb-4">You don't have permission to access this area.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;