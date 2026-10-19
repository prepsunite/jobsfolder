import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('Inspecting mock_exam_sections columns...');
  const { data: secData, error: secErr } = await supabase.from('mock_exam_sections').select('*').limit(1);
  if (secErr) console.error('Sec error:', secErr);
  else if (secData && secData[0]) console.log('mock_exam_sections columns:', Object.keys(secData[0]));
  else console.log('No rows in mock_exam_sections');

  console.log('\nInspecting student_exam_attempts columns...');
  const { data: attData, error: attErr } = await supabase.from('student_exam_attempts').select('*').limit(1);
  if (attErr) console.error('Att error:', attErr);
  else if (attData && attData[0]) console.log('student_exam_attempts columns:', Object.keys(attData[0]));
  else console.log('No rows in student_exam_attempts');
}
run();
