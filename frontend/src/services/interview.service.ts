import { supabase } from '@/lib/supabase';
import { GUEST_EMAIL } from '@/contexts/AuthContext';
import type { InterviewQuestion, CoreCsSubject, InterviewCategory, InterviewTopic } from '@/types/interview';
import { ALL_INTERVIEW_TOPICS, CORE_CS_TOPICS, HR_BEHAVIORAL_TOPICS, PROJECT_DEFENSE_TOPICS } from './interviewTopicsData';

let cachedOfflineSeed: InterviewQuestion[] | null = null;
async function getOfflineSeedQuestions(): Promise<InterviewQuestion[]> {
  if (cachedOfflineSeed) return cachedOfflineSeed;
  try {
    const mod = await import('./interviewSeedData');
    cachedOfflineSeed = mod.ALL_INTERVIEW_SEED_QUESTIONS || [];
    return cachedOfflineSeed;
  } catch (err) {
    console.error('Failed to dynamically load interview seed data:', err);
    return [];
  }
}

const MASTERED_INTERVIEW_KEY = 'prepunite_mastered_interview_questions';

const normalizeDbQuestion = (d: any, masteredSet: Set<string>): InterviewQuestion => ({
  id: d.id,
  topicId: d.topic_id || d.topicId,
  title: d.title,
  category: d.category || 'CORE_CS',
  subject: d.subject,
  subjectLabel: d.subject_label || d.subjectLabel,
  bulletPoints: Array.isArray(d.bullet_points) ? d.bullet_points : (Array.isArray(d.bulletPoints) ? d.bulletPoints : []),
  answer: d.answer || '',
  codeSnippet: d.code_snippet || d.codeSnippet,
  proTip: d.pro_tip || d.proTip || '',
  companyTags: Array.isArray(d.company_tags) ? d.company_tags : (Array.isArray(d.companyTags) ? d.companyTags : []),
  frequency: d.frequency || 'MEDIUM',
  difficulty: d.difficulty || 'MEDIUM',
  mastered: masteredSet.has(d.id),
  is_hidden: d.is_hidden || false,
  is_deleted: d.is_deleted || false,
  sort_order: d.sort_order || 0,
  created_at: d.created_at,
  updated_at: d.updated_at,
});

