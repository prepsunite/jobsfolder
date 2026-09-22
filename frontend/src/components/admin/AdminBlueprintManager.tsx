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
} from 'lucide-react';
import {
  mockExamBlueprintService,
  CODING_CATEGORIES,
  APTITUDE_CATEGORIES,
  TECHNICAL_MCQ_SUBJECTS,
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

  const handleOpenCreate = () => {
    const newBlueprint: MockExamTemplate = {
      id: `bp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: 'New Campus Drive Pattern',
      target_company: 'Custom Recruiter',
      badge: 'Campus Drive',
      description: 'Official test blueprint with multi-section structure.',
      duration_minutes: 90,
      passing_percentage: 45,
      enable_fullscreen_lock: true,
      enable_tab_switch_detection: true,
      max_tab_switches_allowed: 3,
      shuffle_questions: true,
      shuffle_options: true,
      show_results_immediately: true,
      sections: [
        {
          name: 'Section 1: Quantitative & Numerical Ability',
          section_type: 'MCQ',
          question_count: 20,
          marks_per_correct: 1,
          negative_marking: 0,
          duration_minutes: 30,
          category: 'arithmetic-aptitude',
          topic_ids: ['numbers', 'time-and-work'],
          random_sampling: true,
        },
        {
          name: 'Section 2: Hands-on Coding Assessment',
          section_type: 'CODING',
          question_count: 2,
          marks_per_correct: 15,
          negative_marking: 0,
          duration_minutes: 45,
          category: 'coding',
          coding_track: 'PROGRAMMING_150',
          topic_ids: ['ARRAYS', 'STRINGS'],
          random_sampling: true,
        },
      ],
    };
    setEditingBlueprint(newBlueprint);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bp: MockExamTemplate) => {
    setEditingBlueprint(JSON.parse(JSON.stringify(bp)));
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
  const handleAddSection = () => {
    if (!editingBlueprint) return;
    const newSec: TemplateSectionDraft = {
      name: `Section ${editingBlueprint.sections.length + 1}`,
      section_type: 'MCQ',
      question_count: 15,
      marks_per_correct: 1,
      negative_marking: 0,
      duration_minutes: 20,
      category: 'arithmetic-aptitude',
      topic_ids: [],
      random_sampling: true,
    };
    setEditingBlueprint({
      ...editingBlueprint,
      sections: [...editingBlueprint.sections, newSec],
    });
  };

  const handleRemoveSection = (idx: number) => {
    if (!editingBlueprint) return;
    setEditingBlueprint({
      ...editingBlueprint,
      sections: editingBlueprint.sections.filter((_, i) => i !== idx),
    });
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
            onClick={handleOpenCreate}
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
      {isModalOpen && editingBlueprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl my-8 p-6 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#27292e] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#252830]">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white font-display">
                  {editingBlueprint.id.startsWith('bp-') ? 'Edit Blueprint Pattern' : 'Create Exam Blueprint'}
                </h3>
                <p className="text-xs text-gray-500">Configure multi-section examination rules, topics, and question counts.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#202228] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
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
                    Total Duration (Mins)
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
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingBlueprint.description || ''}
                  onChange={e => setEditingBlueprint({ ...editingBlueprint, description: e.target.value })}
                  placeholder="Overview of this pattern..."
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                />
              </div>

              {/* Sections Builder */}
              <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-[#252830]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#FD4A32]" />
                    Test Sections ({editingBlueprint.sections.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#202228] hover:bg-gray-200 dark:hover:bg-[#282a32] text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Section
                  </button>
                </div>

                <div className="space-y-4">
                  {editingBlueprint.sections.map((sec, sIdx) => {
                    const domain = getSectionDomain(sec);
                    const isCoding = domain === 'CODING';
                    const isTechnicalMcq = domain === 'TECHNICAL_MCQ';
                    const isAptitudeMcq = domain === 'MCQ';

                    // Topic search query for this section
                    const searchQuery = (sectionTopicSearch[sIdx] || '').toLowerCase().trim();

                    // Visible topics calculation based on domain and category/track filter
                    let visibleItems: { id: string; name: string; badge?: string }[] = [];

                    if (isAptitudeMcq) {
                      const activeCategory = sec.category || 'all';
                      visibleItems = aptitudeTopics
                        .filter(t => activeCategory === 'all' || t.category_slug === activeCategory)
                        .map(t => ({ id: t.id, name: t.name, badge: t.category_slug }))
                        .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery) || t.id.toLowerCase().includes(searchQuery));
                    } else if (isTechnicalMcq) {
                      const activeSubject = sec.category || 'technical-mcqs';
                      visibleItems = TECHNICAL_MCQ_SUBJECTS
                        .filter(s => activeSubject === 'technical-mcqs' || s.id === activeSubject)
                        .map(s => ({ id: s.id, name: s.name, badge: s.cluster }))
                        .filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery) || s.id.toLowerCase().includes(searchQuery));
                    } else if (isCoding) {
                      const activeTrack = sec.coding_track || 'ALL';
                      visibleItems = CODING_CATEGORIES
                        .filter(c => activeTrack === 'ALL' || c.track === activeTrack)
                        .map(c => ({ id: c.id, name: c.name, badge: c.track === 'PROGRAMMING_150' ? 'P150' : 'DSA' }))
                        .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery) || c.id.toLowerCase().includes(searchQuery));
                    }

                    const selectedCount = (sec.topic_ids || []).length;
                    const visibleIds = visibleItems.map(item => item.id);

                    const handleSelectAllVisible = () => {
                      const merged = Array.from(new Set([...(sec.topic_ids || []), ...visibleIds]));
                      handleSectionChange(sIdx, 'topic_ids', merged);
                    };

                    const handleClearAllVisible = () => {
                      const remaining = (sec.topic_ids || []).filter(id => !visibleIds.includes(id));
                      handleSectionChange(sIdx, 'topic_ids', remaining);
                    };

                    return (
                      <div
                        key={sIdx}
                        className={`p-4 rounded-xl border space-y-3 transition-colors ${
                          isCoding
                            ? 'bg-blue-500/5 border-blue-500/30 dark:bg-blue-950/10'
                            : isTechnicalMcq
                            ? 'bg-violet-500/5 border-violet-500/30 dark:bg-violet-950/10'
                            : 'bg-gray-50 dark:bg-[#18191c] border-gray-200 dark:border-[#27292e]'
                        }`}
                      >
                        {/* Section Header & 3-way Domain Switcher */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono text-white ${
                              isCoding ? 'bg-blue-600' : isTechnicalMcq ? 'bg-violet-600' : 'bg-[#FD4A32]'
                            }`}>
                              #{sIdx + 1}
                            </span>

                            {/* 3-Domain Switcher */}
                            <div className="inline-flex rounded-lg border border-gray-200 dark:border-[#2c2f38] bg-white dark:bg-[#141414] p-0.5 shadow-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSectionChange(sIdx, 'section_type', 'MCQ');
                                  handleSectionChange(sIdx, 'category', 'arithmetic-aptitude');
                                  handleSectionChange(sIdx, 'coding_track', undefined);
                                  handleSectionChange(sIdx, 'topic_ids', []);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isAptitudeMcq
                                    ? 'bg-[#FD4A32] text-white shadow-xs'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>Aptitude MCQs</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleSectionChange(sIdx, 'section_type', 'TECHNICAL_MCQ');
                                  handleSectionChange(sIdx, 'category', 'technical-mcqs');
                                  handleSectionChange(sIdx, 'coding_track', undefined);
                                  handleSectionChange(sIdx, 'topic_ids', []);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isTechnicalMcq
                                    ? 'bg-violet-600 text-white shadow-xs'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                              >
                                <Cpu className="w-3 h-3" />
                                <span>Technical MCQs</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleSectionChange(sIdx, 'section_type', 'CODING');
                                  handleSectionChange(sIdx, 'category', 'coding');
                                  handleSectionChange(sIdx, 'coding_track', 'PROGRAMMING_150');
                                  handleSectionChange(sIdx, 'topic_ids', ['ARRAYS', 'STRINGS']);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isCoding
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                              >
                                <Code2 className="w-3 h-3" />
                                <span>Hands-on Coding</span>
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveSection(sIdx)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                            title="Remove Section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Row 1: Section Name, Category/Track Dropdown, Difficulty, Questions, Marks */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                          {/* Section Name */}
                          <div className="sm:col-span-4 space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Section Name
                            </label>
                            <input
                              type="text"
                              value={sec.name}
                              onChange={e => handleSectionChange(sIdx, 'name', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                              placeholder="e.g. Quantitative Ability"
                            />
                          </div>

                          {/* Domain Category / Subject / Track Selector */}
                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                              <Filter className="w-2.5 h-2.5 text-gray-400" />
                              {isAptitudeMcq
                                ? 'Category / Domain'
                                : isTechnicalMcq
                                ? 'Core CS Subject'
                                : 'Coding Track'}
                            </label>

                            {isAptitudeMcq ? (
                              <select
                                value={sec.category || 'arithmetic-aptitude'}
                                onChange={e => {
                                  handleSectionChange(sIdx, 'category', e.target.value);
                                  handleSectionChange(sIdx, 'topic_ids', []);
                                }}
                                className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                              >
                                <option value="all">All Aptitude Categories (Mixed)</option>
                                {APTITUDE_CATEGORIES.map(cat => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            ) : isTechnicalMcq ? (
                              <select
                                value={sec.category || 'technical-mcqs'}
                                onChange={e => {
                                  const val = e.target.value;
                                  handleSectionChange(sIdx, 'category', val);
                                  if (val !== 'technical-mcqs') {
                                    handleSectionChange(sIdx, 'topic_ids', [val]);
                                  } else {
                                    handleSectionChange(sIdx, 'topic_ids', []);
                                  }
                                }}
                                className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                              >
                                <option value="technical-mcqs">All Core CS Subjects (Mixed Pool)</option>
                                {TECHNICAL_MCQ_SUBJECTS.map(subj => (
                                  <option key={subj.id} value={subj.id}>
                                    {subj.name} • {subj.cluster}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <select
                                value={sec.coding_track || 'ALL'}
                                onChange={e => {
                                  const val = e.target.value as any;
                                  handleSectionChange(sIdx, 'coding_track', val);
                                  handleSectionChange(sIdx, 'topic_ids', []);
                                }}
                                className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                              >
                                <option value="ALL">All Tracks (Foundation & Advanced)</option>
                                <option value="PROGRAMMING_150">Programming 150 Foundation</option>
                                <option value="CAMPUS_DSA">Campus DSA Roadmap</option>
                              </select>
                            )}
                          </div>

                          {/* Difficulty */}
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Difficulty
                            </label>
                            <select
                              value={sec.difficulty || 'ALL'}
                              onChange={e => handleSectionChange(sIdx, 'difficulty', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                            >
                              <option value="ALL">Mixed</option>
                              <option value="EASY">Easy (L1)</option>
                              <option value="MEDIUM">Med (L2)</option>
                              <option value="HARD">Hard (L3)</option>
                            </select>
                          </div>

                          {/* Question Count */}
                          <div className="sm:col-span-1 space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Questions
                            </label>
                            <input
                              type="number"
                              value={sec.question_count}
                              onChange={e => handleSectionChange(sIdx, 'question_count', Number(e.target.value) || 1)}
                              className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden text-center"
                            />
                          </div>

                          {/* Marks (+ / -) */}
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Marks (+ / -)
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={sec.marks_per_correct}
                                onChange={e => handleSectionChange(sIdx, 'marks_per_correct', Number(e.target.value) || 1)}
                                className="w-1/2 px-1.5 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden text-center"
                                title="Marks per correct"
                              />
                              <input
                                type="number"
                                step="0.25"
                                value={sec.negative_marking}
                                onChange={e => handleSectionChange(sIdx, 'negative_marking', Number(e.target.value) || 0)}
                                className="w-1/2 px-1.5 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden text-center"
                                title="Negative marking penalty"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Topic Picker with Search, Select All, Clear All, and Chips */}
                        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-[#24262c]">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                {isCoding
                                  ? 'Target Coding Problem Types'
                                  : isTechnicalMcq
                                  ? 'Target Core CS Topics'
                                  : 'Target Aptitude Topics'}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                                selectedCount > 0
                                  ? isCoding
                                    ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                    : isTechnicalMcq
                                    ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300'
                                    : 'bg-[#FD4A32]/10 text-[#FD4A32]'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                              }`}>
                                {selectedCount > 0 ? `${selectedCount} selected` : 'Auto-Sample All'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Topic Search within this section */}
                              <div className="relative">
                                <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={sectionTopicSearch[sIdx] || ''}
                                  onChange={e =>
                                    setSectionTopicSearch({ ...sectionTopicSearch, [sIdx]: e.target.value })
                                  }
                                  placeholder="Filter topics..."
                                  className="pl-6 pr-2 py-1 rounded-md bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-[10px] text-gray-900 dark:text-white placeholder-gray-400 w-32 sm:w-40 focus:outline-hidden"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={handleSelectAllVisible}
                                className="px-2 py-1 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-[#202228] hover:bg-gray-200 dark:hover:bg-[#2a2c34] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                              >
                                Select All
                              </button>

                              <button
                                type="button"
                                onClick={handleClearAllVisible}
                                className="px-2 py-1 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-[#202228] hover:bg-gray-200 dark:hover:bg-[#2a2c34] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                              >
                                Clear
                              </button>
                            </div>
                          </div>

                          {/* Chips Container */}
                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] custom-scrollbar">
                            {visibleItems.length === 0 ? (
                              <div className="py-3 text-center w-full text-xs text-gray-400">
                                No topics match current filter.
                              </div>
                            ) : (
                              visibleItems.map(item => {
                                const isChecked = (sec.topic_ids || []).includes(item.id);
                                const activeColor = isCoding
                                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                                  : isTechnicalMcq
                                  ? 'bg-violet-600 text-white shadow-xs font-bold'
                                  : 'bg-[#FD4A32] text-white shadow-xs font-bold';

                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleToggleTopic(sIdx, item.id)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
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
                                      <span className={`text-[9px] px-1 py-0.2 rounded ${
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

                          <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
                            {selectedCount === 0
                              ? 'ℹ️ With 0 topics selected, questions will be automatically sampled across all topics in this domain.'
                              : `✓ Questions will only be drawn from the ${selectedCount} selected topic(s).`}
                          </p>
                        </div>

                        {/* Random Sampling Toggle */}
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-[#24262c]">
                          <input
                            type="checkbox"
                            id={`random-sec-${sIdx}`}
                            checked={sec.random_sampling !== false}
                            onChange={e => handleSectionChange(sIdx, 'random_sampling', e.target.checked)}
                            className="rounded text-[#FD4A32] focus:ring-[#FD4A32]"
                          />
                          <label htmlFor={`random-sec-${sIdx}`} className="cursor-pointer">
                            🎲 <strong>Random Question Selection</strong>: Pull randomized questions from the 500-question pool every time an exam is generated.
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-[#252830]">
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
      )}
    </div>
  );
}
