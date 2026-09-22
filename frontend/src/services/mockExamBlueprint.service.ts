import { supabase } from '@/lib/supabase';
import type { MockExamTemplate } from '@/types/tpo';

const BLUEPRINTS_STORAGE_KEY = 'prepunite_mock_exam_blueprints';
const CLOUD_SUBJECT_PREFIX = 'MOCK_EXAM_BLUEPRINT:';

export const BUILTIN_BLUEPRINTS: MockExamTemplate[] = [
  {
    id: 'tmpl-tcs-nqt-2027',
    name: 'TCS NQT 2026/2027 Official Pattern (Part A Foundation + Part B Advanced)',
    target_company: 'TCS NQT',
    badge: 'Official NQT Standard',
    description: 'Comprehensive 5-section TCS NQT assessment: Part A Foundation (Numerical 20 Qs/25m, Reasoning 20 Qs/25m, Verbal 25 Qs/25m) + Part B Advanced (Adv Quant & Reasoning 15 Qs/25m, Hands-on Coding 2 Qs/90m). Total 190 Minutes, 82 Questions.',
    duration_minutes: 190,
    passing_percentage: 50,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Part A: Numerical Ability',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'percentage', 'ratio-and-proportion', 'profit-and-loss', 'time-and-work', 'simplification'],
        random_sampling: true,
      },
      {
        name: 'Part A: Reasoning Ability',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'logical-reasoning',
        topic_ids: ['seating-arrangement', 'blood-relations', 'syllogisms', 'table-charts', 'bar-charts', 'logical-problems', 'direction-sense'],
        random_sampling: true,
      },
      {
        name: 'Part A: Verbal Ability',
        section_type: 'MCQ',
        question_count: 25,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'verbal-ability',
        topic_ids: ['reading-comprehension', 'sentence-improvement', 'cloze-test', 'synonyms', 'antonyms', 'ordering-of-sentences'],
        random_sampling: true,
      },
      {
        name: 'Part B: Advanced Quantitative & Reasoning Ability',
        section_type: 'MCQ',
        question_count: 15,
        marks_per_correct: 2,
        negative_marking: 0.5,
        duration_minutes: 25,
        category: 'all',
        topic_ids: ['permutation-and-combination', 'probability', 'caselet-di', 'pie-charts', 'numbers', 'vr-critical-reasoning'],
        random_sampling: true,
      },
      {
        name: 'Part B: Advanced Hands-on Coding',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 15,
        negative_marking: 0,
        duration_minutes: 90,
        category: 'coding',
        coding_track: 'CAMPUS_DSA',
        topic_ids: ['ARRAYS', 'STRINGS', 'DYNAMIC_PROGRAMMING', 'TREES_BINARY_TREES', 'NUMBER_LOGIC'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-pure-coding-oa',
    name: 'Pure Hands-on Coding Assessment (OA Round)',
    target_company: 'Tech Recruiter',
    badge: 'Coding Qualifier Round',
    description: 'Specialized 100% coding assessment with 2 hands-on coding challenges (Easy/Medium String/Array + Hard DSA) evaluated via real-time test cases.',
    duration_minutes: 90,
    passing_percentage: 50,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Hands-on Coding Assessment',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 25,
        negative_marking: 0,
        duration_minutes: 90,
        category: 'coding',
        coding_track: 'CAMPUS_DSA',
        topic_ids: ['ARRAYS', 'STRINGS', 'DYNAMIC_PROGRAMMING', 'TWO_POINTERS', 'SLIDING_WINDOW'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-tcs-nqt-2026',
    name: 'TCS NQT 2026 Campus Drive Pattern',
    target_company: 'TCS NQT',
    badge: 'High Hiring Volume',
    description: 'Official multi-section placement assessment matching the latest TCS NQT National Qualifier test blueprint.',
    duration_minutes: 90,
    passing_percentage: 45,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Numerical Ability & Advanced Quant',
        section_type: 'MCQ',
        question_count: 25,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 35,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'time-and-work', 'time-and-distance', 'problems-on-trains', 'hcf-lcm', 'simplification'],
        random_sampling: true,
      },
      {
        name: 'Reasoning Ability & Logical Deduction',
        section_type: 'MCQ',
        question_count: 25,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 35,
        category: 'logical-reasoning',
        topic_ids: ['calendar', 'data-interpretation'],
        random_sampling: true,
      },
      {
        name: 'Verbal Ability & Reading Comprehension',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'verbal-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-tcs-digital-coding',
    name: 'TCS Digital & Prime Advanced Coding Drive',
    target_company: 'TCS NQT',
    badge: 'Digital & Prime (₹7–9 LPA)',
    description: 'Advanced assessment targeting TCS Digital and Prime offers featuring Advanced Reasoning and 2 Hands-on Coding problems.',
    duration_minutes: 90,
    passing_percentage: 50,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Advanced Quantitative & Logical Reasoning',
        section_type: 'MCQ',
        question_count: 15,
        marks_per_correct: 2,
        negative_marking: 0.5,
        duration_minutes: 30,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'permutation-and-combination', 'probability', 'time-and-work'],
        random_sampling: true,
      },
      {
        name: 'Hands-on Advanced Coding (2 Problems)',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 15,
        negative_marking: 0,
        duration_minutes: 60,
        category: 'coding',
        coding_track: 'PROGRAMMING_150',
        topic_ids: ['ARRAYS', 'STRINGS', 'DYNAMIC_PROGRAMMING', 'NUMBER_LOGIC'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-accenture-ase',
    name: 'Accenture ASE (Associate Software Engineer) Blueprint',
    target_company: 'Accenture ASE',
    badge: 'Campus Benchmark',
    description: 'Accenture Associate Software Engineer (ASE) official test blueprint covering Critical Reasoning, Abstract/Quant Logic, English Verbal, and Technical Pseudocode.',
    duration_minutes: 90,
    passing_percentage: 45,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Critical Thinking & Problem Solving',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'logical-reasoning',
        topic_ids: ['calendar', 'data-interpretation'],
        random_sampling: true,
      },
      {
        name: 'Abstract Reasoning & Numerical Logic',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'average', 'time-and-work', 'simplification', 'percentage'],
        random_sampling: true,
      },
      {
        name: 'English Communication & Verbal Skills',
        section_type: 'MCQ',
        question_count: 15,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'verbal-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Technical Pseudocode & Common Applications',
        section_type: 'MCQ',
        question_count: 15,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'technical-aptitude',
        topic_ids: [],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-accenture-coding',
    name: 'Accenture Advanced Technical & Hands-on Coding',
    target_company: 'Accenture ASE',
    badge: 'FSE & Coding Qualifier',
    description: 'Specialized Accenture technical test combining pseudocode evaluation with 2 Hands-on Coding challenges in C++, Java, or Python.',
    duration_minutes: 90,
    passing_percentage: 50,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Pseudocode & Algorithm Analysis',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 30,
        category: 'technical-aptitude',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Hands-on Coding Assessment',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 20,
        negative_marking: 0,
        duration_minutes: 60,
        category: 'coding',
        coding_track: 'PROGRAMMING_150',
        topic_ids: ['ARRAYS', 'STRINGS', 'NUMBER_LOGIC'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-cognizant-genc',
    name: 'Cognizant GenC Next & Elevate Drive Blueprint',
    target_company: 'Cognizant',
    badge: 'GenC & GenC Next',
    description: 'Cognizant standardized recruitment drive testing Quantitative, Verbal, and Hands-on Automata Coding.',
    duration_minutes: 100,
    passing_percentage: 50,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Quantitative & Analytical Aptitude',
        section_type: 'MCQ',
        question_count: 25,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 35,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'time-and-work', 'profit-and-loss', 'average'],
        random_sampling: true,
      },
      {
        name: 'Verbal & Logical Communication',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'verbal-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Automata Hands-on Coding',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 25,
        negative_marking: 0,
        duration_minutes: 40,
        category: 'coding',
        coding_track: 'PROGRAMMING_150',
        topic_ids: ['ARRAYS', 'STRINGS', 'PATTERNS'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-infosys-specialist',
    name: 'Infosys Specialist Programmer (DSE/SP) Pattern',
    target_company: 'Infosys',
    badge: '₹6.5–9.5 LPA Specialist',
    description: 'High-level competitive assessment for Infosys Specialist Programmer and Digital Specialist Engineer roles.',
    duration_minutes: 120,
    passing_percentage: 50,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Technical & Data Structures MCQs',
        section_type: 'MCQ',
        question_count: 15,
        marks_per_correct: 2,
        negative_marking: 0.5,
        duration_minutes: 30,
        category: 'technical-aptitude',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Hands-on Data Structures & Algorithms',
        section_type: 'CODING',
        question_count: 3,
        marks_per_correct: 20,
        negative_marking: 0,
        duration_minutes: 90,
        category: 'coding',
        coding_track: 'CAMPUS_DSA',
        topic_ids: ['ARRAYS', 'STRINGS', 'DYNAMIC_PROGRAMMING', 'TWO_POINTERS'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-wipro-elite',
    name: 'Wipro Elite NLTH National Qualifier Pattern',
    target_company: 'Wipro',
    badge: 'National Level Test',
    description: 'Wipro Elite National Level Talent Hunt assessment covering Aptitude, Logical, Verbal, and Hands-on Coding.',
    duration_minutes: 90,
    passing_percentage: 45,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Quantitative Aptitude',
        section_type: 'MCQ',
        question_count: 16,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'time-and-work', 'percentage', 'average'],
        random_sampling: true,
      },
      {
        name: 'Logical Reasoning Ability',
        section_type: 'MCQ',
        question_count: 14,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'logical-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Verbal English',
        section_type: 'MCQ',
        question_count: 18,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'verbal-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Hands-on Coding Assessment',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 20,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'coding',
        coding_track: 'PROGRAMMING_150',
        topic_ids: ['NUMBER_LOGIC', 'STRINGS'],
        random_sampling: true,
      },
    ],
  },
];

