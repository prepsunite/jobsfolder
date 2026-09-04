import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  X,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Award,
  Users,
} from 'lucide-react';
import { tpoService } from '@/services/tpo.service';
import type { MockExam, StudentExamAttempt } from '@/types/tpo';

interface ExamAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: MockExam;
}

export default function ExamAnalyticsModal({
  isOpen,
  onClose,
  exam,
}: ExamAnalyticsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const { data: attempts = [], isLoading } = useQuery<StudentExamAttempt[]>({
    queryKey: ['tpo-exam-attempts', exam.id],
    queryFn: () => tpoService.getExamAttempts(exam.id),
    enabled: isOpen && !!exam.id,
  });

  if (!isOpen) return null;

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
  const avgScore = totalSubmitted > 0
    ? Math.round(attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / totalSubmitted)
    : 0;

  // Export to CSV
  const handleExportCSV = () => {
    if (attempts.length === 0) return;

    const headers = 'Rank,Roll Number,Student Name,Email,Department,Score,Max Score,Percentage,Result,Tab Switches,Status\n';
    const rows = attempts.map((a, idx) => {
      const s = a.student || { name: 'Student', email: '', roll_number: '', department: 'CSE' };
      return `${idx + 1},"${s.roll_number || ''}","${s.name}","${s.email}","${s.department || ''}",${a.total_score},${a.max_possible_score},${a.percentage}%,${a.passed ? 'PASSED' : 'FAILED'},${a.tab_switch_count},${a.status}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exam.title.toLowerCase().replace(/\s+/g, '_')}_placement_report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#2e3035] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#151618]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {exam.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FD4A32]/10 text-[#FD4A32]">
                {exam.target_company}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Duration: {exam.duration_minutes} Mins • Total Marks: {exam.total_marks} • Cutoff: {exam.passing_percentage}%
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-100/60 dark:bg-[#202225] border-b border-gray-200 dark:border-[#2b2d31]">
          <div className="p-3 bg-white dark:bg-[#151618] rounded-xl border border-gray-200 dark:border-[#2e3035]">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Appeared</div>
            <div className="text-xl font-black text-gray-900 dark:text-white mt-1">{totalSubmitted}</div>
          </div>
          <div className="p-3 bg-white dark:bg-[#151618] rounded-xl border border-gray-200 dark:border-[#2e3035]">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Pass Rate</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{passRate}%</div>
          </div>
          <div className="p-3 bg-white dark:bg-[#151618] rounded-xl border border-gray-200 dark:border-[#2e3035]">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Batch Average</div>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{avgScore}%</div>
          </div>
          <div className="p-3 bg-white dark:bg-[#151618] rounded-xl border border-gray-200 dark:border-[#2e3035] flex items-center justify-center">
            <button
              onClick={handleExportCSV}
              disabled={attempts.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-[#2e3035] flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Roll No, Student Name, or Email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 dark:border-[#383a40] bg-gray-50 dark:bg-[#151618] text-xs text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#383a40] bg-gray-50 dark:bg-[#151618] text-xs text-gray-800 dark:text-gray-200"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
          </select>
        </div>

        {/* Results Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-gray-500">Loading candidate attempts...</div>
          ) : filteredAttempts.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">No attempts recorded for this exam yet.</div>
          ) : (
            <div className="border border-gray-200 dark:border-[#2e3035] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-[#202225] text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-[#2e3035]">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Dept</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Percentage</th>
                    <th className="p-3">Tab Switches</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2e3035]">
                  {filteredAttempts.map((att, idx) => {
                    const s = att.student || { name: 'Student', email: '', roll_number: '—', department: 'CSE' };
                    return (
                      <tr key={att.id} className="hover:bg-gray-50 dark:hover:bg-[#202225]">
                        <td className="p-3 font-bold text-gray-500">#{idx + 1}</td>
                        <td className="p-3 font-mono font-bold text-gray-800 dark:text-gray-200">
                          {s.roll_number || '—'}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-gray-900 dark:text-white">{s.name}</div>
                          <div className="text-[10px] text-gray-400">{s.email}</div>
                        </td>
                        <td className="p-3 uppercase font-bold text-[#FD4A32]">{s.department || 'CSE'}</td>
                        <td className="p-3 font-bold text-gray-900 dark:text-white">
                          {att.total_score} / {att.max_possible_score}
                        </td>
                        <td className="p-3">
                          <span className={`font-black ${att.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {att.percentage}%
                          </span>
                        </td>
                        <td className="p-3">
                          {att.tab_switch_count > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                              <AlertTriangle className="w-3 h-3" />
                              {att.tab_switch_count} violations
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        <td className="p-3">
                          {att.status === 'TERMINATED_MALPRACTICE' ? (
                            <span className="text-rose-600 font-bold">Terminated</span>
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
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
