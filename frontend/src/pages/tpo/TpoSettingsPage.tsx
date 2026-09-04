import React from 'react';
import { useOutletContext } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import type { TpoOutletContext } from '@/layouts/TpoLayout';
import {
  Building2,
  ShieldCheck,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Key,
  Users,
  Mail,
} from 'lucide-react';

export default function TpoSettingsPage() {
  const { currentCollege, stats } = useOutletContext<TpoOutletContext>();
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          College Profile & CRT Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Institutional subscription details and placement coordinator configuration
        </p>
      </div>

      {/* College Info Card */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FD4A32] to-[#FF7A00] text-white flex items-center justify-center font-black text-2xl shadow-md">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{currentCollege.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400">
                {currentCollege.code}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Location: {currentCollege.city || 'Pan-India'} • Tenant ID: <span className="font-mono">{currentCollege.id || 'Active'}</span>
            </p>
          </div>
        </div>

        {/* License & Contract Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Licenses Enrolled</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats?.totalStudents || 0} / {stats?.maxLicenses || 1000}
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold">Active CRT Accounts</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Contract Status</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {currentCollege.contract_status || 'ACTIVE'}
            </div>
            <p className="text-[10px] text-slate-400">Institutional Partner</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Package Validity</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {currentCollege.valid_until
                ? new Date(currentCollege.valid_until).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Annual Pass'}
            </div>
            <p className="text-[10px] text-slate-400">Institutional Access Window</p>
          </div>
        </div>

        {/* Authorized Coordinator */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Authorized Placement Coordinator
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">{user?.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{user?.email}</div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Verified TPO Admin
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
