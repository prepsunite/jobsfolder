import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Lightbulb,
  HelpCircle,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import QuestionRichContent from '@/components/QuestionRichContent';
import type { ProgrammingProblem } from '@/types/technical';

interface TestCaseItem {
  input: string;
  expected_output?: string;
  output?: string;
  explanation?: string;
  is_hidden?: boolean;
}

interface HackerRankProblemViewProps {
  problem: ProgrammingProblem;
  sampleCases: TestCaseItem[];
  maxVisibleCases?: number;
}

/**
 * Formats math constraints (e.g. 10^5 -> 10⁵, <= -> ≤, >= -> ≥).
 */
export function formatMathConstraint(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<=/g, '≤')
    .replace(/>=/g, '≥')
    .replace(/!=/g, '≠')
    .replace(/\b10\^([0-9]+)\b/g, (_, exp) => {
      const superscripts: Record<string, string> = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
      };
      return '10' + exp.split('').map((ch: string) => superscripts[ch] || ch).join('');
    });
}

/**
 * Preserved for interface compatibility. Returns null to render standard clean monospace code blocks.
 */
export function parseArrayVisualization(_inputStr: string): { elements: string[]; label: string } | null {
  return null;
}

export default function HackerRankProblemView({
  problem,
  sampleCases = [],
  maxVisibleCases,
}: HackerRankProblemViewProps) {
  // Active example tab for clean, compact presentation
  const [activeExampleTab, setActiveExampleTab] = useState<number>(0);

  // Copy state trackers
  const [copiedKeys, setCopiedKeys] = useState<Record<string, boolean>>({});

  // Accordion drawer states
  const [isIntuitionOpen, setIsIntuitionOpen] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [solutionViewLang, setSolutionViewLang] = useState<'python' | 'java' | 'cpp' | 'c'>('python');

  // Reset tab when problem changes
  useEffect(() => {
    setActiveExampleTab(0);
  }, [problem?.id]);

  const visibleCases = maxVisibleCases ? sampleCases.slice(0, maxVisibleCases) : sampleCases;
  const safeIndex = Math.min(activeExampleTab, Math.max(0, visibleCases.length - 1));
  const currentCase = visibleCases[safeIndex];

  const copyText = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKeys(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedKeys(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  // Derive standard Input Format descriptions if not already in markdown
  const inputFormatLines = React.useMemo(() => {
    if (!sampleCases || sampleCases.length === 0) {
      return ['The input is provided on standard input (stdin) as specified in the problem statement.'];
    }
    const sample = sampleCases[0].input.trim().split('\n').filter(Boolean);
    if (sample.length >= 2 && !isNaN(Number(sample[0])) && sample[1].includes(' ')) {
      return [
        'The first line contains an integer, N, denoting the size of the array or collection.',
        'The second line contains N space-separated integers.',
      ];
    }
    if (sample.length === 1 && sample[0].includes(' ')) {
      return ['A single line containing space-separated integers.'];
    }
    if (sample.length === 1 && isNaN(Number(sample[0]))) {
      return ['A single line containing the input string.'];
    }
    if (sample.length === 1) {
      return ['A single line containing the input integer.'];
    }
    return ['Standard input contains inputs formatted line by line as shown in the sample cases below.'];
  }, [sampleCases]);

  // Derive initial Example from sample cases
  const firstSample = sampleCases.length > 0 ? sampleCases[0] : null;

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-200 font-sans leading-relaxed text-sm">
      
      {/* 1. Problem Description & Narrative */}
      <div className="space-y-3">
        <div className="text-[13px] sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
          <QuestionRichContent content={problem.description} />
        </div>
      </div>

      {/* 2. Example Section (HackerRank Flow) */}
      {firstSample && (
        <div className="space-y-2 pt-1">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight">
            Example
          </h3>
          <div className="p-3.5 bg-gray-50 dark:bg-[#16181c] rounded-xl border border-gray-200 dark:border-[#2d3036] text-xs sm:text-sm font-mono space-y-1.5 text-gray-800 dark:text-gray-200">
            <div>
              <span className="text-gray-500 font-sans font-semibold">Input: </span>
              <span className="text-gray-900 dark:text-gray-100">{firstSample.input.replace(/\n/g, ' ')}</span>
            </div>
            <div>
              <span className="text-gray-500 font-sans font-semibold">Return: </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{firstSample.output || firstSample.expected_output}</span>
            </div>
            {firstSample.explanation && (
              <p className="text-[12px] font-sans text-gray-600 dark:text-gray-400 pt-1.5 border-t border-gray-200 dark:border-gray-800 leading-relaxed">
                {firstSample.explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3. Input Format */}
      <div className="space-y-2 pt-1">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight">
          Input Format
        </h3>
        <div className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
          {inputFormatLines.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>

      {/* 4. Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="space-y-2 pt-1">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight">
            Constraints
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
            {problem.constraints.map((c, i) => (
              <li key={i} className="font-mono text-[13px] tracking-tight">
                {formatMathConstraint(c)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Sample Test Cases (Tabbed Examples to eliminate repetitive clutter) */}
      {visibleCases.length > 0 && currentCase && (
        <div className="space-y-2.5 pt-2">
          {/* Header & Tabs Row */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Examples:
              </span>
              <div className="inline-flex items-center p-0.5 rounded-lg bg-gray-100 dark:bg-[#16181c] border border-gray-200 dark:border-[#2a2d33]">
                {visibleCases.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveExampleTab(idx)}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                      safeIndex === idx
                        ? 'bg-white dark:bg-[#21262d] text-sky-600 dark:text-sky-400 shadow-xs border border-gray-200 dark:border-[#388bfd]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Example {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy Input Quick Action */}
            <button
              type="button"
              onClick={() => copyText(currentCase.input, `input_${safeIndex}`)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 transition-colors cursor-pointer"
              title="Copy input to clipboard"
            >
              {copiedKeys[`input_${safeIndex}`] ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied Input</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Input</span>
                </>
              )}
            </button>
          </div>

          {/* Unified Compact Example Card */}
          <div className="p-3.5 bg-gray-50 dark:bg-[#121315] rounded-xl border border-gray-200 dark:border-[#2d3036] space-y-3 font-mono text-xs sm:text-sm animate-fadeIn">
            {/* Input */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider font-sans">
                Input
              </span>
              <pre className="p-2.5 rounded-lg bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#21262d] text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed overflow-x-auto font-mono">
                {currentCase.input || '<Empty>'}
              </pre>
            </div>

            {/* Expected Output */}
            {(currentCase.output || currentCase.expected_output) && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider font-sans">
                    Expected Output
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(currentCase.output || currentCase.expected_output || '', `output_${safeIndex}`)}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedKeys[`output_${safeIndex}`] ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span className="text-[11px]">{copiedKeys[`output_${safeIndex}`] ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#21262d] text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto font-mono font-semibold">
                  {currentCase.output || currentCase.expected_output}
                </pre>
              </div>
            )}

            {/* Explanation */}
            {currentCase.explanation && (
              <div className="space-y-1 pt-1 border-t border-gray-200 dark:border-[#21262d]">
                <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider font-sans">
                  Explanation
                </span>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                  {currentCase.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Learning Aids: Placement Intuition, Hints & Solutions (Collapsible Accordions) */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-[#25262a]">
        
        {/* Intuition Accordion */}
        {problem.keyIntuition && problem.keyIntuition !== problem.description && (
          <div className="rounded-xl border border-gray-200 dark:border-[#25262a] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsIntuitionOpen(!isIntuitionOpen)}
              className="w-full px-4 py-2.5 bg-[#FD4A32]/5 hover:bg-[#FD4A32]/10 transition-colors flex items-center justify-between text-xs font-bold text-[#FD4A32] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Placement Intuition &amp; Approach</span>
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

        {/* Hints Accordion */}
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

        {/* Verified Solutions Accordion */}
        {problem.solutions && (
          <div className="rounded-xl border border-gray-200 dark:border-[#25262a] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsSolutionOpen(!isSolutionOpen)}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-[#1a1c20] hover:bg-gray-200 dark:hover:bg-[#22242a] transition-colors flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#FD4A32]" />
                <span>Verified Solution Code</span>
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
                    onClick={() => copyText(problem.solutions[solutionViewLang] || '', 'sol_code')}
                    className="inline-flex items-center gap-1 text-[11px] text-[#8b949e] hover:text-white px-2 py-0.5 rounded bg-[#21262d] transition-colors cursor-pointer"
                  >
                    {copiedKeys['sol_code'] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKeys['sol_code'] ? 'Copied' : 'Copy Code'}</span>
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
          <div className="space-y-1.5 pt-2">
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

      </div>

    </div>
  );
}
