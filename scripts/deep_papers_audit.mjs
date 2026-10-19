import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { parsePaperQuestions, ensureFourTestCases } from '../frontend/src/utils/paperQuestionParser.ts';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function deepAudit() {
  console.log('========================================================================');
  console.log('           PREPUNITE DEEP PLACEMENT PAPERS AUDIT');
  console.log('========================================================================');
  
  const { data: exams, error } = await supabase.from('exams').select('id, name, paper_tabs');
  if (error) {
    console.error('Supabase query error:', error);
    process.exit(1);
  }

  let totalQuestions = 0;
  let questionsWithHtmlInTestCases = [];
  let questionsWithEmptyFields = [];
  let questionsWithDuplicateCases = [];
  let questionsWithFewerThanFourCases = [];
  let questionsWithMalformedCases = [];
  let companyStats = {};

  function traverseNodes(nodes, examName, filePath = '') {
    for (const node of nodes || []) {
      const currentPath = filePath ? `${filePath} > ${node.title}` : node.title;
      if (node.content) {
        const parsed = parsePaperQuestions(node.content);
        if (parsed.length > 0) {
          companyStats[examName] = companyStats[examName] || { files: 0, questions: 0 };
          companyStats[examName].files++;
          companyStats[examName].questions += parsed.length;

          for (const q of parsed) {
            totalQuestions++;
            const fourCases = ensureFourTestCases(q.testCases, q.cleanTitle);

            // Check 1: Fewer than 4 cases in raw paper
            if (q.testCases.length < 4) {
              questionsWithFewerThanFourCases.push({
                exam: examName,
                path: currentPath,
                title: q.title,
                rawCount: q.testCases.length,
                synthesizedCount: fourCases.length
              });
            }

            // Check 2: HTML tags or entities in input or output
            const htmlTagRegex = /<[^>]+>|&(?:quot|amp|lt|gt|#39|nbsp);/i;
            q.testCases.forEach((tc, idx) => {
              if (htmlTagRegex.test(tc.input) || htmlTagRegex.test(tc.output)) {
                questionsWithHtmlInTestCases.push({
                  exam: examName,
                  path: currentPath,
                  title: q.title,
                  caseIdx: idx + 1,
                  input: tc.input,
                  output: tc.output
                });
              }

              // Check 3: Empty input or output
              if (!tc.input || tc.input.trim().length === 0 || !tc.output || tc.output.trim().length === 0) {
                questionsWithEmptyFields.push({
                  exam: examName,
                  path: currentPath,
                  title: q.title,
                  caseIdx: idx + 1,
                  input: tc.input,
                  output: tc.output
                });
              }

              // Check 4: Suspicious contents (like "Explanation" or "Constraints" leaked into output)
              if (/(?:explanation|constraints|sample input|sample output)/i.test(tc.output)) {
                questionsWithMalformedCases.push({
                  exam: examName,
                  path: currentPath,
                  title: q.title,
                  caseIdx: idx + 1,
                  issue: 'Prompt headers leaked into output',
                  output: tc.output
                });
              }
            });

            // Check 5: Duplicate inputs across test cases
            const inputs = q.testCases.map(tc => tc.input.trim()).filter(Boolean);
            const uniqueInputs = new Set(inputs);
            if (inputs.length > 1 && uniqueInputs.size < inputs.length) {
              questionsWithDuplicateCases.push({
                exam: examName,
                path: currentPath,
                title: q.title,
                cases: q.testCases.map(tc => tc.input)
              });
            }
          }
        }
      }
      if (node.children) {
        traverseNodes(node.children, examName, currentPath);
      }
    }
  }

  for (const exam of exams || []) {
    traverseNodes(exam.paper_tabs, exam.name);
  }

  console.log(`\nCompany Summary:`);
  console.table(companyStats);
  console.log(`Total questions audited: ${totalQuestions}`);

  console.log(`\n--- FINDINGS SUMMARY ---`);
  console.log(`1. Questions with HTML tags/entities in test cases: ${questionsWithHtmlInTestCases.length}`);
  console.log(`2. Questions with empty input or output:             ${questionsWithEmptyFields.length}`);
  console.log(`3. Questions with prompt headers leaked in output:   ${questionsWithMalformedCases.length}`);
  console.log(`4. Questions with duplicate inputs across cases:     ${questionsWithDuplicateCases.length}`);
  console.log(`5. Questions with fewer than 4 test cases in raw db: ${questionsWithFewerThanFourCases.length}`);

  if (questionsWithHtmlInTestCases.length > 0) {
    console.log(`\nDetails: HTML in Test Cases (First 10):`);
    console.dir(questionsWithHtmlInTestCases.slice(0, 10), { depth: null });
  }

  if (questionsWithEmptyFields.length > 0) {
    console.log(`\nDetails: Empty Fields:`);
    console.dir(questionsWithEmptyFields, { depth: null });
  }

  if (questionsWithMalformedCases.length > 0) {
    console.log(`\nDetails: Malformed Cases:`);
    console.dir(questionsWithMalformedCases, { depth: null });
  }

  if (questionsWithDuplicateCases.length > 0) {
    console.log(`\nDetails: Duplicate Cases (First 10):`);
    console.dir(questionsWithDuplicateCases.slice(0, 10), { depth: null });
  }

  if (questionsWithFewerThanFourCases.length > 0) {
    console.log(`\nDetails: Fewer than 4 cases in DB (First 15):`);
    console.dir(questionsWithFewerThanFourCases.slice(0, 15), { depth: null });
  }
}

deepAudit();
