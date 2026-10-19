import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testRpc() {
  const res1 = await supabase.rpc('submit_exam_attempt_v2', {
    p_attempt_id: '00000000-0000-0000-0000-000000000000',
    p_responses: {},
    p_time_spent_seconds: 0
  });
  console.log('submit_exam_attempt_v2 response:', res1.error ? res1.error.message : res1.data);

  const res2 = await supabase.rpc('submit_and_grade_mock_attempt', {
    p_attempt_id: '00000000-0000-0000-0000-000000000000',
    p_responses: {},
    p_time_spent_seconds: 0
  });
  console.log('submit_and_grade_mock_attempt response:', res2.error ? res2.error.message : res2.data);
}
testRpc();
