import { supabase, type SupabaseTransaction } from '@/lib/supabase';

export type CheckoutItemType = 'SINGLE_PAPER' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'MONTHLY_PASS';

export interface ProcessPaymentParams {
  paymentId: string;
  orderId?: string;
  amount: number;
  currency?: string;
  itemType: CheckoutItemType;
  examId?: string;
  userEmail: string;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  transactionId?: string;
  isUnlocked: boolean;
}

export class SupabasePaymentService {
  /**
   * Fetches transaction history for a user from Supabase.
   */
  async getUserTransactions(userEmail: string): Promise<SupabaseTransaction[]> {
    try {
      const normalizedEmail = userEmail.toLowerCase().trim();
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_email', normalizedEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('[SupabasePaymentService.getUserTransactions] Notice:', err);
      return [];
    }
  }

  /**
   * Verifies access entitlement live against Supabase database.
   * Fails closed (returns false on error) to prevent client-side bypass.
   */
  async verifyEntitlementOnSupabase(userEmail: string, examId?: string): Promise<boolean> {
    if (!userEmail) return false;
    const normalizedEmail = userEmail.toLowerCase().trim();

    try {
      // 1. Check active subscription (Monthly / Quarterly / Yearly)
      const { data: activeSub, error: subError } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_email', normalizedEmail)
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (!subError && activeSub) return true;

      // 2. Check single paper purchase (must not be expired)
      if (examId) {
        const { data: purchase, error: purchaseError } = await supabase
          .from('user_paper_purchases')
          .select('id')
          .eq('user_email', normalizedEmail)
          .eq('exam_id', examId)
          .gt('expires_at', new Date().toISOString())
          .maybeSingle();

        if (!purchaseError && purchase) return true;
      }

      return false;
    } catch (err) {
      console.warn('[SupabasePaymentService.verifyEntitlementOnSupabase] Entitlement check exception:', err);
      // Strictly fail-closed: never grant access on network/database error
      return false;
    }
  }
}

export const supabasePaymentService = new SupabasePaymentService();
