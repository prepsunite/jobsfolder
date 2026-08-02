import { supabase } from '@/lib/supabase';
import { dataStore } from '@/services/dataStore';
import type { AdminDashboardStats } from '@/types/admin';

export const adminService = {
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    try {
      const [compRes, questRes, expRes, pendRes] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('topic_questions').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('experiences').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('experiences').select('id', { count: 'exact', head: true }).eq('is_deleted', false).eq('status', 'PENDING'),
      ]);

      return {
        totalCompanies: compRes.count ?? dataStore.getCompanies().length,
        totalQuestions: questRes.count ?? dataStore.getQuestions().length,
        totalExperiences: expRes.count ?? dataStore.getExperiences().length,
        pendingApprovals: pendRes.count ?? dataStore.getExperiences().filter(e => e.status === 'PENDING').length,
        totalUsers: 1250,
        totalResources: 45,
        totalRoadmaps: 12,
      };
    } catch {
      return {
        totalCompanies: dataStore.getCompanies().length,
        totalQuestions: dataStore.getQuestions().length,
        totalExperiences: dataStore.getExperiences().length,
        pendingApprovals: dataStore.getExperiences().filter(e => e.status === 'PENDING').length,
        totalUsers: 1250,
        totalResources: 45,
        totalRoadmaps: 12,
      };
    }
  },
};
