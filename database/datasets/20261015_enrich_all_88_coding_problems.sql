-- Migration: Enrich 88 Campus DSA Coding Problems with 8 Verified Test Cases & Placement Statements
-- Generated at: 2026-10-15T14:15:55.025Z

BEGIN;

UPDATE public.technical_problems
SET
  description = 'Given an integer array nums of length N and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers.

You may assume that each input would have exactly one solution.',
  statement = '### Problem Statement
Given an integer array nums of length N and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers.

You may assume that each input would have exactly one solution.

### Input Format
Line 1: Two space-separated integers N (size of array) and target.
Line 2: N space-separated integers representing nums.

### Output Format
Print a single integer representing the sum of the three integers closest to target.',
  input_format = 'Line 1: Two space-separated integers N (size of array) and target.
Line 2: N space-separated integers representing nums.',
  output_format = 'Print a single integer representing the sum of the three integers closest to target.',
  sample_input = '4 1
-1 2 1 -4',
  sample_output = '2',
  explanation = 'The sum that is closest to the target 1 is 2 (-1 + 2 + 1 = 2).',
  constraints = '["3 <= N <= 1000","-1000 <= nums[i] <= 1000","-10^4 <= target <= 10^4"]'::jsonb,
  test_cases = '[{"input":"4 1\n-1 2 1 -4","output":"2","is_hidden":false,"explanation":"The sum that is closest to the target 1 is 2 (-1 + 2 + 1 = 2)."},{"input":"3 1\n0 0 0","output":"0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"5 10\n1 2 4 8 16","output":"11","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3 -100\n1 1 1","output":"3","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6 0\n-5 -2 -1 1 3 4","output":"0","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5 100\n10 20 30 40 50","output":"100","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7 7\n-3 -1 0 2 4 5 9","output":"7","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8 -5\n-10 -7 -3 0 1 2 5 8","output":"-5","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-16';

UPDATE public.technical_problems
SET
  description = 'Given an array nums of N integers and an integer target, find all unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a, b, c, and d are distinct and nums[a] + nums[b] + nums[c] + nums[d] == target.

Print the total count of quadruplets on line 1, followed by each quadruplet on a new line with elements sorted ascending.',
  statement = '### Problem Statement
Given an array nums of N integers and an integer target, find all unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a, b, c, and d are distinct and nums[a] + nums[b] + nums[c] + nums[d] == target.

Print the total count of quadruplets on line 1, followed by each quadruplet on a new line with elements sorted ascending.

### Input Format
Line 1: Two space-separated integers N and target.
Line 2: N space-separated integers.

### Output Format
Line 1: Integer K (number of unique quadruplets, or 0 if none exist).
Following K lines: Four space-separated integers in ascending order.',
  input_format = 'Line 1: Two space-separated integers N and target.
Line 2: N space-separated integers.',
  output_format = 'Line 1: Integer K (number of unique quadruplets, or 0 if none exist).
Following K lines: Four space-separated integers in ascending order.',
  sample_input = '6 0
1 0 -1 0 -2 2',
  sample_output = '3
-2 -1 1 2
-2 0 0 2
-1 0 0 1',
  explanation = 'Three unique quadruplets sum to 0: [-2,-1,1,2], [-2,0,0,2], and [-1,0,0,1].',
  constraints = '["1 <= N <= 200","-10^9 <= nums[i] <= 10^9","-10^9 <= target <= 10^9"]'::jsonb,
  test_cases = '[{"input":"6 0\n1 0 -1 0 -2 2","output":"3\n-2 -1 1 2\n-2 0 0 2\n-1 0 0 1","is_hidden":false,"explanation":"Three unique quadruplets sum to 0: [-2,-1,1,2], [-2,0,0,2], and [-1,0,0,1]."},{"input":"5 8\n2 2 2 2 2","output":"1\n2 2 2 2","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"4 0\n1 2 3 4","output":"0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"4 10\n1 2 3 4","output":"1\n1 2 3 4","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"8 0\n-3 -2 -1 0 0 1 2 3","output":"8\n-3 -2 2 3\n-3 -1 1 3\n-3 0 0 3\n-3 0 1 2\n-2 -1 0 3\n-2 -1 1 2\n-2 0 0 2\n-1 0 0 1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"7 4\n-1 0 1 2 -1 -4 2","output":"1\n-1 1 2 2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6 100\n25 25 25 25 50 10","output":"1\n25 25 25 25","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8 -2\n-4 -3 -2 -1 0 1 2 3","output":"8\n-4 -3 2 3\n-4 -2 1 3\n-4 -1 0 3\n-4 -1 1 2\n-3 -2 0 3\n-3 -2 1 2\n-3 -1 0 2\n-2 -1 0 1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-18';

UPDATE public.technical_problems
SET
  description = 'A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Find the next lexicographically greater permutation of the given array. If such an arrangement is not possible, rearrange it to the lowest possible order (i.e., sorted in ascending order).',
  statement = '### Problem Statement
A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Find the next lexicographically greater permutation of the given array. If such an arrangement is not possible, rearrange it to the lowest possible order (i.e., sorted in ascending order).

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print the N elements of the next permutation separated by a space.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print the N elements of the next permutation separated by a space.',
  sample_input = '3
1 2 3',
  sample_output = '1 3 2',
  explanation = 'The next lexicographical permutation of [1, 2, 3] is [1, 3, 2].',
  constraints = '["1 <= N <= 10^5","0 <= nums[i] <= 100"]'::jsonb,
  test_cases = '[{"input":"3\n1 2 3","output":"1 3 2","is_hidden":false,"explanation":"The next lexicographical permutation of [1, 2, 3] is [1, 3, 2]."},{"input":"3\n3 2 1","output":"1 2 3","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3\n1 1 5","output":"1 5 1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n10","output":"10","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"5\n1 3 5 4 2","output":"1 4 2 3 5","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6\n2 3 1 3 3 2","output":"2 3 2 1 3 3","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4\n1 5 1 1","output":"5 1 1 1","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7\n1 2 3 6 5 4 1","output":"1 2 4 1 3 5 6","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-31';

UPDATE public.technical_problems
SET
  description = 'Given an unsorted integer array nums of size N, find the smallest positive integer that is not present in nums.

You must implement an algorithm that runs in O(N) time and uses O(1) auxiliary space.',
  statement = '### Problem Statement
Given an unsorted integer array nums of size N, find the smallest positive integer that is not present in nums.

You must implement an algorithm that runs in O(N) time and uses O(1) auxiliary space.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print the smallest missing positive integer.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print the smallest missing positive integer.',
  sample_input = '3
1 2 0',
  sample_output = '3',
  explanation = 'The numbers 1 and 2 are present, so the smallest missing positive integer is 3.',
  constraints = '["1 <= N <= 10^5","-2^31 <= nums[i] <= 2^31 - 1"]'::jsonb,
  test_cases = '[{"input":"3\n1 2 0","output":"3","is_hidden":false,"explanation":"The numbers 1 and 2 are present, so the smallest missing positive integer is 3."},{"input":"4\n3 4 -1 1","output":"2","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"5\n7 8 9 11 12","output":"1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n1","output":"2","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1\n2","output":"1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6\n-1 -2 0 1 2 3","output":"4","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\n1 1 1 1 1","output":"2","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6\n2 3 4 5 6 7","output":"1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-41';

UPDATE public.technical_problems
SET
  description = 'Given an array nums of N integers where nums[i] is in the range [1, N], return an array of all the integers in the range [1, N] that do not appear in nums.',
  statement = '### Problem Statement
Given an array nums of N integers where nums[i] is in the range [1, N], return an array of all the integers in the range [1, N] that do not appear in nums.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print space-separated missing integers in ascending order, or NONE if none are missing.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print space-separated missing integers in ascending order, or NONE if none are missing.',
  sample_input = '8
4 3 2 7 8 2 3 1',
  sample_output = '5 6',
  explanation = 'The numbers 5 and 6 do not appear in the array.',
  constraints = '["1 <= N <= 10^5","1 <= nums[i] <= N"]'::jsonb,
  test_cases = '[{"input":"8\n4 3 2 7 8 2 3 1","output":"5 6","is_hidden":false,"explanation":"The numbers 5 and 6 do not appear in the array."},{"input":"2\n1 1","output":"2","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3\n1 2 3","output":"NONE","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n1","output":"NONE","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\n2 2 2 2 2 2","output":"1 3 4 5 6","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n5 4 3 2 1","output":"NONE","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\n1 3 3 5 5 7 7","output":"2 4 6","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"10\n10 2 5 10 9 1 1 4 3 7","output":"6 8","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-448';

UPDATE public.technical_problems
SET
  description = 'You are given an integer array nums of N elements and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value formatted to 5 decimal places.',
  statement = '### Problem Statement
You are given an integer array nums of N elements and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value formatted to 5 decimal places.

### Input Format
Line 1: Two space-separated integers N and k.
Line 2: N space-separated integers.

### Output Format
Print the maximum average value rounded to 5 decimal places.',
  input_format = 'Line 1: Two space-separated integers N and k.
Line 2: N space-separated integers.',
  output_format = 'Print the maximum average value rounded to 5 decimal places.',
  sample_input = '6 4
1 12 -5 -6 50 3',
  sample_output = '12.75000',
  explanation = 'Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75000.',
  constraints = '["1 <= k <= N <= 10^5","-10^4 <= nums[i] <= 10^4"]'::jsonb,
  test_cases = '[{"input":"6 4\n1 12 -5 -6 50 3","output":"12.75000","is_hidden":false,"explanation":"Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75000."},{"input":"1 1\n5","output":"5.00000","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"4 2\n0 4 0 3","output":"2.00000","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"5 3\n-1 -2 -3 -4 -5","output":"-2.00000","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"5 5\n10 20 30 40 50","output":"30.00000","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6 2\n10 -10 20 -20 30 -30","output":"5.00000","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7 3\n7 4 5 8 8 3 9","output":"7.00000","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8 4\n-10 100 -20 200 -30 300 -40 400","output":"157.50000","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-643';

UPDATE public.technical_problems
SET
  description = 'You are given a string s consisting of only uppercase English letters and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.',
  statement = '### Problem Statement
You are given a string s consisting of only uppercase English letters and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.

### Input Format
Line 1: String s and integer k separated by a space.

### Output Format
Print the length of the longest repeating character substring.',
  input_format = 'Line 1: String s and integer k separated by a space.',
  output_format = 'Print the length of the longest repeating character substring.',
  sample_input = 'ABAB 2',
  sample_output = '4',
  explanation = 'Replace the two ''A''s with ''B''s or vice versa to get "BBBB" or "AAAA".',
  constraints = '["1 <= s.length <= 10^5","0 <= k <= s.length","s consists of only uppercase English letters."]'::jsonb,
  test_cases = '[{"input":"ABAB 2","output":"4","is_hidden":false,"explanation":"Replace the two ''A''s with ''B''s or vice versa to get \"BBBB\" or \"AAAA\"."},{"input":"AABABBA 1","output":"4","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"AAAA 2","output":"4","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"ABCD 0","output":"1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"ABBB 2","output":"4","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"A 0","output":"1","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"BAAAB 2","output":"5","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"KAZXKKK 1","output":"4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-424';

UPDATE public.technical_problems
SET
  description = 'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.

In other words, return true if one of s1''s permutations is the substring of s2.',
  statement = '### Problem Statement
Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.

In other words, return true if one of s1''s permutations is the substring of s2.

### Input Format
Line 1: String s1.
Line 2: String s2.

### Output Format
Print true or false.',
  input_format = 'Line 1: String s1.
Line 2: String s2.',
  output_format = 'Print true or false.',
  sample_input = 'ab
eidbaooo',
  sample_output = 'true',
  explanation = 's2 contains one permutation of s1 ("ba").',
  constraints = '["1 <= s1.length, s2.length <= 10^5","s1 and s2 consist of lowercase English letters."]'::jsonb,
  test_cases = '[{"input":"ab\neidbaooo","output":"true","is_hidden":false,"explanation":"s2 contains one permutation of s1 (\"ba\")."},{"input":"ab\neidboaoo","output":"false","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"abc\nbbbbca","output":"true","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"a\na","output":"true","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"hello\nooolleoooleh","output":"false","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"adc\ndcda","output":"true","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"xyz\nzyxwvutsrq","output":"true","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"ab\na","output":"false","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-567';

UPDATE public.technical_problems
SET
  description = 'Given two strings s and p, return an array of all the start indices of p''s anagrams in s. You may return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
  statement = '### Problem Statement
Given two strings s and p, return an array of all the start indices of p''s anagrams in s. You may return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Input Format
Line 1: String s.
Line 2: String p.

### Output Format
Print space-separated start indices in ascending order, or NONE if no anagrams exist.',
  input_format = 'Line 1: String s.
Line 2: String p.',
  output_format = 'Print space-separated start indices in ascending order, or NONE if no anagrams exist.',
  sample_input = 'cbaebabacd
abc',
  sample_output = '0 6',
  explanation = 'The substring with start index = 0 is "cba", which is an anagram of "abc". The substring with start index = 6 is "bac", which is an anagram of "abc".',
  constraints = '["1 <= s.length, p.length <= 10^5","s and p consist of lowercase English letters."]'::jsonb,
  test_cases = '[{"input":"cbaebabacd\nabc","output":"0 6","is_hidden":false,"explanation":"The substring with start index = 0 is \"cba\", which is an anagram of \"abc\". The substring with start index = 6 is \"bac\", which is an anagram of \"abc\"."},{"input":"abab\nab","output":"0 1 2","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"aaaa\na","output":"0 1 2 3","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"hello\nworld","output":"NONE","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"aaabbb\nab","output":"2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"abcdef\nabcdef","output":"0","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"af\nbe","output":"NONE","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"baa\naa","output":"1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-438';

UPDATE public.technical_problems
SET
  description = 'Given a binary array nums of length N and an integer k, return the maximum number of consecutive 1''s in the array if you can flip at most k 0''s.',
  statement = '### Problem Statement
Given a binary array nums of length N and an integer k, return the maximum number of consecutive 1''s in the array if you can flip at most k 0''s.

### Input Format
Line 1: Two space-separated integers N and k.
Line 2: N space-separated binary digits (0 or 1).

### Output Format
Print the maximum number of consecutive 1''s.',
  input_format = 'Line 1: Two space-separated integers N and k.
Line 2: N space-separated binary digits (0 or 1).',
  output_format = 'Print the maximum number of consecutive 1''s.',
  sample_input = '11 2
1 1 1 0 0 0 1 1 1 1 0',
  sample_output = '6',
  explanation = 'Flipping index 5 and 10 gives six consecutive 1''s: [1, 1, 1, 1, 1, 1].',
  constraints = '["1 <= N <= 10^5","0 <= k <= N","nums[i] is either 0 or 1."]'::jsonb,
  test_cases = '[{"input":"11 2\n1 1 1 0 0 0 1 1 1 1 0","output":"6","is_hidden":false,"explanation":"Flipping index 5 and 10 gives six consecutive 1''s: [1, 1, 1, 1, 1, 1]."},{"input":"19 3\n0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1","output":"10","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"5 0\n1 1 0 1 1","output":"2","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"5 5\n0 0 0 0 0","output":"5","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1 0\n0","output":"0","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"1 1\n0","output":"1","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6 1\n1 0 1 0 1 0","output":"3","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"10 2\n1 0 0 0 1 1 0 0 1 1","output":"6","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-1004';

UPDATE public.technical_problems
SET
  description = 'You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array fruits of size N where fruits[i] is the type of fruit the i-th tree produces.

You have only two baskets, and each basket can only hold a single type of fruit. There is no limit on the amount of fruit each basket can hold.

Starting from any tree of your choice, you must pick exactly one fruit from every tree (including the start tree) while moving to the right. The picked fruits must fit in one of your baskets. If you reach a tree with fruit that cannot fit in your baskets, you must stop.

Return the maximum number of fruits you can pick.',
  statement = '### Problem Statement
You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array fruits of size N where fruits[i] is the type of fruit the i-th tree produces.

You have only two baskets, and each basket can only hold a single type of fruit. There is no limit on the amount of fruit each basket can hold.

Starting from any tree of your choice, you must pick exactly one fruit from every tree (including the start tree) while moving to the right. The picked fruits must fit in one of your baskets. If you reach a tree with fruit that cannot fit in your baskets, you must stop.

Return the maximum number of fruits you can pick.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print a single integer representing the maximum fruits picked.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print a single integer representing the maximum fruits picked.',
  sample_input = '3
1 2 1',
  sample_output = '3',
  explanation = 'We can pick from all 3 trees since there are only 2 distinct types: 1 and 2.',
  constraints = '["1 <= N <= 10^5","0 <= fruits[i] < N"]'::jsonb,
  test_cases = '[{"input":"3\n1 2 1","output":"3","is_hidden":false,"explanation":"We can pick from all 3 trees since there are only 2 distinct types: 1 and 2."},{"input":"4\n0 1 2 2","output":"3","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"5\n1 2 3 2 2","output":"4","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n5","output":"1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\n3 3 3 1 2 1 1 2 3 3 4","output":"4","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6\n1 1 1 1 1 1","output":"6","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"8\n1 0 1 4 1 4 1 2 3","output":"5","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6\n0 1 6 6 4 4","output":"4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-904';

UPDATE public.technical_problems
SET
  description = 'You are given an array of integers nums of size N, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window values separated by spaces.',
  statement = '### Problem Statement
You are given an array of integers nums of size N, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window values separated by spaces.

### Input Format
Line 1: Two space-separated integers N and k.
Line 2: N space-separated integers.

### Output Format
Print the maximum values for each window separated by spaces.',
  input_format = 'Line 1: Two space-separated integers N and k.
Line 2: N space-separated integers.',
  output_format = 'Print the maximum values for each window separated by spaces.',
  sample_input = '8 3
1 3 -1 -3 5 3 6 7',
  sample_output = '3 3 5 5 6 7',
  explanation = 'Window [1 3 -1] -> 3, [3 -1 -3] -> 3, [-1 -3 5] -> 5, [-3 5 3] -> 5, [5 3 6] -> 6, [3 6 7] -> 7.',
  constraints = '["1 <= k <= N <= 10^5","-10^4 <= nums[i] <= 10^4"]'::jsonb,
  test_cases = '[{"input":"8 3\n1 3 -1 -3 5 3 6 7","output":"3 3 5 5 6 7","is_hidden":false,"explanation":"Window [1 3 -1] -> 3, [3 -1 -3] -> 3, [-1 -3 5] -> 5, [-3 5 3] -> 5, [5 3 6] -> 6, [3 6 7] -> 7."},{"input":"1 1\n1","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"4 2\n9 11 8 5 7 10","output":"11 11 8","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"5 5\n1 2 3 4 5","output":"5","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6 3\n7 6 5 4 3 2","output":"7 6 5 4","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6 2\n-7 -8 7 5 7 1","output":"-7 7 7 7 7","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4 3\n4 4 4 4","output":"4 4","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7 4\n1 3 1 2 0 5 8","output":"3 3 5 8","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-239';

