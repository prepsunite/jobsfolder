import { supabase } from '@/lib/supabase';

const STORAGE_KEYS = {
  LIKED_EXPERIENCES: 'prepunite_upvoted_experiences',
  LIKED_COMPANIES: 'prepunite_liked_companies',
  LIKED_EXAMS: 'prepunite_liked_exams',
  CLIENT_ID: 'prepunite_client_id',
  CACHED_COMPANY_COUNTS: 'prepunite_cached_company_counts',
} as const;

class LikeStore {
  // In-memory cache of authoritative global company like counts
  private companyLikesCache: Record<string, number> = {};
  // Pending optimistic deltas while network request is in flight
  private pendingDeltas = new Map<string, number>();
  private syncPromise: Promise<void> | null = null;

  constructor() {
    this.companyLikesCache = this.getStorage<Record<string, number>>(
      STORAGE_KEYS.CACHED_COMPANY_COUNTS,
      {}
    );
    if (typeof window !== 'undefined') {
      // Background init on load
      setTimeout(() => {
        this.init();
      }, 50);
    }
  }

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
      console.warn('[likeStore] Failed to cache key:', { key, error: e });
    }
  }

  private notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_likes_changed'));
    }
  }

  public getClientId(): string {
    let id = this.getStorage<string>(STORAGE_KEYS.CLIENT_ID, '');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `client_${Date.now()}`;
      this.setStorage(STORAGE_KEYS.CLIENT_ID, id);
    }
    return id;
  }

  // ==========================================
  // --- CLOUD SYNC & GLOBAL INITIALIZATION ---
  // ==========================================
  async init(userEmail?: string): Promise<void> {
    if (this.syncPromise) return this.syncPromise;
    this.syncPromise = this.fetchLikesSummary(userEmail);
    try {
      await this.syncPromise;
    } finally {
      this.syncPromise = null;
    }
  }

  async fetchLikesSummary(userEmail?: string): Promise<void> {
    try {
      const clientId = this.getClientId();
      let email = userEmail;
      if (!email) {
        const { data: { session } } = await supabase.auth.getSession();
        email = session?.user?.email;
      }

      const params = new URLSearchParams();
      if (email) params.set('userEmail', email);
      if (clientId) params.set('clientIdentifier', clientId);

      const res = await fetch(`/api/toggle-like?${params.toString()}`);
      if (!res.ok) return;

      const data = await res.json();
      if (data.companyLikes && typeof data.companyLikes === 'object') {
        this.companyLikesCache = {
          ...this.companyLikesCache,
          ...data.companyLikes,
        };
        this.setStorage(STORAGE_KEYS.CACHED_COMPANY_COUNTS, this.companyLikesCache);
      }

      // Merge server-known liked items into local user state
      if (data.userLiked) {
        if (Array.isArray(data.userLiked.companies) && data.userLiked.companies.length > 0) {
          const local = new Set(this.getLikedCompanySlugs());
          data.userLiked.companies.forEach((c: string) => local.add(c.toLowerCase()));
          this.setStorage(STORAGE_KEYS.LIKED_COMPANIES, Array.from(local));
        }
        if (Array.isArray(data.userLiked.exams) && data.userLiked.exams.length > 0) {
          const local = new Set(this.getLikedExamIds());
          data.userLiked.exams.forEach((e: string) => local.add(e));
          this.setStorage(STORAGE_KEYS.LIKED_EXAMS, Array.from(local));
        }
        if (Array.isArray(data.userLiked.experiences) && data.userLiked.experiences.length > 0) {
          const local = new Set(this.getLikedExperienceIds());
          data.userLiked.experiences.forEach((e: string) => local.add(e));
          this.setStorage(STORAGE_KEYS.LIKED_EXPERIENCES, Array.from(local));
        }
      }

      this.notify();
    } catch (err) {
      console.warn('[likeStore] fetchLikesSummary notice:', err);
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
    if (!expId) return baseCount || 0;
    const delta = this.pendingDeltas.get(`experience_${expId}`) || 0;
    return Math.max(0, (baseCount || 0) + delta);
  }

  toggleExperienceLike(expId: string, baseCount: number = 0): { isLiked: boolean; count: number } {
    if (!expId) return { isLiked: false, count: baseCount };
    const list = this.getLikedExperienceIds();
    let updated: string[];
    let isLiked: boolean;

    if (list.includes(expId)) {
      updated = list.filter((id) => id !== expId);
      isLiked = false;
      this.pendingDeltas.set(`experience_${expId}`, -1);
    } else {
      updated = [...list, expId];
      isLiked = true;
      this.pendingDeltas.set(`experience_${expId}`, 1);
    }

    this.setStorage(STORAGE_KEYS.LIKED_EXPERIENCES, updated);

    const delta = this.pendingDeltas.get(`experience_${expId}`) || 0;
    const optimisticCount = Math.max(0, (baseCount || 0) + delta);
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
    const serverCount = this.companyLikesCache[clean];
    const base = typeof serverCount === 'number' ? serverCount : this.getCompanyBaseCount(clean);
    const delta = this.pendingDeltas.get(`company_${clean}`) || 0;
    return Math.max(0, base + delta);
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
      this.pendingDeltas.set(`company_${clean}`, -1);
    } else {
      updated = [...list, clean];
      isLiked = true;
      this.pendingDeltas.set(`company_${clean}`, 1);
    }

    this.setStorage(STORAGE_KEYS.LIKED_COMPANIES, updated);

    const delta = this.pendingDeltas.get(`company_${clean}`) || 0;
    const currentBase = typeof this.companyLikesCache[clean] === 'number'
      ? this.companyLikesCache[clean]
      : this.getCompanyBaseCount(clean);
    const optimisticCount = Math.max(0, currentBase + delta);
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

  getExamLikeCount(examId: string, baseCount: number = 0): number {
    if (!examId) return baseCount || 0;
    const delta = this.pendingDeltas.get(`exam_${examId}`) || 0;
    return Math.max(0, (baseCount || 0) + delta);
  }

  toggleExamLike(examId: string, baseCount: number = 0): { isLiked: boolean; count: number } {
    if (!examId) return { isLiked: false, count: baseCount };
    const list = this.getLikedExamIds();
    let updated: string[];
    let isLiked: boolean;

    if (list.includes(examId)) {
      updated = list.filter((id) => id !== examId);
      isLiked = false;
      this.pendingDeltas.set(`exam_${examId}`, -1);
    } else {
      updated = [...list, examId];
      isLiked = true;
      this.pendingDeltas.set(`exam_${examId}`, 1);
    }

    this.setStorage(STORAGE_KEYS.LIKED_EXAMS, updated);

    const delta = this.pendingDeltas.get(`exam_${examId}`) || 0;
    const optimisticCount = Math.max(0, (baseCount || 0) + delta);
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
        // Clear optimistic delta
        this.pendingDeltas.delete(`${itemType}_${itemId}`);

        if (typeof result.upvotes === 'number') {
          if (itemType === 'company') {
            this.companyLikesCache[itemId] = result.upvotes;
            this.setStorage(STORAGE_KEYS.CACHED_COMPANY_COUNTS, this.companyLikesCache);
          }
        }
        this.notify();
      }
    } catch (err) {
      console.warn(`[likeStore] Live server database sync notice:`, err);
    }
  }
}

export const likeStore = new LikeStore();