export const interviewService = {
  // ─── Mastery State Management ─────────────────────────────────────────────
  getMasteredQuestionIds(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(MASTERED_INTERVIEW_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  },

  toggleQuestionMastered(questionId: string, userEmail?: string): boolean {
    const masteredSet = this.getMasteredQuestionIds();
    let isNowMastered = false;
    if (masteredSet.has(questionId)) {
      masteredSet.delete(questionId);
      isNowMastered = false;
    } else {
      masteredSet.add(questionId);
      isNowMastered = true;
    }
    try {
      localStorage.setItem(MASTERED_INTERVIEW_KEY, JSON.stringify(Array.from(masteredSet)));
    } catch {}

    if (userEmail && userEmail !== GUEST_EMAIL) {
      if (isNowMastered) {
        supabase
          .from('user_interview_progress')
          .upsert({
            user_email: userEmail,
            question_id: questionId,
            is_mastered: true,
            mastered_at: new Date().toISOString(),
          }, { onConflict: 'user_email,question_id' })
          .then(({ error }) => {
            if (error) console.warn('Supabase interview progress sync failed:', error.message);
          });
      } else {
        supabase
          .from('user_interview_progress')
          .delete()
          .eq('user_email', userEmail)
          .eq('question_id', questionId)
          .then(({ error }) => {
            if (error) console.warn('Supabase interview progress delete failed:', error.message);
          });
      }
    }

    return isNowMastered;
  },

  async fetchAndSyncFromSupabase(userEmail?: string): Promise<void> {
    if (!userEmail || userEmail === GUEST_EMAIL || typeof window === 'undefined') return;

    try {
      const { data } = await supabase
        .from('user_interview_progress')
        .select('question_id')
        .eq('user_email', userEmail)
        .eq('is_mastered', true);

      if (data && data.length > 0) {
        const currentSet = this.getMasteredQuestionIds();
        data.forEach(r => currentSet.add(r.question_id));
        localStorage.setItem(MASTERED_INTERVIEW_KEY, JSON.stringify(Array.from(currentSet)));
      }
    } catch (e) {
      console.warn('Failed to fetch interview progress from Supabase:', e);
    }
  },

  // ─── TOPIC CRUD (Supabase-First with Seed Fallback) ─────────────────────────
  async getTopicsForCategory(category: InterviewCategory): Promise<InterviewTopic[]> {
    let topics: InterviewTopic[] = [];

    try {
      const { data, error } = await supabase
        .from('interview_topics')
        .select('*')
        .eq('category', category)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        topics = data.map((d: any) => ({
          id: d.id,
          title: d.name || d.title,
          name: d.name || d.title,
          category: d.category,
          cluster: d.cluster,
          description: d.description || '',
          iconName: d.icon_name || d.iconName || 'BookOpen',
          icon_name: d.icon_name || 'BookOpen',
          is_hidden: d.is_hidden || false,
          formulas: Array.isArray(d.formulas) ? d.formulas : [],
          sort_order: d.sort_order || 0,
          created_at: d.created_at,
          updated_at: d.updated_at,
        }));
      }
    } catch (err) {
      console.warn('Failed to query interview_topics from Supabase, falling back:', err);
    }

    // Fallback seed
    if (!topics.length) {
      topics = ALL_INTERVIEW_TOPICS.filter(t => t.category === category);
    }

    // Fetch live question counts
    const countMap = await this.getTopicCountsMap(category);
    return topics.map(topic => ({
      ...topic,
      totalQuestions: countMap[topic.id] ?? topic.totalQuestions ?? 0,
    }));
  },

  async getAllTopics(): Promise<InterviewTopic[]> {
    try {
      const { data, error } = await supabase
        .from('interview_topics')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.name || d.title,
          name: d.name || d.title,
          category: d.category,
          cluster: d.cluster,
          description: d.description || '',
          iconName: d.icon_name || d.iconName || 'BookOpen',
          icon_name: d.icon_name || 'BookOpen',
          is_hidden: d.is_hidden || false,
          formulas: Array.isArray(d.formulas) ? d.formulas : [],
          sort_order: d.sort_order || 0,
          created_at: d.created_at,
          updated_at: d.updated_at,
        }));
      }
    } catch {}

    return ALL_INTERVIEW_TOPICS;
  },

  async saveTopic(topic: Partial<InterviewTopic>): Promise<{ success: boolean; error?: string }> {
    if (!topic.id || !(topic.name || topic.title)) {
      return { success: false, error: 'Topic ID and Name are required.' };
    }

    const payload = {
      id: topic.id.trim(),
      category: topic.category || 'CORE_CS',
      name: (topic.name || topic.title || '').trim(),
      cluster: (topic.cluster || 'General').trim(),
      description: topic.description || '',
      icon_name: topic.icon_name || topic.iconName || 'BookOpen',
      sort_order: topic.sort_order ?? 0,
      is_hidden: !!topic.is_hidden,
      formulas: Array.isArray(topic.formulas) ? topic.formulas : [],
    };

    try {
      const { error } = await supabase
        .from('interview_topics')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('Error saving interview topic to Supabase:', err);
      return { success: false, error: err.message };
    }
  },

  async toggleTopicVisibility(id: string, is_hidden: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('interview_topics')
        .update({ is_hidden })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to toggle interview topic visibility in Supabase:', e);
      return false;
    }
  },

  async deleteTopic(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('interview_topics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to delete interview topic from Supabase:', e);
      return false;
    }
  },

  // ─── Direct Supabase Sync & LocalStorage Migration ────────────────────────
  async syncPendingLocalStorageToSupabase(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('prepunite_imported_interview_questions');
      if (stored) {
        const raw = JSON.parse(stored);
        if (Array.isArray(raw) && raw.length > 0) {
          const payloads = raw.map(q => ({
            id: q.id,
            topic_id: q.topic_id || q.topicId || 'topic-dbms',
            title: q.title?.trim() || '',
            category: q.category || 'CORE_CS',
            subject: q.subject || null,
            subject_label: q.subject_label || q.subjectLabel || null,
            answer: q.answer?.trim() || '',
            bullet_points: Array.isArray(q.bullet_points) ? q.bullet_points : (Array.isArray(q.bulletPoints) ? q.bulletPoints : []),
            code_snippet: q.code_snippet || q.codeSnippet || null,
            pro_tip: q.pro_tip || q.proTip || '',
            company_tags: Array.isArray(q.company_tags) ? q.company_tags : (Array.isArray(q.companyTags) ? q.companyTags : []),
            frequency: q.frequency || 'MEDIUM',
            difficulty: q.difficulty || 'MEDIUM',
            is_hidden: !!q.is_hidden,
            is_deleted: false,
            sort_order: q.sort_order || 0,
          }));
          const { error } = await supabase.from('interview_questions').upsert(payloads, { onConflict: 'id' });
          if (!error) {
            localStorage.removeItem('prepunite_imported_interview_questions');
          }
        } else {
          localStorage.removeItem('prepunite_imported_interview_questions');
        }
      }
    } catch (e) {
      console.warn('Interview local storage sync to Supabase note:', e);
    }
  },

  // ─── QUESTIONS CRUD (Pure Supabase, matching Aptitude) ─────────────────────
  async getAllQuestions(): Promise<InterviewQuestion[]> {
    await this.syncPendingLocalStorageToSupabase();
    const masteredSet = this.getMasteredQuestionIds();

    try {
      let allData: any[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('interview_questions')
          .select('*')
          .eq('is_deleted', false)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) throw error;
        if (data && data.length > 0) {
          allData = allData.concat(data);
          if (data.length < pageSize) {
            hasMore = false;
          } else {
            from += pageSize;
          }
        } else {
          hasMore = false;
        }
      }

      if (allData.length > 0) {
        return allData.map(d => normalizeDbQuestion(d, masteredSet));
      }
    } catch (e) {
      console.error('Failed to query interview_questions from Supabase:', e);
    }

    // Offline seed fallback for zero latency and offline resilience (lazy loaded)
    const seed = await getOfflineSeedQuestions();
    return seed.map(q => ({
      ...q,
      mastered: masteredSet.has(q.id),
    }));
  },

  async getQuestionsForTopic(topicId: string): Promise<InterviewQuestion[]> {
    const masteredSet = this.getMasteredQuestionIds();
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(d => normalizeDbQuestion(d, masteredSet));
      }
    } catch (e) {
      console.error('Failed to query questions for topic:', e);
    }
    const seed = await getOfflineSeedQuestions();
    return seed.filter(q => q.topicId === topicId).map(q => ({
      ...q,
      mastered: masteredSet.has(q.id),
    }));
  },

  async getCoreCsQuestions(subject?: CoreCsSubject): Promise<InterviewQuestion[]> {
    const masteredSet = this.getMasteredQuestionIds();
    try {
      let query = supabase
        .from('interview_questions')
        .select('*')
        .eq('category', 'CORE_CS')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true });

      if (subject) {
        query = query.eq('subject', subject);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(d => normalizeDbQuestion(d, masteredSet));
      }
    } catch (e) {
      console.error('Failed to query Core CS questions:', e);
    }
    const seed = await getOfflineSeedQuestions();
    return seed.filter(q => q.category === 'CORE_CS' && (!subject || q.subject === subject)).map(q => ({
      ...q,
      mastered: masteredSet.has(q.id),
    }));
  },

  async getHrQuestions(): Promise<InterviewQuestion[]> {
    const masteredSet = this.getMasteredQuestionIds();
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('category', 'HR_BEHAVIORAL')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(d => normalizeDbQuestion(d, masteredSet));
      }
    } catch (e) {
      console.error('Failed to query HR questions:', e);
    }
    const seed = await getOfflineSeedQuestions();
    return seed.filter(q => q.category === 'HR_BEHAVIORAL').map(q => ({
      ...q,
      mastered: masteredSet.has(q.id),
    }));
  },

  async getProjectDefenseQuestions(): Promise<InterviewQuestion[]> {
    const masteredSet = this.getMasteredQuestionIds();
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('category', 'PROJECT_DEFENSE')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(d => normalizeDbQuestion(d, masteredSet));
      }
    } catch (e) {
      console.error('Failed to query Project Defense questions:', e);
    }
    const seed = await getOfflineSeedQuestions();
    return seed.filter(q => q.category === 'PROJECT_DEFENSE').map(q => ({
      ...q,
      mastered: masteredSet.has(q.id),
    }));
  },

  async saveInterviewQuestion(q: Partial<InterviewQuestion>): Promise<{ success: boolean; error?: string }> {
    if (!q.title || !q.answer) {
      return { success: false, error: 'Question title and answer are required.' };
    }

    const id = q.id || `custom-int-${Date.now()}`;
    const payload = {
      id,
      topic_id: q.topicId || (q as any).topic_id || 'topic-dbms',
      title: q.title.trim(),
      category: q.category || 'CORE_CS',
      subject: q.subject || null,
      subject_label: q.subjectLabel || (q as any).subject_label || null,
      answer: q.answer.trim(),
      bullet_points: Array.isArray(q.bulletPoints) ? q.bulletPoints : (Array.isArray((q as any).bullet_points) ? (q as any).bullet_points : []),
      code_snippet: q.codeSnippet || (q as any).code_snippet || null,
      pro_tip: q.proTip || (q as any).pro_tip || '',
      company_tags: Array.isArray(q.companyTags) ? q.companyTags : (Array.isArray((q as any).company_tags) ? (q as any).company_tags : []),
      frequency: q.frequency || 'MEDIUM',
      difficulty: q.difficulty || 'MEDIUM',
      is_hidden: !!q.is_hidden,
      is_deleted: false,
      sort_order: q.sort_order || 0,
    };

    try {
      const { error } = await supabase
        .from('interview_questions')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('Supabase interview question upsert error:', err);
      return { success: false, error: err.message || 'Failed to save question to Supabase' };
    }
  },

  async deleteInterviewQuestion(questionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('interview_questions')
        .update({ is_deleted: true })
        .eq('id', questionId);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to delete interview question from Supabase:', e);
      return false;
    }
  },

  async bulkDeleteInterviewQuestions(questionIds: string[]): Promise<boolean> {
    if (!questionIds || questionIds.length === 0) return true;
    try {
      const { error } = await supabase
        .from('interview_questions')
        .update({ is_deleted: true })
        .in('id', questionIds);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to bulk delete interview questions from Supabase:', e);
      return false;
    }
  },

  async importInterviewQuestions(newQuestions: Partial<InterviewQuestion>[]): Promise<{ importedCount: number }> {
    if (!Array.isArray(newQuestions) || newQuestions.length === 0) {
      return { importedCount: 0 };
    }

    let existingTitles = new Set<string>();
    let maxSortOrder = 0;

    const { data: titleData, error: titleErr } = await supabase
      .from('interview_questions')
      .select('title, sort_order')
      .eq('is_deleted', false);

    if (!titleErr && titleData) {
      titleData.forEach((r: any) => {
        if (r.title) existingTitles.add(r.title.trim().toLowerCase());
        if (typeof r.sort_order === 'number' && r.sort_order > maxSortOrder) {
          maxSortOrder = r.sort_order;
        }
      });
    } else {
      const fallbackQuestions = await this.getAllQuestions();
      existingTitles = new Set(fallbackQuestions.map(q => q.title.trim().toLowerCase()));
      maxSortOrder = fallbackQuestions.length > 0
        ? Math.max(...fallbackQuestions.map(q => q.sort_order || 0))
        : 0;
    }

    const dbPayloads: any[] = [];

    newQuestions.forEach((q, idx) => {
      if (!q || !q.title || !q.answer || !q.title.trim() || !q.answer.trim()) return;
      const cleanTitle = q.title.trim();
      const normTitle = cleanTitle.toLowerCase();

      if (existingTitles.has(normTitle)) {
        return;
      }
      existingTitles.add(normTitle);
      maxSortOrder++;

      const id = q.id || `custom-int-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      dbPayloads.push({
        id,
        topic_id: q.topicId || (q as any).topic_id || 'topic-dbms',
        title: cleanTitle,
        category: q.category || 'CORE_CS',
        subject: q.subject || null,
        subject_label: q.subjectLabel || (q as any).subject_label || null,
        bullet_points: Array.isArray(q.bulletPoints) ? q.bulletPoints : (Array.isArray((q as any).bullet_points) ? (q as any).bullet_points : []),
        answer: q.answer.trim(),
        code_snippet: q.codeSnippet || (q as any).code_snippet || null,
        pro_tip: q.proTip || (q as any).pro_tip || '',
        company_tags: Array.isArray(q.companyTags) ? q.companyTags : (Array.isArray((q as any).company_tags) ? (q as any).company_tags : []),
        frequency: q.frequency || 'MEDIUM',
        difficulty: q.difficulty || 'MEDIUM',
        is_hidden: !!q.is_hidden,
        is_deleted: false,
        sort_order: q.sort_order || maxSortOrder,
      });
    });

    if (dbPayloads.length > 0) {
      const { error } = await supabase
        .from('interview_questions')
        .upsert(dbPayloads, { onConflict: 'id' });

      if (error) {
        console.error('Supabase interview_questions upsert error:', error);
        throw new Error(`Supabase database error: ${error.message || (error as any).details || error}`);
      }
    }

    return { importedCount: dbPayloads.length };
  },

  // ─── LIVE TOPIC QUESTION COUNTS MAP ───────────────────────────────────────
  async getTopicCountsMap(category: InterviewCategory): Promise<Record<string, number>> {
    const countMap: Record<string, number> = {};

    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('topic_id')
        .eq('category', category)
        .eq('is_deleted', false);

      if (!error && data && data.length > 0) {
        data.forEach((row: any) => {
          if (row.topic_id) {
            countMap[row.topic_id] = (countMap[row.topic_id] || 0) + 1;
          }
        });
        return countMap;
      }
    } catch (err) {
      console.warn('Failed to calculate interview topic counts map:', err);
    }

    // Seed fallback count (lazy loaded)
    const seed = await getOfflineSeedQuestions();
    seed.forEach(q => {
      if (q.category === category && (q.topic_id || (q as any).topicId)) {
        const tid = (q.topic_id || (q as any).topicId) as string;
        countMap[tid] = (countMap[tid] || 0) + 1;
      }
    });

    return countMap;
  },

  async getStats() {
    const all = await this.getAllQuestions();
    const coreCs = all.filter(q => q.category === 'CORE_CS');
    const hr = all.filter(q => q.category === 'HR_BEHAVIORAL');
    const project = all.filter(q => q.category === 'PROJECT_DEFENSE');
    const masteredCount = all.filter(q => q.mastered).length;
    return {
      totalQuestions: all.length,
      masteredCount,
      coreCsTotal: coreCs.length,
      coreCsMastered: coreCs.filter(q => q.mastered).length,
      hrTotal: hr.length,
      hrMastered: hr.filter(q => q.mastered).length,
      projectTotal: project.length,
      projectMastered: project.filter(q => q.mastered).length,
      percentage: all.length > 0 ? Math.round((masteredCount / all.length) * 100) : 0,
    };
  },
};