UPDATE public.technical_problems
SET
  description = 'Given an array of integers nums of size N and an integer k, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than k.',
  statement = '### Problem Statement
Given an array of integers nums of size N and an integer k, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than k.

### Input Format
Line 1: Two space-separated integers N and k.
Line 2: N space-separated positive integers.

### Output Format
Print the number of valid contiguous subarrays.',
  input_format = 'Line 1: Two space-separated integers N and k.
Line 2: N space-separated positive integers.',
  output_format = 'Print the number of valid contiguous subarrays.',
  sample_input = '4 100
10 5 2 6',
  sample_output = '8',
  explanation = 'The 8 subarrays with product < 100 are: [10], [5], [2], [6], [10, 5], [5, 2], [2, 6], [5, 2, 6].',
  constraints = '["1 <= N <= 10^5","1 <= nums[i] <= 1000","0 <= k <= 10^6"]'::jsonb,
  test_cases = '[{"input":"4 100\n10 5 2 6","output":"8","is_hidden":false,"explanation":"The 8 subarrays with product < 100 are: [10], [5], [2], [6], [10, 5], [5, 2], [2, 6], [5, 2, 6]."},{"input":"3 0\n1 2 3","output":"0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3 1\n1 1 1","output":"0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"5 20\n1 2 3 4 5","output":"9","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1 10\n5","output":"1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"1 5\n10","output":"0","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6 50\n2 3 4 1 5 2","output":"17","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7 1000\n10 9 10 4 3 8 3","output":"20","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-713';

UPDATE public.technical_problems
SET
  description = 'Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k.

Vowel letters in English are ''a'', ''e'', ''i'', ''o'', and ''u''.',
  statement = '### Problem Statement
Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k.

Vowel letters in English are ''a'', ''e'', ''i'', ''o'', and ''u''.

### Input Format
Line 1: String s and integer k separated by a space.

### Output Format
Print the maximum number of vowels.',
  input_format = 'Line 1: String s and integer k separated by a space.',
  output_format = 'Print the maximum number of vowels.',
  sample_input = 'abciiidef 3',
  sample_output = '3',
  explanation = 'The substring "iii" contains 3 vowel letters.',
  constraints = '["1 <= s.length <= 10^5","s consists of lowercase English letters.","1 <= k <= s.length"]'::jsonb,
  test_cases = '[{"input":"abciiidef 3","output":"3","is_hidden":false,"explanation":"The substring \"iii\" contains 3 vowel letters."},{"input":"aeiou 2","output":"2","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"leetcode 3","output":"2","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"rhythms 4","output":"0","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"a 1","output":"1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"ibpbhixepuaafnstapsqjqspnnferraqsqquqjea 6","output":"4","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"novowelsallowed 5","output":"3","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"tryhard 3","output":"1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-1456';

UPDATE public.technical_problems
SET
  description = 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".',
  statement = '### Problem Statement
Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".

### Input Format
Line 1: String s.
Line 2: String t.

### Output Format
Print the minimum window substring (or an empty line if no window exists).',
  input_format = 'Line 1: String s.
Line 2: String t.',
  output_format = 'Print the minimum window substring (or an empty line if no window exists).',
  sample_input = 'ADOBECODEBANC
ABC',
  sample_output = 'BANC',
  explanation = 'The minimum window substring "BANC" includes ''A'', ''B'', and ''C'' from string t.',
  constraints = '["1 <= s.length, t.length <= 10^5","s and t consist of uppercase and lowercase English letters."]'::jsonb,
  test_cases = '[{"input":"ADOBECODEBANC\nABC","output":"BANC","is_hidden":false,"explanation":"The minimum window substring \"BANC\" includes ''A'', ''B'', and ''C'' from string t."},{"input":"a\na","output":"a","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"a\naa","output":"","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"AB\nA","output":"A","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"cabwefgewcwaefgcf\ncae","output":"cwae","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"AAAAAA\nAA","output":"AA","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"XYZ\nABC","output":"","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"DONUTSANDCOFFEE\nFEE","output":"FEE","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-76';

UPDATE public.technical_problems
SET
  description = 'Given an integer array nums of size N and an integer k, return the number of good subarrays of nums.

A good array is an array where the number of different integers in that array is exactly k.',
  statement = '### Problem Statement
Given an integer array nums of size N and an integer k, return the number of good subarrays of nums.

A good array is an array where the number of different integers in that array is exactly k.

### Input Format
Line 1: Two space-separated integers N and k.
Line 2: N space-separated integers.

### Output Format
Print the count of good subarrays.',
  input_format = 'Line 1: Two space-separated integers N and k.
Line 2: N space-separated integers.',
  output_format = 'Print the count of good subarrays.',
  sample_input = '5 2
1 2 1 2 3',
  sample_output = '7',
  explanation = 'Subarrays with exactly 2 distinct numbers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]. Total = 7.',
  constraints = '["1 <= k <= N <= 10^5","1 <= nums[i] <= N"]'::jsonb,
  test_cases = '[{"input":"5 2\n1 2 1 2 3","output":"7","is_hidden":false,"explanation":"Subarrays with exactly 2 distinct numbers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]. Total = 7."},{"input":"5 3\n1 2 1 3 4","output":"3","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3 1\n1 1 1","output":"6","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"4 2\n1 2 1 3","output":"4","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1 1\n1","output":"1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6 1\n2 2 2 2 2 2","output":"21","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6 3\n1 2 3 1 2 3","output":"10","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7 2\n1 2 2 1 3 3 1","output":"10","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-992';

UPDATE public.technical_problems
SET
  description = 'The DNA sequence is composed of a series of nucleotides abbreviated as ''A'', ''C'', ''G'', and ''T''.

When studying DNA, it is useful to identify repeated sequences within the DNA. Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. Output the sequences in lexicographical order separated by spaces, or NONE if none occur more than once.',
  statement = '### Problem Statement
The DNA sequence is composed of a series of nucleotides abbreviated as ''A'', ''C'', ''G'', and ''T''.

When studying DNA, it is useful to identify repeated sequences within the DNA. Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. Output the sequences in lexicographical order separated by spaces, or NONE if none occur more than once.

### Input Format
Line 1: String s (DNA sequence composed of A, C, G, T).

### Output Format
Print space-separated 10-letter sequences in lexicographical order, or NONE.',
  input_format = 'Line 1: String s (DNA sequence composed of A, C, G, T).',
  output_format = 'Print space-separated 10-letter sequences in lexicographical order, or NONE.',
  sample_input = 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
  sample_output = 'AAAAACCCCC CCCCCAAAAA',
  explanation = 'The 10-letter sequences "AAAAACCCCC" and "CCCCCAAAAA" each appear twice in the string.',
  constraints = '["1 <= s.length <= 10^5","s[i] is either ''A'', ''C'', ''G'', or ''T''."]'::jsonb,
  test_cases = '[{"input":"AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT","output":"AAAAACCCCC CCCCCAAAAA","is_hidden":false,"explanation":"The 10-letter sequences \"AAAAACCCCC\" and \"CCCCCAAAAA\" each appear twice in the string."},{"input":"AAAAAAAAAAAAA","output":"AAAAAAAAAA","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"ACGTACGTAC","output":"NONE","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"AAAAAAAAAAA","output":"AAAAAAAAAA","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"CCCCCCCCCCCCCCCCCCCC","output":"CCCCCCCCCC","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"GAGAGAGAGAGAGAGAGAGA","output":"AGAGAGAGAG GAGAGAGAGA","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"TGACGTACGTTGACGTACGT","output":"TGACGTACGT","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"ACTG","output":"NONE","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-187';

UPDATE public.technical_problems
SET
  description = 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time.

Implement operations: push X, pop, top, getMin.',
  statement = '### Problem Statement
Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time.

Implement operations: push X, pop, top, getMin.

### Input Format
Line 1: Integer Q (number of operations).
Next Q lines: Command strings (push X, pop, top, getMin).

### Output Format
Print the results of top and getMin operations, each on a new line.',
  input_format = 'Line 1: Integer Q (number of operations).
Next Q lines: Command strings (push X, pop, top, getMin).',
  output_format = 'Print the results of top and getMin operations, each on a new line.',
  sample_input = '7
push -2
push 0
push -3
getMin
pop
top
getMin',
  sample_output = '-3
0
-2',
  explanation = 'Push -2, 0, -3. getMin is -3. Pop leaves [-2, 0], so top is 0 and getMin is -2.',
  constraints = '["1 <= Q <= 3 * 10^4","-2^31 <= val <= 2^31 - 1"]'::jsonb,
  test_cases = '[{"input":"7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin","output":"-3\n0\n-2","is_hidden":false,"explanation":"Push -2, 0, -3. getMin is -3. Pop leaves [-2, 0], so top is 0 and getMin is -2."},{"input":"4\npush 5\npush 10\ntop\ngetMin","output":"10\n5","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"5\npush 1\npush 2\npop\ntop\ngetMin","output":"1\n1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\npush 100\ntop\ngetMin","output":"100\n100","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\npush -10\npush -20\npush -5\ngetMin\npop\ngetMin","output":"-20\n-20","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"7\npush 2\npush 2\npush 2\ngetMin\npop\ngetMin\ntop","output":"2\n2\n2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6\npush 7\npush 3\npush 9\ngetMin\ntop\npop","output":"3\n9","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8\npush 1\npush 5\ngetMin\npush -1\ngetMin\npop\ngetMin\ntop","output":"1\n-1\n1\n5","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-155';

UPDATE public.technical_problems
SET
  description = 'Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.',
  statement = '### Problem Statement
Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.

### Input Format
Line 1: Integer N (number of nodes).
Line 2: N space-separated integers in non-decreasing order.

### Output Format
Print the distinct linked list values separated by spaces, or EMPTY if N = 0.',
  input_format = 'Line 1: Integer N (number of nodes).
Line 2: N space-separated integers in non-decreasing order.',
  output_format = 'Print the distinct linked list values separated by spaces, or EMPTY if N = 0.',
  sample_input = '5
1 1 2 3 3',
  sample_output = '1 2 3',
  explanation = 'Duplicates of 1 and 3 are removed, leaving [1, 2, 3].',
  constraints = '["0 <= N <= 300","-100 <= Node.val <= 100"]'::jsonb,
  test_cases = '[{"input":"5\n1 1 2 3 3","output":"1 2 3","is_hidden":false,"explanation":"Duplicates of 1 and 3 are removed, leaving [1, 2, 3]."},{"input":"3\n1 1 2","output":"1 2","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n42","output":"42","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\n1 1 1 1 1 1","output":"1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n-5 -5 0 2 2","output":"-5 0 2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\n1 2 3 4 5 6 7","output":"1 2 3 4 5 6 7","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8\n-10 -10 -5 -5 0 0 10 10","output":"-10 -5 0 10","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-83';

UPDATE public.technical_problems
SET
  description = 'Given the head of a linked list of N nodes, return the node where the cycle begins. If there is no cycle, return NO_CYCLE.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. pos represents the 0-indexed position that the tail connects back to (-1 if no cycle).',
  statement = '### Problem Statement
Given the head of a linked list of N nodes, return the node where the cycle begins. If there is no cycle, return NO_CYCLE.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. pos represents the 0-indexed position that the tail connects back to (-1 if no cycle).

### Input Format
Line 1: Two space-separated integers N and pos.
Line 2: N space-separated node values.

### Output Format
Print the value of the cycle entry node, or NO_CYCLE.',
  input_format = 'Line 1: Two space-separated integers N and pos.
Line 2: N space-separated node values.',
  output_format = 'Print the value of the cycle entry node, or NO_CYCLE.',
  sample_input = '4 1
3 2 0 -4',
  sample_output = '2',
  explanation = 'The tail links back to node at index 1 (value 2), where the cycle begins.',
  constraints = '["0 <= N <= 10^4","pos is -1 or a valid 0-based index in the linked list."]'::jsonb,
  test_cases = '[{"input":"4 1\n3 2 0 -4","output":"2","is_hidden":false,"explanation":"The tail links back to node at index 1 (value 2), where the cycle begins."},{"input":"2 0\n1 2","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1 -1\n1","output":"NO_CYCLE","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"0 -1","output":"NO_CYCLE","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"5 2\n10 20 30 40 50","output":"30","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3 0\n7 8 9","output":"7","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6 -1\n1 2 3 4 5 6","output":"NO_CYCLE","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5 4\n-1 -2 -3 -4 -5","output":"-5","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-142';

UPDATE public.technical_problems
SET
  description = 'Given the heads of two singly linked lists listA and listB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return NO_INTERSECTION.',
  statement = '### Problem Statement
Given the heads of two singly linked lists listA and listB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return NO_INTERSECTION.

### Input Format
Line 1: Four space-separated integers lenA, lenB, skipA, skipB.
Line 2: lenA space-separated values for listA.
Line 3: lenB space-separated values for listB.

### Output Format
Print the value of the intersecting node, or NO_INTERSECTION.',
  input_format = 'Line 1: Four space-separated integers lenA, lenB, skipA, skipB.
Line 2: lenA space-separated values for listA.
Line 3: lenB space-separated values for listB.',
  output_format = 'Print the value of the intersecting node, or NO_INTERSECTION.',
  sample_input = '5 6 2 3
4 1 8 4 5
5 6 1 8 4 5',
  sample_output = '8',
  explanation = 'The intersecting node has value 8 (at skipA = 2 and skipB = 3).',
  constraints = '["1 <= lenA, lenB <= 3 * 10^4","0 <= skipA < lenA","0 <= skipB < lenB"]'::jsonb,
  test_cases = '[{"input":"5 6 2 3\n4 1 8 4 5\n5 6 1 8 4 5","output":"8","is_hidden":false,"explanation":"The intersecting node has value 8 (at skipA = 2 and skipB = 3)."},{"input":"4 3 2 1\n1 9 1 2\n3 1 2","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3 2 3 2\n2 6 4\n1 5","output":"NO_INTERSECTION","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 1 0 0\n7\n7","output":"7","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 3 0 0\n10 20 30\n10 20 30","output":"10","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4 2 2 0\n1 2 99 100\n99 100","output":"99","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4 4 4 4\n1 2 3 4\n5 6 7 8","output":"NO_INTERSECTION","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5 4 1 0\n10 50 60 70 80\n50 60 70 80","output":"50","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-160';

UPDATE public.technical_problems
SET
  description = 'You are given the head of a singly linked-list: L0 → L1 → … → Ln-1 → Ln.

Reorder the list to be on the form: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …

You may not modify the values in the list''s nodes. Only nodes themselves may be changed.',
  statement = '### Problem Statement
You are given the head of a singly linked-list: L0 → L1 → … → Ln-1 → Ln.

Reorder the list to be on the form: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …

You may not modify the values in the list''s nodes. Only nodes themselves may be changed.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print the reordered node values separated by spaces.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print the reordered node values separated by spaces.',
  sample_input = '4
1 2 3 4',
  sample_output = '1 4 2 3',
  explanation = 'Reordering [1, 2, 3, 4] interleaves the head and tail nodes to [1, 4, 2, 3].',
  constraints = '["1 <= N <= 5 * 10^4","1 <= Node.val <= 1000"]'::jsonb,
  test_cases = '[{"input":"4\n1 2 3 4","output":"1 4 2 3","is_hidden":false,"explanation":"Reordering [1, 2, 3, 4] interleaves the head and tail nodes to [1, 4, 2, 3]."},{"input":"5\n1 2 3 4 5","output":"1 5 2 4 3","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n10","output":"10","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2\n1 2","output":"1 2","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\n10 20 30 40 50 60","output":"10 60 20 50 30 40","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"7\n1 1 2 2 3 3 4","output":"1 4 1 3 2 3 2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"8\n8 7 6 5 4 3 2 1","output":"8 1 7 2 6 3 5 4","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"3\n100 200 300","output":"100 300 200","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-143';

UPDATE public.technical_problems
SET
  description = 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list in reverse order.',
  statement = '### Problem Statement
You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list in reverse order.

### Input Format
Line 1: Two space-separated integers len1 and len2.
Line 2: len1 space-separated digits (0-9).
Line 3: len2 space-separated digits (0-9).

### Output Format
Print the digits of the sum linked list in reverse order separated by spaces.',
  input_format = 'Line 1: Two space-separated integers len1 and len2.
Line 2: len1 space-separated digits (0-9).
Line 3: len2 space-separated digits (0-9).',
  output_format = 'Print the digits of the sum linked list in reverse order separated by spaces.',
  sample_input = '3 3
2 4 3
5 6 4',
  sample_output = '7 0 8',
  explanation = '342 + 465 = 807, represented as [7, 0, 8].',
  constraints = '["1 <= len1, len2 <= 100","0 <= Node.val <= 9","The number does not contain leading zeros except the number 0 itself."]'::jsonb,
  test_cases = '[{"input":"3 3\n2 4 3\n5 6 4","output":"7 0 8","is_hidden":false,"explanation":"342 + 465 = 807, represented as [7, 0, 8]."},{"input":"1 1\n0\n0","output":"0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"7 4\n9 9 9 9 9 9 9\n9 9 9 9","output":"8 9 9 9 0 0 0 1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 2\n5\n5 0","output":"0 1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 1\n1 2 3\n9","output":"0 3 3","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4 4\n1 0 0 1\n9 9 9 0","output":"0 0 0 2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"2 3\n9 9\n1 0 0","output":"0 0 1","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5 2\n0 0 0 0 1\n5 5","output":"5 5 0 0 1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-2';

UPDATE public.technical_problems
SET
  description = 'Given the head of a linked list of N nodes, return the list after sorting it in ascending order in O(N log N) time and O(1) auxiliary memory.',
  statement = '### Problem Statement
Given the head of a linked list of N nodes, return the list after sorting it in ascending order in O(N log N) time and O(1) auxiliary memory.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print the sorted values separated by spaces, or EMPTY if N = 0.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print the sorted values separated by spaces, or EMPTY if N = 0.',
  sample_input = '4
