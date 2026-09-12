import React, { useState } from 'react';
import { X, Upload, Check, Copy, AlertCircle, CheckCircle2, FileCode, AlertTriangle, CloudCheck, CloudOff } from 'lucide-react';
import { technicalService, type TechnicalImportReport } from '@/services/technical.service';
import type { ProgrammingTopic, TechnicalTrack } from '@/types/technical';
import { safeJsonParse } from '@/utils/questionParser';

interface TechnicalBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultTopicId?: string;
  topics: ProgrammingTopic[];
  track?: TechnicalTrack;
}

const SAMPLE_PROBLEM_TEMPLATE = `[
  {
    "title": "Count Digits in an Integer",
    "topicId": "digit-manipulation",
    "level": "BASIC",
    "description": "Given an integer N, count and return the total number of digits in N. If N is 0, the count of digits is 1.",
    "constraints": [
      "-10^18 <= N <= 10^18"
    ],
    "testCases": [
      {
        "input": "N = 1567",
        "output": "4",
        "explanation": "1567 consists of four individual digits: 1, 5, 6, and 7."
      },
      {
        "input": "N = 0",
        "output": "1",
        "explanation": "0 has exactly 1 digit."
      }
    ],
    "solutions": {
      "java": "public class Solution {\\n    public static int countDigits(long n) {\\n        if (n == 0) return 1;\\n        n = Math.abs(n);\\n        int count = 0;\\n        while (n > 0) {\\n            count++;\\n            n /= 10;\\n        }\\n        return count;\\n    }\\n}",
      "python": "def count_digits(n: int) -> int:\\n    if n == 0:\\n        return 1\\n    n = abs(n)\\n    count = 0\\n    while n > 0:\\n        count += 1\\n        n //= 10\\n    return count",
      "cpp": "int countDigits(long long n) {\\n    if (n == 0) return 1;\\n    n = std::abs(n);\\n    int count = 0;\\n    while (n > 0) {\\n        count++;\\n        n /= 10;\\n    }\\n    return count;\\n}",
      "c": "int countDigits(long long n) {\\n    if (n == 0) return 1;\\n    if (n < 0) n = -n;\\n    int count = 0;\\n    while (n > 0) {\\n        count++;\\n        n /= 10;\\n    }\\n    return count;\\n}"
    },
    "timeComplexity": "O(log10(N))",
    "spaceComplexity": "O(1)",
    "hints": [
      "Remember to handle N = 0 as a special edge case with 1 digit.",
      "Negative numbers should be converted using absolute value before counting."
    ]
  }
]`;

const SAMPLE_MCQ_TEMPLATE = `[
  {
    "topicId": "mcq-c-programming",
    "topicCategory": "C_PROGRAMMING",
    "question": "What will be the output of the following C code snippet?\\n\\n#include <stdio.h>\\nint main() {\\n    int x = 5;\\n    printf(\\"%d %d %d\\", x++, x, ++x);\\n    return 0;\\n}",
    "options": [
      "5 6 7",
      "7 7 7",
      "Undefined behavior",
      "5 5 7"
    ],
    "correctOptionIndex": 2,
    "difficulty": "MEDIUM",
    "explanation": "Modifying a variable multiple times without an intervening sequence point results in undefined behavior according to the ANSI C standard."
  }
]`;

