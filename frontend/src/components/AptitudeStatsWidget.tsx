import React from 'react';
import { Flame, Target, Zap, Brain } from 'lucide-react';
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
      className={`rounded-2xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-5 sm:p-6 shadow-xs transition-all ${className}`}
    >
      {/* 1. Header Bar: Icon + Title + Subtitle + Micro Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E9ECEF] dark:border-[#222222]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center shrink-0 shadow-2xs">
            <Brain className="w-4.5 h-4.5 text-[#FD4A32]" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm sm:text-base text-[#121417] dark:text-white tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-[#868E96] dark:text-[#777777] font-sans">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Badges in header */}
        {showBadges && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-display font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streakDays}d Streak</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-[11px] font-display font-bold">
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span>{accuracyRate > 0 ? `${accuracyRate}%` : '—'} Accuracy</span>
            </div>

            {firstTryAccuracyRate > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-display font-bold">
                <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                <span>{firstTryAccuracyRate}% 1st Try</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Content Row: Donut Metric + 3 Difficulty Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Metric Hero: Radial Gauge + Count (4 cols) */}
        <div className="lg:col-span-4 flex items-center gap-4 p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF]/70 dark:border-[#242424]">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
              {/* Background Track */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                className="stroke-[#E9ECEF] dark:stroke-[#2B2B2B]"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Easy Arc */}
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

              {/* Medium Arc */}
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

              {/* Hard Arc */}
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
            {/* 4/400 Score Inside Donut Ring */}
            <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none px-1">
              <span className="font-mono font-bold text-xs sm:text-sm text-[#121417] dark:text-white tracking-tight leading-none">
                {totalSolved}/{totalQuestions}
              </span>
            </div>
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-display font-bold bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20">
                {displayPct} Mastered
              </span>
            </div>
          </div>
        </div>

        {/* Right: 3 Refined Difficulty Cards (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Easy Card */}
          <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF]/70 dark:border-[#242424] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Easy
              </span>
              <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
                {easySolved}
                <span className="text-[#868E96] dark:text-[#666666] font-normal"> / {easyTotal.toLocaleString()}</span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#2B2B2B] overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${easyPct}%` }}
              />
            </div>
            <div className="text-right text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
              {easyPct}% Completed
            </div>
          </div>

          {/* Medium Card */}
          <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF]/70 dark:border-[#242424] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Medium
              </span>
              <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
                {mediumSolved}
                <span className="text-[#868E96] dark:text-[#666666] font-normal"> / {mediumTotal.toLocaleString()}</span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#2B2B2B] overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${mediumPct}%` }}
              />
            </div>
            <div className="text-right text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
              {mediumPct}% Completed
            </div>
          </div>

          {/* Hard Card */}
          <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF]/70 dark:border-[#242424] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Hard
              </span>
              <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
                {hardSolved}
                <span className="text-[#868E96] dark:text-[#666666] font-normal"> / {hardTotal.toLocaleString()}</span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#2B2B2B] overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${hardPct}%` }}
              />
            </div>
            <div className="text-right text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
              {hardPct}% Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeStatsWidget;
