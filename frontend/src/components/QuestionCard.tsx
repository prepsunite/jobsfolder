import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { OaQuestion } from '@/types/question';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore } from '@/services/dataStore';
import { Bookmark, BookmarkCheck, Building2, ChevronDown, ChevronUp, Code, Hash, Flame, Edit3, Trash2, ExternalLink } from 'lucide-react';

interface QuestionCardProps {
  question: OaQuestion;
  onEdit?: (question: OaQuestion) => void;
  onDelete?: (questionId: string) => void;
}

export default function QuestionCard({ question, onEdit, onDelete }: QuestionCardProps) {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const [showSolution, setShowSolution] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => dataStore.isQuestionBookmarked(question.id));

  useEffect(() => {
    setIsBookmarked(dataStore.isQuestionBookmarked(question.id));
  }, [question.id]);

  const handleToggleBookmark = () => {
    const newStatus = dataStore.toggleBookmarkQuestion(question.id);
    setIsBookmarked(newStatus);
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-[#f6ece6] dark:bg-[#2b2d31] text-[#444748] dark:text-[#a6adbb] border-[#e2d8d2] dark:border-[#383a40]';
    }
  };

  return (
    <div className="bg-[#ffffff] dark:bg-[#1e1f22] hover:bg-[#fff8f5] dark:hover:bg-[#2b2d31] border border-[#eae1da] dark:border-[#383a40] hover:border-[#FD4A32]/40 dark:hover:border-[#FD4A32]/40 rounded-[24px] p-6 transition-all duration-300 space-y-4 shadow-sm relative">
      {/* Top Header Bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getDifficultyBadge(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-[#FD4A32]/30 text-[#E0351D] border border-[#E0351D]/20">
              {question.questionType}
            </span>
            {question.companyName && (
              <Link
                to={`/companies/${question.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}/oldpapers`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#FD4A32] bg-[#FD4A32]/20 hover:bg-[#FD4A32]/40 px-3 py-0.5 rounded-full border border-[#FD4A32]/30 transition-all"
                title={`Open ${question.companyName} Old Papers Dashboard`}
              >
                <Building2 className="w-3 h-3 text-[#FD4A32]" />
                <span>{question.companyName} Old Papers</span>
                <ExternalLink className="w-3 h-3 text-[#FD4A32]" />
              </Link>
            )}
            {question.frequency > 1 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                <Flame className="w-3 h-3 text-amber-600" />
                Asked {question.frequency}x
              </span>
            )}
          </div>

          <h3 className="font-display text-lg font-bold text-[#1f1b17] leading-snug">
            {question.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {isAdmin && (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(question)}
                  className="p-2 rounded-full border border-purple-200 bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                  title="Edit Question In-Place"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm(`Delete question: ${question.title}?`)) {
                      onDelete(question.id);
                    }
                  }}
                  className="p-2 rounded-full border border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          <button
            onClick={handleToggleBookmark}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-xs ${
              isBookmarked
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                : 'bg-[#f6ece6] dark:bg-[#2b2d31] border-[#e2d8d2] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
            }`}
            title={isBookmarked ? 'Remove from profile saved questions' : 'Save question to profile'}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description */}
      {question.description && (
        <p className="text-xs text-[#1f1b17] dark:text-[#e3e3e3] leading-relaxed bg-[#f6ece6]/70 dark:bg-[#141517] p-4 rounded-[16px] border border-[#e2d8d2] dark:border-[#383a40] font-sans whitespace-pre-line">
          {question.description}
        </p>
      )}

      {/* Test Cases / Sample Input & Output */}
      {(question.sampleInput || question.sampleOutput) && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase tracking-wider block">
            Sample Test Case:
          </span>
          <pre className="test-case">
            {question.sampleInput && `Input:\n${question.sampleInput}\n`}
            {question.sampleOutput && `\nOutput:\n${question.sampleOutput}`}
          </pre>
        </div>
      )}

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {question.tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#444748] bg-[#f6ece6] px-2.5 py-0.5 rounded-full border border-[#e2d8d2]">
              <Hash className="w-3 h-3 text-[#747878]" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Expandable Solution */}
      {question.solution && (
        <div className="pt-2 border-t border-[#eae1da]">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-2 text-xs font-bold text-[#FD4A32] hover:text-[#E0351D] transition-colors"
          >
            <Code className="w-4 h-4" />
            <span>{showSolution ? 'Hide Solution & Explanation' : 'View Verified Solution'}</span>
            {showSolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSolution && (
            <div className="mt-3 space-y-3 p-4 bg-[#1c1b1b] text-white rounded-[16px] border border-[#342f2b]">
              {question.explanation && (
                <div>
                  <span className="text-xs font-semibold text-[#c8c6c5] block mb-1">Explanation:</span>
                  <p className="text-xs text-surface-200 leading-relaxed font-sans">{question.explanation}</p>
                </div>
              )}
              <div>
                <span className="text-xs font-semibold text-[#FD4A32] block mb-1">Code Solution:</span>
                <pre className="p-3 bg-[#000000] rounded-lg text-xs font-mono text-[#FD4A32] overflow-x-auto border border-[#342f2b]">
                  {question.solution}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
