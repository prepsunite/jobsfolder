import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Check,
  Zap,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { examService, formatExamDisplayName, isExamPaywalled, type ExamWithCompany } from '@/services/exam.service';

type BillingDuration = '1M' | '6M' | '1Y';

export default function PricingPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlExamId = searchParams.get('examId');

  const [billingDuration, setBillingDuration] = useState<BillingDuration>('1M');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  // Pricing matrix based on billingDuration
  const pricing = useMemo(() => {
    switch (billingDuration) {
      case '6M':
        return {
          pro: {
            amount: 649,
            itemType: 'PRO_6M',
            displayPrice: '₹649',
            perMonth: '₹108/mo',
            durationLabel: 'for 6 months',
            savingsBadge: 'Save 16%',
            buttonLabel: 'Get Pro 6-Mo Pass (₹649)',
          },
          ultra: {
            amount: 899,
            itemType: 'ULTRA_6M',
            displayPrice: '₹899',
            perMonth: '₹150/mo',
            durationLabel: 'for 6 months',
            savingsBadge: 'Save 11%',
            buttonLabel: 'Get Ultra 6-Mo Pass (₹899)',
          },
        };
      case '1Y':
        return {
          pro: {
            amount: 1299,
            itemType: 'PRO_1Y',
            displayPrice: '₹1,299',
            perMonth: '₹108/mo',
            durationLabel: 'for 1 year',
            savingsBadge: 'Save 16% • Best Value',
            buttonLabel: 'Get Pro 1-Yr Pass (₹1,299)',
          },
          ultra: {
            amount: 1799,
            itemType: 'ULTRA_1Y',
            displayPrice: '₹1,799',
            perMonth: '₹150/mo',
            durationLabel: 'for 1 year',
            savingsBadge: 'Save 11% • Best Value',
            buttonLabel: 'Get Ultra 1-Yr Pass (₹1,799)',
          },
        };
      case '1M':
      default:
        return {
          pro: {
            amount: 129,
            itemType: 'PRO_1M',
            displayPrice: '₹129',
            perMonth: null,
            durationLabel: '/ month',
            savingsBadge: null,
            buttonLabel: 'Get Pro Pass (₹129/mo)',
          },
          ultra: {
            amount: 169,
            itemType: 'ULTRA_1M',
            displayPrice: '₹169',
            perMonth: null,
            durationLabel: '/ month',
            savingsBadge: null,
            buttonLabel: 'Get Ultra Pass (₹169/mo)',
          },
        };
    }
  }, [billingDuration]);

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

      // Get session token for secure server order creation [P1-04]
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const orderHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) orderHeaders['Authorization'] = `Bearer ${token}`;

      // 1. Call Order API
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: orderHeaders,
        body: JSON.stringify({
          amount,
          itemType: planType,
          examId: targetExamId,
          userEmail,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Failed to create order');

      // 2. Open Razorpay Checkout Modal
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (razorpayKey && (window as any).Razorpay) {
        const selectedExamName = exams.find((e) => e.id === targetExamId)?.name || 'Selected Paper';

        const planDescriptions: Record<string, string> = {
          SINGLE_PAPER: `1-Month Paper Access: ${selectedExamName}`,
          PRO_1M: 'Jobsfolder Pro (5 Mock Exams / 1 Month)',
          PRO_6M: 'Jobsfolder Pro 6-Month Pass (5 Mock Exams/cycle)',
          PRO_1Y: 'Jobsfolder Pro 1-Year Pass (5 Mock Exams/cycle - ₹1,299)',
          ULTRA_1M: 'Jobsfolder Ultra (Unlimited Mock Exams / 1 Month)',
          ULTRA_6M: 'Jobsfolder Ultra 6-Month Pass (Unlimited Mocks)',
          ULTRA_1Y: 'Jobsfolder Ultra 1-Year Pass (Unlimited Mocks - ₹1,799)',
        };

        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'PrepUnite / Jobsfolder',
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
                message: `Payment verification failed: ${verifyData.error || 'Please contact support with Payment ID: ' + response.razorpay_payment_id}`,
              });
              return;
            }

            setNotification({
              type: 'success',
              message: 'Payment Verified! Your pass has been securely activated. Redirecting...',
            });
            setTimeout(() => {
              if (planType.startsWith('PRO') || planType.startsWith('ULTRA')) {
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
          message: `Order Created: ${orderData.orderId}. Razorpay payment gateway is running in preview mode.`,
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

  const faqs = [
    {
      q: 'Can I choose which companies I take mock exams for in Pro?',
      a: 'Yes, completely! With the Pro plan, you receive 5 blueprint mock exams per cycle and can generate exams for any company pattern of your choice (TCS NQT, Accenture ASE, Infosys, Cognizant, Wipro, and more).',
    },
    {
      q: 'What is the main difference between Pro and Ultra?',
      a: 'Both Pro and Ultra unlock complete access to all 50+ company past papers, OA question banks, and code solutions. The difference is the mock test quota: Pro includes 5 blueprint mock exams per cycle for targeted practice, while Ultra gives you 100% UNLIMITED blueprint mock exams across every company test pattern.',
    },
    {
      q: 'Are Pro and Ultra plans ad-free?',
      a: 'Yes, 100%! While our Basic tier is ad-supported to keep syllabus and interview debriefs accessible to all students, subscribing to Pro or Ultra completely removes all advertisements and sponsored banners across the entire platform.',
    },
    {
      q: 'How do the 6-Month and 1-Year passes work?',
      a: 'Passes are one-time payments for extended access (180 days or 365 days) with massive savings (up to 36% off). There are no unexpected auto-debits or hidden subscriptions.',
    },
    {
      q: 'Can I unlock just a single company past paper archive?',
      a: 'Yes! If you are sitting for only one specific campus drive, you can purchase the Single Exam Pass for ₹59, granting 30 days of unlimited access to all tabs and coding solutions for that specific drive.',
    },
    {
      q: 'How do the timed mock tests work?',
      a: 'Our mock test engine runs in a strict proctored environment matching the real test with 90/120 min countdown timers, section-wise navigation, tab-switch monitoring, and auto-submit. After submission, you receive an immediate detailed scorecard and step-by-step solutions.',
    },
    {
      q: 'Is payment secure and when does my pass activate?',
      a: 'All transactions are encrypted with 256-bit SSL via Razorpay. Your pass is activated instantly on your account as soon as the transaction completes.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8 px-4 animate-fadeIn">
      {/* 1. Hero Header */}
      <div className="text-center space-y-3.5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] text-xs font-display font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Transparent Student Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-[#121417] dark:text-white">
          Invest in Your <span className="bg-gradient-to-r from-[#FD4A32] via-[#FD4A32] to-[#FF8066] bg-clip-text text-transparent">Dream Career</span>
        </h1>
        <p className="text-sm text-[#495057] dark:text-[#999999] max-w-xl mx-auto leading-relaxed">
          Master placement season with authentic company blueprints, timed proctored mocks, and step-by-step OA solutions.
        </p>

        {/* 2. HCI Segmented Duration Pill Switcher */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex items-center p-1 rounded-full bg-[#F1F3F5] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] shadow-xs">
            <button
              type="button"
              onClick={() => setBillingDuration('1M')}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-bold transition-all cursor-pointer ${
                billingDuration === '1M'
                  ? 'bg-white dark:bg-[#121417] text-[#121417] dark:text-white shadow-xs'
                  : 'text-[#868E96] dark:text-[#666666] hover:text-[#121417] dark:hover:text-white'
              }`}
            >
              1 Month
            </button>
            <button
              type="button"
              onClick={() => setBillingDuration('6M')}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingDuration === '6M'
                  ? 'bg-white dark:bg-[#121417] text-[#121417] dark:text-white shadow-xs'
                  : 'text-[#868E96] dark:text-[#666666] hover:text-[#121417] dark:hover:text-white'
              }`}
            >
              <span>6-Month Pass</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#FD4A32]/10 text-[#FD4A32]">
                Save up to 16%
              </span>
            </button>
            <button
              type="button"
              onClick={() => setBillingDuration('1Y')}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingDuration === '1Y'
                  ? 'bg-white dark:bg-[#121417] text-[#121417] dark:text-white shadow-xs'
                  : 'text-[#868E96] dark:text-[#666666] hover:text-[#121417] dark:hover:text-white'
              }`}
            >
              <span>1-Year Pass</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Best Value
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          role="alert"
          className={`max-w-2xl mx-auto p-4 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
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

      {/* 3 Core Tiers Grid: Basic, Pro, Ultra */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {/* Tier 1: Basic (Free) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-6 shadow-xs hover:border-gray-300 dark:hover:border-[#333333] transition-all">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#868E96] dark:text-[#666666] uppercase tracking-wider font-display">
                Starter
              </span>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-white">Basic</h3>
              <p className="text-xs text-[#868E96] dark:text-[#777777] leading-relaxed">
                Explore recruitment patterns, test syllabi & candidate interview debriefs.
              </p>
            </div>

            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="font-display font-black text-3xl sm:text-4xl text-[#121417] dark:text-white">₹0</span>
              <span className="text-xs text-[#868E96] dark:text-[#666666]">/ forever</span>
            </div>

            <div className="py-2 px-3 rounded-lg bg-[#F8F9FA] dark:bg-[#1C1C1C] text-[11px] font-medium text-[#495057] dark:text-[#888888] border border-[#E9ECEF] dark:border-[#282828]">
              ⚡ <strong>0 Mock Exams</strong> included (upgrade to generate timed blueprints)
            </div>

            <ul className="space-y-2.5 text-xs text-[#495057] dark:text-[#999999] pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#121417] dark:text-[#FD4A32] shrink-0" />
                <span>50+ company recruitment overviews & test patterns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#121417] dark:text-[#FD4A32] shrink-0" />
                <span>Round-wise test syllabus & sectional weightages</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#121417] dark:text-[#FD4A32] shrink-0" />
                <span>Sample memory-based preview questions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#121417] dark:text-[#FD4A32] shrink-0" />
                <span>Candidate interview experiences & rounds debrief</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500 font-bold text-xs shrink-0">•</span>
                <span className="text-[#868E96] dark:text-[#777777]">Standard Ad-Supported Experience</span>
              </li>
            </ul>
          </div>

          <Link
            to="/companies"
            className="w-full py-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-[#121417] dark:hover:border-white text-[#121417] dark:text-white text-xs font-display font-bold uppercase tracking-wider text-center transition-colors block cursor-pointer"
          >
            Browse Free Syllabus
          </Link>
        </div>

        {/* Tier 2: Pro (5 Mock Exams / cycle) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#2E2E2E] flex flex-col justify-between space-y-6 relative shadow-xs hover:border-[#FD4A32]/60 transition-all">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#FD4A32] uppercase tracking-wider font-display">
                Targeted Practice
              </span>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-white">Pro</h3>
              <p className="text-xs text-[#868E96] dark:text-[#777777] leading-relaxed">
                Full company question papers + 5 blueprint mock exams per cycle.
              </p>
            </div>

            <div className="space-y-0.5 pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#121417] dark:text-white">
                  {pricing.pro.displayPrice}
                </span>
                <span className="text-xs text-[#868E96] dark:text-[#666666]">
                  {pricing.pro.durationLabel}
                </span>
              </div>
              {pricing.pro.perMonth && (
                <div className="flex items-center gap-2 text-[11px] text-[#495057] dark:text-[#888888]">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{pricing.pro.perMonth}</span>
                  {pricing.pro.savingsBadge && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      {pricing.pro.savingsBadge}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="py-2 px-3 rounded-lg bg-[#FD4A32]/10 text-[11px] font-bold text-[#FD4A32] border border-[#FD4A32]/20">
              🎯 <strong>5 Mock Exams / cycle</strong> + All Company Question Papers
            </div>

            <ul className="space-y-2.5 text-xs text-[#495057] dark:text-[#999999] pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span className="text-[#121417] dark:text-white font-semibold"><strong>All 50+ company exam question papers & archives</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span><strong>5 Blueprint Mock Exams / cycle</strong> (pick any target company)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span>Strict 90/120 min countdown timer & auto-submit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span>Proctored anti-cheat & tab-switch tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span>Full step-by-step code solutions & scorecards</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span className="text-[#121417] dark:text-white font-semibold"><strong>100% Ad-Free Experience</strong> (Zero distractions)</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy(pricing.pro.itemType, pricing.pro.amount)}
            disabled={loadingPlan === pricing.pro.itemType}
            className="w-full py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-[#FD4A32]/25"
          >
            {loadingPlan === pricing.pro.itemType ? 'Connecting...' : pricing.pro.buttonLabel}
          </button>
        </div>

        {/* Tier 3: Ultra (Unlimited Mock Exams) - Featured */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#141414] border-2 border-[#FD4A32] dark:border-[#FD4A32] flex flex-col justify-between space-y-6 relative shadow-lg shadow-[#FD4A32]/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FD4A32] text-white text-[9px] font-display font-black uppercase tracking-wider shadow-xs">
            Most Popular • Unlimited
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#FD4A32] uppercase tracking-wider font-display">
                Ultimate All-Access
              </span>
              <h3 className="font-display font-bold text-xl text-[#121417] dark:text-white flex items-center gap-2">
                <span>Ultra</span>
                <Sparkles className="w-4 h-4 text-[#FD4A32]" />
              </h3>
              <p className="text-xs text-[#868E96] dark:text-[#777777] leading-relaxed">
                Unrestricted practice across all companies + complete 50+ past archives.
              </p>
            </div>

            <div className="space-y-0.5 pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#121417] dark:text-white">
                  {pricing.ultra.displayPrice}
                </span>
                <span className="text-xs text-[#868E96] dark:text-[#666666]">
                  {pricing.ultra.durationLabel}
                </span>
              </div>
              {pricing.ultra.perMonth && (
                <div className="flex items-center gap-2 text-[11px] text-[#495057] dark:text-[#888888]">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{pricing.ultra.perMonth}</span>
                  {pricing.ultra.savingsBadge && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      {pricing.ultra.savingsBadge}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="py-2 px-3 rounded-lg bg-[#FD4A32]/10 text-[11px] font-bold text-[#FD4A32] border border-[#FD4A32]/25">
              🚀 <strong>Unlimited Mock Exams</strong> + Full 50+ Company Archives
            </div>

            <ul className="space-y-2.5 text-xs text-[#495057] dark:text-[#999999] pt-2 border-t border-[#E9ECEF] dark:border-[#242424]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span className="text-[#121417] dark:text-white font-semibold"><strong>Unlimited Blueprint Mock Exams</strong> (all test patterns)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span>Practice tests across any company whenever you want</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span className="text-[#121417] dark:text-white font-semibold"><strong>Unlimited access to all 50+ company archives</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span>Full step-by-step code solutions & test case breakdowns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span>Sectional readiness scorecards & percentile rank</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FD4A32] shrink-0" />
                <span className="text-[#121417] dark:text-white font-semibold"><strong>100% Ad-Free Experience</strong> (Zero distractions)</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleBuy(pricing.ultra.itemType, pricing.ultra.amount)}
            disabled={loadingPlan === pricing.ultra.itemType}
            className="w-full py-2.5 rounded-xl bg-[#121417] dark:bg-white text-white dark:text-[#121417] hover:bg-black dark:hover:bg-gray-100 text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            {loadingPlan === pricing.ultra.itemType ? 'Connecting...' : pricing.ultra.buttonLabel}
          </button>
        </div>
      </div>

      {/* 4. Single Company Archive Pass (Architectural Companion Banner) */}
      <div className="max-w-6xl mx-auto">
        <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F9FA] dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] text-[10px] font-display font-bold uppercase tracking-wider">
              <BookOpen className="w-3 h-3" />
              <span>Targeted 1-Month Pass</span>
            </div>
            <h3 className="font-display font-bold text-base text-[#121417] dark:text-white">
              Targeting only one specific company drive?
            </h3>
            <p className="text-xs text-[#868E96] dark:text-[#777777] max-w-xl">
              Unlock 30 days of complete past OA papers, full syllabus breakdowns, and code solutions for that single drive.
            </p>

            <div className="pt-1 max-w-sm">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                disabled={paywalledExams.length === 0}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1c1c1c] border border-[#E9ECEF] dark:border-[#2E2E2E] text-xs font-semibold text-[#121417] dark:text-white focus:outline-hidden focus:border-[#FD4A32] disabled:opacity-60 cursor-pointer"
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

          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#E9ECEF] dark:border-[#242424]">
            <div className="text-left md:text-right">
              <div className="font-display font-black text-2xl text-[#121417] dark:text-white">₹59</div>
              <div className="text-[10px] text-[#868E96] dark:text-[#666666]">/ 30 Days Access</div>
            </div>
            <button
              type="button"
              onClick={() => handleBuy('SINGLE_PAPER', 59, selectedExamId)}
              disabled={loadingPlan === 'SINGLE_PAPER' || !selectedExamId}
              className="px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs shadow-[#FD4A32]/20 shrink-0"
            >
              {loadingPlan === 'SINGLE_PAPER' ? 'Connecting...' : 'Unlock Paper (₹59)'}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Collapsible Feature Comparison Matrix */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#121417] dark:text-white hover:text-[#FD4A32] transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#FD4A32]" />
            <span>{showComparison ? 'Hide' : 'View'} Detailed Feature Comparison Matrix</span>
            {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showComparison && (
          <div className="overflow-x-auto rounded-2xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-4 animate-fadeIn">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E9ECEF] dark:border-[#242424]">
                  <th className="py-3 px-4 font-display font-bold text-[#121417] dark:text-white">Feature</th>
                  <th className="py-3 px-4 font-display font-bold text-[#868E96] dark:text-[#777777] text-center">Basic (₹0)</th>
                  <th className="py-3 px-4 font-display font-bold text-[#FD4A32] text-center">Pro (₹129)</th>
                  <th className="py-3 px-4 font-display font-bold text-[#121417] dark:text-white text-center">Ultra (₹169)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF] dark:divide-[#242424] text-[#495057] dark:text-[#999999]">
                <tr>
                  <td className="py-3 px-4 font-medium text-[#121417] dark:text-white">Blueprint Mock Exams Quota</td>
                  <td className="py-3 px-4 text-center">0 Mocks</td>
                  <td className="py-3 px-4 text-center font-bold text-[#FD4A32]">5 Mocks / cycle</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#121417] dark:text-white">Company Selection for Mocks</td>
                  <td className="py-3 px-4 text-center text-[#868E96]">—</td>
                  <td className="py-3 px-4 text-center">Choose any company pattern</td>
                  <td className="py-3 px-4 text-center">All company patterns</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#121417] dark:text-white">Strict Timed Countdown Proctoring</td>
                  <td className="py-3 px-4 text-center text-[#868E96]">—</td>
                  <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400">✓ Included</td>
                  <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#121417] dark:text-white">Anti-Cheat & Tab Switch Tracking</td>
                  <td className="py-3 px-4 text-center text-[#868E96]">—</td>
                  <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400">✓ Included</td>
                  <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#121417] dark:text-white">Complete Question Solutions & Code</td>
                  <td className="py-3 px-4 text-center text-[#868E96]">Preview only</td>
                  <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400">✓ In Mock Scorecard</td>
                  <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400">✓ In Scorecard & Archives</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#121417] dark:text-white">All 50+ Company Question Papers & Archives</td>
                  <td className="py-3 px-4 text-center text-[#868E96]">Overview only</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ Full 50+ Archives Unlocked</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ Full 50+ Archives Unlocked</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#121417] dark:text-white">Day-1 Readiness Scorecards</td>
                  <td className="py-3 px-4 text-center text-[#868E96]">—</td>
                  <td className="py-3 px-4 text-center">Standard Sectional</td>
                  <td className="py-3 px-4 text-center font-bold text-[#121417] dark:text-white">Advanced + Percentile Rank</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#121417] dark:text-white">100% Ad-Free Experience</td>
                  <td className="py-3 px-4 text-center text-[#868E96]">Ad-supported</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ 100% Ad-Free</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ 100% Ad-Free</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Frequently Asked Questions Accordion */}
      <div className="max-w-4xl mx-auto space-y-4 pt-4">
        <div className="text-center space-y-1.5 pb-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#666666]">
            <HelpCircle className="w-3.5 h-3.5 text-[#FD4A32]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-[#121417] dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-display font-bold text-[#121417] dark:text-white hover:text-[#FD4A32] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#FD4A32] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#868E96] shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#495057] dark:text-[#999999] leading-relaxed border-t border-[#E9ECEF]/60 dark:border-[#242424]/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. Security & Compliance Footer */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#868E96] dark:text-[#666666] pt-6 border-t border-[#E9ECEF] dark:border-[#242424]">
        <ShieldCheck className="w-4 h-4 text-[#FD4A32]" />
        <span>Secure 256-bit Razorpay Checkout • Instant Access Activation • DPDP Act 2023 Compliant</span>
      </div>
    </div>
  );
}
