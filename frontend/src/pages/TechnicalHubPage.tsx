import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Code2,
  Terminal,
  Brain,
  Search,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  HardDrive,
  Lightbulb,
  X,
  XCircle,
  Zap,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Hash,
  Shuffle,
  Sliders,
  Grid,
  Type,
  Sparkles,
  Cpu,
  Binary,
  ArrowLeft,
  BookOpen,
  Folder,
  FileCode,
  GitMerge,
  Database,
  Network,
  Server,
  Plus,
  Edit2,
  Trash2,
  Upload,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { technicalService } from '@/services/technical.service';
import audioEffects from '@/utils/audioEffects';
import TechnicalBulkImportModal from '@/components/technical/TechnicalBulkImportModal';
import type { ProgrammingProblem, TechnicalMcq, TechnicalMcqProgress, ProblemLevel, TechnicalTrack, ProgrammingTopic } from '@/types/technical';

const TOPIC_ICON_MAP: Record<string, React.ComponentType<any>> = {
  Code2,
  Terminal,
  Hash,
  Shuffle,
  Layers,
  Sliders,
  Grid,
  Type,
  Sparkles,
  Cpu,
  Search,
  Binary,
  BookOpen,
  Folder,
  Zap,
  GitMerge,
  Brain,
  Database,
  Network,
  Server,
};

