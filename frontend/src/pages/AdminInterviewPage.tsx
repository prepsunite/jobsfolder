import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload, Plus, Trash2, Edit3, Check, X, Copy,
  ArrowLeft, MessageSquareQuote, AlertCircle, CheckCircle2,
  RotateCcw, Download, Search,
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import { interviewService } from '@/services/interview.service';
import { ALL_INTERVIEW_TOPICS } from '@/services/interviewTopicsData';
import type { InterviewQuestion, InterviewCategory } from '@/types/interview';

// ─── JSON Template ────────────────────────────────────────────────────────────
const QUESTION_TEMPLATE = JSON.stringify([{
  topicId: 'topic-dbms',
  title: 'What is ACID in databases?',
  category: 'CORE_CS',
  subject: 'DBMS',
  subjectLabel: 'Database Management Systems',
  answer: 'ACID stands for Atomicity, Consistency, Isolation, Durability — the four key properties that guarantee database transactions are processed reliably.',
  bulletPoints: [
    'Atomicity: All-or-nothing execution of a transaction.',
    'Consistency: DB moves from one valid state to another.',
    'Isolation: Concurrent transactions don\'t interfere.',
    'Durability: Committed data persists even after crashes.',
  ],
  codeSnippet: { language: 'sql', code: 'BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\nCOMMIT;' },
  proTip: 'Interviewers often ask which ACID property is hardest to achieve — answer: Isolation (needs complex locking/MVCC).',
  companyTags: ['TCS', 'Infosys', 'Wipro'],
  frequency: 'VERY_HIGH',
}], null, 2);

type FilterCat = 'ALL' | InterviewCategory;

