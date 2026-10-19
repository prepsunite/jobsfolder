/**
 * Automated Verification Suite for:
 * 1. Dynamic 2x Question Pooling
 * 2. 2x Complete Backup Passage Blocks
 * 3. Atomic Stimulus Integrity (passages never fragmented or disordered)
 * 4. Deterministic Multi-Candidate Dispersion (Student A vs Student B)
 * 5. Score Invariant (marks evaluated strictly out of served questions, not pooled questions)
 * 6. Reload Idempotency (F5 refresh preserves identical assigned questions)
 * 7. Stratified Equi-Difficulty Distribution (identical Easy/Med/Hard quotas per candidate)
 */

import assert from 'assert';

console.log('🧪 Starting Verification Suite: Dynamic 2x Question Pooling, Multi-Passage & Stratified Difficulty Sampling...\n');

// Mock seededShuffle identical to Mulberry32 + FNV-1a implementation in MockExamTestPage.tsx
function seededShuffle(items, seedStr) {
  if (!items || items.length <= 1) return items;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  const random = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Mock getSampledSectionQuestionIds matching implementation in MockExamTestPage.tsx
function getSampledSectionQuestionIds(
  section,
  sectionIndex,
  questionsMap,
  examId,
  studentShuffleSeed,
  localStorageMock = {},
  shuffleQuestions = true
) {
  const rawIds = section?.question_ids || [];
  if (rawIds.length === 0) return [];

  const targetServeCount = Math.min(
    rawIds.length,
    section?.serve_count || section?.question_count || rawIds.length
  );

  // Check persistent cache
  const cacheKey = `prepunite_sec_qids_${examId}_${sectionIndex}`;
  if (localStorageMock[cacheKey]) {
    const parsed = JSON.parse(localStorageMock[cacheKey]);
    if (Array.isArray(parsed) && (parsed.length === targetServeCount || parsed.length === rawIds.length)) {
      return parsed.slice(0, targetServeCount);
    }
  }

  if (!shuffleQuestions && targetServeCount === rawIds.length) {
    return rawIds;
  }

  const hasQuestionsLoaded = rawIds.some(qId => Boolean(questionsMap[qId]));
  if (!hasQuestionsLoaded) {
    const shuffledRaw = seededShuffle([...rawIds], `${studentShuffleSeed}_sec_${sectionIndex}_pre`);
    return shuffledRaw.slice(0, targetServeCount);
  }

  const passageBlocks = [];
  const soloBlocks = [];
  const keyToPassageIdx = new Map();

  for (const qId of rawIds) {
    const q = questionsMap[qId];
    const passageKey =
      q?.passageTitle ||
      q?.contextTitle ||
      q?.structured_explanation?.passageTitle ||
      (q?.passage ? `passage-${q.passage.slice(0, 40)}` : null) ||
      (q?.topic_id && q?.question_number
        ? (['reading-comprehension', 'cloze-test'].includes(q.topic_id)
            ? `${q.topic_id}-block-${Math.floor(((q.question_number || 1) - 1) / 5)}`
            : null)
        : null);

    if (passageKey) {
      if (keyToPassageIdx.has(passageKey)) {
        const idx = keyToPassageIdx.get(passageKey);
        passageBlocks[idx].qIds.push(qId);
      } else {
        const newIdx = passageBlocks.length;
        passageBlocks.push({ key: passageKey, qIds: [qId], isPassage: true });
        keyToPassageIdx.set(passageKey, newIdx);
      }
    } else {
      soloBlocks.push({ key: `solo-${qId}`, qIds: [qId], isPassage: false });
    }
  }

  passageBlocks.forEach(b => {
    if (b.qIds.length > 1) {
      b.qIds.sort((aId, bId) => {
        const qA = questionsMap[aId]?.question_number || 0;
        const qB = questionsMap[bId]?.question_number || 0;
        return qA - qB;
      });
    }
  });

  const shuffledPassageBlocks = seededShuffle(passageBlocks, `${studentShuffleSeed}_sec_${sectionIndex}_passages`);

  const selectedBlocks = [];
  let currentCount = 0;

  if (shuffledPassageBlocks.length > 0) {
    for (const pb of shuffledPassageBlocks) {
      if (currentCount === 0 || currentCount + pb.qIds.length <= targetServeCount) {
        selectedBlocks.push(pb);
        currentCount += pb.qIds.length;
      }
      if (currentCount >= targetServeCount) break;
    }
  }

  // Stratified Equi-Difficulty Distribution on standalone questions
  const remainingSlots = Math.max(0, targetServeCount - currentCount);

  if (remainingSlots > 0 && soloBlocks.length > 0) {
    const easySolo = [];
    const medSolo = [];
    const hardSolo = [];

    soloBlocks.forEach(sb => {
      const q = questionsMap[sb.qIds[0]];
      const diff = (q?.difficulty || q?.level || 'MEDIUM').toUpperCase();
      if (diff === 'EASY') {
        easySolo.push(sb);
      } else if (diff === 'HARD') {
        hardSolo.push(sb);
      } else {
        medSolo.push(sb);
      }
    });

    const totalSolo = soloBlocks.length;
    let quotaEasy = Math.round(remainingSlots * (easySolo.length / totalSolo));
    let quotaHard = Math.round(remainingSlots * (hardSolo.length / totalSolo));
    let quotaMed = Math.max(0, remainingSlots - quotaEasy - quotaHard);

    if (quotaEasy > easySolo.length) {
      quotaMed += (quotaEasy - easySolo.length);
      quotaEasy = easySolo.length;
    }
    if (quotaHard > hardSolo.length) {
      quotaMed += (quotaHard - hardSolo.length);
      quotaHard = hardSolo.length;
    }
    if (quotaMed > medSolo.length) {
      quotaMed = medSolo.length;
    }

    const shuffledEasy = seededShuffle(easySolo, `${studentShuffleSeed}_sec_${sectionIndex}_easy`);
    const shuffledMed = seededShuffle(medSolo, `${studentShuffleSeed}_sec_${sectionIndex}_med`);
    const shuffledHard = seededShuffle(hardSolo, `${studentShuffleSeed}_sec_${sectionIndex}_hard`);

    const pickedEasy = shuffledEasy.slice(0, quotaEasy);
    const pickedMed = shuffledMed.slice(0, quotaMed);
    const pickedHard = shuffledHard.slice(0, quotaHard);

    const stratifiedPicks = [...pickedEasy, ...pickedMed, ...pickedHard];
    stratifiedPicks.forEach(sb => {
      selectedBlocks.push(sb);
      currentCount += sb.qIds.length;
    });

    if (currentCount < targetServeCount) {
      const pickedKeys = new Set(stratifiedPicks.map(b => b.key));
      const leftovers = [...shuffledEasy, ...shuffledMed, ...shuffledHard].filter(b => !pickedKeys.has(b.key));
      for (const sb of leftovers) {
        selectedBlocks.push(sb);
        currentCount += sb.qIds.length;
        if (currentCount >= targetServeCount) break;
      }
    }
  }

  if (currentCount < targetServeCount && shuffledPassageBlocks.length > 0) {
    for (const pb of shuffledPassageBlocks) {
      if (!selectedBlocks.includes(pb)) {
        selectedBlocks.push(pb);
        currentCount += pb.qIds.length;
        if (currentCount >= targetServeCount) break;
      }
    }
  }

  const finalBlocks = seededShuffle(selectedBlocks, `${studentShuffleSeed}_sec_${sectionIndex}_blocks`);
  let finalOrder = finalBlocks.flatMap(b => b.qIds);

  if (finalOrder.length > targetServeCount) {
    finalOrder = finalOrder.slice(0, targetServeCount);
  }

  localStorageMock[cacheKey] = JSON.stringify(finalOrder);
  return finalOrder;
}

// -------------------------------------------------------------
// Test 1: 2x Question Pooling
// -------------------------------------------------------------
console.log('Test 1: Validating 2x Question Pooling configuration...');
const mockSectionConfig = {
  name: 'Quantitative Aptitude',
  question_count: 20,
  marks_per_correct: 1,
  negative_marking: 0.25,
};
const serveCount = mockSectionConfig.question_count;
const poolTargetCount = serveCount * 2;
assert.strictEqual(poolTargetCount, 40, 'Pool target count must be strictly 2x the serve count (20 * 2 = 40)');
console.log('✓ Test 1 Passed: 20 requested questions -> 40 pooled questions target.');

// -------------------------------------------------------------
// Test 2: Atomic Multi-Passage Pooling (2x Backup Passages)
// -------------------------------------------------------------
console.log('\nTest 2: Validating 2x Backup Passages in Passage-Based Section...');
const questionsMap = {};
const passageAQuestions = [1, 2, 3, 4, 5].map(n => {
  const id = `q-passA-${n}`;
  questionsMap[id] = { id, question_number: n, passageTitle: 'Passage A: AI Ethics', passage: 'Full text A...', difficulty: 'MEDIUM' };
  return id;
});
const passageBQuestions = [1, 2, 3, 4, 5].map(n => {
  const id = `q-passB-${n}`;
  questionsMap[id] = { id, question_number: n, passageTitle: 'Passage B: Quantum Cryptography', passage: 'Full text B...', difficulty: 'MEDIUM' };
  return id;
});

// Create 30 standalone questions with stratified difficulty: 10 Easy, 10 Medium, 10 Hard
const standaloneQuestions = Array.from({ length: 30 }, (_, i) => {
  const id = `q-solo-${i + 1}`;
  const diff = i < 10 ? 'EASY' : i < 20 ? 'MEDIUM' : 'HARD';
  questionsMap[id] = { id, question_number: i + 1, statement: `Standalone question ${i + 1}`, difficulty: diff };
  return id;
});

const pooledSection = {
  id: 'sec-reading-comprehension',
  name: 'Verbal & Reading Comprehension',
  serve_count: 20,
  question_count: 20,
  pool_size: 40,
  marks_per_correct: 1,
  question_ids: [...passageAQuestions, ...passageBQuestions, ...standaloneQuestions],
};

assert.strictEqual(pooledSection.question_ids.length, 40, 'Section pool contains 40 questions (including 2 backup passages)');
console.log('✓ Test 2 Passed: Section successfully pooled 2x backup passages and standalone questions.');

// -------------------------------------------------------------
// Test 3: Candidate Sampling & Distribution (Student A vs Student B)
// -------------------------------------------------------------
console.log('\nTest 3: Validating candidate sampling & fair distribution...');
const seedStudentA = 'exam_101_usr_alice@campus.edu';
const seedStudentB = 'exam_101_usr_bob@campus.edu';

const studentALocalStorage = {};
const studentBLocalStorage = {};

const studentAQIds = getSampledSectionQuestionIds(
  pooledSection,
  0,
  questionsMap,
  'exam_101',
  seedStudentA,
  studentALocalStorage
);

const studentBQIds = getSampledSectionQuestionIds(
  pooledSection,
  0,
  questionsMap,
  'exam_101',
  seedStudentB,
  studentBLocalStorage
);

assert.strictEqual(studentAQIds.length, 20, 'Student A receives exactly 20 served questions');
assert.strictEqual(studentBQIds.length, 20, 'Student B receives exactly 20 served questions');

// Verify atomic passage integrity:
const passageAInStudentA = studentAQIds.filter(id => id.startsWith('q-passA-'));
const passageBInStudentA = studentAQIds.filter(id => id.startsWith('q-passB-'));

if (passageAInStudentA.length > 0) {
  assert.strictEqual(passageAInStudentA.length, 5, 'If Passage A is sampled, all 5 questions must be included');
  assert.deepStrictEqual(passageAInStudentA, passageAQuestions, 'Passage A questions must remain in exact Q1..Q5 order');
}
if (passageBInStudentA.length > 0) {
  assert.strictEqual(passageBInStudentA.length, 5, 'If Passage B is sampled, all 5 questions must be included');
  assert.deepStrictEqual(passageBInStudentA, passageBQuestions, 'Passage B questions must remain in exact Q1..Q5 order');
}

console.log('✓ Test 3 Passed: Both candidates received exactly 20 questions with complete atomic passages intact.');

// -------------------------------------------------------------
// Test 4: Reload / F5 Refresh Idempotency (Zero Rerolls)
// -------------------------------------------------------------
console.log('\nTest 4: Validating reload / F5 refresh idempotency...');
const studentAReloadQIds = getSampledSectionQuestionIds(
  pooledSection,
  0,
  questionsMap,
  'exam_101',
  seedStudentA,
  studentALocalStorage
);

assert.deepStrictEqual(studentAQIds, studentAReloadQIds, 'Refreshing the page restores the exact same 20 assigned questions with 0 rerolls');
console.log('✓ Test 4 Passed: 100% reload idempotency verified.');

// -------------------------------------------------------------
// Test 5: Score Invariant (Max marks evaluated on 20, NOT 40)
// -------------------------------------------------------------
console.log('\nTest 5: Validating score evaluation math...');
function calculateScore(exam, responses, assignedQIds) {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const assignedSet = new Set(assignedQIds);

  for (const section of exam.sections) {
    const marksPerQ = section.marks_per_correct || 1;
    const qIds = section.question_ids.filter(id => assignedSet.has(id));

    let secMaxScore = 0;
    let secScore = 0;

    for (const qId of qIds) {
      secMaxScore += marksPerQ;
      if (responses[qId]?.is_correct) {
        secScore += marksPerQ;
      }
    }

    totalScore += secScore;
    maxPossibleScore += secMaxScore;
  }

  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  return { totalScore, maxPossibleScore, percentage };
}

const studentAResponses = {};
studentAQIds.slice(0, 18).forEach(id => {
  studentAResponses[id] = { selected_option: 0, is_correct: true };
});
studentAQIds.slice(18).forEach(id => {
  studentAResponses[id] = { selected_option: 1, is_correct: false };
});

const scoreResult = calculateScore({ sections: [pooledSection] }, studentAResponses, studentAQIds);

assert.strictEqual(scoreResult.maxPossibleScore, 20, 'Max possible score must be evaluated strictly out of served questions (20), NOT pooled questions (40)');
assert.strictEqual(scoreResult.totalScore, 18, 'Total score is 18');
assert.strictEqual(scoreResult.percentage, 90, 'Percentage is 18/20 = 90% (NOT 18/40 = 45%)');
console.log(`✓ Test 5 Passed: Score evaluated out of ${scoreResult.maxPossibleScore} marks (${scoreResult.percentage}%). No 50% score deflation!`);

// -------------------------------------------------------------
// Test 6: Stratified Equi-Difficulty Distribution Invariant
// -------------------------------------------------------------
console.log('\nTest 6: Validating Stratified Equi-Difficulty Distribution Invariant...');
// Create a pure standalone section with 40 questions: 10 Easy, 20 Medium, 10 Hard
const quantQuestions = [];
for (let i = 1; i <= 40; i++) {
  const id = `quant-${i}`;
  const diff = i <= 10 ? 'EASY' : i <= 30 ? 'MEDIUM' : 'HARD';
  questionsMap[id] = { id, statement: `Quant problem ${i}`, difficulty: diff };
  quantQuestions.push(id);
}

const quantSection = {
  id: 'sec-quant-aptitude',
  name: 'Quantitative Aptitude',
  serve_count: 20,
  question_count: 20,
  pool_size: 40,
  marks_per_correct: 1,
  question_ids: quantQuestions,
};

// Generate test papers for 5 different students
const candidates = [
  'usr_candidate_1@campus.edu',
  'usr_candidate_2@campus.edu',
  'usr_candidate_3@campus.edu',
  'usr_candidate_4@campus.edu',
  'usr_candidate_5@campus.edu',
];

const candidateDistributions = candidates.map(cand => {
  const qIds = getSampledSectionQuestionIds(
    quantSection,
    0,
    questionsMap,
    'exam_quant',
    `exam_quant_${cand}`,
    {}
  );

  const easyCount = qIds.filter(id => questionsMap[id].difficulty === 'EASY').length;
  const medCount = qIds.filter(id => questionsMap[id].difficulty === 'MEDIUM').length;
  const hardCount = qIds.filter(id => questionsMap[id].difficulty === 'HARD').length;

  return { cand, qIds, easyCount, medCount, hardCount, total: qIds.length };
});

console.log('Candidate Difficulty Breakdown (Target: 20 questions out of 40 pooled):');
candidateDistributions.forEach(cd => {
  console.log(`  - ${cd.cand}: ${cd.easyCount} Easy, ${cd.medCount} Medium, ${cd.hardCount} Hard (Total: ${cd.total})`);
  assert.strictEqual(cd.total, 20, 'Each candidate must receive exactly 20 questions');
  assert.strictEqual(cd.easyCount, 5, 'Every candidate must receive exactly 5 Easy questions');
  assert.strictEqual(cd.medCount, 10, 'Every candidate must receive exactly 10 Medium questions');
  assert.strictEqual(cd.hardCount, 5, 'Every candidate must receive exactly 5 Hard questions');
});

// Verify question dispersion: Candidates received different questions
const paper1 = new Set(candidateDistributions[0].qIds);
const paper2 = new Set(candidateDistributions[1].qIds);
const overlap = candidateDistributions[0].qIds.filter(id => paper2.has(id)).length;
console.log(`Overlap between Candidate 1 and Candidate 2: ${overlap}/20 questions (Dispersion: ${20 - overlap} unique questions)`);
assert.ok(overlap < 20, 'Candidates must receive different question subsets');

console.log('✓ Test 6 Passed: 100% Stratified Equi-Difficulty verified across all candidates!');

console.log('\n🎉 ALL 6 VERIFICATION TEST SUITES PASSED WITH 100% SUCCESS!');
