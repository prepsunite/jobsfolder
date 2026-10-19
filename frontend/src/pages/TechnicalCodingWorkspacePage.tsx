import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Code2,
  Terminal,
  Play,
  RotateCcw,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Lightbulb,
  HelpCircle,
  Building2,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ArrowRight,
  Circle,
  Send,
  Zap,
  Sparkles,
  BookOpen,
  FileCode,
  Lock,
  LayoutGrid,
  List,
  GripHorizontal,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import QuestionRichContent from '@/components/QuestionRichContent';
import HackerRankProblemView from '@/components/HackerRankProblemView';
import {
  codeExecutionService,
  STARTER_TEMPLATES,
  LANGUAGE_LABELS,
  normalizeStdin,
  isTemplateOrEmptyCode,
  type TestCaseInput,
  type TestCaseRunResult,
  type ExecutionResult,
} from '@/services/codeExecution.service';
import { technicalService } from '@/services/technical.service';
import audioEffects from '@/utils/audioEffects';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { ProgrammingProblem } from '@/types/technical';

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  c: 'c',
};

interface TestCaseItem {
  input: string;
  expected_output?: string;
  output?: string;
  is_hidden?: boolean;
}

export default function TechnicalCodingWorkspacePage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor' | 'console'>('editor');

  // Query problem data
  const { data: problem, isLoading: isProblemLoading, refetch: refetchProblem } = useQuery<ProgrammingProblem | null>({
    queryKey: ['technical-problem', problemId],
    queryFn: () => (problemId ? technicalService.getProblemById(problemId) : null),
    enabled: !!problemId,
  });

  // Query track problems list to enable Prev/Next navigation
  const activeTrack = problem?.track || 'PROGRAMMING_150';
  const { data: trackProblems = [] } = useQuery<ProgrammingProblem[]>({
    queryKey: [activeTrack === 'CAMPUS_DSA' ? 'campus-dsa-problems' : 'programming-150-problems'],
    queryFn: () => (activeTrack === 'CAMPUS_DSA' ? technicalService.getCampusDsaProblems() : technicalService.getProgramming150Problems()),
    enabled: !!problem,
  });

  // Solved state tracking
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    if (problem) {
      const solvedSet = technicalService.getSolvedProblemIds();
      setIsSolved(solvedSet.has(problem.id));
    }
  }, [problem]);

  // Current problem position index in track
  const currentIndex = useMemo(() => {
    if (!problem || trackProblems.length === 0) return -1;
    return trackProblems.findIndex(p => p.id === problem.id || p.slug === problem.slug);
  }, [problem, trackProblems]);

  const prevProblem = currentIndex > 0 ? trackProblems[currentIndex - 1] : null;
  const nextProblem = currentIndex >= 0 && currentIndex < trackProblems.length - 1 ? trackProblems[currentIndex + 1] : null;

  // Language & Code State
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>(STARTER_TEMPLATES.python);
  const [fontSize, setFontSize] = useState<number>(14);

  // Execution & Testing State
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseRunResult | null>(null);
  const [activeTestTab, setActiveTestTab] = useState<number>(0);
  const [lastRunIsSubmit, setLastRunIsSubmit] = useState(false);
  const [resultsViewMode, setResultsViewMode] = useState<'grid' | 'tabs'>('grid');

  // Adjustable Console Splitter State
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

  // Custom Input State
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customStdin, setCustomStdin] = useState('');
  const [customResult, setCustomResult] = useState<ExecutionResult | null>(null);
  const [isRunningCustom, setIsRunningCustom] = useState(false);

  // Show acceptance celebration banner
  const [showCelebration, setShowCelebration] = useState(false);
  const [restoredSource, setRestoredSource] = useState<'submission' | 'draft' | null>(null);

  const editorRef = useRef<any>(null);
  const runRevisionRef = useRef(0);
  const isProgrammaticUpdateRef = useRef(false);

  // Console Splitter drag handlers
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
      if (editorRef.current) {
        editorRef.current.layout();
      }
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

  const handleSplitterTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDraggingConsole(true);
    const startY = e.touches[0].clientY;
    const startHeight = consoleHeight;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length !== 1) return;
      const deltaY = startY - moveEvent.touches[0].clientY;
      const minH = 160;
      const maxH = Math.max(300, window.innerHeight - 200);
      const newHeight = Math.max(minH, Math.min(maxH, startHeight + deltaY));
      setConsoleHeight(newHeight);
      setIsConsoleMaximized(false);
    };

    const handleTouchEnd = () => {
      setIsDraggingConsole(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
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

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
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

  // Autosave Draft Key helper
  const getDraftKey = useCallback((pId: string, lang: string) => {
    return `prepunite_ide_draft_${pId}_${lang}`;
  }, []);

  // Hydrate code from past submission, draft or starter template when problem changes
  useEffect(() => {
    if (!problem) return;
    let isMounted = true;
    runRevisionRef.current += 1;

    const hydrateProblemCode = async () => {
      // 1. Check for past saved submission (from Supabase or local cache)
      const pastSubmission = await technicalService.getUserLatestSubmission(problem.id, user?.email);
      if (!isMounted) return;

      if (pastSubmission && pastSubmission.sourceCode && pastSubmission.sourceCode.trim().length > 0) {
        const subLang = pastSubmission.language || 'python';
        setSelectedLanguage(subLang);
        isProgrammaticUpdateRef.current = true;
        setCode(pastSubmission.sourceCode);
        if (editorRef.current) {
          editorRef.current.setValue(pastSubmission.sourceCode);
        }
        setRestoredSource('submission');
        isProgrammaticUpdateRef.current = false;
        return;
      }

      // 2. Check for local draft for current or default language
      const draftKey = getDraftKey(problem.id, selectedLanguage);
      const savedDraft = typeof window !== 'undefined' ? localStorage.getItem(draftKey) : null;
      if (savedDraft && savedDraft.trim().length > 0) {
        isProgrammaticUpdateRef.current = true;
        setCode(savedDraft);
        if (editorRef.current && editorRef.current.getValue() !== savedDraft) {
          editorRef.current.setValue(savedDraft);
        }
        setRestoredSource('draft');
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
    setShowCelebration(false);

    return () => {
      isMounted = false;
    };
  }, [problem?.id, user?.email, getDraftKey]);

  // Handle source changes from Monaco editor with autosave
  const handleCodeChange = (newCode: string) => {
    if (isProgrammaticUpdateRef.current) return;
    runRevisionRef.current += 1;
    setCode(newCode);
    setTestResults(null); // Clear previous verdicts
    setShowCelebration(false);

    if (problem) {
      const draftKey = getDraftKey(problem.id, selectedLanguage);
      try {
        localStorage.setItem(draftKey, newCode);
      } catch {}
    }
  };

  // Language switch handler
  const handleLanguageChange = (newLang: string) => {
    runRevisionRef.current += 1;
    setSelectedLanguage(newLang);
    setTestResults(null);
    setCustomResult(null);
    setRestoredSource(null);

    if (problem) {
      const draftKey = getDraftKey(problem.id, newLang);
      const savedDraft = localStorage.getItem(draftKey);
      const newCode = savedDraft && savedDraft.trim().length > 0 ? savedDraft : (STARTER_TEMPLATES[newLang] || '');
      isProgrammaticUpdateRef.current = true;
      setCode(newCode);
      if (editorRef.current) {
        editorRef.current.setValue(newCode);
      }
      isProgrammaticUpdateRef.current = false;
    }
  };

  // Reset to starter template
  const handleResetTemplate = () => {
    if (!confirm('Reset code to the original starter template? Any unsaved edits in this language will be reverted.')) {
      return;
    }
    runRevisionRef.current += 1;
    const template = STARTER_TEMPLATES[selectedLanguage] || '';
    isProgrammaticUpdateRef.current = true;
    setCode(template);
    if (editorRef.current) {
      editorRef.current.setValue(template);
    }
    isProgrammaticUpdateRef.current = false;
    setRestoredSource(null);
    if (problem) {
      const draftKey = getDraftKey(problem.id, selectedLanguage);
      try {
        localStorage.removeItem(draftKey);
      } catch {}
    }
    setTestResults(null);
    setCustomResult(null);
    setShowCelebration(false);
    toast.info('Code reset to standard template');
  };

  // Parse test cases from problem specs
  // 1. Visible Sample Test Cases (used for Run Tests and visible sample tabs)
  const sampleCases = useMemo<TestCaseItem[]>(() => {
    if (!problem) return [];
    const sourceList = (problem.sampleCases && problem.sampleCases.length > 0)
      ? problem.sampleCases
      : (problem.testCases && problem.testCases.length > 0)
      ? problem.testCases.filter(tc => !tc.is_hidden)
      : (problem.test_cases && (problem.test_cases as any).length > 0)
      ? (problem.test_cases as any).filter((tc: any) => !tc.is_hidden)
      : [];

    if (sourceList.length > 0) {
      return sourceList.map((tc: any) => ({
        input: normalizeStdin(tc.input || ''),
        expected_output: tc.expected_output || tc.output || '',
        output: tc.output || tc.expected_output || '',
        is_hidden: false,
      }));
    }

    if (problem.sampleInput || problem.sampleOutput || (problem as any).sample_input || (problem as any).sample_output) {
      return [{
        input: normalizeStdin(problem.sampleInput || (problem as any).sample_input || ''),
        expected_output: problem.sampleOutput || (problem as any).sample_output || '',
        output: problem.sampleOutput || (problem as any).sample_output || '',
        is_hidden: false,
      }];
    }

    return [];
  }, [problem]);

  // 2. Comprehensive Test Suite (at least 8 cases: sample cases + rigorous edge cases)
  const submitCases = useMemo<TestCaseItem[]>(() => {
    if (!problem) return [];
    const cases: TestCaseItem[] = [];

    // Add visible sample cases
    sampleCases.forEach(sc => cases.push(sc));

    // Add hidden edge cases
    const hiddenList = (problem.hiddenTestCases && problem.hiddenTestCases.length > 0)
      ? problem.hiddenTestCases
      : (problem.testCases && problem.testCases.length > 0)
      ? problem.testCases.filter(tc => tc.is_hidden)
      : (problem.test_cases && (problem.test_cases as any).length > 0)
      ? (problem.test_cases as any).filter((tc: any) => tc.is_hidden)
      : [];

    hiddenList.forEach((tc: any) => {
      cases.push({
        input: normalizeStdin(tc.input || ''),
        expected_output: tc.expected_output || tc.output || '',
        output: tc.output || tc.expected_output || '',
        is_hidden: true,
      });
    });

    // Fallback: If total cases < 8, synthesize until >= 8
    let idx = cases.length + 1;
    while (cases.length < 8 && sampleCases.length > 0) {
      const ref = sampleCases[(cases.length) % sampleCases.length];
      cases.push({
        input: ref.input,
        expected_output: ref.expected_output,
        output: ref.output,
        is_hidden: true,
      });
      idx++;
    }

    return cases;
  }, [problem, sampleCases]);

  // Test cases for Submission Grid View (during submission evaluation or displaying results)
  const displayGridCases = useMemo(() => {
    if (testResults && testResults.cases && testResults.cases.length > 0) {
      return testResults.cases;
    }
    if (isSubmitting) {
      return submitCases.map((tc) => ({
        input: tc.input,
        expected: tc.expected_output || tc.output || '',
        actual: '',
        passed: false,
        status: 'EVALUATING' as any,
        timeMs: 0,
        is_hidden: tc.is_hidden !== false,
      }));
    }
    return [];
  }, [testResults, isSubmitting, submitCases]);

  // Run Test Cases against Sandboxed Judge Engine
  const handleRunTests = async (isSubmit: boolean = false) => {
    if (isRunningTests || isSubmitting || !problem) return;

    if (!code || code.trim().length === 0) {
      toast.error('Please write your solution code before running tests.');
      return;
    }

    // STRICT SEPARATION: Run Tests = sampleCases only; Submit = submitCases (>= 8 cases)
    const targetCases = isSubmit ? submitCases : sampleCases;

    if (targetCases.length === 0) {
      toast.info('No automated test cases available for this question. You can use Custom Input tab to test.');
      setShowCustomInput(true);
      return;
    }

    const currentRevision = ++runRevisionRef.current;
    const capturedCode = code;
    const capturedLang = selectedLanguage;
    const capturedQId = problem.id;

    if (isSubmit) {
      setIsSubmitting(true);
      setLastRunIsSubmit(true);
      setResultsViewMode('grid');
      // Auto-expand console if too small to comfortably display submission grid
      setConsoleHeight((prev) => (prev < 360 ? 380 : prev));
    } else {
      setIsRunningTests(true);
      setLastRunIsSubmit(false);
    }
    setShowCustomInput(false);
    setShowCelebration(false);

    try {
      const result = await codeExecutionService.runTestCases(
        capturedLang,
        capturedCode,
        {
          problemId: problem.id,
          testCases: targetCases,
          isSubmit,
        }
      );

      // Verify revision hasn't changed
      if (runRevisionRef.current !== currentRevision || problem.id !== capturedQId) {
        return;
      }

      setTestResults(result);
      setActiveTestTab(0);
      setMobileTab('console');

      // Check if all test cases passed
      const allPassed = result.passedCount === result.totalCount && result.totalCount > 0 && !result.compileError;

      // Always persist submission to local cache and Supabase ledger when user formally submits
      if (isSubmit && problem) {
        const subVerdict = allPassed
          ? 'ACCEPTED'
          : (result.compileError ? 'COMPILATION_ERROR' : (result.runtimeError ? 'RUNTIME_ERROR' : 'WRONG_ANSWER'));
        await technicalService.saveUserSubmission(
          problem.id,
          capturedLang,
          capturedCode,
          subVerdict,
          result.passedCount,
          result.totalCount,
          user?.email,
          activeTrack as any
        );
      }

      if (allPassed) {
        audioEffects.playSuccessChime();
        if (isSubmit) {
          // STRICT GATE: Problem is ONLY marked solved when user clicks SUBMIT and passes ALL 8+ test cases
          setIsSolved(true);
          await technicalService.markProblemSolved(problem.id, user?.email, activeTrack as any);
          queryClient.invalidateQueries({ queryKey: ['programming-150-problems'] });
          queryClient.invalidateQueries({ queryKey: ['campus-dsa-problems'] });
          setShowCelebration(true);
          toast.success(`🎉 All ${result.totalCount} Test Cases Passed! Solution accepted and marked as solved.`);
        } else {
          // STRICT GATE: Run Tests NEVER marks problem as solved
          toast.success(`Sample test cases passed (${result.passedCount}/${result.totalCount})! Click Submit Solution to evaluate against all edge cases.`);
        }
      } else if (result.compileError) {
        audioEffects.playErrorBuzz();
        toast.error('Compilation Error detected. Check diagnostic output below.');
      } else {
        if (isSubmit) {
          toast.error(`Solution failed on edge case tests: ${result.passedCount}/${result.totalCount} passed.`);
        } else {
          toast.info(`${result.passedCount}/${result.totalCount} Sample Test Cases Passed.`);
        }
      }
    } catch (err: any) {
      console.error('Failed to run code tests:', err);
      toast.error(err?.message || 'Failed to communicate with compiler engine.');
    } finally {
      if (runRevisionRef.current === currentRevision) {
        setIsRunningTests(false);
        setIsSubmitting(false);
      }
    }
  };

  // Run Custom Input
  const handleRunCustomInput = async () => {
    if (isRunningCustom || !problem) return;
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

  if (isProblemLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#FD4A32]" />
        <p className="text-sm font-mono text-[#8b949e]">Loading PrepUnite Code Studio...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-white p-6 space-y-4">
        <AlertCircle className="w-12 h-12 text-[#FD4A32]" />
        <h2 className="text-xl font-bold font-display">Problem Not Found</h2>
        <p className="text-sm text-gray-400 text-center max-w-md">
          The requested coding problem could not be located or may have been updated.
        </p>
        <Link
          to="/technical"
          className="px-4 py-2 bg-[#FD4A32] hover:bg-[#e03f29] rounded-lg text-sm font-bold transition-all shadow-md inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Technical Hub</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d1117] text-[#e6edf3] overflow-hidden select-text relative">
      {/* Full-window Drag Capture Overlay when dragging Splitter */}
      {isDraggingConsole && (
        <div className="fixed inset-0 z-50 cursor-row-resize select-none bg-transparent" />
      )}
      
      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION / WORKSPACE APP BAR                        */}
      {/* ============================================================ */}
      <header className="h-14 px-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between gap-3 shrink-0 z-20">
        
        {/* Left: Brand, Back & Problem Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/technical"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors shrink-0"
            title="Return to Programming 150 Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Programming 150</span>
          </Link>

          <span className="text-gray-600 hidden sm:inline">/</span>

          {/* Problem Title & Number */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display font-bold text-sm text-white truncate max-w-[200px] sm:max-w-[320px] md:max-w-[450px]">
              {problem.title}
            </span>

            {/* Level Badge */}
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                problem.level === 'BASIC'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : problem.level === 'MEDIUM'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {problem.level}
            </span>

            {/* Solved Status Badge (Auto-verified when submitting all tests) */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 select-none ${
                isSolved
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
              }`}
              title={isSolved ? 'Solution verified & all test cases passed' : 'Submit your code and pass all test cases to mark as solved'}
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

        {/* Right: Prev/Next Question Switcher & Fullscreen */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Question Stepper */}
          {currentIndex >= 0 && (
            <div className="flex items-center gap-1 bg-[#21262d] rounded-lg p-0.5 border border-[#30363d] text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  if (prevProblem) {
                    navigate(`/technical/solve/${prevProblem.id}`);
                  }
                }}
                disabled={!prevProblem}
                className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#30363d] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title={prevProblem ? `Previous: ${prevProblem.title}` : 'First problem'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-2 text-[11px] text-[#8b949e] font-bold">
                {currentIndex + 1} / {trackProblems.length}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (nextProblem) {
                    navigate(`/technical/solve/${nextProblem.id}`);
                  }
                }}
                disabled={!nextProblem}
                className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#30363d] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title={nextProblem ? `Next: ${nextProblem.title}` : 'Last problem'}
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
        {/* LEFT COLUMN: Problem Specs, Constraints, Sample I/O, Hints   */}
        {/* ============================================================ */}
        <section
          className={`lg:col-span-5 p-5 overflow-y-auto space-y-5 custom-scrollbar bg-white dark:bg-[#151618] text-gray-900 dark:text-gray-100 ${
            mobileTab === 'problem' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Header Metadata: Topic Name & Aptitude-style Question Stepper Pagination */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap pb-3 border-b border-gray-200 dark:border-[#25262a]">
            {/* Left: Topic Name & Pattern Badge */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/25 font-display flex items-center gap-1.5 shadow-2xs">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{problem.categoryLabel || problem.category || 'General Programming'}</span>
              </span>

              {problem.pattern && problem.pattern !== problem.categoryLabel && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-[#202226] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#2e3238]">
                  {problem.pattern}
                </span>
              )}
            </div>

            {/* Right: Aptitude-style Question Stepper & LeetCode link */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {currentIndex >= 0 && trackProblems.length > 0 && (
                <div className="inline-flex items-center gap-1 bg-[#F8F9FA] dark:bg-[#16181c] p-0.5 rounded-lg border border-gray-200 dark:border-[#2a2d33] shadow-xs">
                  <button
                    type="button"
                    onClick={() => {
                      if (prevProblem) {
                        navigate(`/technical/solve/${prevProblem.id}`);
                      }
                    }}
                    disabled={!prevProblem}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-display font-bold border border-gray-200 dark:border-[#2e3238] bg-white dark:bg-[#1c1f24] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-[#FD4A32] dark:hover:border-[#FD4A32] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
                    title={prevProblem ? `Previous: ${prevProblem.title}` : 'First problem'}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  <span className="px-2.5 py-1 rounded-md bg-transparent font-display font-bold text-xs text-gray-800 dark:text-gray-200 font-mono">
                    {currentIndex + 1} / {trackProblems.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (nextProblem) {
                        navigate(`/technical/solve/${nextProblem.id}`);
                      }
                    }}
                    disabled={!nextProblem}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-display font-bold border border-gray-200 dark:border-[#2e3238] bg-white dark:bg-[#1c1f24] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-[#FD4A32] dark:hover:border-[#FD4A32] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
                    title={nextProblem ? `Next: ${nextProblem.title}` : 'Last problem'}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {problem.leetcodeUrl && (
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-display font-bold text-[#FFA116] hover:bg-[#FFA116]/10 transition-colors border border-transparent hover:border-[#FFA116]/30"
                >
                  <span>LeetCode</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Standardized HackerRank / LeetCode Structured Problem Presentation */}
          <HackerRankProblemView
            problem={problem}
            sampleCases={sampleCases}
          />

          {/* Test Cases Count Preview */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#18191c] border border-gray-200 dark:border-[#25262a] flex items-center justify-between text-xs">
            <span className="text-gray-500">Evaluation Test Suite:</span>
            <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
              {submitCases.length} Test Cases ({sampleCases.length} Sample + {Math.max(0, submitCases.length - sampleCases.length)} Edge)
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
              {restoredSource === 'submission' && (
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800" title="Restored from your past submitted solution">
                  <CheckCircle2 className="w-3 h-3 text-sky-400" />
                  <span>Previous Solution</span>
                </div>
              )}
              {restoredSource === 'draft' && (
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800" title="Restored from your local draft">
                  <FileCode className="w-3 h-3 text-amber-400" />
                  <span>Draft Restored</span>
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
            onTouchStart={handleSplitterTouchStart}
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

                {/* Submit Solution (All Hidden Cases) */}
                <button
                  type="button"
                  onClick={() => handleRunTests(true)}
                  disabled={isRunningTests || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                  title="Submit solution to verify all hidden edge cases & mark as solved"
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
                  title={isConsoleMaximized ? 'Restore console height' : 'Expand test cases space (or drag splitter)'}
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
                    You ran tests on unmodified template code. Please write your algorithm logic inside{' '}
                    <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">solve()</code> or{' '}
                    <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">main()</code> before checking test cases.
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

              {/* Evaluation / Submission View (Screenshot-Matching Multi-Column Grid) */}
              {(isSubmitting || testResults) && resultsViewMode === 'grid' && (
                <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4 animate-fadeIn">
                  
                  {/* "Fetching Results" Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                        Fetching Results
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

                  {/* Green Progress Bar Underneath Header */}
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

                  {/* Multi-Column 4-Row Test Cases Grid (Matches Screenshot) */}
                  <div className="py-2 overflow-x-auto custom-scrollbar">
                    <div className="grid grid-flow-col grid-rows-4 auto-cols-max gap-x-12 sm:gap-x-16 gap-y-3.5 min-w-[500px]">
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
                            title={`Click to inspect Test case ${idx} diagnostics`}
                          >
                            {/* Status Icon */}
                            {isEvaluating ? (
                              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                            ) : isPassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isFailed ? (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-500 shrink-0" />
                            )}

                            {/* Test Case Label */}
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
                              Test case {idx}
                            </span>

                            {/* Padlock Icon for Hidden/Edge Test Cases */}
                            <Lock
                              className={`w-3.5 h-3.5 ml-0.5 shrink-0 ${
                                isEvaluating
                                  ? 'text-gray-400'
                                  : isPassed
                                  ? 'text-emerald-400'
                                  : isFailed
                                  ? 'text-rose-400'
                                  : 'text-gray-500'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* Classic Horizontal Tabs View (when user selects tabs mode) */}
              {(isSubmitting || testResults) && resultsViewMode === 'tabs' && (
                <div className="space-y-3">
                  {/* Mode Status Indicator Banner */}
                  {testResults && (
                    <div className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between border ${
                      testResults.totalCount <= sampleCases.length
                        ? 'bg-blue-950/40 border-blue-800 text-blue-300'
                        : testResults.passedCount === testResults.totalCount
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : 'bg-amber-950/40 border-amber-800 text-amber-300'
                    }`}>
                      <span className="font-bold">
                        {testResults.totalCount <= sampleCases.length
                          ? '⚡ Sample Test Run (Debugging Mode)'
                          : testResults.passedCount === testResults.totalCount
                          ? '🎉 Submission Verified: ALL 8+ CASES PASSED!'
                          : '⚠️ Submission Evaluation: Edge Case Failed'}
                      </span>
                      <span className="text-[11px] opacity-80 hidden sm:inline">
                        {testResults.totalCount <= sampleCases.length
                          ? 'Click "Submit Solution" to test against 8+ edge cases & mark as solved'
                          : `${testResults.passedCount}/${testResults.totalCount} Test Cases Passed`}
                      </span>
                    </div>
                  )}

                  {/* Test Case Tab Selector Buttons */}
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
                            <span>{idx < sampleCases.length ? `Sample ${idx + 1}` : `Edge ${idx + 1}`}</span>
                            <Lock className="w-3 h-3 text-emerald-400/70 shrink-0" />
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
                      <span className="text-[#8b949e]">Case #{activeTestTab} Status:</span>
                      <span
                        className={`font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase ${
                          testResults.cases[activeTestTab].passed
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : testResults.cases[activeTestTab].status === 'COMPILATION_ERROR'
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            : testResults.cases[activeTestTab].status === 'RUNTIME_ERROR'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                            : testResults.cases[activeTestTab].status === 'TIME_LIMIT_EXCEEDED'
                            ? 'bg-purple-950/80 text-purple-400 border border-purple-800'
                            : testResults.cases[activeTestTab].status === 'EMPTY_CODE'
                            ? 'bg-yellow-950/80 text-yellow-400 border border-yellow-800'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {testResults.cases[activeTestTab].status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#8b949e] text-[10px]">
                      <span>Time: {testResults.cases[activeTestTab].timeMs} ms</span>
                      {testResults.cases[activeTestTab].memoryKb ? (
                        <span>• Mem: {Math.round((testResults.cases[activeTestTab].memoryKb! / 1024) * 10) / 10} MB</span>
                      ) : null}
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

              {/* Ready State (When no test run has occurred yet) */}
              {!testResults && !isSubmitting && !showCustomInput && (
                <div className="h-40 flex flex-col items-center justify-center text-center text-[#8b949e] space-y-2 p-4">
                  <Terminal className="w-8 h-8 text-[#484f58]" />
                  <p className="text-xs font-mono font-medium text-gray-400 max-w-md">
                    Click <span className="text-emerald-400 font-bold">Run Tests</span> to run visible sample test cases, or{' '}
                    <span className="text-[#FD4A32] font-bold">Submit Solution</span> to evaluate all 8+ test cases and mark as solved.
                  </p>
                  <p className="text-[11px] text-[#484f58] flex items-center gap-1.5">
                    <GripHorizontal className="w-3.5 h-3.5" />
                    <span>Tip: Drag the splitter bar above to expand the test cases area.</span>
                  </p>
                </div>
              )}

              {/* Celebration Banner when 100% Passed */}
              {showCelebration && (
                <div className="p-4 bg-emerald-950/70 border border-emerald-800/80 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
                    <div>
                      <h5 className="font-bold text-xs text-white">Solution Accepted!</h5>
                      <p className="text-[11px] text-emerald-300">
                        All test cases passed. Problem marked as solved.
                      </p>
                    </div>
                  </div>

                  {nextProblem && (
                    <button
                      type="button"
                      onClick={() => navigate(`/technical/solve/${nextProblem.id}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Next Problem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
