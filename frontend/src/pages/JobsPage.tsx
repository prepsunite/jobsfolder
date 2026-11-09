import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router';
import {
  MapPin, Briefcase, Star, Search, X, ChevronDown, ChevronRight,
  ExternalLink, Clock, Calendar, Tag, Loader2, InboxIcon, Bookmark,
  Share2, Code, Check, Building2, GraduationCap, ArrowRight,
  CheckCircle2, Flame, Award, Eye, AlertCircle, Globe, RotateCcw
} from 'lucide-react';
import { jobsService } from '@/services/jobs.service';
import { bookmarkStore } from '@/services/stores/bookmarkStore';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import ContentRenderer from '@/components/ContentRenderer';
import { prepareJobDescriptionMarkdown } from '@/utils/jobDescription';
import CompanyLogo from '@/components/CompanyLogo';
import { verifyFresherEligibility } from '@/utils/jobExperience';
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

function getApplyButtonLabel(url: string | undefined): string {
  if (!url) return 'Apply Now';
  const lower = url.toLowerCase();
  if (lower.includes('linkedin.com')) return 'Apply on LinkedIn';
  if (lower.includes('glassdoor.')) return 'Apply on Glassdoor';
  if (lower.includes('indeed.')) return 'Apply on Indeed';
  if (lower.includes('naukri.com')) return 'Apply on Naukri';
  if (
    lower.includes('greenhouse.io') ||
    lower.includes('lever.co') ||
    lower.includes('workday.com') ||
    lower.includes('myworkdayjobs.com') ||
    lower.includes('smartrecruiters.com') ||
    lower.includes('ashbyhq.com') ||
    lower.includes('bamboohr.com') ||
    lower.includes('rippling.com')
  ) {
    return 'Apply on Company Portal';
  }
  return 'Apply Now';
}

function expMatchesFilter(
  min: number,
  max: number | null | undefined,
  level: JobListingFilters['expLevel'],
  jobTitle?: string,
  jobDesc?: string | null
): boolean {
  // 1. Dual-Layer Text & Seniority Shield: Reject any job requiring >= 2 YOE or with senior title
  if (jobTitle) {
    const check = verifyFresherEligibility({
      title: jobTitle,
      description: jobDesc,
      experience_min: min,
      experience_max: max,
    });
    if (!check.isFresher) return false;
  }

  // 2. Strict Fresher Rule: Prepunite listings must be <= 1 YOE
  if (min > 1) return false;

  if (!level || level === 'ANY') return true;
  if (level === 'FRESHER') return min === 0 && (!max || max === 0);
  if (level === '0-2') return min <= 1 && (!max || max <= 1);
  return true;
}

// ─── Location & Geographic Intelligence ──────────────────────────────────────

