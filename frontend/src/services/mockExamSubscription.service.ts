import { supabase } from '@/lib/supabase';
import { GUEST_EMAIL } from '@/contexts/AuthContext';

export type UserMockPlanTier = 'FREE' | 'PLUS' | 'PRO' | 'ULTRA' | 'COLLEGE';

export interface UserMockPlanInfo {
  plan: UserMockPlanTier;
  planName: string;
  isPaid: boolean;
  mockExamLimit: number; // 0 for FREE, 5 for PRO/PLUS, 999 for ULTRA/COLLEGE
  expiresAt?: string;
}

export interface MonthlyExamUsageInfo {
  plan: UserMockPlanTier;
  planName: string;
  limit: number;
  used: number;
  remaining: number;
  canGenerate: boolean;
  resetDate: string;
}

export const mockExamSubscriptionService = {
  /**
   * Resolves the current user's plan tier and monthly mock exam limit
   */
  async getUserPlan(userEmail?: string): Promise<UserMockPlanInfo> {
    if (!userEmail || userEmail === GUEST_EMAIL) {
      return {
        plan: 'FREE',
        planName: 'Free Tier',
        isPaid: false,
        mockExamLimit: 0,
      };
    }

    const cleanEmail = userEmail.trim().toLowerCase();

    // 1. Primary: Server-authoritative RPC get_mock_exam_quota_status
    try {
      const { data, error } = await supabase.rpc('get_mock_exam_quota_status', {
        p_user_email: cleanEmail,
      });

      if (!error && data) {
        return {
          plan: (data.plan as UserMockPlanTier) || 'FREE',
          planName: data.planName || 'Free Tier',
          isPaid: data.plan !== 'FREE',
          mockExamLimit: data.limit ?? 0,
          expiresAt: data.expiresAt,
        };
      }
    } catch (rpcErr) {
      console.warn('[mockExamSubscriptionService] get_mock_exam_quota_status RPC warning:', rpcErr);
    }

    // 2. Fallback: Direct Database Check (Institutional Campus Pass)
    try {
      const { data: campusSub } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_email', cleanEmail)
        .ilike('payment_id', 'B2B_CAMPUS_%')
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString())
        .limit(1)
        .maybeSingle();

      if (campusSub) {
        return {
          plan: 'COLLEGE',
          planName: campusSub.plan_name || 'Campus Pro Pass',
          isPaid: true,
          mockExamLimit: 999,
          expiresAt: campusSub.expires_at,
        };
      }
    } catch {}

    // 3. Fallback: Direct Database Check (Personal B2C plan)
    try {
      const { data } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_email', cleanEmail)
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString())
        .not('payment_id', 'ilike', 'B2B_CAMPUS_%')
        .order('expires_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        const pName = (data.plan_name || '').toLowerCase();
        if (pName.includes('ultra')) {
          return {
            plan: 'ULTRA',
            planName: data.plan_name || 'PrepUnite Ultra (Unlimited Mocks)',
            isPaid: true,
            mockExamLimit: 999,
            expiresAt: data.expires_at,
          };
        }
        return {
          plan: 'PRO',
          planName: data.plan_name || 'PrepUnite Pro (5 Mocks/mo)',
          isPaid: true,
          mockExamLimit: 5,
          expiresAt: data.expires_at,
        };
      }
    } catch (e) {
      console.warn('[mockExamSubscriptionService] Error resolving subscription:', e);
    }

    return {
      plan: 'FREE',
      planName: 'Free Tier',
      isPaid: false,
      mockExamLimit: 0,
    };
  },

  /**
   * Computes monthly usage and remaining generation quota for the candidate.
   * Strictly reads server database records [P0-03], eliminating localStorage tampering.
   */
  async getMonthlyUsage(userEmail?: string): Promise<MonthlyExamUsageInfo> {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const resetDate = nextMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (!userEmail || userEmail === GUEST_EMAIL) {
      return {
        plan: 'FREE',
        planName: 'Free Tier',
        limit: 0,
        used: 0,
        remaining: 0,
        canGenerate: false,
        resetDate,
      };
    }

    const cleanEmail = userEmail.trim().toLowerCase();

    // 1. Primary: Server-authoritative RPC
    try {
      const { data, error } = await supabase.rpc('get_mock_exam_quota_status', {
        p_user_email: cleanEmail,
      });

      if (!error && data) {
        return {
          plan: (data.plan as UserMockPlanTier) || 'FREE',
          planName: data.planName || 'Free Tier',
          limit: data.limit ?? 0,
          used: data.used ?? 0,
          remaining: data.remaining ?? 0,
          canGenerate: Boolean(data.canGenerate),
          resetDate,
        };
      }
    } catch (rpcErr) {
      console.warn('[mockExamSubscriptionService] get_mock_exam_quota_status RPC fallback:', rpcErr);
    }

    // 2. Fallback: Direct Database Check
    const planInfo = await this.getUserPlan(userEmail);
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let usedCount = 0;
    try {
      const { data: quotaRow } = await supabase
        .from('user_mock_exam_quotas')
        .select('used_count')
        .eq('user_email', cleanEmail)
        .eq('month_key', currentMonthKey)
        .maybeSingle();

      if (quotaRow) {
        usedCount = quotaRow.used_count || 0;
      }
    } catch {}

    const limit = planInfo.mockExamLimit;
    const remaining = Math.max(0, limit - usedCount);
    const canGenerate = planInfo.plan === 'COLLEGE' || planInfo.plan === 'ULTRA' || (limit > 0 && remaining > 0);

    return {
      plan: planInfo.plan,
      planName: planInfo.planName,
      limit,
      used: usedCount,
      remaining,
      canGenerate,
      resetDate,
    };
  },

  /**
   * Atomically consumes 1 mock exam quota slot on the database server before generation [P0-03].
   * Rejects client generation if monthly quota is exhausted or plan is free.
   */
  async consumeQuotaBeforeExamGeneration(userEmail: string, examId?: string): Promise<{ success: boolean; remaining: number }> {
    if (!userEmail || userEmail === GUEST_EMAIL) {
      throw new Error('Please sign in with a paid account to generate blueprint mock exams.');
    }

    const cleanEmail = userEmail.trim().toLowerCase();
    const { data, error } = await supabase.rpc('consume_mock_exam_quota', {
      p_user_email: cleanEmail,
      p_exam_id: examId || null,
    });

    if (error) {
      console.error('[mockExamSubscriptionService] consume_mock_exam_quota error:', error.message);
      throw new Error(error.message || 'Quota deduction failed. Please check your subscription.');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prepunite-quota-updated', { detail: { email: cleanEmail } }));
    }

    return {
      success: data?.success ?? true,
      remaining: data?.remaining ?? 0,
    };
  },

  /**
   * Dispatches quota update event across browser tabs/components.
   */
  recordExamGenerated(userEmail: string, _examId: string): void {
    if (!userEmail || typeof window === 'undefined') return;
    const cleanEmail = userEmail.trim().toLowerCase();
    window.dispatchEvent(new CustomEvent('prepunite-quota-updated', { detail: { email: cleanEmail } }));
  },
};
