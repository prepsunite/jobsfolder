import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { feedbackService } from '@/services/feedback.service';
import type { ReportIssueType } from '@/types/feedback';
import { rateLimiter, type RateLimitStatus } from '@/utils/rateLimiter';
import { AlertTriangle, CheckCircle2, X, Send, Loader2, ShieldAlert } from 'lucide-react';

interface ReportQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  questionStatement: string;
  companySlug?: string;
  topicId?: string;
}

const ISSUE_OPTIONS: { value: ReportIssueType; label: string; desc: string }[] = [
  {
    value: 'INCORRECT_ANSWER',
    label: 'Incorrect Answer / Key',
    desc: 'The marked correct option or numerical answer is wrong.',
  },
  {
    value: 'INACCURATE_EXPLANATION',
    label: 'Flawed Explanation / Solution',
    desc: 'The step-by-step logic or code explanation has mathematical or conceptual flaws.',
  },
  {
    value: 'AMBIGUOUS_OPTIONS',
    label: 'Ambiguous or Missing Options',
    desc: 'Options are confusing, duplicate, or missing the correct choice.',
  },
  {
    value: 'TYPO_OR_FORMATTING',
    label: 'Typo / Formatting / Display Error',
    desc: 'Broken formulas, LaTeX formatting issues, or misaligned text.',
  },
  {
    value: 'OUTDATED_QUESTION',
    label: 'Outdated Question / Pattern',
    desc: 'No longer asked in current recruitment drives.',
  },
  {
    value: 'OTHER',
    label: 'Other Concern',
    desc: 'Any other issue not covered above.',
  },
];

export default function ReportQuestionModal({
  isOpen,
  onClose,
  questionId,
  questionStatement,
  companySlug,
  topicId,
}: ReportQuestionModalProps) {
  const { user } = useAuth();

  const [issueType, setIssueType] = useState<ReportIssueType>('INCORRECT_ANSWER');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState(user?.email && user.email !== 'guest@prepunite.com' ? user.email : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [rateStatus, setRateStatus] = useState<RateLimitStatus>(() => rateLimiter.check('question_report'));

  useEffect(() => {
    if (isOpen) {
      setRateStatus(rateLimiter.check('question_report'));
    }
  }, [isOpen, isSubmitted]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Bot Honeypot Trap
    if (honeypot.trim()) {
      console.warn('[ReportQuestionModal] Bot submission dropped via honeypot.');
      setIsSubmitted(true);
      return;
    }

    // 2. Client-side Rate Limit check
    const currentLimit = rateLimiter.check('question_report');
    if (!currentLimit.allowed) {
      setErrorMsg(currentLimit.reason || 'Report limit reached. Please try again later.');
      setRateStatus(currentLimit);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await feedbackService.submitQuestionReport({
        questionId: String(questionId),
        questionStatement,
        companySlug,
        topicId,
        issueType,
        details: details.trim(),
        reporterEmail: email.trim() || user?.email || undefined,
      });

      setIsSubmitted(true);
      setRateStatus(rateLimiter.check('question_report'));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setDetails('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#ffffff] dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E9ECEF] dark:border-[#242424]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#121417] dark:text-[#FFFFFF]">
                Report Question Issue
              </h3>
              <p className="text-[11px] text-[#868E96] dark:text-[#555555] font-sans">
                Help us verify questions for all students
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-[#868E96] hover:text-[#121417] dark:hover:text-[#FFFFFF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-[#121417] dark:text-[#FFFFFF]">
                Report Submitted for Review
              </h4>
              <p className="text-xs text-[#868E96] dark:text-[#555555] max-w-sm mx-auto font-sans leading-relaxed">
                Thank you! Our subject-matter reviewers will inspect this question and update the solution.
              </p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="px-5 py-2 rounded-full bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-display font-bold uppercase tracking-wider transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Question Snippet */}
            <div className="p-3 bg-[#F8F9FA] dark:bg-[#0C0C0C] rounded-lg border border-[#E9ECEF] dark:border-[#242424] space-y-1">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
                Target Question:
              </span>
              <p className="text-xs text-[#121417] dark:text-[#FFFFFF] line-clamp-2 font-sans italic">
                "{questionStatement}"
              </p>
            </div>

            {/* Issue Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">
                What is the issue? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ISSUE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIssueType(opt.value)}
                    className={`p-2.5 rounded-lg text-left border transition-all ${
                      issueType === opt.value
                        ? 'border-[#FD4A32] bg-[#FD4A32]/10 text-[#121417] dark:text-[#FFFFFF]'
                        : 'border-[#E9ECEF] dark:border-[#242424] hover:border-[#868E96] text-[#868E96] dark:text-[#888888]'
                    }`}
                  >
                    <span className="block text-xs font-bold font-display text-[#121417] dark:text-[#FFFFFF]">
                      {opt.label}
                    </span>
                    <span className="block text-[10px] text-[#868E96] dark:text-[#666666] line-clamp-1 mt-0.5">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-1">
              <label className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. In step 2, the speed should be converted to m/s instead of km/h..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#FD4A32] rounded-lg p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
              />
            </div>

            {/* Invisible Bot Honeypot Trap */}
            <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
              <label htmlFor="hp_question_report">Leave this field blank</label>
              <input
                type="text"
                id="hp_question_report"
                name="hp_question_report"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">
                Your Email (Optional, to notify you when fixed)
              </label>
              <input
                type="email"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#FD4A32] rounded-lg p-2 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
              />
            </div>

            {/* Anti-Spam Quota Status */}
            <div className="flex items-center justify-between text-[10px] text-[#868E96] dark:text-[#555555] pt-1 border-t border-[#E9ECEF] dark:border-[#242424]">
              <span>Anti-Spam Quota</span>
              <span className={`font-mono font-bold ${rateStatus.remainingToday === 0 ? 'text-rose-500' : 'text-[#121417] dark:text-[#FFFFFF]'}`}>
                {rateStatus.remainingToday} of {rateStatus.maxDaily} reports remaining today
              </span>
            </div>

            {(!rateStatus.allowed || errorMsg) && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg || rateStatus.reason}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#868E96] hover:text-[#121417] dark:hover:text-[#FFFFFF] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !rateStatus.allowed}
                className="px-5 py-2 rounded-full bg-[#FD4A32] hover:bg-[#E0351D] text-black text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
