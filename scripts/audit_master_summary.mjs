import fs from 'fs';
import { parsePaperQuestions, ensureFourTestCases } from '../frontend/src/utils/paperQuestionParser.ts';

const exams = JSON.parse(fs.readFileSync('scripts/backup_exams_paper_tabs.json', 'utf8'));

const COMPANY_MAP = {
  'f0c83ceb-5929-4e53-910a-9d89b2304a5d': 'Infosys',
  'b26ae50e-b184-46e3-a28b-12a60509df19': 'Amazon',
  'dfcd4385-2687-4e5b-95c0-f4bbfab4cb33': 'Google',
  'e0000000-0000-0000-0000-000000000001': 'TCS NQT',
  '03c60f42-9526-4075-b47b-f26784b62901': 'Accenture',
  '030fcb39-e2a3-4c40-836f-32c5d87c6b19': 'Cognizant',
  '6a4952bf-52e1-4705-aea9-2ede3ad89879': 'Wipro',
};

function analyzeInputParams(inputStr) {
  if (!inputStr) return [];
  const lines = inputStr.trim().split(/\n+/);
  const vars = [];
  for (const line of lines) {
    const assigns = line.matchAll(/([a-zA-Z0-9_$]+)\s*=/g);
    for (const a of assigns) {
      vars.push(a[1]);
    }
  }
  return [...new Set(vars)];
}

console.log('================================================================================');
console.log('MASTER AUDIT: ALL 7 COMPANIES & 621 PLACEMENT PAPER QUESTIONS');
console.log('================================================================================\n');

let grandTotalQs = 0;
let grandTotalIssues = 0;

for (const [examId, compName] of Object.entries(COMPANY_MAP)) {
  const exam = exams.find(e => e.id === examId);
  if (!exam) continue;

  const questions = [];
  function scan(nodes, parentTab = '') {
    for (const n of nodes || []) {
      const tabName = n.title || parentTab;
      if (n.content) {
        const qs = parsePaperQuestions(n.content);
        for (const q of qs) {
          questions.push({ ...q, tabName });
        }
      }
      if (n.children) scan(n.children, tabName);
    }
  }
  scan(exam.paper_tabs);

  grandTotalQs += questions.length;
  let compDuplicates = 0;
  let compParamMismatches = 0;
  let compMissingCases = 0;
  let compEmptyInOut = 0;

  for (const q of questions) {
    const cleanTitle = q.cleanTitle || q.title;
    const finalSuite = ensureFourTestCases(q.testCases, cleanTitle);

    if (finalSuite.length < 4) {
      compMissingCases++;
    }

    const inputs = finalSuite.map(c => (c.input || '').trim());
    const uniqueInputs = new Set(inputs);
    if (uniqueInputs.size < finalSuite.length) {
      compDuplicates++;
      console.log(`[${compName}] Duplicate input in Q${q.number} ${cleanTitle}`);
    }

    for (const c of finalSuite) {
      if (!c.input || c.output === undefined || c.output === null || c.output === '') {
        compEmptyInOut++;
      }
    }

    // Param mismatch check
    const paramSets = inputs.map(analyzeInputParams);
    if (paramSets.some(ps => ps.length > 0)) {
      const p1 = paramSets[0].sort().join(',');
      for (let i = 1; i < paramSets.length; i++) {
        const pi = paramSets[i].sort().join(',');
        if (p1 && pi && p1 !== pi) {
          compParamMismatches++;
          console.log(`[${compName}] Param mismatch in Q${q.number} ${cleanTitle}: Case 1 [${p1}] vs Case ${i + 1} [${pi}]`);
        }
      }
    }
  }

  const compIssues = compDuplicates + compParamMismatches + compMissingCases + compEmptyInOut;
  grandTotalIssues += compIssues;

  console.log(`COMPANY: ${compName.padEnd(10)} | Questions: ${String(questions.length).padStart(3)} | Dup Cases: ${compDuplicates} | Param Mismatches: ${compParamMismatches} | Missing Cases: ${compMissingCases} | Empty In/Out: ${compEmptyInOut} | Status: ${compIssues === 0 ? '✔ PERFECT' : '⚠️ ISSUES'}`);
}

console.log('\n================================================================================');
console.log(`GRAND TOTAL QUESTIONS AUDITED: ${grandTotalQs}`);
console.log(`GRAND TOTAL CRITICAL ISSUES:   ${grandTotalIssues}`);
console.log('================================================================================');