export default function AdminInterviewPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!isSuperAdminEmail(user?.email)) return <NotFoundPage />;

  const [filterCat, setFilterCat] = useState<FilterCat>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk import state
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [importReport, setImportReport] = useState<{ count: number; message: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inline add/edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, any>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addDraft, setAddDraft] = useState<Record<string, any>>({ category: 'CORE_CS', frequency: 'MEDIUM' });
  const [isSaving, setIsSaving] = useState(false);

  // ─── Query ────────────────────────────────────────────────────────────────
  const { data: allQuestions = [], refetch } = useQuery({
    queryKey: ['admin-interview-questions'],
    queryFn: () => interviewService.getAllQuestions(),
    staleTime: 0,
  });

  const importedQuestions = interviewService.getImportedQuestions();

  const doRefetch = useCallback(() => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['interview-prep-questions'] });
  }, [refetch, queryClient]);

  // ─── JSON Parse ───────────────────────────────────────────────────────────
  const handleTextChange = (text: string) => {
    setJsonText(text);
    setImportReport(null);
    if (!text.trim()) { setParsedItems([]); setParseError(null); return; }
    try {
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      setParsedItems(arr);
      setParseError(null);
    } catch (e: any) {
      setParsedItems([]);
      setParseError(e.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleTextChange((ev.target?.result as string) || '');
    reader.readAsText(file);
    e.target.value = '';
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(QUESTION_TEMPLATE);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  // ─── Bulk Import ──────────────────────────────────────────────────────────
  const handleBulkImport = async () => {
    if (!parsedItems.length || parseError) return;
    setIsImporting(true);
    try {
      const result = await interviewService.importInterviewQuestions(parsedItems);
      setImportReport({ count: result.importedCount, message: `Successfully imported ${result.importedCount} question(s).` });
      setJsonText('');
      setParsedItems([]);
      doRefetch();
    } catch (e: any) {
      setImportReport({ count: 0, message: `Error: ${e.message}` });
    } finally {
      setIsImporting(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    if (!confirm('Delete this question permanently?')) return;
    interviewService.deleteImportedQuestion(id);
    doRefetch();
  };

  // ─── Edit ─────────────────────────────────────────────────────────────────
  const startEdit = (q: InterviewQuestion) => {
    setEditingId(q.id);
    setEditDraft({
      ...q,
      bulletPoints: Array.isArray(q.bulletPoints) ? q.bulletPoints.join('\n') : '',
      companyTags: Array.isArray(q.companyTags) ? q.companyTags.join(', ') : '',
      codeSnippetLang: q.codeSnippet?.language || '',
      codeSnippetCode: q.codeSnippet?.code || '',
    });
  };

  const buildFromDraft = (d: Record<string, any>): Partial<InterviewQuestion> => ({
    topicId: d.topicId,
    title: d.title,
    category: d.category,
    subject: d.subject,
    subjectLabel: d.subjectLabel,
    answer: d.answer,
    bulletPoints: d.bulletPoints ? String(d.bulletPoints).split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
    codeSnippet: d.codeSnippetCode ? { language: d.codeSnippetLang || 'plaintext', code: d.codeSnippetCode } : undefined,
    proTip: d.proTip,
    companyTags: d.companyTags ? String(d.companyTags).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    frequency: d.frequency || 'MEDIUM',
  });

  const saveEdit = () => {
    if (!editingId) return;
    setIsSaving(true);
    interviewService.updateImportedQuestion(editingId, buildFromDraft(editDraft));
    setEditingId(null);
    setEditDraft({});
    setIsSaving(false);
    doRefetch();
  };

  // ─── Add Single ───────────────────────────────────────────────────────────
  const handleAddSingle = async () => {
    setIsSaving(true);
    try {
      await interviewService.importInterviewQuestions([buildFromDraft(addDraft)]);
      setShowAddForm(false);
      setAddDraft({ category: 'CORE_CS', frequency: 'MEDIUM' });
      doRefetch();
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Clear All Custom ─────────────────────────────────────────────────────
  const handleClearAll = () => {
    if (!confirm('Clear ALL custom imported interview questions? This cannot be undone.')) return;
    interviewService.clearAllImportedQuestions();
    doRefetch();
  };

  // ─── Filtered ─────────────────────────────────────────────────────────────
  const q = searchQuery.toLowerCase();
  const filtered = allQuestions.filter(aq =>
    (filterCat === 'ALL' || aq.category === filterCat) &&
    (aq.title.toLowerCase().includes(q) || aq.answer.toLowerCase().includes(q))
  );

  const isImported = (id: string) => importedQuestions.some(iq => iq.id === id);

  const catLabel: Record<string, string> = {
    CORE_CS: 'Core CS',
    HR_BEHAVIORAL: 'HR & Behavioral',
    PROJECT_DEFENSE: 'Project Defense',
  };

  const catColor: Record<string, string> = {
    CORE_CS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    HR_BEHAVIORAL: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    PROJECT_DEFENSE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  };

  const freqColor: Record<string, string> = {
    VERY_HIGH: 'text-red-500 dark:text-red-400',
    HIGH: 'text-amber-500 dark:text-amber-400',
    MEDIUM: 'text-neutral-400',
  };

  // ─── Question Form Fields ──────────────────────────────────────────────────
  const QuestionFormFields = ({ draft, setDraft }: { draft: Record<string, any>; setDraft: (d: Record<string, any>) => void }) => (
    <div className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Category *</label>
          <select value={draft.category || 'CORE_CS'} onChange={e => setDraft({ ...draft, category: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="CORE_CS">Core CS Fundamentals</option>
            <option value="HR_BEHAVIORAL">HR & Behavioral</option>
            <option value="PROJECT_DEFENSE">Project Defense & Viva</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Topic</label>
          <select value={draft.topicId || ''} onChange={e => setDraft({ ...draft, topicId: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="">— None —</option>
            {ALL_INTERVIEW_TOPICS.filter(t => t.category === (draft.category || 'CORE_CS')).map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Question Title *</label>
        <input type="text" value={draft.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="e.g. What is the difference between INNER JOIN and OUTER JOIN?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Subject</label>
          <select value={draft.subject || ''} onChange={e => setDraft({ ...draft, subject: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="">— None —</option>
            <option value="DBMS">DBMS</option>
            <option value="SQL_QUERIES">SQL Queries</option>
            <option value="OOPS">OOPs</option>
            <option value="OPERATING_SYSTEMS">Operating Systems</option>
            <option value="COMPUTER_NETWORKS">Computer Networks</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Frequency</label>
          <select value={draft.frequency || 'MEDIUM'} onChange={e => setDraft({ ...draft, frequency: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="VERY_HIGH">Very High</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Model Answer *</label>
        <textarea rows={4} value={draft.answer || ''} onChange={e => setDraft({ ...draft, answer: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="Full, detailed answer the student should be able to give…" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Key Concepts / Bullet Points (one per line)</label>
        <textarea rows={4} value={draft.bulletPoints || ''} onChange={e => setDraft({ ...draft, bulletPoints: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder={'Atomicity: All-or-nothing execution.\nConsistency: DB moves from valid state to valid state.'} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Code Snippet Language</label>
          <input type="text" value={draft.codeSnippetLang || ''} onChange={e => setDraft({ ...draft, codeSnippetLang: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="sql / java / python / cpp" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Subject Label</label>
          <input type="text" value={draft.subjectLabel || ''} onChange={e => setDraft({ ...draft, subjectLabel: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="e.g. Database Management Systems" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Code Snippet</label>
        <textarea rows={4} value={draft.codeSnippetCode || ''} onChange={e => setDraft({ ...draft, codeSnippetCode: e.target.value })}
          className="w-full text-sm font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Pro Tip (optional)</label>
        <input type="text" value={draft.proTip || ''} onChange={e => setDraft({ ...draft, proTip: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="What interviewers look for beyond the textbook answer…" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Company Tags (comma-separated)</label>
        <input type="text" value={draft.companyTags || ''} onChange={e => setDraft({ ...draft, companyTags: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="TCS, Infosys, Wipro" />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin" className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-500" />
        </Link>
        <div>
          <h1 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            Interview Prep Admin
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage Core CS, HR & Behavioral, and Project Defense interview questions
          </p>
        </div>
      </div>

      {/* Category Filter + Stats */}
      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', 'CORE_CS', 'HR_BEHAVIORAL', 'PROJECT_DEFENSE'] as FilterCat[]).map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              filterCat === cat
                ? 'bg-purple-500 text-white border-purple-500'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}>
            {cat === 'ALL' ? `All (${allQuestions.length})` : `${catLabel[cat]} (${allQuestions.filter(q => q.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
        </div>
        <button onClick={() => { setShowAddForm(v => !v); setShowBulkPanel(false); setAddDraft({ category: 'CORE_CS', frequency: 'MEDIUM' }); }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-colors">
          <Plus className="w-4 h-4" /> Add Question
        </button>
        <button onClick={() => { setShowBulkPanel(v => !v); setShowAddForm(false); }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-900 dark:hover:bg-neutral-600 text-white transition-colors">
          <Upload className="w-4 h-4" /> Bulk Import
        </button>
        <button onClick={handleClearAll}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <RotateCcw className="w-4 h-4" /> Clear Custom
        </button>
      </div>

      {/* Add Question Form */}
      {showAddForm && (
        <div className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-900/10 p-5 space-y-4">
          <h3 className="font-semibold text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Interview Question
          </h3>
          <QuestionFormFields draft={addDraft} setDraft={setAddDraft} />
          <div className="flex items-center gap-2 pt-2">
            <button onClick={handleAddSingle} disabled={isSaving || !addDraft.title || !addDraft.answer}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 transition-colors">
              <Check className="w-4 h-4" /> {isSaving ? 'Saving…' : 'Save Question'}
            </button>
            <button onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bulk Import Panel */}
      {showBulkPanel && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Bulk JSON Import — Interview Questions
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={copyTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTemplate ? 'Copied!' : 'Copy Template'}
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Download className="w-3.5 h-3.5" /> Upload JSON
              </button>
              <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={e => handleTextChange(e.target.value)}
            rows={10}
            placeholder={`Paste JSON array here…\n\n${QUESTION_TEMPLATE}`}
            className="w-full text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />

          {parseError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> Parse error: {parseError}
            </div>
          )}
          {parsedItems.length > 0 && !parseError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Valid JSON — {parsedItems.length} question(s) ready.
            </div>
          )}
          {importReport && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              importReport.count > 0
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400'
            }`}>
              {importReport.count > 0 ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {importReport.message}
            </div>
          )}

          <button onClick={handleBulkImport}
            disabled={!parsedItems.length || !!parseError || isImporting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <Upload className="w-4 h-4" />
            {isImporting ? 'Importing…' : `Import ${parsedItems.length} Question(s)`}
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            {filtered.length} Question(s) {filterCat !== 'ALL' ? `in ${catLabel[filterCat]}` : ''}
          </span>
          <span className="text-xs text-neutral-400">Custom: {importedQuestions.length}</span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-neutral-400">No questions found.</div>
          )}
          {filtered.map(iq => {
            const imported = isImported(iq.id);
            const isEditing = editingId === iq.id;
            return (
              <div key={iq.id} className={`p-4 space-y-3 ${isEditing ? 'bg-purple-50/50 dark:bg-purple-900/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'}`}>
                {isEditing ? (
                  <>
                    <QuestionFormFields draft={editDraft} setDraft={setEditDraft} />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${catColor[iq.category] || 'bg-neutral-100 text-neutral-600'}`}>
                          {catLabel[iq.category] || iq.category}
                        </span>
                        {iq.subjectLabel && (
                          <span className="text-xs text-neutral-400">{iq.subjectLabel}</span>
                        )}
                        {iq.frequency && (
                          <span className={`text-xs font-semibold ${freqColor[iq.frequency] || ''}`}>
                            {iq.frequency === 'VERY_HIGH' ? '🔥 Very High' : iq.frequency === 'HIGH' ? '⚡ High' : 'Med'}
                          </span>
                        )}
                        {imported && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1">{iq.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">{iq.answer}</p>
                      {iq.companyTags && iq.companyTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {iq.companyTags.slice(0, 4).map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {imported && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => startEdit(iq)} className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(iq.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
