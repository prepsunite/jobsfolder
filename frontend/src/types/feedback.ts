export type ReportIssueType =
  | 'INCORRECT_ANSWER'
  | 'INACCURATE_EXPLANATION'
  | 'TYPO_OR_FORMATTING'
  | 'AMBIGUOUS_OPTIONS'
  | 'OUTDATED_QUESTION'
  | 'OTHER';

export type ReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

export interface QuestionReport {
  id: string;
  question_id: string;
  question_statement: string;
  company_slug?: string;
  topic_id?: string;
  issue_type: ReportIssueType;
  details?: string;
  reporter_email?: string;
  status: ReportStatus;
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export type ContactMessageStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface SubmitReportPayload {
  questionId: string;
  questionStatement: string;
  companySlug?: string;
  topicId?: string;
  issueType: ReportIssueType;
  details?: string;
  reporterEmail?: string;
}

export interface SubmitContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}
