export const PERSISTENT_QUESTIONS = [
  {
    number: 1,
    title: 'Martian Sprint Velocity Check',
    fnName: 'countTargetSprints',
    description: 'In Persistent Systems Martian hiring, given sprint story points <code>pts</code>, count how many sprints achieved at least <code>goal</code> points.',
    constraints: ['1 <= pts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pts = [18, 25, 30, 12], goal = 20', output: '2' },
      { title: 'Test Case 2', input: 'pts = [5, 10], goal = 15', output: '0' },
      { title: 'Test Case 3', input: 'pts = [20], goal = 20', output: '1' },
      { title: 'Test Case 4', input: 'pts = [0, 30], goal = 1', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countTargetSprints(int[] pts, int goal) {
        int cnt = 0;
        for (int p : pts) if (p >= goal) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countTargetSprints(pts, goal):
    return sum(1 for p in pts if p >= goal)`
  },
  {
    number: 2,
    title: 'Tree Leaf Node Sum',
    fnName: 'sumLeafNodeValues',
    description: 'Given a tree of <code>n</code> nodes (0..n-1) with <code>parent[i]</code> (<code>-1</code> for root) and node values <code>vals[i]</code>, return the sum of <code>vals[i]</code> for all leaf nodes (nodes with no children).',
    constraints: ['1 <= parent.length == vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 0, 1], vals = [10, 20, 30, 40]', output: '70' },
      { title: 'Test Case 2', input: 'parent = [-1], vals = [5]', output: '5' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 1, 2], vals = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 4', input: 'parent = [-1, 0, 0], vals = [10, 5, 5]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long sumLeafNodeValues(int[] parent, int[] vals) {
        int n = parent.length;
        boolean[] hasChild = new boolean[n];
        for (int p : parent) if (p != -1) hasChild[p] = true;
        long sum = 0;
        for (int i = 0; i < n; i++) if (!hasChild[i]) sum += vals[i];
        return sum;
    }
}`,
    pythonSolution: `def sumLeafNodeValues(parent, vals):
    pars = {p for p in parent if p != -1}
    return sum(vals[i] for i in range(len(parent)) if i not in pars)`
  },
  {
    number: 3,
    title: 'Graph Connected Islands Count',
    fnName: 'countGraphComponents',
    description: 'Given <code>n</code> vertices (0..n-1) and undirected edges <code>edges</code> <code>[u, v]</code>, return the number of connected components.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, edges = [[0, 1], [1, 2], [3, 4]]', output: '2' },
      { title: 'Test Case 2', input: 'n = 4, edges = []', output: '4' },
      { title: 'Test Case 3', input: 'n = 3, edges = [[0, 1], [1, 2]]', output: '1' },
      { title: 'Test Case 4', input: 'n = 1, edges = []', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countGraphComponents(int n, int[][] edges) {
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        int comp = n;
        for (int[] e : edges) {
            int ru = find(p, e[0]), rv = find(p, e[1]);
            if (ru != rv) { p[ru] = rv; comp--; }
        }
        return comp;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def countGraphComponents(n, edges):
    p = list(range(n))
    def find(x):
        while p[x] != x: p[x] = p[p[x]]; x = p[x]
        return x
    comp = n
    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv: p[ru] = rv; comp -= 1
    return comp`
  },
  {
    number: 4,
    title: 'Hash Frequency Mode Value',
    fnName: 'mostFrequentValue',
    description: 'Given integer array <code>nums</code>, return the most frequent integer (smallest on tie).',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 1, 2, 1, 3]', output: '1' },
      { title: 'Test Case 2', input: 'nums = [5]', output: '5' },
      { title: 'Test Case 3', input: 'nums = [4, 4, 2]', output: '4' },
      { title: 'Test Case 4', input: 'nums = [9, 8, 7]', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int mostFrequentValue(int[] nums) {
        Map<Integer, Integer> f = new HashMap<>();
        int bestV = nums[0], bestC = 0;
        for (int x : nums) {
            int c = f.getOrDefault(x, 0) + 1;
            f.put(x, c);
            if (c > bestC || (c == bestC && x < bestV)) { bestC = c; bestV = x; }
        }
        return bestV;
    }
}`,
    pythonSolution: `from collections import Counter
def mostFrequentValue(nums):
    c = Counter(nums)
    return min(c.keys(), key=lambda x: (-c[x], x))`
  },
  {
    number: 5,
    title: 'Character Frequency Matching',
    fnName: 'canFormTargetWord',
    description: 'Return <code>true</code> if lowercase string <code>pool</code> contains enough characters (in any order) to build <code>target</code>, else <code>false</code>.',
    constraints: ['1 <= pool.length, target.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pool = "persistent", target = "sent"', output: 'true' },
      { title: 'Test Case 2', input: 'pool = "abc", target = "aabc"', output: 'false' },
      { title: 'Test Case 3', input: 'pool = "z", target = "z"', output: 'true' },
      { title: 'Test Case 4', input: 'pool = "hello", target = "world"', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean canFormTargetWord(String pool, String target) {
        int[] cnt = new int[26];
        for (int i = 0; i < pool.length(); i++) cnt[pool.charAt(i) - 'a']++;
        for (int i = 0; i < target.length(); i++) if (--cnt[target.charAt(i) - 'a'] < 0) return false;
        return true;
    }
}`,
    pythonSolution: `from collections import Counter
def canFormTargetWord(pool, target):
    cp, ct = Counter(pool), Counter(target)
    return all(cp[k] >= v for k, v in ct.items())`
  },
  {
    number: 6,
    title: 'Pair Sum Modulo K Count',
    fnName: 'countModKPairs',
    description: 'Given non-negative integers <code>nums</code> and positive integer <code>k</code>, count pairs <code>(i, j)</code> with <code>i < j</code> and <code>(nums[i] + nums[j]) % k == 0</code>.',
    constraints: ['1 <= nums.length <= 10^5', '1 <= k <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 4, 5], k = 3', output: '4' },
      { title: 'Test Case 2', input: 'nums = [2, 2, 2], k = 2', output: '3' },
      { title: 'Test Case 3', input: 'nums = [1, 1], k = 3', output: '0' },
      { title: 'Test Case 4', input: 'nums = [5], k = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countModKPairs(int[] nums, int k) {
        long[] rem = new long[k];
        long ans = 0;
        for (int x : nums) {
            int r = ((x % k) + k) % k;
            int need = (k - r) % k;
            ans += rem[need];
            rem[r]++;
        }
        return ans;
    }
}`,
    pythonSolution: `def countModKPairs(nums, k):
    rem = [0] * k; ans = 0
    for x in nums:
        r = x % k
        ans += rem[(k - r) % k]
        rem[r] += 1
    return ans`
  },
  {
    number: 7,
    title: 'Binary Search First Greater Equal',
    fnName: 'lowerBoundIndex',
    description: 'Given sorted array <code>nums</code> and <code>target</code>, return the smallest index <code>i</code> with <code>nums[i] >= target</code>, or <code>nums.length</code> if all elements are smaller.',
    constraints: ['0 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 3, 5, 7], target = 4', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 3, 5], target = 10', output: '3' },
      { title: 'Test Case 3', input: 'nums = [2, 2, 2], target = 2', output: '0' },
      { title: 'Test Case 4', input: 'nums = [], target = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int lowerBoundIndex(int[] nums, int target) {
        int l = 0, r = nums.length;
        while (l < r) { int m = (l + r) / 2; if (nums[m] < target) l = m + 1; else r = m; }
        return l;
    }
}`,
    pythonSolution: `import bisect
def lowerBoundIndex(nums, target):
    return bisect.bisect_left(nums, target)`
  },
  {
    number: 8,
    title: 'Maximum Subarray Sum Non-Empty',
    fnName: 'maxContiguousSum',
    description: 'Return the maximum sum of any non-empty contiguous subarray in <code>nums</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6' },
      { title: 'Test Case 2', input: 'nums = [-4, -2, -7]', output: '-2' },
      { title: 'Test Case 3', input: 'nums = [5, 10]', output: '15' },
      { title: 'Test Case 4', input: 'nums = [8]', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static long maxContiguousSum(int[] nums) {
        long cur = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) { cur = Math.max(nums[i], cur + nums[i]); best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxContiguousSum(nums):
    cur = best = nums[0]
    for x in nums[1:]: cur = max(x, cur + x); best = max(best, cur)
    return best`
  },
  {
    number: 9,
    title: 'Shortest Path Unweighted Graph',
    fnName: 'shortestHopCount',
    description: 'Given <code>n</code> nodes and undirected edges <code>edges</code> <code>[u, v]</code>, return shortest path length from <code>0</code> to <code>n - 1</code>, or <code>-1</code>.',
    constraints: ['2 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0, 1], [1, 2], [2, 3], [0, 3]]', output: '1' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1]]', output: '-1' },
      { title: 'Test Case 3', input: 'n = 3, edges = [[0, 1], [1, 2]]', output: '2' },
      { title: 'Test Case 4', input: 'n = 2, edges = [[0, 1]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int shortestHopCount(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        int[] dist = new int[n]; Arrays.fill(dist, -1); dist[0] = 0;
        Queue<Integer> q = new ArrayDeque<>(); q.add(0);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g.get(u)) if (dist[v] == -1) {
                dist[v] = dist[u] + 1; if (v == n - 1) return dist[v]; q.add(v);
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque
def shortestHopCount(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges: g[u].append(v); g[v].append(u)
    dist = [-1] * n; dist[0] = 0; q = deque([0])
    while q:
        u = q.popleft()
        for v in g[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                if v == n - 1: return dist[v]
                q.append(v)
    return -1`
  },
  {
    number: 10,
    title: 'Balanced Bracket Minimum Fixes',
    fnName: 'minSwapsOrAddsToBalance',
    description: 'Given a string <code>s</code> of <code>\'(\'</code> and <code>\')\'</code>, return minimum single-character insertions needed to make <code>s</code> balanced.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "())"', output: '1' },
      { title: 'Test Case 2', input: 's = "((("', output: '3' },
      { title: 'Test Case 3', input: 's = "()()"', output: '0' },
      { title: 'Test Case 4', input: 's = ")("', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minSwapsOrAddsToBalance(String s) {
        int open = 0, add = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') open++;
            else if (open > 0) open--;
            else add++;
        }
        return open + add;
    }
}`,
    pythonSolution: `def minSwapsOrAddsToBalance(s):
    open_c = add = 0
    for c in s:
        if c == '(': open_c += 1
        elif open_c > 0: open_c -= 1
        else: add += 1
    return open_c + add`
  },
  {
    number: 11,
    title: 'Array Intersection Distinct Count',
    fnName: 'countCommonDistinct',
    description: 'Return how many distinct integers appear in both <code>a</code> and <code>b</code>.',
    constraints: ['0 <= a.length, b.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [1, 2, 2, 3], b = [2, 3, 4]', output: '2' },
      { title: 'Test Case 2', input: 'a = [1, 2], b = [3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'a = [], b = [1]', output: '0' },
      { title: 'Test Case 4', input: 'a = [5, 5], b = [5]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countCommonDistinct(int[] a, int[] b) {
        Set<Integer> sa = new HashSet<>(), sb = new HashSet<>();
        for (int x : a) sa.add(x);
        for (int x : b) if (sa.contains(x)) sb.add(x);
        return sb.size();
    }
}`,
    pythonSolution: `def countCommonDistinct(a, b):
    return len(set(a) & set(b))`
  },
  {
    number: 12,
    title: 'Code Module Dependency Cycle',
    fnName: 'hasDependencyCycle',
    description: 'Given <code>n</code> modules and directed edges <code>deps</code> <code>[u, v]</code>, return <code>true</code> if a directed cycle exists, else <code>false</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, deps = [[0, 1], [1, 2], [2, 0]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 3, deps = [[0, 1], [1, 2]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 2, deps = []', output: 'false' },
      { title: 'Test Case 4', input: 'n = 2, deps = [[0, 1], [1, 0]]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean hasDependencyCycle(int n, int[][] deps) {
        List<List<Integer>> g = new ArrayList<>();
        int[] ind = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] d : deps) { g.get(d[0]).add(d[1]); ind[d[1]]++; }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (ind[i] == 0) q.add(i);
        int vis = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); vis++;
            for (int v : g.get(u)) if (--ind[v] == 0) q.add(v);
        }
        return vis < n;
    }
}`,
    pythonSolution: `from collections import deque
def hasDependencyCycle(n, deps):
    g = [[] for _ in range(n)]; ind = [0] * n
    for u, v in deps: g[u].append(v); ind[v] += 1
    q = deque([i for i in range(n) if ind[i] == 0]); vis = 0
    while q:
        u = q.popleft(); vis += 1
        for v in g[u]:
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return vis < n`
  },
  {
    number: 13,
    title: 'Sliding Window Distinct Count',
    fnName: 'maxDistinctKWindow',
    description: 'Return the maximum number of distinct integers in any contiguous window of size <code>k</code> in <code>nums</code>.',
    constraints: ['1 <= k <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 1, 3, 4], k = 3', output: '3' },
      { title: 'Test Case 2', input: 'nums = [5, 5, 5], k = 2', output: '1' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3], k = 1', output: '1' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3, 4], k = 4', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxDistinctKWindow(int[] nums, int k) {
        Map<Integer, Integer> f = new HashMap<>(); int best = 0;
        for (int i = 0; i < nums.length; i++) {
            f.put(nums[i], f.getOrDefault(nums[i], 0) + 1);
            if (i >= k) {
                int o = nums[i - k];
                if (f.get(o) == 1) f.remove(o); else f.put(o, f.get(o) - 1);
            }
            if (i >= k - 1) best = Math.max(best, f.size());
        }
        return best;
    }
}`,
    pythonSolution: `def maxDistinctKWindow(nums, k):
    f = {}; best = 0
    for i, x in enumerate(nums):
        f[x] = f.get(x, 0) + 1
        if i >= k:
            o = nums[i - k]
            if f[o] == 1: del f[o]
            else: f[o] -= 1
        if i >= k - 1: best = max(best, len(f))
    return best`
  },
  {
    number: 14,
    title: 'Prefix Sum Range Queries Total',
    fnName: 'sumRangeQueries',
    description: 'Given array <code>nums</code> and inclusive index queries <code>queries</code> <code>[l, r]</code>, return the sum of answers across all queries.',
    constraints: ['1 <= nums.length, queries.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 4], queries = [[0, 2], [1, 3]]', output: '15' },
      { title: 'Test Case 2', input: 'nums = [5, 10], queries = [[0, 0], [1, 1]]', output: '15' },
      { title: 'Test Case 3', input: 'nums = [10], queries = [[0, 0]]', output: '10' },
      { title: 'Test Case 4', input: 'nums = [1, -1, 2], queries = [[0, 2]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long sumRangeQueries(int[] nums, int[][] queries) {
        long[] pref = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) pref[i + 1] = pref[i] + nums[i];
        long tot = 0;
        for (int[] q : queries) tot += pref[q[1] + 1] - pref[q[0]];
        return tot;
    }
}`,
    pythonSolution: `def sumRangeQueries(nums, queries):
    pref = [0]
    for x in nums: pref.append(pref[-1] + x)
    return sum(pref[r + 1] - pref[l] for l, r in queries)`
  },
  {
    number: 15,
    title: 'Word Length Histogram Peak',
    fnName: 'maxWordLength',
    description: 'Given space-separated words in <code>sentence</code>, return the length of the longest word.',
    constraints: ['1 <= sentence.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sentence = "persistent systems campus drive"', output: '10' },
      { title: 'Test Case 2', input: 'sentence = "a bb ccc"', output: '3' },
      { title: 'Test Case 3', input: 'sentence = "hello"', output: '5' },
      { title: 'Test Case 4', input: 'sentence = "x y z"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxWordLength(String sentence) {
        int best = 0;
        for (String w : sentence.trim().split("\\\\s+")) best = Math.max(best, w.length());
        return best;
    }
}`,
    pythonSolution: `def maxWordLength(sentence):
    return max(len(w) for w in sentence.split())`
  },
  {
    number: 16,
    title: 'K-th Largest Element Value',
    fnName: 'kthLargestValue',
    description: 'Return the <code>k</code>-th largest element in <code>nums</code> (1-indexed).',
    constraints: ['1 <= k <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 2, 1, 5, 6, 4], k = 2', output: '5' },
      { title: 'Test Case 2', input: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4', output: '4' },
      { title: 'Test Case 3', input: 'nums = [10], k = 1', output: '10' },
      { title: 'Test Case 4', input: 'nums = [1, 2], k = 2', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int kthLargestValue(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }
}`,
    pythonSolution: `def kthLargestValue(nums, k):
    return sorted(nums)[-k]`
  },
  {
    number: 17,
    title: 'Tree Max Width Level',
    fnName: 'maxNodesAtAnyLevel',
    description: 'Given a tree with <code>parent[i]</code> (<code>-1</code> for root), return the maximum number of nodes at any single depth level.',
    constraints: ['1 <= parent.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 0, 1, 1, 2]', output: '3' },
      { title: 'Test Case 2', input: 'parent = [-1]', output: '1' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 1, 2]', output: '1' },
      { title: 'Test Case 4', input: 'parent = [-1, 0, 0, 0]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxNodesAtAnyLevel(int[] parent) {
        int n = parent.length;
        int[] depth = new int[n], cnt = new int[n + 1];
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        int root = 0;
        for (int i = 0; i < n; i++) {
            if (parent[i] == -1) root = i; else g.get(parent[i]).add(i);
        }
        Queue<Integer> q = new ArrayDeque<>(); q.add(root);
        int best = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            cnt[depth[u]]++;
            best = Math.max(best, cnt[depth[u]]);
            for (int v : g.get(u)) { depth[v] = depth[u] + 1; q.add(v); }
        }
        return best;
    }
}`,
    pythonSolution: `from collections import deque, Counter
def maxNodesAtAnyLevel(parent):
    n = len(parent); g = [[] for _ in range(n)]; root = 0
    for i, p in enumerate(parent):
        if p == -1: root = i
        else: g[p].append(i)
    cnt = Counter(); q = deque([(root, 0)])
    while q:
        u, d = q.popleft(); cnt[d] += 1
        for v in g[u]: q.append((v, d + 1))
    return max(cnt.values())`
  },
  {
    number: 18,
    title: 'Bitwise Single Number Three',
    fnName: 'sumUniqueElements',
    description: 'Given integer array <code>nums</code>, return the sum of elements that appear EXACTLY once.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 2]', output: '4' },
      { title: 'Test Case 2', input: 'nums = [1, 1, 1]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [10, 20, 30]', output: '60' },
      { title: 'Test Case 4', input: 'nums = [5]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long sumUniqueElements(int[] nums) {
        Map<Integer, Integer> f = new HashMap<>();
        for (int x : nums) f.put(x, f.getOrDefault(x, 0) + 1);
        long s = 0;
        for (var e : f.entrySet()) if (e.getValue() == 1) s += e.getKey();
        return s;
    }
}`,
    pythonSolution: `from collections import Counter
def sumUniqueElements(nums):
    return sum(k for k, v in Counter(nums).items() if v == 1)`
  },
  {
    number: 19,
    title: 'Minimum Spanning Tree Weight',
    fnName: 'minSpanningCost',
    description: 'Given <code>n</code> nodes and weighted undirected edges <code>edges</code> <code>[u, v, w]</code>, return MST weight, or <code>-1</code> if disconnected.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, edges = [[0, 1, 5], [1, 2, 3], [0, 2, 10]]', output: '8' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1, 5]]', output: '-1' },
      { title: 'Test Case 3', input: 'n = 1, edges = []', output: '0' },
      { title: 'Test Case 4', input: 'n = 2, edges = [[0, 1, 7]]', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minSpanningCost(int n, int[][] edges) {
        if (n <= 1) return 0;
        Arrays.sort(edges, (a, b) -> Integer.compare(a[2], b[2]));
        int[] p = new int[n]; for (int i = 0; i < n; i++) p[i] = i;
        long cost = 0; int used = 0;
        for (int[] e : edges) {
            int ru = find(p, e[0]), rv = find(p, e[1]);
            if (ru != rv) { p[ru] = rv; cost += e[2]; if (++used == n - 1) return cost; }
        }
        return -1;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def minSpanningCost(n, edges):
    if n <= 1: return 0
    p = list(range(n))
    def find(x):
        while p[x] != x: p[x] = p[p[x]]; x = p[x]
        return x
    cost = used = 0
    for u, v, w in sorted(edges, key=lambda x: x[2]):
        ru, rv = find(u), find(v)
        if ru != rv:
            p[ru] = rv; cost += w; used += 1
            if used == n - 1: return cost
    return -1`
  },
  {
    number: 20,
    title: 'Substring Occurrence Count',
    fnName: 'countSubstringOccurrences',
    description: 'Count how many times non-empty pattern <code>pat</code> appears in string <code>text</code> (overlapping allowed).',
    constraints: ['1 <= pat.length <= text.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'text = "abababa", pat = "aba"', output: '3' },
      { title: 'Test Case 2', input: 'text = "hello", pat = "xyz"', output: '0' },
      { title: 'Test Case 3', input: 'text = "aaaa", pat = "aa"', output: '3' },
      { title: 'Test Case 4', input: 'text = "a", pat = "a"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countSubstringOccurrences(String text, String pat) {
        int cnt = 0;
        for (int i = 0; i + pat.length() <= text.length(); i++) {
            if (text.startsWith(pat, i)) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countSubstringOccurrences(text, pat):
    return sum(1 for i in range(len(text) - len(pat) + 1) if text.startswith(pat, i))`
  },
  {
    number: 21,
    title: 'Interval Merge Count',
    fnName: 'countMergedIntervals',
    description: 'Given intervals <code>intervals</code> <code>[start, end]</code>, merge all overlapping intervals (<code>s2 <= e1</code>) and return the count of resulting intervals.',
    constraints: ['0 <= intervals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]', output: '3' },
      { title: 'Test Case 2', input: 'intervals = [[1, 4], [4, 5]]', output: '1' },
      { title: 'Test Case 3', input: 'intervals = []', output: '0' },
      { title: 'Test Case 4', input: 'intervals = [[1, 2], [3, 4]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countMergedIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        int cnt = 1, e = intervals[0][1];
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] <= e) e = Math.max(e, intervals[i][1]);
            else { cnt++; e = intervals[i][1]; }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countMergedIntervals(intervals):
    if not intervals: return 0
    intervals.sort(); cnt = 1; e = intervals[0][1]
    for a, b in intervals[1:]:
        if a <= e: e = max(e, b)
        else: cnt += 1; e = b
    return cnt`
  },
  {
    number: 22,
    title: 'Product Array Zero Count',
    fnName: 'countElementsExceptSelfZeroes',
    description: 'Given integer array <code>nums</code>, return how many zeros exist in <code>nums</code> (or 1 if > 1 zero, wait: simply return how many elements in the "product except self" array are non-zero).',
    constraints: ['2 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 2', input: 'nums = [1, 0, 3]', output: '1' },
      { title: 'Test Case 3', input: 'nums = [0, 0, 5]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [0, 2]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countElementsExceptSelfZeroes(int[] nums) {
        int z = 0;
        for (int x : nums) if (x == 0) z++;
        if (z == 0) return nums.length;
        if (z == 1) return 1;
        return 0;
    }
}`,
    pythonSolution: `def countElementsExceptSelfZeroes(nums):
    z = nums.count(0)
    return len(nums) if z == 0 else (1 if z == 1 else 0)`
  },
  {
    number: 23,
    title: 'Bipartite Graph Check',
    fnName: 'isBipartiteGraph',
    description: 'Given <code>n</code> vertices and undirected edges <code>edges</code>, return <code>true</code> if the graph is 2-colorable (bipartite), else <code>false</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0, 1], [1, 2], [2, 3], [3, 0]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1], [1, 2], [2, 0]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 2, edges = []', output: 'true' },
      { title: 'Test Case 4', input: 'n = 1, edges = []', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean isBipartiteGraph(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        int[] col = new int[n];
        for (int i = 0; i < n; i++) if (col[i] == 0) {
            Queue<Integer> q = new ArrayDeque<>(); q.add(i); col[i] = 1;
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : g.get(u)) {
                    if (col[v] == 0) { col[v] = -col[u]; q.add(v); }
                    else if (col[v] == col[u]) return false;
                }
            }
        }
        return true;
    }
}`,
    pythonSolution: `from collections import deque
