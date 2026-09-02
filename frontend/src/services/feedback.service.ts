import { supabase } from '@/lib/supabase';
import { auditService } from '@/services/audit.service';
import { rateLimiter } from '@/utils/rateLimiter';
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
    // 1. Client-Side Rate Limit & Cooldown Check
    const rateCheck = rateLimiter.check('question_report');
    if (!rateCheck.allowed) {
      throw new Error(rateCheck.reason);
    }

    // 2. Database Pre-flight Check (Server-side 24h limit)
    if (payload.reporterEmail && payload.reporterEmail.trim()) {
      try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count, error } = await supabase
          .from('question_reports')
          .select('id', { count: 'exact', head: true })
          .eq('reporter_email', payload.reporterEmail.trim().toLowerCase())
          .gte('created_at', oneDayAgo);

        if (!error && count !== null && count >= 5) {
          throw new Error('Daily report limit reached (5/5) for this email. Thank you for your feedback!');
        }
      } catch (checkErr: any) {
        if (checkErr.message?.includes('Daily report limit reached')) {
          throw checkErr;
        }
        console.warn('[feedbackService.submitQuestionReport] DB rate limit check notice:', checkErr);
      }
    }

    const reportId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ('rep_' + Date.now());
    const nowIso = new Date().toISOString();

    const newReport: QuestionReport = {
      id: reportId,
      question_id: String(payload.questionId),
      question_statement: payload.questionStatement,
      company_slug: payload.companySlug,
      topic_id: payload.topicId,
      issue_type: payload.issueType,
      details: payload.details,
      reporter_email: payload.reporterEmail,
      status: 'OPEN',
      created_at: nowIso,
    };

    try {
      const { error } = await supabase
        .from('question_reports')
        .insert({
          id: reportId,
          question_id: String(payload.questionId),
          question_statement: payload.questionStatement,
          company_slug: payload.companySlug || null,
          topic_id: payload.topicId || null,
          issue_type: payload.issueType,
          details: payload.details || null,
          reporter_email: payload.reporterEmail || null,
          status: 'OPEN',
        });

      if (error) {
        console.warn('[feedbackService.submitQuestionReport] Supabase insert warning:', error.message || error);
      } else {
        console.info('[feedbackService.submitQuestionReport] Report saved successfully to Supabase:', reportId);
      }
    } catch (err) {
      console.warn('[feedbackService.submitQuestionReport] Network error submitting to Supabase:', err);
    }

    // Record submission to update cooldown and quota counters
    rateLimiter.record('question_report');

    const existing = getLocalReports();
    saveLocalReports([newReport, ...existing]);

    auditService.logAction({
      action: 'SUBMIT_QUESTION_REPORT',
      targetEntity: 'question_reports',
      targetId: newReport.id,
      afterData: newReport,
    });

    return newReport;
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
      if (error) {
        console.warn('[feedbackService.getQuestionReports] Supabase read error (check RLS permissions on question_reports):', error.message || error);
      } else if (data) {
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
    // 1. Client-Side Rate Limit & Cooldown Check
    const rateCheck = rateLimiter.check('contact_message');
    if (!rateCheck.allowed) {
      throw new Error(rateCheck.reason);
    }

    // 2. Database Pre-flight Check (Server-side 24h limit)
    const normalizedEmail = payload.email.trim().toLowerCase();
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count, error } = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .eq('email', normalizedEmail)
        .gte('created_at', oneDayAgo);

      if (!error && count !== null && count >= 3) {
        throw new Error('Daily inquiry limit reached (3/3) for this email. For urgent assistance, please contact prepsunite@gmail.com directly.');
      }
    } catch (checkErr: any) {
      if (checkErr.message?.includes('Daily inquiry limit reached')) {
        throw checkErr;
      }
      console.warn('[feedbackService.submitContactMessage] DB rate limit check notice:', checkErr);
    }

    const contactId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ('contact_' + Date.now());
    const nowIso = new Date().toISOString();

    const newContact: ContactMessage = {
      id: contactId,
      name: payload.name.trim(),
      email: normalizedEmail,
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      status: 'NEW',
      created_at: nowIso,
    };

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          id: contactId,
          name: payload.name.trim(),
          email: normalizedEmail,
          subject: payload.subject.trim(),
          message: payload.message.trim(),
          status: 'NEW',
        });

      if (error) {
        console.warn('[feedbackService.submitContactMessage] Supabase insert warning:', error.message || error);
      } else {
        console.info('[feedbackService.submitContactMessage] Message saved successfully to Supabase:', contactId);
      }
    } catch (err) {
      console.warn('[feedbackService.submitContactMessage] Network error submitting to Supabase:', err);
    }

    // Record submission to update cooldown and quota counters
    rateLimiter.record('contact_message');

    // Always save locally so Admin sees it immediately regardless of RLS read policies
    const existing = getLocalContacts();
    saveLocalContacts([newContact, ...existing]);

    auditService.logAction({
      action: 'SUBMIT_CONTACT_MESSAGE',
      targetEntity: 'contact_messages',
      targetId: newContact.id,
      afterData: newContact,
    });

    return newContact;
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
      if (error) {
        console.warn('[feedbackService.getContactMessages] Supabase read error (check RLS permissions on contact_messages):', error.message || error);
      } else if (data) {
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
