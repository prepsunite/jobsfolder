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
    <div className="group relative bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[22px] p-3 transition-all duration-300 hover:shadow-xl hover:shadow-[#000000]/5 dark:hover:shadow-black/20 hover:border-[#006c49]/40 dark:hover:border-[#6cf8bb]/40 flex flex-col justify-between">
      {/* Top Right Action Overlay Bar */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
        <button
          onClick={handleToggleBookmark}
          className={`pointer-events-auto p-1.5 rounded-full border shadow-md backdrop-blur-md transition-all ${
            isBookmarked
              ? 'bg-amber-500/90 border-amber-600 text-white'
              : 'bg-[#ffffff]/90 dark:bg-[#1e1f22]/90 border-[#eae1da] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
          }`}
          title={isBookmarked ? 'Remove from profile bookmarks' : 'Save exam to profile bookmarks'}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-3.5 h-3.5 fill-white" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
        </button>

        {isAdmin && (
          <div className="pointer-events-auto flex items-center gap-1 bg-[#ffffff]/90 dark:bg-[#1e1f22]/90 backdrop-blur-md p-0.5 rounded-full border border-[#eae1da] dark:border-[#383a40] shadow-md">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(exam);
                }}
                className="p-1 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition-colors"
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
                className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-full transition-colors"
                title="Delete Exam"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Inner Hero Card Container */}
      <div className="relative rounded-[16px] bg-[#f6ece6] dark:bg-[#141517] p-3 flex flex-col items-center justify-center min-h-[170px] overflow-hidden border border-[#e2d8d2] dark:border-[#2b2d31] space-y-2">
        {/* Exam Title */}
        <h3 className="font-display text-sm font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight group-hover:text-[#006c49] dark:group-hover:text-[#6cf8bb] transition-colors line-clamp-2 text-center z-10">
          {exam.name}
        </h3>

        {/* Center Main Visual Logo */}
        <div className="my-auto flex items-center justify-center w-full h-32 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden bg-white dark:bg-[#141517]">
          {exam.companyLogoUrl ? (
            <img
              src={exam.companyLogoUrl}
              alt={exam.companyName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center gap-1.5 group-hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#0284c7] flex items-center justify-center text-xl font-black shadow-sm">
                {exam.companyName.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="pt-2.5 px-1 pb-0.5 flex items-center justify-between gap-2">
        {/* Left: Handle & Industry Metadata (No Avatar Thumbnail) */}
        <div className="min-w-0">
          <div className="text-[12px] font-bold text-[#1f1b17] dark:text-[#e3e3e3] truncate font-sans">
            @{exam.companySlug}
          </div>
          <div className="text-[10px] text-[#747878] dark:text-[#a6adbb] truncate flex items-center gap-1">
            <Building2 className="w-2.5 h-2.5 text-[#006c49] dark:text-[#6cf8bb] shrink-0" />
            <span>{exam.companyIndustry || 'IT & Services'}</span>
          </div>
        </div>

        {/* Right: Black Pill "More Info" Action Button -> Redirects to /companies/:slug/oldpapers */}
        <Link
          to={`/companies/${exam.companySlug}/oldpapers?examId=${exam.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#000000] dark:bg-[#e3e3e3] hover:bg-[#006c49] dark:hover:bg-[#ffffff] text-white dark:text-[#141517] font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm shrink-0"
          title={`View Old Papers & Syllabus for ${exam.name}`}
        >
          <span>More Info</span>
          <ArrowRight className="w-3 h-3 text-[#6cf8bb] dark:text-[#006c49] group-hover:text-white dark:group-hover:text-[#141517] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
