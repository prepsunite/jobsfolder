import type { ProgrammingTopic, ProgrammingProblem } from '@/types/technical';

// ── STAGE TO SUBTOPIC MAPPINGS ──
export const STAGE_SUBTOPIC_TO_STAGE_MAP: Record<string, string> = {
  'syntax-operators': 'stage-1',
  'conditionals-loops': 'stage-1',
  'digit-manipulation': 'stage-2',
  'primes-divisibility': 'stage-2',
  'special-numbers': 'stage-2',
  'patterns': 'stage-3',
  'arrays-fundamentals': 'stage-4',
  'arrays-two-pointers': 'stage-4',
  'arrays-subarrays': 'stage-4',
  'hashing-frequency': 'stage-4',
  'matrices-grid': 'stage-5',
  'strings-fundamentals': 'stage-5',
  'strings-algorithms': 'stage-5',
  'strings-basics': 'stage-5',
  'strings-palindromes': 'stage-5',
  'strings-word-parsing': 'stage-5',
  'recursion-backtracking': 'stage-6',
  'searching-sorting': 'stage-6',
  'bit-manipulation': 'stage-6',
  'stage-1': 'stage-1',
  'stage-2': 'stage-2',
  'stage-3': 'stage-3',
  'stage-4': 'stage-4',
  'stage-5': 'stage-5',
  'stage-6': 'stage-6',
};

export const STAGE_ID_TO_SUBTOPIC_IDS: Record<string, string[]> = {
  'stage-1': ['syntax-operators', 'conditionals-loops'],
  'stage-2': ['digit-manipulation', 'primes-divisibility', 'special-numbers'],
  'stage-3': ['patterns'],
  'stage-4': ['arrays-fundamentals', 'arrays-two-pointers', 'arrays-subarrays', 'hashing-frequency'],
  'stage-5': ['matrices-grid', 'strings-fundamentals', 'strings-algorithms', 'strings-basics', 'strings-palindromes', 'strings-word-parsing'],
  'stage-6': ['recursion-backtracking', 'searching-sorting', 'bit-manipulation'],
};

