import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Layers,
  Copy,
  Clock,
  Code2,
  BookOpen,
  X,
  Search,
  RotateCcw,
  Sparkles,
  Cpu,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Check,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import {
  mockExamBlueprintService,
  EXAM_PRESET_TEMPLATES,
} from '@/services/mockExamBlueprint.service';
import type { MockExamTemplate, TemplateSectionDraft } from '@/types/tpo';
import { useToast } from '@/contexts/ToastContext';

export default function AdminBlueprintManager() {
  const queryClient = useQueryClient();
  const { toast, confirmModal } = useToast();

  const [searchFilter, setSearchFilter] = useState('');
  const [inspectingBlueprint, setInspectingBlueprint] = useState<MockExamTemplate | null>(null);

  // Load all blueprints
  const { data: blueprints = [], isLoading } = useQuery<MockExamTemplate[]>({
    queryKey: ['admin-blueprints'],
    queryFn: () => mockExamBlueprintService.getAllBlueprints(),
  });

  // Filtered blueprints
  const filteredBlueprints = useMemo(() => {
    if (!searchFilter.trim()) return blueprints;
    const q = searchFilter.toLowerCase();
    return blueprints.filter(
      b =>
        b.name.toLowerCase().includes(q) ||
        b.target_company.toLowerCase().includes(q) ||
        (b.badge && b.badge.toLowerCase().includes(q))
    );
  }, [blueprints, searchFilter]);

  const handleDuplicate = async (bp: MockExamTemplate) => {
    const clone: MockExamTemplate = {
      ...JSON.parse(JSON.stringify(bp)),
      id: `bp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${bp.name} (Copy)`,
      is_default: false,
    };
    try {
      await mockExamBlueprintService.saveBlueprint(clone);
      queryClient.invalidateQueries({ queryKey: ['admin-blueprints'] });
      toast.success(`Duplicated "${bp.name}" successfully.`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to duplicate blueprint.');
    }
  };

  const handleDelete = async (bp: MockExamTemplate) => {
    const confirmed = await confirmModal({
      title: 'Delete Blueprint Pattern',
      message: `Are you sure you want to delete "${bp.name}"? Students will no longer see this blueprint when generating mock exams.`,
      confirmText: 'Delete Blueprint',
      isDanger: true,
    });
    if (!confirmed) return;
    try {
      await mockExamBlueprintService.deleteBlueprint(bp.id);
      queryClient.invalidateQueries({ queryKey: ['admin-blueprints'] });
      toast.success(`Deleted "${bp.name}".`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete blueprint.');
    }
  };

  const handleResetDefaults = async () => {
    const confirmed = await confirmModal({
      title: 'Restore Default Blueprints',
      message: 'Reset all blueprints to official defaults (TCS NQT 2026/27, Pure Coding OA, Accenture, Cognizant, Infosys, Wipro)?',
      confirmText: 'Reset to Defaults',
      isDanger: false,
    });
    if (!confirmed) return;
    try {
      await mockExamBlueprintService.resetToDefaults();
      queryClient.invalidateQueries({ queryKey: ['admin-blueprints'] });
      toast.success('Restored all blueprints to official industry defaults.');
    } catch (e: any) {
      toast.error(e.message || 'Failed to reset blueprints.');
    }
  };

  const getSectionDomain = (sec: TemplateSectionDraft): 'MCQ' | 'TECHNICAL_MCQ' | 'CODING' => {
    if (sec.section_type === 'CODING' || sec.category === 'coding') {
      return 'CODING';
    }
    if (
      sec.section_type === 'TECHNICAL_MCQ' ||
      sec.category === 'technical-mcqs' ||
      sec.category?.startsWith('mcq-') ||
      (sec.topic_ids && sec.topic_ids.some(t => t.startsWith('mcq-')))
    ) {
      return 'TECHNICAL_MCQ';
    }
    return 'MCQ';
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] text-[10px] font-display font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3 h-3" />
            <span>Official Industry Blueprint Catalog</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
            Mock Exam Blueprints & Company Patterns
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Standardized, battle-tested company drive patterns. Active blueprints determine test generation for students with zero client-side lag.
          </p>
          <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300/90 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              <strong>Need a new pattern?</strong> Share the questions/sections pattern with Antigravity AI to calibrate and add new blueprints directly with zero website bloat.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#2c2f38] hover:bg-gray-50 dark:hover:bg-[#1c1d22] text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search blueprints by company or pattern name..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-[#FD4A32]"
          />
        </div>
        <span className="text-xs text-gray-500">
          Showing {filteredBlueprints.length} pattern(s)
        </span>
      </div>

      {/* Blueprints Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading blueprints...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlueprints.map(bp => {
            const totalQuestions = bp.sections.reduce((acc, s) => acc + (Number(s.question_count) || 0), 0);
            const totalMarks = bp.sections.reduce(
              (acc, s) => acc + (Number(s.question_count) || 0) * (Number(s.marks_per_correct) || 1),
              0
            );
            const hasCoding = bp.sections.some(s => s.section_type === 'CODING' || s.category === 'coding');
            const hasTechnicalMcq = bp.sections.some(
              s =>
                s.section_type === 'TECHNICAL_MCQ' ||
                s.category === 'technical-mcqs' ||
                s.category?.startsWith('mcq-') ||
                (s.topic_ids && s.topic_ids.some(t => t.startsWith('mcq-')))
            );

            return (
              <div
                key={bp.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] flex flex-col justify-between gap-4 hover:border-gray-300 dark:hover:border-[#353840] transition-colors shadow-2xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#202228] text-gray-700 dark:text-gray-300">
                          {bp.target_company}
                        </span>
                        {bp.badge && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32]">
                            {bp.badge}
                          </span>
                        )}
                        {hasTechnicalMcq && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 flex items-center gap-1">
                            <Cpu className="w-2.5 h-2.5" /> Tech MCQs
                          </span>
                        )}
                        {hasCoding && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 flex items-center gap-1">
                            <Code2 className="w-2.5 h-2.5" /> Coding
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white font-display">
                        {bp.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {bp.description || 'Standard multi-section pattern.'}
                  </p>

                  {/* Section Breakdown Chips */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-[#222428]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Sections ({bp.sections.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {bp.sections.map((sec, sIdx) => {
                        const d = getSectionDomain(sec);
                        const isCoding = d === 'CODING';
                        const isTechnical = d === 'TECHNICAL_MCQ';
                        return (
                          <span
                            key={sIdx}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              isCoding
                                ? 'bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                : isTechnical
                                ? 'bg-violet-500/5 text-violet-600 dark:text-violet-400 border-violet-500/20'
                                : 'bg-gray-50 dark:bg-[#1c1d22] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#2c2f38]'
                            }`}
                          >
                            {isCoding ? (
                              <Code2 className="w-2.5 h-2.5" />
                            ) : isTechnical ? (
                              <Cpu className="w-2.5 h-2.5" />
                            ) : (
                              <BookOpen className="w-2.5 h-2.5" />
                            )}
                            {sec.name.split(':')[0].substring(0, 18)} ({sec.question_count} Qs
                            {sec.difficulty && sec.difficulty !== 'ALL' ? ` • ${sec.difficulty}` : ''})
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-3 border-t border-gray-100 dark:border-[#222428] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500">
                    <span className="flex items-center gap-1 font-bold text-[#FD4A32]">
                      <Clock className="w-3 h-3" />
                      {bp.duration_minutes}m
                    </span>
                    <span>{totalQuestions} Qs</span>
                    <span>{totalMarks}m</span>
                    <span>Pass {bp.passing_percentage}%</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setInspectingBlueprint(bp)}
                      title="Inspect Pattern Breakdown"
                      className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#202228] hover:bg-[#FD4A32] hover:text-white text-gray-700 dark:text-gray-200 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(bp)}
                      title="Duplicate Blueprint"
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#202228] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(bp)}
                      title="Delete Blueprint"
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightweight Blueprint Inspection Modal */}
      {inspectingBlueprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl my-6 p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-[#252830]">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32]">
                    {inspectingBlueprint.target_company}
                  </span>
                  {inspectingBlueprint.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#22242a] text-gray-600 dark:text-gray-300">
                      {inspectingBlueprint.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white font-display mt-1">
                  {inspectingBlueprint.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {inspectingBlueprint.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectingBlueprint(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#202228] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-[#18191c] border border-gray-200 dark:border-[#27292e] text-center text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Total Sections</div>
                <div className="font-bold text-sm text-gray-900 dark:text-white font-mono mt-0.5">
                  {inspectingBlueprint.sections.length}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Total Questions</div>
                <div className="font-bold text-sm text-gray-900 dark:text-white font-mono mt-0.5">
                  {inspectingBlueprint.sections.reduce((acc, s) => acc + (s.question_count || 0), 0)} Qs
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Total Duration</div>
                <div className="font-bold text-sm text-[#FD4A32] font-mono mt-0.5">
                  {inspectingBlueprint.duration_minutes} Mins
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Passing Cutoff</div>
                <div className="font-bold text-sm text-emerald-500 font-mono mt-0.5">
                  {inspectingBlueprint.passing_percentage}%
                </div>
              </div>
            </div>

            {/* Sections Detailed Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FD4A32]" />
                Section-by-Section Examination Rules
              </h4>

              <div className="space-y-2.5 max-h-[42vh] overflow-y-auto pr-1 custom-scrollbar">
                {inspectingBlueprint.sections.map((sec, idx) => {
                  const domain = getSectionDomain(sec);
                  const isCoding = domain === 'CODING';
                  const isTech = domain === 'TECHNICAL_MCQ';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-[#18191c]/70 border border-gray-200/80 dark:border-[#282a32] space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                            isCoding ? 'bg-blue-600' : isTech ? 'bg-violet-600' : 'bg-amber-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {sec.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
                          <span className="font-bold text-gray-900 dark:text-gray-200">
                            {sec.question_count} Questions
                          </span>
                          <span>•</span>
                          <span>{sec.duration_minutes} mins</span>
                          <span>•</span>
                          <span>{sec.marks_per_correct} mark(s)</span>
                          {sec.negative_marking > 0 && (
                            <span className="text-red-500">(-{sec.negative_marking})</span>
                          )}
                        </div>
                      </div>

                      {/* Topics Breakdown */}
                      {sec.topic_ids && sec.topic_ids.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Topics:</span>
                          {sec.topic_ids.map(tid => (
                            <span
                              key={tid}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-[#202228] border border-gray-200 dark:border-[#2f323c] text-gray-700 dark:text-gray-300 font-mono"
                            >
                              {tid}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-400 italic">
                          Auto-samples questions across the full domain pool.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Anti-Cheat & Proctoring Rules */}
            <div className="p-3.5 rounded-xl bg-gray-50/50 dark:bg-[#18191c]/50 border border-gray-200/80 dark:border-[#282a32] space-y-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Anti-Cheat &amp; Examination Security Rules
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-600 dark:text-gray-400 font-mono">
                <div>Fullscreen: <strong className="text-gray-900 dark:text-white">{inspectingBlueprint.enable_fullscreen_lock ? 'Enforced' : 'Off'}</strong></div>
                <div>Tab Switches: <strong className="text-gray-900 dark:text-white">{inspectingBlueprint.max_tab_switches_allowed || 3} Max</strong></div>
                <div>Random Sampling: <strong className="text-emerald-600 dark:text-emerald-400">Dynamic Bank</strong></div>
                <div>Shuffled: <strong className="text-gray-900 dark:text-white">{inspectingBlueprint.shuffle_questions ? 'Yes' : 'No'}</strong></div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-100 dark:border-[#252830] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setInspectingBlueprint(null)}
                className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
