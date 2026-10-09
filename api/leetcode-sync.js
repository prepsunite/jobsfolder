import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function: LeetCode Profile & Problem Sync
// Queries official LeetCode GraphQL API exclusively.
// Enforces Supabase JWT session authentication to prevent open scraping proxy & SSRF.

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Server configuration missing.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Mandatory Session Authentication (Prevents Open Scraping Proxy) [P1-01]
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to sync LeetCode profiles.',
      });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user?.email) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired user session.',
      });
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
        error: 'Invalid LeetCode username format. Please provide a valid username.',
      });
    }

    // 2. Direct Query to Official LeetCode GraphQL (Eliminates untrusted third-party mirrors) [P1-01]
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
      }
    `;

    const leetCodeResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PrepUnite-Sync/2.0',
        'Referer': `https://leetcode.com/u/${cleanUsername}/`,
      },
      body: JSON.stringify({ query, variables: { username: cleanUsername } }),
      signal: AbortSignal.timeout(8000),
    });

    if (!leetCodeResponse.ok) {
      return res.status(502).json({
        success: false,
        error: `LeetCode responded with HTTP status ${leetCodeResponse.status}.`,
      });
    }

    const data = await leetCodeResponse.json();

    if (!data.data?.matchedUser) {
      return res.status(404).json({
        success: false,
        error: `LeetCode user '@${cleanUsername}' not found. Please double-check your username or profile URL.`,
      });
    }

    const { matchedUser, recentAcSubmissionList = [] } = data.data;
    const acStats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];

    const totalSolved = acStats.find((s) => s.difficulty === 'All')?.count || 0;
    const easySolved = acStats.find((s) => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = acStats.find((s) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = acStats.find((s) => s.difficulty === 'Hard')?.count || 0;

    const slugsSet = new Set();
    const titlesSet = new Set();
    const solvedNumbers = new Set();

    recentAcSubmissionList.forEach((sub) => {
      if (sub.titleSlug) slugsSet.add(sub.titleSlug.toLowerCase().trim());
      if (sub.title) {
        const t = sub.title.toLowerCase().trim();
        titlesSet.add(t);
        titlesSet.add(t.replace(/^[0-9]+[\.\-:\s\]]+\s*/, '').trim());
        const numMatch = sub.title.match(/^(\d+)\./);
        if (numMatch) solvedNumbers.add(parseInt(numMatch[1], 10));
      }
      if (sub.frontendQuestionId) solvedNumbers.add(parseInt(sub.frontendQuestionId, 10));
    });

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
      solvedNumbers: Array.from(solvedNumbers),
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[api/leetcode-sync] Error:', error?.message || 'Unknown error');
    return res.status(500).json({
      success: false,
      error: 'Failed to communicate with LeetCode. Please try again shortly.',
    });
  }
}
