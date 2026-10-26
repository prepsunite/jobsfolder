import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Mail,
  X,
} from 'lucide-react';

export type PaymentResultStatus = 'processing' | 'success' | 'failed';

export interface PaymentResultData {
  status: PaymentResultStatus;
  planName?: string;
  amount?: number;
  paymentId?: string;
  orderId?: string;
  userEmail?: string;
  errorMessage?: string;
  nextRoute?: string;
  onRetry?: () => void;
  onClose: () => void;
}

export default function PaymentResultModal({
  status,
  planName = 'PrepUnite Pass',
  amount,
  paymentId,
  orderId,
  userEmail,
  errorMessage,
  nextRoute,
  onRetry,
  onClose,
}: PaymentResultData) {
  const [copied, setCopied] = useState(false);

  const handleCopyPaymentId = () => {
    if (!paymentId) return;
    try {
      navigator.clipboard.writeText(paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleActionClick = () => {
    if (nextRoute) {
      window.location.href = nextRoute;
    } else {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={status !== 'processing' ? onClose : undefined}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.12] shadow-2xl p-6 sm:p-7 text-center space-y-5 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Dismiss Button (Disabled while processing) */}
        {status !== 'processing' && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ── 1. Hero State Indicator (Apple-Style Concentric Glow) ── */}
        <div>
          {status === 'processing' && (
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#FD4A32]/20 animate-ping opacity-30" />
              <div className="relative w-16 h-16 rounded-full bg-[#FD4A32]/10 dark:bg-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center ring-4 ring-[#FD4A32]/15 shadow-inner">
                <Loader2 className="w-8 h-8 animate-spin stroke-[2.5]" />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-500/25 animate-ping opacity-30" />
              <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-4 ring-emerald-500/15 shadow-inner">
                <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="relative w-16 h-16 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center ring-4 ring-rose-500/15 shadow-inner">
                <XCircle className="w-9 h-9 stroke-[2.2]" />
              </div>
            </div>
          )}
        </div>

        {/* ── 2. Headline & Subtitle Hierarchy ── */}
        <div className="space-y-1.5 px-2">
          {status === 'processing' && (
            <>
              <h3 className="font-display font-extrabold text-xl text-[#121417] dark:text-white tracking-tight">
                Authorizing Transaction
              </h3>
              <p className="text-xs text-[#868E96] dark:text-[#8E8E93] leading-relaxed font-sans">
                Verifying your bank signature with the secure server ledger. Please do not close or refresh this tab.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-display font-bold uppercase tracking-wider mb-1">
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>Payment Confirmed</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[#121417] dark:text-white tracking-tight">
                Access Activated!
              </h3>
              <p className="text-xs text-[#868E96] dark:text-[#8E8E93] leading-relaxed font-sans">
                Your pass has been securely issued and permanently linked to your account.
              </p>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-display font-bold uppercase tracking-wider mb-1">
                <X className="w-3 h-3 stroke-[2.5]" />
                <span>Transaction Incomplete</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[#121417] dark:text-white tracking-tight">
                Payment Failed or Cancelled
              </h3>
              <p className="text-xs text-[#868E96] dark:text-[#8E8E93] leading-relaxed font-sans">
                {errorMessage ||
                  'No money was deducted from your account. If debited by your bank, an automatic reversal is issued within 2–4 hours.'}
              </p>
            </>
          )}
        </div>

        {/* ── 3. Apple-Style Digital Receipt Card ── */}
        <div className="rounded-2xl bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.08] p-4 text-left space-y-2.5 text-xs font-sans shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[#868E96] dark:text-[#8E8E93] text-[11px]">Selected Item</span>
            <span className="font-semibold text-[#121417] dark:text-white text-right truncate max-w-[200px]">
              {planName}
            </span>
          </div>

          {typeof amount === 'number' && amount > 0 && (
            <div className="flex items-center justify-between border-t border-black/[0.05] dark:border-white/[0.08] pt-2">
              <span className="text-[#868E96] dark:text-[#8E8E93] text-[11px]">Amount</span>
              <span className="font-display font-bold text-sm text-[#121417] dark:text-white">
                ₹{amount}
              </span>
            </div>
          )}

          {userEmail && (
            <div className="flex items-center justify-between border-t border-black/[0.05] dark:border-white/[0.08] pt-2">
              <span className="text-[#868E96] dark:text-[#8E8E93] text-[11px]">Linked Account</span>
              <span className="font-mono text-[11px] text-[#121417] dark:text-white truncate max-w-[200px]">
                {userEmail}
              </span>
            </div>
          )}

          {paymentId && (
            <div className="flex items-center justify-between border-t border-black/[0.05] dark:border-white/[0.08] pt-2">
              <span className="text-[#868E96] dark:text-[#8E8E93] text-[11px]">Reference ID</span>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#121417] dark:text-white">
                <span className="truncate max-w-[130px]">{paymentId}</span>
                <button
                  type="button"
                  onClick={handleCopyPaymentId}
                  className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-[#868E96] hover:text-[#FD4A32] transition-colors cursor-pointer"
                  title="Copy Reference ID"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          )}

          {orderId && !paymentId && (
            <div className="flex items-center justify-between border-t border-black/[0.05] dark:border-white/[0.08] pt-2">
              <span className="text-[#868E96] dark:text-[#8E8E93] text-[11px]">Order ID</span>
              <span className="font-mono text-[11px] text-[#121417] dark:text-white truncate max-w-[160px]">
                {orderId}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-black/[0.05] dark:border-white/[0.08] pt-2 text-[10px] text-[#868E96] dark:text-[#666666]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#FD4A32]" />
              <span>Razorpay 256-Bit SSL Encrypted</span>
            </span>
            <span className="font-medium">
              {status === 'success' ? 'Settled' : status === 'failed' ? 'Failed' : 'Pending'}
            </span>
          </div>
        </div>

        {/* ── 4. Primary & Secondary Actions ── */}
        <div className="space-y-2 pt-1">
          {status === 'success' && (
            <button
              type="button"
              onClick={handleActionClick}
              className="w-full py-3 px-5 rounded-2xl bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-black dark:hover:bg-neutral-200 text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
            >
              <span>Start Practicing Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {status === 'failed' && (
            <div className="space-y-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full py-3 px-5 rounded-2xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href={`/contact?subject=Payment+Issue&body=Hi+Support,+my+payment+did+not+go+through.+Order+Ref:+${paymentId || orderId || 'None'}`}
                  className="text-xs text-[#868E96] hover:text-[#FD4A32] dark:text-[#8E8E93] dark:hover:text-[#FD4A32] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>Contact Support</span>
                </a>
                <span className="text-[#868E96]/40 dark:text-[#8E8E93]/40">·</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#868E96] hover:text-[#121417] dark:text-[#8E8E93] dark:hover:text-white font-medium cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-[11px] text-[#868E96] dark:text-[#666666] font-medium pt-1">
              Finalizing cryptographic receipt...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
