import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { verifyCompanyQuestions, buildQuestionHtml } from './verify_and_build.mjs';

import { CAPGEMINI_QUESTIONS } from './data_capgemini.mjs';
import { CAPGEMINI_P2 } from './data_capgemini_p2.mjs';
import { DELOITTE_QUESTIONS } from './data_deloitte.mjs';
import { DELOITTE_P2 } from './data_deloitte_p2.mjs';
import { EY_QUESTIONS } from './data_ey.mjs';
import { EY_P2 } from './data_ey_p2.mjs';
import { HCLTECH_QUESTIONS } from './data_hcltech.mjs';
import { HCLTECH_P2 } from './data_hcltech_p2.mjs';
import { HEXAWARE_QUESTIONS } from './data_hexaware.mjs';
import { HEXAWARE_P2 } from './data_hexaware_p2.mjs';
import { IBM_QUESTIONS } from './data_ibm.mjs';
import { IBM_P2 } from './data_ibm_p2.mjs';
import { LTIMINDTREE_QUESTIONS } from './data_ltimindtree.mjs';
import { LTIMINDTREE_P2 } from './data_ltimindtree_p2.mjs';
import { ORACLE_QUESTIONS } from './data_oracle.mjs';
import { ORACLE_P2 } from './data_oracle_p2.mjs';
import { TECH_MAHINDRA_QUESTIONS } from './data_tech_mahindra.mjs';
import { TECH_MAHINDRA_P2 } from './data_tech_mahindra_p2.mjs';
import { CISCO_QUESTIONS } from './data_cisco.mjs';
import { WIPRO_EXTRA } from './data_wipro_extra.mjs';
import { COGNIZANT_EXTRA } from './data_cognizant_extra.mjs';

function buildThreeTabs(slug, t1, t2, t3, questions) {
  return [
    { id: `${slug}-round-1`, title: t1, isFree: true, content: questions.slice(0, 15).map(buildQuestionHtml).join('\n\n'), children: [] },
    { id: `${slug}-round-2`, title: t2, isFree: false, content: questions.slice(15, 35).map(buildQuestionHtml).join('\n\n'), children: [] },
    { id: `${slug}-round-3`, title: t3, isFree: false, content: questions.slice(35, 50).map(buildQuestionHtml).join('\n\n'), children: [] },
  ];
}