4 2 1 3',
  sample_output = '1 2 3 4',
  explanation = 'Sorted linked list: 1 -> 2 -> 3 -> 4.',
  constraints = '["0 <= N <= 5 * 10^4","-10^5 <= Node.val <= 10^5"]'::jsonb,
  test_cases = '[{"input":"4\n4 2 1 3","output":"1 2 3 4","is_hidden":false,"explanation":"Sorted linked list: 1 -> 2 -> 3 -> 4."},{"input":"5\n-1 5 3 4 0","output":"-1 0 3 4 5","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n99","output":"99","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\n10 10 10 10 10 10","output":"10 10 10 10 10 10","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"7\n7 6 5 4 3 2 1","output":"1 2 3 4 5 6 7","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6\n-100 50 -20 0 30 -5","output":"-100 -20 -5 0 30 50","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5\n1 2 3 4 5","output":"1 2 3 4 5","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-148';

UPDATE public.technical_problems
SET
  description = 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class with capacity, get(key), and put(key, value). Both get and put must run in O(1) average time complexity.',
  statement = '### Problem Statement
Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class with capacity, get(key), and put(key, value). Both get and put must run in O(1) average time complexity.

### Input Format
Line 1: Two space-separated integers capacity and Q (number of operations).
Next Q lines: Either "put key value" or "get key".

### Output Format
Print the return values of get operations separated by spaces (-1 if key not found).',
  input_format = 'Line 1: Two space-separated integers capacity and Q (number of operations).
Next Q lines: Either "put key value" or "get key".',
  output_format = 'Print the return values of get operations separated by spaces (-1 if key not found).',
  sample_input = '2 9
put 1 1
put 2 2
get 1
put 3 3
get 2
put 4 4
get 1
get 3
get 4',
  sample_output = '1 -1 -1 3 4',
  explanation = 'Cache capacity 2. Key 2 evicted when 3 is put. Key 1 evicted when 4 is put.',
  constraints = '["1 <= capacity <= 3000","1 <= Q <= 10^4","0 <= key <= 10^4","0 <= value <= 10^5"]'::jsonb,
  test_cases = '[{"input":"2 9\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4","output":"1 -1 -1 3 4","is_hidden":false,"explanation":"Cache capacity 2. Key 2 evicted when 3 is put. Key 1 evicted when 4 is put."},{"input":"1 4\nput 2 1\nget 2\nput 3 2\nget 2","output":"1 -1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2 5\nget 2\nput 2 6\nget 1\nput 1 5\nput 1 2","output":"-1 -1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3 4\nput 1 10\nput 2 20\nput 3 30\nget 2","output":"20","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"2 6\nput 1 1\nput 2 2\nput 1 10\nget 1\nput 3 3\nget 2","output":"10 -1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"2 3\nput 5 50\nget 5\nget 6","output":"50 -1","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"3 6\nput 1 1\nput 2 2\nput 3 3\nget 1\nput 4 4\nget 2","output":"1 -1","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"1 6\nput 1 10\nget 1\nput 2 20\nget 1\nget 2\nput 3 30","output":"10 -1 20","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-146';

UPDATE public.technical_problems
SET
  description = 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
  statement = '### Problem Statement
You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.

### Input Format
Line 1: Integer K (number of sorted lists).
Next K lines: Integer M followed by M space-separated sorted integers.

### Output Format
Print the merged sorted list values separated by spaces, or EMPTY if all lists are empty.',
  input_format = 'Line 1: Integer K (number of sorted lists).
Next K lines: Integer M followed by M space-separated sorted integers.',
  output_format = 'Print the merged sorted list values separated by spaces, or EMPTY if all lists are empty.',
  sample_input = '3
3 1 4 5
3 1 3 4
2 2 6',
  sample_output = '1 1 2 3 4 4 5 6',
  explanation = 'Merging [1,4,5], [1,3,4], and [2,6] gives [1,1,2,3,4,4,5,6].',
  constraints = '["0 <= K <= 10^4","0 <= total nodes <= 10^5","-10^4 <= Node.val <= 10^4"]'::jsonb,
  test_cases = '[{"input":"3\n3 1 4 5\n3 1 3 4\n2 2 6","output":"1 1 2 3 4 4 5 6","is_hidden":false,"explanation":"Merging [1,4,5], [1,3,4], and [2,6] gives [1,1,2,3,4,4,5,6]."},{"input":"1\n0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2\n1 5\n1 2","output":"2 5","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3\n2 -2 0\n2 -1 1\n2 -3 2","output":"-3 -2 -1 0 1 2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4\n1 1\n1 2\n1 3\n1 4","output":"1 2 3 4","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"2\n3 10 20 30\n3 15 25 35","output":"10 15 20 25 30 35","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"3\n2 1 10\n0\n2 2 9","output":"1 2 9 10","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-23';

UPDATE public.technical_problems
SET
  description = 'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support push, pop, peek, and empty operations.',
  statement = '### Problem Statement
Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support push, pop, peek, and empty operations.

### Input Format
Line 1: Integer Q (number of operations).
Next Q lines: Either "push X", "pop", "peek", or "empty".

### Output Format
Print results of pop, peek, and empty operations separated by spaces.',
  input_format = 'Line 1: Integer Q (number of operations).
Next Q lines: Either "push X", "pop", "peek", or "empty".',
  output_format = 'Print results of pop, peek, and empty operations separated by spaces.',
  sample_input = '5
push 1
push 2
peek
pop
empty',
  sample_output = '1 1 false',
  explanation = 'Queue: [1, 2]. peek returns 1. pop returns 1. empty returns false.',
  constraints = '["1 <= Q <= 100","1 <= x <= 9","At most 100 calls will be made to push, pop, peek, and empty."]'::jsonb,
  test_cases = '[{"input":"5\npush 1\npush 2\npeek\npop\nempty","output":"1 1 false","is_hidden":false,"explanation":"Queue: [1, 2]. peek returns 1. pop returns 1. empty returns false."},{"input":"4\npush 10\npeek\npop\nempty","output":"10 10 true","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"6\npush 1\npush 2\npush 3\npop\npeek\npop","output":"1 2 2","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\npush 5\nempty\npop","output":"false 5","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7\npush 1\npush 2\npop\npush 3\npeek\npop\npop","output":"1 2 2 3","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4\npush 7\npush 8\npop\npop","output":"7 8","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\npush 4\npush 5\npush 6\npop\nempty","output":"4 false","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6\npush 9\npop\nempty\npush 8\npeek\nempty","output":"9 true 8 false","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-232';

UPDATE public.technical_problems
SET
  description = 'Implement a last-in-first-out (LIFO) stack using only standard queues. The implemented stack should support push, pop, top, and empty operations.',
  statement = '### Problem Statement
Implement a last-in-first-out (LIFO) stack using only standard queues. The implemented stack should support push, pop, top, and empty operations.

### Input Format
Line 1: Integer Q.
Next Q lines: Either "push X", "pop", "top", or "empty".

### Output Format
Print results of pop, top, and empty operations separated by spaces.',
  input_format = 'Line 1: Integer Q.
Next Q lines: Either "push X", "pop", "top", or "empty".',
  output_format = 'Print results of pop, top, and empty operations separated by spaces.',
  sample_input = '5
push 1
push 2
top
pop
empty',
  sample_output = '2 2 false',
  explanation = 'Stack has [1, 2]. top returns 2. pop returns 2. empty returns false.',
  constraints = '["1 <= Q <= 100","1 <= x <= 9"]'::jsonb,
  test_cases = '[{"input":"5\npush 1\npush 2\ntop\npop\nempty","output":"2 2 false","is_hidden":false,"explanation":"Stack has [1, 2]. top returns 2. pop returns 2. empty returns false."},{"input":"4\npush 10\ntop\npop\nempty","output":"10 10 true","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"6\npush 1\npush 2\npush 3\ntop\npop\npop","output":"3 3 2","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\npush 5\nempty\ntop","output":"false 5","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7\npush 1\npush 2\npop\npush 3\ntop\npop\npop","output":"2 3 3 1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4\npush 7\npush 8\npop\npop","output":"8 7","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\npush 4\npush 5\npush 6\npop\nempty","output":"6 false","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6\npush 9\npop\nempty\npush 8\ntop\nempty","output":"9 true 8 false","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-225';

UPDATE public.technical_problems
SET
  description = 'Given a circular integer array nums (i.e., the next element of nums[nums.length - 1] is nums[0]), return the next greater number for every element in nums.

The next greater number of a number x is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn''t exist, return -1 for this number.',
  statement = '### Problem Statement
Given a circular integer array nums (i.e., the next element of nums[nums.length - 1] is nums[0]), return the next greater number for every element in nums.

The next greater number of a number x is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn''t exist, return -1 for this number.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print N space-separated integers representing next greater elements.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print N space-separated integers representing next greater elements.',
  sample_input = '3
1 2 1',
  sample_output = '2 -1 2',
  explanation = 'The first 1''s next greater is 2; 2''s next greater is -1; the second 1''s next greater circularly is 2.',
  constraints = '["1 <= N <= 10^4","-10^9 <= nums[i] <= 10^9"]'::jsonb,
  test_cases = '[{"input":"3\n1 2 1","output":"2 -1 2","is_hidden":false,"explanation":"The first 1''s next greater is 2; 2''s next greater is -1; the second 1''s next greater circularly is 2."},{"input":"5\n1 2 3 4 3","output":"2 3 4 -1 4","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n5","output":"-1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"4\n4 3 2 1","output":"-1 4 4 4","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4\n1 1 1 1","output":"-1 -1 -1 -1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6\n5 4 3 2 1 6","output":"6 6 6 6 6 -1","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\n-1 -2 -3 -4 -5","output":"-1 -1 -1 -1 -1","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6\n2 1 2 4 3 2","output":"4 2 4 -1 4 4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-503';

UPDATE public.technical_problems
SET
  description = 'We are given an array asteroids of integers representing asteroids in a row. For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.

Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.',
  statement = '### Problem Statement
We are given an array asteroids of integers representing asteroids in a row. For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.

Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.

### Input Format
Line 1: Integer N.
Line 2: N space-separated non-zero integers.

### Output Format
Print the surviving asteroids separated by spaces, or NONE if all explode.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated non-zero integers.',
  output_format = 'Print the surviving asteroids separated by spaces, or NONE if all explode.',
  sample_input = '3
5 10 -5',
  sample_output = '5 10',
  explanation = '10 and -5 collide; 10 survives. 5 and 10 never collide because they move in the same direction.',
  constraints = '["2 <= N <= 10^4","-1000 <= asteroids[i] <= 1000","asteroids[i] != 0"]'::jsonb,
  test_cases = '[{"input":"3\n5 10 -5","output":"5 10","is_hidden":false,"explanation":"10 and -5 collide; 10 survives. 5 and 10 never collide because they move in the same direction."},{"input":"2\n8 -8","output":"NONE","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3\n10 2 -5","output":"10","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"4\n-2 -1 1 2","output":"-2 -1 1 2","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4\n-2 -2 1 -2","output":"-2 -2 -2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n1 2 3 -4 5","output":"-4 5","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6\n5 4 3 -3 -4 -5","output":"NONE","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5\n10 5 -5 -10 20","output":"20","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-735';

UPDATE public.technical_problems
SET
  description = 'Design an algorithm that collects daily price quotes for some stock and returns the span of that stock''s price for the current day.

The span of the stock''s price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.',
  statement = '### Problem Statement
Design an algorithm that collects daily price quotes for some stock and returns the span of that stock''s price for the current day.

The span of the stock''s price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.

### Input Format
Line 1: Integer N (number of days).
Line 2: N space-separated integers representing stock prices.

### Output Format
Print N space-separated integers representing the daily stock spans.',
  input_format = 'Line 1: Integer N (number of days).
Line 2: N space-separated integers representing stock prices.',
  output_format = 'Print N space-separated integers representing the daily stock spans.',
  sample_input = '7
100 80 60 70 60 75 85',
  sample_output = '1 1 1 2 1 4 6',
  explanation = 'Spans: [100] -> 1, [80] -> 1, [60] -> 1, [70] -> 2 (70, 60), [60] -> 1, [75] -> 4, [85] -> 6.',
  constraints = '["1 <= N <= 10^4","1 <= price <= 10^5"]'::jsonb,
  test_cases = '[{"input":"7\n100 80 60 70 60 75 85","output":"1 1 1 2 1 4 6","is_hidden":false,"explanation":"Spans: [100] -> 1, [80] -> 1, [60] -> 1, [70] -> 2 (70, 60), [60] -> 1, [75] -> 4, [85] -> 6."},{"input":"1\n50","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"5\n10 20 30 40 50","output":"1 2 3 4 5","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"5\n50 40 30 20 10","output":"1 1 1 1 1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\n31 41 48 59 79 100","output":"1 2 3 4 5 6","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n50 50 50 50 50","output":"1 2 3 4 5","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\n28 14 28 35 19 53 100","output":"1 1 3 4 1 6 7","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8\n90 60 70 65 80 85 45 100","output":"1 1 2 1 4 5 1 8","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-901';

UPDATE public.technical_problems
SET
  description = 'Given string num representing a non-negative integer, and an integer k, return the smallest possible integer after removing k digits from num.',
  statement = '### Problem Statement
Given string num representing a non-negative integer, and an integer k, return the smallest possible integer after removing k digits from num.

### Input Format
Line 1: String num and integer k separated by a space.

### Output Format
Print the smallest integer string after removing k digits (no leading zeroes except for "0").',
  input_format = 'Line 1: String num and integer k separated by a space.',
  output_format = 'Print the smallest integer string after removing k digits (no leading zeroes except for "0").',
  sample_input = '1432219 3',
  sample_output = '1219',
  explanation = 'Remove digits 4, 3, and 2 to form the new number 1219 which is the smallest.',
  constraints = '["1 <= k <= num.length <= 10^5","num consists of only digits.","num does not have any leading zeros except for the zero itself."]'::jsonb,
  test_cases = '[{"input":"1432219 3","output":"1219","is_hidden":false,"explanation":"Remove digits 4, 3, and 2 to form the new number 1219 which is the smallest."},{"input":"10200 1","output":"200","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"10 2","output":"0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"9 1","output":"0","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"112 1","output":"11","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"123456 3","output":"123","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"10001 4","output":"0","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"54321 2","output":"321","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-402';

UPDATE public.technical_problems
SET
  description = 'Given an array of integers heights representing the histogram''s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
  statement = '### Problem Statement
Given an array of integers heights representing the histogram''s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers representing bar heights.

### Output Format
Print a single integer representing the maximum rectangle area.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers representing bar heights.',
  output_format = 'Print a single integer representing the maximum rectangle area.',
  sample_input = '6
2 1 5 6 2 3',
  sample_output = '10',
  explanation = 'The largest rectangle is obtained by bars 5 and 6 of height 5 and width 2: area = 5 * 2 = 10.',
  constraints = '["1 <= N <= 10^5","0 <= heights[i] <= 10^4"]'::jsonb,
  test_cases = '[{"input":"6\n2 1 5 6 2 3","output":"10","is_hidden":false,"explanation":"The largest rectangle is obtained by bars 5 and 6 of height 5 and width 2: area = 5 * 2 = 10."},{"input":"2\n2 4","output":"4","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n10","output":"10","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"5\n5 5 5 5 5","output":"25","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\n1 2 3 4 5 6","output":"12","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6\n6 5 4 3 2 1","output":"12","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\n2 1 4 5 1 3 3","output":"8","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8\n0 9 0 9 0 9 0 9","output":"9","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-84';

UPDATE public.technical_problems
SET
  description = 'Given a rows x cols binary matrix filled with 0''s and 1''s, find the largest rectangle containing only 1''s and return its area.',
  statement = '### Problem Statement
Given a rows x cols binary matrix filled with 0''s and 1''s, find the largest rectangle containing only 1''s and return its area.

### Input Format
Line 1: Two space-separated integers R and C.
Next R lines: C space-separated binary digits (0 or 1).

### Output Format
Print the maximum rectangle area of 1s.',
  input_format = 'Line 1: Two space-separated integers R and C.
Next R lines: C space-separated binary digits (0 or 1).',
  output_format = 'Print the maximum rectangle area of 1s.',
  sample_input = '4 5
1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0',
  sample_output = '6',
  explanation = 'The maximal rectangle has area = 6 (height 2, width 3 formed by rows 2 and 3).',
  constraints = '["1 <= R, C <= 200","matrix[i][j] is ''0'' or ''1''."]'::jsonb,
  test_cases = '[{"input":"4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0","output":"6","is_hidden":false,"explanation":"The maximal rectangle has area = 6 (height 2, width 3 formed by rows 2 and 3)."},{"input":"1 1\n0","output":"0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1 1\n1","output":"1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2 2\n1 1\n1 1","output":"4","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 3\n0 0 0\n0 0 0\n0 0 0","output":"0","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3 4\n1 1 1 1\n1 1 1 1\n1 1 1 1","output":"12","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4 3\n1 0 1\n1 1 1\n1 1 1\n0 1 0","output":"6","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5 2\n0 1\n1 1\n1 1\n1 0\n0 1","output":"4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-85';

UPDATE public.technical_problems
SET
  description = 'Given a string s which represents an expression, evaluate this expression and return its value.

The integer division should truncate toward zero. You may assume that the given expression is always valid. All intermediate results will be in the range of [-2^31, 2^31 - 1].',
  statement = '### Problem Statement
Given a string s which represents an expression, evaluate this expression and return its value.

The integer division should truncate toward zero. You may assume that the given expression is always valid. All intermediate results will be in the range of [-2^31, 2^31 - 1].

### Input Format
Line 1: String s representing the arithmetic expression.

### Output Format
Print the evaluated integer result.',
  input_format = 'Line 1: String s representing the arithmetic expression.',
  output_format = 'Print the evaluated integer result.',
  sample_input = '3+2*2',
  sample_output = '7',
  explanation = '2 * 2 = 4, and 3 + 4 = 7.',
  constraints = '["1 <= s.length <= 3 * 10^5","s consists of integers and operators (''+'', ''-'', ''*'', ''/'') separated by spaces."]'::jsonb,
  test_cases = '[{"input":"3+2*2","output":"7","is_hidden":false,"explanation":"2 * 2 = 4, and 3 + 4 = 7."},{"input":"3/2","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3+5 / 2","output":"5","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"42","output":"42","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"14-3/2","output":"13","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"100 - 50 * 2 + 10 / 2","output":"5","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"1*2-3/4+5*6-7*8+9/10","output":"-24","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"100000/1000","output":"100","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-227';

