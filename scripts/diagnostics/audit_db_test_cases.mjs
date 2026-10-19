import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
  if (line.startsWith('VITE_SUPABASE_URL=')) env.VITE_SUPABASE_URL = line.substring('VITE_SUPABASE_URL='.length).trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) env.VITE_SUPABASE_ANON_KEY = line.substring('VITE_SUPABASE_ANON_KEY='.length).trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectAllProblemsTestCases() {
  const { data: problems, error } = await supabase
    .from('technical_problems')
    .select('id, title, category, topic_id, track, test_cases, sample_input, sample_output');

  if (error) {
    console.error('Error fetching problems:', error);
    return;
  }

  console.log(`Total problems in technical_problems: ${problems.length}`);

  let zeroTotalTestCases = [];
  let zeroVisibleTestCases = [];
  let validTestCases = [];

  for (const p of problems) {
    let tc = p.test_cases;
    if (typeof tc === 'string' && tc.trim().startsWith('[')) {
      try { tc = JSON.parse(tc); } catch {}
    }

    if (!Array.isArray(tc) || tc.length === 0) {
      zeroTotalTestCases.push(p);
    } else {
      const visible = tc.filter(t => !t.is_hidden && !t.hidden);
      if (visible.length === 0) {
        zeroVisibleTestCases.push({ ...p, totalCount: tc.length });
      } else {
        validTestCases.push({ ...p, totalCount: tc.length, visibleCount: visible.length });
      }
    }
  }

  console.log(`\nResults:`);
  console.log(`- Problems with >0 visible test cases in DB: ${validTestCases.length}`);
  console.log(`- Problems with 0 TOTAL test cases in DB: ${zeroTotalTestCases.length}`);
  console.log(`- Problems with test cases but 0 VISIBLE test cases in DB: ${zeroVisibleTestCases.length}`);

  if (zeroTotalTestCases.length > 0) {
    console.log('\nSample problems with 0 total test cases in DB:');
    zeroTotalTestCases.slice(0, 15).forEach(p => {
      console.log(`  [${p.id}] ${p.title} (Track: ${p.track}, Topic: ${p.topic_id})`);
    });
  }

  if (zeroVisibleTestCases.length > 0) {
    console.log('\nSample problems with 0 visible test cases in DB:');
    zeroVisibleTestCases.slice(0, 15).forEach(p => {
      console.log(`  [${p.id}] ${p.title} (Total: ${p.totalCount})`);
    });
  }
}

inspectAllProblemsTestCases();
