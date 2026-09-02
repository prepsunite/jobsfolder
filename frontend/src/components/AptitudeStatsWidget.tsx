import React from 'react';
import { Flame, Target, Zap, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { ProgressSummaryStats } from '@/services/progress.service';

interface AptitudeStatsWidgetProps {
  stats: ProgressSummaryStats;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const AptitudeStatsWidget: React.FC<AptitudeStatsWidgetProps> = ({
  stats,
  title = 'Aptitude Mastery & Progress',
  subtitle = 'Track your practice accuracy, difficulty breakdown, and daily streaks.',
  className = '',
}) => {
  const {
    totalQuestions,
    totalSolved,
    totalAttempted,
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

  // Mastery Rank Tier
  let masteryRank = 'Novice Solver';
  let rankColor = 'text-gray-500';
  if (totalPercentage >= 80) {
    masteryRank = 'Aptitude Master 🏆';
    rankColor = 'text-amber-500';
  } else if (totalPercentage >= 50) {
    masteryRank = 'Proficient Solver ⚡';
    rankColor = 'text-purple-500';
  } else if (totalPercentage >= 25) {
    masteryRank = 'Rising Problem Solver 🔥';
    rankColor = 'text-blue-500';
  } else if (totalSolved > 0) {
    masteryRank = 'Active Learner 🌱';
    rankColor = 'text-emerald-500';
  }

  // SVG Circular Donut calculations (LeetCode Style)
  const radius = 60;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;

  const easyPortion = totalQuestions > 0 ? (easySolved / totalQuestions) * circumference : 0;
  const mediumPortion = totalQuestions > 0 ? (mediumSolved / totalQuestions) * circumference : 0;
  const hardPortion = totalQuestions > 0 ? (hardSolved / totalQuestions) * circumference : 0;

  const easyDashOffset = circumference - easyPortion;
  const mediumDashOffset = circumference - mediumPortion;
  const hardDashOffset = circumference - hardPortion;

  const mediumRotation = totalQuestions > 0 ? (easySolved / totalQuestions) * 360 : 0;
  const hardRotation = totalQuestions > 0 ? ((easySolved + mediumSolved) / totalQuestions) * 360 : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#E9ECEF] dark:border-[#262626] bg-white dark:bg-gradient-to-br dark:from-[#161616] dark:via-[#131313] dark:to-[#0F0F0F] shadow-xs p-6 sm:p-7 space-y-6 transition-all duration-300 ${className}`}
    >
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-b from-[#FD4A32]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-t from-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E9ECEF] dark:border-[#222222]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FD4A32]/10 border border-[#FD4A32]/20 text-[#FD4A32] text-[10px] font-display font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#FD4A32]" />
            <span>Progress & Analytics</span>
          </div>

          <h2 className="font-display font-black text-xl sm:text-2xl text-[#121417] dark:text-[#FFFFFF] tracking-tight">
            {title}
          </h2>

          <p className="text-xs text-[#868E96] dark:text-[#666666] font-sans max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Live Performance Metric Badges */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* Daily Streak Flame */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-2xs">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-[#868E96] dark:text-[#777777] leading-none">
                Streak
              </span>
              <span className="text-xs font-display font-black tracking-wide leading-tight">
                {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

          {/* Accuracy Rate */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 shadow-2xs">
            <Target className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-[#868E96] dark:text-[#777777] leading-none">
                Accuracy
              </span>
              <span className="text-xs font-display font-black tracking-wide leading-tight">
                {accuracyRate}%
              </span>
            </div>
          </div>

          {/* First Try Precision */}
          {firstTryAccuracyRate > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 shadow-2xs">
              <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-[#868E96] dark:text-[#777777] leading-none">
                  1st Try
                </span>
                <span className="text-xs font-display font-black tracking-wide leading-tight">
                  {firstTryAccuracyRate}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Showcase */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Circular LeetCode-style Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#F8F9FA]/60 dark:bg-[#181818]/60 border border-[#E9ECEF] dark:border-[#222222]">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 150 150">
              <defs>
                <linearGradient id="easyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="mediumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="hardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
              </defs>

              {/* Background Track Circle */}
              <circle
                cx="75"
                cy="75"
                r={radius}
                className="stroke-[#E9ECEF] dark:stroke-[#262626]"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Easy Segment (Emerald) */}
              {easySolved > 0 && (
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke="url(#easyGradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={easyDashOffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
              )}

              {/* Medium Segment (Amber) */}
              {mediumSolved > 0 && (
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke="url(#mediumGradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={mediumDashOffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${mediumRotation}deg)`,
                  }}
                />
              )}

              {/* Hard Segment (Rose) */}
              {hardSolved > 0 && (
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke="url(#hardGradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={hardDashOffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${hardRotation}deg)`,
                  }}
                />
              )}
            </svg>

            {/* Inner Ring Hero Counters */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="font-display font-black text-3xl sm:text-4xl text-[#121417] dark:text-[#FFFFFF] leading-none tracking-tight">
                {totalSolved}
              </span>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#666666] mt-1">
                / {totalQuestions} Solved
              </span>
              <div className="mt-1.5 px-2 py-0.5 rounded-full bg-[#FD4A32]/10 border border-[#FD4A32]/25">
                <span className="text-[10px] font-mono font-extrabold text-[#FD4A32]">
                  {totalPercentage}% Mastered
                </span>
              </div>
            </div>
          </div>

          {/* Tier Label */}
          <div className="mt-4 flex items-center gap-1.5 text-xs font-display font-extrabold">
            <span className="text-[#868E96] dark:text-[#555555]">Rank:</span>
            <span className={rankColor}>{masteryRank}</span>
          </div>
        </div>

        {/* Right: Difficulty Breakdown Cards */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Easy Level Card */}
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/[0.04] space-y-2 hover:border-emerald-500/35 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Easy
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#121417] dark:text-[#FFFFFF]">
                  {easySolved} <span className="text-[#868E96] dark:text-[#666666]">/ {easyTotal}</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  {easyPct}%
                </span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${easyPct}%` }}
              />
            </div>
          </div>

          {/* Medium Level Card */}
          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/[0.04] space-y-2 hover:border-amber-500/35 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Medium
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#121417] dark:text-[#FFFFFF]">
                  {mediumSolved} <span className="text-[#868E96] dark:text-[#666666]">/ {mediumTotal}</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                  {mediumPct}%
                </span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${mediumPct}%` }}
              />
            </div>
          </div>

          {/* Hard Level Card */}
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/[0.04] space-y-2 hover:border-rose-500/35 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Hard
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#121417] dark:text-[#FFFFFF]">
                  {hardSolved} <span className="text-[#868E96] dark:text-[#666666]">/ {hardTotal}</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300">
                  {hardPct}%
                </span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${hardPct}%` }}
              />
            </div>
          </div>

          {/* Footer Sub-stats */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-[#868E96] dark:text-[#666666] font-sans flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{totalAttempted} unique questions attempted</span>
            </div>

            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#FD4A32]" />
              <span>Target 80%+ accuracy for company cutoffs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeStatsWidget;
