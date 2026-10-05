import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  FileText,
  Printer,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Calendar,
  Building2,
  Award,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Code2,
  BookOpen,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { tpoService } from '@/services/tpo.service';
import type { StudentExamAttempt, MockExam, MockExamSection } from '@/types/tpo';
import QuestionRichContent from '@/components/QuestionRichContent';
import LogoLoader from '@/components/LogoLoader';

function parseCorrectAnswerIndex(raw: any): number {
  if (raw === undefined || raw === null) return -1;
  if (typeof raw === 'number') return raw;
  const str = String(raw).trim().toUpperCase();
  if (/^[A-Z]$/.test(str)) {
    return str.charCodeAt(0) - 65;
  }
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? -1 : parsed;
}

export default function StudentAnswerSheetPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    attempt: StudentExamAttempt;
    exam: MockExam;
    sections: Array<MockExamSection & { questions: any[] }>;
    isWindowLive?: boolean;
    examEndTime?: string;
  } | null>(null);

  // Filters & State
  const [selectedSectionId, setSelectedSectionId] = useState<string>('ALL');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ATTEMPTED' | 'INCORRECT' | 'SKIPPED' | 'CORRECT'>('ALL');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    let isMounted = true;
    setIsLoading(true);

    tpoService
      .getStudentAttemptAnswerSheet(attemptId)
      .then(res => {
        if (isMounted) {
          setData(res);
          // Expand all explanations by default for complete review
          if (res?.sections) {
            const initialExpanded: Record<string, boolean> = {};
            res.sections.forEach(sec => {
              (sec.questions || []).forEach(q => {
                initialExpanded[q.id] = true;
              });
            });
            setExpandedExplanations(initialExpanded);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load student answer sheet:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  const attempt = data?.attempt;
  const exam = data?.exam;
  const sections = data?.sections || [];
  const isWindowLive = data?.isWindowLive;

  // Flatten all questions with their parent section metadata
  const allEnrichedQuestions = useMemo(() => {
    const list: Array<{
      question: any;
      sectionName: string;
      sectionIndex: number;
      overallIndex: number;
    }> = [];

    let counter = 1;
    sections.forEach((sec, secIdx) => {
      (sec.questions || []).forEach(q => {
        list.push({
          question: q,
          sectionName: sec.name || `Section ${secIdx + 1}`,
          sectionIndex: secIdx,
          overallIndex: counter++,
        });
      });
    });

    return list;
  }, [sections]);

  // Filtered by section & status
  const filteredQuestions = useMemo(() => {
    return allEnrichedQuestions.filter(item => {
      // 1. Section Filter
      if (selectedSectionId !== 'ALL') {
        const sec = sections.find(s => (s.id || s.name) === selectedSectionId);
        if (sec && item.sectionName !== sec.name) return false;
      }

      // 2. Status Filter
      const q = item.question;
      if (activeFilter === 'ATTEMPTED') return q.is_answered;
      if (activeFilter === 'CORRECT') return q.is_correct;
      if (activeFilter === 'INCORRECT') return q.is_answered && !q.is_correct;
      if (activeFilter === 'SKIPPED') return !q.is_answered;

      return true;
    });
  }, [allEnrichedQuestions, selectedSectionId, activeFilter, sections]);

  // Aggregate Metrics
  const totalQuestions = allEnrichedQuestions.length;
  const correctCount = allEnrichedQuestions.filter(i => i.question.is_correct).length;
  const incorrectCount = allEnrichedQuestions.filter(i => i.question.is_answered && !i.question.is_correct).length;
  const skippedCount = allEnrichedQuestions.filter(i => !i.question.is_answered).length;
  const totalAttempted = correctCount + incorrectCount;
  const accuracyPercentage = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 1000) / 10 : 0;

  const toggleExplanation = (qId: string) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleCopyCode = (codeText: string, id: string) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const scrollToQuestion = (qId: string) => {
    const el = document.getElementById(`question-card-${qId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-4', 'ring-[#FD4A32]', 'transition-all');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-[#FD4A32]');
      }, 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <LogoLoader size="lg" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider animate-pulse">
            Compiling Verified Examination Answer Sheet &amp; Solutions...
          </p>
        </div>
      </div>
    );
  }

  // Anti-Leak Guard: Exam is still live in labs & immediate results disabled
  if (isWindowLive) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              Campus Recruitment Integrity Gate
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Answer Sheet Locked During Live Drive
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your test responses and timestamps have been safely recorded. To protect recruitment integrity while fellow candidates are testing across campus labs, the complete answer sheet and verified solutions will automatically unlock once this drive window concludes
              {data?.examEndTime && (
                <> on <strong className="text-slate-800 dark:text-slate-200">{new Date(data.examEndTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></>
              )}.
            </p>
          </div>

          {attempt && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center text-left">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Score</span>
                <strong className="text-slate-900 dark:text-white text-base font-mono">
                  {attempt.total_score} / {attempt.max_possible_score || 100}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Percentage</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-base font-mono">
                  {attempt.percentage}%
                </strong>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/student/exams')}
              className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
            >
              Return to Exams Portal
            </button>
            <button
              onClick={() => window.close()}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt || !exam) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Answer Sheet Not Found</h2>
          <p className="text-xs text-slate-500">The requested attempt could not be retrieved.</p>
          <button
            onClick={() => navigate('/student/exams')}
            className="px-5 py-2.5 rounded-xl bg-[#FD4A32] text-white text-xs font-bold uppercase"
          >
            Back to Mock Exams
          </button>
        </div>
      </div>
    );
  }

  const studentName = attempt.student?.name || attempt.student_email?.split('@')[0] || 'Candidate Student';
  const rollNumber = attempt.student?.roll_number && attempt.student.roll_number !== '—' ? attempt.student.roll_number : '—';
  const department = attempt.student?.department || 'Engineering / Campus Batch';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 selection:bg-[#FD4A32]/20">
      
      {/* ── TOP CONTROL BAR (HIDDEN IN PRINT) ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Back & Branding */}
          <div className="flex items-center gap-3">
            <Link
              to="/student/exams"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Return to Student Mock Exams Portal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Official Answer Sheet
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:inline">
                  • Verified Solution Audit
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {exam.title}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              title="Print official answer sheet or save as PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={() => window.close()}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 text-xs font-bold transition-colors cursor-pointer"
              title="Close this answer sheet tab"
            >
              Close
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* ── PRINT-ONLY OFFICIAL HEADER (VISIBLE IN PRINT ONLY) ── */}
        <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-black">
                PREPUNITE • CANDIDATE EXAMINATION ANSWER SHEET
              </h1>
              <p className="text-xs font-bold text-gray-700 uppercase">
                {exam.target_company} Placement Assessment • Official Evaluation Dossier
              </p>
            </div>
            <div className="text-right text-xs">
              <div><strong>Attempt ID:</strong> {attempt.id.slice(0, 8)}</div>
              <div><strong>Generated:</strong> {new Date().toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-xs border-t border-gray-300 pt-3">
            <div><strong>Candidate:</strong> {studentName}</div>
            <div><strong>Roll No:</strong> {rollNumber}</div>
            <div><strong>Department:</strong> {department}</div>
            <div><strong>Total Marks:</strong> {attempt.total_score} / {attempt.max_possible_score || exam.total_marks} ({attempt.percentage}%)</div>
          </div>
        </div>

        {/* ── CANDIDATE HERO SCORECARD ── */}
        <section className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Candidate & Exam Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20">
                  {exam.target_company}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  attempt.status === 'TERMINATED_MALPRACTICE'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    : attempt.passed
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}>
                  {attempt.status === 'TERMINATED_MALPRACTICE' ? 'Disqualified (Malpractice)' : attempt.passed ? 'Cleared Cutoff' : 'Needs Remedial Prep'}
                </span>
                {attempt.tab_switch_count === 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Zero Proctor Violations (Clean)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-500" />
                    {attempt.tab_switch_count} Tab Switches
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {exam.title}
                </h2>
                <div className="mt-1 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span>Candidate: <strong className="text-slate-900 dark:text-white">{studentName}</strong></span>
                  {rollNumber !== '—' && <span>Roll No: <strong className="text-slate-900 dark:text-white">{rollNumber}</strong></span>}
                  <span>Dept: <strong className="text-slate-900 dark:text-white">{department}</strong></span>
                  {attempt.submitted_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(attempt.submitted_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  {attempt.time_spent_seconds && (
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {Math.floor(attempt.time_spent_seconds / 60)}m {attempt.time_spent_seconds % 60}s spent
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Score Metrics Strip */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center min-w-[110px]">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Score</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white block mt-0.5">
                  {attempt.total_score}
                  <span className="text-xs text-slate-400 font-normal"> / {attempt.max_possible_score || exam.total_marks}</span>
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center min-w-[100px]">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Percentage</span>
                <span className={`text-2xl sm:text-3xl font-black font-mono block mt-0.5 ${
                  attempt.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {attempt.percentage}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center min-w-[100px]">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Accuracy</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-blue-400 block mt-0.5">
                  {accuracyPercentage}%
                </span>
              </div>
            </div>

          </div>

          {/* 4 Stat Badges Strip */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-slate-700 dark:text-slate-300">
                {totalQuestions}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Questions</span>
                <strong className="text-slate-800 dark:text-slate-200">{totalQuestions} Items</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Correct Answers</span>
                <strong className="text-emerald-700 dark:text-emerald-300 font-mono">{correctCount} Questions</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black">
                <X className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">Incorrect Answers</span>
                <strong className="text-rose-700 dark:text-rose-300 font-mono">{incorrectCount} Questions</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-slate-500">
                —
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Skipped / Unattempted</span>
                <strong className="text-slate-600 dark:text-slate-400 font-mono">{skippedCount} Questions</strong>
              </div>
            </div>
          </div>

        </section>

        {/* ── FILTER & SECTION NAVIGATION STRIP (HIDDEN IN PRINT) ── */}
        <section className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4 print:hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Section Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedSectionId('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedSectionId === 'ALL'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Sections ({totalQuestions})
              </button>
              {sections.map((sec, idx) => {
                const count = sec.questions?.length || 0;
                const secKey = sec.id || sec.name || `sec-${idx}`;
                const isSelected = selectedSectionId === secKey;
                return (
                  <button
                    key={secKey}
                    onClick={() => setSelectedSectionId(secKey)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{sec.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Status Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                All ({totalQuestions})
              </button>
              <button
                onClick={() => setActiveFilter('ATTEMPTED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'ATTEMPTED'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60'
                }`}
                title="View only questions you actually answered/written"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Written / Attempted ({totalAttempted})</span>
              </button>
              <button
                onClick={() => setActiveFilter('INCORRECT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'INCORRECT'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>Incorrect ({incorrectCount})</span>
              </button>
              <button
                onClick={() => setActiveFilter('SKIPPED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'SKIPPED'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60'
                }`}
              >
                <span>Skipped ({skippedCount})</span>
              </button>
              <button
                onClick={() => setActiveFilter('CORRECT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'CORRECT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Correct ({correctCount})</span>
              </button>
            </div>

          </div>

          {/* Quick Jump Palette Matrix (1..N) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Quick Jump Question Matrix:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {allEnrichedQuestions.map(item => {
                const q = item.question;
                const isSelectedSection = selectedSectionId === 'ALL' || item.sectionName === sections.find(s => (s.id || s.name) === selectedSectionId)?.name;
                if (!isSelectedSection) return null;

                return (
                  <button
                    key={q.id}
                    onClick={() => scrollToQuestion(q.id)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-black transition-all shrink-0 cursor-pointer flex items-center justify-center ${
                      q.is_correct
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:ring-2 hover:ring-emerald-500'
                        : q.is_answered
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:ring-2 hover:ring-rose-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:ring-2 hover:ring-slate-400'
                    }`}
                    title={`Question ${item.overallIndex} (${q.is_correct ? 'Correct' : q.is_answered ? 'Incorrect' : 'Skipped'})`}
                  >
                    {item.overallIndex}
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* ── QUESTION-BY-QUESTION ANSWER SHEET ── */}
        <section className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Questions Match Filter</h3>
              <p className="text-xs text-slate-400">Try changing the status filter or section filter above.</p>
              <button
                onClick={() => { setActiveFilter('ALL'); setSelectedSectionId('ALL'); }}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredQuestions.map(item => {
              const q = item.question;
              const isCoding = Boolean(q.isCodingProblem);
              const resp = q.student_response;
              const isExpanded = expandedExplanations[q.id] !== false;
              const options = q.options || [];

              return (
                <article
                  key={q.id}
                  id={`question-card-${q.id}`}
                  className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5 print:border-black print:shadow-none print:break-inside-avoid"
                >
                  
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-7 h-7 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black flex items-center justify-center shrink-0">
                        {item.overallIndex}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {item.sectionName}
                      </span>
                      {q.difficulty && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                          {q.difficulty}
                        </span>
                      )}
                      {isCoding && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1 font-mono">
                          <Code2 className="w-3 h-3" />
                          Coding Problem
                        </span>
                      )}
                    </div>

                    {/* Verdict & Marks Awarded Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 ${
                        q.is_correct
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : q.is_answered
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {q.is_correct ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Correct (+{q.marks_obtained ?? 1} {(q.marks_obtained ?? 1) === 1 ? 'Mark' : 'Marks'})</span>
                          </>
                        ) : q.is_answered ? (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span>Incorrect ({q.marks_obtained ?? 0} Marks)</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Skipped (0 Marks)</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Reading Passage Block (If Question has Passage Context) */}
                  {(q.passage || q.contextData || q.passageTitle) && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        <BookOpen className="w-4 h-4" />
                        <span>{q.passageTitle || 'Reading Comprehension & Passage Context'}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-h-60 print:max-h-none overflow-y-auto print:overflow-visible pr-2 leading-relaxed">
                        <QuestionRichContent content={q.passage || q.contextData} />
                      </div>
                    </div>
                  )}

                  {/* Question Statement */}
                  <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    <QuestionRichContent content={q.statement || q.description || ''} />
                  </div>

                  {/* ── CANDIDATE WRITTEN RESPONSE & OFFICIAL KEY VERDICT BANNER ── */}
                  {(() => {
                    const correctIdx = parseCorrectAnswerIndex(q.correct_answer);
                    return (
                      <div className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        q.is_correct
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : q.is_answered
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                          : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold">What You Written:</span>
                          {isCoding ? (
                            <span className="font-mono font-bold px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                              {resp?.code_solution ? `Submitted Code (${resp.test_cases_passed || 0}/${resp.total_test_cases || 0} Test Cases Passed)` : 'No Code Written'}
                            </span>
                          ) : resp?.selected_option !== null && resp?.selected_option !== undefined ? (
                            <span className={`font-mono font-black px-2.5 py-0.5 rounded-lg text-white shadow-2xs ${
                              q.is_correct ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}>
                              Option {String.fromCharCode(65 + Number(resp.selected_option))}
                            </span>
                          ) : (
                            <span className="italic text-slate-500 font-semibold">Not Attempted (Skipped)</span>
                          )}

                          {!isCoding && correctIdx >= 0 && (
                            <>
                              <span className="text-slate-400">•</span>
                              <span className="font-bold">Official Key:</span>
                              <span className="font-mono font-black px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white shadow-2xs">
                                Option {String.fromCharCode(65 + correctIdx)}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`font-black uppercase tracking-wider text-[11px] ${
                            q.is_correct ? 'text-emerald-700 dark:text-emerald-300' : q.is_answered ? 'text-rose-700 dark:text-rose-300' : 'text-slate-500'
                          }`}>
                            {q.is_correct ? '✓ Verified Correct' : q.is_answered ? '✕ Incorrect Response' : '— Unattempted'}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── MCQ OPTIONS LIST ── */}
                  {!isCoding && options.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Response &amp; Answer Key Audit:
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {options.map((opt: any, optIdx: number) => {
                          const optionLetter = String.fromCharCode(65 + optIdx);
                          const isStudentChoice = resp?.selected_option !== null && resp?.selected_option !== undefined && Number(resp.selected_option) === optIdx;
                          const correctIdx = parseCorrectAnswerIndex(q.correct_answer);
                          const isCorrectOption = correctIdx === optIdx;

                          // Determine background & borders
                          let containerStyle = 'bg-slate-50/80 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                          let badgeContent = null;

                          if (isStudentChoice && isCorrectOption) {
                            // Perfect choice!
                            containerStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs';
                            badgeContent = (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Your Correct Choice</span>
                              </span>
                            );
                          } else if (isStudentChoice && !isCorrectOption) {
                            // Incorrect student choice!
                            containerStyle = 'bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-950 dark:text-rose-100 font-bold shadow-xs';
                            badgeContent = (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shrink-0">
                                <X className="w-3 h-3 stroke-[3]" />
                                <span>Your Choice (Incorrect)</span>
                              </span>
                            );
                          } else if (isCorrectOption) {
                            // The true correct option (when candidate missed it or skipped)
                            containerStyle = 'bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                            badgeContent = (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Official Correct Answer</span>
                              </span>
                            );
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${containerStyle}`}
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                                  isStudentChoice && isCorrectOption
                                    ? 'bg-emerald-600 text-white'
                                    : isStudentChoice && !isCorrectOption
                                    ? 'bg-rose-600 text-white'
                                    : isCorrectOption
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}>
                                  {optionLetter}
                                </span>
                                <div className="text-xs sm:text-sm pt-0.5 leading-relaxed flex-1">
                                  <QuestionRichContent content={typeof opt === 'string' ? opt : (opt.text || opt.statement || '')} isOption />
                                </div>
                              </div>

                              {badgeContent}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explicit unattempted banner if candidate skipped */}
                      {!q.is_answered && (
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>You did not attempt this question during the exam. The official correct answer is marked with a dashed green border above.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── HANDS-ON CODING SOLUTION AUDIT ── */}
                  {isCoding && (
                    <div className="space-y-4 pt-1">
                      
                      {/* Candidate Submitted Code */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-purple-500" />
                            <span>Your Submitted Code Solution:</span>
                          </span>
                          {resp?.code_solution && (
                            <button
                              onClick={() => handleCopyCode(resp.code_solution, `code-${q.id}`)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                            >
                              {copiedCodeId === `code-${q.id}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Code</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {resp?.code_solution ? (
                          <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto print:overflow-visible print:whitespace-pre-wrap border border-slate-800">
                            <code>{resp.code_solution}</code>
                          </pre>
                        ) : (
                          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-400 italic">
                            No code was submitted for this problem.
                          </div>
                        )}
                      </div>

                      {/* Test Case Evaluation Results */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 uppercase font-bold text-[10px]">Test Case Evaluation:</span>
                          <strong className={`font-mono text-sm ${
                            q.is_correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            Passed {resp?.test_cases_passed || 0} of {resp?.total_test_cases || q.test_cases?.length || 0} Test Cases
                          </strong>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          q.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {q.is_correct ? 'All Test Cases Cleared' : 'Partial / Failed Test Cases'}
                        </span>
                      </div>

                      {/* Model Reference Solution (If Available) */}
                      {q.solutions && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-900/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Model Reference Solution:</span>
                            </span>
                          </div>
                          {typeof q.solutions === 'string' ? (
                            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto print:overflow-visible print:whitespace-pre-wrap border border-slate-800">
                              <code>{q.solutions}</code>
                            </pre>
                          ) : typeof q.solutions === 'object' ? (
                            <div className="space-y-3">
                              {Object.entries(q.solutions)
                                .filter(([k, v]) => Boolean(v && typeof v === 'string' && !['leetcodeUrl', 'leetcodeNumber', 'pattern', 'keyIntuition'].includes(k)))
                                .map(([lang, code]) => (
                                  <div key={lang} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300">
                                        {lang}
                                      </span>
                                      <button
                                        onClick={() => handleCopyCode(code as string, `ref-${q.id}-${lang}`)}
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors print:hidden cursor-pointer"
                                      >
                                        {copiedCodeId === `ref-${q.id}-${lang}` ? (
                                          <>
                                            <Check className="w-3 h-3 text-emerald-500" />
                                            <span className="text-emerald-500">Copied</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3 h-3" />
                                            <span>Copy {lang}</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto print:overflow-visible print:whitespace-pre-wrap border border-slate-800">
                                      <code>{code as string}</code>
                                    </pre>
                                  </div>
                                ))}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── STEP-BY-STEP PEDAGOGICAL EXPLANATION CARD ── */}
                  {(q.explanation || q.structured_explanation) && (
                    <div className="pt-2">
                      <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 overflow-hidden">
                        
                        {/* Toggle Header */}
                        <button
                          type="button"
                          onClick={() => toggleExplanation(q.id)}
                          className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                              💡
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300">
                              Official Solution &amp; Pedagogical Explanation
                            </span>
                          </div>
                          <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-bold print:hidden">
                            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </button>

                        {/* Explanation Content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border-t border-blue-200/50 dark:border-blue-900/30 pt-3 leading-relaxed">
                            <QuestionRichContent
                              content={
                                typeof q.structured_explanation === 'string'
                                  ? q.structured_explanation
                                  : q.structured_explanation?.solution || q.structured_explanation?.explanation || q.explanation || ''
                              }
                            />
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                </article>
              );
            })
          )}
        </section>

        {/* ── FOOTER ACTIONS (HIDDEN IN PRINT) ── */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <Link
            to="/student/exams"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity text-center"
          >
            ← Back to Mock Exams Portal
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer"
          >
            Scroll to Top ↑
          </button>
        </div>

      </main>

    </div>
  );
}
