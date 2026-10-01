import { supabase } from '@/lib/supabase';
import { GUEST_EMAIL } from '@/contexts/AuthContext';
import { ALL_CAMPUS_DSA_PROBLEMS } from './campusDsaRoadmapData';
import { technicalService } from './technical.service';

const LEETCODE_PROFILE_KEY = 'prepunite_leetcode_profile';
const PRIMARY_SOLVED_KEY = 'prepunite_solved_coding_problems';
const LEGACY_SOLVED_KEY = 'prepunite_solved_problems';

const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const extractCleanUsername = (raw: string): string => {
  if (!raw) return '';
  let u = raw.trim();
  u = u.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/(u\/)?/i, '');
  u = u.replace(/[/?#].*$/, '');
  u = u.replace(/^@/, '').trim();
  return u;
};

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export interface LeetCodeProfile {
  username: string;
  avatar?: string | null;
  ranking?: number | null;
  realName?: string | null;
  stats: LeetCodeStats;
  solvedSlugs: string[];
  solvedTitles: string[];
  syncedAt: string;
  verifiedCampusDsaCount: number;
}

export interface LeetCodeSyncResult {
  success: boolean;
  profile?: LeetCodeProfile;
  matchedCount?: number;
  newlyMatchedCount?: number;
  error?: string;
}

export const leetcodeSyncService = {
  extractCleanUsername,

  // ─── Local Profile Storage ────────────────────────────────────────────────
  getStoredProfile(): LeetCodeProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(LEETCODE_PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveStoredProfile(profile: LeetCodeProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LEETCODE_PROFILE_KEY, JSON.stringify(profile));
    } catch {}
  },

  clearStoredProfile(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(LEETCODE_PROFILE_KEY);
    } catch {}
  },

  // ─── Get Unified Solved Set from LocalStorage ────────────────────────────
  getSolvedSet(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    const set = new Set<string>();
    try {
      const primary = localStorage.getItem(PRIMARY_SOLVED_KEY);
      if (primary) {
        JSON.parse(primary).forEach((id: string) => set.add(id));
      }
      const legacy = localStorage.getItem(LEGACY_SOLVED_KEY);
      if (legacy) {
        JSON.parse(legacy).forEach((id: string) => set.add(id));
      }
    } catch {}
    return set;
  },

  saveSolvedSet(solvedSet: Set<string>): void {
    if (typeof window === 'undefined') return;
    try {
      const arr = Array.from(solvedSet);
      localStorage.setItem(PRIMARY_SOLVED_KEY, JSON.stringify(arr));
      localStorage.setItem(LEGACY_SOLVED_KEY, JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent('prepunite-storage-update'));
    } catch {}
  },

  // ─── Fetch Raw Data from LeetCode (API with fallback) ───────────────────────
  async fetchProfileData(rawInput: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const cleanUsername = extractCleanUsername(rawInput);
    if (!cleanUsername) {
      return { success: false, error: 'Please enter a valid LeetCode username or profile link.' };
    }

    // Attempt 1: Call Vercel serverless function /api/leetcode-sync
    try {
      const res = await fetch(`/api/leetcode-sync?username=${encodeURIComponent(cleanUsername)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          return { success: true, data: json };
        }
        return { success: false, error: json.error || 'Failed to sync with LeetCode' };
      }
      if (res.status === 404) {
        const json = await res.json().catch(() => ({}));
        return { success: false, error: json.error || `LeetCode user '@${cleanUsername}' not found.` };
      }
    } catch (apiErr) {
      console.warn('[leetcodeSyncService] Primary API unreachable, attempting fallback:', apiErr);
    }

    // Attempt 2: Fallback to public mirror API (useful in local dev when Vercel serverless is not running)
    try {
      const [profileRes, acRes, allSubRes] = await Promise.allSettled([
        fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/solved`),
        fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/acSubmission?limit=100`),
        fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/submission`),
      ]);

      if (profileRes.status !== 'fulfilled' || !profileRes.value.ok) {
        return { success: false, error: `LeetCode user '@${cleanUsername}' not found.` };
      }

      const pData = await profileRes.value.json().catch(() => ({}));
      const acData = acRes.status === 'fulfilled' && acRes.value.ok ? await acRes.value.json().catch(() => ({})) : { submission: [] };
      const subData = allSubRes.status === 'fulfilled' && allSubRes.value.ok ? await allSubRes.value.json().catch(() => ({})) : { submission: [] };

      const slugs = new Set<string>();
      const titles = new Set<string>();

      if (Array.isArray(acData.submission)) {
        acData.submission.forEach((s: any) => {
          if (s.titleSlug) slugs.add(s.titleSlug.toLowerCase().trim());
          if (s.title) titles.add(s.title.toLowerCase().trim());
        });
      }

      if (Array.isArray(subData.submission)) {
        subData.submission.forEach((s: any) => {
          if (s.statusDisplay === 'Accepted') {
            if (s.titleSlug) slugs.add(s.titleSlug.toLowerCase().trim());
            if (s.title) titles.add(s.title.toLowerCase().trim());
          }
        });
      }

      return {
        success: true,
        data: {
          username: cleanUsername,
          avatar: null,
          ranking: null,
          stats: {
            totalSolved: pData.solvedProblem || pData.totalSolved || slugs.size,
            easySolved: pData.easySolved || 0,
            mediumSolved: pData.mediumSolved || 0,
            hardSolved: pData.hardSolved || 0,
          },
          solvedSlugs: Array.from(slugs),
          solvedTitles: Array.from(titles),
          syncedAt: new Date().toISOString(),
        },
      };
    } catch (fallbackErr: any) {
      console.error('[leetcodeSyncService] Fallback also failed:', fallbackErr);
      return { success: false, error: 'Could not connect to LeetCode. Please check your internet connection.' };
    }
  },

  // ─── Match Helper: Check if a Campus DSA Problem is in Solved Sets ────────
  matchesProblem(
    prob: { id: string; title: string; slug?: string; leetcodeUrl?: string; leetcodeNumber?: number },
    exactSlugs: Set<string>,
    cleanedSlugs: Set<string>,
    exactTitles: Set<string>,
    cleanedTitles: Set<string>
  ): boolean {
    // 1. Direct slug match
    if (prob.slug) {
      const lower = prob.slug.toLowerCase().trim();
      if (exactSlugs.has(lower)) return true;
      if (cleanedSlugs.has(cleanStr(lower))) return true;
    }

    // 2. Slug extracted from LeetCode URL
    if (prob.leetcodeUrl) {
      const urlMatch = prob.leetcodeUrl.match(/leetcode\.com\/problems\/([^/]+)/);
      if (urlMatch && urlMatch[1]) {
        const uSlug = urlMatch[1].toLowerCase().trim();
        if (exactSlugs.has(uSlug)) return true;
        if (cleanedSlugs.has(cleanStr(uSlug))) return true;
      }
    }

    // 3. Exact & normalized title match
    if (prob.title) {
      const lower = prob.title.toLowerCase().trim();
      if (exactTitles.has(lower)) return true;
      if (cleanedTitles.has(cleanStr(lower))) return true;
    }

    return false;
  },

  // ─── Reconcile Stored Profile With Local Solved Set (Auto-fix on mount) ────
  reconcileStoredProfile(userEmail?: string): number {
    const profile = this.getStoredProfile();
    if (!profile || !Array.isArray(profile.solvedSlugs) || profile.solvedSlugs.length === 0) {
      return 0;
    }

    const exactSlugs = new Set(profile.solvedSlugs.map(s => s.toLowerCase().trim()));
    const cleanedSlugs = new Set(profile.solvedSlugs.map(s => cleanStr(s)));
    const exactTitles = new Set((profile.solvedTitles || []).map(t => t.toLowerCase().trim()));
    const cleanedTitles = new Set((profile.solvedTitles || []).map(t => cleanStr(t)));

    const currentSolved = this.getSolvedSet();
    const matchedProblemIds: string[] = [];
    let newlyAdded = 0;

    ALL_CAMPUS_DSA_PROBLEMS.forEach(prob => {
      if (this.matchesProblem(prob, exactSlugs, cleanedSlugs, exactTitles, cleanedTitles)) {
        matchedProblemIds.push(prob.id);
        if (!currentSolved.has(prob.id)) {
          currentSolved.add(prob.id);
          newlyAdded++;
        }
      }
    });

    if (newlyAdded > 0) {
      this.saveSolvedSet(currentSolved);

      if (userEmail && userEmail !== GUEST_EMAIL && matchedProblemIds.length > 0) {
        const dbPayloads = matchedProblemIds.map(pId => ({
          user_email: userEmail,
          problem_id: pId,
          track: 'CAMPUS_DSA',
          is_solved: true,
          completed_at: new Date().toISOString(),
          last_attempted_at: new Date().toISOString(),
        }));

        for (let i = 0; i < dbPayloads.length; i += 50) {
          const chunk = dbPayloads.slice(i, i + 50);
          supabase
            .from('user_technical_progress')
            .upsert(chunk, { onConflict: 'user_email,problem_id' })
            .then(({ error }) => {
              if (error) console.warn('[leetcodeSyncService] Supabase reconcile notice:', error.message);
            });
        }
      }
    }

    return matchedProblemIds.length;
  },

  // ─── Sync and Match LeetCode Solved Problems with Campus DSA ─────────────────
  async syncCampusDsa(username: string, userEmail?: string): Promise<LeetCodeSyncResult> {
    const fetchRes = await this.fetchProfileData(username);
    if (!fetchRes.success || !fetchRes.data) {
      return { success: false, error: fetchRes.error || 'Failed to fetch LeetCode profile.' };
    }

    const {
      username: confirmedUsername,
      avatar,
      ranking,
      realName,
      stats,
      solvedSlugs = [],
      solvedTitles = [],
      syncedAt,
    } = fetchRes.data;

    // Accumulate with previously stored profile if same username
    const prevProfile = this.getStoredProfile();
    const isSameUser = prevProfile && prevProfile.username.toLowerCase() === confirmedUsername.toLowerCase();
    const prevSlugs = isSameUser && Array.isArray(prevProfile.solvedSlugs) ? prevProfile.solvedSlugs : [];
    const prevTitles = isSameUser && Array.isArray(prevProfile.solvedTitles) ? prevProfile.solvedTitles : [];

    const cumulativeSlugs = Array.from(new Set([...prevSlugs, ...solvedSlugs]));
    const cumulativeTitles = Array.from(new Set([...prevTitles, ...solvedTitles]));

    // Normalization sets for O(1) matching using cumulative solved data
    const exactSlugs = new Set<string>(cumulativeSlugs.map((s: string) => s.toLowerCase().trim()));
    const cleanedSlugs = new Set<string>(cumulativeSlugs.map((s: string) => cleanStr(s)));
    const exactTitles = new Set<string>(cumulativeTitles.map((t: string) => t.toLowerCase().trim()));
    const cleanedTitles = new Set<string>(cumulativeTitles.map((t: string) => cleanStr(t)));

    // Get unified solved set
    const currentSolvedIds = this.getSolvedSet();
    let newlyMatchedCount = 0;
    let totalMatchedCount = 0;

    const matchedProblemIds: string[] = [];

    // Match against all 150 Campus DSA roadmap problems
    ALL_CAMPUS_DSA_PROBLEMS.forEach(prob => {
      if (this.matchesProblem(prob, exactSlugs, cleanedSlugs, exactTitles, cleanedTitles)) {
        totalMatchedCount++;
        matchedProblemIds.push(prob.id);
        if (!currentSolvedIds.has(prob.id)) {
          newlyMatchedCount++;
          currentSolvedIds.add(prob.id);
        }
      }
    });

    // Save updated solved set to LocalStorage (both primary & legacy keys)
    this.saveSolvedSet(currentSolvedIds);

    // Batch upsert to Supabase if authenticated
    if (userEmail && userEmail !== GUEST_EMAIL && matchedProblemIds.length > 0) {
      const dbPayloads = matchedProblemIds.map(pId => ({
        user_email: userEmail,
        problem_id: pId,
        track: 'CAMPUS_DSA',
        is_solved: true,
        completed_at: new Date().toISOString(),
        last_attempted_at: new Date().toISOString(),
      }));

      // Fire and forget batch upsert in chunks of 50
      for (let i = 0; i < dbPayloads.length; i += 50) {
        const chunk = dbPayloads.slice(i, i + 50);
        supabase
          .from('user_technical_progress')
          .upsert(chunk, { onConflict: 'user_email,problem_id' })
          .then(({ error }) => {
            if (error) console.warn('[leetcodeSyncService] Supabase batch sync notice:', error.message);
          });
      }
    }

    const fullProfile: LeetCodeProfile = {
      username: confirmedUsername,
      avatar,
      ranking,
      realName,
      stats,
      solvedSlugs: cumulativeSlugs,
      solvedTitles: cumulativeTitles,
      syncedAt: syncedAt || new Date().toISOString(),
      verifiedCampusDsaCount: totalMatchedCount,
    };

    // Store profile locally
    this.saveStoredProfile(fullProfile);

    // Notify listeners across app
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite-storage-update'));
    }

    return {
      success: true,
      profile: fullProfile,
      matchedCount: totalMatchedCount,
      newlyMatchedCount,
    };
  },
};
