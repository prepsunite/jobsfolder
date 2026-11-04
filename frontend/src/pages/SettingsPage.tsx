import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
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
  Clock,
  Zap,
  LogOut,
  LayoutDashboard,
  User,
  Sparkles,
  Lock,
  ChevronRight,
  Check,
} from 'lucide-react';

type SettingsTab = 'billing' | 'appearance' | 'privacy' | 'security';

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
  const { user, isAdmin, logout } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { consentStatus, consentTimestamp, consentVersion, withdrawConsent, acceptConsent } = useConsent();

  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') as SettingsTab | null;
  const activeTab: SettingsTab =
    rawTab && ['billing', 'appearance', 'privacy', 'security'].includes(rawTab)
      ? rawTab
      : 'billing';

  const setTab = (tab: SettingsTab) => {
    setSearchParams({ tab });
  };

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

  const choices: {
    id: SettingsTab;
    label: string;
    caption: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'billing',
      label: 'Billing & Passes',
      caption: 'Active passes & receipts',
      icon: CreditCard,
      badge: isUserPro ? 'Pro Active' : undefined,
    },
    {
      id: 'appearance',
      label: 'Appearance',
      caption: 'Light & cold carbon dark',
      icon: Sun,
    },
    {
      id: 'privacy',
      label: 'Consent & Privacy',
      caption: 'DPDP Act 2023 rights',
      icon: ShieldCheck,
      badge: consentStatus === 'accepted' ? 'Consented' : 'Withdrawn',
    },
    {
      id: 'security',
      label: 'Account Security',
      caption: 'Auth & session logout',
      icon: Lock,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12 font-sans">
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
      <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#17181F] bg-white dark:bg-[#0D0E12] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/25 flex items-center justify-center font-bold shrink-0">
            <Settings className="w-6 h-6 text-[#FD4A32]" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-white tracking-tight">
              Settings &amp; Preferences
            </h1>
            <p className="text-xs text-[#868E96] dark:text-[#A1A1AA] mt-0.5">
              Choose a section below to configure your display appearance, past billing purchases, and privacy rights.
            </p>
          </div>
        </div>
      </div>

      {/* Choice Selector & Content Area */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Navigation Column */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {/* Mobile horizontal scrolling pills */}
          <div className="flex md:hidden overflow-x-auto gap-2 pb-1 no-scrollbar">
            {choices.map((choice) => {
              const Icon = choice.icon;
              const isActive = activeTab === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => setTab(choice.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#FD4A32] text-white border-[#FD4A32] shadow-sm'
                      : 'bg-white dark:bg-[#0D0E12] text-[#495057] dark:text-[#A1A1AA] border-[#E9ECEF] dark:border-[#17181F] hover:text-[#121417] dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{choice.label}</span>
                  {choice.badge && (
                    <span
                      className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FD4A32]/10 dark:bg-[#FD4A32]/20 text-[#FD4A32]'
                      }`}
                    >
                      {choice.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop vertical choice list */}
          <div className="hidden md:flex flex-col gap-1.5 p-2 rounded-2xl border border-[#E9ECEF] dark:border-[#17181F] bg-white dark:bg-[#0D0E12] shadow-xs">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#868E96] dark:text-[#71717A]">
              Navigation
            </div>
            {choices.map((choice) => {
              const Icon = choice.icon;
              const isActive = activeTab === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => setTab(choice.id)}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#FD4A32]/10 dark:bg-[#FD4A32]/15 text-[#FD4A32] dark:text-white border-[#FD4A32]/30 dark:border-[#FD4A32]/40 shadow-xs dark:shadow-[0_0_12px_rgba(253,74,50,0.15)]'
                      : 'border-transparent text-[#495057] dark:text-[#A1A1AA] hover:text-[#121417] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#13141A]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-[#FD4A32] text-white shadow-xs'
                        : 'bg-black/5 dark:bg-[#07080A] text-[#868E96] dark:text-[#71717A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-display font-bold text-xs truncate">
                        {choice.label}
                      </span>
                      {choice.badge && (
                        <span
                          className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full shrink-0 ${
                            isActive
                              ? 'bg-[#FD4A32]/20 text-[#FD4A32] dark:text-orange-300 border border-[#FD4A32]/30'
                              : 'bg-black/5 dark:bg-[#07080A] text-[#868E96] dark:text-[#71717A]'
                          }`}
                        >
                          {choice.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#868E96] dark:text-[#71717A] block truncate">
                      {choice.caption}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive
                        ? 'text-[#FD4A32] dark:text-white translate-x-0.5'
                        : 'text-neutral-400 opacity-40'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Choice Detail Pane */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* CHOICE 1: Billing & Passes */}
          {activeTab === 'billing' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#17181F] bg-white dark:bg-[#0D0E12] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-emerald-500" />
                      <h2 className="font-display font-bold text-base text-[#121417] dark:text-white">
                        Billing &amp; Past Purchases
                      </h2>
                    </div>
                    <p className="text-xs text-[#868E96] dark:text-[#A1A1AA]">
                      View your active pass memberships and receipt history for all unlocked company exams.
                    </p>
                  </div>

                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FD4A32] hover:bg-[#e03e28] text-white text-xs font-display font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Explore Passes</span>
                  </Link>
                </div>

                {/* Current Entitlement Summary Card */}
                <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#07080A] border border-[#E9ECEF] dark:border-[#17181F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-[#121417] dark:text-white uppercase tracking-wider block">
                    Transaction History
                  </span>

                  {isPurchasesLoading ? (
                    <div className="p-8 text-center text-xs text-[#868E96] dark:text-[#71717A]">
                      Loading billing records...
                    </div>
                  ) : purchaseHistory.length > 0 ? (
                    <div className="space-y-2">
                      {purchaseHistory.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-lg border border-[#E9ECEF] dark:border-[#17181F] bg-[#F8F9FA]/60 dark:bg-[#07080A]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
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
                    <div className="p-8 text-center rounded-xl border border-[#E9ECEF] dark:border-[#17181F] bg-[#F8F9FA]/40 dark:bg-[#07080A]/40 space-y-2">
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
            </div>
          )}

          {/* CHOICE 2: Appearance & Theme */}
          {activeTab === 'appearance' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#17181F] bg-white dark:bg-[#0D0E12] shadow-xs space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-[#FD4A32]" />
                    <h2 className="font-display font-bold text-base text-[#121417] dark:text-white">
                      Appearance &amp; Theme
                    </h2>
                  </div>
                  <p className="text-xs text-[#868E96] dark:text-[#A1A1AA]">
                    Customize how Prepunite looks on your screen. Choose between clean light contrast, pitch-dark obsidian mode (#000000), or automatic system sync.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Light Mode */}
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      themeMode === 'light'
                        ? 'border-[#FD4A32] bg-[#FD4A32]/5 ring-1 ring-[#FD4A32]'
                        : 'border-[#E9ECEF] dark:border-[#17181F] bg-[#F8F9FA] dark:bg-[#07080A] hover:border-[#FD4A32]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
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
                        : 'border-[#E9ECEF] dark:border-[#17181F] bg-[#F8F9FA] dark:bg-[#07080A] hover:border-[#FD4A32]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Moon className="w-5 h-5 text-indigo-400" />
                      {themeMode === 'dark' && (
                        <CheckCircle2 className="w-4 h-4 text-[#FD4A32]" />
                      )}
                    </div>
                    <span className="font-display font-bold text-xs text-[#121417] dark:text-white block">
                      Dark Mode (Pitch Obsidian)
                    </span>
                    <span className="text-[10px] text-[#868E96] dark:text-[#71717A] block mt-0.5">
                      Pure pitch dark &amp; glowing ember
                    </span>
                  </button>

                  {/* System Auto */}
                  <button
                    type="button"
                    onClick={() => setThemeMode('system')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      themeMode === 'system'
                        ? 'border-[#FD4A32] bg-[#FD4A32]/5 ring-1 ring-[#FD4A32]'
                        : 'border-[#E9ECEF] dark:border-[#17181F] bg-[#F8F9FA] dark:bg-[#07080A] hover:border-[#FD4A32]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
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

                <div className="p-3.5 rounded-xl border border-[#E9ECEF] dark:border-[#17181F] bg-[#F8F9FA]/70 dark:bg-[#07080A]/70 text-xs text-[#868E96] dark:text-[#888888] flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Current active theme is <strong className="text-[#121417] dark:text-white capitalize">{themeMode}</strong>. Theme preference is automatically persisted across browser sessions.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CHOICE 3: Consent & Privacy */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#17181F] bg-white dark:bg-[#0D0E12] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h2 className="font-display font-bold text-base text-[#121417] dark:text-white">
                        DPDP Act 2023 Consent &amp; Privacy Rights
                      </h2>
                    </div>
                    <p className="text-xs text-[#868E96] dark:text-[#A1A1AA]">
                      MockFolder processes personal learning records under your explicit, informed consent pursuant to Digital Personal Data Protection Act 2023 §6.
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-display font-black uppercase tracking-wider shrink-0 ${
                      consentStatus === 'accepted'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    Status: {consentStatus.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#07080A] border border-[#E9ECEF] dark:border-[#17181F] text-xs">
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
                      {consentTimestamp
                        ? new Date(consentTimestamp).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Session Synchronized'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#868E96] dark:text-[#71717A] uppercase block">
                      Data Fiduciary
                    </span>
                    <span className="font-semibold text-[#121417] dark:text-white">
                      MockFolder / Prepunite
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
                    className={`px-4 py-2 rounded-lg text-xs font-display font-bold transition-colors cursor-pointer ${
                      consentStatus === 'accepted'
                        ? 'border border-[#E9ECEF] dark:border-[#252B35] text-[#868E96] dark:text-gray-400 hover:text-amber-500 hover:border-amber-500/50'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {consentStatus === 'accepted' ? 'Withdraw Consent' : 'Grant Consent'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CHOICE 4: Account Security */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-6 rounded-xl border border-[#E9ECEF] dark:border-[#17181F] bg-white dark:bg-[#0D0E12] shadow-xs space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-500" />
                    <h2 className="font-display font-bold text-base text-[#121417] dark:text-white">
                      Account Security &amp; Sessions
                    </h2>
                  </div>
                  <p className="text-xs text-[#868E96] dark:text-[#A1A1AA]">
                    Authenticated session and credential management.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#07080A] border border-[#E9ECEF] dark:border-[#17181F] space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#868E96] dark:text-[#71717A]">Logged In As:</span>
                    <strong className="text-[#121417] dark:text-white font-mono">{user?.email || 'Authenticated User'}</strong>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#868E96] dark:text-[#71717A]">Encryption Protocol:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Supabase AES-256 JWT TLS 1.3</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#868E96] dark:text-[#71717A]">Account Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active &amp; Verified</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-[#868E96] dark:text-[#71717A]">
                    Terminate active session from this device.
                  </p>

                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-rose-300 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-xs font-display font-bold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
