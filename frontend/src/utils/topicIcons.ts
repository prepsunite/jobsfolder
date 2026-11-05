import React from 'react';
import {
  // Numbers & Math
  Binary,
  Hash,
  Split,
  Divide,
  Calculator,
  Percent,
  TrendingUp,
  CircleDollarSign,
  Scale,
  Handshake,
  Link2,
  Hourglass,
  Pipette,
  Gauge,
  Navigation,
  Navigation2,
  TrainTrack,
  Train,
  Sailboat,
  PiggyBank,
  LineChart,
  Receipt,
  Triangle,
  Square,
  Box,
  Flag,
  Trophy,
  Combine,
  Dices,
  Equal,
  CalendarDays,
  Clock,
  ScanSearch,
  ListOrdered,
  Superscript,

  // Data Interpretation
  Table,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Radar,
  ScatterChart,

  // Logical & Reasoning
  ArrowLeftRight,
  Speech,
  Gamepad2,
  Puzzle,
  MessageSquareQuote,
  CheckCircle2,
  Languages,
  Gavel,
  Milestone,
  Workflow,
  GitFork,
  Origami,
  SpellCheck,
  FileEdit,
  FlipHorizontal,
  Shapes,
  FolderTree,
  Tag,
  Tags,
  Users,
  Eye,
  HelpCircle,
  Lightbulb,
  Search,
  BookOpen,
  CheckSquare,

  // DSA Patterns & Algorithms
  ScanLine,
  SlidersHorizontal,
  FastForward,
  GalleryVerticalEnd,
  ListFilter,
  Network,
  TableProperties,
  Undo2,
  ArrowDownWideNarrow,
  Zap,
  Grid,
  GitMerge,
  RotateCcw,

  // Technical & Systems Architecture
  Cpu,
  Database,
  Boxes,
  Target,
  ShieldCheck,
  Globe,
  Terminal,
  Code2,
  Code,
  Folder,
  Layers,
  FileCode,
  Laptop,
} from 'lucide-react';

/**
 * 🎯 MASTER ICON REGISTRY FOR PREPUNITE
 * Every single aptitude, technical DSA pattern, and interview topic
 * is mapped to a semantically accurate, professional SVG icon.
 * NO generic "AI slop" or decorative Sparkles placeholders.
 */

// ── 1. ALL APTITUDE & REASONING TOPICS ──
const APTITUDE_TOPIC_MAP: Record<string, React.ComponentType<any>> = {
  // Arithmetic Aptitude
  'numbers': Hash,
  'problems-on-numbers': Binary,
  'hcf-lcm': Split,
  'decimal-fraction': Divide,
  'simplification': Calculator,
  'square-cube-root': Superscript,
  'percentage': Percent,
  'profit-and-loss': TrendingUp,
  'ratio-and-proportion': Scale,
  'partnership': Handshake,
  'chain-rule': Link2,
  'time-and-work': Hourglass,
  'pipes-and-cistern': Pipette,
  'time-and-distance': Gauge,
  'problems-on-trains': TrainTrack,
  'boats-and-streams': Sailboat,
  'alligation-or-mixture': Scale,
  'simple-interest': CircleDollarSign,
  'compound-interest': PiggyBank,
  'stocks-and-shares': LineChart,
  'true-discount': Receipt,
  'bankers-discount': Receipt,
  'height-and-distance': Triangle,
  'area': Square,
  'volume-and-surface-area': Box,
  'races-and-games': Flag,
  'permutation-and-combination': Combine,
  'probability': Dices,
  'average': Equal,
  'problems-on-ages': Hourglass,
  'calendar': CalendarDays,
  'clock': Clock,
  'odd-man-out-and-series': ScanSearch,
  'surds-and-indices': Superscript,
  'logarithm': Binary,

  // Data Interpretation
  'table-charts': Table,
  'bar-charts': BarChart3,
  'pie-charts': PieChart,
  'line-charts': LineChart,
  'caselet-di': FileSpreadsheet,
  'radar-web-charts': Radar,
  'scatter-bubble-charts': ScatterChart,
  'scatter-plots': ScatterChart,

  // Logical Reasoning
  'number-series': ListOrdered,
  'letter-and-symbol-series': Binary,
  'verbal-classification': Tags,
  'analogies': ArrowLeftRight,
  'matching-definitions': BookOpen,
  'verbal-reasoning': Speech,
  'logical-games': Gamepad2,
  'statement-and-assumption': MessageSquareQuote,
  'statement-and-conclusion': CheckCircle2,
  'cause-and-effect': Milestone,
  'essential-part': Puzzle,
  'artificial-language': Languages,
  'making-judgments': Gavel,
  'logical-problems': HelpCircle,
  'analyzing-arguments': Lightbulb,
  'course-of-action': Navigation,
  'theme-detection': Search,
  'statement-and-argument': MessageSquareQuote,
  'logical-deduction': Workflow,
  'logical-sequence-of-words': ListOrdered,
  'syllogisms': Workflow,
  'blood-relations': GitFork,
  'cubes-and-dice': Box,
  'seating-arrangement': Users,
  'direction-sense': CompassIconSafe(),

  // Verbal Ability
  'reading-comprehension': BookOpen,
  'spotting-errors': ScanSearch,
  'synonyms': Tags,
  'antonyms': ArrowLeftRight,
  'spellings': SpellCheck,
  'ordering-of-words': ListOrdered,
  'sentence-improvement': FileEdit,
  'ordering-of-sentences': ListOrdered,
  'cloze-test': SlidersHorizontal,

  // Nonverbal Reasoning
  'pattern-completion': Grid,
  'mirror-images': FlipHorizontal,
  'paper-folding': Origami,
  'embedded-images': Eye,
  'shape-construction': Shapes,
};

