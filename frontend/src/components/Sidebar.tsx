import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  BookOpen,
  Layers,
  Sparkles,
  Bookmark,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  ArrowRightLeft,
  Calculator,
  BarChart3,
  Brain,
  MessageSquare,
  Compass,
  KeyRound
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user, role, switchRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isAptitudeExpanded, setIsAptitudeExpanded] = useState(true);

  const navLinks = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Companies & Exams', href: '/companies', icon: Building2 },
    { name: 'Exam Papers', href: '/questions', icon: BookOpen },
    { name: 'Experiences', href: '/experiences', icon: Layers },
  ];

  const aptitudeCategories = [
    { name: 'Arithmetic Aptitude', slug: 'arithmetic-aptitude', icon: Calculator },
    { name: 'Data Interpretation', slug: 'data-interpretation', icon: BarChart3 },
    { name: 'Logical Reasoning', slug: 'logical-reasoning', icon: Brain },
    { name: 'Verbal Reasoning', slug: 'verbal-reasoning', icon: MessageSquare },
    { name: 'Nonverbal Reasoning', slug: 'nonverbal-reasoning', icon: Compass },
  ];

  return (
    <aside className="w-64 bg-[#f6ece6] dark:bg-[#1e1f22] border-r border-[#e2d8d2] dark:border-[#2b2d31] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40 transition-colors">
      {/* Top Header & Brand */}
      <div className="p-5 space-y-5 overflow-y-auto">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#000000] dark:bg-[#e3e3e3] text-white dark:text-[#141517] flex items-center justify-center font-black text-xl shadow-md shadow-black/10 dark:shadow-white/10 group-hover:scale-105 transition-transform">
            J
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-[#1f1b17] dark:text-[#e3e3e3] group-hover:text-[#006c49] dark:group-hover:text-[#6cf8bb] transition-colors">
              Jobs<span className="text-[#006c49] dark:text-[#6cf8bb]">folder</span>
            </span>
            <span className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider">
              {role === 'ADMIN' ? 'Admin Portal' : role === 'USER' ? 'Student Workspace' : 'Guest Mode'}
            </span>
          </div>
        </Link>

        {/* Clean Status Badge */}
        <div className="p-2.5 rounded-[14px] bg-[#ffffff] dark:bg-[#2b2d31] border border-[#e2d8d2] dark:border-[#383a40] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              role === 'ADMIN' ? 'bg-purple-600 animate-pulse' : role === 'USER' ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />
            <span className="font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider text-[11px]">
              {role === 'ADMIN' ? 'Admin Mode' : role === 'USER' ? 'Student Workspace' : 'Public Visitor'}
            </span>
          </div>
          {role === 'GUEST' && (
            <Link to="/login" className="text-[10px] font-extrabold text-[#006c49] dark:text-[#6cf8bb] hover:underline uppercase">
              Sign In
            </Link>
          )}
        </div>



        {/* Main Navigation Links */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider block px-3 mb-1">
            Menu
          </span>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#000000] dark:bg-[#e3e3e3] text-white dark:text-[#141517] shadow-sm ring-1 ring-white dark:ring-white ring-offset-1 ring-offset-[#f6ece6] dark:ring-offset-[#1e1f22]'
                    : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#ffffff]/70 dark:hover:bg-[#2b2d31]/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#6cf8bb] dark:text-[#006c49]' : 'text-[#747878] dark:text-[#a6adbb]'}`} />
                  <span>{link.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#6cf8bb] dark:text-[#006c49]" />}
              </Link>
            );
          })}
        </nav>

        {/* Horizontal Separation Line & Collapsible Aptitude Categories */}
        <div className="pt-3.5 pb-1 border-t border-[#d8cbc4] dark:border-[#383a40]">
          <button
            type="button"
            onClick={() => setIsAptitudeExpanded(!isAptitudeExpanded)}
            className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] transition-colors cursor-pointer group"
          >
            <span>Aptitude & Reasoning</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAptitudeExpanded ? 'rotate-180 text-[#1f1b17] dark:text-[#e3e3e3]' : 'text-[#747878] dark:text-[#a6adbb]'}`} />
          </button>

          {isAptitudeExpanded && (
            <div className="space-y-1 pt-2 animate-fadeIn">
              {aptitudeCategories.map((cat) => {
                const CatIcon = cat.icon;
                const isCatActive = location.pathname.startsWith(`/aptitude/${cat.slug}`);
                return (
                  <Link
                    key={cat.name}
                    to={`/aptitude/${cat.slug}`}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-[14px] text-xs font-bold transition-all ${
                      isCatActive
                        ? 'bg-[#000000] dark:bg-[#e3e3e3] text-white dark:text-[#141517] shadow-sm ring-1 ring-white dark:ring-white ring-offset-1 ring-offset-[#f6ece6] dark:ring-offset-[#1e1f22]'
                        : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#ffffff]/70 dark:hover:bg-[#2b2d31]/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CatIcon className={`w-4 h-4 shrink-0 ${isCatActive ? 'text-[#6cf8bb] dark:text-[#006c49]' : 'text-[#747878] dark:text-[#a6adbb]'}`} />
                      <span className="truncate">{cat.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Admin Section (Protected View) */}
        <div className="pt-3.5 border-t border-[#d8cbc4] dark:border-[#383a40] space-y-1">
          <span className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider block px-3 mb-1">
            Control
          </span>
          <Link
            to="/admin"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-xs font-bold transition-all ${
              location.pathname.startsWith('/admin')
                ? 'bg-[#006c49] dark:bg-[#6cf8bb] text-white dark:text-[#000000] shadow-sm'
                : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#ffffff]/70 dark:hover:bg-[#2b2d31]/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-4 h-4 ${role === 'ADMIN' ? 'text-purple-600 dark:text-purple-400' : 'text-[#006c49] dark:text-[#6cf8bb]'}`} />
              <span>Admin Panel</span>
            </div>
            {role === 'ADMIN' && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500 dark:bg-purple-900/50 text-white dark:text-purple-300">
                Admin
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Bottom User Account Section */}
      <div className="p-4 border-t border-[#e2d8d2] dark:border-[#2b2d31] bg-[#eae1da]/50 dark:bg-[#141517]/50">
        {role === 'GUEST' ? (
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-[14px] bg-[#000000] dark:bg-[#e3e3e3] hover:bg-[#006c49] dark:hover:bg-[#ffffff] text-white dark:text-[#141517] text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            <User className="w-4 h-4 text-[#6cf8bb] dark:text-[#006c49]" />
            <span>Sign In / Register</span>
          </Link>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-[14px] bg-[#ffffff] dark:bg-[#1e1f22] border border-[#e2d8d2] dark:border-[#383a40]">
            <Link to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity">
              <div className={`w-8 h-8 rounded-full text-white dark:text-[#000000] flex items-center justify-center font-bold text-xs shrink-0 ${
                role === 'ADMIN' ? 'bg-purple-700 dark:bg-purple-400' : 'bg-[#006c49] dark:bg-[#6cf8bb]'
              }`}>
                {role === 'ADMIN' ? <KeyRound className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-[#1f1b17] dark:text-[#e3e3e3] block truncate">{user?.name}</span>
                <span className={`text-[10px] font-semibold block truncate ${
                  role === 'ADMIN' ? 'text-purple-700 dark:text-purple-400' : 'text-[#00714d] dark:text-[#6cf8bb]'
                }`}>
                  {role === 'ADMIN' ? 'Administrator' : 'Student Profile'}
                </span>
              </div>
            </Link>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31] rounded-full transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
