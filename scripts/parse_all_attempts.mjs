import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function parseAllAttempts() {
  const { data: msgs } = await supabase
    .from('contact_messages')
    .select('id, subject, message, created_at')
    .like('subject', '%ATTEMPT%');

  const attempts = [];
  const mapById = new Map();

  for (const m of (msgs || [])) {
    try {
      const parsed = JSON.parse(m.message);
      if (parsed && parsed.id) {
        mapById.set(parsed.id, parsed);
      }
    } catch {}
  }

  const all = Array.from(mapById.values());
  console.log(`Total unique attempts in contact_messages: ${all.length}`);

  const submitted = all.filter(a => a.status === 'SUBMITTED' || a.status === 'GRADED' || a.status === 'TIMED_OUT' || a.status === 'TERMINATED_MALPRACTICE');
  console.log(`Completed / Submitted attempts: ${submitted.length}`);

  console.table(submitted.map(a => ({
    id: a.id,
    exam: a.mock_exam_id,
    student: a.student_email || a.student_id,
    status: a.status,
    score: a.total_score,
    max: a.max_possible_score,
    pct: a.percentage
  })));

  // Calculate unique students and averages
  const byStudent = new Map();
  submitted.forEach(a => {
    const s = (a.student_email || a.student_id || '').toLowerCase();
    if (!byStudent.has(s)) byStudent.set(s, []);
    byStudent.get(s).push(a);
  });

  console.log('\n--- BY STUDENT ---');
  byStudent.forEach((attList, s) => {
    const valid = attList.filter(a => typeof a.percentage === 'number');
    const avg = valid.reduce((acc, c) => acc + c.percentage, 0) / (valid.length || 1);
    console.log(`Student: ${s} | Completed attempts: ${attList.length} | Avg score: ${avg.toFixed(1)}%`);
  });
}
parseAllAttempts();
