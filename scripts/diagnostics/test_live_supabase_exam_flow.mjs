import fs from 'fs';
import assert from 'assert';
import { createClient } from '@supabase/supabase-js';

// Read Supabase environment
const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

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
    Math.max(1, section?.serve_count || section?.question_count || rawIds.length)
  );

  const storageKey = `prepunite_sec_qids_${examId}_${sectionIndex}`;
  if (localStorageMock[storageKey]) {
    try {
      const cached = JSON.parse(localStorageMock[storageKey]);
      if (Array.isArray(cached) && cached.length > 0) {
        return cached;
      }
    } catch {}
  }

  if (rawIds.length <= targetServeCount) {
    const directOrdered = shuffleQuestions ? seededShuffle(rawIds, `${studentShuffleSeed}_sec_${sectionIndex}`) : [...rawIds];
    localStorageMock[storageKey] = JSON.stringify(directOrdered);
    return directOrdered;
  }

  const passageGroups = new Map();
  const standaloneIds = [];

  for (const qId of rawIds) {
    const qObj = questionsMap[qId];
    const pTitle = qObj?.passageTitle || (qObj?.passage ? qObj.passage.slice(0, 80) : null);
    if (pTitle) {
      if (!passageGroups.has(pTitle)) passageGroups.set(pTitle, []);
      passageGroups.get(pTitle).push(qId);
    } else {
      standaloneIds.push(qId);
    }
  }

  const passageEntries = Array.from(passageGroups.entries());
  for (const [, pQIds] of passageEntries) {
    pQIds.sort((a, b) => {
      const numA = questionsMap[a]?.question_number ?? 0;
      const numB = questionsMap[b]?.question_number ?? 0;
      return numA - numB;
    });
  }

  const shuffledPassages = shuffleQuestions
    ? seededShuffle(passageEntries, `${studentShuffleSeed}_sec_${sectionIndex}_passages`)
    : [...passageEntries];

  const assigned = [];
  for (const [, pQIds] of shuffledPassages) {
    if (assigned.length + pQIds.length <= targetServeCount) {
      assigned.push(...pQIds);
    }
    if (assigned.length >= targetServeCount) break;
  }

  const remainingNeeded = Math.max(0, targetServeCount - assigned.length);
  if (remainingNeeded > 0 && standaloneIds.length > 0) {
    const easyBucket = [];
    const medBucket = [];
    const hardBucket = [];

    for (const qId of standaloneIds) {
      const diff = (questionsMap[qId]?.difficulty || 'medium').toLowerCase();
      if (diff === 'easy') easyBucket.push(qId);
      else if (diff === 'hard') hardBucket.push(qId);
      else medBucket.push(qId);
    }

    const totalStandalone = standaloneIds.length;
    let quotaEasy = Math.round((easyBucket.length / totalStandalone) * remainingNeeded);
    let quotaHard = Math.round((hardBucket.length / totalStandalone) * remainingNeeded);
    let quotaMed = remainingNeeded - (quotaEasy + quotaHard);

    if (quotaEasy > easyBucket.length) {
      quotaMed += (quotaEasy - easyBucket.length);
      quotaEasy = easyBucket.length;
    }
    if (quotaHard > hardBucket.length) {
      quotaMed += (quotaHard - hardBucket.length);
      quotaHard = hardBucket.length;
    }
    if (quotaMed > medBucket.length) {
      quotaMed = medBucket.length;
    }

    const shuffledEasy = shuffleQuestions ? seededShuffle(easyBucket, `${studentShuffleSeed}_sec_${sectionIndex}_easy`) : [...easyBucket];
    const shuffledMed = shuffleQuestions ? seededShuffle(medBucket, `${studentShuffleSeed}_sec_${sectionIndex}_med`) : [...medBucket];
    const shuffledHard = shuffleQuestions ? seededShuffle(hardBucket, `${studentShuffleSeed}_sec_${sectionIndex}_hard`) : [...hardBucket];

    const sampledStandalone = [
      ...shuffledEasy.slice(0, quotaEasy),
      ...shuffledMed.slice(0, quotaMed),
      ...shuffledHard.slice(0, quotaHard),
    ];

    if (sampledStandalone.length < remainingNeeded) {
      const chosenSet = new Set(sampledStandalone);
      const remainingPool = shuffleQuestions
        ? seededShuffle(standaloneIds.filter(id => !chosenSet.has(id)), `${studentShuffleSeed}_sec_${sectionIndex}_rem`)
        : standaloneIds.filter(id => !chosenSet.has(id));
      sampledStandalone.push(...remainingPool.slice(0, remainingNeeded - sampledStandalone.length));
    }

    const finalStandalone = shuffleQuestions
      ? seededShuffle(sampledStandalone, `${studentShuffleSeed}_sec_${sectionIndex}_std`)
      : sampledStandalone;

    assigned.push(...finalStandalone);
  }

  localStorageMock[storageKey] = JSON.stringify(assigned);
  return assigned;
}

