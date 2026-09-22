import { supabase } from '@/lib/supabase';
import { CODING_CATEGORIES } from './mockExamBlueprint.service';

export interface TopicInventoryItem {
  id: string;
  name: string;
  category: string;
  type: 'MCQ' | 'CODING';
  count: number;
  target: number; // 500
  percentage: number;
  status: 'NEEDS_QUESTIONS' | 'HALF_STOCKED' | 'FULLY_STOCKED';
}

export interface BankMcqInput {
  topic_id: string;
  statement: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  company_slug?: string;
}

export interface BankCodingProblemInput {
  title: string;
  category: string; // e.g. 'ARRAYS', 'STRINGS', 'NUMBER_LOGIC'
  level: 'BASIC' | 'MEDIUM' | 'HARD';
  description: string;
  constraints?: string[];
  sample_input?: string;
  sample_output?: string;
  explanation?: string;
  test_cases?: { input: string; output: string; explanation?: string }[];
  solutions?: {
    cpp?: string;
    java?: string;
    python?: string;
    c?: string;
  };
  company_tags?: string[];
}

export const questionBankService = {
  /**
   * Retrieves all topics (Aptitude MCQs + Coding) with live inventory counts vs 500 target
   */
  async getTopicInventories(): Promise<TopicInventoryItem[]> {
    const inventories: TopicInventoryItem[] = [];

    // 1. Fetch all Aptitude Topics & Paginate through ALL topic_questions
    try {
      const { data: dbTopics } = await supabase
        .from('aptitude_topics')
        .select('id, name, category_slug')
        .order('name', { ascending: true });

      // PostgREST limits queries to 1000 rows by default. Paginate in 1000-row blocks to capture all questions.
      const countMap: Record<string, number> = {};
      const PAGE_SIZE = 1000;
      let page = 0;
      while (true) {
        const { data: batch, error } = await supabase
          .from('topic_questions')
          .select('topic_id')
          .eq('is_deleted', false)
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error || !batch || batch.length === 0) break;
        batch.forEach(row => {
          if (row.topic_id) {
            countMap[row.topic_id] = (countMap[row.topic_id] || 0) + 1;
          }
        });
        if (batch.length < PAGE_SIZE) break;
        page++;
      }

      (dbTopics || []).forEach(t => {
        const count = countMap[t.id] || 0;
        const target = 500;
        const percentage = Math.min(100, Math.round((count / target) * 100));
        let status: 'NEEDS_QUESTIONS' | 'HALF_STOCKED' | 'FULLY_STOCKED' = 'NEEDS_QUESTIONS';
        if (count >= 500) status = 'FULLY_STOCKED';
        else if (count >= 250) status = 'HALF_STOCKED';

        inventories.push({
          id: t.id,
          name: t.name,
          category: t.category_slug,
          type: 'MCQ',
          count,
          target,
          percentage,
          status,
        });
      });
    } catch (e) {
      console.warn('[questionBankService.getTopicInventories] Aptitude topics notice:', e);
    }

    // 2. Fetch Coding Categories and problem counts across all 290 problems
    try {
      const { data: codingRows } = await supabase
        .from('technical_problems')
        .select('category')
        .eq('is_deleted', false);

      const codingCountMap: Record<string, number> = {};
      (codingRows || []).forEach(r => {
        if (r.category) {
          const catKey = String(r.category).trim().toUpperCase();
          codingCountMap[catKey] = (codingCountMap[catKey] || 0) + 1;
        }
      });

      const processedCodingIds = new Set<string>();

      CODING_CATEGORIES.forEach(c => {
        const catKey = c.id.trim().toUpperCase();
        if (processedCodingIds.has(catKey)) return;
        processedCodingIds.add(catKey);

        const count = codingCountMap[catKey] || 0;
        const target = 500;
        const percentage = Math.min(100, Math.round((count / target) * 100));
        let status: 'NEEDS_QUESTIONS' | 'HALF_STOCKED' | 'FULLY_STOCKED' = 'NEEDS_QUESTIONS';
        if (count >= 500) status = 'FULLY_STOCKED';
        else if (count >= 100) status = 'HALF_STOCKED';

        inventories.push({
          id: c.id,
          name: c.name,
          category: 'coding',
          type: 'CODING',
          count,
          target,
          percentage,
          status,
        });
      });

      // Dynamically discover any category present in technical_problems not already in CODING_CATEGORIES
      Object.keys(codingCountMap).forEach(catKey => {
        if (!processedCodingIds.has(catKey)) {
          processedCodingIds.add(catKey);
          const count = codingCountMap[catKey] || 0;
          const target = 500;
          const percentage = Math.min(100, Math.round((count / target) * 100));
          const formattedName = catKey
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());

          inventories.push({
            id: catKey,
            name: formattedName,
            category: 'coding',
            type: 'CODING',
            count,
            target,
            percentage,
            status: count >= 500 ? 'FULLY_STOCKED' : count >= 100 ? 'HALF_STOCKED' : 'NEEDS_QUESTIONS',
          });
        }
      });
    } catch (e) {
      console.warn('[questionBankService.getTopicInventories] Coding categories notice:', e);
    }

    return inventories;
  },

  /**
   * Retrieves questions for a specific topic (MCQ or Coding) with optional difficulty filtering
   */
  async getQuestionsByTopic(
    topicId: string,
    isCoding: boolean,
    search?: string,
    limit = 50,
    offset = 0,
    difficulty?: string
  ): Promise<{ items: any[]; total: number }> {
    if (isCoding) {
      const categoryVariants = Array.from(new Set([topicId, topicId.toUpperCase(), topicId.toLowerCase()]));
      let query = supabase
        .from('technical_problems')
        .select('*', { count: 'exact' })
        .in('category', categoryVariants)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (difficulty && difficulty !== 'ALL') {
        const codingLevel = difficulty === 'EASY' ? 'BASIC' : difficulty;
        query = query.eq('level', codingLevel);
      }

      if (search && search.trim()) {
        query = query.ilike('title', `%${search.trim()}%`);
      }

      const { data, count, error } = await query.range(offset, offset + limit - 1);
      if (error) {
        console.error('[getQuestionsByTopic] Coding error:', error);
        return { items: [], total: 0 };
      }
      return { items: data || [], total: count || 0 };
    }

    // MCQ Topic Questions
    let query = supabase
      .from('topic_questions')
      .select('id, statement, options, correct_answer, explanation, difficulty, difficulty_level, question_number, created_at, exam_id', {
        count: 'exact',
      })
      .eq('topic_id', topicId)
      .eq('is_deleted', false)
      .order('question_number', { ascending: true });

    if (difficulty && difficulty !== 'ALL') {
      query = query.eq('difficulty', difficulty);
    }

    if (search && search.trim()) {
      query = query.ilike('statement', `%${search.trim()}%`);
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      console.error('[getQuestionsByTopic] MCQ error:', error);
      return { items: [], total: 0 };
    }
    return { items: data || [], total: count || 0 };
  },

  /**
   * Adds a single MCQ into topic_questions
   */
  async addSingleMcq(input: BankMcqInput): Promise<any> {
    const id = `q-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const diff = input.difficulty || 'MEDIUM';
    const diffLevel = diff === 'EASY' ? 1 : diff === 'HARD' ? 3 : 2;

    const { data, error } = await supabase
      .from('topic_questions')
      .insert({
        id,
        topic_id: input.topic_id,
        exam_id: 'MOCK_EXAM_BANK',
        statement: input.statement,
        options: input.options,
        correct_answer: input.correct_answer,
        explanation: input.explanation || 'Detailed solution will be added shortly.',
        difficulty: diff,
        difficulty_level: diffLevel,
        company_slug: input.company_slug || null,
        is_deleted: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to insert MCQ question.');
    }
    return data;
  },

  /**
   * Adds a single Coding Problem into technical_problems
   */
  async addSingleCodingProblem(input: BankCodingProblemInput): Promise<any> {
    const id = `custom-p150-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('technical_problems')
      .insert({
        id,
        title: input.title,
        slug,
        track: 'MOCK_EXAM_BANK',
        category: input.category,
        category_label: input.category.replace(/_/g, ' '),
        level: input.level || 'MEDIUM',
        description: input.description,
        constraints: input.constraints || ['1 <= N <= 10^5'],
        sample_input: input.sample_input || '',
        sample_output: input.sample_output || '',
        explanation: input.explanation || '',
        test_cases: input.test_cases || [],
        solutions: input.solutions || {},
        company_tags: input.company_tags || ['TCS', 'Accenture', 'Amazon'],
        is_deleted: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to insert coding problem.');
    }
    return data;
  },

  /**
   * High-volume batch import: accepts an array of MCQs and batch-inserts into topic_questions
   */
  async bulkImportMcqs(
    topicId: string,
    questions: Array<{
      statement: string;
      options: string[];
      correct_answer: string;
      explanation?: string;
      difficulty?: string;
    }>
  ): Promise<{ inserted: number; errors: number }> {
    if (!questions || questions.length === 0) return { inserted: 0, errors: 0 };

    let inserted = 0;
    let errors = 0;
    const batchSize = 50;

    for (let i = 0; i < questions.length; i += batchSize) {
      const chunk = questions.slice(i, i + batchSize);
      const rows = chunk.map((q, idx) => ({
        id: `bulk-${Date.now().toString(36)}-${i + idx}-${Math.random().toString(36).substring(2, 6)}`,
        topic_id: topicId,
        exam_id: 'MOCK_EXAM_BANK',
        statement: q.statement,
        options: Array.isArray(q.options) ? q.options : [],
        correct_answer: String(q.correct_answer || 'A'),
        explanation: q.explanation || 'Solution explained in syllabus.',
        difficulty: q.difficulty || 'MEDIUM',
        difficulty_level: (q.difficulty || 'MEDIUM') === 'EASY' ? 1 : (q.difficulty || 'MEDIUM') === 'HARD' ? 3 : 2,
        is_deleted: false,
      }));

      try {
        const { error } = await supabase.from('topic_questions').insert(rows);
        if (error) {
          console.error('[bulkImportMcqs] Batch insert error:', error);
          errors += chunk.length;
        } else {
          inserted += chunk.length;
        }
      } catch (err) {
        errors += chunk.length;
      }
    }

    return { inserted, errors };
  },

  /**
   * Multi-topic batch import: accepts an array of questions where each question specifies its topic_id
   */
  async bulkImportMultiTopicMcqs(
    questions: Array<{
      topic_id: string;
      statement: string;
      options: string[];
      correct_answer: string;
      explanation?: string;
      difficulty?: string;
      company_slug?: string;
    }>
  ): Promise<{ inserted: number; errors: number }> {
    if (!questions || questions.length === 0) return { inserted: 0, errors: 0 };

    let inserted = 0;
    let errors = 0;
    const batchSize = 50;

    for (let i = 0; i < questions.length; i += batchSize) {
      const chunk = questions.slice(i, i + batchSize);
      const rows = chunk.map((q, idx) => ({
        id: `bulk-${Date.now().toString(36)}-${i + idx}-${Math.random().toString(36).substring(2, 6)}`,
        topic_id: q.topic_id,
        exam_id: 'MOCK_EXAM_BANK',
        statement: q.statement,
        options: Array.isArray(q.options) ? q.options : [],
        correct_answer: String(q.correct_answer || 'A'),
        explanation: q.explanation || 'Detailed step-by-step solution.',
        difficulty: q.difficulty || 'MEDIUM',
        difficulty_level: (q.difficulty || 'MEDIUM') === 'EASY' ? 1 : (q.difficulty || 'MEDIUM') === 'HARD' ? 3 : 2,
        company_slug: q.company_slug || null,
        is_deleted: false,
      }));

      try {
        const { error } = await supabase.from('topic_questions').insert(rows);
        if (error) {
          console.error('[bulkImportMultiTopicMcqs] Batch insert error:', error);
          errors += chunk.length;
        } else {
          inserted += chunk.length;
        }
      } catch (err) {
        errors += chunk.length;
      }
    }

    return { inserted, errors };
  },

  /**
   * High-volume batch import: accepts an array of coding problems and batch-inserts into technical_problems
   */
  async bulkImportCodingProblems(
    category: string,
    problems: Array<Partial<BankCodingProblemInput>>
  ): Promise<{ inserted: number; errors: number }> {
    if (!problems || problems.length === 0) return { inserted: 0, errors: 0 };

    let inserted = 0;
    let errors = 0;
    const batchSize = 25;

    for (let i = 0; i < problems.length; i += batchSize) {
      const chunk = problems.slice(i, i + batchSize);
      const rows = chunk.map((p, idx) => {
        const title = p.title || `Coding Challenge ${Date.now()}-${i + idx}`;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return {
          id: `custom-p150-${Date.now()}-${i + idx}-${Math.floor(Math.random() * 10000)}`,
          title,
          slug,
          track: 'MOCK_EXAM_BANK',
          category: category || p.category || 'ARRAYS',
          category_label: (category || p.category || 'ARRAYS').replace(/_/g, ' '),
          level: (p.level as any) || 'MEDIUM',
          description: p.description || 'Problem statement details.',
          constraints: p.constraints || ['1 <= N <= 10^5'],
          sample_input: p.sample_input || '',
          sample_output: p.sample_output || '',
          explanation: p.explanation || '',
          test_cases: p.test_cases || [],
          solutions: p.solutions || {},
          company_tags: p.company_tags || ['Campus Drive'],
          is_deleted: false,
        };
      });

      try {
        const { error } = await supabase.from('technical_problems').insert(rows);
        if (error) {
          console.error('[bulkImportCodingProblems] Batch insert error:', error);
          errors += chunk.length;
        } else {
          inserted += chunk.length;
        }
      } catch (err) {
        errors += chunk.length;
      }
    }

    return { inserted, errors };
  },

  /**
   * Deletes a question
   */
  async deleteQuestion(id: string, isCoding: boolean): Promise<boolean> {
    try {
      if (isCoding) {
        await supabase
          .from('technical_problems')
          .update({ is_deleted: true })
          .eq('id', id);
      } else {
        await supabase
          .from('topic_questions')
          .update({ is_deleted: true })
          .eq('id', id);
      }
      return true;
    } catch {
      return false;
    }
  },
};
