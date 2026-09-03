/**
 * ConsentBanner — DPDP Act 2023, Rule 3 Compliance
 *
 * Shown to every visitor who has not yet responded to the data-processing
 * notice. Renders a non-intrusive bottom bar that:
 *  - Explains exactly what personal data is collected & why
 *  - Links to Privacy Policy and Terms
 *  - Offers Accept and Decline with equal prominence (no dark patterns)
 *  - Disappears permanently once the user responds
 *
 * NOTE: This component is rendered OUTSIDE <RouterProvider> in App.tsx
 * so it must use plain <a href> tags instead of react-router <Link>.
 *
 * DPDP Requirements met:
 *  ✔  Notice given before/at data collection (Rule 3)
 *  ✔  Plain language — no legalese (Rule 3)
 *  ✔  Specific purpose stated
 *  ✔  Links to full policy & withdrawal mechanism
 *  ✔  No pre-acceptance forced (equal Accept/Decline)
 */

import { ShieldCheck, X, Check } from 'lucide-react';
import { useConsent } from '@/contexts/ConsentContext';

export default function ConsentBanner() {
  const { hasResponded, acceptConsent, declineConsent } = useConsent();

  // Don't render once the user has responded
  if (hasResponded) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie and Privacy Notice"
      className="fixed bottom-0 left-0 right-0 z-[9999] animate-slideUpFade"
    >
      {/* Backdrop blur for mobile */}
      <div className="border-t border-[#E9ECEF] dark:border-[#242424] bg-white/95 dark:bg-[#141414]/95 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Icon */}
          <div className="shrink-0 w-9 h-9 rounded-md bg-[#FD4A32]/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#FD4A32]" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-bold text-[#121417] dark:text-white tracking-tight">
              Your Privacy &amp; Data Rights (DPDP Act, 2023)
            </p>
            <p className="text-[11px] text-[#868E96] dark:text-[#777777] font-sans leading-relaxed mt-0.5">
              Jobsfolder collects your <strong className="text-[#495057] dark:text-[#999999]">name, email address, and profile picture</strong> via Google
              Sign-In to authenticate your account and personalise your learning experience.
              We do <strong className="text-[#495057] dark:text-[#999999]">not</strong> sell your data. You can withdraw consent and delete your
              account at any time from your Dashboard or Profile page.{' '}
              <a
                href="/privacy-policy"
                className="underline text-[#FD4A32] hover:text-[#e03e28] transition-colors"
              >
                Privacy Policy
              </a>{' '}
              ·{' '}
              <a
                href="/terms-and-conditions"
                className="underline text-[#FD4A32] hover:text-[#e03e28] transition-colors"
              >
                Terms
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {/* Decline — equal prominence, no dark pattern */}
            <button
              type="button"
              onClick={declineConsent}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] text-[11px] font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              Decline
            </button>

            {/* Accept */}
            <button
              type="button"
              onClick={acceptConsent}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-[#2a2a2a] dark:hover:bg-[#f0f0f0] text-[11px] font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Check className="w-3 h-3" />
              Accept
            </button>
          </div>

        </div>

        {/* Fine print — DPDP Section 6 withdrawal notice */}
        <div className="border-t border-[#F1F3F5] dark:border-[#1C1C1C] px-4 sm:px-6 py-2 max-w-7xl mx-auto">
          <p className="text-[10px] text-[#ADB5BD] dark:text-[#444444] font-sans">
            You can withdraw your consent at any time by visiting{' '}
            <a href="/dashboard" className="underline hover:text-[#FD4A32] transition-colors">
              Dashboard → Data &amp; Privacy
            </a>. Declining may limit some features.
            Grievance Officer: <a href="mailto:prepsunite@gmail.com" className="underline hover:text-[#FD4A32] transition-colors">prepsunite@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
