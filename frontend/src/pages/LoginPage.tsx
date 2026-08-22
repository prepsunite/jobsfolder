import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LogOut,
  GraduationCap,
  Star,
  AlertCircle,
  Check,
  User,
} from 'lucide-react';

export default function LoginPage() {
  const {
    user,
    role,
    isAuthenticated,
    isLoading: authLoading,
    signInWithGoogle,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  // Status & loading states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Automatically navigate away from /login when authenticated
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      const targetPath = redirectTo && redirectTo.startsWith('/')
        ? redirectTo
        : (role === 'ADMIN' ? '/admin' : '/profile');
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, user, role, authLoading, navigate, redirectTo]);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res?.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during Google Sign-In.');
    } finally {
      setGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 animate-fadeIn">
        <div className="w-8 h-8 border-2 border-[#FD4A32] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-display font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider">Verifying Session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="w-full max-w-4xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* LEFT COLUMN: Brand Value Proposition (Desktop View) */}
        <div className="lg:col-span-5 bg-[#121417] dark:bg-[#0C0C0C] p-8 sm:p-10 text-white flex flex-col justify-between relative border-r border-[#242424] hidden lg:flex">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/favicon.svg"
                alt="Jobsfolder Logo"
                className="w-8 h-8 rounded-full object-contain shrink-0 transition-transform group-hover:scale-105"
              />
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                Jobs<span className="text-[#FD4A32]">folder</span>
              </span>
            </Link>

            <div className="pt-2 space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Verified Archive</span>
              </div>
              <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-white">
                Actual OA Papers. From Real Drives.
              </h2>
              <p className="text-xs text-[#999999] leading-relaxed font-sans">
                Sign in with Google to access solved previous year papers from TCS, Accenture, Amazon, Infosys and 50+ recruiters.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 font-sans">
              <div className="flex items-center gap-2.5 text-xs text-[#E5E7EB]">
                <div className="w-4 h-4 rounded-sm bg-[#FD4A32]/20 flex items-center justify-center text-[#FD4A32]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>TCS, Infosys, Accenture & Amazon Past Papers</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#E5E7EB]">
                <div className="w-4 h-4 rounded-sm bg-[#FD4A32]/20 flex items-center justify-center text-[#FD4A32]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Zero Passwords · Instant 1-Click Access</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#E5E7EB]">
                <div className="w-4 h-4 rounded-sm bg-[#FD4A32]/20 flex items-center justify-center text-[#FD4A32]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Saved Bookmarks & Drive Notes Sync</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-auto border-t border-[#242424]">
            <div className="p-3 rounded-md bg-[#1C1C1C] border border-[#2E2E2E] space-y-1.5 font-sans">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-[11px] text-[#999999] italic">
                "Got immediate access to all TCS NQT advanced coding papers with full solutions."
              </p>
              <div className="flex items-center gap-1.5 pt-0.5 text-[10px] font-bold text-[#FD4A32]">
                <GraduationCap className="w-3 h-3" />
                <span>Priya Sharma — TCS Digital 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 1-Click Google OAuth Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between relative z-10 bg-white dark:bg-[#141414]">

          {/* Mobile Header Brand */}
          <div className="flex lg:hidden items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/favicon.svg"
                alt="Jobsfolder Logo"
                className="w-8 h-8 rounded-full object-contain shrink-0"
              />
              <span className="font-display text-lg font-extrabold text-[#121417] dark:text-white">
                Jobs<span className="text-[#FD4A32] dark:text-[#FD4A32]">folder</span>
              </span>
            </Link>

            <span className="px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] dark:text-[#FD4A32] text-[9px] font-display font-bold uppercase">
              Google OAuth
            </span>
          </div>

          {/* STATE 1: LOGGED IN USER VIEW */}
          {isAuthenticated && user ? (
            <div className="my-auto space-y-5 max-w-sm mx-auto w-full text-center animate-fadeIn">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FD4A32]/10 border-2 border-[#FD4A32] dark:border-[#FD4A32] relative mx-auto">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="font-display font-black text-xl text-[#FD4A32] dark:text-[#FD4A32]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-0.5">
                <h1 className="font-display text-xl font-extrabold text-[#121417] dark:text-white">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans">
                  Signed in as <span className="font-semibold text-[#121417] dark:text-white">{user.email}</span>
                </p>
              </div>

              <div className="p-3 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-1.5 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-[#868E96] dark:text-[#555555]">Role:</span>
                  <span className="font-bold text-[#FD4A32] dark:text-[#FD4A32]">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#868E96] dark:text-[#555555]">Auth Provider:</span>
                  <span className="font-semibold text-[#121417] dark:text-[#FFFFFF]">Google OAuth 2.0</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full py-2.5 px-4 rounded-md bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-display font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Go to My Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={logout}
                  className="w-full py-2 px-4 rounded-md border border-[#E9ECEF] dark:border-[#242424] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* STATE 2: 1-CLICK GOOGLE SIGN-IN VIEW */
            <div className="my-auto space-y-6 max-w-sm mx-auto w-full">
              
              <div className="space-y-1.5 text-center sm:text-left">
                <h1 className="font-display text-2xl font-extrabold text-[#121417] dark:text-white tracking-tight">
                  Sign In to PrepUnite
                </h1>
                <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans">
                  Use your Google Account to log in with 1-click. No password required.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-start gap-2 animate-fadeIn font-sans">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* GIANT GOOGLE OAUTH BUTTON */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 px-4 rounded-md bg-white dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-[#121417] dark:hover:border-[#555555] text-[#121417] dark:text-white font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 group shadow-xs"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-[#FD4A32] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] ml-auto" />
                </button>

                <p className="text-[10px] text-[#868E96] dark:text-[#555555] text-center leading-relaxed font-sans">
                  By continuing, you agree to PrepUnite's Terms and Privacy Policy.
                </p>
              </div>

              {/* SECURITY FOOTER */}
              <div className="pt-4 border-t border-[#E9ECEF] dark:border-[#242424]">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#868E96] dark:text-[#555555] font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32]" />
                  <span>Secured by Supabase OAuth 2.0 &amp; 256-bit SSL</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
