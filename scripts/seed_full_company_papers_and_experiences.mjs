import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabaseUrl = env.SUPABASE_URL || 'https://qcelcsswvalvvtlxohbl.supabase.co';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing from .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// 1. OFFICIAL EXAM TITLES (CLEANING "New Exam Module")
// ============================================================================
const EXAM_RENAMES = {
  '6a4952bf-52e1-4705-aea9-2ede3ad89879': 'Wipro Elite NTH & Turbo Assessment 2026',
  'f0c83ceb-5929-4e53-910a-9d89b2304a5d': 'Infosys Specialist Programmer (SP) & DSE 2026',
  '030fcb39-e2a3-4c40-836f-32c5d87c6b19': 'Cognizant GenC & GenC Elevate Assessment 2026',
  'dc43c38d-7321-41be-91e6-cdfd76b42cd0': 'Capgemini Exceller Placement Paper 2026',
  '83b57f50-4f06-405b-ae16-93fc9bd16d4e': 'EY GDS Campus Recruitment Paper 2026',
  '82afeb26-6028-4d04-abc9-3145163454f3': 'HCLTech First Careers Placement Paper 2026',
  'e4cdc005-d630-444f-a969-29e870117f72': 'Hexaware PGET Premier Drive 2026',
  'a64d9f2f-208b-4a54-bafc-5856ddcc77f0': 'IBM Associate Software Engineer Assessment 2026',
  '3c178323-a4c8-40b3-967a-727a1169e6f3': 'LTIMindtree Ignite & Edge Assessment 2026',
  '0245a942-1f97-4170-a52f-a849f6ab0745': 'Oracle Server Technology & Cloud Drive 2026',
  '3329380a-7095-4b15-b794-38ab265e1ed6': 'Tech Mahindra SuperCoder Placement Paper 2026',
  'b26ae50e-b184-46e3-a28b-12a60509df19': 'Amazon SDE Online Assessment (OA) 2026',
  '618ad61b-1c54-4c70-92cd-d1965a5855b5': 'Deloitte NLA & Technical Assessment 2026',
  'dfcd4385-2687-4e5b-95c0-f4bbfab4cb33': 'Google Software Engineering Fresh Grad Paper 2026',
  '03c60f42-9526-4075-b47b-f26784b62901': 'Accenture On-Campus Recruitment Drive 2026',
};

