import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddExperienceModal: React.FC<AddExperienceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { role, user } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [companyName, setCompanyName] = useState('TCS');
  const [roleTitle, setRoleTitle] = useState('Software Engineer');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [verdict, setVerdict] = useState<'SELECTED' | 'REJECTED' | 'WAITLISTED'>('SELECTED');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [roundsText, setRoundsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsSubmitting(true);

    const finalStudentName = isAnonymous ? 'Anonymous Student' : (user?.name || 'Anonymous Student');
    const status = isAdmin ? 'APPROVED' : 'PENDING';

    try {
      const { error } = await supabase.from('experiences').insert({
        company_name: companyName,
        company_slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        role_title: roleTitle,
        student_name: finalStudentName,
        college: college || 'Engineering College',
        year,
        difficulty,
        verdict,
        rounds: JSON.stringify([
          {
            roundTitle: 'Interview Rounds & Details',
            details: roundsText || 'Interview experience details provided.',
          },
        ]),
        status,
        is_deleted: false,
      });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Failed to submit experience: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto text-[#121417] dark:text-[#FFFFFF]">
        <div className="flex items-center justify-between pb-2 border-b border-[#E9ECEF] dark:border-[#242424]">
          <h3 className="font-display text-base font-bold">Add Interview Experience</h3>
          <button
            onClick={onClose}
            className="text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF] cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Company
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Role
              </label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Student Name
              </label>
              <div className="flex items-center justify-between bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md px-3 py-2 text-xs">
                <span className="font-bold">{isAnonymous ? 'Anonymous Student' : user?.name || 'Student'}</span>
                <label className="flex items-center gap-1 cursor-pointer text-[10px] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-[#009D63] focus:ring-[#009D63]"
                  />
                  <span>Anonymous</span>
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                College
              </label>
              <input
                type="text"
                placeholder="NIT/IIT..."
                value={college}
                onChange={(e) => setCollege(e.target.value)}
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
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#868E96] dark:text-[#555555] uppercase block font-display">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
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
                value={verdict}
                onChange={(e) => setVerdict(e.target.value as any)}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] focus:outline-none"
              >
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
                <option value="WAITLISTED">Waitlisted</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-[10px] font-bold text-[#009D63] dark:text-[#00C47B] uppercase block font-display">
              Interview Breakdown & Rounds Details *
            </label>
            <textarea
              rows={5}
              required
              placeholder="Describe all interview rounds (OA questions, Technical questions, HR discussions)..."
              value={roundsText}
              onChange={(e) => setRoundsText(e.target.value)}
              className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-md p-2.5 text-xs text-[#121417] dark:text-[#FFFFFF] font-mono leading-relaxed focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
            />
          </div>

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
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#009D63] dark:bg-[#00C47B] text-black rounded-md text-xs font-display font-bold uppercase tracking-wider hover:bg-[#007F50] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Publish Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
