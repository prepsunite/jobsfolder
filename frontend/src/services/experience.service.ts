import { apiClient } from '@/lib/api-client';
import { dataStore } from '@/services/dataStore';
import type { InterviewExperience, SubmitExperienceRequest } from '@/types/experience';
import type { PageResponse } from '@/types/company';

export const experienceService = {
  getApprovedExperiences: async (
    companyId?: string,
    search?: string,
    page = 0,
    size = 15
  ): Promise<PageResponse<InterviewExperience>> => {
    try {
      const response = await apiClient.get<PageResponse<InterviewExperience>>('/experiences', {
        params: { companyId, search, page, size },
      });
      return response.data;
    } catch {
      const local = dataStore.getExperiences().filter(e => e.status === 'APPROVED');
      return {
        content: local as unknown as InterviewExperience[],
        pageable: { pageNumber: page, pageSize: size },
        totalElements: local.length,
        totalPages: Math.ceil(local.length / size),
        last: true,
        first: page === 0,
      };
    }
  },

  getExperienceById: async (id: string): Promise<InterviewExperience> => {
    try {
      const response = await apiClient.get<InterviewExperience>(`/experiences/${id}`);
      return response.data;
    } catch {
      const local = dataStore.getExperiences().find(e => e.id === id);
      return (local || {}) as unknown as InterviewExperience;
    }
  },

  submitExperience: async (data: SubmitExperienceRequest): Promise<InterviewExperience> => {
    try {
      const response = await apiClient.post<InterviewExperience>('/experiences', data);
      return response.data;
    } catch {
      const created = dataStore.addExperience(data as any);
      return created as unknown as InterviewExperience;
    }
  },
};
