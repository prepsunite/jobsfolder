import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { verifyCompanyQuestions, buildCompanyTabs } from './verify_and_build.mjs';
import { CAPGEMINI_QUESTIONS } from './data_capgemini.mjs';
import { DELOITTE_QUESTIONS } from './data_deloitte.mjs';
import { EY_QUESTIONS } from './data_ey.mjs';
import { HCLTECH_QUESTIONS } from './data_hcltech.mjs';
import { HEXAWARE_QUESTIONS } from './data_hexaware.mjs';
import { IBM_QUESTIONS } from './data_ibm.mjs';
import { LTIMINDTREE_QUESTIONS } from './data_ltimindtree.mjs';
import { ORACLE_QUESTIONS } from './data_oracle.mjs';
import { TECH_MAHINDRA_QUESTIONS } from './data_tech_mahindra.mjs';

const COMPANIES = [
  {
    name: 'Capgemini',
    slug: 'capgemini',
    examId: 'dc43c38d-7321-41be-91e6-cdfd76b42cd0',
    r1: 'Round 1: Capgemini Exceller Core Coding (Q1–Q15)',
    r2: 'Round 2: Advanced Algorithms & DS (Q16–Q30)',
    questions: CAPGEMINI_QUESTIONS,
  },
  {
    name: 'Deloitte',
    slug: 'deloitte',
    examId: '618ad61b-1c54-4c70-92cd-d1965a5855b5',
    r1: 'Round 1: Deloitte NLA & Audit Coding (Q1–Q15)',
    r2: 'Round 2: Enterprise Pipelines & Graphs (Q16–Q30)',
    questions: DELOITTE_QUESTIONS,
  },
  {
    name: 'EY',
    slug: 'ey',
    examId: '83b57f50-4f06-405b-ae16-93fc9bd16d4e',
    r1: 'Round 1: EY GDS Core Assessment (Q1–Q15)',
    r2: 'Round 2: Financial & Graph Algorithms (Q16–Q30)',
    questions: EY_QUESTIONS,
  },
  {
    name: 'HCLTech',
    slug: 'hcltech',
    examId: '82afeb26-6028-4d04-abc9-3145163454f3',
    r1: 'Round 1: HCLTech First Careers Coding (Q1–Q15)',
    r2: 'Round 2: Systems & Dynamic Programming (Q16–Q30)',
    questions: HCLTECH_QUESTIONS,
  },
  {
    name: 'Hexaware',
    slug: 'hexaware',
    examId: 'e4cdc005-d630-444f-a969-29e870117f72',
    r1: 'Round 1: Hexaware PGET Core Coding (Q1–Q15)',
    r2: 'Round 2: Advanced Problem Solving (Q16–Q30)',
    questions: HEXAWARE_QUESTIONS,
  },
  {
    name: 'IBM',
    slug: 'ibm',
    examId: 'a64d9f2f-208b-4a54-bafc-5856ddcc77f0',
    r1: 'Round 1: IBM ASE HackerRank Assessment (Q1–Q15)',
    r2: 'Round 2: Cloud & Distributed Algorithms (Q16–Q30)',
    questions: IBM_QUESTIONS,
  },
  {
    name: 'LTIMindtree',
    slug: 'ltimindtree',
    examId: '3c178323-a4c8-40b3-967a-727a1169e6f3',
    r1: 'Round 1: LTIMindtree Ignite Coding (Q1–Q15)',
    r2: 'Round 2: LTIMindtree Edge Algorithms (Q16–Q30)',
    questions: LTIMINDTREE_QUESTIONS,
  },
  {
    name: 'Oracle',
    slug: 'oracle',
    examId: '0245a942-1f97-4170-a52f-a849f6ab0745',
    r1: 'Round 1: Oracle Server Tech Core (Q1–Q15)',
    r2: 'Round 2: Systems, Trees & Graphs (Q16–Q30)',
    questions: ORACLE_QUESTIONS,
  },
  {
    name: 'Tech Mahindra',
    slug: 'tech-mahindra',
    examId: '3329380a-7095-4b15-b794-38ab265e1ed6',
    r1: 'Round 1: Tech Mahindra SuperCoder Core (Q1–Q15)',
    r2: 'Round 2: Advanced SuperCoder Round (Q16–Q30)',
    questions: TECH_MAHINDRA_QUESTIONS,
  },
];

async function main() {
  const verifyOnly = process.argv.includes('--verify-only');

  let totalErrors = 0;
  for (const c of COMPANIES) {
    const errs = verifyCompanyQuestions(c.name, c.questions);
    totalErrors += errs.length;
    console.log(`${c.name.padEnd(15)} | Qs: ${c.questions.length} | Errors: ${errs.length}`);
    for (const e of errs) console.error('  ERR:', e);
  }

  if (totalErrors > 0) {
    console.error(`\nVERIFICATION FAILED with ${totalErrors} error(s). Aborting seed.`);
    process.exit(1);
  }

  console.log('\nALL 270 QUESTIONS VERIFIED SUCCESSFULLY (0 ERRORS).');
  if (verifyOnly) return;

  const envText = fs.readFileSync('.env', 'utf8');
  const env = {};
  envText.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
  });
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  for (const c of COMPANIES) {
    const tabs = buildCompanyTabs(c.slug, c.name, c.r1, c.r2, c.questions);
    const oldPapers = `### ${c.name} Verified Past Placement Papers & Coding Archive\n\nAccess ${c.questions.length} verified ${c.name} placement coding questions with constraints, 4 verified test cases each, and complete Java & Python solutions.`;
    const { error } = await supabase
      .from('exams')
      .update({
        company_slug: c.slug,
        paper_tabs: tabs,
        old_papers: oldPapers,
        updated_at: new Date().toISOString(),
      })
      .eq('id', c.examId);

    if (error) {
      console.error(`Failed to update ${c.name}:`, error.message);
      process.exit(1);
    }
    console.log(`Seeded ${c.name} (${c.examId}) -> ${c.questions.length} questions, 2 tabs.`);
  }
}

main();
