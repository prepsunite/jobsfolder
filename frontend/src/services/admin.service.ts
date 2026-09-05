import { supabase } from '@/lib/supabase';
import { dataStore } from '@/services/dataStore';
import type { AdminDashboardStats } from '@/types/admin';

export const adminService = {
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    try {
      const [compRes, questRes, expRes, pendRes, usersRes, colRes, examsRes] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('topic_questions').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('experiences').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('experiences').select('id', { count: 'exact', head: true }).eq('is_deleted', false).eq('status', 'PENDING'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('colleges').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('mock_exams').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
      ]);

      return {
        totalCompanies: compRes.count ?? dataStore.getCompanies().length,
        totalQuestions: questRes.count ?? dataStore.getQuestions().length,
        totalExperiences: expRes.count ?? dataStore.getExperiences().length,
        pendingApprovals: pendRes.count ?? dataStore.getExperiences().filter(e => e.status === 'PENDING').length,
        totalUsers: usersRes.count ?? 0,
        totalResources: examsRes.count ?? dataStore.getResources().length,
        totalRoadmaps: colRes.count ?? 0,
      };
    } catch {
      return {
        totalCompanies: dataStore.getCompanies().length,
        totalQuestions: dataStore.getQuestions().length,
        totalExperiences: dataStore.getExperiences().length,
        pendingApprovals: dataStore.getExperiences().filter(e => e.status === 'PENDING').length,
        totalUsers: 0,
        totalResources: dataStore.getResources().length,
        totalRoadmaps: 0,
      };
    }
  },

  getRegisteredUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getAllTransactions: async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getAllPaperPurchases: async () => {
    const { data, error } = await supabase
      .from('user_paper_purchases')
      .select('*')
      .order('purchased_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getAllSubscriptions: async () => {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
