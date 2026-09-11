import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MessageSquareQuote,
  Database,
  Layers,
  Users,
  Search,
  CheckCircle2,
  Circle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Award,
  Table,
  Cpu,
  Network,
  UserCheck,
  HelpCircle,
  Zap,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Upload,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { interviewService } from '@/services/interview.service';
import InterviewBulkImportModal from '@/components/interview/InterviewBulkImportModal';
import TopicCheatcodeModal from '@/components/TopicCheatcodeModal';
import type { InterviewCategory, InterviewTopic, InterviewQuestion } from '@/types/interview';

const TOPIC_ICON_MAP: Record<string, React.ComponentType<any>> = {
  Database,
  Table,
  Layers,
  Cpu,
  Network,
  UserCheck,
  Award,
  Users,
  HelpCircle,
  Zap,
  ShieldCheck,
  BookOpen,
  MessageSquareQuote,
};

export default function InterviewPrepPage() {
  const { isAdmin, user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const topicParam = searchParams.get('topic');

  const activeCategory: InterviewCategory = useMemo(() => {
    if (categoryParam === 'hr') return 'HR_BEHAVIORAL';
    if (categoryParam === 'project') return 'PROJECT_DEFENSE';
    return 'CORE_CS';
  }, [categoryParam]);

  const handleCategoryChange = (cat: InterviewCategory) => {
    let paramVal = 'core-cs';
    if (cat === 'HR_BEHAVIORAL') paramVal = 'hr';
    if (cat === 'PROJECT_DEFENSE') paramVal = 'project';
    setSearchParams({ category: paramVal });
    setSelectedCluster('All Topics');
    setSearchQuery('');
    setSelectedStatus('ALL');
  };

  const [selectedCluster, setSelectedCluster] = useState<string>('All Topics');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'MASTERED' | 'UNMASTERED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({});

  // Admin Topic & Question Editor State
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Partial<InterviewTopic> | null>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<InterviewQuestion> | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Admin Multi-Select State
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    setSelectedQuestionIds(new Set());
  }, [topicParam, activeCategory]);

  // Pagination State matching Aptitude & TechnicalHub
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 10;
  const listTopRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (listTopRef.current) {
      const yOffset = -24;
      const elementPosition = listTopRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY + yOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Reset pagination on filter or topic change
  useEffect(() => {
    setCurrentPage(1);
  }, [topicParam, activeCategory, selectedStatus, selectedCluster, searchQuery]);

  // Cheatcode / Tips Modal State
  const [showCheatcodeModal, setShowCheatcodeModal] = useState(false);

  // Query All Questions (Supabase-first)
  const { data: allQuestions = [], refetch: refetchQuestions } = useQuery({
    queryKey: ['interview-prep-questions'],
    queryFn: () => interviewService.getAllQuestions(),
  });

  // Query Topics for activeCategory (Supabase-first)
  const { data: topics = [], refetch: refetchTopics } = useQuery<InterviewTopic[]>({
    queryKey: ['interview-prep-topics', activeCategory],
    queryFn: () => interviewService.getTopicsForCategory(activeCategory),
  });

  // Query Live Topic Question Counts
  const { data: liveCountMap = {} } = useQuery<Record<string, number>>({
    queryKey: ['interview-topic-counts', activeCategory],
    queryFn: () => interviewService.getTopicCountsMap(activeCategory),
  });

  // Filter topics (Admins see all, students see non-hidden)
  const currentCategoryTopics = useMemo(() => {
    return topics.filter(t => isAdmin || !t.is_hidden);
  }, [topics, isAdmin]);

  // Active topic object if topicParam is present
  const activeTopic = useMemo(() => {
    if (!topicParam) return null;
    return topics.find(t => t.id === topicParam) || null;
  }, [topicParam, topics]);

  // Distinct clusters for directory filter pills
  const clusters = useMemo(() => {
    const raw = Array.from(new Set(currentCategoryTopics.map(t => t.cluster)));
    return ['All Topics', ...raw];
  }, [currentCategoryTopics]);

  // Synchronize cluster filter when category changes
  useEffect(() => {
    if (!clusters.includes(selectedCluster)) {
      setSelectedCluster('All Topics');
    }
  }, [clusters, selectedCluster]);

  // Overall analytics stats
  const coreCsQuestions = useMemo(() => allQuestions.filter(q => q.category === 'CORE_CS'), [allQuestions]);
  const hrQuestions = useMemo(() => allQuestions.filter(q => q.category === 'HR_BEHAVIORAL'), [allQuestions]);
  const projectQuestions = useMemo(() => allQuestions.filter(q => q.category === 'PROJECT_DEFENSE'), [allQuestions]);

  const coreCsMastered = useMemo(() => coreCsQuestions.filter(q => q.mastered).length, [coreCsQuestions]);
  const hrMastered = useMemo(() => hrQuestions.filter(q => q.mastered).length, [hrQuestions]);
  const projectMastered = useMemo(() => projectQuestions.filter(q => q.mastered).length, [projectQuestions]);

  const masteredCount = useMemo(() => allQuestions.filter(q => q.mastered).length, [allQuestions]);
  const totalQuestions = allQuestions.length;

  // Donut SVG dimensions matching Aptitude
  const radius = 28;
  const strokeWidth = 4.5;
  const circumference = 2 * Math.PI * radius;
  const portion = totalQuestions > 0 ? (masteredCount / totalQuestions) * circumference : 0;
  const dashOffset = circumference - portion;

  const coreCsPct = coreCsQuestions.length > 0 ? Math.round((coreCsMastered / coreCsQuestions.length) * 100) : 0;
  const hrPct = hrQuestions.length > 0 ? Math.round((hrMastered / hrQuestions.length) * 100) : 0;
  const projPct = projectQuestions.length > 0 ? Math.round((projectMastered / projectQuestions.length) * 100) : 0;

  // Filtered topics for directory view
  const filteredTopics = useMemo(() => {
    return currentCategoryTopics.filter(topic => {
      const matchCluster = selectedCluster === 'All Topics' || topic.cluster === selectedCluster;
      const matchSearch =
        !searchQuery.trim() ||
        (topic.title || topic.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.cluster.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCluster && matchSearch;
    });
  }, [currentCategoryTopics, selectedCluster, searchQuery]);

  // Active topic questions
  const activeTopicQuestions = useMemo(() => {
    if (!activeTopic) return [];
    return allQuestions.filter(q => q.topicId === activeTopic.id);
  }, [activeTopic, allQuestions]);

  const activeTopicMasteredCount = useMemo(() => {
    return activeTopicQuestions.filter(q => q.mastered).length;
  }, [activeTopicQuestions]);

  const activeTopicPercentage =
    activeTopicQuestions.length > 0
      ? Math.round((activeTopicMasteredCount / activeTopicQuestions.length) * 100)
      : 0;

  // Filtered active questions (search + status)
  const filteredActiveQuestions = useMemo(() => {
    return activeTopicQuestions.filter(q => {
      if (!isAdmin && q.is_hidden) return false;
      const matchStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'MASTERED' && q.mastered) ||
        (selectedStatus === 'UNMASTERED' && !q.mastered);

      const matchSearch =
        !searchQuery.trim() ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.bulletPoints?.some(bp => bp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        q.companyTags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchStatus && matchSearch;
    });
  }, [activeTopicQuestions, selectedStatus, searchQuery, isAdmin]);

  const totalPages = Math.ceil(filteredActiveQuestions.length / QUESTIONS_PER_PAGE);

  // Hydrate user progress from Supabase on mount / when user changes
  useEffect(() => {
    if (user?.email && user.email !== 'guest@prepunite.com') {
      interviewService.fetchAndSyncFromSupabase(user.email).then(() => {
        refetchQuestions();
      });
    }
  }, [user?.email, refetchQuestions]);

  // Handlers
  const handleToggleMastered = (questionId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    interviewService.toggleQuestionMastered(questionId, user?.email);
    refetchQuestions();
  };

  const toggleAccordion = (questionId: string) => {
    setExpandedQuestionIds(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectTopic = (topicId: string) => {
    let paramVal = 'core-cs';
    if (activeCategory === 'HR_BEHAVIORAL') paramVal = 'hr';
    if (activeCategory === 'PROJECT_DEFENSE') paramVal = 'project';
    setSearchParams({ category: paramVal, topic: topicId });
    setSearchQuery('');
    setSelectedStatus('ALL');
  };

  const clearSelectedTopic = () => {
    let paramVal = 'core-cs';
    if (activeCategory === 'HR_BEHAVIORAL') paramVal = 'hr';
    if (activeCategory === 'PROJECT_DEFENSE') paramVal = 'project';
    setSearchParams({ category: paramVal });
    setSearchQuery('');
    setSelectedStatus('ALL');
  };

  // ─── ADMIN TOPIC ACTIONS ──────────────────────────────────────────────────
  const openTopicEditor = (e: React.MouseEvent, topic?: InterviewTopic) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;

    if (topic) {
      setEditingTopic({ ...topic });
    } else {
      const rawClusters = Array.from(new Set(topics.map(t => t.cluster)));
      setEditingTopic({
        id: '',
        title: '',
        name: '',
        category: activeCategory,
        cluster: rawClusters[0] || (activeCategory === 'CORE_CS' ? 'Database Systems' : 'Foundations'),
        description: '',
        iconName: 'BookOpen',
        icon_name: 'BookOpen',
        formulas: [],
        is_hidden: false,
        sort_order: topics.length + 1,
      });
    }
    setIsEditingTopic(true);
  };

  const saveTopic = async () => {
    if (!editingTopic || !editingTopic.id || !(editingTopic.name || editingTopic.title)) {
      alert("Topic ID and Title/Name are required.");
      return;
    }

    const res = await interviewService.saveTopic({
      ...editingTopic,
      category: editingTopic.category || activeCategory,
      name: editingTopic.name || editingTopic.title,
      title: editingTopic.name || editingTopic.title,
    });

    if (res.success) {
      setIsEditingTopic(false);
      setEditingTopic(null);
      refetchTopics();
      queryClient.invalidateQueries({ queryKey: ['interview-prep-topics'] });
    } else {
      alert("Error saving topic: " + res.error);
    }
  };

  const handleToggleTopicHide = async (e: React.MouseEvent, topic: InterviewTopic) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;

    const success = await interviewService.toggleTopicVisibility(topic.id, !topic.is_hidden);
    if (success) {
      refetchTopics();
      queryClient.invalidateQueries({ queryKey: ['interview-prep-topics'] });
    } else {
      alert("Failed to toggle visibility");
    }
  };

  const handleDeleteTopic = async (e: React.MouseEvent, topic: InterviewTopic) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;

    if (confirm(`Are you sure you want to permanently delete topic "${topic.title || topic.name}"?`)) {
      const success = await interviewService.deleteTopic(topic.id);
      if (success) {
        refetchTopics();
        queryClient.invalidateQueries({ queryKey: ['interview-prep-topics'] });
      } else {
        alert("Failed to delete topic");
      }
    }
  };

  // ─── ADMIN QUESTION ACTIONS ───────────────────────────────────────────────
  const openQuestionEditor = (e: React.MouseEvent, question?: InterviewQuestion) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;

    if (question) {
      setEditingQuestion({ ...question });
    } else {
      setEditingQuestion({
        id: `iq-${Date.now()}`,
        topicId: activeTopic?.id || 'topic-dbms',
        title: '',
        category: activeCategory,
        subject: activeTopic?.title || 'Core CS',
        subjectLabel: activeTopic?.title || 'Core CS',
        answer: '',
        bulletPoints: [],
        proTip: '',
        companyTags: ['TCS', 'Infosys', 'Amazon'],
        frequency: 'VERY_HIGH',
        difficulty: 'MEDIUM',
        is_hidden: false,
      });
    }
    setIsEditingQuestion(true);
  };

  const saveQuestion = async () => {
    if (!editingQuestion || !editingQuestion.title || !editingQuestion.answer) {
      alert("Question prompt and answer are required.");
      return;
    }

    const res = await interviewService.saveInterviewQuestion({
      ...editingQuestion,
      topicId: activeTopic?.id || editingQuestion.topicId,
      category: activeCategory,
    });

    if (res.success) {
      setIsEditingQuestion(false);
      setEditingQuestion(null);
      refetchQuestions();
    } else {
      alert("Error saving question: " + res.error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    await interviewService.deleteInterviewQuestion(questionId);
    refetchQuestions();
  };

  // ─── ADMIN BULK & VISIBILITY ACTIONS ──────────────────────────────────────
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuestionIds(new Set(filteredActiveQuestions.map(item => item.id)));
    } else {
      setSelectedQuestionIds(new Set());
    }
  };

  const handleBulkDelete = async () => {
    if (selectedQuestionIds.size === 0) return;
    const count = selectedQuestionIds.size;
    if (!window.confirm(`Are you sure you want to delete ${count} selected question(s)? This action cannot be undone.`)) return;

    const idsToDelete = Array.from(selectedQuestionIds);
    await interviewService.bulkDeleteInterviewQuestions(idsToDelete);
    refetchQuestions();
    setSelectedQuestionIds(new Set());
  };

  const handleToggleQuestionVisibility = async (question: InterviewQuestion) => {
    const nextHidden = !question.is_hidden;
    await interviewService.saveInterviewQuestion({
      ...question,
      is_hidden: nextHidden,
    });
    refetchQuestions();
  };

  return (
    <div className={`space-y-6 animate-fadeIn pb-12 font-sans relative ${activeTopic ? 'max-w-4xl mx-auto' : 'max-w-6xl mx-auto'}`}>
      {/* ────────────────────────────────────────────────────────────────────────
          ACTIVE TOPIC DRILLDOWN VIEW
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTopic ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Breadcrumb + Back Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={clearSelectedTopic}
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#868E96] dark:text-[#999999] hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Interview Topics</span>
            </button>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={(e) => openQuestionEditor(e)}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-display font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(true)}
                    className="px-2.5 py-1 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-md text-xs font-display font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    title="Bulk import questions from JSON"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Bulk Import (JSON)</span>
                  </button>
                </>
              )}
              <span className="text-xs text-[#868E96] dark:text-[#555555]">
                Interview Practice Mode
              </span>
            </div>
          </div>

          {/* Topic Header Banner */}
          <div className="p-5 sm:p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#121417] dark:text-[#FFFFFF] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded">
                    {activeTopic.cluster}
                  </span>
                  {activeTopic.is_hidden && (
                    <span className="text-[9px] font-mono font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30 px-2 py-0.5 rounded">
                      Hidden from students
                    </span>
                  )}
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
                  {activeTopic.title || activeTopic.name}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-sans max-w-xl">
                  {activeTopic.description}
                </p>
              </div>

              {/* Progress Bar & Actions matching Aptitude */}
              <div className="flex flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E9ECEF] dark:border-[#242424]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#868E96] dark:text-[#777777]">
                    Mastered: {activeTopicMasteredCount} / {activeTopicQuestions.length} ({activeTopicPercentage}%)
                  </span>
                </div>

                <div className="w-full sm:w-44 h-2 bg-[#F1F3F5] dark:bg-[#242424] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-500"
                    style={{ width: `${activeTopicPercentage}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowCheatcodeModal(true)}
                    className="px-2.5 py-1 flex items-center gap-1.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-display font-bold border border-purple-500/25 transition-all cursor-pointer shadow-2xs"
                    title="View interview cheatcode, high-yield answers, and key principles"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Cheatcode / Pro Tips</span>
                  </button>

                  <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#1C1C1C] text-[#868E96] dark:text-[#CCCCCC] text-xs font-display font-bold border border-[#E9ECEF] dark:border-[#242424]">
                    {filteredActiveQuestions.length} Questions
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-3.5 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
                  Status:
                </span>
                <div className="inline-flex items-center p-0.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
                  {[
                    { id: 'ALL', label: 'All Questions' },
                    { id: 'UNMASTERED', label: 'Unmastered' },
                    { id: 'MASTERED', label: `Mastered (${activeTopicMasteredCount})` },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedStatus(item.id as any)}
                      className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all cursor-pointer ${
                        selectedStatus === item.id
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Topic Search */}
              <div className="relative w-48 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
                <input
                  type="text"
                  placeholder="Search in this topic..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-purple-600 rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>
          </div>

          {/* Admin Bulk Actions */}
          {isAdmin && filteredActiveQuestions.length > 0 && (
            <div className="flex items-center gap-3 bg-[#F8F9FA] dark:bg-[#0C0C0C] px-3 py-1.5 rounded-md border border-[#E9ECEF] dark:border-[#242424]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedQuestionIds.size > 0 &&
                    selectedQuestionIds.size === filteredActiveQuestions.length
                  }
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
                    type="button"
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

          {/* 📄 CENTERED TOP PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-2.5 pb-1">
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
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
                  type="button"
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

          {/* Questions Accordion List */}
          <div className="space-y-4" ref={listTopRef}>
            {activeTopicQuestions.length === 0 ? (
              <div className="p-12 text-center rounded-xl border-2 border-dashed border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] space-y-3">
                <HelpCircle className="w-10 h-10 text-[#868E96] mx-auto opacity-50" />
                <h3 className="font-display font-bold text-base text-[#121417] dark:text-white">
                  No questions in this interview topic yet
                </h3>
                <p className="text-xs text-[#868E96] dark:text-[#777777] max-w-sm mx-auto">
                  Add questions individually or use the Bulk Importer to paste a JSON array of interview Q&As directly into Supabase.
                </p>
                {isAdmin && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={(e) => openQuestionEditor(e)}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBulkModal(true)}
                      className="px-3.5 py-1.5 bg-[#121417] dark:bg-white text-white dark:text-black rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Bulk Import (JSON)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : filteredActiveQuestions.length === 0 ? (
              <div className="p-10 text-center rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414]">
                <HelpCircle className="w-8 h-8 text-[#868E96] mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-[#868E96] dark:text-[#555555]">
                  No interview questions match your filter or search terms.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-3 py-1.5 bg-purple-600 text-white rounded-md text-xs font-display font-bold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredActiveQuestions
                .slice((currentPage - 1) * QUESTIONS_PER_PAGE, currentPage * QUESTIONS_PER_PAGE)
                .map((q, idx) => {
                const globalIdx = (currentPage - 1) * QUESTIONS_PER_PAGE + idx;
                const isExpanded = expandedQuestionIds[q.id] ?? false;

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border transition-all duration-300 shadow-xs overflow-hidden ${
                      q.is_hidden
                        ? 'opacity-70 border-dashed border-amber-500/50 bg-amber-500/5'
                        : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] hover:border-purple-500/40 text-[#121417] dark:text-[#FFFFFF]'
                    } ${selectedQuestionIds.has(q.id) ? 'ring-2 ring-purple-500/50 border-purple-500 shadow-md' : ''}`}
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => toggleAccordion(q.id)}
                      className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#F8F9FA]/50 dark:hover:bg-[#191919]/50 transition-colors"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isAdmin && (
                            <input
                              type="checkbox"
                              checked={selectedQuestionIds.has(q.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleQuestionSelection(q.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 mr-1 rounded border-[#E9ECEF] dark:border-[#242424] text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                          )}

                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-display font-bold text-[10px] tracking-tight border border-purple-500/25">
                            Q{globalIdx + 1}
                          </span>

                          {q.frequency === 'VERY_HIGH' && (
                            <span className="text-[9px] font-display font-bold bg-rose-500/10 text-rose-600 border border-rose-500/25 px-2 py-0.5 rounded flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" />
                              Very High Frequency
                            </span>
                          )}

                          {q.is_hidden && (
                            <span className="text-[9px] font-display font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              <span>Hidden</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-bold text-sm sm:text-base text-[#121417] dark:text-[#FFFFFF] leading-snug">
                          {q.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={e => handleToggleMastered(q.id, e)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-display font-bold border transition-all cursor-pointer ${
                            q.mastered
                              ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                              : 'bg-[#F8F9FA] dark:bg-[#202020] text-[#868E96] border-[#E9ECEF] dark:border-[#2E2E2E] hover:text-purple-600'
                          }`}
                          title={q.mastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                        >
                          {q.mastered ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Mastered</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-3.5 h-3.5" />
                              <span>Mark Mastered</span>
                            </>
                          )}
                        </button>

                        {isAdmin && (
                          <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-800 pl-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleQuestionVisibility(q);
                              }}
                              className={`p-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                                q.is_hidden
                                  ? 'bg-amber-500/20 text-amber-600 border border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                              }`}
                              title={q.is_hidden ? 'Publish Question' : 'Hide Question'}
                            >
                              {q.is_hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openQuestionEditor(e, q);
                              }}
                              className="p-1 rounded bg-blue-500/20 text-blue-600 border border-blue-500/40 hover:bg-blue-500/30 transition-all"
                              title="Edit Question"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteQuestion(q.id);
                              }}
                              className="p-1 rounded bg-rose-500/20 text-rose-600 border border-rose-500/40 hover:bg-rose-500/30 transition-all"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div className="p-1 text-[#868E96]">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Answer Body */}
                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-[#E9ECEF] dark:border-[#242424] space-y-4 animate-fadeIn text-xs sm:text-sm">
                        {/* Bullet Points Quick Revision Box */}
                        {q.bulletPoints && q.bulletPoints.length > 0 && (
                          <div className="p-3.5 rounded-lg bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 space-y-1.5 mt-4">
                            <span className="font-display font-bold text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                              Key Takeaways for Quick Revision:
                            </span>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700 dark:text-gray-300 font-sans">
                              {q.bulletPoints.map((point, pIdx) => (
                                <li key={pIdx} className="leading-relaxed">
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Full In-Depth Answer */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[10px] font-bold text-[#868E96] uppercase tracking-wider block font-display">
                            Comprehensive Interview Answer:
                          </span>
                          <div className="p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#212529] dark:text-[#E9ECEF] whitespace-pre-line leading-relaxed font-sans text-xs sm:text-sm">
                            {q.answer}
                          </div>
                        </div>

                        {/* Code Snippet */}
                        {q.codeSnippet && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#868E96] uppercase tracking-wider block font-display">
                                Code / Query Example ({q.codeSnippet.language}):
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(q.codeSnippet!.code, q.id)}
                                className="flex items-center gap-1 text-[11px] font-mono text-gray-500 hover:text-purple-600 transition-colors"
                              >
                                {copiedId === q.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedId === q.id ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#242424] font-mono text-xs text-emerald-400 overflow-x-auto">
                              <pre>{q.codeSnippet.code}</pre>
                            </div>
                          </div>
                        )}

                        {/* Pro Tip */}
                        {q.proTip && (
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 space-y-1 text-xs">
                            <span className="font-bold flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                              Interviewer Follow-up &amp; Pro-Tip
                            </span>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-sans text-xs">
                              {q.proTip}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 📄 BOTTOM NUMBERED PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 pb-2">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF] hover:border-[#121417] dark:hover:border-[#555555] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  const isActive = currentPage === page;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`flex items-center justify-center min-w-[36px] h-[36px] px-2 rounded-full font-display font-bold text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 scale-105'
                          : 'bg-transparent text-[#868E96] dark:text-[#888888] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF] hover:border-[#121417] dark:hover:border-[#555555] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────────────────────
            MAIN DIRECTORY VIEW
        ──────────────────────────────────────────────────────────────────────── */
        <>
          {/* 🚀 1. UNIFIED HEADER BANNER */}
          <div className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1 sm:max-w-md shrink-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-display font-bold uppercase tracking-wider">
                  <MessageSquareQuote className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span>Interview Preparation Directory</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
                  {activeCategory === 'CORE_CS' && 'Core CS Fundamentals'}
                  {activeCategory === 'HR_BEHAVIORAL' && 'HR & Behavioral (STAR Method)'}
                  {activeCategory === 'PROJECT_DEFENSE' && 'Project Defense & Technical Viva'}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-sans mt-0.5">
                  {activeCategory === 'CORE_CS' &&
                    'Subject-wise technical interview questions across DBMS, SQL, OOPs, Operating Systems, and Computer Networks.'}
                  {activeCategory === 'HR_BEHAVIORAL' &&
                    'Proven STAR method frameworks for self-introductions, leadership scenarios, conflict resolution, and behavioral traps.'}
                  {activeCategory === 'PROJECT_DEFENSE' &&
                    'Ace tough project cross-examinations, architectural trade-offs, database justifications, and scalability viva.'}
                </p>
              </div>

              {/* Embedded Donut & Category Progress */}
              <div className="flex-1 lg:max-w-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
                      <circle
                        cx="35"
                        cy="35"
                        r={radius}
                        className="stroke-[#E9ECEF] dark:stroke-[#262626]"
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                      {masteredCount > 0 && (
                        <circle
                          cx="35"
                          cy="35"
                          r={radius}
                          className="stroke-purple-600 dark:stroke-purple-500 transition-all duration-700 ease-out"
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                          fill="none"
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none px-1">
                      <span className="font-mono font-bold text-xs text-[#121417] dark:text-white tracking-tight leading-none">
                        {masteredCount}/{totalQuestions}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 flex-1 max-w-md">
                    {/* Core CS */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                        <span className="font-display font-bold text-purple-600 dark:text-purple-400">
                          Core CS
                        </span>
                        <span className="text-[#868E96] dark:text-[#666666]">
                          {coreCsMastered}/{coreCsQuestions.length}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${coreCsPct}%` }}
                        />
                      </div>
                    </div>

                    {/* HR STAR */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                        <span className="font-display font-bold text-amber-600 dark:text-amber-400">
                          HR STAR
                        </span>
                        <span className="text-[#868E96] dark:text-[#666666]">
                          {hrMastered}/{hrQuestions.length}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${hrPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Project Defense */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                        <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">
                          Project
                        </span>
                        <span className="text-[#868E96] dark:text-[#666666]">
                          {projectMastered}/{projectQuestions.length}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${projPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🏷️ 2. CATEGORY SWITCHER TABS */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleCategoryChange('CORE_CS')}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'CORE_CS'
                  ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                  : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-purple-500" />
              <span>Core CS Fundamentals</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                  activeCategory === 'CORE_CS'
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                    : 'bg-black/5 dark:bg-white/5'
                }`}
              >
                {coreCsQuestions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('HR_BEHAVIORAL')}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'HR_BEHAVIORAL'
                  ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                  : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>HR Behavioral (STAR)</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                  activeCategory === 'HR_BEHAVIORAL'
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                    : 'bg-black/5 dark:bg-white/5'
                }`}
              >
                {hrQuestions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('PROJECT_DEFENSE')}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'PROJECT_DEFENSE'
                  ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                  : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Project Defense &amp; Viva</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                  activeCategory === 'PROJECT_DEFENSE'
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                    : 'bg-black/5 dark:bg-white/5'
                }`}
              >
                {projectQuestions.length}
              </span>
            </button>
          </div>

          {/* 🏷️ 3. CLUSTER FILTER PILLS + SEARCH BAR + ADMIN ADD TOPIC BUTTON */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 max-w-full">
              {clusters.map(cluster => (
                <button
                  key={cluster}
                  type="button"
                  onClick={() => setSelectedCluster(cluster)}
                  className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    selectedCluster === cluster
                      ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                      : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                  }`}
                >
                  {cluster}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <div className="relative w-48 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-purple-600 rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                />
              </div>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={(e) => openTopicEditor(e)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-display font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                    title="Add New Interview Topic"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Topic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(true)}
                    className="px-3 py-1 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-md text-xs font-display font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                    title="Bulk import interview questions from JSON"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Bulk Import (JSON)</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 📁 4. TOPIC DIRECTORY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredTopics.length === 0 ? (
              <div className="col-span-full p-10 text-center rounded-xl border border-dashed border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414]">
                <HelpCircle className="w-8 h-8 text-[#868E96] mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-[#868E96] dark:text-[#555555]">
                  No interview topics found matching your selected cluster or search query.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCluster('All Topics');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-3 py-1.5 bg-[#FD4A32] text-white rounded-md text-xs font-display font-bold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredTopics.map(topic => {
                const TopicIcon = TOPIC_ICON_MAP[topic.icon_name || topic.iconName] || BookOpen;
                const topicQuestions = allQuestions.filter(q => q.topicId === topic.id);
                const masteredInTopic = topicQuestions.filter(q => q.mastered).length;
                const liveCount = liveCountMap[topic.id] ?? topicQuestions.length;

                return (
                  <div
                    key={topic.id}
                    onClick={() => selectTopic(topic.id)}
                    className={`group flex items-center justify-between p-3.5 bg-white dark:bg-[#141414] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] border ${
                      topic.is_hidden
                        ? 'border-amber-500/40 opacity-75'
                        : 'border-[#E9ECEF] dark:border-[#242424] hover:border-purple-500/50 dark:hover:border-purple-500/50'
                    } rounded-lg transition-all duration-150 shadow-2xs cursor-pointer`}
                  >
                    {/* Left: Icon & Title & Description */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                        <TopicIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-bold text-xs sm:text-sm text-[#121417] dark:text-[#FFFFFF] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                            {topic.title || topic.name}
                          </span>
                          {topic.is_hidden && (
                            <span className="text-[9px] font-mono text-amber-600 bg-amber-500/10 px-1 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {topic.cluster} • {topic.description}
                        </span>
                      </div>
                    </div>

                    {/* Right: Mastered Badge & Admin Controls / Questions Pill */}
                    <div className="flex items-center gap-2 shrink-0">
                      {masteredInTopic > 0 && (
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {masteredInTopic} Mastered
                        </span>
                      )}

                      {isAdmin && (
                        <div className="flex items-center gap-1 border-r border-[#E9ECEF] dark:border-[#242424] pr-2 mr-1">
                          <button
                            type="button"
                            onClick={(e) => handleToggleTopicHide(e, topic)}
                            className="p-1 rounded text-gray-400 hover:text-amber-500 hover:bg-black/5 dark:hover:bg-white/5"
                            title={topic.is_hidden ? 'Make Visible' : 'Hide Topic'}
                          >
                            {topic.is_hidden ? <EyeOff className="w-3.5 h-3.5 text-amber-500" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => openTopicEditor(e, topic)}
                            className="p-1 rounded text-gray-400 hover:text-blue-500 hover:bg-black/5 dark:hover:bg-white/5"
                            title="Edit Topic Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteTopic(e, topic)}
                            className="p-1 rounded text-gray-400 hover:text-rose-500 hover:bg-black/5 dark:hover:bg-white/5"
                            title="Delete Topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-[11px] font-display font-bold text-[#121417] dark:text-[#E9ECEF] bg-[#F1F3F5] dark:bg-[#202020] px-2.5 py-1 rounded border border-[#E9ECEF] dark:border-[#2E2E2E] group-hover:border-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        <span>{liveCount} Questions</span>
                        <ChevronRight className="w-3 h-3 text-[#868E96]" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* 🛠️ ADMIN INTERVIEW TOPIC EDITOR MODAL */}
      {isEditingTopic && editingTopic && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {editingTopic.id && topics.some(t => t.id === editingTopic.id) ? 'Edit Interview Topic' : 'Add Interview Topic'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsEditingTopic(false); setEditingTopic(null); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Topic ID (Slug) *
                  </label>
                  <input
                    type="text"
                    value={editingTopic.id || ''}
                    onChange={e => setEditingTopic({ ...editingTopic, id: e.target.value })}
                    disabled={topics.some(t => t.id === editingTopic.id)}
                    placeholder="e.g. topic-dbms"
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editingTopic.category || activeCategory}
                    onChange={e => setEditingTopic({ ...editingTopic, category: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#181818] rounded-md text-gray-900 dark:text-white"
                  >
                    <option value="CORE_CS">Core CS</option>
                    <option value="HR_BEHAVIORAL">HR Behavioral</option>
                    <option value="PROJECT_DEFENSE">Project Defense</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Topic Title / Name *
                </label>
                <input
                  type="text"
                  value={editingTopic.name || editingTopic.title || ''}
                  onChange={e => setEditingTopic({ ...editingTopic, name: e.target.value, title: e.target.value })}
                  placeholder="e.g. Database Management Systems (DBMS)"
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Cluster Header
                  </label>
                  <input
                    type="text"
                    value={editingTopic.cluster || ''}
                    onChange={e => setEditingTopic({ ...editingTopic, cluster: e.target.value })}
                    placeholder="e.g. Database Systems"
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Icon Name
                  </label>
                  <select
                    value={editingTopic.icon_name || editingTopic.iconName || 'BookOpen'}
                    onChange={e => setEditingTopic({ ...editingTopic, icon_name: e.target.value, iconName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#181818] rounded-md text-gray-900 dark:text-white"
                  >
                    {Object.keys(TOPIC_ICON_MAP).map(iconKey => (
                      <option key={iconKey} value={iconKey}>{iconKey}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingTopic.description || ''}
                  onChange={e => setEditingTopic({ ...editingTopic, description: e.target.value })}
                  placeholder="Overview of this interview topic..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="topic_is_hidden"
                  checked={!!editingTopic.is_hidden}
                  onChange={e => setEditingTopic({ ...editingTopic, is_hidden: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="topic_is_hidden" className="text-gray-700 dark:text-gray-300 cursor-pointer font-semibold">
                  Hide topic from students (Draft / Archived)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              <button
                type="button"
                onClick={() => { setIsEditingTopic(false); setEditingTopic(null); }}
                className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTopic}
                className="px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Topic to Supabase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛠️ ADMIN INTERVIEW QUESTION EDITOR MODAL */}
      {isEditingQuestion && editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {editingQuestion.id ? 'Edit Interview Question' : 'Add Interview Question'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsEditingQuestion(false); setEditingQuestion(null); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Question Prompt / Title *
                </label>
                <input
                  type="text"
                  value={editingQuestion.title || ''}
                  onChange={e => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                  placeholder="e.g. Explain ACID Properties in DBMS with an Example"
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Comprehensive Answer *
                </label>
                <textarea
                  rows={4}
                  value={editingQuestion.answer || ''}
                  onChange={e => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                  placeholder="Detailed answer for the candidate to speak in interview..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Key Takeaway Bullet Points (Newline separated)
                </label>
                <textarea
                  rows={3}
                  value={(editingQuestion.bulletPoints || []).join('\n')}
                  onChange={e => setEditingQuestion({
                    ...editingQuestion,
                    bulletPoints: e.target.value.split('\n').filter(Boolean)
                  })}
                  placeholder="Atomicity: All-or-nothing execution...&#10;Consistency: DB state invariant..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Interviewer Pro-Tip / Follow-up Inquiry
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.proTip || ''}
                  onChange={e => setEditingQuestion({ ...editingQuestion, proTip: e.target.value })}
                  placeholder="e.g. Interviewers often ask which ACID property is hardest to achieve..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={editingQuestion.frequency || 'VERY_HIGH'}
                    onChange={e => setEditingQuestion({ ...editingQuestion, frequency: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#181818] rounded-md text-gray-900 dark:text-white"
                  >
                    <option value="VERY_HIGH">VERY HIGH</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={editingQuestion.difficulty || 'MEDIUM'}
                    onChange={e => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#181818] rounded-md text-gray-900 dark:text-white"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              <button
                type="button"
                onClick={() => { setIsEditingQuestion(false); setEditingQuestion(null); }}
                className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveQuestion}
                className="px-4 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Question to Supabase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💻 ADMIN BULK JSON IMPORT MODAL */}
      {showBulkModal && (
        <InterviewBulkImportModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            refetchQuestions();
          }}
          defaultTopicId={activeTopic?.id}
          defaultCategory={activeCategory}
          topics={topics}
        />
      )}

      {/* 💡 TOPIC CHEATCODE / TIPS MODAL */}
      {activeTopic && (
        <TopicCheatcodeModal
          isOpen={showCheatcodeModal}
          onClose={() => setShowCheatcodeModal(false)}
          topicId={activeTopic.id}
          topicName={activeTopic.title || activeTopic.name || ''}
          categoryTitle={
            activeCategory === 'CORE_CS'
              ? 'Core CS Fundamentals'
              : activeCategory === 'HR_BEHAVIORAL'
              ? 'HR & Behavioral Interview'
              : 'Project Defense & Viva'
          }
          fallbackFormulas={activeTopic.formulas || []}
        />
      )}
    </div>
  );
}
