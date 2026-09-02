import { supabase } from '@/lib/supabase';
import { dataStore } from '@/services/dataStore';
import type { InterviewExperience, SubmitExperienceRequest } from '@/types/experience';
import type { PageResponse } from '@/types/company';
import { auditService } from '@/services/audit.service';

export const experienceService = {
  getApprovedExperiences: async (
    companyId?: string,
    search?: string,
    page = 0,
    size = 15
  ): Promise<PageResponse<InterviewExperience>> => {
    try {
      let query = supabase
        .from('experiences')
        .select('*', { count: 'exact' })
        .eq('is_deleted', false)
        .eq('status', 'APPROVED')
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.or(`company_id.eq.${companyId},company_slug.eq.${companyId}`);
      }
      if (search && search.trim()) {
        query = query.or(`student_name.ilike.%${search.trim()}%,role_title.ilike.%${search.trim()}%`);
      }

      const start = page * size;
      const end = start + size - 1;
      query = query.range(start, end);

      const { data, count, error } = await query;

      if (error) {
        console.error('[experienceService.getApprovedExperiences] Supabase error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        const mapped: InterviewExperience[] = data.map(e => ({
          id: e.id,
          companyId: e.company_id || e.company_slug || 'tcs',
          companyName: (e.company_slug || 'tcs').toUpperCase(),
          companySlug: e.company_slug || 'tcs',
          authorName: e.student_name || 'Student Explorer',
          role: e.role_title || 'Software Engineer',
          college: e.college || 'Engineering College',
          year: e.year || 2026,
          difficulty: e.difficulty || 'MEDIUM',
          content: e.overall_experience || 'No experience content provided.',
          tips: e.tips || '',
          resourcesUsed: '',
          status: e.status || 'APPROVED',
          isAnonymous: false,
          viewCount: 15,
          createdAt: e.created_at,
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
      console.warn('[experienceService.getApprovedExperiences] Fallback to local dataStore:', err);
    }

    const local = dataStore.getExperiences().filter(e => e.status === 'APPROVED');
    const mappedLocal: InterviewExperience[] = local.map(e => {
      const expAny = e as any;
      const slug = expAny.companySlug || (expAny.companyName ? expAny.companyName.toLowerCase() : 'tcs');
      return {
        id: e.id,
        companyId: slug,
        companyName: e.companyName || 'TCS',
        companySlug: slug,
        authorName: e.studentName || 'Student Explorer',
        role: e.role || 'Software Engineer',
        college: e.college,
        year: e.year,
        difficulty: e.difficulty as any,
        content: expAny.overallExperience || (e.rounds && e.rounds.length > 0 ? e.rounds[0].details : 'Interview Experience Details'),
        tips: expAny.tips || '',
        resourcesUsed: '',
        status: (e.status as any) || 'APPROVED',
        isAnonymous: false,
        viewCount: 10,
        createdAt: new Date().toISOString(),
      };
    });

    return {
      content: mappedLocal,
      pageable: { pageNumber: page, pageSize: size },
      totalElements: mappedLocal.length,
      totalPages: Math.ceil(mappedLocal.length / size),
      last: true,
      first: page === 0,
    };
  },

  getExperienceById: async (id: string): Promise<InterviewExperience> => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .eq('is_deleted', false)
        .maybeSingle();

      if (error) {
        console.error('[experienceService.getExperienceById] Supabase error:', error);
        throw error;
      }

      if (data) {
        return {
          id: data.id,
          companyId: data.company_id || data.company_slug || 'tcs',
          companyName: (data.company_slug || 'tcs').toUpperCase(),
          companySlug: data.company_slug || 'tcs',
          authorName: data.student_name || 'Student Explorer',
          role: data.role_title || 'Software Engineer',
          college: data.college || 'Engineering College',
          year: data.year || 2026,
          difficulty: data.difficulty || 'MEDIUM',
          content: data.overall_experience || '',
          tips: data.tips || '',
          resourcesUsed: '',
          status: data.status || 'APPROVED',
          isAnonymous: false,
          viewCount: 20,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn('[experienceService.getExperienceById] Fallback to local dataStore:', err);
    }

    const local = dataStore.getExperiences().find(e => e.id === id);
    if (local) {
      const expAny = local as any;
      const slug = expAny.companySlug || (local.companyName ? local.companyName.toLowerCase() : 'tcs');
      return {
        id: local.id,
        companyId: slug,
        companyName: local.companyName || 'TCS',
        companySlug: slug,
        authorName: local.studentName || 'Student Explorer',
        role: local.role || 'Software Engineer',
        college: local.college,
        year: local.year,
        difficulty: local.difficulty as any,
        content: expAny.overallExperience || (local.rounds && local.rounds.length > 0 ? local.rounds[0].details : ''),
        tips: expAny.tips || '',
        resourcesUsed: '',
        status: (local.status as any) || 'APPROVED',
        isAnonymous: false,
        viewCount: 10,
        createdAt: new Date().toISOString(),
      };
    }

    return {
      id,
      companyId: 'tcs',
      companyName: 'TCS',
      companySlug: 'tcs',
      authorName: 'Student Explorer',
      role: 'Software Engineer',
      content: '',
      status: 'APPROVED',
      isAnonymous: false,
      viewCount: 0,
      createdAt: new Date().toISOString(),
    };
  },

  submitExperience: async (req: SubmitExperienceRequest): Promise<InterviewExperience> => {
    const payload = {
      company_slug: (req.companyId || 'tcs').toLowerCase(),
      student_name: 'Student Explorer',
      role_title: req.role || 'Software Engineer',
      college: req.college || 'Engineering College',
      year: req.year || 2026,
      difficulty: req.difficulty || 'MEDIUM',
      verdict: 'SELECTED',
      result: 'SELECTED',
      rounds: [],
      overall_experience: req.content || '',
      tips: req.tips || '',
      status: 'PENDING',
      is_deleted: false,
    };

    const { data, error } = await supabase
      .from('experiences')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('[experienceService.submitExperience] Supabase error:', error.message || error);
      throw error;
    }

    return {
      id: data.id,
      companyId: data.company_slug,
      companyName: data.company_slug.toUpperCase(),
      companySlug: data.company_slug,
      authorName: data.student_name,
      role: data.role_title,
      college: data.college,
      year: data.year,
      difficulty: data.difficulty,
      content: data.overall_experience,
      tips: data.tips,
      resourcesUsed: req.resourcesUsed,
      status: 'PENDING',
      isAnonymous: req.isAnonymous || false,
      viewCount: 0,
      createdAt: data.created_at,
    };
  },

  updateExperienceStatus: async (
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
    declineReason?: string
  ): Promise<void> => {
    const payload: any = { status };
    if (status === 'REJECTED' && declineReason) {
      payload.tips = declineReason;
    }

    const { error } = await supabase
      .from('experiences')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error('[experienceService.updateExperienceStatus] Supabase error:', error);
      throw error;
    }

    auditService.logAction({
      action: `UPDATE_EXPERIENCE_STATUS_${status}`,
      targetEntity: 'experiences',
      targetId: id,
      afterData: { status, declineReason },
    });

    dataStore.updateExperience(id, { status: status as any });
  },
};
