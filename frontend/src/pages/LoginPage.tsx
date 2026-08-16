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
        <div className="w-10 h-10 border-4 border-[#006c49]/20 border-t-[#006c49] rounded-full animate-spin" />
        <span className="text-xs font-bold text-[#747878] uppercase tracking-wider">Verifying Google Session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-fadeIn">
      <div className="w-full max-w-4xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Ambient Blur Backgrounds */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#006c49]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT COLUMN: Brand Value Proposition (Desktop View) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#006c49] via-[#005a3c] to-[#043928] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-white text-[#006c49] flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Prep<span className="text-[#6cf8bb]">Unite</span>
              </span>
            </Link>

            <div className="pt-4 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#6cf8bb] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google OAuth 2.0 Only</span>
              </div>
              <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-white">
                1-Click Passwordless Access
              </h2>
              <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
                Sign in securely with your Google account to unlock verified company past papers, aptitude topics, and interview experiences.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-emerald-50">
                <div className="w-5 h-5 rounded-full bg-[#6cf8bb]/20 flex items-center justify-center text-[#6cf8bb]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>TCS, Infosys, Accenture &amp; Wipro Past Papers</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-emerald-50">
                <div className="w-5 h-5 rounded-full bg-[#6cf8bb]/20 flex items-center justify-center text-[#6cf8bb]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Zero Passwords to Remember</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-emerald-50">
                <div className="w-5 h-5 rounded-full bg-[#6cf8bb]/20 flex items-center justify-center text-[#6cf8bb]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Instant Profile &amp; Saved Bookmarks Sync</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-auto border-t border-white/15">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center gap-1 text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white/90 italic font-medium">
                "Signing in with Google took 2 seconds! Got immediate access to all TCS Digital OA memory papers."
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-emerald-200">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Priya Sharma — Placed at TCS Digital (2025)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 1-Click Google OAuth Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between relative z-10">

          {/* Mobile Header Brand */}
          <div className="flex lg:hidden items-center justify-between mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#006c49] text-white flex items-center justify-center font-black text-lg shadow-sm">
                P
              </div>
              <span className="font-display text-xl font-black text-[#1f1b17] dark:text-white">
                Prep<span className="text-[#006c49] dark:text-[#6cf8bb]">Unite</span>
              </span>
            </Link>

            <span className="px-2.5 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] dark:text-[#6cf8bb] text-[10px] font-black uppercase">
              Google OAuth
            </span>
          </div>

          {/* STATE 1: LOGGED IN USER VIEW */}
          {isAuthenticated && user ? (
            <div className="my-auto space-y-6 max-w-md mx-auto w-full text-center animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#006c49]/10 border-4 border-[#006c49] relative mx-auto shadow-md">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="font-black text-2xl text-[#006c49] dark:text-[#6cf8bb]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="font-display text-2xl font-black text-[#1f1b17] dark:text-white">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
                  Signed in as <span className="font-bold text-[#1f1b17] dark:text-white">{user.email}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#747878] dark:text-[#a6adbb]">Role:</span>
                  <span className="font-bold text-[#006c49] dark:text-[#6cf8bb]">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747878] dark:text-[#a6adbb]">Authentication:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Google OAuth 2.0</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Go to My Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={logout}
                  className="w-full py-3 px-4 rounded-2xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* STATE 2: 1-CLICK GOOGLE SIGN-IN VIEW */
            <div className="my-auto space-y-8 max-w-md mx-auto w-full">
              
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="font-display text-3xl font-black text-[#1f1b17] dark:text-white tracking-tight">
                  Sign In to PrepUnite
                </h1>
                <p className="text-sm text-[#747878] dark:text-[#a6adbb]">
                  Use your Google Account to log in with 1-click. No passwords required.
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* GIANT GOOGLE OAUTH BUTTON */}
              <div className="space-y-4">
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-[#2b2d31] border-2 border-[#eae1da] dark:border-[#383a40] hover:border-[#006c49] dark:hover:border-[#6cf8bb] text-[#1f1b17] dark:text-white font-extrabold text-sm shadow-md hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 group"
                >
                  {googleLoading ? (
                    <div className="w-5 h-5 border-2 border-[#006c49] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb] group-hover:translate-x-1 transition-transform ml-auto" />
                </button>

                <p className="text-[11px] text-[#747878] dark:text-[#a6adbb] text-center leading-relaxed font-medium">
                  By continuing, you agree to PrepUnite's Terms of Service and Privacy Policy. We never post without your permission.
                </p>
              </div>

              {/* SECURITY FOOTER */}
              <div className="pt-6 border-t border-[#eae1da] dark:border-[#2b2d31]">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#747878] dark:text-[#a6adbb]">
                  <ShieldCheck className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb]" />
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
