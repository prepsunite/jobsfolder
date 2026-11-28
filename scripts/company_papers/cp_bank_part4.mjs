// Pure Competitive Programming & Extreme DSA Bank — Part 4 (16 Heavy Multi-Step Problems)
// Focus: Binary Lifting Path Max, Tree Rerooting Max Distance, Offline Trie XOR Queries,
//        Offline DSU Threshold Queries, Segment Tree Lazy Assignment, Held-Karp TSP Bitmask DP,
//        Hat Assignment Bitmask DP, 3D Parenthesis Grid DP, Tree Edge Reversal Rerooting.
export const CP_BANK_PART4 = [
  {
    number: 1,
    difficulty: 'EXTREME',
    title: 'Binary Lifting Maximum Edge Weight on Tree Path',
    fnName: 'maxEdgeOnTreePathQueries',
    description: 'Given a weighted undirected tree of <code>n</code> nodes (0-indexed) with edges <code>[u, v, w]</code> and queries <code>[a, b]</code>, return the maximum edge weight on the unique simple path between <code>a</code> and <code>b</code> for each query using Binary Lifting in <code>O((n + q) log n)</code>.',
    constraints: ['1 <= n <= 5 * 10^4', '1 <= w <= 10^9', '1 <= len(queries) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '5, [[0,1,4],[0,2,7],[1,3,2],[1,4,9]], [[3,4],[3,2],[0,1],[2,4]]', output: '[9, 7, 4, 9]' },
      { title: 'Chain', input: '4, [[0,1,10],[1,2,3],[2,3,8]], [[0,3],[1,2],[0,2]]', output: '[10, 3, 10]' },
      { title: 'Same node', input: '3, [[0,1,5],[1,2,6]], [[1,1],[2,2]]', output: '[0, 0]' },
      { title: 'Star', input: '4, [[0,1,1],[0,2,5],[0,3,3]], [[1,3],[1,2]]', output: '[3, 5]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int[] maxEdgeOnTreePathQueries(int n, int[][] edges, int[][] queries) {
        int LOG = 17;
        List<int[]>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(new int[]{e[1], e[2]}); g[e[1]].add(new int[]{e[0], e[2]}); }
        int[][] up = new int[n][LOG], mx = new int[n][LOG];
        int[] depth = new int[n];
        boolean[] vis = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(0); vis[0] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int[] nb : g[u]) if (!vis[nb[0]]) {
                int v = nb[0], w = nb[1];
                vis[v] = true; depth[v] = depth[u] + 1; up[v][0] = u; mx[v][0] = w;
                for (int k = 1; k < LOG; k++) {
                    up[v][k] = up[up[v][k - 1]][k - 1];
                    mx[v][k] = Math.max(mx[v][k - 1], mx[up[v][k - 1]][k - 1]);
                }
                q.offer(v);
            }
        }
        int[] res = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int u = queries[i][0], v = queries[i][1], ans = 0;
            if (depth[u] < depth[v]) { int t = u; u = v; v = t; }
            int diff = depth[u] - depth[v];
            for (int k = 0; k < LOG; k++) if (((diff >> k) & 1) != 0) { ans = Math.max(ans, mx[u][k]); u = up[u][k]; }
            if (u != v) {
                for (int k = LOG - 1; k >= 0; k--) if (up[u][k] != up[v][k]) {
                    ans = Math.max(ans, Math.max(mx[u][k], mx[v][k]));
                    u = up[u][k]; v = up[v][k];
                }
                ans = Math.max(ans, Math.max(mx[u][0], mx[v][0]));
            }
            res[i] = ans;
        }
        return res;
    }
}`,
    pythonSolution: `from collections import deque

