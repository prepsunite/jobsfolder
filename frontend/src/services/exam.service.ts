import { supabase } from '@/lib/supabase';
import type { ExamItem, DocTabNode } from '@/services/dataStore';
import { auditService } from '@/services/audit.service';

export interface ExamWithCompany extends ExamItem {
  companyName: string;
  companyLogoUrl?: string;
  companyIndustry?: string;
}

export const examService = {
  getExamsByCompany: async (companySlug: string): Promise<ExamItem[]> => {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('company_slug', companySlug)
      .eq('is_deleted', false)
      .order('name', { ascending: true });

    if (error) {
      console.error('[examService.getExamsByCompany] Supabase error:', error);
      throw error;
    }

    if (data && data.length > 0) {
      return data.map(e => ({
        id: e.id,
        companySlug: e.company_slug,
        name: e.name,
        badge: e.badge || 'Campus Recruitment Drive',
        content: e.content || '',
        oldPapers: e.old_papers || '',
        price: e.price ? Number(e.price) : 99,
        paperTabs: typeof e.paper_tabs === 'string' ? JSON.parse(e.paper_tabs) : (e.paper_tabs || []),
        googleDocEmbedUrl: e.google_doc_embed_url,
        googleDocEditUrl: e.google_doc_edit_url,
        upvotes: e.upvotes || 0,
      }));
    }

    return [];
  },

  getAllExams: async (): Promise<ExamWithCompany[]> => {
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        companies (
          name,
          logo_url,
          industry
        )
      `)
      .eq('is_deleted', false)
      .order('name', { ascending: true });

    if (error) {
      console.error('[examService.getAllExams] Supabase error:', error);
      throw error;
    }

    if (data && data.length > 0) {
      return data.map(e => {
        const comp = Array.isArray(e.companies) ? e.companies[0] : e.companies;
        return {
          id: e.id,
          companySlug: e.company_slug,
          name: e.name,
          badge: e.badge || 'Campus Recruitment Drive',
          content: e.content || '',
          oldPapers: e.old_papers || '',
          price: e.price ? Number(e.price) : 99,
          paperTabs: typeof e.paper_tabs === 'string' ? JSON.parse(e.paper_tabs) : (e.paper_tabs || []),
          googleDocEmbedUrl: e.google_doc_embed_url,
          googleDocEditUrl: e.google_doc_edit_url,
          upvotes: e.upvotes || 0,
          companyName: comp?.name || e.company_slug.toUpperCase(),
          companyLogoUrl: comp?.logo_url,
          companyIndustry: comp?.industry || 'IT Services & Consulting',
        };
      });
    }

    return [];
  },

  createExam: async (examData: Partial<ExamItem>): Promise<ExamItem> => {
    const companySlug = examData.companySlug || 'tcs';
    const payload: Record<string, any> = {
      company_slug: companySlug,
      name: examData.name || 'New Exam Module',
      badge: examData.badge || 'Drive',
      content: examData.content || '### New Exam Syllabus\n\nWrite details here...',
      old_papers: examData.oldPapers || '### Old Papers\n\nWrite old papers here...',
      paper_tabs: examData.paperTabs || [],
      google_doc_embed_url: examData.googleDocEmbedUrl || null,
      google_doc_edit_url: examData.googleDocEditUrl || null,
      price: examData.price || 99,
      is_deleted: false,
    };

    // Only include ID if it is a valid UUID
    if (examData.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(examData.id)) {
      payload.id = examData.id;
    }

    const { data, error } = await supabase
      .from('exams')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('[examService.createExam] Supabase error:', error);
      throw error;
    }

    const created: ExamItem = {
      id: data.id,
      companySlug: data.company_slug,
      name: data.name,
      badge: data.badge,
      content: data.content,
      oldPapers: data.old_papers,
      price: data.price ? Number(data.price) : 99,
      paperTabs: typeof data.paper_tabs === 'string' ? JSON.parse(data.paper_tabs) : (data.paper_tabs || []),
      googleDocEmbedUrl: data.google_doc_embed_url,
      googleDocEditUrl: data.google_doc_edit_url,
      upvotes: data.upvotes || 0,
    };

    auditService.logAction({
      action: 'CREATE_EXAM',
      targetEntity: 'exams',
      targetId: data.id,
      afterData: data,
    });

    return created;
  },

  updateExam: async (id: string, updatedFields: Partial<ExamItem>): Promise<ExamItem> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const payload: Record<string, any> = {};
    if (updatedFields.name !== undefined) payload.name = updatedFields.name;
    if (updatedFields.badge !== undefined) payload.badge = updatedFields.badge;
    if (updatedFields.content !== undefined) payload.content = updatedFields.content;
    if (updatedFields.oldPapers !== undefined) payload.old_papers = updatedFields.oldPapers;
    if (updatedFields.paperTabs !== undefined) payload.paper_tabs = updatedFields.paperTabs;
    if (updatedFields.googleDocEmbedUrl !== undefined) payload.google_doc_embed_url = updatedFields.googleDocEmbedUrl;
    if (updatedFields.googleDocEditUrl !== undefined) payload.google_doc_edit_url = updatedFields.googleDocEditUrl;
    if (updatedFields.price !== undefined) payload.price = updatedFields.price;

    let query = supabase.from('exams').update(payload);
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('name', updatedFields.name || id);
    }

    const { data, error } = await query.select('*').single();

    if (error) {
      console.error('[examService.updateExam] Supabase error:', error);
      throw error;
    }

    const updated: ExamItem = {
      id: data.id,
      companySlug: data.company_slug,
      name: data.name,
      badge: data.badge,
      content: data.content,
      oldPapers: data.old_papers,
      price: data.price ? Number(data.price) : 99,
      paperTabs: typeof data.paper_tabs === 'string' ? JSON.parse(data.paper_tabs) : (data.paper_tabs || []),
      googleDocEmbedUrl: data.google_doc_embed_url,
      googleDocEditUrl: data.google_doc_edit_url,
      upvotes: data.upvotes || 0,
    };

    auditService.logAction({
      action: 'UPDATE_EXAM',
      targetEntity: 'exams',
      targetId: data.id,
      afterData: data,
    });

    return updated;
  },

  deleteExam: async (id: string): Promise<void> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase.from('exams').update({ is_deleted: true, deleted_at: new Date().toISOString() });
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('name', id);
    }

    const { error } = await query;

    if (error) {
      console.error('[examService.deleteExam] Supabase error:', error);
      throw error;
    }

    auditService.logAction({
      action: 'SOFT_DELETE_EXAM',
      targetEntity: 'exams',
      targetId: id,
      afterData: { is_deleted: true },
    });
  },
};
