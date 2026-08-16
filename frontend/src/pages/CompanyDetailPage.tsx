import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router';
// Native Document Explorer View Enabled
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/company.service';
import { examService } from '@/services/exam.service';
import { dataStore, type ExamItem } from '@/services/dataStore';
import { PaperService } from '@/services/paper.service';
import { supabasePaymentService } from '@/services/supabasePaymentService';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import ContentRenderer from '@/components/ContentRenderer';
import { useTheme } from '@/contexts/ThemeContext';
import PaywallModal from '@/components/PaywallModal';
import DocumentExplorer from '@/components/DocumentExplorer';
import {
  Building2,
  Globe,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Heart,
  Edit3,
  XCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Maximize2,
  Bookmark,
  BookmarkCheck,
  Lock,
  Unlock
} from 'lucide-react';

type TabType = 'aboutCompany' | 'aboutExam' | 'oldPapers';

interface CompanyDetailPageProps {
  isOldPapersRoute?: boolean;
}

export default function CompanyDetailPage({ isOldPapersRoute }: CompanyDetailPageProps = {}) {
  const { slug = 'tcs' } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlExamId = searchParams.get('examId');
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const isAdmin = role === 'ADMIN';
  const queryClient = useQueryClient();

  const isDirectOldPapersUrl = !!isOldPapersRoute || (typeof window !== 'undefined' && window.location.pathname.endsWith('/oldpapers'));

  // Company Data from external API (dummy)
  const { data: company } = useQuery({
    queryKey: ['company', slug],
    queryFn: () => companyService.getCompanyBySlug(slug),
    enabled: !!slug,
    retry: 1,
  });

  // Exams from Supabase — live data with server-side payload redaction
  const { data: companyExams = [] } = useQuery({
    queryKey: ['live-exams', slug, user?.email],
    queryFn: () => examService.getExamsByCompany(slug, user?.email),
    enabled: !!slug,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Derive a CompanyItem-compatible shape from the Supabase company
  const currentCompanyStoreItem = company
    ? {
        id: company.id,
        name: company.name,
        slug: company.slug,
        description: company.description || `${company.name} conducts annual campus recruitment drives.`,
        industry: company.industry || 'IT Services & Consulting',
        companySize: company.companySize || 'Pan-India Recruitment Drive',
        headquarters: company.headquarters || 'India & Global',
        website: company.website,
        logoUrl: company.logoUrl,
        aboutCompany: company.aboutCompany || `### About ${company.name}\n\nAdd details here.`,
        isActive: company.isActive ?? true,
        createdAt: company.createdAt || new Date().toISOString(),
      }
    : {
        id: `c-${slug}`,
        name: slug.toUpperCase(),
        slug: slug,
        description: `${slug.toUpperCase()} conducts annual campus recruitment drives.`,
        industry: 'IT Services & Consulting',
        companySize: 'Pan-India Recruitment Drive',
        headquarters: 'India & Global',
        website: undefined,
        logoUrl: undefined,
        aboutCompany: `### About ${slug.toUpperCase()}\n\nAdd details here.`,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

  const companyName = currentCompanyStoreItem.name;

  const [selectedExamId, setSelectedExamId] = useState<string>('');

  // Keep selected exam valid if array changes or initializes, or load from URL searchParams
  useEffect(() => {
    if (companyExams.length > 0) {
      if (urlExamId && companyExams.some(e => e.id === urlExamId)) {
        if (selectedExamId !== urlExamId) {
          setSelectedExamId(urlExamId);
        }
      } else if (!selectedExamId || !companyExams.some(e => e.id === selectedExamId)) {
        setSelectedExamId(companyExams[0].id);
      }
    }
  }, [companyExams, urlExamId, selectedExamId]);

  const handleSelectExam = (examId: string) => {
    setSelectedExamId(examId);
    setSearchParams({ examId }, { replace: true });
  };

  const currentExam = companyExams.find((e) => e.id === selectedExamId) || companyExams[0];

  // Upvote State
  const [upvoteCount, setUpvoteCount] = useState<number>(70);
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);

  // Edit Company Header State
  const [showEditHeaderModal, setShowEditHeaderModal] = useState(false);
  const [headerForm, setHeaderForm] = useState({
    name: '',
    industry: '',
    headquarters: '',
    website: '',
    logoUrl: '',
    description: '',
  });

  // 3-Tab State
  const [activeTab, setActiveTab] = useState<TabType>(isDirectOldPapersUrl ? 'oldPapers' : 'aboutCompany');
  
  // Dynamic Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [aboutCompanyForm, setAboutCompanyForm] = useState('');
  const [examForm, setExamForm] = useState<Partial<ExamItem>>({});
  const [examSavedSuccess, setExamSavedSuccess] = useState(false);
  const [isSyncingDoc, setIsSyncingDoc] = useState(false);



  // Paywall & Monetization State
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [hasOldPapersAccess, setHasOldPapersAccess] = useState<boolean>(false);
  const [isPublicExamToggling, setIsPublicExamToggling] = useState(false);

  // Live Supabase entitlement check — re-runs whenever the exam changes
  const checkLiveAccess = useCallback(async () => {
    if (!currentExam) { setHasOldPapersAccess(false); return; }
    if (isAdmin) { setHasOldPapersAccess(true); return; }
    // Fast path: public exam flag
    if (currentExam.isPublicExam) { setHasOldPapersAccess(true); return; }
    const userEmail = user?.email;
    if (!userEmail) { setHasOldPapersAccess(false); return; }
    try {
      const granted = await supabasePaymentService.verifyEntitlementOnSupabase(userEmail, currentExam.id);
      setHasOldPapersAccess(granted);
    } catch {
      // Fallback to local store only on network failure
      const fallback = dataStore.hasAccessToOldPapers(currentExam.id, role, userEmail);
      setHasOldPapersAccess(fallback);
    }
  }, [currentExam?.id, isAdmin, role, user?.email]);

  useEffect(() => { checkLiveAccess(); }, [checkLiveAccess]);

  // Watermark text for document viewer
  const watermarkText = user?.email ? `${user.email} • PrepUnite` : 'PrepUnite Confidential';

  // Bookmark State
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    if (currentExam) {
      setIsBookmarked(dataStore.isExamBookmarked(currentExam.id));
    }
  }, [currentExam]);

  const handleToggleBookmark = () => {
    if (!currentExam) return;
    const newStatus = dataStore.toggleBookmarkExam(currentExam.id);
    setIsBookmarked(newStatus);
  };

  // Fullscreen Dashboard State & Theme
  const [isFullscreenDoc, setIsFullscreenDoc] = useState<boolean>(isDirectOldPapersUrl);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    if (isDirectOldPapersUrl) {
      setActiveTab('oldPapers');
      setIsFullscreenDoc(true);
    }
  }, [isDirectOldPapersUrl]);

  // Security Protection for Non-Admins: Protect content from copy/cut/print while allowing text editing
  useEffect(() => {
    // If current user is Admin, never block copy/paste/cut anywhere
    if (isAdmin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        !!target.closest('[contenteditable="true"]') ||
        !!target.closest('.tiptap-wrapper')
      );

      // Only block if target is NOT an editable element
      if (!isEditable) {
        const isCtrl = e.ctrlKey || e.metaKey;
        const key = e.key.toLowerCase();

        if (isCtrl && (key === 'c' || key === 'x' || key === 'v' || key === 'p' || key === 's' || key === 'u')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isAdmin]);


  const forceRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['company', slug] });
    queryClient.invalidateQueries({ queryKey: ['live-companies'] });
    queryClient.invalidateQueries({ queryKey: ['live-exams', slug] });
  };

  // --- HEADER ACTIONS ---
  const handleOpenEditHeaderModal = () => {
    setHeaderForm({
      name: currentCompanyStoreItem.name,
      industry: currentCompanyStoreItem.industry || 'IT Services',
      headquarters: currentCompanyStoreItem.headquarters || 'Pan-India',
      website: currentCompanyStoreItem.website || '',
      logoUrl: currentCompanyStoreItem.logoUrl || '',
      description: currentCompanyStoreItem.description || '',
    });
    setShowEditHeaderModal(true);
  };

  const handleSaveHeaderProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await companyService.updateCompany(currentCompanyStoreItem.slug || slug, {
        name: headerForm.name,
        industry: headerForm.industry,
        headquarters: headerForm.headquarters,
        website: headerForm.website,
        logoUrl: headerForm.logoUrl || undefined,
        description: headerForm.description,
      });
      setShowEditHeaderModal(false);
      queryClient.invalidateQueries({ queryKey: ['company', slug] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      forceRefreshData();
    } catch (err: any) {
      alert(`Failed to save company header to Supabase: ${err.message || err}`);
    }
  };

  // --- EXAM ACTIONS ---
  const handleAddNewExam = async () => {
    try {
      const created = await examService.createExam({
        companySlug: slug,
        name: 'New Exam Module',
        badge: 'Draft',
        content: '### New Exam Syllabus\n\nWrite details here...',
        oldPapers: '### Old Papers\n\nWrite old papers here...',
      });
      setSelectedExamId(created.id);
      setActiveTab('aboutExam');
      setExamForm(created);
      setIsEditing(true);
      queryClient.invalidateQueries({ queryKey: ['live-exams', slug] });
      forceRefreshData();
    } catch (err: any) {
      alert(`Failed to create exam in Supabase: ${err.message || err}`);
    }
  };

  const handleOpenEdit = () => {
    // For oldPapers tab, admin editing is handled inside DocumentExplorer itself.
    // Only open the markdown editor for aboutCompany and aboutExam tabs.
    if (activeTab === 'aboutCompany') {
      setAboutCompanyForm(currentCompanyStoreItem.aboutCompany || '');
      setIsEditing(true);
    } else if (activeTab === 'aboutExam' && currentExam) {
      setExamForm(currentExam);
      setIsEditing(true);
    }
    // oldPapers: do nothing here — DocumentExplorer has its own "Manage" toggle
  };

  const handleSaveContent = async () => {
    try {
      if (activeTab === 'aboutCompany') {
        await companyService.updateCompany(currentCompanyStoreItem.slug || slug, {
          aboutCompany: aboutCompanyForm
        });
      } else if (activeTab === 'aboutExam' && currentExam && examForm) {
        await examService.updateExam(currentExam.id, {
          name: examForm.name,
          badge: examForm.badge,
          content: examForm.content
        });
      } else if (activeTab === 'oldPapers' && currentExam && examForm) {
        await examService.updateExam(currentExam.id, {
          oldPapers: examForm.oldPapers
        });
      }
      
      setIsEditing(false);
      setExamSavedSuccess(true);
      setTimeout(() => setExamSavedSuccess(false), 3000);
      queryClient.invalidateQueries({ queryKey: ['company', slug] });
      queryClient.invalidateQueries({ queryKey: ['live-exams', slug] });
      forceRefreshData();
    } catch (err: any) {
      alert(`Failed to save content to Supabase: ${err.message || err}`);
    }
  };

  const handleDeleteExam = async () => {
    if (currentExam && confirm("Are you sure you want to delete this exam module?")) {
      try {
        await examService.deleteExam(currentExam.id);
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ['live-exams', slug] });
        forceRefreshData();
      } catch (err: any) {
        alert(`Failed to delete exam from Supabase: ${err.message || err}`);
      }
    }
  };

  // Admin: toggle the entire exam between Public (free) and Paid (locked)
  const handleTogglePublicExam = async () => {
    if (!currentExam || !isAdmin) return;
    const newValue = !currentExam.isPublicExam;
    setIsPublicExamToggling(true);

    // 1. Optimistic instant UI update across all active queries
    queryClient.setQueriesData({ queryKey: ['live-exams'] }, (old: any) => {
      if (Array.isArray(old)) {
        return old.map((ex: ExamItem) => ex.id === currentExam.id ? { ...ex, isPublicExam: newValue } : ex);
      }
      return old;
    });

    try {
      // 2. Persist to Supabase Database & dataStore
      await examService.updateExam(currentExam.id, { isPublicExam: newValue });
      dataStore.updateExam(currentExam.id, { isPublicExam: newValue });
      
      // 3. Update local access state
      if (newValue) {
        setHasOldPapersAccess(true);
      } else {
        await checkLiveAccess();
      }

      // 4. Invalidate to ensure background sync is completely aligned
      queryClient.invalidateQueries({ queryKey: ['live-exams'] });
      forceRefreshData();
    } catch (err: any) {
      alert(`Failed to update exam access mode: ${err.message || err}`);
      // Revert on error
      queryClient.invalidateQueries({ queryKey: ['live-exams'] });
    } finally {
      setIsPublicExamToggling(false);
    }
  };

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvoteCount(upvoteCount - 1);
      setIsUpvoted(false);
    } else {
      setUpvoteCount(upvoteCount + 1);
      setIsUpvoted(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-[#747878] dark:text-[#a6adbb]">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">Home</Link>
          <span>»</span>
          <Link to="/companies" className="hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">Companies</Link>
          <span>»</span>
          <span className="text-[#1f1b17] dark:text-[#e3e3e3] font-bold">{companyName}</span>
          {currentExam && (
            <>
              <span>»</span>
              <span className="text-[#1f1b17] dark:text-[#e3e3e3] font-bold">{currentExam.name}</span>
            </>
          )}
        </div>

        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#444748] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Companies
        </Link>
      </div>

      {/* Main Header Card with ADMIN EDIT CONTROL */}
      <div className="bg-[#f6ece6] dark:bg-[#1e1f22] border border-[#e2d8d2] dark:border-[#2b2d31] rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4 relative transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-[16px] bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[#0284c7] font-black text-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              {currentCompanyStoreItem.logoUrl ? (
                <img src={currentCompanyStoreItem.logoUrl} alt={companyName} className="w-full h-full object-contain p-1" />
              ) : (
                companyName.charAt(0)
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight">
                  {companyName}
                </h1>
                <span className="bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 text-[#00714d] dark:text-[#6cf8bb] border border-[#00714d]/20 dark:border-[#6cf8bb]/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {currentCompanyStoreItem.industry || 'IT Services'}
                </span>
                <span className="bg-[#ffffff] dark:bg-[#141517] text-[#1f1b17] dark:text-[#e3e3e3] border border-[#c4c7c7] dark:border-[#383a40] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {companyExams.length} Active Exams
                </span>
              </div>
              <p className="text-[#444748] dark:text-[#a6adbb] text-xs font-sans">
                {currentCompanyStoreItem.description || 'Official Exam Patterns, Memory Papers, and Offer Roles'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={handleOpenEditHeaderModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-300" />
                <span>Edit Company Header</span>
              </button>
            )}

            <button
              onClick={handleUpvote}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isUpvoted
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-[#ffffff] dark:bg-[#1e1f22] text-[#1f1b17] dark:text-[#e3e3e3] border-[#c4c7c7] dark:border-[#383a40] hover:border-rose-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current text-white' : 'text-rose-500'}`} />
              <span>{upvoteCount} Upvotes</span>
            </button>

            {currentCompanyStoreItem.website && (
              <a
                href={currentCompanyStoreItem.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ffffff] dark:bg-[#1e1f22] hover:bg-[#eae1da] dark:hover:bg-[#2b2d31] text-[#1f1b17] dark:text-[#e3e3e3] text-xs font-bold uppercase tracking-wider rounded-full border border-[#c4c7c7] dark:border-[#383a40] transition-colors shrink-0"
              >
                <Globe className="w-3.5 h-3.5 text-[#006c49] dark:text-[#6cf8bb]" />
                <span>Site</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>
        </div>

        {/* Horizontal Active Exam Module Pills */}
        <div className="pt-4 border-t border-[#e2d8d2] dark:border-[#2b2d31] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider block">
              Select Active Exam Module:
            </span>
            {isAdmin && (
              <button
                onClick={handleAddNewExam}
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200"
              >
                <Plus className="w-3 h-3" /> Add Exam
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {companyExams.map((exam) => {
              const isSelected = exam.id === selectedExamId;
              return (
                <button
                  key={exam.id}
                  onClick={() => {
                    handleSelectExam(exam.id);
                    setIsEditing(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    isSelected
                      ? 'bg-[#000000] dark:bg-[#e3e3e3] text-white dark:text-[#141517] border-[#000000] dark:border-[#e3e3e3] shadow-sm ring-1 ring-white dark:ring-white ring-offset-1 ring-offset-[#fff8f5] dark:ring-offset-[#141517]'
                      : 'bg-[#ffffff] dark:bg-[#1e1f22] text-[#1f1b17] dark:text-[#e3e3e3] border-[#c4c7c7] dark:border-[#383a40] hover:border-[#006c49] dark:hover:border-[#6cf8bb]'
                  }`}
                >
                  <GraduationCap className={`w-3.5 h-3.5 ${isSelected ? 'text-[#6cf8bb] dark:text-[#006c49]' : 'text-[#006c49] dark:text-[#6cf8bb]'}`} />
                  <span>{exam.name}</span>
                </button>
              );
            })}
            {companyExams.length === 0 && (
              <span className="text-xs text-[#747878] dark:text-[#a6adbb]">No exams configured yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Single Page View for Exam */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <main className="lg:col-span-9 bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[24px] p-6 shadow-sm min-h-[500px] transition-colors">
          
          {currentExam ? (
            <div className="space-y-6">
              
              {/* Active Exam Header Bar with Bookmark Button */}
              <div className="flex items-center justify-between pb-4 border-b border-[#eae1da] dark:border-[#2b2d31]">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3]">
                    {activeTab === 'aboutCompany' ? `${companyName} Overview` : currentExam.name}
                  </h2>
                  {activeTab !== 'aboutCompany' && (
                    <span className="inline-block mt-1 bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 text-[#00714d] dark:text-[#6cf8bb] border border-[#00714d]/20 dark:border-[#6cf8bb]/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {currentExam.badge}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2.5">
                  {currentExam && (
                    <button
                      onClick={handleToggleBookmark}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all shadow-xs ${
                        isBookmarked
                          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                          : isDarkMode
                          ? 'bg-[#2b2d31] hover:bg-[#383a40] text-[#e3e3e3] border border-[#383a40]'
                          : 'bg-[#ffffff] hover:bg-[#e3e8ef] text-[#1f1b17] border border-[#eae1da]'
                      }`}
                      title={isBookmarked ? "Remove from profile bookmarks" : "Save exam drive to profile bookmarks"}
                    >
                      {isBookmarked ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>Saved to Profile</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4 text-[#747878] dark:text-[#a6adbb]" />
                          <span>Bookmark Exam</span>
                        </>
                      )}
                    </button>
                  )}

                  {isAdmin && !isEditing && activeTab !== 'oldPapers' && (
                    <button
                      onClick={handleOpenEdit}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all shrink-0"
                    >
                      <Edit3 className="w-4 h-4 text-purple-300" />
                      <span>Edit {activeTab === 'aboutCompany' ? 'Company Details' : 'Exam Details'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 3-TAB SELECTOR & ACTIONS */}
              {!isEditing && (
                <div className="flex items-center justify-between border-b border-[#eae1da] dark:border-[#2b2d31]">
                  <div className="flex items-center gap-4">
                    {[
                      { id: 'aboutCompany', label: 'About Company' },
                      { id: 'aboutExam', label: 'About Exam' },
                      { id: 'oldPapers', label: 'Old Papers' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                          activeTab === tab.id
                            ? 'border-[#006c49] dark:border-[#6cf8bb] text-[#006c49] dark:text-[#6cf8bb]'
                            : 'border-transparent text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {activeTab === 'oldPapers' && (
                      <button
                        onClick={() => {
                          if (isAdmin && currentExam) {
                            setExamForm(currentExam);
                          }
                          setIsFullscreenDoc(true);
                          navigate(`/companies/${slug}/oldpapers`);
                        }}
                        className="inline-flex items-center gap-1.5 pb-2 text-xs font-bold text-[#0284c7] hover:text-[#0369a1] transition-colors"
                      >
                        <Maximize2 className="w-4 h-4" />
                        Old Papers Doc Dashboard (Fullscreen)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {examSavedSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-[12px] text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Changes saved successfully!</span>
                </div>
              )}


              {/* Sub-Tabs strip for Old Papers */}



              {/* Editable Markdown Area OR Rendered View */}
              {isAdmin && isEditing ? (
                <div className="space-y-4 bg-[#f6ece6]/60 dark:bg-[#141517]/60 p-5 rounded-[20px] border border-[#e2d8d2] dark:border-[#383a40] animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider block">
                      Edit {activeTab === 'aboutCompany' ? 'Company' : activeTab === 'aboutExam' ? 'Exam' : 'Papers'} Content (Markdown)
                    </label>
                    {activeTab !== 'aboutCompany' && (
                      <button onClick={handleDeleteExam} className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 flex items-center gap-1">
                        <Trash2 className="w-3.5 h-3.5" /> Delete Entire Exam Module
                      </button>
                    )}
                  </div>
                  
                  {activeTab === 'aboutExam' && (
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase block mb-1">Exam Name</label>
                        <input 
                          type="text" 
                          value={examForm.name || ''} 
                          onChange={(e) => setExamForm({...examForm, name: e.target.value})}
                          className="w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase block mb-1">Badge Text</label>
                        <input 
                          type="text" 
                          value={examForm.badge || ''} 
                          onChange={(e) => setExamForm({...examForm, badge: e.target.value})}
                          className="w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3]" 
                        />
                      </div>
                    </div>
                  )}

                  {/* Rich Text Editor for Content Editing */}
                  {activeTab === 'aboutCompany' ? (
                    <RichTextEditor
                      title={`Edit About ${companyName}`}
                      value={aboutCompanyForm}
                      onChange={setAboutCompanyForm}
                      placeholder="Write company overview, hiring process, and culture in Markdown..."
                    />
                  ) : activeTab === 'aboutExam' ? (
                    <RichTextEditor
                      title={`Edit ${examForm.name || 'Exam'} Syllabus & Pattern`}
                      value={examForm.content || ''}
                      onChange={(val) => setExamForm({ ...examForm, content: val })}
                      placeholder="Write exam syllabus, round breakdown, and selection criteria in Markdown..."
                    />
                  ) : (
                    <RichTextEditor
                      title={`Edit Old Papers & Memory Questions`}
                      value={examForm.oldPapers || ''}
                      onChange={(val) => setExamForm({ ...examForm, oldPapers: val })}
                      placeholder="Write old questions, previous year papers, and solutions in Markdown..."
                    />
                  )}
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] text-xs font-bold uppercase tracking-wider"
                    >
                      Close Editor
                    </button>
                    <button
                      onClick={handleSaveContent}
                      className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : activeTab === 'oldPapers' ? (
                <div className="space-y-3">
                  {/* Admin: Exam-Level Access Mode Toggle */}
                  {isAdmin && currentExam && (
                    <div className="flex items-center justify-between bg-[#f6ece6]/60 dark:bg-[#141517]/60 border border-[#e2d8d2] dark:border-[#383a40] rounded-[14px] px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {currentExam.isPublicExam ? (
                          <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                        )}
                        <span className="text-[11px] font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider">
                          Exam Access Mode:
                        </span>
                        <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
                          currentExam.isPublicExam
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {currentExam.isPublicExam ? 'PUBLIC (Free for all)' : 'PAID (Per-section paywall)'}
                        </span>
                      </div>
                      <button
                        onClick={handleTogglePublicExam}
                        disabled={isPublicExamToggling}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                          currentExam.isPublicExam
                            ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 hover:bg-rose-200'
                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'
                        } disabled:opacity-50`}
                      >
                        {isPublicExamToggling ? 'Saving...' : (currentExam.isPublicExam ? '🔒 Make Paid' : '🔓 Make Public')}
                      </button>
                    </div>
                  )}
                  <DocumentExplorer
                    examName={currentExam?.name || 'Recruitment Drive'}
                    companyName={companyName}
                    tabs={currentExam?.paperTabs || []}
                    hasAccess={hasOldPapersAccess}
                    isAdmin={isAdmin}
                    isPublicExam={currentExam?.isPublicExam ?? false}
                    watermarkText={watermarkText}
                    onOpenPaywall={() => setShowPaywallModal(true)}
                    onUpdateTabs={async (updatedTabs) => {
                      if (currentExam) {
                        await PaperService.savePaperTabNodes(currentExam.id, updatedTabs);
                        queryClient.invalidateQueries({ queryKey: ['live-exams', slug] });
                      }
                    }}
                  />
                </div>
              ) : (
                <ContentRenderer
                  content={
                    activeTab === 'aboutCompany'
                      ? (currentCompanyStoreItem.aboutCompany || '')
                      : (currentExam.content || '')
                  }
                  emptyText="No details added yet."
                  className="prose-headings:font-display prose-h3:text-[#006c49] dark:prose-h3:text-[#6cf8bb]"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#747878] space-y-3">
              <Building2 className="w-12 h-12 opacity-50" />
              <p className="font-bold text-sm">No exam modules found for this company.</p>
              {isAdmin && (
                <button onClick={handleAddNewExam} className="text-purple-700 underline text-xs font-bold">
                  Create the first exam module
                </button>
              )}
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[24px] p-4 shadow-sm space-y-3 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <h4 className="font-display text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider">
                Recent Questions
              </h4>
              <span className="text-[10px] font-bold text-[#00714d] dark:text-[#6cf8bb] bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 px-2 py-0.5 rounded-full">Live</span>
            </div>

            <div className="space-y-2.5">
              {[
                { q: 'Array Subarray Difference', type: 'Coding' },
                { q: 'DBMS INNER JOIN vs LEFT JOIN', type: 'SQL' },
                { q: 'Clock Angle at 3:25', type: 'Aptitude' },
                { q: 'Process vs Thread Memory', type: 'OS Core' },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-[#f6ece6]/60 dark:bg-[#141517]/60 rounded-[12px] border border-[#e2d8d2] dark:border-[#383a40] space-y-1 hover:border-[#006c49]/40 dark:hover:border-[#6cf8bb]/40 transition-all cursor-pointer">
                  <span className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] block leading-snug">{item.q}</span>
                  <span className="text-[10px] text-[#747878] dark:text-[#a6adbb] font-semibold">{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#f6ece6] dark:bg-[#1e1f22] border border-[#e2d8d2] dark:border-[#2b2d31] rounded-[24px] p-4 shadow-sm space-y-3 transition-colors">
            <h4 className="font-display text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wider pb-2 border-b border-[#e2d8d2] dark:border-[#2b2d31]">
              Discover More
            </h4>
            <div className="space-y-1">
              {[
                'Arithmetic Aptitude',
                'Data Interpretation',
                'Verbal Ability',
                'Logical Reasoning',
                'Pseudocode Practice',
                'Placement Papers',
              ].map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-[10px] hover:bg-[#ffffff] dark:hover:bg-[#2b2d31] text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] transition-all cursor-pointer">
                  <span>{cat}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#747878] dark:text-[#a6adbb]" />
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

      {/* ✏️ MODAL: EDIT COMPANY HEADER PROFILE */}
      {showEditHeaderModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#eae1da] rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da]">
              <h3 className="font-display text-lg font-bold text-[#1f1b17]">Edit Company Header Profile</h3>
              <button onClick={() => setShowEditHeaderModal(false)} className="text-[#747878] hover:text-[#1f1b17]"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveHeaderProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] uppercase block">Company Name *</label>
                <input type="text" required value={headerForm.name} onChange={(e) => setHeaderForm({ ...headerForm, name: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs font-bold text-[#1f1b17]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] uppercase block">Industry</label>
                  <input type="text" value={headerForm.industry} onChange={(e) => setHeaderForm({ ...headerForm, industry: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] uppercase block">Headquarters</label>
                  <input type="text" value={headerForm.headquarters} onChange={(e) => setHeaderForm({ ...headerForm, headquarters: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] uppercase block">Official Website URL</label>
                <input type="url" value={headerForm.website} onChange={(e) => setHeaderForm({ ...headerForm, website: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] uppercase block">Logo Image URL</label>
                <input type="url" value={headerForm.logoUrl} onChange={(e) => setHeaderForm({ ...headerForm, logoUrl: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#747878] uppercase block">Header Short Overview</label>
                <textarea rows={2} value={headerForm.description} onChange={(e) => setHeaderForm({ ...headerForm, description: e.target.value })} className="w-full bg-[#f6ece6] rounded-xl p-2.5 text-xs text-[#1f1b17]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEditHeaderModal(false)} className="px-4 py-2 text-xs font-bold text-[#747878]">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">Save Header Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 📄 GOOGLE DOCS STYLE FULLSCREEN DASHBOARD (WITH NIGHT MODE & URL ROUTING) */}
      {isFullscreenDoc && currentExam && (
        <div 
          className={`fixed inset-0 z-[100] flex flex-col overflow-hidden animate-fadeIn font-sans ${
            isDarkMode ? 'bg-[#141517] text-[#e3e3e3]' : 'bg-[#f8f9fa] text-[#1f1f1f]'
          }`}
        >
          {/* Top Bar Header */}
          <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 h-16 shadow-none transition-colors ${
            isDarkMode ? 'bg-[#1e1f22] border-[#2b2d31] text-[#e3e3e3]' : 'bg-[#f0f4f9] border-[#e1e3e1] text-[#1f1f1f]'
          }`}>
            <div className="flex items-center gap-3">


              <div className={`w-9 h-9 rounded font-black text-lg flex items-center justify-center shrink-0 ${
                isDarkMode ? 'bg-[#004a77] text-[#c2e7ff]' : 'bg-[#c2e7ff] text-[#001d35]'
              }`}>
                {currentCompanyStoreItem.logoUrl ? (
                  <img src={currentCompanyStoreItem.logoUrl} alt={companyName} loading="lazy" decoding="async" className="w-full h-full object-contain p-0.5" />
                ) : (
                  companyName.charAt(0)
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${isDarkMode ? 'text-[#f0f4f9]' : 'text-[#1f1f1f]'}`}>
                    {currentCompanyStoreItem.name} - Old Papers
                  </span>
                  <span className="text-xs text-[#747878]">•</span>
                  <span className="font-semibold text-xs text-[#38bdf8]">Official Placement Papers</span>
                </div>
                <div className={`flex items-center gap-2 text-[11px] ${isDarkMode ? 'text-[#a6adbb]' : 'text-[#444746]'}`}>
                  <span>Official Exam Dashboard</span>
                  <span>•</span>
                  <span className="text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {isAdmin ? 'Admin Live Editor Mode' : 'Student Reader Mode'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={handleOpenEdit}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-900 hover:bg-purple-800 text-white font-semibold text-xs transition-colors shadow-sm"
                  title="Open Admin Rich Text Editor"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Content (Rich Text)</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsFullscreenDoc(false);
                  navigate(`/companies/${slug}`);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs transition-colors ${
                  isDarkMode ? 'bg-[#2b2d31] hover:bg-[#383a40] text-[#f0f4f9]' : 'bg-[#e3e8ef] hover:bg-[#d5dbe4] text-[#1f1f1f]'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Exit Fullscreen
              </button>
            </div>
          </div>

          {/* Main Content Area: Native DocumentExplorer */}
          <div className="flex-1 flex overflow-hidden w-full h-full p-4">
            <DocumentExplorer
              examName={currentExam?.name || 'Recruitment Drive'}
              companyName={companyName}
              tabs={currentExam?.paperTabs || []}
              hasAccess={hasOldPapersAccess}
              isAdmin={isAdmin}
              isPublicExam={currentExam?.isPublicExam ?? false}
              watermarkText={watermarkText}
              onOpenPaywall={() => setShowPaywallModal(true)}
              onUpdateTabs={async (updatedTabs) => {
                if (currentExam) {
                  await PaperService.savePaperTabNodes(currentExam.id, updatedTabs);
                  queryClient.invalidateQueries({ queryKey: ['live-exams', slug] });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* 🔐 PAYWALL & MONETIZATION CHECKOUT MODAL */}
      {currentExam && (
        <PaywallModal
          isOpen={showPaywallModal}
          onClose={() => setShowPaywallModal(false)}
          examId={currentExam.id}
          examName={currentExam.name}
          companyName={companyName}
          userEmail={user?.email}
          onUnlocked={() => {
            checkLiveAccess();
            queryClient.invalidateQueries();
          }}
        />
      )}
    </div>
  );
}
