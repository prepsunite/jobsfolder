import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { experienceService } from '@/services/experience.service';
import { companyService } from '@/services/company.service';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import type { QuestionDifficulty } from '@/types/question';

export default function SubmitExperiencePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      studentName: user?.name || '',
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
      <div className="max-w-md mx-auto py-16 text-center space-y-3 animate-fadeIn">
        <div className="w-12 h-12 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] border border-[#FD4A32]/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="font-display text-xl font-extrabold text-[#121417] dark:text-[#FFFFFF]">Experience Submitted!</h2>
        <p className="text-[#868E96] dark:text-[#555555] text-xs font-sans">
          Thank you for helping fellow placement candidates! Redirecting to feed...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Navigation Back */}
      <Link
        to="/experiences"
        className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Experiences</span>
      </Link>

      <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Community Contribution</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
            Share Your Placement Experience
          </h1>
          <p className="text-[#868E96] dark:text-[#555555] text-xs font-sans">
            Your detailed interview report helps students prepare for upcoming hiring rounds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-[#E9ECEF] dark:border-[#242424]">
          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">Company *</label>
              <select
                required
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#121417] dark:focus:border-[#444444] font-sans"
              >
                <option value="">Select Target Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Associate Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#121417] dark:focus:border-[#444444] font-sans"
              />
            </div>
          </div>

          {/* College & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">College / University</label>
              <input
                type="text"
                placeholder="e.g. VIT Vellore, SRM, IIT Bombay"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#121417] dark:focus:border-[#444444] font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">Graduation Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#121417] dark:focus:border-[#444444] font-sans"
              />
            </div>
          </div>

          {/* Overall Difficulty */}
          <div className="space-y-1">
            <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">Overall Difficulty</label>
            <div className="flex gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as QuestionDifficulty[]).map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-1.5 rounded-md border text-xs font-display font-bold uppercase tracking-wider transition-all ${
                    difficulty === d
                      ? 'bg-[#121417] dark:bg-white border-[#121417] dark:border-white text-white dark:text-black shadow-xs'
                      : 'bg-[#F8F9FA] dark:bg-[#0C0C0C] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Breakdown */}
          <div className="space-y-1">
            <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">Interview Breakdown & Questions *</label>
            <textarea
              required
              rows={5}
              placeholder="Describe each round (OA questions, technical interview questions, HR questions)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] rounded-md p-3 text-xs focus:outline-none focus:border-[#121417] dark:focus:border-[#444444] font-sans"
            />
          </div>

          {/* Tips */}
          <div className="space-y-1">
            <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">Tips & Advice for Juniors</label>
            <textarea
              rows={2}
              placeholder="What should candidates focus on? Any specific topics or traps to avoid?"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] rounded-md p-3 text-xs focus:outline-none focus:border-[#121417] dark:focus:border-[#444444] font-sans"
            />
          </div>

          {/* Resources Used */}
          <div className="space-y-1">
            <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555] block">Preparation Resources Used</label>
            <input
              type="text"
              placeholder="e.g. PrepUnite Archives, LeetCode, Striver A2Z"
              value={resourcesUsed}
              onChange={(e) => setResourcesUsed(e.target.value)}
              className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#121417] dark:focus:border-[#444444] font-sans"
            />
          </div>

          {/* Anonymous checkbox */}
          <div className="flex items-center gap-2.5 p-3 bg-[#F8F9FA] dark:bg-[#0C0C0C] rounded-md border border-[#E9ECEF] dark:border-[#242424]">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-[#E9ECEF] dark:border-[#242424] text-[#FD4A32] focus:ring-[#FD4A32]"
            />
            <label htmlFor="anonymous" className="text-xs text-[#121417] dark:text-[#FFFFFF] font-medium font-sans">
              Publish anonymously (Your name will be hidden from public view)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full py-2.5 bg-[#FD4A32] dark:bg-[#FD4A32] hover:bg-[#E0351D] text-black font-display font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitMutation.isPending ? 'Submitting...' : 'Submit Experience'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
