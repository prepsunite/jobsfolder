import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const tq = await supabase.from('topic_questions').select('*').limit(1);
  console.log('topic_questions sample:', tq.data?.[0]);

  const tm = await supabase.from('technical_mcqs').select('*').limit(1);
  console.log('technical_mcqs sample:', tm.data?.[0]);

  const tp = await supabase.from('technical_problems').select('*').limit(1);
  console.log('technical_problems sample keys:', Object.keys(tp.data?.[0] || {}));
  console.log('technical_problems sample item:', {
    id: tp.data?.[0]?.id,
    title: tp.data?.[0]?.title,
    category: tp.data?.[0]?.category,
    test_cases_count: tp.data?.[0]?.test_cases?.length,
    test_cases_sample: tp.data?.[0]?.test_cases?.[0]
  });

  // Also check total counts
  const { count: tqCount } = await supabase.from('topic_questions').select('*', { count: 'exact', head: true });
  const { count: tmCount } = await supabase.from('technical_mcqs').select('*', { count: 'exact', head: true });
  const { count: tpCount } = await supabase.from('technical_problems').select('*', { count: 'exact', head: true });

  console.log(`\nTable Row Counts:`);
  console.log(`topic_questions: ${tqCount}`);
  console.log(`technical_mcqs: ${tmCount}`);
  console.log(`technical_problems: ${tpCount}`);
}

run().catch(console.error);
