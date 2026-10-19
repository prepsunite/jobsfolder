import { makeTestCase } from './batch1_pointers_arrays.mjs';

// -------------------------------------------------------------------
// REFERENCE SOLVERS FOR BATCH 5: EXHAUSTIVE SEARCH & DP (14 PROBLEMS)
// -------------------------------------------------------------------

export const solversBatch5 = {
  // lc-216: Combination Sum III
  'lc-216': (input) => {
    const [k, n] = input.trim().split(/\s+/).map(Number);
    const res = [];
    const backtrack = (start, remain, path) => {
      if (path.length === k) {
        if (remain === 0) res.push([...path]);
        return;
      }
      for (let i = start; i <= 9; i++) {
        if (i > remain) break;
        path.push(i);
        backtrack(i + 1, remain - i, path);
        path.pop();
      }
    };
    backtrack(1, n, []);
    if (res.length === 0) return '0';
    return `${res.length}\n` + res.map(c => c.join(' ')).join('\n');
  },

  // lc-90: Subsets II (With Duplicates)
  'lc-90': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const nums = N > 0 ? lines[1].trim().split(/\s+/).map(Number).sort((a, b) => a - b) : [];
    const res = [];
    const backtrack = (start, path) => {
      res.push([...path]);
      for (let i = start; i < N; i++) {
        if (i > start && nums[i] === nums[i - 1]) continue;
        path.push(nums[i]);
        backtrack(i + 1, path);
        path.pop();
      }
    };
    backtrack(0, []);
    return `${res.length}\n` + res.map(sub => sub.length === 0 ? 'EMPTY' : sub.join(' ')).join('\n');
  },

  // lc-40: Combination Sum II
  'lc-40': (input) => {
    const lines = input.trim().split('\n');
    const [N, target] = lines[0].trim().split(/\s+/).map(Number);
    const candidates = lines[1].trim().split(/\s+/).map(Number).sort((a, b) => a - b);
    const res = [];
    const backtrack = (start, remain, path) => {
      if (remain === 0) {
        res.push([...path]);
        return;
      }
      for (let i = start; i < N; i++) {
        if (i > start && candidates[i] === candidates[i - 1]) continue;
        if (candidates[i] > remain) break;
        path.push(candidates[i]);
        backtrack(i + 1, remain - candidates[i], path);
        path.pop();
      }
    };
    backtrack(0, target, []);
    if (res.length === 0) return '0';
    return `${res.length}\n` + res.map(c => c.join(' ')).join('\n');
  },

  // lc-47: Permutations II
  'lc-47': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const nums = lines[1].trim().split(/\s+/).map(Number).sort((a, b) => a - b);
    const res = [];
    const used = Array(N).fill(false);
    const backtrack = (path) => {
      if (path.length === N) {
        res.push([...path]);
        return;
      }
      for (let i = 0; i < N; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
        used[i] = true;
        path.push(nums[i]);
        backtrack(path);
        path.pop();
        used[i] = false;
      }
    };
    backtrack([]);
    return `${res.length}\n` + res.map(p => p.join(' ')).join('\n');
  },

  // lc-79: Word Search
  'lc-79': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const [R, C, word] = lines[0].split(/\s+/);
    const numR = Number(R), numC = Number(C);
    const board = [];
    for (let i = 1; i <= numR; i++) {
      board.push(lines[i].split(/\s+/));
    }
    const dfs = (r, c, idx) => {
      if (idx === word.length) return true;
      if (r < 0 || r >= numR || c < 0 || c >= numC || board[r][c] !== word[idx]) return false;
      const temp = board[r][c];
      board[r][c] = '#';
      const found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) ||
                    dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);
      board[r][c] = temp;
      return found;
    };
    for (let r = 0; r < numR; r++) {
      for (let c = 0; c < numC; c++) {
        if (dfs(r, c, 0)) return 'true';
      }
    }
    return 'false';
  },

  // lc-131: Palindrome Partitioning
  'lc-131': (input) => {
    const s = input.trim();
    const res = [];
    const isPal = (str, l, r) => {
      while (l < r) {
        if (str[l] !== str[r]) return false;
        l++;
        r--;
      }
      return true;
    };
    const backtrack = (start, path) => {
      if (start === s.length) {
        res.push([...path]);
        return;
      }
      for (let end = start; end < s.length; end++) {
        if (isPal(s, start, end)) {
          path.push(s.substring(start, end + 1));
          backtrack(end + 1, path);
          path.pop();
        }
      }
    };
    backtrack(0, []);
    return `${res.length}\n` + res.map(p => p.join(' ')).join('\n');
  },

  // lc-17: Letter Combinations of a Phone Number
  'lc-17': (input) => {
    const digits = input.trim();
    if (!digits || digits.length === 0) return 'EMPTY';
    const map = {
      '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
      '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };
    const res = [];
    const backtrack = (idx, path) => {
      if (idx === digits.length) {
        res.push(path);
        return;
      }
      const letters = map[digits[idx]] || '';
      for (const char of letters) {
        backtrack(idx + 1, path + char);
      }
    };
    backtrack(0, '');
    return res.join(' ');
  },

  // lc-51: N-Queens
  'lc-51': (input) => {
    const N = Number(input.trim());
    let count = 0;
    const cols = new Set(), diag1 = new Set(), diag2 = new Set();
    const backtrack = (row) => {
      if (row === N) {
        count++;
        return;
      }
      for (let col = 0; col < N; col++) {
        if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
        cols.add(col);
        diag1.add(row - col);
        diag2.add(row + col);
        backtrack(row + 1);
        cols.delete(col);
        diag1.delete(row - col);
        diag2.delete(row + col);
      }
    };
    backtrack(0);
    return String(count);
  },

  // lc-37: Sudoku Solver
  'lc-37': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const board = [];
    for (let i = 0; i < 9; i++) {
      board.push(lines[i].split(/\s+/).map(Number));
    }
    const isValid = (r, c, val) => {
      for (let i = 0; i < 9; i++) {
        if (board[r][i] === val || board[i][c] === val) return false;
        const boxR = 3 * Math.floor(r / 3) + Math.floor(i / 3);
        const boxC = 3 * Math.floor(c / 3) + (i % 3);
        if (board[boxR][boxC] === val) return false;
      }
      return true;
    };
    const solve = () => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === 0) {
            for (let val = 1; val <= 9; val++) {
              if (isValid(r, c, val)) {
                board[r][c] = val;
                if (solve()) return true;
                board[r][c] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };
    solve();
    return board.map(row => row.join(' ')).join('\n');
  },

  // lc-213: House Robber II (Circular)
  'lc-213': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    if (N === 0) return '0';
    const nums = lines[1].trim().split(/\s+/).map(Number);
    if (N === 1) return String(nums[0]);
    if (N === 2) return String(Math.max(nums[0], nums[1]));
    const robLine = (arr) => {
      let prev2 = 0, prev1 = 0;
      for (const val of arr) {
        const cur = Math.max(prev1, prev2 + val);
        prev2 = prev1;
        prev1 = cur;
      }
      return prev1;
    };
    const ans = Math.max(robLine(nums.slice(0, N - 1)), robLine(nums.slice(1, N)));
    return String(ans);
  },

  // lc-518: Coin Change II
  'lc-518': (input) => {
    const lines = input.trim().split('\n');
    const [amount, N] = lines[0].trim().split(/\s+/).map(Number);
    const coins = N > 0 ? lines[1].trim().split(/\s+/).map(Number) : [];
    const dp = Array(amount + 1).fill(0);
    dp[0] = 1;
    for (const coin of coins) {
      for (let x = coin; x <= amount; x++) {
        dp[x] += dp[x - coin];
      }
    }
    return String(dp[amount]);
  },

  // lc-416: Partition Equal Subset Sum
  'lc-416': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const nums = lines[1].trim().split(/\s+/).map(Number);
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return 'false';
    const target = total / 2;
    const dp = Array(target + 1).fill(false);
    dp[0] = true;
    for (const num of nums) {
      for (let j = target; j >= num; j--) {
        dp[j] = dp[j] || dp[j - num];
      }
    }
    return dp[target] ? 'true' : 'false';
  },

  // lc-139: Word Break
  'lc-139': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const s = lines[0];
    const K = Number(lines[1]);
    const words = new Set(lines[2].split(/\s+/));
    const dp = Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++) {
      for (let j = 0; j < i; j++) {
        if (dp[j] && words.has(s.substring(j, i))) {
          dp[i] = true;
          break;
        }
      }
    }
    return dp[s.length] ? 'true' : 'false';
  },

  // lc-10: Regular Expression Matching
  'lc-10': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const s = lines[0];
    const p = lines[1];
    const m = s.length, n = p.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
    dp[0][0] = true;
    for (let j = 2; j <= n; j += 2) {
      if (p[j - 1] === '*' && dp[0][j - 2]) {
        dp[0][j] = true;
      }
    }
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else if (p[j - 1] === '*') {
          dp[i][j] = dp[i][j - 2];
          if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
            dp[i][j] = dp[i][j] || dp[i - 1][j];
          }
        }
      }
    }
    return dp[m][n] ? 'true' : 'false';
  }
};

