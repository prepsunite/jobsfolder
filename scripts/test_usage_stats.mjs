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
  const { data: tpoMsgs } = await supabase.from('contact_messages').select('*').like('subject', '%TPO%');
  console.log('TPO Messages in contact_messages:', tpoMsgs);
  
  const { data: auths } = await supabase.from('tpo_authorizations').select('*');
  console.log('tpo_authorizations in DB:', auths);
}

check();
