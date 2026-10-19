import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkExamsPublicStatus() {
  const { data: exams } = await supabase
    .from('exams')
    .select('id, name, company_id, price, is_public_exam, is_deleted, paper_tabs')
    .eq('is_deleted', false);

  console.log(`Active exams in DB: ${exams?.length}`);
  exams?.forEach(e => {
    const tabs = e.paper_tabs || [];
    const freeTabs = tabs.filter(t => t.isFree === true || t.is_free === true);
    console.log(`- "${e.name}" (ID: ${e.id})`);
    console.log(`    Price: ₹${e.price}, is_public_exam: ${e.is_public_exam}, Tabs: ${tabs.length}, Free Tabs: ${freeTabs.length}`);
  });
}

checkExamsPublicStatus().catch(console.error);
