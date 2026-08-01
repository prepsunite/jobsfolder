import { useState, useRef } from 'react';
import { Link } from 'react-router';
import {
  Upload,
  CheckCircle2,
  Folder,
  ArrowRight,
  ShieldCheck,
  Eye,
  Sparkles,
  FileCode,
  Layers
} from 'lucide-react';
import { dataStore, type ImportReport, type TopicQuestionItem } from '@/services/dataStore';
import { ARITHMETIC_TOPICS } from '@/pages/AptitudePage';

export default function AdminBulkImportPage() {
  const [jsonText, setJsonText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<{
    items: Partial<TopicQuestionItem>[];
    topicSummary: Record<string, number>;
    parseErrors: string[];
  } | null>(null);

  const [targetTopicOverride, setTargetTopicOverride] = useState<string>('AUTO');
  const [importReport, setImportReport] = useState<ImportReport | null>(null);
  const [affectedTopics, setAffectedTopics] = useState<string[]>([]);
  const [previewPage, setPreviewPage] = useState<number>(1);
  const PREVIEW_PAGE_SIZE = 15;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Topic Name Mapping Helper
  const getTopicDisplayName = (slug: string) => {
    const matched = ARITHMETIC_TOPICS.find(t => t.id === slug);
    if (matched) return matched.name;
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  // Real-time JSON parse preview
  const handleParsePreview = (text: string, overrideTopic: string) => {
    setJsonText(text);
    setImportReport(null);
    setAffectedTopics([]);
    setPreviewPage(1);

    if (!text.trim()) {
      setParsedPreview(null);
      return;
    }

    try {
      const rawParsed = JSON.parse(text);
      const itemsArray = Array.isArray(rawParsed) ? rawParsed : [rawParsed];

      const previewItems: Partial<TopicQuestionItem>[] = [];
      const summary: Record<string, number> = {};
      const parseErrors: string[] = [];

      itemsArray.forEach((raw, idx) => {
        try {
          const defaultTopic = overrideTopic !== 'AUTO' ? overrideTopic : undefined;
          const parsed = dataStore.parseTopicQuestionJsonItem(raw, defaultTopic);
          
          // Force override if specified
          if (overrideTopic !== 'AUTO') {
            parsed.topicId = overrideTopic;
          }

          previewItems.push(parsed);
          const tSlug = parsed.topicId || 'numbers';
          summary[tSlug] = (summary[tSlug] || 0) + 1;
        } catch (e: any) {
          parseErrors.push(`Item #${idx + 1}: ${e.message || 'Malformed JSON format'}`);
        }
      });

      setParsedPreview({
        items: previewItems,
        topicSummary: summary,
        parseErrors,
      });
    } catch (err: any) {
      setParsedPreview({
        items: [],
        topicSummary: {},
        parseErrors: [`Invalid JSON Syntax: ${err.message}`],
      });
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleParsePreview(content, targetTopicOverride);
      }
    };
    reader.readAsText(file);
  };

  // Execute Bulk Import
  const handleExecuteImport = () => {
    if (!jsonText.trim()) return;

    const defaultTopic = targetTopicOverride !== 'AUTO' ? targetTopicOverride : undefined;
    const report = dataStore.importBulkTopicQuestionsJson(jsonText, defaultTopic);
    setImportReport(report);

    // Collect affected topic IDs for quick navigation links
    if (parsedPreview) {
      const slugs = Object.keys(parsedPreview.topicSummary);
      setAffectedTopics(slugs);
    }
  };

  const sampleJsonTemplate = `[
  {
    "topic": "Arithmetic Aptitude",
    "subtopic": "Problems on Numbers",
    "templateId": "PROBLEM_NUMBER_001",
    "variables": { "x": 24 },
    "difficulty": "Easy",
    "question": "A number exceeds its one-third by 24. What is the number?",
    "options": ["30", "36", "42", "48"],
    "correctOption": 1,
    "explanation": {
      "given": ["Let the number be x."],
      "steps": [
        { "title": "Form equation", "content": "x - x/3 = 24 => 2x/3 = 24" },
        { "title": "Solve for x", "content": "x = 24 × 3 / 2 = 36" }
      ],
      "finalAnswer": "36"
    }
  }
]`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eae1da] dark:border-[#2b2d31]">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Management Operations</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight">
            Bulk Question Importer
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb] mt-1">
            Upload or paste JSON files containing questions for any subtopic. The intelligent parser auto-detects subtopics, validates schemas, and prevents duplicate questions via SHA-256 fingerprints.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin"
            className="px-4 py-2 bg-[#f6ece6] dark:bg-[#2b2d31] hover:bg-[#eae1da] dark:hover:bg-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] rounded-full text-xs font-extrabold transition-all border border-[#eae1da] dark:border-[#383a40] flex items-center gap-1.5"
          >
            <span>Admin Dashboard</span>
          </Link>

          <button
            onClick={() => handleParsePreview(sampleJsonTemplate, targetTopicOverride)}
            className="px-4 py-2 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 rounded-full text-xs font-extrabold transition-all border border-purple-500/30 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Sample JSON</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Upload Controls + Subtopic Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Code Editor & File Dropzone */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase text-[#747878] dark:text-[#a6adbb] tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-purple-500" />
              <span>JSON Input / File Upload</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#f6ece6] dark:bg-[#2b2d31] hover:bg-[#eae1da] text-[#1f1b17] dark:text-[#e3e3e3] rounded-xl text-xs font-bold border border-[#eae1da] dark:border-[#383a40] flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-purple-500" />
                <span>Upload .JSON File</span>
              </button>

              {jsonText && (
                <button
                  type="button"
                  onClick={() => handleParsePreview('', targetTopicOverride)}
                  className="px-3 py-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* JSON Textarea Editor */}
          <div className="relative">
            <textarea
              rows={14}
              value={jsonText}
              onChange={(e) => handleParsePreview(e.target.value, targetTopicOverride)}
              placeholder="Paste JSON question array here..."
              className="w-full font-mono text-xs p-4 rounded-2xl bg-[#141517] text-emerald-400 border border-[#383a40] focus:outline-none focus:border-purple-500 shadow-inner leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column (1 Col): Subtopic Target Override & Quick Summary */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">
              <Layers className="w-4 h-4 text-purple-500" />
              <span>Target Subtopic Routing</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#747878] dark:text-[#a6adbb] block">
                Destination Subtopic:
              </label>
              <select
                value={targetTopicOverride}
                onChange={(e) => handleParsePreview(jsonText, e.target.value)}
                className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-xl p-2.5 text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none focus:border-purple-500"
              >
                <option value="AUTO">✨ Auto-Detect from JSON ("subtopic")</option>
                <optgroup label="Override Target Topic">
                  {ARITHMETIC_TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.id})
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="text-[10px] text-[#747878] dark:text-[#a6adbb] pt-1">
                Auto-detect parses the subtopic field in each question JSON object automatically.
              </p>
            </div>
          </div>

          {/* Detected Subtopics Summary Card */}
          {parsedPreview && Object.keys(parsedPreview.topicSummary).length > 0 && (
            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Folder className="w-4 h-4" />
                  <span>Detected Subtopics ({Object.keys(parsedPreview.topicSummary).length})</span>
                </span>
                <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                  {parsedPreview.items.length} Questions
                </span>
              </div>

              <div className="space-y-2">
                {Object.entries(parsedPreview.topicSummary).map(([slug, count]) => (
                  <div
                    key={slug}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/70 dark:bg-[#141517]/70 border border-purple-500/20 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="font-bold text-[#1f1b17] dark:text-[#e3e3e3] truncate">
                        {getTopicDisplayName(slug)}
                      </span>
                    </div>
                    <span className="font-extrabold text-purple-600 dark:text-purple-400 shrink-0">
                      {count} Qs
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleExecuteImport}
                className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import {parsedPreview.items.length} Questions Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Import Result Audit Report */}
      {importReport && (
        <div className="p-6 rounded-[24px] bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] space-y-5 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#eae1da] dark:border-[#2b2d31]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <h3 className="font-display text-lg font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">
                Import Execution Audit Report
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                ✅ {importReport.success} Imported
              </span>
              {importReport.duplicates > 0 && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
                  ⚠️ {importReport.duplicates} Duplicates Skipped
                </span>
              )}
              {importReport.invalid > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-extrabold text-xs">
                  ❌ {importReport.invalid} Rejected
                </span>
              )}
            </div>
          </div>

          {/* Affected Topic Action Links */}
          {affectedTopics.length > 0 && (
            <div className="space-y-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Questions Available Immediately! Click below to view:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {affectedTopics.map((slug) => (
                  <Link
                    key={slug}
                    to={`/aptitude/arithmetic-aptitude/topic/${slug}`}
                    target="_blank"
                    className="group flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#141517] border border-emerald-500/30 hover:border-emerald-500 shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-bold text-xs text-[#1f1b17] dark:text-[#e3e3e3] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                        {getTopicDisplayName(slug)}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Audit Error Logs */}
          {importReport.errors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                Detailed Audit Error Logs ({importReport.errors.length}):
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {importReport.errors.map((err, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between text-rose-700 dark:text-rose-300 font-extrabold">
                      <span>Item #{err.itemIndex}</span>
                      <span>{err.reason}</span>
                    </div>
                    {err.question && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 truncate opacity-90 font-mono">
                        "{err.question}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Preview List (Paginated for Heavy Datasets) */}
      {parsedPreview && parsedPreview.items.length > 0 && (() => {
        const totalPages = Math.ceil(parsedPreview.items.length / PREVIEW_PAGE_SIZE);
        const startIndex = (previewPage - 1) * PREVIEW_PAGE_SIZE;
        const visibleItems = parsedPreview.items.slice(startIndex, startIndex + PREVIEW_PAGE_SIZE);

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-display text-base font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-500" />
                <span>Parsed Questions Live Inspection Preview ({parsedPreview.items.length})</span>
              </h3>

              {totalPages > 1 && (
                <div className="flex items-center gap-2 text-xs font-bold">
                  <button
                    disabled={previewPage <= 1}
                    onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-lg bg-[#f6ece6] dark:bg-[#2b2d31] disabled:opacity-40 text-[#1f1b17] dark:text-[#e3e3e3] border border-[#eae1da] dark:border-[#383a40]"
                  >
                    ← Prev
                  </button>
                  <span className="text-[#747878] dark:text-[#a6adbb]">
                    Page {previewPage} of {totalPages}
                  </span>
                  <button
                    disabled={previewPage >= totalPages}
                    onClick={() => setPreviewPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded-lg bg-[#f6ece6] dark:bg-[#2b2d31] disabled:opacity-40 text-[#1f1b17] dark:text-[#e3e3e3] border border-[#eae1da] dark:border-[#383a40]"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {visibleItems.map((q, localIdx) => {
                const globalIdx = startIndex + localIdx;
                return (
                  <div
                    key={globalIdx}
                    className="p-5 rounded-2xl bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400">
                          #{globalIdx + 1}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold border border-purple-500/30">
                          {getTopicDisplayName(q.topicId || 'numbers')}
                        </span>
                        <span className="text-[10px] font-bold text-[#747878] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                          Diff: {q.difficultyLevel === 1 ? 'Easy' : q.difficultyLevel === 3 ? 'Hard' : 'Medium'}
                        </span>
                      </div>

                      <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        Correct: Option ({q.correctAnswer})
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                      {q.statement}
                    </p>

                    {/* Options Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                            opt.id === q.correctAnswer
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                              : 'bg-[#f6ece6]/60 dark:bg-[#141517] border-[#eae1da] dark:border-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3]'
                          }`}
                        >
                          <span className="font-bold w-4">{opt.id}.</span>
                          <span className="truncate">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-[#747878] dark:text-[#a6adbb]">
                  Showing items {startIndex + 1} - {Math.min(parsedPreview.items.length, startIndex + PREVIEW_PAGE_SIZE)} of {parsedPreview.items.length}
                </span>

                <div className="flex items-center gap-2 text-xs font-bold">
                  <button
                    disabled={previewPage <= 1}
                    onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-lg bg-[#f6ece6] dark:bg-[#2b2d31] disabled:opacity-40 text-[#1f1b17] dark:text-[#e3e3e3] border border-[#eae1da] dark:border-[#383a40]"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={previewPage >= totalPages}
                    onClick={() => setPreviewPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded-lg bg-[#f6ece6] dark:bg-[#2b2d31] disabled:opacity-40 text-[#1f1b17] dark:text-[#e3e3e3] border border-[#eae1da] dark:border-[#383a40]"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
