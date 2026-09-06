import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tpoService } from '@/services/tpo.service';
import type { TpoOutletContext } from '@/layouts/TpoLayout';
import {
  Users,
  Search,
  Upload,
  Download,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { CollegeStudent } from '@/types/tpo';
import BulkStudentImportModal from '@/components/tpo/BulkStudentImportModal';
import AddStudentModal from '@/components/tpo/AddStudentModal';
import ManageBatchesModal from '@/components/tpo/ManageBatchesModal';

export default function TpoStudentsPage() {
  const { collegeId, currentCollege } = useOutletContext<TpoOutletContext>();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [batchYearFilter, setBatchYearFilter] = useState<number | undefined>(undefined);
  const currentYear = new Date().getFullYear();
  const batchYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isManageBatchesModalOpen, setIsManageBatchesModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Fetch Available Batches
  const { data: batches = [] } = useQuery({
    queryKey: ['tpo-batches', collegeId],
    queryFn: () => tpoService.getCollegeBatches(collegeId),
    enabled: !!collegeId,
  });

  // Fetch All Students (unfiltered) to compute headcount badges per cohort batch
  const { data: allStudents = [] } = useQuery<CollegeStudent[]>({
    queryKey: ['tpo-all-students-counts', collegeId],
    queryFn: () => tpoService.getCollegeStudents(collegeId),
    enabled: !!collegeId,
  });

  const batchCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allStudents.forEach(s => {
      const name = (s.batch_name || 'Normal Batch').trim().toLowerCase();
      counts[name] = (counts[name] || 0) + 1;
    });
    return counts;
  }, [allStudents]);

  // Fetch Students
  const {
    data: students = [],
    isLoading,
    refetch,
  } = useQuery<CollegeStudent[]>({
    queryKey: ['tpo-students', collegeId, searchTerm, deptFilter, batchFilter, batchYearFilter],
    queryFn: () =>
      tpoService.getCollegeStudents(collegeId, {
        search: searchTerm,
        department: deptFilter,
        batchName: batchFilter,
        batchYear: batchYearFilter,
      }),
    enabled: !!collegeId,
  });

  // Export full CSV roster
  const handleExportRoster = () => {
    if (students.length === 0) return;

    const headers = 'Roll Number,Name,Email,Department,Passout Year,Cohort Batch,Status\n';
    const rows = students
      .map(
        s =>
          `"${s.roll_number || ''}","${s.name}","${s.email}","${s.department || 'GENERAL'}",${s.batch_year || 2026},"${s.batch_name || 'Normal Batch'}",Active`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCollege.code}_Student_Roster_${batchFilter}_${deptFilter}_${batchYearFilter || 'All'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Remove Single Student
  const handleRemoveStudent = async (studentEmail: string, studentName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${studentName} (${studentEmail}) from ${currentCollege.name}?\n\nThis will revoke their Campus Pro Pass access and free up 1 student license seat.`
    );
    if (!confirmDelete) return;

    try {
      await tpoService.removeStudent(collegeId, studentEmail);
      setActionSuccessMsg(`Removed ${studentName} from campus roster and freed up 1 license seat.`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
      queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
      queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
      refetch();
    } catch (err: any) {
      alert(`Failed to remove student: ${err.message}`);
    }
  };

  // Reassign single student's cohort batch directly from table
  const handleReassignBatch = async (studentEmail: string, studentName: string, newBatchName: string) => {
    try {
      await tpoService.updateStudentBatch(collegeId, studentEmail, newBatchName);
      setActionSuccessMsg(`Assigned ${studentName} to cohort "${newBatchName}".`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
      queryClient.invalidateQueries({ queryKey: ['tpo-students', collegeId] });
      queryClient.invalidateQueries({ queryKey: ['tpo-all-students-counts', collegeId] });
      refetch();
    } catch (err: any) {
      alert(`Could not update cohort batch: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Student &amp; Batch Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage student batch rosters, cohort groups, and Pro Pass credentials for {currentCollege.name}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportRoster}
            disabled={students.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Roster
          </button>

          <button
            onClick={() => setIsManageBatchesModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Manage Batches ({batches.length})
          </button>

          <button
            onClick={() => setIsAddStudentModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] hover:border-[#FD4A32] text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FD4A32]" />
            Add Student
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FD4A32]/20 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Bulk Import (CSV)
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* License Capacity & Expiry Progress Card */}
      {(() => {
        const maxLicenses = currentCollege.max_licenses || 1500;
        const enrolledCount = students.length;
        const freeSeats = Math.max(0, maxLicenses - enrolledCount);
        const percentUsed = Math.min(100, Math.round((enrolledCount / maxLicenses) * 100));
        const validUntilDate = currentCollege.valid_until ? new Date(currentCollege.valid_until) : null;
        const daysLeft = validUntilDate
          ? Math.ceil((validUntilDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : 0;

        return (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FD4A32] flex items-center justify-center font-bold shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Institutional Seat Capacity
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      freeSeats === 0
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    }`}
                  >
                    {freeSeats === 0 ? 'Capacity Full' : `${freeSeats} Seats Remaining`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {enrolledCount} of {maxLicenses} allocated student licenses enrolled • Each student is automatically provisioned with Campus Pro Pass.
                </p>
              </div>
            </div>

            <div className="w-full md:w-72 space-y-1.5 shrink-0">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>{daysLeft > 0 ? `${daysLeft} days remaining` : 'Access Expired'}</span>
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{percentUsed}% utilized</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    percentUsed >= 100 ? 'bg-rose-500' : percentUsed >= 85 ? 'bg-amber-500' : 'bg-[#FD4A32]'
                  }`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick Cohort Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Cohort Batches:
        </span>
        <button
          onClick={() => setBatchFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            batchFilter === 'ALL'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          All Students ({allStudents.length})
        </button>

        {batches.map(b => {
          const count = batchCounts[b.name.trim().toLowerCase()] || 0;
          const isSelected = batchFilter === b.name;
          return (
            <button
              key={b.id}
              onClick={() => setBatchFilter(isSelected ? 'ALL' : b.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-xs shadow-purple-600/25'
                  : 'bg-white dark:bg-[#111827] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/20'
              }`}
            >
              <span>{b.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => setIsManageBatchesModalOpen(true)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 border border-dashed border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 shrink-0 inline-flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> New Batch
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Roll No, Name, or Email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
          />
        </div>

        {/* Filters: Cohort Batch, Department & Batch Year */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Cohort Batch Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Layers className="w-3.5 h-3.5 text-[#FD4A32]" />
            <select
              value={batchFilter}
              onChange={e => setBatchFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Batches (Cohorts)</option>
              {batches.map(b => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Select */}
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          {/* Graduation Passout Year */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setBatchYearFilter(undefined)}
              className={`px-3 py-1 rounded-lg transition-all ${
                batchYearFilter === undefined
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All Years
            </button>
            {batchYears.map(yr => (
              <button
                key={yr}
                onClick={() => setBatchYearFilter(yr)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  batchYearFilter === yr
                    ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Student Master Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-[#111827] text-xs shadow-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-[#151d2e] text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Roll Number</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Department</th>
              <th className="p-4">Cohort Batch</th>
              <th className="p-4">Passout Batch</th>
              <th className="p-4">Pro Entitlement Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-slate-400">
                  Loading student records...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">No Students Found</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Add Student" to enroll individuals or use "Bulk Import (CSV)" to upload your batch roster.
                  </p>
                </td>
              </tr>
            ) : (
              students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                    {s.roll_number || '—'}
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {s.name}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {s.email}
                  </td>
                  <td className="p-4 uppercase font-black text-[#FD4A32]">
                    {s.department || 'GENERAL'}
                  </td>
                  <td className="p-4">
                    <select
                      value={s.batch_name || 'Normal Batch'}
                      onChange={e => handleReassignBatch(s.email, s.name, e.target.value)}
                      title="Click to switch candidate's cohort batch"
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border shadow-2xs focus:outline-none cursor-pointer transition-colors ${
                        (s.batch_name || '').toLowerCase().includes('top')
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:border-purple-500'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                      {!batches.some(b => b.name === (s.batch_name || 'Normal Batch')) && (
                        <option value={s.batch_name || 'Normal Batch'}>
                          {s.batch_name || 'Normal Batch'}
                        </option>
                      )}
                    </select>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold">
                    {s.batch_year || 2026}
                  </td>
                  <td className="p-4">
                    {tpoService.isStudentEntitled(s.email) ? (
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Pro Access Active
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          All OA papers &amp; mocks unlocked
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-2xs">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Provisioning / Inactive
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Syncing campus pass
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRemoveStudent(s.email, s.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      title="Remove student & revoke license"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Add Single Student */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        collegeId={collegeId}
        collegeName={currentCollege.name}
        onSuccess={(name) => {
          setActionSuccessMsg(
            `Successfully enrolled ${name}! Campus Pro Pass has been activated with 100% unlocked access to all papers, company blueprints, and tests.`
          );
          setTimeout(() => setActionSuccessMsg(null), 6000);
          queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
          refetch();
        }}
      />

      {/* MODAL 2: Bulk Import Modal */}
      <BulkStudentImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        collegeId={collegeId}
        collegeName={currentCollege.name}
        onSuccess={() => {
          setIsImportModalOpen(false);
          setActionSuccessMsg('Batch roster imported! All uploaded students have been provisioned with Campus Pro Pass.');
          setTimeout(() => setActionSuccessMsg(null), 6000);
          queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
          refetch();
        }}
      />

      {/* MODAL 3: Manage Batches & Cohorts Modal */}
      <ManageBatchesModal
        isOpen={isManageBatchesModalOpen}
        onClose={() => setIsManageBatchesModalOpen(false)}
        collegeId={collegeId}
        collegeName={currentCollege.name}
        onSelectBatchFilter={(bName) => setBatchFilter(bName)}
      />
    </div>
  );
}
