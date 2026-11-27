import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

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

const ABOUT_COMPANIES = {
  cisco: buildAboutCompany({
    name: 'Cisco',
    intro: 'Cisco Systems, Inc. is a global leader in <strong>enterprise networking, cybersecurity, cloud infrastructure, and collaboration software</strong>, founded in <strong>1984</strong>.',
    facts: [
      ['Founded', '1984'],
      ['Headquarters', 'San Jose, California, USA'],
      ['Industry', 'Networking, Cybersecurity & Cloud Infrastructure'],
      ['Employees', '85,000+ globally'],
      ['Core Products', 'IOS XE, Catalyst, Meraki, Webex, Splunk, ThousandEyes'],
    ],
    does: [
      '<strong>Enterprise Networking:</strong> Routers, switches, Wi-Fi, SD-WAN, and data-center fabrics.',
      '<strong>Cybersecurity:</strong> Firewalls, zero-trust access, threat intelligence (Talos), and observability.',
      '<strong>Cloud & Collaboration:</strong> Webex, ThousandEyes internet intelligence, and hybrid-cloud tooling.',
    ],
    india: 'Bengaluru hosts Cisco\'s second-largest engineering R&D hub globally, with major teams in networking OS, cloud security, silicon/ASIC firmware, and SaaS platforms.',
    knownFor: 'Powering the core backbone of the global internet and enterprise networks with high-reliability systems software and hardware.',
    takeaway: 'Expect strong emphasis on <strong>Computer Networks (TCP/IP, subnetting, routing, DNS), OS, bit manipulation, and clean algorithmic problem solving</strong>.',
  }),
  google: buildAboutCompany({
    name: 'Google',
    intro: 'Google LLC is a global technology company specializing in <strong>search, cloud computing, artificial intelligence, mobile platforms, and developer infrastructure</strong>, founded in <strong>1998</strong>.',
    facts: [
      ['Founded', '1998'],
      ['Headquarters', 'Mountain View, California, USA'],
      ['Industry', 'Internet Services, Cloud & AI'],
      ['Core Platforms', 'Search, Android, Chrome, YouTube, Google Cloud, Workspace'],
    ],
    does: [
      '<strong>Search & AI:</strong> Large-scale information retrieval, Gemini models, and machine learning systems.',
      '<strong>Google Cloud:</strong> Distributed storage, Kubernetes, BigQuery, and cloud infrastructure.',
      '<strong>Consumer Platforms:</strong> Android, Chrome, Maps, and YouTube serving billions of users.',
    ],
    india: 'Google has major engineering and R&D centers in Bengaluru and Hyderabad building Search, Cloud, Pay, and AI products.',
    knownFor: 'Large-scale distributed systems, algorithmic rigor, and high engineering bar in data structures and system design.',
    takeaway: 'Focus on <strong>optimal time/space complexity, graphs, dynamic programming, trees, and clean edge-case handling</strong>.',
  }),
};

