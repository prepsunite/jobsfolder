import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Eye,
  EyeOff,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  Code2,
  BookOpen,
  Layers,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import type { MockExam, MockExamSection } from '@/types/tpo';
import { tpoService } from '@/services/tpo.service';
import QuestionRichContent from '@/components/QuestionRichContent';

interface TpoQuestionPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: string | null;
  collegeName?: string;
}

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

export default function TpoQuestionPaperModal({
  isOpen,
  onClose,
  examId,
  collegeName,
}: TpoQuestionPaperModalProps) {
  const [showSolutions, setShowSolutions] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paperData, setPaperData] = useState<{
    exam: MockExam;
    sections: Array<MockExamSection & { questions: any[] }>;
  } | null>(null);

  useEffect(() => {
    if (!isOpen || !examId) {
      setPaperData(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    tpoService
      .getMockExamPaperWithSolutions(examId)
      .then(res => {
        if (isMounted) {
          setPaperData(res);
          setActiveSectionIndex(0);
        }
      })
      .catch(err => {
        console.error('Failed to load question paper:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, examId]);

  if (!isOpen) return null;

  const exam = paperData?.exam;
  const sections = paperData?.sections || [];
  const currentSection = sections[activeSectionIndex];
  const totalQuestionsAcrossAllSections = sections.reduce(
    (sum, s) => sum + (s.questions?.length || 0),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      {/* Container - printable area has id="printable-question-paper" */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#151d2e] shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FD4A32]">
                Question Paper Governance &amp; Inspection
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {exam?.title || 'Question Paper Preview'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Answer Keys & Explanations */}
            <button
              onClick={() => setShowSolutions(!showSolutions)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showSolutions
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
              title="Toggle revealing correct answer keys and step-by-step explanations"
            >
              {showSolutions ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showSolutions ? 'Keys Revealed' : 'Keys Hidden'}</span>
            </button>

            {/* Print / Save PDF for Accreditation */}
            <button
              onClick={handlePrint}
              disabled={isLoading || !paperData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              title="Print clean question paper or save as PDF for institutional accreditation"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#FD4A32] mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hydrating question paper, code snippets, and stimulus passages...
              </p>
            </div>
          ) : !paperData ? (
            <div className="py-20 text-center text-xs text-slate-400">
              Unable to load question paper. Please verify exam configuration.
            </div>
          ) : (
            <>
              {/* 🎓 INSTITUTIONAL FORMAL PAPER HEADER */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-700/60">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      <Building2 className="w-3 h-3" />
                      {collegeName || 'Campus Placement Partner'}
                    </div>
                    <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {exam?.title}
                    </h1>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Standardized Campus Assessment Drive • Target Recruiter:{' '}
                      <strong className="text-slate-800 dark:text-slate-200">{exam?.target_company}</strong>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 space-y-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Total Marks:{' '}
                      <strong className="text-[#FD4A32] text-sm">{exam?.total_marks}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center sm:justify-end gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Duration: {exam?.duration_minutes} Mins</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Qualifying Cutoff: <strong>{exam?.passing_percentage}%</strong>
                    </div>
                  </div>
                </div>

                {/* Section Overview Pills */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">
                    Sections ({sections.length}):
                  </span>
                  {sections.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                    >
                      {s.name} ({s.questions?.length || 0} Qs)
                    </span>
                  ))}
                  <span className="ml-auto text-[11px] text-slate-400 font-semibold">
                    Total: {totalQuestionsAcrossAllSections} Questions
                  </span>
                </div>

                {/* Instructions Box */}
                {exam?.instructions && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-slate-200 block mb-0.5">
                      Candidate Instructions:
                    </strong>
                    {exam.instructions}
                  </div>
                )}
              </div>

              {/* SECTION NAVIGATION TABS (Screen View) */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto print:hidden">
                {sections.map((sec, idx) => {
                  const isActive = idx === activeSectionIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveSectionIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#FD4A32] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{sec.name}</span>
                      <span className="ml-1.5 opacity-80">({sec.questions?.length || 0})</span>
                    </button>
                  );
                })}
              </div>

              {/* SECTION CONTENT */}
              {currentSection && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#FD4A32]" />
                      <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        {currentSection.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        • {currentSection.questions?.length || 0} Questions
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Marking: +{currentSection.marks_per_correct || 1} mark per correct
                      {currentSection.negative_marking > 0 && ` • -${currentSection.negative_marking} penalty`}
                    </div>
                  </div>

                  {/* Question Items List */}
                  <div className="space-y-6">
                    {currentSection.questions.map((q: any, qIdx: number) => {
                      const se = q.structured_explanation;
                      const hasPassage = se && (se.passage || se.passageTitle);
                      const isCoding = q.isCodingProblem;

                      return (
                        <div
                          key={q.id || qIdx}
                          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 shadow-xs space-y-4"
                        >
                          {/* Question Header */}
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black text-xs flex items-center justify-center">
                                {qIdx + 1}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {q.topic_id || currentSection.category || 'General'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {q.difficulty && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  {q.difficulty}
                                </span>
                              )}
                              <span className="text-[11px] font-bold text-slate-400">
                                {currentSection.marks_per_correct || 1}M
                              </span>
                            </div>
                          </div>

                          {/* Stimulus Passage (if reading comp or DI) */}
                          {hasPassage && (
                            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 text-xs text-slate-800 dark:text-slate-200 space-y-2">
                              {se.passageTitle && (
                                <strong className="text-amber-900 dark:text-amber-300 font-bold block">
                                  {se.passageTitle}
                                </strong>
                              )}
                              <div className="prose dark:prose-invert prose-xs max-w-none whitespace-pre-wrap leading-relaxed">
                                {se.passage}
                              </div>
                            </div>
                          )}

                          {/* Question Statement */}
                          <div className="text-xs sm:text-sm text-slate-900 dark:text-white font-medium leading-relaxed">
                            <QuestionRichContent content={q.statement || q.description || q.title || ''} />
                          </div>

                          {/* Options List (for MCQs) */}
                          {!isCoding && q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                              {q.options.map((opt: string, optIdx: number) => {
                                const isCorrect = parseCorrectAnswerIndex(q.correct_answer) === optIdx;
                                const isHighlightedCorrect = showSolutions && isCorrect;

                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 transition-colors ${
                                      isHighlightedCorrect
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold'
                                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    <span
                                      className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                        isHighlightedCorrect
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <div className="flex-1">
                                      <QuestionRichContent content={opt} isOption />
                                    </div>
                                    {isHighlightedCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Coding Problem Specific Details (Constraints, Samples) */}
                          {isCoding && (
                            <div className="space-y-3 pt-2 text-xs">
                              {q.constraints && (
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                  <strong className="text-slate-800 dark:text-slate-200 block text-[11px] mb-1">
                                    Constraints:
                                  </strong>
                                  <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                    {q.constraints}
                                  </div>
                                </div>
                              )}

                              {(q.sample_input || q.sample_output) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {q.sample_input && (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                        Sample Input
                                      </span>
                                      <pre className="font-mono text-[11px] overflow-x-auto text-slate-700 dark:text-slate-300">
                                        {q.sample_input}
                                      </pre>
                                    </div>
                                  )}
                                  {q.sample_output && (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                        Sample Output
                                      </span>
                                      <pre className="font-mono text-[11px] overflow-x-auto text-slate-700 dark:text-slate-300">
                                        {q.sample_output}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* REVEALED EDITORIAL / SOLUTION CARD */}
                          {showSolutions && (
                            <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2.5">
                              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-black uppercase text-[10px] tracking-wider">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Verified Solution &amp; Answer Key</span>
                              </div>

                              {!isCoding && q.correct_answer !== undefined && (
                                <div className="text-emerald-900 dark:text-emerald-200 font-bold">
                                  Correct Choice: Option {String.fromCharCode(65 + Number(q.correct_answer))}
                                </div>
                              )}

                              {/* Structured or Text Explanation */}
                              {(q.explanation || se?.formula || se?.steps) && (
                                <div className="text-slate-700 dark:text-slate-300 space-y-2 pt-1">
                                  {se?.formula && (
                                    <div className="font-mono text-[11px] bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                                      <strong>Formula:</strong> {se.formula}
                                    </div>
                                  )}

                                  {se?.steps && Array.isArray(se.steps) && se.steps.length > 0 && (
                                    <div className="space-y-1">
                                      <strong className="text-[11px] text-slate-900 dark:text-white">
                                        Step-by-Step Derivation:
                                      </strong>
                                      <ol className="list-decimal pl-4 space-y-1">
                                        {se.steps.map((st: string, stIdx: number) => (
                                          <li key={stIdx}>{st}</li>
                                        ))}
                                      </ol>
                                    </div>
                                  )}

                                  {q.explanation && (
                                    <div className="leading-relaxed">
                                      <QuestionRichContent content={q.explanation} />
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Reference Coding Solutions */}
                              {isCoding && q.solutions && (
                                <div className="pt-2">
                                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                                    Reference Solution Implementation:
                                  </span>
                                  {typeof q.solutions === 'object' ? (
                                    Object.entries(q.solutions).map(([lang, code]) => (
                                      <div key={lang} className="mt-2">
                                        <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                                          {lang}:
                                        </div>
                                        <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl overflow-x-auto mt-1">
                                          {String(code)}
                                        </pre>
                                      </div>
                                    ))
                                  ) : (
                                    <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl overflow-x-auto">
                                      {String(q.solutions)}
                                    </pre>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#151d2e] flex items-center justify-between text-xs shrink-0 print:hidden">
          <div className="text-slate-400 font-medium">
            Accreditation Ready • PrepUnite Verified Institutional Blueprint
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
}
