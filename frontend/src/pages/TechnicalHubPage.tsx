import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
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
};

export default function TechnicalHubPage() {
  const { isAdmin } = useAuth();
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
    setSelectedStage('ALL');
    setSearchQuery('');
  };

  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'UNSOLVED' | 'SOLVED' | 'RETRY'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<ProgrammingProblem | null>(null);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [problemLanguages, setProblemLanguages] = useState<Record<string, 'java' | 'python' | 'cpp' | 'c'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);

  // Technical MCQ Progress & State (Aptitude-Grade Active Learning)
  const [mcqProgress, setMcqProgress] = useState<Record<string, TechnicalMcqProgress>>(() =>
    technicalService.getMcqProgress()
  );
  const [revealedMcqExpl, setRevealedMcqExpl] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState<boolean>(() => audioEffects.getMuted());

  const handleToggleSound = () => {
    const next = audioEffects.toggleMute();
    setIsMuted(next);
  };

  // Query Programming Topics (15 Structured Syllabus Topics)
  const { data: topics = [] } = useQuery<ProgrammingTopic[]>({
    queryKey: ['programming-topics'],
    queryFn: () => technicalService.getProgrammingTopics(),
  });

  // Query Programming 150 Problems (Seed + Custom Imported)
  const { data: p150Problems = [], refetch: refetchP150 } = useQuery({
    queryKey: ['programming-150-problems'],
    queryFn: () => technicalService.getProgramming150Problems(),
  });

  // Query Campus DSA Problems
  const { data: dsaProblems = [], refetch: refetchDsa } = useQuery({
    queryKey: ['campus-dsa-problems'],
    queryFn: () => technicalService.getCampusDsaProblems(),
  });

  // Query Technical MCQs
  const { data: mcqs = [] } = useQuery({
    queryKey: ['technical-mcqs'],
    queryFn: () => technicalService.getTechnicalMcqs(),
  });

  // Active list based on track
  const currentProblems = useMemo(() => {
    return activeTrack === 'PROGRAMMING_150' ? p150Problems : dsaProblems;
  }, [activeTrack, p150Problems, dsaProblems]);

  // Active track stats for header analytics (Matching Aptitude Easy/Med/Hard Breakdown)
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

  // Active topic object if topicParam is set
  const activeTopic = useMemo(() => {
    if (activeTrack !== 'PROGRAMMING_150' || !topicParam) return null;
    return topics.find(t => t.id === topicParam) || null;
  }, [activeTrack, topicParam, topics]);

  // Distinct stages for directory filter
  const stages = useMemo(() => {
    return ['ALL', ...Array.from(new Set(topics.map(t => t.cluster)))];
  }, [topics]);

  // Filtered topics for directory
  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      if (selectedStage !== 'ALL' && t.cluster !== selectedStage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [topics, selectedStage, searchQuery]);

  // Active topic total and solved count
  const activeTopicProblems = useMemo(() => {
    if (!activeTopic) return [];
    return p150Problems.filter(p => p.topicId === activeTopic.id);
  }, [activeTopic, p150Problems]);

  const activeTopicSolvedCount = useMemo(() => {
    return activeTopicProblems.filter(p => p.solved).length;
  }, [activeTopicProblems]);

  const activeTopicTotalCount = activeTopicProblems.length;
  const topicPercentage = activeTopicTotalCount > 0 ? Math.round((activeTopicSolvedCount / activeTopicTotalCount) * 100) : 0;

  // Filtered Problems (accounting for selected topic, difficulty, status, and search query)
  const filteredProblems = useMemo(() => {
    return currentProblems.filter(p => {
      if (activeTopic && p.topicId !== activeTopic.id) return false;
      if (selectedLevel !== 'ALL' && p.level !== selectedLevel) return false;
      if (selectedStatus === 'SOLVED' && !p.solved) return false;
      if (selectedStatus === 'UNSOLVED' && p.solved) return false;
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = p.categoryLabel.toLowerCase().includes(q);
        const matchesCompany = p.companyTags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesCompany) return false;
      }
      return true;
    });
  }, [currentProblems, activeTopic, selectedLevel, selectedStatus, selectedCategory, searchQuery]);

  // Filtered MCQs based on category, status, and search query (Active Learning Parity)
  const filteredMcqs = useMemo(() => {
    return mcqs.filter(mcq => {
      const prog = mcqProgress[mcq.id];
      const isSolved = prog?.solved ?? false;
      const isRetry = !isSolved && (prog?.wrongPicks?.length ?? 0) > 0;

      // Category filter
      if (selectedCategory !== 'ALL' && mcq.topicCategory !== selectedCategory) return false;

      // Status filter
      if (selectedStatus === 'SOLVED' && !isSolved) return false;
      if (selectedStatus === 'UNSOLVED' && isSolved) return false;
      if (selectedStatus === 'RETRY' && !isRetry) return false;

      // Search query
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
  }, [mcqs, mcqProgress, selectedCategory, selectedStatus, searchQuery]);

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
      technicalService.saveMcqProgress(mcq.id, updated);
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
      technicalService.saveMcqProgress(mcq.id, updated);
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
    technicalService.toggleProblemSolved(problemId);
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
    setSearchParams({ track: 'programming-150', topic: topicId });
    setSearchQuery('');
    setSelectedLevel('ALL');
    setSelectedStatus('ALL');
  };

  const clearSelectedTopic = () => {
    setSearchParams({ track: 'programming-150' });
    setSearchQuery('');
    setSelectedLevel('ALL');
    setSelectedStatus('ALL');
  };

  const isDirectoryView = activeTrack === 'PROGRAMMING_150' && !activeTopic;

  return (
    <div className={`space-y-6 animate-fadeIn pb-12 font-sans relative ${activeTopic ? 'max-w-4xl mx-auto' : 'max-w-6xl mx-auto'}`}>
      {/* ────────────────────────────────────────────────────────────────────────
          TOPIC QUESTIONS VIEW (When a Topic is Selected in Programming 150)
          Matches Aptitude TopicQuestionsPage + Old Papers QuestionCard UI
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

            <span className="text-xs text-[#868E96] dark:text-[#555555]">
              Topic Practice Mode
            </span>
          </div>

          {/* 2. Topic Header Banner (Matching Aptitude TopicQuestionsPage banner) */}
          <div className="p-5 sm:p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#121417] dark:text-[#FFFFFF] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-display font-bold text-[#FD4A32] uppercase tracking-wider block">
                  Programming 150 • {activeTopic.cluster}
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {activeTopic.title} Questions
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-sans mt-0.5">
                  {activeTopic.description}
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
                    {activeTopicSolvedCount} / {activeTopicTotalCount} Solved ({topicPercentage}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(true)}
                    className="px-3 py-1 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 rounded-md text-xs font-display font-bold transition-all border border-purple-500/30 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Bulk import questions into this topic"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Bulk JSON</span>
                  </button>
                )}
                <div className="px-2.5 py-1 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] text-xs font-display font-bold border border-[#FD4A32]/25">
                  {filteredProblems.length} Problems
                </div>
              </div>
            </div>
          </div>

          {/* 3. Filter Bar (Matching TopicQuestionsPage filters) */}
          <div className="p-3.5 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center flex-wrap gap-4">
                {/* Difficulty Filter */}
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

                {/* Status Filter */}
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

              {/* In-topic search */}
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

          {/* 4. Full-Width Questions List (Placement OA Standard: Statement -> Constraints -> 2 Test Cases -> Solutions) */}
          <div className="space-y-4">
            {filteredProblems.length === 0 ? (
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
                    className="p-5 sm:p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] hover:border-[#FD4A32]/40 transition-all duration-300 space-y-4 shadow-xs"
                  >
                    {/* Top Header Row: Question #, Difficulty Badge, Company Tags, Solved Toggle */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E9ECEF] dark:border-[#242424]">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Question Number Badge */}
                        <span className="px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] font-display font-bold text-[10px] tracking-tight border border-[#FD4A32]/25">
                          Question #{index + 1}
                        </span>

                        {/* Difficulty Badge with Pulse Dot */}
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

                        {/* Company Tags */}
                        {problem.companyTags?.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Solved Toggle Status */}
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

                    {/* 3. Constraints Section */}
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

                    {/* 4. Two Test Cases (Example 1 & Example 2) */}
                    {problem.testCases && problem.testCases.length > 0 ? (
                      <div className="space-y-2.5">
                        {problem.testCases.map((tc, tcIdx) => (
                          <div key={tcIdx} className="space-y-1">
                            <span className="text-[10px] font-bold text-[#868E96] dark:text-[#888888] uppercase tracking-wider block font-display">
                              Example {tcIdx + 1}:
                            </span>
                            <div className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] font-mono text-xs text-[#121417] dark:text-[#E9ECEF] space-y-1">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400 font-bold">Input: </span>
                                <span>{tc.input}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400 font-bold">Output: </span>
                                <span>{tc.output}</span>
                              </div>
                              {tc.explanation && (
                                <div className="pt-1 text-[11px] font-sans text-gray-600 dark:text-gray-300">
                                  <span className="font-bold text-gray-500 dark:text-gray-400 font-mono">Explanation: </span>
                                  <span>{tc.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      (problem.sampleInput || problem.sampleOutput) && (
                        <div className="space-y-2.5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-[#868E96] uppercase tracking-wider block font-display">
                              Example 1:
                            </span>
                            <div className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] font-mono text-xs text-[#121417] dark:text-[#E9ECEF] space-y-1">
                              {problem.sampleInput && (
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 font-bold">Input: </span>
                                  <span>{problem.sampleInput}</span>
                                </div>
                              )}
                              {problem.sampleOutput && (
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 font-bold">Output: </span>
                                  <span>{problem.sampleOutput}</span>
                                </div>
                              )}
                              {problem.explanation && (
                                <div className="pt-1 text-[11px] font-sans text-gray-600 dark:text-gray-300">
                                  <span className="font-bold text-gray-500 dark:text-gray-400 font-mono">Explanation: </span>
                                  <span>{problem.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {/* 5. Expandable In-Place Solution & Code (Multi-Language) */}
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
                          {/* Multi-Language Tabs + Complexity Badges + Copy */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#242424]">
                            {/* Language Switcher Tabs */}
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

                            {/* Complexity Badges + Copy Button */}
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

                          {/* Code Pre Box */}
                          <div className="bg-[#050505] rounded-lg p-3.5 border border-[#1E1E1E] overflow-x-auto text-xs font-mono text-emerald-400">
                            <pre>{problem.solutions[activeLang] || '// Solution not available in this language'}</pre>
                          </div>

                          {/* Explanation & Approach */}
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

                          {/* Hints */}
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
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────────────────────
            MAIN DIRECTORY VIEW (Matching Aptitude /aptitude/arithmetic-aptitude)
        ──────────────────────────────────────────────────────────────────────── */
        <>
          {/* 🚀 1. UNIFIED HEADER BANNER: Donut on Left, Difficulty Breakdown on Right (Matching Aptitude) */}
          <div className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1 sm:max-w-md shrink-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
                  <Terminal className="w-3 h-3 text-[#FD4A32]" />
                  <span>Technical &amp; Coding Hub</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
                  {activeTrack === 'PROGRAMMING_150' && 'Programming 150'}
                  {activeTrack === 'CAMPUS_DSA' && 'Campus DSA Core (Top 100 Patterns)'}
                  {activeTrack === 'TECHNICAL_MCQS' && 'Technical MCQs & Pseudo-Code'}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-sans mt-0.5">
                  {activeTrack === 'PROGRAMMING_150' &&
                    'Structured 15-topic syllabus across 6 progressive stages building syntax foundations, loop mechanics, number logic, patterns, arrays, strings, and recursion.'}
                  {activeTrack === 'CAMPUS_DSA' &&
                    'Curated 15 repeatable campus placement patterns frequently tested in Amazon, TCS Prime, and Infosys SP.'}
                  {activeTrack === 'TECHNICAL_MCQS' &&
                    'Tricky output-guessing questions, pointer arithmetic, operator precedence, and campus OA dry-run traps.'}
                </p>
              </div>

              {/* Embedded Donut & Difficulty Progress (Exact Aptitude embedded styling) */}
              <div className="flex-1 lg:max-w-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Donut Ring with Solved / Total inside */}
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

                  {/* 3 Difficulty / Category Progress Bars */}
                  {activeTrack === 'TECHNICAL_MCQS' ? (
                    <div className="grid grid-cols-3 gap-3 flex-1 max-w-md">
                      {/* Solved */}
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

                      {/* Needs Retry */}
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

                      {/* Unsolved */}
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
                      {/* Basic / Easy */}
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

                      {/* Medium */}
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

                      {/* Hard */}
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

          {/* 🏷️ 2. FILTER PILLS (STAGES / DIFFICULTY / CATEGORIES) + SEARCH BAR + ADMIN BULK BUTTON */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Programming 150: Stage Cluster Pills */}
            {activeTrack === 'PROGRAMMING_150' && (
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
                    {st === 'ALL' ? 'All Stages' : st}
                  </button>
                ))}
              </div>
            )}

            {/* Campus DSA: Pattern Difficulty Pills */}
            {activeTrack === 'CAMPUS_DSA' && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'ALL', label: 'All Patterns' },
                  { id: 'BASIC', label: 'Basic' },
                  { id: 'MEDIUM', label: 'Medium' },
                  { id: 'HARD', label: 'Hard' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedLevel(item.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                      selectedLevel === item.id
                        ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                        : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Technical MCQs: Category Pills & Status Filter */}
            {activeTrack === 'TECHNICAL_MCQS' && (
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Category Selector */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'ALL', label: 'All Topics' },
                    { id: 'C_CPP_SNIPPETS', label: 'C / C++' },
                    { id: 'JAVA_SNIPPETS', label: 'Java' },
                    { id: 'PYTHON_SNIPPETS', label: 'Python' },
                    { id: 'PSEUDO_CODE', label: 'Pseudo-Code' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedCategory(item.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                        selectedCategory === item.id
                          ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                          : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

                {/* Status Filter */}
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'UNSOLVED', label: 'Unsolved' },
                    { id: 'SOLVED', label: `Solved (${mcqSolvedCount})` },
                    { id: 'RETRY', label: `Retry (${mcqRetryCount})` },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedStatus(item.id as any)}
                      className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all border shrink-0 cursor-pointer ${
                        selectedStatus === item.id
                          ? 'bg-[#FD4A32] text-white border-[#FD4A32] shadow-xs'
                          : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Bar + Audio Toggle + Admin Bulk JSON Button */}
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
                      : 'Search MCQs...'
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

              {isAdmin && activeTrack === 'PROGRAMMING_150' && (
                <button
                  type="button"
                  onClick={() => setShowBulkModal(true)}
                  className="px-3 py-1 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 rounded-md text-xs font-display font-bold transition-all border border-purple-500/30 flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                  title="Bulk import programming questions (JSON)"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Bulk JSON</span>
                </button>
              )}
            </div>
          </div>

          {/* 📁 4. TOPIC DIRECTORY CARDS (2-Column Grid Matching AptitudePage) */}
          {isDirectoryView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredTopics.map(topic => {
                const TopicIcon = TOPIC_ICON_MAP[topic.iconName] || Code2;
                const topicProblems = p150Problems.filter(p => p.topicId === topic.id);
                const solvedCount = topicProblems.filter(p => p.solved).length;

                return (
                  <div
                    key={topic.id}
                    onClick={() => selectTopic(topic.id)}
                    className="group flex items-center justify-between p-3.5 bg-white dark:bg-[#141414] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] hover:border-[#FD4A32]/50 dark:hover:border-[#FD4A32]/50 rounded-lg transition-all duration-150 shadow-2xs cursor-pointer"
                  >
                    {/* Left: Icon & Title & Description */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 border border-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                        <TopicIcon className="w-4 h-4 text-[#FD4A32]" />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="font-display font-bold text-xs sm:text-sm text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] transition-colors truncate">
                          {topic.title}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {topic.cluster} • {topic.description}
                        </span>
                      </div>
                    </div>

                    {/* Right: Solved Badge & Explore Link */}
                    <div className="flex items-center gap-2 shrink-0">
                      {solvedCount > 0 && (
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {solvedCount} Solved
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-[11px] font-display font-bold text-[#121417] dark:text-[#E9ECEF] bg-[#F1F3F5] dark:bg-[#202020] px-2.5 py-1 rounded border border-[#E9ECEF] dark:border-[#2E2E2E] group-hover:border-[#FD4A32] group-hover:text-[#FD4A32] transition-colors">
                        <span>{topicProblems.length} Problems</span>
                        <ChevronRight className="w-3 h-3 text-[#868E96]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 📋 5. CAMPUS DSA PROBLEMS LIST (Full Width Question Cards like Old Papers) */}
          {activeTrack === 'CAMPUS_DSA' && (
            <div className="space-y-4">
              {filteredProblems.map((problem, index) => {
                const isSolved = problem.solved;
                const isExpanded = expandedSolutions[problem.id] ?? false;
                const activeLang = problemLanguages[problem.id] || 'java';
                const isCopied = copiedId === problem.id;

                return (
                  <div
                    key={problem.id}
                    className="p-5 sm:p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] hover:border-[#FD4A32]/40 transition-all duration-300 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E9ECEF] dark:border-[#242424]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-display font-bold text-[10px] tracking-tight border border-amber-500/25">
                          Pattern #{index + 1}
                        </span>
                        <span className="text-[10px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-2 py-0.5 rounded">
                          {problem.categoryLabel}
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
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>{problem.level}</span>
                        </span>
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
                      </div>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-[#121417] dark:text-[#FFFFFF] leading-snug">
                      {problem.title}
                    </h3>

                    <div className="text-xs sm:text-sm text-[#495057] dark:text-[#CCCCCC] leading-relaxed bg-[#F8F9FA] dark:bg-[#0C0C0C] p-3.5 rounded-lg border border-[#E9ECEF] dark:border-[#242424] font-sans whitespace-pre-line">
                      {problem.description}
                    </div>

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

                    {(problem.sampleInput || problem.sampleOutput) && (
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
                                Explanation &amp; Pattern Notes
                              </span>
                              <p className="text-gray-300 leading-relaxed font-sans text-xs">
                                {problem.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 📝 6. TECHNICAL MCQS VIEW (Active Learning & Aptitude Parity) */}
          {activeTrack === 'TECHNICAL_MCQS' && (
            <div className="space-y-4">
              {filteredMcqs.length === 0 ? (
                <div className="p-12 text-center rounded-xl border border-dashed border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] space-y-2">
                  <HelpCircle className="w-8 h-8 text-[#868E96] mx-auto opacity-50" />
                  <p className="text-sm font-bold text-[#121417] dark:text-white">No MCQs Found</p>
                  <p className="text-xs text-gray-500">
                    Try adjusting your topic category, status filter, or search keywords.
                  </p>
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
                      className="p-5 sm:p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] hover:border-[#FD4A32]/40 transition-all duration-300 space-y-4 shadow-xs"
                    >
                      {/* 1. Header: Q# • Topic • Company Tags • Solved Badge */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E9ECEF] dark:border-[#242424]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] font-display font-bold text-[10px] tracking-tight border border-[#FD4A32]/25">
                            Q{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-2 py-0.5 rounded font-semibold">
                            {mcq.topic}
                          </span>
                          {mcq.companyTags?.map(tag => (
                            <span
                              key={tag}
                              className="text-[9px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Status Badge */}
                        <div>
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
                        </div>
                      </div>

                      {/* 2. Question Statement */}
                      <p className="font-display font-bold text-sm sm:text-base text-[#121417] dark:text-[#FFFFFF] leading-snug">
                        {mcq.question}
                      </p>

                      {/* 3. Code Snippet Box (Syntax-Styled Monospace Container) */}
                      {mcq.codeSnippet && (
                        <div className="relative rounded-lg bg-[#0C0C0C] dark:bg-[#000000] border border-[#242424] overflow-hidden text-xs font-mono">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#141414] border-b border-[#242424] text-[10px] text-[#888888]">
                            <span className="font-bold text-[#FD4A32] uppercase tracking-wider">
                              {mcq.topicCategory.replace(/_SNIPPETS|_/g, ' ')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(mcq.codeSnippet!, mcq.id)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1F1F1F] hover:bg-[#2A2A2A] text-gray-300 hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedId === mcq.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === mcq.id ? 'Copied!' : 'Copy Code'}</span>
                            </button>
                          </div>
                          <pre className="p-3.5 overflow-x-auto text-emerald-400 leading-relaxed font-mono">
                            {mcq.codeSnippet}
                          </pre>
                        </div>
                      )}

                      {/* 4. Full-Width Stacked Options (Active Learning Flow) */}
                      <div className="space-y-2">
                        {mcq.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === mcq.correctOptionIndex;
                          const wasWrong = wrongPicks.includes(optIdx);
                          const letterBadge = String.fromCharCode(65 + optIdx);

                          let optionStyle = 'bg-[#F8F9FA] dark:bg-[#0C0C0C] border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] hover:border-[#121417] dark:hover:border-[#444444]';

                          if (isSolved && isCorrect) {
                            optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs';
                          } else if (wasWrong) {
                            optionStyle = 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                          } else if (isExplVisible && isCorrect) {
                            optionStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectMcqOption(mcq, optIdx)}
                              className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg border text-xs sm:text-sm text-left transition-all cursor-pointer ${optionStyle}`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-6 h-6 rounded-md border flex items-center justify-center font-display font-bold text-xs shrink-0 ${
                                  (isSolved && isCorrect) || (isExplVisible && isCorrect)
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : wasWrong
                                      ? 'bg-rose-500 text-white border-rose-500'
                                      : 'border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555] bg-white dark:bg-[#181818]'
                                }`}>
                                  {letterBadge}
                                </div>
                                <span className="leading-snug font-sans truncate-none">{opt}</span>
                              </div>

                              {((isSolved && isCorrect) || (isExplVisible && isCorrect)) && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              )}
                              {wasWrong && !isSolved && (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* 5. Action Toolbar: Show Answer Toggle + Status Message */}
                      <div className="pt-2.5 border-t border-[#E9ECEF] dark:border-[#242424] flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleMcqExplanation(mcq.id)}
                            className={`px-3 py-1.5 rounded-md border text-xs font-display font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              isExplVisible
                                ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white'
                                : 'bg-[#F8F9FA] dark:bg-[#1C1C1C] border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                            }`}
                            title={isExplVisible ? 'Hide Solution' : 'Show Answer & Detailed Solution'}
                          >
                            {isExplVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span className="text-[10px] uppercase tracking-wider">
                              {isExplVisible ? 'Hide Solution' : isSolved ? 'View Solution' : 'Show Answer & Solution'}
                            </span>
                          </button>
                        </div>

                        {/* Live Feedback */}
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

                      {/* 6. Collapsible Explanation Accordion */}
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
          )}
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
    </div>
  );
}
