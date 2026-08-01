import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Building2,
  GraduationCap,
  Star,
  AlertCircle,
  Check,
  Zap,
  FileText,
  KeyRound,
} from 'lucide-react';

export default function LoginPage() {
  const {
    user,
    role,
    isAuthenticated,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    loginAsUser,
    loginAsAdmin,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  // Mode state: 'signIn' | 'signUp' | 'forgot'
  const [mode, setMode] = useState<'signIn' | 'signUp' | 'forgot'>('signIn');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetExam, setTargetExam] = useState('TCS NQT 2026');
  const [showPassword, setShowPassword] = useState(false);

  // Status & loading states
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick Admin Password Prompt
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleGoogleSignIn = async () => {
    resetMessages();
    setSocialLoading('google');
    try {
      const res = await signInWithGoogle();
      if (res?.error) {
        setErrorMessage(typeof res.error === 'string' ? res.error : res.error.message || 'Google sign in failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during Google sign in.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGithubSignIn = async () => {
    resetMessages();
    setSocialLoading('github');
    try {
      const res = await signInWithGithub();
      if (res?.error) {
        setErrorMessage(typeof res.error === 'string' ? res.error : res.error.message || 'GitHub sign in failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during GitHub sign in.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSubmitEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }
    resetMessages();
    setIsLoading(true);

    const res = await signInWithEmail(email, password);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage('Successfully signed in!');
      setTimeout(() => navigate('/companies'), 800);
    }
  };

  const handleSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    resetMessages();
    setIsLoading(true);

    const res = await signUpWithEmail(email, password, fullName);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage('Account created! Please check your email to confirm your account, or sign in.');
      setMode('signIn');
    }
  };

  const handleSubmitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    resetMessages();
    setIsLoading(true);

    const res = await resetPassword(email);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage('Password reset link sent! Check your email inbox.');
    }
  };

  const handleQuickDemoStudent = () => {
    loginAsUser('Demo Student', 'student@prepunite.com');
    navigate('/companies');
  };

  const handleQuickAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsAdmin(adminPasswordInput);
    if (success) {
      setShowAdminModal(false);
      navigate('/admin');
    } else {
      setErrorMessage('Invalid admin key. Try default: admin123');
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-fadeIn">
      <div className="w-full max-w-5xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Background Ambient Blur Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#006c49]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT COLUMN: Brand Showcase & Value Propositions (Desktop View) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#006c49] via-[#005a3c] to-[#043928] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
          {/* Subtle Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 space-y-6">
            {/* Header Brand */}
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
                <span>Supabase OAuth 2.0 Enabled</span>
              </div>
              <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-white">
                Ace Your Next Campus Placement Drive
              </h2>
              <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
                Access 1,000+ verified company test papers, detailed aptitude step-by-step solutions, and real interview experiences.
              </p>
            </div>

            {/* Feature Checklist */}
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
                <span>Interactive Aptitude &amp; Coding Practice</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-emerald-50">
                <div className="w-5 h-5 rounded-full bg-[#6cf8bb]/20 flex items-center justify-center text-[#6cf8bb]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>1-Click Passwordless OAuth Authentication</span>
              </div>
            </div>
          </div>

          {/* Testimonial Quote Widget */}
          <div className="relative z-10 pt-8 mt-auto border-t border-white/15">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center gap-1 text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white/90 italic font-medium">
                "PrepUnite helped me crack TCS NQT Digital with top scores! The past papers &amp; aptitude topics were spot on."
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-emerald-200">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Priya Sharma — Placed at TCS Digital (2025)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication Form & Interactive Controls */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between relative z-10">

          {/* Brand Header for Mobile View */}
          <div className="flex lg:hidden items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#006c49] text-white flex items-center justify-center font-black text-lg shadow-sm">
                P
              </div>
              <span className="font-display text-xl font-black text-[#1f1b17] dark:text-white">
                Prep<span className="text-[#006c49] dark:text-[#6cf8bb]">Unite</span>
              </span>
            </Link>

            <span className="px-2.5 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] dark:text-[#6cf8bb] text-[10px] font-black uppercase">
              Supabase Auth
            </span>
          </div>

          {/* STATE 1: ALREADY AUTHENTICATED USER */}
          {isAuthenticated && user ? (
            <div className="my-auto space-y-6 max-w-md mx-auto w-full animate-fadeIn">
              <div className="text-center space-y-2">
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

                <h1 className="font-display text-2xl font-black text-[#1f1b17] dark:text-white tracking-tight">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
                  You are logged in as <span className="font-bold text-[#1f1b17] dark:text-white">{user.email}</span>
                </p>
              </div>

              {/* Profile Details Badge */}
              <div className="p-4 rounded-2xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#747878] dark:text-[#a6adbb] font-medium">Account Role:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#006c49]/15 text-[#006c49] dark:text-[#6cf8bb] text-[10px] font-black uppercase">
                    {role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#747878] dark:text-[#a6adbb] font-medium">Target Company:</span>
                  <span className="font-bold text-[#1f1b17] dark:text-white">{user.targetCompany || 'TCS NQT 2026'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#747878] dark:text-[#a6adbb] font-medium">Auth Provider:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Supabase OAuth 2.0
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => navigate('/companies')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Company Papers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {role === 'ADMIN' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Open Admin Dashboard</span>
                  </button>
                )}

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
            /* STATE 2: UNAUTHENTICATED FORM & OAUTH CONTROLS */
            <div className="max-w-md mx-auto w-full space-y-6 my-auto">
              
              {/* Header Title & Mode Selector */}
              <div className="space-y-4">
                <div className="text-left space-y-1">
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1f1b17] dark:text-white tracking-tight">
                    {mode === 'signIn' && 'Sign In to PrepUnite'}
                    {mode === 'signUp' && 'Create Your Account'}
                    {mode === 'forgot' && 'Reset Password'}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#747878] dark:text-[#a6adbb]">
                    {mode === 'signIn' && 'Choose your preferred authentication method to continue.'}
                    {mode === 'signUp' && 'Join thousands of students preparing for top placement drives.'}
                    {mode === 'forgot' && 'We will send a password reset link to your email.'}
                  </p>
                </div>

                {/* Tabs Switcher */}
                {mode !== 'forgot' && (
                  <div className="flex p-1 rounded-2xl bg-[#f4ece6] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31]">
                    <button
                      type="button"
                      onClick={() => { setMode('signIn'); resetMessages(); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        mode === 'signIn'
                          ? 'bg-white dark:bg-[#2b2d31] text-[#006c49] dark:text-[#6cf8bb] shadow-sm'
                          : 'text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('signUp'); resetMessages(); }}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        mode === 'signUp'
                          ? 'bg-white dark:bg-[#2b2d31] text-[#006c49] dark:text-[#6cf8bb] shadow-sm'
                          : 'text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-white'
                      }`}
                    >
                      New Account
                    </button>
                  </div>
                )}
              </div>

              {/* Status Banners */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* OAuth Providers Section (Shown in Sign In & Sign Up Modes) */}
              {mode !== 'forgot' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      disabled={!!socialLoading || isLoading}
                      onClick={handleGoogleSignIn}
                      className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-[#2b2d31] border border-[#eae1da] dark:border-[#383a40] hover:border-[#006c49] dark:hover:border-[#6cf8bb] text-[#1f1b17] dark:text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                    >
                      {socialLoading === 'google' ? (
                        <div className="w-4 h-4 border-2 border-[#006c49] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      )}
                      <span>Google OAuth</span>
                    </button>

                    {/* GitHub OAuth Button */}
                    <button
                      type="button"
                      disabled={!!socialLoading || isLoading}
                      onClick={handleGithubSignIn}
                      className="w-full py-3 px-4 rounded-2xl bg-[#24292e] hover:bg-[#1b1f23] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                    >
                      {socialLoading === 'github' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      )}
                      <span>GitHub OAuth</span>
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-[#eae1da] dark:border-[#2b2d31] w-full" />
                    <span className="bg-white dark:bg-[#1e1f22] px-3 text-[10px] font-bold text-[#747878] uppercase tracking-wider shrink-0 relative z-10">
                      or with email
                    </span>
                  </div>
                </div>
              )}

              {/* FORMS */}
              {/* Form 1: Sign In Form */}
              {mode === 'signIn' && (
                <form onSubmit={handleSubmitEmailSignIn} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] focus:ring-2 focus:ring-[#006c49] text-xs font-semibold outline-none transition-all text-[#1f1b17] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); resetMessages(); }}
                        className="text-[11px] font-bold text-[#006c49] dark:text-[#6cf8bb] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] focus:ring-2 focus:ring-[#006c49] text-xs font-semibold outline-none transition-all text-[#1f1b17] dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#1f1b17] dark:hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Form 2: Sign Up Form */}
              {mode === 'signUp' && (
                <form onSubmit={handleSubmitSignUp} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] focus:ring-2 focus:ring-[#006c49] text-xs font-semibold outline-none transition-all text-[#1f1b17] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] focus:ring-2 focus:ring-[#006c49] text-xs font-semibold outline-none transition-all text-[#1f1b17] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">
                      Password (min. 6 chars)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] focus:ring-2 focus:ring-[#006c49] text-xs font-semibold outline-none transition-all text-[#1f1b17] dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#1f1b17] dark:hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">
                      Target Placement Exam
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={targetExam}
                        onChange={(e) => setTargetExam(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] focus:ring-2 focus:ring-[#006c49] text-xs font-semibold outline-none transition-all text-[#1f1b17] dark:text-white cursor-pointer"
                      >
                        <option value="TCS NQT 2026">TCS NQT / Digital 2026</option>
                        <option value="Infosys DSE / SP">Infosys DSE / Specialist Programmer</option>
                        <option value="Accenture ASE">Accenture ASE / FSE</option>
                        <option value="Wipro Elite">Wipro Elite NLTH</option>
                        <option value="Cognizant GenC">Cognizant GenC Next</option>
                        <option value="General Practice">General Aptitude &amp; Reasoning</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Form 3: Forgot Password Form */}
              {mode === 'forgot' && (
                <form onSubmit={handleSubmitForgot} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">
                      Enter Your Account Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] focus:ring-2 focus:ring-[#006c49] text-xs font-semibold outline-none transition-all text-[#1f1b17] dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMode('signIn'); resetMessages(); }}
                    className="w-full text-center text-xs font-bold text-[#006c49] dark:text-[#6cf8bb] hover:underline block pt-2"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              )}

              {/* Quick Demo Login Options & Footer Security Note */}
              <div className="pt-4 border-t border-[#eae1da] dark:border-[#2b2d31] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#747878] dark:text-[#a6adbb]">
                  <span className="font-semibold">Test drive without OAuth?</span>
                  <div className="flex items-center gap-2 font-bold">
                    <button
                      onClick={handleQuickDemoStudent}
                      className="text-[#006c49] dark:text-[#6cf8bb] hover:underline cursor-pointer"
                    >
                      Student Demo
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setShowAdminModal(true)}
                      className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Admin Demo
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#747878] dark:text-[#a6adbb] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#006c49] dark:text-[#6cf8bb]" />
                  <span>Secured by Supabase OAuth 2.0 &amp; 256-bit SSL</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* QUICK ADMIN ACCESS MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-display font-black text-base text-[#1f1b17] dark:text-white">
                  Admin Passcode Access
                </h3>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-xs font-bold text-[#747878] hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
              Enter the admin passcode to unlock full platform management, question uploads, and experience approvals.
            </p>

            <form onSubmit={handleQuickAdminLogin} className="space-y-3">
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Enter passcode (default: admin123)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8f5f2] dark:bg-[#141517] border border-[#eae1da] dark:border-[#2b2d31] focus:ring-2 focus:ring-amber-500 text-xs font-semibold outline-none text-[#1f1b17] dark:text-white"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#eae1da] dark:border-[#2b2d31] text-xs font-bold text-[#747878] dark:text-[#a6adbb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
                >
                  Unlock Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
