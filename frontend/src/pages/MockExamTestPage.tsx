import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Maximize2,
  Flag,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Send,
  Loader2,
  ShieldAlert,
  Award,
  Building2,
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { tpoService } from '@/services/tpo.service';
import type {
  MockExam,
  MockExamSection,
  StudentExamAttempt,
  StudentExamResponse,
  ProctorEvent,
} from '@/types/tpo';

export default function MockExamTestPage() {
  const { examId } = useParams<{ examId: string }>();
  const { user, isAdmin, isTpoAdmin } = useAuth();
  const navigate = useNavigate();

  // Test Lifecycle: 'INSTRUCTIONS' | 'IN_PROGRESS' | 'SUBMITTED'
  const [testPhase, setTestPhase] = useState<'INSTRUCTIONS' | 'IN_PROGRESS' | 'SUBMITTED'>('INSTRUCTIONS');

  // Fetch Exam configuration
  const { data: exam, isLoading: examLoading } = useQuery<MockExam | null>({
    queryKey: ['candidate-mock-exam', examId],
    queryFn: () => (examId ? tpoService.getMockExamById(examId) : null),
    enabled: !!examId,
  });

  // Fetch College Details if exam belongs to an institution
  const { data: examCollege } = useQuery({
    queryKey: ['candidate-exam-college', exam?.college_id],
    queryFn: () => (exam?.college_id ? tpoService.getCollegeDetails(exam.college_id) : null),
    enabled: !!exam?.college_id,
  });

  // 🛡️ Candidate Institutional Enrollment Verification
  const isSuperAdmin = isAdmin || isSuperAdminEmail(user?.email);
  const studentEntitlement = tpoService.getStudentEntitlementInfo(user?.email);
  const userCollegeId =
    user?.collegeId ||
    studentEntitlement?.collegeId ||
    (typeof window !== 'undefined' ? localStorage.getItem('prepunite_college_id') : '') ||
    '';
  const tpoAuth = tpoService.findTpoAuthByEmail(user?.email);

  // Live cloud enrollment verification query if local state has not hydrated
  const { data: dbEnrollmentVerified = false } = useQuery({
    queryKey: ['candidate-enrollment-check', user?.email, exam?.college_id],
    queryFn: async () => {
      if (!user?.email || !exam?.college_id) return false;
      const cleanEmail = user.email.trim().toLowerCase();
      try {
        const { data: sub } = await supabase
          .from('user_subscriptions')
          .select('id')
          .eq('user_email', cleanEmail)
          .ilike('payment_id', `B2B_CAMPUS_${exam.college_id}%`)
          .eq('status', 'ACTIVE')
          .gt('expires_at', new Date().toISOString())
          .limit(1)
          .maybeSingle();
        if (sub) return true;
      } catch {}

      try {
        const { data: cs } = await supabase
          .from('college_students')
          .select('id')
          .eq('email', cleanEmail)
          .eq('college_id', exam.college_id)
          .limit(1)
          .maybeSingle();
        if (cs) return true;
      } catch {}

      return false;
    },
    enabled: !!user?.email && !!exam?.college_id,
    staleTime: 60 * 1000,
  });

  const isCollegeTpo = isTpoAdmin && (user?.collegeId === exam?.college_id || tpoAuth?.college_id === exam?.college_id);
  const isEnrolledStudent = Boolean(
    exam?.college_id && (dbEnrollmentVerified || user?.collegeId === exam.college_id)
  );
  const isAuthorizedCandidate = !exam?.college_id || isSuperAdmin || isCollegeTpo || isEnrolledStudent;

  // Fetch Existing Candidate Attempt
  const { data: existingAttempt } = useQuery<StudentExamAttempt | null>({
    queryKey: ['candidate-existing-attempt', examId, user?.email || user?.id],
    queryFn: () =>
      examId && (user?.email || user?.id)
        ? tpoService.getStudentAttemptForExam(examId, user?.email || user?.id || '')
        : null,
    enabled: !!examId && !!(user?.email || user?.id),
  });

  // State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsMap, setQuestionsMap] = useState<Record<string, any>>({});
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [showReviewAnswers, setShowReviewAnswers] = useState(false);

  // Responses Map: { [questionId]: { selected_option: number | null, marked_review: boolean, time_spent_sec: number } }
  const [responses, setResponses] = useState<Record<string, StudentExamResponse>>({});
  const [attemptId, setAttemptId] = useState<string>('');
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Anti-Cheat Proctoring State
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const tabSwitchCountRef = useRef<number>(0);
  const lastViolationTimeRef = useRef<number>(0);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [proctorEvents, setProctorEvents] = useState<ProctorEvent[]>([]);
  const [isMalpracticeTerminated, setIsMalpracticeTerminated] = useState<boolean>(false);

  // Submission Modal & Final Result
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalGradedAttempt, setFinalGradedAttempt] = useState<StudentExamAttempt | null>(null);

  // Sync ref to avoid stale closures in interval
  const syncRef = useRef<{
    attemptId: string;
    responses: Record<string, StudentExamResponse>;
    timeSpent: number;
    tabSwitches: number;
    events: ProctorEvent[];
  }>({
    attemptId: '',
    responses: {},
    timeSpent: 0,
    tabSwitches: 0,
    events: [],
  });

  syncRef.current = {
    attemptId,
    responses,
    timeSpent: timeSpentSeconds,
    tabSwitches: tabSwitchCountRef.current,
    events: proctorEvents,
  };

  // Automatically restore completed attempt or in-progress session on load
  useEffect(() => {
    if (!existingAttempt) return;

    if (
      existingAttempt.status === 'SUBMITTED' ||
      existingAttempt.status === 'TIMED_OUT' ||
      existingAttempt.status === 'TERMINATED_MALPRACTICE'
    ) {
      setAttemptId(existingAttempt.id);
      setFinalGradedAttempt(existingAttempt);
      setResponses(existingAttempt.responses || {});
      const count = existingAttempt.tab_switch_count || 0;
      tabSwitchCountRef.current = count;
      setTabSwitchCount(count);
      setTestPhase('SUBMITTED');
    } else if (existingAttempt.status === 'IN_PROGRESS' && testPhase === 'INSTRUCTIONS') {
      setAttemptId(existingAttempt.id);
      setResponses(existingAttempt.responses || {});
      const count = existingAttempt.tab_switch_count || 0;
      tabSwitchCountRef.current = count;
      setTabSwitchCount(count);
      setProctorEvents(existingAttempt.proctor_events || []);
      const totalSec = (exam?.duration_minutes || 90) * 60;
      const spent = existingAttempt.time_spent_seconds || 0;
      setTimeSpentSeconds(spent);
      setTimeRemainingSeconds(Math.max(0, totalSec - spent));
    }
  }, [existingAttempt, exam]);

  // 1. Fetch Questions for this Exam
  useEffect(() => {
    if (!exam || !exam.sections) return;
    const allQIds = exam.sections.flatMap(s => s.question_ids);
    if (allQIds.length === 0) return;

    setQuestionsLoading(true);
    tpoService.getQuestionsForExam(allQIds).then(questions => {
      const map: Record<string, any> = {};
      questions.forEach(q => {
        map[q.id] = q;
      });
      setQuestionsMap(map);
      setQuestionsLoading(false);
    });
  }, [exam]);

  // 1b. Fetch Full Solutions & Explanations post-submission (Zero answers during active test)
  useEffect(() => {
    if (testPhase !== 'SUBMITTED' || !attemptId) return;

    tpoService.getAttemptResultWithReview(attemptId).then(res => {
      if (res && res.questions && res.questions.length > 0) {
        setQuestionsMap(prev => {
          const updated = { ...prev };
          res.questions.forEach((q: any) => {
            updated[q.id] = {
              ...(updated[q.id] || {}),
              ...q,
            };
          });
          return updated;
        });
        if (res.attempt) {
          setFinalGradedAttempt(prev => (prev ? { ...prev, ...res.attempt } : res.attempt));
        }
      }
    });
  }, [testPhase, attemptId]);

  // Current Section & its Questions
  const currentSection: MockExamSection | undefined = exam?.sections?.[currentSectionIndex];
  const currentSectionQIds = currentSection?.question_ids || [];
  const currentQuestionId = currentSectionQIds[currentQuestionIndex];
  const currentQuestion = questionsMap[currentQuestionId];

  // 2. Start Exam Handler
  const handleStartExam = async (forceFresh = false) => {
    if (!exam || !user) return;

    if (!isAuthorizedCandidate) {
      alert(`Access Restricted: This assessment is reserved exclusively for students of ${examCollege?.name || exam.college_id}.`);
      return;
    }

    try {
      // Enter Fullscreen if required
      if (exam.enable_fullscreen_lock && document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (e) {
          console.warn('Fullscreen request bypassed or denied:', e);
        }
      }

      if (forceFresh) {
        setResponses({});
        setProctorEvents([]);
        setTabSwitchCount(0);
        setTimeSpentSeconds(0);
        setTimeRemainingSeconds(exam.duration_minutes * 60);
      }

      // Initialize or resume attempt in Supabase & local storage
      const candidateIdentifier = user.email || user.id;
      const attempt = await tpoService.startOrResumeAttempt(
        exam.id,
        candidateIdentifier,
        exam.college_id
      );

      setAttemptId(attempt.id);
      if (!forceFresh && attempt.time_spent_seconds) {
        setTimeSpentSeconds(attempt.time_spent_seconds);
        setTimeRemainingSeconds(Math.max(0, exam.duration_minutes * 60 - attempt.time_spent_seconds));
        if (attempt.responses) setResponses(attempt.responses);
      } else {
        setTimeRemainingSeconds(exam.duration_minutes * 60);
      }
      setTestPhase('IN_PROGRESS');
    } catch (err: any) {
      alert(`Could not start exam: ${err.message}`);
    }
  };

  // 3. Finalize & Submit Attempt
  const handleFinalSubmit = useCallback(
    async (statusOverride?: 'SUBMITTED' | 'TERMINATED_MALPRACTICE' | 'TIMED_OUT') => {
      if (!exam || !attemptId) return;

      setIsSubmitting(true);
      try {
        const graded = await tpoService.submitAttempt(
          attemptId,
          exam,
          responses,
          timeSpentSeconds,
          proctorEvents,
          tabSwitchCount,
          statusOverride
        );

        if (document.fullscreenElement && document.exitFullscreen) {
          try {
            await document.exitFullscreen();
          } catch {}
        }

        setFinalGradedAttempt(graded);
        setTestPhase('SUBMITTED');
      } catch (err: any) {
        alert(`Submission error: ${err.message}`);
      } finally {
        setIsSubmitting(false);
        setShowSubmitConfirm(false);
      }
    },
    [exam, attemptId, responses, timeSpentSeconds, proctorEvents, tabSwitchCount]
  );

  // 4. Timer Countdown & Auto-Sync Hook
  useEffect(() => {
    if (testPhase !== 'IN_PROGRESS') return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit('TIMED_OUT');
          return 0;
        }
        return prev - 1;
      });

      setTimeSpentSeconds(prev => prev + 1);
    }, 1000);

    // Auto-save every 15 seconds
    const syncInterval = setInterval(() => {
      const { attemptId: aId, responses: resp, timeSpent, tabSwitches, events } = syncRef.current;
      if (aId) {
        tpoService.syncAttemptProgress(aId, {
          responses: resp,
          timeSpentSeconds: timeSpent,
          tabSwitchCount: tabSwitches,
          proctorEvents: events,
        });
      }
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(syncInterval);
    };
  }, [testPhase, handleFinalSubmit]);

  // 5. Anti-Cheat Watchdog (Tab Switch & Fullscreen Exit Detection)
  useEffect(() => {
    if (testPhase !== 'IN_PROGRESS' || !exam?.enable_tab_switch_detection) return;

    const handleViolation = (type: ProctorEvent['type']) => {
      const now = Date.now();
      // 🛡️ Debounce Guard: Ignore concurrent window.blur, visibilitychange, or fullscreen events within 1,500ms
      if (now - lastViolationTimeRef.current < 1500) {
        return;
      }
      lastViolationTimeRef.current = now;

      const maxAllowed = exam.max_tab_switches_allowed || 3;
      tabSwitchCountRef.current += 1;
      const nextCount = tabSwitchCountRef.current;
      setTabSwitchCount(nextCount);

      const newEvent: ProctorEvent = {
        timestamp: new Date().toISOString(),
        type,
        details: `Violation ${nextCount} of ${maxAllowed}`,
      };
      setProctorEvents(prev => [...prev, newEvent]);

      if (nextCount >= maxAllowed) {
        setIsMalpracticeTerminated(true);
        handleFinalSubmit('TERMINATED_MALPRACTICE');
      } else {
        setShowWarningModal(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation('TAB_SWITCH');
      }
    };

    const handleWindowBlur = () => {
      handleViolation('BLUR');
    };

    const handleFullscreenChange = () => {
      if (exam.enable_fullscreen_lock && !document.fullscreenElement) {
        handleViolation('FULLSCREEN_EXIT');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [testPhase, exam, handleFinalSubmit]);

  // Helper: Format Seconds to HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const hrs = Math.floor(mins / 60);
    const displayMins = mins % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Response Update Handlers
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestionId) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestionId]: {
        selected_option: optionIndex,
        marked_review: prev[currentQuestionId]?.marked_review || false,
        time_spent_sec: (prev[currentQuestionId]?.time_spent_sec || 0) + 1,
      },
    }));
  };

  const handleClearResponse = () => {
    if (!currentQuestionId) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestionId]: {
        selected_option: null,
        marked_review: prev[currentQuestionId]?.marked_review || false,
        time_spent_sec: prev[currentQuestionId]?.time_spent_sec || 0,
      },
    }));
  };

  const handleToggleReview = () => {
    if (!currentQuestionId) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestionId]: {
        selected_option: prev[currentQuestionId]?.selected_option ?? null,
        marked_review: !prev[currentQuestionId]?.marked_review,
        time_spent_sec: prev[currentQuestionId]?.time_spent_sec || 0,
      },
    }));
  };

  // ==========================================
  // VIEW 1: INSTRUCTIONS SCREEN
  // ==========================================
  if (testPhase === 'INSTRUCTIONS') {
    if (examLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FD4A32]" />
        </div>
      );
    }

    if (!exam) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold">Exam Not Found</h2>
          <p className="text-xs text-gray-500 mt-1">Please check the link provided by your college TPO.</p>
        </div>
      );
    }

    // 🛡️ Candidate Institutional Enrollment Guard: Restrict access to students of this college
    if (!isAuthorizedCandidate && exam) {
      const institutionName = examCollege?.name || exam.college_id;
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1013] flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-[#18191c] rounded-3xl p-6 sm:p-8 border border-rose-200 dark:border-rose-900/50 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-[11px] font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                Institutional Drive Restricted
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Access Restricted to {institutionName}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                This mock placement assessment (<strong>{exam.title}</strong>) was commissioned exclusively for verified students enrolled under <strong>{institutionName}</strong>.
              </p>
              <div className="p-3 bg-gray-50 dark:bg-[#202226] rounded-xl text-[11px] text-gray-500 dark:text-gray-400 text-left space-y-1">
                <div>Account: <strong className="text-gray-800 dark:text-gray-200">{user?.email}</strong></div>
                <div>Campus Status: <span className="text-rose-600 dark:text-rose-400 font-bold">Not enrolled in {institutionName}</span></div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-200 dark:border-gray-800">
                  If you are a student of this campus, please ask your College TPO to add your email to the placement roster.
                </div>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      );
    }

    const totalQuestions = (exam.sections || []).reduce((acc, s) => acc + s.question_ids.length, 0);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1012] p-4 sm:p-8 flex items-center justify-center animate-fadeIn">
        <div className="bg-white dark:bg-[#151618] border border-gray-200 dark:border-[#25262a] max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="space-y-2 text-center">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FD4A32]/10 text-[#FD4A32]">
              {exam.target_company} Placement Assessment
            </span>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {exam.title}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Candidate: <strong>{user?.name}</strong> • Roll No: <strong>{user?.rollNumber || 'Not set'}</strong> • Dept: <strong>{user?.department || 'General'}</strong>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#1e1f23] rounded-2xl text-center border border-gray-200 dark:border-[#2e3035]">
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase">Duration</div>
              <div className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{exam.duration_minutes} Mins</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase">Total Questions</div>
              <div className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{totalQuestions}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase">Passing Cutoff</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{exam.passing_percentage}%</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Assessment Guidelines</h3>
            <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-[#FD4A32]/5 border border-orange-200/60 dark:border-[#FD4A32]/20 space-y-2 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FD4A32] shrink-0 mt-0.5" />
                <span>Questions are pooled from company memory papers. Each question has single choice options.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FD4A32] shrink-0 mt-0.5" />
                <span>Your responses are auto-saved in real-time. If connection drops, progress is safely retained.</span>
              </div>
              {exam.enable_tab_switch_detection && (
                <div className="flex items-start gap-2 text-rose-700 dark:text-rose-400 font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Anti-Cheat Watchdog Enabled:</strong> Exiting fullscreen, minimizing browser, or opening tabs will trigger warnings. Maximum {exam.max_tab_switches_allowed} tab switches allowed before automatic termination!
                  </span>
                </div>
              )}
            </div>
          </div>

          {existingAttempt?.status === 'IN_PROGRESS' && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span>You have a saved test session in progress.</span>
              <span className="font-mono font-bold">{formatTime(timeRemainingSeconds)} remaining</span>
            </div>
          )}

          <button
            onClick={() => handleStartExam(false)}
            disabled={questionsLoading}
            className="w-full py-3.5 rounded-2xl bg-[#FD4A32] hover:bg-[#e03f29] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#FD4A32]/25 flex items-center justify-center gap-2"
          >
            {questionsLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing Question Palette...
              </>
            ) : existingAttempt?.status === 'IN_PROGRESS' ? (
              <>
                <Clock className="w-4 h-4" />
                Resume In-Progress Exam ({formatTime(timeRemainingSeconds)})
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                I Understand — Start Fullscreen Exam
              </>
            )}
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE TEST ENVIRONMENT
  // ==========================================
  if (testPhase === 'IN_PROGRESS') {
    const isLastSection = currentSectionIndex === (exam?.sections?.length || 1) - 1;
    const isLastQuestionInSection = currentQuestionIndex === currentSectionQIds.length - 1;

    const totalAnsweredCount = Object.values(responses).filter(r => r.selected_option !== null).length;
    const allExamQIds = (exam?.sections || []).flatMap(s => s.question_ids);

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#0f1012] text-gray-900 dark:text-white flex flex-col select-none">
        
        {/* Anti-Cheat Tab Switch Warning Modal */}
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#1a1b1e] border-2 border-rose-500 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-rose-600 dark:text-rose-400">
                PROCTOR ALERT: TAB SWITCH DETECTED
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                You switched away from the examination screen. This incident has been logged.
              </p>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300">
                Violation {tabSwitchCount} of {exam?.max_tab_switches_allowed}.<br />
                Remaining allowed switches: {(exam?.max_tab_switches_allowed || 3) - tabSwitchCount}.
              </div>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider"
              >
                Return to Exam Immediately
              </button>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#2e3035] rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Submit Assessment?
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-[#202225] rounded-xl text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <strong>{allExamQIds.length}</strong>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Questions Answered:</span>
                  <strong>{totalAnsweredCount}</strong>
                </div>
                <div className="flex justify-between text-rose-500 font-bold">
                  <span>Unanswered Questions:</span>
                  <strong>{allExamQIds.length - totalAnsweredCount}</strong>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Once submitted, you cannot change your answers. Are you sure you want to finish?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  Back to Test
                </button>
                <button
                  onClick={() => handleFinalSubmit('SUBMITTED')}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider"
                >
                  {isSubmitting ? 'Grading...' : 'Yes, Submit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Sticky Test Bar */}
        <div className="sticky top-0 z-20 bg-white dark:bg-[#151618] border-b border-gray-200 dark:border-[#25262a] px-4 py-3 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FD4A32]">
              {exam?.target_company}
            </span>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
              {exam?.title}
            </h2>
          </div>

          {/* Section Selector Tabs */}
          <div className="hidden md:flex items-center gap-2">
            {(exam?.sections || []).map((sec, idx) => (
              <button
                key={sec.id || idx}
                onClick={() => {
                  setCurrentSectionIndex(idx);
                  setCurrentQuestionIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentSectionIndex === idx
                    ? 'bg-[#FD4A32] text-white'
                    : 'bg-gray-100 dark:bg-[#202225] text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {sec.name} ({sec.question_ids.length})
              </button>
            ))}
          </div>

          {/* Timer & Finish Button */}
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-black tracking-wider ${
                timeRemainingSeconds < 300
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'bg-gray-100 dark:bg-[#202225] text-gray-800 dark:text-gray-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeRemainingSeconds)}
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Submit
            </button>
          </div>
        </div>

        {/* Test Body: Main Area + Question Palette */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Question Card Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* Section Banner on Mobile */}
            <div className="md:hidden flex items-center justify-between bg-white dark:bg-[#151618] p-3 rounded-xl border border-gray-200 dark:border-[#25262a] text-xs">
              <span className="font-bold text-[#FD4A32]">{currentSection?.name}</span>
              <span className="text-gray-400">
                Q {currentQuestionIndex + 1} of {currentSectionQIds.length}
              </span>
            </div>

            {currentQuestion ? (
              <div className="bg-white dark:bg-[#151618] rounded-2xl p-6 border border-gray-200 dark:border-[#25262a] shadow-sm space-y-6">
                
                {/* Question Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#25262a] pb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold">
                      +{currentSection?.marks_per_correct || 1} Marks
                    </span>
                    {(currentSection?.negative_marking || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 font-bold">
                        -{currentSection?.negative_marking} Penalty
                      </span>
                    )}
                  </div>
                </div>

                {/* Statement */}
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line font-sans">
                  {currentQuestion.statement}
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {(currentQuestion.options || []).map((optText: string, oIdx: number) => {
                    const isSelected = responses[currentQuestionId]?.selected_option === oIdx;
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 text-xs ${
                          isSelected
                            ? 'border-[#FD4A32] bg-[#FD4A32]/5 text-gray-900 dark:text-white font-semibold ring-1 ring-[#FD4A32]'
                            : 'border-gray-200 dark:border-[#25262a] hover:border-gray-300 dark:hover:border-[#383a40] bg-gray-50/50 dark:bg-[#1c1d20]'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-[#FD4A32] text-white'
                              : 'bg-gray-200 dark:bg-[#2b2d31] text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="mt-0.5">{optText}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Question Controls */}
                <div className="pt-4 border-t border-gray-100 dark:border-[#25262a] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleReview}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        responses[currentQuestionId]?.marked_review
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      {responses[currentQuestionId]?.marked_review ? 'Marked for Review' : 'Mark for Review'}
                    </button>

                    <button
                      onClick={handleClearResponse}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#383a40] disabled:opacity-40 text-xs font-bold text-gray-700 dark:text-gray-300"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
                      Prev
                    </button>

                    <button
                      onClick={() => {
                        if (!isLastQuestionInSection) {
                          setCurrentQuestionIndex(prev => prev + 1);
                        } else if (!isLastSection) {
                          setCurrentSectionIndex(prev => prev + 1);
                          setCurrentQuestionIndex(0);
                        } else {
                          setShowSubmitConfirm(true);
                        }
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold transition-all flex items-center gap-1"
                    >
                      {isLastQuestionInSection && isLastSection ? 'Review & Finish' : 'Next'}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-400">Loading question content...</div>
            )}
          </div>

          {/* Right Question Palette (Desktop & Drawer) */}
          <div className="w-full md:w-80 bg-white dark:bg-[#151618] border-t md:border-t-0 md:border-l border-gray-200 dark:border-[#25262a] p-4 flex flex-col space-y-4">
            
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Question Status Palette
              </h4>
              <p className="text-[11px] text-gray-400">{currentSection?.name}</p>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" /> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-600" /> Marked Review
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-orange-500" /> Not Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gray-200 dark:bg-[#2b2d31]" /> Not Visited
              </div>
            </div>

            {/* Question Buttons Grid */}
            <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-72 p-1">
              {currentSectionQIds.map((qId, idx) => {
                const resp = responses[qId];
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = resp && resp.selected_option !== null;
                const isMarked = resp && resp.marked_review;

                let colorClasses = 'bg-gray-100 dark:bg-[#202225] text-gray-700 dark:text-gray-300';
                if (isMarked) {
                  colorClasses = 'bg-purple-600 text-white';
                } else if (isAnswered) {
                  colorClasses = 'bg-emerald-500 text-white';
                }

                return (
                  <button
                    key={qId}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg font-bold text-xs transition-all flex items-center justify-center ${colorClasses} ${
                      isCurrent ? 'ring-2 ring-[#FD4A32] scale-105 shadow-md' : 'hover:opacity-90'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 3: POST-TEST SCORECARD & RESULT
  // ==========================================
  if (testPhase === 'SUBMITTED') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1012] p-4 sm:p-8 flex items-center justify-center animate-fadeIn">
        <div className="bg-white dark:bg-[#151618] border border-gray-200 dark:border-[#25262a] max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          
          {finalGradedAttempt?.status === 'TERMINATED_MALPRACTICE' ? (
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
          )}

          <div className="space-y-1">
            {finalGradedAttempt?.status === 'TERMINATED_MALPRACTICE' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                Disqualified for Proctoring Violations
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                Assessment Submitted
              </span>
            )}
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {exam?.title}
            </h2>
            <p className="text-xs text-gray-500">
              {finalGradedAttempt?.status === 'TERMINATED_MALPRACTICE'
                ? 'Your assessment was auto-submitted due to exceeding allowed window/tab switch limits.'
                : 'Your test session has been recorded and submitted to your college Placement Cell.'}
            </p>
          </div>

          {/* Scorecard Box */}
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1c1d20] border border-gray-200 dark:border-[#2e3035] grid grid-cols-3 gap-3">
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase">Score</div>
              <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                {finalGradedAttempt?.total_score || 0} / {finalGradedAttempt?.max_possible_score || exam?.total_marks}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase">Percentage</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {finalGradedAttempt?.percentage || 0}%
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase">Result</div>
              <div
                className={`text-lg font-black mt-1 ${
                  finalGradedAttempt?.status === 'TERMINATED_MALPRACTICE'
                    ? 'text-rose-600 dark:text-rose-400'
                    : finalGradedAttempt?.passed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {finalGradedAttempt?.status === 'TERMINATED_MALPRACTICE'
                  ? 'DISQUALIFIED'
                  : finalGradedAttempt?.passed
                  ? 'CLEARED'
                  : 'NEEDS PREP'}
              </div>
            </div>
          </div>

          {/* Anti-Cheat Summary */}
          <div
            className={`p-3 rounded-xl text-xs border ${
              tabSwitchCount > 0
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300'
                : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-300'
            }`}
          >
            {tabSwitchCount === 0 ? (
              <span className="font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Zero Proctor Violations (Clean Verified Submission)
              </span>
            ) : (
              <span>Logged {tabSwitchCount} window/tab switch events during test session.</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {exam?.show_results_immediately !== false ? (
              <button
                onClick={() => setShowReviewAnswers(prev => !prev)}
                className="flex-1 py-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider transition-all border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showReviewAnswers ? 'Hide Answer Key' : 'Review Questions & Solutions'}</span>
              </button>
            ) : (
              <div className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800/50 text-gray-500 text-xs font-semibold flex items-center justify-center gap-1.5">
                <span>Solutions scheduled for release by TPO after drive closes</span>
              </div>
            )}

            <button
              onClick={() => {
                if (confirm('Retake this assessment for practice? This will start a fresh session.')) {
                  handleStartExam(true);
                }
              }}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Exam (Practice)</span>
            </button>
          </div>

          {/* Question Review Section */}
          {showReviewAnswers && (
            <div className="text-left space-y-4 pt-4 border-t border-gray-200 dark:border-[#25262a] max-h-96 overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Detailed Solution Key
                </h4>
                <span className="text-[11px] text-gray-400">
                  {Object.keys(responses).length} responses logged
                </span>
              </div>

              {exam?.sections?.flatMap(s => s.question_ids).map((qId, idx) => {
                const q = questionsMap[qId];
                if (!q) return null;
                const studentResp = (finalGradedAttempt?.responses || responses)[qId];
                const selectedOpt = studentResp?.selected_option;
                const isCorrect = studentResp?.is_correct;
                const rawCorrect = q.correct_answer;
                const correctOptIdx =
                  typeof rawCorrect === 'number'
                    ? rawCorrect
                    : typeof rawCorrect === 'string' && ['0', '1', '2', '3'].includes(rawCorrect)
                    ? Number(rawCorrect)
                    : ['A', 'B', 'C', 'D'].indexOf(String(rawCorrect).toUpperCase());

                return (
                  <div
                    key={qId}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#2e3035] space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-500">Question {idx + 1}</span>
                      {selectedOpt === null || selectedOpt === undefined ? (
                        <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-[#2b2d31] text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                          Unanswered
                        </span>
                      ) : isCorrect ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Correct
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-[10px] font-bold flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-500" /> Incorrect
                        </span>
                      )}
                    </div>

                    <p className="font-medium text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed font-sans">
                      {q.statement}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {(q.options || []).map((optText: string, oIdx: number) => {
                        const isStudentChoice = selectedOpt === oIdx;
                        const isThisCorrect = correctOptIdx === oIdx;

                        let optClasses = 'border-gray-200 dark:border-[#2e3035] bg-white dark:bg-[#202225] text-gray-700 dark:text-gray-300';
                        if (isThisCorrect) {
                          optClasses = 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                        } else if (isStudentChoice && !isCorrect) {
                          optClasses = 'border-rose-300 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold';
                        }

                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${optClasses}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold shrink-0">{String.fromCharCode(65 + oIdx)}.</span>
                              <span>{optText}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase shrink-0">
                              {isThisCorrect && <span className="text-emerald-600 dark:text-emerald-400">Correct Answer</span>}
                              {isStudentChoice && !isThisCorrect && <span className="text-rose-600 dark:text-rose-400">Your Choice</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-blue-900 dark:text-blue-200 text-[11px] leading-relaxed">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3.5 rounded-2xl bg-[#121417] dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
          >
            Return to Student Dashboard
          </button>

        </div>
      </div>
    );
  }

  return null;
}
