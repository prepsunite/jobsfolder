import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Star, StarOff,
  Briefcase, MapPin, Clock, X, Check, AlertCircle,
  ExternalLink, ChevronDown, Search, Loader2, Flag, CheckCircle2,
  Sparkles, Upload
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import { jobsService } from '@/services/jobs.service';
import type { JobListing, JobType, JobReport, JobReportStatus, ScrapedJobLead } from '@/types/jobs';
import { useToast } from '@/contexts/ToastContext';
import { curatedJobLeads } from '@/constants/curatedJobLeads';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDeadlineMeta(deadline: string | null | undefined): { label: string; cls: string } {
  if (!deadline) return { label: 'No deadline', cls: 'text-[#868E96]' };
  const now = new Date();
  const end = new Date(deadline);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: 'Expired', cls: 'text-red-600 dark:text-red-400 font-bold' };
  if (diff < 2) return { label: 'Closing soon!', cls: 'text-red-500 dark:text-red-400 font-bold animate-pulse' };
  if (diff <= 7) return { label: `${diff}d left`, cls: 'text-amber-600 dark:text-amber-400 font-semibold' };
  return { label: `${diff}d left`, cls: 'text-green-600 dark:text-green-400' };
}

function isExpiredRow(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
}

function parseAgeDays(ageStr?: string | null): number {
  if (!ageStr) return 999;
  const str = String(ageStr).trim().toLowerCase();
  if (str === 'today' || str === '0d' || str === 'active now') return 0;
  const dMatch = str.match(/^(\d+)\s*d$/i);
  if (dMatch) return parseInt(dMatch[1], 10);
  const wMatch = str.match(/^(\d+)\s*w$/i);
  if (wMatch) return parseInt(wMatch[1], 10) * 7;
  const mMatch = str.match(/^(\d+)\s*mo$/i);
  if (mMatch) return parseInt(mMatch[1], 10) * 30;
  return 999;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  const now = new Date().getTime();
  const past = new Date(dateStr).getTime();
  const diffSec = Math.max(0, Math.floor((now - past) / 1000));
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${Math.floor(diffMonth / 12)}y ago`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = Omit<JobListing, 'id' | 'created_at' | 'updated_at'>;

const EMPTY_FORM: FormState = {
  title: '',
  company_name: '',
  company_logo_url: '',
  type: 'JOB',
  location: 'Remote',
  experience_min: 0,
  experience_max: null,
  stipend_or_salary: '',
  description: '',
  apply_url: '',
  deadline: null,
  tags: [],
  is_active: true,
  is_featured: false,
  sort_order: 0,
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const COMPANY_PRESETS = [
  { name: 'Google', logo: 'https://www.google.com/favicon.ico' },
  { name: 'Microsoft', logo: 'https://www.microsoft.com/favicon.ico' },
  { name: 'Amazon', logo: 'https://www.amazon.in/favicon.ico' },
  { name: 'TCS', logo: 'https://www.tcs.com/favicon.ico' },
  { name: 'Infosys', logo: 'https://www.infosys.com/favicon.ico' },
  { name: 'Wipro', logo: 'https://www.wipro.com/favicon.ico' },
  { name: 'Accenture', logo: 'https://www.accenture.com/favicon.ico' },
  { name: 'Cognizant', logo: 'https://www.cognizant.com/favicon.ico' },
];

interface JobFormModalProps {
  initial?: JobListing | null;
  currentSno?: number;
  onClose: () => void;
  onSave: (data: FormState, id?: string, relistAsNew?: boolean) => Promise<void>;
  saving: boolean;
}

function JobFormModal({ initial, currentSno, onClose, onSave, saving }: JobFormModalProps) {
  const [form, setForm] = useState<FormState>(() =>
    initial
      ? {
          title: initial.title,
          company_name: initial.company_name,
          company_logo_url: initial.company_logo_url ?? '',
          type: initial.type,
          location: initial.location,
          experience_min: initial.experience_min,
          experience_max: initial.experience_max ?? null,
          stipend_or_salary: initial.stipend_or_salary ?? '',
          description: initial.description ?? '',
          apply_url: initial.apply_url,
          deadline: initial.deadline ? initial.deadline.slice(0, 16) : null,
          tags: initial.tags,
          is_active: initial.is_active,
          is_featured: initial.is_featured,
          sort_order: initial.sort_order,
        }
      : EMPTY_FORM
  );

  const [relistAsNew, setRelistAsNew] = useState(false);
  const [tagsInput, setTagsInput] = useState(() =>
    initial ? initial.tags.join(', ') : ''
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: FormState = {
      ...form,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      company_logo_url: form.company_logo_url || null,
      stipend_or_salary: form.stipend_or_salary || null,
      description: form.description || null,
      deadline: form.deadline || null,
      experience_max: form.experience_max == null || (form.experience_max as any) === '' ? null : Number(form.experience_max),
    };
    await onSave(payload, initial?.id || undefined, relistAsNew);
  };

  const inputCls = "w-full px-3 py-2 text-xs bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded-lg text-[#121417] dark:text-white placeholder:text-[#868E96] focus:outline-none focus:border-[#121417] dark:focus:border-[#555] transition-colors";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-[#495057] dark:text-[#AAAAAA] mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-[#141414] border-b border-[#E9ECEF] dark:border-[#242424] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-sm font-display font-extrabold text-[#121417] dark:text-white">
            {initial && initial.id ? 'Edit Listing' : initial ? 'New Listing (From Lead)' : 'New Listing'}
          </h2>
          <button type="button" onClick={onClose} className="text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title + Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Software Engineer Intern"
                className={inputCls}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls}>Company Name *</label>
                <span className="text-[9px] text-[#868E96]">Quick autofill:</span>
              </div>
              <input
                required
                type="text"
                value={form.company_name}
                onChange={(e) => set('company_name', e.target.value)}
                placeholder="e.g. Google"
                className={inputCls}
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMPANY_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      set('company_name', p.name);
                      set('company_logo_url', p.logo);
                    }}
                    className="px-1.5 py-0.5 text-[9px] font-semibold bg-[#F8F9FA] dark:bg-[#1F1F1F] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded text-[#495057] dark:text-[#AAAAAA] hover:border-[#121417] dark:hover:border-white transition-all cursor-pointer"
                  >
                    +{p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Logo URL with preview */}
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>Company Logo URL</label>
              <span className="text-[9px] text-[#868E96]">Leave blank for gradient letter badge</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="url"
                value={form.company_logo_url ?? ''}
                onChange={(e) => set('company_logo_url', e.target.value)}
                placeholder="https://... (PNG/SVG/favicon URL)"
                className={`${inputCls} flex-1`}
              />
              {form.company_logo_url && (
                <img
                  src={form.company_logo_url}
                  alt="preview"
                  className="w-10 h-10 rounded-lg object-contain border border-[#E9ECEF] dark:border-[#2A2A2A] p-1 bg-white dark:bg-[#1A1A1A] shrink-0"
                />
              )}
            </div>
          </div>

          {/* Type + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type *</label>
              <div className="flex gap-2">
                {(['JOB', 'INTERNSHIP'] as JobType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set('type', t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      form.type === t
                        ? t === 'JOB'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-green-600 text-white border-green-600'
                        : 'border-[#E9ECEF] dark:border-[#2A2A2A] text-[#495057] dark:text-[#AAAAAA] hover:border-[#121417]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="Remote"
                className={inputCls}
              />
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Experience Min (yrs)</label>
              <input
                type="number"
                min={0}
                value={form.experience_min}
                onChange={(e) => set('experience_min', Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Experience Max (yrs, optional)</label>
              <input
                type="number"
                min={0}
                value={form.experience_max ?? ''}
                onChange={(e) => set('experience_max', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="leave blank = any"
                className={inputCls}
              />
            </div>
          </div>

          {/* Stipend + Apply URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Stipend / Salary</label>
              <input
                type="text"
                value={form.stipend_or_salary ?? ''}
                onChange={(e) => set('stipend_or_salary', e.target.value)}
                placeholder="e.g. ₹20,000/month or ₹8–12 LPA"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Apply URL *</label>
              <input
                required
                type="url"
                value={form.apply_url}
                onChange={(e) => set('apply_url', e.target.value)}
                placeholder="https://careers.company.com/job/..."
                className={inputCls}
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>Deadline</label>
              <span className="text-[9px] text-[#868E96]">Leave empty for rolling admissions (no deadline)</span>
            </div>
            <input
              type="datetime-local"
              value={form.deadline ?? ''}
              onChange={(e) => set('deadline', e.target.value || null)}
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Eligibility, batch eligibility, skills, selection process..."
              className={`${inputCls} resize-y`}
            />
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>Tags (comma-separated)</label>
              <span className="text-[9px] text-[#868E96]">e.g. 2026 Batch, Java, Python, Remote</span>
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="2026 Batch, B.Tech, React, On-Campus"
              className={inputCls}
            />
          </div>

          {/* Toggles + Sort Order */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Active Status</label>
              <button
                type="button"
                onClick={() => set('is_active', !form.is_active)}
                className={`w-full py-2 rounded-lg text-xs font-bold border transition-all ${
                  form.is_active
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-[#E9ECEF] dark:border-[#2A2A2A] text-[#495057] dark:text-[#AAAAAA]'
                }`}
              >
                {form.is_active ? 'Live (Visible)' : 'Draft (Hidden)'}
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls}>Featured</label>
                <span className="text-[8px] text-amber-500 font-bold">Top Pin</span>
              </div>
              <button
                type="button"
                onClick={() => set('is_featured', !form.is_featured)}
                className={`w-full py-2 rounded-lg text-xs font-bold border transition-all ${
                  form.is_featured
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'border-[#E9ECEF] dark:border-[#2A2A2A] text-[#495057] dark:text-[#AAAAAA]'
                }`}
              >
                {form.is_featured ? '★ Featured Drive' : 'Standard'}
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls}>Sort Priority</label>
                <span className="text-[8px] text-[#868E96]">0 = normal</span>
              </div>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => set('sort_order', Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>

          {/* Optional Re-post as New Listing */}
          {initial?.id && (
            <div className="p-3 rounded-xl border border-[#E9ECEF] dark:border-[#2A2A2A] bg-[#F8F9FA] dark:bg-[#1A1A1A] flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#121417] dark:text-white">
                    Re-post as Brand New Listing
                  </span>
                  {currentSno && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                      Current #{currentSno}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#868E96] block">
                  Leave unchecked to keep #{currentSno} for daily audits. Check only if renewing a closed drive for a fresh cycle.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={relistAsNew}
                  onChange={(e) => setRelistAsNew(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FD4A32]" />
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#495057] dark:text-[#AAAAAA] hover:bg-[#F8F9FA] dark:hover:bg-[#1A1A1A] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {initial ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

type AdminJobTab = 'LIVE' | 'LEADS' | 'EXPIRED' | 'DRAFT' | 'REPORTS' | 'ALL';
type SortBy = 'NEWEST' | 'OLDEST' | 'PRIORITY' | 'DEADLINE';
type LeadCategoryFilter =
  | 'ALL'
  | 'PRODUCT_GIANTS'
  | 'UNICORNS'
  | 'IT_SERVICES'
  | 'FINTECH'
  | 'INTERNSHIPS'
  | 'JOBS';

export default function AdminJobsPage() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { toast, confirmModal } = useToast();

  const isEffectiveAdmin = Boolean(isAdmin || isSuperAdminEmail(user?.email));

  // All hooks MUST be called unconditionally (Rules of Hooks)
  const [activeTab, setActiveTab] = useState<AdminJobTab>('LIVE');
  const [modalJob, setModalJob] = useState<JobListing | null | 'new'>(null);
  const [saving, setSaving] = useState(false);
  const [purging, setPurging] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('OLDEST');
  const [auditingId, setAuditingId] = useState<string | null>(null);
  const [reportStatusFilter, setReportStatusFilter] = useState<JobReportStatus | 'ALL'>('OPEN');

  // Leads tab states
  const [leadCategory, setLeadCategory] = useState<LeadCategoryFilter>('ALL');
  const [hideListed, setHideListed] = useState<boolean>(false);
  const [visibleLeadsCount, setVisibleLeadsCount] = useState<number>(50);
  const [addingLeadId, setAddingLeadId] = useState<string | null>(null);
  const [customLeads, setCustomLeads] = useState<ScrapedJobLead[] | null>(() => {
    try {
      const cached = localStorage.getItem('prepunite_admin_job_leads');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['admin_job_listings'],
    queryFn: () => jobsService.getAllListings(),
    enabled: isEffectiveAdmin,
    staleTime: 0,
  });

  const { data: reports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ['admin_job_reports'],
    queryFn: () => jobsService.getJobReports('ALL'),
    enabled: isEffectiveAdmin,
    staleTime: 10000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin_job_listings'] });
    queryClient.invalidateQueries({ queryKey: ['job_listings'] });
  }, [queryClient]);

  const invalidateReports = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin_job_reports'] });
  }, [queryClient]);

  // Single-pass O(N) partitioning into disjoint sets (Live, Expired, Draft)
  const { liveListings, expiredListings, draftListings } = useMemo(() => {
    const nowMs = Date.now();
    const live: JobListing[] = [];
    const expired: JobListing[] = [];
    const draft: JobListing[] = [];

    for (let i = 0; i < listings.length; i++) {
      const job = listings[i];
      const isPastDeadline = Boolean(job.deadline && new Date(job.deadline).getTime() < nowMs);

      if (isPastDeadline) {
        expired.push(job);
      } else if (!job.is_active) {
        draft.push(job);
      } else {
        live.push(job);
      }
    }

    return { liveListings: live, expiredListings: expired, draftListings: draft };
  }, [listings]);

  // Reports partitioning
  const openReports = useMemo(() => reports.filter((r) => r.status === 'OPEN'), [reports]);
  const resolvedReports = useMemo(() => reports.filter((r) => r.status === 'RESOLVED'), [reports]);
  const dismissedReports = useMemo(() => reports.filter((r) => r.status === 'DISMISSED'), [reports]);
  const openReportsCount = openReports.length;

  const reportsByJobId = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of openReports) {
      map.set(r.job_id, (map.get(r.job_id) || 0) + 1);
    }
    return map;
  }, [openReports]);

  const listingsById = useMemo(() => {
    const map = new Map<string, JobListing>();
    for (let i = 0; i < listings.length; i++) {
      map.set(listings[i].id, listings[i]);
    }
    return map;
  }, [listings]);

  // Filtered reports for the REPORTS tab
  const filteredReports = useMemo(() => {
    let list = reports;
    if (reportStatusFilter !== 'ALL') {
      list = list.filter((r) => r.status === reportStatusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.job_title.toLowerCase().includes(q) ||
          r.company_name.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reports, reportStatusFilter, search]);

  // Leads pipeline and state logic
  const activeLeadsPool = useMemo<ScrapedJobLead[]>(() => {
    return customLeads && customLeads.length > 0 ? customLeads : curatedJobLeads;
  }, [customLeads]);

  const listedUrlSet = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < listings.length; i++) {
      const l = listings[i];
      if (l.apply_url) set.add(l.apply_url.toLowerCase().trim());
      if (l.company_name && l.title) {
        set.add(`${l.company_name.toLowerCase().trim()}|${l.title.toLowerCase().trim()}`);
      }
    }
    return set;
  }, [listings]);

  const isLeadListed = useCallback(
    (lead: ScrapedJobLead) => {
      const urlKey = (lead.apply_url || '').toLowerCase().trim();
      const nameKey = `${(lead.company_name || '').toLowerCase().trim()}|${(lead.title || '').toLowerCase().trim()}`;
      return listedUrlSet.has(urlKey) || listedUrlSet.has(nameKey);
    },
    [listedUrlSet]
  );

  const { productGiantsCount, unicornsCount, itServicesCount, finTechCount, internshipsCount, unlistedLeadsCount } = useMemo(() => {
    let giants = 0;
    let unicorns = 0;
    let it = 0;
    let fintech = 0;
    let interns = 0;
    let unlisted = 0;

    for (let i = 0; i < activeLeadsPool.length; i++) {
      const l = activeLeadsPool[i];
      const comp = l.company_name.toLowerCase();
      if (/google|microsoft|amazon|adobe|salesforce|atlassian|qualcomm|nvidia|intel|amd|uber|servicenow|oracle|cisco|apple|broadcom|intuit|autodesk|sap/i.test(comp)) {
        giants++;
      } else if (/razorpay|cred|groww|meesho|zepto|swiggy|inmobi|postman|hasura|harness|dream11|phonepe|ola|oyo|delhivery|urban company|nykaa|zerodha|pine labs|upstox|sharechat|bharatpe|blinkit|dailyhunt|pocket fm|devrev|glean|sarvam|krutrim|yellow|gupshup|druva|browserstack|freshworks|zoho|lenskart|ather|juspay|cashfree|setu|slice|jupiter|fi money|niyo|policybazaar|acko|digit|khatabook|porter|zetwerk|moglix|udaan|licious|blackbuck/i.test(comp)) {
        unicorns++;
      } else if (/tcs|infosys|wipro|accenture|cognizant|capgemini|hcltech|tech mahindra|ltimindtree|hexaware|persistent|mphasis|kpit|tata elxsi|globallogic|ltts|happiest minds|coforge|birlasoft|cgi|dxc|thoughtworks|nagarro|epam|zensar|cyient|sonata/i.test(comp) || l.source.includes('IT Services')) {
        it++;
      } else if (/morgan stanley|goldman sachs|jpmorgan|citibank|hsbc|barclays|deutsche bank|standard chartered|ubs|nomura|fidelity|d\.e\. shaw|tower research|optiver|citadel|wells fargo|american express|visa|mastercard|capital one|bajaj finserv|hdfc|icici|kotak|societe generale/i.test(comp) || l.source.includes('FinTech')) {
        fintech++;
      }
      if (l.type === 'INTERNSHIP') interns++;
      if (!isLeadListed(l)) unlisted++;
    }

    return {
      productGiantsCount: giants,
      unicornsCount: unicorns,
      itServicesCount: it,
      finTechCount: fintech,
      internshipsCount: interns,
      unlistedLeadsCount: unlisted,
    };
  }, [activeLeadsPool, isLeadListed]);

  const filteredLeads = useMemo(() => {
    let list = activeLeadsPool;

    if (hideListed) {
      list = list.filter((l) => !isLeadListed(l));
    }

    if (leadCategory === 'PRODUCT_GIANTS') {
      list = list.filter((l) =>
        l.source.includes('Product Giant') ||
        l.tags.includes('Product Giant') ||
        /google|microsoft|amazon|adobe|salesforce|atlassian|qualcomm|nvidia|intel|amd|uber|servicenow|oracle|cisco|apple|broadcom|intuit|autodesk|sap/i.test(l.company_name)
      );
    } else if (leadCategory === 'UNICORNS') {
      list = list.filter((l) =>
        l.source.includes('Unicorn') ||
        l.tags.includes('Unicorn') ||
        /razorpay|cred|groww|meesho|zepto|swiggy|inmobi|postman|hasura|harness|dream11|phonepe|ola|oyo|delhivery|urban company|nykaa|zerodha|pine labs|upstox|sharechat|bharatpe|blinkit|dailyhunt|pocket fm|devrev|glean|sarvam|krutrim|yellow|gupshup|druva|browserstack|freshworks|zoho|lenskart|ather|juspay|cashfree|setu|slice|jupiter|fi money|niyo|policybazaar|acko|digit|khatabook|porter|zetwerk|moglix|udaan|licious|blackbuck/i.test(l.company_name)
      );
    } else if (leadCategory === 'IT_SERVICES') {
      list = list.filter((l) =>
        l.source.includes('IT Services') ||
        l.tags.includes('IT Services') ||
        l.tags.includes('Mass Recruiter') ||
        /tcs|infosys|wipro|accenture|cognizant|capgemini|hcltech|tech mahindra|ltimindtree|hexaware|persistent|mphasis|kpit|tata elxsi|globallogic|ltts|happiest minds|coforge|birlasoft|cgi|dxc|thoughtworks|nagarro|epam|zensar|cyient|sonata/i.test(l.company_name)
      );
    } else if (leadCategory === 'FINTECH') {
      list = list.filter((l) =>
        l.source.includes('FinTech') ||
        l.tags.includes('FinTech') ||
        /morgan stanley|goldman sachs|jpmorgan|citibank|hsbc|barclays|deutsche bank|standard chartered|ubs|nomura|fidelity|d\.e\. shaw|tower research|optiver|citadel|wells fargo|american express|visa|mastercard|capital one|bajaj finserv|hdfc|icici|kotak|societe generale/i.test(l.company_name)
      );
    } else if (leadCategory === 'INTERNSHIPS') {
      list = list.filter((l) => l.type === 'INTERNSHIP');
    } else if (leadCategory === 'JOBS') {
      list = list.filter((l) => l.type === 'JOB');
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.company_name.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          (l.stipend_or_salary && l.stipend_or_salary.toLowerCase().includes(q)) ||
          l.tags.some((t) => t.toLowerCase().includes(q)) ||
          l.source.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeLeadsPool, hideListed, leadCategory, search, isLeadListed]);

  // Select target tab pool
  const currentTabPool = useMemo(() => {
    switch (activeTab) {
      case 'LIVE': return liveListings;
      case 'EXPIRED': return expiredListings;
      case 'DRAFT': return draftListings;
      case 'LEADS': return [];
      case 'ALL': default: return listings;
    }
  }, [activeTab, liveListings, expiredListings, draftListings, listings]);

  // Stable S.No (Age Rank) Map:
  // Sort the current tab pool chronologically from oldest (created_at ASC) to newest.
  // #1 = Oldest active listing in the pool (highest priority for daily audit)
  // #N = Newest listing in the pool
  const ageRankMap = useMemo(() => {
    const sortedByAge = [...currentTabPool].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const map = new Map<string, number>();
    sortedByAge.forEach((job, idx) => {
      map.set(job.id, idx + 1);
    });
    return map;
  }, [currentTabPool]);

  // Filter and sort within current pool
  const filtered = useMemo(() => {
    let list = currentTabPool;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (j) => j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'OLDEST') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'DEADLINE') {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'PRIORITY') {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // Default: NEWEST
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [currentTabPool, search, sortBy]);

  // Guard: If not an admin, render NotFoundPage so unauthorized users cannot even inspect the UI
  if (!isEffectiveAdmin) {
    return <NotFoundPage />;
  }

  const handleSave = async (
    data: Omit<JobListing, 'id' | 'created_at' | 'updated_at'>,
    id?: string,
    relistAsNew?: boolean
  ) => {
    setSaving(true);
    try {
      if (id && id.trim()) {
        const updatePayload: any = { ...data };
        if (relistAsNew) {
          updatePayload.created_at = new Date().toISOString();
        }
        await jobsService.updateListing(id, updatePayload);
        toast.success(relistAsNew ? 'Listing re-posted as brand new!' : 'Listing updated successfully.');
      } else {
        await jobsService.createListing(data);
        toast.success('New listing created.');
      }
      invalidate();
      setModalJob(null);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickAddLead = async (lead: ScrapedJobLead) => {
    setAddingLeadId(lead.id);
    try {
      await jobsService.createListing({
        title: lead.title,
        company_name: lead.company_name,
        company_logo_url: lead.company_logo_url || null,
        type: lead.type,
        location: lead.location || 'Remote',
        experience_min: 0,
        experience_max: 1,
        stipend_or_salary: lead.stipend_or_salary || null,
        description: `Verified campus & early career opening at ${lead.company_name}.\nEligibility: ${lead.batch_eligibility || '2025/2026 Batch'}.\nSource: ${lead.source}.\nApply directly through official company ATS portal.`,
        apply_url: lead.apply_url,
        deadline: null,
        tags: lead.tags || [],
        is_active: true,
        is_featured: false,
        sort_order: 0,
      });
      toast.success(`Published ${lead.company_name} to live listings!`);
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add lead.');
    } finally {
      setAddingLeadId(null);
    }
  };

  const handleReviewLead = (lead: ScrapedJobLead) => {
    setModalJob({
      id: '',
      title: lead.title,
      company_name: lead.company_name,
      company_logo_url: lead.company_logo_url || '',
      type: lead.type,
      location: lead.location || 'Remote',
      experience_min: 0,
      experience_max: 1,
      stipend_or_salary: lead.stipend_or_salary || '',
      description: `Verified campus & early career opening at ${lead.company_name}.\nEligibility: ${lead.batch_eligibility || '2025/2026 Batch'}.\nSource: ${lead.source}.\nApply directly through official company ATS portal.`,
      apply_url: lead.apply_url,
      deadline: null,
      tags: lead.tags || [],
      is_active: true,
      is_featured: false,
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validated: ScrapedJobLead[] = parsed.map((item, idx) => ({
            id: item.id || `custom_${idx}_${(item.company_name || '').replace(/\W+/g, '')}`,
            company_name: item.company_name || 'Unknown',
            company_logo_url: item.company_logo_url || null,
            title: item.title || 'Software Engineer',
            type: item.type === 'INTERNSHIP' ? 'INTERNSHIP' : 'JOB',
            location: item.location || 'Remote',
            stipend_or_salary: item.stipend_or_salary || null,
            apply_url: item.apply_url || '',
            source: item.source || 'Imported Feed',
            age: item.age || 'Recent',
            batch_eligibility: item.batch_eligibility || '2025, 2026',
            tags: Array.isArray(item.tags) ? item.tags : [],
          }));
          setCustomLeads(validated);
          localStorage.setItem('prepunite_admin_job_leads', JSON.stringify(validated));
          toast.success(`Loaded ${validated.length} leads from JSON!`);
        } else {
          toast.error('Invalid JSON structure: array of job objects expected.');
        }
      } catch (err: any) {
        toast.error(`JSON parse failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetLeads = () => {
    setCustomLeads(null);
    localStorage.removeItem('prepunite_admin_job_leads');
    toast.success('Reset leads pool to default curated harvester dataset.');
  };

  const handleMarkAudited = async (job: JobListing) => {
    setAuditingId(job.id);
    try {
      await jobsService.markAudited(job.id);
      const sno = ageRankMap.get(job.id);
      toast.success(`Listing #${sno ?? ''} (${job.company_name}) marked audited active.`);
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || 'Could not update audit status.');
    } finally {
      setAuditingId(null);
    }
  };

  const handleDelete = async (job: JobListing) => {
    const confirmed = await confirmModal({
      title: 'Terminate Job Listing',
      message: `Are you sure you want to terminate and delete "${job.title}" at ${job.company_name}? This will remove it from all student views immediately.`,
      confirmText: 'Terminate Listing',
      cancelText: 'Cancel',
      isDanger: true,
    });
    if (!confirmed) return;
    try {
      await jobsService.deleteListing(job.id);
      toast.success('Listing terminated successfully.');
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || 'Delete failed.');
    }
  };

  const handleToggleActive = async (job: JobListing) => {
    try {
      const nextActive = !job.is_active;
      await jobsService.toggleActive(job.id, nextActive);
      // If deactivating a role that has open reports, auto-resolve all open reports!
      if (!nextActive && reportsByJobId.has(job.id)) {
        const closedCount = await jobsService.resolveAllReportsForJob(
          job.id,
          'Listing deactivated by admin from listings table'
        );
        toast.info(`Listing deactivated and ${closedCount} open report(s) marked resolved.`);
        invalidateReports();
      } else {
        toast.success(nextActive ? 'Listing activated.' : 'Listing deactivated.');
      }
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || 'Toggle failed.');
    }
  };

  const handleToggleFeatured = async (job: JobListing) => {
    try {
      await jobsService.toggleFeatured(job.id, !job.is_featured);
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || 'Toggle failed.');
    }
  };

  const handlePurgeExpired = async () => {
    if (expiredListings.length === 0) return;
    const confirmed = await confirmModal({
      title: 'Purge All Expired Listings',
      message: `Permanently remove all ${expiredListings.length} expired listing(s) from the database? This action cannot be undone.`,
      confirmText: `Purge ${expiredListings.length} Listing(s)`,
      cancelText: 'Cancel',
      isDanger: true,
    });
    if (!confirmed) return;

    setPurging(true);
    try {
      const count = await jobsService.purgeExpiredListings();
      toast.success(`Successfully purged ${count} expired listing(s).`);
      invalidate();
      invalidateReports();
    } catch (err: any) {
      toast.error(err?.message || 'Purge failed.');
    } finally {
      setPurging(false);
    }
  };

  const handleResolveReport = async (report: JobReport) => {
    try {
      const count = await jobsService.resolveAllReportsForJob(
        report.job_id,
        'Resolved by admin'
      );
      toast.success(
        count > 1
          ? `All ${count} open reports for "${report.job_title}" marked as resolved.`
          : 'Report marked as resolved.'
      );
      invalidateReports();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update report.');
    }
  };

  const handleDismissReport = async (report: JobReport) => {
    try {
      const count = await jobsService.dismissAllReportsForJob(
        report.job_id,
        'Dismissed by admin (false alarm)'
      );
      toast.info(
        count > 1
          ? `Dismissed all ${count} reports for "${report.job_title}".`
          : 'Report dismissed.'
      );
      invalidateReports();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to dismiss report.');
    }
  };

  const handleDeactivateFromReport = async (report: JobReport) => {
    try {
      await jobsService.toggleActive(report.job_id, false);
      const closedCount = await jobsService.resolveAllReportsForJob(
        report.job_id,
        'Deactivated by admin from candidate reports'
      );
      toast.success(
        `Listing "${report.job_title}" deactivated. All ${closedCount || 1} open report(s) marked resolved.`
      );
      invalidate();
      invalidateReports();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to deactivate listing.');
    }
  };

  const handleDeleteReport = async (report: JobReport) => {
    const confirmed = await confirmModal({
      title: 'Delete Report',
      message: 'Permanently remove this report record?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDanger: true,
    });
    if (!confirmed) return;

    try {
      await jobsService.deleteJobReport(report.id);
      toast.success('Report deleted.');
      invalidateReports();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete report.');
    }
  };

  return (
    <>
      {/* Modal */}
      {modalJob !== null && (
        <JobFormModal
          initial={modalJob === 'new' ? null : modalJob}
          currentSno={modalJob && modalJob !== 'new' ? ageRankMap.get(modalJob.id) : undefined}
          onClose={() => setModalJob(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0C0C0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-extrabold text-[#121417] dark:text-white">Jobs Board Admin</h1>
                <p className="text-xs text-[#868E96]">
                  {liveListings.length} live · {activeLeadsPool.length} India leads · {expiredListings.length} expired · {draftListings.length} drafts
                  {openReportsCount > 0 && (
                    <span className="text-rose-500 font-bold ml-1">
                      · {openReportsCount} open report{openReportsCount > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalJob('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Listing
            </button>
          </div>

          {/* Navigation Tabs + Search + Purge Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#E9ECEF]/60 dark:bg-[#1A1A1A] rounded-xl border border-[#E9ECEF] dark:border-[#2A2A2A] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('LIVE')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'LIVE'
                    ? 'bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-white shadow-xs'
                    : 'text-[#868E96] hover:text-[#121417] dark:hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                Live ({liveListings.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('LEADS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'LEADS'
                    ? 'bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-white shadow-xs'
                    : 'text-[#868E96] hover:text-[#121417] dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>🇮🇳 India Leads ({activeLeadsPool.length})</span>
                {unlistedLeadsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    {unlistedLeadsCount} New
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('EXPIRED')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'EXPIRED'
                    ? 'bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-white shadow-xs'
                    : 'text-[#868E96] hover:text-[#121417] dark:hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                Expired ({expiredListings.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('DRAFT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'DRAFT'
                    ? 'bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-white shadow-xs'
                    : 'text-[#868E96] hover:text-[#121417] dark:hover:text-white'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Drafts ({draftListings.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-white shadow-xs'
                    : 'text-[#868E96] hover:text-[#121417] dark:hover:text-white'
                }`}
              >
                All ({listings.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('REPORTS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'REPORTS'
                    ? 'bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-white shadow-xs'
                    : 'text-[#868E96] hover:text-[#121417] dark:hover:text-white'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 shrink-0 ${openReportsCount > 0 ? 'text-rose-500' : 'text-[#868E96]'}`} />
                <span>Reports</span>
                {openReportsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                    {openReportsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Actions: Search + Sort + Purge / Import */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-60 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96]" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'REPORTS'
                      ? 'Search reports...'
                      : activeTab === 'LEADS'
                      ? 'Search leads by company, title, skill...'
                      : 'Filter listings...'
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg text-[#121417] dark:text-white placeholder:text-[#868E96] focus:outline-none focus:border-[#121417] dark:focus:border-[#555] transition-colors"
                />
              </div>

              {/* Import JSON button when on LEADS tab */}
              {activeTab === 'LEADS' && (
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="leads-json-upload"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] text-[#495057] dark:text-[#AAAAAA] hover:text-[#121417] dark:hover:text-white hover:border-[#121417] dark:hover:border-white transition-all cursor-pointer shadow-xs whitespace-nowrap"
                    title="Upload newly scraped job_leads_raw.json to refresh the pool"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Import JSON</span>
                    <input
                      id="leads-json-upload"
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportJson}
                    />
                  </label>

                  {customLeads && (
                    <button
                      type="button"
                      onClick={handleResetLeads}
                      className="px-2 py-1.5 text-[11px] font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer whitespace-nowrap"
                    >
                      Reset
                    </button>
                  )}
                </div>
              )}

              {/* Sort Selector (only for listings) */}
              {activeTab !== 'REPORTS' && activeTab !== 'LEADS' && (
                <div className="flex items-center gap-1.5">
                  <label htmlFor="admin-jobs-sort" className="text-[11px] font-semibold text-[#868E96] whitespace-nowrap hidden md:inline">
                    Sort:
                  </label>
                  <div className="relative">
                    <select
                      id="admin-jobs-sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg text-[#121417] dark:text-white focus:outline-none focus:border-[#121417] dark:focus:border-[#555] cursor-pointer"
                    >
                      <option value="OLDEST">Oldest First (Daily Audit #1 → #N)</option>
                      <option value="NEWEST">Newest First (#N → #1)</option>
                      <option value="DEADLINE">By Deadline</option>
                      <option value="PRIORITY">Featured / Priority</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96]" />
                  </div>
                </div>
              )}

              {activeTab === 'EXPIRED' && expiredListings.length > 0 && (
                <button
                  type="button"
                  onClick={handlePurgeExpired}
                  disabled={purging}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white transition-all shadow-xs cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {purging ? 'Purging...' : `Purge Expired (${expiredListings.length})`}
                </button>
              )}
            </div>
          </div>

          {/* Leads Intelligence & Ingestion Panel */}
          {activeTab === 'LEADS' ? (
            <div className="space-y-4">
              {/* Category Filter Chips Bar */}
              <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl p-3 sm:p-4 shadow-xs">
                <div className="mb-3 pb-3 border-b border-[#E9ECEF] dark:border-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#121417] dark:text-white flex items-center gap-2">
                      <span>🇮🇳 India Tech Campus & Fresher Drives</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Class of 2024 / 2025 / 2026 / 2027
                      </span>
                    </h3>
                    <p className="text-xs text-[#868E96] mt-0.5">
                      Verified direct portals across Tier-1 Product Giants, Unicorns, and IT Mass Recruiters with authentic LPA salary benchmarks.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#495057] dark:text-[#AAAAAA] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hideListed}
                        onChange={(e) => setHideListed(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#E9ECEF] dark:border-[#2A2A2A] text-[#FD4A32] focus:ring-0 cursor-pointer"
                      />
                      <span>Unlisted Only ({unlistedLeadsCount})</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setLeadCategory('ALL'); setVisibleLeadsCount(50); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadCategory === 'ALL'
                        ? 'bg-[#121417] dark:bg-white text-white dark:text-[#121417]'
                        : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#868E96] hover:text-[#121417] dark:hover:text-white border border-[#E9ECEF] dark:border-[#2A2A2A]'
                    }`}
                  >
                    All India Drives ({activeLeadsPool.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLeadCategory('PRODUCT_GIANTS'); setVisibleLeadsCount(50); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadCategory === 'PRODUCT_GIANTS'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#868E96] hover:text-[#121417] dark:hover:text-white border border-[#E9ECEF] dark:border-[#2A2A2A]'
                    }`}
                  >
                    <span>🔥 Tier-1 Product (18–35+ LPA)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 font-extrabold">
                      {productGiantsCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLeadCategory('UNICORNS'); setVisibleLeadsCount(50); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadCategory === 'UNICORNS'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#868E96] hover:text-[#121417] dark:hover:text-white border border-[#E9ECEF] dark:border-[#2A2A2A]'
                    }`}
                  >
                    <span>🦄 Unicorns & Startups (10–25 LPA)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 font-extrabold">
                      {unicornsCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLeadCategory('IT_SERVICES'); setVisibleLeadsCount(50); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadCategory === 'IT_SERVICES'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#868E96] hover:text-[#121417] dark:hover:text-white border border-[#E9ECEF] dark:border-[#2A2A2A]'
                    }`}
                  >
                    <span>🏢 IT Services Mass Hiring (3.5–9 LPA)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 font-extrabold">
                      {itServicesCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLeadCategory('FINTECH'); setVisibleLeadsCount(50); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadCategory === 'FINTECH'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#868E96] hover:text-[#121417] dark:hover:text-white border border-[#E9ECEF] dark:border-[#2A2A2A]'
                    }`}
                  >
                    <span>🏦 FinTech & Quant (14–50 LPA)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 font-extrabold">
                      {finTechCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLeadCategory('INTERNSHIPS'); setVisibleLeadsCount(50); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadCategory === 'INTERNSHIPS'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#868E96] hover:text-[#121417] dark:hover:text-white border border-[#E9ECEF] dark:border-[#2A2A2A]'
                    }`}
                  >
                    <span>🎓 Campus Internships</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 font-extrabold">
                      {internshipsCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLeadCategory('JOBS'); setVisibleLeadsCount(50); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadCategory === 'JOBS'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#868E96] hover:text-[#121417] dark:hover:text-white border border-[#E9ECEF] dark:border-[#2A2A2A]'
                    }`}
                  >
                    Full-Time Only
                  </button>
                </div>
              </div>

              {/* Leads Table Card */}
              <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl overflow-hidden shadow-xs">
                {filteredLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <AlertCircle className="w-10 h-10 text-[#868E96] mb-3" />
                    <h3 className="text-sm font-bold text-[#121417] dark:text-white mb-1">No Leads Matching Filters</h3>
                    <p className="text-xs text-[#868E96] max-w-sm mb-4">
                      Try clearing your search query, switching categories, or unticking "Unlisted Only".
                    </p>
                    <button
                      type="button"
                      onClick={() => { setLeadCategory('ALL'); setHideListed(false); setSearch(''); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA]/70 dark:bg-[#0C0C0C]/60 text-[10px] font-bold uppercase tracking-wider text-[#868E96]">
                          <th className="py-3 px-4 w-12">#</th>
                          <th className="py-3 px-4">Company & Source</th>
                          <th className="py-3 px-4">Role Title & Type</th>
                          <th className="py-3 px-4">Location & Salary</th>
                          <th className="py-3 px-4">Freshness</th>
                          <th className="py-3 px-4 text-center">Verify Link</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E9ECEF] dark:divide-[#242424]">
                        {filteredLeads.slice(0, visibleLeadsCount).map((lead, idx) => {
                          const isListed = isLeadListed(lead);
                          const isUltraFresh = parseAgeDays(lead.age) <= 3;
                          return (
                            <tr
                              key={lead.id}
                              className={`hover:bg-[#F8F9FA] dark:hover:bg-[#1A1A1A]/60 transition-colors ${
                                isListed ? 'opacity-70 bg-zinc-50/50 dark:bg-zinc-950/20' : ''
                              }`}
                            >
                              <td className="py-3 px-4 text-[11px] text-[#868E96] font-mono">
                                {idx + 1}
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-[#E9ECEF] dark:border-[#2A2A2A] flex items-center justify-center font-bold text-xs text-[#121417] dark:text-white shrink-0">
                                    {lead.company_logo_url ? (
                                      <img src={lead.company_logo_url} alt="" className="w-5 h-5 object-contain" />
                                    ) : (
                                      lead.company_name.slice(0, 1).toUpperCase()
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#121417] dark:text-white flex items-center gap-1.5">
                                      <span>{lead.company_name}</span>
                                      {isListed && (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                          <Check className="w-2.5 h-2.5" /> Listed
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-[#868E96]">
                                      {lead.source}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-semibold text-[#121417] dark:text-white max-w-[320px] truncate" title={lead.title}>
                                    {lead.title}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                                      lead.type === 'JOB'
                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                    }`}>
                                      {lead.type}
                                    </span>
                                    {lead.tags.slice(0, 2).map((t) => (
                                      <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#F8F9FA] dark:bg-[#202020] text-[#495057] dark:text-[#AAAAAA] border border-[#E9ECEF] dark:border-[#2A2A2A]">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div>
                                  <div className="flex items-center gap-1 text-[11px] text-[#495057] dark:text-[#AAAAAA] max-w-[200px] truncate" title={lead.location}>
                                    <MapPin className="w-3 h-3 text-[#868E96] shrink-0" />
                                    <span>{lead.location}</span>
                                  </div>
                                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                    {lead.stipend_or_salary || 'Competitive / Undisclosed'}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isUltraFresh
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-[#868E96]'
                                }`}>
                                  {isUltraFresh && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                  {lead.age}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-center">
                                <a
                                  href={lead.apply_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] text-blue-600 dark:text-blue-400 hover:border-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer whitespace-nowrap"
                                  title="Open official ATS / university portal in new tab"
                                >
                                  <span>Verify Portal</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {isListed ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSearch(lead.company_name);
                                        setActiveTab('LIVE');
                                      }}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer whitespace-nowrap"
                                    >
                                      View Live
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleReviewLead(lead)}
                                        title="Pre-fill and review in editor modal"
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F8F9FA] dark:bg-[#1F1F1F] text-[#495057] dark:text-[#CCCCCC] border border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-[#121417] dark:hover:border-white transition-all cursor-pointer whitespace-nowrap"
                                      >
                                        Review & Edit
                                      </button>
                                      <button
                                        type="button"
                                        disabled={addingLeadId === lead.id}
                                        onClick={() => handleQuickAddLead(lead)}
                                        title="1-Click publish directly into live job listings"
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all shadow-xs cursor-pointer whitespace-nowrap disabled:opacity-50"
                                      >
                                        {addingLeadId === lead.id ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Plus className="w-3 h-3" />
                                        )}
                                        <span>Quick Add</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Footer */}
                {filteredLeads.length > visibleLeadsCount && (
                  <div className="p-4 border-t border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA]/40 dark:bg-[#0C0C0C]/40 flex items-center justify-between">
                    <span className="text-xs text-[#868E96]">
                      Showing <span className="font-bold text-[#121417] dark:text-white">{Math.min(visibleLeadsCount, filteredLeads.length)}</span> of{' '}
                      <span className="font-bold text-[#121417] dark:text-white">{filteredLeads.length}</span> matching leads
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setVisibleLeadsCount((prev) => prev + 50)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#121417] dark:text-white hover:border-[#121417] dark:hover:border-white transition-all cursor-pointer"
                      >
                        Load 50 More
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisibleLeadsCount(filteredLeads.length)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-all cursor-pointer"
                      >
                        Show All ({filteredLeads.length})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'REPORTS' ? (
            <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl overflow-hidden">
              {/* Reports status sub-bar */}
              <div className="px-4 py-3 border-b border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA]/60 dark:bg-[#0C0C0C]/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['OPEN', 'RESOLVED', 'DISMISSED', 'ALL'] as const).map((st) => {
                    const count =
                      st === 'OPEN'
                        ? openReports.length
                        : st === 'RESOLVED'
                        ? resolvedReports.length
                        : st === 'DISMISSED'
                        ? dismissedReports.length
                        : reports.length;
                    const isActive = reportStatusFilter === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setReportStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#121417] dark:bg-white text-white dark:text-[#121417] shadow-xs'
                            : 'bg-white dark:bg-[#1A1A1A] text-[#868E96] hover:text-[#121417] dark:hover:text-white border border-[#E9ECEF] dark:border-[#2A2A2A]'
                        }`}
                      >
                        {st === 'OPEN' ? 'Open' : st === 'RESOLVED' ? 'Resolved' : st === 'DISMISSED' ? 'Dismissed' : 'All Reports'} ({count})
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs text-[#868E96]">
                  Showing {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'}
                </div>
              </div>

              {isLoadingReports ? (
                <div className="flex items-center justify-center py-16 text-[#868E96]">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-xs">Loading candidate reports...</span>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
                  <p className="text-sm font-semibold text-[#121417] dark:text-white">
                    {search ? 'No reports matching search query' : 'No reports in this category!'}
                  </p>
                  <p className="text-xs text-[#868E96] mt-1 max-w-sm">
                    {search ? 'Clear your search query to see other reports.' : 'Candidate feedback and broken application links will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C]">
                        <th className="w-14 px-3 py-3 text-center font-bold text-[#868E96] uppercase tracking-wider">S.No</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Target Listing</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Report Reason</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Details</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Reported</th>
                        <th className="px-4 py-3 text-right font-bold text-[#868E96] uppercase tracking-wider">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9ECEF] dark:divide-[#242424]">
                      {filteredReports.map((report, index) => {
                        const targetJob = listingsById.get(report.job_id);
                        const openCount = reportsByJobId.get(report.job_id) || 1;
                        return (
                        <tr
                          key={report.id}
                          className={`transition-colors hover:bg-[#F8F9FA] dark:hover:bg-[#1A1A1A] ${
                            report.status === 'OPEN' ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''
                          }`}
                        >
                          {/* S.No */}
                          <td className="w-14 px-3 py-3 text-center whitespace-nowrap">
                            <span className="inline-flex items-center justify-center min-w-[26px] h-6 px-1.5 rounded-md text-[11px] font-mono font-bold bg-[#F1F3F5] dark:bg-[#1E1E1E] text-[#495057] dark:text-[#AAAAAA] border border-[#E9ECEF] dark:border-[#2A2A2A]">
                              {index + 1}
                            </span>
                          </td>

                          {/* Status badge */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                report.status === 'OPEN'
                                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
                                  : report.status === 'RESOLVED'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                              }`}
                            >
                              {report.status === 'OPEN' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping mr-0.5" />}
                              {report.status}
                            </span>
                          </td>

                          {/* Target listing - Click to identify & inspect */}
                          <td className="px-4 py-3">
                            {targetJob ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => setModalJob(targetJob)}
                                    className="font-bold text-xs text-[#121417] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-left max-w-[260px] truncate cursor-pointer transition-colors"
                                    title="Click to view and edit full listing details"
                                  >
                                    {targetJob.title}
                                  </button>
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                                      targetJob.is_active
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                                    }`}
                                  >
                                    {targetJob.is_active ? 'Live' : 'Deactivated'}
                                  </span>
                                  {openCount > 1 && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-500 text-white animate-pulse">
                                      {openCount} open reports
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 text-[#868E96] text-[11px] flex-wrap">
                                  <span className="font-medium text-[#495057] dark:text-[#AAAAAA]">{targetJob.company_name}</span>
                                  <span>•</span>
                                  <span>{targetJob.location}</span>
                                </div>

                                <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => setModalJob(targetJob)}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                    title="Open modal to inspect and edit this job"
                                  >
                                    <Edit3 className="w-2.5 h-2.5" />
                                    <span>Inspect Listing</span>
                                  </button>

                                  {targetJob.apply_url && (
                                    <>
                                      <span className="text-[#868E96] text-[10px]">•</span>
                                      <a
                                        href={targetJob.apply_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400 hover:text-blue-500 hover:underline"
                                        title="Open the external apply URL in a new tab"
                                      >
                                        <span>Verify Apply Link</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </>
                                  )}

                                  <span className="text-[#868E96] text-[10px]">•</span>
                                  <a
                                    href={`/jobs?jobId=${targetJob.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-zinc-500 hover:text-[#121417] dark:hover:text-white"
                                    title="Open on the public Jobs Board"
                                  >
                                    <span>View on Board</span>
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="font-semibold text-[#121417] dark:text-white max-w-[240px] truncate">
                                  {report.job_title}
                                </div>
                                <div className="text-[#868E96] text-[11px]">{report.company_name}</div>
                                <span className="inline-block mt-0.5 text-[10px] text-amber-600 dark:text-amber-400 italic">
                                  (Listing was removed or deleted)
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Reason */}
                          <td className="px-4 py-3">
                            <span className="font-semibold text-[#121417] dark:text-white">
                              {report.reason}
                            </span>
                          </td>

                          {/* Details / Admin Notes */}
                          <td className="px-4 py-3 max-w-[200px]">
                            {report.details ? (
                              <p className="text-[11px] text-[#495057] dark:text-[#AAAAAA] line-clamp-2">
                                {report.details}
                              </p>
                            ) : (
                              <span className="text-[#868E96] text-[11px] italic">No extra notes</span>
                            )}
                            {report.admin_notes && (
                              <div className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                Note: {report.admin_notes}
                              </div>
                            )}
                          </td>

                          {/* Reported date */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-[11px] font-medium text-[#121417] dark:text-white">
                              {formatDate(report.created_at)}
                            </div>
                            {getRelativeTime(report.created_at) && (
                              <div className="text-[10px] text-[#868E96]">
                                {getRelativeTime(report.created_at)}
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {targetJob && (
                                <button
                                  type="button"
                                  onClick={() => setModalJob(targetJob)}
                                  title="Inspect & Edit listing details"
                                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:border-[#121417] dark:hover:border-white transition-all cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              )}
                              {report.status === 'OPEN' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleDeactivateFromReport(report)}
                                    title={openCount > 1 ? `Deactivate listing and close all ${openCount} open reports` : 'Deactivate listing and mark resolved'}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-600 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    {openCount > 1 ? `Deactivate & Close All (${openCount})` : 'Deactivate Job'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleResolveReport(report)}
                                    title={openCount > 1 ? `Mark all ${openCount} reports for this listing resolved` : 'Mark resolved without taking down job'}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    {openCount > 1 ? `Resolve All (${openCount})` : 'Resolve'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDismissReport(report)}
                                    title={openCount > 1 ? `Dismiss all ${openCount} reports for this listing as invalid` : 'Dismiss as invalid / false report'}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    <X className="w-3 h-3" />
                                    {openCount > 1 ? `Dismiss All (${openCount})` : 'Dismiss'}
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteReport(report)}
                                title="Delete report log entry"
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A] text-rose-500/70 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Listings Table */
            <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 text-[#868E96]">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-xs">Loading listings...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertCircle className="w-10 h-10 text-[#868E96] mb-3" />
                  <p className="text-sm font-semibold text-[#121417] dark:text-white">
                    {search
                      ? 'No matching listings found'
                      : activeTab === 'LIVE'
                      ? 'No active live listings right now'
                      : activeTab === 'EXPIRED'
                      ? 'No expired listings! All drives are current.'
                      : activeTab === 'DRAFT'
                      ? 'No drafts currently saved.'
                      : 'No listings posted yet'}
                  </p>
                  <p className="text-xs text-[#868E96] mt-1 max-w-sm">
                    {search
                      ? 'Try clearing your search query.'
                      : activeTab === 'LIVE'
                      ? 'Click "Add New Listing" to publish a new role, or activate a draft.'
                      : activeTab === 'EXPIRED'
                      ? 'Expired opportunities will appear here once their deadline passes.'
                      : 'Click "Add New Listing" to create your first opportunity.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C]">
                        <th className="w-16 px-3 py-3 text-center font-bold text-[#868E96] uppercase tracking-wider">S.No</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Title / Company</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Location</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Posted / Audit</th>
                        <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Deadline</th>
                        <th className="px-4 py-3 text-center font-bold text-[#868E96] uppercase tracking-wider">Active</th>
                        <th className="px-4 py-3 text-center font-bold text-[#868E96] uppercase tracking-wider">Featured</th>
                        <th className="px-4 py-3 text-right font-bold text-[#868E96] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9ECEF] dark:divide-[#242424]">
                      {filtered.map((job, index) => {
                        const dl = getDeadlineMeta(job.deadline);
                        const expired = isExpiredRow(job.deadline);
                        const sno = ageRankMap.get(job.id) ?? (index + 1);
                        const isAuditedToday = Boolean(
                          job.updated_at &&
                          (Date.now() - new Date(job.updated_at).getTime()) < (1000 * 60 * 60 * 24)
                        );
                        return (
                          <tr
                            key={job.id}
                            className={`transition-colors hover:bg-[#F8F9FA] dark:hover:bg-[#1A1A1A] ${
                              expired ? 'bg-amber-50/40 dark:bg-amber-900/5' : ''
                            }`}
                          >
                            {/* S.No */}
                            <td className="w-16 px-3 py-3 text-center whitespace-nowrap">
                              <div className="flex flex-col items-center justify-center gap-0.5">
                                <span className={`inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md text-[11px] font-mono font-bold border transition-colors ${
                                  sno === 1
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-2xs ring-1 ring-amber-500/20'
                                    : sno === currentTabPool.length && currentTabPool.length > 1
                                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                    : 'bg-[#F1F3F5] dark:bg-[#1E1E1E] text-[#495057] dark:text-[#AAAAAA] border-[#E9ECEF] dark:border-[#2A2A2A]'
                                }`}>
                                  #{sno}
                                </span>
                                {sno === 1 && (
                                  <span className="text-[8px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                    Oldest
                                  </span>
                                )}
                                {sno === currentTabPool.length && currentTabPool.length > 1 && (
                                  <span className="text-[8px] font-black uppercase tracking-wider text-blue-500 dark:text-blue-400">
                                    Newest
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Type */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                job.type === 'JOB'
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                              }`}>
                                {job.type === 'JOB' ? 'Job' : 'Intern'}
                              </span>
                            </td>

                            {/* Title + company */}
                            <td className="px-4 py-3">
                              <div className="font-semibold text-[#121417] dark:text-white max-w-[200px] truncate">{job.title}</div>
                              <div className="text-[#868E96] text-[11px]">{job.company_name}</div>
                              {reportsByJobId.has(job.id) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('REPORTS');
                                    setReportStatusFilter('OPEN');
                                    setSearch(job.title);
                                  }}
                                  className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                                  title="Click to view reports for this listing"
                                >
                                  <Flag className="w-3 h-3 text-rose-500" />
                                  <span>{reportsByJobId.get(job.id)} report{reportsByJobId.get(job.id)! > 1 ? 's' : ''}</span>
                                </button>
                              )}
                            </td>

                            {/* Location */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-[#495057] dark:text-[#AAAAAA]">
                                <MapPin className="w-3 h-3 shrink-0 text-[#868E96]" />
                                {job.location}
                              </div>
                            </td>

                            {/* Posted date & relative time / Audit status */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-[11px] font-medium text-[#121417] dark:text-white">
                                {formatDate(job.created_at)}
                              </div>
                              <div className="mt-0.5">
                                {isAuditedToday ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> Checked today
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-[#868E96]">
                                    {getRelativeTime(job.created_at)}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Deadline */}
                            <td className={`px-4 py-3 whitespace-nowrap ${dl.cls}`}>
                              {dl.label}
                            </td>

                            {/* Active toggle */}
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleActive(job)}
                                title={job.is_active ? 'Deactivate' : 'Activate'}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
                                  job.is_active
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                                    : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] border-[#E9ECEF] dark:border-[#2A2A2A] text-[#868E96]'
                                }`}
                              >
                                {job.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                            </td>

                            {/* Featured toggle */}
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleFeatured(job)}
                                title={job.is_featured ? 'Unfeature' : 'Feature'}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
                                  job.is_featured
                                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400'
                                    : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] border-[#E9ECEF] dark:border-[#2A2A2A] text-[#868E96]'
                                }`}
                              >
                                {job.is_featured ? <Star className="w-3.5 h-3.5 fill-amber-400" /> : <StarOff className="w-3.5 h-3.5" />}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={job.apply_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open Apply URL in new tab"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#868E96] hover:text-blue-500 hover:border-blue-300 transition-all cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleMarkAudited(job)}
                                  disabled={auditingId === job.id}
                                  title={isAuditedToday ? `Audited today! Click to re-confirm` : `Mark #${sno} audited active (verified today)`}
                                  className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all cursor-pointer ${
                                    isAuditedToday
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                                      : 'border-[#E9ECEF] dark:border-[#2A2A2A] text-[#868E96] hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300'
                                  }`}
                                >
                                  {auditingId === job.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setModalJob(job)}
                                  title="Edit listing details"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:border-[#121417] dark:hover:border-white transition-all cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(job)}
                                  title="Terminate / Delete listing"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A] text-rose-500/70 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
