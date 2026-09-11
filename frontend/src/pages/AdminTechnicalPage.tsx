import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload, Plus, Trash2, Edit3, Check, X, Copy,
  ArrowLeft, AlertCircle, CheckCircle2,
  Download, Search, Eye, EyeOff,
  Code2, Layers, Brain,
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import { technicalService } from '@/services/technical.service';
import type { ProgrammingProblem, TechnicalMcq, ProgrammingTopic, TechnicalTrack } from '@/types/technical';

const PROBLEM_TEMPLATE = JSON.stringify([{
  title: 'Sum of Digits',
  track: 'PROGRAMMING_150',
  topicId: 'digit-manipulation',
  level: 'BASIC',
  category: 'NUMBER_LOGIC',
  categoryLabel: 'Digit Extraction & Manipulation',
  description: 'Given an integer N, compute the sum of all its digits.',
  constraints: ['1 ≤ N ≤ 10^9'],
  sampleInput: '123',
  sampleOutput: '6',
  explanation: 'Sum = 1 + 2 + 3 = 6',
  timeComplexity: 'O(log N)',
  spaceComplexity: 'O(1)',
  hints: ['Use N % 10 to extract last digit, then N / 10.'],
  companyTags: ['TCS', 'Infosys'],
  solutions: {
    java: 'int sum=0; while(n>0){sum+=n%10;n/=10;} return sum;',
    python: 'sum(int(c) for c in str(n))',
    cpp: 'int sum=0; while(n>0){sum+=n%10;n/=10;} return sum;',
    c: 'int sum=0; while(n>0){sum+=n%10;n/=10;} return sum;',
  },
}], null, 2);

const MCQ_TEMPLATE = JSON.stringify([{
  topicId: 'mcq-c-programming',
  topicCategory: 'C_PROGRAMMING',
  question: 'What is the output of: printf("%d", sizeof(int));',
  codeSnippet: '#include <stdio.h>\nint main() { printf("%d", sizeof(int)); return 0; }',
  options: ['2', '4', '8', 'Compiler dependent'],
  correctOptionIndex: 3,
  explanation: 'sizeof(int) is compiler-dependent — 2 on 16-bit, 4 on 32/64-bit platforms.',
  difficulty: 'MEDIUM',
  companyTags: ['TCS NQT', 'Infosys'],
}], null, 2);

type AdminTab = 'topics' | 'problems' | 'mcqs';

