import { useState } from 'react';
import { Lock, CheckCircle2, ShieldCheck, X, CreditCard, ArrowRight, Sparkles } from 'lucide-react';
import { supabasePaymentService } from '@/services/supabasePaymentService';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
  examName: string;
  companyName: string;
  userEmail?: string;
  onUnlocked: () => void;
}

export type PaywallOptionType = 'SINGLE' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export default function PaywallModal({
  isOpen,
  onClose,
  examId,
  examName,
  companyName,
  userEmail,
  onUnlocked,
}: PaywallModalProps) {
  const [selectedOption, setSelectedOption] = useState<PaywallOptionType>('MONTHLY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async (option: PaywallOptionType) => {
    const email = userEmail?.trim();
    if (!email) {
      alert('Please log in with your email account first so your unlocked papers are permanently linked to your account.');
      window.location.href = '/login?redirectTo=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsProcessing(true);

    let amountINR = 299;
    let itemType: 'SINGLE_PAPER' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'MONTHLY';
    let description = 'Jobsfolder Pro Monthly Pass';

    if (option === 'SINGLE') {
      amountINR = 99;
      itemType = 'SINGLE_PAPER';
      description = `1-Year Paper Access: ${examName}`;
    } else if (option === 'QUARTERLY') {
      amountINR = 699;
      itemType = 'QUARTERLY';
      description = 'Jobsfolder Pro Quarterly Pass';
    } else if (option === 'YEARLY') {
      amountINR = 1999;
      itemType = 'YEARLY';
      description = 'Jobsfolder Master Yearly Pass';
    }

    try {
      // 1. Create order on backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountINR,
          itemType,
          examId: itemType === 'SINGLE_PAPER' ? examId : undefined,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Failed to create order');

      // 2. Open Razorpay checkout if key is configured
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (razorpayKey && (window as any).Razorpay) {
        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'PrepUnite',
          description,
          order_id: orderData.orderId,
          prefill: { email },
          handler: async (response: any) => {
            // 3. Verify payment server-side
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                userEmail: email,
                itemType,
                examId: itemType === 'SINGLE_PAPER' ? examId : undefined,
                amount: amountINR,
              }),
            });

            if (!verifyRes.ok) {
              const vd = await verifyRes.json().catch(() => ({}));
              alert(`Payment verification failed: ${vd.error || 'Please contact support with Payment ID: ' + response.razorpay_payment_id}`);
              setIsProcessing(false);
              return;
            }

            // 4. Sync local state for instant UX
            await supabasePaymentService.verifyAndLogTransaction({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: amountINR,
              currency: 'INR',
              itemType,
              examId: itemType === 'SINGLE_PAPER' ? examId : undefined,
              userEmail: email,
            });

            setIsProcessing(false);
            setPaymentSuccess(true);
            setTimeout(() => { setPaymentSuccess(false); onUnlocked(); onClose(); }, 1200);
          },
          modal: { ondismiss: () => setIsProcessing(false) },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Dev/staging fallback — shown only when Razorpay key is NOT configured
        alert(`[Dev Mode] Order created: ${orderData.orderId}\nConfigure VITE_RAZORPAY_KEY_ID to enable live payments.`);
        setIsProcessing(false);
      }
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const getOptionPrice = (option: PaywallOptionType) => {
    switch (option) {
      case 'SINGLE': return '₹99';
      case 'MONTHLY': return '₹299';
      case 'QUARTERLY': return '₹699';
      case 'YEARLY': return '₹1,999';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-5 text-[#1f1b17] dark:text-[#e3e3e3] max-h-[92vh] overflow-y-auto">
        
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
            Premium Placement Content
          </span>
          <h2 className="font-display text-2xl font-black tracking-tight">
            Unlock Official Placement Papers
          </h2>
          <p className="text-xs text-[#747878] dark:text-[#a6adbb] max-w-md mx-auto">
            Access locked placement drive papers for <strong className="text-[#1f1b17] dark:text-[#e3e3e3]">{companyName} – {examName}</strong>. Choose your pass duration:
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
              Granting 30-day verified access to official placement paper...
            </p>
          </div>
        ) : (
          /* Purchasing Options Grid */
          <div className="space-y-3">
            
            {/* OPTION 1: Single Paper Pass (30 Days) */}
            <div
              onClick={() => setSelectedOption('SINGLE')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
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
                      Single Paper Pass (30 Days)
                    </h3>
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb] font-semibold block">
                      30 Days access ONLY for {companyName} – {examName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-xl text-[#1f1b17] dark:text-[#e3e3e3]">₹99</span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">/ 30 Days</span>
                </div>
              </div>
            </div>

            {/* OPTION 2: Monthly All-Access Pass (30 Days) */}
            <div
              onClick={() => setSelectedOption('MONTHLY')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative space-y-1 ${
                selectedOption === 'MONTHLY'
                  ? 'bg-purple-500/10 border-purple-600 shadow-md ring-1 ring-purple-500'
                  : 'bg-[#f6ece6]/60 dark:bg-[#141517]/60 border-[#eae1da] dark:border-[#383a40] hover:border-purple-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'MONTHLY' ? 'border-purple-600 bg-purple-600 text-white' : 'border-[#747878]'
                  }`}>
                    {selectedOption === 'MONTHLY' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">
                      Monthly All-Access Pass
                    </h3>
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb] font-semibold block">
                      30 Days access to ALL company old papers & drives
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-xl text-[#1f1b17] dark:text-[#e3e3e3]">₹299</span>
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 block">/ 30 Days</span>
                </div>
              </div>
            </div>

            {/* OPTION 3: Quarterly Pro Pass (90 Days - Save 22%) */}
            <div
              onClick={() => setSelectedOption('QUARTERLY')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative space-y-1 ${
                selectedOption === 'QUARTERLY'
                  ? 'bg-blue-500/10 border-blue-600 shadow-md ring-1 ring-blue-500'
                  : 'bg-[#f6ece6]/60 dark:bg-[#141517]/60 border-[#eae1da] dark:border-[#383a40] hover:border-blue-400'
              }`}
            >
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-xs">
                Popular • Save 22%
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'QUARTERLY' ? 'border-blue-600 bg-blue-600 text-white' : 'border-[#747878]'
                  }`}>
                    {selectedOption === 'QUARTERLY' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">
                      Quarterly Pro Pass
                    </h3>
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb] font-semibold block">
                      90 Days unlimited access to ALL company papers
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-xl text-[#1f1b17] dark:text-[#e3e3e3]">₹699</span>
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 block">/ 90 Days</span>
                </div>
              </div>
            </div>

            {/* OPTION 4: Yearly Master Pass (365 Days - Save 45%) */}
            <div
              onClick={() => setSelectedOption('YEARLY')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative space-y-1 ${
                selectedOption === 'YEARLY'
                  ? 'bg-amber-500/10 border-amber-600 shadow-md ring-1 ring-amber-500'
                  : 'bg-[#f6ece6]/60 dark:bg-[#141517]/60 border-[#eae1da] dark:border-[#383a40] hover:border-amber-400'
              }`}
            >
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Best Value • Save 45%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'YEARLY' ? 'border-amber-600 bg-amber-600 text-white' : 'border-[#747878]'
                  }`}>
                    {selectedOption === 'YEARLY' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">
                      Yearly Master Pass
                    </h3>
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb] font-semibold block">
                      365 Days unlimited access + Priority Support
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-xl text-[#1f1b17] dark:text-[#e3e3e3]">₹1,999</span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block">/ 365 Days</span>
                </div>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              disabled={isProcessing}
              onClick={() => handleCheckout(selectedOption)}
              className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 bg-[#006c49] hover:bg-[#005237] text-white shadow-emerald-900/20 mt-3"
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
                    Pay {getOptionPrice(selectedOption)} &amp; Unlock Instantly
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Security Guarantee Note */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>256-bit Encrypted Checkout • Instant 30-Day Document Access Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
