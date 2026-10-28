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
        .select('id, company_id, company_slug, company_name, student_name, role_title, college, year, difficulty, overall_experience, tips, upvotes, verdict, drive_type, created_at, status, user_id, user_email', { count: 'exact' })
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
          companyName: (e.company_name || e.company_slug || 'tcs').toUpperCase(),
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
          upvotes: e.upvotes || 0,
          verdict: e.verdict || 'SELECTED',
          driveType: e.drive_type || 'ON_CAMPUS',
          userId: e.user_id,
          userEmail: e.user_email,
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
      const slug = e.companySlug || (e.companyName ? e.companyName.toLowerCase() : 'tcs');
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
        content: e.overallExperience || (e.rounds && e.rounds.length > 0 ? e.rounds[0].details : 'Interview Experience Details'),
        tips: e.tips || '',
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
          userId: data.user_id,
          userEmail: data.user_email,
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
    // 🛡️ DPDP Compliance ([P0-02]): Bind authenticated user context
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    const isValidUUID = (val?: string | null): val is string =>
      typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    const resolvedUserId = (isValidUUID(currentUser?.id) ? currentUser.id : null) || (isValidUUID(req.userId) ? req.userId : null) || null;
    const resolvedUserEmail = (currentUser?.email || req.userEmail || '').trim().toLowerCase() || null;

    // Smart round parser: extract round breakdowns from markdown content if explicit rounds aren't provided
    let parsedRounds = req.rounds && req.rounds.length > 0 ? req.rounds : [];
    let overallExp = req.content || '';

    if (parsedRounds.length === 0 && req.content && req.content.trim()) {
      const roundSplits = req.content
        .split(/(?:^|\n)(?:---+\s*\n+)?(?=#{1,4}\s*Round|\bRound\s*\d+[:\-\.])/i)
        .map(s => s.trim())
        .filter(Boolean);

      if (roundSplits.length > 1) {
        let startIndex = 0;
        if (!/^#{0,4}\s*Round\s*\d+/i.test(roundSplits[0])) {
          overallExp = roundSplits[0].replace(/^Overall\s+Experience[:\s]*/i, '').trim();
          startIndex = 1;
        } else {
          overallExp = '';
        }

        const extracted: { roundTitle: string; details: string }[] = [];
        for (let i = startIndex; i < roundSplits.length; i++) {
          const section = roundSplits[i];
          const lines = section.split('\n');
          const title = lines[0].replace(/^#{1,4}\s*/, '').replace(/\*+/g, '').trim();
          const details = lines.slice(1).join('\n').trim();
          extracted.push({
            roundTitle: title || `Round ${extracted.length + 1}`,
            details: details || title,
          });
        }

        if (extracted.length > 0) {
          parsedRounds = extracted;
        }
      } else {
        parsedRounds = [
          {
            roundTitle: 'Interview Process & Details',
            details: req.content.trim(),
          },
        ];
      }
    }

    const isCompanyUUID = isValidUUID(req.companyId);
    const resolvedCompanySlug = (req.companySlug || req.companyName || (isCompanyUUID ? 'campus' : req.companyId) || 'tcs')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const resolvedCompanyName = req.companyName || (isCompanyUUID ? 'Campus Recruitment' : (req.companyId || 'TCS').toUpperCase());

    const payload = {
      company_id: isCompanyUUID ? req.companyId : null,
      company_slug: resolvedCompanySlug,
      company_name: resolvedCompanyName,
      student_name: req.isAnonymous ? 'Anonymous Candidate' : (req.studentName?.trim() || 'Student Explorer'),
      role_title: req.role || 'Software Engineer',
      college: req.college || 'Engineering College',
      year: req.year || 2026,
      difficulty: req.difficulty || 'MEDIUM',
      verdict: req.verdict || 'SELECTED',
      result: req.verdict || 'SELECTED',
      drive_type: req.driveType || 'ON_CAMPUS',
      rounds: parsedRounds,
      overall_experience: overallExp,
      tips: req.tips || '',
      status: 'PENDING',
      upvotes: 0,
      is_deleted: false,
      user_id: resolvedUserId,
      user_email: resolvedUserEmail,
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
      upvotes: 0,
      verdict: data.verdict,
      driveType: data.drive_type,
      userId: data.user_id,
      userEmail: data.user_email,
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

  // 🛡️ ATOMIC UPVOTE CONTROL PLANE ([P1-01]): Deduplicated toggle via PostgreSQL RPC
  toggleUpvote: async (id: string, clientToken?: string): Promise<{ upvoted: boolean; upvotes: number }> => {
    try {
      const token = clientToken || (() => {
        try {
          let t = localStorage.getItem('prepunite_client_token');
          if (!t) {
            t = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `client_${Date.now()}`;
            localStorage.setItem('prepunite_client_token', t);
          }
          return t;
        } catch {
          return 'client_fallback';
        }
      })();

      const { data, error } = await supabase.rpc('toggle_experience_upvote', {
        p_experience_id: id,
        p_client_id: token,
      });

      if (!error && data && typeof data === 'object') {
        const result = {
          upvoted: Boolean(data.upvoted),
          upvotes: Number(data.upvotes) || 0,
        };

        // Sync local storage mirror
        try {
          const key = 'prepunite_upvoted_experiences';
          const stored: string[] = JSON.parse(localStorage.getItem(key) || '[]');
          const next = result.upvoted
            ? Array.from(new Set([...stored, id]))
            : stored.filter((x) => x !== id);
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}

        return result;
      }
      if (error) {
        console.warn('[experienceService.toggleUpvote] Supabase RPC notice:', error.message || error);
      }
    } catch (err) {
      console.warn('[experienceService.toggleUpvote] Error executing toggle RPC:', err);
    }

    // Graceful fallback for offline / mock testing
    try {
      const key = 'prepunite_upvoted_experiences';
      const stored: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      const isUpvoted = stored.includes(id);
      const nextStored = isUpvoted ? stored.filter((x) => x !== id) : [...stored, id];
      localStorage.setItem(key, JSON.stringify(nextStored));

      const local = dataStore.getExperiences().find((e) => e.id === id);
      if (local) {
        local.upvotes = Math.max(0, (local.upvotes || 0) + (isUpvoted ? -1 : 1));
        return { upvoted: !isUpvoted, upvotes: local.upvotes };
      }
      return { upvoted: !isUpvoted, upvotes: isUpvoted ? 0 : 1 };
    } catch {
      return { upvoted: true, upvotes: 1 };
    }
  },

  upvoteExperience: async (id: string): Promise<number> => {
    const res = await experienceService.toggleUpvote(id);
    return res.upvotes;
  },

  // 🛡️ AUTHOR SELF-MANAGEMENT ([P2-01]): Students can edit or retract their own pending submissions
  updateMyExperience: async (id: string, updates: Partial<SubmitExperienceRequest>): Promise<void> => {
    const payload: any = {};
    if (updates.role) payload.role_title = updates.role;
    if (updates.college !== undefined) payload.college = updates.college;
    if (updates.year !== undefined) payload.year = updates.year;
    if (updates.difficulty) payload.difficulty = updates.difficulty;
    if (updates.content) payload.overall_experience = updates.content;
    if (updates.tips !== undefined) payload.tips = updates.tips;
    if (updates.studentName) payload.student_name = updates.studentName;
    if (updates.verdict) payload.verdict = updates.verdict;

    const { error } = await supabase
      .from('experiences')
      .update(payload)
      .eq('id', id)
      .eq('status', 'PENDING');

    if (error) {
      console.error('[experienceService.updateMyExperience] Supabase error:', error);
      throw error;
    }
  },

  retractExperience: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)
      .eq('status', 'PENDING');

    if (error) {
      console.error('[experienceService.retractExperience] Supabase error:', error);
      throw error;
    }
  },
};
