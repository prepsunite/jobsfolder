import type { CampusDsaStage, CampusDsaProblem } from '@/types/technical';

export const CAMPUS_DSA_ROADMAP_STAGES: CampusDsaStage[] = [
  {
    "id": "stage-1-two-pointers",
    "stageNumber": 1,
    "title": "Stage 1: Arrays & Two Pointers",
    "cluster": "Pointers & Arrays",
    "description": "Master opposing pointers, sorted pairs, container geometry, and in-place partitions.",
    "iconName": "Sliders",
    "corePattern": "Opposing / Converging Pointers",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-1",
        "leetcodeNumber": 1,
        "title": "Two Sum",
        "slug": "two-sum",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
        "difficulty": "EASY",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Hash Map Complement",
        "companyTags": [
          "Amazon",
          "TCS Prime",
          "Infosys SP",
          "Adobe",
          "Google"
        ],
        "keyIntuition": "Store each visited number in a Hash Map; check if (target - num) exists in O(1) time.",
        "order": 1
      },
      {
        "id": "lc-26",
        "leetcodeNumber": 26,
        "title": "Remove Duplicates from Sorted Array",
        "slug": "remove-duplicates-from-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        "difficulty": "EASY",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Fast & Slow In-Place Writer",
        "companyTags": [
          "TCS Digital",
          "Accenture Advanced",
          "Amazon",
          "Infosys"
        ],
        "keyIntuition": "Keep a slow writer pointer. When the fast reader finds a new unique value, increment writer and overwrite.",
        "order": 2
      },
      {
        "id": "lc-88",
        "leetcodeNumber": 88,
        "title": "Merge Sorted Array",
        "slug": "merge-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/merge-sorted-array/",
        "difficulty": "EASY",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Reverse Three Pointers",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Fill from the end (index m+n-1) backwards comparing largest elements of nums1 and nums2 to avoid overwriting unread elements.",
        "order": 3
      },
      {
        "id": "lc-283",
        "leetcodeNumber": 283,
        "title": "Move Zeroes",
        "slug": "move-zeroes",
        "leetcodeUrl": "https://leetcode.com/problems/move-zeroes/",
        "difficulty": "EASY",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "In-Place Non-Zero Partition",
        "companyTags": [
          "TCS Digital",
          "Cognizant GenC Next",
          "Amazon",
          "Wipro Turbo"
        ],
        "keyIntuition": "Keep a slow insert pointer for non-zeros. Swap nums[slow] and nums[fast] whenever nums[fast] is non-zero, then advance slow.",
        "order": 4
      },
      {
        "id": "lc-121",
        "leetcodeNumber": 121,
        "title": "Best Time to Buy and Sell Stock",
        "slug": "best-time-to-buy-and-sell-stock",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        "difficulty": "EASY",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Prefix Minimum Tracking",
        "companyTags": [
          "Amazon",
          "Goldman Sachs",
          "TCS Prime",
          "Cognizant"
        ],
        "keyIntuition": "Track the lowest price seen so far as you iterate, computing currentPrice - minPrice at each step.",
        "order": 5
      },
      {
        "id": "lc-167",
        "leetcodeNumber": 167,
        "title": "Two Sum II - Input Array Is Sorted",
        "slug": "two-sum-ii-input-array-is-sorted",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        "difficulty": "MEDIUM",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Opposing Pointers",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Infosys DSE"
        ],
        "keyIntuition": "Initialize left=0, right=n-1. If sum > target, decrement right; if sum < target, increment left.",
        "order": 6
      },
      {
        "id": "lc-15",
        "leetcodeNumber": 15,
        "title": "3Sum",
        "slug": "3sum",
        "leetcodeUrl": "https://leetcode.com/problems/3sum/",
        "difficulty": "MEDIUM",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Sorted Triplet Search",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Google",
          "Infosys SP"
        ],
        "keyIntuition": "Sort array, fix one element nums[i], and run two-pointer search on remaining subarray. Skip duplicates carefully.",
        "order": 7
      },
      {
        "id": "lc-11",
        "leetcodeNumber": 11,
        "title": "Container With Most Water",
        "slug": "container-with-most-water",
        "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/",
        "difficulty": "MEDIUM",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Greedy Two Pointers",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Digital",
          "Adobe"
        ],
        "keyIntuition": "Pointers at both ends. Compute area = (right - left) * min(h[left], h[right]). Greedily move the pointer with the smaller height.",
        "order": 8
      },
      {
        "id": "lc-75",
        "leetcodeNumber": 75,
        "title": "Sort Colors (Dutch National Flag)",
        "slug": "sort-colors",
        "leetcodeUrl": "https://leetcode.com/problems/sort-colors/",
        "difficulty": "MEDIUM",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "3-Way In-Place Partition",
        "companyTags": [
          "Microsoft",
          "Amazon",
          "TCS Prime",
          "Cognizant"
        ],
        "keyIntuition": "Maintain three pointers: low (0s), mid (current), high (2s). Swap 0s to front and 2s to back in a single pass.",
        "order": 9
      },
      {
        "id": "lc-189",
        "leetcodeNumber": 189,
        "title": "Rotate Array",
        "slug": "rotate-array",
        "leetcodeUrl": "https://leetcode.com/problems/rotate-array/",
        "difficulty": "MEDIUM",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Three-Step Reversal",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Wipro Turbo"
        ],
        "keyIntuition": "Reverse entire array, then reverse the first k elements, and finally reverse the remaining n-k elements.",
        "order": 10
      },
      {
        "id": "lc-238",
        "leetcodeNumber": 238,
        "title": "Product of Array Except Self",
        "slug": "product-of-array-except-self",
        "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/",
        "difficulty": "MEDIUM",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Prefix & Suffix Products",
        "companyTags": [
          "Amazon",
          "Apple",
          "TCS Prime",
          "Goldman Sachs"
        ],
        "keyIntuition": "Compute prefix products in first pass into result array, then accumulate suffix product from right in second pass.",
        "order": 11
      },
      {
        "id": "lc-31",
        "leetcodeNumber": 31,
        "title": "Next Permutation",
        "slug": "next-permutation",
        "leetcodeUrl": "https://leetcode.com/problems/next-permutation/",
        "difficulty": "MEDIUM",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Pivot Search & Suffix Reversal",
        "companyTags": [
          "Google",
          "Amazon",
          "Infosys SP",
          "Adobe"
        ],
        "keyIntuition": "Find rightmost peak drop pivot where a[i] < a[i+1]. Swap with next greater element to right, then reverse the suffix.",
        "order": 12
      },
      {
        "id": "lc-128",
        "leetcodeNumber": 128,
        "title": "Longest Consecutive Sequence",
        "slug": "longest-consecutive-sequence",
        "leetcodeUrl": "https://leetcode.com/problems/longest-consecutive-sequence/",
        "difficulty": "MEDIUM",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Hash Set Sequence Expansion",
        "companyTags": [
          "Google",
          "Amazon",
          "TCS Prime",
          "Microsoft"
        ],
        "keyIntuition": "Add all numbers to a Set. Only initiate counting when (num - 1) is not in set (identifying start of streak), running in O(N).",
        "order": 13
      },
      {
        "id": "lc-42",
        "leetcodeNumber": 42,
        "title": "Trapping Rain Water",
        "slug": "trapping-rain-water",
        "leetcodeUrl": "https://leetcode.com/problems/trapping-rain-water/",
        "difficulty": "HARD",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Dual Max Boundary Tracking",
        "companyTags": [
          "Amazon",
          "Google",
          "Goldman Sachs",
          "TCS Prime",
          "Microsoft"
        ],
        "keyIntuition": "Pointers left=0, right=n-1 with leftMax and rightMax. Water trapped at lower boundary is determined solely by that boundary's max.",
        "order": 14
      },
      {
        "id": "lc-41",
        "leetcodeNumber": 41,
        "title": "First Missing Positive",
        "slug": "first-missing-positive",
        "leetcodeUrl": "https://leetcode.com/problems/first-missing-positive/",
        "difficulty": "HARD",
        "stageId": "stage-1-two-pointers",
        "stageTitle": "Stage 1: Arrays & Two Pointers",
        "pattern": "Index As Hash Key Placement",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime",
          "Microsoft"
        ],
        "keyIntuition": "Place every number x in range [1, n] at index x-1 using in-place cyclic swaps. First mismatch index + 1 is the answer.",
        "order": 15
      }
    ]
  },
  {
    "id": "stage-2-sliding-window",
    "stageNumber": 2,
    "title": "Stage 2: Sliding Window & Subarrays",
    "cluster": "Pointers & Arrays",
    "description": "Master dynamic shrinking boundaries, fixed-length frequency tracking, and maximum subarrays.",
    "iconName": "Layers",
    "corePattern": "Dynamic & Fixed Size Window Expansion / Contraction",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-643",
        "leetcodeNumber": 643,
        "title": "Maximum Average Subarray I",
        "slug": "maximum-average-subarray-i",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-average-subarray-i/",
        "difficulty": "EASY",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Fixed Window Sum",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Cognizant"
        ],
        "keyIntuition": "Slide a window of size k. Add new element entering on right, subtract element leaving on left; track maximum running sum.",
        "order": 1
      },
      {
        "id": "lc-219",
        "leetcodeNumber": 219,
        "title": "Contains Duplicate II",
        "slug": "contains-duplicate-ii",
        "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate-ii/",
        "difficulty": "EASY",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Fixed Window Hash Set",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Cognizant",
          "Adobe"
        ],
        "keyIntuition": "Maintain a sliding hash set of window size k. If nums[i] is already in the set, a duplicate within distance k exists.",
        "order": 2
      },
      {
        "id": "lc-53",
        "leetcodeNumber": 53,
        "title": "Maximum Subarray",
        "slug": "maximum-subarray",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Kadane's Algorithm",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Infosys SP",
          "Adobe"
        ],
        "keyIntuition": "At each element, choose between extending current subarray (currSum + num) or starting fresh from num; track global maximum.",
        "order": 3
      },
      {
        "id": "lc-209",
        "leetcodeNumber": 209,
        "title": "Minimum Size Subarray Sum",
        "slug": "minimum-size-subarray-sum",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-size-subarray-sum/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Dynamic Window Shrink",
        "companyTags": [
          "Amazon",
          "TCS Prime",
          "Cognizant GenC Next"
        ],
        "keyIntuition": "Expand right pointer accumulating sum. While sum >= target, record min length (right - left + 1) and shrink from left.",
        "order": 4
      },
      {
        "id": "lc-3",
        "leetcodeNumber": 3,
        "title": "Longest Substring Without Repeating Characters",
        "slug": "longest-substring-without-repeating-characters",
        "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Dynamic Window with Index Map",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Map each character to its last seen index. If duplicate found inside window, jump left pointer to lastIndex + 1.",
        "order": 5
      },
      {
        "id": "lc-424",
        "leetcodeNumber": 424,
        "title": "Longest Repeating Character Replacement",
        "slug": "longest-repeating-character-replacement",
        "leetcodeUrl": "https://leetcode.com/problems/longest-repeating-character-replacement/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Frequency Window with Max Count",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Track maxFreq of any single char in window. If (windowSize - maxFreq) > k, window is invalid, so shrink left pointer.",
        "order": 6
      },
      {
        "id": "lc-567",
        "leetcodeNumber": 567,
        "title": "Permutation in String",
        "slug": "permutation-in-string",
        "leetcodeUrl": "https://leetcode.com/problems/permutation-in-string/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Fixed Size Frequency Match",
        "companyTags": [
          "Microsoft",
          "Amazon",
          "Infosys SP"
        ],
        "keyIntuition": "Window of fixed size s1.length(). Compare frequency count arrays of s1 and current window in s2, checking for 26-char parity.",
        "order": 7
      },
      {
        "id": "lc-438",
        "leetcodeNumber": 438,
        "title": "Find All Anagrams in a String",
        "slug": "find-all-anagrams-in-a-string",
        "leetcodeUrl": "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Fixed Window Character Histogram",
        "companyTags": [
          "Amazon",
          "Adobe",
          "TCS Digital"
        ],
        "keyIntuition": "Slide fixed window of size p.length() across s. Update char count diff; when diff is 0, add left index to results.",
        "order": 8
      },
      {
        "id": "lc-1004",
        "leetcodeNumber": 1004,
        "title": "Max Consecutive Ones III",
        "slug": "max-consecutive-ones-iii",
        "leetcodeUrl": "https://leetcode.com/problems/max-consecutive-ones-iii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "At-Most K Zeroes Window",
        "companyTags": [
          "Facebook",
          "Amazon",
          "TCS Prime",
          "Google"
        ],
        "keyIntuition": "Expand right pointer counting zeroes. When zeroes > k, advance left pointer until zeroes <= k; track max window width.",
        "order": 9
      },
      {
        "id": "lc-904",
        "leetcodeNumber": 904,
        "title": "Fruit Into Baskets",
        "slug": "fruit-into-baskets",
        "leetcodeUrl": "https://leetcode.com/problems/fruit-into-baskets/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Longest Subarray with at most 2 Distinct Elements",
        "companyTags": [
          "Google",
          "Amazon",
          "TCS Prime"
        ],
        "keyIntuition": "Frequency map of fruits. When map size exceeds 2, decrement count of fruits[left] and remove when 0 until size <= 2.",
        "order": 10
      },
      {
        "id": "lc-713",
        "leetcodeNumber": 713,
        "title": "Subarray Product Less Than K",
        "slug": "subarray-product-less-than-k",
        "leetcodeUrl": "https://leetcode.com/problems/subarray-product-less-than-k/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Dynamic Sliding Window Combinatorics",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Infosys DSE"
        ],
        "keyIntuition": "Multiply elements entering window. While prod >= k, divide by nums[left++]. Count valid subarrays as (right - left + 1).",
        "order": 11
      },
      {
        "id": "lc-1456",
        "leetcodeNumber": 1456,
        "title": "Maximum Number of Vowels in a Substring of Given Length",
        "slug": "maximum-number-of-vowels-in-a-substring-of-given-length",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Fixed Window Counter",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Accenture Advanced"
        ],
        "keyIntuition": "Maintain fixed window of size k counting vowels. Update count when entering/leaving window and track maximum.",
        "order": 12
      },
      {
        "id": "lc-187",
        "leetcodeNumber": 187,
        "title": "Repeated DNA Sequences",
        "slug": "repeated-dna-sequences",
        "leetcodeUrl": "https://leetcode.com/problems/repeated-dna-sequences/",
        "difficulty": "MEDIUM",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Rolling Hash / String Window Set",
        "companyTags": [
          "Amazon",
          "Google",
          "LinkedIn"
        ],
        "keyIntuition": "Slide 10-letter window across string. Use hash set of seen substrings; if already seen, add to duplicates output set.",
        "order": 13
      },
      {
        "id": "lc-76",
        "leetcodeNumber": 76,
        "title": "Minimum Window Substring",
        "slug": "minimum-window-substring",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-window-substring/",
        "difficulty": "HARD",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Target Frequency Window Match",
        "companyTags": [
          "Facebook",
          "Amazon",
          "Google",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Track required character counts with target map. Expand right until all chars satisfied, then shrink left to find minimal valid length.",
        "order": 14
      },
      {
        "id": "lc-992",
        "leetcodeNumber": 992,
        "title": "Subarrays with K Different Integers",
        "slug": "subarrays-with-k-different-integers",
        "leetcodeUrl": "https://leetcode.com/problems/subarrays-with-k-different-integers/",
        "difficulty": "HARD",
        "stageId": "stage-2-sliding-window",
        "stageTitle": "Stage 2: Sliding Window & Subarrays",
        "pattern": "Exact K = AtMost(K) - AtMost(K-1)",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Compute helper atMost(K) counting subarrays with <= K distinct elements. Exact K is precisely atMost(K) - atMost(K-1).",
        "order": 15
      }
    ]
  },
  {
    "id": "stage-3-linked-lists",
    "stageNumber": 3,
    "title": "Stage 3: Fast & Slow Pointers & Linked Lists",
    "cluster": "Linear Structures",
    "description": "Master pointer reversal, cycle detection, list midpoint splitting, and LRU Cache architecture.",
    "iconName": "GitMerge",
    "corePattern": "Pointer Redirection & Cycle Geometry",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-206",
        "leetcodeNumber": 206,
        "title": "Reverse Linked List",
        "slug": "reverse-linked-list",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list/",
        "difficulty": "EASY",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Three-Pointer Iterative Reversal",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Cognizant",
          "Infosys"
        ],
        "keyIntuition": "Use prev, curr, next pointers. In each step: next = curr.next, curr.next = prev, prev = curr, curr = next.",
        "order": 1
      },
      {
        "id": "lc-83",
        "leetcodeNumber": 83,
        "title": "Remove Duplicates from Sorted List",
        "slug": "remove-duplicates-from-sorted-list",
        "leetcodeUrl": "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
        "difficulty": "EASY",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Adjacent Pointer Deletion",
        "companyTags": [
          "TCS Digital",
          "Cognizant",
          "Wipro"
        ],
        "keyIntuition": "If curr.val == curr.next.val, skip duplicate by pointing curr.next = curr.next.next; otherwise advance curr.",
        "order": 2
      },
      {
        "id": "lc-141",
        "leetcodeNumber": 141,
        "title": "Linked List Cycle",
        "slug": "linked-list-cycle",
        "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle/",
        "difficulty": "EASY",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Floyd's Tortoise & Hare",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Cognizant GenC Next"
        ],
        "keyIntuition": "Advance slow by 1 step, fast by 2 steps. If fast catches up to slow, cycle exists; if fast reaches null, no cycle.",
        "order": 3
      },
      {
        "id": "lc-876",
        "leetcodeNumber": 876,
        "title": "Middle of the Linked List",
        "slug": "middle-of-the-linked-list",
        "leetcodeUrl": "https://leetcode.com/problems/middle-of-the-linked-list/",
        "difficulty": "EASY",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Fast/Slow 2x Step Traversal",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Infosys",
          "Adobe"
        ],
        "keyIntuition": "Slow moves 1 step, fast moves 2 steps. When fast reaches end (null or fast.next is null), slow is exactly at middle.",
        "order": 4
      },
      {
        "id": "lc-21",
        "leetcodeNumber": 21,
        "title": "Merge Two Sorted Lists",
        "slug": "merge-two-sorted-lists",
        "leetcodeUrl": "https://leetcode.com/problems/merge-two-sorted-lists/",
        "difficulty": "EASY",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Dummy Head Two-Pointer Merge",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Google"
        ],
        "keyIntuition": "Create dummy head. Compare heads of both lists, attach smaller node to tail, advance that list's pointer. Attach remaining.",
        "order": 5
      },
      {
        "id": "lc-160",
        "leetcodeNumber": 160,
        "title": "Intersection of Two Linked Lists",
        "slug": "intersection-of-two-linked-lists",
        "leetcodeUrl": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
        "difficulty": "EASY",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Two Pointer Traversal Switching",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Infosys"
        ],
        "keyIntuition": "Pointer A travels listA then listB; pointer B travels listB then listA. They equalize traversal lengths and meet at intersection.",
        "order": 6
      },
      {
        "id": "lc-234",
        "leetcodeNumber": 234,
        "title": "Palindrome Linked List",
        "slug": "palindrome-linked-list",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-linked-list/",
        "difficulty": "EASY",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Fast-Slow Middle + Reverse Second Half",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Cognizant"
        ],
        "keyIntuition": "Find middle using fast/slow pointers. Reverse second half in-place. Compare first half and reversed second half node-by-node.",
        "order": 7
      },
      {
        "id": "lc-142",
        "leetcodeNumber": 142,
        "title": "Linked List Cycle II (Find Entry Point)",
        "slug": "linked-list-cycle-ii",
        "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Cycle Intersection & Phase 2 Pointer",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Detect meeting point with fast/slow pointers. Reset one pointer to head; advance both by 1 step. They meet exactly at cycle entrance.",
        "order": 8
      },
      {
        "id": "lc-19",
        "leetcodeNumber": 19,
        "title": "Remove Nth Node From End of List",
        "slug": "remove-nth-node-from-end-of-list",
        "leetcodeUrl": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        "difficulty": "MEDIUM",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Fixed-Gap Two Pointers",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Adobe"
        ],
        "keyIntuition": "Advance fast pointer n steps ahead. Then move both fast and slow together until fast reaches end; slow.next is the target.",
        "order": 9
      },
      {
        "id": "lc-143",
        "leetcodeNumber": 143,
        "title": "Reorder List",
        "slug": "reorder-list",
        "leetcodeUrl": "https://leetcode.com/problems/reorder-list/",
        "difficulty": "MEDIUM",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Find Middle + Reverse Second Half + Interweave",
        "companyTags": [
          "Amazon",
          "Facebook",
          "TCS Prime",
          "Microsoft"
        ],
        "keyIntuition": "Find middle with fast/slow, reverse second half, then interweave nodes from first and second halves alternatively.",
        "order": 10
      },
      {
        "id": "lc-2",
        "leetcodeNumber": 2,
        "title": "Add Two Numbers",
        "slug": "add-two-numbers",
        "leetcodeUrl": "https://leetcode.com/problems/add-two-numbers/",
        "difficulty": "MEDIUM",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Simulated Elementary Addition with Carry",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Iterate both lists simultaneously. Sum = val1 + val2 + carry. New node = sum % 10, carry = sum / 10. Handle final carry.",
        "order": 11
      },
      {
        "id": "lc-148",
        "leetcodeNumber": 148,
        "title": "Sort List (Merge Sort on Linked List)",
        "slug": "sort-list",
        "leetcodeUrl": "https://leetcode.com/problems/sort-list/",
        "difficulty": "MEDIUM",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Divide & Conquer Merge Sort",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Facebook",
          "Infosys SP"
        ],
        "keyIntuition": "Split list into two halves via fast/slow middle pointer. Recursively sort each half and merge sorted halves in O(N log N).",
        "order": 12
      },
      {
        "id": "lc-138",
        "leetcodeNumber": 138,
        "title": "Copy List with Random Pointer",
        "slug": "copy-list-with-random-pointer",
        "leetcodeUrl": "https://leetcode.com/problems/copy-list-with-random-pointer/",
        "difficulty": "MEDIUM",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Hash Map / Interweaved Node Cloning",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Bloomberg"
        ],
        "keyIntuition": "Clone each node and interweave directly after original (A -> A' -> B -> B'). Copy random pointers via curr.next.random = curr.random.next, then unweave.",
        "order": 13
      },
      {
        "id": "lc-146",
        "leetcodeNumber": 146,
        "title": "LRU Cache",
        "slug": "lru-cache",
        "leetcodeUrl": "https://leetcode.com/problems/lru-cache/",
        "difficulty": "MEDIUM",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Doubly Linked List + Hash Map",
        "companyTags": [
          "Amazon",
          "Google",
          "Microsoft",
          "TCS Prime",
          "Adobe"
        ],
        "keyIntuition": "Combine Hash Map (key -> node for O(1) lookup) with Doubly Linked List (most recent at head, eviction from tail in O(1)).",
        "order": 14
      },
      {
        "id": "lc-23",
        "leetcodeNumber": 23,
        "title": "Merge k Sorted Lists",
        "slug": "merge-k-sorted-lists",
        "leetcodeUrl": "https://leetcode.com/problems/merge-k-sorted-lists/",
        "difficulty": "HARD",
        "stageId": "stage-3-linked-lists",
        "stageTitle": "Stage 3: Fast & Slow Pointers & Linked Lists",
        "pattern": "Min-Heap / Divide & Conquer Merge",
        "companyTags": [
          "Amazon",
          "Google",
          "Facebook",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Insert head of all k lists into Min-Heap. Poll smallest node, append to result, and insert its next node into heap.",
        "order": 15
      }
    ]
  },
  {
    "id": "stage-4-stacks-queues",
    "stageNumber": 4,
    "title": "Stage 4: Stacks, Queues & Monotonic Patterns",
    "cluster": "Linear Structures",
    "description": "Master parenthesis matching, circular lookups, monotonic spans, and histogram geometry.",
    "iconName": "Terminal",
    "corePattern": "LIFO Inversion & Monotonic Boundary Lookup",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-20",
        "leetcodeNumber": 20,
        "title": "Valid Parentheses",
        "slug": "valid-parentheses",
        "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses/",
        "difficulty": "EASY",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "LIFO Matching Stack",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Infosys",
          "Google"
        ],
        "keyIntuition": "Push opening brackets onto stack. For closing brackets, check if stack is non-empty and top matches corresponding open bracket.",
        "order": 1
      },
      {
        "id": "lc-232",
        "leetcodeNumber": 232,
        "title": "Implement Queue using Stacks",
        "slug": "implement-queue-using-stacks",
        "leetcodeUrl": "https://leetcode.com/problems/implement-queue-using-stacks/",
        "difficulty": "EASY",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Two Stacks Amortized LIFO to FIFO",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Cognizant"
        ],
        "keyIntuition": "Use inStack for push. For pop/peek, if outStack is empty, transfer all elements from inStack to outStack (amortized O(1)).",
        "order": 2
      },
      {
        "id": "lc-225",
        "leetcodeNumber": 225,
        "title": "Implement Stack using Queues",
        "slug": "implement-stack-using-queues",
        "leetcodeUrl": "https://leetcode.com/problems/implement-stack-using-queues/",
        "difficulty": "EASY",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Single Queue Rotation",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Wipro Turbo"
        ],
        "keyIntuition": "Enqueue new element into single queue, then rotate queue by dequeueing and re-enqueueing the previous n-1 elements to invert order.",
        "order": 3
      },
      {
        "id": "lc-496",
        "leetcodeNumber": 496,
        "title": "Next Greater Element I",
        "slug": "next-greater-element-i",
        "leetcodeUrl": "https://leetcode.com/problems/next-greater-element-i/",
        "difficulty": "EASY",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Monotonic Decreasing Stack + Map",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Cognizant"
        ],
        "keyIntuition": "Traverse nums2 with monotonic decreasing stack. When larger number found, pop elements and record (popped -> num) in map.",
        "order": 4
      },
      {
        "id": "lc-155",
        "leetcodeNumber": 155,
        "title": "Min Stack",
        "slug": "min-stack",
        "leetcodeUrl": "https://leetcode.com/problems/min-stack/",
        "difficulty": "MEDIUM",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Auxiliary Minimum Tracking Stack",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Adobe"
        ],
        "keyIntuition": "Maintain two stacks or store pairs (val, currentMin). Every push updates current min; pop discards corresponding min.",
        "order": 5
      },
      {
        "id": "lc-503",
        "leetcodeNumber": 503,
        "title": "Next Greater Element II (Circular Array)",
        "slug": "next-greater-element-ii",
        "leetcodeUrl": "https://leetcode.com/problems/next-greater-element-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Circular Array Virtual Double Scan",
        "companyTags": [
          "Amazon",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Simulate scanning array twice using index % n with a monotonic decreasing stack to resolve circular wrap-around elements.",
        "order": 6
      },
      {
        "id": "lc-739",
        "leetcodeNumber": 739,
        "title": "Daily Temperatures",
        "slug": "daily-temperatures",
        "leetcodeUrl": "https://leetcode.com/problems/daily-temperatures/",
        "difficulty": "MEDIUM",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Monotonic Stack Index Distance",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Monotonic decreasing stack storing indices. When today's temp > temp at stack top, pop index and compute (i - poppedIndex).",
        "order": 7
      },
      {
        "id": "lc-735",
        "leetcodeNumber": 735,
        "title": "Asteroid Collision",
        "slug": "asteroid-collision",
        "leetcodeUrl": "https://leetcode.com/problems/asteroid-collision/",
        "difficulty": "MEDIUM",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Stack Collision Simulation",
        "companyTags": [
          "Amazon",
          "TCS Prime",
          "Adobe"
        ],
        "keyIntuition": "Push right-moving asteroids (+). For left-moving (-), compare size with top. Pop destroyed top asteroids until collision resolves.",
        "order": 8
      },
      {
        "id": "lc-901",
        "leetcodeNumber": 901,
        "title": "Online Stock Span",
        "slug": "online-stock-span",
        "leetcodeUrl": "https://leetcode.com/problems/online-stock-span/",
        "difficulty": "MEDIUM",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Monotonic Stack Span Aggregation",
        "companyTags": [
          "Amazon",
          "TCS Prime",
          "Cognizant GenC Next"
        ],
        "keyIntuition": "Stack of pairs (price, span). Pop all elements with price <= today's price and aggregate their spans before pushing (today, totalSpan).",
        "order": 9
      },
      {
        "id": "lc-150",
        "leetcodeNumber": 150,
        "title": "Evaluate Reverse Polish Notation",
        "slug": "evaluate-reverse-polish-notation",
        "leetcodeUrl": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
        "difficulty": "MEDIUM",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Postfix Stack Evaluation",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Push numbers onto stack. When operator encountered, pop right operand then left operand, apply operator, and push result back.",
        "order": 10
      },
      {
        "id": "lc-402",
        "leetcodeNumber": 402,
        "title": "Remove K Digits",
        "slug": "remove-k-digits",
        "leetcodeUrl": "https://leetcode.com/problems/remove-k-digits/",
        "difficulty": "MEDIUM",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Greedy Monotonic Increasing Digits",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Monotonic increasing stack of digits. While k > 0 and current digit < stack top, pop top and decrement k. Strip leading zeros.",
        "order": 11
      },
      {
        "id": "lc-227",
        "leetcodeNumber": 227,
        "title": "Basic Calculator II",
        "slug": "basic-calculator-ii",
        "leetcodeUrl": "https://leetcode.com/problems/basic-calculator-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Operator Precedence Stack",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Facebook"
        ],
        "keyIntuition": "Accumulate numbers. Multiply/divide immediately with top of stack; push positive or negative numbers for +/- and sum stack at end.",
        "order": 12
      },
      {
        "id": "lc-239",
        "leetcodeNumber": 239,
        "title": "Sliding Window Maximum",
        "slug": "sliding-window-maximum",
        "leetcodeUrl": "https://leetcode.com/problems/sliding-window-maximum/",
        "difficulty": "HARD",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Monotonic Decreasing Deque",
        "companyTags": [
          "Amazon",
          "Google",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Maintain deque of indices with decreasing values. Remove indices outside window from front, and smaller elements from back.",
        "order": 13
      },
      {
        "id": "lc-84",
        "leetcodeNumber": 84,
        "title": "Largest Rectangle in Histogram",
        "slug": "largest-rectangle-in-histogram",
        "leetcodeUrl": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        "difficulty": "HARD",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "Monotonic Increasing Stack with Width Expansion",
        "companyTags": [
          "Amazon",
          "Google",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Monotonic increasing stack of bar indices. When shorter bar found, pop height; width extends from current index to new stack top.",
        "order": 14
      },
      {
        "id": "lc-85",
        "leetcodeNumber": 85,
        "title": "Maximal Rectangle",
        "slug": "maximal-rectangle",
        "leetcodeUrl": "https://leetcode.com/problems/maximal-rectangle/",
        "difficulty": "HARD",
        "stageId": "stage-4-stacks-queues",
        "stageTitle": "Stage 4: Stacks, Queues & Monotonic Patterns",
        "pattern": "2D Matrix Reduced to Running Histograms",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Maintain running heights for consecutive '1's per column for each row. Apply Largest Rectangle in Histogram (LC #84) per row.",
        "order": 15
      }
    ]
  },
  {
    "id": "stage-5-binary-search",
    "stageNumber": 5,
    "title": "Stage 5: Binary Search & Intervals",
    "cluster": "Search & Intervals",
    "description": "Master logarithmic range elimination, rotated arrays, answer-space predicates, and interval scheduling.",
    "iconName": "Search",
    "corePattern": "Half-Interval Elimination & Range Boundary Overlap",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-704",
        "leetcodeNumber": 704,
        "title": "Binary Search",
        "slug": "binary-search",
        "leetcodeUrl": "https://leetcode.com/problems/binary-search/",
        "difficulty": "EASY",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Standard Midpoint Half-Partition",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Infosys"
        ],
        "keyIntuition": "low=0, high=n-1. Compute mid = low + (high-low)/2. If target == nums[mid] return mid; eliminate left or right half accordingly.",
        "order": 1
      },
      {
        "id": "lc-35",
        "leetcodeNumber": 35,
        "title": "Search Insert Position",
        "slug": "search-insert-position",
        "leetcodeUrl": "https://leetcode.com/problems/search-insert-position/",
        "difficulty": "EASY",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Lower Bound Binary Search",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Cognizant",
          "Adobe"
        ],
        "keyIntuition": "Binary search for target. If not found, low pointer terminates at the exact first index where target should be inserted.",
        "order": 2
      },
      {
        "id": "lc-34",
        "leetcodeNumber": 34,
        "title": "Find First and Last Position of Element in Sorted Array",
        "slug": "find-first-and-last-position-of-element-in-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Dual Binary Search (First & Last Occurrence)",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Google"
        ],
        "keyIntuition": "Run binary search twice: once biasing high=mid-1 on match (first occurrence), and once biasing low=mid+1 on match (last occurrence).",
        "order": 3
      },
      {
        "id": "lc-33",
        "leetcodeNumber": 33,
        "title": "Search in Rotated Sorted Array",
        "slug": "search-in-rotated-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Rotated Half-Sorted Determination",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Adobe"
        ],
        "keyIntuition": "At least one half is always normally sorted. Check if target lies within the sorted half; if yes narrow to it, else search opposite half.",
        "order": 4
      },
      {
        "id": "lc-153",
        "leetcodeNumber": 153,
        "title": "Find Minimum in Rotated Sorted Array",
        "slug": "find-minimum-in-rotated-sorted-array",
        "leetcodeUrl": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Inflection Point Binary Search",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Compare nums[mid] with nums[high]. If nums[mid] > nums[high], minimum lies strictly to right (low = mid + 1); else high = mid.",
        "order": 5
      },
      {
        "id": "lc-74",
        "leetcodeNumber": 74,
        "title": "Search a 2D Matrix",
        "slug": "search-a-2d-matrix",
        "leetcodeUrl": "https://leetcode.com/problems/search-a-2d-matrix/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Virtual 1D Flattening Binary Search",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Cognizant"
        ],
        "keyIntuition": "Treat m x n matrix as 1D array of size m*n. Map mid to matrix coordinates: row = mid / n, col = mid % n in single binary search pass.",
        "order": 6
      },
      {
        "id": "lc-240",
        "leetcodeNumber": 240,
        "title": "Search a 2D Matrix II",
        "slug": "search-a-2d-matrix-ii",
        "leetcodeUrl": "https://leetcode.com/problems/search-a-2d-matrix-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Top-Right Corner Step-Down Search",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Google"
        ],
        "keyIntuition": "Start from top-right corner (row=0, col=n-1). If target < current, move left (col--); if target > current, move down (row++). O(m+n).",
        "order": 7
      },
      {
        "id": "lc-852",
        "leetcodeNumber": 852,
        "title": "Peak Index in a Mountain Array",
        "slug": "peak-index-in-a-mountain-array",
        "leetcodeUrl": "https://leetcode.com/problems/peak-index-in-a-mountain-array/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Slope Direction Binary Search",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Digital",
          "Bloomberg"
        ],
        "keyIntuition": "Binary search slope: if nums[mid] < nums[mid+1], peak lies to the right (low = mid + 1); otherwise peak is at or left of mid (high = mid).",
        "order": 8
      },
      {
        "id": "lc-875",
        "leetcodeNumber": 875,
        "title": "Koko Eating Bananas",
        "slug": "koko-eating-bananas",
        "leetcodeUrl": "https://leetcode.com/problems/koko-eating-bananas/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Answer-Space Binary Search (Monotonic Predicate)",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime",
          "Airbnb"
        ],
        "keyIntuition": "Binary search speed range [1, max(piles)]. For candidate speed k, calculate total hours. If hours <= h, feasible (high=k); else low=k+1.",
        "order": 9
      },
      {
        "id": "lc-1011",
        "leetcodeNumber": 1011,
        "title": "Capacity To Ship Packages Within D Days",
        "slug": "capacity-to-ship-packages-within-d-days",
        "leetcodeUrl": "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Binary Search on Monotonic Capacity Range",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Search capacity range [max(weights), sum(weights)]. Greedily verify required days for capacity cap; shrink range monotonically.",
        "order": 10
      },
      {
        "id": "lc-56",
        "leetcodeNumber": 56,
        "title": "Merge Intervals",
        "slug": "merge-intervals",
        "leetcodeUrl": "https://leetcode.com/problems/merge-intervals/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Sorted Interval Overlap Merging",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Sort intervals by start time. If current interval overlaps with previous (curr.start <= prev.end), merge by updating prev.end = max(prev.end, curr.end).",
        "order": 11
      },
      {
        "id": "lc-57",
        "leetcodeNumber": 57,
        "title": "Insert Interval",
        "slug": "insert-interval",
        "leetcodeUrl": "https://leetcode.com/problems/insert-interval/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Three-Phase Interval Merge",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime",
          "LinkedIn"
        ],
        "keyIntuition": "Add all intervals ending before newInterval starts. Merge overlapping intervals into newInterval. Append remaining non-overlapping intervals.",
        "order": 12
      },
      {
        "id": "lc-435",
        "leetcodeNumber": 435,
        "title": "Non-overlapping Intervals",
        "slug": "non-overlapping-intervals",
        "leetcodeUrl": "https://leetcode.com/problems/non-overlapping-intervals/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Greedy Interval Scheduling by End Time",
        "companyTags": [
          "Amazon",
          "Facebook",
          "TCS Prime"
        ],
        "keyIntuition": "Sort intervals by end time. Greedily select interval ending earliest; count removed intervals whenever current start < previous end.",
        "order": 13
      },
      {
        "id": "lc-452",
        "leetcodeNumber": 452,
        "title": "Minimum Number of Arrows to Burst Balloons",
        "slug": "minimum-number-of-arrows-to-burst-balloons",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
        "difficulty": "MEDIUM",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Greedy Overlap Intersection Points",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Sort balloons by end coordinate. Shoot arrow at earliest end coordinate; all overlapping balloons sharing this point burst together.",
        "order": 14
      },
      {
        "id": "lc-4",
        "leetcodeNumber": 4,
        "title": "Median of Two Sorted Arrays",
        "slug": "median-of-two-sorted-arrays",
        "leetcodeUrl": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        "difficulty": "HARD",
        "stageId": "stage-5-binary-search",
        "stageTitle": "Stage 5: Binary Search & Intervals",
        "pattern": "Binary Search on Partition Cut Points",
        "companyTags": [
          "Amazon",
          "Google",
          "Microsoft",
          "Goldman Sachs",
          "TCS Prime"
        ],
        "keyIntuition": "Binary search cut in smaller array such that left elements equal right elements and max(left) <= min(right) across both partitions in O(log(min(M,N))).",
        "order": 15
      }
    ]
  },
  {
    "id": "stage-6-trees-bst",
    "stageNumber": 6,
    "title": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
    "cluster": "Hierarchical Structures",
    "description": "Master post-order synthesis, level-order batching, BST invariants, and path maximums.",
    "iconName": "Code2",
    "corePattern": "Subtree Divisibility & Level Layering",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-104",
        "leetcodeNumber": 104,
        "title": "Maximum Depth of Binary Tree",
        "slug": "maximum-depth-of-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        "difficulty": "EASY",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Post-Order Tree Height DFS",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Google"
        ],
        "keyIntuition": "Recursively compute 1 + max(maxDepth(root.left), maxDepth(root.right)) with base case root == null returning 0.",
        "order": 1
      },
      {
        "id": "lc-226",
        "leetcodeNumber": 226,
        "title": "Invert Binary Tree",
        "slug": "invert-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/invert-binary-tree/",
        "difficulty": "EASY",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Recursive Child Swapping",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Digital",
          "Microsoft"
        ],
        "keyIntuition": "Swap root.left and root.right pointers at every node recursively via post-order or pre-order DFS.",
        "order": 2
      },
      {
        "id": "lc-101",
        "leetcodeNumber": 101,
        "title": "Symmetric Tree",
        "slug": "symmetric-tree",
        "leetcodeUrl": "https://leetcode.com/problems/symmetric-tree/",
        "difficulty": "EASY",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Mirror Node Comparison DFS",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Cognizant"
        ],
        "keyIntuition": "Helper isMirror(t1, t2) checks t1.val == t2.val, then recursively compares outer children (t1.left, t2.right) and inner (t1.right, t2.left).",
        "order": 3
      },
      {
        "id": "lc-543",
        "leetcodeNumber": 543,
        "title": "Diameter of Binary Tree",
        "slug": "diameter-of-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/diameter-of-binary-tree/",
        "difficulty": "EASY",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Global Max Path Sum via Subtree Heights",
        "companyTags": [
          "Amazon",
          "Facebook",
          "TCS Prime",
          "Microsoft"
        ],
        "keyIntuition": "At each node, max path through it is leftHeight + rightHeight. Update global diameter while returning 1 + max(left, right) to parent.",
        "order": 4
      },
      {
        "id": "lc-112",
        "leetcodeNumber": 112,
        "title": "Path Sum",
        "slug": "path-sum",
        "leetcodeUrl": "https://leetcode.com/problems/path-sum/",
        "difficulty": "EASY",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Root-to-Leaf Target Subtraction",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital"
        ],
        "keyIntuition": "Subtract root.val from targetSum. At leaf node, verify if remaining targetSum == 0; recursively branch on left and right.",
        "order": 5
      },
      {
        "id": "lc-102",
        "leetcodeNumber": 102,
        "title": "Binary Tree Level Order Traversal",
        "slug": "binary-tree-level-order-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        "difficulty": "MEDIUM",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Queue-Based BFS with Level Batching",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Google",
          "Infosys SP"
        ],
        "keyIntuition": "Queue stores nodes. Process level-by-level using queue.size() snapshot for loop; push children into queue for next tier.",
        "order": 6
      },
      {
        "id": "lc-103",
        "leetcodeNumber": 103,
        "title": "Binary Tree Zigzag Level Order Traversal",
        "slug": "binary-tree-zigzag-level-order-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
        "difficulty": "MEDIUM",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Alternating Direction Level BFS",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Cognizant GenC Next"
        ],
        "keyIntuition": "Standard level-order BFS with a boolean leftToRight flag. Insert values into current level deque from front or back based on flag.",
        "order": 7
      },
      {
        "id": "lc-199",
        "leetcodeNumber": 199,
        "title": "Binary Tree Right Side View",
        "slug": "binary-tree-right-side-view",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-right-side-view/",
        "difficulty": "MEDIUM",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "BFS Last Node / DFS Preorder Right-First",
        "companyTags": [
          "Amazon",
          "Facebook",
          "TCS Prime"
        ],
        "keyIntuition": "In level-order BFS, record the last element of each level queue; alternatively DFS visiting right subtree before left with level tracking.",
        "order": 8
      },
      {
        "id": "lc-236",
        "leetcodeNumber": 236,
        "title": "Lowest Common Ancestor of a Binary Tree",
        "slug": "lowest-common-ancestor-of-a-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
        "difficulty": "MEDIUM",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Post-Order Tree Search LCA",
        "companyTags": [
          "Amazon",
          "Facebook",
          "Microsoft",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Search left and right subtrees for p and q. If both subtrees return non-null, root is LCA; if only one returns non-null, pass it up.",
        "order": 9
      },
      {
        "id": "lc-98",
        "leetcodeNumber": 98,
        "title": "Validate Binary Search Tree",
        "slug": "validate-binary-search-tree",
        "leetcodeUrl": "https://leetcode.com/problems/validate-binary-search-tree/",
        "difficulty": "MEDIUM",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Valid Range Bounds Tracking DFS",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Google"
        ],
        "keyIntuition": "Pass allowed range (minVal, maxVal) downwards. Node must satisfy min < node.val < max; left child bounded by (min, val), right by (val, max).",
        "order": 10
      },
      {
        "id": "lc-230",
        "leetcodeNumber": 230,
        "title": "Kth Smallest Element in a BST",
        "slug": "kth-smallest-element-in-a-bst",
        "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        "difficulty": "MEDIUM",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "In-Order Traversal Count",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "In-order traversal of BST yields strictly sorted values. Traverse in-order and decrement k at each step; return val when k == 0.",
        "order": 11
      },
      {
        "id": "lc-105",
        "leetcodeNumber": 105,
        "title": "Construct Binary Tree from Preorder and Inorder Traversal",
        "slug": "construct-binary-tree-from-preorder-and-inorder-traversal",
        "leetcodeUrl": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
        "difficulty": "MEDIUM",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Root Identification & Inorder Partitioning",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Bloomberg"
        ],
        "keyIntuition": "First element of preorder is root. Locate root in inorder map to partition into left and right subtree lengths; recurse on partitions.",
        "order": 12
      },
      {
        "id": "lc-450",
        "leetcodeNumber": 450,
        "title": "Delete Node in a BST",
        "slug": "delete-node-in-a-bst",
        "leetcodeUrl": "https://leetcode.com/problems/delete-node-in-a-bst/",
        "difficulty": "MEDIUM",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Inorder Successor Replacement",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Find target node. If 0 or 1 child, return non-null child. If 2 children, find inorder successor (min of right subtree), copy value, delete successor.",
        "order": 13
      },
      {
        "id": "lc-124",
        "leetcodeNumber": 124,
        "title": "Binary Tree Maximum Path Sum",
        "slug": "binary-tree-maximum-path-sum",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        "difficulty": "HARD",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Subtree Max Contribution DFS",
        "companyTags": [
          "Facebook",
          "Amazon",
          "Google",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Compute max branch gain max(0, dfs(child)). At each node, arch path is node.val + leftGain + rightGain; update global max.",
        "order": 14
      },
      {
        "id": "lc-297",
        "leetcodeNumber": 297,
        "title": "Serialize and Deserialize Binary Tree",
        "slug": "serialize-and-deserialize-binary-tree",
        "leetcodeUrl": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        "difficulty": "HARD",
        "stageId": "stage-6-trees-bst",
        "stageTitle": "Stage 6: Binary Trees & BSTs (BFS & DFS)",
        "pattern": "Preorder Traversal with Sentinel Null Tokens",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Serialize with preorder traversal using delimiter and sentinel 'null' tokens. Deserialize recursively by consuming token queue in preorder.",
        "order": 15
      }
    ]
  },
  {
    "id": "stage-7-heaps",
    "stageNumber": 7,
    "title": "Stage 7: Heaps & Priority Queues (Top 'K')",
    "cluster": "Hierarchical Structures",
    "description": "Master dynamic running medians, Top K frequent aggregation, event meeting schedules, and dual-heap coordination.",
    "iconName": "Zap",
    "corePattern": "Extremum Tracking & K-Way Merge",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-703",
        "leetcodeNumber": 703,
        "title": "Kth Largest Element in a Stream",
        "slug": "kth-largest-element-in-a-stream",
        "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
        "difficulty": "EASY",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Fixed-Size Min Heap",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Adobe"
        ],
        "keyIntuition": "Maintain Min-Heap of size k. When adding element, push and pop if size > k. Top of Min-Heap always holds the kth largest.",
        "order": 1
      },
      {
        "id": "lc-1046",
        "leetcodeNumber": 1046,
        "title": "Last Stone Weight",
        "slug": "last-stone-weight",
        "leetcodeUrl": "https://leetcode.com/problems/last-stone-weight/",
        "difficulty": "EASY",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Max-Heap Simulation",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Cognizant"
        ],
        "keyIntuition": "Insert all stones into a Max-Heap. Pop the two heaviest stones; if unequal, push the difference back until at most 1 stone remains.",
        "order": 2
      },
      {
        "id": "lc-506",
        "leetcodeNumber": 506,
        "title": "Relative Ranks",
        "slug": "relative-ranks",
        "leetcodeUrl": "https://leetcode.com/problems/relative-ranks/",
        "difficulty": "EASY",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Priority Queue Score Mapping",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Google"
        ],
        "keyIntuition": "Insert pairs of (score, originalIndex) into Max-Heap. Pop elements assigning Gold, Silver, Bronze medals and rank strings.",
        "order": 3
      },
      {
        "id": "lc-215",
        "leetcodeNumber": 215,
        "title": "Kth Largest Element in an Array",
        "slug": "kth-largest-element-in-an-array",
        "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Min-Heap of Size K / Quickselect",
        "companyTags": [
          "Amazon",
          "Facebook",
          "Microsoft",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Maintain Min-Heap of size k. After adding all n elements, elements smaller than kth are purged, leaving kth largest at top in O(N log K).",
        "order": 4
      },
      {
        "id": "lc-347",
        "leetcodeNumber": 347,
        "title": "Top K Frequent Elements",
        "slug": "top-k-frequent-elements",
        "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-elements/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Frequency Map + Min-Heap / Bucket Sort",
        "companyTags": [
          "Amazon",
          "Facebook",
          "TCS Prime",
          "Google"
        ],
        "keyIntuition": "Count frequencies with Hash Map. Maintain Min-Heap of size k ordered by frequency; top k elements remain in O(N log K).",
        "order": 5
      },
      {
        "id": "lc-973",
        "leetcodeNumber": 973,
        "title": "K Closest Points to Origin",
        "slug": "k-closest-points-to-origin",
        "leetcodeUrl": "https://leetcode.com/problems/k-closest-points-to-origin/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Max-Heap of Distances",
        "companyTags": [
          "Amazon",
          "Facebook",
          "TCS Prime"
        ],
        "keyIntuition": "Maintain Max-Heap of size k storing points by Euclidean distance (x^2 + y^2). Pop farthest points when size > k.",
        "order": 6
      },
      {
        "id": "lc-378",
        "leetcodeNumber": 378,
        "title": "Kth Smallest Element in a Sorted Matrix",
        "slug": "kth-smallest-element-in-a-sorted-matrix",
        "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Min-Heap Multiway Merge / Binary Search",
        "companyTags": [
          "Amazon",
          "TCS Prime",
          "Google"
        ],
        "keyIntuition": "Initialize Min-Heap with first element of each row. Pop minimum, increment column index and push next node k times.",
        "order": 7
      },
      {
        "id": "lc-253",
        "leetcodeNumber": 253,
        "title": "Meeting Rooms II",
        "slug": "meeting-rooms-ii",
        "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Min-Heap Active Meeting End Times",
        "companyTags": [
          "Amazon",
          "Google",
          "Facebook",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Sort intervals by start time. Min-Heap stores end times of active meetings. If start >= heap.top(), reuse room (pop); push current end time.",
        "order": 8
      },
      {
        "id": "lc-621",
        "leetcodeNumber": 621,
        "title": "Task Scheduler",
        "slug": "task-scheduler",
        "leetcodeUrl": "https://leetcode.com/problems/task-scheduler/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Max-Heap Greedy Frequency + Cooldown Queue",
        "companyTags": [
          "Amazon",
          "Facebook",
          "TCS Prime"
        ],
        "keyIntuition": "Max-Heap tracks task counts. Greedily execute highest frequency tasks, placing executed tasks into a cooldown queue with available time.",
        "order": 9
      },
      {
        "id": "lc-355",
        "leetcodeNumber": 355,
        "title": "Design Twitter",
        "slug": "design-twitter",
        "leetcodeUrl": "https://leetcode.com/problems/design-twitter/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "K-Way Merge Heap of Feeds",
        "companyTags": [
          "Amazon",
          "Twitter",
          "Google"
        ],
        "keyIntuition": "User follow relationships in set. When fetching news feed, use Min-Heap to merge the most recent 10 tweets across all followed users.",
        "order": 10
      },
      {
        "id": "lc-767",
        "leetcodeNumber": 767,
        "title": "Reorganize String",
        "slug": "reorganize-string",
        "leetcodeUrl": "https://leetcode.com/problems/reorganize-string/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Max-Heap Alternate Character Placement",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Count character frequencies in Max-Heap. Pop most frequent char, append to result, then pair with second most frequent char before reinserting.",
        "order": 11
      },
      {
        "id": "lc-451",
        "leetcodeNumber": 451,
        "title": "Sort Characters By Frequency",
        "slug": "sort-characters-by-frequency",
        "leetcodeUrl": "https://leetcode.com/problems/sort-characters-by-frequency/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Max-Heap / Frequency Map",
        "companyTags": [
          "Amazon",
          "Bloomberg",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Count character occurrences. Insert into Max-Heap ordered by count. Pop characters and append count times to build result string.",
        "order": 12
      },
      {
        "id": "lc-373",
        "leetcodeNumber": 373,
        "title": "Find K Pairs with Smallest Sums",
        "slug": "find-k-pairs-with-smallest-sums",
        "leetcodeUrl": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
        "difficulty": "MEDIUM",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Min-Heap Multiway Pair Generation",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Push initial pairs (nums1[i], nums2[0]) into Min-Heap. Pop smallest sum pair and push successor (nums1[i], nums2[j+1]) until k pairs collected.",
        "order": 13
      },
      {
        "id": "lc-295",
        "leetcodeNumber": 295,
        "title": "Find Median from Data Stream",
        "slug": "find-median-from-data-stream",
        "leetcodeUrl": "https://leetcode.com/problems/find-median-from-data-stream/",
        "difficulty": "HARD",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Two Heaps (Max-Heap Lower & Min-Heap Upper)",
        "companyTags": [
          "Amazon",
          "Google",
          "Microsoft",
          "TCS Prime",
          "Goldman Sachs"
        ],
        "keyIntuition": "Balance numbers across Max-Heap (lower half) and Min-Heap (upper half). Size diff at most 1. Median is top of larger heap or average of tops.",
        "order": 14
      },
      {
        "id": "lc-502",
        "leetcodeNumber": 502,
        "title": "IPO",
        "slug": "ipo",
        "leetcodeUrl": "https://leetcode.com/problems/ipo/",
        "difficulty": "HARD",
        "stageId": "stage-7-heaps",
        "stageTitle": "Stage 7: Heaps & Priority Queues (Top 'K')",
        "pattern": "Dual Heap (Min-Heap Capital + Max-Heap Profit)",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Min-Heap sorted by capital requirement, Max-Heap sorted by profit. Move all projects within current capital to Max-Heap, greedily pick highest profit.",
        "order": 15
      }
    ]
  },
  {
    "id": "stage-8-backtracking",
    "stageNumber": 8,
    "title": "Stage 8: Recursion & Backtracking",
    "cluster": "Exhaustive Search & DP",
    "description": "Master combinatorial subsets, permutations, path branching, and constraint satisfaction solvers.",
    "iconName": "Brain",
    "corePattern": "State Tree Branching & Pruning",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-257",
        "leetcodeNumber": 257,
        "title": "Binary Tree Paths",
        "slug": "binary-tree-paths",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-paths/",
        "difficulty": "EASY",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Root-to-Leaf Path Backtracking",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Digital",
          "Facebook"
        ],
        "keyIntuition": "Traverse tree with path string. When leaf is reached, add path to results; backtrack automatically with recursion stack.",
        "order": 1
      },
      {
        "id": "lc-1863",
        "leetcodeNumber": 1863,
        "title": "Sum of All Subset XOR Totals",
        "slug": "sum-of-all-subset-xor-totals",
        "leetcodeUrl": "https://leetcode.com/problems/sum-of-all-subset-xor-totals/",
        "difficulty": "EASY",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Foundational Subset Backtracking",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Google"
        ],
        "keyIntuition": "At each index, branch into including element in running XOR sum or excluding it. Sum all leaf base case values.",
        "order": 2
      },
      {
        "id": "lc-78",
        "leetcodeNumber": 78,
        "title": "Subsets",
        "slug": "subsets",
        "leetcodeUrl": "https://leetcode.com/problems/subsets/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Include / Exclude Choice Tree",
        "companyTags": [
          "Amazon",
          "Facebook",
          "Microsoft",
          "TCS Prime",
          "Bloomberg"
        ],
        "keyIntuition": "For each element, choose whether to include it in current subset or exclude it; append subset copy to results at each step.",
        "order": 3
      },
      {
        "id": "lc-90",
        "leetcodeNumber": 90,
        "title": "Subsets II (With Duplicates)",
        "slug": "subsets-ii",
        "leetcodeUrl": "https://leetcode.com/problems/subsets-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Sorted Sibling Duplicate Pruning",
        "companyTags": [
          "Amazon",
          "Facebook",
          "TCS Prime"
        ],
        "keyIntuition": "Sort array. When branching across sibling choices, skip if nums[i] == nums[i-1] and i > start to prevent identical subsets.",
        "order": 4
      },
      {
        "id": "lc-39",
        "leetcodeNumber": 39,
        "title": "Combination Sum",
        "slug": "combination-sum",
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Unbounded Choice Branching",
        "companyTags": [
          "Amazon",
          "Facebook",
          "Microsoft",
          "TCS Prime",
          "Airbnb"
        ],
        "keyIntuition": "Sort candidates. Allow reusing current candidate by recurring at same index i with (target - candidates[i]). Terminate when target < 0.",
        "order": 5
      },
      {
        "id": "lc-40",
        "leetcodeNumber": 40,
        "title": "Combination Sum II",
        "slug": "combination-sum-ii",
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Single-Use Sorted Candidate Pruning",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Sort candidates. Each number used at most once (recurse at i + 1). Skip duplicate siblings (i > start && candidates[i] == candidates[i-1]).",
        "order": 6
      },
      {
        "id": "lc-216",
        "leetcodeNumber": 216,
        "title": "Combination Sum III",
        "slug": "combination-sum-iii",
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum-iii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Fixed-K Digit Backtracking",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Backtrack using digits 1-9. Maintain current combination length k and target n; prune branches where combination size exceeds k or sum exceeds n.",
        "order": 7
      },
      {
        "id": "lc-46",
        "leetcodeNumber": 46,
        "title": "Permutations",
        "slug": "permutations",
        "leetcodeUrl": "https://leetcode.com/problems/permutations/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Used Elements Visited Set / In-Place Swap",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Adobe"
        ],
        "keyIntuition": "Recursively build permutation of length n. Maintain visited boolean array or perform in-place swaps between start and i.",
        "order": 8
      },
      {
        "id": "lc-47",
        "leetcodeNumber": 47,
        "title": "Permutations II",
        "slug": "permutations-ii",
        "leetcodeUrl": "https://leetcode.com/problems/permutations-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Permutations with Visited Duplicate Skipping",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Sort array. Skip duplicate if nums[i] == nums[i-1] and !visited[i-1], ensuring duplicates are only consumed in strict original relative order.",
        "order": 9
      },
      {
        "id": "lc-22",
        "leetcodeNumber": 22,
        "title": "Generate Parentheses",
        "slug": "generate-parentheses",
        "leetcodeUrl": "https://leetcode.com/problems/generate-parentheses/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Decision Tree with Open/Close Constraints",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Adobe"
        ],
        "keyIntuition": "Add '(' if open < n; add ')' if close < open. Backtrack naturally when length reaches 2n to guarantee valid well-formed strings.",
        "order": 10
      },
      {
        "id": "lc-79",
        "leetcodeNumber": 79,
        "title": "Word Search",
        "slug": "word-search",
        "leetcodeUrl": "https://leetcode.com/problems/word-search/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Grid DFS with In-Place Visited Masking",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Bloomberg"
        ],
        "keyIntuition": "Start DFS from each matching cell. Temporarily mask board[r][c] with '#' while recursing in 4 directions; unmask '#' on return.",
        "order": 11
      },
      {
        "id": "lc-131",
        "leetcodeNumber": 131,
        "title": "Palindrome Partitioning",
        "slug": "palindrome-partitioning",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-partitioning/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Prefix Palindrome Validation + Backtracking",
        "companyTags": [
          "Amazon",
          "Bloomberg",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Partition string into prefix and suffix. If prefix is palindrome, add to current path and recurse on remaining suffix.",
        "order": 12
      },
      {
        "id": "lc-17",
        "leetcodeNumber": 17,
        "title": "Letter Combinations of a Phone Number",
        "slug": "letter-combinations-of-a-phone-number",
        "leetcodeUrl": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
        "difficulty": "MEDIUM",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Digit Mapping Recursive Combination",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Map digits to letters. At each index, branch across all corresponding letters of digits[index] and recurse to index + 1.",
        "order": 13
      },
      {
        "id": "lc-51",
        "leetcodeNumber": 51,
        "title": "N-Queens",
        "slug": "n-queens",
        "leetcodeUrl": "https://leetcode.com/problems/n-queens/",
        "difficulty": "HARD",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Column & Diagonal Bitmask Pruning",
        "companyTags": [
          "Amazon",
          "Google",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Place one queen per row. Track attacked columns, main diagonals (r - c), and anti-diagonals (r + c) using sets or bitmasks.",
        "order": 14
      },
      {
        "id": "lc-37",
        "leetcodeNumber": 37,
        "title": "Sudoku Solver",
        "slug": "sudoku-solver",
        "leetcodeUrl": "https://leetcode.com/problems/sudoku-solver/",
        "difficulty": "HARD",
        "stageId": "stage-8-backtracking",
        "stageTitle": "Stage 8: Recursion & Backtracking",
        "pattern": "Constraint Satisfaction Grid Backtracking",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Find empty cell. Try digits '1'-'9'; verify valid placement across row, column, and 3x3 subgrid. If leads to solution return true; else reset to '.'.",
        "order": 15
      }
    ]
  },
  {
    "id": "stage-9-dp-classics",
    "stageNumber": 9,
    "title": "Stage 9: Dynamic Programming Classics",
    "cluster": "Exhaustive Search & DP",
    "description": "Master 1D recurrences, 0/1 knapsacks, longest subsequences, edit distances, and grid paths.",
    "iconName": "Sparkles",
    "corePattern": "Optimal Substructure & Overlapping Subproblems",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-70",
        "leetcodeNumber": 70,
        "title": "Climbing Stairs",
        "slug": "climbing-stairs",
        "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/",
        "difficulty": "EASY",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Fibonacci Linear Recurrence",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Digital",
          "Google"
        ],
        "keyIntuition": "dp[i] = dp[i-1] + dp[i-2] with base cases dp[1]=1, dp[2]=2. Optimize to O(1) space with two variables.",
        "order": 1
      },
      {
        "id": "lc-746",
        "leetcodeNumber": 746,
        "title": "Min Cost Climbing Stairs",
        "slug": "min-cost-climbing-stairs",
        "leetcodeUrl": "https://leetcode.com/problems/min-cost-climbing-stairs/",
        "difficulty": "EASY",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Minimum Cost 1D Recurrence",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Adobe"
        ],
        "keyIntuition": "dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Cost to reach top is min(dp[n-1], dp[n-2]).",
        "order": 2
      },
      {
        "id": "lc-198",
        "leetcodeNumber": 198,
        "title": "House Robber",
        "slug": "house-robber",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Non-Adjacent Maximum Recurrence",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Cisco"
        ],
        "keyIntuition": "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Space-optimize to two variables prev1 and prev2.",
        "order": 3
      },
      {
        "id": "lc-213",
        "leetcodeNumber": 213,
        "title": "House Robber II (Circular)",
        "slug": "house-robber-ii",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Circular Array Dual Range Subproblem",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "First and last house cannot both be robbed. Run House Robber (LC #198) on range [0, n-2] and range [1, n-1]; take the maximum.",
        "order": 4
      },
      {
        "id": "lc-322",
        "leetcodeNumber": 322,
        "title": "Coin Change",
        "slug": "coin-change",
        "leetcodeUrl": "https://leetcode.com/problems/coin-change/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Unbounded Knapsack Min Coins",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "dp[amount] = min(dp[amount - coin] + 1) for each coin <= amount. Initialize dp array with infinity, base case dp[0] = 0.",
        "order": 5
      },
      {
        "id": "lc-518",
        "leetcodeNumber": 518,
        "title": "Coin Change II",
        "slug": "coin-change-ii",
        "leetcodeUrl": "https://leetcode.com/problems/coin-change-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Unbounded Knapsack Total Combinations",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Outer loop over coins, inner loop over amounts from coin to target: dp[amount] += dp[amount - coin]. Ensures unique combinations.",
        "order": 6
      },
      {
        "id": "lc-300",
        "leetcodeNumber": 300,
        "title": "Longest Increasing Subsequence",
        "slug": "longest-increasing-subsequence",
        "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-subsequence/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Patience Sorting Binary Search (O(N log N))",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Maintain array of smallest tail elements. For each num, binary search insertion point. If larger than all tails append, else overwrite tail.",
        "order": 7
      },
      {
        "id": "lc-416",
        "leetcodeNumber": 416,
        "title": "Partition Equal Subset Sum",
        "slug": "partition-equal-subset-sum",
        "leetcodeUrl": "https://leetcode.com/problems/partition-equal-subset-sum/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "0/1 Knapsack Target Boolean State",
        "companyTags": [
          "Amazon",
          "Facebook",
          "TCS Prime"
        ],
        "keyIntuition": "If total sum is odd return false. Target = sum / 2. 1D boolean array updated backwards: dp[j] = dp[j] || dp[j - num].",
        "order": 8
      },
      {
        "id": "lc-1143",
        "leetcodeNumber": 1143,
        "title": "Longest Common Subsequence",
        "slug": "longest-common-subsequence",
        "leetcodeUrl": "https://leetcode.com/problems/longest-common-subsequence/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "2D String Grid Alignment DP",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "If text1[i-1] == text2[j-1], dp[i][j] = 1 + dp[i-1][j-1]; else dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Space-optimizable to 1D.",
        "order": 9
      },
      {
        "id": "lc-72",
        "leetcodeNumber": 72,
        "title": "Edit Distance",
        "slug": "edit-distance",
        "leetcodeUrl": "https://leetcode.com/problems/edit-distance/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Levenshtein Matrix Operations",
        "companyTags": [
          "Amazon",
          "Google",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1]; else dp[i][j] = 1 + min(insert, delete, replace).",
        "order": 10
      },
      {
        "id": "lc-62",
        "leetcodeNumber": 62,
        "title": "Unique Paths",
        "slug": "unique-paths",
        "leetcodeUrl": "https://leetcode.com/problems/unique-paths/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Grid Combinatorics / 2D DP",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "dp[r][c] = dp[r-1][c] + dp[r][c-1]. First row and column initialized to 1. Space-optimizable to single 1D row array.",
        "order": 11
      },
      {
        "id": "lc-64",
        "leetcodeNumber": 64,
        "title": "Minimum Path Sum",
        "slug": "minimum-path-sum",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-path-sum/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Grid In-Place Minimum Path DP",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "grid[r][c] += min(grid[r-1][c], grid[r][c-1]). Update directly in-place or using 1D buffer row in O(m*n).",
        "order": 12
      },
      {
        "id": "lc-139",
        "leetcodeNumber": 139,
        "title": "Word Break",
        "slug": "word-break",
        "leetcodeUrl": "https://leetcode.com/problems/word-break/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Prefix Substring Segmentation DP",
        "companyTags": [
          "Amazon",
          "Facebook",
          "Google",
          "TCS Prime",
          "Bloomberg"
        ],
        "keyIntuition": "dp[i] = true if dp[j] is true and wordDict contains s.substring(j, i) for some j < i. Base case dp[0] = true.",
        "order": 13
      },
      {
        "id": "lc-5",
        "leetcodeNumber": 5,
        "title": "Longest Palindromic Substring",
        "slug": "longest-palindromic-substring",
        "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-substring/",
        "difficulty": "MEDIUM",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "Expand Around Center (Odd & Even)",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Adobe"
        ],
        "keyIntuition": "For each character, expand outward for odd-length center (i, i) and even-length center (i, i+1). Track start and max length in O(N^2).",
        "order": 14
      },
      {
        "id": "lc-10",
        "leetcodeNumber": 10,
        "title": "Regular Expression Matching",
        "slug": "regular-expression-matching",
        "leetcodeUrl": "https://leetcode.com/problems/regular-expression-matching/",
        "difficulty": "HARD",
        "stageId": "stage-9-dp-classics",
        "stageTitle": "Stage 9: Dynamic Programming Classics",
        "pattern": "2D Wildcard DP State Matrix",
        "companyTags": [
          "Facebook",
          "Google",
          "Amazon",
          "TCS Prime"
        ],
        "keyIntuition": "dp[i][j] tracks if s[0..i-1] matches p[0..j-1]. Handle '*' by choosing 0 occurrences (dp[i][j-2]) or 1+ occurrences if char matches.",
        "order": 15
      }
    ]
  },
  {
    "id": "stage-10-graphs",
    "stageNumber": 10,
    "title": "Stage 10: Graphs & Topological Sort",
    "cluster": "Network & Graph Algorithms",
    "description": "Master connected components, BFS shortest paths, Disjoint Set Union, cycle detection, and Kahn's topological sort.",
    "iconName": "Network",
    "corePattern": "Connectivity, Shortest Path & Dependency Ordering",
    "estimatedHours": "8-10 hrs",
    "problems": [
      {
        "id": "lc-733",
        "leetcodeNumber": 733,
        "title": "Flood Fill",
        "slug": "flood-fill",
        "leetcodeUrl": "https://leetcode.com/problems/flood-fill/",
        "difficulty": "EASY",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "4-Directional DFS/BFS Pixel Fill",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Google"
        ],
        "keyIntuition": "Check if original color != newColor. DFS/BFS in 4 directions replacing matching original color cells with newColor.",
        "order": 1
      },
      {
        "id": "lc-1971",
        "leetcodeNumber": 1971,
        "title": "Find if Path Exists in Graph",
        "slug": "find-if-path-exists-in-graph",
        "leetcodeUrl": "https://leetcode.com/problems/find-if-path-exists-in-graph/",
        "difficulty": "EASY",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "BFS/DFS / Disjoint Set Union",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Microsoft"
        ],
        "keyIntuition": "Build adjacency list. Standard BFS or Union-Find; check if find(source) == find(destination) in O(V + E).",
        "order": 2
      },
      {
        "id": "lc-997",
        "leetcodeNumber": 997,
        "title": "Find the Town Judge",
        "slug": "find-the-town-judge",
        "leetcodeUrl": "https://leetcode.com/problems/find-the-town-judge/",
        "difficulty": "EASY",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "In-degree & Out-degree Graph Counter",
        "companyTags": [
          "Amazon",
          "TCS Digital",
          "Cognizant"
        ],
        "keyIntuition": "Maintain trust score array: incoming trust increments count, outgoing trust decrements. Judge has score exactly N-1.",
        "order": 3
      },
      {
        "id": "lc-200",
        "leetcodeNumber": 200,
        "title": "Number of Islands",
        "slug": "number-of-islands",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-islands/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Connected Component Flood Fill",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "Google",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Iterate grid. When '1' encountered, increment island count and trigger DFS/BFS to sink all connected '1's to '0'.",
        "order": 4
      },
      {
        "id": "lc-994",
        "leetcodeNumber": 994,
        "title": "Rotting Oranges",
        "slug": "rotting-oranges",
        "leetcodeUrl": "https://leetcode.com/problems/rotting-oranges/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Multi-Source BFS Level Queue",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime",
          "Google"
        ],
        "keyIntuition": "Enqueue all initially rotten oranges into BFS queue, count fresh oranges. Traverse level-by-level incrementing minutes. Return -1 if fresh remains.",
        "order": 5
      },
      {
        "id": "lc-547",
        "leetcodeNumber": 547,
        "title": "Number of Provinces",
        "slug": "number-of-provinces",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-provinces/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Disjoint Set Union / Adjacency DFS",
        "companyTags": [
          "Amazon",
          "Microsoft",
          "TCS Prime"
        ],
        "keyIntuition": "Union-Find or DFS over n cities. Iterate cities, if not visited, trigger DFS across row to mark component and increment province count.",
        "order": 6
      },
      {
        "id": "lc-133",
        "leetcodeNumber": 133,
        "title": "Clone Graph",
        "slug": "clone-graph",
        "leetcodeUrl": "https://leetcode.com/problems/clone-graph/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Graph Deep Copy with Visited Map",
        "companyTags": [
          "Amazon",
          "Facebook",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Map original nodes to clone nodes. Recursively DFS/BFS neighbors; clone node on first visit, attach edges from map.",
        "order": 7
      },
      {
        "id": "lc-207",
        "leetcodeNumber": 207,
        "title": "Course Schedule (Cycle Detection)",
        "slug": "course-schedule",
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Kahn's Algorithm (Indegree BFS)",
        "companyTags": [
          "Amazon",
          "Google",
          "Microsoft",
          "TCS Prime",
          "Infosys SP"
        ],
        "keyIntuition": "Compute indegrees. Enqueue courses with indegree 0. Dequeue, increment processed count, reduce neighbor indegrees. If count == numCourses, feasible.",
        "order": 8
      },
      {
        "id": "lc-210",
        "leetcodeNumber": 210,
        "title": "Course Schedule II (Order of Completion)",
        "slug": "course-schedule-ii",
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule-ii/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Topological Order Output",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Kahn's BFS: append nodes with indegree 0 to result order array. If result length == numCourses return order, else return empty array.",
        "order": 9
      },
      {
        "id": "lc-684",
        "leetcodeNumber": 684,
        "title": "Redundant Connection",
        "slug": "redundant-connection",
        "leetcodeUrl": "https://leetcode.com/problems/redundant-connection/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Union-Find Cycle Detection",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Process edges sequentially with Disjoint Set Union. If find(u) == find(v), edge (u, v) creates a cycle and is the redundant connection.",
        "order": 10
      },
      {
        "id": "lc-417",
        "leetcodeNumber": 417,
        "title": "Pacific Atlantic Water Flow",
        "slug": "pacific-atlantic-water-flow",
        "leetcodeUrl": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Reverse Boundary DFS",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "DFS outward from Pacific ocean borders into higher cells (pacificSet); DFS outward from Atlantic ocean borders (atlanticSet). Intersection flows to both.",
        "order": 11
      },
      {
        "id": "lc-743",
        "leetcodeNumber": 743,
        "title": "Network Delay Time",
        "slug": "network-delay-time",
        "leetcodeUrl": "https://leetcode.com/problems/network-delay-time/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Dijkstra's Shortest Path",
        "companyTags": [
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Min-Heap storing (distance, node). Greedily visit unvisited nodes, relaxing edge weights. Max distance across all nodes is the delay time.",
        "order": 12
      },
      {
        "id": "lc-785",
        "leetcodeNumber": 785,
        "title": "Is Graph Bipartite?",
        "slug": "is-graph-bipartite",
        "leetcodeUrl": "https://leetcode.com/problems/is-graph-bipartite/",
        "difficulty": "MEDIUM",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "2-Coloring BFS / Cycle Detection",
        "companyTags": [
          "Amazon",
          "Google",
          "Facebook",
          "TCS Prime"
        ],
        "keyIntuition": "Color nodes with 0 and 1. BFS/DFS each uncolored component; if adjacent node has same color, graph is not bipartite.",
        "order": 13
      },
      {
        "id": "lc-127",
        "leetcodeNumber": 127,
        "title": "Word Ladder",
        "slug": "word-ladder",
        "leetcodeUrl": "https://leetcode.com/problems/word-ladder/",
        "difficulty": "HARD",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Shortest Path BFS on Word Graph",
        "companyTags": [
          "Amazon",
          "Facebook",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "BFS level search starting from beginWord. At each step, mutate each character 'a'-'z'; if word in dictionary set, enqueue and remove from set.",
        "order": 14
      },
      {
        "id": "lc-269",
        "leetcodeNumber": 269,
        "title": "Alien Dictionary",
        "slug": "alien-dictionary",
        "leetcodeUrl": "https://leetcode.com/problems/alien-dictionary/",
        "difficulty": "HARD",
        "stageId": "stage-10-graphs",
        "stageTitle": "Stage 10: Graphs & Topological Sort",
        "pattern": "Topological Sort on Character Precedence",
        "companyTags": [
          "Facebook",
          "Amazon",
          "Google",
          "TCS Prime"
        ],
        "keyIntuition": "Compare adjacent words to find first differing character (u -> v dependency edge). Build graph and run Kahn's algorithm for character order.",
        "order": 15
      }
    ]
  }
];

export const ALL_CAMPUS_DSA_PROBLEMS: CampusDsaProblem[] = CAMPUS_DSA_ROADMAP_STAGES.flatMap(
  stage => stage.problems
);
