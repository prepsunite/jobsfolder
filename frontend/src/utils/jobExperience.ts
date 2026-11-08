/**
 * Prepunite Fresher Experience Verification Engine.
 *
 * Strict Rule: Prepunite is strictly a FRESHER & EARLY-CAREER portal.
 * "Fresher" strictly means:
 * - 0 years of experience (college students, fresh graduates, interns)
 * - 1 year of experience (entry-level early-career professionals)
 *
 * ANY job requiring >= 2 years (2+, 3+, 5+ YOE) is strictly EXCLUDED.
 */

const HIGH_YOE_PATTERNS = [
  /\b([2-9]|\d{2,})\+?\s*(?:to|[-–—])?\s*\d*\s*(?:years?|yrs?)\s*(?:of\s+)?(?:non-internship|post-qualification|post-graduation|industry|professional|hands-on|full-time)?\s*(?:relevant\s+)?(?:software\s+development\s+|software\s+|engineering\s+)?(?:experience|exp)/i,
  /\b([2-9]|\d{2,})\+?\s*(?:to|[-–—])?\s*\d*\s*(?:years?|yrs?)\s*(?:in\s+a\s+similar\s+role|of\s+(?:relevant\s+)?experience|experience|exp|working\s+with|in\s+software|in\s+development)/i,
  /\b(?:minimum|at\s+least|min\.?)\s*([2-9]|\d{2,})\+?\s*(?:years?|yrs?)/i,
  /\b(?:typically\s+)?requires?\s*([2-9]|\d{2,})\+?\s*(?:to|[-–—])?\s*\d*\s*(?:years?|yrs?)/i,
  /\b([2-9]|\d{2,})\+?\s*(?:yoe|years\s+of\s+experience)/i,
  /\b(?:2|3|4|5|6|7|8|9|\d{2,})\s*(?:to|[-–—])\s*\d+\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i,
  /\bexperience\s*:\s*([2-9]|\d{2,})\+?\s*(?:to|[-–—])?\s*\d*\s*(?:years?|yrs?)/i,
  /\bexperience\s*:\s*\d+\s*(?:to|[-–—])\s*([2-9]|\d{2,})\s*(?:years?|yrs?)/i,
  /\b\d+\s*(?:to|[-–—])\s*([2-9]|\d{2,})\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i,
];

const SENIOR_TITLE_PATTERN =
  /\b(senior|sr\.|sr\b|lead|principal|architect|manager|director|vp|head|staff|specialist|sde[- ]?[2-5]|sde[- ]?(ii|iii|iv|v)|developer[- ]?[2-5]|engineer[- ]?[2-5]|l[2-5]|team\s+lead)\b/i;

const FRESHER_OVERRIDE_PATTERNS = [
  /\bintern(ship)?\b/i,
  /\btrainee\b/i,
  /\bgraduate\s+engineer\s+trainee\b/i,
  /\bget\b/i,
  /\bcampus\b/i,
  /\bentry[- ]level\b/i,
  /\bfresher\b/i,
  /\b0[- ]1\s*(?:years?|yrs?)\b/i,
  /\b0\s*(?:to|-)\s*1\s*(?:years?|yrs?)\b/i,
  /\b(?:0|zero)\s*(?:to|-)\s*1\s*(?:years?|yrs?)\b/i,
  /\bclass\s+of\s+202[4-7]\b/i,
  /\bbatch\s+of\s+202[4-7]\b/i,
  /\b202[4-7]\s+graduates?\b/i,
  /\buniversity\s+graduates?\b/i,
  /\bcollege\s+graduates?\b/i,
  /\bno\s+prior\s+experience\s+required\b/i,
  /\bfreshers\s+welcome\b/i,
];

export interface FresherCheckResult {
  isFresher: boolean; // Strictly true only for 0 or 1 year of experience
  minYears: number;
  maxYears: number;
  flagReason?: string;
}

/**
 * Parses title, description, and numeric fields to determine if a job strictly requires 0-1 YOE.
 */
export function verifyFresherEligibility(job: {
  title: string;
  description?: string | null;
  experience_min?: number | null;
  experience_max?: number | null;
}): FresherCheckResult {
  const title = (job.title || '').trim();
  const desc = (job.description || '').trim();

  // 1. Internships are ALWAYS genuine fresher (0 YOE)
  if (/\bintern(ship)?\b/i.test(title)) {
    return { isFresher: true, minYears: 0, maxYears: 0 };
  }

  // 1b. Finance / Investment Banking / Consulting: 'Associate' is an experienced tier (3-6 YOE)
  const isFinanceFirm = /\b(goldman\s+sachs|morgan\s+stanley|blackrock|jpmorgan|jp\s*morgan|mckinsey|bcg|bain)\b/i.test(title + ' ' + desc);
  if (isFinanceFirm && /\bassociate\b/i.test(title) && !/\b(analyst|trainee|intern)\b/i.test(title)) {
    return {
      isFresher: false,
      minYears: 3,
      maxYears: 5,
      flagReason: 'Finance/Banking Associate is an experienced role (3+ YOE)',
    };
  }

  // 2. Check numeric experience_min if explicitly set >= 2
  if (job.experience_min != null && job.experience_min >= 2) {
    return {
      isFresher: false,
      minYears: job.experience_min,
      maxYears: job.experience_max ?? job.experience_min,
      flagReason: `Database experience_min is ${job.experience_min}+ yrs`,
    };
  }

  // 3. Check Seniority in Title
  const titleSeniorMatch = title.match(SENIOR_TITLE_PATTERN);
  if (titleSeniorMatch) {
    return {
      isFresher: false,
      minYears: 3,
      maxYears: 5,
      flagReason: `Senior title detected: "${titleSeniorMatch[0]}"`,
    };
  }

  // 4. Check Description for high YOE requirements (2+, 3+, 5+ years)
  if (desc) {
    for (const pattern of HIGH_YOE_PATTERNS) {
      const match = desc.match(pattern);
      if (match) {
        // Double-check if overridden by an explicit freshers-welcome note
        const hasFresherOverride = FRESHER_OVERRIDE_PATTERNS.some((p) => p.test(desc));
        // If it specifically demands 2+ or more years of experience, do not allow boilerplate overrides
        if (!hasFresherOverride || /[2-9]\+|\d{2,}\+|\b[2-9]\s*(?:to|-)\s*\d+/i.test(match[0])) {
          const numMatch = match[0].match(/\d+/);
          const detectedYears = numMatch ? parseInt(numMatch[0], 10) : 3;
          return {
            isFresher: false,
            minYears: detectedYears,
            maxYears: detectedYears + 2,
            flagReason: `Requires ${match[0]}`,
          };
        }
      }
    }
  }

  // Role qualifies as genuine 0-1 YOE Fresher
  const minYears = job.experience_min ?? 0;
  const maxYears = job.experience_max != null && job.experience_max <= 1 ? job.experience_max : 1;
  return { isFresher: true, minYears, maxYears };
}