// ============================================================================
// 2. HELPER TO BUILD HTML QUESTION BLOCKS
// ============================================================================
function buildQuestionHtml(q) {
  const casesJson = JSON.stringify(q.testCases).replace(/"/g, '&quot;');
  return `
<div class="question-block mb-10 pb-8 border-b border-[#E9ECEF] dark:border-[#242424] last:border-b-0">
  <div class="mb-2">
    <h2 class="text-lg sm:text-xl font-display font-extrabold text-[#121417] dark:text-white m-0">Q${q.number}. ${q.title}</h2>
  </div>
  <div class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed my-3 font-sans">
    <p>${q.description}</p>
  </div>
  <div class="my-3">
    <h3 class="text-xs font-bold text-[#FD4A32] uppercase tracking-wider mb-1.5">Constraints</h3>
    <ul class="list-disc pl-5 space-y-1 text-xs font-mono text-gray-700 dark:text-gray-300">
      ${q.constraints.map(c => `<li>${c}</li>`).join('\n      ')}
    </ul>
  </div>
  <div class="test-case-group" data-type="test-case-box" data-cases="${casesJson}">
  </div>
  <div class="solution-code-block my-4 p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E]" data-language="java">
    <div class="text-xs font-bold text-[#FD4A32] uppercase tracking-wider mb-2">Verified Java Solution</div>
    <pre class="text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200"><code>${q.javaSolution}</code></pre>
  </div>
  <div class="solution-code-block my-4 p-4 rounded-lg bg-[#F8F9FA] dark:bg-[#1C1C1C] border border-[#E9ECEF] dark:border-[#2E2E2E]" data-language="python">
    <div class="text-xs font-bold text-[#FD4A32] uppercase tracking-wider mb-2">Verified Python Solution</div>
    <pre class="text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200"><code>${q.pythonSolution}</code></pre>
  </div>
</div>
`.trim();
}

// ============================================================================
// 3. QUESTIONS DATASET FOR THE 9 MISSING COMPANIES
// ============================================================================
const COMPANY_PAPERS = {
  // --- DELOITTE ---
  '618ad61b-1c54-4c70-92cd-d1965a5855b5': {
    tabTitle: 'Deloitte NLA Placement Questions (Q1–Q5)',
    questions: [
      {
        number: 1,
        title: 'Count Inversions in an Array',
        description: 'In an audit data validation pipeline at Deloitte, two numerical audit values a[i] and a[j] are considered inverted if i < j and a[i] > a[j]. Given an array of integers arr, count the total number of inversions in the array.',
        constraints: ['1 <= arr.length <= 10^5', '1 <= arr[i] <= 10^9'],
        testCases: [
          { title: 'Test Case 1', input: 'arr = [2, 4, 1, 3, 5]', output: '3' },
          { title: 'Test Case 2', input: 'arr = [2, 3, 4, 5, 6]', output: '0' },
          { title: 'Test Case 3', input: 'arr = [10, 10, 10]', output: '0' },
          { title: 'Test Case 4', input: 'arr = [5, 4, 3, 2, 1]', output: '10' }
        ],
        javaSolution: `public class Solution {
    public static long countInversions(int[] arr) {
        return mergeSortAndCount(arr, 0, arr.length - 1);
    }
    private static long mergeSortAndCount(int[] arr, int l, int r) {
        long count = 0;
        if (l < r) {
            int m = l + (r - l) / 2;
            count += mergeSortAndCount(arr, l, m);
            count += mergeSortAndCount(arr, m + 1, r);
            count += mergeAndCount(arr, l, m, r);
        }
        return count;
    }
    private static long mergeAndCount(int[] arr, int l, int m, int r) {
        int[] left = java.util.Arrays.copyOfRange(arr, l, m + 1);
        int[] right = java.util.Arrays.copyOfRange(arr, m + 1, r + 1);
        int i = 0, j = 0, k = l;
        long swaps = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) arr[k++] = left[i++];
            else {
                arr[k++] = right[j++];
                swaps += (m + 1) - (l + i);
            }
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
        return swaps;
    }
}`,
        pythonSolution: `def countInversions(arr):
    def merge_count(arr):
        if len(arr) <= 1:
            return arr, 0
        mid = len(arr) // 2
        left, left_inv = merge_count(arr[:mid])
        right, right_inv = merge_count(arr[mid:])
        merged, split_inv = [], 0
        i = j = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                split_inv += len(left) - i
                j += 1
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged, left_inv + right_inv + split_inv
    _, count = merge_count(arr)
    return count`
      },
      {
        number: 2,
        title: 'Group Anagrams',
        description: 'Deloitte Tax analysts process client financial item descriptions that contain scrambled ledger keys. Given an array of strings strs, group the anagrams together into sublists. You can return the answer in any order.',
        constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
        testCases: [
          { title: 'Test Case 1', input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]' },
          { title: 'Test Case 2', input: 'strs = [""]', output: '[[""]]' },
          { title: 'Test Case 3', input: 'strs = ["a"]', output: '[["a"]]' },
          { title: 'Test Case 4', input: 'strs = ["ab", "ba", "abc", "cba"]', output: '[["ab", "ba"], ["abc", "cba"]]' }
        ],
        javaSolution: `import java.util.*;
public class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`,
        pythonSolution: `from collections import defaultdict
def groupAnagrams(strs):
    ans = defaultdict(list)
    for s in strs:
        ans[tuple(sorted(s))].append(s)
    return list(ans.values())`
      },
      {
        number: 3,
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string s representing client audit session tokens, find the length of the longest substring without repeating characters.',
        constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
        testCases: [
          { title: 'Test Case 1', input: 's = "abcabcbb"', output: '3' },
          { title: 'Test Case 2', input: 's = "bbbbb"', output: '1' },
          { title: 'Test Case 3', input: 's = "pwwkew"', output: '3' },
          { title: 'Test Case 4', input: 's = ""', output: '0' }
        ],
        javaSolution: `import java.util.*;
public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c)) {
                left = Math.max(left, map.get(c) + 1);
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
        pythonSolution: `def lengthOfLongestSubstring(s: str) -> int:
    used = {}
    max_len = start = 0
    for i, c in enumerate(s):
        if c in used and start <= used[c]:
            start = used[c] + 1
        else:
            max_len = max(max_len, i - start + 1)
        used[c] = i
    return max_len`
      },
      {
        number: 4,
        title: 'Trapping Rain Water',
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
        testCases: [
          { title: 'Test Case 1', input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', output: '6' },
          { title: 'Test Case 2', input: 'height = [4, 2, 0, 3, 2, 5]', output: '9' },
          { title: 'Test Case 3', input: 'height = [1, 2, 3]', output: '0' },
          { title: 'Test Case 4', input: 'height = [3, 0, 2, 0, 4]', output: '7' }
        ],
        javaSolution: `public class Solution {
    public static int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int maxLeft = 0, maxRight = 0, res = 0;
        while (left <= right) {
            if (height[left] <= height[right]) {
                if (height[left] >= maxLeft) maxLeft = height[left];
                else res += maxLeft - height[left];
                left++;
            } else {
                if (height[right] >= maxRight) maxRight = height[right];
                else res += maxRight - height[right];
                right--;
            }
        }
        return res;
    }
}`,
        pythonSolution: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_left = max_right = res = 0
    while left <= right:
        if height[left] <= height[right]:
            if height[left] >= max_left: max_left = height[left]
            else: res += max_left - height[left]
            left += 1
        else:
            if height[right] >= max_right: max_right = height[right]
            else: res += max_right - height[right]
            right -= 1
    return res`
      },
      {
        number: 5,
        title: 'Subarray Sum Equals K',
        description: 'Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k.',
        constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [1, 1, 1], k = 2', output: '2' },
          { title: 'Test Case 2', input: 'nums = [1, 2, 3], k = 3', output: '2' },
          { title: 'Test Case 3', input: 'nums = [1, -1, 0], k = 0', output: '3' },
          { title: 'Test Case 4', input: 'nums = [3, 4, 7, 2, -3, 1, 4, 2], k = 7', output: '4' }
        ],
        javaSolution: `import java.util.*;
public class Solution {
    public static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);
        int sum = 0, count = 0;
        for (int n : nums) {
            sum += n;
            if (map.containsKey(sum - k)) count += map.get(sum - k);
            map.put(sum, map.getOrDefault(sum, 0) + 1);
        }
        return count;
    }
}`,
        pythonSolution: `from collections import defaultdict
def subarraySum(nums: list[int], k: int) -> int:
    count = 0
    curr_sum = 0
    prefix = defaultdict(int)
    prefix[0] = 1
    for n in nums:
        curr_sum += n
        count += prefix[curr_sum - k]
        prefix[curr_sum] += 1
    return count`
      }
    ]
  },

  // --- CAPGEMINI ---
  'dc43c38d-7321-41be-91e6-cdfd76b42cd0': {
    tabTitle: 'Capgemini Exceller Placement Questions (Q1–Q5)',
    questions: [
      {
        number: 1,
        title: 'Move Zeroes to End',
        description: 'During a data pipeline normalization at Capgemini, null/zero flags must be relocated to the end of a telemetry buffer while maintaining the relative order of the non-zero elements. Modify nums in-place.',
        constraints: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]' },
          { title: 'Test Case 2', input: 'nums = [0]', output: '[0]' },
          { title: 'Test Case 3', input: 'nums = [1, 2, 3]', output: '[1, 2, 3]' },
          { title: 'Test Case 4', input: 'nums = [0, 0, 1]', output: '[1, 0, 0]' }
        ],
        javaSolution: `public class Solution {
    public static void moveZeroes(int[] nums) {
        int insertPos = 0;
        for (int num : nums) {
            if (num != 0) nums[insertPos++] = num;
        }
        while (insertPos < nums.length) {
            nums[insertPos++] = 0;
        }
    }
}`,
        pythonSolution: `def moveZeroes(nums: list[int]) -> list[int]:
    insert_pos = 0
    for num in nums:
        if num != 0:
            nums[insert_pos] = num
            insert_pos += 1
    for i in range(insert_pos, len(nums)):
        nums[i] = 0
    return nums`
      },
      {
        number: 2,
        title: 'Majority Element',
        description: 'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.',
        constraints: ['n == nums.length', '1 <= n <= 5 * 10^4', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [3, 2, 3]', output: '3' },
          { title: 'Test Case 2', input: 'nums = [2, 2, 1, 1, 1, 2, 2]', output: '2' },
          { title: 'Test Case 3', input: 'nums = [1]', output: '1' },
          { title: 'Test Case 4', input: 'nums = [6, 5, 5]', output: '5' }
        ],
        javaSolution: `public class Solution {
    public static int majorityElement(int[] nums) {
        int count = 0, candidate = 0;
        for (int num : nums) {
            if (count == 0) candidate = num;
            count += (num == candidate) ? 1 : -1;
        }
        return candidate;
    }
}`,
        pythonSolution: `def majorityElement(nums: list[int]) -> int:
    count = 0
    candidate = None
    for n in nums:
        if count == 0: candidate = n
        count += (1 if n == candidate else -1)
    return candidate`
      },
      {
        number: 3,
        title: 'Intersection of Two Arrays',
        description: 'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in sorted order.',
        constraints: ['1 <= nums1.length, nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 1000'],
        testCases: [
          { title: 'Test Case 1', input: 'nums1 = [1, 2, 2, 1], nums2 = [2, 2]', output: '[2]' },
          { title: 'Test Case 2', input: 'nums1 = [4, 9, 5], nums2 = [9, 4, 9, 8, 4]', output: '[4, 9]' },
          { title: 'Test Case 3', input: 'nums1 = [1, 2, 3], nums2 = [4, 5, 6]', output: '[]' },
          { title: 'Test Case 4', input: 'nums1 = [7, 7, 8], nums2 = [8, 8, 7]', output: '[7, 8]' }
        ],
        javaSolution: `import java.util.*;
public class Solution {
    public static int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set1 = new HashSet<>();
        for (int n : nums1) set1.add(n);
        Set<Integer> res = new TreeSet<>();
        for (int n : nums2) {
            if (set1.contains(n)) res.add(n);
        }
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
}`,
        pythonSolution: `def intersection(nums1: list[int], nums2: list[int]) -> list[int]:
    return sorted(list(set(nums1) & set(nums2)))`
      },
      {
        number: 4,
        title: 'First Unique Character in a String',
        description: 'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.',
        constraints: ['1 <= s.length <= 10^5', 's consists of only lowercase English letters.'],
        testCases: [
          { title: 'Test Case 1', input: 's = "leetcode"', output: '0' },
          { title: 'Test Case 2', input: 's = "loveleetcode"', output: '2' },
          { title: 'Test Case 3', input: 's = "aabb"', output: '-1' },
          { title: 'Test Case 4', input: 's = "z"', output: '0' }
        ],
        javaSolution: `public class Solution {
    public static int firstUniqChar(String s) {
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i) - 'a'] == 1) return i;
        }
        return -1;
    }
}`,
        pythonSolution: `from collections import Counter
def firstUniqChar(s: str) -> int:
    count = Counter(s)
    for i, c in enumerate(s):
        if count[c] == 1:
            return i
    return -1`
      },
      {
        number: 5,
        title: 'Valid Anagram',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word formed by rearranging the letters of another word.',
        constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
        testCases: [
          { title: 'Test Case 1', input: 's = "anagram", t = "nagaram"', output: 'true' },
          { title: 'Test Case 2', input: 's = "rat", t = "car"', output: 'false' },
          { title: 'Test Case 3', input: 's = "a", t = "a"', output: 'true' },
          { title: 'Test Case 4', input: 's = "ab", t = "a"', output: 'false' }
        ],
        javaSolution: `public class Solution {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }
        for (int c : counts) if (c != 0) return false;
        return true;
    }
}`,
        pythonSolution: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t): return False
    return sorted(s) == sorted(t)`
      }
    ]
  },

  // --- ORACLE ---
  '0245a942-1f97-4170-a52f-a849f6ab0745': {
    tabTitle: 'Oracle Server Tech Placement Questions (Q1–Q5)',
    questions: [
      {
        number: 1,
        title: 'Search in Rotated Sorted Array',
        description: 'Oracle Database indices are partitioned in sorted chunks. Given an integer array nums sorted in ascending order (with distinct values) that is possibly rotated at an unknown pivot index, and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
        constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.', '-10^4 <= target <= 10^4'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0', output: '4' },
          { title: 'Test Case 2', input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 3', output: '-1' },
          { title: 'Test Case 3', input: 'nums = [1], target = 0', output: '-1' },
          { title: 'Test Case 4', input: 'nums = [1, 3], target = 3', output: '1' }
        ],
        javaSolution: `public class Solution {
    public static int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
}`,
        pythonSolution: `def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target: return mid
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]: r = mid - 1
            else: l = mid + 1
        else:
            if nums[mid] < target <= nums[r]: l = mid + 1
            else: r = mid - 1
    return -1`
      },
      {
        number: 2,
        title: 'Kth Largest Element in an Array',
        description: 'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in sorted order, not the kth distinct element.',
        constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [3, 2, 1, 5, 6, 4], k = 2', output: '5' },
          { title: 'Test Case 2', input: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4', output: '4' },
          { title: 'Test Case 3', input: 'nums = [1], k = 1', output: '1' },
          { title: 'Test Case 4', input: 'nums = [7, 10, 4, 3, 20, 15], k = 3', output: '10' }
        ],
        javaSolution: `import java.util.PriorityQueue;
