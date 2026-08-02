import { supabase } from '@/lib/supabase';
import type { Company, PageResponse } from '@/types/company';
import { auditService } from '@/services/audit.service';

export const companyService = {
  getCompanies: async (search?: string, page = 0, size = 20): Promise<PageResponse<Company>> => {
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

    const mapped: Company[] = (data || []).map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      industry: c.industry || 'IT Services & Consulting',
      companySize: c.company_size || '10,000+ employees',
      headquarters: c.headquarters || 'Pan-India',
      website: c.website_url,
      logoUrl: c.logo_url,
      description: c.description || '',
      aboutCompany: c.about_company,
      isActive: !c.is_deleted,
      createdAt: c.created_at,
    }));

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

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      industry: data.industry || 'IT Services & Consulting',
      companySize: data.company_size || '10,000+ employees',
      headquarters: data.headquarters || 'Pan-India',
      website: data.website_url,
      logoUrl: data.logo_url,
      description: data.description || '',
      aboutCompany: data.about_company,
      isActive: !data.is_deleted,
      createdAt: data.created_at,
    };
  },

  createCompany: async (companyData: Partial<Company>): Promise<Company> => {
    const slug = companyData.slug || companyData.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'new-company';
    const payload: Record<string, any> = {
      name: companyData.name || 'New Company',
      slug,
      industry: companyData.industry || 'IT Services & Consulting',
      company_size: companyData.companySize || '10,000+ employees',
      headquarters: companyData.headquarters || 'Pan-India',
      description: companyData.description || '',
      website_url: companyData.website || null,
      logo_url: companyData.logoUrl || null,
      about_company: companyData.aboutCompany || null,
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
      console.error('[companyService.createCompany] Supabase error:', error);
      if (error.message?.includes('API key') || error.message?.includes('JWT') || error.code === 'PGRST301' || (error as any).status === 401) {
        throw new Error('Your Supabase session has expired or is invalid. Please sign out and sign back in to refresh your admin credentials.');
      }
      throw error;
    }

    const created: Company = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      industry: data.industry,
      companySize: data.company_size,
      headquarters: data.headquarters,
      website: data.website_url,
      logoUrl: data.logo_url,
      description: data.description,
      aboutCompany: data.about_company,
      isActive: true,
      createdAt: data.created_at,
    };

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

    const { data, error } = await query.select('*').single();

    if (error) {
      console.error('[companyService.updateCompany] Supabase error:', error);
      throw error;
    }

    const updated: Company = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      industry: data.industry,
      companySize: data.company_size,
      headquarters: data.headquarters,
      website: data.website_url,
      logoUrl: data.logo_url,
      description: data.description,
      aboutCompany: data.about_company,
      isActive: !data.is_deleted,
      createdAt: data.created_at,
    };

    auditService.logAction({
      action: 'UPDATE_COMPANY',
      targetEntity: 'companies',
      targetId: data.id,
      afterData: data,
    });

    return updated;
  },

  deleteCompany: async (idOrSlug: string): Promise<void> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    let query = supabase.from('companies').update({ is_deleted: true, deleted_at: new Date().toISOString() });
    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { error } = await query;

    if (error) {
      console.error('[companyService.deleteCompany] Supabase error:', error);
      throw error;
    }

    auditService.logAction({
      action: 'SOFT_DELETE_COMPANY',
      targetEntity: 'companies',
      targetId: idOrSlug,
      afterData: { is_deleted: true },
    });
  },
};
