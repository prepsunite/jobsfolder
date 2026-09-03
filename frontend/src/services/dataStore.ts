// Global synchronized state manager for Admin CRUD operations visible to all users live!
import { resolveTopicSlug } from './topicMap';
import { supabase } from '@/lib/supabase';
import stringify from 'fast-json-stable-stringify';
import {
  validateQuestionItem,
  generateQuestionFingerprint,
  parseTopicQuestionJsonItem as parseTopicQuestionJsonItemUtil,
  safeJsonParse,
} from '@/utils/questionParser';
export { resolveTopicSlug };

// STORAGE KEYS CONSTANTS
export const STORAGE_KEYS = {
  COMPANIES: 'prepunite_companies',
  EXAMS: 'prepunite_exams',
  ROLES: 'prepunite_roles',
  PAPERS: 'prepunite_papers',
  TOPICS: 'prepunite_topics',
  ROUNDS: 'prepunite_rounds',
  QUESTIONS: 'prepunite_questions',
  TOPIC_QUESTIONS: 'prepunite_topic_questions',
  EXPERIENCES: 'prepunite_experiences',
  BOOKMARKED_EXAMS: 'prepunite_bookmarked_exams',
  BOOKMARKED_QUESTIONS: 'prepunite_bookmarked_questions',
  BOOKMARKED_EXPERIENCES: 'prepunite_bookmarked_experiences',
  PURCHASED_EXAM_IDS: 'jobsfolder_purchased_exam_ids',
  USER_SUBSCRIPTION: 'jobsfolder_user_subscription',
} as const;

export interface CompanyItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  industry: string;
  companySize: string;
  headquarters: string;
  website?: string;
  logoUrl?: string;
  examsList?: string[]; // Legacy, kept for fallback
  aboutCompany?: string; // Full markdown content for "About Company" tab
  isActive: boolean;
  createdAt: string;
}

export interface DocTabNode {
  id: string;
  title: string;
  content: string;
  emoji?: string;
  isCollapsed?: boolean;
  isFree?: boolean;
  children?: DocTabNode[];
}

// PUBLIC EXAM DTO (Shipped in public APIs - ZERO document URLs!)
export interface ExamItem {
  id: string;
  companySlug: string;
  name: string;
  badge: string;
  content: string; // The full markdown text containing syllabus, pattern (About Exam)
  oldPapers?: string; // Markdown text for Old Papers tab
  paperTabs?: DocTabNode[]; // Sub-tabs tree for Old Papers (Aptitude, Coding, Interview, etc.)
  googleDocEmbedUrl?: string;
  googleDocEditUrl?: string;
  price?: number;
  isPublicExam?: boolean; // true = all content is free, no paywall for any section
  upvotes: number;
}

// SECURE BACKEND DTO (Returned ONLY after server-side JWT & purchase verification)
export type PaperAccessStatusCode = 'AUTHORIZED' | 'PAYMENT_REQUIRED' | 'EXPIRED' | 'NOT_FOUND' | 'ADMIN_ONLY';

export interface AuthorizedPaperResponse {
  status: PaperAccessStatusCode;
  documentUrl: string | null;
  isAuthorized: boolean;
  watermarkText?: string;
  userEmail?: string;
  timestamp?: string;
  reasonCode: PaperAccessStatusCode;
}

export interface ExamWithCompany extends ExamItem {
  companyName: string;
  companyLogoUrl?: string;
  companyIndustry?: string;
}

export interface QuestionItem {
  id: string;
  title: string;
  companySlug: string;
  companyName: string;
  role: string;
  year: number;
  category: string; // 'CODING' | 'APTITUDE' | 'REASONING' | 'PSEUDOCODE' | 'SQL'
  difficulty: string; // 'EASY' | 'MEDIUM' | 'HARD'
  problemStatement: string;
  inputFormat?: string;
  outputFormat?: string;
  sampleInput?: string;
  sampleOutput?: string;
  explanation?: string;
}

export interface StructuredExplanation {
  passage?: string;
  passageTitle?: string;
  given?: string[];
  steps?: (string | { title?: string; text?: string; content?: string; formula?: string })[];
  shortcut?: string;
  formulaUsed?: string[];
  finalAnswer?: string;
}

export interface QuestionOption {
  id?: string; // "A", "B", "C", "D", "E"
  key?: string; // Backward compatibility
  text: string;
}

export interface AiMetadata {
  generatedBy?: string;
  reviewed?: boolean;
}

export type QuestionStatus = 'draft' | 'reviewed' | 'published' | 'archived';

export interface TopicQuestionItem {
  id: string; // UUID
  version?: number; // 1
  topicId: string;
  questionNumber: number;
  statement: string;
  options: QuestionOption[];
  correctAnswer: string; // "A", "B", "C", "D"
  explanation?: string; // Plain text fallback
  structuredExplanation?: StructuredExplanation; // SOURCE OF TRUTH
  formulasUsed?: string[];
  difficultyLevel?: 1 | 2 | 3; // 1 = Easy, 2 = Medium, 3 = Hard
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD'; // Backward compatibility
  status?: QuestionStatus;
  isHidden?: boolean;
  aiMetadata?: AiMetadata;
  templateId?: string;
  variables?: Record<string, any>;
  testCase?: string; // Plain multiline string with exact \n formatting
  sampleInput?: string;
  sampleOutput?: string;
  examples?: string;
  fingerprint?: string; // SHA-256 Fixed Hash
  createdAt?: string;
}

export interface ImportErrorReport {
  question?: string;
  itemIndex: number;
  reason: string;
}

export interface ImportReport {
  success: number;
  duplicates: number;
  invalid: number;
  errors: ImportErrorReport[];
}



