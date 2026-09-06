export interface College {
  id: string;
  name: string;
  code: string;
  slug: string;
  logo_url?: string;
  city?: string;
  state?: string;
  contract_status: 'ACTIVE' | 'PILOT' | 'EXPIRED' | 'SUSPENDED';
  max_licenses: number;
  valid_until: string;
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface CollegeBatch {
  id: string;
  college_id: string;
  name: string;
  passout_year: number;
  departments: string[];
  created_at: string;
}

export interface TpoAuthorizationRecord {
  id: string;
  email: string;
  college_id: string;
  college_name: string;
  college_code: string;
  max_licenses: number;
  assigned_at: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
}

export interface CollegeStudent {
  id: string;
  email: string;
  name: string;
  user_id?: string | null;
  roll_number?: string;
  department?: string;
  batch_year?: number;
  batch_id?: string;
  batch_name?: string;
  college_id?: string;
  college_name?: string;
  max_licenses?: number;
  is_tpo_admin?: boolean;
  role?: string;
  created_at?: string;
}

export interface MockExam {
  id: string;
  college_id: string;
  created_by?: string;
  title: string;
  target_company: string;
  description?: string;
  instructions?: string;
  duration_minutes: number;
  total_marks: number;
  passing_percentage: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  enable_tab_switch_detection: boolean;
  max_tab_switches_allowed: number;
  enable_fullscreen_lock: boolean;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results_immediately: boolean;
  target_departments: string[];
  target_batches?: string[];
  target_batch_year?: number;
  is_deleted?: boolean;
  created_at?: string;
  sections?: MockExamSection[];
}

export interface MockExamSection {
  id?: string;
  mock_exam_id?: string;
  name: string;
  section_order: number;
  duration_minutes?: number;
  marks_per_correct: number;
  negative_marking: number;
  question_ids: string[];
  topic_ids: string[];
  created_at?: string;
}

export interface ProctorEvent {
  timestamp: string;
  type: 'BLUR' | 'FOCUS' | 'FULLSCREEN_EXIT' | 'FULLSCREEN_ENTER' | 'TAB_SWITCH';
  details?: string;
}

export interface StudentExamResponse {
  selected_option: number | null;
  is_correct?: boolean;
  time_spent_sec: number;
  marked_review: boolean;
}

export interface SectionResultSummary {
  section_id: string;
  section_name: string;
  total_questions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  max_score: number;
  percentage: number;
  accuracy: number;
}

export interface CandidateResultSummary {
  total_score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'MALPRACTICE';
  tier_label: string;
  total_questions: number;
  total_attempted: number;
  total_correct: number;
  total_incorrect: number;
  total_unattempted: number;
  overall_accuracy: number;
  time_spent_seconds: number;
  tab_switch_count: number;
  proctor_status: 'CLEAN' | 'WARNING' | 'MALPRACTICE_TERMINATED';
  sections: SectionResultSummary[];
}

export interface StudentExamAttempt {
  id: string;
  mock_exam_id: string;
  student_id: string;
  student_email?: string;
  college_id: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'TERMINATED_MALPRACTICE' | 'TIMED_OUT' | 'GRADED';
  started_at: string;
  submitted_at?: string;
  time_spent_seconds: number;
  total_score: number;
  max_possible_score: number;
  percentage: number;
  passed: boolean;
  tab_switch_count: number;
  proctor_events: ProctorEvent[];
  responses: Record<string, StudentExamResponse>;
  result_summary?: CandidateResultSummary;
  student?: {
    name: string;
    email: string;
    roll_number?: string;
    department?: string;
  };
  updated_at?: string;
}

export interface BulkStudentRow {
  roll_number: string;
  name: string;
  email: string;
  department: string;
  batch_year: number;
  batch_id?: string;
  batch_name?: string;
  isValid?: boolean;
  error?: string;
}

export interface TpoDashboardStats {
  totalStudents: number;
  maxLicenses: number;
  activeExamsCount: number;
  totalAttempts: number;
  avgCollegeScore: number;
  departments: { department: string; studentCount: number; avgScore: number }[];
  tierCounts?: { tier1: number; tier2: number; tier3: number };
}

export interface TemplateSectionDraft {
  name: string;
  question_count: number;
  marks_per_correct: number;
  negative_marking: number;
  duration_minutes?: number;
  topic_ids?: string[];
  category?: 'arithmetic-aptitude' | 'logical-reasoning' | 'verbal-reasoning' | 'data-interpretation' | 'all';
}

export interface MockExamTemplate {
  id: string;
  name: string;
  target_company: string;
  badge?: string;
  description?: string;
  duration_minutes: number;
  passing_percentage: number;
  enable_fullscreen_lock?: boolean;
  enable_tab_switch_detection?: boolean;
  max_tab_switches_allowed?: number;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  show_results_immediately?: boolean;
  target_batches?: string[];
  target_departments?: string[];
  target_batch_year?: number;
  sections: TemplateSectionDraft[];
  is_default?: boolean;
  updated_at?: string;
}

