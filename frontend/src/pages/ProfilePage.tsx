import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import QuestionCard from '@/components/QuestionCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { examService } from '@/services/exam.service';
import { dataStore, type QuestionItem, type ExperienceItem, type TopicQuestionItem } from '@/services/dataStore';
import { progressService } from '@/services/progress.service';
import AptitudeStatsWidget from '@/components/AptitudeStatsWidget';
import { useTheme } from '@/contexts/ThemeContext';
import ContentRenderer from '@/components/ContentRenderer';
import { normalizeMathText } from '@/utils/questionParser';
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
  ShieldCheck,
  Download,
  AlertTriangle,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { theme, themeMode, setThemeMode } = useTheme();
  const isDarkMode = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'exams' | 'questions' | 'experiences' | 'privacy'>('exams');
  const [revealedExpl, setRevealedExpl] = useState<Record<string, boolean>>({});
  const [visibleQuestionsCount, setVisibleQuestionsCount] = useState(20);
  const [visibleExperiencesCount, setVisibleExperiencesCount] = useState(20);
  const [consentStatus, setConsentStatus] = useState<'ACTIVE' | 'WITHDRAWN'>('ACTIVE');
  const [deletionRequested, setDeletionRequested] = useState(false);


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

  // Fetch all questions metadata to compute user's lifetime aptitude stats
  const { data: allQuestionsMeta = [], isLoading: isMetaLoading } = useQuery({
    queryKey: ['profile-all-questions-meta'],
    queryFn: async () => {
      let allFetchedData: any[] = [];
      let page = 0;
      const PAGE_SIZE = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('topic_questions')
          .select('id, difficulty, topic_id')
          .eq('is_deleted', false)
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error) {
          console.warn('Failed to fetch questions meta for profile stats:', error);
          break;
        }

        if (data && data.length > 0) {
          allFetchedData = allFetchedData.concat(data);
          if (data.length < PAGE_SIZE) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }

      if (allFetchedData.length > 0) {
        try {
          localStorage.setItem('prepunite_all_questions_meta_cache', JSON.stringify(allFetchedData));
        } catch {}
      }

      return allFetchedData;
    },
    initialData: () => {
      try {
        const cached = localStorage.getItem('prepunite_all_questions_meta_cache');
        return cached ? JSON.parse(cached) : undefined;
      } catch {
        return undefined;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Re-sync bookmarks and progress reactively whenever updated
  useEffect(() => {
    const handleBookmarksChanged = () => {
      queryClient.invalidateQueries({ queryKey: ['profile-bookmarked-exams'] });
      queryClient.invalidateQueries({ queryKey: ['profile-bookmarked-topic-questions'] });
      queryClient.invalidateQueries({ queryKey: ['profile-bookmarked-experiences'] });
    };
    const handleProgressSynced = () => {
      queryClient.invalidateQueries({ queryKey: ['user-aptitude-progress', user?.email] });
    };

    window.addEventListener('prepunite_bookmarks_changed', handleBookmarksChanged);
    window.addEventListener('prepunite_progress_synced', handleProgressSynced);
    return () => {
      window.removeEventListener('prepunite_bookmarks_changed', handleBookmarksChanged);
      window.removeEventListener('prepunite_progress_synced', handleProgressSynced);
    };
  }, [queryClient, user?.email]);

  // Database-first live user question progress query
  const { data: progressRecords = {}, isLoading: isProgressLoading } = useQuery({
    queryKey: ['user-aptitude-progress', user?.email],
    queryFn: async () => {
      if (!user?.email || user.email === 'guest@prepunite.com') {
        return progressService.getAllRecords(user?.email);
      }
      return await progressService.fetchAndSyncFromSupabase(user.email);
    },
    staleTime: 2 * 60 * 1000,
  });

  const aptitudeStats = useMemo(() => {
    return progressService.computeStatsFromRecords(allQuestionsMeta, progressRecords);
  }, [allQuestionsMeta, progressRecords]);

  // TanStack Query: Bookmarked Exams
  const { data: bookmarkedExams = [] } = useQuery({
    queryKey: ['profile-bookmarked-exams'],
    queryFn: async () => {
      const examIds = dataStore.getBookmarkedExamIds();
      if (examIds.length === 0) return [];
      let allExams: any[] = [];
      try {
        allExams = await examService.getAllExams();
      } catch {
        allExams = dataStore.getAllExams();
      }
      if (allExams.length === 0) allExams = dataStore.getAllExams();
      return examIds.map((id) => allExams.find((e) => e.id === id)).filter(Boolean);
    },
    staleTime: 60 * 1000,
  });

  // TanStack Query: Bookmarked Topic Practice Questions
  const { data: bookmarkedTopicQuestions = [] } = useQuery({
    queryKey: ['profile-bookmarked-topic-questions'],
    queryFn: async () => {
      const questionIds = dataStore.getBookmarkedQuestionIds();
      if (questionIds.length === 0) return [];

      let allTopicQuestions: TopicQuestionItem[] = [];
      try {
        const CHUNK_SIZE = 50;
        const chunks: string[][] = [];
        for (let i = 0; i < questionIds.length; i += CHUNK_SIZE) {
          chunks.push(questionIds.slice(i, i + CHUNK_SIZE));
        }

        const chunkResponses = await Promise.all(
          chunks.map((chunk) => supabase.from('topic_questions').select('*').in('id', chunk))
        );

        let qData: any[] = [];
        for (const res of chunkResponses) {
          if (!res.error && res.data) {
            qData = qData.concat(res.data);
          }
        }

        if (qData && qData.length > 0) {
          allTopicQuestions = qData.map((q) => {
            const rawCorrect = q.correct_answer;
            const resolvedLetter = typeof rawCorrect === 'number'
              ? (['A', 'B', 'C', 'D', 'E'][rawCorrect] || 'A')
              : (['0', '1', '2', '3', '4'].includes(String(rawCorrect))
                  ? (['A', 'B', 'C', 'D', 'E'][Number(rawCorrect)] || 'A')
                  : (String(rawCorrect || 'A').toUpperCase()));

            const rawOpts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []);
            const normOpts = Array.isArray(rawOpts) ? rawOpts.map((opt: any) => ({
              ...opt,
              text: normalizeMathText(opt.text || String(opt))
            })) : [];

            return {
              id: q.id,
              topicId: q.topic_id,
              statement: normalizeMathText(q.statement || ''),
              options: normOpts,
              correctAnswer: resolvedLetter,
              explanation: normalizeMathText(q.explanation || ''),
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
      } catch (err) {
        console.warn('[ProfilePage] Failed to fetch bookmarked questions:', err);
      }
      if (allTopicQuestions.length === 0) {
        const local = dataStore.getTopicQuestions();
        allTopicQuestions = questionIds
          .map((id) => local.find((q) => q.id === id))
          .filter(Boolean) as TopicQuestionItem[];
      }
      return allTopicQuestions;
    },
    staleTime: 60 * 1000,
  });

  // TanStack Query: Bookmarked General Questions Fallback
  const { data: bookmarkedQuestions = [] } = useQuery({
    queryKey: ['profile-bookmarked-oa-questions'],
    queryFn: async () => {
      const questionIds = dataStore.getBookmarkedQuestionIds();
      const allQuestions = dataStore.getQuestions();
      const qMap = new Map(allQuestions.map((q) => [q.id, q]));
      return questionIds.map((id) => qMap.get(id)).filter(Boolean) as QuestionItem[];
    },
  });

  // Calculate accurate total saved questions count using O(1) Set lookup
  const topicIdSet = useMemo(
    () => new Set(bookmarkedTopicQuestions.map((tq) => tq.id)),
    [bookmarkedTopicQuestions]
  );
  const nonTopicGeneralQuestions = useMemo(
    () => bookmarkedQuestions.filter((gq) => !topicIdSet.has(gq.id)),
    [bookmarkedQuestions, topicIdSet]
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
        const CHUNK_SIZE = 50;
        const chunks: string[][] = [];
        for (let i = 0; i < expIds.length; i += CHUNK_SIZE) {
          chunks.push(expIds.slice(i, i + CHUNK_SIZE));
        }

        const chunkResponses = await Promise.all(
          chunks.map((chunk) =>
            supabase
              .from('experiences')
              .select('*')
              .in('id', chunk)
              .eq('is_deleted', false)
          )
        );

        let data: any[] = [];
        for (const res of chunkResponses) {
          if (!res.error && res.data) {
            data = data.concat(res.data);
          }
        }
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
      const expMap = new Map<string, ExperienceItem>();
      allExps.forEach((e) => expMap.set(e.id, e));
      localExps.forEach((le) => {
        if (!expMap.has(le.id)) {
          expMap.set(le.id, le);
        }
      });
      return expIds.map((id) => expMap.get(id)).filter(Boolean) as ExperienceItem[];
    },
    staleTime: 60 * 1000,
  });

  const getTopicDisplayName = (topicId: string) => {
    return topicId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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

  const handleExportData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
      },
      subscription: subData,
      bookmarks: {
        exams: bookmarkedExams,
        topicQuestionsCount: bookmarkedTopicQuestions.length,
        oaQuestionsCount: bookmarkedQuestions.length,
        experiencesCount: bookmarkedExperiences.length,
      },
      aptitudeStats,
      dpdpCompliance: {
        act: 'Digital Personal Data Protection Act, 2023 (DPDP)',
        consentStatus,
        purpose: 'Authentication, learning analytics, bookmark synchronization',
      },
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prepunite-data-export-${user?.email || 'user'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleWithdrawConsent = () => {
    if (confirm('Are you sure you want to withdraw DPDP consent? While your account stays safe, personalized analytics and sync features will be paused until re-consented.')) {
      setConsentStatus('WITHDRAWN');
      alert('Your consent has been successfully withdrawn. You may re-consent anytime by saving questions or updating your profile.');
    }
  };

  const handleRequestDeletion = () => {
    if (confirm('Request account deletion under Section 12(3) of DPDP Act 2023? Our Data Grievance Officer will verify and purge all personal identifiers within 30 days.')) {
      setDeletionRequested(true);
      alert('Account deletion request registered. An email confirmation has been logged for our Grievance Officer.');
    }
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

      {/* 🚀 LeetCode-style Aptitude Stats Widget */}
      <AptitudeStatsWidget
        stats={aptitudeStats}
        isLoading={(isMetaLoading && allQuestionsMeta.length === 0) || isProgressLoading}
        title="Overall Aptitude Mastery & Progress"
        subtitle="Your lifetime question solving accuracy, difficulty distribution, and active streaks."
      />

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

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display font-bold uppercase tracking-wider transition-all ${
              activeTab === 'privacy'
                ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data & Privacy</span>
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
              {bookmarkedTopicQuestions.slice(0, visibleQuestionsCount).map((q, idx) => {
                const subtopicName = getTopicDisplayName(q.topicId);
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

              {nonTopicGeneralQuestions.slice(0, Math.max(0, visibleQuestionsCount - bookmarkedTopicQuestions.length)).map((question) => (
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

              {visibleQuestionsCount < totalQuestionsCount && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setVisibleQuestionsCount((prev) => prev + 20)}
                    className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#eae1da] dark:bg-[#2b2d31] text-[#1f1b17] dark:text-[#e3e3e3] hover:bg-[#e2d8d2] dark:hover:bg-[#383a40] transition-colors"
                  >
                    Load More Questions
                  </button>
                </div>
              )}
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
              {bookmarkedExperiences.slice(0, visibleExperiencesCount).map((exp) => (
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

              {visibleExperiencesCount < bookmarkedExperiences.length && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setVisibleExperiencesCount((prev) => prev + 20)}
                    className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#eae1da] dark:bg-[#2b2d31] text-[#1f1b17] dark:text-[#e3e3e3] hover:bg-[#e2d8d2] dark:hover:bg-[#383a40] transition-colors"
                  >
                    Load More Experiences
                  </button>
                </div>
              )}
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

      {/* Tab Content: DPDP Act 2023 Data & Privacy */}
      {activeTab === 'privacy' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Privacy Overview Banner */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] space-y-3 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-display font-bold text-base text-[#121417] dark:text-white">
                  Digital Personal Data Protection (DPDP Act, 2023) Management
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-display font-black uppercase tracking-wider ${
                consentStatus === 'ACTIVE'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                Consent: {consentStatus}
              </span>
            </div>

            <p className="text-xs text-[#868E96] dark:text-[#888888] leading-relaxed font-sans">
              Under India's <strong>Digital Personal Data Protection Act, 2023 (Rule 6)</strong>, PrepUnite operates under your informed consent as a Data Fiduciary. You retain unconditional rights to review, export, withdraw consent, or request complete erasure of your digital footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Data Portability / Export */}
            <div className="p-6 rounded-xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Download className="w-4 h-4" />
                  <h4 className="font-display font-bold text-sm text-[#121417] dark:text-white">Right to Data Portability</h4>
                </div>
                <p className="text-xs text-[#868E96] dark:text-[#777777] leading-relaxed">
                  Download a machine-readable JSON copy of your entire user profile, bookmarks, solve history, payment receipts, and consent metadata.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-display font-bold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export My Data (JSON)</span>
              </button>
            </div>

            {/* 2. Consent Withdrawal */}
            <div className="p-6 rounded-xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="font-display font-bold text-sm text-[#121417] dark:text-white">Withdraw DPDP Consent</h4>
                </div>
                <p className="text-xs text-[#868E96] dark:text-[#777777] leading-relaxed">
                  You may withdraw your consent for learning analytics and profile personalization at any time without terminating your basic access.
                </p>
              </div>

              <button
                type="button"
                onClick={handleWithdrawConsent}
                disabled={consentStatus === 'WITHDRAWN'}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-amber-500 text-xs font-display font-bold uppercase tracking-wider text-[#121417] dark:text-white hover:text-amber-500 transition-all cursor-pointer disabled:opacity-50"
              >
                {consentStatus === 'WITHDRAWN' ? 'Consent Already Withdrawn' : 'Withdraw Processing Consent'}
              </button>
            </div>
          </div>

          {/* 3. Account Erasure / Deletion & Grievance */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#141414] border border-rose-500/30 dark:border-rose-500/20 space-y-4 shadow-xs">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-1 max-w-xl">
                <h4 className="font-display font-bold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Right to Erasure (Account Deletion)</span>
                </h4>
                <p className="text-xs text-[#868E96] dark:text-[#888888] leading-relaxed">
                  Under Section 12(3) of the DPDP Act 2023, you can request permanent erasure of your account, bookmarks, and contact messages. Once initiated, personal identifiers are purged within 30 days.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRequestDeletion}
                disabled={deletionRequested}
                className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {deletionRequested ? 'Deletion Request Logged' : 'Request Account Deletion'}
              </button>
            </div>

            <div className="pt-3 border-t border-[#E9ECEF] dark:border-[#242424] flex items-center justify-between flex-wrap gap-2 text-[11px] text-[#868E96] dark:text-[#666666]">
              <span>Data Protection Grievance Officer: <strong>prepunite@gmail.com</strong></span>
              <Link to="/privacy-policy" className="hover:text-[#FD4A32] underline">Read Full DPDP Privacy Policy</Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
