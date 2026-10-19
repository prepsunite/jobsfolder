import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testAttempts() {
  const { data, error } = await supabase
    .from('student_exam_attempts')
    .select('id, mock_exam_id, student_id, student_email, college_id, status, total_score, max_possible_score, percentage')
    .or('college_id.eq.col-ghat-mtmuqj96');

  console.log('Query result:', { data, error });

  // Also query contact_messages to see if attempts were backed up there
  const { data: msgs } = await supabase
    .from('contact_messages')
    .select('id, subject, created_at')
    .like('subject', '%ATTEMPT%');
  console.log('Attempt messages in contact_messages:', msgs);
}
testAttempts();
