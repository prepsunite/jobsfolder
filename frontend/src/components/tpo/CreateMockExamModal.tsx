import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Zap,
  Settings2,
  Edit3,
  Search,
} from 'lucide-react';
import { tpoService } from '@/services/tpo.service';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { MockExamTemplate } from '@/types/tpo';

interface CreateMockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeId: string;
  onSuccess: () => void;
}

interface SectionDraft {
  name: string;
  topic_ids: string[];
  question_count: number;
  marks_per_correct: number;
  negative_marking: number;
  duration_minutes?: number;
}

const PRESET_COMPANIES = [
  'TCS NQT',
  'Accenture',
  'Infosys',
  'Cognizant GenC',
  'Wipro Turbo',
  'Capgemini',
  'General CRT Aptitude',
];

export default function CreateMockExamModal({
  isOpen,
  onClose,
  collegeId,
  onSuccess,
}: CreateMockExamModalProps) {
  const { isAdmin } = useAuth();

  // Mode: 'TEMPLATES' (1-Click Gallery) | 'CUSTOM' (3-Step Wizard) | 'ADMIN_EDIT_TEMPLATE' (Admin Pattern Editor)
  const [modalMode, setModalMode] = useState<'TEMPLATES' | 'CUSTOM' | 'ADMIN_EDIT_TEMPLATE'>('TEMPLATES');
  const [templateSearch, setTemplateSearch] = useState('');
  const [launchingTemplateId, setLaunchingTemplateId] = useState<string | null>(null);

  // Template query (built-ins + cloud saved patterns)
  const {
    data: templates = [],
    isLoading: templatesLoading,
    refetch: refetchTemplates,
  } = useQuery<MockExamTemplate[]>({
    queryKey: ['tpo-exam-templates'],
    queryFn: () => tpoService.getExamTemplates(),
    enabled: isOpen,
  });

  // Admin Pattern Editor State
  const [editingTemplate, setEditingTemplate] = useState<MockExamTemplate | null>(null);
  const [isAdminSavingTemplate, setIsAdminSavingTemplate] = useState(false);

  // Fetch existing aptitude topics for TPO to select from
  const { data: dbTopics = [] } = useQuery({
    queryKey: ['tpo-aptitude-topics'],
    queryFn: async () => {
      const { data } = await supabase
        .from('aptitude_topics')
        .select('id, name, category_slug, cluster')
        .eq('is_hidden', false)
        .order('name');
      return data || [];
    },
    enabled: isOpen,
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState('TCS NQT');
  const [description, setDescription] = useState('');
  const [instructions] = useState(
    '1. Test must be taken in Fullscreen Mode.\n2. Switching tabs or minimizing browser will be flagged by proctor.\n3. Test will auto-submit when the countdown expires.'
  );
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [passingPercentage, setPassingPercentage] = useState(40);
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [endTime, setEndTime] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  // Anti-Cheat Settings
  const [enableTabSwitchDetection, setEnableTabSwitchDetection] = useState(true);
  const [maxTabSwitchesAllowed, setMaxTabSwitchesAllowed] = useState(3);
  const [enableFullscreenLock, setEnableFullscreenLock] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [showResultsImmediately, setShowResultsImmediately] = useState(true);

  // Target Filter
  const [targetDepartment, setTargetDepartment] = useState('ALL');
  const [targetBatchYear, setTargetBatchYear] = useState(2026);

  // Sections Configuration
  const [sections, setSections] = useState<SectionDraft[]>([
    {
      name: 'Numerical Ability & Quantitative Aptitude',
      topic_ids: [],
      question_count: 20,
      marks_per_correct: 1,
      negative_marking: 0,
    },
    {
      name: 'Reasoning & Logical Deduction',
      topic_ids: [],
      question_count: 20,
      marks_per_correct: 1,
      negative_marking: 0,
    },
    {
      name: 'Verbal Ability & Reading Comprehension',
      topic_ids: [],
      question_count: 15,
      marks_per_correct: 1,
      negative_marking: 0,
    },
  ]);

  if (!isOpen) return null;

  // ⚡ 1-Click Launch Handler
  const handle1ClickLaunch = async (tmpl: MockExamTemplate) => {
    if (!collegeId) {
      alert('Missing college identifier.');
      return;
    }

    setLaunchingTemplateId(tmpl.id);
    try {
      await tpoService.createExamFromTemplate(collegeId, tmpl);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Failed to launch exam: ${err.message || 'Unknown error'}`);
    } finally {
      setLaunchingTemplateId(null);
    }
  };

  // Prepopulate custom wizard from a template
  const handleCustomizeTemplate = (tmpl: MockExamTemplate) => {
    setTitle(`${tmpl.name} - Placement Drive`);
    setTargetCompany(tmpl.target_company);
    setDescription(tmpl.description || '');
    setDurationMinutes(tmpl.duration_minutes);
    setPassingPercentage(tmpl.passing_percentage);
    setEnableFullscreenLock(tmpl.enable_fullscreen_lock ?? true);
    setEnableTabSwitchDetection(tmpl.enable_tab_switch_detection ?? true);
    setMaxTabSwitchesAllowed(tmpl.max_tab_switches_allowed ?? 3);
    setShuffleQuestions(tmpl.shuffle_questions ?? true);
    setShuffleOptions(tmpl.shuffle_options ?? true);
    setShowResultsImmediately(tmpl.show_results_immediately ?? true);

    setSections(
      tmpl.sections.map(s => ({
        name: s.name,
        question_count: s.question_count,
        marks_per_correct: s.marks_per_correct,
        negative_marking: s.negative_marking,
        duration_minutes: s.duration_minutes,
        topic_ids: s.topic_ids || [],
      }))
    );

    setModalMode('CUSTOM');
    setStep(1);
  };

  // Super Admin: Start New Pattern
  const handleCreateNewPattern = () => {
    setEditingTemplate({
      id: `tmpl-custom-${Date.now().toString(36)}`,
      name: 'New Custom Placement Pattern',
      target_company: 'General CRT Aptitude',
      badge: 'Campus Drive',
      description: 'Custom placement exam blueprint pooled from verified question repository.',
      duration_minutes: 60,
      passing_percentage: 40,
      enable_fullscreen_lock: true,
      enable_tab_switch_detection: true,
      max_tab_switches_allowed: 3,
      shuffle_questions: true,
      shuffle_options: true,
      show_results_immediately: true,
      sections: [
        {
          name: 'Section 1: Quantitative & Logic',
          question_count: 20,
          marks_per_correct: 1,
          negative_marking: 0,
          topic_ids: [],
        },
        {
          name: 'Section 2: Verbal & Reading',
          question_count: 20,
          marks_per_correct: 1,
          negative_marking: 0,
          topic_ids: [],
        },
      ],
    });
    setModalMode('ADMIN_EDIT_TEMPLATE');
  };

  // Super Admin: Edit Pattern
  const handleEditPattern = (tmpl: MockExamTemplate) => {
    setEditingTemplate({
      ...tmpl,
      sections: tmpl.sections.map(s => ({ ...s })),
    });
    setModalMode('ADMIN_EDIT_TEMPLATE');
  };

  // Super Admin: Save Pattern
  const handleSavePattern = async () => {
    if (!editingTemplate || !editingTemplate.name.trim()) {
      alert('Please enter a valid template name.');
      return;
    }
    if (editingTemplate.sections.length === 0) {
      alert('Template must contain at least one section.');
      return;
    }

    setIsAdminSavingTemplate(true);
    try {
      await tpoService.saveExamTemplate(editingTemplate);
      await refetchTemplates();
      setModalMode('TEMPLATES');
      setEditingTemplate(null);
    } catch (err: any) {
      alert(`Failed to save template: ${err.message}`);
    } finally {
      setIsAdminSavingTemplate(false);
    }
  };

  // Super Admin: Delete Pattern
  const handleDeletePattern = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this custom template pattern?')) return;
    try {
      await tpoService.deleteExamTemplate(templateId);
      await refetchTemplates();
    } catch (err: any) {
      alert(`Failed to delete template: ${err.message}`);
    }
  };

  const handleAddSection = () => {
    setSections(prev => [
      ...prev,
      {
        name: `Section ${prev.length + 1}`,
        topic_ids: [],
        question_count: 15,
        marks_per_correct: 1,
        negative_marking: 0,
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSection = (index: number, updates: Partial<SectionDraft>) => {
    setSections(prev =>
      prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  };

  const totalQuestions = sections.reduce((acc, s) => acc + (Number(s.question_count) || 0), 0);
  const totalMarks = sections.reduce(
    (acc, s) => acc + (Number(s.question_count) || 0) * (Number(s.marks_per_correct) || 1),
    0
  );

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Please enter an exam title.');
      return;
    }
    if (sections.length === 0 || totalQuestions === 0) {
      alert('Please configure at least one section with questions.');
      return;
    }

    setIsSubmitting(true);
    try {
      await tpoService.createMockExam(
        {
          college_id: collegeId,
          title,
          target_company: targetCompany,
          description,
          instructions,
          duration_minutes: durationMinutes,
          total_marks: totalMarks,
          passing_percentage: passingPercentage,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          is_active: true,
          enable_tab_switch_detection: enableTabSwitchDetection,
          max_tab_switches_allowed: maxTabSwitchesAllowed,
          enable_fullscreen_lock: enableFullscreenLock,
          shuffle_questions: shuffleQuestions,
          shuffle_options: shuffleOptions,
          show_results_immediately: showResultsImmediately,
          target_departments: targetDepartment === 'ALL' ? [] : [targetDepartment],
          target_batch_year: targetBatchYear,
        },
        sections
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Failed to create exam: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTemplates = templates.filter(t => {
    const q = templateSearch.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.target_company.toLowerCase().includes(q) ||
      (t.badge && t.badge.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#2e3035] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#151618]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {modalMode === 'ADMIN_EDIT_TEMPLATE'
                  ? 'Exam Pattern Architect (Admin)'
                  : 'Add Campus Mock Assessment'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {modalMode === 'TEMPLATES'
                  ? 'Launch in 1-click using verified industry exam blueprints'
                  : modalMode === 'ADMIN_EDIT_TEMPLATE'
                  ? 'Customize section patterns, question counts, and duration for institutions'
                  : "Pooled automatically from PrepUnite's verified question repository"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-gray-100 dark:border-[#2e3035] bg-white dark:bg-[#1a1b1e]">
          <button
            type="button"
            onClick={() => setModalMode('TEMPLATES')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              modalMode === 'TEMPLATES'
                ? 'bg-[#FD4A32] text-white shadow-sm shadow-[#FD4A32]/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> ⚡ 1-Click Blueprints
          </button>
          <button
            type="button"
            onClick={() => {
              setModalMode('CUSTOM');
              setStep(1);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              modalMode === 'CUSTOM'
                ? 'bg-[#FD4A32] text-white shadow-sm shadow-[#FD4A32]/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" /> 🛠️ Custom Builder
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={handleCreateNewPattern}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                modalMode === 'ADMIN_EDIT_TEMPLATE'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/25'
                  : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> + New Pattern (Admin)
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">

          {/* ========================================================= */}
          {/* 1. 1-CLICK TEMPLATES GALLERY                              */}
          {/* ========================================================= */}
          {modalMode === 'TEMPLATES' && (
            <div className="space-y-4">
              {/* Search & Quality Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search blueprints (TCS, Accenture...)"
                    value={templateSearch}
                    onChange={e => setTemplateSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 self-start sm:self-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Pre-configured with company patterns & negative marking rules</span>
                </div>
              </div>

              {/* Blueprints Grid */}
              {templatesLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-xs font-semibold">Loading Exam Blueprints...</p>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No exam blueprints found matching "{templateSearch}".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.map(tmpl => {
                    const totalQs = tmpl.sections.reduce(
                      (a, s) => a + (Number(s.question_count) || 0),
                      0
                    );
                    const isLaunching = launchingTemplateId === tmpl.id;

                    return (
                      <div
                        key={tmpl.id}
                        className="p-4 rounded-2xl border border-gray-200 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#202225]/60 hover:border-orange-400 dark:hover:border-orange-500/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950/50 text-[#FD4A32] dark:text-orange-400">
                                {tmpl.target_company}
                              </span>
                              {tmpl.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200/70 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                  {tmpl.badge}
                                </span>
                              )}
                            </div>
                            {isAdmin && (
                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => handleEditPattern(tmpl)}
                                  className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                  title="Edit Pattern (Admin)"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {!tmpl.is_default && (
                                  <button
                                    type="button"
                                    onClick={e => handleDeletePattern(tmpl.id, e)}
                                    className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                                    title="Delete Custom Pattern"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                            {tmpl.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                            {tmpl.description}
                          </p>

                          {/* Stat Badges */}
                          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white dark:bg-[#151618] border border-gray-100 dark:border-[#2b2d31] text-[11px] mb-3">
                            <div>
                              <span className="text-gray-400 block text-[9px] uppercase font-bold">
                                Duration
                              </span>
                              <span className="font-bold text-gray-800 dark:text-gray-200">
                                {tmpl.duration_minutes} Mins
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[9px] uppercase font-bold">
                                Questions
                              </span>
                              <span className="font-bold text-gray-800 dark:text-gray-200">
                                {totalQs} Qs
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[9px] uppercase font-bold">
                                Pass Cutoff
                              </span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {tmpl.passing_percentage}%
                              </span>
                            </div>
                          </div>

                          {/* Sections List */}
                          <div className="space-y-1 mb-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Sections ({tmpl.sections.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {tmpl.sections.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-200/60 dark:bg-[#2b2d31] text-[10px] font-semibold text-gray-700 dark:text-gray-300"
                                >
                                  {s.name}{' '}
                                  <span className="opacity-60">({s.question_count}Q)</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-[#2e3035]">
                          <button
                            type="button"
                            onClick={() => handleCustomizeTemplate(tmpl)}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2b2d31] transition-colors"
                          >
                            Customize
                          </button>
                          <button
                            type="button"
                            disabled={isLaunching}
                            onClick={() => handle1ClickLaunch(tmpl)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm shadow-[#FD4A32]/25"
                          >
                            {isLaunching ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Launching...
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5" /> 🚀 1-Click Add Exam
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. ADMIN PATTERN ARCHITECT                                */}
          {/* ========================================================= */}
          {modalMode === 'ADMIN_EDIT_TEMPLATE' && editingTemplate && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 flex items-start gap-2.5 text-xs text-purple-800 dark:text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Super Admin Exam Pattern Architect:</strong> Saved patterns become immediately available for all colleges and TPO coordinators to deploy in 1 click.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Pattern / Blueprint Name *
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={e =>
                      setEditingTemplate({ ...editingTemplate, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Target Company
                  </label>
                  <select
                    value={editingTemplate.target_company}
                    onChange={e =>
                      setEditingTemplate({ ...editingTemplate, target_company: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                  >
                    {PRESET_COMPANIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="300"
                    value={editingTemplate.duration_minutes}
                    onChange={e =>
                      setEditingTemplate({
                        ...editingTemplate,
                        duration_minutes: parseInt(e.target.value) || 60,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Passing Cutoff Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={editingTemplate.passing_percentage}
                    onChange={e =>
                      setEditingTemplate({
                        ...editingTemplate,
                        passing_percentage: parseInt(e.target.value) || 40,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Description & Syllabus Blueprint
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.description || ''}
                    onChange={e =>
                      setEditingTemplate({ ...editingTemplate, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Sections Architecture */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Section Architecture ({editingTemplate.sections.length} Sections)
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTemplate({
                        ...editingTemplate,
                        sections: [
                          ...editingTemplate.sections,
                          {
                            name: `Section ${editingTemplate.sections.length + 1}`,
                            question_count: 15,
                            marks_per_correct: 1,
                            negative_marking: 0,
                            topic_ids: [],
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#FD4A32]/10 text-[#FD4A32] hover:bg-[#FD4A32]/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Section
                  </button>
                </div>

                <div className="space-y-3">
                  {editingTemplate.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-gray-200 dark:border-[#2e3035] bg-gray-50/70 dark:bg-[#202225] space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-6 h-6 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={sec.name}
                            onChange={e => {
                              const updated = [...editingTemplate.sections];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setEditingTemplate({ ...editingTemplate, sections: updated });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-bold"
                          />
                        </div>

                        {editingTemplate.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingTemplate.sections.filter((_, i) => i !== idx);
                              setEditingTemplate({ ...editingTemplate, sections: updated });
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            Questions
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={sec.question_count}
                            onChange={e => {
                              const updated = [...editingTemplate.sections];
                              updated[idx] = {
                                ...updated[idx],
                                question_count: parseInt(e.target.value) || 1,
                              };
                              setEditingTemplate({ ...editingTemplate, sections: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-semibold text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            Marks / Correct
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={sec.marks_per_correct}
                            onChange={e => {
                              const updated = [...editingTemplate.sections];
                              updated[idx] = {
                                ...updated[idx],
                                marks_per_correct: parseInt(e.target.value) || 1,
                              };
                              setEditingTemplate({ ...editingTemplate, sections: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-semibold text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            Neg. Marking
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="2"
                            value={sec.negative_marking}
                            onChange={e => {
                              const updated = [...editingTemplate.sections];
                              updated[idx] = {
                                ...updated[idx],
                                negative_marking: parseFloat(e.target.value) || 0,
                              };
                              setEditingTemplate({ ...editingTemplate, sections: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-semibold text-center"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Save Bar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#2e3035]">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('TEMPLATES');
                    setEditingTemplate(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePattern}
                  disabled={isAdminSavingTemplate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FD4A32]/20"
                >
                  {isAdminSavingTemplate ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Pattern...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Save Template Pattern
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. CUSTOM BUILDER (3-STEP WIZARD)                         */}
          {/* ========================================================= */}
          {modalMode === 'CUSTOM' && (
            <div className="space-y-6">
              {/* Wizard Step Indicator */}
              <div className="p-3 bg-gray-100/60 dark:bg-[#202225] rounded-xl flex items-center justify-between text-xs font-semibold">
                <button
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-1.5 ${
                    step === 1 ? 'text-[#FD4A32] font-bold' : 'text-gray-500'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center text-[10px]">1</span>
                  Details & Schedule
                </button>
                <span className="text-gray-300 dark:text-gray-600">→</span>
                <button
                  onClick={() => setStep(2)}
                  className={`flex items-center gap-1.5 ${
                    step === 2 ? 'text-[#FD4A32] font-bold' : 'text-gray-500'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center text-[10px]">2</span>
                  Sections ({totalQuestions} Qs)
                </button>
                <span className="text-gray-300 dark:text-gray-600">→</span>
                <button
                  onClick={() => setStep(3)}
                  className={`flex items-center gap-1.5 ${
                    step === 3 ? 'text-[#FD4A32] font-bold' : 'text-gray-500'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center text-[10px]">3</span>
                  Anti-Cheat & Review
                </button>
              </div>

              {/* Step 1: Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Exam Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TCS NQT Campus Placement Test 2026"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Target Company
                      </label>
                      <select
                        value={targetCompany}
                        onChange={e => setTargetCompany(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold text-gray-800 dark:text-gray-200"
                      >
                        {PRESET_COMPANIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="300"
                        value={durationMinutes}
                        onChange={e => setDurationMinutes(parseInt(e.target.value) || 60)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Active Window Opens
                      </label>
                      <input
                        type="datetime-local"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Active Window Closes
                      </label>
                      <input
                        type="datetime-local"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Target Department
                      </label>
                      <select
                        value={targetDepartment}
                        onChange={e => setTargetDepartment(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                      >
                        <option value="ALL">All Departments (Campus-Wide)</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="MECH">MECH</option>
                        <option value="CIVIL">CIVIL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Target Batch Passout Year
                      </label>
                      <select
                        value={targetBatchYear}
                        onChange={e => setTargetBatchYear(parseInt(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Sections */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Sections & Question Pools ({totalQuestions} Questions • {totalMarks} Marks)
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FD4A32]/10 text-[#FD4A32] hover:bg-[#FD4A32]/20 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Section
                    </button>
                  </div>

                  <div className="space-y-4">
                    {sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-gray-200 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#202225] space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-6 h-6 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={sec.name}
                              onChange={e => handleUpdateSection(idx, { name: e.target.value })}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-bold"
                            />
                          </div>

                          {sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                              Question Count
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={sec.question_count}
                              onChange={e =>
                                handleUpdateSection(idx, {
                                  question_count: parseInt(e.target.value) || 1,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-semibold text-center"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                              Marks / Correct
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={sec.marks_per_correct}
                              onChange={e =>
                                handleUpdateSection(idx, {
                                  marks_per_correct: parseInt(e.target.value) || 1,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-semibold text-center"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                              Negative Marks
                            </label>
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="2"
                              value={sec.negative_marking}
                              onChange={e =>
                                handleUpdateSection(idx, {
                                  negative_marking: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-semibold text-center"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            Topic Clusters (Optional - Leave empty to pool from all verified questions)
                          </label>
                          <select
                            multiple
                            value={sec.topic_ids}
                            onChange={e => {
                              const selected = Array.from(e.target.selectedOptions, o => o.value);
                              handleUpdateSection(idx, { topic_ids: selected });
                            }}
                            className="w-full h-24 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs"
                          >
                            {dbTopics.map(t => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.cluster || t.category_slug})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Anti-Cheat & Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#202225] border border-gray-200 dark:border-[#2e3035] space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                      <ShieldCheck className="w-4 h-4 text-[#FD4A32]" />
                      Anti-Cheat Proctoring Rules
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          Enforce Fullscreen Lockdown
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Candidate must remain in fullscreen mode throughout the examination.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={enableFullscreenLock}
                        onChange={e => setEnableFullscreenLock(e.target.checked)}
                        className="w-4 h-4 accent-[#FD4A32]"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-[#2e3035] pt-3">
                      <div>
                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          Tab Switch Detection
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Detects when candidate moves focus to Google/ChatGPT in another tab.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={enableTabSwitchDetection}
                        onChange={e => setEnableTabSwitchDetection(e.target.checked)}
                        className="w-4 h-4 accent-[#FD4A32]"
                      />
                    </div>

                    {enableTabSwitchDetection && (
                      <div className="flex items-center justify-between pl-4 border-l-2 border-[#FD4A32]">
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Max Tab Switches Allowed Before Auto-Submission:
                        </div>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={maxTabSwitchesAllowed}
                          onChange={e => setMaxTabSwitchesAllowed(parseInt(e.target.value) || 3)}
                          className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-bold text-center"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-[#2e3035] pt-3">
                      <div>
                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          Shuffle Questions & Options
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Every candidate gets questions in randomized order to prevent lab copying.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={shuffleQuestions}
                        onChange={e => setShuffleQuestions(e.target.checked)}
                        className="w-4 h-4 accent-[#FD4A32]"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-[#2e3035] pt-3">
                      <div>
                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          Immediate Scorecard Post-Submit
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Allow student to view their score and solutions immediately upon submission.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={showResultsImmediately}
                        onChange={e => setShowResultsImmediately(e.target.checked)}
                        className="w-4 h-4 accent-[#FD4A32]"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-[#FD4A32]/10 border border-orange-200 dark:border-[#FD4A32]/30 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{title || 'Untitled Exam'}</div>
                      <div className="text-gray-600 dark:text-gray-400 mt-0.5">
                        {sections.length} Sections • {totalQuestions} Questions • {totalMarks} Total Marks • {durationMinutes} Mins
                      </div>
                    </div>
                    <div className="text-right font-bold text-[#FD4A32]">
                      Target: {targetDepartment === 'ALL' ? 'College-Wide' : targetDepartment} ({targetBatchYear})
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Footer Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#2e3035]">
                {step > 1 ? (
                  <button
                    onClick={() => setStep((step - 1) as any)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202225] transition-colors"
                  >
                    ← Previous
                  </button>
                ) : (
                  <button
                    onClick={() => setModalMode('TEMPLATES')}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202225] transition-colors"
                  >
                    ← Back to Templates
                  </button>
                )}

                {step < 3 ? (
                  <button
                    onClick={() => {
                      if (step === 1 && !title.trim()) {
                        alert('Please enter an exam title.');
                        return;
                      }
                      setStep((step + 1) as any);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#121417] dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FD4A32]/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Pooling Questions & Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Publish Assessment
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
