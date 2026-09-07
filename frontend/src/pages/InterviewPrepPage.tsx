import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
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
  Flame,
  Copy,
  Check,
  Award,
} from 'lucide-react';
import { interviewService } from '@/services/interview.service';
import type { InterviewCategory } from '@/types/interview';

export default function InterviewPrepPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

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
    setSelectedSubject('ALL');
  };

  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({
    'int-dbms-1': true,
    'int-hr-1': true,
    'int-proj-1': true,
  });

  const { data: allQuestions = [], refetch } = useQuery({
    queryKey: ['interview-prep-questions'],
    queryFn: () => interviewService.getAllQuestions(),
  });

  // Category counts and mastered status
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

  // Filtered by Category
  const categoryQuestions = useMemo(() => {
    return allQuestions.filter(q => q.category === activeCategory);
  }, [allQuestions, activeCategory]);

  // Filtered by Subject and Search
  const filteredQuestions = useMemo(() => {
    return categoryQuestions.filter(q => {
      if (activeCategory === 'CORE_CS' && selectedSubject !== 'ALL') {
        if (q.subject !== selectedSubject) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchAnswer = q.answer.toLowerCase().includes(query);
        const matchCompany = q.companyTags?.some(c => c.toLowerCase().includes(query));
        if (!matchTitle && !matchAnswer && !matchCompany) return false;
      }
      return true;
    });
  }, [categoryQuestions, selectedSubject, searchQuery, activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedQuestionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleMastered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    interviewService.toggleQuestionMastered(id);
    refetch();
  };

  const handleCopyText = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12 font-sans relative">
      {/* 🚀 1. UNIFIED HEADER BANNER: Title on Left, Analytics on Right (Matching AptitudePage) */}
      <div className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 sm:max-w-md shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-display font-bold uppercase tracking-wider">
              <MessageSquareQuote className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>Interview Prep Hub</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
              {activeCategory === 'CORE_CS' && 'Core CS Fundamentals (DBMS, OS, OOPs, CN)'}
              {activeCategory === 'HR_BEHAVIORAL' && 'HR & Behavioral (STAR Method Framework)'}
              {activeCategory === 'PROJECT_DEFENSE' && 'Project Defense, Architecture & Viva'}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-sans mt-0.5">
              {activeCategory === 'CORE_CS' &&
                'Comprehensive technical interview questions, key concepts to mention, model answers, and interviewer insider tips.'}
              {activeCategory === 'HR_BEHAVIORAL' &&
                'Proven STAR framework (Situation, Task, Action, Result) model answers for leadership, teamwork, and conflict questions.'}
              {activeCategory === 'PROJECT_DEFENSE' &&
                'Ace tough project cross-examinations, architectural trade-offs, database choices, and system design decisions.'}
            </p>
          </div>

          {/* Embedded Donut & Category Progress (Exact Aptitude embedded styling) */}
          <div className="flex-1 lg:max-w-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Donut Ring with Mastered / Total inside */}
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

              {/* 3 Track Progress Bars */}
              <div className="grid grid-cols-3 gap-3 flex-1 max-w-md">
                {/* Core CS */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                    <span className="font-display font-bold text-purple-600 dark:text-purple-400">Core CS</span>
                    <span className="text-[#868E96] dark:text-[#666666]">{coreCsMastered}/{coreCsQuestions.length}</span>
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
                    <span className="font-display font-bold text-amber-600 dark:text-amber-400">HR STAR</span>
                    <span className="text-[#868E96] dark:text-[#666666]">{hrMastered}/{hrQuestions.length}</span>
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
                    <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">Project</span>
                    <span className="text-[#868E96] dark:text-[#666666]">{projectMastered}/{projectQuestions.length}</span>
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

      {/* 🏷️ 2. CATEGORY SELECTION PILLS + COMPACT SEARCH BAR (Matching AptitudePage cluster pills) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Category Selection Switchers */}
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
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
              activeCategory === 'CORE_CS' ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-black/5 dark:bg-white/5'
            }`}>
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
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
              activeCategory === 'HR_BEHAVIORAL' ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-black/5 dark:bg-white/5'
            }`}>
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
            <span>Project Defense & Viva</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
              activeCategory === 'PROJECT_DEFENSE' ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-black/5 dark:bg-white/5'
            }`}>
              {projectQuestions.length}
            </span>
          </button>
        </div>

        {/* Compact Search Bar (Matching AptitudePage) */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          <div className="relative w-48 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
            <input
              type="text"
              placeholder={`Search ${activeCategory === 'CORE_CS' ? 'DBMS, OS, OOPs...' : 'interview questions...'}`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
            />
          </div>
        </div>
      </div>

      {/* 🎚️ 3. CORE CS SUBJECT SUB-FILTER PILLS */}
      {activeCategory === 'CORE_CS' && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider mr-1">
            Subject:
          </span>
          {[
            { label: 'All Core CS', value: 'ALL' },
            { label: 'DBMS', value: 'DBMS' },
            { label: 'SQL Queries', value: 'SQL_QUERIES' },
            { label: 'OOPs Concepts', value: 'OOPS' },
            { label: 'Operating Systems', value: 'OPERATING_SYSTEMS' },
            { label: 'Computer Networks', value: 'COMPUTER_NETWORKS' },
          ].map(sub => (
            <button
              key={sub.value}
              type="button"
              onClick={() => setSelectedSubject(sub.value)}
              className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all border cursor-pointer ${
                selectedSubject === sub.value
                  ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-2xs'
                  : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* 📚 4. QUESTION ACCORDION LIST */}
      <div className="space-y-3">
        {filteredQuestions.map(q => {
          const isExpanded = !!expandedQuestionIds[q.id];

          return (
            <div
              key={q.id}
              className="rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] overflow-hidden shadow-2xs hover:border-[#121417]/30 dark:hover:border-[#444444] transition-all"
            >
              {/* Question Header Card */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-4 sm:p-4.5 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Solved / Mastered Checkbox Button */}
                  <button
                    type="button"
                    onClick={e => handleToggleMastered(q.id, e)}
                    className="mt-0.5 shrink-0 cursor-pointer text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors"
                    title={q.mastered ? 'Mark as not mastered' : 'Mark as mastered'}
                  >
                    {q.mastered ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    {/* Badges Row */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {q.frequency === 'VERY_HIGH' && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                          <Flame className="w-2.5 h-2.5" />
                          High Frequency
                        </span>
                      )}
                      {q.subjectLabel && (
                        <span className="text-[10px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-1.5 py-0.5 rounded">
                          {q.subjectLabel}
                        </span>
                      )}
                      {q.companyTags?.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Question Title */}
                    <h3 className="font-display font-bold text-sm text-[#121417] dark:text-[#FFFFFF] leading-snug">
                      {q.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-center">
                  <div className="p-1 rounded bg-[#F8F9FA] dark:bg-[#1C1C1C] text-[#868E96] dark:text-[#777777]">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-3 border-t border-[#E9ECEF] dark:border-[#242424] space-y-4 bg-[#FDFDFD] dark:bg-[#121212] animate-fadeIn">
                  {/* Quick Bullet Points */}
                  {q.bulletPoints && q.bulletPoints.length > 0 && (
                    <div className="p-3 bg-[#F8F9FA] dark:bg-[#181818] border border-[#E9ECEF] dark:border-[#242424] rounded-md space-y-1.5">
                      <div className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider">
                        Key Concepts to Mention
                      </div>
                      <ul className="space-y-1 text-xs text-[#343A40] dark:text-[#CCCCCC]">
                        {q.bulletPoints.map((bp, bpIdx) => (
                          <li key={bpIdx} className="flex items-start gap-2">
                            <span className="text-[#FD4A32] font-bold mt-0.5">•</span>
                            <span dangerouslySetInnerHTML={{ __html: bp.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Full Model Answer */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider">
                        Model Answer
                      </span>
                      <button
                        type="button"
                        onClick={e => handleCopyText(q.answer, `ans-${q.id}`, e)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#868E96] hover:text-[#121417] dark:hover:text-white cursor-pointer transition-colors"
                      >
                        {copiedId === `ans-${q.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Answer</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-xs leading-relaxed text-[#343A40] dark:text-[#CCCCCC] whitespace-pre-line font-sans">
                      {q.answer}
                    </div>
                  </div>

                  {/* Code Snippet if applicable */}
                  {q.codeSnippet && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#868E96] dark:text-[#777777]">
                          {q.codeSnippet.language} Code Example
                        </span>
                        <button
                          type="button"
                          onClick={e => handleCopyText(q.codeSnippet!.code, `code-${q.id}`, e)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#868E96] hover:text-[#121417] dark:hover:text-white cursor-pointer transition-colors"
                        >
                          {copiedId === `code-${q.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-[#0D1117] border border-[#30363D] rounded-md p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
                        <pre>{q.codeSnippet.code}</pre>
                      </div>
                    </div>
                  )}

                  {/* Interviewer Pro-Tip */}
                  {q.proTip && (
                    <div className="p-3 bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 rounded-md space-y-1 text-xs text-purple-950 dark:text-purple-200">
                      <div className="font-bold flex items-center gap-1.5 text-[10px] text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        <Lightbulb className="w-3 h-3" />
                        Interviewer Insider Tip
                      </div>
                      <p className="leading-relaxed text-xs">{q.proTip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-10 text-center space-y-2 shadow-2xs">
            <MessageSquareQuote className="w-7 h-7 text-[#868E96] mx-auto" />
            <h3 className="font-display font-bold text-sm text-[#121417] dark:text-[#FFFFFF]">
              No interview questions found
            </h3>
            <p className="text-xs text-[#868E96] max-w-sm mx-auto font-sans">
              Try adjusting your search keywords or switching subject filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
