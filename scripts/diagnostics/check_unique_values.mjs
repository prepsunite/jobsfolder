import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data } = await supabase.from('technical_problems').select('category, topic_id, track');
  const cats = new Set(data.map(d => d.category));
  const topicIds = new Set(data.map(d => d.topic_id));
  const tracks = new Set(data.map(d => d.track));
  console.log('Categories in DB:', Array.from(cats));
  console.log('Topic IDs in DB:', Array.from(topicIds));
  console.log('Tracks in DB:', Array.from(tracks));
}

check();
