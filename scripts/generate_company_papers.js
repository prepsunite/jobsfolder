/**
 * PrepUnite Company-Wise LeetCode Papers Generator
 * Fetches company question CSVs from snehasishroy/leetcode-companywise-interview-questions
 * and produces a high-quality Supabase SQL migration file for public.companies and public.exams.
 */

const fs = require('fs');
const path = require('path');

const companies = [
  {
    slugs: ['accenture'],
    repoFolder: 'accenture',
    name: 'Accenture',
    industry: 'Consulting & Tech',
    badge: 'Accenture Placement Papers 2026',
    description: 'Accenture campus recruitment drives, cognitive assessment, coding rounds, and technical interview questions.',
    logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Dublin / Pan-India',
    website: 'https://www.accenture.com'
  },
  {
    slugs: ['amamzon', 'amazon'],
    repoFolder: 'amazon',
    name: 'Amazon',
    industry: 'Product & Cloud',
    badge: 'Amazon SDE Placement Papers 2026',
    description: 'Amazon Online Assessment (OA1, OA2), coding questions, leadership principles, and SDE interview rounds.',
    logoUrl: 'https://images.unsplash.com/photo-1523474253246-64e03d526c61?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Seattle, USA / Pan-India',
    website: 'https://www.amazon.jobs'
  },
  {
    slugs: ['capgemini'],
    repoFolder: 'capgemini',
    name: 'Capgemini',
    industry: 'IT Services & Consulting',
    badge: 'Capgemini Exceller Drive 2026',
    description: 'Capgemini Exceller recruitment pattern, pseudo-code analysis, coding challenges, and HR rounds.',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Paris, France / Pan-India',
    website: 'https://www.capgemini.com'
  },
  {
    slugs: ['cognizant'],
    repoFolder: 'cognizant',
    name: 'Cognizant',
    industry: 'IT Services & Consulting',
    badge: 'Cognizant GenC / GenC Elevate 2026',
    description: 'Cognizant GenC, GenC Next, and GenC Elevate placement papers, automata coding tests, and technical interviews.',
    logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Teaneck, NJ / Pan-India',
    website: 'https://www.cognizant.com'
  },
  {
    slugs: ['delloite', 'deloitte'],
    repoFolder: 'deloitte',
    name: 'Deloitte',
    industry: 'IT Services & Consulting',
    badge: 'Deloitte NLA & Tech Drive 2026',
    description: 'Deloitte USI and India recruitment drives, national level assessment papers, and technical interview questions.',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=60',
    headquarters: 'London, UK / Pan-India',
    website: 'https://www.deloitte.com'
  },
  {
    slugs: ['ey'],
    repoFolder: 'ey',
    name: 'EY (Ernst & Young)',
    industry: 'IT Services & Consulting',
    badge: 'EY GDS Campus Drive 2026',
    description: 'EY Global Delivery Services (GDS) campus placement papers, technical coding rounds, and interview questions.',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=60',
    headquarters: 'London, UK / Pan-India',
    website: 'https://www.ey.com'
  },
  {
    slugs: ['hcltech', 'hcl'],
    repoFolder: 'hcl',
    name: 'HCLTech',
    industry: 'IT Services & Consulting',
    badge: 'HCLTech Campus Recruitment 2026',
    description: 'HCLTech First Careers and campus recruitment test papers, data structures, and programming questions.',
    logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Noida, India',
    website: 'https://www.hcltech.com'
  },
  {
    slugs: ['hexaware'],
    repoFolder: 'hexaware',
    name: 'Hexaware',
    industry: 'IT Services & Consulting',
    badge: 'Hexaware PGET / Premier Drive 2026',
    description: 'Hexaware Premier Graduate Engineer Trainee (PGET) coding tests, domain assessments, and interview questions.',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Navi Mumbai, India',
    website: 'https://www.hexaware.com'
  },
  {
    slugs: ['ibm'],
    repoFolder: 'ibm',
    name: 'IBM',
    industry: 'IT Services & Consulting',
    badge: 'IBM Associate Software Engineer 2026',
    description: 'IBM Cognitive ability test, HackerRank coding challenges, and system software technical rounds.',
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Armonk, NY / Pan-India',
    website: 'https://www.ibm.com'
  },
  {
    slugs: ['infosys'],
    repoFolder: 'infosys',
    name: 'Infosys',
    industry: 'IT Services & Consulting',
    badge: 'Infosys SP & DSE Placement Papers 2026',
    description: 'Infosys Specialist Programmer (SP), Digital Specialist Engineer (DSE), and Systems Engineer placement papers.',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Bengaluru, India',
    website: 'https://www.infosys.com'
  },
  {
    slugs: ['ltimindtree'],
    repoFolder: 'lti',
    name: 'LTIMindtree',
    industry: 'IT Services & Consulting',
    badge: 'LTIMindtree Ignite & Edge 2026',
    description: 'LTIMindtree campus recruitment tests, advanced coding problems, and technical interview questions.',
    logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Mumbai, India',
    website: 'https://www.ltimindtree.com'
  },
  {
    slugs: ['oracle'],
    repoFolder: 'oracle',
    name: 'Oracle',
    industry: 'IT Services & Consulting',
    badge: 'Oracle Server Technology Drive 2026',
    description: 'Oracle Server Technology and Cloud Infrastructure campus placement questions, algorithms, and SQL challenges.',
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Austin, TX / Pan-India',
    website: 'https://www.oracle.com'
  },
  {
    slugs: ['tcs'],
    repoFolder: 'tcs',
    name: 'TCS',
    industry: 'IT Services & Consulting',
    badge: 'TCS NQT & Digital Papers 2026',
    description: 'TCS National Qualifier Test (NQT), Ninja, Digital, and Prime placement papers with solved past coding questions.',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Mumbai, India',
    website: 'https://www.tcs.com'
  },
  {
    slugs: ['tech-mahindra'],
    repoFolder: 'tech-mahindra',
    name: 'Tech Mahindra',
    industry: 'IT Services & Consulting',
    badge: 'Tech Mahindra SuperCoder 2026',
    description: 'Tech Mahindra SuperCoder and Associate Software Engineer test papers, technical MCQs, and interview questions.',
    logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Pune, India',
    website: 'https://www.techmahindra.com'
  },
  {
    slugs: ['wipro'],
    repoFolder: 'wipro',
    name: 'Wipro',
    industry: 'IT Services & Consulting',
    badge: 'Wipro Elite NTH & Turbo 2026',
    description: 'Wipro Elite National Talent Hunt (NTH) and Turbo assessment papers, essay writing, coding, and interview rounds.',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=60',
    headquarters: 'Bengaluru, India',
    website: 'https://www.wipro.com'
  }
];

