import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/coding_bank/all_88_verified_problems.json', 'utf8'));

let tsContent = `/**
 * Auto-generated Placement-Enriched Dataset for 88 Campus DSA Problems
 * All 88 problems contain placement problem statements, standard I/O format,
 * and 8 verified Judge0 test cases (3 visible + 5 hidden edge cases).
 */

import type { CampusDsaExamProblem } from './campusDsaExamDataset';

export const ADDITIONAL_CAMPUS_DSA_PROBLEMS: Record<string, CampusDsaExamProblem> = {
`;

for (const p of data) {
  const probObj = {
    id: p.id,
    leetcodeNumber: p.leetcodeNumber,
    title: p.title,
    slug: p.slug,
    category: p.category,
    difficulty: p.difficulty,
    description: p.description,
    inputFormat: p.inputFormat,
    outputFormat: p.outputFormat,
    constraints: p.constraints,
    sampleInput: p.sampleInput,
    sampleOutput: p.sampleOutput,
    explanation: p.explanation,
    testCases: p.testCases
  };
  tsContent += `  '${p.id}': ${JSON.stringify(probObj, null, 2).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')},\n\n`;
}

tsContent += '};\n';

fs.writeFileSync('frontend/src/services/campusDsaRoadmapEnriched.ts', tsContent);
console.log(`Successfully generated frontend/src/services/campusDsaRoadmapEnriched.ts (${data.length} problems, ${data.reduce((acc, p) => acc + p.testCases.length, 0)} test cases)`);
