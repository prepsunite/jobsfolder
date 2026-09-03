import { supabase } from '@/lib/supabase';
import stringify from 'fast-json-stable-stringify';

export interface QuestionProgressRecord {
  questionId: string;
  topicId: string;
  categorySlug?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  selectedOption: string;
  correctOption: string;
  wrongAttempts: number;
  isSolved: boolean;
  isRevealed: boolean;
  firstTryCorrect: boolean;
  completedAt?: string;
  lastAttemptedAt: string;
}

export interface ProgressSummaryStats {
  totalQuestions: number;
  totalSolved: number;
  totalAttempted: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  accuracyRate: number; // percentage 0 - 100
  firstTryAccuracyRate: number; // percentage 0 - 100
  streakDays: number;
  lastActiveDate?: string;
  topicMastery: Record<string, { solved: number; total: number; percentage: number }>;
}

const STORAGE_PREFIX = 'prepunite_aptitude_progress_';

function getStorageKey(userEmail?: string): string {
  const normalized = userEmail ? userEmail.trim().toLowerCase() : 'guest';
  return `${STORAGE_PREFIX}${normalized}`;
}

function getLocalRecords(userEmail?: string): Record<string, QuestionProgressRecord> {
  try {
    const raw = localStorage.getItem(getStorageKey(userEmail));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalRecords(records: Record<string, QuestionProgressRecord>, userEmail?: string): void {
  try {
    const key = getStorageKey(userEmail);
    const serialized = stringify(records);
    if (localStorage.getItem(key) === serialized) {
      return; // Data unchanged, avoid unnecessary disk write
    }
    localStorage.setItem(key, serialized);
  } catch (e) {
    console.warn('[progressService] Failed to persist progress to localStorage:', e);
  }
}

function computeStreak(records: QuestionProgressRecord[]): number {
  if (records.length === 0) return 0;

  // Extract unique active calendar days (YYYY-MM-DD in local time)
  const activeDays = new Set<string>();
  records.forEach((r) => {
    if (r.isSolved && r.completedAt) {
      const dateStr = new Date(r.completedAt).toLocaleDateString('en-CA'); // YYYY-MM-DD
      activeDays.add(dateStr);
    }
  });

  if (activeDays.size === 0) return 0;

  const sortedDays = Array.from(activeDays).sort().reverse();
  const today = new Date().toLocaleDateString('en-CA');
  const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const yesterday = yesterdayDate.toLocaleDateString('en-CA');

  // If user hasn't practiced today or yesterday, streak is broken
  const mostRecentDay = sortedDays[0];
  if (mostRecentDay !== today && mostRecentDay !== yesterday) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(mostRecentDay);

  for (let i = 0; i < sortedDays.length; i++) {
    const currentExpectedStr = checkDate.toLocaleDateString('en-CA');
    if (activeDays.has(currentExpectedStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export const progressService = {
  /**
   * Record or update an attempt on a question
   */
  recordAttempt: async (params: {
    questionId: string;
    topicId: string;
    categorySlug?: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    selectedOption: string;
    correctOption: string;
    userEmail?: string;
  }): Promise<{ isCorrect: boolean; record: QuestionProgressRecord }> => {
    const { questionId, topicId, categorySlug, difficulty = 'MEDIUM', selectedOption, correctOption, userEmail } = params;

    const normalizedSelected = selectedOption.trim().toUpperCase();
    const normalizedCorrect = correctOption.trim().toUpperCase();
    const isCorrect = normalizedSelected === normalizedCorrect;
    const nowIso = new Date().toISOString();

    const localMap = getLocalRecords(userEmail);
    const existing = localMap[questionId];

    let wrongAttempts = existing?.wrongAttempts ?? 0;
    let isSolved = existing?.isSolved ?? false;
    let firstTryCorrect = existing?.firstTryCorrect ?? false;
    let completedAt = existing?.completedAt;

    if (isCorrect) {
      if (!isSolved) {
        isSolved = true;
        completedAt = nowIso;
        if (wrongAttempts === 0 && !existing?.isRevealed) {
          firstTryCorrect = true;
        } else {
          firstTryCorrect = false;
        }
      }
    } else {
      // Wrong option chosen
      firstTryCorrect = false;
      if (!isSolved) {
        wrongAttempts += 1;
      }
    }

    const updatedRecord: QuestionProgressRecord = {
      questionId,
      topicId,
      categorySlug: categorySlug || existing?.categorySlug,
      difficulty,
      selectedOption: normalizedSelected,
      correctOption: normalizedCorrect,
      wrongAttempts,
      isSolved,
      isRevealed: existing?.isRevealed ?? false,
      firstTryCorrect,
      completedAt,
      lastAttemptedAt: nowIso,
    };

    localMap[questionId] = updatedRecord;
    saveLocalRecords(localMap, userEmail);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_progress_synced', { detail: { email: userEmail } }));
    }

    // Sync with Supabase asynchronously for logged-in users
    if (userEmail && userEmail !== 'guest@prepunite.com') {
      try {
        await supabase.from('user_question_progress').upsert(
          {
            user_email: userEmail.trim().toLowerCase(),
            question_id: questionId,
            topic_id: topicId,
            category_slug: categorySlug || null,
            difficulty,
            selected_option: normalizedSelected,
            correct_option: normalizedCorrect,
            wrong_attempts: wrongAttempts,
            is_solved: isSolved,
            is_revealed: updatedRecord.isRevealed,
            first_try_correct: firstTryCorrect,
            completed_at: completedAt || null,
            last_attempted_at: nowIso,
          },
          { onConflict: 'user_email,question_id' }
        );
      } catch (err) {
        console.warn('[progressService] Supabase sync notice:', err);
      }
    }

    return { isCorrect, record: updatedRecord };
  },

  /**
   * Mark a question as having its answer revealed via the "Show Answer" button
   */
  markRevealed: (questionId: string, userEmail?: string): void => {
    const localMap = getLocalRecords(userEmail);
    if (localMap[questionId]) {
      localMap[questionId].isRevealed = true;
      if (!localMap[questionId].isSolved) {
        localMap[questionId].firstTryCorrect = false;
      }
      saveLocalRecords(localMap, userEmail);

      if (userEmail && userEmail !== 'guest@prepunite.com') {
        (async () => {
          try {
            await supabase
              .from('user_question_progress')
              .update({ is_revealed: true })
              .eq('user_email', userEmail.trim().toLowerCase())
              .eq('question_id', questionId);
          } catch (e) {
            console.warn('[progressService] Reveal sync error:', e);
          }
        })();
      }
    }
  },

  /**
   * Get all progress records for a user
   */
  getAllRecords: (userEmail?: string): Record<string, QuestionProgressRecord> => {
    return getLocalRecords(userEmail);
  },

  /**
   * Get a single question's progress record
   */
  getRecord: (questionId: string, userEmail?: string): QuestionProgressRecord | undefined => {
    return getLocalRecords(userEmail)[questionId];
  },

  /**
   * Aggregate high-level LeetCode-style statistics directly from an in-memory or query records map
   */
  computeStatsFromRecords: (
    allQuestions: { id: string; difficulty?: string; difficultyLevel?: number; topicId?: string; topic_id?: string }[],
    recordsMap: Record<string, QuestionProgressRecord>
  ): ProgressSummaryStats => {
    const recordsList = Object.values(recordsMap || {});
    const questionIdSet = new Set(allQuestions.map((q) => q.id));

    let easyTotal = 0;
    let mediumTotal = 0;
    let hardTotal = 0;

    allQuestions.forEach((q) => {
      const diff = q.difficultyLevel === 1 ? 'EASY' : q.difficultyLevel === 3 ? 'HARD' : (q.difficulty || 'MEDIUM').toUpperCase();
      if (diff === 'EASY') easyTotal++;
      else if (diff === 'HARD') hardTotal++;
      else mediumTotal++;
    });

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalSolved = 0;
    let totalAttempted = 0;
    let totalWrongAttempts = 0;
    let firstTryCount = 0;

    const topicMastery: Record<string, { solved: number; total: number; percentage: number }> = {};

    // Initialize topic mastery totals for all questions in scope
    allQuestions.forEach((q) => {
      const tId = q.topicId || q.topic_id || 'general';
      if (!topicMastery[tId]) {
        topicMastery[tId] = { solved: 0, total: 0, percentage: 0 };
      }
      topicMastery[tId].total++;
    });

    recordsList.forEach((r) => {
      if (questionIdSet.size > 0 && !questionIdSet.has(r.questionId)) {
        return;
      }

      const hasAttempt = r.isSolved || (r.wrongAttempts || 0) > 0 || Boolean(r.selectedOption);
      if (hasAttempt) {
        totalAttempted++;
      }

      totalWrongAttempts += (r.wrongAttempts || 0);

      if (r.isSolved) {
        totalSolved++;
        if (r.firstTryCorrect && (r.wrongAttempts || 0) === 0 && !r.isRevealed) {
          firstTryCount++;
        }

        const diff = (r.difficulty || 'MEDIUM').toUpperCase();
        if (diff === 'EASY') easySolved++;
        else if (diff === 'HARD') hardSolved++;
        else mediumSolved++;

        const tId = r.topicId || (r as any).topic_id;
        if (tId && topicMastery[tId]) {
          topicMastery[tId].solved++;
        }
      }
    });

    // Compute topic percentages
    Object.keys(topicMastery).forEach((tId) => {
      const entry = topicMastery[tId];
      entry.percentage = entry.total > 0 ? Math.round((entry.solved / entry.total) * 100) : 0;
    });

    const totalSubmissions = totalSolved + totalWrongAttempts;

    const accuracyRate = totalSubmissions > 0
      ? Math.round((totalSolved / totalSubmissions) * 1000) / 10
      : 0;

    const firstTryAccuracyRate = totalAttempted > 0
      ? Math.round((firstTryCount / totalAttempted) * 1000) / 10
      : 0;
    
    const streakDays = computeStreak(recordsList.filter((r) => r.isSolved));

    return {
      totalQuestions: allQuestions.length,
      totalSolved,
      totalAttempted,
      easySolved,
      easyTotal,
      mediumSolved,
      mediumTotal,
      hardSolved,
      hardTotal,
      accuracyRate,
      firstTryAccuracyRate,
      streakDays,
      topicMastery,
    };
  },

  /**
   * Aggregate high-level LeetCode-style statistics from question list and user progress
   */
  computeStats: (
    allQuestions: { id: string; difficulty?: string; difficultyLevel?: number; topicId?: string; topic_id?: string }[],
    userEmail?: string
  ): ProgressSummaryStats => {
    const recordsMap = getLocalRecords(userEmail);
    return progressService.computeStatsFromRecords(allQuestions, recordsMap);
  },

  /**
   * Fetch all records from Supabase database, sync to localStorage, and return full records map
   */
  fetchAndSyncFromSupabase: async (userEmail?: string): Promise<Record<string, QuestionProgressRecord>> => {
    if (!userEmail || userEmail === 'guest@prepunite.com') {
      return getLocalRecords(userEmail);
    }

    const normalized = userEmail.trim().toLowerCase();
    const localMap = getLocalRecords(normalized);

    try {
      let allRows: any[] = [];
      let page = 0;
      const PAGE_SIZE = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('user_question_progress')
          .select('*')
          .eq('user_email', normalized)
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error) {
          console.warn('[progressService] Supabase fetch notice:', error.message);
          hasMore = false;
        } else if (data && data.length > 0) {
          allRows = allRows.concat(data);
          if (data.length < PAGE_SIZE) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }

      if (allRows.length > 0) {
        allRows.forEach((row: any) => {
          const wrongAttempts = row.wrong_attempts || 0;
          const isSolved = row.is_solved || false;
          const isRevealed = row.is_revealed || false;
          const firstTryCorrect = isSolved && !isRevealed && wrongAttempts === 0 && Boolean(row.first_try_correct);

          localMap[row.question_id] = {
            questionId: row.question_id,
            topicId: row.topic_id,
            categorySlug: row.category_slug,
            difficulty: row.difficulty || 'MEDIUM',
            selectedOption: row.selected_option,
            correctOption: row.correct_option,
            wrongAttempts,
            isSolved,
            isRevealed,
            firstTryCorrect,
            completedAt: row.completed_at,
            lastAttemptedAt: row.last_attempted_at,
          };
        });

        saveLocalRecords(localMap, normalized);
      }

      return localMap;
    } catch (err) {
      console.warn('[progressService] fetchAndSyncFromSupabase notice:', err);
      return localMap;
    }
  },

  /**
   * Sync remote records from Supabase on initial login
   */
  hydrateFromSupabase: async (userEmail: string): Promise<void> => {
    await progressService.fetchAndSyncFromSupabase(userEmail);
  },

  /**
   * Automatically migrate any practice questions solved as guest to the user's permanent Supabase account
   */
  migrateGuestProgress: async (userEmail: string): Promise<void> => {
    if (!userEmail || userEmail === 'guest@prepunite.com') return;

    try {
      const guestRecords = getLocalRecords('guest@prepunite.com');
      const guestKeys = Object.keys(guestRecords);
      if (guestKeys.length === 0) return;

      const normalized = userEmail.trim().toLowerCase();
      const userRecords = getLocalRecords(normalized);

      for (const qId of guestKeys) {
        const gRec = guestRecords[qId];
        if (!userRecords[qId]) {
          userRecords[qId] = gRec;
          try {
            await supabase.from('user_question_progress').upsert(
              {
                user_email: normalized,
                question_id: gRec.questionId,
                topic_id: gRec.topicId,
                category_slug: gRec.categorySlug || null,
                difficulty: gRec.difficulty,
                selected_option: gRec.selectedOption,
                correct_option: gRec.correctOption,
                wrong_attempts: gRec.wrongAttempts,
                is_solved: gRec.isSolved,
                is_revealed: gRec.isRevealed,
                first_try_correct: gRec.firstTryCorrect,
                completed_at: gRec.completedAt || null,
                last_attempted_at: gRec.lastAttemptedAt || new Date().toISOString(),
              },
              { onConflict: 'user_email,question_id' }
            );
          } catch (e) {
            console.warn('[progressService] Guest migration upsert notice:', e);
          }
        }
      }

      saveLocalRecords(userRecords, normalized);
      localStorage.removeItem(getStorageKey('guest@prepunite.com'));
      localStorage.removeItem(getStorageKey('guest'));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prepunite_progress_synced', { detail: { email: normalized } }));
      }
    } catch (err) {
      console.warn('[progressService] migrateGuestProgress notice:', err);
    }
  },
};
