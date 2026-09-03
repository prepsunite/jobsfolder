import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  BookOpen,
  Layers,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  Calculator,
  BarChart3,
  Brain,
  MessageSquare,
  Compass,
  KeyRound,
  Zap,
  Info,
  Mail,
  GitMerge,
  Terminal,
  X,
  LayoutDashboard,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, role, logout } = useAuth();
  const [isAptitudeExpanded, setIsAptitudeExpanded] = useState(true);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Companies & Exams', href: '/companies', icon: Building2 },
    { name: 'Exam Papers', href: '/questions', icon: BookOpen },
    { name: 'Experiences', href: '/experiences', icon: Layers },
    { name: 'Pricing & Passes', href: '/pricing', icon: Zap },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Contact Us', href: '/contact', icon: Mail },
  ];

  const aptitudeCategories = [
    { name: 'Arithmetic Aptitude', slug: 'arithmetic-aptitude', icon: Calculator },
    { name: 'Data Interpretation', slug: 'data-interpretation', icon: BarChart3 },
    { name: 'Logical Reasoning', slug: 'logical-reasoning', icon: Brain },
    { name: 'Verbal Reasoning', slug: 'verbal-reasoning', icon: GitMerge },
    { name: 'Verbal Ability', slug: 'verbal-ability', icon: MessageSquare },
    { name: 'Nonverbal Reasoning', slug: 'nonverbal-reasoning', icon: Compass },
    { name: 'Technical Aptitude', slug: 'technical-aptitude', icon: Terminal },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`w-64 bg-[#F8F9FA] dark:bg-[#0C0C0C] border-r border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between h-screen fixed md:sticky top-0 left-0 shrink-0 z-50 md:z-40 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {/* Brand Logo with Mobile Close Button */}
          <div className="flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5 group">
              <img
                src="/favicon.svg"
                alt="PrepUnite Logo"
                className="w-8 h-8 rounded-full object-contain shrink-0 transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base tracking-tight text-[#121417] dark:text-[#FFFFFF]">
                  Prep<span className="text-[#FD4A32]">Unite</span>
                </span>
                <span className="text-[8px] font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider">
                  {role === 'ADMIN' ? 'Admin Portal' : role === 'USER' ? 'Student Workspace' : 'Guest Mode'}
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#868E96] dark:text-[#555555] hover:bg-black/5 dark:hover:bg-white/5 md:hidden"
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clean Status Badge */}
          <div className="p-2 rounded-md bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  role === 'ADMIN'
                    ? 'bg-purple-500 animate-pulse'
                    : role === 'USER'
                    ? 'bg-emerald-500'
                    : 'bg-[#FD4A32]'
                }`}
              />
              <span className="font-display font-bold text-[#121417] dark:text-[#FFFFFF] uppercase tracking-wider text-[10px]">
                {role === 'ADMIN' ? 'Admin Active' : role === 'USER' ? 'Student Mode' : 'Guest Preview'}
              </span>
            </div>
            <span className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase">
              2026
            </span>
          </div>

          {/* Main Navigation Links */}
          <nav className="space-y-0.5">
            <span className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider block px-2.5 mb-1 font-display">
              Menu
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#121417] dark:bg-[#1C1C1C] text-white dark:text-white border border-[#121417] dark:border-[#2E2E2E] shadow-2xs'
                      : 'text-[#495057] dark:text-[#999999] hover:text-[#121417] dark:hover:text-[#FFFFFF] hover:bg-white dark:hover:bg-[#141414] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 shrink-0 text-[#FD4A32] transition-transform group-hover:scale-110" />
                    <span>{link.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3 text-[#FD4A32]" />}
                </Link>
              );
            })}
          </nav>

          {/* Collapsible Aptitude Categories */}
          <div className="pt-3 pb-1 border-t border-[#E9ECEF] dark:border-[#242424]">
            <button
              type="button"
              onClick={() => setIsAptitudeExpanded(!isAptitudeExpanded)}
              className="w-full flex items-center justify-between px-2.5 py-1 text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider hover:text-[#121417] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer group font-display"
            >
              <span>Aptitude & Reasoning</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  isAptitudeExpanded ? 'rotate-180 text-[#FD4A32]' : 'text-[#868E96] dark:text-[#555555]'
                }`}
              />
            </button>

            {isAptitudeExpanded && (
              <div className="space-y-0.5 pt-1.5 animate-fadeIn">
                {aptitudeCategories.map((cat) => {
                  const CatIcon = cat.icon;
                  const isCatActive = location.pathname.startsWith(`/aptitude/${cat.slug}`);
                  return (
                    <Link
                      key={cat.name}
                      to={`/aptitude/${cat.slug}`}
                      onClick={onClose}
                      className={`group flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        isCatActive
                          ? 'bg-[#121417] dark:bg-[#1C1C1C] text-white dark:text-white border border-[#121417] dark:border-[#2E2E2E]'
                          : 'text-[#495057] dark:text-[#999999] hover:text-[#121417] dark:hover:text-[#FFFFFF] hover:bg-white dark:hover:bg-[#141414] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CatIcon className="w-3.5 h-3.5 shrink-0 text-[#FD4A32] transition-transform group-hover:scale-110" />
                        <span className="truncate">{cat.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Admin Control Panel Section */}
          {role === 'ADMIN' && (
            <div className="pt-3 border-t border-[#E9ECEF] dark:border-[#242424] space-y-1">
              <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block px-2.5 mb-1 font-display">
                Control Center
              </span>
              <Link
                to="/admin"
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-purple-900/10 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                    : 'text-[#495057] dark:text-[#999999] hover:text-[#121417] dark:hover:text-[#FFFFFF] hover:bg-white dark:hover:bg-[#141414] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Admin Panel</span>
                </div>
                <span className="text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                  Admin
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom User Account Section */}
        <div className="p-3 border-t border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414]">
          {role === 'GUEST' ? (
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center justify-between p-2 rounded-md bg-[#FD4A32]/10 hover:bg-[#FD4A32]/20 border border-[#FD4A32]/25 text-[#FD4A32] transition-colors w-full font-bold text-xs"
            >
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="flex items-center justify-between p-2 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] w-full">
              <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                <div
                  className={`w-7 h-7 rounded-md text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                    role === 'ADMIN' ? 'bg-purple-600 dark:bg-purple-400' : 'bg-[#FD4A32]'
                  }`}
                >
                  {role === 'ADMIN' ? <KeyRound className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-[#121417] dark:text-[#FFFFFF] block truncate">
                    {user?.name || 'Workspace Account'}
                  </span>
                  <span className="text-[9px] font-medium text-[#868E96] dark:text-[#555555] block truncate">
                    {role === 'ADMIN' ? 'Administrator' : (user?.email || 'Active Account')}
                  </span>
                </div>
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1 text-[#868E96] dark:text-[#555555] hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