// ── 6 MILESTONE STAGES FOR PROGRAMMING 150 ──
export const PROGRAMMING_150_STAGES: ProgrammingTopic[] = [
  {
    id: 'stage-1',
    title: 'Stage 1: Language & Control Flow Foundations',
    name: 'Stage 1: Language & Control Flow Foundations',
    cluster: 'Stage 1',
    description: 'Syntax & Typecasting • Operator Precedence • Conditionals & Iteration Loops',
    iconName: 'Terminal',
    category: 'SYNTAX_BASICS',
    track: 'PROGRAMMING_150',
    order: 1,
    sort_order: 1,
    stageNumber: 1,
    subtopicIds: ['syntax-operators', 'conditionals-loops'],
    subtopics: [
      { id: 'syntax-operators', title: 'Syntax, Operators & Typecasting', description: 'Data types, fast I/O, arithmetic & bitwise operator precedence, typecasting, ASCII arithmetic.' },
      { id: 'conditionals-loops', title: 'Conditionals & Iteration Loops', description: 'If-else branches, switch-case calculators, while/for loops, break/continue, summation logic.' },
    ],
    tips: [
      'Bitwise trick: `n & (n - 1)` clears the lowest set bit in O(1).',
      'Leap year rule: divisible by 4, but not by 100 unless also divisible by 400.',
      'ASCII values: 0-9 is 48-57, A-Z is 65-90, a-z is 97-122.',
      'Always watch for integer overflow when multiplying large values in Java/C++ (use long/long long).'
    ]
  },
  {
    id: 'stage-2',
    title: 'Stage 2: Mathematical & Number Logic',
    name: 'Stage 2: Mathematical & Number Logic',
    cluster: 'Stage 2',
    description: 'Digit Extraction • Primes & Divisibility • Euclidean GCD/LCM • Special Numbers',
    iconName: 'Hash',
    category: 'NUMBER_LOGIC',
    track: 'PROGRAMMING_150',
    order: 2,
    sort_order: 2,
    stageNumber: 2,
    subtopicIds: ['digit-manipulation', 'primes-divisibility', 'special-numbers'],
    subtopics: [
      { id: 'digit-manipulation', title: 'Digit Extraction & Manipulation', description: 'Modulo 10 extractions, counting digits, reversing integers, digital roots, palindrome numbers.' },
      { id: 'primes-divisibility', title: 'Primes, Divisibility & Euclidean Math', description: 'Prime checks in O(sqrt(N)), Sieve of Eratosthenes, Euclidean GCD/LCM, divisor extraction.' },
      { id: 'special-numbers', title: 'Special Numbers & Sequences', description: 'Armstrong, Strong, Harshad, Perfect, Automorphic numbers, Fibonacci sequence.' },
    ],
    tips: [
      'Digital root: `num == 0 ? 0 : (num % 9 == 0 ? 9 : num % 9)`.',
      'Euclidean GCD: `gcd(a, b) = gcd(b, a % b)`. LCM: `(a / gcd(a, b)) * b` to prevent overflow.',
      'Prime check optimization: test up to sqrt(N) in steps of 6 (6k +/- 1).',
      'Armstrong number: sum of each digit raised to the power of the number of digits.'
    ]
  },
  {
    id: 'stage-3',
    title: 'Stage 3: 2D Grid & Pattern Programming',
    name: 'Stage 3: 2D Grid & Pattern Programming',
    cluster: 'Stage 3',
    description: 'Star Pyramids • Number Triangles • Inverted & Hollow Patterns • Symmetric Grids',
    iconName: 'Grid',
    category: 'PATTERNS',
    track: 'PROGRAMMING_150',
    order: 3,
    sort_order: 3,
    stageNumber: 3,
    subtopicIds: ['patterns'],
    subtopics: [
      { id: 'patterns', title: 'Star, Number & Symmetric Patterns', description: 'Pyramids, inverted pyramids, hollow shapes, Floyd\'s triangle, Pascal\'s triangle, butterfly patterns.' },
    ],
    tips: [
      'Always split 2D patterns into rows (outer loop) and spaces + characters (inner loops).',
      'For symmetric diamonds, print row by row with `Math.abs(n - i)` spaces.',
      'Floyd\'s triangle: keep a continuous running counter across nested loops.'
    ]
  },
  {
    id: 'stage-4',
    title: 'Stage 4: Linear Data Structures: 1D Arrays',
    name: 'Stage 4: Linear Data Structures: 1D Arrays',
    cluster: 'Stage 4',
    description: 'Linear Scans • Two Pointers • In-Place Transforms • Subarrays & Kadane • Frequency Maps',
    iconName: 'Layers',
    category: 'ARRAYS',
    track: 'PROGRAMMING_150',
    order: 4,
    sort_order: 4,
    stageNumber: 4,
    subtopicIds: ['arrays-fundamentals', 'arrays-two-pointers', 'arrays-subarrays', 'hashing-frequency'],
    subtopics: [
      { id: 'arrays-fundamentals', title: '1D Arrays: Fundamentals & Linear Scans', description: 'Min/Max search, in-place reversal, sorted verification, frequency tables.' },
      { id: 'arrays-two-pointers', title: '1D Arrays: Two Pointers & Transformations', description: 'Second largest, in-place duplicate removal, moving zeroes, array rotation by K.' },
      { id: 'arrays-subarrays', title: '1D Arrays: Subarrays & Classic Patterns', description: 'Kadane\'s algorithm, missing numbers, leader elements, running prefix sums.' },
      { id: 'hashing-frequency', title: '1D Arrays: Hashing & Frequency Maps', description: 'Direct-index frequency arrays, HashMap lookups, Two Sum in O(N).' },
    ],
    tips: [
      'Kadane\'s algorithm finds maximum subarray sum in O(N) time and O(1) space.',
      'Two pointers in-place: slow pointer for unique position, fast pointer for scanning.',
      'Two Sum in O(N): use a hash map storing `target - current_val`.'
    ]
  },
  {
    id: 'stage-5',
    title: 'Stage 5: Matrices & String Manipulation',
    name: 'Stage 5: Matrices & String Manipulation',
    cluster: 'Stage 5',
    description: '2D Matrix Math & Rotations • String Traversals & ASCII • Anagrams & Substrings',
    iconName: 'Type',
    category: 'STRINGS',
    track: 'PROGRAMMING_150',
    order: 5,
    sort_order: 5,
    stageNumber: 5,
    subtopicIds: ['matrices-grid', 'strings-fundamentals', 'strings-algorithms'],
    subtopics: [
      { id: 'matrices-grid', title: '2D Arrays & Matrix Mathematics', description: 'Matrix multiplication, in-place transpose, 90° clockwise rotation, spiral boundary traversal.' },
      { id: 'strings-fundamentals', title: 'Strings: Fundamentals & ASCII Logic', description: 'String length without library calls, vowel/consonant counts, word reversal, case toggling.' },
      { id: 'strings-algorithms', title: 'Strings: Anagrams, Substrings & Compression', description: 'Valid Anagram verification, Run-Length Encoding (RLE), longest common prefix.' },
    ],
    tips: [
      'Rotate matrix 90° clockwise: first transpose the matrix in-place, then reverse each row.',
      'Spiral matrix traversal: maintain four boundaries (top, bottom, left, right) and shrink inward.',
      'Anagram check: direct frequency array of size 26 or 256 for O(N) time.'
    ]
  },
  {
    id: 'stage-6',
    title: 'Stage 6: Recursion, Search & Advanced Logic',
    name: 'Stage 6: Recursion, Search & Advanced Logic',
    cluster: 'Stage 6',
    description: 'Recursion Mechanics • Backtracking & Subsets • Binary Search • Bit Manipulation Hacks',
    iconName: 'Cpu',
    category: 'RECURSION',
    track: 'PROGRAMMING_150',
    order: 6,
    sort_order: 6,
    stageNumber: 6,
    subtopicIds: ['recursion-backtracking', 'searching-sorting', 'bit-manipulation'],
    subtopics: [
      { id: 'recursion-backtracking', title: 'Recursion & Backtracking Basics', description: '1 to N recursion, Tower of Hanoi puzzle, recursive array sum, Power Set generation.' },
      { id: 'searching-sorting', title: 'Searching & Sorting Algorithms', description: 'Binary search with overflow guards, rotated sorted search, bubble sort, selection sort, merge sort.' },
      { id: 'bit-manipulation', title: 'Bit Manipulation Hacks & Math Tricks', description: 'Even/odd check, powers of two, Brian Kernighan\'s bit counter, XOR cancellations.' },
    ],
    tips: [
      'Binary search mid calculation: `mid = low + (high - low) / 2` to prevent 32-bit overflow.',
      'XOR properties: `x ^ x = 0`, `x ^ 0 = x`. Perfect for finding single non-duplicate element.',
      'Tower of Hanoi: 2^N - 1 total moves; solve by moving N-1 disks to helper, Nth to target, N-1 to target.'
    ]
  }
];

