import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { parsePaperQuestions } from '../frontend/src/utils/paperQuestionParser.ts';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function runTests() {
  console.log('================================================================================');
  console.log('       TEST SUITE: PAPER QUESTION PRACTICE IDE & PAYWALL INTEGRITY');
  console.log('================================================================================');
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  let assertions = 0;
  let passed = 0;

  function assert(condition, message) {
    assertions++;
    if (condition) {
      console.log(`  ✔ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Strict Paywalling & Locking Contract
  // --------------------------------------------------------------------------
  console.log('[STAGE 1] Validating Paywall Locking Contract Across Database');

  const { data: exams, error: examsErr } = await supabase
    .from('exams')
    .select('id, name, price, is_public_exam, is_deleted')
    .eq('is_deleted', false);

  assert(!examsErr, 'Exams fetched successfully without database errors');
  assert(exams && exams.length > 0, `Active exams retrieved: ${exams?.length}`);

  const leakingExams = exams.filter(e => e.price > 0 && e.is_public_exam === true);
  assert(
    leakingExams.length === 0,
    `Zero paid company exams have is_public_exam = true (Leaking count: ${leakingExams.length})`
  );

  // Verify server-side redaction RPC for unauthenticated guest
  const { data: guestData, error: guestErr } = await supabase.rpc('get_secure_exams_by_company', {
    p_company_slug: 'amazon',
    p_user_email: null
  });

  assert(!guestErr, 'get_secure_exams_by_company RPC executed successfully');
  if (guestData && guestData.length > 0) {
    const unauthedExam = guestData[0];
    assert(
      unauthedExam.has_user_access === false,
      'Unauthenticated guest has_user_access strictly evaluates to false'
    );
    const tabs = unauthedExam.paper_tabs || [];
    const hasContent = tabs.some(t => t.content && t.content.length > 0);
    assert(
      !hasContent,
      'Proprietary paper question content is strictly redacted (null) by server-side RPC for unauthenticated user'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 2: Question Parser & Programming 150 Formatting Extraction
  // --------------------------------------------------------------------------
  console.log('\n[STAGE 2] Validating Question Extraction in Programming 150 Format');

  const { data: fullExams } = await supabase
    .from('exams')
    .select('id, name, paper_tabs')
    .eq('is_deleted', false);

  let totalParsed = 0;
  let questionsWithTestCases = 0;
  let questionsWithConstraints = 0;

  for (const e of fullExams) {
    const tabs = e.paper_tabs || [];
    for (const t of tabs) {
      if (!t.content) continue;
      const questions = parsePaperQuestions(t.content);
      if (questions.length > 0) {
        totalParsed += questions.length;
        questions.forEach(q => {
          if (q.testCases && q.testCases.length > 0) questionsWithTestCases++;
          if (q.constraints && q.constraints.length > 0) questionsWithConstraints++;
        });
      }
    }
  }

  assert(totalParsed >= 150, `Successfully extracted ${totalParsed} placement questions from papers`);
  assert(
    questionsWithTestCases > 0,
    `Successfully extracted executable sample test cases (${questionsWithTestCases} questions have test cases)`
  );
  assert(
    questionsWithConstraints > 0,
    `Successfully extracted problem constraints (${questionsWithConstraints} questions have constraints)`
  );

  // Detailed sample question test: "Q1. Two Sum"
  const sampleWiproExam = fullExams.find(e => e.paper_tabs?.some(t => t.title?.includes('Wipro')));
  if (sampleWiproExam) {
    const wiproTab = sampleWiproExam.paper_tabs.find(t => t.title?.includes('Wipro'));
    const parsed = parsePaperQuestions(wiproTab.content);
    assert(parsed.length >= 15, `Wipro batch parsed ${parsed.length} questions`);

    const q1 = parsed[0];
    assert(q1.cleanTitle === 'Two Sum', `Q1 title correctly extracted: "${q1.cleanTitle}"`);
    assert(q1.difficulty === 'BASIC', `Q1 difficulty correctly categorized: ${q1.difficulty}`);
    assert(q1.testCases.length >= 3, `Q1 has >= 3 parsed test cases (${q1.testCases.length})`);
    assert(q1.testCases[0].input.includes('nums'), 'Test Case 1 has valid input structure');
    assert(q1.testCases[0].output.includes('[0, 1]'), 'Test Case 1 has valid expected output');
  }

  // --------------------------------------------------------------------------
  // TEST 3: Edge Cases & Sanity
  // --------------------------------------------------------------------------
  console.log('\n[STAGE 3] Edge Cases & Empty Content Handling');

  assert(parsePaperQuestions('').length === 0, 'Empty string returns empty array');
  assert(parsePaperQuestions(null).length === 0, 'Null content returns empty array');
  assert(parsePaperQuestions('General syllabus text without Q1 or headings').length === 0, 'Non-question text returns empty array (falls back to ContentRenderer)');

  console.log('\n================================================================================');
  console.log(`SUMMARY: ${passed} / ${assertions} ASSERTIONS PASSED (Exit Code: ${process.exitCode || 0})`);
  console.log('================================================================================\n');

  if (passed !== assertions) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
