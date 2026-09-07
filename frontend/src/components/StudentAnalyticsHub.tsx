import React, { useState } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import type { ProgressSummaryStats } from '@/services/progress.service';
import { technicalService } from '@/services/technical.service';
import { interviewService } from '@/services/interview.service';
import {
  Brain,
  Terminal,
  MessageSquareQuote,
  Code2,
  Layers,
  HelpCircle,
  Cpu,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export type AnalyticsTab = 'aptitude' | 'technical' | 'interview';

interface StudentAnalyticsHubProps {
  stats: ProgressSummaryStats;
  isLoading?: boolean;
  className?: string;
}

const STORAGE_KEY = 'prepunite_dashboard_analytics_tab';

export const StudentAnalyticsHub: React.FC<StudentAnalyticsHubProps> = ({
  stats,
  isLoading = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as AnalyticsTab;
      if (saved && ['aptitude', 'technical', 'interview'].includes(saved)) {
        return saved;
      }
    }
    return 'aptitude';
  });

  const handleTabChange = (tab: AnalyticsTab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem(STORAGE_KEY, tab);
    } catch {}
  };

  // Queries for Technical & Interview data
  const { data: techStats } = useQuery({
    queryKey: ['technical-stats-summary'],
    queryFn: () => technicalService.getStats(),
    staleTime: 10 * 1000,
  });

  const { data: interviewStats } = useQuery({
    queryKey: ['interview-stats-summary'],
    queryFn: () => interviewService.getStats(),
    staleTime: 10 * 1000,
  });

  // --- Donut Helper Calculations ---
  const radius = 28;
  const strokeWidth = 4.5;
  const circumference = 2 * Math.PI * radius;

  // Aptitude Metrics
  const {
    totalQuestions: aptTotal = 0,
    totalSolved: aptSolved = 0,
    totalAttempted: aptAttempted = 0,
    easySolved = 0,
    easyTotal = 0,
    mediumSolved = 0,
    mediumTotal = 0,
    hardSolved = 0,
    hardTotal = 0,
    accuracyRate = 0,
    firstTryAccuracyRate = 0,
    streakDays = 0,
  } = stats;

  const aptRawPct = aptTotal > 0 ? (aptSolved / aptTotal) * 100 : 0;
  const aptDisplayPct =
    aptSolved === 0
      ? '0%'
      : aptRawPct < 0.1
      ? '<0.1%'
      : aptRawPct < 1
      ? `${aptRawPct.toFixed(1)}%`
      : `${Math.round(aptRawPct)}%`;

  const easyPct = easyTotal > 0 ? Math.min(100, Math.round((easySolved / easyTotal) * 100)) : 0;
  const mediumPct = mediumTotal > 0 ? Math.min(100, Math.round((mediumSolved / mediumTotal) * 100)) : 0;
  const hardPct = hardTotal > 0 ? Math.min(100, Math.round((hardSolved / hardTotal) * 100)) : 0;

  const easyPortion = aptTotal > 0 ? (easySolved / aptTotal) * circumference : 0;
  const mediumPortion = aptTotal > 0 ? (mediumSolved / aptTotal) * circumference : 0;
  const hardPortion = aptTotal > 0 ? (hardSolved / aptTotal) * circumference : 0;
  const easyDashOffset = circumference - easyPortion;
  const mediumDashOffset = circumference - mediumPortion;
  const hardDashOffset = circumference - hardPortion;
  const mediumRotation = aptTotal > 0 ? (easySolved / aptTotal) * 360 : 0;
  const hardRotation = aptTotal > 0 ? ((easySolved + mediumSolved) / aptTotal) * 360 : 0;

  // Technical Metrics
  const codingTotal = techStats?.totalCoding ?? 0;
  const codingSolved = techStats?.totalSolved ?? 0;
  const codingPct = techStats?.percentage ?? 0;
  const p150Total = techStats?.p150Total ?? 0;
  const p150Solved = techStats?.p150Solved ?? 0;
  const p150Pct = p150Total > 0 ? Math.min(100, Math.round((p150Solved / p150Total) * 100)) : 0;
  const dsaTotal = techStats?.dsaTotal ?? 0;
  const dsaSolved = techStats?.dsaSolved ?? 0;
  const dsaPct = dsaTotal > 0 ? Math.min(100, Math.round((dsaSolved / dsaTotal) * 100)) : 0;
  const mcqTotal = techStats?.mcqTotal ?? 0;
  const codingPortion = codingTotal > 0 ? (codingSolved / codingTotal) * circumference : 0;
  const codingDashOffset = circumference - codingPortion;

  // Interview Metrics
  const intTotal = interviewStats?.totalQuestions ?? 0;
  const intMastered = interviewStats?.masteredCount ?? 0;
  const intPct = interviewStats?.percentage ?? 0;
  const coreCsTotal = interviewStats?.coreCsTotal ?? 0;
  const coreCsMastered = interviewStats?.coreCsMastered ?? 0;
  const coreCsPct = coreCsTotal > 0 ? Math.min(100, Math.round((coreCsMastered / coreCsTotal) * 100)) : 0;
  const hrTotal = interviewStats?.hrTotal ?? 0;
  const hrMastered = interviewStats?.hrMastered ?? 0;
  const hrPct = hrTotal > 0 ? Math.min(100, Math.round((hrMastered / hrTotal) * 100)) : 0;
  const projTotal = interviewStats?.projectTotal ?? 0;
  const projMastered = interviewStats?.projectMastered ?? 0;
  const projPct = projTotal > 0 ? Math.min(100, Math.round((projMastered / projTotal) * 100)) : 0;
  const intPortion = intTotal > 0 ? (intMastered / intTotal) * circumference : 0;
  const intDashOffset = circumference - intPortion;

  if (isLoading) {
    return (
      <div className={`rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-4 sm:p-5 shadow-xs animate-pulse ${className}`}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E9ECEF] dark:border-[#222222]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-[#242424]" />
            <div className="space-y-1">
              <div className="h-4 w-36 bg-gray-200 dark:bg-[#242424] rounded" />
              <div className="h-3 w-48 bg-gray-200 dark:bg-[#242424] rounded" />
            </div>
          </div>
          <div className="h-8 w-64 bg-gray-200 dark:bg-[#242424] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-4 sm:p-5 shadow-xs transition-all ${className}`}>
      {/* 1. Header Bar: Dynamic Title & Interactive 3-Tab Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E9ECEF] dark:border-[#222222]">
        {/* Dynamic Left Header Info */}
        <div className="flex items-center gap-2.5">
          {activeTab === 'aptitude' && (
            <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 border border-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-[#FD4A32]" />
            </div>
          )}
          {activeTab === 'technical' && (
            <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 border border-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4 text-[#FD4A32]" />
            </div>
          )}
          {activeTab === 'interview' && (
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <MessageSquareQuote className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-[#121417] dark:text-white tracking-tight">
                {activeTab === 'aptitude' && 'Aptitude & Reasoning Mastery'}
                {activeTab === 'technical' && 'Technical & Coding Hub'}
                {activeTab === 'interview' && 'Interview Preparation Bible'}
              </h3>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-[#868E96] dark:text-[#AAAAAA]">
                Analytics
              </span>
            </div>
            <p className="text-[11px] text-[#868E96] dark:text-[#777777] font-sans">
              {activeTab === 'aptitude' && 'Question accuracy, difficulty distribution, and active problem-solving streaks'}
              {activeTab === 'technical' && 'Programming 150 foundations, 15 campus DSA patterns, and OA pseudo-code traps'}
              {activeTab === 'interview' && 'Core CS fundamentals (DBMS, OOPs, OS, CN), HR STAR answers, and project defense'}
            </p>
          </div>
        </div>

        {/* 3 Interactive Tab Selector Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] self-start lg:self-auto gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('aptitude')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'aptitude'
                ? 'bg-white dark:bg-[#1F1F1F] text-[#121417] dark:text-white shadow-xs border border-[#E9ECEF] dark:border-[#2D2D2D]'
                : 'text-[#868E96] dark:text-[#777777] hover:text-[#121417] dark:hover:text-white'
            }`}
          >
            <Brain className={`w-3.5 h-3.5 ${activeTab === 'aptitude' ? 'text-[#FD4A32]' : 'text-current'}`} />
            <span>Aptitude</span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'aptitude' ? 'bg-[#FD4A32]/10 text-[#FD4A32]' : 'bg-black/5 dark:bg-white/5'
            }`}>
              {aptSolved}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('technical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'technical'
                ? 'bg-white dark:bg-[#1F1F1F] text-[#121417] dark:text-white shadow-xs border border-[#E9ECEF] dark:border-[#2D2D2D]'
                : 'text-[#868E96] dark:text-[#777777] hover:text-[#121417] dark:hover:text-white'
            }`}
          >
            <Code2 className={`w-3.5 h-3.5 ${activeTab === 'technical' ? 'text-[#FD4A32]' : 'text-current'}`} />
            <span>Coding</span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'technical' ? 'bg-[#FD4A32]/10 text-[#FD4A32]' : 'bg-black/5 dark:bg-white/5'
            }`}>
              {codingSolved}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'interview'
                ? 'bg-white dark:bg-[#1F1F1F] text-[#121417] dark:text-white shadow-xs border border-[#E9ECEF] dark:border-[#2D2D2D]'
                : 'text-[#868E96] dark:text-[#777777] hover:text-[#121417] dark:hover:text-white'
            }`}
          >
            <MessageSquareQuote className={`w-3.5 h-3.5 ${activeTab === 'interview' ? 'text-purple-500' : 'text-current'}`} />
            <span>Interview</span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'interview' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-black/5 dark:bg-white/5'
            }`}>
              {intMastered}
            </span>
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT AREA */}

      {/* --- TAB A: APTITUDE ANALYTICS --- */}
      {activeTab === 'aptitude' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Micro badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">Streak:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">{streakDays}d</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">Accuracy:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">
                {aptAttempted > 0 ? `${accuracyRate}%` : '—'}
              </span>
            </div>
            {aptAttempted > 0 && (
              <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
                <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">1st Try:</span>
                <span className="font-extrabold text-[#121417] dark:text-white">
                  {firstTryAccuracyRate}%
                </span>
              </div>
            )}
          </div>

          {/* 4-Column Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Overall Solved Donut */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r={radius} className="stroke-[#E9ECEF] dark:stroke-[#242424]" strokeWidth={strokeWidth} fill="none" />
                  {easySolved > 0 && (
                    <circle cx="35" cy="35" r={radius} className="stroke-emerald-500 transition-all duration-700 ease-out" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={easyDashOffset} strokeLinecap="round" fill="none" />
                  )}
                  {mediumSolved > 0 && (
                    <circle cx="35" cy="35" r={radius} className="stroke-amber-500 transition-all duration-700 ease-out" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={mediumDashOffset} strokeLinecap="round" fill="none" style={{ transformOrigin: 'center', transform: `rotate(${mediumRotation}deg)` }} />
                  )}
                  {hardSolved > 0 && (
                    <circle cx="35" cy="35" r={radius} className="stroke-rose-500 transition-all duration-700 ease-out" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={hardDashOffset} strokeLinecap="round" fill="none" style={{ transformOrigin: 'center', transform: `rotate(${hardRotation}deg)` }} />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                  <span className="font-mono font-bold text-[10px] text-[#121417] dark:text-white tracking-tight leading-none">
                    {aptDisplayPct}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#777777] block">
                  Overall Solved
                </span>
                <div className="font-mono font-extrabold text-sm text-[#121417] dark:text-white">
                  {aptSolved}
                  <span className="text-xs font-normal text-[#868E96] dark:text-[#555555]">
                    /{aptTotal.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#FD4A32] block">
                  {aptDisplayPct} Mastered
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
                  <span className="text-[#868E96] dark:text-[#555555] font-normal">/{easyTotal.toLocaleString()}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${easyPct}%` }} />
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
                  <span className="text-[#868E96] dark:text-[#555555] font-normal">/{mediumTotal.toLocaleString()}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${mediumPct}%` }} />
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
                  <span className="text-[#868E96] dark:text-[#555555] font-normal">/{hardTotal.toLocaleString()}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${hardPct}%` }} />
                </div>
                <div className="text-right text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
                  {hardPct}% completed
                </div>
              </div>
            </div>
          </div>

          {/* Quick link footer */}
          <div className="pt-2 border-t border-[#E9ECEF] dark:border-[#222222] flex items-center justify-between">
            <span className="text-[11px] text-[#868E96] dark:text-[#777777]">
              Continuous daily practice sharpens logical reflexes for campus online exams.
            </span>
            <Link
              to="/aptitude/arithmetic-aptitude"
              className="text-xs font-bold text-[#FD4A32] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Practice Aptitude Topics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* --- TAB B: TECHNICAL & CODING ANALYTICS --- */}
      {activeTab === 'technical' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Micro badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">Prog 150:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">{p150Solved}/{p150Total}</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">Campus DSA:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">{dsaSolved}/{dsaTotal}</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">OA MCQs:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">{mcqTotal} questions</span>
            </div>
          </div>

          {/* 4-Column Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Overall Coding Solved Donut */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r={radius} className="stroke-[#E9ECEF] dark:stroke-[#242424]" strokeWidth={strokeWidth} fill="none" />
                  {codingSolved > 0 && (
                    <circle cx="35" cy="35" r={radius} className="stroke-[#FD4A32] transition-all duration-700 ease-out" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={codingDashOffset} strokeLinecap="round" fill="none" />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                  <span className="font-mono font-bold text-[10px] text-[#121417] dark:text-white tracking-tight leading-none">
                    {codingPct}%
                  </span>
                </div>
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#777777] block">
                  Coding Solved
                </span>
                <div className="font-mono font-extrabold text-sm text-[#121417] dark:text-white">
                  {codingSolved}
                  <span className="text-xs font-normal text-[#868E96] dark:text-[#555555]">
                    /{codingTotal}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#FD4A32] block">
                  {codingPct}% Completed
                </span>
              </div>
            </div>

            {/* Card 2: Programming 150 */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  Programming 150
                </span>
                <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
                  {p150Solved}
                  <span className="text-[#868E96] dark:text-[#555555] font-normal">/{p150Total}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${p150Pct}%` }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
                  <span>Syntax, Loops &amp; Logic</span>
                  <span>{p150Pct}%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Campus DSA Core */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Campus DSA Top 100
                </span>
                <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
                  {dsaSolved}
                  <span className="text-[#868E96] dark:text-[#555555] font-normal">/{dsaTotal}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${dsaPct}%` }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
                  <span>15 High-Yield Patterns</span>
                  <span>{dsaPct}%</span>
                </div>
              </div>
            </div>

            {/* Card 4: Technical MCQs */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Output MCQs
                </span>
                <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
                  {mcqTotal}
                  <span className="text-[#868E96] dark:text-[#555555] font-normal"> Qs</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
                  <span>C, C++, Java &amp; Python Traps</span>
                  <span className="text-emerald-500">Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick link footer */}
          <div className="pt-2 border-t border-[#E9ECEF] dark:border-[#222222] flex items-center justify-between">
            <span className="text-[11px] text-[#868E96] dark:text-[#777777]">
              Multi-language code tabs (Java, Python, C++, C) with time &amp; space complexities.
            </span>
            <Link
              to="/technical"
              className="text-xs font-bold text-[#FD4A32] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Go to Technical &amp; Coding Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* --- TAB C: INTERVIEW PREP ANALYTICS --- */}
      {activeTab === 'interview' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Micro badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">Core CS:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">{coreCsMastered}/{coreCsTotal}</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">HR STAR:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">{hrMastered}/{hrTotal}</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-xs font-mono">
              <span className="text-[#868E96] dark:text-[#777777] mr-1.5 font-sans text-[11px]">Projects:</span>
              <span className="font-extrabold text-[#121417] dark:text-white">{projMastered}/{projTotal}</span>
            </div>
          </div>

          {/* 4-Column Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Overall Mastered Donut */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r={radius} className="stroke-[#E9ECEF] dark:stroke-[#242424]" strokeWidth={strokeWidth} fill="none" />
                  {intMastered > 0 && (
                    <circle cx="35" cy="35" r={radius} className="stroke-purple-600 dark:stroke-purple-400 transition-all duration-700 ease-out" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={intDashOffset} strokeLinecap="round" fill="none" />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                  <span className="font-mono font-bold text-[10px] text-[#121417] dark:text-white tracking-tight leading-none">
                    {intPct}%
                  </span>
                </div>
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#777777] block">
                  Total Mastered
                </span>
                <div className="font-mono font-extrabold text-sm text-[#121417] dark:text-white">
                  {intMastered}
                  <span className="text-xs font-normal text-[#868E96] dark:text-[#555555]">
                    /{intTotal}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 block">
                  {intPct}% Mastered
                </span>
              </div>
            </div>

            {/* Card 2: Core CS Subjects */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  Core CS
                </span>
                <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
                  {coreCsMastered}
                  <span className="text-[#868E96] dark:text-[#555555] font-normal">/{coreCsTotal}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${coreCsPct}%` }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
                  <span>DBMS, OOPs, OS &amp; CN</span>
                  <span>{coreCsPct}%</span>
                </div>
              </div>
            </div>

            {/* Card 3: HR & Behavioral */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  HR Behavioral
                </span>
                <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
                  {hrMastered}
                  <span className="text-[#868E96] dark:text-[#555555] font-normal">/{hrTotal}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${hrPct}%` }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
                  <span>STAR Method Templates</span>
                  <span>{hrPct}%</span>
                </div>
              </div>
            </div>

            {/* Card 4: Project Defense */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Project Defense
                </span>
                <span className="text-[11px] font-mono font-bold text-[#121417] dark:text-white">
                  {projMastered}
                  <span className="text-[#868E96] dark:text-[#555555] font-normal">/{projTotal}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-[#E9ECEF] dark:bg-[#202020] overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${projPct}%` }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#868E96] dark:text-[#666666]">
                  <span>2-Min Pitch &amp; Trap Questions</span>
                  <span>{projPct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick link footer */}
          <div className="pt-2 border-t border-[#E9ECEF] dark:border-[#222222] flex items-center justify-between">
            <span className="text-[11px] text-[#868E96] dark:text-[#777777]">
              Bullet point summaries, model answers, and interviewer tips for every question.
            </span>
            <Link
              to="/interview-prep"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Go to Interview Prep Bible</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAnalyticsHub;
