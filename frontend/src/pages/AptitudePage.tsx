import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Calculator,
  BarChart3,
  Brain,
  MessageSquare,
  Compass,
  Search,
  ArrowRight,
  Hash,
  Grid,
  Percent,
  Sliders,
  CheckSquare,
  Zap,
  Train,
  Navigation,
  Clock,
  Droplets,
  Ship,
  Link as LinkIcon,
  Flag,
  TrendingUp,
  DollarSign,
  PieChart,
  Users,
  Scale,
  Layers,
  BarChart,
  Tag,
  CreditCard,
  Square,
  Box,
  GitMerge,
  Dices,
  TrendingDown,
  UserCheck,
  Calendar,
  Sparkles,
  ChevronRight,
  XCircle,
  CheckCircle2,
  Folder,
  Code,
  Eye
} from 'lucide-react';

export interface AptitudeTopic {
  id: string;
  name: string;
  cluster: string;
  description: string;
  count: number;
  icon: any;
  formulas?: string[];
}

export const ARITHMETIC_TOPICS: AptitudeTopic[] = [
  // Cluster 1: Number System & Fundamentals
  { id: 'numbers', name: 'Numbers', cluster: 'Number System', icon: Hash, description: 'Real numbers, integers, divisibility rules, and unit digit concepts.', count: 45, formulas: ['Divisibility by 3: Sum of digits is divisible by 3.', 'Unit digit of powers repeats in cycles of 4.', 'Sum of first n natural numbers = n(n+1)/2'] },
  { id: 'problems-on-numbers', name: 'Problems on Numbers', cluster: 'Number System', icon: Calculator, description: 'Word problems based on digits, sum, difference, and product of numbers.', count: 38, formulas: ['Two-digit number: 10x + y', 'Reversed number: 10y + x', 'Difference = 9(x - y)'] },
  { id: 'hcf-lcm', name: 'Problems on H.C.F and L.C.M', cluster: 'Number System', icon: Grid, description: 'Highest Common Factor and Least Common Multiple applications.', count: 40, formulas: ['Product of two numbers = HCF × LCM', 'HCF of fractions = HCF of numerators / LCM of denominators', 'LCM of fractions = LCM of numerators / HCF of denominators'] },
  { id: 'decimal-fraction', name: 'Decimal Fraction', cluster: 'Number System', icon: Percent, description: 'Conversion, recurring decimals, and simplification of fractions.', count: 28, formulas: ['Pure recurring decimal: 0.ab = ab / 99', 'Mixed recurring decimal: 0.a(b) = (ab - a) / 90'] },
  { id: 'simplification', name: 'Simplification', cluster: 'Number System', icon: Sliders, description: 'BODMAS rule dry-runs, algebraic identities, and arithmetic expressions.', count: 50, formulas: ['BODMAS order: Brackets, Orders, Division, Multiplication, Addition, Subtraction', '(a+b)² = a² + 2ab + b²', '(a-b)² = a² - 2ab + b²'] },
  { id: 'square-cube-root', name: 'Square Root and Cube Root', cluster: 'Number System', icon: CheckSquare, description: 'Finding square roots, cube roots, and estimation techniques.', count: 25, formulas: ['√(a×b) = √a × √b', '√(a/b) = √a / √b'] },
  { id: 'surds-indices', name: 'Surds and Indices', cluster: 'Number System', icon: Zap, description: 'Laws of indices, rationalization of surds, and exponent equations.', count: 30, formulas: ['aᵐ × aⁿ = aᵐ⁺ⁿ', 'aᵐ / aⁿ = aᵐ⁻ⁿ', '(aᵐ)ⁿ = aᵐⁿ', 'a⁰ = 1'] },
  { id: 'logarithm', name: 'Logarithm', cluster: 'Number System', icon: Zap, description: 'Logarithmic properties, change of base rule, and log equations.', count: 22, formulas: ['log_a(m × n) = log_a(m) + log_a(n)', 'log_a(m / n) = log_a(m) - log_a(n)', 'log_a(mⁿ) = n × log_a(m)', 'log_a(b) = log_c(b) / log_c(a)'] },

  // Cluster 2: Time, Work & Motion
  { id: 'problems-on-trains', name: 'Problems on Trains', cluster: 'Time & Motion', icon: Train, description: 'Relative speed, train crossing platforms, poles, and moving objects.', count: 42, formulas: ['Km/hr to m/s: Multiply by 5/18', 'm/s to Km/hr: Multiply by 18/5', 'Time to cross stationary object = Length of Train / Speed', 'Time to cross platform = (Train Length + Platform Length) / Speed', 'Relative Speed (same direction) = S1 - S2', 'Relative Speed (opposite direction) = S1 + S2'] },
  { id: 'time-and-distance', name: 'Time and Distance', cluster: 'Time & Motion', icon: Navigation, description: 'Speed calculations, average speed, and journey segment dry-runs.', count: 48, formulas: ['Speed = Distance / Time', 'Average Speed = Total Distance / Total Time', 'If speeds are x and y for equal distances: Avg Speed = (2xy) / (x + y)'] },
  { id: 'time-and-work', name: 'Time and Work', cluster: 'Time & Motion', icon: Clock, description: 'Efficiency ratios, combined work, and alternate day work problems.', count: 55, formulas: ['If A takes n days, 1 day work = 1/n', 'Combined 1 day work of A & B = 1/A + 1/B', 'Time taken together = (A × B) / (A + B)'] },
  { id: 'pipes-and-cistern', name: 'Pipes and Cistern', cluster: 'Time & Motion', icon: Droplets, description: 'Inlet and outlet pipe rates, tank filling/emptying times.', count: 35, formulas: ['Inlet 1 hr work = +1/A', 'Outlet 1 hr work = -1/B', 'Net 1 hr work = 1/A - 1/B'] },
  { id: 'boats-and-streams', name: 'Boats and Streams', cluster: 'Time & Motion', icon: Ship, description: 'Upstream, downstream speeds, and still water velocity formulas.', count: 30, formulas: ['Downstream Speed (d) = u + v', 'Upstream Speed (u_s) = u - v', 'Speed in Still Water (u) = 1/2 × (d + u_s)', 'Speed of Stream (v) = 1/2 × (d - u_s)'] },
  { id: 'chain-rule', name: 'Chain Rule', cluster: 'Time & Motion', icon: LinkIcon, description: 'Direct and indirect proportion, man-days-hours calculations.', count: 26, formulas: ['(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2'] },
  { id: 'races-and-games', name: 'Races and Games', cluster: 'Time & Motion', icon: Flag, description: 'Race track distances, start head-starts, and game scoring logic.', count: 20, formulas: ['A gives B a start of x meters: B runs (D - x) meters when A runs D meters.', 'A beats B by t seconds: B takes t seconds more than A to finish.'] },

  // Cluster 3: Commercial & Business Maths
  { id: 'percentage', name: 'Percentage', cluster: 'Commercial Maths', icon: Percent, description: 'Percentage change, population growth, and election vote problems.', count: 60, formulas: ['Percentage Increase = (Increase / Original) × 100', 'Percentage Decrease = (Decrease / Original) × 100', 'Net % Change = x + y + (xy/100)'] },
  { id: 'profit-and-loss', name: 'Profit and Loss', cluster: 'Commercial Maths', icon: TrendingUp, description: 'Cost price, selling price, markups, discounts, and false weights.', count: 58, formulas: ['Gain = SP - CP', 'Loss = CP - SP', 'Gain % = (Gain / CP) × 100', 'Loss % = (Loss / CP) × 100', 'SP = CP × (100 + Gain%) / 100'] },
  { id: 'simple-interest', name: 'Simple Interest', cluster: 'Commercial Maths', icon: DollarSign, description: 'Principal, rate, time formulas, and annual installment problems.', count: 38, formulas: ['SI = (P × R × T) / 100', 'Amount (A) = P + SI', 'P = (100 × SI) / (R × T)'] },
  { id: 'compound-interest', name: 'Compound Interest', cluster: 'Commercial Maths', icon: PieChart, description: 'Compounding periods, SI vs CI difference, and growth rates.', count: 44, formulas: ['Amount A = P × (1 + R/100)ᵀ', 'CI = A - P', 'Difference (CI - SI) for 2 years = P × (R/100)²'] },
  { id: 'partnership', name: 'Partnership', cluster: 'Commercial Maths', icon: Users, description: 'Capital investments, profit sharing ratios, and active/working partners.', count: 32, formulas: ['Ratio of Profits = (Capital1 × Time1) : (Capital2 × Time2)'] },
  { id: 'ratio-and-proportion', name: 'Ratio and Proportion', cluster: 'Commercial Maths', icon: Scale, description: 'Mean proportion, duplicate ratio, and income/expenditure ratios.', count: 46, formulas: ['If a:b = c:d, then a×d = b×c', 'Mean proportional of a and b = √(a × b)'] },
  { id: 'alligation-or-mixture', name: 'Alligation or Mixture', cluster: 'Commercial Maths', icon: Layers, description: 'Rule of alligation, liquid mixtures, and replacement problems.', count: 34, formulas: ['(Cheaper Quantity / Dearer Quantity) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price)'] },
  { id: 'stocks-and-shares', name: 'Stocks and Shares', cluster: 'Commercial Maths', icon: BarChart, description: 'Nominal value, market value, brokerage, and dividend calculations.', count: 18, formulas: ['Annual Income = Number of Shares × Rate of Dividend × Face Value', 'Return % = (Annual Income / Investment) × 100'] },
  { id: 'true-discount', name: 'True Discount', cluster: 'Commercial Maths', icon: Tag, description: 'Present worth, true discount, and amount due formulas.', count: 20, formulas: ['PW = (100 × Amount) / (100 + R×T)', 'TD = Amount - PW = (PW × R × T) / 100'] },
  { id: 'bankers-discount', name: 'Banker\'s Discount', cluster: 'Commercial Maths', icon: CreditCard, description: 'Banker discount, banker gain, and bill face value calculations.', count: 18, formulas: ['BD = SI on bill amount for unexpired time', 'BG = BD - TD = SI on TD'] },

  // Cluster 4: Geometry & Mensuration
  { id: 'height-and-distance', name: 'Height and Distance', cluster: 'Geometry & Mensuration', icon: Compass, description: 'Angle of elevation, angle of depression, and trigonometric ratios.', count: 28, formulas: ['tan(θ) = Opposite / Adjacent', 'sin(θ) = Opposite / Hypotenuse', 'cos(θ) = Adjacent / Hypotenuse'] },
  { id: 'area', name: 'Area', cluster: 'Geometry & Mensuration', icon: Square, description: '2D shapes: Triangles, rectangles, circles, quadrilaterals, polygons.', count: 40, formulas: ['Area of Circle = πr²', 'Perimeter of Circle = 2πr', 'Area of Triangle = 1/2 × base × height', 'Herons Formula = √(s(s-a)(s-b)(s-c))'] },
  { id: 'volume-and-surface-area', name: 'Volume and Surface Area', cluster: 'Geometry & Mensuration', icon: Box, description: '3D shapes: Cubes, cuboids, cylinders, cones, spheres, hemispheres.', count: 38, formulas: ['Volume of Cylinder = πr²h', 'Surface Area of Cylinder = 2πrh + 2πr²', 'Volume of Sphere = (4/3)πr³', 'Surface Area of Sphere = 4πr²'] },

  // Cluster 5: Modern Maths & Analytics
  { id: 'permutation-and-combination', name: 'Permutation and Combination', cluster: 'Modern Maths', icon: GitMerge, description: 'Factorials, arrangements, selections, and circular permutations.', count: 45, formulas: ['ⁿPᵣ = n! / (n - r)!', 'ⁿCᵣ = n! / [r! × (n - r)!]', 'ⁿCᵣ = ⁿPᵣ / r!'] },
  { id: 'probability', name: 'Probability', cluster: 'Modern Maths', icon: Dices, description: 'Sample spaces, coins, dice, cards, bags, and conditional probability.', count: 50, formulas: ['P(E) = Favorable Outcomes / Total Outcomes', '0 ≤ P(E) ≤ 1', 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)'] },
  { id: 'average', name: 'Average', cluster: 'Modern Maths', icon: TrendingDown, description: 'Weighted average, inclusion/exclusion, and speed averages.', count: 42, formulas: ['Average = Sum of Quantities / Number of Quantities', 'Sum of Quantities = Average × Number of Quantities'] },
  { id: 'problems-on-ages', name: 'Problems on Ages', cluster: 'Modern Maths', icon: UserCheck, description: 'Past, present, and future age ratio equations.', count: 36, formulas: ['If present age is x, age n years ago = x - n', 'Age n years hence = x + n'] },
  { id: 'calendar', name: 'Calendar', cluster: 'Modern Maths', icon: Calendar, description: 'Odd days calculation, leap years, and day of week determination.', count: 28, formulas: ['Ordinary year = 365 days = 52 weeks + 1 odd day', 'Leap year = 366 days = 52 weeks + 2 odd days', 'Year divisible by 4 (or 400 for century) is a leap year.'] },
  { id: 'clock', name: 'Clock', cluster: 'Modern Maths', icon: Clock, description: 'Angle between hands, coincide times, right angles, and gain/loss clocks.', count: 30, formulas: ['Speed of minute hand = 6°/min', 'Speed of hour hand = 0.5°/min', 'Relative speed = 5.5°/min', 'Angle = |30H - 5.5M|'] },
  { id: 'odd-man-out-and-series', name: 'Odd Man Out and Series', cluster: 'Modern Maths', icon: Sparkles, description: 'Pattern recognition, number series completion, and wrong term identification.', count: 40, formulas: ['Check differences between consecutive terms.', 'Check ratio/multiplication factors or square/cube patterns.'] },
];

export const DATA_INTERPRETATION_TOPICS: AptitudeTopic[] = [
  { id: 'table-charts', name: 'Table Charts', cluster: 'Visual Charts', icon: Grid, description: 'Tabular data analysis, growth rates, percentages, and financial summaries.', count: 35, formulas: ['Percentage Change = (New - Old) / Old × 100', 'Average = Sum of all entries / Count of entries'] },
  { id: 'bar-charts', name: 'Bar Charts', cluster: 'Visual Charts', icon: BarChart3, description: 'Single bar, grouped bar, and stacked bar chart interpretation.', count: 40, formulas: ['Ratio of A to B = Value(A) / Value(B)', 'Difference = High Bar - Low Bar'] },
  { id: 'pie-charts', name: 'Pie Charts', cluster: 'Visual Charts', icon: PieChart, description: 'Single pie, dual pie charts, and degree (360°) to percentage conversions.', count: 38, formulas: ['Value = (Angle / 360°) × Total Value', 'Percentage = (Angle / 360°) × 100'] },
  { id: 'line-charts', name: 'Line Charts', cluster: 'Visual Charts', icon: TrendingUp, description: 'Trend lines, multi-line comparisons, profit/loss and sales over time.', count: 36, formulas: ['Growth Rate = (Value in Final Year - Value in Initial Year) / Value in Initial Year'] },
  { id: 'caselet-di', name: 'Caselet & Mixed DI', cluster: 'Advanced DI', icon: Square, description: 'Paragraph-based narrative data, mixed charts (Pie + Table), and Venn diagram DI.', count: 35, formulas: ['Read paragraph thoroughly and formulate a 2D table or set matrix first.'] },
];

export const LOGICAL_REASONING_TOPICS: AptitudeTopic[] = [
  { id: 'number-series', name: 'Number & Symbol Series', cluster: 'Series & Coding', icon: Hash, description: 'Number series, letter series, symbol patterns, and artificial language decoding.', count: 45 },
  { id: 'coding-decoding', name: 'Coding-Decoding & Analogies', cluster: 'Series & Coding', icon: Code, description: 'Letter coding, number substitution, and concept analogies.', count: 40 },
  { id: 'blood-relations', name: 'Blood Relations & Family Trees', cluster: 'Analytical Logic', icon: Users, description: 'Family tree relations, coded relations, and direct relationship puzzles.', count: 35 },
  { id: 'seating-arrangement', name: 'Seating Arrangement & Puzzles', cluster: 'Analytical Logic', icon: Grid, description: 'Linear, circular, facing center/outside seating arrangements and puzzle games.', count: 45 },
  { id: 'direction-sense', name: 'Direction Sense & Spatial Logic', cluster: 'Analytical Logic', icon: Compass, description: 'Compass directions, shadow turns, shortest distance (Pythagoras), and clocks/calendars.', count: 35 },
  { id: 'syllogisms', name: 'Critical Reasoning & Deduction', cluster: 'Deductive Logic', icon: Brain, description: 'Syllogisms, statements & assumptions, conclusions, cause & effect, and courses of action.', count: 50 },
];

export const VERBAL_REASONING_TOPICS: AptitudeTopic[] = [
  { id: 'reading-comprehension', name: 'Reading Comprehension', cluster: 'Reading & Analysis', icon: MessageSquare, description: 'Passage analysis, main idea identification, tone, and inference questions.', count: 50 },
  { id: 'spotting-errors', name: 'Grammar & Spotting Errors', cluster: 'Grammar & Syntax', icon: CheckSquare, description: 'Subject-verb agreement, tenses, prepositions, active/passive voice, and speech changes.', count: 45 },
  { id: 'synonyms', name: 'Vocabulary (Synonyms & Antonyms)', cluster: 'Vocabulary & Words', icon: Tag, description: 'Synonyms, antonyms, spellings, one-word substitutes, and idioms/phrases.', count: 50 },
  { id: 'parajumbles', name: 'Sentence Structuring & Parajumbles', cluster: 'Sentence Flow', icon: Layers, description: 'Ordering of words, sentence rearrangement, and paragraph formation.', count: 40 },
  { id: 'sentence-completion', name: 'Sentence Completion & Cloze Test', cluster: 'Sentence Flow', icon: Sliders, description: 'Fill in the blanks, context fillers, and cloze passage completion.', count: 40 },
  { id: 'verbal-analogies', name: 'Verbal Logic & Analogies', cluster: 'Reading & Analysis', icon: Sparkles, description: 'Verbal analogies, logical sequence of words, data sufficiency, and truth verification.', count: 35 },
];

export const NONVERBAL_REASONING_TOPICS: AptitudeTopic[] = [
  { id: 'pattern-completion', name: 'Visual Series & Pattern Completion', cluster: 'Visual Reasoning', icon: Sparkles, description: 'Progressive figure series, figure matrices, and pattern completions.', count: 40 },
  { id: 'mirror-images', name: 'Mirror & Water Images', cluster: 'Visual Reasoning', icon: Compass, description: 'Lateral mirror reflections and vertical water image inversions.', count: 35 },
  { id: 'paper-folding', name: 'Paper Folding & Cutting', cluster: 'Spatial Reasoning', icon: Square, description: 'Unfolding paper patterns, crease lines, and punch-cut visualizations.', count: 30 },
  { id: 'embedded-images', name: 'Embedded Images & Counting', cluster: 'Spatial Reasoning', icon: Eye, description: 'Hidden shape detection, triangle/square counting, and image analysis.', count: 35 },
  { id: 'cubes-and-dice', name: 'Cubes & Dice', cluster: 'Spatial Reasoning', icon: Box, description: 'Dice nets, opposite faces, painted cube cuts, and 3D spatial problems.', count: 35 },
];

export const getCategoryTopics = (slug: string): AptitudeTopic[] => {
  switch (slug) {
    case 'data-interpretation':
      return DATA_INTERPRETATION_TOPICS;
    case 'logical-reasoning':
      return LOGICAL_REASONING_TOPICS;
    case 'verbal-reasoning':
      return VERBAL_REASONING_TOPICS;
    case 'nonverbal-reasoning':
      return NONVERBAL_REASONING_TOPICS;
    case 'arithmetic-aptitude':
    default:
      return ARITHMETIC_TOPICS;
  }
};

export default function AptitudePage() {
  const { categorySlug = 'arithmetic-aptitude' } = useParams<{ categorySlug: string }>();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<AptitudeTopic | null>(null);

  // Fetch live question counts from Supabase per topic
  const { data: liveCountMap = {} } = useQuery<Record<string, number>>({
    queryKey: ['topic-question-counts', categorySlug],
    queryFn: async () => {
      const topicIds = getCategoryTopics(categorySlug).map(t => t.id);
      const { data, error } = await supabase
        .from('topic_questions')
        .select('topic_id')
        .in('topic_id', topicIds)
        .eq('is_deleted', false)
        .eq('is_hidden', false);
      if (error) throw error;
      const countMap: Record<string, number> = {};
      (data || []).forEach((row: any) => {
        countMap[row.topic_id] = (countMap[row.topic_id] || 0) + 1;
      });
      return countMap;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Category Title Mapping
  const categoryTitles: Record<string, { title: string; subtitle: string; icon: any }> = {
    'arithmetic-aptitude': { title: 'Arithmetic Aptitude', subtitle: 'Select any sub-topic below to access practice questions, formula cheat-sheets, and old exam problems.', icon: Calculator },
    'data-interpretation': { title: 'Data Interpretation', subtitle: 'Tables, Bar Charts, Pie Charts, Line Graphs, and Caselet analysis for online assessments.', icon: BarChart3 },
    'logical-reasoning': { title: 'Logical Reasoning', subtitle: 'Blood Relations, Seating Arrangements, Coding-Decoding, and Syllogisms.', icon: Brain },
    'verbal-reasoning': { title: 'Verbal Reasoning', subtitle: 'Reading Comprehension, Grammar, Parajumbles, and Sentence Completion.', icon: MessageSquare },
    'nonverbal-reasoning': { title: 'Nonverbal Reasoning', subtitle: 'Pattern Completion, Mirror Images, Paper Folding, and Series Completion.', icon: Compass },
  };

  const currentCategoryInfo = categoryTitles[categorySlug] || categoryTitles['arithmetic-aptitude'];
  const MainIcon = currentCategoryInfo.icon;

  const currentCategoryTopics = getCategoryTopics(categorySlug);

  // Dynamically extract clusters for current category
  const rawClusters = Array.from(new Set(currentCategoryTopics.map(t => t.cluster)));
  const clusterList = ['All', ...rawClusters];

  // Filter topics by cluster and search query
  const sortedTopics = currentCategoryTopics.filter((t) => {
    const matchesCluster = selectedCluster === 'All' || t.cluster === selectedCluster;
    const matchesSearch =
      !searchTerm ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCluster && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12 font-sans">
      {/* Sleek Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E9ECEF] dark:border-[#242424] pb-4">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FD4A32]/10 text-[#FD4A32] dark:bg-[#FD4A32]/10 dark:text-[#FD4A32] text-[9px] font-display font-bold uppercase tracking-wider">
            <MainIcon className="w-3 h-3" />
            <span>Aptitude Topic Directory</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-[#FFFFFF] tracking-tight">
            {currentCategoryInfo.title}
          </h1>
          <p className="text-[#868E96] dark:text-[#555555] text-xs font-sans max-w-2xl">
            {currentCategoryInfo.subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96] dark:text-[#555555]" />
          <input
            type="text"
            placeholder="Search sub-topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] focus:border-[#121417] dark:focus:border-[#444444] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#121417] dark:text-[#FFFFFF] placeholder-[#868E96] focus:outline-none transition-colors font-sans"
          />
        </div>
      </div>

      {/* Cluster Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto p-1 scrollbar-none">
        {clusterList.map((cluster) => {
          const isActive = selectedCluster === cluster;
          return (
            <button
              key={cluster}
              onClick={() => setSelectedCluster(cluster)}
              className={`px-3 py-1 rounded-md text-xs font-display font-bold whitespace-nowrap transition-all border ${
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

      {/* 2-COLUMN DIRECTORY LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {sortedTopics.map((topic) => {
          const TopicIcon = topic.icon || Folder;
          const displayCount = liveCountMap[topic.id] ?? topic.count;

          return (
            <div
              key={topic.id}
              className="group flex items-center justify-between p-2.5 bg-white dark:bg-[#141414] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] hover:border-[#121417] dark:hover:border-[#383838] rounded-md transition-all duration-150 shadow-2xs"
            >
              <Link
                to={`/aptitude/${categorySlug}/topic/${topic.id}`}
                className="flex items-center gap-2.5 min-w-0 flex-1"
              >
                <div className="w-7 h-7 rounded bg-[#FD4A32]/10 dark:bg-[#FD4A32]/10 border border-[#FD4A32]/20 dark:border-[#FD4A32]/30 text-[#FD4A32] dark:text-[#FD4A32] flex items-center justify-center shrink-0">
                  <TopicIcon className="w-3.5 h-3.5 text-[#FD4A32]" />
                </div>

                <span className="font-display font-bold text-xs text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32] transition-colors truncate">
                  {topic.name}
                </span>
              </Link>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTopic(topic);
                  }}
                  className="p-1 rounded text-[#FD4A32] hover:opacity-80 transition-colors"
                  title="Peek Formula & Overview"
                >
                  <Zap className="w-3 h-3 text-[#FD4A32]" />
                </button>

                <Link
                  to={`/aptitude/${categorySlug}/topic/${topic.id}`}
                  className="flex items-center gap-1 text-[9px] font-display font-bold text-[#868E96] dark:text-[#555555] bg-[#F8F9FA] dark:bg-[#0C0C0C] px-2 py-0.5 rounded border border-[#E9ECEF] dark:border-[#242424] group-hover:border-[#121417]"
                >
                  <span>{displayCount} Qs</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: SUB-TOPIC DETAIL & FORMULA CHEAT-SHEET */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141414] border border-[#E9ECEF] dark:border-[#242424] rounded-lg max-w-xl w-full p-5 space-y-4 shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E9ECEF] dark:border-[#242424]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#FD4A32]/10 dark:bg-[#FD4A32]/10 border border-[#FD4A32]/20 dark:border-[#FD4A32]/30 text-[#FD4A32] dark:text-[#FD4A32] flex items-center justify-center shrink-0">
                  {selectedTopic.icon ? <selectedTopic.icon className="w-4 h-4 text-[#FD4A32]" /> : <Folder className="w-4 h-4 text-[#FD4A32]" />}
                </div>
                <div>
                  <span className="text-[9px] font-display font-bold text-[#FD4A32] dark:text-[#FD4A32] uppercase tracking-wider block">
                    {selectedTopic.cluster}
                  </span>
                  <h3 className="font-display text-base font-extrabold text-[#121417] dark:text-[#FFFFFF]">
                    {selectedTopic.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1 rounded text-[#868E96] hover:text-[#121417] dark:hover:text-[#FFFFFF] transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Overview */}
            <div className="p-3 bg-[#F8F9FA] dark:bg-[#0C0C0C] rounded-md border border-[#E9ECEF] dark:border-[#242424] space-y-1">
              <span className="text-[9px] font-display font-bold text-[#121417] dark:text-[#FFFFFF] uppercase tracking-wider block">
                Topic Overview
              </span>
              <p className="text-xs text-[#868E96] dark:text-[#555555] font-sans leading-relaxed">
                {selectedTopic.description}
              </p>
            </div>

            {/* Formula Cheat-Sheet */}
            {selectedTopic.formulas && selectedTopic.formulas.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="font-display text-xs font-extrabold text-[#1f1b17] dark:text-[#e3e3e3] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#FD4A32] dark:text-[#FD4A32]" />
                  <span>Key Formulas & Important Concepts</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedTopic.formulas.map((f, i) => (
                    <div key={i} className="p-2.5 bg-[#ffffff] dark:bg-[#2b2d31] border border-[#eae1da] dark:border-[#383a40] rounded-lg text-xs font-mono text-[#FD4A32] dark:text-[#FD4A32] flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#FD4A32] dark:text-[#FD4A32]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[#eae1da] dark:border-[#2b2d31]">
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-[#747878] dark:text-[#a6adbb]"
              >
                Close
              </button>
              <Link
                to={`/aptitude/${categorySlug}/topic/${selectedTopic.id}`}
                onClick={() => setSelectedTopic(null)}
                className="w-full sm:w-auto px-5 py-2 bg-[#FD4A32] hover:bg-[#D62F18] dark:bg-[#FD4A32] dark:hover:bg-[#FF6D59] text-white dark:text-[#141517] font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Practice Questions ({selectedTopic.count})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
