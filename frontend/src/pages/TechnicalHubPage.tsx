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
  HelpCircle,
  Clock,
  HardDrive,
  Lightbulb,
  X,
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
} from 'lucide-react';
import { technicalService } from '@/services/technical.service';
import type { ProgrammingProblem, TechnicalMcq, ProblemLevel, TechnicalTrack, ProgrammingTopic } from '@/types/technical';

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
    setSelectedStage('ALL');
  };

  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<ProgrammingProblem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'java' | 'python' | 'cpp' | 'c'>('java');
  const [copied, setCopied] = useState(false);
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState<Record<string, number>>({});

  // Query Programming Topics (12 Structured Syllabus Topics)
  const { data: topics = [] } = useQuery<ProgrammingTopic[]>({
    queryKey: ['programming-topics'],
    queryFn: () => technicalService.getProgrammingTopics(),
  });

  // Query Programming 150 Problems
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

  // Overall Stats
  const p150Solved = useMemo(() => p150Problems.filter(p => p.solved).length, [p150Problems]);
  const dsaSolved = useMemo(() => dsaProblems.filter(p => p.solved).length, [dsaProblems]);
  const totalCoding = p150Problems.length + dsaProblems.length;
  const totalCodingSolved = p150Solved + dsaSolved;
  const codingPct = totalCoding > 0 ? Math.round((totalCodingSolved / totalCoding) * 100) : 0;

  const p150Pct = p150Problems.length > 0 ? Math.round((p150Solved / p150Problems.length) * 100) : 0;
  const dsaPct = dsaProblems.length > 0 ? Math.round((dsaSolved / dsaProblems.length) * 100) : 0;

  // Donut chart dimensions matching Aptitude
  const radius = 28;
  const strokeWidth = 4.5;
  const circumference = 2 * Math.PI * radius;
  const codingPortion = totalCoding > 0 ? (totalCodingSolved / totalCoding) * circumference : 0;
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

  // Distinct categories in active track
  const availableCategories = useMemo(() => {
    const map = new Map<string, string>();
    currentProblems.forEach(p => {
      map.set(p.category, p.categoryLabel);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [currentProblems]);

  // Filtered Problems (accounting for selected topic if set)
  const filteredProblems = useMemo(() => {
    return currentProblems.filter(p => {
      if (activeTopic && p.topicId !== activeTopic.id) return false;
      if (selectedLevel !== 'ALL' && p.level !== selectedLevel) return false;
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
  }, [currentProblems, activeTopic, selectedLevel, selectedCategory, searchQuery]);

  // Problems count and solved count for active topic
  const activeTopicProblems = useMemo(() => {
    if (!activeTopic) return [];
    return p150Problems.filter(p => p.topicId === activeTopic.id);
  }, [activeTopic, p150Problems]);

  const activeTopicSolvedCount = useMemo(() => {
    return activeTopicProblems.filter(p => p.solved).length;
  }, [activeTopicProblems]);

  const handleToggleSolve = (problemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    technicalService.toggleProblemSolved(problemId);
    if (activeTrack === 'PROGRAMMING_150') refetchP150();
    else refetchDsa();
    if (selectedProblem && selectedProblem.id === problemId) {
      setSelectedProblem(prev => (prev ? { ...prev, solved: !prev.solved } : null));
    }
  };

  const handleCopyCode = (codeText: string) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectTopic = (topicId: string) => {
    setSearchParams({ track: 'programming-150', topic: topicId });
    setSearchQuery('');
    setSelectedLevel('ALL');
  };

  const clearSelectedTopic = () => {
    setSearchParams({ track: 'programming-150' });
    setSearchQuery('');
    setSelectedLevel('ALL');
  };

  const isDirectoryView = activeTrack === 'PROGRAMMING_150' && !activeTopic;

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12 font-sans relative">
      {/* 🚀 1. UNIFIED HEADER BANNER: Title on Left, Analytics on Right (Matching AptitudePage) */}
      <div className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 sm:max-w-md shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
              <Terminal className="w-3 h-3 text-[#FD4A32]" />
              <span>Technical &amp; Coding Hub</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
              {activeTrack === 'PROGRAMMING_150' && (activeTopic ? activeTopic.title : 'Programming 150 (Syntax to Hard)')}
              {activeTrack === 'CAMPUS_DSA' && 'Campus DSA Core (Top 100 Patterns)'}
              {activeTrack === 'TECHNICAL_MCQS' && 'Technical MCQs & Pseudo-Code'}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-sans mt-0.5">
              {activeTrack === 'PROGRAMMING_150' && (
                activeTopic
                  ? activeTopic.description
                  : 'Structured 12-topic syllabus building syntax foundations, loop mechanics, number logic, patterns, arrays, and recursion.'
              )}
              {activeTrack === 'CAMPUS_DSA' &&
                'Curated 15 repeatable campus placement patterns frequently tested in Amazon, TCS Prime, and Infosys SP.'}
              {activeTrack === 'TECHNICAL_MCQS' &&
                'Tricky output-guessing questions, pointer arithmetic, operator precedence, and campus OA dry-run traps.'}
            </p>
          </div>

          {/* Embedded Donut & Track Progress (Exact Aptitude embedded styling) */}
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
                  {totalCodingSolved > 0 && (
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
                    {totalCodingSolved}/{totalCoding}
                  </span>
                </div>
              </div>

              {/* 3 Track Progress Bars */}
              <div className="grid grid-cols-3 gap-3 flex-1 max-w-md">
                {/* Prog 150 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                    <span className="font-display font-bold text-blue-600 dark:text-blue-400">Prog 150</span>
                    <span className="text-[#868E96] dark:text-[#666666]">{p150Solved}/{p150Problems.length}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${p150Pct}%` }}
                    />
                  </div>
                </div>

                {/* Campus DSA */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                    <span className="font-display font-bold text-amber-600 dark:text-amber-400">DSA Core</span>
                    <span className="text-[#868E96] dark:text-[#666666]">{dsaSolved}/{dsaProblems.length}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${dsaPct}%` }}
                    />
                  </div>
                </div>

                {/* OA MCQs */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                    <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">OA MCQs</span>
                    <span className="text-[#868E96] dark:text-[#666666]">{mcqs.length} Qs</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏷️ 2. TRACK SELECTION PILLS + SEARCH BAR (Matching AptitudePage cluster pills) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Track Selection Switchers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => handleTrackChange('PROGRAMMING_150')}
            className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTrack === 'PROGRAMMING_150'
                ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#FD4A32]" />
            <span>Programming 150</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
              activeTrack === 'PROGRAMMING_150' ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-black/5 dark:bg-white/5'
            }`}>
              {p150Problems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTrackChange('CAMPUS_DSA')}
            className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTrack === 'CAMPUS_DSA'
                ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-amber-500" />
            <span>Campus DSA Core</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
              activeTrack === 'CAMPUS_DSA' ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-black/5 dark:bg-white/5'
            }`}>
              {dsaProblems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTrackChange('TECHNICAL_MCQS')}
            className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTrack === 'TECHNICAL_MCQS'
                ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Technical MCQs</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
              activeTrack === 'TECHNICAL_MCQS' ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-black/5 dark:bg-white/5'
            }`}>
              {mcqs.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          <div className="relative w-48 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
            <input
              type="text"
              placeholder={isDirectoryView ? "Search topics..." : "Search problems or patterns..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
            />
          </div>
        </div>
      </div>

      {/* 📂 3. TOPIC DRILL-DOWN HEADER (When a Topic is Selected in Programming 150) */}
      {activeTopic && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={clearSelectedTopic}
              className="p-1.5 rounded-md hover:bg-[#F1F3F5] dark:hover:bg-[#202020] text-[#121417] dark:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
              title="Return to Topic Directory"
            >
              <ArrowLeft className="w-4 h-4 text-[#FD4A32]" />
              <span>Topics</span>
            </button>

            <div className="h-4 w-px bg-[#E9ECEF] dark:border-[#242424]" />

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono text-[#FD4A32] font-bold uppercase tracking-wider">
                  {activeTopic.cluster}
                </span>
                <span className="text-[#868E96] dark:text-[#555555]">•</span>
                <h2 className="font-display font-extrabold text-sm text-[#121417] dark:text-white truncate">
                  {activeTopic.title}
                </h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {activeTopic.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
              {activeTopicSolvedCount} / {activeTopicProblems.length} Solved
            </span>
          </div>
        </div>
      )}

      {/* 🎚️ 4. DIRECTORY STAGE CLUSTER PILLS (For Programming 150) */}
      {activeTrack === 'PROGRAMMING_150' && !activeTopic && (
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 border-b border-[#E9ECEF] dark:border-[#242424]">
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

      {/* 🎚️ 5. SECONDARY DIFFICULTY FILTER PILLS (When viewing problem cards) */}
      {(!isDirectoryView && activeTrack !== 'TECHNICAL_MCQS') && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider mr-1">
            Difficulty:
          </span>
          {['ALL', 'BASIC', 'MEDIUM', 'HARD'].map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all border cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-2xs'
                  : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
              }`}
            >
              {lvl === 'ALL' ? 'All Levels' : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
            </button>
          ))}

          {/* If viewing All Problems in Programming 150 or Campus DSA */}
          {(!activeTopic && availableCategories.length > 1) && (
            <>
              <span className="text-[#868E96] dark:text-[#444444] mx-1">|</span>
              <span className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider mr-1">
                Category:
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all border cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-2xs'
                    : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                }`}
              >
                All
              </button>
              {availableCategories.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedCategory(c.value)}
                  className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all border cursor-pointer truncate max-w-[180px] ${
                    selectedCategory === c.value
                      ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-2xs'
                      : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* 📁 6. TOPIC DIRECTORY CARDS (2-Column Grid Matching AptitudePage) */}
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

      {/* 📋 7. PROBLEM DIRECTORY CARDS (When a topic is selected OR in All Problems mode) */}
      {(!isDirectoryView && activeTrack !== 'TECHNICAL_MCQS') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredProblems.map((problem, index) => {
            const isSolved = problem.solved;

            return (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem)}
                className="group flex items-center justify-between p-3 bg-white dark:bg-[#141414] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] hover:border-[#FD4A32]/50 dark:hover:border-[#FD4A32]/50 rounded-lg transition-all duration-150 shadow-2xs cursor-pointer"
              >
                {/* Left: Icon & Title & Details */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 border ${
                      isSolved
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-[#FD4A32]/10 border-[#FD4A32]/20 text-[#FD4A32]'
                    }`}
                  >
                    {isSolved ? <CheckCircle2 className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-[#868E96] font-bold">#{index + 1}</span>
                      <span className="font-display font-bold text-xs sm:text-sm text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] transition-colors truncate">
                        {problem.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {problem.categoryLabel}
                      </span>
                      <span
                        className={`text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          problem.level === 'BASIC'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : problem.level === 'MEDIUM'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {problem.level}
                      </span>
                      <span className="text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
                        {problem.timeComplexity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Solved Badge & Action Button */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isSolved ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Solved
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={e => handleToggleSolve(problem.id, e)}
                      className="text-[10px] font-mono font-bold text-[#868E96] dark:text-[#777777] hover:text-emerald-600 bg-[#F1F3F5] dark:bg-[#202020] px-2 py-0.5 rounded border border-[#E9ECEF] dark:border-[#2E2E2E] cursor-pointer"
                      title="Mark solved"
                    >
                      Mark
                    </button>
                  )}

                  {/* View Solution Action Button */}
                  <div className="flex items-center gap-1 text-[11px] font-display font-bold text-[#121417] dark:text-[#E9ECEF] bg-[#F1F3F5] dark:bg-[#202020] px-2.5 py-1 rounded border border-[#E9ECEF] dark:border-[#2E2E2E] group-hover:border-[#FD4A32] group-hover:text-[#FD4A32] transition-colors">
                    <span>View Code</span>
                    <ChevronRight className="w-3 h-3 text-[#868E96]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 📝 8. TECHNICAL MCQS VIEW */}
      {activeTrack === 'TECHNICAL_MCQS' && (
        <div className="space-y-3">
          {mcqs.map((mcq, idx) => {
            const userPick = selectedMcqAnswers[mcq.id];
            const isAnswered = userPick !== undefined;

            return (
              <div
                key={mcq.id}
                className="p-4 sm:p-5 rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-2xs space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#FD4A32] uppercase">
                        Q{idx + 1} • {mcq.topic}
                      </span>
                      {mcq.companyTags?.map(tag => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-1 py-0.2 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="font-display font-bold text-sm text-[#121417] dark:text-white">
                      {mcq.question}
                    </p>
                  </div>
                </div>

                {mcq.codeSnippet && (
                  <div className="bg-[#0C0C0C] rounded-md p-3 border border-[#242424] overflow-x-auto text-xs font-mono text-emerald-400">
                    <pre>{mcq.codeSnippet}</pre>
                  </div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mcq.options.map((opt, optIdx) => {
                    const isSelected = userPick === optIdx;
                    const isCorrect = mcq.correctOptionIndex === optIdx;

                    let optClass = 'bg-[#F8F9FA] dark:bg-[#1A1A1A] border-[#E9ECEF] dark:border-[#262626] text-[#121417] dark:text-gray-200 hover:border-[#121417] dark:hover:border-white';
                    if (isAnswered) {
                      if (isCorrect) {
                        optClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (isSelected) {
                        optClass = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-800 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => {
                          if (isAnswered) return;
                          setSelectedMcqAnswers(prev => ({ ...prev, [mcq.id]: optIdx }));
                        }}
                        className={`p-2.5 rounded-md text-xs text-left border transition-all cursor-pointer flex items-center justify-between ${optClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Reveal */}
                {isAnswered && (
                  <div className="p-3 rounded-md bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] text-xs text-[#495057] dark:text-gray-300 space-y-1 animate-fadeIn">
                    <span className="font-display font-bold text-[10px] text-[#FD4A32] uppercase tracking-wider block">
                      Explanation
                    </span>
                    <p className="leading-relaxed text-xs">{mcq.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ⚠️ Empty State */}
      {(!isDirectoryView && activeTrack !== 'TECHNICAL_MCQS' && filteredProblems.length === 0) && (
        <div className="rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-10 text-center space-y-2 shadow-2xs">
          <Code2 className="w-7 h-7 text-[#868E96] mx-auto" />
          <h3 className="font-display font-bold text-sm text-[#121417] dark:text-[#FFFFFF]">
            No coding problems found
          </h3>
          <p className="text-xs text-[#868E96] max-w-sm mx-auto font-sans">
            Try adjusting your search keywords or switching difficulty levels.
          </p>
        </div>
      )}

      {/* 💻 CODE SOLUTION MODAL DIALOG */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#141414] rounded-xl border border-[#E9ECEF] dark:border-[#242424] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn font-sans">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E9ECEF] dark:border-[#242424] flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-[#FD4A32] uppercase">
                    {selectedProblem.categoryLabel}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      selectedProblem.level === 'BASIC'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : selectedProblem.level === 'MEDIUM'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {selectedProblem.level}
                  </span>
                  <span className="text-[10px] font-mono text-[#868E96] dark:text-[#777777]">
                    Time: {selectedProblem.timeComplexity} • Space: {selectedProblem.spaceComplexity}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-[#121417] dark:text-white">
                  {selectedProblem.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleSolve(selectedProblem.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border cursor-pointer ${
                    selectedProblem.solved
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] hover:text-emerald-600'
                  }`}
                >
                  {selectedProblem.solved ? '✓ Solved' : 'Mark Solved'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProblem(null)}
                  className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar flex-1">
              {/* Problem Description */}
              <div className="space-y-2">
                <span className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider">
                  Problem Statement
                </span>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {selectedProblem.description}
                </p>
              </div>

              {/* Sample I/O */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-1">
                  <div className="text-[10px] font-bold text-[#868E96] uppercase">Sample Input</div>
                  <pre className="font-mono text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
                    {selectedProblem.sampleInput}
                  </pre>
                </div>
                <div className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-1">
                  <div className="text-[10px] font-bold text-[#868E96] uppercase">Sample Output</div>
                  <pre className="font-mono text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
                    {selectedProblem.sampleOutput}
                  </pre>
                </div>
              </div>

              {/* Multi-Language Solution Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {(['java', 'python', 'cpp', 'c'] as const).map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all border cursor-pointer ${
                          selectedLanguage === lang
                            ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-2xs'
                            : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                        }`}
                      >
                        {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedProblem.solutions[selectedLanguage] || '')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Code Pre Block */}
                <div className="bg-[#0C0C0C] rounded-lg p-4 border border-[#242424] overflow-x-auto text-xs font-mono text-emerald-400">
                  <pre>{selectedProblem.solutions[selectedLanguage] || '// Solution not available in this language'}</pre>
                </div>
              </div>

              {/* Logic & Approach Explanation if present */}
              {selectedProblem.explanation && (
                <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-1 text-xs">
                  <div className="font-bold flex items-center gap-1.5 text-[10px] text-[#FD4A32] uppercase tracking-wider">
                    <Lightbulb className="w-3 h-3" />
                    Logic &amp; Approach Explanation
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-mono text-[11px]">
                    {selectedProblem.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
