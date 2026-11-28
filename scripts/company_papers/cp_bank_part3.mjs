// Pure Competitive Programming & Hard/Extreme DSA Bank — Part 3 (25 Problems)
// Focus: Sparse Table RMQ, Egg Drop DP, Palindrome Partitioning Min Cuts, Bounded Knapsack,
//        Maximum Subarray XOR, Tree Center / Centroid, 2-Coloring / Graph Coloring, String DP.
export const CP_BANK_PART3 = [
  {
    number: 1,
    difficulty: 'HARD',
    title: 'Sparse Table O(1) Range Minimum Queries',
    fnName: 'sparseTableRmqQueries',
    description: 'Given an integer array <code>nums</code> and queries <code>[l, r]</code> (0-indexed inclusive), answer each range minimum query in <code>O(1)</code> after <code>O(n log n)</code> Sparse Table preprocessing.',
    constraints: ['1 <= len(nums) <= 10^5', '1 <= len(queries) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[4, 2, 7, 1, 9, 3, 5], [[0,2],[1,4],[3,6],[0,6]]', output: '[2, 1, 1, 1]' },
      { title: 'Single elem', input: '[10, 20, 30], [[0,0],[1,1],[2,2]]', output: '[10, 20, 30]' },
      { title: 'Negatives', input: '[-5, 2, -8, 4], [[0,1],[1,3],[0,3]]', output: '[-5, -8, -8]' },
      { title: 'Equal', input: '[3, 3, 3], [[0,2]]', output: '[3]' },
    ],
    javaSolution: `class Solution {
    public int[] sparseTableRmqQueries(int[] nums, int[][] queries) {
        int n = nums.length, LOG = 18;
        int[][] st = new int[n][LOG];
        int[] lg = new int[n + 1];
        for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
        for (int i = 0; i < n; i++) st[i][0] = nums[i];
        for (int j = 1; j < LOG; j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                st[i][j] = Math.min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
        int[] res = new int[queries.length];
        for (int q = 0; q < queries.length; q++) {
            int l = queries[q][0], r = queries[q][1], j = lg[r - l + 1];
            res[q] = Math.min(st[l][j], st[r - (1 << j) + 1][j]);
        }
        return res;
    }
}`,
    pythonSolution: `def sparseTableRmqQueries(nums, queries):
    n = len(nums)
    lg = [0] * (n + 1)
    for i in range(2, n + 1):
        lg[i] = lg[i >> 1] + 1
    LOG = lg[n] + 1
    st = [nums[:]]
    for j in range(1, LOG):
        prev = st[j - 1]
        step = 1 << (j - 1)
        cur = [min(prev[i], prev[i + step]) for i in range(n - (1 << j) + 1)]
        st.append(cur)
    res = []
    for l, r in queries:
        j = lg[r - l + 1]
        res.append(min(st[j][l], st[j][r - (1 << j) + 1]))
    return res`
  },
  {
    number: 2,
    difficulty: 'HARD',
    title: 'Super Egg Drop (K Eggs, N Floors)',
    fnName: 'minEggDropMoves',
    description: 'Given <code>k</code> identical eggs and a building with <code>n</code> floors, return the minimum number of moves required in the worst case to determine with certainty the highest floor from which an egg can be dropped without breaking.',
    constraints: ['1 <= k <= 100', '1 <= n <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '1, 2', output: '2' },
      { title: 'Sample 2', input: '2, 6', output: '3' },
      { title: 'Sample 3', input: '3, 14', output: '4' },
      { title: '2 eggs 100 floors', input: '2, 100', output: '14' },
    ],
    javaSolution: `class Solution {
    public int minEggDropMoves(int k, int n) {
        int[] dp = new int[k + 1];
        int moves = 0;
        while (dp[k] < n) {
            moves++;
            for (int e = k; e >= 1; e--) dp[e] += dp[e - 1] + 1;
        }
        return moves;
    }
}`,
    pythonSolution: `def minEggDropMoves(k, n):
    dp = [0] * (k + 1)
    moves = 0
    while dp[k] < n:
        moves += 1
        for e in range(k, 0, -1):
            dp[e] += dp[e - 1] + 1
    return moves`
  },
  {
    number: 3,
    difficulty: 'HARD',
    title: 'Palindrome Partitioning Minimum Cuts',
    fnName: 'minPalindromeCuts',
    description: 'Given a string <code>s</code>, partition <code>s</code> such that every substring of the partition is a palindrome. Return the minimum cuts needed.',
    constraints: ['1 <= len(s) <= 2000'],
    testCases: [
      { title: 'Sample 1', input: '"aab"', output: '1' },
      { title: 'Single', input: '"a"', output: '0' },
      { title: 'All distinct', input: '"ab"', output: '1' },
      { title: 'Palindrome', input: '"racecar"', output: '0' },
    ],
    javaSolution: `class Solution {
    public int minPalindromeCuts(String s) {
        int n = s.length();
        int[] cut = new int[n + 1];
        for (int i = 0; i <= n; i++) cut[i] = i - 1;
        for (int i = 0; i < n; i++) {
            for (int r = 0; i - r >= 0 && i + r < n && s.charAt(i - r) == s.charAt(i + r); r++) {
                cut[i + r + 1] = Math.min(cut[i + r + 1], cut[i - r] + 1);
            }
            for (int r = 1; i - r + 1 >= 0 && i + r < n && s.charAt(i - r + 1) == s.charAt(i + r); r++) {
                cut[i + r + 1] = Math.min(cut[i + r + 1], cut[i - r + 1] + 1);
            }
        }
        return cut[n];
    }
}`,
    pythonSolution: `def minPalindromeCuts(s):
    n = len(s)
    cut = [i - 1 for i in range(n + 1)]
    for i in range(n):
        r = 0
        while i - r >= 0 and i + r < n and s[i - r] == s[i + r]:
            cut[i + r + 1] = min(cut[i + r + 1], cut[i - r] + 1)
            r += 1
        r = 1
        while i - r + 1 >= 0 and i + r < n and s[i - r + 1] == s[i + r]:
            cut[i + r + 1] = min(cut[i + r + 1], cut[i - r + 1] + 1)
            r += 1
    return cut[n]`
  },
  {
    number: 4,
    difficulty: 'HARD',
    title: 'Maximum Subarray XOR Using Prefix Trie',
    fnName: 'maxSubarrayXor',
    description: 'Given a non-negative integer array <code>nums</code>, return the maximum XOR value of any non-empty contiguous subarray.',
    constraints: ['1 <= len(nums) <= 10^5', '0 <= nums[i] <= 2^30'],
    testCases: [
      { title: 'Sample 1', input: '[8, 1, 2, 12]', output: '15' },
      { title: 'Sample 2', input: '[4, 6]', output: '6' },
      { title: 'Single', input: '[7]', output: '7' },
      { title: 'Zeros', input: '[0, 0, 0]', output: '0' },
    ],
    javaSolution: `class Solution {
    public int maxSubarrayXor(int[] nums) {
        int n = nums.length;
        int[] pref = new int[n + 1];
        for (int i = 0; i < n; i++) pref[i + 1] = pref[i] ^ nums[i];
        int ans = 0, mask = 0;
        for (int b = 30; b >= 0; b--) {
            mask |= (1 << b);
            java.util.HashSet<Integer> seen = new java.util.HashSet<>();
            for (int p : pref) seen.add(p & mask);
            int cand = ans | (1 << b);
            for (int p : seen) if (seen.contains(p ^ cand)) { ans = cand; break; }
        }
        return ans;
    }
}`,
    pythonSolution: `def maxSubarrayXor(nums):
    pref = [0]
    for x in nums:
        pref.append(pref[-1] ^ x)
    ans = mask = 0
    for b in range(30, -1, -1):
        mask |= 1 << b
        prefixes = {p & mask for p in pref}
        cand = ans | (1 << b)
        if any((p ^ cand) in prefixes for p in prefixes):
            ans = cand
    return ans`
  },
  {
    number: 5,
    difficulty: 'EXTREME',
    title: 'Tree Centroid Node (Minimize Largest Subtree)',
    fnName: 'findTreeCentroid',
    description: 'Given an undirected tree of <code>n</code> nodes (0-indexed) and <code>edges</code>, find a centroid node whose removal leaves every remaining connected component with at most <code>floor(n / 2)</code> nodes (return the smallest such node index).',
    constraints: ['1 <= n <= 10^5'],
    testCases: [
      { title: 'Line 5', input: '5, [[0,1],[1,2],[2,3],[3,4]]', output: '2' },
      { title: 'Star', input: '5, [[0,1],[0,2],[0,3],[0,4]]', output: '0' },
      { title: 'Two centroids', input: '4, [[0,1],[1,2],[2,3]]', output: '1' },
      { title: 'Single', input: '1, []', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int findTreeCentroid(int n, int[][] edges) {
        if (n <= 2) return 0;
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        int[] sz = new int[n];
        int[] best = {n};
        dfs(0, -1, n, g, sz, best);
        return best[0];
    }
    void dfs(int u, int p, int n, List<Integer>[] g, int[] sz, int[] best) {
        sz[u] = 1;
        int maxChild = 0;
        for (int v : g[u]) if (v != p) {
            dfs(v, u, n, g, sz, best);
            sz[u] += sz[v];
            maxChild = Math.max(maxChild, sz[v]);
        }
        int maxComp = Math.max(maxChild, n - sz[u]);
        if (maxComp <= n / 2) best[0] = Math.min(best[0], u);
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def findTreeCentroid(n, edges):
    if n <= 2:
        return 0
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    sz = [0] * n
    best = [n]
    def dfs(u, p):
        sz[u] = 1
        max_child = 0
        for v in g[u]:
            if v != p:
                dfs(v, u)
                sz[u] += sz[v]
                if sz[v] > max_child:
                    max_child = sz[v]
        if max(max_child, n - sz[u]) <= n // 2:
            if u < best[0]:
                best[0] = u
    dfs(0, -1)
    return best[0]`
  },
  {
    number: 6,
    difficulty: 'HARD',
    title: 'Word Break II Count of Sentences',
    fnName: 'countWordBreakWays',
    description: 'Given a string <code>s</code> and a dictionary of unique words <code>wordDict</code>, return the number of distinct ways to segment <code>s</code> into a space-separated sequence of one or more dictionary words.',
    constraints: ['1 <= len(s) <= 100', '1 <= len(wordDict) <= 1000'],
    testCases: [
      { title: 'Sample 1', input: '"catsanddog", ["cat","cats","and","sand","dog"]', output: '2' },
      { title: 'Sample 2', input: '"pineapplepenapple", ["apple","pen","applepen","pine","pineapple"]', output: '3' },
      { title: 'Impossible', input: '"catsandog", ["cats","dog","sand","and","cat"]', output: '0' },
      { title: 'Single', input: '"a", ["a"]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public long countWordBreakWays(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int n = s.length();
        long[] dp = new long[n + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] > 0 && dict.contains(s.substring(j, i))) dp[i] += dp[j];
            }
        }
        return dp[n];
    }
}`,
    pythonSolution: `def countWordBreakWays(s, wordDict):
    dict_set = set(wordDict)
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in dict_set:
                dp[i] += dp[j]
    return dp[n]`
  },
  {
    number: 7,
    difficulty: 'EXTREME',
    title: 'Minimum Number of Taps to Cover Interval [0, N]',
    fnName: 'minIntervalsToCover',
    description: 'Given an integer <code>n</code> and array <code>ranges</code> of length <code>n + 1</code> where tap <code>i</code> covers <code>[i - ranges[i], i + ranges[i]]</code>, return the minimum number of taps to cover the entire interval <code>[0, n]</code>, or <code>-1</code>.',
    constraints: ['1 <= n <= 10^4', '0 <= ranges[i] <= 100'],
    testCases: [
      { title: 'Sample 1', input: '5, [3,4,1,1,0,0]', output: '1' },
      { title: 'Impossible', input: '3, [0,0,0,0]', output: '-1' },
      { title: 'Sample 3', input: '7, [1,2,1,0,2,1,0,1]', output: '3' },
      { title: 'Exact', input: '4, [1,1,1,1,1]', output: '2' },
    ],
    javaSolution: `class Solution {
    public int minIntervalsToCover(int n, int[] ranges) {
        int[] maxReach = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            int l = Math.max(0, i - ranges[i]);
            int r = Math.min(n, i + ranges[i]);
            maxReach[l] = Math.max(maxReach[l], r);
        }
        int taps = 0, curEnd = 0, farthest = 0;
        for (int i = 0; i <= n; i++) {
            if (i > farthest) return -1;
            if (i > curEnd) { taps++; curEnd = farthest; }
            farthest = Math.max(farthest, maxReach[i]);
        }
        return taps;
    }
}`,
    pythonSolution: `def minIntervalsToCover(n, ranges):
    max_reach = [0] * (n + 1)
    for i, r in enumerate(ranges):
        left = max(0, i - r)
        right = min(n, i + r)
        if right > max_reach[left]:
            max_reach[left] = right
    taps = cur_end = farthest = 0
    for i in range(n + 1):
        if i > farthest:
            return -1
        if i > cur_end:
            taps += 1
            cur_end = farthest
        if max_reach[i] > farthest:
            farthest = max_reach[i]
    return taps`
  },
  {
    number: 8,
    difficulty: 'HARD',
    title: 'Longest Valid Parentheses Substring',
    fnName: 'longestValidParens',
    description: 'Given a string containing only <code>(</code> and <code>)</code>, return the length of the longest valid (well-formed) parentheses substring.',
    constraints: ['0 <= len(s) <= 3 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '"(()"', output: '2' },
      { title: 'Sample 2', input: '")()())"', output: '4' },
      { title: 'Empty', input: '""', output: '0' },
      { title: 'Nested', input: '"()(())"', output: '6' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int longestValidParens(String s) {
        Deque<Integer> st = new ArrayDeque<>();
        st.push(-1);
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') st.push(i);
            else {
                st.pop();
                if (st.isEmpty()) st.push(i);
                else best = Math.max(best, i - st.peek());
            }
        }
        return best;
    }
}`,
    pythonSolution: `def longestValidParens(s):
    st = [-1]
    best = 0
    for i, ch in enumerate(s):
        if ch == '(':
            st.append(i)
        else:
            st.pop()
            if not st:
                st.append(i)
            else:
                if i - st[-1] > best:
                    best = i - st[-1]
    return best`
  },
  {
    number: 9,
    difficulty: 'HARD',
    title: 'Distinct Subsequences Counting DP',
    fnName: 'numDistinctSubseq',
    description: 'Given strings <code>s</code> and <code>t</code>, return the number of distinct subsequences of <code>s</code> which equal <code>t</code> (modulo <code>10^9 + 7</code>).',
    constraints: ['1 <= len(s), len(t) <= 1000'],
    testCases: [
      { title: 'Sample 1', input: '"rabbbit", "rabbit"', output: '3' },
      { title: 'Sample 2', input: '"babgbag", "bag"', output: '5' },
      { title: 'None', input: '"abc", "d"', output: '0' },
      { title: 'Identical', input: '"aaa", "aaa"', output: '1' },
    ],
    javaSolution: `class Solution {
    public int numDistinctSubseq(String s, String t) {
        int MOD = 1_000_000_007, n = t.length();
        long[] dp = new long[n + 1];
        dp[0] = 1;
        for (char c : s.toCharArray()) {
            for (int j = n; j >= 1; j--) {
                if (c == t.charAt(j - 1)) dp[j] = (dp[j] + dp[j - 1]) % MOD;
            }
        }
        return (int) dp[n];
    }
}`,
    pythonSolution: `def numDistinctSubseq(s, t):
    MOD = 10**9 + 7
    n = len(t)
    dp = [0] * (n + 1)
    dp[0] = 1
    for ch in s:
        for j in range(n, 0, -1):
            if ch == t[j - 1]:
                dp[j] = (dp[j] + dp[j - 1]) % MOD
    return dp[n]`
  },
  {
    number: 10,
    difficulty: 'EXTREME',
    title: 'Regular Expression Matching With . and *',
    fnName: 'isRegexMatchFull',
    description: 'Implement full-string regular expression matching with support for <code>.</code> (any single char) and <code>*</code> (zero or more of the preceding element).',
    constraints: ['1 <= len(s), len(p) <= 20'],
    testCases: [
      { title: 'Sample 1', input: '"aa", "a"', output: 'false' },
      { title: 'Sample 2', input: '"aa", "a*"', output: 'true' },
      { title: 'Sample 3', input: '"ab", ".*"', output: 'true' },
      { title: 'Complex', input: '"aab", "c*a*b"', output: 'true' },
    ],
    javaSolution: `class Solution {
    public boolean isRegexMatchFull(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;
        for (int j = 2; j <= n; j++) if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                char pc = p.charAt(j - 1);
                if (pc == '*') {
                    dp[i][j] = dp[i][j - 2];
                    char prev = p.charAt(j - 2);
                    if (prev == '.' || prev == s.charAt(i - 1)) dp[i][j] |= dp[i - 1][j];
                } else if (pc == '.' || pc == s.charAt(i - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
        return dp[m][n];
    }
}`,
    pythonSolution: `def isRegexMatchFull(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                dp[i][j] = dp[i][j - 2]
                if p[j - 2] in ('.', s[i - 1]):
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
            elif p[j - 1] in ('.', s[i - 1]):
                dp[i][j] = dp[i - 1][j - 1]
    return dp[m][n]`
  },
  {
    number: 11,
    difficulty: 'HARD',
    title: 'Serialize and Deserialize Binary Tree Level Order',
    fnName: 'roundTripTreeLevelSum',
    description: 'Given a level-order array representation of a binary tree (with <code>null</code> for missing children), reconstruct the tree and return the sum of all nodes at the deepest level.',
    constraints: ['1 <= len(nodes) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[1,2,3,4,5,null,6,7,null,null,null,null,8]', output: '15' },
      { title: 'Single', input: '[42]', output: '42' },
      { title: 'Two levels', input: '[1, 2, 3]', output: '5' },
      { title: 'Right skewed', input: '[1, null, 2, null, 3]', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int roundTripTreeLevelSum(Integer[] nodes) {
        if (nodes.length == 0 || nodes[0] == null) return 0;
        Queue<Integer> q = new ArrayDeque<>();
        int idx = 1, lastSum = 0;
        // Build level by level using value queue
        List<Integer> cur = new ArrayList<>();
        cur.add(nodes[0]);
        while (!cur.isEmpty()) {
            lastSum = 0;
            List<Integer> nxt = new ArrayList<>();
            for (int v : cur) {
                lastSum += v;
                if (idx < nodes.length && nodes[idx] != null) nxt.add(nodes[idx]);
                idx++;
                if (idx < nodes.length && nodes[idx] != null) nxt.add(nodes[idx]);
                idx++;
            }
            cur = nxt;
        }
        return lastSum;
    }
}`,
    pythonSolution: `def roundTripTreeLevelSum(nodes):
    if not nodes or nodes[0] is None:
        return 0
    cur = [nodes[0]]
    idx = 1
    last_sum = 0
    while cur:
        last_sum = sum(cur)
        nxt = []
        for _ in cur:
            if idx < len(nodes) and nodes[idx] is not None:
                nxt.append(nodes[idx])
            idx += 1
            if idx < len(nodes) and nodes[idx] is not None:
                nxt.append(nodes[idx])
            idx += 1
        cur = nxt
    return last_sum`
  },
  {
    number: 12,
    difficulty: 'HARD',
    title: 'N-Queens Total Distinct Placements',
    fnName: 'totalNQueensSolutions',
    description: 'Given an integer <code>n</code>, return the number of distinct solutions to the <code>n</code>-queens puzzle using bitmask backtracking.',
    constraints: ['1 <= n <= 12'],
    testCases: [
      { title: 'n=4', input: '4', output: '2' },
      { title: 'n=1', input: '1', output: '1' },
      { title: 'n=8', input: '8', output: '92' },
      { title: 'n=3', input: '3', output: '0' },
    ],
    javaSolution: `class Solution {
    public int totalNQueensSolutions(int n) {
        return dfs(0, 0, 0, (1 << n) - 1);
    }
    int dfs(int cols, int d1, int d2, int full) {
        if (cols == full) return 1;
        int avail = full & ~(cols | d1 | d2), cnt = 0;
        while (avail != 0) {
            int p = avail & -avail;
            avail -= p;
            cnt += dfs(cols | p, (d1 | p) << 1, (d2 | p) >> 1, full);
        }
        return cnt;
    }
}`,
    pythonSolution: `def totalNQueensSolutions(n):
    full = (1 << n) - 1
    def dfs(cols, d1, d2):
        if cols == full:
            return 1
        avail = full & ~(cols | d1 | d2)
        cnt = 0
        while avail:
            p = avail & -avail
            avail -= p
            cnt += dfs(cols | p, ((d1 | p) << 1) & full, (d2 | p) >> 1)
        return cnt
    return dfs(0, 0, 0)`
  },
  {
    number: 13,
    difficulty: 'HARD',
    title: 'First Missing Positive in O(n) Time and O(1) Space',
    fnName: 'firstMissingPositiveInt',
    description: 'Given an unsorted integer array <code>nums</code>, return the smallest missing positive integer in <code>O(n)</code> time and <code>O(1)</code> auxiliary space.',
    constraints: ['1 <= len(nums) <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
    testCases: [
      { title: 'Sample 1', input: '[1, 2, 0]', output: '3' },
      { title: 'Sample 2', input: '[3, 4, -1, 1]', output: '2' },
      { title: 'Sample 3', input: '[7, 8, 9, 11, 12]', output: '1' },
      { title: 'Sequential', input: '[1, 2, 3, 4]', output: '5' },
    ],
    javaSolution: `class Solution {
    public int firstMissingPositiveInt(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int tmp = nums[nums[i] - 1];
                nums[nums[i] - 1] = nums[i];
                nums[i] = tmp;
            }
        }
        for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
}`,
    pythonSolution: `def firstMissingPositiveInt(nums):
    a = nums[:]
    n = len(a)
    for i in range(n):
        while 1 <= a[i] <= n and a[a[i] - 1] != a[i]:
            t = a[i] - 1
            a[i], a[t] = a[t], a[i]
    for i, x in enumerate(a):
        if x != i + 1:
            return i + 1
    return n + 1`
  },
  {
    number: 14,
    difficulty: 'HARD',
    title: 'Minimum Interval to Include Each Query',
    fnName: 'minIntervalPerQuery',
    description: 'Given intervals <code>[left, right]</code> (size = <code>right - left + 1</code>) and integer <code>queries</code>, for each query <code>q</code> return the size of the smallest interval containing <code>q</code>, or <code>-1</code>.',
    constraints: ['1 <= len(intervals), len(queries) <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '[[1,4],[2,4],[3,6],[4,4]], [2,3,4,5]', output: '[3, 3, 1, 4]' },
      { title: 'Sample 2', input: '[[2,3],[2,5],[1,8],[20,25]], [2,19,5,22]', output: '[2, -1, 4, 6]' },
      { title: 'No match', input: '[[1,2]], [5]', output: '[-1]' },
      { title: 'Point', input: '[[3,3]], [3]', output: '[1]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int[] minIntervalPerQuery(int[][] intervals, int[] queries) {
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        int[][] qs = new int[queries.length][2];
        for (int i = 0; i < queries.length; i++) { qs[i][0] = queries[i]; qs[i][1] = i; }
        Arrays.sort(qs, Comparator.comparingInt(a -> a[0]));
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        int[] ans = new int[queries.length];
        int i = 0;
        for (int[] q : qs) {
            while (i < intervals.length && intervals[i][0] <= q[0]) {
                pq.offer(new int[]{intervals[i][1] - intervals[i][0] + 1, intervals[i][1]});
                i++;
            }
            while (!pq.isEmpty() && pq.peek()[1] < q[0]) pq.poll();
            ans[q[1]] = pq.isEmpty() ? -1 : pq.peek()[0];
        }
        return ans;
    }
}`,
    pythonSolution: `import heapq

def minIntervalPerQuery(intervals, queries):
    ivs = sorted(intervals)
    ans = [-1] * len(queries)
    pq = []
    i = 0
    for q, qi in sorted((q, idx) for idx, q in enumerate(queries)):
        while i < len(ivs) and ivs[i][0] <= q:
            l, r = ivs[i]
            heapq.heappush(pq, (r - l + 1, r))
            i += 1
        while pq and pq[0][1] < q:
            heapq.heappop(pq)
        if pq:
            ans[qi] = pq[0][0]
    return ans`
  },
  {
    number: 15,
    difficulty: 'EXTREME',
    title: 'Modular Inverse & nCr Modulo 10^9+7',
    fnName: 'nCrModPrime',
    description: 'Given integers <code>n</code> and <code>r</code>, compute the binomial coefficient <code>C(n, r) mod (10^9 + 7)</code> using Fermat\'s Little Theorem modular inverses.',
    constraints: ['0 <= r <= n <= 10^5'],
    testCases: [
      { title: 'C(5, 2)', input: '5, 2', output: '10' },
      { title: 'C(100, 50)', input: '100, 50', output: '538992043' },
      { title: 'C(10, 0)', input: '10, 0', output: '1' },
      { title: 'C(10, 10)', input: '10, 10', output: '1' },
    ],
    javaSolution: `class Solution {
    static final long MOD = 1_000_000_007L;
    long powMod(long a, long b) {
        long r = 1;
        for (; b > 0; b >>= 1) { if ((b & 1) == 1) r = (r * a) % MOD; a = (a * a) % MOD; }
        return r;
    }
    public long nCrModPrime(int n, int r) {
        if (r < 0 || r > n) return 0;
        long num = 1, den = 1;
        for (int i = 0; i < r; i++) {
            num = (num * (n - i)) % MOD;
            den = (den * (i + 1)) % MOD;
        }
        return (num * powMod(den, MOD - 2)) % MOD;
    }
}`,
    pythonSolution: `def nCrModPrime(n, r):
    MOD = 10**9 + 7
    if r < 0 or r > n:
        return 0
    r = min(r, n - r)
    num = den = 1
    for i in range(r):
        num = (num * (n - i)) % MOD
        den = (den * (i + 1)) % MOD
    return (num * pow(den, MOD - 2, MOD)) % MOD`
  },
  {
    number: 16,
    difficulty: 'HARD',
    title: 'Median of Two Sorted Arrays O(log(min(m, n)))',
    fnName: 'findMedianSortedArrays',
    description: 'Given two sorted integer arrays <code>nums1</code> and <code>nums2</code>, return the median of the combined sorted array in <code>O(log(min(m, n)))</code> time.',
    constraints: ['0 <= len(nums1), len(nums2) <= 10^5', 'len(nums1) + len(nums2) >= 1'],
    testCases: [
      { title: 'Odd total', input: '[1, 3], [2]', output: '2.0' },
      { title: 'Even total', input: '[1, 2], [3, 4]', output: '2.5' },
      { title: 'Empty first', input: '[], [5, 7]', output: '6.0' },
      { title: 'Single', input: '[10], []', output: '10.0' },
    ],
    javaSolution: `class Solution {
    public double findMedianSortedArrays(int[] a, int[] b) {
        if (a.length > b.length) return findMedianSortedArrays(b, a);
        int m = a.length, n = b.length, lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = (m + n + 1) / 2 - i;
            int aL = i == 0 ? Integer.MIN_VALUE : a[i - 1];
            int aR = i == m ? Integer.MAX_VALUE : a[i];
            int bL = j == 0 ? Integer.MIN_VALUE : b[j - 1];
            int bR = j == n ? Integer.MAX_VALUE : b[j];
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2 == 1) return (double) Math.max(aL, bL);
                return (Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;
            } else if (aL > bR) hi = i - 1;
            else lo = i + 1;
        }
        return 0.0;
    }
}`,
    pythonSolution: `def findMedianSortedArrays(nums1, nums2):
    a, b = nums1, nums2
    if len(a) > len(b):
        a, b = b, a
    m, n = len(a), len(b)
    lo, hi = 0, m
    INF = 10**18
    while lo <= hi:
        i = (lo + hi) // 2
        j = (m + n + 1) // 2 - i
        aL = -INF if i == 0 else a[i - 1]
        aR = INF if i == m else a[i]
        bL = -INF if j == 0 else b[j - 1]
        bR = INF if j == n else b[j]
        if aL <= bR and bL <= aR:
            if (m + n) % 2 == 1:
                return float(max(aL, bL))
            return (max(aL, bL) + min(aR, bR)) / 2.0
        elif aL > bR:
            hi = i - 1
        else:
            lo = i + 1
    return 0.0`
  },
  {
    number: 17,
    difficulty: 'HARD',
    title: 'LFU Cache Simulation',
    fnName: 'simulateLfuCache',
    description: 'Simulate an LFU cache of capacity <code>cap</code> supporting <code>["PUT", k, v]</code> and <code>["GET", k]</code> (evicting the least frequently used key, breaking ties by least recently used). Return list of <code>GET</code> results.',
    constraints: ['1 <= cap <= 10^4', '1 <= len(ops) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '2, [["PUT",1,1],["PUT",2,2],["GET",1],["PUT",3,3],["GET",2],["GET",3],["PUT",4,4],["GET",1],["GET",3],["GET",4]]', output: '[1, -1, 3, -1, 3, 4]' },
      { title: 'Update freq', input: '2, [["PUT",1,10],["PUT",2,20],["GET",1],["GET",1],["PUT",3,30],["GET",2]]', output: '[10, 10, -1]' },
      { title: 'Single cap', input: '1, [["PUT",1,1],["PUT",2,2],["GET",1],["GET",2]]', output: '[-1, 2]' },
      { title: 'Miss', input: '2, [["GET",99]]', output: '[-1]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Integer> simulateLfuCache(int cap, List<List<Object>> ops) {
        Map<Integer, Integer> val = new HashMap<>(), freq = new HashMap<>();
        Map<Integer, LinkedHashSet<Integer>> buckets = new HashMap<>();
        int minF = 0;
        List<Integer> res = new ArrayList<>();
        for (List<Object> op : ops) {
            String cmd = (String) op.get(0);
            int k = (Integer) op.get(1);
            if ("GET".equals(cmd)) {
                if (!val.containsKey(k)) { res.add(-1); continue; }
                int f = freq.get(k);
                buckets.get(f).remove(k);
                if (f == minF && buckets.get(f).isEmpty()) minF++;
                freq.put(k, f + 1);
                buckets.computeIfAbsent(f + 1, x -> new LinkedHashSet<>()).add(k);
                res.add(val.get(k));
            } else {
                int v = (Integer) op.get(2);
                if (cap == 0) continue;
                if (val.containsKey(k)) {
                    val.put(k, v);
                    int f = freq.get(k);
                    buckets.get(f).remove(k);
                    if (f == minF && buckets.get(f).isEmpty()) minF++;
                    freq.put(k, f + 1);
                    buckets.computeIfAbsent(f + 1, x -> new LinkedHashSet<>()).add(k);
                } else {
                    if (val.size() == cap) {
                        int evict = buckets.get(minF).iterator().next();
                        buckets.get(minF).remove(evict);
                        val.remove(evict); freq.remove(evict);
                    }
                    val.put(k, v); freq.put(k, 1); minF = 1;
                    buckets.computeIfAbsent(1, x -> new LinkedHashSet<>()).add(k);
                }
            }
        }
        return res;
    }
}`,
    pythonSolution: `from collections import defaultdict, OrderedDict

def simulateLfuCache(cap, ops):
    val = {}
    freq = {}
    buckets = defaultdict(OrderedDict)
    min_f = 0
    res = []
    def touch(k):
        nonlocal min_f
        f = freq[k]
        del buckets[f][k]
        if f == min_f and not buckets[f]:
            min_f += 1
        freq[k] = f + 1
        buckets[f + 1][k] = None
    for op in ops:
        if op[0] == "GET":
            k = op[1]
            if k not in val:
                res.append(-1)
            else:
                touch(k)
                res.append(val[k])
        else:
            k, v = op[1], op[2]
            if cap == 0:
                continue
            if k in val:
                val[k] = v
                touch(k)
            else:
                if len(val) == cap:
                    evict, _ = buckets[min_f].popitem(last=False)
                    del val[evict]
                    del freq[evict]
                val[k] = v
                freq[k] = 1
                min_f = 1
                buckets[1][k] = None
    return res`
  },
  {
    number: 18,
    difficulty: 'HARD',
    title: 'Minimum Cost to Hire / Schedule Jobs With Deadlines & Profits',
    fnName: 'jobSchedulingMaxProfit',
    description: 'Given jobs with <code>[startTime, endTime, profit]</code>, return the maximum profit from any non-overlapping subset of jobs.',
    constraints: ['1 <= len(jobs) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[1,2,3,3], [3,4,5,6], [50,10,40,70]', output: '120' },
      { title: 'Sample 2', input: '[1,2,3,4,6], [3,5,10,6,9], [20,20,100,70,60]', output: '150' },
      { title: 'Sample 3', input: '[1,1,1], [2,3,4], [5,6,4]', output: '6' },
      { title: 'Single', input: '[1], [5], [100]', output: '100' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int jobSchedulingMaxProfit(int[] startTime, int[] endTime, int[] profit) {
        int n = startTime.length;
        int[][] jobs = new int[n][3];
        for (int i = 0; i < n; i++) jobs[i] = new int[]{startTime[i], endTime[i], profit[i]};
        Arrays.sort(jobs, Comparator.comparingInt(a -> a[1]));
        TreeMap<Integer, Integer> dp = new TreeMap<>();
        dp.put(0, 0);
        for (int[] j : jobs) {
            int cur = dp.floorEntry(j[0]).getValue() + j[2];
            if (cur > dp.lastEntry().getValue()) dp.put(j[1], cur);
        }
        return dp.lastEntry().getValue();
    }
}`,
    pythonSolution: `import bisect

def jobSchedulingMaxProfit(startTime, endTime, profit):
    jobs = sorted(zip(endTime, startTime, profit))
    ends = [0]
    dp = [0]
    for e, s, p in jobs:
        idx = bisect.bisect_right(ends, s) - 1
        cand = dp[idx] + p
        if cand > dp[-1]:
            ends.append(e)
            dp.append(cand)
    return dp[-1]`
  },
  {
    number: 19,
    difficulty: 'EXTREME',
    title: 'Minimum Number of Refueling / Bursting Balloons / Stone Game IV',
    fnName: 'stoneGameOptimalDiff',
    description: 'Two players take turns removing <code>1</code> to <code>2*M</code> piles from the front of <code>piles</code> (initially <code>M = 1</code>, updated to <code>max(M, X)</code>). Return the maximum stones the first player can collect assuming both play optimally.',
    constraints: ['1 <= len(piles) <= 100', '1 <= piles[i] <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[2, 7, 9, 4, 4]', output: '10' },
      { title: 'Sample 2', input: '[1, 2, 3, 4, 5, 100]', output: '104' },
      { title: 'Single', input: '[5]', output: '5' },
      { title: 'Two', input: '[3, 8]', output: '11' },
    ],
    javaSolution: `class Solution {
    public int stoneGameOptimalDiff(int[] piles) {
        int n = piles.length;
        int[] suf = new int[n + 1];
        for (int i = n - 1; i >= 0; i--) suf[i] = suf[i + 1] + piles[i];
        int[][] dp = new int[n + 1][n + 1];
        for (int i = n - 1; i >= 0; i--) {
            for (int m = 1; m <= n; m++) {
                if (i + 2 * m >= n) dp[i][m] = suf[i];
                else {
                    for (int x = 1; x <= 2 * m; x++) {
                        dp[i][m] = Math.max(dp[i][m], suf[i] - dp[i + x][Math.max(m, x)]);
                    }
                }
            }
        }
        return dp[0][1];
    }
}`,
    pythonSolution: `from functools import lru_cache

def stoneGameOptimalDiff(piles):
    n = len(piles)
    suf = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        suf[i] = suf[i + 1] + piles[i]
    @lru_cache(None)
    def dp(i, m):
        if i + 2 * m >= n:
            return suf[i]
        return max(suf[i] - dp(i + x, max(m, x)) for x in range(1, 2 * m + 1))
    return dp(0, 1)`
  },
  {
    number: 20,
    difficulty: 'HARD',
    title: 'Maximum Sum of 3 Non-Overlapping Subarrays',
    fnName: 'maxSumThreeSubarrays',
    description: 'Given an integer array <code>nums</code> and integer <code>k</code>, find three non-overlapping subarrays of length <code>k</code> with maximum sum, returning their starting indices (lexicographically smallest on tie).',
    constraints: ['3 * k <= len(nums) <= 2 * 10^4', '1 <= k'],
    testCases: [
      { title: 'Sample 1', input: '[1,2,1,2,6,7,5,1], 2', output: '[0, 3, 5]' },
      { title: 'Sample 2', input: '[1,2,1,2,1,2,1,2,1], 2', output: '[0, 2, 4]' },
      { title: 'k=1', input: '[4, 3, 2, 1], 1', output: '[0, 1, 2]' },
      { title: 'Tail heavy', input: '[1, 1, 1, 10, 10, 10], 1', output: '[3, 4, 5]' },
    ],
    javaSolution: `class Solution {
    public int[] maxSumThreeSubarrays(int[] nums, int k) {
        int n = nums.length, m = n - k + 1;
        int[] win = new int[m];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += nums[i];
            if (i >= k) sum -= nums[i - k];
            if (i >= k - 1) win[i - k + 1] = sum;
        }
        int[] left = new int[m], right = new int[m];
        int best = 0;
        for (int i = 0; i < m; i++) { if (win[i] > win[best]) best = i; left[i] = best; }
        best = m - 1;
        for (int i = m - 1; i >= 0; i--) { if (win[i] >= win[best]) best = i; right[i] = best; }
        int[] ans = {-1, -1, -1};
        for (int mid = k; mid < m - k; mid++) {
            int l = left[mid - k], r = right[mid + k];
            if (ans[0] == -1 || win[l] + win[mid] + win[r] > win[ans[0]] + win[ans[1]] + win[ans[2]]) {
                ans[0] = l; ans[1] = mid; ans[2] = r;
            }
        }
        return ans;
    }
}`,
    pythonSolution: `def maxSumThreeSubarrays(nums, k):
    n = len(nums)
    m = n - k + 1
    win = [0] * m
    s = sum(nums[:k])
    win[0] = s
    for i in range(1, m):
        s += nums[i + k - 1] - nums[i - 1]
        win[i] = s
    left = [0] * m
    best = 0
    for i in range(m):
        if win[i] > win[best]:
            best = i
        left[i] = best
    right = [0] * m
    best = m - 1
    for i in range(m - 1, -1, -1):
        if win[i] >= win[best]:
            best = i
        right[i] = best
    ans = None
    best_sum = -1
    for mid in range(k, m - k):
        l, r = left[mid - k], right[mid + k]
        tot = win[l] + win[mid] + win[r]
        if tot > best_sum:
            best_sum = tot
            ans = [l, mid, r]
    return ans`
  }
];
