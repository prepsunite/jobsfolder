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
  Eye,
  List,
  FileJson,
  AlertTriangle,
  Mic,
  AlignLeft,
  Edit2,
  Pointer,
  LayoutGrid,
  BookOpen,
  Terminal,
  Cpu,
  Network,
  Workflow,
  Shuffle,
  CheckCheck,
  KeyRound,
  CircleDot,
  Shapes,
  Combine,
  Boxes,
  HelpCircle,
  Activity,
  Target,
  Split,
  Binary,
  Radio
} from 'lucide-react';

export interface AptitudeTopic {
  id: string;
  name: string;
  cluster: string;
  description: string;
  icon: any;
  formulas?: string[];
}

export const ARITHMETIC_TOPICS: AptitudeTopic[] = [
  // Cluster 1: Number System & Fundamentals
  { id: 'numbers', name: 'Numbers', cluster: 'Number System', icon: Hash, description: 'Real numbers, integers, divisibility rules, and unit digit concepts.', formulas: ['Divisibility by 3: Sum of digits is divisible by 3.', 'Unit digit of powers repeats in cycles of 4.', 'Sum of first n natural numbers = n(n+1)/2'] },
  { id: 'problems-on-numbers', name: 'Problems on Numbers', cluster: 'Number System', icon: Calculator, description: 'Word problems based on digits, sum, difference, and product of numbers.', formulas: ['Two-digit number: 10x + y', 'Reversed number: 10y + x', 'Difference = 9(x - y)'] },
  { id: 'hcf-lcm', name: 'Problems on H.C.F and L.C.M', cluster: 'Number System', icon: Grid, description: 'Highest Common Factor and Least Common Multiple applications.', formulas: ['Product of two numbers = HCF × LCM', 'HCF of fractions = HCF of numerators / LCM of denominators', 'LCM of fractions = LCM of numerators / HCF of denominators'] },
  { id: 'decimal-fraction', name: 'Decimal Fraction', cluster: 'Number System', icon: Percent, description: 'Conversion, recurring decimals, and simplification of fractions.', formulas: ['Pure recurring decimal: 0.ab = ab / 99', 'Mixed recurring decimal: 0.a(b) = (ab - a) / 90'] },
  { id: 'simplification', name: 'Simplification', cluster: 'Number System', icon: Sliders, description: 'BODMAS rule dry-runs, algebraic identities, and arithmetic expressions.', formulas: ['BODMAS order: Brackets, Orders, Division, Multiplication, Addition, Subtraction', '(a+b)² = a² + 2ab + b²', '(a-b)² = a² - 2ab + b²'] },
  { id: 'square-cube-root', name: 'Square Root and Cube Root', cluster: 'Number System', icon: CheckSquare, description: 'Finding square roots, cube roots, and estimation techniques.', formulas: ['√(a×b) = √a × √b', '√(a/b) = √a / √b'] },
  { id: 'surds-indices', name: 'Surds and Indices', cluster: 'Number System', icon: Zap, description: 'Laws of indices, rationalization of surds, and exponent equations.', formulas: ['aᵐ × aⁿ = aᵐ⁺ⁿ', 'aᵐ / aⁿ = aᵐ⁻ⁿ', '(aᵐ)ⁿ = aᵐⁿ', 'a⁰ = 1'] },
  { id: 'logarithm', name: 'Logarithm', cluster: 'Number System', icon: Zap, description: 'Logarithmic properties, change of base rule, and log equations.', formulas: ['log_a(m × n) = log_a(m) + log_a(n)', 'log_a(m / n) = log_a(m) - log_a(n)', 'log_a(mⁿ) = n × log_a(m)', 'log_a(b) = log_c(b) / log_c(a)'] },

  // Cluster 2: Time, Work & Motion
  { id: 'problems-on-trains', name: 'Problems on Trains', cluster: 'Time & Motion', icon: Train, description: 'Relative speed, train crossing platforms, poles, and moving objects.', formulas: ['Km/hr to m/s: Multiply by 5/18', 'm/s to Km/hr: Multiply by 18/5', 'Time to cross stationary object = Length of Train / Speed', 'Time to cross platform = (Train Length + Platform Length) / Speed', 'Relative Speed (same direction) = S1 - S2', 'Relative Speed (opposite direction) = S1 + S2'] },
  { id: 'time-and-distance', name: 'Time and Distance', cluster: 'Time & Motion', icon: Navigation, description: 'Speed calculations, average speed, and journey segment dry-runs.', formulas: ['Speed = Distance / Time', 'Average Speed = Total Distance / Total Time', 'If speeds are x and y for equal distances: Avg Speed = (2xy) / (x + y)'] },
  { id: 'time-and-work', name: 'Time and Work', cluster: 'Time & Motion', icon: Clock, description: 'Efficiency ratios, combined work, and alternate day work problems.', formulas: ['If A takes n days, 1 day work = 1/n', 'Combined 1 day work of A & B = 1/A + 1/B', 'Time taken together = (A × B) / (A + B)'] },
  { id: 'pipes-and-cistern', name: 'Pipes and Cistern', cluster: 'Time & Motion', icon: Droplets, description: 'Inlet and outlet pipe rates, tank filling/emptying times.', formulas: ['Inlet 1 hr work = +1/A', 'Outlet 1 hr work = -1/B', 'Net 1 hr work = 1/A - 1/B'] },
  { id: 'boats-and-streams', name: 'Boats and Streams', cluster: 'Time & Motion', icon: Ship, description: 'Upstream, downstream speeds, and still water velocity formulas.', formulas: ['Downstream Speed (d) = u + v', 'Upstream Speed (u_s) = u - v', 'Speed in Still Water (u) = 1/2 × (d + u_s)', 'Speed of Stream (v) = 1/2 × (d - u_s)'] },
  { id: 'chain-rule', name: 'Chain Rule', cluster: 'Time & Motion', icon: LinkIcon, description: 'Direct and indirect proportion, man-days-hours calculations.', formulas: ['(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2'] },
  { id: 'races-and-games', name: 'Races and Games', cluster: 'Time & Motion', icon: Flag, description: 'Race track distances, start head-starts, and game scoring logic.', formulas: ['A gives B a start of x meters: B runs (D - x) meters when A runs D meters.', 'A beats B by t seconds: B takes t seconds more than A to finish.'] },

  // Cluster 3: Commercial & Business Maths
  { id: 'percentage', name: 'Percentage', cluster: 'Commercial Maths', icon: Percent, description: 'Percentage change, population growth, and election vote problems.', formulas: ['Percentage Increase = (Increase / Original) × 100', 'Percentage Decrease = (Decrease / Original) × 100', 'Net % Change = x + y + (xy/100)'] },
  { id: 'profit-and-loss', name: 'Profit and Loss', cluster: 'Commercial Maths', icon: TrendingUp, description: 'Cost price, selling price, markups, discounts, and false weights.', formulas: ['Gain = SP - CP', 'Loss = CP - SP', 'Gain % = (Gain / CP) × 100', 'Loss % = (Loss / CP) × 100', 'SP = CP × (100 + Gain%) / 100'] },
  { id: 'simple-interest', name: 'Simple Interest', cluster: 'Commercial Maths', icon: DollarSign, description: 'Principal, rate, time formulas, and annual installment problems.', formulas: ['SI = (P × R × T) / 100', 'Amount (A) = P + SI', 'P = (100 × SI) / (R × T)'] },
  { id: 'compound-interest', name: 'Compound Interest', cluster: 'Commercial Maths', icon: PieChart, description: 'Compounding periods, SI vs CI difference, and growth rates.', formulas: ['Amount A = P × (1 + R/100)ᵀ', 'CI = A - P', 'Difference (CI - SI) for 2 years = P × (R/100)²'] },
  { id: 'partnership', name: 'Partnership', cluster: 'Commercial Maths', icon: Users, description: 'Capital investments, profit sharing ratios, and active/working partners.', formulas: ['Ratio of Profits = (Capital1 × Time1) : (Capital2 × Time2)'] },
  { id: 'ratio-and-proportion', name: 'Ratio and Proportion', cluster: 'Commercial Maths', icon: Scale, description: 'Mean proportion, duplicate ratio, and income/expenditure ratios.', formulas: ['If a:b = c:d, then a×d = b×c', 'Mean proportional of a and b = √(a × b)'] },
  { id: 'alligation-or-mixture', name: 'Alligation or Mixture', cluster: 'Commercial Maths', icon: Layers, description: 'Rule of alligation, liquid mixtures, and replacement problems.', formulas: ['(Cheaper Quantity / Dearer Quantity) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price)'] },
  { id: 'stocks-and-shares', name: 'Stocks and Shares', cluster: 'Commercial Maths', icon: BarChart, description: 'Nominal value, market value, brokerage, and dividend calculations.', formulas: ['Annual Income = Number of Shares × Rate of Dividend × Face Value', 'Return % = (Annual Income / Investment) × 100'] },
  { id: 'true-discount', name: 'True Discount', cluster: 'Commercial Maths', icon: Tag, description: 'Present worth, true discount, and amount due formulas.', formulas: ['PW = (100 × Amount) / (100 + R×T)', 'TD = Amount - PW = (PW × R × T) / 100'] },
  { id: 'bankers-discount', name: 'Banker\'s Discount', cluster: 'Commercial Maths', icon: CreditCard, description: 'Banker discount, banker gain, and bill face value calculations.', formulas: ['BD = SI on bill amount for unexpired time', 'BG = BD - TD = SI on TD'] },

  // Cluster 4: Geometry & Mensuration
  { id: 'geometry-theorems', name: 'Geometry & Polygons', cluster: 'Geometry & Mensuration', icon: Shapes, description: 'Lines, angles, triangle theorems, similarity, tangents, and regular polygons.', formulas: ['Sum of angles in n-sided polygon = (n - 2) × 180°', 'Pythagorean Theorem: a² + b² = c²'] },
  { id: 'height-and-distance', name: 'Height and Distance', cluster: 'Geometry & Mensuration', icon: Compass, description: 'Angle of elevation, angle of depression, and trigonometric ratios.', formulas: ['tan(θ) = Opposite / Adjacent', 'sin(θ) = Opposite / Hypotenuse', 'cos(θ) = Adjacent / Hypotenuse'] },
  { id: 'area', name: 'Area & Perimeter', cluster: 'Geometry & Mensuration', icon: Square, description: '2D shapes: Triangles, rectangles, circles, quadrilaterals, polygons.', formulas: ['Area of Circle = πr²', 'Perimeter of Circle = 2πr', 'Area of Triangle = 1/2 × base × height', 'Herons Formula = √(s(s-a)(s-b)(s-c))'] },
  { id: 'volume-and-surface-area', name: 'Volume and Surface Area', cluster: 'Geometry & Mensuration', icon: Box, description: '3D shapes: Cubes, cuboids, cylinders, cones, spheres, hemispheres.', formulas: ['Volume of Cylinder = πr²h', 'Surface Area of Cylinder = 2πrh + 2πr²', 'Volume of Sphere = (4/3)πr³', 'Surface Area of Sphere = 4πr²'] },
  { id: 'coordinate-geometry', name: 'Coordinate Geometry', cluster: 'Geometry & Mensuration', icon: Target, description: 'Slope of line, distance between points, section formula, and circle equations.', formulas: ['Distance = √((x₂-x₁)² + (y₂-y₁)²)', 'Slope m = (y₂-y₁) / (x₂-x₁)', 'Equation: y = mx + c'] },
  { id: 'trigonometry', name: 'Trigonometry & Identities', cluster: 'Geometry & Mensuration', icon: Activity, description: 'Trigonometric functions, identities, complementary angles, and radian measures.', formulas: ['sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ', '1 + cot²θ = cosec²θ'] },

  // Cluster 5: Algebra & Higher Maths
  { id: 'algebra-quadratic-equations', name: 'Algebra & Quadratic Equations', cluster: 'Algebra & Higher Maths', icon: Sliders, description: 'Polynomial roots, discriminant, quadratic factoring, and maxima/minima.', formulas: ['Roots = (-b ± √(b² - 4ac)) / (2a)', 'Sum of roots = -b/a', 'Product of roots = c/a'] },
  { id: 'progressions-ap-gp-hp', name: 'Progressions (AP, GP, HP)', cluster: 'Algebra & Higher Maths', icon: TrendingUp, description: 'Arithmetic, Geometric, and Harmonic progressions, nth terms, and series sums.', formulas: ['AP nth term: a + (n-1)d', 'AP Sum: (n/2)[2a + (n-1)d]', 'GP nth term: a·rⁿ⁻¹', 'GP Sum: a(rⁿ - 1)/(r - 1)'] },
  { id: 'set-theory', name: 'Set Theory & Venn Math', cluster: 'Algebra & Higher Maths', icon: PieChart, description: '2-set & 3-set cardinalities, union, intersection, and set maxima/minima.', formulas: ['n(A ∪ B) = n(A) + n(B) - n(A ∩ B)', 'n(A ∪ B ∪ C) = n(A)+n(B)+n(C)-n(A∩B)-n(B∩C)-n(C∩A)+n(A∩B∩C)'] },

  // Cluster 6: Modern Maths & Analytics
  { id: 'permutation-and-combination', name: 'Permutation and Combination', cluster: 'Modern Maths', icon: GitMerge, description: 'Factorials, arrangements, selections, and circular permutations.', formulas: ['ⁿPᵣ = n! / (n - r)!', 'ⁿCᵣ = n! / [r! × (n - r)!]', 'ⁿCᵣ = ⁿPᵣ / r!'] },
  { id: 'probability', name: 'Probability', cluster: 'Modern Maths', icon: Dices, description: 'Sample spaces, coins, dice, cards, bags, and conditional probability.', formulas: ['P(E) = Favorable Outcomes / Total Outcomes', '0 ≤ P(E) ≤ 1', 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)'] },
  { id: 'average', name: 'Average', cluster: 'Modern Maths', icon: TrendingDown, description: 'Weighted average, inclusion/exclusion, and speed averages.', formulas: ['Average = Sum of Quantities / Number of Quantities', 'Sum of Quantities = Average × Number of Quantities'] },
  { id: 'problems-on-ages', name: 'Problems on Ages', cluster: 'Modern Maths', icon: UserCheck, description: 'Past, present, and future age ratio equations.', formulas: ['If present age is x, age n years ago = x - n', 'Age n years hence = x + n'] },
  { id: 'calendar', name: 'Calendar', cluster: 'Modern Maths', icon: Calendar, description: 'Odd days calculation, leap years, and day of week determination.', formulas: ['Ordinary year = 365 days = 52 weeks + 1 odd day', 'Leap year = 366 days = 52 weeks + 2 odd days', 'Year divisible by 4 (or 400 for century) is a leap year.'] },
  { id: 'clock', name: 'Clock', cluster: 'Modern Maths', icon: Clock, description: 'Angle between hands, coincide times, right angles, and gain/loss clocks.', formulas: ['Speed of minute hand = 6°/min', 'Speed of hour hand = 0.5°/min', 'Relative speed = 5.5°/min', 'Angle = |30H - 5.5M|'] },
  { id: 'odd-man-out-and-series', name: 'Odd Man Out and Series', cluster: 'Modern Maths', icon: Sparkles, description: 'Pattern recognition, number series completion, and wrong term identification.', formulas: ['Check differences between consecutive terms.', 'Check ratio/multiplication factors or square/cube patterns.'] },
];

export const DATA_INTERPRETATION_TOPICS: AptitudeTopic[] = [
  // Cluster 1: Visual Charts
  { id: 'table-charts', name: 'Table Charts', cluster: 'Visual Charts', icon: Grid, description: 'Tabular data analysis, growth rates, percentages, and financial summaries.', formulas: ['Percentage Change = (New - Old) / Old × 100', 'Average = Sum of all entries / Count of entries'] },
  { id: 'bar-charts', name: 'Bar Charts', cluster: 'Visual Charts', icon: BarChart3, description: 'Single bar, grouped bar, and stacked bar chart interpretation.', formulas: ['Ratio of A to B = Value(A) / Value(B)', 'Difference = High Bar - Low Bar'] },
  { id: 'pie-charts', name: 'Pie Charts', cluster: 'Visual Charts', icon: PieChart, description: 'Single pie, dual pie charts, and degree (360°) to percentage conversions.', formulas: ['Value = (Angle / 360°) × Total Value', 'Percentage = (Angle / 360°) × 100'] },
  { id: 'line-charts', name: 'Line Charts', cluster: 'Visual Charts', icon: TrendingUp, description: 'Trend lines, multi-line comparisons, profit/loss and sales over time.', formulas: ['Growth Rate = (Value in Final Year - Value in Initial Year) / Value in Initial Year'] },
  { id: 'radar-web-charts', name: 'Radar & Spider Web Charts', cluster: 'Visual Charts', icon: Radio, description: 'Multivariable spider/web charts comparing performance metrics across dimensions.', formulas: ['Radial Axis Value = (Value on Axis / Max Axis Value) × 100'] },
  { id: 'scatter-bubble-charts', name: 'Scatter Plots & Bubble Charts', cluster: 'Visual Charts', icon: CircleDot, description: 'Correlation, distribution patterns, and three-variable bubble charts.', formulas: ['Correlation = Direction and density of plot clusters'] },

  // Cluster 2: Advanced DI
  { id: 'caselet-di', name: 'Caselet & Mixed DI', cluster: 'Advanced DI', icon: Square, description: 'Paragraph-based narrative data, mixed charts (Pie + Table), and Venn diagram DI.', formulas: ['Read paragraph thoroughly and formulate a 2D table or set matrix first.'] },
  { id: 'missing-di', name: 'Missing Data Interpretation', cluster: 'Advanced DI', icon: HelpCircle, description: 'Incomplete tables and charts where missing values must be deduced using clues.', formulas: ['Missing Value = Total - Sum of known items in row/col'] },
];

export const LOGICAL_REASONING_TOPICS: AptitudeTopic[] = [
  // Cluster 1: Core Logic & Series
  { id: 'number-series', name: 'Number Series', cluster: 'Core Logic & Series', icon: Hash, description: 'Number sequence and finding missing terms.' },
  { id: 'letter-and-symbol-series', name: 'Letter and Symbol Series', cluster: 'Core Logic & Series', icon: Code, description: 'Alphabetical and symbol patterns.' },
  { id: 'essential-part', name: 'Essential Part', cluster: 'Core Logic & Series', icon: Zap, description: 'Identifying the most essential part of an object/concept.' },
  { id: 'artificial-language', name: 'Artificial Language', cluster: 'Core Logic & Series', icon: MessageSquare, description: 'Decoding fabricated languages.' },
  { id: 'matching-definitions', name: 'Matching Definitions', cluster: 'Core Logic & Series', icon: CheckSquare, description: 'Matching scenarios to definitions.' },
  { id: 'making-judgments', name: 'Making Judgments', cluster: 'Core Logic & Series', icon: Scale, description: 'Evaluating situations and making decisions.' },
  
  // Cluster 2: Deductive & Placement Puzzles
  { id: 'logical-problems', name: 'Logical Problems', cluster: 'Deductive & Placement Puzzles', icon: Brain, description: 'General logical and analytical puzzles.' },
  { id: 'logical-games', name: 'Logical Games', cluster: 'Deductive & Placement Puzzles', icon: Dices, description: 'Game-based logic.' },
  { id: 'cryptarithmetic', name: 'Cryptarithmetic (Alphametics)', cluster: 'Deductive & Placement Puzzles', icon: KeyRound, description: 'Letter-to-digit substitution math puzzles (e.g., SEND + MORE = MONEY).' },
  { id: 'machine-input-output', name: 'Machine Input-Output', cluster: 'Deductive & Placement Puzzles', icon: Shuffle, description: 'Step-by-step rearrangement algorithms for words and numbers.' },
  { id: 'inequalities', name: 'Mathematical & Coded Inequalities', cluster: 'Deductive & Placement Puzzles', icon: Split, description: 'Evaluating statement relationships with inequality symbols (> , < , =, ≤, ≥).' },
  { id: 'order-and-ranking', name: 'Order and Ranking', cluster: 'Deductive & Placement Puzzles', icon: List, description: 'Position from left/right in a row, position swapping, and total count.' },
  { id: 'floor-scheduling-puzzles', name: 'Floor & Scheduling Puzzles', cluster: 'Deductive & Placement Puzzles', icon: Boxes, description: 'Multi-variable grid arrangements (floors, days, colors, professions).' },
  { id: 'games-and-tournaments', name: 'Games and Tournaments', cluster: 'Deductive & Placement Puzzles', icon: Flag, description: 'Round-robin points tables, knockout bracket deductions, and seeding logic.' },
  { id: 'truth-tellers-liars', name: 'Truth-Tellers and Liars', cluster: 'Deductive & Placement Puzzles', icon: UserCheck, description: 'Binary logic puzzles with alternating, true, and false speaker statements.' },
  { id: 'eligibility-test', name: 'Eligibility Test & Decision Making', cluster: 'Deductive & Placement Puzzles', icon: CheckCheck, description: 'Candidate condition matching, exception handling, and HR referral logic.' },
  
  // Cluster 3: Critical & Structured Logic
  { id: 'analyzing-arguments', name: 'Analyzing Arguments', cluster: 'Critical Logic', icon: Scale, description: 'Evaluating strong and weak arguments.' },
  { id: 'course-of-action', name: 'Course of Action', cluster: 'Critical Logic', icon: Flag, description: 'Selecting appropriate actions for a problem.' },
  { id: 'theme-detection', name: 'Theme Detection', cluster: 'Critical Logic', icon: Search, description: 'Identifying the underlying theme of a passage.' },
  { id: 'statement-and-argument', name: 'Statement and Argument', cluster: 'Critical Logic', icon: MessageSquare, description: 'Validating arguments based on statements.' },
  { id: 'statement-and-assumption', name: 'Statement and Assumption', cluster: 'Critical Logic', icon: Brain, description: 'Finding implicit assumptions in statements.' },
  { id: 'statement-and-conclusion', name: 'Statement and Conclusion', cluster: 'Critical Logic', icon: CheckCircle2, description: 'Deriving direct conclusions.' },
  { id: 'logical-deduction', name: 'Logical Deduction', cluster: 'Critical Logic', icon: Layers, description: 'Deducing logic from multiple premises.' }
];

export const VERBAL_REASONING_TOPICS: AptitudeTopic[] = [
  // Cluster 1: Relational & Spatial
  { id: 'blood-relations', name: 'Blood Relation Test', cluster: 'Relational & Spatial', icon: Users, description: 'Family tree and coded relations.' },
  { id: 'seating-arrangement', name: 'Seating Arrangement', cluster: 'Relational & Spatial', icon: Grid, description: 'Linear, circular, and matrix arrangements.' },
  { id: 'direction-sense', name: 'Direction Sense Test', cluster: 'Relational & Spatial', icon: Compass, description: 'Compass directions and shadow tracing.' },
  { id: 'cubes-and-dice', name: 'Dice, Cube and Cuboid', cluster: 'Relational & Spatial', icon: Box, description: 'Dice nets, opposite faces, and painted cubes.' },
  
  // Cluster 2: Pattern & Structure
  { id: 'logical-sequence-of-words', name: 'Logical Sequence of Words', cluster: 'Pattern & Structure', icon: List, description: 'Ordering words logically (size, process, etc.).' },
  { id: 'series-completion', name: 'Series Completion', cluster: 'Pattern & Structure', icon: TrendingUp, description: 'Advanced series patterns.' },
  { id: 'character-puzzles', name: 'Character Puzzles', cluster: 'Pattern & Structure', icon: Box, description: 'Grid-based missing character puzzles.' },
  { id: 'classification', name: 'Classification', cluster: 'Pattern & Structure', icon: Tag, description: 'Finding the odd one out.' },
  { id: 'analogies', name: 'Analogy', cluster: 'Pattern & Structure', icon: LinkIcon, description: 'Relationship mapping between pairs.' },
  
  // Cluster 3: Analytical Reasoning & Logic
  { id: 'syllogisms', name: 'Syllogism', cluster: 'Analytical Reasoning', icon: Layers, description: 'Categorical deductive logic and Venn intersections.' },
  { id: 'venn-diagrams', name: 'Venn Diagrams', cluster: 'Analytical Reasoning', icon: PieChart, description: 'Set theory and intersection puzzles.' },
  { id: 'cause-and-effect', name: 'Cause and Effect', cluster: 'Analytical Reasoning', icon: GitMerge, description: 'Determining independent causes and effects.' },
  { id: 'data-sufficiency', name: 'Data Sufficiency', cluster: 'Analytical Reasoning', icon: FileJson, description: 'Determining if statements are sufficient.' },
  { id: 'arithmetic-reasoning', name: 'Arithmetic Reasoning', cluster: 'Analytical Reasoning', icon: Calculator, description: 'Logic puzzles involving numbers.' },
  { id: 'verification-of-truth', name: 'Verification of Truth', cluster: 'Analytical Reasoning', icon: CheckSquare, description: 'Verifying truth of statements.' },
  { id: 'assertion-and-reason', name: 'Assertion and Reason', cluster: 'Analytical Reasoning', icon: CheckCheck, description: 'Evaluating Assertion (A) and Reason (R) statements.' },
  { id: 'statement-and-inferences', name: 'Statement and Inferences', cluster: 'Analytical Reasoning', icon: Search, description: 'Evaluating definitely true, probably true, or false inferences.' }
];

export const VERBAL_ABILITY_TOPICS: AptitudeTopic[] = [
  // Cluster 1: Vocabulary
  { id: 'synonyms', name: 'Synonyms', cluster: 'Vocabulary', icon: Tag, description: 'Words with similar meanings.' },
  { id: 'antonyms', name: 'Antonyms', cluster: 'Vocabulary', icon: Compass, description: 'Words with opposite meanings.' },
  { id: 'spellings', name: 'Spellings', cluster: 'Vocabulary', icon: CheckSquare, description: 'Correct and incorrect spellings.' },
  { id: 'one-word-substitutes', name: 'One Word Substitutes', cluster: 'Vocabulary', icon: Hash, description: 'Single words replacing phrases.' },
  { id: 'idioms-and-phrases', name: 'Idioms and Phrases', cluster: 'Vocabulary', icon: MessageSquare, description: 'Meaning of idioms and phrases.' },
  { id: 'confusing-words', name: 'Confusing Words & Homophones', cluster: 'Vocabulary', icon: HelpCircle, description: 'Words frequently confused (e.g., Affect/Effect, Compliment/Complement).' },
  
  // Cluster 2: Grammar & Error Spotting
  { id: 'spotting-errors', name: 'Spotting Errors', cluster: 'Grammar', icon: AlertTriangle, description: 'Finding grammatical errors in sentences.' },
  { id: 'sentence-correction', name: 'Sentence Correction', cluster: 'Grammar', icon: CheckCircle2, description: 'Correcting grammatically wrong sentences.' },
  { id: 'sentence-improvement', name: 'Sentence Improvement', cluster: 'Grammar', icon: TrendingUp, description: 'Improving sentence structure.' },
  { id: 'change-of-voice', name: 'Change of Voice', cluster: 'Grammar', icon: Mic, description: 'Active and passive voice conversions.' },
  { id: 'change-of-speech', name: 'Change of Speech', cluster: 'Grammar', icon: MessageSquare, description: 'Direct and indirect speech.' },
  
  // Cluster 3: Sentence Flow & Structuring
  { id: 'ordering-of-words', name: 'Ordering of Words', cluster: 'Sentence Flow', icon: List, description: 'Arranging words to form a sentence.' },
  { id: 'ordering-of-sentences', name: 'Ordering of Sentences', cluster: 'Sentence Flow', icon: Layers, description: 'Arranging sentences to form a logical flow.' },
  { id: 'sentence-formation', name: 'Sentence Formation', cluster: 'Sentence Flow', icon: GitMerge, description: 'Forming meaningful sentences.' },
  { id: 'paragraph-formation', name: 'Paragraph Formation', cluster: 'Sentence Flow', icon: AlignLeft, description: 'Structuring paragraphs correctly.' },
  
  // Cluster 4: Comprehension & Fillers
  { id: 'completing-statements', name: 'Completing Statements', cluster: 'Comprehension & Fillers', icon: Edit2, description: 'Completing logical statements.' },
  { id: 'selecting-words', name: 'Selecting Words', cluster: 'Comprehension & Fillers', icon: Pointer, description: 'Choosing the correct word for blanks.' },
  { id: 'double-fillers', name: 'Double Fillers & Connectors', cluster: 'Comprehension & Fillers', icon: Split, description: 'Sentences with two contextual blanks or clause connecting words.' },
  { id: 'cloze-test', name: 'Cloze Test', cluster: 'Comprehension & Fillers', icon: LayoutGrid, description: 'Paragraphs with multiple blanks.' },
  { id: 'reading-comprehension', name: 'Comprehension', cluster: 'Comprehension & Fillers', icon: BookOpen, description: 'Reading passages and answering questions.' },
  
  // Cluster 5: Verbal Logic
  { id: 'verbal-analogies', name: 'Verbal Analogies', cluster: 'Verbal Logic', icon: Sparkles, description: 'Logical relationships between words.' }
];

export const NONVERBAL_REASONING_TOPICS: AptitudeTopic[] = [
  // Cluster 1: Visual Transformations
  { id: 'pattern-completion', name: 'Visual Series & Pattern Completion', cluster: 'Visual Transformations', icon: Sparkles, description: 'Progressive figure series, figure matrices, and pattern completions.' },
  { id: 'mirror-images', name: 'Mirror & Water Images', cluster: 'Visual Transformations', icon: Compass, description: 'Lateral mirror reflections and vertical water image inversions.' },
  { id: 'paper-folding', name: 'Paper Folding & Cutting', cluster: 'Visual Transformations', icon: Square, description: 'Unfolding paper patterns, crease lines, and punch-cut visualizations.' },
  { id: 'figure-matrix', name: 'Figure Matrix', cluster: 'Visual Transformations', icon: Boxes, description: '3x3 figure grids with missing pattern pieces.' },
  { id: 'rule-detection', name: 'Rule Detection', cluster: 'Visual Transformations', icon: Workflow, description: 'Identifying figures following geometric rotation and element rules.' },
  { id: 'dot-situation', name: 'Dot Situation', cluster: 'Visual Transformations', icon: CircleDot, description: 'Region-overlap puzzles for dots placed inside geometric figures.' },

  // Cluster 2: Spatial Decomposition & Construction
  { id: 'embedded-images', name: 'Embedded Images', cluster: 'Spatial Construction', icon: Eye, description: 'Hidden shape detection inside complex figures.' },
  { id: 'counting-of-figures', name: 'Counting of Figures', cluster: 'Spatial Construction', icon: Hash, description: 'Counting triangles, squares, rectangles, and straight lines.' },
  { id: 'grouping-of-images', name: 'Grouping of Identical Figures', cluster: 'Spatial Construction', icon: Combine, description: 'Sorting mixed figures into matching groups of 3.' },
  { id: 'shape-construction', name: 'Shape Construction & Reconstruction', cluster: 'Spatial Construction', icon: Shapes, description: 'Visualizing component polygon pieces assembling into a complete shape.' },
  { id: 'nonverbal-analogy', name: 'Nonverbal Analogy', cluster: 'Spatial Construction', icon: LinkIcon, description: 'Visual shape relationships and proportional transformation.' },
  { id: 'nonverbal-classification', name: 'Nonverbal Classification', cluster: 'Spatial Construction', icon: Tag, description: 'Spotting the odd visual figure among given options.' },
];

export const TECHNICAL_APTITUDE_TOPICS: AptitudeTopic[] = [
  // Cluster 1: Pseudocode & Algorithms
  { id: 'pseudocode-tracing', name: 'Pseudocode & Variable Tracing', cluster: 'Pseudocode & Algorithms', icon: Terminal, description: 'Tracing execution flow, loop variables, nested conditions, and dry-runs.' },
  { id: 'bitwise-operators', name: 'Bitwise Operators & Logic', cluster: 'Pseudocode & Algorithms', icon: Binary, description: 'Bitwise AND (&), OR (|), XOR (^), Left Shift (<<), and Right Shift (>>).' },
  { id: 'recursion-functions', name: 'Recursion & Function Scope', cluster: 'Pseudocode & Algorithms', icon: Workflow, description: 'Recursive call stacks, base conditions, return values, and global vs local scopes.' },

  // Cluster 2: Cognitive & Speed Testing
  { id: 'attention-to-detail', name: 'Attention to Detail & Visual Checking', cluster: 'Cognitive & Speed Testing', icon: CheckCheck, description: 'Speed-based alphanumeric string matching, error spotting, and visual accuracy.' },
  { id: 'code-debugging-logic', name: 'Code Debugging & Automata Fix', cluster: 'Cognitive & Speed Testing', icon: Cpu, description: 'Spotting logical, syntactic, and boundary condition bugs in code snippets.' },
  { id: 'cloud-networking-basics', name: 'General Tech, OS & Cloud Basics', cluster: 'Cognitive & Speed Testing', icon: Network, description: 'Placement MCQs on OS fundamentals, database queries, and cloud basics.' },
];

export const getCategoryTopics = (slug: string): AptitudeTopic[] => {
  switch (slug) {
    case 'data-interpretation':
      return DATA_INTERPRETATION_TOPICS;
    case 'logical-reasoning':
      return LOGICAL_REASONING_TOPICS;
    case 'verbal-reasoning':
      return VERBAL_REASONING_TOPICS;
    case 'verbal-ability':
      return VERBAL_ABILITY_TOPICS;
    case 'nonverbal-reasoning':
      return NONVERBAL_REASONING_TOPICS;
    case 'technical-aptitude':
      return TECHNICAL_APTITUDE_TOPICS;
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
      topicIds.forEach(id => {
        countMap[id] = 0;
      });
      
      allFetchedData.forEach((row: any) => {
        if (row.topic_id) {
          countMap[row.topic_id] = (countMap[row.topic_id] || 0) + 1;
        }
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
    'logical-reasoning': { title: 'Logical Reasoning', subtitle: 'Number Series, Essential Part, Logical Problems, and Placement Puzzles.', icon: Brain },
    'verbal-reasoning': { title: 'Verbal Reasoning', subtitle: 'Blood Relations, Syllogisms, Seating Arrangements, and Analytical Logic.', icon: GitMerge },
    'verbal-ability': { title: 'Verbal Ability (English)', subtitle: 'Reading Comprehension, Grammar, Synonyms, and Sentence Completion.', icon: MessageSquare },
    'nonverbal-reasoning': { title: 'Nonverbal Reasoning', subtitle: 'Pattern Completion, Mirror Images, Paper Folding, and Series Completion.', icon: Compass },
    'technical-aptitude': { title: 'Technical & Cognitive Aptitude', subtitle: 'Pseudocode dry-runs, Bitwise logic, Automata fix, and Attention to detail.', icon: Terminal },
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
          const displayCount = liveCountMap[topic.id] ?? 0;

          return (
            <Link
              key={topic.id}
              to={`/aptitude/${categorySlug}/topic/${topic.id}`}
              className="group flex items-center justify-between p-3 bg-white dark:bg-[#141414] hover:bg-[#F8F9FA] dark:hover:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#242424] hover:border-[#121417] dark:hover:border-[#383838] rounded-md transition-all duration-150 shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded bg-[#FD4A32]/10 dark:bg-[#FD4A32]/10 border border-[#FD4A32]/20 dark:border-[#FD4A32]/30 text-[#FD4A32] dark:text-[#FD4A32] flex items-center justify-center shrink-0">
                  <TopicIcon className="w-3.5 h-3.5 text-[#FD4A32]" />
                </div>

                <span className="font-display font-bold text-xs text-[#121417] dark:text-[#FFFFFF] group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32] transition-colors truncate">
                  {topic.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 text-[11px] font-display font-bold text-[#121417] dark:text-[#E9ECEF] bg-[#F1F3F5] dark:bg-[#202020] px-2.5 py-1 rounded border border-[#E9ECEF] dark:border-[#2E2E2E] group-hover:border-[#FD4A32] group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32] transition-colors">
                  <span>{displayCount} {displayCount === 1 ? 'Question' : 'Questions'}</span>
                  <ChevronRight className="w-3 h-3 text-[#868E96] dark:text-[#A0A0A0] group-hover:text-[#FD4A32] dark:group-hover:text-[#FD4A32] transition-colors" />
                </span>
              </div>
            </Link>
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
                <span>Proceed to Practice Questions ({liveCountMap[selectedTopic.id] ?? 0})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
