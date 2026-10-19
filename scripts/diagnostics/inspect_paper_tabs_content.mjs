import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectPaperContent() {
  const { data: exams } = await supabase
    .from('exams')
    .select('id, name, paper_tabs')
    .eq('is_deleted', false);

  console.log(`Found ${exams.length} active exams.`);
  for (const e of exams) {
    const tabs = e.paper_tabs || [];
    console.log(`\nExam: "${e.name}" (ID: ${e.id}, Tabs: ${tabs.length})`);
    for (const t of tabs) {
      console.log(`  - Tab: "${t.title}" (Content Length: ${t.content?.length || 0})`);
      if (t.content && t.content.length > 0) {
        const preview = t.content.substring(0, 300).replace(/\n/g, ' ');
        console.log(`    Preview: ${preview}...`);
      }
    }
  }
}

inspectPaperContent().catch(console.error);
