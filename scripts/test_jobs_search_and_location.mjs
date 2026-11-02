import assert from 'node:assert/strict';

// Test harness mirroring JobsPage.tsx logic

const LOCATION_SYNONYMS = {
  haryana: ['gurgaon', 'gurugram', 'faridabad', 'panchkula', 'manesar', 'sonipat', 'rohtak', 'karnal', 'haryana', 'ncr', 'delhi ncr'],
  gurgaon: ['gurgaon', 'gurugram', 'haryana', 'ncr', 'delhi ncr', 'manesar'],
  gurugram: ['gurgaon', 'gurugram', 'haryana', 'ncr', 'delhi ncr', 'manesar'],
  manesar: ['manesar', 'gurgaon', 'gurugram', 'haryana', 'ncr'],
  faridabad: ['faridabad', 'haryana', 'ncr', 'delhi ncr'],
  panchkula: ['panchkula', 'haryana', 'chandigarh'],

  delhi: ['delhi', 'new delhi', 'ncr', 'delhi ncr', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad'],
  'new delhi': ['delhi', 'new delhi', 'ncr', 'delhi ncr'],
  ncr: ['delhi', 'new delhi', 'noida', 'greater noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad', 'haryana', 'uttar pradesh'],
  'delhi ncr': ['delhi', 'new delhi', 'noida', 'greater noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad', 'haryana', 'uttar pradesh'],

  noida: ['noida', 'greater noida', 'uttar pradesh', 'up', 'ncr', 'delhi ncr', 'ghaziabad'],
  'greater noida': ['noida', 'greater noida', 'uttar pradesh', 'up', 'ncr', 'delhi ncr'],
  'uttar pradesh': ['noida', 'greater noida', 'lucknow', 'kanpur', 'ghaziabad', 'varanasi', 'agra', 'up'],
  up: ['noida', 'greater noida', 'lucknow', 'kanpur', 'ghaziabad', 'uttar pradesh'],
  lucknow: ['lucknow', 'uttar pradesh', 'up'],
  kanpur: ['kanpur', 'uttar pradesh', 'up'],
  ghaziabad: ['ghaziabad', 'noida', 'delhi', 'ncr', 'uttar pradesh'],

  karnataka: ['bengaluru', 'bangalore', 'mysore', 'mysuru', 'hubli', 'mangalore', 'mangaluru', 'karnataka', 'blr'],
  bengaluru: ['bengaluru', 'bangalore', 'karnataka', 'blr'],
  bangalore: ['bengaluru', 'bangalore', 'karnataka', 'blr'],
  blr: ['bengaluru', 'bangalore', 'karnataka'],
  mysore: ['mysore', 'mysuru', 'karnataka'],

  maharashtra: ['mumbai', 'pune', 'navi mumbai', 'thane', 'nagpur', 'nashik', 'maharashtra', 'mh'],
  mumbai: ['mumbai', 'navi mumbai', 'thane', 'maharashtra', 'bombay'],
  'navi mumbai': ['mumbai', 'navi mumbai', 'thane', 'maharashtra'],
  thane: ['mumbai', 'navi mumbai', 'thane', 'maharashtra'],
  pune: ['pune', 'hinjewadi', 'maharashtra'],
  nagpur: ['nagpur', 'maharashtra'],

  telangana: ['hyderabad', 'secunderabad', 'cyberabad', 'hitec city', 'telangana', 'hyd'],
  hyderabad: ['hyderabad', 'secunderabad', 'cyberabad', 'hitec city', 'telangana', 'hyd'],
  secunderabad: ['hyderabad', 'secunderabad', 'telangana'],
  cyberabad: ['hyderabad', 'cyberabad', 'telangana'],
  hyd: ['hyderabad', 'secunderabad', 'telangana'],

  'tamil nadu': ['chennai', 'coimbatore', 'madurai', 'trichy', 'tamil nadu', 'tn'],
  tn: ['chennai', 'coimbatore', 'tamil nadu'],
  chennai: ['chennai', 'tamil nadu', 'tn', 'madras'],
  coimbatore: ['coimbatore', 'tamil nadu', 'tn'],

  'west bengal': ['kolkata', 'calcutta', 'howrah', 'west bengal', 'wb'],
  wb: ['kolkata', 'west bengal'],
  kolkata: ['kolkata', 'calcutta', 'howrah', 'west bengal'],

  gujarat: ['ahmedabad', 'gandhinagar', 'surat', 'vadodara', 'baroda', 'gift city', 'gujarat'],
  ahmedabad: ['ahmedabad', 'gandhinagar', 'gujarat'],
  gandhinagar: ['ahmedabad', 'gandhinagar', 'gift city', 'gujarat'],

  kerala: ['kochi', 'cochin', 'thiruvananthapuram', 'trivandrum', 'kozhikode', 'calicut', 'kerala'],
  kochi: ['kochi', 'cochin', 'kerala'],
  trivandrum: ['thiruvananthapuram', 'trivandrum', 'kerala'],

  rajasthan: ['jaipur', 'jodhpur', 'udaipur', 'rajasthan'],
  jaipur: ['jaipur', 'rajasthan'],

  punjab: ['mohali', 'chandigarh', 'ludhiana', 'amritsar', 'punjab'],
  chandigarh: ['chandigarh', 'mohali', 'panchkula', 'punjab', 'haryana'],
  mohali: ['mohali', 'chandigarh', 'punjab'],

  remote: ['remote', 'work from home', 'wfh', 'pan-india', 'pan india', 'anywhere', 'virtual'],
  wfh: ['remote', 'work from home', 'wfh', 'pan-india', 'anywhere'],
  'work from home': ['remote', 'work from home', 'wfh', 'pan-india'],
};

function locationMatches(jobLocation, query) {
  if (!query || !query.trim()) return true;
  if (!jobLocation) return false;

  const locNorm = jobLocation.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const qNorm = query.toLowerCase().trim().replace(/[^a-z0-9\s]/g, ' ');

  if (locNorm.includes(qNorm) || qNorm.includes(locNorm.trim())) {
    return true;
  }

  const qTokens = qNorm.split(/\s+/).filter(Boolean);
  if (qTokens.length === 0) return true;

  const locTokens = locNorm.split(/\s+/).filter(Boolean);

  return qTokens.every((token) => {
    if (locNorm.includes(token)) return true;

    const mapped = LOCATION_SYNONYMS[token];
    if (mapped && mapped.some((m) => locNorm.includes(m))) {
      return true;
    }

    for (const locWord of locTokens) {
      const locMapped = LOCATION_SYNONYMS[locWord];
      if (locMapped && locMapped.includes(token)) {
        return true;
      }
    }

    return false;
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
  qa: ['qa', 'quality assurance', 'testing', 'tester', 'automation', 'selenium', 'cypress', 'playwright', 'manual testing'],
  sde: ['sde', 'software engineer', 'software development engineer', 'developer', 'programmer'],
  frontend: ['frontend', 'front-end', 'ui', 'ux', 'web developer', 'react', 'vue', 'angular', 'javascript'],
  backend: ['backend', 'back-end', 'server', 'api', 'microservices', 'node', 'java', 'golang', 'python', 'spring'],
  fullstack: ['fullstack', 'full-stack', 'full stack', 'mern', 'mean'],
  dsa: ['dsa', 'data structures', 'algorithms', 'problem solving', 'leetcode'],
  fresher: ['fresher', 'freshers', 'entry level', 'graduate', '0-1', 'intern', 'trainee', 'campus'],
};

function jobMatchesSearch(job, query) {
  if (!query || !query.trim()) return true;

  const tagsStr = Array.isArray(job.tags) ? job.tags.join(' ') : '';
  const corpus = [
    job.title,
    job.company_name,
    job.location,
    job.stipend_or_salary || '',
    tagsStr,
    job.description || '',
    job.type === 'JOB' ? 'full-time full time job' : 'internship intern',
  ]
    .join(' ')
    .toLowerCase();

  const q = query.toLowerCase().trim();

  if (corpus.includes(q)) return true;

  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  return tokens.every((token) => {
    if (corpus.includes(token)) return true;

    const skillSyns = SKILL_SYNONYMS[token];
    if (skillSyns && skillSyns.some((syn) => corpus.includes(syn))) {
      return true;
    }

    const locSyns = LOCATION_SYNONYMS[token];
    if (locSyns && locSyns.some((syn) => corpus.includes(syn))) {
      return true;
    }

    return false;
  });
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

// 1. Skill in Description Match
assert.equal(jobMatchesSearch(sampleNiitJob, 'python'), true, 'Search for "python" MUST match NIIT description');
assert.equal(jobMatchesSearch(sampleNiitJob, 'py'), true, 'Search for "py" synonym MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'java'), true, 'Search for "java" MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'javascript'), true, 'Search for "javascript" MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'c++'), true, 'Search for "c++" MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'cpp'), true, 'Search for "cpp" synonym MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'trainee'), true, 'Search for "trainee" in title MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'niit'), true, 'Search for "niit" company MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'nonexistentxyz'), false, 'Non-existent skill must return false');

// 2. Location & Region Hierarchy Match
assert.equal(locationMatches(sampleNiitJob.location, 'haryana'), true, 'Searching "haryana" MUST match job in "Gurgaon, India"');
assert.equal(locationMatches(sampleNiitJob.location, 'gurgaon'), true, 'Searching "gurgaon" MUST match "Gurgaon, India"');
assert.equal(locationMatches(sampleNiitJob.location, 'gurugram'), true, 'Searching "gurugram" MUST match "Gurgaon, India"');
assert.equal(locationMatches(sampleNiitJob.location, 'delhi ncr'), true, 'Searching "delhi ncr" MUST match "Gurgaon, India"');
assert.equal(locationMatches(sampleNiitJob.location, 'ncr'), true, 'Searching "ncr" MUST match "Gurgaon, India"');
assert.equal(locationMatches(sampleNiitJob.location, 'bengaluru'), false, 'Searching "bengaluru" must NOT match "Gurgaon, India"');

// 3. Reverse Region Match (Search city for state job)
assert.equal(locationMatches('Haryana, India', 'gurgaon'), true, 'Searching "gurgaon" MUST match job listed as "Haryana, India"');
assert.equal(locationMatches('Karnataka, India', 'bangalore'), true, 'Searching "bangalore" MUST match job in "Karnataka"');
assert.equal(locationMatches('Karnataka, India', 'bengaluru'), true, 'Searching "bengaluru" MUST match job in "Karnataka"');
assert.equal(locationMatches(sampleBengaluruJob.location, 'karnataka'), true, 'Searching "karnataka" MUST match "Bengaluru, Karnataka"');
assert.equal(locationMatches(sampleBengaluruJob.location, 'bangalore'), true, 'Searching "bangalore" MUST match "Bengaluru, Karnataka"');

// 4. Remote Matching
assert.equal(locationMatches(sampleRemoteJob.location, 'remote'), true, 'Searching "remote" MUST match');
assert.equal(locationMatches(sampleRemoteJob.location, 'wfh'), true, 'Searching "wfh" MUST match');
assert.equal(locationMatches(sampleRemoteJob.location, 'work from home'), true, 'Searching "work from home" MUST match');

// 5. Multi-token Search (skill + location in search query)
assert.equal(jobMatchesSearch(sampleNiitJob, 'python gurgaon'), true, 'Multi-token "python gurgaon" MUST match NIIT');
assert.equal(jobMatchesSearch(sampleNiitJob, 'python haryana'), true, 'Multi-token "python haryana" MUST match NIIT via synonym');

console.log('✅ ALL 20+ SEARCH & LOCATION ASSERTIONS PASSED PERFECTLY!');
