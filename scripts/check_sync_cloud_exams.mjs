import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkSyncCloudExams() {
  const { data: cloudExams } = await supabase
    .from('contact_messages')
    .select('id, subject, message, created_at')
    .like('subject', '%B2B_EXAM:col-ghat-mtmuqj96%');

  const { data: dbExams } = await supabase
    .from('mock_exams')
    .select('id')
    .eq('college_id', 'col-ghat-mtmuqj96');

  const dbExamIds = new Set((dbExams || []).map(e => e.id));
  console.log(`Exams currently in mock_exams table: ${dbExamIds.size}`);

  const cloudMap = new Map();
  for (const m of (cloudExams || [])) {
    try {
      const parsed = JSON.parse(m.message);
      if (parsed && parsed.id) {
        cloudMap.set(parsed.id, parsed);
      }
    } catch {}
  }

  console.log(`Unique exams in contact_messages backup: ${cloudMap.size}`);

  const missingInDb = [];
  cloudMap.forEach((exam, id) => {
    if (!dbExamIds.has(id)) {
      missingInDb.push(exam);
    }
  });

  console.log(`Exams in contact_messages missing from mock_exams table: ${missingInDb.length}`);
  console.table(missingInDb.map(e => ({
    id: e.id,
    title: e.title,
    start_time: e.start_time,
    end_time: e.end_time,
    is_active: e.is_active
  })));
}

checkSyncCloudExams();
