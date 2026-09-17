import { supabase } from '@/lib/supabase';
import type { Company, PageResponse } from '@/types/company';
import { auditService } from '@/services/audit.service';

const HIDDEN_MARKER = '<!-- prepunite_hidden:true -->';

const parseIsHidden = (c: any): boolean => {
  if (c.is_hidden === true || c.isHidden === true) return true;
  if (typeof c.about_company === 'string' && c.about_company.includes(HIDDEN_MARKER)) return true;
  if (typeof c.description === 'string' && c.description.includes(HIDDEN_MARKER)) return true;
  return false;
};

const cleanAboutCompany = (text?: string | null): string => {
  if (!text) return '';
  return text.replace(/<!--\s*prepunite_hidden:true\s*-->/g, '').trim();
};

const mapCompany = (c: any): Company => {
  const isHidden = parseIsHidden(c);
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    industry: c.industry || 'IT Services & Consulting',
    companySize: c.company_size || c.companySize || '10,000+ employees',
    headquarters: c.headquarters || 'Pan-India',
    website: c.website_url || c.website,
    logoUrl: c.logo_url || c.logoUrl,
    description: c.description || '',
    aboutCompany: cleanAboutCompany(c.about_company || c.aboutCompany),
    isActive: !c.is_deleted,
    isHidden,
    createdAt: c.created_at || c.createdAt,
  };
};

