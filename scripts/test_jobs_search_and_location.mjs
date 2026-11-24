import assert from 'node:assert/strict';

// Test harness mirroring JobsPage.tsx logic

const LOCATION_SYNONYMS = {
  karnataka: ['bengaluru', 'bangalore', 'mysore', 'mysuru', 'hubli', 'mangalore', 'mangaluru', 'karnataka', 'blr', 'ka'],
  bengaluru: ['bengaluru', 'bangalore', 'karnataka', 'blr', 'ka'],
  bangalore: ['bengaluru', 'bangalore', 'karnataka', 'blr', 'ka'],
  blr: ['bengaluru', 'bangalore', 'karnataka', 'ka'],
  ka: ['bengaluru', 'bangalore', 'karnataka', 'blr', 'ka', 'mysore'],
  mysore: ['mysore', 'mysuru', 'karnataka', 'ka'],

  haryana: ['gurgaon', 'gurugram', 'faridabad', 'panchkula', 'manesar', 'sonipat', 'rohtak', 'karnal', 'haryana', 'ncr', 'delhi ncr', 'hr'],
  gurgaon: ['gurgaon', 'gurugram', 'haryana', 'ncr', 'delhi ncr', 'manesar', 'hr'],
  gurugram: ['gurgaon', 'gurugram', 'haryana', 'ncr', 'delhi ncr', 'manesar', 'hr'],
  manesar: ['manesar', 'gurgaon', 'gurugram', 'haryana', 'ncr', 'hr'],
  faridabad: ['faridabad', 'haryana', 'ncr', 'delhi ncr', 'hr'],
  panchkula: ['panchkula', 'haryana', 'chandigarh', 'hr'],
  hr: ['gurgaon', 'gurugram', 'faridabad', 'panchkula', 'manesar', 'sonipat', 'haryana', 'ncr', 'delhi ncr', 'hr'],

  delhi: ['delhi', 'new delhi', 'ncr', 'delhi ncr', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad', 'dl'],
  'new delhi': ['delhi', 'new delhi', 'ncr', 'delhi ncr', 'dl'],
  ncr: ['delhi', 'new delhi', 'noida', 'greater noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad', 'haryana', 'uttar pradesh', 'delhi ncr'],
  'delhi ncr': ['delhi', 'new delhi', 'noida', 'greater noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad', 'haryana', 'uttar pradesh'],
  dl: ['delhi', 'new delhi', 'ncr', 'delhi ncr', 'dl'],

  noida: ['noida', 'greater noida', 'uttar pradesh', 'up', 'ncr', 'delhi ncr', 'ghaziabad'],
  'greater noida': ['noida', 'greater noida', 'uttar pradesh', 'up', 'ncr', 'delhi ncr'],
  'uttar pradesh': ['noida', 'greater noida', 'lucknow', 'kanpur', 'ghaziabad', 'varanasi', 'agra', 'up'],
  up: ['noida', 'greater noida', 'lucknow', 'kanpur', 'ghaziabad', 'uttar pradesh', 'up', 'ncr'],
  lucknow: ['lucknow', 'uttar pradesh', 'up'],
  kanpur: ['kanpur', 'uttar pradesh', 'up'],
  ghaziabad: ['ghaziabad', 'noida', 'delhi', 'ncr', 'uttar pradesh', 'up'],

  maharashtra: ['mumbai', 'pune', 'navi mumbai', 'thane', 'nagpur', 'nashik', 'maharashtra', 'mh'],
  mumbai: ['mumbai', 'navi mumbai', 'thane', 'maharashtra', 'bombay', 'mh'],
  'navi mumbai': ['mumbai', 'navi mumbai', 'thane', 'maharashtra', 'mh'],
  thane: ['mumbai', 'navi mumbai', 'thane', 'maharashtra', 'mh'],
  pune: ['pune', 'hinjewadi', 'maharashtra', 'mh'],
  nagpur: ['nagpur', 'maharashtra', 'mh'],
  mh: ['mumbai', 'pune', 'navi mumbai', 'thane', 'nagpur', 'nashik', 'maharashtra', 'mh'],

  telangana: ['hyderabad', 'secunderabad', 'cyberabad', 'hitec city', 'telangana', 'hyd', 'ts'],
  hyderabad: ['hyderabad', 'secunderabad', 'cyberabad', 'hitec city', 'telangana', 'hyd', 'ts'],
  secunderabad: ['hyderabad', 'secunderabad', 'telangana', 'hyd', 'ts'],
  cyberabad: ['hyderabad', 'cyberabad', 'telangana', 'hyd', 'ts'],
  hyd: ['hyderabad', 'secunderabad', 'cyberabad', 'telangana', 'ts', 'hyd'],
  ts: ['hyderabad', 'secunderabad', 'cyberabad', 'hitec city', 'telangana', 'hyd', 'ts'],

  'andhra pradesh': ['visakhapatnam', 'vizag', 'vijayawada', 'guntur', 'tirupati', 'andhra pradesh', 'ap'],
  ap: ['visakhapatnam', 'vizag', 'vijayawada', 'guntur', 'tirupati', 'andhra pradesh', 'ap'],
  vizag: ['visakhapatnam', 'vizag', 'andhra pradesh', 'ap'],
  visakhapatnam: ['visakhapatnam', 'vizag', 'andhra pradesh', 'ap'],
  vijayawada: ['vijayawada', 'andhra pradesh', 'ap'],

  'tamil nadu': ['chennai', 'coimbatore', 'madurai', 'trichy', 'salem', 'tamil nadu', 'tn'],
  tn: ['chennai', 'coimbatore', 'madurai', 'trichy', 'tamil nadu', 'tn'],
  chennai: ['chennai', 'tamil nadu', 'tn', 'madras'],
  coimbatore: ['coimbatore', 'tamil nadu', 'tn'],

  'west bengal': ['kolkata', 'calcutta', 'howrah', 'west bengal', 'wb'],
  wb: ['kolkata', 'calcutta', 'howrah', 'west bengal', 'wb'],
  kolkata: ['kolkata', 'calcutta', 'howrah', 'west bengal', 'wb'],

  gujarat: ['ahmedabad', 'gandhinagar', 'surat', 'vadodara', 'baroda', 'gift city', 'gujarat', 'gj'],
  gj: ['ahmedabad', 'gandhinagar', 'surat', 'vadodara', 'baroda', 'gujarat', 'gj'],
  ahmedabad: ['ahmedabad', 'gandhinagar', 'gujarat', 'gj'],
  gandhinagar: ['ahmedabad', 'gandhinagar', 'gift city', 'gujarat', 'gj'],

  kerala: ['kochi', 'cochin', 'thiruvananthapuram', 'trivandrum', 'kozhikode', 'calicut', 'kerala', 'kl'],
  kl: ['kochi', 'cochin', 'thiruvananthapuram', 'trivandrum', 'kerala', 'kl'],
  kochi: ['kochi', 'cochin', 'kerala', 'kl'],
  trivandrum: ['thiruvananthapuram', 'trivandrum', 'kerala', 'kl'],

  rajasthan: ['jaipur', 'jodhpur', 'udaipur', 'rajasthan', 'rj'],
  rj: ['jaipur', 'jodhpur', 'udaipur', 'rajasthan', 'rj'],
  jaipur: ['jaipur', 'rajasthan', 'rj'],

  punjab: ['mohali', 'chandigarh', 'ludhiana', 'amritsar', 'punjab', 'pb'],
  pb: ['mohali', 'chandigarh', 'ludhiana', 'amritsar', 'punjab', 'pb'],
  chandigarh: ['chandigarh', 'mohali', 'panchkula', 'punjab', 'haryana', 'pb', 'hr'],
  mohali: ['mohali', 'chandigarh', 'punjab', 'pb'],

  'madhya pradesh': ['indore', 'bhopal', 'gwalior', 'jabalpur', 'madhya pradesh', 'mp'],
  mp: ['indore', 'bhopal', 'gwalior', 'jabalpur', 'madhya pradesh', 'mp'],
  indore: ['indore', 'bhopal', 'madhya pradesh', 'mp'],
  bhopal: ['bhopal', 'indore', 'madhya pradesh', 'mp'],

  odisha: ['bhubaneswar', 'cuttack', 'odisha', 'orissa', 'od'],
  od: ['bhubaneswar', 'cuttack', 'odisha', 'orissa', 'od'],
  bhubaneswar: ['bhubaneswar', 'cuttack', 'odisha', 'od'],

  remote: ['remote', 'work from home', 'wfh', 'pan-india', 'pan india', 'anywhere', 'virtual', 'home'],
  wfh: ['remote', 'work from home', 'wfh', 'pan-india', 'anywhere'],
  'work from home': ['remote', 'work from home', 'wfh', 'pan-india'],
};

function locationMatches(jobLocation, query) {
  if (!query || !query.trim()) return true;
  if (!jobLocation) return false;

  const rawQ = query.trim().toLowerCase();
  if (rawQ.length < 2) return true; // too short, don't filter yet

  const locNorm = jobLocation.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const locTokens = locNorm.split(/\s+/).filter(Boolean);

  const phrases = rawQ
    .split(/[,|/]+/)
    .map((p) => p.replace(/[^a-z0-9\s]/g, ' ').trim())
    .filter(Boolean);

  if (phrases.length === 0) return true;

  return phrases.some((phrase) => {
    if (locNorm.includes(phrase)) return true;

    const qTokens = phrase.split(/\s+/).filter((t) => t.length >= 2);
    if (qTokens.length === 0) return true;

    return qTokens.every((token) => {
      if (locNorm.includes(token)) return true;

      const mapped = LOCATION_SYNONYMS[token];
      if (mapped && mapped.some((m) => locNorm.includes(m) || locTokens.includes(m))) return true;

      for (const locWord of locTokens) {
        const locMapped = LOCATION_SYNONYMS[locWord];
        if (locMapped && locMapped.some((m) => m === token || m.startsWith(token))) return true;
      }

      return false;
    });
  });
}

const SKILL_SYNONYMS = {
  python: ['python', 'py', 'django', 'fastapi', 'flask', 'pandas', 'numpy', 'pytorch'],
  py: ['python', 'py'],
  javascript: ['javascript', 'js', 'node', 'nodejs', 'react', 'typescript'],
  js: ['javascript', 'js', 'node', 'nodejs', 'react'],
  typescript: ['typescript', 'ts'],
  ts: ['typescript', 'ts'],
  cpp: ['c++', 'cpp'],
  'c++': ['c++', 'cpp'],
  csharp: ['c#', 'csharp', '.net', 'dotnet'],
  'c#': ['c#', 'csharp', '.net', 'dotnet'],
  java: ['java', 'spring', 'springboot', 'spring boot', 'hibernate', 'jvm'],
  react: ['react', 'reactjs', 'nextjs', 'next.js', 'frontend'],
  reactjs: ['react', 'reactjs', 'nextjs'],
  angular: ['angular', 'angularjs'],
  vue: ['vue', 'vuejs'],
  node: ['node', 'nodejs', 'express', 'nestjs', 'backend'],
  nodejs: ['node', 'nodejs', 'express', 'nestjs'],
  sql: ['sql', 'mysql', 'postgresql', 'postgres', 'oracle', 'database', 'rdbms'],
  nosql: ['nosql', 'mongodb', 'mongo', 'dynamodb', 'redis', 'cassandra'],
  mongo: ['mongodb', 'mongo', 'nosql'],
  mongodb: ['mongodb', 'mongo', 'nosql'],
  aws: ['aws', 'amazon web services', 'cloud', 'ec2', 's3', 'lambda'],
  cloud: ['cloud', 'aws', 'azure', 'gcp', 'google cloud', 'devops'],
  azure: ['azure', 'microsoft azure', 'cloud'],
  gcp: ['gcp', 'google cloud', 'cloud'],
  devops: ['devops', 'ci/cd', 'docker', 'kubernetes', 'k8s', 'terraform', 'jenkins'],
  docker: ['docker', 'container', 'kubernetes', 'k8s'],
  kubernetes: ['kubernetes', 'k8s', 'docker'],
  ai: ['ai', 'artificial intelligence', 'ml', 'machine learning', 'llm', 'genai', 'nlp'],
  ml: ['machine learning', 'ml', 'deep learning', 'data science', 'ai'],
  data: ['data', 'data science', 'data analytics', 'data engineer', 'analyst', 'sql', 'python'],
  qa: ['qa', 'quality assurance', 'testing', 'tester', 'automation', 'selenium', 'cypress', 'playwright', 'manual testing', 'sdet'],
  sde: ['sde', 'software engineer', 'software development engineer', 'developer', 'programmer'],
  frontend: ['frontend', 'front-end', 'ui', 'ux', 'web developer', 'react', 'vue', 'angular', 'javascript'],
  backend: ['backend', 'back-end', 'server', 'api', 'microservices', 'node', 'java', 'golang', 'python', 'spring'],
  fullstack: ['fullstack', 'full-stack', 'full stack', 'mern', 'mean'],
  dsa: ['dsa', 'data structures', 'algorithms', 'problem solving', 'leetcode'],
  fresher: ['fresher', 'freshers', 'entry level', 'graduate', '0-1', 'intern', 'trainee', 'campus'],
  sales: ['sales', 'business development', 'bde', 'inside sales'],
  hr: ['hr', 'human resources', 'recruitment', 'talent acquisition'],
  marketing: ['marketing', 'seo', 'sem', 'content', 'growth'],
  mobile: ['mobile', 'android', 'ios', 'flutter', 'react native', 'swift', 'kotlin'],
  android: ['android', 'kotlin', 'mobile'],
  ios: ['ios', 'swift', 'mobile'],
  flutter: ['flutter', 'dart', 'mobile'],
  golang: ['golang', 'go'],
  go: ['golang', 'go'],
};

function normalizeSearchText(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[''’]/g, '');
}

