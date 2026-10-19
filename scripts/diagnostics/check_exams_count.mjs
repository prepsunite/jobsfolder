import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkExamsCount() {
  const { data: exams, count } = await supabase
    .from('exams')
    .select('id, name, company_id, is_deleted', { count: 'exact' });

  console.log(`Total exams in exams table: ${count}`);
  const active = exams.filter(e => !e.is_deleted);
  console.log(`Active exams: ${active.length}`);
  console.log('Sample exam names:');
  active.slice(0, 10).forEach(e => {
    console.log(`- ${e.name} (id: ${e.id}, company: ${e.company_id})`);
  });
}

checkExamsCount().catch(console.error);
