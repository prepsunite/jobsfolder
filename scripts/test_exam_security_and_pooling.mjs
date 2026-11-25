/**
 * Comprehensive Verification Suite for Prepunite Exam Security, Clock Immunity & Pooling
 *
 * Covers:
 * 1. HMAC-SHA256 Coding Verdict Binding & Forgery/Replay Rejection (_examSecurity.js)
 * 2. Passcode PIN Normalization, Hashing, Marker Stripping & Leak Sanitization
 * 3. Deterministic Shuffle Dispersion, Passage-Atomic Sampling & Answer Key Parsing
 * 4. Monotonic ServerClock Immunity to OS Clock Forward/Backward Manipulation
 * 5. api/execute-code.js Security Controls (64KB cap, Auth enforcement, Server DB test case resolution)
 * 6. Live Supabase DB Audit: Server Clock RPC, Nonverbal/Technical-Aptitude Pooling, Zero Hidden Leaks
 */

import fs from 'fs';
import assert from 'assert';
import { createClient } from '@supabase/supabase-js';
import {
  signCodingVerdict,
  verifyCodingVerdict,
  normalizePasscodePin,
  hashPasscodePin,
  extractPasscodeMarker,
  stripPasscodeMarker,
  deterministicShuffle,
  assignSectionQuestionSubset,
  parseCorrectAnswerIndex,
  sanitizeMockExamRecord,
  sanitizeExamQuestionRow,
} from '../api/_examSecurity.js';
import executeCodeHandler, { resolveServerTestCases } from '../api/execute-code.js';
import campusExamsHandler from '../api/campus-exams.js';
import { poolSectionQuestionsServer } from '../api/_examPooling.js';
import {
  getServerNowMs,
  getServerDate,
  setServerNowMs,
  syncServerClock,
  hasServerClockSync,
  _resetServerClockForTest,
} from '../frontend/src/utils/serverClock.ts';
import { expandTopicAliases } from '../frontend/src/services/topicMap.ts';
import {
  BUILTIN_BLUEPRINTS,
  FALLBACK_APTITUDE_TOPICS,
} from '../frontend/src/services/mockExamBlueprint.service.ts';
import {
  classifyForeignElement,
  evaluateExamKeyDown,
  EXAM_DOM_SHIELD_CSS,
} from '../frontend/src/utils/examBrowserShield.ts';

function loadEnv() {
  const env = {};
  for (const p of ['frontend/.env', '.env']) {
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, 'utf8');
    for (const line of text.split('\n')) {
      const idx = line.indexOf('=');
      if (idx > 0) {
        env[line.substring(0, idx).trim()] = line
          .substring(idx + 1)
          .trim()
          .replace(/^['"]|['"]$/g, '');
      }
    }
  }
  return env;
}

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() { return this; },
  };
}

let passed = 0;
let failed = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
    failed++;
  }
}

async function checkAsync(name, fn) {
  try {
    await fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
    failed++;
  }
}