export default function TechnicalHubPage() {
  const { isAdmin, user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const trackParam = searchParams.get('track');
  const topicParam = searchParams.get('topic');

  const activeTrack: TechnicalTrack = useMemo(() => {
    if (trackParam === 'campus-dsa') return 'CAMPUS_DSA';
    if (trackParam === 'mcqs') return 'TECHNICAL_MCQS';
    return 'PROGRAMMING_150';
  }, [trackParam]);

  const handleTrackChange = (track: TechnicalTrack) => {
    let paramVal = 'programming-150';
    if (track === 'CAMPUS_DSA') paramVal = 'campus-dsa';
    if (track === 'TECHNICAL_MCQS') paramVal = 'mcqs';
    setSearchParams({ track: paramVal });
    setSelectedCategory('ALL');
    setSelectedLevel('ALL');
    setSelectedStatus('ALL');
    setSelectedStage('');
    setSearchQuery('');
  };

  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'UNSOLVED' | 'SOLVED' | 'RETRY'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<ProgrammingProblem | null>(null);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [problemLanguages, setProblemLanguages] = useState<Record<string, 'java' | 'python' | 'cpp' | 'c'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);

  // Admin Topic Editor State
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Partial<ProgrammingTopic> | null>(null);

  // Admin Problem / MCQ Editor State
  const [isEditingProblem, setIsEditingProblem] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Partial<ProgrammingProblem> | null>(null);
  const [isEditingMcq, setIsEditingMcq] = useState(false);
  const [editingMcq, setEditingMcq] = useState<Partial<TechnicalMcq> | null>(null);

  // Admin Multi-Select State
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    setSelectedItemIds(new Set());
  }, [topicParam, activeTrack]);

  // Technical MCQ Progress & State
  const [mcqProgress, setMcqProgress] = useState<Record<string, TechnicalMcqProgress>>(() =>
    technicalService.getMcqProgress()
  );
  const [revealedMcqExpl, setRevealedMcqExpl] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState<boolean>(() => audioEffects.getMuted());

  const handleToggleSound = () => {
    const next = audioEffects.toggleMute();
    setIsMuted(next);
  };

  // Query Topics for activeTrack (Supabase-first)
  const { data: topics = [], refetch: refetchTopics } = useQuery<ProgrammingTopic[]>({
    queryKey: ['technical-topics', activeTrack],
    queryFn: () => technicalService.getTopicsForTrack(activeTrack),
  });

  // Query Live Topic Question Counts (Supabase-first)
  const { data: liveCountMap = {} } = useQuery<Record<string, number>>({
    queryKey: ['technical-topic-counts', activeTrack],
    queryFn: () => technicalService.getTopicCountsMap(activeTrack),
  });

  // Query Programming 150 Problems (Supabase-first)
  const { data: p150Problems = [], refetch: refetchP150 } = useQuery({
    queryKey: ['programming-150-problems'],
    queryFn: () => technicalService.getProgramming150Problems(),
  });

  // Query Campus DSA Problems (Supabase-first)
  const { data: dsaProblems = [], refetch: refetchDsa } = useQuery({
    queryKey: ['campus-dsa-problems'],
    queryFn: () => technicalService.getCampusDsaProblems(),
  });

  // Query Technical MCQs (Supabase-first)
  const { data: mcqs = [], refetch: refetchMcqs } = useQuery({
    queryKey: ['technical-mcqs'],
    queryFn: () => technicalService.getTechnicalMcqs(),
  });

  // Hydrate user progress from Supabase on mount / when user changes
  useEffect(() => {
    if (user?.email && user.email !== 'guest@prepunite.com') {
      technicalService.fetchAndSyncFromSupabase(user.email).then(() => {
        setMcqProgress(technicalService.getMcqProgress());
        refetchP150();
        refetchDsa();
      });
    }
  }, [user?.email, refetchP150, refetchDsa]);

  // Active list based on track
  const currentProblems = useMemo(() => {
    return activeTrack === 'PROGRAMMING_150' ? p150Problems : dsaProblems;
  }, [activeTrack, p150Problems, dsaProblems]);

  // Active track stats for header analytics
  const activeTrackProblems = useMemo(() => {
    if (activeTrack === 'PROGRAMMING_150') return p150Problems;
    if (activeTrack === 'CAMPUS_DSA') return dsaProblems;
    return [];
  }, [activeTrack, p150Problems, dsaProblems]);

  const mcqSolvedCount = useMemo(() => {
    return mcqs.filter(m => mcqProgress[m.id]?.solved).length;
  }, [mcqs, mcqProgress]);

  const mcqRetryCount = useMemo(() => {
    return mcqs.filter(m => !mcqProgress[m.id]?.solved && (mcqProgress[m.id]?.wrongPicks?.length ?? 0) > 0).length;
  }, [mcqs, mcqProgress]);

  const mcqUnsolvedCount = useMemo(() => {
    return mcqs.filter(m => !mcqProgress[m.id]?.solved).length;
  }, [mcqs, mcqProgress]);

  const activeTrackSolved = useMemo(() => {
    if (activeTrack === 'TECHNICAL_MCQS') return mcqSolvedCount;
    return activeTrackProblems.filter(p => p.solved).length;
  }, [activeTrack, activeTrackProblems, mcqSolvedCount]);

  const activeTrackTotal = useMemo(() => {
    if (activeTrack === 'TECHNICAL_MCQS') return mcqs.length;
    return activeTrackProblems.length;
  }, [activeTrack, activeTrackProblems, mcqs]);

  const basicProblems = useMemo(() => activeTrackProblems.filter(p => p.level === 'BASIC'), [activeTrackProblems]);
  const basicSolved = useMemo(() => basicProblems.filter(p => p.solved).length, [basicProblems]);
  const basicPct = basicProblems.length > 0 ? Math.round((basicSolved / basicProblems.length) * 100) : 0;

  const mediumProblems = useMemo(() => activeTrackProblems.filter(p => p.level === 'MEDIUM'), [activeTrackProblems]);
  const mediumSolved = useMemo(() => mediumProblems.filter(p => p.solved).length, [mediumProblems]);
  const mediumPct = mediumProblems.length > 0 ? Math.round((mediumSolved / mediumProblems.length) * 100) : 0;

  const hardProblems = useMemo(() => activeTrackProblems.filter(p => p.level === 'HARD'), [activeTrackProblems]);
  const hardSolved = useMemo(() => hardProblems.filter(p => p.solved).length, [hardProblems]);
  const hardPct = hardProblems.length > 0 ? Math.round((hardSolved / hardProblems.length) * 100) : 0;

  // Donut chart dimensions matching Aptitude
  const radius = 28;
  const strokeWidth = 4.5;
  const circumference = 2 * Math.PI * radius;
  const codingPortion = activeTrackTotal > 0 ? (activeTrackSolved / activeTrackTotal) * circumference : 0;
  const codingDashOffset = circumference - codingPortion;

  // Filter topics (Admins see all, Users see non-hidden)
  const currentCategoryTopics = useMemo(() => {
    return topics.filter(t => isAdmin || !t.is_hidden);
  }, [topics, isAdmin]);

  // Active topic object if topicParam is set
  const activeTopic = useMemo(() => {
    if (!topicParam) return null;
    return topics.find(t => t.id === topicParam) || null;
  }, [topicParam, topics]);

  // Distinct clusters/stages for directory filter
  const stages = useMemo(() => {
    const rawClusters = Array.from(new Set(currentCategoryTopics.map(t => t.cluster)));
    if (activeTrack === 'PROGRAMMING_150') {
      return ['All Stages', ...rawClusters];
    }
    if (activeTrack === 'CAMPUS_DSA') {
      return ['All Patterns', ...rawClusters];
    }
    return ['All Topics', ...rawClusters];
  }, [currentCategoryTopics, activeTrack]);

  // Auto-synchronize stage/cluster selection when track changes or on initial load
  useEffect(() => {
    if (stages.length > 0) {
      if (activeTrack === 'PROGRAMMING_150') {
        if (!selectedStage || !stages.includes(selectedStage)) {
          // Default to Stage 1 initially, but allow user to select 'All Stages'
          const stage1 = stages.find(s => s.toLowerCase().includes('stage 1')) || stages[0];
          setSelectedStage(stage1);
        }
      } else if (activeTrack === 'CAMPUS_DSA') {
        if (!selectedStage || !stages.includes(selectedStage)) {
          setSelectedStage('All Patterns');
        }
      } else if (activeTrack === 'TECHNICAL_MCQS') {
        if (!selectedStage || !stages.includes(selectedStage)) {
          setSelectedStage('All Topics');
        }
      }
    }
  }, [stages, selectedStage, activeTrack]);

  // Filtered topics for directory
  const filteredTopics = useMemo(() => {
    return currentCategoryTopics.filter(t => {
      const isAll =
        !selectedStage ||
        selectedStage === 'All Stages' ||
        selectedStage === 'All Topics' ||
        selectedStage === 'All Patterns' ||
        selectedStage === 'ALL';
      if (!isAll && t.cluster !== selectedStage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.cluster.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [currentCategoryTopics, selectedStage, searchQuery]);

  // Active topic problems
  const activeTopicProblems = useMemo(() => {
    if (!activeTopic) return [];
    if (activeTrack === 'CAMPUS_DSA') {
      return dsaProblems.filter(p => p.topicId === activeTopic.id);
    }
    return p150Problems.filter(p => p.topicId === activeTopic.id);
  }, [activeTopic, activeTrack, p150Problems, dsaProblems]);

  // Active topic MCQs
  const activeTopicMcqs = useMemo(() => {
    if (!activeTopic || activeTrack !== 'TECHNICAL_MCQS') return [];
    return mcqs.filter(m => m.topicId === activeTopic.id);
  }, [activeTopic, activeTrack, mcqs]);

  const activeTopicSolvedCount = useMemo(() => {
    if (activeTrack === 'TECHNICAL_MCQS') {
      return activeTopicMcqs.filter(m => mcqProgress[m.id]?.solved).length;
    }
    return activeTopicProblems.filter(p => p.solved).length;
  }, [activeTrack, activeTopicMcqs, activeTopicProblems, mcqProgress]);

  const activeTopicTotalCount = useMemo(() => {
    if (activeTrack === 'TECHNICAL_MCQS') return activeTopicMcqs.length;
    return activeTopicProblems.length;
  }, [activeTrack, activeTopicMcqs, activeTopicProblems]);

  const topicPercentage = activeTopicTotalCount > 0 ? Math.round((activeTopicSolvedCount / activeTopicTotalCount) * 100) : 0;

  // Filtered Problems
  const filteredProblems = useMemo(() => {
    const list = activeTopic ? activeTopicProblems : currentProblems;
    return list.filter(p => {
      if (!isAdmin && p.is_hidden) return false;
      if (selectedLevel !== 'ALL' && p.level !== selectedLevel) return false;
      if (selectedStatus === 'SOLVED' && !p.solved) return false;
      if (selectedStatus === 'UNSOLVED' && p.solved) return false;
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = (p.categoryLabel || '').toLowerCase().includes(q);
        const matchesCompany = p.companyTags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesCompany) return false;
      }
      return true;
    });
  }, [activeTopic, activeTopicProblems, currentProblems, selectedLevel, selectedStatus, selectedCategory, searchQuery, isAdmin]);

  // Filtered MCQs
  const filteredMcqs = useMemo(() => {
    const list = activeTopic ? activeTopicMcqs : mcqs;
    return list.filter(mcq => {
      if (!isAdmin && mcq.is_hidden) return false;
      const prog = mcqProgress[mcq.id];
      const isSolved = prog?.solved ?? false;
      const isRetry = !isSolved && (prog?.wrongPicks?.length ?? 0) > 0;

      if (selectedStatus === 'SOLVED' && !isSolved) return false;
      if (selectedStatus === 'UNSOLVED' && isSolved) return false;
      if (selectedStatus === 'RETRY' && !isRetry) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = mcq.question.toLowerCase().includes(q);
        const matchesTopic = mcq.topic.toLowerCase().includes(q);
        const matchesCode = mcq.codeSnippet?.toLowerCase().includes(q) ?? false;
        const matchesTags = mcq.companyTags?.some(t => t.toLowerCase().includes(q)) ?? false;
        if (!matchesQ && !matchesTopic && !matchesCode && !matchesTags) return false;
      }

      return true;
    });
  }, [activeTopic, activeTopicMcqs, mcqs, selectedStatus, searchQuery, mcqProgress, isAdmin]);

  const handleSelectMcqOption = (mcq: TechnicalMcq, optIdx: number) => {
    const isCorrect = optIdx === mcq.correctOptionIndex;
    const currentProg = mcqProgress[mcq.id] || { solved: false, wrongPicks: [] };

    if (isCorrect) {
      audioEffects.playSuccessChime();
      const updated: TechnicalMcqProgress = {
        solved: true,
        wrongPicks: currentProg.wrongPicks,
        selectedOption: optIdx,
        timestamp: Date.now(),
      };
      technicalService.saveMcqProgress(mcq.id, updated, user?.email);
      setMcqProgress(prev => ({ ...prev, [mcq.id]: updated }));
    } else {
      audioEffects.playErrorBuzz();
      const newWrong = currentProg.wrongPicks.includes(optIdx)
        ? currentProg.wrongPicks
        : [...currentProg.wrongPicks, optIdx];
      const updated: TechnicalMcqProgress = {
        solved: false,
        wrongPicks: newWrong,
        selectedOption: optIdx,
        timestamp: Date.now(),
      };
      technicalService.saveMcqProgress(mcq.id, updated, user?.email);
      setMcqProgress(prev => ({ ...prev, [mcq.id]: updated }));
    }
  };

  const toggleMcqExplanation = (mcqId: string) => {
    setRevealedMcqExpl(prev => ({
      ...prev,
      [mcqId]: !prev[mcqId],
    }));
  };

  const handleToggleSolve = (problemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    technicalService.toggleProblemSolved(problemId, user?.email, activeTrack);
    if (activeTrack === 'PROGRAMMING_150') refetchP150();
    else refetchDsa();
    if (selectedProblem && selectedProblem.id === problemId) {
      setSelectedProblem(prev => (prev ? { ...prev, solved: !prev.solved } : null));
    }
  };

  const toggleSolution = (problemId: string) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  const setProblemLanguage = (problemId: string, lang: 'java' | 'python' | 'cpp' | 'c') => {
    setProblemLanguages(prev => ({
      ...prev,
      [problemId]: lang,
    }));
  };

  const handleCopyCode = (codeText: string, problemId: string) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopiedId(problemId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectTopic = (topicId: string) => {
    let paramVal = 'programming-150';
    if (activeTrack === 'CAMPUS_DSA') paramVal = 'campus-dsa';
    if (activeTrack === 'TECHNICAL_MCQS') paramVal = 'mcqs';
    setSearchParams({ track: paramVal, topic: topicId });
    setSearchQuery('');
    setSelectedLevel('ALL');
    setSelectedStatus('ALL');
  };

  const clearSelectedTopic = () => {
    let paramVal = 'programming-150';
    if (activeTrack === 'CAMPUS_DSA') paramVal = 'campus-dsa';
    if (activeTrack === 'TECHNICAL_MCQS') paramVal = 'mcqs';
    setSearchParams({ track: paramVal });
    setSearchQuery('');
    setSelectedLevel('ALL');
    setSelectedStatus('ALL');
  };

  // ─── ADMIN TOPIC ACTIONS ──────────────────────────────────────────────────
  const openTopicEditor = (e: React.MouseEvent, topic?: ProgrammingTopic) => {
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
        track: activeTrack,
        category: activeTrack === 'TECHNICAL_MCQS' ? 'C_PROGRAMMING' : 'SYNTAX_BASICS',
        cluster: rawClusters[0] || (activeTrack === 'PROGRAMMING_150' ? 'Stage 1: Language & Control Flow' : 'General'),
        description: '',
        iconName: 'Code2',
        icon_name: 'Code2',
        tips: [],
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

    const res = await technicalService.saveTopic({
      ...editingTopic,
      track: editingTopic.track || activeTrack,
      name: editingTopic.name || editingTopic.title,
      title: editingTopic.name || editingTopic.title,
    });

    if (res.success) {
      setIsEditingTopic(false);
      setEditingTopic(null);
      refetchTopics();
      queryClient.invalidateQueries({ queryKey: ['technical-topics'] });
    } else {
      alert("Error saving topic: " + res.error);
    }
  };

  const handleToggleTopicHide = async (e: React.MouseEvent, topic: ProgrammingTopic) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;

    const success = await technicalService.toggleTopicVisibility(topic.id, !topic.is_hidden);
    if (success) {
      refetchTopics();
      queryClient.invalidateQueries({ queryKey: ['technical-topics'] });
    } else {
      alert("Failed to toggle visibility");
    }
  };

  const handleDeleteTopic = async (e: React.MouseEvent, topic: ProgrammingTopic) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;

    if (confirm(`Are you sure you want to permanently delete topic "${topic.title}"?`)) {
      const success = await technicalService.deleteTopic(topic.id);
      if (success) {
        refetchTopics();
        queryClient.invalidateQueries({ queryKey: ['technical-topics'] });
      } else {
        alert("Failed to delete topic");
      }
    }
  };

  // ─── ADMIN PROBLEM ACTIONS ────────────────────────────────────────────────
  const openProblemEditor = (e: React.MouseEvent, problem?: ProgrammingProblem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;

    if (problem) {
      setEditingProblem({ ...problem });
    } else {
      setEditingProblem({
        id: `p-${Date.now()}`,
        topicId: activeTopic?.id || 'syntax-operators',
        track: activeTrack === 'CAMPUS_DSA' ? 'CAMPUS_DSA' : 'PROGRAMMING_150',
        title: '',
        level: 'MEDIUM',
        category: (activeTopic?.category as any) || 'SYNTAX_BASICS',
        categoryLabel: activeTopic?.title || 'General Programming',
        description: '',
        constraints: ['1 <= N <= 10^5'],
        sampleInput: '',
        sampleOutput: '',
        explanation: '',
        solutions: { java: '// Java solution', python: '# Python solution', cpp: '// C++ solution', c: '// C solution' },
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        hints: [],
        companyTags: ['Campus Placement'],
        is_hidden: false,
      });
    }
    setIsEditingProblem(true);
  };

  const saveProblem = async () => {
    if (!editingProblem || !editingProblem.title) {
      alert("Problem title is required.");
      return;
    }

    const res = await technicalService.saveProgrammingProblem({
      ...editingProblem,
      topicId: activeTopic?.id || editingProblem.topicId,
      track: activeTrack === 'CAMPUS_DSA' ? 'CAMPUS_DSA' : 'PROGRAMMING_150',
    });

    if (res.success) {
      setIsEditingProblem(false);
      setEditingProblem(null);
      if (activeTrack === 'CAMPUS_DSA') refetchDsa();
      else refetchP150();
    } else {
      alert("Error saving problem: " + res.error);
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    await technicalService.deleteProgrammingProblem(problemId);
    if (activeTrack === 'CAMPUS_DSA') refetchDsa();
    else refetchP150();
  };

  // ─── ADMIN MCQ ACTIONS ────────────────────────────────────────────────────
  const openMcqEditor = (e: React.MouseEvent, mcq?: TechnicalMcq) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;

    if (mcq) {
      setEditingMcq({ ...mcq });
    } else {
      setEditingMcq({
        id: `mcq-${Date.now()}`,
        topicId: activeTopic?.id || 'mcq-c-programming',
        topic: activeTopic?.title || 'C Programming',
        topicCategory: (activeTopic?.category as any) || 'C_PROGRAMMING',
        question: '',
        codeSnippet: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: '',
        companyTags: ['TCS', 'Infosys'],
        difficulty: 'MEDIUM',
        is_hidden: false,
      });
    }
    setIsEditingMcq(true);
  };

  const saveMcq = async () => {
    if (!editingMcq || !editingMcq.question) {
      alert("MCQ Question is required.");
      return;
    }

    const res = await technicalService.saveTechnicalMcq({
      ...editingMcq,
      topicId: activeTopic?.id || editingMcq.topicId,
      topic: activeTopic?.title || editingMcq.topic,
    });

    if (res.success) {
      setIsEditingMcq(false);
      setEditingMcq(null);
      refetchMcqs();
    } else {
      alert("Error saving MCQ: " + res.error);
    }
  };

  const handleDeleteMcq = async (mcqId: string) => {
    if (!confirm("Are you sure you want to delete this MCQ?")) return;
    await technicalService.deleteTechnicalMcq(mcqId);
    refetchMcqs();
  };

  // ─── ADMIN BULK & VISIBILITY ACTIONS ──────────────────────────────────────
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentList = activeTrack === 'TECHNICAL_MCQS' ? filteredMcqs : filteredProblems;
      setSelectedItemIds(new Set(currentList.map(item => item.id)));
    } else {
      setSelectedItemIds(new Set());
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItemIds.size === 0) return;
    const count = selectedItemIds.size;
    const itemLabel = activeTrack === 'TECHNICAL_MCQS' ? 'MCQ(s)' : 'problem(s)';
    if (!window.confirm(`Are you sure you want to delete ${count} selected ${itemLabel}? This action cannot be undone.`)) return;

    const idsToDelete = Array.from(selectedItemIds);
    if (activeTrack === 'TECHNICAL_MCQS') {
      await technicalService.bulkDeleteTechnicalMcqs(idsToDelete);
      refetchMcqs();
    } else {
      await technicalService.bulkDeleteProgrammingProblems(idsToDelete);
      if (activeTrack === 'CAMPUS_DSA') refetchDsa();
      else refetchP150();
    }
    setSelectedItemIds(new Set());
  };

  const handleToggleProblemVisibility = async (problem: ProgrammingProblem) => {
    const nextHidden = !problem.is_hidden;
    await technicalService.saveProgrammingProblem({
      ...problem,
      is_hidden: nextHidden,
    });
    if (activeTrack === 'CAMPUS_DSA') refetchDsa();
    else refetchP150();
  };

  const handleToggleMcqVisibility = async (mcq: TechnicalMcq) => {
    const nextHidden = !mcq.is_hidden;
    await technicalService.saveTechnicalMcq({
      ...mcq,
      is_hidden: nextHidden,
    });
    refetchMcqs();
  };

  return (
    <div className={`space-y-6 animate-fadeIn pb-12 font-sans relative ${activeTopic ? 'max-w-4xl mx-auto' : 'max-w-6xl mx-auto'}`}>
      {/* ────────────────────────────────────────────────────────────────────────
          TOPIC QUESTIONS VIEW (When a Topic is Selected in Any Track)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTopic ? (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={clearSelectedTopic}
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#868E96] dark:text-[#999999] hover:text-[#FD4A32] dark:hover:text-[#FD4A32] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Topic Directory</span>
            </button>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={(e) => activeTrack === 'TECHNICAL_MCQS' ? openMcqEditor(e) : openProblemEditor(e)}
                    className="px-2.5 py-1 bg-[#FD4A32] hover:bg-[#E0351D] text-white rounded-md text-xs font-display font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{activeTrack === 'TECHNICAL_MCQS' ? 'Add MCQ' : 'Add Problem'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(true)}
                    className="px-2.5 py-1 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-md text-xs font-display font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Bulk import questions for this topic (JSON)"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Bulk Import (JSON)</span>
                  </button>
                </>
              )}
              <span className="text-xs text-[#868E96] dark:text-[#555555]">
                Topic Practice Mode
              </span>
            </div>
          </div>

          {/* 2. Topic Header Banner */}
          <div className="p-5 sm:p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#121417] dark:text-[#FFFFFF] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#FD4A32] bg-[#FD4A32]/10 border border-[#FD4A32]/25 px-2 py-0.5 rounded">
                    {activeTopic.cluster}
                  </span>
                  {activeTopic.is_hidden && (
                    <span className="text-[9px] font-mono font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30 px-2 py-0.5 rounded">
                      Hidden from students
                    </span>
                  )}
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
                  {activeTopic.title}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-sans max-w-xl">
                  {activeTopic.description}
                </p>
              </div>

              {/* Solved Counter & Radial / Bar */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E9ECEF] dark:border-[#242424]">
                <span className="text-[11px] font-mono text-[#868E96] dark:text-[#777777]">
                  Topic Progress
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400">
                    {activeTopicSolvedCount}
                  </span>
                  <span className="font-display text-xs text-[#868E96]">
                    / {activeTopicTotalCount} ({topicPercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Filter Bar & Search inside topic */}
          {activeTrack === 'TECHNICAL_MCQS' ? (
            <div className="p-3.5 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center flex-wrap gap-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
                      Status:
                    </span>
                    <div className="inline-flex items-center p-0.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
                      {[
                        { id: 'ALL', label: 'All' },
                        { id: 'UNSOLVED', label: 'Unsolved' },
                        { id: 'SOLVED', label: `Solved (${activeTopicSolvedCount})` },
                        { id: 'RETRY', label: 'Needs Retry' },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedStatus(item.id as any)}
                          className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all cursor-pointer ${
                            selectedStatus === item.id
                              ? 'bg-[#FD4A32] text-white shadow-xs'
                              : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-48 sm:w-56">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
                    <input
                      type="text"
                      placeholder="Search MCQs..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className={`p-1.5 rounded-md border text-xs transition-all cursor-pointer ${
                      isMuted
                        ? 'bg-[#F8F9FA] dark:bg-[#1C1C1C] border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96]'
                        : 'bg-[#FD4A32]/10 border-[#FD4A32]/30 text-[#FD4A32]'
                    }`}
                    title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center flex-wrap gap-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
                      Difficulty:
                    </span>
                    <div className="inline-flex items-center p-0.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
                      {[
                        { id: 'ALL', label: 'All Levels' },
                        { id: 'BASIC', label: 'Basic' },
                        { id: 'MEDIUM', label: 'Medium' },
                        { id: 'HARD', label: 'Hard' },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedLevel(item.id)}
                          className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all cursor-pointer ${
                            selectedLevel === item.id
                              ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                              : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
                      Status:
                    </span>
                    <div className="inline-flex items-center p-0.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
                      {[
                        { id: 'ALL', label: 'All' },
                        { id: 'UNSOLVED', label: 'Unsolved' },
                        { id: 'SOLVED', label: `Solved (${activeTopicSolvedCount})` },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedStatus(item.id as any)}
                          className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all cursor-pointer ${
                            selectedStatus === item.id
                              ? 'bg-[#FD4A32] text-white shadow-xs'
                              : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative w-48 sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Admin Bulk Actions */}
          {isAdmin && (activeTrack === 'TECHNICAL_MCQS' ? filteredMcqs.length > 0 : filteredProblems.length > 0) && (
            <div className="flex items-center gap-3 bg-[#F8F9FA] dark:bg-[#0C0C0C] px-3 py-1.5 rounded-md border border-[#E9ECEF] dark:border-[#242424]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedItemIds.size > 0 &&
                    selectedItemIds.size === (activeTrack === 'TECHNICAL_MCQS' ? filteredMcqs.length : filteredProblems.length)
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E9ECEF] dark:border-[#242424] text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-xs font-display font-bold text-[#121417] dark:text-[#FFFFFF]">
                  Select All
                </span>
              </label>

              {selectedItemIds.size > 0 && (
                <>
                  <div className="w-px h-4 bg-[#E9ECEF] dark:bg-[#242424]"></div>
                  <span className="text-xs font-display font-bold text-[#868E96] dark:text-[#555555]">
                    {selectedItemIds.size} selected
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

          {/* 4. Full-Width Questions / MCQs List */}
          {activeTrack === 'TECHNICAL_MCQS' ? (
            <div className="space-y-4">
              {activeTopic && activeTopicMcqs.length === 0 ? (
                <div className="p-12 text-center rounded-xl border-2 border-dashed border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] space-y-3">
                  <HelpCircle className="w-10 h-10 text-[#868E96] mx-auto opacity-50" />
                  <h3 className="font-display font-bold text-base text-[#121417] dark:text-white">
                    No MCQs in this topic yet
                  </h3>
                  <p className="text-xs text-[#868E96] dark:text-[#777777] max-w-sm mx-auto">
                    Add multiple-choice questions individually or use Bulk Import to paste a JSON array of MCQs with options and explanations.
                  </p>
                  {isAdmin && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => openMcqEditor(e)}
                        className="px-3.5 py-1.5 bg-[#FD4A32] hover:bg-[#E0351D] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add MCQ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBulkModal(true)}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Bulk Import (JSON)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : filteredMcqs.length === 0 ? (
                <div className="p-10 text-center rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414]">
                  <HelpCircle className="w-8 h-8 text-[#868E96] mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-[#868E96] dark:text-[#555555]">
                    No MCQs match your selected status or search filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStatus('ALL');
                      setSearchQuery('');
                    }}
                    className="mt-3 px-3 py-1.5 bg-[#FD4A32] text-white rounded-md text-xs font-display font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredMcqs.map((mcq, idx) => {
                  const prog = mcqProgress[mcq.id];
                  const isSolved = prog?.solved ?? false;
                  const wrongPicks = prog?.wrongPicks ?? [];
                  const isExplVisible = !!revealedMcqExpl[mcq.id];

                  return (
                    <div
                      key={mcq.id}
                      className={`p-5 sm:p-6 rounded-xl border transition-all duration-300 space-y-4 shadow-xs relative ${
                        mcq.is_hidden
                          ? 'opacity-70 border-dashed border-amber-500/50 bg-amber-500/5'
                          : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] hover:border-[#FD4A32]/40 text-[#121417] dark:text-[#FFFFFF]'
                      } ${selectedItemIds.has(mcq.id) ? 'ring-2 ring-purple-500/50 border-purple-500 shadow-md' : ''}`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E9ECEF] dark:border-[#242424]">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isAdmin && (
                            <input
                              type="checkbox"
                              checked={selectedItemIds.has(mcq.id)}
                              onChange={() => toggleItemSelection(mcq.id)}
                              className="w-4 h-4 mr-1 rounded border-[#E9ECEF] dark:border-[#242424] text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                          )}

                          <span className="px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] font-display font-bold text-[10px] tracking-tight border border-[#FD4A32]/25">
                            Q{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-2 py-0.5 rounded font-semibold">
                            {mcq.topic}
                          </span>

                          {mcq.is_hidden && (
                            <span className="text-[9px] font-display font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              <span>Hidden</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isSolved ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Solved</span>
                            </span>
                          ) : wrongPicks.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                              <span>Needs Retry</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-display font-medium text-[#868E96] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-2 py-0.5 rounded">
                              <Circle className="w-3 h-3" />
                              <span>Unsolved</span>
                            </span>
                          )}

                          {isAdmin && (
                            <div className="flex items-center gap-1 ml-2 border-l border-gray-200 dark:border-gray-800 pl-2">
                              <button
                                type="button"
                                onClick={() => handleToggleMcqVisibility(mcq)}
                                className={`p-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                                  mcq.is_hidden
                                    ? 'bg-amber-500/20 text-amber-600 border border-amber-500/40'
                                    : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                                }`}
                                title={mcq.is_hidden ? 'Publish MCQ' : 'Hide MCQ'}
                              >
                                {mcq.is_hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => openMcqEditor(e, mcq)}
                                className="p-1 rounded bg-blue-500/20 text-blue-600 border border-blue-500/40 hover:bg-blue-500/30 transition-all"
                                title="Edit MCQ"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMcq(mcq.id)}
                                className="p-1 rounded bg-rose-500/20 text-rose-600 border border-rose-500/40 hover:bg-rose-500/30 transition-all"
                                title="Delete MCQ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="text-xs sm:text-sm font-semibold text-[#121417] dark:text-[#FFFFFF] leading-relaxed">
                        {mcq.question}
                      </div>

                      {/* Optional Code Snippet */}
                      {mcq.codeSnippet && (
                        <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#242424] font-mono text-xs text-emerald-400 overflow-x-auto">
                          <pre>{mcq.codeSnippet}</pre>
                        </div>
                      )}

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {mcq.options.map((opt, optIdx) => {
                          const isOptionCorrect = optIdx === mcq.correctOptionIndex;
                          const wasPickedWrong = wrongPicks.includes(optIdx);
                          const isPickedAndCorrect = isSolved && isOptionCorrect;

                          let btnClasses =
                            'bg-[#F8F9FA] dark:bg-[#191919] border-[#E9ECEF] dark:border-[#2A2A2A] text-[#121417] dark:text-[#EEEEEE] hover:border-[#FD4A32]';
                          if (isPickedAndCorrect) {
                            btnClasses =
                              'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-bold';
                          } else if (wasPickedWrong) {
                            btnClasses =
                              'bg-rose-500/15 border-rose-500/50 text-rose-700 dark:text-rose-300 font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectMcqOption(mcq, optIdx)}
                              className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${btnClasses}`}
                            >
                              <span className="font-mono font-bold text-[10px] w-5 h-5 rounded flex items-center justify-center bg-black/5 dark:bg-white/10 shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="font-sans flex-1 leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Footer: View Explanation Toggle & Live Status */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
                        <div>
                          <button
                            type="button"
                            onClick={() => toggleMcqExplanation(mcq.id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#FD4A32] hover:text-[#E0351D] transition-colors cursor-pointer"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>{isExplVisible ? 'Hide Explanation' : 'View Explanation'}</span>
                          </button>
                        </div>

                        <div>
                          {isSolved ? (
                            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Correct! Question Solved</span>
                            </span>
                          ) : wrongPicks.length > 0 ? (
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-rose-500" />
                              <span>Incorrect option. Dry-run and try again!</span>
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Explanation Accordion */}
                      {isExplVisible && (
                        <div className="p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-2.5 animate-fadeIn text-xs">
                          <div className="flex items-center gap-2 text-xs font-display font-bold text-[#FD4A32]">
                            <Zap className="w-3.5 h-3.5 text-[#FD4A32]" />
                            <span>Correct Answer: Option ({String.fromCharCode(65 + mcq.correctOptionIndex)})</span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-sans whitespace-pre-line text-xs">
                            {mcq.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {activeTopic && activeTopicProblems.length === 0 ? (
                <div className="p-12 text-center rounded-xl border-2 border-dashed border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] space-y-3">
                  <Code2 className="w-10 h-10 text-[#868E96] mx-auto opacity-50" />
                  <h3 className="font-display font-bold text-base text-[#121417] dark:text-white">
                    No coding problems in this topic yet
                  </h3>
                  <p className="text-xs text-[#868E96] dark:text-[#777777] max-w-sm mx-auto">
                    Add problems individually or use Bulk Import to paste a JSON array of coding problems with solutions and test cases.
                  </p>
                  {isAdmin && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => openProblemEditor(e)}
                        className="px-3.5 py-1.5 bg-[#FD4A32] hover:bg-[#E0351D] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Problem</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBulkModal(true)}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Bulk Import (JSON)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="p-10 text-center rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414]">
                  <Code2 className="w-8 h-8 text-[#868E96] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#868E96] dark:text-[#555555]">
                    No questions match your selected difficulty or status filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLevel('ALL');
                      setSelectedStatus('ALL');
                      setSearchQuery('');
                    }}
                    className="mt-3 px-3 py-1.5 bg-[#FD4A32] text-white rounded-md text-xs font-display font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredProblems.map((problem, index) => {
                  const isSolved = problem.solved;
                  const isExpanded = expandedSolutions[problem.id] ?? false;
                  const activeLang = problemLanguages[problem.id] || 'java';
                  const isCopied = copiedId === problem.id;

                  return (
                    <div
                      key={problem.id}
                      className={`p-5 sm:p-6 rounded-xl border transition-all duration-300 space-y-4 shadow-xs relative ${
                        problem.is_hidden
                          ? 'opacity-70 border-dashed border-amber-500/50 bg-amber-500/5'
                          : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] hover:border-[#FD4A32]/40 text-[#121417] dark:text-[#FFFFFF]'
                      } ${selectedItemIds.has(problem.id) ? 'ring-2 ring-purple-500/50 border-purple-500 shadow-md' : ''}`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E9ECEF] dark:border-[#242424]">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isAdmin && (
                            <input
                              type="checkbox"
                              checked={selectedItemIds.has(problem.id)}
                              onChange={() => toggleItemSelection(problem.id)}
                              className="w-4 h-4 mr-1 rounded border-[#E9ECEF] dark:border-[#242424] text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                          )}

                          <span className="px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] font-display font-bold text-[10px] tracking-tight border border-[#FD4A32]/25">
                            Question #{index + 1}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 text-[9px] font-display font-bold px-2 py-0.5 rounded border ${
                              problem.level === 'BASIC'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                : problem.level === 'MEDIUM'
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                problem.level === 'BASIC'
                                  ? 'bg-emerald-500'
                                  : problem.level === 'MEDIUM'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              } animate-pulse`}
                            />
                            <span>{problem.level}</span>
                          </span>

                          {problem.is_hidden && (
                            <span className="text-[9px] font-display font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              <span>Hidden</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSolve(problem.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-display font-bold transition-all border cursor-pointer ${
                              isSolved
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                                : 'bg-[#F8F9FA] dark:bg-[#202020] border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] hover:text-emerald-600 hover:border-emerald-500/30'
                            }`}
                            title={isSolved ? 'Click to mark as unsolved' : 'Click to mark as solved'}
                          >
                            {isSolved ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Solved</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-3.5 h-3.5" />
                                <span>Mark Solved</span>
                              </>
                            )}
                          </button>

                          {isAdmin && (
                            <div className="flex items-center gap-1 ml-2 border-l border-gray-200 dark:border-gray-800 pl-2">
                              <button
                                type="button"
                                onClick={() => handleToggleProblemVisibility(problem)}
                                className={`p-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                                  problem.is_hidden
                                    ? 'bg-amber-500/20 text-amber-600 border border-amber-500/40'
                                    : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                                }`}
                                title={problem.is_hidden ? 'Publish Problem' : 'Hide Problem'}
                              >
                                {problem.is_hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => openProblemEditor(e, problem)}
                                className="p-1 rounded bg-blue-500/20 text-blue-600 border border-blue-500/40 hover:bg-blue-500/30 transition-all"
                                title="Edit Problem"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProblem(problem.id)}
                                className="p-1 rounded bg-rose-500/20 text-rose-600 border border-rose-500/40 hover:bg-rose-500/30 transition-all"
                                title="Delete Problem"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 1. Problem Title */}
                      <h3 className="font-display text-base sm:text-lg font-bold text-[#121417] dark:text-[#FFFFFF] leading-snug">
                        {problem.title}
                      </h3>

                      {/* 2. Problem Statement / Description */}
                      <div className="text-xs sm:text-sm text-[#495057] dark:text-[#CCCCCC] leading-relaxed bg-[#F8F9FA] dark:bg-[#0C0C0C] p-3.5 rounded-lg border border-[#E9ECEF] dark:border-[#242424] font-sans whitespace-pre-line">
                        {problem.description}
                      </div>

                      {/* 3. Constraints */}
                      {problem.constraints && problem.constraints.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#868E96] dark:text-[#888888] uppercase tracking-wider block font-display">
                            Constraints:
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-xs font-mono text-[#495057] dark:text-[#CCCCCC]">
                            {problem.constraints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 4. Sample Test Cases */}
                      {(problem.sampleCases || problem.testCases) && (problem.sampleCases || problem.testCases)!.length > 0 ? (
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-[#868E96] dark:text-[#888888] uppercase tracking-wider block font-display">
                            Sample Test Cases (Campus Standard):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {(problem.sampleCases || problem.testCases)!.map((tc, tcIdx) => (
                              <div
                                key={tcIdx}
                                className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-1.5 text-xs font-mono"
                              >
                                <div className="flex items-center justify-between text-[10px] text-[#FD4A32] font-bold">
                                  <span>Test Case #{tcIdx + 1}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">Input:</span>
                                  <pre className="text-gray-800 dark:text-gray-200 text-xs overflow-x-auto whitespace-pre-wrap">
                                    {tc.input}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-[10px] text-[#868E96] block uppercase tracking-wider">Output:</span>
                                  <pre className="text-emerald-600 dark:text-emerald-400 text-xs font-bold overflow-x-auto whitespace-pre-wrap">
                                    {tc.output}
                                  </pre>
                                </div>
                                {tc.explanation && (
                                  <div className="pt-1 border-t border-[#E9ECEF] dark:border-[#242424] text-[11px] text-gray-500 dark:text-gray-400 font-sans">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Note: </span>
                                    {tc.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (problem.sampleInput || problem.sampleOutput) && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-[#868E96] uppercase tracking-wider block font-display">
                            Sample Test Case:
                          </span>
                          <pre className="test-case text-xs p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] font-mono text-[#121417] dark:text-[#E9ECEF] overflow-x-auto whitespace-pre-wrap">
                            {problem.sampleInput && `Input:\n${problem.sampleInput}\n`}
                            {problem.sampleOutput && `\nOutput:\n${problem.sampleOutput}`}
                          </pre>
                        </div>
                      )}

                      {/* 5. Collapsible Solution Accordion */}
                      <div className="pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
                        <button
                          type="button"
                          onClick={() => toggleSolution(problem.id)}
                          className="flex items-center gap-2 text-xs font-bold text-[#FD4A32] hover:text-[#E0351D] transition-colors cursor-pointer"
                        >
                          <Code2 className="w-4 h-4" />
                          <span>{isExpanded ? 'Hide Solution & Code' : 'View Verified Solution & Code'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 space-y-3 p-4 bg-[#0C0C0C] dark:bg-[#000000] text-white rounded-xl border border-[#242424] animate-fadeIn">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#242424]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {(['java', 'python', 'cpp', 'c'] as const).map(lang => (
                                  <button
                                    key={lang}
                                    type="button"
                                    onClick={() => setProblemLanguage(problem.id, lang)}
                                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border cursor-pointer ${
                                      activeLang === lang
                                        ? 'bg-[#FD4A32] text-white border-[#FD4A32] shadow-xs'
                                        : 'bg-[#1A1A1A] border-[#333333] text-[#AAAAAA] hover:text-white'
                                    }`}
                                  >
                                    {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
                                  </button>
                                ))}
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono text-[#888888] bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#2B2B2B]">
                                  Time: {problem.timeComplexity}
                                </span>
                                <span className="text-[10px] font-mono text-[#888888] bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#2B2B2B]">
                                  Space: {problem.spaceComplexity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(problem.solutions[activeLang] || '', problem.id)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-[#CCCCCC] hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                                >
                                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                                </button>
                              </div>
                            </div>

                            <div className="bg-[#050505] rounded-lg p-3.5 border border-[#1E1E1E] overflow-x-auto text-xs font-mono text-emerald-400">
                              <pre>{problem.solutions[activeLang] || '// Solution not available in this language'}</pre>
                            </div>

                            {problem.explanation && (
                              <div className="p-3 rounded-lg bg-[#141414] border border-[#242424] space-y-1 text-xs">
                                <span className="font-bold flex items-center gap-1.5 text-[10px] text-[#FD4A32] uppercase tracking-wider">
                                  <Lightbulb className="w-3.5 h-3.5 text-[#FD4A32]" />
                                  Explanation &amp; Approach
                                </span>
                                <p className="text-gray-300 leading-relaxed font-sans text-xs">
                                  {problem.explanation}
                                </p>
                              </div>
                            )}

                            {problem.hints && problem.hints.length > 0 && (
                              <div className="p-3 rounded-lg bg-[#141414] border border-[#242424] space-y-1 text-xs">
                                <span className="font-bold flex items-center gap-1.5 text-[10px] text-amber-400 uppercase tracking-wider">
                                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                                  Hints &amp; Edge Cases
                                </span>
                                <ul className="list-disc pl-4 space-y-0.5 text-gray-300 text-xs font-sans">
                                  {problem.hints.map((hint, hIdx) => (
                                    <li key={hIdx}>{hint}</li>
                                  ))}
                                </ul>
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
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
                  {activeTrack === 'TECHNICAL_MCQS' ? (
                    <BookOpen className="w-3 h-3 text-[#FD4A32]" />
                  ) : (
                    <Terminal className="w-3 h-3 text-[#FD4A32]" />
                  )}
                  <span>
                    {activeTrack === 'TECHNICAL_MCQS'
                      ? 'Technical MCQs Topic Directory'
                      : 'Technical & Coding Hub'}
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
                  {activeTrack === 'PROGRAMMING_150' && 'Programming 150'}
                  {activeTrack === 'CAMPUS_DSA' && 'Campus DSA Core (Top 100 Patterns)'}
                  {activeTrack === 'TECHNICAL_MCQS' && 'Technical MCQs & Practice'}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-sans mt-0.5">
                  {activeTrack === 'PROGRAMMING_150' &&
                    'Structured 15-topic syllabus across 6 progressive stages building syntax foundations, loop mechanics, number logic, patterns, arrays, strings, and recursion.'}
                  {activeTrack === 'CAMPUS_DSA' &&
                    'Curated 15 repeatable campus placement patterns frequently tested in Amazon, TCS Prime, and Infosys SP.'}
                  {activeTrack === 'TECHNICAL_MCQS' &&
                    'Subject-wise campus placement MCQs across C, C++, C#, Java, Database, Networks, OS, and Data Structures.'}
                </p>
              </div>

              {/* Embedded Donut & Difficulty Progress */}
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
                      {activeTrackSolved > 0 && (
                        <circle
                          cx="35"
                          cy="35"
                          r={radius}
                          className="stroke-[#FD4A32] transition-all duration-700 ease-out"
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={codingDashOffset}
                          strokeLinecap="round"
                          fill="none"
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none px-1">
                      <span className="font-mono font-bold text-xs text-[#121417] dark:text-white tracking-tight leading-none">
                        {activeTrackSolved}/{activeTrackTotal}
                      </span>
                    </div>
                  </div>

                  {activeTrack === 'TECHNICAL_MCQS' ? (
                    <div className="grid grid-cols-3 gap-3 flex-1 max-w-md">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                          <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">Solved</span>
                          <span className="text-[#868E96] dark:text-[#666666]">{mcqSolvedCount}/{mcqs.length}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${mcqs.length > 0 ? Math.round((mcqSolvedCount / mcqs.length) * 100) : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                          <span className="font-display font-bold text-amber-600 dark:text-amber-400">Needs Retry</span>
                          <span className="text-[#868E96] dark:text-[#666666]">{mcqRetryCount}/{mcqs.length}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${mcqs.length > 0 ? Math.round((mcqRetryCount / mcqs.length) * 100) : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                          <span className="font-display font-bold text-rose-600 dark:text-rose-400">Unsolved</span>
                          <span className="text-[#868E96] dark:text-[#666666]">{mcqUnsolvedCount}/{mcqs.length}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${mcqs.length > 0 ? Math.round((mcqUnsolvedCount / mcqs.length) * 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 flex-1 max-w-md">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                          <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">Basic</span>
                          <span className="text-[#868E96] dark:text-[#666666]">{basicSolved}/{basicProblems.length}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${basicPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                          <span className="font-display font-bold text-amber-600 dark:text-amber-400">Medium</span>
                          <span className="text-[#868E96] dark:text-[#666666]">{mediumSolved}/{mediumProblems.length}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${mediumPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                          <span className="font-display font-bold text-rose-600 dark:text-rose-400">Hard</span>
                          <span className="text-[#868E96] dark:text-[#666666]">{hardSolved}/{hardProblems.length}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${hardPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 🏷️ 2. STAGE CLUSTER FILTER PILLS + SEARCH BAR + ADMIN ACTIONS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 max-w-full">
              {stages.map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStage(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    selectedStage === st
                      ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                      : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <div className="relative w-48 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
                <input
                  type="text"
                  placeholder={
                    activeTrack === 'PROGRAMMING_150'
                      ? 'Search topics...'
                      : activeTrack === 'CAMPUS_DSA'
                      ? 'Search patterns...'
                      : 'Search MCQ topics...'
                  }
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                />
              </div>

              {activeTrack === 'TECHNICAL_MCQS' && (
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`p-1.5 rounded-md border text-xs transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-[#F8F9FA] dark:bg-[#1C1C1C] border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96]'
                      : 'bg-[#FD4A32]/10 border-[#FD4A32]/30 text-[#FD4A32]'
                  }`}
                  title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => openTopicEditor(e)}
                  className="px-3 py-1 bg-[#FD4A32] hover:bg-[#E0351D] text-white rounded-md text-xs font-display font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  title="Add New Technical Topic"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Topic</span>
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowBulkModal(true)}
                  className="px-3 py-1 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 rounded-md text-xs font-display font-bold transition-all border border-purple-500/30 flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                  title="Bulk import questions from JSON"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Bulk Import (JSON)</span>
                </button>
              )}
            </div>
          </div>

          {/* 📁 3. TOPIC DIRECTORY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredTopics.length === 0 ? (
              <div className="col-span-full p-10 text-center rounded-xl border border-dashed border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414]">
                <Code2 className="w-8 h-8 text-[#868E96] mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-[#868E96] dark:text-[#555555]">
                  No topics found matching your selected stage or search keywords.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStage(
                      activeTrack === 'PROGRAMMING_150'
                        ? stages[0] || 'Stage 1: Language & Control Flow'
                        : activeTrack === 'CAMPUS_DSA'
                        ? 'All Patterns'
                        : 'All Topics'
                    );
                    setSearchQuery('');
                  }}
                  className="mt-3 px-3 py-1.5 bg-[#FD4A32] text-white rounded-md text-xs font-display font-bold cursor-pointer"
                >
                  {activeTrack === 'PROGRAMMING_150' ? 'Reset to Stage 1' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              filteredTopics.map(topic => {
                const TopicIcon = TOPIC_ICON_MAP[topic.icon_name || topic.iconName] || Code2;
                const liveCount = liveCountMap[topic.id] ?? 0;
                let countText = `${liveCount} Items`;
                let solvedCount = 0;

                if (activeTrack === 'TECHNICAL_MCQS') {
                  const topicMcqs = mcqs.filter(m => m.topicId === topic.id);
                  solvedCount = topicMcqs.filter(m => mcqProgress[m.id]?.solved).length;
                  countText = `${liveCount > 0 ? liveCount : topicMcqs.length} MCQs`;
                } else if (activeTrack === 'CAMPUS_DSA') {
                  const topicProblems = dsaProblems.filter(p => p.topicId === topic.id);
                  solvedCount = topicProblems.filter(p => p.solved).length;
                  countText = `${liveCount > 0 ? liveCount : topicProblems.length} Problems`;
                } else {
                  const topicProblems = p150Problems.filter(p => p.topicId === topic.id);
                  solvedCount = topicProblems.filter(p => p.solved).length;
                  countText = `${liveCount > 0 ? liveCount : topicProblems.length} Problems`;
                }

                return (
                  <div
                    key={topic.id}
                    onClick={() => selectTopic(topic.id)}
                    className={`group flex items-center justify-between p-3.5 bg-white dark:bg-[#141414] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] border ${
                      topic.is_hidden
                        ? 'border-amber-500/40 opacity-75'
                        : 'border-[#E9ECEF] dark:border-[#242424] hover:border-[#FD4A32]/50 dark:hover:border-[#FD4A32]/50'
                    } rounded-lg transition-all duration-150 shadow-2xs cursor-pointer`}
                  >
                    {/* Left: Icon & Title & Description */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 border border-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                        <TopicIcon className="w-4 h-4 text-[#FD4A32]" />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-bold text-xs sm:text-sm text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] transition-colors truncate">
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

                    {/* Right: Solved Badge & Admin Controls / Explore Link */}
                    <div className="flex items-center gap-2 shrink-0">
                      {solvedCount > 0 && (
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {solvedCount} Solved
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

                      <div className="flex items-center gap-1 text-[11px] font-display font-bold text-[#121417] dark:text-[#E9ECEF] bg-[#F1F3F5] dark:bg-[#202020] px-2.5 py-1 rounded border border-[#E9ECEF] dark:border-[#2E2E2E] group-hover:border-[#FD4A32] group-hover:text-[#FD4A32] transition-colors">
                        <span>{countText}</span>
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

      {/* 💻 ADMIN BULK JSON IMPORT MODAL */}
      {showBulkModal && (
        <TechnicalBulkImportModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            refetchP150();
          }}
          defaultTopicId={activeTopic?.id}
          topics={topics}
        />
      )}

      {/* 🛠️ ADMIN TOPIC EDITOR MODAL */}
      {isEditingTopic && editingTopic && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {editingTopic.id && topics.some(t => t.id === editingTopic.id) ? 'Edit Technical Topic' : 'Add Technical Topic'}
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
                    placeholder="e.g. syntax-operators"
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Track
                  </label>
                  <select
                    value={editingTopic.track || activeTrack}
                    onChange={e => setEditingTopic({ ...editingTopic, track: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#181818] rounded-md text-gray-900 dark:text-white"
                  >
                    <option value="PROGRAMMING_150">Programming 150</option>
                    <option value="CAMPUS_DSA">Campus DSA</option>
                    <option value="TECHNICAL_MCQS">Technical MCQs</option>
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
                  placeholder="e.g. Syntax, Operators & Typecasting"
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Cluster / Stage Header
                  </label>
                  <input
                    type="text"
                    value={editingTopic.cluster || ''}
                    onChange={e => setEditingTopic({ ...editingTopic, cluster: e.target.value })}
                    placeholder="e.g. Stage 1: Language & Control Flow"
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Icon Name
                  </label>
                  <select
                    value={editingTopic.icon_name || editingTopic.iconName || 'Code2'}
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
                  placeholder="Overview of this topic..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="topic_is_hidden"
                  checked={!!editingTopic.is_hidden}
                  onChange={e => setEditingTopic({ ...editingTopic, is_hidden: e.target.checked })}
                  className="rounded text-[#FD4A32] focus:ring-[#FD4A32]"
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
                className="px-4 py-1.5 rounded-md bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Topic to Supabase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛠️ ADMIN PROBLEM EDITOR MODAL */}
      {isEditingProblem && editingProblem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {editingProblem.id ? 'Edit Coding Problem' : 'Add Coding Problem'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsEditingProblem(false); setEditingProblem(null); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    value={editingProblem.title || ''}
                    onChange={e => setEditingProblem({ ...editingProblem, title: e.target.value })}
                    placeholder="e.g. Reverse a Number"
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={editingProblem.level || 'MEDIUM'}
                    onChange={e => setEditingProblem({ ...editingProblem, level: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#181818] rounded-md text-gray-900 dark:text-white"
                  >
                    <option value="BASIC">BASIC</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Problem Description *
                </label>
                <textarea
                  rows={3}
                  value={editingProblem.description || ''}
                  onChange={e => setEditingProblem({ ...editingProblem, description: e.target.value })}
                  placeholder="Given an integer N..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Sample Input
                  </label>
                  <input
                    type="text"
                    value={editingProblem.sampleInput || ''}
                    onChange={e => setEditingProblem({ ...editingProblem, sampleInput: e.target.value })}
                    placeholder="e.g. N = 1221"
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Sample Output
                  </label>
                  <input
                    type="text"
                    value={editingProblem.sampleOutput || ''}
                    onChange={e => setEditingProblem({ ...editingProblem, sampleOutput: e.target.value })}
                    placeholder="e.g. true"
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Java Solution
                </label>
                <textarea
                  rows={3}
                  value={editingProblem.solutions?.java || ''}
                  onChange={e => setEditingProblem({
                    ...editingProblem,
                    solutions: { ...(editingProblem.solutions || {}), java: e.target.value }
                  })}
                  placeholder="public class Solution { ... }"
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-[#0A0A0A] rounded-md text-emerald-400 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Python Solution
                </label>
                <textarea
                  rows={3}
                  value={editingProblem.solutions?.python || ''}
                  onChange={e => setEditingProblem({
                    ...editingProblem,
                    solutions: { ...(editingProblem.solutions || {}), python: e.target.value }
                  })}
                  placeholder="def solve(n): ..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-[#0A0A0A] rounded-md text-emerald-400 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Explanation &amp; Approach
                </label>
                <textarea
                  rows={2}
                  value={editingProblem.explanation || ''}
                  onChange={e => setEditingProblem({ ...editingProblem, explanation: e.target.value })}
                  placeholder="Approach and logic..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Time Complexity
                  </label>
                  <input
                    type="text"
                    value={editingProblem.timeComplexity || 'O(N)'}
                    onChange={e => setEditingProblem({ ...editingProblem, timeComplexity: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Space Complexity
                  </label>
                  <input
                    type="text"
                    value={editingProblem.spaceComplexity || 'O(1)'}
                    onChange={e => setEditingProblem({ ...editingProblem, spaceComplexity: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              <button
                type="button"
                onClick={() => { setIsEditingProblem(false); setEditingProblem(null); }}
                className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveProblem}
                className="px-4 py-1.5 rounded-md bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Problem to Supabase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛠️ ADMIN MCQ EDITOR MODAL */}
      {isEditingMcq && editingMcq && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-8 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {editingMcq.id ? 'Edit Technical MCQ' : 'Add Technical MCQ'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsEditingMcq(false); setEditingMcq(null); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  MCQ Question Statement *
                </label>
                <textarea
                  rows={2}
                  value={editingMcq.question || ''}
                  onChange={e => setEditingMcq({ ...editingMcq, question: e.target.value })}
                  placeholder="What is the output of..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Code Snippet (Optional)
                </label>
                <textarea
                  rows={3}
                  value={editingMcq.codeSnippet || ''}
                  onChange={e => setEditingMcq({ ...editingMcq, codeSnippet: e.target.value })}
                  placeholder="#include<stdio.h> ..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-[#0A0A0A] rounded-md text-emerald-400 font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-gray-700 dark:text-gray-300">
                  Options (Select correct radio)
                </label>
                {(editingMcq.options || ['', '', '', '']).map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_mcq_opt"
                      checked={(editingMcq.correctOptionIndex ?? 0) === i}
                      onChange={() => setEditingMcq({ ...editingMcq, correctOptionIndex: i })}
                      className="text-[#FD4A32] focus:ring-[#FD4A32]"
                    />
                    <span className="font-mono font-bold text-gray-500 w-4">{String.fromCharCode(65 + i)}</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={e => {
                        const newOpts = [...(editingMcq.options || ['', '', '', ''])];
                        newOpts[i] = e.target.value;
                        setEditingMcq({ ...editingMcq, options: newOpts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Explanation
                </label>
                <textarea
                  rows={2}
                  value={editingMcq.explanation || ''}
                  onChange={e => setEditingMcq({ ...editingMcq, explanation: e.target.value })}
                  placeholder="Detailed explanation of the correct answer..."
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md text-gray-900 dark:text-white font-sans text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              <button
                type="button"
                onClick={() => { setIsEditingMcq(false); setEditingMcq(null); }}
                className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveMcq}
                className="px-4 py-1.5 rounded-md bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save MCQ to Supabase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💻 ADMIN BULK JSON IMPORT MODAL */}
      {showBulkModal && (
        <TechnicalBulkImportModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            if (activeTrack === 'TECHNICAL_MCQS') {
              refetchMcqs();
            } else if (activeTrack === 'CAMPUS_DSA') {
              refetchDsa();
            } else {
              refetchP150();
            }
          }}
          defaultTopicId={activeTopic?.id}
          topics={topics}
          track={activeTrack}
        />
      )}
    </div>
  );
}