function CompassIconSafe(): React.ComponentType<any> {
  return Navigation2;
}

// ── 2. TECHNICAL & CODING HUB (DSA PATTERNS + PROGRAMMING 150) ──
const TECHNICAL_TOPIC_MAP: Record<string, React.ComponentType<any>> = {
  // Programming 150 Stages
  'stage-1': Terminal,
  'stage-2': Binary,
  'stage-3': Grid,
  'stage-4': GalleryVerticalEnd,
  'stage-5': TableProperties,
  'stage-6': GitFork,

  // Programming 150 Subtopics
  'syntax-operators': Terminal,
  'conditionals-loops': GitMerge,
  'digit-manipulation': Hash,
  'primes-divisibility': Binary,
  'special-numbers': Trophy,
  'patterns': Grid,
  'arrays-fundamentals': ListOrdered,
  'arrays-two-pointers': ArrowLeftRight,
  'arrays-subarrays': ScanLine,
  'hashing-frequency': Database,
  'matrices-grid': TableProperties,
  'strings-fundamentals': FileCode,
  'strings-algorithms': Search,
  'strings-basics': FileCode,
  'strings-palindromes': FlipHorizontal,
  'strings-word-parsing': FileEdit,
  'recursion-backtracking': Undo2,
  'searching-sorting': ListFilter,
  'bit-manipulation': Binary,

  // 15 Campus DSA Patterns (High-Yield Interview Patterns)
  'dsa-two-pointers': ArrowLeftRight,
  'dsa-sliding-window': ScanLine,
  'dsa-fast-slow-pointers': FastForward,
  'dsa-merge-intervals': SlidersHorizontal,
  'dsa-cyclic-sort': RotateCcw,
  'dsa-inplace-linkedlist': Link2,
  'dsa-tree-bfs': FolderTree,
  'dsa-tree-dfs': GitFork,
  'dsa-two-heaps': ArrowDownWideNarrow,
  'dsa-subsets-backtracking': Undo2,
  'dsa-modified-binary-search': ListFilter,
  'dsa-top-k-elements': Trophy,
  'dsa-01-knapsack-dp': TableProperties,
  'dsa-topological-sort': Network,

  // Technical MCQs
  'mcq-c-programming': Code2,
  'mcq-cpp-programming': Code2,
  'mcq-java-programming': Laptop,
  'mcq-python-programming': Terminal,
  'mcq-data-structures': GalleryVerticalEnd,
  'mcq-algorithms': Workflow,
  'mcq-dbms': Database,
  'mcq-os': Cpu,
  'mcq-computer-networks': Globe,
  'mcq-software-engineering': Boxes,
};

// ── 3. INTERVIEW PREPARATION (CORE CS, HR & PROJECT DEFENSE) ──
const INTERVIEW_TOPIC_MAP: Record<string, React.ComponentType<any>> = {
  // Core CS Subjects
  'topic-dbms': Database,
  'topic-sql': Table,
  'topic-oops': Boxes,
  'topic-os': Cpu,
  'topic-cn': Globe,
  'topic-java': Laptop,
  'topic-c': Code2,
  'topic-cpp': Code2,
  'topic-python': Terminal,

  // HR & Behavioral Competencies
  'topic-hr-intro': Handshake,
  'topic-hr-star': Target,
  'topic-hr-conflict': Users,
  'topic-hr-traps': ShieldCheck,

  // Project Defense & Viva
  'topic-proj-architecture': Boxes,
  'topic-proj-database': Database,
  'topic-proj-scalability': Zap,
  'topic-proj-viva': ShieldCheck,
};

