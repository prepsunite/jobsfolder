import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Star, StarOff,
  Briefcase, MapPin, Clock, X, Check, AlertCircle,
  ExternalLink, ChevronDown, Search, Loader2, Flag, CheckCircle2,
  Sparkles, Upload, Zap, Send, Layers, Copy, ShieldCheck,
  ChevronRight, Award, Flame, GraduationCap, Globe, InboxIcon, CreditCard, Building2,
  ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import { jobsService } from '@/services/jobs.service';
import type { JobListing, JobType, JobReport, JobReportStatus, ScrapedJobLead } from '@/types/jobs';
import { useToast } from '@/contexts/ToastContext';
import { curatedJobLeads } from '@/constants/curatedJobLeads';
import ContentRenderer from '@/components/ContentRenderer';
import { prepareJobDescriptionMarkdown, generateStructuredJobDescription } from '@/utils/jobDescription';
import CompanyLogo from '@/components/CompanyLogo';
import { auditJobRecord, getJobCohortLabel, generateCohortTelegramBroadcast } from '@/utils/jobAudit';
import { verifyFresherEligibility } from '@/utils/jobExperience';

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

const SCRAPER_NOISE_TAGS = new Set([
  'lead', 'indeed', 'linkedin', 'glassdoor', 'jobboard', 'jobspy', 'jobicy',
  'freshers', 'fresher', '0-1 yoe', '0-1', '0-2 yoe', '1-2 yoe',
  'remote wfh', 'remote', 'india', 'pan-india', 'telegram', 'product giant',
  'unicorn', 'it services', 'mass recruiter', 'fintech', 'imported feed',
  'active now', 'recent', 'off-campus', 'on-campus',
]);

function cleanLeadTags(tags?: string[] | null): string[] {
  if (!tags || !Array.isArray(tags)) return [];
  return tags.filter((t) => !SCRAPER_NOISE_TAGS.has(t.trim().toLowerCase()));
}

