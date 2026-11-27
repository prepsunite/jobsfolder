export const TECH_MAHINDRA_QUESTIONS = [
  {
    number: 1,
    title: 'Telecom Tower Signal Coverage Count',
    fnName: 'countCoveredHouses',
    description: 'In a Tech Mahindra 5G rollout, houses are at 1D coordinates <code>houses</code> and towers are at <code>towers</code>, each with coverage radius <code>r</code>. Return the number of houses covered by at least one tower (<code>|house - tower| &lt;= r</code>).',
    constraints: ['1 <= houses.length, towers.length <= 10^4', '0 <= r <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'houses = [1, 5, 10, 14], towers = [3, 12], r = 2', output: '4' },
      { title: 'Test Case 2', input: 'houses = [1, 20], towers = [5], r = 3', output: '0' },
      { title: 'Test Case 3', input: 'houses = [4, 5, 6], towers = [5], r = 1', output: '3' },
      { title: 'Test Case 4', input: 'houses = [10], towers = [10], r = 0', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countCoveredHouses(int[] houses, int[] towers, int r) {
        Arrays.sort(towers);
        int cnt = 0;
        for (int h : houses) {
            int idx = Arrays.binarySearch(towers, h);
            if (idx >= 0) { cnt++; continue; }
            int ins = -(idx + 1);
            boolean ok = (ins < towers.length && towers[ins] - h <= r) || (ins > 0 && h - towers[ins - 1] <= r);
            if (ok) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countCoveredHouses(houses, towers, r):
    import bisect
    tw = sorted(towers)
    cnt = 0
    for h in houses:
        i = bisect.bisect_left(tw, h)
        if (i < len(tw) and tw[i] - h <= r) or (i > 0 and h - tw[i - 1] <= r):
            cnt += 1
    return cnt`
  },
  {
    number: 2,
    title: 'Call Detail Record (CDR) Odd-Even Billing',
    fnName: 'oddEvenDigitDifference',
    description: 'A Tech Mahindra SuperCoder billing check takes a non-negative integer string <code>numStr</code> and returns the absolute difference between the sum of its odd digits and the sum of its even digits.',
    constraints: ['1 <= numStr.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'numStr = "4567"', output: '2' },
      { title: 'Test Case 2', input: 'numStr = "2468"', output: '20' },
      { title: 'Test Case 3', input: 'numStr = "135"', output: '9' },
      { title: 'Test Case 4', input: 'numStr = "0"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int oddEvenDigitDifference(String numStr) {
        int even = 0, odd = 0;
        for (char c : numStr.toCharArray()) {
            int d = c - '0';
            if ((d & 1) == 0) even += d; else odd += d;
        }
        return Math.abs(odd - even);
    }
}`,
    pythonSolution: `def oddEvenDigitDifference(numStr):
    even = sum(int(c) for c in numStr if int(c) % 2 == 0)
    odd = sum(int(c) for c in numStr if int(c) % 2 == 1)
    return abs(odd - even)`
  },
  {
    number: 3,
    title: 'Total Tax on Array of Salaries',
    fnName: 'calcTotalSurcharge',
    description: 'Given employee salaries <code>salaries</code>, every salary strictly above 1000 incurs a 10% surcharge on the excess amount <code>(salary - 1000) * 10 // 100</code>. Return the total surcharge across all employees.',
    constraints: ['1 <= salaries.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'salaries = [1000, 2000, 3000, 4000]', output: '600' },
      { title: 'Test Case 2', input: 'salaries = [500, 900, 1000]', output: '0' },
      { title: 'Test Case 3', input: 'salaries = [1500]', output: '50' },
      { title: 'Test Case 4', input: 'salaries = [2500, 1200]', output: '170' }
    ],
    javaSolution: `public class Solution {
    public static long calcTotalSurcharge(int[] salaries) {
        long total = 0;
        for (int s : salaries) if (s > 1000) total += (s - 1000L) * 10 / 100;
        return total;
    }
}`,
    pythonSolution: `def calcTotalSurcharge(salaries):
    return sum((s - 1000) * 10 // 100 for s in salaries if s > 1000)`
  },
  {
    number: 4,
    title: 'Adjacent Difference Sum in Sensor Array',
    fnName: 'sumAdjacentDiffs',
    description: 'Given integer array <code>arr</code>, return the sum of absolute differences between all consecutive elements: <code>sum(|arr[i] - arr[i+1]|)</code>.',
    constraints: ['1 <= arr.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [10, 11, 7, 12, 14]', output: '12' },
      { title: 'Test Case 2', input: 'arr = [5, 5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'arr = [1, 10]', output: '9' },
      { title: 'Test Case 4', input: 'arr = [42]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long sumAdjacentDiffs(int[] arr) {
        long sum = 0;
        for (int i = 1; i < arr.length; i++) sum += Math.abs((long) arr[i] - arr[i - 1]);
        return sum;
    }
}`,
    pythonSolution: `def sumAdjacentDiffs(arr):
    return sum(abs(arr[i] - arr[i - 1]) for i in range(1, len(arr)))`
  },
  {
    number: 5,
    title: 'Count Carry Operations in Addition',
    fnName: 'countAdditionCarries',
    description: 'Given two non-negative integers <code>a</code> and <code>b</code>, return the total number of digit carry operations generated when adding them in base 10.',
    constraints: ['0 <= a, b <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'a = 451, b = 349', output: '2' },
      { title: 'Test Case 2', input: 'a = 23, b = 563', output: '0' },
      { title: 'Test Case 3', input: 'a = 999, b = 1', output: '3' },
      { title: 'Test Case 4', input: 'a = 0, b = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAdditionCarries(int a, int b) {
        int carry = 0, count = 0;
        while (a > 0 || b > 0) {
            int s = (a % 10) + (b % 10) + carry;
            carry = s / 10;
            if (carry > 0) count++;
            a /= 10; b /= 10;
        }
        return count;
    }
}`,
    pythonSolution: `def countAdditionCarries(a, b):
    carry = count = 0
    while a > 0 or b > 0:
        carry = (a % 10 + b % 10 + carry) // 10
        if carry: count += 1
        a //= 10; b //= 10
    return count`
  },
  {
    number: 6,
    title: 'Perfect Square Parcel Selector',
    fnName: 'countPerfectSquares',
    description: 'Given an array of parcel weights <code>weights</code>, count how many parcels have a weight that is a perfect square.',
    constraints: ['1 <= weights.length <= 10^5', '0 <= weights[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [1, 4, 5, 9, 16, 20]', output: '4' },
      { title: 'Test Case 2', input: 'weights = [2, 3, 5, 7]', output: '0' },
      { title: 'Test Case 3', input: 'weights = [0, 1, 100]', output: '3' },
      { title: 'Test Case 4', input: 'weights = [25]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countPerfectSquares(int[] weights) {
        int cnt = 0;
        for (int w : weights) {
            if (w >= 0) {
                long r = (long) Math.sqrt(w);
                if (r * r == w) cnt++;
            }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countPerfectSquares(weights):
    import math
    return sum(1 for w in weights if w >= 0 and math.isqrt(w) ** 2 == w)`
  },
  {
    number: 7,
    title: 'Maximum Difference Between Increasing Elements',
    fnName: 'maxIncreasingDiff',
    description: 'Given integer array <code>nums</code>, find the maximum difference <code>nums[j] - nums[i]</code> such that <code>0 &lt;= i &lt; j &lt; n</code> and <code>nums[i] &lt; nums[j]</code>. Return <code>-1</code> if no such pair exists.',
    constraints: ['2 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [7, 1, 5, 4]', output: '4' },
      { title: 'Test Case 2', input: 'nums = [9, 4, 3, 2]', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [1, 5, 2, 10]', output: '9' },
      { title: 'Test Case 4', input: 'nums = [2, 2]', output: '-1' }
    ],
    javaSolution: `public class Solution {
    public static int maxIncreasingDiff(int[] nums) {
        int minVal = nums[0], best = -1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > minVal) best = Math.max(best, nums[i] - minVal);
            else minVal = nums[i];
        }
        return best;
    }
}`,
    pythonSolution: `def maxIncreasingDiff(nums):
    mn, best = nums[0], -1
    for x in nums[1:]:
        if x > mn: best = max(best, x - mn)
        else: mn = x
    return best`
  },
  {
    number: 8,
    title: 'Leaders in Telemetry Array',
    fnName: 'findArrayLeaders',
    description: 'An element in <code>arr</code> is a leader if it is strictly greater than all elements to its right (the rightmost element is always a leader). Return all leaders in left-to-right order.',
    constraints: ['1 <= arr.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [16, 17, 4, 3, 5, 2]', output: '[17, 5, 2]' },
      { title: 'Test Case 2', input: 'arr = [1, 2, 3, 4]', output: '[4]' },
      { title: 'Test Case 3', input: 'arr = [10, 5, 2]', output: '[10, 5, 2]' },
      { title: 'Test Case 4', input: 'arr = [7]', output: '[7]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> findArrayLeaders(int[] arr) {
        List<Integer> res = new ArrayList<>();
        int maxRight = Integer.MIN_VALUE;
        for (int i = arr.length - 1; i >= 0; i--) {
            if (arr[i] > maxRight) { res.add(arr[i]); maxRight = arr[i]; }
        }
        Collections.reverse(res);
        return res;
    }
}`,
    pythonSolution: `def findArrayLeaders(arr):
    res, mx = [], float('-inf')
    for x in reversed(arr):
        if x > mx:
            res.append(x); mx = x
    return res[::-1]`
  },
  {
    number: 9,
    title: 'Minimum Deletions to Make Palindrome Prefix',
    fnName: 'countPalindromeSubstrings',
    description: 'Given string <code>s</code>, return the total number of non-empty palindromic contiguous substrings in <code>s</code>.',
    constraints: ['1 <= s.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abc"', output: '3' },
      { title: 'Test Case 2', input: 's = "aaa"', output: '6' },
      { title: 'Test Case 3', input: 's = "aba"', output: '4' },
      { title: 'Test Case 4', input: 's = "a"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countPalindromeSubstrings(String s) {
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            count += expand(s, i, i) + expand(s, i, i + 1);
        }
        return count;
    }
    private static int expand(String s, int l, int r) {
        int c = 0;
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { c++; l--; r++; }
        return c;
    }
}`,
    pythonSolution: `def countPalindromeSubstrings(s):
    cnt = 0
    for i in range(len(s)):
        for l, r in ((i, i), (i, i + 1)):
            while l >= 0 and r < len(s) and s[l] == s[r]:
                cnt += 1; l -= 1; r += 1
    return cnt`
  },
  {
    number: 10,
    title: 'Minimum Time to Activate All Towers (BFS)',
    fnName: 'minSignalSpreadTime',
    description: 'Given <code>n</code> towers (0..n-1), undirected links <code>edges</code>, and initially active tower <code>start</code>, each minute active towers activate all direct neighbors. Return the minimum minutes to activate all towers, or <code>-1</code> if unreachable.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0, 1], [1, 2], [2, 3]], start = 0', output: '3' },
      { title: 'Test Case 2', input: 'n = 4, edges = [[0, 1], [2, 3]], start = 0', output: '-1' },
      { title: 'Test Case 3', input: 'n = 1, edges = [], start = 0', output: '0' },
      { title: 'Test Case 4', input: 'n = 4, edges = [[0, 1], [0, 2], [0, 3]], start = 0', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minSignalSpreadTime(int n, int[][] edges, int start) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[start] = 0;
        Deque<Integer> q = new ArrayDeque<>();
        q.add(start);
        int maxD = 0, seen = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); seen++; maxD = Math.max(maxD, dist[u]);
            for (int v : g.get(u)) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.add(v); }
        }
        return seen == n ? maxD : -1;
    }
}`,
    pythonSolution: `def minSignalSpreadTime(n, edges, start):
    from collections import deque
    g = [[] for _ in range(n)]
    for u, v in edges: g[u].append(v); g[v].append(u)
    dist = [-1] * n
    dist[start] = 0
    q = deque([start])
    while q:
        u = q.popleft()
        for v in g[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1; q.append(v)
    return -1 if -1 in dist else max(dist)`
  },
  {
    number: 11,
    title: 'Sort Array by Parity Preservation',
    fnName: 'sortEvenThenOdd',
    description: 'Rearrange integer array <code>nums</code> so all even integers come first (in ascending order) followed by all odd integers (in ascending order).',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 1, 2, 4]', output: '[2, 4, 1, 3]' },
      { title: 'Test Case 2', input: 'nums = [5, 7, 9]', output: '[5, 7, 9]' },
      { title: 'Test Case 3', input: 'nums = [0, 2, 1]', output: '[0, 2, 1]' },
      { title: 'Test Case 4', input: 'nums = [8]', output: '[8]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] sortEvenThenOdd(int[] nums) {
        return Arrays.stream(nums).boxed()
            .sorted((a, b) -> {
                int pa = Math.abs(a % 2), pb = Math.abs(b % 2);
                return pa != pb ? Integer.compare(pa, pb) : Integer.compare(a, b);
            })
            .mapToInt(Integer::intValue).toArray();
    }
}`,
    pythonSolution: `def sortEvenThenOdd(nums):
    return sorted(nums, key=lambda x: (x % 2, x))`
  },
  {
    number: 12,
    title: 'Check Pangram Sentence',
    fnName: 'isPangram',
    description: 'Return <code>true</code> if sentence <code>s</code> contains every letter of the English alphabet at least once (case-insensitive), otherwise <code>false</code>.',
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "The quick brown fox jumps over the lazy dog"', output: 'true' },
      { title: 'Test Case 2', input: 's = "Tech Mahindra SuperCoder"', output: 'false' },
      { title: 'Test Case 3', input: 's = "abcdefghijklmnopqrstuvwxyz"', output: 'true' },
      { title: 'Test Case 4', input: 's = "abc"', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean isPangram(String s) {
        boolean[] seen = new boolean[26];
        int cnt = 0;
        for (char c : s.toLowerCase().toCharArray()) {
            if (c >= 'a' && c <= 'z' && !seen[c - 'a']) { seen[c - 'a'] = true; cnt++; }
        }
        return cnt == 26;
    }
}`,
    pythonSolution: `def isPangram(s):
    return len({c for c in s.lower() if 'a' <= c <= 'z'}) == 26`
  },
  {
    number: 13,
    title: 'Rearrange Positive and Negative Alternating',
    fnName: 'alternatePosNeg',
    description: 'Given an array <code>nums</code> with equal number of positive and negative integers, rearrange them so they alternate starting with a positive number while preserving relative order.',
    constraints: ['2 <= nums.length <= 10^5', 'nums.length is even'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 1, -2, -5, 2, -4]', output: '[3, -2, 1, -5, 2, -4]' },
      { title: 'Test Case 2', input: 'nums = [-1, 1]', output: '[1, -1]' },
      { title: 'Test Case 3', input: 'nums = [1, 2, -1, -2]', output: '[1, -1, 2, -2]' },
      { title: 'Test Case 4', input: 'nums = [-5, -6, 5, 6]', output: '[5, -5, 6, -6]' }
    ],
    javaSolution: `public class Solution {
    public static int[] alternatePosNeg(int[] nums) {
        int[] res = new int[nums.length];
        int p = 0, n = 1;
        for (int x : nums) {
            if (x > 0) { res[p] = x; p += 2; }
            else { res[n] = x; n += 2; }
        }
        return res;
    }
}`,
    pythonSolution: `def alternatePosNeg(nums):
    res = [0] * len(nums)
    p, n = 0, 1
    for x in nums:
        if x > 0: res[p] = x; p += 2
        else: res[n] = x; n += 2
    return res`
  },
  {
    number: 14,
    title: 'Minimum Operations to Make Array Elements Zero',
    fnName: 'countUniquePositives',
    description: 'In one operation, choose a positive integer <code>x &lt;= min(non-zero elements)</code> and subtract <code>x</code> from every positive element in <code>nums</code>. Return the minimum operations to make all elements <code>0</code>.',
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 5, 0, 3, 5]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [0, 0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [10]', output: '1' },
      { title: 'Test Case 4', input: 'nums = [2, 2, 2]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUniquePositives(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) if (x > 0) s.add(x);
        return s.size();
    }
}`,
    pythonSolution: `def countUniquePositives(nums):
    return len({x for x in nums if x > 0})`
  },
  {
    number: 15,
    title: 'Maximum Sum of Distinct Subarray Pairs',
    fnName: 'maxNonAdjPairSum',
    description: 'Given integer array <code>nums</code>, find the maximum sum of two elements <code>nums[i] + nums[j]</code> such that <code>|i - j| &gt;= 2</code>.',
    constraints: ['3 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 7, 4, 6, 5]', output: '13' },
      { title: 'Test Case 2', input: 'nums = [1, 100, 2]', output: '3' },
      { title: 'Test Case 3', input: 'nums = [10, 20, 30, 40]', output: '60' },
      { title: 'Test Case 4', input: 'nums = [-5, -1, -2, -3]', output: '-4' }
    ],
    javaSolution: `public class Solution {
    public static int maxNonAdjPairSum(int[] nums) {
        int bestLeft = nums[0], ans = nums[0] + nums[2];
        for (int i = 2; i < nums.length; i++) {
            bestLeft = Math.max(bestLeft, nums[i - 2]);
            ans = Math.max(ans, bestLeft + nums[i]);
        }
        return ans;
    }
}`,
    pythonSolution: `def maxNonAdjPairSum(nums):
    best_left = nums[0]
    ans = nums[0] + nums[2]
    for i in range(2, len(nums)):
        best_left = max(best_left, nums[i - 2])
        ans = max(ans, best_left + nums[i])
    return ans`
  },
  {
    number: 16,
    title: 'Cheapest Connected Network With Discounted Edge',
    fnName: 'minCostWithOneFreeEdge',
    description: 'Given <code>n</code> nodes (0..n-1) and undirected weighted edges <code>edges</code> <code>[u, v, w]</code>, find the minimum spanning tree cost if you can make at most ONE edge free (cost 0). Return <code>-1</code> if disconnected.',
    constraints: ['1 <= n <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0,1,10],[1,2,20],[2,3,30]]', output: '30' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0,1,5],[1,2,5],[0,2,10]]', output: '5' },
      { title: 'Test Case 3', input: 'n = 3, edges = [[0,1,5]]', output: '-1' },
      { title: 'Test Case 4', input: 'n = 1, edges = []', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minCostWithOneFreeEdge(int n, int[][] edges) {
        if (n <= 1) return 0;
        Arrays.sort(edges, (a, b) -> Integer.compare(a[2], b[2]));
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        int cost = 0, maxEdge = 0, used = 0;
        for (int[] e : edges) {
            int r1 = find(p, e[0]), r2 = find(p, e[1]);
            if (r1 != r2) { p[r1] = r2; cost += e[2]; maxEdge = Math.max(maxEdge, e[2]); used++; }
        }
        return used == n - 1 ? cost - maxEdge : -1;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def minCostWithOneFreeEdge(n, edges):
    if n <= 1: return 0
    p = list(range(n))
    def find(x):
        while p[x] != x: p[x] = p[p[x]]; x = p[x]
        return x
    cost = max_e = used = 0
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        r1, r2 = find(u), find(v)
        if r1 != r2:
            p[r1] = r2; cost += w; max_e = max(max_e, w); used += 1
    return cost - max_e if used == n - 1 else -1`
  },
  {
    number: 17,
    title: 'Longest Bitonic Subsequence',
    fnName: 'longestBitonicLen',
    description: 'Given integer array <code>nums</code>, return the length of the longest subsequence that is first strictly increasing (at least 1 element) and then strictly decreasing (at least 1 element).',
    constraints: ['1 <= nums.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 11, 2, 10, 4, 5, 2, 1]', output: '6' },
      { title: 'Test Case 2', input: 'nums = [12, 11, 40, 5, 3, 1]', output: '5' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 4', input: 'nums = [5]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestBitonicLen(int[] nums) {
        int n = nums.length;
        int[] lis = new int[n], lds = new int[n];
        Arrays.fill(lis, 1); Arrays.fill(lds, 1);
        for (int i = 0; i < n; i++)
            for (int j = 0; j < i; j++)
                if (nums[j] < nums[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
        for (int i = n - 1; i >= 0; i--)
            for (int j = n - 1; j > i; j--)
                if (nums[j] < nums[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
        int best = 0;
        for (int i = 0; i < n; i++) best = Math.max(best, lis[i] + lds[i] - 1);
        return best;
    }
}`,
    pythonSolution: `def longestBitonicLen(nums):
    n = len(nums)
    lis, lds = [1] * n, [1] * n
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]: lis[i] = max(lis[i], lis[j] + 1)
    for i in range(n - 1, -1, -1):
        for j in range(n - 1, i, -1):
            if nums[j] < nums[i]: lds[i] = max(lds[i], lds[j] + 1)
    return max(lis[i] + lds[i] - 1 for i in range(n))`
  },
  {
    number: 18,
    title: 'Minimum Number of Jumps With Negative/Zero Steps',
    fnName: 'minReachableTaps',
    description: 'There is a 1D garden from <code>0</code> to <code>n</code>. Tap <code>i</code> at position <code>i</code> waters <code>[i - ranges[i], i + ranges[i]]</code>. Return the minimum number of taps to open to water the entire <code>[0, n]</code> garden, or <code>-1</code>.',
    constraints: ['1 <= n <= 10^4', 'ranges.length == n + 1'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, ranges = [3, 4, 1, 1, 0, 0]', output: '1' },
      { title: 'Test Case 2', input: 'n = 3, ranges = [0, 0, 0, 0]', output: '-1' },
      { title: 'Test Case 3', input: 'n = 7, ranges = [1, 2, 1, 0, 2, 1, 0, 1]', output: '3' },
      { title: 'Test Case 4', input: 'n = 2, ranges = [1, 0, 1]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minReachableTaps(int n, int[] ranges) {
        int[] maxReach = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            int l = Math.max(0, i - ranges[i]), r = Math.min(n, i + ranges[i]);
            maxReach[l] = Math.max(maxReach[l], r);
        }
        int taps = 0, curEnd = 0, farthest = 0;
        for (int i = 0; i < n; i++) {
            farthest = Math.max(farthest, maxReach[i]);
            if (i == curEnd) {
                if (farthest <= i) return -1;
                taps++; curEnd = farthest;
            }
        }
        return taps;
    }
}`,
    pythonSolution: `def minReachableTaps(n, ranges):
    max_r = [0] * (n + 1)
    for i, rg in enumerate(ranges):
        l, r = max(0, i - rg), min(n, i + rg)
        max_r[l] = max(max_r[l], r)
    taps = cur_end = far = 0
    for i in range(n):
        far = max(far, max_r[i])
        if i == cur_end:
            if far <= i: return -1
            taps += 1; cur_end = far
    return taps`
  },
  {
    number: 19,
    title: 'Minimum Operations to Convert String A to B',
    fnName: 'minInsertDeleteOps',
    description: 'Given strings <code>s1</code> and <code>s2</code>, you can only delete or insert characters. Return the minimum total insertions + deletions to transform <code>s1</code> into <code>s2</code>.',
    constraints: ['1 <= s1.length, s2.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 's1 = "heap", s2 = "pea"', output: '3' },
      { title: 'Test Case 2', input: 's1 = "geeksforgeeks", s2 = "geeks"', output: '8' },
      { title: 'Test Case 3', input: 's1 = "abc", s2 = "abc"', output: '0' },
      { title: 'Test Case 4', input: 's1 = "abc", s2 = "def"', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static int minInsertDeleteOps(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[] dp = new int[n + 1];
        for (int i = 1; i <= m; i++) {
            int prev = 0;
            for (int j = 1; j <= n; j++) {
                int tmp = dp[j];
                dp[j] = (s1.charAt(i - 1) == s2.charAt(j - 1)) ? prev + 1 : Math.max(dp[j], dp[j - 1]);
                prev = tmp;
            }
        }
        return m + n - 2 * dp[n];
    }
}`,
    pythonSolution: `def minInsertDeleteOps(s1, s2):
    m, n = len(s1), len(s2)
    dp = [0] * (n + 1)
    for i in range(1, m + 1):
        prev = 0
        for j in range(1, n + 1):
            tmp = dp[j]
            dp[j] = prev + 1 if s1[i-1] == s2[j-1] else max(dp[j], dp[j-1])
            prev = tmp
    return m + n - 2 * dp[n]`
  },
  {
    number: 20,
    title: 'Maximum XOR of Two Numbers in Array',
    fnName: 'maxXorPair',
    description: 'Given non-negative integers <code>nums</code>, return the maximum value of <code>nums[i] ^ nums[j]</code> for <code>0 &lt;= i &lt;= j &lt; n</code>.',
    constraints: ['1 <= nums.length <= 2 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 10, 5, 25, 2, 8]', output: '28' },
      { title: 'Test Case 2', input: 'nums = [14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]', output: '127' },
      { title: 'Test Case 3', input: 'nums = [0]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [8, 10, 2]', output: '10' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxXorPair(int[] nums) {
        int max = 0, mask = 0;
        for (int b = 30; b >= 0; b--) {
            mask |= (1 << b);
            Set<Integer> prefixes = new HashSet<>();
            for (int x : nums) prefixes.add(x & mask);
            int cand = max | (1 << b);
            for (int p : prefixes) {
                if (prefixes.contains(p ^ cand)) { max = cand; break; }
            }
        }
        return max;
    }
}`,
    pythonSolution: `def maxXorPair(nums):
    ans = mask = 0
    for b in range(30, -1, -1):
        mask |= (1 << b)
        prefixes = {x & mask for x in nums}
        cand = ans | (1 << b)
        if any((p ^ cand) in prefixes for p in prefixes):
            ans = cand
    return ans`
  },
  {
    number: 21,
    title: 'Minimum Cost to Connect Ropes/Wires',
    fnName: 'minSubarraySumAtLeastK',
    description: 'Given integer array <code>nums</code> (which may contain negative integers) and target <code>k</code>, return the length of the shortest non-empty contiguous subarray with sum <code>&gt;= k</code>, or <code>-1</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, -1, 2], k = 3', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 2], k = 4', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [84, -37, 32, 40, 95], k = 167', output: '3' },
      { title: 'Test Case 4', input: 'nums = [1], k = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minSubarraySumAtLeastK(int[] nums, int k) {
        int n = nums.length;
        long[] p = new long[n + 1];
        for (int i = 0; i < n; i++) p[i + 1] = p[i] + nums[i];
        Deque<Integer> dq = new ArrayDeque<>();
        int best = n + 1;
        for (int i = 0; i <= n; i++) {
            while (!dq.isEmpty() && p[i] - p[dq.peekFirst()] >= k) best = Math.min(best, i - dq.pollFirst());
            while (!dq.isEmpty() && p[i] <= p[dq.peekLast()]) dq.pollLast();
            dq.addLast(i);
        }
        return best <= n ? best : -1;
    }
}`,
    pythonSolution: `def minSubarraySumAtLeastK(nums, k):
    from collections import deque
    n = len(nums)
    p = [0] * (n + 1)
    for i, x in enumerate(nums): p[i + 1] = p[i] + x
    dq, best = deque(), n + 1
    for i in range(n + 1):
        while dq and p[i] - p[dq[0]] >= k:
            best = min(best, i - dq.popleft())
        while dq and p[i] <= p[dq[-1]]:
            dq.pop()
        dq.append(i)
    return best if best <= n else -1`
  },
  {
    number: 22,
    title: 'Maximum Number of Non-Overlapping Subarrays With Sum Target',
    fnName: 'maxNonOverlapTargetSubarrays',
    description: 'Given integer array <code>nums</code> and integer <code>target</code>, return the maximum number of non-empty non-overlapping subarrays whose sum equals <code>target</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 1, 1, 1], target = 2', output: '2' },
      { title: 'Test Case 2', input: 'nums = [-1, 3, 5, 1, 4, 2, -9], target = 6', output: '2' },
      { title: 'Test Case 3', input: 'nums = [0, 0, 0], target = 0', output: '3' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3], target = 10', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxNonOverlapTargetSubarrays(int[] nums, int target) {
        Set<Integer> seen = new HashSet<>();
        seen.add(0);
        int sum = 0, count = 0;
        for (int x : nums) {
            sum += x;
            if (seen.contains(sum - target)) {
                count++;
                seen.clear();
                seen.add(0);
                sum = 0;
            } else seen.add(sum);
        }
        return count;
    }
}`,
    pythonSolution: `def maxNonOverlapTargetSubarrays(nums, target):
    seen, s, count = {0}, 0, 0
    for x in nums:
        s += x
        if s - target in seen:
            count += 1; seen = {0}; s = 0
        else:
            seen.add(s)
    return count`
  },
  {
    number: 23,
    title: 'Count Subarrays Where Max Element Appears At Least K Times',
    fnName: 'countMaxAtLeastK',
    description: 'Given integer array <code>nums</code> and integer <code>k</code>, return the number of subarrays where the maximum element of <code>nums</code> appears at least <code>k</code> times in that subarray.',
    constraints: ['1 <= nums.length <= 10^5', '1 <= k <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 3, 2, 3, 3], k = 2', output: '6' },
      { title: 'Test Case 2', input: 'nums = [1, 4, 2, 1], k = 3', output: '0' },
      { title: 'Test Case 3', input: 'nums = [5, 5, 5], k = 1', output: '6' },
      { title: 'Test Case 4', input: 'nums = [2, 1, 2, 1, 2], k = 2', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static long countMaxAtLeastK(int[] nums, int k) {
        int mx = nums[0];
        for (int x : nums) mx = Math.max(mx, x);
        long ans = 0;
        int left = 0, cnt = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == mx) cnt++;
            while (cnt >= k) { if (nums[left++] == mx) cnt--; }
            ans += left;
        }
        return ans;
    }
}`,
    pythonSolution: `def countMaxAtLeastK(nums, k):
    mx = max(nums)
    ans = left = cnt = 0
    for x in nums:
        if x == mx: cnt += 1
        while cnt >= k:
            if nums[left] == mx: cnt -= 1
            left += 1
        ans += left
    return ans`
  },
  {
    number: 24,
    title: 'Minimum Operations to Make Binary Array All Ones',
    fnName: 'minKBitFlips',
    description: 'Given binary array <code>nums</code> and integer <code>k</code>, a k-bit flip chooses a subarray of length <code>k</code> and flips every bit. Return the minimum flips to make all elements <code>1</code>, or <code>-1</code>.',
    constraints: ['1 <= k <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [0, 1, 0], k = 1', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 1, 0], k = 2', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [0, 0, 0, 1, 0, 1, 1, 0], k = 3', output: '3' },
      { title: 'Test Case 4', input: 'nums = [1, 1, 1], k = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int minKBitFlips(int[] nums, int k) {
        int n = nums.length, flips = 0, cur = 0;
        int[] diff = new int[n + 1];
        for (int i = 0; i < n; i++) {
            cur ^= diff[i];
            if ((nums[i] ^ cur) == 0) {
                if (i + k > n) return -1;
                flips++; cur ^= 1; diff[i + k] ^= 1;
            }
        }
        return flips;
    }
}`,
    pythonSolution: `def minKBitFlips(nums, k):
    n = len(nums)
    diff = [0] * (n + 1)
    flips = cur = 0
    for i, x in enumerate(nums):
        cur ^= diff[i]
        if (x ^ cur) == 0:
            if i + k > n: return -1
            flips += 1; cur ^= 1; diff[i + k] ^= 1
    return flips`
  },
  {
    number: 25,
    title: 'Minimum Number of Swaps for K-Together',
    fnName: 'minSwapsBringKTogether',
    description: 'Given integer array <code>arr</code> and integer <code>k</code>, return the minimum number of swaps required to bring all elements <code>&lt;= k</code> together in any contiguous subarray.',
    constraints: ['1 <= arr.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [2, 1, 5, 6, 3], k = 3', output: '1' },
      { title: 'Test Case 2', input: 'arr = [2, 7, 9, 5, 8, 7, 4], k = 6', output: '2' },
      { title: 'Test Case 3', input: 'arr = [10, 20, 30], k = 5', output: '0' },
      { title: 'Test Case 4', input: 'arr = [1, 2, 3], k = 3', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int minSwapsBringKTogether(int[] arr, int k) {
        int cnt = 0;
        for (int x : arr) if (x <= k) cnt++;
        if (cnt <= 1) return 0;
        int bad = 0;
        for (int i = 0; i < cnt; i++) if (arr[i] > k) bad++;
        int best = bad;
        for (int i = cnt; i < arr.length; i++) {
            if (arr[i] > k) bad++;
            if (arr[i - cnt] > k) bad--;
            best = Math.min(best, bad);
        }
        return best;
    }
}`,
    pythonSolution: `def minSwapsBringKTogether(arr, k):
    cnt = sum(1 for x in arr if x <= k)
    if cnt <= 1: return 0
    bad = sum(1 for x in arr[:cnt] if x > k)
    best = bad
    for i in range(cnt, len(arr)):
        if arr[i] > k: bad += 1
        if arr[i - cnt] > k: bad -= 1
        best = min(best, bad)
    return best`
  },
  {
    number: 26,
    title: 'Shortest Path in Binary Matrix (8-Directional)',
    fnName: 'shortest8DirPath',
    description: 'Given an <code>n x n</code> binary matrix <code>grid</code>, return the length (number of visited cells) of the shortest clear path (<code>0</code>s) from <code>(0,0)</code> to <code>(n-1,n-1)</code> moving in 8 directions, or <code>-1</code>.',
    constraints: ['1 <= n <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 1], [1, 0]]', output: '2' },
      { title: 'Test Case 2', input: 'grid = [[0, 0, 0], [1, 1, 0], [1, 1, 0]]', output: '4' },
      { title: 'Test Case 3', input: 'grid = [[1, 0, 0], [1, 1, 0], [1, 1, 0]]', output: '-1' },
      { title: 'Test Case 4', input: 'grid = [[0]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int shortest8DirPath(int[][] grid) {
        int n = grid.length;
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) return -1;
        if (n == 1) return 1;
        Deque<int[]> q = new ArrayDeque<>();
        q.add(new int[]{0, 0, 1});
        grid[0][0] = 1;
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int dx = -1; dx <= 1; dx++) {
                for (int dy = -1; dy <= 1; dy++) {
                    int nx = cur[0] + dx, ny = cur[1] + dy;
                    if (nx >= 0 && ny >= 0 && nx < n && ny < n && grid[nx][ny] == 0) {
                        if (nx == n - 1 && ny == n - 1) return cur[2] + 1;
                        grid[nx][ny] = 1; q.add(new int[]{nx, ny, cur[2] + 1});
                    }
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `def shortest8DirPath(grid):
    from collections import deque
    n = len(grid)
    if grid[0][0] == 1 or grid[-1][-1] == 1: return -1
    if n == 1: return 1
    g = [row[:] for row in grid]
    g[0][0] = 1
    q = deque([(0, 0, 1)])
    while q:
        x, y, d = q.popleft()
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                nx, ny = x + dx, y + dy
                if 0 <= nx < n and 0 <= ny < n and g[nx][ny] == 0:
                    if nx == n - 1 and ny == n - 1: return d + 1
                    g[nx][ny] = 1; q.append((nx, ny, d + 1))
    return -1`
  },
  {
    number: 27,
    title: 'Maximum Number of Achievable Transfer Requests',
    fnName: 'maxBalancedTransfers',
    description: 'Given <code>n</code> buildings (0..n-1) and employee transfer requests <code>requests</code> <code>[from, to]</code>, return the maximum number of requests that can be fulfilled such that every building has net employee change 0.',
    constraints: ['1 <= n <= 20', '1 <= requests.length <= 16'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, requests = [[0,1],[1,0],[0,1],[1,2],[2,0],[3,4]]', output: '5' },
      { title: 'Test Case 2', input: 'n = 3, requests = [[0,0],[1,2],[2,1]]', output: '3' },
      { title: 'Test Case 3', input: 'n = 4, requests = [[0,3],[3,1],[1,2],[2,0]]', output: '4' },
      { title: 'Test Case 4', input: 'n = 2, requests = [[0,1]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxBalancedTransfers(int n, int[][] requests) {
        int m = requests.length, best = 0;
        for (int mask = 0; mask < (1 << m); mask++) {
            int bits = Integer.bitCount(mask);
            if (bits <= best) continue;
            int[] bal = new int[n];
            for (int i = 0; i < m; i++) {
                if ((mask & (1 << i)) != 0) { bal[requests[i][0]]--; bal[requests[i][1]]++; }
            }
            boolean ok = true;
            for (int b : bal) if (b != 0) { ok = false; break; }
            if (ok) best = bits;
        }
        return best;
    }
}`,
    pythonSolution: `def maxBalancedTransfers(n, requests):
    m, best = len(requests), 0
    for mask in range(1 << m):
        bits = mask.bit_count()
        if bits <= best: continue
        bal = [0] * n
        for i, (u, v) in enumerate(requests):
            if mask & (1 << i):
                bal[u] -= 1; bal[v] += 1
        if all(b == 0 for b in bal):
            best = bits
    return best`
  },
  {
    number: 28,
    title: 'Minimum Domino Rotations for Equal Row',
    fnName: 'minDominoFlips',
    description: 'Given two integer arrays <code>tops</code> and <code>bottoms</code>, in one rotation you can swap <code>tops[i]</code> and <code>bottoms[i]</code>. Return the minimum rotations so all values in <code>tops</code> or all values in <code>bottoms</code> are equal, or <code>-1</code>.',
    constraints: ['2 <= tops.length == bottoms.length <= 2 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'tops = [2, 1, 2, 4, 2, 2], bottoms = [5, 2, 6, 2, 3, 2]', output: '2' },
      { title: 'Test Case 2', input: 'tops = [3, 5, 1, 2, 3], bottoms = [3, 6, 3, 3, 4]', output: '-1' },
      { title: 'Test Case 3', input: 'tops = [1, 1, 1], bottoms = [2, 2, 2]', output: '0' },
      { title: 'Test Case 4', input: 'tops = [1, 2], bottoms = [2, 1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minDominoFlips(int[] tops, int[] bottoms) {
        int res = check(tops[0], tops, bottoms);
        if (res != -1 || tops[0] == bottoms[0]) return res;
        return check(bottoms[0], tops, bottoms);
    }
    private static int check(int target, int[] a, int[] b) {
        int rA = 0, rB = 0;
        for (int i = 0; i < a.length; i++) {
            if (a[i] != target && b[i] != target) return -1;
            if (a[i] != target) rA++;
            if (b[i] != target) rB++;
        }
        return Math.min(rA, rB);
    }
}`,
    pythonSolution: `def minDominoFlips(tops, bottoms):
    def check(x):
        ra = rb = 0
        for a, b in zip(tops, bottoms):
            if a != x and b != x: return -1
            if a != x: ra += 1
            if b != x: rb += 1
        return min(ra, rb)
    res = check(tops[0])
    if res != -1 or tops[0] == bottoms[0]: return res
    return check(bottoms[0])`
  },
  {
    number: 29,
    title: 'Smallest Sufficient Team Coverage',
    fnName: 'minDaysToEatOranges',
    description: 'A batch processor has <code>n</code> items. Each step you can clear 1 item, or clear <code>n/2</code> items if <code>n % 2 == 0</code>, or clear <code>2*(n/3)</code> items if <code>n % 3 == 0</code>. Return the minimum steps to clear all <code>n</code> items.',
    constraints: ['1 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 10', output: '4' },
      { title: 'Test Case 2', input: 'n = 6', output: '3' },
      { title: 'Test Case 3', input: 'n = 1', output: '1' },
      { title: 'Test Case 4', input: 'n = 56', output: '6' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    static Map<Integer, Integer> memo = new HashMap<>();
    public static int minDaysToEatOranges(int n) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        int res = 1 + Math.min(n % 2 + minDaysToEatOranges(n / 2), n % 3 + minDaysToEatOranges(n / 3));
        memo.put(n, res);
        return res;
    }
}`,
    pythonSolution: `def minDaysToEatOranges(n):
    from functools import lru_cache
    @lru_cache(None)
    def dp(x):
        if x <= 1: return x
        return 1 + min(x % 2 + dp(x // 2), x % 3 + dp(x // 3))
    return dp(n)`
  },
  {
    number: 30,
    title: 'Maximum Profit With Transaction Fee',
    fnName: 'maxProfitWithFee',
    description: 'Given daily stock prices <code>prices</code> and a per-sale transaction fee <code>fee</code>, you may complete as many buy-sell transactions as you like (at most 1 share held at a time). Return the maximum total profit.',
    constraints: ['1 <= prices.length <= 5 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [1, 3, 2, 8, 4, 9], fee = 2', output: '8' },
      { title: 'Test Case 2', input: 'prices = [1, 3, 7, 5, 10, 3], fee = 3', output: '6' },
      { title: 'Test Case 3', input: 'prices = [5, 4, 3, 2], fee = 1', output: '0' },
      { title: 'Test Case 4', input: 'prices = [10], fee = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxProfitWithFee(int[] prices, int fee) {
        int cash = 0, hold = -prices[0];
        for (int i = 1; i < prices.length; i++) {
            cash = Math.max(cash, hold + prices[i] - fee);
            hold = Math.max(hold, cash - prices[i]);
        }
        return cash;
    }
}`,
    pythonSolution: `def maxProfitWithFee(prices, fee):
    cash, hold = 0, -prices[0]
    for p in prices[1:]:
        cash = max(cash, hold + p - fee)
        hold = max(hold, cash - p)
    return cash`
  }
];
