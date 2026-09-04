import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/services/progress.service';
import AptitudeStatsWidget from '@/components/AptitudeStatsWidget';
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
  TrendingDown,
  Clock,
  Calendar,
  Dices,
  Users,
  UserCheck,
  CreditCard,
  Square,
  Box,
  Timer,
  Percent,
  Scale,
  Coins,
  Droplets,
  Train,
  Ship,
  FlaskConical,
  Trophy,
  Table,
  Grid,
  Code,
  CheckSquare,
  CheckCircle2,
  Tag,
  Sliders,
  Shapes,
  Shuffle,
  Binary,
  Lightbulb,
  Puzzle,
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
  TrendingDown,
  Clock,
  Calendar,
  Dices,
  Users,
  UserCheck,
  CreditCard,
  Square,
  Box,
  Timer,
  Percent,
  Scale,
  Coins,
  Droplets,
  Train,
  Ship,
  FlaskConical,
  Trophy,
  Table,
  Grid,
  Code,
  CheckSquare,
  CheckCircle2,
  Tag,
  Sliders,
  Shapes,
  Shuffle,
  Binary,
  Lightbulb,
  Puzzle,
};

const TOPIC_ICON_MAP: Record<string, React.ComponentType<any>> = {
  // Arithmetic Aptitude
  'numbers': Hash,
  'problems-on-numbers': Hash,
  'hcf-lcm': Layers,
  'decimal-fraction': Percent,
  'simplification': Calculator,
  'square-cube-root': Square,
  'percentage': Percent,
  'profit-and-loss': TrendingUp,
  'ratio-and-proportion': Scale,
  'partnership': Users,
  'chain-rule': GitMerge,
  'time-and-work': Activity,
  'pipes-and-cistern': Droplets,
  'time-and-distance': Timer,
  'problems-on-trains': Train,
  'boats-and-streams': Ship,
  'alligation-or-mixture': FlaskConical,
  'simple-interest': Coins,
  'compound-interest': TrendingUp,
  'stocks-and-shares': BarChart3,
  'true-discount': CreditCard,
  'bankers-discount': CreditCard,
  'height-and-distance': Compass,
  'area': Square,
  'volume-and-surface-area': Box,
  'races-and-games': Trophy,
  'permutation-and-combination': Shuffle,
  'probability': Dices,
  'average': TrendingDown,
  'problems-on-ages': UserCheck,
  'calendar': Calendar,
  'clock': Clock,
  'odd-man-out-and-series': Sparkles,
  'surds-and-indices': Binary,
  'logarithm': Binary,

  // Data Interpretation
  'table-charts': Table,
  'bar-charts': BarChart3,
  'pie-charts': PieChart,
  'line-charts': TrendingUp,
  'caselet-di': Square,
  'radar-web-charts': Compass,
  'scatter-bubble-charts': Activity,
  'scatter-plots': Activity,

  // Logical Reasoning
  'number-series': Hash,
  'letter-and-symbol-series': Binary,
  'verbal-classification': Tag,
  'analogies': Shuffle,
  'matching-definitions': BookOpen,
  'verbal-reasoning': Brain,
  'logical-games': Puzzle,
  'statement-and-assumption': MessageSquare,
  'statement-and-conclusion': CheckCircle2,
  'cause-and-effect': GitMerge,
  'essential-part': Puzzle,
  'artificial-language': Code,
  'making-judgments': Scale,
  'logical-problems': HelpCircle,
  'analyzing-arguments': Lightbulb,
  'course-of-action': Compass,
  'theme-detection': Search,
  'statement-and-argument': MessageSquare,
  'logical-deduction': Brain,
  'logical-sequence-of-words': Layers,
  'syllogisms': Brain,
  'blood-relations': Users,
  'cubes-and-dice': Box,
  'seating-arrangement': Grid,
  'direction-sense': Compass,

  // Verbal Ability
  'reading-comprehension': BookOpen,
  'spotting-errors': CheckSquare,
  'synonyms': Tag,
  'antonyms': Shuffle,
  'spellings': CheckSquare,
  'ordering-of-words': Layers,
  'sentence-improvement': Sparkles,
  'ordering-of-sentences': Layers,
  'cloze-test': Sliders,

  // Nonverbal Reasoning
  'pattern-completion': Sparkles,
  'mirror-images': Compass,
  'paper-folding': Square,
  'embedded-images': Eye,
  'shape-construction': Shapes,
};

export const getIcon = (iconName?: string) => {
  if (!iconName) return Folder;
  return ICON_MAP[iconName] || Folder;
};

const getTopicIcon = (topicId: string, iconName?: string): React.ComponentType<any> => {
  if (TOPIC_ICON_MAP[topicId]) {
    return TOPIC_ICON_MAP[topicId];
  }

  if (iconName && ICON_MAP[iconName] && iconName !== 'Folder') {
    return ICON_MAP[iconName];
  }

  for (const [key, icon] of Object.entries(TOPIC_ICON_MAP)) {
    if (topicId.includes(key) || key.includes(topicId)) {
      return icon;
    }
  }

  return Folder;
};

