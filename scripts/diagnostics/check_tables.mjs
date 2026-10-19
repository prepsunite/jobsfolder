import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const candidateTables = [
  'questions',
  'aptitude_questions',
  'technical_questions',
  'technical_mcq_questions',
  'technical_mcqs',
  'technical_mcq_bank',
  'mcq_questions',
  'mock_exams',
  'mock_exam_sections',
  'technical_problems'
];

async function checkTables() {
  console.log('Testing table existence:');
  for (const t of candidateTables) {
    const { count, data, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`  ❌ ${t}: ${error.message}`);
    } else {
      console.log(`  ✅ ${t}: exists (count: ${count})`);
    }
  }
}

checkTables();
