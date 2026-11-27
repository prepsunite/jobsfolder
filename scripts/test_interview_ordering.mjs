import assert from 'node:assert';
import fs from 'node:fs';

// Pre-populate env from frontend/.env for node environment
if (fs.existsSync('frontend/.env')) {
  const envContent = fs.readFileSync('frontend/.env', 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      process.env[match[1]] = (match[2] || '').trim();
    }
  }
}

import { interviewService, sortQuestionsProgressive, DIFFICULTY_WEIGHT } from '../frontend/src/services/interview.service.ts';
import { ALL_INTERVIEW_TOPICS } from '../frontend/src/services/interviewTopicsData.ts';

console.log('--- TEST 1: sortQuestionsProgressive Unit Assertions ---');
const dummy = [
  { id: '3', title: 'Hard Q1', difficulty: 'HARD', sort_order: 1 },
  { id: '1', title: 'Easy Q2', difficulty: 'EASY', sort_order: 2 },
  { id: '2', title: 'Easy Q1', difficulty: 'EASY', sort_order: 1 },
  { id: '4', title: 'Medium Q1', difficulty: 'MEDIUM', sort_order: 1 },
];
const sortedDummy = sortQuestionsProgressive(dummy);
assert.strictEqual(sortedDummy[0].id, '2', 'Easy Q1 with sort_order 1 should be first');
assert.strictEqual(sortedDummy[1].id, '1', 'Easy Q2 with sort_order 2 should be second');
assert.strictEqual(sortedDummy[2].id, '4', 'Medium Q1 should be third');
assert.strictEqual(sortedDummy[3].id, '3', 'Hard Q1 should be fourth');
console.log('✓ sortQuestionsProgressive correctly orders EASY -> MEDIUM -> HARD and respects sort_order');

console.log('\n--- TEST 2: Validating All Topics Progression (Parallel Fetch) ---');

async function testAllTopics() {
  const topics = ALL_INTERVIEW_TOPICS;
  console.time('parallel-fetch-all-topics');

  const topicResults = await Promise.all(
    topics.map(async topic => {
      const questions = await interviewService.getQuestionsForTopic(topic.id);
      return { topic, questions };
    })
  );

  console.timeEnd('parallel-fetch-all-topics');

  let totalCheckedQuestions = 0;
  const topicStats = {};

  for (const { topic, questions } of topicResults) {
    assert(questions.length > 0, `Topic ${topic.id} should have questions`);
    totalCheckedQuestions += questions.length;

    let prevWeight = 0;
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const weight = DIFFICULTY_WEIGHT[q.difficulty || 'MEDIUM'] || 2;
      if (q.difficulty === 'EASY') easyCount++;
      else if (q.difficulty === 'MEDIUM') mediumCount++;
      else if (q.difficulty === 'HARD') hardCount++;

      // Assert non-decreasing difficulty progression (Basic -> Intermediate -> Advanced)
      assert(
        weight >= prevWeight,
        `Topic ${topic.id}: Question ${q.id} (index ${i}, ${q.difficulty}) broke progression after weight ${prevWeight}`
      );
      prevWeight = weight;
    }

    assert(
      easyCount > 0,
      `Topic ${topic.id} must have foundational EASY questions (got ${easyCount})`
    );

    topicStats[topic.id] = {
      name: topic.title || topic.name,
      total: questions.length,
      EASY: easyCount,
      MEDIUM: mediumCount,
      HARD: hardCount,
      progressionValid: true,
    };
  }

  console.table(topicStats);
  console.log(`\n✓ All ${topics.length} topics validated (${totalCheckedQuestions} questions total).`);
  console.log('✓ Every topic strictly follows: Basic (EASY) -> Intermediate (MEDIUM) -> Advanced (HARD)');

  console.log('\n--- TEST 3: Validating Category-Level Progressive Sorting ---');
  const catResults = await Promise.all([
    interviewService.getQuestionsForCategory('CORE_CS'),
    interviewService.getQuestionsForCategory('HR_BEHAVIORAL'),
    interviewService.getQuestionsForCategory('PROJECT_DEFENSE'),
  ]);

  const catNames = ['CORE_CS', 'HR_BEHAVIORAL', 'PROJECT_DEFENSE'];
  catResults.forEach((catQuestions, idx) => {
    const cat = catNames[idx];
    assert(catQuestions.length > 0, `Category ${cat} should have questions`);
    let prevWeight = 0;
    for (const q of catQuestions) {
      const weight = DIFFICULTY_WEIGHT[q.difficulty || 'MEDIUM'] || 2;
      assert(weight >= prevWeight, `Category ${cat}: Question ${q.id} broke progression`);
      prevWeight = weight;
    }
    console.log(`✓ Category ${cat} (${catQuestions.length} questions) verified sorted Basic -> Medium -> Hard.`);
  });

  console.log('\nALL INTERVIEW PROGRESSION TESTS PASSED SUCCESSFULLY! (VERDICT: PASS)');
}

testAllTopics().catch(err => {
  console.error('\nVERDICT: FAIL - Interview ordering test failed:', err);
  process.exit(1);
});
