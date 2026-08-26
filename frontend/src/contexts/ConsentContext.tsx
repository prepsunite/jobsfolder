/**
 * ConsentContext — DPDP Act 2023 Compliance
 *
 * Tracks whether the user has given, declined, or not yet responded to
 * the data-processing consent notice. Consent state is persisted in
 * localStorage with a timestamp so we can honour the "withdraw at any
 * time" requirement.
 *
 * DPDP Rule 3: Notice must be given before or at the time of collecting
 * personal data. Consent must be free, specific, informed, unambiguous.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

type ConsentStatus = 'pending' | 'accepted' | 'declined';

interface ConsentRecord {
  status: ConsentStatus;
  timestamp: string; // ISO-8601, kept for audit trail
  version: string;   // Policy version — bump when policy changes
}

interface ConsentContextType {
  consentStatus: ConsentStatus;
  hasResponded: boolean;          // true once user clicked Accept or Decline
  acceptConsent: () => void;
  declineConsent: () => void;
  withdrawConsent: () => void;    // Right to withdraw at any time (DPDP §6)
  resetConsent: () => void;       // Used when policy version changes
}

const CONSENT_STORAGE_KEY = 'jf_dpdp_consent';
const CURRENT_POLICY_VERSION = '2.0'; // Bump this when privacy policy changes

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Load persisted consent record on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (raw) {
        const parsed: ConsentRecord = JSON.parse(raw);
        // If policy version changed, reset to pending so new notice is shown
        if (parsed.version !== CURRENT_POLICY_VERSION) {
          setRecord(null);
        } else {
          setRecord(parsed);
        }
      }
    } catch {
      // Malformed storage — treat as pending
      setRecord(null);
    } finally {
      setInitialized(true);
    }
  }, []);

  const persist = (status: ConsentStatus) => {
    const r: ConsentRecord = {
      status,
      timestamp: new Date().toISOString(),
      version: CURRENT_POLICY_VERSION,
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(r));
    setRecord(r);
  };

  const acceptConsent = () => persist('accepted');
  const declineConsent = () => persist('declined');

  // Withdrawal: same as declining — stops all non-essential processing
  const withdrawConsent = () => persist('declined');

  // Force a fresh consent prompt (used when policy version bumps)
  const resetConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setRecord(null);
  };

  if (!initialized) return null; // Don't flash banner before localStorage loads

  const consentStatus: ConsentStatus = record?.status ?? 'pending';
  const hasResponded = record !== null;

  return (
    <ConsentContext.Provider
      value={{
        consentStatus,
        hasResponded,
        acceptConsent,
        declineConsent,
        withdrawConsent,
        resetConsent,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = (): ConsentContextType => {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
};
