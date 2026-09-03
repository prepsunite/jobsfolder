import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { dataStore, type ExperienceItem } from '@/services/dataStore';
import { useAuth } from '@/contexts/AuthContext';
import ContentRenderer from '@/components/ContentRenderer';
import { AddExperienceModal } from '@/components/AddExperienceModal';
import { EditExperienceModal } from '@/components/EditExperienceModal';
import { experienceService } from '@/services/experience.service';
import {
  Layers,
  Search,
  PlusCircle,
  Loader2,
  Edit3,
  Trash2,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
} from 'lucide-react';

export default function ExperiencesPage() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter States
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'SELECTED' | 'REJECTED'>('ALL');
  const [driveTypeFilter, setDriveTypeFilter] = useState<'ALL' | 'ON_CAMPUS' | 'OFF_CAMPUS' | 'POOL_CAMPUS'>('ALL');

  // Upvote / Helpful State
  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('prepunite_upvoted_experiences');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [localUpvotes, setLocalUpvotes] = useState<Record<string, number>>({});

  const handleToggleUpvote = async (expId: string) => {
    if (upvotedIds.includes(expId)) return;
    const nextUpvoted = [...upvotedIds, expId];
    setUpvotedIds(nextUpvoted);
    try {
      localStorage.setItem('prepunite_upvoted_experiences', JSON.stringify(nextUpvoted));
    } catch {}

    setLocalUpvotes((prev) => ({
      ...prev,
      [expId]: (prev[expId] ?? 0) + 1,
    }));

    await experienceService.upvoteExperience(expId);
    queryClient.invalidateQueries({ queryKey: ['live-experiences'] });
  };

  // Bookmark State
  const [bookmarkedExpIds, setBookmarkedExpIds] = useState<string[]>(() =>
    dataStore.getBookmarkedExperienceIds()
  );

  useEffect(() => {
    const handleBookmarksChanged = () => {
      setBookmarkedExpIds(dataStore.getBookmarkedExperienceIds());
    };
    window.addEventListener('prepunite_bookmarks_changed', handleBookmarksChanged);
    return () => window.removeEventListener('prepunite_bookmarks_changed', handleBookmarksChanged);
  }, []);

  const handleToggleBookmark = (expId: string) => {
    dataStore.toggleBookmarkExperience(expId);
    setBookmarkedExpIds(dataStore.getBookmarkedExperienceIds());
  };

  const { data: rawExperiences = [], isLoading } = useQuery({
    queryKey: ['live-experiences', searchTerm, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('experiences')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        query = query.eq('status', 'APPROVED');
      }

      if (searchTerm) {
        query = query.or(
          `company_slug.ilike.%${searchTerm}%,role_title.ilike.%${searchTerm}%,student_name.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(
        (e: any): ExperienceItem => ({
          id: e.id,
          companyName: e.company_name || e.company_slug?.toUpperCase() || 'TCS',
          role: e.role_title || 'Software Engineer',
          studentName: e.student_name || 'Student',
          college: e.college || '',
          year: e.year || 2026,
          difficulty: e.difficulty || 'MEDIUM',
          verdict: e.verdict || 'SELECTED',
          upvotes: e.upvotes || 0,
          driveType: e.drive_type || 'ON_CAMPUS',
          rounds: (() => {
            try {
              return typeof e.rounds === 'string' ? JSON.parse(e.rounds) : e.rounds || [];
            } catch {
              return [{ roundTitle: 'Interview', details: e.overall_experience || e.description || '' }];
            }
          })(),
          status: e.status || 'PENDING',
        })
      );
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const filteredExperiences = rawExperiences.filter((exp) => {
    if (verdictFilter !== 'ALL' && exp.verdict !== verdictFilter) return false;
    if (driveTypeFilter !== 'ALL' && (exp.driveType || 'ON_CAMPUS') !== driveTypeFilter) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      const { error } = await supabase
        .from('experiences')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['live-experiences'] });
    } catch (err: any) {
      alert(`Failed to delete experience: ${err.message || err}`);
    }
  };

  const getDifficultyBadge = (d: string) => {
    switch (d) {
      case 'EASY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#FD4A32]/10 text-[#FD4A32] dark:text-[#FD4A32] border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FD4A32] dark:bg-[#FD4A32]" />
            Easy Difficulty
          </span>
        );
      case 'HARD':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Hard Difficulty
          </span>
        );
      case 'MEDIUM':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium Difficulty
          </span>
        );
    }
  };

  const getVerdictBadge = (v: string) => {
    switch (v) {
      case 'SELECTED':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-display font-bold uppercase tracking-wider bg-[#FD4A32]/10 text-[#FD4A32] dark:text-[#FD4A32] border border-emerald-500/20">
            Selected
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-display font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Not Selected
          </span>
        );
      case 'WAITLISTED':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[10px] font-display font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Waitlisted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-lg p-6 sm:p-8 border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#121417] dark:text-[#FFFFFF] shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] text-[10px] font-display font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Real Student Interviews</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            Interview Experiences & Transcripts
          </h1>

          <p className="text-sm text-[#868E96] dark:text-[#555555] font-sans leading-relaxed">
            Real placement drive transcripts and round-by-round interview experiences from placed students across top tech companies.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#FD4A32] dark:bg-[#FD4A32] hover:bg-[#E0351D] text-black font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Your Experience</span>
            </button>
            <Link
              to="/experiences/submit"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#E9ECEF] dark:border-[#242424] text-xs font-display font-bold uppercase tracking-wider text-[#121417] dark:text-[#FFFFFF] hover:bg-[#F8F9FA] dark:hover:bg-[#0C0C0C] transition-colors"
            >
              Full Form Submission
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#868E96] dark:text-[#555555]" />
          <input
            type="text"
            placeholder="Search experiences by company, role, or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-md bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] dark:placeholder-[#555555] focus:outline-none focus:border-[#121417] dark:focus:border-[#444444]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Verdict Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider mr-1">
              Result:
            </span>
            {(['ALL', 'SELECTED', 'REJECTED'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  verdictFilter === v
                    ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                    : 'bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#666666] hover:text-[#121417] dark:hover:text-white'
                }`}
              >
                {v === 'ALL' ? 'All Results' : v === 'SELECTED' ? 'Offered / Selected' : 'Not Selected'}
              </button>
            ))}
          </div>

          {/* Drive Type Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-display font-bold text-[#868E96] dark:text-[#777777] uppercase tracking-wider mr-1">
              Drive:
            </span>
            {(['ALL', 'ON_CAMPUS', 'OFF_CAMPUS', 'POOL_CAMPUS'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDriveTypeFilter(d)}
                className={`px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  driveTypeFilter === d
                    ? 'bg-[#121417] dark:bg-white text-white dark:text-black shadow-xs'
                    : 'bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#666666] hover:text-[#121417] dark:hover:text-white'
                }`}
              >
                {d === 'ALL' ? 'All Drives' : d === 'ON_CAMPUS' ? 'On-Campus' : d === 'OFF_CAMPUS' ? 'Off-Campus' : 'Pool Campus'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed List */}
      {isLoading ? (
        <div className="p-12 text-center text-[#868E96] flex items-center justify-center gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-[#FD4A32]" />
          <span>Loading interview reports...</span>
        </div>
      ) : filteredExperiences.length === 0 ? (
        <div className="p-12 text-center rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#868E96] dark:text-[#555555] space-y-2">
          <p className="text-sm font-semibold">No interview experiences found.</p>
          <p className="text-xs">Try adjusting your filters or be the first to submit a transcript!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExperiences.map((exp) => {
            const isBookmarked = bookmarkedExpIds.includes(exp.id);
            const isUpvoted = upvotedIds.includes(exp.id);
            const displayUpvotes = (exp.upvotes ?? 0) + (localUpvotes[exp.id] ?? 0);

            return (
              <div
                key={exp.id}
                className="p-5 sm:p-6 rounded-lg border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] shadow-xs space-y-4 hover:border-[#121417] dark:hover:border-[#383838] transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9ECEF] dark:border-[#242424] pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-extrabold text-base text-[#121417] dark:text-[#FFFFFF]">
                        {exp.companyName}
                      </span>
                      <span className="text-xs text-[#868E96] dark:text-[#555555]">•</span>
                      <span className="text-xs font-semibold text-[#121417] dark:text-[#FFFFFF]">
                        {exp.role}
                      </span>
                      {isAdmin && exp.status === 'PENDING' && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                          Pending Moderation
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#868E96] dark:text-[#555555] mt-0.5">
                      Shared by <strong className="text-[#121417] dark:text-[#FFFFFF]">{exp.studentName}</strong>
                      {exp.college ? ` (${exp.college})` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {exp.driveType && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {exp.driveType.replace(/_/g, ' ')}
                      </span>
                    )}
                    {getDifficultyBadge(exp.difficulty)}
                    {getVerdictBadge(exp.verdict)}

                    {/* Upvote / Helpful Action */}
                    <button
                      type="button"
                      onClick={() => handleToggleUpvote(exp.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-display font-bold transition-all cursor-pointer ${
                        isUpvoted
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-2xs'
                          : 'border-[#E9ECEF] dark:border-[#242424] text-[#868E96] hover:text-amber-600 hover:border-amber-500/30'
                      }`}
                      title={isUpvoted ? 'You marked this as helpful' : 'Mark this experience as helpful'}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>Helpful ({displayUpvotes})</span>
                    </button>

                    {/* Bookmark Action */}
                    <button
                      onClick={() => handleToggleBookmark(exp.id)}
                      className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'border-[#FD4A32]/30 bg-[#FD4A32]/10 text-[#FD4A32] dark:text-[#FD4A32]'
                          : 'border-[#E9ECEF] dark:border-[#242424] text-[#868E96] hover:text-[#121417] dark:hover:text-[#FFFFFF]'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this experience'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingExp(exp)}
                          className="p-1.5 rounded-md border border-[#E9ECEF] dark:border-[#242424] text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                          title="Edit experience"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="p-1.5 rounded-md border border-[#E9ECEF] dark:border-[#242424] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer"
                          title="Delete experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interview Rounds & Details */}
                {exp.rounds && exp.rounds.length > 0 && (
                  <div className="space-y-3">
                    {exp.rounds.map((rd, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-3.5 rounded-md bg-[#F8F9FA] dark:bg-[#0C0C0C] border border-[#E9ECEF] dark:border-[#242424] space-y-2"
                      >
                        {rd.roundTitle && (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32]" />
                            <h4 className="text-xs font-display font-bold text-[#121417] dark:text-[#FFFFFF]">
                              {rd.roundTitle}
                            </h4>
                          </div>
                        )}
                        <ContentRenderer
                          content={rd.details}
                          className="text-xs font-sans text-[#121417] dark:text-[#FFFFFF]"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ➕ Extracted Add Experience Modal */}
      <AddExperienceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['live-experiences'] })}
      />

      {/* ✏️ Extracted Edit Experience Modal */}
      <EditExperienceModal
        experience={editingExp}
        isOpen={!!editingExp}
        onClose={() => setEditingExp(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['live-experiences'] })}
      />
    </div>
  );
}
