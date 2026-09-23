import { supabase } from '@/lib/supabase';
import {
  FALLBACK_APTITUDE_TOPICS,
  TECHNICAL_MCQ_SUBJECTS,
  CODING_CATEGORIES,
} from './mockExamBlueprint.service';

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

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /**
   * F18: Safely parse and validate a test_cases value.
   * Accepts an array or a JSON string; skips rows missing input/expected_output.
   * Never throws — returns an empty array for completely invalid input.
   */
  _parseTestCases(raw: unknown): { input: string; expected_output: string; explanation?: string }[] {
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!Array.isArray(parsed)) {
        console.warn('[questionBankService._parseTestCases] test_cases is not an array, skipping:', typeof parsed);
        return [];
      }
      const valid: { input: string; expected_output: string; explanation?: string }[] = [];
      for (const tc of parsed) {
        if (!tc || typeof tc !== 'object') continue;
        const inp = tc.input;
        const out = tc.expected_output ?? tc.output;
        if (typeof inp !== 'string' || typeof out !== 'string') {
          console.warn('[questionBankService._parseTestCases] Skipping malformed test case (missing string input/output):', tc);
          continue;
        }
        valid.push({ input: inp, expected_output: out, explanation: tc.explanation });
      }
      return valid;
    } catch (e) {
      console.warn('[questionBankService._parseTestCases] Failed to parse test_cases:', e);
      return [];
    }
  },

  /**
   * Retrieves all topics (Aptitude MCQs + Core CS MCQs + Coding) with live inventory counts vs 500 target
   */
  async getTopicInventories(): Promise<TopicInventoryItem[]> {
    const inventories: TopicInventoryItem[] = [];

    // 1. Fetch all Aptitude Topics (merging canonical FALLBACK_APTITUDE_TOPICS with live DB aptitude_topics)
    try {
      const topicMap = new Map<string, { id: string; name: string; category_slug: string }>();
      FALLBACK_APTITUDE_TOPICS.forEach(t => topicMap.set(t.id, t));

      const { data: dbTopics } = await supabase
        .from('aptitude_topics')
        .select('id, name, category_slug')
        .order('name', { ascending: true });

      if (dbTopics && dbTopics.length > 0) {
        dbTopics.forEach(t => {
          if (t.id && t.name) {
            topicMap.set(t.id, {
              id: t.id,
              name: t.name,
              category_slug: t.category_slug || 'arithmetic-aptitude',
            });
          }
        });
      }

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

      Array.from(topicMap.values()).forEach(t => {
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

    // 2. Fetch Core CS Technical MCQ Subjects & live counts from technical_mcqs table
    // F17: Paginate to avoid the 1000-row default cap
    try {
      const techCountMap: Record<string, number> = {};
      const PAGE_SIZE = 1000;
      let page = 0;
      while (true) {
        const { data: techBatch, error: techErr } = await supabase
          .from('technical_mcqs')
          .select('topic_id')
          .eq('is_deleted', false)
          .order('id', { ascending: true })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (techErr) { console.warn('[questionBankService] technical_mcqs page error:', techErr.message); break; }
        if (!techBatch || techBatch.length === 0) break;
        techBatch.forEach(r => {
          if (r.topic_id) {
            techCountMap[r.topic_id] = (techCountMap[r.topic_id] || 0) + 1;
          }
        });
        if (techBatch.length < PAGE_SIZE) break;
        page++;
      }

      TECHNICAL_MCQ_SUBJECTS.forEach(s => {
        const count = techCountMap[s.id] || 0;
        const target = 500;
        const percentage = Math.min(100, Math.round((count / target) * 100));
        let status: 'NEEDS_QUESTIONS' | 'HALF_STOCKED' | 'FULLY_STOCKED' = 'NEEDS_QUESTIONS';
        if (count >= 500) status = 'FULLY_STOCKED';
        else if (count >= 100) status = 'HALF_STOCKED';

        inventories.push({
          id: s.id,
          name: s.name,
          category: 'technical-mcqs',
          type: 'MCQ',
          count,
          target,
          percentage,
          status,
        });
      });
    } catch (e) {
      console.warn('[questionBankService.getTopicInventories] Technical MCQs notice:', e);
    }

    // 3. Fetch Coding Categories and problem counts across all problems
    // F17: Paginate to avoid the 1000-row default cap
    try {
      const codingCountMap: Record<string, number> = {};
      const PAGE_SIZE = 1000;
      let page = 0;
      while (true) {
        const { data: codingBatch, error: codingErr } = await supabase
          .from('technical_problems')
          .select('category')
          .eq('is_deleted', false)
          .order('id', { ascending: true })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (codingErr) { console.warn('[questionBankService] technical_problems page error:', codingErr.message); break; }
        if (!codingBatch || codingBatch.length === 0) break;
        codingBatch.forEach(r => {
          if (r.category) {
            const catKey = String(r.category).trim().toUpperCase();
            codingCountMap[catKey] = (codingCountMap[catKey] || 0) + 1;
          }
        });
        if (codingBatch.length < PAGE_SIZE) break;
        page++;
      }

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
   * Retrieves questions for a specific topic (Aptitude MCQ, Core CS MCQ, or Coding) with optional difficulty filtering
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

    // Core CS Technical MCQs
    if (topicId.startsWith('mcq-')) {
      let query = supabase
        .from('technical_mcqs')
        .select('*', { count: 'exact' })
        .eq('topic_id', topicId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (difficulty && difficulty !== 'ALL') {
        query = query.eq('difficulty', difficulty);
      }

      if (search && search.trim()) {
        query = query.ilike('question', `%${search.trim()}%`);
      }

      const { data, count, error } = await query.range(offset, offset + limit - 1);
      if (error) {
        console.error('[getQuestionsByTopic] Technical MCQ error:', error);
        return { items: [], total: 0 };
      }

      const normalizedItems = (data || []).map((r, idx) => {
        let correctLetter = 'A';
        if (typeof r.correct_option_index === 'number') {
          correctLetter = String.fromCharCode(65 + r.correct_option_index);
        } else if (typeof r.correct_answer === 'string') {
          correctLetter = r.correct_answer;
        }

        return {
          id: r.id,
          topic_id: r.topic_id,
          statement: r.question || r.statement || '',
          options: Array.isArray(r.options) ? r.options : [],
          correct_answer: correctLetter,
          explanation: r.explanation || '',
          difficulty: r.difficulty || 'MEDIUM',
          difficulty_level: r.difficulty === 'EASY' ? 1 : r.difficulty === 'HARD' ? 3 : 2,
          question_number: offset + idx + 1,
          created_at: r.created_at,
        };
      });

      return { items: normalizedItems, total: count || 0 };
    }

    // Aptitude MCQ Topic Questions
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
   * Adds a single MCQ into topic_questions or technical_mcqs
   */
  async addSingleMcq(input: BankMcqInput): Promise<any> {
    const diff = input.difficulty || 'MEDIUM';
    const diffLevel = diff === 'EASY' ? 1 : diff === 'HARD' ? 3 : 2;

    if (input.topic_id.startsWith('mcq-')) {
      const id = `tech-mcq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const subj = TECHNICAL_MCQ_SUBJECTS.find(s => s.id === input.topic_id);
      
      let correctIdx = 0;
      const ansUpper = (input.correct_answer || 'A').toUpperCase().trim();
      if (ansUpper >= 'A' && ansUpper <= 'Z') {
        correctIdx = ansUpper.charCodeAt(0) - 65;
      } else {
        const num = parseInt(ansUpper, 10);
        correctIdx = !isNaN(num) ? num : 0;
      }

      const { data, error } = await supabase
        .from('technical_mcqs')
        .insert({
          id,
          topic_id: input.topic_id,
          topic_name: subj?.name || 'Core CS',
          topic_category: subj?.category || 'SYNTAX_BASICS',
          question: input.statement,
          options: input.options,
          correct_option_index: correctIdx,
          explanation: input.explanation || 'Detailed solution will be added shortly.',
          difficulty: diff,
          company_tags: input.company_slug ? [input.company_slug] : ['Campus Drive'],
          is_deleted: false,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to insert Technical MCQ question.');
      }
      return data;
    }

    const id = `q-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
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
        // F18: validate test_cases shape before persisting
        test_cases: this._parseTestCases(input.test_cases),
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
   * High-volume batch import: accepts an array of MCQs and batch-inserts into topic_questions or technical_mcqs
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

    if (topicId.startsWith('mcq-')) {
      const subj = TECHNICAL_MCQ_SUBJECTS.find(s => s.id === topicId);
      for (let i = 0; i < questions.length; i += batchSize) {
        const chunk = questions.slice(i, i + batchSize);
        const rows = chunk.map((q, idx) => {
          let correctIdx = 0;
          const ansUpper = String(q.correct_answer || 'A').toUpperCase().trim();
          if (ansUpper >= 'A' && ansUpper <= 'Z') {
            correctIdx = ansUpper.charCodeAt(0) - 65;
          } else {
            const num = parseInt(ansUpper, 10);
            correctIdx = !isNaN(num) ? num : 0;
          }

          return {
            id: `tech-bulk-${Date.now().toString(36)}-${i + idx}-${Math.random().toString(36).substring(2, 6)}`,
            topic_id: topicId,
            topic_name: subj?.name || 'Core CS',
            topic_category: subj?.category || 'SYNTAX_BASICS',
            question: q.statement,
            options: Array.isArray(q.options) ? q.options : [],
            correct_option_index: correctIdx,
            explanation: q.explanation || 'Detailed solution will be added shortly.',
            difficulty: q.difficulty || 'MEDIUM',
            company_tags: ['Campus Drive'],
            is_deleted: false,
          };
        });

        try {
          const { error } = await supabase.from('technical_mcqs').insert(rows);
          if (error) {
            console.error('[bulkImportMcqs] Technical MCQ Batch insert error:', error);
            errors += chunk.length;
          } else {
            inserted += chunk.length;
          }
        } catch {
          errors += chunk.length;
        }
      }
      return { inserted, errors };
    }

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

    const techQuestions = questions.filter(q => q.topic_id && q.topic_id.startsWith('mcq-'));
    const aptQuestions = questions.filter(q => !q.topic_id || !q.topic_id.startsWith('mcq-'));

    let totalInserted = 0;
    let totalErrors = 0;

    // 1. Bulk import tech questions
    if (techQuestions.length > 0) {
      const batchSize = 50;
      for (let i = 0; i < techQuestions.length; i += batchSize) {
        const chunk = techQuestions.slice(i, i + batchSize);
        const rows = chunk.map((q, idx) => {
          const subj = TECHNICAL_MCQ_SUBJECTS.find(s => s.id === q.topic_id);
          let correctIdx = 0;
          const ansUpper = String(q.correct_answer || 'A').toUpperCase().trim();
          if (ansUpper >= 'A' && ansUpper <= 'Z') {
            correctIdx = ansUpper.charCodeAt(0) - 65;
          } else {
            const num = parseInt(ansUpper, 10);
            correctIdx = !isNaN(num) ? num : 0;
          }

          return {
            id: `tech-bulk-${Date.now().toString(36)}-${i + idx}-${Math.random().toString(36).substring(2, 6)}`,
            topic_id: q.topic_id,
            topic_name: subj?.name || 'Core CS',
            topic_category: subj?.category || 'SYNTAX_BASICS',
            question: q.statement,
            options: Array.isArray(q.options) ? q.options : [],
            correct_option_index: correctIdx,
            explanation: q.explanation || 'Detailed step-by-step solution.',
            difficulty: q.difficulty || 'MEDIUM',
            company_tags: q.company_slug ? [q.company_slug] : ['Campus Drive'],
            is_deleted: false,
          };
        });

        try {
          const { error } = await supabase.from('technical_mcqs').insert(rows);
          if (error) {
            console.error('[bulkImportMultiTopicMcqs] Tech MCQ batch insert error:', error);
            totalErrors += chunk.length;
          } else {
            totalInserted += chunk.length;
          }
        } catch {
          totalErrors += chunk.length;
        }
      }
    }

    // 2. Bulk import aptitude questions
    if (aptQuestions.length > 0) {
      const batchSize = 50;
      for (let i = 0; i < aptQuestions.length; i += batchSize) {
        const chunk = aptQuestions.slice(i, i + batchSize);
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
            totalErrors += chunk.length;
          } else {
            totalInserted += chunk.length;
          }
        } catch (err) {
          totalErrors += chunk.length;
        }
      }
    }

    return { inserted: totalInserted, errors: totalErrors };
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
        // F18: normalize test_cases; skip any case with missing string input/output
        const safeCases = questionBankService._parseTestCases(p.test_cases);
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
          test_cases: safeCases,
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
   * Soft-deletes a question from the correct table, throwing on failure.
   * Returns true only when the update succeeds.
   */
  async deleteQuestion(id: string, isCoding?: boolean): Promise<boolean> {
    const table = isCoding || id.startsWith('custom-p150-')
      ? 'technical_problems'
      : (id.startsWith('tech-') || id.startsWith('mcq-'))
        ? 'technical_mcqs'
        : 'topic_questions';

    const { data, error } = await supabase
      .from(table)
      .update({ is_deleted: true })
      .eq('id', id)
      .select('id');

    if (error) {
      console.error('[questionBankService.deleteQuestion] Failed to delete question:', id, error.message);
      throw new Error(error.message || 'Failed to delete question from database.');
    }

    if (!data || data.length === 0) {
      console.warn('[questionBankService.deleteQuestion] Question not found or already deleted:', id);
    }

    return true;
  },
};
