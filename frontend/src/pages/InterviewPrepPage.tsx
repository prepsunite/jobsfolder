import React, { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import { interviewService } from '@/services/interview.service';
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

  // Query All Questions (Seed + Mastered State)
  const { data: allQuestions = [], refetch } = useQuery({
    queryKey: ['interview-prep-questions'],
    queryFn: () => interviewService.getAllQuestions(),
  });

  // Query Topics for activeCategory
  const { data: topics = [] } = useQuery<InterviewTopic[]>({
    queryKey: ['interview-prep-topics', activeCategory],
    queryFn: () => interviewService.getTopicsForCategory(activeCategory),
  });

  // Active topic object if topicParam is present
  const activeTopic = useMemo(() => {
    if (!topicParam) return null;
    return topics.find(t => t.id === topicParam) || null;
  }, [topicParam, topics]);

  // Distinct clusters for directory filter pills
  const clusters = useMemo(() => {
    const raw = Array.from(new Set(topics.map(t => t.cluster)));
    return ['All Topics', ...raw];
  }, [topics]);

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
    return topics.filter(topic => {
      const matchCluster = selectedCluster === 'All Topics' || topic.cluster === selectedCluster;
      const matchSearch =
        !searchQuery.trim() ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.cluster.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCluster && matchSearch;
    });
  }, [topics, selectedCluster, searchQuery]);

  // Active topic questions
  const activeTopicQuestions = useMemo(() => {
    if (!activeTopic) return [];
    return allQuestions.filter(q => q.topicId === activeTopic.id);
  }, [activeTopic, allQuestions]);

  const activeTopicMasteredCount = useMemo(() => {
    return activeTopicQuestions.filter(q => q.mastered).length;
  }, [activeTopicQuestions]);

  const topicMasteryPct =
    activeTopicQuestions.length > 0
      ? Math.round((activeTopicMasteredCount / activeTopicQuestions.length) * 100)
      : 0;

  // Filtered questions for Topic Practice Mode
  const filteredQuestions = useMemo(() => {
    return activeTopicQuestions.filter(q => {
      if (selectedStatus === 'MASTERED' && !q.mastered) return false;
      if (selectedStatus === 'UNMASTERED' && q.mastered) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchAnswer = q.answer.toLowerCase().includes(query);
        const matchCompany = q.companyTags?.some(c => c.toLowerCase().includes(query));
        if (!matchTitle && !matchAnswer && !matchCompany) return false;
      }
      return true;
    });
  }, [activeTopicQuestions, selectedStatus, searchQuery]);

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

  return (
    <div
      className={`space-y-6 animate-fadeIn pb-12 font-sans relative ${
        activeTopic ? 'max-w-4xl mx-auto' : 'max-w-6xl mx-auto'
      }`}
    >
      {/* ────────────────────────────────────────────────────────────────────────
          TOPIC PRACTICE VIEW (When a Topic is Selected)
          Matches PrepUnite TopicQuestionsPage & TechnicalHub Blueprint
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTopic ? (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. Breadcrumb & Return Navigation */}
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
              Interview Practice Mode
            </span>
          </div>

          {/* 2. Topic Header Banner */}
          <div className="p-5 sm:p-6 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#121417] dark:text-[#FFFFFF] shadow-xs">
            <div className="space-y-2">
              <span className="text-[9px] font-display font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                {activeCategory === 'CORE_CS' && 'Core CS • '}
                {activeCategory === 'HR_BEHAVIORAL' && 'HR & Behavioral • '}
                {activeCategory === 'PROJECT_DEFENSE' && 'Project Defense • '}
                {activeTopic.cluster}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {activeTopic.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-sans">
                {activeTopic.description}
              </p>

              {/* Topic Mastery Progress Bar */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-44 h-2 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${topicMasteryPct}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {activeTopicMasteredCount} / {activeTopicQuestions.length} Mastered ({topicMasteryPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* 3. In-Topic Filters & Search Bar */}
          <div className="p-3.5 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Mastery Status Filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
                  Filter:
                </span>
                <div className="inline-flex items-center p-0.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
                  {[
                    { id: 'ALL', label: 'All Questions' },
                    { id: 'UNMASTERED', label: 'To Learn' },
                    { id: 'MASTERED', label: `Mastered (${activeTopicMasteredCount})` },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedStatus(item.id as any)}
                      className={`px-2.5 py-1 rounded text-xs font-display font-bold transition-all cursor-pointer ${
                        selectedStatus === item.id
                          ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                          : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Topic Search Input */}
              <div className="relative w-48 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
                <input
                  type="text"
                  placeholder="Search in this topic..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>
          </div>

          {/* 4. Question Cards List */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="p-10 text-center rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414]">
                <HelpCircle className="w-8 h-8 text-[#868E96] mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-[#868E96] dark:text-[#555555]">
                  No interview questions match your selected status or search filter.
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
              filteredQuestions.map(q => {
                const isExpanded = expandedQuestionIds[q.id] ?? true;

                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] overflow-hidden shadow-xs hover:border-[#121417]/30 dark:hover:border-[#444444] transition-all"
                  >
                    {/* Question Card Header */}
                    <div
                      onClick={() => toggleExpand(q.id)}
                      className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Mastered Toggle Checkbox */}
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
                          <div className="flex items-center gap-2 flex-wrap">
                            {q.frequency && (
                              <span
                                className={`text-[9px] font-display font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                  q.frequency === 'VERY_HIGH'
                                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                }`}
                              >
                                {q.frequency === 'VERY_HIGH' ? 'High Yield' : 'Frequently Asked'}
                              </span>
                            )}
                            {q.companyTags?.slice(0, 4).map(c => (
                              <span
                                key={c}
                                className="text-[9px] font-mono text-[#868E96] dark:text-[#777777] bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] px-1.5 py-0.2 rounded"
                              >
                                {c}
                              </span>
                            ))}
                          </div>

                          <h3 className="font-display font-bold text-sm sm:text-base text-[#121417] dark:text-[#FFFFFF] leading-snug">
                            {q.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          className="p-1 text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Question Content Accordion */}
                    {isExpanded && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0 border-t border-[#E9ECEF] dark:border-[#242424] space-y-4 animate-fadeIn">
                        {/* 1. Key Concepts to Mention ("Interviewer Checklist") */}
                        {q.bulletPoints && q.bulletPoints.length > 0 && (
                          <div className="pt-3.5 space-y-2">
                            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                              Key Concepts Interviewers Look For:
                            </span>
                            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 font-sans pl-2 border-l-2 border-purple-500/30">
                              {q.bulletPoints.map((point, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 2. Model Answer / Script */}
                        <div className="space-y-1.5 bg-[#F8F9FA] dark:bg-[#0C0C0C] p-4 rounded-lg border border-[#E9ECEF] dark:border-[#242424]">
                          <div className="flex items-center justify-between pb-1 border-b border-[#E9ECEF] dark:border-[#242424]">
                            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#121417] dark:text-white">
                              Model Answer (Concise &amp; Articulate)
                            </span>
                            <button
                              type="button"
                              onClick={e => handleCopyText(q.answer, q.id, e)}
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedId === q.id ? (
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
                          <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-line pt-1">
                            {q.answer}
                          </div>
                        </div>

                        {/* 3. Code Snippet Box (if available) */}
                        {q.codeSnippet && (
                          <div className="rounded-lg bg-[#0C0C0C] dark:bg-[#000000] border border-[#242424] overflow-hidden text-xs font-mono">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-[#141414] border-b border-[#242424] text-[10px] text-[#888888]">
                              <span className="font-bold uppercase tracking-wider">
                                {q.codeSnippet.language} Implementation
                              </span>
                              <button
                                type="button"
                                onClick={e => handleCopyText(q.codeSnippet!.code, `${q.id}-code`, e)}
                                className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedId === `${q.id}-code` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Code</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-3 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                              {q.codeSnippet.code}
                            </pre>
                          </div>
                        )}

                        {/* 4. Pro-Tip Insider Advice */}
                        {q.proTip && (
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-display font-bold text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-wider block">
                                Interviewer Insider Tip:
                              </span>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                                {q.proTip}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────────────────────
            MAIN DIRECTORY VIEW (Matching AptitudePage & TechnicalHubPage)
        ──────────────────────────────────────────────────────────────────────── */
        <>
          {/* 🚀 1. UNIFIED HEADER BANNER: Title on Left, Analytics on Right */}
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

          {/* 🏷️ 3. CLUSTER FILTER PILLS + SEARCH BAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Cluster Pills */}
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

            {/* Real-Time Search Bar */}
            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <div className="relative w-48 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>
          </div>

          {/* 📁 4. TOPIC DIRECTORY CARDS (2-Column Grid Matching Aptitude & Technical Hub) */}
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
                const TopicIcon = TOPIC_ICON_MAP[topic.iconName] || BookOpen;
                const topicQuestions = allQuestions.filter(q => q.topicId === topic.id);
                const masteredInTopic = topicQuestions.filter(q => q.mastered).length;

                return (
                  <div
                    key={topic.id}
                    onClick={() => selectTopic(topic.id)}
                    className="group flex items-center justify-between p-3.5 bg-white dark:bg-[#141414] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] hover:border-purple-500/50 dark:hover:border-purple-500/50 rounded-lg transition-all duration-150 shadow-2xs cursor-pointer"
                  >
                    {/* Left: Icon & Title & Description */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                        <TopicIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="font-display font-bold text-xs sm:text-sm text-[#121417] dark:text-[#FFFFFF] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                          {topic.title}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {topic.cluster} • {topic.description}
                        </span>
                      </div>
                    </div>

                    {/* Right: Mastered Badge & Questions Pill */}
                    <div className="flex items-center gap-2 shrink-0">
                      {masteredInTopic > 0 && (
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {masteredInTopic} Mastered
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-[11px] font-display font-bold text-[#121417] dark:text-[#E9ECEF] bg-[#F1F3F5] dark:bg-[#202020] px-2.5 py-1 rounded border border-[#E9ECEF] dark:border-[#2E2E2E] group-hover:border-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        <span>{topicQuestions.length} Questions</span>
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
    </div>
  );
}
