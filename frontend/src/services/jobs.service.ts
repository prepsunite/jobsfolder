import { supabase } from '@/lib/supabase';
import type { JobListing } from '@/types/jobs';

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
};
