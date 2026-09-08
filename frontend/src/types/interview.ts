export type InterviewCategory = 'CORE_CS' | 'HR_BEHAVIORAL' | 'PROJECT_DEFENSE';

export type CoreCsSubject = 'DBMS' | 'OOPS' | 'OPERATING_SYSTEMS' | 'COMPUTER_NETWORKS' | 'SQL_QUERIES';

export interface InterviewTopic {
  id: string;
  title: string;
  category: InterviewCategory;
  cluster: string;
  description: string;
  iconName: string;
  totalQuestions?: number;
}

export interface InterviewQuestion {
  id: string;
  topicId?: string;
  title: string;
  category: InterviewCategory;
  subject?: CoreCsSubject;
  subjectLabel?: string;
  bulletPoints?: string[];
  answer: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  proTip?: string;
  companyTags?: string[];
  frequency?: 'VERY_HIGH' | 'HIGH' | 'MEDIUM';
  mastered?: boolean;
}
