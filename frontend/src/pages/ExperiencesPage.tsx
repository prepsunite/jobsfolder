import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { dataStore, type ExperienceItem } from '@/services/dataStore';
import { useAuth } from '@/contexts/AuthContext';
import ContentRenderer from '@/components/ContentRenderer';
import { Layers, Search, PlusCircle, Loader2, Edit3, Trash2, XCircle, CheckCircle2, Plus, Bookmark, BookmarkCheck } from 'lucide-react';

export default function ExperiencesPage() {
  const { role, user } = useAuth();
  const isAdmin = role === 'ADMIN';
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Bookmark State
  const [bookmarkedExpIds, setBookmarkedExpIds] = useState<string[]>(() => dataStore.getBookmarkedExperienceIds());

  const handleToggleBookmark = (expId: string) => {
    dataStore.toggleBookmarkExperience(expId);
    setBookmarkedExpIds(dataStore.getBookmarkedExperienceIds());
  };

  const [newExpForm, setNewExpForm] = useState<{
    companyName: string;
    role: string;
    college: string;
    year: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    verdict: 'SELECTED' | 'REJECTED' | 'WAITLISTED';
    isAnonymous: boolean;
    roundsText: string;
  }>({
    companyName: 'TCS',
    role: 'Software Engineer',
    college: '',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    isAnonymous: false,
    roundsText: '',
  });

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
          `company_name.ilike.%${searchTerm}%,role_title.ilike.%${searchTerm}%,student_name.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((e: any): ExperienceItem => ({
        id: e.id,
        companyName: e.company_name || e.company_slug?.toUpperCase() || 'TCS',
        role: e.role_title || 'Software Engineer',
        studentName: e.student_name || 'Student',
        college: e.college || '',
        year: e.year || 2026,
        difficulty: e.difficulty || 'MEDIUM',
        verdict: e.verdict || 'SELECTED',
        rounds: (() => {
          try { return typeof e.rounds === 'string' ? JSON.parse(e.rounds) : (e.rounds || []); }
          catch { return [{ roundTitle: 'Interview', details: e.description || '' }]; }
        })(),
        status: e.status || 'PENDING',
      }));
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const handleCreateExperience = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const finalStudentName = newExpForm.isAnonymous ? 'Anonymous Student' : (user?.name || 'Anonymous Student');
    const status = isAdmin ? 'APPROVED' : 'PENDING';

    try {
      const { error } = await supabase.from('experiences').insert({
        company_name: newExpForm.companyName,
        company_slug: newExpForm.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        role_title: newExpForm.role,
        student_name: finalStudentName,
        college: newExpForm.college || 'Engineering College',
        year: newExpForm.year,
        difficulty: newExpForm.difficulty,
        verdict: newExpForm.verdict,
        rounds: JSON.stringify([{ roundTitle: 'Interview Rounds & Details', details: newExpForm.roundsText || 'Interview experience details provided.' }]),
        status,
        is_deleted: false,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['live-experiences'] });
      setShowAddModal(false);
      setNewExpForm({ companyName: 'TCS', role: 'Software Engineer', college: '', year: 2026, difficulty: 'MEDIUM', verdict: 'SELECTED', isAnonymous: false, roundsText: '' });
    } catch (err: any) {
      alert(`Failed to submit experience: ${err.message || err}`);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingExp) return;
    try {
      const { error } = await supabase.from('experiences').update({
        company_name: editingExp.companyName,
        role_title: editingExp.role,
        student_name: editingExp.studentName,
        college: editingExp.college,
        year: editingExp.year,
        difficulty: editingExp.difficulty,
        verdict: editingExp.verdict,
        rounds: JSON.stringify(editingExp.rounds),
        status: editingExp.status,
      }).eq('id', editingExp.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['live-experiences'] });
      setEditingExp(null);
    } catch (err: any) {
      alert(`Failed to update experience: ${err.message || err}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      const { error } = await supabase.from('experiences').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['live-experiences'] });
    } catch (err: any) {
      alert(`Failed to delete experience: ${err.message || err}`);
    }
  };

  const getDifficultyBadge = (d: string) => {
    if (d === 'EASY') return 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/30';
    if (d === 'HARD') return 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/30 dark:border-rose-500/30';
    return 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/30';
  };

  const getVerdictBadge = (v: string) => {
    if (v === 'SELECTED') return 'bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 text-[#00714d] dark:text-[#6cf8bb] border-[#00714d]/20 dark:border-[#6cf8bb]/30';
    if (v === 'REJECTED') return 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/30 dark:border-rose-500/30';
    return 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/30';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative rounded-[24px] bg-[#f6ece6] dark:bg-[#141517] p-6 sm:p-8 border border-[#e2d8d2] dark:border-[#2b2d31] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/30 dark:bg-[#006c49]/30 border border-[#00714d]/20 dark:border-[#6cf8bb]/30 text-[#00714d] dark:text-[#6cf8bb] text-[11px] font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#006c49] dark:text-[#6cf8bb]" />
              Verified Peer Insights ({rawExperiences.length})
            </div>
            {isAdmin && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-900 text-white">
                Admin CRUD Enabled
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] tracking-tight">
            Real Interview Experiences
          </h1>
          <p className="text-[#444748] dark:text-[#a6adbb] text-sm leading-relaxed font-sans">
            Read first-hand accounts from students who cleared campus placement drives at top companies.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all"
            >
              <Plus className="w-4 h-4 text-purple-300" />
              <span>+ Add Experience</span>
            </button>
          )}
          <Link
            to="/experiences/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#000000] hover:bg-[#006c49] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#6cf8bb]" />
            <span>Share Yours</span>
          </Link>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747878] dark:text-[#6e7278]" />
        <input
          type="text"
          placeholder="Search by company, role, college..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] focus:border-[#006c49] dark:focus:border-[#6cf8bb] rounded-full pl-10 pr-4 py-2.5 text-sm text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] focus:outline-none focus:ring-2 focus:ring-[#006c49]/20 transition-all font-sans"
        />
      </div>

      {/* Experiences List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#006c49] dark:text-[#6cf8bb] animate-spin" />
        </div>
      ) : rawExperiences.length === 0 ? (
        <div className="text-center py-16 bg-[#ffffff] dark:bg-[#1e1f22] rounded-[24px] border border-[#e2d8d2] dark:border-[#2b2d31]">
          <Layers className="w-10 h-10 text-[#747878] dark:text-[#6e7278] mx-auto mb-3" />
          <h3 className="font-display text-base font-bold text-[#1f1b17] dark:text-[#e3e3e3] mb-1">No experiences yet</h3>
          <p className="text-[#444748] dark:text-[#a6adbb] text-xs">Be the first to share your interview experience!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {rawExperiences.map((exp) => {
            const isBookmarked = bookmarkedExpIds.includes(exp.id);
            return (
              <div
                key={exp.id}
                className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] hover:border-[#006c49]/30 dark:hover:border-[#6cf8bb]/30 rounded-[24px] p-6 space-y-4 transition-all shadow-sm relative"
              >
                {/* Action Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleBookmark(exp.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold transition-all shadow-xs ${
                      isBookmarked
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                        : 'bg-[#f6ece6] dark:bg-[#2b2d31] border-[#e2d8d2] dark:border-[#383a40] text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'
                    }`}
                    title={isBookmarked ? 'Remove from profile bookmarks' : 'Save experience to profile'}
                  >
                    {isBookmarked ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setEditingExp({ ...exp })}
                        className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
                        title="Edit Experience"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

              {/* Header Row */}
              <div className="flex flex-wrap items-start gap-3 pr-20">
                <div className="w-11 h-11 rounded-[14px] bg-[#38bdf8]/15 dark:bg-[#38bdf8]/20 border border-[#38bdf8]/30 text-[#0284c7] dark:text-[#38bdf8] font-black text-lg flex items-center justify-center shrink-0">
                  {exp.companyName.charAt(0)}
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <h3 className="font-display text-base font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] leading-snug">
                    {exp.role} @ {exp.companyName}
                  </h3>
                  <p className="text-xs text-[#747878] dark:text-[#6e7278] font-sans">
                    {exp.studentName} • {exp.college} • {exp.year}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getDifficultyBadge(exp.difficulty)}`}>
                    {exp.difficulty}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getVerdictBadge(exp.verdict)}`}>
                    {exp.verdict}
                  </span>
                  {exp.status === 'APPROVED' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#006c49] dark:text-[#6cf8bb] bg-[#6cf8bb]/20 dark:bg-[#006c49]/30 px-2.5 py-0.5 rounded-full border border-[#00714d]/20 dark:border-[#6cf8bb]/30">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Round Details */}
              {exp.rounds && exp.rounds.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-[#eae1da] dark:border-[#2b2d31]">
                  {exp.rounds.map((rd, idx) => {
                    const isGenericTitle = !rd.roundTitle || ['Interview Rounds & Details', 'Interview Breakdown & Rounds Details'].includes(rd.roundTitle);
                    return (
                      <div key={idx} className="p-4 bg-[#f6ece6]/60 dark:bg-[#141517]/60 rounded-[18px] border border-[#e2d8d2] dark:border-[#2b2d31] space-y-2">
                        {!isGenericTitle && (
                          <span className="text-xs font-black text-[#006c49] dark:text-[#6cf8bb] uppercase tracking-wider block">
                            {rd.roundTitle}
                          </span>
                        )}
                        <ContentRenderer
                          content={rd.details}
                          className="text-xs font-sans"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* ➕ MODAL: ADD EXPERIENCE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <h3 className="font-display text-base font-bold text-[#1f1b17] dark:text-[#e3e3e3]">Add Interview Experience</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#747878] dark:text-[#6e7278] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateExperience} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Company</label>
                  <input type="text" required value={newExpForm.companyName} onChange={(e) => setNewExpForm({ ...newExpForm, companyName: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Role</label>
                  <input type="text" required value={newExpForm.role} onChange={(e) => setNewExpForm({ ...newExpForm, role: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Student Name</label>
                  <div className="flex items-center justify-between bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl px-3 py-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3]">
                    <span className="font-bold">{newExpForm.isAnonymous ? 'Anonymous Student' : (user?.name || 'Student')}</span>
                    <label className="flex items-center gap-1 cursor-pointer text-[10px] text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">
                      <input
                        type="checkbox"
                        checked={newExpForm.isAnonymous}
                        onChange={(e) => setNewExpForm({ ...newExpForm, isAnonymous: e.target.checked })}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>Anonymous</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">College</label>
                  <input type="text" placeholder="NIT/IIT..." value={newExpForm.college} onChange={(e) => setNewExpForm({ ...newExpForm, college: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Year</label>
                  <input type="number" value={newExpForm.year} onChange={(e) => setNewExpForm({ ...newExpForm, year: Number(e.target.value) })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Difficulty</label>
                  <select value={newExpForm.difficulty} onChange={(e) => setNewExpForm({ ...newExpForm, difficulty: e.target.value as any })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none">
                    <option value="EASY" className="dark:bg-[#1e1f22]">Easy</option>
                    <option value="MEDIUM" className="dark:bg-[#1e1f22]">Medium</option>
                    <option value="HARD" className="dark:bg-[#1e1f22]">Hard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Verdict</label>
                  <select value={newExpForm.verdict} onChange={(e) => setNewExpForm({ ...newExpForm, verdict: e.target.value as any })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none">
                    <option value="SELECTED" className="dark:bg-[#1e1f22]">Selected</option>
                    <option value="REJECTED" className="dark:bg-[#1e1f22]">Rejected</option>
                    <option value="WAITLISTED" className="dark:bg-[#1e1f22]">Waitlisted</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-bold text-[#006c49] dark:text-[#6cf8bb] uppercase block">
                  Interview Breakdown & Rounds Details *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe all interview rounds (OA questions, Technical questions, HR discussions)..."
                  value={newExpForm.roundsText}
                  onChange={(e) => setNewExpForm({ ...newExpForm, roundsText: e.target.value })}
                  className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] placeholder-[#747878] dark:placeholder-[#6e7278] font-mono leading-relaxed focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-[#747878] dark:text-[#6e7278] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">Publish Experience</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ MODAL: EDIT EXPERIENCE */}
      {editingExp && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] rounded-[28px] max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae1da] dark:border-[#2b2d31]">
              <h3 className="font-display text-base font-bold text-[#1f1b17] dark:text-[#e3e3e3]">Edit Experience</h3>
              <button onClick={() => setEditingExp(null)} className="text-[#747878] dark:text-[#6e7278] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Company</label>
                  <input type="text" value={editingExp.companyName} onChange={(e) => setEditingExp({ ...editingExp, companyName: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Role</label>
                  <input type="text" value={editingExp.role} onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Student Name</label>
                  <input type="text" value={editingExp.studentName} onChange={(e) => setEditingExp({ ...editingExp, studentName: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">College</label>
                  <input type="text" value={editingExp.college} onChange={(e) => setEditingExp({ ...editingExp, college: e.target.value })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Year</label>
                  <input type="number" value={editingExp.year} onChange={(e) => setEditingExp({ ...editingExp, year: Number(e.target.value) })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Difficulty</label>
                  <select value={editingExp.difficulty} onChange={(e) => setEditingExp({ ...editingExp, difficulty: e.target.value as any })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none">
                    <option value="EASY" className="dark:bg-[#1e1f22]">Easy</option>
                    <option value="MEDIUM" className="dark:bg-[#1e1f22]">Medium</option>
                    <option value="HARD" className="dark:bg-[#1e1f22]">Hard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#747878] dark:text-[#6e7278] uppercase block">Verdict</label>
                  <select value={editingExp.verdict} onChange={(e) => setEditingExp({ ...editingExp, verdict: e.target.value as any })} className="w-full bg-[#f6ece6] dark:bg-[#141517] border border-transparent dark:border-[#383a40] rounded-xl p-2.5 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none">
                    <option value="SELECTED" className="dark:bg-[#1e1f22]">Selected</option>
                    <option value="REJECTED" className="dark:bg-[#1e1f22]">Rejected</option>
                    <option value="WAITLISTED" className="dark:bg-[#1e1f22]">Waitlisted</option>
                  </select>
                </div>
              </div>
              {editingExp.rounds.map((rd, idx) => (
                <div key={idx} className="space-y-1 p-3 bg-[#f6ece6]/60 dark:bg-[#141517]/60 rounded-[14px] border border-[#e2d8d2] dark:border-[#2b2d31]">
                  <label className="text-[10px] font-bold text-[#006c49] dark:text-[#6cf8bb] uppercase block">Round {idx + 1}</label>
                  <input
                    type="text"
                    value={rd.roundTitle}
                    onChange={(e) => {
                      const rounds = [...editingExp.rounds];
                      rounds[idx] = { ...rounds[idx], roundTitle: e.target.value };
                      setEditingExp({ ...editingExp, rounds });
                    }}
                    className="w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-transparent dark:border-[#383a40] rounded-lg p-2 text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] mb-1 focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={rd.details}
                    onChange={(e) => {
                      const rounds = [...editingExp.rounds];
                      rounds[idx] = { ...rounds[idx], details: e.target.value };
                      setEditingExp({ ...editingExp, rounds });
                    }}
                    className="w-full bg-[#ffffff] dark:bg-[#1e1f22] border border-transparent dark:border-[#383a40] rounded-lg p-2 text-xs text-[#1f1b17] dark:text-[#e3e3e3] focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingExp(null)} className="px-4 py-2 text-xs font-bold text-[#747878] dark:text-[#6e7278] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]">Cancel</button>
              <button onClick={handleSaveEdit} className="px-5 py-2 bg-purple-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
