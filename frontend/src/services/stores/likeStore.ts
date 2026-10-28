import { supabase } from '@/lib/supabase';

const STORAGE_KEYS = {
  LIKED_EXPERIENCES: 'prepunite_upvoted_experiences',
  LIKED_COMPANIES: 'prepunite_liked_companies',
  LIKED_EXAMS: 'prepunite_liked_exams',
} as const;

class LikeStore {
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
      console.warn(`[likeStore] Failed to cache key "${key}":`, e);
    }
  }

  private notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_likes_changed'));
    }
  }

  // ==========================================
  // --- EXPERIENCES UPVOTES / HELPFUL ---
  // ==========================================
  getLikedExperienceIds(): string[] {
    return this.getStorage<string[]>(STORAGE_KEYS.LIKED_EXPERIENCES, []);
  }

  isExperienceLiked(expId: string): boolean {
    if (!expId) return false;
    return this.getLikedExperienceIds().includes(expId);
  }

  getExperienceLikeCount(expId: string, baseCount: number = 0): number {
    const isLiked = this.isExperienceLiked(expId);
    return Math.max(0, (baseCount || 0) + (isLiked ? 1 : 0));
  }

  toggleExperienceLike(expId: string, baseCount: number = 0): { isLiked: boolean; count: number } {
    if (!expId) return { isLiked: false, count: baseCount };
    const list = this.getLikedExperienceIds();
    let updated: string[];
    let isLiked: boolean;

    if (list.includes(expId)) {
      updated = list.filter((id) => id !== expId);
      isLiked = false;
    } else {
      updated = [...list, expId];
      isLiked = true;
    }

    this.setStorage(STORAGE_KEYS.LIKED_EXPERIENCES, updated);
    this.notify();

    // Async sync with Supabase user_bookmarks if user is authenticated
    this.persistLikeCloud('experience', expId, isLiked);

    return {
      isLiked,
      count: Math.max(0, (baseCount || 0) + (isLiked ? 1 : 0)),
    };
  }

  // ==========================================
  // --- COMPANIES LIKES (HEARTS) ---
  // ==========================================
  getLikedCompanySlugs(): string[] {
    return this.getStorage<string[]>(STORAGE_KEYS.LIKED_COMPANIES, []);
  }

  isCompanyLiked(slugOrId: string): boolean {
    if (!slugOrId) return false;
    const clean = slugOrId.toLowerCase().trim();
    return this.getLikedCompanySlugs().includes(clean);
  }

  // Deterministic baseline like count for each company (75 - 195)
  private getCompanyBaseCount(slugOrId: string): number {
    const clean = (slugOrId || 'tcs').toLowerCase().trim();
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash << 5) - hash + clean.charCodeAt(i);
      hash |= 0;
    }
    return 75 + (Math.abs(hash) % 120);
  }

  getCompanyLikeCount(slugOrId: string): number {
    const base = this.getCompanyBaseCount(slugOrId);
    const isLiked = this.isCompanyLiked(slugOrId);
    return base + (isLiked ? 1 : 0);
  }

  toggleCompanyLike(slugOrId: string): { isLiked: boolean; count: number } {
    if (!slugOrId) return { isLiked: false, count: 75 };
    const clean = slugOrId.toLowerCase().trim();
    const list = this.getLikedCompanySlugs();
    let updated: string[];
    let isLiked: boolean;

    if (list.includes(clean)) {
      updated = list.filter((s) => s !== clean);
      isLiked = false;
    } else {
      updated = [...list, clean];
      isLiked = true;
    }

    this.setStorage(STORAGE_KEYS.LIKED_COMPANIES, updated);
    this.notify();

    this.persistLikeCloud('company', clean, isLiked);

    return {
      isLiked,
      count: this.getCompanyLikeCount(clean),
    };
  }

  // ==========================================
  // --- EXAMS LIKES / HEARTS ---
  // ==========================================
  getLikedExamIds(): string[] {
    return this.getStorage<string[]>(STORAGE_KEYS.LIKED_EXAMS, []);
  }

  isExamLiked(examId: string): boolean {
    if (!examId) return false;
    return this.getLikedExamIds().includes(examId);
  }

  private getExamBaseCount(examId: string, baseCount: number = 0): number {
    if (baseCount && baseCount > 0) return baseCount;
    let hash = 0;
    for (let i = 0; i < examId.length; i++) {
      hash = (hash << 5) - hash + examId.charCodeAt(i);
      hash |= 0;
    }
    return 45 + (Math.abs(hash) % 85);
  }

  getExamLikeCount(examId: string, baseCount: number = 0): number {
    const base = this.getExamBaseCount(examId, baseCount);
    const isLiked = this.isExamLiked(examId);
    return base + (isLiked ? 1 : 0);
  }

  toggleExamLike(examId: string, baseCount: number = 0): { isLiked: boolean; count: number } {
    if (!examId) return { isLiked: false, count: baseCount };
    const list = this.getLikedExamIds();
    let updated: string[];
    let isLiked: boolean;

    if (list.includes(examId)) {
      updated = list.filter((id) => id !== examId);
      isLiked = false;
    } else {
      updated = [...list, examId];
      isLiked = true;
    }

    this.setStorage(STORAGE_KEYS.LIKED_EXAMS, updated);
    this.notify();

    this.persistLikeCloud('exam_like', examId, isLiked);

    return {
      isLiked,
      count: this.getExamLikeCount(examId, baseCount),
    };
  }

  // ==========================================
  // --- CLOUD SYNC (OPTIONAL / FIRE & FORGET) ---
  // ==========================================
  private async persistLikeCloud(
    itemType: 'experience' | 'company' | 'exam_like',
    itemId: string,
    isLiked: boolean
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;
      if (!userEmail) return;

      const normalizedEmail = userEmail.trim().toLowerCase();

      if (isLiked) {
        await supabase.from('user_bookmarks').upsert(
          {
            user_email: normalizedEmail,
            user_id: session.user.id,
            item_type: itemType,
            item_id: itemId,
          },
          { onConflict: 'user_email,item_type,item_id' }
        );
      } else {
        await supabase.from('user_bookmarks').delete().match({
          user_email: normalizedEmail,
          item_type: itemType,
          item_id: itemId,
        });
      }
    } catch {
      // Fail silent without breaking client experience
    }
  }
}

export const likeStore = new LikeStore();
