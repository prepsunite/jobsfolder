import React, { useState, useMemo } from 'react';
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
  Layers,
  Calendar,
  ArrowLeft,
  Check,
  Code2,
  Cpu,
  BookOpen,
  Terminal,
  ChevronUp,
  ChevronDown,
  Clock,
  Sliders,
  Filter,
} from 'lucide-react';
import { tpoService } from '@/services/tpo.service';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { MockExamTemplate, CollegeBatch } from '@/types/tpo';
import { useToast } from '@/contexts/ToastContext';
import {
  APTITUDE_CATEGORIES,
  TECHNICAL_MCQ_SUBJECTS,
  CODING_CATEGORIES,
  FALLBACK_APTITUDE_TOPICS,
} from '@/services/mockExamBlueprint.service';

interface CreateMockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeId: string;
  onSuccess: () => void;
}

interface SectionDraft {
  name: string;
  section_type?: 'MCQ' | 'CODING' | 'TECHNICAL_MCQ';
  topic_ids: string[];
  question_count: number;
  marks_per_correct: number;
  negative_marking: number;
  duration_minutes?: number;
  category?: string;
  coding_track?: 'PROGRAMMING_150' | 'CAMPUS_DSA';
  difficulty?: 'ALL' | 'EASY' | 'MEDIUM' | 'HARD';
  random_sampling?: boolean;
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

const ALL_DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI/ML', 'DATA SCIENCE'];

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

  // College Batches Query
  const { data: collegeBatches = [] } = useQuery<CollegeBatch[]>({
    queryKey: ['tpo-batches', collegeId],
    queryFn: () => tpoService.getCollegeBatches(collegeId),
    enabled: isOpen && !!collegeId,
  });

