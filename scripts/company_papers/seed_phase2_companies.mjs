import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { verifyCompanyQuestions, buildQuestionHtml } from './verify_and_build.mjs';

import { WALMART_QUESTIONS } from './data_walmart.mjs';
import { QUALCOMM_QUESTIONS } from './data_qualcomm.mjs';
import { PAYPAL_QUESTIONS } from './data_paypal.mjs';
import { SAP_LABS_QUESTIONS } from './data_sap_labs.mjs';
import { ATLASSIAN_QUESTIONS } from './data_atlassian.mjs';

for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function tableHtml(headers, rows) {
  const ths = headers.map((h) => `<th><p>${h}</p></th>`).join('');
  const trs = rows
    .map((r) => `<tr>${r.map((c) => `<td><p>${c}</p></td>`).join('')}</tr>`)
    .join('');
  return `<table><tbody><tr>${ths}</tr>${trs}</tbody></table>`;
}

function buildAboutCompany({ name, intro, facts, does, india, knownFor, takeaway }) {
  return [
    `<p>${intro}</p>`,
    tableHtml(['Category', 'Details'], facts.map(([k, v]) => [`<strong>${k}</strong>`, v])),
    `<h3>What ${name} Does</h3>`,
    `<ul>${does.map((d) => `<li><p>${d}</p></li>`).join('')}</ul>`,
    `<h3>${name} in India</h3>`,
    `<p>${india}</p>`,
    `<h3>What ${name} Is Known For</h3>`,
    `<p>${knownFor}</p>`,
    `<p><strong>Interview takeaway:</strong> ${takeaway}</p>`,
  ].join('');
}

function buildAboutExam({ title, overview, stages, flow, roles, rounds, tips }) {
  return [
    `<h1>${title}</h1>`,
    `<p>${overview}</p>`,
    tableHtml(['Stage', 'Round', 'Purpose', 'Elimination'], stages.map((s) => [`<strong>${s[0]}</strong>`, `<strong>${s[1]}</strong>`, s[2], `<strong>${s[3]}</strong>`])),
    `<h2>Recruitment Flow</h2>`,
    `<p><strong>${flow}</strong></p>`,
    tableHtml(['Role / Track', 'Typical Package', 'Focus'], roles.map((r) => [`<strong>${r[0]}</strong>`, `<strong>${r[1]}</strong>`, r[2]])),
    ...rounds.map((r) => `<h2>${r.heading}</h2><p>${r.body}</p>${r.bullets ? `<ul>${r.bullets.map((b) => `<li><p>${b}</p></li>`).join('')}</ul>` : ''}`),
    `<h2>Preparation Strategy</h2>`,
    `<ul>${tips.map((t) => `<li><p>${t}</p></li>`).join('')}</ul>`,
  ].join('');
}

function buildThreeTabs(slug, t1, t2, t3, questions) {
  return [
    { id: `${slug}-round-1`, title: t1, isFree: true, content: questions.slice(0, 15).map(buildQuestionHtml).join('\n\n'), children: [] },
    { id: `${slug}-round-2`, title: t2, isFree: false, content: questions.slice(15, 35).map(buildQuestionHtml).join('\n\n'), children: [] },
    { id: `${slug}-round-3`, title: t3, isFree: false, content: questions.slice(35, 50).map(buildQuestionHtml).join('\n\n'), children: [] },
  ];
}

