/**
 * Prepunite Job Audit & Cohort Intelligence Engine.
 *
 * Provides deep audit checks for job leads & listings:
 * 1. Logo check (custom logo vs fallback monogram)
 * 2. Description check (official company JD vs generated template)
 * 3. Link check (direct company ATS portal vs third-party job board)
 * 4. Cohort batching (daily cohort grouping and Telegram broadcast generation)
 */

export interface JobAuditStatus {
  hasLogo: boolean;
  isFallbackDescription: boolean;
  hasEmptyDescription: boolean;
  isDirectAts: boolean;
  isJobBoard: boolean;
  sourceType: 'ATS' | 'JOB_BOARD' | 'DIRECT';
  readinessScore: number; // 0 to 100
  isReadyForPublish: boolean;
  missingItems: Array<{
    key: 'desc' | 'link' | 'logo';
    label: string;
    description: string;
  }>;
}

export function auditJobRecord(item: {
  company_logo_url?: string | null;
  description?: string | null;
  apply_url?: string | null;
}): JobAuditStatus {
  const hasLogo = Boolean(item.company_logo_url && item.company_logo_url.trim().length > 5);

  const desc = (item.description || '').trim();
  const hasEmptyDescription = desc.length === 0;

  // Detect our synthesized fallback template
  const isFallbackDescription =
    hasEmptyDescription ||
    desc.includes('### About the Opportunity') ||
    desc.includes('Collaborate with engineering mentors') ||
    desc.includes('Sound understanding of Data Structures, Algorithms') ||
    desc.includes('Verified job opening at');

  const url = (item.apply_url || '').toLowerCase();
  const isJobBoard =
    url.includes('linkedin.com') ||
    url.includes('glassdoor.') ||
    url.includes('indeed.') ||
    url.includes('naukri.com') ||
    url.includes('monster.') ||
    url.includes('foundit.');

  const isDirectAts =
    url.includes('greenhouse.io') ||
    url.includes('lever.co') ||
    url.includes('myworkdayjobs.com') ||
    url.includes('workday.com') ||
    url.includes('smartrecruiters.com') ||
    url.includes('ashbyhq.com') ||
    url.includes('bamboohr.com') ||
    url.includes('rippling.com') ||
    url.includes('icims.com') ||
    url.includes('taleo.net') ||
    url.includes('successfactors.com') ||
    url.includes('jobs.jobvite.com') ||
    url.includes('recruitee.com');

  const missingItems: Array<{ key: 'desc' | 'link' | 'logo'; label: string; description: string }> = [];

  if (isFallbackDescription) {
    missingItems.push({
      key: 'desc',
      label: 'Needs Real JD',
      description: 'Using auto-generated template. Paste official employer responsibilities & criteria.',
    });
  }

  if (isJobBoard) {
    missingItems.push({
      key: 'link',
      label: 'Job Board Link',
      description: 'Points to LinkedIn/Glassdoor. Replace with direct company career / ATS portal if available.',
    });
  }

  if (!hasLogo) {
    missingItems.push({
      key: 'logo',
      label: 'No Custom Logo',
      description: 'Using letter monogram badge. Add official logo URL if desired.',
    });
  }

  let score = 100;
  if (!hasLogo) score -= 20;
  if (isFallbackDescription) score -= 45;
  if (isJobBoard) score -= 35;

  return {
    hasLogo,
    isFallbackDescription,
    hasEmptyDescription,
    isDirectAts,
    isJobBoard,
    sourceType: isDirectAts ? 'ATS' : isJobBoard ? 'JOB_BOARD' : 'DIRECT',
    readinessScore: Math.max(0, score),
    isReadyForPublish: score >= 60, // Can publish if at least basic criteria met
    missingItems,
  };
}

/**
 * Extracts or groups a job into a daily cohort.
 * Format: "Cohort 1 (07 Nov 2026)" or custom tag like "Cohort 1"
 */
export function getJobCohortLabel(job: { created_at?: string; tags?: string[] }): string {
  if (job.tags) {
    const explicitCohort = job.tags.find((t) => t.toLowerCase().startsWith('cohort'));
    if (explicitCohort) return explicitCohort;
  }

  if (job.created_at) {
    const d = new Date(job.created_at);
    if (!isNaN(d.getTime())) {
      const day = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      return `Cohort • ${day}`;
    }
  }

  return 'Legacy Cohort';
}

/**
 * Generates an engaging, high-conversion Telegram Broadcast for a Cohort.
 * Ideal for a solo admin to copy & paste in 1 click!
 */
export function generateCohortTelegramBroadcast(
  cohortLabel: string,
  jobs: Array<{
    company_name: string;
    title: string;
    location: string;
    type: string;
    stipend_or_salary?: string | null;
  }>
): string {
  const top10 = jobs.slice(0, 15);
  const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  let text = `🚀 *PREPUNITE DAILY JOB DROP* — *${cohortLabel.toUpperCase()}*\n`;
  text += `📅 *Date:* ${now} | 🎯 *Eligibility:* 2024 / 2025 / 2026 / 2027 Grads & Freshers (0–1 YOE)\n`;
  text += `🔥 *${jobs.length} Fresh Openings Verified & Added Today!*\n\n`;
  text += `🏢 *Featured Companies in Today's Cohort:*\n`;

  top10.forEach((j, idx) => {
    const sal = j.stipend_or_salary ? ` [${j.stipend_or_salary}]` : '';
    text += `${idx + 1}. *${j.company_name}* — ${j.title} (${j.location})${sal}\n`;
  });

  if (jobs.length > top10.length) {
    text += `... and *${jobs.length - top10.length} more openings* live on the portal!\n\n`;
  } else {
    text += `\n`;
  }

  text += `👉 *View Details & Apply Immediately:* https://jobsfolder.vercel.app/jobs\n`;
  text += `⚡ *Bookmark & share with your batchmates!*`;

  return text;
}
