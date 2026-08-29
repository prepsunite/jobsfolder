-- ====================================================================
-- PrepUnite / Jobsfolder - Master Aptitude Topics Complete Seed Script
-- Populates all 128 canonical syllabus topics with formulas & Lucide icons
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Arithmetic Aptitude (41 Topics)
-- --------------------------------------------------------------------
INSERT INTO public.aptitude_topics (id, category_slug, name, cluster, description, icon_name, formulas, is_hidden)
VALUES
  ('numbers', 'arithmetic-aptitude', 'Numbers', 'Number System', 'Real numbers, integers, divisibility rules, and unit digit concepts.', 'Hash', ARRAY['Divisibility by 3: Sum of digits is divisible by 3.', 'Unit digit of powers repeats in cycles of 4.', 'Sum of first n natural numbers = n(n+1)/2']::TEXT[], false),
  ('problems-on-numbers', 'arithmetic-aptitude', 'Problems on Numbers', 'Number System', 'Word problems based on digits, sum, difference, and product of numbers.', 'Calculator', ARRAY['Two-digit number: 10x + y', 'Reversed number: 10y + x', 'Difference = 9(x - y)']::TEXT[], false),
  ('hcf-lcm', 'arithmetic-aptitude', 'Problems on H.C.F and L.C.M', 'Number System', 'Highest Common Factor and Least Common Multiple applications.', 'Grid', ARRAY['Product of two numbers = HCF × LCM', 'HCF of fractions = HCF of numerators / LCM of denominators', 'LCM of fractions = LCM of numerators / HCF of denominators']::TEXT[], false),
  ('decimal-fraction', 'arithmetic-aptitude', 'Decimal Fraction', 'Number System', 'Conversion, recurring decimals, and simplification of fractions.', 'Percent', ARRAY['Pure recurring decimal: 0.ab = ab / 99', 'Mixed recurring decimal: 0.a(b) = (ab - a) / 90']::TEXT[], false),
  ('simplification', 'arithmetic-aptitude', 'Simplification', 'Number System', 'BODMAS rule dry-runs, algebraic identities, and arithmetic expressions.', 'Sliders', ARRAY['BODMAS order: Brackets, Orders, Division, Multiplication, Addition, Subtraction', '(a+b)² = a² + 2ab + b²', '(a-b)² = a² - 2ab + b²']::TEXT[], false),
  ('square-cube-root', 'arithmetic-aptitude', 'Square Root and Cube Root', 'Number System', 'Finding square roots, cube roots, and estimation techniques.', 'CheckSquare', ARRAY['√(a×b) = √a × √b', '√(a/b) = √a / √b']::TEXT[], false),
  ('surds-indices', 'arithmetic-aptitude', 'Surds and Indices', 'Number System', 'Laws of indices, rationalization of surds, and exponent equations.', 'Zap', ARRAY['aᵐ × aⁿ = aᵐ⁺ⁿ', 'aᵐ / aⁿ = aᵐ⁻ⁿ', '(aᵐ)ⁿ = aᵐⁿ', 'a⁰ = 1']::TEXT[], false),
  ('logarithm', 'arithmetic-aptitude', 'Logarithm', 'Number System', 'Logarithmic properties, change of base rule, and log equations.', 'Zap', ARRAY['log_a(m × n) = log_a(m) + log_a(n)', 'log_a(m / n) = log_a(m) - log_a(n)', 'log_a(mⁿ) = n × log_a(m)', 'log_a(b) = log_c(b) / log_c(a)']::TEXT[], false),
  ('problems-on-trains', 'arithmetic-aptitude', 'Problems on Trains', 'Time & Motion', 'Relative speed, train crossing platforms, poles, and moving objects.', 'Train', ARRAY['Km/hr to m/s: Multiply by 5/18', 'm/s to Km/hr: Multiply by 18/5', 'Time to cross stationary object = Length of Train / Speed', 'Time to cross platform = (Train Length + Platform Length) / Speed', 'Relative Speed (same direction) = S1 - S2', 'Relative Speed (opposite direction) = S1 + S2']::TEXT[], false),
  ('time-and-distance', 'arithmetic-aptitude', 'Time and Distance', 'Time & Motion', 'Speed calculations, average speed, and journey segment dry-runs.', 'Navigation', ARRAY['Speed = Distance / Time', 'Average Speed = Total Distance / Total Time', 'If speeds are x and y for equal distances: Avg Speed = (2xy) / (x + y)']::TEXT[], false),
  ('time-and-work', 'arithmetic-aptitude', 'Time and Work', 'Time & Motion', 'Efficiency ratios, combined work, and alternate day work problems.', 'Clock', ARRAY['If A takes n days, 1 day work = 1/n', 'Combined 1 day work of A & B = 1/A + 1/B', 'Time taken together = (A × B) / (A + B)']::TEXT[], false),
  ('pipes-and-cistern', 'arithmetic-aptitude', 'Pipes and Cistern', 'Time & Motion', 'Inlet and outlet pipe rates, tank filling/emptying times.', 'Droplets', ARRAY['Inlet 1 hr work = +1/A', 'Outlet 1 hr work = -1/B', 'Net 1 hr work = 1/A - 1/B']::TEXT[], false),
  ('boats-and-streams', 'arithmetic-aptitude', 'Boats and Streams', 'Time & Motion', 'Upstream, downstream speeds, and still water velocity formulas.', 'Ship', ARRAY['Downstream Speed (d) = u + v', 'Upstream Speed (u_s) = u - v', 'Speed in Still Water (u) = 1/2 × (d + u_s)', 'Speed of Stream (v) = 1/2 × (d - u_s)']::TEXT[], false),
  ('chain-rule', 'arithmetic-aptitude', 'Chain Rule', 'Time & Motion', 'Direct and indirect proportion, man-days-hours calculations.', 'Link', ARRAY['(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2']::TEXT[], false),
  ('races-and-games', 'arithmetic-aptitude', 'Races and Games', 'Time & Motion', 'Race track distances, start head-starts, and game scoring logic.', 'Flag', ARRAY['A gives B a start of x meters: B runs (D - x) meters when A runs D meters.', 'A beats B by t seconds: B takes t seconds more than A to finish.']::TEXT[], false),
  ('percentage', 'arithmetic-aptitude', 'Percentage', 'Commercial Maths', 'Percentage change, population growth, and election vote problems.', 'Percent', ARRAY['Percentage Increase = (Increase / Original) × 100', 'Percentage Decrease = (Decrease / Original) × 100', 'Net % Change = x + y + (xy/100)']::TEXT[], false),
  ('profit-and-loss', 'arithmetic-aptitude', 'Profit and Loss', 'Commercial Maths', 'Cost price, selling price, markups, discounts, and false weights.', 'TrendingUp', ARRAY['Gain = SP - CP', 'Loss = CP - SP', 'Gain % = (Gain / CP) × 100', 'Loss % = (Loss / CP) × 100', 'SP = CP × (100 + Gain%) / 100']::TEXT[], false),
  ('simple-interest', 'arithmetic-aptitude', 'Simple Interest', 'Commercial Maths', 'Principal, rate, time formulas, and annual installment problems.', 'DollarSign', ARRAY['SI = (P × R × T) / 100', 'Amount (A) = P + SI', 'P = (100 × SI) / (R × T)']::TEXT[], false),
  ('compound-interest', 'arithmetic-aptitude', 'Compound Interest', 'Commercial Maths', 'Compounding periods, SI vs CI difference, and growth rates.', 'PieChart', ARRAY['Amount A = P × (1 + R/100)ᵀ', 'CI = A - P', 'Difference (CI - SI) for 2 years = P × (R/100)²']::TEXT[], false),
  ('partnership', 'arithmetic-aptitude', 'Partnership', 'Commercial Maths', 'Capital investments, profit sharing ratios, and active/working partners.', 'Users', ARRAY['Ratio of Profits = (Capital1 × Time1) : (Capital2 × Time2)']::TEXT[], false),
  ('ratio-and-proportion', 'arithmetic-aptitude', 'Ratio and Proportion', 'Commercial Maths', 'Mean proportion, duplicate ratio, and income/expenditure ratios.', 'Scale', ARRAY['If a:b = c:d, then a×d = b×c', 'Mean proportional of a and b = √(a × b)']::TEXT[], false),
  ('alligation-or-mixture', 'arithmetic-aptitude', 'Alligation or Mixture', 'Commercial Maths', 'Rule of alligation, liquid mixtures, and replacement problems.', 'Layers', ARRAY['(Cheaper Quantity / Dearer Quantity) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price)']::TEXT[], false),
  ('stocks-and-shares', 'arithmetic-aptitude', 'Stocks and Shares', 'Commercial Maths', 'Nominal value, market value, brokerage, and dividend calculations.', 'BarChart', ARRAY['Annual Income = Number of Shares × Rate of Dividend × Face Value', 'Return % = (Annual Income / Investment) × 100']::TEXT[], false),
  ('true-discount', 'arithmetic-aptitude', 'True Discount', 'Commercial Maths', 'Present worth, true discount, and amount due formulas.', 'Tag', ARRAY['PW = (100 × Amount) / (100 + R×T)', 'TD = Amount - PW = (PW × R × T) / 100']::TEXT[], false),
  ('bankers-discount', 'arithmetic-aptitude', 'Banker''s Discount', 'Commercial Maths', 'Banker discount, banker gain, and bill face value calculations.', 'CreditCard', ARRAY['BD = SI on bill amount for unexpired time', 'BG = BD - TD = SI on TD']::TEXT[], false),
  ('geometry-theorems', 'arithmetic-aptitude', 'Geometry & Polygons', 'Geometry & Mensuration', 'Lines, angles, triangle theorems, similarity, tangents, and regular polygons.', 'Shapes', ARRAY['Sum of angles in n-sided polygon = (n - 2) × 180°', 'Pythagorean Theorem: a² + b² = c²']::TEXT[], false),
  ('height-and-distance', 'arithmetic-aptitude', 'Height and Distance', 'Geometry & Mensuration', 'Angle of elevation, angle of depression, and trigonometric ratios.', 'Compass', ARRAY['tan(θ) = Opposite / Adjacent', 'sin(θ) = Opposite / Hypotenuse', 'cos(θ) = Adjacent / Hypotenuse']::TEXT[], false),
  ('area', 'arithmetic-aptitude', 'Area & Perimeter', 'Geometry & Mensuration', '2D shapes: Triangles, rectangles, circles, quadrilaterals, polygons.', 'Square', ARRAY['Area of Circle = πr²', 'Perimeter of Circle = 2πr', 'Area of Triangle = 1/2 × base × height', 'Herons Formula = √(s(s-a)(s-b)(s-c))']::TEXT[], false),
  ('volume-and-surface-area', 'arithmetic-aptitude', 'Volume and Surface Area', 'Geometry & Mensuration', '3D shapes: Cubes, cuboids, cylinders, cones, spheres, hemispheres.', 'Box', ARRAY['Volume of Cylinder = πr²h', 'Surface Area of Cylinder = 2πrh + 2πr²', 'Volume of Sphere = (4/3)πr³', 'Surface Area of Sphere = 4πr²']::TEXT[], false),
  ('coordinate-geometry', 'arithmetic-aptitude', 'Coordinate Geometry', 'Geometry & Mensuration', 'Slope of line, distance between points, section formula, and circle equations.', 'Target', ARRAY['Distance = √((x₂-x₁)² + (y₂-y₁)²)', 'Slope m = (y₂-y₁) / (x₂-x₁)', 'Equation: y = mx + c']::TEXT[], false),
  ('trigonometry', 'arithmetic-aptitude', 'Trigonometry & Identities', 'Geometry & Mensuration', 'Trigonometric functions, identities, complementary angles, and radian measures.', 'Activity', ARRAY['sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ', '1 + cot²θ = cosec²θ']::TEXT[], false),
  ('algebra-quadratic-equations', 'arithmetic-aptitude', 'Algebra & Quadratic Equations', 'Algebra & Higher Maths', 'Polynomial roots, discriminant, quadratic factoring, and maxima/minima.', 'Sliders', ARRAY['Roots = (-b ± √(b² - 4ac)) / (2a)', 'Sum of roots = -b/a', 'Product of roots = c/a']::TEXT[], false),
  ('progressions-ap-gp-hp', 'arithmetic-aptitude', 'Progressions (AP, GP, HP)', 'Algebra & Higher Maths', 'Arithmetic, Geometric, and Harmonic progressions, nth terms, and series sums.', 'TrendingUp', ARRAY['AP nth term: a + (n-1)d', 'AP Sum: (n/2)[2a + (n-1)d]', 'GP nth term: a·rⁿ⁻¹', 'GP Sum: a(rⁿ - 1)/(r - 1)']::TEXT[], false),
  ('set-theory', 'arithmetic-aptitude', 'Set Theory & Venn Math', 'Algebra & Higher Maths', '2-set & 3-set cardinalities, union, intersection, and set maxima/minima.', 'PieChart', ARRAY['n(A ∪ B) = n(A) + n(B) - n(A ∩ B)', 'n(A ∪ B ∪ C) = n(A)+n(B)+n(C)-n(A∩B)-n(B∩C)-n(C∩A)+n(A∩B∩C)']::TEXT[], false),
  ('permutation-and-combination', 'arithmetic-aptitude', 'Permutation and Combination', 'Modern Maths', 'Factorials, arrangements, selections, and circular permutations.', 'GitMerge', ARRAY['ⁿPᵣ = n! / (n - r)!', 'ⁿCᵣ = n! / [r! × (n - r)!]', 'ⁿCᵣ = ⁿPᵣ / r!']::TEXT[], false),
  ('probability', 'arithmetic-aptitude', 'Probability', 'Modern Maths', 'Sample spaces, coins, dice, cards, bags, and conditional probability.', 'Dices', ARRAY['P(E) = Favorable Outcomes / Total Outcomes', '0 ≤ P(E) ≤ 1', 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)']::TEXT[], false),
  ('average', 'arithmetic-aptitude', 'Average', 'Modern Maths', 'Weighted average, inclusion/exclusion, and speed averages.', 'TrendingDown', ARRAY['Average = Sum of Quantities / Number of Quantities', 'Sum of Quantities = Average × Number of Quantities']::TEXT[], false),
  ('problems-on-ages', 'arithmetic-aptitude', 'Problems on Ages', 'Modern Maths', 'Past, present, and future age ratio equations.', 'UserCheck', ARRAY['If present age is x, age n years ago = x - n', 'Age n years hence = x + n']::TEXT[], false),
  ('calendar', 'arithmetic-aptitude', 'Calendar', 'Modern Maths', 'Odd days calculation, leap years, and day of week determination.', 'Calendar', ARRAY['Ordinary year = 365 days = 52 weeks + 1 odd day', 'Leap year = 366 days = 52 weeks + 2 odd days', 'Year divisible by 4 (or 400 for century) is a leap year.']::TEXT[], false),
  ('clock', 'arithmetic-aptitude', 'Clock', 'Modern Maths', 'Angle between hands, coincide times, right angles, and gain/loss clocks.', 'Clock', ARRAY['Speed of minute hand = 6°/min', 'Speed of hour hand = 0.5°/min', 'Relative speed = 5.5°/min', 'Angle = |30H - 5.5M|']::TEXT[], false),
  ('odd-man-out-and-series', 'arithmetic-aptitude', 'Odd Man Out and Series', 'Modern Maths', 'Pattern recognition, number series completion, and wrong term identification.', 'Sparkles', ARRAY['Check differences between consecutive terms.', 'Check ratio/multiplication factors or square/cube patterns.']::TEXT[], false)
ON CONFLICT (id) DO UPDATE SET
  category_slug = EXCLUDED.category_slug,
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  formulas = EXCLUDED.formulas,
  is_hidden = EXCLUDED.is_hidden;

-- --------------------------------------------------------------------
-- 2. Data Interpretation (8 Topics)
-- --------------------------------------------------------------------
INSERT INTO public.aptitude_topics (id, category_slug, name, cluster, description, icon_name, formulas, is_hidden)
VALUES
  ('table-charts', 'data-interpretation', 'Table Charts', 'Visual Charts', 'Tabular data analysis, growth rates, percentages, and financial summaries.', 'Grid', ARRAY['Percentage Change = (New - Old) / Old × 100', 'Average = Sum of all entries / Count of entries']::TEXT[], false),
  ('bar-charts', 'data-interpretation', 'Bar Charts', 'Visual Charts', 'Single bar, grouped bar, and stacked bar chart interpretation.', 'BarChart3', ARRAY['Ratio of A to B = Value(A) / Value(B)', 'Difference = High Bar - Low Bar']::TEXT[], false),
  ('pie-charts', 'data-interpretation', 'Pie Charts', 'Visual Charts', 'Single pie, dual pie charts, and degree (360°) to percentage conversions.', 'PieChart', ARRAY['Value = (Angle / 360°) × Total Value', 'Percentage = (Angle / 360°) × 100']::TEXT[], false),
  ('line-charts', 'data-interpretation', 'Line Charts', 'Visual Charts', 'Trend lines, multi-line comparisons, profit/loss and sales over time.', 'TrendingUp', ARRAY['Growth Rate = (Value in Final Year - Value in Initial Year) / Value in Initial Year']::TEXT[], false),
  ('radar-web-charts', 'data-interpretation', 'Radar & Spider Web Charts', 'Visual Charts', 'Multivariable spider/web charts comparing performance metrics across dimensions.', 'Radio', ARRAY['Radial Axis Value = (Value on Axis / Max Axis Value) × 100']::TEXT[], false),
  ('scatter-bubble-charts', 'data-interpretation', 'Scatter Plots & Bubble Charts', 'Visual Charts', 'Correlation, distribution patterns, and three-variable bubble charts.', 'CircleDot', ARRAY['Correlation = Direction and density of plot clusters']::TEXT[], false),
  ('caselet-di', 'data-interpretation', 'Caselet & Mixed DI', 'Advanced DI', 'Paragraph-based narrative data, mixed charts (Pie + Table), and Venn diagram DI.', 'Square', ARRAY['Read paragraph thoroughly and formulate a 2D table or set matrix first.']::TEXT[], false),
  ('missing-di', 'data-interpretation', 'Missing Data Interpretation', 'Advanced DI', 'Incomplete tables and charts where missing values must be deduced using clues.', 'HelpCircle', ARRAY['Missing Value = Total - Sum of known items in row/col']::TEXT[], false)
ON CONFLICT (id) DO UPDATE SET
  category_slug = EXCLUDED.category_slug,
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  formulas = EXCLUDED.formulas,
  is_hidden = EXCLUDED.is_hidden;

-- --------------------------------------------------------------------
-- 3. Logical Reasoning (23 Topics)
-- --------------------------------------------------------------------
INSERT INTO public.aptitude_topics (id, category_slug, name, cluster, description, icon_name, formulas, is_hidden)
VALUES
  ('number-series', 'logical-reasoning', 'Number Series', 'Core Logic & Series', 'Number sequence and finding missing terms.', 'Hash', '{}'::TEXT[], false),
  ('letter-and-symbol-series', 'logical-reasoning', 'Letter and Symbol Series', 'Core Logic & Series', 'Alphabetical and symbol patterns.', 'Code', '{}'::TEXT[], false),
  ('essential-part', 'logical-reasoning', 'Essential Part', 'Core Logic & Series', 'Identifying the most essential part of an object/concept.', 'Zap', '{}'::TEXT[], false),
  ('artificial-language', 'logical-reasoning', 'Artificial Language', 'Core Logic & Series', 'Decoding fabricated languages.', 'MessageSquare', '{}'::TEXT[], false),
  ('matching-definitions', 'logical-reasoning', 'Matching Definitions', 'Core Logic & Series', 'Matching scenarios to definitions.', 'CheckSquare', '{}'::TEXT[], false),
  ('making-judgments', 'logical-reasoning', 'Making Judgments', 'Core Logic & Series', 'Evaluating situations and making decisions.', 'Scale', '{}'::TEXT[], false),
  ('logical-problems', 'logical-reasoning', 'Logical Problems', 'Deductive & Placement Puzzles', 'General logical and analytical puzzles.', 'Brain', '{}'::TEXT[], false),
  ('logical-games', 'logical-reasoning', 'Logical Games', 'Deductive & Placement Puzzles', 'Game-based logic.', 'Dices', '{}'::TEXT[], false),
  ('cryptarithmetic', 'logical-reasoning', 'Cryptarithmetic (Alphametics)', 'Deductive & Placement Puzzles', 'Letter-to-digit substitution math puzzles (e.g., SEND + MORE = MONEY).', 'KeyRound', '{}'::TEXT[], false),
  ('machine-input-output', 'logical-reasoning', 'Machine Input-Output', 'Deductive & Placement Puzzles', 'Step-by-step rearrangement algorithms for words and numbers.', 'Shuffle', '{}'::TEXT[], false),
  ('inequalities', 'logical-reasoning', 'Mathematical & Coded Inequalities', 'Deductive & Placement Puzzles', 'Evaluating statement relationships with inequality symbols (> , < , =, ≤, ≥).', 'Split', '{}'::TEXT[], false),
  ('order-and-ranking', 'logical-reasoning', 'Order and Ranking', 'Deductive & Placement Puzzles', 'Position from left/right in a row, position swapping, and total count.', 'List', '{}'::TEXT[], false),
  ('floor-scheduling-puzzles', 'logical-reasoning', 'Floor & Scheduling Puzzles', 'Deductive & Placement Puzzles', 'Multi-variable grid arrangements (floors, days, colors, professions).', 'Boxes', '{}'::TEXT[], false),
  ('games-and-tournaments', 'logical-reasoning', 'Games and Tournaments', 'Deductive & Placement Puzzles', 'Round-robin points tables, knockout bracket deductions, and seeding logic.', 'Flag', '{}'::TEXT[], false),
  ('truth-tellers-liars', 'logical-reasoning', 'Truth-Tellers and Liars', 'Deductive & Placement Puzzles', 'Binary logic puzzles with alternating, true, and false speaker statements.', 'UserCheck', '{}'::TEXT[], false),
  ('eligibility-test', 'logical-reasoning', 'Eligibility Test & Decision Making', 'Deductive & Placement Puzzles', 'Candidate condition matching, exception handling, and HR referral logic.', 'CheckCheck', '{}'::TEXT[], false),
  ('analyzing-arguments', 'logical-reasoning', 'Analyzing Arguments', 'Critical Logic', 'Evaluating strong and weak arguments.', 'Scale', '{}'::TEXT[], false),
  ('course-of-action', 'logical-reasoning', 'Course of Action', 'Critical Logic', 'Selecting appropriate actions for a problem.', 'Flag', '{}'::TEXT[], false),
  ('theme-detection', 'logical-reasoning', 'Theme Detection', 'Critical Logic', 'Identifying the underlying theme of a passage.', 'Search', '{}'::TEXT[], false),
  ('statement-and-argument', 'logical-reasoning', 'Statement and Argument', 'Critical Logic', 'Validating arguments based on statements.', 'MessageSquare', '{}'::TEXT[], false),
  ('statement-and-assumption', 'logical-reasoning', 'Statement and Assumption', 'Critical Logic', 'Finding implicit assumptions in statements.', 'Brain', '{}'::TEXT[], false),
  ('statement-and-conclusion', 'logical-reasoning', 'Statement and Conclusion', 'Critical Logic', 'Deriving direct conclusions.', 'CheckCircle2', '{}'::TEXT[], false),
  ('logical-deduction', 'logical-reasoning', 'Logical Deduction', 'Critical Logic', 'Deducing logic from multiple premises.', 'Layers', '{}'::TEXT[], false)
ON CONFLICT (id) DO UPDATE SET
  category_slug = EXCLUDED.category_slug,
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  formulas = EXCLUDED.formulas,
  is_hidden = EXCLUDED.is_hidden;

-- --------------------------------------------------------------------
-- 4. Verbal Reasoning (17 Topics)
-- --------------------------------------------------------------------
INSERT INTO public.aptitude_topics (id, category_slug, name, cluster, description, icon_name, formulas, is_hidden)
VALUES
  ('blood-relations', 'verbal-reasoning', 'Blood Relation Test', 'Relational & Spatial', 'Family tree and coded relations.', 'Users', '{}'::TEXT[], false),
  ('seating-arrangement', 'verbal-reasoning', 'Seating Arrangement', 'Relational & Spatial', 'Linear, circular, and matrix arrangements.', 'Grid', '{}'::TEXT[], false),
  ('direction-sense', 'verbal-reasoning', 'Direction Sense Test', 'Relational & Spatial', 'Compass directions and shadow tracing.', 'Compass', '{}'::TEXT[], false),
  ('cubes-and-dice', 'verbal-reasoning', 'Dice, Cube and Cuboid', 'Relational & Spatial', 'Dice nets, opposite faces, and painted cubes.', 'Box', '{}'::TEXT[], false),
  ('logical-sequence-of-words', 'verbal-reasoning', 'Logical Sequence of Words', 'Pattern & Structure', 'Ordering words logically (size, process, etc.).', 'List', '{}'::TEXT[], false),
  ('series-completion', 'verbal-reasoning', 'Series Completion', 'Pattern & Structure', 'Advanced series patterns.', 'TrendingUp', '{}'::TEXT[], false),
  ('character-puzzles', 'verbal-reasoning', 'Character Puzzles', 'Pattern & Structure', 'Grid-based missing character puzzles.', 'Box', '{}'::TEXT[], false),
  ('classification', 'verbal-reasoning', 'Classification', 'Pattern & Structure', 'Finding the odd one out.', 'Tag', '{}'::TEXT[], false),
  ('analogies', 'verbal-reasoning', 'Analogy', 'Pattern & Structure', 'Relationship mapping between pairs.', 'Link', '{}'::TEXT[], false),
  ('syllogisms', 'verbal-reasoning', 'Syllogism', 'Analytical Reasoning', 'Categorical deductive logic and Venn intersections.', 'Layers', '{}'::TEXT[], false),
  ('venn-diagrams', 'verbal-reasoning', 'Venn Diagrams', 'Analytical Reasoning', 'Set theory and intersection puzzles.', 'PieChart', '{}'::TEXT[], false),
  ('cause-and-effect', 'verbal-reasoning', 'Cause and Effect', 'Analytical Reasoning', 'Determining independent causes and effects.', 'GitMerge', '{}'::TEXT[], false),
  ('data-sufficiency', 'verbal-reasoning', 'Data Sufficiency', 'Analytical Reasoning', 'Determining if statements are sufficient.', 'FileJson', '{}'::TEXT[], false),
  ('arithmetic-reasoning', 'verbal-reasoning', 'Arithmetic Reasoning', 'Analytical Reasoning', 'Logic puzzles involving numbers.', 'Calculator', '{}'::TEXT[], false),
  ('verification-of-truth', 'verbal-reasoning', 'Verification of Truth', 'Analytical Reasoning', 'Verifying truth of statements.', 'CheckSquare', '{}'::TEXT[], false),
  ('assertion-and-reason', 'verbal-reasoning', 'Assertion and Reason', 'Analytical Reasoning', 'Evaluating Assertion (A) and Reason (R) statements.', 'CheckCheck', '{}'::TEXT[], false),
  ('statement-and-inferences', 'verbal-reasoning', 'Statement and Inferences', 'Analytical Reasoning', 'Evaluating definitely true, probably true, or false inferences.', 'Search', '{}'::TEXT[], false)
ON CONFLICT (id) DO UPDATE SET
  category_slug = EXCLUDED.category_slug,
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  formulas = EXCLUDED.formulas,
  is_hidden = EXCLUDED.is_hidden;

-- --------------------------------------------------------------------
-- 5. Verbal Ability / English (21 Topics)
-- --------------------------------------------------------------------
INSERT INTO public.aptitude_topics (id, category_slug, name, cluster, description, icon_name, formulas, is_hidden)
VALUES
  ('synonyms', 'verbal-ability', 'Synonyms', 'Vocabulary', 'Words with similar meanings.', 'Tag', '{}'::TEXT[], false),
  ('antonyms', 'verbal-ability', 'Antonyms', 'Vocabulary', 'Words with opposite meanings.', 'Compass', '{}'::TEXT[], false),
  ('spellings', 'verbal-ability', 'Spellings', 'Vocabulary', 'Correct and incorrect spellings.', 'CheckSquare', '{}'::TEXT[], false),
  ('one-word-substitutes', 'verbal-ability', 'One Word Substitutes', 'Vocabulary', 'Single words replacing phrases.', 'Hash', '{}'::TEXT[], false),
  ('idioms-and-phrases', 'verbal-ability', 'Idioms and Phrases', 'Vocabulary', 'Meaning of idioms and phrases.', 'MessageSquare', '{}'::TEXT[], false),
  ('confusing-words', 'verbal-ability', 'Confusing Words & Homophones', 'Vocabulary', 'Words frequently confused (e.g., Affect/Effect, Compliment/Complement).', 'HelpCircle', '{}'::TEXT[], false),
  ('spotting-errors', 'verbal-ability', 'Spotting Errors', 'Grammar', 'Finding grammatical errors in sentences.', 'AlertTriangle', '{}'::TEXT[], false),
  ('sentence-correction', 'verbal-ability', 'Sentence Correction', 'Grammar', 'Correcting grammatically wrong sentences.', 'CheckCircle2', '{}'::TEXT[], false),
  ('sentence-improvement', 'verbal-ability', 'Sentence Improvement', 'Grammar', 'Improving sentence structure.', 'TrendingUp', '{}'::TEXT[], false),
  ('change-of-voice', 'verbal-ability', 'Change of Voice', 'Grammar', 'Active and passive voice conversions.', 'Mic', '{}'::TEXT[], false),
  ('change-of-speech', 'verbal-ability', 'Change of Speech', 'Grammar', 'Direct and indirect speech.', 'MessageSquare', '{}'::TEXT[], false),
  ('ordering-of-words', 'verbal-ability', 'Ordering of Words', 'Sentence Flow', 'Arranging words to form a sentence.', 'List', '{}'::TEXT[], false),
  ('ordering-of-sentences', 'verbal-ability', 'Ordering of Sentences', 'Sentence Flow', 'Arranging sentences to form a logical flow.', 'Layers', '{}'::TEXT[], false),
  ('sentence-formation', 'verbal-ability', 'Sentence Formation', 'Sentence Flow', 'Forming meaningful sentences.', 'GitMerge', '{}'::TEXT[], false),
  ('paragraph-formation', 'verbal-ability', 'Paragraph Formation', 'Sentence Flow', 'Structuring paragraphs correctly.', 'AlignLeft', '{}'::TEXT[], false),
  ('completing-statements', 'verbal-ability', 'Completing Statements', 'Comprehension & Fillers', 'Completing logical statements.', 'Edit2', '{}'::TEXT[], false),
  ('selecting-words', 'verbal-ability', 'Selecting Words', 'Comprehension & Fillers', 'Choosing the correct word for blanks.', 'Pointer', '{}'::TEXT[], false),
  ('double-fillers', 'verbal-ability', 'Double Fillers & Connectors', 'Comprehension & Fillers', 'Sentences with two contextual blanks or clause connecting words.', 'Split', '{}'::TEXT[], false),
  ('cloze-test', 'verbal-ability', 'Cloze Test', 'Comprehension & Fillers', 'Paragraphs with multiple blanks.', 'LayoutGrid', '{}'::TEXT[], false),
  ('reading-comprehension', 'verbal-ability', 'Comprehension', 'Comprehension & Fillers', 'Reading passages and answering questions.', 'BookOpen', '{}'::TEXT[], false),
  ('verbal-analogies', 'verbal-ability', 'Verbal Analogies', 'Verbal Logic', 'Logical relationships between words.', 'Sparkles', '{}'::TEXT[], false)
ON CONFLICT (id) DO UPDATE SET
  category_slug = EXCLUDED.category_slug,
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  formulas = EXCLUDED.formulas,
  is_hidden = EXCLUDED.is_hidden;

-- --------------------------------------------------------------------
-- 6. Nonverbal Reasoning (12 Topics)
-- --------------------------------------------------------------------
INSERT INTO public.aptitude_topics (id, category_slug, name, cluster, description, icon_name, formulas, is_hidden)
VALUES
  ('pattern-completion', 'nonverbal-reasoning', 'Visual Series & Pattern Completion', 'Visual Transformations', 'Progressive figure series, figure matrices, and pattern completions.', 'Sparkles', '{}'::TEXT[], false),
  ('mirror-images', 'nonverbal-reasoning', 'Mirror & Water Images', 'Visual Transformations', 'Lateral mirror reflections and vertical water image inversions.', 'Compass', '{}'::TEXT[], false),
  ('paper-folding', 'nonverbal-reasoning', 'Paper Folding & Cutting', 'Visual Transformations', 'Unfolding paper patterns, crease lines, and punch-cut visualizations.', 'Square', '{}'::TEXT[], false),
  ('figure-matrix', 'nonverbal-reasoning', 'Figure Matrix', 'Visual Transformations', '3x3 figure grids with missing pattern pieces.', 'Boxes', '{}'::TEXT[], false),
  ('rule-detection', 'nonverbal-reasoning', 'Rule Detection', 'Visual Transformations', 'Identifying figures following geometric rotation and element rules.', 'Workflow', '{}'::TEXT[], false),
  ('dot-situation', 'nonverbal-reasoning', 'Dot Situation', 'Visual Transformations', 'Region-overlap puzzles for dots placed inside geometric figures.', 'CircleDot', '{}'::TEXT[], false),
  ('embedded-images', 'nonverbal-reasoning', 'Embedded Images', 'Spatial Construction', 'Hidden shape detection inside complex figures.', 'Eye', '{}'::TEXT[], false),
  ('counting-of-figures', 'nonverbal-reasoning', 'Counting of Figures', 'Spatial Construction', 'Counting triangles, squares, rectangles, and straight lines.', 'Hash', '{}'::TEXT[], false),
  ('grouping-of-images', 'nonverbal-reasoning', 'Grouping of Identical Figures', 'Spatial Construction', 'Sorting mixed figures into matching groups of 3.', 'Combine', '{}'::TEXT[], false),
  ('shape-construction', 'nonverbal-reasoning', 'Shape Construction & Reconstruction', 'Spatial Construction', 'Visualizing component polygon pieces assembling into a complete shape.', 'Shapes', '{}'::TEXT[], false),
  ('nonverbal-analogy', 'nonverbal-reasoning', 'Nonverbal Analogy', 'Spatial Construction', 'Visual shape relationships and proportional transformation.', 'Link', '{}'::TEXT[], false),
  ('nonverbal-classification', 'nonverbal-reasoning', 'Nonverbal Classification', 'Spatial Construction', 'Spotting the odd visual figure among given options.', 'Tag', '{}'::TEXT[], false)
ON CONFLICT (id) DO UPDATE SET
  category_slug = EXCLUDED.category_slug,
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  formulas = EXCLUDED.formulas,
  is_hidden = EXCLUDED.is_hidden;

-- --------------------------------------------------------------------
-- 7. Technical & Cognitive Aptitude (6 Topics)
-- --------------------------------------------------------------------
INSERT INTO public.aptitude_topics (id, category_slug, name, cluster, description, icon_name, formulas, is_hidden)
VALUES
  ('pseudocode-tracing', 'technical-aptitude', 'Pseudocode & Variable Tracing', 'Pseudocode & Algorithms', 'Tracing execution flow, loop variables, nested conditions, and dry-runs.', 'Terminal', '{}'::TEXT[], false),
  ('bitwise-operators', 'technical-aptitude', 'Bitwise Operators & Logic', 'Pseudocode & Algorithms', 'Bitwise AND (&), OR (|), XOR (^), Left Shift (<<), and Right Shift (>>).', 'Binary', '{}'::TEXT[], false),
  ('recursion-functions', 'technical-aptitude', 'Recursion & Function Scope', 'Pseudocode & Algorithms', 'Recursive call stacks, base conditions, return values, and global vs local scopes.', 'Workflow', '{}'::TEXT[], false),
  ('attention-to-detail', 'technical-aptitude', 'Attention to Detail & Visual Checking', 'Cognitive & Speed Testing', 'Speed-based alphanumeric string matching, error spotting, and visual accuracy.', 'CheckCheck', '{}'::TEXT[], false),
  ('code-debugging-logic', 'technical-aptitude', 'Code Debugging & Automata Fix', 'Cognitive & Speed Testing', 'Spotting logical, syntactic, and boundary condition bugs in code snippets.', 'Cpu', '{}'::TEXT[], false),
  ('cloud-networking-basics', 'technical-aptitude', 'General Tech, OS & Cloud Basics', 'Cognitive & Speed Testing', 'Placement MCQs on OS fundamentals, database queries, and cloud basics.', 'Network', '{}'::TEXT[], false)
ON CONFLICT (id) DO UPDATE SET
  category_slug = EXCLUDED.category_slug,
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  formulas = EXCLUDED.formulas,
  is_hidden = EXCLUDED.is_hidden;