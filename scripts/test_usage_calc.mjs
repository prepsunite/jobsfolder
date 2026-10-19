import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testUsage() {
  const { data: csData } = await supabase
    .from('college_students')
    .select('id, email, college_id, college_name, role');
  console.log('csData:', csData);

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, name, role, is_tpo_admin, college_id')
    .eq('college_id', 'col-ghat-mtmuqj96');
  console.log('profiles for col-ghat-mtmuqj96:', profiles);
}
testUsage();