const ABOUT_EXAMS = {
  cisco: buildAboutExam({
    title: 'Cisco Campus & Cloud Software Engineering — Recruitment Process',
    overview: 'Cisco hires Software Engineers, Network Consulting Engineers, and Systems/Firmware Engineers through an online assessment followed by technical and managerial rounds.',
    stages: [
      ['1', 'Online Assessment (OA)', 'Tests Computer Networks, OS, C/Python/Java fundamentals, and 2–3 coding problems.', 'Yes'],
      ['2', 'Technical Interview 1', 'Deep dive into DSA, networking protocols, OS concepts, and projects.', 'Yes'],
      ['3', 'Technical Interview 2', 'System/protocol design, debugging, and scenario-based problem solving.', 'Yes'],
      ['4', 'Managerial / HR Round', 'Team fit, ownership, communication, and role alignment.', 'Yes'],
    ],
    flow: 'Application → Online Assessment → Technical Round 1 → Technical Round 2 → Managerial / HR → Offer',
    roles: [
      ['Software Engineer (SWE)', '₹15–22 LPA', 'Backend, cloud, networking OS, and security platforms'],
      ['Network Consulting Engineer', '₹12–16 LPA', 'Enterprise routing, SD-WAN, automation, and architecture'],
    ],
    rounds: [
      {
        heading: '1. Online Assessment (OA)',
        body: 'Typically 60–90 minutes consisting of technical MCQs (Networking, OS, C pointers, DBMS) plus 2–3 coding questions.',
        bullets: ['Coding topics: Bit manipulation, packet/interval simulation, graphs, sliding window, and string parsing.', 'MCQ topics: OSI/TCP-IP layers, CIDR subnetting, ARP/BGP/OSPF, deadlocks, and virtual memory.'],
      },
      {
        heading: '2. Technical Interviews',
        body: 'Interviewers evaluate both algorithmic coding and core CS depth.',
        bullets: ['Explain how TCP 3-way handshake, NAT, DNS, and routing tables work.', 'Write clean, bug-free code with explicit handling of edge cases and constraints.'],
      },
    ],
    tips: [
      'Master bitmasking, IP/prefix matching, graph shortest paths, and ring-buffer/rate-limiter simulations.',
      'Revise Computer Networks (TCP vs UDP, subnetting, HTTP/TLS) alongside standard DSA.',
    ],
  }),

  capgemini: buildAboutExam({
    title: 'Capgemini Exceller — Recruitment Process & Exam Pattern',
    overview: 'Capgemini conducts the Exceller campus drive for Analyst, Senior Analyst, and Differential Analyst roles with progressive assessment stages.',
    stages: [
      ['1', 'Technical Assessment', 'Pseudocode, DBMS/SQL, Cloud, Networking, and Data Structures MCQs.', 'Yes'],
      ['2', 'English Communication', 'Reading, listening, speaking, and grammar evaluation.', 'Yes'],
      ['3', 'Game-Based Aptitude', 'Cognitive and logical puzzle games testing pattern recognition and speed.', 'Yes'],
      ['4', 'Coding Assessment', '2–3 hands-on coding problems (mandatory for higher packages).', 'Yes'],
      ['5', 'Technical + HR Interview', 'Resume, OOPs, SQL, coding logic, and behavioral fit.', 'Yes'],
    ],
    flow: 'Technical MCQ → Communication → Game-Based Aptitude → Coding Round → Technical + HR Interview → Offer',
    roles: [
      ['Analyst', '₹4.25 LPA', 'Entry-level software & enterprise delivery'],
      ['Analyst (Differential)', '₹5.75 LPA', 'Stronger coding + communication performers'],
      ['Senior Analyst', '₹7.50 LPA', 'Top performers in Exceller coding assessment'],
    ],
    rounds: [
      {
        heading: '1. Technical & Pseudocode Round',
        body: 'Tests output tracing, recursion/loop pseudocode, bitwise operations, SQL queries, and basic cloud/networking concepts.',
      },
      {
        heading: '2. Exceller Coding Round',
        body: 'Evaluates practical problem solving in Java, Python, or C++ across arrays, strings, hashing, greedy scheduling, and retail/supply-chain logic.',
      },
    ],
    tips: [
      'Practice tracing nested loops and bitwise pseudocode without a compiler.',
      'Solve all 50 Capgemini coding problems focusing on clean edge-case handling.',
    ],
  }),

  deloitte: buildAboutExam({
    title: 'Deloitte NLA (National Level Assessment) — Recruitment Process',
    overview: 'Deloitte hires Analysts and Associate Consultants across Risk, Tax Tech, Audit Analytics, and Consulting through its NLA assessment.',
    stages: [
      ['1', 'Aptitude & English', 'Quantitative reasoning, logical puzzles, and verbal comprehension.', 'Yes'],
      ['2', 'Technical MCQs', 'Programming basics, SQL, DBMS, and data interpretation.', 'Yes'],
      ['3', 'Coding Assessment', '2 coding questions testing logic, arrays, strings, and financial/compliance rules.', 'Yes'],
      ['4', 'JAM / Communication & Interview', 'Structured communication plus technical and behavioral interview.', 'Yes'],
    ],
    flow: 'Registration → NLA Online Test (Aptitude + Tech + Coding) → Interview Rounds → Offer',
    roles: [
      ['Analyst (Deloitte USI / India)', '₹7.6 LPA', 'Technology Consulting, Advisory & Enterprise Systems'],
      ['Associate Analyst', '₹4.5–5.5 LPA', 'Support, QA, and data operations'],
    ],
    rounds: [
      {
        heading: '1. NLA Online Assessment',
        body: 'Combines quantitative/logical aptitude, CS fundamentals, and 2 coding problems (usually 30–45 minutes for coding).',
      },
      {
        heading: '2. Technical & Case Interview',
        body: 'Focuses on SQL joins/aggregations, Python/Java basics, resume projects, and structured business problem solving.',
      },
    ],
    tips: [
      'Practice precision arithmetic, rounding/ledger rules, and interval/date calculations.',
      'Be ready to explain project architecture and business impact clearly.',
    ],
  }),

  ey: buildAboutExam({
    title: 'EY GDS (Global Delivery Services) — Campus Recruitment Pattern',
    overview: 'EY GDS recruits engineering graduates for Technology Consulting, Cybersecurity, Data & Analytics, and Assurance Tech roles.',
    stages: [
      ['1', 'Online Assessment', 'Aptitude, Logical Reasoning, Verbal, Technical MCQs, and Coding.', 'Yes'],
      ['2', 'Technical Interview', 'DSA basics, SQL, DBMS, OOPs, and resume projects.', 'Yes'],
      ['3', 'HR / Managerial Interview', 'Situational judgment, teamwork, and client-readiness.', 'Yes'],
    ],
    flow: 'Online Assessment → Technical Interview → HR / Managerial Round → Offer',
    roles: [
      ['Associate Software Engineer / Consultant', '₹4.8–6.5 LPA', 'Cloud, ERP, Data Analytics & Advisory Tech'],
    ],
    rounds: [
      {
        heading: '1. Online Assessment',
        body: 'Tests quantitative aptitude, SQL/DBMS, OOP concepts, and 1–2 coding problems on arrays, strings, and financial/ESG calculations.',
      },
      {
        heading: '2. Technical + HR Interviews',
        body: 'Assesses fundamentals in Java/Python, database normalization, and scenario-based consulting questions.',
      },
    ],
    tips: [
      'Focus on clean array/map aggregations, currency/percentage math, and SQL queries.',
    ],
  }),

  hcltech: buildAboutExam({
    title: 'HCLTech First Careers — Campus Recruitment Process',
    overview: 'HCLTech hires Graduate Engineer Trainees (GET) across Application Development, Infrastructure/Cloud Ops, and Embedded Engineering.',
    stages: [
      ['1', 'Aptitude & Technical Test', 'Numerical ability, logical reasoning, verbal, and CS fundamentals.', 'Yes'],
      ['2', 'Coding Assessment', '2 coding problems testing C/Java/Python logic and systems/array manipulation.', 'Yes'],
      ['3', 'Technical Interview', 'Core CS (OS, CN, DBMS, OOP) and coding walkthrough.', 'Yes'],
      ['4', 'HR Interview', 'Relocation flexibility, role fit, and communication.', 'Yes'],
    ],
    flow: 'Online Test + Coding → Technical Interview → HR Interview → Offer',
    roles: [
      ['Graduate Engineer Trainee (GET)', '₹4.25 LPA', 'Software engineering, cloud ops & product engineering'],
      ['GET (Digital / Specialist)', '₹5.5–6.5 LPA', 'Stronger coding & systems track'],
    ],
    rounds: [
      {
        heading: '1. Coding & Systems Round',
        body: 'Covers array processing, bitwise/firmware logic, caching, scheduling, and string manipulation.',
      },
    ],
    tips: [
      'Review OS scheduling, DNS/ring-buffer logic, and standard array/string traversal patterns.',
    ],
  }),

  hexaware: buildAboutExam({
    title: 'Hexaware PGET Premier Drive — Recruitment Process',
    overview: 'Hexaware hires Premier Graduate Engineer Trainees (PGET) and GETs for cloud, automation, BFSI, and digital engineering projects.',
    stages: [
      ['1', 'Online Aptitude & Domain Test', 'Quantitative, logical, verbal, and CS/pseudocode MCQs.', 'Yes'],
      ['2', 'Coding Assessment', '2–3 coding problems (45–60 min) in Java, Python, or C++.', 'Yes'],
      ['3', 'Communication Test', 'Automated English speaking/listening evaluation.', 'Yes'],
      ['4', 'Technical + HR Interview', 'Programming fundamentals, SQL, projects, and cultural fit.', 'Yes'],
    ],
    flow: 'Aptitude + Tech MCQ → Coding → Communication → Technical Interview → HR → Offer',
    roles: [
      ['GET (Standard)', '₹4.0 LPA', 'Application development & QA automation'],
      ['PGET (Premier)', '₹6.0 LPA', 'Full-stack, cloud & AI/automation engineering'],
    ],
    rounds: [
      {
        heading: '1. PGET Coding Round',
        body: 'Tests clean implementation of scheduling, BFSI/ledger rules, string parsing, and greedy/array algorithms.',
      },
    ],
    tips: [
      'Practice writing bug-free Java/Python code within 20 minutes per problem.',
    ],
  }),

  ibm: buildAboutExam({
    title: 'IBM Associate System Engineer (ASE) — Recruitment Process',
    overview: 'IBM\'s campus hiring focuses on coding fundamentals, hybrid cloud/enterprise problem solving, and English proficiency.',
    stages: [
      ['1', 'Coding Assessment', '1–2 coding problems on HackerRank/IBM platform (45–60 min).', 'Yes'],
      ['2', 'English Language Test', 'Grammar, vocabulary, and comprehension assessment.', 'Yes'],
      ['3', 'Technical Interview', 'DSA, OOPs, DBMS, Cloud/Linux basics, and project deep dive.', 'Yes'],
      ['4', 'HR / Managerial Interview', 'Problem-solving mindset, adaptability, and collaboration.', 'Yes'],
    ],
    flow: 'Coding Assessment → English Test → Technical Interview → HR Interview → Offer',
    roles: [
      ['Associate System Engineer (ASE)', '₹4.5 LPA', 'Enterprise applications, hybrid cloud & middleware'],
      ['Software Developer (ISL)', '₹9–12 LPA', 'IBM Software Labs product engineering'],
    ],
    rounds: [
      {
        heading: '1. IBM Coding Assessment',
        body: 'Emphasizes string manipulation, hash maps, queue/thread-pool simulation, and modular math.',
      },
    ],
    tips: [
      'Focus on clean time complexity (O(N) or O(N log N)) and edge-case validation.',
    ],
  }),

  ltimindtree: buildAboutExam({
    title: 'LTIMindtree Ignite & Edge — Recruitment Process',
    overview: 'LTIMindtree recruits engineering graduates for digital engineering, data/analytics, and enterprise cloud delivery.',
    stages: [
      ['1', 'Aptitude & Technical MCQ', 'Quant, logical, verbal, SQL, OOPs, and CS fundamentals.', 'Yes'],
      ['2', 'Coding Round', '2–3 coding problems testing arrays, strings, and business/IoT logic.', 'Yes'],
      ['3', 'Technical Interview', 'Java/Python, SQL queries, SDLC, and final-year project.', 'Yes'],
      ['4', 'HR Interview', 'Communication, flexibility, and career goals.', 'Yes'],
    ],
    flow: 'Online Test + Coding → Technical Interview → HR Interview → Offer',
    roles: [
      ['Graduate Engineer Trainee', '₹4.05 LPA', 'Core IT & digital delivery'],
      ['Specialist / Differential', '₹5.5–6.5 LPA', 'Higher coding-round performers'],
    ],
    rounds: [
      {
        heading: '1. Coding Assessment',
        body: 'Tests array sliding windows, telemetry/sensor thresholds, sorting/greedy, and string normalization.',
      },
    ],
    tips: [
      'Solve all 50 LTIMindtree questions and revise SQL joins, normalization, and OOP pillars.',
    ],
  }),

  oracle: buildAboutExam({
    title: 'Oracle Server Technology & Cloud — Recruitment Process',
    overview: 'Oracle conducts a rigorous technical hiring process for Server Technology (DB/OCI) and Applications Engineer roles.',
    stages: [
      ['1', 'Oracle Online Assessment', 'CS MCQs (DBMS, OS, CN, C/Java) + 2–3 DSA/systems coding problems.', 'Yes'],
      ['2', 'Technical Interview 1', 'DSA coding on shared editor + DBMS/SQL internals.', 'Yes'],
      ['3', 'Technical Interview 2', 'System design, concurrency, indexing, and project architecture.', 'Yes'],
      ['4', 'Technical / HR Final Round', 'Engineering bar, ownership, and team fit.', 'Yes'],
    ],
    flow: 'Online Assessment → Technical Round 1 → Technical Round 2 → Final Managerial/HR → Offer',
    roles: [
      ['Applications Engineer', '₹12–16 LPA', 'Oracle Fusion Cloud & enterprise apps'],
      ['Member of Technical Staff (Server Tech / OCI)', '₹18–26+ LPA', 'Database internals, OCI distributed systems'],
    ],
    rounds: [
      {
        heading: '1. Online Assessment & Technical Rounds',
        body: 'Heavy focus on B-tree/LSM/cache concepts, lock/deadlock detection, query cost, graphs, and DP.',
      },
    ],
    tips: [
      'Master DBMS internals (ACID, isolation levels, indexing) alongside medium-hard DSA.',
    ],
  }),

  'tech-mahindra': buildAboutExam({
    title: 'Tech Mahindra SuperCoder — Recruitment Process',
    overview: 'Tech Mahindra hires Associate Software Engineers and SuperCoders across telecom 5G, OSS/BSS, and enterprise digital services.',
    stages: [
      ['1', 'Aptitude, English & Psychometric', 'Quantitative, logical, English essay/grammar, and psychometric check.', 'Yes'],
      ['2', 'Technical & Coding Round', 'CS MCQs + coding problems (SuperCoder track requires higher score).', 'Yes'],
      ['3', 'Technical + HR Interview', 'Core programming, networking/telecom basics, and HR fit.', 'Yes'],
    ],
    flow: 'Aptitude + Essay → Technical & SuperCoder Coding → Technical + HR Interview → Offer',
    roles: [
      ['Associate Software Engineer', '₹3.25–4.0 LPA', 'Standard campus delivery track'],
      ['SuperCoder', '₹5.5 LPA', 'Advanced coding & telecom/digital engineering'],
    ],
    rounds: [
      {
        heading: '1. SuperCoder Coding Round',
        body: 'Tests array/string manipulation, telecom signal/billing calculations, and greedy algorithms.',
      },
    ],
    tips: [
      'Clear sectional cutoffs in aptitude and practice clean coding without syntax errors.',
    ],
  }),

  wipro: buildAboutExam({
    title: 'Wipro Elite NTH & Turbo — Recruitment Process',
    overview: 'Wipro recruits fresh engineering graduates through Elite National Talent Hunt (NTH) and Turbo hiring drives.',
    stages: [
      ['1', 'Aptitude & Essay Writing', 'Quant, logical, verbal reasoning + 20-minute written essay.', 'Yes'],
      ['2', 'Online Coding Round', '2 coding problems (60 minutes) in Java, Python, C, or C++.', 'Yes'],
      ['3', 'Business Discussion (Tech + HR)', 'Coding concepts, project walkthrough, and HR evaluation.', 'Yes'],
    ],
    flow: 'Aptitude + Essay → Coding Assessment → Technical + HR Interview → Offer',
    roles: [
      ['Project Engineer (Elite)', '₹3.5 LPA', 'Enterprise application development'],
      ['Turbo Engineer', '₹5.5–6.5 LPA', 'High-scoring coders & digital engineering'],
    ],
    rounds: [
      {
        heading: '1. Wipro Coding Round',
        body: '2 problems: one easy-medium (arrays, numbers, strings) and one medium (sorting, two-pointers, hashing, matrix).',
      },
    ],
    tips: [
      'Aim to pass all test cases on both problems to qualify for the Turbo package.',
    ],
  }),

  cognizant: buildAboutExam({
    title: 'Cognizant GenC & GenC Elevate — Recruitment Process',
    overview: 'Cognizant hires through GenC (standard) and GenC Elevate / GenC Pro (skill-based coding & cloud/SQL) campus tracks.',
    stages: [
      ['1', 'Communication Assessment', 'Reading, listening, speaking, and pronunciation.', 'Yes'],
      ['2', 'Aptitude & Technical Assessment', 'Quant, logical reasoning, SQL, and programming MCQs.', 'Yes'],
      ['3', 'Coding Assessment (GenC Elevate)', '2–3 coding problems + SQL queries.', 'Yes'],
      ['4', 'Technical + HR Interview', 'Java/Python, SQL joins, projects, and behavioral questions.', 'Yes'],
    ],
    flow: 'Communication → Aptitude → Coding + SQL → Technical + HR Interview → Offer',
    roles: [
      ['GenC', '₹4.0 LPA', 'Core software & enterprise delivery'],
      ['GenC Elevate / Pro', '₹5.4–6.75 LPA', 'Skill-verified coding, SQL & cloud specialists'],
    ],
    rounds: [
      {
        heading: '1. GenC Elevate Coding & SQL',
        body: 'Tests array/string logic, hash maps, sorting, and practical SQL queries.',
      },
    ],
    tips: [
      'Practice both coding problems and SQL queries cleanly.',
    ],
  }),

  amazon: buildAboutExam({
    title: 'Amazon SDE Online Assessment (OA) — Recruitment Process',
    overview: 'Amazon\'s SDE-1 / Intern hiring evaluates algorithmic problem solving and Amazon\'s 16 Leadership Principles.',
    stages: [
      ['1', 'Online Assessment (OA)', '2 DSA coding problems (70–90 min) + Work Style & Work Simulation.', 'Yes'],
      ['2', 'Technical Interview 1 & 2', 'Live DSA coding (trees, graphs, DP, sliding window) + Leadership Principles.', 'Yes'],
      ['3', 'Bar Raiser / Final Round', 'Deep dive into system design/code quality and behavioral ownership.', 'Yes'],
    ],
    flow: 'OA (2 Coding + Work Style) → Technical Round 1 → Technical Round 2 → Bar Raiser → Offer',
    roles: [
      ['SDE-1 / University Grad', '₹20–45+ LPA (CTC)', 'AWS, Retail, Prime, Devices & Fulfillment systems'],
    ],
    rounds: [
      {
        heading: '1. Amazon OA Coding',
        body: 'Typically 2 medium-hard DSA problems covering greedy, heaps, graphs/BFS, monotonic stack, and sliding windows.',
      },
    ],
    tips: [
      'Always optimize to O(N log N) or O(N) and prepare STAR stories for Leadership Principles.',
    ],
  }),

  google: buildAboutExam({
    title: 'Google Software Engineering Fresh Grad — Recruitment Process',
    overview: 'Google evaluates candidates on algorithmic depth, clean code quality, and Googleyness across OA and technical interviews.',
    stages: [
      ['1', 'Google Online Challenge (GOC)', '2 algorithmic coding problems (60–90 min).', 'Yes'],
      ['2', 'Technical Phone / Virtual Onsite (3–4 Rounds)', '45-min live coding on graphs, DP, trees, and strings.', 'Yes'],
      ['3', 'Googleyness & Team Match', 'Collaboration, ambiguity handling, and role alignment.', 'Yes'],
    ],
    flow: 'Online Challenge → 3–4 Technical Coding Rounds → Googleyness / Hiring Committee → Offer',
    roles: [
      ['Software Engineer (L3)', '₹30–50+ LPA (CTC)', 'Search, Cloud, Android, AI & Core Infrastructure'],
    ],
    rounds: [
      {
        heading: '1. Technical Coding Rounds',
        body: 'Heavy focus on graphs, dynamic programming, trees, intervals, binary search on answer, and clean modular code.',
      },
    ],
    tips: [
      'Think aloud, clarify constraints early, analyze time/space complexity, and dry-run edge cases.',
    ],
  }),

  infosys: buildAboutExam({
    title: 'Infosys Specialist Programmer (SP) & DSE — Recruitment Process',
    overview: 'Infosys hires top coders for Specialist Programmer (SP) and Digital Specialist Engineer (DSE) roles via HackWithInfy and campus drives.',
    stages: [
      ['1', 'Online Coding Assessment', '3 coding problems (Easy, Medium, Hard — 180 minutes).', 'Yes'],
      ['2', 'Technical + Behavioral Interview', 'DSA walkthrough, system/project discussion, and CS fundamentals.', 'Yes'],
    ],
    flow: '3-Question Coding Test → Role Shortlist (DSE / SP) → Technical + HR Interview → Offer',
    roles: [
      ['Digital Specialist Engineer (DSE)', '₹6.25 LPA', 'Full-stack & digital engineering'],
      ['Specialist Programmer (SP)', '₹9.5 LPA', 'High-complexity product & platform engineering'],
    ],
    rounds: [
      {
        heading: '1. SP / DSE Coding Test',
        body: 'Tests dynamic programming, graphs, greedy algorithms, number theory, and bitwise optimization.',
      },
    ],
    tips: [
      'Solve at least 2 full problems cleanly to target DSE/SP shortlists.',
    ],
  }),
};

async function main() {
  for (const [slug, aboutHtml] of Object.entries(ABOUT_COMPANIES)) {
    const { error } = await supabase
      .from('companies')
      .update({ about_company: aboutHtml, updated_at: new Date().toISOString() })
      .eq('slug', slug);
    if (error) throw new Error(`Company ${slug}: ${error.message}`);
    console.log(`Updated companies.about_company for ${slug} (${aboutHtml.length} chars)`);
  }

  for (const [slug, examHtml] of Object.entries(ABOUT_EXAMS)) {
    const { error } = await supabase
      .from('exams')
      .update({ content: examHtml, updated_at: new Date().toISOString() })
      .eq('company_slug', slug)
      .eq('is_deleted', false);
    if (error) throw new Error(`Exam ${slug}: ${error.message}`);
    console.log(`Updated exams.content for ${slug} (${examHtml.length} chars)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