export const EXAM_PRESET_TEMPLATES = BUILTIN_BLUEPRINTS;

export const APTITUDE_CATEGORIES = [
  { id: 'arithmetic-aptitude', name: 'Arithmetic Aptitude' },
  { id: 'data-interpretation', name: 'Data Interpretation' },
  { id: 'logical-reasoning', name: 'Logical Reasoning' },
  { id: 'verbal-reasoning', name: 'Verbal Reasoning' },
  { id: 'verbal-ability', name: 'Verbal Ability' },
  { id: 'non-verbal-reasoning', name: 'Nonverbal Reasoning' },
  { id: 'technical-aptitude', name: 'Technical & Cognitive Aptitude' },
];

export const TECHNICAL_MCQ_SUBJECTS = [
  { id: 'mcq-c-programming', name: 'C Language', category: 'C_PROGRAMMING', cluster: 'Core Languages' },
  { id: 'mcq-cpp-programming', name: 'C++ Language', category: 'CPP_PROGRAMMING', cluster: 'Core Languages' },
  { id: 'mcq-java-programming', name: 'Java Language', category: 'JAVA_PROGRAMMING', cluster: 'Core Languages' },
  { id: 'mcq-python-programming', name: 'Python Language', category: 'SYNTAX_BASICS', cluster: 'Core Languages' },
  { id: 'mcq-oops-concepts', name: 'OOPs Concepts', category: 'SYNTAX_BASICS', cluster: 'Core CS Subjects' },
  { id: 'mcq-database-systems', name: 'DBMS & SQL', category: 'DATABASE', cluster: 'Core CS Subjects' },
  { id: 'mcq-operating-systems', name: 'Operating Systems', category: 'OPERATING_SYSTEMS', cluster: 'Core CS Subjects' },
  { id: 'mcq-computer-networks', name: 'Computer Networks', category: 'NETWORKING', cluster: 'Core CS Subjects' },
  { id: 'mcq-data-structures', name: 'Data Structures & Algorithms', category: 'DATA_STRUCTURES', cluster: 'Data Structures & Logic' },
  { id: 'mcq-pseudo-code', name: 'Campus OA Pseudo-Code', category: 'PSEUDO_CODE', cluster: 'Data Structures & Logic' },
];