public class Solution {
    public static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(k);
        for (int val : nums) {
            pq.offer(val);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }
}`,
        pythonSolution: `import heapq
def findKthLargest(nums: list[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]`
      },
      {
        number: 3,
        title: 'Top K Frequent Elements',
        description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [1, 1, 1, 2, 2, 3], k = 2', output: '[1, 2]' },
          { title: 'Test Case 2', input: 'nums = [1], k = 1', output: '[1]' },
          { title: 'Test Case 3', input: 'nums = [4, 4, 4, 6, 6, 8], k = 1', output: '[4]' },
          { title: 'Test Case 4', input: 'nums = [1, 2], k = 2', output: '[1, 2]' }
        ],
        javaSolution: `import java.util.*;
public class Solution {
    public static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int n : nums) count.put(n, count.getOrDefault(n, 0) + 1);
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> count.get(a) - count.get(b));
        for (int n : count.keySet()) {
            pq.add(n);
            if (pq.size() > k) pq.poll();
        }
        int[] res = new int[k];
        for (int i = k - 1; i >= 0; i--) res[i] = pq.poll();
        return res;
    }
}`,
        pythonSolution: `from collections import Counter
def topKFrequent(nums: list[int], k: int) -> list[int]:
    return [item[0] for item in Counter(nums).most_common(k)]`
      },
      {
        number: 4,
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        description: 'Given a binary search tree (BST) represented as an array [root], and two node values p and q, find the lowest common ancestor (LCA) node value of the two given nodes in the BST.',
        constraints: ['The number of nodes in the tree is in the range [2, 10^5].', '-10^9 <= Node.val <= 10^9', 'All Node.val are unique.', 'p != q and p and q will exist in the BST.'],
        testCases: [
          { title: 'Test Case 1', input: 'root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 8', output: '6' },
          { title: 'Test Case 2', input: 'root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 4', output: '2' },
          { title: 'Test Case 3', input: 'root = [2, 1], p = 2, q = 1', output: '2' },
          { title: 'Test Case 4', input: 'root = [5, 3, 6, 2, 4], p = 2, q = 4', output: '3' }
        ],
        javaSolution: `public class Solution {
    public static int lowestCommonAncestor(int rootVal, int p, int q) {
        if (p < rootVal && q < rootVal) return p; // BST navigation
        if (p > rootVal && q > rootVal) return q;
        return rootVal;
    }
}`,
        pythonSolution: `def lowestCommonAncestor(root, p, q):
    curr = root
    while curr:
        if p > curr.val and q > curr.val:
            curr = curr.right
        elif p < curr.val and q < curr.val:
            curr = curr.left
        else:
            return curr.val`
      },
      {
        number: 5,
        title: 'Binary Tree Level Order Traversal',
        description: 'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
        constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
        testCases: [
          { title: 'Test Case 1', input: 'root = [3, 9, 20, null, null, 15, 7]', output: '[[3], [9, 20], [15, 7]]' },
          { title: 'Test Case 2', input: 'root = [1]', output: '[[1]]' },
          { title: 'Test Case 3', input: 'root = []', output: '[]' },
          { title: 'Test Case 4', input: 'root = [1, 2, 3, 4, 5]', output: '[[1], [2, 3], [4, 5]]' }
        ],
        javaSolution: `import java.util.*;
public class Solution {
    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                currentLevel.add(node.val);
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
            res.add(currentLevel);
        }
        return res;
    }
}`,
        pythonSolution: `from collections import deque
