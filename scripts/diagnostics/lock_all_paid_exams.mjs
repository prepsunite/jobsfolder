import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function lockAllPaidExams() {
  console.log('Enforcing paywall contract: setting is_public_exam = false on paid company exams...');
  const { data, error } = await supabase
    .from('exams')
    .update({ is_public_exam: false })
    .neq('price', 0);

  if (error) {
    console.error('Error locking exams:', error);
  } else {
    console.log('Successfully locked all paid company exams!');
  }
}

lockAllPaidExams().catch(console.error);
