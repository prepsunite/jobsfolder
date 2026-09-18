import type { QuestionDifficulty } from './question';

export type ExperienceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ExperienceVerdict = 'SELECTED' | 'REJECTED' | 'WAITLISTED';
export type ExperienceDriveType = 'ON_CAMPUS' | 'OFF_CAMPUS' | 'POOL_CAMPUS';

export interface ExperienceRound {
  roundTitle: string;
  details: string;
}

export interface ExperienceItem {
  id: string;
  companyName: string;
  companySlug?: string;
  companyId?: string;
  role: string;
  studentName: string;
  authorName?: string;
  college: string;
  year: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | QuestionDifficulty;
  verdict: ExperienceVerdict;
  rounds: ExperienceRound[];
  status: ExperienceStatus;
  upvotes?: number;
  driveType?: ExperienceDriveType;
  overallExperience?: string;
  content?: string;
  tips?: string;
  resourcesUsed?: string;
  isAnonymous?: boolean;
  viewCount?: number;
  createdAt?: string;
}

export interface InterviewExperience {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  authorName: string;
  studentName?: string;
  role: string;
  college?: string;
  year?: number;
  difficulty?: QuestionDifficulty;
  content: string;
  overallExperience?: string;
  tips?: string;
  resourcesUsed?: string;
  status: ExperienceStatus;
  isAnonymous: boolean;
  viewCount: number;
  upvotes?: number;
  verdict?: ExperienceVerdict;
  driveType?: ExperienceDriveType;
  rounds?: ExperienceRound[];
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
