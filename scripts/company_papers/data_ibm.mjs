export const IBM_QUESTIONS = [
  {
    number: 1,
    title: 'API Rate Limiter Sliding Window',
    fnName: 'filterAllowedRequests',
    description: 'An IBM Cloud API gateway allows at most <code>limit</code> requests per user within any <code>windowSec</code>-second inclusive window <code>[t - windowSec + 1, t]</code>. Given sorted request timestamps <code>timestamps</code> for a single user, return a boolean array indicating whether each request is allowed.',
    constraints: ['1 <= timestamps.length <= 10^5', 'timestamps is non-decreasing'],
    testCases: [
      { title: 'Test Case 1', input: 'timestamps = [1, 2, 3, 4, 5, 11], limit = 3, windowSec = 10', output: '[true, true, true, false, false, true]' },
      { title: 'Test Case 2', input: 'timestamps = [1, 1, 2, 2], limit = 2, windowSec = 5', output: '[true, true, false, false]' },
      { title: 'Test Case 3', input: 'timestamps = [10, 20, 30], limit = 1, windowSec = 10', output: '[true, true, true]' },
      { title: 'Test Case 4', input: 'timestamps = [5], limit = 1, windowSec = 1', output: '[true]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean[] filterAllowedRequests(int[] timestamps, int limit, int windowSec) {
        boolean[] res = new boolean[timestamps.length];
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < timestamps.length; i++) {
            int t = timestamps[i];
            while (!q.isEmpty() && q.peekFirst() <= t - windowSec) q.pollFirst();
            if (q.size() < limit) { q.addLast(t); res[i] = true; }
            else res[i] = false;
        }
        return res;
    }
}`,
    pythonSolution: `def filterAllowedRequests(timestamps, limit, windowSec):
    from collections import deque
    q, res = deque(), []
    for t in timestamps:
        while q and q[0] <= t - windowSec:
            q.popleft()
        if len(q) < limit:
            q.append(t)
            res.append(True)
        else:
            res.append(False)
    return res`
  },
  {
    number: 2,
    title: 'JSON Bracket Nesting Max Depth',
    fnName: 'maxJsonDepth',
    description: 'Given a valid JSON-like payload string <code>s</code> containing <code>{</code>, <code>}</code>, <code>[</code>, <code>]</code> and alphanumeric tokens, return the maximum nesting depth.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "{a:[1,{b:2}]}"', output: '3' },
      { title: 'Test Case 2', input: 's = "[]"', output: '1' },
      { title: 'Test Case 3', input: 's = "plain"', output: '0' },
      { title: 'Test Case 4', input: 's = "{{{{x}}}}"', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int maxJsonDepth(String s) {
        int cur = 0, best = 0;
        for (char c : s.toCharArray()) {
            if (c == '{' || c == '[') { cur++; best = Math.max(best, cur); }
            else if (c == '}' || c == ']') cur--;
        }
        return best;
    }
}`,
    pythonSolution: `def maxJsonDepth(s):
    cur = best = 0
    for c in s:
        if c in '{[':
            cur += 1
            best = max(best, cur)
        elif c in '}]':
            cur -= 1
    return best`
  },
  {
    number: 3,
    title: 'Minimum Bit Flips to Match Target Binary',
    fnName: 'minSegmentFlips',
    description: 'Start with a binary string of all <code>\'0\'</code>s of length <code>n</code>. In one operation you can flip all bits from index <code>i</code> to <code>n - 1</code>. Return the minimum operations needed to form <code>target</code>.',
    constraints: ['1 <= target.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'target = "10111"', output: '3' },
      { title: 'Test Case 2', input: 'target = "101"', output: '3' },
      { title: 'Test Case 3', input: 'target = "00000"', output: '0' },
      { title: 'Test Case 4', input: 'target = "1111"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minSegmentFlips(String target) {
        int flips = 0;
        char cur = '0';
        for (char c : target.toCharArray()) {
            if (c != cur) { flips++; cur = c; }
        }
        return flips;
    }
}`,
    pythonSolution: `def minSegmentFlips(target):
    flips, cur = 0, '0'
    for c in target:
        if c != cur:
            flips += 1
            cur = c
    return flips`
  },
  {
    number: 4,
    title: 'Cloud VM Bin Packing Minimum Hosts',
    fnName: 'minVmHosts',
    description: 'Given VM memory weights <code>weights</code> (sorted or unsorted) and host capacity <code>cap</code>, each host can hold at most 2 VMs whose combined weight is <code>&lt;= cap</code>. Return the minimum number of hosts needed.',
    constraints: ['1 <= weights.length <= 5 * 10^4', '1 <= weights[i] <= cap'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [3, 2, 2, 1], cap = 3', output: '3' },
      { title: 'Test Case 2', input: 'weights = [3, 5, 3, 4], cap = 5', output: '4' },
      { title: 'Test Case 3', input: 'weights = [1, 2], cap = 3', output: '1' },
      { title: 'Test Case 4', input: 'weights = [2, 2, 2, 2], cap = 4', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minVmHosts(int[] weights, int cap) {
        Arrays.sort(weights);
        int l = 0, r = weights.length - 1, hosts = 0;
        while (l <= r) {
            if (weights[l] + weights[r] <= cap) l++;
            r--;
            hosts++;
        }
        return hosts;
    }
}`,
    pythonSolution: `def minVmHosts(weights, cap):
    w = sorted(weights)
    l, r, hosts = 0, len(w) - 1, 0
    while l <= r:
        if w[l] + w[r] <= cap:
            l += 1
        r -= 1
        hosts += 1
    return hosts`
  },
  {
    number: 5,
    title: 'Most Frequent Error Log Pattern',
    fnName: 'mostFrequentServiceError',
    description: 'Given log entries <code>logs</code> formatted as <code>"SERVICE:CODE"</code>, return the service name with the highest count of non-200 errors (break ties lexicographically). If all are 200, return <code>"NONE"</code>.',
    constraints: ['1 <= logs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'logs = ["AUTH:500", "PAY:404", "AUTH:502", "PAY:200"]', output: 'AUTH' },
      { title: 'Test Case 2', input: 'logs = ["DB:200", "CACHE:200"]', output: 'NONE' },
      { title: 'Test Case 3', input: 'logs = ["Z:500", "A:500"]', output: 'A' },
      { title: 'Test Case 4', input: 'logs = ["API:503"]', output: 'API' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static String mostFrequentServiceError(String[] logs) {
        Map<String, Integer> cnt = new HashMap<>();
        for (String l : logs) {
            String[] p = l.split(":");
            if (!p[1].equals("200")) cnt.put(p[0], cnt.getOrDefault(p[0], 0) + 1);
        }
        if (cnt.isEmpty()) return "NONE";
        String best = null;
        int bestC = -1;
        for (Map.Entry<String, Integer> e : cnt.entrySet()) {
            if (e.getValue() > bestC || (e.getValue() == bestC && e.getKey().compareTo(best) < 0)) {
                best = e.getKey(); bestC = e.getValue();
            }
        }
        return best;
    }
}`,
    pythonSolution: `def mostFrequentServiceError(logs):
    from collections import Counter
    cnt = Counter()
    for l in logs:
        svc, code = l.split(':')
        if code != '200':
            cnt[svc] += 1
    if not cnt:
        return 'NONE'
    return min(cnt.keys(), key=lambda s: (-cnt[s], s))`
  },
  {
    number: 6,
    title: 'Minimum Adjacent Swaps to Separate Odd/Even',
    fnName: 'minParityGroupingSwaps',
    description: 'Given an array <code>nums</code>, return the minimum number of adjacent swaps needed to move all even numbers to the left and all odd numbers to the right (or all odd to left and even to right, whichever is smaller).',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 0, 1, 0, 1]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [2, 4, 1, 3]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3, 4]', output: '1' },
      { title: 'Test Case 4', input: 'nums = [7]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minParityGroupingSwaps(int[] nums) {
        long evenLeft = 0, oddLeft = 0, evens = 0, odds = 0;
        for (int x : nums) {
            if ((x & 1) == 0) { evenLeft += odds; evens++; }
            else { oddLeft += evens; odds++; }
        }
        return Math.min(evenLeft, oddLeft);
    }
}`,
    pythonSolution: `def minParityGroupingSwaps(nums):
    even_left = odd_left = evens = odds = 0
    for x in nums:
        if x % 2 == 0:
            even_left += odds
            evens += 1
        else:
            odd_left += evens
            odds += 1
    return min(even_left, odd_left)`
  },
  {
    number: 7,
    title: 'Kth Symbol in Binary Expansion Grammar',
    fnName: 'kthGrammarBit',
    description: 'Row 1 is <code>0</code>. Each subsequent row replaces <code>0</code> with <code>01</code> and <code>1</code> with <code>10</code>. Given <code>n</code> (1-indexed row) and <code>k</code> (1-indexed column), return the <code>k</code>-th bit in row <code>n</code>.',
    constraints: ['1 <= n <= 30', '1 <= k <= 2^(n-1)'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 1, k = 1', output: '0' },
      { title: 'Test Case 2', input: 'n = 2, k = 2', output: '1' },
      { title: 'Test Case 3', input: 'n = 4, k = 5', output: '1' },
      { title: 'Test Case 4', input: 'n = 3, k = 3', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int kthGrammarBit(int n, int k) {
        return Integer.bitCount(k - 1) & 1;
    }
}`,
    pythonSolution: `def kthGrammarBit(n, k):
    return (k - 1).bit_count() & 1`
  },
  {
    number: 8,
    title: 'Subarray Sum Divisible by K',
    fnName: 'countDivisibleSubarrays',
    description: 'Given integer array <code>nums</code> and positive integer <code>k</code>, return the number of contiguous non-empty subarrays whose sum is divisible by <code>k</code>.',
    constraints: ['1 <= nums.length <= 3 * 10^4', '1 <= k <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 5, 0, -2, -3, 1], k = 5', output: '7' },
      { title: 'Test Case 2', input: 'nums = [5], k = 9', output: '0' },
      { title: 'Test Case 3', input: 'nums = [5, 10, 15], k = 5', output: '6' },
      { title: 'Test Case 4', input: 'nums = [-1, 2, 9], k = 2', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countDivisibleSubarrays(int[] nums, int k) {
        int[] rem = new int[k];
        rem[0] = 1;
        int sum = 0, count = 0;
        for (int x : nums) {
            sum = ((sum + x) % k + k) % k;
            count += rem[sum];
            rem[sum]++;
        }
        return count;
    }
}`,
    pythonSolution: `def countDivisibleSubarrays(nums, k):
    rem = {0: 1}
    s = count = 0
    for x in nums:
        s = (s + x) % k
        count += rem.get(s, 0)
        rem[s] = rem.get(s, 0) + 1
    return count`
  },
  {
    number: 9,
    title: 'Roman Numeral Value Parser',
    fnName: 'romanToInteger',
    description: 'Convert a valid uppercase Roman numeral string <code>s</code> (between 1 and 3999) into its integer value.',
    constraints: ['1 <= s.length <= 15'],
    testCases: [
      { title: 'Test Case 1', input: 's = "MCMXCIV"', output: '1994' },
      { title: 'Test Case 2', input: 's = "LVIII"', output: '58' },
      { title: 'Test Case 3', input: 's = "IX"', output: '9' },
      { title: 'Test Case 4', input: 's = "MMMCMXCIX"', output: '3999' }
    ],
    javaSolution: `public class Solution {
    public static int romanToInteger(String s) {
        int[] val = new int[128];
        val['I']=1; val['V']=5; val['X']=10; val['L']=50; val['C']=100; val['D']=500; val['M']=1000;
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            int cur = val[s.charAt(i)];
            if (i + 1 < s.length() && cur < val[s.charAt(i + 1)]) total -= cur;
            else total += cur;
        }
        return total;
    }
}`,
    pythonSolution: `def romanToInteger(s):
    val = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    total = 0
    for i, c in enumerate(s):
        if i + 1 < len(s) and val[c] < val[s[i + 1]]:
            total -= val[c]
        else:
            total += val[c]
    return total`
  },
  {
    number: 10,
    title: 'Microservice Build Order (Topological Sort)',
    fnName: 'buildOrderCount',
    description: 'Given <code>n</code> services (0..n-1) and dependency edges <code>deps</code> where <code>[a, b]</code> means service <code>b</code> must build before <code>a</code>, return the number of services that can be built (if a cycle exists, return <code>-1</code>; otherwise return <code>n</code>).',
    constraints: ['1 <= n <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, deps = [[1, 0], [2, 0], [3, 1], [3, 2]]', output: '4' },
      { title: 'Test Case 2', input: 'n = 2, deps = [[0, 1], [1, 0]]', output: '-1' },
      { title: 'Test Case 3', input: 'n = 3, deps = []', output: '3' },
      { title: 'Test Case 4', input: 'n = 3, deps = [[0, 1], [1, 2], [2, 0]]', output: '-1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int buildOrderCount(int n, int[][] deps) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] d : deps) { g.get(d[1]).add(d[0]); indeg[d[0]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
        int built = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); built++;
            for (int v : g.get(u)) if (--indeg[v] == 0) q.add(v);
        }
        return built == n ? n : -1;
    }
}`,
    pythonSolution: `def buildOrderCount(n, deps):
    from collections import deque
    g = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in deps:
        g[b].append(a); indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    built = 0
    while q:
        u = q.popleft(); built += 1
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return n if built == n else -1`
  },
  {
    number: 11,
    title: 'Minimum Window Substring Containing All Flags',
    fnName: 'minWindowWithFlags',
    description: 'Given string <code>s</code> and pattern <code>t</code>, return the length of the shortest contiguous substring of <code>s</code> that contains every character of <code>t</code> (with multiplicity), or <code>0</code> if impossible.',
    constraints: ['1 <= s.length, t.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "ADOBECODEBANC", t = "ABC"', output: '4' },
      { title: 'Test Case 2', input: 's = "a", t = "a"', output: '1' },
      { title: 'Test Case 3', input: 's = "a", t = "aa"', output: '0' },
      { title: 'Test Case 4', input: 's = "aaflslflsldkalskaaa", t = "aaa"', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int minWindowWithFlags(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int req = t.length(), left = 0, best = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            if (need[s.charAt(right)]-- > 0) req--;
            while (req == 0) {
                best = Math.min(best, right - left + 1);
                if (++need[s.charAt(left++)] > 0) req++;
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}`,
    pythonSolution: `def minWindowWithFlags(s, t):
    from collections import Counter
    need = Counter(t)
    req = len(t)
    left = 0
    best = float('inf')
    for right, c in enumerate(s):
        if need[c] > 0:
            req -= 1
        need[c] -= 1
        while req == 0:
            best = min(best, right - left + 1)
            lc = s[left]
            need[lc] += 1
            if need[lc] > 0:
                req += 1
            left += 1
    return 0 if best == float('inf') else best`
  },
  {
    number: 12,
    title: 'Find All Anagram Start Indices',
    fnName: 'findAnagramIndices',
    description: 'Given lowercase strings <code>s</code> and <code>p</code>, return a sorted list of all start indices of <code>p</code>\'s anagrams in <code>s</code>.',
    constraints: ['1 <= s.length, p.length <= 3 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "cbaebabacd", p = "abc"', output: '[0, 6]' },
      { title: 'Test Case 2', input: 's = "abab", p = "ab"', output: '[0, 1, 2]' },
      { title: 'Test Case 3', input: 's = "hello", p = "world"', output: '[]' },
      { title: 'Test Case 4', input: 's = "aa", p = "aaa"', output: '[]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> findAnagramIndices(String s, String p) {
        List<Integer> res = new ArrayList<>();
        if (s.length() < p.length()) return res;
        int[] pc = new int[26], sc = new int[26];
        for (char c : p.toCharArray()) pc[c - 'a']++;
        int k = p.length();
        for (int i = 0; i < s.length(); i++) {
            sc[s.charAt(i) - 'a']++;
            if (i >= k) sc[s.charAt(i - k) - 'a']--;
            if (i >= k - 1 && Arrays.equals(pc, sc)) res.add(i - k + 1);
        }
        return res;
    }
}`,
    pythonSolution: `def findAnagramIndices(s, p):
    if len(s) < len(p):
        return []
    pc = [0] * 26
    sc = [0] * 26
    for c in p:
        pc[ord(c) - 97] += 1
    k, res = len(p), []
    for i, c in enumerate(s):
        sc[ord(c) - 97] += 1
        if i >= k:
            sc[ord(s[i - k]) - 97] -= 1
        if i >= k - 1 and pc == sc:
            res.append(i - k + 1)
    return res`
  },
  {
    number: 13,
    title: 'Maximum Frequency Stack Peak',
    fnName: 'processFreqStackOps',
    description: 'Simulate a frequency stack on integer array <code>ops</code>: positive integer <code>x</code> pushes <code>x</code>; <code>-1</code> pops and records the most frequent element (tie-breaking by most recent). Return the array of popped elements.',
    constraints: ['1 <= ops.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'ops = [5, 7, 5, 7, 4, 5, -1, -1, -1, -1]', output: '[5, 7, 5, 4]' },
      { title: 'Test Case 2', input: 'ops = [1, 2, 3, -1, -1]', output: '[3, 2]' },
      { title: 'Test Case 3', input: 'ops = [10, 10, -1, -1]', output: '[10, 10]' },
      { title: 'Test Case 4', input: 'ops = [4, 5, 4, -1, 5, -1]', output: '[4, 5]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> processFreqStackOps(int[] ops) {
        Map<Integer, Integer> freq = new HashMap<>();
        Map<Integer, Deque<Integer>> groups = new HashMap<>();
        int maxF = 0;
        List<Integer> res = new ArrayList<>();
        for (int op : ops) {
            if (op != -1) {
                int f = freq.getOrDefault(op, 0) + 1;
                freq.put(op, f);
                maxF = Math.max(maxF, f);
                groups.computeIfAbsent(f, z -> new ArrayDeque<>()).push(op);
            } else {
                int x = groups.get(maxF).pop();
                res.add(x);
                freq.put(x, freq.get(x) - 1);
                if (groups.get(maxF).isEmpty()) maxF--;
            }
        }
        return res;
    }
}`,
    pythonSolution: `def processFreqStackOps(ops):
    from collections import defaultdict
    freq, groups, max_f, res = defaultdict(int), defaultdict(list), 0, []
    for op in ops:
        if op != -1:
            freq[op] += 1
            f = freq[op]
            max_f = max(max_f, f)
            groups[f].append(op)
        else:
            x = groups[max_f].pop()
            res.append(x)
            freq[x] -= 1
            if not groups[max_f]:
                max_f -= 1
    return res`
  },
  {
    number: 14,
    title: 'Minimum Swaps to Balance Brackets',
    fnName: 'minSwapsBalanceBrackets',
    description: 'Given a string <code>s</code> of equal number of <code>[</code> and <code>]</code> brackets, return the minimum number of swaps between any two indices to make <code>s</code> balanced.',
    constraints: ['2 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "][]["', output: '1' },
      { title: 'Test Case 2', input: 's = "]]][[["', output: '2' },
      { title: 'Test Case 3', input: 's = "[]"', output: '0' },
      { title: 'Test Case 4', input: 's = "]]][[][["', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minSwapsBalanceBrackets(String s) {
        int bal = 0, maxUnmatched = 0;
        for (char c : s.toCharArray()) {
            if (c == '[') bal--;
            else bal++;
            maxUnmatched = Math.max(maxUnmatched, bal);
        }
        return (maxUnmatched + 1) / 2;
    }
}`,
    pythonSolution: `def minSwapsBalanceBrackets(s):
    bal = mx = 0
    for c in s:
        bal += 1 if c == ']' else -1
        if bal > mx:
            mx = bal
    return (mx + 1) // 2`
  },
  {
    number: 15,
    title: 'Find Peak Element in 2D Matrix',
    fnName: 'find2DPeakValue',
    description: 'Given an <code>m x n</code> matrix <code>mat</code> with distinct adjacent elements, find any peak cell (strictly greater than its 4 neighbors, assuming out-of-bounds is -1) and return its value.',
    constraints: ['1 <= m, n <= 200', '1 <= mat[i][j] <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2], [3, 4]]', output: '4' },
      { title: 'Test Case 2', input: 'mat = [[10, 20, 15], [21, 30, 14], [7, 16, 32]]', output: '30' },
      { title: 'Test Case 3', input: 'mat = [[42]]', output: '42' },
      { title: 'Test Case 4', input: 'mat = [[1, 2, 3, 4]]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int find2DPeakValue(int[][] mat) {
        int r = mat.length, c = mat[0].length, lo = 0, hi = c - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            int maxR = 0;
            for (int i = 0; i < r; i++) if (mat[i][mid] > mat[maxR][mid]) maxR = i;
            int left = mid > 0 ? mat[maxR][mid - 1] : -1;
            int right = mid + 1 < c ? mat[maxR][mid + 1] : -1;
            if (mat[maxR][mid] > left && mat[maxR][mid] > right) return mat[maxR][mid];
            if (right > mat[maxR][mid]) lo = mid + 1; else hi = mid - 1;
        }
        return -1;
    }
}`,
    pythonSolution: `def find2DPeakValue(mat):
    r, c = len(mat), len(mat[0])
    lo, hi = 0, c - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        mr = max(range(r), key=lambda i: mat[i][mid])
        lv = mat[mr][mid - 1] if mid > 0 else -1
        rv = mat[mr][mid + 1] if mid + 1 < c else -1
        if mat[mr][mid] > lv and mat[mr][mid] > rv:
            return mat[mr][mid]
        if rv > mat[mr][mid]:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`
  },
  {
    number: 16,
    title: 'Shortest Path With K Obstacles Removed',
    fnName: 'shortestPathWithDemolition',
    description: 'In an <code>m x n</code> grid <code>grid</code> (<code>0</code> empty, <code>1</code> wall), find the shortest path from <code>(0,0)</code> to <code>(m-1,n-1)</code> if you can eliminate at most <code>k</code> walls. Return <code>-1</code> if impossible.',
    constraints: ['1 <= m, n <= 40', '0 <= k <= m*n'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1', output: '6' },
      { title: 'Test Case 2', input: 'grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1', output: '-1' },
      { title: 'Test Case 3', input: 'grid = [[0]], k = 0', output: '0' },
      { title: 'Test Case 4', input: 'grid = [[0,1],[1,0]], k = 1', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int shortestPathWithDemolition(int[][] grid, int k) {
        int m = grid.length, n = grid[0].length;
        if (m == 1 && n == 1) return 0;
        int[][] bestK = new int[m][n];
        for (int[] row : bestK) Arrays.fill(row, -1);
        bestK[0][0] = k;
        Deque<int[]> q = new ArrayDeque<>();
        q.add(new int[]{0, 0, k, 0});
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int nx = cur[0] + d[0], ny = cur[1] + d[1];
                if (nx < 0 || ny < 0 || nx >= m || ny >= n) continue;
                int nk = cur[2] - grid[nx][ny];
                if (nk >= 0 && nk > bestK[nx][ny]) {
                    if (nx == m - 1 && ny == n - 1) return cur[3] + 1;
                    bestK[nx][ny] = nk;
                    q.add(new int[]{nx, ny, nk, cur[3] + 1});
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `def shortestPathWithDemolition(grid, k):
    from collections import deque
    m, n = len(grid), len(grid[0])
    if m == 1 and n == 1:
        return 0
    best_k = [[-1] * n for _ in range(m)]
    best_k[0][0] = k
    q = deque([(0, 0, k, 0)])
    while q:
        x, y, rem, d = q.popleft()
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < m and 0 <= ny < n:
                nrem = rem - grid[nx][ny]
                if nrem >= 0 and nrem > best_k[nx][ny]:
                    if nx == m - 1 and ny == n - 1:
                        return d + 1
                    best_k[nx][ny] = nrem
                    q.append((nx, ny, nrem, d + 1))
    return -1`
  },
  {
    number: 17,
    title: 'Maximum Alternating Subsequence Sum',
    fnName: 'maxAlternatingSum',
    description: 'Given positive integers <code>nums</code>, choose a subsequence <code>b</code> to maximize <code>b[0] - b[1] + b[2] - b[3] + ...</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 2, 5, 3]', output: '7' },
      { title: 'Test Case 2', input: 'nums = [5, 6, 7, 8]', output: '8' },
      { title: 'Test Case 3', input: 'nums = [6, 2, 1, 2, 4, 5]', output: '10' },
      { title: 'Test Case 4', input: 'nums = [10]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long maxAlternatingSum(int[] nums) {
        long even = 0, odd = 0;
        for (int x : nums) {
            long ne = Math.max(even, odd + x);
            long no = Math.max(odd, even - x);
            even = ne; odd = no;
        }
        return even;
    }
}`,
    pythonSolution: `def maxAlternatingSum(nums):
    even = odd = 0
    for x in nums:
        even, odd = max(even, odd + x), max(odd, even - x)
    return even`
  },
  {
    number: 18,
    title: 'Split Array Largest Subarray Sum',
    fnName: 'splitArrayMinMaxSum',
    description: 'Split integer array <code>nums</code> into <code>k</code> non-empty contiguous subarrays so that the largest sum among these <code>k</code> subarrays is minimized. Return that minimized largest sum.',
    constraints: ['1 <= k <= nums.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [7, 2, 5, 10, 8], k = 2', output: '18' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 4, 5], k = 2', output: '9' },
      { title: 'Test Case 3', input: 'nums = [1, 4, 4], k = 3', output: '4' },
      { title: 'Test Case 4', input: 'nums = [10, 20, 30], k = 1', output: '60' }
    ],
    javaSolution: `public class Solution {
    public static int splitArrayMinMaxSum(int[] nums, int k) {
        int lo = 0, hi = 0;
        for (int x : nums) { lo = Math.max(lo, x); hi += x; }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int parts = 1, cur = 0;
            for (int x : nums) {
                if (cur + x > mid) { parts++; cur = 0; }
                cur += x;
            }
            if (parts <= k) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def splitArrayMinMaxSum(nums, k):
    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        parts, cur = 1, 0
        for x in nums:
            if cur + x > mid:
                parts += 1
                cur = 0
            cur += x
        if parts <= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },
  {
    number: 19,
    title: 'Accounts Merge by Shared Email',
    fnName: 'countMergedUsers',
    description: 'Given <code>accounts</code> where each element is a list of emails belonging to one login profile, two profiles belong to the same user if they share at least one email. Return the total number of distinct users after merging.',
    constraints: ['1 <= accounts.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'accounts = [["a@x", "b@x"], ["b@x", "c@x"], ["d@x"]]', output: '2' },
      { title: 'Test Case 2', input: 'accounts = [["a@x"], ["b@x"], ["c@x"]]', output: '3' },
      { title: 'Test Case 3', input: 'accounts = [["1@a", "2@a"], ["3@a", "4@a"], ["2@a", "3@a"]]', output: '1' },
      { title: 'Test Case 4', input: 'accounts = [["solo@ibm.com"]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countMergedUsers(String[][] accounts) {
        int n = accounts.length;
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        Map<String, Integer> owner = new HashMap<>();
        int comps = n;
        for (int i = 0; i < n; i++) {
            for (String email : accounts[i]) {
                if (owner.containsKey(email)) {
                    int r1 = find(p, i), r2 = find(p, owner.get(email));
                    if (r1 != r2) { p[r1] = r2; comps--; }
                } else owner.put(email, i);
            }
        }
        return comps;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def countMergedUsers(accounts):
    n = len(accounts)
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x
    owner, comps = {}, n
    for i, acc in enumerate(accounts):
        for email in acc:
            if email in owner:
                r1, r2 = find(i), find(owner[email])
                if r1 != r2:
                    p[r1] = r2
                    comps -= 1
            else:
                owner[email] = i
    return comps`
  },
  {
    number: 20,
    title: 'Minimum Cost to Connect All Coordinates',
    fnName: 'minManhattanSpanningCost',
    description: 'Given 2D points <code>points</code> <code>[x, y]</code>, the cost of connecting two points is their Manhattan distance <code>|x1 - x2| + |y1 - y2|</code>. Return the minimum total cost to connect all points.',
    constraints: ['1 <= points.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'points = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]', output: '20' },
      { title: 'Test Case 2', input: 'points = [[3, 12], [-2, 5], [-4, 1]]', output: '18' },
      { title: 'Test Case 3', input: 'points = [[0, 0]]', output: '0' },
      { title: 'Test Case 4', input: 'points = [[0, 0], [1, 1], [1, 0], [-1, 1]]', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minManhattanSpanningCost(int[][] points) {
        int n = points.length;
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        boolean[] vis = new boolean[n];
        dist[0] = 0;
        int total = 0;
        for (int step = 0; step < n; step++) {
            int u = -1;
            for (int i = 0; i < n; i++) if (!vis[i] && (u == -1 || dist[i] < dist[u])) u = i;
            vis[u] = true;
            total += dist[u];
            for (int v = 0; v < n; v++) {
                if (!vis[v]) {
                    int d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
                    dist[v] = Math.min(dist[v], d);
                }
            }
        }
        return total;
    }
}`,
    pythonSolution: `def minManhattanSpanningCost(points):
    n = len(points)
    dist = [float('inf')] * n
    vis = [False] * n
    dist[0] = 0
    total = 0
    for _ in range(n):
        u = min((i for i in range(n) if not vis[i]), key=lambda i: dist[i])
        vis[u] = True
        total += dist[u]
        x1, y1 = points[u]
        for v in range(n):
            if not vis[v]:
                d = abs(x1 - points[v][0]) + abs(y1 - points[v][1])
                if d < dist[v]:
                    dist[v] = d
    return total`
  },
  {
    number: 21,
    title: 'Maximum Sum of Distinct Subarrays of Length K',
    fnName: 'maxDistinctSubarraySumK',
    description: 'Given integer array <code>nums</code> and integer <code>k</code>, return the maximum sum of any contiguous subarray of length <code>k</code> whose elements are all distinct, or <code>0</code> if none exists.',
    constraints: ['1 <= k <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 5, 4, 2, 9, 9, 9], k = 3', output: '15' },
      { title: 'Test Case 2', input: 'nums = [4, 4, 4], k = 3', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3, 4], k = 2', output: '7' },
      { title: 'Test Case 4', input: 'nums = [9, 9, 1, 2, 3], k = 3', output: '12' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long maxDistinctSubarraySumK(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        long sum = 0, best = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            cnt.put(nums[i], cnt.getOrDefault(nums[i], 0) + 1);
            if (i >= k) {
                int out = nums[i - k];
                sum -= out;
                if (cnt.get(out) == 1) cnt.remove(out);
                else cnt.put(out, cnt.get(out) - 1);
            }
            if (i >= k - 1 && cnt.size() == k) best = Math.max(best, sum);
        }
        return best;
    }
}`,
    pythonSolution: `def maxDistinctSubarraySumK(nums, k):
    from collections import defaultdict
    cnt = defaultdict(int)
    s = best = 0
    for i, x in enumerate(nums):
        s += x
        cnt[x] += 1
        if i >= k:
            out = nums[i - k]
            s -= out
            cnt[out] -= 1
            if cnt[out] == 0:
                del cnt[out]
        if i >= k - 1 and len(cnt) == k:
            best = max(best, s)
    return best`
  },
  {
    number: 22,
    title: 'Minimum Operations to Make Array Strictly Increasing',
    fnName: 'minOpsStrictlyIncreasing',
    description: 'Given integer array <code>nums</code>, in one operation you can increment any element by 1. Return the minimum operations to make <code>nums</code> strictly increasing.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 1]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 5, 2, 4, 1]', output: '14' },
      { title: 'Test Case 3', input: 'nums = [8]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3, 4]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minOpsStrictlyIncreasing(int[] nums) {
        long ops = 0;
        int prev = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] <= prev) {
                ops += (prev + 1 - nums[i]);
                prev = prev + 1;
            } else prev = nums[i];
        }
        return ops;
    }
}`,
    pythonSolution: `def minOpsStrictlyIncreasing(nums):
    ops, prev = 0, nums[0]
    for x in nums[1:]:
        if x <= prev:
            ops += prev + 1 - x
            prev += 1
        else:
            prev = x
    return ops`
  },
  {
    number: 23,
    title: 'Maximum Number of Events That Can Be Attended',
    fnName: 'maxEventsAttended',
    description: 'Given events <code>events</code> <code>[startDay, endDay]</code>, you can attend at most one event per day (on any day <code>d</code> with <code>startDay &lt;= d &lt;= endDay</code>). Return the maximum number of events you can attend.',
    constraints: ['1 <= events.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'events = [[1, 2], [2, 3], [3, 4]]', output: '3' },
      { title: 'Test Case 2', input: 'events = [[1, 2], [2, 3], [3, 4], [1, 2]]', output: '4' },
      { title: 'Test Case 3', input: 'events = [[1, 1], [1, 1], [1, 1]]', output: '1' },
      { title: 'Test Case 4', input: 'events = [[1, 4], [4, 4], [2, 2], [3, 4], [1, 1]]', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxEventsAttended(int[][] events) {
        Arrays.sort(events, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        int i = 0, day = 0, ans = 0, n = events.length;
        while (i < n || !pq.isEmpty()) {
            if (pq.isEmpty()) day = events[i][0];
            while (i < n && events[i][0] <= day) pq.add(events[i++][1]);
            pq.poll(); ans++; day++;
            while (!pq.isEmpty() && pq.peek() < day) pq.poll();
        }
        return ans;
    }
}`,
    pythonSolution: `def maxEventsAttended(events):
    import heapq
    ev = sorted(events)
    pq, i, day, ans, n = [], 0, 0, 0, len(ev)
    while i < n or pq:
        if not pq:
            day = ev[i][0]
        while i < n and ev[i][0] <= day:
            heapq.heappush(pq, ev[i][1]); i += 1
        heapq.heappop(pq); ans += 1; day += 1
        while pq and pq[0] < day:
            heapq.heappop(pq)
    return ans`
  },
  {
    number: 24,
    title: 'Number of Subsequences Satisfying Sum Bound',
    fnName: 'countBoundedSubseqs',
    description: 'Given positive integers <code>nums</code> and <code>target</code>, return the number of non-empty subsequences such that <code>min(subseq) + max(subseq) &lt;= target</code>, modulo <code>10^9 + 7</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 5, 6, 7], target = 9', output: '4' },
      { title: 'Test Case 2', input: 'nums = [3, 3, 6, 8], target = 10', output: '6' },
      { title: 'Test Case 3', input: 'nums = [2, 3, 3, 4, 6, 7], target = 12', output: '61' },
      { title: 'Test Case 4', input: 'nums = [10], target = 5', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countBoundedSubseqs(int[] nums, int target) {
        int MOD = 1_000_000_007, n = nums.length;
        Arrays.sort(nums);
        int[] pow2 = new int[n];
        pow2[0] = 1;
        for (int i = 1; i < n; i++) pow2[i] = (pow2[i - 1] * 2) % MOD;
        int l = 0, r = n - 1, ans = 0;
        while (l <= r) {
            if (nums[l] + nums[r] <= target) { ans = (ans + pow2[r - l]) % MOD; l++; }
            else r--;
        }
        return ans;
    }
}`,
    pythonSolution: `def countBoundedSubseqs(nums, target):
    MOD = 10**9 + 7
    a = sorted(nums)
    l, r, ans = 0, len(a) - 1, 0
    while l <= r:
        if a[l] + a[r] <= target:
            ans = (ans + pow(2, r - l, MOD)) % MOD
            l += 1
        else:
            r -= 1
    return ans`
  },
  {
    number: 25,
    title: 'Minimum Cost to Make All Characters Equal',
    fnName: 'minCostUniformBinary',
    description: 'Given binary string <code>s</code>, you can either flip prefix <code>0..i</code> for cost <code>i + 1</code> or suffix <code>i..n-1</code> for cost <code>n - i</code>. Return the minimum cost to make all characters equal.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "0011"', output: '2' },
      { title: 'Test Case 2', input: 's = "010101"', output: '9' },
      { title: 'Test Case 3', input: 's = "111"', output: '0' },
      { title: 'Test Case 4', input: 's = "10"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long minCostUniformBinary(String s) {
        long cost = 0;
        int n = s.length();
        for (int i = 1; i < n; i++) {
            if (s.charAt(i) != s.charAt(i - 1)) cost += Math.min(i, n - i);
        }
        return cost;
    }
}`,
    pythonSolution: `def minCostUniformBinary(s):
    n = len(s)
    return sum(min(i, n - i) for i in range(1, n) if s[i] != s[i - 1])`
  },
  {
    number: 26,
    title: 'Koko-Style Minimum Server Bandwidth',
    fnName: 'minBandwidthCapacity',
    description: 'Given job data sizes <code>jobs</code> (in MB) and maximum allowed seconds <code>maxSec</code>, each second a server processes at most 1 job up to bandwidth <code>B</code> MB/s (taking <code>ceil(jobs[i]/B)</code> seconds). Find minimum <code>B</code>.',
    constraints: ['1 <= jobs.length <= maxSec <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'jobs = [10, 20, 30], maxSec = 6', output: '10' },
      { title: 'Test Case 2', input: 'jobs = [10, 20, 30], maxSec = 3', output: '30' },
      { title: 'Test Case 3', input: 'jobs = [5, 5, 5], maxSec = 5', output: '5' },
      { title: 'Test Case 4', input: 'jobs = [100], maxSec = 4', output: '25' }
    ],
    javaSolution: `public class Solution {
    public static int minBandwidthCapacity(int[] jobs, int maxSec) {
        int lo = 1, hi = 0;
        for (int j : jobs) hi = Math.max(hi, j);
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            long sec = 0;
            for (int j : jobs) sec += (j + mid - 1) / mid;
            if (sec <= maxSec) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def minBandwidthCapacity(jobs, maxSec):
    lo, hi = 1, max(jobs)
    while lo < hi:
        mid = (lo + hi) // 2
        if sum((j + mid - 1) // mid for j in jobs) <= maxSec:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },
  {
    number: 27,
    title: 'Longest Turbulent Subarray',
    fnName: 'longestTurbulentSpan',
    description: 'An array is turbulent if comparisons between adjacent elements strictly alternate between <code>&lt;</code> and <code>&gt;</code>. Return the maximum length of a turbulent contiguous subarray of <code>arr</code>.',
    constraints: ['1 <= arr.length <= 4 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [9, 4, 2, 10, 7, 8, 8, 1, 9]', output: '5' },
      { title: 'Test Case 2', input: 'arr = [4, 8, 12, 16]', output: '2' },
      { title: 'Test Case 3', input: 'arr = [100]', output: '1' },
      { title: 'Test Case 4', input: 'arr = [5, 5, 5]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestTurbulentSpan(int[] arr) {
        int inc = 1, dec = 1, best = 1;
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > arr[i - 1]) { inc = dec + 1; dec = 1; }
            else if (arr[i] < arr[i - 1]) { dec = inc + 1; inc = 1; }
            else { inc = 1; dec = 1; }
            best = Math.max(best, Math.max(inc, dec));
        }
        return best;
    }
}`,
    pythonSolution: `def longestTurbulentSpan(arr):
    inc = dec = best = 1
    for i in range(1, len(arr)):
        if arr[i] > arr[i - 1]:
            inc, dec = dec + 1, 1
        elif arr[i] < arr[i - 1]:
            dec, inc = inc + 1, 1
        else:
            inc = dec = 1
        best = max(best, inc, dec)
    return best`
  },
  {
    number: 28,
    title: 'Word Break II Count Ways',
    fnName: 'countWordBreakWays',
    description: 'Given string <code>s</code> and dictionary <code>words</code>, return the number of distinct ways to segment <code>s</code> into dictionary words (modulo <code>10^9 + 7</code>).',
    constraints: ['1 <= s.length <= 200', '1 <= words.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 's = "catsanddog", words = ["cat", "cats", "and", "sand", "dog"]', output: '2' },
      { title: 'Test Case 2', input: 's = "pineapplepenapple", words = ["apple", "pen", "applepen", "pine", "pineapple"]', output: '3' },
      { title: 'Test Case 3', input: 's = "catsandog", words = ["cats", "dog", "sand", "and", "cat"]', output: '0' },
      { title: 'Test Case 4', input: 's = "aa", words = ["a", "aa"]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countWordBreakWays(String s, String[] words) {
        int MOD = 1_000_000_007, n = s.length();
        Set<String> set = new HashSet<>(Arrays.asList(words));
        int[] dp = new int[n + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] > 0 && set.contains(s.substring(j, i))) {
                    dp[i] = (dp[i] + dp[j]) % MOD;
                }
            }
        }
        return dp[n];
    }
}`,
    pythonSolution: `def countWordBreakWays(s, words):
    MOD = 10**9 + 7
    wset = set(words)
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in wset:
                dp[i] = (dp[i] + dp[j]) % MOD
    return dp[n]`
  },
  {
    number: 29,
    title: 'Cheapest Flights Within K Hops',
    fnName: 'cheapestRouteKHops',
    description: 'Given <code>n</code> cities (0..n-1), directed flights <code>flights</code> <code>[from, to, price]</code>, source <code>src</code>, destination <code>dst</code>, and max stops <code>k</code>, return the cheapest price with at most <code>k</code> intermediate stops, or <code>-1</code>.',
    constraints: ['1 <= n <= 100', '0 <= k < n'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1', output: '700' },
      { title: 'Test Case 2', input: 'n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1', output: '200' },
      { title: 'Test Case 3', input: 'n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0', output: '500' },
      { title: 'Test Case 4', input: 'n = 3, flights = [[0,1,100]], src = 0, dst = 2, k = 1', output: '-1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int cheapestRouteKHops(int n, int[][] flights, int src, int dst, int k) {
        int INF = 1_000_000_000;
        int[] dist = new int[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;
        for (int i = 0; i <= k; i++) {
            int[] next = dist.clone();
            for (int[] f : flights) {
                if (dist[f[0]] < INF) next[f[1]] = Math.min(next[f[1]], dist[f[0]] + f[2]);
            }
            dist = next;
        }
        return dist[dst] >= INF ? -1 : dist[dst];
    }
}`,
    pythonSolution: `def cheapestRouteKHops(n, flights, src, dst, k):
    INF = 10**9
    dist = [INF] * n
    dist[src] = 0
    for _ in range(k + 1):
        nxt = dist[:]
        for u, v, w in flights:
            if dist[u] + w < nxt[v]:
                nxt[v] = dist[u] + w
        dist = nxt
    return -1 if dist[dst] >= INF else dist[dst]`
  },
  {
    number: 30,
    title: 'Maximum Score From Removing Substrings',
    fnName: 'maxSubstringRemovalScore',
    description: 'Given string <code>s</code>, you can remove <code>"ab"</code> for <code>x</code> points or <code>"ba"</code> for <code>y</code> points repeatedly. Return the maximum total points obtainable.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "cdbcbbaaabab", x = 4, y = 5', output: '19' },
      { title: 'Test Case 2', input: 's = "aabbaaxybbaabb", x = 5, y = 4', output: '20' },
      { title: 'Test Case 3', input: 's = "ab", x = 10, y = 5', output: '10' },
      { title: 'Test Case 4', input: 's = "xyz", x = 5, y = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxSubstringRemovalScore(String s, int x, int y) {
        char first = x >= y ? 'a' : 'b', second = x >= y ? 'b' : 'a';
        int hi = Math.max(x, y), lo = Math.min(x, y), score = 0;
        StringBuilder st1 = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == second && st1.length() > 0 && st1.charAt(st1.length() - 1) == first) {
                st1.deleteCharAt(st1.length() - 1); score += hi;
            } else st1.append(c);
        }
        StringBuilder st2 = new StringBuilder();
        for (int i = 0; i < st1.length(); i++) {
            char c = st1.charAt(i);
            if (c == first && st2.length() > 0 && st2.charAt(st2.length() - 1) == second) {
                st2.deleteCharAt(st2.length() - 1); score += lo;
            } else st2.append(c);
        }
        return score;
    }
}`,
    pythonSolution: `def maxSubstringRemovalScore(s, x, y):
    a, b = ('a', 'b') if x >= y else ('b', 'a')
    hi, lo = max(x, y), min(x, y)
    score, st1 = 0, []
    for c in s:
        if c == b and st1 and st1[-1] == a:
            st1.pop(); score += hi
        else:
            st1.append(c)
    st2 = []
    for c in st1:
        if c == a and st2 and st2[-1] == b:
            st2.pop(); score += lo
        else:
            st2.append(c)
    return score`
  }
];
