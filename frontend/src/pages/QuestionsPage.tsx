import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ExamCard from '@/components/ExamCard';
import type { ExamWithCompany } from '@/services/exam.service';
import { examService } from '@/services/exam.service';
import { companyService } from '@/services/company.service';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Search, Loader2, Plus, XCircle, Building2 } from 'lucide-react';

export default function QuestionsPage() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddExamModal, setShowAddExamModal] = useState(false);

  // New Exam Form State
  const [newExamForm, setNewExamForm] = useState({
    companySlug: 'tcs',
    name: 'TCS NQT Placement Papers 2026',
    badge: 'Campus Recruitment Drive',
  });

  // Query Companies for modal dropdown
  const { data: companyList = [] } = useQuery({
    queryKey: ['live-companies'],
    queryFn: async () => {
      const res = await companyService.getCompanies();
      return res.content || [];
    },
  });

  // Live Exams Query — always from Supabase
  const { data: exams = [], isLoading: isLoadingExams } = useQuery({
    queryKey: ['live-all-exams', searchTerm],
    queryFn: async () => {
      const all = await examService.getAllExams();
      if (!searchTerm) return all;
      return all.filter(
        (e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.companyIndustry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.badge?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamForm.name) return;

    try {
      await examService.createExam({
        companySlug: newExamForm.companySlug,
        name: newExamForm.name,
        badge: newExamForm.badge,
        content: `### ${newExamForm.name} Overview\n\nAdd your complete exam syllabus, pattern, and role details here.`,
        oldPapers: `### Old Papers\n\nLink your live Google Doc to show old papers and syllabus.`
      });
      queryClient.invalidateQueries({ queryKey: ['live-all-exams'] });
      setShowAddExamModal(false);
      setNewExamForm({
        companySlug: 'tcs',
        name: 'TCS NQT Placement Papers 2026',
        badge: 'Campus Recruitment Drive',
      });
    } catch (err: any) {
      alert(`Failed to create exam: ${err.message || err}`);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      await examService.deleteExam(examId);
      queryClient.invalidateQueries({ queryKey: ['live-all-exams'] });
    } catch (err: any) {
      alert(`Failed to delete exam: ${err.message || err}`);
    }
  };


  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E9ECEF] dark:border-[#242424]">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#009D63]/10 text-[#009D63] dark:bg-[#00C47B]/10 dark:text-[#00C47B] text-[9px] font-display font-bold uppercase tracking-wider">
            <BookOpen className="w-3 h-3" />
            <span>Official Papers Archive</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
            Exam Papers & Recruitment Drives
          </h1>
          <p className="text-[#868E96] dark:text-[#555555] text-xs font-sans">
            Direct access to official previous year placement papers, round patterns, and study archives.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddExamModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#121417] dark:bg-white text-white dark:text-black font-display font-bold text-xs uppercase tracking-wider rounded-md shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exam</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls & Search Bar */}
      <div className="space-y-4">
        <div className="relative flex-1 w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
          <input
            type="text"
            placeholder="Search TCS NQT, Accenture ASE, Infosys, Amazon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] dark:placeholder-[#555555] focus:outline-none transition-colors font-sans"
          />
        </div>
      </div>

      {/* COMPANY EXAM CARDS GRID */}
      {isLoadingExams ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#009D63] dark:text-[#00C47B] animate-spin" />
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-16 bg-[#F8F9FA] dark:bg-[#141414] rounded-lg border border-[#E9ECEF] dark:border-[#242424]">
          <Building2 className="w-8 h-8 text-[#868E96] dark:text-[#555555] mx-auto mb-2" />
          <h3 className="font-display text-sm font-bold text-[#121417] dark:text-[#FFFFFF] mb-1">No exam papers found</h3>
          <p className="text-[#868E96] dark:text-[#555555] text-xs">
            Try adjusting your search query or check back as new papers are added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam: ExamWithCompany) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onDelete={handleDeleteExam}
            />
          ))}
        </div>
      )}

      {/* ✏️ MODAL: ADD EXAM CARD */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <h3 className="font-display text-base font-bold text-[#1f1b17] dark:text-[#e3e3e3]">Add New Company Exam Card</h3>
              <button onClick={() => setShowAddExamModal(false)} className="text-[#747878] dark:text-[#6e7278] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase block mb-1">Target Company Slug *</label>
                <select
                  value={newExamForm.companySlug}
                  onChange={(e) => setNewExamForm({ ...newExamForm, companySlug: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl p-2.5 text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]"
                >
                  {companyList.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name} ({c.slug})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase block mb-1">Exam Card Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS NQT Digital & Ninja 2026"
                  value={newExamForm.name}
                  onChange={(e) => setNewExamForm({ ...newExamForm, name: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase block mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Campus Recruitment Drive"
                  value={newExamForm.badge}
                  onChange={(e) => setNewExamForm({ ...newExamForm, badge: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#747878] dark:text-[#a6adbb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006c49] hover:bg-[#00573b] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Create Exam Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