const CSV_DEFINITIONS = [
  { file: 'thirty-days.csv', id: '30d', title: '🔥 Most Repeated (Last 30 Days)', emoji: '🔥', isFree: true },
  { file: 'three-months.csv', id: '3m', title: '⚡ Recent Drives (Last 3 Months)', emoji: '⚡', isFree: false },
  { file: 'six-months.csv', id: '6m', title: '📅 Repeated in Last 6 Months', emoji: '📅', isFree: false },
  { file: 'more-than-six-months.csv', id: 'older', title: '⏳ Previous Placement Cycles', emoji: '⏳', isFree: false },
  { file: 'all.csv', id: 'all', title: '📚 Complete Problem Bank', emoji: '📚', isFree: false }
];

function parseCsv(content) {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Regex to split comma but handle quotes if any
    const cols = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    if (cols.length >= 6) {
      rows.push({
        id: cols[0],
        url: cols[1],
        title: cols[2],
        difficulty: cols[3],
        acceptance: cols[4],
        frequency: cols[5]
      });
    }
  }
  return rows;
}

function getDiffBadge(diff) {
  const d = (diff || '').toLowerCase();
  if (d === 'easy') return { label: 'EASY', emoji: '🟢', color: '#10B981' };
  if (d === 'medium') return { label: 'MEDIUM', emoji: '🟡', color: '#F59E0B' };
  if (d === 'hard') return { label: 'HARD', emoji: '🔴', color: '#EF4444' };
  return { label: 'MEDIUM', emoji: '🟡', color: '#F59E0B' };
}

function generateQuestionMarkdown(q, companyName, periodTitle) {
  const badge = getDiffBadge(q.difficulty);
  return `### ${q.title}

| Attribute | Details |
| :--- | :--- |
| **Target Company** | **${companyName}** |
| **Interview Frequency** | \`${q.frequency}\` |
| **Difficulty Level** | \`${badge.label}\` ${badge.emoji} |
| **LeetCode Acceptance** | \`${q.acceptance}\` |
| **Problem Reference** | LeetCode #${q.id} |

---

### 🎯 Direct Practice Link
Click below to practice this problem with the official online judge, test runner, and language compiler:

👉 **[Solve '${q.title}' on LeetCode](${q.url})**

---

### 💡 Placement & Interview Tips for ${companyName}
> [!TIP]
> **Recommended Time Limit**: Aim to implement and dry-run this problem within **20–25 minutes** during your ${companyName} technical interview.

* **Pattern & Approach**: Check constraints carefully on LeetCode #${q.id}. Think about optimal data structures before writing code.
* **Code Clarity**: Write clean variable names and modular helper functions.
* **Edge Cases**: Always test with empty inputs, single element arrays, boundary values, and negative numbers.
`;
}

function generateSectionMarkdown(sectionTitle, questions, companyName) {
  let md = `### ${sectionTitle} — ${companyName} Interview Papers

Below is the verified list of coding questions asked during **${companyName}** campus placement and technical interview drives. Select any question from the sidebar menu to view details and practice.

| # | Problem Title | Difficulty | Frequency | Practice Link |
| :--- | :--- | :---: | :---: | :---: |
`;

  questions.slice(0, 30).forEach((q, idx) => {
    const badge = getDiffBadge(q.difficulty);
    md += `| ${idx + 1} | **${q.title}** | \`${badge.label}\` ${badge.emoji} | \`${q.frequency}\` | [Solve on LeetCode ↗](${q.url}) |\n`;
  });

  if (questions.length > 30) {
    md += `\n*...and ${questions.length - 30} more questions available in this set.*`;
  }

  return md;
}

