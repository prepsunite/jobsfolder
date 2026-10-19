import React from 'react';
import {
  Terminal,
  CheckCircle2,
  ExternalLink,
  Building2,
  Code2,
  Sparkles,
} from 'lucide-react';
import type { PaperQuestion } from '@/utils/paperQuestionParser';

interface PaperProblemListViewProps {
  questions: PaperQuestion[];
  companyName: string;
  examName: string;
  solvedQuestionIds: Set<string>;
  onSolveQuestion: (question: PaperQuestion) => void;
}

export default function PaperProblemListView({
  questions,
  companyName,
  examName,
  solvedQuestionIds,
  onSolveQuestion,
}: PaperProblemListViewProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  const solvedCount = questions.filter((q) => solvedQuestionIds.has(q.id)).length;
  const progressPct = Math.round((solvedCount / questions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Practice Summary Bar (Programming 150 Style) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#FD4A32]/10 via-[#FD4A32]/5 to-transparent border border-[#FD4A32]/20 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FD4A32] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-extrabold text-[#121417] dark:text-white flex items-center gap-2">
              <span>{questions.length} Placement Coding Problems</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Interactive IDE Ready
              </span>
            </h3>
            <p className="text-xs text-[#868E96] dark:text-[#666666] mt-0.5 font-sans">
              Practice official {companyName} questions directly in the built-in compiler.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#121417] dark:text-white block">
              {solvedCount} / {questions.length} Solved ({progressPct}%)
            </span>
            <span className="text-[10px] text-[#868E96] uppercase tracking-wider font-display font-bold">
              Progress
            </span>
          </div>
          <div className="w-20 sm:w-28 h-2 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Problem Cards List (Exact Programming 150 Layout) */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const isSolved = solvedQuestionIds.has(question.id);

          return (
            <div
              key={question.id || index}
              className={`p-5 sm:p-6 rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-md relative overflow-hidden bg-white dark:bg-[#121212] ${
                isSolved
                  ? 'border-emerald-500/40 bg-emerald-500/[0.02]'
                  : 'border-[#E9ECEF] dark:border-[#242424] hover:border-[#FD4A32]/40'
              }`}
            >
              {/* Problem Header (Title, Badges & Solve Button) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9ECEF] dark:border-[#202020]">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#121417] dark:text-[#FFFFFF] leading-snug">
                    {question.title}
                  </h3>

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

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onSolveQuestion(question)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-display font-bold bg-[#FD4A32] hover:bg-[#E0351D] text-white transition-all shadow-xs cursor-pointer group"
                    title="Open in Coding IDE"
                  >
                    <Terminal className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Solve</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </button>
                </div>
              </div>

              {/* Problem Description */}
              {question.description && (
                <div className="mt-3.5 text-xs sm:text-sm text-[#495057] dark:text-[#CCCCCC] leading-relaxed bg-[#F8F9FA] dark:bg-[#0C0C0C] p-3.5 rounded-lg border border-[#E9ECEF] dark:border-[#242424] font-sans whitespace-pre-line">
                  {question.description}
                </div>
              )}

              {/* Company & Context Tag */}
              <div className="flex items-center gap-1.5 flex-wrap pt-3">
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider font-display">
                  <Building2 className="w-3 h-3 text-[#868E96] dark:text-[#777777]" />
                  <span>Company:</span>
                </span>
                <span className="text-[10px] font-medium font-sans px-2 py-0.5 rounded bg-[#F1F3F5] dark:bg-[#1E1E1E] text-[#495057] dark:text-[#CCCCCC] border border-[#E9ECEF] dark:border-[#2C2C2C]">
                  {companyName}
                </span>
                <span className="text-[10px] font-medium font-sans px-2 py-0.5 rounded bg-[#F1F3F5] dark:bg-[#1E1E1E] text-[#495057] dark:text-[#CCCCCC] border border-[#E9ECEF] dark:border-[#2C2C2C]">
                  {examName}
                </span>
              </div>

              {/* Constraints */}
              {question.constraints && question.constraints.length > 0 && (
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-bold text-[#868E96] dark:text-[#888888] uppercase tracking-wider block font-display">
                    Constraints:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-xs font-mono text-[#495057] dark:text-[#CCCCCC]">
                    {question.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Test Cases (Campus Standard 2-Col Grid, max 2 shown in question view) */}
              {question.testCases && question.testCases.length > 0 && (
                <div className="mt-3.5 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-bold text-[#868E96] dark:text-[#888888] uppercase tracking-wider block font-display">
                      Sample Test Cases:
                    </span>
                    {question.testCases.length > 2 && (
                      <span className="text-[10px] font-medium font-sans text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        + {question.testCases.length - 2} additional test case{question.testCases.length - 2 > 1 ? 's' : ''} in Practice IDE
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {question.testCases.slice(0, 2).map((tc, tcIdx) => (
                      <div
                        key={tcIdx}
                        className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-1.5 text-xs font-mono"
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#FD4A32] font-bold">
                          <span>{tc.title || `Test Case #${tcIdx + 1}`}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">Input:</span>
                          <pre className="text-gray-800 dark:text-gray-200 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                            {tc.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">Expected Output:</span>
                          <pre className="text-emerald-600 dark:text-emerald-400 text-xs font-bold overflow-x-auto whitespace-pre-wrap font-mono">
                            {tc.output}
                          </pre>
                        </div>
                        {tc.explanation && (
                          <div className="pt-1 border-t border-[#E9ECEF] dark:border-[#242424] text-[11px] text-gray-500 dark:text-gray-400 font-sans">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Note: </span>
                            {tc.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Quick Solve Action Button */}
              <div className="mt-4 pt-3 border-t border-[#E9ECEF] dark:border-[#202020] flex items-center justify-between">
                <span className="text-[11px] text-[#868E96] dark:text-[#666666] font-sans">
                  Ready to test your algorithm against Judge0 compiler?
                </span>
                <button
                  type="button"
                  onClick={() => onSolveQuestion(question)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-display font-bold text-[#FD4A32] hover:bg-[#FD4A32]/10 transition-all cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Practice in IDE</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
