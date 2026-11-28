import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { verifyCompanyQuestions, buildQuestionHtml } from './verify_and_build.mjs';
import { AMAZON_QUESTIONS } from './data_amazon.mjs';
import { GOOGLE_QUESTIONS } from './data_google.mjs';

for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function buildThreePaidTabs(slug, t1, t2, t3, questions) {
  return [
    { id: `${slug}-round-1`, title: t1, isFree: false, content: questions.slice(0, 15).map(buildQuestionHtml).join('\n\n'), children: [] },
    { id: `${slug}-round-2`, title: t2, isFree: false, content: questions.slice(15, 35).map(buildQuestionHtml).join('\n\n'), children: [] },
    { id: `${slug}-round-3`, title: t3, isFree: false, content: questions.slice(35, 50).map(buildQuestionHtml).join('\n\n'), children: [] },
  ];
}

const TARGETS = [
  {
    name: 'Amazon',
    slug: 'amazon',
    examId: 'b26ae50e-b184-46e3-a28b-12a60509df19',
    roundTitles: [
      'Round 1: Amazon SDE OA (Medium–Hard)',
      'Round 2: SDE-1/2 Technical Loops (Hard)',
      'Round 3: Bar-Raiser & Advanced Algorithms (Extreme)',
    ],
    questions: AMAZON_QUESTIONS,
  },
  {
    name: 'Google',
    slug: 'google',
    examId: 'dfcd4385-2687-4e5b-95c0-f4bbfab4cb33',
    roundTitles: [
      'Round 1: Google SWE OA (Medium–Hard)',
      'Round 2: L3/L4 Coding Onsite (Hard)',
      'Round 3: L4/L5 Bar-Raiser & Olympiad (Extreme)',
    ],
    questions: GOOGLE_QUESTIONS,
  },
];

for (const t of TARGETS) {
  console.log(`\nVerifying ${t.name} (${t.questions.length} Qs)...`);
  const failures = verifyCompanyQuestions(t.name, t.questions);
  if (failures.length > 0) {
    console.error(`${t.name} FAILED verification:`, failures);
    process.exit(1);
  }
  console.log(`${t.name} PASSED all ${t.questions.length} Python & parser checks!`);

  const tabs = buildThreePaidTabs(t.slug, t.roundTitles[0], t.roundTitles[1], t.roundTitles[2], t.questions);
  const { error: upErr } = await supabase
    .from('exams')
    .update({ paper_tabs: tabs, is_public_exam: false })
    .eq('id', t.examId);
  if (upErr) {
    console.error(`Failed updating ${t.name}:`, upErr);
    process.exit(1);
  }

  // Sync paper_tab_nodes
  await supabase.from('paper_tab_nodes').delete().eq('exam_id', t.examId);
  const rows = tabs.map((tab, idx) => ({
    id: tab.id,
    exam_id: t.examId,
    title: tab.title,
    emoji: '📄',
    content: tab.content,
    parent_id: null,
    sort_order: idx,
    is_free: false,
    is_deleted: false,
    updated_at: new Date().toISOString(),
  }));
  const { error: nodeErr } = await supabase.from('paper_tab_nodes').upsert(rows, { onConflict: 'id' });
  if (nodeErr) {
    console.warn(`paper_tab_nodes sync warning for ${t.name}:`, nodeErr.message);
  }
  console.log(`Updated ${t.name} in Supabase (50 Medium/Hard/Extreme Qs, all paid).`);
}
