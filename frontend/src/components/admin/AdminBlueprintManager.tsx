import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Clock,
  Award,
  Building2,
  CheckCircle2,
  Code2,
  BookOpen,
  X,
  Search,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Terminal,
  Check,
  CheckSquare,
  Square,
  Filter,
  Cpu,
  Brain,
  Settings,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  mockExamBlueprintService,
  CODING_CATEGORIES,
  APTITUDE_CATEGORIES,
  TECHNICAL_MCQ_SUBJECTS,
  EXAM_PRESET_TEMPLATES,
} from '@/services/mockExamBlueprint.service';
import type { MockExamTemplate, TemplateSectionDraft } from '@/types/tpo';
import { useToast } from '@/contexts/ToastContext';

export default function AdminBlueprintManager() {
  const queryClient = useQueryClient();
  const { toast, confirmModal } = useToast();

  const [searchFilter, setSearchFilter] = useState('');
  const [editingBlueprint, setEditingBlueprint] = useState<MockExamTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'sections' | 'settings'>('sections');
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [sectionTopicSearch, setSectionTopicSearch] = useState<Record<number, string>>({});

  // Load all blueprints
  const { data: blueprints = [], isLoading } = useQuery<MockExamTemplate[]>({
    queryKey: ['admin-blueprints'],
    queryFn: () => mockExamBlueprintService.getAllBlueprints(),
  });

  // Load available aptitude topics for section topic selection
  const { data: aptitudeTopics = [] } = useQuery({
    queryKey: ['admin-aptitude-topics-list'],
    queryFn: () => mockExamBlueprintService.getAptitudeTopics(),
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

  const handleOpenCreate = (preset?: MockExamTemplate) => {
    const base = preset || EXAM_PRESET_TEMPLATES[0]; // defaults to TCS NQT 2026/2027 official pattern
    const newBlueprint: MockExamTemplate = {
      ...JSON.parse(JSON.stringify(base)),
      id: `bp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: preset ? preset.name : 'TCS NQT 2026/2027 Official Pattern',
      is_default: false,
    };
    setEditingBlueprint(newBlueprint);
    setActiveModalTab('sections');
    setActiveSectionIdx(0);
    setIsModalOpen(true);
  };

  const handleLoadPreset = (preset: MockExamTemplate) => {
    if (!editingBlueprint) return;
    const cloned: MockExamTemplate = JSON.parse(JSON.stringify(preset));
    cloned.id = editingBlueprint.id;
    setEditingBlueprint(cloned);
    setActiveSectionIdx(0);
    setActiveModalTab('sections');
    toast.success(`Loaded "${preset.name}" with ${cloned.sections.length} sections (${cloned.duration_minutes}m total)!`);
  };

  const handleOpenEdit = (bp: MockExamTemplate) => {
    setEditingBlueprint(JSON.parse(JSON.stringify(bp)));
    setActiveModalTab('sections');
    setActiveSectionIdx(0);
    setIsModalOpen(true);
  };

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
      message: `Are you sure you want to delete "${bp.name}"? Students will no longer be able to generate mock exams from this blueprint.`,
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
      message: 'Reset all blueprints to official defaults (TCS NQT, Accenture ASE, Infosys, Cognizant, Wipro)?',
      confirmText: 'Reset to Defaults',
      isDanger: false,
    });
    if (!confirmed) return;
    try {
      await mockExamBlueprintService.resetToDefaults();
      queryClient.invalidateQueries({ queryKey: ['admin-blueprints'] });
      toast.success('Restored default blueprints.');
    } catch (e: any) {
      toast.error(e.message || 'Failed to restore defaults.');
    }
  };

  const handleSaveBlueprint = async () => {
    if (!editingBlueprint) return;
    if (!editingBlueprint.name.trim()) {
      toast.error('Please enter a blueprint name.');
      return;
    }
    if (editingBlueprint.sections.length === 0) {
      toast.error('A blueprint must have at least one section.');
      return;
    }

    try {
      setIsSaving(true);
      await mockExamBlueprintService.saveBlueprint(editingBlueprint);
      queryClient.invalidateQueries({ queryKey: ['admin-blueprints'] });
      setIsModalOpen(false);
      toast.success(`Saved blueprint "${editingBlueprint.name}".`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save blueprint.');
    } finally {
      setIsSaving(false);
    }
  };

  // Section manipulation helpers
  const handleAddSection = (preferredType?: 'MCQ' | 'TECHNICAL_MCQ' | 'CODING') => {
    if (!editingBlueprint) return;
    const newIdx = editingBlueprint.sections.length;
    const type = preferredType || 'MCQ';
    const isCoding = type === 'CODING';
    const isTech = type === 'TECHNICAL_MCQ';

    const newSec: TemplateSectionDraft = {
      name: isCoding
        ? `Section ${newIdx + 1}: Hands-on Coding Assessment`
        : isTech
        ? `Section ${newIdx + 1}: Core CS Technical MCQs`
        : `Section ${newIdx + 1}: Aptitude & Analytical Reasoning`,
      section_type: type,
      question_count: isCoding ? 2 : 15,
      marks_per_correct: isCoding ? 15 : 1,
      negative_marking: 0,
      duration_minutes: isCoding ? 45 : 20,
      category: isCoding ? 'coding' : isTech ? 'technical-mcqs' : 'all',
      coding_track: isCoding ? 'PROGRAMMING_150' : undefined,
      topic_ids: isCoding ? ['ARRAYS', 'STRINGS'] : [],
      random_sampling: true,
    };
    setEditingBlueprint({
      ...editingBlueprint,
      sections: [...editingBlueprint.sections, newSec],
    });
    setActiveSectionIdx(newIdx);
    setActiveModalTab('sections');
  };

  const handleRemoveSection = (idx: number) => {
    if (!editingBlueprint) return;
    if (editingBlueprint.sections.length <= 1) {
      toast.error('A blueprint pattern must have at least one test section.');
      return;
    }
    const updated = editingBlueprint.sections.filter((_, i) => i !== idx);
    setEditingBlueprint({
      ...editingBlueprint,
      sections: updated,
    });
    setActiveSectionIdx(Math.max(0, Math.min(activeSectionIdx, updated.length - 1)));
  };

  const handleMoveSection = (idx: number, direction: 'LEFT' | 'RIGHT') => {
    if (!editingBlueprint) return;
    const targetIdx = direction === 'LEFT' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= editingBlueprint.sections.length) return;
    const updated = [...editingBlueprint.sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setEditingBlueprint({ ...editingBlueprint, sections: updated });
    setActiveSectionIdx(targetIdx);
  };

  const handleSectionChange = (idx: number, field: keyof TemplateSectionDraft, value: any) => {
    if (!editingBlueprint) return;
    const updated = [...editingBlueprint.sections];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditingBlueprint({ ...editingBlueprint, sections: updated });
  };

  const handleToggleTopic = (secIdx: number, topicId: string) => {
    if (!editingBlueprint) return;
    const sec = editingBlueprint.sections[secIdx];
    const current = sec.topic_ids || [];
    const exists = current.includes(topicId);
    const next = exists ? current.filter(t => t !== topicId) : [...current, topicId];
    handleSectionChange(secIdx, 'topic_ids', next);
  };

  const handleSwitchDomain = (domain: 'MCQ' | 'TECHNICAL_MCQ' | 'CODING') => {
    if (!editingBlueprint) return;
    const safeIdx = Math.max(0, Math.min(activeSectionIdx, editingBlueprint.sections.length - 1));
    const sec = editingBlueprint.sections[safeIdx];
    const isCurrentlyCoding = sec.section_type === 'CODING';
    const sNum = safeIdx + 1;

    if (domain === 'CODING') {
      const isDefaultName = !sec.name || sec.name.includes('Aptitude') || sec.name.includes('Technical') || sec.name.startsWith(`Section ${sNum}`);
      handleSectionChange(safeIdx, 'section_type', 'CODING');
      handleSectionChange(safeIdx, 'category', 'coding');
      handleSectionChange(safeIdx, 'coding_track', 'PROGRAMMING_150');
      handleSectionChange(safeIdx, 'topic_ids', ['ARRAYS', 'STRINGS']);
      if (isDefaultName) {
        handleSectionChange(safeIdx, 'name', `Section ${sNum}: Hands-on Coding Assessment`);
      }
      if (sec.question_count > 5) {
        handleSectionChange(safeIdx, 'question_count', 2);
      }
      if (sec.marks_per_correct <= 1) {
        handleSectionChange(safeIdx, 'marks_per_correct', 15);
      }
      if (!sec.duration_minutes || sec.duration_minutes < 30) {
        handleSectionChange(safeIdx, 'duration_minutes', 45);
      }
    } else if (domain === 'TECHNICAL_MCQ') {
      const isDefaultName = !sec.name || sec.name.includes('Aptitude') || sec.name.includes('Coding') || sec.name.startsWith(`Section ${sNum}`);
      handleSectionChange(safeIdx, 'section_type', 'TECHNICAL_MCQ');
      handleSectionChange(safeIdx, 'category', 'technical-mcqs');
      handleSectionChange(safeIdx, 'coding_track', undefined);
      handleSectionChange(safeIdx, 'topic_ids', []);
      if (isDefaultName) {
        handleSectionChange(safeIdx, 'name', `Section ${sNum}: Core CS Technical MCQs`);
      }
      if (isCurrentlyCoding || sec.question_count <= 2) {
        handleSectionChange(safeIdx, 'question_count', 15);
        handleSectionChange(safeIdx, 'marks_per_correct', 1);
        handleSectionChange(safeIdx, 'duration_minutes', 20);
      }
    } else {
      const isDefaultName = !sec.name || sec.name.includes('Technical') || sec.name.includes('Coding') || sec.name.startsWith(`Section ${sNum}`);
      handleSectionChange(safeIdx, 'section_type', 'MCQ');
      handleSectionChange(safeIdx, 'category', 'all');
      handleSectionChange(safeIdx, 'coding_track', undefined);
      handleSectionChange(safeIdx, 'topic_ids', []);
      if (isDefaultName) {
        handleSectionChange(safeIdx, 'name', `Section ${sNum}: Aptitude & Analytical Reasoning`);
      }
      if (isCurrentlyCoding || sec.question_count <= 2) {
        handleSectionChange(safeIdx, 'question_count', 20);
        handleSectionChange(safeIdx, 'marks_per_correct', 1);
        handleSectionChange(safeIdx, 'duration_minutes', 25);
      }
    }
  };

  const handleCompleteAndAddNext = () => {
    if (!editingBlueprint) return;
    const safeIdx = Math.max(0, Math.min(activeSectionIdx, editingBlueprint.sections.length - 1));
    const currentSec = editingBlueprint.sections[safeIdx];
    if (!currentSec.name.trim()) {
      toast.error(`Please provide a name for Section ${safeIdx + 1}.`);
      return;
    }
    if (!currentSec.question_count || currentSec.question_count < 1) {
      toast.error(`Section ${safeIdx + 1} must have at least 1 question.`);
      return;
    }

    const nextIdx = editingBlueprint.sections.length;
    const nextType: 'MCQ' | 'TECHNICAL_MCQ' | 'CODING' =
      currentSec.section_type === 'MCQ'
        ? 'TECHNICAL_MCQ'
        : currentSec.section_type === 'TECHNICAL_MCQ'
        ? 'CODING'
        : 'MCQ';

    const newSec: TemplateSectionDraft = {
      name:
        nextType === 'CODING'
          ? `Section ${nextIdx + 1}: Hands-on Coding Assessment`
          : nextType === 'TECHNICAL_MCQ'
          ? `Section ${nextIdx + 1}: Core CS Technical MCQs`
          : `Section ${nextIdx + 1}: Aptitude & Analytical Reasoning`,
      section_type: nextType,
      question_count: nextType === 'CODING' ? 2 : 15,
      marks_per_correct: nextType === 'CODING' ? 15 : 1,
      negative_marking: 0,
      duration_minutes: nextType === 'CODING' ? 45 : 20,
      category: nextType === 'CODING' ? 'coding' : nextType === 'TECHNICAL_MCQ' ? 'technical-mcqs' : 'all',
      coding_track: nextType === 'CODING' ? 'PROGRAMMING_150' : undefined,
      topic_ids: nextType === 'CODING' ? ['ARRAYS', 'STRINGS'] : [],
      random_sampling: true,
    };

    setEditingBlueprint({
      ...editingBlueprint,
      sections: [...editingBlueprint.sections, newSec],
    });
    setActiveSectionIdx(nextIdx);
    toast.success(`Section ${safeIdx + 1} completed! Choose the discipline for Section ${nextIdx + 1}.`);
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
            <span>Admin Blueprint Studio</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
            Mock Exam Blueprints & Test Patterns
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Define multi-section mock exam patterns (MCQ & Coding), assign topics from the 500-Q bank, and enable random sampling.
          </p>

          {/* Quick-Launch 1-Click Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FD4A32]" /> Fast Templates:
            </span>
            {EXAM_PRESET_TEMPLATES.slice(0, 4).map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleOpenCreate(preset)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#1c1d22] text-gray-700 dark:text-gray-300 hover:bg-[#FD4A32] hover:text-white border border-gray-200 dark:border-[#2c2f38] transition-all cursor-pointer"
              >
                + {preset.badge || preset.target_company}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2c2f38] hover:bg-gray-50 dark:hover:bg-[#1c1d22] text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={() => handleOpenCreate(EXAM_PRESET_TEMPLATES[0])}
            className="px-4 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Blueprint
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
                className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] flex flex-col justify-between gap-4 hover:border-gray-300 dark:hover:border-[#353840] transition-colors"
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
                      onClick={() => handleDuplicate(bp)}
                      title="Duplicate Blueprint"
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#202228] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(bp)}
                      title="Edit Blueprint"
                      className="p-1.5 rounded-lg hover:bg-[#FD4A32]/10 text-[#FD4A32] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
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

      {/* Blueprint Editor Modal */}
      {isModalOpen && editingBlueprint && (() => {
        const modalTotalQuestions = editingBlueprint.sections.reduce((acc, s) => acc + (s.question_count || 0), 0);
        const modalTotalMarks = editingBlueprint.sections.reduce(
          (acc, s) => acc + (s.question_count || 0) * (s.marks_per_correct || 1),
          0
        );
        const safeSectionIdx = Math.max(0, Math.min(activeSectionIdx, editingBlueprint.sections.length - 1));
        const activeSec = editingBlueprint.sections[safeSectionIdx] || editingBlueprint.sections[0];
        const secDomain = getSectionDomain(activeSec);
        const isCoding = secDomain === 'CODING';
        const isTechnicalMcq = secDomain === 'TECHNICAL_MCQ';
        const isAptitudeMcq = secDomain === 'MCQ';

        // Filter topics for the active section
        const searchQuery = (sectionTopicSearch[safeSectionIdx] || '').toLowerCase().trim();
        let visibleItems: { id: string; name: string; badge?: string }[] = [];

        if (isAptitudeMcq) {
          const activeCategory = activeSec.category || 'all';
          visibleItems = aptitudeTopics
            .filter(t => activeCategory === 'all' || t.category_slug === activeCategory)
            .map(t => {
              let badge = t.category_slug;
              if (badge === 'arithmetic-aptitude') badge = 'Quant';
              else if (badge === 'data-interpretation') badge = 'DI';
              else if (badge === 'logical-reasoning') badge = 'Logical';
              else if (badge === 'verbal-ability') badge = 'Verbal';
              else if (badge === 'verbal-reasoning') badge = 'Verbal Reas';
              else if (badge === 'non-verbal-reasoning') badge = 'Nonverbal';
              else if (badge === 'technical-aptitude') badge = 'Cognitive';
              return { id: t.id, name: t.name, badge };
            })
            .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery) || t.id.toLowerCase().includes(searchQuery));
        } else if (isTechnicalMcq) {
          const activeSubject = activeSec.category || 'technical-mcqs';
          visibleItems = TECHNICAL_MCQ_SUBJECTS
            .filter(s => activeSubject === 'technical-mcqs' || s.id === activeSubject)
            .map(s => ({ id: s.id, name: s.name, badge: s.cluster }))
            .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery) || t.id.toLowerCase().includes(searchQuery));
        } else if (isCoding) {
          const activeTrack = activeSec.coding_track || 'ALL';
          visibleItems = CODING_CATEGORIES
            .filter(c => activeTrack === 'ALL' || c.track === activeTrack)
            .map(c => ({ id: c.id, name: c.name, badge: c.track === 'PROGRAMMING_150' ? 'P150' : 'DSA' }))
            .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery) || c.id.toLowerCase().includes(searchQuery));
        }

        const selectedCount = (activeSec.topic_ids || []).length;
        const visibleIds = visibleItems.map(item => item.id);

        const handleSelectAllVisible = () => {
          const merged = Array.from(new Set([...(activeSec.topic_ids || []), ...visibleIds]));
          handleSectionChange(safeSectionIdx, 'topic_ids', merged);
        };

        const handleClearAllVisible = () => {
          const remaining = (activeSec.topic_ids || []).filter(id => !visibleIds.includes(id));
          handleSectionChange(safeSectionIdx, 'topic_ids', remaining);
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="w-full max-w-4xl my-6 p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] shadow-2xl space-y-5">
              {/* Top Modal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-[#252830]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white font-display">
                      {editingBlueprint.id.startsWith('bp-') ? 'Edit Blueprint Pattern' : 'Create Exam Blueprint'}
                    </h3>
                    {editingBlueprint.target_company && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#22242a] text-gray-600 dark:text-gray-300">
                        {editingBlueprint.target_company}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure multi-section examination rules, topics, and question counts with guided flow.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Live Quick Stats */}
                  <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono bg-gray-50 dark:bg-[#1c1d22] px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2c2f38] text-gray-600 dark:text-gray-300">
                    <span className="font-bold text-[#FD4A32]">{editingBlueprint.sections.length} Secs</span>
                    <span>•</span>
                    <span>{modalTotalQuestions} Qs</span>
                    <span>•</span>
                    <span>{modalTotalMarks} Marks</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {editingBlueprint.duration_minutes}m
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#202228] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ⚡ Quick-Load Industry Blueprint Presets */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-[#FD4A32]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#FD4A32] text-white shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block font-display">
                      ⚡ Quick-Load Official Company Patterns
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      Pre-fill exact sections, timings, marks, and topics in 1-click
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {EXAM_PRESET_TEMPLATES.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleLoadPreset(preset)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-[#18191c] hover:bg-[#FD4A32] hover:text-white text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2c2f38] hover:border-[#FD4A32] transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                      title={`${preset.name} (${preset.sections.length} sections, ${preset.duration_minutes}m)`}
                    >
                      <span>{preset.badge || preset.target_company}</span>
                      <span className="text-[9px] opacity-75 font-mono">({preset.sections.length}S)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#222428] pb-2">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('sections')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeModalTab === 'sections'
                      ? 'bg-[#FD4A32] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202228]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sections & Curriculum Flow</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeModalTab === 'sections'
                      ? 'bg-black/20 text-white'
                      : 'bg-gray-100 dark:bg-[#282a32] text-gray-700 dark:text-gray-300'
                  }`}>
                    {editingBlueprint.sections.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab('settings')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeModalTab === 'settings'
                      ? 'bg-[#FD4A32] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202228]'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Pattern Rules & Anti-Cheat</span>
                </button>
              </div>

              {/* TAB 1: SECTIONS & CURRICULUM FLOW */}
              {activeModalTab === 'sections' && (
                <div className="space-y-4 max-h-[72vh] overflow-y-auto pr-1">
                  {/* Horizontal Section Stepper Rail */}
                  <div className="flex items-center justify-between gap-3 pb-1 border-b border-gray-100 dark:border-[#222428]">
                    <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
                      {editingBlueprint.sections.map((sec, sIdx) => {
                        const domain = getSectionDomain(sec);
                        const isSelected = sIdx === safeSectionIdx;
                        const isSecCoding = domain === 'CODING';
                        const isSecTech = domain === 'TECHNICAL_MCQ';

                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => setActiveSectionIdx(sIdx)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-gray-900 dark:border-white shadow-sm font-bold'
                                : 'bg-white dark:bg-[#18191c] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#2c2f38] hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'bg-[#FD4A32] text-white'
                                : 'bg-gray-100 dark:bg-[#252830] text-gray-500'
                            }`}>
                              {sIdx + 1}
                            </span>
                            {isSecCoding ? (
                              <Code2 className="w-3.5 h-3.5 text-blue-500" />
                            ) : isSecTech ? (
                              <Cpu className="w-3.5 h-3.5 text-violet-500" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                            )}
                            <span className="truncate max-w-[130px]">
                              {sec.name.replace(/^Section \d+:\s*/i, '') || `Section ${sIdx + 1}`}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              isSelected
                                ? 'bg-white/20 dark:bg-black/20'
                                : 'bg-gray-100 dark:bg-[#252830] text-gray-500'
                            }`}>
                              {sec.question_count} Qs
                            </span>
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => handleAddSection()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#FD4A32] bg-[#FD4A32]/10 hover:bg-[#FD4A32]/20 border border-[#FD4A32]/30 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Section</span>
                      </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 font-mono whitespace-nowrap">
                      <span>Section {safeSectionIdx + 1} of {editingBlueprint.sections.length}</span>
                    </div>
                  </div>

                  {/* Active Section Canvas */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border space-y-5 transition-colors ${
                      isCoding
                        ? 'bg-blue-500/5 border-blue-500/30 dark:bg-blue-950/10'
                        : isTechnicalMcq
                        ? 'bg-violet-500/5 border-violet-500/30 dark:bg-violet-950/10'
                        : 'bg-amber-500/5 border-amber-500/30 dark:bg-amber-950/10'
                    }`}
                  >
                    {/* STAGE 1: What should be evaluated in this section? */}
                    <div className="space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center ${
                            isCoding ? 'bg-blue-600' : isTechnicalMcq ? 'bg-violet-600' : 'bg-amber-500'
                          }`}>
                            1
                          </span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                            What should be evaluated in Section #{safeSectionIdx + 1}?
                          </h4>
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          Select the discipline format for this section
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Option 1: Aptitude MCQs */}
                        <button
                          type="button"
                          onClick={() => handleSwitchDomain('MCQ')}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all relative cursor-pointer flex flex-col justify-between ${
                            isAptitudeMcq
                              ? 'bg-white dark:bg-[#18191c] border-amber-500 dark:border-amber-500 shadow-md ring-2 ring-amber-500/20'
                              : 'bg-white/60 dark:bg-[#141414]/60 border-gray-200 dark:border-[#282a32] hover:border-amber-300 dark:hover:border-amber-800/60 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className={`p-2 rounded-lg ${
                                isAptitudeMcq ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-[#22242a] text-gray-500'
                              }`}>
                                <BookOpen className="w-4 h-4" />
                              </div>
                              {isAptitudeMcq && (
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                                  <Check className="w-3 h-3" /> Selected
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-gray-900 dark:text-white">Aptitude & Reasoning</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              Quantitative, Logical, Verbal, and Data Interpretation question bank.
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-[#22242a] flex items-center justify-between text-[10px] text-gray-400">
                            <span>Aptitude Bank</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">500+ Questions</span>
                          </div>
                        </button>

                        {/* Option 2: Technical MCQs */}
                        <button
                          type="button"
                          onClick={() => handleSwitchDomain('TECHNICAL_MCQ')}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all relative cursor-pointer flex flex-col justify-between ${
                            isTechnicalMcq
                              ? 'bg-white dark:bg-[#18191c] border-violet-500 dark:border-violet-500 shadow-md ring-2 ring-violet-500/20'
                              : 'bg-white/60 dark:bg-[#141414]/60 border-gray-200 dark:border-[#282a32] hover:border-violet-300 dark:hover:border-violet-800/60 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className={`p-2 rounded-lg ${
                                isTechnicalMcq ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-[#22242a] text-gray-500'
                              }`}>
                                <Cpu className="w-4 h-4" />
                              </div>
                              {isTechnicalMcq && (
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white shadow-xs">
                                  <Check className="w-3 h-3" /> Selected
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-gray-900 dark:text-white">Core CS Technical MCQs</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              DSA, DBMS, OS, Computer Networks, OOPs, Web, Cloud & AI with code snippets.
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-[#22242a] flex items-center justify-between text-[10px] text-gray-400">
                            <span>Technical Bank</span>
                            <span className="font-semibold text-violet-600 dark:text-violet-400">All CS Subjects</span>
                          </div>
                        </button>

                        {/* Option 3: Hands-on Coding */}
                        <button
                          type="button"
                          onClick={() => handleSwitchDomain('CODING')}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all relative cursor-pointer flex flex-col justify-between ${
                            isCoding
                              ? 'bg-white dark:bg-[#18191c] border-blue-500 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                              : 'bg-white/60 dark:bg-[#141414]/60 border-gray-200 dark:border-[#282a32] hover:border-blue-300 dark:hover:border-blue-800/60 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className={`p-2 rounded-lg ${
                                isCoding ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-[#22242a] text-gray-500'
                              }`}>
                                <Code2 className="w-4 h-4" />
                              </div>
                              {isCoding && (
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                                  <Check className="w-3 h-3" /> Selected
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-gray-900 dark:text-white">Hands-on Coding Assessment</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              Real-time IDE code execution against comprehensive test cases.
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-[#22242a] flex items-center justify-between text-[10px] text-gray-400">
                            <span>IDE Runner</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">P150 & DSA Tracks</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* STAGE 2: Configure Rules & Scoring */}
                    <div className="space-y-3 pt-3 border-t border-gray-200/60 dark:border-[#282a32]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-[11px] font-bold flex items-center justify-center">
                          2
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                          Section Configuration & Scoring Rules
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* Section Name */}
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            Section Title *
                          </label>
                          <input
                            type="text"
                            value={activeSec.name}
                            onChange={e => handleSectionChange(safeSectionIdx, 'name', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                            placeholder="e.g. Section 1: Quantitative Ability"
                          />
                          {/* Quick Title Suggestions */}
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Quick Ideas:</span>
                            {isAptitudeMcq && [
                              'Numerical Ability',
                              'Reasoning Ability',
                              'Verbal Ability',
                              'Part A: Numerical Ability',
                              'Part A: Reasoning Ability',
                              'Part A: Verbal Ability',
                              'Part B: Advanced Quant & Reasoning',
                            ].map(suggestion => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSectionChange(safeSectionIdx, 'name', suggestion)}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#202228] hover:bg-amber-600 hover:text-white text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                              >
                                {suggestion}
                              </button>
                            ))}
                            {isTechnicalMcq && [
                              'Core CS Technical Assessment',
                              'Programming Logic & CS Fundamentals',
                              'Data Structures & Algorithms MCQs',
                              'DBMS & Cloud Systems',
                            ].map(suggestion => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSectionChange(safeSectionIdx, 'name', suggestion)}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#202228] hover:bg-violet-600 hover:text-white text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                              >
                                {suggestion}
                              </button>
                            ))}
                            {isCoding && [
                              'Part B: Advanced Hands-on Coding',
                              'Hands-on Coding Assessment',
                              'DSA Coding Challenge',
                              'Pure Coding OA Round',
                            ].map(suggestion => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSectionChange(safeSectionIdx, 'name', suggestion)}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#202228] hover:bg-blue-600 hover:text-white text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Category / Subject / Track Filter */}
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Filter className="w-3 h-3 text-gray-400" />
                            {isAptitudeMcq
                              ? 'Aptitude Category Filter'
                              : isTechnicalMcq
                              ? 'Core CS Subject Filter'
                              : 'Target Coding Track'}
                          </label>
                          {isAptitudeMcq ? (
                            <select
                              value={activeSec.category || 'all'}
                              onChange={e => {
                                handleSectionChange(safeSectionIdx, 'category', e.target.value);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                            >
                              <option value="all">🌐 All Aptitude Domains (Cross-Select Quant + DI + Logical + Verbal)</option>
                              {APTITUDE_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          ) : isTechnicalMcq ? (
                            <select
                              value={activeSec.category || 'technical-mcqs'}
                              onChange={e => {
                                const val = e.target.value;
                                handleSectionChange(safeSectionIdx, 'category', val);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                            >
                              <option value="technical-mcqs">All Core CS Subjects (Mixed Technical Pool)</option>
                              {TECHNICAL_MCQ_SUBJECTS.map(subj => (
                                <option key={subj.id} value={subj.id}>
                                  {subj.name} • {subj.cluster}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <select
                              value={activeSec.coding_track || 'ALL'}
                              onChange={e => {
                                const val = e.target.value as any;
                                handleSectionChange(safeSectionIdx, 'coding_track', val);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                            >
                              <option value="ALL">All Tracks (Foundation + Advanced DSA)</option>
                              <option value="PROGRAMMING_150">Programming 150 Foundation (Arrays, Strings, Maths)</option>
                              <option value="CAMPUS_DSA">Campus DSA Roadmap (Trees, Graphs, DP, Linked Lists)</option>
                            </select>
                          )}
                        </div>

                        {/* Difficulty */}
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            Difficulty Level
                          </label>
                          <select
                            value={activeSec.difficulty || 'ALL'}
                            onChange={e => handleSectionChange(safeSectionIdx, 'difficulty', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                          >
                            <option value="ALL">Mixed Difficulty</option>
                            <option value="EASY">Easy (Foundation L1)</option>
                            <option value="MEDIUM">Medium (Standard L2)</option>
                            <option value="HARD">Hard (Advanced L3)</option>
                          </select>
                        </div>

                        {/* Question Count & Presets */}
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            Question Count
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={activeSec.question_count}
                              onChange={e => handleSectionChange(safeSectionIdx, 'question_count', Math.max(1, Number(e.target.value) || 1))}
                              className="w-16 px-2 py-1.5 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs font-bold text-center text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                            />
                            <div className="flex items-center gap-1">
                              {(isCoding ? [1, 2, 3, 5] : [10, 15, 20, 30]).map(num => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => handleSectionChange(safeSectionIdx, 'question_count', num)}
                                  className={`px-1.5 py-1 rounded text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                                    activeSec.question_count === num
                                      ? 'bg-[#FD4A32] text-white'
                                      : 'bg-gray-100 dark:bg-[#202228] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2a2c34]'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Marks per Correct */}
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            Marks per Question
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={activeSec.marks_per_correct}
                            onChange={e => handleSectionChange(safeSectionIdx, 'marks_per_correct', Math.max(1, Number(e.target.value) || 1))}
                            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs font-bold text-center text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                          />
                        </div>

                        {/* Negative Penalty & Time Limit */}
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            Penalty / Time Limit
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              step="0.25"
                              min={0}
                              value={activeSec.negative_marking}
                              onChange={e => handleSectionChange(safeSectionIdx, 'negative_marking', Math.max(0, Number(e.target.value) || 0))}
                              title="Negative marking penalty per wrong answer"
                              placeholder="-0.25"
                              className="w-1/2 px-2 py-1.5 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-center text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                            />
                            <div className="w-1/2 flex items-center gap-1 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] px-2 py-1.5 rounded-xl">
                              <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                              <input
                                type="number"
                                min={5}
                                value={activeSec.duration_minutes || 20}
                                onChange={e => handleSectionChange(safeSectionIdx, 'duration_minutes', Math.max(1, Number(e.target.value) || 1))}
                                title="Section duration in minutes"
                                className="w-full text-xs text-center text-gray-900 dark:text-white bg-transparent focus:outline-hidden"
                              />
                              <span className="text-[10px] text-gray-400">m</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STAGE 3: Curriculum Scope & Topic Selection */}
                    <div className="space-y-3 pt-3 border-t border-gray-200/60 dark:border-[#282a32]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-[11px] font-bold flex items-center justify-center">
                            3
                          </span>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                              Curriculum Scope & Topic Selection
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              Target specific topics or leave unselected to auto-sample across all subjects.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                            selectedCount > 0
                              ? isCoding
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                : isTechnicalMcq
                                ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                          }`}>
                            {selectedCount > 0 ? `${selectedCount} Selected` : 'All Topics Included'}
                          </span>

                          <div className="relative">
                            <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={sectionTopicSearch[safeSectionIdx] || ''}
                              onChange={e =>
                                setSectionTopicSearch({ ...sectionTopicSearch, [safeSectionIdx]: e.target.value })
                              }
                              placeholder="Filter topics..."
                              className="pl-7 pr-2.5 py-1 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white placeholder-gray-400 w-36 sm:w-44 focus:outline-hidden focus:border-[#FD4A32]"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleSelectAllVisible}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 dark:bg-[#202228] hover:bg-gray-200 dark:hover:bg-[#2a2c34] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                          >
                            Select All
                          </button>

                          <button
                            type="button"
                            onClick={handleClearAllVisible}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 dark:bg-[#202228] hover:bg-gray-200 dark:hover:bg-[#2a2c34] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      {/* Domain Quick Filters */}
                      {isAptitudeMcq && (
                        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-gray-50/80 dark:bg-[#18191c]/80 border border-gray-200/60 dark:border-[#282a32]">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Filter Domain:</span>
                          <button
                            type="button"
                            onClick={() => handleSectionChange(safeSectionIdx, 'category', 'all')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              (!activeSec.category || activeSec.category === 'all')
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-white dark:bg-[#202228] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282a32]'
                            }`}
                          >
                            🌐 All Categories
                          </button>
                          {APTITUDE_CATEGORIES.map(cat => {
                            const isCatActive = activeSec.category === cat.id;
                            let shortLabel = cat.name.replace(' Aptitude', '').replace(' Reasoning', '').replace(' Ability', '');
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleSectionChange(safeSectionIdx, 'category', cat.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  isCatActive
                                    ? 'bg-amber-600 text-white shadow-2xs'
                                    : 'bg-white dark:bg-[#202228] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282a32]'
                                }`}
                              >
                                {shortLabel}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {isTechnicalMcq && (
                        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-gray-50/80 dark:bg-[#18191c]/80 border border-gray-200/60 dark:border-[#282a32]">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Filter Subject:</span>
                          <button
                            type="button"
                            onClick={() => handleSectionChange(safeSectionIdx, 'category', 'technical-mcqs')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              (!activeSec.category || activeSec.category === 'technical-mcqs')
                                ? 'bg-violet-600 text-white shadow-2xs'
                                : 'bg-white dark:bg-[#202228] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282a32]'
                            }`}
                          >
                            All CS Subjects
                          </button>
                          {TECHNICAL_MCQ_SUBJECTS.map(subj => {
                            const isSubjActive = activeSec.category === subj.id;
                            return (
                              <button
                                key={subj.id}
                                type="button"
                                onClick={() => handleSectionChange(safeSectionIdx, 'category', subj.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  isSubjActive
                                    ? 'bg-violet-600 text-white shadow-2xs'
                                    : 'bg-white dark:bg-[#202228] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282a32]'
                                }`}
                              >
                                {subj.name}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {isCoding && (
                        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-gray-50/80 dark:bg-[#18191c]/80 border border-gray-200/60 dark:border-[#282a32]">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Filter Track:</span>
                          {[
                            { id: 'ALL', label: 'All Coding Topics' },
                            { id: 'PROGRAMMING_150', label: 'Programming 150 Foundation' },
                            { id: 'CAMPUS_DSA', label: 'Campus DSA Roadmap' },
                          ].map(trk => {
                            const isTrackActive = (activeSec.coding_track || 'ALL') === trk.id;
                            return (
                              <button
                                key={trk.id}
                                type="button"
                                onClick={() => handleSectionChange(safeSectionIdx, 'coding_track', trk.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  isTrackActive
                                    ? 'bg-blue-600 text-white shadow-2xs'
                                    : 'bg-white dark:bg-[#202228] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282a32]'
                                }`}
                              >
                                {trk.label}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Selected Topics Tray */}
                      {selectedCount > 0 && (
                        <div className="p-3 rounded-xl bg-white dark:bg-[#18191c] border border-gray-200 dark:border-[#27292e] space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                              <Check className="w-4 h-4 text-emerald-500" />
                              Selected Topics for Section #{safeSectionIdx + 1} ({selectedCount})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSectionChange(safeSectionIdx, 'topic_ids', [])}
                              className="text-[11px] text-red-500 hover:text-red-600 font-semibold cursor-pointer"
                            >
                              Clear All ({selectedCount})
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pt-0.5">
                            {activeSec.topic_ids?.map(tid => {
                              let label = tid;
                              const aptItem = aptitudeTopics.find((t: any) => t.id === tid);
                              const techItem = TECHNICAL_MCQ_SUBJECTS.find(t => t.id === tid);
                              const codeItem = CODING_CATEGORIES.find(t => t.id === tid);
                              if (aptItem) label = aptItem.name;
                              else if (techItem) label = techItem.name;
                              else if (codeItem) label = codeItem.name;

                              return (
                                <span
                                  key={tid}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-[#202228] border border-gray-200 dark:border-[#2f323c] text-gray-800 dark:text-gray-200 shadow-2xs"
                                >
                                  <span>{label}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleTopic(safeSectionIdx, tid)}
                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                                    title={`Remove ${label}`}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Chips Container */}
                      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-3 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] custom-scrollbar">
                        {visibleItems.length === 0 ? (
                          <div className="py-4 text-center w-full text-xs text-gray-400">
                            No topics match current filter.
                          </div>
                        ) : (
                          visibleItems.map(item => {
                            const isChecked = (activeSec.topic_ids || []).includes(item.id);
                            const activeColor = isCoding
                              ? 'bg-blue-600 text-white shadow-xs font-bold'
                              : isTechnicalMcq
                              ? 'bg-violet-600 text-white shadow-xs font-bold'
                              : 'bg-amber-600 text-white shadow-xs font-bold';

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleToggleTopic(safeSectionIdx, item.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                  isChecked
                                    ? activeColor
                                    : 'bg-gray-100 dark:bg-[#202228] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#282a32]'
                                }`}
                              >
                                <Check
                                  className={`w-3 h-3 transition-opacity ${
                                    isChecked ? 'opacity-100' : 'opacity-0 -mr-3'
                                  }`}
                                />
                                <span>{item.name}</span>
                                {item.badge && (
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                                    isChecked
                                      ? 'bg-black/20 text-white/90'
                                      : 'bg-gray-200 dark:bg-[#2c2f38] text-gray-500'
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Random Question Sampling Checkbox */}
                      <div className="flex items-center gap-2 pt-2 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-[#22242a]">
                        <input
                          type="checkbox"
                          id={`random-sec-${safeSectionIdx}`}
                          checked={activeSec.random_sampling !== false}
                          onChange={e => handleSectionChange(safeSectionIdx, 'random_sampling', e.target.checked)}
                          className="rounded text-[#FD4A32] focus:ring-[#FD4A32] cursor-pointer"
                        />
                        <label htmlFor={`random-sec-${safeSectionIdx}`} className="cursor-pointer">
                          🎲 <strong>Dynamic Random Sampling</strong>: Pull randomized questions from the pool every time an exam session is generated.
                        </label>
                      </div>
                    </div>

                    {/* STAGE 4: Guided Flow Navigation Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200/80 dark:border-[#282a32] bg-white/40 dark:bg-[#141414]/40 p-3 rounded-xl">
                      {/* Left: Reorder & Remove Section */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleMoveSection(safeSectionIdx, 'LEFT')}
                          disabled={safeSectionIdx === 0}
                          title="Move section earlier"
                          className="p-2 rounded-lg border border-gray-200 dark:border-[#2c2f38] hover:bg-gray-100 dark:hover:bg-[#202228] text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1 text-xs"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Move Earlier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSection(safeSectionIdx, 'RIGHT')}
                          disabled={safeSectionIdx === editingBlueprint.sections.length - 1}
                          title="Move section later"
                          className="p-2 rounded-lg border border-gray-200 dark:border-[#2c2f38] hover:bg-gray-100 dark:hover:bg-[#202228] text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1 text-xs"
                        >
                          <span className="hidden sm:inline">Move Later</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(safeSectionIdx)}
                          disabled={editingBlueprint.sections.length <= 1}
                          title={editingBlueprint.sections.length <= 1 ? 'An exam blueprint must have at least 1 section' : 'Delete Section'}
                          className="p-2 rounded-lg border border-red-200 dark:border-red-950/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1 text-xs ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>

                      {/* Right: Section Navigation & Hero Progression Button */}
                      <div className="flex items-center gap-2">
                        {safeSectionIdx > 0 && (
                          <button
                            type="button"
                            onClick={() => setActiveSectionIdx(safeSectionIdx - 1)}
                            className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#2c2f38] hover:bg-gray-100 dark:hover:bg-[#202228] text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Prev Section</span>
                          </button>
                        )}

                        {safeSectionIdx < editingBlueprint.sections.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => setActiveSectionIdx(safeSectionIdx + 1)}
                            className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Next Section</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        {/* Google-Grade Hero Action: Complete and Add Next Section */}
                        <button
                          type="button"
                          onClick={handleCompleteAndAddNext}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FD4A32] to-[#E0351D] hover:from-[#E0351D] hover:to-[#C02510] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Complete & Add Next Section</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PATTERN RULES & ANTI-CHEAT SETTINGS */}
              {activeModalTab === 'settings' && (
                <div className="space-y-4 max-h-[72vh] overflow-y-auto pr-1">
                  {/* General Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Blueprint Name *
                      </label>
                      <input
                        type="text"
                        value={editingBlueprint.name}
                        onChange={e => setEditingBlueprint({ ...editingBlueprint, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Target Recruiter / Company *
                      </label>
                      <input
                        type="text"
                        value={editingBlueprint.target_company}
                        onChange={e => setEditingBlueprint({ ...editingBlueprint, target_company: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Badge / Tag
                      </label>
                      <input
                        type="text"
                        value={editingBlueprint.badge || ''}
                        onChange={e => setEditingBlueprint({ ...editingBlueprint, badge: e.target.value })}
                        placeholder="e.g. ₹7–9 LPA Prime"
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Total Exam Duration (Mins)
                      </label>
                      <input
                        type="number"
                        value={editingBlueprint.duration_minutes}
                        onChange={e => setEditingBlueprint({ ...editingBlueprint, duration_minutes: Number(e.target.value) || 90 })}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Passing % (Scorecard)
                      </label>
                      <input
                        type="number"
                        value={editingBlueprint.passing_percentage}
                        onChange={e => setEditingBlueprint({ ...editingBlueprint, passing_percentage: Number(e.target.value) || 45 })}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Description / Overview
                    </label>
                    <textarea
                      rows={2}
                      value={editingBlueprint.description || ''}
                      onChange={e => setEditingBlueprint({ ...editingBlueprint, description: e.target.value })}
                      placeholder="Overview of this evaluation pattern..."
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                    />
                  </div>

                  {/* Proctoring, Anti-Cheat & Exam Rules */}
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-[#27292e] bg-gray-50 dark:bg-[#18191c] space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                        Proctoring & Exam Integrity Rules
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingBlueprint.enable_fullscreen_lock !== false}
                          onChange={e => setEditingBlueprint({ ...editingBlueprint, enable_fullscreen_lock: e.target.checked })}
                          className="mt-0.5 rounded text-[#FD4A32] focus:ring-[#FD4A32]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 dark:text-white block">Enforce Fullscreen Lock</span>
                          <span className="text-gray-500 text-[11px]">Requires student to enter and remain in full screen.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingBlueprint.enable_tab_switch_detection !== false}
                          onChange={e => setEditingBlueprint({ ...editingBlueprint, enable_tab_switch_detection: e.target.checked })}
                          className="mt-0.5 rounded text-[#FD4A32] focus:ring-[#FD4A32]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 dark:text-white block">Tab Switch Detection</span>
                          <span className="text-gray-500 text-[11px]">Records unfocus/blur proctor events automatically.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingBlueprint.shuffle_questions !== false}
                          onChange={e => setEditingBlueprint({ ...editingBlueprint, shuffle_questions: e.target.checked })}
                          className="mt-0.5 rounded text-[#FD4A32] focus:ring-[#FD4A32]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 dark:text-white block">Randomize Question Order</span>
                          <span className="text-gray-500 text-[11px]">Shuffles question sequence for every candidate.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingBlueprint.shuffle_options !== false}
                          onChange={e => setEditingBlueprint({ ...editingBlueprint, shuffle_options: e.target.checked })}
                          className="mt-0.5 rounded text-[#FD4A32] focus:ring-[#FD4A32]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 dark:text-white block">Randomize Option Order</span>
                          <span className="text-gray-500 text-[11px]">Shuffles MCQ options (A, B, C, D) dynamically.</span>
                        </div>
                      </label>
                    </div>

                    <div className="pt-3 border-t border-gray-200 dark:border-[#252830] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <label className="text-gray-600 dark:text-gray-400">Max allowed tab switches before warning:</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={editingBlueprint.max_tab_switches_allowed || 3}
                          onChange={e => setEditingBlueprint({ ...editingBlueprint, max_tab_switches_allowed: Number(e.target.value) || 3 })}
                          className="w-16 px-2 py-1 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-center font-bold text-gray-900 dark:text-white focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveModalTab('sections')}
                        className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-[#282a32] hover:bg-gray-300 dark:hover:bg-[#32353e] text-xs font-semibold text-gray-800 dark:text-gray-200 transition-colors cursor-pointer self-end sm:self-auto flex items-center gap-1.5"
                      >
                        <span>Return to Sections Flow</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Bottom Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-[#252830]">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {editingBlueprint.sections.length} Section{editingBlueprint.sections.length > 1 ? 's' : ''}
                  </span>
                  <span>•</span>
                  <span>{modalTotalQuestions} Total Qs</span>
                  <span>•</span>
                  <span>{modalTotalMarks} Max Marks</span>
                  <span>•</span>
                  <span className="text-[#FD4A32] font-semibold">{editingBlueprint.duration_minutes}m Duration</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2c2f38] hover:bg-gray-50 dark:hover:bg-[#1c1d22] text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBlueprint}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Saving Blueprint...' : 'Save Blueprint'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
