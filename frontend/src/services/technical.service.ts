import { supabase } from '@/lib/supabase';
import type { ProgrammingProblem, TechnicalMcq, TechnicalMcqProgress, ProblemLevel, ProblemCategory, ProgrammingTopic, TechnicalTrack } from '@/types/technical';
import { PROGRAMMING_TOPICS, PROGRAMMING_150_STAGES, CAMPUS_DSA_TOPICS, TECHNICAL_MCQ_TOPICS, PROGRAMMING_150_EXPANDED_SEED, STAGE_SUBTOPIC_TO_STAGE_MAP } from './programmingTopicsData';
import { computeSha256Hex } from '@/utils/questionParser';

export interface TechnicalImportReport {
  success: number;
  importedCount: number;
  duplicates: number;
  invalid: number;
  errors: { itemIndex: number; title?: string; reason: string }[];
  supabaseSynced: boolean;
}

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
      if (!stored) return [];
      const raw = JSON.parse(stored);
      if (!Array.isArray(raw)) return [];
      const solvedSet = this.getSolvedProblemIds();
      return raw.map(item => normalizeDbProblem(item, solvedSet));
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

    let dbProblems: ProgrammingProblem[] = [];
    try {
      const { data, error } = await supabase
        .from('technical_problems')
        .select('*')
        .eq('track', 'PROGRAMMING_150')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        dbProblems = data.map(d => normalizeDbProblem(d, solvedSet));
      }
    } catch (e) {
      console.warn('Failed to query technical_problems from Supabase:', e);
    }

    // Unify Supabase problems + Local Imported problems + Seed problems
    const imported = this.getImportedProblems().filter(p => (p.track || 'PROGRAMMING_150') === 'PROGRAMMING_150');
    const allCandidates = [...dbProblems, ...imported, ...PROGRAMMING_150_EXPANDED_SEED];

    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const unified: ProgrammingProblem[] = [];

    for (const p of allCandidates) {
      if (!p || !p.title || p.is_deleted) continue;
      const normalizedTitle = p.title.trim().toLowerCase();
      if (seenIds.has(p.id) || seenTitles.has(normalizedTitle)) continue;

      seenIds.add(p.id);
      seenTitles.add(normalizedTitle);
      unified.push({
        ...p,
        solved: solvedSet.has(p.id),
      });
    }

    unified.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return unified;
  },

  async getCampusDsaProblems(): Promise<ProgrammingProblem[]> {
    const solvedSet = this.getSolvedProblemIds();

    let dbProblems: ProgrammingProblem[] = [];
    try {
      const { data, error } = await supabase
        .from('technical_problems')
        .select('*')
        .eq('track', 'CAMPUS_DSA')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        dbProblems = data.map(d => normalizeDbProblem(d, solvedSet));
      }
    } catch (e) {
      console.warn('Failed to query Campus DSA problems from Supabase:', e);
    }

    // Unify Supabase + Local Imported + Seed
    const imported = this.getImportedProblems().filter(p => p.track === 'CAMPUS_DSA');
    const allCandidates = [...dbProblems, ...imported, ...CAMPUS_DSA_SEED];

    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const unified: ProgrammingProblem[] = [];

    for (const p of allCandidates) {
      if (!p || !p.title || p.is_deleted) continue;
      const normalizedTitle = p.title.trim().toLowerCase();
      if (seenIds.has(p.id) || seenTitles.has(normalizedTitle)) continue;

      seenIds.add(p.id);
      seenTitles.add(normalizedTitle);
      unified.push({
        ...p,
        solved: solvedSet.has(p.id),
      });
    }

    unified.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return unified;
  },

  async getProblemsByTopic(topicId: string): Promise<ProgrammingProblem[]> {
    const all = await this.getProgramming150Problems();
    return all.filter(p => p.topicId === topicId);
  },

  async saveProgrammingProblem(p: Partial<ProgrammingProblem>): Promise<{ success: boolean; error?: string }> {
    if (!p.title) {
      return { success: false, error: 'Problem title is required.' };
    }

    const id = p.id || `custom-${p.track ? p.track.toLowerCase() : 'p150'}-${Date.now()}`;
    const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const testCases = p.testCases || (p as any).test_cases || (p.sampleInput || p.sampleOutput ? [{ input: p.sampleInput || '', output: p.sampleOutput || '', explanation: p.explanation || '' }] : []);

    const payload = {
      id,
      topic_id: p.topicId || (p as any).topic_id || 'syntax-operators',
      track: p.track || 'PROGRAMMING_150',
      title: p.title.trim(),
      slug,
      level: p.level || 'MEDIUM',
      category: p.category || 'SYNTAX_BASICS',
      category_label: p.categoryLabel || (p as any).category_label || 'General Programming',
      description: p.description || '',
      constraints: Array.isArray(p.constraints) ? p.constraints : [],
      test_cases: testCases,
      sample_input: testCases[0]?.input || p.sampleInput || (p as any).sample_input || '',
      sample_output: testCases[0]?.output || p.sampleOutput || (p as any).sample_output || '',
      explanation: p.explanation || '',
      solutions: p.solutions || { java: '// Java solution', python: '# Python solution', cpp: '// C++ solution', c: '// C solution' },
      time_complexity: p.timeComplexity || (p as any).time_complexity || 'O(N)',
      space_complexity: p.spaceComplexity || (p as any).space_complexity || 'O(1)',
      hints: Array.isArray(p.hints) ? p.hints : [],
      company_tags: Array.isArray(p.companyTags) ? p.companyTags : (Array.isArray((p as any).company_tags) ? (p as any).company_tags : ['Campus Placement']),
      is_hidden: !!p.is_hidden,
      is_deleted: false,
      sort_order: p.sort_order || 0,
    };

    // Update localStorage first (instant local persistence)
    const existing = this.getImportedProblems();
    const normalized = normalizeDbProblem(payload, this.getSolvedProblemIds());
    const updated = [normalized, ...existing.filter(item => item.id !== id)];
    try {
      localStorage.setItem(IMPORTED_PROBLEMS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('prepunite-storage-update'));
    } catch {}

    try {
      const { error } = await supabase
        .from('technical_problems')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase problem upsert error, synced locally:', err);
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

    const existing = this.getImportedProblems();
    const filtered = existing.filter(p => p.id !== problemId);
    try {
      localStorage.setItem(IMPORTED_PROBLEMS_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new Event('prepunite-storage-update'));
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
      window.dispatchEvent(new Event('prepunite-storage-update'));
    } catch {}
    return true;
  },

  async importProgrammingProblems(
    newProblems: Partial<ProgrammingProblem>[],
    track: 'PROGRAMMING_150' | 'CAMPUS_DSA' = 'PROGRAMMING_150'
  ): Promise<TechnicalImportReport> {
    const report: TechnicalImportReport = {
      success: 0,
      importedCount: 0,
      duplicates: 0,
      invalid: 0,
      errors: [],
      supabaseSynced: false,
    };

    if (!Array.isArray(newProblems) || newProblems.length === 0) {
      report.invalid = 1;
      report.errors.push({ itemIndex: 1, reason: 'Empty problems array provided.' });
      return report;
    }

    // 1. Fetch current problems for duplicate detection
    const existingProblems = track === 'CAMPUS_DSA'
      ? await this.getCampusDsaProblems()
      : await this.getProgramming150Problems();

    const existingTitles = new Set(existingProblems.map(p => p.title.trim().toLowerCase()));
    const existingFingerprints = new Set(
      existingProblems.map(p => computeSha256Hex(`${p.title.trim()}:${p.description?.trim() || ''}`))
    );

    const validNewProblems: ProgrammingProblem[] = [];
    const dbPayloads: any[] = [];
    const solvedSet = this.getSolvedProblemIds();

    let maxSortOrder = existingProblems.length > 0
      ? Math.max(...existingProblems.map(p => p.sort_order || 0))
      : 0;

    const storedImported = this.getImportedProblems();

    newProblems.forEach((p, idx) => {
      const itemIndex = idx + 1;
      if (!p || !p.title || !p.title.trim()) {
        report.invalid++;
        report.errors.push({ itemIndex, reason: 'Missing problem title.' });
        return;
      }

      const cleanTitle = p.title.trim();
      const normTitle = cleanTitle.toLowerCase();
      const resolvedDescription = p.description || (p as any).problemStatement || (p as any).statement || (p as any).problem_statement || '';
      const fingerprint = computeSha256Hex(`${cleanTitle}:${resolvedDescription.trim()}`);

      const resolvedTopicId = p.topicId || (p as any).topic_id || 'syntax-operators';
      const resolvedLevel = ((p.level || (p as any).difficulty || 'MEDIUM') as string).toUpperCase() as ProblemLevel;
      const resolvedSolutions = p.solutions || (p as any).solution || {
        java: '// Java solution',
        python: '# Python solution',
        cpp: '// C++ solution',
        c: '// C solution',
      };
      const resolvedConstraints = Array.isArray(p.constraints)
        ? p.constraints
        : (typeof p.constraints === 'string' ? (p.constraints as string).split('\n').map(s => s.trim()).filter(Boolean) : []);
      const testCases = p.testCases || (p as any).test_cases || (p.sampleInput || p.sampleOutput ? [{ input: p.sampleInput || '', output: p.sampleOutput || '', explanation: p.explanation || '' }] : []);

      let resolvedCategory: ProblemCategory = (p.category || 'SYNTAX_BASICS') as ProblemCategory;
      let resolvedCategoryLabel = p.categoryLabel || (p as any).category_label || 'General Programming';
      if (resolvedTopicId.includes('string')) {
        resolvedCategory = 'STRINGS';
        resolvedCategoryLabel = 'Strings & Text Processing';
      } else if (resolvedTopicId.includes('matri') || resolvedTopicId.includes('grid')) {
        resolvedCategory = 'MATRICES';
        resolvedCategoryLabel = '2D Arrays & Matrices';
      } else if (resolvedTopicId.includes('array')) {
        resolvedCategory = 'ARRAYS';
        resolvedCategoryLabel = 'Arrays & Hashing';
      } else if (resolvedTopicId.includes('pattern')) {
        resolvedCategory = 'PATTERNS';
        resolvedCategoryLabel = 'Pattern Programming';
      } else if (resolvedTopicId.includes('digit') || resolvedTopicId.includes('prime') || resolvedTopicId.includes('special-numbers')) {
        resolvedCategory = 'MATH_LOGIC';
        resolvedCategoryLabel = 'Number Logic & Math';
      }

      const buildNormalized = (probId: string): ProgrammingProblem => ({
        id: probId,
        track,
        topicId: resolvedTopicId,
        title: cleanTitle,
        slug: p.slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        level: resolvedLevel,
        category: resolvedCategory,
        categoryLabel: resolvedCategoryLabel,
        description: resolvedDescription,
        constraints: resolvedConstraints,
        testCases,
        sampleInput: testCases[0]?.input || p.sampleInput || (p as any).sample_input || '',
        sampleOutput: testCases[0]?.output || p.sampleOutput || (p as any).sample_output || '',
        explanation: p.explanation || '',
        solutions: resolvedSolutions,
        timeComplexity: p.timeComplexity || (p as any).time_complexity || 'O(N)',
        spaceComplexity: p.spaceComplexity || (p as any).space_complexity || 'O(1)',
        hints: Array.isArray(p.hints) ? p.hints : (typeof p.hints === 'string' ? [p.hints] : []),
        companyTags: Array.isArray(p.companyTags) ? p.companyTags : (Array.isArray((p as any).company_tags) ? (p as any).company_tags : []),
        is_hidden: !!p.is_hidden,
        is_deleted: false,
        sort_order: p.sort_order || maxSortOrder,
        solved: solvedSet.has(probId),
      });

      const buildDbPayload = (norm: ProgrammingProblem) => ({
        id: norm.id,
        topic_id: norm.topicId,
        track: norm.track,
        title: norm.title,
        slug: norm.slug,
        level: norm.level,
        category: norm.category,
        category_label: norm.categoryLabel,
        description: norm.description,
        constraints: norm.constraints,
        test_cases: norm.testCases,
        sample_input: norm.sampleInput,
        sample_output: norm.sampleOutput,
        explanation: norm.explanation,
        solutions: norm.solutions,
        time_complexity: norm.timeComplexity,
        space_complexity: norm.spaceComplexity,
        hints: norm.hints,
        company_tags: norm.companyTags,
        is_hidden: norm.is_hidden,
        is_deleted: false,
        sort_order: norm.sort_order,
      });

      // Check if problem already exists in local imported cache (Update in-place)
      const existingImportedIdx = storedImported.findIndex(
        item => item.title.trim().toLowerCase() === normTitle
      );
      if (existingImportedIdx !== -1) {
        const existingId = storedImported[existingImportedIdx].id;
        const updated = buildNormalized(existingId);
        storedImported[existingImportedIdx] = updated;
        dbPayloads.push(buildDbPayload(updated));
        report.success++;
        return;
      }

      // Fast Deduplication Check matching Aptitude
      if (existingTitles.has(normTitle) || existingFingerprints.has(fingerprint)) {
        report.duplicates++;
        report.errors.push({
          itemIndex,
          title: cleanTitle,
          reason: 'Duplicate problem (already exists in track syllabus)',
        });
        return;
      }

      existingTitles.add(normTitle);
      existingFingerprints.add(fingerprint);
      maxSortOrder++;

      const newId = p.id || `custom-${track.toLowerCase()}-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      const normalized = buildNormalized(newId);
      validNewProblems.push(normalized);
      dbPayloads.push(buildDbPayload(normalized));
      report.success++;
    });

    // 2. Persist to localStorage immediately (guarantees instantaneous reactive UI display)
    try {
      const mergedStorage = [...storedImported, ...validNewProblems];
      localStorage.setItem(IMPORTED_PROBLEMS_KEY, JSON.stringify(mergedStorage));
      window.dispatchEvent(new Event('prepunite-storage-update'));
    } catch (storageErr) {
      console.warn('LocalStorage save error:', storageErr);
    }

    // 3. Sync to Supabase in parallel
    if (dbPayloads.length > 0) {
      try {
        const { error } = await supabase
          .from('technical_problems')
          .upsert(dbPayloads, { onConflict: 'id' });

        if (error) {
          console.warn('Supabase technical_problems upsert notice:', error.message || error);
          report.supabaseSynced = false;
        } else {
          report.supabaseSynced = true;
        }
      } catch (syncErr) {
        console.warn('Supabase technical_problems sync notice:', syncErr);
        report.supabaseSynced = false;
      }
    }

    report.importedCount = report.success;
    return report;
  },

  // ─── TECHNICAL MCQS CRUD ──────────────────────────────────────────────────
  getImportedMcqs(): TechnicalMcq[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('prepunite_imported_technical_mcqs');
      if (!stored) return [];
      const raw = JSON.parse(stored);
      if (!Array.isArray(raw)) return [];
      return raw.map(item => normalizeDbMcq(item));
    } catch {
      return [];
    }
  },

  async getTechnicalMcqs(topicId?: string): Promise<TechnicalMcq[]> {
    let dbMcqs: TechnicalMcq[] = [];
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
        dbMcqs = data.map(normalizeDbMcq);
      }
    } catch (e) {
      console.warn('Failed to query technical_mcqs from Supabase:', e);
    }

    // Unify Supabase MCQs + Local Imported MCQs + Seed MCQs
    const imported = this.getImportedMcqs();
    const allCandidates = [...dbMcqs, ...imported, ...TECHNICAL_MCQS_SEED];

    const seenIds = new Set<string>();
    const seenQuestions = new Set<string>();
    const unified: TechnicalMcq[] = [];

    for (const m of allCandidates) {
      if (!m || !m.question || m.is_deleted) continue;
      const normQ = m.question.trim().toLowerCase();
      if (seenIds.has(m.id) || seenQuestions.has(normQ)) continue;

      seenIds.add(m.id);
      seenQuestions.add(normQ);
      unified.push(m);
    }

    unified.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    if (topicId) {
      return unified.filter(m => m.topicId === topicId);
    }
    return unified;
  },

  async saveTechnicalMcq(m: Partial<TechnicalMcq>): Promise<{ success: boolean; error?: string }> {
    if (!m.question) {
      return { success: false, error: 'MCQ Question statement is required.' };
    }

    const id = m.id || `custom-mcq-${Date.now()}`;
    const payload = {
      id,
      topic_id: m.topicId || (m as any).topic_id || 'mcq-c-programming',
      topic_name: m.topic || (m as any).topic_name || 'General',
      topic_category: m.topicCategory || (m as any).topic_category || 'C_PROGRAMMING',
      question: m.question.trim(),
      code_snippet: m.codeSnippet || (m as any).code_snippet || null,
      options: Array.isArray(m.options) ? m.options : ['A', 'B', 'C', 'D'],
      correct_option_index: typeof m.correctOptionIndex === 'number' ? m.correctOptionIndex : ((m as any).correct_option_index ?? 0),
      explanation: m.explanation || '',
      company_tags: Array.isArray(m.companyTags) ? m.companyTags : (Array.isArray((m as any).company_tags) ? (m as any).company_tags : []),
      difficulty: m.difficulty || 'MEDIUM',
      is_hidden: !!m.is_hidden,
      is_deleted: false,
      sort_order: m.sort_order || 0,
    };

    // Update localStorage immediately
    const existing = this.getImportedMcqs();
    const normalized = normalizeDbMcq(payload);
    const updated = [normalized, ...existing.filter(item => item.id !== id)];
    try {
      localStorage.setItem('prepunite_imported_technical_mcqs', JSON.stringify(updated));
      window.dispatchEvent(new Event('prepunite-storage-update'));
    } catch {}

    try {
      const { error } = await supabase
        .from('technical_mcqs')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase MCQ upsert error, synced locally:', err);
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
      window.dispatchEvent(new Event('prepunite-storage-update'));
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
      window.dispatchEvent(new Event('prepunite-storage-update'));
    } catch {}
    return true;
  },

  async importTechnicalMcqs(newMcqs: Partial<TechnicalMcq>[]): Promise<TechnicalImportReport> {
    const report: TechnicalImportReport = {
      success: 0,
      importedCount: 0,
      duplicates: 0,
      invalid: 0,
      errors: [],
      supabaseSynced: false,
    };

    if (!Array.isArray(newMcqs) || newMcqs.length === 0) {
      report.invalid = 1;
      report.errors.push({ itemIndex: 1, reason: 'Empty MCQs array provided.' });
      return report;
    }

    // Deduplicate against existing MCQs
    const existingMcqs = await this.getTechnicalMcqs();
    const existingQuestions = new Set(existingMcqs.map(m => m.question.trim().toLowerCase()));

    const validNewMcqs: TechnicalMcq[] = [];
    const dbPayloads: any[] = [];

    let maxSortOrder = existingMcqs.length > 0
      ? Math.max(...existingMcqs.map(m => m.sort_order || 0))
      : 0;

    newMcqs.forEach((m, idx) => {
      const itemIndex = idx + 1;
      if (!m || !m.question || !m.question.trim()) {
        report.invalid++;
        report.errors.push({ itemIndex, reason: 'Missing question text.' });
        return;
      }

      const cleanQ = m.question.trim();
      const normQ = cleanQ.toLowerCase();

      if (existingQuestions.has(normQ)) {
        report.duplicates++;
        report.errors.push({
          itemIndex,
          title: cleanQ.slice(0, 60),
          reason: 'Duplicate MCQ (already exists in syllabus)',
        });
        return;
      }

      existingQuestions.add(normQ);
      maxSortOrder++;

      const id = m.id || `custom-mcq-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      const normalized: TechnicalMcq = {
        id,
        topic: m.topic || (m as any).topic_name || 'General',
        topicCategory: m.topicCategory || (m as any).topic_category || 'C_PROGRAMMING',
        topicId: m.topicId || (m as any).topic_id || 'mcq-c-programming',
        question: cleanQ,
        codeSnippet: m.codeSnippet || (m as any).code_snippet || null,
        options: Array.isArray(m.options) ? m.options : ['A', 'B', 'C', 'D'],
        correctOptionIndex: typeof m.correctOptionIndex === 'number' ? m.correctOptionIndex : ((m as any).correct_option_index ?? 0),
        explanation: m.explanation || '',
        companyTags: Array.isArray(m.companyTags) ? m.companyTags : (Array.isArray((m as any).company_tags) ? (m as any).company_tags : []),
        difficulty: m.difficulty || 'MEDIUM',
        is_hidden: !!m.is_hidden,
        is_deleted: false,
        sort_order: m.sort_order || maxSortOrder,
      };

      const dbPayload = {
        id: normalized.id,
        topic_id: normalized.topicId,
        topic_name: normalized.topic,
        topic_category: normalized.topicCategory,
        question: normalized.question,
        code_snippet: normalized.codeSnippet,
        options: normalized.options,
        correct_option_index: normalized.correctOptionIndex,
        explanation: normalized.explanation,
        company_tags: normalized.companyTags,
        difficulty: normalized.difficulty,
        is_hidden: normalized.is_hidden,
        is_deleted: false,
        sort_order: normalized.sort_order,
      };

      validNewMcqs.push(normalized);
      dbPayloads.push(dbPayload);
      report.success++;
    });

    if (validNewMcqs.length > 0) {
      try {
        const stored = this.getImportedMcqs();
        const combined = [...stored, ...validNewMcqs];
        localStorage.setItem('prepunite_imported_technical_mcqs', JSON.stringify(combined));
        window.dispatchEvent(new Event('prepunite-storage-update'));
      } catch (storageErr) {
        console.warn('LocalStorage MCQ save error:', storageErr);
      }
    }

    if (dbPayloads.length > 0) {
      try {
        const { error } = await supabase
          .from('technical_mcqs')
          .upsert(dbPayloads, { onConflict: 'id' });

        if (error) {
          console.warn('Supabase technical_mcqs upsert notice:', error.message || error);
          report.supabaseSynced = false;
        } else {
          report.supabaseSynced = true;
        }
      } catch (syncErr) {
        console.warn('Supabase technical_mcqs sync notice:', syncErr);
        report.supabaseSynced = false;
      }
    }

    report.importedCount = report.success;
    return report;
  },

  // ─── LIVE TOPIC QUESTION COUNTS MAP ───────────────────────────────────────
  async getTopicCountsMap(track: TechnicalTrack): Promise<Record<string, number>> {
    const countMap: Record<string, number> = {};

    try {
      if (track === 'TECHNICAL_MCQS') {
        const mcqs = await this.getTechnicalMcqs();
        mcqs.forEach(m => {
          if (m.topicId) {
            countMap[m.topicId] = (countMap[m.topicId] || 0) + 1;
          }
        });
      } else {
        const problems = track === 'PROGRAMMING_150'
          ? await this.getProgramming150Problems()
          : await this.getCampusDsaProblems();

        problems.forEach(p => {
          if (p.topicId) {
            countMap[p.topicId] = (countMap[p.topicId] || 0) + 1;
            if (track === 'PROGRAMMING_150') {
              const stageId = STAGE_SUBTOPIC_TO_STAGE_MAP[p.topicId];
              if (stageId && stageId !== p.topicId) {
                countMap[stageId] = (countMap[stageId] || 0) + 1;
              }
            }
          }
        });
      }
    } catch (err) {
      console.warn('Failed to calculate live topic counts map:', err);
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
