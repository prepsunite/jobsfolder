import { Link } from 'react-router';
import type { Company } from '@/types/company';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Plus, Edit3, Trash2 } from 'lucide-react';

interface CompanyCardProps {
  company: Company & { examsList?: string[] };
  onEdit?: (company: Company) => void;
  onDelete?: (companyId: string) => void;
}

export default function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  return (
    <div className="group relative bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[22px] p-3 transition-all duration-300 hover:shadow-xl hover:shadow-[#000000]/5 dark:hover:shadow-black/20 hover:border-[#006c49]/40 dark:hover:border-[#6cf8bb]/40 flex flex-col justify-between">
      {/* Admin Inline Action Badges */}
      {isAdmin && (
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-[#ffffff]/90 dark:bg-[#1e1f22]/90 backdrop-blur-md p-0.5 rounded-full border border-[#eae1da] dark:border-[#383a40] shadow-md">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(company);
              }}
              className="p-1 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition-colors"
              title="Edit Company Profile In-Place"
            >
              <Edit3 className="w-3 h-3" />
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
              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-full transition-colors"
              title="Delete Company"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Edge-to-Edge Company Logo Hero Container */}
      <div className="relative rounded-[16px] bg-[#ffffff] dark:bg-[#141517] flex items-center justify-center h-40 sm:h-44 overflow-hidden border border-[#e2d8d2] dark:border-[#383a40]">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300 p-4">
            <div className="w-14 h-14 rounded-2xl bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#0284c7] flex items-center justify-center text-3xl font-black shadow-sm">
              {company.name.charAt(0)}
            </div>
            <span className="font-display text-base font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight">
              {company.name}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Footer Section */}
      <div className="pt-2.5 px-1 pb-0.5 flex items-center justify-between gap-2">
        {/* Left: Handle & Metadata (No Profile Pic Avatar) */}
        <div className="min-w-0">
          <div className="text-[12px] font-bold text-[#1f1b17] dark:text-[#e3e3e3] truncate font-sans">
            @{company.slug}
          </div>
          <div className="text-[10px] text-[#747878] dark:text-[#a6adbb] truncate flex items-center gap-1">
            <Building2 className="w-2.5 h-2.5 text-[#006c49] dark:text-[#6cf8bb] shrink-0" />
            <span>{company.industry || company.headquarters || 'Active Drive'}</span>
          </div>
        </div>

        {/* Right: Action Button */}
        <Link
          to={`/companies/${company.slug}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#000000] dark:bg-[#e3e3e3] hover:bg-[#006c49] dark:hover:bg-[#ffffff] text-white dark:text-[#141517] font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm shrink-0"
        >
          <Plus className="w-3 h-3 text-[#6cf8bb] dark:text-[#006c49] group-hover:text-white dark:group-hover:text-[#141517] transition-colors" />
          <span>View Exams</span>
        </Link>
      </div>
    </div>
  );
}
