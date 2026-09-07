import React, { useState, useMemo } from 'react';
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
  Eye,
  X,
  Clock,
  Award,
  AlertCircle,
} from 'lucide-react';
import type { MockExam, StudentExamAttempt, CollegeStudent } from '@/types/tpo';
import { useAuth } from '@/contexts/AuthContext';
import type { TpoOutletContext } from '@/layouts/TpoLayout';

export default function TpoExamDetailPage() {
  const { examId } = useParams<{ examId: string }>();
  const { collegeId, currentCollege } = useOutletContext<TpoOutletContext>();
  const { isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedAttempt, setSelectedAttempt] = useState<StudentExamAttempt | null>(null);

  // Fetch Exam Metadata
  const { data: exam, isLoading: examLoading } = useQuery<MockExam | null>({
    queryKey: ['tpo-exam-detail', examId],
    queryFn: () => (examId ? tpoService.getMockExamById(examId) : null),
    enabled: !!examId,
  });

  // Fetch Attempts / Results
  const { data: attempts = [], isLoading: attemptsLoading } = useQuery<StudentExamAttempt[]>({
    queryKey: ['tpo-exam-attempts', examId, collegeId],
    queryFn: () => (examId ? tpoService.getExamAttempts(examId, collegeId) : []),
    enabled: !!examId,
  });

  // Fetch College Students for live roster correlation & roll number guarantee
  const { data: collegeStudents = [] } = useQuery<CollegeStudent[]>({
    queryKey: ['tpo-students', collegeId],
    queryFn: () => (collegeId ? tpoService.getCollegeStudents(collegeId) : []),
    enabled: !!collegeId,
  });

  // Fast candidate lookup by email / user_id
  const studentLookup = useMemo(() => {
    const map = new Map<string, CollegeStudent>();
    collegeStudents.forEach(s => {
      if (s.email) map.set(s.email.toLowerCase(), s);
      if (s.id) map.set(s.id.toLowerCase(), s);
      if (s.user_id) map.set(s.user_id.toLowerCase(), s);
    });
    return map;
  }, [collegeStudents]);

  // Robust candidate profile resolver
  const resolveStudent = (att: StudentExamAttempt) => {
    const s = att.student || { name: 'Student', email: '', roll_number: '—', department: 'CSE' };
    const email = (s.email || att.student_email || (att.student_id?.includes('@') ? att.student_id : '')).toLowerCase();
    const sid = (att.student_id || '').toLowerCase();
    const matched = studentLookup.get(email) || studentLookup.get(sid);

    const roll_number =
      s.roll_number && s.roll_number !== '—'
        ? s.roll_number
        : (matched?.roll_number || '—');
    const name =
      s.name && s.name !== 'Student' && s.name !== 'Candidate'
        ? s.name
        : (matched?.name || s.name || 'Candidate');
    const department =
      s.department && s.department !== 'CSE' && s.department !== 'General'
        ? s.department
        : (matched?.department || s.department || 'CSE');

    return {
      name,
      email: email || s.email,
      roll_number,
      department,
    };
  };

  // Filter attempts
  const filteredAttempts = attempts.filter(att => {
    const student = resolveStudent(att);
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.roll_number && student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = deptFilter === 'ALL' || student.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const totalSubmitted = attempts.length;
  const uniqueCandidatesCount = useMemo(() => {
    const set = new Set<string>();
    attempts.forEach(a => {
      const k = (a.student_email || a.student?.email || a.student_id || '').trim().toLowerCase();
      if (k) set.add(k);
    });
    return set.size;
  }, [attempts]);

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
      'Rank,Roll Number,Student Name,Email,Department,Score,Max Score,Percentage,Result,Placement Tier,Attempted Questions,Total Questions,Accuracy,Tab Switches,Status\n';
    const rows = attempts
      .map((a, idx) => {
        const s = resolveStudent(a);
        const pct = a.percentage || 0;
        const res = a.result_summary;
        const tier = a.status === 'TERMINATED_MALPRACTICE' ? 'Malpractice / Disqualified' : (res?.tier_label || (pct >= 70 ? 'Tier 1: Day-1 Ready' : pct >= 50 ? 'Tier 2: Near Ready' : 'Tier 3: Remedial Needed'));
        const qualification = a.passed ? 'QUALIFIED' : 'NOT QUALIFIED';
        const attempted = res?.total_attempted ?? '—';
        const totalQ = res?.total_questions ?? '—';
        const acc = res?.overall_accuracy !== undefined ? `${res.overall_accuracy}%` : `${pct}%`;
        return `${idx + 1},"${s.roll_number || ''}","${s.name}","${s.email}","${s.department || ''}",${a.total_score},${a.max_possible_score},${pct}%,${qualification},"${tier}",${attempted},${totalQ},${acc},${a.tab_switch_count},${a.status}`;
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
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {uniqueCandidatesCount}
            {totalSubmitted > uniqueCandidatesCount && (
              <span className="text-xs font-normal text-slate-400 ml-1.5">({totalSubmitted} submissions)</span>
            )}
          </div>
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
              <th className="p-4 text-right">Inspection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {attemptsLoading ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-slate-400">
                  Loading candidate attempts...
                </td>
              </tr>
            ) : filteredAttempts.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-slate-400">
                  No candidate submissions recorded for this test drive yet.
                </td>
              </tr>
            ) : (
              filteredAttempts.map((att) => {
                const globalRank = attempts.findIndex(a => a.id === att.id) + 1;
                const s = resolveStudent(att);
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
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedAttempt(att)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-[#FD4A32] hover:text-white hover:border-[#FD4A32] text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
                        title="View Detailed Student Scorecard & Responses"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🔍 Candidate Placement Performance Scorecard Modal */}
      {selectedAttempt && (() => {
        const inspectedSummary = selectedAttempt.result_summary || {
          total_score: selectedAttempt.total_score || 0,
          max_score: selectedAttempt.max_possible_score || (exam?.total_marks || 100),
          percentage: selectedAttempt.percentage || 0,
          passed: Boolean(selectedAttempt.passed),
          tier: (selectedAttempt.percentage || 0) >= 70 ? 'TIER_1' : (selectedAttempt.percentage || 0) >= 50 ? 'TIER_2' : 'TIER_3',
          tier_label: (selectedAttempt.percentage || 0) >= 70 ? 'Tier 1: Day-1 Ready' : (selectedAttempt.percentage || 0) >= 50 ? 'Tier 2: Near Ready' : 'Tier 3: Remedial Needed',
          total_questions: exam?.sections?.reduce((sum, s) => sum + (s.question_ids?.length || 0), 0) || 0,
          total_attempted: Object.keys(selectedAttempt.responses || {}).length,
          total_correct: Math.round(selectedAttempt.total_score || 0),
          total_incorrect: Math.max(0, Object.keys(selectedAttempt.responses || {}).length - Math.round(selectedAttempt.total_score || 0)),
          total_unattempted: 0,
          overall_accuracy: Object.keys(selectedAttempt.responses || {}).length > 0 ? Math.round(((selectedAttempt.total_score || 0) / Object.keys(selectedAttempt.responses || {}).length) * 100) : (selectedAttempt.percentage || 0),
          time_spent_seconds: selectedAttempt.time_spent_seconds || 0,
          tab_switch_count: selectedAttempt.tab_switch_count || 0,
          proctor_status: (selectedAttempt.tab_switch_count || 0) > 3 ? 'MALPRACTICE_TERMINATED' : (selectedAttempt.tab_switch_count || 0) > 0 ? 'WARNING' : 'CLEAN',
          sections: exam?.sections?.map((s, idx) => ({
            section_id: s.id || `sec-${idx}`,
            section_name: s.name,
            total_questions: s.question_ids?.length || 0,
            attempted: 0,
            correct: 0,
            incorrect: 0,
            unattempted: s.question_ids?.length || 0,
            score: 0,
            max_score: (s.question_ids?.length || 0) * (Number(s.marks_per_correct) || 1),
            percentage: 0,
            accuracy: 0,
          })) || [],
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#151618] border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              {(() => {
                const selStudent = resolveStudent(selectedAttempt);
                return (
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#1a1b1e]">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FD4A32]">
                        Candidate Placement Performance Scorecard
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {selStudent.name || 'Candidate Scorecard'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Roll: <strong className="text-slate-800 dark:text-slate-200">{selStudent.roll_number || '—'}</strong> • 
                        Dept: <strong className="text-slate-800 dark:text-slate-200">{selStudent.department || 'General'}</strong> • 
                        Email: {selStudent.email || selectedAttempt.student_email || selectedAttempt.student_id}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedAttempt(null)}
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                );
              })()}

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs">
                {/* 1. Placement Verdict & Cutoff Banner */}
                <div className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                  selectedAttempt.passed
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedAttempt.passed
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
                    }`}>
                      {selectedAttempt.passed ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        {selectedAttempt.passed ? 'Qualified For Next Placement Round' : 'Remedial Training Required'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {selectedAttempt.passed ? 'Candidate scored above institutional cutoff threshold' : 'Candidate scored below minimum qualifying passing marks'}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase self-start sm:self-auto border ${
                    selectedAttempt.status === 'TERMINATED_MALPRACTICE'
                      ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400'
                      : (selectedAttempt.percentage || 0) >= 70
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : (selectedAttempt.percentage || 0) >= 50
                      ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/60 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/60 dark:text-amber-300'
                  }`}>
                    {inspectedSummary?.tier_label || (selectedAttempt.status === 'TERMINATED_MALPRACTICE' ? 'Disqualified / Malpractice' : (selectedAttempt.percentage || 0) >= 70 ? 'Tier 1: Day-1 Ready' : (selectedAttempt.percentage || 0) >= 50 ? 'Tier 2: Near Ready' : 'Tier 3: Remedial Needed')}
                  </span>
                </div>

                {/* 2. Core Placement Assessment Metrics (5 Cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Total Marks</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {selectedAttempt.total_score} <span className="text-xs font-bold text-slate-400">/ {selectedAttempt.max_possible_score || 100}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Net Marks</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Percentage</div>
                    <div className={`text-xl font-black mt-1 ${selectedAttempt.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {selectedAttempt.percentage}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Overall Score</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Overall Accuracy</div>
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                      {inspectedSummary?.overall_accuracy ?? (selectedAttempt.percentage || 0)}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Correct / Attempted</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Attempt Rate</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-1.5">
                      {inspectedSummary?.total_attempted ?? '—'} <span className="text-xs font-normal text-slate-400">/ {inspectedSummary?.total_questions ?? '—'} Qs</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {inspectedSummary?.total_unattempted ?? 0} Skipped
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Integrity & Time</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-1.5 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{Math.round((selectedAttempt.time_spent_seconds || 0) / 60)} mins</span>
                    </div>
                    <div className="text-[10px] mt-0.5">
                      {(selectedAttempt.tab_switch_count || 0) === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">0 Violations</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">{selectedAttempt.tab_switch_count} Tab Switches</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Domain & Sectional Mastery Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Domain-Wise Performance Breakdown
                    </h4>
                    <span className="text-[11px] text-slate-400">Sectional Scores & Accuracy</span>
                  </div>

                  {inspectedSummary?.sections && inspectedSummary.sections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {inspectedSummary.sections.map((sec) => (
                        <div
                          key={sec.section_id}
                          className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                              {sec.section_name}
                            </span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {sec.score} / {sec.max_score} <span className="text-slate-400 font-normal">({sec.percentage}%)</span>
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                sec.percentage >= 70 ? 'bg-emerald-500' : sec.percentage >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, sec.percentage))}%` }}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Attempted</span>
                              <strong className="text-slate-700 dark:text-slate-300">{sec.attempted} / {sec.total_questions}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Accuracy</span>
                              <strong className="text-blue-600 dark:text-blue-400">{sec.accuracy}%</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Correct / Wrong</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{sec.correct}</span>
                              <span className="text-slate-400"> / </span>
                              <span className="font-semibold text-rose-500">{sec.incorrect}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                      Overall score recorded: {selectedAttempt.total_score} marks ({selectedAttempt.percentage}%).
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1b1e] flex justify-end">
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Close Scorecard
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
