import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { ExamWithCompany } from '@/services/dataStore';
import { dataStore } from '@/services/dataStore';
import { examService } from '@/services/exam.service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Building2, Edit3, Trash2, ArrowRight, Bookmark, BookmarkCheck, Eye, EyeOff } from 'lucide-react';

interface ExamCardProps {
  exam: ExamWithCompany;
  onEdit?: (exam: ExamWithCompany) => void;
  onDelete?: (examId: string) => void;
  onToggleVisibility?: (examId: string, isHidden: boolean) => void;
}

export default function ExamCard({ exam, onEdit, onDelete, onToggleVisibility }: ExamCardProps) {
  const { role } = useAuth();
  const { confirmModal } = useToast();
  const isAdmin = role === 'ADMIN';

  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => dataStore.isExamBookmarked(exam.id));
  const [localIsHidden, setLocalIsHidden] = useState<boolean>(Boolean(exam.isHidden));

  useEffect(() => {
    setLocalIsHidden(Boolean(exam.isHidden));
  }, [exam.isHidden]);

  useEffect(() => {
    setIsBookmarked(dataStore.isExamBookmarked(exam.id));
    const handleChanged = () => {
      setIsBookmarked(dataStore.isExamBookmarked(exam.id));
    };
    window.addEventListener('prepunite_bookmarks_changed', handleChanged);
    return () => window.removeEventListener('prepunite_bookmarks_changed', handleChanged);
  }, [exam.id]);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newStatus = dataStore.toggleBookmarkExam(exam.id);
    setIsBookmarked(newStatus);
  };

  const handleToggleHide = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextHidden = !localIsHidden;
    setLocalIsHidden(nextHidden);
    if (onToggleVisibility) {
      onToggleVisibility(exam.id, nextHidden);
    } else {
      try {
        await examService.toggleExamVisibility(exam.id, nextHidden);
        window.dispatchEvent(new CustomEvent('prepunite_exams_changed'));
      } catch (err) {
        console.error('Failed to toggle exam visibility:', err);
        setLocalIsHidden(!nextHidden);
      }
    }
  };

  // Resilient logo resolution: use exam's companyLogoUrl or fallback to dataStore by slug
  const effectiveLogo =
    exam.companyLogoUrl ||
    dataStore.getCompanies().find((c) => (c.slug || '').toLowerCase() === (exam.companySlug || '').toLowerCase())?.logoUrl;

  const isHidden = localIsHidden || exam.isCompanyHidden;

  return (
    <div
      className={`group relative bg-white dark:bg-[#141414] border rounded-lg p-4 transition-all duration-200 hover:border-[#FD4A32] dark:hover:border-[#FD4A32] hover:shadow-md hover:shadow-[#FD4A32]/10 flex flex-col justify-between ${
        isHidden
          ? 'border-dashed border-amber-400 dark:border-amber-600/60 bg-amber-500/[0.02] dark:bg-amber-950/[0.05]'
          : 'border-[#E9ECEF] dark:border-[#242424]'
      }`}
    >
      {/* Top Right Action Overlay Bar */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 pointer-events-none">
        <button
          onClick={handleToggleBookmark}
          className={`pointer-events-auto p-1.5 rounded-md border shadow-xs transition-all cursor-pointer ${
            isBookmarked
              ? 'bg-amber-500 border-amber-600 text-white'
              : 'bg-white dark:bg-[#1C1C1C] border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
          }`}
          title={isBookmarked ? 'Remove from dashboard bookmarks' : 'Save exam drive to dashboard'}
        >
          {isBookmarked ? <BookmarkCheck className="w-3 h-3 fill-white" /> : <Bookmark className="w-3 h-3" />}
        </button>

        {isAdmin && (
          <div className="pointer-events-auto flex items-center gap-1 bg-white/95 dark:bg-[#1C1C1C]/95 p-0.5 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] shadow-xs">
            <button
              onClick={handleToggleHide}
              className={`p-1 rounded transition-colors cursor-pointer ${
                localIsHidden
                  ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title={localIsHidden ? `Publish "${exam.name}" to students` : `Hide "${exam.name}" (Draft Mode)`}
            >
              {localIsHidden ? <EyeOff className="w-3 h-3 text-amber-500" /> : <Eye className="w-3 h-3" />}
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(exam);
                }}
                className="p-1 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors cursor-pointer"
                title="Edit Exam"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirmed = await confirmModal({
                    title: 'Delete Exam',
                    message: `Are you sure you want to delete "${exam.name}"? This action cannot be undone.`,
                    confirmText: 'Delete',
                    isDanger: true,
                  });
                  if (confirmed) {
                    onDelete(exam.id);
                  }
                }}
                className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors cursor-pointer"
                title="Delete Exam"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Logo + Title Hero Area — flat, no nested box */}
      <div className="relative flex flex-col items-center justify-center min-h-[160px] space-y-2">
        {isHidden && (
          <div className="absolute top-0 left-0 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/90 text-white text-[9px] font-display font-extrabold uppercase tracking-wider shadow-xs">
            <EyeOff className="w-2.5 h-2.5" />
            <span>{exam.isCompanyHidden ? 'Company Hidden' : 'Exam Hidden'}</span>
          </div>
        )}

        {/* Center Logo */}
        <div className="flex items-center justify-center w-full h-24 sm:h-28 overflow-hidden">
          {effectiveLogo ? (
            <img
              src={effectiveLogo}
              alt={exam.companyName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-md bg-[#FD4A32]/10 border border-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center font-display text-2xl font-black group-hover:scale-105 transition-transform duration-200">
              {exam.companyName.charAt(0)}
            </div>
          )}
        </div>

        {/* Exam Title */}
        <h3 className="font-display text-xs sm:text-sm font-bold text-[#121417] dark:text-[#FFFFFF] tracking-tight group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32] transition-colors line-clamp-2 text-center">
          {exam.name}
        </h3>
      </div>

      {/* Bottom Footer Section */}
      <div className="pt-3 px-0.5 flex items-center justify-between gap-2.5 border-t border-[#E9ECEF] dark:border-[#242424] mt-3">
        {/* Left: Company name & Industry */}
        <div className="min-w-0 flex-1">
          <div className="text-xs font-display font-bold text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32] transition-colors truncate">
            {exam.companyName}
          </div>
          <div className="text-[10px] text-[#868E96] dark:text-[#555555] truncate flex items-center gap-1 mt-0.5 font-sans">
            <Building2 className="w-3 h-3 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
            <span>{exam.companyIndustry || 'IT & Services'}</span>
          </div>
        </div>

        {/* Right: Papers Button */}
        <Link
          to={`/companies/${exam.companySlug}/oldpapers?examId=${exam.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#121417] dark:bg-white text-white dark:text-black hover:bg-[#23272f] dark:hover:bg-[#e6e6e6] font-display font-bold text-[10px] uppercase tracking-wider transition-colors shrink-0"
          title={`View Old Papers for ${exam.name}`}
        >
          <span>Papers</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>
    </div>
  );
}
