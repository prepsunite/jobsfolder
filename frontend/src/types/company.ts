export interface CompanyRole {
  id: string;
  title: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  eligibility?: string;
  roleType?: string;
  description?: string;
}

export interface HiringProcessRound {
  id: string;
  roundNumber: number;
  roundType: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  tips?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  foundedYear?: number;
  isActive: boolean;
  createdAt: string;
  roles?: CompanyRole[];
  hiringProcesses?: HiringProcessRound[];
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
