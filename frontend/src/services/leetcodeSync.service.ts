import { supabase } from '@/lib/supabase';
import { GUEST_EMAIL } from '@/contexts/AuthContext';
import { ALL_CAMPUS_DSA_PROBLEMS } from './campusDsaRoadmapData';
import { technicalService } from './technical.service';

const LEETCODE_PROFILE_KEY = 'prepunite_leetcode_profile';

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

  // ─── Fetch Raw Data from LeetCode (API with fallback) ───────────────────────
  async fetchProfileData(username: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const cleanUsername = username.replace(/^@/, '').trim();
    if (!cleanUsername) {
      return { success: false, error: 'Please enter a valid LeetCode username.' };
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
      const [profileRes, acRes] = await Promise.all([
        fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/solved`),
        fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/acSubmission?limit=100`),
      ]);

      if (!profileRes.ok) {
        return { success: false, error: `LeetCode user '@${cleanUsername}' not found.` };
      }

      const pData = await profileRes.json();
      const acData = acRes.ok ? await acRes.json() : { submission: [] };

      const submissions = Array.isArray(acData.submission) ? acData.submission : [];
      const solvedSlugs = Array.from(new Set(submissions.map((s: any) => s.titleSlug?.toLowerCase().trim()).filter(Boolean)));
      const solvedTitles = Array.from(new Set(submissions.map((s: any) => s.title?.toLowerCase().trim()).filter(Boolean)));

      return {
        success: true,
        data: {
          username: cleanUsername,
          avatar: null,
          ranking: null,
          stats: {
            totalSolved: pData.solvedProblem || 0,
            easySolved: pData.easySolved || 0,
            mediumSolved: pData.mediumSolved || 0,
            hardSolved: pData.hardSolved || 0,
          },
          solvedSlugs,
          solvedTitles,
          syncedAt: new Date().toISOString(),
        },
      };
    } catch (fallbackErr: any) {
      console.error('[leetcodeSyncService] Fallback also failed:', fallbackErr);
      return { success: false, error: 'Could not connect to LeetCode. Please check your internet connection.' };
    }
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

    // Normalization sets for O(1) matching
    const solvedSlugSet = new Set(solvedSlugs.map((s: string) => s.toLowerCase().trim()));
    const solvedTitleSet = new Set(solvedTitles.map((t: string) => t.toLowerCase().trim()));

    // Get current solved set
    const currentSolvedIds = technicalService.getSolvedProblemIds();
    let newlyMatchedCount = 0;
    let totalMatchedCount = 0;

    const matchedProblemIds: string[] = [];

    // Match against all 100+ Campus DSA roadmap problems
    ALL_CAMPUS_DSA_PROBLEMS.forEach(prob => {
      let isMatch = false;

      // 1. Direct slug match
      if (prob.slug && solvedSlugSet.has(prob.slug.toLowerCase().trim())) {
        isMatch = true;
      }

      // 2. Slug from leetcodeUrl match (e.g. https://leetcode.com/problems/two-sum/)
      if (!isMatch && prob.leetcodeUrl) {
        const urlMatch = prob.leetcodeUrl.match(/leetcode\.com\/problems\/([^/]+)/);
        if (urlMatch && urlMatch[1] && solvedSlugSet.has(urlMatch[1].toLowerCase().trim())) {
          isMatch = true;
        }
      }

      // 3. Lowercase title match
      if (!isMatch && prob.title && solvedTitleSet.has(prob.title.toLowerCase().trim())) {
        isMatch = true;
      }

      if (isMatch) {
        totalMatchedCount++;
        matchedProblemIds.push(prob.id);
        if (!currentSolvedIds.has(prob.id)) {
          newlyMatchedCount++;
          currentSolvedIds.add(prob.id);
        }
      }
    });

    // Save updated solved set to LocalStorage
    try {
      localStorage.setItem('prepunite_solved_problems', JSON.stringify(Array.from(currentSolvedIds)));
    } catch {}

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
      solvedSlugs,
      solvedTitles,
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
