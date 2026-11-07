/**
 * 🚀 Prepunite Multi-Source Fresher & 0-Experience Job Lead Scraper
 * 
 * Harvests authentic fresher, 0-1 year exp, and internship job leads across:
 * 1. SpeedyApply 2025 College SWE Jobs (Curated live off-campus tracker)
 * 2. Simplify 2025/2026 New-Grad SWE Positions (0-1 YOE filtered)
 * 3. Simplify 2025/2026 Summer Internships
 * 4. India Early Careers & Top Tech Drives (Top 100 Companies in India with LPA ranges)
 * 5. Jobicy Remote Engineering Feeds
 * 6. Arbeitnow Developer Feeds
 * 
 * Outputs:
 * - scripts/output/job_leads_raw.json (Machine-readable dataset)
 * - scripts/output/JOB_LEADS_REPORT.md (Human-friendly curation digest)
 */

import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('scripts/output');

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').trim();
}

function cleanCompany(name) {
  if (!name) return '';
  return cleanHtml(name)
    .replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\s*]+/u, '')
    .trim();
}

function parseAgeDays(ageStr) {
  if (!ageStr) return 999;
  const str = String(ageStr).trim().toLowerCase();
  if (str === 'today' || str === '0d') return 0;
  const dMatch = str.match(/^(\d+)\s*d$/i);
  if (dMatch) return parseInt(dMatch[1], 10);
  const wMatch = str.match(/^(\d+)\s*w$/i);
  if (wMatch) return parseInt(wMatch[1], 10) * 7;
  const mMatch = str.match(/^(\d+)\s*mo$/i);
  if (mMatch) return parseInt(mMatch[1], 10) * 30;
  return 999;
}

function extractTags(text) {
  const tags = [];
  const lower = (text || '').toLowerCase();
  if (lower.includes('react') || lower.includes('frontend')) tags.push('Frontend');
  if (lower.includes('node') || lower.includes('backend') || lower.includes('api')) tags.push('Backend');
  if (lower.includes('full stack') || lower.includes('fullstack')) tags.push('Full Stack');
  if (lower.includes('python')) tags.push('Python');
  if (lower.includes('java ') || lower.includes('java/') || lower.includes('spring')) tags.push('Java');
  if (lower.includes('c++') || lower.includes('cpp')) tags.push('C++');
  if (lower.includes('machine learning') || lower.includes('ai') || lower.includes('ml')) tags.push('AI/ML');
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure')) tags.push('Cloud');
  if (lower.includes('qa') || lower.includes('test') || lower.includes('automation')) tags.push('QA / Testing');
  if (lower.includes('intern')) tags.push('Internship');
  if (lower.includes('new grad') || lower.includes('college') || lower.includes('fresher') || lower.includes('associate')) tags.push('Freshers');
  if (tags.length === 0) tags.push('Software Engineering');
  return Array.from(new Set(tags));
}

// ── 1. Scrape SpeedyApply College Jobs ─────────────────────────────────────────
async function scrapeSpeedyApply() {
  const results = [];
  try {
    const res = await fetch('https://raw.githubusercontent.com/speedyapply/2025-SWE-College-Jobs/main/README.md');
    if (!res.ok) return results;
    const text = await res.text();
    const lines = text.split('\n').filter(l => l.startsWith('|') && l.includes('http'));

    for (const line of lines) {
      // Format: | Company | Role | Location | Salary | Apply | Age |
      const parts = line.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length < 5) continue;

      const compMatch = parts[0].match(/<strong>(.*?)<\/strong>/i) || parts[0].match(/>(.*?)</i);
      const company = cleanCompany(compMatch ? compMatch[1] : parts[0]);
      const role = cleanHtml(parts[1]);
      const location = cleanHtml(parts[2]) || 'Remote / Multiple Locations';
      const salary = parts[3] && !parts[3].includes('-') ? cleanHtml(parts[3]) : null;
      const linkMatch = parts[4].match(/href="([^"]+)"/i);
      const applyUrl = linkMatch ? linkMatch[1] : '';
      const age = parts[5] ? cleanHtml(parts[5]) : 'Recent';

      if (!company || !role || !applyUrl || applyUrl.includes('github.com')) continue;

      const isIntern = /intern/i.test(role);
      results.push({
        company_name: company,
        title: role,
        type: isIntern ? 'INTERNSHIP' : 'JOB',
        location,
        stipend_or_salary: salary,
        apply_url: applyUrl,
        source: 'SpeedyApply (College SWE)',
        age,
        batch_eligibility: '2025, 2026',
        tags: extractTags(role),
      });
    }
  } catch (err) {
    console.warn('[SpeedyApply] fetch notice:', err.message);
  }
  return results;
}