const NINE_COMPANIES = [
  { name: 'Capgemini', slug: 'capgemini', examId: 'dc43c38d-7321-41be-91e6-cdfd76b42cd0', t1: 'Round 1: Capgemini Exceller Core (Q1–Q15)', t2: 'Round 2: Algorithms & Problem Solving (Q16–Q35)', t3: 'Round 3: Interview Coding Set (Q36–Q50)', questions: [...CAPGEMINI_QUESTIONS, ...CAPGEMINI_P2] },
  { name: 'Deloitte', slug: 'deloitte', examId: '618ad61b-1c54-4c70-92cd-d1965a5855b5', t1: 'Round 1: Deloitte NLA & Audit (Q1–Q15)', t2: 'Round 2: Pipelines & Graphs (Q16–Q35)', t3: 'Round 3: Interview Coding Set (Q36–Q50)', questions: [...DELOITTE_QUESTIONS, ...DELOITTE_P2] },
  { name: 'EY', slug: 'ey', examId: '83b57f50-4f06-405b-ae16-93fc9bd16d4e', t1: 'Round 1: EY GDS Core Assessment (Q1–Q15)', t2: 'Round 2: Financial & Graph Algos (Q16–Q35)', t3: 'Round 3: Interview Coding Set (Q36–Q50)', questions: [...EY_QUESTIONS, ...EY_P2] },
  { name: 'HCLTech', slug: 'hcltech', examId: '82afeb26-6028-4d04-abc9-3145163454f3', t1: 'Round 1: HCLTech First Careers (Q1–Q15)', t2: 'Round 2: Systems & DP (Q16–Q35)', t3: 'Round 3: Interview Coding Set (Q36–Q50)', questions: [...HCLTECH_QUESTIONS, ...HCLTECH_P2] },
  { name: 'Hexaware', slug: 'hexaware', examId: 'e4cdc005-d630-444f-a969-29e870117f72', t1: 'Round 1: Hexaware PGET Core (Q1–Q15)', t2: 'Round 2: Advanced Coding (Q16–Q35)', t3: 'Round 3: Interview Coding Set (Q36–Q50)', questions: [...HEXAWARE_QUESTIONS, ...HEXAWARE_P2] },
  { name: 'IBM', slug: 'ibm', examId: 'a64d9f2f-208b-4a54-bafc-5856ddcc77f0', t1: 'Round 1: IBM ASE HackerRank (Q1–Q15)', t2: 'Round 2: Cloud & Distributed (Q16–Q35)', t3: 'Round 3: Interview Coding Set (Q36–Q50)', questions: [...IBM_QUESTIONS, ...IBM_P2] },
  { name: 'LTIMindtree', slug: 'ltimindtree', examId: '3c178323-a4c8-40b3-967a-727a1169e6f3', t1: 'Round 1: LTIMindtree Ignite (Q1–Q15)', t2: 'Round 2: LTIMindtree Edge (Q16–Q35)', t3: 'Round 3: Interview Coding Set (Q36–Q50)', questions: [...LTIMINDTREE_QUESTIONS, ...LTIMINDTREE_P2] },
  { name: 'Oracle', slug: 'oracle', examId: '0245a942-1f97-4170-a52f-a849f6ab0745', t1: 'Round 1: Oracle Server Tech (Q1–Q15)', t2: 'Round 2: Systems & Graphs (Q16–Q35)', t3: 'Round 3: Interview Coding Set (Q36–Q50)', questions: [...ORACLE_QUESTIONS, ...ORACLE_P2] },
  { name: 'Tech Mahindra', slug: 'tech-mahindra', examId: '3329380a-7095-4b15-b794-38ab265e1ed6', t1: 'Round 1: SuperCoder Core (Q1–Q15)', t2: 'Round 2: SuperCoder Advanced (Q16–Q35)', t3: 'Round 3: Interview Coding Set (Q36–Q50)', questions: [...TECH_MAHINDRA_QUESTIONS, ...TECH_MAHINDRA_P2] },
];

