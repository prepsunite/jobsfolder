import { supabase } from '@/lib/supabase';
import type { JobListing, JobReport, JobReportStatus } from '@/types/jobs';

type CreateJobListing = Omit<JobListing, 'id' | 'created_at' | 'updated_at'>;

export const jobsService = {
  /** Fetch all active listings (for student page). Ordered by featured, sort_order, then newest. */
  async getActiveListings(): Promise<JobListing[]> {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as JobListing[];
  },

  /** Fetch all listings (admin). Same order. */
  async getAllListings(): Promise<JobListing[]> {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as JobListing[];
  },

  /** Create a new listing. */
  async createListing(data: CreateJobListing): Promise<JobListing> {
    const { data: created, error } = await supabase
      .from('job_listings')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as JobListing;
  },

  /** Update an existing listing by id. */
  async updateListing(id: string, data: Partial<JobListing>): Promise<JobListing> {
    const { data: updated, error } = await supabase
      .from('job_listings')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated as JobListing;
  },

  /** Delete a listing by id. */
  async deleteListing(id: string): Promise<void> {
    const { error } = await supabase
      .from('job_listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /** Toggle the is_active field. */
  async toggleActive(id: string, is_active: boolean): Promise<void> {
    const { error } = await supabase
      .from('job_listings')
      .update({ is_active })
      .eq('id', id);

    if (error) throw error;
  },

  /** Toggle the is_featured field. */
  async toggleFeatured(id: string, is_featured: boolean): Promise<void> {
    const { error } = await supabase
      .from('job_listings')
      .update({ is_featured })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Bulk-purge all expired listings in an atomic single database query.
   * Deletes all rows where deadline is strictly in the past (< now).
   * Returns count of purged rows.
   */
  async purgeExpiredListings(): Promise<number> {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('job_listings')
      .delete()
      .lt('deadline', nowIso)
      .select('id');

    if (error) throw error;
    return (data ?? []).length;
  },

  /**
   * Bulk-delete a specific set of IDs in a single query.
   */
  async purgeListingsByIds(ids: string[]): Promise<number> {
    if (!ids.length) return 0;
    const { data, error } = await supabase
      .from('job_listings')
      .delete()
      .in('id', ids)
      .select('id');

    if (error) throw error;
    return (data ?? []).length;
  },

  // ─── Job Reports & Community Moderation ───────────────────────────────────

  /** Submit a user report for a job listing (public / candidate). */
  async submitJobReport(data: {
    job_id: string;
    job_title: string;
    company_name: string;
    reason: string;
    details?: string;
  }): Promise<JobReport> {
    const reportId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ('rep_' + Date.now());
    const nowIso = new Date().toISOString();

    const reportObj: JobReport = {
      id: reportId,
      job_id: data.job_id,
      job_title: data.job_title,
      company_name: data.company_name,
      reason: data.reason,
      details: data.details || null,
      status: 'OPEN',
      created_at: nowIso,
    };

    // Note: Do not chain .select() here. Public candidates have INSERT permissions,
    // but not SELECT permissions on public.job_reports (admin only).
    // Pure .insert() succeeds without triggering a RETURNING RLS check.
    const { error } = await supabase
      .from('job_reports')
      .insert({
        id: reportId,
        job_id: data.job_id,
        job_title: data.job_title,
        company_name: data.company_name,
        reason: data.reason,
        details: data.details || null,
        status: 'OPEN',
      });

    if (error) {
      console.error('[jobsService.submitJobReport] Supabase insert error:', error.message);
      throw error;
    }

    return reportObj;
  },

  /** Fetch all job reports (admin). */
  async getJobReports(statusFilter?: JobReportStatus | 'ALL'): Promise<JobReport[]> {
    let query = supabase
      .from('job_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[jobsService.getJobReports] Note:', error.message);
      return [];
    }
    return (data ?? []) as JobReport[];
  },

  /** Update job report status (admin). */
  async updateJobReportStatus(
    id: string,
    status: JobReportStatus,
    admin_notes?: string
  ): Promise<void> {
    const updatePayload: Record<string, any> = {
      status,
      resolved_at: status !== 'OPEN' ? new Date().toISOString() : null,
    };
    if (admin_notes !== undefined) {
      updatePayload.admin_notes = admin_notes;
    }

    const { error } = await supabase
      .from('job_reports')
      .update(updatePayload)
      .eq('id', id);

    if (error) throw error;
  },

  /** Delete a job report (admin). */
  async deleteJobReport(id: string): Promise<void> {
    const { error } = await supabase
      .from('job_reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
