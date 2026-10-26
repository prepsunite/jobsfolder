import { useState } from 'react';
import {
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
  const isCancelled = status === 'failed' && Boolean(errorMessage?.toLowerCase().includes('cancel'));

  const handleCopyPaymentId = () => {
    if (!paymentId) return;
    try {
      navigator.clipboard.writeText(paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
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
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={status !== 'processing' ? onClose : undefined}
    >
      <div
        className="relative w-full max-w-[380px] overflow-hidden rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_24px_50px_rgba(0,0,0,0.6)] p-6 sm:p-7 text-center space-y-5 animate-scaleUp font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Dismiss Button */}
        {status !== 'processing' && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-100 dark:bg-white/[0.08] hover:bg-neutral-200 dark:hover:bg-white/[0.15] text-neutral-400 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        )}

        {/* ── 1. Minimal Apple Status Indicator ── */}
        <div className="pt-1">
          {status === 'processing' && (
            <div className="w-11 h-11 mx-auto rounded-full border-2 border-neutral-200 dark:border-neutral-800 border-t-neutral-900 dark:border-t-white animate-spin" />
          )}

          {status === 'success' && (
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
          )}

          {status === 'failed' && (
            <>
              {isCancelled ? (
                <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 flex items-center justify-center shadow-xs">
                  <X className="w-5 h-5 stroke-[2.2]" />
                </div>
              ) : (
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 dark:bg-rose-500/15 text-rose-500 dark:text-rose-400 flex items-center justify-center shadow-xs">
                  <X className="w-5 h-5 stroke-[2.2]" />
                </div>
              )}
            </>
          )}
        </div>

        {/* ── 2. Clean Typography Hierarchy ── */}
        <div className="space-y-1 px-1">
          {status === 'processing' && (
            <>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                Authorizing Payment
              </h3>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-normal max-w-xs mx-auto">
                Verifying your transaction with the bank. Please do not close or refresh this tab.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                Payment Confirmed
              </h3>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-normal max-w-xs mx-auto">
                Your pass has been activated and permanently linked to your account.
              </p>
            </>
          )}

          {status === 'failed' && (
            <>
              {isCancelled ? (
                <>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                    Payment Cancelled
                  </h3>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-normal max-w-xs mx-auto">
                    No charges were made to your account. You can complete your order anytime.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                    Payment Unsuccessful
                  </h3>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-normal max-w-xs mx-auto">
                    {errorMessage ||
                      'The bank was unable to authorize this transaction. No funds were debited.'}
                  </p>
                </>
              )}
            </>
          )}
        </div>

        {/* ── 3. Apple-Grade Digital Receipt Slip ── */}
        <div className="rounded-2xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] p-4 text-center space-y-3 shadow-inner">
          {typeof amount === 'number' && amount > 0 && (
            <div className="pb-3 border-b border-black/[0.05] dark:border-white/[0.06]">
              <div className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                ₹{amount.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium truncate max-w-[270px] mx-auto">
                {planName}
              </div>
            </div>
          )}

          <div className="space-y-2 text-xs">
            {userEmail && (
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                <span>Account</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[190px]">
                  {userEmail}
                </span>
              </div>
            )}

            {paymentId && (
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                <span>Payment Ref</span>
                <div className="flex items-center gap-1 font-medium text-neutral-800 dark:text-neutral-200">
                  <span className="truncate max-w-[130px]">{paymentId}</span>
                  <button
                    type="button"
                    onClick={handleCopyPaymentId}
                    className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                    title="Copy Reference"
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
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                <span>Order Ref</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[160px]">
                  {orderId}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-black/[0.05] dark:border-white/[0.06] text-[11px]">
              <span className="text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted</span>
              </span>
              <span
                className={`font-medium ${
                  status === 'success'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isCancelled
                    ? 'text-neutral-500 dark:text-neutral-400'
                    : status === 'failed'
                    ? 'text-rose-500 dark:text-rose-400'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {status === 'success' ? 'Settled' : isCancelled ? 'Cancelled' : status === 'failed' ? 'Declined' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* ── 4. Clean Apple Action Buttons ── */}
        <div className="space-y-3 pt-1">
          {status === 'success' && (
            <button
              type="button"
              onClick={handleActionClick}
              className="w-full py-3 px-5 rounded-full bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {status === 'failed' && (
            <div className="space-y-2.5">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full py-3 px-5 rounded-full bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isCancelled ? 'Resume Payment' : 'Try Again'}</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-4 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                <button
                  type="button"
                  onClick={onClose}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer font-medium"
                >
                  Dismiss
                </button>
                <span className="text-neutral-300 dark:text-neutral-700">|</span>
                <a
                  href={`/contact?subject=Payment+Assistance&body=Order+Ref:+${paymentId || orderId || 'None'}`}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors font-medium flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-xs text-neutral-400 dark:text-neutral-500 font-medium pt-1">
              Securing transaction signature...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
