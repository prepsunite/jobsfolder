import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { verifyCompanyQuestions, buildQuestionHtml } from './verify_and_build.mjs';

import { ZOHO_QUESTIONS } from './data_zoho.mjs';
import { PERSISTENT_QUESTIONS } from './data_persistent.mjs';
import { KPIT_QUESTIONS } from './data_kpit.mjs';
import { TATA_ELXSI_QUESTIONS } from './data_tata_elxsi.mjs';
import { VIRTUSA_QUESTIONS } from './data_virtusa.mjs';
import { MPHASIS_QUESTIONS } from './data_mphasis.mjs';

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

const OPTION_A = [
  {
    name: 'Zoho',
    slug: 'zoho',
    industry: 'SaaS & Enterprise Software',
    company_size: '15,000+ employees',
    headquarters: 'Chennai, India',
    description: 'Zoho builds a comprehensive suite of cloud SaaS products including Zoho CRM, Books, Mail, and Creator.',
    examName: 'Zoho Programming Round 2 & 3 Paper 2026',
    badge: 'Campus Favorite 2026',
    t1: 'Round 1: Zoho Logic & Arrays (Q1–Q15)',
    t2: 'Round 2: Matrices, Strings & Math (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: ZOHO_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Zoho',
      intro: 'Zoho Corporation is a bootstrapped global SaaS leader building <strong>55+ business applications (CRM, Books, People, Mail, Creator)</strong>, founded in <strong>1996</strong>.',
      facts: [['Founded', '1996'], ['Headquarters', 'Chennai, Tamil Nadu, India'], ['Industry', 'Cloud SaaS & Productivity'], ['Employees', '15,000+']],
      does: ['<strong>Business SaaS:</strong> Zoho CRM, Zoho One, Zoho Books, and Zoho Desk.', '<strong>Developer & Low-Code:</strong> Zoho Creator, Catalyst, and ManageEngine IT tools.'],
      india: 'Chennai and Tenkasi are Zoho\'s global R&D hubs with massive campus & off-campus hiring.',
      knownFor: 'Pure logic, arrays, matrices, and string manipulation rounds without heavy library shortcuts.',
      takeaway: 'Master <strong>in-place array logic, matrix traversal, string parsing, and clean C/Java/Python fundamentals</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Zoho Campus & Off-Campus — Recruitment Process',
      overview: 'Zoho\'s famous hiring process tests C/Java/Python fundamentals in Round 1, followed by Round 2 (5–6 DSA/logic programs) and Round 3 (console app design).',
      stages: [['1', 'Round 1 (Aptitude + C/Java Output)', 'Trace pointers, loops, recursion, and aptitude.', 'Yes'], ['2', 'Round 2 (Programming)', '5–6 logic/matrix/string problems without built-in shortcuts.', 'Yes'], ['3', 'Round 3 (System / App Design)', 'Build a clean modular console application.', 'Yes'], ['4', 'Technical + HR', 'CS fundamentals, projects, and cultural fit.', 'Yes']],
      flow: 'Round 1 MCQ → Round 2 Coding → Round 3 Console App → Technical + HR → Offer',
      roles: [['Software Developer', '₹6.5–8.5+ LPA', 'Product engineering across Zoho & ManageEngine']],
      rounds: [{ heading: '1. Round 2 Coding', body: 'Focuses on matrix patterns, wave arrays, number systems, and string manipulation.' }],
      tips: ['Write logic from scratch without relying on regex or heavy helper libraries.'],
    }),
  },
  {
    name: 'Persistent Systems',
    slug: 'persistent-systems',
    industry: 'Digital Engineering & Enterprise Modernization',
    company_size: '23,000+ employees',
    headquarters: 'Pune, India',
    description: 'Persistent Systems is a global digital engineering and enterprise modernization partner.',
    examName: 'Persistent Martian & Campus OA 2026',
    badge: 'Campus OA 2026',
    t1: 'Round 1: Persistent Core DSA (Q1–Q15)',
    t2: 'Round 2: Trees, Graphs & Hashing (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: PERSISTENT_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Persistent Systems',
      intro: 'Persistent Systems is a global <strong>digital engineering, cloud, data, and AI services</strong> company founded in <strong>1990</strong> in Pune.',
      facts: [['Founded', '1990'], ['Headquarters', 'Pune, Maharashtra, India'], ['Industry', 'Digital Engineering & IT Services'], ['Employees', '23,000+']],
      does: ['<strong>Product Engineering:</strong> Cloud-native SaaS, data pipelines, and Salesforce/AWS solutions.', '<strong>Martian Program:</strong> Flagship campus internship-to-FTE engineering track.'],
      india: 'Pune, Nagpur, Bengaluru, Hyderabad, and Goa are major Persistent engineering centers.',
      knownFor: 'Clean DSA assessments covering trees, graphs, hashing, and core CS.',
      takeaway: 'Prepare <strong>BFS/DFS, hash maps, prefix sums, and OOP/SQL fundamentals</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Persistent Martian & Campus — Recruitment Process',
      overview: 'Persistent conducts an online coding + CS MCQ test followed by technical and HR interviews.',
      stages: [['1', 'Online Assessment', 'CS MCQs + 2 DSA coding problems.', 'Yes'], ['2', 'Technical Interview 1 & 2', 'DSA, DBMS/SQL, OOPs, and projects.', 'Yes'], ['3', 'HR Round', 'Communication and role alignment.', 'Yes']],
      flow: 'Online Assessment → Technical Round 1 → Technical Round 2 → HR → Offer',
      roles: [['Software Engineer', '₹5.0–7.5+ LPA', 'Product engineering & cloud modernization']],
      rounds: [{ heading: '1. Online Coding', body: 'Tests graphs, trees, sliding windows, and frequency counting.' }],
      tips: ['Practice medium DSA problems and SQL queries cleanly.'],
    }),
  },
  {
    name: 'KPIT',
    slug: 'kpit',
    industry: 'Automotive Software & Embedded Systems',
    company_size: '13,000+ employees',
    headquarters: 'Pune, India',
    description: 'KPIT Technologies builds software for autonomous driving, EV powertrains, and connected vehicles.',
    examName: 'KPIT Automotive & Embedded OA 2026',
    badge: 'Core Tech OA 2026',
    t1: 'Round 1: EV BMS & CAN-Bus Core (Q1–Q15)',
    t2: 'Round 2: ADAS, Bitwise & Telemetry (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: KPIT_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'KPIT',
      intro: 'KPIT Technologies is a global partner to the automotive industry building <strong>Software-Defined Vehicles (SDV), EV powertrains, ADAS, and AUTOSAR</strong>, founded in <strong>1990</strong>.',
      facts: [['Founded', '1990'], ['Headquarters', 'Pune, Maharashtra, India'], ['Industry', 'Automotive Embedded & Mobility'], ['Employees', '13,000+']],
      does: ['<strong>Electric Powertrain:</strong> EV Battery Management Systems (BMS), inverters, and charging.', '<strong>Autonomous & ADAS:</strong> Sensor fusion, radar/LiDAR processing, and AUTOSAR.'],
      india: 'Pune, Bengaluru, and Kochi host KPIT\'s core automotive engineering centers.',
      knownFor: 'Embedded C/C++, CAN protocols, bitwise telemetry, and EV domain hiring.',
      takeaway: 'Focus on <strong>bitmasks, sensor arrays, hysteresis/state machines, and C/C++ memory</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'KPIT Automotive & Embedded — Recruitment Process',
      overview: 'KPIT evaluates C/C++, bitwise operations, embedded logic, and automotive domain problem solving.',
      stages: [['1', 'Online Assessment', 'Embedded C/C++ MCQs + 2 coding problems.', 'Yes'], ['2', 'Technical Interview', 'Pointers, bitwise, RTOS, CAN basics, and coding.', 'Yes'], ['3', 'HR Interview', 'Mobility interest and cultural fit.', 'Yes']],
      flow: 'Online Assessment → Technical Interview → HR → Offer',
      roles: [['Trainee Engineer (Automotive / Embedded)', '₹4.5–6.5 LPA', 'EV BMS, ADAS & AUTOSAR']],
      rounds: [{ heading: '1. Embedded Coding', body: 'Tests CAN masks, sensor thresholds, ring buffers, and EV telemetry.' }],
      tips: ['Revise C pointers, bitwise masks, and embedded state-machine logic.'],
    }),
  },
  {
    name: 'Tata Elxsi',
    slug: 'tata-elxsi',
    industry: 'Embedded, Automotive & Media Engineering',
    company_size: '13,000+ employees',
    headquarters: 'Bengaluru, India',
    description: 'Tata Elxsi provides design and technology services across automotive, broadcast/media, and healthcare.',
    examName: 'Tata Elxsi Embedded & Mobility Campus Test 2026',
    badge: 'Core Tech OA 2026',
    t1: 'Round 1: DSP, Video & Embedded Core (Q1–Q15)',
    t2: 'Round 2: Buffers, Bitwise & Protocols (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: TATA_ELXSI_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Tata Elxsi',
      intro: 'Tata Elxsi (part of the Tata Group) is a global design and engineering leader in <strong>automotive, broadcast & OTT media, and medical devices</strong>, founded in <strong>1989</strong>.',
      facts: [['Founded', '1989'], ['Headquarters', 'Bengaluru, Karnataka, India'], ['Industry', 'Embedded Systems, Media & Mobility'], ['Employees', '13,000+']],
      does: ['<strong>Transportation:</strong> EV, ADAS, and connected cockpit software.', '<strong>Media & Broadcast:</strong> Video codecs, STB firmware, and OTT streaming.'],
      india: 'Bengaluru, Thiruvananthapuram, Pune, and Chennai are key Tata Elxsi centers.',
      knownFor: 'Embedded C/C++, DSP/image processing, and RTOS engineering.',
      takeaway: 'Prepare <strong>bitwise operations, signal/image arrays, ring buffers, and C/OS fundamentals</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Tata Elxsi Embedded & Mobility — Recruitment Process',
      overview: 'Tata Elxsi tests aptitude, C/C++/embedded MCQs, and coding problems.',
      stages: [['1', 'Online Test', 'Aptitude + C/Embedded MCQs + 1–2 coding problems.', 'Yes'], ['2', 'Technical Interview', 'C/C++, OS, microcontrollers, and project deep dive.', 'Yes'], ['3', 'HR Interview', 'Career goals and relocation fit.', 'Yes']],
      flow: 'Online Test → Technical Interview → HR → Offer',
      roles: [['Engineer (Embedded / Software)', '₹4.5–6.5 LPA', 'Automotive, Media & Healthcare Engineering']],
      rounds: [{ heading: '1. Coding & Embedded Round', body: 'Tests frame/signal filtering, bit manipulation, and matrix operations.' }],
      tips: ['Focus on clean C/Java/Python array & bitwise implementations.'],
    }),
  },
  {
    name: 'Virtusa',
    slug: 'virtusa',
    industry: 'Digital Engineering & IT Services',
    company_size: '35,000+ employees',
    headquarters: 'Southborough, MA, USA',
    description: 'Virtusa delivers digital engineering, cloud, and enterprise IT solutions globally.',
    examName: 'Virtusa NeuralHack & Campus OA 2026',
    badge: 'Campus OA 2026',
    t1: 'Round 1: NeuralHack Core (Q1–Q15)',
    t2: 'Round 2: Strings, Greedy & SQL Logic (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: VIRTUSA_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Virtusa',
      intro: 'Virtusa Corporation is a global provider of <strong>digital engineering and IT consulting services</strong>, founded in <strong>1996</strong>.',
      facts: [['Founded', '1996'], ['Headquarters', 'Southborough, Massachusetts, USA'], ['Industry', 'IT Services & Digital Engineering'], ['India Hubs', 'Chennai, Hyderabad, Pune & Bengaluru']],
      does: ['<strong>Digital Transformation:</strong> Cloud migration, microservices, and QA automation.', '<strong>NeuralHack:</strong> Flagship campus coding competition.'],
      india: 'Chennai and Hyderabad are Virtusa\'s largest global delivery hubs.',
      knownFor: 'HackerRank-style NeuralHack coding assessments and Java full-stack hiring.',
      takeaway: 'Focus on <strong>arrays, strings, SQL aggregations, and clean Java/Python coding</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Virtusa NeuralHack & Campus — Recruitment Process',
      overview: 'Virtusa hires through NeuralHack and campus drives featuring coding + SQL/Java MCQs.',
      stages: [['1', 'Online Coding + MCQ', '2 coding problems + Java/SQL/CS MCQs.', 'Yes'], ['2', 'Technical + HR Interview', 'Core Java/Python, SQL, and projects.', 'Yes']],
      flow: 'Online Assessment → Technical Interview → HR → Offer',
      roles: [['Associate Engineer', '₹4.5–6.5 LPA', 'Full-stack, Cloud & Enterprise Delivery']],
      rounds: [{ heading: '1. HackerRank OA', body: 'Tests string processing, hashing, greedy selection, and SQL-like aggregation.' }],
      tips: ['Practice HackerRank-style I/O and clean edge-case checks.'],
    }),
  },
  {
    name: 'Mphasis',
    slug: 'mphasis',
    industry: 'Cloud & Cognitive IT Services',
    company_size: '32,000+ employees',
    headquarters: 'Bengaluru, India',
    description: 'Mphasis applies next-gen cloud and cognitive solutions for global banking and enterprise clients.',
    examName: 'Mphasis Campus Engineering OA 2026',
    badge: 'Campus OA 2026',
    t1: 'Round 1: Mphasis Core Logic (Q1–Q15)',
    t2: 'Round 2: Arrays & Number Systems (Q16–Q35)',
    t3: 'Round 3: Interview Coding Set (Q36–Q50)',
    questions: MPHASIS_QUESTIONS,
    aboutCompany: buildAboutCompany({
      name: 'Mphasis',
      intro: 'Mphasis Limited is an Indian multinational IT services and consulting company specializing in <strong>cloud, cognitive services, and BFSI modernization</strong>, founded in <strong>1998</strong>.',
      facts: [['Founded', '1998'], ['Headquarters', 'Bengaluru, Karnataka, India'], ['Industry', 'IT Services & Cloud'], ['Employees', '32,000+']],
      does: ['<strong>Cloud & Cognitive:</strong> Application modernization, DevOps, and AI/analytics.', '<strong>BFSI Platforms:</strong> Core banking and insurance engineering.'],
      india: 'Bengaluru, Pune, Chennai, and Mumbai are primary Mphasis delivery centers.',
      knownFor: 'Accessible campus drives testing aptitude, communication, and foundational coding.',
      takeaway: 'Master <strong>number systems, basic arrays, strings, and OOP/SQL basics</strong>.',
    }),
    aboutExam: buildAboutExam({
      title: 'Mphasis Campus Engineering — Recruitment Process',
      overview: 'Mphasis conducts an aptitude + coding + communication test followed by technical and HR interviews.',
      stages: [['1', 'Aptitude & Coding Test', 'Quant, logical, verbal, and 1–2 coding problems.', 'Yes'], ['2', 'Technical + HR Interview', 'Programming basics, SQL, and communication.', 'Yes']],
      flow: 'Online Test → Technical Interview → HR → Offer',
      roles: [['Associate Software Engineer', '₹4.0 LPA', 'Application development & cloud support']],
      rounds: [{ heading: '1. Coding & Logic', body: 'Tests digit manipulation, array bounds, and basic simulation.' }],
      tips: ['Keep code clean and handle single-element and negative-value edge cases.'],
    }),
  },
];

async function main() {
  let totalErrors = 0;
  for (const c of OPTION_A) {
    const errs = verifyCompanyQuestions(c.name, c.questions);
    totalErrors += errs.length;
    console.log(`${c.name.padEnd(20)} | Qs: ${String(c.questions.length).padStart(2)} | Errors: ${errs.length}`);
    for (const e of errs) console.error('  ERR:', e);
  }
  if (totalErrors > 0) {
    console.error(`\nVERIFICATION FAILED with ${totalErrors} error(s). Aborting seed.`);
    process.exit(1);
  }
  console.log('\nALL 300 OPTION A QUESTIONS VERIFIED SUCCESSFULLY (0 ERRORS).');

  for (const c of OPTION_A) {
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
        price: 99, paper_tabs: tabs, upvotes: 100, is_public_exam: false, is_deleted: false,
      });
      if (error) throw new Error(`Exam insert ${c.slug}: ${error.message}`);
    }
    console.log(`Seeded ${c.name} -> company + exam (50 Qs)`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