const LOCATION_SYNONYMS: Record<string, string[]> = {
  haryana: ['gurgaon', 'gurugram', 'faridabad', 'panchkula', 'manesar', 'sonipat', 'rohtak', 'karnal', 'haryana', 'ncr', 'delhi ncr'],
  gurgaon: ['gurgaon', 'gurugram', 'haryana', 'ncr', 'delhi ncr', 'manesar'],
  gurugram: ['gurgaon', 'gurugram', 'haryana', 'ncr', 'delhi ncr', 'manesar'],
  manesar: ['manesar', 'gurgaon', 'gurugram', 'haryana', 'ncr'],
  faridabad: ['faridabad', 'haryana', 'ncr', 'delhi ncr'],
  panchkula: ['panchkula', 'haryana', 'chandigarh'],

  delhi: ['delhi', 'new delhi', 'ncr', 'delhi ncr', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad'],
  'new delhi': ['delhi', 'new delhi', 'ncr', 'delhi ncr'],
  ncr: ['delhi', 'new delhi', 'noida', 'greater noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad', 'haryana', 'uttar pradesh'],
  'delhi ncr': ['delhi', 'new delhi', 'noida', 'greater noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad', 'haryana', 'uttar pradesh'],

  noida: ['noida', 'greater noida', 'uttar pradesh', 'up', 'ncr', 'delhi ncr', 'ghaziabad'],
  'greater noida': ['noida', 'greater noida', 'uttar pradesh', 'up', 'ncr', 'delhi ncr'],
  'uttar pradesh': ['noida', 'greater noida', 'lucknow', 'kanpur', 'ghaziabad', 'varanasi', 'agra', 'up'],
  up: ['noida', 'greater noida', 'lucknow', 'kanpur', 'ghaziabad', 'uttar pradesh'],
  lucknow: ['lucknow', 'uttar pradesh', 'up'],
  kanpur: ['kanpur', 'uttar pradesh', 'up'],
  ghaziabad: ['ghaziabad', 'noida', 'delhi', 'ncr', 'uttar pradesh'],

  karnataka: ['bengaluru', 'bangalore', 'mysore', 'mysuru', 'hubli', 'mangalore', 'mangaluru', 'karnataka', 'blr'],
  bengaluru: ['bengaluru', 'bangalore', 'karnataka', 'blr'],
  bangalore: ['bengaluru', 'bangalore', 'karnataka', 'blr'],
  blr: ['bengaluru', 'bangalore', 'karnataka'],
  mysore: ['mysore', 'mysuru', 'karnataka'],

  maharashtra: ['mumbai', 'pune', 'navi mumbai', 'thane', 'nagpur', 'nashik', 'maharashtra', 'mh'],
  mumbai: ['mumbai', 'navi mumbai', 'thane', 'maharashtra', 'bombay'],
  'navi mumbai': ['mumbai', 'navi mumbai', 'thane', 'maharashtra'],
  thane: ['mumbai', 'navi mumbai', 'thane', 'maharashtra'],
  pune: ['pune', 'hinjewadi', 'maharashtra'],
  nagpur: ['nagpur', 'maharashtra'],

  telangana: ['hyderabad', 'secunderabad', 'cyberabad', 'hitec city', 'telangana', 'hyd'],
  hyderabad: ['hyderabad', 'secunderabad', 'cyberabad', 'hitec city', 'telangana', 'hyd'],
  secunderabad: ['hyderabad', 'secunderabad', 'telangana'],
  cyberabad: ['hyderabad', 'cyberabad', 'telangana'],
  hyd: ['hyderabad', 'secunderabad', 'telangana'],

  'tamil nadu': ['chennai', 'coimbatore', 'madurai', 'trichy', 'tamil nadu', 'tn'],
  tn: ['chennai', 'coimbatore', 'tamil nadu'],
  chennai: ['chennai', 'tamil nadu', 'tn', 'madras'],
  coimbatore: ['coimbatore', 'tamil nadu', 'tn'],

  'west bengal': ['kolkata', 'calcutta', 'howrah', 'west bengal', 'wb'],
  wb: ['kolkata', 'west bengal'],
  kolkata: ['kolkata', 'calcutta', 'howrah', 'west bengal'],

  gujarat: ['ahmedabad', 'gandhinagar', 'surat', 'vadodara', 'baroda', 'gift city', 'gujarat'],
  ahmedabad: ['ahmedabad', 'gandhinagar', 'gujarat'],
  gandhinagar: ['ahmedabad', 'gandhinagar', 'gift city', 'gujarat'],

  kerala: ['kochi', 'cochin', 'thiruvananthapuram', 'trivandrum', 'kozhikode', 'calicut', 'kerala'],
  kochi: ['kochi', 'cochin', 'kerala'],
  trivandrum: ['thiruvananthapuram', 'trivandrum', 'kerala'],

  rajasthan: ['jaipur', 'jodhpur', 'udaipur', 'rajasthan'],
  jaipur: ['jaipur', 'rajasthan'],

  punjab: ['mohali', 'chandigarh', 'ludhiana', 'amritsar', 'punjab'],
  chandigarh: ['chandigarh', 'mohali', 'panchkula', 'punjab', 'haryana'],
  mohali: ['mohali', 'chandigarh', 'punjab'],

  remote: ['remote', 'work from home', 'wfh', 'pan-india', 'pan india', 'anywhere', 'virtual'],
  wfh: ['remote', 'work from home', 'wfh', 'pan-india', 'anywhere'],
  'work from home': ['remote', 'work from home', 'wfh', 'pan-india'],
};

function locationMatches(jobLocation: string | undefined | null, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!jobLocation) return false;

  const q = query.toLowerCase().trim();

  // Require at least 2 chars before applying location filter (prevents single-letter noise)
  if (q.length < 2) return true;

  const locNorm = jobLocation.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const qNorm = q.replace(/[^a-z0-9\s]/g, ' ').trim();

  // 1. Direct substring match (handles prefix typing: "del" → "delhi")
  if (locNorm.includes(qNorm)) return true;

  // 2. Tokenized query match (e.g. "gurgaon haryana" or "bangalore karnataka")
  const qTokens = qNorm.split(/\s+/).filter((t) => t.length >= 2);
  if (qTokens.length === 0) return true;

  const locTokens = locNorm.split(/\s+/).filter(Boolean);

  // Every token in query must be satisfied either directly or via region mappings
  // Synonym lookup only triggers on exact whole-word tokens (≥3 chars), not partial prefixes
  return qTokens.every((token) => {
    // Direct substring match on location (handles prefix typing)
    if (locNorm.includes(token)) return true;

    // Synonym expansion only for complete-enough tokens (≥3 chars) to avoid false positives
    if (token.length >= 3) {
      // Check query token's mapped regions
      const mapped = LOCATION_SYNONYMS[token];
      if (mapped && mapped.some((m) => locNorm.includes(m))) return true;

      // Check if any location word's synonym set contains this query token
      for (const locWord of locTokens) {
        const locMapped = LOCATION_SYNONYMS[locWord];
        if (locMapped && locMapped.some((m) => m === token || m.startsWith(token))) return true;
      }
    }

    return false;
  });
}

