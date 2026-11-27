import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { verifyCompanyQuestions, buildQuestionHtml } from './verify_and_build.mjs';

import { MICROSOFT_QUESTIONS } from './data_microsoft.mjs';
import { ADOBE_QUESTIONS } from './data_adobe.mjs';
import { FLIPKART_QUESTIONS } from './data_flipkart.mjs';
import { GOLDMAN_SACHS_QUESTIONS } from './data_goldman_sachs.mjs';
import { JPMORGAN_QUESTIONS } from './data_jpmorgan_chase.mjs';
import { SAMSUNG_QUESTIONS } from './data_samsung.mjs';

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

const PHASE1_COMPANIES = [
  {
    name: 'Microsoft',
    slug: 'microsoft',
    industry: 'Cloud, AI & Enterprise Software',
    company_size: '220,000+ employees',
    headquarters: 'Redmond, WA, USA',
    description: 'Microsoft builds Azure, Windows, Microsoft 365, GitHub, and Copilot AI platforms.',
    examName: 'Microsoft SDE & Engage Placement Paper 2026',
    badge: 'Big Tech OA 2026',
    t1: 'Round 1: Microsoft SDE OA Core (Q1–Q15)',
    t2: 'Round 2: Graphs, DP & Systems (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: MICROSOFT_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Microsoft',
      intro: 'Microsoft Corporation is a global leader in <strong>cloud computing (Azure), productivity software (Microsoft 365), developer tools (GitHub, VS Code), and AI (Copilot)</strong>, founded in <strong>1975</strong>.',
      facts: [['Founded', '1975'], ['Headquarters', 'Redmond, Washington, USA'], ['Industry', 'Cloud, AI & Software Engineering'], ['Employees', '220,000+ globally']],
      does: ['<strong>Microsoft Azure:</strong> Global cloud infrastructure, AI compute, and distributed data services.', '<strong>Developer & OS:</strong> Windows, Visual Studio, VS Code, TypeScript, and GitHub.', '<strong>Productivity:</strong> Microsoft 365, Teams, Excel, and Copilot.'],
      india: 'Hyderabad and Bengaluru host Microsoft\'s largest R&D hubs outside the US (IDC), building Azure, Teams, Office, Bing, and AI systems.',
      knownFor: 'High engineering standards in distributed systems, clean object-oriented design, and scalable algorithms.',
      takeaway: 'Focus on <strong>graphs, trees, sliding window, DP, string parsing, and handling tricky edge cases cleanly</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Microsoft SDE & Engage — Recruitment Process',
      overview: 'Microsoft recruits Software Engineers (L59/L60) and Interns through Codility/HackerRank Online Assessments followed by 3 technical & AA (As Appropriate) interviews.',
      stages: [['1', 'Online Assessment (OA)', '2–3 medium-hard DSA coding problems (75–90 min).', 'Yes'], ['2', 'Technical Interview 1', 'DSA problem solving + time/space optimization.', 'Yes'], ['3', 'Technical Interview 2', 'Trees/graphs/DP + CS fundamentals & projects.', 'Yes'], ['4', 'AA / Hiring Manager Round', 'System design/OOP + behavioral ownership.', 'Yes']],
      flow: 'Application → Online Assessment → Technical Round 1 → Technical Round 2 → AA / Managerial Round → Offer',
      roles: [['Software Engineer (SDE-1 / L59)', '₹45–55 LPA (CTC)', 'Azure, Teams, Office, AI & Developer Tools']],
      rounds: [{ heading: '1. Online Assessment', body: 'Tests clean code under strict edge-case test suites (empty inputs, duplicates, overflow, graph cycles).' }],
      tips: ['Always dry-run boundary cases and explain time/space complexity clearly.'],
    }),
  },
  {
    name: 'Adobe',
    slug: 'adobe',
    industry: 'Creative Software & Digital Experience',
    company_size: '30,000+ employees',
    headquarters: 'San Jose, CA, USA',
    description: 'Adobe powers Creative Cloud, Document Cloud (PDF), and Experience Cloud.',
    examName: 'Adobe SheCodes & Campus SDE Assessment 2026',
    badge: 'Product OA 2026',
    t1: 'Round 1: Adobe Core & Geometry (Q1–Q15)',
    t2: 'Round 2: DP, Matrices & OS (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: ADOBE_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Adobe',
      intro: 'Adobe Inc. is a global software company known for <strong>Creative Cloud (Photoshop, Illustrator, Premiere Pro), Document Cloud (Acrobat/PDF), and Experience Cloud</strong>, founded in <strong>1982</strong>.',
      facts: [['Founded', '1982'], ['Headquarters', 'San Jose, California, USA'], ['Industry', 'Creative Software, PDF & Digital Media'], ['Employees', '30,000+ globally']],
      does: ['<strong>Creative Cloud:</strong> Industry-standard imaging, vector graphics, video, and 3D tools.', '<strong>Document Cloud:</strong> PDF rendering, e-signatures, and document AI.', '<strong>Experience Cloud:</strong> Enterprise analytics and digital commerce.'],
      india: 'Noida and Bengaluru are major Adobe R&D centers contributing heavily to Creative Cloud, Firefly AI, and Document Cloud.',
      knownFor: 'High-performance graphics/rendering engines, geometry/matrix math, and strong CS fundamentals.',
      takeaway: 'Prepare <strong>2D matrices, intervals, bitmasking, DP, and core OS/DBMS/OOP fundamentals</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Adobe SheCodes & Campus SDE — Recruitment Process',
      overview: 'Adobe\'s campus and SheCodes hiring combines CS fundamentals (OS, DBMS, OOP) with 2–3 algorithmic coding problems.',
      stages: [['1', 'Online Assessment', 'CS/Aptitude MCQs + 2–3 coding problems.', 'Yes'], ['2', 'Technical Round 1 & 2', 'DSA, matrices, DP, C++/Java internals, and OS/DBMS.', 'Yes'], ['3', 'Director / HR Round', 'Projects, innovation mindset, and role fit.', 'Yes']],
      flow: 'Online Assessment → Technical Round 1 → Technical Round 2 → Director / HR → Offer',
      roles: [['Member of Technical Staff (MTS-1)', '₹30–45 LPA (CTC)', 'Creative Cloud, Document AI & Platform Engineering']],
      rounds: [{ heading: '1. Online Assessment', body: 'Expect interval merging, 2D grid/flood-fill, bit manipulation, and dynamic programming.' }],
      tips: ['Revise OS scheduling/memory management alongside DP and 2D matrix problems.'],
    }),
  },
  {
    name: 'Flipkart',
    slug: 'flipkart',
    industry: 'E-Commerce & Supply Chain Tech',
    company_size: '20,000+ employees',
    headquarters: 'Bengaluru, India',
    description: 'Flipkart is India\'s leading e-commerce marketplace and logistics technology platform.',
    examName: 'Flipkart GRID & SDE-1 Placement Paper 2026',
    badge: 'Dream OA 2026',
    t1: 'Round 1: Flipkart Cart & Logistics (Q1–Q15)',
    t2: 'Round 2: Graphs, Greedy & DP (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: FLIPKART_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Flipkart',
      intro: 'Flipkart is one of India\'s largest <strong>e-commerce, supply-chain, and digital marketplace</strong> companies, founded in <strong>2007</strong> in Bengaluru.',
      facts: [['Founded', '2007'], ['Headquarters', 'Bengaluru, Karnataka, India'], ['Industry', 'E-Commerce, Logistics & FinTech'], ['Scale', '450M+ registered customers']],
      does: ['<strong>Marketplace & Search:</strong> High-scale product catalog, recommendations, and Big Billion Days flash sales.', '<strong>Ekart Supply Chain:</strong> Fulfillment centers, hub-and-spoke routing, and last-mile delivery optimization.', '<strong>Payments & SuperCoins:</strong> Checkout, fraud detection, and loyalty systems.'],
      india: 'Headquartered in Bengaluru with massive engineering teams building distributed systems, search/ML, and logistics optimization.',
      knownFor: 'Handling extreme flash-sale concurrency and real-world supply-chain optimization.',
      takeaway: 'Focus on <strong>BFS/DFS, greedy scheduling, sliding windows, knapsack/DP, and clean machine coding</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Flipkart GRID & SDE-1 — Recruitment Process',
      overview: 'Flipkart hires SDE-1s through Flipkart GRID and campus OAs featuring 3 DSA coding problems followed by PS/DS and Machine Coding interviews.',
      stages: [['1', 'Online Coding Assessment', '3 coding problems (90 min) on graphs, DP, greedy, and arrays.', 'Yes'], ['2', 'Problem Solving & DS (PS/DS)', '2 live DSA coding rounds.', 'Yes'], ['3', 'Machine Coding / Hiring Manager', 'Clean modular design + system/behavioral evaluation.', 'Yes']],
      flow: 'Online Assessment → PS/DS Round 1 → PS/DS Round 2 → Hiring Manager → Offer',
      roles: [['SDE-1', '₹28–35 LPA (CTC)', 'Marketplace, Search, Supply Chain & Payments']],
      rounds: [{ heading: '1. Online Assessment', body: 'Strong emphasis on warehouse shortest paths, scheduling, bin-packing, and DP.' }],
      tips: ['Practice writing clean, modular code and solving 3 medium-hard problems within 90 minutes.'],
    }),
  },
  {
    name: 'Goldman Sachs',
    slug: 'goldman-sachs',
    industry: 'Investment Banking & Quantitative FinTech',
    company_size: '45,000+ employees',
    headquarters: 'New York, NY, USA',
    description: 'Goldman Sachs is a global investment banking, securities, and engineering powerhouse.',
    examName: 'Goldman Sachs Engineering Campus Hiring 2026',
    badge: 'FinTech OA 2026',
    t1: 'Round 1: Quant & Order-Book Core (Q1–Q15)',
    t2: 'Round 2: Combinatorics & DP (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: GOLDMAN_SACHS_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Goldman Sachs',
      intro: 'The Goldman Sachs Group, Inc. is a premier global <strong>investment banking, securities, asset management, and quantitative engineering</strong> firm founded in <strong>1869</strong>.',
      facts: [['Founded', '1869'], ['Headquarters', 'New York City, USA'], ['Industry', 'Investment Banking & FinTech Engineering'], ['Employees', '45,000+ globally']],
      does: ['<strong>Electronic Trading & Risk:</strong> Low-latency order-book engines, pricing models, and risk analytics.', '<strong>Asset & Wealth Management:</strong> Portfolio optimization and quant platforms.', '<strong>Platform Engineering:</strong> Cloud, data lakes, and financial infrastructure.'],
      india: 'Bengaluru and Hyderabad are Goldman Sachs\'s largest global engineering hubs outside New York.',
      knownFor: 'Quantitative rigor, mathematical/combinatorial coding interviews, and high-reliability financial systems.',
      takeaway: 'Master <strong>combinatorics, probability math, prefix sums, DP, matrix paths, and string compression</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Goldman Sachs Engineering Campus Hiring — Recruitment Process',
      overview: 'Goldman Sachs conducts an Aptitude + Coding Online Assessment followed by technical and superday interviews.',
      stages: [['1', 'Online Assessment', '2 coding problems + Quant/Probability/CS MCQs.', 'Yes'], ['2', 'Technical Interview 1 & 2', 'DSA, math/puzzles, OOP, and projects.', 'Yes'], ['3', 'Superday / Final Round', 'System reasoning, team fit, and engineering judgment.', 'Yes']],
      flow: 'Online Assessment → Technical Round 1 → Technical Round 2 → Superday → Offer',
      roles: [['Engineering Analyst (New Analyst)', '₹22–28 LPA (CTC)', 'Core Engineering, Quant Strats & Risk Platforms']],
      rounds: [{ heading: '1. Online Assessment', body: 'Tests combinatorics, modular arithmetic, sliding windows, and financial array/matrix problems.' }],
      tips: ['Watch out for integer overflow (use 64-bit longs) and exact integer-division rules.'],
    }),
  },
  {
    name: 'JPMorgan Chase',
    slug: 'jpmorgan-chase',
    industry: 'Global Banking, Payments & FinTech',
    company_size: '300,000+ employees',
    headquarters: 'New York, NY, USA',
    description: 'JPMorgan Chase is a global leader in financial services, payments, and enterprise FinTech.',
    examName: 'JPMorgan Chase Code for Good & SWE OA 2026',
    badge: 'FinTech OA 2026',
    t1: 'Round 1: Payments & Ledger Core (Q1–Q15)',
    t2: 'Round 2: Fraud, Intervals & Graphs (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: JPMORGAN_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'JPMorgan Chase',
      intro: 'JPMorgan Chase & Co. is a leading global <strong>financial services firm and technology powerhouse</strong> processing trillions of dollars in daily payments, founded in <strong>1799</strong> (modern merger 2000).',
      facts: [['Headquarters', 'New York City, USA'], ['Industry', 'Banking, Payments & FinTech'], ['Tech Workforce', '60,000+ technologists globally']],
      does: ['<strong>Payments & Clearing:</strong> Real-time payment rails, FX settlement, and card networks.', '<strong>Risk & Fraud AI:</strong> Velocity monitoring, anomaly detection, and compliance.', '<strong>Cloud & Core Banking:</strong> High-availability ledger and microservice platforms.'],
      india: 'Mumbai, Bengaluru, and Hyderabad host major Global Technology Centers driving JPMC\'s core engineering and Code for Good.',
      knownFor: 'Clean HackerRank-style coding assessments and the flagship Code for Good hackathon hiring program.',
      takeaway: 'Focus on <strong>hash maps, greedy matching, sliding-window analytics, intervals, and clean edge-case handling</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'JPMorgan Chase Code for Good & SWE — Recruitment Process',
      overview: 'JPMorgan hires Software Engineers via a 60-minute HackerRank OA (2 coding problems) followed by HireVue / Code for Good hackathon or technical interviews.',
      stages: [['1', 'HackerRank Online Assessment', '2 clean algorithmic coding problems (60 min).', 'Yes'], ['2', 'HireVue / Behavioral', 'Structured problem-solving and teamwork scenarios.', 'Yes'], ['3', 'Code for Good / Technical Rounds', '24-hour team build or live technical/system interviews.', 'Yes']],
      flow: 'HackerRank OA → HireVue → Code for Good / Technical Interviews → Offer',
      roles: [['Software Engineer Program (SEP)', '₹19–22 LPA (CTC)', 'Payments, Core Banking, Cloud & Data Platforms']],
      rounds: [{ heading: '1. HackerRank OA', body: 'Tests ledger aggregation, Luhn/routing validation, greedy matching, and sliding windows.' }],
      tips: ['Pass 100% of hidden test cases cleanly with O(N) or O(N log N) solutions.'],
    }),
  },
  {
    name: 'Samsung',
    slug: 'samsung',
    industry: 'Semiconductors, Mobile & R&D',
    company_size: '260,000+ employees',
    headquarters: 'Suwon, South Korea',
    description: 'Samsung Electronics leads in semiconductors, Galaxy devices, displays, and R&D.',
    examName: 'Samsung (SRIB) SWC & R&D Advanced Test 2026',
    badge: 'R&D OA 2026',
    t1: 'Round 1: Grid & BFS Simulation (Q1–Q15)',
    t2: 'Round 2: Bitmask, Backtracking & DP (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: SAMSUNG_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Samsung',
      intro: 'Samsung Electronics is a global leader in <strong>semiconductors, memory, displays, 5G networks, and mobile/IoT devices</strong>, founded in <strong>1969</strong>.',
      facts: [['Founded', '1969'], ['Headquarters', 'Suwon, South Korea'], ['Industry', 'Semiconductors, Consumer Tech & R&D'], ['India R&D Hubs', 'Bengaluru (SRIB), Noida (SRI-N), Delhi (SRI-D)']],
      does: ['<strong>Semiconductors & Foundry:</strong> DRAM, NAND, Exynos SoCs, and chip design.', '<strong>Mobile & SmartThings:</strong> Galaxy devices, camera/AI pipelines, and IoT.', '<strong>5G & Display:</strong> OLED displays and telecom infrastructure.'],
      india: 'Samsung R&D Institute Bangalore (SRIB) is Samsung\'s largest overseas R&D center, focusing on AI, 5G, camera, and systems software.',
      knownFor: 'Its distinctive 3-hour Software Competency (SWC) Advanced Test focused on grid simulation, BFS/DFS, backtracking, and bitmasking.',
      takeaway: 'Practice <strong>2D grid BFS/DFS, state-space simulation, backtracking, and bitmask DP</strong> without relying on heavy external libraries.',
    }),
    aboutExam: buildAboutExam({
      title: 'Samsung (SRIB) SWC & R&D — Recruitment Process',
      overview: 'Samsung R&D conducts the famous 3-hour SWC Advanced Coding Test (1–2 deep simulation/search problems) followed by technical and HR interviews.',
      stages: [['1', 'SWC Online Coding Test (3 Hours)', 'Deep grid simulation, BFS/DFS, backtracking, or bitmask optimization.', 'Yes'], ['2', 'Technical Interview 1', 'Code walkthrough of SWC + DSA + OS/C/C++ fundamentals.', 'Yes'], ['3', 'Technical Interview 2 & HR', 'Projects, problem-solving depth, and cultural fit.', 'Yes']],
      flow: 'SWC 3-Hour Coding Test → Technical Round 1 → Technical Round 2 → HR → Offer',
      roles: [['Software Engineer (SRIB / SRI-N)', '₹20–26 LPA (CTC)', 'On-device AI, 5G, Camera, OS & Semiconductor Tools']],
      rounds: [{ heading: '1. SWC Coding Test', body: 'Focuses on careful 2D grid state transitions, multi-source BFS, backtracking, and bitmask subsets.' }],
      tips: ['Avoid off-by-one bugs in grid boundaries and always copy grids cleanly between simulation steps.'],
    }),
  },
];

async function main() {
  let totalErrors = 0;
  for (const c of PHASE1_COMPANIES) {
    const errs = verifyCompanyQuestions(c.name, c.questions);
    totalErrors += errs.length;
    console.log(`${c.name.padEnd(16)} | Qs: ${String(c.questions.length).padStart(2)} | Errors: ${errs.length}`);
    for (const e of errs) console.error('  ERR:', e);
  }
  if (totalErrors > 0) {
    console.error(`\nVERIFICATION FAILED with ${totalErrors} error(s). Aborting seed.`);
    process.exit(1);
  }
  console.log('\nALL 300 PHASE 1 QUESTIONS VERIFIED SUCCESSFULLY (0 ERRORS).');

  for (const c of PHASE1_COMPANIES) {
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
        upvotes: 120,
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
