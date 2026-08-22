import type { InterviewExperience } from '@/types/experience';
import { GraduationCap, Calendar, Eye, Sparkles, UserCheck } from 'lucide-react';

interface ExperienceCardProps {
  experience: InterviewExperience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="bg-[#ffffff] dark:bg-[#1e1f22] hover:bg-[#fff8f5] dark:hover:bg-[#2b2d31] border border-[#eae1da] dark:border-[#383a40] hover:border-[#FD4A32]/40 dark:hover:border-[#FD4A32]/40 rounded-[24px] p-6 transition-all duration-300 space-y-4 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eae1da] dark:border-[#2b2d31]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-[#1f1b17] dark:text-[#e3e3e3]">{experience.role}</span>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#FD4A32]/30 dark:bg-[#FD4A32]/30 text-[#E0351D] dark:text-[#FD4A32] border border-[#E0351D]/20 dark:border-[#FD4A32]/20">
              {experience.companyName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#444748] dark:text-[#a6adbb]">
            <span className="flex items-center gap-1 font-semibold text-[#1f1b17] dark:text-[#e3e3e3]">
              <UserCheck className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32]" />
              {experience.authorName}
            </span>
            {experience.college && (
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#747878] dark:text-[#a6adbb]" />
                {experience.college}
              </span>
            )}
            {experience.year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#747878] dark:text-[#a6adbb]" />
                Class of {experience.year}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-[#747878] dark:text-[#a6adbb]">
          <Eye className="w-3.5 h-3.5" />
          <span>{experience.viewCount} views</span>
        </div>
      </div>

      {/* Main Experience Content */}
      <div className="text-xs sm:text-sm text-[#1f1b17] dark:text-[#e3e3e3] leading-relaxed whitespace-pre-line space-y-2 font-sans">
        {experience.content}
      </div>

      {/* Pro Tips Section */}
      {experience.tips && (
        <div className="p-4 bg-[#f6ece6] dark:bg-[#141517] border border-[#e2d8d2] dark:border-[#2b2d31] rounded-[16px] text-xs text-[#1f1b17] dark:text-[#e3e3e3] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#FD4A32] dark:text-[#FD4A32]">
            <Sparkles className="w-4 h-4 text-[#FD4A32] dark:text-[#FD4A32]" />
            <span>Key Advice & Tips</span>
          </div>
          <p className="leading-relaxed text-[#444748] dark:text-[#a6adbb]">{experience.tips}</p>
        </div>
      )}

      {/* Resources Used */}
      {experience.resourcesUsed && (
        <div className="text-xs text-[#747878] dark:text-[#a6adbb] pt-2 border-t border-[#eae1da] dark:border-[#2b2d31]">
          <span className="font-bold text-[#1f1b17] dark:text-[#e3e3e3]">Preparation Resources: </span>
          <span>{experience.resourcesUsed}</span>
        </div>
      )}
    </div>
  );
}
