import { Brain } from 'lucide-react';
import type { ProgressSummaryStats } from '@/services/progress.service';

interface AptitudeStatsWidgetProps {
  stats: ProgressSummaryStats;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'card' | 'embedded';
  showBadges?: boolean;
}

export const AptitudeStatsWidget: React.FC<AptitudeStatsWidgetProps> = ({
  stats,
  title = 'Aptitude Mastery',
  subtitle,
  className = '',
  variant = 'card',
  showBadges = true,
}) => {
  const {
    totalQuestions,
    totalSolved,
    easySolved,
    easyTotal,
    mediumSolved,
    mediumTotal,
    hardSolved,
    hardTotal,
    accuracyRate,
    firstTryAccuracyRate,
    streakDays,
  } = stats;

  // Percentage calculations with subtle precision for early progress (< 1%)
  const rawPct = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;
  const displayPct =
    totalSolved === 0
      ? '0%'
      : rawPct < 0.1
      ? '<0.1%'
      : rawPct < 1
      ? `${rawPct.toFixed(1)}%`
      : `${Math.round(rawPct)}%`;

  const easyPct = easyTotal > 0 ? Math.min(100, Math.round((easySolved / easyTotal) * 100)) : 0;
  const mediumPct = mediumTotal > 0 ? Math.min(100, Math.round((mediumSolved / mediumTotal) * 100)) : 0;
  const hardPct = hardTotal > 0 ? Math.min(100, Math.round((hardSolved / hardTotal) * 100)) : 0;

  // Refined SVG Donut Dimensions
  const radius = 28;
  const strokeWidth = 4.5;
  const circumference = 2 * Math.PI * radius;

  // Arc segments based on solved proportion
  const easyPortion = totalQuestions > 0 ? (easySolved / totalQuestions) * circumference : 0;
  const mediumPortion = totalQuestions > 0 ? (mediumSolved / totalQuestions) * circumference : 0;
  const hardPortion = totalQuestions > 0 ? (hardSolved / totalQuestions) * circumference : 0;

  const easyDashOffset = circumference - easyPortion;
  const mediumDashOffset = circumference - mediumPortion;
  const hardDashOffset = circumference - hardPortion;

  const mediumRotation = totalQuestions > 0 ? (easySolved / totalQuestions) * 360 : 0;
  const hardRotation = totalQuestions > 0 ? ((easySolved + mediumSolved) / totalQuestions) * 360 : 0;

  // Embedded view for Aptitude Category Banner
  if (variant === 'embedded') {
    return (
      <div className={`transition-colors ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* Donut with 4/400 inside */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
              <circle
                cx="35"
                cy="35"
                r={radius}
                className="stroke-[#E9ECEF] dark:stroke-[#262626]"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {easySolved > 0 && (
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  className="stroke-emerald-500 transition-all duration-700 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={easyDashOffset}
                  strokeLinecap="round"
                  fill="none"
                />
              )}
              {mediumSolved > 0 && (
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  className="stroke-amber-500 transition-all duration-700 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={mediumDashOffset}
                  strokeLinecap="round"
                  fill="none"
                  style={{ transformOrigin: 'center', transform: `rotate(${mediumRotation}deg)` }}
                />
              )}
              {hardSolved > 0 && (
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  className="stroke-rose-500 transition-all duration-700 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={hardDashOffset}
                  strokeLinecap="round"
                  fill="none"
                  style={{ transformOrigin: 'center', transform: `rotate(${hardRotation}deg)` }}
                />
              )}
            </svg>
            {/* 4/400 Score Inside Donut Ring */}
            <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none px-1">
              <span className="font-mono font-bold text-xs text-[#121417] dark:text-white tracking-tight leading-none">
                {totalSolved}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Difficulty progress bars */}
          <div className="grid grid-cols-3 gap-3 flex-1 max-w-md">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">Easy</span>
                <span className="text-[#868E96] dark:text-[#666666]">{easySolved}/{easyTotal}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${easyPct}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                <span className="font-display font-bold text-amber-600 dark:text-amber-400">Med</span>
                <span className="text-[#868E96] dark:text-[#666666]">{mediumSolved}/{mediumTotal}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${mediumPct}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                <span className="font-display font-bold text-rose-600 dark:text-rose-400">Hard</span>
                <span className="text-[#868E96] dark:text-[#666666]">{hardSolved}/{hardTotal}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${hardPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card View (Profile Page & Primary Dashboard)
  return (
    <div
      className={`rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-4 sm:p-5 shadow-xs transition-all ${className}`}
    >
      {/* 1. Header Bar: Icon + Title + Subtitle + Clean Monospace Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E9ECEF] dark:border-[#222222]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-[#FD4A32]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#121417] dark:text-white tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-[#868E96] dark:text-[#777777] font-sans">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Cohesive profile micro-chips */}
        {showBadges && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">Streak:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">{streakDays}d</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">Accuracy:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">{accuracyRate > 0 ? `${accuracyRate}%` : '—'}</span>
            </div>
            {firstTryAccuracyRate > 0 && (
              <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
                <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">1st Try:</span>
                <span className="font-extrabold text-[#121417] dark:text-white">{firstTryAccuracyRate}%</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Balanced 4-Column Metric Grid across full width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Overall Mastery */}
        <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
              <circle
                cx="35"
                cy="35"
                r={radius}
                className="stroke-[#E9ECEF] dark:stroke-[#242424]"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {easySolved > 0 && (
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  className="stroke-emerald-500 transition-all duration-700 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={easyDashOffset}
                  strokeLinecap="round"
                  fill="none"
                />
              )}
              {mediumSolved > 0 && (
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  className="stroke-amber-500 transition-all duration-700 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={mediumDashOffset}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${mediumRotation}deg)`,
                  }}
                />
              )}
              {hardSolved > 0 && (
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  className="stroke-rose-500 transition-all duration-700 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={hardDashOffset}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${hardRotation}deg)`,
                  }}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
              <span className="font-mono font-bold text-[10px] text-[#121417] dark:text-white tracking-tight leading-none">
                {displayPct}
              </span>
            </div>
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#777777] block">
              Overall Solved
            </span>
            <div className="font-mono font-extrabold text-sm text-[#121417] dark:text-white">
              {totalSolved}
              <span className="text-xs font-normal text-[#868E96] dark:text-[#555555]">
                /{totalQuestions.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#FD4A32] block">
              {displayPct} Mastered
            </span>
          </div>
        </div>

        {/* Card 2: Easy */}
        <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Easy
            </span>
            <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
              {easySolved}
              <span className="text-[#868E96] dark:text-[#555555] font-normal">
                /{easyTotal.toLocaleString()}
              </span>
            </span>
          </div>
          <div className="space-y-1">
            <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${easyPct}%` }}
              />
            </div>
            <div className="text-right text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
              {easyPct}% completed
            </div>
          </div>
        </div>

        {/* Card 3: Medium */}
        <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Medium
            </span>
            <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
              {mediumSolved}
              <span className="text-[#868E96] dark:text-[#555555] font-normal">
                /{mediumTotal.toLocaleString()}
              </span>
            </span>
          </div>
          <div className="space-y-1">
            <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${mediumPct}%` }}
              />
            </div>
            <div className="text-right text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
              {mediumPct}% completed
            </div>
          </div>
        </div>

        {/* Card 4: Hard */}
        <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Hard
            </span>
            <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
              {hardSolved}
              <span className="text-[#868E96] dark:text-[#555555] font-normal">
                /{hardTotal.toLocaleString()}
              </span>
            </span>
          </div>
          <div className="space-y-1">
            <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${hardPct}%` }}
              />
            </div>
            <div className="text-right text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
              {hardPct}% completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeStatsWidget;