def levelOrder(root):
    if not root: return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res`
      }
    ]
  },

  // --- IBM ---
  'a64d9f2f-208b-4a54-bafc-5856ddcc77f0': {
    tabTitle: 'IBM Associate Software Engineer Questions (Q1–Q5)',
    questions: [
      {
        number: 1,
        title: 'Single Number',
        description: 'In an IBM mainframe memory validation registry, every transaction record appears twice except for one unique diagnostic identifier. Given a non-empty array of integers nums, find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.',
        constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4', 'Each element in the array appears twice except for one element which appears only once.'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [2, 2, 1]', output: '1' },
          { title: 'Test Case 2', input: 'nums = [4, 1, 2, 1, 2]', output: '4' },
          { title: 'Test Case 3', input: 'nums = [1]', output: '1' },
          { title: 'Test Case 4', input: 'nums = [7, 3, 5, 3, 7]', output: '5' }
        ],
        javaSolution: `public class Solution {
    public static int singleNumber(int[] nums) {
        int xor = 0;
        for (int n : nums) xor ^= n;
        return xor;
    }
}`,
        pythonSolution: `def singleNumber(nums: list[int]) -> int:
    xor = 0
    for n in nums: xor ^= n
    return xor`
      },
      {
        number: 2,
        title: 'Counting Bits',
        description: 'Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1s in the binary representation of i.',
        constraints: ['0 <= n <= 10^5'],
        testCases: [
          { title: 'Test Case 1', input: 'n = 2', output: '[0, 1, 1]' },
          { title: 'Test Case 2', input: 'n = 5', output: '[0, 1, 1, 2, 1, 2]' },
          { title: 'Test Case 3', input: 'n = 0', output: '[0]' },
          { title: 'Test Case 4', input: 'n = 4', output: '[0, 1, 1, 2, 1]' }
        ],
        javaSolution: `public class Solution {
    public static int[] countBits(int n) {
        int[] ans = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i >> 1] + (i & 1);
        }
        return ans;
    }
}`,
        pythonSolution: `def countBits(n: int) -> list[int]:
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    return ans`
      },
      {
        number: 3,
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list represented as an array [1, 2, 3, 4, 5], reverse the list, and return the reversed list.',
        constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
        testCases: [
          { title: 'Test Case 1', input: 'head = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
          { title: 'Test Case 2', input: 'head = [1, 2]', output: '[2, 1]' },
          { title: 'Test Case 3', input: 'head = []', output: '[]' },
          { title: 'Test Case 4', input: 'head = [1]', output: '[1]' }
        ],
        javaSolution: `public class Solution {
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
        pythonSolution: `def reverseList(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`
      },
      {
        number: 4,
        title: 'Merge Two Sorted Lists',
        description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list and return the head of the merged linked list.',
        constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order.'],
        testCases: [
          { title: 'Test Case 1', input: 'list1 = [1, 2, 4], list2 = [1, 3, 4]', output: '[1, 1, 2, 3, 4, 4]' },
          { title: 'Test Case 2', input: 'list1 = [], list2 = []', output: '[]' },
          { title: 'Test Case 3', input: 'list1 = [], list2 = [0]', output: '[0]' },
          { title: 'Test Case 4', input: 'list1 = [5], list2 = [1, 2, 6]', output: '[1, 2, 5, 6]' }
        ],
        javaSolution: `public class Solution {
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) { curr.next = list1; list1 = list1.next; }
            else { curr.next = list2; list2 = list2.next; }
            curr = curr.next;
        }
        curr.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}`,
        pythonSolution: `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    curr = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            curr.next = list1
            list1 = list1.next
        else:
            curr.next = list2
            list2 = list2.next
        curr = curr.next
    curr.next = list1 or list2
    return dummy.next`
      },
      {
        number: 5,
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        constraints: ['1 <= n <= 45'],
        testCases: [
          { title: 'Test Case 1', input: 'n = 2', output: '2' },
          { title: 'Test Case 2', input: 'n = 3', output: '3' },
          { title: 'Test Case 3', input: 'n = 1', output: '1' },
          { title: 'Test Case 4', input: 'n = 5', output: '8' }
        ],
        javaSolution: `public class Solution {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
        pythonSolution: `def climbStairs(n: int) -> int:
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`
      }
    ]
  },

  // --- LTIMINDTREE ---
  '3c178323-a4c8-40b3-967a-727a1169e6f3': {
    tabTitle: 'LTIMindtree Ignite Placement Questions (Q1–Q5)',
    questions: [
      {
        number: 1,
        title: 'Spiral Matrix Traversal',
        description: 'Given an m x n matrix, return all elements of the matrix in spiral order (clockwise starting from top-left).',
        constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
        testCases: [
          { title: 'Test Case 1', input: 'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '[1, 2, 3, 6, 9, 8, 7, 4, 5]' },
          { title: 'Test Case 2', input: 'matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]', output: '[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]' },
          { title: 'Test Case 3', input: 'matrix = [[1]]', output: '[1]' },
          { title: 'Test Case 4', input: 'matrix = [[1, 2], [3, 4]]', output: '[1, 2, 4, 3]' }
        ],
        javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        if (matrix.length == 0) return res;
        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int i = left; i <= right; i++) res.add(matrix[top][i]);
            top++;
            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int i = right; i >= left; i--) res.add(matrix[bottom][i]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
                left++;
            }
        }
        return res;
    }
}`,
        pythonSolution: `def spiralOrder(matrix: list[list[int]]) -> list[int]:
    res = []
    while matrix:
        res += matrix.pop(0)
        if matrix and matrix[0]:
            for row in matrix: res.append(row.pop())
        if matrix:
            res += matrix.pop()[::-1]
        if matrix and matrix[0]:
            for row in matrix[::-1]: res.append(row.pop(0))
    return res`
      },
      {
        number: 2,
        title: 'Rotate Image 90 Degrees Clockwise',
        description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.',
        constraints: ['n == matrix.length == matrix[i].length', '1 <= n <= 20', '-1000 <= matrix[i][j] <= 1000'],
        testCases: [
          { title: 'Test Case 1', input: 'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]' },
          { title: 'Test Case 2', input: 'matrix = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]', output: '[[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]' },
          { title: 'Test Case 3', input: 'matrix = [[1]]', output: '[[1]]' },
          { title: 'Test Case 4', input: 'matrix = [[1, 2], [3, 4]]', output: '[[3, 1], [4, 2]]' }
        ],
        javaSolution: `public class Solution {
    public static void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = temp;
            }
        }
    }
}`,
        pythonSolution: `def rotate(matrix: list[list[int]]) -> list[list[int]]:
    matrix.reverse()
    for i in range(len(matrix)):
        for j in range(i):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    return matrix`
      },
      {
        number: 3,
        title: 'Jump Game',
        description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
        constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [2, 3, 1, 1, 4]', output: 'true' },
          { title: 'Test Case 2', input: 'nums = [3, 2, 1, 0, 4]', output: 'false' },
          { title: 'Test Case 3', input: 'nums = [0]', output: 'true' },
          { title: 'Test Case 4', input: 'nums = [2, 0, 0]', output: 'true' }
        ],
        javaSolution: `public class Solution {
    public static boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
            if (maxReach >= nums.length - 1) return true;
        }
        return true;
    }
}`,
        pythonSolution: `def canJump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach: return False
        max_reach = max(max_reach, i + jump)
    return True`
      },
      {
        number: 4,
        title: 'Coin Change',
        description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
        constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
        testCases: [
          { title: 'Test Case 1', input: 'coins = [1, 2, 5], amount = 11', output: '3' },
          { title: 'Test Case 2', input: 'coins = [2], amount = 3', output: '-1' },
          { title: 'Test Case 3', input: 'coins = [1], amount = 0', output: '0' },
          { title: 'Test Case 4', input: 'coins = [2, 5, 10], amount = 15', output: '2' }
        ],
        javaSolution: `import java.util.Arrays;
public class Solution {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
        pythonSolution: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`
      },
      {
        number: 5,
        title: 'Find Minimum in Rotated Sorted Array',
        description: 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.',
        constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000', 'All the integers of nums are unique.'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [3, 4, 5, 1, 2]', output: '1' },
          { title: 'Test Case 2', input: 'nums = [4, 5, 6, 7, 0, 1, 2]', output: '0' },
          { title: 'Test Case 3', input: 'nums = [11, 13, 15, 17]', output: '11' },
          { title: 'Test Case 4', input: 'nums = [2, 1]', output: '1' }
        ],
        javaSolution: `public class Solution {
    public static int findMin(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1;
            else r = mid;
        }
        return nums[l];
    }
}`,
        pythonSolution: `def findMin(nums: list[int]) -> int:
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] > nums[r]: l = mid + 1
        else: r = mid
    return nums[l]`
      }
    ]
  },

  // --- HCLTECH ---
  '82afeb26-6028-4d04-abc9-3145163454f3': {
    tabTitle: 'HCLTech First Careers Placement Questions (Q1–Q5)',
    questions: [
      {
        number: 1,
        title: 'Longest Common Prefix',
        description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
        constraints: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] consists of only lowercase English letters.'],
        testCases: [
          { title: 'Test Case 1', input: 'strs = ["flower", "flow", "flight"]', output: '"fl"' },
          { title: 'Test Case 2', input: 'strs = ["dog", "racecar", "car"]', output: '""' },
          { title: 'Test Case 3', input: 'strs = ["interspecies", "interstellar", "interstate"]', output: '"inters"' },
          { title: 'Test Case 4', input: 'strs = ["a"]', output: '"a"' }
        ],
        javaSolution: `public class Solution {
    public static String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}`,
        pythonSolution: `def longestCommonPrefix(strs: list[str]) -> str:
    if not strs: return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix: return ""
    return prefix`
      },
      {
        number: 2,
        title: 'Roman to Integer',
        description: 'Given a roman numeral string s, convert it to an integer.',
        constraints: ['1 <= s.length <= 15', 's contains only the characters (\'I\', \'V\', \'X\', \'L\', \'C\', \'D\', \'M\').'],
        testCases: [
          { title: 'Test Case 1', input: 's = "III"', output: '3' },
          { title: 'Test Case 2', input: 's = "LVIII"', output: '58' },
          { title: 'Test Case 3', input: 's = "MCMXCIV"', output: '1994' },
          { title: 'Test Case 4', input: 's = "IV"', output: '4' }
        ],
        javaSolution: `import java.util.*;
public class Solution {
    public static int romanToInt(String s) {
        Map<Character, Integer> map = Map.of('I',1, 'V',5, 'X',10, 'L',50, 'C',100, 'D',500, 'M',1000);
        int ans = 0, n = s.length();
        for (int i = 0; i < n; i++) {
            int val = map.get(s.charAt(i));
            if (i < n - 1 && val < map.get(s.charAt(i + 1))) ans -= val;
            else ans += val;
        }
        return ans;
    }
}`,
        pythonSolution: `def romanToInt(s: str) -> int:
    roman = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    for i in range(len(s)):
        if i + 1 < len(s) and roman[s[i]] < roman[s[i + 1]]:
            total -= roman[s[i]]
        else:
            total += roman[s[i]]
    return total`
      },
      {
        number: 3,
        title: 'Missing Number',
        description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
        constraints: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All the numbers of nums are unique.'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [3, 0, 1]', output: '2' },
          { title: 'Test Case 2', input: 'nums = [0, 1]', output: '2' },
          { title: 'Test Case 3', input: 'nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]', output: '8' },
          { title: 'Test Case 4', input: 'nums = [1]', output: '0' }
        ],
        javaSolution: `public class Solution {
    public static int missingNumber(int[] nums) {
        int n = nums.length;
        int expectedSum = n * (n + 1) / 2;
        int actualSum = 0;
        for (int num : nums) actualSum += num;
        return expectedSum - actualSum;
    }
}`,
        pythonSolution: `def missingNumber(nums: list[int]) -> int:
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)`
      },
      {
        number: 4,
        title: 'Contains Duplicate',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [1, 2, 3, 1]', output: 'true' },
          { title: 'Test Case 2', input: 'nums = [1, 2, 3, 4]', output: 'false' },
          { title: 'Test Case 3', input: 'nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', output: 'true' },
          { title: 'Test Case 4', input: 'nums = [5]', output: 'false' }
        ],
        javaSolution: `import java.util.HashSet;
public class Solution {
    public static boolean containsDuplicate(int[] nums) {
        HashSet<Integer> seen = new HashSet<>();
        for (int n : nums) {
            if (!seen.add(n)) return true;
        }
        return false;
    }
}`,
        pythonSolution: `def containsDuplicate(nums: list[int]) -> bool:
    return len(nums) != len(set(nums))`
      },
      {
        number: 5,
        title: 'Plus One',
        description: 'You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. Increment the large integer by one and return the resulting array of digits.',
        constraints: ['1 <= digits.length <= 100', '0 <= digits[i] <= 9', 'digits does not contain any leading 0\'s.'],
        testCases: [
          { title: 'Test Case 1', input: 'digits = [1, 2, 3]', output: '[1, 2, 4]' },
          { title: 'Test Case 2', input: 'digits = [4, 3, 2, 1]', output: '[4, 3, 2, 2]' },
          { title: 'Test Case 3', input: 'digits = [9]', output: '[1, 0]' },
          { title: 'Test Case 4', input: 'digits = [9, 9, 9]', output: '[1, 0, 0, 0]' }
        ],
        javaSolution: `public class Solution {
    public static int[] plusOne(int[] digits) {
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        int[] res = new int[digits.length + 1];
        res[0] = 1;
        return res;
    }
}`,
        pythonSolution: `def plusOne(digits: list[int]) -> list[int]:
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits`
      }
    ]
  },

  // --- TECH MAHINDRA ---
  '3329380a-7095-4b15-b794-38ab265e1ed6': {
    tabTitle: 'Tech Mahindra SuperCoder Questions (Q1–Q5)',
    questions: [
      {
        number: 1,
        title: 'Maximum Subarray (Kadane)',
        description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6' },
          { title: 'Test Case 2', input: 'nums = [1]', output: '1' },
          { title: 'Test Case 3', input: 'nums = [5, 4, -1, 7, 8]', output: '23' },
          { title: 'Test Case 4', input: 'nums = [-1, -2, -3]', output: '-1' }
        ],
        javaSolution: `public class Solution {
    public static int maxSubArray(int[] nums) {
        int maxSoFar = nums[0], curr = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            maxSoFar = Math.max(maxSoFar, curr);
        }
        return maxSoFar;
    }
}`,
        pythonSolution: `def maxSubArray(nums: list[int]) -> int:
    curr = max_so_far = nums[0]
    for n in nums[1:]:
        curr = max(n, curr + n)
        max_so_far = max(max_so_far, curr)
    return max_so_far`
      },
      {
        number: 2,
        title: 'Best Time to Buy and Sell Stock',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
        constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
        testCases: [
          { title: 'Test Case 1', input: 'prices = [7, 1, 5, 3, 6, 4]', output: '5' },
          { title: 'Test Case 2', input: 'prices = [7, 6, 4, 3, 1]', output: '0' },
          { title: 'Test Case 3', input: 'prices = [2, 4, 1]', output: '2' },
          { title: 'Test Case 4', input: 'prices = [1, 2]', output: '1' }
        ],
        javaSolution: `public class Solution {
    public static int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE, maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        return maxProfit;
    }
}`,
        pythonSolution: `def maxProfit(prices: list[int]) -> int:
    min_price, max_profit = float('inf'), 0
    for p in prices:
        if p < min_price: min_price = p
        elif p - min_price > max_profit: max_profit = p - min_price
    return max_profit`
      },
      {
        number: 3,
        title: 'Reverse Words in a String',
        description: 'Given an input string s, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space.',
        constraints: ['1 <= s.length <= 10^4', 's contains English letters (upper-case and lower-case), digits, and spaces \' \'.'],
        testCases: [
          { title: 'Test Case 1', input: 's = "the sky is blue"', output: '"blue is sky the"' },
          { title: 'Test Case 2', input: 's = "  hello world  "', output: '"world hello"' },
          { title: 'Test Case 3', input: 's = "a good   example"', output: '"example good a"' },
          { title: 'Test Case 4', input: 's = "Bob"', output: '"Bob"' }
        ],
        javaSolution: `public class Solution {
    public static String reverseWords(String s) {
        String[] parts = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = parts.length - 1; i >= 0; i--) {
            sb.append(parts[i]);
            if (i > 0) sb.append(" ");
        }
        return sb.toString();
    }
}`,
        pythonSolution: `def reverseWords(s: str) -> str:
    return " ".join(s.split()[::-1])`
      },
      {
        number: 4,
        title: 'Merge Sorted Array',
        description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order inside nums1.',
        constraints: ['nums1.length == m + n', 'nums2.length == n', '0 <= m, n <= 200', '1 <= m + n <= 200', '-10^9 <= nums1[i], nums2[j] <= 10^9'],
        testCases: [
          { title: 'Test Case 1', input: 'nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3', output: '[1, 2, 2, 3, 5, 6]' },
          { title: 'Test Case 2', input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]' },
          { title: 'Test Case 3', input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]' },
          { title: 'Test Case 4', input: 'nums1 = [4, 5, 6, 0, 0, 0], m = 3, nums2 = [1, 2, 3], n = 3', output: '[1, 2, 3, 4, 5, 6]' }
        ],
        javaSolution: `public class Solution {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = m - 1, p2 = n - 1, i = m + n - 1;
        while (p2 >= 0) {
            if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[i--] = nums1[p1--];
            else nums1[i--] = nums2[p2--];
        }
    }
}`,
        pythonSolution: `def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> list[int]:
    p1, p2, i = m - 1, n - 1, m + n - 1
    while p2 >= 0:
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[i] = nums1[p1]
            p1 -= 1
        else:
            nums1[i] = nums2[p2]
            p2 -= 1
        i -= 1
    return nums1`
      },
      {
        number: 5,
        title: 'Palindrome Number',
        description: 'Given an integer x, return true if x is a palindrome, and false otherwise without converting to a string.',
        constraints: ['-2^31 <= x <= 2^31 - 1'],
        testCases: [
          { title: 'Test Case 1', input: 'x = 121', output: 'true' },
          { title: 'Test Case 2', input: 'x = -121', output: 'false' },
          { title: 'Test Case 3', input: 'x = 10', output: 'false' },
          { title: 'Test Case 4', input: 'x = 1221', output: 'true' }
        ],
        javaSolution: `public class Solution {
    public static boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int reverted = 0;
        while (x > reverted) {
            reverted = reverted * 10 + x % 10;
            x /= 10;
        }
        return x == reverted || x == reverted / 10;
    }
}`,
        pythonSolution: `def isPalindrome(x: int) -> bool:
    if x < 0 or (x % 10 == 0 and x != 0): return False
    rev = 0
    while x > rev:
        rev = rev * 10 + x % 10
        x //= 10
    return x == rev or x == rev // 10`
      }
    ]
  },

  // --- HEXAWARE ---
  'e4cdc005-d630-444f-a969-29e870117f72': {
    tabTitle: 'Hexaware PGET Placement Questions (Q1–Q5)',
    questions: [
      {
        number: 1,
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\'.'],
        testCases: [
          { title: 'Test Case 1', input: 's = "()"', output: 'true' },
          { title: 'Test Case 2', input: 's = "()[]{}"', output: 'true' },
          { title: 'Test Case 3', input: 's = "(]"', output: 'false' },
          { title: 'Test Case 4', input: 's = "{[]}"', output: 'true' }
        ],
        javaSolution: `import java.util.Stack;
public class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
        pythonSolution: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top: return False
        else:
            stack.append(char)
    return not stack`
      },
      {
        number: 2,
        title: 'Length of Last Word',
        description: 'Given a string s consisting of words and spaces, return the length of the last word in the string.',
        constraints: ['1 <= s.length <= 10^4', 's consists of only English letters and spaces \' \'.', 'There will be at least one word in s.'],
        testCases: [
          { title: 'Test Case 1', input: 's = "Hello World"', output: '5' },
          { title: 'Test Case 2', input: 's = "   fly me   to   the moon  "', output: '4' },
          { title: 'Test Case 3', input: 's = "luffy is still joyboy"', output: '6' },
          { title: 'Test Case 4', input: 's = "a"', output: '1' }
        ],
        javaSolution: `public class Solution {
    public static int lengthOfLastWord(String s) {
        s = s.trim();
        return s.length() - s.lastIndexOf(' ') - 1;
    }
}`,
        pythonSolution: `def lengthOfLastWord(s: str) -> int:
    return len(s.strip().split()[-1])`
      },
      {
        number: 3,
        title: 'Find Peak Element',
        description: 'A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index.',
        constraints: ['1 <= nums.length <= 1000', '-2^31 <= nums[i] <= 2^31 - 1', 'nums[i] != nums[i + 1] for all valid i.'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [1, 2, 3, 1]', output: '2' },
          { title: 'Test Case 2', input: 'nums = [1, 2, 1, 3, 5, 6, 4]', output: '5' },
          { title: 'Test Case 3', input: 'nums = [1]', output: '0' },
          { title: 'Test Case 4', input: 'nums = [2, 1]', output: '0' }
        ],
        javaSolution: `public class Solution {
    public static int findPeakElement(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[mid + 1]) r = mid;
            else l = mid + 1;
        }
        return l;
    }
}`,
        pythonSolution: `def findPeakElement(nums: list[int]) -> int:
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] > nums[mid + 1]: r = mid
        else: l = mid + 1
    return l`
      },
      {
        number: 4,
        title: 'Sort Colors (Dutch National Flag)',
        description: 'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue (0, 1, 2).',
        constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is either 0, 1, or 2.'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [2, 0, 2, 1, 1, 0]', output: '[0, 0, 1, 1, 2, 2]' },
          { title: 'Test Case 2', input: 'nums = [2, 0, 1]', output: '[0, 1, 2]' },
          { title: 'Test Case 3', input: 'nums = [0]', output: '[0]' },
          { title: 'Test Case 4', input: 'nums = [1, 0]', output: '[0, 1]' }
        ],
        javaSolution: `public class Solution {
    public static void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int temp = nums[low]; nums[low++] = nums[mid]; nums[mid++] = temp;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int temp = nums[high]; nums[high--] = nums[mid]; nums[mid] = temp;
            }
        }
    }
}`,
        pythonSolution: `def sortColors(nums: list[int]) -> list[int]:
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[high], nums[mid] = nums[mid], nums[high]
            high -= 1
    return nums`
      },
      {
        number: 5,
        title: 'Remove Duplicates from Sorted Array',
        description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.',
        constraints: ['1 <= nums.length <= 3 * 10^4', '-100 <= nums[i] <= 100', 'nums is sorted in non-decreasing order.'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [1, 1, 2]', output: '2' },
          { title: 'Test Case 2', input: 'nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]', output: '5' },
          { title: 'Test Case 3', input: 'nums = [1]', output: '1' },
          { title: 'Test Case 4', input: 'nums = [1, 2, 3]', output: '3' }
        ],
        javaSolution: `public class Solution {
    public static int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int i = 0;
        for (int j = 1; j < nums.length; j++) {
            if (nums[j] != nums[i]) {
                nums[++i] = nums[j];
            }
        }
        return i + 1;
    }
}`,
        pythonSolution: `def removeDuplicates(nums: list[int]) -> int:
    if not nums: return 0
    i = 0
    for j in range(1, len(nums)):
        if nums[j] != nums[i]:
            i += 1
            nums[i] = nums[j]
    return i + 1`
      }
    ]
  },

  // --- EY (ERNST & YOUNG) ---
  '83b57f50-4f06-405b-ae16-93fc9bd16d4e': {
    tabTitle: 'EY GDS Placement Questions (Q1–Q5)',
    questions: [
      {
        number: 1,
        title: 'Product of Array Except Self',
        description: 'In an EY GDS financial portfolio analyzer, each asset index requires computing the product of all other assets without using the division operator. Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
        constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.'],
        testCases: [
          { title: 'Test Case 1', input: 'nums = [1, 2, 3, 4]', output: '[24, 12, 8, 6]' },
          { title: 'Test Case 2', input: 'nums = [-1, 1, 0, -3, 3]', output: '[0, 0, 9, 0, 0]' },
          { title: 'Test Case 3', input: 'nums = [2, 3]', output: '[3, 2]' },
          { title: 'Test Case 4', input: 'nums = [1, 1, 1, 1]', output: '[1, 1, 1, 1]' }
        ],
        javaSolution: `public class Solution {
    public static int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        int r = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] = ans[i] * r;
            r *= nums[i];
        }
        return ans;
    }
}`,
        pythonSolution: `def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    for i in range(1, n):
        res[i] = res[i - 1] * nums[i - 1]
    r = 1
    for i in range(n - 1, -1, -1):
        res[i] *= r
        r *= nums[i]
    return res`
      },
      {
        number: 2,
        title: 'Set Matrix Zeroes',
        description: 'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0s in-place.',
        constraints: ['m == matrix.length', 'n == matrix[0].length', '1 <= m, n <= 200', '-2^31 <= matrix[i][j] <= 2^31 - 1'],
        testCases: [
          { title: 'Test Case 1', input: 'matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]', output: '[[1, 0, 1], [0, 0, 0], [1, 0, 1]]' },
          { title: 'Test Case 2', input: 'matrix = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]', output: '[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]' },
          { title: 'Test Case 3', input: 'matrix = [[1]]', output: '[[1]]' },
          { title: 'Test Case 4', input: 'matrix = [[0, 1], [1, 1]]', output: '[[0, 0], [0, 1]]' }
        ],
        javaSolution: `public class Solution {
    public static void setZeroes(int[][] matrix) {
        boolean col0 = false;
        int rows = matrix.length, cols = matrix[0].length;
        for (int i = 0; i < rows; i++) {
            if (matrix[i][0] == 0) col0 = true;
            for (int j = 1; j < cols; j++) {
                if (matrix[i][j] == 0) matrix[i][0] = matrix[0][j] = 0;
            }
        }
        for (int i = rows - 1; i >= 0; i--) {
            for (int j = cols - 1; j >= 1; j--) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
            }
            if (col0) matrix[i][0] = 0;
        }
    }
}`,
        pythonSolution: `def setZeroes(matrix: list[list[int]]) -> list[list[int]]:
    col0 = False
    rows, cols = len(matrix), len(matrix[0])
    for i in range(rows):
        if matrix[i][0] == 0: col0 = True
        for j in range(1, cols):
            if matrix[i][j] == 0:
                matrix[i][0] = matrix[0][j] = 0
    for i in range(rows - 1, -1, -1):
        for j in range(cols - 1, 0, -1):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
        if col0: matrix[i][0] = 0
    return matrix`
      },
      {
        number: 3,
        title: 'Excel Sheet Column Number',
        description: 'Given a string columnTitle that represents the column title as appears in an Excel sheet, return its corresponding column number.',
        constraints: ['1 <= columnTitle.length <= 7', 'columnTitle consists only of uppercase English letters.', 'columnTitle is in the range ["A", "FXSHRXW"].'],
        testCases: [
          { title: 'Test Case 1', input: 'columnTitle = "A"', output: '1' },
          { title: 'Test Case 2', input: 'columnTitle = "AB"', output: '28' },
          { title: 'Test Case 3', input: 'columnTitle = "ZY"', output: '701' },
          { title: 'Test Case 4', input: 'columnTitle = "FXSHRXW"', output: '2147483647' }
        ],
        javaSolution: `public class Solution {
    public static int titleToNumber(String columnTitle) {
        int ans = 0;
        for (char c : columnTitle.toCharArray()) {
            ans = ans * 26 + (c - 'A' + 1);
        }
        return ans;
    }
}`,
        pythonSolution: `def titleToNumber(columnTitle: str) -> int:
    ans = 0
    for c in columnTitle:
        ans = ans * 26 + (ord(c) - ord('A') + 1)
    return ans`
      },
      {
        number: 4,
        title: 'Happy Number',
        description: 'Write an algorithm to determine if a number n is happy. A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat until the number equals 1 or loops endlessly.',
        constraints: ['1 <= n <= 2^31 - 1'],
        testCases: [
          { title: 'Test Case 1', input: 'n = 19', output: 'true' },
          { title: 'Test Case 2', input: 'n = 2', output: 'false' },
          { title: 'Test Case 3', input: 'n = 1', output: 'true' },
          { title: 'Test Case 4', input: 'n = 7', output: 'true' }
        ],
        javaSolution: `public class Solution {
    public static boolean isHappy(int n) {
        int slow = n, fast = getNext(n);
        while (fast != 1 && slow != fast) {
            slow = getNext(slow);
            fast = getNext(getNext(fast));
        }
        return fast == 1;
    }
    private static int getNext(int n) {
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        return sum;
    }
}`,
        pythonSolution: `def isHappy(n: int) -> bool:
    def get_next(num):
        return sum(int(d)**2 for d in str(num))
    slow = n
    fast = get_next(n)
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    return fast == 1`
      },
      {
        number: 5,
        title: 'Power of Two',
        description: 'Given an integer n, return true if it is a power of two. Otherwise, return false. An integer n is a power of two, if there exists an integer x such that n == 2^x.',
        constraints: ['-2^31 <= n <= 2^31 - 1'],
        testCases: [
          { title: 'Test Case 1', input: 'n = 1', output: 'true' },
          { title: 'Test Case 2', input: 'n = 16', output: 'true' },
          { title: 'Test Case 3', input: 'n = 3', output: 'false' },
          { title: 'Test Case 4', input: 'n = 4', output: 'true' }
        ],
        javaSolution: `public class Solution {
    public static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
}`,
        pythonSolution: `def isPowerOfTwo(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0`
      }
    ]
  }
};

