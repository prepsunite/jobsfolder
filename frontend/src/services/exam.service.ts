import { supabase } from '@/lib/supabase';
import type { ExamItem } from '@/services/dataStore';
import { auditService } from '@/services/audit.service';

export interface ExamWithCompany extends ExamItem {
  companyName: string;
  companyLogoUrl?: string;
  companyIndustry?: string;
}

export const examService = {
  getExamsByCompany: async (companySlug: string, userEmail?: string): Promise<ExamItem[]> => {
    // 1. Attempt Secure Server-Side Redaction RPC
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_secure_exams_by_company', {
        p_company_slug: companySlug,
        p_user_email: userEmail || null,
      });

      if (!rpcError && rpcData && rpcData.length > 0) {
        return rpcData.map((e: any) => ({
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
          isPublicExam: e.is_public_exam ?? false,
          upvotes: e.upvotes || 0,
        }));
      }
    } catch (rpcErr) {
      console.warn('[examService.getExamsByCompany] RPC fallback to direct query:', rpcErr);
    }

    // 2. Direct Query Fallback
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
        isPublicExam: e.is_public_exam ?? false,
        upvotes: e.upvotes || 0,
      }));
    }

    return [];
  },

  getAllExams: async (): Promise<ExamWithCompany[]> => {
    const [examsRes, compsRes] = await Promise.all([
      supabase
        .from('exams')
        .select(`
          *,
          companies (
            id,
            name,
            logo_url,
            industry
          )
        `)
        .eq('is_deleted', false)
        .order('name', { ascending: true }),
      supabase
        .from('companies')
        .select('id, name, slug, logo_url, industry')
        .eq('is_deleted', false),
    ]);

    if (examsRes.error) {
      console.error('[examService.getAllExams] Supabase error:', examsRes.error);
      throw examsRes.error;
    }

    const companyMapBySlug = new Map(
      (compsRes.data || []).map(c => [c.slug, c])
    );
    const companyMapById = new Map(
      (compsRes.data || []).map(c => [c.id, c])
    );

    if (examsRes.data && examsRes.data.length > 0) {
      return examsRes.data.map(e => {
        const joinedComp = Array.isArray(e.companies) ? e.companies[0] : e.companies;
        const fallbackComp = joinedComp || companyMapBySlug.get(e.company_slug) || companyMapById.get(e.company_id);

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
          isPublicExam: e.is_public_exam ?? false,
          upvotes: e.upvotes || 0,
          companyName: fallbackComp?.name || e.company_slug.toUpperCase(),
          companyLogoUrl: fallbackComp?.logo_url || undefined,
          companyIndustry: fallbackComp?.industry || 'IT Services & Consulting',
        };
      });
    }

    return [];
  },

  createExam: async (examData: Partial<ExamItem>): Promise<ExamItem> => {
    const companySlug = examData.companySlug || 'tcs';

    let companyId: string | null = null;
    try {
      const { data: comp } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', companySlug)
        .maybeSingle();
      if (comp?.id) companyId = comp.id;
    } catch {}

    const payload: Record<string, any> = {
      company_slug: companySlug,
      company_id: companyId,
      name: examData.name || 'New Exam Module',
      badge: examData.badge || 'Drive',
      content: examData.content || '### New Exam Syllabus\n\nWrite details here...',
      old_papers: examData.oldPapers || '### Old Papers\n\nWrite old papers here...',
      paper_tabs: examData.paperTabs || [],
      google_doc_embed_url: examData.googleDocEmbedUrl || null,
      google_doc_edit_url: examData.googleDocEditUrl || null,
      price: examData.price || 99,
      is_public_exam: examData.isPublicExam ?? false,
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
      throw new Error(error.message || 'Failed to save exam in Supabase');
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
      isPublicExam: data.is_public_exam ?? false,
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
    if (updatedFields.isPublicExam !== undefined) payload.is_public_exam = updatedFields.isPublicExam;

    let query = supabase.from('exams').update(payload);
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('name', updatedFields.name || id);
    }

    let { data, error } = await query.select('*');

    if ((!data || data.length === 0) && updatedFields.name) {
      const fallbackRes = await supabase.from('exams').update(payload).eq('name', updatedFields.name).select('*');
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      console.error('[examService.updateExam] Supabase error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Exam '${id}' not found in Supabase database.`);
    }

    const first = data[0];

    const updated: ExamItem = {
      id: first.id,
      companySlug: first.company_slug,
      name: first.name,
      badge: first.badge,
      content: first.content,
      oldPapers: first.old_papers,
      price: first.price ? Number(first.price) : 99,
      paperTabs: typeof first.paper_tabs === 'string' ? JSON.parse(first.paper_tabs) : (first.paper_tabs || []),
      googleDocEmbedUrl: first.google_doc_embed_url,
      googleDocEditUrl: first.google_doc_edit_url,
      isPublicExam: first.is_public_exam ?? false,
      upvotes: first.upvotes || 0,
    };

    auditService.logAction({
      action: 'UPDATE_EXAM',
      targetEntity: 'exams',
      targetId: first.id,
      afterData: first,
    });

    return updated;
  },

  deleteExam: async (id: string): Promise<void> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const now = new Date().toISOString();

    let query = supabase.from('exams').update({ is_deleted: true, deleted_at: now });
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('name', id);
    }

    const { error } = await query;

    if (error) {
      console.error('[examService.deleteExam] Supabase error:', error);
      throw new Error(error.message || 'Failed to delete exam from Supabase');
    }

    // Soft-delete ONLY paper tab nodes associated with this specific exam
    try {
      await supabase
        .from('paper_tab_nodes')
        .update({ is_deleted: true })
        .eq('exam_id', id);
    } catch {}

    auditService.logAction({
      action: 'SOFT_DELETE_EXAM',
      targetEntity: 'exams',
      targetId: id,
      afterData: { is_deleted: true },
    });
  },
};
