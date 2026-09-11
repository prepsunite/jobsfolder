import React, { useState } from 'react';
import { X, Upload, Check, Copy, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { interviewService } from '@/services/interview.service';
import type { InterviewQuestion, InterviewTopic, InterviewCategory } from '@/types/interview';

interface InterviewBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultTopicId?: string;
  defaultCategory?: InterviewCategory;
  topics: InterviewTopic[];
}

const SAMPLE_INTERVIEW_JSON = `[
  {
    "title": "Explain ACID Properties in DBMS with a Real-World Banking Example",
    "topicId": "topic-dbms",
    "category": "CORE_CS",
    "subject": "DBMS",
    "subjectLabel": "Database Management Systems",
    "answer": "ACID guarantees reliability in database transactions: Atomicity ensures all-or-nothing execution, Consistency preserves invariants, Isolation prevents dirty reads, and Durability ensures committed data persists even after crashes.",
    "bulletPoints": [
      "Atomicity: Either both debit and credit execute or neither does.",
      "Consistency: Total account balances remain identical before and after.",
      "Isolation: Concurrent reads don't see uncommitted state.",
      "Durability: Transaction logs written to WAL disk before acknowledgment."
    ],
    "proTip": "Interviewers often ask which property is hardest to scale horizontally — answer: Isolation & Consistency (requires 2PC or distributed consensus like Paxos/Raft).",
    "frequency": "VERY_HIGH"
  }
]`;

export default function InterviewBulkImportModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTopicId,
  defaultCategory = 'CORE_CS',
  topics,
}: InterviewBulkImportModalProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(defaultTopicId || 'AUTO');
  const [jsonText, setJsonText] = useState<string>('');
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [importReport, setImportReport] = useState<{ success: number; message?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Real-time JSON validation
  let parsedQuestions: any[] = [];
  let parseError: string | null = null;

  if (jsonText.trim()) {
    try {
      const parsed = JSON.parse(jsonText);
      parsedQuestions = Array.isArray(parsed) ? parsed : [parsed];
      if (parsedQuestions.length === 0) {
        parseError = 'The JSON array is empty.';
      } else {
        const missingTitles = parsedQuestions.filter(q => !q.title);
        if (missingTitles.length > 0) {
          parseError = `${missingTitles.length} question(s) are missing a "title" field.`;
        }
      }
    } catch (e: any) {
      parseError = e.message || 'Invalid JSON syntax.';
    }
  }

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(SAMPLE_INTERVIEW_JSON);
    setCopiedTemplate(true);
    if (!jsonText.trim()) {
      setJsonText(SAMPLE_INTERVIEW_JSON);
    }
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonText.trim() || parseError || parsedQuestions.length === 0) return;

    setIsSubmitting(true);
    try {
      const itemsToImport = parsedQuestions.map(q => {
        const finalTopicId = selectedTopicId !== 'AUTO' ? selectedTopicId : (q.topicId || defaultTopicId || 'topic-dbms');
        return {
          ...q,
          topicId: finalTopicId,
          category: q.category || defaultCategory,
          frequency: q.frequency || 'MEDIUM',
          bulletPoints: Array.isArray(q.bulletPoints) ? q.bulletPoints : [],
        };
      });

      const result = await interviewService.importInterviewQuestions(itemsToImport);
      setImportReport({
        success: result.importedCount,
        message: `Successfully imported ${result.importedCount} interview question(s) to Supabase!`,
      });
      onSuccess();
    } catch (err: any) {
      setImportReport({
        success: 0,
        message: `Import failed: ${err.message || err}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#E9ECEF] dark:border-[#242424] shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E9ECEF] dark:border-[#242424] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-display font-bold uppercase tracking-wider">
              <BookOpen className="w-3 h-3" />
              <span>Admin Bulk JSON Import</span>
            </div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#121417] dark:text-white">
              Import Interview Preparation Questions
            </h2>
            <p className="text-xs text-[#868E96] dark:text-[#777777]">
              Paste a JSON array of questions to bulk insert into Supabase database.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleImport} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Target Topic Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-display font-bold text-[#121417] dark:text-white">
              Target Interview Topic
            </label>
            <div className="relative">
              <select
                value={selectedTopicId}
                onChange={e => setSelectedTopicId(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2E2E2E] rounded-lg px-3 py-2 text-xs text-[#121417] dark:text-white font-medium focus:outline-none focus:border-purple-600 transition-colors"
              >
                <option value="AUTO">✨ Auto-Detect (use "topicId" from each JSON item)</option>
                {topics.map(t => (
                  <option key={t.id} value={t.id}>
                    [{t.cluster}] {t.title || t.name} ({t.id})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-[#868E96]">
              Choose a specific topic to assign all questions to, or leave as Auto-Detect.
            </p>
          </div>

          {/* JSON Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-display font-bold text-[#121417] dark:text-white">
                JSON Data Array *
              </label>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors cursor-pointer"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied Template!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON Template</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              placeholder="Paste JSON array here..."
              rows={10}
              className={`w-full bg-[#0D0D0D] border rounded-lg p-3 font-mono text-xs text-emerald-400 placeholder-[#555555] focus:outline-none transition-colors leading-relaxed ${
                parseError
                  ? 'border-rose-500/50 focus:border-rose-500'
                  : 'border-[#242424] focus:border-purple-600'
              }`}
            />
          </div>

          {/* Real-time Status / Error Badge */}
          {jsonText.trim() && (
            <div>
              {parseError ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{parseError}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium">
                    Valid JSON: Detected {parsedQuestions.length} interview question(s) ready to import.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Import Result Notification */}
          {importReport && (
            <div
              className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
                importReport.success > 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {importReport.success > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span>{importReport.message}</span>
              </div>
              {importReport.success > 0 && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500"
                >
                  Done
                </button>
              )}
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-display font-bold text-[#868E96] hover:text-[#121417] dark:hover:text-white border border-[#E9ECEF] dark:border-[#242424] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !jsonText.trim() || !!parseError || parsedQuestions.length === 0}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-display font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import {parsedQuestions.length > 0 ? `${parsedQuestions.length} Questions` : 'Questions'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