function jobMatchesSearch(job, query) {
  if (!query || !query.trim()) return true;

  const rawQ = query.trim().toLowerCase();
  if (rawQ.length < 2) return true;

  const tagsStr = Array.isArray(job.tags) ? job.tags.join(' ') : '';
  const rawCorpus = [
    job.title,
    job.company_name,
    job.stipend_or_salary || '',
    tagsStr,
    job.description || '',
    job.type === 'JOB' ? 'full-time full time job' : 'internship intern',
  ].join(' ');

  const corpus = normalizeSearchText(rawCorpus);

  const phrases = rawQ
    .split(/[,|]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (phrases.length === 0) return true;

  return phrases.some((phrase) => {
    const normPhrase = normalizeSearchText(phrase);
    if (corpus.includes(normPhrase)) return true;

    const tokens = normPhrase.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return true;

    return tokens.every((token) => {
      if (corpus.includes(token)) return true;

      const skillSyns = SKILL_SYNONYMS[token];
      if (skillSyns && skillSyns.some((syn) => corpus.includes(normalizeSearchText(syn)))) return true;

      return false;
    });
  });
}

// Domain matching
const DOMAIN_KEYWORDS = {
  software: ['software', 'sde', 'developer', 'engineer', 'programming', 'programmer', 'development', 'coder', 'swe'],
  frontend: ['frontend', 'front-end', 'ui', 'ux', 'web', 'react', 'vue', 'angular', 'javascript', 'html', 'css'],
  backend: ['backend', 'back-end', 'api', 'server', 'microservices', 'node', 'express', 'django', 'fastapi', 'spring', 'java', 'golang', 'sql', 'database'],
  full: ['fullstack', 'full-stack', 'full stack', 'mern', 'mean'],
  data: ['data', 'ai', 'ml', 'machine learning', 'deep learning', 'analyst', 'analytics', 'data science', 'llm', 'genai', 'nlp', 'computer vision', 'bi'],
  cloud: ['cloud', 'devops', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'terraform', 'ci/cd', 'sre', 'infrastructure'],
  qa: ['qa', 'test', 'testing', 'tester', 'quality assurance', 'automation', 'selenium', 'cypress', 'playwright', 'sdet'],
};

function jobMatchesDomain(job, domainTag) {
  if (!domainTag || domainTag === 'ALL') return true;
  const target = domainTag.toLowerCase();
  const keywords = DOMAIN_KEYWORDS[target] || [target];

  const titleLower = (job.title || '').toLowerCase();
  const tagsLower = Array.isArray(job.tags) ? job.tags.map((t) => t.toLowerCase()) : [];
  const tagsStr = tagsLower.join(' ');

  if (titleLower.includes(target) || tagsStr.includes(target)) return true;
  return keywords.some((kw) => titleLower.includes(kw) || tagsLower.some((t) => t.includes(kw)));
}

// Workplace mode matching
function jobMatchesWorkMode(job, workMode) {
  if (!workMode || workMode === 'ALL') return true;

  const loc = (job.location || '').toLowerCase();
  const tagsStr = Array.isArray(job.tags) ? job.tags.join(' ').toLowerCase() : '';
  const desc = (job.description || '').toLowerCase();

  const isHybrid = loc.includes('hybrid') || tagsStr.includes('hybrid') || desc.includes('hybrid remote') || desc.includes('hybrid model') || desc.includes('work location: hybrid');
  const isRemote = (loc.includes('remote') || loc.includes('wfh') || loc.includes('work from home') || tagsStr.includes('remote') || tagsStr.includes('wfh')) && !isHybrid;

  if (workMode === 'REMOTE') return isRemote;
  if (workMode === 'HYBRID') return isHybrid;
  if (workMode === 'ON_SITE') return !isRemote && !isHybrid;

  return true;
}

// Experience level matching
function expMatchesFilter(min, max, level) {
  if (min > 1) return false;
  if (!level || level === 'ANY') return true;
  if (level === 'FRESHER') return min === 0;
  if (level === '0-2') return min <= 1 && (!max || max <= 1);
  return true;
}

// ─── Test Suite ─────────────────────────────────────────────────────────────

console.log('🧪 Starting Jobs Search & Location Verification Suite...');

const sampleNiitJob = {
  id: 'niit-001',
  title: 'Graduate Trainee Engineer',
  company_name: 'NIIT Technologies',
  location: 'Gurgaon, India',
  type: 'JOB',
  experience_min: 0,
  experience_max: 1,
  stipend_or_salary: '₹4.5 - 6.0 LPA',
  tags: ['Software', 'Fresher', 'Engineering'],
  description: `Roles & Responsibilities:
- Participate in end-to-end SDLC lifecycle
- Debug, write and unit test code modules
- Basic understanding of programming languages such as Java, Python, C++, or JavaScript.
- Strong analytical and problem solving mindset.`,
};

const sampleBengaluruJob = {
  id: 'beng-002',
  title: 'Frontend Developer',
  company_name: 'Razorpay',
  location: 'Bengaluru, Karnataka',
  type: 'JOB',
  experience_min: 1,
  experience_max: 3,
  tags: ['React', 'TypeScript', 'UI'],
  description: 'Building modern checkout interfaces using React and Redux.',
};

const sampleRemoteJob = {
  id: 'rem-003',
  title: 'Full Stack Engineer',
  company_name: 'Zapier',
  location: 'Remote (Work From Home)',
  type: 'JOB',
  experience_min: 2,
  tags: ['NodeJS', 'Python', 'Full Stack'],
  description: 'Distributed engineering team working across microservices.',
};

// ─── Search Tests ──────────────────────────────────────────────────────────────

// 1. Min-length gate: 1-char query returns true (don't filter)
assert.equal(jobMatchesSearch(sampleNiitJob, 'd'), true, '1-char search must NOT filter yet');
assert.equal(jobMatchesSearch(sampleBengaluruJob, 'r'), true, '1-char search must NOT filter yet');

// 2. Skill in Description Match (2+ chars)
assert.equal(jobMatchesSearch(sampleNiitJob, 'python'), true, 'Search "python" MUST match NIIT description');
assert.equal(jobMatchesSearch(sampleNiitJob, 'py'), true, 'Search "py" synonym MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'java'), true, 'Search "java" MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'javascript'), true, 'Search "javascript" MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'trainee'), true, 'Search "trainee" in title MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'niit'), true, 'Search "niit" company MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'nonexistentxyz'), false, 'Non-existent skill must return false');

