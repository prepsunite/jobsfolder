import { useState } from 'react';
import { Lock, CheckCircle2, ShieldCheck, X, CreditCard, ArrowRight, Sparkles } from 'lucide-react';
import {
  PAYWALL_PRICING_TIERS,
  type PaywallOptionType,
  type PaywallPricingTier,
} from '@/constants/pricingData';

export type { PaywallOptionType };

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
  examName: string;
  companyName: string;
  userEmail?: string;
  onUnlocked: () => void;
}

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

  const currentTier =
    PAYWALL_PRICING_TIERS.find((t) => t.id === selectedOption) || PAYWALL_PRICING_TIERS[1];

  const handleCheckout = async (option: PaywallOptionType) => {
    const email = userEmail?.trim();
    if (!email) {
      alert('Please log in with your email account first so your unlocked papers are permanently linked to your account.');
      window.location.href = '/login?redirectTo=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsProcessing(true);

    const tier = PAYWALL_PRICING_TIERS.find((t) => t.id === option) || PAYWALL_PRICING_TIERS[1];
    const amountINR = tier.amountINR;
    const itemType = tier.itemType;
    const description =
      option === 'SINGLE'
        ? `1-Year Paper Access: ${examName}`
        : tier.defaultDescription;

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

            // 4. Verification successful on Supabase database
            setIsProcessing(false);
            setPaymentSuccess(true);
            setTimeout(() => {
              setPaymentSuccess(false);
              onUnlocked();
              onClose();
            }, 1200);
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

  const getTierBorderClass = (tier: PaywallPricingTier, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-[#F8F9FA]/60 dark:bg-[#0C0C0C]/60 border-[#E9ECEF] dark:border-[#242424] hover:border-[#121417] dark:hover:border-[#444444]';
    }

    switch (tier.themeColor) {
      case 'emerald':
        return 'bg-emerald-500/10 border-[#009D63] dark:border-[#00C47B] shadow-sm ring-1 ring-[#009D63]/30';
      case 'purple':
        return 'bg-purple-500/10 border-purple-600 shadow-sm ring-1 ring-purple-500/30';
      case 'blue':
        return 'bg-blue-500/10 border-blue-600 shadow-sm ring-1 ring-blue-500/30';
      case 'amber':
        return 'bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/30';
    }
  };

  const getTierCheckboxClass = (tier: PaywallPricingTier, isSelected: boolean) => {
    if (!isSelected) return 'border-[#868E96] dark:border-[#555555]';
    switch (tier.themeColor) {
      case 'emerald':
        return 'border-[#009D63] bg-[#009D63] dark:border-[#00C47B] dark:bg-[#00C47B] text-black';
      case 'purple':
        return 'border-purple-600 bg-purple-600 text-white';
      case 'blue':
        return 'border-blue-600 bg-blue-600 text-white';
      case 'amber':
        return 'border-amber-500 bg-amber-500 text-black';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl p-6 sm:p-8 shadow-2xl space-y-5 text-[#121417] dark:text-[#FFFFFF] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-md text-[#868E96] dark:text-[#555555] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Security Badge */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-md bg-[#009D63]/10 text-[#009D63] dark:bg-[#00C47B]/10 dark:text-[#00C47B] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <span className="inline-block px-3 py-0.5 rounded-md bg-[#009D63]/10 border border-[#009D63]/20 text-[#009D63] dark:text-[#00C47B] text-[10px] font-display font-bold uppercase tracking-wider">
            Premium Placement Drive Content
          </span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Unlock Official Placement Papers
          </h2>
          <p className="text-xs text-[#868E96] dark:text-[#555555] max-w-md mx-auto">
            Access locked placement drive papers for{' '}
            <strong className="text-[#121417] dark:text-[#FFFFFF]">{companyName} – {examName}</strong>. Choose your pass duration:
          </p>
        </div>

        {/* Payment Success State */}
        {paymentSuccess ? (
          <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-[#009D63] dark:text-[#00C47B] mx-auto animate-bounce" />
            <h3 className="font-extrabold text-base text-[#009D63] dark:text-[#00C47B]">
              Payment Verified &amp; Unlocked!
            </h3>
            <p className="text-xs text-[#868E96] dark:text-[#555555]">
              Granting verified access to official placement paper archive...
            </p>
          </div>
        ) : (
          /* Purchasing Options Grid (Generated from pricingData constants) */
          <div className="space-y-3">
            {PAYWALL_PRICING_TIERS.map((tier) => {
              const isSelected = selectedOption === tier.id;
              const resolvedSubtitle =
                tier.id === 'SINGLE'
                  ? `Unlocks ALL tabs & sections for ${companyName} – ${examName}`
                  : tier.subtitle;

              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedOption(tier.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer relative space-y-1 ${getTierBorderClass(
                    tier,
                    isSelected
                  )}`}
                >
                  {tier.badge && (
                    <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-md bg-[#121417] dark:bg-white text-white dark:text-black text-[9px] font-display font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{tier.badge}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${getTierCheckboxClass(
                          tier,
                          isSelected
                        )}`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-sm text-[#121417] dark:text-[#FFFFFF] truncate">
                          {tier.title}
                        </h3>
                        <span className="text-[11px] text-[#868E96] dark:text-[#555555] font-sans block truncate">
                          {resolvedSubtitle}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display font-extrabold text-lg text-[#121417] dark:text-[#FFFFFF]">
                        {tier.priceDisplay}
                      </span>
                      <span className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] block font-display">
                        {tier.durationLabel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Checkout Action Button */}
            <button
              disabled={isProcessing}
              onClick={() => handleCheckout(selectedOption)}
              className="w-full py-3.5 rounded-md text-xs font-display font-bold uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 bg-[#009D63] dark:bg-[#00C47B] hover:bg-[#007F50] text-black mt-4 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Connecting Secure Checkout (UPI / Razorpay)...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    Pay {currentTier.priceDisplay} &amp; Unlock Instantly
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Security Guarantee Note */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-[#868E96] dark:text-[#555555] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#009D63] dark:text-[#00C47B]" />
              <span>256-bit Encrypted Checkout • Instant Document Access Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
