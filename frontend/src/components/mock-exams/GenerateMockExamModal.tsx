import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import {
  X,
  Sparkles,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { tpoService } from '@/services/tpo.service';
import { mockExamSubscriptionService } from '@/services/mockExamSubscription.service';
import type { MockExamTemplate, MockExam } from '@/types/tpo';

interface GenerateMockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated?: (exam: MockExam) => void;
}

export default function GenerateMockExamModal({
  isOpen,
  onClose,
  onExamCreated,
}: GenerateMockExamModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Fetch available blueprints
  const { data: templates = [], isLoading: isTemplatesLoading } = useQuery<MockExamTemplate[]>({
    queryKey: ['mock-exam-templates'],
    queryFn: () => tpoService.getExamTemplates(),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch user's subscription and monthly quota
  const {
    data: usageInfo,
    isLoading: isUsageLoading,
    refetch: refetchUsage,
  } = useQuery({
    queryKey: ['student-mock-exam-quota', user?.email],
    queryFn: () => mockExamSubscriptionService.getMonthlyUsage(user?.email),
    enabled: isOpen && !!user?.email,
    staleTime: 10 * 1000,
  });

  // State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Default live dates (from now until 7 days later)
  const defaultDates = useMemo(() => {
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const pad = (n: number) => String(n).padStart(2, '0');
    const toInputString = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    return {
      start: toInputString(now),
      end: toInputString(future),
    };
  }, [isOpen]);

  const [startTime, setStartTime] = useState<string>(defaultDates.start);
  const [endTime, setEndTime] = useState<string>(defaultDates.end);

  // Sync selected template when list loads
  const activeTemplate = useMemo(() => {
    if (!templates || templates.length === 0) return null;
    if (selectedTemplateId) {
      return templates.find(t => t.id === selectedTemplateId) || templates[0];
    }
    // Prefer TCS NQT or Accenture ASE first
    const preferred =
      templates.find(t => t.id === 'tmpl-tcs-nqt-2026') ||
      templates.find(t => t.id === 'tmpl-accenture-ase') ||
      templates[0];
    return preferred;
  }, [templates, selectedTemplateId]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!user?.email) {
      toast.error('Please log in to generate an official blueprint mock exam.');
      return;
    }

    if (!activeTemplate) {
      toast.error('Please select an exam blueprint pattern.');
      return;
    }

    if (!usageInfo?.canGenerate) {
      toast.error(
        usageInfo?.limit === 0
          ? 'Free tier does not include mock exams. Please upgrade to Plus (₹139) or Pro (₹199).'
          : `Monthly generation limit reached (${usageInfo?.used}/${usageInfo?.limit}). Upgrade to Pro for 20 exams/month.`
      );
      return;
    }

    // Validate date window
    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
      toast.error('The live window end date must be after the start date.');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await tpoService.generateStudentPracticeExam(user.email, activeTemplate, {
        title: customTitle.trim() || undefined,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });

      toast.success(`Generated "${generated.title}" (${generated.duration_minutes} min)!`);

      // Invalidate queries so dashboard and student exams page refresh immediately
      queryClient.invalidateQueries({ queryKey: ['student-campus-mock-exams'] });
      queryClient.invalidateQueries({ queryKey: ['student-mock-exam-quota'] });
      await refetchUsage();

      if (onExamCreated) {
        onExamCreated(generated);
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate mock exam. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalQuestions = activeTemplate?.sections.reduce((sum, s) => sum + (Number(s.question_count) || 0), 0) || 0;
  const isFreeOrLocked = !usageInfo?.canGenerate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white dark:bg-[#151619] border border-gray-200 dark:border-[#27292e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-[#222429] flex items-center justify-between bg-gray-50/50 dark:bg-[#1a1b20]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#FD4A32] to-[#FF8066] text-white flex items-center justify-center shadow-md shadow-[#FD4A32]/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Generate Blueprint Mock Exam
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Official placement drive patterns with strict countdown timers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252830] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Subscription & Quota Card */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-[#27292e] bg-gray-50 dark:bg-[#1a1b1f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FD4A32]/10 text-[#FD4A32]">
                  {usageInfo?.planName || 'Plan'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Resets {usageInfo?.resetDate}
                </span>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Monthly Quota:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {usageInfo?.remaining} of {usageInfo?.limit} remaining
                </span>
                <span className="text-xs text-gray-400">({usageInfo?.used} used)</span>
              </div>
            </div>

            {isFreeOrLocked ? (
              <Link
                to="/pricing"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#FD4A32] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#e03f29] transition-all shadow-md shadow-[#FD4A32]/20 shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Upgrade to Plus (₹139)</span>
              </Link>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Active Quota Available</span>
              </div>
            )}
          </div>

          {/* Quota Exhausted / Free Warning Banner */}
          {isFreeOrLocked && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <div className="font-bold">
                  {usageInfo?.limit === 0 ? 'Mock Exams Require Plus or Pro Plan' : 'Monthly Generation Quota Reached'}
                </div>
                <p className="opacity-90 leading-relaxed">
                  {usageInfo?.limit === 0
                    ? 'Free users can browse syllabus and archives. To generate full 90-minute timed mock exams with proctored countdowns, upgrade to Plus (₹139/mo for 5 exams) or Pro (₹199/mo for 20 exams).'
                    : `You have generated all ${usageInfo?.limit} mock exams included in your monthly plan. Upgrade to Pro for 20 exams/month or wait until ${usageInfo?.resetDate} for your reset.`}
                </p>
              </div>
            </div>
          )}

          {/* 1. Choose Exam Blueprint */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#FD4A32]" />
                1. Select Exam Pattern / Blueprint
              </span>
              <span className="text-[11px] font-normal text-gray-500">
                {templates.length} patterns available
              </span>
            </label>

            {isTemplatesLoading ? (
              <div className="py-8 text-center text-xs text-gray-400">Loading exam blueprints...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map(tmpl => {
                  const isSelected = activeTemplate?.id === tmpl.id;
                  const qCount = tmpl.sections.reduce((acc, s) => acc + (Number(s.question_count) || 0), 0);
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setCustomTitle(`${tmpl.name} - Blueprint Practice`);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-[#FD4A32] bg-[#FD4A32]/5 dark:bg-[#FD4A32]/10 ring-2 ring-[#FD4A32]/30'
                          : 'border-gray-200 dark:border-[#27292e] bg-white dark:bg-[#18191c] hover:border-gray-300 dark:hover:border-[#353840]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#252830] text-gray-600 dark:text-gray-300">
                            {tmpl.target_company}
                          </span>
                          {tmpl.badge && (
                            <span className="text-[9px] font-semibold text-[#FD4A32]">
                              {tmpl.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                          {tmpl.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                          {tmpl.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#222428] text-[11px] font-mono text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1 font-bold text-[#FD4A32]">
                          <Clock className="w-3 h-3" />
                          {tmpl.duration_minutes} Mins
                        </span>
                        <span>{qCount} Questions</span>
                        <span>{tmpl.sections.length} Secs</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blueprint Details Summary */}
          {activeTemplate && (
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#18191c] border border-gray-200 dark:border-[#27292e] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FD4A32]" />
                  Blueprint Structure ({totalQuestions} Qs • {activeTemplate.duration_minutes} Mins)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  Pass: {activeTemplate.passing_percentage}%
                </span>
              </div>
              <div className="space-y-1.5 pt-1">
                {activeTemplate.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 bg-white dark:bg-[#141517] p-2 rounded-lg border border-gray-100 dark:border-[#24262c]"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                      {idx + 1}. {sec.name}
                    </span>
                    <div className="flex items-center gap-3 shrink-0 font-mono text-[10px]">
                      <span>{sec.question_count} Qs</span>
                      <span>+{sec.marks_per_correct}m</span>
                      {sec.duration_minutes && <span>{sec.duration_minutes}m</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Choose Live Window Schedule */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#FD4A32]" />
              2. Exam Live Window (Day X to Day Y)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                  Live From:
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#18191c] border border-gray-300 dark:border-[#27292e] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                  Live Until:
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#18191c] border border-gray-300 dark:border-[#27292e] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2.5">
              <Clock className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
              <p>
                <strong>Timer Rule:</strong> This test stays open between the selected dates. The moment you click <strong>Start Exam</strong> inside this window, the strict <strong>{activeTemplate?.duration_minutes || 90}-minute countdown</strong> will begin and auto-submit upon expiry.
              </p>
            </div>
          </div>

          {/* Optional Custom Exam Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              Exam Title (Optional)
            </label>
            <input
              type="text"
              value={customTitle}
              placeholder={activeTemplate ? `${activeTemplate.name} - Blueprint Practice` : 'Practice Exam Title'}
              onChange={e => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#18191c] border border-gray-300 dark:border-[#27292e] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#FD4A32]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-[#222429] bg-gray-50/50 dark:bg-[#18191d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#2e3138] text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252830] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {isFreeOrLocked ? (
            <Link
              to="/pricing"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FD4A32] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#e03f29] transition-all shadow-md shadow-[#FD4A32]/25 flex items-center justify-center gap-2"
            >
              <span>Unlock Plus Plan (₹139)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !activeTemplate}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FD4A32] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#e03f29] transition-all shadow-md shadow-[#FD4A32]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Pooling Questions & Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate {activeTemplate?.duration_minutes || 90}-Min Exam</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