// 3. Location name in MAIN SEARCH BAR must NOT cross-filter (isolation test)
// The Bengaluru job has location "Bengaluru, Karnataka" but that's NOT in the search corpus
// so typing "gurgaon" in the search bar should NOT return the NIIT job either...
// Actually since we removed location from corpus it depends on whether the word appears in title/desc/tags
// For NIIT job: title="Graduate Trainee Engineer", desc has no "delhi" keyword
assert.equal(jobMatchesSearch(sampleNiitJob, 'delhi'), false, 'Typing "delhi" in search bar must NOT match NIIT (location excluded from corpus)');
assert.equal(jobMatchesSearch(sampleBengaluruJob, 'gurgaon'), false, 'Typing "gurgaon" in search bar must NOT match Bengaluru job');

// 4. Prefix search on job title/company works fine
assert.equal(jobMatchesSearch(sampleNiitJob, 'ni'), true, '2-char prefix "ni" MUST match "NIIT"');
assert.equal(jobMatchesSearch(sampleNiitJob, 'gra'), true, '3-char prefix "gra" MUST match "Graduate"');
assert.equal(jobMatchesSearch(sampleBengaluruJob, 'ra'), true, '2-char prefix "ra" MUST match "Razorpay"');
assert.equal(jobMatchesSearch(sampleBengaluruJob, 'fro'), true, '3-char prefix "fro" MUST match "Frontend"');

