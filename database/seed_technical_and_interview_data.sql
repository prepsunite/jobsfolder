-- ====================================================================
-- Seed Script: Technical & Interview Initial Data for Supabase
-- ====================================================================

-- 1. SEED TECHNICAL TOPICS (PROGRAMMING 150)
INSERT INTO public.technical_topics (id, track, category, name, cluster, description, icon_name, sort_order, is_hidden)
VALUES
  ('syntax-operators', 'PROGRAMMING_150', 'SYNTAX_BASICS', 'Syntax, Operators & Typecasting', 'Stage 1: Language & Control Flow', 'Data types, fast I/O, arithmetic & bitwise operator precedence, typecasting, and ASCII arithmetic.', 'Code2', 1, false),
  ('conditionals-loops', 'PROGRAMMING_150', 'SYNTAX_BASICS', 'Conditionals & Iteration Loops', 'Stage 1: Language & Control Flow', 'If-else branches, switch-case calculators, while/for loops, break/continue, and summation logic.', 'Terminal', 2, false),
  ('digit-manipulation', 'PROGRAMMING_150', 'NUMBER_LOGIC', 'Digit Extraction & Manipulation', 'Stage 2: Mathematical & Number Logic', 'Modulo 10 extractions, counting digits, reversing integers, digital roots, and palindrome numbers.', 'Hash', 3, false),
  ('primes-divisibility', 'PROGRAMMING_150', 'NUMBER_LOGIC', 'Primes, Divisibility & Euclidean Math', 'Stage 2: Mathematical & Number Logic', 'Prime checks in O(sqrt(N)), Sieve of Eratosthenes, Euclidean GCD/LCM, and divisor extraction.', 'Binary', 4, false),
  ('special-numbers', 'PROGRAMMING_150', 'NUMBER_LOGIC', 'Special Numbers & Sequences', 'Stage 2: Mathematical & Number Logic', 'Armstrong, Strong, Harshad, Perfect, Automorphic numbers, and the Fibonacci sequence.', 'Sparkles', 5, false),
  ('patterns', 'PROGRAMMING_150', 'PATTERNS', 'Star, Number & Symmetric Patterns', 'Stage 3: 2D Grid & Patterns', 'Pyramids, inverted pyramids, hollow shapes, Floyd''s triangle, Pascal''s triangle, and butterfly patterns.', 'Shuffle', 6, false),
  ('arrays-fundamentals', 'PROGRAMMING_150', 'ARRAYS', '1D Arrays: Fundamentals & Linear Scans', 'Stage 4: 1D Arrays', 'Min/Max search, in-place reversal, sorted verification, frequency tables, and linear scanning.', 'Layers', 7, false),
  ('arrays-two-pointers', 'PROGRAMMING_150', 'ARRAYS', '1D Arrays: Two Pointers & Transformations', 'Stage 4: 1D Arrays', 'Second largest distinct element, in-place duplicate removal, moving zeroes, and array rotation by K.', 'Sliders', 8, false),
  ('arrays-subarrays', 'PROGRAMMING_150', 'ARRAYS', '1D Arrays: Subarrays & Classic Patterns', 'Stage 4: 1D Arrays', 'Kadane''s algorithm for maximum subarray sum, missing numbers, leader elements, and running prefix sums.', 'Layers', 9, false),
  ('matrices-grid', 'PROGRAMMING_150', 'ARRAYS', '2D Arrays & Matrix Mathematics', 'Stage 5: Matrices & Strings', 'Matrix multiplication, in-place transpose, 90° clockwise rotation, and spiral boundary traversal.', 'Grid', 10, false),
  ('strings-basics', 'PROGRAMMING_150', 'STRINGS', 'String Fundamentals & ASCII Scans', 'Stage 5: Matrices & Strings', 'Case toggle, vowel/consonant counter, space removal, and ASCII character arithmetic.', 'Type', 11, false),
  ('strings-palindromes', 'PROGRAMMING_150', 'STRINGS', 'Palindromes, Anagrams & Frequency Maps', 'Stage 5: Matrices & Strings', 'Two-pointer palindrome verification, 26-element alphabet frequency hash, and anagram detection.', 'Sparkles', 12, false),
  ('strings-word-parsing', 'PROGRAMMING_150', 'STRINGS', 'Word Parsing & Token Manipulation', 'Stage 5: Matrices & Strings', 'Sentence word count, in-place word reversal, longest word identification, and Run-Length Encoding.', 'Type', 13, false),
  ('recursion-backtracking', 'PROGRAMMING_150', 'RECURSION', 'Recursion & Backtracking Fundamentals', 'Stage 6: Recursion & Advanced', 'Base condition termination, call stack tracing, subset generation, and Tower of Hanoi recursion.', 'Cpu', 14, false),
  ('searching-sorting', 'PROGRAMMING_150', 'SEARCHING_SORTING', 'Searching & Sorting Essentials', 'Stage 6: Recursion & Advanced', 'Binary Search on sorted space, Bubble/Insertion/Selection Sort, and Merge/Quick Sort partition logic.', 'Search', 15, false),
  ('bit-manipulation', 'PROGRAMMING_150', 'BIT_MANIPULATION', 'Bit Manipulation & Low-Level Math', 'Stage 6: Recursion & Advanced', 'Power of 2 check via (n & (n-1)), single non-repeating element using XOR, and Brian Kernighan''s algorithm.', 'Binary', 16, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  category = EXCLUDED.category,
  track = EXCLUDED.track;

-- 2. SEED TECHNICAL TOPICS (CAMPUS DSA 15 PATTERNS)
INSERT INTO public.technical_topics (id, track, category, name, cluster, description, icon_name, sort_order, is_hidden)
VALUES
  ('dsa-two-pointers', 'CAMPUS_DSA', 'TWO_POINTERS', 'Two Pointers Pattern', '1. Two Pointers Pattern', 'Converging left/right pointers for sorted pairs, palindromes, and 3Sum problems.', 'Sliders', 1, false),
  ('dsa-sliding-window', 'CAMPUS_DSA', 'SLIDING_WINDOW', 'Sliding Window (Fixed & Variable)', '2. Sliding Window Pattern', 'Dynamic subsegment expansion and contraction for subarrays, substrings, and anagrams.', 'Layers', 2, false),
  ('dsa-fast-slow-pointers', 'CAMPUS_DSA', 'LINKED_LISTS', 'Fast & Slow Pointers (Floyd''s Cycle)', '3. Fast & Slow Pointers', 'Cycle detection in linked lists, finding middle node, and duplicate number detection.', 'Zap', 3, false),
  ('dsa-merge-intervals', 'CAMPUS_DSA', 'ARRAYS', 'Merge Overlapping Intervals', '4. Merge Intervals', 'Sorting by start time to merge, insert, and find non-overlapping intervals.', 'GitMerge', 4, false),
  ('dsa-cyclic-sort', 'CAMPUS_DSA', 'SEARCHING_SORTING', 'Cyclic Sort (1 to N in O(N))', '5. Cyclic Sort', 'In-place element index placement to find missing and duplicate numbers in linear time.', 'Shuffle', 5, false),
  ('dsa-in-place-linked-list', 'CAMPUS_DSA', 'LINKED_LISTS', 'In-Place Reversal of a Linked List', '6. In-Place LinkedList Reversal', 'Iterative pointer manipulation to reverse single lists, sub-segments, and K-group nodes.', 'GitMerge', 6, false),
  ('dsa-tree-bfs', 'CAMPUS_DSA', 'TREES_BINARY_TREES', 'Tree Breadth-First Search (Level Order)', '7. Tree BFS', 'Queue-based level-order traversal, zigzag order, and computing level averages.', 'Layers', 7, false),
  ('dsa-tree-dfs', 'CAMPUS_DSA', 'TREES_BINARY_TREES', 'Tree Depth-First Search (Path Sums)', '8. Tree DFS', 'Preorder, inorder, and postorder recursions to find root-to-leaf path sums and tree diameters.', 'Cpu', 8, false),
  ('dsa-two-heaps', 'CAMPUS_DSA', 'STACKS_QUEUES', 'Two Heaps (Find Median)', '9. Two Heaps Pattern', 'Maintaining Min-Heap and Max-Heap simultaneously for streaming median calculations.', 'Layers', 9, false),
  ('dsa-subsets-backtracking', 'CAMPUS_DSA', 'RECURSION', 'Subsets & Permutations (Backtracking)', '10. Subsets & Backtracking', 'Generating powersets, unique combinations, and permutations with pruning.', 'Shuffle', 10, false),
  ('dsa-modified-binary-search', 'CAMPUS_DSA', 'SEARCHING_SORTING', 'Modified Binary Search', '11. Modified Binary Search', 'Binary search on rotated arrays, peak elements, and searching infinite streams.', 'Search', 11, false),
  ('dsa-top-k-elements', 'CAMPUS_DSA', 'STACKS_QUEUES', 'Top ''K'' Elements (PriorityQueue)', '12. Top K Elements', 'Min-Heap and Max-Heap extraction of Kth largest, frequency sorts, and closest points.', 'Layers', 12, false),
  ('dsa-k-way-merge', 'CAMPUS_DSA', 'LINKED_LISTS', 'K-Way Merge', '13. K-Way Merge', 'Merging K sorted arrays or linked lists efficiently using a Min-Heap.', 'GitMerge', 13, false),
  ('dsa-01-knapsack-dp', 'CAMPUS_DSA', 'DYNAMIC_PROGRAMMING', '0/1 Knapsack & Classic DP', '14. 0/1 Knapsack & DP', 'Tabulation and memoization for subset sum, partition equal subset, and target sums.', 'Brain', 14, false),
  ('dsa-topological-sort', 'CAMPUS_DSA', 'DYNAMIC_PROGRAMMING', 'Topological Sort (Kahn''s BFS / DFS)', '15. Topological Sort (Graphs)', 'In-degree queue processing and DFS cycle detection for course schedules and build orders.', 'Network', 15, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  category = EXCLUDED.category,
  track = EXCLUDED.track;

-- 3. SEED TECHNICAL TOPICS (TECHNICAL MCQS)
INSERT INTO public.technical_topics (id, track, category, name, cluster, description, icon_name, sort_order, is_hidden)
VALUES
  ('mcq-c-programming', 'TECHNICAL_MCQS', 'C_PROGRAMMING', 'C Language & Pointers', 'Core Programming Languages', 'Pointers, memory layout, printf formatting, preprocessor macros, and struct padding.', 'Code2', 1, false),
  ('mcq-cpp-programming', 'TECHNICAL_MCQS', 'CPP_PROGRAMMING', 'C++ & OOP Concepts', 'Core Programming Languages', 'Virtual functions, vtable, templates, smart pointers, operator overloading, and STL containers.', 'Terminal', 2, false),
  ('mcq-java-programming', 'TECHNICAL_MCQS', 'JAVA_PROGRAMMING', 'Java Core & JVM Internals', 'Core Programming Languages', 'JVM memory model, garbage collection, multithreading, string pool, and collections framework.', 'Cpu', 3, false),
  ('mcq-database-systems', 'TECHNICAL_MCQS', 'DATABASE', 'DBMS & SQL Concepts', 'Core CS Subjects', 'ACID transactions, B-Tree indexes, normal forms, joins, triggers, and lock concurrency.', 'Database', 4, false),
  ('mcq-operating-systems', 'TECHNICAL_MCQS', 'OPERATING_SYSTEMS', 'Operating Systems & Concurrency', 'Core CS Subjects', 'Process scheduling, deadlocks, paging, Belady''s anomaly, semaphore vs mutex, and fork() calls.', 'Server', 5, false),
  ('mcq-computer-networks', 'TECHNICAL_MCQS', 'NETWORKING', 'Computer Networks & Protocols', 'Core CS Subjects', 'OSI layers, TCP handshake, subnetting, DNS routing, ARP, and HTTP status codes.', 'Network', 6, false),
  ('mcq-data-structures', 'TECHNICAL_MCQS', 'DATA_STRUCTURES', 'Data Structures & Algorithms', 'Data Structures & Logic', 'BST properties, stack vs queue amortized costs, graph representations, and hashing collisions.', 'Layers', 7, false),
  ('mcq-pseudo-code', 'TECHNICAL_MCQS', 'PSEUDO_CODE', 'Campus OA Pseudo-Code', 'Data Structures & Logic', 'Accenture, Capgemini, TCS Prime bitwise half-adder dry runs and recursion traces.', 'Binary', 8, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  category = EXCLUDED.category,
  track = EXCLUDED.track;

-- 4. SEED INTERVIEW TOPICS
INSERT INTO public.interview_topics (id, category, name, cluster, description, icon_name, sort_order, is_hidden)
VALUES
  ('topic-dbms', 'CORE_CS', 'Database Management Systems (DBMS)', 'Database Systems', 'ACID properties, B-Tree indexes, normalization, concurrency control, and transactions.', 'Database', 1, false),
  ('topic-sql', 'CORE_CS', 'SQL Queries & Optimization', 'Database Systems', 'Complex inner/outer joins, window functions, ranking queries, and indexing performance.', 'Table', 2, false),
  ('topic-oops', 'CORE_CS', 'OOPs Concepts & SOLID Principles', 'Software Engineering', 'Polymorphism, inheritance, encapsulation, abstraction, and industry design patterns.', 'Layers', 3, false),
  ('topic-os', 'CORE_CS', 'Operating Systems & Concurrency', 'Systems Architecture', 'Process vs thread, deadlock detection, paging vs segmentation, and mutex/semaphores.', 'Cpu', 4, false),
  ('topic-cn', 'CORE_CS', 'Computer Networks & Protocols', 'Systems Architecture', 'OSI 7 layers, TCP 3-way handshake, UDP, DNS flow, and HTTP/HTTPS encryption.', 'Network', 5, false),
  ('topic-hr-intro', 'HR_BEHAVIORAL', 'Self-Introduction & Career Fit', 'Foundations', 'Elevator pitch, walking through resume, why this company, and short/long term goals.', 'UserCheck', 6, false),
  ('topic-hr-star', 'HR_BEHAVIORAL', 'STAR Method: Leadership & Ownership', 'Behavioral Competencies', 'Situation, Task, Action, Result structured answers for leadership, deadlines, and pressure.', 'Award', 7, false),
  ('topic-hr-conflict', 'HR_BEHAVIORAL', 'Conflict Resolution & Teamwork', 'Interpersonal Skills', 'Resolving technical disagreements, handling critical feedback, and cross-functional team work.', 'Users', 8, false),
  ('topic-hr-traps', 'HR_BEHAVIORAL', 'Behavioral Traps & Difficult Scenarios', 'Situational Judgment', 'Handling biggest weakness, answering career gaps, ethical dilemmas, and failures.', 'HelpCircle', 9, false),
  ('topic-proj-architecture', 'PROJECT_DEFENSE', 'Architecture & Tech Stack Justification', 'System Design', 'Defending why you chose React/Node/Python, API architecture, and microservices vs monolith.', 'Layers', 10, false),
  ('topic-proj-database', 'PROJECT_DEFENSE', 'Database Choices & Schema Defense', 'Data Architecture', 'Relational vs NoSQL trade-offs, schema design, indexes, and handling concurrent writes.', 'Database', 11, false),
  ('topic-proj-scalability', 'PROJECT_DEFENSE', 'Scalability, Caching & Performance', 'Performance & Scale', 'Redis caching, pagination, load balancing, CDN, database indexing, and query optimization.', 'Zap', 12, false),
  ('topic-proj-security', 'PROJECT_DEFENSE', 'Security, Auth & Edge Cases', 'Production Readiness', 'JWT vs Sessions, OAuth2, SQL injection protection, CORS, rate limiting, and hashing.', 'ShieldCheck', 13, false),
  ('topic-proj-live-debugging', 'PROJECT_DEFENSE', 'Live Debugging & Tough Inquiries', 'Interview Defense', 'Handling bugs found live in interview, explaining failure scenarios, and code walkthroughs.', 'BookOpen', 14, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  cluster = EXCLUDED.cluster,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  category = EXCLUDED.category;
