import React, { useState } from 'react';
import { Link } from 'react-router';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Info, X } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface AdSpaceSlotProps {
  slot?: string;
  variant?: 'skyscraper' | 'rectangle' | 'stacked' | 'banner';
  className?: string;
}

export default function AdSpaceSlot({
  slot = 'default-right-rail',
  variant = 'skyscraper',
  className = '',
}: AdSpaceSlotProps) {
  const { isAdFree, isLoading } = useSubscription();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // 🛡️ PRO & ULTRA RULE: Subscribed & Admin candidates receive ZERO ads across the platform!
  if (isAdFree || isLoading || isDismissed) {
    return null;
  }

  // Pseudo-randomly rotate ad creative based on slot ID to keep experience fresh
  const adCreatives = [
    {
      tag: 'PrepUnite Pro • Ad-Free',
      badge: 'PRO PASS • ₹129/MO',
      title: 'Tired of distractions?',
      desc: 'Upgrade to PrepUnite Pro for a 100% ad-free experience, plus full access to 50+ company past papers and 5 blueprint mock exams.',
      cta: 'Remove Ads with Pro',
      ctaLink: '/pricing',
      accentColor: 'from-[#FD4A32]/15 via-[#FD4A32]/5 to-transparent',
    },
    {
      tag: 'PrepUnite Ultra • Unlimited',
      badge: 'ULTRA PASS • BEST VALUE',
      title: 'Crack Your Next OA',
      desc: 'Get 100% Ad-Free practice with unlimited timed proctored mocks modeled after TCS NQT, Accenture, and Amazon placement patterns.',
      cta: 'Get Ultra (₹169/mo)',
      ctaLink: '/pricing',
      accentColor: 'from-amber-500/15 via-amber-500/5 to-transparent',
    },
    {
      tag: 'Placement Blueprints',
      badge: '50+ COMPANY ARCHIVES',
      title: 'Real Drive Questions',
      desc: 'Study verified memory questions reconstructed by students who sat recent placement drives. Solved code & test-cases.',
      cta: 'Unlock Papers from ₹59',
      ctaLink: '/pricing',
      accentColor: 'from-purple-500/15 via-purple-500/5 to-transparent',
    },
  ];

  // Pick creative based on slot string hash
  const creativeIndex = Math.abs(
    slot.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % adCreatives.length;

  const currentAd = adCreatives[creativeIndex];

  return (
    <aside
      className={`relative w-full rounded-2xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] overflow-hidden shadow-xs transition-all ${className}`}
      aria-label="Sponsored Space"
      data-slot-id={slot}
    >
      {/* Subtle Gradient Backlight */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentAd.accentColor} pointer-events-none`} />

      <div className="relative p-4 sm:p-5 flex flex-col justify-between min-h-[300px] space-y-4">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-[#E9ECEF]/70 dark:border-[#242424]/70 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#868E96] dark:text-[#666666] uppercase">
              SPONSORED
            </span>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-[#868E96] dark:text-[#666666] hover:text-[#121417] dark:hover:text-white transition-colors cursor-pointer"
                title="Why am I seeing this?"
              >
                <Info className="w-3 h-3" />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-4 z-50 w-52 p-2.5 rounded-lg bg-[#121417] text-white text-[10px] leading-relaxed shadow-xl animate-fadeIn">
                  The Basic Free tier is ad-supported to keep placement questions accessible. Upgrade to <strong>Pro</strong> or <strong>Ultra</strong> for a 100% ad-free experience.
                </div>
              )}
            </div>
          </div>

          <Link
            to="/pricing"
            className="text-[10px] font-display font-bold text-[#FD4A32] hover:text-[#E0351D] flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>Go Ad-Free</span>
            <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Ad Body Content */}
        <div className="space-y-2.5 my-auto">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] text-[10px] font-display font-bold uppercase tracking-wider">
            <Zap className="w-3 h-3" />
            <span>{currentAd.badge}</span>
          </div>

          <h4 className="font-display font-extrabold text-base text-[#121417] dark:text-white tracking-tight leading-snug">
            {currentAd.title}
          </h4>

          <p className="text-xs text-[#495057] dark:text-[#999999] leading-relaxed font-sans">
            {currentAd.desc}
          </p>

          <div className="pt-1 flex items-center gap-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Ad-Free on Pro &amp; Ultra</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2 border-t border-[#E9ECEF]/70 dark:border-[#242424]/70 space-y-2">
          <Link
            to={currentAd.ctaLink}
            className="w-full py-2.5 px-3 rounded-xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider text-center transition-all shadow-xs shadow-[#FD4A32]/20 flex items-center justify-center gap-1.5 cursor-pointer block"
          >
            <span>{currentAd.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="text-center">
            <span className="text-[9px] text-[#868E96] dark:text-[#555555]">
              Basic Tier Ad • Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
