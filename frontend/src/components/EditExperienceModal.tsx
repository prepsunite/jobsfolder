import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ExperienceItem } from '@/services/dataStore';

interface EditExperienceModalProps {
  experience: ExperienceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ExperienceItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(experience ? JSON.parse(JSON.stringify(experience)) : null);
  }, [experience]);

  if (!isOpen || !formData) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('experiences')
        .update({
          company_name: formData.companyName,
          role_title: formData.role,
          student_name: formData.studentName,
          college: formData.college,
          year: formData.year,
          difficulty: formData.difficulty,
          verdict: formData.verdict,
          rounds: JSON.stringify(formData.rounds),
          status: formData.status,
        })
        .eq('id', formData.id);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Failed to update experience: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto text-[#121417] dark:text-[#FFFFFF]">
        <div className="flex items-center justify-between pb-2 border-b border-[#E9ECEF] dark:border-[#242424]">
          <h3 className="font-display text-base font-bold">Edit Experience</h3>
          <button
            onClick={onClose}
            className="text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF] cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Company
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Student Name
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                College
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Verdict
              </label>
              <select
                value={formData.verdict}
                onChange={(e) => setFormData({ ...formData, verdict: e.target.value as any })}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none"
              >
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
                <option value="WAITLISTED">Waitlisted</option>
              </select>
            </div>
          </div>

          {formData.rounds.map((rd, idx) => (
            <div
              key={idx}
              className="space-y-1 p-3 bg-[#F8F9FA] dark:bg-[#0C0C0C] rounded-md border border-[#E9ECEF] dark:border-[#242424]"
            >
              <label className="text-[10px] font-bold text-[#009D63] dark:text-[#00C47B] uppercase block font-display">
                Round {idx + 1}
              </label>
              <input
                type="text"
                value={rd.roundTitle}
                onChange={(e) => {
                  const rounds = [...formData.rounds];
                  rounds[idx] = { ...rounds[idx], roundTitle: e.target.value };
                  setFormData({ ...formData, rounds });
                }}
                className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2 text-xs font-bold text-[#121417] dark:text-[#FFFFFF] mb-1 focus:outline-none focus:border-[#121417]"
              />
              <textarea
                rows={3}
                value={rd.details}
                onChange={(e) => {
                  const rounds = [...formData.rounds];
                  rounds[idx] = { ...rounds[idx], details: e.target.value };
                  setFormData({ ...formData, rounds });
                }}
                className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417]"
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#009D63] dark:bg-[#00C47B] text-black rounded-md text-xs font-display font-bold uppercase tracking-wider hover:bg-[#007F50] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
