import { supabase } from '@/lib/supabase';
import { auditService } from '@/services/audit.service';
import type {
  QuestionReport,
  ContactMessage,
  SubmitReportPayload,
  SubmitContactPayload,
  ReportStatus,
  ContactMessageStatus,
} from '@/types/feedback';

const LOCAL_REPORTS_KEY = 'prepunite_local_question_reports';
const LOCAL_CONTACTS_KEY = 'prepunite_local_contact_messages';

function getLocalReports(): QuestionReport[] {
  try {
    const raw = localStorage.getItem(LOCAL_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReports(reports: QuestionReport[]): void {
  try {
    localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save local question reports', e);
  }
}

function getLocalContacts(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_CONTACTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalContacts(contacts: ContactMessage[]): void {
  try {
    localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to save local contact messages', e);
  }
}

export const feedbackService = {
  // --- QUESTION REPORTS ---
  submitQuestionReport: async (payload: SubmitReportPayload): Promise<QuestionReport> => {
    try {
      const { data, error } = await supabase
        .from('question_reports')
        .insert({
          question_id: String(payload.questionId),
          question_statement: payload.questionStatement,
          company_slug: payload.companySlug || null,
          topic_id: payload.topicId || null,
          issue_type: payload.issueType,
          details: payload.details || null,
          reporter_email: payload.reporterEmail || null,
          status: 'OPEN',
        })
        .select('*')
        .single();

      if (error) {
        console.warn('[feedbackService.submitQuestionReport] Supabase error, falling back to local storage:', error);
        throw error;
      }

      return {
        id: data.id,
        question_id: data.question_id,
        question_statement: data.question_statement,
        company_slug: data.company_slug,
        topic_id: data.topic_id,
        issue_type: data.issue_type,
        details: data.details,
        reporter_email: data.reporter_email,
        status: data.status,
        admin_notes: data.admin_notes,
        created_at: data.created_at,
        resolved_at: data.resolved_at,
      };
    } catch (err) {
      console.info('[feedbackService.submitQuestionReport] Saving report locally', err);
      const newReport: QuestionReport = {
        id: 'local_rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        question_id: String(payload.questionId),
        question_statement: payload.questionStatement,
        company_slug: payload.companySlug,
        topic_id: payload.topicId,
        issue_type: payload.issueType,
        details: payload.details,
        reporter_email: payload.reporterEmail,
        status: 'OPEN',
        created_at: new Date().toISOString(),
      };
      const existing = getLocalReports();
      saveLocalReports([newReport, ...existing]);

      auditService.logAction({
        action: 'SUBMIT_QUESTION_REPORT',
        targetEntity: 'question_reports',
        targetId: newReport.id,
        afterData: newReport,
      });

      return newReport;
    }
  },

  getQuestionReports: async (statusFilter?: ReportStatus | 'ALL'): Promise<QuestionReport[]> => {
    let supabaseReports: QuestionReport[] = [];
    try {
      let query = supabase
        .from('question_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (!error && data) {
        supabaseReports = data.map((r: any) => ({
          id: r.id,
          question_id: r.question_id,
          question_statement: r.question_statement || 'Question content unavailable',
          company_slug: r.company_slug,
          topic_id: r.topic_id,
          issue_type: r.issue_type || 'OTHER',
          details: r.details,
          reporter_email: r.reporter_email,
          status: r.status || 'OPEN',
          admin_notes: r.admin_notes,
          created_at: r.created_at,
          resolved_at: r.resolved_at,
        }));
      }
    } catch (err) {
      console.warn('[feedbackService.getQuestionReports] Could not fetch from Supabase:', err);
    }

    // Merge with any local reports
    const local = getLocalReports();
    const filteredLocal = statusFilter && statusFilter !== 'ALL'
      ? local.filter(l => l.status === statusFilter)
      : local;

    // Filter out duplicates if any match id
    const supabaseIds = new Set(supabaseReports.map(r => r.id));
    const uniqueLocal = filteredLocal.filter(l => !supabaseIds.has(l.id));

    return [...supabaseReports, ...uniqueLocal].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  updateReportStatus: async (
    id: string,
    status: ReportStatus,
    adminNotes?: string
  ): Promise<void> => {
    const isResolved = status !== 'OPEN';
    const resolved_at = isResolved ? new Date().toISOString() : null;

    try {
      const updateData: any = { status, resolved_at };
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from('question_reports')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.warn('[feedbackService.updateReportStatus] Supabase error, trying local:', error);
      }
    } catch (err) {
      console.warn('[feedbackService.updateReportStatus] Failed Supabase update:', err);
    }

    // Update in local storage
    const local = getLocalReports();
    const updatedLocal = local.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          admin_notes: adminNotes !== undefined ? adminNotes : r.admin_notes,
          resolved_at: resolved_at || undefined,
        };
      }
      return r;
    });
    saveLocalReports(updatedLocal);

    auditService.logAction({
      action: `UPDATE_REPORT_STATUS_${status}`,
      targetEntity: 'question_reports',
      targetId: id,
      afterData: { status, adminNotes },
    });
  },

  deleteQuestionReport: async (id: string): Promise<void> => {
    try {
      await supabase.from('question_reports').delete().eq('id', id);
    } catch (err) {
      console.warn('[feedbackService.deleteQuestionReport] Supabase delete error:', err);
    }

    const local = getLocalReports();
    saveLocalReports(local.filter(r => r.id !== id));

    auditService.logAction({
      action: 'DELETE_QUESTION_REPORT',
      targetEntity: 'question_reports',
      targetId: id,
    });
  },

  // --- CONTACT MESSAGES ---
  submitContactMessage: async (payload: SubmitContactPayload): Promise<ContactMessage> => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          subject: payload.subject.trim(),
          message: payload.message.trim(),
          status: 'NEW',
        })
        .select('*')
        .single();

      if (error) {
        console.warn('[feedbackService.submitContactMessage] Supabase error, falling back to local storage:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: data.status,
        admin_notes: data.admin_notes,
        created_at: data.created_at,
        resolved_at: data.resolved_at,
      };
    } catch (err) {
      console.info('[feedbackService.submitContactMessage] Saving message locally', err);
      const newContact: ContactMessage = {
        id: 'local_contact_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        subject: payload.subject.trim(),
        message: payload.message.trim(),
        status: 'NEW',
        created_at: new Date().toISOString(),
      };
      const existing = getLocalContacts();
      saveLocalContacts([newContact, ...existing]);

      auditService.logAction({
        action: 'SUBMIT_CONTACT_MESSAGE',
        targetEntity: 'contact_messages',
        targetId: newContact.id,
        afterData: newContact,
      });

      return newContact;
    }
  },

  getContactMessages: async (statusFilter?: ContactMessageStatus | 'ALL'): Promise<ContactMessage[]> => {
    let supabaseMessages: ContactMessage[] = [];
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (!error && data) {
        supabaseMessages = data.map((c: any) => ({
          id: c.id,
          name: c.name || 'Anonymous User',
          email: c.email || '',
          subject: c.subject || 'General Inquiry',
          message: c.message || '',
          status: c.status || 'NEW',
          admin_notes: c.admin_notes,
          created_at: c.created_at,
          resolved_at: c.resolved_at,
        }));
      }
    } catch (err) {
      console.warn('[feedbackService.getContactMessages] Could not fetch from Supabase:', err);
    }

    const local = getLocalContacts();
    const filteredLocal = statusFilter && statusFilter !== 'ALL'
      ? local.filter(l => l.status === statusFilter)
      : local;

    const supabaseIds = new Set(supabaseMessages.map(m => m.id));
    const uniqueLocal = filteredLocal.filter(l => !supabaseIds.has(l.id));

    return [...supabaseMessages, ...uniqueLocal].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  updateContactStatus: async (
    id: string,
    status: ContactMessageStatus,
    adminNotes?: string
  ): Promise<void> => {
    const isResolved = status === 'RESOLVED';
    const resolved_at = isResolved ? new Date().toISOString() : null;

    try {
      const updateData: any = { status, resolved_at };
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from('contact_messages')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.warn('[feedbackService.updateContactStatus] Supabase error:', error);
      }
    } catch (err) {
      console.warn('[feedbackService.updateContactStatus] Failed Supabase update:', err);
    }

    const local = getLocalContacts();
    const updatedLocal = local.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          admin_notes: adminNotes !== undefined ? adminNotes : c.admin_notes,
          resolved_at: resolved_at || undefined,
        };
      }
      return c;
    });
    saveLocalContacts(updatedLocal);

    auditService.logAction({
      action: `UPDATE_CONTACT_STATUS_${status}`,
      targetEntity: 'contact_messages',
      targetId: id,
      afterData: { status, adminNotes },
    });
  },

  deleteContactMessage: async (id: string): Promise<void> => {
    try {
      await supabase.from('contact_messages').delete().eq('id', id);
    } catch (err) {
      console.warn('[feedbackService.deleteContactMessage] Supabase delete error:', err);
    }

    const local = getLocalContacts();
    saveLocalContacts(local.filter(c => c.id !== id));

    auditService.logAction({
      action: 'DELETE_CONTACT_MESSAGE',
      targetEntity: 'contact_messages',
      targetId: id,
    });
  },
};
