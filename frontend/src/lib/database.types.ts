export type Json = any;

export type Database = any;

export interface ProfileRow {
  id: string;
  email: string;
  name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string;
  is_tpo_admin?: boolean;
  college_id?: string | null;
  roll_number?: string | null;
  department?: string | null;
  phone_number?: string | null;
  branch?: string | null;
  graduation_year?: number | null;
  cgpa?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyRow {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  industry: string | null;
  description: string | null;
  about_company: string | null;
  company_size: string | null;
  headquarters: string | null;
  website: string | null;
  is_hidden: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamRow {
  id: string;
  company_slug: string;
  company_id: string | null;
  name: string;
  badge: string | null;
  content: string | null;
  old_papers: string | null;
  paper_tabs: Json;
  price: number;
  google_doc_embed_url: string | null;
  google_doc_edit_url: string | null;
  is_public_exam: boolean;
  is_hidden: boolean;
  is_deleted: boolean;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface TopicQuestionRow {
  id: string;
  topic_id: string;
  question_number: number;
  statement: string;
  options: Json;
  correct_option_index: number;
  correct_answer?: string | null;
  explanation: string | null;
  difficulty: string;
  is_hidden: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestionRow {
  id: string;
  category: string;
  subject: string | null;
  subject_label: string | null;
  topic_id: string | null;
  title: string;
  answer: string;
  bullet_points: Json;
  code_snippet: Json;
  pro_tip: string | null;
  company_tags: Json;
  frequency: string;
  is_hidden: boolean;
  is_deleted: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TechnicalProblemRow {
  id: string;
  track: string;
  topic_id: string | null;
  slug: string;
  title: string;
  level: string;
  category: string | null;
  category_label: string | null;
  description: string;
  constraints: Json;
  sample_input: string | null;
  sample_output: string | null;
  explanation: string | null;
  time_complexity: string | null;
  space_complexity: string | null;
  hints: Json;
  company_tags: Json;
  solutions: Json;
  is_hidden: boolean;
  is_deleted: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TechnicalMcqRow {
  id: string;
  topic_id: string | null;
  topic_category: string;
  question: string;
  code_snippet: string | null;
  options: Json;
  correct_option_index: number;
  explanation: string | null;
  difficulty: string;
  company_tags: Json;
  is_hidden: boolean;
  is_deleted: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceRow {
  id: string;
  company_slug: string;
  company_name: string | null;
  role_title: string;
  student_name: string | null;
  student_email: string | null;
  user_id: string | null;
  college: string | null;
  year: number;
  difficulty: string;
  verdict: string;
  upvotes: number;
  drive_type: string;
  rounds: Json;
  overall_experience: string | null;
  tips: string | null;
  resources_used: string | null;
  is_anonymous: boolean;
  status: string;
  decline_reason: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
