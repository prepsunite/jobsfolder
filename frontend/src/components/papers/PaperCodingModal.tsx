import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Maximize2,
  Minimize2,
  Code2,
  Sparkles,
  Terminal,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import {
  codeExecutionService,
  STARTER_TEMPLATES,
  LANGUAGE_LABELS,
  type TestCaseRunResult,
} from '@/services/codeExecution.service';
import type { PaperQuestion } from '@/utils/paperQuestionParser';

interface PaperCodingModalProps {
  question: PaperQuestion | null;
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  examName?: string;
  isSolved?: boolean;
  onMarkSolved?: (questionId: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { id: 'python', label: 'Python 3' },
  { id: 'cpp', label: 'C++ (GCC)' },
  { id: 'java', label: 'Java' },
  { id: 'c', label: 'C' },
];

export default function PaperCodingModal({
  question,
  isOpen,
  onClose,
  companyName = 'Company',
  examName = 'Placement Drive',
  isSolved = false,
  onMarkSolved,
}: PaperCodingModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'cases' | 'custom' | 'result'>('cases');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<TestCaseRunResult | null>(null);
  const [customOutput, setCustomOutput] = useState<{ stdout: string; stderr: string; timeMs: number } | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // Initialize or reset starter template when question or language changes
  useEffect(() => {
    if (!question) return;
    const storedCodeKey = `paper_code_${question.id}_${selectedLanguage}`;
    const saved = localStorage.getItem(storedCodeKey);
    if (saved) {
      setCode(saved);
    } else {
      const template = STARTER_TEMPLATES[selectedLanguage] || '# Write your solution here\n';
      setCode(template);
    }
    setRunResult(null);
    setCustomOutput(null);
    setSelectedCaseIdx(0);
  }, [question?.id, selectedLanguage]);

  // Auto-save code on change
  const handleCodeChange = (newCode?: string) => {
    const val = newCode || '';
    setCode(val);
    if (question) {
      localStorage.setItem(`paper_code_${question.id}_${selectedLanguage}`, val);
    }
  };

  const handleResetCode = () => {
    const template = STARTER_TEMPLATES[selectedLanguage] || '';
    setCode(template);
    if (question) {
      localStorage.removeItem(`paper_code_${question.id}_${selectedLanguage}`);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunCode = async () => {
    if (!question || isRunning) return;
    setIsRunning(true);
    setActiveTab('result');

    try {
      if (activeTab === 'custom') {
        // Run with custom input
        const exec = await codeExecutionService.execute(selectedLanguage, code, customInput);
        setCustomOutput({
          stdout: exec.stdout || '',
          stderr: exec.stderr || exec.errorMessage || '',
          timeMs: exec.timeMs || 0,
        });
      } else {
        // Run against test cases
        const formattedCases = (question.testCases && question.testCases.length > 0)
          ? question.testCases.map(tc => ({
              input: tc.input,
              expected_output: tc.output,
              output: tc.output,
            }))
          : [{ input: '', expected_output: '', output: '' }];

        const result = await codeExecutionService.runTestCasesDirect(selectedLanguage, code, formattedCases);
        setRunResult(result);

        // Auto-mark solved if all cases passed
        if (result.passedCount === result.totalCount && result.totalCount > 0) {
          if (onMarkSolved) onMarkSolved(question.id);
        }
      }
    } catch (err: any) {
      setRunResult({
        cases: [],
        passedCount: 0,
        totalCount: 0,
        isTemplateOrEmpty: false,
        compileError: null,
        runtimeError: err.message || 'Execution failed',
        summaryMessage: 'Execution failed',
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div
        className={`flex flex-col bg-white dark:bg-[#121212] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${
          isMaximized ? 'w-full h-full rounded-none' : 'w-[96vw] max-w-7xl h-[92vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#181818] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-display font-extrabold text-[#121417] dark:text-white truncate">
                  {question.title}
                </h2>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    question.difficulty === 'BASIC'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : question.difficulty === 'HARD'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {question.difficulty}
                </span>
                {isSolved && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Solved</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#868E96] dark:text-[#666666] truncate font-sans">
                {companyName} • {examName} Official Placement Problem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-[#202020] border border-[#E9ECEF] dark:border-[#333333] text-[#121417] dark:text-[#E9ECEF] focus:outline-hidden focus:border-[#FD4A32]"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>

            {/* Run Button */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-display font-bold bg-[#FD4A32] hover:bg-[#E0351D] text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Code</span>
                </>
              )}
            </button>

            {/* Maximize / Close */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 rounded-lg text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:bg-[#E9ECEF] dark:hover:bg-[#252525] transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#868E96] hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
              title="Close Workspace"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Split Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Column: Problem Details */}
          <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-[#E9ECEF] dark:border-[#242424] overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-6 bg-white dark:bg-[#121212]">
            {/* Problem Statement */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#FD4A32] uppercase tracking-wider font-display">
                Problem Description
              </span>
              <div className="text-xs sm:text-sm text-[#495057] dark:text-[#CCCCCC] leading-relaxed font-sans whitespace-pre-line">
                {question.description || 'No detailed statement provided.'}
              </div>
            </div>

            {/* Constraints */}
            {question.constraints && question.constraints.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#868E96] dark:text-[#888888] uppercase tracking-wider font-display block">
                  Constraints:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-xs font-mono text-[#495057] dark:text-[#CCCCCC]">
                  {question.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sample Cases */}
            {question.testCases && question.testCases.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#868E96] dark:text-[#888888] uppercase tracking-wider font-display block">
                  Sample Test Cases:
                </span>
                <div className="space-y-2.5">
                  {question.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#282828] space-y-2 text-xs font-mono"
                    >
                      <span className="text-[10px] font-bold text-[#FD4A32]">
                        {tc.title || `Test Case #${idx + 1}`}
                      </span>
                      <div>
                        <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">Input:</span>
                        <pre className="text-gray-800 dark:text-gray-200 text-xs overflow-x-auto whitespace-pre-wrap font-mono mt-0.5">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">Expected Output:</span>
                        <pre className="text-emerald-600 dark:text-emerald-400 text-xs font-bold overflow-x-auto whitespace-pre-wrap font-mono mt-0.5">
                          {tc.output}
                        </pre>
                      </div>
                      {tc.explanation && (
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 pt-1 border-t border-[#E9ECEF] dark:border-[#282828] font-sans">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Explanation: </span>
                          {tc.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Monaco Code Editor & Execution Results */}
          <div className="w-full md:w-1/2 flex flex-col min-h-0 bg-[#1E1E1E]">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#333333] bg-[#181818] text-xs font-mono text-[#868E96]">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-[#FD4A32]" />
                <span className="text-white font-bold">{LANGUAGE_LABELS[selectedLanguage] || selectedLanguage}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  title="Copy Code"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleResetCode}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  title="Reset to Starter Template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor Component */}
            <div className="flex-1 min-h-[300px]">
              <Editor
                height="100%"
                language={selectedLanguage === 'c' ? 'c' : selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  lineNumbers: 'on',
                }}
              />
            </div>

            {/* Bottom Testbench & Execution Panel */}
            <div className="h-56 flex flex-col border-t border-[#333333] bg-[#141414]">
              {/* Panel Tabs */}
              <div className="flex items-center justify-between px-4 border-b border-[#282828] bg-[#181818]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('cases')}
                    className={`py-2 px-3 text-xs font-mono font-bold border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'cases'
                        ? 'border-[#FD4A32] text-white'
                        : 'border-transparent text-[#868E96] hover:text-white'
                    }`}
                  >
                    Test Cases ({question.testCases?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className={`py-2 px-3 text-xs font-mono font-bold border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'custom'
                        ? 'border-[#FD4A32] text-white'
                        : 'border-transparent text-[#868E96] hover:text-white'
                    }`}
                  >
                    Custom Input
                  </button>
                  <button
                    onClick={() => setActiveTab('result')}
                    className={`py-2 px-3 text-xs font-mono font-bold border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'result'
                        ? 'border-[#FD4A32] text-white'
                        : 'border-transparent text-[#868E96] hover:text-white'
                    }`}
                  >
                    Execution Result
                  </button>
                </div>

                {onMarkSolved && (
                  <button
                    onClick={() => onMarkSolved(question.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSolved ? 'Completed' : 'Mark as Solved'}</span>
                  </button>
                )}
              </div>

              {/* Panel Content Area */}
              <div className="flex-1 p-3 overflow-y-auto custom-scrollbar text-xs font-mono text-gray-300">
                {activeTab === 'cases' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {question.testCases.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedCaseIdx(idx)}
                          className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                            selectedCaseIdx === idx
                              ? 'bg-[#FD4A32] text-white font-bold'
                              : 'bg-[#222222] text-[#868E96] hover:text-white'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {question.testCases[selectedCaseIdx] && (
                      <div className="space-y-2 pt-1">
                        <div>
                          <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">Input:</span>
                          <pre className="p-2 rounded bg-[#0A0A0A] border border-[#282828] text-gray-200 overflow-x-auto whitespace-pre-wrap">
                            {question.testCases[selectedCaseIdx].input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">Expected Output:</span>
                          <pre className="p-2 rounded bg-[#0A0A0A] border border-[#282828] text-emerald-400 font-bold overflow-x-auto whitespace-pre-wrap">
                            {question.testCases[selectedCaseIdx].output}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'custom' && (
                  <div className="h-full flex flex-col space-y-2">
                    <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">
                      Standard Input (stdin):
                    </span>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter standard input here..."
                      className="flex-1 w-full p-2.5 rounded bg-[#0A0A0A] border border-[#282828] text-gray-200 font-mono text-xs focus:outline-hidden focus:border-[#FD4A32]"
                    />
                  </div>
                )}

                {activeTab === 'result' && (
                  <div>
                    {isRunning ? (
                      <div className="flex items-center justify-center py-8 text-[#868E96] gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#FD4A32]" />
                        <span>Compiling and executing against Judge0...</span>
                      </div>
                    ) : customOutput ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#868E96]">
                          <span>Custom Execution Complete</span>
                          <span>Time: {customOutput.timeMs}ms</span>
                        </div>
                        {customOutput.stderr && (
                          <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                            <span className="font-bold block">Error:</span>
                            <pre className="whitespace-pre-wrap">{customOutput.stderr}</pre>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">Stdout:</span>
                          <pre className="p-2 rounded bg-[#0A0A0A] border border-[#282828] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                            {customOutput.stdout || '(no output)'}
                          </pre>
                        </div>
                      </div>
                    ) : runResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {runResult.passedCount === runResult.totalCount && runResult.totalCount > 0 ? (
                              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Accepted ({runResult.passedCount}/{runResult.totalCount} Passed)</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-rose-400 font-bold">
                                <XCircle className="w-4 h-4" />
                                <span>Wrong Answer ({runResult.passedCount}/{runResult.totalCount} Passed)</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {runResult.runtimeError && (
                          <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                            <span className="font-bold block">Execution Error:</span>
                            <pre className="whitespace-pre-wrap">{runResult.runtimeError}</pre>
                          </div>
                        )}

                        <div className="space-y-2">
                          {runResult.cases.map((c, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded border text-xs ${
                                c.passed
                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span>Test Case {i + 1}</span>
                                <span>{c.passed ? 'PASSED' : 'FAILED'} ({c.timeMs}ms)</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-[11px]">
                                <div>
                                  <span className="text-[#868E96] block text-[10px]">Expected:</span>
                                  <pre className="whitespace-pre-wrap">{c.expected}</pre>
                                </div>
                                <div>
                                  <span className="text-[#868E96] block text-[10px]">Actual:</span>
                                  <pre className="whitespace-pre-wrap">{c.actual || '(no output)'}</pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-[#868E96]">
                        Click "Run Code" above to execute and verify your solution.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
