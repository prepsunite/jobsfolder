export type ProblemLevel = 'BASIC' | 'MEDIUM' | 'HARD';

export type ProblemCategory =
  | 'SYNTAX_BASICS'
  | 'NUMBER_LOGIC'
  | 'PATTERNS'
  | 'ARRAYS'
  | 'STRINGS'
  | 'RECURSION'
  | 'TWO_POINTERS'
  | 'SLIDING_WINDOW'
  | 'STACKS_QUEUES'
  | 'LINKED_LISTS'
  | 'TREES_BINARY_TREES'
  | 'DYNAMIC_PROGRAMMING'
  | 'BIT_MANIPULATION'
  | 'SEARCHING_SORTING'
  | 'C_PROGRAMMING'
  | 'CPP_PROGRAMMING'
  | 'JAVA_PROGRAMMING'
  | 'DATABASE'
  | 'OPERATING_SYSTEMS'
  | 'NETWORKING'
  | 'DATA_STRUCTURES'
  | 'PSEUDO_CODE'
  | string;

export type TechnicalTrack = 'PROGRAMMING_150' | 'CAMPUS_DSA' | 'TECHNICAL_MCQS';

export interface MultiLanguageSolution {
  java?: string;
  python?: string;
  cpp?: string;
  c?: string;
}

export interface ProgrammingTopic {
  id: string;
  title: string;
  name?: string;
  cluster: string;
  description: string;
  iconName: string;
  icon_name?: string;
  category: ProblemCategory;
  order?: number;
  sort_order?: number;
  track?: TechnicalTrack;
  is_hidden?: boolean;
  tips?: string[];
  totalProblems?: number;
  subtopicIds?: string[];
  subtopics?: { id: string; title: string; description?: string }[];
  stageNumber?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProgrammingProblem {
  id: string;
  title: string;
  slug: string;
  track: 'PROGRAMMING_150' | 'CAMPUS_DSA';
  level: ProblemLevel;
  category: ProblemCategory;
  categoryLabel?: string;
  category_label?: string;
  topicId?: string;
  topic_id?: string;
  description: string;
  constraints?: string[];
  testCases?: TestCase[];
  test_cases?: TestCase[];
  sampleCases?: TestCase[];
  sampleInput?: string;
  sample_input?: string;
  sampleOutput?: string;
  sample_output?: string;
  explanation?: string;
  solutions: MultiLanguageSolution;
  timeComplexity?: string;
  time_complexity?: string;
  spaceComplexity?: string;
  space_complexity?: string;
  hints?: string[];
  companyTags?: string[];
  company_tags?: string[];
  is_hidden?: boolean;
  is_deleted?: boolean;
  sort_order?: number;
  solved?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TechnicalMcq {
  id: string;
  topic: string;
  topicCategory:
    | 'C_PROGRAMMING'
    | 'CPP_PROGRAMMING'
    | 'CSHARP_PROGRAMMING'
    | 'JAVA_PROGRAMMING'
    | 'DATABASE'
    | 'NETWORKING'
    | 'OPERATING_SYSTEMS'
    | 'DATA_STRUCTURES'
    | 'PSEUDO_CODE'
    | string;
  topic_category?: string;
  topicId?: string;
  topic_id?: string;
  topic_name?: string;
  question: string;
  codeSnippet?: string;
  code_snippet?: string;
  options: string[];
  correctOptionIndex: number;
  correct_option_index?: number;
  explanation: string;
  companyTags?: string[];
  company_tags?: string[];
  difficulty?: string;
  is_hidden?: boolean;
  is_deleted?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TechnicalMcqProgress {
  solved: boolean;
  wrongPicks: number[];
  selectedOption?: number;
  timestamp?: number;
}
