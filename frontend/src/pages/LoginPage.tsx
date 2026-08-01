import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight, LogOut, Lock, UserCheck, Zap, Layers, FileText } from 'lucide-react';

export default function LoginPage() {
  const { user, isAuthenticated, signInWithGoogle, logout, role } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    await signInWithGoogle();
    setIsSigningIn(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#006c49]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-2xl bg-[#006c49] text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="font-display text-xl font-black tracking-tight text-[#1f1b17] dark:text-white">
              Prep<span className="text-[#006c49] dark:text-[#6cf8bb]">Unite</span>
            </span>
          </Link>
          
          <h1 className="font-display text-2xl font-black text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight">
            {isAuthenticated ? 'Welcome Back!' : 'Sign In to PrepUnite'}
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
            {isAuthenticated 
              ? 'You are signed in with Google OAuth 2.0' 
              : 'Passwordless 1-Click Authentication using Google OAuth 2.0'}
          </p>
        </div>

        {/* State 1: Already Authenticated User Profile */}
        {isAuthenticated && user ? (
          <div className="p-5 rounded-2xl bg-[#f6ece6]/60 dark:bg-[#141517]/60 border border-[#eae1da] dark:border-[#383a40] space-y-4 relative z-10 animate-fadeIn">
            <div className="flex items-center gap-3.5">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full border-2 border-[#006c49] shadow-sm object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#006c49]/15 border-2 border-[#006c49] text-[#006c49] dark:text-[#6cf8bb] flex items-center justify-center font-black text-lg">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-[#1f1b17] dark:text-[#e3e3e3] truncate">{user.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#006c49]/15 text-[#006c49] dark:text-[#6cf8bb] text-[9px] font-black uppercase">
                    {role}
                  </span>
                </div>
                <p className="text-xs text-[#747878] dark:text-[#a6adbb] truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[#eae1da] dark:border-[#2b2d31]">
              <button
                onClick={() => navigate('/companies')}
                className="w-full py-3 rounded-xl bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Companies &amp; Papers</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={logout}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* State 2: Unauthenticated 1-Click Google OAuth Sign In */
          <div className="space-y-5 relative z-10">
            {/* Google OAuth 2.0 Button */}
            <button
              disabled={isSigningIn}
              onClick={handleGoogleSignIn}
              className="w-full py-4 px-5 rounded-2xl bg-white dark:bg-[#2b2d31] border-2 border-[#eae1da] dark:border-[#383a40] hover:border-[#006c49] dark:hover:border-[#6cf8bb] text-[#1f1b17] dark:text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-60"
            >
              {isSigningIn ? (
                <div className="w-5 h-5 border-2 border-[#006c49] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{isSigningIn ? 'Connecting to Google OAuth...' : 'Continue with Google'}</span>
            </button>

            {/* Value Propositions */}
            <div className="p-4 rounded-2xl bg-[#f6ece6]/50 dark:bg-[#141517]/50 border border-[#eae1da] dark:border-[#2b2d31] space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006c49] dark:text-[#6cf8bb] block">
                Why Sign In with Google?
              </span>
              <div className="space-y-2 text-xs text-[#444748] dark:text-[#a6adbb]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Zero Passwords</strong> — Secure OAuth 2.0 Token Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Instant Paper Unlocks</strong> — Sync purchases across mobile &amp; desktop</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Verified Student Pass</strong> — 256-bit encrypted access guarantee</span>
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#747878] dark:text-[#a6adbb]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006c49] dark:text-[#6cf8bb]" />
              <span>We never share your Google data or post on your behalf.</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
