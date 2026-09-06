import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UserPlus,
  X,
  Loader2,
  AlertCircle,
  Users,
  ShieldCheck,
  Layers,
  Plus,
} from 'lucide-react';
import { tpoService } from '@/services/tpo.service';
import { useAuth } from '@/contexts/AuthContext';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeId: string;
  collegeName: string;
  onSuccess: (studentName: string) => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  collegeId,
  collegeName,
  onSuccess,
}: AddStudentModalProps) {
  const { user } = useAuth();
  const effectiveCollegeId =
    collegeId?.trim() ||
    user?.collegeId ||
    (typeof window !== 'undefined' ? localStorage.getItem('prepunite_college_id') : '') ||
    tpoService.findTpoAuthByEmail(user?.email)?.college_id ||
    '';

  const currentYear = new Date().getFullYear();
  const batchYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [batchYear, setBatchYear] = useState<number>(currentYear);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch real-time college quota stats
  const { data: stats } = useQuery({
    queryKey: ['tpo-stats', effectiveCollegeId],
    queryFn: () => tpoService.getTpoStats(effectiveCollegeId),
    enabled: isOpen && !!effectiveCollegeId,
  });

  // Fetch available batches for this college
  const { data: batches = [] } = useQuery({
    queryKey: ['tpo-batches', effectiveCollegeId],
    queryFn: () => tpoService.getCollegeBatches(effectiveCollegeId),
    enabled: isOpen && !!effectiveCollegeId,
  });

  // Default to Top Batch or first batch if available
  React.useEffect(() => {
    if (!selectedBatchId && batches.length > 0 && !isCreatingBatch) {
      const top = batches.find(b => b.name.toLowerCase().includes('top'));
      setSelectedBatchId(top ? top.id : batches[0].id);
    }
  }, [batches, selectedBatchId, isCreatingBatch]);

  const maxLicenses = stats?.maxLicenses || 1500;
  const currentEnrolled = stats?.totalStudents || 0;
  const remainingSeats = Math.max(0, maxLicenses - currentEnrolled);
  const isQuotaFull = remainingSeats <= 0;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Student Full Name and Email Address are required.');
      return;
    }

    if (isCreatingBatch && !newBatchName.trim()) {
      setErrorMessage('Please provide a name for the new batch (e.g. Top Batch, Super 60).');
      return;
    }

    if (isQuotaFull) {
      setErrorMessage(
        `Seat capacity reached! Your institution has ${maxLicenses} paid seats and all seats are filled. Contact PrepUnite to upgrade.`
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await tpoService.addSingleStudent(effectiveCollegeId, {
        name: name.trim(),
        email: email.trim(),
        roll_number: rollNumber.trim() || undefined,
        department: department.trim(),
        batch_year: batchYear,
        batch_id: !isCreatingBatch && selectedBatchId ? selectedBatchId : undefined,
        batch_name: isCreatingBatch && newBatchName.trim() ? newBatchName.trim() : undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to enroll student.');
        return;
      }

      const addedName = name.trim();
      setName('');
      setEmail('');
      setRollNumber('');
      setDepartment('CSE');
      setBatchYear(currentYear);
      setNewBatchName('');
      setIsCreatingBatch(false);
      onSuccess(addedName);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while enrolling the student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Add Single Student
              </h3>
              <p className="text-[11px] text-slate-500">
                Enroll individual candidate into {collegeName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quota Indicator */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Available License Capacity:
          </span>
          <span
            className={`font-mono font-black ${
              isQuotaFull ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {remainingSeats} seats free (of {maxLicenses})
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Student Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. rahul.sharma@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
            />
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Will receive immediate Campus Pro Pass with 100% unlocked platform access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Roll Number (Optional)
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                placeholder="e.g. 22B91A0501"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department *
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-semibold"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="AI/ML">AI / ML</option>
                <option value="DATA SCIENCE">Data Science</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Passout Graduation Batch *
            </label>
            <select
              value={batchYear}
              onChange={e => setBatchYear(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-semibold"
            >
              {batchYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Institutional Batch Assignment */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FD4A32]" />
                Cohort Batch Assignment *
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingBatch(!isCreatingBatch);
                  if (!isCreatingBatch) setNewBatchName('');
                }}
                className="text-[11px] font-bold text-[#FD4A32] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isCreatingBatch ? 'Choose Existing' : '+ Create New Batch'}
              </button>
            </div>

            {isCreatingBatch ? (
              <div className="space-y-1 mt-1">
                <input
                  type="text"
                  required
                  value={newBatchName}
                  onChange={e => setNewBatchName(e.target.value)}
                  placeholder="e.g. Top Batch, Super 60, Normal Batch"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#FD4A32] bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#FD4A32]/30"
                  autoFocus
                />
                <p className="text-[10px] text-slate-400">
                  New named batch will be created and this student assigned into it.
                </p>
              </div>
            ) : (
              <div className="space-y-1 mt-1">
                <select
                  value={selectedBatchId}
                  onChange={e => {
                    if (e.target.value === '__NEW__') {
                      setIsCreatingBatch(true);
                      setNewBatchName('');
                    } else {
                      setSelectedBatchId(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151618] text-slate-900 dark:text-white font-semibold"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.passout_year || currentYear})
                    </option>
                  ))}
                  <option value="__NEW__">+ Create New Custom Batch...</option>
                </select>
                <p className="text-[10px] text-slate-400">
                  Select which cohort (e.g. Top Batch vs Normal Batch) this student belongs to.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isQuotaFull}
              className="flex-1 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enrolling...
                </>
              ) : (
                'Enroll & Activate Pro'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
