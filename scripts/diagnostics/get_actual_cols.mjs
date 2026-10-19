import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function getCols() {
  const { data, error } = await supabase
    .from('technical_problems')
    .select('*')
    .limit(2);
  
  if (error) {
    console.error('Error selecting *:', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('Columns in technical_problems:');
    console.log(Object.keys(data[0]));
    console.log('\nSample row 1:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('Table is empty or no rows returned.');
  }
}

getCols();
