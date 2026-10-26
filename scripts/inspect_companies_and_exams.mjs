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
  const { data: companies, error: cErr } = await supabase.from('companies').select('id, name, slug').eq('is_deleted', false).order('name');
  if (cErr) { console.error('cErr:', cErr); return; }
  
  const { data: exams, error: eErr } = await supabase.from('exams').select('id, name, company_id, is_public_exam, paper_tabs, content, old_papers').eq('is_deleted', false);
  if (eErr) { console.error('eErr:', eErr); return; }

  console.log('Total Companies in DB:', companies.length);
  console.log('Total Exams in DB:', exams.length);

  const examsByCompany = {};
  for (const e of exams) {
    if (!examsByCompany[e.company_id]) examsByCompany[e.company_id] = [];
    examsByCompany[e.company_id].push(e);
  }

  const companiesWithoutExams = [];
  const companiesWithExams = [];

  for (const c of companies) {
    const cExams = examsByCompany[c.id] || [];
    if (cExams.length === 0) {
      companiesWithoutExams.push(c.name);
    } else {
      let totalTabs = 0;
      let hasContent = false;
      let hasOldPapers = false;
      for (const ce of cExams) {
        if (ce.paper_tabs && Array.isArray(ce.paper_tabs) && ce.paper_tabs.length > 0) totalTabs += ce.paper_tabs.length;
        if (ce.content) hasContent = true;
        if (ce.old_papers) hasOldPapers = true;
      }
      companiesWithExams.push({ name: c.name, examsCount: cExams.length, totalTabs, hasContent, hasOldPapers, examNames: cExams.map(e => e.name).join(', ') });
    }
  }

  const { data: experiences, error: expErr } = await supabase.from('experiences').select('*').limit(1);
  console.log('\n--- EXAM COMPANY SLUGS ---');
  for (const e of exams) {
    console.log(`${e.name.padEnd(50)} | company_slug: ${e.company_slug}`);
  }
  const serviceClient = createClient(env.VITE_SUPABASE_URL, fs.readFileSync('.env', 'utf8').match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)[1]);
  const { data: adminRows, error: aErr } = await serviceClient.from('experiences').select('id, student_name, status, is_deleted').limit(5);
  console.log('Admin query rows:', adminRows, 'Error:', aErr);

  const { data: approvedExp, count, error: anonErr } = await supabase
    .from('experiences')
    .select('id, company_name, role_title, student_name, verdict, status', { count: 'exact' });

  console.log('Anon query count:', count, 'Rows:', approvedExp?.length, 'Error:', anonErr);
  for (const e of exams) {
    const tabCount = Array.isArray(e.paper_tabs) ? e.paper_tabs.length : 0;
    console.log(`${e.name.padEnd(50)} | Tabs: ${tabCount}`);
  }
  const slugs = ['tcs', 'amazon', 'capgemini', 'deloitte', 'oracle', 'ibm', 'ey', 'wipro', 'infosys', 'accenture'];
  for (const s of slugs) {
    const { data, error } = await supabase.rpc('get_secure_exams_by_company', {
      p_company_slug: s,
      p_user_email: null,
    });
    if (error) {
      console.log(`${s.padEnd(12)} -> RPC error: ${error.message}`);
    } else {
      const names = (data || []).map(e => e.name).join('; ');
      console.log(`${s.padEnd(12)} -> Exams: ${(data || []).length} | Titles: ${names}`);
    }
  }
  for (const e of exams) {
    const c = companies.find(comp => comp.id === e.company_id);
    console.log(JSON.stringify({
      id: e.id,
      name: e.name,
      companyId: e.company_id,
      companyName: c ? c.name : 'Unknown',
      companySlug: c ? c.slug : 'unknown'
    }));
  }
  for (const e of exams) {
    const comp = companies.find(c => c.id === e.company_id);
    const compName = comp ? comp.name : 'Unknown';
    const hasTabs = e.paper_tabs && Array.isArray(e.paper_tabs) && e.paper_tabs.length > 0;
    const contentLen = (e.content || '').length;
    const oldPapersLen = (e.old_papers || '').length;
    console.log(`${compName.padEnd(16)} | ${e.name.padEnd(30)} | Tabs: ${hasTabs ? e.paper_tabs.length : 0} | content: ${contentLen} chars | old_papers: ${oldPapersLen} chars`);
    if (!hasTabs) {
      console.log('   Snippet:', (e.content || '').substring(0, 160).replace(/\n/g, ' '));
      if (oldPapersLen > 0) {
        console.log('   Old papers:', (e.old_papers || '').substring(0, 160).replace(/\n/g, ' '));
      }
    }
  }
}

check();
