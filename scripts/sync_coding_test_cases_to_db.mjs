import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { CAMPUS_DSA_EXAM_PROBLEMS } from '../frontend/src/services/campusDsaExamDataset.ts';
import { PROGRAMMING_150_TEST_CASES_MAP } from '../frontend/src/services/programming150TestCases.ts';

const isApply = process.argv.includes('--apply');

function loadEnv() {
  const env = {};
  for (const f of ['.env', 'frontend/.env']) {
    if (!fs.existsSync(f)) continue;
    for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
      const i = line.indexOf('=');
      if (i > 0) env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return env;
}

function normalizeCases(list) {
  return (list || []).map((tc, idx) => {
    const out = String(tc.expected_output ?? tc.output ?? '');
    return {
      input: String(tc.input ?? ''),
      output: out,
      expected_output: out,
      is_hidden: tc.is_hidden !== undefined ? Boolean(tc.is_hidden) : idx >= 2,
      explanation: tc.explanation || (idx < 2 ? `Sample case ${idx + 1}` : `Hidden verification case ${idx + 1}`),
    };
  });
}

async function main() {
  const env = loadEnv();
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: problems, error } = await sb
    .from('technical_problems')
    .select('id, track, title, description, constraints, sample_input, sample_output, explanation, test_cases, sample_cases, hidden_test_cases')
    .or('is_deleted.is.null,is_deleted.eq.false');

  if (error || !problems) {
    console.error('Failed to load technical_problems:', error?.message);
    process.exit(1);
  }

  let cdsaToUpdate = 0;
  let p150ToUpdate = 0;
  let skipped = 0;
  const updates = [];

  for (const row of problems) {
    const hasHidden = Array.isArray(row.hidden_test_cases) && row.hidden_test_cases.length > 0;
    const hasSamples = Array.isArray(row.sample_cases) && row.sample_cases.length > 0;
    const hasLegacy = Array.isArray(row.test_cases) && row.test_cases.length > 0;

    if (row.track === 'CAMPUS_DSA' && CAMPUS_DSA_EXAM_PROBLEMS[row.id]) {
      if (hasHidden && hasSamples && hasLegacy) {
        skipped++;
        continue;
      }
      const curated = CAMPUS_DSA_EXAM_PROBLEMS[row.id];
      const allCases = normalizeCases(curated.testCases || []);
      const visible = allCases.filter(c => !c.is_hidden);
      const hidden = allCases.filter(c => c.is_hidden);
      const finalSample = visible.length > 0 ? visible : allCases.slice(0, 2).map(c => ({ ...c, is_hidden: false }));
      const finalHidden = hidden.length > 0 ? hidden : allCases.slice(2).map(c => ({ ...c, is_hidden: true }));

      const formattedStatement =
        row.description && row.description.length >= 120
          ? row.description
          : `### Problem Statement\n${curated.description}\n\n### Input Format\n${curated.inputFormat}\n\n### Output Format\n${curated.outputFormat}`;

      updates.push({
        id: row.id,
        payload: {
          description: formattedStatement,
          constraints: Array.isArray(row.constraints) && row.constraints.length > 2 ? row.constraints : curated.constraints,
          sample_input: row.sample_input || curated.sampleInput || finalSample[0]?.input || '',
          sample_output: row.sample_output || curated.sampleOutput || finalSample[0]?.output || '',
          explanation: row.explanation || curated.explanation || '',
          sample_cases: finalSample,
          hidden_test_cases: finalHidden,
          test_cases: [...finalSample, ...finalHidden],
        },
      });
      cdsaToUpdate++;
    } else if (row.track === 'PROGRAMMING_150') {
      const bundle = PROGRAMMING_150_TEST_CASES_MAP[row.id];
      if (!bundle || (hasHidden && hasSamples)) {
        skipped++;
        continue;
      }
      const samples = normalizeCases(bundle.sampleCases || (hasLegacy ? row.test_cases : []));
      const hidden = normalizeCases(bundle.hiddenCases || []).map(c => ({ ...c, is_hidden: true }));
      updates.push({
        id: row.id,
        payload: {
          sample_cases: samples,
          hidden_test_cases: hidden,
          test_cases: [...samples, ...hidden],
        },
      });
      p150ToUpdate++;
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: isApply ? 'APPLY' : 'DRY_RUN',
        totalProblemsScanned: problems.length,
        cdsaQueued: cdsaToUpdate,
        p150Queued: p150ToUpdate,
        alreadyPopulatedOrSkipped: skipped,
      },
      null,
      2
    )
  );

  if (!isApply) {
    console.log('Dry-run complete. Re-run with --apply to commit test cases to Postgres.');
    return;
  }

  let ok = 0;
  let failed = 0;
  for (const u of updates) {
    const { error: upErr } = await sb.from('technical_problems').update(u.payload).eq('id', u.id);
    if (upErr) {
      failed++;
      console.error(`Failed updating ${u.id}:`, upErr.message);
    } else {
      ok++;
    }
  }

  console.log(JSON.stringify({ applied: ok, failed }, null, 2));
  if (failed > 0) process.exit(1);
}

main();