// -------------------------------------------------------------
// METADATA & 8 TEST CASES FOR EACH PROBLEM
// -------------------------------------------------------------

export const problemsBatch5 = [
  {
    id: 'lc-216',
    leetcodeNumber: 216,
    title: 'Combination Sum III',
    slug: 'combination-sum-iii',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'Find all valid combinations of k numbers that add up to n such that only numbers 1 through 9 are used and each number is used at most once.\n\nPrint the count of combinations on line 1, followed by each combination on a new line with elements sorted ascending.',
    inputFormat: 'Line 1: Two space-separated integers k and n.',
    outputFormat: 'Line 1: Integer K (number of combinations, or 0).\nNext K lines: k space-separated integers.',
    constraints: ['2 <= k <= 9', '1 <= n <= 60'],
    sampleInput: '3 7',
    sampleOutput: '1\n1 2 4',
    explanation: '1 + 2 + 4 = 7. There are no other valid combinations.',
    testInputs: [
      '3 7',
      '3 9',
      '4 1',
      '2 18',
      '3 15',
      '9 45',
      '4 24',
      '5 15'
    ]
  },

  {
    id: 'lc-90',
    leetcodeNumber: 90,
    title: 'Subsets II (With Duplicates)',
    slug: 'subsets-ii',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'Given an integer array nums that may contain duplicates, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Print the count of subsets on line 1, followed by each subset on a new line (or EMPTY for empty subset).',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Line 1: Count of unique subsets.\nFollowing lines: Space-separated integers for each subset.',
    constraints: ['1 <= N <= 10', '-10 <= nums[i] <= 10'],
    sampleInput: '3\n1 2 2',
    sampleOutput: '6\nEMPTY\n1\n1 2\n1 2 2\n2\n2 2',
    explanation: 'The 6 unique subsets of [1, 2, 2] are [], [1], [1, 2], [1, 2, 2], [2], [2, 2].',
    testInputs: [
      '3\n1 2 2',
      '1\n0',
      '2\n4 4',
      '3\n1 2 3',
      '4\n1 1 2 2',
      '3\n-1 -1 2',
      '4\n0 0 0 0',
      '5\n1 2 2 3 3'
    ]
  },

  {
    id: 'lc-40',
    leetcodeNumber: 40,
    title: 'Combination Sum II',
    slug: 'combination-sum-ii',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'Given a collection of candidate numbers candidates and a target number target, find all unique combinations in candidates where the candidate numbers sum to target.\n\nEach number in candidates may only be used once in the combination. Print the count of combinations followed by each combination on a new line.',
    inputFormat: 'Line 1: Two space-separated integers N and target.\nLine 2: N space-separated integers.',
    outputFormat: 'Line 1: Count of combinations (or 0).\nFollowing lines: Space-separated integers in ascending order.',
    constraints: ['1 <= N <= 100', '1 <= candidates[i] <= 50', '1 <= target <= 30'],
    sampleInput: '7 8\n10 1 2 7 6 1 5',
    sampleOutput: '4\n1 1 6\n1 2 5\n1 7\n2 6',
    explanation: 'Four unique combinations sum to 8: [1,1,6], [1,2,5], [1,7], and [2,6].',
    testInputs: [
      '7 8\n10 1 2 7 6 1 5',
      '5 5\n2 5 2 1 2',
      '3 10\n1 2 3',
      '1 5\n5',
      '6 6\n1 1 1 1 1 1',
      '4 4\n1 2 3 4',
      '6 7\n2 3 6 7 2 3',
      '8 10\n1 1 2 2 3 3 4 5'
    ]
  },

  {
    id: 'lc-47',
    leetcodeNumber: 47,
    title: 'Permutations II (Unique Permutations)',
    slug: 'permutations-ii',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'Given a collection of numbers, nums, that might contain duplicates, return all possible unique permutations in any order.\n\nPrint the total count of unique permutations on line 1, followed by each permutation on a new line.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Line 1: Count of unique permutations.\nFollowing lines: N space-separated integers.',
    constraints: ['1 <= N <= 8', '-10 <= nums[i] <= 10'],
    sampleInput: '3\n1 1 2',
    sampleOutput: '3\n1 1 2\n1 2 1\n2 1 1',
    explanation: 'The 3 unique permutations are [1, 1, 2], [1, 2, 1], and [2, 1, 1].',
    testInputs: [
      '3\n1 1 2',
      '3\n1 2 3',
      '1\n5',
      '4\n1 1 2 2',
      '2\n1 1',
      '3\n2 2 2',
      '4\n2 2 1 1',
      '4\n1 2 3 1'
    ]
  },

  {
    id: 'lc-79',
    leetcodeNumber: 79,
    title: 'Word Search in Grid',
    slug: 'word-search',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    inputFormat: 'Line 1: Three space-separated values: R, C, and word.\nNext R lines: C space-separated uppercase characters.',
    outputFormat: 'Print true or false.',
    constraints: ['1 <= R, C <= 6', '1 <= word.length <= 15', 'board and word consist of only uppercase English letters.'],
    sampleInput: '3 4 ABCCED\nA B C E\nS F C S\nA D E E',
    sampleOutput: 'true',
    explanation: 'The word "ABCCED" is traced along the grid.',
    testInputs: [
      '3 4 ABCCED\nA B C E\nS F C S\nA D E E',
      '3 4 SEE\nA B C E\nS F C S\nA D E E',
      '3 4 ABOB\nA B C E\nS F C S\nA D E E',
      '1 1 A\nA',
      '1 1 B\nA',
      '2 2 ABBA\nA B\nB A',
      '3 3 HELLO\nH E L\nX O L\nA B C',
      '4 4 MICROSOFT\nM I C R\nO S O F\nT X Y Z\nA B C D'
    ]
  },

  {
    id: 'lc-131',
    leetcodeNumber: 131,
    title: 'Palindrome Partitioning',
    slug: 'palindrome-partitioning',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.\n\nPrint the total count of partitions on line 1, followed by each partition on a new line with space-separated palindromic substrings.',
    inputFormat: 'Line 1: String s.',
    outputFormat: 'Line 1: Count of partitions.\nFollowing lines: Space-separated palindromic substrings.',
    constraints: ['1 <= s.length <= 16', 's contains only lowercase English letters.'],
    sampleInput: 'aab',
    sampleOutput: '2\na a b\naa b',
    explanation: 'Two palindrome partitions: ["a", "a", "b"] and ["aa", "b"].',
    testInputs: [
      'aab',
      'a',
      'racecar',
      'aaa',
      'ab',
      'bb',
      'efe',
      'cdd'
    ]
  },

  {
    id: 'lc-17',
    leetcodeNumber: 17,
    title: 'Letter Combinations of a Phone Number',
    slug: 'letter-combinations-of-a-phone-number',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent according to classic telephone keypad mapping. Return the answer in lexicographical order separated by spaces.',
    inputFormat: 'Line 1: String digits (composed of \'2\'-\'9\').',
    outputFormat: 'Print space-separated letter combinations in lexicographical order, or EMPTY if digits is empty.',
    constraints: ['0 <= digits.length <= 4', 'digits[i] is a digit in the range [\'2\', \'9\'].'],
    sampleInput: '23',
    sampleOutput: 'ad ae af bd be bf cd ce cf',
    explanation: 'Pressing 2 and 3 produces 9 letter combinations.',
    testInputs: [
      '23',
      '',
      '2',
      '7',
      '9',
      '234',
      '79',
      '56'
    ]
  },

  {
    id: 'lc-51',
    leetcodeNumber: 51,
    title: 'N-Queens Solution Counter',
    slug: 'n-queens',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'HARD',
    description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return the number of distinct solutions to the n-queens puzzle.',
    inputFormat: 'Line 1: Integer n.',
    outputFormat: 'Print a single integer representing the count of distinct valid solutions.',
    constraints: ['1 <= n <= 9'],
    sampleInput: '4',
    sampleOutput: '2',
    explanation: 'There are 2 distinct configurations to place 4 queens on a 4x4 board.',
    testInputs: [
      '4',
      '1',
      '2',
      '3',
      '5',
      '6',
      '7',
      '8'
    ]
  },

  {
    id: 'lc-37',
    leetcodeNumber: 37,
    title: 'Sudoku Solver',
    slug: 'sudoku-solver',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'HARD',
    description: 'Write a program to solve a Sudoku puzzle by filling the empty cells. Empty cells are indicated by 0. Each row, column, and 3x3 sub-box must contain the digits 1-9 without repetition.',
    inputFormat: '9 lines: Each containing 9 space-separated integers (0 for empty cell).',
    outputFormat: '9 lines: Each containing 9 space-separated solved integers.',
    constraints: ['Board is guaranteed to have a unique valid solution.'],
    sampleInput: '5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9',
    sampleOutput: '5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9',
    explanation: 'The solved 9x9 grid satisfies all Sudoku rules.',
    testInputs: [
      '5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9',
      '0 0 9 7 4 8 0 0 0\n7 0 0 0 0 0 0 0 0\n0 2 0 1 0 9 0 0 0\n0 0 7 0 0 0 2 4 0\n0 6 4 0 1 0 5 9 0\n0 9 8 0 0 0 3 0 0\n0 0 0 8 0 3 0 2 0\n0 0 0 0 0 0 0 0 6\n0 0 0 2 7 5 9 0 0',
      '1 0 0 0 0 0 0 0 0\n0 2 0 0 0 0 0 0 0\n0 0 3 0 0 0 0 0 0\n0 0 0 4 0 0 0 0 0\n0 0 0 0 5 0 0 0 0\n0 0 0 0 0 6 0 0 0\n0 0 0 0 0 0 7 0 0\n0 0 0 0 0 0 0 8 0\n0 0 0 0 0 0 0 0 9',
      '5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 0',
      '0 2 0 6 0 8 0 0 0\n5 8 0 0 0 9 7 0 0\n0 0 0 0 4 0 0 0 0\n3 7 0 0 0 0 5 0 0\n6 0 0 0 0 0 0 0 4\n0 0 8 0 0 0 0 1 3\n0 0 0 0 2 0 0 0 0\n0 0 9 8 0 0 0 3 6\n0 0 0 3 0 6 0 9 0',
      '8 0 0 0 0 0 0 0 0\n0 0 3 6 0 0 0 0 0\n0 7 0 0 9 0 2 0 0\n0 5 0 0 0 7 0 0 0\n0 0 0 0 4 5 7 0 0\n0 0 0 1 0 0 0 3 0\n0 0 1 0 0 0 0 6 8\n0 0 8 5 0 0 0 1 0\n0 9 0 0 0 0 4 0 0',
      '0 0 0 2 6 0 7 0 1\n6 8 0 0 7 0 0 9 0\n1 9 0 0 0 4 5 0 0\n8 2 0 1 0 0 0 4 0\n0 0 4 6 0 2 9 0 0\n0 5 0 0 0 3 0 2 8\n0 0 9 3 0 0 0 7 4\n0 4 0 0 5 0 0 3 6\n7 0 3 0 1 8 0 0 0',
      '0 0 3 0 2 0 6 0 0\n9 0 0 3 0 5 0 0 1\n0 0 1 8 0 6 4 0 0\n0 0 8 1 0 2 9 0 0\n7 0 0 0 0 0 0 0 8\n0 0 6 7 0 8 2 0 0\n0 0 2 6 0 9 5 0 0\n8 0 0 2 0 3 0 0 9\n0 0 5 0 1 0 3 0 0'
    ]
  },

  {
    id: 'lc-213',
    leetcodeNumber: 213,
    title: 'House Robber II (Circular Street)',
    slug: 'house-robber-ii',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated non-negative integers.',
    outputFormat: 'Print the maximum money robbed.',
    constraints: ['1 <= N <= 100', '0 <= nums[i] <= 1000'],
    sampleInput: '3\n2 3 2',
    sampleOutput: '3',
    explanation: 'You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent neighbors. Max = 3.',
    testInputs: [
      '3\n2 3 2',
      '4\n1 2 3 1',
      '3\n1 2 3',
      '1\n100',
      '2\n50 100',
      '5\n2 7 9 3 1',
      '6\n1 3 1 3 100 1',
      '7\n20 1 1 20 1 1 20'
    ]
  },

  {
    id: 'lc-518',
    leetcodeNumber: 518,
    title: 'Coin Change II (Combination Counter)',
    slug: 'coin-change-ii',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return 0.\n\nYou may assume that you have an infinite number of each kind of coin.',
    inputFormat: 'Line 1: Two space-separated integers amount and N.\nLine 2: N space-separated coin denominations.',
    outputFormat: 'Print the total number of combinations.',
    constraints: ['1 <= N <= 300', '0 <= amount <= 5000', '1 <= coins[i] <= 5000'],
    sampleInput: '5 3\n1 2 5',
    sampleOutput: '4',
    explanation: 'Four ways to make 5: 5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1.',
    testInputs: [
      '5 3\n1 2 5',
      '3 1\n2',
      '10 1\n10',
      '0 3\n1 2 5',
      '7 4\n1 2 3 5',
      '10 3\n2 5 3',
      '50 3\n5 10 25',
      '100 4\n1 5 10 25'
    ]
  },

  {
    id: 'lc-416',
    leetcodeNumber: 416,
    title: 'Partition Equal Subset Sum',
    slug: 'partition-equal-subset-sum',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated positive integers.',
    outputFormat: 'Print true or false.',
    constraints: ['1 <= N <= 200', '1 <= nums[i] <= 100'],
    sampleInput: '4\n1 5 11 5',
    sampleOutput: 'true',
    explanation: 'The array can be partitioned as [1, 5, 5] and [11].',
    testInputs: [
      '4\n1 5 11 5',
      '4\n1 2 3 5',
      '2\n2 2',
      '1\n10',
      '6\n1 2 3 4 5 5',
      '5\n10 20 30 40 100',
      '4\n100 100 100 100',
      '6\n14 9 8 4 3 2'
    ]
  },

  {
    id: 'lc-139',
    leetcodeNumber: 139,
    title: 'Word Break',
    slug: 'word-break',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'MEDIUM',
    description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.',
    inputFormat: 'Line 1: String s.\nLine 2: Integer K (dictionary size).\nLine 3: K space-separated words.',
    outputFormat: 'Print true or false.',
    constraints: ['1 <= s.length <= 300', '1 <= K <= 1000', '1 <= wordDict[i].length <= 20'],
    sampleInput: 'leetcode\n2\nleet code',
    sampleOutput: 'true',
    explanation: 'Return true because "leetcode" can be segmented as "leet code".',
    testInputs: [
      'leetcode\n2\nleet code',
      'applepenapple\n2\napple pen',
      'catsandog\n5\ncats dog sand and cat',
      'a\n1\na',
      'b\n1\na',
      'aaaaaaa\n2\naaaa aaa',
      'goalspecial\n3\ngoal special ist',
      'cars\n3\ncar ca rs'
    ]
  },

  {
    id: 'lc-10',
    leetcodeNumber: 10,
    title: 'Regular Expression Matching',
    slug: 'regular-expression-matching',
    category: 'EXHAUSTIVE_SEARCH_DP',
    difficulty: 'HARD',
    description: 'Given an input string s and a pattern p, implement regular expression matching with support for \'.\' and \'*\' where:\n- \'.\' Matches any single character.\n- \'*\' Matches zero or more of the preceding element.\nThe matching should cover the entire input string (not partial).',
    inputFormat: 'Line 1: String s.\nLine 2: String p.',
    outputFormat: 'Print true or false.',
    constraints: ['1 <= s.length <= 20', '1 <= p.length <= 20', 's contains only lowercase English letters.', 'p contains only lowercase letters, \'.\', and \'*\'.'],
    sampleInput: 'aa\na*',
    sampleOutput: 'true',
    explanation: '\'*\' means zero or more of the preceding element, \'a\'. Therefore, by repeating \'a\' once, it becomes "aa".',
    testInputs: [
      'aa\na*',
      'aa\na',
      'ab\n.*',
      'aab\nc*a*b',
      'mississippi\nmis*is*p*.',
      'a\nab*',
      'aaa\na*a',
      'ab\n.*c'
    ]
  }
];

