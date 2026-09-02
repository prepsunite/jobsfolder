export interface MarqueeCompany {
  name: string;
  papers: string;
}

export interface HomeCompany {
  slug: string;
  abbr: string;
  name: string;
  badge: string;
  papers: string;
  years: string;
  sections: string;
  accent: string;
}

export interface HomeFaq {
  q: string;
  a: string;
}

export interface HomeDeliverItem {
  num: string;
  numClass: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}

export const MARQUEE_COMPANIES: MarqueeCompany[] = [
  { name: 'TCS', papers: '14 past papers' },
  { name: 'Accenture', papers: '12 past papers' },
  { name: 'Cognizant', papers: '10 past papers' },
  { name: 'Amazon', papers: '18 past papers' },
  { name: 'Infosys', papers: '9 past papers' },
  { name: 'Wipro', papers: '8 past papers' },
  { name: 'Capgemini', papers: '7 past papers' },
  { name: 'IBM', papers: '6 past papers' },
  { name: 'HCL', papers: '5 past papers' },
  { name: 'Hexaware', papers: '6 past papers' },
  { name: 'Mphasis', papers: '4 past papers' },
  { name: 'KPMG', papers: '5 past papers' },
];

export const COMPANIES: HomeCompany[] = [
  {
    slug: 'tcs',
    abbr: 'TCS',
    name: 'Tata Consultancy Services',
    badge: 'NQT Drive Archive',
    papers: '14 Solved Past Papers',
    years: 'Full Drive Question Sets',
    sections: 'Cognitive · Advanced Coding · Verbal',
    accent: '#FD4A32',
  },
  {
    slug: 'accenture',
    abbr: 'ACN',
    name: 'Accenture',
    badge: 'ASE & FSE Archive',
    papers: '12 Solved Past Papers',
    years: 'Full Drive Question Sets',
    sections: 'Critical Thinking · Pseudocode · Coding',
    accent: '#FD4A32',
  },
  {
    slug: 'cognizant',
    abbr: 'CTS',
    name: 'Cognizant',
    badge: 'GenC & Elevate Archive',
    papers: '10 Solved Past Papers',
    years: 'Full Drive Question Sets',
    sections: 'Quantitative · Automata Coding',
    accent: '#FD4A32',
  },
  {
    slug: 'amazon',
    abbr: 'AMZN',
    name: 'Amazon',
    badge: 'SDE 1 Campus Archive',
    papers: '18 Solved Past Papers',
    years: 'Full Drive Question Sets',
    sections: 'DSA · OS/DBMS · System Design',
    accent: '#FD4A32',
  },
  {
    slug: 'infosys',
    abbr: 'INF',
    name: 'Infosys',
    badge: 'SP & DSE Archive',
    papers: '9 Solved Past Papers',
    years: 'Full Drive Question Sets',
    sections: 'Verbal · Quant · Coding',
    accent: '#FD4A32',
  },
  {
    slug: 'wipro',
    abbr: 'WIP',
    name: 'Wipro',
    badge: 'NLTH Elite Archive',
    papers: '8 Solved Past Papers',
    years: 'Full Drive Question Sets',
    sections: 'English · Analytical · Coding',
    accent: '#FD4A32',
  },
  {
    slug: 'capgemini',
    abbr: 'CAP',
    name: 'Capgemini',
    badge: 'Exceller Drive Archive',
    papers: '7 Solved Past Papers',
    years: 'Full Drive Question Sets',
    sections: 'Behavioral · Coding · Essay',
    accent: '#FD4A32',
  },
  {
    slug: 'ibm',
    abbr: 'IBM',
    name: 'IBM',
    badge: 'Freshers Drive Archive',
    papers: '6 Solved Past Papers',
    years: 'Full Drive Question Sets',
    sections: 'Cognitive · Technical Aptitude',
    accent: '#FD4A32',
  },
];

export const FAQS: HomeFaq[] = [
  {
    q: 'Are these actual OA papers from real campus drives?',
    a: "Yes. Every paper in our archive is sourced from students who sat the actual drive and submitted their questions through PrepUnite's contributor program. Papers are memory-reconstructed, cross-verified by multiple contributors, and categorized by recruitment drive and batch.",
  },
  {
    q: 'What exactly do I get when I pay ₹99?',
    a: "You get full access to all past OA papers for a single company — every available paper set, all questions, and full solutions with explanations. It is a one-time payment, no subscription.",
  },
  {
    q: 'How many past papers are available per company?',
    a: 'It varies by company. Each company archive contains comprehensive sets of real drive papers. The exact paper count and section breakdown is shown before you unlock.',
  },
  {
    q: 'How accurate are memory-reconstructed papers?',
    a: 'Each paper is cross-verified by multiple contributors who sat the same drive. Where contributors agree, confidence is very high. Some questions may have minor wording variation, but the question type, difficulty, and topics are accurate.',
  },
  {
    q: 'Are papers updated after every placement season?',
    a: 'Yes. As new drives happen, contributors submit the latest papers and we add them to the archive within days. All papers are categorized so you always know which drive and batch you are looking at.',
  },
];

export const DELIVER: HomeDeliverItem[] = [
  {
    num: '1,200+',
    numClass: 'g',
    title: 'Past OA Questions',
    body: 'Questions from actual campus drives — Quant, Verbal, Logical, DSA, DBMS — solved and explained by section.',
    href: '/questions',
    cta: 'Browse Questions',
  },
  {
    num: '50+',
    numClass: 'a',
    title: 'Company Archives',
    body: 'Past recruitment paper sets for 50+ recruiters. TCS, Accenture, Cognizant, Amazon, Infosys and more with complete question sets.',
    href: '/companies',
    cta: 'Browse Companies',
  },
  {
    num: '100+',
    numClass: '',
    title: 'Interview Reports',
    body: 'Round-by-round reports from placed students — what was asked, how many rounds, and what to prepare.',
    href: '/experiences',
    cta: 'Read Reports',
  },
  {
    num: '₹99',
    numClass: 'g',
    title: 'Per Company Archive',
    body: 'One-time payment. Full access to all past papers for that company. No subscription, no recurring charges.',
    href: '/pricing',
    cta: 'See Pricing',
  },
];
