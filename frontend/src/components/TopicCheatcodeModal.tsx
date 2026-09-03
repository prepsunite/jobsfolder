import React, { useState, useEffect } from 'react';
import { BookOpen, X, Save, Edit3, Eye, Copy, Check, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface TopicCheatcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  topicName: string;
  categoryTitle?: string;
  fallbackFormulas?: string[];
}

const EMPTY_FALLBACK_FORMULAS: string[] = [];

export const TopicCheatcodeModal: React.FC<TopicCheatcodeModalProps> = ({
  isOpen,
  onClose,
  topicId,
  topicName,
  categoryTitle = 'Quantitative Aptitude',
  fallbackFormulas = EMPTY_FALLBACK_FORMULAS,
}) => {
  const { isAdmin } = useAuth();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [extractedFormulas, setExtractedFormulas] = useState<string[]>(fallbackFormulas);

  // Fetch cheatcode from Supabase on modal open
  useEffect(() => {
    if (!isOpen || !topicId) return;

    let isMounted = true;
    setIsLoading(true);
    setIsEditing(false);

    const fetchCheatcode = async () => {
      try {
        const { data, error } = await supabase
          .from('topic_cheat_codes')
          .select('content')
          .eq('topic_id', topicId)
          .single();

        if (!isMounted) return;

        if (!error && data?.content) {
          setContent(data.content);
        } else {
          setContent('');
          // Fallback: fetch formulas used in topic questions
          const { data: qData } = await supabase
            .from('topic_questions')
            .select('structured_explanation')
            .eq('topic_id', topicId)
            .limit(30);

          if (!isMounted) return;

          const collected = new Set<string>(fallbackFormulas);
          if (qData && qData.length > 0) {
            qData.forEach((q: any) => {
              const exp = typeof q.structured_explanation === 'string'
                ? JSON.parse(q.structured_explanation)
                : q.structured_explanation;
              const fList = exp?.formulaUsed || exp?.formulasUsed || [];
              if (Array.isArray(fList)) {
                fList.forEach((f: string) => f && collected.add(f.trim()));
              }
            });
          }
          setExtractedFormulas(Array.from(collected));
        }
      } catch (err) {
        console.warn('Failed to load topic cheatcode:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCheatcode();

    return () => {
      isMounted = false;
    };
  }, [isOpen, topicId, fallbackFormulas]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!topicId) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('topic_cheat_codes')
        .upsert(
          { topic_id: topicId, content, updated_at: new Date().toISOString() },
          { onConflict: 'topic_id' }
        );

      if (error) throw error;
      setIsEditing(false);
    } catch (err: any) {
      alert(`Failed to save cheatcode: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = content || extractedFormulas.join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasFormulas = content || extractedFormulas.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#141414] rounded-2xl border border-[#E9ECEF] dark:border-[#242424] shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E9ECEF] dark:border-[#222222] flex items-center justify-between bg-[#F8F9FA]/60 dark:bg-[#111112]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 text-[#FD4A32] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-sm sm:text-base text-[#121417] dark:text-white">
                  {topicName}
                </h3>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] border border-[#FD4A32]/20">
                  Cheatcode
                </span>
              </div>
              <p className="text-[11px] text-[#868E96] dark:text-[#777777]">
                {categoryTitle} • Essential formulas and speed shortcuts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy Button */}
            {hasFormulas && (
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1.5 rounded-lg bg-[#FD4A32] hover:bg-[#E0351D] text-white text-xs font-display font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Copy formulas to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}

            {/* Admin Edit Toggle */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isEditing
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                    : 'text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={isEditing ? 'View Mode' : 'Edit Cheatcode'}
              >
                {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#868E96] hover:text-[#121417] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-sans">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#868E96]">Loading cheatcode...</div>
          ) : isEditing ? (
            /* Admin Edit Mode */
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#121417] dark:text-white flex items-center justify-between">
                <span>Edit Topic Cheatcode (Markdown supported)</span>
              </label>
              <textarea
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`# ${topicName} Formulas\n\n- Key Formula 1: ...\n- Key Formula 2: ...\n\n### Shortcut Rules\n- Tip: ...`}
                className="w-full bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] rounded-xl p-4 text-xs font-mono text-[#121417] dark:text-white focus:outline-none focus:border-[#FD4A32] leading-relaxed"
              />
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#FD4A32] hover:bg-[#E0351D] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          ) : content ? (
            /* Custom Cheatcode Content */
            <div className="space-y-4 text-xs leading-relaxed text-[#121417] dark:text-[#E9ECEF]">
              <div
                style={{ whiteSpace: 'pre-wrap' }}
                className="font-mono bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] p-4 rounded-xl"
              >
                {content}
              </div>
            </div>
          ) : extractedFormulas.length > 0 ? (
            /* Extracted / Question-level Formulas */
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FD4A32]" />
                <span className="text-xs font-display font-bold text-[#121417] dark:text-white">
                  Exam Tested Formulas & Rules
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {extractedFormulas.map((formula, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] font-mono text-xs text-[#121417] dark:text-[#E9ECEF] flex items-center justify-between"
                  >
                    <span>{formula}</span>
                    <span className="text-[9px] text-[#868E96] font-sans">Rule #{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12 space-y-2">
              <BookOpen className="w-8 h-8 text-[#868E96] mx-auto opacity-50" />
              <h4 className="font-display font-bold text-xs text-[#121417] dark:text-white">
                No Cheatcode Added Yet
              </h4>
              <p className="text-xs text-[#868E96] dark:text-[#777777] max-w-sm mx-auto font-sans">
                Formulas and shortcuts for {topicName} are being compiled.
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-[#FD4A32]/10 hover:bg-[#FD4A32]/20 text-[#FD4A32] text-xs font-display font-bold transition-all cursor-pointer border border-[#FD4A32]/20"
                >
                  + Add Cheatcode as Admin
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicCheatcodeModal;
