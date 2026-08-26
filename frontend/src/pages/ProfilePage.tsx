import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import QuestionCard from '@/components/QuestionCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { examService } from '@/services/exam.service';
import { dataStore, type QuestionItem, type ExperienceItem, type TopicQuestionItem } from '@/services/dataStore';
import { useTheme } from '@/contexts/ThemeContext';
import { ARITHMETIC_TOPICS } from '@/pages/AptitudePage';
import ContentRenderer from '@/components/ContentRenderer';
import {
  User,
  BookmarkCheck,
  Building2,
  FileText,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Layers,
  BookOpen,
  Sun,
  Moon,
  Monitor,
  Folder,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { theme, themeMode, setThemeMode } = useTheme();
  const isDarkMode = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'exams' | 'questions' | 'experiences'>('exams');
  const [revealedExpl, setRevealedExpl] = useState<Record<string, boolean>>({});


  // Live Supabase subscription query for Pro Pass
  const { data: subData } = useQuery({
    queryKey: ['user-subscription', user?.email],
    queryFn: async () => {
      if (!user?.email) return { isPro: false, planName: 'Free Tier' };
      try {
        const { data } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_email', user.email)
          .eq('status', 'ACTIVE')
          .gt('expires_at', new Date().toISOString())
          .order('expires_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          return { isPro: true, planName: data.plan_name || 'Jobsfolder Pro Pass', expiresAt: data.expires_at };
        }
      } catch {}
      return { isPro: false, planName: 'Free Tier' };
    },
    enabled: !!user?.email,
  });

  const isUserPro = subData?.isPro ?? false;

  // TanStack Query: Bookmarked Exams
  const { data: bookmarkedExams = [] } = useQuery({
    queryKey: ['profile-bookmarked-exams'],
    queryFn: async () => {
      const examIds = dataStore.getBookmarkedExamIds();
      let allExams: any[] = [];
      try {
        allExams = await examService.getAllExams();
      } catch {
        allExams = dataStore.getAllExams();
      }
      if (allExams.length === 0) allExams = dataStore.getAllExams();
      return examIds.map((id) => allExams.find((e) => e.id === id)).filter(Boolean);
    },
  });

  // TanStack Query: Bookmarked Topic Practice Questions
  const { data: bookmarkedTopicQuestions = [] } = useQuery({
    queryKey: ['profile-bookmarked-topic-questions'],
    queryFn: async () => {
      const questionIds = dataStore.getBookmarkedQuestionIds();
      let allTopicQuestions: TopicQuestionItem[] = [];
      try {
        const { data: qData } = await supabase.from('topic_questions').select('*');
        if (qData && qData.length > 0) {
          allTopicQuestions = qData.map((q) => {
            const rawCorrect = q.correct_answer;
            const resolvedLetter = typeof rawCorrect === 'number'
              ? (['A', 'B', 'C', 'D', 'E'][rawCorrect] || 'A')
              : (['0', '1', '2', '3', '4'].includes(String(rawCorrect))
                  ? (['A', 'B', 'C', 'D', 'E'][Number(rawCorrect)] || 'A')
                  : (String(rawCorrect || 'A').toUpperCase()));

            return {
              id: q.id,
              topicId: q.topic_id,
              statement: q.statement,
              options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
              correctAnswer: resolvedLetter,
              explanation: q.explanation,
              structuredExplanation:
                typeof q.structured_explanation === 'string'
                  ? JSON.parse(q.structured_explanation)
                  : q.structured_explanation,
              difficulty: q.difficulty || 'MEDIUM',
              difficultyLevel: q.difficulty_level || 2,
              isHidden: q.is_hidden || false,
              questionNumber: q.question_number,
            };
          });
        }
      } catch {}
      if (allTopicQuestions.length === 0) allTopicQuestions = dataStore.getTopicQuestions();
      return questionIds
        .map((id) => allTopicQuestions.find((q) => q.id === id))
        .filter(Boolean) as TopicQuestionItem[];
    },
  });

  // TanStack Query: Bookmarked General Questions Fallback
  const { data: bookmarkedQuestions = [] } = useQuery({
    queryKey: ['profile-bookmarked-oa-questions'],
    queryFn: async () => {
      const questionIds = dataStore.getBookmarkedQuestionIds();
      const allQuestions = dataStore.getQuestions();
      return questionIds
        .map((id) => allQuestions.find((q) => q.id === id))
        .filter(Boolean) as QuestionItem[];
    },
  });

  // Calculate accurate total saved questions count (topic questions + any general questions)
  const nonTopicGeneralQuestions = bookmarkedQuestions.filter(
    (gq) => !bookmarkedTopicQuestions.some((tq) => tq.id === gq.id)
  );
  const totalQuestionsCount = bookmarkedTopicQuestions.length + nonTopicGeneralQuestions.length;

  // TanStack Query: Bookmarked Interview Transcripts (queries live Supabase experiences + local fallback)
  const { data: bookmarkedExperiences = [] } = useQuery({
    queryKey: ['profile-bookmarked-experiences'],
    queryFn: async () => {
      const expIds = dataStore.getBookmarkedExperienceIds();
      if (expIds.length === 0) return [];
      let allExps: ExperienceItem[] = [];
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('is_deleted', false);
        if (data && data.length > 0) {
          allExps = data.map((e: any): ExperienceItem => ({
            id: e.id,
            companyName: e.company_name || e.company_slug?.toUpperCase() || 'TCS',
            role: e.role_title || 'Software Engineer',
            studentName: e.student_name || 'Student',
            college: e.college || '',
            year: e.year || 2026,
            difficulty: e.difficulty || 'MEDIUM',
            verdict: e.verdict || 'SELECTED',
            rounds: (() => {
              try {
                return typeof e.rounds === 'string' ? JSON.parse(e.rounds) : e.rounds || [];
              } catch {
                return [{ roundTitle: 'Interview', details: e.description || e.overall_experience || '' }];
              }
            })(),
            status: e.status || 'APPROVED',
          }));
        }
      } catch (err) {
        console.warn('[ProfilePage] Failed to fetch live experiences from Supabase:', err);
      }
      const localExps = dataStore.getExperiences();
      const combined = [...allExps];
      localExps.forEach((le) => {
        if (!combined.some((c) => c.id === le.id)) {
          combined.push(le);
        }
      });
      return expIds.map((id) => combined.find((e) => e.id === id)).filter(Boolean) as ExperienceItem[];
    },
  });

  const getSubtopicDisplayName = (topicId: string) => {
    const matched = ARITHMETIC_TOPICS.find((t) => t.id === topicId);
    if (matched) return matched.name;
    return topicId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getDifficultyBadge = (diff?: string, diffLevel?: number) => {
    let resolvedDiff = diff;
    if (!resolvedDiff && diffLevel) {
      resolvedDiff = diffLevel === 1 ? 'EASY' : diffLevel === 3 ? 'HARD' : 'MEDIUM';
    }
    resolvedDiff = (resolvedDiff || 'MEDIUM').toUpperCase();

    switch (resolvedDiff) {
      case 'EASY':
      case '1':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Easy</span>
          </span>
        );
      case 'HARD':
      case '3':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Hard</span>
          </span>
        );
      case 'MEDIUM':
      case '2':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Medium</span>
          </span>
        );
    }
  };

  const toggleExplanation = (qId: string) => {
    setRevealedExpl((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleRemoveExamBookmark = (examId: string) => {
    dataStore.toggleBookmarkExam(examId);
    queryClient.invalidateQueries({ queryKey: ['profile-bookmarked-exams'] });
  };

  const handleRemoveQuestionBookmark = (qId: string) => {
    dataStore.toggleBookmarkQuestion(qId);
    queryClient.invalidateQueries({ queryKey: ['profile-bookmarked-topic-questions'] });
    queryClient.invalidateQueries({ queryKey: ['profile-bookmarked-oa-questions'] });
  };

  const handleRemoveExperienceBookmark = (expId: string) => {
    dataStore.toggleBookmarkExperience(expId);
    queryClient.invalidateQueries({ queryKey: ['profile-bookmarked-experiences'] });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Profile Header Card */}
      <div className="rounded-lg p-5 sm:p-6 border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#121417] dark:text-[#FFFFFF] shadow-xs relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-[#FD4A32] dark:bg-[#FD4A32] text-black flex items-center justify-center font-display font-black text-xl overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
                  {user?.name || 'Student Profile'}
                </h1>
                {isUserPro ? (
                  <span className="text-[9px] font-display font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>Pro Pass</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-display font-bold px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] border border-[#FD4A32]/20 uppercase tracking-wider">
                    Free Tier
                  </span>
                )}
              </div>
              <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans">
                {user?.email || 'Logged in Student'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 flex-wrap">
            {/* Top Right Compact 3-Pill Theme Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-md border border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C]">
              <button
                onClick={() => setThemeMode('light')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-display font-bold uppercase tracking-wider transition-all ${
                  themeMode === 'light'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                }`}
                title="Switch to Light Mode"
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                onClick={() => setThemeMode('dark')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-display font-bold uppercase tracking-wider transition-all ${
                  themeMode === 'dark'
                    ? 'bg-[#1C1C1C] text-[#FD4A32] shadow-xs'
                    : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                }`}
                title="Switch to Dark Mode"
              >
                <Moon className="w-3 h-3 text-purple-400" />
                <span>Dark</span>
              </button>

              <button
                onClick={() => setThemeMode('system')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-display font-bold uppercase tracking-wider transition-all ${
                  themeMode === 'system'
                    ? 'bg-[#FD4A32] dark:bg-[#FD4A32] text-black shadow-xs'
                    : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                }`}
                title="Sync with System Theme"
              >
                <Monitor className="w-3 h-3" />
                <span>Auto</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap font-sans">
              <div className="px-3 py-1.5 rounded-md border border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] text-center">
                <span className="text-sm font-display font-extrabold text-[#FD4A32] dark:text-[#FD4A32] block">
                  {bookmarkedExams.length}
                </span>
                <span className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider block">
                  Drives
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-md border border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] text-center">
                <span className="text-sm font-display font-extrabold text-amber-500 block">
                  {totalQuestionsCount}
                </span>
                <span className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider block">
                  Questions
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-md border border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] text-center">
                <span className="text-sm font-display font-extrabold text-purple-500 block">
                  {bookmarkedExperiences.length}
                </span>
                <span className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider block">
                  Transcripts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Profile */}
      <div className="flex items-center justify-between border-b border-[#E9ECEF] dark:border-[#242424] pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              activeTab === 'exams'
                ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Saved Exams ({bookmarkedExams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              activeTab === 'questions'
                ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Saved Questions ({totalQuestionsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('experiences')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              activeTab === 'experiences'
                ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Saved Transcripts ({bookmarkedExperiences.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Bookmarked Exams */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          {bookmarkedExams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookmarkedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-5 rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] hover:border-[#121417] dark:hover:border-[#383838] transition-all duration-200 hover:shadow-sm space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] flex items-center justify-center font-display font-extrabold text-sm overflow-hidden shrink-0">
                          {exam.companyLogoUrl ? (
                            <img src={exam.companyLogoUrl} alt={exam.companyName || 'Company'} className="w-full h-full object-contain p-1" />
                          ) : (
                            (exam.companyName || 'C').charAt(0)
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-display font-bold text-[#868E96] dark:text-[#555555] block truncate">
                            {exam.companyName || 'Company Drive'}
                          </span>
                          <h3 className="font-display font-bold text-sm text-[#121417] dark:text-[#FFFFFF] truncate leading-tight">
                            {exam.name}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveExamBookmark(exam.id)}
                        className="p-1 text-[#868E96] dark:text-[#555555] hover:text-rose-600 rounded transition-colors shrink-0"
                        title="Remove from bookmarks"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] border border-[#FD4A32]/20 text-[9px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {exam.badge || 'Official Drive'}
                      </span>
                      {exam.googleDocEmbedUrl && (
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[9px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Live Papers
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E9ECEF] dark:border-[#242424] flex items-center gap-2">
                    <Link
                      to={`/companies/${exam.companySlug}?examId=${exam.id}`}
                      className="flex-1 py-1.5 px-3 bg-[#121417] hover:bg-[#FD4A32] dark:bg-white dark:hover:bg-[#FD4A32] text-white dark:text-black font-display font-bold rounded-md text-xs uppercase tracking-wider text-center transition-colors shadow-xs"
                    >
                      View Drive
                    </Link>

                    <Link
                      to={`/companies/${exam.companySlug}/oldpapers?examId=${exam.id}`}
                      className="px-3 py-1.5 rounded-md border border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C] text-[#121417] dark:text-[#FFFFFF] text-xs font-display font-bold uppercase tracking-wider transition-colors flex items-center gap-1 hover:border-[#121417]"
                      title="Open Old Papers Fullscreen Dashboard"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32]" />
                      <span>Papers</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-12 text-center rounded-[28px] border space-y-4 ${
              isDarkMode ? 'bg-[#1e1f22]/50 border-[#2b2d31]' : 'bg-[#f6ece6]/50 border-[#eae1da]'
            }`}>
              <BookmarkCheck className="w-12 h-12 text-[#747878] dark:text-[#a6adbb] mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#1f1b17] dark:text-[#e3e3e3]">
                  No Bookmarked Exams Yet
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a6adbb] max-w-md mx-auto leading-relaxed">
                  Browse hiring companies and click <strong>"Bookmark Exam"</strong> on any placement drive to save it here.
                </p>
              </div>

              <Link
                to="/companies"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FD4A32] hover:bg-[#D62F18] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <Building2 className="w-4 h-4" />
                <span>Browse Companies & Exams</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Saved Practice Questions */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {totalQuestionsCount > 0 ? (
            <div className="space-y-4">
              {bookmarkedTopicQuestions.map((q, idx) => {
                const subtopicName = getSubtopicDisplayName(q.topicId);
                const isExplVisible = revealedExpl[q.id];
                const se = q.structuredExplanation;
                const optKeys = ['A', 'B', 'C', 'D', 'E', 'F'];

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-[24px] border transition-all space-y-4 relative shadow-2xs ${
                      isDarkMode ? 'bg-[#1e1f22] border-[#2b2d31] text-[#e3e3e3]' : 'bg-[#ffffff] border-[#eae1da] text-[#1f1b17]'
                    }`}
                  >
                    {/* Header Row: Topic Badge + Subtopic + Question Number + Difficulty + Action Links */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#eae1da] dark:border-[#2b2d31]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] font-extrabold text-[10px] uppercase tracking-wider border border-[#FD4A32]/20 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#FD4A32]" />
                          <span>Arithmetic Aptitude</span>
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                          <Folder className="w-3 h-3 text-emerald-500" />
                          <span>{subtopicName}</span>
                        </span>

                        <span className="font-mono text-xs font-black text-[#FD4A32] dark:text-[#FD4A32]">
                          Question #{q.questionNumber || (idx + 1)}
                        </span>

                        {/* Difficulty Badge */}
                        {getDifficultyBadge(q.difficulty, q.difficultyLevel)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/aptitude/arithmetic-aptitude/topic/${q.topicId}`}
                          className="px-3 py-1 bg-[#f6ece6] hover:bg-[#eae1da] dark:bg-[#2b2d31] dark:hover:bg-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] rounded-lg text-xs font-bold transition-all border border-[#eae1da] dark:border-[#383a40] flex items-center gap-1"
                        >
                          <span>Practice Topic</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleRemoveQuestionBookmark(q.id)}
                          className="p-1.5 text-[#747878] dark:text-[#a6adbb] hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Statement */}
                    <p className="text-sm font-semibold leading-relaxed text-[#1f1b17] dark:text-[#e3e3e3] whitespace-pre-line">
                      {q.statement}
                    </p>

                    {/* MCQ Options List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt, oIdx) => {
                        const optId = opt.id || opt.key || optKeys[oIdx] || 'A';
                        const isCorrect = optId === q.correctAnswer;
                        return (
                          <div
                            key={optId}
                            className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2.5 ${
                              isCorrect
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'bg-[#f6ece6]/60 dark:bg-[#141517] border-[#eae1da] dark:border-[#2b2d31] text-[#1f1b17] dark:text-[#e3e3e3]'
                            }`}
                          >
                            <span className="font-bold w-5 h-5 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[11px] shrink-0">
                              {optId}
                            </span>
                            <span className="flex-1">{opt.text}</span>
                            {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Toggle Explanation Button */}
                    <div className="pt-2 border-t border-[#eae1da] dark:border-[#2b2d31] flex items-center justify-between">
                      <button
                        onClick={() => toggleExplanation(q.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isExplVisible
                            ? 'bg-[#FD4A32] dark:bg-[#FD4A32] text-white dark:text-[#141517] border-[#FD4A32]'
                            : 'bg-[#f6ece6] dark:bg-[#2b2d31] border-[#e2d8d2] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>{isExplVisible ? 'Hide Solution' : 'View Answer & Solution'}</span>
                      </button>
                    </div>

                    {/* Expandable Explanation Block */}
                    {isExplVisible && (
                      <div className="p-4 rounded-2xl bg-[#f6ece6]/70 dark:bg-[#141517]/70 border border-[#E0351D]/20 space-y-3 animate-fadeIn">
                        {se ? (
                          <div className="space-y-3 text-xs text-[#1f1b17] dark:text-[#e3e3e3]">
                            {/* Given Block */}
                            {se.given && se.given.length > 0 && (
                              <div className="space-y-1">
                                <span className="font-extrabold text-[10px] uppercase text-[#747878] dark:text-[#a6adbb] tracking-wider block">
                                  Given Information:
                                </span>
                                <ul className="list-disc pl-4 space-y-0.5 font-medium">
                                  {se.given.map((g, gIdx) => (
                                    <li key={gIdx}>{g}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Derivation Steps */}
                            {se.steps && se.steps.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="font-extrabold text-[10px] uppercase text-[#747878] dark:text-[#a6adbb] tracking-wider block">
                                  Derivation Steps:
                                </span>
                                <div className="space-y-1 font-mono text-xs font-semibold p-3 bg-black/5 dark:bg-white/5 rounded-xl text-[#1f1b17] dark:text-[#e3e3e3] border border-[#E0351D]/10">
                                  {se.steps.map((st, sIdx) => {
                                    const stepText = typeof st === 'string' ? st : (st.text || (st as any).content || st.formula || st.title || '');
                                    return (
                                      <div key={sIdx} className="leading-relaxed flex items-start gap-2">
                                        <span className="text-[#E0351D] dark:text-[#FD4A32] font-bold select-none">•</span>
                                        <span>{stepText}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Quick Shortcut / Trick Box */}
                            {se.shortcut && (
                              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1">
                                <span className="font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                                  ⚡ Quick Shortcut:
                                </span>
                                <p className="text-[#1f1b17] dark:text-[#e3e3e3] font-semibold text-xs leading-relaxed">
                                  {se.shortcut}
                                </p>
                              </div>
                            )}

                            {/* Final Answer */}
                            {se.finalAnswer && (
                              <div className="pt-2 border-t border-[#E0351D]/15 flex items-center gap-2">
                                <span className="font-extrabold text-xs text-[#E0351D] dark:text-[#FD4A32]">
                                  Final Answer:
                                </span>
                                <span className="font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-md">
                                  {se.finalAnswer}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-[#1f1b17] dark:text-[#e3e3e3] leading-relaxed whitespace-pre-line font-sans">
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {nonTopicGeneralQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={{
                    id: question.id,
                    title: question.title,
                    companyName: question.companyName,
                    questionType: question.category as any,
                    difficulty: question.difficulty as any,
                    description: question.problemStatement,
                    solution: question.sampleOutput,
                    explanation: question.explanation,
                    frequency: 3,
                    tags: [question.category, question.companyName],
                    year: question.year,
                    isVerified: true,
                    createdAt: new Date().toISOString(),
                  }}
                  onDelete={() => handleRemoveQuestionBookmark(question.id)}
                />
              ))}
            </div>
          ) : (
            <div className={`p-12 text-center rounded-[28px] border space-y-4 ${
              isDarkMode ? 'bg-[#1e1f22]/50 border-[#2b2d31]' : 'bg-[#f6ece6]/50 border-[#eae1da]'
            }`}>
              <BookOpen className="w-12 h-12 text-[#747878] dark:text-[#a6adbb] mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#1f1b17] dark:text-[#e3e3e3]">
                  No Saved Questions Yet
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a6adbb] max-w-md mx-auto leading-relaxed">
                  Explore practice topics and click the <strong>Bookmark</strong> button on any question card to save it here.
                </p>
              </div>

              <Link
                to="/aptitude/arithmetic-aptitude"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FD4A32] hover:bg-[#D62F18] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Aptitude Practice Topics</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Saved Interview Experiences */}
      {activeTab === 'experiences' && (
        <div className="space-y-4">
          {bookmarkedExperiences.length > 0 ? (
            <div className="space-y-4">
              {bookmarkedExperiences.map((exp) => (
                <div
                  key={exp.id}
                  className={`p-6 rounded-[24px] border transition-all space-y-4 relative ${
                    isDarkMode ? 'bg-[#1e1f22] border-[#2b2d31]' : 'bg-white border-[#eae1da]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 pr-12">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#0284c7] font-black text-base flex items-center justify-center shrink-0">
                        {(exp.companyName || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#1f1b17] dark:text-[#e3e3e3]">
                          {exp.role || 'Interview Candidate'} @ {exp.companyName || 'Company Drive'}
                        </h3>
                        <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
                          {exp.studentName || 'Anonymous Student'} • {exp.college || 'Engineering Candidate'} • {exp.year || 2026}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveExperienceBookmark(exp.id)}
                      className="p-2 text-[#747878] dark:text-[#a6adbb] hover:text-rose-600 dark:hover:text-rose-400 rounded-full hover:bg-rose-500/10 transition-colors shrink-0 absolute top-4 right-4"
                      title="Remove from saved experiences"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                      Verdict: {exp.verdict || 'SELECTED'}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider bg-amber-500/15 text-amber-600 border-amber-500/30">
                      Difficulty: {exp.difficulty || 'MEDIUM'}
                    </span>
                  </div>

                  {exp.rounds && exp.rounds.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-[#eae1da] dark:border-[#2b2d31]">
                      {exp.rounds.map((rd, idx) => (
                        <div key={idx} className="p-4 bg-[#f6ece6]/60 dark:bg-[#141517]/60 rounded-[18px] border border-[#e2d8d2] dark:border-[#2b2d31] space-y-2">
                          {rd.roundTitle && !['Interview Rounds & Details', 'Interview Breakdown & Rounds Details'].includes(rd.roundTitle) && (
                            <span className="text-xs font-black text-[#FD4A32] dark:text-[#FD4A32] uppercase tracking-wider block">
                              {rd.roundTitle}
                            </span>
                          )}
                          <ContentRenderer
                            content={rd.details}
                            className="text-xs font-sans"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-12 text-center rounded-[28px] border space-y-4 ${
              isDarkMode ? 'bg-[#1e1f22]/50 border-[#2b2d31]' : 'bg-[#f6ece6]/50 border-[#eae1da]'
            }`}>
              <Layers className="w-12 h-12 text-[#747878] dark:text-[#a6adbb] mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#1f1b17] dark:text-[#e3e3e3]">
                  No Saved Experiences Yet
                </h3>
                <p className="text-xs text-[#747878] dark:text-[#a6adbb] max-w-md mx-auto leading-relaxed">
                  Browse candidate interview experiences and click <strong>"Save"</strong> on any experience card to review before your interviews.
                </p>
              </div>

              <Link
                to="/experiences"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FD4A32] hover:bg-[#D62F18] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <Layers className="w-4 h-4" />
                <span>Browse Interview Experiences</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
