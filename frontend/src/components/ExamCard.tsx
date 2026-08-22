import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { ExamWithCompany } from '@/services/dataStore';
import { dataStore } from '@/services/dataStore';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Edit3, Trash2, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';

interface ExamCardProps {
  exam: ExamWithCompany;
  onEdit?: (exam: ExamWithCompany) => void;
  onDelete?: (examId: string) => void;
}

export default function ExamCard({ exam, onEdit, onDelete }: ExamCardProps) {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => dataStore.isExamBookmarked(exam.id));

  useEffect(() => {
    setIsBookmarked(dataStore.isExamBookmarked(exam.id));
  }, [exam.id]);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newStatus = dataStore.toggleBookmarkExam(exam.id);
    setIsBookmarked(newStatus);
  };

  return (
    <div className="group relative bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg p-4 transition-all duration-200 hover:border-[#121417] dark:hover:border-[#383838] hover:shadow-sm flex flex-col justify-between">
      {/* Top Right Action Overlay Bar */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 pointer-events-none">
        <button
          onClick={handleToggleBookmark}
          className={`pointer-events-auto p-1.5 rounded-md border shadow-xs transition-all ${
            isBookmarked
              ? 'bg-amber-500 border-amber-600 text-white'
              : 'bg-white dark:bg-[#1C1C1C] border-[#E9ECEF] dark:border-[#2E2E2E] text-[#868E96] dark:text-[#555555] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-3 h-3 fill-white" />
          ) : (
            <Bookmark className="w-3 h-3" />
          )}
        </button>

        {isAdmin && (
          <div className="pointer-events-auto flex items-center gap-1 bg-white/95 dark:bg-[#1C1C1C]/95 p-0.5 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] shadow-xs">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(exam);
                }}
                className="p-1 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
                title="Edit Exam"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete ${exam.name}?`)) {
                    onDelete(exam.id);
                  }
                }}
                className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"
                title="Delete Exam"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Inner Hero Card Container */}
      <div className="relative rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] p-3 flex flex-col items-center justify-center min-h-[160px] overflow-hidden border border-[#E9ECEF] dark:border-[#242424] space-y-2">
        {/* Exam Title */}
        <h3 className="font-display text-xs sm:text-sm font-bold text-[#121417] dark:text-[#FFFFFF] tracking-tight group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32] transition-colors line-clamp-2 text-center z-10">
          {exam.name}
        </h3>

        {/* Center Main Visual Logo */}
        <div className="my-auto flex items-center justify-center w-full h-24 sm:h-28 rounded-md border border-[#E9ECEF] dark:border-[#242424] overflow-hidden bg-white dark:bg-[#141414]">
          {exam.companyLogoUrl ? (
            <img
              src={exam.companyLogoUrl}
              alt={exam.companyName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center gap-1.5 group-hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 rounded-md bg-[#F1F3F5] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] text-[#121417] dark:text-[#FFFFFF] flex items-center justify-center font-display text-lg font-black">
                {exam.companyName.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="pt-3 px-0.5 flex items-center justify-between gap-2.5 border-t border-[#E9ECEF] dark:border-[#242424] mt-3">
        {/* Left: Handle & Industry Metadata */}
        <div className="min-w-0 flex-1">
          <div className="text-xs font-display font-bold text-[#121417] dark:text-[#FFFFFF] truncate">
            {exam.companyName}
          </div>
          <div className="text-[10px] text-[#868E96] dark:text-[#555555] truncate flex items-center gap-1 mt-0.5 font-sans">
            <Building2 className="w-3 h-3 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
            <span>{exam.companyIndustry || 'IT & Services'}</span>
          </div>
        </div>

        {/* Right: Sharp Button */}
        <Link
          to={`/companies/${exam.companySlug}/oldpapers?examId=${exam.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#121417] dark:bg-white text-white dark:text-black hover:bg-[#FD4A32] dark:hover:bg-[#FD4A32] font-display font-bold text-[10px] uppercase tracking-wider transition-colors shrink-0"
          title={`View Old Papers for ${exam.name}`}
        >
          <span>Papers</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>
    </div>
  );
}
