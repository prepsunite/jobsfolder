import { supabase } from '@/lib/supabase';
import type { ProgrammingProblem, TechnicalMcq, TechnicalMcqProgress, ProblemLevel, ProblemCategory, ProgrammingTopic, TechnicalTrack } from '@/types/technical';
import { PROGRAMMING_TOPICS, PROGRAMMING_150_STAGES, CAMPUS_DSA_TOPICS, TECHNICAL_MCQ_TOPICS, PROGRAMMING_150_EXPANDED_SEED } from './programmingTopicsData';

const SOLVED_PROBLEMS_KEY = 'prepunite_solved_coding_problems';
const IMPORTED_PROBLEMS_KEY = 'prepunite_imported_programming_problems';
const SOLVED_MCQS_KEY = 'prepunite_solved_technical_mcqs';

const normalizeDbProblem = (d: any, solvedSet: Set<string>): ProgrammingProblem => ({
  id: d.id,
  title: d.title,
  slug: d.slug || d.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  track: d.track || 'PROGRAMMING_150',
  level: d.level || 'MEDIUM',
  category: d.category || 'SYNTAX_BASICS',
  categoryLabel: d.category_label || d.categoryLabel,
  topicId: d.topic_id || d.topicId,
  description: d.description || '',
  constraints: Array.isArray(d.constraints) ? d.constraints : [],
  testCases: Array.isArray(d.test_cases) ? d.test_cases : (Array.isArray(d.testCases) ? d.testCases : []),
  sampleInput: d.sample_input || d.sampleInput || '',
  sampleOutput: d.sample_output || d.sampleOutput || '',
  explanation: d.explanation || '',
  solutions: d.solutions || { java: '', python: '', cpp: '', c: '' },
  timeComplexity: d.time_complexity || d.timeComplexity || 'O(N)',
  spaceComplexity: d.space_complexity || d.spaceComplexity || 'O(1)',
  hints: Array.isArray(d.hints) ? d.hints : [],
  companyTags: Array.isArray(d.company_tags) ? d.company_tags : (Array.isArray(d.companyTags) ? d.companyTags : []),
  is_hidden: d.is_hidden || false,
  is_deleted: d.is_deleted || false,
  sort_order: d.sort_order || 0,
  solved: solvedSet.has(d.id),
  created_at: d.created_at,
  updated_at: d.updated_at,
});

const normalizeDbMcq = (d: any): TechnicalMcq => ({
  id: d.id,
  topic: d.topic_name || d.topic || 'General',
  topicCategory: d.topic_category || d.topicCategory || 'C_PROGRAMMING',
  topicId: d.topic_id || d.topicId,
  question: d.question || '',
  codeSnippet: d.code_snippet || d.codeSnippet || '',
  options: Array.isArray(d.options) ? d.options : ['A', 'B', 'C', 'D'],
  correctOptionIndex: typeof d.correct_option_index === 'number' ? d.correct_option_index : (d.correctOptionIndex ?? 0),
  explanation: d.explanation || '',
  companyTags: Array.isArray(d.company_tags) ? d.company_tags : (Array.isArray(d.companyTags) ? d.companyTags : []),
  difficulty: d.difficulty || 'MEDIUM',
  is_hidden: d.is_hidden || false,
  is_deleted: d.is_deleted || false,
  sort_order: d.sort_order || 0,
  created_at: d.created_at,
  updated_at: d.updated_at,
});

