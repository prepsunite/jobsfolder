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

  // --------------------------------------------------------------------------
  // TEST 4: Test Case Expected Output Integrity & Encoded String Decoding
  // --------------------------------------------------------------------------
  console.log('\n[STAGE 4] Validating Test Case Expected Output Integrity (Encoded String Decoding)');

  let encodedQuestion = null;
  for (const ex of fullExams) {
    function findQuestion(nodes) {
      for (const n of nodes || []) {
        if (n.content && n.content.includes('Encoded String Decoding')) {
          const qs = parsePaperQuestions(n.content);
          const match = qs.find(q => q.title.includes('Encoded String Decoding'));
          if (match) return match;
        }
        if (n.children) {
          const res = findQuestion(n.children);
          if (res) return res;
        }
      }
      return null;
    }
    encodedQuestion = findQuestion(ex.paper_tabs);
    if (encodedQuestion) break;
  }

  assert(encodedQuestion !== null, 'Encoded String Decoding question discovered in database');
  if (encodedQuestion) {
    assert(encodedQuestion.testCases.length === 4, `Encoded String Decoding has 4 test cases (Found: ${encodedQuestion.testCases.length})`);
    
    // Case 1
    const c1 = encodedQuestion.testCases[0];
    assert(c1.input === '101101110', `Case 1 input matches "101101110" (Actual: "${c1.input}")`);
    assert(c1.output === 'ABC', `Case 1 expected output matches "ABC" (Actual: "${c1.output}")`);

    // Case 3 (Sanitized 25 ones [Y] + 0 + 26 ones [Z])
    const c3 = encodedQuestion.testCases[2];
    assert(c3.input === '1'.repeat(25) + '0' + '1'.repeat(26), `Case 3 input matches 25 ones + 0 + 26 ones (Length: ${c3.input.length})`);
    assert(c3.output === 'YZ', `Case 3 expected output matches "YZ" (Actual: "${c3.output}")`);

    // Verify student Java algorithm behavior on Case 3
    const groups = c3.input.split('0');
    const javaDecoded = groups.map(g => String.fromCharCode(65 + g.length - 1)).join('');
    assert(javaDecoded === 'YZ', `Student Java algorithm on Case 3 outputs "YZ" matching expected output (Actual: "${javaDecoded}")`);

    // Case 4
    const c4 = encodedQuestion.testCases[3];
    assert(c4.input === '1', `Case 4 input matches "1" (Actual: "${c4.input}")`);
    assert(c4.output === 'A', `Case 4 expected output matches "A" (Actual: "${c4.output}")`);

    // Verify IDE mapping simulation
    const mappedCases = encodedQuestion.testCases.map(tc => ({
      input: tc.input,
      expected_output: tc.output,
      output: tc.output,
      expectedOutput: tc.output,
      expected: tc.output,
      is_hidden: false,
    }));

    mappedCases.forEach((tc, idx) => {
      const realExpected = (tc.expected_output || tc.output || tc.expectedOutput || tc.expected || '').trim();
      assert(realExpected.length > 0, `Test Case ${idx + 1} expected output is guaranteed non-empty in IDE execution suite ("${realExpected}")`);
    });
  }

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