export default function AptitudePage() {
  const { categorySlug = 'arithmetic-aptitude' } = useParams<{ categorySlug: string }>();
  const { isAdmin, user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('All');

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
        icon: getTopicIcon(d.id, d.icon_name),
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

      if (allFetchedData.length > 0) {
        try {
          localStorage.setItem(`prepunite_counts_cache_${categorySlug}`, JSON.stringify(countMap));
        } catch {}
      }

      return countMap;
    },
    initialData: () => {
      try {
        const cached = localStorage.getItem(`prepunite_counts_cache_${categorySlug}`);
        return cached ? JSON.parse(cached) : undefined;
      } catch { return undefined; }
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: currentCategoryTopics.length > 0
  });

  // Fetch questions for this category to compute live progress stats
  const { data: categoryQuestions = [], isLoading: isCatLoading } = useQuery({
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

      if (allFetchedData.length > 0) {
        try {
          localStorage.setItem(`prepunite_cat_q_cache_${categorySlug}`, JSON.stringify(allFetchedData));
        } catch {}
      }

      return allFetchedData;
    },
    initialData: () => {
      try {
        const cached = localStorage.getItem(`prepunite_cat_q_cache_${categorySlug}`);
        return cached ? JSON.parse(cached) : undefined;
      } catch { return undefined; }
    },
    enabled: currentCategoryTopics.length > 0,
    staleTime: 60 * 1000,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleProgressSynced = () => {
      queryClient.invalidateQueries({ queryKey: ['user-aptitude-progress', user?.email] });
    };
    window.addEventListener('prepunite_progress_synced', handleProgressSynced);
    return () => window.removeEventListener('prepunite_progress_synced', handleProgressSynced);
  }, [queryClient, user?.email]);

  // Database-first user question progress query
  const { data: progressRecords = {}, isLoading: isProgressLoading } = useQuery({
    queryKey: ['user-aptitude-progress', user?.email],
    queryFn: async () => {
      if (!user?.email || user.email === 'guest@prepunite.com') {
        return progressService.getAllRecords(user?.email);
      }
      return await progressService.fetchAndSyncFromSupabase(user.email);
    },
    staleTime: 2 * 60 * 1000,
  });

  const categoryStats = useMemo(() => {
    return progressService.computeStatsFromRecords(categoryQuestions, progressRecords);
  }, [categoryQuestions, progressRecords]);

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
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
              <MainIcon className="w-3 h-3 text-[#FD4A32]" />
              <span>Aptitude Topic Directory</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
              {currentCategoryInfo.title}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-sans mt-0.5">
              {currentCategoryInfo.subtitle}
            </p>
          </div>

          <div className="flex-1 lg:max-w-2xl">
            <AptitudeStatsWidget
              stats={categoryStats}
              isLoading={(isCatLoading && categoryQuestions.length === 0) || isProgressLoading}
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
            const TopicIcon = getTopicIcon(topic.id, topic.icon_name);
            const displayCount = liveCountMap[topic.id] ?? 0;
            const isHidden = topic.is_hidden;
            const solvedCount = categoryStats.topicMastery[topic.id]?.solved ?? 0;

            return (
              <div
                key={topic.id}
                className={`group flex items-center justify-between p-3 bg-white dark:bg-[#141414] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] border ${
                  isHidden
                    ? 'border-dashed border-red-300 dark:border-red-900 opacity-60'
                    : 'border-[#E9ECEF] dark:border-[#242424] hover:border-[#FD4A32]/50 dark:hover:border-[#FD4A32]/50'
                } rounded-lg transition-all duration-150 shadow-2xs`}
              >
                {/* 1. Left: Topic Icon & Name (Navigates to questions) */}
                <Link
                  to={`/aptitude/${categorySlug}/topic/${topic.id}`}
                  className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FD4A32]/10 dark:bg-[#FD4A32]/10 border border-[#FD4A32]/20 dark:border-[#FD4A32]/30 text-[#FD4A32] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                    <TopicIcon className="w-4 h-4 text-[#FD4A32]" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-display font-bold text-xs sm:text-sm text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] transition-colors truncate">
                      {topic.name} {isHidden && <span className="ml-1 text-[9px] text-red-500 uppercase">(Hidden)</span>}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{topic.cluster}</span>
                  </div>
                </Link>

                {/* 2. Right: Action Buttons & Navigation */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {solvedCount > 0 && (
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {solvedCount} Solved
                    </span>
                  )}

                  {/* Questions link */}
                  <Link
                    to={`/aptitude/${categorySlug}/topic/${topic.id}`}
                    className="flex items-center gap-1 text-[11px] font-display font-bold text-[#121417] dark:text-[#E9ECEF] bg-[#F1F3F5] dark:bg-[#202020] px-2.5 py-1 rounded border border-[#E9ECEF] dark:border-[#2E2E2E] hover:border-[#FD4A32] hover:text-[#FD4A32] transition-colors"
                  >
                    <span>{displayCount} {displayCount === 1 ? 'Question' : 'Questions'}</span>
                    <ChevronRight className="w-3 h-3 text-[#868E96]" />
                  </Link>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-0.5 ml-1">
                      <button onClick={(e) => handleToggleHide(e, topic)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 cursor-pointer" title={isHidden ? "Unhide" : "Hide"}>
                        {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                      <button onClick={(e) => openEditor(e, topic)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-blue-500 cursor-pointer" title="Edit">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => handleDelete(e, topic)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 cursor-pointer" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
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
    </div>
  );
}