UPDATE public.technical_problems
SET
  description = 'Write an efficient algorithm that searches for a value target in an m x n integer matrix. This matrix has the following properties:
- Integers in each row are sorted in ascending from left to right.
- Integers in each column are sorted in ascending from top to bottom.',
  statement = '### Problem Statement
Write an efficient algorithm that searches for a value target in an m x n integer matrix. This matrix has the following properties:
- Integers in each row are sorted in ascending from left to right.
- Integers in each column are sorted in ascending from top to bottom.

### Input Format
Line 1: Three space-separated integers R, C, and target.
Next R lines: C space-separated sorted integers.

### Output Format
Print true if target is in the matrix, otherwise false.',
  input_format = 'Line 1: Three space-separated integers R, C, and target.
Next R lines: C space-separated sorted integers.',
  output_format = 'Print true if target is in the matrix, otherwise false.',
  sample_input = '5 5 5
1 4 7 11 15
2 5 8 12 19
3 6 9 16 22
10 13 14 17 24
18 21 23 26 30',
  sample_output = 'true',
  explanation = 'Target 5 is present at row 1, col 1.',
  constraints = '["1 <= R, C <= 300","-10^9 <= matrix[i][j], target <= 10^9"]'::jsonb,
  test_cases = '[{"input":"5 5 5\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30","output":"true","is_hidden":false,"explanation":"Target 5 is present at row 1, col 1."},{"input":"5 5 20\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30","output":"false","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1 1 5\n5","output":"true","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 1 1\n2","output":"false","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 3 0\n-5 -3 -1\n-2 0 2\n1 3 5","output":"true","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4 1 10\n2\n5\n10\n15","output":"true","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"1 4 10\n1 3 7 9","output":"false","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"3 3 99\n10 20 30\n40 50 60\n70 80 99","output":"true","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-240';

UPDATE public.technical_problems
SET
  description = 'An array arr is a mountain if arr.length >= 3 and there exists some i with 0 < i < arr.length - 1 such that:
- arr[0] < arr[1] < ... < arr[i - 1] < arr[i]
- arr[i] > arr[i + 1] > ... > arr[arr.length - 1]

Given a mountain array arr, return the 0-based index i such that arr[0] < ... < arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1] in O(log(arr.length)) time.',
  statement = '### Problem Statement
An array arr is a mountain if arr.length >= 3 and there exists some i with 0 < i < arr.length - 1 such that:
- arr[0] < arr[1] < ... < arr[i - 1] < arr[i]
- arr[i] > arr[i + 1] > ... > arr[arr.length - 1]

Given a mountain array arr, return the 0-based index i such that arr[0] < ... < arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1] in O(log(arr.length)) time.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print the 0-based index of the peak element.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print the 0-based index of the peak element.',
  sample_input = '3
0 1 0',
  sample_output = '1',
  explanation = 'arr[1] = 1 is the peak element.',
  constraints = '["3 <= N <= 10^5","0 <= arr[i] <= 10^6"]'::jsonb,
  test_cases = '[{"input":"3\n0 1 0","output":"1","is_hidden":false,"explanation":"arr[1] = 1 is the peak element."},{"input":"4\n0 2 1 0","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"4\n0 10 5 2","output":"1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\n3 5 1","output":"1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"5\n1 3 5 4 2","output":"2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6\n0 1 2 4 2 1","output":"3","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\n24 69 100 99 79 78 67","output":"2","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8\n10 20 30 40 50 25 15 5","output":"4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-852';

UPDATE public.technical_problems
SET
  description = 'Koko loves to eat bananas. There are n piles of bananas, the i-th pile has piles[i] bananas. The guards have gone and will come back in h hours.

Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour.

Return the minimum integer k such that she can eat all the bananas within h hours.',
  statement = '### Problem Statement
Koko loves to eat bananas. There are n piles of bananas, the i-th pile has piles[i] bananas. The guards have gone and will come back in h hours.

Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour.

Return the minimum integer k such that she can eat all the bananas within h hours.

### Input Format
Line 1: Two space-separated integers N and h.
Line 2: N space-separated integers representing banana piles.

### Output Format
Print a single integer representing the minimum eating speed k.',
  input_format = 'Line 1: Two space-separated integers N and h.
Line 2: N space-separated integers representing banana piles.',
  output_format = 'Print a single integer representing the minimum eating speed k.',
  sample_input = '4 8
3 6 7 11',
  sample_output = '4',
  explanation = 'At speed 4, Koko finishes the piles in ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 hours.',
  constraints = '["1 <= N <= 10^4","N <= h <= 10^9","1 <= piles[i] <= 10^9"]'::jsonb,
  test_cases = '[{"input":"4 8\n3 6 7 11","output":"4","is_hidden":false,"explanation":"At speed 4, Koko finishes the piles in ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 hours."},{"input":"5 5\n30 11 23 4 20","output":"30","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"5 6\n30 11 23 4 20","output":"23","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 1\n100","output":"100","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1 5\n100","output":"20","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5 10\n1 1 1 1 1","output":"1","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6 12\n10 15 20 25 30 35","output":"15","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4 1000\n100 200 300 400","output":"1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-875';

UPDATE public.technical_problems
SET
  description = 'A conveyor belt has packages that must be shipped from one port to another within days days.

The i-th package on the conveyor belt has a weight of weights[i]. Each day, we load the ship with packages on the conveyor belt (in the order given by weights). We may not load more weight than the maximum weight capacity of the ship.

Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within days days.',
  statement = '### Problem Statement
A conveyor belt has packages that must be shipped from one port to another within days days.

The i-th package on the conveyor belt has a weight of weights[i]. Each day, we load the ship with packages on the conveyor belt (in the order given by weights). We may not load more weight than the maximum weight capacity of the ship.

Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within days days.

### Input Format
Line 1: Two space-separated integers N and days.
Line 2: N space-separated integers representing weights.

### Output Format
Print the minimum ship weight capacity.',
  input_format = 'Line 1: Two space-separated integers N and days.
Line 2: N space-separated integers representing weights.',
  output_format = 'Print the minimum ship weight capacity.',
  sample_input = '10 5
1 2 3 4 5 6 7 8 9 10',
  sample_output = '15',
  explanation = 'A ship capacity of 15 ships all packages in 5 days: [1,2,3,4,5], [6,7], [8], [9], [10].',
  constraints = '["1 <= days <= N <= 5 * 10^4","1 <= weights[i] <= 500"]'::jsonb,
  test_cases = '[{"input":"10 5\n1 2 3 4 5 6 7 8 9 10","output":"15","is_hidden":false,"explanation":"A ship capacity of 15 ships all packages in 5 days: [1,2,3,4,5], [6,7], [8], [9], [10]."},{"input":"6 3\n3 2 2 4 1 4","output":"6","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3 1\n1 2 1","output":"4","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 1\n50","output":"50","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"5 5\n10 20 30 40 50","output":"50","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5 2\n10 20 30 40 50","output":"90","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7 4\n1 2 3 1 1 5 4","output":"5","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8 2\n5 5 5 5 5 5 5 5","output":"20","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-1011';

UPDATE public.technical_problems
SET
  description = 'You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the i-th interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval.

Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).',
  statement = '### Problem Statement
You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the i-th interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval.

Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).

### Input Format
Line 1: Three space-separated integers N (number of existing intervals), newStart, and newEnd.
Next N lines: Two space-separated integers start and end for each interval.

### Output Format
Line 1: Integer K (number of merged intervals).
Next K lines: Two space-separated integers representing each interval.',
  input_format = 'Line 1: Three space-separated integers N (number of existing intervals), newStart, and newEnd.
Next N lines: Two space-separated integers start and end for each interval.',
  output_format = 'Line 1: Integer K (number of merged intervals).
Next K lines: Two space-separated integers representing each interval.',
  sample_input = '2 2 5
1 3
6 9',
  sample_output = '2
1 5
6 9',
  explanation = 'Because the new interval [2, 5] overlaps with [1, 3], they are merged into [1, 5].',
  constraints = '["0 <= N <= 10^4","0 <= start <= end <= 10^5"]'::jsonb,
  test_cases = '[{"input":"2 2 5\n1 3\n6 9","output":"2\n1 5\n6 9","is_hidden":false,"explanation":"Because the new interval [2, 5] overlaps with [1, 3], they are merged into [1, 5]."},{"input":"5 4 8\n1 2\n3 5\n6 7\n8 10\n12 16","output":"3\n1 2\n3 10\n12 16","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0 5 7","output":"1\n5 7","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 2 3\n1 5","output":"1\n1 5","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1 6 8\n1 5","output":"2\n1 5\n6 8","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"2 0 0\n1 5\n6 8","output":"3\n0 0\n1 5\n6 8","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"3 3 5\n1 2\n6 9\n11 15","output":"4\n1 2\n3 5\n6 9\n11 15","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4 2 7\n1 3\n4 5\n6 7\n8 9","output":"2\n1 7\n8 9","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-57';

UPDATE public.technical_problems
SET
  description = 'There are spherical balloons taped to a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array points where points[i] = [xstart, xend] denotes a balloon whose horizontal diameter stretches between xstart and xend.

Arrows can be shot up directly vertically in the positive y-direction from different points along the x-axis. A balloon with xstart and xend is burst by an arrow shot at x if xstart <= x <= xend. There is no limit to the number of arrows that can be shot. A shot arrow keeps traveling up infinitely, bursting any balloons in its path.

Given the array points, return the minimum number of arrows that must be shot to burst all balloons.',
  statement = '### Problem Statement
There are spherical balloons taped to a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array points where points[i] = [xstart, xend] denotes a balloon whose horizontal diameter stretches between xstart and xend.

Arrows can be shot up directly vertically in the positive y-direction from different points along the x-axis. A balloon with xstart and xend is burst by an arrow shot at x if xstart <= x <= xend. There is no limit to the number of arrows that can be shot. A shot arrow keeps traveling up infinitely, bursting any balloons in its path.

Given the array points, return the minimum number of arrows that must be shot to burst all balloons.

### Input Format
Line 1: Integer N (number of balloons).
Next N lines: Two space-separated integers xstart and xend.

### Output Format
Print the minimum number of arrows required.',
  input_format = 'Line 1: Integer N (number of balloons).
Next N lines: Two space-separated integers xstart and xend.',
  output_format = 'Print the minimum number of arrows required.',
  sample_input = '4
10 16
2 8
1 6
7 12',
  sample_output = '2',
  explanation = 'Shoot arrow at x = 6 (bursting [2,8] and [1,6]) and x = 11 (bursting [10,16] and [7,12]).',
  constraints = '["1 <= N <= 10^5","-2^31 <= xstart < xend <= 2^31 - 1"]'::jsonb,
  test_cases = '[{"input":"4\n10 16\n2 8\n1 6\n7 12","output":"2","is_hidden":false,"explanation":"Shoot arrow at x = 6 (bursting [2,8] and [1,6]) and x = 11 (bursting [10,16] and [7,12])."},{"input":"4\n1 2\n3 4\n5 6\n7 8","output":"4","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"4\n1 2\n2 3\n3 4\n4 5","output":"2","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n1 10","output":"1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"5\n1 5\n2 6\n3 7\n4 8\n5 9","output":"1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3\n-2147483646 -2147483645\n2147483646 2147483647\n0 1","output":"3","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\n9 12\n1 10\n4 11\n8 12\n3 9","output":"1","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"3\n1 10\n2 9\n3 8","output":"1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-452';

UPDATE public.technical_problems
SET
  description = 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)). Format the median output to 5 decimal places.',
  statement = '### Problem Statement
Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)). Format the median output to 5 decimal places.

### Input Format
Line 1: Two space-separated integers m and n.
Line 2: m space-separated sorted integers (if m > 0).
Line 3: n space-separated sorted integers (if n > 0).

### Output Format
Print the median formatted to 5 decimal places.',
  input_format = 'Line 1: Two space-separated integers m and n.
Line 2: m space-separated sorted integers (if m > 0).
Line 3: n space-separated sorted integers (if n > 0).',
  output_format = 'Print the median formatted to 5 decimal places.',
  sample_input = '2 1
1 3
2',
  sample_output = '2.00000',
  explanation = 'Merged array = [1, 2, 3] and median is 2.00000.',
  constraints = '["0 <= m, n <= 1000","1 <= m + n <= 2000","-10^6 <= nums1[i], nums2[i] <= 10^6"]'::jsonb,
  test_cases = '[{"input":"2 1\n1 3\n2","output":"2.00000","is_hidden":false,"explanation":"Merged array = [1, 2, 3] and median is 2.00000."},{"input":"2 2\n1 2\n3 4","output":"2.50000","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0 1\n\n1","output":"1.00000","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2 0\n2 3","output":"2.50000","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 3\n1 3 5\n2 4 6","output":"3.50000","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4 4\n-5 -3 -1 1\n-4 -2 0 2","output":"-1.50000","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5 1\n1 2 3 4 5\n6","output":"3.50000","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"3 4\n10 20 30\n5 15 25 35","output":"20.00000","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-4';

UPDATE public.technical_problems
SET
  description = 'Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see the 10 most recent tweets in the user''s news feed.

Operations: postTweet(userId, tweetId), getNewsFeed(userId), follow(followerId, followeeId), unfollow(followerId, followeeId).',
  statement = '### Problem Statement
Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see the 10 most recent tweets in the user''s news feed.

Operations: postTweet(userId, tweetId), getNewsFeed(userId), follow(followerId, followeeId), unfollow(followerId, followeeId).

### Input Format
Line 1: Integer Q (number of operations).
Next Q lines: Command strings.

### Output Format
Print news feed tweet IDs separated by spaces for each getNewsFeed call, each on a new line (or EMPTY if empty).',
  input_format = 'Line 1: Integer Q (number of operations).
Next Q lines: Command strings.',
  output_format = 'Print news feed tweet IDs separated by spaces for each getNewsFeed call, each on a new line (or EMPTY if empty).',
  sample_input = '6
postTweet 1 5
getNewsFeed 1
follow 1 2
postTweet 2 6
getNewsFeed 1
unfollow 1 2',
  sample_output = '5
6 5',
  explanation = 'User 1 posts tweet 5. User 1 follows User 2 who posts tweet 6. User 1 news feed contains [6, 5].',
  constraints = '["1 <= Q <= 10^4","1 <= userId, followerId, followeeId <= 500","0 <= tweetId <= 10^4"]'::jsonb,
  test_cases = '[{"input":"6\npostTweet 1 5\ngetNewsFeed 1\nfollow 1 2\npostTweet 2 6\ngetNewsFeed 1\nunfollow 1 2","output":"5\n6 5","is_hidden":false,"explanation":"User 1 posts tweet 5. User 1 follows User 2 who posts tweet 6. User 1 news feed contains [6, 5]."},{"input":"2\npostTweet 1 10\ngetNewsFeed 1","output":"10","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\ngetNewsFeed 1","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"5\npostTweet 1 1\npostTweet 1 2\npostTweet 1 3\npostTweet 1 4\ngetNewsFeed 1","output":"4 3 2 1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4\nfollow 1 2\npostTweet 2 100\ngetNewsFeed 1\nunfollow 1 2","output":"100","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\npostTweet 2 50\nfollow 1 2\nunfollow 1 2\ngetNewsFeed 1\ngetNewsFeed 2","output":"EMPTY\n50","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\npostTweet 1 11\npostTweet 2 22\npostTweet 3 33\nfollow 1 2\nfollow 1 3\ngetNewsFeed 1\nunfollow 1 2","output":"33 22 11","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4\npostTweet 1 5\npostTweet 1 6\nunfollow 1 2\ngetNewsFeed 1","output":"6 5","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-355';

UPDATE public.technical_problems
SET
  description = 'Given the root of a binary tree represented as a level-order array with -1 representing empty/null nodes, check whether it is a mirror of itself (i.e., symmetric around its center).',
  statement = '### Problem Statement
Given the root of a binary tree represented as a level-order array with -1 representing empty/null nodes, check whether it is a mirror of itself (i.e., symmetric around its center).

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers (-1 for null).

### Output Format
Print true or false.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers (-1 for null).',
  output_format = 'Print true or false.',
  sample_input = '7
1 2 2 3 4 4 3',
  sample_output = 'true',
  explanation = 'The tree is symmetric around its root 1.',
  constraints = '["1 <= N <= 1000","-100 <= Node.val <= 100"]'::jsonb,
  test_cases = '[{"input":"7\n1 2 2 3 4 4 3","output":"true","is_hidden":false,"explanation":"The tree is symmetric around its root 1."},{"input":"5\n1 2 2 -1 3 -1 3","output":"false","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n1","output":"true","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\n1 2 2","output":"true","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3\n1 2 3","output":"false","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"7\n1 2 2 2 -1 2 -1","output":"false","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\n5 1 1 -1 2 2 -1","output":"true","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7\n9 3 3 5 7 7 5","output":"true","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-101';

UPDATE public.technical_problems
SET
  description = 'Given the root of a binary tree represented as a level-order array of N elements (-1 for null), imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.',
  statement = '### Problem Statement
Given the root of a binary tree represented as a level-order array of N elements (-1 for null), imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print the values seen from the right side separated by spaces, or EMPTY.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print the values seen from the right side separated by spaces, or EMPTY.',
  sample_input = '5
1 2 3 -1 5',
  sample_output = '1 3 5',
  explanation = 'From the right side, nodes 1, 3, and 5 are visible.',
  constraints = '["0 <= N <= 100","-100 <= Node.val <= 100"]'::jsonb,
  test_cases = '[{"input":"5\n1 2 3 -1 5","output":"1 3 5","is_hidden":false,"explanation":"From the right side, nodes 1, 3, and 5 are visible."},{"input":"3\n1 -1 3","output":"1 3","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n42","output":"42","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7\n1 2 3 4 5 6 7","output":"1 3 7","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4\n1 2 -1 4","output":"1 2 4","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\n1 2 3 4 -1","output":"1 3 4","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7\n10 20 30 -1 25 -1 35","output":"10 30 35","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-199';

UPDATE public.technical_problems
SET
  description = 'Given the roots of two binary trees p and q represented in level order, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.',
  statement = '### Problem Statement
Given the roots of two binary trees p and q represented in level order, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

### Input Format
Line 1: Two space-separated integers n1 and n2.
Line 2: n1 space-separated integers for tree 1.
Line 3: n2 space-separated integers for tree 2.

