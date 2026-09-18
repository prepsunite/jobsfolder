import { supabase } from '@/lib/supabase';
import { dataStore, type ExamItem, type ExamWithCompany } from '@/services/dataStore';
import { auditService } from '@/services/audit.service';

export type { ExamWithCompany };

interface CompanyVisibilityCheck {
  is_hidden?: boolean;
  isHidden?: boolean;
  about_company?: string;
  description?: string;
}

interface RpcExamRow {
  id: string;
  company_slug: string;
  name: string;
  badge?: string;
  content?: string;
  old_papers?: string;
  price?: number | string;
  paper_tabs?: any;
  google_doc_embed_url?: string;
  google_doc_edit_url?: string;
  is_public_exam?: boolean;
  is_active?: boolean;
  upvotes?: number;
  created_at?: string;
}

export const HIDDEN_EXAM_MARKER = '<!-- prepunite_hidden:true -->';

export interface ExamVisibilityCheck {
  is_hidden?: boolean;
  isHidden?: boolean;
  content?: string;
  badge?: string;
}

export const parseExamHidden = (e: ExamVisibilityCheck): boolean => {
  if (e.is_hidden === true || e.isHidden === true) return true;
  if (typeof e.content === 'string' && e.content.includes(HIDDEN_EXAM_MARKER)) return true;
  if (typeof e.badge === 'string' && (e.badge.includes(HIDDEN_EXAM_MARKER) || e.badge.toLowerCase().includes('[draft]') || e.badge.toLowerCase().includes('[hidden]'))) return true;
  return false;
};

export const cleanExamContent = (content?: string): string => {
  if (!content) return '';
  return content.replace(/<!--\s*prepunite_hidden:true\s*-->/g, '').trim();
};

export const cleanExamBadge = (badge?: string): string => {
  if (!badge) return '';
  return badge
    .replace(/<!--\s*prepunite_hidden:true\s*-->/g, '')
    .replace(/\[\s*draft\s*\]/gi, '')
    .replace(/\[\s*hidden\s*\]/gi, '')
    .trim();
};

const parseCompHidden = (c: CompanyVisibilityCheck): boolean => {
  if (c.is_hidden === true || c.isHidden === true) return true;
  if (typeof c.about_company === 'string' && c.about_company.includes('<!-- prepunite_hidden:true -->')) return true;
  if (typeof c.description === 'string' && c.description.includes('<!-- prepunite_hidden:true -->')) return true;
  return false;
};

