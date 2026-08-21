import { Link } from 'react-router';
import type { Company } from '@/types/company';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, ArrowRight, Edit3, Trash2 } from 'lucide-react';

interface CompanyCardProps {
  company: Company & { examsList?: string[] };
  onEdit?: (company: Company) => void;
  onDelete?: (companyId: string) => void;
}

export default function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  return (
    <div className="group relative bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg p-5 sm:p-6 transition-all duration-200 hover:border-[#121417] dark:hover:border-[#383838] hover:shadow-md flex flex-col justify-between">
      {/* Admin Inline Action Badges */}
      {isAdmin && (
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1 bg-white/95 dark:bg-[#1C1C1C]/95 p-1 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] shadow-xs">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(company);
              }}
              className="p-1 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
              title="Edit Company Profile In-Place"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${company.name}?`)) {
                  onDelete(company.id);
                }
              }}
              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"
              title="Delete Company"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Edge-to-Edge Company Logo Hero Container */}
      <div className="relative rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] flex items-center justify-center h-48 sm:h-52 overflow-hidden border border-[#E9ECEF] dark:border-[#242424]">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-200 p-4">
            <div className="w-16 h-16 rounded-md bg-[#F1F3F5] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E] text-[#121417] dark:text-[#FFFFFF] flex items-center justify-center font-display text-3xl font-black">
              {company.name.charAt(0)}
            </div>
            <span className="font-display text-base font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight text-center">
              {company.name}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Footer Section */}
      <div className="pt-4 flex items-center justify-between gap-3 border-t border-[#E9ECEF] dark:border-[#242424] mt-4">
        {/* Left: Handle & Metadata */}
        <div className="min-w-0 flex-1">
          <div className="text-sm sm:text-base font-display font-extrabold text-[#121417] dark:text-[#FFFFFF] truncate">
            {company.name}
          </div>
          <div className="text-xs text-[#868E96] dark:text-[#555555] truncate flex items-center gap-1.5 mt-0.5 font-sans">
            <Building2 className="w-3 h-3 text-[#009D63] dark:text-[#00C47B] shrink-0" />
            <span>{company.industry || company.headquarters || 'Active Drive Archive'}</span>
          </div>
        </div>

        {/* Right: Action Button */}
        <Link
          to={`/companies/${company.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#121417] dark:bg-white text-white dark:text-[#0C0C0C] hover:bg-[#009D63] dark:hover:bg-[#00C47B] font-display font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
        >
          <span>Exams</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