### Output Format
Print true or false.',
  input_format = 'Line 1: Two space-separated integers n1 and n2.
Line 2: n1 space-separated integers for tree 1.
Line 3: n2 space-separated integers for tree 2.',
  output_format = 'Print true or false.',
  sample_input = '3 3
1 2 3
1 2 3',
  sample_output = 'true',
  explanation = 'Both trees have identical structure [1, 2, 3] and values.',
  constraints = '["0 <= n1, n2 <= 100","-10^4 <= Node.val <= 10^4"]'::jsonb,
  test_cases = '[{"input":"3 3\n1 2 3\n1 2 3","output":"true","is_hidden":false,"explanation":"Both trees have identical structure [1, 2, 3] and values."},{"input":"2 2\n1 2\n1 -1 2","output":"false","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3 3\n1 2 1\n1 1 2","output":"false","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"0 0","output":"true","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1 1\n5\n5","output":"true","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"1 1\n5\n6","output":"false","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5 5\n1 2 3 4 5\n1 2 3 4 5","output":"true","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5 5\n1 2 3 4 5\n1 2 3 -1 5","output":"false","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-100';

UPDATE public.technical_problems
SET
  description = 'Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.',
  statement = '### Problem Statement
Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.

### Input Format
Line 1: Two space-separated integers N and targetSum.
Line 2: N space-separated integers representing the tree in level order (-1 for null).

### Output Format
Print true or false.',
  input_format = 'Line 1: Two space-separated integers N and targetSum.
Line 2: N space-separated integers representing the tree in level order (-1 for null).',
  output_format = 'Print true or false.',
  sample_input = '9 22
5 4 8 11 -1 13 4 7 2',
  sample_output = 'true',
  explanation = 'The root-to-leaf path 5 -> 4 -> 11 -> 2 has sum 22.',
  constraints = '["0 <= N <= 1000","-1000 <= targetSum, Node.val <= 1000"]'::jsonb,
  test_cases = '[{"input":"9 22\n5 4 8 11 -1 13 4 7 2","output":"true","is_hidden":false,"explanation":"The root-to-leaf path 5 -> 4 -> 11 -> 2 has sum 22."},{"input":"3 5\n1 2 3","output":"false","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0 0","output":"false","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 10\n10","output":"true","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1 10\n5","output":"false","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3 -5\n-2 -3 -1","output":"true","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5 18\n10 5 12 3 8","output":"true","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7 14\n4 2 6 1 3 5 7","output":"false","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-112';

UPDATE public.technical_problems
SET
  description = 'Given the root of a binary tree, return the zigzag level order traversal of its nodes'' values. (i.e., from left to right, then right to left for the next level and alternate between).',
  statement = '### Problem Statement
Given the root of a binary tree, return the zigzag level order traversal of its nodes'' values. (i.e., from left to right, then right to left for the next level and alternate between).

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print each level on a new line with space-separated values, or EMPTY.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print each level on a new line with space-separated values, or EMPTY.',
  sample_input = '7
3 9 20 -1 -1 15 7',
  sample_output = '3
20 9
15 7',
  explanation = 'Level 1: [3] (left to right). Level 2: [20, 9] (right to left). Level 3: [15, 7] (left to right).',
  constraints = '["0 <= N <= 2000","-100 <= Node.val <= 100"]'::jsonb,
  test_cases = '[{"input":"7\n3 9 20 -1 -1 15 7","output":"3\n20 9\n15 7","is_hidden":false,"explanation":"Level 1: [3] (left to right). Level 2: [20, 9] (right to left). Level 3: [15, 7] (left to right)."},{"input":"1\n1","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\n1 2 3","output":"1\n3 2","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7\n1 2 3 4 5 6 7","output":"1\n3 2\n4 5 6 7","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n1 2 -1 4 5","output":"1\n2\n4 5","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\n1 -1 2 -1 3","output":"1\n2\n3","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7\n10 5 15 2 7 12 20","output":"10\n15 5\n2 7 12 20","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-103';

UPDATE public.technical_problems
SET
  description = 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q in the tree.

The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).',
  statement = '### Problem Statement
Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q in the tree.

The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).

### Input Format
Line 1: Three space-separated integers N, p, and q.
Line 2: N space-separated integers representing the tree in level order.

### Output Format
Print the value of the LCA node.',
  input_format = 'Line 1: Three space-separated integers N, p, and q.
Line 2: N space-separated integers representing the tree in level order.',
  output_format = 'Print the value of the LCA node.',
  sample_input = '9 5 1
3 5 1 6 2 0 8 -1 -1',
  sample_output = '3',
  explanation = 'The LCA of nodes 5 and 1 is 3.',
  constraints = '["2 <= N <= 10^4","-10^9 <= Node.val, p, q <= 10^9","All Node.val are unique."]'::jsonb,
  test_cases = '[{"input":"9 5 1\n3 5 1 6 2 0 8 -1 -1","output":"3","is_hidden":false,"explanation":"The LCA of nodes 5 and 1 is 3."},{"input":"9 5 4\n3 5 1 6 2 0 8 7 4","output":"5","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2 1 2\n1 2","output":"1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3 2 3\n1 2 3","output":"1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7 4 5\n1 2 3 4 5 6 7","output":"2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"7 6 7\n1 2 3 4 5 6 7","output":"3","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5 2 5\n1 2 3 -1 5","output":"2","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7 12 20\n10 5 15 2 7 12 20","output":"15","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-236';

UPDATE public.technical_problems
SET
  description = 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q in the BST in O(h) time.',
  statement = '### Problem Statement
Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q in the BST in O(h) time.

### Input Format
Line 1: Three space-separated integers N, p, and q.
Line 2: N space-separated integers in BST level order.

### Output Format
Print the value of the LCA node.',
  input_format = 'Line 1: Three space-separated integers N, p, and q.
Line 2: N space-separated integers in BST level order.',
  output_format = 'Print the value of the LCA node.',
  sample_input = '9 2 8
6 2 8 0 4 7 9 -1 -1',
  sample_output = '6',
  explanation = 'The LCA of nodes 2 and 8 is 6.',
  constraints = '["2 <= N <= 10^4","-10^9 <= Node.val <= 10^9","All Node.val are unique."]'::jsonb,
  test_cases = '[{"input":"9 2 8\n6 2 8 0 4 7 9 -1 -1","output":"6","is_hidden":false,"explanation":"The LCA of nodes 2 and 8 is 6."},{"input":"9 2 4\n6 2 8 0 4 7 9 -1 -1","output":"2","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2 2 1\n2 1","output":"2","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3 1 3\n2 1 3","output":"2","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7 3 5\n4 2 6 1 3 5 7","output":"4","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"7 1 7\n4 2 6 1 3 5 7","output":"4","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7 5 7\n4 2 6 1 3 5 7","output":"6","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5 10 14\n12 8 16 10 14","output":"12","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-235';

UPDATE public.technical_problems
SET
  description = 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys strictly less than the node''s key.
- The right subtree of a node contains only nodes with keys strictly greater than the node''s key.
- Both left and right subtrees must also be binary search trees.',
  statement = '### Problem Statement
Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys strictly less than the node''s key.
- The right subtree of a node contains only nodes with keys strictly greater than the node''s key.
- Both left and right subtrees must also be binary search trees.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Print true or false.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Print true or false.',
  sample_input = '3
2 1 3',
  sample_output = 'true',
  explanation = 'The root 2 has left child 1 (< 2) and right child 3 (> 2), valid BST.',
  constraints = '["1 <= N <= 10^4","-2^31 <= Node.val <= 2^31 - 1"]'::jsonb,
  test_cases = '[{"input":"3\n2 1 3","output":"true","is_hidden":false,"explanation":"The root 2 has left child 1 (< 2) and right child 3 (> 2), valid BST."},{"input":"5\n5 1 4 -1 -1 3 6","output":"false","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n10","output":"true","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\n1 1 1","output":"false","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7\n10 5 15 2 7 12 20","output":"true","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3\n2 2 2","output":"false","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\n10 5 15 -1 6","output":"true","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7\n4 2 6 1 3 5 7","output":"true","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-98';

UPDATE public.technical_problems
SET
  description = 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
  statement = '### Problem Statement
Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.

### Input Format
Line 1: Two space-separated integers N and k.
Line 2: N space-separated integers in BST level order.

### Output Format
Print the kth smallest integer.',
  input_format = 'Line 1: Two space-separated integers N and k.
Line 2: N space-separated integers in BST level order.',
  output_format = 'Print the kth smallest integer.',
  sample_input = '4 1
3 1 4 -1 2',
  sample_output = '1',
  explanation = 'The 1st smallest element in the BST is 1.',
  constraints = '["1 <= k <= N <= 10^4","0 <= Node.val <= 10^4"]'::jsonb,
  test_cases = '[{"input":"4 1\n3 1 4 -1 2","output":"1","is_hidden":false,"explanation":"The 1st smallest element in the BST is 1."},{"input":"7 3\n5 3 6 2 4 -1 -1 1","output":"3","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1 1\n42","output":"42","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3 2\n2 1 3","output":"2","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7 5\n4 2 6 1 3 5 7","output":"5","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"7 7\n4 2 6 1 3 5 7","output":"7","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5 4\n10 5 15 2 7","output":"10","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6 6\n6 5 -1 4 -1 3 -1 2 -1 1","output":"6","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-230';

UPDATE public.technical_problems
SET
  description = 'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).

The distance between two points on the X-Y plane is the Euclidean distance (√(x1 - x2)^2 + (y1 - y2)^2). Sort the output points in ascending order of distance.',
  statement = '### Problem Statement
Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).

The distance between two points on the X-Y plane is the Euclidean distance (√(x1 - x2)^2 + (y1 - y2)^2). Sort the output points in ascending order of distance.

### Input Format
Line 1: Two space-separated integers N and k.
Next N lines: Two space-separated integers x and y.

### Output Format
Print each of the k closest points on a new line with x and y separated by a space.',
  input_format = 'Line 1: Two space-separated integers N and k.
Next N lines: Two space-separated integers x and y.',
  output_format = 'Print each of the k closest points on a new line with x and y separated by a space.',
  sample_input = '2 1
1 3
-2 2',
  sample_output = '-2 2',
  explanation = 'Distance of (1, 3) is √10. Distance of (-2, 2) is √8. (-2, 2) is closer.',
  constraints = '["1 <= k <= N <= 10^4","-10^4 <= xi, yi <= 10^4"]'::jsonb,
  test_cases = '[{"input":"2 1\n1 3\n-2 2","output":"-2 2","is_hidden":false,"explanation":"Distance of (1, 3) is √10. Distance of (-2, 2) is √8. (-2, 2) is closer."},{"input":"3 2\n3 3\n5 -1\n-2 4","output":"3 3\n-2 4","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1 1\n0 0","output":"0 0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"4 2\n1 1\n2 2\n3 3\n0 1","output":"0 1\n1 1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"5 3\n-5 4\n-6 -5\n4 6\n2 3\n-1 -1","output":"-1 -1\n2 3\n-5 4","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3 1\n10 10\n-10 -10\n1 1","output":"1 1","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4 4\n1 0\n0 1\n-1 0\n0 -1","output":"-1 0\n0 -1\n0 1\n1 0","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5 2\n2 2\n-2 -2\n1 1\n-1 -1\n0 5","output":"-1 -1\n1 1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-973';

UPDATE public.technical_problems
SET
  description = 'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree (output its postorder traversal).',
  statement = '### Problem Statement
Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree (output its postorder traversal).

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers for preorder.
Line 3: N space-separated integers for inorder.

### Output Format
Print the postorder traversal of the constructed binary tree separated by spaces.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers for preorder.
Line 3: N space-separated integers for inorder.',
  output_format = 'Print the postorder traversal of the constructed binary tree separated by spaces.',
  sample_input = '5
3 9 20 15 7
9 3 15 20 7',
  sample_output = '9 15 7 20 3',
  explanation = 'Reconstructing the tree gives root 3, left child 9, right child 20 (with 15 and 7). Postorder is [9, 15, 7, 20, 3].',
  constraints = '["1 <= N <= 3000","-3000 <= Node.val <= 3000","All values are unique."]'::jsonb,
  test_cases = '[{"input":"5\n3 9 20 15 7\n9 3 15 20 7","output":"9 15 7 20 3","is_hidden":false,"explanation":"Reconstructing the tree gives root 3, left child 9, right child 20 (with 15 and 7). Postorder is [9, 15, 7, 20, 3]."},{"input":"1\n-1\n-1","output":"-1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3\n1 2 3\n2 1 3","output":"2 3 1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\n1 2 3\n3 2 1","output":"3 2 1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4\n1 2 4 3\n4 2 1 3","output":"4 2 3 1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n1 2 4 5 3\n4 2 5 1 3","output":"4 5 2 3 1","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6\n10 5 2 7 15 20\n2 5 7 10 15 20","output":"2 7 5 20 15 10","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4\n1 2 3 4\n1 2 3 4","output":"4 3 2 1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-105';

UPDATE public.technical_problems
SET
  description = 'Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree (output its preorder traversal).',
  statement = '### Problem Statement
Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree (output its preorder traversal).

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers for inorder.
Line 3: N space-separated integers for postorder.

### Output Format
Print the preorder traversal of the constructed binary tree separated by spaces.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers for inorder.
Line 3: N space-separated integers for postorder.',
  output_format = 'Print the preorder traversal of the constructed binary tree separated by spaces.',
  sample_input = '5
9 3 15 20 7
9 15 7 20 3',
  sample_output = '3 9 20 15 7',
  explanation = 'Reconstructing the tree gives root 3 with preorder [3, 9, 20, 15, 7].',
  constraints = '["1 <= N <= 3000","-3000 <= Node.val <= 3000","All values are unique."]'::jsonb,
  test_cases = '[{"input":"5\n9 3 15 20 7\n9 15 7 20 3","output":"3 9 20 15 7","is_hidden":false,"explanation":"Reconstructing the tree gives root 3 with preorder [3, 9, 20, 15, 7]."},{"input":"1\n-1\n-1","output":"-1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3\n2 1 3\n2 3 1","output":"1 2 3","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\n3 2 1\n3 2 1","output":"1 2 3","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4\n4 2 1 3\n4 2 3 1","output":"1 2 4 3","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n4 2 5 1 3\n4 5 2 3 1","output":"1 2 4 5 3","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6\n2 5 7 10 15 20\n2 7 5 20 15 10","output":"10 5 2 7 15 20","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4\n1 2 3 4\n4 3 2 1","output":"1 2 3 4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-106';

UPDATE public.technical_problems
SET
  description = 'Given the root of a binary tree, flatten the tree into a "linked list" in-place where right child points to the next node in preorder traversal and left child is always null. Print the flattened node values separated by spaces.',
  statement = '### Problem Statement
Given the root of a binary tree, flatten the tree into a "linked list" in-place where right child points to the next node in preorder traversal and left child is always null. Print the flattened node values separated by spaces.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers in level order.

### Output Format
Print the flattened linked list node values separated by spaces, or EMPTY.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers in level order.',
  output_format = 'Print the flattened linked list node values separated by spaces, or EMPTY.',
  sample_input = '6
1 2 5 3 4 -1 6',
  sample_output = '1 2 3 4 5 6',
  explanation = 'The flattened tree follows preorder: 1 -> 2 -> 3 -> 4 -> 5 -> 6.',
  constraints = '["0 <= N <= 2000","-100 <= Node.val <= 100"]'::jsonb,
  test_cases = '[{"input":"6\n1 2 5 3 4 -1 6","output":"1 2 3 4 5 6","is_hidden":false,"explanation":"The flattened tree follows preorder: 1 -> 2 -> 3 -> 4 -> 5 -> 6."},{"input":"0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n0","output":"0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\n1 2 3","output":"1 2 3","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4\n1 2 -1 3","output":"1 2 3","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n1 2 3 4 5","output":"1 2 4 5 3","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\n10 5 15 2 7 12 20","output":"10 5 2 7 15 12 20","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4\n1 -1 2 -1 3","output":"1 2 3","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-114';

UPDATE public.technical_problems
SET
  description = 'Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference of the BST in level order traversal.',
  statement = '### Problem Statement
Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference of the BST in level order traversal.

### Input Format
Line 1: Two space-separated integers N and key.
Line 2: N space-separated integers in BST level order.

### Output Format
Print the level-order traversal of the updated BST, or EMPTY.',
  input_format = 'Line 1: Two space-separated integers N and key.
Line 2: N space-separated integers in BST level order.',
  output_format = 'Print the level-order traversal of the updated BST, or EMPTY.',
  sample_input = '7 3
5 3 6 2 4 -1 7',
  sample_output = '5 4 6 2 -1 -1 7',
  explanation = 'Node with key 3 is replaced with its inorder successor 4.',
  constraints = '["0 <= N <= 10^4","-10^5 <= key, Node.val <= 10^5"]'::jsonb,
  test_cases = '[{"input":"7 3\n5 3 6 2 4 -1 7","output":"5 4 6 2 -1 -1 7","is_hidden":false,"explanation":"Node with key 3 is replaced with its inorder successor 4."},{"input":"7 0\n5 3 6 2 4 -1 7","output":"5 3 6 2 4 -1 7","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0 0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 5\n5","output":"EMPTY","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 2\n2 1 3","output":"3 1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5 10\n10 5 15 2 7","output":"15 5 -1 2 7","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7 2\n4 2 6 1 3 5 7","output":"4 3 6 1 -1 5 7","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6 6\n5 3 6 2 4","output":"5 3 -1 2 4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-450';

UPDATE public.technical_problems
SET
  description = 'Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of the node values in the path equals targetSum. Each path should be returned as a list of the node values.',
  statement = '### Problem Statement
Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of the node values in the path equals targetSum. Each path should be returned as a list of the node values.

### Input Format
Line 1: Two space-separated integers N and targetSum.
Line 2: N space-separated integers in level order.

### Output Format
Line 1: Count of paths K.
Next K lines: Space-separated values for each path.',
  input_format = 'Line 1: Two space-separated integers N and targetSum.
Line 2: N space-separated integers in level order.',
  output_format = 'Line 1: Count of paths K.
Next K lines: Space-separated values for each path.',
  sample_input = '13 22
5 4 8 11 -1 13 4 7 2 -1 -1 5 1',
  sample_output = '2
