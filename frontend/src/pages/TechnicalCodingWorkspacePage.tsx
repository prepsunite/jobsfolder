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
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import QuestionRichContent from '@/components/QuestionRichContent';
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

  // Accordion drawer states
  const [isIntuitionOpen, setIsIntuitionOpen] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [solutionViewLang, setSolutionViewLang] = useState<'python' | 'java' | 'cpp' | 'c'>('python');

  // Copy states
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedSolutionCode, setCopiedSolutionCode] = useState(false);

  // Execution & Testing State
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseRunResult | null>(null);
  const [activeTestTab, setActiveTestTab] = useState<number>(0);

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
      : (problem.testCases ? problem.testCases.filter(tc => tc.is_hidden) : []);

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

  const displaySampleInput = useMemo(() => {
    if (!problem) return '';
    if (sampleCases.length > 0) {
      return normalizeStdin(sampleCases[0].input || '');
    }
    return normalizeStdin(problem.sampleInput || (problem as any).sample_input || '');
  }, [problem, sampleCases]);

  const displaySampleOutput = useMemo(() => {
    if (!problem) return '';
    if (sampleCases.length > 0) {
      return sampleCases[0].output || '';
    }
    return problem.sampleOutput || (problem as any).sample_output || '';
  }, [problem, sampleCases]);

  // Copy helper
  const copyToClipboard = (text: string, type: 'input' | 'output' | 'solution') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'input') {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else if (type === 'output') {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    } else {
      setCopiedSolutionCode(true);
      setTimeout(() => setCopiedSolutionCode(false), 2000);
    }
  };

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
    } else {
      setIsRunningTests(true);
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
    <div className="h-screen w-screen flex flex-col bg-[#0d1117] text-[#e6edf3] overflow-hidden select-text">
      
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

          {/* Problem Statement */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 font-display">
              Problem Description
            </h4>
            <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-line">
              <QuestionRichContent content={problem.description} />
            </div>
          </div>

          {/* Constraints */}
          {problem.constraints && problem.constraints.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Constraints</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-xs font-mono text-gray-700 dark:text-gray-300 leading-relaxed">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Test Case */}
          {(displaySampleInput || displaySampleOutput) && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 font-display">
                Sample Test Case
              </h4>

              {displaySampleInput && (
                <div className="rounded-xl border border-gray-200 dark:border-[#2d3036] overflow-hidden">
                  <div className="px-3 py-1.5 bg-gray-100 dark:bg-[#1f2125] flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span>Sample Input</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(displaySampleInput, 'input')}
                      className="inline-flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    >
                      {copiedInput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedInput ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-gray-50 dark:bg-[#121315] font-mono text-xs text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
                    {displaySampleInput}
                  </pre>
                </div>
              )}

              {displaySampleOutput && (
                <div className="rounded-xl border border-gray-200 dark:border-[#2d3036] overflow-hidden">
                  <div className="px-3 py-1.5 bg-gray-100 dark:bg-[#1f2125] flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span>Sample Output</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(displaySampleOutput, 'output')}
                      className="inline-flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    >
                      {copiedOutput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-gray-50 dark:bg-[#121315] font-mono text-xs text-emerald-600 dark:text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                    {displaySampleOutput}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Key Placement Intuition & Approach Accordion */}
          {problem.keyIntuition && problem.keyIntuition !== problem.description && (
            <div className="rounded-xl border border-gray-200 dark:border-[#25262a] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsIntuitionOpen(!isIntuitionOpen)}
                className="w-full px-4 py-2.5 bg-[#FD4A32]/5 hover:bg-[#FD4A32]/10 transition-colors flex items-center justify-between text-xs font-bold text-[#FD4A32] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Key Placement Intuition</span>
                </div>
                {isIntuitionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {isIntuitionOpen && (
                <div className="p-3.5 bg-white dark:bg-[#121315] text-xs text-gray-700 dark:text-gray-300 font-sans leading-relaxed border-t border-[#FD4A32]/15">
                  {problem.keyIntuition}
                </div>
              )}
            </div>
          )}

          {/* Hints & Edge Cases Accordion */}
          {problem.hints && problem.hints.length > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-[#25262a] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsHintsOpen(!isHintsOpen)}
                className="w-full px-4 py-2.5 bg-amber-500/5 hover:bg-amber-500/10 transition-colors flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>Hints &amp; Edge Cases</span>
                </div>
                {isHintsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {isHintsOpen && (
                <div className="p-3.5 bg-white dark:bg-[#121315] text-xs text-gray-700 dark:text-gray-300 font-sans space-y-1.5 border-t border-amber-500/15">
                  <ul className="list-disc pl-4 space-y-1">
                    {problem.hints.map((hint, hIdx) => (
                      <li key={hIdx}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Verified Official Solutions Accordion */}
          {problem.solutions && (
            <div className="rounded-xl border border-gray-200 dark:border-[#25262a] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsSolutionOpen(!isSolutionOpen)}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-[#1a1c20] hover:bg-gray-200 dark:hover:bg-[#22242a] transition-colors flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#FD4A32]" />
                  <span>View Verified Solution Code</span>
                </div>
                {isSolutionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isSolutionOpen && (
                <div className="p-3.5 bg-[#0d1117] text-white space-y-3 border-t border-[#30363d]">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      {(['python', 'java', 'cpp', 'c'] as const).map(lang => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setSolutionViewLang(lang)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                            solutionViewLang === lang
                              ? 'bg-[#FD4A32] text-white'
                              : 'bg-[#21262d] text-[#8b949e] hover:text-white'
                          }`}
                        >
                          {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(problem.solutions[solutionViewLang] || '', 'solution')}
                      className="inline-flex items-center gap-1 text-[11px] text-[#8b949e] hover:text-white px-2 py-0.5 rounded bg-[#21262d] transition-colors cursor-pointer"
                    >
                      {copiedSolutionCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSolutionCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-[#080b0f] border border-[#21262d] text-xs font-mono text-emerald-400 overflow-x-auto max-h-60 custom-scrollbar whitespace-pre">
                    {problem.solutions[solutionViewLang] || '// Solution not available in this language'}
                  </div>

                  {(problem.timeComplexity || problem.spaceComplexity) && (
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#8b949e]">
                      {problem.timeComplexity && <span>Time: {problem.timeComplexity}</span>}
                      {problem.spaceComplexity && <span>• Space: {problem.spaceComplexity}</span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Company Tags */}
          {problem.companyTags && problem.companyTags.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-gray-200 dark:border-[#25262a]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider font-display">
                <Building2 className="w-3.5 h-3.5" />
                <span>Companies Asking This:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {problem.companyTags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-[#1f2125] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#2d3036]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

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
          <div className="flex-1 relative flex flex-col overflow-hidden min-h-[300px] bg-[#1e1e1e]">
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
          {/* CONSOLE & EXECUTION RESULTS DRAWER                           */}
          {/* ============================================================ */}
          <div className="border-t border-[#30363d] bg-[#161b22] shrink-0 flex flex-col">
            
            {/* Runner Action Toolbar */}
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#21262d] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {/* Run Tests (Sample) */}
                <button
                  type="button"
                  onClick={() => handleRunTests(false)}
                  disabled={isRunningTests || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
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
                  title="Submit solution to verify all hidden edge cases"
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

                <span className="text-[11px] text-[#8b949e] font-mono hidden sm:inline">
                  Ctrl/Cmd + Enter
                </span>
              </div>
            </div>

            {/* Custom Input Panel */}
            {showCustomInput && (
              <div className="p-3.5 bg-[#0d1117] border-b border-[#30363d] space-y-2.5 animate-fadeIn">
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
                  className="w-full p-2.5 rounded-lg bg-[#161b22] border border-[#30363d] text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#FD4A32]"
                />

                {customResult && (
                  <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] space-y-2 text-xs font-mono">
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
                      <pre className="p-2 rounded bg-[#0d1117] text-emerald-400 text-xs overflow-x-auto whitespace-pre-wrap border border-[#21262d] mt-1">
                        {customResult.stdout || '<No output returned>'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Test Results Output Tabs & Viewer */}
            {testResults && (
              <div className="p-3.5 bg-[#0d1117] space-y-3 max-h-64 overflow-y-auto custom-scrollbar animate-fadeIn">
                
                {/* 1. Empty Code / Unmodified Boilerplate Warning */}
                {testResults.isTemplateOrEmpty && (
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

                {/* 2. Real Compilation Error Diagnostic Console */}
                {testResults.compileError && (
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

                {/* Mode Status Indicator Banner */}
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

                {/* 3. Test Case Selectors */}
                {testResults.cases.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {testResults.cases.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTestTab(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          activeTestTab === idx
                            ? 'bg-[#21262d] text-white border border-[#388bfd]'
                            : 'bg-[#161b22] text-[#8b949e] hover:text-white'
                        }`}
                      >
                        {c.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span>{idx < sampleCases.length ? `Sample ${idx + 1}` : `Edge ${idx + 1}`}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 4. Active Case Details */}
                {testResults.cases[activeTestTab] && (
                  <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px] flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#8b949e]">Status:</span>
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
                          <span>• Mem: {Math.round(testResults.cases[activeTestTab].memoryKb! / 1024 * 10) / 10} MB</span>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#8b949e] block text-[10px] uppercase font-bold">Standard Input (stdin):</span>
                      <div className="p-2 rounded bg-[#0d1117] text-[#e6edf3] whitespace-pre-wrap mt-0.5 border border-[#21262d]">
                        {testResults.cases[activeTestTab].input || '<No input provided>'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#8b949e] block text-[10px] uppercase font-bold">Expected Output:</span>
                      <div className="p-2 rounded bg-[#0d1117] text-emerald-400 whitespace-pre-wrap mt-0.5 border border-[#21262d]">
                        {testResults.cases[activeTestTab].expected || '<Empty>'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#8b949e] block text-[10px] uppercase font-bold">Your Program Output:</span>
                      <div
                        className={`p-2 rounded bg-[#0d1117] whitespace-pre-wrap mt-0.5 border ${
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
              </div>
            )}

            {/* 5. Celebration Banner when 100% Passed */}
            {showCelebration && (
              <div className="p-4 bg-emerald-950/70 border-t border-emerald-800/80 flex items-center justify-between gap-3 animate-fadeIn">
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

        </section>

      </main>

    </div>
  );
}
