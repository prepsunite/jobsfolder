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
} from 'lucide-react';
import { technicalService } from '@/services/technical.service';
import type { ProgrammingProblem, TechnicalMcq, ProblemLevel, TechnicalTrack } from '@/types/technical';

export default function TechnicalHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const trackParam = searchParams.get('track');

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
  };

  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<ProgrammingProblem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'java' | 'python' | 'cpp' | 'c'>('java');
  const [copied, setCopied] = useState(false);
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState<Record<string, number>>({});

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

  // Distinct categories in active track
  const availableCategories = useMemo(() => {
    const map = new Map<string, string>();
    currentProblems.forEach(p => {
      map.set(p.category, p.categoryLabel);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [currentProblems]);

  // Filtered Problems
  const filteredProblems = useMemo(() => {
    return currentProblems.filter(p => {
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
  }, [currentProblems, selectedLevel, selectedCategory, searchQuery]);

  // Solved Count in current track
  const currentTrackSolvedCount = useMemo(() => {
    return currentProblems.filter(p => p.solved).length;
  }, [currentProblems]);

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
              {activeTrack === 'PROGRAMMING_150' && 'Programming 150 (Syntax to Hard)'}
              {activeTrack === 'CAMPUS_DSA' && 'Campus DSA Core (Top 100 Patterns)'}
              {activeTrack === 'TECHNICAL_MCQS' && 'Technical MCQs & Pseudo-Code'}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-sans mt-0.5">
              {activeTrack === 'PROGRAMMING_150' &&
                'Build strong syntax foundations, loop mechanics, number logic, patterns, arrays, and recursion.'}
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

      {/* 🏷️ 2. TRACK SELECTION PILLS + COMPACT SEARCH BAR (Matching AptitudePage cluster pills) */}
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

        {/* Compact Search Bar (Matching AptitudePage) */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          <div className="relative w-48 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
            <input
              type="text"
              placeholder="Search problems or patterns..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
            />
          </div>
        </div>
      </div>

      {/* 🎚️ 3. LEVEL & SUB-CATEGORY FILTER PILLS (Only for Coding Tracks) */}
      {activeTrack !== 'TECHNICAL_MCQS' && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider mr-1">
            Difficulty:
          </span>
          {['ALL', 'BASIC', 'MEDIUM', 'HARD'].map(lvl => (
            <button
              key={lvl}
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

          {availableCategories.length > 1 && (
            <>
              <span className="text-[#868E96] dark:text-[#444444] mx-1">|</span>
              <span className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider mr-1">
                Category:
              </span>
              <button
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

      {/* 📋 4. PROBLEM DIRECTORY (2-Column Grid Matching AptitudePage) */}
      {activeTrack !== 'TECHNICAL_MCQS' && (
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

          {filteredProblems.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs text-gray-500 font-bold bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg">
              No coding problems match the selected filters.
            </div>
          )}
        </div>
      )}

      {/* 📝 5. TECHNICAL MCQS VIEW (Aptitude-styled Question Cards) */}
      {activeTrack === 'TECHNICAL_MCQS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mcqs.map((mcq, idx) => {
            const selectedAnswer = selectedMcqAnswers[mcq.id];
            const hasAnswered = selectedAnswer !== undefined;

            return (
              <div
                key={mcq.id}
                className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg p-4 space-y-3 shadow-2xs"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#FD4A32]">Q{idx + 1}</span>
                    <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded bg-[#F1F3F5] dark:bg-[#202020] text-gray-600 dark:text-gray-300">
                      {mcq.topic}
                    </span>
                  </div>
                  {mcq.companyTags && (
                    <div className="flex items-center gap-1 shrink-0">
                      {mcq.companyTags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-[9px] font-bold text-[#868E96] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-1.5 py-0.2 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="font-display font-bold text-xs sm:text-sm text-[#121417] dark:text-[#FFFFFF] leading-snug">
                  {mcq.question}
                </h3>

                {/* Code Snippet if present */}
                {mcq.codeSnippet && (
                  <div className="bg-[#0C0C0C] rounded-md p-3 font-mono text-xs text-emerald-400 overflow-x-auto border border-[#242424]">
                    <pre>{mcq.codeSnippet}</pre>
                  </div>
                )}

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mcq.options.map((option, optIdx) => {
                    const isSelected = selectedAnswer === optIdx;
                    const isCorrect = mcq.correctOptionIndex === optIdx;

                    let btnStyle = 'border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#141414] hover:border-[#121417]';
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => {
                          setSelectedMcqAnswers(prev => ({ ...prev, [mcq.id]: optIdx }));
                        }}
                        className={`p-2.5 rounded-md border text-xs text-left transition-all flex items-start gap-2 cursor-pointer disabled:cursor-default ${btnStyle}`}
                      >
                        <span className="w-4 h-4 rounded-full border border-current shrink-0 flex items-center justify-center font-bold text-[9px]">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="pt-0.2 truncate">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation reveal */}
                {hasAnswered && (
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-md space-y-1 text-xs text-blue-900 dark:text-blue-200 animate-fadeIn">
                    <div className="font-bold flex items-center gap-1.5 text-[10px] text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                      <Lightbulb className="w-3 h-3" />
                      Explanation
                    </div>
                    <p className="leading-relaxed text-[11px]">{mcq.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 🔍 6. PROBLEM SOLUTION WORKSPACE MODAL (Aptitude Editor Modal Style) */}
      {selectedProblem && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E9ECEF] dark:border-[#222222] flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 border border-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4 text-[#FD4A32]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-sm sm:text-base text-[#121417] dark:text-white truncate">
                    {selectedProblem.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-[#868E96] font-mono">
                    <span>{selectedProblem.categoryLabel}</span>
                    <span>•</span>
                    <span className="text-[#FD4A32] font-bold">{selectedProblem.level}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleSolve(selectedProblem.id)}
                  className={`px-3 py-1 rounded text-xs font-display font-bold transition-all border cursor-pointer ${
                    selectedProblem.solved
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white dark:bg-[#1A1A1A] border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-white hover:border-[#FD4A32]'
                  }`}
                >
                  {selectedProblem.solved ? '✓ Solved' : 'Mark Solved'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProblem(null)}
                  className="p-1 rounded-md text-[#868E96] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar flex-1">
              {/* Problem Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#868E96] dark:text-[#777777]">
                  Problem Logic &amp; Constraints
                </span>
                <p className="text-xs sm:text-sm text-[#495057] dark:text-[#AAAAAA] leading-relaxed">
                  {selectedProblem.description}
                </p>
              </div>

              {/* Complexity Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
                  <Clock className="w-3 h-3 text-[#FD4A32]" />
                  <span className="text-[#868E96] dark:text-[#777777]">Time:</span>
                  <span className="font-bold text-[#121417] dark:text-white">{selectedProblem.timeComplexity}</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
                  <HardDrive className="w-3 h-3 text-blue-500" />
                  <span className="text-[#868E96] dark:text-[#777777]">Space:</span>
                  <span className="font-bold text-[#121417] dark:text-white">{selectedProblem.spaceComplexity}</span>
                </div>
              </div>

              {/* Multi-Language Tabs & Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#E9ECEF] dark:border-[#242424] pb-1.5">
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