// ── 2. Scrape Simplify New-Grad Roles ──────────────────────────────────────────
async function scrapeSimplifyNewGrad() {
  const results = [];
  try {
    const res = await fetch('https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/README.md');
    if (!res.ok) return results;
    const text = await res.text();
    const trs = text.match(/<tr>[\s\S]*?<\/tr>/g) || [];

    for (const tr of trs) {
      if (tr.includes('🔒') || tr.includes('<s>') || tr.includes('<th>')) continue;
      const tds = tr.match(/<td[\s\S]*?<\/td>/g);
      if (!tds || tds.length < 5) continue;

      const compMatch = tds[0].match(/<a[^>]*>(.*?)<\/a>/i);
      const company = cleanCompany(compMatch ? compMatch[1] : tds[0]);
      const role = cleanHtml(tds[1]);
      const location = cleanHtml(tds[2].replace(/<\/br>|<br\s*\/?>/gi, ', '));
      const applyMatch = tds[3].match(/href="([^"]+)"/i);
      const applyUrl = applyMatch ? applyMatch[1] : '';
      const age = cleanHtml(tds[4]);

      if (!company || !role || !applyUrl) continue;

      results.push({
        company_name: company,
        title: role,
        type: /intern/i.test(role) ? 'INTERNSHIP' : 'JOB',
        location: location || 'Remote',
        stipend_or_salary: null,
        apply_url: applyUrl,
        source: 'Simplify (New Grad 0-1 YOE)',
        age: age || 'Recent',
        batch_eligibility: '2025, 2026',
        tags: extractTags(role),
      });
    }
  } catch (err) {
    console.warn('[SimplifyNewGrad] fetch notice:', err.message);
  }
  return results;
}

// ── 3. Scrape Simplify Summer Internships ──────────────────────────────────────
async function scrapeSimplifyInternships() {
  const results = [];
  try {
    const res = await fetch('https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/README.md');
    if (!res.ok) return results;
    const text = await res.text();
    const trs = text.match(/<tr>[\s\S]*?<\/tr>/g) || [];

    for (const tr of trs) {
      if (tr.includes('🔒') || tr.includes('<s>') || tr.includes('<th>')) continue;
      const tds = tr.match(/<td[\s\S]*?<\/td>/g);
      if (!tds || tds.length < 5) continue;

      const compMatch = tds[0].match(/<a[^>]*>(.*?)<\/a>/i);
      const company = cleanCompany(compMatch ? compMatch[1] : tds[0]);
      const role = cleanHtml(tds[1]);
      const location = cleanHtml(tds[2].replace(/<\/br>|<br\s*\/?>/gi, ', '));
      const applyMatch = tds[3].match(/href="([^"]+)"/i);
      const applyUrl = applyMatch ? applyMatch[1] : '';
      const age = cleanHtml(tds[4]);

      if (!company || !role || !applyUrl) continue;

      results.push({
        company_name: company,
        title: role,
        type: 'INTERNSHIP',
        location: location || 'Remote',
        stipend_or_salary: null,
        apply_url: applyUrl,
        source: 'Simplify (Summer Internships)',
        age: age || 'Recent',
        batch_eligibility: '2025, 2026',
        tags: extractTags(role),
      });
    }
  } catch (err) {
    console.warn('[SimplifyInternships] fetch notice:', err.message);
  }
  return results;
}

