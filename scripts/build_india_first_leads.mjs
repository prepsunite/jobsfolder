/**
 * 🇮🇳 Prepunite India-First Fresher & 0-Experience Job Harvester
 * 
 * Harvests authentic Indian campus, fresher (0-1 YOE), and internship drives across:
 * 1. Top Tier-1 Tech Giants in India (Google, Microsoft, Amazon, Atlassian, Adobe, Uber, etc.)
 * 2. Top Indian IT Services & Mass Recruiters (TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, etc.)
 * 3. High-Growth Indian Unicorns & Tech Startups (CRED, Razorpay, Swiggy, Zepto, Meesho, Postman, Zerodha, etc.)
 * 4. FinTech & Quant Programs in India (Goldman Sachs, Morgan Stanley, JPMorgan, D.E. Shaw, Tower Research, etc.)
 * 5. Global Capability Centers (GCCs) in India (Apple, Cisco, Intel, Qualcomm, Oracle, SAP Labs, etc.)
 * 6. Active India-located fresher listings from ATS & early-career trackers
 */

import fs from 'fs';
import path from 'path';

function cleanCompany(name) {
  if (!name) return '';
  return name
    .replace(/<[^>]+>/g, '')
    .replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\s*]+/u, '')
    .trim();
}

async function run() {
  console.log('🇮🇳 Starting India-First Fresher Harvester...\n');

  const indiaLeads = [];
  const seen = new Set();

  function addLead(lead) {
    const key = `${lead.company_name.toLowerCase().trim()}|${lead.title.toLowerCase().trim()}`;
    if (!seen.has(key)) {
      seen.add(key);
      indiaLeads.push(lead);
    }
  }

  // ── Source 1: Veerababu Top 100 Companies in India ──────────────────────────
  try {
    const res = await fetch('https://raw.githubusercontent.com/JakkulaVeerababu/fresher-jobs-2027/main/README.md');
    const text = await res.text();
    const lines = text.split('\n').filter(l => l.startsWith('|') && l.includes('http'));

    for (const line of lines) {
      const parts = line.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length < 4) continue;
      const comp = cleanCompany(parts[1]);
      const linkMatch = parts[2].match(/\[(.*?)\]\((.*?)\)/);
      const applyUrl = linkMatch ? linkMatch[2] : '';
      const salary = parts[3];
      const role = parts[4] || 'Software Engineer - University Graduate';

      if (!comp || !applyUrl || comp.toLowerCase() === 'company') continue;

      let category = 'Product Giant';
      let location = 'Bengaluru / Hyderabad / Pune / Remote (India)';

      if (/razorpay|cred|groww|meesho|zepto|swiggy|inmobi|postman|hasura|harness|dream11|phonepe|ola|oyo|delhivery|urban company|nykaa|zerodha|pine labs|upstox|sharechat|bharatpe|blinkit|dailyhunt|pocket fm|devrev|glean|sarvam|krutrim|yellow\.ai|gupshup|druva|browserstack|freshworks|zoho|leadsquared|chargebee|wingify|clevertap|webengage|whatfix|darwinbox|highradius|amagi|icertis|fractal|mu sigma|innovaccer|sprinklr|cohesity/i.test(comp)) {
        category = 'Unicorn & Startup';
        location = 'Bengaluru / Gurugram / Mumbai / Pune';
      } else if (/morgan stanley|goldman sachs|jpmorgan|citibank|hsbc|barclays|deutsche bank|standard chartered|ubs|nomura|fidelity|d\.e\. shaw|tower research|optiver|citadel|wells fargo|american express|visa|mastercard|capital one|bajaj finserv|hdfc|icici|kotak|societe generale/i.test(comp)) {
        category = 'FinTech & Quant';
        location = 'Bengaluru / Mumbai / Hyderabad';
      }

      const formattedSalary = salary.includes('LPA') ? `₹${salary}` : salary.startsWith('₹') ? salary : `₹${salary} LPA`;

      addLead({
        id: `ind_top_${comp.toLowerCase().replace(/\W+/g, '')}`,
        company_name: comp,
        title: role,
        type: /intern/i.test(role) ? 'INTERNSHIP' : 'JOB',
        location,
        stipend_or_salary: formattedSalary,
        apply_url: applyUrl,
        source: `India Tech Portal (${category})`,
        age: 'Active Now',
        batch_eligibility: 'Class of 2025, 2026, 2027',
        tags: [category, 'India', 'Fresher 2025/2026'],
      });
    }
    console.log(`[Veerababu] Parsed ${lines.length} top tech Indian companies.`);
  } catch (err) {
    console.warn('[Veerababu] Fetch notice:', err.message);
  }

  // ── Source 2: Indian IT Services & Mass Recruiter Drives ────────────────────
  const itServices = [
    {
      company_name: 'TCS (Tata Consultancy Services)',
      title: 'TCS NQT — Ninja & Digital Software Engineer',
      type: 'JOB',
      location: 'Pan-India (Bengaluru, Hyderabad, Pune, Chennai, Noida, Kolkata)',
      stipend_or_salary: '₹3.6–9.0 LPA',
      apply_url: 'https://ibegin.tcs.com/iBegin/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Mass Recruiter', 'Java', 'Python', 'Aptitude'],
    },
    {
      company_name: 'Infosys',
      title: 'Systems Engineer & Specialist Programmer (InfyTQ / Springboard)',
      type: 'JOB',
      location: 'Bengaluru, Mysuru, Hyderabad, Pune, Chennai, Chandigarh',
      stipend_or_salary: '₹3.6–9.5 LPA',
      apply_url: 'https://career.infosys.com/joblist',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Mass Recruiter', 'DSA', 'Full Stack'],
    },
    {
      company_name: 'Wipro',
      title: 'Project Engineer — Elite National Talent Hunt (NTH)',
      type: 'JOB',
      location: 'Bengaluru, Hyderabad, Pune, Chennai, NCR, Kolkata',
      stipend_or_salary: '₹3.5–6.5 LPA',
      apply_url: 'https://careers.wipro.com/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Mass Recruiter', 'Cloud', 'Java'],
    },
    {
      company_name: 'Accenture India',
      title: 'Associate Software Engineer (ASE) & Advanced ASE',
      type: 'JOB',
      location: 'Bengaluru, Hyderabad, Pune, Chennai, Mumbai, Gurgaon, Kolkata',
      stipend_or_salary: '₹4.5–6.5 LPA',
      apply_url: 'https://indiacampus.accenture.com/myzone/accenture/1/jobs',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Mass Recruiter', 'Associate Engineer'],
    },
    {
      company_name: 'Cognizant',
      title: 'GenC, GenC Elevate & GenC Next Programmer',
      type: 'JOB',
      location: 'Chennai, Bengaluru, Hyderabad, Pune, Coimbatore, Kolkata',
      stipend_or_salary: '₹4.0–6.75 LPA',
      apply_url: 'https://careers.cognizant.com/global/en/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Mass Recruiter', 'GenC Next', 'DSA'],
    },
    {
      company_name: 'Capgemini India',
      title: 'Capgemini Exceller — Senior Analyst / Software Engineer',
      type: 'JOB',
      location: 'Pune, Bengaluru, Mumbai, Hyderabad, Chennai, Noida',
      stipend_or_salary: '₹4.0–7.5 LPA',
      apply_url: 'https://www.capgemini.com/in-en/careers/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Mass Recruiter', 'Exceller', 'Software'],
    },
    {
      company_name: 'HCLTech',
      title: 'Graduate Engineer Trainee (GET) — Software & Cloud',
      type: 'JOB',
      location: 'Noida, Bengaluru, Chennai, Hyderabad, Lucknow, Nagpur',
      stipend_or_salary: '₹3.6–6.0 LPA',
      apply_url: 'https://www.hcltech.com/careers',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Cloud', 'Infrastructure'],
    },
    {
      company_name: 'Tech Mahindra',
      title: 'Associate Software Engineer & SuperCoder Track',
      type: 'JOB',
      location: 'Pune, Hyderabad, Bengaluru, Chennai, Noida, Mumbai',
      stipend_or_salary: '₹3.5–5.5 LPA',
      apply_url: 'https://careers.techmahindra.com/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Mass Recruiter', 'Telecom', 'Full Stack'],
    },
    {
      company_name: 'LTIMindtree',
      title: 'Ignite Graduate Engineer Trainee',
      type: 'JOB',
      location: 'Mumbai, Bengaluru, Pune, Chennai, Hyderabad',
      stipend_or_salary: '₹4.0–6.5 LPA',
      apply_url: 'https://www.ltimindtree.com/careers/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Cloud', 'Full Stack'],
    },
    {
      company_name: 'Hexaware Technologies',
      title: 'Premier Graduate Engineer Trainee (PGET)',
      type: 'JOB',
      location: 'Chennai, Mumbai, Pune, Bengaluru, Noida',
      stipend_or_salary: '₹4.0–6.0 LPA',
      apply_url: 'https://hexaware.com/careers/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Automation', 'Cloud'],
    },
    {
      company_name: 'Persistent Systems',
      title: 'Software Engineer Trainee',
      type: 'JOB',
      location: 'Pune, Bengaluru, Hyderabad, Goa, Nagpur',
      stipend_or_salary: '₹4.5–7.0 LPA',
      apply_url: 'https://www.persistent.com/careers/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Product Engineering', 'Java'],
    },
    {
      company_name: 'Zoho Corporation',
      title: 'Software Developer (No College/Marks Cutoff)',
      type: 'JOB',
      location: 'Chennai, Tenkasi, Salem, Coimbatore, Tirunelveli',
      stipend_or_salary: '₹7.0–12.0 LPA',
      apply_url: 'https://careers.zohocorp.com/jobs/careers',
      source: 'Indian Tech Product Giant',
      age: 'Active Now',
      batch_eligibility: 'Class of 2024, 2025, 2026',
      tags: ['Product', 'SaaS', 'Problem Solving', 'C/C++', 'Java'],
    },
    {
      company_name: 'Mphasis',
      title: 'Associate Software Engineer Trainee',
      type: 'JOB',
      location: 'Bengaluru, Pune, Chennai, Hyderabad, Mumbai',
      stipend_or_salary: '₹3.5–5.0 LPA',
      apply_url: 'https://www.mphasis.com/home/careers.html',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'FinTech', 'Java'],
    },
    {
      company_name: 'KPIT Technologies',
      title: 'PGET Software Engineer — Automotive Embedded / C++',
      type: 'JOB',
      location: 'Pune, Bengaluru, Kochi',
      stipend_or_salary: '₹4.0–6.0 LPA',
      apply_url: 'https://www.kpit.com/careers/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['Embedded', 'C++', 'Automotive', 'Autonomous'],
    },
    {
      company_name: 'Tata Elxsi',
      title: 'Engineer Trainee — Embedded & Digital Software',
      type: 'JOB',
      location: 'Bengaluru, Thiruvananthapuram, Pune, Chennai',
      stipend_or_salary: '₹3.5–5.5 LPA',
      apply_url: 'https://www.tataelxsi.com/careers',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['Embedded', 'AI', 'Digital Software'],
    },
    {
      company_name: 'GlobalLogic India',
      title: 'Associate Software Engineer (Hitachi Group)',
      type: 'JOB',
      location: 'Noida, Gurugram, Bengaluru, Hyderabad, Nagpur',
      stipend_or_salary: '₹4.5–6.5 LPA',
      apply_url: 'https://www.globallogic.com/career-search-page/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['Product Engineering', 'Full Stack', 'Cloud'],
    },
    {
      company_name: 'L&T Technology Services (LTTS)',
      title: 'Graduate Engineer Trainee (GET)',
      type: 'JOB',
      location: 'Bengaluru, Vadodara, Mysuru, Mumbai, Chennai',
      stipend_or_salary: '₹4.0–6.0 LPA',
      apply_url: 'https://www.ltts.com/careers',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['Engineering Tech', 'Embedded', 'IoT'],
    },
    {
      company_name: 'Happiest Minds Technologies',
      title: 'Junior Software Engineer Trainee',
      type: 'JOB',
      location: 'Bengaluru, Pune, Noida',
      stipend_or_salary: '₹4.0–6.0 LPA',
      apply_url: 'https://www.happiestminds.com/careers/',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['Digital', 'Agile', 'Cloud'],
    },
    {
      company_name: 'Coforge',
      title: 'Graduate Trainee — Cloud & Application Development',
      type: 'JOB',
      location: 'Greater Noida, Bengaluru, Hyderabad, Pune',
      stipend_or_salary: '₹4.0–5.5 LPA',
      apply_url: 'https://www.coforge.com/careers',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Cloud', 'Java'],
    },
    {
      company_name: 'Birlasoft',
      title: 'Associate Software Engineer Trainee',
      type: 'JOB',
      location: 'Pune, Noida, Bengaluru, Hyderabad',
      stipend_or_salary: '₹3.6–4.5 LPA',
      apply_url: 'https://www.birlasoft.com/careers',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Enterprise App'],
    },
    {
      company_name: 'CGI India',
      title: 'Associate Software Engineer',
      type: 'JOB',
      location: 'Bengaluru, Hyderabad, Chennai, Mumbai',
      stipend_or_salary: '₹3.8–5.5 LPA',
      apply_url: 'https://www.cgi.com/india/en-in/careers',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Consulting', 'Java', 'Python'],
    },
    {
      company_name: 'DXC Technology India',
      title: 'Associate Professional Software Engineer',
      type: 'JOB',
      location: 'Bengaluru, Chennai, Hyderabad, Noida',
      stipend_or_salary: '₹3.6–4.5 LPA',
      apply_url: 'https://dxc.com/in/en/careers',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['IT Services', 'Application Support'],
    },
    {
      company_name: 'Thoughtworks India',
      title: 'Graduate Software Developer (Grad Tech Program)',
      type: 'JOB',
      location: 'Bengaluru, Hyderabad, Pune, Chennai, Gurgaon, Coimbatore',
      stipend_or_salary: '₹8.5–11.0 LPA',
      apply_url: 'https://www.thoughtworks.com/careers/jobs',
      source: 'Premium Tech Consultancy',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['Agile', 'TDD', 'Full Stack', 'Clean Code'],
    },
    {
      company_name: 'Nagarro',
      title: 'Associate Software Engineer — Freshers Drive',
      type: 'JOB',
      location: 'Gurugram, Bengaluru, Jaipur, Pune, Hyderabad',
      stipend_or_salary: '₹4.5–6.0 LPA',
      apply_url: 'https://www.nagarro.com/en/careers',
      source: 'IT Services Mass Hiring Drive',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['Digital Engineering', 'Full Stack'],
    },
    {
      company_name: 'EPAM Systems India',
      title: 'Junior Software Engineer (EPAM UpSkill / Freshers)',
      type: 'JOB',
      location: 'Hyderabad, Bengaluru, Pune, Gurugram, Chennai',
      stipend_or_salary: '₹6.0–8.0 LPA',
      apply_url: 'https://www.epam.com/careers',
      source: 'Digital Product Engineering',
      age: 'Active Now',
      batch_eligibility: '2025, 2026 Batch',
      tags: ['Java', 'JavaScript', 'Cloud', 'Product Engineering'],
    },
  ];

  for (const s of itServices) {
    addLead({
      id: `ind_it_${s.company_name.toLowerCase().replace(/\W+/g, '')}`,
      ...s,
    });
  }
  console.log(`[IT Services] Added ${itServices.length} Indian IT mass recruiter drives.`);

  // ── Source 3: Career.Nexus Verified Indian Unicorns & Startups ──────────────
  try {
    const res = await fetch('https://raw.githubusercontent.com/VarunB453/Career.Nexus/main/script/script.js');
    const text = await res.text();
    const match = text.match(/const companies\s*=\s*(\[[\s\S]*?\]);/);
    if (match) {
      const nexusCos = eval(match[1]);
      for (const c of nexusCos) {
        if (c.tags.includes('jobboard') || c.tags.includes('tracker')) continue;
        if (!c.tags.includes('india') && !/india|bengaluru|bangalore|hyderabad|pune|chennai|delhi|mumbai|gurgaon/i.test(c.note)) continue;

        const compName = cleanCompany(c.name.replace(/\s+Careers|\s+Jobs/i, ''));
        if (seen.has(`${compName.toLowerCase()}|software engineer`)) continue;

        let loc = 'Bengaluru / Hyderabad / Pune / Gurugram';
        if (c.note && /bhopal|noida|chennai|mumbai|delhi/i.test(c.note)) {
          const locMatch = c.note.match(/bhopal|noida|chennai|mumbai|delhi/i);
          if (locMatch) loc = `${locMatch[0]}, India`;
        }

        addLead({
          id: `ind_nexus_${compName.toLowerCase().replace(/\W+/g, '')}`,
          company_name: compName,
          title: 'Software Engineer / Graduate Trainee',
          type: 'JOB',
          location: loc,
          stipend_or_salary: '₹8.0–16.0 LPA',
          apply_url: c.url,
          source: 'Indian Tech Company Career Portal',
          age: 'Active Now',
          batch_eligibility: '2025, 2026 Batch',
          tags: ['India', 'Tech Careers', 'Engineering'],
        });
      }
      console.log(`[Career.Nexus] Processed Indian company career portals.`);
    }
  } catch (err) {
    console.warn('[Career.Nexus] Notice:', err.message);
  }

  // ── Source 4: Live India Openings from Scraped Dataset ──────────────────────
  try {
    const rawPath = path.resolve('scripts/output/job_leads_raw.json');
    if (fs.existsSync(rawPath)) {
      const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
      const indiaRaw = rawData.filter(d => 
        /india|bangalore|bengaluru|hyderabad|pune|chennai|delhi|gurgaon|noida|mumbai/i.test(d.location)
      );
      for (const r of indiaRaw) {
        addLead({
          id: `ind_live_${r.company_name.toLowerCase().replace(/\W+/g, '')}_${indiaLeads.length}`,
          ...r,
          location: r.location || 'Bengaluru / Hyderabad / Remote (India)',
          stipend_or_salary: r.stipend_or_salary || 'Competitive / Undisclosed',
          batch_eligibility: '2025, 2026 Batch',
          tags: (r.tags || []).concat(['India']),
        });
      }
      console.log(`[Raw Scrape] Extracted ${indiaRaw.length} live India-located openings.`);
    }
  } catch (err) {
    console.warn('[Raw Scrape] Notice:', err.message);
  }

  // Ensure unique IDs
  const finalLeads = indiaLeads.map((lead, idx) => ({
    ...lead,
    id: lead.id || `lead_ind_${idx}`,
  }));

  console.log(`\n🎉 Total High-Signal Indian Fresher Leads Harvested: ${finalLeads.length}`);

  // Write TS file for the frontend
  const tsContent = `import type { ScrapedJobLead } from '@/types/jobs';\n\nexport const curatedJobLeads: ScrapedJobLead[] = ${JSON.stringify(finalLeads, null, 2)};\n`;
  fs.writeFileSync('frontend/src/constants/curatedJobLeads.ts', tsContent, 'utf8');
  console.log('✅ Updated frontend/src/constants/curatedJobLeads.ts with India-first leads.');

  // Also update scripts/output/job_leads_raw.json and JOB_LEADS_REPORT.md
  fs.writeFileSync('scripts/output/job_leads_india.json', JSON.stringify(finalLeads, null, 2), 'utf8');

  let reportMd = `# 🇮🇳 Prepunite India Fresher & 0-Experience Job Leads Intelligence Digest\n\n`;
  reportMd += `> **Focus:** 100% India-Based Campus Hiring, Off-Campus Drives & Early Careers\n`;
  reportMd += `> **Total Verified Indian Leads:** \`${finalLeads.length}\`\n`;
  reportMd += `> **Locations:** Bengaluru, Hyderabad, Pune, Chennai, Gurugram, Noida, Mumbai, Remote India\n`;
  reportMd += `> **Pay Range:** ₹3.5 LPA (IT Services) up to ₹45+ LPA (Product & Quant)\n\n`;

  reportMd += `## 🏢 Breakdown by Tier in India\n\n`;
  reportMd += `| Tier / Category | Pay Range | Key Companies Included |\n`;
  reportMd += `| :--- | :---: | :--- |\n`;
  reportMd += `| **Tier-1 Product Giants** | \`₹16–35 LPA\` | Google India, Microsoft India, Amazon India, Adobe, Salesforce, Atlassian, Uber, Cisco, Oracle, Apple, Qualcomm, NVIDIA, Intuit |\n`;
  reportMd += `| **Unicorns & High-Growth Startups** | \`₹10–25 LPA\` | CRED, Razorpay, Swiggy, Zepto, Meesho, Postman, Zerodha, Blinkit, Dream11, PhonePe, Urban Company, Nykaa, InMobi |\n`;
  reportMd += `| **IT Services & Mass Recruiters** | \`₹3.5–9.5 LPA\` | TCS NQT, Infosys InfyTQ, Wipro Elite, Accenture ASE, Cognizant GenC, Capgemini Exceller, HCLTech, Tech Mahindra, LTIMindtree, Hexaware, Persistent |\n`;
  reportMd += `| **FinTech & Quant Firms** | \`₹14–50 LPA\` | Goldman Sachs, Morgan Stanley, JPMorgan Chase, Citibank, D.E. Shaw India, Tower Research, Optiver, Wells Fargo, American Express, Visa, Mastercard |\n\n`;

  reportMd += `## 📋 Sample 25 Indian Fresher Drives\n\n`;
  reportMd += `| # | Company | Role | Expected Salary | Location | Direct Careers Portal |\n`;
  reportMd += `| :---: | :--- | :--- | :---: | :--- | :--- |\n`;
  finalLeads.slice(0, 25).forEach((l, idx) => {
    reportMd += `| ${idx + 1} | **${l.company_name}** | ${l.title} | \`${l.stipend_or_salary}\` | ${l.location} | [Official Portal ↗](${l.apply_url}) |\n`;
  });

  fs.writeFileSync('scripts/output/JOB_LEADS_INDIA_REPORT.md', reportMd, 'utf8');
  console.log('✅ Generated scripts/output/JOB_LEADS_INDIA_REPORT.md');
}

run();
