import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function listAllTopicsWithCounts() {
  const topicCounts = {};
  let from = 0;
  const step = 1000;
  while (true) {
    const { data } = await supabase.from('topic_questions').select('topic_id').range(from, from + step - 1);
    if (!data || data.length === 0) break;
    data.forEach(r => {
      topicCounts[r.topic_id] = (topicCounts[r.topic_id] || 0) + 1;
    });
    if (data.length < step) break;
    from += step;
  }
  const entries = Object.entries(topicCounts).sort((a, b) => a[0].localeCompare(b[0]));
  console.log(`ALL ${entries.length} TOPICS IN topic_questions WITH ROW COUNTS:`);
  entries.forEach(([topic, count]) => {
    console.log(`- ${topic}: ${count} questions`);
  });
}
listAllTopicsWithCounts();
