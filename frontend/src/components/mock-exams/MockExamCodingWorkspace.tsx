import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Code2,
  Terminal,
  Play,
  RotateCcw,
  Check,
  Copy,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Sparkles,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import QuestionRichContent from '@/components/QuestionRichContent';
import type { StudentExamResponse } from '@/types/tpo';
import {
  codeExecutionService,
  isTemplateOrEmptyCode,
  normalizeStdin,
  STARTER_TEMPLATES,
  LANGUAGE_LABELS,
  type TestCaseRunResult,
  type EvaluatedTestCase,
} from '@/services/codeExecution.service';
import Editor from '@monaco-editor/react';

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

interface MockExamCodingWorkspaceProps {
  question: {
    id: string;
    title?: string;
    statement: string;
    passage?: string;
    constraints?: string;
    sample_input?: string;
    sample_output?: string;
    explanation?: string;
    test_cases?: TestCaseItem[];
    solutions?: Record<string, string>;
    difficulty?: string;
  };
  sectionName?: string;
  questionIndex: number;
  totalQuestions: number;
  marksPerCorrect: number;
  negativeMarking: number;
  savedResponse?: StudentExamResponse;
  onUpdateCode: (code: string, language: string, testCasesPassed?: number, totalTestCases?: number) => void;
  onClearCode: () => void;
  onToggleReview: () => void;
  isMarkedReview: boolean;
  onPrev: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isLastSection: boolean;
  nextSectionName?: string;
}

