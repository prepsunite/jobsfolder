import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

function getExamTimingStatus(exam, referenceDate = new Date()) {
  if (exam.is_deleted || exam.is_active === false) {
    return 'DRAFT';
  }
  if (exam.id && (exam.id.startsWith('exam_verify_') || exam.id.startsWith('test_'))) {
    return 'DRAFT';
  }
  if (!exam.start_time && !exam.end_time) {
    return 'DRAFT';
  }
  const nowMs = referenceDate.getTime();
  if (exam.start_time) {
    const startMs = new Date(exam.start_time).getTime();
    if (Number.isFinite(startMs) && startMs > nowMs) {
      return 'UPCOMING';
    }
  }
  if (exam.end_time) {
    const endMs = new Date(exam.end_time).getTime();
    if (Number.isFinite(endMs) && endMs <= nowMs) {
      return 'CONCLUDED';
    }
  } else if (exam.start_time && exam.duration_minutes) {
    const startMs = new Date(exam.start_time).getTime();
    const endMs = startMs + exam.duration_minutes * 60 * 1000;
    if (Number.isFinite(endMs) && endMs <= nowMs) {
      return 'CONCLUDED';
    }
  }
  return 'LIVE';
}

async function runVerification() {
  console.log('====================================================');
  console.log('TPO & STUDENT REAL DATA VERIFICATION AUDIT');
  console.log('====================================================\n');

  const collegeId = 'col-ghat-mtmuqj96';
  const now = new Date();

  // 1. Fetch colleges
  const { data: colleges } = await supabase.from('colleges').select('*').eq('id', collegeId);
  const college = colleges?.[0];
  console.log('1. Target College:', { id: college?.id, name: college?.name, code: college?.code, max_licenses: college?.max_licenses });

  // 2. Fetch enrolled students from college_students
  const { data: students } = await supabase
    .from('college_students')
    .select('*')
    .eq('college_id', collegeId);
  console.log(`2. college_students count in DB: ${students?.length}`);
  students?.forEach(s => console.log(`   - Student: ${s.email} (Role: ${s.role}, is_tpo_admin: ${s.is_tpo_admin})`));

  // 3. Fetch TPO authorizations
  const { data: auths } = await supabase
    .from('tpo_authorizations')
    .select('*')
    .eq('college_id', collegeId)
    .eq('status', 'ACTIVE');
  console.log(`3. Active TPO Authorizations in DB: ${auths?.length}`);
  auths?.forEach(a => console.log(`   - TPO Coordinator: ${a.email} (${a.status})`));

  // 4. Fetch all mock exams (DB + Cloud backup)
  const { data: dbExams } = await supabase
    .from('mock_exams')
    .select('*')
    .eq('college_id', collegeId)
    .or('is_deleted.is.null,is_deleted.eq.false');

  const examMap = new Map();
  (dbExams || []).forEach(e => examMap.set(e.id, e));

  const { data: cloudMsgs } = await supabase
    .from('contact_messages')
    .select('message')
    .like('subject', `%B2B_EXAM:${collegeId}%`)
    .neq('status', 'DELETED');

  (cloudMsgs || []).forEach(m => {
    try {
      const parsed = JSON.parse(m.message);
      if (parsed && parsed.id && !examMap.has(parsed.id)) {
        examMap.set(parsed.id, parsed);
      }
    } catch {}
  });

  const allExams = Array.from(examMap.values()).filter(e => !e.is_deleted);
  const validDrives = allExams.filter(e => !e.id.startsWith('exam_verify_') && !e.id.startsWith('test_'));

  let liveCount = 0;
  let concludedCount = 0;
  let upcomingCount = 0;
  let draftCount = 0;

  validDrives.forEach(e => {
    const timing = getExamTimingStatus(e, now);
    if (timing === 'LIVE') liveCount++;
    else if (timing === 'CONCLUDED') concludedCount++;
    else if (timing === 'UPCOMING') upcomingCount++;
    else draftCount++;
  });

  console.log(`\n4. Mock Drives Breakdown (Total Valid Drives: ${validDrives.length}):`);
  console.log(`   - LIVE (Active sessions right now): ${liveCount}`);
  console.log(`   - CONCLUDED: ${concludedCount}`);
  console.log(`   - UPCOMING: ${upcomingCount}`);
  console.log(`   - DRAFT / TEST ARTIFACTS: ${draftCount}`);

  // Print all live exams
  console.log('\n   Active / Live Drives List:');
  validDrives.filter(e => getExamTimingStatus(e, now) === 'LIVE').forEach(e => {
    console.log(`     * [LIVE] "${e.title}" (End: ${e.end_time})`);
  });

  // 5. Test RPC get_colleges_usage_summary
  const { data: rpcUsage, error: rpcErr } = await supabase.rpc('get_colleges_usage_summary');
  const ghatUsage = rpcUsage?.find(r => r.college_id === collegeId);
  console.log('\n5. RPC get_colleges_usage_summary for Ghatkopar:');
  console.log('   - enrolled_count:', ghatUsage?.enrolled_count);

  // Assertions
  const assertions = [
    { name: 'Enrolled students count strictly equals 1', pass: students?.length === 1 && ghatUsage?.enrolled_count === 1 },
    { name: 'TPO Coordinator (scalercorp@gmail.com) active and excluded from student list', pass: auths?.some(a => a.email === 'scalercorp@gmail.com') && !students?.some(s => s.email === 'scalercorp@gmail.com') },
    { name: 'Live active mock exams count equals 4', pass: liveCount === 4 },
    { name: 'Concluded mock exams count equals 14', pass: concludedCount === 14 },
    { name: 'Test verification artifact classified as DRAFT', pass: getExamTimingStatus({ id: 'exam_verify_1792076294554', is_active: true }) === 'DRAFT' },
  ];

  console.log('\n====================================================');
  console.log('VERIFICATION ASSERTIONS:');
  console.log('====================================================');
  let allPass = true;
  for (const a of assertions) {
    console.log(`[${a.pass ? 'PASS' : 'FAIL'}] ${a.name}`);
    if (!a.pass) allPass = false;
  }

  if (allPass) {
    console.log('\nOVERALL VERDICT: ALL CONTRACTS SATISFIED (PASS)');
  } else {
    console.error('\nOVERALL VERDICT: ONE OR MORE ASSERTIONS FAILED');
    process.exit(1);
  }
}

runVerification();