// ─── Location Tests ──────────────────────────────────────────────────────────

// 5. Min-length gate in location: 1-char returns true
assert.equal(locationMatches(sampleNiitJob.location, 'd'), true, '1-char location query must NOT filter');

// 6. Prefix typing (incremental search)
assert.equal(locationMatches(sampleNiitJob.location, 'gu'), true, '"gu" prefix MUST match "Gurgaon"');
assert.equal(locationMatches(sampleNiitJob.location, 'gur'), true, '"gur" prefix MUST match "Gurgaon"');
assert.equal(locationMatches(sampleNiitJob.location, 'gurg'), true, '"gurg" MUST match "Gurgaon"');
assert.equal(locationMatches('Delhi, India', 'de'), true, '"de" prefix MUST match "Delhi"');
assert.equal(locationMatches('Delhi, India', 'del'), true, '"del" prefix MUST match "Delhi"');

// 7. City/State synonym hierarchy
assert.equal(locationMatches(sampleNiitJob.location, 'haryana'), true, '"haryana" MUST match "Gurgaon, India"');
assert.equal(locationMatches(sampleNiitJob.location, 'gurugram'), true, '"gurugram" MUST match "Gurgaon, India"');
assert.equal(locationMatches(sampleNiitJob.location, 'ncr'), true, '"ncr" MUST match "Gurgaon, India"');
assert.equal(locationMatches(sampleBengaluruJob.location, 'karnataka'), true, '"karnataka" MUST match "Bengaluru, Karnataka"');
assert.equal(locationMatches(sampleBengaluruJob.location, 'bangalore'), true, '"bangalore" MUST match "Bengaluru, Karnataka"');
assert.equal(locationMatches('Haryana, India', 'gurgaon'), true, '"gurgaon" MUST match job listed as "Haryana"');
assert.equal(locationMatches('Karnataka, India', 'bengaluru'), true, '"bengaluru" MUST match "Karnataka"');

