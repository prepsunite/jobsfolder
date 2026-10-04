import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock,
  Clock,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { StudentExamAttempt } from '@/types/tpo';
import { tpoService } from '@/services/tpo.service';
import QuestionRichContent from '@/components/QuestionRichContent';

interface StudentExamReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attemptId: string | null;
  examTitle?: string;
}

export default function StudentExamReviewModal({
  isOpen,
  onClose,
  attemptId,
  examTitle,
}: StudentExamReviewModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState<{
    attempt: StudentExamAttempt;
    questions: any[];
    isWindowLive?: boolean;
    examEndTime?: string;
  } | null>(null);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'INCORRECT' | 'SKIPPED' | 'CORRECT'>('ALL');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || !attemptId) {
      setReviewData(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    tpoService
      .getAttemptResultWithReview(attemptId)
      .then(res => {
        if (isMounted) {
          setReviewData(res as any);
          setActiveQuestionIndex(0);
          setActiveFilter('ALL');
        }
      })
      .catch(err => {
        console.error('Failed to load attempt review solutions:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, attemptId]);

  const attempt = reviewData?.attempt;
  const questions = reviewData?.questions || [];
  const responses = attempt?.responses || {};
  const isWindowLive = reviewData?.isWindowLive;

  // Categorize questions
  const categorizedQuestions = useMemo(() => {
    return questions.map((q, idx) => {
      const resp = responses[q.id];
      const isCoding = q.isCodingProblem;
      
      let isCorrect = false;
      let isAnswered = false;

      if (isCoding) {
        isAnswered = Boolean(resp?.code_solution && resp.code_solution.trim());
        isCorrect = Boolean(resp?.test_cases_passed && resp.total_test_cases && resp.test_cases_passed === resp.total_test_cases);
      } else {
        isAnswered = resp?.selected_option !== null && resp?.selected_option !== undefined;
        isCorrect = isAnswered && resp.selected_option === q.correct_answer;
      }

      return {
        question: q,
        originalIndex: idx,
        response: resp,
        isAnswered,
        isCorrect,
        isCoding,
      };
    });
  }, [questions, responses]);

  const correctCount = categorizedQuestions.filter(c => c.isCorrect).length;
  const incorrectCount = categorizedQuestions.filter(c => c.isAnswered && !c.isCorrect).length;
  const skippedCount = categorizedQuestions.filter(c => !c.isAnswered).length;

  const filteredItems = useMemo(() => {
    if (activeFilter === 'CORRECT') return categorizedQuestions.filter(c => c.isCorrect);
    if (activeFilter === 'INCORRECT') return categorizedQuestions.filter(c => c.isAnswered && !c.isCorrect);
    if (activeFilter === 'SKIPPED') return categorizedQuestions.filter(c => !c.isAnswered);
    return categorizedQuestions;
  }, [categorizedQuestions, activeFilter]);

  const currentItem = filteredItems[activeQuestionIndex];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#151d2e] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Post-Assessment Editorial &amp; Solution Review
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {examTitle || 'Exam Solutions'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Retrieving detailed explanations, solution formulas, and test cases...
              </p>
            </div>
          ) : isWindowLive ? (
            /* 🔒 Anti-Leak Integrity Guard: Exam Window is Still Active */
            <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Solutions Locked During Live Drive
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  To protect recruitment drive integrity while peers are taking the assessment in campus labs, verified question solutions will unlock automatically once this drive window concludes.
                </p>
              </div>

              {attempt && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center text-left">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Score</span>
                    <strong className="text-slate-900 dark:text-white text-base">
                      {attempt.total_score} / {attempt.max_possible_score || 100}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Percentage</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-base">
                      {attempt.percentage}%
                    </strong>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
              >
                Understood, Return to Portal
              </button>
            </div>
          ) : !reviewData || questions.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-400">
              No detailed solutions available for this attempt.
            </div>
          ) : (
            <>
              {/* Candidate Performance Summary Strip */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Score</span>
                    <strong className="text-slate-900 dark:text-white text-sm">
                      {attempt?.total_score} / {attempt?.max_possible_score || 100}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Percentage</span>
                    <strong className={`text-sm ${attempt?.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {attempt?.percentage}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Status</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {attempt?.passed ? 'Qualified Cutoff' : 'Remedial Prep'}
                    </strong>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => { setActiveFilter('ALL'); setActiveQuestionIndex(0); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFilter === 'ALL'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xs'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    All ({questions.length})
                  </button>
                  <button
                    onClick={() => { setActiveFilter('INCORRECT'); setActiveQuestionIndex(0); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFilter === 'INCORRECT'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60'
                    }`}
                  >
                    Incorrect ({incorrectCount})
                  </button>
                  <button
                    onClick={() => { setActiveFilter('SKIPPED'); setActiveQuestionIndex(0); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFilter === 'SKIPPED'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60'
                    }`}
                  >
                    Skipped ({skippedCount})
                  </button>
                  <button
                    onClick={() => { setActiveFilter('CORRECT'); setActiveQuestionIndex(0); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFilter === 'CORRECT'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60'
                    }`}
                  >
                    Correct ({correctCount})
                  </button>
                </div>
              </div>

              {/* Question Number Carousel Quick Select */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
                {filteredItems.map((item, idx) => {
                  const isCurrent = idx === activeQuestionIndex;
                  return (
                    <button
                      key={item.question.id || idx}
                      onClick={() => setActiveQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-xl font-black text-xs transition-all shrink-0 cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-[#FD4A32] shadow-sm'
                          : ''
                      } ${
                        item.isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : item.isAnswered
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                      title={`Question ${item.originalIndex + 1} (${item.isCorrect ? 'Correct' : item.isAnswered ? 'Incorrect' : 'Skipped'})`}
                    >
                      {item.originalIndex + 1}
                    </button>
                  );
                })}
              </div>

              {/* ACTIVE QUESTION CARD */}
              {currentItem ? (
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs flex items-center justify-center">
                        #{currentItem.originalIndex + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {currentItem.question.topic_id || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentItem.isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : currentItem.isAnswered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                          <HelpCircle className="w-3.5 h-3.5" /> Unattempted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stimulus Passage if present */}
                  {currentItem.question.structured_explanation?.passage && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 text-xs text-slate-800 dark:text-slate-200 space-y-1.5">
                      {currentItem.question.structured_explanation?.passageTitle && (
                        <strong className="text-amber-900 dark:text-amber-300 font-bold block">
                          {currentItem.question.structured_explanation.passageTitle}
                        </strong>
                      )}
                      <div className="prose dark:prose-invert prose-xs max-w-none whitespace-pre-wrap leading-relaxed">
                        {currentItem.question.structured_explanation.passage}
                      </div>
                    </div>
                  )}

                  {/* Question Statement */}
                  <div className="text-xs sm:text-sm text-slate-900 dark:text-white font-medium leading-relaxed">
                    <QuestionRichContent
                      content={
                        currentItem.question.statement ||
                        currentItem.question.description ||
                        currentItem.question.title ||
                        ''
                      }
                    />
                  </div>

                  {/* Options List (for MCQs) */}
                  {!currentItem.isCoding && currentItem.question.options && (
                    <div className="space-y-2.5 pt-1">
                      {currentItem.question.options.map((opt: string, optIdx: number) => {
                        const isStudentPick = currentItem.response?.selected_option === optIdx;
                        const isVerifiedCorrect = currentItem.question.correct_answer === optIdx;

                        let style = 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                        if (isVerifiedCorrect) {
                          style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold';
                        } else if (isStudentPick && !isVerifiedCorrect) {
                          style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-medium';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-2xl border text-xs flex items-start justify-between gap-3 ${style}`}
                          >
                            <div className="flex items-start gap-2.5 flex-1">
                              <span
                                className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                  isVerifiedCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : isStudentPick
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <div className="flex-1">
                                <QuestionRichContent content={opt} isOption />
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-1.5 text-[10px] font-bold">
                              {isStudentPick && (
                                <span className={`px-2 py-0.5 rounded ${isVerifiedCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                                  Your Choice
                                </span>
                              )}
                              {isVerifiedCorrect && (
                                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Correct Answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Coding Problem Candidate Review */}
                  {currentItem.isCoding && (
                    <div className="space-y-4 pt-2 text-xs">
                      {/* Submission verdict */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Test Cases Passed</span>
                          <strong className="text-sm text-slate-900 dark:text-white">
                            {currentItem.response?.test_cases_passed ?? 0} / {currentItem.response?.total_test_cases ?? 5} Test Cases
                          </strong>
                        </div>
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${currentItem.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {currentItem.isCorrect ? 'All Tests Passed' : 'Partial / Failed Tests'}
                        </span>
                      </div>

                      {/* Candidate code */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Your Submitted Code:
                        </span>
                        <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                          {currentItem.response?.code_solution || '// No code submitted'}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* VERIFIED STEP-BY-STEP EXPLANATION */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2.5">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-black uppercase text-[10px] tracking-wider">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Verified Editorial &amp; Explanation</span>
                    </div>

                    {currentItem.question.structured_explanation?.formula && (
                      <div className="font-mono text-[11px] bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                        <strong>Formula:</strong> {currentItem.question.structured_explanation.formula}
                      </div>
                    )}

                    {currentItem.question.structured_explanation?.steps && Array.isArray(currentItem.question.structured_explanation.steps) && (
                      <div className="space-y-1">
                        <strong className="text-[11px] text-slate-900 dark:text-white">Step-by-Step Derivation:</strong>
                        <ol className="list-decimal pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                          {currentItem.question.structured_explanation.steps.map((st: string, sIdx: number) => (
                            <li key={sIdx}>{st}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {currentItem.question.explanation && (
                      <div className="leading-relaxed text-slate-700 dark:text-slate-300">
                        <QuestionRichContent content={currentItem.question.explanation} />
                      </div>
                    )}

                    {/* Reference Coding Solution */}
                    {currentItem.isCoding && currentItem.question.solutions && (
                      <div className="pt-2">
                        <strong className="text-[11px] text-emerald-900 dark:text-emerald-200 block mb-1">
                          Reference Solution:
                        </strong>
                        <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto">
                          {typeof currentItem.question.solutions === 'object'
                            ? JSON.stringify(currentItem.question.solutions, null, 2)
                            : String(currentItem.question.solutions)}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Previous / Next Question Navigation */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                      disabled={activeQuestionIndex === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Question</span>
                    </button>
                    <span className="text-xs text-slate-400 font-semibold">
                      Question {activeQuestionIndex + 1} of {filteredItems.length}
                    </span>
                    <button
                      onClick={() => setActiveQuestionIndex(Math.min(filteredItems.length - 1, activeQuestionIndex + 1))}
                      disabled={activeQuestionIndex === filteredItems.length - 1}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-3xl">
                  No questions match the selected filter.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#151d2e] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close Review
          </button>
        </div>

      </div>
    </div>
  );
}
