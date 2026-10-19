import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectAptitudeTopics() {
  const allTopicIds = new Set();
  let from = 0;
  const step = 1000;
  while (true) {
    const { data } = await supabase.from('topic_questions').select('topic_id').range(from, from + step - 1);
    if (!data || data.length === 0) break;
    data.forEach(r => allTopicIds.add(r.topic_id));
    if (data.length < step) break;
    from += step;
  }
  const dbTopics = Array.from(allTopicIds).sort();
  console.log(`Total topics in topic_questions: ${dbTopics.length}`);

  // Let's search for partial matches of the 6 blueprint topics:
  const checkList = [
    'syllogism',
    'syllogisms',
    'logical-problem',
    'sentence-improve',
    'critical-reasoning',
    'data-interpretation',
    'paper-folding',
    'paper-cutting',
    'water-image',
    'mirror-image',
    'order-and-ranking',
    'statement-and-assumption',
    'statement-and-conclusion',
    'trigonometry'
  ];

  console.log('\nSearching for matches in dbTopics:');
  for (const item of checkList) {
    const matched = dbTopics.filter(t => t.includes(item) || item.includes(t));
    console.log(`  "${item}" ->`, matched);
  }
}
inspectAptitudeTopics();
