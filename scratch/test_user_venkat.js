const fs = require('fs');

async function test() {
  const username = 'Venkat_c_m';
  console.log('Testing username:', username);

  // Load campus problems
  const content = fs.readFileSync('frontend/src/services/campusDsaRoadmapData.ts', 'utf8');
  const problems = [];
  const regex = /"id":\s*"(lc-[0-9]+)",\s*"leetcodeNumber":\s*([0-9]+),\s*"title":\s*"([^"]+)",\s*"slug":\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    problems.push({
      id: match[1],
      leetcodeNumber: parseInt(match[2]),
      title: match[3],
      slug: match[4]
    });
  }

  // 1. Direct LeetCode GraphQL
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile { ranking userAvatar realName }
        submitStatsGlobal { acSubmissionNum { difficulty count } }
      }
      recentAcSubmissionList(username: $username, limit: 50) {
        id title titleSlug timestamp
      }
      recentSubmissionList(username: $username) {
        id title titleSlug statusDisplay timestamp
      }
    }
  `;

  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': `https://leetcode.com/u/${username}/`,
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  const data = await res.json();
  console.log('LeetCode GraphQL matchedUser:', data.data?.matchedUser?.username);
  console.log('acSubmissionNum:', data.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum);
  console.log('recentAcSubmissionList length:', data.data?.recentAcSubmissionList?.length);
  console.log('recentAcSubmissionList:', data.data?.recentAcSubmissionList);
  console.log('recentSubmissionList length:', data.data?.recentSubmissionList?.length);
  console.log('recentSubmissionList:', data.data?.recentSubmissionList);

  // 2. Also test Faisalshohag mirror
  try {
    const fRes = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
    const fData = await fRes.json();
    console.log('Faisal mirror totalSolved:', fData.totalSolved);
    console.log('Faisal mirror recentSubmissions length:', fData.recentSubmissions?.length);
    console.log('Faisal mirror recentSubmissions:', fData.recentSubmissions);
  } catch(e) {
    console.log('Faisal mirror err:', e.message);
  }

  // 3. Also test Alfa mirror
  try {
    const aRes = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/acSubmission?limit=100`);
    const aData = await aRes.json();
    console.log('Alfa mirror acSubmission length:', aData.submission?.length);
    console.log('Alfa mirror acSubmission:', aData.submission);
  } catch(e) {
    console.log('Alfa mirror err:', e.message);
  }
}

test();
