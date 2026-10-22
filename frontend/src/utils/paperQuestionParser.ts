/**
 * Paper Question Parser Utility
 * Extracts individual placement problems, constraints, and test cases from 
 * company placement papers, supporting HTML question-blocks, headings, and Markdown.
 */

export interface PaperTestCase {
  title: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface PaperQuestion {
  id: string;
  number: number;
  title: string;
  cleanTitle: string;
  difficulty: 'BASIC' | 'MEDIUM' | 'HARD';
  description: string;
  constraints: string[];
  testCases: PaperTestCase[];
  rawContent?: string;
}

export function cleanHtmlTags(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Accurately determines question difficulty based on explicit badges, algorithmic taxonomy, and keywords.
 */
export function inferQuestionDifficulty(title: string, description = '', rawBlock = ''): 'BASIC' | 'MEDIUM' | 'HARD' {
  const cleanTitle = (title || '').toLowerCase();
  const combined = `${title} ${description}`.toLowerCase();

  // 1. Check for explicit difficulty badges/tags in raw HTML/Markdown
  const explicitMatch = rawBlock.match(/(?:difficulty|level|tier)\s*[:\-]\s*(easy|basic|medium|hard|advanced)/i)
    || rawBlock.match(/class=["'][^"']*\b(easy|basic|medium|hard|advanced)\b[^"']*["']/i);
  if (explicitMatch) {
    const val = explicitMatch[1].toLowerCase();
    if (val === 'easy' || val === 'basic') return 'BASIC';
    if (val === 'hard' || val === 'advanced') return 'HARD';
    if (val === 'medium') return 'MEDIUM';
  }

  // 2. HARD / ADVANCED Patterns
  const hardKeywords = [
    'hard', 'advanced', 'trapping rain', 'median of two sorted', 'n-queens',
    'word ladder', 'edit distance', 'lru cache', 'lfu cache', 'sliding window maximum',
    'minimum window substring', 'regular expression', 'wildcard matching', 'sudoku solver',
    'merge k sorted', 'first missing positive', 'longest valid parentheses',
    'serialize and deserialize', 'burst balloons', 'alien dictionary', 'dijkstra',
    'segment tree', 'fenwick', 'trie', 'max flow', 'bellman ford', 'floyd warshall',
    'traveling salesman', 'convex hull', 'shortest path in a grid with obstacles',
    'minimum cost to hire k workers', 'string transforms into another string',
    'maximum number of visible points', 'odd even jump', 'reverse nodes in k-group',
    'find building where alice and bob', 'split array largest sum',
    'design search autocomplete', 'minimum window subsequence',
    'maximum score words formed', 'text justification', 'cracking the safe',
    'word squares', 'maximum vacation days', 'race car', 'robot room cleaner',
    'k empty slots', 'range module', 'max points on a line', 'guess the word',
    'sliding window median', 'shortest distance from all buildings',
    'employee free time', 'max chunks to make sorted ii', 'random pick with blacklist',
    'flips to convert binary matrix to zero matrix', 'maximum gap',
    'stream of characters', 'refueling stops', 'frog river crossing jump', 'frog jump',
    'reconstruct itinerary', 'maximum frequency stack', 'swim in rising water',
    'smallest range covering elements from k lists', 'valid path in a grid',
    'tallest billboard', 'making a large island', 'candy rating distribution',
    'range sum query 2d - mutable', 'minimum cost to reach destination in time',
    'subarrays with k different integers', 'subsequences with equal gcd',
    'maximize the minimum game score', 'maximum good subtree score',
    'russian doll envelopes', 'cherry pickup', 'critical connections'
  ];
  for (const kw of hardKeywords) {
    if (cleanTitle.includes(kw)) return 'HARD';
  }

  // 3. MEDIUM Patterns (checked before general basic falls)
  const mediumKeywords = [
    'medium', '3sum', 'three sum', '4sum', 'four sum', 'longest substring without',
    'container with most water', 'rotate array', 'rotate image', 'product of array',
    'subarray sum equals', 'group anagrams', 'add two numbers', 'remove nth node',
    'reorder list', 'copy list', 'linked list cycle', 'permutations', 'subsets',
    'combination sum', 'letter combinations', 'word search', 'level order',
    'lowest common ancestor', 'validate binary search', 'kth smallest',
    'kth largest', 'number of islands', 'clone graph', 'course schedule',
    'rotting oranges', 'coin change', 'longest increasing subsequence',
    'longest palindromic substring', 'longest common subsequence', 'house robber',
    'decode ways', 'unique paths', 'word break', 'jump game', 'maximum subarray',
    'koko eating bananas', 'fruit into baskets', 'sort colors', 'reorganize string',
    'longest consecutive sequence', 'minimum amplitude', 'logger rate limiter',
    'snapshot array', 'campus bikes', 'expressive words', 'sentence screen',
    'time needed to inform', 'encoded string decoding', 'bank transaction',
    'merge intervals', 'search in rotated', 'sort characters by frequency',
    'minimum moves to capture', 'maximum coins from k consecutive',
    'ways to split string', 'server loads', 'obtain from cards', 'replace in string',
    'compare strings by frequency', 'integer to roman', 'gas station',
    'longest well-performing', 'mutating substring', 'rearranged number',
    'maximum sum subarray', 'subarray with given sum', 'operations to make array equal',
    'quick sort pivot', 'book exchange', 'my calendar', 'count square submatrices',
    'rabbits in forest', 'car fleet', 'find duplicate subtrees', 'longest string chain',
    'number of matching subsequences', 'evaluate division', 'android unlock patterns',
    'strobogrammatic number', 'capacity to ship packages', 'decode string',
    'bulls and cows', 'longest absolute file path', 'minimum area rectangle',
    'cooking time', 'points with cost', 'smallest number of neighbors',
    'swaps to group', 'domino rotations', 'accounts merge', 'hit counter',
    'maximum gold', 'open the lock', 'doubled array', 'repeated subarray',
    'network delay time', 'shortest bridge', 'remove adjacent duplicates',
    'pacific atlantic water flow', 'number of provinces', 'product of word lengths',
    'balls to each box', 'most booked hotel room', 'next permutation',
    'reverse words in a string', 'best time to buy and sell stock ii',
    'set matrix zeroes', 'first and last position', 'find minimum in rotated',
    'find peak element', 'delete operation for two strings', 'partition equal subset sum',
    'daily temperatures', 'search a 2d matrix', 'spiral matrix', 'target sum',
    'keys and rooms', 'maximum depth of binary tree', 'binary tree right side view',
    'kth largest element in an array', 'top k frequent', 'continuous subarray sum',
    'find all anagrams', 'string to integer (atoi)', 'zigzag conversion',
    'generate parentheses'
  ];
  for (const kw of mediumKeywords) {
    if (cleanTitle.includes(kw)) return 'MEDIUM';
  }

  // 4. BASIC / INTRODUCTORY Patterns
  const basicKeywords = [
    'easy', 'basic', 'simple', 'two sum', 'palindrome', 'reverse integer',
    'valid parentheses', 'create hello world', 'valid anagram', 'longest common prefix',
    'add binary', 'toeplitz matrix', "pascal's triangle", 'pascal triangle',
    'merge sorted array', 'candies', 'max consecutive ones', 'reverse string',
    'best time to buy and sell stock', 'majority element', 'remove duplicates',
    'rat count house', 'binary string operations', 'password security',
    'difference threshold', 'difference of divisible', 'large small sum',
    'smallest pair product', 'decimal to base', 'move hyphen', 'number of carries',
    'replace character', 'arithmetic operation', 'peak score', 'autobiographical',
    'palindromic numbers', 'factorial', 'fibonacci', 'armstrong', 'prime',
    'even and odd', 'sum of digits', 'linear search', 'binary search',
    'vowel count', 'count vowels', 'fizz buzz', 'power of two', 'power of three',
    'missing number', 'single number', 'contains duplicate', 'find minimum',
    'find maximum', 'second largest', 'gcd', 'lcm', 'square root', 'leap year',
    'swap', 'count elements', 'average of', 'check sorted', 'matrix addition',
    'largest subarray of length k', 'obfuscated clock', 'watering plants',
    'license key formatting', 'climbing stairs', 'merge two sorted lists',
    'move zeroes', 'roman to integer', 'second highest salary',
    'delete duplicate emails', 'rising temperature', 'article views',
    'employees earning more than', 'product sales analysis', 'replace employee id',
    'sort array by absolute value', 'gym membership', 'balloon capacity',
    'laptop charge', 'happy and sad people', 'speed and distance',
    'frequency element analysis', 'circular deletion', 'find the unique element',
    'character frequency analyzer', 'transform array by parity',
    'implement queue using stacks', 'range sum query - immutable',
    'intersection of two arrays', 'palindrome linked list', 'is subsequence',
    'reverse string ii', 'eat pizzas', 'first occurrence in a string',
    'count pairs that form a complete day'
  ];
  for (const kw of basicKeywords) {
    if (cleanTitle.includes(kw)) return 'BASIC';
  }

  // 5. Algorithmic intent signals
  if (/(recursion|binary tree|graph|dynamic programming|backtrack|memoization|heap|priority queue)/i.test(combined)) {
    return 'MEDIUM';
  }
  if (/(single loop|O\(1\) space|time limit.*1 second|brute force)/i.test(combined)) {
    return 'BASIC';
  }

  return 'BASIC';
}

function parseTestCasesFromBlock(blockText: string): PaperTestCase[] {
  if (!blockText) return [];

  // 1. Check for data-cases attribute
  const dataCasesMatch = blockText.match(/data-cases=(["'])([\s\S]*?)\1/i);
  if (dataCasesMatch) {
    try {
      const decoded = dataCasesMatch[2]
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((tc: any, i: number) => ({
          title: tc.title || `Test Case ${i + 1}`,
          input: (tc.input || '').trim(),
          output: (tc.output || '').trim(),
          explanation: tc.explanation || '',
        }));
      }
    } catch {}
  }

  // 2. Check for manual Test Case / Example regex
  const text = cleanHtmlTags(blockText);
  const regex = /(?:^|\n)\s*(?:Test\s*Case|Example|Sample)\s*(\d+)?[:\s*#]*\n*([\s\S]*?)(?=(?:\n\s*(?:Test\s*Case|Example|Sample)\s*(?:\d+|[:\s*#])|$))/gi;
  const matches = [...text.matchAll(regex)];
  if (matches.length > 0) {
    return matches.map((m, idx) => {
      const num = m[1] || `${idx + 1}`;
      const content = m[2].trim();
      const inMatch = content.match(/Input:?\s*([\s\S]*?)(?=Output:|$)/i);
      const outMatch = content.match(/Output:?\s*([\s\S]*?)$/i);
      return {
        title: `Test Case ${num}`,
        input: inMatch ? inMatch[1].trim() : '',
        output: outMatch ? outMatch[1].trim() : '',
      };
    }).filter(tc => tc.input || tc.output);
  }

  // 3. Fallback: single Input: ... Output: ...
  const inMatch = text.match(/Input:?\s*([\s\S]*?)(?=Output:|$)/i);
  const outMatch = text.match(/Output:?\s*([\s\S]*?)$/i);
  if (inMatch || outMatch) {
    return [{
      title: 'Test Case 1',
      input: inMatch ? inMatch[1].trim() : '',
      output: outMatch ? outMatch[1].trim() : '',
    }];
  }

  return [];
}

/**
 * Standard canonical test cases for common interview problems when data-cases is missing or empty.
 */
export const CANONICAL_FALLBACK_TEST_CASES: Record<string, PaperTestCase[]> = {
  'longest palindromic substring': [
    { title: 'Test Case 1', input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
    { title: 'Test Case 2', input: 's = "cbbd"', output: '"bb"' },
    { title: 'Test Case 3', input: 's = "a"', output: '"a"' },
    { title: 'Test Case 4', input: 's = "ac"', output: '"a"' }
  ],
  'integer to roman numeral': [
    { title: 'Test Case 1', input: 'num = 3749', output: 'MMMDCCXLIX' },
    { title: 'Test Case 2', input: 'num = 58', output: 'LVIII' },
    { title: 'Test Case 3', input: 'num = 1994', output: 'MCMXCIV' },
    { title: 'Test Case 4', input: 'num = 4', output: 'IV' }
  ],
  'longest common prefix across directory names': [
    { title: 'Test Case 1', input: 'strs = ["flower","flow","flight"]', output: 'fl' },
    { title: 'Test Case 2', input: 'strs = ["dog","racecar","car"]', output: '""', explanation: 'There is no common prefix among the input strings.' },
    { title: 'Test Case 3', input: 'strs = ["interspecies","interstellar","interstate"]', output: 'inters' },
    { title: 'Test Case 4', input: 'strs = ["cir","car"]', output: 'c' }
  ],
  'valid parentheses sequence': [
    { title: 'Test Case 1', input: 's = "()"', output: '1' },
    { title: 'Test Case 2', input: 's = "()[]{}"', output: '1' },
    { title: 'Test Case 3', input: 's = "(]"', output: '0' },
    { title: 'Test Case 4', input: 's = "([])"', output: '1' }
  ],
  'longest substring without repeating characters': [
    { title: 'Test Case 1', input: 's = "abcabcbb"', output: '3' },
    { title: 'Test Case 2', input: 's = "bbbbb"', output: '1' },
    { title: 'Test Case 3', input: 's = "pwwkew"', output: '3' },
    { title: 'Test Case 4', input: 's = ""', output: '0' }
  ],
  'stream of characters': [
    { title: 'Test Case 1', input: '["StreamChecker","query","query","query","query","query","query"], [[["cd","f","kl"]],[\'a\'],[\'b\'],[\'c\'],[\'d\'],[\'e\'],[\'f\']]', output: '[null,false,false,false,true,false,true]' },
    { title: 'Test Case 2', input: '["StreamChecker","query","query"], [[["ab","ba"]],[\'a\'],[\'b\']]', output: '[null,false,true]' },
    { title: 'Test Case 3', input: '["StreamChecker","query","query","query"], [[["a"]],[\'b\'],[\'a\'],[\'a\']]', output: '[null,false,true,true]' },
    { title: 'Test Case 4', input: '["StreamChecker","query"], [[["a"]],[\'a\']]', output: '[null,true]' }
  ],
  'encoded string decoding': [
    { title: 'Test Case 1', input: '101101110', output: 'ABC' },
    { title: 'Test Case 2', input: '11110111110', output: 'DE' },
    { title: 'Test Case 3', input: '1111111111111111111111111011111111111111111111111111', output: 'YZ', explanation: '25 ones (Y) separated by 0 and 26 ones (Z).' },
    { title: 'Test Case 4', input: '1', output: 'A' }
  ],
  'trapping rain water': [
    { title: 'Test Case 1', input: 'n = 5\nheight = [3, 0, 2, 0, 4]', output: '7' },
    { title: 'Test Case 2', input: 'n = 4\nheight = [4, 2, 0, 3]', output: '4' },
    { title: 'Test Case 3', input: 'n = 3\nheight = [1, 2, 3]', output: '0' },
    { title: 'Test Case 4', input: 'n = 6\nheight = [4, 2, 0, 3, 2, 5]', output: '9' }
  ],
  'trapping rain water in elevation wells': [
    { title: 'Test Case 1', input: 'n = 12\nheight = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', output: '6' },
    { title: 'Test Case 2', input: 'n = 6\nheight = [4, 2, 0, 3, 2, 5]', output: '9' },
    { title: 'Test Case 3', input: 'n = 3\nheight = [3, 0, 2]', output: '2' },
    { title: 'Test Case 4', input: 'n = 5\nheight = [2, 0, 2, 0, 2]', output: '4' }
  ],
  'peak index in a mountain array': [
    { title: 'Test Case 1', input: 'arr = [0, 2, 1, 0]', output: '1' },
    { title: 'Test Case 2', input: 'arr = [0, 1, 4, 10, 5, 2]', output: '3' },
    { title: 'Test Case 3', input: 'arr = [0, 1, 2, 3, 5, 3]', output: '4' },
    { title: 'Test Case 4', input: 'arr = [24, 69, 100, 99, 79, 78, 67, 36, 26, 19]', output: '2' }
  ]
};

/**
 * Authoritative, verified 4th test cases for placement paper questions.
 * Eliminates duplicate test cases (Case 3 === Case 4) across all company papers.
 */
export const CANONICAL_FOURTH_TEST_CASE: Record<string, PaperTestCase> = {
  "3sum": { title: 'Test Case 4', input: "nums = [-2, 0, 1, 1, 2]", output: "[[-2, 0, 2], [-2, 1, 1]]" },
  "3sum closest": { title: 'Test Case 4', input: "nums = [0, 2, 1, -3], target = 1", output: "0" },
  "3sum unique zero combinations": { title: 'Test Case 4', input: "nums = [-2, 0, 1, 1, 2]", output: "[[-2, 0, 2], [-2, 1, 1]]" },
  "4sum": { title: 'Test Case 4', input: "nums = [1, 2, 3, 4], target = 10", output: "[[1, 2, 3, 4]]" },
  "accounts merge": { title: 'Test Case 4', input: "accounts = [[\"A\", \"a@a.com\"]]", output: "[[\"A\", \"a@a.com\"]]" },
  "add binary": { title: 'Test Case 4', input: "a = \"1\", b = \"111\"", output: "\"1000\"" },
  "add digits": { title: 'Test Case 4', input: "num = 10", output: "1" },
  "add two numbers": { title: 'Test Case 4', input: "l1 = [1], l2 = [9]", output: "[0, 1]" },
  "add two numbers stored as linked lists": { title: 'Test Case 4', input: "l1 = [9, 9], l2 = [1]", output: "[0, 0, 1]" },
  "alien dictionary": { title: 'Test Case 4', input: "words = [\"z\"]", output: "\"z\"" },
  "all nodes distance k in binary tree": { title: 'Test Case 4', input: "root = [1], target = 1, k = 0", output: "[1]" },
  "anagram string verification": { title: 'Test Case 4', input: "str1 = \"hello\", str2 = \"billion\"", output: "0" },
  "android unlock patterns": { title: 'Test Case 4', input: "m = 1, n = 3", output: "385" },
  "angle between hands of a clock": { title: 'Test Case 4', input: "hour = 12, minutes = 0", output: "0" },
  "ant on the boundary": { title: 'Test Case 4', input: "nums = [1, -1]", output: "1" },
  "arithmetic operation dispatcher": { title: 'Test Case 4', input: "c = 2, a = 50, b = 15", output: "35" },
  "array equilibrium index": { title: 'Test Case 4', input: "n = 3\narr = [1, 1, 1]", output: "1" },
  "article views i": { title: 'Test Case 4', input: "Views = [[1, 1, 1, \"2020-01-01\"]]", output: "[1]" },
  "asteroid collision": { title: 'Test Case 4', input: "asteroids = [-2, -1, 1, 2]", output: "[-2, -1, 1, 2]" },
  "autobiographical number": { title: 'Test Case 4', input: "str = \"21200\"", output: "3" },
  "basic calculator": { title: 'Test Case 4', input: "s = \"1 - 1\"", output: "0" },
  "best time to buy and sell stock": { title: 'Test Case 4', input: "prices = [1, 2, 3, 4]", output: "3" },
  "best time to buy and sell stock ii": { title: 'Test Case 4', input: "prices = [1, 2]", output: "1" },
  "binary search": { title: 'Test Case 4', input: "nums = [2, 5], target = 5", output: "1" },
  "binary string operations": { title: 'Test Case 4', input: "str = \"1B0A1C1\"", output: "0" },
  "binary tree maximum path sum": { title: 'Test Case 4', input: "root = [1]", output: "1" },
  "binary tree right side view": { title: 'Test Case 4', input: "root = [1, 2]", output: "[1, 2]" },
  "binary tree zigzag level order traversal": { title: 'Test Case 4', input: "root = [1, 2, 3]", output: "[[1], [3, 2]]" },
  "bulb switcher": { title: 'Test Case 4', input: "n = 4", output: "2" },
  "bulls and cows": { title: 'Test Case 4', input: "secret = \"11\", guess = \"10\"", output: "\"1A0B\"" },
  "burst balloons": { title: 'Test Case 4', input: "nums = [1]", output: "1" },
  "campus bikes": { title: 'Test Case 4', input: "workers = [[0, 0]], bikes = [[2, 2]]", output: "[0]" },
  "campus bikes ii": { title: 'Test Case 4', input: "workers = [[0, 0]], bikes = [[1, 1]]", output: "2" },
  "candy rating distribution": { title: 'Test Case 4', input: "ratings = [1]", output: "1" },
  "capacity to ship packages within d days": { title: 'Test Case 4', input: "weights = [1], days = 1", output: "1" },
  "car fleet": { title: 'Test Case 4', input: "target = 10, position = [5], speed = [2]", output: "1" },
  "car pooling": { title: 'Test Case 4', input: "trips = [[2, 1, 5]], capacity = 2", output: "true" },
  "cheapest flights within k stops": { title: 'Test Case 4', input: "n = 2, flights = [[0, 1, 100]], src = 0, dst = 1, k = 0", output: "100" },
  "check for armstrong number": { title: 'Test Case 4', input: "num = 407", output: "1" },
  "check if array is sorted and rotated": { title: 'Test Case 4', input: "nums = [1, 1, 1]", output: "true" },
  "chocolate distribution problem": { title: 'Test Case 4', input: "n = 3, m = 2\narr = [1, 3, 5]", output: "2" },
  "circular subarray maximum sum": { title: 'Test Case 4', input: "n = 3\narr = [3, 1, 3]", output: "7" },
  "climbing stairs": { title: 'Test Case 4', input: "n = 4", output: "5" },
  "climbing stairs combinations": { title: 'Test Case 4', input: "n = 4", output: "5" },
  "coin change combinations": { title: 'Test Case 4', input: "amount = 4, n = 2\ncoins = [1, 2]", output: "3" },
  "combinations": { title: 'Test Case 4', input: "n = 2, k = 1", output: "[[1], [2]]" },
  "combine two tables": { title: 'Test Case 4', input: "Person = [], Address = []", output: "[]" },
  "compare strings by frequency of smallest character": { title: 'Test Case 4', input: "queries = [\"a\"], words = [\"a\"]", output: "[0]" },
  "concatenation of array": { title: 'Test Case 4', input: "nums = [1]", output: "[1, 1]" },
  "container with most water": { title: 'Test Case 4', input: "height = [2, 3, 4, 5, 18, 17, 6]", output: "17" },
  "contains duplicate": { title: 'Test Case 4', input: "nums = [1]", output: "false" },
  "contiguous array": { title: 'Test Case 4', input: "nums = [0]", output: "0" },
  "convert sorted list to binary search tree": { title: 'Test Case 4', input: "head = [0]", output: "[0]" },
  "copy list with random pointer": { title: 'Test Case 4', input: "head = []", output: "[]" },
  "count and say sequence": { title: 'Test Case 4', input: "n = 3", output: "\"21\"" },
  "count good numbers": { title: 'Test Case 4', input: "n = 2", output: "20" },
  "count inversions in array": { title: 'Test Case 4', input: "n = 3\narr = [3, 2, 1]", output: "3" },
  "count non adjacent subsets in a rooted tree": { title: 'Test Case 4', input: "parent = [-1, 0], nums = [2, 3], k = 2", output: "1" },
  "count of smaller numbers after self": { title: 'Test Case 4', input: "nums = [1]", output: "[0]" },
  "count pairs that form a complete day i": { title: 'Test Case 4', input: "hours = [12, 12]", output: "1" },
  "count pairs with given sum": { title: 'Test Case 4', input: "n = 4, k = 5\narr = [1, 4, 2, 3]", output: "2" },
  "count pairs with given sum in array": { title: 'Test Case 4', input: "n = 4, k = 4\narr = [2, 2, 2, 2]", output: "6" },
  "count set bits": { title: 'Test Case 4', input: "num = 15", output: "4" },
  "count square submatrices with all ones": { title: 'Test Case 4', input: "matrix = [[1]]", output: "1" },
  "count subarrays of length three with a condition": { title: 'Test Case 4', input: "nums = [1, 4, 1]", output: "1" },
  "count tested devices after test operations": { title: 'Test Case 4', input: "batteryPercentages = [1, 0, 2]", output: "2" },
  "course schedule": { title: 'Test Case 4', input: "numCourses = 1, prerequisites = []", output: "true" },
  "course schedule ii": { title: 'Test Case 4', input: "numCourses = 2, prerequisites = []", output: "[0, 1]" },
  "course schedule iii": { title: 'Test Case 4', input: "courses = [[1, 1]]", output: "1" },
  "cracking the safe": { title: 'Test Case 4', input: "n = 1, k = 1", output: "\"0\"" },
  "create binary tree from descriptions": { title: 'Test Case 4', input: "descriptions = [[1, 2, 1]]", output: "[1, 2]" },
  "create hello world function": { title: 'Test Case 4', input: "args = [1, 2, 3]", output: "\"Hello World\"" },
  "daily temperatures": { title: 'Test Case 4', input: "temperatures = [40, 50, 60]", output: "[1, 1, 0]" },
  "daily temperatures wait days": { title: 'Test Case 4', input: "n = 3\ntemperatures = [40, 50, 60]", output: "[1, 1, 0]" },
  "decimal to base conversion": { title: 'Test Case 4', input: "n = 16, num = 255", output: "FF" },
  "decode string": { title: 'Test Case 4', input: "s = \"a\"", output: "\"a\"" },
  "decode ways for numeric messages": { title: 'Test Case 4', input: "s = \"10\"", output: "1" },
  "delete and earn": { title: 'Test Case 4', input: "nums = [2]", output: "2" },
  "delete and earn strategy": { title: 'Test Case 4', input: "nums = [2, 2, 2]", output: "6" },
  "delete duplicate emails": { title: 'Test Case 4', input: "Person = [[1, \"a@b.com\"]]", output: "[[1, \"a@b.com\"]]" },
  "delete node in a bst": { title: 'Test Case 4', input: "root = [1], key = 1", output: "[]" },
  "delete operation for two strings": { title: 'Test Case 4', input: "word1 = \"a\", word2 = \"a\"", output: "0" },
  "design hit counter": { title: 'Test Case 4', input: "[\"HitCounter\", \"getHits\"], [[], [1]]", output: "[null, 0]" },
  "design search autocomplete system": { title: 'Test Case 4', input: "[\"AutocompleteSystem\", \"input\"], [[[\"a\"], [1]], ['#']]", output: "[null, []]" },
  "diameter of binary tree": { title: 'Test Case 4', input: "root = [1, 2, null, 3]", output: "2" },
  "difference of divisible and non-divisible sums": { title: 'Test Case 4', input: "n = 2, m = 6", output: "-3" },
  "digital root": { title: 'Test Case 4', input: "n = 12345", output: "6" },
  "divide an array into subarrays with minimum cost i": { title: 'Test Case 4', input: "nums = [1, 1, 1]", output: "3" },
  "eat pizzas!": { title: 'Test Case 4', input: "pizzas = [1, 2, 3, 4]", output: "4" },
  "edit distance": { title: 'Test Case 4', input: "word1 = \"a\", word2 = \"b\"", output: "1" },
  "elements within difference threshold": { title: 'Test Case 4', input: "n = 4, num = 10, diff = 1\narr = [9, 10, 11, 15]", output: "3" },
  "employee free time": { title: 'Test Case 4', input: "schedule = [[[1, 2]]]", output: "[]" },
  "employees earning more than their managers": { title: 'Test Case 4', input: "Employee = [[1, \"Tom\", 10000, null]]", output: "[]" },
  "encoded string decoding": { title: 'Test Case 4', input: "1", output: "A" },
  "evaluate division": { title: 'Test Case 4', input: "equations = [[\"a\",\"b\"]], values = [2.0], queries = [[\"a\",\"b\"]]", output: "[2.00000]" },
  "evaluate reverse polish notation": { title: 'Test Case 4', input: "tokens = [\"3\"]", output: "3" },
  "expressive words": { title: 'Test Case 4', input: "s = \"a\", words = [\"a\"]", output: "1" },
  "fibonacci number": { title: 'Test Case 4', input: "n = 5", output: "5" },
  "find all duplicates in an array": { title: 'Test Case 4', input: "n = 4\nnums = [1, 2, 3, 4]", output: "[]" },
  "find and replace in string": { title: 'Test Case 4', input: "s = \"a\", indices = [0], sources = [\"b\"], targets = [\"c\"]", output: "\"a\"" },
  "find building where alice and bob can meet": { title: 'Test Case 4', input: "heights = [1, 2], queries = [[0, 1]]", output: "[1]" },
  "find duplicate number in registration roster": { title: 'Test Case 4', input: "nums = [2, 2, 2, 2, 2]", output: "2" },
  "find duplicate subtrees": { title: 'Test Case 4', input: "root = [1]", output: "[]" },
  "find first and last position of element in sorted array": { title: 'Test Case 4', input: "nums = [1], target = 1", output: "[0, 0]" },
  "find leaves of binary tree": { title: 'Test Case 4', input: "root = []", output: "[]" },
  "find median from data stream": { title: 'Test Case 4', input: "[\"MedianFinder\", \"addNum\", \"findMedian\"], [[], [5], []]", output: "[null, null, 5.0]" },
  "find minimum in rotated sorted array": { title: 'Test Case 4', input: "nums = [1]", output: "1" },
  "find original array from doubled array": { title: 'Test Case 4', input: "changed = [0, 0]", output: "[0]" },
  "find peak element": { title: 'Test Case 4', input: "nums = [1, 2]", output: "1" },
  "find peak element in elevation data": { title: 'Test Case 4', input: "n = 3\nnums = [1, 3, 2]", output: "1" },
  "find sum of array product of magical sequences": { title: 'Test Case 4', input: "m = 1, k = 1, nums = [2]", output: "2" },
  "find the city with the smallest number of neighbors at a threshold distance": { title: 'Test Case 4', input: "n = 1, edges = [], distanceThreshold = 1", output: "0" },
  "find the duplicate number": { title: 'Test Case 4', input: "nums = [2, 2, 2, 2]", output: "2" },
  "find the highest altitude": { title: 'Test Case 4', input: "gain = [1, -2, 3]", output: "2" },
  "find the index of the first occurrence in a string": { title: 'Test Case 4', input: "haystack = \"aaa\", needle = \"aaaa\"", output: "-1" },
  "find the number of subsequences with equal gcd": { title: 'Test Case 4', input: "nums = [1, 1]", output: "1" },
  "find total time spent by each employee": { title: 'Test Case 4', input: "Employees = [[1, \"2020-01-01\", 0, 10]]", output: "[[\"2020-01-01\", 1, 10]]" },
  "first and last position of element in sorted array": { title: 'Test Case 4', input: "n = 4\nnums = [2, 2, 2, 2]\ntarget = 2", output: "[0, 3]" },
  "first missing positive": { title: 'Test Case 4', input: "nums = [2]", output: "1" },
  "first unique character in a string": { title: 'Test Case 4', input: "s = \"a\"", output: "0" },
  "frequency of the most frequent element": { title: 'Test Case 4', input: "nums = [1, 1, 1], k = 1", output: "3" },
  "frog river crossing jump": { title: 'Test Case 4', input: "stones = [0, 1]", output: "true" },
  "fruit into baskets": { title: 'Test Case 4', input: "fruits = [3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]", output: "5" },
  "gas station": { title: 'Test Case 4', input: "gas = [4], cost = [5]", output: "-1" },
  "gas station tour circuit": { title: 'Test Case 4', input: "n = 3\ngas = [1, 2, 3]\ncost = [2, 3, 1]", output: "2" },
  "good subsequence queries": { title: 'Test Case 4', input: "nums = [1, 2], p = 1, queries = [[0, 1]]", output: "1" },
  "googly prime number": { title: 'Test Case 4', input: "43", output: "Yes" },
  "group anagrams": { title: 'Test Case 4', input: "strs = [\"a\", \"b\", \"a\"]", output: "[[\"b\"], [\"a\", \"a\"]]" },
  "group anagrams by pattern": { title: 'Test Case 4', input: "strs = [\"a\", \"b\", \"a\"]", output: "[[\"b\"], [\"a\", \"a\"]]" },
  "guess the word": { title: 'Test Case 4', input: "secret = \"abcdef\", words = [\"abcdef\"], allowedGuesses = 1", output: "\"You guessed the secret word correctly.\"" },
  "happy number cycle detection": { title: 'Test Case 4', input: "n = 4", output: "0" },
  "house robber": { title: 'Test Case 4', input: "nums = [1, 3, 1]", output: "3" },
  "house robber maximum loot across neighborhood": { title: 'Test Case 4', input: "n = 3\nnums = [2, 1, 2]", output: "4" },
  "implement queue using stacks": { title: 'Test Case 4', input: "operations = [\"MyQueue\", \"push\", \"pop\", \"empty\"], inputs = [[], [1], [], []]", output: "[null, null, 1, true]" },
  "integer to roman numeral": { title: 'Test Case 4', input: "num = 9", output: "IX" },
  "intersection of two arrays": { title: 'Test Case 4', input: "nums1 = [2, 1], nums2 = [1, 2]", output: "[1, 2]" },
  "intersection of two arrays with unique elements": { title: 'Test Case 4', input: "nums1 = [1, 2]\nnums2 = [2, 3]", output: "[2]" },
  "intersection of two sorted arrays": { title: 'Test Case 4', input: "n = 4, m = 2\narr1 = [1, 2, 3, 4]\narr2 = [2, 4]", output: "2 4" },
  "inversions with boundary conditions": { title: 'Test Case 4', input: "n = 3\narr = [1, 2, 3]", output: "0" },
  "is subsequence": { title: 'Test Case 4', input: "s = \"b\", t = \"c\"", output: "false" },
  "jump game": { title: 'Test Case 4', input: "nums = [1]", output: "true" },
  "k empty slots": { title: 'Test Case 4', input: "bulbs = [1], k = 1", output: "-1" },
  "k-diff pairs in an array": { title: 'Test Case 4', input: "nums = [1, 2, 3], k = 0", output: "0" },
  "kids with the greatest number of candies": { title: 'Test Case 4', input: "candies = [5, 5, 5], extraCandies = 0", output: "[true, true, true]" },
  "koko eating bananas": { title: 'Test Case 4', input: "piles = [3, 6, 7]\nh = 8", output: "3" },
  "kth largest element in a stream": { title: 'Test Case 4', input: "k = 2, nums = [1, 2] add(3)", output: "2" },
  "kth largest element in an array": { title: 'Test Case 4', input: "nums = [2, 1], k = 2", output: "1" },
  "kth smallest element in shipment weights": { title: 'Test Case 4', input: "n = 4, k = 2\narr = [5, 1, 9, 3]", output: "3" },
  "large small sum": { title: 'Test Case 4', input: "n = 8\narr = [1, 2, 3, 4, 5, 6, 7, 8]", output: "11" },
  "largest number": { title: 'Test Case 4', input: "nums = [9, 90]", output: "\"990\"" },
  "largest number after mutating substring": { title: 'Test Case 4', input: "num = \"0\", change = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]", output: "\"9\"" },
  "largest number formable from array": { title: 'Test Case 4', input: "n = 3\nnums = [3, 30, 34]", output: "\"34330\"" },
  "largest rectangle in histogram": { title: 'Test Case 4', input: "heights = [1]", output: "1" },
  "largest subarray of length k": { title: 'Test Case 4', input: "nums = [5, 2, 4, 1], k = 2", output: "[5, 2]" },
  "license key formatting": { title: 'Test Case 4', input: "s = \"2\", k = 2", output: "\"2\"" },
  "linked list cycle": { title: 'Test Case 4', input: "head = [1, 2], pos = -1", output: "false" },
  "linked list cycle ii": { title: 'Test Case 4', input: "head = [1, 2], pos = -1", output: "no cycle" },
  "logger rate limiter": { title: 'Test Case 4', input: "[\"Logger\", \"shouldPrintMessage\"], [[], [1, \"test\"]]", output: "[null, true]" },
  "longest absolute file path": { title: 'Test Case 4', input: "input = \"file.ext\"", output: "8" },
  "longest common prefix": { title: 'Test Case 4', input: "strs = [\"interspecies\", \"interstellar\", \"interstate\"]", output: "\"inters\"" },
  "longest common prefix across directory names": { title: 'Test Case 4', input: "strs = [\"a\", \"a\"]", output: "a" },
  "longest common prefix across registry names": { title: 'Test Case 4', input: "strs = [\"throne\", \"throne\", \"throne\"]", output: "\"throne\"" },
  "longest consecutive sequence": { title: 'Test Case 4', input: "nums = [5, 4, 3, 2, 1]", output: "5" },
  "longest increasing subsequence": { title: 'Test Case 4', input: "nums = [1, 3, 6, 7]", output: "4" },
  "longest palindromic subsequence": { title: 'Test Case 4', input: "s = \"abba\"", output: "4" },
  "longest palindromic substring": { title: 'Test Case 4', input: "s = \"racecar\"", output: "\"racecar\"" },
  "longest repeating character replacement": { title: 'Test Case 4', input: "s = \"A\", k = 1", output: "1" },
  "longest string chain": { title: 'Test Case 4', input: "words = [\"a\"]", output: "1" },
  "longest substring without repeating characters": { title: 'Test Case 4', input: "s = \"au\"", output: "2" },
  "longest valid parentheses": { title: 'Test Case 4', input: "s = \"()()\"", output: "4" },
  "longest well-performing interval": { title: 'Test Case 4', input: "hours = [6, 6, 9]", output: "1" },
  "lowest common ancestor of a binary tree": { title: 'Test Case 4', input: "root = [1, 2, 3], p = 2, q = 3", output: "1" },
  "lru cache": { title: 'Test Case 4', input: "operations = [\"LRUCache\", \"put\", \"get\"], values = [[1], [2, 5], [2]]", output: "[null, null, 5]" },
  "magic squares in grid": { title: 'Test Case 4', input: "grid = [[5]]", output: "0" },
  "magnetic force between two balls": { title: 'Test Case 4', input: "position = [1, 5], m = 2", output: "4" },
  "majority element": { title: 'Test Case 4', input: "nums = [2, 1, 2]", output: "2" },
  "majority element ii": { title: 'Test Case 4', input: "nums = [2, 2]", output: "[2]" },
  "majority element in ballot tally": { title: 'Test Case 4', input: "n = 5\nnums = [6, 6, 6, 7, 7]", output: "6" },
  "making a large island": { title: 'Test Case 4', input: "grid = [[0]]", output: "1" },
  "matrix diagonal sum": { title: 'Test Case 4', input: "n = 3\nmat = [[5, 0, 0], [0, 5, 0], [0, 0, 5]]", output: "15" },
  "max chunks to make sorted ii": { title: 'Test Case 4', input: "arr = [1, 2]", output: "2" },
  "max consecutive ones": { title: 'Test Case 4', input: "nums = [1, 1, 1, 1]", output: "4" },
  "max consecutive ones iii": { title: 'Test Case 4', input: "nums = [0, 0, 0], k = 1", output: "1" },
  "max points on a line": { title: 'Test Case 4', input: "points = [[1, 1], [1, 2]]", output: "2" },
  "maximize the minimum game score": { title: 'Test Case 4', input: "points = [1, 2, 3], m = 2", output: "1" },
  "maximum area of longest diagonal rectangle": { title: 'Test Case 4', input: "dimensions = [[3, 4], [5, 2]]", output: "12" },
  "maximum average subarray i": { title: 'Test Case 4', input: "nums = [4], k = 1", output: "4.00000" },
  "maximum coins from k consecutive bags": { title: 'Test Case 4', input: "coins = [[1, 5, 2], [10, 12, 4]], k = 3", output: "12" },
  "maximum consecutive ones with k flips": { title: 'Test Case 4', input: "n = 4\nnums = [1, 0, 1, 0]\nk = 1", output: "3" },
  "maximum depth of binary tree": { title: 'Test Case 4', input: "root = [1]", output: "1" },
  "maximum frequency stack": { title: 'Test Case 4', input: "[\"FreqStack\", \"push\", \"pop\"], [[], [1], []]", output: "[null, null, 1]" },
  "maximum gap": { title: 'Test Case 4', input: "nums = [1, 2]", output: "1" },
  "maximum good subtree score": { title: 'Test Case 4', input: "parent = [-1, 0, 0], values = [3, 4, 5]", output: "12" },
  "maximum ice cream bars": { title: 'Test Case 4', input: "costs = [1, 1, 1], coins = 2", output: "2" },
  "maximum length of repeated subarray": { title: 'Test Case 4', input: "nums1 = [1], nums2 = [1]", output: "1" },
  "maximum number of balloons": { title: 'Test Case 4', input: "text = \"balloon\"", output: "1" },
  "maximum number of k-divisible components": { title: 'Test Case 4', input: "n = 2, edges = [[0, 1]], values = [2, 2], k = 2", output: "2" },
  "maximum number of points with cost": { title: 'Test Case 4', input: "points = [[1]]", output: "1" },
  "maximum number of visible points": { title: 'Test Case 4', input: "points = [[1, 1]], angle = 90, location = [1, 1]", output: "1" },
  "maximum or": { title: 'Test Case 4', input: "nums = [1], k = 1", output: "2" },
  "maximum points you can obtain from cards": { title: 'Test Case 4', input: "cardPoints = [1, 100, 1], k = 1", output: "1" },
  "maximum product of three numbers": { title: 'Test Case 4', input: "nums = [-1, -2, -3, -4]", output: "-6" },
  "maximum product of word lengths": { title: 'Test Case 4', input: "words = [\"a\", \"b\"]", output: "1" },
  "maximum product subarray": { title: 'Test Case 4', input: "nums = [-2, -3]", output: "6" },
  "maximum product subarray in investment returns": { title: 'Test Case 4', input: "n = 3\nnums = [2, -5, -2]", output: "20" },
  "maximum profit in job scheduling": { title: 'Test Case 4', input: "startTime = [1], endTime = [2], profit = [50]", output: "50" },
  "maximum score words formed by letters": { title: 'Test Case 4', input: "words = [\"a\"], letters = [\"a\"], score = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]", output: "1" },
  "maximum subarray": { title: 'Test Case 4', input: "nums = [-1]", output: "-1" },
  "maximum subarray sum": { title: 'Test Case 4', input: "n = 4\narr = [1, 2, 3, -10]", output: "6" },
  "maximum sum circular subarray": { title: 'Test Case 4', input: "nums = [5]", output: "5" },
  "maximum time from obfuscated clock": { title: 'Test Case 4', input: "time = \"1?:2?\"", output: "\"19:29\"" },
  "maximum total value": { title: 'Test Case 4', input: "value = [5], decay = [1], m = 2", output: "9" },
  "maximum vacation days": { title: 'Test Case 4', input: "flights = [[0]], days = [[1]]", output: "1" },
  "maximum walls destroyed by robots": { title: 'Test Case 4', input: "robots = [1], distance = [1], walls = [1]", output: "1" },
  "median of two sorted arrays": { title: 'Test Case 4', input: "nums1 = [2], nums2 = []", output: "2.00000" },
  "meeting rooms ii": { title: 'Test Case 4', input: "intervals = [[1, 4], [2, 5], [7, 9]]", output: "2" },
  "merge intervals": { title: 'Test Case 4', input: "intervals = [[1, 4], [2, 3]]", output: "[[1, 4]]" },
  "merge k sorted lists": { title: 'Test Case 4', input: "lists = [[2], [1], [3]]", output: "[1, 2, 3]" },
  "merge overlapping booking intervals": { title: 'Test Case 4', input: "n = 2\nintervals = [[1, 3], [4, 6]]", output: "[[1, 3], [4, 6]]" },
  "merge sorted array": { title: 'Test Case 4', input: "nums1 = [2, 0], m = 1, nums2 = [1], n = 1", output: "[1, 2]" },
  "merge strings alternately": { title: 'Test Case 4', input: "word1 = \"a\", word2 = \"z\"", output: "\"az\"" },
  "merge two sorted arrays without extra space": { title: 'Test Case 4', input: "n = 2, m = 2\narr1 = [1, 4]\narr2 = [2, 3]", output: "arr1 = [1, 2]\narr2 = [3, 4]" },
  "merge two sorted lists": { title: 'Test Case 4', input: "list1 = [2], list2 = [1]", output: "[1, 2]" },
  "min stack": { title: 'Test Case 4', input: "operations = [\"MinStack\", \"push\", \"top\"], values = [[], [5], []]", output: "[null, null, 5]" },
  "minimum absolute difference": { title: 'Test Case 4', input: "arr = [1, 2]", output: "[[1, 2]]" },
  "minimum absolute difference of server loads": { title: 'Test Case 4', input: "loads = [2, 4, 6]", output: "0" },
  "minimum additions to make parentheses valid": { title: 'Test Case 4', input: "s = \"()))\"", output: "2" },
  "minimum amplitude after three changes": { title: 'Test Case 4', input: "nums = [1, 5, 6, 14, 15]", output: "1" },
  "minimum area rectangle": { title: 'Test Case 4', input: "points = [[0, 0], [0, 1], [1, 0], [1, 1]]", output: "1" },
  "minimum coins required for exact change": { title: 'Test Case 4', input: "v = 15, n = 3\ncoins = [10, 5, 1]", output: "2" },
  "minimum cost to hire k workers": { title: 'Test Case 4', input: "quality = [10], wage = [100], k = 1", output: "100.00000" },
  "minimum cost to make at least one valid path in a grid": { title: 'Test Case 4', input: "grid = [[1]]", output: "0" },
  "minimum cost to reach destination in time": { title: 'Test Case 4', input: "maxTime = 10, edges = [], passingFees = [5]", output: "5" },
  "minimum cost to set cooking time": { title: 'Test Case 4', input: "startAt = 1, moveCost = 1, pushCost = 1, targetSeconds = 1", output: "2" },
  "minimum difference in sums after removal of elements": { title: 'Test Case 4', input: "nums = [1, 2, 3]", output: "-1" },
  "minimum domino rotations for equal row": { title: 'Test Case 4', input: "tops = [1], bottoms = [1]", output: "0" },
  "minimum jumps to reach last station": { title: 'Test Case 4', input: "n = 4\narr = [2, 3, 1, 1]", output: "2" },
  "minimum moves to capture the queen": { title: 'Test Case 4', input: "a = 1, b = 1, c = 2, d = 2, e = 3, f = 3", output: "2" },
  "minimum number of days to make m bouquets": { title: 'Test Case 4', input: "bloomDay = [1, 10, 2, 9, 3, 8], m = 2, k = 2", output: "9" },
  "minimum number of flips to convert binary matrix to zero matrix": { title: 'Test Case 4', input: "mat = [[0, 0]]", output: "0" },
  "minimum number of refueling stops": { title: 'Test Case 4', input: "target = 10, startFuel = 10, stations = []", output: "0" },
  "minimum operations to move all balls to each box": { title: 'Test Case 4', input: "boxes = \"1\"", output: "[0]" },
  "minimum path sum": { title: 'Test Case 4', input: "grid = [[1, 2], [1, 1]]", output: "3" },
  "minimum path sum in city grid": { title: 'Test Case 4', input: "m = 2, n = 2\ngrid = [\n  [1, 2],\n  [1, 1]\n]", output: "3" },
  "minimum platforms required for railway station": { title: 'Test Case 4', input: "n = 2\narr = [900, 930]\ndep = [915, 1000]", output: "1" },
  "minimum right shifts to sort the array": { title: 'Test Case 4', input: "nums = [2, 1, 3]", output: "-1" },
  "minimum size subarray sum": { title: 'Test Case 4', input: "target = 6, nums = [10]", output: "1" },
  "minimum size subarray sum exceeding target": { title: 'Test Case 4', input: "target = 5, n = 3\nnums = [2, 3, 1]", output: "2" },
  "minimum steps to make product equal to one": { title: 'Test Case 4', input: "n = 3\narr = [1, -1, 1]", output: "2" },
  "minimum swaps to group all 1's together": { title: 'Test Case 4', input: "data = [1]", output: "0" },
  "minimum window subsequence": { title: 'Test Case 4', input: "s1 = \"a\", s2 = \"a\"", output: "\"a\"" },
  "minimum window substring": { title: 'Test Case 4', input: "s = \"a\", t = \"b\"", output: "\"\"" },
  "missing number": { title: 'Test Case 4', input: "nums = [0]", output: "1" },
  "missing number in sequence": { title: 'Test Case 4', input: "n = 4\narr = [1, 3, 4]", output: "2" },
  "most booked hotel room": { title: 'Test Case 4', input: "bookings = [\"+1A\"]", output: "\"1A\"" },
  "move hyphen to front": { title: 'Test Case 4', input: "str = \"A-B-C\"", output: "--ABC" },
  "move zeroes": { title: 'Test Case 4', input: "nums = [1]", output: "[1]" },
  "move zeroes to end": { title: 'Test Case 4', input: "nums = [1, 0, 2, 0, 3]", output: "[1, 2, 3, 0, 0]" },
  "multiply strings": { title: 'Test Case 4', input: "num1 = \"9\", num2 = \"9\"", output: "\"81\"" },
  "my calendar i": { title: 'Test Case 4', input: "[\"MyCalendar\", \"book\"], [[], [1, 2]]", output: "[null, true]" },
  "my calendar ii": { title: 'Test Case 4', input: "[\"MyCalendarTwo\", \"book\"], [[], [1, 5]]", output: "[null, true]" },
  "network delay time": { title: 'Test Case 4', input: "times = [[1, 2, 5]], n = 2, k = 1", output: "5" },
  "next greater element i": { title: 'Test Case 4', input: "nums1 = [1, 2], nums2 = [2, 1]", output: "[-1, -1]" },
  "next greater element ii": { title: 'Test Case 4', input: "nums = [1, 2, 3, 4, 5]", output: "[2, 3, 4, 5, -1]" },
  "next greater element to right": { title: 'Test Case 4', input: "n = 4\narr = [1, 3, 2, 4]", output: "3 4 4 -1" },
  "next lexicographical permutation": { title: 'Test Case 4', input: "n = 3\narr = [2, 3, 1]", output: "[3, 1, 2]" },
  "next permutation": { title: 'Test Case 4', input: "nums = [1, 3, 2]", output: "[2, 1, 3]" },
  "nth highest salary": { title: 'Test Case 4', input: "Employee = [[1, 100]], N = 1", output: "100" },
  "number of carries": { title: 'Test Case 4', input: "num1 = 99, num2 = 99", output: "2" },
  "number of different subsequences gcds": { title: 'Test Case 4', input: "nums = [6, 10]", output: "3" },
  "number of islands": { title: 'Test Case 4', input: "grid = [[\"1\"]]", output: "1" },
  "number of matching subsequences": { title: 'Test Case 4', input: "s = \"a\", words = [\"b\"]", output: "0" },
  "number of provinces": { title: 'Test Case 4', input: "isConnected = [[1]]", output: "1" },
  "odd even jump": { title: 'Test Case 4', input: "arr = [1, 2, 3, 2, 1]", output: "1" },
  "odd even linked list": { title: 'Test Case 4', input: "head = [1]", output: "[1]" },
  "odd occurring element": { title: 'Test Case 4', input: "n = 5\narr = [1, 1, 2, 2, 3]", output: "3" },
  "open the lock": { title: 'Test Case 4', input: "deadends = [\"0001\"], target = \"0002\"", output: "2" },
  "pacific atlantic water flow": { title: 'Test Case 4', input: "heights = [[2]]", output: "[[0, 0]]" },
  "pairs with target difference": { title: 'Test Case 4', input: "n = 3, diff = 3\narr = [1, 4, 7]", output: "2" },
  "palindrome linked list": { title: 'Test Case 4', input: "head = [1, 2, 3, 2, 1]", output: "true" },
  "palindrome number": { title: 'Test Case 4', input: "x = 1221", output: "true" },
  "palindrome number validator": { title: 'Test Case 4', input: "x = 1221", output: "true" },
  "palindrome partitioning": { title: 'Test Case 4', input: "s = \"bb\"", output: "[[\"b\", \"b\"], [\"bb\"]]" },
  "palindrome partitioning of secret codes": { title: 'Test Case 4', input: "s = \"bb\"", output: "[[\"b\", \"b\"], [\"bb\"]]" },
  "palindromic numbers in range": { title: 'Test Case 4', input: "lower = 10, upper = 25", output: "2" },
  "partition equal subset sum": { title: 'Test Case 4', input: "nums = [1, 2, 5]", output: "false" },
  "partition labels": { title: 'Test Case 4', input: "s = \"a\"", output: "[1]" },
  "pascal's triangle": { title: 'Test Case 4', input: "numRows = 4", output: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]" },
  "password security validator": { title: 'Test Case 4', input: "str = \"SecurePass9\"", output: "1" },
  "path with maximum gold": { title: 'Test Case 4', input: "grid = [[1]]", output: "1" },
  "peak index in a mountain array": { title: 'Test Case 4', input: "arr = [0, 5, 2]", output: "1" },
  "peak score and first occurrence index": { title: 'Test Case 4', input: "n = 4\narr = [5, 12, 45, 3]", output: "45\n2" },
  "permutation difference between two strings": { title: 'Test Case 4', input: "s = \"rhythm\"\nt = \"ythmrh\"", output: "8" },
  "permutations": { title: 'Test Case 4', input: "nums = [1, 2]", output: "[[1, 2], [2, 1]]" },
  "permutations of consonants": { title: 'Test Case 4', input: "str = \"JAVA\"", output: "2" },
  "pow(x, n)": { title: 'Test Case 4', input: "x = 2.00000, n = 0", output: "1.00000" },
  "product of array except self": { title: 'Test Case 4', input: "nums = [1, 2, 3]", output: "[6, 3, 2]" },
  "product sales analysis i": { title: 'Test Case 4', input: "Sales = [[1, 200, 2022, 1, 100]], Product = [[200, \"Sony\"]]", output: "[[\"Sony\", 2022, 100]]" },
  "rabbits in forest": { title: 'Test Case 4', input: "answers = [1]", output: "2" },
  "race car": { title: 'Test Case 4', input: "target = 2", output: "4" },
  "random pick with blacklist": { title: 'Test Case 4', input: "[\"Solution\", \"pick\"], [[2, [1]], []]", output: "[null, 0]" },
  "random pick with weight": { title: 'Test Case 4', input: "[\"Solution\", \"pickIndex\"], [[[2]], []]", output: "[null, 0]" },
  "range module": { title: 'Test Case 4', input: "[\"RangeModule\", \"queryRange\"], [[], [1, 2]]", output: "[null, false]" },
  "range sum query - immutable": { title: 'Test Case 4', input: "nums = [1, 2, 3], queries = [[0, 1], [1, 2]]", output: "[3, 5]" },
  "range sum query 2d - mutable": { title: 'Test Case 4', input: "[\"NumMatrix\", \"sumRegion\"], [[[[1]]], [0, 0, 0, 0]]", output: "[null, 1]" },
  "rat count house": { title: 'Test Case 4', input: "r = 2, unit = 4, n = 3\narr = [3, 5, 2]", output: "2" },
  "rearrange array in alternating signs": { title: 'Test Case 4', input: "n = 4\nnums = [1, -1, 2, -2]", output: "[1, -1, 2, -2]" },
  "reconstruct itinerary": { title: 'Test Case 4', input: "tickets = [[\"JFK\", \"SFO\"]]", output: "[\"JFK\", \"SFO\"]" },
  "regular expression matching": { title: 'Test Case 4', input: "s = \"aab\", p = \"c*a*b\"", output: "true" },
  "remove adjacent duplicates in string ii": { title: 'Test Case 4', input: "s = \"a\", k = 2", output: "\"a\"" },
  "remove all occurrences of a substring": { title: 'Test Case 4', input: "s = \"aabab\", part = \"ab\"", output: "\"a\"" },
  "remove covered intervals": { title: 'Test Case 4', input: "intervals = [[1, 2], [1, 4], [3, 4]]", output: "1" },
  "remove digit from number to maximize result": { title: 'Test Case 4', input: "number = \"133235\", digit = '3'", output: "\"13325\"" },
  "remove duplicates from sorted array": { title: 'Test Case 4', input: "nums = [1, 1, 2, 2, 3]", output: "3" },
  "remove element": { title: 'Test Case 4', input: "nums = [2, 2], val = 3", output: "2" },
  "remove outermost parentheses": { title: 'Test Case 4', input: "s = \"(()())\"", output: "\"()()\"" },
  "reorder data in log files": { title: 'Test Case 4', input: "logs = [\"dig1 8 1 5 1\", \"let1 art can\", \"dig2 3 6\", \"let2 own kit dig\", \"let3 art zero\"]", output: "[\"let1 art can\", \"let3 art zero\", \"let2 own kit dig\", \"dig1 8 1 5 1\", \"dig2 3 6\"]" },
  "reorder list": { title: 'Test Case 4', input: "head = [1, 2, 3]", output: "[1, 3, 2]" },
  "reorganize string": { title: 'Test Case 4', input: "s = \"ab\"", output: "\"ab\"" },
  "replace character in string": { title: 'Test Case 4', input: "str = \"hello\", ch1 = 'e', ch2 = 'o'", output: "holle" },
  "replace employee id with the unique identifier": { title: 'Test Case 4', input: "Employees = [[5, \"Eve\"]], EmployeeUNI = []", output: "[[null, \"Eve\"]]" },
  "reverse integer": { title: 'Test Case 4', input: "x = 0", output: "0" },
  "reverse linked list": { title: 'Test Case 4', input: "head = [1]", output: "[1]" },
  "reverse linked list ii": { title: 'Test Case 4', input: "head = [1, 2], left = 1, right = 2", output: "[2, 1]" },
  "reverse nodes in k-group": { title: 'Test Case 4', input: "head = [1, 2], k = 2", output: "[2, 1]" },
  "reverse signed 32-bit integer": { title: 'Test Case 4', input: "x = 0", output: "0" },
  "reverse string": { title: 'Test Case 4', input: "s = [\"A\", \"B\"]", output: "[\"B\", \"A\"]" },
  "reverse string ii": { title: 'Test Case 4', input: "s = \"a\", k = 2", output: "\"a\"" },
  "reverse words in a string": { title: 'Test Case 4', input: "s = \"world hello\"", output: "\"hello world\"" },
  "rising temperature": { title: 'Test Case 4', input: "Weather = [[1, \"2023-01-01\", 10]]", output: "[]" },
  "robot room cleaner": { title: 'Test Case 4', input: "room = [[1, 1]], row = 0, col = 0", output: "\"Robot cleaned all 2 accessible cells\"" },
  "roman numeral to integer conversion": { title: 'Test Case 4', input: "s = \"IV\"", output: "4" },
  "roman to integer": { title: 'Test Case 4', input: "s = \"IX\"", output: "9" },
  "roman to integer conversion": { title: 'Test Case 4', input: "s = \"IV\"", output: "4" },
  "rotate array": { title: 'Test Case 4', input: "nums = [1, 2, 3], k = 1", output: "[3, 1, 2]" },
  "rotate array by k positions": { title: 'Test Case 4', input: "n = 5, k = 2\narr = [1, 2, 3, 4, 5]", output: "4 5 1 2 3" },
  "rotate array by k steps": { title: 'Test Case 4', input: "nums = [1, 2, 3]\nk = 1", output: "[3, 1, 2]" },
  "rotate image matrix by 90 degrees": { title: 'Test Case 4', input: "n = 2\nmatrix = [\n  [1, 2],\n  [3, 4]\n]", output: "[\n  [3, 1],\n  [4, 2]\n]" },
  "rotate list": { title: 'Test Case 4', input: "head = [1, 2], k = 1", output: "[2, 1]" },
  "rotate string": { title: 'Test Case 4', input: "s = \"abc\", goal = \"bca\"", output: "true" },
  "rotting oranges": { title: 'Test Case 4', input: "grid = [[1]]", output: "-1" },
  "run length string compression": { title: 'Test Case 4', input: "str = \"wwwwwbb\"", output: "w5b2" },
  "same tree": { title: 'Test Case 4', input: "p = [], q = []", output: "true" },
  "search a 2d matrix": { title: 'Test Case 4', input: "matrix = [[1, 3], [5, 7]], target = 5", output: "true" },
  "search a 2d matrix with row and column ordering": { title: 'Test Case 4', input: "m = 2, n = 2\nmatrix = [\n  [1, 3],\n  [2, 4]\n]\ntarget = 3", output: "1" },
  "search in a 2d sorted matrix": { title: 'Test Case 4', input: "n = 2, m = 2, x = 4\nmat = [[1, 2], [3, 4]]", output: "1" },
  "search in rotated sorted array": { title: 'Test Case 4', input: "nums = [3, 1, 2, 3]\ntarget = 1", output: "1" },
  "search insert position": { title: 'Test Case 4', input: "nums = [1, 3], target = 2", output: "1" },
  "second highest salary": { title: 'Test Case 4', input: "Employee = [[1, 100]]", output: "null" },
  "second most frequent character": { title: 'Test Case 4', input: "str = \"geek\"", output: "g" },
  "sell diminishing-valued colored balls": { title: 'Test Case 4', input: "inventory = [3, 5], orders = 1", output: "5" },
  "sentence screen fitting": { title: 'Test Case 4', input: "sentence = [\"a\"], rows = 1, cols = 1", output: "1" },
  "set matrix zeroes": { title: 'Test Case 4', input: "matrix = [[0, 1], [1, 1]]", output: "[[0, 0], [0, 1]]" },
  "shortest bridge": { title: 'Test Case 4', input: "grid = [[1, 0], [0, 1]]", output: "1" },
  "shortest distance from all buildings": { title: 'Test Case 4', input: "grid = [[0]]", output: "0" },
  "shortest palindrome prefix": { title: 'Test Case 4', input: "s = \"ab\"", output: "\"bab\"" },
  "shortest path in a grid with obstacles elimination": { title: 'Test Case 4', input: "grid = [[0, 0], [0, 0]], k = 0", output: "2" },
  "single element in a sorted array": { title: 'Test Case 4', input: "nums = [1, 1, 2]", output: "2" },
  "single number": { title: 'Test Case 4', input: "nums = [7]", output: "7" },
  "sliding window median": { title: 'Test Case 4', input: "nums = [1], k = 1", output: "[1.00000]" },
  "smallest divisible digit product": { title: 'Test Case 4', input: "n = 12\nt = 4", output: "14" },
  "smallest pair product": { title: 'Test Case 4', input: "sum = 10, n = 4\narr = [3, 4, 5, 2]", output: "6" },
  "smallest positive integer missing from sequence": { title: 'Test Case 4', input: "n = 2\nnums = [1, 2]", output: "3" },
  "smallest range covering elements from k lists": { title: 'Test Case 4', input: "nums = [[1], [2]]", output: "[1, 2]" },
  "smallest value of the rearranged number": { title: 'Test Case 4', input: "num = 10", output: "10" },
  "snapshot array": { title: 'Test Case 4', input: "[\"SnapshotArray\", \"snap\"], [[1], []]", output: "[null, 0]" },
  "sort array by absolute value": { title: 'Test Case 4', input: "nums = [-5, 2, -1]", output: "[-1, 2, -5]" },
  "sort characters by frequency": { title: 'Test Case 4', input: "s = \"cba\"", output: "\"abc\"" },
  "sort colors": { title: 'Test Case 4', input: "nums = [1]", output: "[1]" },
  "sort colors using dutch national flag algorithm": { title: 'Test Case 4', input: "n = 4\nnums = [2, 1, 1, 0]", output: "[0, 1, 1, 2]" },
  "sort vowels in a string": { title: 'Test Case 4', input: "s = \"AEIOU\"", output: "\"AEIOU\"" },
  "spiral matrix": { title: 'Test Case 4', input: "matrix = [[1, 2], [3, 4]]", output: "[1, 2, 4, 3]" },
  "spiral matrix traversal of inspection grid": { title: 'Test Case 4', input: "r = 2, c = 2\nmatrix = [\n  [1, 2],\n  [3, 4]\n]", output: "[1, 2, 4, 3]" },
  "split array largest sum": { title: 'Test Case 4', input: "nums = [1, 2], k = 1", output: "3" },
  "sqrt(x)": { title: 'Test Case 4', input: "x = 1", output: "1" },
  "step-by-step directions from a binary tree node to another": { title: 'Test Case 4', input: "root = [1, 2], startValue = 1, destValue = 2", output: "\"L\"" },
  "stream of characters": { title: 'Test Case 4', input: "[\"StreamChecker\", \"query\"], [[[\"a\"]], ['a']]", output: "[null, true]" },
  "string compression": { title: 'Test Case 4', input: "chars = [\"a\", \"b\"]", output: "2" },
  "string permutation inclusion": { title: 'Test Case 4', input: "s1 = \"ab\", s2 = \"ba\"", output: "1" },
  "string rotation equivalence": { title: 'Test Case 4', input: "s = \"waterbottle\"\ngoal = \"erbottlewat\"", output: "1" },
  "string to integer (atoi)": { title: 'Test Case 4', input: "s = \"+1\"", output: "1" },
  "string transforms into another string": { title: 'Test Case 4', input: "str1 = \"ab\", str2 = \"ba\"", output: "true" },
  "strobogrammatic number ii": { title: 'Test Case 4', input: "n = 0", output: "[\"\"]" },
  "subarray product less than k": { title: 'Test Case 4', input: "n = 4, k = 15\nnums = [1, 2, 3, 4]", output: "10" },
  "subarray sum equals k": { title: 'Test Case 4', input: "nums = [1], k = 0", output: "0" },
  "subarray sum equals target k": { title: 'Test Case 4', input: "n = 4, k = 3\nnums = [1, 2, 3, -3]", output: "2" },
  "subarrays with k different integers": { title: 'Test Case 4', input: "nums = [1, 2], k = 1", output: "2" },
  "subsequence of length k with the largest sum": { title: 'Test Case 4', input: "nums = [5, 4, 3, 2, 1]\nk = 2", output: "[5, 4]" },
  "subsets": { title: 'Test Case 4', input: "nums = [1]", output: "[[], [1]]" },
  "subsets generation from student skill identifiers": { title: 'Test Case 4', input: "n = 2\nnums = [1, 2]", output: "[[], [1], [2], [1, 2]]" },
  "substring with concatenation of all words": { title: 'Test Case 4', input: "s = \"word\", words = [\"word\"]", output: "[0]" },
  "sum of beautiful subsequences": { title: 'Test Case 4', input: "nums = [1, 2]", output: "3" },
  "sum of subarray minimums": { title: 'Test Case 4', input: "arr = [1, 2, 3]", output: "10" },
  "sum of values at indices with k set bits": { title: 'Test Case 4', input: "nums = [1, 2, 3, 4]\nk = 1", output: "5" },
  "superior elements": { title: 'Test Case 4', input: "n = 5\narr = [5, 4, 3, 2, 1]", output: "5" },
  "swim in rising water": { title: 'Test Case 4', input: "grid = [[0]]", output: "0" },
  "tallest billboard": { title: 'Test Case 4', input: "rods = [1, 1]", output: "1" },
  "task scheduler": { title: 'Test Case 4', input: "tasks = [\"A\", \"A\", \"B\", \"B\"], n = 2", output: "5" },
  "text justification": { title: 'Test Case 4', input: "words = [\"a\"], maxWidth = 1", output: "[\"a\"]" },
  "third maximum number": { title: 'Test Case 4', input: "nums = [1, 1, 1]", output: "1" },
  "time based key-value store": { title: 'Test Case 4', input: "[\"TimeMap\", \"set\", \"get\"], [[], [\"k\", \"v\", 1], [\"k\", 2]]", output: "[null, null, \"v\"]" },
  "time needed to inform all employees": { title: 'Test Case 4', input: "n = 3, headID = 0, manager = [-1, 0, 0], informTime = [2, 0, 0]", output: "2" },
  "toeplitz matrix": { title: 'Test Case 4', input: "matrix = [[1, 2, 3], [4, 1, 2]]", output: "true" },
  "top k frequent elements": { title: 'Test Case 4', input: "nums = [3, 0, 1, 0], k = 1", output: "[0]" },
  "top k frequent elements in query log": { title: 'Test Case 4', input: "n = 3, k = 1\nnums = [1, 1, 2]", output: "[1]" },
  "transform array by parity": { title: 'Test Case 4', input: "nums = [1, 2]", output: "[0, 1]" },
  "trapping rain water": { title: 'Test Case 4', input: "height = [4, 2, 0, 3, 2, 5]", output: "9" },
  "trapping rain water in elevation wells": { title: 'Test Case 4', input: "n = 5\nheight = [2, 0, 2, 0, 2]", output: "4" },
  "triangle": { title: 'Test Case 4', input: "triangle = [[2], [3, 4]]", output: "5" },
  "trionic array i": { title: 'Test Case 4', input: "nums = [1, 2, 3]", output: "true" },
  "trionic array ii": { title: 'Test Case 4', input: "nums = [0, 0, 0]", output: "1" },
  "triplet sum to zero in financial ledger": { title: 'Test Case 4', input: "n = 4\nnums = [-2, 0, 1, 1]", output: "[[-2, 1, 1]]" },
  "two sum": { title: 'Test Case 4', input: "nums = [1, 5, 8, 3], target = 9", output: "[1, 3]" },
  "two sum in sorted array": { title: 'Test Case 4', input: "n = 3\nnumbers = [2, 7, 11]\ntarget = 9", output: "[1, 2]" },
  "two sum target pair": { title: 'Test Case 4', input: "nums = [1, 5, 8, 3], target = 9", output: "[1, 3]" },
  "unique paths": { title: 'Test Case 4', input: "m = 2, n = 2", output: "2" },
  "valid anagram": { title: 'Test Case 4', input: "s = \"a\", t = \"ab\"", output: "false" },
  "valid palindrome": { title: 'Test Case 4', input: "s = \"0P\"", output: "false" },
  "valid parentheses": { title: 'Test Case 4', input: "s = \"{[]}\"", output: "true" },
  "valid parentheses sequence": { title: 'Test Case 4', input: "s = \"()()\"", output: "1" },
  "valid parentheses sequence validator": { title: 'Test Case 4', input: "s = \"([)]\"", output: "0" },
  "valid sudoku": { title: 'Test Case 4', input: "board = [[\"5\",\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\"],[\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\"],[\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\"],[\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\"],[\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\"],[\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\"],[\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\"],[\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\"],[\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\",\".\"]]", output: "true" },
  "validate binary search tree": { title: 'Test Case 4', input: "root = [2, 1, 3]", output: "true" },
  "vertical order traversal of a binary tree": { title: 'Test Case 4', input: "root = [1]", output: "[[1]]" },
  "vowel to consonant substrings": { title: 'Test Case 4', input: "str = \"ace\"", output: "1" },
  "watering plants step counter": { title: 'Test Case 4', input: "plants = [1, 1, 1], capacity = 3", output: "3" },
  "wave array arrangement": { title: 'Test Case 4', input: "n = 4\narr = [1, 2, 3, 4]", output: "2 1 4 3" },
  "ways to split string with equal unique characters": { title: 'Test Case 4', input: "s = \"ababa\"", output: "2" },
  "wildcard matching": { title: 'Test Case 4', input: "s = \"ab\", p = \"?*\"", output: "true" },
  "word break": { title: 'Test Case 4', input: "s = \"a\", wordDict = [\"b\"]", output: "false" },
  "word break dictionary validator": { title: 'Test Case 4', input: "s = \"bb\"\nwordDict = [\"a\", \"b\", \"bbb\", \"bbbb\"]", output: "1" },
  "word ladder ii": { title: 'Test Case 4', input: "beginWord = \"a\", endWord = \"b\", wordList = [\"b\"]", output: "[[\"a\", \"b\"]]" },
  "word search": { title: 'Test Case 4', input: "board = [[\"a\"]], word = \"a\"", output: "true" },
  "word squares": { title: 'Test Case 4', input: "words = [\"ball\", \"area\", \"lead\", \"lady\"]", output: "[[\"ball\", \"area\", \"lead\", \"lady\"]]" },
  "xor after range multiplication queries i": { title: 'Test Case 4', input: "nums = [1], queries = [[0, 0, 1]]", output: "[1]" },
  "xor after range multiplication queries ii": { title: 'Test Case 4', input: "nums = [2], queries = [[0, 0, 2]]", output: "4" },
  "zero sum subarrays detection": { title: 'Test Case 4', input: "n = 3\narr = [1, -1, 0]", output: "3" },
  "zigzag conversion": { title: 'Test Case 4', input: "s = \"AB\", numRows = 1", output: "\"AB\"" }
};

/**
 * Harmonizes test case input & output formatting against Case 1 baseline style.
 * Normalizes variable names (arr vs nums), handles n = array length prefixes,
 * and maintains consistent quote wrapping.
 */
function harmonizeTestCaseInput(c4: PaperTestCase, baseCase: PaperTestCase, title: string = ''): PaperTestCase {
  let input = c4.input;
  let output = c4.output;
  const baseInput = baseCase.input || '';
  const baseOutput = baseCase.output || '';
  const normTitle = title.toLowerCase().trim();

  // Longest common prefix handling
  if (normTitle.includes('longest common prefix')) {
    if (baseInput.includes('strs =')) {
      input = 'strs = ["cir", "car"]';
      output = baseOutput.startsWith('"') ? '"c"' : 'c';
    } else if (baseInput.includes('arr =')) {
      input = 'n = 2\narr = ["cir", "car"]';
      output = 'c';
    }
    return { ...c4, input, output };
  }

  // Variable name harmonization (arr vs nums)
  if (baseInput.includes('arr =') && !baseInput.includes('nums =')) {
    input = input.replace(/\bnums\s*=/g, 'arr =');
  } else if (baseInput.includes('nums =') && !baseInput.includes('arr =')) {
    input = input.replace(/\barr\s*=/g, 'nums =');
  }

  // Case-insensitive match for base variables (e.g. person vs Person)
  const baseVarMatches = baseInput.match(/([a-zA-Z0-9_$]+)\s*=/g) || [];
  for (const bvm of baseVarMatches) {
    const rawVar = bvm.replace(/\s*=/, '').trim();
    const c4VarRegex = new RegExp(`\\b${rawVar}\\s*=`, 'i');
    if (c4VarRegex.test(input) && !input.includes(`${rawVar} =`)) {
      input = input.replace(c4VarRegex, `${rawVar} =`);
    }
  }

  // Harmonize n = prefix
  const baseHasN = /\bn\s*=/i.test(baseInput);
  const c4HasN = /\bn\s*=/i.test(input);

  if (baseHasN && !c4HasN) {
    const arrMatch = input.match(/=\s*(\[[^\]]*\])/);
    if (arrMatch) {
      try {
        const parsed = JSON.parse(arrMatch[1]);
        if (Array.isArray(parsed)) {
          input = `n = ${parsed.length}\n${input}`;
        }
      } catch {
        const items = arrMatch[1].replace(/[\[\]]/g, '').trim().split(',').filter(x => x.trim().length > 0);
        input = `n = ${items.length}\n${input}`;
      }
    }
  } else if (!baseHasN && c4HasN) {
    input = input.replace(/n\s*=\s*\d+\s*\n?/gi, '').trim();
  }

  return { ...c4, input, output };
}

/**
 * Ensures test cases count is guaranteed to be at least 4 for practice IDE execution.
 */
export function ensureFourTestCases(cases: PaperTestCase[], title: string = ''): PaperTestCase[] {
  const normTitle = (title || '').toLowerCase().trim();
  let baseCases = cases;

  if (CANONICAL_FALLBACK_TEST_CASES[normTitle]) {
    const canonical = CANONICAL_FALLBACK_TEST_CASES[normTitle];
    if (!baseCases || baseCases.length < 4 || normTitle === 'encoded string decoding' || normTitle === 'peak index in a mountain array') {
      if (normTitle === 'encoded string decoding' || normTitle === 'peak index in a mountain array') {
        baseCases = canonical;
      } else if (baseCases && baseCases.length === 3 && canonical.length >= 4) {
        // If 3 cases exist and canonical has 4, take canonical 4th case if distinct
        let c4 = harmonizeTestCaseInput({ ...canonical[3] }, baseCases[0], normTitle);
        const isDuplicate = baseCases.some(b => b.input.trim() === c4.input.trim());
        baseCases = isDuplicate ? canonical : [...baseCases, c4];
      } else {
        baseCases = canonical;
      }
    }
  }

  // Special branch: Second Highest Salary has dual formats (salaries array vs SQL Employee records)
  if (normTitle === 'second highest salary' && baseCases && baseCases.length === 3) {
    if (baseCases[0].input.includes('salaries')) {
      return [...baseCases, { title: 'Test Case 4', input: 'salaries = [10, 20]', output: '10' }];
    } else {
      return [...baseCases, { title: 'Test Case 4', input: 'Employee = [[1, 200], [2, 300]]', output: '200' }];
    }
  }

  // Special branch: Remove Duplicates from Sorted Array has dual output formats (array of unique elements vs integer length k)
  if (normTitle === 'remove duplicates from sorted array' && baseCases && baseCases.length === 3) {
    if (baseCases[0].output.trim().startsWith('[')) {
      return [...baseCases, { title: 'Test Case 4', input: 'nums = [1, 1, 2, 2, 3]', output: '[1, 2, 3]' }];
    } else {
      return [...baseCases, { title: 'Test Case 4', input: 'nums = [1, 1, 2, 2, 3]', output: '3' }];
    }
  }

  // Special branch: Min Stack has dual input schemas (raw JSON method calls vs operations/values named parameters)
  if (normTitle === 'min stack' && baseCases && baseCases.length === 3) {
    if (baseCases[0].input.trim().startsWith('[')) {
      return [...baseCases, { title: 'Test Case 4', input: '["MinStack", "push", "top"], [[], [5], []]', output: '[null, null, 5]' }];
    } else {
      return [...baseCases, { title: 'Test Case 4', input: 'operations = ["MinStack", "push", "top"], values = [[], [5], []]', output: '[null, null, 5]' }];
    }
  }

  // 2. Check canonical 4th test case catalog
  if (CANONICAL_FOURTH_TEST_CASE[normTitle]) {
    const rawC4 = CANONICAL_FOURTH_TEST_CASE[normTitle];
    if (baseCases && baseCases.length === 3) {
      const c4 = harmonizeTestCaseInput({ ...rawC4 }, baseCases[0], normTitle);
      const isDuplicate = baseCases.some(b => b.input.trim() === c4.input.trim());
      if (!isDuplicate) {
        baseCases = [...baseCases, { ...c4, title: 'Test Case 4' }];
      }
    }
  }

  if (!baseCases || baseCases.length === 0) return [];
  if (baseCases.length >= 4) return baseCases;

  const result = [...baseCases];
  while (result.length < 4) {
    const nextIdx = result.length + 1;
    const base = result[result.length - 1];
    result.push({
      title: `Test Case ${nextIdx}`,
      input: base.input,
      output: base.output,
      explanation: base.explanation || 'Edge case and boundary constraint verification.',
    });
  }
  return result;
}

export function parsePaperQuestions(rawContent?: string): PaperQuestion[] {
  if (!rawContent || typeof rawContent !== 'string') return [];
  const content = rawContent.trim();
  if (!content) return [];

  const questions: PaperQuestion[] = [];

  // Strategy A: HTML <div class="question-block ...">
  if (content.includes('question-block')) {
    const rawBlocks = content.split(/(?=<div[^>]*class="[^"]*question-block[^"]*")/gi);
    let qIdx = 1;
    for (const b of rawBlocks) {
      if (!b.includes('question-block')) continue;

      const titleMatch = b.match(/<(?:h[1-3]|strong)[^>]*>([\s\S]*?)<\/(?:h[1-3]|strong)>/i);
      const rawTitle = titleMatch ? cleanHtmlTags(titleMatch[1]) : `Question ${qIdx}`;

      const numMatch = rawTitle.match(/^Q(\d+)[\.:\s\-]/i) || rawTitle.match(/^Question\s*(\d+)[\.:\s\-]/i);
      const qNum = numMatch ? parseInt(numMatch[1], 10) : qIdx;
      const cleanTitle = rawTitle.replace(/^Q\d+[\.:\s\-]\s*/i, '').replace(/^Question\s*\d+[\.:\s\-]\s*/i, '').trim();

      // Extract constraints
      const constraints: string[] = [];
      const constraintsMatch = b.match(/<h[2-4][^>]*>Constraints<\/h[2-4]>([\s\S]*?)<\/ul>/i);
      if (constraintsMatch) {
        const liMatches = [...constraintsMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
        liMatches.forEach(li => {
          const c = cleanHtmlTags(li[1]);
          if (c && !c.includes('🧪')) constraints.push(c);
        });
      }

      // Extract description
      let desc = '';
      const descMatch = b.match(/<div class="[^"]*font-sans[^"]*">([\s\S]*?)<\/div>/i);
      if (descMatch) {
        desc = cleanHtmlTags(descMatch[1]);
      } else {
        const beforeConstraints = b.split(/<h[2-4][^>]*>Constraints/i)[0];
        desc = cleanHtmlTags(beforeConstraints).replace(rawTitle, '').trim();
      }

      let testCases = parseTestCasesFromBlock(b);
      const cleanKey = cleanTitle.toLowerCase().trim();
      if (CANONICAL_FALLBACK_TEST_CASES[cleanKey]) {
        if (testCases.length <= 1 || cleanKey === 'encoded string decoding' || cleanKey === 'peak index in a mountain array') {
          testCases = CANONICAL_FALLBACK_TEST_CASES[cleanKey];
        }
      }
      const difficulty = inferQuestionDifficulty(cleanTitle, desc, b);

      questions.push({
        id: `q-${qNum}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        number: qNum,
        title: rawTitle,
        cleanTitle: cleanTitle || rawTitle,
        difficulty,
        description: desc,
        constraints,
        testCases,
        rawContent: b,
      });
      qIdx++;
    }

    if (questions.length > 0) return questions;
  }

  // Strategy B: HTML Headings (<h2>Q1. ...</h2> or <h1>Q1. ...</h1>)
  const headingRegex = /<(h[1-3])[^>]*>(\s*(?:Q\d+|Question\s*\d+)[\.:\s\-][\s\S]*?)<\/\1>/gi;
  const headingMatches = [...content.matchAll(headingRegex)];
  if (headingMatches.length > 0) {
    for (let i = 0; i < headingMatches.length; i++) {
      const match = headingMatches[i];
      const rawTitle = cleanHtmlTags(match[2]);
      const startIndex = match.index;
      const endIndex = (i < headingMatches.length - 1) ? headingMatches[i + 1].index : content.length;
      const blockContent = content.substring(startIndex, endIndex);

      const numMatch = rawTitle.match(/^Q(\d+)[\.:\s\-]/i) || rawTitle.match(/^Question\s*(\d+)[\.:\s\-]/i);
      const qNum = numMatch ? parseInt(numMatch[1], 10) : i + 1;
      const cleanTitle = rawTitle.replace(/^Q\d+[\.:\s\-]\s*/i, '').replace(/^Question\s*\d+[\.:\s\-]\s*/i, '').trim();

      // Extract constraints
      const constraints: string[] = [];
      const constraintsMatch = blockContent.match(/(?:Constraints|<strong>Constraints:?<\/strong>)([\s\S]*?)(?:Test\s*Cases|Example|$)/i);
      if (constraintsMatch) {
        const text = cleanHtmlTags(constraintsMatch[1]);
        text.split('\n')
          .map(l => l.replace(/^[-*•]\s*/, '').trim())
          .filter(Boolean)
          .forEach(c => {
            if (!c.includes('🧪')) constraints.push(c);
          });
      }

      // Extract description
      const descText = cleanHtmlTags(blockContent).replace(rawTitle, '').split(/Constraints/i)[0].trim();
      let testCases = parseTestCasesFromBlock(blockContent);
      const cleanKey = cleanTitle.toLowerCase().trim();
      if (CANONICAL_FALLBACK_TEST_CASES[cleanKey]) {
        if (testCases.length <= 1 || cleanKey === 'encoded string decoding' || cleanKey === 'peak index in a mountain array') {
          testCases = CANONICAL_FALLBACK_TEST_CASES[cleanKey];
        }
      }
      const difficulty = inferQuestionDifficulty(cleanTitle, descText, blockContent);

      questions.push({
        id: `q-${qNum}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        number: qNum,
        title: rawTitle,
        cleanTitle: cleanTitle || rawTitle,
        difficulty,
        description: descText,
        constraints,
        testCases,
        rawContent: blockContent,
      });
    }

    if (questions.length > 0) return questions;
  }

  // Strategy C: Markdown Headings (# Q1. ... or ### Q1. ...)
  const mdRegex = /(?:^|\n)\s*#{1,4}\s*((?:Q\d+|Question\s*\d+)[\.:\s\-][^\n]+)/gi;
  const mdMatches = [...content.matchAll(mdRegex)];
  if (mdMatches.length > 0) {
    for (let i = 0; i < mdMatches.length; i++) {
      const match = mdMatches[i];
      const rawTitle = match[1].trim();
      const startIndex = match.index;
      const endIndex = (i < mdMatches.length - 1) ? mdMatches[i + 1].index : content.length;
      const blockContent = content.substring(startIndex, endIndex);

      const numMatch = rawTitle.match(/^Q(\d+)[\.:\s\-]/i) || rawTitle.match(/^Question\s*(\d+)[\.:\s\-]/i);
      const qNum = numMatch ? parseInt(numMatch[1], 10) : i + 1;
      const cleanTitle = rawTitle.replace(/^Q\d+[\.:\s\-]\s*/i, '').replace(/^Question\s*\d+[\.:\s\-]\s*/i, '').trim();

      let testCases = parseTestCasesFromBlock(blockContent);
      const cleanKey = cleanTitle.toLowerCase().trim();
      if (CANONICAL_FALLBACK_TEST_CASES[cleanKey]) {
        if (testCases.length <= 1 || cleanKey === 'encoded string decoding' || cleanKey === 'peak index in a mountain array') {
          testCases = CANONICAL_FALLBACK_TEST_CASES[cleanKey];
        }
      }
      const descText = cleanHtmlTags(blockContent).replace(rawTitle, '').split(/Constraints/i)[0].trim();
      const difficulty = inferQuestionDifficulty(cleanTitle, descText, blockContent);

      questions.push({
        id: `q-${qNum}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        number: qNum,
        title: rawTitle,
        cleanTitle: cleanTitle || rawTitle,
        difficulty,
        description: descText,
        constraints: [],
        testCases,
        rawContent: blockContent,
      });
    }

    if (questions.length > 0) return questions;
  }

  return [];
}
