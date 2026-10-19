import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Maximize2,
  Minimize2,
  Terminal,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Layers,
  Circle,
  Send,
  LayoutGrid,
  List,
  GripHorizontal,
  Cloud,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import HackerRankProblemView from '@/components/HackerRankProblemView';
import {
  codeExecutionService,
  STARTER_TEMPLATES,
  LANGUAGE_LABELS,
  type TestCaseRunResult,
  type ExecutionResult,
} from '@/services/codeExecution.service';
import { technicalService } from '@/services/technical.service';
import audioEffects from '@/utils/audioEffects';
import { useAuth, GUEST_EMAIL } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { ProgrammingProblem } from '@/types/technical';
import { type PaperQuestion, ensureFourTestCases } from '@/utils/paperQuestionParser';

interface PaperCodingModalProps {
  question: PaperQuestion | null;
  questions?: PaperQuestion[];
  onSelectQuestion?: (question: PaperQuestion) => void;
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  examName?: string;
  isSolved?: boolean;
  onMarkSolved?: (questionId: string) => void;
}

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  c: 'c',
};

export default function PaperCodingModal({
  question,
  questions = [],
  onSelectQuestion,
  isOpen,
  onClose,
  companyName = 'Company',
  examName = 'Placement Drive',
  isSolved = false,
  onMarkSolved,
}: PaperCodingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor' | 'console'>('editor');

  // Multi-device Cloud & Local Sync tracking
  const [restoredSource, setRestoredSource] = useState<'cloud_solution' | 'cloud_draft' | 'local_draft' | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'saving' | 'synced' | 'error'>('idle');
  const draftTimeoutRef = useRef<any>(null);
  const isProgrammaticUpdateRef = useRef<boolean>(false);

  // Navigation indices
  const currentIndex = useMemo(() => {
    if (!question || questions.length === 0) return -1;
    return questions.findIndex((q) => q.id === question.id);
  }, [question, questions]);

  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextQuestion = currentIndex >= 0 && currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  // Language & Code state
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  const [fontSize] = useState<number>(14);

  // Execution & Testing state
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseRunResult | null>(null);
  const [activeTestTab, setActiveTestTab] = useState<number>(0);
  const [resultsViewMode, setResultsViewMode] = useState<'grid' | 'tabs'>('grid');

  // Adjustable Console Splitter
  const [consoleHeight, setConsoleHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prepunite_console_height');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 160 && parsed <= 900) return parsed;
      }
    }
    return 340;
  });
  const [isDraggingConsole, setIsDraggingConsole] = useState(false);
  const [isConsoleMaximized, setIsConsoleMaximized] = useState(false);
  const consoleContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  // Custom Input State
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customStdin, setCustomStdin] = useState('');
  const [customResult, setCustomResult] = useState<ExecutionResult | null>(null);
  const [isRunningCustom, setIsRunningCustom] = useState(false);

  // Multi-device Hydration: Restores solution or draft from cloud (LeetCode/GfG standard)
  useEffect(() => {
    if (!question) return;
    let isMounted = true;

    const hydrateProblemCode = async () => {
      // 1. Check for past saved submission or cloud draft in Supabase (hydrates new devices / new browsers)
      const cloudSubmission = await technicalService.getUserLatestSubmission(question.id, user?.email);
      if (!isMounted) return;

      if (cloudSubmission && cloudSubmission.sourceCode && cloudSubmission.sourceCode.trim().length > 0) {
        const subLang = cloudSubmission.language || 'python';
        setSelectedLanguage(subLang);
        isProgrammaticUpdateRef.current = true;
        setCode(cloudSubmission.sourceCode);
        if (editorRef.current) {
          editorRef.current.setValue(cloudSubmission.sourceCode);
        }
        setRestoredSource(cloudSubmission.status === 'ACCEPTED' ? 'cloud_solution' : 'cloud_draft');
        isProgrammaticUpdateRef.current = false;

        if (cloudSubmission.status === 'ACCEPTED') {
          onMarkSolved?.(question.id);
        }
        return;
      }

      // 2. Check local device draft
      const storedCodeKey = `paper_code_${question.id}_${selectedLanguage}`;
      const savedDraft = typeof window !== 'undefined' ? localStorage.getItem(storedCodeKey) : null;
      if (savedDraft && savedDraft.trim().length > 0) {
        isProgrammaticUpdateRef.current = true;
        setCode(savedDraft);
        if (editorRef.current && editorRef.current.getValue() !== savedDraft) {
          editorRef.current.setValue(savedDraft);
        }
        setRestoredSource('local_draft');
        isProgrammaticUpdateRef.current = false;
        return;
      }

      // 3. Fallback to starter boilerplate template
      const template = STARTER_TEMPLATES[selectedLanguage] || STARTER_TEMPLATES.python;
      isProgrammaticUpdateRef.current = true;
      setCode(template);
      if (editorRef.current && editorRef.current.getValue() !== template) {
        editorRef.current.setValue(template);
      }
      setRestoredSource(null);
      isProgrammaticUpdateRef.current = false;
    };

    hydrateProblemCode();
    setTestResults(null);
    setCustomResult(null);
    setActiveTestTab(0);
    setShowCustomInput(false);

    return () => {
      isMounted = false;
    };
  }, [question?.id, user?.email]);

  // Keyboard shortcut listener (Escape to close, Ctrl+Enter to run)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle code change with instant local persistence and debounced cloud draft sync (LeetCode/GfG standard)
  const handleCodeChange = (newCode?: string) => {
    if (isProgrammaticUpdateRef.current) return;
    const val = newCode || '';
    setCode(val);

    if (!question) return;

    // 1. Instant local persistence (Tier 1: 0ms lag, offline resilience)
    localStorage.setItem(`paper_code_${question.id}_${selectedLanguage}`, val);

    // 2. Debounced cloud draft persistence (Tier 2: background sync)
    if (user?.email && user.email !== GUEST_EMAIL) {
      setCloudSyncStatus('saving');
      if (draftTimeoutRef.current) {
        clearTimeout(draftTimeoutRef.current);
      }

      draftTimeoutRef.current = setTimeout(async () => {
        try {
          await technicalService.saveUserDraft(question.id, selectedLanguage, val, user.email);
          setCloudSyncStatus('synced');
          setTimeout(() => setCloudSyncStatus('idle'), 2500);
        } catch {
          setCloudSyncStatus('error');
        }
      }, 2000);
    }
  };

  // Handle language switch with automatic draft hydration / starter template loading
  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    setTestResults(null);
    setCustomResult(null);
    setRestoredSource(null);

    if (question) {
      const storedCodeKey = `paper_code_${question.id}_${newLang}`;
      const savedDraft = typeof window !== 'undefined' ? localStorage.getItem(storedCodeKey) : null;
      const newCode = savedDraft && savedDraft.trim().length > 0 ? savedDraft : (STARTER_TEMPLATES[newLang] || STARTER_TEMPLATES.python);
      isProgrammaticUpdateRef.current = true;
      setCode(newCode);
      if (editorRef.current) {
        editorRef.current.setValue(newCode);
      }
      isProgrammaticUpdateRef.current = false;
    }
  };

  const handleResetTemplate = () => {
    const template = STARTER_TEMPLATES[selectedLanguage] || STARTER_TEMPLATES.python;
    isProgrammaticUpdateRef.current = true;
    setCode(template);
    if (editorRef.current) {
      editorRef.current.setValue(template);
    }
    isProgrammaticUpdateRef.current = false;
    if (question) {
      localStorage.removeItem(`paper_code_${question.id}_${selectedLanguage}`);
    }
    setRestoredSource(null);
    toast.info('Code reset to default starter template.');
  };

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Draggable Splitter handlers
  const handleSplitterMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingConsole(true);
    const startY = e.clientY;
    const startHeight = consoleHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const minH = 160;
      const maxH = Math.max(300, window.innerHeight - 200);
      const newHeight = Math.max(minH, Math.min(maxH, startHeight + deltaY));
      setConsoleHeight(newHeight);
      setIsConsoleMaximized(false);
    };

    const handleMouseUp = () => {
      setIsDraggingConsole(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setConsoleHeight((prev) => {
        try {
          localStorage.setItem('prepunite_console_height', prev.toString());
        } catch {}
        return prev;
      });
      if (editorRef.current) {
        setTimeout(() => editorRef.current?.layout(), 50);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const toggleConsoleMaximize = () => {
    if (isConsoleMaximized) {
      setIsConsoleMaximized(false);
      const restored = 340;
      setConsoleHeight(restored);
      try {
        localStorage.setItem('prepunite_console_height', restored.toString());
      } catch {}
    } else {
      setIsConsoleMaximized(true);
      const maxH = Math.max(450, window.innerHeight - 240);
      setConsoleHeight(maxH);
    }
    setTimeout(() => editorRef.current?.layout(), 100);
  };

  // Adapter for HackerRankProblemView (Matches Programme 150)
  const adaptedProblem: ProgrammingProblem = useMemo(() => {
    if (!question) {
      return {
        id: '',
        title: '',
        slug: '',
        track: 'PROGRAMMING_150',
        level: 'BASIC',
        category: 'ARRAYS',
        description: '',
        solutions: {},
      };
    }

    return {
      id: question.id,
      title: question.title,
      slug: question.id,
      track: 'PROGRAMMING_150',
      level: question.difficulty,
      category: 'ARRAYS',
      categoryLabel: `${companyName} • ${examName}`,
      description: question.description || 'No detailed problem statement provided.',
      constraints: question.constraints || [],
      testCases: (question.testCases || []).map((tc) => ({
        input: tc.input,
        output: tc.output || '',
        explanation: tc.explanation,
      })),
      solutions: {},
    };
  }, [question, companyName, examName]);

  // Ensure IDE operates on a verified test suite of at least 4 test cases
  const ideTestSuite = useMemo(() => {
    return ensureFourTestCases(question?.testCases || [], question?.cleanTitle || '');
  }, [question?.testCases, question?.cleanTitle]);

  const sampleCases = useMemo(() => {
    return ideTestSuite.map((tc) => ({
      input: tc.input,
      expected_output: tc.output,
      output: tc.output,
      explanation: tc.explanation,
      is_hidden: false,
    }));
  }, [ideTestSuite]);

  // Display grid cases calculation (Guarantees 4 test cases visible in IDE)
  const displayGridCases = useMemo(() => {
    if (testResults && testResults.cases && testResults.cases.length > 0) {
      return testResults.cases;
    }
    return ideTestSuite.map((tc) => ({
      input: tc.input,
      expected: tc.output || '',
      actual: '',
      passed: false,
      status: isSubmitting ? ('EVALUATING' as any) : undefined,
      timeMs: 0,
      is_hidden: false,
    }));
  }, [testResults, isSubmitting, ideTestSuite]);

  // Run Test Cases against Sandboxed Judge Engine
  const handleRunTests = async (isSubmit: boolean = false) => {
    if (isRunningTests || isSubmitting || !question) return;

    if (!code || code.trim().length === 0) {
      toast.error('Please write your solution code before running tests.');
      return;
    }

    const testCasesToRun = ideTestSuite;
    if (testCasesToRun.length === 0) {
      toast.error('No test cases available for this question.');
      return;
    }

    if (isSubmit) {
      setIsSubmitting(true);
    } else {
      setIsRunningTests(true);
    }

    setShowCustomInput(false);

    try {
      // Direct Judge0 evaluation
      const result = await codeExecutionService.runTestCasesDirect(
        selectedLanguage,
        code,
        testCasesToRun.map((tc) => ({
          input: tc.input,
          expected_output: tc.output,
          output: tc.output,
          expectedOutput: tc.output,
          expected: tc.output,
          is_hidden: false,
        }))
      );

      setTestResults(result);
      setActiveTestTab(0);
      setMobileTab('console');

      const allPassed = result.passedCount === result.totalCount && result.totalCount > 0 && !result.compileError;

      // Tier 3: Permanent submission recording in Supabase cloud ledger
      if (isSubmit) {
        const subVerdict = allPassed
          ? 'ACCEPTED'
          : (result.compileError ? 'COMPILATION_ERROR' : (result.runtimeError ? 'RUNTIME_ERROR' : 'WRONG_ANSWER'));
        await technicalService.saveUserSubmission(
          question.id,
          selectedLanguage,
          code,
          subVerdict,
          result.passedCount,
          result.totalCount,
          user?.email
        );
      }

      if (allPassed) {
        audioEffects.playSuccessChime();
        if (isSubmit) {
          onMarkSolved?.(question.id);
          setRestoredSource('cloud_solution');
          setCloudSyncStatus('synced');
          toast.success(`🎉 All ${result.totalCount} Test Cases Passed! Solution accepted and backed up to cloud.`);
        } else {
          toast.success(`Sample test cases passed (${result.passedCount}/${result.totalCount})! Click Submit Solution to verify.`);
        }
      } else if (result.compileError) {
        audioEffects.playErrorBuzz();
        toast.error('Compilation Error detected. Check diagnostic output below.');
      } else {
        audioEffects.playErrorBuzz();
        if (isSubmit) {
          toast.error(`Solution failed: ${result.passedCount}/${result.totalCount} test cases passed.`);
        } else {
          toast.info(`${result.passedCount}/${result.totalCount} Sample Test Cases Passed.`);
        }
      }
    } catch (err: any) {
      console.error('Failed to run code tests:', err);
      toast.error(err?.message || 'Failed to communicate with compiler engine.');
    } finally {
      setIsRunningTests(false);
      setIsSubmitting(false);
    }
  };

  // Run Custom Input
  const handleRunCustomInput = async () => {
    if (isRunningCustom || !question) return;
    if (!code || code.trim().length === 0) {
      toast.error('Please write code before running custom test.');
      return;
    }

    setIsRunningCustom(true);
    try {
      const result = await codeExecutionService.execute(selectedLanguage, code, customStdin);
      setCustomResult(result);
    } catch (e: any) {
      toast.error('Failed to run custom input: ' + (e.message || 'Error'));
    } finally {
      setIsRunningCustom(false);
    }
  };

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex flex-col bg-[#0d1117] text-[#e6edf3] overflow-hidden select-text animate-fadeIn">
      {/* Full-window Drag Capture Overlay when dragging Splitter */}
      {isDraggingConsole && (
        <div className="fixed inset-0 z-50 cursor-row-resize select-none bg-transparent" />
      )}

      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION / WORKSPACE APP BAR (Programme 150 Style)  */}
      {/* ============================================================ */}
      <header className="h-14 px-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Back Button, Breadcrumb & Problem Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors shrink-0 cursor-pointer"
            title="Return to Paper Overview (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Papers</span>
          </button>

          <span className="text-gray-600 hidden sm:inline">/</span>

          {/* Problem Title & Difficulty */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display font-bold text-sm text-white truncate max-w-[200px] sm:max-w-[320px] md:max-w-[450px]">
              {question.title}
            </span>

            {/* Level Badge */}
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                question.difficulty === 'BASIC'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : question.difficulty === 'MEDIUM'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {question.difficulty}
            </span>

            {/* Solved Status Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 select-none ${
                isSolved
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
              }`}
              title={isSolved ? 'Solution verified & test cases passed' : 'Submit your code to mark as solved'}
            >
              {isSolved ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="hidden md:inline">Solved</span>
                </>
              ) : (
                <>
                  <Circle className="w-3 h-3 text-gray-400" />
                  <span className="hidden md:inline">Unsolved</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Right: Question Stepper, Fullscreen & Close */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Question Stepper */}
          {questions.length > 0 && currentIndex >= 0 && (
            <div className="flex items-center gap-1 bg-[#21262d] rounded-lg p-0.5 border border-[#30363d] text-xs font-mono">
              <button
                type="button"
                onClick={() => prevQuestion && onSelectQuestion?.(prevQuestion)}
                disabled={!prevQuestion}
                className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#30363d] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title={prevQuestion ? `Previous: ${prevQuestion.title}` : 'First problem'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-2 text-[11px] text-[#8b949e] font-bold">
                {currentIndex + 1} / {questions.length}
              </span>

              <button
                type="button"
                onClick={() => nextQuestion && onSelectQuestion?.(nextQuestion)}
                disabled={!nextQuestion}
                className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#30363d] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title={nextQuestion ? `Next: ${nextQuestion.title}` : 'Last problem'}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer hidden sm:inline-flex"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Studio Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8b949e] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Close Code Studio (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MOBILE RESPONSIVE TABS (< 1024px)                          */}
      {/* ============================================================ */}
      <div className="lg:hidden flex items-center justify-around bg-[#161b22] border-b border-[#30363d] px-2 py-1 shrink-0 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMobileTab('problem')}
          className={`flex-1 py-1.5 text-center rounded-md transition-colors ${
            mobileTab === 'problem' ? 'bg-[#21262d] text-white' : 'text-[#8b949e]'
          }`}
        >
          Description
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 text-center rounded-md transition-colors ${
            mobileTab === 'editor' ? 'bg-[#21262d] text-white' : 'text-[#8b949e]'
          }`}
        >
          Code Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('console')}
          className={`flex-1 py-1.5 text-center rounded-md transition-colors relative ${
            mobileTab === 'console' ? 'bg-[#21262d] text-white' : 'text-[#8b949e]'
          }`}
        >
          Console
          {testResults && (
            <span
              className={`ml-1.5 w-2 h-2 inline-block rounded-full ${
                testResults.passedCount === testResults.totalCount ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. MAIN WORKSPACE BODY: TWO-PANE SPLIT LAYOUT                */}
      {/* ============================================================ */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-[#30363d]">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Problem Specs, Constraints, Sample I/O          */}
        {/* ============================================================ */}
        <section
          className={`lg:col-span-5 p-5 overflow-y-auto space-y-5 custom-scrollbar bg-white dark:bg-[#151618] text-gray-900 dark:text-gray-100 ${
            mobileTab === 'problem' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Header Metadata: Topic Name & Question Stepper */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap pb-3 border-b border-gray-200 dark:border-[#25262a]">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/25 font-display flex items-center gap-1.5 shadow-2xs">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{companyName} • {examName}</span>
              </span>
            </div>

            {/* Stepper inside problem pane */}
            {questions.length > 0 && currentIndex >= 0 && (
              <div className="inline-flex items-center gap-1 bg-[#F8F9FA] dark:bg-[#16181c] p-0.5 rounded-lg border border-gray-200 dark:border-[#2a2d33] shadow-xs">
                <button
                  type="button"
                  onClick={() => prevQuestion && onSelectQuestion?.(prevQuestion)}
                  disabled={!prevQuestion}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-display font-bold border border-gray-200 dark:border-[#2e3238] bg-white dark:bg-[#1c1f24] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-[#FD4A32] dark:hover:border-[#FD4A32] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
                  title={prevQuestion ? `Previous: ${prevQuestion.title}` : 'First problem'}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <span className="px-2.5 py-1 rounded-md bg-transparent font-display font-bold text-xs text-gray-800 dark:text-gray-200 font-mono">
                  {currentIndex + 1} / {questions.length}
                </span>

                <button
                  type="button"
                  onClick={() => nextQuestion && onSelectQuestion?.(nextQuestion)}
                  disabled={!nextQuestion}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-display font-bold border border-gray-200 dark:border-[#2e3238] bg-white dark:bg-[#1c1f24] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-[#FD4A32] dark:hover:border-[#FD4A32] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
                  title={nextQuestion ? `Next: ${nextQuestion.title}` : 'Last problem'}
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Standardized HackerRank / LeetCode Structured Problem Presentation (Programme 150) */}
          <HackerRankProblemView
            problem={adaptedProblem}
            sampleCases={sampleCases}
          />

          {/* Test Cases Count Preview */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#18191c] border border-gray-200 dark:border-[#25262a] flex items-center justify-between text-xs">
            <span className="text-gray-500">Evaluation Test Suite:</span>
            <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
              {sampleCases.length} Test Cases (Verified Campus I/O)
            </span>
          </div>
        </section>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Code Studio & Execution Test Runner Console    */}
        {/* ============================================================ */}
        <section
          className={`lg:col-span-7 flex flex-col min-h-0 bg-[#0d1117] text-[#e6edf3] ${
            mobileTab !== 'problem' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Editor Header Bar */}
          <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8b949e] uppercase">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#21262d] border border-[#30363d] text-white text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#FD4A32] cursor-pointer"
              >
                {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              {restoredSource === 'cloud_solution' && (
                <div
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800"
                  title="Your accepted solution was automatically restored from cloud across your devices"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Cloud Solution Restored</span>
                </div>
              )}

              {restoredSource === 'cloud_draft' && (
                <div
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800"
                  title="Your draft was automatically restored from cloud across your devices"
                >
                  <Cloud className="w-3 h-3 text-sky-400" />
                  <span>Cloud Draft Restored</span>
                </div>
              )}

              {cloudSyncStatus === 'saving' && (
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Syncing to Cloud...</span>
                </div>
              )}

              {cloudSyncStatus === 'synced' && (
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  <Cloud className="w-3 h-3 text-emerald-400" />
                  <span>Cloud Synced</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleResetTemplate}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8b949e] hover:text-white px-2 py-1 rounded hover:bg-[#21262d] transition-colors cursor-pointer"
                title="Reset code to starter template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Auto-Saved</span>
              </div>
            </div>
          </div>

          {/* Monaco Professional Code Editor */}
          <div className="flex-1 relative flex flex-col overflow-hidden min-h-[140px] bg-[#1e1e1e]">
            {isDraggingConsole && (
              <div className="absolute inset-0 z-50 cursor-row-resize select-none bg-transparent" />
            )}
            <Editor
              height="100%"
              language={MONACO_LANGUAGE_MAP[selectedLanguage] || 'python'}
              value={code}
              theme="vs-dark"
              onChange={(val) => handleCodeChange(val || '')}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                  handleRunTests(false);
                });
              }}
              options={{
                fontSize,
                fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', 'Courier New', monospace",
                fontLigatures: true,
                tabSize: 4,
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                autoClosingOvertype: 'always',
                autoSurround: 'languageDefined',
                formatOnPaste: true,
                formatOnType: true,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                bracketPairColorization: { enabled: true },
                folding: true,
                foldingHighlight: true,
                showFoldingControls: 'always',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                wordWrap: 'on',
                lineHeight: 22,
                padding: { top: 12, bottom: 12 },
              }}
              loading={
                <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] text-[#8b949e] gap-2 p-8 min-h-[300px]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#FD4A32]" />
                  <span className="text-xs font-mono">Initializing Code Studio...</span>
                </div>
              }
            />
          </div>

          {/* ============================================================ */}
          {/* DRAGGABLE SPLITTER DIVIDER (Between Editor & Test Drawer)    */}
          {/* ============================================================ */}
          <div
            onMouseDown={handleSplitterMouseDown}
            onDoubleClick={toggleConsoleMaximize}
            className={`h-2.5 bg-[#161b22] hover:bg-[#21262d] cursor-row-resize flex items-center justify-center transition-colors select-none group shrink-0 border-y border-[#30363d] relative z-20 ${
              isDraggingConsole ? 'bg-[#21262d] ring-1 ring-[#FD4A32]' : ''
            }`}
            title="Drag up/down to adjust editor and test cases space (Double-click to expand/restore)"
          >
            <div
              className={`h-1 rounded-full transition-all flex items-center justify-center ${
                isDraggingConsole ? 'bg-[#FD4A32] w-20' : 'bg-[#484f58] group-hover:bg-[#FD4A32] w-14'
              }`}
            />
          </div>

          {/* ============================================================ */}
          {/* CONSOLE & EXECUTION RESULTS DRAWER (Adjustable Height)       */}
          {/* ============================================================ */}
          <div
            ref={consoleContainerRef}
            style={{ height: `${consoleHeight}px` }}
            className="bg-[#161b22] shrink-0 flex flex-col min-h-0 overflow-hidden select-text"
          >
            {/* Runner Action Toolbar */}
            <div className="px-4 py-2 bg-[#161b22] flex items-center justify-between border-b border-[#21262d] flex-wrap gap-2 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Run Tests (Sample) */}
                <button
                  type="button"
                  onClick={() => handleRunTests(false)}
                  disabled={isRunningTests || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                  title="Run against visible sample test cases"
                >
                  {isRunningTests ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Tests</span>
                    </>
                  )}
                </button>

                {/* Submit Solution */}
                <button
                  type="button"
                  onClick={() => handleRunTests(true)}
                  disabled={isRunningTests || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                  title="Submit solution to verify all test cases & mark as solved"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </>
                  )}
                </button>

                {/* Custom Input Toggle */}
                <button
                  type="button"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border ${
                    showCustomInput
                      ? 'bg-[#21262d] text-white border-[#388bfd]'
                      : 'bg-[#161b22] text-[#8b949e] border-[#30363d] hover:text-white'
                  }`}
                >
                  Custom Test
                </button>

                {/* View Mode Switcher (Grid vs Tabs) */}
                {(testResults || isSubmitting) && (
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs">
                    <button
                      type="button"
                      onClick={() => setResultsViewMode('grid')}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        resultsViewMode === 'grid'
                          ? 'bg-[#21262d] text-white shadow-xs'
                          : 'text-[#8b949e] hover:text-white'
                      }`}
                      title="Grid View (Matching submission results)"
                    >
                      <LayoutGrid className="w-3 h-3" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setResultsViewMode('tabs')}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        resultsViewMode === 'tabs'
                          ? 'bg-[#21262d] text-white shadow-xs'
                          : 'text-[#8b949e] hover:text-white'
                      }`}
                      title="Tabs View"
                    >
                      <List className="w-3 h-3" />
                      <span className="hidden sm:inline">Tabs</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {testResults && (
                  <span
                    className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg ${
                      testResults.passedCount === testResults.totalCount
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {testResults.passedCount}/{testResults.totalCount} Passed
                  </span>
                )}

                {/* Maximize / Restore Console Button */}
                <button
                  type="button"
                  onClick={toggleConsoleMaximize}
                  className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
                  title={isConsoleMaximized ? 'Restore console height' : 'Expand test cases space'}
                >
                  {isConsoleMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <span className="text-[11px] text-[#8b949e] font-mono hidden md:inline">
                  Ctrl/Cmd + Enter
                </span>
              </div>
            </div>

            {/* Console Content Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-[#0d1117] space-y-4 custom-scrollbar">
              {/* Custom Input Panel */}
              {showCustomInput && (
                <div className="p-3.5 bg-[#161b22] rounded-xl border border-[#30363d] space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#8b949e] uppercase text-[10px]">Custom Stdin Input:</span>
                    <button
                      type="button"
                      onClick={handleRunCustomInput}
                      disabled={isRunningCustom}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isRunningCustom ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>Run Custom</span>
                    </button>
                  </div>
                  <textarea
                    value={customStdin}
                    onChange={(e) => setCustomStdin(e.target.value)}
                    placeholder="Enter inputs here (e.g. 5, 2 7 11 15, etc.)..."
                    rows={2}
                    className="w-full p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#FD4A32]"
                  />

                  {customResult && (
                    <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                        <span>Status: {customResult.statusDescription}</span>
                        <span>Time: {customResult.timeMs} ms</span>
                      </div>
                      {customResult.compileOutput && (
                        <pre className="p-2 rounded bg-rose-950/60 text-rose-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {customResult.compileOutput}
                        </pre>
                      )}
                      {customResult.stderr && (
                        <pre className="p-2 rounded bg-amber-950/60 text-amber-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {customResult.stderr}
                        </pre>
                      )}
                      <div>
                        <span className="text-[#8b949e] block text-[10px] uppercase font-bold">Standard Output:</span>
                        <pre className="p-2 rounded bg-[#161b22] text-emerald-400 text-xs overflow-x-auto whitespace-pre-wrap border border-[#21262d] mt-1">
                          {customResult.stdout || '<No output returned>'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Boilerplate Unmodified Warning */}
              {testResults?.isTemplateOrEmpty && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>No Solution Code Implemented</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-200/90 font-sans">
                    You ran tests on unmodified template code. Please write your algorithm logic before checking test cases.
                  </p>
                </div>
              )}

              {/* Compilation Error Diagnostics */}
              {testResults?.compileError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 font-mono text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400 uppercase tracking-wider text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Compilation Error Diagnostics</span>
                  </div>
                  <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed p-2.5 bg-[#080b0f] rounded-lg border border-rose-900/60 text-rose-300 custom-scrollbar max-h-36 font-mono">
                    {testResults.compileError}
                  </pre>
                </div>
              )}

              {/* Evaluation / Submission View (Multi-Column Grid matching Programme 150) */}
              {(isSubmitting || testResults) && resultsViewMode === 'grid' && (
                <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                        Evaluation Results
                      </h3>
                      {isSubmitting && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Evaluating Suite...</span>
                        </span>
                      )}
                    </div>

                    {testResults && !isSubmitting && (
                      <span
                        className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                          testResults.passedCount === testResults.totalCount
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : 'bg-rose-950/80 text-rose-400 border-rose-800'
                        }`}
                      >
                        {testResults.passedCount}/{testResults.totalCount} Test Cases Passed
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[#21262d] rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isSubmitting
                          ? 'w-4/5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 animate-pulse'
                          : testResults?.passedCount === testResults?.totalCount
                          ? 'w-full bg-emerald-500'
                          : 'w-full bg-amber-500'
                      }`}
                    />
                  </div>

                  {/* Test Cases Grid */}
                  <div className="py-2 overflow-x-auto custom-scrollbar">
                    <div className="grid grid-flow-col grid-rows-2 sm:grid-rows-3 auto-cols-max gap-x-8 sm:gap-x-12 gap-y-3 min-w-[320px]">
                      {displayGridCases.map((c, idx) => {
                        const isEvaluating = isSubmitting || (c as any).status === 'EVALUATING';
                        const isPassed = !isEvaluating && c.passed;
                        const isFailed = !isEvaluating && !c.passed;
                        const isSelected = activeTestTab === idx;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveTestTab(idx)}
                            className={`inline-flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer select-none group ${
                              isSelected
                                ? 'bg-[#21262d] ring-1 ring-emerald-500/60 shadow-sm'
                                : 'hover:bg-[#1f242c]'
                            }`}
                            title={`Click to inspect Test case ${idx + 1} diagnostics`}
                          >
                            {isEvaluating ? (
                              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                            ) : isPassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isFailed ? (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-500 shrink-0" />
                            )}

                            <span
                              className={`text-sm font-medium transition-colors ${
                                isEvaluating
                                  ? 'text-gray-300'
                                  : isPassed
                                  ? 'text-emerald-400 font-semibold'
                                  : isFailed
                                  ? 'text-rose-400 font-semibold'
                                  : 'text-gray-400'
                              }`}
                            >
                              Test case {idx + 1}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs View Mode */}
              {(isSubmitting || testResults) && resultsViewMode === 'tabs' && (
                <div className="space-y-3">
                  {displayGridCases.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {displayGridCases.map((c, idx) => {
                        const isEvaluating = isSubmitting || (c as any).status === 'EVALUATING';
                        const isPassed = !isEvaluating && c.passed;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveTestTab(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                              activeTestTab === idx
                                ? 'bg-[#21262d] text-white border border-[#388bfd]'
                                : 'bg-[#161b22] text-[#8b949e] hover:text-white'
                            }`}
                          >
                            {isEvaluating ? (
                              <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
                            ) : isPassed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            )}
                            <span>Case {idx + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Active Case Diagnostics Card */}
              {testResults && testResults.cases[activeTestTab] && (
                <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2.5 text-xs font-mono animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px] flex-wrap gap-2 pb-2 border-b border-[#21262d]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#8b949e]">Case #{activeTestTab + 1} Status:</span>
                      <span
                        className={`font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase ${
                          testResults.cases[activeTestTab].passed
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : testResults.cases[activeTestTab].status === 'COMPILATION_ERROR'
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {testResults.cases[activeTestTab].status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#8b949e] text-[10px]">
                      <span>Time: {testResults.cases[activeTestTab].timeMs} ms</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#8b949e] block text-[10px] uppercase font-bold">Standard Input (stdin):</span>
                    <div className="p-2 rounded bg-[#0d1117] text-[#e6edf3] whitespace-pre-wrap mt-0.5 border border-[#21262d] max-h-24 overflow-y-auto custom-scrollbar">
                      {testResults.cases[activeTestTab].input || '<No input provided>'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[#8b949e] block text-[10px] uppercase font-bold">Expected Output:</span>
                    <div className="p-2 rounded bg-[#0d1117] text-emerald-400 whitespace-pre-wrap mt-0.5 border border-[#21262d] max-h-24 overflow-y-auto custom-scrollbar">
                      {testResults.cases[activeTestTab].expected || '<Empty>'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[#8b949e] block text-[10px] uppercase font-bold">Your Program Output:</span>
                    <div
                      className={`p-2 rounded bg-[#0d1117] whitespace-pre-wrap mt-0.5 border max-h-24 overflow-y-auto custom-scrollbar ${
                        testResults.cases[activeTestTab].passed
                          ? 'text-emerald-400 border-emerald-950'
                          : 'text-rose-400 border-rose-950'
                      }`}
                    >
                      {testResults.cases[activeTestTab].actual}
                    </div>
                  </div>
                </div>
              )}

              {/* Ready State */}
              {!testResults && !isSubmitting && !showCustomInput && (
                <div className="h-40 flex flex-col items-center justify-center text-center text-[#8b949e] space-y-2 p-4">
                  <Terminal className="w-8 h-8 text-[#484f58]" />
                  <p className="text-xs font-mono font-medium text-gray-400 max-w-md">
                    Click <span className="text-emerald-400 font-bold">Run Tests</span> to test visible sample cases, or{' '}
                    <span className="text-[#FD4A32] font-bold">Submit Solution</span> to evaluate all cases and mark as solved.
                  </p>
                  <p className="text-[11px] text-[#484f58] flex items-center gap-1.5">
                    <GripHorizontal className="w-3.5 h-3.5" />
                    <span>Tip: Drag the splitter bar above to expand or shrink the test console.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
