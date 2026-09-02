import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/services/progress.service';
import AptitudeStatsWidget from '@/components/AptitudeStatsWidget';
import FormulaCheatSheetModal from '@/components/FormulaCheatSheetModal';
import {
  Folder,
  Calculator,
  BarChart3,
  Brain,
  GitMerge,
  MessageSquare,
  Compass,
  Terminal,
  Search,
  ChevronRight,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  BookOpen,
  PieChart,
  Activity,
  Layers,
  HelpCircle,
  Hash,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
} from 'lucide-react';

export interface AptitudeTopic {
  id: string;
  name: string;
  cluster: string;
  description: string;
  icon?: any;
  icon_name?: string;
  formulas?: string[];
  is_hidden?: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Folder,
  Calculator,
  BarChart3,
  Brain,
  GitMerge,
  MessageSquare,
  Compass,
  Terminal,
  Search,
  BookOpen,
  PieChart,
  Activity,
  Layers,
  HelpCircle,
  Hash,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
};

const getIcon = (iconName?: string) => {
  if (!iconName) return Folder;
  return ICON_MAP[iconName] || Folder;
};

export default function AptitudePage() {
  const { categorySlug = 'arithmetic-aptitude' } = useParams<{ categorySlug: string }>();
  const { isAdmin, user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  const [showCheatSheetModal, setShowCheatSheetModal] = useState(false);

  // New Admin UI states
  const [isEditing, setIsEditing] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Partial<AptitudeTopic> | null>(null);

  // Fetch Topics from Supabase
  const { data: rawTopics = [], refetch: refetchTopics, isLoading: isTopicsLoading } = useQuery<AptitudeTopic[]>({
    queryKey: ['aptitude-topics-db', categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aptitude_topics')
        .select('*')
        .eq('category_slug', categorySlug)
        .order('id', { ascending: true });
        
      if (error) throw error;
      
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        cluster: d.cluster,
        description: d.description,
        icon_name: d.icon_name,
        icon: getIcon(d.icon_name),
        formulas: d.formulas || [],
        is_hidden: d.is_hidden
      }));
    }
  });

  // Filter topics (Admins see all, Users see only visible)
  const currentCategoryTopics = rawTopics.filter(t => isAdmin || !t.is_hidden);

  // Fetch live question counts
  const { data: liveCountMap = {} } = useQuery<Record<string, number>>({
    queryKey: ['topic-question-counts', categorySlug],
    queryFn: async () => {
      if (!currentCategoryTopics.length) return {};
      const topicIds = currentCategoryTopics.map(t => t.id);
      
      let allFetchedData: any[] = [];
      let page = 0;
      const PAGE_SIZE = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('topic_questions')
          .select('topic_id')
          .in('topic_id', topicIds)
          .eq('is_deleted', false)
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error) {
          console.warn('Failed to fetch live topic question counts:', error);
          break;
        }

        if (data && data.length > 0) {
          allFetchedData = allFetchedData.concat(data);
          if (data.length < PAGE_SIZE) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }

      const countMap: Record<string, number> = {};
      topicIds.forEach(id => { countMap[id] = 0; });
      allFetchedData.forEach((row: any) => {
        if (row.topic_id) {
          countMap[row.topic_id] = (countMap[row.topic_id] || 0) + 1;
        }
      });
      return countMap;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: currentCategoryTopics.length > 0
  });

  // Fetch questions for this category to compute live progress stats
  const { data: categoryQuestions = [] } = useQuery({
    queryKey: ['category-questions-stats', categorySlug],
    queryFn: async () => {
      if (!currentCategoryTopics.length) return [];
      const topicIds = currentCategoryTopics.map((t) => t.id);
      
      let allFetchedData: any[] = [];
      let page = 0;
      const PAGE_SIZE = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('topic_questions')
          .select('id, difficulty, topic_id')
          .in('topic_id', topicIds)
          .eq('is_deleted', false)
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error) {
          console.warn('Failed to fetch category questions for stats:', error);
          break;
        }

        if (data && data.length > 0) {
          allFetchedData = allFetchedData.concat(data);
          if (data.length < PAGE_SIZE) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }

      return allFetchedData;
    },
    enabled: currentCategoryTopics.length > 0,
    staleTime: 60 * 1000,
  });

  const categoryStats = useMemo(() => {
    return progressService.computeStats(categoryQuestions, user?.email);
  }, [categoryQuestions, user?.email]);

  const categoryTitles: Record<string, { title: string; subtitle: string; icon: any }> = {
    'arithmetic-aptitude': { title: 'Arithmetic Aptitude', subtitle: 'Practice basic arithmetic problems.', icon: Calculator },
    'data-interpretation': { title: 'Data Interpretation', subtitle: 'Tables, Bar Charts, Pie Charts.', icon: BarChart3 },
    'logical-reasoning': { title: 'Logical Reasoning', subtitle: 'Number Series, Essential Part.', icon: Brain },
    'verbal-reasoning': { title: 'Verbal Reasoning', subtitle: 'Blood Relations, Syllogisms.', icon: GitMerge },
    'verbal-ability': { title: 'Verbal Ability (English)', subtitle: 'Reading Comprehension, Grammar.', icon: MessageSquare },
    'nonverbal-reasoning': { title: 'Nonverbal Reasoning', subtitle: 'Pattern Completion, Mirror Images.', icon: Compass },
    'technical-aptitude': { title: 'Technical & Cognitive Aptitude', subtitle: 'Pseudocode dry-runs, Bitwise logic.', icon: Terminal },
  };

  const currentCategoryInfo = categoryTitles[categorySlug] || categoryTitles['arithmetic-aptitude'];
  const MainIcon = currentCategoryInfo.icon;

  const rawClusters = Array.from(new Set(currentCategoryTopics.map(t => t.cluster)));
  const clusterList = ['All', ...rawClusters];

  const sortedTopics = currentCategoryTopics.filter((t) => {
    const matchesCluster = selectedCluster === 'All' || t.cluster === selectedCluster;
    const matchesSearch = !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCluster && matchesSearch;
  });

  // ADMIN ACTIONS
  const handleToggleHide = async (e: React.MouseEvent, topic: AptitudeTopic) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;
    
    const { error } = await supabase
      .from('aptitude_topics')
      .update({ is_hidden: !topic.is_hidden })
      .eq('id', topic.id);
      
    if (!error) {
      refetchTopics();
    } else {
      alert("Error updating visibility: " + error.message);
    }
  };

  const handleDelete = async (e: React.MouseEvent, topic: AptitudeTopic) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;
    
    if (confirm(`Are you sure you want to permanently delete "${topic.name}"?`)) {
      const { error } = await supabase
        .from('aptitude_topics')
        .delete()
        .eq('id', topic.id);
        
      if (!error) {
        refetchTopics();
      } else {
        alert("Error deleting topic: " + error.message);
      }
    }
  };

  const openEditor = (e: React.MouseEvent, topic?: AptitudeTopic) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;

    if (topic) {
      setEditingTopic({ ...topic });
    } else {
      setEditingTopic({
        id: '',
        name: '',
        cluster: rawClusters.length ? rawClusters[0] : 'New Cluster',
        description: '',
        icon_name: 'Folder',
        formulas: [],
        is_hidden: false
      });
    }
    setIsEditing(true);
  };

  const saveTopic = async () => {
    if (!editingTopic || !editingTopic.id || !editingTopic.name) {
      alert("ID and Name are required");
      return;
    }

    const payload = {
      id: editingTopic.id,
      category_slug: categorySlug,
      name: editingTopic.name,
      cluster: editingTopic.cluster,
      description: editingTopic.description || '',
      icon_name: editingTopic.icon_name || 'Folder',
      is_hidden: !!editingTopic.is_hidden,
      formulas: editingTopic.formulas || []
    };

    const { error } = await supabase
      .from('aptitude_topics')
      .upsert(payload);

    if (error) {
      alert("Error saving topic: " + error.message);
    } else {
      setIsEditing(false);
      setEditingTopic(null);
      refetchTopics();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12 font-sans relative">
      {/* 🚀 UNIFIED HEADER BANNER: Title on Left, Analytics on Right */}
      <div className="rounded-xl border border-[#E9ECEF] dark:border-[#242424] bg-white dark:bg-[#141414] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 sm:max-w-md shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
              <MainIcon className="w-3 h-3" />
              <span>Aptitude Topic Directory</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
              {currentCategoryInfo.title}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-sans mt-0.5">
              {currentCategoryInfo.subtitle}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCheatSheetModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FD4A32]/10 hover:bg-[#FD4A32]/20 text-[#FD4A32] border border-[#FD4A32]/25 text-xs font-display font-bold transition-all cursor-pointer shadow-2xs"
                title="Export formula cheat sheet as PDF"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Export Cheat Sheet (PDF)</span>
              </button>
            </div>
          </div>

          <div className="flex-1 lg:max-w-2xl">
            <AptitudeStatsWidget
              stats={categoryStats}
              title={`${currentCategoryInfo.title} Progress`}
              variant="embedded"
              showBadges={false}
            />
          </div>
        </div>
      </div>

      {/* 🏷️ CLUSTER SUB-TOPIC PILLS + COMPACT SEARCH BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {clusterList.map((cluster) => {
            const isActive = selectedCluster === cluster;
            return (
              <button
                key={cluster}
                onClick={() => setSelectedCluster(cluster)}
                className={`px-3 py-1.5 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#121417] dark:bg-white text-white dark:text-black border-[#121417] dark:border-white shadow-xs'
                    : 'bg-white dark:bg-[#141414] border-[#E9ECEF] dark:border-[#242424] text-[#868E96] dark:text-[#555555] hover:border-[#121417]'
                }`}
              >
                {cluster}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          <div className="relative w-48 sm:w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
            <input
              type="text"
              placeholder="Search sub-topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
            />
          </div>

          {isAdmin && (
            <button
              onClick={(e) => openEditor(e)}
              className="px-2.5 py-1 bg-[#121417] dark:bg-white text-white dark:text-black rounded-md text-xs font-bold shrink-0 hover:bg-[#333] transition cursor-pointer whitespace-nowrap"
            >
              + Add Topic
            </button>
          )}
        </div>
      </div>

      {isTopicsLoading ? (
        <div className="py-12 text-center text-sm text-gray-500 font-bold">Loading Topics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {sortedTopics.map((topic) => {
            const TopicIcon = topic.icon || Folder;
            const displayCount = liveCountMap[topic.id] ?? 0;
            const isHidden = topic.is_hidden;
            const solvedCount = categoryStats.topicMastery[topic.id]?.solved ?? 0;

            return (
              <div key={topic.id} className="relative group">
                <Link
                  to={`/aptitude/${categorySlug}/topic/${topic.id}`}
                  className={`flex items-center justify-between p-3 bg-white dark:bg-[#141414] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] border ${isHidden ? 'border-dashed border-red-300 dark:border-red-900 opacity-60' : 'border-[#E9ECEF] dark:border-[#242424] hover:border-[#121417] dark:hover:border-[#383838]'} rounded-md transition-all duration-150 shadow-2xs`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded bg-[#FD4A32]/10 dark:bg-[#FD4A32]/10 border border-[#FD4A32]/20 dark:border-[#FD4A32]/30 text-[#FD4A32] dark:text-[#FD4A32] flex items-center justify-center shrink-0">
                      <TopicIcon className="w-3.5 h-3.5 text-[#FD4A32]" />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-display font-bold text-xs text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] transition-colors truncate">
                        {topic.name} {isHidden && <span className="ml-1 text-[9px] text-red-500 uppercase">(Hidden)</span>}
                      </span>
                      <span className="text-[10px] text-gray-400">{topic.cluster}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pr-12">
                    {solvedCount > 0 && (
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {solvedCount} Solved
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] font-display font-bold text-[#121417] dark:text-[#E9ECEF] bg-[#F1F3F5] dark:bg-[#202020] px-2.5 py-1 rounded border border-[#E9ECEF] dark:border-[#2E2E2E] group-hover:border-[#FD4A32] group-hover:text-[#FD4A32] transition-colors">
                      <span>{displayCount} {displayCount === 1 ? 'Question' : 'Questions'}</span>
                      <ChevronRight className="w-3 h-3 text-[#868E96]" />
                    </span>
                  </div>
                </Link>

                {isAdmin && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handleToggleHide(e, topic)} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 cursor-pointer" title={isHidden ? "Unhide" : "Hide"}>
                      {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={(e) => openEditor(e, topic)} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-blue-500 cursor-pointer" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => handleDelete(e, topic)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 cursor-pointer" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {isEditing && editingTopic && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg max-w-lg w-full p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-lg dark:text-white">{editingTopic.id ? 'Edit Topic' : 'Add New Topic'}</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Topic ID (slug) *</label>
                <input type="text" value={editingTopic.id} onChange={(e) => setEditingTopic({...editingTopic, id: e.target.value})} disabled={!!editingTopic.name && editingTopic.id !== ''} className="w-full bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#333] rounded px-3 py-2 text-sm text-black dark:text-white" placeholder="e.g., numbers" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Name *</label>
                <input type="text" value={editingTopic.name} onChange={(e) => setEditingTopic({...editingTopic, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#333] rounded px-3 py-2 text-sm text-black dark:text-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Cluster</label>
                <input type="text" value={editingTopic.cluster} onChange={(e) => setEditingTopic({...editingTopic, cluster: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#333] rounded px-3 py-2 text-sm text-black dark:text-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Description</label>
                <textarea value={editingTopic.description} onChange={(e) => setEditingTopic({...editingTopic, description: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#333] rounded px-3 py-2 text-sm text-black dark:text-white h-20" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Icon Name (Lucide React)</label>
                <input type="text" value={editingTopic.icon_name} onChange={(e) => setEditingTopic({...editingTopic, icon_name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#333] rounded px-3 py-2 text-sm text-black dark:text-white" placeholder="Folder, Calculator, etc." />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isHidden" checked={editingTopic.is_hidden} onChange={(e) => setEditingTopic({...editingTopic, is_hidden: e.target.checked})} className="rounded text-red-500" />
                <label htmlFor="isHidden" className="text-sm font-bold dark:text-white cursor-pointer">Hide this topic from users</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#333]">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Cancel</button>
              <button onClick={saveTopic} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-bold">Save Topic</button>
            </div>
          </div>
        </div>
      )}

      {/* 📖 Formula Cheat Sheet Modal */}
      <FormulaCheatSheetModal
        isOpen={showCheatSheetModal}
        onClose={() => setShowCheatSheetModal(false)}
        categoryTitle={currentCategoryInfo.title}
        categorySlug={categorySlug}
        topics={rawTopics}
      />
    </div>
  );
}
