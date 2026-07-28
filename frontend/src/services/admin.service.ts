import { apiClient } from '@/lib/api-client';
import { dataStore } from '@/services/dataStore';
import type { AdminDashboardStats } from '@/types/admin';

export const adminService = {
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    try {
      const response = await apiClient.get<AdminDashboardStats>('/admin/dashboard');
      return response.data;
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
