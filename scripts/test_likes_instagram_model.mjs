import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
let anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if ((!url || !serviceKey) && fs.existsSync('frontend/.env')) {
  const fenv = fs.readFileSync('frontend/.env', 'utf8');
  const urlMatch = fenv.match(/VITE_SUPABASE_URL=([^\r\n]+)/);
  const anonMatch = fenv.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/);
  if (urlMatch) url = urlMatch[1].trim().replace(/^['"]|['"]$/g, '');
  if (anonMatch) anonKey = anonMatch[1].trim().replace(/^['"]|['"]$/g, '');
}

if ((!serviceKey) && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/);
  if (match) serviceKey = match[1].trim().replace(/^['"]|['"]$/g, '');
}

if (!url || !serviceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

process.env.SUPABASE_URL = url;
process.env.SUPABASE_SERVICE_ROLE_KEY = serviceKey;
process.env.VITE_SUPABASE_URL = url;
process.env.VITE_SUPABASE_ANON_KEY = anonKey;

const supabaseAdmin = createClient(url, serviceKey);

async function runTests() {
  console.log('--- STARTING MULTI-USER INSTAGRAM LIKE VERIFICATION ---');

  const { default: handler } = await import('../api/toggle-like.js');

  const userA = 'simulated_user_a@test.com';
  const userB = 'simulated_user_b@test.com';

  // Helper to call handler
  const callApi = async (method, bodyOrQuery) => {
    let resCode = 200;
    let resData = null;
    const req = {
      method,
      query: method === 'GET' ? bodyOrQuery : {},
      body: method === 'POST' ? bodyOrQuery : {},
    };
    const res = {
      setHeader: () => {},
      status: (code) => {
        resCode = code;
        return {
          json: (data) => {
            resData = data;
          },
        };
      },
    };
    await handler(req, res);
    return { status: resCode, data: resData };
  };

  // ========================================================
  // TEST 1: COMPANY LIKES (GLOBAL COUNT ACROSS MULTIPLE USERS)
  // ========================================================
  console.log('\n[1] Testing Company Likes Across Multiple Users...');
  const initialGet = await callApi('GET', {});
  const tcsInitialLikes = initialGet.data.companyLikes['tcs'];
  console.log(`Initial global TCS likes: ${tcsInitialLikes}`);

  // User A likes TCS
  const userALikeTcs = await callApi('POST', {
    itemType: 'company',
    itemId: 'tcs',
    delta: 1,
    userEmail: userA,
  });
  console.log(`User A liked TCS -> New count: ${userALikeTcs.data.upvotes}`);
  if (userALikeTcs.data.upvotes !== tcsInitialLikes + 1) {
    throw new Error(`Expected ${tcsInitialLikes + 1}, got ${userALikeTcs.data.upvotes}`);
  }

  // User B queries global likes
  const userBGet = await callApi('GET', { userEmail: userB });
  const tcsSeenByUserB = userBGet.data.companyLikes['tcs'];
  console.log(`User B sees TCS likes: ${tcsSeenByUserB}`);
  if (tcsSeenByUserB !== tcsInitialLikes + 1) {
    throw new Error(`User B should see ${tcsInitialLikes + 1}, but saw ${tcsSeenByUserB}`);
  }
  // User B's own like state should be FALSE
  if (userBGet.data.userLiked.companies.includes('tcs')) {
    throw new Error(`User B should NOT have liked TCS yet!`);
  }

  // User B now ALSO likes TCS
  const userBLikeTcs = await callApi('POST', {
    itemType: 'company',
    itemId: 'tcs',
    delta: 1,
    userEmail: userB,
  });
  console.log(`User B liked TCS -> New count: ${userBLikeTcs.data.upvotes}`);
  if (userBLikeTcs.data.upvotes !== tcsInitialLikes + 2) {
    throw new Error(`Expected ${tcsInitialLikes + 2}, got ${userBLikeTcs.data.upvotes}`);
  }

  // User A unlikes TCS
  const userAUnlikeTcs = await callApi('POST', {
    itemType: 'company',
    itemId: 'tcs',
    delta: -1,
    userEmail: userA,
  });
  console.log(`User A unliked TCS -> New count: ${userAUnlikeTcs.data.upvotes}`);
  if (userAUnlikeTcs.data.upvotes !== tcsInitialLikes + 1) {
    throw new Error(`Expected ${tcsInitialLikes + 1}, got ${userAUnlikeTcs.data.upvotes}`);
  }

  // Clean up User B
  await callApi('POST', {
    itemType: 'company',
    itemId: 'tcs',
    delta: -1,
    userEmail: userB,
  });
  console.log('✓ Company Likes Instagram Model PASSED!');

  // ========================================================
  // TEST 2: EXAM LIKES (POSTGRES DATABASE ATOMIC PERSISTENCE)
  // ========================================================
  console.log('\n[2] Testing Exam Likes in PostgreSQL...');
  const { data: testExam } = await supabaseAdmin.from('exams').select('id, name, upvotes').limit(1).single();
  const initialExamUpvotes = testExam.upvotes || 0;
  console.log(`Exam "${testExam.name}" initial upvotes: ${initialExamUpvotes}`);

  // User A likes exam
  const examLikeRes = await callApi('POST', {
    itemType: 'exam',
    itemId: testExam.id,
    delta: 1,
    userEmail: userA,
  });
  console.log(`User A liked exam -> DB returned: ${examLikeRes.data.upvotes}`);
  if (examLikeRes.data.upvotes !== initialExamUpvotes + 1) {
    throw new Error(`Expected ${initialExamUpvotes + 1}, got ${examLikeRes.data.upvotes}`);
  }

  // Re-read directly from PostgreSQL table to verify actual database row changed
  const { data: dbExamAfter } = await supabaseAdmin.from('exams').select('upvotes').eq('id', testExam.id).single();
  if (dbExamAfter.upvotes !== initialExamUpvotes + 1) {
    throw new Error(`Direct DB verification failed! Expected ${initialExamUpvotes + 1}, got ${dbExamAfter.upvotes}`);
  }
  console.log(`Direct PostgreSQL check verified: ${dbExamAfter.upvotes}`);

  // User A unlikes exam
  const examUnlikeRes = await callApi('POST', {
    itemType: 'exam',
    itemId: testExam.id,
    delta: -1,
    userEmail: userA,
  });
  console.log(`User A unliked exam -> DB returned: ${examUnlikeRes.data.upvotes}`);
  if (examUnlikeRes.data.upvotes !== initialExamUpvotes) {
    throw new Error(`Expected ${initialExamUpvotes}, got ${examUnlikeRes.data.upvotes}`);
  }
  console.log('✓ Exam Likes PostgreSQL Persistence PASSED!');

  // ========================================================
  // TEST 3: EXPERIENCE LIKES (HELPFUL BUTTON ACROSS USERS)
  // ========================================================
  console.log('\n[3] Testing Experience Upvotes in PostgreSQL...');
  // Create an isolated PENDING experience so trigger invariants permit like testing
  const { data: testExp, error: createExpErr } = await supabaseAdmin
    .from('experiences')
    .insert({
      company_slug: 'instagram-test-co',
      company_name: 'Instagram Test Co',
      role_title: 'Software Engineer',
      student_name: 'Test Student',
      college: 'Apex Engineering College',
      year: 2026,
      difficulty: 'MEDIUM',
      verdict: 'SELECTED',
      status: 'PENDING',
      upvotes: 10,
      is_deleted: false,
    })
    .select('id, company_name, upvotes, status')
    .single();

  if (createExpErr || !testExp) {
    throw new Error('Failed to create test experience: ' + (createExpErr?.message || 'unknown'));
  }

  const initialExpUpvotes = testExp.upvotes || 0;
  console.log(`Experience "${testExp.company_name}" initial helpful count: ${initialExpUpvotes}`);

  // User A likes experience
  const expLikeRes = await callApi('POST', {
    itemType: 'experience',
    itemId: testExp.id,
    delta: 1,
    userEmail: userA,
  });
  console.log(`User A upvoted experience -> Returned: ${expLikeRes.data.upvotes}`);
  if (expLikeRes.data.upvotes !== initialExpUpvotes + 1) {
    throw new Error(`Expected ${initialExpUpvotes + 1}, got ${expLikeRes.data.upvotes}`);
  }

  // User B queries what User B has liked
  const userBExpQuery = await callApi('GET', { userEmail: userB });
  if (userBExpQuery.data.userLiked.experiences.includes(testExp.id)) {
    throw new Error(`User B should not have marked experience as helpful!`);
  }

  // User A queries what User A has liked
  const userAExpQuery = await callApi('GET', { userEmail: userA });
  if (!userAExpQuery.data.userLiked.experiences.includes(testExp.id)) {
    throw new Error(`User A should have this experience in their userLiked list!`);
  }
  console.log('User A experience like correctly returned in userLiked set!');

  // User A unlikes experience
  const expUnlikeRes = await callApi('POST', {
    itemType: 'experience',
    itemId: testExp.id,
    delta: -1,
    userEmail: userA,
  });
  console.log(`User A removed upvote -> Returned: ${expUnlikeRes.data.upvotes}`);
  if (expUnlikeRes.data.upvotes !== initialExpUpvotes) {
    throw new Error(`Expected ${initialExpUpvotes}, got ${expUnlikeRes.data.upvotes}`);
  }

  // Clean up temporary test experience
  await supabaseAdmin.from('experiences').delete().eq('id', testExp.id);
  console.log('✓ Experience Likes Multi-User Verification PASSED!');

  console.log('\n========================================');
  console.log('VERDICT: PASS - ALL LIKE INVARIANTS VERIFIED');
  console.log('========================================');
}

runTests().catch((err) => {
  console.error('\nVERDICT: FAIL -', err);
  process.exit(1);
});
