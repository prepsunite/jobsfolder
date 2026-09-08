import { supabase } from '@/lib/supabase';
import type { ProgrammingProblem, TechnicalMcq, TechnicalMcqProgress, ProblemLevel, ProblemCategory, ProgrammingTopic, TechnicalTrack } from '@/types/technical';
import { PROGRAMMING_TOPICS, CAMPUS_DSA_TOPICS, TECHNICAL_MCQ_TOPICS, PROGRAMMING_150_EXPANDED_SEED } from './programmingTopicsData';

const SOLVED_PROBLEMS_KEY = 'prepunite_solved_coding_problems';
const IMPORTED_PROBLEMS_KEY = 'prepunite_imported_programming_problems';
const SOLVED_MCQS_KEY = 'prepunite_solved_technical_mcqs';

export const technicalService = {
  // Technical MCQ Progress Management
  getMcqProgress(): Record<string, TechnicalMcqProgress> {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(SOLVED_MCQS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  saveMcqProgress(mcqId: string, progress: TechnicalMcqProgress): void {
    const existing = this.getMcqProgress();
    existing[mcqId] = progress;
    try {
      localStorage.setItem(SOLVED_MCQS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save MCQ progress to localStorage:', e);
    }
  },

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

  // Custom Imported Problems Management
  getImportedProblems(): ProgrammingProblem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(IMPORTED_PROBLEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async importProgrammingProblems(newProblems: Partial<ProgrammingProblem>[]): Promise<{ importedCount: number }> {
    const existing = this.getImportedProblems();
    const existingIds = new Set([...PROGRAMMING_150_EXPANDED_SEED.map(p => p.id), ...existing.map(p => p.id)]);
    let count = 0;

    const normalized: ProgrammingProblem[] = [];
    newProblems.forEach((p, idx) => {
      if (!p.title) return;
      let id = p.id || `custom-p150-${Date.now()}-${idx}`;
      while (existingIds.has(id)) {
        id = `custom-p150-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      existingIds.add(id);

      const topicId = p.topicId || 'syntax-operators';
      const matchedTopic = PROGRAMMING_TOPICS.find(t => t.id === topicId);

      let testCases = p.testCases;
      if (!testCases || testCases.length === 0) {
        if (p.sampleInput || p.sampleOutput) {
          testCases = [
            {
              input: p.sampleInput || '',
              output: p.sampleOutput || '',
              explanation: p.explanation || '',
            },
          ];
        } else {
          testCases = [];
        }
      }

      const item: ProgrammingProblem = {
        id,
        title: p.title.trim(),
        slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        track: 'PROGRAMMING_150',
        level: p.level || 'MEDIUM',
        category: p.category || (matchedTopic ? matchedTopic.category : 'SYNTAX_BASICS'),
        categoryLabel: p.categoryLabel || (matchedTopic ? matchedTopic.title : 'General Programming'),
        topicId,
        description: p.description || '',
        constraints: Array.isArray(p.constraints) ? p.constraints : (p.constraints ? [String(p.constraints)] : []),
        testCases,
        sampleInput: testCases[0]?.input || p.sampleInput || '',
        sampleOutput: testCases[0]?.output || p.sampleOutput || '',
        explanation: p.explanation || '',
        solutions: p.solutions || {
          java: '// Java implementation',
          python: '# Python implementation',
          cpp: '// C++ implementation',
          c: '// C implementation',
        },
        timeComplexity: p.timeComplexity || 'O(N)',
        spaceComplexity: p.spaceComplexity || 'O(1)',
        hints: Array.isArray(p.hints) ? p.hints : [],
        companyTags: Array.isArray(p.companyTags) ? p.companyTags : ['Campus Placement'],
      };

      normalized.push(item);
      count++;
    });

    const updated = [...existing, ...normalized];
    try {
      localStorage.setItem(IMPORTED_PROBLEMS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save imported problems to localStorage:', e);
    }

    return { importedCount: count };
  },

  deleteProgrammingProblem(problemId: string): boolean {
    const existing = this.getImportedProblems();
    const filtered = existing.filter(p => p.id !== problemId);
    try {
      localStorage.setItem(IMPORTED_PROBLEMS_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  // Retrieve Programming Topics (Structured Directory)
  async getProgrammingTopics(): Promise<ProgrammingTopic[]> {
    return PROGRAMMING_TOPICS;
  },

  // Retrieve Campus DSA Topics
  async getCampusDsaTopics(): Promise<ProgrammingTopic[]> {
    return CAMPUS_DSA_TOPICS;
  },

  // Retrieve Technical MCQ Topics
  async getTechnicalMcqTopics(): Promise<ProgrammingTopic[]> {
    return TECHNICAL_MCQ_TOPICS;
  },

  // Retrieve Topics by Track
  async getTopicsForTrack(track: TechnicalTrack): Promise<ProgrammingTopic[]> {
    if (track === 'CAMPUS_DSA') return CAMPUS_DSA_TOPICS;
    if (track === 'TECHNICAL_MCQS') return TECHNICAL_MCQ_TOPICS;
    return PROGRAMMING_TOPICS;
  },

  // Retrieve Programming 150 problems (Seed + Custom Imported)
  async getProgramming150Problems(): Promise<ProgrammingProblem[]> {
    const solvedSet = this.getSolvedProblemIds();
    const imported = this.getImportedProblems();
    const all = [...PROGRAMMING_150_EXPANDED_SEED, ...imported];
    return all.map(p => ({
      ...p,
      solved: solvedSet.has(p.id),
    }));
  },

  // Retrieve Programming Problems filtered by topic
  async getProblemsByTopic(topicId: string): Promise<ProgrammingProblem[]> {
    const all = await this.getProgramming150Problems();
    return all.filter(p => p.topicId === topicId);
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
    const mcqProgress = this.getMcqProgress();
    const mcqSolved = Object.values(mcqProgress).filter(p => p.solved).length;
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
      mcqSolved,
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
// 1. CAMPUS DSA CORE SEED (The 15 Placement Patterns)
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
    topicId: 'dsa-sliding-window',
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
}`,
      c: `// C Sliding Window
int lengthOfLongestSubstring(char* s) {
    int lastSeen[256];
    for (int i = 0; i < 256; i++) lastSeen[i] = -1;
    int maxLen = 0, left = 0, len = 0;
    while (s[len]) len++;
    for (int right = 0; right < len; right++) {
        unsigned char c = (unsigned char)s[right];
        if (lastSeen[c] >= left) left = lastSeen[c] + 1;
        lastSeen[c] = right;
        int cur = right - left + 1;
        if (cur > maxLen) maxLen = cur;
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
    topicId: 'dsa-two-pointers',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    sampleOutput: '6',
    explanation: 'Water trapped at position i depends on min(maxLeft, maxRight) - height[i]. Using two pointers moving from both ends, we compute this in O(1) auxiliary space.',
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
}`,
      c: `int trap(int* height, int heightSize) {
    int left = 0, right = heightSize - 1;
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
    topicId: 'dsa-monotonic-stack',
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
}`,
      c: `#include <stdlib.h>

int* nextGreaterElements(int* nums, int numsSize, int* returnSize) {
    *returnSize = numsSize;
    int* result = (int*)malloc(numsSize * sizeof(int));
    int* stack = (int*)malloc(numsSize * sizeof(int));
    int top = -1;
    for (int i = numsSize - 1; i >= 0; i--) {
        while (top >= 0 && stack[top] <= nums[i]) top--;
        result[i] = (top >= 0) ? stack[top] : -1;
        stack[++top] = nums[i];
    }
    free(stack);
    return result;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    hints: ['Each element is pushed and popped from stack at most once.'],
    companyTags: ['Cognizant', 'TCS Prime', 'Wipro Turbo', 'Paytm']
  },
  {
    id: 'dsa-4',
    title: 'Linked List Cycle II (Floyd\'s Tortoise & Hare)',
    slug: 'linked-list-cycle-ii',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'LINKED_LISTS',
    categoryLabel: 'Pattern 4: Fast & Slow Pointers',
    topicId: 'dsa-fast-slow-pointers',
    description: 'Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null. Solve without modifying the list and in O(1) memory.',
    constraints: ['The number of the nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5'],
    sampleInput: 'head = [3,2,0,-4], pos = 1 (tail connects to node index 1)',
    sampleOutput: 'Node with val = 2',
    explanation: 'When fast (2x) and slow (1x) meet, reset slow to head. Advance both 1 step at a time; the point where they meet again is the entry point of the cycle (by mathematical congruence 2(L+x) = L + kC + x).',
    solutions: {
      java: `class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }

public class Solution {
    public ListNode detectCycle(ListNode head) {
        if (head == null || head.next == null) return null;
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                ListNode entry = head;
                while (entry != slow) {
                    entry = entry.next;
                    slow = slow.next;
                }
                return entry;
            }
        }
        return null;
    }
}`,
      python: `def detectCycle(head):
    if not head or not head.next:
        return None
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            entry = head
            while entry != slow:
                entry = entry.next
                slow = slow.next
            return entry
    return None`,
      cpp: `struct ListNode { int val; ListNode *next; ListNode(int x) : val(x), next(nullptr) {} };

ListNode *detectCycle(ListNode *head) {
    if (!head || !head->next) return nullptr;
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            ListNode *entry = head;
            while (entry != slow) {
                entry = entry->next;
                slow = slow->next;
            }
            return entry;
        }
    }
    return nullptr;
}`,
      c: `struct ListNode* detectCycle(struct ListNode *head) {
    if (!head || !head->next) return 0;
    struct ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            struct ListNode *entry = head;
            while (entry != slow) {
                entry = entry->next;
                slow = slow->next;
            }
            return entry;
        }
    }
    return 0;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Distance from head to cycle start equals distance from meeting point to cycle start.'],
    companyTags: ['Amazon', 'Microsoft', 'Adobe', 'TCS Prime']
  },
  {
    id: 'dsa-5',
    title: 'Merge Overlapping Intervals',
    slug: 'merge-overlapping-intervals',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'ARRAYS',
    categoryLabel: 'Pattern 5: Merge Intervals',
    topicId: 'dsa-merge-intervals',
    description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals.',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    sampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
    sampleOutput: '[[1,6],[8,10],[15,18]]',
    explanation: 'Sort intervals by starting time. Maintain current merged interval. If current interval start <= previous end, merge by taking max(previous.end, current.end). Otherwise, append.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        for (int[] interval : intervals) {
            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {
                merged.add(interval);
            } else {
                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`,
      cpp: `#include <vector>
#include <algorithm>

std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {
    std::sort(intervals.begin(), intervals.end());
    std::vector<std::vector<int>> merged;
    for (const auto& interval : intervals) {
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            merged.back()[1] = std::max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}`,
      c: `// C interval merge helper
// Standard qsort by interval[0] followed by linear scan`
    },
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    hints: ['Sorting by interval start time guarantees adjacent overlaps can be merged linearly.'],
    companyTags: ['Google', 'Amazon', 'Infosys SP', 'Cognizant']
  },
  {
    id: 'dsa-6',
    title: 'First Missing Positive (Cyclic Sort Pattern)',
    slug: 'first-missing-positive-cyclic-sort',
    track: 'CAMPUS_DSA',
    level: 'HARD',
    category: 'SEARCHING_SORTING',
    categoryLabel: 'Pattern 6: Cyclic Sort',
    topicId: 'dsa-cyclic-sort',
    description: 'Given an unsorted integer array nums. Return the smallest positive integer that is not present in nums. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.',
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
    sampleInput: 'nums = [3,4,-1,1]',
    sampleOutput: '2',
    explanation: 'Place each number x in its correct index x - 1 using cyclic swap: while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i], swap(nums[i], nums[nums[i] - 1]). Then find the first index i where nums[i] != i + 1.',
    solutions: {
      java: `public class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int temp = nums[nums[i] - 1];
                nums[nums[i] - 1] = nums[i];
                nums[i] = temp;
            }
        }
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }
        return n + 1;
    }
}`,
      python: `def firstMissingPositive(nums: list[int]) -> int:
    n = len(nums)
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            correct_idx = nums[i] - 1
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1`,
      cpp: `#include <vector>
#include <algorithm>

int firstMissingPositive(std::vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            std::swap(nums[i], nums[nums[i] - 1]);
        }
    }
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}`,
      c: `int firstMissingPositive(int* nums, int numsSize) {
    for (int i = 0; i < numsSize; i++) {
        while (nums[i] > 0 && nums[i] <= numsSize && nums[nums[i] - 1] != nums[i]) {
            int target = nums[i] - 1;
            int temp = nums[target];
            nums[target] = nums[i];
            nums[i] = temp;
        }
    }
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return numsSize + 1;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['The answer must be in range [1, N + 1]. Use the array indices as a hash map in-place.'],
    companyTags: ['Amazon', 'Flipkart', 'Microsoft', 'TCS Prime']
  },
  {
    id: 'dsa-7',
    title: 'Reverse Nodes in k-Group',
    slug: 'reverse-nodes-in-k-group',
    track: 'CAMPUS_DSA',
    level: 'HARD',
    category: 'LINKED_LISTS',
    categoryLabel: 'Pattern 7: In-place Reversal of LinkedList',
    topicId: 'dsa-inplace-linkedlist',
    description: 'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. If the number of nodes is not a multiple of k left out at the end, leave as is.',
    constraints: ['The number of nodes in the list is n', '1 <= k <= n <= 5000', '0 <= Node.val <= 1000'],
    sampleInput: 'head = [1,2,3,4,5], k = 2',
    sampleOutput: '[2,1,4,3,5]',
    explanation: 'Count k nodes forward. If remaining nodes < k, terminate. Otherwise in-place reverse the k sub-list and reconnect boundary pointers.',
    solutions: {
      java: `class ListNode { int val; ListNode next; ListNode(int x) { val = x; } }

public class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prevGroup = dummy;
        
        while (true) {
            ListNode kth = getKth(prevGroup, k);
            if (kth == null) break;
            ListNode nextGroup = kth.next;
            
            ListNode prev = kth.next;
            ListNode curr = prevGroup.next;
            while (curr != nextGroup) {
                ListNode tmp = curr.next;
                curr.next = prev;
                prev = curr;
                curr = tmp;
            }
            
            ListNode tmp = prevGroup.next;
            prevGroup.next = kth;
            prevGroup = tmp;
        }
        return dummy.next;
    }
    private ListNode getKth(ListNode curr, int k) {
        while (curr != null && k > 0) {
            curr = curr.next;
            k--;
        }
        return curr;
    }
}`,
      python: `def reverseKGroup(head, k):
    dummy = ListNode(0)
    dummy.next = head
    prev_group = dummy
    
    def get_kth(curr, count):
        while curr and count > 0:
            curr = curr.next
            count -= 1
        return curr
        
    while True:
        kth = get_kth(prev_group, k)
        if not kth:
            break
        next_group = kth.next
        prev, curr = kth.next, prev_group.next
        while curr != next_group:
            tmp = curr.next
            curr.next = prev
            prev = curr
            curr = tmp
        tmp = prev_group.next
        prev_group.next = kth
        prev_group = tmp
    return dummy.next`,
      cpp: `// C++ In-place k-group reversal
// Standard dummy node with group reconnection`,
      c: `// C In-place k-group reversal pointer manipulation`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Check if k nodes exist before executing the pointer reversal.'],
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Paytm']
  },
  {
    id: 'dsa-8',
    title: 'Binary Tree Level Order Traversal (Tree BFS)',
    slug: 'binary-tree-level-order-traversal',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'TREES_BINARY_TREES',
    categoryLabel: 'Pattern 8: Tree BFS',
    topicId: 'dsa-tree-bfs',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    sampleInput: 'root = [3,9,20,null,null,15,7]',
    sampleOutput: '[[3],[9,20],[15,7]]',
    explanation: 'Use a Queue. For each level, snapshot queue size. Pop size nodes, append their values to current level array, and push left and right children.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}`,
      python: `from collections import deque

def levelOrder(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res`,
      cpp: `#include <vector>
#include <queue>

std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    std::vector<std::vector<int>> res;
    if (!root) return res;
    std::queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        std::vector<int> level;
        for (int i = 0; i < sz; i++) {
            TreeNode* cur = q.front(); q.pop();
            level.push_back(cur->val);
            if (cur->left) q.push(cur->left);
            if (cur->right) q.push(cur->right);
        }
        res.push_back(level);
    }
    return res;
}`,
      c: `// C Queue BFS level traversal implementation`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    hints: ['Level size snapshotting decouples levels cleanly inside the queue loop.'],
    companyTags: ['Amazon', 'TCS Prime', 'Wipro Turbo', 'Accenture']
  },
  {
    id: 'dsa-9',
    title: 'Lowest Common Ancestor of a Binary Tree (Tree DFS)',
    slug: 'lowest-common-ancestor-binary-tree',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'TREES_BINARY_TREES',
    categoryLabel: 'Pattern 9: Tree DFS',
    topicId: 'dsa-tree-dfs',
    description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q. LCA is defined as the lowest node in T that has both p and q as descendants.',
    constraints: ['The number of nodes in the tree is in the range [2, 10^5].', 'All Node.val are unique.'],
    sampleInput: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1',
    sampleOutput: '3',
    explanation: 'Post-order DFS: If current node is null or matches p or q, return current node. Recursively search left and right. If both return non-null, current node is LCA. Otherwise return the non-null child.',
    solutions: {
      java: `public class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return (left != null) ? left : right;
    }
}`,
      python: `def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right:
        return root
    return left or right`,
      cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`,
      c: `struct TreeNode* lowestCommonAncestor(struct TreeNode* root, struct TreeNode* p, struct TreeNode* q) {
    if (!root || root == p || root == q) return root;
    struct TreeNode* left = lowestCommonAncestor(root->left, p, q);
    struct TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H) where H is tree height',
    hints: ['If both subtrees report finding a target, the current root must be the common ancestor.'],
    companyTags: ['Amazon', 'Facebook', 'Microsoft', 'Infosys SP']
  },
  {
    id: 'dsa-10',
    title: 'Find Median from Data Stream (Two Heaps Pattern)',
    slug: 'find-median-from-data-stream',
    track: 'CAMPUS_DSA',
    level: 'HARD',
    category: 'STACKS_QUEUES',
    categoryLabel: 'Pattern 10: Two Heaps',
    topicId: 'dsa-two-heaps',
    description: 'Design a data structure that supports adding integer numbers from a data stream and finding the median of all elements seen so far in O(log N) insertion and O(1) query.',
    constraints: ['-10^5 <= num <= 10^5', 'At most 5 * 10^4 calls will be made to addNum and findMedian.'],
    sampleInput: 'addNum(1), addNum(2), findMedian() -> 1.5, addNum(3), findMedian() -> 2',
    sampleOutput: '1.5 then 2.0',
    explanation: 'Maintain two heaps: maxHeap for smaller half, minHeap for larger half. Keep heaps balanced such that maxHeap size is equal to or 1 greater than minHeap size. Median is either maxHeap.peek() or the average of both roots.',
    solutions: {
      java: `import java.util.*;

class MedianFinder {
    private PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder());
    private PriorityQueue<Integer> large = new PriorityQueue<>();

    public void addNum(int num) {
        small.offer(num);
        large.offer(small.poll());
        if (small.size() < large.size()) {
            small.offer(large.poll());
        }
    }

    public double findMedian() {
        return small.size() > large.size() ? small.peek() : (small.peek() + large.peek()) / 2.0;
    }
}`,
      python: `import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negated)
        self.large = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.small) < len(self.large):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0`,
      cpp: `#include <queue>

class MedianFinder {
    std::priority_queue<int> maxHeap;
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
public:
    void addNum(int num) {
        maxHeap.push(num);
        minHeap.push(maxHeap.top());
        maxHeap.pop();
        if (maxHeap.size() < minHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }
    double findMedian() {
        return maxHeap.size() > minHeap.size() ? maxHeap.top() : (maxHeap.top() + minHeap.top()) / 2.0;
    }
};`,
      c: `// C Median tracking with dual binary heap arrays`
    },
    timeComplexity: 'addNum: O(log N), findMedian: O(1)',
    spaceComplexity: 'O(N)',
    hints: ['Dividing numbers into two halves with top elements adjacent yields the median in O(1).'],
    companyTags: ['Amazon', 'Google', 'Goldman Sachs', 'TCS Prime']
  },
  {
    id: 'dsa-11',
    title: 'Combination Sum (Backtracking Pattern)',
    slug: 'combination-sum-backtracking',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'RECURSION',
    categoryLabel: 'Pattern 11: Subsets & Backtracking',
    topicId: 'dsa-subsets-backtracking',
    description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. Elements can be chosen unlimited times.',
    constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', '1 <= target <= 40'],
    sampleInput: 'candidates = [2,3,6,7], target = 7',
    sampleOutput: '[[2,2,3],[7]]',
    explanation: 'Sort candidates. Use backtracking DFS. At each step: include candidate candidates[i] and recurse with same index (allowing reuse), or backtrack and advance index.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(candidates);
        backtrack(candidates, target, 0, new ArrayList<>(), res);
        return res;
    }
    private void backtrack(int[] candidates, int remain, int start, List<Integer> current, List<List<Integer>> res) {
        if (remain == 0) {
            res.add(new ArrayList<>(current));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remain) break;
            current.add(candidates[i]);
            backtrack(candidates, remain - candidates[i], i, current, res);
            current.remove(current.size() - 1);
        }
    }
}`,
      python: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    res = []
    candidates.sort()
    def dfs(remain, start, path):
        if remain == 0:
            res.append(list(path))
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remain:
                break
            path.append(candidates[i])
            dfs(remain - candidates[i], i, path)
            path.pop()
    dfs(target, 0, [])
    return res`,
      cpp: `#include <vector>
#include <algorithm>

void dfs(const std::vector<int>& c, int remain, int start, std::vector<int>& path, std::vector<std::vector<int>>& res) {
    if (remain == 0) { res.push_back(path); return; }
    for (int i = start; i < (int)c.size(); i++) {
        if (c[i] > remain) break;
        path.push_back(c[i]);
        dfs(c, remain - c[i], i, path, res);
        path.pop_back();
    }
}

std::vector<std::vector<int>> combinationSum(std::vector<int>& candidates, int target) {
    std::sort(candidates.begin(), candidates.end());
    std::vector<std::vector<int>> res;
    std::vector<int> path;
    dfs(candidates, target, 0, path, res);
    return res;
}`,
      c: `// C recursive backtracking allocation helper`
    },
    timeComplexity: 'O(2^T) where T is target / min(candidates)',
    spaceComplexity: 'O(T)',
    hints: ['Sorting first allows pruning branches where candidates[i] > remain.'],
    companyTags: ['Amazon', 'Adobe', 'Infosys SP', 'Capgemini']
  },
  {
    id: 'dsa-12',
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'SEARCHING_SORTING',
    categoryLabel: 'Pattern 12: Modified Binary Search',
    topicId: 'dsa-modified-binary-search',
    description: 'Given the array nums after possible rotation at an unknown pivot index and an integer target, return the index of target if it is in nums, or -1 if it is not. Must run in O(log n) runtime.',
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.'],
    sampleInput: 'nums = [4,5,6,7,0,1,2], target = 0',
    sampleOutput: '4',
    explanation: 'One half (left or right of mid) is always sorted. Determine which half is sorted by comparing nums[low] and nums[mid]. Then check if target lies within that sorted range and narrow search.',
    solutions: {
      java: `public class Solution {
    public int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            if (nums[low] <= nums[mid]) {
                if (target >= nums[low] && target < nums[mid]) high = mid - 1;
                else low = mid + 1;
            } else {
                if (target > nums[mid] && target <= nums[high]) low = mid + 1;
                else high = mid - 1;
            }
        }
        return -1;
    }
}`,
      python: `def search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1`,
      cpp: `#include <vector>

int search(const std::vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[low] <= nums[mid]) {
            if (target >= nums[low] && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
      c: `int search(int* nums, int numsSize, int target) {
    int low = 0, high = numsSize - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[low] <= nums[mid]) {
            if (target >= nums[low] && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`
    },
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    hints: ['No matter where the pivot lies, dividing the array at midpoint leaves at least one half perfectly sorted.'],
    companyTags: ['Amazon', 'Google', 'TCS Digital', 'Accenture']
  },
  {
    id: 'dsa-13',
    title: 'Top K Frequent Elements (Min Heap Pattern)',
    slug: 'top-k-frequent-elements',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'STACKS_QUEUES',
    categoryLabel: 'Pattern 13: Top \'K\' Elements',
    topicId: 'dsa-top-k-elements',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order. Algorithm runtime must be better than O(n log n).',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, number of unique elements]'],
    sampleInput: 'nums = [1,1,1,2,2,3], k = 2',
    sampleOutput: '[1,2]',
    explanation: 'Build frequency hash map. Use a Min-Heap of size K keyed by frequency. When heap size exceeds K, pop the least frequent element. Remaining K elements are the most frequent.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.put(n, freq.getOrDefault(n, 0) + 1);
        
        PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> freq.get(a) - freq.get(b));
        for (int key : freq.keySet()) {
            heap.offer(key);
            if (heap.size() > k) heap.poll();
        }
        int[] res = new int[k];
        for (int i = k - 1; i >= 0; i--) res[i] = heap.poll();
        return res;
    }
}`,
      python: `import heapq
from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)`,
      cpp: `#include <vector>
#include <unordered_map>
#include <queue>

std::vector<int> topKFrequent(const std::vector<int>& nums, int k) {
    std::unordered_map<int, int> freq;
    for (int n : nums) freq[n]++;
    auto comp = [&](int a, int b) { return freq[a] > freq[b]; };
    std::priority_queue<int, std::vector<int>, decltype(comp)> pq(comp);
    for (const auto& [val, count] : freq) {
        pq.push(val);
        if ((int)pq.size() > k) pq.pop();
    }
    std::vector<int> res;
    while (!pq.empty()) { res.push_back(pq.top()); pq.pop(); }
    return res;
}`,
      c: `// C Hash frequency table with bounded min-heap`
    },
    timeComplexity: 'O(N log K)',
    spaceComplexity: 'O(N)',
    hints: ['Maintaining a heap of size K ensures log(K) insertions instead of log(N).'],
    companyTags: ['Amazon', 'Microsoft', 'Cognizant GenC', 'Infosys']
  },
  {
    id: 'dsa-14',
    title: 'Partition Equal Subset Sum (0/1 Knapsack DP)',
    slug: 'partition-equal-subset-sum',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'DYNAMIC_PROGRAMMING',
    categoryLabel: 'Pattern 14: 0/1 Knapsack & DP',
    topicId: 'dsa-01-knapsack-dp',
    description: 'Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise.',
    constraints: ['1 <= nums.length <= 200', '1 <= nums[i] <= 100'],
    sampleInput: 'nums = [1,5,11,5]',
    sampleOutput: 'true (subsets [1, 5, 5] and [11])',
    explanation: 'Sum must be even. Target = sum / 2. Problem reduces to 0/1 Knapsack: can we find a subset summing to Target? Maintain boolean dp array where dp[j] = dp[j] || dp[j - num], iterated in reverse.',
    solutions: {
      java: `public class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int n : nums) sum += n;
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int num : nums) {
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        return dp[target];
    }
}`,
      python: `def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    dp = [True] + [False] * target
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]`,
      cpp: `#include <vector>
#include <numeric>

bool canPartition(const std::vector<int>& nums) {
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    if (sum % 2 != 0) return false;
    int target = sum / 2;
    std::vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];
}`,
      c: `// C boolean dp buffer for 0/1 Knapsack`
    },
    timeComplexity: 'O(N * Target)',
    spaceComplexity: 'O(Target)',
    hints: ['Reverse iteration on the 1D DP array prevents using the same element multiple times.'],
    companyTags: ['Amazon', 'Infosys SP', 'TCS Prime', 'Wipro Turbo']
  },
  {
    id: 'dsa-15',
    title: 'Course Schedule (Topological Sort / Kahn\'s Algorithm)',
    slug: 'course-schedule-topological-sort',
    track: 'CAMPUS_DSA',
    level: 'MEDIUM',
    category: 'SEARCHING_SORTING',
    categoryLabel: 'Pattern 15: Topological Sort',
    topicId: 'dsa-topological-sort',
    description: 'There are numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given prerequisites where prerequisites[i] = [a_i, b_i] indicates you must take course b_i before a_i. Return true if you can finish all courses.',
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2'],
    sampleInput: 'numCourses = 2, prerequisites = [[1,0]]',
    sampleOutput: 'true',
    explanation: 'Model as a directed graph. Detect cycle using Kahn\'s BFS algorithm: compute in-degree of all nodes. Enqueue all 0 in-degree nodes. Pop node, decrement neighbors in-degree, and enqueue if they become 0. If processed count == numCourses, valid DAG with no cycle.',
    solutions: {
      java: `import java.util.*;

public class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] inDegree = new int[numCourses];
        
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) q.offer(i);
        }
        int count = 0;
        while (!q.isEmpty()) {
            int node = q.poll();
            count++;
            for (int neighbor : adj.get(node)) {
                if (--inDegree[neighbor] == 0) q.offer(neighbor);
            }
        }
        return count == numCourses;
    }
}`,
      python: `from collections import deque, defaultdict

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    adj = defaultdict(list)
    in_degree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1
    q = deque([i for i in range(numCourses) if in_degree[i] == 0])
    count = 0
    while q:
        node = q.popleft()
        count += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                q.append(neighbor)
    return count == numCourses`,
      cpp: `#include <vector>
#include <queue>

bool canFinish(int numCourses, std::vector<std::vector<int>>& prerequisites) {
    std::vector<std::vector<int>> adj(numCourses);
    std::vector<int> inDegree(numCourses, 0);
    for (const auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }
    std::queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) q.push(i);
    }
    int count = 0;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        count++;
        for (int neighbor : adj[node]) {
            if (--inDegree[neighbor] == 0) q.push(neighbor);
        }
    }
    return count == numCourses;
}`,
      c: `// C Adjacency list and in-degree array implementation of Kahn's algorithm`
    },
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    hints: ['If a directed graph has a cycle, at least one node will never reach in-degree 0.'],
    companyTags: ['Amazon', 'Google', 'TCS Prime', 'Infosys SP']
  }
];

// ============================================================================
// 3. TECHNICAL MCQS SEED (Output Prediction & Pseudo-Code Traps)
// ============================================================================
const TECHNICAL_MCQS_SEED: TechnicalMcq[] = [
  // ── C PROGRAMMING ──
  {
    id: 'tmcq-c-1',
    topic: 'C Pointer Arithmetic & Array Decay',
    topicCategory: 'C_PROGRAMMING',
    topicId: 'mcq-c-programming',
    question: 'What will be printed by the following C program?',
    codeSnippet: `#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = (int*)(&arr + 1);
    printf("%d", *(ptr - 1));
    return 0;
}`,
    options: ['10', '50', '40', 'Garbage / Segmentation Fault'],
    correctOptionIndex: 1,
    explanation: '`&arr` is a pointer to the entire array of 5 integers (`int (*)[5]`). Therefore, `&arr + 1` advances by `5 * sizeof(int)` bytes, pointing past the last element. Casting back to `(int*)` and subtracting 1 steps back by one integer, which points directly to `arr[4]` (50).',
    companyTags: ['Capgemini', 'TCS Ninja', 'Wipro']
  },
  {
    id: 'tmcq-c-2',
    topic: 'Sequence Points & Post-Increment in C',
    topicCategory: 'C_PROGRAMMING',
    topicId: 'mcq-c-programming',
    question: 'What is the behavior of the following expression in standard C?',
    codeSnippet: `#include <stdio.h>
int main() {
    int x = 5;
    int y = x++ + ++x;
    printf("%d, %d", x, y);
    return 0;
}`,
    options: ['7, 12', '7, 13', 'Undefined Behavior (Sequence Point Violation)', '6, 11'],
    correctOptionIndex: 2,
    explanation: 'Modifying a scalar object more than once between successive sequence points without an intervening sequence point invokes Undefined Behavior under ISO C (Annex J / §6.5). Placement exams frequently test this trap.',
    companyTags: ['Accenture', 'Capgemini', 'TCS Prime']
  },
  {
    id: 'tmcq-c-3',
    topic: 'Array Parameter Decay to Pointer in C',
    topicCategory: 'C_PROGRAMMING',
    topicId: 'mcq-c-programming',
    question: 'What will be printed when running this program on a 64-bit architecture?',
    codeSnippet: `#include <stdio.h>
void func(int arr[10]) {
    printf("%zu ", sizeof(arr));
}
int main() {
    int arr[10];
    printf("%zu ", sizeof(arr));
    func(arr);
    return 0;
}`,
    options: ['40 40', '40 8', '8 8', '40 4'],
    correctOptionIndex: 1,
    explanation: 'In `main()`, `arr` is an actual array of 10 integers, so `sizeof(arr)` is `10 * 4 = 40` bytes. In `func()`, array parameters automatically decay to a pointer (`int*`), so `sizeof(arr)` yields the pointer size (8 bytes on a 64-bit OS).',
    companyTags: ['Infosys', 'Cognizant', 'TCS Digital']
  },

  // ── C++ PROGRAMMING ──
  {
    id: 'tmcq-cpp-1',
    topic: 'Virtual Destructor & Polymorphic Deletion',
    topicCategory: 'CPP_PROGRAMMING',
    topicId: 'mcq-cpp-programming',
    question: 'Why is it crucial to declare a destructor as virtual in a base class that has virtual functions?',
    codeSnippet: `class Base {
public:
    virtual ~Base() { } // Why virtual?
};
class Derived : public Base {
    int *data = new int[100];
public:
    ~Derived() { delete[] data; }
};`,
    options: [
      'To allow the destructor to accept parameters',
      'To ensure the derived class destructor is called when deleting via a base pointer, preventing memory leaks',
      'To prevent the base class from being instantiated',
      'To automatically make all derived class methods inline'
    ],
    correctOptionIndex: 1,
    explanation: 'When deleting an object of a derived class through a pointer to the base class (`Base* p = new Derived(); delete p;`), if the base destructor is not virtual, the behavior is undefined and the derived destructor is never invoked, leaking allocated resources.',
    companyTags: ['Amazon', 'Microsoft', 'Adobe']
  },
  {
    id: 'tmcq-cpp-2',
    topic: 'Multiple Inheritance & Diamond Problem',
    topicCategory: 'CPP_PROGRAMMING',
    topicId: 'mcq-cpp-programming',
    question: 'In C++, how is the Diamond Problem (duplicate base subobjects) resolved when classes B and C both inherit from class A, and D inherits from B and C?',
    options: [
      'By using `virtual` inheritance when B and C inherit from A (`class B : virtual public A`)',
      'By declaring all methods in class A as `static`',
      'By using friend functions instead of inheritance',
      'By declaring class D as a template class'
    ],
    correctOptionIndex: 0,
    explanation: 'Virtual base classes (`virtual public A`) ensure that only one shared subobject of the base class A is included in the most derived class D, eliminating ambiguity and duplicate state.',
    companyTags: ['Qualcomm', 'Cisco', 'Samsung']
  },

  // ── C# PROGRAMMING ──
  {
    id: 'tmcq-cs-1',
    topic: 'Value Types (struct) vs Reference Types (class)',
    topicCategory: 'CSHARP_PROGRAMMING',
    topicId: 'mcq-csharp-programming',
    question: 'In C# (.NET CLR), what is the fundamental memory difference between a `struct` and a `class`?',
    options: [
      '`struct` is a reference type allocated on the managed heap; `class` is a value type',
      '`struct` is a value type typically allocated inline on the stack (or inline in containing object); `class` is a reference type allocated on the managed heap',
      '`struct` supports inheritance from other structs, whereas `class` does not',
      '`struct` has a finalizer and garbage collection overhead, whereas `class` does not'
    ],
    correctOptionIndex: 1,
    explanation: 'In C#, structs inherit from `System.ValueType` and are allocated on the stack (unless boxed or inside a heap object). Classes inherit from `System.Object` and instances reside on the managed heap with GC management.',
    companyTags: ['Microsoft', 'Accenture', 'EY']
  },
  {
    id: 'tmcq-cs-2',
    topic: 'String vs StringBuilder in C#',
    topicCategory: 'CSHARP_PROGRAMMING',
    topicId: 'mcq-csharp-programming',
    question: 'Why should `System.Text.StringBuilder` be used instead of string concatenation (`+=`) inside high-iteration loops in C#?',
    options: [
      '`System.String` is immutable, so concatenation creates a new string and discards the old one on each iteration, causing high heap allocations and GC pressure',
      '`StringBuilder` compiles down to C++ raw pointers at runtime',
      '`String` in C# cannot exceed 256 characters in length',
      '`StringBuilder` executes asynchronously on a background thread by default'
    ],
    correctOptionIndex: 0,
    explanation: 'Because `string` instances in .NET are immutable, repeated concatenation inside a loop of N iterations allocates O(N^2) total memory and triggers frequent Garbage Collection cycles. `StringBuilder` uses an internal expandable buffer with amortized O(1) appends.',
    companyTags: ['Microsoft', 'Wipro Turbo', 'TCS Digital']
  },

  // ── JAVA PROGRAMMING ──
  {
    id: 'tmcq-java-1',
    topic: 'Java String Immortality & String Pool',
    topicCategory: 'JAVA_PROGRAMMING',
    topicId: 'mcq-java-programming',
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
    id: 'tmcq-java-2',
    topic: 'Java Static Method Hiding vs Overriding',
    topicCategory: 'JAVA_PROGRAMMING',
    topicId: 'mcq-java-programming',
    question: 'What is the output of the following Java program?',
    codeSnippet: `class Parent {
    static void print() { System.out.print("Parent "); }
}
class Child extends Parent {
    static void print() { System.out.print("Child "); }
}
public class Main {
    public static void main(String[] args) {
        Parent obj = new Child();
        obj.print();
    }
}`,
    options: ['Child ', 'Parent ', 'Compilation Error', 'Runtime Exception'],
    correctOptionIndex: 1,
    explanation: 'Static methods in Java are not dispatched dynamically using the runtime object type; they are hidden, resolved at compile-time according to the reference variable type (`Parent obj`). Thus, `Parent.print()` executes.',
    companyTags: ['Infosys', 'Cognizant', 'TCS Digital']
  },
  {
    id: 'tmcq-java-3',
    topic: 'Try-Catch-Finally Execution Precedence in Java',
    topicCategory: 'JAVA_PROGRAMMING',
    topicId: 'mcq-java-programming',
    question: 'What value does the method `test()` return in Java?',
    codeSnippet: `public class Test {
    public static int test() {
        try {
            return 10;
        } finally {
            return 20;
        }
    }
    public static void main(String[] args) {
        System.out.println(test());
    }
}`,
    options: ['10', '20', 'Compilation Error (Unreachable code)', '10 followed by 20'],
    correctOptionIndex: 1,
    explanation: 'A `return` statement inside a `finally` block overrides any pending `return` statement in the `try` or `catch` blocks. The method completes abruptly with the return value of the `finally` block (20).',
    companyTags: ['Amazon', 'Oracle', 'Wipro']
  },

  // ── DATABASE (DBMS & SQL) ──
  {
    id: 'tmcq-db-1',
    topic: 'WHERE vs HAVING Clause in SQL',
    topicCategory: 'DATABASE',
    topicId: 'mcq-database',
    question: 'What is the fundamental difference between the `WHERE` and `HAVING` clauses in SQL?',
    options: [
      '`WHERE` filters rows before grouping/aggregation; `HAVING` filters aggregated groups after `GROUP BY`',
      '`WHERE` can only be used with numeric data types, whereas `HAVING` is for strings',
      '`HAVING` filters rows before grouping, and `WHERE` filters after grouping',
      '`WHERE` requires an index, whereas `HAVING` disables table indexes'
    ],
    correctOptionIndex: 0,
    explanation: '`WHERE` is evaluated prior to the `GROUP BY` operation to filter individual records. `HAVING` is evaluated after the grouping step and can filter on aggregate expressions (e.g., `HAVING COUNT(*) > 5`).',
    companyTags: ['Oracle', 'TCS Prime', 'Accenture']
  },
  {
    id: 'tmcq-db-2',
    topic: 'ACID Properties: Durability & WAL',
    topicCategory: 'DATABASE',
    topicId: 'mcq-database',
    question: 'Which ACID property guarantees that once a transaction commits, its changes survive system crashes or power failures?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correctOptionIndex: 3,
    explanation: 'Durability ensures that committed transaction changes are permanently written to non-volatile storage (typically ensured via Write-Ahead Logging / WAL and checkpoints) so they persist even in a catastrophic crash.',
    companyTags: ['Amazon', 'Flipkart', 'Goldman Sachs']
  },
  {
    id: 'tmcq-db-3',
    topic: 'Database Normalization: 3NF vs BCNF',
    topicCategory: 'DATABASE',
    topicId: 'mcq-database',
    question: 'A relational schema is in Third Normal Form (3NF) if it is in 2NF and has no transitive dependencies. Under what condition does 3NF differ from Boyce-Codd Normal Form (BCNF)?',
    options: [
      'In BCNF, for every functional dependency X -> Y, X must be a superkey; 3NF additionally permits Y to be a prime attribute',
      '3NF requires all attributes to be atomic, whereas BCNF allows nested tables',
      'BCNF applies only to non-relational databases',
      '3NF has stricter requirements than BCNF'
    ],
    correctOptionIndex: 0,
    explanation: 'BCNF is a stricter version of 3NF. In 3NF, if X -> Y is a dependency, either X is a superkey OR Y is a prime attribute (part of a candidate key). BCNF eliminates the second exception: X must strictly be a superkey.',
    companyTags: ['Microsoft', 'SAP', 'Infosys']
  },

  // ── COMPUTER NETWORKS ──
  {
    id: 'tmcq-net-1',
    topic: 'TCP 3-Way Handshake Connection Establishment',
    topicCategory: 'NETWORKING',
    topicId: 'mcq-networking',
    question: 'What is the correct sequence of packet flags exchanged during a standard TCP 3-way handshake to establish a connection?',
    options: [
      'SYN -> SYN-ACK -> ACK',
      'ACK -> SYN -> ACK',
      'SYN -> ACK -> DATA',
      'RST -> SYN -> ACK'
    ],
    correctOptionIndex: 0,
    explanation: 'The client initiates with a SYN (synchronize sequence numbers), the server responds with SYN-ACK (acknowledging client and synchronizing server sequence number), and the client finishes with ACK.',
    companyTags: ['Cisco', 'Juniper', 'TCS Ninja']
  },
  {
    id: 'tmcq-net-2',
    topic: 'Subnetting & Usable Host Calculation',
    topicCategory: 'NETWORKING',
    topicId: 'mcq-networking',
    question: 'For an IPv4 network with prefix `/27` (subnet mask 255.255.255.224), how many usable host IP addresses are available in each subnet?',
    options: ['32', '30', '62', '14'],
    correctOptionIndex: 1,
    explanation: 'With `/27`, the host portion has $32 - 27 = 5$ bits. Total addresses = $2^5 = 32$. Subtracting 2 (one for network ID, one for broadcast address) gives $32 - 2 = 30$ assignable host IP addresses.',
    companyTags: ['Cisco', 'Wipro Turbo', 'Cognizant']
  },
  {
    id: 'tmcq-net-3',
    topic: 'Address Resolution Protocol (ARP)',
    topicCategory: 'NETWORKING',
    topicId: 'mcq-networking',
    question: 'What is the primary function of the Address Resolution Protocol (ARP) in a Local Area Network (LAN)?',
    options: [
      'To map a known IPv4 address (Layer 3) to a physical MAC address (Layer 2)',
      'To convert domain names (e.g., google.com) into IP addresses',
      'To dynamically assign IP addresses to new network hosts',
      'To encrypt transport layer segments across VPNs'
    ],
    correctOptionIndex: 0,
    explanation: 'ARP operates between Layer 2 and Layer 3 to resolve a known logical IP address to a physical Data Link Layer MAC address by broadcasting an ARP Request frame on the local Ethernet segment.',
    companyTags: ['Accenture', 'TCS Prime', 'Airtel']
  },

  // ── OPERATING SYSTEMS ──
  {
    id: 'tmcq-os-1',
    topic: 'Coffman Conditions for Deadlock',
    topicCategory: 'OPERATING_SYSTEMS',
    topicId: 'mcq-operating-systems',
    question: 'Which of the following is NOT one of the four essential Coffman conditions required simultaneously for a deadlock to occur?',
    options: [
      'Mutual Exclusion',
      'Hold and Wait',
      'Preemptive Resource Scheduling',
      'Circular Wait'
    ],
    correctOptionIndex: 2,
    explanation: 'The four Coffman conditions are: (1) Mutual Exclusion, (2) Hold and Wait, (3) NO Preemption, and (4) Circular Wait. Preemptive resource scheduling prevents deadlock by allowing the OS to revoke resources from processes.',
    companyTags: ['Microsoft', 'Amazon', 'Qualcomm']
  },
  {
    id: 'tmcq-os-2',
    topic: 'Virtual Memory & Belady\'s Anomaly',
    topicCategory: 'OPERATING_SYSTEMS',
    topicId: 'mcq-operating-systems',
    question: 'What is Belady\'s Anomaly in operating systems virtual memory management?',
    options: [
      'Increasing the number of allocated page frames increases the number of page faults for certain access strings in FIFO page replacement',
      'LRU page replacement causes thrashing on small memory systems',
      'Dirty pages cannot be written back to disk during swapping',
      'Process execution slows down exponentially when stack overflows into heap'
    ],
    correctOptionIndex: 0,
    explanation: 'Belady\'s Anomaly is the phenomenon where giving more page frames to a process can actually increase the page fault frequency. It occurs in FIFO page replacement because FIFO is not a stack-based algorithm (unlike LRU or Optimal).',
    companyTags: ['Intel', 'Oracle', 'Samsung']
  },
  {
    id: 'tmcq-os-3',
    topic: 'fork() System Call Return Value in Unix/Linux',
    topicCategory: 'OPERATING_SYSTEMS',
    topicId: 'mcq-operating-systems',
    question: 'In a Unix/Linux environment, what does the `fork()` system call return to the child process upon successful creation?',
    options: ['0', 'The PID of the parent process', 'The PID of the newly created child process', '1'],
    correctOptionIndex: 0,
    explanation: '`fork()` returns 0 to the newly created child process, and returns the child\'s Process ID (PID > 0) to the parent process. This return value allows code to branch based on whether it is running as parent or child.',
    companyTags: ['Red Hat', 'Google', 'Cisco']
  },

  // ── DATA STRUCTURES ──
  {
    id: 'tmcq-ds-1',
    topic: 'BST Height Bounds & Binary Tree Properties',
    topicCategory: 'DATA_STRUCTURES',
    topicId: 'mcq-data-structures',
    question: 'What is the maximum and minimum height of a Binary Search Tree (BST) containing N nodes, where height of a single-node tree is 0?',
    options: ['Max: N - 1, Min: floor(log2(N))', 'Max: N, Min: log2(N) + 1', 'Max: 2^N, Min: log2(N)', 'Max: N - 1, Min: N / 2'],
    correctOptionIndex: 0,
    explanation: 'When keys are inserted in sorted order, the BST degenerates into a linear skewed list of height N - 1. When keys are balanced symmetrically, the tree achieves minimum height floor(log2(N)).',
    companyTags: ['TCS Prime', 'Wipro Turbo', 'Infosys SP']
  },
  {
    id: 'tmcq-ds-2',
    topic: 'Queue Implementation using Two Stacks',
    topicCategory: 'DATA_STRUCTURES',
    topicId: 'mcq-data-structures',
    question: 'When implementing a FIFO Queue using two LIFO Stacks (stack1 for enqueue, stack2 for dequeue), what is the amortized time complexity of the dequeue operation?',
    options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
    correctOptionIndex: 2,
    explanation: 'Each element is pushed to stack1 once, popped and transferred to stack2 once, and popped from stack2 once. Over N dequeue operations, total work is 3N, meaning the amortized cost per dequeue is O(1).',
    companyTags: ['Amazon', 'Microsoft', 'Capgemini']
  },
  {
    id: 'tmcq-ds-3',
    topic: 'Circular Queue Full Condition',
    topicCategory: 'DATA_STRUCTURES',
    topicId: 'mcq-data-structures',
    question: 'In an array-based Circular Queue of capacity N where `front` and `rear` track indices, what condition indicates that the queue is full?',
    options: [
      '(rear + 1) % N == front',
      'rear == N - 1',
      'rear == front',
      '(front + 1) % N == rear'
    ],
    correctOptionIndex: 0,
    explanation: 'In circular queue implementations, leaving one slot empty allows distinguishing between full and empty states. When `(rear + 1) % N == front`, the queue is considered full.',
    companyTags: ['Capgemini', 'Cognizant', 'TCS']
  },

  // ── CAMPUS OA PSEUDO-CODE ──
  {
    id: 'tmcq-pc-1',
    topic: 'Accenture / Capgemini Bitwise Half-Adder Loop',
    topicCategory: 'PSEUDO_CODE',
    topicId: 'mcq-pseudo-code',
    question: 'What is the value returned by the following pseudo-code for inputs A = 14, B = 5?',
    codeSnippet: `function solve(A, B):
    while B > 0:
        carry = (A & B) << 1
        A = A ^ B
        B = carry
    return A`,
    options: ['19', '9', '70', '28'],
    correctOptionIndex: 0,
    explanation: 'This is the standard bitwise adder algorithm (Half Adder loop). A ^ B computes sum bits without carry, and (A & B) << 1 computes the carry bits. The loop terminates when carry B reaches 0, returning 14 + 5 = 19.',
    companyTags: ['Accenture', 'Capgemini', 'Mindtree']
  },
  {
    id: 'tmcq-pc-2',
    topic: 'Campus OA Bitwise Masking Dry Run',
    topicCategory: 'PSEUDO_CODE',
    topicId: 'mcq-pseudo-code',
    question: 'What will be the output of this pseudo-code for P = 27, Q = 18?',
    codeSnippet: `Integer P, Q, R
Set P = 27, Q = 18
R = (P ^ Q) & (P | Q)
Print R`,
    options: ['11', '25', '9', '27'],
    correctOptionIndex: 2,
    explanation: 'Binary representation: P = 27 = 11011_2, Q = 18 = 10010_2. P ^ Q = 01001_2 = 9. P | Q = 11011_2 = 27. 9 & 27: 01001 & 11011 = 01001_2 = 9.',
    companyTags: ['Accenture', 'Capgemini', 'Cognizant']
  },
  {
    id: 'tmcq-pc-3',
    topic: 'Recursive Call Count & Complexity Analysis',
    topicCategory: 'PSEUDO_CODE',
    topicId: 'mcq-pseudo-code',
    question: 'How many total times will the function `compute` be invoked (including the initial call) when calling `compute(4)`?',
    codeSnippet: `function compute(n):
    if n <= 1:
        return 1
    return compute(n - 1) + compute(n - 2)`,
    options: ['5', '9', '8', '15'],
    correctOptionIndex: 1,
    explanation: 'Total invocations follow the recurrence T(n) = 1 + T(n-1) + T(n-2): T(0)=1, T(1)=1, T(2)=1+1+1=3, T(3)=1+3+1=5, T(4)=1+5+3=9. Total calls = 9.',
    companyTags: ['TCS Prime', 'Cognizant', 'LTI Mindtree']
  }
];
