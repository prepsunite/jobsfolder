import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { parsePaperQuestions, inferQuestionDifficulty } from '../frontend/src/utils/paperQuestionParser.ts';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function runAudit() {
  console.log('Fetching all active exams from database...');
  const { data: exams, error } = await supabase
    .from('exams')
    .select('id, name, company_id, paper_tabs, companies(name, slug)')
    .eq('is_deleted', false)
    .order('name');

  if (error) {
    console.error('Database fetch error:', error);
    process.exit(1);
  }

  console.log(`Found ${exams.length} active exams.`);

  const allQuestions = [];
  const paperSummaries = [];

  for (const ex of exams) {
    const companyName = ex.companies?.name || 'Unknown Company';
    const paperTabs = ex.paper_tabs || [];
    let examQCount = 0;

    for (const [tabIdx, tab] of paperTabs.entries()) {
      const content = tab.content || '';
      const questions = parsePaperQuestions(content);

      if (questions.length > 0) {
        examQCount += questions.length;
        for (const q of questions) {
          allQuestions.push({
            examId: ex.id,
            examName: ex.name,
            companyName,
            tabTitle: tab.title || `Tab ${tabIdx + 1}`,
            qNumber: q.number,
            title: q.title,
            cleanTitle: q.cleanTitle,
            difficulty: q.difficulty,
            testCaseCount: q.testCases.length,
            testCases: q.testCases,
            constraintsCount: q.constraints.length,
            constraints: q.constraints,
            descriptionLength: (q.description || '').length,
          });
        }
      }
    }

    if (examQCount > 0) {
      paperSummaries.push({
        examName: ex.name,
        companyName,
        questionCount: examQCount,
        tabsCount: paperTabs.length,
      });
    }
  }

  console.log(`Total questions parsed across all papers: ${allQuestions.length}\n`);

  // Group by Test Case Count
  const tcCounts = {};
  allQuestions.forEach(q => {
    tcCounts[q.testCaseCount] = (tcCounts[q.testCaseCount] || 0) + 1;
  });

  // Group by Difficulty
  const diffCounts = {};
  allQuestions.forEach(q => {
    diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
  });

  console.log('====================================================');
  console.log('                  AUDIT SUMMARY                     ');
  console.log('====================================================');
  console.log(`Total Papers with Questions: ${paperSummaries.length}`);
  console.log(`Total Coding Questions:      ${allQuestions.length}`);
  console.log('\nDifficulty Distribution:');
  for (const [d, count] of Object.entries(diffCounts)) {
    console.log(`  ${d.padEnd(8)}: ${count} (${Math.round(count / allQuestions.length * 100)}%)`);
  }

  console.log('\nTest Case Count Distribution:');
  for (const [tc, count] of Object.entries(tcCounts).sort((a,b) => Number(a[0]) - Number(b[0]))) {
    console.log(`  ${tc} Test Cases: ${count} questions (${Math.round(count / allQuestions.length * 100)}%)`);
  }

  console.log('\n====================================================');
  console.log('       QUESTIONS WITH FEWER THAN 4 TEST CASES       ');
  console.log('====================================================');
  const fewerThan4 = allQuestions.filter(q => q.testCaseCount < 4);
  console.log(`Count: ${fewerThan4.length} / ${allQuestions.length}`);
  fewerThan4.forEach((q, idx) => {
    console.log(`${(idx + 1).toString().padStart(3)}. [${q.difficulty.padEnd(6)}] [${q.companyName}] ${q.cleanTitle} -> ${q.testCaseCount} test cases`);
  });

  console.log('\n====================================================');
  console.log('          DETAILED QUESTION-BY-QUESTION LIST         ');
  console.log('====================================================');
  allQuestions.forEach((q, idx) => {
    console.log(`Q${(idx + 1).toString().padStart(3)} | [${q.difficulty.padEnd(6)}] | ${q.testCaseCount} TCs | [${q.companyName} - ${q.examName}] ${q.cleanTitle}`);
  });

  // Save full JSON report
  fs.writeFileSync(
    'scripts/audit_paper_questions_report.json',
    JSON.stringify({ summary: { totalQuestions: allQuestions.length, diffCounts, tcCounts }, allQuestions }, null, 2)
  );
  console.log('\nFull JSON report saved to scripts/audit_paper_questions_report.json');
}

runAudit();
