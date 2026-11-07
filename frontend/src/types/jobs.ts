export type JobType = 'JOB' | 'INTERNSHIP';

export interface JobListing {
  id: string;
  title: string;
  company_name: string;
  company_logo_url?: string | null;
  type: JobType;
  location: string;
  experience_min: number;
  experience_max?: number | null;
  stipend_or_salary?: string | null;
  description?: string | null;
  apply_url: string;
  deadline?: string | null;
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type JobSortOption = 'RECOMMENDED' | 'NEWEST' | 'CLOSING_SOON';

export type WorkModeFilter = 'ALL' | 'REMOTE' | 'HYBRID' | 'ON_SITE';

export interface JobListingFilters {
  type?: JobType | 'ALL';
  location?: string;
  workMode?: WorkModeFilter;
  expLevel?: 'ANY' | 'FRESHER' | '0-2' | '2-5' | '5+';
  tag?: string;
  search?: string;
  sortBy?: JobSortOption;
  closingSoonOnly?: boolean;
}

export type JobReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

export interface JobReport {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  reason: string;
  details?: string | null;
  status: JobReportStatus;
  admin_notes?: string | null;
  created_at: string;
  resolved_at?: string | null;
}

export interface ScrapedJobLead {
  id: string;
  company_name: string;
  company_logo_url?: string | null;
  title: string;
  type: JobType;
  location: string;
  stipend_or_salary?: string | null;
  apply_url: string;
  source: string;
  age: string;
  batch_eligibility?: string;
  tags: string[];
}