export default function MockExamCodingWorkspace({
  question,
  sectionName,
  questionIndex,
  totalQuestions,
  marksPerCorrect,
  negativeMarking,
  savedResponse,
  onUpdateCode,
  onClearCode,
  onToggleReview,
  isMarkedReview,
  onPrev,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  isLastSection,
  nextSectionName,
}: MockExamCodingWorkspaceProps) {
  const initialLang = savedResponse?.code_language || 'python';
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLang);
  const [code, setCode] = useState<string>(
    savedResponse?.code_solution || STARTER_TEMPLATES[initialLang] || STARTER_TEMPLATES.python
  );

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState<number>(0);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseRunResult | null>(null);

  const editorRef = useRef<any>(null);
  // Run revision tracker to invalidate in-flight async results if candidate edits code or changes language
  const runRevisionRef = useRef(0);

  // Sync state if savedResponse changes (e.g. Navigating between questions)
  useEffect(() => {
    runRevisionRef.current += 1;
    const lang = savedResponse?.code_language || 'python';
    setSelectedLanguage(lang);
    const initialCode = savedResponse?.code_solution || STARTER_TEMPLATES[lang] || STARTER_TEMPLATES.python;
    setCode(initialCode);
    if (editorRef.current && editorRef.current.getValue() !== initialCode) {
      editorRef.current.setValue(initialCode);
    }
    setTestResults(null);
    setActiveTestTab(0);
  }, [question.id]);

  // Handle language switch
  const handleLanguageChange = (newLang: string) => {
    runRevisionRef.current += 1;
    setSelectedLanguage(newLang);
    setTestResults(null); // Clear displayed test results on language change
    // If the candidate hasn't modified the default code for old language, switch to new template
    const oldTemplate = STARTER_TEMPLATES[selectedLanguage];
    if (!code || code.trim() === oldTemplate?.trim()) {
      const newCode = STARTER_TEMPLATES[newLang] || '';
      setCode(newCode);
      if (editorRef.current) {
        editorRef.current.setValue(newCode);
      }
      onUpdateCode(newCode, newLang);
    } else {
      onUpdateCode(code, newLang);
    }
  };

  // Reset to starter template
  const handleResetTemplate = () => {
    runRevisionRef.current += 1;
    const template = STARTER_TEMPLATES[selectedLanguage] || '';
    setCode(template);
    if (editorRef.current) {
      editorRef.current.setValue(template);
    }
    onUpdateCode(template, selectedLanguage, 0, testCases.length);
    setTestResults(null);
  };

  // Parse test cases
  const testCases = useMemo<TestCaseItem[]>(() => {
    if (question.test_cases && question.test_cases.length > 0) {
      return question.test_cases.map(tc => ({
        ...tc,
        input: normalizeStdin(tc.input),
      }));
    }
    const sampleCases: TestCaseItem[] = [];
    if (question.sample_input || question.sample_output) {
      sampleCases.push({
        input: normalizeStdin(question.sample_input || ''),
        expected_output: question.sample_output || '',
      });
    }
    return sampleCases;
  }, [question.test_cases, question.sample_input, question.sample_output]);

  const displaySampleInput = useMemo(() => normalizeStdin(question.sample_input || ''), [question.sample_input]);

  const handleCodeChange = (newCode: string) => {
    runRevisionRef.current += 1;
    setCode(newCode);
    setTestResults(null); // Clear displayed test verdicts immediately on source modification
    onUpdateCode(newCode, selectedLanguage);
  };

  // Copy helpers
  const copyToClipboard = (text: string, type: 'input' | 'output') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'input') {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  // Run Real Sandboxed Tests via Judge0 Engine + Pre-Execution Empty Code Guard & Revision Validation
  const handleRunTests = async () => {
    if (isRunningTests) return;

    if (!code || code.trim().length === 0) {
      alert('Please write your solution code before running tests.');
      return;
    }

    if (testCases.length === 0) {
      alert('No test cases are available for this problem.');
      return;
    }

    const currentRevision = ++runRevisionRef.current;
    const capturedCode = code;
    const capturedLang = selectedLanguage;
    const capturedQId = question.id;

    setIsRunningTests(true);

    try {
      const result = await codeExecutionService.runTestCases(
        capturedLang,
        capturedCode,
        testCases
      );

      // Discard async results if code, language, or question changed while tests were running
      if (runRevisionRef.current !== currentRevision || question.id !== capturedQId) {
        return;
      }

      setTestResults(result);
      setActiveTestTab(0);

      // Persist test pass count to student response record
      onUpdateCode(capturedCode, capturedLang, result.passedCount, result.totalCount);
    } catch (err: any) {
      console.error('Failed to run code tests:', err);
    } finally {
      if (runRevisionRef.current === currentRevision) {
        setIsRunningTests(false);
      }
    }
  };

  const displaySectionName = useMemo(() => {
    if (!sectionName) return 'Hands-on Coding Assessment';
    const lower = sectionName.toLowerCase();
    if (
      lower.includes('verbal') ||
      lower.includes('reading') ||
      lower.includes('aptitude') ||
      lower.includes('reasoning') ||
      lower.includes('numerical') ||
      lower.includes('quant')
    ) {
      return 'Hands-on Coding Assessment';
    }
    return sectionName;
  }, [sectionName]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#151618] rounded-2xl border border-gray-200 dark:border-[#25262a] shadow-sm overflow-hidden animate-fadeIn">
      {/* Question Header */}
      <div className="px-5 py-3.5 border-b border-gray-200 dark:border-[#25262a] flex items-center justify-between bg-gray-50/70 dark:bg-[#18191c]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Code2 className="w-3.5 h-3.5" />
            Coding Challenge {questionIndex + 1}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-bold hidden sm:inline">
            {displaySectionName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-black">
            +{marksPerCorrect || 10} Marks
          </span>
          {negativeMarking > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 font-black">
              -{negativeMarking} Penalty
            </span>
          )}
        </div>
      </div>

      {/* Main Workspace Body: Two-Pane Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-[#25262a]">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: Problem Statement, Constraints, Sample I/O     */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 p-5 overflow-y-auto space-y-5 custom-scrollbar bg-white dark:bg-[#151618]">
          {/* Title */}
          {question.title && (
            <h3 className="font-display text-lg font-black text-gray-900 dark:text-white">
              {question.title}
            </h3>
          )}

          {/* Problem Statement */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Problem Statement
            </h4>
            <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
              <QuestionRichContent content={question.statement} />
            </div>
          </div>

          {/* Constraints */}
          {(question.constraints || question.passage) && (
            <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Constraints</span>
              </div>
              <div className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {question.constraints || question.passage}
              </div>
            </div>
          )}

          {/* Sample Input / Output */}
          {(question.sample_input || question.sample_output) && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Sample Test Case
              </h4>

              {displaySampleInput && (
                <div className="rounded-xl border border-gray-200 dark:border-[#2d3036] overflow-hidden">
                  <div className="px-3 py-1.5 bg-gray-100 dark:bg-[#1f2125] flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span>Sample Input</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(displaySampleInput, 'input')}
                      className="inline-flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white"
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

              {question.sample_output && (
                <div className="rounded-xl border border-gray-200 dark:border-[#2d3036] overflow-hidden">
                  <div className="px-3 py-1.5 bg-gray-100 dark:bg-[#1f2125] flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span>Sample Output</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(question.sample_output || '', 'output')}
                      className="inline-flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                      {copiedOutput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-gray-50 dark:bg-[#121315] font-mono text-xs text-emerald-600 dark:text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                    {question.sample_output}
                  </pre>
                </div>
              )}

              {question.explanation && (
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 space-y-1">
                  <span className="font-bold block">Explanation:</span>
                  <p className="leading-relaxed">{question.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Test Cases Count Preview */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1c1d20] border border-gray-200 dark:border-[#2b2d31] flex items-center justify-between text-xs">
            <span className="text-gray-500">Evaluation Test Cases:</span>
            <span className="font-mono font-black text-gray-800 dark:text-gray-200">
              {testCases.length} Visible &amp; Hidden Test Cases
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Code Editor & Execution Test Runner Console     */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 flex flex-col min-h-0 bg-[#0d1117] text-[#e6edf3]">
          
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
              <button
                type="button"
                onClick={handleResetTemplate}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8b949e] hover:text-white px-2 py-1 rounded hover:bg-[#21262d] transition-colors cursor-pointer"
                title="Reset code to standard starter template"
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
          <div className="flex-1 relative flex flex-col overflow-hidden min-h-[340px] bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={MONACO_LANGUAGE_MAP[selectedLanguage] || 'python'}
              value={code}
              theme="vs-dark"
              onChange={(val) => handleCodeChange(val || '')}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                  handleRunTests();
                });
              }}
              options={{
                fontSize: 14,
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

          {/* Test Runner & Execution Console */}
          <div className="border-t border-[#30363d] bg-[#161b22] shrink-0 flex flex-col">
            
            {/* Runner Action Toolbar */}
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#21262d]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isRunningTests ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling &amp; Testing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Sample Tests</span>
                    </>
                  )}
                </button>

                {testResults && (
                  <span
                    className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg ${
                      testResults.passedCount === testResults.totalCount
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {testResults.passedCount}/{testResults.totalCount} Test Cases Passed
                  </span>
                )}
              </div>

              <div className="text-[11px] text-[#8b949e] font-mono hidden sm:inline">
                Ctrl/Cmd + Enter to run
              </div>
            </div>

            {/* Test Results Output Tabs & Viewer */}
            {testResults && (
              <div className="p-3.5 bg-[#0d1117] space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                
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

                {/* 3. Test Case Selectors */}
                {testResults.cases.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {testResults.cases.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTestTab(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
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
                        <span>Case {idx + 1}</span>
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

          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* BOTTOM CONTROL TOOLBAR (Sync with Examination Navigation)    */}
      {/* ============================================================ */}
      <div className="px-5 py-3 border-t border-gray-200 dark:border-[#25262a] bg-white dark:bg-[#151618] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleReview}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              isMarkedReview
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            {isMarkedReview ? 'Marked for Review' : 'Mark for Review'}
          </button>

          <button
            type="button"
            onClick={onClearCode}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirstQuestion}
            className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#383a40] disabled:opacity-40 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#202225] transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
            Prev
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-4 py-1.5 rounded-lg bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
          >
            {isLastQuestion && !isLastSection ? (
              <>
                Next Section: {nextSectionName || 'Next'}
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            ) : isLastQuestion && isLastSection ? (
              <>
                Review &amp; Submit Exam
                <Send className="w-3.5 h-3.5 ml-1" />
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
