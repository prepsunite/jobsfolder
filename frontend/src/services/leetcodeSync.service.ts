import { supabase } from '@/lib/supabase';
import { GUEST_EMAIL } from '@/contexts/AuthContext';
import { ALL_CAMPUS_DSA_PROBLEMS } from './campusDsaRoadmapData';

const LEETCODE_PROFILE_KEY = 'prepunite_leetcode_profile';
const LEETCODE_VERIFIED_KEY = 'prepunite_leetcode_verified_problems';
const PRIMARY_SOLVED_KEY = 'prepunite_solved_coding_problems';
const LEGACY_SOLVED_KEY = 'prepunite_solved_problems';

const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const stripTitlePrefix = (t: string) => t.replace(/^[0-9]+[.\-:\s\]]+\s*/, '').trim();

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
  verifiedProblemIds?: string[];
  syncedAt: string;
  verifiedCampusDsaCount: number;
}

export interface LeetCodeSyncResult {
  success: boolean;
  profile?: LeetCodeProfile;
  matchedCount?: number;
  newlyMatchedCount?: number;
  error?: string;
  isAccountSwitched?: boolean;
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

  // ─── Verified Problem IDs Storage (Tied to active LeetCode profile) ───────
  getVerifiedProblemIds(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(LEETCODE_VERIFIED_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
      const prof = this.getStoredProfile();
      if (prof?.verifiedProblemIds && Array.isArray(prof.verifiedProblemIds)) {
        return new Set(prof.verifiedProblemIds);
      }
    } catch {}
    return new Set();
  },

  saveVerifiedProblemIds(ids: string[] | Set<string>): void {
    if (typeof window === 'undefined') return;
    try {
      const arr = Array.isArray(ids) ? ids : Array.from(ids);
      localStorage.setItem(LEETCODE_VERIFIED_KEY, JSON.stringify(arr));
    } catch {}
  },

  clearVerifiedProblemIds(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(LEETCODE_VERIFIED_KEY);
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

  // ─── Clean Unlink (Disconnect) ───────────────────────────────────────────
  // Removes ALL Campus DSA progress — both LC-verified and manually marked — from
  // localStorage and Supabase. Source of truth for "solved" is the LeetCode problem
  // number (embedded in IDs like "lc-1", "lc-26", etc.), which means only LC-synced
  // or explicitly user-confirmed problems should be solved. Delink wipes the slate clean.
  unlinkAccount(userEmail?: string): void {
    // Collect ALL campus DSA problem IDs from the static roadmap
    const allCampusDsaIds = new Set(ALL_CAMPUS_DSA_PROBLEMS.map(p => p.id));

    // Remove all of them from the unified solved set
    const currentSolved = this.getSolvedSet();
    let removed = 0;
    allCampusDsaIds.forEach(id => {
      if (currentSolved.has(id)) {
        currentSolved.delete(id);
        removed++;
      }
    });

    // Always save the cleansed solved set to ensure storage consistency
    this.saveSolvedSet(currentSolved);

    // Also nuke all CAMPUS_DSA progress rows in Supabase for this user
    if (userEmail && userEmail !== GUEST_EMAIL) {
      supabase
        .from('user_technical_progress')
        .delete()
        .eq('user_email', userEmail)
        .eq('track', 'CAMPUS_DSA')
        .then(({ error }) => {
          if (error) console.warn('[leetcodeSyncService] Unlink Supabase notice:', error.message);
        });
    }

    this.clearStoredProfile();
    this.clearVerifiedProblemIds();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite-storage-update'));
    }
  },