const PHASE2_COMPANIES = [
  {
    name: 'Walmart Global Tech',
    slug: 'walmart',
    industry: 'Retail Tech & Supply Chain',
    company_size: '2,100,000+ employees globally',
    headquarters: 'Bentonville, AR, USA',
    description: 'Walmart Global Tech powers Walmart\'s global e-commerce, supply chain, and store technology.',
    examName: 'Walmart SparkPlug & SDE Placement Paper 2026',
    badge: 'Product OA 2026',
    t1: 'Round 1: Store & Supply-Chain Core (Q1–Q15)',
    t2: 'Round 2: Greedy, Intervals & DP (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: WALMART_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Walmart Global Tech',
      intro: 'Walmart Global Tech is the technology arm of Walmart Inc., building <strong>high-scale e-commerce, omni-channel POS, supply-chain optimization, and cloud/AI systems</strong>.',
      facts: [['Parent', 'Walmart Inc. (Fortune #1)'], ['Tech HQ', 'Bentonville, AR & Sunnyvale, CA'], ['Industry', 'Retail Technology, Supply Chain & FinTech'], ['India Hubs', 'Bengaluru & Chennai']],
      does: ['<strong>Supply Chain & Fulfillment:</strong> Routing, cross-docking, inventory forecasting, and store logistics.', '<strong>Omni-Channel Retail:</strong> Checkout systems, curbside pickup, and Walmart+.', '<strong>Cloud & Data:</strong> Petabyte-scale analytics and ML pricing engines.'],
      india: 'Bengaluru and Chennai host major Walmart Global Tech engineering centers driving global e-commerce and supply-chain platforms.',
      knownFor: 'Large-scale distributed retail systems, SparkPlug campus hiring, and practical algorithmic problem solving.',
      takeaway: 'Focus on <strong>heaps, greedy scheduling, sliding windows, graphs, and supply-chain optimization</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Walmart SparkPlug & SDE — Recruitment Process',
      overview: 'Walmart Global Tech hires Software Engineers through SparkPlug and campus drives featuring CS MCQs + 2 coding problems.',
      stages: [['1', 'Online Assessment', 'CS MCQs (DBMS, OS, CN, OOP) + 2 coding problems.', 'Yes'], ['2', 'Technical Interview 1 & 2', 'DSA coding + Java/Spring/SQL & projects.', 'Yes'], ['3', 'Hiring Manager Round', 'System reasoning and behavioral ownership.', 'Yes']],
      flow: 'Online Assessment → Technical Round 1 → Technical Round 2 → Hiring Manager → Offer',
      roles: [['SDE-2 / SDE-1 (Campus)', '₹18–26 LPA (CTC)', 'E-Commerce, Supply Chain & Store Tech']],
      rounds: [{ heading: '1. Online Assessment', body: 'Tests heap/priority-queue scheduling, greedy bin-packing, and BFS/DP.' }],
      tips: ['Practice clean O(N log N) solutions and revise SQL/DBMS fundamentals.'],
    }),
  },
  {
    name: 'Qualcomm',
    slug: 'qualcomm',
    industry: 'Semiconductors, 5G & Embedded Systems',
    company_size: '50,000+ employees',
    headquarters: 'San Diego, CA, USA',
    description: 'Qualcomm leads in Snapdragon SoCs, 5G modems, RF systems, and on-device AI.',
    examName: 'Qualcomm Embedded & Software OA 2026',
    badge: 'Core Tech OA 2026',
    t1: 'Round 1: Bitwise, Alignment & Registers (Q1–Q15)',
    t2: 'Round 2: Firmware, DSP & RTOS (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: QUALCOMM_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Qualcomm',
      intro: 'Qualcomm Incorporated is a world leader in <strong>wireless 5G/6G technology, Snapdragon mobile SoCs, RF front-ends, and edge AI</strong>, founded in <strong>1985</strong>.',
      facts: [['Founded', '1985'], ['Headquarters', 'San Diego, California, USA'], ['Industry', 'Semiconductors, 5G & Embedded Systems'], ['India Hubs', 'Hyderabad, Bengaluru, Chennai & Noida']],
      does: ['<strong>Snapdragon SoCs:</strong> CPU/GPU/NPU architecture and low-power firmware.', '<strong>5G Modem & RF:</strong> Baseband signal processing, carrier aggregation, and protocol stacks.', '<strong>Automotive & IoT:</strong> Snapdragon Digital Chassis and edge compute.'],
      india: 'Hyderabad and Bengaluru are among Qualcomm\'s largest global engineering centers for chip design, modem firmware, and Linux/Android BSP.',
      knownFor: 'Deep systems, C/C++, bit manipulation, RTOS, and computer architecture interviews.',
      takeaway: 'Master <strong>bitwise operations, endianness, memory alignment, ring buffers, and RTOS/OS concepts</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Qualcomm Embedded & Software — Recruitment Process',
      overview: 'Qualcomm evaluates C/C++ internals, bit manipulation, OS/RTOS, and coding fundamentals.',
      stages: [['1', 'Online Assessment', 'Aptitude, C/C++ pointers/bitwise MCQs, and coding problems.', 'Yes'], ['2', 'Technical Interview 1 & 2', 'Bit manipulation, OS (locks, memory, interrupts), and DSA.', 'Yes'], ['3', 'HR / Managerial Round', 'Team fit and core engineering interest.', 'Yes']],
      flow: 'Online Assessment → Technical Round 1 → Technical Round 2 → HR → Offer',
      roles: [['Engineer (Embedded / Modem / Software)', '₹18–25 LPA (CTC)', 'Firmware, Linux Kernel, 5G & SoC Software']],
      rounds: [{ heading: '1. Online & Technical Rounds', body: 'Strong emphasis on bitfields, masks, alignment, DMA ring buffers, and cache behavior.' }],
      tips: ['Practice bitwise tricks without branches and revise OS synchronization primitives.'],
    }),
  },
  {
    name: 'PayPal',
    slug: 'paypal',
    industry: 'Digital Payments & FinTech',
    company_size: '27,000+ employees',
    headquarters: 'San Jose, CA, USA',
    description: 'PayPal is a global digital payments platform serving consumers and merchants worldwide.',
    examName: 'PayPal Payments & Backend Engineering OA 2026',
    badge: 'FinTech OA 2026',
    t1: 'Round 1: Gateway, Rate-Limit & Fraud (Q1–Q15)',
    t2: 'Round 2: Ledgers, Graphs & Windows (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: PAYPAL_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'PayPal',
      intro: 'PayPal Holdings, Inc. is a global leader in <strong>digital payments, peer-to-peer transfers (Venmo), merchant checkout, and fraud/risk intelligence</strong>, founded in <strong>1998</strong>.',
      facts: [['Founded', '1998'], ['Headquarters', 'San Jose, California, USA'], ['Industry', 'FinTech & Digital Payments'], ['India Hubs', 'Chennai & Bengaluru']],
      does: ['<strong>Checkout & Braintree:</strong> High-availability global payment processing and idempotent APIs.', '<strong>Risk & Fraud AI:</strong> Real-time velocity checks and anomaly detection.', '<strong>Cross-Border & Escrow:</strong> Multi-currency FX settlement and dispute resolution.'],
      india: 'Chennai and Bengaluru host major PayPal Technology Centers building core payments, risk, and merchant platforms.',
      knownFor: 'Clean HackerRank-style backend OAs focusing on rate limiting, idempotency, sliding windows, and graph/fraud detection.',
      takeaway: 'Focus on <strong>sliding windows, hash maps, union-find, DAGs, and clean financial edge cases</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'PayPal Payments & Backend — Recruitment Process',
      overview: 'PayPal hires Software Engineers via HackerRank coding assessments followed by DSA and system-design interviews.',
      stages: [['1', 'Online Coding Assessment', '2–3 coding problems (60–90 min) on HackerRank.', 'Yes'], ['2', 'Technical Round 1 & 2', 'DSA, Java/Python backend design, and API/DB concepts.', 'Yes'], ['3', 'Hiring Manager Round', 'Ownership, scalability thinking, and cultural fit.', 'Yes']],
      flow: 'HackerRank OA → Technical Round 1 → Technical Round 2 → Hiring Manager → Offer',
      roles: [['Software Engineer 1 (SE-1)', '₹20–28 LPA (CTC)', 'Checkout, Risk AI, Ledger & Cloud Platforms']],
      rounds: [{ heading: '1. HackerRank OA', body: 'Tests sliding-window rate limiters, idempotency deduplication, and graph components.' }],
      tips: ['Write clean, O(N) / O(N log N) solutions with 64-bit integer safety for money amounts.'],
    }),
  },
  {
    name: 'SAP Labs',
    slug: 'sap-labs',
    industry: 'Enterprise Software & ERP Cloud',
    company_size: '105,000+ employees globally',
    headquarters: 'Walldorf, Germany',
    description: 'SAP builds enterprise ERP (S/4HANA), cloud platforms (BTP), and business AI.',
    examName: 'SAP Scholar & SDE Placement Paper 2026',
    badge: 'Enterprise OA 2026',
    t1: 'Round 1: ERP, BOM & SQL Logic (Q1–Q15)',
    t2: 'Round 2: Cloud, DP & Workflows (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: SAP_LABS_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'SAP Labs',
      intro: 'SAP SE is the world\'s leading provider of <strong>enterprise resource planning (ERP), supply-chain, finance, and cloud business software</strong>, founded in <strong>1972</strong>.',
      facts: [['Founded', '1972'], ['Headquarters', 'Walldorf, Germany'], ['Industry', 'Enterprise Software & Cloud ERP'], ['India Hubs', 'Bengaluru (SAP Labs India), Pune & Gurugram']],
      does: ['<strong>SAP S/4HANA:</strong> In-memory ERP for finance, manufacturing, and procurement.', '<strong>SAP BTP:</strong> Cloud development, integration, and data platform.', '<strong>Business AI:</strong> Embedded AI across HR, procurement, and supply chain.'],
      india: 'SAP Labs India (Bengaluru) is SAP\'s largest R&D hub outside Germany and runs the popular SAP Scholar campus program.',
      knownFor: 'Enterprise data modeling, Java/OOP rigor, SQL/HANA database concepts, and clean algorithmic coding.',
      takeaway: 'Prepare <strong>DAG topological sort, knapsack/DP, SQL-like aggregations, and OOP/Java fundamentals</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'SAP Scholar & SDE — Recruitment Process',
      overview: 'SAP Labs conducts an online coding + CS assessment followed by 2 technical interviews and an HR/managerial round.',
      stages: [['1', 'Online Assessment', '2 coding problems + CS/SQL/OOP MCQs.', 'Yes'], ['2', 'Technical Interview 1 & 2', 'DSA, OOP design, DBMS/SQL, and projects.', 'Yes'], ['3', 'Managerial / HR Round', 'Collaboration, learning agility, and role fit.', 'Yes']],
      flow: 'Online Assessment → Technical Round 1 → Technical Round 2 → Managerial / HR → Offer',
      roles: [['Developer Associate / SAP Scholar', '₹15–22 LPA (CTC)', 'S/4HANA, SAP BTP, HANA & Business AI']],
      rounds: [{ heading: '1. Online Assessment', body: 'Tests dependency DAGs, bin packing, FIFO inventory, and enterprise aggregations.' }],
      tips: ['Know OOP principles, SQL joins/indexing, and clean modular Java/Python coding.'],
    }),
  },
  {
    name: 'Atlassian',
    slug: 'atlassian',
    industry: 'Developer Tools & Team Collaboration',
    company_size: '12,000+ employees',
    headquarters: 'Sydney, Australia',
    description: 'Atlassian builds Jira, Confluence, Bitbucket, Trello, and Jira Service Management.',
    examName: 'Atlassian Product SDE Placement Paper 2026',
    badge: 'Product OA 2026',
    t1: 'Round 1: Rate Limiters, Trees & Routing (Q1–Q15)',
    t2: 'Round 2: Concurrency, Intervals & Graphs (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: ATLASSIAN_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Atlassian',
      intro: 'Atlassian Corporation builds collaboration and software-delivery tools including <strong>Jira, Confluence, Bitbucket, Trello, and Opsgenie</strong>, founded in <strong>2002</strong>.',
      facts: [['Founded', '2002'], ['Headquarters', 'Sydney, Australia'], ['Industry', 'Developer Tools & Cloud SaaS'], ['India Hub', 'Bengaluru']],
      does: ['<strong>Plan & Track:</strong> Jira Software, Jira Product Discovery, and Trello.', '<strong>Collaborate & Document:</strong> Confluence and Loom.', '<strong>DevOps & Incident Mgmt:</strong> Bitbucket, Compass, and Opsgenie.'],
      india: 'Bengaluru is a major Atlassian engineering hub building core cloud platform, Jira, and developer-experience products.',
      knownFor: 'Practical, real-world coding interviews (rate limiters, routers, voting, file systems) instead of obscure trick puzzles.',
      takeaway: 'Master <strong>rate limiters, tree ancestors, interval merging, clean data structures, and readable modular code</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Atlassian Product SDE — Recruitment Process',
      overview: 'Atlassian\'s hiring evaluates practical engineering: OA coding, Code Design / Data Structures interviews, System Design, and Values.',
      stages: [['1', 'Online Coding Assessment', '3–4 practical coding problems (90 min).', 'Yes'], ['2', 'Data Structures & Code Design', 'Clean, testable, extensible code for real-world scenarios.', 'Yes'], ['3', 'Values & Management Round', 'Atlassian values, teamwork, and ownership.', 'Yes']],
      flow: 'Online Assessment → Data Structures → Code Design → Values & Management → Offer',
      roles: [['Software Engineer (P30 / New Grad)', '₹35–50+ LPA (CTC)', 'Jira, Confluence, Bitbucket & Cloud Platform']],
      rounds: [{ heading: '1. Practical Coding Rounds', body: 'Heavy focus on sliding-window rate limiters, router matching, voting/tie-breaks, and graph/tree queries.' }],
      tips: ['Prioritize clean code structure, edge-case handling, and clear variable naming.'],
    }),
  },
];