// 8. Remote
assert.equal(locationMatches(sampleRemoteJob.location, 'rem'), true, '"rem" prefix MUST match "Remote"');
assert.equal(locationMatches(sampleRemoteJob.location, 'remote'), true, '"remote" MUST match');
assert.equal(locationMatches(sampleRemoteJob.location, 'wfh'), true, '"wfh" MUST match work from home');

// 9. Isolation: Bengaluru job must NOT show for Haryana search
assert.equal(locationMatches(sampleBengaluruJob.location, 'haryana'), false, '"haryana" must NOT match "Bengaluru, Karnataka"');
assert.equal(locationMatches(sampleNiitJob.location, 'bengaluru'), false, '"bengaluru" must NOT match "Gurgaon, India"');

// 10. State abbreviation matches: "KA, India" matches Bangalore, Bengaluru, Karnataka, KA
const sampleLowesJob = {
  id: 'lowes-001',
  title: 'Associate Software Engineer',
  company_name: "Lowe's Home Improvement",
  location: 'KA, India',
  type: 'JOB',
  experience_min: 0,
  experience_max: 1,
  tags: ['Retail', 'Engineering'],
  description: "Lowe's is actively hiring for Associate Software Engineer in Bengaluru Manyata Tech Park.",
};

assert.equal(locationMatches(sampleLowesJob.location, 'Bangalore'), true, '"KA, India" MUST match "Bangalore"');
assert.equal(locationMatches(sampleLowesJob.location, 'Bengaluru'), true, '"KA, India" MUST match "Bengaluru"');
assert.equal(locationMatches(sampleLowesJob.location, 'Karnataka'), true, '"KA, India" MUST match "Karnataka"');
assert.equal(locationMatches(sampleLowesJob.location, 'KA'), true, '"KA, India" MUST match "KA"');
assert.equal(locationMatches(sampleLowesJob.location, 'Delhi'), false, '"KA, India" must NOT match "Delhi"');

