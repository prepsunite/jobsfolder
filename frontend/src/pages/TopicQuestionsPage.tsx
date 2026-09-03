import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
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
  Upload,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, type TopicQuestionItem, type ImportReport } from '@/services/dataStore';
import { progressService, type QuestionProgressRecord } from '@/services/progress.service';
import { supabase } from '@/lib/supabase';
import { safeJsonParse, normalizeMathText, generateQuestionFingerprint } from '@/utils/questionParser';

import { useQuery } from '@tanstack/react-query';
import QuestionRichContent from '@/components/QuestionRichContent';
import ReportQuestionModal from '@/components/ReportQuestionModal';
import ShareModal from '@/components/ShareModal';
import TopicCheatcodeModal from '@/components/TopicCheatcodeModal';
import audioEffects from '@/utils/audioEffects';

export default function TopicQuestionsPage() {
  const { categorySlug = 'arithmetic-aptitude', topicId = 'height-and-distance' } = useParams<{ categorySlug: string; topicId: string }>();
  const { role, user } = useAuth();
  const isAdmin = role === 'ADMIN';

  // Topic display name
  const { data: foundTopic } = useQuery({
    queryKey: ['aptitude-topic', topicId],
    queryFn: async () => {
      const { data, error } = await supabase.from('aptitude_topics').select('*').eq('id', topicId).single();
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
  const topicName = foundTopic?.name || topicId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Reactive state for Questions & Filters
  const [questions, setQuestions] = useState<TopicQuestionItem[]>([]);
  const [activeDifficulty, setActiveDifficulty] = useState<string>('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'ALL' | 'UNSOLVED' | 'SOLVED' | 'RETRY' | 'BOOKMARKED'>('ALL');
  const [progressRecords, setProgressRecords] = useState<Record<string, QuestionProgressRecord>>(() =>
    progressService.getAllRecords(user?.email)
  );
  const [wrongPicks, setWrongPicks] = useState<Record<string, string[]>>({});
  const [revealedExpl, setRevealedExpl] = useState<Record<string, boolean>>({});
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>(() => dataStore.getBookmarkedQuestionIds());
  const [reportingQuestion, setReportingQuestion] = useState<TopicQuestionItem | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMuted, setIsMuted] = useState(() => audioEffects.getMuted());

  const handleToggleSound = () => {
    const next = audioEffects.toggleMute();
    setIsMuted(next);
  };

  // Hydrate user progress and bookmarks from Supabase on mount / when user changes
  useEffect(() => {
    if (user?.email && user.email !== 'guest@prepunite.com') {
      progressService.fetchAndSyncFromSupabase(user.email).then((records) => {
        setProgressRecords(records);
      });
      dataStore.hydrateBookmarksFromSupabase().then(() => {
        setSavedQuestionIds(dataStore.getBookmarkedQuestionIds());
      });
    }

    const handleBookmarksChanged = () => {
      setSavedQuestionIds(dataStore.getBookmarkedQuestionIds());
    };
    window.addEventListener('prepunite_bookmarks_changed', handleBookmarksChanged);
    return () => window.removeEventListener('prepunite_bookmarks_changed', handleBookmarksChanged);
  }, [user?.email]);

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
  const [formTestCase, setFormTestCase] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [formIsHidden, setFormIsHidden] = useState(false);

  // Admin Bulk JSON Import Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState('');
  const [bulkImportResult, setBulkImportResult] = useState<ImportReport | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 10;
  const listTopRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (listTopRef.current) {
      const yOffset = -24; // Slight padding above the filter bar
      const elementPosition = listTopRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY + yOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Cheatcode Modal State
  const [showCheatcodeModal, setShowCheatcodeModal] = useState(false);

  // Load questions from Supabase (live — admins and students always see the same data)
  const loadQuestions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('topic_questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('is_deleted', false)
        .order('question_number', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const mapped: TopicQuestionItem[] = data.map((q: any) => {
          const parsedStructured = typeof q.structured_explanation === 'string'
            ? (() => { try { return JSON.parse(q.structured_explanation); } catch { return undefined; } })()
            : (q.structured_explanation || undefined);

          const testCase = q.test_case || parsedStructured?.testCase || (q.sample_input || q.sample_output ? `Input:\n${q.sample_input || ''}\n\nOutput:\n${q.sample_output || ''}`.trim() : undefined);

          const rawCorrect = q.correct_answer;
          const resolvedLetter = typeof rawCorrect === 'number'
            ? (['A', 'B', 'C', 'D', 'E'][rawCorrect] || 'A')
            : (['0', '1', '2', '3', '4'].includes(String(rawCorrect))
                ? (['A', 'B', 'C', 'D', 'E'][Number(rawCorrect)] || 'A')
                : (String(rawCorrect || 'A').toUpperCase()));

          const rawOpts = (() => {
            try { return typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []); }
            catch { return []; }
          })();

          const normOpts = Array.isArray(rawOpts) ? rawOpts.map((opt: any) => ({
            ...opt,
            text: normalizeMathText(opt.text || String(opt))
          })) : [];

          const formulas = parsedStructured?.formulaUsed || q.structured_explanation?.formulaUsed || [];

          return {
            id: q.id,
            topicId: q.topic_id,
            questionNumber: q.question_number || 1,
            statement: normalizeMathText(q.statement || ''),
            options: normOpts,
            correctAnswer: resolvedLetter,
            explanation: normalizeMathText(q.explanation || ''),
            structuredExplanation: parsedStructured,
            testCase,
            sampleInput: q.sample_input,
            sampleOutput: q.sample_output,
            formulasUsed: Array.isArray(formulas) ? formulas.map((f: any) => normalizeMathText(String(f))) : [],
            difficulty: q.difficulty || 'MEDIUM',
            difficultyLevel: q.difficulty_level || 2,
            isHidden: q.is_hidden || false,
            createdAt: q.created_at,
          };
        });
        mapped.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0) || (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()));
        setQuestions(mapped);
        return;
      }
    } catch (err) {
      console.warn('[TopicQuestionsPage] Supabase load failed, using local dataStore:', err);
      // Fallback to localStorage only if Supabase request fails
      const list = dataStore.getTopicQuestions(topicId);
      setQuestions(list);
    }
  }, [topicId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSelectOption = async (q: TopicQuestionItem, optionKey: string) => {
    const isCorrect = optionKey.trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();

    // Trigger audio and haptic feedback
    if (isCorrect) {
      audioEffects.playSuccessChime();
      audioEffects.triggerHaptic('success');
    } else {
      audioEffects.playErrorBuzz();
      audioEffects.triggerHaptic('error');
    }

    // If incorrect, add to wrongPicks so it turns and stays RED until correct option is chosen
    if (!isCorrect) {
      setWrongPicks(prev => ({
        ...prev,
        [q.id]: Array.from(new Set([...(prev[q.id] || []), optionKey])),
      }));
    }

    // Persist attempt in progressService (saves to localStorage + syncs to Supabase)
    const { record } = await progressService.recordAttempt({
      questionId: q.id,
      topicId,
      categorySlug,
      difficulty: q.difficulty,
      selectedOption: optionKey,
      correctOption: q.correctAnswer,
      userEmail: user?.email,
    });

    setProgressRecords(prev => ({ ...prev, [q.id]: record }));
  };

  const handleToggleReveal = (qId: string) => {
    setRevealedExpl(prev => {
      const nextState = !prev[qId];
      if (nextState) {
        progressService.markRevealed(qId, user?.email);
      }
      return { ...prev, [qId]: nextState };
    });
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
    setFormTestCase('');
    setFormDifficulty('MEDIUM');
    setFormIsHidden(false);
    setShowModal(true);
  };

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());

  const toggleQuestionSelection = (qId: string) => {
    const nextSet = new Set(selectedQuestionIds);
    if (nextSet.has(qId)) nextSet.delete(qId);
    else nextSet.add(qId);
    setSelectedQuestionIds(nextSet);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const sortedQuestions = [...questions].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0) || (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()));
      const roleFilteredQuestions = isAdmin ? sortedQuestions : sortedQuestions.filter(q => !q.isHidden);
      const currentlyFiltered = roleFilteredQuestions.filter(q => {
        if (activeDifficulty === 'ALL') return true;
        const normDiff = q.difficultyLevel === 1 ? 'EASY' : q.difficultyLevel === 3 ? 'HARD' : (q.difficulty || 'MEDIUM').toUpperCase();
        return normDiff === activeDifficulty;
      });
      setSelectedQuestionIds(new Set(currentlyFiltered.map(q => q.id)));
    } else {
      setSelectedQuestionIds(new Set());
    }
  };

  const handleBulkDelete = async () => {
    if (selectedQuestionIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedQuestionIds.size} selected question(s)? This action cannot be undone.`)) return;

    try {
      const idsToDelete = Array.from(selectedQuestionIds);
      
      const { error } = await supabase
        .from('topic_questions')
        .delete()
        .in('id', idsToDelete);
        
      if (error) {
        console.error('[TopicQuestionsPage] Bulk delete failed:', error);
        alert(`Failed to bulk delete from Supabase: ${error.message}`);
      }
      
      idsToDelete.forEach(id => dataStore.deleteTopicQuestion(id));
      
      setSelectedQuestionIds(new Set());
      await loadQuestions();
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred during bulk deletion.');
    }
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
    setFormTestCase(q.testCase || '');
    setFormDifficulty(q.difficulty || 'MEDIUM');
    setFormIsHidden(!!q.isHidden);
    setShowModal(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStatement.trim()) return alert('Question statement is required.');

    const optionsList = [
      { key: 'A', text: normalizeMathText(formOptionA.trim()) || 'Option A' },
      { key: 'B', text: normalizeMathText(formOptionB.trim()) || 'Option B' },
      { key: 'C', text: normalizeMathText(formOptionC.trim()) || 'Option C' },
      { key: 'D', text: normalizeMathText(formOptionD.trim()) || 'Option D' },
    ];
    if (formOptionE.trim()) {
      optionsList.push({ key: 'E', text: normalizeMathText(formOptionE.trim()) });
    }

    const formulasArray = formFormulas
      .split('\n')
      .map(f => normalizeMathText(f.trim()))
      .filter(Boolean);

    try {
      const structuredExp: any = {
        formulaUsed: formulasArray,
        ...(editingQuestion?.structuredExplanation || {}),
      };
      if (formTestCase.trim()) {
        structuredExp.testCase = formTestCase.trim();
      }

      const letterToIdx: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
      const correctIdx = letterToIdx[formCorrect.toUpperCase()] ?? 0;

      const formattedStatement = normalizeMathText(formStatement);
      const formattedExplanation = normalizeMathText(formExplanation);

      if (editingQuestion) {
        const { error } = await supabase
          .from('topic_questions')
          .update({
            company_slug: 'general',
            statement: formattedStatement,
            options: JSON.stringify(optionsList),
            correct_answer: correctIdx,
            explanation: formattedExplanation,
            structured_explanation: JSON.stringify(structuredExp),
            test_case: formTestCase.trim() || null,
            difficulty: formDifficulty,
            is_hidden: formIsHidden,
          })
          .eq('id', editingQuestion.id);
        if (error) throw error;
      } else {
        const nextNum = questions.length > 0 ? Math.max(...questions.map(q => q.questionNumber || 0)) + 1 : 1;
        const { error } = await supabase
          .from('topic_questions')
          .insert({
            topic_id: topicId,
            company_slug: 'general',
            question_number: nextNum,
            statement: formattedStatement,
            options: JSON.stringify(optionsList),
            correct_answer: correctIdx,
            explanation: formattedExplanation,
            structured_explanation: JSON.stringify(structuredExp),
            test_case: formTestCase.trim() || null,
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
        const questionToDelete = questions.find(q => q.id === qId);
        if (!questionToDelete) return;

        const deletedNum = questionToDelete.questionNumber;

        const { error: deleteError } = await supabase
          .from('topic_questions')
          .delete()
          .eq('id', qId);
        if (deleteError) throw deleteError;

        if (typeof deletedNum === 'number') {
          const { data: subsequentQuestions, error: fetchError } = await supabase
            .from('topic_questions')
            .select('id, question_number')
            .eq('topic_id', topicId)
            .gt('question_number', deletedNum);

          if (fetchError) throw fetchError;

          if (subsequentQuestions && subsequentQuestions.length > 0) {
            const updatePromises = subsequentQuestions.map(sq => {
              const currentNum = sq.question_number || 0;
              return supabase
                .from('topic_questions')
                .update({ question_number: currentNum - 1 })
                .eq('id', sq.id);
            });
            await Promise.all(updatePromises);
          }
        }

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
      const parsed = safeJsonParse(bulkJsonInput);
      const rawItems: any[] = Array.isArray(parsed) ? parsed : [parsed];
      const items: any[] = [];

      for (const entry of rawItems) {
        if (entry.questions && Array.isArray(entry.questions)) {
          entry.questions.forEach((q: any) => {
            items.push({
              ...q,
              topic: q.topic || entry.topic,
              subtopic: q.subtopic || entry.subtopic,
              company_slug: q.company_slug || entry.company_slug || 'general',
              passage: entry.passage,
              passageTitle: entry.passageTitle,
            });
          });
        } else {
          items.push(entry);
        }
      }

      let maxExistingNum = questions.length > 0 ? Math.max(...questions.map(q => q.questionNumber || 0)) : 0;
      
      const uniqueFingerprints = new Set(
        questions.map(q => generateQuestionFingerprint({ statement: q.statement }, q))
      );

      const rows: any[] = [];
      let duplicatesCount = 0;

      for (const q of items) {
        const rawStatement = q.statement || q.question || q.title || 'Question';
        const formattedStatement = normalizeMathText(rawStatement);
        const fingerprint = generateQuestionFingerprint({ statement: formattedStatement }, q);

        if (uniqueFingerprints.has(fingerprint)) {
          duplicatesCount++;
          continue;
        }
        
        uniqueFingerprints.add(fingerprint);
        maxExistingNum++;

        const rawFormulas = q.formulasUsed || q.formulas || (typeof q.explanation === 'object' ? (q.explanation?.formulaUsed || q.explanation?.formulasUsed) : []);
        const structuredExp = typeof q.explanation === 'object' && q.explanation !== null
          ? { ...q.explanation }
          : { formulaUsed: Array.isArray(rawFormulas) ? rawFormulas : [] };

        if (q.passage) {
          structuredExp.passage = normalizeMathText(String(q.passage));
        }
        if (q.passageTitle) {
          structuredExp.passageTitle = normalizeMathText(String(q.passageTitle));
        }

        if (Array.isArray(structuredExp.formulaUsed)) {
          structuredExp.formulaUsed = structuredExp.formulaUsed.map((f: any) => normalizeMathText(String(f)));
        }
        if (Array.isArray(structuredExp.given)) {
          structuredExp.given = structuredExp.given.map((g: any) => normalizeMathText(String(g)));
        }
        if (Array.isArray(structuredExp.steps)) {
          structuredExp.steps = structuredExp.steps.map((s: any) => {
            if (typeof s === 'string') return normalizeMathText(s);
            if (s && typeof s === 'object') {
              const val = s.text || s.content || s.formula || s.title || '';
              const title = s.title && s.title !== 'Step' ? `${s.title}: ` : '';
              return normalizeMathText(`${title}${val}`);
            }
            return normalizeMathText(String(s));
          });
        }
        if (structuredExp.shortcut) {
          structuredExp.shortcut = normalizeMathText(String(structuredExp.shortcut));
        }
        if (structuredExp.finalAnswer) {
          structuredExp.finalAnswer = normalizeMathText(String(structuredExp.finalAnswer));
        }

        const expStr = typeof q.explanation === 'string'
          ? normalizeMathText(q.explanation)
          : (structuredExp.finalAnswer || (Array.isArray(structuredExp.steps) ? structuredExp.steps.map((s: any) => typeof s === 'string' ? s : `${s.title || 'Step'}: ${s.content || s.text || ''}`).join('\n') : ''));

        // Resolve to an INTEGER index (0=A, 1=B, 2=C, 3=D) to match the INT correct_answer DB column
        const letterToIdx: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
        let resolvedCorrectInt = 0;
        if (typeof q.correctOption === 'number') {
          resolvedCorrectInt = q.correctOption;
        } else if (typeof q.correctOption === 'string') {
          const asNum = parseInt(q.correctOption, 10);
          if (!isNaN(asNum)) {
            resolvedCorrectInt = asNum;
          } else {
            resolvedCorrectInt = letterToIdx[q.correctOption.toUpperCase()] ?? 0;
          }
        } else {
          const fallback = q.correct_answer || q.correctAnswer || q.answer || '0';
          const asNum = parseInt(String(fallback), 10);
          resolvedCorrectInt = !isNaN(asNum) ? asNum : (letterToIdx[String(fallback).toUpperCase()] ?? 0);
        }

        rows.push({
          topic_id: topicId,
          company_slug: q.company_slug || q.companySlug || q.company || 'general',
          question_number: maxExistingNum,
          statement: formattedStatement,
          options: JSON.stringify(Array.isArray(q.options) ? q.options.map((opt: any, oIdx: number) => {
            if (typeof opt === 'string') return { key: ['A', 'B', 'C', 'D', 'E'][oIdx] || `${oIdx + 1}`, text: normalizeMathText(opt) };
            return { key: opt.id || opt.key || ['A', 'B', 'C', 'D', 'E'][oIdx], text: normalizeMathText(opt.text || String(opt)) };
          }) : [
            { key: 'A', text: normalizeMathText(q.optionA || q.a || 'Option A') },
            { key: 'B', text: normalizeMathText(q.optionB || q.b || 'Option B') },
            { key: 'C', text: normalizeMathText(q.optionC || q.c || 'Option C') },
            { key: 'D', text: normalizeMathText(q.optionD || q.d || 'Option D') },
          ]),
          correct_answer: resolvedCorrectInt,
          explanation: expStr,
          difficulty: (q.difficulty || 'MEDIUM').toUpperCase(),
          difficulty_level: q.difficulty?.toUpperCase() === 'EASY' ? 1 : q.difficulty?.toUpperCase() === 'HARD' ? 3 : 2,
          is_hidden: false,
          is_deleted: false,
          structured_explanation: JSON.stringify(structuredExp),
        });
      }

      if (rows.length > 0) {
        const { error } = await supabase.from('topic_questions').insert(rows);
        if (error) throw error;
      }

      setBulkImportResult({ success: rows.length, duplicates: duplicatesCount, invalid: 0, errors: [] });
      if (rows.length > 0) {
        loadQuestions();
      }
    } catch (err: any) {
      setBulkImportResult({ success: 0, duplicates: 0, invalid: 1, errors: [{ itemIndex: 0, reason: `Supabase bulk import failed: ${err.message || err}` }] });
    }
  };

  // Permanent LeetCode-style Question Number Assignment (Master topic list order sorted numerically)
  const sortedQuestions = [...questions].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0) || (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()));
  const roleFilteredQuestions = (isAdmin ? sortedQuestions : sortedQuestions.filter(q => !q.isHidden)).map((q, index) => ({
    ...q,
    permanentNumber: q.questionNumber || (index + 1),
  }));
  
  // Topic-level completion statistics
  const topicTotalQuestions = roleFilteredQuestions.length;
  const topicSolvedQuestions = roleFilteredQuestions.filter(q => progressRecords[q.id]?.isSolved).length;
  const topicNeedsRetryQuestions = roleFilteredQuestions.filter(q => !progressRecords[q.id]?.isSolved && (progressRecords[q.id]?.wrongAttempts ?? 0) > 0).length;
  const topicPercentage = topicTotalQuestions > 0 ? Math.round((topicSolvedQuestions / topicTotalQuestions) * 100) : 0;

  const filteredQuestions = roleFilteredQuestions.filter(q => {
    // 1. Difficulty filter
    if (activeDifficulty !== 'ALL') {
      const normDiff = q.difficultyLevel === 1 ? 'EASY' : q.difficultyLevel === 3 ? 'HARD' : (q.difficulty || 'MEDIUM').toUpperCase();
      if (normDiff !== activeDifficulty) return false;
    }

    // 2. Status filter
    const prog = progressRecords[q.id];
    if (activeStatusFilter === 'SOLVED') {
      return prog?.isSolved;
    }
    if (activeStatusFilter === 'UNSOLVED') {
      return !prog?.isSolved;
    }
    if (activeStatusFilter === 'RETRY') {
      return !prog?.isSolved && (prog?.wrongAttempts ?? 0) > 0;
    }
    if (activeStatusFilter === 'BOOKMARKED') {
      return savedQuestionIds.includes(q.id);
    }

    return true;
  });

  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);

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
          <span className="inline-flex items-center gap-1 text-[9px] font-display font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Easy</span>
          </span>
        );
      case 'HARD':
      case '3':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-display font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Hard</span>
          </span>
        );
      case 'MEDIUM':
      case '2':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-display font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
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
          className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#FD4A32] dark:text-[#FD4A32] hover:underline"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Topic Directory</span>
        </Link>

        {isAdmin ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-display font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin Editor Mode</span>
          </span>
        ) : (
          <span className="text-xs text-[#868E96] dark:text-[#555555]">
            Topic Practice Mode
          </span>
        )}
      </div>

      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#121417] dark:text-[#FFFFFF] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-display font-bold text-[#FD4A32] dark:text-[#FD4A32] uppercase tracking-wider block">
              Quantitative Aptitude • {topicName}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              {topicName} Questions
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-sans mt-1">
              {foundTopic?.description || 'Filter questions by difficulty, test your answer with MCQ options, or view detailed step-by-step solutions.'}
            </p>

            {/* Topic Progress Bar */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-44 h-2 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${topicPercentage}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {topicSolvedQuestions} / {topicTotalQuestions} Solved ({topicPercentage}%)
              </span>
            </div>
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
                  className="px-3 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 rounded-md text-xs font-display font-bold transition-all border border-purple-500/30 flex items-center gap-1.5"
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>Bulk JSON</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </>
            )}

            {/* Audio Feedback Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                isMuted
                  ? 'border-[#E9ECEF] dark:border-[#242424] text-[#868E96] hover:text-[#121417] dark:hover:text-white'
                  : 'border-[#FD4A32]/30 bg-[#FD4A32]/10 text-[#FD4A32]'
              }`}
              title={isMuted ? 'Sound effects muted (Click to enable)' : 'Sound effects enabled (Click to mute)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Share Topic with Batch */}
            <button
              onClick={() => setShowShareModal(true)}
              className="px-2.5 py-1 flex items-center gap-1.5 rounded-md bg-[#F8F9FA] dark:bg-[#1A1A1A] hover:bg-[#E9ECEF] dark:hover:bg-[#252525] text-[#121417] dark:text-white text-xs font-display font-bold border border-[#E9ECEF] dark:border-[#242424] transition-all cursor-pointer shadow-2xs"
              title="Share this topic with your college batch"
            >
              <Share2 className="w-3.5 h-3.5 text-[#121417] dark:text-[#FD4A32]" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCheatcodeModal(true)}
              className="px-2.5 py-1 flex items-center gap-1.5 rounded-md bg-[#FD4A32]/10 hover:bg-[#FD4A32]/20 text-[#FD4A32] dark:text-[#FD4A32] text-xs font-display font-bold border border-[#FD4A32]/20 transition-all cursor-pointer shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cheatcode</span>
            </button>
            
            <div className="px-2.5 py-1 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] text-xs font-display font-bold border border-[#FD4A32]/20">
              {filteredQuestions.length} Problems
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 FILTER BAR & CENTERED PAGINATION */}
      <div className="p-3.5 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-3">
        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center flex-wrap gap-4">
            {/* Difficulty Filter Group */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#121417] dark:text-[#FD4A32]" />
                <span>Difficulty:</span>
              </span>
              <div className="inline-flex items-center p-0.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
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
                      onClick={() => {
                        setActiveDifficulty(item.id);
                        handlePageChange(1);
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                          : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter Group */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
                Status:
              </span>
              <div className="inline-flex items-center p-0.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex-wrap">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'UNSOLVED', label: 'Unsolved' },
                  { id: 'SOLVED', label: `Solved (${topicSolvedQuestions})` },
                  ...(topicNeedsRetryQuestions > 0 ? [{ id: 'RETRY', label: `Needs Retry (${topicNeedsRetryQuestions})` }] : []),
                  { id: 'BOOKMARKED', label: 'Bookmarked' },
                ].map((item) => {
                  const isActive = activeStatusFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveStatusFilter(item.id as any);
                        handlePageChange(1);
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#FD4A32] text-white shadow-xs'
                          : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Admin Bulk Actions */}
          {isAdmin && filteredQuestions.length > 0 && (
            <div className="flex items-center gap-3 bg-[#F8F9FA] dark:bg-[#0C0C0C] px-3 py-1.5 rounded-md border border-[#E9ECEF] dark:border-[#242424]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedQuestionIds.size > 0 && selectedQuestionIds.size === filteredQuestions.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E9ECEF] dark:border-[#242424] text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-xs font-display font-bold text-[#121417] dark:text-[#FFFFFF]">
                  Select All
                </span>
              </label>

              {selectedQuestionIds.size > 0 && (
                <>
                  <div className="w-px h-4 bg-[#E9ECEF] dark:bg-[#242424]"></div>
                  <span className="text-xs font-display font-bold text-[#868E96] dark:text-[#555555]">
                    {selectedQuestionIds.size} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded text-xs font-display font-bold transition-colors flex items-center gap-1 border border-rose-500/20 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Selected</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* 📄 CENTERED PAGINATION IN THE MIDDLE */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-2.5 border-t border-[#E9ECEF] dark:border-[#242424]">
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-display font-bold border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#868E96] dark:text-[#888888] hover:text-[#121417] dark:hover:text-[#FFFFFF] hover:border-[#121417] dark:hover:border-[#555555] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="px-3.5 py-1.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] font-display font-bold text-xs text-[#121417] dark:text-[#FFFFFF]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-display font-bold border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#868E96] dark:text-[#888888] hover:text-[#121417] dark:hover:text-[#FFFFFF] hover:border-[#121417] dark:hover:border-[#555555] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
                aria-label="Next Page"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QUESTIONS LIST */}
      <div className="space-y-4" ref={listTopRef}>
        {filteredQuestions.length === 0 ? (
          <div className="p-10 text-center rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414]">
            <p className="text-sm font-semibold text-[#868E96] dark:text-[#555555]">
              No {activeDifficulty !== 'ALL' ? activeDifficulty.toLowerCase() : ''} questions found for {topicName}.
            </p>
            {isAdmin && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-3 py-1.5 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-md text-xs font-display font-bold uppercase tracking-wider"
                >
                  Bulk Import JSON
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-1.5 bg-[#FD4A32] text-black rounded-md text-xs font-display font-bold uppercase tracking-wider"
                >
                  Add Question
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredQuestions
            .slice((currentPage - 1) * QUESTIONS_PER_PAGE, currentPage * QUESTIONS_PER_PAGE)
            .map((q, idx, arr) => {
            const prog = progressRecords[q.id];
            const isSolved = prog?.isSolved ?? false;
            const isExplVisible = !!revealedExpl[q.id] || (prog?.isRevealed ?? false);
            const isSaved = savedQuestionIds.includes(q.id);
            const se = q.structuredExplanation;
            const wrongOptions = wrongPicks[q.id] || [];
            
            // Passage Grouping Logic
            const currentPassage = se?.passage || '';
            const prevPassage = arr[idx - 1]?.structuredExplanation?.passage || '';
            const showPassageBlock = currentPassage && currentPassage !== prevPassage;

            return (
              <div key={q.id} className="space-y-4">
                {showPassageBlock && (
                  <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm mt-8 first:mt-0">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-display font-bold text-lg text-blue-900 dark:text-blue-100">
                        {se?.passageTitle || 'Reading Comprehension Passage'}
                      </h3>
                    </div>
                    <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-serif">
                      {currentPassage}
                    </div>
                  </div>
                )}
                
                <div
                  className={`p-5 rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md space-y-3.5 relative ${
                    q.isHidden
                      ? 'opacity-70 border-dashed border-amber-500/50 bg-amber-500/5'
                      : 'bg-white dark:bg-[#141414] border-[#D1D5DB] dark:border-[#3A3A3A] hover:border-[#9CA3AF] dark:hover:border-[#555555] text-[#121417] dark:text-[#FFFFFF]'
                  } ${selectedQuestionIds.has(q.id) ? 'ring-2 ring-purple-500/50 border-purple-500 shadow-md' : ''}`}
                >
                {/* Header Row: Question # Badge + Difficulty Badge + Completion Status + Admin Actions */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-[#E9ECEF] dark:border-[#242424]">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isAdmin && (
                      <input
                        type="checkbox"
                        checked={selectedQuestionIds.has(q.id)}
                        onChange={() => toggleQuestionSelection(q.id)}
                        className="w-4 h-4 mr-1 rounded border-[#E9ECEF] dark:border-[#242424] text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    )}

                    {/* Question Number Badge (Permanent ID) */}
                    <span className="px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] font-display font-bold text-[10px] tracking-tight border border-[#FD4A32]/20 dark:border-[#FD4A32]/30">
                      Question #{q.permanentNumber}
                    </span>

                    {/* Color-coded Difficulty Badge */}
                    {getDifficultyBadge(q.difficulty, q.difficultyLevel)}

                    {/* LeetCode-style Completion Status Badge */}
                    {isSolved ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-display font-extrabold text-[10px] tracking-wider border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Solved</span>
                      </span>
                    ) : (prog?.wrongAttempts ?? 0) > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 font-display font-bold text-[10px] tracking-wider border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-500" />
                        <span>Needs Retry</span>
                      </span>
                    ) : null}

                    {q.isHidden && (
                      <span className="text-[9px] font-display font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </span>
                    )}
                  </div>

                  {/* Admin Toolbar Controls */}
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleVisibility(q.id)}
                        className={`p-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                          q.isHidden
                            ? 'bg-amber-500/20 text-amber-600 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                        }`}
                        title={q.isHidden ? 'Publish Question' : 'Hide Question'}
                      >
                        {q.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1 rounded bg-blue-500/20 text-blue-600 border border-blue-500/40 hover:bg-blue-500/30 transition-all"
                        title="Edit Question"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 rounded bg-rose-500/20 text-rose-600 border border-rose-500/40 hover:bg-rose-500/30 transition-all"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Question Statement */}
                <div className="pt-0.5">
                  <QuestionRichContent
                    content={q.statement}
                    className="text-xs font-semibold text-[#121417] dark:text-[#FFFFFF] font-sans"
                  />
                </div>

                {/* Plain Multiline Test Case / Input-Output Box */}
                {q.testCase && (
                  <pre className="test-case text-xs p-2 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF]">
                    {q.testCase}
                  </pre>
                )}

                {/* MCQ Options List (Active Learning Attempt Flow) */}
                <div className="space-y-1.5 pl-1">
                  {q.options.map((opt) => {
                    const optId = opt.id || opt.key || 'A';
                    const isCorrect = optId.trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();
                    const wasWrong = wrongOptions.includes(optId) || (!isSolved && prog?.selectedOption === optId && !isCorrect);

                    let optionStyle = 'bg-[#F8F9FA] dark:bg-[#0C0C0C] border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] hover:border-[#121417] dark:hover:border-[#444444]';

                    if (isSolved && isCorrect) {
                      // Correctly solved: Green badge!
                      optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs';
                    } else if (wasWrong) {
                      // Wrong pick: Stays RED until correct option is chosen!
                      optionStyle = 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                    } else if (isExplVisible && isCorrect) {
                      // Revealed via "Show Answer" button
                      optionStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-semibold';
                    }

                    return (
                      <button
                        key={optId}
                        onClick={() => handleSelectOption(q, optId)}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-md border text-xs text-left transition-all ${optionStyle}`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center font-display font-bold text-[10px] shrink-0 ${
                          (isSolved && isCorrect) || (isExplVisible && isCorrect)
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : wasWrong
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555]'
                        }`}>
                          {optId}
                        </div>
                        <QuestionRichContent content={opt.text} isOption={true} className="flex-1 font-sans" />

                        {((isSolved && isCorrect) || (isExplVisible && isCorrect)) && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                        {wasWrong && !isSolved && (
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ACTION TOOLBAR */}
                <div className="pt-2.5 border-t border-[#E9ECEF] dark:border-[#242424] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleReveal(q.id)}
                      className={`px-2.5 py-1 rounded-md border text-xs font-display font-bold transition-all flex items-center gap-1.5 ${
                        isExplVisible
                          ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white'
                          : 'bg-[#F8F9FA] dark:bg-[#1C1C1C] border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                      }`}
                      title={isExplVisible ? 'Hide Solution' : 'Show Answer & Detailed Solution'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase tracking-wider">
                        {isExplVisible ? 'Hide Solution' : 'Show Answer & Solution'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={`p-1.5 rounded-md border transition-all ${
                        isSaved
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                          : 'bg-[#F8F9FA] dark:bg-[#1C1C1C] border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Save Question to Profile'}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => setReportingQuestion(q)}
                      className="p-1.5 rounded-md border bg-[#F8F9FA] dark:bg-[#1C1C1C] border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555] hover:text-rose-500 transition-colors cursor-pointer"
                      title="Report Question Issue"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </div>

                  {isSolved ? (
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correct! Question Solved</span>
                    </span>
                  ) : (prog?.wrongAttempts ?? 0) > 0 ? (
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Incorrect option. Re-calculate and try again!</span>
                    </span>
                  ) : null}
                </div>

                {/* STEP-BY-STEP EXPLANATION ACCORDION (Enhanced for structured JSON) */}
                {isExplVisible && (
                  <div className="p-4 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-display font-bold text-[#FD4A32] dark:text-[#FD4A32]">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Correct Answer: Option ({q.correctAnswer})</span>
                    </div>

                    {se ? (
                      /* Rich Structured Explanation View */
                      <div className="space-y-2.5 text-xs text-[#121417] dark:text-[#FFFFFF]">
                        {/* Given Block */}
                        {se.given && se.given.length > 0 && (
                          <div className="space-y-0.5">
                            <span className="font-display font-bold text-[9px] uppercase text-[#868E96] dark:text-[#555555] tracking-wider block">
                              Given Information:
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5 font-sans">
                              {se.given.map((g, idx) => (
                                <li key={idx}>{g}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Step-by-Step Derivation */}
                        {se.steps && se.steps.length > 0 && (
                          <div className="space-y-1">
                            <span className="font-display font-bold text-[9px] uppercase text-[#868E96] dark:text-[#555555] tracking-wider block">
                              Derivation Steps:
                            </span>
                            <div className="space-y-1 font-mono text-xs p-2.5 bg-white dark:bg-[#141414] rounded-md text-[#121417] dark:text-[#FFFFFF] border border-[#E9ECEF] dark:border-[#242424]">
                              {se.steps.map((st, sIdx) => {
                                const stepText = typeof st === 'string' ? st : (st.text || (st as any).content || st.formula || st.title || '');
                                return (
                                  <div key={sIdx} className="leading-relaxed flex items-start gap-2">
                                    <span className="text-[#FD4A32] dark:text-[#FD4A32] font-bold select-none">•</span>
                                    <QuestionRichContent content={stepText} className="flex-1" />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Quick Shortcut / Trick Box */}
                        {se.shortcut && (
                          <div className="p-2.5 rounded-md bg-[#F1F3F5] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] space-y-0.5">
                            <span className="font-display font-bold text-[#FD4A32] dark:text-[#FD4A32] flex items-center gap-1 text-[10px] uppercase tracking-wider">
                              ⚡ Quick Shortcut:
                            </span>
                            <div className="text-[#121417] dark:text-[#FFFFFF] font-medium text-xs leading-relaxed font-sans">
                              <QuestionRichContent content={se.shortcut} />
                            </div>
                          </div>
                        )}

                        {/* Final Answer */}
                        {se.finalAnswer && (
                          <div className="pt-2 border-t border-[#E9ECEF] dark:border-[#242424] flex items-center gap-2">
                            <span className="font-display font-bold text-xs text-[#FD4A32] dark:text-[#FD4A32]">
                              Final Answer:
                            </span>
                            <span className="font-bold bg-[#FD4A32]/15 text-[#FD4A32] dark:text-[#FD4A32] px-2 py-0.5 rounded text-xs font-mono">
                              {se.finalAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs leading-relaxed text-[#121417] dark:text-[#FFFFFF] font-sans">
                          <QuestionRichContent content={q.explanation || 'No step-by-step explanation recorded for this question.'} />
                        </div>
                        {q.formulasUsed && q.formulasUsed.length > 0 && (
                          <div className="pt-2 border-t border-[#E9ECEF] dark:border-[#242424] space-y-1">
                            <span className="text-[9px] font-display font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider block">
                              Formulas Used:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {q.formulasUsed.map((f, i) => (
                                <span key={i} className="text-[10px] font-mono font-bold bg-white dark:bg-[#141414] px-2 py-0.5 rounded border border-[#E9ECEF] dark:border-[#242424] text-[#FD4A32] dark:text-[#FD4A32]">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              </div>
            );
          })
        )}
      </div>

      {/* 📄 PAGINATION CONTROLS */}
      {filteredQuestions.length > QUESTIONS_PER_PAGE && (
        <div className="flex justify-center items-center mt-10 mb-12 gap-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF] hover:border-[#121417] dark:hover:border-[#555555] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1.5 px-2">
            {Array.from({ length: Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE) }).map((_, i) => {
              const page = i + 1;
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`flex items-center justify-center min-w-[36px] h-[36px] px-2 rounded-full font-display font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-[#FD4A32] text-white shadow-md shadow-[#FD4A32]/20 scale-105'
                      : 'bg-transparent text-[#868E96] dark:text-[#888888] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(Math.min(Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE), currentPage + 1))}
            disabled={currentPage === Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE)}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF] hover:border-[#121417] dark:hover:border-[#555555] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 📥 ADMIN BULK JSON IMPORT MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1f22] border border-[#E9ECEF] dark:border-[#2b2d31] rounded-[24px] max-w-3xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9ECEF] dark:border-[#2b2d31]">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <FileJson className="w-5 h-5" />
                <h3 className="font-display text-lg font-extrabold text-[#121417] dark:text-[#e3e3e3]">
                  Bulk Question JSON Parser
                </h3>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-[#747878] hover:text-[#121417] dark:hover:text-[#e3e3e3]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessBulkImport} className="space-y-4">
              <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
                Paste your JSON array of questions below. The parser automatically extracts topics, subtopics, MCQ options, correct answers (`correctOption`), difficulty, and structured step-by-step explanations!
              </p>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121417] dark:text-[#e3e3e3]">
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
                <div className="p-4 rounded-xl border text-xs space-y-3 bg-[#F8F9FA] dark:bg-[#141517] border-[#E9ECEF] dark:border-[#383a40]">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#E9ECEF] dark:border-[#2b2d31]">
                    <span className="font-extrabold text-[#121417] dark:text-[#e3e3e3] text-xs">
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E9ECEF] dark:border-[#2b2d31]">
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
          <div className="bg-white dark:bg-[#1e1f22] border border-[#E9ECEF] dark:border-[#2b2d31] rounded-[24px] max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9ECEF] dark:border-[#2b2d31]">
              <div className="flex items-center gap-2 text-[#FD4A32] dark:text-[#FD4A32]">
                <Edit2 className="w-5 h-5" />
                <h3 className="font-display text-lg font-extrabold text-[#121417] dark:text-[#e3e3e3]">
                  {editingQuestion ? 'Edit Topic Question' : `Add Question to ${topicName}`}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#747878] hover:text-[#121417] dark:hover:text-[#e3e3e3]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              {/* Question Statement */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121417] dark:text-[#e3e3e3]">
                  Question Statement *
                </label>
                <textarea
                  rows={3}
                  value={formStatement}
                  onChange={(e) => setFormStatement(e.target.value)}
                  placeholder="Enter the complete question problem statement..."
                  className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-3 text-xs text-[#121417] dark:text-[#e3e3e3] focus:outline-none focus:border-[#FD4A32]"
                  required
                />
              </div>

              {/* Test Cases / Sample Input & Output (Plain multiline text) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121417] dark:text-[#e3e3e3] flex items-center justify-between">
                  <span>Test Case / Input-Output (Plain Multiline Text)</span>
                  <span className="text-[10px] text-[#747878] font-normal">Preserves exact spacing & line breaks</span>
                </label>
                <textarea
                  rows={5}
                  value={formTestCase}
                  onChange={(e) => setFormTestCase(e.target.value)}
                  placeholder={`Input:\n4\nA B 500 100\nC D 200 120\nA B 500 150\nA B 700 160\n\nOutput:\n0 2`}
                  className="w-full font-mono bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-3 text-xs text-[#121417] dark:text-[#e3e3e3] focus:outline-none focus:border-[#FD4A32] whitespace-pre-wrap"
                />
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121417] dark:text-[#e3e3e3]">
                  Question Difficulty Level
                </label>
                <select
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')}
                  className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#121417] dark:text-[#e3e3e3]"
                >
                  <option value="EASY">🟢 Easy (Basic concept check)</option>
                  <option value="MEDIUM">🟡 Medium (Standard problem complexity)</option>
                  <option value="HARD">🔴 Hard (Advanced multi-step derivation)</option>
                </select>
              </div>

              {/* MCQ Options Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#121417] dark:text-[#e3e3e3]">
                  MCQ Options
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs w-5 text-[#FD4A32] dark:text-[#FD4A32]">A.</span>
                    <input
                      type="text"
                      value={formOptionA}
                      onChange={(e) => setFormOptionA(e.target.value)}
                      placeholder="Option A text..."
                      className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#121417] dark:text-[#e3e3e3]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs w-5 text-[#FD4A32] dark:text-[#FD4A32]">B.</span>
                    <input
                      type="text"
                      value={formOptionB}
                      onChange={(e) => setFormOptionB(e.target.value)}
                      placeholder="Option B text..."
                      className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#121417] dark:text-[#e3e3e3]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs w-5 text-[#FD4A32] dark:text-[#FD4A32]">C.</span>
                    <input
                      type="text"
                      value={formOptionC}
                      onChange={(e) => setFormOptionC(e.target.value)}
                      placeholder="Option C text..."
                      className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#121417] dark:text-[#e3e3e3]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs w-5 text-[#FD4A32] dark:text-[#FD4A32]">D.</span>
                    <input
                      type="text"
                      value={formOptionD}
                      onChange={(e) => setFormOptionD(e.target.value)}
                      placeholder="Option D text..."
                      className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#121417] dark:text-[#e3e3e3]"
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="font-black text-xs w-5 text-[#FD4A32] dark:text-[#FD4A32]">E.</span>
                    <input
                      type="text"
                      value={formOptionE}
                      onChange={(e) => setFormOptionE(e.target.value)}
                      placeholder="Option E text (Optional)..."
                      className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-lg p-2 text-xs text-[#121417] dark:text-[#e3e3e3]"
                    />
                  </div>
                </div>
              </div>

              {/* Correct Answer Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121417] dark:text-[#e3e3e3]">
                  Correct Answer Key
                </label>
                <select
                  value={formCorrect}
                  onChange={(e) => setFormCorrect(e.target.value)}
                  className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#121417] dark:text-[#e3e3e3]"
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
                <label className="text-xs font-bold text-[#121417] dark:text-[#e3e3e3]">
                  Step-by-Step Solution & Explanation
                </label>
                <textarea
                  rows={3}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Enter step-by-step solution derivation..."
                  className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-3 text-xs text-[#121417] dark:text-[#e3e3e3] focus:outline-none focus:border-[#FD4A32]"
                />
              </div>

              {/* Formulas Used (One per line) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121417] dark:text-[#e3e3e3]">
                  Formulas Used (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formFormulas}
                  onChange={(e) => setFormFormulas(e.target.value)}
                  placeholder="tan(θ) = Opposite / Adjacent&#10;tan(30°) = 1/√3"
                  className="w-full bg-[#F8F9FA] dark:bg-[#141517] border border-[#E9ECEF] dark:border-[#383a40] rounded-xl p-3 text-xs font-mono text-[#FD4A32] dark:text-[#FD4A32] focus:outline-none"
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
                <label htmlFor="formIsHidden" className="text-xs font-bold text-[#121417] dark:text-[#e3e3e3] cursor-pointer">
                  Hide question from students (Keep as Admin draft)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E9ECEF] dark:border-[#2b2d31]">
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

      {/* 📚 TOPIC CHEATCODE MODAL WITH PDF EXPORT */}
      {showCheatcodeModal && (
        <TopicCheatcodeModal
          isOpen={showCheatcodeModal}
          onClose={() => setShowCheatcodeModal(false)}
          topicId={topicId || ''}
          topicName={topicName}
          categoryTitle={categorySlug ? categorySlug.replace(/-/g, ' ') : 'Aptitude'}
          fallbackFormulas={foundTopic?.formulas || []}
        />
      )}

      {/* Report Question Modal */}
      {reportingQuestion && (
        <ReportQuestionModal
          isOpen={!!reportingQuestion}
          onClose={() => setReportingQuestion(null)}
          questionId={reportingQuestion.id}
          questionStatement={reportingQuestion.statement}
          companySlug={(reportingQuestion as any).companySlug}
          topicId={reportingQuestion.topicId}
        />
      )}

      {/* Share Topic Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={`${topicName} Placement Aptitude Practice & Shortcuts on PrepUnite`}
      />
    </div>
  );
}
