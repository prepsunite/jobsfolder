import React, { useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { tpoService } from '@/services/tpo.service';
import {
  ArrowLeft,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Share2,
  ShieldAlert,
} from 'lucide-react';
import type { MockExam, StudentExamAttempt } from '@/types/tpo';
import { useAuth } from '@/contexts/AuthContext';
import type { TpoOutletContext } from '@/layouts/TpoLayout';

export default function TpoExamDetailPage() {
  const { examId } = useParams<{ examId: string }>();
  const { collegeId, currentCollege } = useOutletContext<TpoOutletContext>();
  const { isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Fetch Exam Metadata
  const { data: exam, isLoading: examLoading } = useQuery<MockExam | null>({
    queryKey: ['tpo-exam-detail', examId],
    queryFn: () => (examId ? tpoService.getMockExamById(examId) : null),
    enabled: !!examId,
  });

  // Fetch Attempts / Results
  const { data: attempts = [], isLoading: attemptsLoading } = useQuery<StudentExamAttempt[]>({
    queryKey: ['tpo-exam-attempts', examId],
    queryFn: () => (examId ? tpoService.getExamAttempts(examId) : []),
    enabled: !!examId,
  });

  // Filter attempts
  const filteredAttempts = attempts.filter(att => {
    const student = att.student || { name: '', email: '', roll_number: '', department: '' };
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.roll_number && student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = deptFilter === 'ALL' || student.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const totalSubmitted = attempts.length;
  const passedCount = attempts.filter(a => a.passed).length;
  const passRate = totalSubmitted > 0 ? Math.round((passedCount / totalSubmitted) * 100) : 0;
  const avgScore =
    totalSubmitted > 0
      ? Math.round(attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / totalSubmitted)
      : 0;

  // Export to CSV
  const handleExportCSV = () => {
    if (!exam || attempts.length === 0) return;

    const headers =
      'Rank,Roll Number,Student Name,Email,Department,Score,Max Score,Percentage,Result,Tab Switches,Status\n';
    const rows = attempts
      .map((a, idx) => {
        const s = a.student || { name: 'Student', email: '', roll_number: '', department: 'CSE' };
        return `${idx + 1},"${s.roll_number || ''}","${s.name}","${s.email}","${s.department || ''}",${a.total_score},${a.max_possible_score},${a.percentage}%,${a.passed ? 'PASSED' : 'FAILED'},${a.tab_switch_count},${a.status}`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exam.title.toLowerCase().replace(/\s+/g, '_')}_placement_leaderboard.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyExamLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/exam/${examId}`;
    navigator.clipboard.writeText(url);
    alert(`Candidate link copied:\n${url}`);
  };

  if (examLoading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading assessment details...</div>;
  }

  if (!exam) {
    return (
      <div className="p-8 text-center space-y-3">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">Exam Not Found</h3>
        <Link to="/tpo/exams" className="text-xs text-[#FD4A32] font-bold">
          ← Back to Mock Exams
        </Link>
      </div>
    );
  }

  // 🛡️ Cross-Tenant Isolation: A non-admin TPO cannot inspect another college's assessment or students
  if (!isAdmin && exam.college_id && collegeId && exam.college_id !== collegeId) {
    return (
      <div className="p-8 text-center space-y-4 bg-white dark:bg-[#111827] rounded-3xl border border-rose-200 dark:border-rose-900/40">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display font-extrabold text-lg text-rose-600 dark:text-rose-400">
            Institutional Access Restricted
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            This examination was created by and belongs to another campus institution. Your coordinator account only has permission to view assessments and candidates belonging to {currentCollege.name}.
          </p>
        </div>
        <Link
          to="/tpo/exams"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          ← Return to Your Mock Exams
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/tpo/exams"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Mock Exams
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FD4A32]/10 text-[#FD4A32]">
              {exam.target_company}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {exam.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyExamLink}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Share2 className="w-4 h-4 text-[#FD4A32]" />
            Copy Test Link
          </button>
          <button
            onClick={handleExportCSV}
            disabled={attempts.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FD4A32]/20"
          >
            <Download className="w-4 h-4" />
            Export CSV Leaderboard
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Candidates Appeared</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalSubmitted}</div>
        </div>
        <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Clearance Rate</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{passRate}%</div>
        </div>
        <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Batch Average</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{avgScore}%</div>
        </div>
        <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Cutoff Requirement</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{exam.passing_percentage}%</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate by Roll No, Name, Email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
          />
        </div>

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
        </select>
      </div>

      {/* Candidate Leaderboard Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-[#111827] text-xs shadow-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-[#151d2e] text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Roll Number</th>
              <th className="p-4">Candidate Name</th>
              <th className="p-4">Branch</th>
              <th className="p-4">Score</th>
              <th className="p-4">Percentage</th>
              <th className="p-4">Tab Violations</th>
              <th className="p-4">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {attemptsLoading ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-slate-400">
                  Loading candidate attempts...
                </td>
              </tr>
            ) : filteredAttempts.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-slate-400">
                  No candidate submissions recorded for this test drive yet.
                </td>
              </tr>
            ) : (
              filteredAttempts.map((att) => {
                const globalRank = attempts.findIndex(a => a.id === att.id) + 1;
                const s = att.student || { name: 'Student', email: '', roll_number: '—', department: 'CSE' };
                return (
                  <tr key={att.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-black text-slate-400">#{globalRank}</td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      {s.roll_number || '—'}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.email}</div>
                    </td>
                    <td className="p-4 uppercase font-bold text-[#FD4A32]">
                      {s.department || 'CSE'}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {att.total_score} / {att.max_possible_score}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-black ${
                          att.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="p-4">
                      {att.tab_switch_count > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                          <AlertTriangle className="w-3 h-3" />
                          {att.tab_switch_count} switches
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="p-4">
                      {att.status === 'TERMINATED_MALPRACTICE' ? (
                        <span className="text-rose-600 font-bold">Malpractice Terminated</span>
                      ) : att.passed ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                        </span>
                      ) : (
                        <span className="text-rose-500 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Below Cutoff
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
