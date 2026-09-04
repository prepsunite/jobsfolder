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
  upvotes?: number;
  verdict?: 'SELECTED' | 'REJECTED' | 'WAITLISTED';
  driveType?: 'ON_CAMPUS' | 'OFF_CAMPUS' | 'POOL_CAMPUS';
  createdAt: string;
}

export interface SubmitExperienceRequest {
  companyId: string;
  role: string;
  studentName?: string;
  college?: string;
  year?: number;
  difficulty?: QuestionDifficulty;
  content: string;
  tips?: string;
  resourcesUsed?: string;
  isAnonymous?: boolean;
}
