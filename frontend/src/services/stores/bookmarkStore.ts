import { supabase } from '@/lib/supabase';

const STORAGE_KEYS = {
  BOOKMARKED_EXAMS: 'prepunite_bookmarked_exams',
  BOOKMARKED_QUESTIONS: 'prepunite_bookmarked_questions',
  BOOKMARKED_EXPERIENCES: 'prepunite_bookmarked_experiences',
} as const;

class BookmarkStore {
  private syncBookmarksTimeout: ReturnType<typeof setTimeout> | null = null;

  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22 || e?.code === 1014) {
        console.warn(`[bookmarkStore] LocalStorage quota exceeded while caching key "${key}".`);
      }
    }
  }

  // --- EXAM BOOKMARKS ---
  getBookmarkedExamIds(): string[] {
    return this.getStorage<string[]>(STORAGE_KEYS.BOOKMARKED_EXAMS, []);
  }

  isExamBookmarked(examId: string): boolean {
    return this.getBookmarkedExamIds().includes(examId);
  }

  toggleBookmarkExam(examId: string): boolean {
    const list = this.getBookmarkedExamIds();
    let updated: string[];
    let isBookmarked: boolean;

    if (list.includes(examId)) {
      updated = list.filter((id) => id !== examId);
      isBookmarked = false;
    } else {
      updated = [...list, examId];
      isBookmarked = true;
    }

    this.setStorage(STORAGE_KEYS.BOOKMARKED_EXAMS, updated);
    this.syncBookmarksWithSupabase();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
    }
    return isBookmarked;
  }

  // --- QUESTION BOOKMARKS ---
  getBookmarkedQuestionIds(): string[] {
    return this.getStorage<string[]>(STORAGE_KEYS.BOOKMARKED_QUESTIONS, []);
  }

  isQuestionBookmarked(questionId: string): boolean {
    return this.getBookmarkedQuestionIds().includes(questionId);
  }

  toggleBookmarkQuestion(questionId: string): boolean {
    const list = this.getBookmarkedQuestionIds();
    let updated: string[];
    let isBookmarked: boolean;

    if (list.includes(questionId)) {
      updated = list.filter((id) => id !== questionId);
      isBookmarked = false;
    } else {
      updated = [...list, questionId];
      isBookmarked = true;
    }

    this.setStorage(STORAGE_KEYS.BOOKMARKED_QUESTIONS, updated);
    this.syncBookmarksWithSupabase();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
    }
    return isBookmarked;
  }

  // --- EXPERIENCE BOOKMARKS ---
  getBookmarkedExperienceIds(): string[] {
    return this.getStorage<string[]>(STORAGE_KEYS.BOOKMARKED_EXPERIENCES, []);
  }

  isExperienceBookmarked(expId: string): boolean {
    return this.getBookmarkedExperienceIds().includes(expId);
  }

  toggleBookmarkExperience(expId: string): boolean {
    const list = this.getBookmarkedExperienceIds();
    let updated: string[];
    let isBookmarked: boolean;

    if (list.includes(expId)) {
      updated = list.filter((id) => id !== expId);
      isBookmarked = false;
    } else {
      updated = [...list, expId];
      isBookmarked = true;
    }

    this.setStorage(STORAGE_KEYS.BOOKMARKED_EXPERIENCES, updated);
    this.syncBookmarksWithSupabase();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
    }
    return isBookmarked;
  }

  // --- SUPABASE CLOUD SYNC ---
  async syncBookmarksWithSupabase(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const questions = this.getBookmarkedQuestionIds();
      const exams = this.getBookmarkedExamIds();
      const experiences = this.getBookmarkedExperienceIds();

      if (this.syncBookmarksTimeout) clearTimeout(this.syncBookmarksTimeout);
      this.syncBookmarksTimeout = setTimeout(async () => {
        try {
          // Cap recent bookmarks in user_metadata to prevent HTTP 431 Request Header Too Large
          const safeQuestions = questions.slice(-100);
          const safeExams = exams.slice(-100);
          const safeExperiences = experiences.slice(-100);

          await supabase.auth.updateUser({
            data: {
              bookmarked_questions: safeQuestions,
              bookmarked_exams: safeExams,
              bookmarked_experiences: safeExperiences,
            },
          });
        } catch (e) {
          console.warn('[bookmarkStore] Supabase bookmarks sync notice:', e);
        }
      }, 1500);
    } catch (err) {
      console.warn('[bookmarkStore] Failed to check auth session for bookmark sync:', err);
    }
  }

  async hydrateBookmarksFromSupabase(userMetadata?: any): Promise<{ questions: string[]; exams: string[]; experiences: string[] }> {
    try {
      let meta = userMetadata;
      if (!meta) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          return {
            questions: this.getBookmarkedQuestionIds(),
            exams: this.getBookmarkedExamIds(),
            experiences: this.getBookmarkedExperienceIds(),
          };
        }
        meta = session.user.user_metadata || {};
      }

      const remoteQuestions: string[] = Array.isArray(meta.bookmarked_questions) ? meta.bookmarked_questions : [];
      const remoteExams: string[] = Array.isArray(meta.bookmarked_exams) ? meta.bookmarked_exams : [];
      const remoteExps: string[] = Array.isArray(meta.bookmarked_experiences) ? meta.bookmarked_experiences : [];

      const localQuestions = this.getBookmarkedQuestionIds();
      const localExams = this.getBookmarkedExamIds();
      const localExps = this.getBookmarkedExperienceIds();

      const mergedQuestions = Array.from(new Set([...localQuestions, ...remoteQuestions]));
      const mergedExams = Array.from(new Set([...localExams, ...remoteExams]));
      const mergedExps = Array.from(new Set([...localExps, ...remoteExps]));

      const changed =
        mergedQuestions.length !== localQuestions.length ||
        mergedExams.length !== localExams.length ||
        mergedExps.length !== localExps.length;

      if (changed) {
        this.setStorage(STORAGE_KEYS.BOOKMARKED_QUESTIONS, mergedQuestions);
        this.setStorage(STORAGE_KEYS.BOOKMARKED_EXAMS, mergedExams);
        this.setStorage(STORAGE_KEYS.BOOKMARKED_EXPERIENCES, mergedExps);

        if (
          mergedQuestions.length > remoteQuestions.length ||
          mergedExams.length > remoteExams.length ||
          mergedExps.length > remoteExps.length
        ) {
          this.syncBookmarksWithSupabase();
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
        }
      }

      return {
        questions: mergedQuestions,
        exams: mergedExams,
        experiences: mergedExps,
      };
    } catch (e) {
      console.warn('[bookmarkStore] Hydrate bookmarks notice:', e);
      return {
        questions: this.getBookmarkedQuestionIds(),
        exams: this.getBookmarkedExamIds(),
        experiences: this.getBookmarkedExperienceIds(),
      };
    }
  }
}

export const bookmarkStore = new BookmarkStore();
