import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload, Plus, Trash2, Edit3, Check, X, ChevronDown, ChevronUp,
  Copy, ArrowLeft, FileCode, Layers, Brain, AlertCircle,
  CheckCircle2, RotateCcw, Download, Search,
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import { technicalService } from '@/services/technical.service';
import type { ProgrammingProblem, TechnicalMcq, TechnicalTrack } from '@/types/technical';

// ─── JSON Templates ───────────────────────────────────────────────────────────
const P150_TEMPLATE = JSON.stringify([{
  title: 'Count Digits in an Integer',
  topicId: 'digit-manipulation',
  level: 'BASIC',
  description: 'Given an integer N, count and return the total number of digits in N.',
  constraints: ['-10^18 <= N <= 10^18'],
  testCases: [{ input: 'N = 1567', output: '4', explanation: '1567 has 4 digits.' }],
  solutions: { java: 'public class Solution { ... }', python: 'def count_digits(n): ...' },
  timeComplexity: 'O(log N)',
  spaceComplexity: 'O(1)',
  hints: ['Handle N = 0 as edge case'],
  companyTags: ['TCS NQT', 'Infosys'],
}], null, 2);

const MCQ_TEMPLATE = JSON.stringify([{
  topic: 'C Programming',
  topicCategory: 'C_PROGRAMMING',
  topicId: 'mcq-c-programming',
  question: 'What is the output of printf("%d", sizeof(int))?',
  codeSnippet: '#include<stdio.h>\nint main() { printf("%d", sizeof(int)); }',
  options: ['2', '4', '8', 'Compiler dependent'],
  correctOptionIndex: 3,
  explanation: 'sizeof(int) is platform-dependent — typically 4 on 32/64-bit systems.',
  companyTags: ['TCS', 'Wipro'],
}], null, 2);

type TabType = 'programming-150' | 'campus-dsa' | 'technical-mcqs';

