import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectExamsDeep() {
  const { data: exams } = await supabase.from('mock_exams').select('*');
  console.log('--- ALL MOCK EXAMS IN DB ---');
  for (const e of exams) {
    console.log({
      id: e.id,
      title: e.title,
      is_active: e.is_active,
      is_deleted: e.is_deleted,
      start_time: e.start_time,
      end_time: e.end_time,
      instructions_has_time: e.instructions?.includes('start_time') || e.instructions?.includes('end_time')
    });
  }

  // Also check cloud backup of exams in contact_messages
  const { data: cloudExams } = await supabase
    .from('contact_messages')
    .select('id, subject, message, created_at')
    .like('subject', '%B2B_EXAM%');
  console.log('\n--- CLOUD BACKUP EXAMS IN contact_messages ---');
  for (const ce of (cloudExams || [])) {
    try {
      const parsed = JSON.parse(ce.message);
      console.log({
        subject: ce.subject,
        id: parsed.id,
        title: parsed.title,
        is_active: parsed.is_active,
        start_time: parsed.start_time,
        end_time: parsed.end_time
      });
    } catch {}
  }
}
inspectExamsDeep();
