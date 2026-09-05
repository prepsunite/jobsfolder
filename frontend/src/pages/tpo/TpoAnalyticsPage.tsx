import React from 'react';
import { useOutletContext } from 'react-router';
import type { TpoOutletContext } from '@/layouts/TpoLayout';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Download,
  GraduationCap,
} from 'lucide-react';

export default function TpoAnalyticsPage() {
  const { currentCollege, stats } = useOutletContext<TpoOutletContext>();

  const departments = stats?.departments || [];
  const total = stats?.totalStudents || 0;
  const avg = stats?.avgCollegeScore || 0;

  // Real placement readiness tier counts computed from actual student attempt results
  const tier1Count = stats?.tierCounts?.tier1 ?? 0;
  const tier2Count = stats?.tierCounts?.tier2 ?? 0;
  const tier3Count = stats?.tierCounts?.tier3 ?? total;

  // Generate real NIRF / NAAC Institutional Placement Intelligence Report CSV
  const handleDownloadReport = () => {
    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const headers = 'Institution Placement Intelligence Report (NIRF / NAAC Criterion 5.2)\n';
    const metadata = `College Name,"${currentCollege.name}"\nCollege Code,${currentCollege.code}\nGenerated On,"${reportDate}"\nTotal Student Licenses,${currentCollege.max_licenses}\nEnrolled Candidates,${total}\nCampus Average Score,${avg}%\n\n`;

    const tierHeader = 'Placement Readiness Tier,Student Count,Benchmark Requirement\n';
    const tierRows = [
      `Tier 1 (Day-1 Placement Ready),${tier1Count},"Consistent 70%+ clearance in company mocks"`,
      `Tier 2 (Near Ready),${tier2Count},"50%–69% score, targeted aptitude practice needed"`,
      `Tier 3 (Remedial Prep Needed),${tier3Count},"Below 50%, foundational remediation recommended"`,
    ].join('\n') + '\n\n';

    const deptHeader = 'Department,Enrolled Candidates,Average Score (%),Readiness Status\n';
    const deptRows = departments.length > 0
      ? departments.map(d => `"${d.department} Branch",${d.studentCount},${d.avgScore}%,${d.avgScore >= 60 ? 'Above Benchmark' : 'Review Needed'}`).join('\n')
      : '"General Engineering",0,0%,Pending Roster Upload';

    const fullContent = headers + metadata + tierHeader + tierRows + deptHeader + deptRows;
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCollege.code}_Placement_Intelligence_NIRF_Report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Institutional Placement Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comparative performance analytics across departments for campus recruitment readiness
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FD4A32]/20 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download NAAC / NIRF Report
        </button>
      </div>

      {/* High-Level Placement Readiness Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Tier 1 • Day-1 Ready
            </span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {tier1Count} Students
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Scoring 70%+ consistently in company mocks. Immediate candidates for mass IT (TCS Ninja/Digital, Accenture, Infosys DSE).
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Tier 2 • Near Ready
            </span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {tier2Count} Students
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Scoring between 50%–69%. Need 2–3 weeks of focused topic practice in Quantitative Aptitude &amp; Pseudo-code.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              Tier 3 • Remedial Prep Needed
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {tier3Count} Students
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Scoring below 50%. Require foundational speed-math, reading comprehension, and basic reasoning modules.
          </p>
        </div>
      </div>

      {/* Branch vs Branch Comparison Cards */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Department Performance Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Participation and test averages by engineering stream
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No student branch records found. Bulk import students to view branch metrics.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept: any) => (
              <div
                key={dept.department}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#FD4A32]">
                    {dept.department} Branch
                  </span>
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                </div>

                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {dept.studentCount} Students
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Readiness Score:</span>
                    <strong className="text-blue-600 dark:text-blue-400">{dept.avgScore}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, dept.avgScore)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