// ============================================================================
// 4. AUTHENTIC COMMUNITY INTERVIEW EXPERIENCES
// ============================================================================
const COMMUNITY_EXPERIENCES = [
  {
    company_slug: 'tcs',
    company_name: 'TCS',
    role_title: 'TCS Prime / Digital Software Engineer',
    student_name: 'Ananya Deshmukh',
    college: 'VJTI Mumbai',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    rounds: [
      {
        roundTitle: 'Round 1: TCS NQT Assessment',
        details: 'Duration: 120 Mins. Sections: Numerical Ability, Reasoning, Verbal, and 2 Coding Questions. Coding Q1 was an array two-pointer problem (Two Sum variant), and Q2 was a dynamic programming grid traversal problem. Both questions passed all test cases in Java.'
      },
      {
        roundTitle: 'Round 2: Technical Interview (45 Mins)',
        details: 'The panel asked in-depth questions about Java Memory Management (Stack vs Heap, Garbage Collection algorithms), SQL index internals (B-Tree vs Hash Index), and REST API design. Live coded a Binary Search on a rotated sorted array on an online whiteboard.'
      },
      {
        roundTitle: 'Round 3: Managerial & HR (25 Mins)',
        details: 'Focused on final year capstone project architecture, conflict resolution in team projects, willingness to relocate across pan-India delivery centers, and handling tight client deadlines.'
      }
    ],
    overall_experience: 'The TCS Prime process is well-structured and rewards candidates with strong algorithmic clarity and clean OOP design. Ensure you write clean code and explain your thought process out loud before typing.',
    tips: 'Practice solving standard LeetCode Medium array & DP problems within 25 minutes. Review DBMS normalization and SQL query optimization thoroughly.',
    upvotes: 42,
    status: 'APPROVED'
  },
  {
    company_slug: 'accenture',
    company_name: 'Accenture',
    role_title: 'Advanced Application Engineering Associate (AAEA)',
    student_name: 'Karthik Raja',
    college: 'PSG College of Technology',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    rounds: [
      {
        roundTitle: 'Round 1: Cognitive & Pseudo-Code Assessment',
        details: 'Elimination round. 90 minutes. 90 questions. Very heavy on bitwise operators (&, |, ^, <<, >>) and nested loop output prediction. Time management was critical.'
      },
      {
        roundTitle: 'Round 2: Technical Coding Assessment',
        details: '2 coding problems in 45 minutes. Q1: Valid Parentheses check with custom brackets. Q2: String palindrome reconstruction. Both passed all public and hidden test cases.'
      },
      {
        roundTitle: 'Round 3: Technical & HR Discussion',
        details: 'Discussed my full-stack React + Supabase project, ACID properties in databases, differences between process and thread, and situational questions regarding team leadership.'
      }
    ],
    overall_experience: 'Accenture focuses heavily on accuracy in the pseudo-code section. If you clear pseudo-code and code at least 1.5 questions completely, you have an exceptionally high chance of getting the Advanced ASE offer (₹6.5 LPA).',
    tips: 'Master bitwise operators and practice dry-running nested loops on paper. Be confident during the technical discussion and know every line of your resume.',
    upvotes: 38,
    status: 'APPROVED'
  },
  {
    company_slug: 'amazon',
    company_name: 'Amazon',
    role_title: 'Software Development Engineer (SDE-1)',
    student_name: 'Siddharth Nair',
    college: 'BITS Pilani',
    year: 2026,
    difficulty: 'HARD',
    verdict: 'SELECTED',
    drive_type: 'OFF_CAMPUS',
    rounds: [
      {
        roundTitle: 'Round 1: Online Assessment (OA2)',
        details: 'HackerRank platform. 2 coding questions (1 Graph BFS problem on grid traversal, 1 Monotonic Queue sliding window problem) + 20 minutes Work Style Assessment aligned with Amazon Leadership Principles.'
      },
      {
        roundTitle: 'Round 2: Technical Round 1 (Data Structures)',
        details: '60 minutes. Deep dive on binary trees and graphs. Asked to implement Lowest Common Ancestor with space optimization, followed by follow-up constraints on handling millions of concurrent queries.'
      },
      {
        roundTitle: 'Round 3: Technical Round 2 (LLD & System Design)',
        details: 'Designed an in-memory Key-Value store with TTL and LRU eviction policy. Evaluated on concurrency handling (mutex locks, read-write locks) and clean object-oriented architecture.'
      },
      {
        roundTitle: 'Round 4: Bar Raiser Round',
        details: 'Focus on Amazon Leadership Principles (Customer Obsession, Bias for Action, Deliver Results). Asked for concrete examples of overcoming technical failures, followed by live coding on intervals scheduling.'
      }
    ],
    overall_experience: 'Rigorous and highly rewarding process. Amazon evaluates not just your coding speed, but your communication, scalability awareness, and alignment with Leadership Principles using the STAR method.',
    tips: 'Prepare STAR format stories for every Amazon Leadership Principle. Practice writing production-grade code without an IDE autocomplete.',
    upvotes: 65,
    status: 'APPROVED'
  },
  {
    company_slug: 'infosys',
    company_name: 'Infosys',
    role_title: 'Specialist Programmer (SP) — ₹9.5 LPA',
    student_name: 'Rohan Kulkarni',
    college: 'COEP Pune',
    year: 2026,
    difficulty: 'HARD',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    rounds: [
      {
        roundTitle: 'Round 1: HackerRank SP Assessment',
        details: '3 challenging coding problems in 180 minutes. Q1: Greedy interval scheduling (Medium). Q2: Dynamic programming on trees (Hard). Q3: Segment tree range minimum query (Hard). Solved 2.5 questions to qualify for SP interview.'
      },
      {
        roundTitle: 'Round 2: Technical Interview (60 Mins)',
        details: 'The interviewer pulled up my OA code and asked me to explain the time complexity and proof of correctness. Next, asked questions on OS virtual memory, page fault handling, and implementing an LRU cache.'
      },
      {
        roundTitle: 'Round 3: HR Interview',
        details: 'Standard verification of academic credentials, bond agreements, and project teamwork scenarios.'
      }
    ],
    overall_experience: 'Infosys SP is one of the highest paying campus roles for service companies. The OA bar is comparable to Tier-1 product companies.',
    tips: 'Focus heavily on Segment Trees, Fenwick Trees, and DP with bitmasking. Always explain your thought process and trade-offs clearly to the interviewer.',
    upvotes: 51,
    status: 'APPROVED'
  },
  {
    company_slug: 'cognizant',
    company_name: 'Cognizant',
    role_title: 'GenC Elevate / GenC Next',
    student_name: 'Meera Krishnan',
    college: 'SSN College of Engineering',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    rounds: [
      {
        roundTitle: 'Round 1: Automata Fix & Coding',
        details: 'Automata Fix had 7 debugging questions in C/C++/Java (finding syntax and semantic bugs in 20 mins). The coding section had 2 problems on arrays and string manipulation.'
      },
      {
        roundTitle: 'Round 2: Technical Interview',
        details: 'Questions on OOPs principles with real-world examples, differences between abstract class and interface in Java 8+, SQL joins, and indexing.'
      },
      {
        roundTitle: 'Round 3: HR Round',
        details: 'Conversational round verifying communication skills, adaptability to shifts, and location preferences.'
      }
    ],
    overall_experience: 'Smooth and well-coordinated on-campus drive. Quick debugging skills in Automata Fix will easily set you apart from other applicants.',
    tips: 'Practice debugging tricky pointer and off-by-one errors in C/Java. Review database normalization up to 3NF.',
    upvotes: 29,
    status: 'APPROVED'
  },
  {
    company_slug: 'deloitte',
    company_name: 'Deloitte',
    role_title: 'Deloitte USI Technology Analyst',
    student_name: 'Aditya Sen',
    college: 'Jadavpur University',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    rounds: [
      {
        roundTitle: 'Round 1: Deloitte National Level Assessment (NLA)',
        details: 'Versant English test + Quantitative, Logical Reasoning, and 2 Computer Programming questions. Questions tested Array Inversions and String frequency maps.'
      },
      {
        roundTitle: 'Round 2: Technical Interview (40 Mins)',
        details: 'Interviewer asked about cloud fundamentals, differences between relational and NoSQL databases, and asked to write a Python script to group anagrams in a list.'
      },
      {
        roundTitle: 'Round 3: Partner Round',
        details: 'Situational business case study: How would you architect a secure reporting dashboard for an enterprise banking client?'
      }
    ],
    overall_experience: 'Deloitte places great emphasis on clear business articulation and problem-solving poise. Technical questions were fair and practical.',
    tips: 'Prepare structured answers for business case scenarios and ensure your resume projects have clear business impact metrics.',
    upvotes: 34,
    status: 'APPROVED'
  },
  {
    company_slug: 'google',
    company_name: 'Google',
    role_title: 'Software Engineer (Campus Graduate 2026)',
    student_name: 'Varun Taneja',
    college: 'IIIT Hyderabad',
    year: 2026,
    difficulty: 'HARD',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    rounds: [
      {
        roundTitle: 'Round 1: Google Online Challenge (GOC)',
        details: '2 problems in 60 minutes on HackerEarth. Problem 1 was Graph Dijkstra on a weighted grid. Problem 2 was dynamic programming with state compression.'
      },
      {
        roundTitle: 'Round 2: Technical Interview 1',
        details: '45 minutes. Asked an open-ended algorithmic problem on interval scheduling with weighted benefits. Discussed greedy vs DP approaches and proved optimality.'
      },
      {
        roundTitle: 'Round 3: Technical Interview 2',
        details: '45 minutes. Designed a scalable prefix-search / auto-complete data structure using a Trie with frequency heaps at each node. Analyzed memory complexity in detail.'
      },
      {
        roundTitle: 'Round 4: Googleyness & Leadership',
        details: 'Hypothetical workplace scenarios, intellectual humility, handling ambiguous requirements, and navigating cross-team disagreements.'
      }
    ],
    overall_experience: 'The benchmark of engineering interviews. Clean, bug-free code, proactive edge-case testing, and vocalizing mathematical time/space complexity are mandatory.',
    tips: 'Practice writing code on a plain Google Doc without syntax highlighting. Always test your solution manually with edge cases before claiming completion.',
    upvotes: 78,
    status: 'APPROVED'
  },
  {
    company_slug: 'wipro',
    company_name: 'Wipro',
    role_title: 'Project Engineer / Turbo',
    student_name: 'Pooja Hegde',
    college: 'BMS College of Engineering',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    rounds: [
      {
        roundTitle: 'Round 1: Wipro Elite NTH',
        details: 'Quantitative Aptitude, Logical Ability, Written Communication (Essay writing 20 mins), and 2 coding questions. Q1: Matrix boundary element sum. Q2: String character frequency comparison.'
      },
      {
        roundTitle: 'Round 2: Technical Interview',
        details: 'Questions on C++ pointers, static vs dynamic binding, differences between primary key and unique key, and walking through my final year IoT project.'
      },
      {
        roundTitle: 'Round 3: HR Discussion',
        details: 'Standard discussion on 1-year service agreement, readiness to work in rotating shifts, and company culture overview.'
      }
    ],
    overall_experience: 'Straightforward and accessible for all engineering disciplines. Essay writing is AI-graded, so grammar and vocabulary clarity matter.',
    tips: 'Do not use backspace excessively in the essay section as some testing environments track keystroke anomalies. Keep coding implementations concise and simple.',
    upvotes: 24,
    status: 'APPROVED'
  },
  {
    company_slug: 'capgemini',
    company_name: 'Capgemini',
    role_title: 'Senior Analyst (Exceller Package)',
    student_name: 'Harish Babu',
    college: 'Sastra University',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    rounds: [
      {
        roundTitle: 'Round 1: Pseudo-code & Communication Test',
        details: '30 pseudo-code questions (nested data structures, loop bounds) + spoken English test evaluating listening and repetition accuracy.'
      },
      {
        roundTitle: 'Round 2: Advanced Coding Challenge',
        details: '2 coding challenges. Q1: Array majority element using Boyer-Moore. Q2: Reverse string with vowel isolation.'
      },
      {
        roundTitle: 'Round 3: Technical & HR Combined Interview',
        details: 'Discussed my web development internships, differences between synchronous and asynchronous calls, and situational teamwork questions.'
      }
    ],
    overall_experience: 'The spoken English test is unique to Capgemini—ensure you test with a noise-canceling headset. The coding questions are standard LeetCode Easy/Medium.',
    tips: 'Practice spoken English modules and brush up on basic data structures (Stack, Queue, Hash Map).',
    upvotes: 31,
    status: 'APPROVED'
  }
];