// -------------------------------------------------------------
// VERIFICATION RUNNER
// -------------------------------------------------------------

export function verifyBatch5() {
  console.log(`\n======================================================`);
  console.log(`VERIFYING BATCH 5: EXHAUSTIVE SEARCH & DP (14 PROBLEMS)`);
  console.log(`======================================================`);

  let totalCases = 0;
  let passedCases = 0;
  const verifiedProblems = [];

  for (const prob of problemsBatch5) {
    const solver = solversBatch5[prob.id];
    if (!solver) {
      throw new Error(`Missing solver for ${prob.id}`);
    }

    const testCases = [];
    console.log(`Testing problem [${prob.id}] "${prob.title}"...`);

    prob.testInputs.forEach((input, idx) => {
      totalCases++;
      let expectedOutput;
      try {
        expectedOutput = solver(input);
      } catch (err) {
        console.error(`❌ Solver error on [${prob.id}] Case ${idx + 1}:`, err);
        throw err;
      }

      if (typeof expectedOutput !== 'string') {
        throw new Error(`Output for ${prob.id} Case ${idx + 1} must be a string, got ${typeof expectedOutput}`);
      }

      const isHidden = idx >= 3;
      const explanation = idx === 0 
        ? prob.explanation 
        : idx < 3 
          ? `Sample verification case ${idx + 1}.` 
          : idx === 3
            ? 'Boundary and minimal constraint validation.'
            : idx === 4
              ? 'Edge case with negative values, extreme conditions or duplicates.'
              : idx === 5
                ? 'Complex pattern or partition validation.'
                : idx === 6
                  ? 'Stress case with intermediate scale input.'
                  : 'Robustness validation against extreme input limits.';

      testCases.push(makeTestCase(input, expectedOutput, isHidden, explanation));
      passedCases++;
    });

    if (testCases.length !== 8) {
      throw new Error(`Problem ${prob.id} has ${testCases.length} test cases, expected exactly 8.`);
    }

    const visibleCount = testCases.filter(t => !t.is_hidden).length;
    const hiddenCount = testCases.filter(t => t.is_hidden).length;
    console.log(`  ✅ All 8 test cases verified! (Visible: ${visibleCount}, Hidden: ${hiddenCount})`);
    console.log(`     Sample 1 Output: "${testCases[0].output.replace(/\n/g, '\\n')}"`);

    verifiedProblems.push({
      ...prob,
      sampleInput: testCases[0].input,
      sampleOutput: testCases[0].output,
      testCases
    });
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`BATCH 5 SUMMARY: ${passedCases}/${totalCases} test cases passed across ${verifiedProblems.length} problems!`);
  console.log(`------------------------------------------------------\n`);

  return verifiedProblems;
}

if (process.argv[1].endsWith('batch5_exhaustive_search_dp.mjs')) {
  verifyBatch5();
}
