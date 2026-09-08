export type InterviewCategory = 'CORE_CS' | 'HR_BEHAVIORAL' | 'PROJECT_DEFENSE';

export type CoreCsSubject = 'DBMS' | 'OOPS' | 'OPERATING_SYSTEMS' | 'COMPUTER_NETWORKS' | 'SQL_QUERIES' | string;

export interface InterviewTopic {
  id: string;
  title: string;
  name?: string;
  category: InterviewCategory;
  cluster: string;
  description: string;
  iconName: string;
  icon_name?: string;
  totalQuestions?: number;
  is_hidden?: boolean;
  formulas?: string[];
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface InterviewQuestion {
  id: string;
  topicId?: string;
  topic_id?: string;
  title: string;
  category: InterviewCategory;
  subject?: CoreCsSubject;
  subjectLabel?: string;
  subject_label?: string;
  bulletPoints?: string[];
  bullet_points?: string[];
  answer: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  code_snippet?: any;
  proTip?: string;
  pro_tip?: string;
  companyTags?: string[];
  company_tags?: string[];
  frequency?: 'VERY_HIGH' | 'HIGH' | 'MEDIUM';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  mastered?: boolean;
  is_hidden?: boolean;
  is_deleted?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}
