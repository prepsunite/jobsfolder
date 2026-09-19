import React from 'react';
import { Sparkles, ExternalLink, Megaphone } from 'lucide-react';
import { Link } from 'react-router';

interface AdSpaceSlotProps {
  slot?: string;
  variant?: 'skyscraper' | 'rectangle' | 'stacked';
  className?: string;
}

export default function AdSpaceSlot({
  slot = 'default-right-rail',
  variant = 'stacked',
  className = '',
}: AdSpaceSlotProps) {
  return (
    <aside
      className={`space-y-4 ${className}`}
      aria-label="Advertisement Space"
    >
      {/* 1. Primary Display Ad Container (300 × 600 Skyscraper or 300 × 250) */}
      <div className="p-4 rounded-xl border border-dashed border-[#E9ECEF] dark:border-[#262626] bg-[#F8F9FA]/80 dark:bg-[#141414]/80 text-center flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] space-y-3 relative overflow-hidden group shadow-2xs">
        {/* Subtle decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FD4A32]/3 via-transparent to-purple-500/3 pointer-events-none" />

        {/* Ad Badge */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <Megaphone className="w-3 h-3 text-[#868E96] dark:text-[#777777]" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#868E96] dark:text-[#777777]">
            Advertisement
          </span>
        </div>

        {/* Ad Content / Placeholder (Ready for Google AdSense / Carbon / Mediavine) */}
        <div className="space-y-2 max-w-[220px] z-10">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FD4A32] flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-display font-bold text-xs text-[#121417] dark:text-white">
            Placement Partner Ad Space
          </h4>
          <p className="text-[11px] text-[#868E96] dark:text-[#666666] leading-relaxed">
            Reserved for hiring partner banners, campus drives, or Google AdSense (300 × 600 / 300 × 250).
          </p>
        </div>

        <div className="pt-2 text-[9px] font-mono text-[#ADB5BD] dark:text-[#555555]">
          Slot ID: {slot}
        </div>
      </div>

      {/* 2. Platform Feature Spotlight / In-house Sponsor Banner */}
      <div className="p-4 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
            Featured
          </span>
          <span className="text-[10px] text-[#868E96] dark:text-[#666666]">Campus CRT</span>
        </div>
        <h5 className="font-display font-bold text-xs text-[#121417] dark:text-white">
          Company Mock Exams
        </h5>
        <p className="text-[11px] text-[#495057] dark:text-[#999999] leading-relaxed">
          Practice company-specific aptitude &amp; technical rounds with TCS, Infosys, Cognizant, and Wipro test patterns.
        </p>
        <Link
          to="/student/exams"
          className="inline-flex items-center gap-1 text-xs font-display font-bold text-[#FD4A32] hover:text-[#e03e28] transition-colors"
        >
          <span>Explore Mock Tests</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