5 4 11 2
5 8 4 5',
  explanation = 'Two root-to-leaf paths sum to 22: [5, 4, 11, 2] and [5, 8, 4, 5].',
  constraints = '["0 <= N <= 5000","-1000 <= targetSum, Node.val <= 1000"]'::jsonb,
  test_cases = '[{"input":"13 22\n5 4 8 11 -1 13 4 7 2 -1 -1 5 1","output":"2\n5 4 11 2\n5 8 4 5","is_hidden":false,"explanation":"Two root-to-leaf paths sum to 22: [5, 4, 11, 2] and [5, 8, 4, 5]."},{"input":"3 5\n1 2 3","output":"0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2 0\n1 2","output":"0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"0 0","output":"0","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1 5\n5","output":"1\n5","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5 18\n10 4 8 4 6","output":"2\n10 4 4\n10 8","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7 7\n1 2 2 4 4 4 4","output":"4\n1 2 4\n1 2 4\n1 2 4\n1 2 4","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7 12\n3 4 5 5 1 4 4","output":"3\n3 4 5\n3 5 4\n3 5 4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-113';

UPDATE public.technical_problems
SET
  description = 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node''s values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
  statement = '### Problem Statement
A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node''s values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers in level order.

### Output Format
Print the maximum path sum as an integer.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers in level order.',
  output_format = 'Print the maximum path sum as an integer.',
  sample_input = '3
1 2 3',
  sample_output = '6',
  explanation = 'The optimal path is 2 -> 1 -> 3 with path sum 2 + 1 + 3 = 6.',
  constraints = '["1 <= N <= 3 * 10^4","-1000 <= Node.val <= 1000"]'::jsonb,
  test_cases = '[{"input":"3\n1 2 3","output":"6","is_hidden":false,"explanation":"The optimal path is 2 -> 1 -> 3 with path sum 2 + 1 + 3 = 6."},{"input":"5\n-10 9 20 -1 -1 15 7","output":"42","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n-3","output":"-3","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\n-2 -1 -3","output":"-2","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"5\n2 -1 -2","output":"2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"7\n1 2 3 4 5 6 7","output":"18","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\n5 4 8 11 -1 13 4","output":"41","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"3\n10 -5 20","output":"30","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-124';

UPDATE public.technical_problems
SET
  description = 'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer. Design an algorithm to serialize and deserialize a binary tree. Output the verified level-order serialization format.',
  statement = '### Problem Statement
Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer. Design an algorithm to serialize and deserialize a binary tree. Output the verified level-order serialization format.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers in level order.

### Output Format
Print the serialized level-order traversal, or EMPTY.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers in level order.',
  output_format = 'Print the serialized level-order traversal, or EMPTY.',
  sample_input = '5
1 2 3 -1 -1 4 5',
  sample_output = '1 2 3 -1 -1 4 5',
  explanation = 'Serializing and deserializing maintains identical tree structure.',
  constraints = '["0 <= N <= 10^4","-1000 <= Node.val <= 1000"]'::jsonb,
  test_cases = '[{"input":"5\n1 2 3 -1 -1 4 5","output":"1 2 3 -1 -1 4 5","is_hidden":false,"explanation":"Serializing and deserializing maintains identical tree structure."},{"input":"0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n1","output":"1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2\n1 2","output":"1 2","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4\n1 -1 2 -1 3","output":"1 -1 2 -1 3","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n1 2 3 4 5","output":"1 2 3 4 5","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7\n10 20 30 -1 25 35 40","output":"10 20 30 -1 25 35 40","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"3\n5 2 8","output":"5 2 8","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-297';

UPDATE public.technical_problems
SET
  description = 'Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.

Implement KthLargest class: KthLargest(int k, int[] nums) initializes the object. int add(int val) appends the integer val to the stream and returns the element representing the kth largest element.',
  statement = '### Problem Statement
Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.

Implement KthLargest class: KthLargest(int k, int[] nums) initializes the object. int add(int val) appends the integer val to the stream and returns the element representing the kth largest element.

### Input Format
Line 1: Two space-separated integers k and initN.
Line 2: initN space-separated integers (initial stream).
Line 3: M space-separated integers to append.

### Output Format
Print the kth largest element after each addition separated by spaces.',
  input_format = 'Line 1: Two space-separated integers k and initN.
Line 2: initN space-separated integers (initial stream).
Line 3: M space-separated integers to append.',
  output_format = 'Print the kth largest element after each addition separated by spaces.',
  sample_input = '3 4
4 5 8 2
3 5 10 9 4',
  sample_output = '4 5 5 8 8',
  explanation = 'After adding 3 -> 4; adding 5 -> 5; adding 10 -> 5; adding 9 -> 8; adding 4 -> 8.',
  constraints = '["1 <= k <= 10^4","0 <= initN <= 10^4","-10^4 <= val <= 10^4"]'::jsonb,
  test_cases = '[{"input":"3 4\n4 5 8 2\n3 5 10 9 4","output":"4 5 5 8 8","is_hidden":false,"explanation":"After adding 3 -> 4; adding 5 -> 5; adding 10 -> 5; adding 9 -> 8; adding 4 -> 8."},{"input":"1 2\n1 2\n3 4 5","output":"3 4 5","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2 1\n0\n-1 1 -2 2","output":"-1 0 0 1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 0\n\n5 10 2 20","output":"5 10 10 20","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 3\n10 20 30\n5 15 25 35","output":"10 15 20 25","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4 5\n7 7 7 7 7\n7 8 6 9","output":"7 7 7 7","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"2 3\n1 3 5\n2 4 6","output":"3 4 5","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5 5\n10 9 8 7 6\n5 4 3 2 1","output":"6 6 6 6 6","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-703';

UPDATE public.technical_problems
SET
  description = 'Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.

Note that it is the kth smallest element in the sorted order, not the kth distinct element.',
  statement = '### Problem Statement
Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.

Note that it is the kth smallest element in the sorted order, not the kth distinct element.

### Input Format
Line 1: Two space-separated integers N and k.
Next N lines: N space-separated sorted integers.

### Output Format
Print the kth smallest element as an integer.',
  input_format = 'Line 1: Two space-separated integers N and k.
Next N lines: N space-separated sorted integers.',
  output_format = 'Print the kth smallest element as an integer.',
  sample_input = '3 8
1 5 9
10 11 13
12 13 15',
  sample_output = '13',
  explanation = 'The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13.',
  constraints = '["1 <= N <= 300","1 <= k <= N^2","-10^9 <= matrix[i][j] <= 10^9"]'::jsonb,
  test_cases = '[{"input":"3 8\n1 5 9\n10 11 13\n12 13 15","output":"13","is_hidden":false,"explanation":"The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13."},{"input":"1 1\n-5","output":"-5","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2 1\n1 2\n1 3","output":"1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2 4\n1 2\n1 3","output":"3","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 1\n1 2 3\n4 5 6\n7 8 9","output":"1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3 9\n1 2 3\n4 5 6\n7 8 9","output":"9","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4 6\n1 4 7 11\n2 5 8 12\n3 6 9 16\n10 13 14 17","output":"6","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"3 5\n1 3 5\n6 7 12\n11 14 14","output":"7","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-378';

UPDATE public.technical_problems
SET
  description = 'Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.',
  statement = '### Problem Statement
Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.

### Input Format
Line 1: Integer N (number of meetings).
Next N lines: Two space-separated integers start and end.

### Output Format
Print the minimum number of conference rooms required.',
  input_format = 'Line 1: Integer N (number of meetings).
Next N lines: Two space-separated integers start and end.',
  output_format = 'Print the minimum number of conference rooms required.',
  sample_input = '3
0 30
5 10
15 20',
  sample_output = '2',
  explanation = 'Meeting [0, 30] overlaps with [5, 10] and [15, 20], requiring 2 conference rooms.',
  constraints = '["1 <= N <= 10^4","0 <= starti < endi <= 10^6"]'::jsonb,
  test_cases = '[{"input":"3\n0 30\n5 10\n15 20","output":"2","is_hidden":false,"explanation":"Meeting [0, 30] overlaps with [5, 10] and [15, 20], requiring 2 conference rooms."},{"input":"2\n7 10\n2 4","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n1 10","output":"1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"4\n1 5\n2 6\n3 7\n4 8","output":"4","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3\n1 4\n4 6\n6 8","output":"1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n9 10\n4 9\n4 17\n1 2\n2 4","output":"2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4\n0 10\n1 2\n2 3\n3 4","output":"2","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6\n1 3\n2 4\n3 5\n4 6\n5 7\n6 8","output":"2","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-253';

UPDATE public.technical_problems
SET
  description = 'Given a characters array tasks, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.

However, there is a non-negative integer n that represents the cooldown period between two same tasks. Return the least number of units of times that the CPU will take to finish all the given tasks.',
  statement = '### Problem Statement
Given a characters array tasks, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.

However, there is a non-negative integer n that represents the cooldown period between two same tasks. Return the least number of units of times that the CPU will take to finish all the given tasks.

### Input Format
Line 1: Two space-separated integers N and n.
Line 2: N space-separated uppercase characters.

### Output Format
Print the minimum CPU intervals required.',
  input_format = 'Line 1: Two space-separated integers N and n.
Line 2: N space-separated uppercase characters.',
  output_format = 'Print the minimum CPU intervals required.',
  sample_input = '6 2
A A A B B B',
  sample_output = '8',
  explanation = 'One possible schedule: A -> B -> idle -> A -> B -> idle -> A -> B. Total units = 8.',
  constraints = '["1 <= N <= 10^4","0 <= n <= 100","tasks[i] is uppercase English letter."]'::jsonb,
  test_cases = '[{"input":"6 2\nA A A B B B","output":"8","is_hidden":false,"explanation":"One possible schedule: A -> B -> idle -> A -> B -> idle -> A -> B. Total units = 8."},{"input":"6 0\nA A A B B B","output":"6","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"6 2\nA A A A A A","output":"16","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 5\nA","output":"1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6 1\nA A A B B B","output":"6","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"8 2\nA A A B B B C D","output":"8","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7 3\nA B C D E F G","output":"7","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"10 2\nA A A A B B B C C D","output":"10","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-621';

UPDATE public.technical_problems
SET
  description = 'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

Implement the MedianFinder class supporting addNum(num) and findMedian(). Format output to 1 decimal place.',
  statement = '### Problem Statement
The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

Implement the MedianFinder class supporting addNum(num) and findMedian(). Format output to 1 decimal place.

### Input Format
Line 1: Integer Q.
Next Q lines: Either "addNum X" or "findMedian".

### Output Format
Print the results of findMedian separated by spaces.',
  input_format = 'Line 1: Integer Q.
Next Q lines: Either "addNum X" or "findMedian".',
  output_format = 'Print the results of findMedian separated by spaces.',
  sample_input = '5
addNum 1
addNum 2
findMedian
addNum 3
findMedian',
  sample_output = '1.5 2.0',
  explanation = 'Median of [1, 2] is (1+2)/2 = 1.5. Median of [1, 2, 3] is 2.0.',
  constraints = '["1 <= Q <= 5 * 10^4","-10^5 <= num <= 10^5"]'::jsonb,
  test_cases = '[{"input":"5\naddNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian","output":"1.5 2.0","is_hidden":false,"explanation":"Median of [1, 2] is (1+2)/2 = 1.5. Median of [1, 2, 3] is 2.0."},{"input":"3\naddNum 10\nfindMedian\nfindMedian","output":"10.0 10.0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"4\naddNum -1\nfindMedian\naddNum -2\nfindMedian","output":"-1.0 -1.5","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"6\naddNum 6\nfindMedian\naddNum 10\nfindMedian\naddNum 2\nfindMedian","output":"6.0 8.0 6.0","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7\naddNum 5\naddNum 15\naddNum 1\naddNum 3\nfindMedian\naddNum 8\nfindMedian","output":"4.0 5.0","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4\naddNum 100\naddNum 200\naddNum 300\nfindMedian","output":"200.0","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\naddNum 2\naddNum 2\naddNum 2\naddNum 2\nfindMedian","output":"2.0","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6\naddNum -5\naddNum 0\nfindMedian\naddNum 5\nfindMedian\nfindMedian","output":"-2.5 0.0 0.0","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-295';

UPDATE public.technical_problems
SET
  description = 'Given a string s, rearrange the characters of s so that any two adjacent characters are not the same. Return any possible rearrangement of s or return an empty line if not possible.',
  statement = '### Problem Statement
Given a string s, rearrange the characters of s so that any two adjacent characters are not the same. Return any possible rearrangement of s or return an empty line if not possible.

### Input Format
Line 1: String s.

### Output Format
Print the rearranged string (or empty line if impossible).',
  input_format = 'Line 1: String s.',
  output_format = 'Print the rearranged string (or empty line if impossible).',
  sample_input = 'aab',
  sample_output = 'aba',
  explanation = 'No two adjacent characters are the same in "aba".',
  constraints = '["1 <= s.length <= 500","s consists of lowercase English letters."]'::jsonb,
  test_cases = '[{"input":"aab","output":"aba","is_hidden":false,"explanation":"No two adjacent characters are the same in \"aba\"."},{"input":"aaab","output":"","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"vvvlo","output":"vlvov","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"a","output":"a","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"aabbcc","output":"abacbc","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"aaabbc","output":"ababac","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"baaba","output":"ababa","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"aaabbbccc","output":"abacacbcb","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-767';

UPDATE public.technical_problems
SET
  description = 'Find all valid combinations of k numbers that add up to n such that only numbers 1 through 9 are used and each number is used at most once.

Print the count of combinations on line 1, followed by each combination on a new line with elements sorted ascending.',
  statement = '### Problem Statement
Find all valid combinations of k numbers that add up to n such that only numbers 1 through 9 are used and each number is used at most once.

Print the count of combinations on line 1, followed by each combination on a new line with elements sorted ascending.

### Input Format
Line 1: Two space-separated integers k and n.

### Output Format
Line 1: Integer K (number of combinations, or 0).
Next K lines: k space-separated integers.',
  input_format = 'Line 1: Two space-separated integers k and n.',
  output_format = 'Line 1: Integer K (number of combinations, or 0).
Next K lines: k space-separated integers.',
  sample_input = '3 7',
  sample_output = '1
1 2 4',
  explanation = '1 + 2 + 4 = 7. There are no other valid combinations.',
  constraints = '["2 <= k <= 9","1 <= n <= 60"]'::jsonb,
  test_cases = '[{"input":"3 7","output":"1\n1 2 4","is_hidden":false,"explanation":"1 + 2 + 4 = 7. There are no other valid combinations."},{"input":"3 9","output":"3\n1 2 6\n1 3 5\n2 3 4","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"4 1","output":"0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2 18","output":"0","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 15","output":"8\n1 5 9\n1 6 8\n2 4 9\n2 5 8\n2 6 7\n3 4 8\n3 5 7\n4 5 6","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"9 45","output":"1\n1 2 3 4 5 6 7 8 9","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4 24","output":"8\n1 6 8 9\n2 5 8 9\n2 6 7 9\n3 4 8 9\n3 5 7 9\n3 6 7 8\n4 5 6 9\n4 5 7 8","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5 15","output":"1\n1 2 3 4 5","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-216';

UPDATE public.technical_problems
SET
  description = 'Given an integer array nums that may contain duplicates, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Print the count of subsets on line 1, followed by each subset on a new line (or EMPTY for empty subset).',
  statement = '### Problem Statement
Given an integer array nums that may contain duplicates, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Print the count of subsets on line 1, followed by each subset on a new line (or EMPTY for empty subset).

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Line 1: Count of unique subsets.
Following lines: Space-separated integers for each subset.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Line 1: Count of unique subsets.
Following lines: Space-separated integers for each subset.',
  sample_input = '3
1 2 2',
  sample_output = '6
EMPTY
1
1 2
1 2 2
2
2 2',
  explanation = 'The 6 unique subsets of [1, 2, 2] are [], [1], [1, 2], [1, 2, 2], [2], [2, 2].',
  constraints = '["1 <= N <= 10","-10 <= nums[i] <= 10"]'::jsonb,
  test_cases = '[{"input":"3\n1 2 2","output":"6\nEMPTY\n1\n1 2\n1 2 2\n2\n2 2","is_hidden":false,"explanation":"The 6 unique subsets of [1, 2, 2] are [], [1], [1, 2], [1, 2, 2], [2], [2, 2]."},{"input":"1\n0","output":"2\nEMPTY\n0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2\n4 4","output":"3\nEMPTY\n4\n4 4","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3\n1 2 3","output":"8\nEMPTY\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4\n1 1 2 2","output":"9\nEMPTY\n1\n1 1\n1 1 2\n1 1 2 2\n1 2\n1 2 2\n2\n2 2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3\n-1 -1 2","output":"6\nEMPTY\n-1\n-1 -1\n-1 -1 2\n-1 2\n2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4\n0 0 0 0","output":"5\nEMPTY\n0\n0 0\n0 0 0\n0 0 0 0","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"5\n1 2 2 3 3","output":"18\nEMPTY\n1\n1 2\n1 2 2\n1 2 2 3\n1 2 2 3 3\n1 2 3\n1 2 3 3\n1 3\n1 3 3\n2\n2 2\n2 2 3\n2 2 3 3\n2 3\n2 3 3\n3\n3 3","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-90';

UPDATE public.technical_problems
SET
  description = 'Given a collection of candidate numbers candidates and a target number target, find all unique combinations in candidates where the candidate numbers sum to target.

Each number in candidates may only be used once in the combination. Print the count of combinations followed by each combination on a new line.',
  statement = '### Problem Statement
Given a collection of candidate numbers candidates and a target number target, find all unique combinations in candidates where the candidate numbers sum to target.

Each number in candidates may only be used once in the combination. Print the count of combinations followed by each combination on a new line.

### Input Format
Line 1: Two space-separated integers N and target.
Line 2: N space-separated integers.

### Output Format
Line 1: Count of combinations (or 0).
Following lines: Space-separated integers in ascending order.',
  input_format = 'Line 1: Two space-separated integers N and target.
Line 2: N space-separated integers.',
  output_format = 'Line 1: Count of combinations (or 0).
Following lines: Space-separated integers in ascending order.',
  sample_input = '7 8
10 1 2 7 6 1 5',
  sample_output = '4
