import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload, Plus, Trash2, Edit3, Check, X, Copy,
  ArrowLeft, MessageSquareQuote, AlertCircle, CheckCircle2,
  RotateCcw, Download, Search, Eye, EyeOff, Layers, BookOpen,
  Database, Server, Cpu, Users, ShieldCheck, HelpCircle
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import { interviewService } from '@/services/interview.service';
import type { InterviewQuestion, InterviewCategory, InterviewTopic } from '@/types/interview';

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

type TabType = 'topics' | 'questions';
type FilterCat = 'ALL' | InterviewCategory;

export default function AdminInterviewPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!isSuperAdminEmail(user?.email)) return <NotFoundPage />;

  const [activeTab, setActiveTab] = useState<TabType>('topics');
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

  // Question add/edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, any>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addDraft, setAddDraft] = useState<Record<string, any>>({ category: 'CORE_CS', frequency: 'MEDIUM' });
  const [isSaving, setIsSaving] = useState(false);

  // Topic Modal state
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Partial<InterviewTopic> | null>(null);
  const [topicDraft, setTopicDraft] = useState<Partial<InterviewTopic>>({
    category: 'CORE_CS',
    cluster: 'Core CS Fundamentals',
    icon_name: 'BookOpen',
    is_hidden: false,
    formulas: [],
  });
  const [topicFormFormulasText, setTopicFormFormulasText] = useState('');

  // ─── Queries ────────────────────────────────────────────────────────────────
  const { data: allTopics = [], refetch: refetchTopics } = useQuery({
    queryKey: ['admin-interview-topics'],
    queryFn: () => interviewService.getAllTopics(),
    staleTime: 0,
  });

  const { data: allQuestions = [], refetch: refetchQuestions } = useQuery({
    queryKey: ['admin-interview-questions'],
    queryFn: () => interviewService.getAllQuestions(),
    staleTime: 0,
  });

  const refetchAll = useCallback(() => {
    refetchTopics();
    refetchQuestions();
    queryClient.invalidateQueries({ queryKey: ['interview-prep-topics'] });
    queryClient.invalidateQueries({ queryKey: ['interview-prep-questions'] });
  }, [refetchTopics, refetchQuestions, queryClient]);

  // Topic item counts map
  const topicCountsMap = useMemo(() => {
    const map: Record<string, number> = {};
    allQuestions.forEach(q => {
      if (q.topicId) map[q.topicId] = (map[q.topicId] || 0) + 1;
    });
    return map;
  }, [allQuestions]);

  // ─── TOPIC CRUD Handlers ──────────────────────────────────────────────────
  const openAddTopicModal = () => {
    setEditingTopic(null);
    setTopicDraft({
      id: '',
      name: '',
      title: '',
      category: (filterCat !== 'ALL' ? filterCat : 'CORE_CS'),
      cluster: 'Core CS Fundamentals',
      description: '',
      icon_name: 'BookOpen',
      sort_order: allTopics.length + 1,
      is_hidden: false,
      formulas: [],
    });
    setTopicFormFormulasText('');
    setTopicModalOpen(true);
  };

  const openEditTopicModal = (topic: InterviewTopic) => {
    setEditingTopic(topic);
    setTopicDraft({
      ...topic,
      name: topic.name || topic.title,
      icon_name: topic.icon_name || topic.iconName || 'BookOpen',
    });
    setTopicFormFormulasText(Array.isArray(topic.formulas) ? topic.formulas.join('\n') : '');
    setTopicModalOpen(true);
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicDraft.name?.trim()) {
      alert('Please provide a Topic Name / Title.');
      return;
    }

    const slug = topicDraft.id?.trim() || topicDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const formulasArray = topicFormFormulasText.split('\n').map(s => s.trim()).filter(Boolean);

    setIsSaving(true);
    try {
      const res = await interviewService.saveTopic({
        ...topicDraft,
        id: slug,
        name: topicDraft.name.trim(),
        title: topicDraft.name.trim(),
        formulas: formulasArray,
      });

      if (!res.success) {
        alert(res.error || 'Failed to save topic');
        return;
      }

      setTopicModalOpen(false);
      refetchAll();
    } catch (err: any) {
      alert('Error saving topic: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTopicHidden = async (topic: InterviewTopic) => {
    const nextHidden = !topic.is_hidden;
    await interviewService.toggleTopicVisibility(topic.id, nextHidden);
    refetchAll();
  };

  const handleDeleteTopic = async (topic: InterviewTopic) => {
    if (!confirm(`Delete topic "${topic.name || topic.title}"? Any linked questions will be retained.`)) return;
    await interviewService.deleteTopic(topic.id);
    refetchAll();
  };

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
      setImportReport({ count: result.importedCount, message: `Successfully imported ${result.importedCount} question(s) to Supabase cloud.` });
      setJsonText('');
      setParsedItems([]);
      refetchAll();
    } catch (e: any) {
      setImportReport({ count: 0, message: `Error: ${e.message}` });
    } finally {
      setIsImporting(false);
    }
  };

  // ─── Delete Question ──────────────────────────────────────────────────────
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Delete this question permanently?')) return;
    await interviewService.deleteInterviewQuestion(id);
    refetchAll();
  };

  // ─── Edit Question ────────────────────────────────────────────────────────
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

  const saveEdit = async () => {
    if (!editingId) return;
    setIsSaving(true);
    try {
      await interviewService.saveInterviewQuestion({
        ...buildFromDraft(editDraft),
        id: editingId,
      });
      setEditingId(null);
      setEditDraft({});
      refetchAll();
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Add Single Question ──────────────────────────────────────────────────
  const handleAddSingle = async () => {
    setIsSaving(true);
    try {
      await interviewService.saveInterviewQuestion(buildFromDraft(addDraft));
      setShowAddForm(false);
      setAddDraft({ category: 'CORE_CS', frequency: 'MEDIUM' });
      refetchAll();
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Filtered Lists ───────────────────────────────────────────────────────
  const q = searchQuery.toLowerCase().trim();

  const filteredTopics = allTopics.filter(t => {
    const matchesCat = filterCat === 'ALL' || t.category === filterCat;
    const matchesQuery = !q ||
      (t.name || t.title || '').toLowerCase().includes(q) ||
      (t.cluster || '').toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const filteredQuestions = allQuestions.filter(aq => {
    const matchesCat = filterCat === 'ALL' || aq.category === filterCat;
    const matchesQuery = !q ||
      aq.title.toLowerCase().includes(q) ||
      aq.answer.toLowerCase().includes(q) ||
      (aq.subjectLabel || '').toLowerCase().includes(q) ||
      (aq.topicId || '').toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const catLabel: Record<string, string> = {
    CORE_CS: 'Core CS Fundamentals',
    HR_BEHAVIORAL: 'HR & Behavioral',
    PROJECT_DEFENSE: 'Project Defense & Viva',
  };

  const catColor: Record<string, string> = {
    CORE_CS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    HR_BEHAVIORAL: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    PROJECT_DEFENSE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  };

  const freqColor: Record<string, string> = {
    VERY_HIGH: 'text-red-500 dark:text-red-400',
    HIGH: 'text-amber-500 dark:text-amber-400',
    MEDIUM: 'text-neutral-400',
  };

  // ─── Question Form Fields ──────────────────────────────────────────────────
  const QuestionFormFields = ({ draft, setDraft }: { draft: Record<string, any>; setDraft: (d: Record<string, any>) => void }) => (
    <div className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Supabase Topic</label>
          <select value={draft.topicId || ''} onChange={e => setDraft({ ...draft, topicId: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="">— Select Supabase Topic —</option>
            {allTopics.filter(t => t.category === (draft.category || 'CORE_CS')).map(t => (
              <option key={t.id} value={t.id}>{t.name || t.title} ({t.id})</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Question Title *</label>
        <input type="text" value={draft.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="e.g. What is the difference between Synchronous and Asynchronous execution?" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Subject / Domain</label>
          <select value={draft.subject || ''} onChange={e => setDraft({ ...draft, subject: e.target.value, subjectLabel: e.target.value.replace(/_/g, ' ') })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="">— None / General —</option>
            <option value="DBMS">DBMS</option>
            <option value="SQL_QUERIES">SQL Queries</option>
            <option value="OOPS">OOPs</option>
            <option value="OPERATING_SYSTEMS">Operating Systems</option>
            <option value="COMPUTER_NETWORKS">Computer Networks</option>
            <option value="SYSTEM_DESIGN">System Design</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Interview Frequency</label>
          <select value={draft.frequency || 'MEDIUM'} onChange={e => setDraft({ ...draft, frequency: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="VERY_HIGH">🔥 Very High (Asked in 80%+ Interviews)</option>
            <option value="HIGH">⚡ High (Frequent)</option>
            <option value="MEDIUM">Standard / Medium</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Model Answer *</label>
        <textarea rows={4} value={draft.answer || ''} onChange={e => setDraft({ ...draft, answer: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="Detailed, structured model answer that candidates should deliver..." />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Key Concepts / Bullet Points (one per line)</label>
        <textarea rows={3} value={draft.bulletPoints || ''} onChange={e => setDraft({ ...draft, bulletPoints: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder={'Key point 1: Core distinction...\nKey point 2: Practical trade-off...'} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Code Snippet Language</label>
          <input type="text" value={draft.codeSnippetLang || ''} onChange={e => setDraft({ ...draft, codeSnippetLang: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="sql / java / python / javascript" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Subject Display Label</label>
          <input type="text" value={draft.subjectLabel || ''} onChange={e => setDraft({ ...draft, subjectLabel: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="e.g. Database Management Systems" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Code Snippet (optional)</label>
        <textarea rows={3} value={draft.codeSnippetCode || ''} onChange={e => setDraft({ ...draft, codeSnippetCode: e.target.value })}
          className="w-full text-sm font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="// Code example demonstrating the concept" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Pro Tip for Candidate</label>
        <input type="text" value={draft.proTip || ''} onChange={e => setDraft({ ...draft, proTip: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="Inside tip on how interviewers follow up on this question..." />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Company Tags (comma-separated)</label>
        <input type="text" value={draft.companyTags || ''} onChange={e => setDraft({ ...draft, companyTags: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="Amazon, TCS, Infosys, Accenture" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                Interview Prep Admin
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Supabase Synced
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage Core CS, HR & Behavioral, and Project Defense interview topics and questions in Supabase
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'topics' ? (
            <button
              onClick={openAddTopicModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Topic
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowAddForm(v => !v); setShowBulkPanel(false); setAddDraft({ category: 'CORE_CS', frequency: 'MEDIUM' }); }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
              <button
                onClick={() => { setShowBulkPanel(v => !v); setShowAddForm(false); }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-900 dark:hover:bg-neutral-600 text-white transition-colors"
              >
                <Upload className="w-4 h-4" /> Bulk Import
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-px">
        <button
          onClick={() => { setActiveTab('topics'); setShowBulkPanel(false); setShowAddForm(false); }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'topics'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          Interview Topics
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            {filteredTopics.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('questions'); setShowBulkPanel(false); setShowAddForm(false); }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'questions'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          Questions & Answers
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            {filteredQuestions.length}
          </span>
        </button>
      </div>

      {/* Category Filter & Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'topics' ? "Search interview topics…" : "Search questions, model answers, tags…"}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/70 p-1 rounded-xl">
          {(['ALL', 'CORE_CS', 'HR_BEHAVIORAL', 'PROJECT_DEFENSE'] as FilterCat[]).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterCat === cat
                  ? 'bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {cat === 'ALL' ? 'All' : cat === 'CORE_CS' ? 'Core CS' : cat === 'HR_BEHAVIORAL' ? 'HR' : 'Viva'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB 1: TOPICS LIST ────────────────────────────────────────────── */}
      {activeTab === 'topics' && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {filteredTopics.length} Interview Topic(s)
            </span>
            <span className="text-xs text-neutral-400">
              Live Supabase Database
            </span>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="py-16 text-center text-sm text-neutral-400">
              No interview topics found. Click "+ Add Topic" to create one.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredTopics.map(topic => {
                const count = topicCountsMap[topic.id] || 0;
                return (
                  <div
                    key={topic.id}
                    className="p-4 hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 mt-0.5">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${catColor[topic.category] || 'bg-neutral-100 text-neutral-700'}`}>
                            {catLabel[topic.category] || topic.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {topic.id}
                          </span>
                          {topic.cluster && (
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {topic.cluster}
                            </span>
                          )}
                          {topic.is_hidden && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                              Hidden
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {topic.name || topic.title}
                        </h4>
                        {topic.description && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                            {topic.description}
                          </p>
                        )}
                        {Array.isArray(topic.formulas) && topic.formulas.length > 0 && (
                          <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">
                            📌 {topic.formulas.length} Key takeaway / formula(s) attached
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {count} question{count !== 1 ? 's' : ''}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleTopicHidden(topic)}
                          title={topic.is_hidden ? "Show Topic to Students" : "Hide Topic from Students"}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          {topic.is_hidden ? <EyeOff className="w-4 h-4 text-red-500" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEditTopicModal(topic)}
                          title="Edit Topic"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic)}
                          title="Delete Topic"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── ADD / EDIT QUESTION INLINE FORM ───────────────────────────────── */}
      {showAddForm && activeTab === 'questions' && (
        <div className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-900/10 p-5 space-y-4">
          <h3 className="font-semibold text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Interview Question
          </h3>
          <QuestionFormFields draft={addDraft} setDraft={setAddDraft} />
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleAddSingle}
              disabled={isSaving || !addDraft.title || !addDraft.answer}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" /> {isSaving ? 'Saving to Supabase…' : 'Save Question to Supabase'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ─── BULK IMPORT PANEL ────────────────────────────────────────────── */}
      {showBulkPanel && activeTab === 'questions' && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Bulk JSON Import — Interview Questions
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={copyTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTemplate ? 'Copied!' : 'Copy Template'}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
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
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Valid JSON — {parsedItems.length} question(s) ready to import to Supabase.
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

          <button
            onClick={handleBulkImport}
            disabled={!parsedItems.length || !!parseError || isImporting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4" />
            {isImporting ? 'Importing to Cloud…' : `Import ${parsedItems.length} Question(s) to Supabase`}
          </button>
        </div>
      )}

      {/* ─── TAB 2: QUESTIONS LIST ─────────────────────────────────────────── */}
      {activeTab === 'questions' && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900/60 shadow-xs">
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              {filteredQuestions.length} Question(s) {filterCat !== 'ALL' ? `in ${catLabel[filterCat]}` : ''}
            </span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredQuestions.length === 0 && (
              <div className="py-16 text-center text-sm text-neutral-400">No interview questions found.</div>
            )}
            {filteredQuestions.map(iq => {
              const isEditing = editingId === iq.id;
              return (
                <div key={iq.id} className={`p-4 space-y-3 ${isEditing ? 'bg-purple-50/50 dark:bg-purple-900/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'}`}>
                  {isEditing ? (
                    <>
                      <QuestionFormFields draft={editDraft} setDraft={setEditDraft} />
                      <div className="flex gap-2 pt-2">
                        <button onClick={saveEdit} disabled={isSaving} className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                          <Check className="w-3.5 h-3.5" /> {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button onClick={() => setEditingId(null)} className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${catColor[iq.category] || 'bg-neutral-100 text-neutral-600'}`}>
                            {catLabel[iq.category] || iq.category}
                          </span>
                          {iq.topicId && (
                            <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              {iq.topicId}
                            </span>
                          )}
                          {iq.subjectLabel && (
                            <span className="text-xs text-neutral-400 font-medium">{iq.subjectLabel}</span>
                          )}
                          {iq.frequency && (
                            <span className={`text-xs font-semibold ${freqColor[iq.frequency] || ''}`}>
                              {iq.frequency === 'VERY_HIGH' ? '🔥 Very High' : iq.frequency === 'HIGH' ? '⚡ High' : 'Med'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1">{iq.title}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">{iq.answer}</p>
                        {iq.companyTags && iq.companyTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {iq.companyTags.slice(0, 5).map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => startEdit(iq)} className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteQuestion(iq.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TOPIC CREATE / EDIT MODAL ─────────────────────────────────────── */}
      {topicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                {editingTopic ? 'Edit Interview Topic' : 'Add New Interview Topic'}
              </h3>
              <button
                onClick={() => setTopicModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Category *
                </label>
                <select
                  value={topicDraft.category || 'CORE_CS'}
                  onChange={e => setTopicDraft({ ...topicDraft, category: e.target.value as InterviewCategory })}
                  className="w-full text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  <option value="CORE_CS">Core CS Fundamentals</option>
                  <option value="HR_BEHAVIORAL">HR & Behavioral</option>
                  <option value="PROJECT_DEFENSE">Project Defense & Viva</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Topic Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={topicDraft.name || topicDraft.title || ''}
                  onChange={e => setTopicDraft({ ...topicDraft, name: e.target.value, title: e.target.value })}
                  placeholder="e.g. Database Management Systems (DBMS)"
                  className="w-full text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Unique Topic ID (Slug)
                  </label>
                  <input
                    type="text"
                    value={topicDraft.id || ''}
                    onChange={e => setTopicDraft({ ...topicDraft, id: e.target.value })}
                    disabled={!!editingTopic}
                    placeholder="e.g. topic-dbms"
                    className="w-full text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Cluster Header
                  </label>
                  <input
                    type="text"
                    value={topicDraft.cluster || ''}
                    onChange={e => setTopicDraft({ ...topicDraft, cluster: e.target.value })}
                    placeholder="e.g. Core CS Fundamentals"
                    className="w-full text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={topicDraft.description || ''}
                  onChange={e => setTopicDraft({ ...topicDraft, description: e.target.value })}
                  placeholder="What is covered in this topic..."
                  className="w-full text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Formulas / Key Takeaways Cheat Sheet (one per line)
                </label>
                <textarea
                  rows={3}
                  value={topicFormFormulasText}
                  onChange={e => setTopicFormFormulasText(e.target.value)}
                  placeholder={'ACID = Atomicity, Consistency, Isolation, Durability\nCAP Theorem: Consistency, Availability, Partition tolerance'}
                  className="w-full text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={topicDraft.sort_order ?? 0}
                    onChange={e => setTopicDraft({ ...topicDraft, sort_order: Number(e.target.value) })}
                    className="w-full text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Icon Name
                  </label>
                  <input
                    type="text"
                    value={topicDraft.icon_name || topicDraft.iconName || 'BookOpen'}
                    onChange={e => setTopicDraft({ ...topicDraft, icon_name: e.target.value, iconName: e.target.value })}
                    placeholder="BookOpen / Database / Users"
                    className="w-full text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="topic_hidden_chk_int"
                  checked={!!topicDraft.is_hidden}
                  onChange={e => setTopicDraft({ ...topicDraft, is_hidden: e.target.checked })}
                  className="rounded border-neutral-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="topic_hidden_chk_int" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Hide topic from students (Draft mode)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setTopicModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {isSaving ? 'Saving…' : 'Save Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