export const companyService = {
  getCompanies: async (search?: string, page = 0, size = 50): Promise<PageResponse<Company>> => {
    let query = supabase
      .from('companies')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .order('name', { ascending: true });

    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search.trim()}%,slug.ilike.%${search.trim()}%`);
    }

    const start = page * size;
    const end = start + size - 1;
    query = query.range(start, end);

    const { data, count, error } = await query;

    if (error) {
      console.error('[companyService.getCompanies] Supabase error:', error);
      throw error;
    }

    const mapped: Company[] = (data || []).map(mapCompany);

    const total = count ?? mapped.length;
    return {
      content: mapped,
      pageable: { pageNumber: page, pageSize: size },
      totalElements: total,
      totalPages: Math.ceil(total / size),
      last: end >= total - 1,
      first: page === 0,
    };
  },

  getCompanyBySlug: async (slug: string): Promise<Company> => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .eq('is_deleted', false)
      .maybeSingle();

    if (error) {
      console.error('[companyService.getCompanyBySlug] Supabase error:', error);
      throw error;
    }

    if (!data) {
      throw new Error(`Company with slug '${slug}' not found.`);
    }

    return mapCompany(data);
  },

  toggleCompanyVisibility: async (idOrSlug: string, isHidden: boolean): Promise<boolean> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    // 1. First attempt to update native is_hidden column
    try {
      let colQuery = supabase.from('companies').update({ is_hidden: isHidden });
      colQuery = isUuid ? colQuery.eq('id', idOrSlug) : colQuery.eq('slug', idOrSlug);
      const { error: colErr } = await colQuery;

      if (!colErr) {
        auditService.logAction({
          action: isHidden ? 'HIDE_COMPANY' : 'UNHIDE_COMPANY',
          targetEntity: 'companies',
          targetId: idOrSlug,
          afterData: { is_hidden: isHidden },
        });
        return true;
      }
    } catch (e) {
      console.warn('[companyService.toggleCompanyVisibility] Native column note:', e);
    }

    // 2. Resilient fallback: Embed/remove hidden metadata tag in about_company
    try {
      let fetchQuery = supabase.from('companies').select('id, slug, about_company');
      fetchQuery = isUuid ? fetchQuery.eq('id', idOrSlug) : fetchQuery.eq('slug', idOrSlug);
      const { data: comp } = await fetchQuery.maybeSingle();

      if (comp) {
        let currentAbout = comp.about_company || '';
        currentAbout = currentAbout.replace(/<!--\s*prepunite_hidden:true\s*-->/g, '').trim();
        if (isHidden) {
          currentAbout = currentAbout ? `${currentAbout}\n\n${HIDDEN_MARKER}` : HIDDEN_MARKER;
        }

        let updQuery = supabase.from('companies').update({ about_company: currentAbout });
        updQuery = isUuid ? updQuery.eq('id', idOrSlug) : updQuery.eq('slug', idOrSlug);
        const { error: updErr } = await updQuery;

        if (!updErr) {
          auditService.logAction({
            action: isHidden ? 'HIDE_COMPANY_FALLBACK' : 'UNHIDE_COMPANY_FALLBACK',
            targetEntity: 'companies',
            targetId: comp.id || idOrSlug,
            afterData: { is_hidden: isHidden, slug: comp.slug },
          });
          return true;
        }
      }
    } catch (fallbackErr) {
      console.error('[companyService.toggleCompanyVisibility] Fallback error:', fallbackErr);
    }

    return false;
  },

  createCompany: async (companyData: Partial<Company>): Promise<Company> => {
    const slug = companyData.slug || companyData.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'new-company';
    let aboutComp = companyData.aboutCompany || null;
    if (companyData.isHidden) {
      aboutComp = aboutComp ? `${aboutComp}\n\n${HIDDEN_MARKER}` : HIDDEN_MARKER;
    }

    const payload: Record<string, any> = {
      name: companyData.name || 'New Company',
      slug,
      industry: companyData.industry || 'IT Services & Consulting',
      company_size: companyData.companySize || '10,000+ employees',
      headquarters: companyData.headquarters || 'Pan-India',
      description: companyData.description || '',
      website_url: companyData.website || null,
      logo_url: companyData.logoUrl || null,
      about_company: aboutComp,
      is_deleted: false,
    };

    // Only set ID if it is a valid UUID
    if (companyData.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyData.id)) {
      payload.id = companyData.id;
    }

    const { data, error } = await supabase
      .from('companies')
      .upsert(payload, { onConflict: 'slug' })
      .select('*')
      .single();

    if (error) {
      console.error('[companyService.createCompany] Full Supabase error:', error);
      throw new Error(`[${error.code || 'ERR'}] ${error.message || 'Failed to save company in Supabase'}`);
    }

    const created = mapCompany(data);

    auditService.logAction({
      action: 'UPSERT_COMPANY',
      targetEntity: 'companies',
      targetId: data.id,
      afterData: data,
    });

    return created;
  },

  updateCompany: async (idOrSlug: string, updatedFields: Partial<Company>): Promise<Company> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const payload: Record<string, any> = {};
    if (updatedFields.name !== undefined) payload.name = updatedFields.name;
    if (updatedFields.slug !== undefined) payload.slug = updatedFields.slug;
    if (updatedFields.industry !== undefined) payload.industry = updatedFields.industry;
    if (updatedFields.companySize !== undefined) payload.company_size = updatedFields.companySize;
    if (updatedFields.headquarters !== undefined) payload.headquarters = updatedFields.headquarters;
    if (updatedFields.website !== undefined) payload.website_url = updatedFields.website;
    if (updatedFields.logoUrl !== undefined) payload.logo_url = updatedFields.logoUrl;
    if (updatedFields.description !== undefined) payload.description = updatedFields.description;
    if (updatedFields.aboutCompany !== undefined) payload.about_company = updatedFields.aboutCompany;

    let query = supabase.from('companies').update(payload);
    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    let { data, error } = await query.select('*');

    if ((!data || data.length === 0) && updatedFields.slug) {
      const fallbackRes = await supabase.from('companies').update(payload).eq('slug', updatedFields.slug).select('*');
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      console.error('[companyService.updateCompany] Supabase error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Company '${idOrSlug}' not found in Supabase database.`);
    }

    const first = data[0];

    const updated: Company = mapCompany(first);

    auditService.logAction({
      action: 'UPDATE_COMPANY',
      targetEntity: 'companies',
      targetId: first.id,
      afterData: first,
    });

    return updated;
  },

  deleteCompany: async (idOrSlug: string): Promise<void> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let targetSlug = !isUuid ? idOrSlug : '';
    let targetId = isUuid ? idOrSlug : '';

    try {
      let fetchQuery = supabase.from('companies').select('id, slug');
      if (isUuid) {
        fetchQuery = fetchQuery.eq('id', idOrSlug);
      } else {
        fetchQuery = fetchQuery.eq('slug', idOrSlug);
      }
      const { data: compData } = await fetchQuery.maybeSingle();
      if (compData) {
        targetSlug = compData.slug;
        targetId = compData.id;
      }
    } catch {}

    const now = new Date().toISOString();

    let compQuery = supabase.from('companies').update({ is_deleted: true, deleted_at: now });
    if (isUuid) {
      compQuery = compQuery.eq('id', idOrSlug);
    } else {
      compQuery = compQuery.eq('slug', idOrSlug);
    }
    const { error } = await compQuery;
    if (error) {
      console.error('[companyService.deleteCompany] Supabase error:', error);
      throw error;
    }

    // Cascade soft-delete all child exams, paper tabs, and experiences for this company
    try {
      if (targetSlug) {
        const { data: childExams } = await supabase
          .from('exams')
          .select('id')
          .eq('company_slug', targetSlug);

        const examIds = (childExams || []).map(e => e.id);

        await supabase
          .from('exams')
          .update({ is_deleted: true, deleted_at: now })
          .eq('company_slug', targetSlug);

        if (examIds.length > 0) {
          await supabase
            .from('paper_tab_nodes')
            .update({ is_deleted: true })
            .in('exam_id', examIds);
        }

        await supabase
          .from('experiences')
          .update({ is_deleted: true })
          .eq('company_slug', targetSlug);
      }
    } catch (cascadeErr) {
      console.warn('[companyService.deleteCompany] Cascade delete notice:', cascadeErr);
    }

    auditService.logAction({
      action: 'SOFT_DELETE_COMPANY_CASCADE',
      targetEntity: 'companies',
      targetId: targetId || idOrSlug,
      afterData: { is_deleted: true, slug: targetSlug },
    });
  },
};