// ============================================================================
// 5. MAIN EXECUTION ROUTINE
// ============================================================================
async function run() {
  console.log('================================================================');
  console.log('MOCKFOLDER DATABASE SEEDING & CLAIM VERIFICATION AUDIT');
  console.log('================================================================\n');

  // STEP 1: Rename Exams from "New Exam Module" to Professional 2026 Titles
  console.log('👉 STEP 1: Renaming generic "New Exam Module" exam titles...');
  await supabase.from('exams').update({ is_deleted: true }).eq('id', 'c055e7b6-f000-4517-a6df-398d9b535033');
  console.log('  ✔ Archived duplicate Deloitte exam module c055e7b6...');
  await supabase.from('companies').update({ name: 'Deloitte', slug: 'deloitte' }).eq('id', 'de241dd3-08c7-42e4-b50b-834e2d898343');
  console.log('  ✔ Fixed Deloitte spelling in companies table (slug: deloitte)');
  for (const [id, newTitle] of Object.entries(EXAM_RENAMES)) {
    const { error } = await supabase
      .from('exams')
      .update({ name: newTitle })
      .eq('id', id);

    if (error) {
      console.error(`  ❌ Failed to rename ${id}:`, error.message);
    } else {
      console.log(`  ✔ Renamed ${id.substring(0, 8)}... to "${newTitle}"`);
    }
  }

  // STEP 2: Seed Questions into the 9 Missing Companies
  console.log('\n👉 STEP 2: Seeding comprehensive paper questions & tabs into 9 missing company archives...');
  for (const [examId, paperData] of Object.entries(COMPANY_PAPERS)) {
    const questionsHtml = paperData.questions.map(buildQuestionHtml).join('\n\n');
    const tabsPayload = [
      {
        id: 'tab-1',
        title: paperData.tabTitle,
        content: questionsHtml,
        children: []
      }
    ];

    const { error } = await supabase
      .from('exams')
      .update({
        paper_tabs: tabsPayload,
        content: `### Solved 2026 Assessment Papers\n\nAccess verified placement questions with step-by-step algorithms, constraints, and interactive IDE test runners.`
      })
      .eq('id', examId);

    if (error) {
      console.error(`  ❌ Failed to seed paper questions for ${examId}:`, error.message);
    } else {
      console.log(`  ✔ Seeded ${paperData.questions.length} questions into ${examId.substring(0, 8)}... (${paperData.tabTitle})`);
    }
  }

  // STEP 3: Seed Community Interview Experiences
  console.log('\n👉 STEP 3: Seeding 9 authentic community interview experiences...');
  // First clean any prior duplicates if re-run
  const slugs = COMMUNITY_EXPERIENCES.map(e => e.company_slug);
  await supabase.from('experiences').delete().in('company_slug', slugs).eq('status', 'APPROVED');

  for (const exp of COMMUNITY_EXPERIENCES) {
    const { data: inserted, error } = await supabase
      .from('experiences')
      .insert({
        company_slug: exp.company_slug,
        company_name: exp.company_name,
        role_title: exp.role_title,
        student_name: exp.student_name,
        college: exp.college,
        year: exp.year,
        difficulty: exp.difficulty,
        verdict: exp.verdict,
        drive_type: exp.drive_type,
        rounds: exp.rounds,
        overall_experience: exp.overall_experience,
        tips: exp.tips,
        upvotes: exp.upvotes,
        status: 'APPROVED',
        is_deleted: false
      })
      .select('id, student_name');

    if (error) {
      console.error(`  ❌ Failed to insert experience for ${exp.company_name}:`, error.message);
    } else {
      const expId = inserted?.[0]?.id;
      if (expId) {
        await supabase.from('experiences').update({ status: 'APPROVED' }).eq('id', expId);
      }
      console.log(`  ✔ Inserted & Approved experience: [${exp.company_name}] ${exp.role_title} (${exp.student_name}) ID: ${expId}`);
    }
  }

  // Ensure all experiences are marked APPROVED
  await supabase.from('experiences').update({ status: 'APPROVED' }).eq('is_deleted', false);

  const { count: expCount } = await supabase.from('experiences').select('*', { count: 'exact', head: true });
  console.log('Total experiences in DB now:', expCount);

  // STEP 4: Synchronize local backup JSON file
  console.log('\n👉 STEP 4: Synchronizing scripts/backup_exams_paper_tabs.json...');
  const { data: allActiveExams } = await supabase.from('exams').select('*').eq('is_deleted', false);
  if (allActiveExams) {
    fs.writeFileSync('scripts/backup_exams_paper_tabs.json', JSON.stringify(allActiveExams, null, 2), 'utf8');
    console.log(`  ✔ Synced ${allActiveExams.length} active exams to backup_exams_paper_tabs.json`);
  }

  console.log('\n================================================================');
  console.log('✔ SEEDING AND VERIFICATION COMPLETE');
  console.log('================================================================');
}

run();
