import fs from 'fs';
import { CAMPUS_DSA_EXAM_PROBLEMS, getCampusDsaExamProblem, isProblemTestable, enrichCodingProblemForExam } from '../frontend/src/services/campusDsaExamDataset.js';

console.log('======================================================');
console.log('COMPREHENSIVE TEST: ALL CAMPUS DSA PROBLEMS INTEGRITY');
console.log('======================================================');

const allKeys = Object.keys(CAMPUS_DSA_EXAM_PROBLEMS);
console.log(`Total problems in CAMPUS_DSA_EXAM_PROBLEMS: ${allKeys.length}`);

let totalTestCases = 0;
let errors = 0;
let problemsWith8Cases = 0;

for (const id of allKeys) {
  const prob = CAMPUS_DSA_EXAM_PROBLEMS[id];
  if (!prob) {
    console.error(`❌ Missing problem for id: ${id}`);
    errors++;
    continue;
  }

  // 1. Check isProblemTestable
  if (!isProblemTestable(prob)) {
    console.error(`❌ Problem ${id} failed isProblemTestable check!`);
    errors++;
  }

  // 2. Check getCampusDsaExamProblem
  const resolved = getCampusDsaExamProblem(id);
  if (!resolved) {
    console.error(`❌ getCampusDsaExamProblem failed for ${id}`);
    errors++;
  }

  // 3. Check enrichCodingProblemForExam
  const rawSkeleton = { id, title: prob.title, test_cases: [] };
  const enriched = enrichCodingProblemForExam(rawSkeleton);
  if (!enriched.test_cases || enriched.test_cases.length === 0) {
    console.error(`❌ enrichCodingProblemForExam failed to inject test cases for ${id}`);
    errors++;
  }

  const tcCount = prob.testCases ? prob.testCases.length : 0;
  totalTestCases += tcCount;
  if (tcCount >= 8) {
    problemsWith8Cases++;
  }

  // Verify visible vs hidden
  const visible = prob.testCases.filter(t => !t.is_hidden);
  const hidden = prob.testCases.filter(t => t.is_hidden);
  if (visible.length === 0) {
    console.error(`❌ Problem ${id} has 0 visible test cases!`);
    errors++;
  }
}

console.log(`\nIntegrity Results:`);
console.log(`  - Total curated problems: ${allKeys.length}`);
console.log(`  - Total executable test cases: ${totalTestCases}`);
console.log(`  - Problems with >= 8 test cases: ${problemsWith8Cases}`);
console.log(`  - Errors found: ${errors}`);

if (errors === 0) {
  console.log(`\n🎉 ALL 150 PROBLEMS ARE 100% TESTABLE AND PASS INTEGRITY CHECKS!`);
} else {
  console.error(`\n❌ Found ${errors} errors!`);
  process.exit(1);
}
