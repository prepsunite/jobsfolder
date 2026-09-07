import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  MessageSquareQuote,
  Database,
  Cpu,
  Layers,
  Network,
  Users,
  Award,
  Search,
  CheckCircle2,
  Circle,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Building2,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { interviewService } from '@/services/interview.service';
import type { InterviewQuestion, InterviewCategory, CoreCsSubject } from '@/types/interview';

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
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({
    'int-dbms-1': true,
    'int-hr-1': true,
    'int-proj-1': true,
  });

  const { data: allQuestions = [], refetch } = useQuery({
    queryKey: ['interview-prep-questions'],
    queryFn: () => interviewService.getAllQuestions(),
  });

  // Filtered by Category
  const categoryQuestions = useMemo(() => {
    return allQuestions.filter(q => q.category === activeCategory);
  }, [allQuestions, activeCategory]);

  // Mastered count
  const masteredCount = useMemo(() => {
    return allQuestions.filter(q => q.mastered).length;
  }, [allQuestions]);

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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#181a20] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-bold uppercase tracking-wider">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              Technical & HR Placement Interview Bible
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Top Interview Questions & Model Answers
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Curated battle-tested answers for Core CS (DBMS, OOPs, OS, Networks), HR Behavioral rounds using the STAR method, and academic project defense.
            </p>
          </div>

          {/* Mastered Progress Widget */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex items-center gap-5 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Questions Mastered</div>
              <div className="text-2xl font-black text-white font-mono">
                {masteredCount} <span className="text-xs text-slate-400 font-sans font-normal">/ {allQuestions.length} Q&As</span>
              </div>
              <div className="w-32 bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${allQuestions.length > 0 ? (masteredCount / allQuestions.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-[#22242a] pb-3">
        <button
          onClick={() => handleCategoryChange('CORE_CS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'CORE_CS'
              ? 'bg-[#FD4A32] text-white shadow-md shadow-[#FD4A32]/25'
              : 'bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] text-gray-700 dark:text-gray-300 hover:border-gray-300'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Core CS Fundamentals</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
            {allQuestions.filter(q => q.category === 'CORE_CS').length}
          </span>
        </button>

        <button
          onClick={() => handleCategoryChange('HR_BEHAVIORAL')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'HR_BEHAVIORAL'
              ? 'bg-[#FD4A32] text-white shadow-md shadow-[#FD4A32]/25'
              : 'bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] text-gray-700 dark:text-gray-300 hover:border-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>HR Behavioral (STAR Framework)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
            {allQuestions.filter(q => q.category === 'HR_BEHAVIORAL').length}
          </span>
        </button>

        <button
          onClick={() => handleCategoryChange('PROJECT_DEFENSE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'PROJECT_DEFENSE'
              ? 'bg-[#FD4A32] text-white shadow-md shadow-[#FD4A32]/25'
              : 'bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] text-gray-700 dark:text-gray-300 hover:border-gray-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Project Defense & Viva</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-white">
            {allQuestions.filter(q => q.category === 'PROJECT_DEFENSE').length}
          </span>
        </button>
      </div>

      {/* Subcategory Filter Pills (for Core CS) */}
      {activeCategory === 'CORE_CS' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
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
              onClick={() => setSelectedSubject(sub.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === sub.value
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-gray-100 dark:bg-[#1a1b1f] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeCategory === 'CORE_CS' ? 'DBMS, OOPs, OS, SQL' : 'HR questions or project tips'}...`}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] rounded-2xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden shadow-xs"
        />
      </div>

      {/* Question Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = !!expandedQuestionIds[q.id];

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] rounded-3xl overflow-hidden shadow-xs transition-all hover:border-gray-300 dark:hover:border-[#35373e]"
            >
              {/* Question Header Card */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={e => handleToggleMastered(q.id, e)}
                    className="mt-0.5 text-gray-300 hover:text-purple-500 transition-colors shrink-0 cursor-pointer"
                    title={q.mastered ? 'Mark as not mastered' : 'Mark as mastered'}
                  >
                    {q.mastered ? (
                      <CheckCircle2 className="w-5 h-5 text-purple-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {q.frequency === 'VERY_HIGH' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                          <Flame className="w-3 h-3" />
                          High Frequency
                        </span>
                      )}
                      {q.subjectLabel && (
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-[#202126] px-2 py-0.5 rounded-md">
                          {q.subjectLabel}
                        </span>
                      )}
                      {q.companyTags?.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-bold text-base text-gray-900 dark:text-white">
                      {q.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-xl bg-gray-50 dark:bg-[#202126] text-gray-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Answer Content */}
              {isExpanded && (
                <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-gray-100 dark:border-[#22242a] space-y-5 animate-fadeIn">
                  {/* Quick Bullet Points */}
                  {q.bulletPoints && q.bulletPoints.length > 0 && (
                    <div className="p-4 bg-gray-50 dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#28292f] rounded-2xl space-y-2">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Key Concepts to Mention
                      </div>
                      <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
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
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Model Answer
                    </div>
                    <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line space-y-2">
                      {q.answer}
                    </div>
                  </div>

                  {/* Code Snippet if applicable */}
                  {q.codeSnippet && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        {q.codeSnippet.language.toUpperCase()} Implementation
                      </div>
                      <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
                        <pre>{q.codeSnippet.code}</pre>
                      </div>
                    </div>
                  )}

                  {/* Interviewer Pro-Tip */}
                  {q.proTip && (
                    <div className="p-4 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 rounded-2xl space-y-1 text-xs text-purple-900 dark:text-purple-200">
                      <div className="font-bold flex items-center gap-1.5 text-[11px] text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Interviewer Insider Tip
                      </div>
                      <p className="leading-relaxed">{q.proTip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#26282e] rounded-3xl p-12 text-center space-y-3">
            <MessageSquareQuote className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">No interview questions found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your search keywords or switching subject categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
