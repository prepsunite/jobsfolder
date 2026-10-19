import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkExamsColumns() {
  const { data, error } = await supabase.from('exams').select('*').limit(1);
  if (error) {
    console.error('Error fetching exams:', error);
  } else {
    console.log('exams columns:', Object.keys(data?.[0] || {}));
    console.log('sample exam row:', data?.[0]);
  }
}

checkExamsColumns().catch(console.error);