export const PROGRAMMING_TOPICS: ProgrammingTopic[] = PROGRAMMING_150_STAGES;

export const PROGRAMMING_MICRO_TOPICS: ProgrammingTopic[] = [
  // ── STAGE 1: LANGUAGE & CONTROL FLOW FOUNDATIONS ──
  {
    id: 'syntax-operators',
    title: 'Syntax, Operators & Typecasting',
    cluster: 'Stage 1: Language & Control Flow',
    description: 'Data types, fast I/O, arithmetic & bitwise operator precedence, typecasting, and ASCII arithmetic.',
    iconName: 'Code2',
    category: 'SYNTAX_BASICS',
    order: 1,
  },
  {
    id: 'conditionals-loops',
    title: 'Conditionals & Iteration Loops',
    cluster: 'Stage 1: Language & Control Flow',
    description: 'If-else branches, switch-case calculators, while/for loops, break/continue, and summation logic.',
    iconName: 'Terminal',
    category: 'SYNTAX_BASICS',
    order: 2,
  },

  // ── STAGE 2: MATHEMATICAL & NUMBER LOGIC ──
  {
    id: 'digit-manipulation',
    title: 'Digit Extraction & Manipulation',
    cluster: 'Stage 2: Mathematical & Number Logic',
    description: 'Modulo 10 extractions, counting digits, reversing integers, digital roots, and palindrome numbers.',
    iconName: 'Hash',
    category: 'NUMBER_LOGIC',
    order: 3,
  },
  {
    id: 'primes-divisibility',
    title: 'Primes, Divisibility & Euclidean Math',
    cluster: 'Stage 2: Mathematical & Number Logic',
    description: 'Prime checks in O(sqrt(N)), Sieve of Eratosthenes, Euclidean GCD/LCM, and divisor extraction.',
    iconName: 'Binary',
    category: 'NUMBER_LOGIC',
    order: 4,
  },
  {
    id: 'special-numbers',
    title: 'Special Numbers & Sequences',
    cluster: 'Stage 2: Mathematical & Number Logic',
    description: 'Armstrong, Strong, Harshad, Perfect, Automorphic numbers, and the Fibonacci sequence.',
    iconName: 'Sparkles',
    category: 'NUMBER_LOGIC',
    order: 5,
  },

  // ── STAGE 3: 2D GRID & PATTERN PROGRAMMING ──
  {
    id: 'patterns',
    title: 'Star, Number & Symmetric Patterns',
    cluster: 'Stage 3: 2D Grid & Patterns',
    description: 'Pyramids, inverted pyramids, hollow shapes, Floyd\'s triangle, Pascal\'s triangle, and butterfly patterns.',
    iconName: 'Shuffle',
    category: 'PATTERNS',
    order: 6,
  },

  // ── STAGE 4: LINEAR DATA STRUCTURES: 1D ARRAYS ──
  {
    id: 'arrays-fundamentals',
    title: '1D Arrays: Fundamentals & Linear Scans',
    cluster: 'Stage 4: 1D Arrays',
    description: 'Min/Max search, in-place reversal, sorted verification, frequency tables, and linear scanning.',
    iconName: 'Layers',
    category: 'ARRAYS',
    order: 7,
  },
  {
    id: 'arrays-two-pointers',
    title: '1D Arrays: Two Pointers & Transformations',
    cluster: 'Stage 4: 1D Arrays',
    description: 'Second largest distinct element, in-place duplicate removal, moving zeroes, and array rotation by K.',
    iconName: 'Sliders',
    category: 'ARRAYS',
    order: 8,
  },
  {
    id: 'arrays-subarrays',
    title: '1D Arrays: Subarrays & Classic Patterns',
    cluster: 'Stage 4: 1D Arrays',
    description: 'Kadane\'s algorithm for maximum subarray sum, missing numbers, leader elements, and running prefix sums.',
    iconName: 'Layers',
    category: 'ARRAYS',
    order: 9,
  },
  {
    id: 'hashing-frequency',
    title: '1D Arrays: Hashing & Frequency Maps',
    cluster: 'Stage 4: 1D Arrays',
    description: 'Direct-index frequency arrays, HashMap lookups, Two Sum in O(N), first non-repeating element, and prefix map lookups.',
    iconName: 'Database',
    category: 'ARRAYS',
    order: 10,
    track: 'PROGRAMMING_150',
  },

  // ── STAGE 5: MATRICES & STRING MANIPULATION ──
  {
    id: 'matrices-grid',
    title: '2D Arrays & Matrix Mathematics',
    cluster: 'Stage 5: Matrices & Strings',
    description: 'Matrix multiplication, in-place transpose, 90° clockwise rotation, and spiral boundary traversal.',
    iconName: 'Grid',
    category: 'ARRAYS',
    order: 11,
  },
  {
    id: 'strings-fundamentals',
    title: 'Strings: Fundamentals & ASCII Logic',
    cluster: 'Stage 5: Matrices & Strings',
    description: 'String length without library calls, vowel/consonant counts, word reversal, and case toggling.',
    iconName: 'Type',
    category: 'STRINGS',
    order: 12,
  },
  {
    id: 'strings-algorithms',
    title: 'Strings: Anagrams, Substrings & Compression',
    cluster: 'Stage 5: Matrices & Strings',
    description: 'Valid Anagram verification, Run-Length Encoding (RLE), longest common prefix, and first non-repeating char.',
    iconName: 'Sparkles',
    category: 'STRINGS',
    order: 13,
  },

  // ── STAGE 6: RECURSION, SEARCHING & BIT HACKS ──
  {
    id: 'recursion-backtracking',
    title: 'Recursion & Backtracking Basics',
    cluster: 'Stage 6: Recursion, Search & Bits',
    description: '1 to N recursion, Tower of Hanoi puzzle, recursive array sum, and Power Set generation.',
    iconName: 'Cpu',
    category: 'RECURSION',
    order: 14,
  },
  {
    id: 'searching-sorting',
    title: 'Searching & Sorting Algorithms',
    cluster: 'Stage 6: Recursion, Search & Bits',
    description: 'Binary search with overflow guards, rotated sorted search, bubble sort, selection sort, and merge sort.',
    iconName: 'Search',
    category: 'SEARCHING_SORTING',
    order: 15,
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation Hacks & Math Tricks',
    cluster: 'Stage 6: Recursion, Search & Bits',
    description: 'Even/odd check, powers of two, Brian Kernighan\'s bit counter, XOR cancellations, and in-place swaps.',
    iconName: 'Binary',
    category: 'BIT_MANIPULATION',
    order: 16,
    track: 'PROGRAMMING_150',
  },
];

