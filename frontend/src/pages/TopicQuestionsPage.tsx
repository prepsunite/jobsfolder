import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  ChevronLeft,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  Filter,
  FileJson,
  Upload
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, type TopicQuestionItem, type ImportReport } from '@/services/dataStore';
import { supabase } from '@/lib/supabase';

export default function TopicQuestionsPage() {
  const { categorySlug = 'arithmetic-aptitude', topicId = 'height-and-distance' } = useParams<{ categorySlug: string; topicId: string }>();
  const { theme } = useTheme();
  const { role } = useAuth();
  const isDarkMode = theme === 'dark';
  const isAdmin = role === 'ADMIN';

  // Topic display names
  const topicNames: Record<string, string> = {
    'height-and-distance': 'Height and Distance',
    'problems-on-trains': 'Problems on Trains',
    'time-and-distance': 'Time and Distance',
    'time-and-work': 'Time and Work',
    'profit-and-loss': 'Profit and Loss',
    'percentage': 'Percentage',
    'simple-interest': 'Simple Interest',
    'compound-interest': 'Compound Interest',
    'probability': 'Probability',
    'permutation-and-combination': 'Permutation and Combination',
  };

  const topicName = topicNames[topicId] || topicId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Reactive state for Questions & Filters
  const [questions, setQuestions] = useState<TopicQuestionItem[]>([]);
  const [activeDifficulty, setActiveDifficulty] = useState<string>('ALL');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedExpl, setRevealedExpl] = useState<Record<string, boolean>>({});
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>(() => dataStore.getBookmarkedQuestionIds());

  // Admin Single Question Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TopicQuestionItem | null>(null);

  // Form State
  const [formStatement, setFormStatement] = useState('');
  const [formOptionA, setFormOptionA] = useState('');
  const [formOptionB, setFormOptionB] = useState('');
  const [formOptionC, setFormOptionC] = useState('');
  const [formOptionD, setFormOptionD] = useState('');
  const [formOptionE, setFormOptionE] = useState('');
  const [formCorrect, setFormCorrect] = useState('A');
  const [formExplanation, setFormExplanation] = useState('');
  const [formFormulas, setFormFormulas] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [formIsHidden, setFormIsHidden] = useState(false);

  // Admin Bulk JSON Import Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState('');
  const [bulkImportResult, setBulkImportResult] = useState<ImportReport | null>(null);

  // Load questions from Supabase (live — admins and students always see the same data)
  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('topic_questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: TopicQuestionItem[] = data.map((q: any) => ({
          id: q.id,
          topicId: q.topic_id,
          questionNumber: q.question_number || 1,
          statement: q.statement || '',
          options: (() => {
            try { return typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []); }
            catch { return []; }
          })(),
          correctAnswer: q.correct_answer || 'A',
          explanation: q.explanation || '',
          formulasUsed: q.structured_explanation?.formulaUsed || (typeof q.structured_explanation === 'string' ? (() => { try { return JSON.parse(q.structured_explanation)?.formulaUsed; } catch { return []; } })() : []) || [],
          difficulty: q.difficulty || 'MEDIUM',
          difficultyLevel: q.difficulty_level || 2,
          isHidden: q.is_hidden || false,
          createdAt: q.created_at,
        }));
        setQuestions(mapped);
        return;
      }
    } catch (err) {
      console.warn('[TopicQuestionsPage] Supabase load failed, using local dataStore:', err);
    }
    // Fallback to localStorage only if Supabase fails
    const list = dataStore.getTopicQuestions(topicId);
    setQuestions(list);
  };

  useEffect(() => {
    loadQuestions();
  }, [topicId]);

  const handleSelectOption = (qId: string, optionKey: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionKey }));
  };

  const toggleExplanation = (qId: string) => {
    setRevealedExpl(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleToggleBookmark = (qId: string) => {
    dataStore.toggleBookmarkQuestion(qId);
    setSavedQuestionIds(dataStore.getBookmarkedQuestionIds());
  };

  // --- ADMIN CRUD HANDLERS ---
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormStatement('');
    setFormOptionA('');
    setFormOptionB('');
    setFormOptionC('');
    setFormOptionD('');
    setFormOptionE('');
    setFormCorrect('A');
    setFormExplanation('');
    setFormFormulas('');
    setFormDifficulty('MEDIUM');
    setFormIsHidden(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (q: TopicQuestionItem) => {
    setEditingQuestion(q);
    setFormStatement(q.statement);
    setFormOptionA(q.options.find(o => o.key === 'A')?.text || '');
    setFormOptionB(q.options.find(o => o.key === 'B')?.text || '');
    setFormOptionC(q.options.find(o => o.key === 'C')?.text || '');
    setFormOptionD(q.options.find(o => o.key === 'D')?.text || '');
    setFormOptionE(q.options.find(o => o.key === 'E')?.text || '');
    setFormCorrect(q.correctAnswer);
    setFormExplanation(q.explanation || '');
    setFormFormulas(q.formulasUsed ? q.formulasUsed.join('\n') : '');
    setFormDifficulty(q.difficulty || 'MEDIUM');
    setFormIsHidden(!!q.isHidden);
    setShowModal(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStatement.trim()) return alert('Question statement is required.');

    const optionsList = [
      { key: 'A', text: formOptionA.trim() || 'Option A' },
      { key: 'B', text: formOptionB.trim() || 'Option B' },
      { key: 'C', text: formOptionC.trim() || 'Option C' },
      { key: 'D', text: formOptionD.trim() || 'Option D' },
    ];
    if (formOptionE.trim()) {
      optionsList.push({ key: 'E', text: formOptionE.trim() });
    }

    const formulasArray = formFormulas
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    try {
      const structuredExp = {
        formulaUsed: formulasArray,
      };
      if (editingQuestion) {
        const { error } = await supabase
          .from('topic_questions')
          .update({
            statement: formStatement,
            options: JSON.stringify(optionsList),
            correct_answer: formCorrect,
            explanation: formExplanation,
            structured_explanation: JSON.stringify(structuredExp),
            difficulty: formDifficulty,
            is_hidden: formIsHidden,
          })
          .eq('id', editingQuestion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('topic_questions')
          .insert({
            topic_id: topicId,
            question_number: questions.length + 1,
            statement: formStatement,
            options: JSON.stringify(optionsList),
            correct_answer: formCorrect,
            explanation: formExplanation,
            structured_explanation: JSON.stringify(structuredExp),
            difficulty: formDifficulty,
            difficulty_level: formDifficulty === 'EASY' ? 1 : formDifficulty === 'HARD' ? 3 : 2,
            is_hidden: formIsHidden,
            is_deleted: false,
          });
        if (error) throw error;
      }
      setShowModal(false);
      loadQuestions();
    } catch (err: any) {
      alert(`Failed to save question to Supabase: ${err.message || err}`);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const { error } = await supabase
          .from('topic_questions')
          .update({ is_deleted: true })
          .eq('id', qId);
        if (error) throw error;
        loadQuestions();
      } catch (err: any) {
        alert(`Failed to delete question from Supabase: ${err.message || err}`);
      }
    }
  };

  const handleToggleVisibility = async (qId: string) => {
    const q = questions.find(q => q.id === qId);
    if (!q) return;
    const newHidden = !q.isHidden;
    try {
      const { error } = await supabase
        .from('topic_questions')
        .update({ is_hidden: newHidden })
        .eq('id', qId);
      if (error) throw error;
      loadQuestions();
    } catch (err: any) {
      alert(`Failed to update question visibility in Supabase: ${err.message || err}`);
    }
  };

  // --- BULK JSON IMPORT HANDLER (writes directly to Supabase) ---
  const handleProcessBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkJsonInput.trim()) return;

    // Try Supabase bulk insert first
    try {
      const parsed = JSON.parse(bulkJsonInput);
      const items: any[] = Array.isArray(parsed) ? parsed : [parsed];
      const rows = items.map((q: any, idx: number) => {
        const rawFormulas = q.formulasUsed || q.formulas || (typeof q.explanation === 'object' ? (q.explanation?.formulaUsed || q.explanation?.formulasUsed) : []);
        const structuredExp = typeof q.explanation === 'object' && q.explanation !== null
          ? q.explanation
          : { formulaUsed: Array.isArray(rawFormulas) ? rawFormulas : [] };

        const expStr = typeof q.explanation === 'string'
          ? q.explanation
          : (q.explanation?.finalAnswer || (Array.isArray(q.explanation?.steps) ? q.explanation.steps.map((s: any) => typeof s === 'string' ? s : `${s.title || 'Step'}: ${s.content || s.text || ''}`).join('\n') : ''));

        let resolvedCorrect = 'A';
        if (typeof q.correctOption === 'number') {
          resolvedCorrect = ['A', 'B', 'C', 'D', 'E'][q.correctOption] || 'A';
        } else if (typeof q.correctOption === 'string') {
          const num = parseInt(q.correctOption, 10);
          resolvedCorrect = !isNaN(num) ? (['A', 'B', 'C', 'D', 'E'][num] || 'A') : q.correctOption.toUpperCase();
        } else {
          resolvedCorrect = q.correct_answer || q.correctAnswer || q.answer || 'A';
        }

        return {
          topic_id: topicId,
          question_number: questions.length + idx + 1,
          statement: q.statement || q.question || q.title || 'Question',
          options: JSON.stringify(Array.isArray(q.options) ? q.options.map((opt: any, oIdx: number) => {
            if (typeof opt === 'string') return { key: ['A', 'B', 'C', 'D', 'E'][oIdx] || `${oIdx + 1}`, text: opt };
            return { key: opt.id || opt.key || ['A', 'B', 'C', 'D', 'E'][oIdx], text: opt.text || String(opt) };
          }) : [
            { key: 'A', text: q.optionA || q.a || 'Option A' },
            { key: 'B', text: q.optionB || q.b || 'Option B' },
            { key: 'C', text: q.optionC || q.c || 'Option C' },
            { key: 'D', text: q.optionD || q.d || 'Option D' },
          ]),
          correct_answer: resolvedCorrect,
          explanation: expStr,
          difficulty: (q.difficulty || 'MEDIUM').toUpperCase(),
          difficulty_level: q.difficulty === 'EASY' ? 1 : q.difficulty === 'HARD' ? 3 : 2,
          is_hidden: false,
          is_deleted: false,
          structured_explanation: JSON.stringify(structuredExp),
        };
      });

      const { error } = await supabase.from('topic_questions').insert(rows);
      if (error) throw error;

      setBulkImportResult({ success: rows.length, duplicates: 0, invalid: 0, errors: [] });
      loadQuestions();
    } catch (err: any) {
      setBulkImportResult({ success: 0, duplicates: 0, invalid: 1, errors: [{ itemIndex: 0, reason: `Supabase bulk import failed: ${err.message || err}` }] });
    }
  };

  // Permanent LeetCode-style Question Number Assignment (Master topic list order)
  const roleFilteredQuestions = (isAdmin ? questions : questions.filter(q => !q.isHidden)).map((q, index) => ({
    ...q,
    permanentNumber: q.questionNumber || (index + 1),
  }));
  
  const filteredQuestions = roleFilteredQuestions.filter(q => {
    if (activeDifficulty === 'ALL') return true;
    const normDiff = q.difficultyLevel === 1 ? 'EASY' : q.difficultyLevel === 3 ? 'HARD' : (q.difficulty || 'MEDIUM').toUpperCase();
    return normDiff === activeDifficulty;
  });

  const getDifficultyBadge = (diff?: string, diffLevel?: number) => {
    let resolvedDiff = diff;
    if (!resolvedDiff && diffLevel) {
      resolvedDiff = diffLevel === 1 ? 'EASY' : diffLevel === 3 ? 'HARD' : 'MEDIUM';
    }
    resolvedDiff = (resolvedDiff || 'MEDIUM').toUpperCase();

    switch (resolvedDiff) {
      case 'EASY':
      case '1':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Easy</span>
          </span>
        );
      case 'HARD':
      case '3':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Hard</span>
          </span>
        );
      case 'MEDIUM':
      case '2':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Medium</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-16 font-sans">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/aptitude/${categorySlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006c49] dark:text-[#6cf8bb] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Topic Directory</span>
        </Link>

        {isAdmin ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Editor Mode Active</span>
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#747878] dark:text-[#a6adbb]">
            Topic Practice Mode
          </span>
        )}
      </div>

      {/* Header Banner */}
      <div className={`p-6 rounded-[24px] border transition-colors shadow-xs ${
        isDarkMode
          ? 'bg-[#1e1f22] border-[#2b2d31] text-[#e3e3e3]'
          : 'bg-[#ffffff] border-[#eae1da] text-[#1f1b17]'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#006c49] dark:text-[#6cf8bb] uppercase tracking-wider block">
              Quantitative Aptitude • {topicName}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
              {topicName} Questions
            </h1>
            <p className="text-xs text-[#747878] dark:text-[#a6adbb] leading-relaxed">
              Filter questions by difficulty, test your answer with MCQ options, or view detailed step-by-step solutions.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setBulkJsonInput('');
                    setBulkImportResult(null);
                    setShowBulkModal(true);
                  }}
                  className="px-3.5 py-2 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 rounded-full text-xs font-extrabold transition-all border border-purple-500/30 flex items-center gap-1.5"
                >
                  <FileJson className="w-4 h-4" />
                  <span>Bulk Import JSON</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </>
            )}

            <div className="px-3.5 py-1.5 rounded-xl bg-[#6cf8bb]/20 dark:bg-[#006c49]/30 text-[#00714d] dark:text-[#6cf8bb] text-xs font-extrabold border border-[#00714d]/20">
              {filteredQuestions.length} Problems
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 DIFFICULTY FILTER BAR */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto p-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-extrabold text-[#747878] dark:text-[#a6adbb] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Difficulty:</span>
          </span>

          {[
            { id: 'ALL', label: 'All Levels' },
            { id: 'EASY', label: 'Easy' },
            { id: 'MEDIUM', label: 'Medium' },
            { id: 'HARD', label: 'Hard' },
          ].map((item) => {
            const isActive = activeDifficulty === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveDifficulty(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                  isActive
                    ? 'bg-[#006c49] dark:bg-[#6cf8bb] text-white dark:text-[#141517] border-[#006c49] shadow-xs ring-1 ring-white dark:ring-white ring-offset-1 ring-offset-[#fff8f5] dark:ring-offset-[#141517]'
                    : 'bg-[#ffffff] dark:bg-[#1e1f22] border-[#eae1da] dark:border-[#2b2d31] text-[#747878] dark:text-[#a6adbb] hover:border-[#006c49]/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className={`p-12 text-center rounded-[24px] border ${
            isDarkMode ? 'bg-[#1e1f22] border-[#2b2d31]' : 'bg-[#ffffff] border-[#eae1da]'
          }`}>
            <p className="text-sm font-bold text-[#747878] dark:text-[#a6adbb]">
              No {activeDifficulty !== 'ALL' ? activeDifficulty.toLowerCase() : ''} questions found for {topicName}.
            </p>
            {isAdmin && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-4 py-2 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Bulk Import JSON
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-[#006c49] text-white rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Add Question
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const userSel = selectedAnswers[q.id];
            const isExplVisible = revealedExpl[q.id];
            const isSaved = savedQuestionIds.includes(q.id);
            const se = q.structuredExplanation;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-[24px] border transition-all duration-200 shadow-xs space-y-4 relative ${
                  q.isHidden
                    ? 'opacity-70 border-dashed border-amber-500/50 bg-amber-500/5'
                    : isDarkMode
                    ? 'bg-[#1e1f22] border-[#2b2d31] text-[#e3e3e3]'
                    : 'bg-[#ffffff] border-[#eae1da] text-[#1f1b17]'
                }`}
              >
                {/* Header Row: Question # Badge + Difficulty Badge + Admin Actions */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#eae1da]/60 dark:border-[#2b2d31]">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Question Number Badge (Permanent LeetCode-style ID) */}
                    <span className="px-3 py-1 rounded-xl bg-[#006c49]/10 text-[#006c49] dark:bg-[#6cf8bb]/15 dark:text-[#6cf8bb] font-extrabold text-xs tracking-tight border border-[#006c49]/20 dark:border-[#6cf8bb]/30">
                      Question #{q.permanentNumber}
                    </span>

                    {/* Color-coded Difficulty Badge */}
                    {getDifficultyBadge(q.difficulty, q.difficultyLevel)}

                    {q.isHidden && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </span>
                    )}
                  </div>

                  {/* Admin Toolbar Controls */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleVisibility(q.id)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          q.isHidden
                            ? 'bg-amber-500/20 text-amber-600 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                        }`}
                        title={q.isHidden ? 'Publish Question' : 'Hide Question'}
                      >
                        {q.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1.5 rounded-lg bg-blue-500/20 text-blue-600 border border-blue-500/40 hover:bg-blue-500/30 transition-all"
                        title="Edit Question"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-600 border border-rose-500/40 hover:bg-rose-500/30 transition-all"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Question Statement */}
                <div className="text-sm font-semibold leading-relaxed text-[#1f1b17] dark:text-[#e3e3e3] whitespace-pre-line pt-1">
                  {q.statement}
                </div>

                {/* MCQ Options List */}
                <div className="space-y-2 pl-2">
                  {q.options.map((opt) => {
                    const optId = opt.id || opt.key || 'A';
                    const isSelected = userSel === optId;
                    const isCorrect = optId === q.correctAnswer;
                    
                    let optionStyle = 'bg-[#f6ece6]/60 dark:bg-[#141517] border-[#eae1da] dark:border-[#2b2d31] text-[#1f1b17] dark:text-[#e3e3e3] hover:border-[#006c49]/40';

                    if (userSel) {
                      if (isSelected && isCorrect) {
                        optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                      } else if (!isSelected && isCorrect) {
                        optionStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold';
                      }
                    }

                    return (
                      <button
                        key={optId}
                        onClick={() => handleSelectOption(q.id, optId)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs text-left transition-all ${optionStyle}`}
                      >
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-rose-500 text-white border-rose-500'
                            : 'border-[#c4c7c7] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb]'
                        }`}>
                          {optId}
                        </div>
                        <span className="flex-1 font-sans">{opt.text}</span>

                        {userSel && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                        {userSel && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ACTION TOOLBAR */}
                <div className="pt-3 border-t border-[#eae1da] dark:border-[#2b2d31] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isExplVisible
                          ? 'bg-[#006c49] dark:bg-[#6cf8bb] text-white dark:text-[#141517] border-[#006c49]'
                          : 'bg-[#f6ece6] dark:bg-[#2b2d31] border-[#e2d8d2] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                      }`}
                      title="Reveal Solution & Explanation"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-[11px]">View Answer & Solution</span>
                    </button>

                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        isSaved
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                          : 'bg-[#f6ece6] dark:bg-[#2b2d31] border-[#e2d8d2] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Save Question to Profile'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => alert('Question flagged for review by PrepUnite admins.')}
                      className="p-2 rounded-xl border bg-[#f6ece6] dark:bg-[#2b2d31] border-[#e2d8d2] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb] hover:text-rose-500 transition-colors"
                      title="Report Question Issue"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </div>

                  {userSel && (
                    <span className={`text-xs font-extrabold ${userSel === q.correctAnswer ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {userSel === q.correctAnswer ? '✓ Correct Answer!' : `✗ Incorrect (Correct: ${q.correctAnswer})`}
                    </span>
                  )}
                </div>

                {/* STEP-BY-STEP EXPLANATION ACCORDION (Enhanced for structured JSON) */}
                {isExplVisible && (
                  <div className="p-5 rounded-2xl bg-[#6cf8bb]/10 dark:bg-[#006c49]/20 border border-[#00714d]/20 dark:border-[#6cf8bb]/20 space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#00714d] dark:text-[#6cf8bb]">
                      <Zap className="w-4 h-4" />
                      <span>Correct Answer: Option ({q.correctAnswer})</span>
                    </div>

                    {se ? (
                      /* Rich Structured Explanation View */
                      <div className="space-y-3 text-xs text-[#1f1b17] dark:text-[#e3e3e3]">
                        {/* Given Block */}
                        {se.given && se.given.length > 0 && (
                          <div className="space-y-1">
                            <span className="font-extrabold text-[10px] uppercase text-[#747878] dark:text-[#a6adbb] tracking-wider block">
                              Given Information:
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5 font-medium">
                              {se.given.map((g, idx) => (
                                <li key={idx}>{g}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Step-by-Step Derivation (Clean Lines, No Step 1 / Step 2 Headers) */}
                        {se.steps && se.steps.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-[10px] uppercase text-[#747878] dark:text-[#a6adbb] tracking-wider block">
                              Derivation Steps:
                            </span>
                            <div className="space-y-1 font-mono text-xs font-semibold p-3 bg-black/5 dark:bg-white/5 rounded-xl text-[#1f1b17] dark:text-[#e3e3e3] border border-[#00714d]/10">
                              {se.steps.map((st, sIdx) => {
                                const stepText = typeof st === 'string' ? st : (st.text || (st as any).content || st.formula || st.title || '');
                                return (
                                  <div key={sIdx} className="leading-relaxed flex items-start gap-2">
                                    <span className="text-[#00714d] dark:text-[#6cf8bb] font-bold select-none">•</span>
                                    <span>{stepText}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Quick Shortcut / Trick Box */}
                        {se.shortcut && (
                          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1">
                            <span className="font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                              ⚡ Quick Shortcut:
                            </span>
                            <p className="text-[#1f1b17] dark:text-[#e3e3e3] font-semibold text-xs leading-relaxed">
                              {se.shortcut}
                            </p>
                          </div>
                        )}

                        {/* Final Answer */}
                        {se.finalAnswer && (
                          <div className="pt-2 border-t border-[#00714d]/15 flex items-center gap-2">
                            <span className="font-extrabold text-xs text-[#00714d] dark:text-[#6cf8bb]">
                              Final Answer:
                            </span>
                            <span className="font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-md">
                              {se.finalAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Plain Fallback Text Explanation */
                      <p className="text-xs text-[#1f1b17] dark:text-[#e3e3e3] leading-relaxed whitespace-pre-line font-sans">
                        {q.explanation}
                      </p>
                    )}

                    {/* Formulas Badge Bar */}
                    {q.formulasUsed && q.formulasUsed.length > 0 && (
                      <div className="pt-2 border-t border-[#00714d]/10 space-y-1">
                        <span className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider block">
                          Formulas Used:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {q.formulasUsed.map((f, i) => (
                            <span key={i} className="text-[10px] font-mono font-bold bg-[#ffffff] dark:bg-[#1e1f22] px-2 py-0.5 rounded border border-[#eae1da] dark:border-[#383a40] text-[#006c49] dark:text-[#6cf8bb]">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 📥 ADMIN BULK JSON IMPORT MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[24px] max-w-3xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <FileJson className="w-5 h-5" />
                <h3 className="font-display text-lg font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">
                  Bulk Question JSON Parser
                </h3>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-[#747878] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessBulkImport} className="space-y-4">
              <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
                Paste your JSON array of questions below. The parser automatically extracts topics, subtopics, MCQ options, correct answers (`correctOption`), difficulty, and structured step-by-step explanations!
              </p>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                  JSON Code Input (Supports <code className="text-purple-400">templateId</code>, <code className="text-purple-400">variables</code>, and Fingerprint Deduplication)
                </label>
                <textarea
                  rows={9}
                  value={bulkJsonInput}
                  onChange={(e) => setBulkJsonInput(e.target.value)}
                  placeholder={`[\n  {\n    "topic": "Arithmetic Aptitude",\n    "subtopic": "Problems on Numbers",\n    "templateId": "PROBLEM_NUMBER_001",\n    "variables": { "x": 24 },\n    "difficulty": "Easy",\n    "question": "A number exceeds its one-third by 24. Find the number.",\n    "options": ["32", "36", "40", "48"],\n    "correctOption": 1\n  }\n]`}
                  className="w-full font-mono text-xs p-3 rounded-xl bg-[#141517] text-emerald-400 border border-[#383a40] focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              {/* Parser Output Status (Rich Import Report) */}
              {bulkImportResult && (
                <div className="p-4 rounded-xl border text-xs space-y-3 bg-[#f6ece6]/60 dark:bg-[#141517] border-[#eae1da] dark:border-[#383a40]">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
                    <span className="font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] text-xs">
                      📊 Import Summary Report
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px]">
                        ✅ {bulkImportResult.success} Imported
                      </span>
                      {bulkImportResult.duplicates > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-[11px]">
                          ⚠️ {bulkImportResult.duplicates} Duplicates
                        </span>
                      )}
                      {bulkImportResult.invalid > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-extrabold text-[11px]">
                          ❌ {bulkImportResult.invalid} Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {bulkImportResult.errors.length > 0 && (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      <span className="font-bold text-rose-600 dark:text-rose-400 block text-[11px]">
                        Audit Error Logs:
                      </span>
                      <ul className="space-y-1 font-mono text-[11px]">
                        {bulkImportResult.errors.map((err, i) => (
                          <li key={i} className="p-2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20 flex flex-col gap-0.5">
                            <span className="font-bold">Item #{err.itemIndex}: {err.reason}</span>
                            {err.question && <span className="truncate opacity-80 font-sans">"{err.question}"</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eae1da] dark:border-[#2b2d31]">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#747878]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Parse & Import Questions</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🛠️ ADMIN ADD / EDIT QUESTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[24px] max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <div className="flex items-center gap-2 text-[#006c49] dark:text-[#6cf8bb]">
                <Edit2 className="w-5 h-5" />
                <h3 className="font-display text-lg font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">
                  {editingQuestion ? 'Edit Topic Question' : `Add Question to ${topicName}`}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#747878] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              {/* Question Statement */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                  Question Statement *
                </label>
                <textarea
                  rows={3}
                  value={formStatement}
                  onChange={(e) => setFormStatement(e.target.value)}
                  placeholder="Enter the complete question problem statement..."
                  className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-xl p-3 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none focus:border-[#006c49]"
                  required
                />
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                  Question Difficulty Level
                </label>
                <select
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')}
                  className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                >
                  <option value="EASY">🟢 Easy (Basic concept check)</option>
                  <option value="MEDIUM">🟡 Medium (Standard problem complexity)</option>
                  <option value="HARD">🔴 Hard (Advanced multi-step derivation)</option>
                </select>
              </div>

              {/* MCQ Options Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                  MCQ Options
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs w-5 text-[#006c49] dark:text-[#6cf8bb]">A.</span>
                    <input
                      type="text"
                      value={formOptionA}
                      onChange={(e) => setFormOptionA(e.target.value)}
                      placeholder="Option A text..."
                      className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs w-5 text-[#006c49] dark:text-[#6cf8bb]">B.</span>
                    <input
                      type="text"
                      value={formOptionB}
                      onChange={(e) => setFormOptionB(e.target.value)}
                      placeholder="Option B text..."
                      className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs w-5 text-[#006c49] dark:text-[#6cf8bb]">C.</span>
                    <input
                      type="text"
                      value={formOptionC}
                      onChange={(e) => setFormOptionC(e.target.value)}
                      placeholder="Option C text..."
                      className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs w-5 text-[#006c49] dark:text-[#6cf8bb]">D.</span>
                    <input
                      type="text"
                      value={formOptionD}
                      onChange={(e) => setFormOptionD(e.target.value)}
                      placeholder="Option D text..."
                      className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="font-black text-xs w-5 text-[#006c49] dark:text-[#6cf8bb]">E.</span>
                    <input
                      type="text"
                      value={formOptionE}
                      onChange={(e) => setFormOptionE(e.target.value)}
                      placeholder="Option E text (Optional)..."
                      className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                    />
                  </div>
                </div>
              </div>

              {/* Correct Answer Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                  Correct Answer Key
                </label>
                <select
                  value={formCorrect}
                  onChange={(e) => setFormCorrect(e.target.value)}
                  className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                  {formOptionE && <option value="E">Option E</option>}
                </select>
              </div>

              {/* Step-by-Step Explanation */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                  Step-by-Step Solution & Explanation
                </label>
                <textarea
                  rows={3}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Enter step-by-step solution derivation..."
                  className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-xl p-3 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none focus:border-[#006c49]"
                />
              </div>

              {/* Formulas Used (One per line) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                  Formulas Used (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formFormulas}
                  onChange={(e) => setFormFormulas(e.target.value)}
                  placeholder="tan(θ) = Opposite / Adjacent&#10;tan(30°) = 1/√3"
                  className="w-full bg-[#f6ece6]/60 dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40] rounded-xl p-3 text-xs font-mono text-[#006c49] dark:text-[#6cf8bb] focus:outline-none"
                />
              </div>

              {/* Visibility Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsHidden"
                  checked={formIsHidden}
                  onChange={(e) => setFormIsHidden(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="formIsHidden" className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] cursor-pointer">
                  Hide question from students (Keep as Admin draft)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eae1da] dark:border-[#2b2d31]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#747878]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingQuestion ? 'Save Changes' : 'Create Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
