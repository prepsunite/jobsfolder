import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkCompanies() {
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, name, slug, is_deleted, created_at')
    .order('name');

  if (error) {
    console.error('Error fetching companies:', error);
    return;
  }

  console.log(`Total companies in DB: ${companies.length}`);
  companies.forEach(c => {
    console.log(`- ${c.name.padEnd(20)} (slug: ${c.slug}, deleted: ${c.is_deleted})`);
  });
}

checkCompanies().catch(console.error);
