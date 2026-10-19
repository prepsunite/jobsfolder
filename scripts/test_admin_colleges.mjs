import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testAdminColleges() {
  const { data: colleges } = await supabase.from('colleges').select('*');
  const { data: csData } = await supabase.from('college_students').select('*');
  console.log('DB colleges:', colleges);
  console.log('DB college_students:', csData);
}
testAdminColleges();
