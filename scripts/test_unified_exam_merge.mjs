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

async function testUnifiedMerge() {
  const collegeId = 'col-ghat-mtmuqj96';
  const now = new Date();

  // 1. Fetch DB exams
  const { data: dbExams } = await supabase
    .from('mock_exams')
    .select('*')
    .eq('college_id', collegeId)
    .or('is_deleted.is.null,is_deleted.eq.false');

  const examMap = new Map();
  (dbExams || []).forEach(e => examMap.set(e.id, e));

  // 2. Fetch cloud backup exams from contact_messages
  const { data: cloudMsgs } = await supabase
    .from('contact_messages')
    .select('id, subject, message, created_at')
    .like('subject', `%B2B_EXAM:${collegeId}%`);

  (cloudMsgs || []).forEach(m => {
    try {
      const parsed = JSON.parse(m.message);
      if (parsed && parsed.id && !examMap.has(parsed.id)) {
        examMap.set(parsed.id, parsed);
      }
    } catch {}
  });

  const allExams = Array.from(examMap.values()).filter(e => !e.is_deleted);
  console.log(`Unified Total Mock Exams: ${allExams.length}`);

  let liveCount = 0;
  let concludedCount = 0;
  let upcomingCount = 0;
  let draftCount = 0;

  allExams.forEach(e => {
    const timing = getExamTimingStatus(e, now);
    if (timing === 'LIVE') liveCount++;
    else if (timing === 'CONCLUDED') concludedCount++;
    else if (timing === 'UPCOMING') upcomingCount++;
    else draftCount++;
  });

  console.log(`- LIVE (Active): ${liveCount}`);
  console.log(`- CONCLUDED: ${concludedCount}`);
  console.log(`- UPCOMING: ${upcomingCount}`);
  console.log(`- DRAFT / INACTIVE: ${draftCount}`);

  console.table(allExams.map(e => ({
    id: e.id,
    title: e.title,
    timing: getExamTimingStatus(e, now),
    start: e.start_time,
    end: e.end_time
  })));
}

testUnifiedMerge();
