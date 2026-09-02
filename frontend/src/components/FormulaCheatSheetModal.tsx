import React, { useState } from 'react';
import { X, Printer, Search, BookOpen, Layers } from 'lucide-react';
import type { AptitudeTopic } from '@/pages/AptitudePage';

interface FormulaCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryTitle: string;
  categorySlug: string;
  topics: AptitudeTopic[];
}

export const FormulaCheatSheetModal: React.FC<FormulaCheatSheetModalProps> = ({
  isOpen,
  onClose,
  categoryTitle,
  topics,
}) => {
  const [filterText, setFilterText] = useState('');

  if (!isOpen) return null;

  // Group topics with formulas by cluster
  const topicsWithFormulas = topics.filter(
    (t) => t.formulas && t.formulas.length > 0
  );

  const filteredTopics = topicsWithFormulas.filter((t) => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    const nameMatch = t.name.toLowerCase().includes(q);
    const clusterMatch = t.cluster?.toLowerCase().includes(q);
    const formulaMatch = t.formulas?.some((f) => f.toLowerCase().includes(q));
    return nameMatch || clusterMatch || formulaMatch;
  });

  const clusters = Array.from(new Set(filteredTopics.map((t) => t.cluster || 'General')));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeIn print:p-0 print:bg-white print:static print:z-auto">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cheat-sheet, #printable-cheat-sheet * {
            visibility: visible;
          }
          #printable-cheat-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#141414] rounded-2xl border border-[#E9ECEF] dark:border-[#242424] shadow-2xl flex flex-col overflow-hidden animate-scaleUp print:border-none print:shadow-none print:max-h-none print:w-full">
        {/* Top Control Bar (Hidden during print) */}
        <div className="p-4 sm:p-5 border-b border-[#E9ECEF] dark:border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print bg-[#F8F9FA]/50 dark:bg-[#111112]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-[#121417] dark:text-white">
                {categoryTitle} — Formula Cheat Sheet
              </h3>
              <p className="text-[11px] text-[#868E96] dark:text-[#777777]">
                Quick revision handbook for campus placement drives
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#868E96]" />
              <input
                type="text"
                placeholder="Filter formulas..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E9ECEF] dark:border-[#282828] bg-white dark:bg-[#1C1C1C] text-xs text-[#121417] dark:text-white outline-none w-44 sm:w-56"
              />
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#FD4A32] text-black hover:bg-[#E0351D] font-display font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div id="printable-cheat-sheet" className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Header Banner on Sheet */}
          <div className="pb-4 border-b-2 border-[#121417] dark:border-white/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#FD4A32]">
                PrepUnite • Placement Intelligence Operating System
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-[#121417] dark:text-white tracking-tight mt-0.5">
                {categoryTitle} Formula Sheet
              </h1>
              <p className="text-xs text-[#666666] dark:text-[#999999] font-sans mt-0.5">
                Essential formulas, identities, and memory shortcuts compiled for placement online assessments.
              </p>
            </div>
            <div className="text-right text-[10px] font-mono text-[#868E96] dark:text-[#777777]">
              <span>Generated: {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <div className="font-bold text-[#121417] dark:text-white mt-0.5">{topicsWithFormulas.length} Topics</div>
            </div>
          </div>

          {/* Formula Clusters */}
          {clusters.length === 0 ? (
            <div className="text-center py-12 text-[#868E96] text-xs">
              No formulas matched your search.
            </div>
          ) : (
            <div className="space-y-6">
              {clusters.map((clusterName) => {
                const clusterTopics = filteredTopics.filter((t) => (t.cluster || 'General') === clusterName);
                if (clusterTopics.length === 0) return null;

                return (
                  <div key={clusterName} className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-[#E9ECEF] dark:border-[#262626]">
                      <Layers className="w-3.5 h-3.5 text-[#FD4A32]" />
                      <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-[#121417] dark:text-white">
                        {clusterName}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {clusterTopics.map((topic) => (
                        <div
                          key={topic.id}
                          className="p-3.5 rounded-xl border border-[#E9ECEF] dark:border-[#262626] bg-[#F8F9FA]/60 dark:bg-[#171717] space-y-2 print:bg-white print:border-gray-300"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-xs text-[#121417] dark:text-white">
                              {topic.name}
                            </h3>
                            <span className="text-[9px] font-mono font-bold text-[#868E96] dark:text-[#666666]">
                              {topic.formulas?.length || 0} rules
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {topic.formulas?.map((formula, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-lg bg-white dark:bg-[#1E1E1E] border border-[#E9ECEF]/80 dark:border-[#2B2B2B] text-xs font-mono text-[#121417] dark:text-[#E0E0E0] print:border-gray-200 print:bg-gray-50"
                              >
                                {formula}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Note */}
          <div className="pt-6 border-t border-[#E9ECEF] dark:border-[#222222] text-center text-[10px] text-[#868E96] font-mono print:block">
            PrepUnite Placement Papers & Aptitude Library • Practice online at prepunite.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaCheatSheetModal;
