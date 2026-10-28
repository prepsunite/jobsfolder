import { supabase } from '@/lib/supabase';

const STORAGE_KEYS = {
  LIKED_EXPERIENCES: 'prepunite_upvoted_experiences',
  LIKED_COMPANIES: 'prepunite_liked_companies',
  LIKED_EXAMS: 'prepunite_liked_exams',
  CLIENT_ID: 'prepunite_client_id',
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

  private getClientId(): string {
    let id = this.getStorage<string>(STORAGE_KEYS.CLIENT_ID, '');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `client_${Date.now()}`;
      this.setStorage(STORAGE_KEYS.CLIENT_ID, id);
    }
    return id;
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
    const serverDbCount = this.getStorage<number | null>(`prepunite_db_count_experience_${expId}`, null);
    if (serverDbCount !== null) {
      return serverDbCount;
    }
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

    const currentCount = this.getExperienceLikeCount(expId, baseCount);
    const optimisticCount = Math.max(0, isLiked ? currentCount + 1 : currentCount - 1);
    this.setStorage(`prepunite_db_count_experience_${expId}`, optimisticCount);
    this.notify();

    // Persist directly to Supabase PostgreSQL via serverless backend
    this.persistLikeCloud('experience', expId, isLiked);

    return {
      isLiked,
      count: optimisticCount,
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
    const clean = (slugOrId || 'tcs').toLowerCase().trim();
    const isLiked = this.isCompanyLiked(clean);
    const serverDbCount = this.getStorage<number | null>(`prepunite_db_count_company_${clean}`, null);
    const base = this.getCompanyBaseCount(clean);
    if (serverDbCount !== null) {
      return base + serverDbCount;
    }
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

    const currentCount = this.getCompanyLikeCount(clean);
    const optimisticCount = Math.max(0, isLiked ? currentCount + 1 : currentCount - 1);
    this.notify();

    // Persist directly to Supabase PostgreSQL via serverless backend
    this.persistLikeCloud('company', clean, isLiked);

    return {
      isLiked,
      count: optimisticCount,
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
    const isLiked = this.isExamLiked(examId);
    const serverDbCount = this.getStorage<number | null>(`prepunite_db_count_exam_${examId}`, null);
    if (serverDbCount !== null) {
      return serverDbCount;
    }
    const base = this.getExamBaseCount(examId, baseCount);
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

    const currentCount = this.getExamLikeCount(examId, baseCount);
    const optimisticCount = Math.max(0, isLiked ? currentCount + 1 : currentCount - 1);
    this.setStorage(`prepunite_db_count_exam_${examId}`, optimisticCount);
    this.notify();

    // Persist directly to Supabase PostgreSQL via serverless backend
    this.persistLikeCloud('exam', examId, isLiked);

    return {
      isLiked,
      count: optimisticCount,
    };
  }

  // ==========================================
  // --- REAL POSTGRESQL CLOUD PERSISTENCE ---
  // ==========================================
  private async persistLikeCloud(
    itemType: 'experience' | 'company' | 'exam',
    itemId: string,
    isLiked: boolean
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;
      const clientIdentifier = this.getClientId();

      const response = await fetch('/api/toggle-like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemType,
          itemId,
          delta: isLiked ? 1 : -1,
          clientIdentifier,
          userEmail,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (typeof result.upvotes === 'number') {
          // Store actual server database count
          this.setStorage(`prepunite_db_count_${itemType}_${itemId}`, result.upvotes);
          this.notify();
        }
      }
    } catch (err) {
      console.warn(`[likeStore] Live server database sync notice:`, err);
    }
  }
}

export const likeStore = new LikeStore();
