import fs from 'fs';

// Helper for test case structure
export function makeTestCase(input, output, is_hidden = false, explanation = '') {
  return {
    input: input.trim(),
    output: output.trim(),
    is_hidden,
    explanation: explanation || (is_hidden ? 'Hidden evaluation test case.' : 'Sample test case validation.')
  };
}

// -------------------------------------------------------------
// REFERENCE SOLVERS FOR BATCH 1: POINTERS & ARRAYS (17 PROBLEMS)
// -------------------------------------------------------------

export const solversBatch1 = {
  // lc-16: 3Sum Closest
  'lc-16': (input) => {
    const lines = input.trim().split('\n');
    const [N, target] = lines[0].trim().split(/\s+/).map(Number);
    const nums = lines[1].trim().split(/\s+/).map(Number).sort((a, b) => a - b);
    let closest = nums[0] + nums[1] + nums[2];
    for (let i = 0; i < N - 2; i++) {
      let l = i + 1, r = N - 1;
      while (l < r) {
        const sum = nums[i] + nums[l] + nums[r];
        if (Math.abs(target - sum) < Math.abs(target - closest)) {
          closest = sum;
        }
        if (sum < target) l++;
        else if (sum > target) r--;
        else return String(target);
      }
    }
    return String(closest);
  },

  // lc-18: 4Sum
  'lc-18': (input) => {
    const lines = input.trim().split('\n');
    const [N, target] = lines[0].trim().split(/\s+/).map(Number);
    const nums = lines[1].trim().split(/\s+/).map(Number).sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < N - 3; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) continue;
      for (let j = i + 1; j < N - 2; j++) {
        if (j > i + 1 && nums[j] === nums[j - 1]) continue;
        let l = j + 1, r = N - 1;
        while (l < r) {
          const sum = nums[i] + nums[j] + nums[l] + nums[r];
          if (sum === target) {
            res.push([nums[i], nums[j], nums[l], nums[r]]);
            while (l < r && nums[l] === nums[l + 1]) l++;
            while (l < r && nums[r] === nums[r - 1]) r--;
            l++;
            r--;
          } else if (sum < target) {
            l++;
          } else {
            r--;
          }
        }
      }
    }
    if (res.length === 0) return '0';
    return `${res.length}\n` + res.map(quad => quad.join(' ')).join('\n');
  },

  // lc-31: Next Permutation
  'lc-31': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const nums = lines[1].trim().split(/\s+/).map(Number);
    let i = N - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
      let j = N - 1;
      while (nums[j] <= nums[i]) j--;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    let l = i + 1, r = N - 1;
    while (l < r) {
      [nums[l], nums[r]] = [nums[r], nums[l]];
      l++;
      r--;
    }
    return nums.join(' ');
  },

  // lc-41: First Missing Positive
  'lc-41': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const nums = lines[1].trim().split(/\s+/).map(Number);
    for (let i = 0; i < N; i++) {
      while (nums[i] > 0 && nums[i] <= N && nums[nums[i] - 1] !== nums[i]) {
        const correctIdx = nums[i] - 1;
        [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
      }
    }
    for (let i = 0; i < N; i++) {
      if (nums[i] !== i + 1) return String(i + 1);
    }
    return String(N + 1);
  },

  // lc-448: Find All Numbers Disappeared in an Array
  'lc-448': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const nums = lines[1].trim().split(/\s+/).map(Number);
    const set = new Set(nums);
    const missing = [];
    for (let i = 1; i <= N; i++) {
      if (!set.has(i)) missing.push(i);
    }
    return missing.length > 0 ? missing.join(' ') : 'NONE';
  },

  // lc-643: Maximum Average Subarray I
  'lc-643': (input) => {
    const lines = input.trim().split('\n');
    const [N, k] = lines[0].trim().split(/\s+/).map(Number);
    const nums = lines[1].trim().split(/\s+/).map(Number);
    let curr = 0;
    for (let i = 0; i < k; i++) curr += nums[i];
    let maxSum = curr;
    for (let i = k; i < N; i++) {
      curr += nums[i] - nums[i - k];
      if (curr > maxSum) maxSum = curr;
    }
    return (maxSum / k).toFixed(5);
  },

  // lc-424: Longest Repeating Character Replacement
  'lc-424': (input) => {
    const [s, kStr] = input.trim().split(/\s+/);
    const k = Number(kStr);
    const counts = {};
    let maxCount = 0;
    let l = 0;
    let maxLen = 0;
    for (let r = 0; r < s.length; r++) {
      counts[s[r]] = (counts[s[r]] || 0) + 1;
      maxCount = Math.max(maxCount, counts[s[r]]);
      if ((r - l + 1) - maxCount > k) {
        counts[s[l]]--;
        l++;
      }
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return String(maxLen);
  },

  // lc-567: Permutation in String
  'lc-567': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const s1 = lines[0];
    const s2 = lines[1];
    if (s1.length > s2.length) return 'false';
    const c1 = Array(26).fill(0);
    const c2 = Array(26).fill(0);
    const aCode = 'a'.charCodeAt(0);
    for (let i = 0; i < s1.length; i++) {
      c1[s1.charCodeAt(i) - aCode]++;
      c2[s2.charCodeAt(i) - aCode]++;
    }
    let matches = 0;
    for (let i = 0; i < 26; i++) {
      if (c1[i] === c2[i]) matches++;
    }
    for (let i = 0; i < s2.length - s1.length; i++) {
      if (matches === 26) return 'true';
      const rIdx = s2.charCodeAt(i + s1.length) - aCode;
      const lIdx = s2.charCodeAt(i) - aCode;
      
      c2[rIdx]++;
      if (c2[rIdx] === c1[rIdx]) matches++;
      else if (c2[rIdx] === c1[rIdx] + 1) matches--;

      c2[lIdx]--;
      if (c2[lIdx] === c1[lIdx]) matches++;
      else if (c2[lIdx] === c1[lIdx] - 1) matches--;
    }
    return matches === 26 ? 'true' : 'false';
  },

  // lc-438: Find All Anagrams in a String
  'lc-438': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const s = lines[0];
    const p = lines[1];
    if (s.length < p.length) return 'NONE';
    const pCount = Array(26).fill(0);
    const sCount = Array(26).fill(0);
    const aCode = 'a'.charCodeAt(0);
    for (let i = 0; i < p.length; i++) {
      pCount[p.charCodeAt(i) - aCode]++;
      sCount[s.charCodeAt(i) - aCode]++;
    }
    const res = [];
    const checkEqual = () => {
      for (let i = 0; i < 26; i++) {
        if (pCount[i] !== sCount[i]) return false;
      }
      return true;
    };
    if (checkEqual()) res.push(0);
    for (let i = p.length; i < s.length; i++) {
      sCount[s.charCodeAt(i) - aCode]++;
      sCount[s.charCodeAt(i - p.length) - aCode]--;
      if (checkEqual()) res.push(i - p.length + 1);
    }
    return res.length > 0 ? res.join(' ') : 'NONE';
  },

  // lc-1004: Max Consecutive Ones III
  'lc-1004': (input) => {
    const lines = input.trim().split('\n');
    const [N, k] = lines[0].trim().split(/\s+/).map(Number);
    const nums = lines[1].trim().split(/\s+/).map(Number);
    let l = 0, zeroes = 0, maxLen = 0;
    for (let r = 0; r < N; r++) {
      if (nums[r] === 0) zeroes++;
      while (zeroes > k) {
        if (nums[l] === 0) zeroes--;
        l++;
      }
      maxLen = Math.max(maxLen, r - l + 1);
    }
    return String(maxLen);
  },

  // lc-904: Fruit Into Baskets
  'lc-904': (input) => {
    const lines = input.trim().split('\n');
    const N = Number(lines[0].trim());
    const fruits = lines[1].trim().split(/\s+/).map(Number);
    const map = new Map();
    let l = 0, maxFruits = 0;
    for (let r = 0; r < N; r++) {
      map.set(fruits[r], (map.get(fruits[r]) || 0) + 1);
      while (map.size > 2) {
        map.set(fruits[l], map.get(fruits[l]) - 1);
        if (map.get(fruits[l]) === 0) map.delete(fruits[l]);
        l++;
      }
      maxFruits = Math.max(maxFruits, r - l + 1);
    }
    return String(maxFruits);
  },

  // lc-239: Sliding Window Maximum
  'lc-239': (input) => {
    const lines = input.trim().split('\n');
    const [N, k] = lines[0].trim().split(/\s+/).map(Number);
    const nums = lines[1].trim().split(/\s+/).map(Number);
    const deque = [];
    const res = [];
    for (let i = 0; i < N; i++) {
      if (deque.length > 0 && deque[0] === i - k) {
        deque.shift();
      }
      while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
        deque.pop();
      }
      deque.push(i);
      if (i >= k - 1) {
        res.push(nums[deque[0]]);
      }
    }
    return res.join(' ');
  },

  // lc-713: Subarray Product Less Than K
  'lc-713': (input) => {
    const lines = input.trim().split('\n');
    const [N, k] = lines[0].trim().split(/\s+/).map(Number);
    const nums = lines[1].trim().split(/\s+/).map(Number);
    if (k <= 1) return '0';
    let prod = 1, l = 0, count = 0;
    for (let r = 0; r < N; r++) {
      prod *= nums[r];
      while (prod >= k && l <= r) {
        prod /= nums[l];
        l++;
      }
      count += (r - l + 1);
    }
    return String(count);
  },

  // lc-1456: Maximum Number of Vowels in a Substring of Given Length
  'lc-1456': (input) => {
    const [s, kStr] = input.trim().split(/\s+/);
    const k = Number(kStr);
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    let count = 0;
    for (let i = 0; i < k; i++) {
      if (vowels.has(s[i])) count++;
    }
    let maxV = count;
    for (let i = k; i < s.length; i++) {
      if (vowels.has(s[i])) count++;
      if (vowels.has(s[i - k])) count--;
      if (count > maxV) maxV = count;
    }
    return String(maxV);
  },

  // lc-76: Minimum Window Substring
  'lc-76': (input) => {
    const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const s = lines[0];
    const t = lines[1];
    if (t.length > s.length) return '';
    const targetMap = {};
    for (const c of t) targetMap[c] = (targetMap[c] || 0) + 1;
    const required = Object.keys(targetMap).length;
    let formed = 0;
    const windowMap = {};
    let l = 0, r = 0;
    let minLen = Infinity, minStart = 0;
    while (r < s.length) {
      const c = s[r];
      windowMap[c] = (windowMap[c] || 0) + 1;
      if (targetMap[c] && windowMap[c] === targetMap[c]) {
        formed++;
      }
      while (l <= r && formed === required) {
        if (r - l + 1 < minLen) {
          minLen = r - l + 1;
          minStart = l;
        }
        const leftChar = s[l];
        windowMap[leftChar]--;
        if (targetMap[leftChar] && windowMap[leftChar] < targetMap[leftChar]) {
          formed--;
        }
        l++;
      }
      r++;
    }
    return minLen === Infinity ? '' : s.substring(minStart, minStart + minLen);
  },

  // lc-992: Subarrays with K Different Integers
  'lc-992': (input) => {
    const lines = input.trim().split('\n');
    const [N, k] = lines[0].trim().split(/\s+/).map(Number);
    const nums = lines[1].trim().split(/\s+/).map(Number);
    const atMost = (distinct) => {
      if (distinct <= 0) return 0;
      const map = new Map();
      let l = 0, ans = 0;
      for (let r = 0; r < N; r++) {
        map.set(nums[r], (map.get(nums[r]) || 0) + 1);
        while (map.size > distinct) {
          map.set(nums[l], map.get(nums[l]) - 1);
          if (map.get(nums[l]) === 0) map.delete(nums[l]);
          l++;
        }
        ans += (r - l + 1);
      }
      return ans;
    };
    return String(atMost(k) - atMost(k - 1));
  },

  // lc-187: Repeated DNA Sequences
  'lc-187': (input) => {
    const s = input.trim();
    if (s.length <= 10) return 'NONE';
    const counts = new Map();
    for (let i = 0; i <= s.length - 10; i++) {
      const sub = s.substring(i, i + 10);
      counts.set(sub, (counts.get(sub) || 0) + 1);
    }
    const repeated = [];
    for (const [sub, count] of counts.entries()) {
      if (count > 1) repeated.push(sub);
    }
    repeated.sort();
    return repeated.length > 0 ? repeated.join(' ') : 'NONE';
  }
};

