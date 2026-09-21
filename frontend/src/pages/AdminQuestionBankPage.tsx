import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Database,
  Plus,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  Code2,
  BookOpen,
  Trash2,
  X,
  Layers,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  questionBankService,
  type TopicInventoryItem,
  type BankMcqInput,
  type BankCodingProblemInput,
} from '@/services/questionBank.service';
import { CODING_CATEGORIES } from '@/services/mockExamBlueprint.service';
import { useToast } from '@/contexts/ToastContext';
import { safeJsonParse } from '@/utils/questionParser';

export default function AdminQuestionBankPage() {
  const queryClient = useQueryClient();
  const { toast, confirmModal } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeStatus, setActiveStatus] = useState<'ALL' | 'NEEDS' | 'STOCKED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  // Selected topic for viewing / adding
  const [selectedTopic, setSelectedTopic] = useState<TopicInventoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'SINGLE_MCQ' | 'SINGLE_CODING' | 'BULK'>('BULK');

  // Single MCQ Form State
  const [mcqStatement, setMcqStatement] = useState('');
  const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
  const [mcqCorrectIndex, setMcqCorrectIndex] = useState(0);
  const [mcqExplanation, setMcqExplanation] = useState('');
  const [mcqDifficulty, setMcqDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');

  // Single Coding Problem Form State
  const [codingTitle, setCodingTitle] = useState('');
  const [codingLevel, setCodingLevel] = useState<'BASIC' | 'MEDIUM' | 'HARD'>('BASIC');
  const [codingDescription, setCodingDescription] = useState('');
  const [codingConstraints, setCodingConstraints] = useState('1 <= N <= 10^5\n1 <= A[i] <= 10^9');
  const [codingSampleInput, setCodingSampleInput] = useState('');
  const [codingSampleOutput, setCodingSampleOutput] = useState('');
  const [codingExplanation, setCodingExplanation] = useState('');
  const [codingStarterCpp, setCodingStarterCpp] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}');
  const [codingStarterPython, setCodingStarterPython] = useState('# Write your code here\n');
  const [codingStarterJava, setCodingStarterJava] = useState('import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}');

  // Bulk Import Form State
  const [bulkText, setBulkText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Load live inventories for all topics
  const { data: inventories = [], isLoading: isInventoryLoading } = useQuery<TopicInventoryItem[]>({
    queryKey: ['admin-question-inventories'],
    queryFn: () => questionBankService.getTopicInventories(),
  });

  // Load questions for selected topic with difficulty level filtering
  const { data: topicQuestionsData, refetch: refetchQuestions, isLoading: isQuestionsLoading } = useQuery({
    queryKey: ['admin-topic-questions', selectedTopic?.id, selectedTopic?.type, selectedDifficulty],
    queryFn: () =>
      selectedTopic
        ? questionBankService.getQuestionsByTopic(
            selectedTopic.id,
            selectedTopic.type === 'CODING',
            '',
            50,
            0,
            selectedDifficulty
          )
        : null,
    enabled: !!selectedTopic,
  });

  // Calculate high-level stats
  const totalQuestions = useMemo(() => inventories.reduce((acc, t) => acc + t.count, 0), [inventories]);
  const fullyStockedCount = useMemo(() => inventories.filter(t => t.count >= 500).length, [inventories]);
  const needsQuestionsCount = useMemo(() => inventories.filter(t => t.count < 500).length, [inventories]);

  // Filtered topic inventory
  const filteredInventories = useMemo(() => {
    return inventories.filter(t => {
      // Category filter
      if (activeCategory !== 'ALL') {
        if (activeCategory === 'coding' && t.type !== 'CODING') return false;
        if (activeCategory !== 'coding' && t.category !== activeCategory) return false;
      }
      // Status filter
      if (activeStatus === 'NEEDS' && t.count >= 500) return false;
      if (activeStatus === 'STOCKED' && t.count < 500) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!t.name.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [inventories, activeCategory, activeStatus, searchQuery]);

  // Parse bulk text preview
  const parsedBulkPreview = useMemo(() => {
    if (!bulkText.trim()) return null;
    try {
      const parsed = safeJsonParse(bulkText);
      if (Array.isArray(parsed)) {
        return { count: parsed.length, valid: true, items: parsed };
      }
    } catch {}
    return { count: 0, valid: false, items: [] };
  }, [bulkText]);

  // Handlers
  const handleOpenAddModal = (topic: TopicInventoryItem, mode: 'SINGLE_MCQ' | 'SINGLE_CODING' | 'BULK' = 'BULK') => {
    setSelectedTopic(topic);
    setAddMode(topic.type === 'CODING' ? 'SINGLE_CODING' : mode);
    setBulkText('');
    setShowAddModal(true);
  };

  const handleSaveSingleMcq = async () => {
    if (!selectedTopic) return;
    if (!mcqStatement.trim()) {
      toast.error('Please enter the question statement.');
      return;
    }
    if (mcqOptions.some(opt => !opt.trim())) {
      toast.error('Please fill in all 4 options.');
      return;
    }

    try {
      setIsImporting(true);
      const optionLabels = ['A', 'B', 'C', 'D'];
      const input: BankMcqInput = {
        topic_id: selectedTopic.id,
        statement: mcqStatement,
        options: mcqOptions,
        correct_answer: optionLabels[mcqCorrectIndex],
        explanation: mcqExplanation,
        difficulty: mcqDifficulty,
      };
      await questionBankService.addSingleMcq(input);
      queryClient.invalidateQueries({ queryKey: ['admin-question-inventories'] });
      refetchQuestions();
      toast.success('Question added to bank successfully.');
      setMcqStatement('');
      setMcqOptions(['', '', '', '']);
      setMcqExplanation('');
      setShowAddModal(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to add question.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveSingleCodingProblem = async () => {
    if (!selectedTopic) return;
    if (!codingTitle.trim()) {
      toast.error('Please enter the coding problem title.');
      return;
    }
    if (!codingDescription.trim()) {
      toast.error('Please enter the problem description.');
      return;
    }

    try {
      setIsImporting(true);
      const constraintsArr = codingConstraints.split('\n').filter(Boolean);
      const testCases = [];
      if (codingSampleInput || codingSampleOutput) {
        testCases.push({
          input: codingSampleInput,
          output: codingSampleOutput,
          explanation: codingExplanation,
        });
      }

      const input: BankCodingProblemInput = {
        title: codingTitle,
        category: selectedTopic.id,
        level: codingLevel,
        description: codingDescription,
        constraints: constraintsArr,
        sample_input: codingSampleInput,
        sample_output: codingSampleOutput,
        explanation: codingExplanation,
        test_cases: testCases,
        solutions: {
          cpp: codingStarterCpp,
          python: codingStarterPython,
          java: codingStarterJava,
        },
      };

      await questionBankService.addSingleCodingProblem(input);
      queryClient.invalidateQueries({ queryKey: ['admin-question-inventories'] });
      refetchQuestions();
      toast.success('Coding problem added to bank successfully.');
      setCodingTitle('');
      setCodingDescription('');
      setCodingSampleInput('');
      setCodingSampleOutput('');
      setShowAddModal(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to add coding problem.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExecuteBulkImport = async () => {
    if (!selectedTopic || !parsedBulkPreview || !parsedBulkPreview.valid) {
      toast.error('Please provide valid JSON array of questions.');
      return;
    }

    try {
      setIsImporting(true);
      if (selectedTopic.type === 'CODING') {
        const res = await questionBankService.bulkImportCodingProblems(selectedTopic.id, parsedBulkPreview.items);
        toast.success(`Imported ${res.inserted} coding problems (${res.errors} errors).`);
      } else {
        const res = await questionBankService.bulkImportMcqs(selectedTopic.id, parsedBulkPreview.items);
        toast.success(`Imported ${res.inserted} MCQs (${res.errors} errors).`);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-question-inventories'] });
      refetchQuestions();
      setBulkText('');
      setShowAddModal(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to bulk import questions.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!selectedTopic) return;
    const confirmed = await confirmModal({
      title: 'Delete Question',
      message: 'Are you sure you want to remove this question from the active bank?',
      confirmText: 'Delete Question',
      isDanger: true,
    });
    if (!confirmed) return;
    try {
      await questionBankService.deleteQuestion(qId, selectedTopic.type === 'CODING');
      queryClient.invalidateQueries({ queryKey: ['admin-question-inventories'] });
      refetchQuestions();
      toast.success('Question deleted.');
    } catch {
      toast.error('Failed to delete question.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] text-[10px] font-display font-bold uppercase tracking-wider mb-1">
            <Database className="w-3 h-3" />
            <span>High-Capacity Question Bank Space</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
            Topic Question Inventory (Target: 500 Qs / Topic)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Stock each topic up to 500 questions so mock exams can randomly draw fresh, non-repeating questions without overhead.
          </p>
        </div>

        {/* High-level Counters */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-center">
            <div className="text-gray-400 text-[10px] uppercase font-sans">Total Questions</div>
            <div className="text-base font-bold text-gray-900 dark:text-white">{totalQuestions}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-sans">Fully Stocked (500+)</div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">{fullyStockedCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-amber-600 dark:text-amber-400 text-[10px] uppercase font-sans">Needs Questions</div>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400">{needsQuestionsCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Topics' },
            { id: 'arithmetic-aptitude', label: 'Quantitative' },
            { id: 'logical-reasoning', label: 'Logical' },
            { id: 'verbal-reasoning', label: 'Verbal' },
            { id: 'technical-aptitude', label: 'Technical MCQs' },
            { id: 'coding', label: 'Coding Problems' },
          ].map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === c.id
                  ? 'bg-[#FD4A32] text-white'
                  : 'bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#27292e] hover:bg-gray-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search & Stock Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
            />
          </div>

          <select
            value={activeStatus}
            onChange={e => setActiveStatus(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] text-xs text-gray-700 dark:text-gray-300 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEEDS">Needs Questions (&lt; 500)</option>
            <option value="STOCKED">Fully Stocked (≥ 500)</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Layout: Topic Grid (Left) & Question Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topics Inventory List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
            <span>Topics ({filteredInventories.length})</span>
            <span>Target: 500 Questions Each</span>
          </div>

          {isInventoryLoading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading topic inventory...</div>
          ) : (
            <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
              {filteredInventories.map(t => {
                const isSelected = selectedTopic?.id === t.id;
                const isCoding = t.type === 'CODING';

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTopic(t)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'border-[#FD4A32] bg-[#FD4A32]/5 dark:bg-[#FD4A32]/10 ring-1 ring-[#FD4A32]/40'
                        : 'bg-white dark:bg-[#141414] border-gray-200 dark:border-[#27292e] hover:border-gray-300 dark:hover:border-[#353840]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            isCoding
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                              : 'bg-gray-100 dark:bg-[#202228] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#2e3138]'
                          }`}
                        >
                          {isCoding ? 'CODING' : 'MCQ'}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                          {t.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                          {t.count} <span className="text-gray-400 text-[10px]">/ 500 Qs</span>
                        </span>
                        {t.count >= 500 ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                            STOCKED
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                            NEEDS {500 - t.count}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-[#222428] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            t.count >= 500
                              ? 'bg-emerald-500'
                              : t.count >= 250
                              ? 'bg-amber-500'
                              : 'bg-[#FD4A32]'
                          }`}
                          style={{ width: `${t.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-gray-400 text-[10px] uppercase font-mono">
                        {t.category.replace(/-/g, ' ')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenAddModal(t, t.type === 'CODING' ? 'SINGLE_CODING' : 'SINGLE_MCQ');
                          }}
                          className="px-2 py-1 rounded-md bg-gray-100 dark:bg-[#202228] hover:bg-gray-200 dark:hover:bg-[#282a32] text-gray-700 dark:text-gray-300 font-semibold cursor-pointer"
                        >
                          + Add Single
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenAddModal(t, 'BULK');
                          }}
                          className="px-2 py-1 rounded-md bg-[#FD4A32]/10 hover:bg-[#FD4A32]/20 text-[#FD4A32] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-2.5 h-2.5" /> Bulk 500+
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Topic Questions Inspector */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] space-y-4">
            {selectedTopic ? (
              <>
                <div className="space-y-3 pb-3 border-b border-gray-100 dark:border-[#222428]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32]">
                          {selectedTopic.type}
                        </span>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                          {selectedTopic.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {topicQuestionsData?.total || 0} questions in this pool • Differentiated by difficulty level
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal(selectedTopic, 'BULK')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FD4A32] hover:bg-[#E0351D] text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Questions
                      </button>
                    </div>
                  </div>

                  {/* Difficulty Level Segmented Filter */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {[
                      { id: 'ALL', label: 'All Levels' },
                      { id: 'EASY', label: '● Easy (L1)', color: 'text-emerald-500' },
                      { id: 'MEDIUM', label: '● Medium (L2)', color: 'text-amber-500' },
                      { id: 'HARD', label: '● Hard (L3)', color: 'text-rose-500' },
                    ].map(lvl => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setSelectedDifficulty(lvl.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          selectedDifficulty === lvl.id
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-xs'
                            : 'bg-gray-100 dark:bg-[#1f2125] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#27292d]'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions List */}
                {isQuestionsLoading ? (
                  <div className="py-8 text-center text-xs text-gray-400">Loading topic questions...</div>
                ) : topicQuestionsData?.items && topicQuestionsData.items.length > 0 ? (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {topicQuestionsData.items.map((q: any, idx: number) => {
                      const diff = (q.difficulty || q.level || 'MEDIUM').toUpperCase();
                      const isEasy = diff === 'EASY' || diff === 'BASIC';
                      const isHard = diff === 'HARD';
                      const diffBadge = isEasy
                        ? { label: '● Easy • L1', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' }
                        : isHard
                        ? { label: '● Hard • L3', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' }
                        : { label: '● Medium • L2', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };

                      // Options parsing
                      const rawOptions = Array.isArray(q.options)
                        ? q.options
                        : typeof q.options === 'string'
                        ? (() => { try { return JSON.parse(q.options); } catch { return []; } })()
                        : [];

                      return (
                        <div
                          key={q.id}
                          className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#18191c] border border-gray-100 dark:border-[#24262c] space-y-2.5 shadow-2xs hover:border-gray-300 dark:hover:border-[#383a42] transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono font-bold text-gray-400">
                                #{idx + 1}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffBadge.cls}`}>
                                {diffBadge.label}
                              </span>
                              {q.exam_id === 'MOCK_EXAM_BANK' || q.track === 'MOCK_EXAM_BANK' ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                  Mock Bank
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                  Practice Pool
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                            {q.title ? `[Coding Problem] ${q.title}` : q.statement}
                          </p>

                          {/* MCQ Options with Checked Correct Answer */}
                          {rawOptions && rawOptions.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                              {rawOptions.map((optItem: any, oIdx: number) => {
                                const optText = typeof optItem === 'object' ? optItem.text || optItem.value : String(optItem);
                                const optKey = typeof optItem === 'object' && optItem.key ? optItem.key : ['A', 'B', 'C', 'D', 'E'][oIdx];
                                const rawCorrect = String(q.correct_answer || '').toUpperCase();
                                const isCorrect =
                                  rawCorrect === optKey ||
                                  rawCorrect === String(oIdx) ||
                                  rawCorrect === ['0', '1', '2', '3', '4'][oIdx];

                                return (
                                  <div
                                    key={oIdx}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 border transition-all ${
                                      isCorrect
                                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                                        : 'bg-white dark:bg-[#1f2125] border-gray-100 dark:border-[#27292e] text-gray-600 dark:text-gray-400'
                                    }`}
                                  >
                                    <span
                                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                        isCorrect
                                          ? 'bg-emerald-500 text-white shadow-xs'
                                          : 'bg-gray-200 dark:bg-[#2e3036] text-gray-700 dark:text-gray-300'
                                      }`}
                                    >
                                      {isCorrect ? '✓' : optKey}
                                    </span>
                                    <span className="truncate">{optText}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Coding Problem Metadata */}
                          {q.constraints && Array.isArray(q.constraints) && (
                            <div className="text-[10px] font-mono text-gray-400">
                              Constraints: {q.constraints.join(' | ')}
                            </div>
                          )}

                          {/* Explanation / Solution Note */}
                          {q.explanation && (
                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-[#1e2024] text-[11px] text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-[#2b2d33] flex items-start gap-1.5">
                              <span className="text-[#FD4A32] font-bold shrink-0">💡 Solution:</span>
                              <span className="line-clamp-2">{q.explanation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-gray-400 space-y-2">
                    <p>No questions yet in this topic.</p>
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(selectedTopic, 'BULK')}
                      className="px-3 py-1.5 rounded-lg bg-[#FD4A32] text-white text-xs font-bold cursor-pointer"
                    >
                      + Add First Batch of Questions
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center text-xs text-gray-400 space-y-2">
                <Database className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                <p>Select a topic on the left to inspect questions or add new ones.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Questions Modal */}
      {showAddModal && selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#252830]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FD4A32]">
                  {selectedTopic.name} ({selectedTopic.type})
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white font-display">
                  Add Questions to Topic Bank
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#202228] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#252830] pb-3">
              {selectedTopic.type === 'MCQ' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAddMode('BULK')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      addMode === 'BULK'
                        ? 'bg-[#FD4A32] text-white'
                        : 'bg-gray-100 dark:bg-[#202228] text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Upload className="w-3 h-3" /> Bulk Import (50–500 Qs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddMode('SINGLE_MCQ')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      addMode === 'SINGLE_MCQ'
                        ? 'bg-[#FD4A32] text-white'
                        : 'bg-gray-100 dark:bg-[#202228] text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Plus className="w-3 h-3" /> Add Single MCQ
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setAddMode('SINGLE_CODING')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      addMode === 'SINGLE_CODING'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-[#202228] text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Code2 className="w-3 h-3" /> Single Coding Problem
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddMode('BULK')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      addMode === 'BULK'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-[#202228] text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Upload className="w-3 h-3" /> Bulk Import Coding Problems
                  </button>
                </>
              )}
            </div>

            {/* TAB 1: BULK IMPORT */}
            {addMode === 'BULK' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  Paste a JSON array of questions to instantly load dozens or hundreds of questions into{' '}
                  <strong>{selectedTopic.name}</strong>.
                </p>

                <textarea
                  rows={8}
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  placeholder={`[\n  {\n    "statement": "What is the speed if distance is 100m and time is 10s?",\n    "options": ["10 m/s", "20 m/s", "5 m/s", "15 m/s"],\n    "correct_answer": "A",\n    "explanation": "Speed = Distance / Time = 100/10 = 10 m/s."\n  }\n]`}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs font-mono text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                />

                {parsedBulkPreview && (
                  <div
                    className={`p-2.5 rounded-xl border text-xs font-mono ${
                      parsedBulkPreview.valid
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}
                  >
                    {parsedBulkPreview.valid
                      ? `✓ Valid JSON: Detected ${parsedBulkPreview.count} questions ready to insert.`
                      : '✗ Invalid JSON format. Please ensure it is an array of question objects.'}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2c2f38] text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteBulkImport}
                    disabled={isImporting || !parsedBulkPreview?.valid}
                    className="px-5 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isImporting ? 'Importing...' : `Import ${parsedBulkPreview?.count || 0} Questions`}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SINGLE MCQ FORM */}
            {addMode === 'SINGLE_MCQ' && (
              <div className="space-y-3">
                {/* Difficulty Level Segmented Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Difficulty Level *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'EASY', label: 'Easy / Basic', level: 'Level 1' },
                      { id: 'MEDIUM', label: 'Medium', level: 'Level 2' },
                      { id: 'HARD', label: 'Hard', level: 'Level 3' },
                    ].map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setMcqDifficulty(d.id as any)}
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                          mcqDifficulty === d.id
                            ? d.id === 'EASY'
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                              : d.id === 'MEDIUM'
                              ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                              : 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                            : 'border-gray-200 dark:border-[#27292e] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1b1e]'
                        }`}
                      >
                        <div className="text-xs">{d.label}</div>
                        <div className="text-[10px] opacity-70 font-mono">{d.level}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Question Statement *
                  </label>
                  <textarea
                    rows={3}
                    value={mcqStatement}
                    onChange={e => setMcqStatement(e.target.value)}
                    placeholder="Write question here (supports markdown & formulas)..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Options & Correct Answer *
                  </label>
                  {['A', 'B', 'C', 'D'].map((label, idx) => (
                    <div key={label} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-opt"
                        checked={mcqCorrectIndex === idx}
                        onChange={() => setMcqCorrectIndex(idx)}
                        className="text-[#FD4A32] focus:ring-[#FD4A32] cursor-pointer"
                      />
                      <span className="text-xs font-bold font-mono text-gray-500 w-4">{label}.</span>
                      <input
                        type="text"
                        value={mcqOptions[idx]}
                        onChange={e => {
                          const updated = [...mcqOptions];
                          updated[idx] = e.target.value;
                          setMcqOptions(updated);
                        }}
                        placeholder={`Option ${label}`}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Explanation / Solution
                  </label>
                  <textarea
                    rows={2}
                    value={mcqExplanation}
                    onChange={e => setMcqExplanation(e.target.value)}
                    placeholder="Step-by-step solution..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2c2f38] text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSingleMcq}
                    disabled={isImporting}
                    className="px-5 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isImporting ? 'Saving...' : 'Add to Question Bank'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: SINGLE CODING PROBLEM FORM */}
            {addMode === 'SINGLE_CODING' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Difficulty Level *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'BASIC', label: 'Basic / Easy', level: 'Level 1' },
                      { id: 'MEDIUM', label: 'Medium', level: 'Level 2' },
                      { id: 'HARD', label: 'Hard', level: 'Level 3' },
                    ].map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setCodingLevel(d.id as any)}
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                          codingLevel === d.id
                            ? d.id === 'BASIC'
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                              : d.id === 'MEDIUM'
                              ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                              : 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                            : 'border-gray-200 dark:border-[#27292e] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1b1e]'
                        }`}
                      >
                        <div className="text-xs">{d.label}</div>
                        <div className="text-[10px] opacity-70 font-mono">{d.level}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    value={codingTitle}
                    onChange={e => setCodingTitle(e.target.value)}
                    placeholder="e.g. Invert a Binary Tree"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Problem Statement & Specifications *
                  </label>
                  <textarea
                    rows={3}
                    value={codingDescription}
                    onChange={e => setCodingDescription(e.target.value)}
                    placeholder="Explain the problem, inputs, and outputs..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Sample Input
                    </label>
                    <textarea
                      rows={2}
                      value={codingSampleInput}
                      onChange={e => setCodingSampleInput(e.target.value)}
                      placeholder="e.g. 5\n1 2 3 4 5"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs font-mono text-gray-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Sample Expected Output
                    </label>
                    <textarea
                      rows={2}
                      value={codingSampleOutput}
                      onChange={e => setCodingSampleOutput(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs font-mono text-gray-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2c2f38] text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSingleCodingProblem}
                    disabled={isImporting}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isImporting ? 'Saving...' : 'Add Coding Problem to Bank'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
