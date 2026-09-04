import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { tpoService } from '@/services/tpo.service';
import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  ExternalLink,
  Award,
} from 'lucide-react';

export default function TpoLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch all colleges if super admin, or fetch TPO's specific college
  const { data: allColleges = [] } = useQuery({
    queryKey: ['tpo-colleges-list'],
    queryFn: () => tpoService.getAllColleges(),
  });

  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(user?.collegeId || '');
  const effectiveCollegeId = selectedCollegeId || user?.collegeId || (allColleges[0]?.id ?? '');

  const currentCollege = allColleges.find(c => c.id === effectiveCollegeId) || {
    id: effectiveCollegeId,
    name: user?.collegeName || 'Engineering College',
    code: 'CRT',
    max_licenses: 1000,
  };

  const { data: stats } = useQuery({
    queryKey: ['tpo-stats', effectiveCollegeId],
    queryFn: () => tpoService.getTpoStats(effectiveCollegeId),
    enabled: !!effectiveCollegeId,
  });

  const navItems = [
    {
      name: 'Overview',
      path: '/tpo',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Students & Batches',
      path: '/tpo/students',
      icon: Users,
      badge: stats?.totalStudents ? `${stats.totalStudents}` : undefined,
    },
    {
      name: 'Mock Exams',
      path: '/tpo/exams',
      icon: FileText,
      badge: stats?.activeExamsCount ? `${stats.activeExamsCount} Live` : undefined,
    },
    {
      name: 'Placement Analytics',
      path: '/tpo/analytics',
      icon: BarChart3,
    },
    {
      name: 'College Settings',
      path: '/tpo/settings',
      icon: Settings,
    },
  ];

  const isNavActive = (itemPath: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === itemPath;
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* 1. TOP ENTERPRISE NAVBAR */}
      <header className="sticky top-0 z-30 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Left: Branding & College Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/tpo" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FD4A32] to-[#FF7A00] text-white flex items-center justify-center font-black shadow-md shadow-[#FD4A32]/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                    {currentCollege.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    {currentCollege.code}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                  <span>Campus Placement Intelligence</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center/Right: License Usage, Switcher, Theme & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Super Admin College Switcher */}
            {isAdmin && allColleges.length > 1 && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Campus:</span>
                <select
                  value={effectiveCollegeId}
                  onChange={e => setSelectedCollegeId(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {allColleges.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* License Meter Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
              <GraduationCap className="w-4 h-4 text-[#FD4A32]" />
              <div className="text-[11px]">
                <span className="font-bold text-slate-800 dark:text-slate-200">{stats?.totalStudents || 0}</span>
                <span className="text-slate-400"> / {stats?.maxLicenses || 1000} Licenses</span>
              </div>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* TPO User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-300 dark:border-slate-700">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                  {user?.name || 'Placement Officer'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                  {user?.email}
                </div>
              </div>

              {/* Super Admin Escape Hatch */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-bold uppercase tracking-wider"
                  title="Return to PrepUnite Super Admin"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </Link>
              )}

              <button
                onClick={() => logout()}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Enterprise Left Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 p-4 space-y-6 shrink-0 justify-between">
          <div className="space-y-6">
            
            <div className="px-3 pt-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono">
                Management Modules
              </span>
            </div>

            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = isNavActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#FD4A32] text-white shadow-md shadow-[#FD4A32]/20 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Placement Cell Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">CRT Active 2026</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Standardized campus recruitment training and memory archives deployed.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex">
            <div className="w-64 bg-white dark:bg-[#111827] h-full p-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-black text-sm text-slate-900 dark:text-white">{currentCollege.code} Portal</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const active = isNavActive(item.path, item.exact);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          active
                            ? 'bg-[#FD4A32] text-white font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={() => logout()}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main Content Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet context={{ collegeId: effectiveCollegeId, currentCollege, stats }} />
        </main>

      </div>

    </div>
  );
}