  // 1-Click Targeting & Audience Confirmation State
  const [targetingTemplate, setTargetingTemplate] = useState<MockExamTemplate | null>(null);
  const [targetDriveTitle, setTargetDriveTitle] = useState('');
  const [targetBatches, setTargetBatches] = useState<string[]>(['ALL']);
  const [targetDepartments, setTargetDepartments] = useState<string[]>(['ALL']);
  const [targetGradYear, setTargetGradYear] = useState<number>(new Date().getFullYear());
  const [targetStartTime, setTargetStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [targetEndTime, setTargetEndTime] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [inlineNewBatchName, setInlineNewBatchName] = useState('');
  const [isAddingInlineBatch, setIsAddingInlineBatch] = useState(false);

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

  // Merge DB topics with fallback aptitude topics
  const allAptitudeTopics = useMemo(() => {
    const map = new Map<string, { id: string; name: string; category_slug: string; cluster?: string }>();
    FALLBACK_APTITUDE_TOPICS.forEach(t => map.set(t.id, t));
    dbTopics.forEach(t => map.set(t.id, { id: t.id, name: t.name, category_slug: t.category_slug || 'arithmetic-aptitude', cluster: t.cluster }));
    return Array.from(map.values());
  }, [dbTopics]);

  // Per-section filter and search states
  const [sectionCategoryFilters, setSectionCategoryFilters] = useState<Record<number, string>>({});
  const [sectionSearchTerms, setSectionSearchTerms] = useState<Record<number, string>>({});

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, confirmModal } = useToast();

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
      section_type: 'MCQ',
      topic_ids: [],
      question_count: 20,
      marks_per_correct: 1,
      negative_marking: 0,
      difficulty: 'ALL',
      category: 'arithmetic-aptitude',
    },
    {
      name: 'Reasoning & Logical Deduction',
      section_type: 'MCQ',
      topic_ids: [],
      question_count: 20,
      marks_per_correct: 1,
      negative_marking: 0,
      difficulty: 'ALL',
      category: 'logical-reasoning',
    },
    {
      name: 'Verbal Ability & Reading Comprehension',
      section_type: 'MCQ',
      topic_ids: [],
      question_count: 15,
      marks_per_correct: 1,
      negative_marking: 0,
      difficulty: 'ALL',
      category: 'verbal-ability',
    },
  ]);

  // ⚡ 1-Click Launch: Opens Target Audience Selector Dialog
  const handleOpen1ClickTargeting = (tmpl: MockExamTemplate) => {
    const now = new Date();
    setTargetingTemplate(tmpl);
    setTargetDriveTitle(`${tmpl.name} - Drive ${now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`);
    setTargetBatches(['ALL']);
    setTargetDepartments(['ALL']);
    setTargetGradYear(now.getFullYear());
    setTargetStartTime(now.toISOString().slice(0, 16));
    setTargetEndTime(new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
    setIsAddingInlineBatch(false);
    setInlineNewBatchName('');
  };

  const handleToggleBatch = (batchName: string) => {
    if (batchName === 'ALL') {
      setTargetBatches(['ALL']);
      return;
    }
    setTargetBatches(prev => {
      const withoutAll = prev.filter(b => b !== 'ALL');
      if (withoutAll.includes(batchName)) {
        const next = withoutAll.filter(b => b !== batchName);
        return next.length === 0 ? ['ALL'] : next;
      } else {
        return [...withoutAll, batchName];
      }
    });
  };

  const handleToggleDept = (deptName: string) => {
    if (deptName === 'ALL') {
      setTargetDepartments(['ALL']);
      return;
    }
    setTargetDepartments(prev => {
      const withoutAll = prev.filter(d => d !== 'ALL');
      if (withoutAll.includes(deptName)) {
        const next = withoutAll.filter(d => d !== deptName);
        return next.length === 0 ? ['ALL'] : next;
      } else {
        return [...withoutAll, deptName];
      }
    });
  };

  const handleCreateInlineBatch = async () => {
    if (!inlineNewBatchName.trim() || !collegeId) return;
    try {
      const created = await tpoService.createCollegeBatch(collegeId, {
        name: inlineNewBatchName.trim(),
        passout_year: targetGradYear,
      });
      setTargetBatches(prev => {
        const withoutAll = prev.filter(b => b !== 'ALL');
        return withoutAll.includes(created.name) ? withoutAll : [...withoutAll, created.name];
      });
      setInlineNewBatchName('');
      setIsAddingInlineBatch(false);
      toast.success(`Created cohort "${created.name}".`);
    } catch (err: any) {
      toast.error(`Could not create batch: ${err.message}`);
    }
  };

  const handleDeployTargetedExam = async () => {
    if (!collegeId || !targetingTemplate) return;
    setIsSubmitting(true);
    try {
      await tpoService.createExamFromTemplate(collegeId, targetingTemplate, {
        title: targetDriveTitle.trim() || targetingTemplate.name,
        target_batches: targetBatches.includes('ALL') ? [] : targetBatches,
        target_departments: targetDepartments.includes('ALL') ? [] : targetDepartments,
        target_batch_year: targetGradYear,
        start_time: new Date(targetStartTime).toISOString(),
        end_time: new Date(targetEndTime).toISOString(),
      });
      setTargetingTemplate(null);
      toast.success('Assessment launched successfully.');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(`Failed to launch exam: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
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
      tmpl.sections.map(s => {
        const isCoding =
          s.section_type === 'CODING' ||
          s.category === 'coding' ||
          s.coding_track !== undefined;
        const isTech =
          s.section_type === 'TECHNICAL_MCQ' ||
          s.category === 'technical-mcqs' ||
          s.category?.startsWith('mcq-') ||
          (s.topic_ids && s.topic_ids.some(t => t.startsWith('mcq-')));
        const type: 'MCQ' | 'CODING' | 'TECHNICAL_MCQ' = isCoding
          ? 'CODING'
          : isTech
          ? 'TECHNICAL_MCQ'
          : 'MCQ';

        return {
          name: s.name,
          section_type: type,
          question_count: s.question_count,
          marks_per_correct: s.marks_per_correct,
          negative_marking: s.negative_marking,
          duration_minutes: s.duration_minutes,
          topic_ids: s.topic_ids || [],
          category: s.category,
          coding_track: s.coding_track,
          difficulty: s.difficulty || 'ALL',
          random_sampling: s.random_sampling ?? true,
        };
      })
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
      toast.error('Please enter a valid template name.');
      return;
    }
    if (editingTemplate.sections.length === 0) {
      toast.error('Template must contain at least one section.');
      return;
    }

    setIsAdminSavingTemplate(true);
    try {
      await tpoService.saveExamTemplate(editingTemplate);
      await refetchTemplates();
      setModalMode('TEMPLATES');
      setEditingTemplate(null);
      toast.success('Template saved successfully.');
    } catch (err: any) {
      toast.error(`Failed to save template: ${err.message}`);
    } finally {
      setIsAdminSavingTemplate(false);
    }
  };

  // Super Admin: Delete Pattern
  const handleDeletePattern = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await confirmModal({
      title: 'Delete Template',
      message: 'Are you sure you want to delete this custom template pattern?',
      confirmText: 'Delete Template',
      isDanger: true,
    });
    if (!confirmed) return;

    try {
      await tpoService.deleteExamTemplate(templateId);
      await refetchTemplates();
      toast.success('Template deleted successfully.');
    } catch (err: any) {
      toast.error(`Failed to delete template: ${err.message}`);
    }
  };

  const handleAddSection = (type: 'MCQ' | 'CODING' | 'TECHNICAL_MCQ' = 'MCQ') => {
    let defaultName = `Section ${sections.length + 1}: Aptitude & Reasoning`;
    let defaultCount = 20;
    let defaultMarks = 1;
    let defaultCategory: string | undefined = 'arithmetic-aptitude';
    let defaultTrack: 'PROGRAMMING_150' | 'CAMPUS_DSA' | undefined = undefined;

    if (type === 'CODING') {
      defaultName = `Section ${sections.length + 1}: Hands-on Coding Assessment`;
      defaultCount = 2;
      defaultMarks = 25;
      defaultCategory = 'coding';
      defaultTrack = 'CAMPUS_DSA';
    } else if (type === 'TECHNICAL_MCQ') {
      defaultName = `Section ${sections.length + 1}: Core CS Technical MCQs`;
      defaultCount = 20;
      defaultMarks = 1;
      defaultCategory = 'technical-mcqs';
    }

    setSections(prev => [
      ...prev,
      {
        name: defaultName,
        section_type: type,
        topic_ids: [],
        question_count: defaultCount,
        marks_per_correct: defaultMarks,
        negative_marking: 0,
        difficulty: 'ALL',
        category: defaultCategory,
        coding_track: defaultTrack,
        random_sampling: true,
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    setSections(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleSectionTypeChange = (index: number, newType: 'MCQ' | 'CODING' | 'TECHNICAL_MCQ') => {
    setSections(prev => {
      return prev.map((s, i) => {
        if (i !== index) return s;
        if (newType === 'CODING') {
          return {
            ...s,
            section_type: 'CODING',
            name: s.name.startsWith('Section') || s.name.includes('Aptitude') || s.name.includes('Technical')
              ? `Section ${i + 1}: Hands-on Coding Assessment`
              : s.name,
            question_count: s.question_count > 5 ? 2 : Math.max(1, s.question_count),
            marks_per_correct: s.marks_per_correct === 1 ? 25 : s.marks_per_correct,
            category: 'coding',
            coding_track: s.coding_track || 'CAMPUS_DSA',
            topic_ids: [],
          };
        } else if (newType === 'TECHNICAL_MCQ') {
          return {
            ...s,
            section_type: 'TECHNICAL_MCQ',
            name: s.name.startsWith('Section') || s.name.includes('Aptitude') || s.name.includes('Coding')
              ? `Section ${i + 1}: Core CS Technical MCQs`
              : s.name,
            question_count: s.question_count <= 5 ? 20 : s.question_count,
            marks_per_correct: s.marks_per_correct > 5 ? 1 : s.marks_per_correct,
            category: 'technical-mcqs',
            coding_track: undefined,
            topic_ids: [],
          };
        } else {
          return {
            ...s,
            section_type: 'MCQ',
            name: s.name.startsWith('Section') || s.name.includes('Technical') || s.name.includes('Coding')
              ? `Section ${i + 1}: Aptitude & Reasoning`
              : s.name,
            question_count: s.question_count <= 5 ? 20 : s.question_count,
            marks_per_correct: s.marks_per_correct > 5 ? 1 : s.marks_per_correct,
            category: 'arithmetic-aptitude',
            coding_track: undefined,
            topic_ids: [],
          };
        }
      });
    });
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
      toast.error('Please enter an exam title.');
      return;
    }
    if (sections.length === 0 || totalQuestions === 0) {
      toast.error('Please configure at least one section with questions.');
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
          target_batches: targetBatches.includes('ALL') ? [] : targetBatches,
          target_departments: targetDepartments.includes('ALL') ? [] : targetDepartments,
          target_batch_year: targetBatchYear,
        },
        sections.map(s => ({
          name: s.name,
          section_type: s.section_type || (s.category === 'coding' ? 'CODING' : s.category === 'technical-mcqs' || s.topic_ids?.some(t => t.startsWith('mcq-')) ? 'TECHNICAL_MCQ' : 'MCQ'),
          topic_ids: s.topic_ids || [],
          question_count: Number(s.question_count) || 1,
          marks_per_correct: Number(s.marks_per_correct) || 1,
          negative_marking: Number(s.negative_marking) || 0,
          duration_minutes: s.duration_minutes ? Number(s.duration_minutes) : undefined,
          category: s.category,
          coding_track: s.coding_track,
          difficulty: s.difficulty || 'ALL',
          random_sampling: s.random_sampling ?? true,
        }))
      );

      toast.success('Mock exam published successfully.');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(`Failed to create exam: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTemplates = useMemo(() => {
    const q = templateSearch.toLowerCase();
    return templates.filter(t => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.target_company.toLowerCase().includes(q) ||
        (t.badge && t.badge.toLowerCase().includes(q))
      );
    });
  }, [templates, templateSearch]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create Mock Exam"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
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
              {targetingTemplate ? (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Top Bar with Back Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2e3035]">
                    <button
                      type="button"
                      onClick={() => setTargetingTemplate(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Blueprints
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950/50 text-[#FD4A32] dark:text-orange-400">
                        {targetingTemplate.target_company}
                      </span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {targetingTemplate.duration_minutes}m • {targetingTemplate.sections.reduce((a, s) => a + (Number(s.question_count) || 0), 0)} Questions
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/30 flex items-start gap-3">
                    <Zap className="w-5 h-5 text-[#FD4A32] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <h4 className="font-bold text-gray-900 dark:text-white">Target Audience & Schedule Configuration</h4>
                      <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                        Choose which student cohorts (e.g. Top Batch, Normal Batch) and academic streams are eligible to take this <strong>{targetingTemplate.name}</strong> assessment.
                      </p>
                    </div>
                  </div>

                  {/* Drive Title */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Placement Drive Title *
                    </label>
                    <input
                      type="text"
                      value={targetDriveTitle}
                      onChange={e => setTargetDriveTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
                    />
                  </div>

                  {/* Target Batches / Cohorts */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                        Target Batches / Cohorts
                      </label>
                      <span className="text-[11px] text-gray-500">
                        {targetBatches.includes('ALL') ? 'Open to All Batches' : `${targetBatches.length} batch(es) selected`}
                      </span>
                    </div>
                    
                    {/* Pills */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        type="button"
                        onClick={() => handleToggleBatch('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          targetBatches.includes('ALL')
                            ? 'bg-[#FD4A32] text-white shadow-sm shadow-[#FD4A32]/25'
                            : 'bg-gray-100 dark:bg-[#202225] text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        All Batches (Campus-Wide)
                      </button>

                      {/* Existing College Batches */}
                      {collegeBatches.map(b => {
                        const isSelected = targetBatches.includes(b.name);
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => handleToggleBatch(b.name)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/25'
                                : 'bg-gray-100 dark:bg-[#202225] text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/30'
                            }`}
                          >
                            <Layers className="w-3 h-3" />
                            {b.name}
                          </button>
                        );
                      })}

                      {/* Inline Create Batch */}
                      {isAddingInlineBatch ? (
                        <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-[#1a1b1e]">
                          <input
                            type="text"
                            placeholder="e.g. Top Batch"
                            value={inlineNewBatchName}
                            onChange={e => setInlineNewBatchName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateInlineBatch();
                              }
                            }}
                            className="px-2 py-0.5 text-xs bg-transparent text-gray-900 dark:text-white focus:outline-none w-28 font-medium"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleCreateInlineBatch}
                            className="p-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-xs"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingInlineBatch(false);
                              setInlineNewBatchName('');
                            }}
                            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsAddingInlineBatch(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 border border-dashed border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                        >
                          <Plus className="w-3 h-3" /> New Batch
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Target Streams / Departments */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                        Target Streams / Departments
                      </label>
                      <span className="text-[11px] text-gray-500">
                        {targetDepartments.includes('ALL') ? 'Open to All Streams' : `${targetDepartments.length} stream(s) selected`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleDept('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          targetDepartments.includes('ALL')
                            ? 'bg-[#FD4A32] text-white shadow-sm shadow-[#FD4A32]/25'
                            : 'bg-gray-100 dark:bg-[#202225] text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        All Streams
                      </button>
                      {ALL_DEPARTMENTS.map(d => {
                        const isSelected = targetDepartments.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleToggleDept(d)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[#FD4A32] text-white shadow-sm shadow-[#FD4A32]/25'
                                : 'bg-gray-100 dark:bg-[#202225] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Passout Year & Schedule Window */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Passout Year
                      </label>
                      <select
                        value={targetGradYear}
                        onChange={e => setTargetGradYear(parseInt(e.target.value) || 2026)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                      >
                        {[2024, 2025, 2026, 2027, 2028, 2029].map(y => (
                          <option key={y} value={y}>{y} Batch</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        value={targetStartTime}
                        onChange={e => setTargetStartTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        End Time
                      </label>
                      <input
                        type="datetime-local"
                        value={targetEndTime}
                        onChange={e => setTargetEndTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#2e3035]">
                    <button
                      type="button"
                      onClick={() => setTargetingTemplate(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleDeployTargetedExam}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#FD4A32]/25"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Deploying Exam...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" /> Deploy Assessment to Selected Audience
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                      {filteredTemplates.map((tmpl: MockExamTemplate) => {
                        const totalQs = tmpl.sections.reduce(
                          (a: number, s: any) => a + (Number(s.question_count) || 0),
                          0
                        );

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
                                  {tmpl.sections.map((s: any, idx: number) => (
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
                                onClick={() => handleOpen1ClickTargeting(tmpl)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold transition-all shadow-sm shadow-[#FD4A32]/25"
                              >
                                <Zap className="w-3.5 h-3.5" /> 🚀 1-Click Add Exam
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
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

                      {/* Discipline Format Selector */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...editingTemplate.sections];
                            updated[idx] = { ...updated[idx], section_type: 'MCQ', category: 'arithmetic-aptitude' };
                            setEditingTemplate({ ...editingTemplate, sections: updated });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            (sec.section_type || 'MCQ') === 'MCQ'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white dark:bg-[#151618] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#383a40]'
                          }`}
                        >
                          📝 Aptitude
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...editingTemplate.sections];
                            updated[idx] = { ...updated[idx], section_type: 'TECHNICAL_MCQ', category: 'technical-mcqs' };
                            setEditingTemplate({ ...editingTemplate, sections: updated });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            sec.section_type === 'TECHNICAL_MCQ'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white dark:bg-[#151618] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#383a40]'
                          }`}
                        >
                          💻 Technical MCQs
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...editingTemplate.sections];
                            updated[idx] = {
                              ...updated[idx],
                              section_type: 'CODING',
                              category: 'coding',
                              coding_track: 'CAMPUS_DSA',
                              question_count: updated[idx].question_count > 5 ? 2 : updated[idx].question_count,
                              marks_per_correct: updated[idx].marks_per_correct === 1 ? 25 : updated[idx].marks_per_correct,
                            };
                            setEditingTemplate({ ...editingTemplate, sections: updated });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            sec.section_type === 'CODING'
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-white dark:bg-[#151618] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#383a40]'
                          }`}
                        >
                          ⚡ Hands-on Coding
                        </button>
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
                        Passout Year
                      </label>
                      <select
                        value={targetBatchYear}
                        onChange={e => setTargetBatchYear(parseInt(e.target.value) || 2026)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                      >
                        {[2024, 2025, 2026, 2027, 2028, 2029].map(y => (
                          <option key={y} value={y}>{y} Batch</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Custom Wizard Target Batches */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-[#2e3035]">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                        Target Batches / Cohorts
                      </label>
                      <span className="text-[11px] text-gray-500">
                        {targetBatches.includes('ALL') ? 'Open to All Batches' : `${targetBatches.length} batch(es) selected`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        type="button"
                        onClick={() => handleToggleBatch('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          targetBatches.includes('ALL')
                            ? 'bg-[#FD4A32] text-white shadow-sm shadow-[#FD4A32]/25'
                            : 'bg-gray-100 dark:bg-[#202225] text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        All Batches (Campus-Wide)
                      </button>

                      {collegeBatches.map(b => {
                        const isSelected = targetBatches.includes(b.name);
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => handleToggleBatch(b.name)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/25'
                                : 'bg-gray-100 dark:bg-[#202225] text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/30'
                            }`}
                          >
                            <Layers className="w-3 h-3" />
                            {b.name}
                          </button>
                        );
                      })}

                      {isAddingInlineBatch ? (
                        <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-[#1a1b1e]">
                          <input
                            type="text"
                            placeholder="e.g. Top Batch"
                            value={inlineNewBatchName}
                            onChange={e => setInlineNewBatchName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateInlineBatch();
                              }
                            }}
                            className="px-2 py-0.5 text-xs bg-transparent text-gray-900 dark:text-white focus:outline-none w-28 font-medium"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleCreateInlineBatch}
                            className="p-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-xs"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingInlineBatch(false);
                              setInlineNewBatchName('');
                            }}
                            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsAddingInlineBatch(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 border border-dashed border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                        >
                          <Plus className="w-3 h-3" /> New Batch
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Custom Wizard Target Streams */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-[#2e3035]">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                        Target Streams / Departments
                      </label>
                      <span className="text-[11px] text-gray-500">
                        {targetDepartments.includes('ALL') ? 'Open to All Streams' : `${targetDepartments.length} stream(s) selected`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleDept('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          targetDepartments.includes('ALL')
                            ? 'bg-[#FD4A32] text-white shadow-sm shadow-[#FD4A32]/25'
                            : 'bg-gray-100 dark:bg-[#202225] text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        All Streams
                      </button>
                      {ALL_DEPARTMENTS.map(d => {
                        const isSelected = targetDepartments.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleToggleDept(d)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[#FD4A32] text-white shadow-sm shadow-[#FD4A32]/25'
                                : 'bg-gray-100 dark:bg-[#202225] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Sections */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* Top Bar with Metrics & Quick Add */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-blue-500/10 border border-gray-200 dark:border-[#2e3035]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                            Section Architecture ({sections.length} Sections)
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#383a40] text-[#FD4A32]">
                            {totalQuestions} Qs • {totalMarks} Marks
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Configure Aptitude, Core CS Technical MCQs, or Hands-on Coding rounds with customizable syllabus and difficulty.
                        </p>
                      </div>

                      {/* Quick Add Buttons */}
                      <div className="flex items-center flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddSection('MCQ')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" /> + Aptitude
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddSection('TECHNICAL_MCQ')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          <Cpu className="w-3.5 h-3.5 text-emerald-600" /> + Technical MCQs
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddSection('CODING')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
                        >
                          <Code2 className="w-3.5 h-3.5 text-purple-600" /> + Coding Problem
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Cards */}
                  <div className="space-y-4">
                    {sections.map((sec, idx) => {
                      const isCoding = sec.section_type === 'CODING';
                      const isTech = sec.section_type === 'TECHNICAL_MCQ';
                      const isAptitude = !isCoding && !isTech;

                      const currentCategoryFilter = sectionCategoryFilters[idx] || 'all';
                      const currentSearch = (sectionSearchTerms[idx] || '').toLowerCase();

                      const filteredAptitudeTopics = allAptitudeTopics.filter(t => {
                        const matchesCat = currentCategoryFilter === 'all' || t.category_slug === currentCategoryFilter;
                        const matchesSearch = !currentSearch || t.name.toLowerCase().includes(currentSearch);
                        return matchesCat && matchesSearch;
                      });

                      return (
                        <div
                          key={idx}
                          className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#2e3035] bg-white dark:bg-[#1a1b1e] shadow-sm space-y-4 transition-all hover:border-gray-300 dark:hover:border-[#3e4046]"
                        >
                          {/* Card Top: Number, Badges, Reorder & Delete */}
                          <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-[#26282c]">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-6 h-6 rounded-full bg-[#FD4A32]/15 text-[#FD4A32] text-xs font-black flex items-center justify-center">
                                {idx + 1}
                              </span>
                              {isCoding && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                  <Code2 className="w-3 h-3 text-purple-500" /> Hands-on Coding
                                </span>
                              )}
                              {isTech && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  <Cpu className="w-3 h-3 text-emerald-500" /> Core CS Technical MCQs
                                </span>
                              )}
                              {isAptitude && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                  <BookOpen className="w-3 h-3 text-blue-500" /> Aptitude & Reasoning
                                </span>
                              )}
                              <span className="text-[11px] font-bold text-gray-500">
                                {sec.question_count} Qs • {(Number(sec.question_count) || 0) * (Number(sec.marks_per_correct) || 1)} Marks
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveSection(idx, 'up')}
                                title="Move Earlier"
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 transition-colors"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === sections.length - 1}
                                onClick={() => handleMoveSection(idx, 'down')}
                                title="Move Later"
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 transition-colors"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              {sections.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSection(idx)}
                                  title="Delete Section"
                                  className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* 1. Discipline Switcher (3-Way Toggle) */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                              Section Discipline Format *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => handleSectionTypeChange(idx, 'MCQ')}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                  isAptitude
                                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20 shadow-sm'
                                    : 'border-gray-200 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#202225] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#26282c]'
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isAptitude ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                  <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold leading-tight">Aptitude & Reasoning</div>
                                  <div className="text-[10px] opacity-70 truncate">Quant, Logical, Verbal, DI</div>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSectionTypeChange(idx, 'TECHNICAL_MCQ')}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                  isTech
                                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-sm'
                                    : 'border-gray-200 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#202225] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#26282c]'
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isTech ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                  <Cpu className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold leading-tight">Core CS Technical</div>
                                  <div className="text-[10px] opacity-70 truncate">DSA, DBMS, OS, Java, C++</div>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSectionTypeChange(idx, 'CODING')}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                  isCoding
                                    ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20 shadow-sm'
                                    : 'border-gray-200 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#202225] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#26282c]'
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isCoding ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                  <Code2 className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold leading-tight">Hands-on Coding</div>
                                  <div className="text-[10px] opacity-70 truncate">Monaco IDE & Test Cases</div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* 2. Section Title & Quick Suggestions */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                              Section Title *
                            </label>
                            <input
                              type="text"
                              value={sec.name}
                              onChange={e => handleUpdateSection(idx, { name: e.target.value })}
                              placeholder={isCoding ? 'e.g. Part B: Advanced Hands-on Coding' : isTech ? 'e.g. Core CS Technical Assessment' : 'e.g. Numerical Ability & Quantitative Aptitude'}
                              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
                            />
                            {/* Quick Title Suggestion Pills */}
                            <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                              <span className="text-[10px] text-gray-400 font-semibold">Quick Ideas:</span>
                              {(isCoding
                                ? [
                                    'Hands-on Coding Assessment',
                                    'Part B: Advanced Coding Round',
                                    'Pure Coding OA Round',
                                    'Campus DSA Coding Challenge',
                                    'Core Programming Logic',
                                  ]
                                : isTech
                                ? [
                                    'Core CS Technical Assessment',
                                    'Programming Logic & CS Fundamentals',
                                    'DBMS, SQL & Operating Systems',
                                    'Campus OA Pseudo-Code & DSA',
                                    'Full-Stack Technical Knowledge',
                                  ]
                                : [
                                    'Numerical Ability & Quant',
                                    'Reasoning & Logical Deduction',
                                    'Verbal Ability & Reading',
                                    'Data Interpretation & Caselets',
                                    'Part A: Foundation Section',
                                  ]
                              ).map(idea => (
                                <button
                                  key={idea}
                                  type="button"
                                  onClick={() => handleUpdateSection(idx, { name: idea })}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-[#202225] hover:bg-gray-200 dark:hover:bg-[#2a2c30] text-gray-600 dark:text-gray-400 transition-colors"
                                >
                                  {idea}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 3. Discipline-Specific Curriculum Configuration */}
                          {/* Case A: Aptitude */}
                          {isAptitude && (
                            <div className="p-3.5 rounded-xl border border-blue-200/70 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                                  Aptitude Curriculum & Specific Topics
                                </div>
                                <div className="flex items-center gap-2 text-[10px]">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSection(idx, { topic_ids: [] })}
                                    className="font-bold text-blue-600 hover:underline"
                                  >
                                    Auto-Pool All (Clear Selection)
                                  </button>
                                  <span className="text-gray-300 dark:text-gray-600">•</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateSection(idx, {
                                        topic_ids: Array.from(
                                          new Set([...sec.topic_ids, ...filteredAptitudeTopics.map(t => t.id)])
                                        ),
                                      })
                                    }
                                    className="font-bold text-blue-600 hover:underline"
                                  >
                                    Select All Filtered ({filteredAptitudeTopics.length})
                                  </button>
                                </div>
                              </div>

                              {/* Domain Category Filter Tabs */}
                              <div className="flex flex-wrap gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSectionCategoryFilters(prev => ({ ...prev, [idx]: 'all' }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                    currentCategoryFilter === 'all'
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-[#1f2124] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#383a40] hover:bg-gray-100'
                                  }`}
                                >
                                  All Domains ({allAptitudeTopics.length})
                                </button>
                                {APTITUDE_CATEGORIES.map(cat => {
                                  const isSelected = currentCategoryFilter === cat.id;
                                  return (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      onClick={() =>
                                        setSectionCategoryFilters(prev => ({ ...prev, [idx]: cat.id }))
                                      }
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                        isSelected
                                          ? 'bg-blue-600 text-white shadow-sm'
                                          : 'bg-white dark:bg-[#1f2124] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#383a40] hover:bg-gray-100'
                                      }`}
                                    >
                                      {cat.name}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Search & Topic Chips */}
                              <div className="space-y-2">
                                <div className="relative">
                                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                                  <input
                                    type="text"
                                    placeholder="Search topics (e.g. Numbers, Profit and Loss, Seating Arrangement)..."
                                    value={sectionSearchTerms[idx] || ''}
                                    onChange={e =>
                                      setSectionSearchTerms(prev => ({ ...prev, [idx]: e.target.value }))
                                    }
                                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#383a40] bg-white dark:bg-[#151618] text-xs"
                                  />
                                </div>

                                <div className="max-h-36 overflow-y-auto p-2 rounded-lg bg-white/70 dark:bg-[#151618] border border-gray-200 dark:border-[#2e3035] flex flex-wrap gap-1.5">
                                  {filteredAptitudeTopics.map(t => {
                                    const isChosen = sec.topic_ids.includes(t.id);
                                    return (
                                      <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => {
                                          const next = isChosen
                                            ? sec.topic_ids.filter(id => id !== t.id)
                                            : [...sec.topic_ids, t.id];
                                          handleUpdateSection(idx, { topic_ids: next });
                                        }}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                                          isChosen
                                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                                            : 'bg-gray-100 dark:bg-[#202225] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#282a2e]'
                                        }`}
                                      >
                                        {isChosen ? <Check className="w-3 h-3" /> : null}
                                        {t.name}
                                      </button>
                                    );
                                  })}
                                </div>

                                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                  {sec.topic_ids.length === 0 ? (
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                      🌐 Auto-Pooling All Topics: Questions will be randomly sampled across all verified aptitude questions in this category.
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                      ✓ Filtered Focus: Sampling exclusively from {sec.topic_ids.length} selected topic(s).
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Case B: Technical MCQs */}
                          {isTech && (
                            <div className="p-3.5 rounded-xl border border-emerald-200/70 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                                  Core CS Subject Selection
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSection(idx, { topic_ids: [] })}
                                  className="text-[10px] font-bold text-emerald-600 hover:underline"
                                >
                                  {sec.topic_ids.length === 0 ? '✓ Mixed Comprehensive Pool' : 'Reset to All Core CS'}
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSection(idx, { topic_ids: [] })}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    sec.topic_ids.length === 0
                                      ? 'bg-emerald-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-[#151618] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#383a40] hover:bg-gray-100'
                                  }`}
                                >
                                  🌐 All Core CS (Mixed Pool)
                                </button>
                                {TECHNICAL_MCQ_SUBJECTS.map(sub => {
                                  const isSelected = sec.topic_ids.includes(sub.id);
                                  return (
                                    <button
                                      key={sub.id}
                                      type="button"
                                      onClick={() => {
                                        const next = isSelected
                                          ? sec.topic_ids.filter(id => id !== sub.id)
                                          : [...sec.topic_ids, sub.id];
                                        handleUpdateSection(idx, { topic_ids: next });
                                      }}
                                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                        isSelected
                                          ? 'bg-emerald-600 text-white font-bold shadow-sm'
                                          : 'bg-white dark:bg-[#151618] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#383a40] hover:bg-gray-100'
                                      }`}
                                    >
                                      {isSelected && <Check className="w-3 h-3" />}
                                      {sub.name}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                {sec.topic_ids.length === 0 ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                    🌐 Auto-pooling across C, C++, Java, Python, OOPs, DBMS, OS, Networks & DSA logic.
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                    ✓ Sampling exclusively from {sec.topic_ids.length} selected CS subject(s).
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Case C: Hands-on Coding */}
                          {isCoding && (
                            <div className="p-3.5 rounded-xl border border-purple-200/70 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                  <Code2 className="w-3.5 h-3.5 text-purple-600" />
                                  Hands-on Programming Track & Problem Domains
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSection(idx, { topic_ids: [] })}
                                  className="text-[10px] font-bold text-purple-600 hover:underline"
                                >
                                  {sec.topic_ids.length === 0 ? '✓ Auto-Sampling All Problem Types' : 'Clear Domain Filter'}
                                </button>
                              </div>

                              {/* Track Selection */}
                              <div className="flex flex-wrap gap-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider self-center mr-1">
                                  Track:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSection(idx, { coding_track: 'CAMPUS_DSA' })}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    sec.coding_track === 'CAMPUS_DSA'
                                      ? 'bg-purple-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-[#151618] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#383a40]'
                                  }`}
                                >
                                  🗺️ Campus DSA Roadmap
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSection(idx, { coding_track: 'PROGRAMMING_150' })}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    sec.coding_track === 'PROGRAMMING_150'
                                      ? 'bg-purple-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-[#151618] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#383a40]'
                                  }`}
                                >
                                  🧱 Programming 150 Foundation
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSection(idx, { coding_track: undefined })}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    !sec.coding_track
                                      ? 'bg-purple-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-[#151618] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#383a40]'
                                  }`}
                                >
                                  🌐 All Tracks (Mixed)
                                </button>
                              </div>

                              {/* Problem Categories Chips */}
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                  Select Target Problem Domains (Optional)
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                  {CODING_CATEGORIES.map(cat => {
                                    const isChosen = sec.topic_ids.includes(cat.id);
                                    return (
                                      <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                          const next = isChosen
                                            ? sec.topic_ids.filter(id => id !== cat.id)
                                            : [...sec.topic_ids, cat.id];
                                          handleUpdateSection(idx, { topic_ids: next });
                                        }}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                                          isChosen
                                            ? 'bg-purple-600 text-white font-bold shadow-sm'
                                            : 'bg-white dark:bg-[#151618] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#383a40] hover:bg-gray-100'
                                        }`}
                                      >
                                        {isChosen && <Check className="w-3 h-3" />}
                                        {cat.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="p-2 rounded-lg bg-purple-100/50 dark:bg-purple-950/40 text-[11px] text-purple-800 dark:text-purple-300 flex items-start gap-1.5">
                                <Terminal className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                                <span>
                                  Students will solve coding problems in the integrated Monaco IDE (supporting C, C++, Java, Python, and JavaScript) with live test-case validation.
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 4. Difficulty, Question Count, Marks & Scoring Rules */}
                          <div className="space-y-3 pt-1 border-t border-gray-100 dark:border-[#26282c]">
                            {/* Difficulty Selector */}
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Difficulty Rigor
                              </label>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  { id: 'ALL', label: 'Mixed (Auto-Distributed)' },
                                  { id: 'EASY', label: '● Easy (L1 Foundation)' },
                                  { id: 'MEDIUM', label: '● Medium (L2 Standard)' },
                                  { id: 'HARD', label: '● Hard (L3 Advanced)' },
                                ].map(diff => (
                                  <button
                                    key={diff.id}
                                    type="button"
                                    onClick={() => handleUpdateSection(idx, { difficulty: diff.id as any })}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                      (sec.difficulty || 'ALL') === diff.id
                                        ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-sm'
                                        : 'bg-gray-100 dark:bg-[#202225] text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                    }`}
                                  >
                                    {diff.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Numbers Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {/* Question Count */}
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                  {isCoding ? 'Problem Count *' : 'Question Count *'}
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max={isCoding ? 10 : 100}
                                  value={sec.question_count}
                                  onChange={e =>
                                    handleUpdateSection(idx, {
                                      question_count: parseInt(e.target.value) || 1,
                                    })
                                  }
                                  className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-bold text-center"
                                />
                                <div className="flex items-center gap-1 mt-1">
                                  {(isCoding ? [1, 2, 3, 5] : [5, 10, 15, 20, 25, 30]).map(cnt => (
                                    <button
                                      key={cnt}
                                      type="button"
                                      onClick={() => handleUpdateSection(idx, { question_count: cnt })}
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        sec.question_count === cnt
                                          ? 'bg-[#FD4A32] text-white'
                                          : 'bg-gray-100 dark:bg-[#202225] text-gray-500 hover:bg-gray-200'
                                      }`}
                                    >
                                      {cnt}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Marks Per Correct */}
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                  Marks / Correct
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max={isCoding ? 100 : 20}
                                  value={sec.marks_per_correct}
                                  onChange={e =>
                                    handleUpdateSection(idx, {
                                      marks_per_correct: parseInt(e.target.value) || 1,
                                    })
                                  }
                                  className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-bold text-center"
                                />
                                <div className="flex items-center gap-1 mt-1">
                                  {(isCoding ? [10, 25, 50] : [1, 2, 3, 5]).map(m => (
                                    <button
                                      key={m}
                                      type="button"
                                      onClick={() => handleUpdateSection(idx, { marks_per_correct: m })}
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        sec.marks_per_correct === m
                                          ? 'bg-[#FD4A32] text-white'
                                          : 'bg-gray-100 dark:bg-[#202225] text-gray-500 hover:bg-gray-200'
                                      }`}
                                    >
                                      +{m}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Negative Marking */}
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                  Negative Penalty
                                </label>
                                <input
                                  type="number"
                                  step="0.25"
                                  min="0"
                                  max="5"
                                  value={sec.negative_marking}
                                  onChange={e =>
                                    handleUpdateSection(idx, {
                                      negative_marking: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-bold text-center"
                                />
                                <div className="flex items-center gap-1 mt-1">
                                  {[0, 0.25, 0.33, 0.5].map(neg => (
                                    <button
                                      key={neg}
                                      type="button"
                                      onClick={() => handleUpdateSection(idx, { negative_marking: neg })}
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        sec.negative_marking === neg
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-gray-100 dark:bg-[#202225] text-gray-500 hover:bg-gray-200'
                                      }`}
                                    >
                                      {neg === 0 ? '0' : `-${neg}`}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Optional Section Timer */}
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                  Section Timer (Mins)
                                </label>
                                <input
                                  type="number"
                                  min="5"
                                  max="180"
                                  placeholder="Auto (Flexible)"
                                  value={sec.duration_minutes || ''}
                                  onChange={e =>
                                    handleUpdateSection(idx, {
                                      duration_minutes: e.target.value ? parseInt(e.target.value) : undefined,
                                    })
                                  }
                                  className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151618] text-xs font-bold text-center"
                                />
                                <div className="text-[9px] text-gray-400 mt-1 text-center truncate">
                                  {sec.duration_minutes ? `${sec.duration_minutes}m limit` : 'Shared test timer'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Add Section Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-dashed border-gray-300 dark:border-[#383a40] bg-gray-50/50 dark:bg-[#1a1b1e] gap-3">
                    <div className="text-xs font-bold text-gray-600 dark:text-gray-400">
                      Add another assessment section:
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddSection('MCQ')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Aptitude Section
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddSection('TECHNICAL_MCQ')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Technical MCQ Section
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddSection('CODING')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Coding Round
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Anti-Cheat & Review */}
              {step === 3 && (
                <div className="space-y-5">
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

                  {/* Detailed Exam Blueprint Summary */}
                  <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-[#FD4A32]/10 border border-orange-200 dark:border-[#FD4A32]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">
                          {title || 'Untitled Exam'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Target: {targetCompany} • {durationMinutes} Mins Duration • Pass Cutoff: {passingPercentage}%
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-[#FD4A32]">
                          {totalQuestions} Qs • {totalMarks} Marks
                        </span>
                      </div>
                    </div>

                    {/* Section Breakdown List */}
                    <div className="space-y-1.5 pt-2 border-t border-orange-200/60 dark:border-[#FD4A32]/20">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Configured Section Blueprint ({sections.length} Sections):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sections.map((s, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-white/80 dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#2e3035] flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32] text-[10px] font-bold flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="font-bold text-gray-800 dark:text-gray-200 truncate">
                                  {s.name}
                                </div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                  <span>
                                    {s.section_type === 'CODING'
                                      ? '⚡ Coding'
                                      : s.section_type === 'TECHNICAL_MCQ'
                                      ? '💻 Tech MCQs'
                                      : '📝 Aptitude'}
                                  </span>
                                  <span>•</span>
                                  <span>{s.difficulty || 'Mixed'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-bold text-gray-700 dark:text-gray-300">
                                {s.question_count} Qs
                              </span>
                              <span className="text-[10px] text-gray-400 block">
                                ({(Number(s.question_count) || 0) * (Number(s.marks_per_correct) || 1)} pts)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
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
                        toast.error('Please enter an exam title.');
                        return;
                      }
                      if (step === 2) {
                        for (let i = 0; i < sections.length; i++) {
                          if (!sections[i].name.trim()) {
                            toast.error(`Please enter a title for Section ${i + 1}.`);
                            return;
                          }
                          if (!sections[i].question_count || sections[i].question_count <= 0) {
                            toast.error(`Section ${i + 1} must have at least 1 question.`);
                            return;
                          }
                        }
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