// ─── Skill & Multi-Field Search Intelligence ──────────────────────────────────

const SKILL_SYNONYMS: Record<string, string[]> = {
  python: ['python', 'py', 'django', 'fastapi', 'flask', 'pandas', 'numpy', 'pytorch'],
  py: ['python', 'py'],
  javascript: ['javascript', 'js', 'node', 'nodejs', 'react', 'typescript'],
  js: ['javascript', 'js', 'node', 'nodejs', 'react'],
  typescript: ['typescript', 'ts'],
  ts: ['typescript', 'ts'],
  cpp: ['c++', 'cpp'],
  'c++': ['c++', 'cpp'],
  csharp: ['c#', 'csharp', '.net', 'dotnet'],
  'c#': ['c#', 'csharp', '.net', 'dotnet'],
  java: ['java', 'spring', 'springboot', 'spring boot', 'hibernate', 'jvm'],
  react: ['react', 'reactjs', 'nextjs', 'next.js', 'frontend'],
  reactjs: ['react', 'reactjs', 'nextjs'],
  angular: ['angular', 'angularjs'],
  vue: ['vue', 'vuejs'],
  node: ['node', 'nodejs', 'express', 'nestjs', 'backend'],
  nodejs: ['node', 'nodejs', 'express', 'nestjs'],
  sql: ['sql', 'mysql', 'postgresql', 'postgres', 'oracle', 'database', 'rdbms'],
  nosql: ['nosql', 'mongodb', 'mongo', 'dynamodb', 'redis', 'cassandra'],
  mongo: ['mongodb', 'mongo', 'nosql'],
  mongodb: ['mongodb', 'mongo', 'nosql'],
  aws: ['aws', 'amazon web services', 'cloud', 'ec2', 's3', 'lambda'],
  cloud: ['cloud', 'aws', 'azure', 'gcp', 'google cloud', 'devops'],
  azure: ['azure', 'microsoft azure', 'cloud'],
  gcp: ['gcp', 'google cloud', 'cloud'],
  devops: ['devops', 'ci/cd', 'docker', 'kubernetes', 'k8s', 'terraform', 'jenkins'],
  docker: ['docker', 'container', 'kubernetes', 'k8s'],
  kubernetes: ['kubernetes', 'k8s', 'docker'],
  ai: ['ai', 'artificial intelligence', 'ml', 'machine learning', 'llm', 'genai', 'nlp'],
  ml: ['machine learning', 'ml', 'deep learning', 'data science', 'ai'],
  data: ['data', 'data science', 'data analytics', 'data engineer', 'analyst', 'sql', 'python'],
  qa: ['qa', 'quality assurance', 'testing', 'tester', 'automation', 'selenium', 'cypress', 'playwright', 'manual testing'],
  sde: ['sde', 'software engineer', 'software development engineer', 'developer', 'programmer'],
  frontend: ['frontend', 'front-end', 'ui', 'ux', 'web developer', 'react', 'vue', 'angular', 'javascript'],
  backend: ['backend', 'back-end', 'server', 'api', 'microservices', 'node', 'java', 'golang', 'python', 'spring'],
  fullstack: ['fullstack', 'full-stack', 'full stack', 'mern', 'mean'],
  dsa: ['dsa', 'data structures', 'algorithms', 'problem solving', 'leetcode'],
  fresher: ['fresher', 'freshers', 'entry level', 'graduate', '0-1', 'intern', 'trainee', 'campus'],
};

