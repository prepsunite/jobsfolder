export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'CODING' | 'SQL' | 'APTITUDE' | 'MCQ' | 'PUZZLE' | 'TECHNICAL' | 'HR';

export interface OaQuestion {
  id: string;
  companyId?: string;
  companyName?: string;
  companySlug?: string;
  title: string;
  description?: string;
  difficulty: QuestionDifficulty;
  questionType: QuestionType;
  solution?: string;
  explanation?: string;
  sampleInput?: string;
  sampleOutput?: string;
  testCase?: string;
  frequency: number;
  year?: number;
  isVerified: boolean;
  tags?: string[];
  createdAt: string;
}
