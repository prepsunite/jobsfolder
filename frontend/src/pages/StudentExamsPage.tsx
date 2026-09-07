import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  Building2,
  Search,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  TrendingUp,
  X,
  Sparkles,
  FileText,
  Layers,
  Check,
  RotateCcw,
  BookOpen,
  Filter,
  Eye,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { tpoService } from '@/services/tpo.service';
import type { MockExam, StudentExamAttempt } from '@/types/tpo';

type ExamFilterTab = 'ACTIVE' | 'COMPLETED' | 'UPCOMING' | 'ALL';

export default function StudentExamsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState<ExamFilterTab>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('ALL');

  // Scorecard Modal State
  const [selectedScorecardExam, setSelectedScorecardExam] = useState<
    (MockExam & { attempt?: StudentExamAttempt | null }) | null
  >(null);

  // 1. Fetch Campus Placement Mock Drives for Enrolled Student
  const {
    data: campusExamsData,
    isLoading: isExamsLoading,
    refetch: refetchExams,
  } = useQuery({
    queryKey: ['student-campus-mock-exams', user?.email, user?.collegeId],
    queryFn: async () => {
      if (!user?.email) return { college: null, exams: [] };
      return await tpoService.getStudentMockExams(user.email, user?.collegeId);
    },
    enabled: !!user?.email,
    staleTime: 30 * 1000,
  });

  const enrolledCollege = campusExamsData?.college;
  const campusExams = useMemo(() => campusExamsData?.exams || [], [campusExamsData]);

  // 2. Query Student's Enrollment Profile (department, cohort batch, roll number)
  const { data: studentRecord } = useQuery({
    queryKey: ['candidate-student-record-profile', user?.email, enrolledCollege?.id],
    queryFn: async () => {
      if (!user?.email || !enrolledCollege?.id) return null;
      const cleanEmail = user.email.trim().toLowerCase();
      let department = '';
      let batchName = '';
      let rollNumber = '';

      try {
        const { data: cs } = await supabase
          .from('college_students')
          .select('id, college_id, batch_id, department, roll_number, email, name')
          .eq('email', cleanEmail)
          .eq('college_id', enrolledCollege.id)
          .maybeSingle();

        if (cs) {
          if (cs.department) department = cs.department;
          if (cs.roll_number) rollNumber = cs.roll_number;
          if (cs.batch_id) {
            const { data: b } = await supabase
              .from('college_batches')
              .select('name')
              .eq('id', cs.batch_id)
              .maybeSingle();
            if (b?.name) batchName = b.name;
          }
        }
      } catch (e) {
        console.warn('Error fetching student record:', e);
      }

      return { department, batch_name: batchName, roll_number: rollNumber };
    },
    enabled: !!user?.email && !!enrolledCollege?.id,
    staleTime: 60 * 1000,
  });

  // 3. User Subscription Status (Campus Pro Pass vs Free)
  const { data: subData } = useQuery({
    queryKey: ['user-subscription-info', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const cleanEmail = user.email.trim().toLowerCase();

      // Check Campus Pass
      const entitlement = tpoService.getStudentEntitlementInfo(cleanEmail);
      if (entitlement && entitlement.isEntitled) {
        return {
          isPro: true,
          planName: 'Campus Pro Pass',
          expiresAt: entitlement.expiresAt,
          collegeId: entitlement.collegeId,
        };
      }

      try {
        const { data } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_email', cleanEmail)
          .eq('status', 'ACTIVE')
          .gt('expires_at', new Date().toISOString())
          .order('expires_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          return { isPro: true, planName: data.plan_name || 'Jobsfolder Pro Pass', expiresAt: data.expires_at };
        }
      } catch {}

      return { isPro: false, planName: 'Free Tier' };
    },
    enabled: !!user?.email,
  });

  const isUserPro = subData?.isPro ?? false;

  // 4. Categorize Exams
  const now = useMemo(() => new Date(), []);

  const completedExams = useMemo(() => {
    return campusExams.filter(
      e =>
        e.attempt &&
        (e.attempt.status === 'SUBMITTED' ||
          e.attempt.status === 'TIMED_OUT' ||
          e.attempt.status === 'GRADED')
    );
  }, [campusExams]);

  const upcomingExams = useMemo(() => {
    return campusExams.filter(e => {
      if (e.attempt && e.attempt.status === 'SUBMITTED') return false;
      if (!e.start_time) return false;
      return new Date(e.start_time) > now;
    });
  }, [campusExams, now]);

  const activeExams = useMemo(() => {
    return campusExams.filter(e => {
      // If submitted, it's in completed
      if (
        e.attempt &&
        (e.attempt.status === 'SUBMITTED' ||
          e.attempt.status === 'TIMED_OUT' ||
          e.attempt.status === 'GRADED')
      ) {
        return false;
      }
      // If starts in the future, it's upcoming
      if (e.start_time && new Date(e.start_time) > now) {
        return false;
      }
      // Otherwise it's active or in-progress
      return true;
    });
  }, [campusExams, now]);

  const inProgressExams = useMemo(() => {
    return campusExams.filter(e => e.attempt && e.attempt.status === 'IN_PROGRESS');
  }, [campusExams]);

  // Overall Score Calculation
  const avgCampusScore = useMemo(() => {
    if (completedExams.length === 0) return null;
    const sum = completedExams.reduce((acc, e) => acc + (e.attempt?.percentage || 0), 0);
    return Math.round(sum / completedExams.length);
  }, [completedExams]);

  // Unique Companies for Filter Chips
  const availableCompanies = useMemo(() => {
    const set = new Set<string>();
    campusExams.forEach(e => {
      if (e.target_company) set.add(e.target_company);
    });
    return Array.from(set).sort();
  }, [campusExams]);

  // Filtered List based on Current Tab, Search, and Company Filter
  const displayedExams = useMemo(() => {
    let list: Array<MockExam & { attempt?: StudentExamAttempt | null }> = [];

    switch (activeTab) {
      case 'ACTIVE':
        list = activeExams;
        break;
      case 'COMPLETED':
        list = completedExams;
        break;
      case 'UPCOMING':
        list = upcomingExams;
        break;
      case 'ALL':
      default:
        list = campusExams;
        break;
    }

    if (selectedCompanyFilter !== 'ALL') {
      list = list.filter(e => e.target_company.toLowerCase() === selectedCompanyFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.target_company.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeTab, activeExams, completedExams, upcomingExams, campusExams, selectedCompanyFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* ── TOP BREADCRUMB & HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-[#242424]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            <Link to="/dashboard" className="hover:text-[#FD4A32] transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Campus Mock Assessments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-[#FD4A32]" />
            <span>Placement Mock Drives</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Standardized campus recruitment tests, company-specific mock papers, and proctored CRT assessments.
          </p>
        </div>

        {/* Action / Pro Pass Status */}
        <div className="flex items-center gap-3">
          {isUserPro ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>
                Campus Pro Pass Active
                {subData?.expiresAt
                  ? ` · ${Math.max(0, Math.ceil((new Date(subData.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}d left`
                  : ''}
              </span>
            </div>
          ) : (
            <Link
              to="/pricing"
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 flex items-center gap-2 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Upgrade Pass for Unlimited Drives</span>
            </Link>
          )}

          <button
            onClick={() => refetchExams()}
            className="p-2 rounded-xl border border-gray-200 dark:border-[#2c2e33] bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-[#FD4A32]/40 transition-colors text-xs font-bold"
            title="Refresh drives"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── INSTITUTIONAL ENROLLMENT & KPI INTELLIGENCE CARD ── */}
      {enrolledCollege ? (
        <div className="rounded-2xl p-6 border border-[#FD4A32]/30 dark:border-[#FD4A32]/25 bg-gradient-to-br from-orange-50/40 via-white to-orange-50/10 dark:from-[#1a1311] dark:via-[#141414] dark:to-[#121417] shadow-sm relative overflow-hidden space-y-6">
          {/* Header row with college info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 dark:border-[#2a2220] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center font-bold shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FD4A32] text-white">
                    Authorized Institutional Portal
                  </span>
                  {enrolledCollege.code && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#202226] text-gray-700 dark:text-gray-300">
                      {enrolledCollege.code}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight mt-0.5">
                  {enrolledCollege.name}
                </h2>
              </div>
            </div>

            {/* Student Department & Cohort */}
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300 flex-wrap bg-white/60 dark:bg-[#1c1d22] py-2 px-3.5 rounded-xl border border-orange-100 dark:border-[#2a2220]">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Candidate</span>
                <span className="font-bold text-gray-900 dark:text-white">{user?.name || user?.email}</span>
              </div>
              {studentRecord?.department && (
                <div className="border-l border-gray-200 dark:border-[#2e3036] pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Branch</span>
                  <span className="font-bold text-gray-900 dark:text-white">{studentRecord.department}</span>
                </div>
              )}
              {studentRecord?.batch_name && (
                <div className="border-l border-gray-200 dark:border-[#2e3036] pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Batch</span>
                  <span className="font-bold text-gray-900 dark:text-white">{studentRecord.batch_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* 4 Performance KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-[#18191c]/80 border border-orange-100 dark:border-[#2a2220] shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Assigned Drives
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                {campusExams.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Total college exams
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 dark:bg-[#18191c]/80 border border-orange-100 dark:border-[#2a2220] shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Active & Ongoing
              </div>
              <div className="text-2xl font-black text-[#FD4A32] mt-1 flex items-center gap-2">
                <span>{activeExams.length}</span>
                {inProgressExams.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {inProgressExams.length} In Progress
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Available to attempt now
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 dark:bg-[#18191c]/80 border border-orange-100 dark:border-[#2a2220] shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Completed Drives
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {completedExams.length}
                <span className="text-sm font-semibold text-gray-400 ml-1">/ {campusExams.length}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Evaluated submissions
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 dark:bg-[#18191c]/80 border border-orange-100 dark:border-[#2a2220] shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Placement Readiness
              </div>
              <div className="mt-1 flex items-center gap-2">
                {avgCampusScore !== null ? (
                  avgCampusScore >= 70 ? (
                    <span className="inline-flex items-center gap-1.5 text-base font-black text-emerald-600 dark:text-emerald-400">
                      <Award className="w-5 h-5 text-emerald-500" />
                      Day-1 Ready ({avgCampusScore}%)
                    </span>
                  ) : avgCampusScore >= 50 ? (
                    <span className="inline-flex items-center gap-1.5 text-base font-black text-blue-600 dark:text-blue-400">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      Near Ready ({avgCampusScore}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-base font-black text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                      Remedial ({avgCampusScore}%)
                    </span>
                  )
                ) : (
                  <span className="text-sm font-bold text-gray-400">Pending Attempt</span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {avgCampusScore !== null ? 'Based on verified drives' : 'Take first mock test to calibrate'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-6 border border-gray-200 dark:border-[#27292e] bg-gray-50/50 dark:bg-[#141517] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-[#202226] text-gray-500 flex items-center justify-center font-bold shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Individual Practice Candidate Mode
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl mt-0.5">
                You are currently browsing individual mock exams. If your college is partnered with PrepUnite / Jobsfolder, link your institutional email in settings or contact your TPO placement cell to access private campus recruitment drives.
              </p>
            </div>
          </div>
          <Link
            to="/pricing"
            className="px-4 py-2.5 rounded-xl bg-[#FD4A32] text-white text-xs font-bold uppercase tracking-wider shrink-0 hover:bg-[#e03f29] transition-all shadow-md shadow-[#FD4A32]/20"
          >
            Explore Campus Pro Passes →
          </Link>
        </div>
      )}

      {/* ── FILTER & TABS BAR ── */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#242424] pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'ACTIVE'
                  ? 'bg-[#FD4A32] text-white shadow-sm shadow-[#FD4A32]/25'
                  : 'bg-gray-100 dark:bg-[#18191c] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#202226]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Active Assessments</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'ACTIVE' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-[#27292e] text-gray-700 dark:text-gray-300'
                }`}
              >
                {activeExams.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'COMPLETED'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                  : 'bg-gray-100 dark:bg-[#18191c] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#202226]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed & Scorecards</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'COMPLETED' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-[#27292e] text-gray-700 dark:text-gray-300'
                }`}
              >
                {completedExams.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('UPCOMING')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'UPCOMING'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                  : 'bg-gray-100 dark:bg-[#18191c] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#202226]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Scheduled</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'UPCOMING' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-[#27292e] text-gray-700 dark:text-gray-300'
                }`}
              >
                {upcomingExams.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm'
                  : 'bg-gray-100 dark:bg-[#18191c] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#202226]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Drives</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'ALL' ? 'bg-white/20 dark:bg-black/20' : 'bg-gray-200 dark:bg-[#27292e] text-gray-700 dark:text-gray-300'
                }`}
              >
                {campusExams.length}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search assessment or company..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-gray-200 dark:border-[#27292e] bg-white dark:bg-[#18191c] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FD4A32]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Company Quick Filter Chips */}
        {availableCompanies.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
            <span className="text-gray-400 font-bold uppercase text-[10px] flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Company:
            </span>
            <button
              onClick={() => setSelectedCompanyFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors shrink-0 cursor-pointer ${
                selectedCompanyFilter === 'ALL'
                  ? 'bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/30'
                  : 'bg-gray-100 dark:bg-[#1c1d22] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All Companies
            </button>
            {availableCompanies.map(comp => (
              <button
                key={comp}
                onClick={() => setSelectedCompanyFilter(comp)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors shrink-0 cursor-pointer ${
                  selectedCompanyFilter.toLowerCase() === comp.toLowerCase()
                    ? 'bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/30'
                    : 'bg-gray-100 dark:bg-[#1c1d22] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── EXAMS GRID / EMPTY STATE ── */}
      {isExamsLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#FD4A32]/20 border-t-[#FD4A32] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Syncing campus placement mock drives...
          </p>
        </div>
      ) : displayedExams.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-2xl bg-gray-50/60 dark:bg-[#141517] border border-gray-200/80 dark:border-[#27292e] space-y-3 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FD4A32] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {activeTab === 'ACTIVE'
              ? 'No Active Mock Drives Right Now'
              : activeTab === 'COMPLETED'
              ? 'No Completed Assessments Found'
              : activeTab === 'UPCOMING'
              ? 'No Upcoming Drives Scheduled'
              : 'No Mock Exams Found'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {activeTab === 'ACTIVE'
              ? 'Great job! You have submitted all assigned drives, or your placement cell is preparing upcoming assessment schedules.'
              : activeTab === 'COMPLETED'
              ? 'Once you complete and submit an active mock drive, your performance scorecard and accuracy analytics will appear here.'
              : 'Keep practicing aptitude modules and company pattern blueprints while your college adds new recruitment rounds.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/companies"
              className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Browse Company Blueprints
            </Link>
            <Link
              to="/questions"
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#202226] text-gray-800 dark:text-gray-200 text-xs font-bold hover:bg-gray-200 dark:hover:bg-[#282a30] transition-colors"
            >
              Practice OA Papers
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedExams.map(exam => {
            const attempt = exam.attempt;
            const isSubmitted =
              attempt &&
              (attempt.status === 'SUBMITTED' ||
                attempt.status === 'TIMED_OUT' ||
                attempt.status === 'GRADED');
            const isInProgress = attempt && attempt.status === 'IN_PROGRESS';
            const isUpcoming = exam.start_time && new Date(exam.start_time) > now && !isSubmitted;

            const targetDepts = exam.target_departments?.length
              ? exam.target_departments.join(', ')
              : 'All Branches';

            const totalQuestions =
              exam.sections?.reduce((acc, s) => acc + (s.question_ids?.length || 0), 0) || 0;

            const isPassed = isSubmitted && (attempt.passed ?? (attempt.percentage >= (exam.passing_percentage || 50)));

            return (
              <div
                key={exam.id}
                className="bg-white dark:bg-[#141517] rounded-2xl border border-gray-200/80 dark:border-[#27292e] p-5 shadow-xs flex flex-col justify-between hover:border-[#FD4A32]/40 transition-all group relative overflow-hidden"
              >
                <div className="space-y-3.5">
                  {/* Company & Status Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20">
                      {exam.target_company}
                    </span>

                    {isSubmitted ? (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          isPassed
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-500" />
                        )}
                        <span>
                          {isPassed ? 'Passed' : 'Failed'} ({attempt.percentage}%)
                        </span>
                      </span>
                    ) : isInProgress ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>In Progress</span>
                      </span>
                    ) : isUpcoming ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-500" />
                        <span>Scheduled</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Active Drive</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug group-hover:text-[#FD4A32] transition-colors">
                      {exam.title}
                    </h3>
                    {exam.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {exam.description}
                      </p>
                    )}
                  </div>

                  {/* Exam Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-gray-50 dark:bg-[#1a1b1f] text-center border border-gray-100 dark:border-[#26282e]">
                    <div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase">Duration</div>
                      <div className="text-xs font-black text-gray-800 dark:text-gray-200 mt-0.5">
                        {exam.duration_minutes}m
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase">
                        {isSubmitted ? 'Your Score' : 'Total Marks'}
                      </div>
                      <div className="text-xs font-black text-gray-800 dark:text-gray-200 mt-0.5">
                        {isSubmitted ? (
                          <span className={isPassed ? 'text-emerald-600' : 'text-rose-600'}>
                            {attempt.total_score} / {attempt.max_possible_score || exam.total_marks}
                          </span>
                        ) : (
                          exam.total_marks
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase">Cutoff</div>
                      <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {exam.passing_percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Metadata line */}
                  <div className="space-y-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>
                        Sections: <strong>{exam.sections?.length || 1}</strong>
                        {totalQuestions > 0 && ` (${totalQuestions} Qs)`}
                      </span>
                      <span>
                        Branches: <strong>{targetDepts}</strong>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {exam.enable_tab_switch_detection ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                          <ShieldCheck className="w-3 h-3 text-[#FD4A32]" />
                          Anti-Cheat Proctoring
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">Standard Test</span>
                      )}

                      {isUpcoming && exam.start_time && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          Starts: {new Date(exam.start_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-gray-100 dark:border-[#27292e] mt-4 space-y-2">
                  {isSubmitted ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedScorecardExam(exam)}
                        className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-[#202226] hover:bg-gray-200 dark:hover:bg-[#282a30] text-gray-800 dark:text-gray-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                        <span>Scorecard</span>
                      </button>

                      <Link
                        to={`/exam/${exam.id}`}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Solutions →</span>
                      </Link>
                    </div>
                  ) : isInProgress ? (
                    <Link
                      to={`/exam/${exam.id}`}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Resume In-Progress →</span>
                    </Link>
                  ) : isUpcoming ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-[#1a1b1f] text-gray-400 dark:text-gray-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Scheduled — Opens Soon</span>
                    </button>
                  ) : (
                    <Link
                      to={`/exam/${exam.id}`}
                      className="w-full py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#FD4A32]/25 group-hover:scale-[1.01]"
                    >
                      <span>Take Mock Exam →</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── QUICK SCORECARD MODAL ── */}
      {selectedScorecardExam && selectedScorecardExam.attempt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="bg-white dark:bg-[#141517] rounded-3xl border border-gray-200 dark:border-[#27292e] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-7 space-y-6 animate-scaleIn"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#27292e] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FD4A32]/10 text-[#FD4A32]">
                  {selectedScorecardExam.target_company}
                </span>
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                  Assessment Scorecard
                </h3>
              </div>
              <button
                onClick={() => setSelectedScorecardExam(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#202226] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Exam Title */}
            <div>
              <h4 className="text-xl font-black text-gray-900 dark:text-white">
                {selectedScorecardExam.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {enrolledCollege?.name || 'Institutional Mock Assessment'}
              </p>
            </div>

            {/* Primary Score Banner */}
            <div
              className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                (selectedScorecardExam.attempt.passed ??
                selectedScorecardExam.attempt.percentage >= (selectedScorecardExam.passing_percentage || 50))
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                    (selectedScorecardExam.attempt.passed ??
                    selectedScorecardExam.attempt.percentage >= (selectedScorecardExam.passing_percentage || 50))
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {(selectedScorecardExam.attempt.passed ??
                  selectedScorecardExam.attempt.percentage >= (selectedScorecardExam.passing_percentage || 50)) ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <XCircle className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider">
                      {(selectedScorecardExam.attempt.passed ??
                      selectedScorecardExam.attempt.percentage >= (selectedScorecardExam.passing_percentage || 50))
                        ? 'Passed Assessment'
                        : 'Below Cutoff'}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                      (Cutoff: {selectedScorecardExam.passing_percentage}%)
                    </span>
                  </div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mt-0.5">
                    {selectedScorecardExam.attempt.percentage}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Total Score: <strong>{selectedScorecardExam.attempt.total_score}</strong> out of{' '}
                    <strong>
                      {selectedScorecardExam.attempt.max_possible_score || selectedScorecardExam.total_marks}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Placement Readiness Badge */}
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Readiness Caliber
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-black text-[#FD4A32] mt-0.5">
                  <Award className="w-4 h-4" />
                  {selectedScorecardExam.attempt.percentage >= 70
                    ? 'Day-1 Placement Ready'
                    : selectedScorecardExam.attempt.percentage >= 50
                    ? 'Near Industry Ready'
                    : 'Requires Remedial Prep'}
                </span>
              </div>
            </div>

            {/* Quick Metrics (Time Spent, Integrity, Total Attempted) */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-100 dark:border-[#27292e]">
                <div className="text-[10px] font-bold uppercase text-gray-400">Time Spent</div>
                <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
                  {Math.floor((selectedScorecardExam.attempt.time_spent_seconds || 0) / 60)}m{' '}
                  {(selectedScorecardExam.attempt.time_spent_seconds || 0) % 60}s
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-100 dark:border-[#27292e]">
                <div className="text-[10px] font-bold uppercase text-gray-400">Proctor Integrity</div>
                <div className="text-sm font-black mt-0.5">
                  {(selectedScorecardExam.attempt.tab_switch_count || 0) === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Clean (0 Switches)</span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">
                      {selectedScorecardExam.attempt.tab_switch_count} Tab Switches
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-100 dark:border-[#27292e]">
                <div className="text-[10px] font-bold uppercase text-gray-400">Submitted At</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white mt-1">
                  {selectedScorecardExam.attempt.submitted_at
                    ? new Date(selectedScorecardExam.attempt.submitted_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Recently'}
                </div>
              </div>
            </div>

            {/* Section Breakdown if available */}
            {selectedScorecardExam.attempt.result_summary?.sections &&
              selectedScorecardExam.attempt.result_summary.sections.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Section Performance Analysis
                  </h5>
                  <div className="border border-gray-200 dark:border-[#27292e] rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-[#1c1d22] text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold border-b border-gray-200 dark:border-[#27292e]">
                        <tr>
                          <th className="py-2.5 px-3">Section</th>
                          <th className="py-2.5 px-3 text-center">Attempted</th>
                          <th className="py-2.5 px-3 text-center">Accuracy</th>
                          <th className="py-2.5 px-3 text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-[#27292e]">
                        {selectedScorecardExam.attempt.result_summary.sections.map((sec, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-[#1a1b1f]">
                            <td className="py-2.5 px-3 font-bold text-gray-900 dark:text-white">
                              {sec.section_name}
                            </td>
                            <td className="py-2.5 px-3 text-center text-gray-600 dark:text-gray-400 font-mono">
                              {sec.attempted} / {sec.total_questions}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`font-bold font-mono ${
                                  sec.accuracy >= 70
                                    ? 'text-emerald-600'
                                    : sec.accuracy >= 50
                                    ? 'text-blue-600'
                                    : 'text-rose-600'
                                }`}
                              >
                                {sec.accuracy}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-black font-mono text-gray-900 dark:text-white">
                              {sec.score} / {sec.max_score}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-[#27292e]">
              <button
                onClick={() => setSelectedScorecardExam(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#27292e] text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-[#202226] transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const examId = selectedScorecardExam.id;
                  setSelectedScorecardExam(null);
                  navigate(`/exam/${examId}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-[#FD4A32]/25 cursor-pointer"
              >
                <span>View Full Question Solutions & Explanations →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
