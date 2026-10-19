import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function syncTpoAuth() {
  const { data, error } = await supabase.from('tpo_authorizations').upsert({
    id: 'tpo-auth-scalercorp-gmail-com',
    email: 'scalercorp@gmail.com',
    college_id: 'col-ghat-mtmuqj96',
    college_name: 'jhatu',
    college_code: 'GHAT',
    max_licenses: 2500,
    status: 'ACTIVE',
    assigned_at: '2026-09-23T15:42:37.649Z',
    updated_at: new Date().toISOString()
  });

  console.log('Upsert tpo_authorizations:', { data, error });

  const { data: updatedAuths } = await supabase.from('tpo_authorizations').select('*');
  console.log('Updated tpo_authorizations:', updatedAuths);
}

syncTpoAuth();
