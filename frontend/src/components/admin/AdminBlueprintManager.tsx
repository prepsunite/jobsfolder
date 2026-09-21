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
} from 'lucide-react';
import {
  mockExamBlueprintService,
  CODING_CATEGORIES,
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
                        const isCoding = sec.section_type === 'CODING' || sec.category === 'coding';
                        return (
                          <span
                            key={sIdx}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              isCoding
                                ? 'bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                : 'bg-gray-50 dark:bg-[#1c1d22] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#2c2f38]'
                            }`}
                          >
                            {isCoding ? <Code2 className="w-2.5 h-2.5" /> : <BookOpen className="w-2.5 h-2.5" />}
                            {sec.name.split(':')[0].substring(0, 18)} ({sec.question_count} Qs{sec.difficulty && sec.difficulty !== 'ALL' ? ` • ${sec.difficulty}` : ''})
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
                    const isCoding = sec.section_type === 'CODING' || sec.category === 'coding';
                    return (
                      <div
                        key={sIdx}
                        className={`p-4 rounded-xl border space-y-3 ${
                          isCoding
                            ? 'bg-blue-500/5 border-blue-500/20'
                            : 'bg-gray-50 dark:bg-[#18191c] border-gray-200 dark:border-[#27292e]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FD4A32] text-white font-mono">
                              #{sIdx + 1}
                            </span>
                            {/* Section Type Switcher */}
                            <div className="inline-flex rounded-lg border border-gray-200 dark:border-[#2c2f38] bg-white dark:bg-[#141414] p-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSectionChange(sIdx, 'section_type', 'MCQ');
                                  handleSectionChange(sIdx, 'category', 'arithmetic-aptitude');
                                  handleSectionChange(sIdx, 'topic_ids', []);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                                  !isCoding
                                    ? 'bg-[#FD4A32] text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                }`}
                              >
                                <BookOpen className="w-2.5 h-2.5" /> MCQ Section
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleSectionChange(sIdx, 'section_type', 'CODING');
                                  handleSectionChange(sIdx, 'category', 'coding');
                                  handleSectionChange(sIdx, 'topic_ids', ['ARRAYS', 'STRINGS']);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                                  isCoding
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                }`}
                              >
                                <Code2 className="w-2.5 h-2.5" /> Coding Section
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveSection(sIdx)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                              Section Name
                            </label>
                            <input
                              type="text"
                              value={sec.name}
                              onChange={e => handleSectionChange(sIdx, 'name', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
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

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                              Questions
                            </label>
                            <input
                              type="number"
                              value={sec.question_count}
                              onChange={e => handleSectionChange(sIdx, 'question_count', Number(e.target.value) || 1)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                              Marks (+ / -)
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={sec.marks_per_correct}
                                onChange={e => handleSectionChange(sIdx, 'marks_per_correct', Number(e.target.value) || 1)}
                                className="w-1/2 px-2 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                              />
                              <input
                                type="number"
                                step="0.25"
                                value={sec.negative_marking}
                                onChange={e => handleSectionChange(sIdx, 'negative_marking', Number(e.target.value) || 0)}
                                className="w-1/2 px-2 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38] text-xs text-gray-900 dark:text-white focus:outline-hidden"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Topics Picker from 500-Question Bank */}
                        <div className="space-y-1.5 pt-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                            <span>
                              {isCoding ? 'Target Coding Categories' : 'Target Topics (From 500-Q Bank)'}
                            </span>
                            <span className="text-gray-400 font-normal">
                              {(sec.topic_ids || []).length} topic(s) selected
                            </span>
                          </label>

                          {isCoding ? (
                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38]">
                              {CODING_CATEGORIES.map(cat => {
                                const isChecked = (sec.topic_ids || []).includes(cat.id);
                                return (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleToggleTopic(sIdx, cat.id)}
                                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                                      isChecked
                                        ? 'bg-blue-600 text-white font-bold'
                                        : 'bg-gray-100 dark:bg-[#202228] text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                    }`}
                                  >
                                    {cat.name}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2c2f38]">
                              {aptitudeTopics.slice(0, 60).map(t => {
                                const isChecked = (sec.topic_ids || []).includes(t.id);
                                return (
                                  <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => handleToggleTopic(sIdx, t.id)}
                                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                                      isChecked
                                        ? 'bg-[#FD4A32] text-white font-bold'
                                        : 'bg-gray-100 dark:bg-[#202228] text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                    }`}
                                  >
                                    {t.name}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Random Sampling Toggle */}
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-600 dark:text-gray-400">
                          <input
                            type="checkbox"
                            id={`random-sec-${sIdx}`}
                            checked={sec.random_sampling !== false}
                            onChange={e => handleSectionChange(sIdx, 'random_sampling', e.target.checked)}
                            className="rounded text-[#FD4A32] focus:ring-[#FD4A32]"
                          />
                          <label htmlFor={`random-sec-${sIdx}`} className="cursor-pointer">
                            🎲 <strong>Random Question Selection</strong>: Pull random questions from the topic's 500-question pool every time an exam is generated.
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
