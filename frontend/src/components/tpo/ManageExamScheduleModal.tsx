import React, { useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  StopCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import type { MockExam } from '@/types/tpo';
import { tpoService, getExamTimingStatus } from '@/services/tpo.service';
import { useToast } from '@/contexts/ToastContext';

interface ManageExamScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: MockExam | null;
  collegeId?: string;
  onSuccess?: () => void;
}

function toLocalDatetimeInputValue(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

function formatPrettyDate(isoString?: string): string {
  if (!isoString) return 'Flexible';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Flexible';
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Flexible';
  }
}

export default function ManageExamScheduleModal({
  isOpen,
  onClose,
  exam,
  collegeId,
  onSuccess,
}: ManageExamScheduleModalProps) {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'EXTEND' | 'CONCLUDE' | 'PASSCODE'>('EXTEND');
  const [selectedExtensionMinutes, setSelectedExtensionMinutes] = useState<number | null>(30);
  const [customEndTime, setCustomEndTime] = useState<string>(() => {
    if (exam?.end_time) {
      const e = new Date(exam.end_time);
      if (!isNaN(e.getTime())) return toLocalDatetimeInputValue(e);
    }
    return toLocalDatetimeInputValue(new Date(Date.now() + 60 * 60 * 1000));
  });

  const [passcodeEnabled, setPasscodeEnabled] = useState<boolean>(() => Boolean(exam?.enable_passcode_lock));
  const [passcodeVal, setPasscodeVal] = useState<string>(() => exam?.access_passcode || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmConcludeStep, setConfirmConcludeStep] = useState(false);

  // Quick PIN generator (4-digit numeric)
  const generateRandomPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setPasscodeVal(pin);
  };

  const handleSavePasscode = async () => {
    if (!exam) return;
    const clean = passcodeVal.trim().toUpperCase();
    if (passcodeEnabled && !clean) {
      toast.error('Please enter a 4 to 8 character passcode, or uncheck the passcode lock.');
      return;
    }
    setIsSubmitting(true);
    try {
      await tpoService.updateExamPasscode(exam.id, clean, passcodeEnabled, collegeId || exam.college_id);
      toast.success(
        passcodeEnabled
          ? `Lab passcode lock active with PIN: ${clean}`
          : 'Lab passcode lock disabled. Candidates can enter freely.'
      );
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to update passcode. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !exam) return null;

  const timingStatus = getExamTimingStatus(exam);
  const isConcluded = timingStatus === 'CONCLUDED';

  // Calculate new proposed end time based on chips or custom input
  const calculateProposedEndTime = (): Date => {
    if (selectedExtensionMinutes !== null) {
      // Add minutes to current end_time (or now if end_time already passed)
      const currentEndMs = exam.end_time ? new Date(exam.end_time).getTime() : Date.now();
      const baseMs = Math.max(Date.now(), isNaN(currentEndMs) ? Date.now() : currentEndMs);
      return new Date(baseMs + selectedExtensionMinutes * 60 * 1000);
    }
    const parsedCustom = new Date(customEndTime).getTime();
    if (!isNaN(parsedCustom)) {
      return new Date(parsedCustom);
    }
    return new Date(Date.now() + 60 * 60 * 1000);
  };

  const proposedEndTime = calculateProposedEndTime();

  // 1. Handle Window Extension
  const handleExtendWindow = async () => {
    const newEndIso = proposedEndTime.toISOString();
    if (new Date(newEndIso).getTime() <= Date.now()) {
      toast.error('The new closing time must be in the future.');
      return;
    }

    setIsSubmitting(true);
    try {
      await tpoService.extendMockExamWindow(exam.id, newEndIso, collegeId || exam.college_id);
      toast.success(`Assessment window extended until ${formatPrettyDate(newEndIso)}.`);
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to extend assessment window. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Handle Immediate Conclude
  const handleConcludeNow = async () => {
    if (!confirmConcludeStep) {
      setConfirmConcludeStep(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await tpoService.concludeMockExam(exam.id, collegeId || exam.college_id);
      toast.success('Assessment has been concluded. Active attempts are now finalized.');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to conclude assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
      setConfirmConcludeStep(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#15171b] border border-gray-200 dark:border-[#27292e] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-[#24262b] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FD4A32]/10 text-[#FD4A32]">
                {exam.target_company}
              </span>
              {timingStatus === 'LIVE' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Assessment
                </span>
              ) : timingStatus === 'UPCOMING' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Scheduled
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  Concluded
                </span>
              )}
            </div>
            <h3 className="font-display text-base font-extrabold text-gray-900 dark:text-white truncate max-w-sm">
              {exam.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-[#202225] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Schedule Summary Box */}
        <div className="p-4 bg-gray-50/70 dark:bg-[#1a1c21] border-b border-gray-100 dark:border-[#24262b] text-xs space-y-1.5">
          <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              Window Opened:
            </span>
            <strong className="text-gray-900 dark:text-white font-mono">
              {formatPrettyDate(exam.start_time)}
            </strong>
          </div>
          <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              Scheduled Deadline:
            </span>
            <strong className="text-gray-900 dark:text-white font-mono">
              {formatPrettyDate(exam.end_time)}
            </strong>
          </div>
          <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 pt-0.5">
            <span className="text-gray-400">Attempt Duration:</span>
            <span className="font-bold text-[#FD4A32]">{exam.duration_minutes} Minutes per student</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 dark:border-[#24262b] text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('EXTEND');
              setConfirmConcludeStep(false);
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'EXTEND'
                ? 'border-[#FD4A32] text-[#FD4A32] bg-[#FD4A32]/5'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Extend Window</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('PASSCODE');
              setConfirmConcludeStep(false);
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'PASSCODE'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Lab Passcode Lock</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('CONCLUDE');
              setConfirmConcludeStep(false);
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'CONCLUDE'
                ? 'border-rose-500 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <StopCircle className="w-3.5 h-3.5" />
            <span>Conclude Now</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {activeTab === 'EXTEND' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Select Extension Increment:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '+15 Mins', mins: 15 },
                    { label: '+30 Mins', mins: 30 },
                    { label: '+1 Hour', mins: 60 },
                    { label: '+2 Hours', mins: 120 },
                    { label: '+4 Hours', mins: 240 },
                    { label: '+1 Day', mins: 1440 },
                  ].map(chip => (
                    <button
                      key={chip.mins}
                      type="button"
                      onClick={() => setSelectedExtensionMinutes(chip.mins)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedExtensionMinutes === chip.mins
                          ? 'border-[#FD4A32] bg-[#FD4A32]/10 text-[#FD4A32] shadow-2xs'
                          : 'border-gray-200 dark:border-[#2d3036] hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1c21]'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Time Selection */}
              <div className="pt-2 border-t border-gray-100 dark:border-[#24262b]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Or Specific Custom Closing Date & Time:
                  </label>
                  {selectedExtensionMinutes === null && (
                    <span className="text-[10px] font-bold text-[#FD4A32]">Custom Active</span>
                  )}
                </div>
                <input
                  type="datetime-local"
                  value={customEndTime}
                  onChange={e => {
                    setCustomEndTime(e.target.value);
                    setSelectedExtensionMinutes(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383a40] bg-white dark:bg-[#202225] text-xs font-semibold"
                />
              </div>

              {/* Dynamic Preview Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">New Assessment Deadline:</div>
                  <div className="font-mono font-semibold">
                    {formatPrettyDate(proposedEndTime.toISOString())}
                  </div>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">
                    Live candidate countdown timers will automatically synchronize with this extended deadline.
                  </p>
                </div>
              </div>
            </div>
          ) : activeTab === 'PASSCODE' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-indigo-700 dark:text-indigo-400">
                  <KeyRound className="w-4 h-4 shrink-0" />
                  Physical Lab Invigilator Lock
                </div>
                <p className="leading-relaxed text-indigo-800 dark:text-indigo-300">
                  Require candidates in computer labs to enter an invigilator PIN before they can enter full-screen testing. This prevents students who aren't physically present in the lab from starting the test remotely.
                </p>
              </div>

              {/* Toggle Card */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#1f2125] border border-gray-200 dark:border-[#2e3035]">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>Enforce Lab Passcode</span>
                    {passcodeEnabled && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Students must enter this PIN to unlock the examination hall session.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={passcodeEnabled}
                  onChange={e => {
                    setPasscodeEnabled(e.target.checked);
                    if (e.target.checked && !passcodeVal) {
                      generateRandomPin();
                    }
                  }}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Passcode Input & Regenerate */}
              {passcodeEnabled && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1c21] border-2 border-indigo-200 dark:border-indigo-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Active Lab Passcode PIN:
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPin}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <RefreshCw className="w-3 h-3" /> Generate Random PIN
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      maxLength={8}
                      value={passcodeVal}
                      onChange={e => setPasscodeVal(e.target.value.toUpperCase())}
                      placeholder="e.g. 4821"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-950/20 text-center font-mono font-black text-xl tracking-widest text-indigo-600 dark:text-indigo-400 uppercase"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Announce this PIN on the lab projector or whiteboard once candidates are seated at their terminals.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-700 dark:text-rose-400">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  Emergency Early Wrap-Up
                </div>
                <p className="leading-relaxed text-rose-800 dark:text-rose-300">
                  Concluding the assessment will immediately freeze the testing window as <strong>Concluded</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-rose-700/90 dark:text-rose-300/90">
                  <li>In-progress candidates currently writing the test will have their responses finalized and graded automatically.</li>
                  <li>No new candidates will be allowed to start or resume the assessment.</li>
                  <li>Final rankings and performance analytics will be locked for recruiter inspection.</li>
                </ul>
              </div>

              {confirmConcludeStep && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Confirmation Required:</strong> Click the red button below to execute this action.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 dark:border-[#24262b] flex items-center justify-between gap-3 bg-gray-50/50 dark:bg-[#1a1c21]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>

          {activeTab === 'EXTEND' ? (
            <button
              type="button"
              onClick={handleExtendWindow}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-[#FD4A32]/20 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>Save &amp; Extend Window</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : activeTab === 'PASSCODE' ? (
            <button
              type="button"
              onClick={handleSavePasscode}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving PIN...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Passcode Settings</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConcludeNow}
              disabled={isSubmitting || isConcluded}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-white shadow-md ${
                confirmConcludeStep
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25 animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Concluding...</span>
                </>
              ) : confirmConcludeStep ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  <span>Yes, Conclude Assessment Now</span>
                </>
              ) : (
                <>
                  <StopCircle className="w-4 h-4" />
                  <span>Conclude Assessment Now</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
