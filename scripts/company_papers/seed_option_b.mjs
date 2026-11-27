import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { verifyCompanyQuestions, buildQuestionHtml } from './verify_and_build.mjs';

import { NVIDIA_QUESTIONS } from './data_nvidia.mjs';
import { UBER_QUESTIONS } from './data_uber.mjs';
import { SALESFORCE_QUESTIONS } from './data_salesforce.mjs';
import { RAZORPAY_QUESTIONS } from './data_razorpay.mjs';
import { SERVICENOW_QUESTIONS } from './data_servicenow.mjs';

for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function tableHtml(headers, rows) {
  const ths = headers.map((h) => `<th><p>${h}</p></th>`).join('');
  const trs = rows.map((r) => `<tr>${r.map((c) => `<td><p>${c}</p></td>`).join('')}</tr>`).join('');
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
    ...rounds.map((r) => `<h2>${r.heading}</h2><p>${r.body}</p>`),
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

const OPTION_B = [
  {
    name: 'NVIDIA',
    slug: 'nvidia',
    industry: 'Semiconductors, GPUs & AI Computing',
    company_size: '30,000+ employees',
    headquarters: 'Santa Clara, CA, USA',
    description: 'NVIDIA pioneers accelerated GPU computing, CUDA, and AI data-center platforms.',
    examName: 'NVIDIA GPU & Systems Software OA 2026',
    badge: 'Deep Tech OA 2026',
    t1: 'Round 1: GPU, CUDA & Tiling Core (Q1–Q15)',
    t2: 'Round 2: Memory, Bitmasks & Reductions (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: NVIDIA_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'NVIDIA',
      intro: 'NVIDIA Corporation is the world leader in <strong>GPU architecture, CUDA parallel computing, and accelerated AI infrastructure</strong>, founded in <strong>1993</strong>.',
      facts: [['Founded', '1993'], ['Headquarters', 'Santa Clara, California, USA'], ['Industry', 'Semiconductors & AI Computing'], ['India Hubs', 'Bengaluru, Pune & Hyderabad']],
      does: ['<strong>Accelerated Computing:</strong> GPUs, CUDA, TensorRT, and NVLink.', '<strong>AI & Autonomous Systems:</strong> Data-center AI, Omniverse, and DRIVE.'],
      india: 'Bengaluru and Pune host major NVIDIA hardware, compiler, and GPU systems software teams.',
      knownFor: 'High-performance C/C++, memory alignment, bit manipulation, and parallel systems interviews.',
      takeaway: 'Focus on <strong>bitmasks, memory alignment, matrix tiling, and C/C++ systems fundamentals</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'NVIDIA GPU & Systems Software — Recruitment Process',
      overview: 'NVIDIA evaluates C/C++ internals, OS/architecture, bit manipulation, and algorithmic problem solving.',
      stages: [['1', 'Online Assessment', 'C/C++ pointers, OS/arch MCQs + 2 coding problems.', 'Yes'], ['2', 'Technical Interviews (2–3)', 'DSA, memory layout, bitmasks, and systems design.', 'Yes']],
      flow: 'Online Assessment → Technical Round 1 → Technical Round 2 → Hiring Manager → Offer',
      roles: [['System Software Engineer', '₹28–42 LPA (CTC)', 'CUDA, Drivers, Compilers & GPU Architecture']],
      rounds: [{ heading: '1. Online Assessment', body: 'Tests tensor tiling, warp bitmasks, alignment, and parallel reduction logic.' }],
      tips: ['Master bitwise ops, pointer alignment, and matrix/buffer indexing.'],
    }),
  },
  {
    name: 'Uber',
    slug: 'uber',
    industry: 'Mobility, Delivery & Logistics Tech',
    company_size: '30,000+ employees',
    headquarters: 'San Francisco, CA, USA',
    description: 'Uber operates global real-time ride-hailing, Uber Eats delivery, and freight logistics.',
    examName: 'Uber SDE-1 & Intern OA 2026',
    badge: 'Big Tech OA 2026',
    t1: 'Round 1: Dispatch, Surge & Graphs (Q1–Q15)',
    t2: 'Round 2: Intervals, Carpool & Routing (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: UBER_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Uber',
      intro: 'Uber Technologies, Inc. builds real-time <strong>mobility, food delivery (Uber Eats), and freight marketplaces</strong>, founded in <strong>2009</strong>.',
      facts: [['Founded', '2009'], ['Headquarters', 'San Francisco, California, USA'], ['Industry', 'Mobility & Real-Time Logistics'], ['India Hubs', 'Bengaluru & Hyderabad']],
      does: ['<strong>Real-Time Dispatch:</strong> Matching riders, drivers, and couriers at global scale.', '<strong>Maps & Pricing:</strong> Shortest-path routing, ETA prediction, and surge pricing.'],
      india: 'Bengaluru and Hyderabad are major Uber engineering centers building core maps, payments, and marketplace platforms.',
      knownFor: 'Graph shortest paths, interval scheduling, sliding windows, and high-bar DSA interviews.',
      takeaway: 'Master <strong>Dijkstra/BFS, difference arrays, interval sweeps, and sliding windows</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Uber SDE-1 & Intern — Recruitment Process',
      overview: 'Uber\'s OA features 3–4 challenging DSA problems on CodeSignal/HackerRank followed by 3–4 live interviews.',
      stages: [['1', 'Online Coding Assessment', '3–4 DSA problems (70–90 min).', 'Yes'], ['2', 'Technical Rounds', 'Graphs, DP, concurrency/machine coding, and architecture.', 'Yes']],
      flow: 'Online Assessment → DSA Round 1 → DSA / Machine Coding → Bar Raiser → Offer',
      roles: [['Software Engineer I (SDE-1)', '₹35–55 LPA (CTC)', 'Maps, Dispatch, Pricing & Core Infra']],
      rounds: [{ heading: '1. Online Assessment', body: 'Tests shortest paths, carpool capacity difference arrays, and driver scheduling.' }],
      tips: ['Optimize to O(N log N) or O(N) and handle edge cases cleanly.'],
    }),
  },
  {
    name: 'Salesforce',
    slug: 'salesforce',
    industry: 'Enterprise Cloud CRM & SaaS',
    company_size: '72,000+ employees',
    headquarters: 'San Francisco, CA, USA',
    description: 'Salesforce is the world\'s #1 AI CRM and multi-tenant enterprise cloud platform.',
    examName: 'Salesforce Futureforce & SDE OA 2026',
    badge: 'Product OA 2026',
    t1: 'Round 1: Multi-Tenant & Apex DAGs (Q1–Q15)',
    t2: 'Round 2: Quotas, Leads & Pipelines (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: SALESFORCE_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Salesforce',
      intro: 'Salesforce, Inc. is the global leader in <strong>enterprise CRM, multi-tenant cloud platforms, and Agentforce AI</strong>, founded in <strong>1999</strong>.',
      facts: [['Founded', '1999'], ['Headquarters', 'San Francisco, California, USA'], ['Industry', 'Enterprise Cloud CRM'], ['India Hubs', 'Hyderabad & Bengaluru']],
      does: ['<strong>CRM Cloud:</strong> Sales, Service, Marketing, and Commerce Clouds.', '<strong>Multi-Tenant Platform:</strong> Apex, SOQL, MuleSoft, Tableau, and Slack.'],
      india: 'Hyderabad is Salesforce\'s second-largest global R&D hub with major Futureforce campus hiring.',
      knownFor: 'Clean DSA, multi-tenant quota/DAG problems, and collaborative engineering interviews.',
      takeaway: 'Focus on <strong>tries/prefixes, topological sort, interval merging, and clean OOP</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Salesforce Futureforce & SDE — Recruitment Process',
      overview: 'Salesforce Futureforce conducts a HackerRank OA (2–3 problems) followed by 2–3 technical and hiring-manager rounds.',
      stages: [['1', 'HackerRank OA', '2–3 medium DSA problems (75–90 min).', 'Yes'], ['2', 'Technical Interviews', 'DSA, OOP/design, DBMS, and projects.', 'Yes']],
      flow: 'HackerRank OA → Technical Round 1 → Technical Round 2 → Hiring Manager → Offer',
      roles: [['Associate Member of Technical Staff (AMTS)', '₹30–42 LPA (CTC)', 'Core CRM, Data Cloud & AI']],
      rounds: [{ heading: '1. HackerRank OA', body: 'Tests prefix search, trigger DAG cycle detection, and interval merging.' }],
      tips: ['Write clean, modular code with strong test-case coverage.'],
    }),
  },
  {
    name: 'Razorpay',
    slug: 'razorpay',
    industry: 'FinTech & Payment Infrastructure',
    company_size: '3,000+ employees',
    headquarters: 'Bengaluru, India',
    description: 'Razorpay powers online payments, UPI, RazorpayX banking, and payouts for Indian businesses.',
    examName: 'Razorpay Payments & Backend OA 2026',
    badge: 'FinTech OA 2026',
    t1: 'Round 1: UPI Routing & Rate Limits (Q1–Q15)',
    t2: 'Round 2: Ledgers, Retries & Webhooks (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: RAZORPAY_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Razorpay',
      intro: 'Razorpay is India\'s leading <strong>full-stack FinTech and payment infrastructure platform</strong> for UPI, cards, payouts, and neo-banking, founded in <strong>2014</strong>.',
      facts: [['Founded', '2014'], ['Headquarters', 'Bengaluru, Karnataka, India'], ['Industry', 'FinTech & Payments'], ['Employees', '3,000+']],
      does: ['<strong>Payment Gateway:</strong> Smart UPI/card routing, checkout, and subscriptions.', '<strong>RazorpayX:</strong> Business banking, automated payouts, and ledger reconciliation.'],
      india: 'Headquartered in Bengaluru with high-bar backend and product engineering teams.',
      knownFor: 'Practical backend coding rounds covering rate limiters, idempotency, retries, and ledger correctness.',
      takeaway: 'Master <strong>sliding windows, hash maps, backoff math, and financial edge cases</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Razorpay Payments & Backend — Recruitment Process',
      overview: 'Razorpay\'s hiring includes a coding OA, DSA round, Machine Coding (low-level design), and Hiring Manager round.',
      stages: [['1', 'Online Coding Assessment', '2–3 backend/DSA problems (60–90 min).', 'Yes'], ['2', 'DSA & Machine Coding', 'Live problem solving + clean LLD.', 'Yes']],
      flow: 'Online Assessment → DSA Round → Machine Coding → Hiring Manager → Offer',
      roles: [['SDE-1 (Backend / Full-Stack)', '₹24–34 LPA (CTC)', 'Checkout, UPI, RazorpayX & Risk']],
      rounds: [{ heading: '1. Online Assessment', body: 'Tests sliding-window rate limiters, idempotency, and ledger reconciliation.' }],
      tips: ['Use 64-bit integers for currency calculations and handle zero/boundary cases cleanly.'],
    }),
  },
  {
    name: 'ServiceNow',
    slug: 'servicenow',
    industry: 'Enterprise Digital Workflows & Cloud',
    company_size: '22,000+ employees',
    headquarters: 'Santa Clara, CA, USA',
    description: 'ServiceNow builds enterprise IT service management (ITSM), workflow automation, and AI cloud platforms.',
    examName: 'ServiceNow Campus SDE OA 2026',
    badge: 'Product OA 2026',
    t1: 'Round 1: ITSM Workflows & CMDB Trees (Q1–Q15)',
    t2: 'Round 2: Caches, Logs & SLAs (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: SERVICENOW_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'ServiceNow',
      intro: 'ServiceNow, Inc. is a leading <strong>enterprise cloud workflow and IT service management (ITSM)</strong> platform, founded in <strong>2004</strong>.',
      facts: [['Founded', '2004'], ['Headquarters', 'Santa Clara, California, USA'], ['Industry', 'Enterprise Workflow SaaS'], ['India Hub', 'Hyderabad']],
      does: ['<strong>ITSM & CMDB:</strong> Incident, change, and asset dependency management.', '<strong>Now Platform:</strong> Low-code workflow automation and enterprise AI.'],
      india: 'Hyderabad is ServiceNow\'s largest R&D center outside the US, hiring heavily from top engineering campuses.',
      knownFor: 'Clean DSA assessments focusing on DAGs, trees, LRU caches, and log/SLA processing.',
      takeaway: 'Prepare <strong>topological sort, trees, LRU cache, and clean Java/Python coding</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'ServiceNow Campus SDE — Recruitment Process',
      overview: 'ServiceNow conducts a HackerRank OA followed by 2–3 technical interviews and a managerial round.',
      stages: [['1', 'HackerRank OA', '2–3 coding problems + CS MCQs.', 'Yes'], ['2', 'Technical Interviews', 'DSA, OOP/Java, DBMS, and projects.', 'Yes']],
      flow: 'HackerRank OA → Technical Round 1 → Technical Round 2 → Hiring Manager → Offer',
      roles: [['Associate Software Engineer', '₹26–36 LPA (CTC)', 'Now Platform, ITSM & Cloud Infra']],
      rounds: [{ heading: '1. HackerRank OA', body: 'Tests workflow DAGs, CMDB tree depth, LRU cache simulation, and SLA counters.' }],
      tips: ['Practice clean graph/tree traversals and O(1) cache structures.'],
    }),
  },
];

