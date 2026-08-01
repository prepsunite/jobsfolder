import { Outlet, Link } from 'react-router';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Plus, ArrowRightLeft } from 'lucide-react';

export default function RootLayout() {
  const { user, role } = useAuth();
  const isAdmin = role === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#141517] text-[#1f1b17] dark:text-[#e3e3e3] flex font-sans selection:bg-[#6cf8bb] selection:text-[#005236] transition-colors">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Top Workspace Header */}
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
