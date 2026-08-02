-- ====================================================================
-- PrepUnite / Jobsfolder - Production Complete Seed Data Script
-- Populates all default companies, exams, and document tabs into Supabase
-- ====================================================================

-- 1. Insert Core Companies
INSERT INTO public.companies (id, name, slug, industry, company_size, headquarters, description, website_url, logo_url, about_company)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'TCS',
    'tcs',
    'IT Services & Consulting',
    '500,000+ employees',
    'Mumbai, India',
    'Tata Consultancy Services conducts TCS NQT, TCS iON NQT, and TCS BPS recruitment drives.',
    'https://www.tcs.com',
    'https://logo.clearbit.com/tcs.com',
    '### About Tata Consultancy Services (TCS)\n\nTCS is a global leader in IT services, consulting, and business solutions. As one of the largest employers in the IT sector, TCS conducts massive recruitment drives annually to hire fresh graduates across various roles including Ninja, Digital, and Prime.'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'Accenture',
    'accenture',
    'Consulting & Tech',
    '700,000+ employees',
    'Dublin, Ireland',
    'Accenture conducts ASE and AAEA recruitment drives across 90+ engineering colleges.',
    'https://www.accenture.com',
    'https://logo.clearbit.com/accenture.com',
    '### About Accenture\n\nAccenture is a leading global professional services company, providing a broad range of services in strategy and consulting, interactive, technology and operations.'
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'Infosys',
    'infosys',
    'Digital Services',
    '300,000+ employees',
    'Bangalore, India',
    'Infosys offers DSE, Specialist Programmer, and System Engineer roles via HackWithInfy & InfyTQ.',
    'https://www.infosys.com',
    'https://logo.clearbit.com/infosys.com',
    '### About Infosys\n\nInfosys is a global leader in next-generation digital services and consulting, enabling clients in more than 50 countries to navigate their digital transformation.'
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    'Capgemini',
    'capgemini',
    'Consulting & Technology Services',
    '350,000+ employees',
    'Paris, France',
    'Capgemini Excellence Drive features Analyst and Senior Analyst roles with game-based aptitude.',
    'https://www.capgemini.com',
    'https://logo.clearbit.com/capgemini.com',
    '### About Capgemini\n\nCapgemini is a global leader in consulting, digital transformation, technology and engineering services.'
  ),
  (
    'c0000000-0000-0000-0000-000000000005',
    'Wipro',
    'wipro',
    'IT Services & Consulting',
    '250,000+ employees',
    'Bengaluru, India',
    'Wipro Limited provides IT, consulting and business process services via Wipro Elite NTH.',
    'https://www.wipro.com',
    'https://logo.clearbit.com/wipro.com',
    '### About Wipro\n\nWipro Limited is an Indian multinational corporation providing IT, consulting, and business process services.'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  about_company = EXCLUDED.about_company,
  logo_url = EXCLUDED.logo_url;

-- 2. Insert Core Exams
INSERT INTO public.exams (id, company_id, company_slug, name, badge, content, old_papers, price, paper_tabs)
VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'tcs',
    'TCS NQT Placement Papers and Questions 2026',
    'Official Campus Drive',
    'The latest TCS NQT Test Pattern, questions, and section-wise practice problems are available to help you prepare effectively. Before starting your preparation, we recommend going through each section of the exam. TCS NQT 2026 pattern has been updated, especially the Verbal Ability section, which now includes Sentence Completion, Passage Recall, and Email Writing instead of the previous format.\n\n### Round 1 (Foundation)\n* **Total no. of question:** 65 Q''s\n* **Allotted Time:** 76 Mins\n* **Total Sections:** 3 sections (Aptitude, Logical, Verbal)\n\n### Round 2 (Advance)\n* **Total no. of question:** 14-16 MCQ and 2 Coding Questions\n* **Allotted Time:** 115 mins\n* **Total Sections:** Advanced Quants + Reasoning = 15 Q''s - 20 Mins, Advanced Coding = 2 Q''s - 90 Mins\n\n1. **Ninja Offer:** ~₹3.36L LPA. Focuses on Foundation Section.\n2. **Digital Offer:** ~₹7.00L LPA. Focuses on Advanced Section + Coding.\n3. **Prime Offer:** ~₹9.00L LPA. Top performers in Advanced Coding.',
    '### Previous Year Papers & Memory-Based Questions\n\nBelow are some commonly repeated coding and aptitude questions from previous TCS NQT drives. Use the Document Tabs on the left sidebar to navigate section-wise papers.',
    99.00,
    '[{"id":"tcs-tab-1","title":"Numerical & Quantitative Reasoning","emoji":"📊","content":"### Quantitative Aptitude - Memory Based Papers (2025 - 2026)\\n\\n#### Q1. Train & Platform Crossing\\n**Question**: A 160m long train running at a speed of 72 km/hr crosses a platform in 18 seconds. What is the length of the platform?\\n\\n**Solution & Step-by-Step Breakdown**:\\n1. Convert Speed: 72 * (5/18) = 20 m/sec\\n2. Total Distance: Speed * Time = 20 * 18 = 360 metres\\n3. Length of Platform: 360 - 160 = 200 metres\\n\\n**Final Answer**: 200 metres","children":[{"id":"tcs-tab-1-1","title":"Time, Speed & Distance","emoji":"🚄","content":"### Time, Speed & Distance Formula Cheat-sheet\\n\\n* Speed = Distance / Time\\n* km/h to m/s = Multiply by 5/18"},{"id":"tcs-tab-1-2","title":"Profit & Loss Tricks","emoji":"📈","content":"### Profit & Loss Key Concepts\\n\\n* Profit % = (Profit / CP) * 100"}]},{"id":"tcs-tab-2","title":"Advanced Technical Coding","emoji":"💻","content":"### TCS NQT Advanced Coding Questions\\n\\n#### Problem: Longest Palindromic Substring\\nWrite an efficient algorithm to find the longest palindromic substring in a given string.","children":[{"id":"tcs-tab-2-1","title":"Array Subarray Problems","emoji":"🔢","content":"### Array Subarray Sum Problems\\n\\nFind maximum subarray sum using Kadane''s Algorithm in O(N) time complexity."}]},{"id":"tcs-tab-3","title":"Verbal & Communication","emoji":"🗣️","content":"### Verbal Ability Memory Papers\\n\\n* Sentence Completion & Passage Recall\\n* Cloze Test & Vocabulary"}]'::jsonb
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000003',
    'infosys',
    'Infosys DSE & Specialist Programmer 2026',
    'Specialist Drive',
    '### Infosys SP & DSE Pattern 2026\n\n- Hands-on Coding: 3 Problems (Medium to Hard DSA)\n- Allotted Time: 180 Minutes\n- Tracks: Specialist Programmer (₹9.5 LPA) & Digital Specialist Engineer (₹6.25 LPA)',
    '### Solved Past Year Coding Challenges',
    99.00,
    '[{"id":"inf-tab-1","title":"Dynamic Programming Challenge","emoji":"🧠","content":"### Problem: Longest Common Subsequence\\n\\nGiven two strings text1 and text2, return the length of their longest common subsequence."}]'::jsonb
  )
ON CONFLICT (company_slug, name) DO UPDATE SET
  content = EXCLUDED.content,
  paper_tabs = EXCLUDED.paper_tabs;
