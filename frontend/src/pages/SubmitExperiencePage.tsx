import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { experienceService } from '@/services/experience.service';
import { companyService } from '@/services/company.service';
import { ArrowLeft, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import type { QuestionDifficulty } from '@/types/question';

export default function SubmitExperiencePage() {
  const navigate = useNavigate();
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [companyId, setCompanyId] = useState('');
  const [role, setRole] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('MEDIUM');
  const [content, setContent] = useState('');
  const [tips, setTips] = useState('');
  const [resourcesUsed, setResourcesUsed] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { data: companiesData } = useQuery({
    queryKey: ['companies-dropdown'],
    queryFn: () => companyService.getCompanies('', 0, 50),
  });

  const companies = companiesData?.content || [
    { id: '1', name: 'Accenture' },
    { id: '2', name: 'TCS' },
    { id: '3', name: 'Infosys' },
    { id: '4', name: 'Wipro' },
    { id: '5', name: 'Cognizant' },
    { id: '6', name: 'Google' },
  ];

  const submitMutation = useMutation({
    mutationFn: experienceService.submitExperience,
    onSuccess: () => {
      setSubmittedSuccess(true);
      setTimeout(() => {
        navigate('/experiences');
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !role || !content) return;

    submitMutation.mutate({
      companyId,
      role,
      college,
      year: Number(year),
      difficulty,
      content,
      tips,
      resourcesUsed,
      isAnonymous,
    });
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 text-[#00714d] dark:text-[#6cf8bb] border border-[#00714d]/30 dark:border-[#6cf8bb]/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-[#006c49] dark:text-[#6cf8bb]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#1f1b17] dark:text-[#e3e3e3]">Experience Submitted!</h2>
        <p className="text-[#444748] dark:text-[#a6adbb] text-sm">
          Thank you for helping fellow placement candidates! Redirecting to experiences feed...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Navigation Back */}
      <Link
        to="/experiences"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Experiences
      </Link>

      <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-8 sm:p-10 space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 border border-[#00714d]/20 dark:border-[#6cf8bb]/20 text-[#00714d] dark:text-[#6cf8bb] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#006c49] dark:text-[#6cf8bb]" />
            Community Contribution
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">
            Share Your Placement Experience
          </h1>
          <p className="text-[#444748] dark:text-[#a6adbb] text-sm leading-relaxed font-sans">
            Your detailed interview report helps hundreds of students prepare for upcoming hiring rounds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-[#eae1da] dark:border-[#2b2d31]">
          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1f1b17] dark:text-[#e3e3e3] block">Company *</label>
              <select
                required
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full bg-[#ffffff] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#006c49] dark:focus:border-[#6cf8bb] font-sans"
              >
                <option value="">Select Target Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1f1b17] dark:text-[#e3e3e3] block">Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Associate Software Engineer (ASE)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#ffffff] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#006c49] dark:focus:border-[#6cf8bb] font-sans"
              />
            </div>
          </div>

          {/* College & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1f1b17] dark:text-[#e3e3e3] block">College / University</label>
              <input
                type="text"
                placeholder="e.g. VIT Vellore, SRM, IIT Bombay"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-[#ffffff] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#006c49] dark:focus:border-[#6cf8bb] font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1f1b17] dark:text-[#e3e3e3] block">Graduation Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#ffffff] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#006c49] dark:focus:border-[#6cf8bb] font-sans"
              />
            </div>
          </div>

          {/* Overall Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1f1b17] dark:text-[#e3e3e3] block">Overall Difficulty</label>
            <div className="flex gap-4">
              {(['EASY', 'MEDIUM', 'HARD'] as QuestionDifficulty[]).map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${
                    difficulty === d
                      ? 'bg-[#000000] dark:bg-[#e3e3e3] border-[#000000] dark:border-[#e3e3e3] text-white dark:text-[#141517] shadow-md'
                      : 'bg-[#f6ece6] dark:bg-[#141517] border-[#e2d8d2] dark:border-[#383a40] text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Breakdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1f1b17] dark:text-[#e3e3e3] block">Interview Breakdown & Questions *</label>
            <textarea
              required
              rows={6}
              placeholder="Describe each round (OA questions, Technical interview questions, HR questions)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#ffffff] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] rounded-[20px] p-4 text-sm focus:outline-none focus:border-[#006c49] dark:focus:border-[#6cf8bb] leading-relaxed font-sans"
            />
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1f1b17] dark:text-[#e3e3e3] block">Tips & Advice for Juniors</label>
            <textarea
              rows={3}
              placeholder="What should candidates focus on? Any specific topics or traps to avoid?"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="w-full bg-[#ffffff] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] rounded-[20px] p-4 text-sm focus:outline-none focus:border-[#006c49] dark:focus:border-[#6cf8bb] leading-relaxed font-sans"
            />
          </div>

          {/* Resources Used */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1f1b17] dark:text-[#e3e3e3] block">Preparation Resources Used</label>
            <input
              type="text"
              placeholder="e.g. PrepUnite OA Bank, Striver A2Z Sheet, LeetCode"
              value={resourcesUsed}
              onChange={(e) => setResourcesUsed(e.target.value)}
              className="w-full bg-[#ffffff] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#006c49] dark:focus:border-[#6cf8bb] font-sans"
            />
          </div>

          {/* Anonymous checkbox */}
          <div className="flex items-center gap-3 p-4 bg-[#f6ece6] dark:bg-[#141517] rounded-[16px] border border-[#e2d8d2] dark:border-[#2b2d31]">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded border-[#c4c7c7] dark:border-[#383a40] text-[#006c49] focus:ring-[#006c49] dark:focus:ring-[#6cf8bb]"
            />
            <label htmlFor="anonymous" className="text-xs text-[#1f1b17] dark:text-[#e3e3e3] font-semibold">
              Publish anonymously (Your name will be hidden from public view)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full py-3.5 bg-[#000000] hover:bg-[#006c49] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-[#6cf8bb]" />
            <span>{submitMutation.isPending ? 'Submitting...' : 'Submit Experience'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
