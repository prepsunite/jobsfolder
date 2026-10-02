// Vercel Serverless Function: LeetCode Profile & Solved Problems Synchronization API

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
  // Robust username extraction from raw input (supports plain handles, @handles, or full leetcode profile URLs)
  let cleanUsername = (rawUsername || '').trim();
  cleanUsername = cleanUsername.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/(u\/)?/i, '');
  cleanUsername = cleanUsername.replace(/[/?#].*$/, '');
  cleanUsername = cleanUsername.replace(/^@/, '').trim();

  if (!cleanUsername) {
    return res.status(400).json({ success: false, error: 'LeetCode username is required.' });
  }

  // Sanitize username (alphanumeric, dashes, underscores up to 60 chars)
  if (!/^[a-zA-Z0-9_\-]{1,60}$/.test(cleanUsername)) {
    return res.status(400).json({ success: false, error: 'Invalid LeetCode username format. Please provide a valid username or profile link.' });
  }

  try {
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
      body: JSON.stringify({
        query,
        variables: { username: cleanUsername },
      }),
      signal: AbortSignal.timeout(6000),
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

    const slugsSet = new Set(
      recentAcSubmissionList.map(s => s.titleSlug.toLowerCase().trim())
    );
    const titlesSet = new Set(
      recentAcSubmissionList.map(s => s.title.toLowerCase().trim())
    );

    // Also include accepted submissions from recentSubmissionList
    if (Array.isArray(recentSubmissionList)) {
      recentSubmissionList.forEach(s => {
        if (s.statusDisplay === 'Accepted' || s.statusDisplay === '10' || s.status === 'Accepted') {
          if (s.titleSlug) slugsSet.add(s.titleSlug.toLowerCase().trim());
          if (s.title) {
            const t = s.title.toLowerCase().trim();
            titlesSet.add(t);
            titlesSet.add(t.replace(/^[0-9]+[.\-:\s\]]+\s*/, '').trim());
          }
        }
      });
    }

    // Attempt secondary lookup from public mirrors with 3.5s timeout (never blocks if sleeping)
    try {
      const mirrorTimeout = AbortSignal.timeout(3500);
      const [faisalRes, acRes, allSubRes, userProfRes] = await Promise.allSettled([
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
      ]);

      if (faisalRes.status === 'fulfilled' && faisalRes.value.ok) {
        const fData = await faisalRes.value.json().catch(() => ({}));
        if (Array.isArray(fData.recentSubmissions)) {
          fData.recentSubmissions.forEach(sub => {
            if (sub.statusDisplay === 'Accepted' || sub.statusDisplay === '10' || !sub.statusDisplay) {
              if (sub.titleSlug) slugsSet.add(sub.titleSlug.toLowerCase().trim());
              if (sub.title) {
                const t = sub.title.toLowerCase().trim();
                titlesSet.add(t);
                titlesSet.add(t.replace(/^[0-9]+[.\-:\s\]]+\s*/, '').trim());
              }
            }
          });
        }
      }

      if (acRes.status === 'fulfilled' && acRes.value.ok) {
        const mirrorData = await acRes.value.json().catch(() => ({}));
        if (Array.isArray(mirrorData.submission)) {
          mirrorData.submission.forEach(sub => {
            if (sub.titleSlug) slugsSet.add(sub.titleSlug.toLowerCase().trim());
            if (sub.title) {
              const t = sub.title.toLowerCase().trim();
              titlesSet.add(t);
              titlesSet.add(t.replace(/^[0-9]+[.\-:\s\]]+\s*/, '').trim());
            }
          });
        }
      }

      if (allSubRes.status === 'fulfilled' && allSubRes.value.ok) {
        const subData = await allSubRes.value.json().catch(() => ({}));
        if (Array.isArray(subData.submission)) {
          subData.submission.forEach(sub => {
            if (sub.statusDisplay === 'Accepted') {
              if (sub.titleSlug) slugsSet.add(sub.titleSlug.toLowerCase().trim());
              if (sub.title) {
                const t = sub.title.toLowerCase().trim();
                titlesSet.add(t);
                titlesSet.add(t.replace(/^[0-9]+[.\-:\s\]]+\s*/, '').trim());
              }
            }
          });
        }
      }

      if (userProfRes.status === 'fulfilled' && userProfRes.value.ok) {
        const profData = await userProfRes.value.json().catch(() => ({}));
        if (Array.isArray(profData.recentSubmissions)) {
          profData.recentSubmissions.forEach(sub => {
            if (sub.statusDisplay === 'Accepted') {
              if (sub.titleSlug) slugsSet.add(sub.titleSlug.toLowerCase().trim());
              if (sub.title) {
                const t = sub.title.toLowerCase().trim();
                titlesSet.add(t);
                titlesSet.add(t.replace(/^[0-9]+[.\-:\s\]]+\s*/, '').trim());
              }
            }
          });
        }
      }
    } catch (mirrorErr) {
      console.warn('[leetcode-sync mirror notice]:', mirrorErr.message);
    }

    return res.status(200).json({
      success: true,
      username: matchedUser.username,
      avatar: matchedUser.profile?.userAvatar || null,
      ranking: matchedUser.profile?.ranking || null,
      realName: matchedUser.profile?.realName || null,
      stats: {
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
      },
      solvedSlugs: Array.from(slugsSet),
      solvedTitles: Array.from(titlesSet),
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
