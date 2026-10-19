import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testSig() {
  const { data, error } = await supabase.rpc('get_college_placement_analytics', {
    p_college_id: 'col-ghat-mtmuqj96',
    p_batch: null,
    p_department: null
  });
  console.log('Result with 3 args:', { data, error });
}
testSig();
