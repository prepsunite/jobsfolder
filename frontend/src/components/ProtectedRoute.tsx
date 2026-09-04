import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireTpo?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireTpo = false,
}) => {
  const { user, isAuthenticated, isAdmin, isTpoAdmin, isLoading } = useAuth();
  const location = useLocation();

  const isEffectiveAdmin = isAdmin || isSuperAdminEmail(user?.email);

  // Show clean spinner during initial Supabase auth handshake
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 animate-fadeIn">
        <Loader2 className="w-8 h-8 animate-spin text-[#FD4A32] dark:text-[#FD4A32]" />
        <span className="text-xs font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
          Verifying Access...
        </span>
      </div>
    );
  }

  // Not logged in -> Redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  // Requires Admin role but user is not admin
  if (requireAdmin && !isEffectiveAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-xl font-extrabold text-[#121417] dark:text-[#FFFFFF]">
            Admin Access Required
          </h2>
          <p className="text-xs text-[#868E96] dark:text-[#555555] max-w-sm mx-auto">
            You do not have administrative privileges to access this area.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-display font-bold uppercase tracking-wider transition-colors"
        >
          Return to Home
        </a>
      </div>
    );
  }

  // Requires TPO role but user is neither TPO nor Super Admin
  if (requireTpo && !isTpoAdmin && !isEffectiveAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-xl font-extrabold text-[#121417] dark:text-[#FFFFFF]">
            TPO Access Required
          </h2>
          <p className="text-xs text-[#868E96] dark:text-[#555555] max-w-sm mx-auto">
            This dashboard is restricted to authorized Training & Placement Officers (TPO) and CRT coordinators.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-display font-bold uppercase tracking-wider transition-colors"
        >
          Return to Home
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
