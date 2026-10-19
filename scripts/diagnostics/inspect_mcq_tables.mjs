import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectTables() {
  // 1. questions
  const { data: qData, error: qErr } = await supabase.from('questions').select('*').limit(1);
  console.log('--- questions table ---');
  if (qErr) console.log('Error:', qErr.message);
  else console.log('Columns:', Object.keys(qData[0] || {}));

  // 2. technical_mcqs
  const { data: tData, error: tErr } = await supabase.from('technical_mcqs').select('*').limit(1);
  console.log('\n--- technical_mcqs table ---');
  if (tErr) console.log('Error:', tErr.message);
  else console.log('Columns:', Object.keys(tData[0] || {}));

  // 3. How does questionBank.service.ts or tpo.service.ts query MCQs?
}

inspectTables();