def isBipartiteGraph(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges: g[u].append(v); g[v].append(u)
    col = [0] * n
    for i in range(n):
        if col[i] == 0:
            col[i] = 1; q = deque([i])
            while q:
                u = q.popleft()
                for v in g[u]:
                    if col[v] == 0: col[v] = -col[u]; q.append(v)
                    elif col[v] == col[u]: return False
    return True`
  },
  {
    number: 24,
    title: 'Array Majority Element Check',
    fnName: 'majorityElementOrMinusOne',
    description: 'Return the element appearing strictly more than <code>n / 2</code> times in <code>nums</code>, or <code>-1</code> if none exists.',
    constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, 2, 1, 1, 1, 2, 2]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3]', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [5, 5]', output: '5' },
      { title: 'Test Case 4', input: 'nums = [1, 2]', output: '-1' }
    ],
    javaSolution: `public class Solution {
    public static int majorityElementOrMinusOne(int[] nums) {
        int cand = 0, cnt = 0;
        for (int x : nums) {
            if (cnt == 0) { cand = x; cnt = 1; }
            else cnt += (x == cand) ? 1 : -1;
        }
        int freq = 0;
        for (int x : nums) if (x == cand) freq++;
        return freq * 2 > nums.length ? cand : -1;
    }
}`,
    pythonSolution: `from collections import Counter
def majorityElementOrMinusOne(nums):
    k, c = Counter(nums).most_common(1)[0]
    return k if c * 2 > len(nums) else -1`
  },
  {
    number: 25,
    title: 'Count Pairs Divisible by 2',
    fnName: 'countEvenSumPairs',
    description: 'Given integers <code>nums</code>, count how many pairs <code>(i, j)</code> with <code>i < j</code> have an even sum <code>nums[i] + nums[j]</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 4]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [2, 4, 6]', output: '3' },
      { title: 'Test Case 3', input: 'nums = [1, 3, 5]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [1, 2]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countEvenSumPairs(int[] nums) {
        long ev = 0, od = 0;
        for (int x : nums) if ((x & 1) == 0) ev++; else od++;
        return ev * (ev - 1) / 2 + od * (od - 1) / 2;
    }
}`,
    pythonSolution: `def countEvenSumPairs(nums):
    ev = sum(1 for x in nums if x % 2 == 0)
    od = len(nums) - ev
    return ev * (ev - 1) // 2 + od * (od - 1) // 2`
  },
  {
    number: 26,
    title: 'Minimum Coins Greedy Check',
    fnName: 'minStandardCoins',
    description: 'Given amount <code>amt</code> and standard coin values <code>[1, 2, 5, 10]</code>, return minimum coins needed.',
    constraints: ['0 <= amt <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'amt = 28', output: '5' },
      { title: 'Test Case 2', input: 'amt = 0', output: '0' },
      { title: 'Test Case 3', input: 'amt = 10', output: '1' },
      { title: 'Test Case 4', input: 'amt = 7', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long minStandardCoins(long amt) {
        long[] c = {10, 5, 2, 1}; long cnt = 0;
        for (long d : c) { cnt += amt / d; amt %= d; }
        return cnt;
    }
}`,
    pythonSolution: `def minStandardCoins(amt):
    cnt = 0
    for d in (10, 5, 2, 1): cnt += amt // d; amt %= d
    return cnt`
  },
  {
    number: 27,
    title: 'Longest Common Prefix Length',
    fnName: 'longestCommonPrefixLen',
    description: 'Given strings <code>strs</code>, return the length of the longest common prefix across all strings.',
    constraints: ['1 <= strs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'strs = ["flower", "flow", "flight"]', output: '2' },
      { title: 'Test Case 2', input: 'strs = ["dog", "racecar", "car"]', output: '0' },
      { title: 'Test Case 3', input: 'strs = ["persistent"]', output: '10' },
      { title: 'Test Case 4', input: 'strs = ["ab", "abc"]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int longestCommonPrefixLen(String[] strs) {
        String p = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (!strs[i].startsWith(p)) p = p.substring(0, p.length() - 1);
        }
        return p.length();
    }
}`,
    pythonSolution: `def longestCommonPrefixLen(strs):
    p = strs[0]
    for s in strs[1:]:
        while not s.startswith(p): p = p[:-1]
    return len(p)`
  },
  {
    number: 28,
    title: 'Subarray Sum Equal K Count',
    fnName: 'countSubarraysTarget',
    description: 'Count contiguous subarrays in <code>nums</code> whose sum equals <code>k</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 1], k = 2', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3], k = 3', output: '2' },
      { title: 'Test Case 3', input: 'nums = [5], k = 10', output: '0' },
      { title: 'Test Case 4', input: 'nums = [0, 0], k = 0', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countSubarraysTarget(int[] nums, long k) {
        Map<Long, Integer> m = new HashMap<>(); m.put(0L, 1);
        long pref = 0, ans = 0;
        for (int x : nums) {
            pref += x;
            ans += m.getOrDefault(pref - k, 0);
            m.put(pref, m.getOrDefault(pref, 0) + 1);
        }
        return ans;
    }
}`,
    pythonSolution: `def countSubarraysTarget(nums, k):
    m = {0: 1}; pref = ans = 0
    for x in nums:
        pref += x; ans += m.get(pref - k, 0); m[pref] = m.get(pref, 0) + 1
    return ans`
  },
  {
    number: 29,
    title: 'Check Sorted and Rotated',
    fnName: 'isSortedAndRotated',
    description: 'Return <code>true</code> if <code>nums</code> was originally sorted non-decreasing and then rotated some number of positions (0 or more), else <code>false</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 4, 5, 1, 2]', output: 'true' },
      { title: 'Test Case 2', input: 'nums = [2, 1, 3, 4]', output: 'false' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3]', output: 'true' },
      { title: 'Test Case 4', input: 'nums = [5]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isSortedAndRotated(int[] nums) {
        int drops = 0, n = nums.length;
        for (int i = 0; i < n; i++) if (nums[i] > nums[(i + 1) % n]) drops++;
        return drops <= 1;
    }
}`,
    pythonSolution: `def isSortedAndRotated(nums):
    n = len(nums)
    return sum(1 for i in range(n) if nums[i] > nums[(i + 1) % n]) <= 1`
  },
  {
    number: 30,
    title: 'Valid Mountain Array Check',
    fnName: 'isMountainArray',
    description: 'Return <code>true</code> if <code>nums</code> has length <code>>= 3</code> and strictly increases to a single peak and then strictly decreases, else <code>false</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [0, 3, 2, 1]', output: 'true' },
      { title: 'Test Case 2', input: 'nums = [3, 5, 5]', output: 'false' },
      { title: 'Test Case 3', input: 'nums = [2, 1]', output: 'false' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3, 4]', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean isMountainArray(int[] nums) {
        int n = nums.length, i = 0;
        while (i + 1 < n && nums[i] < nums[i + 1]) i++;
        if (i == 0 || i == n - 1) return false;
        while (i + 1 < n && nums[i] > nums[i + 1]) i++;
        return i == n - 1;
    }
}`,
    pythonSolution: `def isMountainArray(nums):
    n = len(nums); i = 0
    while i + 1 < n and nums[i] < nums[i + 1]: i += 1
    if i == 0 or i == n - 1: return False
    while i + 1 < n and nums[i] > nums[i + 1]: i += 1
    return i == n - 1`
  },
  {
    number: 31,
    title: 'Count Primes Strictly Below N',
    fnName: 'countPrimesBelow',
    description: 'Return the number of prime numbers strictly less than <code>n</code>.',
    constraints: ['0 <= n <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 10', output: '4' },
      { title: 'Test Case 2', input: 'n = 0', output: '0' },
      { title: 'Test Case 3', input: 'n = 2', output: '0' },
      { title: 'Test Case 4', input: 'n = 20', output: '8' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countPrimesBelow(int n) {
        if (n <= 2) return 0;
        boolean[] isP = new boolean[n]; Arrays.fill(isP, true);
        isP[0] = isP[1] = false;
        for (int p = 2; p * p < n; p++) if (isP[p]) for (int m = p * p; m < n; m += p) isP[m] = false;
        int cnt = 0; for (boolean b : isP) if (b) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countPrimesBelow(n):
    if n <= 2: return 0
    p = [True] * n; p[0] = p[1] = False
    for i in range(2, int(n**0.5) + 1):
        if p[i]: p[i*i:n:i] = [False] * len(range(i*i, n, i))
    return sum(p)`
  },
  {
    number: 32,
    title: 'Climbing Stairs With 1 or 2',
    fnName: 'countStairWays',
    description: 'Return number of distinct ways to climb <code>n</code> stairs taking 1 or 2 steps at a time modulo <code>10^9 + 7</code>.',
    constraints: ['1 <= n <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4', output: '5' },
      { title: 'Test Case 2', input: 'n = 1', output: '1' },
      { title: 'Test Case 3', input: 'n = 5', output: '8' },
      { title: 'Test Case 4', input: 'n = 2', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long countStairWays(int n) {
        long MOD = 1_000_000_007L, a = 1, b = 1;
        for (int i = 2; i <= n; i++) { long c = (a + b) % MOD; a = b; b = c; }
        return b;
    }
}`,
    pythonSolution: `def countStairWays(n):
    MOD = 10**9 + 7; a, b = 1, 1
    for _ in range(2, n + 1): a, b = b, (a + b) % MOD
    return b`
  },
  {
    number: 33,
    title: 'Single-Pass Max Difference',
    fnName: 'maxIncreasingDiff',
    description: 'Given array <code>nums</code>, return the maximum value of <code>nums[j] - nums[i]</code> with <code>i < j</code> and <code>nums[i] < nums[j]</code>, or <code>-1</code> if none exists.',
    constraints: ['2 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [7, 1, 5, 4]', output: '4' },
      { title: 'Test Case 2', input: 'nums = [9, 4, 3, 2]', output: '-1' },
      { title: 'Test Case 3', input: 'nums = [1, 5, 2, 10]', output: '9' },
      { title: 'Test Case 4', input: 'nums = [5, 5]', output: '-1' }
    ],
    javaSolution: `public class Solution {
    public static int maxIncreasingDiff(int[] nums) {
        int mn = nums[0], best = -1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > mn) best = Math.max(best, nums[i] - mn);
            mn = Math.min(mn, nums[i]);
        }
        return best;
    }
}`,
    pythonSolution: `def maxIncreasingDiff(nums):
    mn = nums[0]; best = -1
    for x in nums[1:]:
        if x > mn: best = max(best, x - mn)
        mn = min(mn, x)
    return best`
  },
  {
    number: 34,
    title: 'Unique Email Canonical Count',
    fnName: 'countUniqueEmailsLower',
    description: 'Normalize emails by lowercasing and trimming spaces. Return count of unique emails.',
    constraints: ['1 <= emails.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'emails = ["A@b.com", "a@b.com ", "c@d.com"]', output: '2' },
      { title: 'Test Case 2', input: 'emails = ["x@y.com"]', output: '1' },
      { title: 'Test Case 3', input: 'emails = ["a@a.com", "b@b.com"]', output: '2' },
      { title: 'Test Case 4', input: 'emails = ["TEST@X.COM", "test@x.com"]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUniqueEmailsLower(String[] emails) {
        Set<String> s = new HashSet<>();
        for (String e : emails) s.add(e.trim().toLowerCase());
        return s.size();
    }
}`,
    pythonSolution: `def countUniqueEmailsLower(emails):
    return len({e.strip().lower() for e in emails})`
  },
  {
    number: 35,
    title: 'Binary Matrix Row Max Ones',
    fnName: 'rowWithMostOnes',
    description: 'Given a binary matrix <code>mat</code>, return the 0-based row index with the maximum number of <code>1</code>s (smallest index on tie).',
    constraints: ['1 <= mat.length, mat[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[0, 1, 0], [1, 1, 0], [1, 1, 1]]', output: '2' },
      { title: 'Test Case 2', input: 'mat = [[0, 0], [0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'mat = [[1, 0], [0, 1]]', output: '0' },
      { title: 'Test Case 4', input: 'mat = [[1]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int rowWithMostOnes(int[][] mat) {
        int bestR = 0, bestC = -1;
        for (int r = 0; r < mat.length; r++) {
            int c = 0; for (int v : mat[r]) c += v;
            if (c > bestC) { bestC = c; bestR = r; }
        }
        return bestR;
    }
}`,
    pythonSolution: `def rowWithMostOnes(mat):
    return max(range(len(mat)), key=lambda r: sum(mat[r]))`
  },
  {
    number: 36,
    title: 'Minimum Absolute Pair Difference',
    fnName: 'minAbsPairDiff',
    description: 'Given distinct integers <code>nums</code> (<code>n >= 2</code>), return the minimum absolute difference between any two elements.',
    constraints: ['2 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 2, 1, 3]', output: '1' },
      { title: 'Test Case 2', input: 'nums = [10, 25, 40]', output: '15' },
      { title: 'Test Case 3', input: 'nums = [-5, 5]', output: '10' },
      { title: 'Test Case 4', input: 'nums = [1, 100, 99]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minAbsPairDiff(int[] nums) {
        Arrays.sort(nums);
        int best = Integer.MAX_VALUE;
        for (int i = 1; i < nums.length; i++) best = Math.min(best, nums[i] - nums[i - 1]);
        return best;
    }
}`,
    pythonSolution: `def minAbsPairDiff(nums):
    nums.sort()
    return min(nums[i] - nums[i - 1] for i in range(1, len(nums)))`
  },
  {
    number: 37,
    title: 'Count Substrings Starting Ending Same',
    fnName: 'countSameEndSubstrings',
    description: 'Given lowercase string <code>s</code>, count how many substrings start and end with the same character.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abcab"', output: '7' },
      { title: 'Test Case 2', input: 's = "aaa"', output: '6' },
      { title: 'Test Case 3', input: 's = "abcd"', output: '4' },
      { title: 'Test Case 4', input: 's = "z"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countSameEndSubstrings(String s) {
        long[] f = new long[26];
        for (int i = 0; i < s.length(); i++) f[s.charAt(i) - 'a']++;
        long ans = 0;
        for (long c : f) ans += c * (c + 1) / 2;
        return ans;
    }
}`,
    pythonSolution: `from collections import Counter
