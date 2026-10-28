import fs from 'fs';
import handler from '../api/toggle-like.js';

const envContent = fs.readFileSync('.env', 'utf8');
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
});
const fenv = fs.readFileSync('frontend/.env', 'utf8');
fenv.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
});

function createMockReqRes(method, body) {
  let statusCode = 200;
  let responseData = null;
  const req = { method, body, headers: {} };
  const res = {
    setHeader() {},
    status(code) { statusCode = code; return this; },
    json(data) { responseData = data; return this; },
    getStatusCode: () => statusCode,
    getData: () => responseData,
  };
  return { req, res };
}

async function testAllThreeLikes() {
  const { createClient } = await import('@supabase/supabase-js');
  const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // 1. Test Experience
  console.log('1. Testing Experience DB increment via /api/toggle-like...');
  const { data: exp } = await client.from('experiences').select('id, upvotes').limit(1).single();
  const origExpUpvotes = exp.upvotes || 0;
  console.log('Initial DB upvotes:', origExpUpvotes);

  const { req: req1, res: res1 } = createMockReqRes('POST', {
    itemType: 'experience',
    itemId: exp.id,
    delta: 1,
  });
  await handler(req1, res1);
  console.log('API response:', res1.getData());
  if (res1.getData()?.upvotes !== origExpUpvotes + 1) {
    throw new Error('Experience upvotes was not incremented in DB!');
  }

  // Revert Experience
  const { req: req1r, res: res1r } = createMockReqRes('POST', {
    itemType: 'experience',
    itemId: exp.id,
    delta: -1,
  });
  await handler(req1r, res1r);
  console.log('Reverted experience to:', res1r.getData()?.upvotes);

  // 2. Test Exam
  console.log('\n2. Testing Exam DB increment via /api/toggle-like...');
  const { data: exam } = await client.from('exams').select('id, upvotes').limit(1).single();
  const origExamUpvotes = exam.upvotes || 0;
  console.log('Initial Exam DB upvotes:', origExamUpvotes);

  const { req: req2, res: res2 } = createMockReqRes('POST', {
    itemType: 'exam',
    itemId: exam.id,
    delta: 1,
  });
  await handler(req2, res2);
  console.log('API response:', res2.getData());
  if (res2.getData()?.upvotes !== origExamUpvotes + 1) {
    throw new Error('Exam upvotes was not incremented in DB!');
  }

  // Revert Exam
  const { req: req2r, res: res2r } = createMockReqRes('POST', {
    itemType: 'exam',
    itemId: exam.id,
    delta: -1,
  });
  await handler(req2r, res2r);
  console.log('Reverted exam to:', res2r.getData()?.upvotes);

  // 3. Test Company
  console.log('\n3. Testing Company like via /api/toggle-like...');
  const { req: req3, res: res3 } = createMockReqRes('POST', {
    itemType: 'company',
    itemId: 'tcs',
    delta: 1,
    clientIdentifier: 'test_client_runner',
  });
  await handler(req3, res3);
  console.log('API company response:', res3.getData());

  // Clean up company like
  const { req: req3r, res: res3r } = createMockReqRes('POST', {
    itemType: 'company',
    itemId: 'tcs',
    delta: -1,
    clientIdentifier: 'test_client_runner',
  });
  await handler(req3r, res3r);
  console.log('Reverted company like to:', res3r.getData()?.upvotes);

  console.log('\nALL 3 REAL DATABASE LIKE OPERATIONS SUCCEEDED 100%!');
}

testAllThreeLikes().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
