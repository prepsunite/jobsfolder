import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkP150Counts() {
  const { data: p150Problems } = await supabase
    .from('technical_problems')
    .select('id, title, test_cases, sample_input, sample_output')
    .eq('track', 'PROGRAMMING_150');

  console.log(`Fetched ${p150Problems.length} PROGRAMMING_150 problems from Supabase.`);

  const countDist = {};
  for (const p of p150Problems) {
    let tc = p.test_cases;
    if (typeof tc === 'string' && tc.trim().startsWith('[')) {
      try { tc = JSON.parse(tc); } catch {}
    }
    const len = Array.isArray(tc) ? tc.length : 0;
    countDist[len] = (countDist[len] || 0) + 1;
  }

  console.log('Test case count distribution for PROGRAMMING_150:');
  console.log(countDist);
}

checkP150Counts();
