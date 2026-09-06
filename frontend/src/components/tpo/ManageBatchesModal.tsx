import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tpoService } from '@/services/tpo.service';
import type { CollegeBatch, CollegeStudent } from '@/types/tpo';
import {
  Layers,
  X,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Loader2,
  Filter,
} from 'lucide-react';

interface ManageBatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeId: string;
  collegeName?: string;
  onSelectBatchFilter?: (batchName: string) => void;
}

const ALL_DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI/ML', 'DATA SCIENCE'];

const PRESET_BATCHES = [
  { name: 'Top Batch', color: 'border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-950/30' },
  { name: 'Normal Batch', color: 'border-slate-300 text-slate-700 bg-slate-50 dark:bg-slate-800' },
  { name: 'Super 60', color: 'border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30' },
  { name: 'Product Track', color: 'border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/30' },
  { name: 'Core Engineering', color: 'border-sky-300 text-sky-700 bg-sky-50 dark:bg-sky-950/30' },
];

export default function ManageBatchesModal({
  isOpen,
  onClose,
  collegeId,
  collegeName,
  onSelectBatchFilter,
}: ManageBatchesModalProps) {
  const queryClient = useQueryClient();

  const [batchName, setBatchName] = useState('');
  const [passoutYear, setPassoutYear] = useState<number>(new Date().getFullYear());
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['ALL']);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingBatchId, setDeletingBatchId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Existing Batches
  const { data: batches = [], isLoading: isBatchesLoading } = useQuery<CollegeBatch[]>({
    queryKey: ['tpo-batches', collegeId],
    queryFn: () => tpoService.getCollegeBatches(collegeId),
    enabled: isOpen && !!collegeId,
  });

  // Fetch Students to compute headcount per batch
  const { data: students = [] } = useQuery<CollegeStudent[]>({
    queryKey: ['tpo-students-for-batch-counts', collegeId],
    queryFn: () => tpoService.getCollegeStudents(collegeId),
    enabled: isOpen && !!collegeId,
  });

  if (!isOpen) return null;

  // Toggle Department Selection
  const handleToggleDept = (dept: string) => {
    if (dept === 'ALL') {
      setSelectedDepts(['ALL']);
      return;
    }
    setSelectedDepts(prev => {
      const withoutAll = prev.filter(d => d !== 'ALL');
      if (withoutAll.includes(dept)) {
        const next = withoutAll.filter(d => d !== dept);
        return next.length === 0 ? ['ALL'] : next;
      } else {
        return [...withoutAll, dept];
      }
    });
  };

  // Create Batch Handler
  const handleCreateBatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!batchName.trim()) {
      setErrorMsg('Please enter a batch or cohort name.');
      return;
    }

    setIsCreating(true);
    setErrorMsg(null);
    try {
      await tpoService.createCollegeBatch(collegeId, {
        name: batchName.trim(),
        passout_year: passoutYear,
        departments: selectedDepts.includes('ALL') ? [] : selectedDepts,
      });

      setSuccessMsg(`Cohort "${batchName.trim()}" created successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      setBatchName('');
      queryClient.invalidateQueries({ queryKey: ['tpo-batches', collegeId] });
      queryClient.invalidateQueries({ queryKey: ['tpo-students', collegeId] });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create batch');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete Batch Handler
  const handleDeleteBatch = async (batch: CollegeBatch) => {
    const studentCount = students.filter(
      s => s.batch_id === batch.id || (s.batch_name && s.batch_name.toLowerCase() === batch.name.toLowerCase())
    ).length;

    const confirmMsg = studentCount > 0
      ? `Cohort "${batch.name}" currently has ${studentCount} enrolled student(s).\n\nAre you sure you want to delete this cohort? Students will remain on the roster as unassigned.`
      : `Are you sure you want to delete the cohort "${batch.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    setDeletingBatchId(batch.id);
    try {
      await tpoService.deleteCollegeBatch(collegeId, batch.id);
      queryClient.invalidateQueries({ queryKey: ['tpo-batches', collegeId] });
      queryClient.invalidateQueries({ queryKey: ['tpo-students', collegeId] });
    } catch (err: any) {
      alert(`Could not delete batch: ${err.message}`);
    } finally {
      setDeletingBatchId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-[#2e3035] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-[#2b2d31] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Manage Batches &amp; Cohorts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create and organize custom student groups for {collegeName || 'your institution'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Notifications */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* 1. Create New Batch Section */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#202225] border border-slate-200/80 dark:border-[#2e3035] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Create New Cohort Batch
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Instant setup for placement drives
              </span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Quick Suggestions:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_BATCHES.map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setBatchName(p.name)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${p.color} hover:scale-105 active:scale-95`}
                  >
                    + {p.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Batch / Cohort Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Top Batch, Super 60, Elite Coders..."
                  value={batchName}
                  onChange={e => setBatchName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#383a40] bg-white dark:bg-[#18191c] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Passout Graduation Year
                  </label>
                  <select
                    value={passoutYear}
                    onChange={e => setPassoutYear(parseInt(e.target.value) || 2026)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-[#383a40] bg-white dark:bg-[#18191c] text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {[2024, 2025, 2026, 2027, 2028, 2029].map(y => (
                      <option key={y} value={y}>{y} Passout</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Applicable Streams
                  </label>
                  <span className="text-[11px] text-slate-400 block pt-1 font-medium">
                    {selectedDepts.includes('ALL') ? 'All Academic Streams' : `${selectedDepts.length} Streams Selected`}
                  </span>
                </div>
              </div>

              {/* Department Multi-Select Pills */}
              <div className="space-y-1 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleDept('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      selectedDepts.includes('ALL')
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white dark:bg-[#18191c] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    All Streams
                  </button>
                  {ALL_DEPARTMENTS.map(d => {
                    const isSelected = selectedDepts.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleToggleDept(d)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white dark:bg-[#18191c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/20'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isCreating || !batchName.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Cohort Batch
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 2. Existing Batches Roster */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-500" />
                Active Campus Batches ({batches.length})
              </h3>
              <span className="text-[11px] text-slate-400">
                Used for targeted exam scheduling
              </span>
            </div>

            {isBatchesLoading ? (
              <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" /> Loading batches...
              </div>
            ) : batches.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  No Custom Batches Yet
                </h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Use the form above to add your first cohort (e.g. "Top Batch", "Normal Batch").
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {batches.map(batch => {
                  const studentCount = students.filter(
                    s =>
                      s.batch_id === batch.id ||
                      (s.batch_name && s.batch_name.toLowerCase() === batch.name.toLowerCase())
                  ).length;
                  const isDeleting = deletingBatchId === batch.id;

                  return (
                    <div
                      key={batch.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-[#2e3035] bg-white dark:bg-[#1e2024] hover:border-purple-300 dark:hover:border-purple-800 transition-all flex flex-col justify-between shadow-xs space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              {batch.name}
                            </span>
                            {batch.passout_year && (
                              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                                <Calendar className="w-3 h-3" />
                                {batch.passout_year}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                            <Users className="w-3.5 h-3.5 text-purple-500" />
                            <strong>{studentCount}</strong> enrolled student{studentCount === 1 ? '' : 's'}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBatch(batch)}
                          disabled={isDeleting}
                          title="Delete Batch"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Streams & Action footer */}
                      <div className="pt-2 border-t border-slate-100 dark:border-[#2b2d31] flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 truncate max-w-[140px]">
                          {batch.departments?.length ? batch.departments.join(', ') : 'All Branches'}
                        </span>
                        {onSelectBatchFilter && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectBatchFilter(batch.name);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-bold text-[11px] cursor-pointer"
                          >
                            <Filter className="w-3 h-3" />
                            Filter Roster
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-[#2b2d31] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
