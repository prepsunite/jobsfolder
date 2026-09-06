import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import type { TpoOutletContext } from '@/layouts/TpoLayout';
import { tpoService } from '@/services/tpo.service';
import type { MockExam, StudentExamAttempt } from '@/types/tpo';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Download,
  GraduationCap,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  X,
  XCircle,
  Users,
} from 'lucide-react';

export default function TpoAnalyticsPage() {
  const { collegeId, currentCollege, stats } = useOutletContext<TpoOutletContext>();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamFilter, setSelectedExamFilter] = useState('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL');
  const [selectedAttempt, setSelectedAttempt] = useState<StudentExamAttempt | null>(null);

  // 1. Fetch Mock Exams for College
  const { data: mockExams = [], isLoading: isLoadingExams } = useQuery<MockExam[]>({
    queryKey: ['tpo-mock-exams', collegeId],
    queryFn: () => tpoService.getMockExamsForCollege(collegeId),
    enabled: !!collegeId,
  });

  // 2. Fetch All Candidate Attempts across all drives for this College
  const { data: allAttempts = [], isLoading: isLoadingAttempts } = useQuery<StudentExamAttempt[]>({
    queryKey: ['tpo-college-attempts', collegeId],
    queryFn: () => tpoService.getAllCollegeAttempts(collegeId),
    enabled: !!collegeId,
  });

  const departments = stats?.departments || [];
  const total = stats?.totalStudents || 0;
  const avg = stats?.avgCollegeScore || 0;

  // Real placement readiness tier counts computed from actual student attempt results
  const tier1Count = stats?.tierCounts?.tier1 ?? 0;
  const tier2Count = stats?.tierCounts?.tier2 ?? 0;
  const tier3Count = stats?.tierCounts?.tier3 ?? 0;

  // Filter candidate attempts
  const filteredAttempts = allAttempts.filter(att => {
    const student = att.student || { name: '', email: '', roll_number: '', department: '' };
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.roll_number && student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesExam = selectedExamFilter === 'ALL' || att.mock_exam_id === selectedExamFilter;
    const matchesDept =
      selectedDeptFilter === 'ALL' ||
      (student.department || '').toUpperCase() === selectedDeptFilter.toUpperCase();

    let matchesTier = true;
    const pct = att.percentage || 0;
    if (selectedTierFilter === 'TIER_1') matchesTier = pct >= 70 && att.status !== 'TERMINATED_MALPRACTICE';
    else if (selectedTierFilter === 'TIER_2') matchesTier = pct >= 50 && pct < 70 && att.status !== 'TERMINATED_MALPRACTICE';
    else if (selectedTierFilter === 'TIER_3') matchesTier = pct < 50 && att.status !== 'TERMINATED_MALPRACTICE';
    else if (selectedTierFilter === 'MALPRACTICE') matchesTier = att.status === 'TERMINATED_MALPRACTICE';

    return matchesSearch && matchesExam && matchesDept && matchesTier;
  });

  // Available unique departments from students and attempts
  const availableDepts = Array.from(
    new Set([
      ...departments.map((d: any) => d.department),
      ...allAttempts.map(a => a.student?.department).filter(Boolean),
    ])
  );

  // Generate real NIRF / NAAC Institutional Placement Intelligence Report CSV
  const handleDownloadReport = () => {
    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const headers = 'Institution Placement Intelligence Report (NIRF / NAAC Criterion 5.2)\n';
    const metadata = `College Name,"${currentCollege.name}"\nCollege Code,${currentCollege.code}\nGenerated On,"${reportDate}"\nTotal Student Licenses,${currentCollege.max_licenses}\nEnrolled Candidates,${total}\nCampus Average Score,${avg}%\n\n`;

    const tierHeader = 'Placement Readiness Tier,Student Count,Benchmark Requirement\n';
    const tierRows = [
      `Tier 1 (Day-1 Placement Ready),${tier1Count},"Consistent 70%+ clearance in company mocks"`,
      `Tier 2 (Near Ready),${tier2Count},"50%–69% score, targeted aptitude practice needed"`,
      `Tier 3 (Remedial Prep Needed),${tier3Count},"Below 50%, foundational remediation recommended"`,
    ].join('\n') + '\n\n';

    const deptHeader = 'Department,Enrolled Candidates,Average Score (%),Readiness Status\n';
    const deptRows = departments.length > 0
      ? departments.map(d => `"${d.department} Branch",${d.studentCount},${d.avgScore}%,${d.avgScore >= 60 ? 'Above Benchmark' : 'Review Needed'}`).join('\n')
      : '"General Engineering",0,0%,Pending Roster Upload';

    const fullContent = headers + metadata + tierHeader + tierRows + deptHeader + deptRows;
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCollege.code}_Placement_Intelligence_NIRF_Report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Student Results CSV
  const handleDownloadCandidateResults = () => {
    if (allAttempts.length === 0) return;
    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const headers = 'Rank,Roll Number,Student Name,Email,Department,Assessment Drive,Target Company,Score,Max Marks,Percentage,Qualification,Placement Tier,Attempted Questions,Total Questions,Accuracy,Tab Switches,Submission Date\n';
    const rows = allAttempts.map((a, idx) => {
      const s = a.student || { name: 'Student', email: '', roll_number: '—', department: 'General' };
      const pct = a.percentage || 0;
      const res = a.result_summary;
      const tier = a.status === 'TERMINATED_MALPRACTICE' ? 'Malpractice / Disqualified' : (res?.tier_label || (pct >= 70 ? 'Tier 1: Day-1 Ready' : pct >= 50 ? 'Tier 2: Near Ready' : 'Tier 3: Remedial Needed'));
      const qualification = a.passed ? 'QUALIFIED' : 'NOT QUALIFIED';
      const examTitle = (a as any).exam_title || a.mock_exam_id;
      const company = (a as any).target_company || 'Campus Drive';
      const subDate = a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : '—';
      const attempted = res?.total_attempted ?? '—';
      const totalQ = res?.total_questions ?? '—';
      const acc = res?.overall_accuracy !== undefined ? `${res.overall_accuracy}%` : `${pct}%`;
      return `${idx + 1},"${s.roll_number || '—'}","${s.name}","${s.email}","${s.department || 'General'}","${examTitle}","${company}",${a.total_score},${a.max_possible_score || 100},${pct}%,${qualification},"${tier}",${attempted},${totalQ},${acc},${a.tab_switch_count || 0},"${subDate}"`;
    }).join('\n');

    const fullContent = `College,"${currentCollege.name}" (${currentCollege.code})\nExported On,"${reportDate}"\n\n` + headers + rows;
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCollege.code}_Candidate_Results_Leaderboard.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Find corresponding exam for currently inspected attempt
  const activeExam = selectedAttempt
    ? mockExams.find(e => e.id === selectedAttempt.mock_exam_id)
    : null;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Institutional Placement Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time candidate scorecards, comparative department benchmarks, and NAAC/NIRF reporting
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {allAttempts.length > 0 && (
            <button
              onClick={handleDownloadCandidateResults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] hover:border-[#FD4A32] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#FD4A32]" />
              Export Scores (CSV)
            </button>
          )}

          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FD4A32]/20 self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download NAAC / NIRF Report
          </button>
        </div>
      </div>

      {/* High-Level Placement Readiness Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Tier 1 • Day-1 Ready
            </span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {tier1Count} Students
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Scoring 70%+ consistently in company mocks. Immediate candidates for mass IT (TCS Ninja/Digital, Accenture, Infosys DSE).
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Tier 2 • Near Ready
            </span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {tier2Count} Students
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Scoring between 50%–69%. Need 2–3 weeks of focused topic practice in Quantitative Aptitude &amp; Pseudo-code.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              Tier 3 • Remedial Prep Needed
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {tier3Count} Students
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Scoring below 50%. Require foundational speed-math, reading comprehension, and basic reasoning modules.
          </p>
        </div>
      </div>

      {/* 🌟 1. CANDIDATE ASSESSMENT RESULTS & INSTITUTIONAL LEADERBOARD */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Candidate Assessment Results &amp; Scorecards
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#FD4A32]/10 text-[#FD4A32]">
                {allAttempts.length} Submissions
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live rank leaderboard across all campus drives with full response audit &amp; proctoring inspection
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, roll #, email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-[#FD4A32] text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {/* Drive / Exam Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Drive:</span>
            <select
              value={selectedExamFilter}
              onChange={e => setSelectedExamFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-hidden"
            >
              <option value="ALL">All Drives ({mockExams.length})</option>
              {mockExams.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.title} ({ex.target_company || 'Drive'})
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          {availableDepts.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Branch:</span>
              <select
                value={selectedDeptFilter}
                onChange={e => setSelectedDeptFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-hidden"
              >
                <option value="ALL">All Branches</option>
                {availableDepts.map(dept => (
                  <option key={dept} value={dept}>
                    {dept} Branch
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Performance Tier Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Tier:</span>
            <select
              value={selectedTierFilter}
              onChange={e => setSelectedTierFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-hidden"
            >
              <option value="ALL">All Tiers</option>
              <option value="TIER_1">Tier 1 (70%+ Score)</option>
              <option value="TIER_2">Tier 2 (50%–69%)</option>
              <option value="TIER_3">Tier 3 (Below 50%)</option>
              <option value="MALPRACTICE">Malpractice Flagged</option>
            </select>
          </div>

          {(searchTerm || selectedExamFilter !== 'ALL' || selectedDeptFilter !== 'ALL' || selectedTierFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedExamFilter('ALL');
                setSelectedDeptFilter('ALL');
                setSelectedTierFilter('ALL');
              }}
              className="text-[#FD4A32] hover:underline font-bold text-xs ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Student Results Table */}
        {isLoadingAttempts ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p>Loading candidate test results &amp; rank metrics...</p>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="py-14 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {allAttempts.length === 0
                  ? 'No Student Results Recorded Yet'
                  : 'No Candidates Match the Filter Criteria'}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {allAttempts.length === 0
                  ? 'Once candidates take and submit mock assessments, their rank, score, accuracy, and proctoring audit logs will appear here in real time.'
                  : 'Try adjusting your search terms, drive selection, or tier filters.'}
              </p>
            </div>
            {allAttempts.length === 0 && mockExams.length > 0 && (
              <div className="pt-2">
                <Link
                  to={`/tpo/exams/${mockExams[0]?.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FD4A32] hover:underline"
                >
                  View Active Drive Link <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                  <th className="pb-3 pr-3">Rank</th>
                  <th className="pb-3 px-3">Roll No</th>
                  <th className="pb-3 px-3">Candidate Details</th>
                  <th className="pb-3 px-3">Branch</th>
                  <th className="pb-3 px-3">Assessment Drive</th>
                  <th className="pb-3 px-3">Score</th>
                  <th className="pb-3 px-3">Readiness</th>
                  <th className="pb-3 px-3">Proctor Log</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 pl-3 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredAttempts.map((att, idx) => {
                  const s = att.student || { name: 'Student', email: '', roll_number: '—', department: 'General' };
                  const pct = att.percentage || 0;
                  const isMalpractice = att.status === 'TERMINATED_MALPRACTICE';
                  const tierLabel = isMalpractice
                    ? 'Terminated'
                    : pct >= 70
                    ? 'Tier 1'
                    : pct >= 50
                    ? 'Tier 2'
                    : 'Tier 3';

                  const examTitle = (att as any).exam_title || mockExams.find(e => e.id === att.mock_exam_id)?.title || att.mock_exam_id;
                  const targetCompany = (att as any).target_company || mockExams.find(e => e.id === att.mock_exam_id)?.target_company || 'Campus Drive';

                  return (
                    <tr key={att.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 pr-3 font-black text-slate-400">
                        #{idx + 1}
                      </td>
                      <td className="py-4 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {s.roll_number || '—'}
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">
                          {s.email || att.student_email || att.student_id}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {s.department || 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                          {examTitle}
                        </div>
                        <div className="text-[10px] text-[#FD4A32] font-bold">
                          {targetCompany}
                        </div>
                      </td>
                      <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">
                        {att.total_score} / {att.max_possible_score || 100}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-black ${
                              isMalpractice
                                ? 'text-rose-600 dark:text-rose-400'
                                : pct >= 70
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : pct >= 50
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {pct}%
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                              pct >= 70
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : pct >= 50
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                            }`}
                          >
                            {tierLabel}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        {att.tab_switch_count && att.tab_switch_count > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            {att.tab_switch_count} switches
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">0 switches</span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        {isMalpractice ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Terminated
                          </span>
                        ) : att.passed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Below Cutoff
                          </span>
                        )}
                      </td>
                      <td className="py-4 pl-3 text-right">
                        <button
                          onClick={() => setSelectedAttempt(att)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-[#FD4A32] hover:text-white hover:border-[#FD4A32] text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                          title="View Detailed Student Scorecard & Responses"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Branch vs Branch Comparison Cards */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Department Performance Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Participation and test averages by engineering stream
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No student branch records found. Bulk import students to view branch metrics.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept: any) => (
              <div
                key={dept.department}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#FD4A32]">
                    {dept.department} Branch
                  </span>
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                </div>

                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {dept.studentCount} Students
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Readiness Score:</span>
                    <strong className="text-blue-600 dark:text-blue-400">{dept.avgScore}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, dept.avgScore)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Assessment Drive Performance History */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Assessment Drive Performance History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Scheduled mock recruitment drives with company blueprints and participation links
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
            {mockExams.length} Total Drives
          </span>
        </div>

        {isLoadingExams ? (
          <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
            Loading assessment drives...
          </div>
        ) : mockExams.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-3">
            <FileText className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p>No assessment drives scheduled or completed yet.</p>
            <Link
              to="/tpo/exams"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FD4A32] hover:underline"
            >
              Configure an Assessment Drive <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                  <th className="pb-3 pr-4">Drive Title / Category</th>
                  <th className="pb-3 px-4">Pattern / Sections</th>
                  <th className="pb-3 px-4">Duration</th>
                  <th className="pb-3 px-4">Proctoring</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Drive Leaderboard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {mockExams.map(exam => {
                  const totalQ = exam.sections?.reduce((sum, s) => sum + (s.question_ids?.length || 0), 0) || 0;
                  const isProctored = exam.enable_fullscreen_lock || exam.enable_tab_switch_detection;
                  return (
                    <tr key={exam.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {exam.title}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {exam.target_company || 'Company Assessment'}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">
                        {exam.sections?.length || 0} Sections ({totalQ} Questions)
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {exam.duration_minutes} mins
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {isProctored ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            Strict Proctor
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Standard</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {exam.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Live
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Completed / Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <Link
                          to={`/tpo/exams/${exam.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all shadow-xs cursor-pointer"
                        >
                          View Results <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🔍 Candidate Placement Performance Scorecard Modal */}
      {selectedAttempt && (() => {
        const inspectedSummary = selectedAttempt.result_summary || (activeExam ? tpoService.calculateAttemptResult(
          activeExam,
          selectedAttempt.responses || {},
          {},
          selectedAttempt.time_spent_seconds || 0,
          selectedAttempt.tab_switch_count || 0,
          selectedAttempt.status as any
        ).resultSummary : null);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#151618] border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#1a1b1e]">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FD4A32]">
                    Candidate Placement Performance Scorecard
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedAttempt.student?.name || 'Candidate Scorecard'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Roll: <strong className="text-slate-800 dark:text-slate-200">{selectedAttempt.student?.roll_number || '—'}</strong> • 
                    Dept: <strong className="text-slate-800 dark:text-slate-200">{selectedAttempt.student?.department || 'General'}</strong> • 
                    Drive: <strong className="text-[#FD4A32]">{(selectedAttempt as any).exam_title || activeExam?.title || selectedAttempt.mock_exam_id}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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
