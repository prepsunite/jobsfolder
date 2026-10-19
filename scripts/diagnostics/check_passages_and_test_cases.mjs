import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkPassagesAndDetails() {
  console.log('--- Checking Reading Comprehension Passages ---');
  const { data: rcData, error: rcErr } = await supabase
    .from('topic_questions')
    .select('id, topic_id, statement, options, correct_answer, explanation')
    .eq('topic_id', 'reading-comprehension')
    .limit(10);

  if (rcErr) {
    console.error('RC Error:', rcErr);
  } else {
    console.log(`Sample RC Questions (found ${rcData?.length}):`);
    rcData?.slice(0, 3).forEach((q, i) => {
      console.log(`[RC Question ${i + 1}]`);
      console.log(`Statement preview: ${q.statement.substring(0, 150)}...`);
      console.log(`Options: ${q.options}`);
      console.log(`Correct Answer: ${q.correct_answer}`);
      console.log(`Explanation: ${q.explanation}`);
    });
  }

  console.log('\n--- Checking lc-16 in Supabase technical_problems ---');
  const { data: lc16 } = await supabase
    .from('technical_problems')
    .select('id, title, test_cases, sample_cases, hidden_test_cases')
    .eq('id', 'lc-16')
    .single();
  console.log('lc-16 direct DB row:', {
    id: lc16?.id,
    title: lc16?.title,
    test_cases_length: lc16?.test_cases?.length,
    sample_cases_length: lc16?.sample_cases?.length,
    hidden_cases_length: lc16?.hidden_test_cases?.length
  });

  console.log('\n--- Checking Coding Test Cases Format & Validity across all 290 problems ---');
  const { data: problems } = await supabase
    .from('technical_problems')
    .select('id, title, test_cases, sample_cases, hidden_test_cases');

  let problemsWithDirectCases = 0;
  let totalDirectCases = 0;
  problems?.forEach(p => {
    const cases = Array.isArray(p.test_cases) ? p.test_cases : [];
    if (cases.length > 0) {
      problemsWithDirectCases++;
      totalDirectCases += cases.length;
    }
  });
  console.log(`Problems with direct test_cases in DB: ${problemsWithDirectCases} / ${problems?.length}`);
  console.log(`Total direct test_cases in DB: ${totalDirectCases}`);
}

checkPassagesAndDetails().catch(console.error);
