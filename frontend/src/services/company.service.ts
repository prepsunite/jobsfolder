import { apiClient } from '@/lib/api-client';
import type { Company, PageResponse } from '@/types/company';

export const companyService = {
  getCompanies: async (search?: string, page = 0, size = 20): Promise<PageResponse<Company>> => {
    const response = await apiClient.get<PageResponse<Company>>('/companies', {
      params: { search, page, size },
    });
    return response.data;
  },

  getCompanyBySlug: async (slug: string): Promise<Company> => {
    const response = await apiClient.get<Company>(`/companies/${slug}`);
    return response.data;
  },

  createCompany: async (companyData: Partial<Company>): Promise<Company> => {
    const response = await apiClient.post<Company>('/companies', companyData);
    return response.data;
  },
};