async function main() {
  console.log('==================================================================');
  console.log('PREPUNITE EXAM SECURITY, CLOCK & QUESTION POOLING VERIFICATION');
  console.log('==================================================================\n');

  const TEST_SECRET = 'prepunite-unit-test-hmac-secret-v1';

  // -------------------------------------------------------------------------
  // 1. HMAC Coding Verdict Signing & Anti-Forge Checks
  // -------------------------------------------------------------------------
  console.log('1. Testing HMAC-SHA256 Coding Verdicts...');
  const sampleCode = 'def solve():\n    return 42\n';
  const baseClaim = {
    attemptId: 'att-exam1-alice',
    problemId: 'p150-1',
    langKey: 'python',
    sourceCode: sampleCode,
    userEmail: 'alice@college.edu',
    passedCount: 4,
    totalCount: 5,
  };
  const token = signCodingVerdict(baseClaim, TEST_SECRET);

  check('Valid HMAC token verifies and preserves exact partial counts', () => {
    assert(typeof token === 'string' && token.includes('.'));
    const res = verifyCodingVerdict(token, baseClaim, TEST_SECRET);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.passedCount, 4);
    assert.strictEqual(res.totalCount, 5);
  });

  check('Tampered sourceCode is rejected by HMAC verifier', () => {
    const res = verifyCodingVerdict(
      token,
      { ...baseClaim, sourceCode: sampleCode + ' ' },
      TEST_SECRET
    );
    assert.strictEqual(res.valid, false);
  });

  check('Attempt-ID swap (replay across attempts) is rejected', () => {
    const res = verifyCodingVerdict(
      token,
      { ...baseClaim, attemptId: 'att-exam1-bob' },
      TEST_SECRET
    );
    assert.strictEqual(res.valid, false);
  });

  check('Problem-ID swap (replay onto another problem) is rejected', () => {
    const res = verifyCodingVerdict(
      token,
      { ...baseClaim, problemId: 'p150-99' },
      TEST_SECRET
    );
    assert.strictEqual(res.valid, false);
  });

  check('User-email swap (cross-student replay) is rejected', () => {
    const res = verifyCodingVerdict(
      token,
      { ...baseClaim, userEmail: 'mallory@college.edu' },
      TEST_SECRET
    );
    assert.strictEqual(res.valid, false);
  });

  check('Tampered signature bytes are rejected', () => {
    const parts = token.split('.');
    const badSig = (parts[1][0] === 'A' ? 'B' : 'A') + parts[1].slice(1);
    const res = verifyCodingVerdict(`${parts[0]}.${badSig}`, baseClaim, TEST_SECRET);
    assert.strictEqual(res.valid, false);
  });

  check('Expired verdict token (> 6h) is rejected', () => {
    const oldToken = signCodingVerdict(
      { ...baseClaim, issuedAt: Date.now() - 7 * 3600 * 1000 },
      TEST_SECRET
    );
    const res = verifyCodingVerdict(oldToken, baseClaim, TEST_SECRET);
    assert.strictEqual(res.valid, false);
  });

  // -------------------------------------------------------------------------
  // 2. Passcode Hashing & Payload Leak Sanitization
  // -------------------------------------------------------------------------
  console.log('\n2. Testing Passcode Security & Question Sanitization...');
  check('Passcode normalization + SHA-256 hash consistency across case/whitespace', () => {
    assert.strictEqual(normalizePasscodePin('  tpo2026  '), 'TPO2026');
    const h1 = hashPasscodePin('TPO2026');
    const h2 = hashPasscodePin(' tpo2026 ');
    const h3 = hashPasscodePin('WRONGPIN');
    assert.strictEqual(h1.length, 64);
    assert.strictEqual(h1, h2);
    assert.notStrictEqual(h1, h3);
  });

  check('Passcode markers extract cleanly and strip completely from instructions', () => {
    const raw = '<!--SECTIONAL_LOCK-->\n<!--PASSCODE:secret99-->\nRead instructions carefully.';
    assert.strictEqual(extractPasscodeMarker(raw), 'SECRET99');
    const stripped = stripPasscodeMarker(raw);
    assert(!stripped.includes('SECRET99') && !stripped.includes('secret99') && !stripped.includes('PASSCODE'));
    assert(stripped.includes('Read instructions carefully.'));
  });

  check('sanitizeMockExamRecord removes plaintext PIN, hash & embeds zero secrets', () => {
    const sanitized = sanitizeMockExamRecord({
      id: 'exam-1',
      title: 'Test Exam',
      instructions: '<!--PASSCODE:ABC123-->\nWelcome.',
      access_passcode: 'ABC123',
      access_passcode_hash: 'deadbeef',
      enable_passcode_lock: false,
    });
    assert.strictEqual(sanitized.enable_passcode_lock, true);
    assert.strictEqual(sanitized.access_passcode, undefined);
    assert.strictEqual(sanitized.access_passcode_hash, undefined);
    assert(!sanitized.instructions.includes('ABC123'));
  });

  check('sanitizeExamQuestionRow strips answers, explanations, solutions & hidden test cases', () => {
    const safeMcq = sanitizeExamQuestionRow(
      {
        id: 'q-1',
        topic_id: 'reading-comprehension',
        question_number: 1,
        statement: 'What is 2+2?',
        options: ['3', '4', '5', '6'],
        correct_answer: 1,
        correct_option_index: 1,
        explanation: '2+2=4',
        structured_explanation: { steps: ['add'], passage: 'Shared context', passageTitle: 'Passage A' },
      },
      'topic_questions'
    );
    assert.strictEqual('correct_answer' in safeMcq, false);
    assert.strictEqual('correct_option_index' in safeMcq, false);
    assert.strictEqual('explanation' in safeMcq, false);
    assert.strictEqual(safeMcq.structured_explanation.passage, 'Shared context');
    assert.strictEqual('steps' in safeMcq.structured_explanation, false);

    const safeCoding = sanitizeExamQuestionRow(
      {
        id: 'c-1',
        title: 'Two Sum',
        description: 'Find indices',
        solutions: { python: 'print(1)' },
        hidden_test_cases: [{ input: 'secret', expected_output: '42' }],
        test_cases: [
          { input: '1 2', expected_output: '3', is_hidden: false },
          { input: '99 1', expected_output: '100', is_hidden: true },
        ],
      },
      'technical_problems'
    );
    assert.strictEqual('solutions' in safeCoding, false);
    assert.strictEqual('hidden_test_cases' in safeCoding, false);
    assert.strictEqual(safeCoding.test_cases.length, 1);
    assert.strictEqual(safeCoding.test_cases[0].input, '1 2');
  });

  // -------------------------------------------------------------------------
  // 3. Deterministic Shuffle, Passage Grouping & Answer Parsing
  // -------------------------------------------------------------------------
  console.log('\n3. Testing Deterministic Shuffling & Atomic Passage Assignment...');
  check('deterministicShuffle is identical on reload and disperses across students', () => {
    const items = Array.from({ length: 20 }, (_, i) => `q-${i + 1}`);
    const s1a = deterministicShuffle(items, 'exam-x_seedA');
    const s1b = deterministicShuffle(items, 'exam-x_seedA');
    const s2 = deterministicShuffle(items, 'exam-x_seedB');
    assert.deepStrictEqual(s1a, s1b);
    assert.notDeepStrictEqual(s1a, s2);
    assert.notDeepStrictEqual(s1a, items);
  });

  check('assignSectionQuestionSubset preserves atomic passage blocks without fragmentation', () => {
    const pool = [];
    const metaById = new Map();
    for (let p = 1; p <= 4; p++) {
      const passageText = `Unique comprehension passage body #${p} spanning multiple facts.`;
      for (let k = 1; k <= 5; k++) {
        const id = `rc-${p}-${k}`;
        pool.push(id);
        metaById.set(id, {
          id,
          topic_id: 'reading-comprehension',
          question_number: (p - 1) * 5 + k,
          structured_explanation: { passage: passageText, passageTitle: `Passage ${p}` },
        });
      }
    }
    const subset = assignSectionQuestionSubset(
      pool,
      metaById,
      10,
      'seed-passage-check',
      true
    );
    assert.strictEqual(subset.length, 10);
    const pA = subset.slice(0, 5).map(id => metaById.get(id).structured_explanation.passageTitle);
    const pB = subset.slice(5, 10).map(id => metaById.get(id).structured_explanation.passageTitle);
    assert(pA.every(t => t === pA[0]), 'First passage block must stay intact');
    assert(pB.every(t => t === pB[0]), 'Second passage block must stay intact');
    assert.notStrictEqual(pA[0], pB[0]);
    for (let i = 1; i < 5; i++) {
      assert(metaById.get(subset[i]).question_number > metaById.get(subset[i - 1]).question_number);
    }
  });

  check('parseCorrectAnswerIndex handles numbers and A..F letters consistently', () => {
    assert.strictEqual(parseCorrectAnswerIndex(0), 0);
    assert.strictEqual(parseCorrectAnswerIndex('3'), 3);
    assert.strictEqual(parseCorrectAnswerIndex('A'), 0);
    assert.strictEqual(parseCorrectAnswerIndex('d'), 3);
    assert.strictEqual(parseCorrectAnswerIndex('f'), 5);
    assert.strictEqual(parseCorrectAnswerIndex('invalid'), -1);
    assert.strictEqual(parseCorrectAnswerIndex(null), -1);
  });

  // -------------------------------------------------------------------------
  // 4. ServerClock Immunity to OS Date Manipulation
  // -------------------------------------------------------------------------
  console.log('\n4. Testing ServerClock Monotonicity Under OS Clock Attacks...');
  await checkAsync('ServerClock ignores +5h forward and -3h backward OS clock jumps', async () => {
    _resetServerClockForTest();
    const realDateNow = Date.now;
    const realPerfNow = performance.now.bind(performance);
    let fakeOsTime = 1_750_000_000_000;
    let fakePerfTime = 1_000;

    Date.now = () => fakeOsTime;
    performance.now = () => fakePerfTime;

    try {
      const serverAnchor = 1_750_000_500_000;
      setServerNowMs(serverAnchor);
      assert.strictEqual(hasServerClockSync(), true);
      assert.strictEqual(getServerNowMs(), serverAnchor);

      // Candidate pushes PC clock BACK by 3 hours while 5 seconds elapse
      fakeOsTime -= 3 * 3600 * 1000;
      fakePerfTime += 5_000;
      assert.strictEqual(getServerNowMs(), serverAnchor + 5_000);

      // Candidate pushes PC clock FORWARD by 5 hours while 5 more seconds elapse
      fakeOsTime += 5 * 3600 * 1000;
      fakePerfTime += 5_000;
      assert.strictEqual(getServerNowMs(), serverAnchor + 10_000);
      assert.strictEqual(getServerDate().getTime(), serverAnchor + 10_000);

      // syncServerClock accounts for bounded half RTT
      const syncedMs = await syncServerClock({
        rpc: async () => {
          fakePerfTime += 100;
          return { data: new Date(serverAnchor + 20_000).toISOString(), error: null };
        },
      });
      assert.strictEqual(syncedMs, serverAnchor + 20_050);
      assert.strictEqual(getServerNowMs(), serverAnchor + 20_050);
    } finally {
      Date.now = realDateNow;
      performance.now = realPerfNow;
      _resetServerClockForTest();
    }
  });

  // -------------------------------------------------------------------------
  // 5. execute-code.js Security Checks
  // -------------------------------------------------------------------------
  console.log('\n5. Testing api/execute-code.js Request Gates...');
  const runHandler = typeof executeCodeHandler === 'function' ? executeCodeHandler : executeCodeHandler?.default;
  await checkAsync('Rejects oversized sourceCode (> 64KB) with 413', async () => {
    assert.strictEqual(typeof runHandler, 'function');
    const res = createMockRes();
    await runHandler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '10.10.1.1' },
        body: {
          language: 'python',
          sourceCode: 'x'.repeat(70 * 1024),
          customStdin: '',
        },
      },
      res
    );
    assert.strictEqual(res.statusCode, 413);
  });

  await checkAsync('Rejects unauthenticated exam/submit execution with 401', async () => {
    const res = createMockRes();
    await runHandler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '10.10.1.2' },
        body: {
          language: 'python',
          sourceCode: 'print(1)',
          problemId: 'p150-1',
          attemptId: 'att-forged',
          isSubmit: true,
        },
      },
      res
    );
    assert.strictEqual(res.statusCode, 401);
  });

  // -------------------------------------------------------------------------
  // 5b. Mock-Exam Browser Shield (Anti-Quizmate, DOM Injection, Selection, Shortcuts)
  // -------------------------------------------------------------------------
  console.log('\n5b. Testing Mock-Exam-Only Browser & Anti-AI Extension Shield...');

  check('Detects Quizmate / Plasmo / chrome-extension AI overlays as violations', () => {
    const qm = classifyForeignElement({ tagName: 'DIV', id: 'quizmate-overlay', isInsideAppRoot: false });
    assert.strictEqual(qm.isForeign, true);
    assert.strictEqual(qm.isAiTool, true);

    const plasmo = classifyForeignElement({ tagName: 'PLASMO-CSUI', isInsideAppRoot: false });
    assert.strictEqual(plasmo.isForeign, true);
    assert.strictEqual(plasmo.isAiTool, true);

    const extIframe = classifyForeignElement({
      tagName: 'IFRAME',
      src: 'chrome-extension://abcdef123456/popup.html',
      isInsideAppRoot: false,
    });
    assert.strictEqual(extIframe.isForeign, true);
    assert.strictEqual(extIframe.isAiTool, true);

    const shadowOverlay = classifyForeignElement({
      tagName: 'DIV',
      id: 'floating-solver-panel',
      hasShadowRoot: true,
      isInsideAppRoot: false,
    });
    assert.strictEqual(shadowOverlay.isForeign, true);
    assert.strictEqual(shadowOverlay.isAiTool, true);
  });

  check('Suppresses passive helpers (Grammarly) softly without AI strike & preserves Monaco/root UI', () => {
    const gram = classifyForeignElement({ tagName: 'GRAMMARLY-DESKTOP-INTEGRATION', isInsideAppRoot: false });
    assert.strictEqual(gram.isForeign, true);
    assert.strictEqual(gram.isPassiveHelper, true);
    assert.strictEqual(gram.isAiTool, false);

    const monaco = classifyForeignElement({ tagName: 'DIV', className: 'monaco-aria-container', isInsideAppRoot: false });
    assert.strictEqual(monaco.isForeign, false);
    assert.strictEqual(monaco.isAiTool, false);

    const appRoot = classifyForeignElement({ tagName: 'DIV', id: 'root', isInsideAppRoot: true });
    assert.strictEqual(appRoot.isForeign, false);
  });

  check('Blocks PrintScreen/F12/Ctrl+A/Ctrl+P on MCQs while permitting Ctrl+A inside Monaco coding editor', () => {
    assert.strictEqual(evaluateExamKeyDown({ key: 'F12' }, false).severity, 'STRIKE');
    assert.strictEqual(evaluateExamKeyDown({ key: 'PrintScreen' }, false).severity, 'STRIKE');
    assert.strictEqual(evaluateExamKeyDown({ key: 'a', ctrlKey: true }, false).severity, 'WARN');
    assert.strictEqual(evaluateExamKeyDown({ key: 'p', ctrlKey: true }, true).severity, 'WARN');
    assert.strictEqual(evaluateExamKeyDown({ key: 'ContextMenu' }, false).severity, 'WARN');
    assert.strictEqual(evaluateExamKeyDown({ key: 'a', ctrlKey: true }, true).blocked, false);
  });

  check('CSS shield scopes user-select lockout strictly to #prepunite-exam-root and spares practice pages', () => {
    assert(EXAM_DOM_SHIELD_CSS.includes('#prepunite-exam-root'), 'Must scope user-select rules to #prepunite-exam-root');
    assert(!EXAM_DOM_SHIELD_CSS.includes('body {'), 'Must not apply global body lockout');
    const topicSrc = fs.readFileSync('frontend/src/pages/TopicQuestionsPage.tsx', 'utf8');
    assert(!topicSrc.includes('disableCopy'), 'Practice TopicQuestionsPage must stay unrestricted');
    const qrcSrc = fs.readFileSync('frontend/src/components/QuestionRichContent.tsx', 'utf8');
    assert(qrcSrc.includes('disableCopy = false'), 'QuestionRichContent must default disableCopy to false');
  });

  // -------------------------------------------------------------------------
  // 6. Live Supabase DB Audit: Server Time RPC, Category Pooling & Blueprints
  // -------------------------------------------------------------------------
  console.log('\n6. Testing Live Supabase DB Pooling, RPC & Blueprint Integrity...');
  const env = loadEnv();
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    console.warn('  [SKIP] Supabase URL/Key not found in env; skipping live DB checks.');
  } else {
    const supabase = createClient(
      env.VITE_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY
    );

    await checkAsync('get_server_timestamp RPC responds with valid UTC timestamp', async () => {
      const { data, error } = await supabase.rpc('get_server_timestamp');
      assert(!error, error?.message || 'RPC error');
      const ms = new Date(data).getTime();
      assert(Number.isFinite(ms) && ms > 1_700_000_000_000);
    });

    await checkAsync('nonverbal-reasoning resolves active visible questions from DB', async () => {
      const topicIds = FALLBACK_APTITUDE_TOPICS
        .filter(t => t.category_slug === 'nonverbal-reasoning')
        .map(t => t.id);
      const expanded = expandTopicAliases(topicIds);
      const { data, error } = await supabase
        .from('topic_questions')
        .select('id, topic_id, is_hidden')
        .in('topic_id', expanded)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .or('is_hidden.is.null,is_hidden.eq.false')
        .limit(100);
      assert(!error, error?.message);
      assert(data && data.length >= 50, `Expected >= 50 nonverbal questions, got ${data?.length || 0}`);
      assert(data.every(q => q.is_hidden !== true), 'No hidden questions allowed');
    });

    await checkAsync('technical-aptitude fallback resolves active technical_mcqs rows from DB', async () => {
      const { data, error } = await supabase
        .from('technical_mcqs')
        .select('id, topic_id, is_hidden')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .or('is_hidden.is.null,is_hidden.eq.false')
        .limit(100);
      assert(!error, error?.message);
      assert(data && data.length >= 50, `Expected >= 50 technical MCQs, got ${data?.length || 0}`);
    });

    await checkAsync('resolveServerTestCases returns server DB test cases for live coding problem', async () => {
      const { data: probs } = await supabase
        .from('technical_problems')
        .select('id')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .limit(1);
      assert(probs && probs.length > 0, 'No technical_problems found');
      const cases = await resolveServerTestCases(supabase, probs[0].id);
      assert(Array.isArray(cases) && cases.length >= 2, `Expected >=2 server test cases for ${probs[0].id}, got ${cases?.length || 0}`);
    });

    await checkAsync(`All ${BUILTIN_BLUEPRINTS.length} builtin blueprints have zero empty sections`, async () => {
      for (const bp of BUILTIN_BLUEPRINTS) {
        for (const sec of bp.sections) {
          let count = 0;
          if (sec.section_type === 'CODING') {
            let q = supabase
              .from('technical_problems')
              .select('id')
              .or('is_deleted.is.null,is_deleted.eq.false')
              .or('is_hidden.is.null,is_hidden.eq.false');
            if (sec.topic_ids?.length) {
              const cats = new Set();
              expandTopicAliases(sec.topic_ids).forEach(t => {
                cats.add(t);
                cats.add(t.toUpperCase());
              });
              q = q.in('category', Array.from(cats));
            }
            const { data } = await q.limit(50);
            count = data?.length || 0;
          } else if (sec.section_type === 'TECHNICAL_MCQ' || sec.category?.startsWith('mcq-')) {
            let q = supabase
              .from('technical_mcqs')
              .select('id')
              .or('is_deleted.is.null,is_deleted.eq.false')
              .or('is_hidden.is.null,is_hidden.eq.false');
            if (sec.topic_ids?.length) q = q.in('topic_id', expandTopicAliases(sec.topic_ids));
            const { data } = await q.limit(50);
            count = data?.length || 0;
          } else {
            let q = supabase
              .from('topic_questions')
              .select('id')
              .or('is_deleted.is.null,is_deleted.eq.false')
              .or('is_hidden.is.null,is_hidden.eq.false');
            if (sec.topic_ids?.length) q = q.in('topic_id', expandTopicAliases(sec.topic_ids));
            const { data } = await q.limit(50);
            count = data?.length || 0;
          }
          assert(count > 0, `Blueprint "${bp.name}" section "${sec.name}" returned 0 active questions`);
        }
      }
    });

    await checkAsync('Coding section pooling returns all 5 requested problems (10 pooled) across mixed domains & EASY difficulty', async () => {
      const res1 = await poolSectionQuestionsServer(
        supabase,
        {
          name: 'Section 3: Hands-on Coding Assessment',
          section_type: 'CODING',
          category: 'coding',
          coding_track: 'CAMPUS_DSA',
          difficulty: 'ALL',
          topic_ids: [],
        },
        10,
        new Set(),
        5
      );
      assert.strictEqual(res1.isCodingSection, true);
      assert.strictEqual(res1.questionIds.length, 10, `Expected 10 pooled CAMPUS_DSA problems, got ${res1.questionIds.length}`);

      const resEasy = await poolSectionQuestionsServer(
        supabase,
        {
          name: 'Section 3: Hands-on Coding Assessment',
          section_type: 'CODING',
          category: 'coding',
          coding_track: 'PROGRAMMING_150',
          difficulty: 'EASY',
          topic_ids: [],
        },
        10,
        new Set(),
        5
      );
      assert.strictEqual(resEasy.questionIds.length, 10, `Expected 10 EASY problems, got ${resEasy.questionIds.length}`);

      const resMixedCoding = await poolSectionQuestionsServer(
        supabase,
        {
          name: 'Mixed Coding',
          section_type: 'CODING',
          category: 'coding',
          coding_track: 'CAMPUS_DSA',
          difficulty: 'ALL',
          topic_ids: ['ARRAYS', 'STRINGS', 'DYNAMIC_PROGRAMMING', 'TREES_BINARY_TREES', 'MATRICES'],
        },
        10,
        new Set(),
        5
      );
      assert.strictEqual(resMixedCoding.questionIds.length, 10);
      const { data: pulledRows } = await supabase
        .from('technical_problems')
        .select('id, category')
        .in('id', resMixedCoding.questionIds);
      const distinctCats = new Set((pulledRows || []).map(r => r.category));
      assert(distinctCats.size >= 4, `Expected >=4 distinct coding categories in mixed pool, got ${Array.from(distinctCats).join(', ')}`);
    });

    await checkAsync('Mixed Aptitude (Passage + Standalone) preserves ALL selected topics evenly', async () => {
      const resMix = await poolSectionQuestionsServer(
        supabase,
        {
          name: 'Mixed Aptitude & Verbal',
          section_type: 'MCQ',
          category: 'all',
          difficulty: 'ALL',
          topic_ids: ['reading-comprehension', 'numbers', 'percentage', 'seating-arrangement'],
        },
        40,
        new Set(),
        20
      );
      assert.strictEqual(resMix.questionIds.length, 40, `Expected 40 pooled questions, got ${resMix.questionIds.length}`);
      const { data: rows } = await supabase
        .from('topic_questions')
        .select('id, topic_id')
        .in('id', resMix.questionIds);
      const topicsFound = new Set((rows || []).map(r => r.topic_id));
      for (const reqT of ['reading-comprehension', 'numbers', 'percentage', 'seating-arrangement']) {
        assert(topicsFound.has(reqT), `Missing selected mixed topic "${reqT}"! Found: ${Array.from(topicsFound).join(', ')}`);
      }
    });

    await checkAsync('Mixed Aptitude "All Domains" spreads across >=4 categories (not 100% Arithmetic)', async () => {
      const resAll = await poolSectionQuestionsServer(
        supabase,
        {
          name: 'All Domains Mixed',
          section_type: 'MCQ',
          category: 'all',
          difficulty: 'ALL',
          topic_ids: [],
        },
        40,
        new Set(),
        20
      );
      assert(resAll.questionIds.length >= 30, `Expected >=30 pooled questions, got ${resAll.questionIds.length}`);
      const { data: qRows } = await supabase.from('topic_questions').select('topic_id').in('id', resAll.questionIds);
      const tIds = Array.from(new Set((qRows || []).map(r => r.topic_id)));
      const { data: catRows } = await supabase.from('aptitude_topics').select('id, category_slug').in('id', tIds);
      const cats = new Set((catRows || []).map(c => c.category_slug));
      assert(cats.size >= 4, `Expected >=4 distinct aptitude categories in All Domains mix, got ${Array.from(cats).join(', ')}`);
    });

    await checkAsync('Mixed Technical MCQs balances across all selected CS subjects', async () => {
      const subjects = ['mcq-c-programming', 'mcq-database-systems', 'mcq-operating-systems', 'mcq-data-structures'];
      const resTech = await poolSectionQuestionsServer(
        supabase,
        {
          name: 'Core CS Mixed',
          section_type: 'TECHNICAL_MCQ',
          category: 'technical-mcqs',
          difficulty: 'ALL',
          topic_ids: subjects,
        },
        24,
        new Set(),
        12
      );
      assert.strictEqual(resTech.questionIds.length, 24);
      const { data: tmRows } = await supabase.from('technical_mcqs').select('topic_id').in('id', resTech.questionIds);
      const counts = {};
      (tmRows || []).forEach(r => { counts[r.topic_id] = (counts[r.topic_id] || 0) + 1; });
      for (const s of subjects) {
        assert((counts[s] || 0) >= 4, `Expected >=4 questions for ${s}, got ${counts[s] || 0}`);
      }
    });

    if (env.SUPABASE_SERVICE_ROLE_KEY) {
      await checkAsync('/api/campus-exams action=pool-sections allows authenticated user to pool 5 Coding problems despite RLS', async () => {
        const prevUrl = process.env.SUPABASE_URL;
        const prevSrv = process.env.SUPABASE_SERVICE_ROLE_KEY;
        process.env.SUPABASE_URL = env.VITE_SUPABASE_URL;
        process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
        try {
          const { data: users } = await supabase.auth.admin.listUsers({ perPage: 20 });
          const nonAdmin = users?.users?.find(u => u.email !== 'mockfolder@gmail.com' && u.email !== 'venkatmukala9@gmail.com');
          assert(nonAdmin?.email, 'Need non-admin user to verify RLS bypass via server');
          const { data: linkData } = await supabase.auth.admin.generateLink({ type: 'magiclink', email: nonAdmin.email });
          const sbAnon = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
          const { data: otpData } = await sbAnon.auth.verifyOtp({ token_hash: linkData.properties.hashed_token, type: 'magiclink' });
          const jwt = otpData?.session?.access_token;
          assert(jwt, 'Could not mint non-admin JWT');

          const res = createMockRes();
          const invokeCampusExams =
            typeof campusExamsHandler === 'function' ? campusExamsHandler : campusExamsHandler?.default;
          assert(typeof invokeCampusExams === 'function', 'campusExamsHandler export invalid');
          await invokeCampusExams(
            {
              method: 'POST',
              headers: { authorization: `Bearer ${jwt}` },
              body: {
                action: 'pool-sections',
                collegeId: 'SELF',
                sections: [
                  {
                    name: 'Section 3: Hands-on Coding Assessment',
                    section_type: 'CODING',
                    category: 'coding',
                    coding_track: 'CAMPUS_DSA',
                    question_count: 5,
                    topic_ids: [],
                  },
                ],
              },
            },
            res
          );
          assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}: ${JSON.stringify(res.body)}`);
          assert.strictEqual(res.body?.success, true);
          assert.strictEqual(res.body?.sections?.[0]?.question_ids?.length, 10);
          assert.strictEqual(res.body?.sections?.[0]?.serve_count, 5);
        } finally {
          process.env.SUPABASE_URL = prevUrl;
          process.env.SUPABASE_SERVICE_ROLE_KEY = prevSrv;
        }
      });

      await checkAsync('/api/campus-exams submit-attempt persists SUBMITTED & TERMINATED_MALPRACTICE in DB and blocks re-entry', async () => {
        const prevUrl = process.env.SUPABASE_URL;
        const prevSrv = process.env.SUPABASE_SERVICE_ROLE_KEY;
        process.env.SUPABASE_URL = env.VITE_SUPABASE_URL;
        process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
        const testExamId = `test-lock-${Date.now()}`;
        let createdAttemptId = '';
        try {
          const { data: users } = await supabase.auth.admin.listUsers({ perPage: 20 });
          const nonAdmin = users?.users?.find(u => u.email !== 'mockfolder@gmail.com' && u.email !== 'venkatmukala9@gmail.com');
          assert(nonAdmin?.email, 'Need non-admin user');
          const { data: linkData } = await supabase.auth.admin.generateLink({ type: 'magiclink', email: nonAdmin.email });
          const sbAnon = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
          const { data: otpData } = await sbAnon.auth.verifyOtp({ token_hash: linkData.properties.hashed_token, type: 'magiclink' });
          const jwt = otpData?.session?.access_token;
          assert(jwt, 'Could not mint non-admin JWT');

          // Seed a temporary SELF exam for this non-admin student
          const { data: qRow } = await supabase.from('topic_questions').select('id').limit(1).maybeSingle();
          assert(qRow?.id, 'Need at least 1 topic_question');
          const { error: exInsErr } = await supabase.from('mock_exams').insert({
            id: testExamId,
            title: 'Test Lockout Exam',
            college_id: 'SELF',
            created_by: nonAdmin.id,
            target_departments: [nonAdmin.email.toLowerCase()],
            duration_minutes: 30,
            total_marks: 10,
            is_active: true,
            start_time: new Date(Date.now() - 60_000).toISOString(),
            end_time: new Date(Date.now() + 3_600_000).toISOString(),
            enable_tab_switch_detection: true,
            max_tab_switches_allowed: 3,
          });
          assert(!exInsErr, exInsErr?.message);
          await supabase.from('mock_exam_sections').insert({
            id: `sec-${testExamId}`,
            mock_exam_id: testExamId,
            name: 'Quant',
            section_order: 1,
            question_count: 1,
            marks_per_question: 10,
            question_ids: [qRow.id],
          });

          const invokeCampusExams =
            typeof campusExamsHandler === 'function' ? campusExamsHandler : campusExamsHandler?.default;

          // 1. Start attempt
          const resStart = createMockRes();
          await invokeCampusExams(
            { method: 'POST', headers: { authorization: `Bearer ${jwt}` }, body: { action: 'start-attempt', examId: testExamId } },
            resStart
          );
          assert.strictEqual(resStart.statusCode, 200, `start-attempt failed: ${JSON.stringify(resStart.body)}`);
          createdAttemptId = resStart.body?.attempt?.id;
          assert(createdAttemptId, 'Expected attempt id');
          assert.strictEqual(resStart.body?.attempt?.status, 'IN_PROGRESS');

          // 2. Submit attempt (simulate malpractice termination on tab switch limit)
          const resSubmit = createMockRes();
          await invokeCampusExams(
            {
              method: 'POST',
              headers: { authorization: `Bearer ${jwt}` },
              body: {
                action: 'submit-attempt',
                attempt: {
                  id: createdAttemptId,
                  mock_exam_id: testExamId,
                  status: 'TERMINATED_MALPRACTICE',
                  tab_switch_count: 3,
                  time_spent_seconds: 12,
                  proctor_events: [{ timestamp: new Date().toISOString(), type: 'TAB_SWITCH', details: '3/3' }],
                  responses: {},
                },
              },
            },
            resSubmit
          );
          assert.strictEqual(resSubmit.statusCode, 200, `submit-attempt failed: ${JSON.stringify(resSubmit.body)}`);
          assert.strictEqual(resSubmit.body?.attempt?.status, 'TERMINATED_MALPRACTICE');

          // 3. Verify DB row is ACTUALLY TERMINATED_MALPRACTICE (not stuck IN_PROGRESS!)
          const { data: dbRow } = await supabase
            .from('student_exam_attempts')
            .select('status, submitted_at')
            .eq('id', createdAttemptId)
            .single();
          assert.strictEqual(dbRow?.status, 'TERMINATED_MALPRACTICE', `Expected DB status TERMINATED_MALPRACTICE, got ${dbRow?.status}`);
          assert(dbRow?.submitted_at, 'Expected submitted_at persisted in DB');

          // 4. Calling start-attempt again must return alreadyFinalized: true and NOT IN_PROGRESS
          const resReenter = createMockRes();
          await invokeCampusExams(
            { method: 'POST', headers: { authorization: `Bearer ${jwt}` }, body: { action: 'start-attempt', examId: testExamId } },
            resReenter
          );
          assert.strictEqual(resReenter.statusCode, 200);
          assert.strictEqual(resReenter.body?.alreadyFinalized, true, 'Expected alreadyFinalized=true on re-entry');
          assert.strictEqual(resReenter.body?.attempt?.status, 'TERMINATED_MALPRACTICE');
        } finally {
          if (createdAttemptId) {
            await supabase.from('student_exam_attempts').delete().eq('id', createdAttemptId);
          }
          await supabase.from('mock_exam_sections').delete().eq('mock_exam_id', testExamId);
          await supabase.from('mock_exams').delete().eq('id', testExamId);
          process.env.SUPABASE_URL = prevUrl;
          process.env.SUPABASE_SERVICE_ROLE_KEY = prevSrv;
        }
      });

      await checkAsync('/api/campus-exams blocks student start-attempt when college pass is SUSPENDED or EXPIRED', async () => {
        const prevUrl = process.env.SUPABASE_URL;
        const prevSrv = process.env.SUPABASE_SERVICE_ROLE_KEY;
        process.env.SUPABASE_URL = env.VITE_SUPABASE_URL;
        process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
        const testColId = `col-test-${Date.now()}`;
        const testExamId = `exam-colgate-${Date.now()}`;
        const testStuId = `stu-test-${Date.now()}`;
        try {
          const { data: users } = await supabase.auth.admin.listUsers({ perPage: 20 });
          const nonAdmin = users?.users?.find(u => u.email !== 'mockfolder@gmail.com' && u.email !== 'venkatmukala9@gmail.com');
          assert(nonAdmin?.email, 'Need non-admin user');
          const { data: linkData } = await supabase.auth.admin.generateLink({ type: 'magiclink', email: nonAdmin.email });
          const sbAnon = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
          const { data: otpData } = await sbAnon.auth.verifyOtp({ token_hash: linkData.properties.hashed_token, type: 'magiclink' });
          const jwt = otpData?.session?.access_token;
          assert(jwt, 'Could not mint non-admin JWT');

          // Create a SUSPENDED (unpaid) college, enroll the student, and create a live exam
          await supabase.from('colleges').insert({
            id: testColId,
            name: 'Unpaid Test College',
            code: `UTC${Date.now().toString().slice(-4)}`,
            slug: testColId,
            contract_status: 'SUSPENDED',
            max_licenses: 100,
            valid_until: new Date(Date.now() + 86_400_000).toISOString(),
          });
          await supabase.from('college_students').insert({
            id: testStuId,
            college_id: testColId,
            email: nonAdmin.email.toLowerCase(),
            user_id: nonAdmin.id,
            full_name: 'Test Candidate',
            status: 'ACTIVE',
          });
          await supabase.from('mock_exams').insert({
            id: testExamId,
            title: 'College Gate Test',
            college_id: testColId,
            duration_minutes: 30,
            total_marks: 10,
            is_active: true,
            start_time: new Date(Date.now() - 60_000).toISOString(),
            end_time: new Date(Date.now() + 3_600_000).toISOString(),
          });

          const invokeCampusExams =
            typeof campusExamsHandler === 'function' ? campusExamsHandler : campusExamsHandler?.default;

          // 1. Suspended college -> MUST reject 403
          const resSuspended = createMockRes();
          await invokeCampusExams(
            { method: 'POST', headers: { authorization: `Bearer ${jwt}` }, body: { action: 'start-attempt', examId: testExamId } },
            resSuspended
          );
          assert.strictEqual(resSuspended.statusCode, 403, `Expected 403 for SUSPENDED college, got ${resSuspended.statusCode}: ${JSON.stringify(resSuspended.body)}`);

          // 2. Expired valid_until -> MUST reject 403 even if contract_status is ACTIVE
          await supabase
            .from('colleges')
            .update({ contract_status: 'ACTIVE', valid_until: new Date(Date.now() - 86_400_000).toISOString() })
            .eq('id', testColId);
          const resExpired = createMockRes();
          await invokeCampusExams(
            { method: 'POST', headers: { authorization: `Bearer ${jwt}` }, body: { action: 'start-attempt', examId: testExamId } },
            resExpired
          );
          assert.strictEqual(resExpired.statusCode, 403, `Expected 403 for expired college, got ${resExpired.statusCode}: ${JSON.stringify(resExpired.body)}`);
        } finally {
          await supabase.from('student_exam_attempts').delete().eq('mock_exam_id', testExamId);
          await supabase.from('mock_exams').delete().eq('id', testExamId);
          await supabase.from('college_students').delete().eq('id', testStuId);
          await supabase.from('colleges').delete().eq('id', testColId);
          process.env.SUPABASE_URL = prevUrl;
          process.env.SUPABASE_SERVICE_ROLE_KEY = prevSrv;
        }
      });
    }
  }

  console.log('\n==================================================================');
  console.log(`VERDICT: ${failed === 0 ? 'PASS' : 'FAIL'} (${passed} passed, ${failed} failed)`);
  console.log('==================================================================');
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Unhandled error in test_exam_security_and_pooling:', err);
  process.exit(1);
});