export const examService = {
  getExamsByCompany: async (companySlug: string, userEmail?: string, includeHidden = false): Promise<ExamItem[]> => {
    // Strictly utilize Secure Server-Side Redaction RPC to prevent any unpaid content leakage
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_secure_exams_by_company', {
        p_company_slug: companySlug,
        p_user_email: userEmail || null,
      });

      if (rpcError) {
        console.error('[examService.getExamsByCompany] Secure RPC failure (failing closed to protect paywalled content):', rpcError.message);
        return [];
      }

      if (rpcData && rpcData.length > 0) {
        const mapped: ExamItem[] = (rpcData as RpcExamRow[]).map((e) => {
          const isHidden = parseExamHidden(e);
          return {
            id: e.id,
            companySlug: e.company_slug,
            name: e.name,
            badge: cleanExamBadge(e.badge) || 'Campus Recruitment Drive',
            content: cleanExamContent(e.content),
            oldPapers: e.old_papers || '',
            price: e.price ? Number(e.price) : 99,
            paperTabs: typeof e.paper_tabs === 'string' ? JSON.parse(e.paper_tabs) : (e.paper_tabs || []),
            googleDocEmbedUrl: e.google_doc_embed_url,
            googleDocEditUrl: e.google_doc_edit_url,
            isPublicExam: e.is_public_exam ?? false,
            upvotes: e.upvotes || 0,
            isHidden,
          };
        });

        return includeHidden ? mapped : mapped.filter((e) => !e.isHidden);
      }

      return [];
    } catch (err) {
      console.error('[examService.getExamsByCompany] Critical query failure (failing closed):', err);
      return [];
    }
  },

  getAllExams: async (includeHidden = false): Promise<ExamWithCompany[]> => {
    try {
      const { data: examsData, error: examsErr } = await supabase
        .from('exams')
        .select('id, company_slug, company_id, name, badge, content, old_papers, price, is_public_exam, upvotes, google_doc_embed_url, google_doc_edit_url, is_deleted, companies(id, slug, name, logo_url, industry, about_company, description, is_deleted)')
        .eq('is_deleted', false)
        .order('name', { ascending: true });

      if (examsErr) {
        console.warn('[examService.getAllExams] Supabase relational query notice, falling back to dataStore:', examsErr.message || examsErr);
        const dsExams = dataStore.getAllExams(includeHidden);
        return dsExams;
      }

      const dsCompanies = dataStore.getCompanies();
      const dsMapBySlug = new Map(dsCompanies.map(c => [(c.slug || '').toLowerCase().trim(), c]));

      if (examsData && examsData.length > 0) {
        const allMapped: ExamWithCompany[] = examsData.map((e: any) => {
          const relComp = e.companies as any;
          const slugKey = (e.company_slug || relComp?.slug || '').toLowerCase().trim();
          const dsFallback = dsMapBySlug.get(slugKey);

          const isCompanyHidden = relComp ? parseCompHidden(relComp) : false;
          const isHidden = parseExamHidden(e);
          const logoUrl = relComp?.logo_url || dsFallback?.logoUrl || undefined;
          const compName = relComp?.name || dsFallback?.name || (e.company_slug ? e.company_slug.toUpperCase() : 'RECRUITMENT');
          const compIndustry = relComp?.industry || dsFallback?.industry || 'IT Services & Consulting';

          return {
            id: e.id,
            companySlug: e.company_slug || relComp?.slug,
            name: e.name,
            badge: cleanExamBadge(e.badge) || 'Campus Recruitment Drive',
            content: cleanExamContent(e.content),
            oldPapers: e.old_papers || '',
            price: e.price ? Number(e.price) : 99,
            paperTabs: [],
            googleDocEmbedUrl: e.google_doc_embed_url,
            googleDocEditUrl: e.google_doc_edit_url,
            isPublicExam: e.is_public_exam ?? false,
            upvotes: e.upvotes || 0,
            companyName: compName,
            companyLogoUrl: logoUrl,
            companyIndustry: compIndustry,
            isCompanyHidden,
            isHidden,
          };
        });

        return includeHidden ? allMapped : allMapped.filter(e => !e.isCompanyHidden && !e.isHidden);
      }

      const dsExams = dataStore.getAllExams(includeHidden);
      return dsExams;
    } catch (err) {
      console.warn('[examService.getAllExams] Handled error, returning dataStore exams:', err);
      const dsExams = dataStore.getAllExams(includeHidden);
      return dsExams;
    }
  },

  toggleExamVisibility: async (id: string, isHidden: boolean): Promise<boolean> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // 1. First attempt to update native is_hidden column
    try {
      let colQuery = supabase.from('exams').update({ is_hidden: isHidden });
      colQuery = isUuid ? colQuery.eq('id', id) : colQuery.eq('name', id);
      const { error: colErr } = await colQuery;

      if (!colErr) {
        auditService.logAction({
          action: isHidden ? 'HIDE_EXAM' : 'UNHIDE_EXAM',
          targetEntity: 'exams',
          targetId: id,
          afterData: { is_hidden: isHidden },
        });
        return true;
      }
    } catch (e) {
      console.warn('[examService.toggleExamVisibility] Native column note:', e);
    }

    // 2. Resilient fallback: Embed/remove hidden metadata marker in content & badge
    try {
      let fetchQuery = supabase.from('exams').select('id, name, content, badge');
      fetchQuery = isUuid ? fetchQuery.eq('id', id) : fetchQuery.eq('name', id);
      const { data: exam, error: fetchErr } = await fetchQuery.maybeSingle();

      if (fetchErr) {
        console.warn('[examService.toggleExamVisibility] Fetch error:', fetchErr.message);
      }

      if (exam) {
        let currentContent = exam.content || '';
        currentContent = currentContent.replace(/<!--\s*prepunite_hidden:true\s*-->/g, '').trim();
        if (isHidden) {
          currentContent = currentContent ? `${currentContent}\n\n${HIDDEN_EXAM_MARKER}` : HIDDEN_EXAM_MARKER;
        }

        let currentBadge = exam.badge || 'Drive';
        currentBadge = currentBadge.replace(/<!--\s*prepunite_hidden:true\s*-->/g, '').trim();
        if (isHidden) {
          currentBadge = `${currentBadge} ${HIDDEN_EXAM_MARKER}`.trim();
        }

        let updQuery = supabase.from('exams').update({
          content: currentContent,
          badge: currentBadge,
        });
        updQuery = isUuid ? updQuery.eq('id', id) : updQuery.eq('name', id);
        const { error: updErr } = await updQuery;

        if (!updErr) {
          auditService.logAction({
            action: isHidden ? 'HIDE_EXAM_FALLBACK' : 'UNHIDE_EXAM_FALLBACK',
            targetEntity: 'exams',
            targetId: exam.id || id,
            afterData: { is_hidden: isHidden, name: exam.name },
          });
          return true;
        } else {
          console.error('[examService.toggleExamVisibility] Fallback update error:', updErr.message);
        }
      }
    } catch (fallbackErr) {
      console.error('[examService.toggleExamVisibility] Fallback exception:', fallbackErr);
    }

    return false;
  },

  createExam: async (examData: Partial<ExamItem> & { companySlug: string }): Promise<ExamItem> => {
    const companySlug = examData.companySlug.toLowerCase().trim();
    let companyId: string | null = null;

    try {
      const { data: comp, error: compErr } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', companySlug)
        .maybeSingle();
      if (compErr) console.warn('[createExam] Failed to fetch company id for slug:', compErr.message);
      if (comp?.id) companyId = comp.id;
    } catch (e) {
      console.warn('[createExam] Company lookup exception:', e);
    }

    let initialContent = examData.content || '### New Exam Syllabus\n\nWrite details here...';
    let initialBadge = examData.badge || 'Drive';
    if (examData.isHidden) {
      initialContent = initialContent ? `${initialContent}\n\n${HIDDEN_EXAM_MARKER}` : HIDDEN_EXAM_MARKER;
      initialBadge = `${initialBadge} ${HIDDEN_EXAM_MARKER}`.trim();
    }

    const payload: Record<string, any> = {
      company_slug: companySlug,
      company_id: companyId,
      name: examData.name || 'New Exam Module',
      badge: initialBadge,
      content: initialContent,
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
      badge: cleanExamBadge(data.badge) || 'Drive',
      content: cleanExamContent(data.content),
      oldPapers: data.old_papers,
      price: data.price ? Number(data.price) : 99,
      paperTabs: typeof data.paper_tabs === 'string' ? JSON.parse(data.paper_tabs) : (data.paper_tabs || []),
      googleDocEmbedUrl: data.google_doc_embed_url,
      googleDocEditUrl: data.google_doc_edit_url,
      isPublicExam: data.is_public_exam ?? false,
      upvotes: data.upvotes || 0,
      isHidden: parseExamHidden(data),
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
    if (updatedFields.badge !== undefined) {
      let b = updatedFields.badge;
      if (updatedFields.isHidden) {
        b = `${cleanExamBadge(b)} ${HIDDEN_EXAM_MARKER}`.trim();
      }
      payload.badge = b;
    }
    if (updatedFields.content !== undefined) {
      let c = updatedFields.content;
      if (updatedFields.isHidden) {
        c = `${cleanExamContent(c)}\n\n${HIDDEN_EXAM_MARKER}`;
      }
      payload.content = c;
    }
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

    // If isHidden was toggled without content/badge being provided in update fields
    if (updatedFields.isHidden !== undefined && updatedFields.content === undefined && updatedFields.badge === undefined) {
      await examService.toggleExamVisibility(first.id, updatedFields.isHidden);
    }

    const updated: ExamItem = {
      id: first.id,
      companySlug: first.company_slug,
      name: first.name,
      badge: cleanExamBadge(first.badge) || 'Drive',
      content: cleanExamContent(first.content),
      oldPapers: first.old_papers,
      price: first.price ? Number(first.price) : 99,
      paperTabs: typeof first.paper_tabs === 'string' ? JSON.parse(first.paper_tabs) : (first.paper_tabs || []),
      googleDocEmbedUrl: first.google_doc_embed_url,
      googleDocEditUrl: first.google_doc_edit_url,
      isPublicExam: first.is_public_exam ?? false,
      upvotes: first.upvotes || 0,
      isHidden: updatedFields.isHidden !== undefined ? updatedFields.isHidden : parseExamHidden(first),
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
      const { error: tabErr } = await supabase
        .from('paper_tab_nodes')
        .update({ is_deleted: true })
        .eq('exam_id', id);
      if (tabErr) {
        console.warn('[examService.deleteExam] Paper tab nodes soft delete notice:', tabErr.message);
      }
    } catch (tabErr) {
      console.warn('[examService.deleteExam] Paper tab nodes soft delete notice:', tabErr);
    }

    auditService.logAction({
      action: 'SOFT_DELETE_EXAM',
      targetEntity: 'exams',
      targetId: id,
      afterData: { is_deleted: true },
    });
  },
};
