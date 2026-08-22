import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { adminService } from '@/services/admin.service';
import { companyService } from '@/services/company.service';
import { examService } from '@/services/exam.service';
import { questionService } from '@/services/question.service';
import { experienceService } from '@/services/experience.service';
import { dataStore, type CompanyItem, type ExamItem, type ExperienceItem } from '@/services/dataStore';
import { useAuth } from '@/contexts/AuthContext';
import NotFoundPage from '@/pages/NotFoundPage';
import { Link } from 'react-router';
import RichTextEditor from '@/components/RichTextEditor';
import ContentRenderer from '@/components/ContentRenderer';
import {
  Building2,
  BookOpen,
  Layers,
  ShieldCheck,
  Users,
  Bookmark,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  Trash2,
  Edit3,
  GraduationCap,
  FileText,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Activity,
  CreditCard,
  ShoppingBag
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const [adminTab, setAdminTab] = useState<'create-company' | 'create-question' | 'create-resource' | 'manage-exams' | 'moderation' | 'users' | 'metrics'>('manage-exams');
  const [selectedCompanySlug, setSelectedCompanySlug] = useState('tcs');
  const [usersSubTab, setUsersSubTab] = useState<'users' | 'transactions' | 'purchases' | 'subscriptions'>('users');

  // Moderation filter state
  const [moderationFilter, setModerationFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Company Overview edit state
  const [adminOverviewInput, setAdminOverviewInput] = useState('');
  const [overviewSavedNotice, setOverviewSavedNotice] = useState(false);

  // --- React Query: Companies list from Supabase ---
  const { data: allCompanies = [] } = useQuery<CompanyItem[]>({
    queryKey: ['live-companies'],
    queryFn: async () => {
      const res = await companyService.getCompanies();
      return (res.content || []).map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        industry: c.industry || 'IT Services & Consulting',
        companySize: c.companySize || 'Pan-India',
        headquarters: c.headquarters || 'India & Global',
        website: c.website,
        logoUrl: c.logoUrl,
        examsList: [],
        aboutCompany: c.aboutCompany,
        isActive: c.isActive ?? true,
        createdAt: c.createdAt || new Date().toISOString(),
      }));
    },
    enabled: role === 'ADMIN',
    staleTime: 0,
  });

  // --- React Query: Exams for selected company from Supabase ---
  const { data: companyExamsList = [] } = useQuery<ExamItem[]>({
    queryKey: ['live-exams', selectedCompanySlug],
    queryFn: () => examService.getExamsByCompany(selectedCompanySlug),
    enabled: role === 'ADMIN' && !!selectedCompanySlug,
    staleTime: 0,
  });

  // --- React Query: Experiences (all statuses) from Supabase ---
  const { data: experiencesPage } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: role === 'ADMIN',
    staleTime: 0,
  });
  const experiencesList: ExperienceItem[] = (experiencesPage || []).map((e: any) => ({
    id: e.id,
    companyName: (e.company_slug || 'tcs').toUpperCase(),
    role: e.role_title || 'Software Engineer',
    studentName: e.student_name || 'Student',
    college: e.college || '',
    year: e.year || 2026,
    difficulty: e.difficulty || 'MEDIUM',
    verdict: 'SELECTED',
    rounds: [],
    status: e.status || 'PENDING',
  }));

  // --- React Query: All Exams Global from Supabase ---
  const { data: allExamsGlobal = [] } = useQuery({
    queryKey: ['live-all-exams'],
    queryFn: () => examService.getAllExams(),
    enabled: role === 'ADMIN',
    staleTime: 0,
  });

  // --- React Query: Live Registered Users from Supabase ---
  const { data: registeredUsersList = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getRegisteredUsers,
    enabled: role === 'ADMIN',
    staleTime: 0,
  });

  // --- React Query: Live Transactions from Supabase ---
  const { data: allTransactionsList = [], isLoading: txLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: adminService.getAllTransactions,
    enabled: role === 'ADMIN',
    staleTime: 0,
  });

  // --- React Query: Live Purchases from Supabase ---
  const { data: allPurchasesList = [] } = useQuery({
    queryKey: ['admin-purchases'],
    queryFn: adminService.getAllPaperPurchases,
    enabled: role === 'ADMIN',
    staleTime: 0,
  });

  // --- React Query: Live Subscriptions from Supabase ---
  const { data: allSubscriptionsList = [] } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: adminService.getAllSubscriptions,
    enabled: role === 'ADMIN',
    staleTime: 0,
  });

  // Keep adminOverviewInput in sync with selected company
  useEffect(() => {
    const currentCompany = allCompanies.find(c => c.slug === selectedCompanySlug);
    if (currentCompany) {
      setAdminOverviewInput(currentCompany.description || '');
    }
  }, [selectedCompanySlug, allCompanies]);

  // Invalidate all relevant queries (replaces reloadDataStoreLists)
  const reloadDataStoreLists = (slug: string = selectedCompanySlug) => {
    queryClient.invalidateQueries({ queryKey: ['live-companies'] });
    queryClient.invalidateQueries({ queryKey: ['live-exams', slug] });
    queryClient.invalidateQueries({ queryKey: ['live-all-exams'] });
    queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  };

  // STREAMLINED 2-STEP GUIDED COMPANY CREATION WIZARD STATE
  const [creationStep, setCreationStep] = useState<number>(1);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    slug: '',
    industry: 'IT Services & Consulting',
    companySize: 'Pan-India Recruitment Drive',
    headquarters: 'India & Global',
    website: '',
    logoUrl: '',
    description: '',
    // Exam Details
    examName: '',
    examBadge: 'Official Campus Drive 2026',
    examContent: '### Exam Pattern & Syllabus Overview\n\n- **Round 1:** Quantitative, Verbal & Reasoning MCQs (90 Mins)\n- **Round 2:** Advanced Coding & Hands-on Pseudocode (60 Mins)\n- **Round 3:** Technical & HR Interview',
    oldPapersContent: '### Old Papers & Memory Questions\n\n1. **Coding Problem 1:** Find longest palindromic substring.\n2. **Coding Problem 2:** Array subset sum with dynamic programming.\n3. **Pseudocode:** Loop tracing & recursion depth.'
  });

  // Form State for Adding New OA Question
  const [questionForm, setQuestionForm] = useState({
    title: '',
    companyName: 'TCS NQT',
    companySlug: 'tcs',
    role: 'Digital Tier',
    category: 'CODING',
    difficulty: 'MEDIUM',
    problemStatement: '',
    inputFormat: '',
    outputFormat: '',
    sampleInput: '',
    sampleOutput: '',
    explanation: '',
  });

  // Form State for Adding New Resource
  const [resourceForm, setResourceForm] = useState({
    title: '',
    companyName: 'TCS',
    category: 'PDF',
    fileType: 'PDF Document',
    url: '',
  });

  const [questionSuccess, setQuestionSuccess] = useState<boolean>(false);
  const [resourceSuccess, setResourceSuccess] = useState<boolean>(false);

  // Sub-Section Tab inside Manage Exams
  const [crudSection, setCrudSection] = useState<'exams' | 'overview'>('exams');

  // Edit Modal State for Exam
  const [editingExam, setEditingExam] = useState<ExamItem | null>(null);

  // New Exam Card Form state under active company
  const [newExamCard, setNewExamCard] = useState({
    name: '',
    badge: 'Official Campus Drive 2026',
    content: '### Exam Pattern & Syllabus Overview\n\n- **Round 1:** Aptitude & Reasoning MCQs\n- **Round 2:** Technical Coding Assessment',
    oldPapers: '### Memory Papers & PYQs\n\n1. **Previous Year Question 1:** Array manipulation\n2. **Previous Year Question 2:** SQL Inner Join query'
  });

  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getDashboardStats,
    enabled: role === 'ADMIN',
    retry: 1,
  });

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const examName = name ? `${name} Placement Papers 2026` : '';
    setCompanyForm((prev) => ({ ...prev, name, slug, examName }));
  };

  // STREAMLINED COMPANY & EXAM PUBLISHING FLOW
  const handlePublishCompanyPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = companyForm.slug || companyForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const examTitle = companyForm.examName || `${companyForm.name} Placement Papers 2026`;

    try {
      // 1. Create Company Profile in Supabase
      await companyService.createCompany({
        name: companyForm.name,
        slug: slug,
        industry: companyForm.industry,
        companySize: companyForm.companySize,
        headquarters: companyForm.headquarters,
        website: companyForm.website,
        logoUrl: companyForm.logoUrl || undefined,
        description: companyForm.description,
      });

      // 2. Create Exam Object in Supabase
      await examService.createExam({
        companySlug: slug,
        name: examTitle,
        badge: companyForm.examBadge || 'Official Campus Drive 2026',
        content: companyForm.examContent,
        oldPapers: companyForm.oldPapersContent,
      });

      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['live-companies'] });
      queryClient.invalidateQueries({ queryKey: ['live-all-exams'] });
      setSelectedCompanySlug(slug);
      setAdminTab('manage-exams');
      reloadDataStoreLists(slug);
    } catch (err: any) {
      alert(`Failed to publish company package to Supabase: ${err.message || err}`);
    }
  };

  const handleSaveCompanyOverviewAdmin = async () => {
    const activeCompany = allCompanies.find(c => c.slug === selectedCompanySlug);
    if (!activeCompany) return;

    try {
      await companyService.updateCompany(activeCompany.slug || selectedCompanySlug, {
        description: adminOverviewInput
      });

      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['live-companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', selectedCompanySlug] });
      setOverviewSavedNotice(true);
      setTimeout(() => setOverviewSavedNotice(false), 3000);
    } catch (err: any) {
      alert(`Failed to update company overview in Supabase: ${err.message || err}`);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await questionService.createQuestion({
        title: questionForm.title,
        companySlug: questionForm.companySlug,
        questionType: questionForm.category as any,
        difficulty: questionForm.difficulty as any,
        description: questionForm.problemStatement,
        explanation: questionForm.explanation,
      });

      queryClient.invalidateQueries({ queryKey: ['topic-questions'] });
      queryClient.invalidateQueries({ queryKey: ['live-questions'] });
      setQuestionSuccess(true);
      setTimeout(() => setQuestionSuccess(false), 4000);
    } catch (err: any) {
      alert(`Failed to create question in Supabase: ${err.message || err}`);
    }
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (dataStore as any).addResource({
      title: resourceForm.title,
      companyName: resourceForm.companyName,
      category: resourceForm.category,
      fileType: resourceForm.fileType,
      url: resourceForm.url,
      downloadsCount: 500,
    });

    queryClient.invalidateQueries({ queryKey: ['live-resources'] });
    setResourceSuccess(true);
    setTimeout(() => setResourceSuccess(false), 4000);
  };

  // --- EXAM CARDS CRUD ---
  const handleAddExamCardAdmin = async () => {
    if (!newExamCard.name) return;
    try {
      await examService.createExam({
        companySlug: selectedCompanySlug,
        name: newExamCard.name,
        badge: newExamCard.badge || 'Official Campus Drive 2026',
        content: newExamCard.content,
        oldPapers: newExamCard.oldPapers,
      });
      queryClient.invalidateQueries({ queryKey: ['live-all-exams'] });
      queryClient.invalidateQueries({ queryKey: ['live-exams', selectedCompanySlug] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      reloadDataStoreLists(selectedCompanySlug);
      setNewExamCard({
        name: '',
        badge: 'Official Campus Drive 2026',
        content: '### Exam Pattern & Syllabus Overview\n\n- **Round 1:** Aptitude & Reasoning MCQs\n- **Round 2:** Technical Coding Assessment',
        oldPapers: '### Memory Papers & PYQs\n\n1. **Previous Year Question 1:** Array manipulation\n2. **Previous Year Question 2:** SQL Inner Join query'
      });
    } catch (err: any) {
      alert(`Failed to add exam card in Supabase: ${err.message || err}`);
    }
  };

  const handleSaveEditedExam = async () => {
    if (!editingExam) return;
    try {
      await examService.updateExam(editingExam.id, editingExam);
      queryClient.invalidateQueries({ queryKey: ['live-all-exams'] });
      queryClient.invalidateQueries({ queryKey: ['live-exams', selectedCompanySlug] });
      reloadDataStoreLists(selectedCompanySlug);
      setEditingExam(null);
    } catch (err: any) {
      alert(`Failed to update exam in Supabase: ${err.message || err}`);
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (confirm('Are you sure you want to delete this exam module?')) {
      try {
        await examService.deleteExam(id);
        queryClient.invalidateQueries({ queryKey: ['live-all-exams'] });
        queryClient.invalidateQueries({ queryKey: ['live-exams', selectedCompanySlug] });
        reloadDataStoreLists(selectedCompanySlug);
      } catch (err: any) {
        alert(`Failed to delete exam from Supabase: ${err.message || err}`);
      }
    }
  };

  // --- MODERATION ACTIONS (APPROVE / DISAPPROVE / REJECT) ---
  const handleUpdateExperienceStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      if (status === 'APPROVED' || status === 'REJECTED') {
        await experienceService.updateExperienceStatus(id, status);
      }
      queryClient.invalidateQueries({ queryKey: ['live-experiences'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      reloadDataStoreLists();
    } catch (err: any) {
      alert(`Failed to update experience status in Supabase: ${err.message || err}`);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (confirm('Are you sure you want to delete this student experience submission?')) {
      try {
        await supabase.from('experiences').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', id);
        reloadDataStoreLists();
      } catch (err: any) {
        alert(`Failed to delete experience from Supabase: ${err.message || err}`);
      }
    }
  };

  // 🛡️ STRICT ADMIN ACCESS PROTECTION: NON-ADMINS GET A 404 PAGE
  if (role !== 'ADMIN') {
    return <NotFoundPage />;
  }

  const allExamsCount = companyExamsList.length;
  const pendingExperiencesCount = experiencesList.filter(e => e.status === 'PENDING').length;
  const approvedExperiencesCount = experiencesList.filter(e => e.status === 'APPROVED').length;
  const rejectedExperiencesCount = experiencesList.filter(e => e.status === 'REJECTED').length;

  const stats = data || {
    totalUsers: 142,
    totalCompanies: allCompanies.length,
    totalQuestions: dataStore.getQuestions().length,
    totalExperiences: experiencesList.length,
    pendingApprovals: pendingExperiencesCount,
    totalResources: dataStore.getResources().length,
    totalRoadmaps: 8,
  };

  const statCards = [
    { label: 'Registered Students', value: stats.totalUsers, icon: Users, color: 'text-[#0284c7] dark:text-[#38bdf8] bg-[#38bdf8]/15 border-[#38bdf8]/30' },
    { label: 'Target Companies', value: stats.totalCompanies, icon: Building2, color: 'text-[#FD4A32] dark:text-[#FD4A32] bg-[#FD4A32]/30 dark:bg-[#FD4A32]/30 border-[#E0351D]/20 dark:border-[#FD4A32]/20' },
    { label: 'Live Exam Cards', value: allExamsCount, icon: GraduationCap, color: 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-800' },
    { label: 'OA Questions', value: stats.totalQuestions, icon: BookOpen, color: 'text-[#FD4A32] dark:text-[#FD4A32] bg-[#FD4A32]/30 dark:bg-[#FD4A32]/30 border-[#E0351D]/20 dark:border-[#FD4A32]/20' },
    { label: 'Resource Vault', value: stats.totalResources, icon: Bookmark, color: 'text-[#0284c7] dark:text-[#38bdf8] bg-[#38bdf8]/15 border-[#38bdf8]/30' },
    { label: 'Approved Experiences', value: approvedExperiencesCount, icon: ThumbsUp, color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Pending Approvals', value: pendingExperiencesCount, icon: Clock, color: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' },
  ];

  const filteredExperiences = experiencesList.filter(e => {
    if (moderationFilter === 'ALL') return true;
    return e.status === moderationFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative rounded-[24px] bg-[#f6ece6] dark:bg-[#1e1f22] p-6 sm:p-8 border border-[#e2d8d2] dark:border-[#2b2d31] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-300 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
            Authenticated Administrator Master Management Center
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight">
            PrepUnite Master Admin Console
          </h1>
          <p className="text-[#444748] dark:text-[#a6adbb] text-sm leading-relaxed font-sans">
            Full control center for target companies, exam cards, student experience approvals/disapprovals, OA questions, and platform analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/bulk-import"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bulk Import JSON</span>
          </Link>
          <button
            onClick={() => setAdminTab('create-company')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-purple-300" />
            <span>Add Company & Exam Card</span>
          </button>
          <button
            onClick={() => setAdminTab('moderation')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
          >
            <Clock className="w-3.5 h-3.5 text-amber-200" />
            <span>Moderation Queue ({pendingExperiencesCount})</span>
          </button>
        </div>
      </div>

      {/* Primary Control Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-[#ffffff] dark:bg-[#1e1f22] p-2 rounded-[18px] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm">
        <button
          onClick={() => setAdminTab('manage-exams')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'manage-exams'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-300" />
          <span>Manage Company & Exam Modules</span>
        </button>

        <button
          onClick={() => setAdminTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'moderation'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
          <span>Experience Moderation Queue</span>
          {pendingExperiencesCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-black font-extrabold">
              {pendingExperiencesCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('create-company')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'create-company'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-purple-300" />
          <span>Add Company & Exam Card</span>
        </button>

        <button
          onClick={() => setAdminTab('create-question')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'create-question'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-300" />
          <span>Add OA Question</span>
        </button>

        <button
          onClick={() => setAdminTab('create-resource')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'create-resource'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-purple-300" />
          <span>Add Resource</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'users'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-purple-300" />
          <span>Users &amp; Purchases</span>
          {registeredUsersList.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 font-extrabold">
              {registeredUsersList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'metrics'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-purple-300" />
          <span>Platform Metrics</span>
        </button>
      </div>

      {/* 🥞 TAB 1: MANAGE EXAM SUB-MODULES & COMPANY DIRECTORY */}
      {adminTab === 'manage-exams' && (
        <div className="space-y-6">
          {/* Company Quick Selector Cards */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">
              Choose Target Company to Edit:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {allCompanies.map((c) => {
                const isSelected = c.slug === selectedCompanySlug;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCompanySlug(c.slug)}
                    className={`p-3.5 rounded-[18px] border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-900 text-white border-purple-900 shadow-md scale-[1.02]'
                        : 'bg-[#ffffff] dark:bg-[#1e1f22] text-[#1f1b17] dark:text-[#e3e3e3] border-[#e2d8d2] dark:border-[#2b2d31] hover:border-purple-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm block truncate">{c.name}</span>
                      {isSelected && <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-full font-bold">Selected</span>}
                    </div>
                    <span className={`text-[11px] block truncate ${isSelected ? 'text-purple-200' : 'text-[#747878] dark:text-[#6e7278]'}`}>
                      {c.industry || 'IT Services'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Selected Company Management Toolbar */}
          <div className="bg-[#f6ece6] dark:bg-[#1e1f22] border border-[#e2d8d2] dark:border-[#2b2d31] rounded-[24px] p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase tracking-wider block">Editing Company:</span>
                <h3 className="font-display text-lg font-black text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-tight">
                  {selectedCompanySlug}
                </h3>
              </div>
            </div>

            <Link
              to={`/companies/${selectedCompanySlug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-md"
            >
              <span>Open Public Page for {selectedCompanySlug.toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-300" />
            </Link>
          </div>

          {/* Sub-Module CRUD Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto bg-[#ffffff] dark:bg-[#1e1f22] p-2 rounded-[18px] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm">
            {[
              { id: 'exams', label: '🎓 Exam Cards & Text Editors (Shown on /questions)', count: companyExamsList.length },
              { id: 'overview', label: '🏢 Company Overview', count: 1 },
            ].map((tab) => {
              const isActive = crudSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCrudSection(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-900 text-white shadow-sm'
                      : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-purple-700 text-white' : 'bg-[#eae1da] dark:bg-[#383a40] text-[#1f1b17] dark:text-[#e3e3e3]'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SECTION 1: EXAM CARDS & TEXT-BASED MARKDOWN CRUD */}
          {crudSection === 'exams' && (
            <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#eae1da] dark:border-[#2b2d31]">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                    Exam Cards & Markdown Content for {selectedCompanySlug.toUpperCase()}
                  </h3>
                  <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
                    Exam cards automatically display on the <strong>/questions</strong> page. Click edit to modify the exam syllabus markdown and old papers content.
                  </p>
                </div>
              </div>

              {/* Current Exam Cards List */}
              <div className="space-y-4">
                {companyExamsList.map((exam) => (
                  <div key={exam.id} className="p-5 bg-[#f6ece6]/60 dark:bg-[#141517]/60 rounded-[20px] border border-[#e2d8d2] dark:border-[#2b2d31] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#e2d8d2] dark:border-[#2b2d31]">
                      <div>
                        <h4 className="font-bold text-base text-[#1f1b17] dark:text-[#e3e3e3] flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-[#FD4A32] dark:text-[#FD4A32]" />
                          <span>{exam.name}</span>
                        </h4>
                        <span className="text-xs text-[#747878] dark:text-[#a6adbb]">{exam.badge || 'Official Campus Drive'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/companies/${exam.companySlug}/oldpapers`}
                          className="px-3.5 py-1.5 bg-[#FD4A32] hover:bg-[#005237] text-white text-[11px] font-bold rounded-full transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Old Papers ➔</span>
                        </Link>
                        <button onClick={() => setEditingExam(exam)} className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white text-[11px] font-bold rounded-full transition-colors flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Markdown</span>
                        </button>
                        <button onClick={() => handleDeleteExam(exam.id)} className="text-rose-600 hover:text-rose-800 p-1.5" title="Delete Exam Module">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-[#ffffff] dark:bg-[#1e1f22] rounded-xl border border-[#e2d8d2] dark:border-[#2b2d31] space-y-1">
                        <span className="font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">About Exam (Syllabus & Pattern):</span>
                        <p className="text-[#444748] dark:text-[#a6adbb] line-clamp-3 font-mono text-[11px]">{exam.content}</p>
                      </div>
                      <div className="p-3 bg-[#ffffff] dark:bg-[#1e1f22] rounded-xl border border-[#e2d8d2] dark:border-[#2b2d31] space-y-1">
                        <span className="font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">Old Papers & PYQs:</span>
                        <p className="text-[#444748] dark:text-[#a6adbb] line-clamp-3 font-mono text-[11px]">{exam.oldPapers}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Exam Card Form */}
              <div className="p-5 bg-[#f6ece6] dark:bg-[#141517] rounded-[22px] border border-[#e2d8d2] dark:border-[#2b2d31] space-y-4">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#1f1b17] dark:text-[#e3e3e3]">
                  + Add New Exam Card to {selectedCompanySlug.toUpperCase()}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Exam Name (e.g. TCS NQT 2026 Placement Papers)"
                    value={newExamCard.name}
                    onChange={(e) => setNewExamCard({ ...newExamCard, name: e.target.value })}
                    className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3 py-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]"
                  />
                  <input
                    type="text"
                    placeholder="Drive Badge (e.g. Official Campus Drive 2026)"
                    value={newExamCard.badge}
                    onChange={(e) => setNewExamCard({ ...newExamCard, badge: e.target.value })}
                    className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3 py-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]"
                  />
                </div>
                <RichTextEditor
                  title="About Exam Markdown (Syllabus & Pattern)"
                  value={newExamCard.content}
                  onChange={(val) => setNewExamCard({ ...newExamCard, content: val })}
                  placeholder="Write exam pattern, syllabus, and selection stages..."
                />
                <RichTextEditor
                  title="Old Papers & PYQs Markdown"
                  value={newExamCard.oldPapers}
                  onChange={(val) => setNewExamCard({ ...newExamCard, oldPapers: val })}
                  placeholder="Write memory-based questions, old papers, and solutions..."
                />
                <button
                  onClick={handleAddExamCardAdmin}
                  className="px-5 py-2.5 bg-[#FD4A32] hover:bg-[#005237] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  + Add Exam Card Live to /questions
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: COMPANY OVERVIEW */}
          {crudSection === 'overview' && (
            <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1f1b17] dark:text-[#e3e3e3]">Company Overview & Description</h3>
                  <p className="text-xs text-[#747878] dark:text-[#a6adbb]">Edit company overview text for {selectedCompanySlug.toUpperCase()}</p>
                </div>
                {overviewSavedNotice && (
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved Live!
                  </span>
                )}
              </div>

              <RichTextEditor
                title={`Company Overview & Markdown Content (${selectedCompanySlug.toUpperCase()})`}
                value={adminOverviewInput}
                onChange={setAdminOverviewInput}
                placeholder="Enter company description overview..."
              />
              <button
                onClick={handleSaveCompanyOverviewAdmin}
                className="px-5 py-2.5 bg-[#FD4A32] hover:bg-[#E0351D] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                ✔ Save Overview Live
              </button>
            </div>
          )}
        </div>
      )}

      {/* 🛡️ TAB 2: STUDENT EXPERIENCES MODERATION QUEUE */}
      {adminTab === 'moderation' && (
        <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="space-y-1 pb-3 border-b border-[#E9ECEF] dark:border-[#242424]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-[#121417] dark:text-[#FFFFFF] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Student Experiences Moderation Queue
              </h2>
              <span className="text-[9px] font-display font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border border-amber-500/20">
                {pendingExperiencesCount} Action Required
              </span>
            </div>
            <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans">
              Review student interview submissions. Approving a submission makes it immediately live for all students on the <strong>/experiences</strong> feed.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-[#F8F9FA] dark:bg-[#0C0C0C] p-1 rounded-md border border-[#E9ECEF] dark:border-[#242424]">
            {[
              { id: 'PENDING', label: `Pending Approvals (${pendingExperiencesCount})` },
              { id: 'APPROVED', label: `Approved Live (${approvedExperiencesCount})` },
              { id: 'REJECTED', label: `Disapproved (${rejectedExperiencesCount})` },
              { id: 'ALL', label: `All Submissions (${experiencesList.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setModerationFilter(tab.id as any)}
                className={`px-3 py-1 rounded text-xs font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  moderationFilter === tab.id
                    ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                    : 'text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Submissions List */}
          {filteredExperiences.length === 0 ? (
            <div className="py-12 text-center space-y-1.5 bg-[#F8F9FA] dark:bg-[#0C0C0C] rounded-lg border border-[#E9ECEF] dark:border-[#242424]">
              <CheckCircle2 className="w-6 h-6 text-[#FD4A32] dark:text-[#FD4A32] mx-auto" />
              <h4 className="font-display font-bold text-xs text-[#121417] dark:text-[#FFFFFF]">No Submissions in this Filter</h4>
              <p className="text-xs text-[#868E96] dark:text-[#555555]">All student interview submissions have been moderated!</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredExperiences.map((exp) => (
                <div key={exp.id} className="p-4 bg-white dark:bg-[#141414] rounded-lg border border-[#E9ECEF] dark:border-[#242424] space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E9ECEF] dark:border-[#242424]">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-extrabold text-sm text-[#121417] dark:text-[#FFFFFF]">{exp.companyName} - {exp.role}</span>
                        <span className={`text-[9px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          exp.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' :
                          exp.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                        }`}>
                          {exp.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#868E96] dark:text-[#555555] font-sans">
                        Submitted by <strong>{exp.studentName}</strong> ({exp.college}) • Class of {exp.year}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {exp.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateExperienceStatus(exp.id, 'APPROVED')}
                          className="px-3 py-1.5 bg-[#FD4A32] hover:bg-[#E0351D] text-black text-xs font-display font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Approve & Publish</span>
                        </button>
                      )}
                      {exp.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleUpdateExperienceStatus(exp.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-display font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span>Disapprove</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-rose-600 hover:text-rose-700 p-1.5 rounded transition-colors"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rounds Detail Preview */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-display font-bold text-[#868E96] dark:text-[#555555] block uppercase tracking-wider">Interview Breakdown & Rounds Details:</span>
                    <div className="space-y-2">
                      {exp.rounds.map((r, rIdx) => {
                        const isGeneric = !r.roundTitle || ['Interview Rounds & Details', 'Interview Breakdown & Rounds Details'].includes(r.roundTitle);
                        return (
                          <div key={rIdx} className="p-3 bg-[#F8F9FA] dark:bg-[#0C0C0C] rounded-md border border-[#E9ECEF] dark:border-[#242424] space-y-1">
                            {!isGeneric && (
                              <span className="font-display font-bold text-xs text-[#FD4A32] dark:text-[#FD4A32] block uppercase tracking-wider">{r.roundTitle}</span>
                            )}
                            <ContentRenderer
                              content={r.details}
                              className="text-xs font-sans text-[#121417] dark:text-[#FFFFFF]"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🏢 TAB 3: STREAMLINED 2-STEP COMPANY & EXAM ONBOARDING */}
      {adminTab === 'create-company' && (
        <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1 pb-4 border-b border-[#eae1da] dark:border-[#2b2d31]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                Add Company & Primary Exam Card
              </h2>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-700">
                Step {creationStep} of 2
              </span>
            </div>
            <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
              Configure Company Profile and Primary Exam Card (published live to /questions).
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="grid grid-cols-2 gap-3">
            {['1. Company Profile', '2. Exam Card & Markdown Content'].map((stepLabel, idx) => {
              const stepNum = idx + 1;
              const isCurrent = creationStep === stepNum;
              const isDone = creationStep > stepNum;
              return (
                <button
                  key={idx}
                  onClick={() => setCreationStep(stepNum)}
                  className={`py-2.5 px-3 text-center rounded-xl text-xs font-bold transition-all border ${
                    isCurrent
                      ? 'bg-purple-900 text-white border-purple-900'
                      : isDone
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-[#f6ece6] dark:bg-[#141517] text-[#747878] dark:text-[#a6adbb] border-[#e2d8d2] dark:border-[#2b2d31]'
                  }`}
                >
                  {stepLabel}
                </button>
              );
            })}
          </div>

          <form onSubmit={handlePublishCompanyPackage} className="space-y-6 pt-2">
            {/* STEP 1: COMPANY PROFILE */}
            {creationStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display text-sm font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider">Step 1: Company Profile Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">Company Name *</label>
                    <input type="text" required placeholder="e.g. Capgemini, Cognizant, Wipro, Google..." value={companyForm.name} onChange={(e) => handleNameChange(e.target.value)} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">URL Slug</label>
                    <input type="text" readOnly value={companyForm.slug} className="w-full bg-[#eae1da]/60 dark:bg-[#2b2d31]/60 border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#747878] dark:text-[#a6adbb] font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">Industry</label>
                    <input type="text" placeholder="e.g. IT Services & Consulting" value={companyForm.industry} onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">Official Website URL</label>
                    <input type="url" placeholder="https://..." value={companyForm.website} onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">Logo Image URL (Optional)</label>
                  <input type="url" placeholder="https://..." value={companyForm.logoUrl} onChange={(e) => setCompanyForm({ ...companyForm, logoUrl: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">Overview & Description</label>
                  <textarea rows={3} placeholder="Describe the company recruitment process..." value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]" />
                </div>
                <button type="button" onClick={() => setCreationStep(2)} className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold uppercase rounded-full">Next Step: Exam Card Markdown ➔</button>
              </div>
            )}

            {/* STEP 2: EXAM CARD & MARKDOWN CONTENT */}
            {creationStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display text-sm font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider">Step 2: Primary Exam Card & Markdown Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">Primary Exam Title *</label>
                    <input type="text" required placeholder="e.g. TCS NQT Placement Papers 2026" value={companyForm.examName} onChange={(e) => setCompanyForm({ ...companyForm, examName: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">Drive Badge Name</label>
                    <input type="text" placeholder="e.g. Official Campus Drive 2026" value={companyForm.examBadge} onChange={(e) => setCompanyForm({ ...companyForm, examBadge: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">About Exam Markdown Text (Syllabus, Pattern & Rounds)</label>
                  <textarea rows={4} value={companyForm.examContent} onChange={(e) => setCompanyForm({ ...companyForm, examContent: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] font-mono" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase block">Old Papers & PYQs Markdown Text</label>
                  <textarea rows={4} value={companyForm.oldPapersContent} onChange={(e) => setCompanyForm({ ...companyForm, oldPapersContent: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] font-mono" />
                </div>

                <div className="flex gap-3 pt-3 border-t border-[#eae1da] dark:border-[#2b2d31]">
                  <button type="button" onClick={() => setCreationStep(1)} className="px-4 py-2.5 bg-[#f6ece6] dark:bg-[#141517] text-[#747878] dark:text-[#a6adbb] text-xs font-bold rounded-full">Back</button>
                  <button type="submit" className="px-6 py-3 rounded-full bg-[#FD4A32] hover:bg-[#E0351D] text-white font-bold text-xs uppercase tracking-wider shadow-lg">
                    ✔ Publish Company & Exam Card Live
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ❓ TAB 4: ADD NEW OA QUESTION FORM */}
      {adminTab === 'create-question' && (
        <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1 pb-4 border-b border-[#eae1da] dark:border-[#2b2d31]">
            <h2 className="font-display text-xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-700 dark:text-purple-400" />
              Add OA Question to Live Bank
            </h2>
            <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
              Questions added here automatically show up live for all students on the <Link to="/questions" className="underline text-purple-900 dark:text-purple-400 font-bold">/questions</Link> page!
            </p>
          </div>

          {questionSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-[18px] flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">OA Question Published Live!</h4>
                  <p className="text-xs text-[#E0351D] dark:text-[#FD4A32]">Students can now practice this question in the OA Question Bank.</p>
                </div>
              </div>
              <Link to="/questions" className="px-4 py-2 rounded-full bg-[#000000] dark:bg-[#e3e3e3] text-white dark:text-[#141517] text-xs font-bold uppercase tracking-wider hover:bg-[#FD4A32] dark:hover:bg-white transition-colors shrink-0">
                View Question Bank ➔
              </Link>
            </div>
          )}

          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Question Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Find Longest Palindromic Substring in String"
                  value={questionForm.title}
                  onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Target Company Exam</label>
                <input
                  type="text"
                  placeholder="e.g. TCS NQT 2026"
                  value={questionForm.companyName}
                  onChange={(e) => setQuestionForm({ ...questionForm, companyName: e.target.value, companySlug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Category</label>
                <select
                  value={questionForm.category}
                  onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                >
                  <option value="CODING">Coding</option>
                  <option value="SQL">SQL Query</option>
                  <option value="PSEUDOCODE">Pseudocode</option>
                  <option value="APTITUDE">Aptitude</option>
                  <option value="REASONING">Logical Reasoning</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Difficulty</label>
                <select
                  value={questionForm.difficulty}
                  onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Target Role / Tier</label>
                <input
                  type="text"
                  placeholder="e.g. Digital Tier / ASE"
                  value={questionForm.role}
                  onChange={(e) => setQuestionForm({ ...questionForm, role: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Problem Statement *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe the question problem statement..."
                value={questionForm.problemStatement}
                onChange={(e) => setQuestionForm({ ...questionForm, problemStatement: e.target.value })}
                className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Sample Input</label>
                <input
                  type="text"
                  placeholder="e.g. string s = babad"
                  value={questionForm.sampleInput}
                  onChange={(e) => setQuestionForm({ ...questionForm, sampleInput: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Sample Output / Solution</label>
                <input
                  type="text"
                  placeholder="e.g. bab"
                  value={questionForm.sampleOutput}
                  onChange={(e) => setQuestionForm({ ...questionForm, sampleOutput: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] font-mono"
                />
              </div>
            </div>

            <button type="submit" className="px-6 py-3 rounded-full bg-[#FD4A32] hover:bg-[#E0351D] text-white font-bold text-xs uppercase tracking-wider shadow-md">
              + Publish Question Live to Bank
            </button>
          </form>
        </div>
      )}

      {/* 🔖 TAB 5: ADD NEW RESOURCE FORM */}
      {adminTab === 'create-resource' && (
        <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1 pb-4 border-b border-[#eae1da] dark:border-[#2b2d31]">
            <h2 className="font-display text-xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-purple-700 dark:text-purple-400" />
              Upload Resource to Vault
            </h2>
            <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
              Resources added here automatically show up live for all users on the <Link to="/resources" className="underline text-purple-900 dark:text-purple-400 font-bold">/resources</Link> page!
            </p>
          </div>

          {resourceSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-[18px] flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">Resource Added Live to Vault!</h4>
                  <p className="text-xs text-[#E0351D] dark:text-[#FD4A32]">Students can now download and view this resource.</p>
                </div>
              </div>
              <Link to="/resources" className="px-4 py-2 rounded-full bg-[#000000] dark:bg-[#e3e3e3] text-white dark:text-[#141517] text-xs font-bold uppercase tracking-wider hover:bg-[#FD4A32] dark:hover:bg-white transition-colors shrink-0">
                View Resource Library ➔
              </Link>
            </div>
          )}

          <form onSubmit={handleResourceSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS NQT Official Memory Placement Paper 2026"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Target Company</label>
                <input
                  type="text"
                  placeholder="e.g. TCS / Accenture / Infosys"
                  value={resourceForm.companyName}
                  onChange={(e) => setResourceForm({ ...resourceForm, companyName: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">Resource Category</label>
                <select
                  value={resourceForm.category}
                  onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                >
                  <option value="PDF">PDFs & Notes</option>
                  <option value="YOUTUBE">YouTube Playlists</option>
                  <option value="PRACTICE_WEBSITE">Practice Website</option>
                  <option value="CHEAT_SHEET">Cheat Sheets</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">File / Access URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={resourceForm.url}
                  onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3.5 py-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278]"
                />
              </div>
            </div>

            <button type="submit" className="px-6 py-3 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs uppercase tracking-wider shadow-md">
              + Publish Resource Live
            </button>
          </form>
        </div>
      )}

      {/* 👥 TAB 5.5: USERS & PURCHASES MANAGEMENT */}
      {adminTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Sub-Tab Switcher */}
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] p-5 rounded-[24px] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-[#1f1b17] dark:text-[#e3e3e3] flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Registered Students &amp; Monetization Audit</span>
              </h3>
              <p className="text-xs text-[#747878] dark:text-[#a6adbb]">
                Live synchronization with Supabase <code className="text-purple-600 dark:text-purple-400 font-bold">auth.users</code>, <code className="text-purple-600 dark:text-purple-400 font-bold">profiles</code>, and <code className="text-purple-600 dark:text-purple-400 font-bold">transactions</code>.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#f6ece6] dark:bg-[#141517] p-1.5 rounded-full border border-[#eae1da] dark:border-[#2b2d31] overflow-x-auto">
              <button
                onClick={() => setUsersSubTab('users')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  usersSubTab === 'users'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                }`}
              >
                Registered Users ({registeredUsersList.length})
              </button>
              <button
                onClick={() => setUsersSubTab('transactions')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  usersSubTab === 'transactions'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                }`}
              >
                Transactions ({allTransactionsList.length})
              </button>
              <button
                onClick={() => setUsersSubTab('purchases')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  usersSubTab === 'purchases'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                }`}
              >
                Exam Paper Passes ({allPurchasesList.length})
              </button>
              <button
                onClick={() => setUsersSubTab('subscriptions')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  usersSubTab === 'subscriptions'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                }`}
              >
                Pro Subscriptions ({allSubscriptionsList.length})
              </button>
            </div>
          </div>

          {/* SubTab 1: Registered Users */}
          {usersSubTab === 'users' && (
            <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">
                  All Authenticated Users ({registeredUsersList.length})
                </span>
                <span className="text-[11px] text-[#747878] dark:text-[#a6adbb]">
                  Synced from Supabase database
                </span>
              </div>

              {registeredUsersList.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#747878] dark:text-[#a6adbb]">
                  No registered users found yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#eae1da] dark:border-[#2b2d31] text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-3">User</th>
                        <th className="pb-3 px-3">Email</th>
                        <th className="pb-3 px-3">Role</th>
                        <th className="pb-3 px-3">Registered On</th>
                        <th className="pb-3 px-3">User ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eae1da] dark:divide-[#2b2d31]">
                      {registeredUsersList.map((u: any) => (
                        <tr key={u.id} className="hover:bg-[#f6ece6]/40 dark:hover:bg-[#141517]/40 transition-colors">
                          <td className="py-3.5 px-3 flex items-center gap-2.5">
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-[#eae1da] dark:border-[#2b2d31]" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                                {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-bold text-[#1f1b17] dark:text-[#e3e3e3]">{u.name || 'Student'}</span>
                          </td>
                          <td className="py-3.5 px-3 text-[#444748] dark:text-[#a6adbb] font-medium">{u.email}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                                : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                            }`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-[#747878] dark:text-[#a6adbb]">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3.5 px-3 text-[10px] font-mono text-[#747878] dark:text-[#a6adbb]">{u.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SubTab 2: Payment Transactions */}
          {usersSubTab === 'transactions' && (
            <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">
                  Razorpay &amp; Platform Payment Logs ({allTransactionsList.length})
                </span>
              </div>

              {allTransactionsList.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#747878] dark:text-[#a6adbb]">
                  No payment transactions recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#eae1da] dark:border-[#2b2d31] text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-3">Customer Email</th>
                        <th className="pb-3 px-3">Plan / Item</th>
                        <th className="pb-3 px-3">Amount</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3">Payment ID</th>
                        <th className="pb-3 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eae1da] dark:divide-[#2b2d31]">
                      {allTransactionsList.map((tx: any) => (
                        <tr key={tx.id || tx.payment_id} className="hover:bg-[#f6ece6]/40 dark:hover:bg-[#141517]/40 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-[#1f1b17] dark:text-[#e3e3e3]">{tx.user_email}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-300">
                              {tx.item_type || 'SINGLE_PAPER'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-extrabold text-[#FD4A32] dark:text-[#FD4A32]">₹{tx.amount}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-[10px] text-[#747878] dark:text-[#a6adbb]">{tx.payment_id}</td>
                          <td className="py-3.5 px-3 text-[#747878] dark:text-[#a6adbb]">
                            {tx.created_at ? new Date(tx.created_at).toLocaleString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SubTab 3: Paper Purchases */}
          {usersSubTab === 'purchases' && (
            <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">
                  Active Exam Paper Unlocks ({allPurchasesList.length})
                </span>
              </div>

              {allPurchasesList.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#747878] dark:text-[#a6adbb]">
                  No exam paper purchases recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#eae1da] dark:border-[#2b2d31] text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-3">User Email</th>
                        <th className="pb-3 px-3">Exam ID</th>
                        <th className="pb-3 px-3">Amount</th>
                        <th className="pb-3 px-3">Purchased On</th>
                        <th className="pb-3 px-3">Expires On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eae1da] dark:divide-[#2b2d31]">
                      {allPurchasesList.map((p: any) => (
                        <tr key={p.id || p.payment_id} className="hover:bg-[#f6ece6]/40 dark:hover:bg-[#141517]/40 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-[#1f1b17] dark:text-[#e3e3e3]">{p.user_email}</td>
                          <td className="py-3.5 px-3 font-semibold text-purple-700 dark:text-purple-400">{p.exam_id}</td>
                          <td className="py-3.5 px-3 font-extrabold text-[#FD4A32] dark:text-[#FD4A32]">₹{p.amount_paid}</td>
                          <td className="py-3.5 px-3 text-[#747878] dark:text-[#a6adbb]">{p.purchased_at ? new Date(p.purchased_at).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-3.5 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">{p.expires_at ? new Date(p.expires_at).toLocaleDateString() : '1 Year'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SubTab 4: Pro Subscriptions */}
          {usersSubTab === 'subscriptions' && (
            <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#1f1b17] dark:text-[#e3e3e3]">
                  Active Pro Subscriptions ({allSubscriptionsList.length})
                </span>
              </div>

              {allSubscriptionsList.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#747878] dark:text-[#a6adbb]">
                  No active pro subscriptions recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#eae1da] dark:border-[#2b2d31] text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-3">User Email</th>
                        <th className="pb-3 px-3">Plan Name</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3">Expires On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eae1da] dark:divide-[#2b2d31]">
                      {allSubscriptionsList.map((s: any) => (
                        <tr key={s.id || s.payment_id} className="hover:bg-[#f6ece6]/40 dark:hover:bg-[#141517]/40 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-[#1f1b17] dark:text-[#e3e3e3]">{s.user_email}</td>
                          <td className="py-3.5 px-3 font-semibold text-purple-700 dark:text-purple-400">{s.plan_name}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">{s.expires_at ? new Date(s.expires_at).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 📊 TAB 6: PLATFORM METRICS */}
      {adminTab === 'metrics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[24px] p-5 flex items-center justify-between shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb] block font-bold uppercase tracking-wider">{card.label}</span>
                    <span className="font-display text-2xl font-black text-[#1f1b17] dark:text-[#e3e3e3]">{card.value}</span>
                  </div>
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Platform Analytics Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Target Companies & Exams Overview */}
            <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 space-y-4 shadow-sm">
              <h3 className="font-display text-base font-bold text-[#1f1b17] dark:text-[#e3e3e3] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                <span>Target Companies & Exam Distribution</span>
              </h3>
              <div className="divide-y divide-[#eae1da] dark:divide-[#2b2d31]">
                {allCompanies.map((comp) => {
                  const compExams = allExamsGlobal.filter((e) => e.companySlug === comp.slug);
                  return (
                    <div key={comp.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-[#1f1b17] dark:text-[#e3e3e3] block">{comp.name}</span>
                        <span className="text-[11px] text-[#747878] dark:text-[#a6adbb]">{comp.industry || 'IT Services'}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-300 text-[11px] font-extrabold">
                        {compExams.length} Exam Cards
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Moderation Metrics Breakdown */}
            <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] p-6 space-y-4 shadow-sm">
              <h3 className="font-display text-base font-bold text-[#1f1b17] dark:text-[#e3e3e3] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FD4A32] dark:text-[#FD4A32]" />
                <span>Student Submissions Moderation Metrics</span>
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-[#f6ece6] dark:bg-[#141517] rounded-[18px] border border-[#e2d8d2] dark:border-[#2b2d31] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">Approved Live Experiences</span>
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb]">Visible on /experiences</span>
                  </div>
                  <span className="font-display text-xl font-black text-emerald-600 dark:text-emerald-400">{approvedExperiencesCount}</span>
                </div>

                <div className="p-4 bg-[#f6ece6] dark:bg-[#141517] rounded-[18px] border border-[#e2d8d2] dark:border-[#2b2d31] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">Pending Admin Moderation</span>
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb]">Needs approval or rejection</span>
                  </div>
                  <span className="font-display text-xl font-black text-amber-600 dark:text-amber-400">{pendingExperiencesCount}</span>
                </div>

                <div className="p-4 bg-[#f6ece6] dark:bg-[#141517] rounded-[18px] border border-[#e2d8d2] dark:border-[#2b2d31] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block">Disapproved / Rejected Submissions</span>
                    <span className="text-[11px] text-[#747878] dark:text-[#a6adbb]">Hidden from public view</span>
                  </div>
                  <span className="font-display text-xl font-black text-rose-600 dark:text-rose-400">{rejectedExperiencesCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ MODAL: EDIT EXAM MARKDOWN */}
      {editingExam && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <h3 className="font-display text-base font-bold text-[#1f1b17] dark:text-[#e3e3e3]">
                Edit Exam Card & Markdown Content
              </h3>
              <button onClick={() => setEditingExam(null)} className="text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase">Exam Name</label>
                  <input
                    type="text"
                    value={editingExam.name}
                    onChange={(e) => setEditingExam({ ...editingExam, name: e.target.value })}
                    className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase">Drive Badge</label>
                  <input
                    type="text"
                    value={editingExam.badge}
                    onChange={(e) => setEditingExam({ ...editingExam, badge: e.target.value })}
                    className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]"
                  />
                </div>
              </div>

              <RichTextEditor
                title="About Exam Markdown (Syllabus & Pattern)"
                value={editingExam.content || ''}
                onChange={(val) => setEditingExam({ ...editingExam, content: val })}
                placeholder="Write syllabus, pattern, and round details..."
              />
              <RichTextEditor
                title="Old Papers & PYQs Markdown"
                value={editingExam.oldPapers || ''}
                onChange={(val) => setEditingExam({ ...editingExam, oldPapers: val })}
                placeholder="Write old papers, PYQs, and memory questions..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#eae1da] dark:border-[#2b2d31]">
              <button onClick={() => setEditingExam(null)} className="px-4 py-2 rounded-full text-xs font-bold text-[#747878] dark:text-[#a6adbb]">Cancel</button>
              <button onClick={handleSaveEditedExam} className="px-5 py-2 rounded-full bg-purple-900 text-white font-bold text-xs uppercase tracking-wider">Save Exam Changes Live</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
