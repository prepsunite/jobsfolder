import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Circle,
  Search,
  Sliders,
  Layers,
  GitMerge,
  Brain,
  Sparkles,
  Code2,
  Terminal,
  Network,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Building2,
  Clock,
  BookOpen,
  Filter,
  Check,
  Flame,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { technicalService } from '@/services/technical.service';
import { CAMPUS_DSA_ROADMAP_STAGES, ALL_CAMPUS_DSA_PROBLEMS } from '@/services/campusDsaRoadmapData';
import type { CampusDsaProblem, CampusDsaStage, DsaDifficulty } from '@/types/technical';
import audioEffects from '@/utils/audioEffects';

const STAGE_ICON_MAP: Record<string, React.ComponentType<any>> = {
  Sliders,
  Layers,
  GitMerge,
  Brain,
  Sparkles,
  Code2,
  Terminal,
  Network,
  Zap,
  Search,
};

export default function CampusDsaRoadmapView() {
  const { user } = useAuth();

  // Solved state tracking
  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => technicalService.getSolvedProblemIds());
  const [isMuted, setIsMuted] = useState<boolean>(() => audioEffects.getMuted());

  // Filter States
  const [selectedStageId, setSelectedStageId] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'UNSOLVED' | 'SOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Expanded Stage Accordions & Key Intuition notes
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({});
  const [expandedIntuitions, setExpandedIntuitions] = useState<Record<string, boolean>>({});

  // Sync state with storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setSolvedIds(technicalService.getSolvedProblemIds());
    };
    window.addEventListener('prepunite-storage-update', handleUpdate);
    return () => window.removeEventListener('prepunite-storage-update', handleUpdate);
  }, []);

  const handleToggleSound = () => {
    const next = audioEffects.toggleMute();
    setIsMuted(next);
  };

  const handleToggleSolved = useCallback((problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowSolved = technicalService.toggleProblemSolved(problemId, user?.email);
    if (isNowSolved) {
      audioEffects.playSuccessChime();
    } else {
      audioEffects.playErrorBuzz();
    }
    setSolvedIds(technicalService.getSolvedProblemIds());
  }, [user?.email]);

  const toggleStageCollapse = (stageId: string) => {
    setCollapsedStages(prev => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const toggleIntuition = (problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIntuitions(prev => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  // Overall Roadmap Stats
  const stats = useMemo(() => {
    const total = ALL_CAMPUS_DSA_PROBLEMS.length;
    let solvedCount = 0;
    const byDiff = {
      EASY: { total: 0, solved: 0 },
      MEDIUM: { total: 0, solved: 0 },
      HARD: { total: 0, solved: 0 },
    };

    ALL_CAMPUS_DSA_PROBLEMS.forEach(p => {
      const isSolved = solvedIds.has(p.id);
      if (isSolved) solvedCount++;
      if (byDiff[p.difficulty]) {
        byDiff[p.difficulty].total++;
        if (isSolved) byDiff[p.difficulty].solved++;
      }
    });

    const completedStages = CAMPUS_DSA_ROADMAP_STAGES.filter(stage => {
      return stage.problems.length > 0 && stage.problems.every(p => solvedIds.has(p.id));
    }).length;

    return {
      total,
      solved: solvedCount,
      percentage: total > 0 ? Math.round((solvedCount / total) * 100) : 0,
      completedStages,
      totalStages: CAMPUS_DSA_ROADMAP_STAGES.length,
      byDifficulty: byDiff,
    };
  }, [solvedIds]);

  // Donut chart dimensions
  const radius = 28;
  const strokeWidth = 4.5;
  const circumference = 2 * Math.PI * radius;
  const portion = stats.total > 0 ? (stats.solved / stats.total) * circumference : 0;
  const dashOffset = circumference - portion;

  // Filtered Stages and Problems
  const filteredStages = useMemo(() => {
    return CAMPUS_DSA_ROADMAP_STAGES.map(stage => {
      const matchingProblems = stage.problems.filter(p => {
        const isSolved = solvedIds.has(p.id);

        // Status filter
        if (selectedStatus === 'SOLVED' && !isSolved) return false;
        if (selectedStatus === 'UNSOLVED' && isSolved) return false;

        // Difficulty filter
        if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchNum = p.leetcodeNumber.toString().includes(q) || `#${p.leetcodeNumber}`.includes(q);
          const matchPattern = p.pattern.toLowerCase().includes(q);
          const matchCompany = p.companyTags.some(c => c.toLowerCase().includes(q));
          const matchIntuition = p.keyIntuition.toLowerCase().includes(q);
          if (!matchTitle && !matchNum && !matchPattern && !matchCompany && !matchIntuition) {
            return false;
          }
        }

        return true;
      });

      return {
        ...stage,
        filteredProblems: matchingProblems,
        solvedCount: stage.problems.filter(p => solvedIds.has(p.id)).length,
      };
    }).filter(stage => {
      if (selectedStageId !== 'ALL' && stage.id !== selectedStageId) return false;
      // If filtering by search/difficulty/status, only show stage if it has matching problems
      if (selectedDifficulty !== 'ALL' || selectedStatus !== 'ALL' || searchQuery.trim()) {
        return stage.filteredProblems.length > 0;
      }
      return true;
    });
  }, [selectedStageId, selectedDifficulty, selectedStatus, searchQuery, solvedIds]);

  const totalFilteredProblemsCount = useMemo(() => {
    return filteredStages.reduce((acc, s) => acc + s.filteredProblems.length, 0);
  }, [filteredStages]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans max-w-6xl mx-auto">
      {/* ────────────────────────────────────────────────────────────────────────
          1. ROADMAP HERO BANNER & STATS
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Branding & Value Proposition */}
          <div className="space-y-1.5 sm:max-w-md shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#FFA116]/10 text-[#E08A00] dark:text-[#FFA116] border border-[#FFA116]/20 text-[10px] font-display font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-[#FFA116]" />
              <span>Campus Placement DSA Roadmap</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
              Campus DSA Core (Top Placement Patterns)
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
              Curated pattern-by-pattern placement roadmap tested in Amazon, TCS Prime/Digital, Infosys SP, Cognizant, and Accenture. Master the core intuition and solve questions directly on LeetCode with real-time progress tracking.
            </p>

            <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-[#868E96] dark:text-[#777777]">
              <span>🎯 10 Progressive Patterns</span>
              <span>•</span>
              <span>⚡ 67 Curated LeetCode Problems</span>
            </div>
          </div>

          {/* Right: Embedded Donut & Difficulty Progress */}
          <div className="flex-1 lg:max-w-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Circular Donut Gauge */}
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
                  {stats.solved > 0 && (
                    <circle
                      cx="35"
                      cy="35"
                      r={radius}
                      className="stroke-[#FFA116] transition-all duration-700 ease-out"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
                  <span className="font-mono font-bold text-xs text-[#121417] dark:text-white tracking-tight leading-none">
                    {stats.solved}/{stats.total}
                  </span>
                  <span className="text-[8px] font-mono text-[#868E96] dark:text-[#666666] leading-none mt-0.5">
                    {stats.percentage}%
                  </span>
                </div>
              </div>

              {/* Difficulty Progress Bars */}
              <div className="grid grid-cols-3 gap-3 flex-1 max-w-md">
                {/* Easy */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                    <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">Easy</span>
                    <span className="text-[#868E96] dark:text-[#666666]">
                      {stats.byDifficulty.EASY.solved}/{stats.byDifficulty.EASY.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats.byDifficulty.EASY.total > 0
                            ? Math.round((stats.byDifficulty.EASY.solved / stats.byDifficulty.EASY.total) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Medium */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                    <span className="font-display font-bold text-amber-600 dark:text-amber-400">Medium</span>
                    <span className="text-[#868E96] dark:text-[#666666]">
                      {stats.byDifficulty.MEDIUM.solved}/{stats.byDifficulty.MEDIUM.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats.byDifficulty.MEDIUM.total > 0
                            ? Math.round((stats.byDifficulty.MEDIUM.solved / stats.byDifficulty.MEDIUM.total) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Hard */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                    <span className="font-display font-bold text-rose-600 dark:text-rose-400">Hard</span>
                    <span className="text-[#868E96] dark:text-[#666666]">
                      {stats.byDifficulty.HARD.solved}/{stats.byDifficulty.HARD.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats.byDifficulty.HARD.total > 0
                            ? Math.round((stats.byDifficulty.HARD.solved / stats.byDifficulty.HARD.total) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          2. STAGE NAVIGATOR PILLS
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#666666]">
            Placement Roadmap Patterns ({CAMPUS_DSA_ROADMAP_STAGES.length} Stages)
          </span>
          <span className="text-[11px] font-mono font-bold text-[#FFA116]">
            {stats.completedStages}/{stats.totalStages} Stages Mastered
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedStageId('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
              selectedStageId === 'ALL'
                ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
            }`}
          >
            All 10 Stages ({ALL_CAMPUS_DSA_PROBLEMS.length})
          </button>

          {CAMPUS_DSA_ROADMAP_STAGES.map(stage => {
            const stageSolved = stage.problems.filter(p => solvedIds.has(p.id)).length;
            const isCompleted = stage.problems.length > 0 && stageSolved === stage.problems.length;
            const isSelected = selectedStageId === stage.id;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFA116] text-white border-[#FFA116] shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#FFA116]'
                }`}
              >
                <span>Stage {stage.stageNumber}: {stage.title.split(':')[1]?.trim() || stage.title}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-black/20 text-white' : 'bg-black/5 dark:bg-white/5 text-[#868E96]'
                }`}>
                  {stageSolved}/{stage.problems.length}
                </span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          3. FILTER BAR & SEARCH
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Filters */}
          <div className="flex items-center flex-wrap gap-4">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
                Level:
              </span>
              <div className="inline-flex items-center p-0.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'EASY', label: 'Easy' },
                  { id: 'MEDIUM', label: 'Medium' },
                  { id: 'HARD', label: 'Hard' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(item.id)}
                    className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all cursor-pointer ${
                      selectedDifficulty === item.id
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
                  { id: 'SOLVED', label: 'Solved' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedStatus(item.id as any)}
                    className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all cursor-pointer ${
                      selectedStatus === item.id
                        ? 'bg-[#FFA116] text-white shadow-xs'
                        : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Search Input & Sound Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative w-56 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
              <input
                type="text"
                placeholder="Search question, #, company, pattern..."
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
                  : 'bg-[#FFA116]/10 border-[#FFA116]/30 text-[#FFA116]'
              }`}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          4. STAGE-BY-STAGE ROADMAP LIST
      ──────────────────────────────────────────────────────────────────────── */}
      {filteredStages.length === 0 ? (
        <div className="p-12 text-center rounded-xl border-2 border-dashed border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] space-y-3">
          <BookOpen className="w-10 h-10 text-[#868E96] mx-auto opacity-40" />
          <h3 className="font-display font-bold text-base text-[#121417] dark:text-white">
            No matching LeetCode problems found
          </h3>
          <p className="text-xs text-[#868E96] dark:text-[#777777] max-w-sm mx-auto">
            Try adjusting your search keywords, difficulty filter, or status toggles.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedStageId('ALL');
              setSelectedDifficulty('ALL');
              setSelectedStatus('ALL');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 bg-[#FFA116] hover:bg-[#E08A00] text-white rounded-md text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredStages.map(stage => {
            const isCollapsed = !!collapsedStages[stage.id];
            const StageIcon = STAGE_ICON_MAP[stage.iconName] || Layers;
            const stagePct = stage.problems.length > 0
              ? Math.round((stage.solvedCount / stage.problems.length) * 100)
              : 0;
            const isCompleted = stage.solvedCount === stage.problems.length && stage.problems.length > 0;

            return (
              <div
                key={stage.id}
                className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] overflow-hidden shadow-2xs transition-all"
              >
                {/* Stage Header Banner */}
                <div
                  onClick={() => toggleStageCollapse(stage.id)}
                  className="p-4 sm:p-5 bg-gradient-to-r from-transparent via-[#F8F9FA]/40 dark:via-white/[0.02] to-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02] border-b border-[#E9ECEF] dark:border-[#242424] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-[#FFA116]/15 border-[#FFA116]/30 text-[#E08A00] dark:text-[#FFA116]'
                    }`}>
                      <StageIcon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#FFA116] bg-[#FFA116]/10 border border-[#FFA116]/25 px-2 py-0.5 rounded">
                          {stage.cluster}
                        </span>
                        {stage.estimatedHours && (
                          <span className="text-[10px] font-mono text-[#868E96] dark:text-[#666666] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{stage.estimatedHours}</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Stage Mastered</span>
                          </span>
                        )}
                      </div>

                      <h2 className="font-display font-extrabold text-base sm:text-lg text-[#121417] dark:text-white mt-1">
                        {stage.title}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-0.5 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {/* Stage Progress Pill & Collapse Chevron */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#121417] dark:text-white">
                        {stage.solvedCount} / {stage.problems.length} Solved
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-[#FFA116]'
                          }`}
                          style={{ width: `${stagePct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      aria-label="Toggle stage accordion"
                    >
                      {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Stage Problems Table / List */}
                {!isCollapsed && (
                  <div className="divide-y divide-[#E9ECEF] dark:divide-[#202020]">
                    {stage.filteredProblems.map((p, idx) => {
                      const isSolved = solvedIds.has(p.id);
                      const isIntuitionOpen = !!expandedIntuitions[p.id];

                      return (
                        <div
                          key={p.id}
                          className={`p-4 transition-colors ${
                            isSolved
                              ? 'bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03] hover:bg-emerald-500/[0.05]'
                              : 'hover:bg-[#F8F9FA]/60 dark:hover:bg-[#181818]/50'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Left: Checkbox + Title + Pattern Info */}
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              {/* Solved Toggle Checkbox */}
                              <button
                                type="button"
                                onClick={(e) => handleToggleSolved(p.id, e)}
                                className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                                  isSolved
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                                    : 'border-[#CED4DA] dark:border-[#3A3A3A] bg-white dark:bg-[#1A1A1A] hover:border-[#FFA116]'
                                }`}
                                title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                              >
                                {isSolved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>

                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* LeetCode Number Badge */}
                                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                                    #{p.leetcodeNumber}
                                  </span>

                                  {/* Title Link */}
                                  <a
                                    href={p.leetcodeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`font-display text-sm font-bold transition-colors hover:text-[#FFA116] flex items-center gap-1.5 ${
                                      isSolved
                                        ? 'text-gray-500 dark:text-gray-400 line-through'
                                        : 'text-[#121417] dark:text-[#FFFFFF]'
                                    }`}
                                  >
                                    <span>{p.title}</span>
                                    <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                                  </a>

                                  {/* Difficulty Badge */}
                                  <span
                                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                      p.difficulty === 'EASY'
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                        : p.difficulty === 'MEDIUM'
                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                    }`}
                                  >
                                    {p.difficulty}
                                  </span>

                                  {/* Specific Pattern Badge */}
                                  <span className="text-[10px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#E9ECEF] dark:border-[#2A2A2A]">
                                    {p.pattern}
                                  </span>
                                </div>

                                {/* Target Placement Companies */}
                                {p.companyTags && p.companyTags.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                    <span className="text-[10px] text-[#868E96] dark:text-[#555555] font-display font-medium">
                                      Asked in:
                                    </span>
                                    {p.companyTags.map(company => (
                                      <span
                                        key={company}
                                        className="text-[9px] font-sans font-medium px-1.5 py-0.2 rounded bg-orange-500/5 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20"
                                      >
                                        {company}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pl-8 sm:pl-0">
                              {/* Quick Intuition Accordion Button */}
                              <button
                                type="button"
                                onClick={(e) => toggleIntuition(p.id, e)}
                                className="px-2.5 py-1 text-xs font-display font-bold text-gray-600 dark:text-gray-400 hover:text-[#FFA116] bg-black/5 dark:bg-white/5 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                                title="View solution intuition and pattern approach"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{isIntuitionOpen ? 'Hide Tip' : 'Approach'}</span>
                              </button>

                              {/* Primary External Action: Solve on LeetCode */}
                              <a
                                href={p.leetcodeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-[#FFA116] hover:bg-[#E08A00] text-white rounded-md text-xs font-display font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <span>Solve on LeetCode</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          {/* Expandable Key Intuition Drawer */}
                          {isIntuitionOpen && (
                            <div className="mt-3 p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] text-xs font-sans text-gray-700 dark:text-gray-300 space-y-1 animate-fadeIn pl-8">
                              <div className="flex items-center gap-1.5 text-xs font-display font-bold text-[#FFA116]">
                                <Zap className="w-3.5 h-3.5 text-[#FFA116]" />
                                <span>Placement Strategy &amp; Intuition</span>
                              </div>
                              <p className="leading-relaxed">
                                {p.keyIntuition}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
