import React from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { technicalService } from '@/services/technical.service';
import { interviewService } from '@/services/interview.service';
import {
  Code2,
  Terminal,
  MessageSquareQuote,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  HelpCircle,
  Briefcase,
} from 'lucide-react';

interface TechnicalStatsWidgetProps {
  className?: string;
}

export const TechnicalStatsWidget: React.FC<TechnicalStatsWidgetProps> = ({ className = '' }) => {
  const { data: techStats, isLoading: isTechLoading } = useQuery({
    queryKey: ['technical-stats-summary'],
    queryFn: () => technicalService.getStats(),
    staleTime: 10 * 1000,
  });

  const { data: interviewStats, isLoading: isInterviewLoading } = useQuery({
    queryKey: ['interview-stats-summary'],
    queryFn: () => interviewService.getStats(),
    staleTime: 10 * 1000,
  });

  const codingPct = techStats?.percentage ?? 0;
  const interviewPct = interviewStats?.percentage ?? 0;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
      {/* CARD 1: TECHNICAL & CODING HUB */}
      <div className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group">
        {/* Subtle accent corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FD4A32]/5 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-[#E9ECEF] dark:border-[#222222]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FD4A32]/10 border border-[#FD4A32]/20 flex items-center justify-center shrink-0">
                <Terminal className="w-4.5 h-4.5 text-[#FD4A32]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-[#121417] dark:text-white tracking-tight">
                    Technical &amp; Coding Hub
                  </h3>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20">
                    Placement Core
                  </span>
                </div>
                <p className="text-[11px] text-[#868E96] dark:text-[#777777]">
                  Master syntax logic, patterns, and campus DSA interview questions
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-mono font-extrabold text-base text-[#121417] dark:text-white">
                {techStats?.totalSolved ?? 0}
              </span>
              <span className="text-xs font-mono text-[#868E96] dark:text-[#666666]">
                /{techStats?.totalCoding ?? 0}
              </span>
              <span className="text-[9px] font-mono text-[#FD4A32] block">
                {codingPct}% solved
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 mb-4">
            <div className="w-full h-2 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#FD4A32] to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${codingPct}%` }}
              />
            </div>
          </div>

          {/* 3 Pillar Micro Badges */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* Programming 150 */}
            <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
              <div className="flex items-center gap-1.5 mb-1">
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider">
                  Prog 150
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-xs text-[#121417] dark:text-white">
                  {techStats?.p150Solved ?? 0}/{techStats?.p150Total ?? 0}
                </span>
                <span className="text-[9px] font-mono text-blue-500">
                  Syntax &amp; Loops
                </span>
              </div>
            </div>

            {/* Campus DSA */}
            <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
              <div className="flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider">
                  DSA Core
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-xs text-[#121417] dark:text-white">
                  {techStats?.dsaSolved ?? 0}/{techStats?.dsaTotal ?? 0}
                </span>
                <span className="text-[9px] font-mono text-amber-500">
                  15 Patterns
                </span>
              </div>
            </div>

            {/* Technical MCQs */}
            <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
              <div className="flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider">
                  Output MCQs
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-xs text-[#121417] dark:text-white">
                  {techStats?.mcqTotal ?? 0}
                </span>
                <span className="text-[9px] font-mono text-emerald-500">
                  OA Traps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/technical"
          className="w-full py-2 px-3 rounded-lg bg-[#F8F9FA] hover:bg-[#FD4A32] dark:bg-[#1A1A1A] dark:hover:bg-[#FD4A32] text-[#121417] hover:text-white dark:text-white border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-[#FD4A32] text-xs font-bold transition-all flex items-center justify-between group/link"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FD4A32] group-hover/link:text-white" />
            Practice 150 Programming &amp; Campus DSA
          </span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>

      {/* CARD 2: INTERVIEW PREP BIBLE */}
      <div className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group">
        {/* Subtle accent corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-[#E9ECEF] dark:border-[#222222]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <MessageSquareQuote className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-[#121417] dark:text-white tracking-tight">
                    Interview Prep Bible
                  </h3>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    High Yield
                  </span>
                </div>
                <p className="text-[11px] text-[#868E96] dark:text-[#777777]">
                  Core CS fundamentals (DBMS, OOPs, OS, CN) &amp; HR behavioral STAR answers
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-mono font-extrabold text-base text-[#121417] dark:text-white">
                {interviewStats?.masteredCount ?? 0}
              </span>
              <span className="text-xs font-mono text-[#868E96] dark:text-[#666666]">
                /{interviewStats?.totalQuestions ?? 0}
              </span>
              <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 block">
                {interviewPct}% mastered
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 mb-4">
            <div className="w-full h-2 rounded-full bg-[#E9ECEF] dark:bg-[#242424] overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${interviewPct}%` }}
              />
            </div>
          </div>

          {/* 3 Pillar Micro Badges */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* Core CS */}
            <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
              <div className="flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[10px] font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider">
                  Core CS
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-xs text-[#121417] dark:text-white">
                  {interviewStats?.coreCsMastered ?? 0}/{interviewStats?.coreCsTotal ?? 0}
                </span>
                <span className="text-[9px] font-mono text-purple-500">
                  DBMS/OOP/OS/CN
                </span>
              </div>
            </div>

            {/* HR Behavioral */}
            <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
              <div className="flex items-center gap-1.5 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider">
                  HR STAR
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-xs text-[#121417] dark:text-white">
                  {interviewStats?.hrMastered ?? 0}/{interviewStats?.hrTotal ?? 0}
                </span>
                <span className="text-[9px] font-mono text-emerald-500">
                  Behavioral
                </span>
              </div>
            </div>

            {/* Project Defense */}
            <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424]">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider">
                  Projects
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-bold text-xs text-[#121417] dark:text-white">
                  {interviewStats?.projectMastered ?? 0}/{interviewStats?.projectTotal ?? 0}
                </span>
                <span className="text-[9px] font-mono text-blue-500">
                  Pitch &amp; Cross
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/interview-prep"
          className="w-full py-2 px-3 rounded-lg bg-[#F8F9FA] hover:bg-purple-600 dark:bg-[#1A1A1A] dark:hover:bg-purple-600 text-[#121417] hover:text-white dark:text-white border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-purple-600 text-xs font-bold transition-all flex items-center justify-between group/link"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 group-hover/link:text-white" />
            Revise Interview Q&amp;A &amp; Defense Framework
          </span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default TechnicalStatsWidget;
