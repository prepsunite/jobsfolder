import { supabase } from '@/lib/supabase';
import { GUEST_EMAIL } from '@/contexts/AuthContext';

export type UserMockPlanTier = 'FREE' | 'PLUS' | 'PRO' | 'COLLEGE';

export interface UserMockPlanInfo {
  plan: UserMockPlanTier;
  planName: string;
  isPaid: boolean;
  mockExamLimit: number; // 0 for FREE, 5 for PLUS, 20 for PRO, 999 for COLLEGE
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

const STORAGE_KEY_USAGE_PREFIX = 'prepunite_mock_exams_generated_';

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

    // 1. Institutional / Campus pass check
    let entitlement: { isEntitled?: boolean; collegeName?: string; expiresAt?: string } | null = null;
    try {
      const raw = localStorage.getItem('prepunite_student_entitlements');
      if (raw) {
        const parsed = JSON.parse(raw);
        entitlement = parsed[cleanEmail] || null;
      }
    } catch {}

    if (entitlement && entitlement.isEntitled) {
      return {
        plan: 'COLLEGE',
        planName: entitlement.collegeName ? `Campus Partner Pass (${entitlement.collegeName})` : 'Campus Pro Pass',
        isPaid: true,
        mockExamLimit: 999,
        expiresAt: entitlement.expiresAt,
      };
    }

    // 2. Personal retail B2C plan check from user_subscriptions
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
        if (pName.includes('plus')) {
          return {
            plan: 'PLUS',
            planName: 'PrepUnite Plus (₹139/mo)',
            isPaid: true,
            mockExamLimit: 5,
            expiresAt: data.expires_at,
          };
        }
        // Default paid tier is PRO (20 mock exams / mo)
        return {
          plan: 'PRO',
          planName: 'PrepUnite Pro (₹199/mo)',
          isPaid: true,
          mockExamLimit: 20,
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
   * Computes monthly usage and remaining generation quota for the candidate
   */
  async getMonthlyUsage(userEmail?: string): Promise<MonthlyExamUsageInfo> {
    const planInfo = await this.getUserPlan(userEmail);
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // First day of next month is the reset date
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
    const storageKey = `${STORAGE_KEY_USAGE_PREFIX}${cleanEmail}_${currentMonthKey}`;
    
    let localGens: string[] = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) localGens = JSON.parse(stored);
    } catch {}

    // Also count exams from self-practice exams storage
    const practiceExamsKey = `prepunite_practice_exams_${cleanEmail}`;
    let practiceExamsCount = 0;
    try {
      const pStored = localStorage.getItem(practiceExamsKey);
      if (pStored) {
        const pExams = JSON.parse(pStored);
        if (Array.isArray(pExams)) {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
          practiceExamsCount = pExams.filter(e => {
            const createdMs = e.created_at ? new Date(e.created_at).getTime() : 0;
            return createdMs >= startOfMonth;
          }).length;
        }
      }
    } catch {}

    const used = Math.max(localGens.length, practiceExamsCount);
    const limit = planInfo.mockExamLimit;
    const remaining = Math.max(0, limit - used);
    const canGenerate = planInfo.plan === 'COLLEGE' || remaining > 0;

    return {
      plan: planInfo.plan,
      planName: planInfo.planName,
      limit,
      used,
      remaining,
      canGenerate,
      resetDate,
    };
  },

  /**
   * Records a newly generated exam in user's monthly generation audit
   */
  recordExamGenerated(userEmail: string, examId: string): void {
    if (!userEmail || typeof window === 'undefined') return;
    const cleanEmail = userEmail.trim().toLowerCase();
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
    const storageKey = `${STORAGE_KEY_USAGE_PREFIX}${cleanEmail}_${currentMonthKey}`;

    try {
      const existing: string[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!existing.includes(examId)) {
        existing.push(examId);
        localStorage.setItem(storageKey, JSON.stringify(existing));
      }
      window.dispatchEvent(new CustomEvent('prepunite-quota-updated', { detail: { email: cleanEmail } }));
    } catch (e) {
      console.warn('Failed to record exam generation quota:', e);
    }
  },
};
