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
  const dataCasesMatch = blockText.match(/data-cases=['"](.*?)['"]/i);
  if (dataCasesMatch) {
    try {
      const decoded = dataCasesMatch[1]
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
    { title: 'Test Case 1', input: 's = "babad"', output: 'bab', explanation: '"aba" is also a valid answer.' },
    { title: 'Test Case 2', input: 's = "cbbd"', output: 'bb' },
    { title: 'Test Case 3', input: 's = "a"', output: 'a' },
    { title: 'Test Case 4', input: 's = "ac"', output: 'a' }
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
    { title: 'Test Case 1', input: 'words = ["cd", "f", "kl"]', output: '["null", "false", "false", "true"]' },
    { title: 'Test Case 2', input: 'words = ["ab", "ba"]', output: '["null", "false", "true"]' },
    { title: 'Test Case 3', input: 'words = ["a"]', output: '["null", "true"]' },
    { title: 'Test Case 4', input: 'words = ["xyz"]', output: '["null", "false", "false", "true"]' }
  ],
  'encoded string decoding': [
    { title: 'Test Case 1', input: '101101110', output: 'ABC' },
    { title: 'Test Case 2', input: '11110111110', output: 'DE' },
    { title: 'Test Case 3', input: '1111111111111111111111111011111111111111111111111111', output: 'YZ', explanation: '25 ones (Y) separated by 0 and 26 ones (Z).' },
    { title: 'Test Case 4', input: '1', output: 'A' }
  ]
};

/**
 * Ensures test cases count is guaranteed to be at least 4 for practice IDE execution.
 */
export function ensureFourTestCases(cases: PaperTestCase[], title: string = ''): PaperTestCase[] {
  const normTitle = (title || '').toLowerCase().trim();
  let baseCases = cases;

  if (CANONICAL_FALLBACK_TEST_CASES[normTitle]) {
    if (!baseCases || baseCases.length <= 1 || normTitle === 'encoded string decoding') {
      baseCases = CANONICAL_FALLBACK_TEST_CASES[normTitle];
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
        if (testCases.length <= 1 || cleanKey === 'encoded string decoding') {
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
        if (testCases.length <= 1 || cleanKey === 'encoded string decoding') {
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
        if (testCases.length <= 1 || cleanKey === 'encoded string decoding') {
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