export default function AdminTechnicalPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!isSuperAdminEmail(user?.email)) return <NotFoundPage />;

  const [activeTab, setActiveTab] = useState<AdminTab>('topics');
  const [topicTrack, setTopicTrack] = useState<TechnicalTrack>('PROGRAMMING_150');
  const [problemTrack, setProblemTrack] = useState<'PROGRAMMING_150' | 'CAMPUS_DSA'>('PROGRAMMING_150');
  const [searchQuery, setSearchQuery] = useState('');

  // Topic state
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [topicDraft, setTopicDraft] = useState<Record<string, any>>({});
  const [showAddTopicForm, setShowAddTopicForm] = useState(false);
  const [addTopicDraft, setAddTopicDraft] = useState<Record<string, any>>({ track: 'PROGRAMMING_150', category: 'SYNTAX_BASICS', is_hidden: false });
  const [topicSaving, setTopicSaving] = useState(false);

  // Problem state
  const [showBulkProblem, setShowBulkProblem] = useState(false);
  const [problemJson, setProblemJson] = useState('');
  const [problemParseError, setProblemParseError] = useState<string | null>(null);
  const [parsedProblems, setParsedProblems] = useState<any[]>([]);
  const [problemImportReport, setProblemImportReport] = useState<{ count: number; message: string } | null>(null);
  const [isImportingProblems, setIsImportingProblems] = useState(false);
  const [showAddProblemForm, setShowAddProblemForm] = useState(false);
  const [problemDraft, setProblemDraft] = useState<Record<string, any>>({ track: 'PROGRAMMING_150', level: 'MEDIUM', category: 'SYNTAX_BASICS' });
  const [problemSaving, setProblemSaving] = useState(false);
  const [problemCopiedTemplate, setProblemCopiedTemplate] = useState(false);
  const problemFileRef = useRef<HTMLInputElement>(null);

  // MCQ state
  const [showBulkMcq, setShowBulkMcq] = useState(false);
  const [mcqJson, setMcqJson] = useState('');
  const [mcqParseError, setMcqParseError] = useState<string | null>(null);
  const [parsedMcqs, setParsedMcqs] = useState<any[]>([]);
  const [mcqImportReport, setMcqImportReport] = useState<{ count: number; message: string } | null>(null);
  const [isImportingMcqs, setIsImportingMcqs] = useState(false);
  const [showAddMcqForm, setShowAddMcqForm] = useState(false);
  const [mcqDraft, setMcqDraft] = useState<Record<string, any>>({ topicCategory: 'C_PROGRAMMING', difficulty: 'MEDIUM', correctOptionIndex: 0 });
  const [mcqSaving, setMcqSaving] = useState(false);
  const [mcqCopiedTemplate, setMcqCopiedTemplate] = useState(false);
  const mcqFileRef = useRef<HTMLInputElement>(null);

  const { data: topics = [], refetch: refetchTopics } = useQuery<ProgrammingTopic[]>({
    queryKey: ['admin-technical-topics', topicTrack],
    queryFn: () => technicalService.getTopicsForTrack(topicTrack),
    staleTime: 0,
  });

  const { data: p150 = [], refetch: refetchP150 } = useQuery<ProgrammingProblem[]>({
    queryKey: ['admin-p150-problems'],
    queryFn: () => technicalService.getProgramming150Problems(),
    staleTime: 0,
  });

  const { data: dsa = [], refetch: refetchDsa } = useQuery<ProgrammingProblem[]>({
    queryKey: ['admin-dsa-problems'],
    queryFn: () => technicalService.getCampusDsaProblems(),
    staleTime: 0,
  });

  const { data: mcqs = [], refetch: refetchMcqs } = useQuery<TechnicalMcq[]>({
    queryKey: ['admin-technical-mcqs'],
    queryFn: () => technicalService.getTechnicalMcqs(),
    staleTime: 0,
  });

  const refetchAll = useCallback(() => {
    refetchTopics();
    refetchP150();
    refetchDsa();
    refetchMcqs();
    queryClient.invalidateQueries({ queryKey: ['technical-topics'] });
    queryClient.invalidateQueries({ queryKey: ['programming-150-problems'] });
    queryClient.invalidateQueries({ queryKey: ['campus-dsa-problems'] });
    queryClient.invalidateQueries({ queryKey: ['technical-mcqs'] });
  }, [refetchTopics, refetchP150, refetchDsa, refetchMcqs, queryClient]);

  const parseJson = (text: string, setSetter: (a: any[]) => void, errSetter: (e: string | null) => void) => {
    if (!text.trim()) { setSetter([]); errSetter(null); return; }
    try {
      const p = JSON.parse(text);
      setSetter(Array.isArray(p) ? p : [p]);
      errSetter(null);
    } catch (e: any) {
      setSetter([]);
      errSetter(e.message);
    }
  };

  // ─── Topic CRUD ───────────────────────────────────────────────────────────
  const saveTopicEdit = async () => {
    setTopicSaving(true);
    const res = await technicalService.saveTopic(topicDraft as any);
    if (res.success) { setEditingTopicId(null); refetchTopics(); }
    else alert('Error: ' + res.error);
    setTopicSaving(false);
  };

  const saveAddTopic = async () => {
    setTopicSaving(true);
    const res = await technicalService.saveTopic(addTopicDraft as any);
    if (res.success) {
      setShowAddTopicForm(false);
      setAddTopicDraft({ track: 'PROGRAMMING_150', category: 'SYNTAX_BASICS', is_hidden: false });
      refetchTopics();
    } else alert('Error: ' + res.error);
    setTopicSaving(false);
  };

  const handleDeleteTopic = async (id: string, name: string) => {
    if (!confirm(`Delete topic "${name}"?`)) return;
    await technicalService.deleteTopic(id);
    refetchTopics();
  };

  const handleToggleTopicHide = async (id: string, is_hidden: boolean) => {
    await technicalService.toggleTopicVisibility(id, !is_hidden);
    refetchTopics();
  };

  // ─── Problem CRUD ─────────────────────────────────────────────────────────
  const handleImportProblems = async () => {
    if (!parsedProblems.length || problemParseError) return;
    setIsImportingProblems(true);
    const res = await technicalService.importProgrammingProblems(parsedProblems, problemTrack);
    setProblemImportReport({ count: res.importedCount, message: `Imported ${res.importedCount} problem(s) to Supabase.` });
    setProblemJson('');
    setParsedProblems([]);
    refetchAll();
    setIsImportingProblems(false);
  };

  const handleSaveAddProblem = async () => {
    setProblemSaving(true);
    const res = await technicalService.saveProgrammingProblem({ ...problemDraft, track: problemTrack } as any);
    if (res.success) {
      setShowAddProblemForm(false);
      setProblemDraft({ track: 'PROGRAMMING_150', level: 'MEDIUM', category: 'SYNTAX_BASICS' });
      refetchAll();
    } else alert('Error: ' + res.error);
    setProblemSaving(false);
  };

  const handleDeleteProblem = async (id: string, title: string) => {
    if (!confirm(`Delete problem "${title}"?`)) return;
    await technicalService.deleteProgrammingProblem(id);
    refetchAll();
  };

  // ─── MCQ CRUD ─────────────────────────────────────────────────────────────
  const handleImportMcqs = async () => {
    if (!parsedMcqs.length || mcqParseError) return;
    setIsImportingMcqs(true);
    const res = await technicalService.importTechnicalMcqs(parsedMcqs);
    setMcqImportReport({ count: res.importedCount, message: `Imported ${res.importedCount} MCQ(s) to Supabase.` });
    setMcqJson('');
    setParsedMcqs([]);
    refetchAll();
    setIsImportingMcqs(false);
  };

  const handleSaveAddMcq = async () => {
    setMcqSaving(true);
    const optionsArr = typeof mcqDraft.options === 'string'
      ? mcqDraft.options.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : (mcqDraft.options || []);
    const res = await technicalService.saveTechnicalMcq({ ...mcqDraft, options: optionsArr } as any);
    if (res.success) {
      setShowAddMcqForm(false);
      setMcqDraft({ topicCategory: 'C_PROGRAMMING', difficulty: 'MEDIUM', correctOptionIndex: 0 });
      refetchAll();
    } else alert('Error: ' + res.error);
    setMcqSaving(false);
  };

  const handleDeleteMcq = async (id: string) => {
    if (!confirm('Delete this MCQ?')) return;
    await technicalService.deleteTechnicalMcq(id);
    refetchAll();
  };

  const q = searchQuery.toLowerCase();
  const activeProblems = problemTrack === 'PROGRAMMING_150' ? p150 : dsa;
  const filteredProblems = activeProblems.filter(p => p.title.toLowerCase().includes(q));
  const filteredMcqs = mcqs.filter(m => m.question.toLowerCase().includes(q) || m.topicCategory.toLowerCase().includes(q));

  const inputCls = 'w-full text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40';
  const labelCls = 'block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1';
  const tabBtn = (tab: AdminTab, label: string, Icon: React.ComponentType<any>) => (
    <button onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white border-indigo-600' : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
      <Icon className="w-4 h-4" />{label}
    </button>
  );

  const TopicForm = ({ draft, setDraft }: { draft: Record<string, any>; setDraft: (d: Record<string, any>) => void }) => (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelCls}>Topic ID (slug) *</label>
        <input type="text" value={draft.id || ''} onChange={e => setDraft({ ...draft, id: e.target.value })} className={inputCls} placeholder="syntax-operators" />
      </div>
      <div>
        <label className={labelCls}>Track *</label>
        <select value={draft.track || 'PROGRAMMING_150'} onChange={e => setDraft({ ...draft, track: e.target.value })} className={inputCls}>
          <option value="PROGRAMMING_150">Programming 150</option>
          <option value="CAMPUS_DSA">Campus DSA</option>
          <option value="TECHNICAL_MCQS">Technical MCQs</option>
        </select>
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Name *</label>
        <input type="text" value={draft.name || draft.title || ''} onChange={e => setDraft({ ...draft, name: e.target.value, title: e.target.value })} className={inputCls} placeholder="Syntax, Operators & Typecasting" />
      </div>
      <div>
        <label className={labelCls}>Cluster / Stage</label>
        <input type="text" value={draft.cluster || ''} onChange={e => setDraft({ ...draft, cluster: e.target.value })} className={inputCls} placeholder="Stage 1: Language & Control Flow" />
      </div>
      <div>
        <label className={labelCls}>Category</label>
        <input type="text" value={draft.category || ''} onChange={e => setDraft({ ...draft, category: e.target.value })} className={inputCls} placeholder="SYNTAX_BASICS" />
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Description</label>
        <textarea rows={2} value={draft.description || ''} onChange={e => setDraft({ ...draft, description: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Icon Name (Lucide)</label>
        <input type="text" value={draft.icon_name || draft.iconName || ''} onChange={e => setDraft({ ...draft, icon_name: e.target.value })} className={inputCls} placeholder="Code2" />
      </div>
      <div>
        <label className={labelCls}>Sort Order</label>
        <input type="number" value={draft.sort_order ?? draft.order ?? 0} onChange={e => setDraft({ ...draft, sort_order: Number(e.target.value) })} className={inputCls} />
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <input type="checkbox" id="topicHide" checked={!!draft.is_hidden} onChange={e => setDraft({ ...draft, is_hidden: e.target.checked })} className="rounded" />
        <label htmlFor="topicHide" className="text-sm font-medium dark:text-white cursor-pointer">Hide from users</label>
      </div>
    </div>
  );

  const ProblemForm = ({ draft, setDraft }: { draft: Record<string, any>; setDraft: (d: Record<string, any>) => void }) => (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className={labelCls}>Title *</label>
        <input type="text" value={draft.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })} className={inputCls} placeholder="Sum of Digits" />
      </div>
      <div>
        <label className={labelCls}>Topic ID</label>
        <input type="text" value={draft.topicId || ''} onChange={e => setDraft({ ...draft, topicId: e.target.value })} className={inputCls} placeholder="digit-manipulation" />
      </div>
      <div>
        <label className={labelCls}>Level</label>
        <select value={draft.level || 'MEDIUM'} onChange={e => setDraft({ ...draft, level: e.target.value })} className={inputCls}>
          <option value="BASIC">Basic</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Category</label>
        <input type="text" value={draft.category || ''} onChange={e => setDraft({ ...draft, category: e.target.value })} className={inputCls} placeholder="NUMBER_LOGIC" />
      </div>
      <div>
        <label className={labelCls}>Category Label</label>
        <input type="text" value={draft.categoryLabel || ''} onChange={e => setDraft({ ...draft, categoryLabel: e.target.value })} className={inputCls} placeholder="Digit Manipulation" />
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Description *</label>
        <textarea rows={4} value={draft.description || ''} onChange={e => setDraft({ ...draft, description: e.target.value })} className={inputCls} placeholder="Problem statement..." />
      </div>
      <div>
        <label className={labelCls}>Sample Input</label>
        <input type="text" value={draft.sampleInput || ''} onChange={e => setDraft({ ...draft, sampleInput: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Sample Output</label>
        <input type="text" value={draft.sampleOutput || ''} onChange={e => setDraft({ ...draft, sampleOutput: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Time Complexity</label>
        <input type="text" value={draft.timeComplexity || 'O(N)'} onChange={e => setDraft({ ...draft, timeComplexity: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Space Complexity</label>
        <input type="text" value={draft.spaceComplexity || 'O(1)'} onChange={e => setDraft({ ...draft, spaceComplexity: e.target.value })} className={inputCls} />
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Company Tags (comma-separated)</label>
        <input type="text" value={Array.isArray(draft.companyTags) ? draft.companyTags.join(', ') : (draft.companyTags || '')} onChange={e => setDraft({ ...draft, companyTags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} className={inputCls} placeholder="TCS, Infosys" />
      </div>
    </div>
  );

  const McqForm = ({ draft, setDraft }: { draft: Record<string, any>; setDraft: (d: Record<string, any>) => void }) => (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelCls}>Topic Category *</label>
        <select value={draft.topicCategory || 'C_PROGRAMMING'} onChange={e => setDraft({ ...draft, topicCategory: e.target.value })} className={inputCls}>
          {['C_PROGRAMMING','CPP_PROGRAMMING','CSHARP_PROGRAMMING','JAVA_PROGRAMMING','DATABASE','NETWORKING','OPERATING_SYSTEMS','DATA_STRUCTURES','ALGORITHMS'].map(cat => (
            <option key={cat} value={cat}>{cat.replace(/_/g,' ')}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Difficulty</label>
        <select value={draft.difficulty || 'MEDIUM'} onChange={e => setDraft({ ...draft, difficulty: e.target.value })} className={inputCls}>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Question *</label>
        <textarea rows={3} value={draft.question || ''} onChange={e => setDraft({ ...draft, question: e.target.value })} className={inputCls} placeholder="What is the output of..." />
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Code Snippet (optional)</label>
        <textarea rows={4} value={draft.codeSnippet || ''} onChange={e => setDraft({ ...draft, codeSnippet: e.target.value })} className={`${inputCls} font-mono`} />
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Options (one per line) *</label>
        <textarea rows={4} value={Array.isArray(draft.options) ? draft.options.join('\n') : (draft.options || '')} onChange={e => setDraft({ ...draft, options: e.target.value })} className={inputCls} placeholder={'Option A\nOption B\nOption C\nOption D'} />
      </div>
      <div>
        <label className={labelCls}>Correct Option Index (0-based) *</label>
        <input type="number" min={0} max={3} value={draft.correctOptionIndex ?? 0} onChange={e => setDraft({ ...draft, correctOptionIndex: Number(e.target.value) })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Company Tags (comma-separated)</label>
        <input type="text" value={Array.isArray(draft.companyTags) ? draft.companyTags.join(', ') : (draft.companyTags || '')} onChange={e => setDraft({ ...draft, companyTags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} className={inputCls} placeholder="TCS NQT" />
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Explanation</label>
        <textarea rows={3} value={draft.explanation || ''} onChange={e => setDraft({ ...draft, explanation: e.target.value })} className={inputCls} />
      </div>
    </div>
  );

  const levelColor: Record<string, string> = {
    BASIC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    EASY: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    HARD: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin" className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-500" />
        </Link>
        <div>
          <h1 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">Technical Hub Admin</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Topics, Problems, and MCQs — saved to Supabase in real-time</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabBtn('topics', 'Topics', Layers)}
        {tabBtn('problems', 'Problems', Code2)}
        {tabBtn('mcqs', 'Technical MCQs', Brain)}
      </div>

      {/* ─── TOPICS TAB ─── */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {(['PROGRAMMING_150', 'CAMPUS_DSA', 'TECHNICAL_MCQS'] as TechnicalTrack[]).map(track => (
              <button key={track} onClick={() => setTopicTrack(track)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${topicTrack === track ? 'bg-indigo-600 text-white border-indigo-600' : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                {track.replace(/_/g, ' ')}
              </button>
            ))}
            <button onClick={() => setShowAddTopicForm(v => !v)} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Topic
            </button>
          </div>

          {showAddTopicForm && (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-900/10 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Add New Topic</h3>
              <TopicForm draft={addTopicDraft} setDraft={setAddTopicDraft} />
              <div className="flex gap-2">
                <button onClick={saveAddTopic} disabled={topicSaving || !addTopicDraft.id || !(addTopicDraft.name || addTopicDraft.title)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  <Check className="w-4 h-4" />{topicSaving ? 'Saving…' : 'Save to Supabase'}
                </button>
                <button onClick={() => setShowAddTopicForm(false)} className="px-4 py-2 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/60">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{topics.length} Topics</span>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {topics.length === 0 && <div className="py-10 text-center text-sm text-neutral-400">No topics yet — add one above.</div>}
              {topics.map(topic => (
                <div key={topic.id} className={`p-4 space-y-3 ${editingTopicId === topic.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'} ${topic.is_hidden ? 'opacity-60' : ''}`}>
                  {editingTopicId === topic.id ? (
                    <>
                      <TopicForm draft={topicDraft} setDraft={setTopicDraft} />
                      <div className="flex gap-2">
                        <button onClick={saveTopicEdit} disabled={topicSaving} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                          <Check className="w-3.5 h-3.5" />{topicSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={() => setEditingTopicId(null)} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{topic.name || topic.title}</span>
                          {topic.is_hidden && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold uppercase">Hidden</span>}
                        </div>
                        <p className="text-xs text-neutral-400">{topic.cluster} · {topic.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleToggleTopicHide(topic.id, !!topic.is_hidden)} title={topic.is_hidden ? 'Unhide' : 'Hide'} className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                          {topic.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { setEditingTopicId(topic.id); setTopicDraft({ ...topic, name: topic.name || topic.title }); }} className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteTopic(topic.id, topic.name || topic.title || topic.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── PROBLEMS TAB ─── */}
      {activeTab === 'problems' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['PROGRAMMING_150', 'CAMPUS_DSA'] as const).map(track => (
              <button key={track} onClick={() => setProblemTrack(track)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${problemTrack === track ? 'bg-indigo-600 text-white border-indigo-600' : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                {track === 'PROGRAMMING_150' ? `Programming 150 (${p150.length})` : `Campus DSA (${dsa.length})`}
              </button>
            ))}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search problems…" className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
            </div>
            <button onClick={() => { setShowAddProblemForm(v => !v); setShowBulkProblem(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Add
            </button>
            <button onClick={() => { setShowBulkProblem(v => !v); setShowAddProblemForm(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-neutral-800 dark:bg-neutral-700 text-white hover:bg-neutral-900 transition-colors">
              <Upload className="w-4 h-4" /> Bulk JSON
            </button>
          </div>

          {showAddProblemForm && (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-900/10 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Add Problem to {problemTrack.replace(/_/g,' ')}</h3>
              <ProblemForm draft={problemDraft} setDraft={setProblemDraft} />
              <div className="flex gap-2">
                <button onClick={handleSaveAddProblem} disabled={problemSaving || !problemDraft.title} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  <Check className="w-4 h-4" />{problemSaving ? 'Saving…' : 'Save to Supabase'}
                </button>
                <button onClick={() => setShowAddProblemForm(false)} className="px-4 py-2 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {showBulkProblem && (
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Bulk Import — Problems
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(PROBLEM_TEMPLATE); setProblemCopiedTemplate(true); setTimeout(()=>setProblemCopiedTemplate(false),2000); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    {problemCopiedTemplate ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}{problemCopiedTemplate ? 'Copied!' : 'Copy Template'}
                  </button>
                  <button onClick={() => problemFileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Upload JSON
                  </button>
                  <input ref={problemFileRef} type="file" accept=".json" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{const t=(ev.target?.result as string)||''; setProblemJson(t); parseJson(t,setParsedProblems,setProblemParseError);}; r.readAsText(f); e.target.value=''; }} />
                </div>
              </div>
              <textarea value={problemJson} onChange={e => { setProblemJson(e.target.value); parseJson(e.target.value,setParsedProblems,setProblemParseError); }} rows={10}
                placeholder={`Paste JSON array...\n\n${PROBLEM_TEMPLATE}`}
                className="w-full text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              {problemParseError && <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-sm text-red-700 dark:text-red-400"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />Parse error: {problemParseError}</div>}
              {parsedProblems.length > 0 && !problemParseError && <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 text-sm text-green-700 dark:text-green-400"><CheckCircle2 className="w-4 h-4" />Valid — {parsedProblems.length} problems ready.</div>}
              {problemImportReport && <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${problemImportReport.count>0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400'}`}>{problemImportReport.count>0 ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}{problemImportReport.message}</div>}
              <button onClick={handleImportProblems} disabled={!parsedProblems.length || !!problemParseError || isImportingProblems}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <Upload className="w-4 h-4" />{isImportingProblems ? 'Importing to Supabase…' : `Import ${parsedProblems.length} Problems`}
              </button>
            </div>
          )}

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/60">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{filteredProblems.length} Problem(s)</span>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredProblems.length === 0 && <div className="py-10 text-center text-sm text-neutral-400">No problems found.</div>}
              {filteredProblems.map(p => (
                <div key={p.id} className="p-4 flex items-start justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${levelColor[p.level] || levelColor.MEDIUM}`}>{p.level}</span>
                      <span className="text-[10px] text-neutral-400">{p.category}</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{p.title}</p>
                  </div>
                  <button onClick={() => handleDeleteProblem(p.id, p.title)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MCQs TAB ─── */}
      {activeTab === 'mcqs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search MCQs…" className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
            </div>
            <button onClick={() => { setShowAddMcqForm(v => !v); setShowBulkMcq(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Add MCQ
            </button>
            <button onClick={() => { setShowBulkMcq(v => !v); setShowAddMcqForm(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-neutral-800 dark:bg-neutral-700 text-white hover:bg-neutral-900 transition-colors">
              <Upload className="w-4 h-4" /> Bulk JSON
            </button>
          </div>

          {showAddMcqForm && (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-900/10 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Add New Technical MCQ</h3>
              <McqForm draft={mcqDraft} setDraft={setMcqDraft} />
              <div className="flex gap-2">
                <button onClick={handleSaveAddMcq} disabled={mcqSaving || !mcqDraft.question} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  <Check className="w-4 h-4" />{mcqSaving ? 'Saving…' : 'Save to Supabase'}
                </button>
                <button onClick={() => setShowAddMcqForm(false)} className="px-4 py-2 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {showBulkMcq && (
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Bulk Import — MCQs
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(MCQ_TEMPLATE); setMcqCopiedTemplate(true); setTimeout(()=>setMcqCopiedTemplate(false),2000); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    {mcqCopiedTemplate ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}{mcqCopiedTemplate ? 'Copied!' : 'Copy Template'}
                  </button>
                  <button onClick={() => mcqFileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Upload JSON
                  </button>
                  <input ref={mcqFileRef} type="file" accept=".json" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{const t=(ev.target?.result as string)||''; setMcqJson(t); parseJson(t,setParsedMcqs,setMcqParseError);}; r.readAsText(f); e.target.value=''; }} />
                </div>
              </div>
              <textarea value={mcqJson} onChange={e => { setMcqJson(e.target.value); parseJson(e.target.value,setParsedMcqs,setMcqParseError); }} rows={10}
                placeholder={`Paste JSON array...\n\n${MCQ_TEMPLATE}`}
                className="w-full text-sm font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
              {mcqParseError && <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-sm text-red-700 dark:text-red-400"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />Parse error: {mcqParseError}</div>}
              {parsedMcqs.length > 0 && !mcqParseError && <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 text-sm text-green-700 dark:text-green-400"><CheckCircle2 className="w-4 h-4" />Valid — {parsedMcqs.length} MCQs ready.</div>}
              {mcqImportReport && <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${mcqImportReport.count>0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400'}`}>{mcqImportReport.count>0 ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}{mcqImportReport.message}</div>}
              <button onClick={handleImportMcqs} disabled={!parsedMcqs.length || !!mcqParseError || isImportingMcqs}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <Upload className="w-4 h-4" />{isImportingMcqs ? 'Importing to Supabase…' : `Import ${parsedMcqs.length} MCQs`}
              </button>
            </div>
          )}

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/60">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{filteredMcqs.length} MCQ(s) total</span>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredMcqs.length === 0 && <div className="py-10 text-center text-sm text-neutral-400">No MCQs found.</div>}
              {filteredMcqs.map(m => (
                <div key={m.id} className="p-4 flex items-start justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{m.topicCategory.replace(/_/g,' ')}</span>
                      <span className="text-[10px] text-neutral-400">{m.difficulty}</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2">{m.question}</p>
                  </div>
                  <button onClick={() => handleDeleteMcq(m.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