export const CODING_CATEGORIES = [
  { id: 'SYNTAX_BASICS', name: 'Syntax & Language Fundamentals', track: 'PROGRAMMING_150' },
  { id: 'NUMBER_LOGIC', name: 'Number Logic & Math', track: 'PROGRAMMING_150' },
  { id: 'PATTERNS', name: 'Pattern Printing', track: 'PROGRAMMING_150' },
  { id: 'ARRAYS', name: 'Arrays & Subarrays', track: 'PROGRAMMING_150' },
  { id: 'STRINGS', name: 'Strings & Character Manipulation', track: 'PROGRAMMING_150' },
  { id: 'MATRICES', name: '2D Arrays & Matrices', track: 'CAMPUS_DSA' },
  { id: 'RECURSION', name: 'Recursion & Backtracking', track: 'PROGRAMMING_150' },
  { id: 'BIT_MANIPULATION', name: 'Bit Manipulation', track: 'CAMPUS_DSA' },
  { id: 'SEARCHING', name: 'Searching & Sorting Algorithms', track: 'PROGRAMMING_150' },
  { id: 'POINTERS_ARRAYS', name: 'Two Pointers & Sliding Window', track: 'CAMPUS_DSA' },
  { id: 'LINEAR_STRUCTURES', name: 'Stacks, Queues & Linked Lists', track: 'CAMPUS_DSA' },
  { id: 'HIERARCHICAL_STRUCTURES', name: 'Trees, BST & Heaps', track: 'CAMPUS_DSA' },
  { id: 'SEARCH_INTERVALS', name: 'Binary Search & Intervals', track: 'CAMPUS_DSA' },
  { id: 'EXHAUSTIVE_SEARCH_DP', name: 'Dynamic Programming & Exhaustive Search', track: 'CAMPUS_DSA' },
  { id: 'NETWORK_GRAPH_ALGORITHMS', name: 'Graph Algorithms & Traversal', track: 'CAMPUS_DSA' },
  // Compatibility Aliases
  { id: 'TWO_POINTERS', name: 'Two Pointers Technique', track: 'CAMPUS_DSA' },
  { id: 'SLIDING_WINDOW', name: 'Sliding Window', track: 'CAMPUS_DSA' },
  { id: 'STACKS_QUEUES', name: 'Stacks & Queues', track: 'CAMPUS_DSA' },
  { id: 'LINKED_LISTS', name: 'Linked Lists', track: 'CAMPUS_DSA' },
  { id: 'TREES_BINARY_TREES', name: 'Trees & Binary Search Trees', track: 'CAMPUS_DSA' },
  { id: 'DYNAMIC_PROGRAMMING', name: 'Dynamic Programming', track: 'CAMPUS_DSA' },
  { id: 'SEARCHING_SORTING', name: 'Searching & Sorting Algorithms', track: 'PROGRAMMING_150' },
];

