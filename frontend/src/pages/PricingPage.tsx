import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Check, Zap, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  // Exam-level public flag: skip paywall entirely
  if (exam.isPublicExam === true) return false;
  // Explicitly priced at 0
  if (exam.price === 0) return false;
  // Has paper tabs — check if any are locked
  if (exam.paperTabs && exam.paperTabs.length > 0) {
    return hasLockedNodes(exam.paperTabs);
  }
  // No paper tabs yet — don't sell access to empty exams
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

  // Filter out public/free exams that do not require any paywall purchase
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

      const targetExamId = planType === 'SINGLE_PAPER' ? (examId || selectedExamId) : undefined;

      if (planType === 'SINGLE_PAPER' && !targetExamId) {
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

        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'PrepUnite',
          description: planType === 'MONTHLY_PASS' ? '30-Day Pro Pass' : `1-Year Pass: ${selectedExamName}`,
          order_id: orderData.orderId,
          prefill: { email: userEmail },
          handler: async function (response: any) {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
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

            alert('Payment Verified! Paper access unlocked on your account for 1 year.');
            window.location.href = `/companies?examId=${targetExamId}`;
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
    <div className="max-w-6xl mx-auto space-y-10 py-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] text-[10px] font-display font-bold uppercase tracking-wider">
          <Zap className="w-3 h-3" />
          <span>Paper Archives & Access</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#121417] dark:text-[#FFFFFF] tracking-tight">
          Invest in Real Drive Papers.
        </h1>
        <p className="text-xs text-[#868E96] dark:text-[#555555] leading-relaxed font-sans">
          Select a single 1-year paper pass or unlock complete access across all 50+ company archives.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Tier 1: Free Preview */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-bold text-[#868E96] dark:text-[#555555] uppercase tracking-wider font-display">Freemium</span>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-[#FFFFFF]">Free Preview</h3>
              <p className="text-xs text-[#868E96] dark:text-[#555555] mt-0.5">Explore hiring patterns & blueprints</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-[#121417] dark:text-[#FFFFFF]">₹0</span>
              <span className="text-xs text-[#868E96] dark:text-[#555555]">/ forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#495057] dark:text-[#999999] pt-3 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
                <span>Access company overviews & syllabus</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
                <span>Round-wise test pattern breakdowns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
                <span>Sample memory-based preview questions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
                <span>Browse interview reports</span>
              </li>
            </ul>
          </div>

          <a
            href="/companies"
            className="w-full py-2.5 rounded-md bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-[#121417] text-[#121417] dark:text-[#FFFFFF] text-xs font-display font-bold uppercase tracking-wider text-center transition-colors block"
          >
            Browse Free Preview
          </a>
        </div>

        {/* Tier 2: Single Exam Pass with Paper Selector */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#141414] border-2 border-[#FD4A32] dark:border-[#FD4A32] flex flex-col justify-between space-y-5 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-[#FD4A32] dark:bg-[#FD4A32] text-black text-[9px] font-display font-black uppercase tracking-wider">
            Most Popular · 1-Year Pass
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-bold text-[#FD4A32] dark:text-[#FD4A32] uppercase tracking-wider font-display">Targeted Archive</span>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-[#FFFFFF]">Single Company Archive</h3>
              <p className="text-xs text-[#868E96] dark:text-[#555555] mt-0.5">1-Year Access to all years for 1 company</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-[#121417] dark:text-[#FFFFFF]">
                ₹{currentSelectedExam?.price || 99}
              </span>
              <span className="text-xs text-[#868E96] dark:text-[#555555]">/ 1 Year Access</span>
            </div>

            {/* Interactive Paper Selector Dropdown */}
            <div className="space-y-1 p-2.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
              <label className="text-[9px] font-display font-bold text-[#FD4A32] dark:text-[#FD4A32] uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Select Company Archive:</span>
              </label>

              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                disabled={paywalledExams.length === 0}
                className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2E2E2E] text-xs font-semibold text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#FD4A32] disabled:opacity-60"
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

            <ul className="space-y-2.5 text-xs text-[#495057] dark:text-[#999999] pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
                <strong className="text-[#121417] dark:text-[#FFFFFF]">Valid for 365 Days (1 Full Year)</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
                <span>All previous year question papers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
                <span>Full step-by-step solutions & code</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('SINGLE_PAPER', currentSelectedExam?.price || 99, selectedExamId)}
            disabled={loadingPlan === 'SINGLE_PAPER' || !selectedExamId}
            className="w-full py-2.5 rounded-md bg-[#FD4A32] dark:bg-[#FD4A32] hover:bg-[#E0351D] text-black text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {loadingPlan === 'SINGLE_PAPER' ? 'Processing...' : `Unlock ${currentSelectedExam?.companyName || ''} (₹99)`}
          </button>
        </div>

        {/* Tier 3: Monthly Pro Pass */}
        <div className="p-6 rounded-lg bg-[#121417] dark:bg-[#141414] border border-[#121417] dark:border-[#242424] text-white flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-bold text-[#FD4A32] uppercase tracking-wider font-display">All-Access Pass</span>
              <h3 className="font-display font-bold text-xl text-white">Monthly Pro Pass</h3>
              <p className="text-xs text-[#999999] mt-0.5">Unlimited access to ALL companies & papers</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-white">₹299</span>
              <span className="text-xs text-[#999999]">/ 30 Days</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#999999] pt-3 border-t border-[#2E2E2E]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <strong className="text-white">Unlimited Access to ALL 50+ Archives</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span>30-Day active placement drive validity</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span>Access TCS, Accenture, Amazon & more</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span>Latest 2026 drive questions included</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('MONTHLY_PASS', 299)}
            disabled={loadingPlan === 'MONTHLY_PASS'}
            className="w-full py-2.5 rounded-md bg-white text-black hover:bg-[#F1F3F5] text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {loadingPlan === 'MONTHLY_PASS' ? 'Processing...' : 'Get Monthly Pro Pass (₹299)'}
          </button>
        </div>
      </div>
    </div>
  );
}