// ── 4. GLOBAL NAMED ICONS (FOR ADMIN DROPDOWNS & BACKWARD COMPATIBILITY) ──
export const ALL_ADMIN_ICONS: Record<string, React.ComponentType<any>> = {
  Binary,
  Hash,
  Split,
  Divide,
  Calculator,
  Percent,
  TrendingUp,
  CircleDollarSign,
  Scale,
  Handshake,
  Link2,
  Hourglass,
  Pipette,
  Gauge,
  Navigation,
  TrainTrack,
  Train,
  Sailboat,
  PiggyBank,
  LineChart,
  Receipt,
  Triangle,
  Square,
  Box,
  Flag,
  Trophy,
  Combine,
  Dices,
  Equal,
  CalendarDays,
  Clock,
  ScanSearch,
  ListOrdered,
  Superscript,
  Table,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Radar,
  ScatterChart,
  ArrowLeftRight,
  Speech,
  Gamepad2,
  Puzzle,
  MessageSquareQuote,
  CheckCircle2,
  Languages,
  Gavel,
  Milestone,
  Workflow,
  GitFork,
  Origami,
  SpellCheck,
  FileEdit,
  FlipHorizontal,
  Shapes,
  FolderTree,
  Tag,
  Tags,
  Users,
  Eye,
  HelpCircle,
  Lightbulb,
  Search,
  BookOpen,
  CheckSquare,
  ScanLine,
  SlidersHorizontal,
  FastForward,
  GalleryVerticalEnd,
  ListFilter,
  Network,
  TableProperties,
  Undo2,
  ArrowDownWideNarrow,
  Zap,
  Grid,
  GitMerge,
  RotateCcw,
  Cpu,
  Database,
  Boxes,
  Target,
  ShieldCheck,
  Globe,
  Terminal,
  Code2,
  Code,
  Folder,
  Layers,
};

/**
 * Resolves an icon for an Aptitude topic with semantic intelligence.
 */
export function getAptitudeTopicIcon(topicId: string, iconName?: string): React.ComponentType<any> {
  const cleanId = (topicId || '').trim().toLowerCase();

  // 1. Exact match in Aptitude map
  if (APTITUDE_TOPIC_MAP[cleanId]) {
    return APTITUDE_TOPIC_MAP[cleanId];
  }

  // 2. Fuzzy substring match in Aptitude map
  for (const [key, icon] of Object.entries(APTITUDE_TOPIC_MAP)) {
    if (cleanId.includes(key) || key.includes(cleanId)) {
      return icon;
    }
  }

  // 3. Admin-selected icon name (if valid and not a fallback)
  if (iconName && ALL_ADMIN_ICONS[iconName] && iconName !== 'Folder' && iconName !== 'Sparkles') {
    return ALL_ADMIN_ICONS[iconName];
  }

  return Calculator;
}

/**
 * Resolves an icon for Technical & Coding problems, stages, and DSA patterns.
 */
export function getTechnicalTopicIcon(topicId: string, iconName?: string): React.ComponentType<any> {
  const cleanId = (topicId || '').trim().toLowerCase();

  // 1. Exact match in Technical map
  if (TECHNICAL_TOPIC_MAP[cleanId]) {
    return TECHNICAL_TOPIC_MAP[cleanId];
  }

  // 2. Fuzzy match in Technical map
  for (const [key, icon] of Object.entries(TECHNICAL_TOPIC_MAP)) {
    if (cleanId.includes(key) || key.includes(cleanId)) {
      return icon;
    }
  }

  // 3. Admin-selected icon name
  if (iconName && ALL_ADMIN_ICONS[iconName] && iconName !== 'Code2' && iconName !== 'Sparkles') {
    return ALL_ADMIN_ICONS[iconName];
  }

  return Code2;
}

/**
 * Resolves an icon for Interview Preparation topics (Core CS, HR, Project Defense).
 */
export function getInterviewTopicIcon(topicId: string, iconName?: string): React.ComponentType<any> {
  const cleanId = (topicId || '').trim().toLowerCase();

  // 1. Exact match in Interview map
  if (INTERVIEW_TOPIC_MAP[cleanId]) {
    return INTERVIEW_TOPIC_MAP[cleanId];
  }

  // 2. Fuzzy match in Interview map
  for (const [key, icon] of Object.entries(INTERVIEW_TOPIC_MAP)) {
    if (cleanId.includes(key) || key.includes(cleanId)) {
      return icon;
    }
  }

  // 3. Admin-selected icon name
  if (iconName && ALL_ADMIN_ICONS[iconName] && iconName !== 'BookOpen' && iconName !== 'Sparkles') {
    return ALL_ADMIN_ICONS[iconName];
  }

  return BookOpen;
}