// ============================================================================
// CAMPUS DSA CORE: 15 CURATED PLACEMENT PATTERNS (4 PATTERN CATEGORIES)
// ============================================================================
export const CAMPUS_DSA_TOPICS: ProgrammingTopic[] = [
  // ── POINTERS & SLIDING WINDOW ──
  {
    id: 'dsa-sliding-window',
    title: 'Sliding Window Pattern',
    cluster: 'Pointers & Sliding Window',
    description: 'Subarrays, longest substrings, minimum window substrings, and fixed/dynamic window scans.',
    iconName: 'Sliders',
    category: 'SLIDING_WINDOW',
    order: 1,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-two-pointers',
    title: 'Two Pointers & Trapping Water',
    cluster: 'Pointers & Sliding Window',
    description: 'Opposing pointers, sorted pair sums, container with most water, and Dutch National Flag 3-way partition.',
    iconName: 'Shuffle',
    category: 'TWO_POINTERS',
    order: 2,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-fast-slow-pointers',
    title: 'Fast & Slow Pointers (Tortoise & Hare)',
    cluster: 'Pointers & Sliding Window',
    description: 'Floyd\'s cycle detection in linked lists, middle of linked list, and cycle start detection.',
    iconName: 'Zap',
    category: 'LINKED_LISTS',
    order: 3,
    track: 'CAMPUS_DSA',
  },

  // ── INTERVALS & SORTING ──
  {
    id: 'dsa-monotonic-stack',
    title: 'Monotonic Stack & Queue',
    cluster: 'Intervals & Sorting',
    description: 'Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram, and sliding window maximum.',
    iconName: 'Layers',
    category: 'STACKS_QUEUES',
    order: 4,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-merge-intervals',
    title: 'Merge Intervals & Overlap Logic',
    cluster: 'Intervals & Sorting',
    description: 'Meeting rooms, overlapping interval merging, insert interval, and non-overlapping interval counts.',
    iconName: 'Grid',
    category: 'ARRAYS',
    order: 5,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-cyclic-sort',
    title: 'Cyclic Sort & Missing Range',
    cluster: 'Intervals & Sorting',
    description: 'Find missing numbers, first missing positive, and duplicate element discovery in O(N) time and O(1) space.',
    iconName: 'Shuffle',
    category: 'SEARCHING_SORTING',
    order: 6,
    track: 'CAMPUS_DSA',
  },

  // ── TREES & HEAPS ──
  {
    id: 'dsa-inplace-linkedlist',
    title: 'In-place Reversal of LinkedList',
    cluster: 'Trees & Heaps',
    description: 'Reverse linked list, reverse nodes in k-group, and palindrome linked list verification.',
    iconName: 'GitMerge',
    category: 'LINKED_LISTS',
    order: 7,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-tree-bfs',
    title: 'Tree BFS & Level Order Traversal',
    cluster: 'Trees & Heaps',
    description: 'Level order traversal, zigzag traversal, right/left side view, and minimum depth of binary tree.',
    iconName: 'Binary',
    category: 'TREES_BINARY_TREES',
    order: 8,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-tree-dfs',
    title: 'Tree DFS & Path Sums',
    cluster: 'Trees & Heaps',
    description: 'Inorder/Preorder/Postorder, path sum validation, diameter of binary tree, and lowest common ancestor.',
    iconName: 'Brain',
    category: 'TREES_BINARY_TREES',
    order: 9,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-two-heaps',
    title: 'Two Heaps & Median Tracking',
    cluster: 'Trees & Heaps',
    description: 'Find median from data stream, sliding window median, and maximize capital with dual heaps.',
    iconName: 'Cpu',
    category: 'STACKS_QUEUES',
    order: 10,
    track: 'CAMPUS_DSA',
  },

  // ── BACKTRACKING, DP & GRAPHS ──
  {
    id: 'dsa-subsets-backtracking',
    title: 'Subsets, Combinations & Backtracking',
    cluster: 'Backtracking, DP & Graphs',
    description: 'Power set generation, permutations with duplicates, combination sum, and N-Queens.',
    iconName: 'Code2',
    category: 'RECURSION',
    order: 11,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-modified-binary-search',
    title: 'Modified Binary Search',
    cluster: 'Backtracking, DP & Graphs',
    description: 'Search in rotated sorted array, find peak element, single non-duplicate in sorted array.',
    iconName: 'Search',
    category: 'SEARCHING_SORTING',
    order: 12,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-top-k-elements',
    title: 'Top \'K\' Elements & Priority Queues',
    cluster: 'Backtracking, DP & Graphs',
    description: 'Kth largest element, top K frequent elements, sort characters by frequency using Min/Max Heap.',
    iconName: 'Sparkles',
    category: 'STACKS_QUEUES',
    order: 13,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-01-knapsack-dp',
    title: '0/1 Knapsack & Dynamic Programming',
    cluster: 'Backtracking, DP & Graphs',
    description: 'Subset sum, partition equal subset sum, coin change, and classic memoized 0/1 knapsack.',
    iconName: 'Terminal',
    category: 'DYNAMIC_PROGRAMMING',
    order: 14,
    track: 'CAMPUS_DSA',
  },
  {
    id: 'dsa-topological-sort',
    title: 'Topological Sort & Course Schedule',
    cluster: 'Backtracking, DP & Graphs',
    description: 'Course Schedule I & II, alien dictionary, cycle detection in directed graphs using Kahn\'s algorithm.',
    iconName: 'Layers',
    category: 'SEARCHING_SORTING',
    order: 15,
    track: 'CAMPUS_DSA',
  },
];

