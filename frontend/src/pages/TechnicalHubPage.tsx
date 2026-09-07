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
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
  HardDrive,
  Building2,
  Lightbulb,
  ExternalLink,
  BookOpen,
  Filter,
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

  // Solved Stats
  const solvedCount = useMemo(() => {
    return currentProblems.filter(p => p.solved).length;
  }, [currentProblems]);

  const handleToggleSolve = (problemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    technicalService.toggleProblemSolved(problemId);
    if (activeTrack === 'PROGRAMMING_150') refetchP150();
    else refetchDsa();
    if (selectedProblem && selectedProblem.id === problemId) {
      setSelectedProblem(prev => prev ? { ...prev, solved: !prev.solved } : null);
    }
  };

  const handleCopyCode = (codeText: string) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#16171b] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FD4A32]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FD4A32]/20 border border-[#FD4A32]/40 text-[#FD4A32] text-[11px] font-bold uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              Technical & Coding Placement Suite
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Master Coding Rounds & Pseudo-Code
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Step-by-step logic building from fundamental syntax to the 15 repeatable placement patterns asked in TCS Digital, Infosys SP/DSE, Cognizant, and Amazon.
            </p>
          </div>

          {/* Quick Progress KPI */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex items-center gap-5 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#FD4A32]/10 border border-[#FD4A32]/30 flex items-center justify-center text-[#FD4A32]">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Solved Progress</div>
              <div className="text-2xl font-black text-white font-mono">
                {solvedCount} <span className="text-xs text-slate-400 font-sans font-normal">/ {currentProblems.length} Problems</span>
              </div>
              <div className="w-32 bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#FD4A32] h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentProblems.length > 0 ? (solvedCount / currentProblems.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Track Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-[#22242a] pb-3">
        <button
          onClick={() => handleTrackChange('PROGRAMMING_150')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTrack === 'PROGRAMMING_150'
              ? 'bg-[#FD4A32] text-white shadow-md shadow-[#FD4A32]/25'
              : 'bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] text-gray-700 dark:text-gray-300 hover:border-gray-300'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Programming 150 (Basic to Hard)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
            {p150Problems.length}
          </span>
        </button>

        <button
          onClick={() => handleTrackChange('CAMPUS_DSA')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTrack === 'CAMPUS_DSA'
              ? 'bg-[#FD4A32] text-white shadow-md shadow-[#FD4A32]/25'
              : 'bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] text-gray-700 dark:text-gray-300 hover:border-gray-300'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Campus DSA Core (Top 100)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
            {dsaProblems.length}
          </span>
        </button>

        <button
          onClick={() => handleTrackChange('TECHNICAL_MCQS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTrack === 'TECHNICAL_MCQS'
              ? 'bg-[#FD4A32] text-white shadow-md shadow-[#FD4A32]/25'
              : 'bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] text-gray-700 dark:text-gray-300 hover:border-gray-300'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Technical MCQs & Pseudo-Code</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
            {mcqs.length}
          </span>
        </button>
      </div>

      {/* VIEW A & B: PROGRAMMING 150 & CAMPUS DSA */}
      {activeTrack !== 'TECHNICAL_MCQS' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] p-3 rounded-2xl shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search coding problems by title, pattern, or company..."
                className="w-full pl-9 pr-4 py-2 bg-transparent text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-2 md:pt-0">
              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#1e1f23] border border-gray-200 dark:border-[#2e3035] text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                <option value="ALL">All Levels</option>
                <option value="BASIC">Basic (Level 1)</option>
                <option value="MEDIUM">Medium (Level 2)</option>
                <option value="HARD">Hard (Level 3)</option>
              </select>

              {/* Category Filter */}
              {availableCategories.length > 0 && (
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#1e1f23] border border-gray-200 dark:border-[#2e3035] text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer max-w-[200px]"
                >
                  <option value="ALL">All Categories</option>
                  {availableCategories.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Problem Cards List */}
          <div className="grid grid-cols-1 gap-3">
            {filteredProblems.map((problem, index) => (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem)}
                className="group bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] hover:border-[#FD4A32]/50 dark:hover:border-[#FD4A32]/50 rounded-2xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={e => handleToggleSolve(problem.id, e)}
                    className="mt-0.5 text-gray-300 hover:text-emerald-500 transition-colors shrink-0 cursor-pointer"
                    title={problem.solved ? 'Mark as unsolved' : 'Mark as solved'}
                  >
                    {problem.solved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-gray-400 font-bold">
                        #{index + 1}
                      </span>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#FD4A32] transition-colors">
                        {problem.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          problem.level === 'BASIC'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : problem.level === 'MEDIUM'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {problem.level}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {problem.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-[11px] font-medium text-gray-400 bg-gray-100 dark:bg-[#202126] px-2 py-0.5 rounded-md">
                        {problem.categoryLabel}
                      </span>
                      {problem.companyTags?.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-right text-[11px] font-mono text-gray-400 hidden sm:block">
                    <div>Time: {problem.timeComplexity}</div>
                    <div>Space: {problem.spaceComplexity}</div>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-[#22242a] text-gray-700 dark:text-gray-300 group-hover:bg-[#FD4A32] group-hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                    <span>Solve & View Code</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredProblems.length === 0 && (
              <div className="bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] rounded-3xl p-12 text-center space-y-3">
                <Code2 className="w-8 h-8 text-gray-400 mx-auto" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">No coding problems found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different difficulty level.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW C: TECHNICAL MCQS & PSEUDO-CODE */}
      {activeTrack === 'TECHNICAL_MCQS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {mcqs.map((mcq, idx) => {
              const selectedAnswer = selectedMcqAnswers[mcq.id];
              const hasAnswered = selectedAnswer !== undefined;

              return (
                <div
                  key={mcq.id}
                  className="bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#FD4A32]">Question #{idx + 1}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-[#22242a] text-gray-600 dark:text-gray-300">
                          {mcq.topic}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                        {mcq.question}
                      </h3>
                    </div>
                    {mcq.companyTags && (
                      <div className="flex items-center gap-1 shrink-0">
                        {mcq.companyTags.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Code Snippet if present */}
                  {mcq.codeSnippet && (
                    <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
                      <pre>{mcq.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {mcq.options.map((option, optIdx) => {
                      const isSelected = selectedAnswer === optIdx;
                      const isCorrect = mcq.correctOptionIndex === optIdx;

                      let btnStyle = 'border-gray-200 dark:border-[#2c2e36] bg-gray-50/50 dark:bg-[#191a1e] hover:border-gray-300';
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
                          className={`p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current shrink-0 flex items-center justify-center font-bold text-[10px]">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="pt-0.5">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation reveal */}
                  {hasAnswered && (
                    <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-2xl space-y-1 text-xs text-blue-900 dark:text-blue-200 animate-fadeIn">
                      <div className="font-bold flex items-center gap-1.5 text-[11px] text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Explanation
                      </div>
                      <p className="leading-relaxed">{mcq.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROBLEM CODE WORKSPACE MODAL */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#2e3035] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 dark:border-[#24262b] flex items-center justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      selectedProblem.level === 'BASIC'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : selectedProblem.level === 'MEDIUM'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {selectedProblem.level}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{selectedProblem.categoryLabel}</span>
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {selectedProblem.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleSolve(selectedProblem.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedProblem.solved
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-[#202126] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {selectedProblem.solved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Solved</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>Mark Solved</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#202126] cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              {/* Problem Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Problem Statement</h4>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {selectedProblem.description}
                </p>
              </div>

              {/* Sample Input & Output */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-gray-50 dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#28292f] rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Sample Input</div>
                  <pre className="font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {selectedProblem.sampleInput}
                  </pre>
                </div>
                <div className="p-3.5 bg-gray-50 dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#28292f] rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Sample Output</div>
                  <pre className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold whitespace-pre-wrap">
                    {selectedProblem.sampleOutput}
                  </pre>
                </div>
              </div>

              {/* Complexity Badges */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#18191d] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FD4A32]" />
                  <span>Time Complexity: <strong>{selectedProblem.timeComplexity}</strong></span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                  <span>Space Complexity: <strong>{selectedProblem.spaceComplexity}</strong></span>
                </div>
              </div>

              {/* Multi-Language Solution Workspace */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1d1e22] p-1 rounded-xl">
                    {(['java', 'python', 'cpp', 'c'] as const).map(lang => {
                      const hasCode = !!selectedProblem.solutions[lang];
                      if (!hasCode) return null;

                      return (
                        <button
                          key={lang}
                          onClick={() => setSelectedLanguage(lang)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${
                            selectedLanguage === lang
                              ? 'bg-[#FD4A32] text-white shadow-xs'
                              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                          }`}
                        >
                          {lang === 'cpp' ? 'C++' : lang}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleCopyCode(selectedProblem.solutions[selectedLanguage] || '')}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2e3035] bg-gray-50 dark:bg-[#1a1b1f] hover:bg-gray-100 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Block Container */}
                <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs text-slate-100 overflow-x-auto border border-slate-800 shadow-inner">
                  <pre>{selectedProblem.solutions[selectedLanguage] || '// No solution available for this language'}</pre>
                </div>
              </div>

              {/* Step-by-Step Logic Explanation */}
              {selectedProblem.explanation && (
                <div className="p-4 bg-orange-50/50 dark:bg-[#FD4A32]/5 border border-orange-200/60 dark:border-[#FD4A32]/20 rounded-2xl space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-[#FD4A32] uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4" />
                    Logic & Dry-Run Walkthrough
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
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
