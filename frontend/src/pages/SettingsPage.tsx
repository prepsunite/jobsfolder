import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useConsent } from '@/contexts/ConsentContext';
import { supabase } from '@/lib/supabase';
import { tpoService } from '@/services/tpo.service';
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  CreditCard,
  Receipt,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  LogOut,
  LayoutDashboard,
  User,
  Sparkles,
  Lock,
} from 'lucide-react';

interface BillingRecord {
  id: string;
  title: string;
  type: string;
  paymentId: string;
  status: string;
  date: string;
  expiresAt: string;
  amount: string | null;
}

export default function SettingsPage() {
  const { user, isAdmin, isTpoAdmin, logout } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { consentStatus, consentTimestamp, consentVersion, withdrawConsent, acceptConsent } = useConsent();

  // TanStack Query: Active Subscription Entitlement
  const { data: subData } = useQuery({
    queryKey: ['settings-user-subscription', user?.email, user?.collegeId],
    queryFn: async () => {
      if (!user?.email) return { isPro: false, planName: 'Free Tier' };
      const cleanEmail = user.email.trim().toLowerCase();

      // 1. Institutional Student Verification
      const liveInfo = await tpoService.verifyStudentEntitlementLive(cleanEmail);
      if (liveInfo?.isEntitled) {
        return {
          isPro: true,
          planName: liveInfo.collegeName ? `Campus Pro Pass (${liveInfo.collegeName})` : 'Campus Pro Pass',
          expiresAt: liveInfo.expiresAt,
          collegeId: liveInfo.collegeId,
          collegeName: liveInfo.collegeName,
        };
      }

      // 2. Personal retail B2C plan
      try {
        const { data } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_email', cleanEmail)
          .eq('status', 'ACTIVE')
          .gt('expires_at', new Date().toISOString())
          .not('payment_id', 'ilike', 'B2B_CAMPUS_%')
          .order('expires_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          return { isPro: true, planName: data.plan_name || 'MockFolder Pro Pass', expiresAt: data.expires_at };
        }
      } catch {}

      return { isPro: false, planName: 'Free Tier' };
    },
    enabled: !!user?.email,
  });

  const isUserPro = isAdmin || (subData?.isPro ?? false);

  // TanStack Query: Billing & Past Purchase History
  const { data: purchaseHistory = [], isLoading: isPurchasesLoading } = useQuery<BillingRecord[]>({
    queryKey: ['settings-billing-history', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const cleanEmail = user.email.trim().toLowerCase();

      const [subsRes, papersRes] = await Promise.all([
        supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_email', cleanEmail)
          .order('created_at', { ascending: false }),
        supabase
          .from('user_paper_purchases')
          .select('*')
          .eq('user_email', cleanEmail)
          .order('purchased_at', { ascending: false }),
      ]);

      const subs: BillingRecord[] = (subsRes.data || []).map((s: any) => ({
        id: s.id,
        title: s.plan_name || 'MockFolder Access Pass',
        type: 'Pass Subscription',
        paymentId: s.payment_id,
        status: s.status || 'ACTIVE',
        date: s.created_at,
        expiresAt: s.expires_at,
        amount: null,
      }));

      const papers: BillingRecord[] = (papersRes.data || []).map((p: any) => ({
        id: p.id,
        title: `Single Exam Paper Unlock (${p.exam_id})`,
        type: 'Single Paper',
        paymentId: p.payment_id,
        status: new Date(p.expires_at) > new Date() ? 'ACTIVE' : 'EXPIRED',
        date: p.purchased_at,
        expiresAt: p.expires_at,
        amount: p.amount_paid ? `₹${p.amount_paid}` : null,
      }));

      return [...subs, ...papers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    enabled: !!user?.email,
  });

  const [isUpdatingConsent, setIsUpdatingConsent] = useState(false);

  const handleToggleConsent = async () => {
    setIsUpdatingConsent(true);
    try {
      if (consentStatus === 'accepted') {
        if (window.confirm('Withdraw consent for non-essential personal data processing? Progress telemetry and analytics sync will be paused until re-consented.')) {
          await withdrawConsent();
        }
      } else {
        await acceptConsent();
      }
    } finally {
      setIsUpdatingConsent(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12 font-sans">
      {/* Top Banner & Quick Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#868E96] dark:text-[#999999] hover:text-[#FD4A32] dark:hover:text-[#FD4A32] transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Learning Dashboard</span>
          </Link>
          <span className="text-[#868E96] dark:text-[#555555]">/</span>
          <span className="text-xs font-display font-bold text-[#121417] dark:text-white">
            Settings &amp; Preferences
          </span>
        </div>

        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FD4A32]/10 hover:bg-[#FD4A32]/20 text-[#FD4A32] text-xs font-display font-bold border border-[#FD4A32]/25 transition-all shadow-2xs"
        >
          <User className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </Link>
      </div>

      {/* Main Settings Header */}
      <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#1E232B] bg-white dark:bg-[#14171C] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/25 flex items-center justify-center font-bold shrink-0">
            <Settings className="w-6 h-6 text-[#FD4A32]" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-white tracking-tight">
              Settings &amp; Preferences
            </h1>
            <p className="text-xs text-[#868E96] dark:text-[#A1A1AA] mt-0.5">
              Manage your display appearance, past billing purchases, and DPDP Act 2023 privacy rights.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Appearance & Display Theme */}
      <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#1E232B] bg-white dark:bg-[#14171C] shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#FD4A32]" />
            <h2 className="font-display font-bold text-sm text-[#121417] dark:text-white">
              Appearance &amp; Theme
            </h2>
          </div>
          <p className="text-xs text-[#868E96] dark:text-[#A1A1AA]">
            Customize how MockFolder looks on your screen. Choose between clean light contrast or ultra-sleek cold carbon dark mode.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              themeMode === 'light'
                ? 'border-[#FD4A32] bg-[#FD4A32]/5 ring-1 ring-[#FD4A32]'
                : 'border-[#E9ECEF] dark:border-[#1E232B] bg-[#F8F9FA] dark:bg-[#0D0F12] hover:border-[#FD4A32]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sun className="w-5 h-5 text-amber-500" />
              {themeMode === 'light' && (
                <CheckCircle2 className="w-4 h-4 text-[#FD4A32]" />
              )}
            </div>
            <span className="font-display font-bold text-xs text-[#121417] dark:text-white block">
              Light Mode
            </span>
            <span className="text-[10px] text-[#868E96] dark:text-[#71717A] block mt-0.5">
              Crisp daylight contrast
            </span>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              themeMode === 'dark'
                ? 'border-[#FD4A32] bg-[#FD4A32]/5 ring-1 ring-[#FD4A32]'
                : 'border-[#E9ECEF] dark:border-[#1E232B] bg-[#F8F9FA] dark:bg-[#0D0F12] hover:border-[#FD4A32]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              {themeMode === 'dark' && (
                <CheckCircle2 className="w-4 h-4 text-[#FD4A32]" />
              )}
            </div>
            <span className="font-display font-bold text-xs text-[#121417] dark:text-white block">
              Dark Mode (Cold Carbon)
            </span>
            <span className="text-[10px] text-[#868E96] dark:text-[#71717A] block mt-0.5">
              Obsidian steel &amp; glowing ember
            </span>
          </button>

          {/* System Auto */}
          <button
            type="button"
            onClick={() => setThemeMode('system')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              themeMode === 'system'
                ? 'border-[#FD4A32] bg-[#FD4A32]/5 ring-1 ring-[#FD4A32]'
                : 'border-[#E9ECEF] dark:border-[#1E232B] bg-[#F8F9FA] dark:bg-[#0D0F12] hover:border-[#FD4A32]/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Monitor className="w-5 h-5 text-neutral-400" />
              {themeMode === 'system' && (
                <CheckCircle2 className="w-4 h-4 text-[#FD4A32]" />
              )}
            </div>
            <span className="font-display font-bold text-xs text-[#121417] dark:text-white block">
              System Sync
            </span>
            <span className="text-[10px] text-[#868E96] dark:text-[#71717A] block mt-0.5">
              Follows your OS appearance
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 2: Billing & Past Purchases */}
      <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#1E232B] bg-white dark:bg-[#14171C] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <h2 className="font-display font-bold text-sm text-[#121417] dark:text-white">
                Billing &amp; Past Purchases
              </h2>
            </div>
            <p className="text-xs text-[#868E96] dark:text-[#A1A1AA]">
              View your active pass memberships and receipt history for all unlocked company exams.
            </p>
          </div>

          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FD4A32] hover:bg-[#e03e28] text-white text-xs font-display font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pricing &amp; Passes</span>
          </Link>
        </div>

        {/* Current Entitlement Summary Card */}
        <div className="p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#0D0F12] border border-[#E9ECEF] dark:border-[#1E232B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#868E96] dark:text-[#71717A] uppercase tracking-wider block">
              Active Tier
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm text-[#121417] dark:text-white">
                {subData?.planName || 'Free Student Tier'}
              </span>
              {isUserPro ? (
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Active Pro
                </span>
              ) : (
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Standard Tier
                </span>
              )}
            </div>
            {subData?.expiresAt && (
              <p className="text-[11px] text-[#868E96] dark:text-[#71717A]">
                Valid until {new Date(subData.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                {' '}({Math.max(0, Math.ceil((new Date(subData.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining)
              </p>
            )}
          </div>

          <Link
            to="/pricing"
            className="text-xs text-[#FD4A32] hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>{isUserPro ? 'Extend / Upgrade Pass' : 'Unlock Full Access'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Purchase History Records Table / Cards */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-[#121417] dark:text-white uppercase tracking-wider block">
            Transaction History
          </span>

          {isPurchasesLoading ? (
            <div className="p-6 text-center text-xs text-[#868E96] dark:text-[#71717A]">
              Loading billing records...
            </div>
          ) : purchaseHistory.length > 0 ? (
            <div className="space-y-2">
              {purchaseHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg border border-[#E9ECEF] dark:border-[#1E232B] bg-[#F8F9FA]/60 dark:bg-[#0D0F12]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5 text-[#FD4A32]" />
                      <span className="font-bold text-[#121417] dark:text-white">
                        {item.title}
                      </span>
                      {item.amount && (
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {item.amount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#868E96] dark:text-[#71717A] font-mono">
                      Ref: {item.paymentId || 'B2B/System Entitlement'} • {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-lg border border-[#E9ECEF] dark:border-[#1E232B] bg-[#F8F9FA]/40 dark:bg-[#0D0F12]/40 space-y-2">
              <Clock className="w-6 h-6 text-[#868E96] dark:text-[#71717A] mx-auto opacity-60" />
              <p className="text-xs text-[#868E96] dark:text-[#A1A1AA]">
                No past retail purchases recorded on this account yet.
              </p>
              <Link
                to="/pricing"
                className="text-xs font-bold text-[#FD4A32] hover:underline inline-block"
              >
                Explore 24h &amp; 1-Year Recruitment Passes →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: DPDP Act 2023 Consent & Privacy Rights */}
      <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#1E232B] bg-white dark:bg-[#14171C] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-display font-bold text-sm text-[#121417] dark:text-white">
                DPDP Act 2023 Consent &amp; Privacy Rights
              </h2>
            </div>
            <p className="text-xs text-[#868E96] dark:text-[#A1A1AA]">
              MockFolder processes personal learning records under your explicit, informed consent pursuant to Digital Personal Data Protection Act 2023 §6.
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-display font-black uppercase tracking-wider ${
              consentStatus === 'accepted'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}
          >
            Status: {consentStatus.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0D0F12] border border-[#E9ECEF] dark:border-[#1E232B] text-xs">
          <div>
            <span className="text-[10px] font-bold text-[#868E96] dark:text-[#71717A] uppercase block">
              Policy Version
            </span>
            <span className="font-semibold text-[#121417] dark:text-white">
              v{consentVersion}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#868E96] dark:text-[#71717A] uppercase block">
              Recorded Proof
            </span>
            <span className="font-semibold text-[#121417] dark:text-white">
              {consentTimestamp ? new Date(consentTimestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Session Synchronized'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#868E96] dark:text-[#71717A] uppercase block">
              Data Fiduciary
            </span>
            <span className="font-semibold text-[#121417] dark:text-white">
              MockFolder
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <Link
            to="/privacy-policy"
            className="text-xs text-[#FD4A32] hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>Review Full Privacy Policy &amp; Data Rights</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            type="button"
            disabled={isUpdatingConsent}
            onClick={handleToggleConsent}
            className={`px-3.5 py-1.5 rounded-md text-xs font-display font-bold transition-colors cursor-pointer ${
              consentStatus === 'accepted'
                ? 'border border-[#E9ECEF] dark:border-[#252B35] text-[#868E96] dark:text-gray-400 hover:text-amber-500 hover:border-amber-500/50'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {consentStatus === 'accepted' ? 'Withdraw Consent' : 'Grant Consent'}
          </button>
        </div>
      </div>

      {/* SECTION 4: Account Security & Sign Out */}
      <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#1E232B] bg-white dark:bg-[#14171C] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <h2 className="font-display font-bold text-sm text-[#121417] dark:text-white">
              Account Security &amp; Sessions
            </h2>
          </div>
          <p className="text-xs text-[#868E96] dark:text-[#A1A1AA]">
            Authenticated as <strong className="text-[#121417] dark:text-white">{user?.email}</strong> via Supabase 256-bit encrypted authentication.
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-rose-300 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-display font-bold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