// ============================================================================
// TECHNICAL MCQS: INDIA BIX STANDARD SUBJECT DIRECTORY
// ============================================================================
export const TECHNICAL_MCQ_TOPICS: ProgrammingTopic[] = [
  // ── PROGRAMMING LANGUAGES ──
  {
    id: 'mcq-c-programming',
    title: 'C Programming',
    cluster: 'Programming Languages',
    description: 'Pointers, arrays, structures, storage classes, preprocessor directives, and memory allocation.',
    iconName: 'Terminal',
    category: 'SYNTAX_BASICS',
    order: 1,
    track: 'TECHNICAL_MCQS',
  },
  {
    id: 'mcq-cpp-programming',
    title: 'C++ Programming',
    cluster: 'Programming Languages',
    description: 'OOP concepts, constructors/destructors, virtual functions, templates, STL, and operator overloading.',
    iconName: 'Code2',
    category: 'SYNTAX_BASICS',
    order: 2,
    track: 'TECHNICAL_MCQS',
  },
  {
    id: 'mcq-csharp-programming',
    title: 'C# Programming',
    cluster: 'Programming Languages',
    description: 'CLR, garbage collection, value vs reference types, delegates & events, LINQ, and async/await.',
    iconName: 'Hash',
    category: 'SYNTAX_BASICS',
    order: 3,
    track: 'TECHNICAL_MCQS',
  },
  {
    id: 'mcq-java-programming',
    title: 'Java Programming',
    cluster: 'Programming Languages',
    description: 'String pool & immutability, collections framework, multithreading, exception handling, and JVM.',
    iconName: 'Code2',
    category: 'SYNTAX_BASICS',
    order: 4,
    track: 'TECHNICAL_MCQS',
  },

  // ── CORE COMPUTER SCIENCE ──
  {
    id: 'mcq-database',
    title: 'Database (DBMS & SQL)',
    cluster: 'Core CS Subjects',
    description: 'Normalization (1NF-BCNF), ACID properties, transactions & locking, SQL joins, and indexing.',
    iconName: 'Database',
    category: 'ARRAYS',
    order: 5,
    track: 'TECHNICAL_MCQS',
  },
  {
    id: 'mcq-networking',
    title: 'Computer Networks',
    cluster: 'Core CS Subjects',
    description: 'OSI & TCP/IP layers, subnet mask calculation, routing protocols, DNS/HTTP/TCP handshake, and ARP.',
    iconName: 'Network',
    category: 'SYNTAX_BASICS',
    order: 6,
    track: 'TECHNICAL_MCQS',
  },
  {
    id: 'mcq-operating-systems',
    title: 'Operating Systems',
    cluster: 'Core CS Subjects',
    description: 'Process scheduling, memory management & paging, semaphores & deadlocks, virtual memory, and fork().',
    iconName: 'Server',
    category: 'SYNTAX_BASICS',
    order: 7,
    track: 'TECHNICAL_MCQS',
  },

  // ── CAMPUS OA & STRUCTURES ──
  {
    id: 'mcq-data-structures',
    title: 'Data Structures',
    cluster: 'Campus OA & Structures',
    description: 'Arrays, stacks, queues, linked lists, binary search trees, heaps, graphs, and hashing techniques.',
    iconName: 'Layers',
    category: 'ARRAYS',
    order: 8,
    track: 'TECHNICAL_MCQS',
  },
  {
    id: 'mcq-pseudo-code',
    title: 'Campus OA Pseudo-Code',
    cluster: 'Campus OA & Structures',
    description: 'Accenture, Capgemini, and Cognizant pseudo-code dry-runs, bitwise operators, and recursive calls.',
    iconName: 'Cpu',
    category: 'BIT_MANIPULATION',
    order: 9,
    track: 'TECHNICAL_MCQS',
  },
];

export const PROGRAMMING_150_EXPANDED_SEED: ProgrammingProblem[] = [];
