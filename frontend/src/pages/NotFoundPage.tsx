import { Link } from 'react-router';
import { Compass, Home, Building2, BookOpen } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#F8F9FA] dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] shadow-sm space-y-6">
        <div className="w-14 h-14 rounded-xl bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-7 h-7 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-display font-black uppercase tracking-widest text-[#FD4A32]">
            Error 404
          </span>
          <h1 className="font-display text-3xl font-extrabold text-[#121417] dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-[#868E96] dark:text-[#888888] font-sans leading-relaxed">
            The page or placement archive you are looking for might have been moved, renamed, or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#121417] dark:bg-white text-white dark:text-[#121417] text-xs font-display font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/companies"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] text-[#121417] dark:text-white text-xs font-display font-bold uppercase tracking-wider hover:border-[#FD4A32] transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-[#FD4A32]" />
            <span>Companies</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-[#E9ECEF] dark:border-[#242424] flex items-center justify-center gap-4 text-[11px] text-[#868E96] dark:text-[#666666]">
          <Link to="/questions" className="hover:text-[#FD4A32] transition-colors flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> OA Papers
          </Link>
          <span>•</span>
          <Link to="/pricing" className="hover:text-[#FD4A32] transition-colors">
            Pricing
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-[#FD4A32] transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
