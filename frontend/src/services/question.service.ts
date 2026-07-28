import { apiClient } from '@/lib/api-client';
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
    const response = await apiClient.get<PageResponse<OaQuestion>>('/questions', {
      params: { companyId, difficulty, questionType, search, page, size },
    });
    return response.data;
  },

  getQuestionById: async (id: string): Promise<OaQuestion> => {
    const response = await apiClient.get<OaQuestion>(`/questions/${id}`);
    return response.data;
  },
};