export default function AdminTechnicalPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!isSuperAdminEmail(user?.email)) return <NotFoundPage />;

  const [activeTab, setActiveTab] = useState<TabType>('programming-150');
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
  const [addDraft, setAddDraft] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data: p150 = [], refetch: refetchP150 } = useQuery({
    queryKey: ['admin-p150'],
    queryFn: () => technicalService.getProgramming150Problems(),
    staleTime: 0,
  });
  const importedP150 = technicalService.getImportedProblems();

  const { data: mcqs = [], refetch: refetchMcqs } = useQuery({
    queryKey: ['admin-mcqs'],
    queryFn: () => technicalService.getTechnicalMcqs(),
    staleTime: 0,
  });
  const importedMcqs = technicalService.getImportedMcqs();

  const refetch = useCallback(() => {
    if (activeTab === 'programming-150') { refetchP150(); queryClient.invalidateQueries({ queryKey: ['programming-150-problems'] }); }
    if (activeTab === 'campus-dsa') { refetchP150(); queryClient.invalidateQueries({ queryKey: ['campus-dsa-problems'] }); }
    if (activeTab === 'technical-mcqs') { refetchMcqs(); queryClient.invalidateQueries({ queryKey: ['technical-mcqs'] }); }
  }, [activeTab, refetchP150, refetchMcqs, queryClient]);

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
    const tpl = activeTab === 'technical-mcqs' ? MCQ_TEMPLATE : P150_TEMPLATE;
    navigator.clipboard.writeText(tpl);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  // ─── Bulk Import ──────────────────────────────────────────────────────────
  const handleBulkImport = async () => {
    if (!parsedItems.length || parseError) return;
    setIsImporting(true);
    try {
      let result: { importedCount: number };
      if (activeTab === 'technical-mcqs') {
        result = await technicalService.importTechnicalMcqs(parsedItems);
      } else {
        result = await technicalService.importProgrammingProblems(parsedItems);
      }
      setImportReport({ count: result.importedCount, message: `Successfully imported ${result.importedCount} item(s).` });
      setJsonText('');
      setParsedItems([]);
      refetch();
    } catch (e: any) {
      setImportReport({ count: 0, message: `Error: ${e.message}` });
    } finally {
      setIsImporting(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    if (!confirm('Delete this item permanently?')) return;
    if (activeTab === 'technical-mcqs') {
      technicalService.deleteImportedMcq(id);
    } else {
      technicalService.deleteProgrammingProblem(id);
    }
    refetch();
  };

  // ─── Edit (imported items only) ───────────────────────────────────────────
  const startEdit = (item: ProgrammingProblem | TechnicalMcq) => {
    setEditingId(item.id);
    setEditDraft({ ...item });
  };

  const saveEdit = () => {
    if (!editingId) return;
    setIsSaving(true);
    if (activeTab === 'technical-mcqs') {
      technicalService.updateImportedMcq(editingId, editDraft as Partial<TechnicalMcq>);
    } else {
      technicalService.updateImportedProblem(editingId, editDraft as Partial<ProgrammingProblem>);
    }
    setEditingId(null);
    setEditDraft({});
    setIsSaving(false);
    refetch();
  };

  // ─── Add Single ───────────────────────────────────────────────────────────
  const handleAddSingle = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'technical-mcqs') {
        await technicalService.importTechnicalMcqs([addDraft]);
      } else {
        await technicalService.importProgrammingProblems([addDraft]);
      }
      setShowAddForm(false);
      setAddDraft({});
      refetch();
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Clear All ────────────────────────────────────────────────────────────
  const handleClearAll = () => {
    if (!confirm('Clear ALL custom imported items for this track? This cannot be undone.')) return;
    if (activeTab === 'technical-mcqs') technicalService.clearAllImportedMcqs();
    else technicalService.clearAllImportedProblems();
    refetch();
  };

  // ─── Filtered data ────────────────────────────────────────────────────────
  const q = searchQuery.toLowerCase();
  const filteredMcqs = mcqs.filter(m =>
    m.question.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q)
  );
  const filteredP150 = p150.filter(p =>
    p.title.toLowerCase().includes(q) || (p.topicId || '').toLowerCase().includes(q)
  );

  const isMcqImported = (id: string) => importedMcqs.some(m => m.id === id);
  const isP150Imported = (id: string) => importedP150.some(p => p.id === id);

  const currentTemplate = activeTab === 'technical-mcqs' ? MCQ_TEMPLATE : P150_TEMPLATE;

  // ─── MCQ Add/Edit Form Fields ─────────────────────────────────────────────
  const McqFormFields = ({ draft, setDraft }: { draft: Record<string, any>; setDraft: (d: Record<string, any>) => void }) => (
    <div className="grid grid-cols-1 gap-3">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Question *</label>
        <textarea rows={3} value={draft.question || ''} onChange={e => setDraft({ ...draft, question: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Topic / Subject</label>
        <input type="text" value={draft.topic || ''} onChange={e => setDraft({ ...draft, topic: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Topic Category</label>
        <select value={draft.topicCategory || 'C_PROGRAMMING'} onChange={e => setDraft({ ...draft, topicCategory: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
          {['C_PROGRAMMING','CPP_PROGRAMMING','CSHARP_PROGRAMMING','JAVA_PROGRAMMING','DATABASE','NETWORKING','OPERATING_SYSTEMS','DATA_STRUCTURES','PSEUDO_CODE'].map(c => (
            <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Options (4, comma-separated)</label>
        <input type="text" value={Array.isArray(draft.options) ? draft.options.join(',') : ''}
          onChange={e => setDraft({ ...draft, options: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="Option A, Option B, Option C, Option D" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Correct Option Index (0-3)</label>
        <input type="number" min={0} max={3} value={draft.correctOptionIndex ?? 0} onChange={e => setDraft({ ...draft, correctOptionIndex: Number(e.target.value) })}
          className="w-32 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Code Snippet (optional)</label>
        <textarea rows={3} value={draft.codeSnippet || ''} onChange={e => setDraft({ ...draft, codeSnippet: e.target.value })}
          className="w-full text-sm font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Explanation *</label>
        <textarea rows={2} value={draft.explanation || ''} onChange={e => setDraft({ ...draft, explanation: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Company Tags (comma-separated)</label>
        <input type="text" value={Array.isArray(draft.companyTags) ? draft.companyTags.join(', ') : ''}
          onChange={e => setDraft({ ...draft, companyTags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="TCS, Wipro, Infosys" />
      </div>
    </div>
  );

  // ─── Problem Add/Edit Form Fields ──────────────────────────────────────────
  const ProblemFormFields = ({ draft, setDraft }: { draft: Record<string, any>; setDraft: (d: Record<string, any>) => void }) => (
    <div className="grid grid-cols-1 gap-3">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Title *</label>
        <input type="text" value={draft.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Level</label>
          <select value={draft.level || 'MEDIUM'} onChange={e => setDraft({ ...draft, level: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="BASIC">Basic</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Topic ID</label>
          <input type="text" value={draft.topicId || ''} onChange={e => setDraft({ ...draft, topicId: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="e.g. arrays-strings" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Description *</label>
        <textarea rows={4} value={draft.description || ''} onChange={e => setDraft({ ...draft, description: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Constraints (one per line)</label>
        <textarea rows={2} value={Array.isArray(draft.constraints) ? draft.constraints.join('\n') : ''}
          onChange={e => setDraft({ ...draft, constraints: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
          className="w-full text-sm font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Time Complexity</label>
          <input type="text" value={draft.timeComplexity || 'O(N)'} onChange={e => setDraft({ ...draft, timeComplexity: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Space Complexity</label>
          <input type="text" value={draft.spaceComplexity || 'O(1)'} onChange={e => setDraft({ ...draft, spaceComplexity: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Company Tags (comma-separated)</label>
        <input type="text" value={Array.isArray(draft.companyTags) ? draft.companyTags.join(', ') : ''}
          onChange={e => setDraft({ ...draft, companyTags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="TCS, Wipro, Infosys" />
      </div>
    </div>
  );

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'programming-150', label: 'Programming 150', icon: <FileCode className="w-4 h-4" />, count: filteredP150.length },
    { id: 'campus-dsa', label: 'Campus DSA', icon: <Layers className="w-4 h-4" />, count: filteredP150.length },
    { id: 'technical-mcqs', label: 'Technical MCQs', icon: <Brain className="w-4 h-4" />, count: filteredMcqs.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin" className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-500" />
        </Link>
        <div>
          <h1 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            Technical Hub Admin
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage Programming 150, Campus DSA, and Technical MCQs content
          </p>
        </div>
      </div>

      {/* Track Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchQuery(''); setShowBulkPanel(false); setShowAddForm(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search items…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-500/40" />
        </div>
        <button onClick={() => { setShowAddForm(v => !v); setShowBulkPanel(false); setAddDraft({}); }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-colors">
          <Plus className="w-4 h-4" /> Add Single
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

      {/* Add Single Form */}
      {showAddForm && (
        <div className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-900/10 p-5 space-y-4">
          <h3 className="font-semibold text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Single {activeTab === 'technical-mcqs' ? 'MCQ' : 'Problem'}
          </h3>
          {activeTab === 'technical-mcqs'
            ? <McqFormFields draft={addDraft} setDraft={setAddDraft} />
            : <ProblemFormFields draft={addDraft} setDraft={setAddDraft} />
          }
          <div className="flex items-center gap-2 pt-2">
            <button onClick={handleAddSingle} disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 transition-colors">
              <Check className="w-4 h-4" /> {isSaving ? 'Saving…' : 'Save'}
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
              <Upload className="w-4 h-4" /> Bulk JSON Import — {activeTab === 'technical-mcqs' ? 'Technical MCQs' : 'Programming Problems'}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={copyTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTemplate ? 'Copied!' : 'Copy Template'}
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Download className="w-3.5 h-3.5" /> Upload JSON File
              </button>
              <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={e => handleTextChange(e.target.value)}
            rows={10}
            placeholder={`Paste JSON array here…\n\n${currentTemplate}`}
            className="w-full text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />

          {parseError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Parse error: {parseError}</span>
            </div>
          )}

          {parsedItems.length > 0 && !parseError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Valid JSON — {parsedItems.length} item(s) ready to import.</span>
            </div>
          )}

          {importReport && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              importReport.count > 0
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400'
            }`}>
              {importReport.count > 0 ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{importReport.message}</span>
            </div>
          )}

          <button onClick={handleBulkImport}
            disabled={!parsedItems.length || !!parseError || isImporting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <Upload className="w-4 h-4" />
            {isImporting ? 'Importing…' : `Import ${parsedItems.length} Item(s)`}
          </button>
        </div>
      )}

      {/* Items Table */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* MCQs List */}
        {activeTab === 'technical-mcqs' && (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {filteredMcqs.length} MCQ(s)
              </span>
              <span className="text-xs text-neutral-400">Custom: {importedMcqs.length}</span>
            </div>
            {filteredMcqs.length === 0 && (
              <div className="py-12 text-center text-sm text-neutral-400">No MCQs found.</div>
            )}
            {filteredMcqs.map(mcq => {
              const isImported = isMcqImported(mcq.id);
              const isEditing = editingId === mcq.id;
              return (
                <div key={mcq.id} className={`p-4 space-y-3 ${isEditing ? 'bg-purple-50/50 dark:bg-purple-900/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'}`}>
                  {isEditing ? (
                    <>
                      <McqFormFields draft={editDraft} setDraft={setEditDraft} />
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
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {mcq.topic}
                          </span>
                          {isImported && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                              Custom
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-800 dark:text-neutral-200 line-clamp-2">{mcq.question}</p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Correct: Option {mcq.correctOptionIndex + 1} — {mcq.options[mcq.correctOptionIndex]}
                        </p>
                      </div>
                      {isImported && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => startEdit(mcq)} className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(mcq.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
        )}

        {/* Problems List */}
        {(activeTab === 'programming-150' || activeTab === 'campus-dsa') && (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {filteredP150.length} Problem(s)
              </span>
              <span className="text-xs text-neutral-400">Custom: {importedP150.length}</span>
            </div>
            {filteredP150.length === 0 && (
              <div className="py-12 text-center text-sm text-neutral-400">No problems found.</div>
            )}
            {filteredP150.map(prob => {
              const isImported = isP150Imported(prob.id);
              const isEditing = editingId === prob.id;
              const levelColor = prob.level === 'BASIC'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : prob.level === 'MEDIUM'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

              return (
                <div key={prob.id} className={`p-4 space-y-3 ${isEditing ? 'bg-purple-50/50 dark:bg-purple-900/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'}`}>
                  {isEditing ? (
                    <>
                      <ProblemFormFields draft={editDraft} setDraft={setEditDraft} />
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
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${levelColor}`}>
                            {prob.level}
                          </span>
                          {prob.topicId && (
                            <span className="text-xs text-neutral-400">{prob.topicId}</span>
                          )}
                          {isImported && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                              Custom
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{prob.title}</p>
                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{prob.description}</p>
                      </div>
                      {isImported && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => startEdit(prob)} className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(prob.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
        )}
      </div>
    </div>
  );
}
