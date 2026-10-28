import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/);
const fenv = fs.readFileSync('frontend/.env', 'utf8');
const urlMatch = fenv.match(/VITE_SUPABASE_URL=([^\r\n]+)/);
const anonMatch = fenv.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/);

const supabaseUrl = urlMatch[1].trim();
const serviceKey = match[1].trim();
const anonKey = anonMatch[1].trim();

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function testToggleLike() {
  console.log('1. Testing Experience DB Update via Admin Auth...');
  const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: 'venkatmukala9@gmail.com',
  });
  if (linkErr) throw linkErr;

  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data: sessionData, error: sessionErr } = await authClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  if (sessionErr) throw sessionErr;

  const adminClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${sessionData.session.access_token}` } },
  });

  const { data: exp } = await supabaseAdmin.from('experiences').select('id, upvotes').limit(1).single();
  const originalUpvotes = exp.upvotes || 0;
  console.log('Original DB upvotes for experience:', originalUpvotes);

  // Increment in DB
  const { data: incData, error: incErr } = await adminClient
    .from('experiences')
    .update({ upvotes: originalUpvotes + 1 })
    .eq('id', exp.id)
    .select('id, upvotes')
    .single();

  if (incErr) throw incErr;
  console.log('Successfully incremented DB upvotes to:', incData.upvotes);

  // Read back directly from Supabase (simulating a fresh incognito visitor!)
  const { data: freshExp } = await supabaseAdmin.from('experiences').select('id, upvotes').eq('id', exp.id).single();
  console.log('Fresh incognito read from Supabase:', freshExp.upvotes);
  if (freshExp.upvotes !== originalUpvotes + 1) {
    throw new Error('Fresh read did not match incremented value!');
  }

  // Revert
  await adminClient.from('experiences').update({ upvotes: originalUpvotes }).eq('id', exp.id);
  console.log('Reverted experience upvotes to original.');

  // 2. Testing Exam DB Update
  console.log('\n2. Testing Exam DB Update via Service Client...');
  const { data: exam } = await supabaseAdmin.from('exams').select('id, upvotes').limit(1).single();
  const origExamUpvotes = exam.upvotes || 0;
  console.log('Original DB upvotes for exam:', origExamUpvotes);

  const { data: updatedExam, error: examErr } = await supabaseAdmin
    .from('exams')
    .update({ upvotes: origExamUpvotes + 1 })
    .eq('id', exam.id)
    .select('id, upvotes')
    .single();
  if (examErr) throw examErr;
  console.log('Successfully incremented exam upvotes in DB to:', updatedExam.upvotes);

  // Revert exam
  await supabaseAdmin.from('exams').update({ upvotes: origExamUpvotes }).eq('id', exam.id);
  console.log('Reverted exam upvotes to original.');

  // 3. Testing Company Like in user_bookmarks
  console.log('\n3. Testing Company Like in user_bookmarks...');
  const companySlug = 'tcs-test-slug';
  const { data: bm, error: bmErr } = await supabaseAdmin.from('user_bookmarks').insert({
    item_type: 'company_like',
    item_id: companySlug,
    user_email: 'anon_client_test@mockfolder.com',
  }).select('*').single();

  if (bmErr) throw bmErr;
  console.log('Inserted company like in DB with id:', bm.id);

  const { count: compLikes } = await supabaseAdmin
    .from('user_bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('item_type', 'company_like')
    .eq('item_id', companySlug);
  console.log('Live DB count of company likes:', compLikes);

  // Clean up
  await supabaseAdmin.from('user_bookmarks').delete().eq('id', bm.id);
  console.log('Cleaned up company like in DB.');

  console.log('\nALL SERVER DATABASE UPVOTE & LIKE TESTS PASSED 100%!');
}

testToggleLike().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