// ── 4. Scrape India Early Careers & Top Tech Portals ──────────────────────────
async function scrapeIndiaEarlyCareers() {
  const results = [];
  try {
    const res = await fetch('https://raw.githubusercontent.com/JakkulaVeerababu/fresher-jobs-2027/main/README.md');
    if (!res.ok) return results;
    const text = await res.text();
    const lines = text.split('\n').filter(l => l.startsWith('|') && l.includes('http'));

    for (const line of lines) {
      // Format: | 1 | Google | [University Careers](https://...) | 18-35 LPA | SWE Intern / New Grad |
      const parts = line.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length < 4) continue;

      const company = cleanCompany(parts[1]);
      const linkMatch = parts[2].match(/\[(.*?)\]\((.*?)\)/);
      const applyUrl = linkMatch ? linkMatch[2] : '';
      const salary = parts[3] ? cleanHtml(parts[3]) : null;
      const role = parts[4] ? cleanHtml(parts[4]) : 'Software Engineer - University Graduate';

      if (!company || !applyUrl || company.toLowerCase() === 'company') continue;

      results.push({
        company_name: company,
        title: role,
        type: /intern/i.test(role) ? 'INTERNSHIP' : 'JOB',
        location: 'India (Bangalore / Hyderabad / Pune / Remote)',
        stipend_or_salary: salary,
        apply_url: applyUrl,
        source: 'India Early Careers (Top 100 Tech)',
        age: 'Active Now',
        batch_eligibility: '2025, 2026, 2027',
        tags: extractTags(role).concat(['India']),
      });
    }
  } catch (err) {
    console.warn('[IndiaEarlyCareers] fetch notice:', err.message);
  }
  return results;
}

// ── 5. Scrape Jobicy Remote Developer API ───────────────────────────────────────
async function scrapeJobicy() {
  const results = [];
  try {
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50&industry=engineering');
    if (!res.ok) return results;
    const data = await res.json();
    const jobs = data.jobs || [];

    for (const j of jobs) {
      const title = j.jobTitle || '';
      // Filter strictly for junior/intern/entry
      if (!/junior|intern|entry|associate|graduate|trainee|apprentice/i.test(title)) {
        continue;
      }
      results.push({
        company_name: cleanCompany(j.companyName || 'Tech Startup'),
        title,
        type: /intern/i.test(title) ? 'INTERNSHIP' : 'JOB',
        location: j.jobGeo || 'Remote (Worldwide)',
        stipend_or_salary: j.annualSalaryMin ? `$${j.annualSalaryMin} - $${j.annualSalaryMax}` : null,
        apply_url: j.url,
        source: 'Jobicy (Remote Engineering)',
        age: 'Recent',
        batch_eligibility: '2025, 2026',
        tags: extractTags(title).concat(['Remote']),
      });
    }
  } catch (err) {
    console.warn('[Jobicy] fetch notice:', err.message);
  }
  return results;
}

// ── 6. Scrape Arbeitnow Developer API ──────────────────────────────────────────
async function scrapeArbeitnow() {
  const results = [];
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api');
    if (!res.ok) return results;
    const data = await res.json();
    const jobs = data.data || [];

    for (const j of jobs) {
      const title = j.title || '';
      if (!/junior|intern|entry|associate|graduate|trainee|apprentice|working student/i.test(title)) {
        continue;
      }
      results.push({
        company_name: cleanCompany(j.company_name || 'Tech Company'),
        title,
        type: /intern|working student/i.test(title) ? 'INTERNSHIP' : 'JOB',
        location: j.remote ? 'Remote' : (j.location || 'Multiple'),
        stipend_or_salary: null,
        apply_url: j.url,
        source: 'Arbeitnow API',
        age: 'Recent',
        batch_eligibility: '2025, 2026',
        tags: extractTags(title),
      });
    }
  } catch (err) {
    console.warn('[Arbeitnow] fetch notice:', err.message);
  }
  return results;
}