def countSameEndSubstrings(s):
    return sum(c * (c + 1) // 2 for c in Counter(s).values())`
  },
  {
    number: 38,
    title: 'Two-Array Relative Sort Check',
    fnName: 'countElementsNotInSecond',
    description: 'Return how many elements in <code>a</code> do NOT appear in <code>b</code>.',
    constraints: ['0 <= a.length, b.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [1, 2, 3, 2, 4], b = [2, 4]', output: '2' },
      { title: 'Test Case 2', input: 'a = [1, 2], b = [1, 2]', output: '0' },
      { title: 'Test Case 3', input: 'a = [5, 6], b = []', output: '2' },
      { title: 'Test Case 4', input: 'a = [], b = [1]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countElementsNotInSecond(int[] a, int[] b) {
        Set<Integer> s = new HashSet<>();
        for (int x : b) s.add(x);
        int cnt = 0;
        for (int x : a) if (!s.contains(x)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countElementsNotInSecond(a, b):
    s = set(b)
    return sum(1 for x in a if x not in s)`
  },
  {
    number: 39,
    title: 'Grid Path Sum Min Triangle',
    fnName: 'minCostTwoRows',
    description: 'Given a <code>2 x n</code> cost matrix <code>grid</code>, you must pick one cell from column <code>0..n-1</code>, paying <code>grid[r][c]</code>, with penalty <code>switchCost</code> whenever you switch rows between adjacent columns. Return minimum total cost.',
    constraints: ['1 <= grid[0].length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 10, 1], [10, 1, 10]], switchCost = 2', output: '7' },
      { title: 'Test Case 2', input: 'grid = [[1, 1, 1], [5, 5, 5]], switchCost = 10', output: '3' },
      { title: 'Test Case 3', input: 'grid = [[5], [2]], switchCost = 100', output: '2' },
      { title: 'Test Case 4', input: 'grid = [[1, 100], [100, 1]], switchCost = 5', output: '7' }
    ],
    javaSolution: `public class Solution {
    public static long minCostTwoRows(int[][] grid, int switchCost) {
        long r0 = grid[0][0], r1 = grid[1][0];
        for (int c = 1; c < grid[0].length; c++) {
            long nr0 = grid[0][c] + Math.min(r0, r1 + switchCost);
            long nr1 = grid[1][c] + Math.min(r1, r0 + switchCost);
            r0 = nr0; r1 = nr1;
        }
        return Math.min(r0, r1);
    }
}`,
    pythonSolution: `def minCostTwoRows(grid, switchCost):
    r0, r1 = grid[0][0], grid[1][0]
    for c in range(1, len(grid[0])):
        r0, r1 = grid[0][c] + min(r0, r1 + switchCost), grid[1][c] + min(r1, r0 + switchCost)
    return min(r0, r1)`
  },
  {
    number: 40,
    title: 'Count Good Triplets In Array',
    fnName: 'countIncreasingTriplets',
    description: 'Given array <code>nums</code>, count triples <code>(i, j, k)</code> with <code>i < j < k</code> and <code>nums[i] < nums[j] < nums[k]</code>.',
    constraints: ['1 <= nums.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 2', input: 'nums = [4, 3, 2, 1]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 5, 2, 6]', output: '2' },
      { title: 'Test Case 4', input: 'nums = [1, 2]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countIncreasingTriplets(int[] nums) {
        long cnt = 0; int n = nums.length;
        for (int j = 1; j < n - 1; j++) {
            long L = 0, R = 0;
            for (int i = 0; i < j; i++) if (nums[i] < nums[j]) L++;
            for (int k = j + 1; k < n; k++) if (nums[k] > nums[j]) R++;
            cnt += L * R;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countIncreasingTriplets(nums):
    n = len(nums); cnt = 0
    for j in range(1, n - 1):
        L = sum(1 for i in range(j) if nums[i] < nums[j])
        R = sum(1 for k in range(j + 1, n) if nums[k] > nums[j])
        cnt += L * R
    return cnt`
  },
  {
    number: 41,
    title: 'Check Power of Three',
    fnName: 'isPowerOfThree',
    description: 'Return <code>true</code> if positive integer <code>n</code> is a power of 3, else <code>false</code>.',
    constraints: ['1 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 27', output: 'true' },
      { title: 'Test Case 2', input: 'n = 1', output: 'true' },
      { title: 'Test Case 3', input: 'n = 12', output: 'false' },
      { title: 'Test Case 4', input: 'n = 81', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isPowerOfThree(int n) {
        while (n > 1 && n % 3 == 0) n /= 3;
        return n == 1;
    }
}`,
    pythonSolution: `def isPowerOfThree(n):
    while n > 1 and n % 3 == 0: n //= 3
    return n == 1`
  },
  {
    number: 42,
    title: 'Max Consecutive Ones After Flip',
    fnName: 'maxConsecutiveOnesOneFlip',
    description: 'Given binary array <code>bits</code>, you may flip at most one <code>0</code> to <code>1</code>. Return the maximum number of consecutive <code>1</code>s.',
    constraints: ['1 <= bits.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bits = [1, 0, 1, 1, 0]', output: '4' },
      { title: 'Test Case 2', input: 'bits = [1, 1, 1]', output: '3' },
      { title: 'Test Case 3', input: 'bits = [0, 0, 0]', output: '1' },
      { title: 'Test Case 4', input: 'bits = [0]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxConsecutiveOnesOneFlip(int[] bits) {
        int l = 0, zeros = 0, best = 0;
        for (int r = 0; r < bits.length; r++) {
            if (bits[r] == 0) zeros++;
            while (zeros > 1) if (bits[l++] == 0) zeros--;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def maxConsecutiveOnesOneFlip(bits):
    l = zeros = best = 0
    for r, b in enumerate(bits):
        if b == 0: zeros += 1
        while zeros > 1:
            if bits[l] == 0: zeros -= 1
            l += 1
        best = max(best, r - l + 1)
    return best`
  },
  {
    number: 43,
    title: 'Count Distinct Absolute Values',
    fnName: 'countDistinctAbs',
    description: 'Given sorted integer array <code>nums</code>, return the count of distinct absolute values.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [-5, -3, -1, 0, 1, 3, 7]', output: '5' },
      { title: 'Test Case 2', input: 'nums = [-2, -2, 2, 2]', output: '1' },
      { title: 'Test Case 3', input: 'nums = [0]', output: '1' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDistinctAbs(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(Math.abs(x));
        return s.size();
    }
}`,
    pythonSolution: `def countDistinctAbs(nums):
    return len({abs(x) for x in nums})`
  },
  {
    number: 44,
    title: 'Reverse Words Order In String',
    fnName: 'reverseWordOrder',
    description: 'Given a sentence <code>s</code> with words separated by spaces, return the words in reverse order separated by a single space (no leading/trailing spaces).',
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "  hello   world  "', output: 'world hello' },
      { title: 'Test Case 2', input: 's = "a b c"', output: 'c b a' },
      { title: 'Test Case 3', input: 's = "persistent"', output: 'persistent' },
      { title: 'Test Case 4', input: 's = "one two"', output: 'two one' }
    ],
    javaSolution: `public class Solution {
    public static String reverseWordOrder(String s) {
        String[] w = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = w.length - 1; i >= 0; i--) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(w[i]);
        }
        return sb.toString();
    }
}`,
    pythonSolution: `def reverseWordOrder(s):
    return " ".join(s.split()[::-1])`
  },
  {
    number: 45,
    title: 'Sum of Even Fibonacci Terms',
    fnName: 'sumEvenFibUpTo',
    description: 'Considering Fibonacci numbers starting <code>1, 2, 3, 5, 8, ...</code> up to <code>limit</code> inclusive, return the sum of all even-valued terms.',
    constraints: ['1 <= limit <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'limit = 10', output: '10' },
      { title: 'Test Case 2', input: 'limit = 1', output: '0' },
      { title: 'Test Case 3', input: 'limit = 34', output: '44' },
      { title: 'Test Case 4', input: 'limit = 2', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long sumEvenFibUpTo(long limit) {
        long a = 1, b = 2, sum = 0;
        while (b <= limit) {
            if (b % 2 == 0) sum += b;
            long c = a + b; a = b; b = c;
        }
        return sum;
    }
}`,
    pythonSolution: `def sumEvenFibUpTo(limit):
    a, b, s = 1, 2, 0
    while b <= limit:
        if b % 2 == 0: s += b
        a, b = b, a + b
    return s`
  },
  {
    number: 46,
    title: 'Array GCD Equal One Check',
    fnName: 'hasGcdOneSubset',
    description: 'Return <code>true</code> if the GCD of all elements in <code>nums</code> is <code>1</code>, else <code>false</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [6, 10, 15]', output: 'true' },
      { title: 'Test Case 2', input: 'nums = [4, 8, 12]', output: 'false' },
      { title: 'Test Case 3', input: 'nums = [1]', output: 'true' },
      { title: 'Test Case 4', input: 'nums = [7]', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean hasGcdOneSubset(int[] nums) {
        int g = nums[0];
        for (int x : nums) g = gcd(g, x);
        return g == 1;
    }
    private static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
}`,
    pythonSolution: `import math
