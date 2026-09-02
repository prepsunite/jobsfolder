import React from 'react';
import { Flame, Target, Zap } from 'lucide-react';
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

  const totalPercentage = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;
  const easyPct = easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0;
  const mediumPct = mediumTotal > 0 ? Math.round((mediumSolved / mediumTotal) * 100) : 0;
  const hardPct = hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0;

  // Mini SVG Donut Dimensions
  const radius = 24;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius;

  const easyPortion = totalQuestions > 0 ? (easySolved / totalQuestions) * circumference : 0;
  const mediumPortion = totalQuestions > 0 ? (mediumSolved / totalQuestions) * circumference : 0;
  const hardPortion = totalQuestions > 0 ? (hardSolved / totalQuestions) * circumference : 0;

  const easyDashOffset = circumference - easyPortion;
  const mediumDashOffset = circumference - mediumPortion;
  const hardDashOffset = circumference - hardPortion;

  const mediumRotation = totalQuestions > 0 ? (easySolved / totalQuestions) * 360 : 0;
  const hardRotation = totalQuestions > 0 ? ((easySolved + mediumSolved) / totalQuestions) * 360 : 0;

  const containerClasses =
    variant === 'embedded'
      ? `transition-colors ${className}`
      : `p-3.5 sm:p-4 rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs transition-colors ${className}`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* 1. Left: Compact Donut + Counts */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
              {/* Background Track */}
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="stroke-[#E9ECEF] dark:stroke-[#262626]"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Easy Arc */}
              {easySolved > 0 && (
                <circle
                  cx="30"
                  cy="30"
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
                  cx="30"
                  cy="30"
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
                  cx="30"
                  cy="30"
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

            <span className="absolute font-display font-black text-[11px] text-[#121417] dark:text-[#FFFFFF]">
              {totalPercentage}%
            </span>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-display font-black text-base text-[#121417] dark:text-[#FFFFFF] leading-none">
                {totalSolved}
              </span>
              <span className="text-xs font-bold text-[#868E96] dark:text-[#666666]">
                / {totalQuestions} Solved
              </span>
            </div>
            <div className="text-[11px] font-display font-semibold text-[#868E96] dark:text-[#777777] truncate">
              {title}
            </div>
          </div>
        </div>

        {/* 2. Middle: Side-by-Side 3 Difficulty Progress Bars */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 flex-1 max-w-xl">
          {/* Easy */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono leading-none">
              <span className="font-display font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                Easy
              </span>
              <span className="font-bold text-[#868E96] dark:text-[#666666]">
                {easySolved}/{easyTotal}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${easyPct}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono leading-none">
              <span className="font-display font-extrabold text-amber-600 dark:text-amber-400 uppercase">
                Med
              </span>
              <span className="font-bold text-[#868E96] dark:text-[#666666]">
                {mediumSolved}/{mediumTotal}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${mediumPct}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono leading-none">
              <span className="font-display font-extrabold text-rose-600 dark:text-rose-400 uppercase">
                Hard
              </span>
              <span className="font-bold text-[#868E96] dark:text-[#666666]">
                {hardSolved}/{hardTotal}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${hardPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Right: Compact Performance Badges */}
        {showBadges && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-[11px] font-display font-black">
                {streakDays}d Streak
              </span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px] font-display font-black">
                {accuracyRate}% Acc
              </span>
            </div>

            {firstTryAccuracyRate > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                <span className="text-[11px] font-display font-black">
                  {firstTryAccuracyRate}% 1st
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeStatsWidget;
