import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { expandTopicAliases } from '../frontend/src/services/topicMap.js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function auditAllDbTopics() {
  console.log('======================================================');
  console.log('AUDITING ALL DISTINCT TOPIC IDS IN SUPABASE');
  console.log('======================================================');

  // 1. technical_mcqs topics
  const { data: techRows, error: tErr } = await supabase
    .from('technical_mcqs')
    .select('topic_id')
    .eq('is_deleted', false);
  
  if (tErr) console.error('techErr:', tErr);
  const techTopicsInDb = new Set((techRows || []).map(r => r.topic_id).filter(Boolean));
  console.log(`\nDistinct topic_ids in technical_mcqs (${techTopicsInDb.size}):`);
  console.log(Array.from(techTopicsInDb));

  // 2. topic_questions topics
  const { data: aptRows, error: aErr } = await supabase
    .from('topic_questions')
    .select('topic_id')
    .eq('is_deleted', false)
    .limit(5000);
  
  if (aErr) console.error('aptErr:', aErr);
  const aptTopicsInDb = new Set((aptRows || []).map(r => r.topic_id).filter(Boolean));
  console.log(`\nSample distinct topic_ids in topic_questions (${aptTopicsInDb.size}):`);
  console.log(Array.from(aptTopicsInDb).slice(0, 30));

  // 3. Check for any topic_id in technical_mcqs that has NO aliases in topicMap
  console.log('\n--- Checking technical_mcq topic_id coverage in topicMap ---');
  for (const t of techTopicsInDb) {
    const exp = expandTopicAliases([t]);
    const ok = exp.includes(t);
    console.log(`  ${t}: ${ok ? '✅ Covered' : '❌ NOT covered'} (exp count: ${exp.length})`);
  }
}

auditAllDbTopics();
