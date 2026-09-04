import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tpoService } from '@/services/tpo.service';
import {
  FileText,
  Plus,
  Clock,
  Share2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import type { MockExam } from '@/types/tpo';
import CreateMockExamModal from '@/components/tpo/CreateMockExamModal';

export default function TpoExamsPage() {
  const { collegeId, currentCollege } = useOutletContext<{
    collegeId: string;
    currentCollege: any;
  }>();
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'UPCOMING'>('ALL');

  const {
    data: mockExams = [],
    isLoading,
    refetch,
  } = useQuery<MockExam[]>({
    queryKey: ['tpo-mock-exams', collegeId],
    queryFn: () => tpoService.getMockExamsForCollege(collegeId),
    enabled: !!collegeId,
  });

  const copyExamLink = (examId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/exam/${examId}`;
    navigator.clipboard.writeText(url);
    alert(`Candidate Exam Link copied:\n${url}\n\nShare this on official college placement WhatsApp groups.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Mock Placement Drives
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure company-pattern assessments pooled from PrepUnite's verified question repository
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FD4A32]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule New Mock Exam
        </button>
      </div>

      {/* Grid of Mock Exams */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading mock exams...</div>
      ) : mockExams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Mock Exams Scheduled</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Schedule a company-specific diagnostic test (TCS NQT, Accenture, Infosys) for your candidates.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#FD4A32] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#e03f29]"
          >
            Create Exam Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockExams.map(exam => (
            <div
              key={exam.id}
              className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-[#FD4A32]/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20">
                    {exam.target_company}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {exam.duration_minutes} Mins
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {exam.title}
                </h3>

                {/* Info Pills */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Marks:</span>
                    <strong className="text-slate-900 dark:text-white">{exam.total_marks}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Passing Cutoff:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{exam.passing_percentage}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Depts:</span>
                    <strong className="text-slate-900 dark:text-white truncate max-w-[140px]">
                      {exam.target_departments?.length ? exam.target_departments.join(', ') : 'All Branches'}
                    </strong>
                  </div>
                </div>

                {/* Anti-Cheat Badge */}
                {exam.enable_tab_switch_detection && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Max {exam.max_tab_switches_allowed} tab switches allowed
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-5 flex items-center gap-2">
                <Link
                  to={`/tpo/exams/${exam.id}`}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors text-center"
                >
                  Leaderboard & Analytics →
                </Link>
                <button
                  onClick={() => copyExamLink(exam.id)}
                  title="Copy Candidate Test Link"
                  className="p-2.5 rounded-xl bg-[#FD4A32]/10 hover:bg-[#FD4A32]/20 text-[#FD4A32] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create Exam Modal */}
      <CreateMockExamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        collegeId={collegeId}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
          refetch();
        }}
      />

    </div>
  );
}
