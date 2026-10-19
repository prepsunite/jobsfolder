import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkExamsTable() {
  const { data: exams, error } = await supabase
    .from('exams')
    .select('id, title, company_id, total_questions, duration_minutes, is_deleted')
    .limit(20);

  if (error) {
    console.error('Error fetching exams:', error);
    return;
  }

  console.log(`Fetched ${exams?.length} exams sample:`);
  exams?.forEach(e => {
    console.log(`- ${e.title} (company_id: ${e.company_id}, q_count: ${e.total_questions}, deleted: ${e.is_deleted})`);
  });

  const { count } = await supabase.from('exams').select('*', { count: 'exact', head: true });
  console.log(`Total rows in exams table: ${count}`);
}

checkExamsTable().catch(console.error);
