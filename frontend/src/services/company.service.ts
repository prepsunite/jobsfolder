import { apiClient } from '@/lib/api-client';
import { dataStore } from '@/services/dataStore';
import type { Company, PageResponse } from '@/types/company';

export const companyService = {
  getCompanies: async (search?: string, page = 0, size = 20): Promise<PageResponse<Company>> => {
    try {
      const response = await apiClient.get<PageResponse<Company>>('/companies', {
        params: { search, page, size },
      });
      return response.data;
    } catch {
      const local = dataStore.getCompanies();
      const filtered = search
        ? local.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase()))
        : local;
      return {
        content: filtered as unknown as Company[],
        pageable: { pageNumber: page, pageSize: size },
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        last: true,
        first: page === 0,
      };
    }
  },

  getCompanyBySlug: async (slug: string): Promise<Company> => {
    try {
      const response = await apiClient.get<Company>(`/companies/${slug}`);
      return response.data;
    } catch {
      const local = dataStore.getCompanies().find(c => c.slug === slug);
      if (local) return local as unknown as Company;
      return {
        id: `c-${slug}`,
        name: slug.toUpperCase(),
        slug: slug,
        description: `${slug.toUpperCase()} placement intelligence and hiring insights.`,
        industry: 'Technology & Services',
        companySize: '10,000+ employees',
        headquarters: 'Global',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
    }
  },

  createCompany: async (companyData: Partial<Company>): Promise<Company> => {
    try {
      const response = await apiClient.post<Company>('/companies', companyData);
      return response.data;
    } catch {
      return dataStore.addCompany(companyData as any) as unknown as Company;
    }
  },
};
