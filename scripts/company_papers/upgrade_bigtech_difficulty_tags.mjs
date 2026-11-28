import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 1. Clean up stale 10-Q Google "Exam Module"
await sb.from('exams').update({ is_deleted: true }).eq('id', '363a2182-0bb8-44de-b4de-e387acce7a86');

const BIG_TECH_SLUGS = [
  'microsoft', 'adobe', 'flipkart', 'goldman-sachs', 'jpmorgan-chase',
  'samsung', 'atlassian', 'paypal', 'qualcomm', 'sap-labs', 'walmart',
  'nvidia', 'uber', 'salesforce', 'razorpay', 'servicenow', 'oracle', 'cisco'
];

const { data: comps } = await sb.from('companies').select('id, name, slug').in('slug', BIG_TECH_SLUGS);
const { data: exams } = await sb.from('exams').select('id, company_id, name, paper_tabs').in('company_id', comps.map(c => c.id));

function tagQuestionBlocks(html, tabIdx) {
  const parts = html.split(/(?=<div class="question-block)/i);
  let qLocalIdx = 0;
  return parts.map(part => {
    if (!part.includes('question-block')) return part;
    const idx = qLocalIdx++;
    let diff = 'MEDIUM';
    if (tabIdx === 0) diff = idx < 10 ? 'MEDIUM' : 'HARD';
    else if (tabIdx === 1) diff = idx < 15 ? 'HARD' : 'EXTREME';
    else diff = idx < 7 ? 'HARD' : 'EXTREME';

    // Remove any existing sr-only data-difficulty tag
    let cleaned = part.replace(/<span[^>]*data-difficulty="[^"]*"[^>]*>.*?<\/span>\s*/gi, '');
    const tag = `<span class="sr-only" data-difficulty="${diff}">Difficulty: ${diff}</span>`;
    cleaned = cleaned.replace(/(<\/h2>)/i, `$1\n    ${tag}`);
    return cleaned;
  }).join('');
}

for (const c of comps) {
  const cExams = exams.filter(e => e.company_id === c.id);
  for (const ex of cExams) {
    const tabs = Array.isArray(ex.paper_tabs) ? ex.paper_tabs : [];
    const updatedTabs = tabs.map((tab, idx) => ({
      ...tab,
      isFree: false,
      content: tagQuestionBlocks(tab.content || '', idx),
    }));
    const { error } = await sb
      .from('exams')
      .update({ paper_tabs: updatedTabs, is_public_exam: false })
      .eq('id', ex.id);
    if (error) {
      console.error(`Failed ${c.name}:`, error);
      process.exit(1);
    }
    console.log(`Updated ${c.name} (${ex.id}): ${updatedTabs.length} tabs tagged Medium/Hard/Extreme.`);
  }
}
