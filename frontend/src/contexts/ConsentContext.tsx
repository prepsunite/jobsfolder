/**
 * ConsentContext — DPDP Act 2023 Compliance
 *
 * Tracks whether the user has given, declined, or not yet responded to
 * the data-processing consent notice. Consent state is persisted in
 * localStorage and bidirectionally synchronized with PostgreSQL public.profiles.
 *
 * DPDP Rule 3: Notice must be given before or at the time of collecting
 * personal data. Consent must be free, specific, informed, unambiguous.
 * DPDP Section 6: Right to withdraw consent with the same ease as giving it.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type ConsentStatus = 'pending' | 'accepted' | 'declined';

export interface ConsentRecord {
  status: ConsentStatus;
  timestamp: string; // ISO-8601, kept for audit trail
  version: string;   // Policy version — bump when policy changes
}

interface ConsentContextType {
  consentStatus: ConsentStatus;
  consentTimestamp: string | null;
  consentVersion: string;
  hasResponded: boolean;          // true once user clicked Accept or Decline
  acceptConsent: () => Promise<void>;
  declineConsent: () => Promise<void>;
  withdrawConsent: () => Promise<void>;    // Right to withdraw at any time (DPDP §6)
  resetConsent: () => void;       // Used when policy version changes
}

const CONSENT_STORAGE_KEY = 'jf_dpdp_consent';
export const CURRENT_POLICY_VERSION = '2.0'; // Bump this when privacy policy changes

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

  // Synchronize consent with Supabase when an authenticated session is active
  useEffect(() => {
    const syncSessionConsent = async (userId: string) => {
      try {
        const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
        const localRecord: ConsentRecord | null = raw ? JSON.parse(raw) : null;

        if (localRecord && (localRecord.status === 'accepted' || localRecord.status === 'declined')) {
          // Sync local consent proof to server
          const { error } = await supabase.rpc('update_user_dpdp_consent', {
            p_status: localRecord.status,
            p_version: localRecord.version || CURRENT_POLICY_VERSION,
          });

          if (error) {
            // Fallback direct table update
            await supabase
              .from('profiles')
              .update({
                consent_status: localRecord.status,
                consent_accepted_at: localRecord.status === 'accepted' ? localRecord.timestamp : null,
              })
              .eq('id', userId);
          }
        } else {
          // Check if remote DB profile already has accepted consent from another session
          const { data } = await supabase
            .from('profiles')
            .select('consent_status, consent_accepted_at')
            .eq('id', userId)
            .maybeSingle();

          if (data?.consent_status && data.consent_status !== 'pending') {
            const synced: ConsentRecord = {
              status: data.consent_status as ConsentStatus,
              timestamp: data.consent_accepted_at || new Date().toISOString(),
              version: CURRENT_POLICY_VERSION,
            };
            localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(synced));
            setRecord(synced);
          }
        }
      } catch (err) {
        console.warn('[ConsentContext] Session sync notice:', err);
      }
    };

    // Check initial user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        syncSessionConsent(session.user.id);
      }
    });

    // Listen to live auth transitions (e.g. guest signs in after clicking banner)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.id && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        syncSessionConsent(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const persist = async (status: ConsentStatus) => {
    const r: ConsentRecord = {
      status,
      timestamp: new Date().toISOString(),
      version: CURRENT_POLICY_VERSION,
    };
    // Always write to localStorage first (works even before sign-in)
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(r));
    setRecord(r);

    // Also write to Supabase profiles table as server-side proof of consent
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { error } = await supabase.rpc('update_user_dpdp_consent', {
          p_status: status,
          p_version: CURRENT_POLICY_VERSION,
        });

        if (error) {
          await supabase
            .from('profiles')
            .update({
              consent_status: status,
              consent_accepted_at: status === 'accepted' ? r.timestamp : null,
            })
            .eq('id', user.id);
        }
      }
    } catch (err) {
      // Supabase write failure is non-fatal — localStorage still holds the record
      console.warn('[ConsentContext] Server consent update notice:', err);
    }
  };

  const acceptConsent = () => persist('accepted');
  const declineConsent = () => persist('declined');

  // Withdrawal: same as declining — stops all non-essential processing (DPDP §6)
  const withdrawConsent = () => persist('declined');

  // Force a fresh consent prompt (used when policy version bumps)
  const resetConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setRecord(null);
  };

  const consentStatus: ConsentStatus = record?.status ?? 'pending';
  // hasResponded is false while not initialized (suppresses banner until localStorage is read)
  const hasResponded = initialized ? record !== null : true;

  return (
    <ConsentContext.Provider
      value={{
        consentStatus,
        consentTimestamp: record?.timestamp || null,
        consentVersion: record?.version || CURRENT_POLICY_VERSION,
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
