import React from 'react';
import { Flame, Target, Zap } from 'lucide-react';
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

  // SVG Circular Donut calculations (LeetCode style)
  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  // Fractions of total circumference contributed by each difficulty
  const easyPortion = totalQuestions > 0 ? (easySolved / totalQuestions) * circumference : 0;
  const mediumPortion = totalQuestions > 0 ? (mediumSolved / totalQuestions) * circumference : 0;
  const hardPortion = totalQuestions > 0 ? (hardSolved / totalQuestions) * circumference : 0;

  const easyDashOffset = circumference - easyPortion;
  const mediumDashOffset = circumference - mediumPortion;
  const hardDashOffset = circumference - hardPortion;

  // Rotations for segments to wrap seamlessly
  const mediumRotation = totalQuestions > 0 ? (easySolved / totalQuestions) * 360 : 0;
  const hardRotation = totalQuestions > 0 ? ((easySolved + mediumSolved) / totalQuestions) * 360 : 0;

  return (
    <div className={`p-5 sm:p-6 bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-2xl shadow-xs space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9ECEF] dark:border-[#242424] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FD4A32] animate-pulse" />
            <h3 className="font-display font-bold text-base sm:text-lg text-[#121417] dark:text-[#FFFFFF] tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Streak & Accuracy Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-display font-extrabold uppercase tracking-wider">
              {streakDays} {streakDays === 1 ? 'Day' : 'Days'} Streak
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <Target className="w-4 h-4" />
            <span className="text-xs font-display font-extrabold uppercase tracking-wider">
              {accuracyRate}% Accuracy
            </span>
          </div>

          {firstTryAccuracyRate > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span className="text-xs font-display font-extrabold uppercase tracking-wider">
                {firstTryAccuracyRate}% 1st Try
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Donut Chart */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
              {/* Background Track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-[#E9ECEF] dark:stroke-[#242424]"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Easy Arc (Emerald) */}
              {easySolved > 0 && (
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  className="stroke-emerald-500 transition-all duration-700 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={easyDashOffset}
                  strokeLinecap="round"
                  fill="none"
                />
              )}

              {/* Medium Arc (Amber) */}
              {mediumSolved > 0 && (
                <circle
                  cx="65"
                  cy="65"
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

              {/* Hard Arc (Rose) */}
              {hardSolved > 0 && (
                <circle
                  cx="65"
                  cy="65"
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

            {/* Centered Numbers */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#121417] dark:text-[#FFFFFF] leading-none">
                {totalSolved}
              </span>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] mt-1">
                / {totalQuestions} Solved
              </span>
              <span className="text-[11px] font-mono font-bold text-[#FD4A32] mt-0.5">
                {totalPercentage}%
              </span>
            </div>
          </div>

          <span className="text-[11px] text-[#868E96] dark:text-[#555555] font-sans mt-3 text-center">
            {totalSolved === 0
              ? 'Start solving questions below to boost your rank!'
              : `${totalQuestions - totalSolved} questions remaining in this curriculum.`}
          </span>
        </div>

        {/* Right: Difficulty Progress Bars (LeetCode Style) */}
        <div className="md:col-span-8 space-y-4">
          {/* Easy Bar */}
          <div className="space-y-1.5 p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2E2E2E]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-display font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Easy
                </span>
              </div>
              <div className="font-mono text-xs text-[#121417] dark:text-[#FFFFFF]">
                <strong className="font-extrabold">{easySolved}</strong>
                <span className="text-[#868E96] dark:text-[#666666]"> / {easyTotal}</span>
                <span className="text-[#868E96] dark:text-[#666666] ml-2">({easyPct}%)</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E9ECEF] dark:bg-[#2A2A2A] overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${easyPct}%` }}
              />
            </div>
          </div>

          {/* Medium Bar */}
          <div className="space-y-1.5 p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2E2E2E]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-display font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Medium
                </span>
              </div>
              <div className="font-mono text-xs text-[#121417] dark:text-[#FFFFFF]">
                <strong className="font-extrabold">{mediumSolved}</strong>
                <span className="text-[#868E96] dark:text-[#666666]"> / {mediumTotal}</span>
                <span className="text-[#868E96] dark:text-[#666666] ml-2">({mediumPct}%)</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E9ECEF] dark:bg-[#2A2A2A] overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${mediumPct}%` }}
              />
            </div>
          </div>

          {/* Hard Bar */}
          <div className="space-y-1.5 p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2E2E2E]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="font-display font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Hard
                </span>
              </div>
              <div className="font-mono text-xs text-[#121417] dark:text-[#FFFFFF]">
                <strong className="font-extrabold">{hardSolved}</strong>
                <span className="text-[#868E96] dark:text-[#666666]"> / {hardTotal}</span>
                <span className="text-[#868E96] dark:text-[#666666] ml-2">({hardPct}%)</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E9ECEF] dark:bg-[#2A2A2A] overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${hardPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeStatsWidget;