// -------------------------------------------------------------
// METADATA & 8 TEST CASES FOR EACH PROBLEM
// -------------------------------------------------------------

export const problemsBatch1 = [
  {
    id: 'lc-16',
    leetcodeNumber: 16,
    title: '3Sum Closest',
    slug: '3sum-closest',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'Given an integer array nums of length N and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers.\n\nYou may assume that each input would have exactly one solution.',
    inputFormat: 'Line 1: Two space-separated integers N (size of array) and target.\nLine 2: N space-separated integers representing nums.',
    outputFormat: 'Print a single integer representing the sum of the three integers closest to target.',
    constraints: ['3 <= N <= 1000', '-1000 <= nums[i] <= 1000', '-10^4 <= target <= 10^4'],
    sampleInput: '4 1\n-1 2 1 -4',
    sampleOutput: '2',
    explanation: 'The sum that is closest to the target 1 is 2 (-1 + 2 + 1 = 2).',
    testInputs: [
      '4 1\n-1 2 1 -4',
      '3 1\n0 0 0',
      '5 10\n1 2 4 8 16',
      '3 -100\n1 1 1',
      '6 0\n-5 -2 -1 1 3 4',
      '5 100\n10 20 30 40 50',
      '7 7\n-3 -1 0 2 4 5 9',
      '8 -5\n-10 -7 -3 0 1 2 5 8'
    ]
  },

  {
    id: 'lc-18',
    leetcodeNumber: 18,
    title: '4Sum - Quadruplets Summing to Target',
    slug: '4sum',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'Given an array nums of N integers and an integer target, find all unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a, b, c, and d are distinct and nums[a] + nums[b] + nums[c] + nums[d] == target.\n\nPrint the total count of quadruplets on line 1, followed by each quadruplet on a new line with elements sorted ascending.',
    inputFormat: 'Line 1: Two space-separated integers N and target.\nLine 2: N space-separated integers.',
    outputFormat: 'Line 1: Integer K (number of unique quadruplets, or 0 if none exist).\nFollowing K lines: Four space-separated integers in ascending order.',
    constraints: ['1 <= N <= 200', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    sampleInput: '6 0\n1 0 -1 0 -2 2',
    sampleOutput: '3\n-2 -1 1 2\n-2 0 0 2\n-1 0 0 1',
    explanation: 'Three unique quadruplets sum to 0: [-2,-1,1,2], [-2,0,0,2], and [-1,0,0,1].',
    testInputs: [
      '6 0\n1 0 -1 0 -2 2',
      '5 8\n2 2 2 2 2',
      '4 0\n1 2 3 4',
      '4 10\n1 2 3 4',
      '8 0\n-3 -2 -1 0 0 1 2 3',
      '7 4\n-1 0 1 2 -1 -4 2',
      '6 100\n25 25 25 25 50 10',
      '8 -2\n-4 -3 -2 -1 0 1 2 3'
    ]
  },

  {
    id: 'lc-31',
    leetcodeNumber: 31,
    title: 'Next Permutation',
    slug: 'next-permutation',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Find the next lexicographically greater permutation of the given array. If such an arrangement is not possible, rearrange it to the lowest possible order (i.e., sorted in ascending order).',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print the N elements of the next permutation separated by a space.',
    constraints: ['1 <= N <= 10^5', '0 <= nums[i] <= 100'],
    sampleInput: '3\n1 2 3',
    sampleOutput: '1 3 2',
    explanation: 'The next lexicographical permutation of [1, 2, 3] is [1, 3, 2].',
    testInputs: [
      '3\n1 2 3',
      '3\n3 2 1',
      '3\n1 1 5',
      '1\n10',
      '5\n1 3 5 4 2',
      '6\n2 3 1 3 3 2',
      '4\n1 5 1 1',
      '7\n1 2 3 6 5 4 1'
    ]
  },

  {
    id: 'lc-41',
    leetcodeNumber: 41,
    title: 'First Missing Positive',
    slug: 'first-missing-positive',
    category: 'POINTERS_ARRAYS',
    difficulty: 'HARD',
    description: 'Given an unsorted integer array nums of size N, find the smallest positive integer that is not present in nums.\n\nYou must implement an algorithm that runs in O(N) time and uses O(1) auxiliary space.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print the smallest missing positive integer.',
    constraints: ['1 <= N <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
    sampleInput: '3\n1 2 0',
    sampleOutput: '3',
    explanation: 'The numbers 1 and 2 are present, so the smallest missing positive integer is 3.',
    testInputs: [
      '3\n1 2 0',
      '4\n3 4 -1 1',
      '5\n7 8 9 11 12',
      '1\n1',
      '1\n2',
      '6\n-1 -2 0 1 2 3',
      '5\n1 1 1 1 1',
      '6\n2 3 4 5 6 7'
    ]
  },

  {
    id: 'lc-448',
    leetcodeNumber: 448,
    title: 'Find All Numbers Disappeared in an Array',
    slug: 'find-all-numbers-disappeared-in-an-array',
    category: 'POINTERS_ARRAYS',
    difficulty: 'BASIC',
    description: 'Given an array nums of N integers where nums[i] is in the range [1, N], return an array of all the integers in the range [1, N] that do not appear in nums.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print space-separated missing integers in ascending order, or NONE if none are missing.',
    constraints: ['1 <= N <= 10^5', '1 <= nums[i] <= N'],
    sampleInput: '8\n4 3 2 7 8 2 3 1',
    sampleOutput: '5 6',
    explanation: 'The numbers 5 and 6 do not appear in the array.',
    testInputs: [
      '8\n4 3 2 7 8 2 3 1',
      '2\n1 1',
      '3\n1 2 3',
      '1\n1',
      '6\n2 2 2 2 2 2',
      '5\n5 4 3 2 1',
      '7\n1 3 3 5 5 7 7',
      '10\n10 2 5 10 9 1 1 4 3 7'
    ]
  },

  {
    id: 'lc-643',
    leetcodeNumber: 643,
    title: 'Maximum Average Subarray I',
    slug: 'maximum-average-subarray-i',
    category: 'POINTERS_ARRAYS',
    difficulty: 'BASIC',
    description: 'You are given an integer array nums of N elements and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value formatted to 5 decimal places.',
    inputFormat: 'Line 1: Two space-separated integers N and k.\nLine 2: N space-separated integers.',
    outputFormat: 'Print the maximum average value rounded to 5 decimal places.',
    constraints: ['1 <= k <= N <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    sampleInput: '6 4\n1 12 -5 -6 50 3',
    sampleOutput: '12.75000',
    explanation: 'Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75000.',
    testInputs: [
      '6 4\n1 12 -5 -6 50 3',
      '1 1\n5',
      '4 2\n0 4 0 3',
      '5 3\n-1 -2 -3 -4 -5',
      '5 5\n10 20 30 40 50',
      '6 2\n10 -10 20 -20 30 -30',
      '7 3\n7 4 5 8 8 3 9',
      '8 4\n-10 100 -20 200 -30 300 -40 400'
    ]
  },

  {
    id: 'lc-424',
    leetcodeNumber: 424,
    title: 'Longest Repeating Character Replacement',
    slug: 'longest-repeating-character-replacement',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'You are given a string s consisting of only uppercase English letters and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.',
    inputFormat: 'Line 1: String s and integer k separated by a space.',
    outputFormat: 'Print the length of the longest repeating character substring.',
    constraints: ['1 <= s.length <= 10^5', '0 <= k <= s.length', 's consists of only uppercase English letters.'],
    sampleInput: 'ABAB 2',
    sampleOutput: '4',
    explanation: 'Replace the two \'A\'s with \'B\'s or vice versa to get "BBBB" or "AAAA".',
    testInputs: [
      'ABAB 2',
      'AABABBA 1',
      'AAAA 2',
      'ABCD 0',
      'ABBB 2',
      'A 0',
      'BAAAB 2',
      'KAZXKKK 1'
    ]
  },

  {
    id: 'lc-567',
    leetcodeNumber: 567,
    title: 'Permutation in String',
    slug: 'permutation-in-string',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.\n\nIn other words, return true if one of s1\'s permutations is the substring of s2.',
    inputFormat: 'Line 1: String s1.\nLine 2: String s2.',
    outputFormat: 'Print true or false.',
    constraints: ['1 <= s1.length, s2.length <= 10^5', 's1 and s2 consist of lowercase English letters.'],
    sampleInput: 'ab\neidbaooo',
    sampleOutput: 'true',
    explanation: 's2 contains one permutation of s1 ("ba").',
    testInputs: [
      'ab\neidbaooo',
      'ab\neidboaoo',
      'abc\nbbbbca',
      'a\na',
      'hello\nooolleoooleh',
      'adc\ndcda',
      'xyz\nzyxwvutsrq',
      'ab\na'
    ]
  },

  {
    id: 'lc-438',
    leetcodeNumber: 438,
    title: 'Find All Anagrams in a String',
    slug: 'find-all-anagrams-in-a-string',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'Given two strings s and p, return an array of all the start indices of p\'s anagrams in s. You may return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    inputFormat: 'Line 1: String s.\nLine 2: String p.',
    outputFormat: 'Print space-separated start indices in ascending order, or NONE if no anagrams exist.',
    constraints: ['1 <= s.length, p.length <= 10^5', 's and p consist of lowercase English letters.'],
    sampleInput: 'cbaebabacd\nabc',
    sampleOutput: '0 6',
    explanation: 'The substring with start index = 0 is "cba", which is an anagram of "abc". The substring with start index = 6 is "bac", which is an anagram of "abc".',
    testInputs: [
      'cbaebabacd\nabc',
      'abab\nab',
      'aaaa\na',
      'hello\nworld',
      'aaabbb\nab',
      'abcdef\nabcdef',
      'af\nbe',
      'baa\naa'
    ]
  },

  {
    id: 'lc-1004',
    leetcodeNumber: 1004,
    title: 'Max Consecutive Ones III',
    slug: 'max-consecutive-ones-iii',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'Given a binary array nums of length N and an integer k, return the maximum number of consecutive 1\'s in the array if you can flip at most k 0\'s.',
    inputFormat: 'Line 1: Two space-separated integers N and k.\nLine 2: N space-separated binary digits (0 or 1).',
    outputFormat: 'Print the maximum number of consecutive 1\'s.',
    constraints: ['1 <= N <= 10^5', '0 <= k <= N', 'nums[i] is either 0 or 1.'],
    sampleInput: '11 2\n1 1 1 0 0 0 1 1 1 1 0',
    sampleOutput: '6',
    explanation: 'Flipping index 5 and 10 gives six consecutive 1\'s: [1, 1, 1, 1, 1, 1].',
    testInputs: [
      '11 2\n1 1 1 0 0 0 1 1 1 1 0',
      '19 3\n0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1',
      '5 0\n1 1 0 1 1',
      '5 5\n0 0 0 0 0',
      '1 0\n0',
      '1 1\n0',
      '6 1\n1 0 1 0 1 0',
      '10 2\n1 0 0 0 1 1 0 0 1 1'
    ]
  },

  {
    id: 'lc-904',
    leetcodeNumber: 904,
    title: 'Fruit Into Baskets',
    slug: 'fruit-into-baskets',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array fruits of size N where fruits[i] is the type of fruit the i-th tree produces.\n\nYou have only two baskets, and each basket can only hold a single type of fruit. There is no limit on the amount of fruit each basket can hold.\n\nStarting from any tree of your choice, you must pick exactly one fruit from every tree (including the start tree) while moving to the right. The picked fruits must fit in one of your baskets. If you reach a tree with fruit that cannot fit in your baskets, you must stop.\n\nReturn the maximum number of fruits you can pick.',
    inputFormat: 'Line 1: Integer N.\nLine 2: N space-separated integers.',
    outputFormat: 'Print a single integer representing the maximum fruits picked.',
    constraints: ['1 <= N <= 10^5', '0 <= fruits[i] < N'],
    sampleInput: '3\n1 2 1',
    sampleOutput: '3',
    explanation: 'We can pick from all 3 trees since there are only 2 distinct types: 1 and 2.',
    testInputs: [
      '3\n1 2 1',
      '4\n0 1 2 2',
      '5\n1 2 3 2 2',
      '1\n5',
      '6\n3 3 3 1 2 1 1 2 3 3 4',
      '6\n1 1 1 1 1 1',
      '8\n1 0 1 4 1 4 1 2 3',
      '6\n0 1 6 6 4 4'
    ]
  },

  {
    id: 'lc-239',
    leetcodeNumber: 239,
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    category: 'POINTERS_ARRAYS',
    difficulty: 'HARD',
    description: 'You are given an array of integers nums of size N, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window values separated by spaces.',
    inputFormat: 'Line 1: Two space-separated integers N and k.\nLine 2: N space-separated integers.',
    outputFormat: 'Print the maximum values for each window separated by spaces.',
    constraints: ['1 <= k <= N <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    sampleInput: '8 3\n1 3 -1 -3 5 3 6 7',
    sampleOutput: '3 3 5 5 6 7',
    explanation: 'Window [1 3 -1] -> 3, [3 -1 -3] -> 3, [-1 -3 5] -> 5, [-3 5 3] -> 5, [5 3 6] -> 6, [3 6 7] -> 7.',
    testInputs: [
      '8 3\n1 3 -1 -3 5 3 6 7',
      '1 1\n1',
      '4 2\n9 11 8 5 7 10',
      '5 5\n1 2 3 4 5',
      '6 3\n7 6 5 4 3 2',
      '6 2\n-7 -8 7 5 7 1',
      '4 3\n4 4 4 4',
      '7 4\n1 3 1 2 0 5 8'
    ]
  },

  {
    id: 'lc-713',
    leetcodeNumber: 713,
    title: 'Subarray Product Less Than K',
    slug: 'subarray-product-less-than-k',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'Given an array of integers nums of size N and an integer k, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than k.',
    inputFormat: 'Line 1: Two space-separated integers N and k.\nLine 2: N space-separated positive integers.',
    outputFormat: 'Print the number of valid contiguous subarrays.',
    constraints: ['1 <= N <= 10^5', '1 <= nums[i] <= 1000', '0 <= k <= 10^6'],
    sampleInput: '4 100\n10 5 2 6',
    sampleOutput: '8',
    explanation: 'The 8 subarrays with product < 100 are: [10], [5], [2], [6], [10, 5], [5, 2], [2, 6], [5, 2, 6].',
    testInputs: [
      '4 100\n10 5 2 6',
      '3 0\n1 2 3',
      '3 1\n1 1 1',
      '5 20\n1 2 3 4 5',
      '1 10\n5',
      '1 5\n10',
      '6 50\n2 3 4 1 5 2',
      '7 1000\n10 9 10 4 3 8 3'
    ]
  },

  {
    id: 'lc-1456',
    leetcodeNumber: 1456,
    title: 'Maximum Number of Vowels in a Substring of Given Length',
    slug: 'maximum-number-of-vowels-in-a-substring-of-given-length',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k.\n\nVowel letters in English are \'a\', \'e\', \'i\', \'o\', and \'u\'.',
    inputFormat: 'Line 1: String s and integer k separated by a space.',
    outputFormat: 'Print the maximum number of vowels.',
    constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters.', '1 <= k <= s.length'],
    sampleInput: 'abciiidef 3',
    sampleOutput: '3',
    explanation: 'The substring "iii" contains 3 vowel letters.',
    testInputs: [
      'abciiidef 3',
      'aeiou 2',
      'leetcode 3',
      'rhythms 4',
      'a 1',
      'ibpbhixepuaafnstapsqjqspnnferraqsqquqjea 6',
      'novowelsallowed 5',
      'tryhard 3'
    ]
  },

  {
    id: 'lc-76',
    leetcodeNumber: 76,
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    category: 'POINTERS_ARRAYS',
    difficulty: 'HARD',
    description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".',
    inputFormat: 'Line 1: String s.\nLine 2: String t.',
    outputFormat: 'Print the minimum window substring (or an empty line if no window exists).',
    constraints: ['1 <= s.length, t.length <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    sampleInput: 'ADOBECODEBANC\nABC',
    sampleOutput: 'BANC',
    explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.',
    testInputs: [
      'ADOBECODEBANC\nABC',
      'a\na',
      'a\naa',
      'AB\nA',
      'cabwefgewcwaefgcf\ncae',
      'AAAAAA\nAA',
      'XYZ\nABC',
      'DONUTSANDCOFFEE\nFEE'
    ]
  },

  {
    id: 'lc-992',
    leetcodeNumber: 992,
    title: 'Subarrays with K Different Integers',
    slug: 'subarrays-with-k-different-integers',
    category: 'POINTERS_ARRAYS',
    difficulty: 'HARD',
    description: 'Given an integer array nums of size N and an integer k, return the number of good subarrays of nums.\n\nA good array is an array where the number of different integers in that array is exactly k.',
    inputFormat: 'Line 1: Two space-separated integers N and k.\nLine 2: N space-separated integers.',
    outputFormat: 'Print the count of good subarrays.',
    constraints: ['1 <= k <= N <= 10^5', '1 <= nums[i] <= N'],
    sampleInput: '5 2\n1 2 1 2 3',
    sampleOutput: '7',
    explanation: 'Subarrays with exactly 2 distinct numbers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]. Total = 7.',
    testInputs: [
      '5 2\n1 2 1 2 3',
      '5 3\n1 2 1 3 4',
      '3 1\n1 1 1',
      '4 2\n1 2 1 3',
      '1 1\n1',
      '6 1\n2 2 2 2 2 2',
      '6 3\n1 2 3 1 2 3',
      '7 2\n1 2 2 1 3 3 1'
    ]
  },

  {
    id: 'lc-187',
    leetcodeNumber: 187,
    title: 'Repeated DNA Sequences',
    slug: 'repeated-dna-sequences',
    category: 'POINTERS_ARRAYS',
    difficulty: 'MEDIUM',
    description: 'The DNA sequence is composed of a series of nucleotides abbreviated as \'A\', \'C\', \'G\', and \'T\'.\n\nWhen studying DNA, it is useful to identify repeated sequences within the DNA. Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. Output the sequences in lexicographical order separated by spaces, or NONE if none occur more than once.',
    inputFormat: 'Line 1: String s (DNA sequence composed of A, C, G, T).',
    outputFormat: 'Print space-separated 10-letter sequences in lexicographical order, or NONE.',
    constraints: ['1 <= s.length <= 10^5', 's[i] is either \'A\', \'C\', \'G\', or \'T\'.'],
    sampleInput: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
    sampleOutput: 'AAAAACCCCC CCCCCAAAAA',
    explanation: 'The 10-letter sequences "AAAAACCCCC" and "CCCCCAAAAA" each appear twice in the string.',
    testInputs: [
      'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
      'AAAAAAAAAAAAA',
      'ACGTACGTAC',
      'AAAAAAAAAAA',
      'CCCCCCCCCCCCCCCCCCCC',
      'GAGAGAGAGAGAGAGAGAGA',
      'TGACGTACGTTGACGTACGT',
      'ACTG'
    ]
  }
];

// -------------------------------------------------------------
// VERIFICATION RUNNER
// -------------------------------------------------------------

export function verifyBatch1() {
  console.log(`\n======================================================`);
  console.log(`VERIFYING BATCH 1: POINTERS & ARRAYS (17 PROBLEMS)`);
  console.log(`======================================================`);

  let totalCases = 0;
  let passedCases = 0;
  const verifiedProblems = [];

  for (const prob of problemsBatch1) {
    const solver = solversBatch1[prob.id];
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

      // Check format
      if (typeof expectedOutput !== 'string') {
        throw new Error(`Output for ${prob.id} Case ${idx + 1} must be a string, got ${typeof expectedOutput}`);
      }

      const isHidden = idx >= 3; // First 3 are sample/visible, next 5 are hidden
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
  console.log(`BATCH 1 SUMMARY: ${passedCases}/${totalCases} test cases passed across ${verifiedProblems.length} problems!`);
  console.log(`------------------------------------------------------\n`);

  return verifiedProblems;
}

if (process.argv[1].endsWith('batch1_pointers_arrays.mjs')) {
  verifyBatch1();
}
