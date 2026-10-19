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

async function testTiming() {
  const { data: exams } = await supabase.from('mock_exams').select('*').eq('college_id', 'col-ghat-mtmuqj96');
  console.log('Current Date in Node:', new Date().toISOString());
  for (const e of exams) {
    console.log(`Exam: ${e.title} | start: ${e.start_time} | end: ${e.end_time} | status: ${getExamTimingStatus(e)}`);
  }
}
testTiming();
