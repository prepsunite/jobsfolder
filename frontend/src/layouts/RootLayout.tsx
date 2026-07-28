import { Outlet, Link } from 'react-router';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Plus, ArrowRightLeft } from 'lucide-react';

export default function RootLayout() {
  const { role, switchRole } = useAuth();
  const isAdmin = role === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#fff8f5] dark:bg-[#141517] text-[#1f1b17] dark:text-[#e3e3e3] flex font-sans selection:bg-[#6cf8bb] selection:text-[#005236] transition-colors">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Floating Device Admin Status Banner when Admin is Logged In */}
        {isAdmin && (
          <div className="bg-purple-900 text-white py-2 px-6 border-b border-purple-800 text-xs font-semibold flex items-center justify-between gap-4 shadow-md sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-300 animate-pulse" />
              <span className="font-bold uppercase tracking-wider">
                Device Admin Mode Active: Direct Inline Web Editing Enabled Across Entire Website
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/companies" className="hover:text-purple-200 underline font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Companies Directory
              </Link>
              <Link to="/questions" className="hover:text-purple-200 underline font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> OA Bank
              </Link>
              <button
                onClick={() => switchRole('USER')}
                className="px-2.5 py-0.5 bg-purple-800 hover:bg-purple-700 rounded-full text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 border border-purple-600"
              >
                <ArrowRightLeft className="w-3 h-3" /> View as Student
              </button>
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
