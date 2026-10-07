import { useQuery } from '@tanstack/react-query';
import { useAuth, GUEST_EMAIL } from '@/contexts/AuthContext';
import { mockExamSubscriptionService, type UserMockPlanTier } from '@/services/mockExamSubscription.service';

export interface UseSubscriptionResult {
  isPaid: boolean;
  isAdFree: boolean;
  isAdmin: boolean;
  plan: UserMockPlanTier;
  planName: string;
  mockExamLimit: number;
  expiresAt?: string;
  isLoading: boolean;
}

/**
 * Global subscription & ad-free entitlement hook.
 *
 * Rules:
 * - Pro, Ultra, Campus (College), and Admin users are 100% Ad-Free (isAdFree = true).
 * - Basic / Free tier and guest/unauthenticated users receive ads (isAdFree = false).
 */
export function useSubscription(): UseSubscriptionResult {
  const { user, isAdmin } = useAuth();
  const email = user?.email;

  const { data, isLoading } = useQuery({
    queryKey: ['user-subscription-plan', email],
    queryFn: () => mockExamSubscriptionService.getUserPlan(email),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    enabled: true,
  });

  const isPaid = Boolean(data?.isPaid);
  const isAdFree = Boolean(isAdmin || isPaid);
  const plan: UserMockPlanTier = data?.plan || (email === GUEST_EMAIL || !email ? 'FREE' : 'FREE');

  return {
    isPaid,
    isAdFree,
    isAdmin,
    plan,
    planName: data?.planName || (isPaid ? 'Active Pass' : 'Basic (Free)'),
    mockExamLimit: data?.mockExamLimit ?? 0,
    expiresAt: data?.expiresAt,
    isLoading,
  };
}
