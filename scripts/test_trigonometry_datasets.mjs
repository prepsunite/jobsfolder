import fs from 'fs';
import path from 'path';
import assert from 'assert';

const files = [
  { name: 'trigonometry_easy_10.json', expectedCount: 10, expectedDiff: 'EASY', expectedLevel: 1 },
  { name: 'trigonometry_medium_10.json', expectedCount: 10, expectedDiff: 'MEDIUM', expectedLevel: 2 },
  { name: 'trigonometry_hard_10.json', expectedCount: 10, expectedDiff: 'HARD', expectedLevel: 3 },
  { name: 'trigonometry_all_30.json', expectedCount: 30, expectedDiff: null, expectedLevel: null }
];

console.log('--- RUNNING TRIGONOMETRY DATASET INTEGRITY TESTS ---');

let totalTests = 0;
let passedTests = 0;

for (const f of files) {
  const filePath = path.resolve('database/datasets', f.name);
  assert(fs.existsSync(filePath), `File does not exist: ${filePath}`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  assert(Array.isArray(data), `${f.name} is not an array`);
  assert.strictEqual(data.length, f.expectedCount, `${f.name} count mismatch: expected ${f.expectedCount}, got ${data.length}`);

  for (let i = 0; i < data.length; i++) {
    const q = data[i];
    totalTests++;
    assert(q.id && typeof q.id === 'string', `Question ${i + 1} in ${f.name} missing string id`);
    assert(q.statement && q.statement.trim().length > 10, `Question ${i + 1} has invalid statement`);
    assert(Array.isArray(q.options) && q.options.length === 4, `Question ${i + 1} must have exactly 4 options`);
    
    const keys = q.options.map(o => o.key);
    assert.deepStrictEqual(keys, ['A', 'B', 'C', 'D'], `Question ${i + 1} options keys must be A, B, C, D`);
    
    assert(typeof q.correct_answer === 'number' && q.correct_answer >= 0 && q.correct_answer <= 3, `Question ${i + 1} invalid correct_answer`);
    assert.strictEqual(['A', 'B', 'C', 'D'][q.correct_answer], q.correctAnswer, `Question ${i + 1} correctAnswer mismatch`);
    
    assert(q.explanation && q.explanation.trim().length > 0, `Question ${i + 1} explanation missing`);
    assert(q.structured_explanation && typeof q.structured_explanation === 'object', `Question ${i + 1} structured_explanation missing`);
    assert(Array.isArray(q.structured_explanation.steps) && q.structured_explanation.steps.length >= 2, `Question ${i + 1} steps insufficient`);
    assert(q.structured_explanation.shortcut, `Question ${i + 1} missing shortcut`);
    assert(Array.isArray(q.structured_explanation.formulaUsed) && q.structured_explanation.formulaUsed.length >= 1, `Question ${i + 1} missing formulaUsed`);
    assert(q.structured_explanation.finalAnswer, `Question ${i + 1} missing finalAnswer`);

    if (f.expectedDiff) {
      assert.strictEqual(q.difficulty, f.expectedDiff, `Difficulty mismatch in ${f.name}`);
      assert.strictEqual(q.difficulty_level, f.expectedLevel, `Difficulty level mismatch in ${f.name}`);
    }
    passedTests++;
  }
  console.log(`✓ ${f.name}: Verified ${data.length} questions successfully.`);
}

console.log(`\nALL ${passedTests}/${totalTests} QUESTION ASSERTIONS PASSED.`);