async function run() {
  console.log('🚀 Starting PrepUnite Company Old Papers Generator...\n');

  const sqlStatements = [];
  sqlStatements.push(`-- ====================================================================`);
  sqlStatements.push(`-- PrepUnite: Company-Wise Real Interview Papers & LeetCode Question Bank`);
  sqlStatements.push(`-- Generated: ${new Date().toISOString()}`);
  sqlStatements.push(`-- Sourced from: snehasishroy/leetcode-companywise-interview-questions`);
  sqlStatements.push(`-- ====================================================================\n`);

  for (const comp of companies) {
    console.log(`📦 Processing ${comp.name} (${comp.repoFolder})...`);

    const tabs = [];
    let isFirstCategory = true;

    for (const def of CSV_DEFINITIONS) {
      const url = `https://raw.githubusercontent.com/snehasishroy/leetcode-companywise-interview-questions/master/${comp.repoFolder}/${def.file}`;
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const text = await res.text();
        const rows = parseCsv(text);
        if (rows.length === 0) continue;

        const isFreeSection = isFirstCategory || def.isFree;
        isFirstCategory = false;

        const sectionNode = {
          id: `${comp.slugs[0]}-${def.id}-overview`,
          title: def.title,
          emoji: def.emoji,
          isFree: isFreeSection,
          content: generateSectionMarkdown(def.title, rows, comp.name),
          children: rows.slice(0, 40).map((q, qIdx) => {
            const badge = getDiffBadge(q.difficulty);
            return {
              id: `${comp.slugs[0]}-${def.id}-q-${q.id}`,
              title: `${q.title} (${badge.label})`,
              emoji: badge.emoji,
              isFree: isFreeSection || qIdx < 3,
              content: generateQuestionMarkdown(q, comp.name, def.title)
            };
          })
        };

        tabs.push(sectionNode);
      } catch (err) {
        console.warn(`Could not fetch ${url}:`, err.message);
      }
    }

    if (tabs.length === 0) {
      console.warn(`⚠️ No CSVs found for ${comp.name}`);
      continue;
    }

    const tabsJson = JSON.stringify(tabs).replace(/'/g, "''");
    const oldPapersSummary = `### ${comp.name} Past Placement Papers & Coding Archive\\n\\nAccess ${tabs.reduce((acc, t) => acc + (t.children?.length || 0), 0)}+ verified interview questions asked during ${comp.name} campus recruitment drives. Use the navigation tree on the left to explore category-wise problem sets.`.replace(/'/g, "''");

    for (const slug of comp.slugs) {
      // 1. Insert or update Company
      sqlStatements.push(`
-- ----------------------------------------------------
-- Company & Exam Seed: ${comp.name} (${slug})
-- ----------------------------------------------------
INSERT INTO public.companies (
  name, slug, description, industry, headquarters, website, logo_url, is_active
) VALUES (
  '${comp.name.replace(/'/g, "''")}',
  '${slug}',
  '${comp.description.replace(/'/g, "''")}',
  '${comp.industry}',
  '${comp.headquarters}',
  '${comp.website}',
  '${comp.logoUrl}',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  industry = EXCLUDED.industry,
  headquarters = EXCLUDED.headquarters,
  website = EXCLUDED.website,
  is_active = true,
  updated_at = NOW();

-- Upsert Exam with Paper Tabs for ${slug}
INSERT INTO public.exams (
  company_slug,
  name,
  badge,
  content,
  old_papers,
  price,
  paper_tabs,
  upvotes,
  is_deleted
) VALUES (
  '${slug}',
  '${comp.name.replace(/'/g, "''")} Placement Papers & Question Bank 2026',
  '${comp.badge.replace(/'/g, "''")}',
  '### About ${comp.name.replace(/'/g, "''")} Recruitment Process\\n\\nComprehensive past papers, syllabus breakdown, coding patterns, and interview round guides for ${comp.name.replace(/'/g, "''")}.',
  '${oldPapersSummary}',
  99.00,
  '${tabsJson}'::jsonb,
  85,
  false
)
ON CONFLICT (company_slug, name) DO UPDATE SET
  paper_tabs = EXCLUDED.paper_tabs,
  old_papers = EXCLUDED.old_papers,
  badge = EXCLUDED.badge,
  price = 99.00,
  is_deleted = false,
  updated_at = NOW();
`);
    }

    console.log(`✅ Generated ${tabs.length} categories with total ${tabs.reduce((acc, t) => acc + (t.children?.length || 0), 0)} questions for ${comp.name}`);
  }

  const outPath = path.join(__dirname, '..', 'database', 'seed_company_old_papers.sql');
  fs.writeFileSync(outPath, sqlStatements.join('\n'), 'utf-8');
  console.log(`\n🎉 Success! SQL file written to: ${outPath}`);
}

run();
