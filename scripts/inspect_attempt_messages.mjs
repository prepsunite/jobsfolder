import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectMessages() {
  const { data: msgs } = await supabase
    .from('contact_messages')
    .select('id, subject, message, created_at')
    .like('subject', '%ATTEMPT%')
    .limit(3);

  for (const m of (msgs || [])) {
    console.log('\n--- MESSAGE:', m.subject);
    try {
      const parsed = JSON.parse(m.message);
      console.log('Keys:', Object.keys(parsed));
      console.log('Attempt summary:', {
        id: parsed.id,
        mock_exam_id: parsed.mock_exam_id,
        student_id: parsed.student_id,
        student_email: parsed.student_email,
        status: parsed.status,
        total_score: parsed.total_score,
        max_possible_score: parsed.max_possible_score,
        percentage: parsed.percentage
      });
    } catch (e) {
      console.log('Message length:', m.message?.length);
    }
  }
}
inspectMessages();
