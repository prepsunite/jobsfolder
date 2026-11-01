import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, Briefcase, Star, Search, X, ChevronDown,
  ExternalLink, Clock, Calendar, Tag, Loader2, InboxIcon,
} from 'lucide-react';
import { jobsService } from '@/services/jobs.service';
import type { JobListing, JobListingFilters, JobType } from '@/types/jobs';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDeadlineInfo(deadline: string | null | undefined): {
  label: string;
  color: string;
  pulse: boolean;
} | null {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null; // Already past - RLS should filter these but guard here
  if (diffDays < 2) return { label: 'Closing soon!', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', pulse: true };
  if (diffDays <= 7) return { label: `${diffDays}d left`, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', pulse: false };
  return { label: `${diffDays}d left`, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', pulse: false };
}

function expMatchesFilter(min: number, max: number | null | undefined, level: JobListingFilters['expLevel']): boolean {
  if (!level || level === 'ANY') return true;
  if (level === 'FRESHER') return min === 0 && (!max || max === 0);
  if (level === '0-2') return min <= 2 && (!max || max <= 2 || min <= 2);
  if (level === '2-5') return (min >= 2 && min <= 5) || (max != null && max >= 2 && max <= 5);
  if (level === '5+') return min >= 5 || (max != null && max >= 5);
  return true;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function JobCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl p-5 space-y-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-[#E9ECEF] dark:bg-[#242424] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#E9ECEF] dark:bg-[#242424] rounded w-3/4" />
          <div className="h-3 bg-[#E9ECEF] dark:bg-[#242424] rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-[#E9ECEF] dark:bg-[#242424] rounded w-full" />
      <div className="h-3 bg-[#E9ECEF] dark:bg-[#242424] rounded w-2/3" />
      <div className="h-9 bg-[#E9ECEF] dark:bg-[#242424] rounded-lg mt-2" />
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: JobListing }) {
  const deadline = getDeadlineInfo(job.deadline);

  const expLabel = useMemo(() => {
    if (job.experience_min === 0 && !job.experience_max) return 'Fresher';
    if (job.experience_min === 0 && job.experience_max === 0) return 'Fresher';
    if (!job.experience_max) return `${job.experience_min}+ yrs`;
    if (job.experience_min === job.experience_max) return `${job.experience_min} yr`;
    return `${job.experience_min}–${job.experience_max} yrs`;
  }, [job.experience_min, job.experience_max]);

  const logoLetter = job.company_name.charAt(0).toUpperCase();
  const logoColors = [
    'from-blue-500 to-indigo-600',
    'from-green-500 to-emerald-600',
    'from-purple-500 to-violet-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
    'from-teal-500 to-cyan-600',
  ];
  const logoColor = logoColors[logoLetter.charCodeAt(0) % logoColors.length];

  return (
    <div className={`group relative bg-white dark:bg-[#141414] border rounded-xl p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5 ${
      job.is_featured
        ? 'border-amber-300 dark:border-amber-700/60 shadow-amber-100 dark:shadow-amber-900/10'
        : 'border-[#E9ECEF] dark:border-[#242424]'
    }`}>
      {/* Featured ribbon */}
      {job.is_featured && (
        <div className="absolute top-3 right-3">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
        </div>
      )}

      {/* Header: logo + title + type badge */}
      <div className="flex items-start gap-3">
        {job.company_logo_url ? (
          <img
            src={job.company_logo_url}
            alt={job.company_name}
            className="w-12 h-12 rounded-lg object-contain border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#1A1A1A] p-1 shrink-0"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.style.display = 'none';
              (t.nextSibling as HTMLElement)?.removeAttribute('style');
            }}
          />
        ) : null}
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${logoColor} flex items-center justify-center text-white font-bold text-lg shrink-0 ${job.company_logo_url ? 'hidden' : ''}`}
          style={job.company_logo_url ? { display: 'none' } : {}}
        >
          {logoLetter}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-sm font-bold text-[#121417] dark:text-white leading-snug truncate">
            {job.title}
          </h3>
          <p className="text-xs text-[#495057] dark:text-[#AAAAAA] mt-0.5 truncate">{job.company_name}</p>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          job.type === 'JOB'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
        }`}>
          <Briefcase className="w-2.5 h-2.5" />
          {job.type === 'JOB' ? 'Job' : 'Internship'}
        </span>

        {deadline && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${deadline.color} ${deadline.pulse ? 'animate-pulse' : ''}`}>
            <Clock className="w-2.5 h-2.5" />
            {deadline.label}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5 text-xs text-[#495057] dark:text-[#AAAAAA]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 shrink-0 text-[#868E96]" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 shrink-0 text-[#868E96]" />
          <span>{expLabel} experience</span>
        </div>
        {job.stipend_or_salary && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#868E96] font-semibold text-[10px]">₹</span>
            <span className="font-medium text-[#121417] dark:text-white">{job.stipend_or_salary}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded text-[10px] text-[#495057] dark:text-[#999999]">
              <Tag className="w-2 h-2" />
              {tag}
            </span>
          ))}
          {job.tags.length > 5 && (
            <span className="px-1.5 py-0.5 text-[10px] text-[#868E96]">+{job.tags.length - 5}</span>
          )}
        </div>
      )}

      {/* Apply button */}
      <a
        href={job.apply_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-lg text-xs font-bold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all group-hover:shadow-sm"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Apply Now
      </a>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TYPE_OPTIONS: { label: string; value: 'ALL' | JobType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Jobs', value: 'JOB' },
  { label: 'Internships', value: 'INTERNSHIP' },
];

const EXP_OPTIONS: { label: string; value: JobListingFilters['expLevel'] }[] = [
  { label: 'Any Experience', value: 'ANY' },
  { label: 'Fresher (0 yr)', value: 'FRESHER' },
  { label: '0–2 yrs', value: '0-2' },
  { label: '2–5 yrs', value: '2-5' },
  { label: '5+ yrs', value: '5+' },
];

export default function JobsPage() {
  const [filters, setFilters] = useState<JobListingFilters>({
    type: 'ALL',
    location: '',
    expLevel: 'ANY',
    search: '',
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['job_listings'],
    queryFn: () => jobsService.getActiveListings(),
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    const nowMs = Date.now();
    return listings.filter((job) => {
      // Hide inactive or past-deadline listings from students
      if (!job.is_active) return false;
      if (job.deadline && new Date(job.deadline).getTime() < nowMs) return false;

      // Type filter
      if (filters.type && filters.type !== 'ALL' && job.type !== filters.type) return false;

      // Search filter
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!job.title.toLowerCase().includes(q) && !job.company_name.toLowerCase().includes(q)) return false;
      }

      // Location filter
      if (filters.location) {
        const loc = filters.location.toLowerCase();
        if (!job.location.toLowerCase().includes(loc)) return false;
      }

      // Experience filter
      if (!expMatchesFilter(job.experience_min, job.experience_max, filters.expLevel)) return false;

      return true;
    });
  }, [listings, filters]);

  const hasActiveFilters = filters.type !== 'ALL' || !!filters.search || !!filters.location || (filters.expLevel && filters.expLevel !== 'ANY');

  const clearFilters = () => setFilters({ type: 'ALL', location: '', expLevel: 'ANY', search: '' });

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0C0C0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-[#121417] dark:text-white tracking-tight">
              Jobs &amp; Internships
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
              NEW
            </span>
          </div>
          <p className="text-sm text-[#495057] dark:text-[#AAAAAA] ml-12">
            Curated opportunities for placement-ready students — full-time roles &amp; internships.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl p-4 mb-6 space-y-3">
          {/* Type toggle */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, type: opt.value }))}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  filters.type === opt.value
                    ? 'bg-[#121417] dark:bg-white text-white dark:text-[#121417] border-[#121417] dark:border-white shadow-xs'
                    : 'bg-transparent text-[#495057] dark:text-[#AAAAAA] border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-[#121417] dark:hover:border-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search + Location + Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96]" />
              <input
                type="text"
                placeholder="Search title or company..."
                value={filters.search ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded-lg text-[#121417] dark:text-white placeholder:text-[#868E96] focus:outline-none focus:border-[#121417] dark:focus:border-white transition-colors"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96]" />
              <input
                type="text"
                placeholder="Filter by location..."
                value={filters.location ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded-lg text-[#121417] dark:text-white placeholder:text-[#868E96] focus:outline-none focus:border-[#121417] dark:focus:border-white transition-colors"
              />
            </div>

            <div className="relative">
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] pointer-events-none" />
              <select
                value={filters.expLevel ?? 'ANY'}
                onChange={(e) => setFilters((f) => ({ ...f, expLevel: e.target.value as JobListingFilters['expLevel'] }))}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded-lg text-[#121417] dark:text-white focus:outline-none focus:border-[#121417] dark:focus:border-white transition-colors cursor-pointer"
              >
                {EXP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#868E96]">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-semibold text-[#FD4A32] hover:text-[#e0432c] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Results count (when no active filters) */}
        {!hasActiveFilters && !isLoading && listings.length > 0 && (
          <p className="text-xs text-[#868E96] mb-4">
            {listings.length} listing{listings.length !== 1 ? 's' : ''} available
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E9ECEF] dark:bg-[#242424] flex items-center justify-center mb-4">
              <InboxIcon className="w-8 h-8 text-[#868E96]" />
            </div>
            <h3 className="text-sm font-bold text-[#121417] dark:text-white mb-1">
              {hasActiveFilters ? 'No listings match your filters' : 'No listings yet'}
            </h3>
            <p className="text-xs text-[#868E96] max-w-xs">
              {hasActiveFilters
                ? 'Try adjusting your search or clearing the filters.'
                : 'New opportunities will be posted here soon. Check back later!'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-xs font-bold rounded-lg bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  );
}