  // ─── Fetch Raw Data from LeetCode (API with Multi-Mirror Fallback) ─────────
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
        if (json.error) {
          return { success: false, error: json.error };
        }
      }
    } catch (apiErr) {
      console.warn('[leetcodeSyncService] Primary API unreachable, attempting fast fallback mirrors:', apiErr);
    }

    // Attempt 2: Fallback to fast public mirror APIs (Faisalshohag on Vercel + Alfa on Render)
    try {
      const mirrorTimeout = AbortSignal.timeout(4500);
      const [faisalRes, alfaSolvedRes, alfaAcRes] = await Promise.allSettled([
        fetch(`https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(cleanUsername)}`, {
          signal: mirrorTimeout,
        }),
        fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/solved`, {
          signal: mirrorTimeout,
        }),
        fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/acSubmission?limit=100`, {
          signal: mirrorTimeout,
        }),
      ]);

      let totalSolved = 0;
      let easySolved = 0;
      let mediumSolved = 0;
      let hardSolved = 0;
      let ranking: number | null = null;
      let userAvatar: string | null = null;
      let userFound = false;

      const slugs = new Set<string>();
      const titles = new Set<string>();

      // Parse Faisalshohag mirror (Fast Vercel deployment)
      if (faisalRes.status === 'fulfilled' && faisalRes.value.ok) {
        const fData = await faisalRes.value.json().catch(() => ({}));
        if (fData && !fData.errors && (fData.totalSolved !== undefined || fData.matchedUserStats)) {
          userFound = true;
          totalSolved = fData.totalSolved || 0;
          easySolved = fData.easySolved || 0;
          mediumSolved = fData.mediumSolved || 0;
          hardSolved = fData.hardSolved || 0;
          ranking = fData.ranking || null;

          if (Array.isArray(fData.recentSubmissions)) {
            fData.recentSubmissions.forEach((s: any) => {
              if (s.statusDisplay === 'Accepted' || s.statusDisplay === '10' || !s.statusDisplay) {
                if (s.titleSlug) slugs.add(s.titleSlug.toLowerCase().trim());
                if (s.title) titles.add(s.title.toLowerCase().trim());
              }
            });
          }
        }
      }

      // Parse Alfa mirror as secondary
      if (alfaSolvedRes.status === 'fulfilled' && alfaSolvedRes.value.ok) {
        const aData = await alfaSolvedRes.value.json().catch(() => ({}));
        if (aData && (aData.solvedProblem !== undefined || aData.totalSolved !== undefined)) {
          userFound = true;
          if (!totalSolved) totalSolved = aData.solvedProblem || aData.totalSolved || 0;
          if (!easySolved) easySolved = aData.easySolved || 0;
          if (!mediumSolved) mediumSolved = aData.mediumSolved || 0;
          if (!hardSolved) hardSolved = aData.hardSolved || 0;
        }
      }

      if (alfaAcRes.status === 'fulfilled' && alfaAcRes.value.ok) {
        const acData = await alfaAcRes.value.json().catch(() => ({}));
        if (Array.isArray(acData.submission)) {
          acData.submission.forEach((s: any) => {
            if (s.titleSlug) slugs.add(s.titleSlug.toLowerCase().trim());
            if (s.title) titles.add(s.title.toLowerCase().trim());
          });
        }
      }

      if (!userFound) {
        return { success: false, error: `LeetCode user '@${cleanUsername}' not found. Please double-check the username.` };
      }

      return {
        success: true,
        data: {
          username: cleanUsername,
          avatar: userAvatar,
          ranking,
          stats: {
            totalSolved: totalSolved || slugs.size,
            easySolved,
            mediumSolved,
            hardSolved,
          },
          solvedSlugs: Array.from(slugs),
          solvedTitles: Array.from(titles),
          syncedAt: new Date().toISOString(),
        },
      };
    } catch (fallbackErr: any) {
      console.error('[leetcodeSyncService] Fallback also failed:', fallbackErr);
      return { success: false, error: 'Could not connect to LeetCode. Please check your internet connection and try again.' };
    }
  },

  // ─── Match Helper: Check if a Campus DSA Problem is in Solved Sets ────────
  matchesProblem(
    prob: { id: string; title: string; slug?: string; leetcodeUrl?: string; leetcodeNumber?: number },
    exactSlugs: Set<string>,
    cleanedSlugs: Set<string>,
    exactTitles: Set<string>,
    cleanedTitles: Set<string>,
    numberSet?: Set<number>
  ): boolean {
    // 0. LeetCode Problem Number Match (Highest precision)
    if (prob.leetcodeNumber && numberSet && numberSet.has(prob.leetcodeNumber)) {
      return true;
    }

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

    // 3. Exact & normalized title match (with and without question numbers)
    if (prob.title) {
      const lower = prob.title.toLowerCase().trim();
      if (exactTitles.has(lower)) return true;
      if (cleanedTitles.has(cleanStr(lower))) return true;

      const stripped = stripTitlePrefix(lower);
      if (exactTitles.has(stripped)) return true;
      if (cleanedTitles.has(cleanStr(stripped))) return true;
    }

    return false;
  },

  // ─── Import Past Solves / Quick Match Problem Numbers ─────────────────────
  importPastSolves(
    input: string,
    userEmail?: string
  ): { success: boolean; count: number; newlyAddedCount: number; matchedProblems: string[]; error?: string } {
    if (!input || !input.trim()) {
      return {
        success: false,
        count: 0,
        newlyAddedCount: 0,
        matchedProblems: [],
        error: 'Please enter at least one problem number, slug, or URL.',
      };
    }

    // Extract all problem numbers (e.g. "1, 26, 88, 283" or "LC 1" or "#1")
    const numberMatches = input.match(/\b\d+\b/g);
    const parsedNumbers = new Set<number>();
    if (numberMatches) {
      numberMatches.forEach(n => {
        const num = parseInt(n, 10);
        if (num > 0 && num < 10000) parsedNumbers.add(num);
      });
    }

    // Extract all slugs and URLs
    const tokens = input
      .split(/[\s,;\n]+/)
      .map(t => t.trim())
      .filter(Boolean);

    const slugTokens = new Set<string>();
    tokens.forEach(t => {
      const urlMatch = t.match(/leetcode\.com\/problems\/([^/?#]+)/i);
      if (urlMatch && urlMatch[1]) {
        slugTokens.add(urlMatch[1].toLowerCase());
      } else if (/^[a-z0-9-]+$/i.test(t) && !/^\d+$/.test(t)) {
        slugTokens.add(t.toLowerCase());
      }
    });

    const cleanedSlugs = new Set(Array.from(slugTokens).map(s => cleanStr(s)));

    const currentSolved = this.getSolvedSet();
    const verifiedIds = this.getVerifiedProblemIds();
    const newlyMatched: string[] = [];
    const allMatched: string[] = [];

    ALL_CAMPUS_DSA_PROBLEMS.forEach(prob => {
      const matchByNum = prob.leetcodeNumber && parsedNumbers.has(prob.leetcodeNumber);
      const matchBySlug = prob.slug && (slugTokens.has(prob.slug.toLowerCase()) || cleanedSlugs.has(cleanStr(prob.slug)));

      if (matchByNum || matchBySlug) {
        allMatched.push(prob.id);
        verifiedIds.add(prob.id);
        if (!currentSolved.has(prob.id)) {
          newlyMatched.push(prob.id);
          currentSolved.add(prob.id);
        }
      }
    });

    if (allMatched.length === 0) {
      return {
        success: false,
        count: 0,
        newlyAddedCount: 0,
        matchedProblems: [],
        error: 'None of the provided numbers or slugs matched the 150 curated Campus DSA problems. Check the problem numbers or URLs and try again.',
      };
    }

    // Update verified list and solved set
    this.saveVerifiedProblemIds(verifiedIds);
    this.saveSolvedSet(currentSolved);

    // Update stored profile
    const profile = this.getStoredProfile();
    if (profile) {
      profile.verifiedCampusDsaCount = verifiedIds.size;
      profile.verifiedProblemIds = Array.from(verifiedIds);
      this.saveStoredProfile(profile);
    }

    // Sync to Supabase if authenticated
    if (userEmail && userEmail !== GUEST_EMAIL && allMatched.length > 0) {
      const dbPayloads = allMatched.map(pId => ({
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
            if (error) console.warn('[leetcodeSyncService] Import past solves Supabase notice:', error.message);
          });
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite-storage-update'));
    }

    return {
      success: true,
      count: allMatched.length,
      newlyAddedCount: newlyMatched.length,
      matchedProblems: allMatched,
    };
  },

  // ─── Reconcile Stored Profile With Local Solved Set (Auto-fix on mount) ────
  reconcileStoredProfile(userEmail?: string): number {
    const profile = this.getStoredProfile();
    if (!profile) return 0;

    const currentSolved = this.getSolvedSet();
    const verifiedIds = this.getVerifiedProblemIds();
    let newlyAdded = 0;

    // 1. Ensure verified IDs from stored profile are reflected in solved set
    verifiedIds.forEach(id => {
      if (!currentSolved.has(id)) {
        currentSolved.add(id);
        newlyAdded++;
      }
    });

    // 2. Also match any solvedSlugs from the profile
    if (Array.isArray(profile.solvedSlugs) && profile.solvedSlugs.length > 0) {
      const exactSlugs = new Set(profile.solvedSlugs.map(s => s.toLowerCase().trim()));
      const cleanedSlugs = new Set(profile.solvedSlugs.map(s => cleanStr(s)));
      const exactTitles = new Set((profile.solvedTitles || []).map(t => t.toLowerCase().trim()));
      const cleanedTitles = new Set((profile.solvedTitles || []).map(t => cleanStr(t)));

      ALL_CAMPUS_DSA_PROBLEMS.forEach(prob => {
        if (this.matchesProblem(prob, exactSlugs, cleanedSlugs, exactTitles, cleanedTitles)) {
          verifiedIds.add(prob.id);
          if (!currentSolved.has(prob.id)) {
            currentSolved.add(prob.id);
            newlyAdded++;
          }
        }
      });
    }

    if (newlyAdded > 0) {
      this.saveVerifiedProblemIds(verifiedIds);
      this.saveSolvedSet(currentSolved);

      if (userEmail && userEmail !== GUEST_EMAIL && verifiedIds.size > 0) {
        const dbPayloads = Array.from(verifiedIds).map(pId => ({
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

    return verifiedIds.size;
  },

  // ─── Sync and Match LeetCode Solved Problems with Campus DSA ─────────────────
  // Source of truth: LeetCode problem NUMBER (e.g. #206 for Reverse Linked List).
  // Matching priority: (1) LeetCode number exact match → (2) slug → (3) title.
  // This ensures a problem is only marked solved if the actual LeetCode question
  // was solved, not just because of a name coincidence.
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
      solvedNumbers = [], // NEW: Array<number> of LeetCode question numbers confirmed solved
      syncedAt,
    } = fetchRes.data;

    const prevProfile = this.getStoredProfile();
    const isNewAccount = !prevProfile || prevProfile.username.toLowerCase() !== confirmedUsername.toLowerCase();

    // 1. Account Switch Isolation: If switching to a NEW account, remove ALL previous
    //    campus DSA solved state (both LC-verified and manually marked).
    const currentSolvedIds = this.getSolvedSet();

    if (isNewAccount) {
      const allCampusDsaIds = new Set(ALL_CAMPUS_DSA_PROBLEMS.map(p => p.id));
      allCampusDsaIds.forEach(id => currentSolvedIds.delete(id));

      if (userEmail && userEmail !== GUEST_EMAIL) {
        supabase
          .from('user_technical_progress')
          .delete()
          .eq('user_email', userEmail)
          .eq('track', 'CAMPUS_DSA')
          .then(({ error }) => {
            if (error) console.warn('[leetcodeSyncService] Old profile cleanup notice:', error.message);
          });
      }
    }

    // 2. Accumulate all evidence from previous syncs (same user only)
    const prevSlugs = !isNewAccount && Array.isArray(prevProfile?.solvedSlugs) ? prevProfile.solvedSlugs : [];
    const prevTitles = !isNewAccount && Array.isArray(prevProfile?.solvedTitles) ? prevProfile.solvedTitles : [];
    const prevNumbers: number[] = !isNewAccount && Array.isArray((prevProfile as any)?.solvedNumbers)
      ? (prevProfile as any).solvedNumbers
      : [];

    const cumulativeSlugs = Array.from(new Set([...prevSlugs, ...solvedSlugs]));
    const cumulativeTitles = Array.from(new Set([...prevTitles, ...solvedTitles]));
    const cumulativeNumbers = Array.from(new Set([...prevNumbers, ...solvedNumbers]));

    // Build normalized lookup sets
    const exactSlugs = new Set<string>(cumulativeSlugs.map((s: string) => s.toLowerCase().trim()));
    const cleanedSlugs = new Set<string>(cumulativeSlugs.map((s: string) => cleanStr(s)));
    const exactTitles = new Set<string>(cumulativeTitles.map((t: string) => t.toLowerCase().trim()));
    const cleanedTitles = new Set<string>(cumulativeTitles.map((t: string) => cleanStr(t)));
    const numberSet = new Set<number>(cumulativeNumbers.filter(n => typeof n === 'number' && n > 0));

    // Strip leading question numbers from titles (e.g. "1. Two Sum" → "Two Sum")
    cumulativeTitles.forEach((t: string) => {
      const stripped = stripTitlePrefix(t.toLowerCase().trim());
      exactTitles.add(stripped);
      cleanedTitles.add(cleanStr(stripped));
    });

    let newlyMatchedCount = 0;
    const newVerifiedIds = new Set<string>();

    // Match against all 150 Campus DSA roadmap problems
    // LeetCode number is primary key — slug and title are fallbacks
    ALL_CAMPUS_DSA_PROBLEMS.forEach(prob => {
      if (this.matchesProblem(prob, exactSlugs, cleanedSlugs, exactTitles, cleanedTitles, numberSet)) {
        newVerifiedIds.add(prob.id);
        if (!currentSolvedIds.has(prob.id)) {
          newlyMatchedCount++;
          currentSolvedIds.add(prob.id);
        }
      }
    });

    // Save updated solved set & verified IDs
    this.saveVerifiedProblemIds(newVerifiedIds);
    this.saveSolvedSet(currentSolvedIds);

    // Batch upsert to Supabase if authenticated
    const matchedProblemIds = Array.from(newVerifiedIds);
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
      verifiedProblemIds: matchedProblemIds,
      syncedAt: syncedAt || new Date().toISOString(),
      verifiedCampusDsaCount: matchedProblemIds.length,
    };
    // Store accumulated numbers on the profile (not in the interface to avoid TS changes)
    (fullProfile as any).solvedNumbers = cumulativeNumbers;

    // Store profile locally
    this.saveStoredProfile(fullProfile);

    // Notify listeners across app
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite-storage-update'));
    }

    return {
      success: true,
      profile: fullProfile,
      matchedCount: matchedProblemIds.length,
      newlyMatchedCount,
      isAccountSwitched: isNewAccount && !!prevProfile,
    };
  },
};
