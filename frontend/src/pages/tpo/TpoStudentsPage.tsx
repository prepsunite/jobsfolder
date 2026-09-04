import React, { useState } from 'react';
import { useOutletContext } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { tpoService } from '@/services/tpo.service';
import {
  Users,
  Search,
  Upload,
  Download,
  CheckCircle2,
  Filter,
  GraduationCap,
  Mail,
  FileSpreadsheet,
  Plus,
  Trash2,
  ShieldCheck,
  Zap,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import type { CollegeStudent } from '@/types/tpo';
import BulkStudentImportModal from '@/components/tpo/BulkStudentImportModal';

export default function TpoStudentsPage() {
  const { collegeId, currentCollege } = useOutletContext<{
    collegeId: string;
    currentCollege: any;
  }>();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [batchYearFilter, setBatchYearFilter] = useState<number | undefined>(undefined);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Single Student Addition State
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('CSE');
  const [newStudentBatch, setNewStudentBatch] = useState<number>(2026);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [addStudentError, setAddStudentError] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Fetch Students
  const {
    data: students = [],
    isLoading,
    refetch,
  } = useQuery<CollegeStudent[]>({
    queryKey: ['tpo-students', collegeId, searchTerm, deptFilter, batchYearFilter],
    queryFn: () =>
      tpoService.getCollegeStudents(collegeId, {
        search: searchTerm,
        department: deptFilter,
        batchYear: batchYearFilter,
      }),
    enabled: !!collegeId,
  });

  // Export full CSV roster
  const handleExportRoster = () => {
    if (students.length === 0) return;

    const headers = 'Roll Number,Name,Email,Department,Batch Year,Status\n';
    const rows = students
      .map(
        s =>
          `"${s.roll_number || ''}","${s.name}","${s.email}","${s.department || 'GENERAL'}",${s.batch_year || 2026},Active`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCollege.code}_Student_Roster_${deptFilter}_${batchYearFilter || 'All'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Single Student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentEmail.trim() || !newStudentName.trim()) {
      setAddStudentError('Student Name and Email are required.');
      return;
    }

    setIsAddingStudent(true);
    setAddStudentError(null);
    try {
      const res = await tpoService.addSingleStudent(collegeId, {
        name: newStudentName.trim(),
        email: newStudentEmail.trim(),
        roll_number: newStudentRoll.trim() || undefined,
        department: newStudentDept,
        batch_year: newStudentBatch,
      });

      if (!res.success) {
        setAddStudentError(res.error || 'Failed to enroll student.');
        return;
      }

      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentRoll('');
      setIsAddStudentModalOpen(false);
      setActionSuccessMsg(
        `Successfully enrolled ${newStudentName}! Campus Pro Pass has been activated with 100% unlocked access to all papers, blueprints, and tests.`
      );
      setTimeout(() => setActionSuccessMsg(null), 6000);
      refetch();
    } catch (err: any) {
      setAddStudentError(err.message || 'An error occurred.');
    } finally {
      setIsAddingStudent(false);
    }
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
      refetch();
    } catch (err: any) {
      alert(`Failed to remove student: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Student & Batch Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage student batch rosters, branch affiliations, and Pro Pass credentials for {currentCollege.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportRoster}
            disabled={students.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export Roster
          </button>

          <button
            onClick={() => {
              setAddStudentError(null);
              setIsAddStudentModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] hover:border-[#FD4A32] text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#FD4A32]" />
            Add Student
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FD4A32]/20"
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

        {/* Filters: Department & Batch Year */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Batch Year */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setBatchYearFilter(undefined)}
              className={`px-3 py-1 rounded-lg transition-all ${
                batchYearFilter === undefined
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All Batches
            </button>
            <button
              onClick={() => setBatchYearFilter(2026)}
              className={`px-3 py-1 rounded-lg transition-all ${
                batchYearFilter === 2026
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              2026
            </button>
            <button
              onClick={() => setBatchYearFilter(2027)}
              className={`px-3 py-1 rounded-lg transition-all ${
                batchYearFilter === 2027
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              2027
            </button>
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
              <th className="p-4">Passout Batch</th>
              <th className="p-4">Pro Entitlement Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400">
                  Loading student records...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center space-y-2">
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
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold">
                    {s.batch_year || 2026}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Pro Access Active
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      All OA papers & mocks unlocked
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRemoveStudent(s.email, s.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
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
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#FD4A32]" /> Enroll Student
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Activate full Pro Pass access for a {currentCollege.name} student
                </p>
              </div>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {addStudentError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addStudentError}</span>
              </div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={e => setNewStudentEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When this student signs into PrepUnite, they will automatically have 100% unlocked access without any paywall.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={newStudentRoll}
                    onChange={e => setNewStudentRoll(e.target.value)}
                    placeholder="e.g. 22B91A0501"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department *
                  </label>
                  <select
                    value={newStudentDept}
                    onChange={e => setNewStudentDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="AI/ML">AI / ML</option>
                    <option value="DATA SCIENCE">Data Science</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Passout Graduation Batch *
                </label>
                <select
                  value={newStudentBatch}
                  onChange={e => setNewStudentBatch(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-semibold"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingStudent}
                  className="flex-1 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                >
                  {isAddingStudent ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    'Enroll & Activate Pro'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          refetch();
        }}
      />
    </div>
  );
}
