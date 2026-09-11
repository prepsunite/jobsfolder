import { supabase } from '@/lib/supabase';
import type { InterviewQuestion, CoreCsSubject, InterviewCategory, InterviewTopic } from '@/types/interview';
import { ALL_INTERVIEW_TOPICS, CORE_CS_TOPICS, HR_BEHAVIORAL_TOPICS, PROJECT_DEFENSE_TOPICS } from './interviewTopicsData';

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

    if (userEmail && userEmail !== 'guest@prepunite.com') {
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
    if (!userEmail || userEmail === 'guest@prepunite.com' || typeof window === 'undefined') return;

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

  // ─── QUESTIONS CRUD ───────────────────────────────────────────────────────
  async getAllQuestions(): Promise<InterviewQuestion[]> {
    const masteredSet = this.getMasteredQuestionIds();

    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(d => normalizeDbQuestion(d, masteredSet));
      }
    } catch (e) {
      console.warn('Failed to query interview_questions from Supabase, falling back:', e);
    }

    const imported = this.getImportedQuestions();
    const all = [...INTERVIEW_QUESTIONS_SEED, ...imported];
    return all.map(q => ({
      ...q,
      mastered: masteredSet.has(q.id),
    }));
  },

  async getQuestionsForTopic(topicId: string): Promise<InterviewQuestion[]> {
    const all = await this.getAllQuestions();
    return all.filter(q => q.topicId === topicId);
  },

  async getCoreCsQuestions(subject?: CoreCsSubject): Promise<InterviewQuestion[]> {
    const all = await this.getAllQuestions();
    return all.filter(q => q.category === 'CORE_CS' && (!subject || q.subject === subject));
  },

  async getHrQuestions(): Promise<InterviewQuestion[]> {
    const all = await this.getAllQuestions();
    return all.filter(q => q.category === 'HR_BEHAVIORAL');
  },

  async getProjectDefenseQuestions(): Promise<InterviewQuestion[]> {
    const all = await this.getAllQuestions();
    return all.filter(q => q.category === 'PROJECT_DEFENSE');
  },

  async saveInterviewQuestion(q: Partial<InterviewQuestion>): Promise<{ success: boolean; error?: string }> {
    if (!q.title || !q.answer) {
      return { success: false, error: 'Question title and answer are required.' };
    }

    const id = q.id || `custom-int-${Date.now()}`;
    const payload = {
      id,
      topic_id: q.topicId || q.topic_id || 'topic-dbms',
      title: q.title.trim(),
      category: q.category || 'CORE_CS',
      subject: q.subject || null,
      subject_label: q.subjectLabel || q.subject_label || null,
      answer: q.answer.trim(),
      bullet_points: Array.isArray(q.bulletPoints) ? q.bulletPoints : (Array.isArray(q.bullet_points) ? q.bullet_points : []),
      code_snippet: q.codeSnippet || q.code_snippet || null,
      pro_tip: q.proTip || q.pro_tip || '',
      company_tags: Array.isArray(q.companyTags) ? q.companyTags : (Array.isArray(q.company_tags) ? q.company_tags : []),
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
      console.warn('Supabase interview question upsert error, syncing to localStorage fallback:', err);
      const existing = this.getImportedQuestions();
      const updated = [payload as any, ...existing.filter(item => item.id !== id)];
      try {
        localStorage.setItem('prepunite_imported_interview_questions', JSON.stringify(updated));
      } catch {}
      return { success: true };
    }
  },

  async deleteInterviewQuestion(questionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('interview_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
    } catch (e) {
      console.warn('Failed to delete interview question from Supabase:', e);
    }

    const existing = this.getImportedQuestions();
    const filtered = existing.filter(q => q.id !== questionId);
    try {
      localStorage.setItem('prepunite_imported_interview_questions', JSON.stringify(filtered));
    } catch {}
    return true;
  },

  async bulkDeleteInterviewQuestions(questionIds: string[]): Promise<boolean> {
    if (!questionIds || questionIds.length === 0) return true;
    try {
      const { error } = await supabase
        .from('interview_questions')
        .delete()
        .in('id', questionIds);

      if (error) throw error;
    } catch (e) {
      console.warn('Failed to bulk delete interview questions from Supabase:', e);
    }

    const existing = this.getImportedQuestions();
    const idSet = new Set(questionIds);
    const filtered = existing.filter(q => !idSet.has(q.id));
    try {
      localStorage.setItem('prepunite_imported_interview_questions', JSON.stringify(filtered));
    } catch {}
    return true;
  },

  getImportedQuestions(): InterviewQuestion[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('prepunite_imported_interview_questions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async importInterviewQuestions(newQuestions: Partial<InterviewQuestion>[]): Promise<{ importedCount: number }> {
    let count = 0;
    const dbPayloads: any[] = [];
    const localPayloads: InterviewQuestion[] = [];

    newQuestions.forEach((q, idx) => {
      if (!q.title || !q.answer) return;
      const id = q.id || `custom-int-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      const payload = {
        id,
        topic_id: q.topicId || q.topic_id || 'topic-dbms',
        title: q.title.trim(),
        category: q.category || 'CORE_CS',
        subject: q.subject || null,
        subject_label: q.subjectLabel || q.subject_label || null,
        bullet_points: Array.isArray(q.bulletPoints) ? q.bulletPoints : (Array.isArray(q.bullet_points) ? q.bullet_points : []),
        answer: q.answer.trim(),
        code_snippet: q.codeSnippet || q.code_snippet || null,
        pro_tip: q.proTip || q.pro_tip || '',
        company_tags: Array.isArray(q.companyTags) ? q.companyTags : (Array.isArray(q.company_tags) ? q.company_tags : []),
        frequency: q.frequency || 'MEDIUM',
        difficulty: q.difficulty || 'MEDIUM',
        is_hidden: !!q.is_hidden,
        is_deleted: false,
        sort_order: q.sort_order || 0,
      };

      dbPayloads.push(payload);
      localPayloads.push(payload as any);
      count++;
    });

    if (dbPayloads.length > 0) {
      try {
        const { error } = await supabase
          .from('interview_questions')
          .upsert(dbPayloads, { onConflict: 'id' });

        if (error) throw error;
      } catch (err) {
        console.warn('Batch Supabase interview import failed, caching locally:', err);
        const existing = this.getImportedQuestions();
        try {
          localStorage.setItem('prepunite_imported_interview_questions', JSON.stringify([...existing, ...localPayloads]));
        } catch {}
      }
    }

    return { importedCount: count };
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

      if (!error && data) {
        data.forEach((row: any) => {
          if (row.topic_id) {
            countMap[row.topic_id] = (countMap[row.topic_id] || 0) + 1;
          }
        });
        return countMap;
      }
    } catch {}

    INTERVIEW_QUESTIONS_SEED.forEach(q => {
      if (q.category === category && q.topicId) {
        countMap[q.topicId] = (countMap[q.topicId] || 0) + 1;
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

const INTERVIEW_QUESTIONS_SEED: InterviewQuestion[] = [];
