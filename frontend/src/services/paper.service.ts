import { supabase } from '@/lib/supabase';
import { dataStore, type AuthorizedPaperResponse, type DocTabNode } from '@/services/dataStore';

export class PaperService {
  static async requestAuthorizedDocument(
    examId: string,
    userRole?: string,
    userEmail: string = 'student@jobsfolder.com'
  ): Promise<AuthorizedPaperResponse> {
    return dataStore.requestAuthorizedDocument(examId, userRole, userEmail);
  }

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
        }));
      }
    } catch (err) {
      console.warn('[PaperService.getPaperTabNodes] Fallback:', err);
    }
    return [];
  }

  static async savePaperTabNodes(examId: string, tabs: DocTabNode[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('exams')
        .update({ paper_tabs: tabs })
        .eq('id', examId);

      if (error) {
        console.error('[PaperService.savePaperTabNodes] Supabase error on exams update:', error);
      }
    } catch (err) {
      console.error('[PaperService.savePaperTabNodes] Failed exams update:', err);
    }

    // 🛡️ Storage Sync: Also synchronize rows into paper_tab_nodes relational table
    try {
      if (tabs.length > 0) {
        const rows = tabs.map((t, idx) => ({
          id: t.id,
          exam_id: examId,
          title: t.title,
          emoji: t.emoji || '📄',
          content: t.content || '',
          parent_id: (t as any).parentId || null,
          sort_order: idx,
          is_deleted: false,
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('paper_tab_nodes').upsert(rows, { onConflict: 'id' });
      }
    } catch (syncErr) {
      console.warn('[PaperService.savePaperTabNodes] paper_tab_nodes sync notice:', syncErr);
    }

    dataStore.updateExam(examId, { paperTabs: tabs });
  }
}
