import { supabase } from '@/lib/supabase';
import type { ProgrammingProblem, TechnicalMcq, ProblemLevel, ProblemCategory } from '@/types/technical';

const SOLVED_PROBLEMS_KEY = 'prepunite_solved_coding_problems';

export const technicalService = {
  // Solved Problem State Management
  getSolvedProblemIds(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(SOLVED_PROBLEMS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  },

  toggleProblemSolved(problemId: string): boolean {
    const solvedSet = this.getSolvedProblemIds();
    let isNowSolved = false;
    if (solvedSet.has(problemId)) {
      solvedSet.delete(problemId);
      isNowSolved = false;
    } else {
      solvedSet.add(problemId);
      isNowSolved = true;
    }
    try {
      localStorage.setItem(SOLVED_PROBLEMS_KEY, JSON.stringify(Array.from(solvedSet)));
    } catch {}
    return isNowSolved;
  },

  // Retrieve Programming 150 problems
  async getProgramming150Problems(): Promise<ProgrammingProblem[]> {
    const solvedSet = this.getSolvedProblemIds();
    return PROGRAMMING_150_SEED.map(p => ({
      ...p,
      solved: solvedSet.has(p.id),
    }));
  },

  // Retrieve Campus DSA Top 100 problems
  async getCampusDsaProblems(): Promise<ProgrammingProblem[]> {
    const solvedSet = this.getSolvedProblemIds();
    return CAMPUS_DSA_SEED.map(p => ({
      ...p,
      solved: solvedSet.has(p.id),
    }));
  },

  // Retrieve Technical MCQs & Pseudo-Code
  async getTechnicalMcqs(): Promise<TechnicalMcq[]> {
    return TECHNICAL_MCQS_SEED;
  },

  async getStats() {
    const p150 = await this.getProgramming150Problems();
    const dsa = await this.getCampusDsaProblems();
    const mcqs = await this.getTechnicalMcqs();
    const p150Solved = p150.filter(p => p.solved).length;
    const dsaSolved = dsa.filter(p => p.solved).length;
    const totalCoding = p150.length + dsa.length;
    const totalSolved = p150Solved + dsaSolved;
    return {
      p150Total: p150.length,
      p150Solved,
      dsaTotal: dsa.length,
      dsaSolved,
      mcqTotal: mcqs.length,
      totalCoding,
      totalSolved,
      percentage: totalCoding > 0 ? Math.round((totalSolved / totalCoding) * 100) : 0,
    };
  },
};

// ============================================================================
// 1. PROGRAMMING 150 SEED (Syntax, Logic Building, Patterns, Arrays, Strings)
// ============================================================================
const PROGRAMMING_150_SEED: ProgrammingProblem[] = [
  // --- LEVEL 1: BASIC & SYNTAX BUILDING ---
  {
    id: 'p150-1',
    title: 'Check Even or Odd without Modulo Operator',
    slug: 'check-even-or-odd-bitwise',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'SYNTAX_BASICS',
    categoryLabel: 'Basic Syntax & Operators',
    description: 'Given an integer N, determine whether the number is Even or Odd without using the modulo (%) or division (/) operator.',
    constraints: ['-10^9 <= N <= 10^9'],
    sampleInput: 'N = 7',
    sampleOutput: 'Odd',
    explanation: 'The binary representation of 7 is 0111. The least significant bit (LSB) is 1. Performing bitwise AND with 1 (7 & 1) yields 1, signifying an odd number. For even numbers, LSB is always 0.',
    solutions: {
      java: `public class Solution {
    public static String checkEvenOdd(int n) {
        // Bitwise AND check: (n & 1) is 0 for even, 1 for odd
        if ((n & 1) == 0) {
            return "Even";
        } else {
            return "Odd";
        }
    }
}`,
      python: `def check_even_odd(n: int) -> str:
    # Bitwise AND check: (n & 1) is 0 for even, 1 for odd
    return "Even" if (n & 1) == 0 else "Odd"`,
      cpp: `#include <iostream>
#include <string>

std::string checkEvenOdd(int n) {
    return (n & 1) == 0 ? "Even" : "Odd";
}`,
      c: `#include <stdio.h>

const char* checkEvenOdd(int n) {
    return (n & 1) == 0 ? "Even" : "Odd";
}`
    },
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['Examine the binary format of integers. What distinguishes even from odd numbers at the lowest bit?'],
    companyTags: ['TCS', 'Wipro', 'Capgemini']
  },
  {
    id: 'p150-2',
    title: 'Reverse a Number and Check Palindrome',
    slug: 'reverse-number-palindrome',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'NUMBER_LOGIC',
    categoryLabel: 'Number Theory & Logic',
    description: 'Given an integer N, reverse its digits and determine if it is a palindrome. Note that negative numbers are not considered palindromes.',
    constraints: ['0 <= N <= 10^9'],
    sampleInput: 'N = 1221',
    sampleOutput: 'Reversed: 1221, Is Palindrome: true',
    explanation: 'Extract digits using modulo 10 and build the reversed number by multiplying the running sum by 10. Finally, compare with original number.',
    solutions: {
      java: `public class Solution {
    public static boolean isPalindrome(int n) {
        if (n < 0) return false;
        int original = n;
        long reversed = 0;
        
        while (n > 0) {
            int digit = n % 10;
            reversed = reversed * 10 + digit;
            n /= 10;
        }
        return original == (int) reversed;
    }
}`,
      python: `def is_palindrome(n: int) -> bool:
    if n < 0:
        return False
    original, reversed_num = n, 0
    while n > 0:
        digit = n % 10
        reversed_num = reversed_num * 10 + digit
        n //= 10
    return original == reversed_num`,
      cpp: `bool isPalindrome(int n) {
    if (n < 0) return false;
    long original = n, reversedNum = 0;
    while (n > 0) {
        reversedNum = reversedNum * 10 + (n % 10);
        n /= 10;
    }
    return original == reversedNum;
}`,
      c: `int isPalindrome(int n) {
    if (n < 0) return 0;
    long original = n, reversedNum = 0;
    while (n > 0) {
        reversedNum = reversedNum * 10 + (n % 10);
        n /= 10;
    }
    return original == reversedNum;
}`
    },
    timeComplexity: 'O(log10(N))',
    spaceComplexity: 'O(1)',
    hints: ['Extract last digit with % 10, then discard with / 10.'],
    companyTags: ['Infosys', 'Cognizant', 'TCS']
  },
  {
    id: 'p150-3',
    title: 'Check Armstrong Number (Narcissistic Number)',
    slug: 'armstrong-number',
    track: 'PROGRAMMING_150',
    level: 'BASIC',
    category: 'NUMBER_LOGIC',
    categoryLabel: 'Number Theory & Logic',
    description: 'An Armstrong number of order K is a number that is the sum of its own digits each raised to the power of the total number of digits (K). Return true if N is an Armstrong number, otherwise false.',
    constraints: ['1 <= N <= 10^8'],
    sampleInput: 'N = 153',
    sampleOutput: 'true',
    explanation: '153 has 3 digits. 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153. Hence, 153 is an Armstrong number.',
    solutions: {
      java: `public class Solution {
    public static boolean isArmstrong(int n) {
        int original = n;
        int digits = String.valueOf(n).length();
        long sum = 0;
        int temp = n;
        
        while (temp > 0) {
            int rem = temp % 10;
            sum += Math.pow(rem, digits);
            temp /= 10;
        }
        return sum == original;
    }
}`,
      python: `def is_armstrong(n: int) -> bool:
    s = str(n)
    digits = len(s)
    return sum(int(c) ** digits for c in s) == n`,
      cpp: `#include <cmath>

bool isArmstrong(int n) {
    int original = n;
    int digits = 0, temp = n;
    while (temp > 0) { digits++; temp /= 10; }
    
    long long sum = 0;
    temp = n;
    while (temp > 0) {
        int rem = temp % 10;
        sum += std::pow(rem, digits);
        temp /= 10;
    }
    return sum == original;
}`
    },
    timeComplexity: 'O(log10(N))',
    spaceComplexity: 'O(1)',
    hints: ['First count the number of digits, then sum each digit raised to that power.'],
    companyTags: ['Accenture', 'TCS', 'HCL']
  },
  {
    id: 'p150-4',
    title: 'Print Hollow Square & Inverted Pyramid Patterns',
    slug: 'star-patterns-hollow-pyramid',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'PATTERNS',
    categoryLabel: 'Pattern Printing & Nested Loops',
    description: 'Given an integer N, generate an inverted pyramid of stars where row i contains (2*(N-i) - 1) stars preceded by i spaces.',
    constraints: ['1 <= N <= 20'],
    sampleInput: 'N = 4',
    sampleOutput: `*******
 *****
  ***
   *`,
    explanation: 'For row i from 0 to N-1, print i spaces followed by 2*(N-i) - 1 asterisks.',
    solutions: {
      java: `public class Solution {
    public static void printInvertedPyramid(int n) {
        for (int i = 0; i < n; i++) {
            // Print leading spaces
            for (int j = 0; j < i; j++) System.out.print(" ");
            // Print stars
            for (int k = 0; k < 2 * (n - i) - 1; k++) System.out.print("*");
            System.out.println();
        }
    }
}`,
      python: `def print_inverted_pyramid(n: int):
    for i in range(n):
        spaces = " " * i
        stars = "*" * (2 * (n - i) - 1)
        print(spaces + stars)`,
      cpp: `#include <iostream>

void printInvertedPyramid(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) std::cout << " ";
        for (int k = 0; k < 2 * (n - i) - 1; k++) std::cout << "*";
        std::cout << "\\n";
    }
}`
    },
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    hints: ['Analyze the formula for spaces (i) and stars (2*(N-i) - 1) for each row i.'],
    companyTags: ['Capgemini', 'Wipro', 'Infosys']
  },
  {
    id: 'p150-5',
    title: 'Find Second Largest Element in Array (Single Pass)',
    slug: 'second-largest-element-single-pass',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'ARRAYS',
    categoryLabel: 'Arrays & Vectors',
    description: 'Given an array of integers of size N, find the second largest distinct element without sorting the array.',
    constraints: ['2 <= N <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    sampleInput: 'arr = [12, 35, 1, 10, 34, 1]',
    sampleOutput: '34',
    explanation: 'Maintain two variables: largest and secondLargest. If arr[i] > largest, update secondLargest = largest and largest = arr[i]. Else if arr[i] > secondLargest and arr[i] != largest, update secondLargest.',
    solutions: {
      java: `public class Solution {
    public static int getSecondLargest(int[] arr) {
        int largest = Integer.MIN_VALUE;
        int secondLargest = Integer.MIN_VALUE;
        
        for (int num : arr) {
            if (num > largest) {
                secondLargest = largest;
                largest = num;
            } else if (num > secondLargest && num != largest) {
                secondLargest = num;
            }
        }
        return secondLargest == Integer.MIN_VALUE ? -1 : secondLargest;
    }
}`,
      python: `def get_second_largest(arr: list[int]) -> int:
    largest = second_largest = float('-inf')
    for num in arr:
        if num > largest:
            second_largest = largest
            largest = num
        elif num > second_largest and num != largest:
            second_largest = num
    return -1 if second_largest == float('-inf') else second_largest`,
      cpp: `#include <vector>
#include <climits>

int getSecondLargest(const std::vector<int>& arr) {
    int largest = INT_MIN, secondLargest = INT_MIN;
    for (int num : arr) {
        if (num > largest) {
            secondLargest = largest;
            largest = num;
        } else if (num > secondLargest && num != largest) {
            secondLargest = num;
        }
    }
    return (secondLargest == INT_MIN) ? -1 : secondLargest;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Keep track of both largest and second largest simultaneously in a single iteration.'],
    companyTags: ['TCS Digital', 'Cognizant GenC Next', 'Amazon']
  },
  {
    id: 'p150-6',
    title: 'Valid Anagram Check (Frequency Hash)',
    slug: 'valid-anagram-check',
    track: 'PROGRAMMING_150',
    level: 'MEDIUM',
    category: 'STRINGS',
    categoryLabel: 'Strings & Character Arrays',
    description: 'Given two strings s and t, return true if t is an anagram of s (contains the exact same characters with the exact same frequencies), and false otherwise.',
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t contain lowercase English letters.'],
    sampleInput: 's = "anagram", t = "nagaram"',
    sampleOutput: 'true',
    explanation: 'Use a fixed array of size 26 to count character frequencies. Increment for s and decrement for t. If all 26 buckets are 0, they are anagrams.',
    solutions: {
      java: `public class Solution {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }
}`,
      python: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = [0] * 26
    for c1, c2 in zip(s, t):
        count[ord(c1) - ord('a')] += 1
        count[ord(c2) - ord('a')] -= 1
    return all(c == 0 for c in count)`,
      cpp: `#include <string>
#include <vector>

bool isAnagram(const std::string& s, const std::string& t) {
    if (s.length() != t.length()) return false;
    int count[26] = {0};
    for (size_t i = 0; i < s.length(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    for (int i = 0; i < 26; i++) {
        if (count[i] != 0) return false;
    }
    return true;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1) [Fixed 26 buckets]',
    hints: ['Since input is limited to lowercase English letters, a 26-size integer array is optimal.'],
    companyTags: ['Amazon', 'Infosys', 'TCS']
  },
  {
    id: 'p150-7',
    title: 'Generate All Subsets / Power Set (Backtracking & Bitmask)',
    slug: 'power-set-subsets',
    track: 'PROGRAMMING_150',
    level: 'HARD',
    category: 'RECURSION',
    categoryLabel: 'Recursion & Backtracking',
    description: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10'],
    sampleInput: 'nums = [1, 2, 3]',
    sampleOutput: '[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]',
    explanation: 'For each element, we have two choices: include it in the current subset or exclude it. Using backtracking, we explore both choices recursively.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private static void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current));
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.remove(current.size() - 1); // backtrack
        }
    }
}`,
      python: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    def backtrack(start, current):
        result.append(list(current))
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return result`,
      cpp: `#include <vector>

void backtrack(const std::vector<int>& nums, int start, std::vector<int>& current, std::vector<std::vector<int>>& result) {
    result.push_back(current);
    for (size_t i = start; i < nums.size(); i++) {
        current.push_back(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.pop_back();
    }
}

std::vector<std::vector<int>> subsets(const std::vector<int>& nums) {
    std::vector<std::vector<int>> result;
    std::vector<int> current;
    backtrack(nums, 0, current, result);
    return result;
}`
    },
    timeComplexity: 'O(2^N)',
    spaceComplexity: 'O(N) recursion stack',
    hints: ['At each index, decide whether to include the element or skip it.'],
    companyTags: ['TCS Prime', 'Amazon', 'Microsoft']
  }
];

// ============================================================================
// 2. CAMPUS DSA CORE SEED (The 15 Placement Patterns)
// ============================================================================
const CAMPUS_DSA_SEED: ProgrammingProblem[] = [
  {
    id: 'dsa-1',
    title: 'Longest Substring Without Repeating Characters (Sliding Window)',
    slug: 'longest-substring-without-repeating-characters',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'SLIDING_WINDOW',
    categoryLabel: 'Pattern 1: Sliding Window',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    sampleInput: 's = "abcabcbb"',
    sampleOutput: '3',
    explanation: 'The answer is "abc", with the length of 3. Use two pointers (left and right) to maintain a window of unique characters stored in a HashMap/HashSet.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int maxLength = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c)) {
                // Advance left pointer past previous occurrence
                left = Math.max(left, lastSeen.get(c) + 1);
            }
            lastSeen.put(c, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }
        return maxLength;
    }
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    max_len = 0
    left = 0
    for right, char in enumerate(s):
        if char in last_seen:
            left = max(left, last_seen[char] + 1)
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

int lengthOfLongestSubstring(const std::string& s) {
    std::unordered_map<char, int> lastSeen;
    int maxLen = 0, left = 0;
    for (int right = 0; right < (int)s.length(); right++) {
        if (lastSeen.count(s[right])) {
            left = std::max(left, lastSeen[s[right]] + 1);
        }
        lastSeen[s[right]] = right;
        maxLen = std::max(maxLen, right - left + 1);
    }
    return maxLen;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, M)) where M is character set size',
    hints: ['Store the last seen index of each character to skip repeated scans.'],
    companyTags: ['Amazon', 'Microsoft', 'TCS Prime', 'Infosys SP']
  },
  {
    id: 'dsa-2',
    title: 'Trapping Rain Water (Two Pointers Pattern)',
    slug: 'trapping-rain-water',
    track: 'CAMPUS_DSA',
    level: 'HARD',
    category: 'TWO_POINTERS',
    categoryLabel: 'Pattern 2: Two Pointers',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    sampleOutput: '6',
    explanation: 'Water trapped at position i depends on min(maxLeft, maxRight) - height[i]. Using two pointers moving from both ends, we can compute this in O(1) space.',
    solutions: {
      java: `public class Solution {
    public static int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int maxLeft = 0, maxRight = 0;
        int water = 0;
        
        while (left < right) {
            if (height[left] <= height[right]) {
                if (height[left] >= maxLeft) maxLeft = height[left];
                else water += maxLeft - height[left];
                left++;
            } else {
                if (height[right] >= maxRight) maxRight = height[right];
                else water += maxRight - height[right];
                right--;
            }
        }
        return water;
    }
}`,
      python: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_left = max_right = water = 0
    while left < right:
        if height[left] <= height[right]:
            if height[left] >= max_left:
                max_left = height[left]
            else:
                water += max_left - height[left]
            left += 1
        else:
            if height[right] >= max_right:
                max_right = height[right]
            else:
                water += max_right - height[right]
            right -= 1
    return water`,
      cpp: `#include <vector>
#include <algorithm>

int trap(const std::vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxLeft = 0, maxRight = 0, water = 0;
    while (left < right) {
        if (height[left] <= height[right]) {
            if (height[left] >= maxLeft) maxLeft = height[left];
            else water += maxLeft - height[left];
            left++;
        } else {
            if (height[right] >= maxRight) maxRight = height[right];
            else water += maxRight - height[right];
            right--;
        }
    }
    return water;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['The smaller boundary determines water retention capacity at any step.'],
    companyTags: ['Amazon', 'Google', 'Flipkart', 'Goldman Sachs']
  },
  {
    id: 'dsa-3',
    title: 'Next Greater Element I (Monotonic Stack)',
    slug: 'next-greater-element-monotonic-stack',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'STACKS_QUEUES',
    categoryLabel: 'Pattern 3: Monotonic Stack',
    description: 'Given an array of integers, find the next greater element for each element in the array. If no greater element exists to the right, return -1 for that position.',
    constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^9'],
    sampleInput: 'nums = [4, 5, 2, 25]',
    sampleOutput: '[5, 25, 25, -1]',
    explanation: 'Iterate from right to left using a monotonic decreasing stack. Pop elements smaller than or equal to current. The top of stack is the next greater element.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public static int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && stack.peek() <= nums[i]) {
                stack.pop();
            }
            result[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(nums[i]);
        }
        return result;
    }
}`,
      python: `def next_greater_elements(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and stack[-1] <= nums[i]:
            stack.pop()
        if stack:
            result[i] = stack[-1]
        stack.append(nums[i])
    return result`,
      cpp: `#include <vector>
#include <stack>

std::vector<int> nextGreaterElements(const std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> result(n, -1);
    std::stack<int> s;
    for (int i = n - 1; i >= 0; i--) {
        while (!s.empty() && s.top() <= nums[i]) {
            s.pop();
        }
        if (!s.empty()) result[i] = s.top();
        s.push(nums[i]);
    }
    return result;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    hints: ['Each element is pushed and popped from stack at most once.'],
    companyTags: ['Cognizant', 'TCS Prime', 'Wipro Turbo', 'Paytm']
  }
];

// ============================================================================
// 3. TECHNICAL MCQS SEED (Output Prediction & Pseudo-Code Traps)
// ============================================================================
const TECHNICAL_MCQS_SEED: TechnicalMcq[] = [
  {
    id: 'tmcq-1',
    topic: 'C/C++ Post-Increment & Operator Precedence',
    topicCategory: 'C_CPP_SNIPPETS',
    question: 'What will be the output of the following C code snippet?',
    codeSnippet: `#include <stdio.h>
int main() {
    int x = 5;
    int y = x++ + ++x;
    printf("%d, %d", x, y);
    return 0;
}`,
    options: ['7, 12', '7, 13', 'Undefined / Compiler Dependent (Sequence Point Violation)', '6, 11'],
    correctOptionIndex: 2,
    explanation: 'Modifying a scalar variable more than once between sequence points (in an expression without an intermediate sequence point) invokes Undefined Behavior (UB) under the C standard. Many placement papers test this fundamental C specification.',
    companyTags: ['Capgemini', 'Accenture', 'TCS Ninja']
  },
  {
    id: 'tmcq-2',
    topic: 'Java String Immortality & String Pool',
    topicCategory: 'JAVA_SNIPPETS',
    question: 'What is the output of the following Java program?',
    codeSnippet: `public class Test {
    public static void main(String[] args) {
        String s1 = "PrepUnite";
        String s2 = new String("PrepUnite");
        String s3 = s2.intern();
        
        System.out.println((s1 == s2) + " " + (s1 == s3));
    }
}`,
    options: ['true true', 'false true', 'false false', 'true false'],
    correctOptionIndex: 1,
    explanation: '`s1 == s2` compares memory references. s1 is in the String Constant Pool while s2 is created on the heap via `new`, so `s1 == s2` is false. `s2.intern()` returns the canonical representation from the String Pool, which equals s1 reference, so `s1 == s3` is true.',
    companyTags: ['TCS Digital', 'Infosys', 'Cognizant']
  },
  {
    id: 'tmcq-3',
    topic: 'Accenture / Capgemini Pseudo-Code Dry Run',
    topicCategory: 'PSEUDO_CODE',
    question: 'What is the value returned by the following pseudo-code for inputs A = 14, B = 5?',
    codeSnippet: `function solve(A, B):
    while B > 0:
        carry = (A & B) << 1
        A = A ^ B
        B = carry
    return A`,
    options: ['19', '9', '70', '28'],
    correctOptionIndex: 0,
    explanation: 'This is the standard bitwise adder algorithm (Half Adder loop). A ^ B computes the sum without carry, and (A & B) << 1 computes the carry. The loop halts when carry B becomes 0, returning 14 + 5 = 19.',
    companyTags: ['Accenture', 'Capgemini', 'Mindtree']
  },
  {
    id: 'tmcq-4',
    topic: 'Python Default Argument Trap',
    topicCategory: 'PYTHON_SNIPPETS',
    question: 'What will be the output of executing the following Python code?',
    codeSnippet: `def append_val(val, lst=[]):
    lst.append(val)
    return lst

print(append_val(1))
print(append_val(2))`,
    options: ['[1] and [2]', '[1] and [1, 2]', '[1] and [[1], 2]', 'TypeError'],
    correctOptionIndex: 1,
    explanation: 'In Python, default arguments are evaluated once when the function is defined, not each time the function is called. Because a list is mutable, successive calls mutate the same shared default list instance.',
    companyTags: ['TCS Prime', 'Wipro Turbo', 'Accenture']
  }
];