export const technicalService = {
  // ─── Technical MCQ Progress Management ────────────────────────────────────
  getMcqProgress(): Record<string, TechnicalMcqProgress> {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(SOLVED_MCQS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  saveMcqProgress(mcqId: string, progress: TechnicalMcqProgress, userEmail?: string): void {
    const existing = this.getMcqProgress();
    existing[mcqId] = progress;
    try {
      localStorage.setItem(SOLVED_MCQS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save MCQ progress to localStorage:', e);
    }

    if (userEmail && userEmail !== 'guest@prepunite.com') {
      supabase
        .from('user_mcq_progress')
        .upsert({
          user_email: userEmail,
          mcq_id: mcqId,
          is_solved: !!progress.solved,
          selected_option: typeof progress.selectedOption === 'number' ? progress.selectedOption : null,
          wrong_picks: progress.wrongPicks || [],
          last_attempted_at: new Date().toISOString(),
        }, { onConflict: 'user_email,mcq_id' })
        .then(({ error }) => {
          if (error) console.warn('Supabase MCQ progress sync failed:', error.message);
        });
    }
  },

  // ─── Solved Problem State Management ─────────────────────────────────────
  getSolvedProblemIds(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(SOLVED_PROBLEMS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  },

  toggleProblemSolved(problemId: string, userEmail?: string, track: TechnicalTrack = 'PROGRAMMING_150'): boolean {
    const solvedSet = this.getSolvedProblemIds();
    let isNowSolved = false;
    if (solvedSet.has(problemId)) {
      solvedSet.delete(problemId);
      isNowSolved = false;
    } else {
      solvedSet.add(problemId);
      isNowSolved = true;
    }
    try {
      localStorage.setItem(SOLVED_PROBLEMS_KEY, JSON.stringify(Array.from(solvedSet)));
    } catch {}

    if (userEmail && userEmail !== 'guest@prepunite.com') {
      if (isNowSolved) {
        supabase
          .from('user_technical_progress')
          .upsert({
            user_email: userEmail,
            problem_id: problemId,
            track,
            is_solved: true,
            completed_at: new Date().toISOString(),
            last_attempted_at: new Date().toISOString(),
          }, { onConflict: 'user_email,problem_id' })
          .then(({ error }) => {
            if (error) console.warn('Supabase technical problem progress sync failed:', error.message);
          });
      } else {
        supabase
          .from('user_technical_progress')
          .delete()
          .eq('user_email', userEmail)
          .eq('problem_id', problemId)
          .then(({ error }) => {
            if (error) console.warn('Supabase technical problem progress delete failed:', error.message);
          });
      }
    }

    return isNowSolved;
  },

  async fetchAndSyncFromSupabase(userEmail?: string): Promise<void> {
    if (!userEmail || userEmail === 'guest@prepunite.com' || typeof window === 'undefined') return;

    try {
      // Sync Solved Problems
      const { data: probData } = await supabase
        .from('user_technical_progress')
        .select('problem_id')
        .eq('user_email', userEmail)
        .eq('is_solved', true);

      if (probData && probData.length > 0) {
        const currentSet = this.getSolvedProblemIds();
        probData.forEach(r => currentSet.add(r.problem_id));
        localStorage.setItem(SOLVED_PROBLEMS_KEY, JSON.stringify(Array.from(currentSet)));
      }

      // Sync MCQ Progress
      const { data: mcqData } = await supabase
        .from('user_mcq_progress')
        .select('*')
        .eq('user_email', userEmail);

      if (mcqData && mcqData.length > 0) {
        const currentMcqMap = this.getMcqProgress();
        mcqData.forEach(r => {
          currentMcqMap[r.mcq_id] = {
            solved: r.is_solved,
            selectedOption: r.selected_option,
            wrongPicks: Array.isArray(r.wrong_picks) ? r.wrong_picks : [],
          };
        });
        localStorage.setItem(SOLVED_MCQS_KEY, JSON.stringify(currentMcqMap));
      }
    } catch (e) {
      console.warn('Failed to fetch technical progress from Supabase:', e);
    }
  },

  // ─── Custom Imported Problems (LocalStorage Fallback / Cache) ─────────────
  getImportedProblems(): ProgrammingProblem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(IMPORTED_PROBLEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // ─── TOPIC CRUD (Supabase-First with Seed Fallback) ─────────────────────────
  async getTopicsForTrack(track: TechnicalTrack): Promise<ProgrammingTopic[]> {
    if (track === 'PROGRAMMING_150') {
      try {
        const { data, error } = await supabase
          .from('technical_topics')
          .select('*')
          .eq('track', 'PROGRAMMING_150')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const hasStages = data.some((d: any) => d.id?.startsWith('stage-'));
          if (hasStages) {
            return data.map((d: any) => {
              const staticStage = PROGRAMMING_150_STAGES.find(s => s.id === d.id);
              return {
                id: d.id,
                title: d.name || d.title || staticStage?.title || d.id,
                name: d.name || d.title || staticStage?.title || d.id,
                cluster: d.cluster || staticStage?.cluster || 'Stage',
                description: d.description || staticStage?.description || '',
                iconName: d.icon_name || d.iconName || staticStage?.iconName || 'Terminal',
                icon_name: d.icon_name || staticStage?.iconName || 'Terminal',
                category: d.category || staticStage?.category || 'SYNTAX_BASICS',
                track: 'PROGRAMMING_150' as TechnicalTrack,
                order: d.sort_order || staticStage?.order || 0,
                sort_order: d.sort_order || staticStage?.order || 0,
                is_hidden: d.is_hidden || false,
                tips: Array.isArray(d.tips) && d.tips.length > 0 ? d.tips : staticStage?.tips || [],
                subtopicIds: staticStage?.subtopicIds || [],
                subtopics: staticStage?.subtopics || [],
                stageNumber: staticStage?.stageNumber,
                created_at: d.created_at,
                updated_at: d.updated_at,
              };
            });
          }
        }
      } catch (err) {
        console.warn('Failed to query technical_topics from Supabase, using fallback stages:', err);
      }
      return PROGRAMMING_150_STAGES;
    }

    try {
      const { data, error } = await supabase
        .from('technical_topics')
        .select('*')
        .eq('track', track)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.name || d.title,
          name: d.name || d.title,
          cluster: d.cluster,
          description: d.description || '',
          iconName: d.icon_name || d.iconName || 'Code2',
          icon_name: d.icon_name || 'Code2',
          category: d.category,
          track: d.track,
          order: d.sort_order || 0,
          sort_order: d.sort_order || 0,
          is_hidden: d.is_hidden || false,
          tips: Array.isArray(d.tips) ? d.tips : [],
          created_at: d.created_at,
          updated_at: d.updated_at,
        }));
      }
    } catch (err) {
      console.warn('Failed to query technical_topics from Supabase, using fallback seed:', err);
    }

    // Fallback seed
    if (track === 'CAMPUS_DSA') return CAMPUS_DSA_TOPICS;
    if (track === 'TECHNICAL_MCQS') return TECHNICAL_MCQ_TOPICS;
    return PROGRAMMING_150_STAGES;
  },

  async getAllTopics(): Promise<ProgrammingTopic[]> {
    try {
      const { data, error } = await supabase
        .from('technical_topics')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.name || d.title,
          name: d.name || d.title,
          cluster: d.cluster,
          description: d.description || '',
          iconName: d.icon_name || d.iconName || 'Code2',
          icon_name: d.icon_name || 'Code2',
          category: d.category,
          track: d.track,
          order: d.sort_order || 0,
          sort_order: d.sort_order || 0,
          is_hidden: d.is_hidden || false,
          tips: Array.isArray(d.tips) ? d.tips : [],
          created_at: d.created_at,
          updated_at: d.updated_at,
        }));
      }
    } catch {}

    return [...PROGRAMMING_TOPICS, ...CAMPUS_DSA_TOPICS, ...TECHNICAL_MCQ_TOPICS];
  },

  async saveTopic(topic: Partial<ProgrammingTopic>): Promise<{ success: boolean; error?: string }> {
    if (!topic.id || !(topic.name || topic.title)) {
      return { success: false, error: 'Topic ID and Name are required.' };
    }

    const payload = {
      id: topic.id.trim(),
      track: topic.track || 'PROGRAMMING_150',
      category: topic.category || 'SYNTAX_BASICS',
      name: (topic.name || topic.title || '').trim(),
      cluster: (topic.cluster || 'General').trim(),
      description: topic.description || '',
      icon_name: topic.icon_name || topic.iconName || 'Code2',
      sort_order: topic.sort_order ?? topic.order ?? 0,
      is_hidden: !!topic.is_hidden,
      tips: Array.isArray(topic.tips) ? topic.tips : [],
    };

    try {
      const { error } = await supabase
        .from('technical_topics')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('Error saving technical topic to Supabase:', err);
      return { success: false, error: err.message };
    }
  },

  async toggleTopicVisibility(id: string, is_hidden: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('technical_topics')
        .update({ is_hidden })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to toggle topic visibility in Supabase:', e);
      return false;
    }
  },

  async deleteTopic(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('technical_topics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to delete topic from Supabase:', e);
      return false;
    }
  },

  // ─── PROGRAMMING PROBLEMS CRUD ──────────────────────────────────────────
  async getProgramming150Problems(): Promise<ProgrammingProblem[]> {
    const solvedSet = this.getSolvedProblemIds();

    try {
      const { data, error } = await supabase
        .from('technical_problems')
        .select('*')
        .eq('track', 'PROGRAMMING_150')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(d => normalizeDbProblem(d, solvedSet));
      }
    } catch (e) {
      console.warn('Failed to query technical_problems from Supabase, falling back:', e);
    }

    // Fallback: Seed + LocalStorage imported
    const imported = this.getImportedProblems();
    const all = [...PROGRAMMING_150_EXPANDED_SEED, ...imported];
    return all.map(p => ({
      ...p,
      solved: solvedSet.has(p.id),
    }));
  },

  async getCampusDsaProblems(): Promise<ProgrammingProblem[]> {
    const solvedSet = this.getSolvedProblemIds();

    try {
      const { data, error } = await supabase
        .from('technical_problems')
        .select('*')
        .eq('track', 'CAMPUS_DSA')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(d => normalizeDbProblem(d, solvedSet));
      }
    } catch (e) {
      console.warn('Failed to query Campus DSA problems from Supabase, falling back:', e);
    }

    return CAMPUS_DSA_SEED.map(p => ({
      ...p,
      solved: solvedSet.has(p.id),
    }));
  },

  async getProblemsByTopic(topicId: string): Promise<ProgrammingProblem[]> {
    const all = await this.getProgramming150Problems();
    return all.filter(p => p.topicId === topicId);
  },

  async saveProgrammingProblem(p: Partial<ProgrammingProblem>): Promise<{ success: boolean; error?: string }> {
    if (!p.title) {
      return { success: false, error: 'Problem title is required.' };
    }

    const id = p.id || `custom-p150-${Date.now()}`;
    const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      id,
      topic_id: p.topicId || p.topic_id || 'syntax-operators',
      track: p.track || 'PROGRAMMING_150',
      title: p.title.trim(),
      slug,
      level: p.level || 'MEDIUM',
      category: p.category || 'SYNTAX_BASICS',
      category_label: p.categoryLabel || p.category_label || 'General Programming',
      description: p.description || '',
      constraints: Array.isArray(p.constraints) ? p.constraints : [],
      test_cases: p.testCases || p.test_cases || (p.sampleInput || p.sampleOutput ? [{ input: p.sampleInput || '', output: p.sampleOutput || '', explanation: p.explanation || '' }] : []),
      sample_input: p.sampleInput || p.sample_input || '',
      sample_output: p.sampleOutput || p.sample_output || '',
      explanation: p.explanation || '',
      solutions: p.solutions || { java: '// Java solution', python: '# Python solution', cpp: '// C++ solution', c: '// C solution' },
      time_complexity: p.timeComplexity || p.time_complexity || 'O(N)',
      space_complexity: p.spaceComplexity || p.space_complexity || 'O(1)',
      hints: Array.isArray(p.hints) ? p.hints : [],
      company_tags: Array.isArray(p.companyTags) ? p.companyTags : (Array.isArray(p.company_tags) ? p.company_tags : ['Campus Placement']),
      is_hidden: !!p.is_hidden,
      is_deleted: false,
      sort_order: p.sort_order || 0,
    };

    try {
      const { error } = await supabase
        .from('technical_problems')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase problem upsert error, syncing to localStorage as fallback:', err);
      // Local fallback
      const existing = this.getImportedProblems();
      const updated = [payload as any, ...existing.filter(item => item.id !== id)];
      try {
        localStorage.setItem(IMPORTED_PROBLEMS_KEY, JSON.stringify(updated));
      } catch {}
      return { success: true };
    }
  },

  async deleteProgrammingProblem(problemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('technical_problems')
        .delete()
        .eq('id', problemId);

      if (error) throw error;
    } catch (e) {
      console.warn('Failed to delete problem from Supabase:', e);
    }

    // Also remove from localStorage if present
    const existing = this.getImportedProblems();
    const filtered = existing.filter(p => p.id !== problemId);
    try {
      localStorage.setItem(IMPORTED_PROBLEMS_KEY, JSON.stringify(filtered));
    } catch {}
    return true;
  },

  async bulkDeleteProgrammingProblems(problemIds: string[]): Promise<boolean> {
    if (!problemIds || problemIds.length === 0) return true;
    try {
      const { error } = await supabase
        .from('technical_problems')
        .delete()
        .in('id', problemIds);

      if (error) throw error;
    } catch (e) {
      console.warn('Failed to bulk delete problems from Supabase:', e);
    }

    const existing = this.getImportedProblems();
    const idSet = new Set(problemIds);
    const filtered = existing.filter(p => !idSet.has(p.id));
    try {
      localStorage.setItem(IMPORTED_PROBLEMS_KEY, JSON.stringify(filtered));
    } catch {}
    return true;
  },

  async importProgrammingProblems(newProblems: Partial<ProgrammingProblem>[], track: 'PROGRAMMING_150' | 'CAMPUS_DSA' = 'PROGRAMMING_150'): Promise<{ importedCount: number }> {
    let count = 0;
    const dbPayloads: any[] = [];
    const localPayloads: ProgrammingProblem[] = [];

    newProblems.forEach((p, idx) => {
      if (!p.title) return;
      const id = p.id || `custom-${track.toLowerCase()}-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const testCases = p.testCases || p.test_cases || (p.sampleInput || p.sampleOutput ? [{ input: p.sampleInput || '', output: p.sampleOutput || '', explanation: p.explanation || '' }] : []);

      const payload = {
        id,
        topic_id: p.topicId || p.topic_id || 'syntax-operators',
        track,
        title: p.title.trim(),
        slug,
        level: p.level || 'MEDIUM',
        category: p.category || 'SYNTAX_BASICS',
        category_label: p.categoryLabel || p.category_label || 'General Programming',
        description: p.description || '',
        constraints: Array.isArray(p.constraints) ? p.constraints : [],
        test_cases: testCases,
        sample_input: testCases[0]?.input || p.sampleInput || p.sample_input || '',
        sample_output: testCases[0]?.output || p.sampleOutput || p.sample_output || '',
        explanation: p.explanation || '',
        solutions: p.solutions || { java: '// Java implementation', python: '# Python implementation', cpp: '// C++ implementation', c: '// C implementation' },
        time_complexity: p.timeComplexity || p.time_complexity || 'O(N)',
        space_complexity: p.spaceComplexity || p.space_complexity || 'O(1)',
        hints: Array.isArray(p.hints) ? p.hints : [],
        company_tags: Array.isArray(p.companyTags) ? p.companyTags : ['Campus Placement'],
        is_hidden: !!p.is_hidden,
        is_deleted: false,
        sort_order: p.sort_order || 0,
      };

      dbPayloads.push(payload);
      localPayloads.push(payload as any);
      count++;
    });

    if (dbPayloads.length > 0) {
      try {
        const { error } = await supabase
          .from('technical_problems')
          .upsert(dbPayloads, { onConflict: 'id' });

        if (error) throw error;
      } catch (err) {
        console.warn('Batch Supabase import failed, caching locally:', err);
        const existing = this.getImportedProblems();
        try {
          localStorage.setItem(IMPORTED_PROBLEMS_KEY, JSON.stringify([...existing, ...localPayloads]));
        } catch {}
      }
    }

    return { importedCount: count };
  },

  // ─── TECHNICAL MCQS CRUD ──────────────────────────────────────────────────
  getImportedMcqs(): TechnicalMcq[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('prepunite_imported_technical_mcqs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async getTechnicalMcqs(topicId?: string): Promise<TechnicalMcq[]> {
    try {
      let query = supabase
        .from('technical_mcqs')
        .select('*')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (topicId) {
        query = query.eq('topic_id', topicId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(normalizeDbMcq);
      }
    } catch (e) {
      console.warn('Failed to query technical_mcqs from Supabase, falling back:', e);
    }

    // Fallback: Seed + LocalStorage imported
    const all = [...TECHNICAL_MCQS_SEED, ...this.getImportedMcqs()];
    if (topicId) {
      return all.filter(m => m.topicId === topicId);
    }
    return all;
  },

  async saveTechnicalMcq(m: Partial<TechnicalMcq>): Promise<{ success: boolean; error?: string }> {
    if (!m.question) {
      return { success: false, error: 'MCQ Question statement is required.' };
    }

    const id = m.id || `custom-mcq-${Date.now()}`;
    const payload = {
      id,
      topic_id: m.topicId || m.topic_id || 'mcq-c-programming',
      topic_name: m.topic || m.topic_name || 'General',
      topic_category: m.topicCategory || m.topic_category || 'C_PROGRAMMING',
      question: m.question.trim(),
      code_snippet: m.codeSnippet || m.code_snippet || null,
      options: Array.isArray(m.options) ? m.options : ['A', 'B', 'C', 'D'],
      correct_option_index: typeof m.correctOptionIndex === 'number' ? m.correctOptionIndex : (m.correct_option_index ?? 0),
      explanation: m.explanation || '',
      company_tags: Array.isArray(m.companyTags) ? m.companyTags : (Array.isArray(m.company_tags) ? m.company_tags : []),
      difficulty: m.difficulty || 'MEDIUM',
      is_hidden: !!m.is_hidden,
      is_deleted: false,
      sort_order: m.sort_order || 0,
    };

    try {
      const { error } = await supabase
        .from('technical_mcqs')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase MCQ upsert error, syncing to localStorage fallback:', err);
      const existing = this.getImportedMcqs();
      const updated = [payload as any, ...existing.filter(item => item.id !== id)];
      try {
        localStorage.setItem('prepunite_imported_technical_mcqs', JSON.stringify(updated));
      } catch {}
      return { success: true };
    }
  },

  async deleteTechnicalMcq(mcqId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('technical_mcqs')
        .delete()
        .eq('id', mcqId);

      if (error) throw error;
    } catch (e) {
      console.warn('Failed to delete technical MCQ from Supabase:', e);
    }

    const existing = this.getImportedMcqs();
    const filtered = existing.filter(m => m.id !== mcqId);
    try {
      localStorage.setItem('prepunite_imported_technical_mcqs', JSON.stringify(filtered));
    } catch {}
    return true;
  },

  async bulkDeleteTechnicalMcqs(mcqIds: string[]): Promise<boolean> {
    if (!mcqIds || mcqIds.length === 0) return true;
    try {
      const { error } = await supabase
        .from('technical_mcqs')
        .delete()
        .in('id', mcqIds);

      if (error) throw error;
    } catch (e) {
      console.warn('Failed to bulk delete MCQs from Supabase:', e);
    }

    const existing = this.getImportedMcqs();
    const idSet = new Set(mcqIds);
    const filtered = existing.filter(m => !idSet.has(m.id));
    try {
      localStorage.setItem('prepunite_imported_technical_mcqs', JSON.stringify(filtered));
    } catch {}
    return true;
  },

  async importTechnicalMcqs(newMcqs: Partial<TechnicalMcq>[]): Promise<{ importedCount: number }> {
    let count = 0;
    const dbPayloads: any[] = [];
    const localPayloads: TechnicalMcq[] = [];

    newMcqs.forEach((m, idx) => {
      if (!m.question) return;
      const id = m.id || `custom-mcq-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      const payload = {
        id,
        topic_id: m.topicId || m.topic_id || 'mcq-c-programming',
        topic_name: m.topic || m.topic_name || 'General',
        topic_category: m.topicCategory || m.topic_category || 'C_PROGRAMMING',
        question: m.question.trim(),
        code_snippet: m.codeSnippet || m.code_snippet || null,
        options: Array.isArray(m.options) ? m.options : ['A', 'B', 'C', 'D'],
        correct_option_index: typeof m.correctOptionIndex === 'number' ? m.correctOptionIndex : (m.correct_option_index ?? 0),
        explanation: m.explanation || '',
        company_tags: Array.isArray(m.companyTags) ? m.companyTags : (Array.isArray(m.company_tags) ? m.company_tags : []),
        difficulty: m.difficulty || 'MEDIUM',
        is_hidden: !!m.is_hidden,
        is_deleted: false,
        sort_order: m.sort_order || 0,
      };

      dbPayloads.push(payload);
      localPayloads.push(payload as any);
      count++;
    });

    if (dbPayloads.length > 0) {
      try {
        const { error } = await supabase
          .from('technical_mcqs')
          .upsert(dbPayloads, { onConflict: 'id' });

        if (error) throw error;
      } catch (err) {
        console.warn('Batch Supabase MCQ import failed, caching locally:', err);
        const existing = this.getImportedMcqs();
        try {
          localStorage.setItem('prepunite_imported_technical_mcqs', JSON.stringify([...existing, ...localPayloads]));
        } catch {}
      }
    }

    return { importedCount: count };
  },

  // ─── LIVE TOPIC QUESTION COUNTS MAP ───────────────────────────────────────
  async getTopicCountsMap(track: TechnicalTrack): Promise<Record<string, number>> {
    const countMap: Record<string, number> = {};

    try {
      if (track === 'TECHNICAL_MCQS') {
        const { data, error } = await supabase
          .from('technical_mcqs')
          .select('topic_id')
          .eq('is_deleted', false);

        if (!error && data) {
          data.forEach((row: any) => {
            if (row.topic_id) {
              countMap[row.topic_id] = (countMap[row.topic_id] || 0) + 1;
            }
          });
          return countMap;
        }
      } else {
        const { data, error } = await supabase
          .from('technical_problems')
          .select('topic_id')
          .eq('track', track)
          .eq('is_deleted', false);

        if (!error && data) {
          data.forEach((row: any) => {
            if (row.topic_id) {
              countMap[row.topic_id] = (countMap[row.topic_id] || 0) + 1;
            }
          });
          return countMap;
        }
      }
    } catch {}

    // Fallback counts from seed
    if (track === 'TECHNICAL_MCQS') {
      TECHNICAL_MCQS_SEED.forEach(m => {
        if (m.topicId) countMap[m.topicId] = (countMap[m.topicId] || 0) + 1;
      });
    } else if (track === 'CAMPUS_DSA') {
      CAMPUS_DSA_SEED.forEach(p => {
        if (p.topicId) countMap[p.topicId] = (countMap[p.topicId] || 0) + 1;
      });
    } else {
      PROGRAMMING_150_EXPANDED_SEED.forEach(p => {
        if (p.topicId) countMap[p.topicId] = (countMap[p.topicId] || 0) + 1;
      });
    }

    return countMap;
  },

  async getStats() {
    const p150 = await this.getProgramming150Problems();
    const dsa = await this.getCampusDsaProblems();
    const mcqs = await this.getTechnicalMcqs();
    const mcqProgress = this.getMcqProgress();
    const mcqSolved = Object.values(mcqProgress).filter(p => p.solved).length;
    const p150Solved = p150.filter(p => p.solved).length;
    const dsaSolved = dsa.filter(p => p.solved).length;
    const totalCoding = p150.length + dsa.length;
    const totalSolved = p150Solved + dsaSolved;
    return {
      p150Total: p150.length,
      p150Solved,
      dsaTotal: dsa.length,
      dsaSolved,
      mcqTotal: mcqs.length,
      mcqSolved,
      totalCoding,
      totalSolved,
      percentage: totalCoding > 0 ? Math.round((totalSolved / totalCoding) * 100) : 0,
    };
  },
};

const PROGRAMMING_150_SEED: ProgrammingProblem[] = [];
const CAMPUS_DSA_SEED: ProgrammingProblem[] = [];
const TECHNICAL_MCQS_SEED: TechnicalMcq[] = [];
