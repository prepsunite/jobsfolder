import { supabase } from '@/lib/supabase';

const STORAGE_KEYS = {
  BOOKMARKED_EXAMS: 'prepunite_bookmarked_exams',
  BOOKMARKED_QUESTIONS: 'prepunite_bookmarked_questions',
  BOOKMARKED_EXPERIENCES: 'prepunite_bookmarked_experiences',
} as const;

class BookmarkStore {
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

  /**
   * Persist single bookmark mutation directly to public.user_bookmarks relational table.
   * Completely avoids storing bookmark IDs in JWT user_metadata, eliminating HTTP 431 header explosion risks.
   */
  private async persistBookmarkItem(
    itemType: 'question' | 'exam' | 'experience',
    itemId: string,
    isBookmarked: boolean
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;
      if (!userEmail) return;

      const normalizedEmail = userEmail.trim().toLowerCase();

      if (isBookmarked) {
        const { error } = await supabase.from('user_bookmarks').upsert(
          {
            user_email: normalizedEmail,
            user_id: session.user.id,
            item_type: itemType,
            item_id: itemId,
          },
          { onConflict: 'user_email,item_type,item_id' }
        );
        if (error) {
          console.warn(`[bookmarkStore] Supabase insert bookmark error:`, error.message);
        }
      } else {
        const { error } = await supabase.from('user_bookmarks').delete().match({
          user_email: normalizedEmail,
          item_type: itemType,
          item_id: itemId,
        });
        if (error) {
          console.warn(`[bookmarkStore] Supabase delete bookmark error:`, error.message);
        }
      }
    } catch (err) {
      console.warn(`[bookmarkStore] Failed to persist ${itemType} bookmark to Supabase:`, err);
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
    this.persistBookmarkItem('exam', examId, isBookmarked);

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
    this.persistBookmarkItem('question', questionId, isBookmarked);

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
    this.persistBookmarkItem('experience', expId, isBookmarked);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
    }
    return isBookmarked;
  }

  // --- SUPABASE CLOUD SYNC ---
  async syncBookmarksWithSupabase(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;
      if (!userEmail) return;

      const normalizedEmail = userEmail.trim().toLowerCase();
      const questions = this.getBookmarkedQuestionIds();
      const exams = this.getBookmarkedExamIds();
      const experiences = this.getBookmarkedExperienceIds();

      const rowsToUpsert = [
        ...questions.map((id) => ({
          user_email: normalizedEmail,
          user_id: session.user.id,
          item_type: 'question',
          item_id: id,
        })),
        ...exams.map((id) => ({
          user_email: normalizedEmail,
          user_id: session.user.id,
          item_type: 'exam',
          item_id: id,
        })),
        ...experiences.map((id) => ({
          user_email: normalizedEmail,
          user_id: session.user.id,
          item_type: 'experience',
          item_id: id,
        })),
      ];

      if (rowsToUpsert.length > 0) {
        const { error } = await supabase.from('user_bookmarks').upsert(rowsToUpsert, {
          onConflict: 'user_email,item_type,item_id',
        });
        if (error) {
          console.warn('[bookmarkStore] syncBookmarksWithSupabase notice:', error.message);
        }
      }
    } catch (err) {
      console.warn('[bookmarkStore] syncBookmarksWithSupabase notice:', err);
    }
  }

  /**
   * Hydrates bookmarks from public.user_bookmarks in Supabase.
   * Merges with any guest/offline bookmarks stored locally and pushes delta to database.
   */
  async hydrateBookmarksFromSupabase(_userMetadata?: any): Promise<{ questions: string[]; exams: string[]; experiences: string[] }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        return {
          questions: this.getBookmarkedQuestionIds(),
          exams: this.getBookmarkedExamIds(),
          experiences: this.getBookmarkedExperienceIds(),
        };
      }

      const userEmail = session.user.email.trim().toLowerCase();

      // Query relational user_bookmarks table
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('item_type, item_id')
        .eq('user_email', userEmail);

      if (error) {
        console.warn('[bookmarkStore] Supabase fetch bookmarks notice:', error.message);
        return {
          questions: this.getBookmarkedQuestionIds(),
          exams: this.getBookmarkedExamIds(),
          experiences: this.getBookmarkedExperienceIds(),
        };
      }

      const remoteQuestions: string[] = [];
      const remoteExams: string[] = [];
      const remoteExperiences: string[] = [];

      (data || []).forEach((row: { item_type: string; item_id: string }) => {
        if (row.item_type === 'question') remoteQuestions.push(row.item_id);
        else if (row.item_type === 'exam') remoteExams.push(row.item_id);
        else if (row.item_type === 'experience') remoteExperiences.push(row.item_id);
      });

      const localQuestions = this.getBookmarkedQuestionIds();
      const localExams = this.getBookmarkedExamIds();
      const localExperiences = this.getBookmarkedExperienceIds();

      // Migrate any locally saved guest bookmarks to remote database
      const missingQuestions = localQuestions.filter((id) => !remoteQuestions.includes(id));
      const missingExams = localExams.filter((id) => !remoteExams.includes(id));
      const missingExps = localExperiences.filter((id) => !remoteExperiences.includes(id));

      const missingItems = [
        ...missingQuestions.map((id) => ({
          user_email: userEmail,
          user_id: session.user.id,
          item_type: 'question',
          item_id: id,
        })),
        ...missingExams.map((id) => ({
          user_email: userEmail,
          user_id: session.user.id,
          item_type: 'exam',
          item_id: id,
        })),
        ...missingExps.map((id) => ({
          user_email: userEmail,
          user_id: session.user.id,
          item_type: 'experience',
          item_id: id,
        })),
      ];

      if (missingItems.length > 0) {
        await supabase.from('user_bookmarks').upsert(missingItems, {
          onConflict: 'user_email,item_type,item_id',
        });
      }

      const mergedQuestions = Array.from(new Set([...localQuestions, ...remoteQuestions]));
      const mergedExams = Array.from(new Set([...localExams, ...remoteExams]));
      const mergedExps = Array.from(new Set([...localExperiences, ...remoteExperiences]));

      this.setStorage(STORAGE_KEYS.BOOKMARKED_QUESTIONS, mergedQuestions);
      this.setStorage(STORAGE_KEYS.BOOKMARKED_EXAMS, mergedExams);
      this.setStorage(STORAGE_KEYS.BOOKMARKED_EXPERIENCES, mergedExps);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
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
