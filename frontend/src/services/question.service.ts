import { apiClient } from '@/lib/api-client';
import { dataStore } from '@/services/dataStore';
import type { OaQuestion, QuestionDifficulty, QuestionType } from '@/types/question';
import type { PageResponse } from '@/types/company';

export const questionService = {
  getQuestions: async (
    companyId?: string,
    difficulty?: QuestionDifficulty,
    questionType?: QuestionType,
    search?: string,
    page = 0,
    size = 20
  ): Promise<PageResponse<OaQuestion>> => {
    try {
      const response = await apiClient.get<PageResponse<OaQuestion>>('/questions', {
        params: { companyId, difficulty, questionType, search, page, size },
      });
      return response.data;
    } catch {
      const local = dataStore.getQuestions();
      return {
        content: local as unknown as OaQuestion[],
        pageable: { pageNumber: page, pageSize: size },
        totalElements: local.length,
        totalPages: Math.ceil(local.length / size),
        last: true,
        first: page === 0,
      };
    }
  },

  getQuestionById: async (id: string): Promise<OaQuestion> => {
    try {
      const response = await apiClient.get<OaQuestion>(`/questions/${id}`);
      return response.data;
    } catch {
      const local = dataStore.getQuestions().find(q => q.id === id);
      return (local || {}) as unknown as OaQuestion;
    }
  },
};
