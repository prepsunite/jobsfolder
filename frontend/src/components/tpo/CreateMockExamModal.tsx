import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import { tpoService } from '@/services/tpo.service';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
  const [description] = useState('');
  const [instructions] = useState(
    '1. Test must be taken in Fullscreen Mode.\n2. Switching tabs or minimizing browser will be flagged by proctor.\n3. Test will auto-submit when the countdown expires.'
  );
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [passingPercentage] = useState(40);
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [endTime, setEndTime] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  // Anti-Cheat Settings
  const [enableTabSwitchDetection, setEnableTabSwitchDetection] = useState(true);
  const [maxTabSwitchesAllowed, setMaxTabSwitchesAllowed] = useState(3);
  const [enableFullscreenLock, setEnableFullscreenLock] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions] = useState(true);
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
    } catch (err: any) {
      alert(`Failed to create exam: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#2e3035] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#151618]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Create Institutional Mock Exam
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pooled automatically from PrepUnite's verified question repository
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

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-gray-100/60 dark:bg-[#202225] border-b border-gray-200 dark:border-[#2b2d31] flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 transition-colors ${
              step === 1 ? 'text-[#FD4A32] font-bold' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center text-[10px]">1</span>
            Exam Details & Schedule
          </button>
          <span className="text-gray-300 dark:text-gray-600">→</span>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 transition-colors ${
              step === 2 ? 'text-[#FD4A32] font-bold' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center text-[10px]">2</span>
            Sections & Topic Pools ({totalQuestions} Qs)
          </button>
          <span className="text-gray-300 dark:text-gray-600">→</span>
          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-1.5 transition-colors ${
              step === 3 ? 'text-[#FD4A32] font-bold' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center text-[10px]">3</span>
            Anti-Cheat & Publish
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* STEP 1: Details & Timing */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. TCS NQT 2026 Campus Drive - Diagnostic Mock 1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#151618] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Target Company / Pattern
                  </label>
                  <select
                    value={targetCompany}
                    onChange={e => setTargetCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#151618] text-sm text-gray-900 dark:text-white"
                  >
                    {PRESET_COMPANIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(parseInt(e.target.value) || 60)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#151618] text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Exam Start Window
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#151618] text-xs text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Exam Expiry Window
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#151618] text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Target Department
                  </label>
                  <select
                    value={targetDepartment}
                    onChange={e => setTargetDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#151618] text-sm text-gray-900 dark:text-white"
                  >
                    <option value="ALL">All Departments (Open College Drive)</option>
                    <option value="CSE">CSE Only</option>
                    <option value="IT">IT Only</option>
                    <option value="ECE">ECE Only</option>
                    <option value="EEE">EEE Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Passout Batch Year
                  </label>
                  <input
                    type="number"
                    value={targetBatchYear}
                    onChange={e => setTargetBatchYear(parseInt(e.target.value) || 2026)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#151618] text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Section Configurator & Topic Pools */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Quality Guarantee:</strong> Questions are sampled from PrepUnite's vetted, company-tagged repository. TPO admins do not write custom questions, guaranteeing error-free questions with verified solutions.
                </div>
              </div>

              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-200 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#151618] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={sec.name}
                      onChange={e => handleUpdateSection(idx, { name: e.target.value })}
                      placeholder="Section Title"
                      className="font-bold text-sm bg-transparent border-b border-dashed border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-[#FD4A32] pb-1 w-2/3"
                    />
                    {sections.length > 1 && (
                      <button
                        onClick={() => handleRemoveSection(idx)}
                        className="text-gray-400 hover:text-rose-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Question Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={sec.question_count}
                        onChange={e => handleUpdateSection(idx, { question_count: parseInt(e.target.value) || 10 })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Marks / Correct
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={sec.marks_per_correct}
                        onChange={e => handleUpdateSection(idx, { marks_per_correct: parseFloat(e.target.value) || 1 })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Negative Marking
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={sec.negative_marking}
                        onChange={e => handleUpdateSection(idx, { negative_marking: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Topic Pool Multiselect */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Target Topic Pool ({sec.topic_ids.length === 0 ? 'All Aptitude Topics' : `${sec.topic_ids.length} selected`})
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-white dark:bg-[#1a1b1e] rounded-lg border border-gray-200 dark:border-[#383a40]">
                      {dbTopics.map(t => {
                        const isSelected = sec.topic_ids.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              const newTopics = isSelected
                                ? sec.topic_ids.filter(id => id !== t.id)
                                : [...sec.topic_ids, t.id];
                              handleUpdateSection(idx, { topic_ids: newTopics });
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                              isSelected
                                ? 'bg-[#FD4A32] text-white'
                                : 'bg-gray-100 dark:bg-[#2b2d31] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {t.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddSection}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-[#383a40] hover:border-[#FD4A32] rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-[#FD4A32]" />
                Add Another Section
              </button>
            </div>
          )}

          {/* STEP 3: Anti-Cheat Controls */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#151618] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  Automated Anti-Cheat & Proctoring Engine
                </h4>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Enforce Fullscreen Lockdown Mode
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Forces the candidate into fullscreen. Exiting triggers an alert.
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
                      Tab Switch & Window Blur Detection
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
                      Every candidate gets questions and options in randomized order to eliminate lab copying.
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
                      Immediate Candidate Scorecard
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Show full score and solution breakdown right after submission.
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

              {/* Summary Card */}
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

        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#2e3035] bg-gray-50/50 dark:bg-[#151618] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202225] transition-colors"
            >
              Previous
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202225] transition-colors"
            >
              Cancel
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
                  Publish Mock Exam
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
