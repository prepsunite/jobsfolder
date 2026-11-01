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

export interface JobListingFilters {
  type?: JobType | 'ALL';
  location?: string;
  expLevel?: 'ANY' | 'FRESHER' | '0-2' | '2-5' | '5+';
  search?: string;
}
