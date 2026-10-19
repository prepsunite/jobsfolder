import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkSample() {
  const { data: ld } = await supabase.from('topic_questions').select('id, statement').eq('topic_id', 'logical-deduction').limit(3);
  console.log('Sample logical-deduction questions:');
  ld?.forEach(q => console.log(' - ', q.statement.substring(0, 120)));

  const { data: se } = await supabase.from('topic_questions').select('id, statement').eq('topic_id', 'spotting-errors').limit(3);
  console.log('\nSample spotting-errors questions:');
  se?.forEach(q => console.log(' - ', q.statement.substring(0, 120)));
}
checkSample();
