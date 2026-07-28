import { apiClient } from '@/lib/api-client';
import type { Resource, ResourceCategory } from '@/types/resource';
import type { PageResponse } from '@/types/company';

export const resourceService = {
  getResources: async (
    category?: ResourceCategory,
    search?: string,
    page = 0,
    size = 20
  ): Promise<PageResponse<Resource>> => {
    const response = await apiClient.get<PageResponse<Resource>>('/resources', {
      params: { category, search, page, size },
    });
    return response.data;
  },

  getResourceById: async (id: string): Promise<Resource> => {
    const response = await apiClient.get<Resource>(`/resources/${id}`);
    return response.data;
  },
};