export const FALLBACK_APTITUDE_TOPICS = [
  // Arithmetic Aptitude
  { id: 'numbers', name: 'Numbers & Number System', category_slug: 'arithmetic-aptitude' },
  { id: 'problems-on-numbers', name: 'Problems on Numbers', category_slug: 'arithmetic-aptitude' },
  { id: 'hcf-lcm', name: 'HCF and LCM', category_slug: 'arithmetic-aptitude' },
  { id: 'decimal-fraction', name: 'Decimal Fractions', category_slug: 'arithmetic-aptitude' },
  { id: 'simplification', name: 'Simplification', category_slug: 'arithmetic-aptitude' },
  { id: 'square-cube-root', name: 'Square Root & Cube Root', category_slug: 'arithmetic-aptitude' },
  { id: 'percentage', name: 'Percentage', category_slug: 'arithmetic-aptitude' },
  { id: 'profit-and-loss', name: 'Profit and Loss', category_slug: 'arithmetic-aptitude' },
  { id: 'ratio-and-proportion', name: 'Ratio and Proportion', category_slug: 'arithmetic-aptitude' },
  { id: 'partnership', name: 'Partnership', category_slug: 'arithmetic-aptitude' },
  { id: 'chain-rule', name: 'Chain Rule', category_slug: 'arithmetic-aptitude' },
  { id: 'time-and-work', name: 'Time and Work', category_slug: 'arithmetic-aptitude' },
  { id: 'pipes-and-cistern', name: 'Pipes and Cistern', category_slug: 'arithmetic-aptitude' },
  { id: 'time-and-distance', name: 'Time and Distance', category_slug: 'arithmetic-aptitude' },
  { id: 'problems-on-trains', name: 'Problems on Trains', category_slug: 'arithmetic-aptitude' },
  { id: 'boats-and-streams', name: 'Boats and Streams', category_slug: 'arithmetic-aptitude' },
  { id: 'alligation-or-mixture', name: 'Alligation or Mixture', category_slug: 'arithmetic-aptitude' },
  { id: 'simple-interest', name: 'Simple Interest', category_slug: 'arithmetic-aptitude' },
  { id: 'compound-interest', name: 'Compound Interest', category_slug: 'arithmetic-aptitude' },
  { id: 'stocks-and-shares', name: 'Stocks and Shares', category_slug: 'arithmetic-aptitude' },
  { id: 'true-discount', name: 'True Discount', category_slug: 'arithmetic-aptitude' },
  { id: 'bankers-discount', name: 'Banker\'s Discount', category_slug: 'arithmetic-aptitude' },
  { id: 'height-and-distance', name: 'Height and Distance', category_slug: 'arithmetic-aptitude' },
  { id: 'area', name: 'Area & Perimeter', category_slug: 'arithmetic-aptitude' },
  { id: 'volume-and-surface-area', name: 'Volume and Surface Area', category_slug: 'arithmetic-aptitude' },
  { id: 'races-and-games', name: 'Races and Games', category_slug: 'arithmetic-aptitude' },
  { id: 'permutation-and-combination', name: 'Permutation and Combination', category_slug: 'arithmetic-aptitude' },
  { id: 'probability', name: 'Probability', category_slug: 'arithmetic-aptitude' },
  { id: 'average', name: 'Average', category_slug: 'arithmetic-aptitude' },
  { id: 'problems-on-ages', name: 'Problems on Ages', category_slug: 'arithmetic-aptitude' },
  { id: 'calendar', name: 'Calendar', category_slug: 'arithmetic-aptitude' },
  { id: 'clock', name: 'Clock', category_slug: 'arithmetic-aptitude' },
  { id: 'odd-man-out-and-series', name: 'Odd Man Out and Series', category_slug: 'arithmetic-aptitude' },
  { id: 'surds-and-indices', name: 'Surds and Indices', category_slug: 'arithmetic-aptitude' },
  { id: 'logarithm', name: 'Logarithm', category_slug: 'arithmetic-aptitude' },

  // Data Interpretation
  { id: 'table-charts', name: 'Table Charts', category_slug: 'data-interpretation' },
  { id: 'bar-charts', name: 'Bar Charts', category_slug: 'data-interpretation' },
  { id: 'pie-charts', name: 'Pie Charts', category_slug: 'data-interpretation' },
  { id: 'line-charts', name: 'Line Charts', category_slug: 'data-interpretation' },
  { id: 'caselet-di', name: 'Caselet DI', category_slug: 'data-interpretation' },
  { id: 'radar-web-charts', name: 'Radar / Web Charts', category_slug: 'data-interpretation' },
  { id: 'scatter-bubble-charts', name: 'Scatter & Bubble Charts', category_slug: 'data-interpretation' },
  { id: 'scatter-plots', name: 'Scatter Plots', category_slug: 'data-interpretation' },

  // Logical Reasoning
  { id: 'number-series', name: 'Number Series', category_slug: 'logical-reasoning' },
  { id: 'letter-and-symbol-series', name: 'Letter and Symbol Series', category_slug: 'logical-reasoning' },
  { id: 'verbal-classification', name: 'Verbal Classification', category_slug: 'logical-reasoning' },
  { id: 'analogies', name: 'Analogies', category_slug: 'logical-reasoning' },
  { id: 'matching-definitions', name: 'Matching Definitions', category_slug: 'logical-reasoning' },
  { id: 'verbal-reasoning', name: 'Verbal Reasoning Logic', category_slug: 'logical-reasoning' },
  { id: 'logical-games', name: 'Logical Games', category_slug: 'logical-reasoning' },
  { id: 'statement-and-assumption', name: 'Statement and Assumption', category_slug: 'logical-reasoning' },
  { id: 'statement-and-conclusion', name: 'Statement and Conclusion', category_slug: 'logical-reasoning' },
  { id: 'cause-and-effect', name: 'Cause and Effect', category_slug: 'logical-reasoning' },
  { id: 'essential-part', name: 'Essential Part', category_slug: 'logical-reasoning' },
  { id: 'artificial-language', name: 'Artificial Language', category_slug: 'logical-reasoning' },
  { id: 'making-judgments', name: 'Making Judgments', category_slug: 'logical-reasoning' },
  { id: 'logical-problems', name: 'Logical Problems', category_slug: 'logical-reasoning' },
  { id: 'analyzing-arguments', name: 'Analyzing Arguments', category_slug: 'logical-reasoning' },
  { id: 'course-of-action', name: 'Course of Action', category_slug: 'logical-reasoning' },
  { id: 'theme-detection', name: 'Theme Detection', category_slug: 'logical-reasoning' },
  { id: 'statement-and-argument', name: 'Statement and Argument', category_slug: 'logical-reasoning' },
  { id: 'logical-deduction', name: 'Logical Deduction', category_slug: 'logical-reasoning' },
  { id: 'logical-sequence-of-words', name: 'Logical Sequence of Words', category_slug: 'logical-reasoning' },
  { id: 'syllogisms', name: 'Syllogisms', category_slug: 'logical-reasoning' },
  { id: 'blood-relations', name: 'Blood Relations', category_slug: 'logical-reasoning' },
  { id: 'cubes-and-dice', name: 'Cubes and Dice', category_slug: 'logical-reasoning' },
  { id: 'seating-arrangement', name: 'Seating Arrangement', category_slug: 'logical-reasoning' },
  { id: 'direction-sense', name: 'Direction Sense Test', category_slug: 'logical-reasoning' },

  // Verbal Reasoning
  { id: 'vr-logical-sequence', name: 'Logical Sequence of Words', category_slug: 'verbal-reasoning' },
  { id: 'vr-blood-relations', name: 'Blood Relations Test', category_slug: 'verbal-reasoning' },
  { id: 'vr-syllogism', name: 'Syllogisms & Premises', category_slug: 'verbal-reasoning' },
  { id: 'vr-arguments', name: 'Statement & Arguments', category_slug: 'verbal-reasoning' },
  { id: 'vr-assumptions', name: 'Statement & Assumptions', category_slug: 'verbal-reasoning' },
  { id: 'vr-conclusions', name: 'Statement & Conclusions', category_slug: 'verbal-reasoning' },
  { id: 'vr-cause-effect', name: 'Cause & Effect Analysis', category_slug: 'verbal-reasoning' },
  { id: 'vr-critical-reasoning', name: 'Critical Reasoning', category_slug: 'verbal-reasoning' },

  // Verbal Ability
  { id: 'reading-comprehension', name: 'Reading Comprehension', category_slug: 'verbal-ability' },
  { id: 'spotting-errors', name: 'Spotting Errors', category_slug: 'verbal-ability' },
  { id: 'synonyms', name: 'Synonyms', category_slug: 'verbal-ability' },
  { id: 'antonyms', name: 'Antonyms', category_slug: 'verbal-ability' },
  { id: 'spellings', name: 'Spellings', category_slug: 'verbal-ability' },
  { id: 'ordering-of-words', name: 'Ordering of Words', category_slug: 'verbal-ability' },
  { id: 'sentence-improvement', name: 'Sentence Improvement', category_slug: 'verbal-ability' },
  { id: 'ordering-of-sentences', name: 'Ordering of Sentences', category_slug: 'verbal-ability' },
  { id: 'cloze-test', name: 'Cloze Test', category_slug: 'verbal-ability' },
  { id: 'one-word-substitutes', name: 'One Word Substitutes', category_slug: 'verbal-ability' },
  { id: 'idioms-and-phrases', name: 'Idioms and Phrases', category_slug: 'verbal-ability' },

  // Nonverbal Reasoning
  { id: 'pattern-completion', name: 'Pattern Completion', category_slug: 'non-verbal-reasoning' },
  { id: 'mirror-images', name: 'Mirror Images', category_slug: 'non-verbal-reasoning' },
  { id: 'water-images', name: 'Water Images', category_slug: 'non-verbal-reasoning' },
  { id: 'paper-folding', name: 'Paper Folding', category_slug: 'non-verbal-reasoning' },
  { id: 'paper-cutting', name: 'Paper Cutting', category_slug: 'non-verbal-reasoning' },
  { id: 'embedded-images', name: 'Embedded Images', category_slug: 'non-verbal-reasoning' },
  { id: 'shape-construction', name: 'Shape Construction', category_slug: 'non-verbal-reasoning' },
  { id: 'cubes-and-dice-nv', name: 'Cubes and Dice Visual', category_slug: 'non-verbal-reasoning' },
  { id: 'grouping-of-images', name: 'Grouping of Identical Figures', category_slug: 'non-verbal-reasoning' },

  // Technical Aptitude (Cognitive & Architecture)
  { id: 'pseudocode-tracing', name: 'Pseudocode Tracing & Logic', category_slug: 'technical-aptitude' },
  { id: 'bitwise-operators', name: 'Bitwise Operators & Shifts', category_slug: 'technical-aptitude' },
  { id: 'code-debugging-logic', name: 'Code Debugging Logic', category_slug: 'technical-aptitude' },
  { id: 'cloud-networking-basics', name: 'Cloud & Networking Basics', category_slug: 'technical-aptitude' },
  { id: 'automata-theory-basics', name: 'Automata Theory Basics', category_slug: 'technical-aptitude' },
];