// 11. Multi-location comma search: "Bangalore, Hyderabad" matches either city
assert.equal(locationMatches('Bengaluru, Karnataka', 'Bangalore, Hyderabad'), true, 'Comma location query matches Bangalore');
assert.equal(locationMatches('Hyderabad, Telangana', 'Bangalore, Hyderabad'), true, 'Comma location query matches Hyderabad');
assert.equal(locationMatches('Chennai, Tamil Nadu', 'Bangalore, Hyderabad'), false, 'Chennai does not match Bangalore, Hyderabad');

// 12. Search bar with comma-separated skills: "React, Python" matches jobs with React OR Python
assert.equal(jobMatchesSearch(sampleBengaluruJob, 'React, Python'), true, 'React job MUST match "React, Python"');
assert.equal(jobMatchesSearch(sampleRemoteJob, 'React, Python'), true, 'Python job MUST match "React, Python"');
assert.equal(jobMatchesSearch(sampleNiitJob, 'React, Python'), true, 'Job with Python in desc MUST match "React, Python"');

// 13. Search bar with apostrophe normalization: "Lowes" matches "Lowe's"
assert.equal(jobMatchesSearch(sampleLowesJob, 'Lowes'), true, '"Lowes" MUST match "Lowe\'s"');
assert.equal(jobMatchesSearch(sampleLowesJob, "Lowe's"), true, '"Lowe\'s" MUST match');

