import { Outlet, Link, useLocation } from 'react-router';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ShieldCheck, Plus, Sun, Moon, LogIn, Sparkles, Building2, BookOpen, Layers, ArrowRight, User } from 'lucide-react';

export default function RootLayout() {
  const location = useLocation();
  const { user, role, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = role === 'ADMIN';

  // Public standalone pages do not show internal dashboard sidebar
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-[#fff8f5] dark:bg-[#141517] text-[#1f1b17] dark:text-[#e3e3e3] flex flex-col font-sans selection:bg-[#6cf8bb] selection:text-[#005236] transition-colors">
        {/* PUBLIC STANDALONE NAVBAR */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1e1f22]/80 backdrop-blur-md border-b border-[#eae1da] dark:border-[#2b2d31] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[#006c49] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                P
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-[#1f1b17] dark:text-[#e3e3e3]">
                  Jobs<span className="text-[#006c49] dark:text-[#6cf8bb]">folder</span>
                </span>
                <span className="text-[9px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider">
                  PrepUnite Placement Intelligence
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#444748] dark:text-[#a6adbb]">
              <Link to="/" className="hover:text-[#006c49] dark:hover:text-[#6cf8bb] transition-colors">
                Home
              </Link>
              <Link to="/companies" className="hover:text-[#006c49] dark:hover:text-[#6cf8bb] transition-colors flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Companies</span>
              </Link>
              <Link to="/questions" className="hover:text-[#006c49] dark:hover:text-[#6cf8bb] transition-colors flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>OA Papers</span>
              </Link>
              <Link to="/experiences" className="hover:text-[#006c49] dark:hover:text-[#6cf8bb] transition-colors flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Experiences</span>
              </Link>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full border border-[#eae1da] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-white hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31] transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {isAuthenticated && user ? (
                <Link
                  to="/companies"
                  className="px-5 py-2.5 rounded-full bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-full bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* PUBLIC CONTENT AREA */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>

        {/* PUBLIC FOOTER */}
        <footer className="border-t border-[#eae1da] dark:border-[#2b2d31] bg-[#f6ece6] dark:bg-[#1e1f22] py-8 px-6 text-xs text-[#747878] dark:text-[#a6adbb]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1f1b17] dark:text-white">Jobsfolder</span>
              <span>© 2026 PrepUnite • Placement Intelligence Operating System.</span>
            </div>
            <div className="flex items-center gap-6 font-semibold text-[#1f1b17] dark:text-[#e3e3e3]">
              <Link to="/companies" className="hover:text-[#006c49] dark:hover:text-[#6cf8bb]">Companies</Link>
              <Link to="/questions" className="hover:text-[#006c49] dark:hover:text-[#6cf8bb]">OA Papers</Link>
              <Link to="/experiences" className="hover:text-[#006c49] dark:hover:text-[#6cf8bb]">Interview Experiences</Link>
              <Link to="/login" className="hover:text-[#006c49] dark:hover:text-[#6cf8bb]">Sign In</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // INTERNAL APP WORKSPACE LAYOUT (WITH PERSISTENT SIDEBAR)
  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#141517] text-[#1f1b17] dark:text-[#e3e3e3] flex font-sans selection:bg-[#6cf8bb] selection:text-[#005236] transition-colors">
      {/* Persistent Left Workspace Sidebar */}
      <Sidebar />

      {/* Main Workspace Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Header Bar when Admin is Logged In */}
        {isAdmin && (
          <div className="bg-[#1f1b17] dark:bg-[#141517] text-white py-2 px-6 border-b border-[#2b2d31] text-xs font-semibold flex items-center justify-between gap-4 shadow-sm sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold uppercase tracking-wider text-[11px]">
                Admin Console Active — {user?.email}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Link to="/admin" className="hover:text-emerald-300 font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <Link to="/admin/bulk-import" className="hover:text-emerald-300 font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Bulk Import
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
        
        <footer className="border-t border-[#eae1da] dark:border-[#2b2d31] bg-[#f6ece6] dark:bg-[#1e1f22] py-6 px-8 text-xs text-[#747878] dark:text-[#a6adbb] flex items-center justify-between transition-colors">
          <p>© 2026 PrepUnite • Elite Placement Intelligence System.</p>
          <div className="flex items-center gap-4 font-semibold text-[#1f1b17] dark:text-[#e3e3e3]">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
