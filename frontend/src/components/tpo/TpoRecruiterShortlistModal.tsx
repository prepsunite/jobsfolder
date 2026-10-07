import React, { useState, useMemo } from 'react';
import {
  X,
  Download,
  Filter,
  Award,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  Building2,
  Users,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { MockExam, StudentExamAttempt } from '@/types/tpo';
import { sanitizeCsvCell, downloadCsv } from '@/utils/csvUtils';

interface TpoRecruiterShortlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: MockExam | null;
  attempts: StudentExamAttempt[];
  resolveStudent: (att: StudentExamAttempt) => {
    name: string;
    email: string;
    roll_number: string;
    department: string;
  };
}

interface SectionCutoffState {
  [sectionName: string]: number; // min percentage
}

export default function TpoRecruiterShortlistModal({
  isOpen,
  onClose,
  exam,
  attempts,
  resolveStudent,
}: TpoRecruiterShortlistModalProps) {
  // Preset profiles
  const [selectedPreset, setSelectedPreset] = useState<'CUSTOM' | 'DIGITAL_TIER1' | 'STANDARD_TIER2' | 'STRICT_INTEGRITY'>('CUSTOM');

  // Filter Thresholds
  const [minOverallScore, setMinOverallScore] = useState<number>(60);
  const [maxViolations, setMaxViolations] = useState<number>(1);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Sectional Cutoffs (e.g. Coding >= 70, Aptitude >= 50)
  const sectionsList = useMemo(() => {
    return (exam?.sections || []).map(s => s.name);
  }, [exam]);

  const [sectionCutoffs, setSectionCutoffs] = useState<SectionCutoffState>(() => {
    const initial: SectionCutoffState = {};
    (exam?.sections || []).forEach(s => {
      initial[s.name] = 0;
    });
    return initial;
  });

  // Apply Preset configurations
  const applyPreset = (preset: 'CUSTOM' | 'DIGITAL_TIER1' | 'STANDARD_TIER2' | 'STRICT_INTEGRITY') => {
    setSelectedPreset(preset);
    const updatedSections: SectionCutoffState = {};

    if (preset === 'DIGITAL_TIER1') {
      setMinOverallScore(70);
      setMaxViolations(1);
      (exam?.sections || []).forEach(s => {
        const lower = s.name.toLowerCase();
        if (lower.includes('code') || lower.includes('technical') || lower.includes('dsa')) {
          updatedSections[s.name] = 65;
        } else {
          updatedSections[s.name] = 50;
        }
      });
      setSectionCutoffs(updatedSections);
    } else if (preset === 'STANDARD_TIER2') {
      setMinOverallScore(50);
      setMaxViolations(2);
      (exam?.sections || []).forEach(s => {
        updatedSections[s.name] = 40;
      });
      setSectionCutoffs(updatedSections);
    } else if (preset === 'STRICT_INTEGRITY') {
      setMinOverallScore(60);
      setMaxViolations(0);
      (exam?.sections || []).forEach(s => {
        updatedSections[s.name] = 0;
      });
      setSectionCutoffs(updatedSections);
    } else {
      (exam?.sections || []).forEach(s => {
        updatedSections[s.name] = 0;
      });
      setSectionCutoffs(updatedSections);
    }
  };

  const handleSectionCutoffChange = (sectionName: string, val: number) => {
    setSelectedPreset('CUSTOM');
    setSectionCutoffs(prev => ({
      ...prev,
      [sectionName]: val,
    }));
  };

  // Only consider finalized attempts (exclude currently in-progress if not yet submitted)
  const evaluatedAttempts = useMemo(() => {
    return attempts.filter(
      a => a.status === 'SUBMITTED' || a.status === 'GRADED' || a.status === 'TIMED_OUT' || a.status === 'TERMINATED_MALPRACTICE'
    );
  }, [attempts]);

  // Evaluate Shortlist
  const shortlistedAttempts = useMemo(() => {
    return evaluatedAttempts.filter(att => {
      // 1. Overall Score
      const pct = att.percentage || 0;
      if (pct < minOverallScore) return false;

      // 2. Proctor Integrity Limit
      if ((att.tab_switch_count || 0) > maxViolations) return false;

      // 3. Status Check (Exclude permanent malpractice terminations if violations > 0)
      if (maxViolations === 0 && att.status === 'TERMINATED_MALPRACTICE') return false;

      // 4. Department
      const student = resolveStudent(att);
      if (selectedDept !== 'ALL' && student.department !== selectedDept) return false;

      // 5. Sectional Dual/Triple Thresholds
      const attSections = att.result_summary?.sections || [];
      for (const [secName, minVal] of Object.entries(sectionCutoffs)) {
        if (minVal > 0) {
          const match = attSections.find(s => s.section_name === secName);
          const secPct = match ? (match.percentage ?? 0) : 0;
          if (secPct < minVal) {
            return false;
          }
        }
      }

      return true;
    });
  }, [evaluatedAttempts, minOverallScore, maxViolations, selectedDept, sectionCutoffs, resolveStudent]);

  if (!isOpen || !exam) return null;

  // Export Shortlist CSV for Visiting Recruiter HR
  const handleExportShortlistCSV = () => {
    if (shortlistedAttempts.length === 0) return;

    const sectionHeaders = sectionsList.map(s => sanitizeCsvCell(`${s} (%)`)).join(',');
    const headers = `Shortlist Rank,Roll Number,Student Name,Email,Department,Overall Score,Max Score,Overall Percentage,${sectionHeaders ? sectionHeaders + ',' : ''}Tab Switches,Proctor Status\n`;

    const rows = shortlistedAttempts
      .map((att, idx) => {
        const s = resolveStudent(att);
        const secScores = sectionsList
          .map(secName => {
            const m = att.result_summary?.sections?.find(sec => sec.section_name === secName);
            return `${m?.percentage ?? att.percentage ?? 0}%`;
          })
          .join(',');

        const statusLabel = (att.tab_switch_count || 0) === 0 ? 'CLEAN' : `${att.tab_switch_count} violations`;

        return [
          idx + 1,
          sanitizeCsvCell(s.roll_number || '—'),
          sanitizeCsvCell(s.name),
          sanitizeCsvCell(s.email),
          sanitizeCsvCell(s.department || 'General'),
          att.total_score,
          att.max_possible_score || 100,
          `${att.percentage}%`,
          ...(secScores ? [secScores] : []),
          att.tab_switch_count || 0,
          sanitizeCsvCell(statusLabel),
        ].join(',');
      })
      .join('\n');

    const companyTag = exam.target_company.toLowerCase().replace(/\s+/g, '_');
    downloadCsv(`${companyTag}_recruiter_shortlist_${shortlistedAttempts.length}_candidates.csv`, headers + rows);
  };

  const qualifiedPercentage = evaluatedAttempts.length > 0
    ? Math.round((shortlistedAttempts.length / evaluatedAttempts.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#151d2e] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                1-Click Recruiter Dual-Cutoff Shortlist Generator
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {exam.target_company} Placement Shortlist Filter
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* Preset Profile Chips */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Recruiter Hiring Profile Presets:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => applyPreset('DIGITAL_TIER1')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPreset === 'DIGITAL_TIER1'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                TCS Digital / Product Tier-1 (Overall 70%, Coding 65%, Max 1 Violation)
              </button>
              <button
                onClick={() => applyPreset('STANDARD_TIER2')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPreset === 'STANDARD_TIER2'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Standard Day-1 / Ninja (Overall 50%, Sections 40%)
              </button>
              <button
                onClick={() => applyPreset('STRICT_INTEGRITY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPreset === 'STRICT_INTEGRITY'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Strict Lab Verified (0 Tab Violations Only)
              </button>
              <button
                onClick={() => applyPreset('CUSTOM')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPreset === 'CUSTOM'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Custom Rules
              </button>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            {/* 1. Overall Cutoff Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Min. Overall Percentage:</span>
                <strong className="text-purple-600 dark:text-purple-400 font-mono text-sm">{minOverallScore}%</strong>
              </div>
              <input
                type="range"
                min={0}
                max={95}
                step={5}
                value={minOverallScore}
                onChange={e => {
                  setSelectedPreset('CUSTOM');
                  setMinOverallScore(Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Open)</span>
                <span>50%</span>
                <span>70% (Day-1)</span>
                <span>90%</span>
              </div>
            </div>

            {/* 2. Proctoring Limit */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Max Proctoring Violations Allowed:
              </label>
              <select
                value={maxViolations}
                onChange={e => {
                  setSelectedPreset('CUSTOM');
                  setMaxViolations(Number(e.target.value));
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                <option value={0}>Zero Tab Switches Only (100% Clean)</option>
                <option value={1}>Max 1 Tab Switch Allowed</option>
                <option value={2}>Max 2 Tab Switches Allowed</option>
                <option value={3}>Max 3 Tab Switches Allowed</option>
                <option value={99}>Ignore Tab Switches</option>
              </select>
              <div className="text-[10px] text-slate-400">
                Filters out candidates flagged for window blurring or cheating.
              </div>
            </div>

            {/* 3. Branch / Department Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Department:
              </label>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="ALL">All Departments</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="IT">Information Tech (IT)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="EEE">Electrical (EEE)</option>
                <option value="MECH">Mechanical</option>
                <option value="CIVIL">Civil</option>
              </select>
              <div className="text-[10px] text-slate-400">
                Shortlist candidates belonging to specific academic departments.
              </div>
            </div>
          </div>

          {/* Sectional Cutoffs Sliders (Dual / Triple Cutoff Engine) */}
          {sectionsList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
                  Section-Specific Cutoff Thresholds:
                </span>
                <span className="text-[11px] text-slate-400">
                  Candidate must satisfy ALL sectional minimums to qualify
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sectionsList.map(secName => {
                  const val = sectionCutoffs[secName] || 0;
                  return (
                    <div
                      key={secName}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]" title={secName}>
                          {secName}
                        </span>
                        <strong className="text-purple-600 dark:text-purple-400 font-mono">
                          {val > 0 ? `${val}%` : 'No Cutoff'}
                        </strong>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={90}
                        step={5}
                        value={val}
                        onChange={e => handleSectionCutoffChange(secName, Number(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real-time Shortlist Metric Meter */}
          <div className="p-4.5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <div className="text-2xl font-black">
                  {shortlistedAttempts.length}{' '}
                  <span className="text-sm font-normal text-purple-200">
                    of {evaluatedAttempts.length} Candidates Qualified ({qualifiedPercentage}%)
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 mt-0.5">
                  Matches {minOverallScore}% overall + sectional rules + max {maxViolations} tab violations.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportShortlistCSV}
              disabled={shortlistedAttempts.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-500/25 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              Export Recruiter Shortlist CSV
            </button>
          </div>

          {/* Shortlisted Candidates Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 font-bold border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-700 dark:text-slate-300">
              <span>Qualified Candidate Roster ({shortlistedAttempts.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">Sorted by exam rank</span>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100/60 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Dept</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Percentage</th>
                    <th className="p-3">Violations</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {shortlistedAttempts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No candidates meet all the specified cutoff and integrity requirements.
                      </td>
                    </tr>
                  ) : (
                    shortlistedAttempts.map((att, idx) => {
                      const s = resolveStudent(att);
                      return (
                        <tr key={att.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-black text-slate-400">#{idx + 1}</td>
                          <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                            {s.roll_number || '—'}
                          </td>
                          <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                            {s.name}
                          </td>
                          <td className="p-3 font-bold text-purple-600 dark:text-purple-400 uppercase">
                            {s.department || 'CSE'}
                          </td>
                          <td className="p-3 font-mono">
                            {att.total_score} / {att.max_possible_score || 100}
                          </td>
                          <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            {att.percentage}%
                          </td>
                          <td className="p-3 font-mono text-center">
                            {(att.tab_switch_count || 0) === 0 ? (
                              <span className="text-emerald-600 font-bold">0</span>
                            ) : (
                              <span className="text-amber-600 font-bold">{att.tab_switch_count}</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Qualified
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#151d2e] flex items-center justify-between text-xs shrink-0">
          <div className="text-slate-400 font-medium">
            Formulated for instant HR download &amp; dual-threshold candidate shortlisting.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