export function normalizeCompanyKey(c?: string | null): string {
  if (!c) return '';
  return c
    .toLowerCase()
    .replace(/\b(technologies|technology|private limited|pvt ltd|pvt\. ltd\.|ltd|limited|inc|corporation|corp|llp|services|systems|consulting|solutions|in india|india)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function normalizeTitleKey(t?: string | null): string {
  if (!t) return '';
  return t
    .toLowerCase()
    .replace(/[()[\]\-–—|/]/g, ' ')
    .replace(/\b(full[- ]time|fresher|freshers|batch|class\s+of\s+\d+|202[4-7]|graduates?|hiring)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
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
          tags: cleanLeadTags(initial.tags),
          is_active: initial.tags?.includes('LEAD') ? true : initial.is_active,
          is_featured: initial.is_featured,
          sort_order: initial.sort_order,
        }
      : EMPTY_FORM
  );

  const [relistAsNew, setRelistAsNew] = useState(false);
  const [descTab, setDescTab] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const [tagsInput, setTagsInput] = useState(() =>
    initial ? cleanLeadTags(initial.tags).join(', ') : ''
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
          {/* Quality Audit Checklist Banner */}
          {(() => {
            const audit = auditJobRecord(form);
            if (audit.missingItems.length > 0) {
              return (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Readiness & Quality Checklist ({audit.readinessScore}%):</span>
                  </div>
                  <ul className="text-[11px] list-disc list-inside space-y-1 pl-1 text-amber-700 dark:text-amber-300/90">
                    {audit.missingItems.map((item) => (
                      <li key={item.key}>
                        <strong>{item.label}:</strong> {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>100% Verified Quality! Official description, direct portal, and logo present.</span>
              </div>
            );
          })()}

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
              <CompanyLogo
                logoUrl={form.company_logo_url}
                companyName={form.company_name || 'Company'}
                size="sm"
              />
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
            <div className="flex items-center justify-between mb-1">
              <label className={labelCls}>Description</label>
              <div className="flex items-center gap-1 text-[10px] bg-[#F8F9FA] dark:bg-[#1A1A1A] p-0.5 rounded-md border border-[#E9ECEF] dark:border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setDescTab('EDIT')}
                  className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                    descTab === 'EDIT'
                      ? 'bg-white dark:bg-[#252525] text-[#121417] dark:text-white shadow-xs'
                      : 'text-[#868E96]'
                  }`}
                >
                  Edit Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setDescTab('PREVIEW')}
                  className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                    descTab === 'PREVIEW'
                      ? 'bg-white dark:bg-[#252525] text-[#121417] dark:text-white shadow-xs'
                      : 'text-[#868E96]'
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>
            {descTab === 'EDIT' ? (
              <textarea
                rows={5}
                value={form.description ?? ''}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Eligibility, batch eligibility, skills, selection process..."
                className={`${inputCls} resize-y font-mono`}
              />
            ) : (
              <div className="p-3.5 bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded-lg max-h-60 overflow-y-auto">
                <ContentRenderer
                  content={prepareJobDescriptionMarkdown(form.description ?? '')}
                  emptyText="No description to preview."
                />
              </div>
            )}
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
type AdminVoteFilter = 'ALL' | 'UNREVIEWED' | 'UP' | 'DOWN';

interface BulkDeleteScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AdminJobTab;
  selectedCohort: string;
  adminVoteFilter: AdminVoteFilter;
  searchQuery: string;
  breakdown: {
    totalCount: number;
    upIds: string[];
    downIds: string[];
    unreviewedIds: string[];
    nonUpIds: string[];
  };
  includeUpVotes: boolean;
  onChangeIncludeUpVotes: (next: boolean) => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

function BulkDeleteScopeModal({
  isOpen,
  onClose,
  activeTab,
  selectedCohort,
  adminVoteFilter,
  searchQuery,
  breakdown,
  includeUpVotes,
  onChangeIncludeUpVotes,
  onConfirm,
  isDeleting,
}: BulkDeleteScopeModalProps) {
  if (!isOpen) return null;

  const hasProtectedUps = breakdown.upIds.length > 0 && adminVoteFilter !== 'UP';
  const effectiveTargetCount =
    adminVoteFilter === 'UP' || includeUpVotes
      ? breakdown.totalCount
      : breakdown.nonUpIds.length;
  const sparedUpCount = hasProtectedUps && !includeUpVotes ? breakdown.upIds.length : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-extrabold text-[#121417] dark:text-white">
                Delete Filtered Listings
              </h3>
              <p className="text-xs text-[#868E96]">
                Strictly scoped to your active selection — nothing outside this filter is touched.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-[#868E96] hover:text-[#121417] dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Exact Active Filter Scope Badges */}
        <div className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#242424] space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#868E96]">
            Active Filter Scope
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2A2A2A] font-bold text-[#121417] dark:text-white">
              Tab: {activeTab}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2A2A2A] font-bold text-[#121417] dark:text-white">
              Cohort: {selectedCohort === 'ALL' ? 'All Cohorts' : selectedCohort}
            </span>
            {adminVoteFilter !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2A2A2A] font-bold text-[#121417] dark:text-white">
                Vote: {adminVoteFilter}
              </span>
            )}
            {searchQuery.trim() && (
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2A2A2A] font-bold text-[#121417] dark:text-white">
                Search: &ldquo;{searchQuery.trim()}&rdquo;
              </span>
            )}
          </div>

          {/* Vote Breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E9ECEF] dark:border-[#242424] text-center">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {breakdown.upIds.length}
              </div>
              <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                👍 Kept
              </div>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                {breakdown.downIds.length}
              </div>
              <div className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                👎 Flagged
              </div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-500/10 border border-zinc-500/20">
              <div className="text-sm font-black text-[#121417] dark:text-white">
                {breakdown.unreviewedIds.length}
              </div>
              <div className="text-[10px] font-bold text-[#6C757D] dark:text-[#AAAAAA]">
                Unreviewed
              </div>
            </div>
          </div>
        </div>

        {/* Option A vs Kill 👍 Up Ones Too */}
        {hasProtectedUps && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#868E96]">
              Choose what to do with the {breakdown.upIds.length} 👍 Kept listing(s):
            </div>

            <button
              type="button"
              onClick={() => onChangeIncludeUpVotes(false)}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                !includeUpVotes
                  ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#121417] dark:text-white">
                  🛡️ Keep 👍 Approved Jobs Safe (Recommended)
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Delete {breakdown.nonUpIds.length} · Spare {breakdown.upIds.length}
                </span>
              </div>
              <p className="text-[11px] text-[#6C757D] dark:text-[#AAAAAA] mt-1">
                Deletes only unreviewed and 👎 flagged items in this filter. All 👍 kept listings stay untouched.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onChangeIncludeUpVotes(true)}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                includeUpVotes
                  ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/30'
                  : 'border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                  ⚠️ Delete 👍 Kept Ones Too (Kill Everything in Filter)
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  Delete All {breakdown.totalCount}
                </span>
              </div>
              <p className="text-[11px] text-[#6C757D] dark:text-[#AAAAAA] mt-1">
                Permanently deletes ALL {breakdown.totalCount} matching listings, including the {breakdown.upIds.length} marked 👍 Kept.
              </p>
            </button>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#495057] dark:text-[#CCCCCC] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting || effectiveTargetCount === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : effectiveTargetCount === 0 ? (
              <span>All {breakdown.upIds.length} Protected — Pick &ldquo;Delete 👍 Kept Too&rdquo;</span>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  Delete {effectiveTargetCount} Job{effectiveTargetCount === 1 ? '' : 's'}
                  {sparedUpCount > 0 ? ` (Keep ${sparedUpCount} 👍)` : ''}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
type LeadCategoryFilter =
  | 'ALL'
  | 'BOT_LEADS'
  | 'FRESHER_ONLY'
  | 'NON_FRESHER'
  | 'NEEDS_DESC'
  | 'JOB_BOARD_URL'
  | 'MISSING_LOGO'
  | 'READY'
  | 'INDIA_ONLY'
  | 'REMOTE_WFH'
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
  const [adminVoteFilter, setAdminVoteFilter] = useState<AdminVoteFilter>('ALL');
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [includeUpVotesInBulkDelete, setIncludeUpVotesInBulkDelete] = useState(false);

  // Leads & Cohort states
  const [selectedCohort, setSelectedCohort] = useState<string>('ALL');
  const [leadCategory, setLeadCategory] = useState<LeadCategoryFilter>('ALL');
  const [hideListed, setHideListed] = useState<boolean>(false);
  const [visibleLeadsCount, setVisibleLeadsCount] = useState<number>(50);
  const [addingLeadId, setAddingLeadId] = useState<string | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState<boolean>(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [showCuratedBackup, setShowCuratedBackup] = useState<boolean>(true);
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

  const { data: adminVotes = {} } = useQuery({
    queryKey: ['job_admin_reviews'],
    queryFn: () => jobsService.getAdminReviews(),
    enabled: isEffectiveAdmin,
    staleTime: 10000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin_job_listings'] });
    queryClient.invalidateQueries({ queryKey: ['job_listings'] });
    queryClient.invalidateQueries({ queryKey: ['job_admin_reviews'] });
  }, [queryClient]);

  const invalidateReports = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin_job_reports'] });
  }, [queryClient]);

  // Handle 1-click pre-fill from Telegram alert button URL (e.g. ?add_company=...&add_title=...)
  React.useEffect(() => {
    if (!isEffectiveAdmin) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const company = params.get('add_company') || params.get('company');
      const title = params.get('add_title') || params.get('title');
      const applyUrl = params.get('add_url') || params.get('url');
      if (company && title && applyUrl) {
        setModalJob({
          id: '',
          title,
          company_name: company,
          company_logo_url: '',
          type: (params.get('add_type') || params.get('type') || 'JOB').toUpperCase() as JobType,
          location: params.get('add_location') || params.get('location') || 'Pan-India',
          experience_min: 0,
          experience_max: 1,
          stipend_or_salary: params.get('add_salary') || params.get('salary') || '',
          description: `Verified campus & early career opening at ${company}.\nApply directly through official ATS portal.`,
          apply_url: applyUrl,
          deadline: null,
          tags: ['Freshers', 'India', 'Telegram'],
          is_active: true,
          is_featured: false,
          sort_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        toast.info(`Pre-filled listing from Telegram for ${company}!`);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, [isEffectiveAdmin, toast]);

  // Single-pass O(N) partitioning into disjoint sets (Live, Expired, Draft)
  const { liveListings, expiredListings, draftListings } = useMemo(() => {
    const nowMs = Date.now();
    const live: JobListing[] = [];
    const expired: JobListing[] = [];
    const draft: JobListing[] = [];

    for (let i = 0; i < listings.length; i++) {
      const job = listings[i];
      const isPastDeadline = Boolean(job.deadline && new Date(job.deadline).getTime() < nowMs);
      const isBotLead = Boolean(job.tags?.includes('LEAD') && !job.is_active);

      if (isPastDeadline) {
        expired.push(job);
      } else if (isBotLead) {
        // Unverified bot lead: routed to Leads tab instead of cluttering drafts
      } else if (!job.is_active) {
        draft.push(job);
      } else {
        live.push(job);
      }
    }

    return { liveListings: live, expiredListings: expired, draftListings: draft };
  }, [listings]);

  const flaggedDeleteIds = useMemo(
    () => listings.filter((j) => adminVotes[j.id] === 'DOWN').map((j) => j.id),
    [listings, adminVotes]
  );

  // Extract all unverified bot leads stored in Supabase
  const dbLeads = useMemo<ScrapedJobLead[]>(() => {
    return listings
      .filter((j) => !j.is_active && j.tags?.includes('LEAD'))
      .map((j) => ({
        id: j.id,
        company_name: j.company_name,
        company_logo_url: j.company_logo_url,
        title: j.title,
        type: j.type,
        location: j.location,
        experience_min: j.experience_min,
        experience_max: j.experience_max,
        stipend_or_salary: j.stipend_or_salary,
        description: j.description,
        apply_url: j.apply_url,
        source: j.tags?.find((t) => t.startsWith('JobSpy')) || 'JobSpy Bot (Live)',
        age: 'Just now',
        batch_eligibility: 'Class of 2024 / 2025 / 2026 / 2027',
        tags: j.tags || [],
        isDbLead: true,
        created_at: j.created_at,
      }));
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

  // Leads pipeline: Semantic deduplication guaranteeing zero duplicate leads in Admin Panel
  const activeLeadsPool = useMemo<ScrapedJobLead[]>(() => {
    let rawPool: ScrapedJobLead[] = [];
    if (customLeads && customLeads.length > 0) {
      const dbKeys = new Set(dbLeads.map((d) => `${normalizeCompanyKey(d.company_name)}@@${normalizeTitleKey(d.title)}`));
      const remainingCustom = customLeads.filter((b) => !dbKeys.has(`${normalizeCompanyKey(b.company_name)}@@${normalizeTitleKey(b.title)}`));
      rawPool = [...dbLeads, ...remainingCustom];
    } else if (showCuratedBackup) {
      const dbKeys = new Set(dbLeads.map((d) => `${normalizeCompanyKey(d.company_name)}@@${normalizeTitleKey(d.title)}`));
      const remainingCurated = curatedJobLeads.filter((b) => !dbKeys.has(`${normalizeCompanyKey(b.company_name)}@@${normalizeTitleKey(b.title)}`));
      rawPool = [...dbLeads, ...remainingCurated];
    } else {
      rawPool = dbLeads;
    }

    // In-memory semantic deduplication (preferring direct ATS portal if duplicates exist)
    const seenSemantic = new Set<string>();
    const seenUrls = new Set<string>();
    const deduplicated: ScrapedJobLead[] = [];

    for (const lead of rawPool) {
      const semKey = `${normalizeCompanyKey(lead.company_name)}@@${normalizeTitleKey(lead.title)}`;
      const urlKey = (lead.apply_url || '').trim().toLowerCase();

      if (seenSemantic.has(semKey)) continue;
      if (urlKey && seenUrls.has(urlKey)) continue;

      seenSemantic.add(semKey);
      if (urlKey) seenUrls.add(urlKey);
      deduplicated.push(lead);
    }

    return deduplicated;
  }, [dbLeads, customLeads, showCuratedBackup]);

  const listedUrlSet = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < listings.length; i++) {
      const l = listings[i];
      if (l.is_active) {
        if (l.apply_url) set.add(l.apply_url.toLowerCase().trim());
        if (l.company_name && l.title) {
          set.add(`${l.company_name.toLowerCase().trim()}|${l.title.toLowerCase().trim()}`);
          set.add(`${normalizeCompanyKey(l.company_name)}@@${normalizeTitleKey(l.title)}`);
        }
      }
    }
    return set;
  }, [listings]);

  const isLeadListed = useCallback(
    (lead: ScrapedJobLead) => {
      const urlKey = (lead.apply_url || '').toLowerCase().trim();
      const rawKey = `${(lead.company_name || '').toLowerCase().trim()}|${(lead.title || '').toLowerCase().trim()}`;
      const semKey = `${normalizeCompanyKey(lead.company_name)}@@${normalizeTitleKey(lead.title)}`;
      return listedUrlSet.has(urlKey) || listedUrlSet.has(rawKey) || listedUrlSet.has(semKey);
    },
    [listedUrlSet]
  );

  const {
    indiaLeadsCount,
    remoteLeadsCount,
    productGiantsCount,
    unicornsCount,
    itServicesCount,
    finTechCount,
    internshipsCount,
    jobsCount,
    unlistedLeadsCount,
    needsDescCount,
    jobBoardCount,
    missingLogoCount,
    readyCount,
    nonFresherCount,
    fresherVerifiedCount,
  } = useMemo(() => {
    let india = 0;
    let remote = 0;
    let giants = 0;
    let unicorns = 0;
    let it = 0;
    let fintech = 0;
    let interns = 0;
    let jobs = 0;
    let unlisted = 0;
    let nd = 0;
    let jb = 0;
    let ml = 0;
    let rd = 0;
    let nonFresher = 0;
    let fresherVer = 0;

    for (let i = 0; i < activeLeadsPool.length; i++) {
      const l = activeLeadsPool[i];
      const audit = auditJobRecord(l);
      if (audit.isFallbackDescription) nd++;
      if (audit.isJobBoard) jb++;
      if (!audit.hasLogo) ml++;
      if (audit.isReadyForPublish && !audit.isFallbackDescription && !audit.isJobBoard) rd++;

      const fCheck = verifyFresherEligibility(l);
      if (!fCheck.isFresher) nonFresher++;
      else fresherVer++;
      const comp = l.company_name.toLowerCase();
      const loc = (l.location || '').toLowerCase();
      const tags = l.tags || [];

      const isInd = tags.includes('India') || /india|bengaluru|bangalore|hyderabad|pune|mumbai|chennai|delhi|gurugram|gurgaon|noida|kolkata|ahmedabad|kochi|indore/i.test(loc) || l.source.includes('India');
      const isRem = tags.includes('Remote WFH') || /remote/i.test(loc) || /remote/i.test(l.title);

      if (isInd) india++;
      if (isRem && !isInd) remote++;

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
      if (l.type === 'JOB') jobs++;
      if (!isLeadListed(l)) unlisted++;
    }

    return {
      indiaLeadsCount: india,
      remoteLeadsCount: remote,
      productGiantsCount: giants,
      unicornsCount: unicorns,
      itServicesCount: it,
      finTechCount: fintech,
      internshipsCount: interns,
      jobsCount: jobs,
      unlistedLeadsCount: unlisted,
      needsDescCount: nd,
      jobBoardCount: jb,
      missingLogoCount: ml,
      readyCount: rd,
      nonFresherCount: nonFresher,
      fresherVerifiedCount: fresherVer,
    };
  }, [activeLeadsPool, isLeadListed]);

  // Cohort Groupings
  const availableCohorts = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 0; i < listings.length; i++) {
      const cohort = getJobCohortLabel(listings[i]);
      map.set(cohort, (map.get(cohort) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [listings]);

  // Lead Section Choice Navigation (Settings-style Master-Detail Layout)
  const leadChoices = useMemo<
    Array<{
      id: LeadCategoryFilter;
      label: string;
      caption: string;
      icon: React.ComponentType<{ className?: string }>;
      badge: number | string;
      badgeStyle?: string;
      sectionTitle: string;
      sectionSubtitle: string;
    }>
  >(
    () => [
      {
        id: 'ALL',
        label: 'All Leads Queue',
        caption: 'Full unreviewed candidate pool',
        icon: InboxIcon,
        badge: activeLeadsPool.length,
        sectionTitle: 'All Ingested Leads',
        sectionSubtitle: 'Full unprocessed candidate pipeline across all hiring categories.',
      },
      {
        id: 'FRESHER_ONLY',
        label: 'Verified Freshers (0-1 YOE)',
        caption: 'Strictly 0 to 1 year of experience',
        icon: GraduationCap,
        badge: fresherVerifiedCount,
        badgeStyle: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
        sectionTitle: 'Verified Fresher Roles (0–1 YOE)',
        sectionSubtitle: 'Only positions confirmed strictly for 0 or 1 year of experience.',
      },
      {
        id: 'NON_FRESHER',
        label: '🚨 Non-Fresher (2+ YOE)',
        caption: 'Requires 2+, 3+, 5+ YOE; flagged for discard',
        icon: AlertCircle,
        badge: nonFresherCount,
        badgeStyle: nonFresherCount > 0 ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-black' : undefined,
        sectionTitle: 'Non-Fresher Roles Requiring >= 2 YOE',
        sectionSubtitle: 'Roles requiring 2+, 3+, or senior track record. One-click purge to keep board 100% fresher.',
      },
      {
        id: 'BOT_LEADS',
        label: 'Scraped Bot Stream',
        caption: 'Live automated JobSpy findings',
        icon: Sparkles,
        badge: dbLeads.length,
        badgeStyle: 'bg-[#FD4A32]/15 text-[#FD4A32] border border-[#FD4A32]/30',
        sectionTitle: 'Automated Bot Stream',
        sectionSubtitle: 'Fresh off-campus drives captured by the JobSpy background harvester.',
      },
      {
        id: 'NEEDS_DESC',
        label: 'Needs Real JD',
        caption: 'Using template; paste official text',
        icon: AlertCircle,
        badge: needsDescCount,
        badgeStyle: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
        sectionTitle: 'Description Quality Audit',
        sectionSubtitle: 'Leads with auto-generated summaries that need official employer job descriptions.',
      },
      {
        id: 'JOB_BOARD_URL',
        label: 'Job Board Links',
        caption: 'Points to LinkedIn/Glassdoor; add ATS',
        icon: ExternalLink,
        badge: jobBoardCount,
        badgeStyle: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30',
        sectionTitle: 'Application Portal Verification',
        sectionSubtitle: 'Redirects currently pointing to third-party boards. Upgrade to direct career portals if available.',
      },
      {
        id: 'MISSING_LOGO',
        label: 'Logo Review',
        caption: 'Letter monogram active; custom logo',
        icon: Building2,
        badge: missingLogoCount,
        badgeStyle: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30',
        sectionTitle: 'Logo Visual Review',
        sectionSubtitle: 'Companies displaying fallback letter monograms. Add official PNG/SVG favicon URLs if desired.',
      },
      {
        id: 'READY',
        label: 'Verified & Ready',
        caption: 'Official JD, direct ATS & logo ready',
        icon: ShieldCheck,
        badge: readyCount,
        badgeStyle: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
        sectionTitle: 'Production Ready Openings',
        sectionSubtitle: '100% verified drives with authentic descriptions, direct career links, and company logos.',
      },
      {
        id: 'PRODUCT_GIANTS',
        label: 'Product Giants & MNCs',
        caption: 'Google, Amazon, Microsoft, Qualcomm...',
        icon: Award,
        badge: productGiantsCount,
        sectionTitle: 'Product Giants & Global MNCs',
        sectionSubtitle: 'High-paying, tier-1 engineering drives with premier compensation.',
      },
      {
        id: 'UNICORNS',
        label: 'High-Growth Unicorns',
        caption: 'Swiggy, Zepto, Razorpay, Meesho...',
        icon: Flame,
        badge: unicornsCount,
        sectionTitle: 'Top Indian Unicorns & Startups',
        sectionSubtitle: 'Fast-moving tech companies hiring early-career developers with high growth trajectory.',
      },
      {
        id: 'IT_SERVICES',
        label: 'IT Services & Drives',
        caption: 'TCS, Infosys, Wipro, Accenture...',
        icon: Briefcase,
        badge: itServicesCount,
        sectionTitle: 'Mass IT Recruitment Drives',
        sectionSubtitle: 'High-volume off-campus drives across enterprise technology services.',
      },
      {
        id: 'FINTECH',
        label: 'FinTech & Quant',
        caption: 'Goldman Sachs, Morgan Stanley, Amex...',
        icon: CreditCard,
        badge: finTechCount,
        sectionTitle: 'FinTech, Banking & Trading',
        sectionSubtitle: 'High-frequency trading, investment banking, and fintech engineering openings.',
      },
      {
        id: 'INTERNSHIPS',
        label: 'Internships Only',
        caption: 'Summer/Winter & graduate trainees',
        icon: GraduationCap,
        badge: internshipsCount,
        sectionTitle: 'College Internships & Trainee Programs',
        sectionSubtitle: 'Pre-final and final year internships and technical apprenticeship roles.',
      },
      {
        id: 'REMOTE_WFH',
        label: 'Remote WFH Only',
        caption: '100% work from home pan-India',
        icon: Globe,
        badge: remoteLeadsCount,
        sectionTitle: '100% Remote Engineering Roles',
        sectionSubtitle: 'Work-from-anywhere positions allowing freshers to work remotely.',
      },
    ],
    [
      activeLeadsPool.length,
      dbLeads.length,
      fresherVerifiedCount,
      nonFresherCount,
      needsDescCount,
      jobBoardCount,
      missingLogoCount,
      readyCount,
      productGiantsCount,
      unicornsCount,
      itServicesCount,
      finTechCount,
      internshipsCount,
      remoteLeadsCount,
    ]
  );

  const currentLeadChoice = useMemo(() => {
    return leadChoices.find((c) => c.id === leadCategory) || leadChoices[0];
  }, [leadChoices, leadCategory]);

  const filteredLeads = useMemo(() => {
    let list = activeLeadsPool;

    if (selectedCohort !== 'ALL') {
      list = list.filter((l) => getJobCohortLabel(l) === selectedCohort);
    }

    if (hideListed) {
      list = list.filter((l) => !isLeadListed(l));
    }

    if (leadCategory === 'FRESHER_ONLY') {
      list = list.filter((l) => verifyFresherEligibility(l).isFresher);
    } else if (leadCategory === 'NON_FRESHER') {
      list = list.filter((l) => !verifyFresherEligibility(l).isFresher);
    } else if (leadCategory === 'NEEDS_DESC') {
      list = list.filter((l) => auditJobRecord(l).isFallbackDescription);
    } else if (leadCategory === 'JOB_BOARD_URL') {
      list = list.filter((l) => auditJobRecord(l).isJobBoard);
    } else if (leadCategory === 'MISSING_LOGO') {
      list = list.filter((l) => !auditJobRecord(l).hasLogo);
    } else if (leadCategory === 'READY') {
      list = list.filter((l) => {
        const a = auditJobRecord(l);
        return a.isReadyForPublish && !a.isFallbackDescription && !a.isJobBoard;
      });
    } else if (leadCategory === 'BOT_LEADS') {
      list = list.filter((l) => l.isDbLead || l.tags.includes('LEAD') || l.source.includes('JobSpy'));
    } else if (leadCategory === 'INDIA_ONLY') {
      list = list.filter((l) =>
        l.tags.includes('India') ||
        /india|bengaluru|bangalore|hyderabad|pune|mumbai|chennai|noida|gurugram|delhi/i.test(l.location) ||
        l.source.includes('India')
      );
    } else if (leadCategory === 'REMOTE_WFH') {
      list = list.filter((l) =>
        l.tags.includes('Remote WFH') ||
        /remote/i.test(l.location) ||
        /remote/i.test(l.title)
      );
    } else if (leadCategory === 'PRODUCT_GIANTS') {
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
  }, [activeLeadsPool, hideListed, leadCategory, search, isLeadListed, selectedCohort]);

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

    if (selectedCohort !== 'ALL') {
      list = list.filter((j) => getJobCohortLabel(j) === selectedCohort);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (j) => j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q)
      );
    }

    if (adminVoteFilter !== 'ALL') {
      list = list.filter((j) => {
        const vote = adminVotes[j.id];
        if (adminVoteFilter === 'UNREVIEWED') return !vote;
        if (adminVoteFilter === 'UP') return vote === 'UP';
        if (adminVoteFilter === 'DOWN') return vote === 'DOWN';
        return true;
      });
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
  }, [currentTabPool, search, sortBy, selectedCohort, adminVoteFilter, adminVotes]);

  const hasNarrowingListingFilter =
    selectedCohort !== 'ALL' ||
    Boolean(search.trim()) ||
    adminVoteFilter !== 'ALL' ||
    activeTab === 'EXPIRED' ||
    activeTab === 'DRAFT';

  const bulkDeleteBreakdown = useMemo(() => {
    const upIds: string[] = [];
    const downIds: string[] = [];
    const unreviewedIds: string[] = [];
    for (const j of filtered) {
      const vote = adminVotes[j.id];
      if (vote === 'UP') upIds.push(j.id);
      else if (vote === 'DOWN') downIds.push(j.id);
      else unreviewedIds.push(j.id);
    }
    return {
      totalCount: filtered.length,
      upIds,
      downIds,
      unreviewedIds,
      nonUpIds: [...downIds, ...unreviewedIds],
    };
  }, [filtered, adminVotes]);

  const bulkLeadDeleteTargets = useMemo(() => {
    const dbLeadIds = filteredLeads.filter((l) => l.isDbLead).map((l) => l.id);
    const customLeadIds = customLeads
      ? filteredLeads.filter((l) => !l.isDbLead && customLeads.some((c) => c.id === l.id)).map((l) => l.id)
      : [];
    return {
      totalFiltered: filteredLeads.length,
      deletableIds: [...dbLeadIds, ...customLeadIds],
    };
  }, [filteredLeads, customLeads]);

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
    const fCheck = verifyFresherEligibility(lead);
    if (!fCheck.isFresher) {
      toast.error(`Blocked "${lead.title}": Requires ${fCheck.minYears}+ YOE. Prepunite is strictly for 0–1 YOE freshers.`);
      return;
    }
    if (isLeadListed(lead)) {
      toast.info(`"${lead.company_name} - ${lead.title}" is already published and live on the public site!`);
      return;
    }
    setAddingLeadId(lead.id);
    try {
      if (lead.isDbLead) {
        // Unverified bot lead already in DB: activate and strip LEAD + scraper noise tags
        await jobsService.updateListing(lead.id, {
          is_active: true,
          tags: cleanLeadTags(lead.tags),
        });
      } else {
        await jobsService.createListing({
          title: lead.title,
          company_name: lead.company_name,
          company_logo_url: lead.company_logo_url || null,
          type: lead.type,
          location: lead.location || 'Remote',
          experience_min: lead.experience_min ?? 0,
          experience_max: lead.experience_max ?? 1,
          stipend_or_salary: lead.stipend_or_salary || null,
          description:
            lead.description && lead.description.length > 100 && !lead.description.startsWith('Verified ')
              ? lead.description
              : generateStructuredJobDescription(lead.company_name, lead.title, lead.type, lead.location, lead.tags),
          apply_url: lead.apply_url,
          deadline: null,
          tags: cleanLeadTags(lead.tags),
          is_active: true,
          is_featured: false,
          sort_order: 0,
        });
      }
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
      id: lead.isDbLead ? lead.id : '',
      title: lead.title,
      company_name: lead.company_name,
      company_logo_url: lead.company_logo_url || '',
      type: lead.type,
      location: lead.location || 'Remote',
      experience_min: lead.experience_min ?? 0,
      experience_max: lead.experience_max ?? 1,
      stipend_or_salary: lead.stipend_or_salary || '',
      description:
        lead.description && lead.description.length > 100 && !lead.description.startsWith('Verified ')
          ? lead.description
          : generateStructuredJobDescription(lead.company_name, lead.title, lead.type, lead.location, lead.tags),
      apply_url: lead.apply_url,
      deadline: null,
      tags: cleanLeadTags(lead.tags),
      is_active: true,
      is_featured: false,
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  const handleDismissLead = async (lead: ScrapedJobLead) => {
    if (!lead.isDbLead) return;
    if (!window.confirm(`Dismiss and remove lead "${lead.title} at ${lead.company_name}" from database?`)) return;
    setDeletingLeadId(lead.id);
    try {
      await jobsService.deleteListing(lead.id);
      toast.success(`Dismissed lead from ${lead.company_name}`);
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to dismiss lead.');
    } finally {
      setDeletingLeadId(null);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = (visibleLeads: ScrapedJobLead[]) => {
    const unlisted = visibleLeads.filter((l) => !isLeadListed(l));
    const allSelected = unlisted.length > 0 && unlisted.every((l) => selectedLeadIds.has(l.id));
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        unlisted.forEach((l) => next.delete(l.id));
      } else {
        unlisted.forEach((l) => next.add(l.id));
      }
      return next;
    });
  };

  const handleBulkQuickAdd = async (targetIds?: string[]) => {
    let candidates: ScrapedJobLead[] = [];
    if (targetIds && targetIds.length > 0) {
      const idSet = new Set(targetIds);
      candidates = activeLeadsPool.filter((l) => idSet.has(l.id) && !isLeadListed(l));
    } else {
      candidates = filteredLeads.filter((l) => !isLeadListed(l));
    }

    // Strict Fresher Invariant Gate
    const eligibleCandidates = candidates.filter((l) => verifyFresherEligibility(l).isFresher);
    const rejectedCount = candidates.length - eligibleCandidates.length;

    if (rejectedCount > 0) {
      toast.error(`Filtered out ${rejectedCount} non-fresher lead(s) requiring >= 2 YOE.`);
    }

    if (!eligibleCandidates.length) {
      toast.error('No eligible 0–1 YOE leads available to publish.');
      return;
    }
    candidates = eligibleCandidates;

    const confirmMsg = targetIds
      ? `Quick Add ${candidates.length} selected lead(s) to live job listings?`
      : `Quick Add all ${candidates.length} unlisted lead(s) to live job listings?`;

    if (!window.confirm(confirmMsg)) return;

    setIsBulkProcessing(true);
    setBulkProgress({ current: 0, total: candidates.length });

    try {
      const dbLeadsToActivate = candidates.filter((l) => l.isDbLead);
      const nonDbLeadsToCreate = candidates.filter((l) => !l.isDbLead);

      let processed = 0;

      // Batch update DB leads in chunks of 20
      for (let i = 0; i < dbLeadsToActivate.length; i += 20) {
        const chunk = dbLeadsToActivate.slice(i, i + 20);
        await Promise.all(
          chunk.map((lead) =>
            jobsService.updateListing(lead.id, {
              is_active: true,
              tags: cleanLeadTags(lead.tags),
            })
          )
        );
        processed += chunk.length;
        setBulkProgress({ current: processed, total: candidates.length });
      }

      // Batch create non-DB leads if any
      for (let i = 0; i < nonDbLeadsToCreate.length; i += 10) {
        const chunk = nonDbLeadsToCreate.slice(i, i + 10);
        await Promise.all(
          chunk.map((lead) =>
            jobsService.createListing({
              title: lead.title,
              company_name: lead.company_name,
              company_logo_url: lead.company_logo_url || null,
              type: lead.type,
              location: lead.location || 'Remote',
              experience_min: lead.experience_min ?? 0,
              experience_max: lead.experience_max ?? 1,
              stipend_or_salary: lead.stipend_or_salary || null,
              description:
                lead.description && lead.description.length > 100 && !lead.description.startsWith('Verified ')
                  ? lead.description
                  : generateStructuredJobDescription(lead.company_name, lead.title, lead.type, lead.location, lead.tags),
              apply_url: lead.apply_url,
              deadline: null,
              tags: cleanLeadTags(lead.tags),
              is_active: true,
              is_featured: false,
              sort_order: 0,
            })
          )
        );
        processed += chunk.length;
        setBulkProgress({ current: processed, total: candidates.length });
      }

      toast.success(`🎉 Published ${processed} leads to live job listings!`);
      setSelectedLeadIds(new Set());
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to bulk publish leads.');
    } finally {
      setIsBulkProcessing(false);
      setBulkProgress({ current: 0, total: 0 });
    }
  };

  const handleBulkDismiss = async (targetIds: string[]) => {
    if (!targetIds.length) return;
    if (!window.confirm(`Dismiss and remove ${targetIds.length} lead(s) from database?`)) return;

    setIsBulkProcessing(true);
    try {
      const dbIds = targetIds.filter((id) => activeLeadsPool.find((l) => l.id === id)?.isDbLead);
      if (dbIds.length > 0) {
        await jobsService.purgeListingsByIds(dbIds);
      }
      if (customLeads) {
        const idSet = new Set(targetIds);
        const updated = customLeads.filter((l) => !idSet.has(l.id));
        setCustomLeads(updated.length ? updated : null);
      }
      toast.success(`Dismissed ${targetIds.length} lead(s)`);
      setSelectedLeadIds(new Set());
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to dismiss leads.');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleCopyCohortBroadcast = () => {
    const cohortJobs = activeTab === 'LEADS' ? filteredLeads : filtered;
    if (!cohortJobs.length) {
      toast.error('No jobs found in the selected cohort or filter to broadcast.');
      return;
    }
    const cohortTitle = selectedCohort === 'ALL' ? 'Latest Job Openings' : selectedCohort;
    const text = generateCohortTelegramBroadcast(cohortTitle, cohortJobs);
    navigator.clipboard.writeText(text);
    toast.success(`Copied Telegram broadcast for ${cohortJobs.length} job(s) in ${cohortTitle}!`);
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

  const handleOpenBulkDeleteModal = () => {
    if (filtered.length === 0) return;
    // Default safely to Option A (protect 👍 Kept) unless Admin explicitly filtered to 👍 Kept
    setIncludeUpVotesInBulkDelete(adminVoteFilter === 'UP');
    setBulkDeleteModalOpen(true);
  };

  const handleExecuteBulkDelete = async () => {
    const targetIds =
      adminVoteFilter === 'UP' || includeUpVotesInBulkDelete
        ? filtered.map((j) => j.id)
        : bulkDeleteBreakdown.nonUpIds;

    if (targetIds.length === 0) return;

    setPurging(true);
    try {
      const count = await jobsService.purgeListingsByIds(targetIds);
      const sparedUps =
        adminVoteFilter !== 'UP' && !includeUpVotesInBulkDelete
          ? bulkDeleteBreakdown.upIds.length
          : 0;
      toast.success(
        sparedUps > 0
          ? `Deleted ${count} job(s). Kept ${sparedUps} 👍 approved job(s) safe!`
          : `Deleted ${count} job(s) matching current filter.`
      );
      setBulkDeleteModalOpen(false);
      invalidate();
      invalidateReports();
    } catch (err: any) {
      toast.error(err?.message || 'Bulk filtered delete failed.');
    } finally {
      setPurging(false);
    }
  };

  const handlePurgeFlagged = async () => {
    if (flaggedDeleteIds.length === 0) return;
    const confirmed = await confirmModal({
      title: 'Delete All 👎 Flagged Listings',
      message: `Permanently delete ${flaggedDeleteIds.length} job listing(s) marked Thumbs Down (👎) from the database? This cannot be undone.`,
      confirmText: `Delete ${flaggedDeleteIds.length} Flagged Job(s)`,
      cancelText: 'Cancel',
      isDanger: true,
    });
    if (!confirmed) return;

    setPurging(true);
    try {
      const count = await jobsService.purgeListingsByIds(flaggedDeleteIds);
      toast.success(`Deleted ${count} 👎 flagged job listing(s).`);
      invalidate();
      invalidateReports();
    } catch (err: any) {
      toast.error(err?.message || 'Delete flagged purge failed.');
    } finally {
      setPurging(false);
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

      <BulkDeleteScopeModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => !purging && setBulkDeleteModalOpen(false)}
        activeTab={activeTab}
        selectedCohort={selectedCohort}
        adminVoteFilter={adminVoteFilter}
        searchQuery={search}
        breakdown={bulkDeleteBreakdown}
        includeUpVotes={includeUpVotesInBulkDelete}
        onChangeIncludeUpVotes={setIncludeUpVotesInBulkDelete}
        onConfirm={handleExecuteBulkDelete}
        isDeleting={purging}
      />

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
                  {liveListings.length} live · {activeLeadsPool.length} India & Remote leads · {expiredListings.length} expired · {draftListings.length} drafts
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
                <span>Leads ({activeLeadsPool.length})</span>
                {dbLeads.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#FD4A32] text-white">
                    🤖 {dbLeads.length} Bot
                  </span>
                )}
                {unlistedLeadsCount > 0 && dbLeads.length === 0 && (
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

              {/* Cohort Selector (Daily Batches) */}
              <div className="relative">
                <select
                  aria-label="Filter by daily cohort"
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value)}
                  className="appearance-none pl-7 pr-8 py-1.5 text-xs font-bold bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg text-[#121417] dark:text-white focus:outline-none focus:border-[#121417] cursor-pointer shadow-xs"
                  title="Filter by daily cohort / drop date"
                >
                  <option value="ALL">All Cohorts ({listings.length})</option>
                  {availableCohorts.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.count})
                    </option>
                  ))}
                </select>
                <Layers className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#FD4A32]" />
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96]" />
              </div>

              {/* Copy Telegram Broadcast Button */}
              <button
                type="button"
                onClick={handleCopyCohortBroadcast}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                title="1-Click copy formatted Telegram channel broadcast for this cohort"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Telegram Broadcast</span>
              </button>

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

              {/* Admin Vote Filter (only for listings) */}
              {activeTab !== 'REPORTS' && activeTab !== 'LEADS' && (
                <div className="relative">
                  <select
                    aria-label="Filter by admin review vote"
                    value={adminVoteFilter}
                    onChange={(e) => setAdminVoteFilter(e.target.value as AdminVoteFilter)}
                    className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-bold border rounded-lg focus:outline-none cursor-pointer shadow-xs ${
                      adminVoteFilter === 'DOWN'
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                        : adminVoteFilter === 'UP'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-white focus:border-[#121417] dark:focus:border-[#555]'
                    }`}
                    title="Filter listings by your 👍 / 👎 triage vote"
                  >
                    <option value="ALL">All Votes</option>
                    <option value="UNREVIEWED">Unreviewed</option>
                    <option value="UP">👍 Kept Only</option>
                    <option value="DOWN">👎 Flagged Only</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96]" />
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

              {/* Scoped Delete Filtered / Cohort Button (with Option A protect 👍 + Kill 👍 toggle) */}
              {activeTab !== 'LEADS' && activeTab !== 'REPORTS' && filtered.length > 0 && (
                <button
                  type="button"
                  onClick={handleOpenBulkDeleteModal}
                  disabled={!hasNarrowingListingFilter || purging}
                  title={
                    hasNarrowingListingFilter
                      ? 'Bulk delete listings matching active tab, cohort, vote filter, or search'
                      : 'Safety Lock: Select a Cohort, Search, Vote Filter, Drafts, or Expired tab before bulk deleting'
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-xs whitespace-nowrap ${
                    hasNarrowingListingFilter
                      ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 cursor-pointer disabled:opacity-50'
                      : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#868E96] border-[#E9ECEF] dark:border-[#2A2A2A] opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {!hasNarrowingListingFilter
                      ? 'Pick Cohort / Filter to Delete'
                      : selectedCohort !== 'ALL' && !search.trim() && adminVoteFilter === 'ALL'
                      ? `Delete Cohort (${filtered.length})`
                      : `Delete Filtered (${filtered.length})`}
                  </span>
                </button>
              )}

              {/* Leads Scoped Delete Filtered Button */}
              {activeTab === 'LEADS' &&
                (selectedCohort !== 'ALL' || leadCategory !== 'ALL' || Boolean(search.trim()) || hideListed) &&
                bulkLeadDeleteTargets.deletableIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleBulkDismiss(bulkLeadDeleteTargets.deletableIds)}
                    disabled={isBulkProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 transition-all shadow-xs cursor-pointer whitespace-nowrap disabled:opacity-50"
                    title="Delete all bot/imported leads matching active cohort, category, and search"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Filtered Leads ({bulkLeadDeleteTargets.deletableIds.length})</span>
                  </button>
                )}

              {activeTab !== 'LEADS' && activeTab !== 'REPORTS' && flaggedDeleteIds.length > 0 && (
                <button
                  type="button"
                  onClick={handlePurgeFlagged}
                  disabled={purging}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white transition-all shadow-xs cursor-pointer whitespace-nowrap disabled:opacity-50"
                  title="Delete all listings marked Thumbs Down on /jobs"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  {purging ? 'Deleting...' : `Delete 👎 Flagged (${flaggedDeleteIds.length})`}
                </button>
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

          {/* Leads Intelligence & Ingestion Panel: Two-Column Master-Detail Command Center */}
          {activeTab === 'LEADS' ? (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Left Column: Settings-style Category Navigation Sidebar */}
              <div className="w-full lg:w-80 shrink-0 space-y-3">
                {/* Master Action Card */}
                <div className="p-4 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FD4A32]/10 flex items-center justify-center text-[#FD4A32]">
                        <Zap className="w-4 h-4 fill-[#FD4A32]" />
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-xs text-[#121417] dark:text-white uppercase tracking-wider">
                          Leads Engine
                        </h3>
                        <p className="text-[10px] text-[#868E96]">
                          {dbLeads.length} in queue ({activeLeadsPool.length} total)
                        </p>
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#495057] dark:text-[#AAAAAA] cursor-pointer select-none bg-[#F8F9FA] dark:bg-[#1A1A1A] px-2 py-1 rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A]">
                      <input
                        type="checkbox"
                        checked={hideListed}
                        onChange={(e) => setHideListed(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#FD4A32] focus:ring-0 cursor-pointer"
                      />
                      <span>Unlisted</span>
                    </label>
                  </div>

                  {unlistedLeadsCount > 0 && (
                    <button
                      type="button"
                      disabled={isBulkProcessing}
                      onClick={() => handleBulkQuickAdd()}
                      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#FD4A32] hover:bg-[#E03E28] text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      title="Publish all unlisted leads directly into live listings"
                    >
                      {isBulkProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Publishing ({bulkProgress.current}/{bulkProgress.total})...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>Publish All Leads ({unlistedLeadsCount})</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* The Choice Navigation Card (Exact SettingsPage visual style) */}
                <div className="p-2 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-1">
                  {leadChoices.map((choice) => {
                    const Icon = choice.icon;
                    const isActive = leadCategory === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => {
                          setLeadCategory(choice.id);
                          setVisibleLeadsCount(50);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all border cursor-pointer ${
                          isActive
                            ? 'bg-black/5 dark:bg-[#1A1A1A] border-[#FD4A32] dark:border-[#FD4A32] text-[#121417] dark:text-white shadow-xs'
                            : 'border-transparent text-[#495057] dark:text-[#A1A1AA] hover:text-[#121417] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1A1A1A]'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive
                              ? 'bg-[#FD4A32] text-white shadow-xs'
                              : 'bg-black/5 dark:bg-[#07080A] text-[#868E96] dark:text-[#71717A]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-display font-bold text-xs truncate">
                              {choice.label}
                            </span>
                            <span
                              className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full shrink-0 ${
                                choice.badgeStyle
                                  ? choice.badgeStyle
                                  : isActive
                                  ? 'bg-[#FD4A32]/20 text-[#FD4A32] dark:text-orange-300 border border-[#FD4A32]/30'
                                  : 'bg-black/5 dark:bg-[#07080A] text-[#868E96] dark:text-[#71717A]'
                              }`}
                            >
                              {choice.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#868E96] dark:text-[#71717A] block truncate">
                            {choice.caption}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isActive
                              ? 'text-[#FD4A32] dark:text-white translate-x-0.5'
                              : 'text-neutral-400 opacity-40'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Lead Category Workspace & Table */}
              <div className="flex-1 min-w-0 w-full space-y-4">
                {/* Active Section Header Card */}
                <div className="p-4 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <currentLeadChoice.icon className="w-4 h-4 text-[#FD4A32]" />
                      <h2 className="font-display font-bold text-sm text-[#121417] dark:text-white">
                        {currentLeadChoice.sectionTitle}
                      </h2>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[#121417] dark:text-white border border-zinc-200 dark:border-zinc-700">
                        {filteredLeads.length} leads
                      </span>
                    </div>
                    <p className="text-xs text-[#868E96]">
                      {currentLeadChoice.sectionSubtitle}
                    </p>
                  </div>

                  {/* Quick Purge button for Non-Fresher category */}
                  {leadCategory === 'NON_FRESHER' && filteredLeads.length > 0 && selectedLeadIds.size === 0 && (
                    <button
                      type="button"
                      disabled={isBulkProcessing}
                      onClick={() => handleBulkDismiss(filteredLeads.map((l) => l.id))}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      title="Purge all detected non-fresher roles from database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Discard All {filteredLeads.length} Non-Freshers</span>
                    </button>
                  )}

                  {/* Batch Selection Action Bar if leads selected */}
                  {selectedLeadIds.size > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#121417] dark:text-white">
                        {selectedLeadIds.size} selected
                      </span>
                      <button
                        type="button"
                        disabled={isBulkProcessing}
                        onClick={() => handleBulkQuickAdd(Array.from(selectedLeadIds))}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        Quick Add Selected
                      </button>
                      <button
                        type="button"
                        disabled={isBulkProcessing}
                        onClick={() => handleBulkDismiss(Array.from(selectedLeadIds))}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Dismiss Selected
                      </button>
                    </div>
                  )}
                </div>
{/* Leads Table Card */}
              <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl overflow-hidden shadow-xs">
                {filteredLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-sm font-bold text-[#121417] dark:text-white mb-1">
                      {dbLeads.length === 0 ? 'No Bot Leads in Queue' : 'No Leads Matching Filters'}
                    </h3>
                    <p className="text-xs text-[#868E96] max-w-md mb-4">
                      {dbLeads.length === 0
                        ? 'All scraped bot findings have been reviewed and published! Run "python scraper.py" in prepunite-jobspy to stream fresh requisitions directly here.'
                        : 'Try clearing your search query or switching categories.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {dbLeads.length === 0 && !showCuratedBackup && (
                        <button
                          type="button"
                          onClick={() => setShowCuratedBackup(true)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#495057] dark:text-[#AAAAAA] hover:text-[#121417] dark:hover:text-white transition-all cursor-pointer"
                        >
                          View Curated Directory Backup
                        </button>
                      )}
                      {(leadCategory !== 'ALL' || search || hideListed) && (
                        <button
                          type="button"
                          onClick={() => { setLeadCategory('ALL'); setHideListed(false); setSearch(''); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA]/70 dark:bg-[#0C0C0C]/60 text-[10px] font-bold uppercase tracking-wider text-[#868E96]">
                          <th className="py-3 px-3 w-10 text-center">
                            <input
                              type="checkbox"
                              aria-label="Select all visible unlisted leads"
                              checked={
                                filteredLeads.slice(0, visibleLeadsCount).filter((l) => !isLeadListed(l)).length > 0 &&
                                filteredLeads.slice(0, visibleLeadsCount).filter((l) => !isLeadListed(l)).every((l) => selectedLeadIds.has(l.id))
                              }
                              onChange={() => handleToggleSelectAll(filteredLeads.slice(0, visibleLeadsCount))}
                              className="w-3.5 h-3.5 rounded border-[#E9ECEF] dark:border-[#2A2A2A] text-[#FD4A32] focus:ring-0 cursor-pointer"
                            />
                          </th>
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
                              <td className="py-3 px-3 text-center">
                                {isListed ? (
                                  <span className="text-[11px] text-[#868E96] font-mono">{idx + 1}</span>
                                ) : (
                                  <input
                                    type="checkbox"
                                    aria-label={`Select ${lead.title} at ${lead.company_name}`}
                                    checked={selectedLeadIds.has(lead.id)}
                                    onChange={() => handleToggleSelect(lead.id)}
                                    className="w-3.5 h-3.5 rounded border-[#E9ECEF] dark:border-[#2A2A2A] text-[#FD4A32] focus:ring-0 cursor-pointer"
                                  />
                                )}
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <CompanyLogo
                                    logoUrl={lead.company_logo_url}
                                    companyName={lead.company_name}
                                    size="sm"
                                  />
                                  <div>
                                    <div className="font-bold text-[#121417] dark:text-white flex items-center gap-1.5">
                                      <span>{lead.company_name}</span>
                                      {isListed && (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                          <Check className="w-2.5 h-2.5" /> Listed
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-[#868E96] flex items-center gap-1.5 mt-0.5">
                                      {lead.isDbLead && (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20">
                                          🤖 Scraped Bot Lead
                                        </span>
                                      )}
                                      <span>{lead.source}</span>
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
                                    {(() => {
                                      const fCheck = verifyFresherEligibility(lead);
                                      if (!fCheck.isFresher) {
                                        return (
                                          <span
                                            className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                                            title={fCheck.flagReason || 'Requires 2+ or 3+ YOE'}
                                          >
                                            🚨 {fCheck.minYears}+ YOE Non-Fresher
                                          </span>
                                        );
                                      }
                                      return (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                                          🎯 0-1 YOE
                                        </span>
                                      );
                                    })()}
                                    {(() => {
                                      const audit = auditJobRecord(lead);
                                      return (
                                        <>
                                          {audit.isFallbackDescription ? (
                                            <span
                                              className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                                              title="Uses auto-generated template. Click 'Review & Edit' to paste official employer JD."
                                            >
                                              ⚠️ Template JD
                                            </span>
                                          ) : (
                                            <span
                                              className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                              title="Contains original employer description"
                                            >
                                              ✓ Official JD
                                            </span>
                                          )}

                                          {audit.isJobBoard ? (
                                            <span
                                              className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                                              title="Points to LinkedIn/Glassdoor. Consider pasting direct career portal link."
                                            >
                                              🔗 Job Board
                                            </span>
                                          ) : audit.isDirectAts ? (
                                            <span
                                              className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                                              title="Direct company ATS portal"
                                            >
                                              ✓ Direct ATS
                                            </span>
                                          ) : null}

                                          {!audit.hasLogo && (
                                            <span
                                              className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                                              title="No custom logo; letter monogram used"
                                            >
                                              Monogram
                                            </span>
                                          )}
                                        </>
                                      );
                                    })()}
                                    {lead.tags.includes('Remote WFH') && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                        🏠 Remote WFH
                                      </span>
                                    )}
                                    {lead.tags.filter((t) => t !== 'Remote WFH').slice(0, 2).map((t) => (
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
                                      {lead.isDbLead && (
                                        <button
                                          type="button"
                                          disabled={deletingLeadId === lead.id}
                                          onClick={() => handleDismissLead(lead)}
                                          title="Dismiss and delete lead from database"
                                          className="p-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
                                        >
                                          {deletingLeadId === lead.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          ) : (
                                            <Trash2 className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleReviewLead(lead)}
                                        title="Pre-fill and review in editor modal"
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F8F9FA] dark:bg-[#1F1F1F] text-[#495057] dark:text-[#CCCCCC] border border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-[#121417] dark:hover:border-white transition-all cursor-pointer whitespace-nowrap"
                                      >
                                        Review & Edit
                                      </button>
                                      {(() => {
                                        const fCheck = verifyFresherEligibility(lead);
                                        if (!fCheck.isFresher) {
                                          return (
                                            <span
                                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 whitespace-nowrap"
                                              title={fCheck.flagReason || 'Requires >= 2 YOE'}
                                            >
                                              <AlertCircle className="w-3 h-3 text-rose-500" />
                                              <span>{fCheck.minYears}+ YOE (Non-Fresher)</span>
                                            </span>
                                          );
                                        }
                                        return (
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
                                        );
                                      })()}
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
                              <div className="flex items-center gap-2.5">
                                <CompanyLogo
                                  logoUrl={job.company_logo_url}
                                  companyName={job.company_name}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <div className="font-semibold text-[#121417] dark:text-white max-w-[200px] truncate">{job.title}</div>
                                  <div className="text-[#868E96] text-[11px] truncate">{job.company_name}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                {adminVotes[job.id] === 'UP' && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                                    <ThumbsUp className="w-2.5 h-2.5" />
                                    <span>Keep</span>
                                  </span>
                                )}
                                {adminVotes[job.id] === 'DOWN' && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                                    <ThumbsDown className="w-2.5 h-2.5" />
                                    <span>Delete Flag</span>
                                  </span>
                                )}
                                {reportsByJobId.has(job.id) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveTab('REPORTS');
                                      setReportStatusFilter('OPEN');
                                      setSearch(job.title);
                                    }}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                                    title="Click to view reports for this listing"
                                  >
                                    <Flag className="w-3 h-3 text-rose-500" />
                                    <span>{reportsByJobId.get(job.id)} report{reportsByJobId.get(job.id)! > 1 ? 's' : ''}</span>
                                  </button>
                                )}
                              </div>
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
