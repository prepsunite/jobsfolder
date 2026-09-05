import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { tpoService } from '@/services/tpo.service';
import Sidebar from '@/components/Sidebar';
import type { College, TpoDashboardStats } from '@/types/tpo';
import {
  Building2,
  Users,
  Menu,
  Sun,
  Moon,
  Clock,
} from 'lucide-react';

export interface TpoOutletContext {
  collegeId: string;
  currentCollege: College;
  stats?: TpoDashboardStats;
}

export default function TpoLayout() {
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch all colleges if super admin, or fetch TPO's specific college
  const { data: allColleges = [] } = useQuery({
    queryKey: ['tpo-colleges-list'],
    queryFn: () => tpoService.getAllColleges(),
  });

  const getInitialCollegeId = (): string => {
    if (user?.collegeId) return user.collegeId;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('prepunite_college_id');
      if (cached) return cached;
    }
    const tpoAuth = tpoService.findTpoAuthByEmail(user?.email);
    if (tpoAuth?.college_id) return tpoAuth.college_id;
    return '';
  };

  const tpoAuth = tpoService.findTpoAuthByEmail(user?.email);
  const authorizedCollegeId = tpoAuth?.college_id || user?.collegeId || (typeof window !== 'undefined' ? localStorage.getItem('prepunite_college_id') : '') || '';

  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(() => {
    if (isAdmin) {
      return getInitialCollegeId();
    }
    return authorizedCollegeId;
  });

  // Keep selectedCollegeId synchronized for Super Admins when user or colleges list loads
  useEffect(() => {
    if (isAdmin) {
      if (!selectedCollegeId) {
        const cached = typeof window !== 'undefined' ? localStorage.getItem('prepunite_college_id') : null;
        if (user?.collegeId) {
          setSelectedCollegeId(user.collegeId);
        } else if (cached) {
          setSelectedCollegeId(cached);
        } else if (tpoAuth?.college_id) {
          setSelectedCollegeId(tpoAuth.college_id);
        } else if (allColleges.length > 0 && allColleges[0]?.id) {
          setSelectedCollegeId(allColleges[0].id);
        }
      }
    } else {
      // Non-admin TPOs are strictly locked to their authorized college
      if (authorizedCollegeId && selectedCollegeId !== authorizedCollegeId) {
        setSelectedCollegeId(authorizedCollegeId);
      }
    }
  }, [isAdmin, user?.collegeId, user?.email, allColleges, selectedCollegeId, authorizedCollegeId, tpoAuth?.college_id]);

  // 🛡️ Cross-Tenant Security Invariant: Non-admin TPOs are strictly restricted to their authorized institution
  const effectiveCollegeId = isAdmin
    ? (selectedCollegeId || authorizedCollegeId || allColleges[0]?.id || '')
    : authorizedCollegeId;

  // Query real-time college details directly from Supabase
  const { data: dbCollegeDetails } = useQuery({
    queryKey: ['tpo-college-details', effectiveCollegeId],
    queryFn: () => (effectiveCollegeId ? tpoService.getCollegeDetails(effectiveCollegeId) : null),
    enabled: !!effectiveCollegeId,
  });

  const currentCollege: College = dbCollegeDetails || allColleges.find(c => c.id === effectiveCollegeId) || {
    id: effectiveCollegeId,
    name: tpoAuth?.college_name || user?.collegeName || 'Engineering College',
    code: tpoAuth?.college_code || 'CRT',
    slug: (effectiveCollegeId || 'crt').replace(/^col-/, ''),
    contract_status: 'ACTIVE',
    valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    max_licenses: tpoAuth?.max_licenses || 1500,
  };

  const totalCap = currentCollege.max_licenses || tpoAuth?.max_licenses || 1500;
  const validUntilDate = currentCollege.valid_until ? new Date(currentCollege.valid_until) : null;
  const now = new Date();
  const daysLeft = validUntilDate
    ? Math.ceil((validUntilDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const isContractExpired = validUntilDate ? daysLeft <= 0 : false;
  const isContractExpiringSoon = daysLeft > 0 && daysLeft <= 7;

  const { data: stats } = useQuery({
    queryKey: ['tpo-stats', effectiveCollegeId],
    queryFn: () => tpoService.getTpoStats(effectiveCollegeId),
    enabled: !!effectiveCollegeId,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-[#FFFFFF] flex flex-col md:flex-row font-sans selection:bg-[#FD4A32] selection:text-white transition-colors">
      
      {/* Mobile Workspace Top Header Bar (< md) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] sticky top-0 z-30">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 -ml-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-[#121417] dark:text-white cursor-pointer"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/tpo" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="PrepUnite Logo" className="w-6 h-6 rounded-full" />
          <span className="font-display font-extrabold text-sm tracking-tight text-[#121417] dark:text-white">
            Prep<span className="text-[#FD4A32]">Unite</span>
          </span>
          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">
            CRT
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

      {/* Main Unified Sidebar (Matches Image 1 Exactly) */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        collegeName={currentCollege.name}
        collegeCode={currentCollege.code}
      />

      {/* Main Workspace Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0C0C0C]">
        
        {/* Top Status & Institutional Campus Bar */}
        <div className="bg-[#18120c] dark:bg-[#120d08] text-amber-200 py-2.5 px-4 sm:px-8 border-b border-amber-500/20 text-xs font-semibold flex flex-wrap items-center justify-between gap-3 shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-[#FD4A32] shrink-0" />
            <span className="font-display font-bold uppercase tracking-wider text-[11px] text-amber-300 dark:text-amber-400">
              Institutional Placement Portal — {currentCollege.name}
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#FD4A32]/20 text-[#FD4A32] border border-[#FD4A32]/30">
              {currentCollege.code} CRT
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Super Admin College Switcher */}
            {isAdmin && allColleges.length > 1 && (
              <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Campus:</span>
                <select
                  value={effectiveCollegeId}
                  onChange={e => setSelectedCollegeId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  {allColleges.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#141414] text-white">
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Contract Validity & Remaining Days Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                isContractExpired
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : isContractExpiringSoon
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
              title={`Institutional package valid until ${validUntilDate ? validUntilDate.toLocaleDateString() : 'Continuous'}`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isContractExpired
                  ? 'Access Expired'
                  : `${daysLeft}d Access Left`}
              </span>
            </div>

            {/* Seat Capacity Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300">
              <Users className="w-3.5 h-3.5 text-[#FD4A32]" />
              <span>
                {stats?.totalStudents || 0} / {totalCap} Seats Enrolled
              </span>
            </div>

            {/* Theme Toggle (Desktop) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden md:flex p-1.5 text-amber-300/70 hover:text-amber-200 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet context={{ collegeId: effectiveCollegeId, currentCollege, stats }} />
        </main>

        {/* Unified Footer */}
        <footer className="border-t border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] py-4 px-8 text-xs text-[#868E96] dark:text-[#555555] flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <p>© 2026 PrepUnite · Placement Intelligence Operating System.</p>
          <div className="flex flex-wrap items-center gap-4 font-semibold text-[#495057] dark:text-[#999999]">
            <Link to="/about" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">About Us</Link>
            <Link to="/contact" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">Contact Us</Link>
            <Link to="/pricing" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">Pricing</Link>
            <Link to="/privacy-policy" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-[#FD4A32] dark:hover:text-[#FD4A32]">Terms &amp; Conditions</Link>
          </div>
        </footer>

      </div>

    </div>
  );
}
