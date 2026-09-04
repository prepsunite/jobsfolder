import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tpoService } from '@/services/tpo.service';
import {
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Plus,
  Upload,
  ArrowRight,
  Clock,
  Award,
  ChevronRight,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import type { MockExam } from '@/types/tpo';
import BulkStudentImportModal from '@/components/tpo/BulkStudentImportModal';
import CreateMockExamModal from '@/components/tpo/CreateMockExamModal';
import AddStudentModal from '@/components/tpo/AddStudentModal';

export default function TpoOverviewPage() {
  const { collegeId, currentCollege, stats } = useOutletContext<{
    collegeId: string;
    currentCollege: any;
    stats: any;
  }>();
  const queryClient = useQueryClient();

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);

  // Fetch recent mock exams
  const { data: mockExams = [], refetch } = useQuery<MockExam[]>({
    queryKey: ['tpo-mock-exams', collegeId],
    queryFn: () => tpoService.getMockExamsForCollege(collegeId),
    enabled: !!collegeId,
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Welcome & Campus Banner */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              Institutional Placement Dashboard
            </span>
            <span className="text-xs text-slate-400 font-medium">Batch 2026 CRT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentCollege.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Monitor real-time campus recruitment training, company mock drives (TCS, Accenture, Infosys), and placement readiness across all engineering departments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] hover:border-[#FD4A32] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#FD4A32]" />
            Add Student
          </button>
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Upload className="w-4 h-4 text-[#FD4A32]" />
            Bulk Import (CSV)
          </button>
          <button
            onClick={() => setIsCreateExamOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FD4A32] hover:bg-[#e03f29] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FD4A32]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Schedule Mock Exam
          </button>
        </div>
      </div>

      {/* 2. Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Students */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Students</span>
            <Users className="w-4 h-4 text-[#FD4A32]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.totalStudents || 0}
            <span className="text-xs font-normal text-slate-400 ml-1.5">/ {stats?.maxLicenses || 1000} capacity</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-[#FD4A32] h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round(((stats?.totalStudents || 0) / (stats?.maxLicenses || 1000)) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Active Mock Exams */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Mock Exams</span>
            <Calendar className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.activeExamsCount || 0}
          </div>
          <p className="text-xs text-slate-400 mt-2">Live testing sessions</p>
        </div>

        {/* Completed Tests */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Tests Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.totalAttempts || 0}
          </div>
          <p className="text-xs text-slate-400 mt-2">Candidate submissions logged</p>
        </div>

        {/* Average College Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Campus Readiness</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {stats?.avgCollegeScore || 0}%
          </div>
          <p className="text-xs text-slate-400 mt-2">Batch average across all drives</p>
        </div>
      </div>

      {/* 3. Recent Mock Drives & Department Performance Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Mock Exams */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Active & Recent Mock Drives</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scheduled assessments for campus recruitment</p>
            </div>
            <Link
              to="/tpo/exams"
              className="text-xs font-bold text-[#FD4A32] hover:underline inline-flex items-center gap-1"
            >
              View All Drives ({mockExams.length}) <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {mockExams.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Mock Drives Scheduled</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Schedule your first mock exam (TCS NQT, Accenture, Infosys) pooled from verified questions.
              </p>
              <button
                onClick={() => setIsCreateExamOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#FD4A32] text-white text-xs font-bold uppercase tracking-wider"
              >
                Create Exam
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockExams.slice(0, 4).map(exam => (
                <div key={exam.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#FD4A32]/10 text-[#FD4A32]">
                        {exam.target_company}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{exam.title}</h4>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>{exam.duration_minutes} Mins</span>
                      <span>•</span>
                      <span>Total Marks: {exam.total_marks}</span>
                      <span>•</span>
                      <span>Target: {exam.target_departments?.length ? exam.target_departments.join(', ') : 'All Branches'}</span>
                    </div>
                  </div>

                  <Link
                    to={`/tpo/exams/${exam.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    View Ranks →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Department Readiness */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Department Readiness</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Branch-wise participation</p>
            </div>
            <Link
              to="/tpo/analytics"
              className="text-xs font-bold text-[#FD4A32] hover:underline"
            >
              Analytics →
            </Link>
          </div>

          <div className="space-y-3">
            {(stats?.departments || []).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Enroll students to view department distributions.
              </div>
            ) : (
              (stats?.departments || []).map((dept: any) => (
                <div
                  key={dept.department}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                      {dept.department} Branch
                    </span>
                    <span className="text-[11px] text-slate-400">{dept.studentCount} candidates enrolled</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                    {dept.avgScore}% avg
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        collegeId={collegeId}
        collegeName={currentCollege.name}
        onSuccess={(studentName) => {
          setIsAddStudentOpen(false);
          queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['tpo-students', collegeId] });
          refetch();
        }}
      />

      <BulkStudentImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        collegeId={collegeId}
        collegeName={currentCollege.name}
        onSuccess={() => {
          setIsImportOpen(false);
          queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['tpo-students', collegeId] });
          refetch();
        }}
      />

      <CreateMockExamModal
        isOpen={isCreateExamOpen}
        onClose={() => setIsCreateExamOpen(false)}
        collegeId={collegeId}
        onSuccess={() => {
          setIsCreateExamOpen(false);
          queryClient.invalidateQueries({ queryKey: ['tpo-stats', collegeId] });
          queryClient.invalidateQueries({ queryKey: ['tpo-mock-exams', collegeId] });
          refetch();
        }}
      />

    </div>
  );
}