async function main() {
  let totalErrors = 0;
  for (const c of PHASE2_COMPANIES) {
    const errs = verifyCompanyQuestions(c.name, c.questions);
    totalErrors += errs.length;
    console.log(`${c.name.padEnd(20)} | Qs: ${String(c.questions.length).padStart(2)} | Errors: ${errs.length}`);
    for (const e of errs) console.error('  ERR:', e);
  }
  if (totalErrors > 0) {
    console.error(`\nVERIFICATION FAILED with ${totalErrors} error(s). Aborting seed.`);
    process.exit(1);
  }
  console.log('\nALL 250 PHASE 2 QUESTIONS VERIFIED SUCCESSFULLY (0 ERRORS).');

  for (const c of PHASE2_COMPANIES) {
    const now = new Date().toISOString();
    const { data: existingComp } = await supabase.from('companies').select('id').eq('slug', c.slug).maybeSingle();
    let companyId;
    if (existingComp) {
      companyId = existingComp.id;
      const { error } = await supabase.from('companies').update({
        name: c.name,
        industry: c.industry,
        company_size: c.company_size,
        headquarters: c.headquarters,
        description: c.description,
        about_company: c.aboutCompany,
        is_hidden: false,
        is_deleted: false,
        updated_at: now,
      }).eq('id', companyId);
      if (error) throw new Error(`Company update ${c.slug}: ${error.message}`);
    } else {
      const { data: ins, error } = await supabase.from('companies').insert({
        name: c.name,
        slug: c.slug,
        industry: c.industry,
        company_size: c.company_size,
        headquarters: c.headquarters,
        description: c.description,
        about_company: c.aboutCompany,
        is_hidden: false,
        is_deleted: false,
      }).select('id').single();
      if (error) throw new Error(`Company insert ${c.slug}: ${error.message}`);
      companyId = ins.id;
    }

    const tabs = buildThreeTabs(c.slug, c.t1, c.t2, c.t3, c.questions);
    const { data: existingExam } = await supabase.from('exams').select('id').eq('company_id', companyId).eq('is_deleted', false).maybeSingle();
    if (existingExam) {
      const { error } = await supabase.from('exams').update({
        company_slug: c.slug,
        name: c.examName,
        badge: c.badge,
        content: c.aboutExam,
        old_papers: `### ${c.name} Verified Placement Papers & Coding Archive\n\nAccess 50 original ${c.name} OA & interview coding questions with 4 test cases and Java/Python solutions.`,
        paper_tabs: tabs,
        updated_at: now,
      }).eq('id', existingExam.id);
      if (error) throw new Error(`Exam update ${c.slug}: ${error.message}`);
    } else {
      const { error } = await supabase.from('exams').insert({
        company_id: companyId,
        company_slug: c.slug,
        name: c.examName,
        badge: c.badge,
        content: c.aboutExam,
        old_papers: `### ${c.name} Verified Placement Papers & Coding Archive\n\nAccess 50 original ${c.name} OA & interview coding questions with 4 test cases and Java/Python solutions.`,
        price: 99,
        paper_tabs: tabs,
        upvotes: 110,
        is_public_exam: false,
        is_deleted: false,
      });
      if (error) throw new Error(`Exam insert ${c.slug}: ${error.message}`);
    }
    console.log(`Seeded ${c.name} -> company + exam (50 Qs)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
