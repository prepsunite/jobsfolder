import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { verifyCompanyQuestions, buildQuestionHtml } from './verify_and_build.mjs';
import { AMAZON_QUESTIONS } from './data_amazon.mjs';
import { GOOGLE_QUESTIONS } from './data_google.mjs';
import { CP_BANK_PART2 } from './cp_bank_part2.mjs';
import { CP_BANK_PART3 } from './cp_bank_part3.mjs';

for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const STRIP_BRANDS = [
  [/\bFulfillment Center\b/gi, 'Adjacent Array'],
  [/\bPrime Video\b/gi, 'Sliding Window'],
  [/\bAWS Auto-Scaling\b/gi, 'Contiguous Partition'],
  [/\bDynamoDB Partition\b/gi, 'Task Scheduler'],
  [/\bKiva Robot\b/gi, 'Grid Path'],
  [/\bDelivery Drone\b/gi, 'Minimum Refueling'],
  [/\bS3 Glacier Storage\b/gi, 'K-Way Stone'],
  [/\bCloudWatch Log\b/gi, 'Subarray'],
  [/\bPrime Logistics\b/gi, 'Weighted Graph'],
  [/\bOrder Book\b/gi, 'Largest Rectangle'],
  [/\bKindle Page Pagination\b/gi, 'Job Difficulty'],
  [/\bSQS Dead-Letter Queue\b/gi, 'DAG Parallel'],
  [/\bMarketplace Category Discount\b/gi, 'Subarray Ranges'],
  [/\bCloudFront Edge\b/gi, 'LRU'],
  [/\bAlexa Wake-Word\b/gi, 'Weighted String'],
  [/\bEC2 Cluster\b/gi, 'Graph'],
  [/\bWarehouse\b/gi, 'Matrix'],
  [/\bKinesis Shard\b/gi, 'Circular Array'],
  [/\bCloud Security Group\b/gi, 'Bitmask Grid'],
  [/\bRecommendation Engine\b/gi, 'Shortest'],
  [/\bInventory Stockout\b/gi, 'Interval DP'],
  [/\bMarketplace Search\b/gi, 'String'],
  [/\bSupply Chain\b/gi, 'State Machine'],
  [/\bIAM Policy\b/gi, 'Pattern'],
  [/\bVPC Subnet\b/gi, 'Topological'],
  [/\bLambda Cold-Start\b/gi, 'Jump Game IV'],
  [/\bEBS Snapshot\b/gi, 'Fenwick Tree'],
  [/\bDelivery Van\b/gi, '2D Prefix'],
  [/\bFresh Grocery Shelf\b/gi, 'Sweep Line'],
  [/\bCloud Billing\b/gi, 'Arithmetic'],
  [/\bPrime Packaging Tape\b/gi, 'Rod'],
  [/\bYouTube Frame Buffer\b/gi, 'Array'],
  [/\bYouTube Ads\b/gi, 'Shortest'],
  [/\bYouTube Video\b/gi, 'Two-Pointer'],
  [/\bGoogle Docs\b/gi, 'String'],
  [/\bGoogle Photos\b/gi, 'Binary Search'],
  [/\bGoogle Sheets\b/gi, 'Interval Tree'],
  [/\bGoogle Meet\b/gi, 'Sweep Line'],
  [/\bGoogle Fonts\b/gi, 'Trie Backtracking'],
  [/\bGoogle Maps\b/gi, 'Multi-Source BFS'],
  [/\bGoogle Cloud\b/gi, 'Sliding Window'],
  [/\bGoogle Drive\b/gi, 'State DP'],
  [/\bGoogle Calendar\b/gi, 'Sweep Line'],
  [/\bSearch Autocomplete\b/gi, 'Dynamic Programming'],
  [/\bBorg Job Scheduler\b/gi, 'Interval'],
  [/\bBorg Fleet\b/gi, 'Greedy Two-Pass'],
  [/\bMaps\b/gi, 'Grid'],
  [/\bAndroid Lock Pattern\b/gi, 'Grid Backtracking'],
  [/\bAndroid Gesture\b/gi, 'Monotonic Stack'],
  [/\bAndroid\b/gi, 'DSU'],
  [/\bWaymo Lidar\b/gi, 'State-Space BFS'],
  [/\bWaymo\b/gi, 'Polar Sweep'],
  [/\bCalendar Conflicting\b/gi, 'Interval Scheduling'],
  [/\bBigQuery\b/gi, 'Weighted Graph'],
  [/\bChrome Tab History\b/gi, 'Versioned'],
  [/\bTPU Cluster\b/gi, 'Heap Greedy'],
  [/\bTPU\b/gi, 'Constrained Graph'],
  [/\bData Center\b/gi, 'DAG Memoization'],
  [/\bGKE Pod Allocation\b/gi, 'Greedy'],
  [/\bGmail Smart Compose\b/gi, 'String'],
  [/\bColossus\b/gi, 'Binary Search + BFS'],
  [/\bProtobuf\b/gi, 'Greedy'],
  [/\bColab\b/gi, 'Graph Mapping'],
  [/\bSpanner\b/gi, '2D LIS'],
  [/\bTensorFlow\b/gi, '2D Fenwick Tree'],
  [/\bDeepMind\b/gi, 'Difference DP'],
  [/\bAmazon\b/gi, 'System'],
  [/\bEC2\b/gi, 'Graph'],
  [/\bPrime Air\b/gi, 'Autonomous'],
  [/\bKiva\b/gi, 'Grid'],
];

