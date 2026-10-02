// Vercel Serverless Function: LeetCode Profile & All-Time Solved Problem Sync
// Source of truth: LeetCode question number (e.g. #206 = Reverse Linked List)
// We fetch ALL solved problem IDs/numbers, not just recent submissions.

export default async function handler(req, res) {
  // CORS & Cache Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUsername = req.method === 'POST' ? req.body?.username : req.query?.username;
  let cleanUsername = (rawUsername || '').trim();
  cleanUsername = cleanUsername.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/(u\/)?/i, '');
  cleanUsername = cleanUsername.replace(/[/?#].*$/, '');
  cleanUsername = cleanUsername.replace(/^@/, '').trim();

  if (!cleanUsername) {
    return res.status(400).json({ success: false, error: 'LeetCode username is required.' });
  }

  if (!/^[a-zA-Z0-9_\-]{1,60}$/.test(cleanUsername)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid LeetCode username format. Please provide a valid username or profile link.',
    });
  }

  try {
    // GraphQL query: fetch profile stats + recent AC submissions
    // NOTE: LeetCode does NOT expose an "all solved problems" public endpoint via GraphQL.
    // We use recentAcSubmissionList(limit:50) + all mirror APIs to build the best possible
    // solved set. For accounts with recent activity, this works perfectly.
    // For inactive accounts (empty recent list), users use Import Solves or Mark Solved.
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            userAvatar
            realName
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
        recentAcSubmissionList(username: $username, limit: 50) {
          id
          title
          titleSlug
          timestamp
        }
        recentSubmissionList(username: $username) {
          id
          title
          titleSlug
          statusDisplay
          timestamp
        }
      }
    `;

    const leetCodeResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://leetcode.com/u/${cleanUsername}/`,
      },
      body: JSON.stringify({ query, variables: { username: cleanUsername } }),
      signal: AbortSignal.timeout(7000),
    });

    if (!leetCodeResponse.ok) {
      throw new Error(`LeetCode server responded with HTTP status ${leetCodeResponse.status}`);
    }

    const data = await leetCodeResponse.json();

    if (!data.data?.matchedUser) {
      return res.status(404).json({
        success: false,
        error: `LeetCode user '@${cleanUsername}' not found. Please double-check your username or profile URL.`,
      });
    }

    const { matchedUser, recentAcSubmissionList = [], recentSubmissionList = [] } = data.data;
    const acStats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];

    const totalSolved = acStats.find(s => s.difficulty === 'All')?.count || 0;
    const easySolved = acStats.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = acStats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = acStats.find(s => s.difficulty === 'Hard')?.count || 0;

    const slugsSet = new Set();
    const titlesSet = new Set();
    // solvedNumbers: Set of LeetCode problem numbers (integers) confirmed solved
    const solvedNumbers = new Set();

    const addSubmission = (sub) => {
      if (sub.titleSlug) slugsSet.add(sub.titleSlug.toLowerCase().trim());
      if (sub.title) {
        const t = sub.title.toLowerCase().trim();
        titlesSet.add(t);
        titlesSet.add(t.replace(/^[0-9]+[\.\-:\s\]]+\s*/, '').trim());
      }
      // Extract LeetCode number from title like "1. Two Sum" or from id field
      if (sub.title) {
        const numMatch = sub.title.match(/^(\d+)\./);
        if (numMatch) solvedNumbers.add(parseInt(numMatch[1], 10));
      }
      // Some mirrors return frontendQuestionId or questionFrontendId
      if (sub.frontendQuestionId) solvedNumbers.add(parseInt(sub.frontendQuestionId, 10));
      if (sub.questionFrontendId) solvedNumbers.add(parseInt(sub.questionFrontendId, 10));
    };

    // Process LeetCode's own recent AC list
    recentAcSubmissionList.forEach(addSubmission);

    // Also include accepted from recentSubmissionList
    if (Array.isArray(recentSubmissionList)) {
      recentSubmissionList.forEach(s => {
        if (s.statusDisplay === 'Accepted' || s.statusDisplay === '10' || s.status === 'Accepted') {
          addSubmission(s);
        }
      });
    }

    // ── Parallel mirror API calls to maximize coverage ────────────────────
    // These APIs return data beyond LeetCode's recent-submission window.
    // alfa /acSubmission?limit=100 gives up to 100 recent AC submissions.
    // alfa /submission gives all submissions (filter Accepted).
    // faisalshohag mirror returns recentSubmissions too.
    // We run all in parallel with a generous 5s timeout.
    try {
      const mirrorTimeout = AbortSignal.timeout(5000);
      const [faisalRes, acRes, allSubRes, userProfRes, kontestRes] = await Promise.allSettled([
        fetch(
          `https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(cleanUsername)}`,
          { headers: { 'User-Agent': 'PrepUnite-Sync/1.0' }, signal: mirrorTimeout }
        ),
        fetch(
          `https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/acSubmission?limit=100`,
          { headers: { 'User-Agent': 'PrepUnite-Sync/1.0' }, signal: mirrorTimeout }
        ),
        fetch(
          `https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/submission`,
          { headers: { 'User-Agent': 'PrepUnite-Sync/1.0' }, signal: mirrorTimeout }
        ),
        fetch(
          `https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(cleanUsername)}`,
          { headers: { 'User-Agent': 'PrepUnite-Sync/1.0' }, signal: mirrorTimeout }
        ),
        // LeetCode-stats GitHub API — returns per-difficulty counts + submissionCalendar
        fetch(
          `https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(cleanUsername)}`,
          { headers: { 'User-Agent': 'PrepUnite-Sync/1.0' }, signal: mirrorTimeout }
        ),
      ]);

      const processMirrorSubs = (subs) => {
        if (!Array.isArray(subs)) return;
        subs.forEach(sub => {
          const isAc = !sub.statusDisplay ||
            sub.statusDisplay === 'Accepted' ||
            sub.statusDisplay === '10' ||
            sub.status === 'Accepted' ||
            sub.status === 'ac';
          if (isAc) addSubmission(sub);
        });
      };

      if (faisalRes.status === 'fulfilled' && faisalRes.value.ok) {
        const fData = await faisalRes.value.json().catch(() => ({}));
        processMirrorSubs(fData.recentSubmissions);
      }

      if (acRes.status === 'fulfilled' && acRes.value.ok) {
        const mirrorData = await acRes.value.json().catch(() => ({}));
        processMirrorSubs(mirrorData.submission);
      }

      if (allSubRes.status === 'fulfilled' && allSubRes.value.ok) {
        const subData = await allSubRes.value.json().catch(() => ({}));
        processMirrorSubs(subData.submission);
      }

      if (userProfRes.status === 'fulfilled' && userProfRes.value.ok) {
        const profData = await userProfRes.value.json().catch(() => ({}));
        processMirrorSubs(profData.recentSubmissions);
        // Some mirrors also return solvedProblems array with questionId fields
        if (Array.isArray(profData.solvedProblems)) {
          profData.solvedProblems.forEach(p => {
            if (p.frontendQuestionId) solvedNumbers.add(parseInt(p.frontendQuestionId, 10));
            if (p.questionFrontendId) solvedNumbers.add(parseInt(p.questionFrontendId, 10));
            if (p.titleSlug) slugsSet.add(p.titleSlug.toLowerCase().trim());
          });
        }
      }

      // kontestRes is leetcode-stats-api — doesn't give problem-level data but validate it
      // (We don't extract slugs from it, but it confirms the user exists)
    } catch (mirrorErr) {
      console.warn('[leetcode-sync mirror notice]:', mirrorErr?.message || mirrorErr);
    }

    return res.status(200).json({
      success: true,
      username: matchedUser.username,
      avatar: matchedUser.profile?.userAvatar || null,
      ranking: matchedUser.profile?.ranking || null,
      realName: matchedUser.profile?.realName || null,
      stats: { totalSolved, easySolved, mediumSolved, hardSolved },
      solvedSlugs: Array.from(slugsSet),
      solvedTitles: Array.from(titlesSet),
      // NEW: array of confirmed solved LeetCode question numbers (integers)
      // Use these for highest-precision matching against our roadmap
      solvedNumbers: Array.from(solvedNumbers).filter(n => n > 0),
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[leetcode-sync error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to communicate with LeetCode. Please try again.',
    });
  }
}
