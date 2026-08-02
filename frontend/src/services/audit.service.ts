import { supabase } from '@/lib/supabase';

export interface AuditLogParams {
  action: string;
  targetEntity: string;
  targetId?: string;
  beforeData?: Record<string, any> | null;
  afterData?: Record<string, any> | null;
}

export const auditService = {
  logAction: async (params: AuditLogParams): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('admin_audit_logs').insert({
        admin_id: user.id,
        admin_email: user.email || 'admin@jobsfolder.com',
        action: params.action,
        target_entity: params.targetEntity,
        target_id: params.targetId || null,
        before_data: params.beforeData ? JSON.stringify(params.beforeData) : null,
        after_data: params.afterData ? JSON.stringify(params.afterData) : null,
      });
    } catch (err) {
      console.warn('[auditService.logAction] Could not log admin action:', err);
    }
  },
};