async function main() {
  const allSets = [
    ...NINE_COMPANIES.map(c => [c.name, c.questions]),
    ['Cisco', CISCO_QUESTIONS],
    ['Wipro Extra', WIPRO_EXTRA],
    ['Cognizant Extra', COGNIZANT_EXTRA],
  ];

  let totalErrors = 0;
  for (const [name, qs] of allSets) {
    const errs = verifyCompanyQuestions(name, qs);
    totalErrors += errs.length;
    console.log(`${name.padEnd(16)} | Qs: ${String(qs.length).padStart(2)} | Errors: ${errs.length}`);
    for (const e of errs) console.error('  ERR:', e);
  }

  if (totalErrors > 0) {
    console.error(`\nVERIFICATION FAILED with ${totalErrors} error(s). Aborting seed.`);
    process.exit(1);
  }
  console.log('\nALL 535 QUESTIONS VERIFIED SUCCESSFULLY (0 ERRORS).');

  const envText = fs.readFileSync('.env', 'utf8');
  const env = {};
  envText.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
  });
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // 1. Update 9 companies to 50 questions each
  for (const c of NINE_COMPANIES) {
    const tabs = buildThreeTabs(c.slug, c.t1, c.t2, c.t3, c.questions);
    const oldPapers = `### ${c.name} Verified Past Placement Papers & Coding Archive\n\nAccess 50 verified ${c.name} placement coding questions with constraints, 4 verified test cases each, and complete Java & Python solutions.`;
    const { error } = await supabase
      .from('exams')
      .update({ company_slug: c.slug, paper_tabs: tabs, old_papers: oldPapers, updated_at: new Date().toISOString() })
      .eq('id', c.examId);
    if (error) { console.error(`Failed ${c.name}:`, error.message); process.exit(1); }
    console.log(`Seeded ${c.name} -> 50 Qs`);
  }

  // 2. Append Wipro Extra (Q20-Q50)
  {
    const { data: wExam } = await supabase.from('exams').select('paper_tabs').eq('id', '6a4952bf-52e1-4705-aea9-2ede3ad89879').single();
    const baseTabs = (wExam.paper_tabs || []).filter(t => t.id !== 'wipro-batch-20-50');
    baseTabs.push({
      id: 'wipro-batch-20-50',
      title: 'Wipro Turbo & Elite Coding (Q20–Q50)',
      isFree: false,
      content: WIPRO_EXTRA.map(buildQuestionHtml).join('\n\n'),
      children: [],
    });
    const { error } = await supabase.from('exams').update({ paper_tabs: baseTabs, updated_at: new Date().toISOString() }).eq('id', '6a4952bf-52e1-4705-aea9-2ede3ad89879');
    if (error) { console.error('Failed Wipro:', error.message); process.exit(1); }
    console.log('Seeded Wipro -> 50 Qs (19 existing + 31 new)');
  }

  // 3. Append Cognizant Extra (Q47-Q50)
  {
    const { data: cExam } = await supabase.from('exams').select('paper_tabs').eq('id', '030fcb39-e2a3-4c40-836f-32c5d87c6b19').single();
    const baseTabs = (cExam.paper_tabs || []).filter(t => t.id !== 'cognizant-batch-47-50');
    baseTabs.push({
      id: 'cognizant-batch-47-50',
      title: 'Cognizant GenC Elevate Extra (Q47–Q50)',
      isFree: false,
      content: COGNIZANT_EXTRA.map(buildQuestionHtml).join('\n\n'),
      children: [],
    });
    const { error } = await supabase.from('exams').update({ paper_tabs: baseTabs, updated_at: new Date().toISOString() }).eq('id', '030fcb39-e2a3-4c40-836f-32c5d87c6b19');
    if (error) { console.error('Failed Cognizant:', error.message); process.exit(1); }
    console.log('Seeded Cognizant -> 50 Qs (46 existing + 4 new)');
  }

  // 4. Upsert Cisco Exam (50 Qs)
  {
    const ciscoId = '42414c4b-443b-4c41-b12d-09b5a37ea4b3';
    const tabs = buildThreeTabs(
      'cisco',
      'Round 1: Cisco Networking & Core (Q1–Q15)',
      'Round 2: Algorithms & Systems (Q16–Q35)',
      'Round 3: Interview Coding Set (Q36–Q50)',
      CISCO_QUESTIONS
    );
    const { data: existing } = await supabase.from('exams').select('id').eq('company_id', ciscoId).eq('is_deleted', false).maybeSingle();
    if (existing) {
      const { error } = await supabase.from('exams').update({
        company_slug: 'cisco',
        paper_tabs: tabs,
        old_papers: '### Cisco Systems Verified Placement Papers & Coding Archive\n\nAccess 50 verified Cisco OA & interview coding questions with 4 test cases and Java/Python solutions.',
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id);
      if (error) { console.error('Failed Cisco update:', error.message); process.exit(1); }
    } else {
      const { error } = await supabase.from('exams').insert({
        company_id: ciscoId,
        company_slug: 'cisco',
        name: 'Cisco Systems Campus & Cloud Placement Paper 2026',
        badge: 'Cisco OA 2026',
        content: '### About Cisco Systems Recruitment Process\n\nAccess verified Cisco OA networking, systems, and algorithmic coding questions with 4 test cases and Java/Python solutions.',
        old_papers: '### Cisco Systems Verified Placement Papers & Coding Archive\n\nAccess 50 verified Cisco OA & interview coding questions with 4 test cases and Java/Python solutions.',
        price: 99,
        paper_tabs: tabs,
        upvotes: 85,
        is_public_exam: false,
        is_deleted: false,
      });
      if (error) { console.error('Failed Cisco insert:', error.message); process.exit(1); }
    }
    console.log('Seeded Cisco -> 50 Qs');
  }
}

main();
