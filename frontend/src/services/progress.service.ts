import { supabase } from '@/lib/supabase';

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
    localStorage.setItem(getStorageKey(userEmail), JSON.stringify(records));
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
    if (sortedDays.includes(currentExpectedStr)) {
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
        if (wrongAttempts === 0) {
          firstTryCorrect = true;
        }
      }
    } else {
      // Wrong option chosen
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
   * Aggregate high-level LeetCode-style statistics from question list and user progress
   */
  computeStats: (
    allQuestions: { id: string; difficulty?: string; difficultyLevel?: number; topicId?: string }[],
    userEmail?: string
  ): ProgressSummaryStats => {
    const recordsMap = getLocalRecords(userEmail);
    const recordsList = Object.values(recordsMap);

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
    let totalWrongAttempts = 0;
    let firstTryCount = 0;

    const topicMastery: Record<string, { solved: number; total: number; percentage: number }> = {};

    // Initialize topic mastery totals
    allQuestions.forEach((q) => {
      const tId = q.topicId || 'general';
      if (!topicMastery[tId]) {
        topicMastery[tId] = { solved: 0, total: 0, percentage: 0 };
      }
      topicMastery[tId].total++;
    });

    recordsList.forEach((r) => {
      totalWrongAttempts += r.wrongAttempts;

      if (r.isSolved) {
        totalSolved++;
        if (r.firstTryCorrect) firstTryCount++;

        const diff = (r.difficulty || 'MEDIUM').toUpperCase();
        if (diff === 'EASY') easySolved++;
        else if (diff === 'HARD') hardSolved++;
        else mediumSolved++;

        if (r.topicId && topicMastery[r.topicId]) {
          topicMastery[r.topicId].solved++;
        }
      }
    });

    // Compute topic percentages
    Object.keys(topicMastery).forEach((tId) => {
      const entry = topicMastery[tId];
      entry.percentage = entry.total > 0 ? Math.round((entry.solved / entry.total) * 100) : 0;
    });

    const totalAttempted = recordsList.length;
    const totalSubmissions = totalSolved + totalWrongAttempts;
    const accuracyRate = totalSubmissions > 0 ? Math.round((totalSolved / totalSubmissions) * 1000) / 10 : 0;
    const firstTryAccuracyRate = totalSolved > 0 ? Math.round((firstTryCount / totalSolved) * 1000) / 10 : 0;
    const streakDays = computeStreak(recordsList);

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
   * Sync remote records from Supabase on initial login
   */
  hydrateFromSupabase: async (userEmail: string): Promise<void> => {
    if (!userEmail || userEmail === 'guest@prepunite.com') return;

    try {
      const { data, error } = await supabase
        .from('user_question_progress')
        .select('*')
        .eq('user_email', userEmail.trim().toLowerCase());

      if (!error && data && data.length > 0) {
        const localMap = getLocalRecords(userEmail);

        data.forEach((row: any) => {
          localMap[row.question_id] = {
            questionId: row.question_id,
            topicId: row.topic_id,
            categorySlug: row.category_slug,
            difficulty: row.difficulty || 'MEDIUM',
            selectedOption: row.selected_option,
            correctOption: row.correct_option,
            wrongAttempts: row.wrong_attempts || 0,
            isSolved: row.is_solved || false,
            isRevealed: row.is_revealed || false,
            firstTryCorrect: row.first_try_correct || false,
            completedAt: row.completed_at,
            lastAttemptedAt: row.last_attempted_at,
          };
        });

        saveLocalRecords(localMap, userEmail);
      }
    } catch (err) {
      console.warn('[progressService] Hydration notice:', err);
    }
  },
};