async function main() {
  let totalErrors = 0;
  for (const c of OPTION_B) {
    const errs = verifyCompanyQuestions(c.name, c.questions);
    totalErrors += errs.length;
    console.log(`${c.name.padEnd(20)} | Qs: ${String(c.questions.length).padStart(2)} | Errors: ${errs.length}`);
    for (const e of errs) console.error('  ERR:', e);
  }
  if (totalErrors > 0) {
    console.error(`\nVERIFICATION FAILED with ${totalErrors} error(s). Aborting seed.`);
    process.exit(1);
  }
  console.log('\nALL 250 OPTION B QUESTIONS VERIFIED SUCCESSFULLY (0 ERRORS).');

  for (const c of OPTION_B) {
    const now = new Date().toISOString();
    const { data: existingComp } = await supabase.from('companies').select('id').eq('slug', c.slug).maybeSingle();
    let companyId;
    if (existingComp) {
      companyId = existingComp.id;
      const { error } = await supabase.from('companies').update({
        name: c.name, industry: c.industry, company_size: c.company_size, headquarters: c.headquarters,
        description: c.description, about_company: c.aboutCompany, is_hidden: false, is_deleted: false, updated_at: now,
      }).eq('id', companyId);
      if (error) throw new Error(`Company update ${c.slug}: ${error.message}`);
    } else {
      const { data: ins, error } = await supabase.from('companies').insert({
        name: c.name, slug: c.slug, industry: c.industry, company_size: c.company_size, headquarters: c.headquarters,
        description: c.description, about_company: c.aboutCompany, is_hidden: false, is_deleted: false,
      }).select('id').single();
      if (error) throw new Error(`Company insert ${c.slug}: ${error.message}`);
      companyId = ins.id;
    }

    const tabs = buildThreeTabs(c.slug, c.t1, c.t2, c.t3, c.questions);
    const { data: existingExam } = await supabase.from('exams').select('id').eq('company_id', companyId).eq('is_deleted', false).maybeSingle();
    if (existingExam) {
      const { error } = await supabase.from('exams').update({
        company_slug: c.slug, name: c.examName, badge: c.badge, content: c.aboutExam,
        old_papers: `### ${c.name} Verified Placement Papers & Coding Archive\n\nAccess 50 original ${c.name} OA & interview coding questions with 4 test cases and Java/Python solutions.`,
        paper_tabs: tabs, updated_at: now,
      }).eq('id', existingExam.id);
      if (error) throw new Error(`Exam update ${c.slug}: ${error.message}`);
    } else {
      const { error } = await supabase.from('exams').insert({
        company_id: companyId, company_slug: c.slug, name: c.examName, badge: c.badge, content: c.aboutExam,
        old_papers: `### ${c.name} Verified Placement Papers & Coding Archive\n\nAccess 50 original ${c.name} OA & interview coding questions with 4 test cases and Java/Python solutions.`,
        price: 99, paper_tabs: tabs, upvotes: 115, is_public_exam: false, is_deleted: false,
      });
      if (error) throw new Error(`Exam insert ${c.slug}: ${error.message}`);
    }
    console.log(`Seeded ${c.name} -> company + exam (50 Qs)`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
