import fs from 'fs';
import { CAMPUS_DSA_EXAM_PROBLEMS } from '../frontend/src/services/campusDsaExamDataset.js';

const under8 = [];
for (const [id, p] of Object.entries(CAMPUS_DSA_EXAM_PROBLEMS)) {
  if (p.testCases.length < 8) {
    under8.push({
      id,
      title: p.title,
      category: p.category,
      count: p.testCases.length,
      sampleInput: p.sampleInput,
      sampleOutput: p.sampleOutput,
      existingInputs: p.testCases.map(tc => tc.input)
    });
  }
}

console.log(`Found ${under8.length} problems with < 8 test cases.`);
fs.writeFileSync('scripts/under_8_problems.json', JSON.stringify(under8, null, 2));
console.log('Saved to scripts/under_8_problems.json');
