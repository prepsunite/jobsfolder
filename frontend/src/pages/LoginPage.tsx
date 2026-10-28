import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useConsent } from '@/contexts/ConsentContext';
import LoadingScreen from '@/components/LoadingScreen';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LogOut,
  GraduationCap,
  Star,
  AlertCircle,
  Check,
  LayoutDashboard,
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

  // Sync login consent to global ConsentContext (fixes Profile showing wrong status)
  const { acceptConsent } = useConsent();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Support both redirectTo and redirect params
  const rawRedirectTo = searchParams.get('redirectTo') || searchParams.get('redirect');

  /**
   * 🛡️ Open Redirect Protection:
   * Confines destination URLs strictly to internal application routes.
   * Rejects protocol-relative URLs (//), backslashes (\), and external URI schemes.
   */
  const sanitizeRedirectPath = (path: string | null | undefined, fallback: string = '/dashboard'): string => {
    if (!path) return fallback;
    const trimmed = path.trim();
    if (
      !trimmed.startsWith('/') ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('/\\') ||
      trimmed.includes('\\') ||
      /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
    ) {
      return fallback;
    }
    return trimmed;
  };

  const safeRedirectTo = sanitizeRedirectPath(rawRedirectTo, '/dashboard');

  // Status & loading states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Automatically navigate away from /login ONLY when an explicit redirect destination was provided
  // (Prevents kicking signed-in users out who navigate to /login to view status or sign out)
  useEffect(() => {
    if (isAuthenticated && user && !authLoading && rawRedirectTo) {
      if (role === 'ADMIN') {
        const targetPath = rawRedirectTo.startsWith('/admin')
          ? sanitizeRedirectPath(rawRedirectTo, '/admin')
          : '/admin';
        navigate(targetPath, { replace: true });
        return;
      }
      if (role === 'TPO_ADMIN' || user.isTpoAdmin) {
        const targetPath = rawRedirectTo.startsWith('/tpo')
          ? sanitizeRedirectPath(rawRedirectTo, '/tpo')
          : '/tpo';
        navigate(targetPath, { replace: true });
        return;
      }

      navigate(safeRedirectTo, { replace: true });
    }
  }, [isAuthenticated, user, role, authLoading, navigate, rawRedirectTo, safeRedirectTo]);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      // Record explicit consent in ConsentContext for DPDP Act 2023 compliance
      acceptConsent();
      const res = await signInWithGoogle(safeRedirectTo);
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
    return <LoadingScreen fullScreen={false} size="md" />;
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="w-full max-w-4xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* LEFT COLUMN: Brand Value Proposition (Desktop View) */}
        <div className="lg:col-span-5 bg-[#121417] dark:bg-[#0C0C0C] p-8 sm:p-10 text-white flex flex-col justify-between relative border-r border-[#242424] hidden lg:flex">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/favicon.svg"
                alt="MockFolder Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-contain shrink-0 transition-transform group-hover:scale-105"
              />
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                Mock<span className="text-[#FD4A32]">Folder</span>
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

          {/* STATE 1: LOGGED IN USER VIEW */}
          {isAuthenticated && user ? (
            <div className="my-auto space-y-5 max-w-sm mx-auto w-full text-center animate-fadeIn py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FD4A32]/10 border-2 border-[#FD4A32] relative mx-auto">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="font-display font-black text-xl text-[#FD4A32]">
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

              <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-2 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-[#868E96] dark:text-[#555555]">Role:</span>
                  <span className="font-bold text-[#FD4A32]">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#868E96] dark:text-[#555555]">Auth Provider:</span>
                  <span className="font-semibold text-[#121417] dark:text-[#FFFFFF]">Google OAuth 2.0</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (role === 'ADMIN') navigate('/admin');
                    else if (role === 'TPO_ADMIN' || user?.isTpoAdmin) navigate('/tpo');
                    else navigate('/dashboard');
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-display font-bold uppercase tracking-wider hover:bg-[#1E2227] dark:hover:bg-[#E5E7EB] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>
                    {role === 'ADMIN'
                      ? 'Go to Admin Console'
                      : role === 'TPO_ADMIN' || user?.isTpoAdmin
                      ? 'Launch TPO Dashboard'
                      : 'Go to My Dashboard'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-2 px-4 rounded-lg border border-[#E9ECEF] dark:border-[#242424] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* STATE 2: 1-CLICK GOOGLE SIGN-IN VIEW */
            <div className="my-auto space-y-6 max-w-sm mx-auto w-full py-4">
              
              <div className="space-y-1.5 text-center sm:text-left">
                <h1 className="font-display text-2xl font-extrabold text-[#121417] dark:text-white tracking-tight">
                  Sign In to MockFolder
                </h1>
                <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans">
                  Use your Google Account to access verified past papers, interview experiences, and solutions.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-start gap-2 animate-fadeIn font-sans">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* GIANT GOOGLE OAUTH BUTTON — Instant, Clickable, High-Contrast */}
              <div className="space-y-4">
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full py-3.5 px-4 rounded-lg bg-white dark:bg-[#1A1A1A] border-2 border-[#E5E7EB] dark:border-[#333333] hover:border-[#121417] dark:hover:border-[#666666] text-[#121417] dark:text-white font-display font-bold text-sm tracking-wide transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {googleLoading ? (
                    <div className="w-5 h-5 border-2 border-[#FD4A32] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* Clean, authoritative 1-line legal disclosure under DPDP Act 2023 */}
                <p className="text-[11px] text-[#868E96] dark:text-[#555555] text-center font-sans leading-relaxed px-1">
                  By continuing, you agree to MockFolder's{' '}
                  <Link to="/terms-and-conditions" className="text-[#FD4A32] underline hover:text-[#e03e28]">
                    Terms &amp; Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-[#FD4A32] underline hover:text-[#e03e28]">
                    Privacy Policy
                  </Link>
                  , and consent to account authentication data processing under the DPDP Act, 2023.
                </p>
              </div>

              {/* SECURITY FOOTER */}
              <div className="pt-4 border-t border-[#E9ECEF] dark:border-[#242424]">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#868E96] dark:text-[#555555] font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FD4A32]" />
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
