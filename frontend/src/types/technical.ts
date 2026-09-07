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
  | 'SEARCHING_SORTING';

export type TechnicalTrack = 'PROGRAMMING_150' | 'CAMPUS_DSA' | 'TECHNICAL_MCQS';

export interface MultiLanguageSolution {
  java?: string;
  python?: string;
  cpp?: string;
  c?: string;
}

export interface ProgrammingProblem {
  id: string;
  title: string;
  slug: string;
  track: 'PROGRAMMING_150' | 'CAMPUS_DSA';
  level: ProblemLevel;
  category: ProblemCategory;
  categoryLabel: string;
  description: string;
  constraints?: string[];
  sampleInput: string;
  sampleOutput: string;
  explanation?: string;
  solutions: MultiLanguageSolution;
  timeComplexity: string;
  spaceComplexity: string;
  hints?: string[];
  companyTags?: string[];
  solved?: boolean;
}

export interface TechnicalMcq {
  id: string;
  topic: string;
  topicCategory: 'C_CPP_SNIPPETS' | 'JAVA_SNIPPETS' | 'PYTHON_SNIPPETS' | 'DATA_STRUCTURES' | 'PSEUDO_CODE';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  companyTags?: string[];
}