def maxEdgeOnTreePathQueries(n, edges, queries):
    LOG = 17
    g = [[] for _ in range(n)]
    for u, v, w in edges:
        g[u].append((v, w))
        g[v].append((u, w))
    up = [[0] * LOG for _ in range(n)]
    mx = [[0] * LOG for _ in range(n)]
    depth = [0] * n
    vis = [False] * n
    vis[0] = True
    q = deque([0])
    while q:
        u = q.popleft()
        for v, w in g[u]:
            if not vis[v]:
                vis[v] = True
                depth[v] = depth[u] + 1
                up[v][0] = u
                mx[v][0] = w
                for k in range(1, LOG):
                    p = up[v][k - 1]
                    up[v][k] = up[p][k - 1]
                    mx[v][k] = max(mx[v][k - 1], mx[p][k - 1])
                q.append(v)
    res = []
    for u, v in queries:
        if depth[u] < depth[v]:
            u, v = v, u
        ans = 0
        diff = depth[u] - depth[v]
        for k in range(LOG):
            if (diff >> k) & 1:
                ans = max(ans, mx[u][k])
                u = up[u][k]
        if u != v:
            for k in range(LOG - 1, -1, -1):
                if up[u][k] != up[v][k]:
                    ans = max(ans, mx[u][k], mx[v][k])
                    u = up[u][k]
                    v = up[v][k]
            ans = max(ans, mx[u][0], mx[v][0])
        res.append(ans)
    return res`
  },
  {
    number: 2,
    difficulty: 'EXTREME',
    title: 'Tree Rerooting DP Maximum Distance From Every Node',
    fnName: 'maxDistanceFromEachTreeNode',
    description: 'Given an unweighted undirected tree of <code>n</code> nodes and <code>edges</code>, compute for every node <code>i</code> the maximum distance (number of edges) from node <code>i</code> to any other node in the tree in <code>O(n)</code> using Rerooting DP.',
    constraints: ['1 <= n <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '5, [[0,1],[1,2],[1,3],[3,4]]', output: '[3, 2, 3, 2, 3]' },
      { title: 'Line 4', input: '4, [[0,1],[1,2],[2,3]]', output: '[3, 2, 2, 3]' },
      { title: 'Star', input: '4, [[0,1],[0,2],[0,3]]', output: '[1, 2, 2, 2]' },
      { title: 'Single', input: '1, []', output: '[0]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int[] maxDistanceFromEachTreeNode(int n, int[][] edges) {
        if (n <= 1) return new int[]{0};
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        int[] d1 = bfs(0, n, g);
        int a = 0;
        for (int i = 0; i < n; i++) if (d1[i] > d1[a]) a = i;
        int[] da = bfs(a, n, g);
        int b = 0;
        for (int i = 0; i < n; i++) if (da[i] > da[b]) b = i;
        int[] db = bfs(b, n, g);
        int[] ans = new int[n];
        for (int i = 0; i < n; i++) ans[i] = Math.max(da[i], db[i]);
        return ans;
    }
    int[] bfs(int start, int n, List<Integer>[] g) {
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        Queue<Integer> q = new ArrayDeque<>();
        dist[start] = 0; q.offer(start);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g[u]) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.offer(v); }
        }
        return dist;
    }
}`,
    pythonSolution: `from collections import deque

def maxDistanceFromEachTreeNode(n, edges):
    if n <= 1:
        return [0]
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    def bfs(s):
        d = [-1] * n
        d[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for v in g[u]:
                if d[v] == -1:
                    d[v] = d[u] + 1
                    q.append(v)
        return d
    d0 = bfs(0)
    a = max(range(n), key=lambda i: d0[i])
    da = bfs(a)
    b = max(range(n), key=lambda i: da[i])
    db = bfs(b)
    return [max(da[i], db[i]) for i in range(n)]`
  },
  {
    number: 3,
    difficulty: 'EXTREME',
    title: 'Minimum Edge Reversals So Every Node Reaches Root',
    fnName: 'minEdgeReversalsFromEachNode',
    description: 'Given a directed tree of <code>n</code> nodes (if edges were undirected, it forms a tree) with directed edges <code>[u, v]</code>, return an array <code>ans</code> where <code>ans[i]</code> is the minimum number of edge reversals needed so node <code>i</code> can reach all other nodes.',
    constraints: ['2 <= n <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '4, [[2,0],[2,1],[1,3]]', output: '[1, 1, 0, 2]' },
      { title: 'Sample 2', input: '3, [[1,2],[2,0]]', output: '[2, 0, 1]' },
      { title: 'Two nodes', input: '2, [[0,1]]', output: '[0, 1]' },
      { title: 'Star out', input: '4, [[0,1],[0,2],[0,3]]', output: '[0, 1, 1, 1]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int[] minEdgeReversalsFromEachNode(int n, int[][] edges) {
        List<int[]>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(new int[]{e[1], 0}); g[e[1]].add(new int[]{e[0], 1}); }
        int[] ans = new int[n];
        ans[0] = dfs1(0, -1, g);
        dfs2(0, -1, g, ans);
        return ans;
    }
    int dfs1(int u, int p, List<int[]>[] g) {
        int sum = 0;
        for (int[] nb : g[u]) if (nb[0] != p) sum += nb[1] + dfs1(nb[0], u, g);
        return sum;
    }
    void dfs2(int u, int p, List<int[]>[] g, int[] ans) {
        for (int[] nb : g[u]) if (nb[0] != p) {
            ans[nb[0]] = ans[u] + (nb[1] == 0 ? 1 : -1);
            dfs2(nb[0], u, g, ans);
        }
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def minEdgeReversalsFromEachNode(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append((v, 0))
        g[v].append((u, 1))
    ans = [0] * n
    def dfs1(u, p):
        s = 0
        for v, cost in g[u]:
            if v != p:
                s += cost + dfs1(v, u)
        return s
    def dfs2(u, p):
        for v, cost in g[u]:
            if v != p:
                ans[v] = ans[u] + (1 if cost == 0 else -1)
                dfs2(v, u)
    ans[0] = dfs1(0, -1)
    dfs2(0, -1)
    return ans`
  },
  {
    number: 4,
    difficulty: 'EXTREME',
    title: 'Offline Bitwise Trie Maximum XOR With Threshold Queries',
    fnName: 'maxXorWithLimitQueries',
    description: 'Given an array <code>nums</code> and queries <code>[xi, mi]</code>, for each query return the maximum value of <code>xi ^ nums[j]</code> over all <code>nums[j] <= mi</code>, or <code>-1</code> if all elements exceed <code>mi</code>.',
    constraints: ['1 <= len(nums), len(queries) <= 10^5', '0 <= nums[i], xi, mi <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[0,1,2,3,4], [[3,1],[1,3],[5,6]]', output: '[3, 3, 7]' },
      { title: 'Sample 2', input: '[5,2,4,6,6,3], [[12,4],[8,1],[6,3]]', output: '[15, -1, 5]' },
      { title: 'Single', input: '[7], [[3,7],[3,6]]', output: '[4, -1]' },
      { title: 'Zero', input: '[0], [[0,0]]', output: '[0]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    static class Node { Node[] ch = new Node[2]; }
    public int[] maxXorWithLimitQueries(int[] nums, int[][] queries) {
        Arrays.sort(nums);
        int qn = queries.length;
        int[][] qs = new int[qn][3];
        for (int i = 0; i < qn; i++) qs[i] = new int[]{queries[i][1], queries[i][0], i};
        Arrays.sort(qs, Comparator.comparingInt(a -> a[0]));
        Node root = new Node();
        int[] ans = new int[qn];
        int idx = 0;
        for (int[] q : qs) {
            while (idx < nums.length && nums[idx] <= q[0]) {
                Node cur = root;
                for (int b = 30; b >= 0; b--) {
                    int bit = (nums[idx] >> b) & 1;
                    if (cur.ch[bit] == null) cur.ch[bit] = new Node();
                    cur = cur.ch[bit];
                }
                idx++;
            }
            if (idx == 0) { ans[q[2]] = -1; continue; }
            Node cur = root;
            int res = 0;
            for (int b = 30; b >= 0; b--) {
                int bit = (q[1] >> b) & 1;
                if (cur.ch[1 - bit] != null) { res |= (1 << b); cur = cur.ch[1 - bit]; }
                else cur = cur.ch[bit];
            }
            ans[q[2]] = res;
        }
        return ans;
    }
}`,
    pythonSolution: `def maxXorWithLimitQueries(nums, queries):
    nums = sorted(nums)
    qs = sorted((m, x, i) for i, (x, m) in enumerate(queries))
    trie = {}
    ans = [-1] * len(queries)
    idx = 0
    for m, x, qi in qs:
        while idx < len(nums) and nums[idx] <= m:
            cur = trie
            v = nums[idx]
            for b in range(30, -1, -1):
                bit = (v >> b) & 1
                if bit not in cur:
                    cur[bit] = {}
                cur = cur[bit]
            idx += 1
        if idx == 0:
            continue
        cur = trie
        best = 0
        for b in range(30, -1, -1):
            bit = (x >> b) & 1
            if (1 - bit) in cur:
                best |= 1 << b
                cur = cur[1 - bit]
            else:
                cur = cur[bit]
        ans[qi] = best
    return ans`
  },
  {
    number: 5,
    difficulty: 'EXTREME',
    title: 'Offline DSU Distance-Limited Edge Existence Queries',
    fnName: 'distanceLimitedPathsExist',
    description: 'Given <code>n</code> nodes, undirected weighted edges <code>[u, v, dis]</code>, and queries <code>[p, q, limit]</code>, return a boolean array where <code>ans[i]</code> is <code>true</code> iff there is a path between <code>p</code> and <code>q</code> whose every edge weight is strictly less than <code>limit</code>.',
    constraints: ['2 <= n <= 10^5', '1 <= len(edgeList), len(queries) <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '3, [[0,1,2],[1,2,4],[2,0,8],[1,0,16]], [[0,1,2],[0,2,5]]', output: '[false, true]' },
      { title: 'Sample 2', input: '5, [[0,1,10],[1,2,10],[2,3,10],[0,3,1]], [[0,3,2],[0,2,11]]', output: '[true, true]' },
      { title: 'Disconnected', input: '4, [[0,1,3],[2,3,4]], [[0,3,100]]', output: '[false]' },
      { title: 'Strict less', input: '2, [[0,1,5]], [[0,1,5],[0,1,6]]', output: '[false, true]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
    public boolean[] distanceLimitedPathsExist(int n, int[][] edgeList, int[][] queries) {
        Arrays.sort(edgeList, Comparator.comparingInt(a -> a[2]));
        int qn = queries.length;
        int[][] qs = new int[qn][4];
        for (int i = 0; i < qn; i++) qs[i] = new int[]{queries[i][2], queries[i][0], queries[i][1], i};
        Arrays.sort(qs, Comparator.comparingInt(a -> a[0]));
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        boolean[] ans = new boolean[qn];
        int ei = 0;
        for (int[] q : qs) {
            while (ei < edgeList.length && edgeList[ei][2] < q[0]) {
                int a = find(p, edgeList[ei][0]), b = find(p, edgeList[ei][1]);
                if (a != b) p[a] = b;
                ei++;
            }
            ans[q[3]] = find(p, q[1]) == find(p, q[2]);
        }
        return ans;
    }
}`,
    pythonSolution: `def distanceLimitedPathsExist(n, edgeList, queries):
    edges = sorted(edgeList, key=lambda e: e[2])
    qs = sorted((lim, u, v, i) for i, (u, v, lim) in enumerate(queries))
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x
    ans = [False] * len(queries)
    ei = 0
    for lim, u, v, qi in qs:
        while ei < len(edges) and edges[ei][2] < lim:
            ru, rv = find(edges[ei][0]), find(edges[ei][1])
            if ru != rv:
                p[ru] = rv
            ei += 1
        ans[qi] = find(u) == find(v)
    return ans`
  },
  {
    number: 6,
    difficulty: 'EXTREME',
    title: 'Segment Tree Lazy Range Assignment & Range Sum',
    fnName: 'segmentTreeRangeAssignSum',
    description: 'Maintain an array of <code>n</code> zeros. Process queries: <code>[1, l, r, val]</code> assigns <code>val</code> to every index in <code>[l..r]</code>; <code>[2, l, r]</code> returns the sum over <code>[l..r]</code>. Return answers for all type-2 queries.',
    constraints: ['1 <= n <= 10^5', '1 <= len(queries) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '5, [[1,0,3,5],[2,1,4],[1,2,4,2],[2,0,4]]', output: '[15, 16]' },
      { title: 'Overwrite zero', input: '4, [[1,0,3,10],[1,1,2,0],[2,0,3]]', output: '[20]' },
      { title: 'Single', input: '1, [[1,0,0,7],[2,0,0]]', output: '[7]' },
      { title: 'Initial zero', input: '3, [[2,0,2]]', output: '[0]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    long[] tree, lazy;
    boolean[] hasLazy;
    void push(int node, int l, int r) {
        if (hasLazy[node]) {
            int mid = (l + r) / 2;
            long v = lazy[node];
            tree[2 * node] = v * (mid - l + 1); lazy[2 * node] = v; hasLazy[2 * node] = true;
            tree[2 * node + 1] = v * (r - mid); lazy[2 * node + 1] = v; hasLazy[2 * node + 1] = true;
            hasLazy[node] = false;
        }
    }
    void update(int node, int l, int r, int ql, int qr, long val) {
        if (ql <= l && r <= qr) { tree[node] = val * (r - l + 1); lazy[node] = val; hasLazy[node] = true; return; }
        push(node, l, r);
        int mid = (l + r) / 2;
        if (ql <= mid) update(2 * node, l, mid, ql, qr, val);
        if (qr > mid) update(2 * node + 1, mid + 1, r, ql, qr, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
    long query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        push(node, l, r);
        int mid = (l + r) / 2;
        long s = 0;
        if (ql <= mid) s += query(2 * node, l, mid, ql, qr);
        if (qr > mid) s += query(2 * node + 1, mid + 1, r, ql, qr);
        return s;
    }
    public List<Long> segmentTreeRangeAssignSum(int n, int[][] queries) {
        tree = new long[4 * n]; lazy = new long[4 * n]; hasLazy = new boolean[4 * n];
        List<Long> res = new ArrayList<>();
        for (int[] q : queries) {
            if (q[0] == 1) update(1, 0, n - 1, q[1], q[2], q[3]);
            else res.add(query(1, 0, n - 1, q[1], q[2]));
        }
        return res;
    }
}`,
    pythonSolution: `def segmentTreeRangeAssignSum(n, queries):
    tree = [0] * (4 * n)
    lazy = [0] * (4 * n)
    has_lazy = [False] * (4 * n)
    def push(node, l, r):
        if has_lazy[node]:
            mid = (l + r) // 2
            v = lazy[node]
            tree[2 * node] = v * (mid - l + 1)
            lazy[2 * node] = v
            has_lazy[2 * node] = True
            tree[2 * node + 1] = v * (r - mid)
            lazy[2 * node + 1] = v
            has_lazy[2 * node + 1] = True
            has_lazy[node] = False
    def update(node, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            tree[node] = val * (r - l + 1)
            lazy[node] = val
            has_lazy[node] = True
            return
        push(node, l, r)
        mid = (l + r) // 2
        if ql <= mid:
            update(2 * node, l, mid, ql, qr, val)
        if qr > mid:
            update(2 * node + 1, mid + 1, r, ql, qr, val)
        tree[node] = tree[2 * node] + tree[2 * node + 1]
    def query(node, l, r, ql, qr):
        if ql <= l and r <= qr:
            return tree[node]
        push(node, l, r)
        mid = (l + r) // 2
        s = 0
        if ql <= mid:
            s += query(2 * node, l, mid, ql, qr)
        if qr > mid:
            s += query(2 * node + 1, mid + 1, r, ql, qr)
        return s
    res = []
    for q in queries:
        if q[0] == 1:
            update(1, 0, n - 1, q[1], q[2], q[3])
        else:
            res.append(query(1, 0, n - 1, q[1], q[2]))
    return res`
  },
  {
    number: 7,
    difficulty: 'EXTREME',
    title: 'Held-Karp Bitmask DP Traveling Salesperson Tour',
    fnName: 'minTspTourCost',
    description: 'Given a complete directed weighted graph <code>dist[i][j]</code> of <code>n</code> nodes, return the minimum cost of a Hamiltonian cycle starting and ending at node <code>0</code> that visits every node exactly once.',
    constraints: ['2 <= n <= 16', '0 <= dist[i][j] <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]', output: '80' },
      { title: 'Asymmetric', input: '[[0,2,9,10],[1,0,6,4],[15,7,0,8],[6,3,12,0]]', output: '21' },
      { title: '2 nodes', input: '[[0,5],[7,0]]', output: '12' },
      { title: '3 nodes', input: '[[0,1,4],[4,0,2],[1,4,0]]', output: '4' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minTspTourCost(int[][] dist) {
        int n = dist.length, N = 1 << n;
        int[][] dp = new int[N][n];
        for (int[] r : dp) Arrays.fill(r, Integer.MAX_VALUE / 2);
        dp[1][0] = 0;
        for (int mask = 1; mask < N; mask++) {
            for (int u = 0; u < n; u++) if ((mask & (1 << u)) != 0) {
                for (int v = 0; v < n; v++) if ((mask & (1 << v)) == 0) {
                    dp[mask | (1 << v)][v] = Math.min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v]);
                }
            }
        }
        int ans = Integer.MAX_VALUE;
        for (int u = 1; u < n; u++) ans = Math.min(ans, dp[N - 1][u] + dist[u][0]);
        return ans;
    }
}`,
    pythonSolution: `def minTspTourCost(dist):
    n = len(dist)
    N = 1 << n
    INF = 10**18
    dp = [[INF] * n for _ in range(N)]
    dp[1][0] = 0
    for mask in range(1, N):
        for u in range(n):
            if not (mask & (1 << u)) or dp[mask][u] == INF:
                continue
            base = dp[mask][u]
            for v in range(n):
                if not (mask & (1 << v)):
                    nm = mask | (1 << v)
                    val = base + dist[u][v]
                    if val < dp[nm][v]:
                        dp[nm][v] = val
    return min(dp[N - 1][u] + dist[u][0] for u in range(1, n))`
  },
  {
    number: 8,
    difficulty: 'EXTREME',
    title: 'Bitmask DP Distinct Item Assignment (Number of Ways)',
    fnName: 'countDistinctHatAssignments',
    description: 'Given <code>n</code> people and <code>hats[i]</code> listing the preferred item IDs (1..40) for person <code>i</code>, return the number of ways all <code>n</code> people can each wear a distinct preferred item modulo <code>10^9 + 7</code>.',
    constraints: ['1 <= n <= 10', '1 <= item ID <= 40'],
    testCases: [
      { title: 'Sample 1', input: '[[3,4],[4,5],[5]]', output: '1' },
      { title: 'Sample 2', input: '[[3,5,1],[3,5]]', output: '4' },
      { title: 'Sample 3', input: '[[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4]]', output: '24' },
      { title: 'Impossible', input: '[[1],[1]]', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int countDistinctHatAssignments(List<List<Integer>> hats) {
        int n = hats.size(), MOD = 1_000_000_007, N = 1 << n;
        List<Integer>[] hatToPeople = new ArrayList[41];
        for (int i = 1; i <= 40; i++) hatToPeople[i] = new ArrayList<>();
        for (int p = 0; p < n; p++) for (int h : hats.get(p)) hatToPeople[h].add(p);
        long[] dp = new long[N];
        dp[0] = 1;
        for (int h = 1; h <= 40; h++) {
            for (int mask = N - 1; mask >= 0; mask--) {
                if (dp[mask] == 0) continue;
                for (int p : hatToPeople[h]) {
                    if ((mask & (1 << p)) == 0) {
                        dp[mask | (1 << p)] = (dp[mask | (1 << p)] + dp[mask]) % MOD;
                    }
                }
            }
        }
        return (int) dp[N - 1];
    }
}`,
    pythonSolution: `def countDistinctHatAssignments(hats):
    MOD = 10**9 + 7
    n = len(hats)
    hat_to_p = [[] for _ in range(41)]
    for p, hs in enumerate(hats):
        for h in hs:
            hat_to_p[h].append(p)
    N = 1 << n
    dp = [0] * N
    dp[0] = 1
    for h in range(1, 41):
        if not hat_to_p[h]:
            continue
        for mask in range(N - 1, -1, -1):
            v = dp[mask]
            if v == 0:
                continue
            for p in hat_to_p[h]:
                if not (mask & (1 << p)):
                    dp[mask | (1 << p)] = (dp[mask | (1 << p)] + v) % MOD
    return dp[N - 1]`
  },
  {
    number: 9,
    difficulty: 'HARD',
    title: 'Count Distinct Non-Empty Palindromic Subsequences',
    fnName: 'countDistinctPalindromicSubseq',
    description: 'Given a string <code>s</code> of lowercase characters <code>a, b, c, d</code>, return the number of distinct non-empty palindromic subsequences in <code>s</code> modulo <code>10^9 + 7</code>.',
    constraints: ['1 <= len(s) <= 1000'],
    testCases: [
      { title: 'Sample 1', input: '"bccb"', output: '6' },
      { title: 'Sample 2', input: '"abcdabcdabcdabcdabcdabcdabcdabcddcbadcbadcbadcbadcbadcbadcbadcba"', output: '104860361' },
      { title: 'Single', input: '"a"', output: '1' },
      { title: 'All same', input: '"aaaa"', output: '4' },
    ],
    javaSolution: `class Solution {
    public int countDistinctPalindromicSubseq(String s) {
        int n = s.length(), MOD = 1_000_000_007;
        int[][] dp = new int[n][n];
        for (int i = 0; i < n; i++) dp[i][i] = 1;
        for (int len = 2; len <= n; len++) {
            for (int l = 0; l + len - 1 < n; l++) {
                int r = l + len - 1;
                if (s.charAt(l) == s.charAt(r)) {
                    int lo = l + 1, hi = r - 1;
                    while (lo <= hi && s.charAt(lo) != s.charAt(l)) lo++;
                    while (lo <= hi && s.charAt(hi) != s.charAt(r)) hi--;
                    if (lo > hi) dp[l][r] = (2 * dp[l + 1][r - 1] + 2) % MOD;
                    else if (lo == hi) dp[l][r] = (2 * dp[l + 1][r - 1] + 1) % MOD;
                    else dp[l][r] = ((2L * dp[l + 1][r - 1] - dp[lo + 1][hi - 1]) % MOD + MOD) % MOD;
                } else {
                    dp[l][r] = ((dp[l + 1][r] + dp[l][r - 1] - dp[l + 1][r - 1]) % MOD + MOD) % MOD;
                }
            }
        }
        return dp[0][n - 1];
    }
}`,
    pythonSolution: `def countDistinctPalindromicSubseq(s):
    MOD = 10**9 + 7
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1
    for length in range(2, n + 1):
        for l in range(n - length + 1):
            r = l + length - 1
            if s[l] == s[r]:
                lo, hi = l + 1, r - 1
                while lo <= hi and s[lo] != s[l]:
                    lo += 1
                while lo <= hi and s[hi] != s[r]:
                    hi -= 1
                if lo > hi:
                    dp[l][r] = (2 * dp[l + 1][r - 1] + 2) % MOD
                elif lo == hi:
                    dp[l][r] = (2 * dp[l + 1][r - 1] + 1) % MOD
                else:
                    dp[l][r] = (2 * dp[l + 1][r - 1] - dp[lo + 1][hi - 1]) % MOD
            else:
                dp[l][r] = (dp[l + 1][r] + dp[l][r - 1] - dp[l + 1][r - 1]) % MOD
    return dp[0][n - 1]`
  },
  {
    number: 10,
    difficulty: 'HARD',
    title: '3D Grid DP Valid Parenthesis Path',
    fnName: 'hasValidParenthesisPath',
    description: 'Given an <code>m x n</code> grid of <code>"("</code> and <code>")"</code>, return <code>true</code> iff there exists a path from <code>(0, 0)</code> to <code>(m-1, n-1)</code> moving only down or right that forms a valid balanced parentheses string.',
    constraints: ['1 <= m, n <= 100'],
    testCases: [
      { title: 'Sample 1', input: '[["(","(","("],[")","(",")"],["(","(",")"],["(","(",")"]]', output: 'true' },
      { title: 'Impossible', input: '[[")",")"],["(","("]]', output: 'false' },
      { title: '1x2 valid', input: '[["(",")"]]', output: 'true' },
      { title: 'Odd length', input: '[["(","("],[")",")"]]', output: 'false' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public boolean hasValidParenthesisPath(char[][] grid) {
        int m = grid.length, n = grid[0].length;
        if ((m + n - 1) % 2 != 0 || grid[0][0] == ')' || grid[m - 1][n - 1] == '(') return false;
        int maxB = (m + n) / 2 + 1;
        boolean[][][] dp = new boolean[m][n][maxB];
        dp[0][0][1] = true;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int d = grid[i][j] == '(' ? 1 : -1;
                for (int b = 0; b < maxB; b++) {
                    int pb = b - d;
                    if (pb < 0 || pb >= maxB) continue;
                    if (i > 0 && dp[i - 1][j][pb]) dp[i][j][b] = true;
                    if (j > 0 && dp[i][j - 1][pb]) dp[i][j][b] = true;
                }
            }
        }
        return dp[m - 1][n - 1][0];
    }
}`,
    pythonSolution: `def hasValidParenthesisPath(grid):
    m, n = len(grid), len(grid[0])
    if (m + n - 1) % 2 != 0 or grid[0][0] == ')' or grid[-1][-1] == '(':
        return False
    dp = [[set() for _ in range(n)] for _ in range(m)]
    dp[0][0].add(1)
    for i in range(m):
        for j in range(n):
            d = 1 if grid[i][j] == '(' else -1
            if i > 0:
                for b in dp[i - 1][j]:
                    if b + d >= 0:
                        dp[i][j].add(b + d)
            if j > 0:
                for b in dp[i][j - 1]:
                    if b + d >= 0:
                        dp[i][j].add(b + d)
    return 0 in dp[-1][-1]`
  },
  {
    number: 11,
    difficulty: 'HARD',
    title: 'Longest Directed Cycle in Functional Graph',
    fnName: 'longestDirectedCycle',
    description: 'Given a directed graph of <code>n</code> nodes where each node has at most one outgoing edge <code>edges[i]</code> (<code>-1</code> if none), return the length of the longest cycle in the graph, or <code>-1</code> if no cycle exists.',
    constraints: ['2 <= n <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '[3, 3, 4, 2, 3]', output: '3' },
      { title: 'No cycle', input: '[2, -1, 3, 1]', output: '-1' },
      { title: 'Two cycles', input: '[1, 0, 3, 4, 2]', output: '3' },
      { title: 'Self loop', input: '[0, -1]', output: '1' },
    ],
    javaSolution: `class Solution {
    public int longestDirectedCycle(int[] edges) {
        int n = edges.length, ans = -1, step = 1;
        int[] visTime = new int[n];
        for (int i = 0; i < n; i++) {
            if (visTime[i] != 0) continue;
            int start = step, u = i;
            while (u != -1 && visTime[u] == 0) {
                visTime[u] = step++;
                u = edges[u];
            }
            if (u != -1 && visTime[u] >= start) ans = Math.max(ans, step - visTime[u]);
        }
        return ans;
    }
}`,
    pythonSolution: `def longestDirectedCycle(edges):
    n = len(edges)
    vis_time = [0] * n
    ans = -1
    step = 1
    for i in range(n):
        if vis_time[i] != 0:
            continue
        start = step
        u = i
        while u != -1 and vis_time[u] == 0:
            vis_time[u] = step
            step += 1
            u = edges[u]
        if u != -1 and vis_time[u] >= start:
            ans = max(ans, step - vis_time[u])
    return ans`
  },
  {
    number: 12,
    difficulty: 'HARD',
    title: 'Fenwick Tree Point Update Range XOR Queries',
    fnName: 'fenwickRangeXorQueries',
    description: 'Given an integer array <code>nums</code>, process queries: <code>[1, idx, val]</code> sets <code>nums[idx] = val</code>; <code>[2, l, r]</code> returns the bitwise XOR of <code>nums[l..r]</code>. Return answers for all type-2 queries.',
    constraints: ['1 <= len(nums) <= 10^5', '1 <= len(queries) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[1, 3, 5, 7], [[2,0,3],[1,1,6],[2,0,3],[2,1,2]]', output: '[0, 5, 3]' },
      { title: 'Single', input: '[9], [[2,0,0],[1,0,4],[2,0,0]]', output: '[9, 4]' },
      { title: 'Zeroes', input: '[0,0,0], [[2,0,2]]', output: '[0]' },
      { title: 'Multi update', input: '[2,4,6,8], [[1,0,1],[1,3,1],[2,0,3]]', output: '[2]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Integer> fenwickRangeXorQueries(int[] nums, int[][] queries) {
        int n = nums.length;
        int[] bit = new int[n + 1], cur = nums.clone();
        for (int i = 0; i < n; i++) for (int j = i + 1; j <= n; j += j & -j) bit[j] ^= nums[i];
        List<Integer> res = new ArrayList<>();
        for (int[] q : queries) {
            if (q[0] == 1) {
                int idx = q[1], diff = cur[idx] ^ q[2];
                cur[idx] = q[2];
                for (int j = idx + 1; j <= n; j += j & -j) bit[j] ^= diff;
            } else {
                int xR = 0, xL = 0;
                for (int j = q[2] + 1; j > 0; j -= j & -j) xR ^= bit[j];
                for (int j = q[1]; j > 0; j -= j & -j) xL ^= bit[j];
                res.add(xR ^ xL);
            }
        }
        return res;
    }
}`,
    pythonSolution: `def fenwickRangeXorQueries(nums, queries):
    n = len(nums)
    cur = nums[:]
    bit = [0] * (n + 1)
    def update(i, diff):
        i += 1
        while i <= n:
            bit[i] ^= diff
            i += i & -i
    def pref(i):
        s = 0
        while i > 0:
            s ^= bit[i]
            i -= i & -i
        return s
    for i, x in enumerate(nums):
        update(i, x)
    res = []
    for q in queries:
        if q[0] == 1:
            idx, val = q[1], q[2]
            update(idx, cur[idx] ^ val)
            cur[idx] = val
        else:
            l, r = q[1], q[2]
            res.append(pref(r + 1) ^ pref(l))
    return res`
  }
];
