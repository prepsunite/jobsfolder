import React, { useMemo } from 'react';
import {
  X,
  Printer,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Building2,
  Users,
  Target,
  Sparkles,
} from 'lucide-react';
import type { MockExam, StudentExamAttempt } from '@/types/tpo';

interface TpoBatchDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: MockExam | null;
  attempts: StudentExamAttempt[];
  collegeName?: string;
}

export default function TpoBatchDiagnosticModal({
  isOpen,
  onClose,
  exam,
  attempts,
  collegeName,
}: TpoBatchDiagnosticModalProps) {
  // Only evaluate finalized submissions
  const completedAttempts = useMemo(() => {
    return attempts.filter(
      a => a.status === 'SUBMITTED' || a.status === 'GRADED' || a.status === 'TIMED_OUT' || a.status === 'TERMINATED_MALPRACTICE'
    );
  }, [attempts]);

  const totalCandidates = completedAttempts.length;

  // 1. Tier Breakdown
  const tierStats = useMemo(() => {
    if (totalCandidates === 0) {
      return { tier1: 0, tier2: 0, tier3: 0, t1Pct: 0, t2Pct: 0, t3Pct: 0 };
    }
    const t1 = completedAttempts.filter(a => (a.percentage || 0) >= 70).length;
    const t2 = completedAttempts.filter(a => (a.percentage || 0) >= 50 && (a.percentage || 0) < 70).length;
    const t3 = completedAttempts.filter(a => (a.percentage || 0) < 50).length;

    return {
      tier1: t1,
      tier2: t2,
      tier3: t3,
      t1Pct: Math.round((t1 / totalCandidates) * 100),
      t2Pct: Math.round((t2 / totalCandidates) * 100),
      t3Pct: Math.round((t3 / totalCandidates) * 100),
    };
  }, [completedAttempts, totalCandidates]);

  // 2. Sectional Aggregations
  const sectionDiagnostics = useMemo(() => {
    if (totalCandidates === 0 || !exam?.sections) return [];

    return exam.sections.map(sec => {
      let totalScoreSum = 0;
      let totalMaxSum = 0;
      let totalAccuracySum = 0;
      let totalAttemptedSum = 0;
      let totalQuestionsSum = 0;
      let validCount = 0;

      completedAttempts.forEach(att => {
        const match = att.result_summary?.sections?.find(s => s.section_name === sec.name);
        if (match) {
          totalScoreSum += match.score || 0;
          totalMaxSum += match.max_score || 0;
          totalAccuracySum += match.accuracy || 0;
          totalAttemptedSum += match.attempted || 0;
          totalQuestionsSum += match.total_questions || 0;
          validCount++;
        }
      });

      const avgAccuracy = validCount > 0 ? Math.round(totalAccuracySum / validCount) : 0;
      const attemptRate =
        totalQuestionsSum > 0 ? Math.round((totalAttemptedSum / totalQuestionsSum) * 100) : 0;
      const avgScore = validCount > 0 ? Math.round((totalScoreSum / validCount) * 10) / 10 : 0;
      const maxScore = validCount > 0 ? Math.round((totalMaxSum / validCount) * 10) / 10 : 0;

      let status: 'STRONG' | 'MODERATE' | 'CRITICAL' = 'MODERATE';
      if (avgAccuracy >= 65) status = 'STRONG';
      else if (avgAccuracy < 50) status = 'CRITICAL';

      return {
        name: sec.name,
        avgAccuracy,
        attemptRate,
        avgScore,
        maxScore,
        status,
      };
    });
  }, [completedAttempts, exam, totalCandidates]);

  // 3. Automated Remedial Recommendations
  const remedialRecommendations = useMemo(() => {
    const list: string[] = [];

    sectionDiagnostics.forEach(sec => {
      const lower = sec.name.toLowerCase();
      if (sec.status === 'CRITICAL') {
        if (lower.includes('code') || lower.includes('dsa') || lower.includes('technical')) {
          list.push(
            `🔴 ${sec.name} Skill Gap: Cohort average is ${sec.avgAccuracy}%. Candidates are struggling with algorithmic problem translation and test case bounds. Recommend a 3-day workshop on Array/String two-pointer methods, HashMaps, and boundary edge cases.`
          );
        } else if (lower.includes('quant') || lower.includes('arithmetic')) {
          list.push(
            `🔴 ${sec.name} Bottleneck: Accuracy is ${sec.avgAccuracy}%. Over ${100 - sec.attemptRate}% questions were skipped or timed out. Conduct speed-math drills on Time-Work, Speed-Distance, and Percentages.`
          );
        } else if (lower.includes('logical') || lower.includes('reasoning')) {
          list.push(
            `🔴 ${sec.name} Remedial: ${sec.avgAccuracy}% average score indicates confusion in multi-step deductive puzzles (Arrangements, Syllogisms). Organize targeted problem-solving tutorials.`
          );
        } else if (lower.includes('verbal') || lower.includes('english')) {
          list.push(
            `🔴 ${sec.name} Deficit: ${sec.avgAccuracy}% accuracy. Candidates attempt many questions but suffer high negative/incorrect choices. Train students on elimination strategies in reading comprehension.`
          );
        } else {
          list.push(
            `🔴 ${sec.name} Critical Gap: Accuracy (${sec.avgAccuracy}%) is below 50%. Remedial review lectures recommended before recruiter arrival.`
          );
        }
      } else if (sec.status === 'STRONG') {
        list.push(
          `🟢 ${sec.name} Cohort Strength: High mastery (${sec.avgAccuracy}% average accuracy, ${sec.attemptRate}% attempt rate). Students are confident and Day-1 ready in this domain.`
        );
      }
    });

    if (tierStats.tier3 > tierStats.tier1 && totalCandidates >= 10) {
      list.push(
        `⚠️ Cohort Polarization: ${tierStats.t3Pct}% of candidates scored below 50%. A mandatory bridge course should be scheduled for the lower quartile before tier-1 company shortlisting.`
      );
    }

    return list;
  }, [sectionDiagnostics, tierStats, totalCandidates]);

  if (!isOpen || !exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#151d2e] shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Institutional Placement Diagnostic &amp; Skill Gap Analysis
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {exam.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* Institution Drive Header */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Building2 className="w-3 h-3" />
                {collegeName || 'Campus Placement Partner'}
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Cohort Placement Readiness Assessment
              </h3>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                Target Company: <strong>{exam.target_company}</strong> • Total Candidates Evaluated:{' '}
                <strong className="text-slate-800 dark:text-slate-200">{totalCandidates}</strong>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Benchmark Requirement</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white">
                {exam.passing_percentage}% Minimum Clearance
              </strong>
            </div>
          </div>

          {/* 1. Placement Caliber Distribution (Tier 1 vs Tier 2 vs Tier 3) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Cohort Placement Caliber Distribution:
              </span>
              <span className="text-slate-400 text-[11px]">Day-1 vs Near Ready vs Remedial</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1 text-center">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Tier 1: Day-1 Ready (&ge;70%)
                </div>
                <div className="text-2xl font-black text-emerald-800 dark:text-emerald-300">
                  {tierStats.tier1} <span className="text-xs font-semibold text-emerald-600">({tierStats.t1Pct}%)</span>
                </div>
                <div className="text-[10px] text-emerald-600/80">Immediately short-listable for top packages</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-1 text-center">
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Tier 2: Near Ready (50% - 69%)
                </div>
                <div className="text-2xl font-black text-blue-800 dark:text-blue-300">
                  {tierStats.tier2} <span className="text-xs font-semibold text-blue-600">({tierStats.t2Pct}%)</span>
                </div>
                <div className="text-[10px] text-blue-600/80">Can clear standard rounds with mild practice</div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-1 text-center">
                <div className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Tier 3: Remedial Needed (&lt;50%)
                </div>
                <div className="text-2xl font-black text-rose-800 dark:text-rose-300">
                  {tierStats.tier3} <span className="text-xs font-semibold text-rose-600">({tierStats.t3Pct}%)</span>
                </div>
                <div className="text-[10px] text-rose-600/80">Requires structured mentoring &amp; training</div>
              </div>
            </div>

            {/* Visual Distribution Progress Bar */}
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${tierStats.t1Pct}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Tier 1: ${tierStats.t1Pct}%`}
              />
              <div
                style={{ width: `${tierStats.t2Pct}%` }}
                className="bg-blue-500 h-full transition-all"
                title={`Tier 2: ${tierStats.t2Pct}%`}
              />
              <div
                style={{ width: `${tierStats.t3Pct}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Tier 3: ${tierStats.t3Pct}%`}
              />
            </div>
          </div>

          {/* 2. Sectional Domain Performance Grid */}
          <div className="space-y-3">
            <span className="font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 text-xs block">
              2. Section &amp; Skill Gap Performance Matrix:
            </span>

            <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Section Domain</th>
                    <th className="p-3.5 text-center">Batch Avg Accuracy</th>
                    <th className="p-3.5 text-center">Attempt Rate</th>
                    <th className="p-3.5 text-center">Avg Net Marks</th>
                    <th className="p-3.5">Institutional Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sectionDiagnostics.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        No submissions available to calculate sectional diagnostics.
                      </td>
                    </tr>
                  ) : (
                    sectionDiagnostics.map((sec, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          {sec.name}
                        </td>
                        <td className="p-3.5 text-center font-mono font-black text-sm">
                          <span
                            className={
                              sec.avgAccuracy >= 65
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : sec.avgAccuracy >= 50
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }
                          >
                            {sec.avgAccuracy}%
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-mono text-slate-600 dark:text-slate-300">
                          {sec.attemptRate}%
                        </td>
                        <td className="p-3.5 text-center font-mono text-slate-800 dark:text-slate-200">
                          {sec.avgScore} / {sec.maxScore}
                        </td>
                        <td className="p-3.5">
                          {sec.status === 'STRONG' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> Strong Domain
                            </span>
                          ) : sec.status === 'CRITICAL' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                              <AlertTriangle className="w-3 h-3" /> Critical Skill Gap
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                              Moderate Mastery
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Actionable Remedial Action Plan */}
          <div className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black uppercase text-[11px] tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Recommended Placement Remedial Action Plan:</span>
            </div>

            {remedialRecommendations.length === 0 ? (
              <p className="text-slate-500">
                Complete candidate submissions to generate automated remedial insights.
              </p>
            ) : (
              <div className="space-y-2">
                {remedialRecommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 text-slate-800 dark:text-slate-200 leading-relaxed font-medium"
                  >
                    {rec}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#151d2e] flex items-center justify-between text-xs shrink-0 print:hidden">
          <div className="text-slate-400 font-medium">
            Generated from real-time student attempt logs and sectional breakdown telemetry.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}
