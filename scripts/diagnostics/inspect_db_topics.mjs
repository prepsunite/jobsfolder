import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspect() {
  const { count: tqCount } = await supabase.from('topic_questions').select('*', { count: 'exact', head: true });
  console.log('Total rows in topic_questions:', tqCount);

  // Paginate to find all distinct topic_ids in topic_questions
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
  console.log('Total distinct topic_ids in topic_questions:', allTopicIds.size);
  console.log(Array.from(allTopicIds).sort());
}
inspect();