def hasGcdOneSubset(nums):
    g = 0
    for x in nums: g = math.gcd(g, x)
    return g == 1`
  },
  {
    number: 47,
    title: 'Count Pairs With Product Target',
    fnName: 'countProductPairs',
    description: 'Given positive integers <code>nums</code> and target <code>prod</code>, count pairs <code>(i, j)</code> with <code>i < j</code> and <code>nums[i] * nums[j] == prod</code>.',
    constraints: ['1 <= nums.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, 3, 4, 6, 3], prod = 12', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3], prod = 10', output: '0' },
      { title: 'Test Case 3', input: 'nums = [2, 2, 2], prod = 4', output: '3' },
      { title: 'Test Case 4', input: 'nums = [5], prod = 25', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countProductPairs(int[] nums, long prod) {
        Map<Long, Integer> seen = new HashMap<>();
        long cnt = 0;
        for (int x : nums) {
            if (prod % x == 0) cnt += seen.getOrDefault(prod / x, 0);
            seen.put((long) x, seen.getOrDefault((long) x, 0) + 1);
        }
        return cnt;
    }
}`,
    pythonSolution: `def countProductPairs(nums, prod):
    seen = {}; cnt = 0
    for x in nums:
        if prod % x == 0: cnt += seen.get(prod // x, 0)
        seen[x] = seen.get(x, 0) + 1
    return cnt`
  },
  {
    number: 48,
    title: 'Minimum Operations Make Equal',
    fnName: 'minOpsToMinElement',
    description: 'In one operation, reduce any element by 1. Return minimum operations to make all elements of <code>nums</code> equal to <code>min(nums)</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [5, 5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [10]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [2, 6, 4]', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static long minOpsToMinElement(int[] nums) {
        int mn = nums[0]; long sum = 0;
        for (int x : nums) { mn = Math.min(mn, x); sum += x; }
        return sum - (long) mn * nums.length;
    }
}`,
    pythonSolution: `def minOpsToMinElement(nums):
    return sum(nums) - min(nums) * len(nums)`
  },
  {
    number: 49,
    title: 'Check Valid Stack Sequence',
    fnName: 'isValidPushPop',
    description: 'Given distinct arrays <code>pushed</code> and <code>popped</code> of the same length, return <code>true</code> if <code>popped</code> could be the result of push/pop operations on an initially empty stack, else <code>false</code>.',
    constraints: ['1 <= pushed.length == popped.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'pushed = [1, 2, 3, 4, 5], popped = [4, 5, 3, 2, 1]', output: 'true' },
      { title: 'Test Case 2', input: 'pushed = [1, 2, 3, 4, 5], popped = [4, 3, 5, 1, 2]', output: 'false' },
      { title: 'Test Case 3', input: 'pushed = [1], popped = [1]', output: 'true' },
      { title: 'Test Case 4', input: 'pushed = [1, 2], popped = [2, 1]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean isValidPushPop(int[] pushed, int[] popped) {
        Deque<Integer> st = new ArrayDeque<>();
        int j = 0;
        for (int x : pushed) {
            st.push(x);
            while (!st.isEmpty() && st.peek() == popped[j]) { st.pop(); j++; }
        }
        return st.isEmpty();
    }
}`,
    pythonSolution: `def isValidPushPop(pushed, popped):
    st = []; j = 0
    for x in pushed:
        st.append(x)
        while st and st[-1] == popped[j]: st.pop(); j += 1
    return not st`
  },
  {
    number: 50,
    title: 'Shortest Unsorted Subarray Length',
    fnName: 'minWindowToSort',
    description: 'Return the length of the shortest contiguous subarray in <code>nums</code> such that sorting only that subarray makes the entire array non-decreasing.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, 6, 4, 8, 10, 9, 15]', output: '5' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [3, 2, 1]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minWindowToSort(int[] nums) {
        int[] s = nums.clone(); Arrays.sort(s);
        int l = 0, r = nums.length - 1;
        while (l < nums.length && nums[l] == s[l]) l++;
        while (r > l && nums[r] == s[r]) r--;
        return l >= r ? 0 : r - l + 1;
    }
}`,
    pythonSolution: `def minWindowToSort(nums):
    s = sorted(nums)
    diff = [i for i in range(len(nums)) if nums[i] != s[i]]
    return 0 if not diff else diff[-1] - diff[0] + 1`
  }
];
