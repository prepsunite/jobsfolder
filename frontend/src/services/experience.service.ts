import { apiClient } from '@/lib/api-client';
import type { InterviewExperience, SubmitExperienceRequest } from '@/types/experience';
import type { PageResponse } from '@/types/company';

export const experienceService = {
  getApprovedExperiences: async (
    companyId?: string,
    search?: string,
    page = 0,
    size = 15
  ): Promise<PageResponse<InterviewExperience>> => {
    const response = await apiClient.get<PageResponse<InterviewExperience>>('/experiences', {
      params: { companyId, search, page, size },
    });
    return response.data;
  },

  getExperienceById: async (id: string): Promise<InterviewExperience> => {
    const response = await apiClient.get<InterviewExperience>(`/experiences/${id}`);
    return response.data;
  },

  submitExperience: async (data: SubmitExperienceRequest): Promise<InterviewExperience> => {
    const response = await apiClient.post<InterviewExperience>('/experiences', data);
    return response.data;
  },
};
