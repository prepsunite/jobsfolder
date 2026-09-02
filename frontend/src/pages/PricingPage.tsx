import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Check, Zap, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { examService, type ExamWithCompany } from '@/services/exam.service';
import type { DocTabNode } from '@/services/dataStore';

function hasLockedNodes(nodes?: DocTabNode[]): boolean {
  if (!nodes || nodes.length === 0) return false;
  return nodes.some(n => {
    if (!n.isFree) return true;
    if (n.children && n.children.length > 0) return hasLockedNodes(n.children);
    return false;
  });
}

function isPaywalledExam(exam: ExamWithCompany): boolean {
  if (exam.isPublicExam === true) return false;
  if (exam.price === 0) return false;
  if (exam.paperTabs && exam.paperTabs.length > 0) {
    return hasLockedNodes(exam.paperTabs);
  }
  return false;
}

export default function PricingPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlExamId = searchParams.get('examId');

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string>('');

  // Fetch all available company placement papers live from database
  const { data: exams = [] } = useQuery<ExamWithCompany[]>({
    queryKey: ['live-all-exams'],
    queryFn: () => examService.getAllExams(),
  });

  // Filter out public/free exams
  const paywalledExams = useMemo(() => {
    return exams.filter(isPaywalledExam);
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
      const userEmail = user?.email;
      if (!userEmail) {
        alert('Please log in with your email account first so your pass is permanently attached to your account.');
        window.location.href = '/login?redirectTo=/pricing';
        return;
      }

      const targetExamId = (planType === 'SINGLE_PAPER' || planType === 'SINGLE') ? (examId || selectedExamId) : undefined;

      if ((planType === 'SINGLE_PAPER' || planType === 'SINGLE') && !targetExamId) {
        alert('Please select a target company exam paper to unlock.');
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
              alert(`Payment verification failed: ${verifyData.error || 'Please contact support with your Payment ID: ' + response.razorpay_payment_id}`);
              return;
            }

            alert('Payment Verified! Paper access unlocked on your account.');
            window.location.href = targetExamId ? `/companies?examId=${targetExamId}` : '/companies';
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        alert(`Mock Mode Order Created: ${orderData.orderId}. Configure VITE_RAZORPAY_KEY_ID for live checkout.`);
      }
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed');
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
          <span>Paper Archives & Access Plans</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#121417] dark:text-white tracking-tight">
          Invest in Real Drive Papers.
        </h1>
        <p className="text-xs sm:text-sm text-[#868E96] dark:text-[#888888] leading-relaxed font-sans">
          Select a single 1-year company archive pass or unlock unlimited access across all 50+ company archives.
        </p>
      </div>

      {/* Top 2 Primary Options: Freemium vs Single Company Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Tier 1: Free Preview */}
        <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider font-display">Freemium</span>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-white">Free Preview</h3>
              <p className="text-xs text-[#868E96] dark:text-[#666666] mt-0.5">Explore hiring patterns, test syllabi & interview reports</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-[#121417] dark:text-white">₹0</span>
              <span className="text-xs text-[#868E96] dark:text-[#555555]">/ forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#495057] dark:text-[#999999] pt-4 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span>Access all 50+ company overviews & syllabus</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span>Round-wise test pattern & weightage breakdowns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span>Sample memory-based preview questions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span>Browse candidate interview experiences</span>
              </li>
            </ul>
          </div>

          <Link
            to="/companies"
            className="w-full py-3 rounded-lg bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-[#121417] dark:hover:border-white text-[#121417] dark:text-white text-xs font-display font-bold uppercase tracking-wider text-center transition-colors block"
          >
            Browse Free Preview
          </Link>
        </div>

        {/* Tier 2: Single Company Archive Pass with Selector */}
        <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#141414] border-2 border-[#FD4A32] flex flex-col justify-between space-y-6 relative shadow-md">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FD4A32] text-white text-[9px] font-display font-black uppercase tracking-wider shadow-xs">
            Most Popular · 1-Year Pass
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#FD4A32] uppercase tracking-wider font-display">Targeted Archive</span>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-white">Single Company Archive</h3>
              <p className="text-xs text-[#868E96] dark:text-[#666666] mt-0.5">1-Year complete access to all paper sets for 1 recruiter</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-[#121417] dark:text-white">₹99</span>
              <span className="text-xs text-[#868E96] dark:text-[#555555]">/ 1 Year Access</span>
            </div>

            {/* Interactive Dropdown */}
            <div className="space-y-1.5 p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
              <label className="text-[10px] font-display font-bold text-[#FD4A32] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Select Company Archive:</span>
              </label>

              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                disabled={paywalledExams.length === 0}
                className="w-full px-3 py-2 rounded bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2E2E2E] text-xs font-semibold text-[#121417] dark:text-white focus:outline-none focus:border-[#FD4A32] disabled:opacity-60"
              >
                {paywalledExams.length > 0 ? (
                  paywalledExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.companyName} — {exam.name}
                    </option>
                  ))
                ) : (
                  <option value="">All placement papers currently open!</option>
                )}
              </select>
            </div>

            <ul className="space-y-2 text-xs text-[#495057] dark:text-[#999999] pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <strong className="text-[#121417] dark:text-white">Valid for 365 Days (1 Full Year)</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span>All previous year question papers & memory sets</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FD4A32] shrink-0" />
                <span>Full step-by-step solutions & code implementations</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('SINGLE_PAPER', 99, selectedExamId)}
            disabled={loadingPlan === 'SINGLE_PAPER' || !selectedExamId}
            className="w-full py-3 rounded-lg bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            {loadingPlan === 'SINGLE_PAPER' ? 'Connecting...' : `Unlock ${currentSelectedExam?.companyName || 'Paper'} (₹99)`}
          </button>
        </div>
      </div>

      {/* All-Access Pro Passes Header */}
      <div className="text-center pt-6 space-y-1">
        <h2 className="font-display font-extrabold text-2xl text-[#121417] dark:text-white">
          All-Company Pro Passes
        </h2>
        <p className="text-xs text-[#868E96] dark:text-[#666666]">
          Preparing for multiple placement drives? Unlock everything across all 50+ company archives.
        </p>
      </div>

      {/* 3 Pro Passes: Monthly, Quarterly, Yearly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Monthly Pro Pass */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-5 shadow-xs">
          <div className="space-y-3">
            <div>
              <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-display">Pro Plan</span>
              <h3 className="font-display font-bold text-lg text-[#121417] dark:text-white">Monthly Pro Pass</h3>
              <p className="text-xs text-[#868E96] dark:text-[#666666]">For candidates in active recruitment weeks</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-[#121417] dark:text-white">₹299</span>
              <span className="text-xs text-[#868E96] dark:text-[#555555]">/ 30 Days</span>
            </div>

            <ul className="space-y-2 text-xs text-[#495057] dark:text-[#999999] pt-3 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span><strong>Unlimited access</strong> to all 50+ companies</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>30-Day active placement drive validity</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>TCS, Accenture, Amazon, Infosys included</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('MONTHLY', 299)}
            disabled={loadingPlan === 'MONTHLY'}
            className="w-full py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {loadingPlan === 'MONTHLY' ? 'Connecting...' : 'Get Monthly Pass (₹299)'}
          </button>
        </div>

        {/* Quarterly Pro Pass */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#141414] border-2 border-blue-500 flex flex-col justify-between space-y-5 relative shadow-sm">
          <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-display font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Save 22%
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-display">Campus Season</span>
              <h3 className="font-display font-bold text-lg text-[#121417] dark:text-white">Quarterly Pro Pass</h3>
              <p className="text-xs text-[#868E96] dark:text-[#666666]">Covers the complete 3-month placement season</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-[#121417] dark:text-white">₹699</span>
              <span className="text-xs text-[#868E96] dark:text-[#555555]">/ 90 Days</span>
            </div>

            <ul className="space-y-2 text-xs text-[#495057] dark:text-[#999999] pt-3 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span><strong>90-Day full access</strong> across all recruiters</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>All upcoming 2026 drive papers included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Priority paper updates & solution requests</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('QUARTERLY', 699)}
            disabled={loadingPlan === 'QUARTERLY'}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {loadingPlan === 'QUARTERLY' ? 'Connecting...' : 'Get Quarterly Pass (₹699)'}
          </button>
        </div>

        {/* Yearly Master Pass */}
        <div className="p-6 rounded-xl bg-[#121417] dark:bg-[#1C1C1C] border border-[#242424] text-white flex flex-col justify-between space-y-5 shadow-lg relative">
          <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-display font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Best Value • Save 45%
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider font-display">Full Year Mastery</span>
              <h3 className="font-display font-bold text-lg text-white">Yearly Master Pass</h3>
              <p className="text-xs text-[#999999]">For 3rd & 4th year comprehensive preparation</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-white">₹1,999</span>
              <span className="text-xs text-[#999999]">/ 365 Days</span>
            </div>

            <ul className="space-y-2 text-xs text-[#999999] pt-3 border-t border-[#2E2E2E]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-white"><strong>365 Days uninterrupted access</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>All current & future company drive archives</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Full offline downloadable notes where available</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('YEARLY', 1999)}
            disabled={loadingPlan === 'YEARLY'}
            className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {loadingPlan === 'YEARLY' ? 'Connecting...' : 'Get Yearly Master Pass (₹1,999)'}
          </button>
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
