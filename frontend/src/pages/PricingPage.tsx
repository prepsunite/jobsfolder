import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Check, Sparkles, Shield, Clock, Zap, ArrowRight, Lock, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { examService, type ExamWithCompany } from '@/services/exam.service';

import type { DocTabNode } from '@/services/dataStore';
import { useMemo } from 'react';

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
    <div className="max-w-6xl mx-auto space-y-12 py-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006c49]/10 text-[#006c49] dark:bg-[#6cf8bb]/10 dark:text-[#6cf8bb] text-xs font-extrabold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Transparent Pricing</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#1f1b17] dark:text-white tracking-tight">
          Invest in Your Campus Placement Success.
        </h1>
        <p className="text-sm text-[#747878] dark:text-[#a6adbb] leading-relaxed">
          Select a single 1-year paper pass or unlock unlimited access across all company recruitment drives.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tier 1: Free Preview */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider">Freemium</span>
              <h3 className="font-bold text-2xl text-[#1f1b17] dark:text-white">Free Preview</h3>
              <p className="text-xs text-[#747878] dark:text-[#a6adbb]">Explore hiring patterns & syllabus</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-black text-4xl text-[#1f1b17] dark:text-white">₹0</span>
              <span className="text-xs text-[#747878] dark:text-[#a6adbb]">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-[#444748] dark:text-[#a6adbb] pt-4 border-t border-[#eae1da] dark:border-[#2b2d31]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Access company overviews & hiring badges</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Round-wise test pattern breakdowns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Sample memory-based preview questions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Browse interview experiences</span>
              </li>
            </ul>
          </div>

          <a
            href="/companies"
            className="w-full py-3 rounded-2xl bg-[#f6ece6] dark:bg-[#2b2d31] hover:bg-[#eae1da] text-[#1f1b17] dark:text-white text-xs font-bold uppercase tracking-wider text-center transition-colors block"
          >
            Browse Free Preview
          </a>
        </div>

        {/* Tier 2: Single Exam Pass with Paper Selector */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1e1f22] border-2 border-[#006c49] dark:border-[#6cf8bb] shadow-lg flex flex-col justify-between space-y-6 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#006c49] text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
            1-Year Single Paper Pass
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#006c49] dark:text-[#6cf8bb] uppercase tracking-wider">Targeted Preparation</span>
              <h3 className="font-bold text-2xl text-[#1f1b17] dark:text-white">Single Exam Pass</h3>
              <p className="text-xs text-[#747878] dark:text-[#a6adbb]">1-Year Access to 1 selected company paper</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-black text-4xl text-[#1f1b17] dark:text-white">
                ₹{currentSelectedExam?.price || 99}
              </span>
              <span className="text-xs text-[#747878] dark:text-[#a6adbb]">/ 1 Year Access</span>
            </div>

            {/* Interactive Paper Selector Dropdown */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-[#f6ece6] dark:bg-[#141517] border border-[#eae1da] dark:border-[#383a40]">
              <label className="text-[11px] font-extrabold text-[#006c49] dark:text-[#6cf8bb] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Select Target Exam Paper:</span>
              </label>

              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                disabled={paywalledExams.length === 0}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#383a40] text-xs font-bold text-[#1f1b17] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006c49] disabled:opacity-60"
              >
                {paywalledExams.length > 0 ? (
                  paywalledExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.companyName} — {exam.name}
                    </option>
                  ))
                ) : (
                  <option value="">All current placement papers are freely accessible!</option>
                )}
              </select>
            </div>

            <ul className="space-y-3 text-xs text-[#444748] dark:text-[#a6adbb] pt-2 border-t border-[#eae1da] dark:border-[#2b2d31]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb] shrink-0" />
                <strong className="text-[#1f1b17] dark:text-white">Valid for 365 Days (1 Full Year)</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb] shrink-0" />
                <span>Complete Document Explorer unlocked</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#006c49] dark:text-[#6cf8bb] shrink-0" />
                <span>Full step-by-step solutions & code snippets</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('SINGLE_PAPER', currentSelectedExam?.price || 99, selectedExamId)}
            disabled={loadingPlan === 'SINGLE_PAPER' || !selectedExamId}
            className="w-full py-3.5 rounded-2xl bg-[#006c49] hover:bg-[#005a3c] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loadingPlan === 'SINGLE_PAPER' ? 'Processing...' : `Unlock ${currentSelectedExam?.companyName || ''} Paper (₹99)`}
          </button>
        </div>

        {/* Tier 3: Monthly Pro Pass */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1f1b17] to-[#2b2d31] text-white shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">All-Access Pass</span>
              <h3 className="font-bold text-2xl">Monthly Pro Pass</h3>
              <p className="text-xs text-slate-300">Unlimited access to ALL companies & papers</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-black text-4xl text-white">₹299</span>
              <span className="text-xs text-slate-300">/ 30 Days</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <strong className="text-white">Unlimited Access to ALL Company Papers</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>30-Day active placement drive validity</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Access all TCS, Accenture, Infosys & product tracks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority support & new paper updates</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy('MONTHLY_PASS', 299)}
            disabled={loadingPlan === 'MONTHLY_PASS'}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-black uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loadingPlan === 'MONTHLY_PASS' ? 'Processing...' : 'Get Monthly Pro Pass (₹299)'}
          </button>
        </div>
      </div>
    </div>
  );
}
