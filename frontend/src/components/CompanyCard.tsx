import { Link } from 'react-router';
import type { Company } from '@/types/company';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Building2, ArrowRight, Edit3, Trash2, Eye, EyeOff } from 'lucide-react';

interface CompanyCardProps {
  company: Company & { examsList?: string[] };
  onEdit?: (company: Company) => void;
  onDelete?: (companyId: string) => void;
  onToggleVisibility?: (company: Company) => void;
}

export default function CompanyCard({ company, onEdit, onDelete, onToggleVisibility }: CompanyCardProps) {
  const { role } = useAuth();
  const { confirmModal } = useToast();
  const isAdmin = role === 'ADMIN';

  return (
    <div className={`group relative bg-white dark:bg-[#141414] border rounded-lg p-4 transition-all duration-200 hover:border-[#FD4A32] dark:hover:border-[#FD4A32] hover:shadow-md hover:shadow-[#FD4A32]/10 flex flex-col justify-between ${
      company.isHidden
        ? 'border-dashed border-amber-400 dark:border-amber-600/60 bg-amber-500/[0.02] dark:bg-amber-950/[0.05]'
        : 'border-[#E9ECEF] dark:border-[#242424]'
    }`}>
      {/* Admin Inline Action Badges */}
      {isAdmin && (
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-white/95 dark:bg-[#1C1C1C]/95 p-0.5 rounded-md border border-[#E9ECEF] dark:border-[#2E2E2E] shadow-xs">
          {onToggleVisibility && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(company);
              }}
              className={`p-1 rounded transition-colors ${
                company.isHidden
                  ? 'text-amber-600 dark:text-amber-400 hover:text-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                  : 'text-[#747878] dark:text-[#a6adbb] hover:text-[#121417] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={company.isHidden ? "Unhide Company (Make Live for Students)" : "Hide Company from Students"}
            >
              {company.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(company);
              }}
              className="p-1 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
              title="Edit Company Profile"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                const confirmed = await confirmModal({
                  title: 'Delete Company',
                  message: `Are you sure you want to delete "${company.name}"? This action cannot be undone.`,
                  confirmText: 'Delete',
                  isDanger: true,
                });
                if (confirmed) {
                  onDelete(company.id);
                }
              }}
              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"
              title="Delete Company"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Edge-to-Edge Company Logo Hero Container */}
      <div className="relative rounded-md bg-[#FD4A32]/5 dark:bg-[#FD4A32]/5 flex items-center justify-center h-36 overflow-hidden border border-[#FD4A32]/20 dark:border-[#FD4A32]/20">
        {company.isHidden && (
          <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/90 text-white text-[9px] font-display font-extrabold uppercase tracking-wider shadow-xs">
            <EyeOff className="w-2.5 h-2.5" />
            <span>Draft / Hidden</span>
          </div>
        )}
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-200 p-3">
            <div className="w-12 h-12 rounded-md bg-[#FD4A32]/10 dark:bg-[#FD4A32]/10 border border-[#FD4A32]/20 text-[#FD4A32] flex items-center justify-center font-display text-2xl font-black">
              {company.name.charAt(0)}
            </div>
            <span className="font-display text-sm font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight text-center">
              {company.name}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Footer Section */}
      <div className="pt-3 flex items-center justify-between gap-2.5 border-t border-[#E9ECEF] dark:border-[#242424] mt-3">
        {/* Left: Handle & Metadata */}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-display font-bold text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32] transition-colors truncate">
            {company.name}
          </div>
          <div className="text-xs text-[#868E96] dark:text-[#555555] truncate flex items-center gap-1 mt-0.5 font-sans">
            <Building2 className="w-3 h-3 text-[#FD4A32] dark:text-[#FD4A32] shrink-0" />
            <span>{company.industry || company.headquarters || 'Active Drive'}</span>
          </div>
        </div>

        {/* Right: Action Button */}
        <Link
          to={`/companies/${company.slug}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#121417] dark:bg-white text-white dark:text-black hover:bg-[#23272f] dark:hover:bg-[#e6e6e6] font-display font-bold text-[11px] uppercase tracking-wider transition-colors shrink-0"
        >
          <span>Exams</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