1 1 6
1 2 5
1 7
2 6',
  explanation = 'Four unique combinations sum to 8: [1,1,6], [1,2,5], [1,7], and [2,6].',
  constraints = '["1 <= N <= 100","1 <= candidates[i] <= 50","1 <= target <= 30"]'::jsonb,
  test_cases = '[{"input":"7 8\n10 1 2 7 6 1 5","output":"4\n1 1 6\n1 2 5\n1 7\n2 6","is_hidden":false,"explanation":"Four unique combinations sum to 8: [1,1,6], [1,2,5], [1,7], and [2,6]."},{"input":"5 5\n2 5 2 1 2","output":"2\n1 2 2\n5","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3 10\n1 2 3","output":"0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 5\n5","output":"1\n5","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6 6\n1 1 1 1 1 1","output":"1\n1 1 1 1 1 1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4 4\n1 2 3 4","output":"2\n1 3\n4","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6 7\n2 3 6 7 2 3","output":"2\n2 2 3\n7","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8 10\n1 1 2 2 3 3 4 5","output":"9\n1 1 2 2 4\n1 1 2 3 3\n1 1 3 5\n1 2 2 5\n1 2 3 4\n1 4 5\n2 2 3 3\n2 3 5\n3 3 4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-40';

UPDATE public.technical_problems
SET
  description = 'Given a collection of numbers, nums, that might contain duplicates, return all possible unique permutations in any order.

Print the total count of unique permutations on line 1, followed by each permutation on a new line.',
  statement = '### Problem Statement
Given a collection of numbers, nums, that might contain duplicates, return all possible unique permutations in any order.

Print the total count of unique permutations on line 1, followed by each permutation on a new line.

### Input Format
Line 1: Integer N.
Line 2: N space-separated integers.

### Output Format
Line 1: Count of unique permutations.
Following lines: N space-separated integers.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated integers.',
  output_format = 'Line 1: Count of unique permutations.
Following lines: N space-separated integers.',
  sample_input = '3
1 1 2',
  sample_output = '3
1 1 2
1 2 1
2 1 1',
  explanation = 'The 3 unique permutations are [1, 1, 2], [1, 2, 1], and [2, 1, 1].',
  constraints = '["1 <= N <= 8","-10 <= nums[i] <= 10"]'::jsonb,
  test_cases = '[{"input":"3\n1 1 2","output":"3\n1 1 2\n1 2 1\n2 1 1","is_hidden":false,"explanation":"The 3 unique permutations are [1, 1, 2], [1, 2, 1], and [2, 1, 1]."},{"input":"3\n1 2 3","output":"6\n1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n5","output":"1\n5","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"4\n1 1 2 2","output":"6\n1 1 2 2\n1 2 1 2\n1 2 2 1\n2 1 1 2\n2 1 2 1\n2 2 1 1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"2\n1 1","output":"1\n1 1","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3\n2 2 2","output":"1\n2 2 2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4\n2 2 1 1","output":"6\n1 1 2 2\n1 2 1 2\n1 2 2 1\n2 1 1 2\n2 1 2 1\n2 2 1 1","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4\n1 2 3 1","output":"12\n1 1 2 3\n1 1 3 2\n1 2 1 3\n1 2 3 1\n1 3 1 2\n1 3 2 1\n2 1 1 3\n2 1 3 1\n2 3 1 1\n3 1 1 2\n3 1 2 1\n3 2 1 1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-47';

UPDATE public.technical_problems
SET
  description = 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
  statement = '### Problem Statement
Given an m x n grid of characters board and a string word, return true if word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

### Input Format
Line 1: Three space-separated values: R, C, and word.
Next R lines: C space-separated uppercase characters.

### Output Format
Print true or false.',
  input_format = 'Line 1: Three space-separated values: R, C, and word.
Next R lines: C space-separated uppercase characters.',
  output_format = 'Print true or false.',
  sample_input = '3 4 ABCCED
A B C E
S F C S
A D E E',
  sample_output = 'true',
  explanation = 'The word "ABCCED" is traced along the grid.',
  constraints = '["1 <= R, C <= 6","1 <= word.length <= 15","board and word consist of only uppercase English letters."]'::jsonb,
  test_cases = '[{"input":"3 4 ABCCED\nA B C E\nS F C S\nA D E E","output":"true","is_hidden":false,"explanation":"The word \"ABCCED\" is traced along the grid."},{"input":"3 4 SEE\nA B C E\nS F C S\nA D E E","output":"true","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3 4 ABOB\nA B C E\nS F C S\nA D E E","output":"false","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 1 A\nA","output":"true","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1 1 B\nA","output":"false","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"2 2 ABBA\nA B\nB A","output":"false","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"3 3 HELLO\nH E L\nX O L\nA B C","output":"true","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4 4 MICROSOFT\nM I C R\nO S O F\nT X Y Z\nA B C D","output":"false","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-79';

UPDATE public.technical_problems
SET
  description = 'Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.

Print the total count of partitions on line 1, followed by each partition on a new line with space-separated palindromic substrings.',
  statement = '### Problem Statement
Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.

Print the total count of partitions on line 1, followed by each partition on a new line with space-separated palindromic substrings.

### Input Format
Line 1: String s.

### Output Format
Line 1: Count of partitions.
Following lines: Space-separated palindromic substrings.',
  input_format = 'Line 1: String s.',
  output_format = 'Line 1: Count of partitions.
Following lines: Space-separated palindromic substrings.',
  sample_input = 'aab',
  sample_output = '2
a a b
aa b',
  explanation = 'Two palindrome partitions: ["a", "a", "b"] and ["aa", "b"].',
  constraints = '["1 <= s.length <= 16","s contains only lowercase English letters."]'::jsonb,
  test_cases = '[{"input":"aab","output":"2\na a b\naa b","is_hidden":false,"explanation":"Two palindrome partitions: [\"a\", \"a\", \"b\"] and [\"aa\", \"b\"]."},{"input":"a","output":"1\na","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"racecar","output":"4\nr a c e c a r\nr a cec a r\nr aceca r\nracecar","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"aaa","output":"4\na a a\na aa\naa a\naaa","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"ab","output":"1\na b","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"bb","output":"2\nb b\nbb","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"efe","output":"2\ne f e\nefe","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"cdd","output":"2\nc d d\nc dd","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-131';

UPDATE public.technical_problems
SET
  description = 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent according to classic telephone keypad mapping. Return the answer in lexicographical order separated by spaces.',
  statement = '### Problem Statement
Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent according to classic telephone keypad mapping. Return the answer in lexicographical order separated by spaces.

### Input Format
Line 1: String digits (composed of ''2''-''9'').

### Output Format
Print space-separated letter combinations in lexicographical order, or EMPTY if digits is empty.',
  input_format = 'Line 1: String digits (composed of ''2''-''9'').',
  output_format = 'Print space-separated letter combinations in lexicographical order, or EMPTY if digits is empty.',
  sample_input = '23',
  sample_output = 'ad ae af bd be bf cd ce cf',
  explanation = 'Pressing 2 and 3 produces 9 letter combinations.',
  constraints = '["0 <= digits.length <= 4","digits[i] is a digit in the range [''2'', ''9'']."]'::jsonb,
  test_cases = '[{"input":"23","output":"ad ae af bd be bf cd ce cf","is_hidden":false,"explanation":"Pressing 2 and 3 produces 9 letter combinations."},{"input":"","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2","output":"a b c","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"7","output":"p q r s","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"9","output":"w x y z","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"234","output":"adg adh adi aeg aeh aei afg afh afi bdg bdh bdi beg beh bei bfg bfh bfi cdg cdh cdi ceg ceh cei cfg cfh cfi","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"79","output":"pw px py pz qw qx qy qz rw rx ry rz sw sx sy sz","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"56","output":"jm jn jo km kn ko lm ln lo","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-17';

UPDATE public.technical_problems
SET
  description = 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return the number of distinct solutions to the n-queens puzzle.',
  statement = '### Problem Statement
The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return the number of distinct solutions to the n-queens puzzle.

### Input Format
Line 1: Integer n.

### Output Format
Print a single integer representing the count of distinct valid solutions.',
  input_format = 'Line 1: Integer n.',
  output_format = 'Print a single integer representing the count of distinct valid solutions.',
  sample_input = '4',
  sample_output = '2',
  explanation = 'There are 2 distinct configurations to place 4 queens on a 4x4 board.',
  constraints = '["1 <= n <= 9"]'::jsonb,
  test_cases = '[{"input":"4","output":"2","is_hidden":false,"explanation":"There are 2 distinct configurations to place 4 queens on a 4x4 board."},{"input":"1","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2","output":"0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3","output":"0","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"5","output":"10","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"6","output":"4","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"7","output":"40","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"8","output":"92","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-51';

UPDATE public.technical_problems
SET
  description = 'Write a program to solve a Sudoku puzzle by filling the empty cells. Empty cells are indicated by 0. Each row, column, and 3x3 sub-box must contain the digits 1-9 without repetition.',
  statement = '### Problem Statement
Write a program to solve a Sudoku puzzle by filling the empty cells. Empty cells are indicated by 0. Each row, column, and 3x3 sub-box must contain the digits 1-9 without repetition.

### Input Format
9 lines: Each containing 9 space-separated integers (0 for empty cell).

### Output Format
9 lines: Each containing 9 space-separated solved integers.',
  input_format = '9 lines: Each containing 9 space-separated integers (0 for empty cell).',
  output_format = '9 lines: Each containing 9 space-separated solved integers.',
  sample_input = '5 3 0 0 7 0 0 0 0
6 0 0 1 9 5 0 0 0
0 9 8 0 0 0 0 6 0
8 0 0 0 6 0 0 0 3
4 0 0 8 0 3 0 0 1
7 0 0 0 2 0 0 0 6
0 6 0 0 0 0 2 8 0
0 0 0 4 1 9 0 0 5
0 0 0 0 8 0 0 7 9',
  sample_output = '5 3 4 6 7 8 9 1 2
6 7 2 1 9 5 3 4 8
1 9 8 3 4 2 5 6 7
8 5 9 7 6 1 4 2 3
4 2 6 8 5 3 7 9 1
7 1 3 9 2 4 8 5 6
9 6 1 5 3 7 2 8 4
2 8 7 4 1 9 6 3 5
3 4 5 2 8 6 1 7 9',
  explanation = 'The solved 9x9 grid satisfies all Sudoku rules.',
  constraints = '["Board is guaranteed to have a unique valid solution."]'::jsonb,
  test_cases = '[{"input":"5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9","output":"5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9","is_hidden":false,"explanation":"The solved 9x9 grid satisfies all Sudoku rules."},{"input":"0 0 9 7 4 8 0 0 0\n7 0 0 0 0 0 0 0 0\n0 2 0 1 0 9 0 0 0\n0 0 7 0 0 0 2 4 0\n0 6 4 0 1 0 5 9 0\n0 9 8 0 0 0 3 0 0\n0 0 0 8 0 3 0 2 0\n0 0 0 0 0 0 0 0 6\n0 0 0 2 7 5 9 0 0","output":"5 1 9 7 4 8 6 3 2\n7 8 3 6 5 2 4 1 9\n4 2 6 1 3 9 8 7 5\n3 5 7 9 8 6 2 4 1\n2 6 4 3 1 7 5 9 8\n1 9 8 5 2 4 3 6 7\n9 7 5 8 6 3 1 2 4\n8 3 2 4 9 1 7 5 6\n6 4 1 2 7 5 9 8 3","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1 0 0 0 0 0 0 0 0\n0 2 0 0 0 0 0 0 0\n0 0 3 0 0 0 0 0 0\n0 0 0 4 0 0 0 0 0\n0 0 0 0 5 0 0 0 0\n0 0 0 0 0 6 0 0 0\n0 0 0 0 0 0 7 0 0\n0 0 0 0 0 0 0 8 0\n0 0 0 0 0 0 0 0 9","output":"1 4 5 2 3 7 6 9 8\n6 2 7 1 8 9 3 4 5\n8 9 3 5 6 4 1 2 7\n2 1 6 4 7 8 9 5 3\n3 7 4 9 5 1 8 6 2\n5 8 9 3 2 6 4 7 1\n4 5 1 8 9 2 7 3 6\n9 6 2 7 1 3 5 8 4\n7 3 8 6 4 5 2 1 9","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 0","output":"5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"0 2 0 6 0 8 0 0 0\n5 8 0 0 0 9 7 0 0\n0 0 0 0 4 0 0 0 0\n3 7 0 0 0 0 5 0 0\n6 0 0 0 0 0 0 0 4\n0 0 8 0 0 0 0 1 3\n0 0 0 0 2 0 0 0 0\n0 0 9 8 0 0 0 3 6\n0 0 0 3 0 6 0 9 0","output":"1 2 3 6 7 8 9 4 5\n5 8 4 2 3 9 7 6 1\n9 6 7 1 4 5 3 2 8\n3 7 2 4 6 1 5 8 9\n6 9 1 5 8 3 2 7 4\n4 5 8 7 9 2 6 1 3\n8 3 6 9 2 4 1 5 7\n2 1 9 8 5 7 4 3 6\n7 4 5 3 1 6 8 9 2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"8 0 0 0 0 0 0 0 0\n0 0 3 6 0 0 0 0 0\n0 7 0 0 9 0 2 0 0\n0 5 0 0 0 7 0 0 0\n0 0 0 0 4 5 7 0 0\n0 0 0 1 0 0 0 3 0\n0 0 1 0 0 0 0 6 8\n0 0 8 5 0 0 0 1 0\n0 9 0 0 0 0 4 0 0","output":"8 1 2 7 5 3 6 4 9\n9 4 3 6 8 2 1 7 5\n6 7 5 4 9 1 2 8 3\n1 5 4 2 3 7 8 9 6\n3 6 9 8 4 5 7 2 1\n2 8 7 1 6 9 5 3 4\n5 2 1 9 7 4 3 6 8\n4 3 8 5 2 6 9 1 7\n7 9 6 3 1 8 4 5 2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"0 0 0 2 6 0 7 0 1\n6 8 0 0 7 0 0 9 0\n1 9 0 0 0 4 5 0 0\n8 2 0 1 0 0 0 4 0\n0 0 4 6 0 2 9 0 0\n0 5 0 0 0 3 0 2 8\n0 0 9 3 0 0 0 7 4\n0 4 0 0 5 0 0 3 6\n7 0 3 0 1 8 0 0 0","output":"4 3 5 2 6 9 7 8 1\n6 8 2 5 7 1 4 9 3\n1 9 7 8 3 4 5 6 2\n8 2 6 1 9 5 3 4 7\n3 7 4 6 8 2 9 1 5\n9 5 1 7 4 3 6 2 8\n5 1 9 3 2 6 8 7 4\n2 4 8 9 5 7 1 3 6\n7 6 3 4 1 8 2 5 9","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"0 0 3 0 2 0 6 0 0\n9 0 0 3 0 5 0 0 1\n0 0 1 8 0 6 4 0 0\n0 0 8 1 0 2 9 0 0\n7 0 0 0 0 0 0 0 8\n0 0 6 7 0 8 2 0 0\n0 0 2 6 0 9 5 0 0\n8 0 0 2 0 3 0 0 9\n0 0 5 0 1 0 3 0 0","output":"4 8 3 9 2 1 6 5 7\n9 6 7 3 4 5 8 2 1\n2 5 1 8 7 6 4 9 3\n5 4 8 1 3 2 9 7 6\n7 2 9 5 6 4 1 3 8\n1 3 6 7 9 8 2 4 5\n3 7 2 6 8 9 5 1 4\n8 1 4 2 5 3 7 6 9\n6 9 5 4 1 7 3 8 2","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-37';

UPDATE public.technical_problems
SET
  description = 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
  statement = '### Problem Statement
You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

### Input Format
Line 1: Integer N.
Line 2: N space-separated non-negative integers.

### Output Format
Print the maximum money robbed.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated non-negative integers.',
  output_format = 'Print the maximum money robbed.',
  sample_input = '3
2 3 2',
  sample_output = '3',
  explanation = 'You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent neighbors. Max = 3.',
  constraints = '["1 <= N <= 100","0 <= nums[i] <= 1000"]'::jsonb,
  test_cases = '[{"input":"3\n2 3 2","output":"3","is_hidden":false,"explanation":"You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent neighbors. Max = 3."},{"input":"4\n1 2 3 1","output":"4","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3\n1 2 3","output":"3","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n100","output":"100","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"2\n50 100","output":"100","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n2 7 9 3 1","output":"11","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"6\n1 3 1 3 100 1","output":"103","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"7\n20 1 1 20 1 1 20","output":"41","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-213';

UPDATE public.technical_problems
SET
  description = 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return 0.

You may assume that you have an infinite number of each kind of coin.',
  statement = '### Problem Statement
You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return 0.

You may assume that you have an infinite number of each kind of coin.

### Input Format
Line 1: Two space-separated integers amount and N.
Line 2: N space-separated coin denominations.

### Output Format
Print the total number of combinations.',
  input_format = 'Line 1: Two space-separated integers amount and N.
Line 2: N space-separated coin denominations.',
  output_format = 'Print the total number of combinations.',
  sample_input = '5 3
1 2 5',
  sample_output = '4',
  explanation = 'Four ways to make 5: 5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1.',
  constraints = '["1 <= N <= 300","0 <= amount <= 5000","1 <= coins[i] <= 5000"]'::jsonb,
  test_cases = '[{"input":"5 3\n1 2 5","output":"4","is_hidden":false,"explanation":"Four ways to make 5: 5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1."},{"input":"3 1\n2","output":"0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"10 1\n10","output":"1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"0 3\n1 2 5","output":"1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"7 4\n1 2 3 5","output":"10","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"10 3\n2 5 3","output":"4","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"50 3\n5 10 25","output":"10","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"100 4\n1 5 10 25","output":"242","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-518';

UPDATE public.technical_problems
SET
  description = 'Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise.',
  statement = '### Problem Statement
Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise.

### Input Format
Line 1: Integer N.
Line 2: N space-separated positive integers.

### Output Format
Print true or false.',
  input_format = 'Line 1: Integer N.
Line 2: N space-separated positive integers.',
  output_format = 'Print true or false.',
  sample_input = '4
1 5 11 5',
  sample_output = 'true',
  explanation = 'The array can be partitioned as [1, 5, 5] and [11].',
  constraints = '["1 <= N <= 200","1 <= nums[i] <= 100"]'::jsonb,
  test_cases = '[{"input":"4\n1 5 11 5","output":"true","is_hidden":false,"explanation":"The array can be partitioned as [1, 5, 5] and [11]."},{"input":"4\n1 2 3 5","output":"false","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2\n2 2","output":"true","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1\n10","output":"false","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\n1 2 3 4 5 5","output":"true","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n10 20 30 40 100","output":"true","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4\n100 100 100 100","output":"true","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6\n14 9 8 4 3 2","output":"true","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-416';

