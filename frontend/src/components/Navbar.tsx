import { Link, useLocation } from 'react-router';
import { Building2, BookOpen, Layers, Bookmark, ShieldCheck, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'OA Questions', href: '/questions', icon: BookOpen },
    { name: 'Experiences', href: '/experiences', icon: Layers },
    { name: 'Roadmaps', href: '/roadmaps', icon: Sparkles },
    { name: 'Resources', href: '/resources', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fff8f5]/80 dark:bg-[#141517]/80 backdrop-blur-xl border-b border-[#eae1da] dark:border-[#2b2d31] text-[#1f1b17] dark:text-[#e3e3e3] transition-colors">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#000000] dark:bg-[#e3e3e3] text-white dark:text-[#141517] flex items-center justify-center font-black text-xl shadow-md shadow-black/10 dark:shadow-white/10 group-hover:scale-105 transition-transform">
              J
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#1f1b17] dark:text-[#e3e3e3] group-hover:text-[#006c49] dark:group-hover:text-[#6cf8bb] transition-colors">
              Jobs<span className="text-[#006c49] dark:text-[#6cf8bb]">folder</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#f6ece6]/90 dark:bg-[#1e1f22]/90 p-1.5 rounded-full border border-[#e2d8d2] dark:border-[#2b2d31] transition-colors">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#000000] dark:bg-[#e3e3e3] text-white dark:text-[#141517] shadow-md ring-1 ring-white dark:ring-white ring-offset-1 ring-offset-[#f6ece6] dark:ring-offset-[#141517]'
                      : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#ffffff]/60 dark:hover:bg-[#2b2d31]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#6cf8bb] dark:text-[#006c49]' : 'text-[#747878] dark:text-[#a6adbb]'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31] rounded-full transition-colors"
              title="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#f6ece6] dark:bg-[#1e1f22] text-[#1f1b17] dark:text-[#e3e3e3] hover:bg-[#eae1da] dark:hover:bg-[#2b2d31] border border-[#e2d8d2] dark:border-[#383a40] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#006c49] dark:text-[#6cf8bb]" />
              Admin Panel
            </Link>
            {isAuthenticated && user ? (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f6ece6] dark:bg-[#1e1f22] border border-[#e2d8d2] dark:border-[#383a40] hover:border-[#006c49] transition-all"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#006c49] text-white flex items-center justify-center text-[10px] font-black">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] max-w-[90px] truncate">{user.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white dark:text-[#141517] bg-[#000000] dark:bg-[#e3e3e3] hover:bg-[#1c1b1b] dark:hover:bg-white rounded-full shadow-lg shadow-black/10 dark:shadow-white/10 transition-all hover:scale-105 flex items-center gap-1.5"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