export default function TechnicalBulkImportModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTopicId,
  topics,
  track = 'PROGRAMMING_150',
}: TechnicalBulkImportModalProps) {
  const isMcqMode = track === 'TECHNICAL_MCQS';
  const [selectedTopicId, setSelectedTopicId] = useState<string>('AUTO');
  const [jsonText, setJsonText] = useState<string>('');
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [importReport, setImportReport] = useState<TechnicalImportReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTemplate = isMcqMode ? SAMPLE_MCQ_TEMPLATE : SAMPLE_PROBLEM_TEMPLATE;

  // Real-time JSON validation using safeJsonParse
  let parsedItems: any[] = [];
  let parseError: string | null = null;

  if (jsonText.trim()) {
    try {
      const parsed = safeJsonParse(jsonText);
      parsedItems = Array.isArray(parsed) ? parsed : [parsed];
      if (parsedItems.length === 0) {
        parseError = 'The JSON array is empty.';
      } else if (isMcqMode) {
        const missing = parsedItems.filter(item => !item.question || !Array.isArray(item.options));
        if (missing.length > 0) {
          parseError = `${missing.length} MCQ(s) are missing required 'question' or 'options' array.`;
        }
      } else {
        const missingTitles = parsedItems.filter(p => !p.title);
        if (missingTitles.length > 0) {
          parseError = `${missingTitles.length} problem(s) are missing a 'title' field.`;
        }
      }
    } catch (e: any) {
      parseError = e.message || 'Invalid JSON syntax.';
    }
  }

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(currentTemplate);
    setCopiedTemplate(true);
    if (!jsonText.trim()) {
      setJsonText(currentTemplate);
    }
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonText.trim() || parseError || parsedItems.length === 0) return;

    setIsSubmitting(true);
    try {
      if (isMcqMode) {
        const itemsToImport = parsedItems.map(m => {
          const finalTopicId = selectedTopicId !== 'AUTO' ? selectedTopicId : (m.topicId || defaultTopicId || 'mcq-c-programming');
          return {
            ...m,
            topicId: finalTopicId,
          };
        });

        const result = await technicalService.importTechnicalMcqs(itemsToImport);
        setImportReport(result);
        if (result.success > 0) {
          onSuccess();
        }
      } else {
        const itemsToImport = parsedItems.map(p => {
          const finalTopicId = selectedTopicId !== 'AUTO' ? selectedTopicId : (p.topicId || defaultTopicId || 'syntax-operators');
          return {
            ...p,
            topicId: finalTopicId,
            track,
          };
        });

        const result = await technicalService.importProgrammingProblems(itemsToImport, track as any);
        setImportReport(result);
        if (result.success > 0) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setImportReport({
        success: 0,
        importedCount: 0,
        duplicates: 0,
        invalid: 1,
        errors: [{ itemIndex: 1, reason: err.message || 'Import operation encountered an unexpected error.' }],
        supabaseSynced: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = isMcqMode
    ? 'Import Technical MCQs'
    : track === 'CAMPUS_DSA'
    ? 'Import Campus DSA Problems'
    : 'Import Programming 150 Problems';

  const modalDescription = isMcqMode
    ? 'Paste a JSON array of multiple-choice questions with options, correctOptionIndex (0-3), and explanation.'
    : 'Paste a JSON array of coding problems with constraints, two test cases (Example 1 & Example 2), and multi-language code.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#E9ECEF] dark:border-[#242424] shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E9ECEF] dark:border-[#242424] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-display font-bold uppercase tracking-wider">
              <FileCode className="w-3 h-3" />
              <span>Admin Bulk JSON Import</span>
            </div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#121417] dark:text-white">
              {modalTitle}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {modalDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleImport} className="p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar flex-1">
          {/* Controls Bar: Topic Override + Copy Template */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
            {/* Target Topic Selector */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <label className="text-xs font-bold text-[#121417] dark:text-[#FFFFFF] shrink-0">
                Target Topic:
              </label>
              <select
                value={selectedTopicId}
                onChange={e => setSelectedTopicId(e.target.value)}
                className="w-full max-w-xs bg-white dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2E2E2E] rounded-md px-2.5 py-1 text-xs text-[#121417] dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="AUTO">Auto-detect from "topicId" in JSON</option>
                {topics.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.cluster ? `${t.cluster} — ` : ''}{t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Copy Template Button */}
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-white dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2E2E2E] text-[#121417] dark:text-[#CCCCCC] hover:border-purple-500 transition-colors cursor-pointer shrink-0"
              title="Copy verified JSON template structure"
            >
              {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTemplate ? 'Template Copied!' : 'Copy Sample JSON Template'}</span>
            </button>
          </div>

          {/* JSON Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#121417] dark:text-[#FFFFFF]">
                JSON Array Content:
              </label>
              {jsonText.trim() && (
                parseError ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{parseError}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid JSON: {parsedItems.length} {isMcqMode ? 'MCQ(s)' : 'problem(s)'} detected</span>
                  </span>
                )
              )}
            </div>

            <textarea
              rows={12}
              value={jsonText}
              onChange={e => {
                setJsonText(e.target.value);
                setImportReport(null);
              }}
              placeholder={currentTemplate}
              className="w-full p-3 rounded-lg bg-[#0C0C0C] border border-[#242424] text-gray-200 font-mono text-xs focus:outline-none focus:border-purple-500 custom-scrollbar leading-relaxed"
            />
          </div>

          {/* Import Result Notification */}
          {importReport && (
            <div className="space-y-2">
              <div
                className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-sans ${
                  importReport.success > 0
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                    : importReport.duplicates > 0
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {importReport.success > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : importReport.duplicates > 0 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span className="font-semibold">
                    {importReport.success > 0 && `${importReport.success} item(s) successfully imported & live! `}
                    {importReport.duplicates > 0 && `${importReport.duplicates} duplicate(s) skipped. `}
                    {importReport.invalid > 0 && `${importReport.invalid} item(s) had errors.`}
                    {importReport.success === 0 && importReport.duplicates === 0 && importReport.invalid === 0 && 'No changes were made.'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                  {importReport.supabaseSynced ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CloudCheck className="w-3.5 h-3.5" />
                      <span>Synced to Supabase</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400">
                      <CloudOff className="w-3.5 h-3.5" />
                      <span>Active in Local Cache</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Detailed Duplicate or Error Details */}
              {importReport.errors && importReport.errors.length > 0 && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#111111] border border-[#E9ECEF] dark:border-[#222222] max-h-36 overflow-y-auto space-y-1 custom-scrollbar text-[11px] font-mono">
                  <div className="font-bold text-gray-700 dark:text-gray-300 pb-1 border-b border-gray-200 dark:border-gray-800">
                    Import Notices & Skipped Items ({importReport.errors.length}):
                  </div>
                  {importReport.errors.map((err, eIdx) => (
                    <div key={eIdx} className="text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">#{err.itemIndex}</span>
                      <span className="truncate">{err.title ? `"${err.title}" — ` : ''}{err.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E9ECEF] dark:border-[#242424]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md text-xs font-display font-bold border border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !jsonText.trim() || !!parseError || parsedItems.length === 0}
              className="px-4 py-1.5 rounded-md text-xs font-display font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:pointer-events-none text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Importing...' : `Import ${parsedItems.length || ''} ${isMcqMode ? 'MCQs' : 'Problems'}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
