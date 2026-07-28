import type { QuestionDifficulty } from './question';

export type ExperienceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface InterviewExperience {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  authorName: string;
  role: string;
  college?: string;
  year?: number;
  difficulty?: QuestionDifficulty;
  content: string;
  tips?: string;
  resourcesUsed?: string;
  status: ExperienceStatus;
  isAnonymous: boolean;
  viewCount: number;
  createdAt: string;
}

export interface SubmitExperienceRequest {
  companyId: string;
  role: string;
  college?: string;
  year?: number;
  difficulty?: QuestionDifficulty;
  content: string;
  tips?: string;
  resourcesUsed?: string;
  isAnonymous?: boolean;
}
