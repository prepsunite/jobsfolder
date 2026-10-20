import fs from 'fs';
import { parsePaperQuestions, ensureFourTestCases } from '../frontend/src/utils/paperQuestionParser.ts';

const exams = JSON.parse(fs.readFileSync('scripts/backup_exams_paper_tabs.json', 'utf8'));

console.log('Auditing all 17 exams with parsePaperQuestions & ensureFourTestCases...');

let totalQuestionsAllExams = 0;
let totalDuplicates = 0;
const companySummary = [];

for (const exam of exams) {
  let examQs = 0;
  let examDupes = 0;
  const examFailures = [];

  function scan(nodes) {
    for (const n of nodes || []) {
      if (n.content) {
        const qs = parsePaperQuestions(n.content);
        for (const q of qs) {
          examQs++;
          const suite = ensureFourTestCases(q.testCases, q.cleanTitle);
          const c3 = suite[2];
          const c4 = suite[3];
          if (c3 && c4 && c3.input.trim() === c4.input.trim() && c3.output.trim() === c4.output.trim()) {
            examDupes++;
            examFailures.push({ title: q.cleanTitle, number: q.number, input: c3.input });
          }
        }
      }
      if (n.children) scan(n.children);
    }
  }

  scan(exam.paper_tabs);
  if (examQs > 0) {
    totalQuestionsAllExams += examQs;
    totalDuplicates += examDupes;
    companySummary.push({
      name: exam.name,
      id: exam.id,
      questions: examQs,
      duplicates: examDupes,
      failures: examFailures
    });
  }
}

console.log('\n================================================================');
console.log('                 CROSS-COMPANY EXAM AUDIT RESULTS');
console.log('================================================================');
companySummary.forEach(c => {
  console.log(`- ${c.name} (${c.questions} Qs): ${c.duplicates === 0 ? '✔ 0 Duplicates' : `❌ ${c.duplicates} Duplicates`}`);
});
console.log('----------------------------------------------------------------');
console.log(`Total questions across all exams: ${totalQuestionsAllExams}`);
console.log(`Total duplicates (Case 3 === Case 4): ${totalDuplicates}`);
console.log('================================================================\n');

if (totalDuplicates > 0) {
  console.log('Sample duplicates from other companies:');
  const samples = companySummary.filter(c => c.duplicates > 0).flatMap(c => c.failures.map(f => ({ company: c.name, ...f }))).slice(0, 10);
  console.log(samples);
}
