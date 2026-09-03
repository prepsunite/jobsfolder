import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  Sun,
  Moon,
  Monitor,
  GraduationCap,
  Building2,
  LogOut,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, role, logout } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const isUserPro = role === 'ADMIN';

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: (user as any)?.college || '',
    graduationYear: (user as any)?.graduationYear || '2026',
    targetRole: (user as any)?.targetRole || 'Software Development Engineer',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12 font-sans">
      {/* Top Banner & Quick Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#868E96] dark:text-[#999999] hover:text-[#FD4A32] dark:hover:text-[#FD4A32] transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Learning Dashboard</span>
          </Link>
          <span className="text-[#868E96] dark:text-[#555555]">/</span>
          <span className="text-xs font-display font-bold text-[#121417] dark:text-white">
            Student Profile
          </span>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FD4A32]/10 hover:bg-[#FD4A32]/20 text-[#FD4A32] text-xs font-display font-bold border border-[#FD4A32]/25 transition-all shadow-2xs"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Open Dashboard</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#FD4A32] text-white flex items-center justify-center font-display font-black text-2xl shadow-sm shrink-0 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-white tracking-tight">
                  {user?.name || 'Student Profile'}
                </h1>
                {isUserPro ? (
                  <span className="text-[9px] font-display font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>Pro Pass</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-display font-bold px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/25 uppercase tracking-wider">
                    Free Tier
                  </span>
                )}
              </div>
              <p className="text-xs text-[#868E96] dark:text-[#777777] font-sans flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email || 'Logged in Account'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-md border border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C]">
              <button
                onClick={() => setThemeMode('light')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-display font-bold uppercase tracking-wider transition-all ${
                  themeMode === 'light'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-white'
                }`}
                title="Light Mode"
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-display font-bold uppercase tracking-wider transition-all ${
                  themeMode === 'dark'
                    ? 'bg-[#1C1C1C] text-[#FD4A32] shadow-xs'
                    : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-white'
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3 h-3 text-purple-400" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setThemeMode('system')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-display font-bold uppercase tracking-wider transition-all ${
                  themeMode === 'system'
                    ? 'bg-[#FD4A32] text-black shadow-xs'
                    : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-white'
                }`}
                title="System Auto"
              >
                <Monitor className="w-3 h-3" />
                <span>Auto</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details & Career Goals Form */}
      <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-5">
        <div>
          <h2 className="font-display text-base font-bold text-[#121417] dark:text-white">
            Academic &amp; Placement Target Details
          </h2>
          <p className="text-xs text-[#868E96] dark:text-[#777777] mt-0.5">
            Personalize your aptitude practice recommendations and placement drives.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-display font-bold text-[#121417] dark:text-gray-300">
                Full Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#868E96] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] bg-[#F8F9FA] dark:bg-[#0C0C0C] text-xs text-[#121417] dark:text-white focus:outline-none focus:border-[#FD4A32]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-display font-bold text-[#121417] dark:text-gray-300">
                Target Role
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#868E96] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g. Software Engineer / Data Analyst"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] bg-[#F8F9FA] dark:bg-[#0C0C0C] text-xs text-[#121417] dark:text-white focus:outline-none focus:border-[#FD4A32]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-display font-bold text-[#121417] dark:text-gray-300">
                College / Institution
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-[#868E96] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. IIT Madras, BITS Pilani, SRM"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] bg-[#F8F9FA] dark:bg-[#0C0C0C] text-xs text-[#121417] dark:text-white focus:outline-none focus:border-[#FD4A32]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-display font-bold text-[#121417] dark:text-gray-300">
                Graduation Year
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#868E96] absolute left-3 top-2.5" />
                <select
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] bg-[#F8F9FA] dark:bg-[#0C0C0C] text-xs text-[#121417] dark:text-white focus:outline-none focus:border-[#FD4A32]"
                >
                  <option value="2025">Class of 2025</option>
                  <option value="2026">Class of 2026 (Active Drive)</option>
                  <option value="2027">Class of 2027</option>
                  <option value="2028">Class of 2028</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Profile details saved successfully!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Account Security & Sign Out Section */}
      <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-display font-bold text-sm text-[#121417] dark:text-white">
              Account Security &amp; Sessions
            </span>
          </div>
          <p className="text-xs text-[#868E96] dark:text-[#777777]">
            Authenticated via secure Supabase Google / Email authentication.
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-rose-300 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-display font-bold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