export const mockExamBlueprintService = {
  /**
   * Returns all active blueprints, merging built-in patterns with cloud admin blueprints.
   */
  async getAllBlueprints(): Promise<MockExamTemplate[]> {
    const map = new Map<string, MockExamTemplate>();

    // 1. Built-in defaults
    BUILTIN_BLUEPRINTS.forEach(b => map.set(b.id, b));

    // 2. Local storage cache
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(BLUEPRINTS_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            parsed.forEach((b: MockExamTemplate) => {
              if (b && b.id) map.set(b.id, b);
            });
          }
        }
      } catch {}
    }

    // 3. Supabase Cloud Sync
    try {
      // Query active blueprint records from cloud (newest first)
      const { data: cloudMsgs } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', `${CLOUD_SUBJECT_PREFIX}%`)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

      const seenIds = new Set<string>();
      if (cloudMsgs && cloudMsgs.length > 0) {
        cloudMsgs.forEach(m => {
          try {
            const parsed = JSON.parse(m.message) as MockExamTemplate;
            if (parsed && parsed.id && !seenIds.has(parsed.id)) {
              seenIds.add(parsed.id);
              map.set(parsed.id, parsed);
            }
          } catch {}
        });
      }

      // Query deleted blueprint records to ensure deleted built-ins/custom are purged
      const { data: deletedMsgs } = await supabase
        .from('contact_messages')
        .select('subject')
        .like('subject', `${CLOUD_SUBJECT_PREFIX}%`)
        .eq('status', 'DELETED');

      if (deletedMsgs && deletedMsgs.length > 0) {
        deletedMsgs.forEach(d => {
          const bpId = d.subject.replace(CLOUD_SUBJECT_PREFIX, '');
          map.delete(bpId);
        });
      }
    } catch (e) {
      console.warn('[mockExamBlueprintService.getAllBlueprints] Cloud sync note:', e);
    }

    const all = Array.from(map.values());

    // Update local storage cache
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(all));
      } catch {}
    }

    return all;
  },

  async getBlueprintById(id: string): Promise<MockExamTemplate | null> {
    const all = await this.getAllBlueprints();
    return all.find(b => b.id === id) || null;
  },

  async saveBlueprint(blueprint: MockExamTemplate): Promise<MockExamTemplate> {
    const toSave: MockExamTemplate = {
      ...blueprint,
      id: blueprint.id || `bp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      updated_at: new Date().toISOString(),
    };

    // 1. Update local cache
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(BLUEPRINTS_STORAGE_KEY);
        const current: MockExamTemplate[] = cached ? JSON.parse(cached) : [...BUILTIN_BLUEPRINTS];
        const idx = current.findIndex(b => b.id === toSave.id);
        if (idx >= 0) {
          current[idx] = toSave;
        } else {
          current.unshift(toSave);
        }
        localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent('prepunite_blueprints_updated', { detail: toSave }));
      } catch {}
    }

    // 2. Persist to Supabase Cloud via contact_messages with revision superseding
    try {
      await supabase
        .from('contact_messages')
        .update({ status: 'SUPERSEDED' })
        .eq('subject', `${CLOUD_SUBJECT_PREFIX}${toSave.id}`);

      await supabase.from('contact_messages').insert({
        name: `Blueprint: ${toSave.name}`,
        email: 'admin@prepunite.com',
        subject: `${CLOUD_SUBJECT_PREFIX}${toSave.id}`,
        message: JSON.stringify(toSave),
        status: 'ACTIVE',
      });
    } catch (e) {
      console.warn('[mockExamBlueprintService.saveBlueprint] Cloud save note:', e);
    }

    return toSave;
  },

  async deleteBlueprint(id: string): Promise<boolean> {
    // 1. Update local cache
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(BLUEPRINTS_STORAGE_KEY);
        if (cached) {
          const current: MockExamTemplate[] = JSON.parse(cached);
          const filtered = current.filter(b => b.id !== id);
          localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(filtered));
        }
        window.dispatchEvent(new CustomEvent('prepunite_blueprints_updated', { detail: { id, deleted: true } }));
      } catch {}
    }

    // 2. Mark deleted in Supabase Cloud
    try {
      await supabase
        .from('contact_messages')
        .update({ status: 'DELETED' })
        .eq('subject', `${CLOUD_SUBJECT_PREFIX}${id}`);
    } catch (e) {
      console.warn('[mockExamBlueprintService.deleteBlueprint] Cloud delete note:', e);
    }

    return true;
  },

  async resetToDefaults(): Promise<MockExamTemplate[]> {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(BUILTIN_BLUEPRINTS));
        window.dispatchEvent(new CustomEvent('prepunite_blueprints_updated', { detail: BUILTIN_BLUEPRINTS }));
      } catch {}
    }
    return BUILTIN_BLUEPRINTS;
  },

  /**
   * Returns all aptitude topics grouped by category, merging database topics with fallbacks
   */
  async getAptitudeTopics(): Promise<{ id: string; name: string; category_slug: string }[]> {
    const topicMap = new Map<string, { id: string; name: string; category_slug: string }>();

    // 1. Seed with curated topics
    FALLBACK_APTITUDE_TOPICS.forEach(t => topicMap.set(t.id, t));

    // 2. Overlay live DB topics from Supabase
    try {
      const { data, error } = await supabase
        .from('aptitude_topics')
        .select('id, name, category_slug')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        data.forEach(d => {
          if (d.id && d.name) {
            topicMap.set(d.id, {
              id: d.id,
              name: d.name,
              category_slug: d.category_slug || 'arithmetic-aptitude',
            });
          }
        });
      }
    } catch {}

    return Array.from(topicMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  },

  getTechnicalMcqTopics() {
    return TECHNICAL_MCQ_SUBJECTS;
  },

  getCodingTopics(track?: string) {
    if (!track || track === 'ALL') return CODING_CATEGORIES;
    return CODING_CATEGORIES.filter(c => c.track === track);
  },
};