function cleanText(str) {
  let out = String(str || '');
  for (const [re, rep] of STRIP_BRANDS) {
    out = out.replace(re, rep);
  }
  return out.replace(/\s{2,}/g, ' ').trim();
}

function cleanProblem(q, idx) {
  return {
    ...q,
    number: idx + 1,
    difficulty: q.difficulty === 'BASIC' ? 'MEDIUM' : (q.difficulty || 'HARD'),
    title: cleanText(q.title),
    description: cleanText(q.description),
  };
}

// Replace the 2 lighter problems in Google with stronger CP ones from Part 2/3
const rawPool = [
  ...AMAZON_QUESTIONS,
  ...GOOGLE_QUESTIONS.filter(q => q.fnName !== 'maxPodsScheduled' && q.fnName !== 'mergeComputeIntervals'),
  ...CP_BANK_PART2,
  ...CP_BANK_PART3,
];

const MASTER_CP_POOL = rawPool.map(cleanProblem);
console.log(`Master CP Bank size: ${MASTER_CP_POOL.length} unique Hard/Extreme problems.`);

console.log('Verifying all 143 CP problems (Python execution + parser)...');
const failures = verifyCompanyQuestions('MASTER_CP_BANK', MASTER_CP_POOL);
if (failures.length > 0) {
  console.error('Verification FAILED:', failures.slice(0, 10));
  process.exit(1);
}
console.log(`ALL ${MASTER_CP_POOL.length} CP problems PASSED Python & parser verification!`);

const BIG_TECH_SLUGS = [
  'amazon', 'google', 'microsoft', 'uber', 'nvidia',
  'adobe', 'atlassian', 'flipkart', 'goldman-sachs', 'jpmorgan-chase',
  'samsung', 'oracle', 'cisco', 'paypal', 'qualcomm',
  'razorpay', 'salesforce', 'sap-labs', 'servicenow', 'walmart'
];

const { data: comps } = await supabase.from('companies').select('id, name, slug').in('slug', BIG_TECH_SLUGS);
const { data: exams } = await supabase.from('exams').select('id, company_id, name, is_deleted').in('company_id', comps.map(c => c.id));

const medHardPool = MASTER_CP_POOL.filter(q => q.difficulty === 'MEDIUM' || q.difficulty === 'HARD');
const extremePool = MASTER_CP_POOL.filter(q => q.difficulty === 'EXTREME');

function pick50ForCompany(offset) {
  const picked = [];
  const used = new Set();
  // Pick 35 Medium/Hard + 15 Extreme (rotated by company offset)
  for (let i = 0; picked.length < 35 && i < medHardPool.length * 2; i++) {
    const q = medHardPool[(offset * 7 + i) % medHardPool.length];
    if (!used.has(q.fnName)) {
      used.add(q.fnName);
      picked.push({ ...q, number: picked.length + 1 });
    }
  }
  for (let i = 0; picked.length < 50 && i < extremePool.length * 2; i++) {
    const q = extremePool[(offset * 5 + i) % extremePool.length];
    if (!used.has(q.fnName)) {
      used.add(q.fnName);
      picked.push({ ...q, number: picked.length + 1 });
    }
  }
  return picked;
}

for (let idx = 0; idx < BIG_TECH_SLUGS.length; idx++) {
  const slug = BIG_TECH_SLUGS[idx];
  const comp = comps.find(c => c.slug === slug);
  if (!comp) continue;
  const activeExam = exams.find(e => e.company_id === comp.id && !e.is_deleted);
  if (!activeExam) continue;

  const qs = pick50ForCompany(idx);
  const tabs = [
    {
      id: `${slug}-round-1`,
      title: 'Round 1: OA Coding — Graphs, Trees & Sliding Window',
      isFree: false,
      content: qs.slice(0, 15).map(buildQuestionHtml).join('\n\n'),
      children: [],
    },
    {
      id: `${slug}-round-2`,
      title: 'Round 2: Technical DSA — DP, Segment Trees & Tries',
      isFree: false,
      content: qs.slice(15, 35).map(buildQuestionHtml).join('\n\n'),
      children: [],
    },
    {
      id: `${slug}-round-3`,
      title: 'Round 3: Extreme CP — Bitmask, Digit DP, Flow & Tarjan',
      isFree: false,
      content: qs.slice(35, 50).map(buildQuestionHtml).join('\n\n'),
      children: [],
    },
  ];

  const { error: upErr } = await supabase
    .from('exams')
    .update({ paper_tabs: tabs, is_public_exam: false })
    .eq('id', activeExam.id);
  if (upErr) {
    console.error(`Failed ${comp.name}:`, upErr);
    process.exit(1);
  }
  console.log(`Seeded ${comp.name.padEnd(20)} -> 50 pure CP problems (${qs.filter(q => q.difficulty === 'EXTREME').length} Extreme, ${qs.filter(q => q.difficulty === 'HARD').length} Hard, ${qs.filter(q => q.difficulty === 'MEDIUM').length} Medium)`);
}
