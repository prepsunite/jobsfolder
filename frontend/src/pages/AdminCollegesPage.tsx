import { Link } from 'react-router';
import {
  Building2,
  ShieldCheck,
  BookOpen,
  ChevronRight,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import CollegesTpoManager from '@/components/admin/CollegesTpoManager';

export default function AdminCollegesPage() {
  const { user } = useAuth();

  if (!isSuperAdminEmail(user?.email)) {
    return <NotFoundPage />;
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Top Breadcrumbs & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1.5">
          {/* Breadcrumb path */}
          <div className="flex items-center gap-2 text-xs text-[#747878] dark:text-[#a6adbb]">
            <Link
              to="/admin"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-semibold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Admin Console</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[#1f1b17] dark:text-[#e3e3e3] font-bold">Colleges &amp; TPO Admins</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-[#FD4A32] inline-flex shadow-xs border border-orange-500/20">
              <Building2 className="w-6 h-6" />
            </span>
            <span>Institutional Colleges &amp; TPO Admins</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#747878] dark:text-[#a6adbb] max-w-3xl leading-relaxed">
            Enterprise campus administration. Manage partner colleges, enforce student seat capacities, extend contract licenses, and assign authorized placement coordinators with zero clutter.
          </p>
        </div>

        {/* Quick Hub Navigation Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            to="/admin"
            className="px-3.5 py-2 bg-[#F8F9FA] dark:bg-[#2b2d31] hover:bg-[#E9ECEF] dark:hover:bg-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] rounded-full text-xs font-bold transition-all border border-[#E9ECEF] dark:border-[#383a40] flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            <span>Admin Console</span>
          </Link>

          <Link
            to="/admin/bulk-import"
            className="px-3.5 py-2 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold transition-all border border-purple-500/30 flex items-center gap-1.5 shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bulk Importer</span>
          </Link>
        </div>
      </div>

      {/* Spacious Dedicated Colleges & TPOs Workspace */}
      <div className="pt-2">
        <CollegesTpoManager />
      </div>
    </div>
  );
}