export interface ExperienceItem {
  id: string;
  companyName: string;
  role: string;
  studentName: string;
  college: string;
  year: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  verdict: 'SELECTED' | 'REJECTED' | 'WAITLISTED';
  rounds: { roundTitle: string; details: string }[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  upvotes?: number;
  driveType?: 'ON_CAMPUS' | 'OFF_CAMPUS' | 'POOL_CAMPUS';
}



export interface CustomRole {
  id: string;
  companySlug: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  tierBadge: string;
  badgeColor: string;
  eligibility: string;
  description: string;
}

export interface CustomPaper {
  id: string;
  companySlug: string;
  title: string;
  questions: number;
  duration: string;
}

export interface CustomTopic {
  id: string;
  companySlug: string;
  name: string;
  count: number;
}

export interface CustomRound {
  id: string;
  companySlug: string;
  roundNumber: number;
  title: string;
  durationMinutes: number;
  description: string;
  tips: string;
}

const INITIAL_COMPANIES: CompanyItem[] = [
  {
    id: '1',
    name: 'TCS',
    slug: 'tcs',
    description: 'Tata Consultancy Services conducts TCS NQT, TCS iON NQT, and TCS BPS recruitment drives.',
    industry: 'IT Services & Consulting',
    companySize: '500,000+ employees',
    headquarters: 'Mumbai, India',
    examsList: ['TCS NQT 2026', 'TCS iON NQT', 'TCS BPS'],
    aboutCompany: `### About Tata Consultancy Services (TCS)\n\nTCS is a global leader in IT services, consulting, and business solutions. As one of the largest employers in the IT sector, TCS conducts massive recruitment drives annually to hire fresh graduates across various roles including Ninja, Digital, and Prime.`,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Accenture',
    slug: 'accenture',
    description: 'Accenture conducts ASE and AAEA recruitment drives across 90+ engineering colleges.',
    industry: 'Consulting & Tech',
    companySize: '700,000+ employees',
    headquarters: 'Dublin, Ireland',
    examsList: ['Accenture ASE Drive', 'Accenture AAEA'],
    aboutCompany: `### About Accenture\n\nAccenture is a leading global professional services company, providing a broad range of services in strategy and consulting, interactive, technology and operations.`,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Infosys',
    slug: 'infosys',
    description: 'Infosys offers DSE, Specialist Programmer, and System Engineer roles via HackWithInfy & InfyTQ.',
    industry: 'Digital Services',
    companySize: '300,000+ employees',
    headquarters: 'Bangalore, India',
    examsList: ['Infosys DSE Drive', 'HackWithInfy'],
    aboutCompany: `### About Infosys\n\nInfosys is a global leader in next-generation digital services and consulting, enabling clients in more than 50 countries to navigate their digital transformation.`,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Capgemini',
    slug: 'capgemini',
    description: 'Capgemini Excellence Drive features Analyst and Senior Analyst roles with game-based aptitude.',
    industry: 'Consulting & Technology Services',
    companySize: '350,000+ employees',
    headquarters: 'Paris, France',
    examsList: ['Capgemini Excellence Drive 2026'],
    aboutCompany: `### About Capgemini\n\nCapgemini is a global leader in consulting, digital transformation, technology and engineering services.`,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_EXAMS: ExamItem[] = [
  {
    id: 'e1',
    companySlug: 'tcs',
    name: 'TCS NQT Placement Papers and Questions 2026',
    badge: 'Official Campus Drive',
    upvotes: 75,
    content: `The latest TCS NQT Test Pattern, questions, and section-wise practice problems are available to help you prepare effectively. Before starting your preparation, we recommend going through each section of the exam. TCS NQT 2026 pattern has been updated, especially the Verbal Ability section, which now includes Sentence Completion, Passage Recall, and Email Writing instead of the previous format. Make sure to check the latest exam pattern and syllabus before beginning your preparation.

Our team has thoroughly researched the latest TCS NQT 2026 exam pattern, previous year papers, and recent candidate experiences to provide accurate and updated study material. Based on our analysis, the exam has a moderate to high difficulty level, and consistent practice in aptitude, reasoning, verbal ability, and coding is essential to perform well.

TCS NQT will use TCS iON platform for their both Rounds, below you will find details:

### Round 1 (Foundation)
* **Total no. of question:** 65 Q's
* **Allotted Time:** 76 Mins
* **Total Sections:** 3 sections (Aptitude, Logical, Verbal)

### Round 2 (Advance)
* **Total no. of question:** 14-16 MCQ and Non-MCQ and 2 Coding Questions
* **Allotted Time:** 115 mins
* **Total Sections:** Advanced Quants + Reasoning = 15 Q's - 20 Mins, Advanced Coding = 2 Q's - 90 Mins

> **IMPORTANT NOTE:**
> * There will be No Negative marking.
> * TCS NQT is Non Adaptive.
> * You will not get any extra rough paper in the exam as a calculator and Rough Paper will be available on your Desktop Screen. You are not allowed to move your eyes down while giving the examination.

1. **Ninja Offer:** ~₹3.36L LPA. Focuses on Foundation Section.
2. **Digital Offer:** ~₹7.00L LPA. Focuses on Advanced Section + Coding.
3. **Prime Offer:** ~₹9.00L LPA. Top performers in Advanced Coding.`,
    oldPapers: `### Previous Year Papers & Memory-Based Questions\n\nBelow are some commonly repeated coding and aptitude questions from previous TCS NQT drives. Use the Document Tabs on the left sidebar to navigate section-wise papers.`,
    paperTabs: [
      {
        id: 'tcs-tab-1',
        title: 'Numerical & Quantitative Reasoning',
        emoji: '📊',
        content: `### Quantitative Aptitude - Memory Based Papers (2025 - 2026)\n\n#### Q1. Train & Platform Crossing\n**Question**: A 160m long train running at a speed of 72 km/hr crosses a platform in 18 seconds. What is the length of the platform?\n\n**Solution & Step-by-Step Breakdown**:\n1. Convert Speed: $72 \\times \\frac{5}{18} = 20 \\text{ m/sec}$\n2. Total Distance: $\\text{Speed} \\times \\text{Time} = 20 \\times 18 = 360 \\text{ metres}$\n3. Length of Platform: $360 - 160 = 200 \\text{ metres}$\n\n**Final Answer**: 200 metres\n\n---\n\n#### Q2. Profit & Loss Percentage\n**Question**: An article is sold at a profit of 20%. If cost price increases by 10% and selling price increases by 20%, find the new profit percentage.\n\n**Final Answer**: 30.9%`,
        children: [
          {
            id: 'tcs-tab-1-1',
            title: 'Time, Speed & Distance',
            emoji: '🚄',
            content: `### Time, Speed & Distance Formula Cheat-sheet\n\n* $\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}$\n* $\\text{km/h to m/s} = \\text{Multiply by } \\frac{5}{18}$\n* $\\text{m/s to km/h} = \\text{Multiply by } \\frac{18}{5}$\n* $\\text{Average Speed} = \\frac{2xy}{x+y} \\text{ (for equal distances)}$`
          },
          {
            id: 'tcs-tab-1-2',
            title: 'Profit & Loss Tricks',
            emoji: '📈',
            content: `### Profit & Loss Key Concepts\n\n* $\\text{Profit \\%} = \\left(\\frac{\\text{Profit}}{\\text{CP}}\\right) \\times 100$\n* $\\text{Loss \\%} = \\left(\\frac{\\text{Loss}}{\\text{CP}}\\right) \\times 100$`
          }
        ]
      },
      {
        id: 'tcs-tab-2',
        title: 'Advanced Technical Coding',
        emoji: '💻',
        content: `### TCS NQT Advanced Coding Questions\n\n#### Problem: Longest Palindromic Substring\nWrite an efficient algorithm to find the longest palindromic substring in a given string.\n\n\`\`\`cpp\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "TCS NQT Advanced Coding" << endl;\n    return 0;\n}\n\`\`\``,
        children: [
          {
            id: 'tcs-tab-2-1',
            title: 'Array Subarray Problems',
            emoji: '🔢',
            content: `### Array Subarray Sum Problems\n\nFind maximum subarray sum using Kadane's Algorithm in $O(N)$ time complexity.`
          }
        ]
      },
      {
        id: 'tcs-tab-3',
        title: 'Verbal & Communication',
        emoji: '🗣️',
        content: `### Verbal Ability Memory Papers\n\n* Sentence Completion & Passage Recall\n* Cloze Test & Vocabulary`
      }
    ]
  }
];

const INITIAL_ROLES: CustomRole[] = [
  {
    id: 'r1',
    companySlug: 'tcs',
    title: 'Ninja Tier Role',
    salaryMin: 336000,
    salaryMax: 400000,
    tierBadge: 'Ninja Offer (Basic)',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    eligibility: 'Clear Foundation Part A (Aptitude, Verbal, Reasoning) + Basic Technical Interview.',
    description: 'Interview tests basic OOPs, DBMS concepts, and final year project dry-runs. Coding is simple loops/arrays.'
  },
  {
    id: 'r2',
    companySlug: 'tcs',
    title: 'Digital Tier Role',
    salaryMin: 700000,
    salaryMax: 750000,
    tierBadge: 'Digital Offer (Medium)',
    badgeColor: 'bg-[#38bdf8]/15 text-[#0284c7] border-[#38bdf8]/40',
    eligibility: 'Score high in Advanced Part B (1st Coding Question) + Technical Interview.',
    description: 'Interview tests Data Structures (Strings, Trees), SQL Joins, and Easy-Medium LeetCode problems.'
  },
  {
    id: 'r3',
    companySlug: 'tcs',
    title: 'Prime Tier Role',
    salaryMin: 900000,
    salaryMax: 1150000,
    tierBadge: 'Prime Offer (Advanced)',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
    eligibility: 'Top 5% percentile in Advanced Part B (Hard Coding Question passed) + System Interview.',
    description: 'Interview tests Dynamic Programming, Graph Algorithms, System Architecture, and Cloud fundamentals.'
  },
  {
    id: 'r4',
    companySlug: 'accenture',
    title: 'Associate Software Engineer (ASE)',
    salaryMin: 450000,
    salaryMax: 500000,
    tierBadge: 'ASE Standard Role',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    eligibility: 'Clear Cognitive & Pseudocode Round + Technical Discussion.',
    description: 'Pseudocode and fundamentals focused interview.'
  },
  {
    id: 'r5',
    companySlug: 'accenture',
    title: 'Advanced ASE (AAEA)',
    salaryMin: 650000,
    salaryMax: 700000,
    tierBadge: 'AAEA Advanced Role',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
    eligibility: 'Clear Coding Section + Hands-on System Architecture Interview.',
    description: 'Tests hands-on coding and advanced algorithms.'
  }
];

const INITIAL_PAPERS: CustomPaper[] = [
  { id: 'p1', companySlug: 'tcs', title: 'TCS NQT Official Memory Paper 2026 (Part A & B)', questions: 90, duration: '165 mins' },
  { id: 'p2', companySlug: 'tcs', title: 'TCS Pseudocode & Technical MCQs Set 1', questions: 45, duration: '60 mins' },
  { id: 'p3', companySlug: 'accenture', title: 'Accenture Cognitive & Pseudocode Solved Paper 2026', questions: 90, duration: '90 mins' },
];

const INITIAL_TOPICS: CustomTopic[] = [
  { id: 't1', companySlug: 'tcs', name: 'Quantitative Aptitude', count: 120 },
  { id: 't2', companySlug: 'tcs', name: 'Logical Reasoning', count: 95 },
  { id: 't3', companySlug: 'tcs', name: 'Pseudocode Dry-Runs', count: 45 },
  { id: 't4', companySlug: 'accenture', name: 'Pseudocode & Bitwise Operators', count: 75 },
  { id: 't5', companySlug: 'accenture', name: 'MS Office & CS Core Fundamentals', count: 50 },
];

const INITIAL_ROUNDS: CustomRound[] = [
  { id: 'rd1', companySlug: 'tcs', roundNumber: 1, title: 'Part A: Foundation Section', durationMinutes: 75, description: 'Numerical, Verbal, and Reasoning Ability.', tips: 'Focus on time management in numerical ability.' },
  { id: 'rd2', companySlug: 'tcs', roundNumber: 2, title: 'Part B: Advanced Section & Coding', durationMinutes: 90, description: 'Advanced Reasoning and 2 Hands-on Coding questions.', tips: 'Solving 1 coding problem guarantees Digital evaluation.' },
  { id: 'rd3', companySlug: 'accenture', roundNumber: 1, title: 'Cognitive & Pseudocode Assessment', durationMinutes: 90, description: '90 Questions testing logical, pseudocode, and networking.', tips: 'Pseudocode dry-runs carry high weightage.' },
];



const INITIAL_TOPIC_QUESTIONS: TopicQuestionItem[] = [
  {
    id: 'hd-1',
    topicId: 'height-and-distance',
    questionNumber: 1,
    statement: 'Two ships are sailing in the sea on the two sides of a lighthouse. The angle of elevation of the top of the lighthouse is observed from the ships are 30° and 45° respectively. If the lighthouse is 100 m high, the distance between the two ships is:',
    options: [
      { key: 'A', text: '173 m' },
      { key: 'B', text: '200 m' },
      { key: 'C', text: '273 m' },
      { key: 'D', text: '300 m' },
    ],
    correctAnswer: 'C',
    explanation: 'Let AB be the lighthouse of height 100 m. Let C and D be the positions of the two ships on opposite sides.\nIn ΔABC, tan(45°) = AB / BC => 1 = 100 / BC => BC = 100 m.\nIn ΔABD, tan(30°) = AB / BD => 1/√3 = 100 / BD => BD = 100√3 = 100 × 1.732 = 173.2 m.\nTotal distance between ships CD = BC + BD = 100 + 173.2 = 273.2 m ≈ 273 m.',
    formulasUsed: ['tan(θ) = Opposite / Adjacent', 'tan(30°) = 1/√3 ≈ 0.577', 'tan(45°) = 1'],
    difficulty: 'MEDIUM',
    isHidden: false,
  },
  {
    id: 'hd-2',
    topicId: 'height-and-distance',
    questionNumber: 2,
    statement: 'A man standing at a point P is watching the top of a tower, which makes an angle of elevation of 30° with the man\'s eye. The man walks some distance towards the tower to watch its top and the angle of elevation becomes 60°. What is the distance between the base of the tower and the point P?',
    options: [
      { key: 'A', text: '4√3 units' },
      { key: 'B', text: '8 units' },
      { key: 'C', text: '12 units' },
      { key: 'D', text: 'Data inadequate' },
      { key: 'E', text: 'None of these' },
    ],
    correctAnswer: 'D',
    explanation: 'Since the height of the tower is not given, nor is the actual distance walked by the man specified, we cannot determine the exact numeric distance between the base of the tower and point P. Therefore, the data provided is inadequate.',
    formulasUsed: ['tan(θ) = Height / Distance'],
    difficulty: 'HARD',
    isHidden: false,
  },
  {
    id: 'hd-3',
    topicId: 'height-and-distance',
    questionNumber: 3,
    statement: 'From a point P on level ground, the angle of elevation of the top of a tower is 30°. If the tower is 100 m high, the distance of point P from the foot of the tower is:',
    options: [
      { key: 'A', text: '149 m' },
      { key: 'B', text: '156 m' },
      { key: 'C', text: '173 m' },
      { key: 'D', text: '200 m' },
    ],
    correctAnswer: 'C',
    explanation: 'Let AB be the height of the tower = 100 m.\nLet P be the point on the ground at distance d from the foot of the tower.\ntan(30°) = AB / d => 1/√3 = 100 / d => d = 100√3 = 100 × 1.732 = 173.2 m ≈ 173 m.',
    formulasUsed: ['tan(30°) = 1/√3 = 1.732'],
    difficulty: 'EASY',
    isHidden: false,
  },
  {
    id: 'pt-1',
    topicId: 'problems-on-trains',
    questionNumber: 1,
    statement: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    options: [
      { key: 'A', text: '65 sec' },
      { key: 'B', text: '89 sec' },
      { key: 'C', text: '100 sec' },
      { key: 'D', text: '150 sec' },
    ],
    correctAnswer: 'B',
    explanation: 'Speed of train = Length of train / Time = 240 / 24 = 10 m/s.\nTotal distance to cross platform = Length of train + Length of platform = 240 + 650 = 890 m.\nTime required = Total distance / Speed = 890 / 10 = 89 seconds.',
    formulasUsed: ['Speed = Distance / Time', 'Time = (Train Length + Platform Length) / Speed'],
    difficulty: 'EASY',
    isHidden: false,
  },
  {
    id: 'pt-2',
    topicId: 'problems-on-trains',
    questionNumber: 2,
    statement: 'Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. The ratio of their speeds is:',
    options: [
      { key: 'A', text: '1 : 3' },
      { key: 'B', text: '3 : 2' },
      { key: 'C', text: '3 : 4' },
      { key: 'D', text: 'None of these' },
    ],
    correctAnswer: 'B',
    explanation: 'Let speeds of the two trains be u and v m/s.\nLength of first train = 27u, Length of second train = 17v.\nTime taken to cross each other = (27u + 17v) / (u + v) = 23.\n=> 27u + 17v = 23u + 23v\n=> 4u = 6v => u / v = 6 / 4 = 3 / 2.',
    formulasUsed: ['Relative Speed (opposite) = u + v', 'Length = Speed × Time'],
    difficulty: 'MEDIUM',
    isHidden: false,
  },
  {
    id: 'pt-3',
    topicId: 'problems-on-trains',
    questionNumber: 3,
    statement: 'A train running at 54 km/hr crosses a pole in 12 seconds. What is the length of the train?',
    options: [
      { key: 'A', text: '150 metres' },
      { key: 'B', text: '180 metres' },
      { key: 'C', text: '200 metres' },
      { key: 'D', text: '240 metres' }
    ],
    correctAnswer: 'B',
    explanation: 'Given:\n• Speed = 54 km/hr\n• Time = 12 seconds\n\nSteps:\n1. Convert speed into m/sec: 54 × 5/18 = 15 m/sec\n2. Apply Length = Speed × Time: 15 × 12 = 180 metres\n\nFinal Answer: 180 metres',
    structuredExplanation: {
      given: ['Speed = 54 km/hr', 'Time = 12 seconds'],
      steps: [
        { title: 'Convert speed into m/sec', formula: '54 × 5/18 = 15 m/sec' },
        { title: 'Apply Length = Speed × Time', formula: '15 × 12 = 180 metres' }
      ],
      formulaUsed: ['Length = Speed × Time'],
      finalAnswer: '180 metres'
    },
    formulasUsed: ['Length = Speed × Time'],
    difficulty: 'EASY',
    isHidden: false,
  },
  {
    id: 'pt-4',
    topicId: 'problems-on-trains',
    questionNumber: 4,
    statement: 'A train travels at 72 km/hr and crosses a pole in 8 seconds. Find its length.',
    options: [
      { key: 'A', text: '120 metres' },
      { key: 'B', text: '140 metres' },
      { key: 'C', text: '160 metres' },
      { key: 'D', text: '180 metres' }
    ],
    correctAnswer: 'C',
    explanation: 'Given:\n• Speed = 72 km/hr\n• Time = 8 seconds\n\nSteps:\n1. Convert speed: 72 × 5/18 = 20 m/sec\n2. Length: 20 × 8 = 160 metres\n\nFinal Answer: 160 metres',
    structuredExplanation: {
      given: ['Speed = 72 km/hr', 'Time = 8 seconds'],
      steps: [
        { title: 'Convert speed', formula: '72 × 5/18 = 20 m/sec' },
        { title: 'Length', formula: '20 × 8 = 160 metres' }
      ],
      formulaUsed: ['Length = Speed × Time'],
      finalAnswer: '160 metres'
    },
    formulasUsed: ['Length = Speed × Time'],
    difficulty: 'EASY',
    isHidden: false,
  }
];

const INITIAL_EXPERIENCES: ExperienceItem[] = [];

class DataStoreManager {
  constructor() {
    this.initRealtimeSync();
  }

  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      const serialized = stringify(value);
      if (localStorage.getItem(key) === serialized) {
        return; // Identical data, skip disk write and broadcast
      }
      localStorage.setItem(key, serialized);
      this.notifySync(key);
    } catch (e) {
      console.error(`[DataStore] Failed to write key '${key}' to localStorage:`, e);
    }
  }

  private notifySync(key: string): void {
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('prepunite_datastore_updated', { detail: { key } }));
      } catch {}
    }
  }

  // --- SUPABASE REALTIME & DATABASE PERSISTENCE ENGINE ---
  async syncCompanyToSupabase(company: CompanyItem): Promise<void> {
    try {
      const { error } = await supabase.from('companies').upsert({
        id: company.id,
        name: company.name,
        slug: company.slug,
        industry: company.industry,
        company_size: company.companySize,
        headquarters: company.headquarters,
        description: company.description,
        about_company: company.aboutCompany,
        logo_url: company.logoUrl,
        website_url: company.website,
        is_deleted: false,
      }, { onConflict: 'slug' });
      if (error) {
        console.error('[dataStore] Supabase company sync error:', error);
      }
    } catch (err) {
      console.error('[dataStore] Supabase company sync exception:', err);
    }
  }

  async syncExamToSupabase(exam: ExamItem): Promise<void> {
    try {
      const { error } = await supabase.from('exams').upsert({
        id: exam.id,
        company_slug: exam.companySlug,
        name: exam.name,
        badge: exam.badge,
        content: exam.content,
        old_papers: exam.oldPapers,
        paper_tabs: exam.paperTabs || [],
        google_doc_embed_url: exam.googleDocEmbedUrl,
        google_doc_edit_url: exam.googleDocEditUrl,
        price: exam.price || 99,
        is_public_exam: exam.isPublicExam ?? false,
      });
      if (error) {
        console.error('[dataStore] Supabase exam sync error:', error);
      }
    } catch (err) {
      console.error('[dataStore] Supabase exam sync exception:', err);
    }
  }

  async syncTopicQuestionToSupabase(q: TopicQuestionItem): Promise<void> {
    try {
      const letterToIdx: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
      const ca = String(q.correctAnswer || 'A').trim().toUpperCase();
      const correctAnswerInt = isNaN(Number(ca)) ? (letterToIdx[ca] ?? 0) : Number(ca);

      await supabase.from('topic_questions').upsert({
        id: q.id,
        topic_id: q.topicId,
        company_slug: (q as any).companySlug || (q as any).company || 'general',
        statement: q.statement,
        options: q.options,
        correct_answer: correctAnswerInt,
        explanation: q.explanation,
        structured_explanation: q.structuredExplanation,
        difficulty: q.difficulty,
        difficulty_level: q.difficultyLevel,
        is_hidden: q.isHidden,
        question_number: q.questionNumber,
      });
    } catch (err) {
      console.warn('[dataStore] Supabase topic question sync error:', err);
    }
  }

  async syncExperienceToSupabase(exp: ExperienceItem): Promise<void> {
    try {
      await supabase.from('experiences').upsert({
        id: exp.id,
        company_slug: (exp.companyName || 'tcs').toLowerCase(),
        student_name: exp.studentName,
        role_title: exp.role,
        result: exp.verdict,
        rounds: exp.rounds,
        status: exp.status || 'PENDING',
      });
    } catch (err) {
      console.warn('[dataStore] Supabase experience sync error:', err);
    }
  }

  initRealtimeSync(): void {
    try {
      if (typeof window === 'undefined') return;

      // Subscribe to Realtime DB updates
      supabase
        .channel('public_realtime_data')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => {
          this.fetchLiveCompaniesFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'exams' }, () => {
          this.fetchLiveExamsFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'topic_questions' }, () => {
          this.fetchLiveTopicQuestionsFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'experiences' }, () => {
          this.fetchLiveExperiencesFromSupabase();
        })
        .subscribe();

      // Initial Fetch
      this.fetchLiveCompaniesFromSupabase();
      this.fetchLiveExamsFromSupabase();
      this.fetchLiveTopicQuestionsFromSupabase();
      this.fetchLiveExperiencesFromSupabase();
    } catch (err) {
      console.warn('[dataStore] Realtime sync init notice:', err);
    }
  }

  async fetchLiveCompaniesFromSupabase(): Promise<void> {
    try {
      const { data } = await supabase.from('companies').select('*');
      if (data && data.length > 0) {
        const mapped: CompanyItem[] = data.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          industry: c.industry || 'IT Services',
          companySize: '500,000+ employees',
          headquarters: c.headquarters || 'India',
          website: c.website_url,
          logoUrl: c.logo_url,
          description: c.description || '',
          isActive: true,
          createdAt: c.created_at || new Date().toISOString(),
        }));
        const existing = this.getStorage<CompanyItem[]>('prepunite_companies', INITIAL_COMPANIES);
        const idSet = new Set(mapped.map(m => m.id));
        const slugSet = new Set(mapped.map(m => m.slug));
        const merged = [...mapped];
        existing.forEach(ex => {
          if (!idSet.has(ex.id) && !slugSet.has(ex.slug)) {
            merged.push(ex);
            idSet.add(ex.id);
            slugSet.add(ex.slug);
          }
        });
        this.setStorage('prepunite_companies', merged);
      }
    } catch {}
  }

  async fetchLiveExamsFromSupabase(): Promise<void> {
    try {
      const { data } = await supabase.from('exams').select('*').eq('is_deleted', false);
      if (data && data.length > 0) {
        const mapped: ExamItem[] = data.map(e => ({
          id: e.id,
          companySlug: e.company_slug,
          name: e.name,
          badge: e.badge || 'Campus Recruitment Drive',
          upvotes: e.upvotes || 0,
          content: e.content || '',
          oldPapers: e.old_papers || '',
          price: e.price || 99,
          paperTabs: typeof e.paper_tabs === 'string' ? JSON.parse(e.paper_tabs) : (e.paper_tabs || []),
          isPublicExam: e.is_public_exam ?? false,
        }));
        const existing = this.getStorage<ExamItem[]>('prepunite_exams', INITIAL_EXAMS);
        const idSet = new Set(mapped.map(m => m.id));
        const merged = [...mapped];
        existing.forEach(ex => {
          if (!idSet.has(ex.id)) {
            merged.push(ex);
            idSet.add(ex.id);
          }
        });
        this.setStorage('prepunite_exams', merged);
      }
    } catch {}
  }

  async fetchLiveTopicQuestionsFromSupabase(): Promise<void> {
    try {
      const { data } = await supabase
        .from('topic_questions')
        .select('*')
        .order('question_number', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true })
        .limit(100);
      if (data && data.length > 0) {
        const mapped: TopicQuestionItem[] = data.map(q => {
          const rawCorrect = q.correct_answer;
          const resolvedLetter = typeof rawCorrect === 'number'
            ? (['A', 'B', 'C', 'D', 'E'][rawCorrect] || 'A')
            : (['0', '1', '2', '3', '4'].includes(String(rawCorrect))
                ? (['A', 'B', 'C', 'D', 'E'][Number(rawCorrect)] || 'A')
                : (String(rawCorrect || 'A').toUpperCase()));

          return {
            id: q.id,
            topicId: q.topic_id,
            statement: q.statement,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
            correctAnswer: resolvedLetter,
            explanation: q.explanation,
            structuredExplanation: typeof q.structured_explanation === 'string' ? JSON.parse(q.structured_explanation) : q.structured_explanation,
            difficulty: q.difficulty || 'MEDIUM',
            difficultyLevel: q.difficulty_level || 2,
            isHidden: q.is_hidden || false,
            questionNumber: q.question_number,
            createdAt: q.created_at,
          };
        });
        const existing = this.getStorage<TopicQuestionItem[]>('prepunite_topic_questions', INITIAL_TOPIC_QUESTIONS);
        const idSet = new Set(mapped.map(m => m.id));
        const merged = [...mapped];
        existing.forEach(ex => {
          if (!idSet.has(ex.id)) {
            merged.push(ex);
            idSet.add(ex.id);
          }
        });
        merged.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0) || (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()));
        this.setStorage('prepunite_topic_questions', merged);
      }
    } catch {}
  }

  async fetchLiveExperiencesFromSupabase(): Promise<void> {
    try {
      const { data } = await supabase.from('experiences').select('*');
      if (data && data.length > 0) {
        const mapped: ExperienceItem[] = data.map(e => ({
          id: e.id,
          companyName: e.company_slug.toUpperCase(),
          companySlug: e.company_slug,
          role: e.role_title,
          roleTitle: e.role_title,
          studentName: e.student_name,
          college: 'Engineering College',
          year: 2026,
          difficulty: 'MEDIUM',
          verdict: e.result as any,
          result: e.result,
          rounds: typeof e.rounds === 'string' ? JSON.parse(e.rounds) : e.rounds,
          overallExperience: e.overall_experience,
          tips: e.tips,
          status: e.status || 'PENDING',
        }));
        this.setStorage('prepunite_experiences', mapped);
      }
    } catch {}
  }

  // --- COMPANIES ---
  getCompanies(): CompanyItem[] {
    const list = this.getStorage<CompanyItem[]>('prepunite_companies', INITIAL_COMPANIES);
    return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));
  }

  addCompany(company: Partial<CompanyItem>): CompanyItem {
    const companies = this.getCompanies();
    const slug = company.slug || company.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'new-company';
    const newCompany: CompanyItem = {
      id: company.id || `c-${Date.now()}`,
      name: company.name || 'New Company',
      slug,
      description: company.description || 'Recruitment drive overview',
      industry: company.industry || 'IT Services',
      companySize: company.companySize || 'Campus Recruitment Drive',
      headquarters: company.headquarters || 'Pan-India',
      website: company.website,
      logoUrl: company.logoUrl,
      examsList: company.examsList || [company.name ? `${company.name} Placement Drive 2026` : 'Campus Drive'],
      aboutCompany: company.aboutCompany,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    const existingIdx = companies.findIndex(c => c.id === newCompany.id || c.slug === slug);
    let updated: CompanyItem[];
    if (existingIdx > -1) {
      updated = [...companies];
      updated[existingIdx] = { ...updated[existingIdx], ...newCompany };
    } else {
      updated = [...companies, newCompany];
    }
    this.setStorage('prepunite_companies', updated);
    this.syncCompanyToSupabase(newCompany);
    return newCompany;
  }

  updateCompany(idOrSlug: string, updatedFields: Partial<CompanyItem>): void {
    const companies = this.getCompanies();
    const index = companies.findIndex(c => c.id === idOrSlug || c.slug === idOrSlug);
    if (index > -1) {
      companies[index] = { ...companies[index], ...updatedFields };
      this.setStorage('prepunite_companies', companies);
      this.syncCompanyToSupabase(companies[index]);
    } else {
      const existing = companies.find(c => c.slug === idOrSlug || c.id === idOrSlug) || {
        id: idOrSlug,
        name: updatedFields.name || idOrSlug.toUpperCase(),
        slug: updatedFields.slug || idOrSlug.toLowerCase(),
        description: updatedFields.description || '',
        industry: 'IT Services & Consulting',
        companySize: 'Pan-India',
        headquarters: 'India',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      this.setStorage('prepunite_companies', [...companies, { ...existing, ...updatedFields }]);
    }
  }

  deleteCompany(id: string): void {
    const companies = this.getCompanies().filter(c => c.id !== id && c.slug !== id);
    this.setStorage('prepunite_companies', companies);
  }

  // --- EXAMS (Full Text Overview per Exam) ---
  getExams(companySlug: string): ExamItem[] {
    const all = this.getStorage<ExamItem[]>('prepunite_exams', INITIAL_EXAMS);
    const filtered = all.filter(e => e.companySlug === companySlug);
    
    let res: ExamItem[] = [];
    if (filtered.length === 0) {
      const company = this.getCompanies().find(c => c.slug === companySlug);
      if (company && company.examsList && company.examsList.length > 0) {
        res = company.examsList.map((examName, idx) => ({
          id: `e-def-${companySlug}-${idx}`,
          companySlug,
          name: examName,
          badge: 'Recruitment Drive',
          upvotes: 10,
          content: `### ${examName} Overview\n\nAdd your complete exam syllabus, pattern, and role details here as markdown text.`,
          oldPapers: `### Old Papers\n\nLink your live Google Doc to show old papers and syllabus.`
        }));
      } else {
        res = [{
          id: `e-def-${companySlug}`,
          companySlug,
          name: `${companySlug.toUpperCase()} Campus Drive`,
          badge: 'Recruitment Drive',
          upvotes: 10,
          content: `### Exam Overview\n\nAdd your complete exam syllabus, pattern, and role details here as markdown text.`,
          oldPapers: `### Old Papers\n\nLink your live Google Doc to show old papers and syllabus.`
        }];
      }
    } else {
      res = filtered;
    }
    return res.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));
  }

  getAllExams(): ExamWithCompany[] {
    const companies = this.getCompanies();
    const result: ExamWithCompany[] = [];

    companies.forEach(company => {
      const exams = this.getExams(company.slug);
      exams.forEach(exam => {
        result.push({
          ...exam,
          companyName: company.name,
          companyLogoUrl: company.logoUrl,
          companyIndustry: company.industry || 'IT Services & Consulting',
        });
      });
    });

    return result.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));
  }

  addExam(exam: Partial<ExamItem>): ExamItem {
    const list = this.getStorage<ExamItem[]>('prepunite_exams', INITIAL_EXAMS);
    const companySlug = exam.companySlug || 'tcs';
    
    const currentCompanyExams = this.getExams(companySlug);
    const virtualExamsToPersist = currentCompanyExams.filter(e => !list.find(l => l.id === e.id));

    const newExam: ExamItem = {
      id: exam.id || `e-${Date.now()}`,
      companySlug,
      name: exam.name || 'New Exam Module',
      badge: exam.badge || 'Drive',
      content: exam.content || '### New Exam Syllabus\n\nWrite details here...',
      oldPapers: exam.oldPapers || '### Old Papers\n\nWrite old papers here...',
      upvotes: exam.upvotes || 0,
    };
    
    const existingIdx = list.findIndex(l => l.id === newExam.id);
    let updated: ExamItem[];
    if (existingIdx > -1) {
      updated = [...list];
      updated[existingIdx] = { ...updated[existingIdx], ...newExam };
    } else {
      updated = [...list, ...virtualExamsToPersist, newExam];
    }
    this.setStorage('prepunite_exams', updated);
    this.syncExamToSupabase(newExam);
    return newExam;
  }

  updateExam(id: string, updatedFields: Partial<ExamItem>): void {
    const stored = this.getStorage<ExamItem[]>('prepunite_exams', INITIAL_EXAMS);
    const index = stored.findIndex(e => e.id === id);
    if (index > -1) {
      stored[index] = { ...stored[index], ...updatedFields };
      this.setStorage('prepunite_exams', stored);
      this.syncExamToSupabase(stored[index]);
    } else {
      const allExams = this.getAllExams();
      const existingVirtual = allExams.find(e => e.id === id);
      const baseExam: ExamItem = existingVirtual ? {
        id: existingVirtual.id,
        companySlug: existingVirtual.companySlug,
        name: existingVirtual.name,
        badge: existingVirtual.badge,
        content: existingVirtual.content,
        oldPapers: existingVirtual.oldPapers,
        paperTabs: existingVirtual.paperTabs,
        googleDocEmbedUrl: existingVirtual.googleDocEmbedUrl,
        googleDocEditUrl: existingVirtual.googleDocEditUrl,
        upvotes: existingVirtual.upvotes || 0,
      } : {
        id,
        companySlug: updatedFields.companySlug || 'tcs',
        name: updatedFields.name || 'Exam Module',
        badge: updatedFields.badge || 'Drive',
        content: updatedFields.content || '',
        oldPapers: updatedFields.oldPapers || '',
        upvotes: updatedFields.upvotes || 0,
      };
      this.setStorage('prepunite_exams', [...stored, { ...baseExam, ...updatedFields }]);
    }
  }

  deleteExam(id: string): void {
    const all = this.getStorage<ExamItem[]>('prepunite_exams', INITIAL_EXAMS);
    const updated = all.filter(e => e.id !== id);
    this.setStorage('prepunite_exams', updated);
  }

  // --- ROLES BY COMPANY SLUG ---
  getRoles(companySlug: string = 'tcs'): CustomRole[] {
    const all = this.getStorage<CustomRole[]>('prepunite_roles', INITIAL_ROLES);
    const filtered = all.filter(r => r.companySlug === companySlug);
    if (filtered.length > 0) return filtered;
    return [
      {
        id: `r-default-1-${companySlug}`,
        companySlug,
        title: 'Standard Tier Role',
        salaryMin: 450000,
        salaryMax: 650000,
        tierBadge: 'Standard Role',
        badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
        eligibility: 'Pass Aptitude & Technical Assessment',
        description: 'Interview tests core fundamentals and project dry-runs.'
      }
    ];
  }

  addRole(role: CustomRole): void {
    const list = [role, ...this.getStorage<CustomRole[]>('prepunite_roles', INITIAL_ROLES)];
    this.setStorage('prepunite_roles', list);
  }

  updateRole(id: string, updatedRole: Partial<CustomRole>): void {
    const all = this.getStorage<CustomRole[]>('prepunite_roles', INITIAL_ROLES);
    const list = all.map(r => r.id === id ? { ...r, ...updatedRole } : r);
    this.setStorage('prepunite_roles', list);
  }

  deleteRole(id: string): void {
    const all = this.getStorage<CustomRole[]>('prepunite_roles', INITIAL_ROLES);
    const list = all.filter(r => r.id !== id);
    this.setStorage('prepunite_roles', list);
  }

  // --- PAPERS BY COMPANY SLUG ---
  getPapers(companySlug: string = 'tcs'): CustomPaper[] {
    const all = this.getStorage<CustomPaper[]>('prepunite_papers', INITIAL_PAPERS);
    const filtered = all.filter(p => p.companySlug === companySlug);
    const res = filtered.length > 0 ? filtered : [
      { id: `p-default-${companySlug}`, companySlug, title: `${companySlug.toUpperCase()} Placement Memory Paper 2026`, questions: 50, duration: '60 mins' }
    ];
    return res.sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' }));
  }

  addPaper(paper: CustomPaper): void {
    const list = [paper, ...this.getStorage<CustomPaper[]>('prepunite_papers', INITIAL_PAPERS)];
    this.setStorage('prepunite_papers', list);
  }

  updatePaper(id: string, updatedPaper: Partial<CustomPaper>): void {
    const all = this.getStorage<CustomPaper[]>('prepunite_papers', INITIAL_PAPERS);
    const list = all.map(p => p.id === id ? { ...p, ...updatedPaper } : p);
    this.setStorage('prepunite_papers', list);
  }

  deletePaper(id: string): void {
    const all = this.getStorage<CustomPaper[]>('prepunite_papers', INITIAL_PAPERS);
    const list = all.filter(p => p.id !== id);
    this.setStorage('prepunite_papers', list);
  }

  // --- TOPICS BY COMPANY SLUG ---
  getTopics(companySlug: string = 'tcs'): CustomTopic[] {
    const all = this.getStorage<CustomTopic[]>('prepunite_topics', INITIAL_TOPICS);
    const filtered = all.filter(t => t.companySlug === companySlug);
    const res = filtered.length > 0 ? filtered : [
      { id: `t-default-1-${companySlug}`, companySlug, name: 'Aptitude & Logical', count: 60 },
      { id: `t-default-2-${companySlug}`, companySlug, name: 'Technical Fundamentals', count: 40 }
    ];
    return res.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));
  }

  addTopic(topic: CustomTopic): void {
    const list = [topic, ...this.getStorage<CustomTopic[]>('prepunite_topics', INITIAL_TOPICS)];
    this.setStorage('prepunite_topics', list);
  }

  updateTopic(id: string, updatedTopic: Partial<CustomTopic>): void {
    const all = this.getStorage<CustomTopic[]>('prepunite_topics', INITIAL_TOPICS);
    const list = all.map(t => t.id === id ? { ...t, ...updatedTopic } : t);
    this.setStorage('prepunite_topics', list);
  }

  deleteTopic(id: string): void {
    const all = this.getStorage<CustomTopic[]>('prepunite_topics', INITIAL_TOPICS);
    const list = all.filter(t => t.id !== id);
    this.setStorage('prepunite_topics', list);
  }

  // --- ROUNDS BY COMPANY SLUG ---
  getRounds(companySlug: string = 'tcs'): CustomRound[] {
    const all = this.getStorage<CustomRound[]>('prepunite_rounds', INITIAL_ROUNDS);
    const filtered = all.filter(rd => rd.companySlug === companySlug);
    if (filtered.length > 0) return filtered;
    return [
      { id: `rd-default-1-${companySlug}`, companySlug, roundNumber: 1, title: 'Online Assessment', durationMinutes: 90, description: 'Cognitive & Technical Assessment', tips: 'Manage your time effectively.' },
      { id: `rd-default-2-${companySlug}`, companySlug, roundNumber: 2, title: 'Technical Interview', durationMinutes: 45, description: 'Project defense and live coding', tips: 'Dry run your code solutions.' }
    ];
  }

  addRound(round: CustomRound): void {
    const list = [...this.getStorage<CustomRound[]>('prepunite_rounds', INITIAL_ROUNDS), round];
    this.setStorage('prepunite_rounds', list);
  }

  updateRound(id: string, updatedRound: Partial<CustomRound>): void {
    const all = this.getStorage<CustomRound[]>('prepunite_rounds', INITIAL_ROUNDS);
    const list = all.map(rd => rd.id === id ? { ...rd, ...updatedRound } : rd);
    this.setStorage('prepunite_rounds', list);
  }

  deleteRound(id: string): void {
    const all = this.getStorage<CustomRound[]>('prepunite_rounds', INITIAL_ROUNDS);
    const list = all.filter(rd => rd.id !== id);
    this.setStorage('prepunite_rounds', list);
  }

  // --- QUESTIONS (Full CRUD) ---
  getQuestions(): QuestionItem[] {
    return this.getStorage<QuestionItem[]>('prepunite_questions', []);
  }

  addQuestion(question: Partial<QuestionItem>): QuestionItem {
    const questions = this.getQuestions();
    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      title: question.title || 'New OA Question',
      companySlug: question.companySlug || 'tcs',
      companyName: question.companyName || 'TCS NQT',
      role: question.role || 'Full-Time',
      year: question.year || 2026,
      category: question.category || 'CODING',
      difficulty: question.difficulty || 'MEDIUM',
      problemStatement: question.problemStatement || 'Problem description',
      inputFormat: question.inputFormat,
      outputFormat: question.outputFormat,
      sampleInput: question.sampleInput,
      sampleOutput: question.sampleOutput,
      explanation: question.explanation,
    };
    const updated = [newQ, ...questions];
    this.setStorage('prepunite_questions', updated);
    return newQ;
  }

  updateQuestion(id: string, updatedQ: Partial<QuestionItem>): void {
    const all = this.getQuestions().map(q => q.id === id ? { ...q, ...updatedQ } : q);
    this.setStorage('prepunite_questions', all);
  }

  deleteQuestion(id: string): void {
    const all = this.getQuestions().filter(q => q.id !== id);
    this.setStorage('prepunite_questions', all);
  }



  // --- EXPERIENCES (Full CRUD) ---
  getExperiences(): ExperienceItem[] {
    const list = this.getStorage<ExperienceItem[]>('prepunite_experiences', INITIAL_EXPERIENCES);
    const cleaned = list.filter(e => 
      !['exp-1', 'exp-2', 'exp-3', 'exp-4'].includes(e.id) &&
      !['Rahul Sharma', 'Priya Verma', 'Aniket Gupta', 'Sneha Reddy', 'Super Admin'].includes(e.studentName)
    );
    if (cleaned.length !== list.length) {
      this.setStorage('prepunite_experiences', cleaned);
    }
    return cleaned;
  }

  addExperience(exp: Partial<ExperienceItem>): ExperienceItem {
    const list = this.getExperiences();
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      companyName: exp.companyName || 'TCS',
      role: exp.role || 'Software Engineer',
      studentName: exp.studentName || 'Anonymous Student',
      college: exp.college || 'NIT/IIT Campus',
      year: exp.year || 2026,
      difficulty: exp.difficulty || 'MEDIUM',
      verdict: exp.verdict || 'SELECTED',
      rounds: exp.rounds || [{ roundTitle: 'Online Assessment', details: 'Appeared in online assessment round.' }],
      status: exp.status || 'PENDING',
    };
    const updated = [newExp, ...list];
    this.setStorage('prepunite_experiences', updated);
    this.syncExperienceToSupabase(newExp);
    return newExp;
  }

  updateExperienceStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): void {
    const experiences = this.getExperiences();
    const target = experiences.find(e => e.id === id);
    if (target) {
      target.status = status;
      this.setStorage('prepunite_experiences', experiences);
      this.syncExperienceToSupabase(target);
    }
  }

  updateExperience(id: string, updatedExp: Partial<ExperienceItem>): void {
    const experiences = this.getExperiences();
    const index = experiences.findIndex(e => e.id === id);
    if (index > -1) {
      experiences[index] = { ...experiences[index], ...updatedExp };
      this.setStorage('prepunite_experiences', experiences);
      this.syncExperienceToSupabase(experiences[index]);
    }
  }

  deleteExperience(id: string): void {
    const all = this.getExperiences().filter(e => e.id !== id);
    this.setStorage('prepunite_experiences', all);
    supabase.from('experiences').delete().eq('id', id).then();
  }



  // --- BOOKMARKS (DATABASE-BACKED WITH LOCAL CACHE) ---
  private syncBookmarksTimeout: any = null;

  async syncBookmarksWithSupabase(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const questions = this.getBookmarkedQuestionIds();
      const exams = this.getBookmarkedExamIds();
      const experiences = this.getBookmarkedExperienceIds();

      if (this.syncBookmarksTimeout) clearTimeout(this.syncBookmarksTimeout);
      this.syncBookmarksTimeout = setTimeout(async () => {
        try {
          await supabase.auth.updateUser({
            data: {
              bookmarked_questions: questions,
              bookmarked_exams: exams,
              bookmarked_experiences: experiences,
            },
          });
        } catch (e) {
          console.warn('[dataStore] Supabase bookmarks sync notice:', e);
        }
      }, 400);
    } catch (err) {
      console.warn('[dataStore] Failed to check auth session for bookmark sync:', err);
    }
  }

  async hydrateBookmarksFromSupabase(userMetadata?: any): Promise<{ questions: string[]; exams: string[]; experiences: string[] }> {
    try {
      let meta = userMetadata;
      if (!meta) {
        const { data: { session } } = await supabase.auth.getSession();
        meta = session?.user?.user_metadata;
      }

      if (!meta) {
        return {
          questions: this.getBookmarkedQuestionIds(),
          exams: this.getBookmarkedExamIds(),
          experiences: this.getBookmarkedExperienceIds(),
        };
      }

      const remoteQuestions: string[] = Array.isArray(meta.bookmarked_questions) ? meta.bookmarked_questions : [];
      const remoteExams: string[] = Array.isArray(meta.bookmarked_exams) ? meta.bookmarked_exams : [];
      const remoteExps: string[] = Array.isArray(meta.bookmarked_experiences) ? meta.bookmarked_experiences : [];

      const localQuestions = this.getBookmarkedQuestionIds();
      const localExams = this.getBookmarkedExamIds();
      const localExps = this.getBookmarkedExperienceIds();

      // Union: preserve any items saved locally + all items saved in Supabase
      const mergedQuestions = Array.from(new Set([...localQuestions, ...remoteQuestions]));
      const mergedExams = Array.from(new Set([...localExams, ...remoteExams]));
      const mergedExps = Array.from(new Set([...localExps, ...remoteExps]));

      const hasChanged = (
        mergedQuestions.length !== localQuestions.length ||
        mergedExams.length !== localExams.length ||
        mergedExps.length !== localExps.length
      );

      if (hasChanged) {
        this.setStorage('prepunite_bookmarked_questions', mergedQuestions);
        this.setStorage('prepunite_bookmarked_exams', mergedExams);
        this.setStorage('prepunite_bookmarked_experiences', mergedExps);

        if (
          mergedQuestions.length !== remoteQuestions.length ||
          mergedExams.length !== remoteExams.length ||
          mergedExps.length !== remoteExps.length
        ) {
          this.syncBookmarksWithSupabase();
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
        }
      }

      return {
        questions: mergedQuestions,
        exams: mergedExams,
        experiences: mergedExps,
      };
    } catch (e) {
      console.warn('[dataStore] Hydrate bookmarks notice:', e);
      return {
        questions: this.getBookmarkedQuestionIds(),
        exams: this.getBookmarkedExamIds(),
        experiences: this.getBookmarkedExperienceIds(),
      };
    }
  }

  getBookmarkedExamIds(): string[] {
    return this.getStorage<string[]>('prepunite_bookmarked_exams', []);
  }

  isExamBookmarked(examId: string): boolean {
    return this.getBookmarkedExamIds().includes(examId);
  }

  toggleBookmarkExam(examId: string): boolean {
    const list = this.getBookmarkedExamIds();
    let updated: string[];
    let isBookmarked: boolean;
    if (list.includes(examId)) {
      updated = list.filter(id => id !== examId);
      isBookmarked = false;
    } else {
      updated = [...list, examId];
      isBookmarked = true;
    }
    this.setStorage('prepunite_bookmarked_exams', updated);
    this.syncBookmarksWithSupabase();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
    }
    return isBookmarked;
  }

  // --- QUESTION BOOKMARKS ---
  getBookmarkedQuestionIds(): string[] {
    return this.getStorage<string[]>('prepunite_bookmarked_questions', []);
  }

  isQuestionBookmarked(questionId: string): boolean {
    return this.getBookmarkedQuestionIds().includes(questionId);
  }

  toggleBookmarkQuestion(questionId: string): boolean {
    const list = this.getBookmarkedQuestionIds();
    let updated: string[];
    let isBookmarked: boolean;
    if (list.includes(questionId)) {
      updated = list.filter(id => id !== questionId);
      isBookmarked = false;
    } else {
      updated = [...list, questionId];
      isBookmarked = true;
    }
    this.setStorage('prepunite_bookmarked_questions', updated);
    this.syncBookmarksWithSupabase();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
    }
    return isBookmarked;
  }

  // --- EXPERIENCE BOOKMARKS ---
  getBookmarkedExperienceIds(): string[] {
    return this.getStorage<string[]>('prepunite_bookmarked_experiences', []);
  }

  isExperienceBookmarked(expId: string): boolean {
    return this.getBookmarkedExperienceIds().includes(expId);
  }

  toggleBookmarkExperience(expId: string): boolean {
    const list = this.getBookmarkedExperienceIds();
    let updated: string[];
    let isBookmarked: boolean;
    if (list.includes(expId)) {
      updated = list.filter(id => id !== expId);
      isBookmarked = false;
    } else {
      updated = [...list, expId];
      isBookmarked = true;
    }
    this.setStorage('prepunite_bookmarked_experiences', updated);
    this.syncBookmarksWithSupabase();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite_bookmarks_changed'));
    }
    return isBookmarked;
  }

  // --- PAYWALL & MONETIZATION STORAGE WITH 30-DAY SINGLE PAPER EXPIRATION ---
  getPurchasedExamRecords(): { examId: string; purchasedAt: string; expiresAt: string }[] {
    const raw = this.getStorage<any[]>('jobsfolder_purchased_exam_records', []);
    const legacyIds = this.getStorage<string[]>('jobsfolder_purchased_exam_ids', []);
    
    // Migrate legacy IDs with default 30-day expiration if not present
    const migrated: { examId: string; purchasedAt: string; expiresAt: string }[] = [...raw];
    const now = new Date();
    const defaultExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    legacyIds.forEach(id => {
      if (!migrated.some(m => m.examId === id)) {
        migrated.push({
          examId: id,
          purchasedAt: now.toISOString(),
          expiresAt: defaultExpiry,
        });
      }
    });

    // Filter active non-expired paper purchases
    const active = migrated.filter(item => {
      if (!item.expiresAt) return true;
      return new Date(item.expiresAt).getTime() > Date.now();
    });

    if (active.length !== raw.length) {
      this.setStorage('jobsfolder_purchased_exam_records', active);
    }
    return active;
  }

  getPurchasedExamIds(): string[] {
    return this.getPurchasedExamRecords().map(r => r.examId);
  }

  getUserSubscription(): { isPro: boolean; expiresAt: string | null; planName: string } {
    const sub = this.getStorage<{ isPro: boolean; expiresAt: string | null; planName: string }>(
      'jobsfolder_user_subscription',
      { isPro: false, expiresAt: null, planName: 'Free Tier' }
    );

    if (sub.isPro && sub.expiresAt) {
      const isExpired = new Date(sub.expiresAt).getTime() < Date.now();
      if (isExpired) {
        return { isPro: false, expiresAt: null, planName: 'Free Tier (Pass Expired)' };
      }
    }

    return sub;
  }

  hasAccessToOldPapers(examId?: string, userRole?: string, _userEmail?: string): boolean {
    if (userRole === 'ADMIN') {
      return true;
    }
    const sub = this.getUserSubscription();
    if (sub.isPro) {
      if (!sub.expiresAt || new Date(sub.expiresAt).getTime() > Date.now()) {
        return true;
      }
    }
    if (examId && this.getPurchasedExamIds().includes(examId)) return true;
    return false;
  }

  unlockSingleExamPaper(examId: string, durationDays: number = 30): boolean {
    const records = this.getPurchasedExamRecords();
    const purchasedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const existingIdx = records.findIndex(r => r.examId === examId);
    let updated: { examId: string; purchasedAt: string; expiresAt: string }[];
    if (existingIdx > -1) {
      updated = [...records];
      updated[existingIdx] = { examId, purchasedAt, expiresAt };
    } else {
      updated = [...records, { examId, purchasedAt, expiresAt }];
    }

    this.setStorage('jobsfolder_purchased_exam_records', updated);
    this.setStorage('jobsfolder_purchased_exam_ids', updated.map(u => u.examId));
    return true;
  }

  activateSubscription(planType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'MONTHLY'): void {
    let days = 30;
    let planName = 'Jobsfolder Pro Monthly Pass';

    if (planType === 'QUARTERLY') {
      days = 90;
      planName = 'Jobsfolder Pro Quarterly Pass';
    } else if (planType === 'YEARLY') {
      days = 365;
      planName = 'Jobsfolder Master Yearly Pass';
    }

    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    this.setStorage('jobsfolder_user_subscription', {
      isPro: true,
      expiresAt,
      planName,
    });
  }

  activateMonthlyPass(): void {
    this.activateSubscription('MONTHLY');
  }

  // --- SECURE BACKEND AUTHORIZATION GATEWAY FOR OLD PAPERS ---
  // In Prod: Replaced by Spring Boot GET /api/v1/papers/{id}/authorized-token
  requestAuthorizedDocument(examId: string, userRole?: string, userEmail: string = 'student@jobsfolder.com'): AuthorizedPaperResponse {
    const isAuthorized = this.hasAccessToOldPapers(examId, userRole);
    if (!isAuthorized) {
      return {
        status: 'PAYMENT_REQUIRED',
        documentUrl: null,
        isAuthorized: false,
        reasonCode: 'PAYMENT_REQUIRED',
      };
    }

    return {
      status: 'AUTHORIZED',
      documentUrl: null,
      isAuthorized: true,
      userEmail,
      timestamp: new Date().toLocaleString(),
      watermarkText: `${userEmail} • Jobsfolder Verified Pass • ${new Date().toLocaleDateString()}`,
      reasonCode: 'AUTHORIZED',
    };
  }

  getResources(): any[] {
    return this.getStorage<any[]>('prepunite_resources', []);
  }

  addResource(resource: any): any {
    const list = this.getResources();
    const newRes = {
      id: `res-${Date.now()}`,
      title: resource.title || 'New Resource',
      companyName: resource.companyName || 'TCS',
      category: resource.category || 'PDF',
      fileType: resource.fileType || 'PDF Document',
      url: resource.url || '#',
      downloadsCount: resource.downloadsCount || 500,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRes, ...list];
    this.setStorage('prepunite_resources', updated);
    return newRes;
  }

  getTopicQuestions(topicId?: string): TopicQuestionItem[] {
    const rawList = this.getStorage<TopicQuestionItem[]>('prepunite_topic_questions', INITIAL_TOPIC_QUESTIONS);
    const seenFingerprints = new Set<string>();
    const seenIds = new Set<string>();

    const sanitizedList: TopicQuestionItem[] = [];

    rawList.forEach(item => {
      // Recompute deterministic fingerprint
      const fingerprint = item.fingerprint && !item.fingerprint.startsWith('fp-')
        ? item.fingerprint
        : generateQuestionFingerprint(item, item);

      // AUTOMATIC DEDUPLICATION: Skip duplicate instances stored previously
      if (seenFingerprints.has(fingerprint)) {
        return;
      }
      seenFingerprints.add(fingerprint);

      let id = item.id;
      if (!id || seenIds.has(id)) {
        id = (typeof crypto !== 'undefined' && crypto.randomUUID) 
          ? crypto.randomUUID() 
          : `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      }
      seenIds.add(id);

      sanitizedList.push({ ...item, id, fingerprint });
    });

    // Save cleaned deduplicated list back to storage
    if (sanitizedList.length !== rawList.length) {
      this.setStorage('prepunite_topic_questions', sanitizedList);
    }

    if (!topicId) return sanitizedList.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0) || (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()));

    // Resolve normalized target slug
    const targetSlug = resolveTopicSlug(topicId, topicId);
    return sanitizedList.filter(q => {
      const qSlug = resolveTopicSlug(q.topicId, q.topicId);
      return qSlug === targetSlug || q.topicId === topicId;
    }).sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0) || (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()));
  }

  addTopicQuestion(question: Partial<TopicQuestionItem>, allowDuplicate = false): { item: TopicQuestionItem | null; reason?: string } {
    const list = this.getTopicQuestions();
    const resolvedTopicId = resolveTopicSlug(question.topicId, question.topicId || 'numbers');

    // 11. PRE-INSERT VALIDATION LAYER
    const validation = validateQuestionItem(question);
    if (!validation.isValid) {
      return { item: null, reason: validation.reason };
    }
    
    // 3 & 4. BACKEND-ONLY SHA-256 / FINGERPRINT COMPUTATION
    const fingerprint = generateQuestionFingerprint(question, question);

    // DEDUPLICATION LAYER: Check if fingerprint already exists
    if (!allowDuplicate && fingerprint) {
      const exists = list.some(q => q.fingerprint === fingerprint);
      if (exists) {
        return { item: null, reason: `Duplicate Fingerprint (${fingerprint})` };
      }
    }

    const topicList = list.filter(q => resolveTopicSlug(q.topicId, q.topicId) === resolvedTopicId);
    const nextQuestionNum = question.questionNumber || (topicList.length > 0 ? Math.max(...topicList.map(q => q.questionNumber || 0)) + 1 : 1);
    
    // 5. UUID QUESTION ID
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // 9. DIFFICULTY SCALE (1 = Easy, 2 = Medium, 3 = Hard)
    let difficultyLevel: 1 | 2 | 3 = question.difficultyLevel || 2;
    if (question.difficulty) {
      if (question.difficulty === 'EASY') difficultyLevel = 1;
      else if (question.difficulty === 'HARD') difficultyLevel = 3;
      else difficultyLevel = 2;
    }

    const newItem: TopicQuestionItem = {
      id: question.id || newId,
      version: 1, // 6. VERSION
      topicId: resolvedTopicId,
      questionNumber: nextQuestionNum,
      statement: question.statement || '',
      options: question.options || [],
      correctAnswer: question.correctAnswer || 'A',
      explanation: question.explanation,
      structuredExplanation: question.structuredExplanation, // 2. SOURCE OF TRUTH
      formulasUsed: question.formulasUsed || [],
      difficultyLevel,
      difficulty: difficultyLevel === 1 ? 'EASY' : difficultyLevel === 3 ? 'HARD' : 'MEDIUM',
      status: question.status || (question.isHidden ? 'draft' : 'published'), // 7. STATUS
      isHidden: question.isHidden ?? (question.status === 'draft'),
      aiMetadata: question.aiMetadata || { generatedBy: 'chatgpt', reviewed: false }, // 8. AI METADATA
      templateId: question.templateId,
      variables: question.variables,
      fingerprint,
      createdAt: new Date().toISOString(),
    };
    const updated = [...list, newItem];
    this.setStorage('prepunite_topic_questions', updated);
    return { item: newItem };
  }

  updateTopicQuestion(id: string, updates: Partial<TopicQuestionItem>): TopicQuestionItem | null {
    const list = this.getTopicQuestions();
    const index = list.findIndex(q => q.id === id);
    if (index === -1) return null;
    const existing = list[index];

    let difficultyLevel = updates.difficultyLevel || existing.difficultyLevel || 2;
    if (updates.difficulty) {
      if (updates.difficulty === 'EASY') difficultyLevel = 1;
      else if (updates.difficulty === 'HARD') difficultyLevel = 3;
      else difficultyLevel = 2;
    }

    const updatedItem: TopicQuestionItem = {
      ...existing,
      ...updates,
      difficultyLevel,
      difficulty: difficultyLevel === 1 ? 'EASY' : difficultyLevel === 3 ? 'HARD' : 'MEDIUM',
    };
    list[index] = updatedItem;
    this.setStorage('prepunite_topic_questions', list);
    return updatedItem;
  }

  deleteTopicQuestion(id: string): boolean {
    const list = this.getTopicQuestions();
    const updated = list.filter(q => q.id !== id);
    if (updated.length === list.length) return false;
    this.setStorage('prepunite_topic_questions', updated);
    return true;
  }

  toggleTopicQuestionVisibility(id: string): TopicQuestionItem | null {
    const list = this.getTopicQuestions();
    const item = list.find(q => q.id === id);
    if (!item) return null;
    const newStatus: QuestionStatus = item.status === 'draft' ? 'published' : 'draft';
    return this.updateTopicQuestion(id, { isHidden: !item.isHidden, status: newStatus });
  }

  parseTopicQuestionJsonItem(raw: any, defaultTopicId?: string): Partial<TopicQuestionItem> {
    return parseTopicQuestionJsonItemUtil(raw, defaultTopicId);
  }

  // 12. ENHANCED IMPORT REPORT
  // High-Performance Single-Pass Heavy Data Import Batcher
  importBulkTopicQuestionsJson(jsonText: string, defaultTopicId?: string): ImportReport {
    const report: ImportReport = {
      success: 0,
      duplicates: 0,
      invalid: 0,
      errors: [],
    };

    let items: any[] = [];
    try {
      const parsed = safeJsonParse(jsonText);
      const rawItems = Array.isArray(parsed) ? parsed : [parsed];
      
      // Flatten passage-based grouping (where an item has a passage and an array of questions)
      rawItems.forEach(item => {
        if (item.questions && Array.isArray(item.questions)) {
          item.questions.forEach((q: any) => {
            items.push({
              ...item,       // Keep topic, subtopic, passage, passageTitle, etc.
              questions: undefined, // Remove nested array
              ...q           // Override with specific question data
            });
          });
        } else {
          items.push(item);
        }
      });
    } catch {
      report.invalid = 1;
      report.errors.push({ itemIndex: 1, reason: 'Invalid JSON syntax. Please check brackets and quotes.' });
      return report;
    }

    const existingList = this.getTopicQuestions();
    const existingFingerprints = new Set(existingList.map(q => q.fingerprint).filter(Boolean));
    const topicMaxMap = new Map<string, number>();
    existingList.forEach((q) => {
      const tSlug = resolveTopicSlug(q.topicId, q.topicId);
      const prevMax = topicMaxMap.get(tSlug) || 0;
      if ((q.questionNumber || 0) > prevMax) {
        topicMaxMap.set(tSlug, q.questionNumber || 0);
      }
    });
    const batchTopicCounter = new Map<string, number>();
    const newItems: TopicQuestionItem[] = [];

    items.forEach((item, idx) => {
      try {
        const parsed = this.parseTopicQuestionJsonItem(item, defaultTopicId);
        const fingerprint = parsed.fingerprint;

        // Fast Deduplication Check
        if (fingerprint && existingFingerprints.has(fingerprint)) {
          report.duplicates++;
          report.errors.push({
            itemIndex: idx + 1,
            question: item.question || item.statement || `Item #${idx + 1}`,
            reason: `Duplicate Question (Skipped)`,
          });
          return;
        }

        const validation = validateQuestionItem(parsed);
        if (!validation.isValid) {
          report.invalid++;
          report.errors.push({
            itemIndex: idx + 1,
            question: item.question || item.statement || `Item #${idx + 1}`,
            reason: validation.reason || 'Invalid format',
          });
          return;
        }

        const resolvedTopicId = resolveTopicSlug(parsed.topicId, defaultTopicId || 'numbers');
        const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
          ? crypto.randomUUID() 
          : `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        let difficultyLevel: 1 | 2 | 3 = parsed.difficultyLevel || 2;

        const baseMax = topicMaxMap.get(resolvedTopicId) || 0;
        const currentCount = batchTopicCounter.get(resolvedTopicId) || 0;
        const nextQNum = baseMax + currentCount + 1;
        batchTopicCounter.set(resolvedTopicId, currentCount + 1);

        const newItem: TopicQuestionItem = {
          id: parsed.id || newId,
          version: 1,
          topicId: resolvedTopicId,
          questionNumber: nextQNum,
          statement: parsed.statement || '',
          options: parsed.options || [],
          correctAnswer: parsed.correctAnswer || 'A',
          explanation: parsed.explanation,
          structuredExplanation: parsed.structuredExplanation,
          formulasUsed: parsed.formulasUsed || [],
          difficultyLevel,
          difficulty: difficultyLevel === 1 ? 'EASY' : difficultyLevel === 3 ? 'HARD' : 'MEDIUM',
          status: parsed.status || 'published',
          isHidden: parsed.isHidden ?? false,
          aiMetadata: parsed.aiMetadata || { generatedBy: 'chatgpt', reviewed: false },
          templateId: parsed.templateId,
          variables: parsed.variables,
          fingerprint,
          createdAt: new Date().toISOString(),
        };

        if (fingerprint) existingFingerprints.add(fingerprint);
        newItems.push(newItem);
        report.success++;
      } catch (err: any) {
        report.invalid++;
        report.errors.push({
          itemIndex: idx + 1,
          question: item.question || item.statement || `Item #${idx + 1}`,
          reason: err.message || 'Parsing failure',
        });
      }
    });

    if (newItems.length > 0) {
      this.setStorage('prepunite_topic_questions', [...existingList, ...newItems]);
    }

    return report;
  }
}

// Re-export parser utilities from questionParser.ts
export {
  computeSha256Hex,
  validateQuestionItem,
  generateQuestionFingerprint,
  parseTopicQuestionJsonItem,
} from '@/utils/questionParser';

export const dataStore = new DataStoreManager();
