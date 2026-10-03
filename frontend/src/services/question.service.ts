import { supabase } from '@/lib/supabase';
import { dataStore } from '@/services/dataStore';
import type { OaQuestion, QuestionDifficulty, QuestionType } from '@/types/question';
import type { PageResponse } from '@/types/company';
import { auditService } from '@/services/audit.service';

export const questionService = {
  getQuestions: async (
    companySlug?: string,
    difficulty?: QuestionDifficulty,
    questionType?: QuestionType,
    search?: string,
    page = 0,
    size = 20
  ): Promise<PageResponse<OaQuestion>> => {
    try {
      let query = supabase
        .from('topic_questions')
        .select('*', { count: 'exact' })
        .eq('is_deleted', false)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });

      if (companySlug) {
        query = query.eq('company_slug', companySlug);
      }
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      if (search && search.trim()) {
        query = query.ilike('statement', `%${search.trim()}%`);
      }

      const start = page * size;
      const end = start + size - 1;
      query = query.range(start, end);

      const { data, count, error } = await query;

      if (error) {
        console.error('[questionService.getQuestions] Supabase error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        const mapped: OaQuestion[] = data.map(q => ({
          id: q.id,
          companyId: q.company_slug,
          companyName: (q.company_slug || 'tcs').toUpperCase(),
          companySlug: q.company_slug,
          title: q.statement || 'Topic Question',
          description: q.statement || '',
          difficulty: q.difficulty as QuestionDifficulty || 'MEDIUM',
          questionType: (questionType || 'CODING') as QuestionType,
          explanation: q.explanation || '',
          solution: q.explanation || '',
          frequency: 85,
          isVerified: true,
          createdAt: q.created_at || new Date().toISOString(),
        }));

        const total = count ?? mapped.length;
        return {
          content: mapped,
          pageable: { pageNumber: page, pageSize: size },
          totalElements: total,
          totalPages: Math.ceil(total / size),
          last: end >= total - 1,
          first: page === 0,
        };
      }
    } catch (err) {
      console.warn('[questionService.getQuestions] Fallback to local dataStore:', err);
    }

    const local = dataStore.getQuestions();
    const mappedLocal: OaQuestion[] = local.map(q => {
      const qAny = q as any;
      const stmt = qAny.statement || q.title || qAny.problemStatement || 'Question';
      const slug = qAny.companySlug || 'tcs';
      return {
        id: q.id,
        companySlug: slug,
        companyName: slug.toUpperCase(),
        title: stmt,
        description: stmt,
        difficulty: (q.difficulty as QuestionDifficulty) || 'MEDIUM',
        questionType: 'CODING',
        explanation: q.explanation || '',
        frequency: 90,
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
    });

    return {
      content: mappedLocal,
      pageable: { pageNumber: page, pageSize: size },
      totalElements: mappedLocal.length,
      totalPages: Math.ceil(mappedLocal.length / size),
      last: true,
      first: page === 0,
    };
  },

  getQuestionById: async (id: string): Promise<OaQuestion> => {
    try {
      const { data, error } = await supabase
        .from('topic_questions')
        .select('*')
        .eq('id', id)
        .eq('is_deleted', false)
        .maybeSingle();

      if (error) {
        console.error('[questionService.getQuestionById] Supabase error:', error);
        throw error;
      }

      if (data) {
        return {
          id: data.id,
          companyId: data.company_slug,
          companyName: (data.company_slug || 'tcs').toUpperCase(),
          companySlug: data.company_slug,
          title: data.statement || 'Question',
          description: data.statement || '',
          difficulty: (data.difficulty as QuestionDifficulty) || 'MEDIUM',
          questionType: 'CODING',
          explanation: data.explanation || '',
          solution: data.explanation || '',
          frequency: 85,
          isVerified: true,
          createdAt: data.created_at || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('[questionService.getQuestionById] Fallback to local dataStore:', err);
    }

    const local = dataStore.getQuestions().find(q => q.id === id);
    if (local) {
      const qAny = local as any;
      const stmt = qAny.statement || local.title || qAny.problemStatement || 'Question';
      const slug = qAny.companySlug || 'tcs';
      return {
        id: local.id,
        companySlug: slug,
        companyName: slug.toUpperCase(),
        title: stmt,
        description: stmt,
        difficulty: (local.difficulty as QuestionDifficulty) || 'MEDIUM',
        questionType: 'CODING',
        explanation: local.explanation || '',
        frequency: 90,
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
    }

    return {
      id,
      title: 'Question Not Found',
      difficulty: 'MEDIUM',
      questionType: 'CODING',
      frequency: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
  },

  createQuestion: async (qData: Partial<OaQuestion>): Promise<OaQuestion> => {
    const payload = {
      topic_id: 'general',
      company_slug: qData.companySlug || 'tcs',
      statement: qData.title || qData.description || 'New Question',
      options: JSON.stringify([]),
      correct_answer: 0,
      explanation: qData.explanation || qData.solution || '',
      structured_explanation: JSON.stringify({}),
      difficulty: qData.difficulty || 'MEDIUM',
      difficulty_level: 2,
      is_hidden: false,
      is_deleted: false,
    };

    const { data, error } = await supabase
      .from('topic_questions')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('[questionService.createQuestion] Supabase error:', error);
      throw error;
    }

    auditService.logAction({
      action: 'CREATE_TOPIC_QUESTION',
      targetEntity: 'topic_questions',
      targetId: data.id,
      afterData: data,
    });

    const created: OaQuestion = {
      id: data.id,
      companyId: data.company_slug,
      companyName: data.company_slug.toUpperCase(),
      companySlug: data.company_slug,
      title: data.statement,
      description: data.statement,
      difficulty: data.difficulty as QuestionDifficulty,
      questionType: qData.questionType || 'CODING',
      explanation: data.explanation,
      solution: data.explanation,
      frequency: 100,
      isVerified: true,
      createdAt: data.created_at,
    };

    return created;
  },
};
