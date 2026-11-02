import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router';
import {
  MapPin, Briefcase, Star, Search, X, ChevronDown, ChevronRight,
  ExternalLink, Clock, Calendar, Tag, Loader2, InboxIcon, Bookmark,
  Share2, Code, Check, Building2, GraduationCap, ArrowRight,
  CheckCircle2, Flame, Award, Eye, AlertCircle, Globe
} from 'lucide-react';
import { jobsService } from '@/services/jobs.service';
import { bookmarkStore } from '@/services/stores/bookmarkStore';
import { useToast } from '@/contexts/ToastContext';
import type { JobListing, JobListingFilters, JobType, JobSortOption, WorkModeFilter } from '@/types/jobs';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRelativeTime(dateStr: string): string {
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

function getDeadlineInfo(deadline: string | null | undefined): {
  label: string;
  color: string;
  pulse: boolean;
  daysRemaining: number;
} | null {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null;
  if (diffDays < 2) {
    return {
      label: 'Closing soon!',
      color: 'text-red-700 bg-red-100 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
      pulse: true,
      daysRemaining: diffDays,
    };
  }
  if (diffDays <= 7) {
    return {
      label: `${diffDays}d left`,
      color: 'text-amber-800 bg-amber-100 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
      pulse: false,
      daysRemaining: diffDays,
    };
  }
  return {
    label: `${diffDays}d left`,
    color: 'text-emerald-800 bg-emerald-100 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    pulse: false,
    daysRemaining: diffDays,
  };
}

function formatExperience(min: number, max?: number | null): string {
  if (min === 0 && (!max || max === 0)) return 'Fresher';
  if (!max) return `${min}+ yrs`;
  if (min === max) return `${min} yr${min > 1 ? 's' : ''}`;
  return `${min}–${max} yrs`;
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
    <div className="rounded-2xl p-5 bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] space-y-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#202020] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 dark:bg-[#202020] rounded w-3/4" />
          <div className="h-3 bg-gray-100 dark:bg-[#202020] rounded w-1/2" />
          <div className="h-3 bg-gray-100 dark:bg-[#202020] rounded w-2/3" />
        </div>
      </div>
      <div className="h-px bg-gray-100 dark:bg-[#202020] w-full" />
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-100 dark:bg-[#202020] rounded w-1/3" />
        <div className="h-7 bg-gray-100 dark:bg-[#202020] rounded-full w-24" />
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: JobListing;
  isSelected?: boolean;
  onSelect: (job: JobListing) => void;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
}

function JobCard({ job, isSelected, onSelect, onClose, isBookmarked, onToggleBookmark }: JobCardProps) {
  const expLabel = useMemo(() => formatExperience(job.experience_min, job.experience_max), [job.experience_min, job.experience_max]);
  const relativeTime = useMemo(() => getRelativeTime(job.created_at), [job.created_at]);
  const deadline = useMemo(() => getDeadlineInfo(job.deadline), [job.deadline]);

  return (
    <div
      onClick={() => {
        if (isSelected) {
          onClose();
        } else {
          onSelect(job);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isSelected) onClose();
          else onSelect(job);
        }
      }}
      className={`group relative rounded-2xl p-4 sm:p-5 transition-[border-color,box-shadow] duration-150 cursor-pointer select-none text-left flex flex-col justify-between ${
        // Clean high-contrast card background matching MockFolder style
        'bg-white dark:bg-[#141414] text-[#121417] dark:text-white'
      } ${
        isSelected
          ? 'border-2 border-emerald-500 dark:border-emerald-500 bg-emerald-50/15 dark:bg-emerald-950/20 shadow-sm'
          : 'border border-[#E9ECEF] dark:border-[#242424] hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Header Row: Logo + Info + Bookmark button */}
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Logo container: full space occupation, no double borders */}
            <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              {job.company_logo_url ? (
                <img
                  src={job.company_logo_url}
                  alt={job.company_name}
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.style.display = 'none';
                    const fallback = t.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full flex items-center justify-center bg-gray-900 dark:bg-black ${job.company_logo_url ? 'hidden' : ''}`}
              >
                <Code className="w-5 h-5 text-[#0EA5E9] stroke-[2.5]" />
              </div>

              {/* Green online/active dot */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#22C55E] rounded-full ring-2 ring-white dark:ring-[#141414]" />
            </div>

            {/* Title & Company */}
            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-[#121417] dark:text-white leading-snug truncate">
                  {job.title}
                </h3>
                {job.is_featured && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 border border-amber-500 shadow-2xs">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-[#495057] dark:text-[#AAAAAA] truncate mt-0.5">
                {job.company_name}
              </p>

              {/* Location & Salary inline metadata */}
              <div className="flex items-center gap-3 text-xs mt-1.5 flex-wrap text-[#6C757D] dark:text-[#888888]">
                <div className="flex items-center gap-1 min-w-0 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#868E96]" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-0.5 font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  <span className="font-semibold text-xs">₹</span>
                  <span>{job.stipend_or_salary || 'Competitive'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Right Bookmark Button */}
          <button
            type="button"
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isBookmarked
                ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                : 'bg-[#F1F3F5] hover:bg-[#E9ECEF] dark:bg-[#202020] dark:hover:bg-[#2A2A2A] text-[#495057] dark:text-[#AAAAAA]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Subtle Divider Line */}
        <div className="border-t border-[#E9ECEF] dark:border-[#242424] my-3" />
      </div>

      {/* Bottom Metadata & Action Button */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2.5 text-xs text-[#6C757D] dark:text-[#888888] flex-wrap">
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span>{expLabel}</span>
          </div>
          {relativeTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{relativeTime}</span>
            </div>
          )}
          {deadline && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${deadline.color} ${deadline.pulse ? 'animate-pulse' : ''}`}>
              {deadline.label}
            </span>
          )}
        </div>

        {/* Action Button: "Close" when active, "View Details" when inactive */}
        {isSelected ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-400 dark:border-rose-900/60 transition-all shadow-2xs cursor-pointer"
            title="Close details"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Close</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(job);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F8F9FA] dark:bg-[#1E1E1E] hover:bg-[#121417] hover:text-white dark:hover:bg-white dark:hover:text-[#121417] text-[#121417] dark:text-white transition-all border border-[#E9ECEF] dark:border-[#2A2A2A] shadow-2xs group-hover:border-zinc-400 cursor-pointer"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Smart Job Description Arranger / Formatter ──────────────────────────────

interface JobDescriptionViewerProps {
  description?: string | null;
}

function JobDescriptionViewer({ description }: JobDescriptionViewerProps) {
  if (!description || description.trim().length === 0) {
    return (
      <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#242424]">
        <p className="text-xs text-[#868E96] italic">
          No formal description provided. Click &quot;Apply on Official Website&quot; above to view comprehensive job responsibilities, eligibility requirements, and interview rounds.
        </p>
      </div>
    );
  }

  // Split lines, trim, and filter empties
  const rawLines = description.split('\n').map((l) => l.trim()).filter(Boolean);

  const isHeading = (line: string): boolean => {
    // Ends with a colon (e.g., "Educational Qualification:" or "Responsibilities:")
    if (/^[A-Za-z0-9\s&/'-]+:$/.test(line)) return true;

    const lower = line.toLowerCase().replace(/[:\-–]/g, '').trim();
    const commonHeadings = [
      'about the role', 'about the job', 'about the company', 'about niit',
      'role overview', 'job overview', 'position summary', 'job summary',
      'educational qualification', 'educational qualifications', 'education',
      'academic qualification', 'academic qualifications', 'eligibility',
      'eligibility criteria', 'experience', 'work experience', 'experience required',
      'responsibilities', 'key responsibilities', 'roles & responsibilities',
      'roles and responsibilities', 'what you will do', 'what you\'ll do',
      'day to day responsibilities', 'requirements', 'minimum requirements',
      'basic qualifications', 'preferred qualifications', 'skills required',
      'technical skills', 'key skills', 'competencies', 'core competencies',
      'what we are looking for', 'who you are', 'who should apply',
      'benefits', 'perks', 'perks & benefits', 'perks and benefits',
      'selection process', 'interview process', 'location', 'work mode',
      'stipend and perks', 'compensation and benefits',
    ];

    if (commonHeadings.includes(lower)) return true;

    // Short line (<= 40 chars) written in ALL CAPS with no trailing period
    if (line.length <= 40 && !line.endsWith('.') && line.toUpperCase() === line && /[A-Z]{3,}/.test(line)) {
      return true;
    }

    return false;
  };

  const isBulletItem = (line: string): boolean => {
    // Explicit bullet or number prefixes
    if (/^([•\-\*›▪▫–\+]|\d+[\.\)]|\([a-zA-Z0-9]+\))\s+/.test(line)) return true;

    // Typical responsibilities or qualifications sentences starting with action verbs or requirement terms
    const lower = line.toLowerCase();
    const actionVerbs = [
      'participate', 'debug', 'test', 'stay', 'contribute', 'develop', 'design',
      'implement', 'build', 'collaborate', 'maintain', 'create', 'work', 'ensure',
      'lead', 'analyze', 'support', 'write', 'assist', 'manage', 'understand',
      'coordinate', 'perform', 'review', 'execute', 'monitor', 'optimize',
      'troubleshoot', 'deploy', 'automate', 'architect', 'research',
    ];
    const firstWord = lower.split(/[\s,]+/)[0];
    if (firstWord && actionVerbs.includes(firstWord)) return true;

    if (/^(0|1|2|3|4|5|bachelor|master|b\.tech|b\.e|m\.tech|mca|degree|strong|basic|good|excellent|proven|hands-on|knowledge|proficiency|experience|familiarity|understanding|ability|must have|should have|responsible for)\b/i.test(line)) {
      return true;
    }

    return false;
  };

  const cleanBullet = (line: string): string => {
    return line.replace(/^([•\-\*›▪▫–\+]|\d+[\.\)]|\([a-zA-Z0-9]+\))\s*/, '').trim();
  };

  interface Block {
    type: 'heading' | 'list' | 'paragraph';
    title?: string;
    items?: string[];
    text?: string;
  }

  const blocks: Block[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: 'list', items: [...currentList] });
      currentList = [];
    }
  };

  for (const line of rawLines) {
    if (isHeading(line)) {
      flushList();
      blocks.push({ type: 'heading', title: line.replace(/[:]+$/, '') });
    } else if (isBulletItem(line)) {
      currentList.push(cleanBullet(line));
    } else {
      flushList();
      blocks.push({ type: 'paragraph', text: line });
    }
  }
  flushList();

  return (
    <div className="p-5 rounded-2xl bg-[#FDFDFD] dark:bg-[#161616] border border-[#E9ECEF] dark:border-[#242424] space-y-4">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          return (
            <div
              key={idx}
              className="flex items-center gap-2 pt-4 border-t border-[#E9ECEF] dark:border-[#242424] first:pt-0 first:border-0"
            >
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full shrink-0" />
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#121417] dark:text-white">
                {block.title}
              </h4>
            </div>
          );
        }

        if (block.type === 'list' && block.items) {
          return (
            <ul key={idx} className="space-y-2.5 pl-1">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#343A40] dark:text-[#D1D5DB] leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-2 shrink-0" />
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={idx}
            className="text-xs sm:text-[13px] text-[#495057] dark:text-[#CCCCCC] leading-relaxed"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

// ─── Job Details Master-Detail Pane (LinkedIn & Indeed Style) ──────────────────

interface JobDetailPaneProps {
  job: JobListing;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
}

function JobDetailPane({ job, onClose, isBookmarked, onToggleBookmark, onShare }: JobDetailPaneProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const expLabel = useMemo(() => formatExperience(job.experience_min, job.experience_max), [job.experience_min, job.experience_max]);
  const relativeTime = useMemo(() => getRelativeTime(job.created_at), [job.created_at]);
  const deadline = useMemo(() => getDeadlineInfo(job.deadline), [job.deadline]);

  // Reset inner scroll whenever a different job is selected
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [job.id]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl shadow-xl overflow-hidden">
      {/* Sticky Header Top Bar (Solid background to eliminate GPU backdrop-blur scroll lag) */}
      <div className="shrink-0 px-6 py-4 bg-white dark:bg-[#141414] border-b border-[#E9ECEF] dark:border-[#242424] flex items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Active Opportunity
          </span>
          {deadline && (
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${deadline.color}`}>
              {deadline.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Share Button */}
          <button
            type="button"
            onClick={onShare}
            className="p-2 rounded-xl text-[#495057] dark:text-[#AAAAAA] hover:text-[#121417] dark:hover:text-white hover:bg-[#F1F3F5] dark:hover:bg-[#202020] transition-colors"
            title="Share this listing"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                : 'text-[#495057] dark:text-[#AAAAAA] hover:text-[#121417] dark:hover:text-white hover:bg-[#F1F3F5] dark:hover:bg-[#202020]'
            }`}
            title={isBookmarked ? 'Saved to bookmarks' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Prominent CLOSE BUTTON (X) */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#222222] dark:hover:bg-[#2E2E2E] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all shadow-xs"
            title="Close details (Esc)"
            aria-label="Close details"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body (Hardware-accelerated on GPU compositor layer) */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-6 pb-20 space-y-6 custom-scrollbar transform-gpu [will-change:scroll-position]"
      >
        {/* Company & Role Hero */}
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            {job.company_logo_url ? (
              <img
                src={job.company_logo_url}
                alt={job.company_name}
                className="w-full h-full object-contain p-0.5"
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  t.style.display = 'none';
                  const fallback = t.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center bg-gray-900 dark:bg-black ${job.company_logo_url ? 'hidden' : ''}`}>
              <Code className="w-8 h-8 text-[#0EA5E9] stroke-[2.5]" />
            </div>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#22C55E] rounded-full ring-2 ring-white dark:ring-[#141414]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-[#121417] dark:text-white leading-tight">
                {job.title}
              </h2>
            </div>
            <p className="text-sm font-bold text-[#495057] dark:text-[#BBBBBB] mt-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{job.company_name}</span>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            </p>

            <div className="flex items-center gap-3 text-xs text-[#868E96] dark:text-[#999999] mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                {job.type === 'JOB' ? 'Full-Time Role' : 'Internship'}
              </span>
              {relativeTime && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Posted {relativeTime}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A]">
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all shadow-md group"
          >
            <span>Apply on Official Website</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <button
            type="button"
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white dark:bg-[#222222] text-[#495057] dark:text-[#CCCCCC] border-[#E9ECEF] dark:border-[#333333] hover:border-black dark:hover:border-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Key Highlights Grid */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#868E96] mb-3">
            Key Job Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A]">
              <span className="text-[10px] font-bold text-[#868E96] uppercase tracking-wider block mb-1">
                Experience
              </span>
              <p className="text-sm font-extrabold text-[#121417] dark:text-white">{expLabel}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A]">
              <span className="text-[10px] font-bold text-[#868E96] uppercase tracking-wider block mb-1">
                Job Type
              </span>
              <p className="text-sm font-extrabold text-[#121417] dark:text-white">
                {job.type === 'JOB' ? 'Full Time' : 'Internship'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A]">
              <span className="text-[10px] font-bold text-[#868E96] uppercase tracking-wider block mb-1">
                Compensation
              </span>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {job.stipend_or_salary || 'Competitive'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A]">
              <span className="text-[10px] font-bold text-[#868E96] uppercase tracking-wider block mb-1">
                Deadline
              </span>
              <p className="text-sm font-extrabold text-[#121417] dark:text-white">
                {deadline ? deadline.label : 'Open until filled'}
              </p>
            </div>
          </div>
        </div>

        {/* Tags & Skills */}
        {job.tags && job.tags.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#868E96] mb-2.5">
              Target Skills &amp; Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F1F3F5] dark:bg-[#202020] text-[#121417] dark:text-[#E0E0E0] border border-[#E9ECEF] dark:border-[#2E2E2E]"
                >
                  <Tag className="w-3 h-3 text-[#868E96]" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Description with Smart Arranger */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#868E96] mb-3">
            About the Role &amp; Description
          </h3>
          <JobDescriptionViewer description={job.description} />
        </div>

        {/* MockFolder Placement Preparation Callout */}
        <div className="p-6 rounded-2xl bg-[#F8F9FA] dark:bg-[#161616] border border-[#E9ECEF] dark:border-[#242424] relative overflow-hidden shadow-xs">
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E9ECEF] dark:border-[#2A2A2A] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 stroke-[2.2] text-[#FD4A32]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-[#FD4A32] bg-[#FD4A32]/10 border border-[#FD4A32]/20 mb-1">
                MockFolder Placement Suite
              </div>
              <h4 className="text-base sm:text-lg font-black text-[#121417] dark:text-white leading-tight">
                Preparing for {job.company_name}?
              </h4>
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-[#495057] dark:text-[#A0AEC0] leading-relaxed">
            Boost your interview selection chances by practicing simulated company mock tests and topic-wise aptitude questions on MockFolder.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
            <Link
              to="/aptitude"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#202020] border border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-[#121417] dark:hover:border-white hover:shadow-xs transition-all group"
            >
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#121417] dark:text-white block truncate group-hover:text-[#FD4A32] transition-colors">
                  Practice Aptitude
                </span>
                <span className="text-[10px] text-[#868E96] block truncate">
                  Topic MCQs &amp; OA Tests
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#868E96] group-hover:text-[#FD4A32] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>

            <Link
              to="/technical"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#202020] border border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-[#121417] dark:hover:border-white hover:shadow-xs transition-all group"
            >
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#121417] dark:text-white block truncate group-hover:text-[#FD4A32] transition-colors">
                  Coding Workspace
                </span>
                <span className="text-[10px] text-[#868E96] block truncate">
                  Compiler &amp; DSA Bank
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#868E96] group-hover:text-[#FD4A32] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>

            <Link
              to="/experiences"
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#202020] border border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-[#121417] dark:hover:border-white hover:shadow-xs transition-all group"
            >
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#121417] dark:text-white block truncate group-hover:text-[#FD4A32] transition-colors">
                  Interview Archive
                </span>
                <span className="text-[10px] text-[#868E96] block truncate">
                  Real Drive Insights
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#868E96] group-hover:text-[#FD4A32] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          </div>
        </div>

        {/* Generous bottom spacer to ensure card never hugs or gets clipped by container bounds */}
        <div className="h-6" aria-hidden="true" />
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

const TYPE_OPTIONS: { label: string; value: 'ALL' | JobType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Full-time', value: 'JOB' },
  { label: 'Internships', value: 'INTERNSHIP' },
];

const WORK_MODE_OPTIONS: { label: string; value: WorkModeFilter }[] = [
  { label: 'Workplace: All', value: 'ALL' },
  { label: '🌐 Remote Only', value: 'REMOTE' },
  { label: '🏢 Hybrid', value: 'HYBRID' },
  { label: '📍 On-site', value: 'ON_SITE' },
];

const EXP_OPTIONS: { label: string; value: JobListingFilters['expLevel'] }[] = [
  { label: 'Experience: Any', value: 'ANY' },
  { label: '🎓 Fresher (0 yr)', value: 'FRESHER' },
  { label: '0–2 yrs', value: '0-2' },
  { label: '2–5 yrs', value: '2-5' },
  { label: '5+ yrs', value: '5+' },
];

const DOMAIN_OPTIONS: { label: string; value: string }[] = [
  { label: 'Role: All Domains', value: 'ALL' },
  { label: '💻 Software Engineer', value: 'software' },
  { label: '🎨 Frontend / Web', value: 'frontend' },
  { label: '⚙️ Backend / API', value: 'backend' },
  { label: '⚡ Full Stack', value: 'full' },
  { label: '📊 Data & AI / ML', value: 'data' },
  { label: '☁️ Cloud & DevOps', value: 'cloud' },
  { label: '🧪 QA & Testing', value: 'qa' },
];

const SORT_OPTIONS: { label: string; value: JobSortOption }[] = [
  { label: 'Recommended', value: 'RECOMMENDED' },
  { label: 'Newest Added', value: 'NEWEST' },
  { label: 'Closing Soonest', value: 'CLOSING_SOON' },
];

export default function JobsPage() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [filters, setFilters] = useState<JobListingFilters>({
    type: 'ALL',
    location: '',
    workMode: 'ALL',
    expLevel: 'ANY',
    tag: 'ALL',
    search: '',
    sortBy: 'RECOMMENDED',
    closingSoonOnly: false,
  });

  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => searchParams.get('jobId'));
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set(bookmarkStore.getBookmarkedJobIds()));
  const splitContainerRef = React.useRef<HTMLDivElement>(null);

  const handleSelectJob = useCallback((job: JobListing) => {
    setSelectedJobId(job.id);
  }, []);

  // Sync Bookmarks from local & remote store
  useEffect(() => {
    const handleBookmarkChange = () => {
      setBookmarkedIds(new Set(bookmarkStore.getBookmarkedJobIds()));
    };

    window.addEventListener('prepunite_bookmarks_changed', handleBookmarkChange);
    return () => {
      window.removeEventListener('prepunite_bookmarks_changed', handleBookmarkChange);
    };
  }, []);

  // Fetch Live Active Job Listings
  const { data: listings = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['job_listings'],
    queryFn: () => jobsService.getActiveListings(),
    staleTime: 5 * 60 * 1000,
  });

  // Keep URL param in sync with selectedJobId
  useEffect(() => {
    if (selectedJobId) {
      searchParams.set('jobId', selectedJobId);
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.delete('jobId');
      setSearchParams(searchParams, { replace: true });
    }
  }, [selectedJobId, searchParams, setSearchParams]);

  // Handle Escape key to close the detail pane
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedJobId) {
        setSelectedJobId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedJobId]);

  // Filter & Sort Logic
  const filtered = useMemo(() => {
    const nowMs = Date.now();
    const result = listings.filter((job) => {
      if (!job.is_active) return false;
      if (job.deadline && new Date(job.deadline).getTime() < nowMs) return false;

      // Saved only toggle
      if (savedOnly && !bookmarkedIds.has(job.id)) return false;

      // Closing soon only filter (< 3 days)
      if (filters.closingSoonOnly) {
        if (!job.deadline) return false;
        const diffDays = Math.ceil((new Date(job.deadline).getTime() - nowMs) / (1000 * 60 * 60 * 24));
        if (diffDays > 3) return false;
      }

      // Type filter
      if (filters.type && filters.type !== 'ALL' && job.type !== filters.type) return false;

      // Search filter
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const inTitle = job.title.toLowerCase().includes(q);
        const inCompany = job.company_name.toLowerCase().includes(q);
        const inTags = Array.isArray(job.tags) && job.tags.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inCompany && !inTags) return false;
      }

      // Location filter
      if (filters.location) {
        const loc = filters.location.toLowerCase();
        if (!job.location.toLowerCase().includes(loc)) return false;
      }

      // Work Mode filter
      if (filters.workMode && filters.workMode !== 'ALL') {
        const loc = job.location.toLowerCase();
        const tagsStr = Array.isArray(job.tags) ? job.tags.join(' ').toLowerCase() : '';
        const isRemote = loc.includes('remote') || tagsStr.includes('remote');
        const isHybrid = loc.includes('hybrid') || tagsStr.includes('hybrid');

        if (filters.workMode === 'REMOTE' && !isRemote) return false;
        if (filters.workMode === 'HYBRID' && !isHybrid) return false;
        if (filters.workMode === 'ON_SITE' && (isRemote || isHybrid)) return false;
      }

      // Domain / Tag filter
      if (filters.tag && filters.tag !== 'ALL') {
        const target = filters.tag.toLowerCase();
        const inTags = Array.isArray(job.tags) && job.tags.some((t) => t.toLowerCase().includes(target));
        const inTitle = job.title.toLowerCase().includes(target);
        if (!inTags && !inTitle) return false;
      }

      // Experience filter
      if (!expMatchesFilter(job.experience_min, job.experience_max, filters.expLevel)) return false;

      return true;
    });

    const sort = filters.sortBy || 'RECOMMENDED';
    return [...result].sort((a, b) => {
      if (sort === 'NEWEST') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sort === 'CLOSING_SOON') {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      // RECOMMENDED: featured first, then sort_order, then newest
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [listings, filters, savedOnly, bookmarkedIds]);

  // Selected Job Object
  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return listings.find((j) => j.id === selectedJobId) || null;
  }, [selectedJobId, listings]);

  const toggleBookmark = useCallback((jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowBookmarked = bookmarkStore.toggleBookmarkJob(jobId);
    setBookmarkedIds(new Set(bookmarkStore.getBookmarkedJobIds()));
    if (isNowBookmarked) {
      toast.success('Job saved to your bookmarks!');
    } else {
      toast.info('Job removed from bookmarks.');
    }
  }, [toast]);

  const shareJob = useCallback((job: JobListing) => {
    const url = `${window.location.origin}/jobs?jobId=${job.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Direct listing link copied to clipboard!');
      }).catch(() => {
        toast.info(url);
      });
    } else {
      toast.info(url);
    }
  }, [toast]);

  const hasActiveFilters =
    filters.type !== 'ALL' ||
    Boolean(filters.search?.trim()) ||
    Boolean(filters.location?.trim()) ||
    (filters.workMode && filters.workMode !== 'ALL') ||
    (filters.expLevel && filters.expLevel !== 'ANY') ||
    (filters.tag && filters.tag !== 'ALL') ||
    Boolean(filters.closingSoonOnly) ||
    savedOnly;

  const clearFilters = () => {
    setFilters({
      type: 'ALL',
      location: '',
      workMode: 'ALL',
      expLevel: 'ANY',
      tag: 'ALL',
      search: '',
      sortBy: 'RECOMMENDED',
      closingSoonOnly: false,
    });
    setSavedOnly(false);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-8">
      {/* ── Page Header: Sleek & Focused ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 border border-[#E9ECEF] dark:border-[#2A2A2A] flex items-center justify-center shrink-0 shadow-2xs">
            <Briefcase className="w-5 h-5 text-[#FD4A32] stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-black text-[#121417] dark:text-white tracking-tight">
              Jobs &amp; Internships
            </h1>
            <p className="text-xs text-[#868E96] mt-0.5">
              Verified campus &amp; off-campus opportunities curated for students
            </p>
          </div>
        </div>

        {/* Live opportunity counter badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#868E96]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{listings.length} live opportunities</span>
        </div>
      </div>

      {/* ── Tier 1: Unified Command Search Bar (Indeed / LinkedIn Style) ── */}
      <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl p-1 sm:p-1.5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-[#E9ECEF] dark:divide-[#242424]">
          {/* Primary Search Input: Role / Skill / Company */}
          <div className="relative flex-1 py-1 px-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96]" />
            <input
              type="text"
              placeholder="Search by job title, skills (React, Python, SDE), or company..."
              value={filters.search ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full pl-7 pr-7 py-1 text-xs sm:text-sm bg-transparent text-[#121417] dark:text-white placeholder:text-[#868E96] focus:outline-none"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#868E96] hover:text-[#121417] dark:hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location Input: City / State / Remote */}
          <div className="relative md:w-72 py-1 px-3">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96]" />
            <input
              type="text"
              placeholder="City, state, or 'Remote'..."
              value={filters.location ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              className="w-full pl-7 pr-7 py-1 text-xs sm:text-sm bg-transparent text-[#121417] dark:text-white placeholder:text-[#868E96] focus:outline-none"
            />
            {filters.location && (
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, location: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#868E96] hover:text-[#121417] dark:hover:text-white cursor-pointer"
                title="Clear location"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Tier 2: Horizontal Filter Ribbon (Pills, Dropdowns, Toggles) ── */}
      <div className="flex items-center justify-between gap-2.5 mb-4 flex-wrap">
        {/* Left Side: Type segment + Dropdowns + Quick Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Segmented Type Switcher */}
          <div className="inline-flex items-center p-1 bg-[#F1F3F5] dark:bg-[#1A1A1A] rounded-xl border border-[#E9ECEF] dark:border-[#2A2A2A]">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, type: opt.value }))}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filters.type === opt.value
                    ? 'bg-white dark:bg-[#0C0C0C] text-[#121417] dark:text-white shadow-2xs'
                    : 'text-[#868E96] hover:text-[#121417] dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Workplace Mode Dropdown */}
          <div className="relative">
            <select
              value={filters.workMode || 'ALL'}
              onChange={(e) => setFilters((f) => ({ ...f, workMode: e.target.value as WorkModeFilter }))}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filters.workMode && filters.workMode !== 'ALL'
                  ? 'bg-[#121417] text-white dark:bg-white dark:text-[#121417] border-[#121417] dark:border-white shadow-2xs'
                  : 'bg-white dark:bg-[#141414] text-[#495057] dark:text-[#AAAAAA] border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-zinc-400'
              }`}
            >
              {WORK_MODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60" />
          </div>

          {/* Experience Dropdown */}
          <div className="relative">
            <select
              value={filters.expLevel || 'ANY'}
              onChange={(e) => setFilters((f) => ({ ...f, expLevel: e.target.value as JobListingFilters['expLevel'] }))}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filters.expLevel && filters.expLevel !== 'ANY'
                  ? 'bg-[#121417] text-white dark:bg-white dark:text-[#121417] border-[#121417] dark:border-white shadow-2xs'
                  : 'bg-white dark:bg-[#141414] text-[#495057] dark:text-[#AAAAAA] border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-zinc-400'
              }`}
            >
              {EXP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60" />
          </div>

          {/* Domain / Role Dropdown */}
          <div className="relative">
            <select
              value={filters.tag || 'ALL'}
              onChange={(e) => setFilters((f) => ({ ...f, tag: e.target.value }))}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filters.tag && filters.tag !== 'ALL'
                  ? 'bg-[#121417] text-white dark:bg-white dark:text-[#121417] border-[#121417] dark:border-white shadow-2xs'
                  : 'bg-white dark:bg-[#141414] text-[#495057] dark:text-[#AAAAAA] border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-zinc-400'
              }`}
            >
              {DOMAIN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60" />
          </div>

          {/* Closing Soon Toggle */}
          <button
            type="button"
            onClick={() => setFilters((f) => ({ ...f, closingSoonOnly: !f.closingSoonOnly }))}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              filters.closingSoonOnly
                ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                : 'bg-white dark:bg-[#141414] text-[#495057] dark:text-[#AAAAAA] border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-rose-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Closing Soon</span>
          </button>

          {/* Saved Jobs Toggle */}
          <button
            type="button"
            onClick={() => setSavedOnly((s) => !s)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              savedOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                : 'bg-white dark:bg-[#141414] text-[#495057] dark:text-[#AAAAAA] border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-amber-400'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedOnly ? 'fill-current' : ''}`} />
            <span>Saved ({bookmarkedIds.size})</span>
          </button>

          {/* Reset Filters Chip (Visible only when filters active) */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#FD4A32] hover:bg-[#FD4A32]/10 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Side: Results Count & Sort Dropdown */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-[#868E96] hidden md:inline">
            <strong className="text-[#121417] dark:text-white font-bold">{filtered.length}</strong> opportunities
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#868E96] whitespace-nowrap">Sort:</span>
            <div className="relative">
              <select
                value={filters.sortBy || 'RECOMMENDED'}
                onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as JobSortOption }))}
                className="appearance-none pl-3 pr-7 py-1.5 text-xs font-bold bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded-xl text-[#121417] dark:text-white focus:outline-none cursor-pointer hover:border-zinc-400"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60" />
            </div>
          </div>
        </div>
      </div>

        {/* Master-Detail Layout (LinkedIn & Indeed Split View) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-[#141414] border border-rose-200 dark:border-rose-900/40 rounded-2xl p-8 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-[#121417] dark:text-white mb-1">
              Unable to load opportunities
            </h3>
            <p className="text-xs text-[#868E96] max-w-sm mb-4">
              {error instanceof Error ? error.message : 'A temporary connection error occurred while retrieving job listings.'}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all shadow-sm"
            >
              Retry Connection
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-[#F1F3F5] dark:bg-[#242424] flex items-center justify-center mb-4">
              <InboxIcon className="w-8 h-8 text-[#868E96]" />
            </div>
            <h3 className="text-base font-extrabold text-[#121417] dark:text-white mb-1">
              {hasActiveFilters ? 'No opportunities match your filters' : 'No listings currently active'}
            </h3>
            <p className="text-xs text-[#868E96] max-w-sm mb-4">
              {hasActiveFilters
                ? 'Try broadening your search keyword, changing the location, or resetting filters.'
                : 'Verified full-time and internship openings are published regularly. Check back soon!'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] dark:hover:text-white transition-all shadow-sm"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div ref={splitContainerRef} className={`scroll-mt-4 ${selectedJob ? 'lg:flex lg:gap-6 items-start' : ''}`}>
            {/* Left Column: Job Cards List */}
            <div
              className={
                selectedJob
                  ? 'lg:w-[42%] xl:w-[38%] space-y-3.5 lg:h-[calc(100vh-2.5rem)] min-h-[580px] overflow-y-auto pr-2 custom-scrollbar transform-gpu [will-change:scroll-position]'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
              }
            >
              {filtered.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onSelect={handleSelectJob}
                  onClose={() => setSelectedJobId(null)}
                  isBookmarked={bookmarkedIds.has(job.id)}
                  onToggleBookmark={(e) => toggleBookmark(job.id, e)}
                />
              ))}
            </div>

            {/* Right Column: Desktop Detail Pane (Independent scroll, Closable) */}
            {selectedJob && (
              <div className="hidden lg:block lg:w-[58%] xl:w-[62%] lg:h-[calc(100vh-2.5rem)] min-h-[580px] sticky top-4">
                <JobDetailPane
                  job={selectedJob}
                  onClose={() => setSelectedJobId(null)}
                  isBookmarked={bookmarkedIds.has(selectedJob.id)}
                  onToggleBookmark={() => toggleBookmark(selectedJob.id)}
                  onShare={() => shareJob(selectedJob)}
                />
              </div>
            )}

            {/* Mobile / Tablet Drawer (Slide-Over, Closable) */}
            {selectedJob && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
                <div className="w-full max-w-lg h-full bg-white dark:bg-[#141414] shadow-2xl overflow-hidden flex flex-col">
                  <JobDetailPane
                    job={selectedJob}
                    onClose={() => setSelectedJobId(null)}
                    isBookmarked={bookmarkedIds.has(selectedJob.id)}
                    onToggleBookmark={() => toggleBookmark(selectedJob.id)}
                    onShare={() => shareJob(selectedJob)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
}
