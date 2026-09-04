import { supabase, type SupabaseTransaction } from '@/lib/supabase';
import { tpoService } from '@/services/tpo.service';

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
   * Throws on database failure so callers can display proper error states.
   */
  async getUserTransactions(userEmail: string): Promise<SupabaseTransaction[]> {
    const normalizedEmail = userEmail.toLowerCase().trim();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_email', normalizedEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabasePaymentService.getUserTransactions] Supabase query error:', error.message);
      throw new Error(`Failed to load transactions: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Verifies access entitlement live against Supabase database.
   * Fails closed (returns false on error) to prevent client-side bypass.
   */
  async verifyEntitlementOnSupabase(userEmail: string, examId?: string): Promise<boolean> {
    if (!userEmail) return false;
    const normalizedEmail = userEmail.toLowerCase().trim();

    try {
      // 1. Check active subscription (Monthly / Quarterly / Yearly / Campus Pro Pass)
      const { data: activeSub, error: subError } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_email', normalizedEmail)
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (!subError && activeSub) return true;

      // 2. Check institutional college student entitlement (Campus Pro Pass fallback)
      if (tpoService.isStudentEntitled(normalizedEmail)) {
        return true;
      }

      // 3. Check single paper purchase (must not be expired)
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
      // Institutional student fallback even on database/network error
      if (tpoService.isStudentEntitled(normalizedEmail)) {
        return true;
      }
      return false;
    }
  }
}

export const supabasePaymentService = new SupabasePaymentService();
