import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectRealData() {
  console.log('=== COLLEGES ===');
  const { data: colleges, error: cErr } = await supabase.from('colleges').select('*');
  if (cErr) console.error('Colleges error:', cErr);
  else console.table(colleges?.map(c => ({ id: c.id, name: c.name, code: c.code, max_licenses: c.max_licenses })));

  console.log('\n=== MOCK EXAMS ===');
  const { data: exams, error: eErr } = await supabase.from('mock_exams').select('id, title, college_id, is_active, is_deleted, start_time, end_time, total_marks');
  if (eErr) console.error('Exams error:', eErr);
  else console.table(exams);

  console.log('\n=== COLLEGE STUDENTS ===');
  const { data: students, error: sErr } = await supabase.from('college_students').select('*');
  if (sErr) console.error('Students error:', sErr);
  else console.table(students?.map(s => ({ id: s.id, college_id: s.college_id, email: s.email, name: s.name, status: s.status })));

  console.log('\n=== STUDENT EXAM ATTEMPTS ===');
  const { data: attempts, error: aErr } = await supabase.from('student_exam_attempts').select('id, mock_exam_id, student_email, student_id, college_id, status, total_score, max_possible_score, percentage');
  if (aErr) console.error('Attempts error:', aErr);
  else console.table(attempts);

  // Also check RPC get_college_placement_analytics
  if (colleges && colleges.length > 0) {
    for (const c of colleges) {
      console.log(`\n=== RPC get_college_placement_analytics for ${c.name} (${c.id}) ===`);
      const { data: rpcStats, error: rpcErr } = await supabase.rpc('get_college_placement_analytics', {
        p_college_id: c.id
      });
      if (rpcErr) console.error('RPC Error:', rpcErr.message);
      else console.log('RPC Result:', JSON.stringify(rpcStats, null, 2));
    }
  }
}

inspectRealData();