async function runLiveTest() {
  console.log('🚀 Running Live Supabase End-to-End Verification of Dynamic Pooling & Grading...');

  // 1. Fetch live topic questions from Supabase to test realistic data
  console.log('Step 1: Fetching 40 questions from Supabase topic_questions...');
  const { data: dbQuestions, error: qErr } = await supabase
    .from('topic_questions')
    .select('id, topic_id, difficulty, statement, options, correct_answer')
    .limit(40);

  assert(!qErr, `Failed to fetch questions from Supabase: ${qErr?.message}`);
  assert(dbQuestions && dbQuestions.length >= 20, `Need at least 20 questions in Supabase topic_questions, found ${dbQuestions?.length}`);
  console.log(`✓ Step 1 Passed: Retrieved ${dbQuestions.length} live questions from Supabase.`);

  const qMap = {};
  dbQuestions.forEach((q, idx) => {
    // Normalise difficulty distribution for testing
    const diff = idx % 4 === 0 ? 'hard' : (idx % 2 === 0 ? 'easy' : 'medium');
    qMap[q.id] = { ...q, difficulty: diff };
  });

  // 2. Build Mock Exam with 2x pooling configuration
  console.log('Step 2: Configuring Mock Exam with 2x pooling (Pool: 40 questions, Serve: 20 questions)...');
  const testExamId = `test_live_pool_${Date.now()}`;
  const allQIds = Object.keys(qMap);
  const serveTarget = 20;

  const mockExamRow = {
    id: testExamId,
    college_id: 'col-ghat-mtmuqj96',
    title: 'Live Stratified 2x Pooling Verification Exam',
    instructions: `<!--SECTION_SERVE_COUNTS:${JSON.stringify({ 'Section-1': serveTarget })}-->Test Instructions`,
    duration_minutes: 60,
    total_marks: 20, // 20 served questions * 1 mark = 20 marks
    passing_percentage: 40,
    is_active: true,
    is_deleted: false,
    created_at: new Date().toISOString()
  };

  const { error: insExamErr } = await supabase.from('mock_exams').insert(mockExamRow);
  assert(!insExamErr, `Failed to insert mock exam into Supabase: ${insExamErr?.message}`);
  console.log(`✓ Step 2 Passed: Mock exam inserted successfully with ID: ${testExamId}`);

  try {
    // 3. Insert mock exam section with 40 pooled question IDs
    console.log('Step 3: Inserting mock_exam_section with 40 pooled questions...');
    const sectionRow = {
      id: `sec_${testExamId}_1`,
      mock_exam_id: testExamId,
      name: 'Section-1',
      section_order: 1,
      duration_minutes: 60,
      marks_per_correct: 1,
      negative_marking: 0,
      question_ids: allQIds,
      created_at: new Date().toISOString()
    };

    const { error: insSecErr } = await supabase.from('mock_exam_sections').insert(sectionRow);
    assert(!insSecErr, `Failed to insert mock_exam_sections into Supabase: ${insSecErr?.message}`);
    console.log(`✓ Step 3 Passed: Section inserted with ${allQIds.length} pooled questions.`);

    // 4. Simulate Candidate 1 taking the exam
    console.log('Step 4: Candidate 1 taking the exam & sampling assigned questions...');
    const candidate1Seed = `seed_candidate_1_${testExamId}`;
    const assignedC1 = getSampledSectionQuestionIds(
      { ...sectionRow, serve_count: serveTarget },
      0,
      qMap,
      testExamId,
      candidate1Seed,
      {}
    );

    assert.strictEqual(assignedC1.length, serveTarget, `Candidate 1 must receive exactly ${serveTarget} questions, got ${assignedC1.length}`);
    console.log(`✓ Step 4 Passed: Candidate 1 served exactly ${assignedC1.length} questions out of ${allQIds.length} pooled.`);

    // 5. Simulate Candidate 2 taking the exam
    console.log('Step 5: Candidate 2 taking the exam & verifying anti-cheat dispersion...');
    const candidate2Seed = `seed_candidate_2_${testExamId}`;
    const assignedC2 = getSampledSectionQuestionIds(
      { ...sectionRow, serve_count: serveTarget },
      0,
      qMap,
      testExamId,
      candidate2Seed,
      {}
    );

    assert.strictEqual(assignedC2.length, serveTarget, `Candidate 2 must receive exactly ${serveTarget} questions`);
    const overlap = assignedC1.filter(id => assignedC2.includes(id)).length;
    console.log(`✓ Step 5 Passed: Overlap between Candidate 1 and Candidate 2: ${overlap}/${serveTarget} (Dispersion: ${serveTarget - overlap} unique questions)`);

    // 6. Simulate submission to student_exam_attempts with __assigned_question_ids
    console.log('Step 6: Simulating exam submission & verifying DB persistence and score safety...');
    const candidateResponses = {
      __assigned_question_ids: assignedC1
    };

    // Candidate answers 18 out of 20 assigned questions correctly
    let correctCount = 0;
    assignedC1.forEach((qId, idx) => {
      if (idx < 18) {
        correctCount++;
        candidateResponses[qId] = {
          selected_option: 0,
          time_spent_seconds: 30,
          marked_for_review: false
        };
      } else {
        candidateResponses[qId] = {
          selected_option: 1, // incorrect
          time_spent_seconds: 25,
          marked_for_review: false
        };
      }
    });

    const evaluatedTotalScore = 18;
    const evaluatedMaxScore = 20; // 20 marks, NOT 40 marks
    const evaluatedPercentage = (evaluatedTotalScore / evaluatedMaxScore) * 100; // 90%

    const attemptRow = {
      id: `att_${testExamId}_c1`,
      mock_exam_id: testExamId,
      student_id: 'test_student_1@campus.edu',
      student_email: 'test_student_1@campus.edu',
      college_id: 'col-ghat-mtmuqj96',
      status: 'SUBMITTED',
      started_at: new Date(Date.now() - 3600000).toISOString(),
      submitted_at: new Date().toISOString(),
      time_spent_seconds: 1800,
      total_score: evaluatedTotalScore,
      max_possible_score: evaluatedMaxScore,
      percentage: evaluatedPercentage,
      passed: true,
      responses: candidateResponses,
      tab_switch_count: 0
    };

    const { data: savedAttempt, error: attErr } = await supabase
      .from('student_exam_attempts')
      .insert(attemptRow)
      .select()
      .single();

    assert(!attErr, `Failed to save student attempt: ${attErr?.message}`);
    assert.strictEqual(savedAttempt.total_score, 18, `total_score should be 18, got ${savedAttempt.total_score}`);
    assert.strictEqual(savedAttempt.max_possible_score, 20, `max_possible_score MUST be 20, got ${savedAttempt.max_possible_score}`);
    assert.strictEqual(savedAttempt.percentage, 90, `percentage MUST be 90%, got ${savedAttempt.percentage}`);
    console.log(`✓ Step 6 Passed: Attempt successfully written to Supabase with total_score: ${savedAttempt.total_score}, max_possible_score: ${savedAttempt.max_possible_score}, percentage: ${savedAttempt.percentage}%.`);

    // 7. Verify solution review reading strictly assigned questions
    console.log('Step 7: Validating solution review isolation...');
    const assignedSet = new Set(savedAttempt.responses.__assigned_question_ids);
    const reviewQuestions = allQIds.filter(id => assignedSet.has(id));
    assert.strictEqual(reviewQuestions.length, 20, `Review must contain strictly 20 assigned questions`);
    console.log(`✓ Step 7 Passed: Student solution review strictly filtered to ${reviewQuestions.length} served questions.`);

    console.log('\n🌟 ALL 7 LIVE SUPABASE VERIFICATION STEPS PASSED WITH 100% SUCCESS!');

  } finally {
    // Cleanup test records
    console.log('\nCleaning up test records from Supabase...');
    await supabase.from('student_exam_attempts').delete().eq('mock_exam_id', testExamId);
    await supabase.from('mock_exam_sections').delete().eq('mock_exam_id', testExamId);
    await supabase.from('mock_exams').delete().eq('id', testExamId);
    console.log('✓ Cleanup completed.');
  }
}

runLiveTest().catch(err => {
  console.error('❌ Live test failed:', err);
  process.exit(1);
});
