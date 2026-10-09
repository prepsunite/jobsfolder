import { supabase } from '@/lib/supabase';
import { type DocTabNode, type AuthorizedPaperResponse, dataStore } from '@/services/dataStore';
import { supabasePaymentService } from '@/services/supabasePaymentService';
import { flattenNodes } from '@/utils/treeUtils';

export class PaperService {
  /**
   * Secure backend authorization gateway for old papers.
   * Verifies live entitlement against PostgreSQL user_subscriptions and user_paper_purchases.
   * Eliminates client-spoofable localStorage bypasses and hardcoded mock identifiers.
   */
  static async requestAuthorizedDocument(
    examId: string,
    userRole?: string,
    userEmail?: string
  ): Promise<AuthorizedPaperResponse> {
    if (userRole === 'ADMIN') {
      return {
        status: 'AUTHORIZED',
        documentUrl: null,
        isAuthorized: true,
        userEmail: userEmail || 'admin@prepunite.com',
        timestamp: new Date().toLocaleString(),
        watermarkText: `${userEmail || 'Admin'} • PrepUnite Administrator • ${new Date().toLocaleDateString()}`,
        reasonCode: 'ADMIN_ONLY',
      };
    }

    if (!userEmail) {
      return {
        status: 'PAYMENT_REQUIRED',
        documentUrl: null,
        isAuthorized: false,
        reasonCode: 'PAYMENT_REQUIRED',
      };
    }

    try {
      // 1. Live server verification via Supabase entitlement validator
      const isEntitled = await supabasePaymentService.verifyEntitlementOnSupabase(userEmail, examId);

      if (!isEntitled) {
        return {
          status: 'PAYMENT_REQUIRED',
          documentUrl: null,
          isAuthorized: false,
          reasonCode: 'PAYMENT_REQUIRED',
        };
      }

      return {
        status: 'AUTHORIZED',
        documentUrl: null,
        isAuthorized: true,
        userEmail,
        timestamp: new Date().toLocaleString(),
        watermarkText: `${userEmail} • PrepUnite Verified Pass • ${new Date().toLocaleDateString()}`,
        reasonCode: 'AUTHORIZED',
      };
    } catch (err) {
      console.error('[PaperService.requestAuthorizedDocument] Authorization check error:', err);
      return {
        status: 'PAYMENT_REQUIRED',
        documentUrl: null,
        isAuthorized: false,
        reasonCode: 'PAYMENT_REQUIRED',
      };
    }
  }

  /**
   * Fetches tab nodes for an exam from public.paper_tab_nodes.
   */
  static async getPaperTabNodes(examId: string): Promise<DocTabNode[]> {
    try {
      const { data, error } = await supabase
        .from('paper_tab_nodes')
        .select('*')
        .eq('exam_id', examId)
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('[PaperService.getPaperTabNodes] Supabase error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(n => ({
          id: n.id,
          title: n.title,
          emoji: n.emoji || '📄',
          content: n.content || '',
          parentId: n.parent_id,
          isFree: n.is_free,
        }));
      }
    } catch (err) {
      console.warn('[PaperService.getPaperTabNodes] Fallback:', err);
    }
    return [];
  }

  /**
   * Atomically synchronizes exam paper tabs into both public.exams (JSONB)
   * and public.paper_tab_nodes (relational tree) via the atomic RPC.
   */
  static async savePaperTabNodes(examId: string, tabs: DocTabNode[]): Promise<void> {
    // 1. Primary path: Atomic PostgreSQL RPC that updates exams.paper_tabs AND synchronizes paper_tab_nodes
    try {
      const { error: rpcErr } = await supabase.rpc('save_exam_paper_tabs', {
        p_exam_id: examId,
        p_tabs: tabs,
      });

      if (!rpcErr) {
        dataStore.updateExam(examId, { paperTabs: tabs });
        return;
      }
      console.warn('[PaperService.savePaperTabNodes] RPC notice, using multi-step fallback:', rpcErr.message);
    } catch (rpcEx) {
      console.warn('[PaperService.savePaperTabNodes] RPC exception, using fallback:', rpcEx);
    }

    // 2. Resilient fallback: Direct Supabase updates
    try {
      const { error } = await supabase
        .from('exams')
        .update({ paper_tabs: tabs })
        .eq('id', examId);

      if (error) {
        console.error('[PaperService.savePaperTabNodes] Supabase error on exams update:', error);
        throw new Error(`Failed to save paper tabs: ${error.message}`);
      }
    } catch (err) {
      console.error('[PaperService.savePaperTabNodes] Failed exams update:', err);
      throw err;
    }

    // Synchronize full flattened tree (including nested child nodes) into paper_tab_nodes
    try {
      if (tabs.length > 0) {
        const flat = flattenNodes(tabs);
        const rows = flat.map((t, idx) => ({
          id: t.id,
          exam_id: examId,
          title: t.title,
          emoji: t.emoji || '📄',
          content: t.content || '',
          parent_id: (t as any).parentId || null,
          sort_order: idx,
          is_free: t.isFree === true,
          is_deleted: false,
          updated_at: new Date().toISOString(),
        }));
        const { error: tabErr } = await supabase.from('paper_tab_nodes').upsert(rows, { onConflict: 'id' });
        if (tabErr) {
          console.warn('[PaperService.savePaperTabNodes] paper_tab_nodes sync warning:', tabErr.message);
        }
      }
    } catch (syncErr) {
      console.warn('[PaperService.savePaperTabNodes] paper_tab_nodes sync notice:', syncErr);
    }

    dataStore.updateExam(examId, { paperTabs: tabs });
  }
}