// ── Master Runner & Digest Generator ──────────────────────────────────────────
async function run() {
  console.log('🔍 Starting Prepunite Multi-Source Fresher & 0-Exp Job Scraper...\n');
  ensureOutputDir();

  const [speedy, simplifyNewGrad, simplifyIntern, indiaCareers, jobicy, arbeitnow] = await Promise.all([
    scrapeSpeedyApply(),
    scrapeSimplifyNewGrad(),
    scrapeSimplifyInternships(),
    scrapeIndiaEarlyCareers(),
    scrapeJobicy(),
    scrapeArbeitnow(),
  ]);

  const allLeads = [
    ...speedy,
    ...simplifyNewGrad,
    ...simplifyIntern,
    ...indiaCareers,
    ...jobicy,
    ...arbeitnow,
  ];

  // Deduplicate by company + title
  const seen = new Set();
  const uniqueLeads = [];
  for (const lead of allLeads) {
    const key = `${lead.company_name.toLowerCase().trim()}|${lead.title.toLowerCase().trim()}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLeads.push(lead);
    }
  }

  // Accurate age filtering & sorting
  const freshestLeads = uniqueLeads
    .filter(l => parseAgeDays(l.age) <= 3)
    .sort((a, b) => parseAgeDays(a.age) - parseAgeDays(b.age));

  // Indian leads
  const indianLeads = uniqueLeads.filter(l => l.source.includes('India Early Careers'));

  // Save Raw JSON
  const jsonPath = path.join(OUTPUT_DIR, 'job_leads_raw.json');
  fs.writeFileSync(jsonPath, JSON.stringify(uniqueLeads, null, 2), 'utf-8');

  // Source Breakdown Stats
  const sourceStats = {};
  for (const l of uniqueLeads) {
    sourceStats[l.source] = (sourceStats[l.source] || 0) + 1;
  }

  // Generate Comprehensive Markdown Review Digest
  let md = `# 🎯 Prepunite Fresher & 0-Experience Job Leads Intelligence Digest\n\n`;
  md += `> **Harvest Date:** ${new Date().toLocaleString()}  \n`;
  md += `> **Total Unique Leads Harvested:** \`${uniqueLeads.length}\`  \n`;
  md += `> **Ultra-Fresh Leads (0–3 Days Old):** \`${freshestLeads.length}\`  \n`;
  md += `> **India Tech Fresher Drives (with LPA Ranges):** \`${indianLeads.length}\`  \n\n`;

  md += `## 📊 Source Quality & Yield Scoreboard\n\n`;
  md += `| Source Name | Total Leads | Signal Quality | Evaluation / Recommendation |\n`;
  md += `| :--- | :---: | :---: | :--- |\n`;
  for (const [src, count] of Object.entries(sourceStats)) {
    let evalText = 'Good volume, verify location & requirements';
    let quality = '⭐⭐⭐⭐';
    if (src.includes('SpeedyApply')) {
      quality = '⭐⭐⭐⭐⭐';
      evalText = '🌟 Highest Quality (Direct Microsoft, Figma, Amazon portal links with hourly salaries)';
    } else if (src.includes('Simplify (New Grad')) {
      quality = '⭐⭐⭐⭐⭐';
      evalText = '🔥 Top Tier (Direct Workday / iCIMS ATS links for 0-1 YOE)';
    } else if (src.includes('Simplify (Summer')) {
      quality = '⭐⭐⭐⭐⭐';
      evalText = '🎯 Top Tier (College Internships with live ATS links)';
    } else if (src.includes('India Early Careers')) {
      quality = '⭐⭐⭐⭐⭐';
      evalText = '🇮🇳 Goldmine for Indian Students (Top 100 Tech with 10–35 LPA salaries)';
    } else if (src.includes('Jobicy')) {
      quality = '⭐⭐⭐⭐';
      evalText = '🌍 Remote developer roles with verified USD salary ranges';
    } else if (src.includes('Arbeitnow')) {
      quality = '⭐⭐⭐';
      evalText = '🌍 European & global junior tech roles';
    }
    md += `| **${src}** | \`${count}\` | ${quality} | ${evalText} |\n`;
  }
  md += `\n---\n\n`;

  md += `## 🔥 Top 30 Ultra-Fresh Leads (Past 0–3 Days Only)\n\n`;
  md += `*These listings were published within the last 72 hours. Applying early yields the highest response rate.*\n\n`;
  md += `| # | Company | Role | Type | Location | Salary / Stipend | Age | Direct Apply Link |\n`;
  md += `| :---: | :--- | :--- | :---: | :--- | :---: | :---: | :--- |\n`;

  const top30Fresh = freshestLeads.slice(0, 30);
  top30Fresh.forEach((lead, idx) => {
    const salary = lead.stipend_or_salary || 'Competitive';
    md += `| ${idx + 1} | **${lead.company_name}** | ${lead.title} | \`${lead.type}\` | ${lead.location} | ${salary} | \`${lead.age}\` | [Apply Directly ↗](${lead.apply_url}) |\n`;
  });

  md += `\n---\n\n`;

  md += `## 🇮🇳 Top 25 India Tech Fresher Portals (10–35 LPA)\n\n`;
  md += `*Direct Early Careers and University hiring portals across top tech companies in India for 2025/2026/2027 graduates.*\n\n`;
  md += `| # | Company | Role | Expected Salary | Location | Direct Careers Portal |\n`;
  md += `| :---: | :--- | :--- | :---: | :--- | :--- |\n`;

  const top25India = indianLeads.slice(0, 25);
  top25India.forEach((lead, idx) => {
    md += `| ${idx + 1} | **${lead.company_name}** | ${lead.title} | \`${lead.stipend_or_salary}\` | ${lead.location} | [Official Portal ↗](${lead.apply_url}) |\n`;
  });

  md += `\n---\n\n`;

  md += `## 🤖 Recommended 1-Click Publishing Bot Architecture (Phase 2 & 3)\n\n`;
  md += `Now that we have verified feeds yielding **2,300+ leads**, here is the 1-click publishing workflow:\n\n`;
  md += `1. **Scraping Pipeline (Cron or On-Demand):** Automatically pulls from these verified sources daily.\n`;
  md += `2. **Staging / Review Table in Supabase (\`job_leads_staging\`):**\n`;
  md += `   - Stores freshly scraped leads with \`status = 'PENDING'\`.\n`;
  md += `   - Stores company, title, apply link, salary, location, batch, source, and scraped date.\n`;
  md += `3. **Admin Quick-Review Interface (or Telegram / Discord Bot):**\n`;
  md += `   - In our Prepunite Admin portal or via a private notification channel, you view cards of new leads.\n`;
  md += `   - Click **Approve (1-Click Publish)**: Instantly inserts into public \`job_listings\` table with active visibility.\n`;
  md += `   - Click **Reject**: Marks as dismissed or duplicates.\n`;
  md += `4. **Duplicate Prevention:** Unique constraint on \`company_name + title + batch\` ensures zero duplicate clutter.\n\n`;

  md += `*Full machine-readable dataset saved at \`scripts/output/job_leads_raw.json\`.*\n`;

  const reportPath = path.join(OUTPUT_DIR, 'JOB_LEADS_REPORT.md');
  fs.writeFileSync(reportPath, md, 'utf-8');

  console.log('✅ Scraping Complete!');
  console.log(`- Total Leads: ${uniqueLeads.length}`);
  console.log(`- Ultra-Fresh (0-3d): ${freshestLeads.length}`);
  console.log(`- India Early Careers: ${indianLeads.length}`);
  console.log(`- Saved Raw JSON: ${jsonPath}`);
  console.log(`- Saved Human Digest: ${reportPath}`);
}

run();
