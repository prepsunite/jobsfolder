import React from 'react';
import { useOutletContext, Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import type { TpoOutletContext } from '@/layouts/TpoLayout';
import { Building2, ShieldCheck, Mail, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tpoService } from '@/services/tpo.service';

export default function TpoSettingsPage() {
  const { currentCollege, stats } = useOutletContext<TpoOutletContext>();
  const { user, isAdmin } = useAuth();

  // Query the actual authorized TPO coordinator for THIS college
  const { data: coordinator, isLoading: coordinatorLoading } = useQuery({
    queryKey: ['tpo-coordinator', currentCollege.id, currentCollege.code],
    queryFn: () => tpoService.getTpoCoordinatorForCollege(currentCollege.id, currentCollege.code),
    enabled: !!currentCollege.id,
  });

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
              {stats?.totalStudents || 0} / {currentCollege.max_licenses || stats?.maxLicenses || 1500}
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

        {/* Authorized Coordinator Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Authorized Placement Coordinator</span>
            </h3>
            {isAdmin && (
              <Link
                to="/admin/colleges"
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Manage in Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {coordinator ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                  {coordinator.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {coordinator.name || 'Placement Officer'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span>{coordinator.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Verified TPO Coordinator
                </span>
              </div>
            </div>
          ) : coordinatorLoading ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-400">
              Loading coordinator details...
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/20">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-amber-900 dark:text-amber-200">
                    No Placement Coordinator Assigned
                  </div>
                  <div className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                    No institutional email has been assigned to coordinate this campus.
                  </div>
                </div>
              </div>
              {isAdmin && (
                <Link
                  to="/admin/colleges"
                  className="px-3.5 py-1.5 bg-[#FD4A32] hover:bg-[#e03a24] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                >
                  <span>Assign Coordinator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}

          {/* Super Admin Supervision Notice */}
          {isAdmin && (
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-purple-900 dark:text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>
                  You are previewing this institutional portal in <strong>Platform Super Admin Supervision Mode</strong> as <code className="font-mono text-[11px] bg-purple-100 dark:bg-purple-900/40 px-1 py-0.5 rounded">{user?.email}</code>.
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