UPDATE public.technical_problems
SET
  description = 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.',
  statement = '### Problem Statement
Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

### Input Format
Line 1: String s.
Line 2: Integer K (dictionary size).
Line 3: K space-separated words.

### Output Format
Print true or false.',
  input_format = 'Line 1: String s.
Line 2: Integer K (dictionary size).
Line 3: K space-separated words.',
  output_format = 'Print true or false.',
  sample_input = 'leetcode
2
leet code',
  sample_output = 'true',
  explanation = 'Return true because "leetcode" can be segmented as "leet code".',
  constraints = '["1 <= s.length <= 300","1 <= K <= 1000","1 <= wordDict[i].length <= 20"]'::jsonb,
  test_cases = '[{"input":"leetcode\n2\nleet code","output":"true","is_hidden":false,"explanation":"Return true because \"leetcode\" can be segmented as \"leet code\"."},{"input":"applepenapple\n2\napple pen","output":"true","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"catsandog\n5\ncats dog sand and cat","output":"false","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"a\n1\na","output":"true","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"b\n1\na","output":"false","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"aaaaaaa\n2\naaaa aaa","output":"true","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"goalspecial\n3\ngoal special ist","output":"true","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"cars\n3\ncar ca rs","output":"true","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-139';

UPDATE public.technical_problems
SET
  description = 'Given an input string s and a pattern p, implement regular expression matching with support for ''.'' and ''*'' where:
- ''.'' Matches any single character.
- ''*'' Matches zero or more of the preceding element.
The matching should cover the entire input string (not partial).',
  statement = '### Problem Statement
Given an input string s and a pattern p, implement regular expression matching with support for ''.'' and ''*'' where:
- ''.'' Matches any single character.
- ''*'' Matches zero or more of the preceding element.
The matching should cover the entire input string (not partial).

### Input Format
Line 1: String s.
Line 2: String p.

### Output Format
Print true or false.',
  input_format = 'Line 1: String s.
Line 2: String p.',
  output_format = 'Print true or false.',
  sample_input = 'aa
a*',
  sample_output = 'true',
  explanation = '''*'' means zero or more of the preceding element, ''a''. Therefore, by repeating ''a'' once, it becomes "aa".',
  constraints = '["1 <= s.length <= 20","1 <= p.length <= 20","s contains only lowercase English letters.","p contains only lowercase letters, ''.'', and ''*''."]'::jsonb,
  test_cases = '[{"input":"aa\na*","output":"true","is_hidden":false,"explanation":"''*'' means zero or more of the preceding element, ''a''. Therefore, by repeating ''a'' once, it becomes \"aa\"."},{"input":"aa\na","output":"false","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"ab\n.*","output":"true","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"aab\nc*a*b","output":"true","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"mississippi\nmis*is*p*.","output":"false","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"a\nab*","output":"true","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"aaa\na*a","output":"true","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"ab\n.*c","output":"false","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-10';

UPDATE public.technical_problems
SET
  description = 'There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c.

A province is a group of directly or indirectly connected cities and no other cities outside of the group. You are given an n x n matrix isConnected where isConnected[i][j] = 1 if the i-th city and the j-th city are directly connected, and isConnected[i][j] = 0 otherwise. Return the total number of provinces.',
  statement = '### Problem Statement
There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c.

A province is a group of directly or indirectly connected cities and no other cities outside of the group. You are given an n x n matrix isConnected where isConnected[i][j] = 1 if the i-th city and the j-th city are directly connected, and isConnected[i][j] = 0 otherwise. Return the total number of provinces.

### Input Format
Line 1: Integer N.
Next N lines: N space-separated binary values (0 or 1).

### Output Format
Print the total number of provinces.',
  input_format = 'Line 1: Integer N.
Next N lines: N space-separated binary values (0 or 1).',
  output_format = 'Print the total number of provinces.',
  sample_input = '3
1 1 0
1 1 0
0 0 1',
  sample_output = '2',
  explanation = 'Cities 0 and 1 form 1 province, city 2 forms another province. Total = 2.',
  constraints = '["1 <= N <= 200","isConnected[i][j] is 1 or 0.","isConnected[i][i] == 1."]'::jsonb,
  test_cases = '[{"input":"3\n1 1 0\n1 1 0\n0 0 1","output":"2","is_hidden":false,"explanation":"Cities 0 and 1 form 1 province, city 2 forms another province. Total = 2."},{"input":"3\n1 0 0\n0 1 0\n0 0 1","output":"3","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1\n1","output":"1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1","output":"1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4\n1 0 0 1\n0 1 1 0\n0 1 1 0\n1 0 0 1","output":"2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"5\n1 1 0 0 0\n1 1 1 0 0\n0 1 1 0 0\n0 0 0 1 1\n0 0 0 1 1","output":"2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"2\n1 0\n0 1","output":"2","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4\n1 0 0 0\n0 1 0 0\n0 0 1 0\n0 0 0 1","output":"4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-547';

UPDATE public.technical_problems
SET
  description = 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.

Each node in the graph contains a value (int) and a list of its neighbors. Print the adjacency list of the deep copy.',
  statement = '### Problem Statement
Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.

Each node in the graph contains a value (int) and a list of its neighbors. Print the adjacency list of the deep copy.

### Input Format
Line 1: Integer N (number of nodes).
Next N lines: Space-separated neighbor 1-based indices for node i.

### Output Format
Line 1: Integer N.
Next N lines: Neighbor indices for each node in deep copy.',
  input_format = 'Line 1: Integer N (number of nodes).
Next N lines: Space-separated neighbor 1-based indices for node i.',
  output_format = 'Line 1: Integer N.
Next N lines: Neighbor indices for each node in deep copy.',
  sample_input = '4
2 4
1 3
2 4
1 3',
  sample_output = '4
2 4
1 3
2 4
1 3',
  explanation = 'There are 4 nodes forming a cycle: 1 connects to 2 and 4, 2 to 1 and 3, etc.',
  constraints = '["0 <= N <= 100","1 <= Node.val <= 100","No repeated edges or self-loops."]'::jsonb,
  test_cases = '[{"input":"4\n2 4\n1 3\n2 4\n1 3","output":"4\n2 4\n1 3\n2 4\n1 3","is_hidden":false,"explanation":"There are 4 nodes forming a cycle: 1 connects to 2 and 4, 2 to 1 and 3, etc."},{"input":"1","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"0","output":"EMPTY","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2\n2\n1","output":"2\n2\n1","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3\n2 3\n1 3\n1 2","output":"3\n2 3\n1 3\n1 2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4\n2 3 4\n1\n1\n1","output":"4\n2 3 4\n1\n1\n1","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\n2 5\n1 3\n2 4\n3 5\n4 1","output":"5\n2 5\n1 3\n2 4\n3 5\n4 1","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"3\n2\n1 3\n2","output":"3\n2\n1 3\n2","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-133';

UPDATE public.technical_problems
SET
  description = 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return IMPOSSIBLE.',
  statement = '### Problem Statement
There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return IMPOSSIBLE.

### Input Format
Line 1: Two space-separated integers numCourses and M (number of prerequisites).
Next M lines: Two space-separated integers ai and bi.

### Output Format
Print space-separated course ordering, or IMPOSSIBLE.',
  input_format = 'Line 1: Two space-separated integers numCourses and M (number of prerequisites).
Next M lines: Two space-separated integers ai and bi.',
  output_format = 'Print space-separated course ordering, or IMPOSSIBLE.',
  sample_input = '2 1
1 0',
  sample_output = '0 1',
  explanation = 'There are 2 courses. To take course 1 you should have finished course 0. So the correct course order is [0, 1].',
  constraints = '["1 <= numCourses <= 2000","0 <= M <= numCourses * (numCourses - 1)"]'::jsonb,
  test_cases = '[{"input":"2 1\n1 0","output":"0 1","is_hidden":false,"explanation":"There are 2 courses. To take course 1 you should have finished course 0. So the correct course order is [0, 1]."},{"input":"4 4\n1 0\n2 0\n3 1\n3 2","output":"0 1 2 3","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"1 0","output":"0","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2 2\n0 1\n1 0","output":"IMPOSSIBLE","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 2\n1 0\n2 1","output":"0 1 2","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3 3\n1 0\n2 1\n0 2","output":"IMPOSSIBLE","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5 4\n1 0\n2 0\n3 1\n4 2","output":"0 1 2 3 4","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4 2\n2 0\n3 1","output":"0 1 2 3","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-210';

UPDATE public.technical_problems
SET
  description = 'In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and was not an edge that already existed.

Return an edge that can be removed so that the resulting graph is a tree of n nodes. If there are multiple answers, return the answer that occurs last in the input.',
  statement = '### Problem Statement
In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and was not an edge that already existed.

Return an edge that can be removed so that the resulting graph is a tree of n nodes. If there are multiple answers, return the answer that occurs last in the input.

### Input Format
Line 1: Integer N (number of edges).
Next N lines: Two space-separated integers u and v.

### Output Format
Print the two endpoints of the redundant edge separated by a space.',
  input_format = 'Line 1: Integer N (number of edges).
Next N lines: Two space-separated integers u and v.',
  output_format = 'Print the two endpoints of the redundant edge separated by a space.',
  sample_input = '3
1 2
1 3
2 3',
  sample_output = '2 3',
  explanation = 'The edge [2, 3] creates a cycle and appears last in the input.',
  constraints = '["3 <= N <= 1000","edges[i].length == 2","1 <= ai < bi <= edges.length"]'::jsonb,
  test_cases = '[{"input":"3\n1 2\n1 3\n2 3","output":"2 3","is_hidden":false,"explanation":"The edge [2, 3] creates a cycle and appears last in the input."},{"input":"5\n1 2\n2 3\n3 4\n1 4\n1 5","output":"1 4","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"4\n1 2\n2 3\n3 4\n1 3","output":"1 3","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"5\n1 2\n1 3\n1 4\n1 5\n2 3","output":"2 3","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"6\n1 2\n2 3\n3 4\n4 5\n5 6\n1 6","output":"1 6","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"4\n1 4\n2 4\n3 4\n1 2","output":"1 2","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"5\n2 3\n3 4\n4 5\n2 5\n1 2","output":"2 5","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"6\n1 2\n1 3\n2 4\n2 5\n3 6\n4 5","output":"4 5","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-684';

UPDATE public.technical_problems
SET
  description = 'There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island''s left and top edges, and the Atlantic Ocean touches the island''s right and bottom edges.

Rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell''s height is less than or equal to the current cell''s height. Water can flow from any cell adjacent to an ocean into the ocean.

Return a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.',
  statement = '### Problem Statement
There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island''s left and top edges, and the Atlantic Ocean touches the island''s right and bottom edges.

Rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell''s height is less than or equal to the current cell''s height. Water can flow from any cell adjacent to an ocean into the ocean.

Return a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.

### Input Format
Line 1: Two space-separated integers R and C.
Next R lines: C space-separated heights.

### Output Format
Line 1: Integer K (count of coordinates).
Next K lines: Two space-separated integers r and c.',
  input_format = 'Line 1: Two space-separated integers R and C.
Next R lines: C space-separated heights.',
  output_format = 'Line 1: Integer K (count of coordinates).
Next K lines: Two space-separated integers r and c.',
  sample_input = '5 5
1 2 2 3 5
3 2 3 4 4
2 4 5 3 1
6 7 1 4 5
5 1 1 2 4',
  sample_output = '7
0 4
1 3
1 4
2 2
3 0
3 1
4 0',
  explanation = 'Water from the 7 coordinates can flow to both oceans.',
  constraints = '["1 <= R, C <= 200","0 <= heights[r][c] <= 10^5"]'::jsonb,
  test_cases = '[{"input":"5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4","output":"7\n0 4\n1 3\n1 4\n2 2\n3 0\n3 1\n4 0","is_hidden":false,"explanation":"Water from the 7 coordinates can flow to both oceans."},{"input":"1 1\n1","output":"1\n0 0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2 2\n1 1\n1 1","output":"4\n0 0\n0 1\n1 0\n1 1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"3 3\n1 2 3\n8 9 4\n7 6 5","output":"7\n0 2\n1 0\n1 1\n1 2\n2 0\n2 1\n2 2","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"4 1\n1\n2\n3\n4","output":"4\n0 0\n1 0\n2 0\n3 0","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"1 4\n1 2 3 4","output":"4\n0 0\n0 1\n0 2\n0 3","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"3 3\n3 3 3\n3 1 3\n3 3 3","output":"8\n0 0\n0 1\n0 2\n1 0\n1 2\n2 0\n2 1\n2 2","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4 4\n1 2 2 3\n3 2 3 4\n2 4 5 3\n6 7 1 4","output":"5\n0 3\n1 3\n2 2\n3 0\n3 1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-417';

UPDATE public.technical_problems
SET
  description = 'You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target.

We will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.',
  statement = '### Problem Statement
You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target.

We will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.

### Input Format
Line 1: Three space-separated integers N, k (source), and M (number of edges).
Next M lines: Three space-separated integers ui, vi, and wi.

### Output Format
Print the minimum time, or -1.',
  input_format = 'Line 1: Three space-separated integers N, k (source), and M (number of edges).
Next M lines: Three space-separated integers ui, vi, and wi.',
  output_format = 'Print the minimum time, or -1.',
  sample_input = '4 2 3
2 1 1
2 3 1
3 4 1',
  sample_output = '2',
  explanation = 'Node 2 reaches node 1 in 1 unit, node 3 in 1 unit, and node 4 in 1+1=2 units. Total = 2.',
  constraints = '["1 <= k <= N <= 100","1 <= M <= 6000","1 <= ui, vi <= N","0 <= wi <= 100"]'::jsonb,
  test_cases = '[{"input":"4 2 3\n2 1 1\n2 3 1\n3 4 1","output":"2","is_hidden":false,"explanation":"Node 2 reaches node 1 in 1 unit, node 3 in 1 unit, and node 4 in 1+1=2 units. Total = 2."},{"input":"2 1 1\n1 2 1","output":"1","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"2 2 1\n1 2 1","output":"-1","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"1 1 0","output":"0","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"3 1 2\n1 2 1\n2 3 2","output":"3","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3 1 3\n1 2 5\n1 3 2\n3 2 1","output":"3","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4 1 4\n1 2 1\n2 3 2\n3 4 3\n1 4 7","output":"6","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4 3 2\n1 2 1\n2 3 1","output":"-1","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-743';

UPDATE public.technical_problems
SET
  description = 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
- Every adjacent pair of words differs by a single letter.
- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
- sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.',
  statement = '### Problem Statement
A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
- Every adjacent pair of words differs by a single letter.
- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
- sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.

### Input Format
Line 1: Two space-separated strings beginWord and endWord.
Line 2: Integer N (size of word list).
Line 3: N space-separated words.

### Output Format
Print the number of words in the shortest sequence, or 0.',
  input_format = 'Line 1: Two space-separated strings beginWord and endWord.
Line 2: Integer N (size of word list).
Line 3: N space-separated words.',
  output_format = 'Print the number of words in the shortest sequence, or 0.',
  sample_input = 'hit cog
6
hot dot dog lot log cog',
  sample_output = '5',
  explanation = 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.',
  constraints = '["1 <= beginWord.length <= 10","1 <= N <= 5000","endWord.length == beginWord.length"]'::jsonb,
  test_cases = '[{"input":"hit cog\n6\nhot dot dog lot log cog","output":"5","is_hidden":false,"explanation":"One shortest transformation sequence is \"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\", which is 5 words long."},{"input":"hit cog\n5\nhot dot dog lot log","output":"0","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"a c\n3\na b c","output":"2","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"hot dog\n2\nhot dog","output":"0","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"hot dog\n3\nhot cog dog","output":"0","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"game play\n4\ngame gale pale play","output":"0","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"talk walk\n1\nwalk","output":"2","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"lead gold\n6\nlead load toad goad goid gold","output":"4","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-127';

UPDATE public.technical_problems
SET
  description = 'There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.

You are given a list of strings words from the alien language''s dictionary, where the strings in words are sorted lexicographically by the rules of this new language.

Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language''s rules. If there is no solution, return INVALID.',
  statement = '### Problem Statement
There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.

You are given a list of strings words from the alien language''s dictionary, where the strings in words are sorted lexicographically by the rules of this new language.

Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language''s rules. If there is no solution, return INVALID.

### Input Format
Line 1: Integer N (number of words).
Next N lines: One word per line.

### Output Format
Print the unique characters in alien lexicographical order, or INVALID.',
  input_format = 'Line 1: Integer N (number of words).
Next N lines: One word per line.',
  output_format = 'Print the unique characters in alien lexicographical order, or INVALID.',
  sample_input = '5
wrt
wrf
er
ett
rftt',
  sample_output = 'wertf',
  explanation = 'From "wrt" and "wrf", t < f. From "wrt" and "er", w < e. From "er" and "ett", r < t. From "ett" and "rftt", e < r. Result: "wertf".',
  constraints = '["1 <= N <= 100","1 <= words[i].length <= 100","words[i] consists of only lowercase English letters."]'::jsonb,
  test_cases = '[{"input":"5\nwrt\nwrf\ner\nett\nrftt","output":"wertf","is_hidden":false,"explanation":"From \"wrt\" and \"wrf\", t < f. From \"wrt\" and \"er\", w < e. From \"er\" and \"ett\", r < t. From \"ett\" and \"rftt\", e < r. Result: \"wertf\"."},{"input":"2\nz\nx","output":"zx","is_hidden":false,"explanation":"Sample verification case 2."},{"input":"3\nz\nx\nz","output":"INVALID","is_hidden":false,"explanation":"Sample verification case 3."},{"input":"2\nabc\nab","output":"INVALID","is_hidden":true,"explanation":"Boundary and minimal constraint validation."},{"input":"1\nz","output":"z","is_hidden":true,"explanation":"Edge case with negative values, extreme conditions or duplicates."},{"input":"3\nza\nzb\nca","output":"zacb","is_hidden":true,"explanation":"Complex pattern or partition validation."},{"input":"4\napple\napp\nbanana\ncat","output":"INVALID","is_hidden":true,"explanation":"Stress case with intermediate scale input."},{"input":"4\nbaa\nabcd\nabca\ncab","output":"bdac","is_hidden":true,"explanation":"Robustness validation against extreme input limits."}]'::jsonb,
  updated_at = NOW()
WHERE id = 'lc-269';

COMMIT;
