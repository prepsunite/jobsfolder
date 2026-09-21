import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Check, Zap, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { examService, formatExamDisplayName, isExamPaywalled, type ExamWithCompany } from '@/services/exam.service';

export default function PricingPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlExamId = searchParams.get('examId');

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Fetch all available company placement papers live from database
  const { data: exams = [] } = useQuery<ExamWithCompany[]>({
    queryKey: ['live-all-exams'],
    queryFn: () => examService.getAllExams(),
  });

  // Filter out public/free exams
  const paywalledExams = useMemo(() => {
    return exams.filter(isExamPaywalled);
  }, [exams]);

  // Pre-select exam from URL parameter or default to first paywalled exam
  useEffect(() => {
    if (paywalledExams.length > 0) {
      if (urlExamId && paywalledExams.some((e) => e.id === urlExamId)) {
        setSelectedExamId(urlExamId);
      } else if (!selectedExamId || !paywalledExams.some((e) => e.id === selectedExamId)) {
        setSelectedExamId(paywalledExams[0].id);
      }
    }
  }, [paywalledExams, urlExamId, selectedExamId]);

  const handleBuy = async (planType: string, amount: number, examId?: string) => {
    try {
      setLoadingPlan(planType);
      setNotification(null);
      const userEmail = user?.email;
      if (!userEmail) {
        setNotification({
          type: 'error',
          message: 'Please log in with your email account first so your pass is permanently attached to your account.',
        });
        setTimeout(() => {
          window.location.href = '/login?redirectTo=/pricing';
        }, 1500);
        return;
      }

      const targetExamId = (planType === 'SINGLE_PAPER' || planType === 'SINGLE') ? (examId || selectedExamId) : undefined;

      if ((planType === 'SINGLE_PAPER' || planType === 'SINGLE') && !targetExamId) {
        setNotification({ type: 'error', message: 'Please select a target company exam paper to unlock.' });
        return;
      }

      // 1. Call Order API
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          itemType: planType,
          examId: targetExamId,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Failed to create order');

      // 2. Open Razorpay Checkout Modal if key exists
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (razorpayKey && (window as any).Razorpay) {
        const selectedExamName = exams.find((e) => e.id === targetExamId)?.name || 'Selected Paper';

        const planDescriptions: Record<string, string> = {
          SINGLE_PAPER: `1-Year Pass: ${selectedExamName}`,
          PLUS: 'PrepUnite Plus Plan (5 Mock Exams/Month)',
          PRO: 'PrepUnite Pro Plan (20 Mock Exams/Month)',
          MONTHLY: 'PrepUnite Pro Monthly Pass (30 Days)',
          QUARTERLY: 'PrepUnite Pro Quarterly Pass (90 Days)',
          YEARLY: 'PrepUnite Master Yearly Pass (365 Days)',
        };

        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'PrepUnite',
          description: planDescriptions[planType] || `PrepUnite Pass`,
          order_id: orderData.orderId,
          prefill: { email: userEmail },
          handler: async function (response: any) {
            // Get session token for secure server verification
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token;
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers,
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                userEmail,
                itemType: planType,
                examId: targetExamId,
                amount,
              }),
            });

            if (!verifyRes.ok) {
              const verifyData = await verifyRes.json().catch(() => ({}));
              setNotification({
                type: 'error',
                message: `Payment verification failed: ${verifyData.error || 'Please contact support with your Payment ID: ' + response.razorpay_payment_id}`,
              });
              return;
            }

            setNotification({
              type: 'success',
              message: 'Payment Verified! Access unlocked on your account. Redirecting...',
            });
            setTimeout(() => {
              if (planType === 'PLUS' || planType === 'PRO') {
                window.location.href = '/student/exams';
              } else {
                window.location.href = targetExamId ? `/companies?examId=${targetExamId}` : '/companies';
              }
            }, 1500);
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        setNotification({
          type: 'info',
          message: `Order Created: ${orderData.orderId}. Razorpay payment gateway is running in test mode.`,
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Payment initiation failed. Please try again.',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentSelectedExam = paywalledExams.find((e) => e.id === selectedExamId);

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] text-xs font-display font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Transparent Pricing</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
          Invest in Your <span className="bg-gradient-to-r from-[#FD4A32] via-[#FD4A32] to-[#FF8066] bg-clip-text text-transparent">Dream Career</span>
        </h1>
        <p className="text-base text-gray-700 dark:text-gray-300">
          Unlock exclusive company placement papers, complete syllabus breakdowns, and original previous questions with full step-by-step solutions.
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          role="alert"
          className={`max-w-2xl mx-auto p-4 rounded-xl text-sm font-medium flex items-center justify-between border transition-all ${
            notification.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
              : notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
          }`}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="ml-3 text-xs opacity-70 hover:opacity-100 font-bold px-2 py-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3 Core Tiers: Free (₹0), Plus (₹139 - 5 Mock Exams), Pro (₹199 - 20 Mock Exams) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Tier 1: Free Preview */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider font-display">Starter</span>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-white">Free Tier</h3>
              <p className="text-xs text-[#868E96] dark:text-[#666666] mt-0.5">Explore hiring patterns, test syllabi & interview reports</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-4xl text-[#121417] dark:text-white">₹0</span>
              <span className="text-xs text-[#868E96] dark:text-[#555555]">/ forever</span>
            </div>

            <div className="py-2 px-3 rounded-lg bg-gray-50 dark:bg-[#1c1c1c] text-[11px] font-medium text-gray-500 dark:text-gray-400">
              ⚡ <strong>0 Mock Exams</strong> included (upgrade to generate timed blueprints)
            </div>

            <ul className="space-y-2.5 text-xs text-[#495057] dark:text-[#999999] pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#121417] dark:text-[#FD4A32] shrink-0" />
                <span>Access all 50+ company recruitment overviews</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#121417] dark:text-[#FD4A32] shrink-0" />
                <span>Round-wise test pattern & syllabus weightages</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#121417] dark:text-[#FD4A32] shrink-0" />
                <span>Sample memory-based preview questions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#121417] dark:text-[#FD4A32] shrink-0" />
                <span>Browse candidate interview experiences</span>
              </li>
            </ul>
          </div>

          <Link
            to="/companies"
            className="w-full py-3 rounded-xl bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-[#121417] dark:hover:border-white text-[#121417] dark:text-white text-xs font-display font-bold uppercase tracking-wider text-center transition-colors block"
          >
            Browse Free Syllabus
          </Link>
        </div>

        {/* Tier 2: Plus Plan (₹139 / month - 5 Mock Exams) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141414] border-2 border-[#FD4A32] flex flex-col justify-between space-y-6 relative shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FD4A32] text-white text-[9px] font-display font-black uppercase tracking-wider shadow-xs">
            Popular for Drive Practice
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#FD4A32] uppercase tracking-wider font-display">Targeted Practice</span>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-white">PrepUnite Plus</h3>
              <p className="text-xs text-[#868E96] dark:text-[#666666] mt-0.5">Generate blueprint mock exams with customizable schedules</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-4xl text-[#121417] dark:text-white">₹139</span>
              <span className="text-xs text-[#868E96] dark:text-[#555555]">/ month</span>
            </div>

            <div className="py-2 px-3 rounded-lg bg-[#FD4A32]/10 text-[11px] font-bold text-[#FD4A32]">
              🎯 <strong>5 Mock Exams / Month</strong> generated from blueprints
            </div>

            <ul className="space-y-2.5 text-xs text-[#495057] dark:text-[#999999] pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span><strong>5 Blueprint Mock Exams / month</strong> (TCS NQT, Accenture ASE, etc.)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span>Choose when exam is live (from day X to day Y)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span><strong>Strict 90/120 min countdown timer</strong> with auto-submit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span>Proctored anti-cheat & tab switch detection</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span>Complete question solutions & section scorecards</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('PLUS', 139)}
            disabled={loadingPlan === 'PLUS'}
            className="w-full py-3 rounded-xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#FD4A32]/25"
          >
            {loadingPlan === 'PLUS' ? 'Connecting...' : 'Get Plus Pass (₹139/mo)'}
          </button>
        </div>

        {/* Tier 3: Pro Plan (₹199 / month - 20 Mock Exams) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#18191c] to-[#121417] text-white border-2 border-amber-500/80 flex flex-col justify-between space-y-6 relative shadow-xl">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-black text-[9px] font-display font-black uppercase tracking-wider shadow-md">
            Best Value • 20 Mock Exams
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-display">Ultimate Prep</span>
              <h3 className="font-display font-bold text-xl text-white">PrepUnite Pro</h3>
              <p className="text-xs text-gray-400 mt-0.5">Maximum mock drives + full 50+ company archives</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-4xl text-white">₹199</span>
              <span className="text-xs text-gray-400">/ month</span>
            </div>

            <div className="py-2 px-3 rounded-lg bg-amber-500/10 text-[11px] font-bold text-amber-400 border border-amber-500/20">
              🚀 <strong>20 Mock Exams / Month</strong> + Full Company Archives
            </div>

            <ul className="space-y-2.5 text-xs text-gray-300 pt-2 border-t border-[#2e3138]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white"><strong>20 Blueprint Mock Exams / month</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>TCS NQT, Accenture ASE, Infosys, and all patterns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Custom live schedule window + strict 90/120 min timer</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white"><strong>Unlimited access to all 50+ company archives</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Full step-by-step code solutions & Day-1 readiness metrics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority question explanation updates</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('PRO', 199)}
            disabled={loadingPlan === 'PRO'}
            className="w-full py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {loadingPlan === 'PRO' ? 'Connecting...' : 'Get Pro Pass (₹199/mo)'}
          </button>
        </div>
      </div>

      {/* Targeted Single Company Archive Pass with Selector */}
      <div className="max-w-4xl mx-auto pt-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] text-[10px] font-display font-bold uppercase tracking-wider">
              <BookOpen className="w-3 h-3" />
              <span>Targeted 1-Year Pass</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-white">
                Single Company Archive (1-Year Access)
              </h3>
              <p className="text-xs text-[#868E96] dark:text-[#666666] mt-0.5">
                Targeting one specific company drive? Unlock complete past OA papers with code implementations for 365 days.
              </p>
            </div>

            <div className="space-y-1.5 max-w-md pt-1">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                disabled={paywalledExams.length === 0}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs font-semibold text-[#121417] dark:text-white focus:outline-hidden focus:border-[#FD4A32] disabled:opacity-60"
              >
                {paywalledExams.length > 0 ? (
                  paywalledExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {formatExamDisplayName(exam)}
                    </option>
                  ))
                ) : (
                  <option value="">All placement papers currently open!</option>
                )}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end justify-center gap-3 shrink-0">
            <div className="flex items-baseline gap-1 text-right">
              <span className="font-display font-black text-3xl text-[#121417] dark:text-white">₹99</span>
              <span className="text-xs text-[#868E96] dark:text-[#555555]">/ 1 Year</span>
            </div>
            <button
              type="button"
              onClick={() => handleBuy('SINGLE_PAPER', 99, selectedExamId)}
              disabled={loadingPlan === 'SINGLE_PAPER' || !selectedExamId}
              className="px-6 py-3 rounded-xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-[#FD4A32]/20 shrink-0"
            >
              {loadingPlan === 'SINGLE_PAPER' ? 'Connecting...' : `Unlock Paper (₹99)`}
            </button>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#868E96] dark:text-[#555555] pt-4">
        <ShieldCheck className="w-4 h-4 text-[#FD4A32]" />
        <span>Secure 256-bit Razorpay Checkout • Instant Access Activation • DPDP Act 2023 Compliant</span>
      </div>
    </div>
  );
}