// 14. Domain matching assertions
assert.equal(jobMatchesDomain(sampleLowesJob, 'software'), true, 'Associate Software Engineer matches software domain');
assert.equal(jobMatchesDomain(sampleBengaluruJob, 'frontend'), true, 'Frontend Developer matches frontend domain');
assert.equal(jobMatchesDomain(sampleRemoteJob, 'full'), true, 'Full Stack Engineer matches full stack domain');

const sampleDataJob = {
  id: 'data-001',
  title: 'Machine Learning Intern',
  company_name: 'AI Labs',
  location: 'Remote',
  type: 'INTERNSHIP',
  tags: ['Python', 'TensorFlow', 'NLP'],
};
assert.equal(jobMatchesDomain(sampleDataJob, 'data'), true, 'Machine Learning Intern matches data/AI domain');

const sampleQaJob = {
  id: 'qa-001',
  title: 'SDET / Quality Assurance Engineer',
  company_name: 'TestCo',
  location: 'Pune',
  type: 'JOB',
  tags: ['Selenium', 'Automation'],
};
assert.equal(jobMatchesDomain(sampleQaJob, 'qa'), true, 'SDET matches QA domain');

// 15. Workplace mode matching assertions
const sampleHybridJob = {
  id: 'hyb-001',
  title: 'Junior Developer',
  company_name: 'HybridCo',
  location: 'Hybrid remote in Kakkanad, Kochi, Kerala',
  type: 'JOB',
  tags: ['Java'],
};
assert.equal(jobMatchesWorkMode(sampleHybridJob, 'HYBRID'), true, 'Hybrid remote matches HYBRID');
assert.equal(jobMatchesWorkMode(sampleHybridJob, 'REMOTE'), false, 'Hybrid remote must NOT match pure REMOTE');
assert.equal(jobMatchesWorkMode(sampleHybridJob, 'ON_SITE'), false, 'Hybrid remote must NOT match ON_SITE');

assert.equal(jobMatchesWorkMode(sampleRemoteJob, 'REMOTE'), true, 'Pure Remote matches REMOTE');
assert.equal(jobMatchesWorkMode(sampleRemoteJob, 'HYBRID'), false, 'Pure Remote must NOT match HYBRID');
assert.equal(jobMatchesWorkMode(sampleBengaluruJob, 'ON_SITE'), true, 'Bengaluru office job matches ON_SITE');

// 16. Experience level matching assertions
assert.equal(expMatchesFilter(0, 1, 'FRESHER'), true, '0-1 yr job open to freshers matches FRESHER');
assert.equal(expMatchesFilter(0, 0, 'FRESHER'), true, '0-0 yr job matches FRESHER');
assert.equal(expMatchesFilter(1, 2, 'FRESHER'), false, '1-2 yr job does NOT match 0-yr FRESHER');
assert.equal(expMatchesFilter(0, 1, '0-2'), true, '0-1 yr job matches 0-2 early career');

console.log('✅ ALL SEARCH ISOLATION & INCREMENTAL LOCATION ASSERTIONS PASSED!');
