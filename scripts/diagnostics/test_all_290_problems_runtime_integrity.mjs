import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { enrichCodingProblemForExam } from '../../frontend/src/services/campusDsaExamDataset.ts';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testAll290Problems() {
  console.log('================================================================================');
  console.log('RUNTIME INTEGRITY TEST: ALL 290 TECHNICAL PROBLEMS IN SUPABASE');
  console.log('================================================================================\n');

  const { data: problems, error } = await supabase
    .from('technical_problems')
    .select('*')
    .order('id');

  if (error) {
    console.error('Failed to fetch technical_problems:', error);
    process.exit(1);
  }

  console.log(`Fetched ${problems.length} problems from technical_problems table.`);

  let totalErrors = 0;
  let problemsWith8Cases = 0;
  let problemsWithSampleAndHidden = 0;
  let totalTestCasesAcrossAll = 0;
  let constraintsIssues = 0;
  let statementIssues = 0;

  for (const prob of problems) {
    const enriched = enrichCodingProblemForExam(prob);

    // 1. Check title
    if (!enriched.title || enriched.title.trim().length === 0) {
      console.error(`❌ [${prob.id}] Missing title!`);
      totalErrors++;
    }

    // 2. Check statement / description
    const statement = enriched.statement || enriched.description;
    if (!statement || statement.trim().length < 20) {
      console.error(`❌ [${prob.id}] Statement/description is too short or missing!`);
      statementIssues++;
      totalErrors++;
    }

    // 3. Check constraints
    if (!Array.isArray(enriched.constraints) || enriched.constraints.length === 0) {
      console.error(`❌ [${prob.id}] Constraints missing or not an array!`);
      constraintsIssues++;
      totalErrors++;
    } else {
      const hasBadMeta = enriched.constraints.some(c => typeof c === 'string' && (c.includes('LC_URL:') || c.includes('LC_NUM:')));
      if (hasBadMeta) {
        console.error(`❌ [${prob.id}] Leaked internal metadata in constraints!`);
        constraintsIssues++;
        totalErrors++;
      }
    }

    // 4. Check test cases count
    const tcs = enriched.test_cases || [];
    totalTestCasesAcrossAll += tcs.length;

    if (tcs.length >= 8) {
      problemsWith8Cases++;
    } else {
      console.error(`❌ [${prob.id}] Has fewer than 8 test cases (${tcs.length})!`);
      totalErrors++;
    }

    // 5. Check test case structure
    let visible = 0;
    let hidden = 0;
    for (let i = 0; i < tcs.length; i++) {
      const tc = tcs[i];
      if (typeof tc.input !== 'string') {
        console.error(`❌ [${prob.id}] Test case ${i} input is not a string!`);
        totalErrors++;
      }
      if (typeof tc.output !== 'string' && typeof tc.expected_output !== 'string') {
        console.error(`❌ [${prob.id}] Test case ${i} output is not a string!`);
        totalErrors++;
      }
      if (tc.is_hidden) {
        hidden++;
      } else {
        visible++;
      }
    }

    if (visible >= 2 && hidden >= 4) {
      problemsWithSampleAndHidden++;
    } else {
      console.error(`❌ [${prob.id}] Sample/Hidden ratio unbalanced: ${visible} visible, ${hidden} hidden!`);
      totalErrors++;
    }
  }

  console.log('\nAudit Summary:');
  console.log(`  - Total Problems Audited: ${problems.length}`);
  console.log(`  - Problems with >= 8 Test Cases: ${problemsWith8Cases} / ${problems.length} (${((problemsWith8Cases / problems.length) * 100).toFixed(1)}%)`);
  console.log(`  - Problems with >= 2 Sample & >= 4 Hidden: ${problemsWithSampleAndHidden} / ${problems.length} (${((problemsWithSampleAndHidden / problems.length) * 100).toFixed(1)}%)`);
  console.log(`  - Total Executable Test Cases: ${totalTestCasesAcrossAll}`);
  console.log(`  - Average Test Cases per Problem: ${(totalTestCasesAcrossAll / problems.length).toFixed(1)}`);
  console.log(`  - Constraints Issues: ${constraintsIssues}`);
  console.log(`  - Statement Issues: ${statementIssues}`);
  console.log(`  - Total Errors: ${totalErrors}`);

  if (totalErrors === 0) {
    console.log(`\n🎉 ALL 290 CODING PROBLEMS SATISFY EXAM ENGINE INTEGRITY & TEST CASE CONTRACTS!`);
  } else {
    console.error(`\n❌ Found ${totalErrors} issues across the coding problems!`);
    process.exit(1);
  }
}

testAll290Problems().catch(console.error);
