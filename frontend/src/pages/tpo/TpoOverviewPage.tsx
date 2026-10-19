import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tpoService, getExamTimingStatus } from '@/services/tpo.service';
import {
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Plus,
  Upload,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react';
import type { MockExam } from '@/types/tpo';
import type { TpoOutletContext } from '@/layouts/TpoLayout';
import BulkStudentImportModal from '@/components/tpo/BulkStudentImportModal';
import CreateMockExamModal from '@/components/tpo/CreateMockExamModal';
import AddStudentModal from '@/components/tpo/AddStudentModal';

export default function TpoOverviewPage() {
  const { collegeId, currentCollege, stats } = useOutletContext<TpoOutletContext>();
  const queryClient = useQueryClient();

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);

  // Fetch recent mock exams
  const { data: mockExams = [] } = useQuery<MockExam[]>({
    queryKey: ['tpo-mock-exams', collegeId],
    queryFn: () => tpoService.getMockExamsForCollege(collegeId),
    enabled: !!collegeId,
  });

  const maxLicenses = currentCollege.max_licenses || stats?.maxLicenses || 1500;
  const enrolledCount = stats?.totalStudents || 0;
  const freeSeats = Math.max(0, maxLicenses - enrolledCount);
  const percentUsed = Math.min(100, Math.round((enrolledCount / maxLicenses) * 100));

  const validUntilDate = currentCollege.valid_until ? new Date(currentCollege.valid_until) : null;
  const now = useMemo(() => new Date(), []);
  const daysLeft = validUntilDate
    ? Math.ceil((validUntilDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const isContractExpired = validUntilDate ? daysLeft <= 0 : false;
  const isContractExpiringSoon = daysLeft > 0 && daysLeft <= 7;

  // Filter out any automated test verification artifacts
  const validMockExams = useMemo(() => {
    return mockExams.filter(e => !e.is_deleted && !e.id.startsWith('exam_verify_') && !e.id.startsWith('test_'));
  }, [mockExams]);

  const liveExams = useMemo(() => {
    return validMockExams.filter(e => e.is_active && getExamTimingStatus(e, now) === 'LIVE');
  }, [validMockExams, now]);

  const concludedExams = useMemo(() => {
    return validMockExams.filter(e => e.is_active && getExamTimingStatus(e, now) === 'CONCLUDED');
  }, [validMockExams, now]);

  const upcomingExams = useMemo(() => {
    return validMockExams.filter(e => e.is_active && getExamTimingStatus(e, now) === 'UPCOMING');
  }, [validMockExams, now]);

  const sortedRecentDrives = useMemo(() => {
    return [...validMockExams].sort((a, b) => {
      const timingA = getExamTimingStatus(a, now);
      const timingB = getExamTimingStatus(b, now);

      const rank = (t: string) => (t === 'LIVE' ? 0 : t === 'UPCOMING' ? 1 : t === 'CONCLUDED' ? 2 : 3);
      const diff = rank(timingA) - rank(timingB);
      if (diff !== 0) return diff;

      const dateA = new Date(a.end_time || a.start_time || a.created_at || 0).getTime();
      const dateB = new Date(b.end_time || b.start_time || b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }, [validMockExams, now]);

  const readinessScore = stats?.avgCollegeScore || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Welcome & Campus Banner */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              Institutional Placement Dashboard
            </span>
            <span className="text-xs text-slate-400 font-medium">Batch 2026 CRT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentCollege.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Monitor real-time campus recruitment training, company mock drives (TCS, Accenture, Infosys), and placement readiness across all engineering departments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] hover:border-[#FD4A32] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#FD4A32]" />
            Add Student
          </button>
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Upload className="w-4 h-4 text-[#FD4A32]" />
            Bulk Import (CSV)
          </button>
          <button
            onClick={() => setIsCreateExamOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FD4A32]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Schedule Mock Exam
          </button>
        </div>
      </div>

      {/* 1b. Institutional License Package & Validity Banner */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isContractExpired
              ? 'bg-rose-500/10 text-rose-500'
              : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Institutional License Package
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                isContractExpired
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                  : isContractExpiringSoon
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
              }`}>
                {isContractExpired
                  ? 'Expired'
                  : isContractExpiringSoon
                  ? `Expiring Soon (${daysLeft}d left)`
                  : `${daysLeft} Days Active`}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
              Valid until{' '}
              <strong className="font-mono text-slate-900 dark:text-white">
                {validUntilDate
                  ? validUntilDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Continuous'}
              </strong>
              {' '}• Enrolled students receive full Campus Pro Pass access during this window.
            </p>
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0 space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">Seat Capacity:</span>
            <strong className="font-mono text-slate-900 dark:text-white">
              {enrolledCount} / {maxLicenses} Seats ({freeSeats} free)
            </strong>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                percentUsed >= 100 ? 'bg-rose-500' : percentUsed >= 85 ? 'bg-amber-500' : 'bg-[#FD4A32]'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Enrolled Students */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Students</span>
            <Users className="w-4 h-4 text-[#FD4A32]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {enrolledCount}
            <span className="text-xs font-normal text-slate-400 ml-1.5">/ {maxLicenses} capacity</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {freeSeats.toLocaleString()} available seats remaining
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-[#FD4A32] h-full rounded-full transition-all"
              style={{
                width: `${percentUsed}%`,
              }}
            />
          </div>
        </div>

        {/* Card 2: Mock Placement Drives */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Mock Placement Drives</span>
            <Calendar className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 flex items-baseline gap-2">
            <span>{validMockExams.length}</span>
            <span className="text-xs font-semibold text-slate-400">Total Drives</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap text-xs">
            {liveExams.length > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {liveExams.length} Live
              </span>
            ) : (
              <span className="text-[11px] font-bold text-slate-400">0 Live</span>
            )}
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
              {concludedExams.length} Concluded
            </span>
            {upcomingExams.length > 0 && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-blue-500 font-medium text-[11px]">
                  {upcomingExams.length} Scheduled
                </span>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Candidate Submissions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Candidate Submissions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 flex items-baseline gap-2">
            <span>{stats?.totalAttempts || 0}</span>
            <span className="text-xs font-semibold text-slate-400">Total Attempts</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            <strong className="text-slate-900 dark:text-white">{stats?.uniqueStudentsEvaluated || 0}</strong> unique candidate(s) tested
          </p>
        </div>

        {/* Card 4: Campus Readiness */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">Campus Readiness</span>
              <span title="Benchmark average across all evaluated candidate attempts. Tier 1: 70%+, Tier 2: 50-69%, Tier 3: <50%" className="cursor-help text-slate-400 hover:text-slate-600">
                <Info className="w-3.5 h-3.5" />
              </span>
            </div>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 flex items-baseline gap-2">
            <span>{readinessScore}%</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              readinessScore >= 70
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                : readinessScore >= 50
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-300 dark:border-amber-700'
            }`}>
              {readinessScore >= 70 ? 'Tier 1 • Ready' : readinessScore >= 50 ? 'Tier 2 • Proficient' : 'Tier 3 • Foundational'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Cohort mean across {stats?.uniqueStudentsEvaluated || 0} evaluated candidate(s)
          </p>
        </div>
      </div>

      {/* 3. Recent Mock Drives & Department Performance Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Mock Exams */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Active &amp; Recent Mock Drives</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live recruitment testing sessions &amp; completed drives</p>
            </div>
            <Link
              to="/tpo/exams"
              className="text-xs font-bold text-[#FD4A32] hover:underline inline-flex items-center gap-1"
            >
              View All Drives ({validMockExams.length}) <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {validMockExams.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Mock Drives Scheduled</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Schedule your first mock exam (TCS NQT, Accenture, Infosys) pooled from verified questions.
              </p>
              <button
                onClick={() => setIsCreateExamOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#FD4A32] text-white text-xs font-bold uppercase tracking-wider"
              >
                Create Exam
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedRecentDrives.slice(0, 5).map(exam => {
                const timing = getExamTimingStatus(exam, now);
                return (
                  <div key={exam.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#FD4A32]/10 text-[#FD4A32]">
                          {exam.target_company}
                        </span>
                        {timing === 'LIVE' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Live
                          </span>
                        )}
                        {timing === 'CONCLUDED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            Concluded
                          </span>
                        )}
                        {timing === 'UPCOMING' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            Scheduled
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{exam.title}</h4>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span>{exam.duration_minutes} Mins</span>
                        <span>•</span>
                        <span>Total Marks: {exam.total_marks}</span>
                        <span>•</span>
                        <span>
                          {exam.start_time && exam.end_time
                            ? `Live Window: ${new Date(exam.start_time).toLocaleDateString([], { month: 'short', day: 'numeric' })} – ${new Date(exam.end_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                            : `Target: ${exam.target_departments?.length ? exam.target_departments.join(', ') : 'All Branches'}`}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/tpo/exams/${exam.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      View Ranks →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Department Readiness */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Department Readiness</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Branch-wise participation</p>
            </div>
            <Link
              to="/tpo/analytics"
              className="text-xs font-bold text-[#FD4A32] hover:underline"
            >
              Analytics →
            </Link>
          </div>

          <div className="space-y-3">
            {(stats?.departments || []).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Enroll students to view department distributions.
              </div>
            ) : (
              (stats?.departments || []).map((dept: any) => (
                <div
                  key={dept.department}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                      {dept.department} Branch
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {dept.studentCount} enrolled • {dept.evaluatedCount ?? 0} evaluated
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                    {dept.avgScore}% avg
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        collegeId={collegeId}
        collegeName={currentCollege.name}
        onSuccess={() => {
          setIsAddStudentOpen(false);
          queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['tpo-students', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
        }}
      />

      <BulkStudentImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        collegeId={collegeId}
        collegeName={currentCollege.name}
        onSuccess={() => {
          setIsImportOpen(false);
          queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['tpo-students', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['admin-colleges-usage'] });
        }}
      />

      <CreateMockExamModal
        isOpen={isCreateExamOpen}
        onClose={() => setIsCreateExamOpen(false)}
        collegeId={collegeId}
        onSuccess={() => {
          setIsCreateExamOpen(false);
          queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['tpo-mock-exams', collegeId] });
        }}
      />

    </div>
  );
}
