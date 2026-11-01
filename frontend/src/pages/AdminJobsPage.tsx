import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Star, StarOff,
  Briefcase, MapPin, Clock, X, Check, AlertCircle,
  ExternalLink, ChevronDown, Search, Loader2,
} from 'lucide-react';
import { useAuth, isSuperAdminEmail } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import { jobsService } from '@/services/jobs.service';
import type { JobListing, JobType } from '@/types/jobs';
import { useToast } from '@/contexts/ToastContext';

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

interface JobFormModalProps {
  initial?: JobListing | null;
  onClose: () => void;
  onSave: (data: FormState, id?: string) => Promise<void>;
  saving: boolean;
}

function JobFormModal({ initial, onClose, onSave, saving }: JobFormModalProps) {
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
    await onSave(payload, initial?.id);
  };

  const inputCls = "w-full px-3 py-2 text-xs bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded-lg text-[#121417] dark:text-white placeholder:text-[#868E96] focus:outline-none focus:border-[#121417] dark:focus:border-[#555] transition-colors";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-[#495057] dark:text-[#AAAAAA] mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-[#141414] border-b border-[#E9ECEF] dark:border-[#242424] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-sm font-display font-extrabold text-[#121417] dark:text-white">
            {initial ? 'Edit Listing' : 'New Listing'}
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
              <label className={labelCls}>Company Name *</label>
              <input
                required
                type="text"
                value={form.company_name}
                onChange={(e) => set('company_name', e.target.value)}
                placeholder="e.g. Google"
                className={inputCls}
              />
            </div>
          </div>

          {/* Logo URL with preview */}
          <div>
            <label className={labelCls}>Company Logo URL</label>
            <div className="flex items-center gap-3">
              <input
                type="url"
                value={form.company_logo_url ?? ''}
                onChange={(e) => set('company_logo_url', e.target.value)}
                placeholder="https://..."
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
                placeholder="e.g. ₹20,000/month"
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
                placeholder="https://..."
                className={inputCls}
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className={labelCls}>Deadline (optional)</label>
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
              rows={4}
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Role description, requirements..."
              className={`${inputCls} resize-y`}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, Node.js, Bangalore"
              className={inputCls}
            />
          </div>

          {/* Toggles + Sort Order */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Active</label>
              <button
                type="button"
                onClick={() => set('is_active', !form.is_active)}
                className={`w-full py-2 rounded-lg text-xs font-bold border transition-all ${
                  form.is_active
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-[#E9ECEF] dark:border-[#2A2A2A] text-[#495057] dark:text-[#AAAAAA]'
                }`}
              >
                {form.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <div>
              <label className={labelCls}>Featured</label>
              <button
                type="button"
                onClick={() => set('is_featured', !form.is_featured)}
                className={`w-full py-2 rounded-lg text-xs font-bold border transition-all ${
                  form.is_featured
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'border-[#E9ECEF] dark:border-[#2A2A2A] text-[#495057] dark:text-[#AAAAAA]'
                }`}
              >
                {form.is_featured ? '★ Featured' : 'Not Featured'}
              </button>
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => set('sort_order', Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>

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

export default function AdminJobsPage() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { toast, confirmModal } = useToast();

  const isEffectiveAdmin = Boolean(isAdmin || isSuperAdminEmail(user?.email));

  // All hooks MUST be called unconditionally (Rules of Hooks)
  const [modalJob, setModalJob] = useState<JobListing | null | 'new'>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['admin_job_listings'],
    queryFn: () => jobsService.getAllListings(),
    enabled: isEffectiveAdmin,
    staleTime: 0,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin_job_listings'] });
    queryClient.invalidateQueries({ queryKey: ['job_listings'] });
  }, [queryClient]);

  const filtered = useMemo(() => {
    if (!search) return listings;
    const q = search.toLowerCase();
    return listings.filter(
      (j) => j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q)
    );
  }, [listings, search]);

  // Guard: If not an admin, render NotFoundPage so unauthorized users cannot even inspect the UI
  if (!isEffectiveAdmin) {
    return <NotFoundPage />;
  }

  const handleSave = async (data: Omit<JobListing, 'id' | 'created_at' | 'updated_at'>, id?: string) => {
    setSaving(true);
    try {
      if (id) {
        await jobsService.updateListing(id, data);
        toast.success('Listing updated successfully.');
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

  const handleDelete = async (job: JobListing) => {
    const confirmed = await confirmModal({
      title: 'Delete Listing',
      message: `Delete "${job.title}" at ${job.company_name}? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDanger: true,
    });
    if (!confirmed) return;
    try {
      await jobsService.deleteListing(job.id);
      toast.success('Listing deleted.');
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || 'Delete failed.');
    }
  };

  const handleToggleActive = async (job: JobListing) => {
    try {
      await jobsService.toggleActive(job.id, !job.is_active);
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

  return (
    <>
      {/* Modal */}
      {modalJob !== null && (
        <JobFormModal
          initial={modalJob === 'new' ? null : modalJob}
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
                <p className="text-xs text-[#868E96]">{listings.length} listing{listings.length !== 1 ? 's' : ''} total</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalJob('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add New Listing
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96]" />
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm pl-8 pr-3 py-2 text-xs bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg text-[#121417] dark:text-white placeholder:text-[#868E96] focus:outline-none focus:border-[#121417] dark:focus:border-[#555] transition-colors"
            />
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-[#868E96]">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-xs">Loading listings...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="w-10 h-10 text-[#868E96] mb-3" />
                <p className="text-sm font-semibold text-[#121417] dark:text-white">No listings found</p>
                <p className="text-xs text-[#868E96] mt-1">
                  {search ? 'Try a different search.' : 'Click "Add New Listing" to create one.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#E9ECEF] dark:border-[#242424] bg-[#F8F9FA] dark:bg-[#0C0C0C]">
                      <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Title / Company</th>
                      <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left font-bold text-[#868E96] uppercase tracking-wider">Deadline</th>
                      <th className="px-4 py-3 text-center font-bold text-[#868E96] uppercase tracking-wider">Active</th>
                      <th className="px-4 py-3 text-center font-bold text-[#868E96] uppercase tracking-wider">Featured</th>
                      <th className="px-4 py-3 text-right font-bold text-[#868E96] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9ECEF] dark:divide-[#242424]">
                    {filtered.map((job) => {
                      const dl = getDeadlineMeta(job.deadline);
                      const expired = isExpiredRow(job.deadline);
                      return (
                        <tr
                          key={job.id}
                          className={`transition-colors hover:bg-[#F8F9FA] dark:hover:bg-[#1A1A1A] ${
                            expired ? 'bg-amber-50/40 dark:bg-amber-900/5' : ''
                          }`}
                        >
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
                          </td>

                          {/* Location */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-[#495057] dark:text-[#AAAAAA]">
                              <MapPin className="w-3 h-3 shrink-0 text-[#868E96]" />
                              {job.location}
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
                                title="Open Apply URL"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#868E96] hover:text-blue-500 hover:border-blue-300 transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button
                                type="button"
                                onClick={() => setModalJob(job)}
                                title="Edit"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:border-[#121417] dark:hover:border-white transition-all"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(job)}
                                title="Delete"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#868E96] hover:text-red-600 hover:border-red-300 transition-all"
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
        </div>
      </div>
    </>
  );
}
