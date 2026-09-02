/**
 * Rate Limiter Utility
 * Provides client-side sliding 24-hour window quotas and cooldown guards
 * to prevent spam, duplicate clicks, and automated abuse.
 */

export interface RateLimitConfig {
  maxDaily: number;
  cooldownSeconds: number;
  label: string;
}

export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  contact_message: {
    maxDaily: 3,
    cooldownSeconds: 60,
    label: 'inquiries',
  },
  question_report: {
    maxDaily: 5,
    cooldownSeconds: 30,
    label: 'reports',
  },
};

interface StoredRateLimit {
  timestamps: number[];
}

const STORAGE_PREFIX = 'prepunite_ratelimit_';

function getStorageKey(action: string): string {
  return `${STORAGE_PREFIX}${action}`;
}

function getStoredData(action: string): StoredRateLimit {
  try {
    const raw = localStorage.getItem(getStorageKey(action));
    if (!raw) return { timestamps: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.timestamps)) return { timestamps: [] };

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const validTimestamps = parsed.timestamps.filter((ts: number) => typeof ts === 'number' && ts > oneDayAgo);

    return { timestamps: validTimestamps };
  } catch {
    return { timestamps: [] };
  }
}

function saveStoredData(action: string, data: StoredRateLimit): void {
  try {
    localStorage.setItem(getStorageKey(action), JSON.stringify(data));
  } catch (e) {
    console.warn('[rateLimiter] Failed to save rate limit state:', e);
  }
}

export interface RateLimitStatus {
  allowed: boolean;
  reason?: string;
  usedToday: number;
  maxDaily: number;
  remainingToday: number;
  cooldownSecondsRemaining: number;
}

export const rateLimiter = {
  check: (action: 'contact_message' | 'question_report'): RateLimitStatus => {
    const config = RATE_LIMIT_CONFIGS[action];
    if (!config) {
      return {
        allowed: true,
        usedToday: 0,
        maxDaily: 999,
        remainingToday: 999,
        cooldownSecondsRemaining: 0,
      };
    }

    const { timestamps } = getStoredData(action);
    const now = Date.now();
    const usedToday = timestamps.length;
    const remainingToday = Math.max(0, config.maxDaily - usedToday);

    if (timestamps.length > 0) {
      const lastSubmission = timestamps[timestamps.length - 1];
      const elapsedSeconds = Math.floor((now - lastSubmission) / 1000);
      const cooldownRemaining = config.cooldownSeconds - elapsedSeconds;

      if (cooldownRemaining > 0) {
        return {
          allowed: false,
          reason: `Please wait ${cooldownRemaining}s before sending another ${config.label.slice(0, -1)}.`,
          usedToday,
          maxDaily: config.maxDaily,
          remainingToday,
          cooldownSecondsRemaining: cooldownRemaining,
        };
      }
    }

    if (usedToday >= config.maxDaily) {
      return {
        allowed: false,
        reason: `Daily limit reached (${config.maxDaily}/${config.maxDaily} ${config.label}). For urgent assistance, please contact prepsunite@gmail.com.`,
        usedToday,
        maxDaily: config.maxDaily,
        remainingToday: 0,
        cooldownSecondsRemaining: 0,
      };
    }

    return {
      allowed: true,
      usedToday,
      maxDaily: config.maxDaily,
      remainingToday,
      cooldownSecondsRemaining: 0,
    };
  },

  record: (action: 'contact_message' | 'question_report'): void => {
    const data = getStoredData(action);
    data.timestamps.push(Date.now());
    saveStoredData(action, data);
  },
};
