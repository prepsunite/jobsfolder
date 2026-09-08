import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload, Plus, Trash2, Edit3, Check, X,
  Copy, ArrowLeft, FileCode, Layers, Brain, AlertCircle,
  CheckCircle2, RotateCcw, Download, Search, Eye, EyeOff,
  FolderPlus, Sparkles, Terminal, Code2, Cpu, Database, Binary,
  Hash, BookOpen, Settings
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import { technicalService } from '@/services/technical.service';
import type { ProgrammingProblem, TechnicalMcq, TechnicalTrack, ProgrammingTopic } from '@/types/technical';

// ─── JSON Templates ───────────────────────────────────────────────────────────
const P150_TEMPLATE = JSON.stringify([{
  title: 'Count Digits in an Integer',
  topicId: 'syntax-operators',
  level: 'BASIC',
  category: 'SYNTAX_BASICS',
  categoryLabel: 'Basic Programming',
  description: 'Given an integer N, count and return the total number of digits in N.',
  constraints: ['-10^18 <= N <= 10^18'],
  testCases: [{ input: 'N = 1567', output: '4', explanation: '1567 has 4 digits.' }],
  solutions: { java: 'public class Solution { ... }', python: 'def count_digits(n): ...', cpp: '// C++ solution', c: '// C solution' },
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

type TabType = 'topics' | 'programming-150' | 'campus-dsa' | 'technical-mcqs';

export default function AdminTechnicalPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!isSuperAdminEmail(user?.email)) return <NotFoundPage />;

  const [activeTab, setActiveTab] = useState<TabType>('topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [topicTrackFilter, setTopicTrackFilter] = useState<'ALL' | TechnicalTrack>('ALL');

  // Bulk import state
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [importReport, setImportReport] = useState<{ count: number; message: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Problem / MCQ inline add/edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, any>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addDraft, setAddDraft] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Topic Modal state
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Partial<ProgrammingTopic> | null>(null);
  const [topicDraft, setTopicDraft] = useState<Partial<ProgrammingTopic>>({
    track: 'PROGRAMMING_150',
    category: 'SYNTAX_BASICS',
    cluster: 'Stage 1: Basics & Logic',
    icon_name: 'Code2',
    is_hidden: false,
    tips: [],
  });
  const [topicFormTipsText, setTopicFormTipsText] = useState('');

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data: allTopics = [], refetch: refetchTopics } = useQuery({
    queryKey: ['admin-technical-topics'],
    queryFn: () => technicalService.getAllTopics(),
    staleTime: 0,
  });

  const { data: p150 = [], refetch: refetchP150 } = useQuery({
    queryKey: ['admin-p150'],
    queryFn: () => technicalService.getProgramming150Problems(),
    staleTime: 0,
  });

  const { data: campusDsa = [], refetch: refetchCampusDsa } = useQuery({
    queryKey: ['admin-campus-dsa'],
    queryFn: () => technicalService.getCampusDsaProblems(),
    staleTime: 0,
  });

  const { data: mcqs = [], refetch: refetchMcqs } = useQuery({
    queryKey: ['admin-mcqs'],
    queryFn: () => technicalService.getTechnicalMcqs(),
    staleTime: 0,
  });

  const refetchAll = useCallback(() => {
    refetchTopics();
    refetchP150();
    refetchCampusDsa();
    refetchMcqs();
    queryClient.invalidateQueries({ queryKey: ['technical-topics'] });
    queryClient.invalidateQueries({ queryKey: ['programming-150-problems'] });
    queryClient.invalidateQueries({ queryKey: ['campus-dsa-problems'] });
    queryClient.invalidateQueries({ queryKey: ['technical-mcqs'] });
  }, [refetchTopics, refetchP150, refetchCampusDsa, refetchMcqs, queryClient]);

  // Topic item counts map
  const topicCountsMap = useMemo(() => {
    const map: Record<string, number> = {};
    p150.forEach(p => {
      if (p.topicId) map[p.topicId] = (map[p.topicId] || 0) + 1;
    });
    campusDsa.forEach(p => {
      if (p.topicId) map[p.topicId] = (map[p.topicId] || 0) + 1;
    });
    mcqs.forEach(m => {
      if (m.topicId) map[m.topicId] = (map[m.topicId] || 0) + 1;
    });
    return map;
  }, [p150, campusDsa, mcqs]);

  // ─── TOPIC CRUD Handlers ──────────────────────────────────────────────────
  const openAddTopicModal = () => {
    setEditingTopic(null);
    setTopicDraft({
      id: '',
      name: '',
      title: '',
      track: (activeTab === 'campus-dsa' ? 'CAMPUS_DSA' : activeTab === 'technical-mcqs' ? 'TECHNICAL_MCQS' : 'PROGRAMMING_150'),
      category: 'SYNTAX_BASICS',
      cluster: 'Stage 1: Basics & Logic',
      description: '',
      icon_name: 'Code2',
      sort_order: allTopics.length + 1,
      is_hidden: false,
      tips: [],
    });
    setTopicFormTipsText('');
    setTopicModalOpen(true);
  };

  const openEditTopicModal = (topic: ProgrammingTopic) => {
    setEditingTopic(topic);
    setTopicDraft({
      ...topic,
      name: topic.name || topic.title,
      icon_name: topic.icon_name || topic.iconName || 'Code2',
    });
    setTopicFormTipsText(Array.isArray(topic.tips) ? topic.tips.join('\n') : '');
    setTopicModalOpen(true);
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicDraft.name?.trim()) {
      alert('Please provide a Topic Name / Title.');
      return;
    }

    const slug = topicDraft.id?.trim() || topicDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tipsArray = topicFormTipsText.split('\n').map(s => s.trim()).filter(Boolean);

    setIsSaving(true);
    try {
      const res = await technicalService.saveTopic({
        ...topicDraft,
        id: slug,
        name: topicDraft.name.trim(),
        title: topicDraft.name.trim(),
        tips: tipsArray,
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

  const handleToggleTopicHidden = async (topic: ProgrammingTopic) => {
    const nextHidden = !topic.is_hidden;
    await technicalService.toggleTopicVisibility(topic.id, nextHidden);
    refetchAll();
  };

  const handleDeleteTopic = async (topic: ProgrammingTopic) => {
    if (!confirm(`Delete topic "${topic.name || topic.title}"? Any linked questions will be retained.`)) return;
    await technicalService.deleteTopic(topic.id);
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
      } else if (activeTab === 'campus-dsa') {
        result = await technicalService.importProgrammingProblems(parsedItems, 'CAMPUS_DSA');
      } else {
        result = await technicalService.importProgrammingProblems(parsedItems, 'PROGRAMMING_150');
      }
      setImportReport({ count: result.importedCount, message: `Successfully imported ${result.importedCount} item(s) to Supabase cloud.` });
      setJsonText('');
      setParsedItems([]);
      refetchAll();
    } catch (e: any) {
      setImportReport({ count: 0, message: `Error: ${e.message}` });
    } finally {
      setIsImporting(false);
    }
  };

  // ─── Delete Problem / MCQ ─────────────────────────────────────────────────
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this item permanently?')) return;
    if (activeTab === 'technical-mcqs') {
      await technicalService.deleteTechnicalMcq(id);
    } else {
      await technicalService.deleteProgrammingProblem(id);
    }
    refetchAll();
  };

  // ─── Edit Problem / MCQ ───────────────────────────────────────────────────
  const startEdit = (item: ProgrammingProblem | TechnicalMcq) => {
    setEditingId(item.id);
    setEditDraft({ ...item });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setIsSaving(true);
    try {
      if (activeTab === 'technical-mcqs') {
        await technicalService.saveTechnicalMcq({ ...editDraft, id: editingId });
      } else {
        await technicalService.saveProgrammingProblem({ ...editDraft, id: editingId });
      }
      setEditingId(null);
      setEditDraft({});
      refetchAll();
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Add Single Problem / MCQ ─────────────────────────────────────────────
  const handleAddSingle = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'technical-mcqs') {
        await technicalService.saveTechnicalMcq(addDraft);
      } else {
        const track = activeTab === 'campus-dsa' ? 'CAMPUS_DSA' : 'PROGRAMMING_150';
        await technicalService.saveProgrammingProblem({ ...addDraft, track });
      }
      setShowAddForm(false);
      setAddDraft({});
      refetchAll();
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Filtered data ────────────────────────────────────────────────────────
  const q = searchQuery.toLowerCase().trim();

  const filteredTopics = allTopics.filter(t => {
    const matchesTrack = topicTrackFilter === 'ALL' || t.track === topicTrackFilter;
    const matchesQuery = !q ||
      (t.name || t.title || '').toLowerCase().includes(q) ||
      (t.cluster || '').toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q);
    return matchesTrack && matchesQuery;
  });

  const filteredMcqs = mcqs.filter(m =>
    m.question.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q) || (m.topicId || '').toLowerCase().includes(q)
  );

  const filteredP150 = p150.filter(p =>
    p.title.toLowerCase().includes(q) || (p.topicId || '').toLowerCase().includes(q) || (p.categoryLabel || '').toLowerCase().includes(q)
  );

  const filteredCampusDsa = campusDsa.filter(p =>
    p.title.toLowerCase().includes(q) || (p.topicId || '').toLowerCase().includes(q) || (p.categoryLabel || '').toLowerCase().includes(q)
  );

  const currentTemplate = activeTab === 'technical-mcqs' ? MCQ_TEMPLATE : P150_TEMPLATE;

  // Available topics for active track
  const availableTopicsForTrack = useMemo(() => {
    if (activeTab === 'campus-dsa') return allTopics.filter(t => t.track === 'CAMPUS_DSA');
    if (activeTab === 'technical-mcqs') return allTopics.filter(t => t.track === 'TECHNICAL_MCQS');
    return allTopics.filter(t => t.track === 'PROGRAMMING_150');
  }, [allTopics, activeTab]);

  // ─── MCQ Add/Edit Form Fields ─────────────────────────────────────────────
  const McqFormFields = ({ draft, setDraft }: { draft: Record<string, any>; setDraft: (d: Record<string, any>) => void }) => (
    <div className="grid grid-cols-1 gap-3">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Question Statement *</label>
        <textarea rows={3} value={draft.question || ''} onChange={e => setDraft({ ...draft, question: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="e.g. What will be the output of the following C code snippet?" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Topic / Subject</label>
          <select value={draft.topicId || ''} onChange={e => {
            const selected = allTopics.find(t => t.id === e.target.value);
            setDraft({
              ...draft,
              topicId: e.target.value,
              topic: selected?.name || selected?.title || draft.topic || 'General',
              topicCategory: selected?.category || draft.topicCategory || 'C_PROGRAMMING'
            });
          }}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="">— Select Supabase Topic —</option>
            {allTopics.filter(t => t.track === 'TECHNICAL_MCQS').map(t => (
              <option key={t.id} value={t.id}>{t.name || t.title} ({t.id})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Category Code</label>
          <select value={draft.topicCategory || 'C_PROGRAMMING'} onChange={e => setDraft({ ...draft, topicCategory: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            {['C_PROGRAMMING','CPP_PROGRAMMING','JAVA_PROGRAMMING','PYTHON_PROGRAMMING','DATABASE','OPERATING_SYSTEMS','COMPUTER_NETWORKS','DATA_STRUCTURES','PSEUDO_CODE'].map(c => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Options (4 options, comma-separated)</label>
        <input type="text" value={Array.isArray(draft.options) ? draft.options.join(', ') : (draft.options || '')}
          onChange={e => setDraft({ ...draft, options: e.target.value.split(',').map(s => s.trim()) })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="Option A, Option B, Option C, Option D" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Correct Option (0-3)</label>
          <select value={draft.correctOptionIndex ?? 0} onChange={e => setDraft({ ...draft, correctOptionIndex: Number(e.target.value) })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value={0}>Option 1 (Index 0)</option>
            <option value={1}>Option 2 (Index 1)</option>
            <option value={2}>Option 3 (Index 2)</option>
            <option value={3}>Option 4 (Index 3)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Difficulty</label>
          <select value={draft.difficulty || 'MEDIUM'} onChange={e => setDraft({ ...draft, difficulty: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="BASIC">Basic</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Code Snippet (optional)</label>
        <textarea rows={3} value={draft.codeSnippet || ''} onChange={e => setDraft({ ...draft, codeSnippet: e.target.value })}
          className="w-full text-sm font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="int x = 10; printf(&quot;%d&quot;, x);" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Explanation *</label>
        <textarea rows={2} value={draft.explanation || ''} onChange={e => setDraft({ ...draft, explanation: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="Explain why the correct option is right..." />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Company Tags (comma-separated)</label>
        <input type="text" value={Array.isArray(draft.companyTags) ? draft.companyTags.join(', ') : (draft.companyTags || '')}
          onChange={e => setDraft({ ...draft, companyTags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="TCS, Wipro, Infosys, Cognizant" />
      </div>
    </div>
  );

  // ─── Problem Add/Edit Form Fields ──────────────────────────────────────────
  const ProblemFormFields = ({ draft, setDraft }: { draft: Record<string, any>; setDraft: (d: Record<string, any>) => void }) => (
    <div className="grid grid-cols-1 gap-3">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Title *</label>
        <input type="text" value={draft.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="e.g. Reverse an Array in Place" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Level</label>
          <select value={draft.level || 'MEDIUM'} onChange={e => setDraft({ ...draft, level: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="BASIC">Basic / Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Topic</label>
          <select value={draft.topicId || ''} onChange={e => setDraft({ ...draft, topicId: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40">
            <option value="">— Select Supabase Topic —</option>
            {availableTopicsForTrack.map(t => (
              <option key={t.id} value={t.id}>{t.name || t.title} ({t.id})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Category Code</label>
          <input type="text" value={draft.category || 'SYNTAX_BASICS'} onChange={e => setDraft({ ...draft, category: e.target.value })}
            className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="SYNTAX_BASICS / ARRAYS" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Problem Description *</label>
        <textarea rows={4} value={draft.description || ''} onChange={e => setDraft({ ...draft, description: e.target.value })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="Problem statement, inputs, and expected output details..." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Sample Input</label>
          <input type="text" value={draft.sampleInput || ''} onChange={e => setDraft({ ...draft, sampleInput: e.target.value })}
            className="w-full text-sm font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="[1, 2, 3, 4, 5]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Sample Output</label>
          <input type="text" value={draft.sampleOutput || ''} onChange={e => setDraft({ ...draft, sampleOutput: e.target.value })}
            className="w-full text-sm font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="[5, 4, 3, 2, 1]" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Constraints (one per line)</label>
        <textarea rows={2} value={Array.isArray(draft.constraints) ? draft.constraints.join('\n') : (draft.constraints || '')}
          onChange={e => setDraft({ ...draft, constraints: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
          className="w-full text-sm font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder={'1 <= N <= 10^5\n-10^9 <= Arr[i] <= 10^9'} />
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
        <input type="text" value={Array.isArray(draft.companyTags) ? draft.companyTags.join(', ') : (draft.companyTags || '')}
          onChange={e => setDraft({ ...draft, companyTags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          className="w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="TCS Digital, Amazon, Infosys SP, Zoho" />
      </div>
    </div>
  );

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'topics', label: 'Topics & Tracks', icon: <Layers className="w-4 h-4" />, count: filteredTopics.length },
    { id: 'programming-150', label: 'Programming 150', icon: <FileCode className="w-4 h-4" />, count: filteredP150.length },
    { id: 'campus-dsa', label: 'Campus DSA Patterns', icon: <Binary className="w-4 h-4" />, count: filteredCampusDsa.length },
    { id: 'technical-mcqs', label: 'Technical MCQs', icon: <Brain className="w-4 h-4" />, count: filteredMcqs.length },
  ];

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
                Technical Hub Admin
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Supabase Synced
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage Technical Topics, Programming 150 stages, Campus DSA patterns, and MCQs in Supabase
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
                onClick={() => { setShowAddForm(v => !v); setShowBulkPanel(false); setAddDraft({}); }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Item
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

      {/* Track Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto pb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery('');
              setShowBulkPanel(false);
              setShowAddForm(false);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === tab.id
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'topics'
                ? "Search topics by title, cluster, or slug…"
                : activeTab === 'technical-mcqs'
                ? "Search MCQs by question, topic, or tag…"
                : "Search problems by title, topic, or tags…"
            }
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </div>

        {activeTab === 'topics' && (
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/70 p-1 rounded-xl">
            {(['ALL', 'PROGRAMMING_150', 'CAMPUS_DSA', 'TECHNICAL_MCQS'] as const).map(tr => (
              <button
                key={tr}
                onClick={() => setTopicTrackFilter(tr)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  topicTrackFilter === tr
                    ? 'bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                {tr === 'ALL' ? 'All Tracks' : tr === 'PROGRAMMING_150' ? 'P150' : tr === 'CAMPUS_DSA' ? 'DSA' : 'MCQs'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── TAB 1: TOPICS MANAGEMENT ────────────────────────────────────────── */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                {filteredTopics.length} Technical Topic(s)
              </span>
              <span className="text-xs text-neutral-400">
                Live Supabase Database
              </span>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="py-16 text-center text-sm text-neutral-400">
                No topics matching filter. Click "+ Add Topic" to create one.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {filteredTopics.map(topic => {
                  const count = topicCountsMap[topic.id] || 0;
                  const trackBadgeColor =
                    topic.track === 'CAMPUS_DSA'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : topic.track === 'TECHNICAL_MCQS'
                      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';

                  return (
                    <div
                      key={topic.id}
                      className="p-4 hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 mt-0.5">
                          <Code2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${trackBadgeColor}`}>
                              {topic.track === 'CAMPUS_DSA' ? 'Campus DSA' : topic.track === 'TECHNICAL_MCQS' ? 'MCQ' : 'P150'}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              {topic.id}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {topic.cluster}
                            </span>
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
                          {Array.isArray(topic.tips) && topic.tips.length > 0 && (
                            <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">
                              💡 {topic.tips.length} Cheat Sheet Formula(s) attached
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {count} item{count !== 1 ? 's' : ''}
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
        </div>
      )}

      {/* ─── ADD / EDIT PROBLEM OR MCQ FORMS ───────────────────────────────── */}
      {showAddForm && activeTab !== 'topics' && (
        <div className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-900/10 p-5 space-y-4">
          <h3 className="font-semibold text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Single {activeTab === 'technical-mcqs' ? 'MCQ' : 'Coding Problem'}
          </h3>
          {activeTab === 'technical-mcqs'
            ? <McqFormFields draft={addDraft} setDraft={setAddDraft} />
            : <ProblemFormFields draft={addDraft} setDraft={setAddDraft} />
          }
          <div className="flex items-center gap-2 pt-2">
            <button onClick={handleAddSingle} disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 transition-colors shadow-xs">
              <Check className="w-4 h-4" /> {isSaving ? 'Saving to Supabase…' : 'Save to Supabase'}
            </button>
            <button onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ─── BULK IMPORT PANEL ────────────────────────────────────────────── */}
      {showBulkPanel && activeTab !== 'topics' && (
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
              <span>Valid JSON — {parsedItems.length} item(s) ready to import to Supabase.</span>
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
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs">
            <Upload className="w-4 h-4" />
            {isImporting ? 'Importing to Cloud…' : `Import ${parsedItems.length} Item(s) to Supabase`}
          </button>
        </div>
      )}

      {/* ─── TAB 2 & 3: PROBLEMS LIST ──────────────────────────────────────── */}
      {(activeTab === 'programming-150' || activeTab === 'campus-dsa') && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900/60 shadow-xs">
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              {activeTab === 'programming-150' ? `${filteredP150.length} Problem(s)` : `${filteredCampusDsa.length} Pattern Problem(s)`}
            </span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {(activeTab === 'programming-150' ? filteredP150 : filteredCampusDsa).length === 0 && (
              <div className="py-16 text-center text-sm text-neutral-400">No problems found.</div>
            )}
            {(activeTab === 'programming-150' ? filteredP150 : filteredCampusDsa).map(prob => {
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
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${levelColor}`}>
                            {prob.level}
                          </span>
                          {prob.topicId && (
                            <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              {prob.topicId}
                            </span>
                          )}
                          <span className="text-xs text-neutral-400">
                            {prob.timeComplexity} | {prob.spaceComplexity}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{prob.title}</p>
                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{prob.description}</p>
                        {prob.companyTags && prob.companyTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {prob.companyTags.slice(0, 5).map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => startEdit(prob)} className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteItem(prob.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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

      {/* ─── TAB 4: MCQS LIST ──────────────────────────────────────────────── */}
      {activeTab === 'technical-mcqs' && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900/60 shadow-xs">
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              {filteredMcqs.length} MCQ(s)
            </span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredMcqs.length === 0 && (
              <div className="py-16 text-center text-sm text-neutral-400">No MCQs found.</div>
            )}
            {filteredMcqs.map(mcq => {
              const isEditing = editingId === mcq.id;
              return (
                <div key={mcq.id} className={`p-4 space-y-3 ${isEditing ? 'bg-purple-50/50 dark:bg-purple-900/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'}`}>
                  {isEditing ? (
                    <>
                      <McqFormFields draft={editDraft} setDraft={setEditDraft} />
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
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {mcq.topic}
                          </span>
                          {mcq.topicId && (
                            <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              {mcq.topicId}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2">{mcq.question}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          Correct: Option {mcq.correctOptionIndex + 1} — {mcq.options[mcq.correctOptionIndex]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => startEdit(mcq)} className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteItem(mcq.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
                {editingTopic ? 'Edit Technical Topic' : 'Add New Technical Topic'}
              </h3>
              <button
                onClick={() => setTopicModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Track *
                  </label>
                  <select
                    value={topicDraft.track || 'PROGRAMMING_150'}
                    onChange={e => setTopicDraft({ ...topicDraft, track: e.target.value as TechnicalTrack })}
                    className="w-full text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  >
                    <option value="PROGRAMMING_150">Programming 150</option>
                    <option value="CAMPUS_DSA">Campus DSA 15 Patterns</option>
                    <option value="TECHNICAL_MCQS">Technical MCQs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Category Code
                  </label>
                  <input
                    type="text"
                    value={topicDraft.category || ''}
                    onChange={e => setTopicDraft({ ...topicDraft, category: e.target.value })}
                    placeholder="e.g. SYNTAX_BASICS"
                    className="w-full text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
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
                  placeholder="e.g. Syntax, Operators & Typecasting"
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
                    placeholder="e.g. syntax-operators"
                    className="w-full text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Cluster / Stage Header
                  </label>
                  <input
                    type="text"
                    value={topicDraft.cluster || ''}
                    onChange={e => setTopicDraft({ ...topicDraft, cluster: e.target.value })}
                    placeholder="e.g. Stage 1: Basics & Logic"
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
                  placeholder="What students learn in this topic..."
                  className="w-full text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Cheat Sheet Formulas / Tips (one per line)
                </label>
                <textarea
                  rows={3}
                  value={topicFormTipsText}
                  onChange={e => setTopicFormTipsText(e.target.value)}
                  placeholder={'int to char: (char)(num + \'0\')\nCheck power of 2: (n & (n - 1)) == 0'}
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
                    value={topicDraft.icon_name || topicDraft.iconName || 'Code2'}
                    onChange={e => setTopicDraft({ ...topicDraft, icon_name: e.target.value, iconName: e.target.value })}
                    placeholder="Code2 / Binary / Database"
                    className="w-full text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="topic_hidden_chk"
                  checked={!!topicDraft.is_hidden}
                  onChange={e => setTopicDraft({ ...topicDraft, is_hidden: e.target.checked })}
                  className="rounded border-neutral-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="topic_hidden_chk" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
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