function jobMatchesSearch(job: JobListing, query: string): boolean {
  if (!query || !query.trim()) return true;

  const q = query.toLowerCase().trim();

  // Require at least 2 chars before filtering (avoids noise on first keystroke)
  if (q.length < 2) return true;

  const tagsStr = Array.isArray(job.tags) ? job.tags.join(' ') : '';
  // ⚠️ Deliberately excludes job.location — location filtering is handled
  // by the separate location field. Including it here caused location names
  // typed in the main search bar to return misleading results.
  const corpus = [
    job.title,
    job.company_name,
    job.stipend_or_salary || '',
    tagsStr,
    job.description || '',
    job.type === 'JOB' ? 'full-time full time job' : 'internship intern',
  ]
    .join(' ')
    .toLowerCase();

  // If entire query matches in corpus directly
  if (corpus.includes(q)) return true;

  // Tokenized search: every word must match
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  return tokens.every((token) => {
    // Direct token substring
    if (corpus.includes(token)) return true;

    // Skill synonym expansion (only for exact-keyword tokens in our dictionary)
    const skillSyns = SKILL_SYNONYMS[token];
    if (skillSyns && skillSyns.some((syn) => corpus.includes(syn))) return true;

    return false;
  });
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
  const expCheck = useMemo(
    () =>
      verifyFresherEligibility({
        title: job.title,
        description: job.description,
        experience_min: job.experience_min,
        experience_max: job.experience_max,
      }),
    [job.title, job.description, job.experience_min, job.experience_max]
  );
  const expLabel = useMemo(() => {
    if (!expCheck.isFresher && expCheck.minYears >= 2) {
      return `${expCheck.minYears}+ yrs`;
    }
    return formatExperience(expCheck.minYears, expCheck.maxYears);
  }, [expCheck]);
  const relativeTime = useMemo(() => getRelativeTime(job.created_at), [job.created_at]);
  const deadline = useMemo(() => getDeadlineInfo(job.deadline), [job.deadline]);

  return (
    <div
      id={`job-card-${job.id}`}
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
          ? 'border-2 border-[#121417] dark:border-white bg-[#F8F9FA] dark:bg-[#1A1A1A] shadow-md'
          : 'border border-[#E9ECEF] dark:border-[#242424] hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Header Row: Logo + Info + Bookmark button */}
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Logo container: full space occupation with branded fallback */}
            <div className="relative shrink-0">
              <CompanyLogo
                logoUrl={job.company_logo_url}
                companyName={job.company_name}
                size="md"
              />
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
                <div className="flex items-center gap-0.5 font-bold text-[#121417] dark:text-white shrink-0">
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
  const formattedMarkdown = useMemo(() => {
    return prepareJobDescriptionMarkdown(description);
  }, [description]);

  if (!formattedMarkdown || formattedMarkdown.trim().length === 0) {
    return (
      <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#242424]">
        <p className="text-xs text-[#868E96] italic">
          No formal description provided. Click &quot;Apply Now&quot; above to view comprehensive job responsibilities, eligibility requirements, and interview rounds.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#FDFDFD] dark:bg-[#161616] border border-[#E9ECEF] dark:border-[#242424]">
      <ContentRenderer
        content={formattedMarkdown}
        className="text-xs sm:text-[13px] leading-relaxed prose-h3:text-sm sm:prose-h3:text-base prose-h3:font-extrabold prose-h3:text-[#121417] dark:prose-h3:text-white prose-h3:border-b prose-h3:border-[#E9ECEF] dark:prose-h3:border-[#242424] prose-h3:pb-2 prose-h3:pt-4 first:prose-h3:pt-0 prose-h4:text-xs sm:prose-h4:text-sm prose-h4:font-bold prose-h4:text-[#FD4A32] dark:prose-h4:text-[#FD4A32] prose-h4:mt-4 prose-h4:mb-1.5 prose-p:my-2 prose-p:text-[#495057] dark:prose-p:text-[#CCCCCC] prose-p:leading-relaxed prose-ul:my-2 prose-ul:space-y-1.5 prose-li:text-[#343A40] dark:prose-li:text-[#D1D5DB] prose-li:leading-relaxed prose-strong:font-bold prose-strong:text-[#121417] dark:prose-strong:text-white"
      />
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
  onApply: () => void;
}

function JobDetailPane({ job, onClose, isBookmarked, onToggleBookmark, onShare, onApply }: JobDetailPaneProps) {
  const { toast } = useToast();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const expCheck = useMemo(
    () =>
      verifyFresherEligibility({
        title: job.title,
        description: job.description,
        experience_min: job.experience_min,
        experience_max: job.experience_max,
      }),
    [job.title, job.description, job.experience_min, job.experience_max]
  );
  const expLabel = useMemo(() => {
    if (!expCheck.isFresher && expCheck.minYears >= 2) {
      return `${expCheck.minYears}+ yrs`;
    }
    return formatExperience(expCheck.minYears, expCheck.maxYears);
  }, [expCheck]);
  const relativeTime = useMemo(() => getRelativeTime(job.created_at), [job.created_at]);
  const deadline = useMemo(() => getDeadlineInfo(job.deadline), [job.deadline]);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reported, setReported] = React.useState(() => jobsService.hasReportedJob(job.id));

  const EXCLUDED_TAGS = useMemo(
    () =>
      new Set([
        'indeed', 'linkedin', 'glassdoor', 'jobboard', 'jobspy', 'jobicy',
        'freshers', 'fresher', '0-1 yoe', '0-1', '0-2 yoe', '1-2 yoe',
        'remote wfh', 'remote', 'india', 'pan-india', 'lead', 'telegram',
        'product giant', 'unicorn', 'it services', 'mass recruiter', 'fintech',
        'imported feed', 'active now', 'recent', 'off-campus', 'on-campus',
        'fresher 2024/2025', 'fresher 2025/2026', 'class of 2024 / 2025 / 2026 / 2027',
      ]),
    []
  );

  const displaySkills = useMemo(() => {
    if (!job.tags || !Array.isArray(job.tags)) return [];
    return job.tags.filter((t) => !EXCLUDED_TAGS.has(t.trim().toLowerCase()));
  }, [job.tags, EXCLUDED_TAGS]);

  // Sync reported status whenever a different job is selected
  React.useEffect(() => {
    setReported(jobsService.hasReportedJob(job.id));
    setReportOpen(false);
  }, [job.id]);

  // Reset inner scroll whenever a different job is selected
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [job.id]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl shadow-xl overflow-hidden">
      {/* Sticky Header Top Bar */}
      <div className="shrink-0 px-5 py-3.5 bg-white dark:bg-[#141414] border-b border-[#E9ECEF] dark:border-[#242424] flex items-center justify-between gap-3 z-10">
        {/* Left: deadline badge only (no fake "active" status) */}
        <div className="flex items-center gap-2">
          {deadline ? (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${deadline.color}`}>
              {deadline.label}
            </span>
          ) : (
            <span className="text-[11px] text-[#868E96]">
              {relativeTime ? `Posted ${relativeTime}` : 'Job Listing'}
            </span>
          )}
        </div>

        {/* Right: Report · Share · Bookmark · Close */}
        <div className="flex items-center gap-1">
          {/* Report button (Spam-proof: single submission per client) */}
          <div className="relative">
            {reported ? (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-rose-500 border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 cursor-default select-none"
                title="You have already reported this listing"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Reported</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setReportOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer text-[#868E96] border-[#E9ECEF] dark:border-[#2A2A2A] hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900/50 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  title="Report this listing"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Report</span>
                </button>

                {/* Report dropdown */}
                {reportOpen && (
                  <div className="absolute right-0 top-full mt-1.5 z-50 w-56 bg-white dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <p className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-[#868E96] border-b border-[#E9ECEF] dark:border-[#2A2A2A]">
                      Report this listing
                    </p>
                    {[
                      'No longer accepting applications',
                      'Position already filled / closed',
                      'Listing seems outdated',
                      'Incorrect or misleading info',
                      'Broken apply link',
                    ].map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={async () => {
                          setReported(true);
                          setReportOpen(false);
                          try {
                            await jobsService.submitJobReport({
                              job_id: job.id,
                              job_title: job.title,
                              company_name: job.company_name,
                              reason,
                            });
                            toast.success(`Feedback sent to admin: "${reason}". Thank you!`);
                          } catch (err: any) {
                            toast.info(err?.message || `Feedback noted: "${reason}". Thank you!`);
                          }
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-xs text-[#343A40] dark:text-[#D1D5DB] hover:bg-[#F8F9FA] dark:hover:bg-[#242424] hover:text-[#121417] dark:hover:text-white transition-colors cursor-pointer"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Share */}
          <button
            type="button"
            onClick={onShare}
            className="p-2 rounded-xl text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:bg-[#F1F3F5] dark:hover:bg-[#202020] transition-colors"
            title="Share this listing"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                : 'text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:bg-[#F1F3F5] dark:hover:bg-[#202020]'
            }`}
            title={isBookmarked ? 'Saved to bookmarks' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F1F3F5] hover:bg-[#E9ECEF] dark:bg-[#222222] dark:hover:bg-[#2E2E2E] text-[#495057] dark:text-[#AAAAAA] hover:text-[#121417] dark:hover:text-white transition-all"
            title="Close details (Esc)"
            aria-label="Close details"
          >
            <X className="w-4.5 h-4.5 stroke-[2]" />
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
          <CompanyLogo
            logoUrl={job.company_logo_url}
            companyName={job.company_name}
            size="lg"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-[#121417] dark:text-white leading-tight">
                {job.title}
              </h2>
            </div>
            <p className="text-sm font-bold text-[#495057] dark:text-[#BBBBBB] mt-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#868E96]" />
              <span>{job.company_name}</span>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            </p>

            <div className="flex items-center gap-3 text-xs text-[#868E96] dark:text-[#999999] mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {job.type === 'JOB' ? 'Full-Time Role' : 'Internship'}
              </span>
              {relativeTime && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Posted {relativeTime}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A]">
          <button
            type="button"
            onClick={onApply}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#2A2A2A] dark:hover:bg-[#F1F3F5] transition-all shadow-sm group cursor-pointer"
          >
            <span>{getApplyButtonLabel(job.apply_url)}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white dark:bg-[#222222] text-[#495057] dark:text-[#CCCCCC] border-[#E9ECEF] dark:border-[#333333] hover:border-[#121417] dark:hover:border-white'
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
              <p className="text-sm font-extrabold text-[#121417] dark:text-white">
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
        {displaySkills.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#868E96] mb-2.5">
              Target Skills &amp; Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {displaySkills.map((tag) => (
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
            <div className="w-10 h-10 rounded-xl bg-[#FD4A32]/10 border border-[#FD4A32]/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 stroke-[2.2] text-[#FD4A32]" />
            </div>
            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#FD4A32] bg-[#FD4A32]/10 border border-[#FD4A32]/20 mb-1">
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
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#202020] border border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-[#FD4A32]/40 dark:hover:border-[#FD4A32]/40 hover:bg-[#FD4A32]/[0.02] hover:shadow-xs transition-all group"
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
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#202020] border border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-[#FD4A32]/40 dark:hover:border-[#FD4A32]/40 hover:bg-[#FD4A32]/[0.02] hover:shadow-xs transition-all group"
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
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#202020] border border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-[#FD4A32]/40 dark:hover:border-[#FD4A32]/40 hover:bg-[#FD4A32]/[0.02] hover:shadow-xs transition-all group"
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
  { label: 'Experience: All Freshers (0–1 yr)', value: 'ANY' },
  { label: '🎓 Fresher Only (0 yr / College Grads)', value: 'FRESHER' },
  { label: '🌱 0–1 yr Early Career', value: '0-2' },
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

// ─── Sign-In Modal for Guests Attempting to Apply or Save ────────────────────

interface JobAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobListing | null;
  action: 'apply' | 'save';
  onGoogleSignIn: () => Promise<void>;
  isLoading?: boolean;
}

function JobAuthModal({ isOpen, onClose, job, action, onGoogleSignIn, isLoading }: JobAuthModalProps) {
  if (!isOpen || !job) return null;

  const returnUrl = `/jobs?jobId=${job.id}&${action === 'apply' ? 'autoApply=true' : 'autoBookmark=true'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-3xl p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#868E96] hover:text-[#121417] dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Company & Header Icon */}
        <div className="flex items-center gap-3 mb-4">
          <CompanyLogo logoUrl={job.company_logo_url} companyName={job.company_name} size="md" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FD4A32] block">
              {action === 'apply' ? 'Official Employer Portal' : 'Save to Dashboard'}
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-[#121417] dark:text-white truncate">
              {job.company_name}
            </h3>
          </div>
        </div>

        {/* Modal Title & Value Prop */}
        <div className="space-y-1 mb-5">
          <h2 className="text-lg sm:text-xl font-display font-black text-[#121417] dark:text-white leading-tight">
            {action === 'apply' ? 'Sign in to Apply Directly' : 'Sign in to Save this Job'}
          </h2>
          <p className="text-xs text-[#6C757D] dark:text-[#AAAAAA] leading-relaxed">
            {action === 'apply'
              ? `Create your free student account or sign in with Google to apply directly to ${job.company_name} and track your applications.`
              : `Save this opportunity to your Prepunite account so you can track closing deadlines and review it across all your devices.`}
          </p>
        </div>

        {/* Feature Checkpoints */}
        <div className="space-y-2 mb-6 p-3.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#242424]">
          <div className="flex items-center gap-2 text-xs text-[#343A40] dark:text-[#E0E0E0] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>1-Click verified career application URL</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#343A40] dark:text-[#E0E0E0] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Free company blueprints &amp; previous interview papers</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#343A40] dark:text-[#E0E0E0] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Automatic resume &amp; deadline sync across devices</span>
          </div>
        </div>

        {/* Google 1-Click Action */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#121417] hover:bg-black text-white dark:bg-white dark:hover:bg-[#F1F3F5] dark:text-[#121417] transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <div className="text-center">
            <Link
              to={`/login?redirectTo=${encodeURIComponent(returnUrl)}`}
              className="text-[11px] font-semibold text-[#868E96] hover:text-[#121417] dark:hover:text-white transition-colors"
            >
              Prefer email? Sign in or register here &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const { toast } = useToast();
  const { user, isAuthenticated, signInWithGoogle } = useAuth();
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
  const leftListRef = React.useRef<HTMLDivElement>(null);

  // Auth gate state (Option 1)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalAction, setAuthModalAction] = useState<'apply' | 'save'>('apply');
  const [pendingJobForAuth, setPendingJobForAuth] = useState<JobListing | null>(null);
  const [authModalLoading, setAuthModalLoading] = useState(false);

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

      // Search filter (searches title, company, skills/tags, description, salary with synonyms)
      if (filters.search && !jobMatchesSearch(job, filters.search)) {
        return false;
      }

      // Location filter (searches city, state, regions like Gurgaon <-> Haryana, NCR, Bengaluru <-> Karnataka with bidirectional synonyms)
      if (filters.location && !locationMatches(job.location, filters.location)) {
        return false;
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
      if (!expMatchesFilter(job.experience_min, job.experience_max, filters.expLevel, job.title, job.description)) return false;

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

  // Option 1: Apply requires authentication
  const handleApply = useCallback((job: JobListing) => {
    if (isAuthenticated && user) {
      window.open(job.apply_url, '_blank', 'noopener,noreferrer');
    } else {
      setPendingJobForAuth(job);
      setAuthModalAction('apply');
      setAuthModalOpen(true);
    }
  }, [isAuthenticated, user]);

  // Option 1: Bookmark requires authentication
  const toggleBookmark = useCallback((jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated || !user) {
      const job = listings.find((j) => j.id === jobId) || null;
      setPendingJobForAuth(job);
      setAuthModalAction('save');
      setAuthModalOpen(true);
      return;
    }
    const isNowBookmarked = bookmarkStore.toggleBookmarkJob(jobId);
    setBookmarkedIds(new Set(bookmarkStore.getBookmarkedJobIds()));
    if (isNowBookmarked) {
      toast.success('Job saved to your bookmarks!');
    } else {
      toast.info('Job removed from bookmarks.');
    }
  }, [isAuthenticated, user, listings, toast]);

  // Google Sign-In Handler from Modal
  const handleGoogleSignInFromModal = async () => {
    if (!pendingJobForAuth) return;
    setAuthModalLoading(true);
    try {
      const returnUrl = `/jobs?jobId=${pendingJobForAuth.id}&${authModalAction === 'apply' ? 'autoApply=true' : 'autoBookmark=true'}`;
      const res = await signInWithGoogle(returnUrl);
      if (res?.error) {
        toast.error(res.error);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to initiate Google Sign-In');
    } finally {
      setAuthModalLoading(false);
    }
  };

  // Handle auto-apply or auto-bookmark when returning authenticated from login
  useEffect(() => {
    if (isAuthenticated && user && listings.length > 0) {
      const autoApplyParam = searchParams.get('autoApply');
      const autoBookmarkParam = searchParams.get('autoBookmark');
      const targetJobId = searchParams.get('jobId');

      if (autoApplyParam === 'true' && targetJobId) {
        const targetJob = listings.find((j) => j.id === targetJobId);
        if (targetJob?.apply_url) {
          window.open(targetJob.apply_url, '_blank', 'noopener,noreferrer');
          toast.success(`Opening official application portal for ${targetJob.company_name}...`);
          searchParams.delete('autoApply');
          setSearchParams(searchParams, { replace: true });
        }
      } else if (autoBookmarkParam === 'true' && targetJobId) {
        if (!bookmarkStore.isJobBookmarked(targetJobId)) {
          bookmarkStore.toggleBookmarkJob(targetJobId);
          setBookmarkedIds(new Set(bookmarkStore.getBookmarkedJobIds()));
          toast.success('Job saved to your bookmarks!');
        }
        searchParams.delete('autoBookmark');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [isAuthenticated, user, listings, searchParams, setSearchParams, toast]);

  // Prevent clicked card from moving down/disappearing when split-view opens
  useEffect(() => {
    if (!selectedJobId) return;

    const timer = setTimeout(() => {
      const cardEl = document.getElementById(`job-card-${selectedJobId}`);
      if (cardEl && leftListRef.current) {
        cardEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
      if (splitContainerRef.current) {
        const rect = splitContainerRef.current.getBoundingClientRect();
        if (rect.top < 60) {
          splitContainerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [selectedJobId]);

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
    <div className="space-y-5 animate-fadeIn pb-8">
      {/* ── Tier 1: Page Header & Status ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9ECEF] dark:border-[#17181F]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-display font-black text-[#121417] dark:text-white tracking-tight">
              Jobs &amp; Internships
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20">
              {filtered.length}
            </span>
          </div>
          <p className="text-xs text-[#868E96] dark:text-[#A1A1AA] font-sans mt-0.5">
            Verified campus &amp; off-campus opportunities curated for students
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FD4A32]/30 bg-[#FD4A32]/10 text-[#FD4A32] text-xs font-display font-bold uppercase tracking-wider hover:bg-[#FD4A32]/20 transition-all cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* ── Tier 2: Unified Command Search Bar (Constrained Max-Width) ── */}
      <div className="bg-white dark:bg-[#0D0E12] border border-[#E9ECEF] dark:border-[#17181F] rounded-xl p-1 sm:p-1.5 shadow-2xs max-w-2xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-[#E9ECEF] dark:divide-[#17181F]">
          {/* Primary Search Input: Role / Skill / Company */}
          <div className="relative flex-1 py-1 px-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#71717A]" />
            <input
              type="text"
              placeholder="Search by job title, skills (React, Python), or company..."
              value={filters.search ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full pl-7 pr-7 py-1 text-xs sm:text-sm bg-transparent text-[#121417] dark:text-white placeholder:text-[#868E96] dark:placeholder:text-[#71717A] focus:outline-none"
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
          <div className="relative md:w-64 py-1 px-3">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#71717A]" />
            <input
              type="text"
              placeholder="City or 'Remote'..."
              value={filters.location ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              className="w-full pl-7 pr-7 py-1 text-xs sm:text-sm bg-transparent text-[#121417] dark:text-white placeholder:text-[#868E96] dark:placeholder:text-[#71717A] focus:outline-none"
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

      {/* ── Tier 2: Single-Row LinkedIn-Style Filter Bar ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 pb-1">
        {/* Horizontal scrollable pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Segmented Type Switcher */}
          <div className="inline-flex items-center p-0.5 bg-[#F1F3F5] dark:bg-[#1A1A1A] rounded-xl border border-[#E9ECEF] dark:border-[#2A2A2A] shrink-0">
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
          <div className="relative shrink-0">
            <select
              value={filters.workMode || 'ALL'}
              onChange={(e) => setFilters((f) => ({ ...f, workMode: e.target.value as WorkModeFilter }))}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.workMode && filters.workMode !== 'ALL'
                  ? 'bg-[#121417] text-white dark:bg-white dark:text-[#121417] border-[#121417] dark:border-white shadow-2xs font-bold'
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
          <div className="relative shrink-0">
            <select
              value={filters.expLevel || 'ANY'}
              onChange={(e) => setFilters((f) => ({ ...f, expLevel: e.target.value as JobListingFilters['expLevel'] }))}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.expLevel && filters.expLevel !== 'ANY'
                  ? 'bg-[#121417] text-white dark:bg-white dark:text-[#121417] border-[#121417] dark:border-white shadow-2xs font-bold'
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
          <div className="relative shrink-0">
            <select
              value={filters.tag || 'ALL'}
              onChange={(e) => setFilters((f) => ({ ...f, tag: e.target.value }))}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.tag && filters.tag !== 'ALL'
                  ? 'bg-[#121417] text-white dark:bg-white dark:text-[#121417] border-[#121417] dark:border-white shadow-2xs font-bold'
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
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              filters.closingSoonOnly
                ? 'bg-rose-500 text-white border-rose-500 shadow-2xs font-bold'
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
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              savedOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-2xs font-bold'
                : 'bg-white dark:bg-[#141414] text-[#495057] dark:text-[#AAAAAA] border-[#E9ECEF] dark:border-[#2A2A2A] hover:border-amber-400'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedOnly ? 'fill-current' : ''}`} />
            <span>Saved ({bookmarkedIds.size})</span>
          </button>

          {/* Reset Filters Chip */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Side: Results Count & Sort Dropdown */}
        <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-1 lg:pt-0">
          <span className="text-xs text-[#868E96]">
            <strong className="text-[#121417] dark:text-white font-bold">{filtered.length}</strong> {filtered.length === 1 ? 'opportunity' : 'opportunities'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#868E96] whitespace-nowrap">Sort:</span>
            <div className="relative">
              <select
                value={filters.sortBy || 'RECOMMENDED'}
                onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as JobSortOption }))}
                className="appearance-none pl-2.5 pr-7 py-1 text-xs font-semibold bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2A2A2A] rounded-lg text-[#121417] dark:text-white focus:outline-none cursor-pointer hover:border-zinc-400"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60" />
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
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
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
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div ref={splitContainerRef} className={`scroll-mt-4 ${selectedJob ? 'lg:flex lg:gap-6 items-start' : ''}`}>
            {/* Left Column: Job Cards List */}
            <div
              ref={leftListRef}
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
                  onApply={() => handleApply(selectedJob)}
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
                    onApply={() => handleApply(selectedJob)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

      {/* Sign-In Lead-Capture Modal (Option 1) */}
      <JobAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        job={pendingJobForAuth}
        action={authModalAction}
        onGoogleSignIn={handleGoogleSignInFromModal}
        isLoading={authModalLoading}
      />
      </div>
    );
}
