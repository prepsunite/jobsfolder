import { supabase } from '@/lib/supabase';
import type { Company, PageResponse } from '@/types/company';
import { dataStore } from '@/services/dataStore';
import { auditService } from '@/services/audit.service';

export const companyService = {
  getCompanies: async (search?: string, page = 0, size = 20): Promise<PageResponse<Company>> => {
    try {
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

      if (data && data.length > 0) {
        const mapped: Company[] = data.map(c => ({
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
      }
    } catch (err) {
      console.warn('[companyService.getCompanies] Falling back to local dataStore:', err);
    }

    const local = dataStore.getCompanies();
    const filtered = search
      ? local.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase()))
      : local;

    return {
      content: filtered as unknown as Company[],
      pageable: { pageNumber: page, pageSize: size },
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      last: true,
      first: page === 0,
    };
  },

  getCompanyBySlug: async (slug: string): Promise<Company> => {
    try {
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

      if (data) {
        return {
          id: data.id,
          name: data.name,
          slug: data.slug,
          industry: data.industry || 'IT Services',
          companySize: data.company_size || '10,000+ employees',
          headquarters: data.headquarters || 'Pan-India',
          website: data.website_url,
          logoUrl: data.logo_url,
          description: data.description || '',
          aboutCompany: data.about_company,
          isActive: !data.is_deleted,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn('[companyService.getCompanyBySlug] Falling back to local dataStore:', err);
    }

    const local = dataStore.getCompanies().find(c => c.slug === slug);
    if (local) return local as unknown as Company;

    return {
      id: `c-${slug}`,
      name: slug.toUpperCase(),
      slug: slug,
      description: `${slug.toUpperCase()} placement intelligence and hiring insights.`,
      industry: 'Technology & Services',
      companySize: '10,000+ employees',
      headquarters: 'Global',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  },

  createCompany: async (companyData: Partial<Company>): Promise<Company> => {
    const slug = companyData.slug || companyData.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'new-company';
    const payload = {
      name: companyData.name || 'New Company',
      slug,
      industry: companyData.industry || 'IT Services & Consulting',
      company_size: companyData.companySize || '10,000+ employees',
      headquarters: companyData.headquarters || 'Pan-India',
      description: companyData.description || '',
      website_url: companyData.website,
      logo_url: companyData.logoUrl,
      about_company: companyData.aboutCompany,
      is_deleted: false,
    };

    const { data, error } = await supabase
      .from('companies')
      .upsert(payload, { onConflict: 'slug' })
      .select('*')
      .single();

    if (error) {
      console.error('[companyService.createCompany] Supabase error:', error);
      throw error;
    }

    auditService.logAction({
      action: 'UPSERT_COMPANY',
      targetEntity: 'companies',
      targetId: data.id,
      afterData: data,
    });

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

    dataStore.addCompany(created as any);
    return created;
  },

  deleteCompany: async (idOrSlug: string): Promise<void> => {
    const { error } = await supabase
      .from('companies')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);

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

    dataStore.deleteCompany(idOrSlug);
  },
};
