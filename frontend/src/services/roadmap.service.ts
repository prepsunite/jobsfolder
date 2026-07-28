import { apiClient } from '@/lib/api-client';
import type { Roadmap } from '@/types/roadmap';
import type { PageResponse } from '@/types/company';

export const roadmapService = {
  getPublishedRoadmaps: async (page = 0, size = 20): Promise<PageResponse<Roadmap>> => {
    const response = await apiClient.get<PageResponse<Roadmap>>('/roadmaps', {
      params: { page, size },
    });
    return response.data;
  },

  getRoadmapById: async (id: string): Promise<Roadmap> => {
    const response = await apiClient.get<Roadmap>(`/roadmaps/${id}`);
    return response.data;
  },
};
