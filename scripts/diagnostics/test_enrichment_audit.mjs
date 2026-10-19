import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { enrichCodingProblemForExam } from '../frontend/src/services/campusDsaExamDataset.js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testEnrichment() {
  const { data: dsaProblems } = await supabase
    .from('technical_problems')
    .select('*')
    .eq('track', 'CAMPUS_DSA');

  console.log(`Fetched ${dsaProblems.length} CAMPUS_DSA problems from Supabase.`);

  const countDistribution = {};
  const under8 = [];

  for (const raw of dsaProblems) {
    const enriched = enrichCodingProblemForExam(raw);
    const tc = enriched.test_cases || enriched.testCases || [];
    countDistribution[tc.length] = (countDistribution[tc.length] || 0) + 1;
    if (tc.length < 8) {
      under8.push({ id: raw.id, title: raw.title, count: tc.length });
    }
  }

  console.log('Test case count distribution across 150 CAMPUS_DSA problems:');
  console.log(countDistribution);
  console.log(`\nSample of problems with < 8 test cases (${under8.length} total):`);
  console.log(under8.slice(0, 10));
}

testEnrichment();
