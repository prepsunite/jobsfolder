import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkProfiles() {
  const { data: profiles, error } = await supabase.from('profiles').select('id, email, name, role, is_tpo_admin, college_id');
  if (error) console.error('Profiles error:', error);
  else console.table(profiles);

  const { data: tpos, error: tErr } = await supabase.from('tpo_authorizations').select('*');
  if (tErr) console.error('Tpos error:', tErr);
  else console.table(tpos);

  const { data: cs, error: csErr } = await supabase.from('college_students').select('*');
  if (csErr) console.error('CS error:', csErr);
  else console.table(cs);
}
checkProfiles();
