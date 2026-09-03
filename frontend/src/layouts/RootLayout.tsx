import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/Sidebar';
import FloatingGlassTokens from '@/components/FloatingGlassTokens';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ShieldCheck, Plus, Sun, Moon, LogIn, ArrowRight, User, Menu } from 'lucide-react';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/about',
  '/contact',
  '/pricing',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
];

export default function RootLayout() {
  const location = useLocation();
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = role === 'ADMIN';
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Instant Real-Time Data Synchronization Engine across all Tabs, Pages, and Roles
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleStoreUpdate = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['live-companies'] });
        queryClient.invalidateQueries({ queryKey: ['live-all-exams'] });
        queryClient.invalidateQueries({ queryKey: ['live-exams'] });
        queryClient.invalidateQueries({ queryKey: ['live-experiences'] });
        queryClient.invalidateQueries({ queryKey: ['live-questions'] });
        queryClient.invalidateQueries({ queryKey: ['live-resources'] });
        queryClient.invalidateQueries({ queryKey: ['company'] });
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      }, 250);
    };

    window.addEventListener('prepunite_datastore_updated', handleStoreUpdate);
    window.addEventListener('storage', handleStoreUpdate);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('prepunite_datastore_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'DATASTORE_UPDATED') {
            handleStoreUpdate();
          }
        };
      } catch {}
    }

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener('prepunite_datastore_updated', handleStoreUpdate);
      window.removeEventListener('storage', handleStoreUpdate);
      if (bc) bc.close();
    };
  }, [queryClient]);

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  // While checking Supabase session, render a clean loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fff8f5] dark:bg-[#141517] flex flex-col items-center justify-center gap-3 animate-fadeIn">
        <div className="w-10 h-10 border-4 border-[#FD4A32]/20 border-t-[#FD4A32] rounded-full animate-spin" />
        <span className="text-xs font-bold text-[#747878] uppercase tracking-wider">Verifying Session...</span>
      </div>
    );
  }

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FD4A32] selection:text-white transition-colors">

        {/* ── PREMIUM PUBLIC NAVBAR ── */}
        <header className="pub-nav">
          <div className="pub-nav-inner">
            {/* Brand */}
            <Link to="/" className="pub-nav-brand">
              <img src="/favicon.svg" alt="Jobsfolder Logo" className="pub-nav-logo-img" />
              <div className="pub-nav-brand-text">
                <span className="pub-nav-brand-name">
                  Jobs<span>folder</span>
                </span>
                <span className="pub-nav-brand-sub">PrepUnite Placement Intelligence</span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="pub-nav-links">
              <Link to="/" className="pub-nav-link">Home</Link>
              <Link to="/about" className="pub-nav-link">About</Link>
              <Link to="/companies" className="pub-nav-link">Companies</Link>
              <Link to="/questions" className="pub-nav-link">OA Papers</Link>
              <Link to="/pricing" className="pub-nav-link">Pricing</Link>
              <Link to="/contact" className="pub-nav-link">Contact</Link>
            </nav>

            {/* Right actions */}
            <div className="pub-nav-right">
              <button
                type="button"
                onClick={toggleTheme}
                className="pub-nav-theme-btn"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {isAuthenticated && user ? (
                <Link to="/profile" className="pub-nav-cta">
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <Link to="/login" className="pub-nav-cta">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* PUBLIC CONTENT AREA — no padding for home page full bleed */}
        <main className="flex-1 w-full">
          <Outlet />
        </main>

        {/* ── PREMIUM DARK FOOTER ── */}
        <footer className="pub-footer">
          {/* 3D Floating Glass Tokens & Code Particles (Raycast / Figma Style) */}
          <FloatingGlassTokens />

          <div className="pub-footer-inner">
            {/* Brand column */}
            <div className="pub-footer-brand">
              <Link to="/" className="pub-footer-logo">
                <img src="/favicon.svg" alt="Jobsfolder Logo" className="pub-footer-logo-img" />
                <span className="pub-footer-logo-name">Jobs<span>folder</span></span>
              </Link>
              <p className="pub-footer-tagline">
                PrepUnite's placement intelligence platform for engineering students preparing for India's top campus recruiters.
              </p>
              <div className="pub-footer-social">
                <span className="pub-footer-social-btn">X</span>
                <span className="pub-footer-social-btn">in</span>
                <span className="pub-footer-social-btn">▶</span>
                <span className="pub-footer-social-btn">ig</span>
              </div>
            </div>

            {/* Platform links */}
            <div className="pub-footer-col">
              <div className="pub-footer-col-title">Platform</div>
              <div className="pub-footer-col-links">
                <Link to="/companies" className="pub-footer-col-link">Company Blueprints</Link>
                <Link to="/questions" className="pub-footer-col-link">OA Question Bank</Link>
                <Link to="/experiences" className="pub-footer-col-link">Interview Experiences</Link>
                <Link to="/pricing" className="pub-footer-col-link">Pricing & Plans</Link>
              </div>
            </div>

            {/* Company links */}
            <div className="pub-footer-col">
              <div className="pub-footer-col-title">Company</div>
              <div className="pub-footer-col-links">
                <Link to="/about" className="pub-footer-col-link">About Us</Link>
                <Link to="/contact" className="pub-footer-col-link">Contact Us</Link>
                <Link to="/login" className="pub-footer-col-link">Sign In</Link>
              </div>
            </div>

            {/* Legal links */}
            <div className="pub-footer-col">
              <div className="pub-footer-col-title">Legal</div>
              <div className="pub-footer-col-links">
                <Link to="/privacy-policy" className="pub-footer-col-link">Privacy Policy</Link>
                <Link to="/terms-and-conditions" className="pub-footer-col-link">Terms & Conditions</Link>
                <Link to="/refund-policy" className="pub-footer-col-link">Refund Policy</Link>
              </div>
            </div>
          </div>

          {/* DPDP Act 2023 — Grievance Officer notice (Section 13) */}
          <div className="pub-footer-inner border-t border-[#2a2a2a] pt-4 mt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <div>
                  <p className="text-[10px] font-display font-bold text-white uppercase tracking-wider">
                    Grievance Officer — DPDP Act, 2023 (Section 13)
                  </p>
                  <p className="text-[10px] text-[#666666] font-sans">
                    For data access, correction, erasure, or privacy complaints — response within 7 working days
                  </p>
                </div>
              </div>
              <a
                href="mailto:prepsunite@gmail.com"
                className="shrink-0 text-[10px] font-bold text-[#FD4A32] hover:text-[#e03e28] underline transition-colors"
              >
                prepsunite@gmail.com
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pub-footer-bottom">
            <p className="pub-footer-copy">© 2026 PrepUnite · Jobsfolder · Placement Intelligence Operating System</p>
            <div className="pub-footer-legal">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-and-conditions">Terms of Service</Link>
              <Link to="/refund-policy">Refund Policy</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // INTERNAL APP WORKSPACE LAYOUT (WITH RESPONSIVE SIDEBAR)
  return (
    <div className="min-h-screen bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-[#FFFFFF] flex flex-col md:flex-row font-sans selection:bg-[#FD4A32] selection:text-white transition-colors">
      {/* Mobile Workspace Top Header Bar (< md) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 -ml-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-[#121417] dark:text-white cursor-pointer"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="PrepUnite Logo" className="w-6 h-6 rounded-full" />
          <span className="font-display font-extrabold text-sm tracking-tight text-[#121417] dark:text-white">
            Prep<span className="text-[#FD4A32]">Unite</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-white rounded-md cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Sidebar (Desktop persistent, Mobile drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Workspace Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0C0C0C]">
        {/* Top Admin Header Bar when Admin is Logged In */}
        {isAdmin && (
          <div className="bg-[#121417] dark:bg-[#141414] text-white py-2 px-6 border-b border-[#242424] text-xs font-semibold flex items-center justify-between gap-4 shadow-sm sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-display font-bold uppercase tracking-wider text-[10px]">
                Admin Console Active — {user?.email}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Link to="/admin" className="hover:text-emerald-300 font-display font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <Link to="/admin/bulk-import" className="hover:text-emerald-300 font-display font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Bulk Import
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
        
        <footer className="border-t border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] py-4 px-8 text-xs text-[#868E96] dark:text-[#555555] flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <p>© 2026 PrepUnite · Placement Intelligence Operating System.</p>
          <div className="flex flex-wrap items-center gap-4 font-semibold text-[#495057] dark:text-[#999999]">
            <Link to="/about" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">About Us</Link>
            <Link to="/contact" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">Contact Us</Link>
            <Link to="/pricing" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">Pricing</Link>
            <Link to="/privacy-policy" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">Terms & Conditions</Link>
            <Link to="/refund-policy" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">Refund Policy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

