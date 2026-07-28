import { useState } from 'react';
import { Lock, Sparkles, CheckCircle2, ShieldCheck, Zap, X, CreditCard, ArrowRight, ShieldAlert } from 'lucide-react';
import { dataStore } from '@/services/dataStore';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
  examName: string;
  companyName: string;
  onUnlocked: () => void;
}

export default function PaywallModal({
  isOpen,
  onClose,
  examId,
  examName,
  companyName,
  onUnlocked,
}: PaywallModalProps) {
  const [selectedOption, setSelectedOption] = useState<'SINGLE' | 'MONTHLY'>('MONTHLY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = (option: 'SINGLE' | 'MONTHLY') => {
    setIsProcessing(true);

    setTimeout(() => {
      if (option === 'SINGLE') {
        dataStore.unlockSingleExamPaper(examId);
      } else {
        dataStore.activateMonthlyPass();
      }
      setIsProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        setPaymentSuccess(false);
        onUnlocked();
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6 text-[#1f1b17] dark:text-[#e3e3e3]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#747878] dark:text-[#a6adbb] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Security Badge */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 dark:bg-amber-400/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
            Premium Paywall Content
          </span>
          <h2 className="font-display text-2xl font-black tracking-tight">
            Unlock Official Placement Papers
          </h2>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb] max-w-md mx-auto">
            You are accessing locked placement drive papers for <strong className="text-[#1f1b17] dark:text-[#e3e3e3]">{companyName} – {examName}</strong>. Select your preferred unlock pass below.
          </p>
        </div>

        {/* Payment Success State */}
        {paymentSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
            <h3 className="font-extrabold text-base text-emerald-800 dark:text-emerald-300">
              Payment Verified & Unlocked!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Granting full access to official papers document...
            </p>
          </div>
        ) : (
          /* Purchasing Options Grid */
          <div className="space-y-4">
            
            {/* OPTION B: Monthly Pass (Recommended) */}
            <div
              onClick={() => setSelectedOption('MONTHLY')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative space-y-3 ${
                selectedOption === 'MONTHLY'
                  ? 'bg-purple-500/10 border-purple-600 shadow-md ring-1 ring-purple-500'
                  : 'bg-[#f6ece6]/60 dark:bg-[#141517]/60 border-[#eae1da] dark:border-[#383a40] hover:border-purple-400'
              }`}
            >
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Best Value Pass</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'MONTHLY' ? 'border-purple-600 bg-purple-600 text-white' : 'border-[#747878]'
                  }`}>
                    {selectedOption === 'MONTHLY' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">
                      Jobsfolder All-Access Pass
                    </h3>
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb] font-semibold">
                      Unlimited access to ALL company old papers
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-xl text-[#1f1b17] dark:text-[#e3e3e3]">₹299</span>
                  <span className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] block">/ month</span>
                </div>
              </div>

              <ul className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-500/20 text-[11px] text-[#444748] dark:text-[#a6adbb] font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>100+ Company Old Papers</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>New Campus Drive Uploads</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Fullscreen Google Doc Dashboard</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Ad-Free Pro Interface</span>
                </li>
              </ul>
            </div>

            {/* OPTION A: Single Exam Paper */}
            <div
              onClick={() => setSelectedOption('SINGLE')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                selectedOption === 'SINGLE'
                  ? 'bg-emerald-500/10 border-emerald-600 shadow-md ring-1 ring-emerald-500'
                  : 'bg-[#f6ece6]/60 dark:bg-[#141517]/60 border-[#eae1da] dark:border-[#383a40] hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'SINGLE' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-[#747878]'
                  }`}>
                    {selectedOption === 'SINGLE' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">
                      Unlock Single Exam Drive Paper
                    </h3>
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb] font-semibold">
                      Lifetime access ONLY for {companyName} – {examName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-xl text-[#1f1b17] dark:text-[#e3e3e3]">₹99</span>
                  <span className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] block">one-time</span>
                </div>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              disabled={isProcessing}
              onClick={() => handleCheckout(selectedOption)}
              className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
                selectedOption === 'MONTHLY'
                  ? 'bg-purple-700 hover:bg-purple-600 text-white shadow-purple-900/20'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-900/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting Secure Checkout (UPI / Razorpay)...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    Pay {selectedOption === 'MONTHLY' ? '₹299' : '₹99'} & Unlock Instantly
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Security Guarantee Note */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>256-bit Encrypted Checkout • Instant Document Access Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
