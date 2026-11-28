// Pure Competitive Programming & Hard/Extreme DSA Bank — Part 2 (50 Problems)
// Focus: Trees (LCA, Euler Tour, Diameter, Rerooting), Graphs (MST, DSU, Dijkstra, Bellman-Ford, 0-1 BFS),
//        Advanced Data Structures (Trie XOR, Fenwick, Segment Tree), Hard DP & Strings.
export const CP_BANK_PART2 = [
  {
    number: 1,
    difficulty: 'HARD',
    title: 'Binary Lifting Lowest Common Ancestor Queries',
    fnName: 'lcaQueries',
    description: 'Given a rooted tree of <code>n</code> nodes (0-indexed, root <code>0</code>) with undirected edges <code>edges</code> and queries <code>[u, v]</code>, return the Lowest Common Ancestor (LCA) of <code>u</code> and <code>v</code> for each query using Binary Lifting in <code>O((n + q) log n)</code>.',
    constraints: ['1 <= n <= 5 * 10^4', '1 <= len(queries) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '7, [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]], [[3,4],[3,5],[4,1],[5,6]]', output: '[1, 0, 1, 2]' },
      { title: 'Root queries', input: '4, [[0,1],[1,2],[2,3]], [[0,3],[2,3],[1,3]]', output: '[0, 2, 1]' },
      { title: 'Same node', input: '3, [[0,1],[0,2]], [[2,2],[1,2]]', output: '[2, 0]' },
      { title: 'Single node', input: '1, [], [[0,0]]', output: '[0]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int[] lcaQueries(int n, int[][] edges, int[][] queries) {
        int LOG = 17;
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        int[][] up = new int[n][LOG];
        int[] depth = new int[n];
        boolean[] vis = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(0); vis[0] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g[u]) if (!vis[v]) {
                vis[v] = true; depth[v] = depth[u] + 1; up[v][0] = u;
                for (int k = 1; k < LOG; k++) up[v][k] = up[up[v][k - 1]][k - 1];
                q.offer(v);
            }
        }
        int[] res = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int u = queries[i][0], v = queries[i][1];
            if (depth[u] < depth[v]) { int t = u; u = v; v = t; }
            int diff = depth[u] - depth[v];
            for (int k = 0; k < LOG; k++) if (((diff >> k) & 1) != 0) u = up[u][k];
            if (u == v) { res[i] = u; continue; }
            for (int k = LOG - 1; k >= 0; k--) if (up[u][k] != up[v][k]) { u = up[u][k]; v = up[v][k]; }
            res[i] = up[u][0];
        }
        return res;
    }
}`,
    pythonSolution: `from collections import deque

def lcaQueries(n, edges, queries):
    LOG = 17
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    up = [[0] * LOG for _ in range(n)]
    depth = [0] * n
    vis = [False] * n
    vis[0] = True
    q = deque([0])
    while q:
        u = q.popleft()
        for v in g[u]:
            if not vis[v]:
                vis[v] = True
                depth[v] = depth[u] + 1
                up[v][0] = u
                for k in range(1, LOG):
                    up[v][k] = up[up[v][k - 1]][k - 1]
                q.append(v)
    res = []
    for u, v in queries:
        if depth[u] < depth[v]:
            u, v = v, u
        diff = depth[u] - depth[v]
        for k in range(LOG):
            if (diff >> k) & 1:
                u = up[u][k]
        if u == v:
            res.append(u)
            continue
        for k in range(LOG - 1, -1, -1):
            if up[u][k] != up[v][k]:
                u = up[u][k]
                v = up[v][k]
        res.append(up[u][0])
    return res`
  },
  {
    number: 2,
    difficulty: 'EXTREME',
    title: 'Euler Tour Subtree Sum With Point Updates',
    fnName: 'treeSubtreeSumQueries',
    description: 'Given a rooted tree of <code>n</code> nodes (root <code>0</code>) with initial values <code>vals</code> and edges <code>edges</code>, process queries: <code>[1, u, x]</code> sets <code>vals[u] = x</code>; <code>[2, u]</code> returns the sum of values in the subtree of <code>u</code>. Return answers for all type-2 queries.',
    constraints: ['1 <= n <= 10^5', '1 <= len(queries) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '5, [1,2,3,4,5], [[0,1],[0,2],[1,3],[1,4]], [[2,0],[2,1],[1,3,10],[2,1],[2,0]]', output: '[15, 11, 17, 21]' },
      { title: 'Leaf update', input: '3, [5,10,15], [[0,1],[0,2]], [[2,2],[1,2,0],[2,0]]', output: '[15, 15]' },
      { title: 'Single node', input: '1, [7], [], [[2,0],[1,0,3],[2,0]]', output: '[7, 3]' },
      { title: 'Chain', input: '4, [1,1,1,1], [[0,1],[1,2],[2,3]], [[2,1],[1,2,5],[2,1]]', output: '[3, 7]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int timer = 0;
    public List<Long> treeSubtreeSumQueries(int n, int[] vals, int[][] edges, int[][] queries) {
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        int[] tin = new int[n], tout = new int[n];
        dfs(0, -1, g, tin, tout);
        long[] bit = new long[n + 1];
        long[] cur = new long[n];
        for (int i = 0; i < n; i++) {
            cur[i] = vals[i];
            for (int j = tin[i]; j <= n; j += j & -j) bit[j] += vals[i];
        }
        List<Long> res = new ArrayList<>();
        for (int[] q : queries) {
            if (q[0] == 1) {
                int u = q[1]; long delta = q[2] - cur[u]; cur[u] = q[2];
                for (int j = tin[u]; j <= n; j += j & -j) bit[j] += delta;
            } else {
                int u = q[1];
                res.add(sum(bit, tout[u]) - sum(bit, tin[u] - 1));
            }
        }
        return res;
    }
    void dfs(int u, int p, List<Integer>[] g, int[] tin, int[] tout) {
        tin[u] = ++timer;
        for (int v : g[u]) if (v != p) dfs(v, u, g, tin, tout);
        tout[u] = timer;
    }
    long sum(long[] bit, int i) {
        long s = 0;
        for (; i > 0; i -= i & -i) s += bit[i];
        return s;
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def treeSubtreeSumQueries(n, vals, edges, queries):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    tin = [0] * n
    tout = [0] * n
    timer = [0]
    def dfs(u, p):
        timer[0] += 1
        tin[u] = timer[0]
        for v in g[u]:
            if v != p:
                dfs(v, u)
        tout[u] = timer[0]
    dfs(0, -1)
    bit = [0] * (n + 1)
    cur = vals[:]
    def add(i, delta):
        while i <= n:
            bit[i] += delta
            i += i & -i
    def pref(i):
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s
    for i in range(n):
        add(tin[i], vals[i])
    res = []
    for q in queries:
        if q[0] == 1:
            u, x = q[1], q[2]
            add(tin[u], x - cur[u])
            cur[u] = x
        else:
            u = q[1]
            res.append(pref(tout[u]) - pref(tin[u] - 1))
    return res`
  },
  {
    number: 3,
    difficulty: 'HARD',
    title: 'Maximum XOR Pair Using Bitwise Trie',
    fnName: 'maxXorPair',
    description: 'Given a non-negative integer array <code>nums</code>, return the maximum value of <code>nums[i] ^ nums[j]</code> for any <code>0 <= i <= j < len(nums)</code> in <code>O(n log(max))</code> using a Bitwise Trie.',
    constraints: ['1 <= len(nums) <= 2 * 10^5', '0 <= nums[i] <= 2^31 - 1'],
    testCases: [
      { title: 'Sample 1', input: '[3, 10, 5, 25, 2, 8]', output: '28' },
      { title: 'Sample 2', input: '[14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]', output: '127' },
      { title: 'Single', input: '[0]', output: '0' },
      { title: 'Powers of 2', input: '[1, 2, 4, 8]', output: '12' },
    ],
    javaSolution: `class Solution {
    public int maxXorPair(int[] nums) {
        int max = 0, mask = 0;
        for (int i = 30; i >= 0; i--) {
            mask |= (1 << i);
            java.util.HashSet<Integer> set = new java.util.HashSet<>();
            for (int num : nums) set.add(num & mask);
            int cand = max | (1 << i);
            for (int p : set) {
                if (set.contains(p ^ cand)) { max = cand; break; }
            }
        }
        return max;
    }
}`,
    pythonSolution: `def maxXorPair(nums):
    ans = mask = 0
    for bit in range(30, -1, -1):
        mask |= (1 << bit)
        prefixes = {x & mask for x in nums}
        cand = ans | (1 << bit)
        if any((p ^ cand) in prefixes for p in prefixes):
            ans = cand
    return ans`
  },
  {
    number: 4,
    difficulty: 'EXTREME',
    title: 'Bellman-Ford Negative Cycle Detection',
    fnName: 'hasNegativeCycle',
    description: 'Given a directed weighted graph of <code>n</code> vertices (0 to n-1) and edges <code>[u, v, w]</code> (where weights may be negative), return <code>true</code> if the graph contains any negative-weight cycle reachable from any node, else <code>false</code>.',
    constraints: ['1 <= n <= 500', '0 <= len(edges) <= 5000', '-10^5 <= w <= 10^5'],
    testCases: [
      { title: 'Cycle exists', input: '3, [[0,1,1],[1,2,-3],[2,0,1]]', output: 'true' },
      { title: 'Zero cycle', input: '3, [[0,1,1],[1,2,-2],[2,0,1]]', output: 'false' },
      { title: 'DAG negative edges', input: '4, [[0,1,-5],[1,2,-5],[2,3,-5]]', output: 'false' },
      { title: 'Disconnected neg cycle', input: '4, [[2,3,-1],[3,2,-1]]', output: 'true' },
    ],
    javaSolution: `class Solution {
    public boolean hasNegativeCycle(int n, int[][] edges) {
        long[] dist = new long[n];
        for (int i = 0; i < n; i++) {
            boolean updated = false;
            for (int[] e : edges) {
                if (dist[e[0]] + e[2] < dist[e[1]]) {
                    dist[e[1]] = dist[e[0]] + e[2];
                    updated = true;
                    if (i == n - 1) return true;
                }
            }
            if (!updated) break;
        }
        return false;
    }
}`,
    pythonSolution: `def hasNegativeCycle(n, edges):
    dist = [0] * n
    for i in range(n):
        updated = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
                if i == n - 1:
                    return True
        if not updated:
            break
    return False`
  },
  {
    number: 5,
    difficulty: 'HARD',
    title: 'DSU Offline Connectivity After Edge Deletions',
    fnName: 'connectedComponentsAfterQueries',
    description: 'Given <code>n</code> nodes, undirected <code>edges</code>, and queries <code>[type, a, b]</code> where <code>[1, idx]</code> removes edge <code>edges[idx]</code> and <code>[2, u, v]</code> asks if <code>u</code> and <code>v</code> are connected, return boolean answers for all type-2 queries.',
    constraints: ['1 <= n <= 10^4', '1 <= len(queries) <= 2 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '4, [[0,1],[1,2],[2,3]], [[2,0,3],[1,1],[2,0,3],[2,0,1]]', output: '[true, false, true]' },
      { title: 'Cycle backup', input: '3, [[0,1],[1,2],[0,2]], [[1,0],[2,0,1],[1,2],[2,0,1]]', output: '[true, false]' },
      { title: 'No removals', input: '3, [[0,1]], [[2,0,1],[2,0,2]]', output: '[true, false]' },
      { title: 'Empty', input: '2, [], [[2,0,1]]', output: '[false]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
    void unite(int[] p, int a, int b) { a = find(p, a); b = find(p, b); if (a != b) p[a] = b; }
    public List<Boolean> connectedComponentsAfterQueries(int n, int[][] edges, int[][] queries) {
        boolean[] removed = new boolean[edges.length];
        for (int[] q : queries) if (q[0] == 1) removed[q[1]] = true;
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        for (int i = 0; i < edges.length; i++) if (!removed[i]) unite(p, edges[i][0], edges[i][1]);
        List<Boolean> rev = new ArrayList<>();
        for (int i = queries.length - 1; i >= 0; i--) {
            int[] q = queries[i];
            if (q[0] == 1) unite(p, edges[q[1]][0], edges[q[1]][1]);
            else rev.add(find(p, q[1]) == find(p, q[2]));
        }
        Collections.reverse(rev);
        return rev;
    }
}`,
    pythonSolution: `def connectedComponentsAfterQueries(n, edges, queries):
    removed = [False] * len(edges)
    for q in queries:
        if q[0] == 1:
            removed[q[1]] = True
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def unite(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
    for i, (u, v) in enumerate(edges):
        if not removed[i]:
            unite(u, v)
    ans = []
    for q in reversed(queries):
        if q[0] == 1:
            u, v = edges[q[1]]
            unite(u, v)
        else:
            ans.append(find(q[1]) == find(q[2]))
    ans.reverse()
    return ans`
  },
  {
    number: 6,
    difficulty: 'HARD',
    title: 'Tree Diameter With Weighted Edges',
    fnName: 'weightedTreeDiameter',
    description: 'Given a weighted undirected tree of <code>n</code> nodes and edges <code>[u, v, w]</code>, return the maximum distance (sum of edge weights) between any two nodes in the tree.',
    constraints: ['1 <= n <= 10^5', '1 <= w <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '4, [[0,1,3],[1,2,4],[1,3,2]]', output: '7' },
      { title: 'Single', input: '1, []', output: '0' },
      { title: 'Chain', input: '4, [[0,1,10],[1,2,20],[2,3,30]]', output: '60' },
      { title: 'Star', input: '5, [[0,1,5],[0,2,8],[0,3,2],[0,4,9]]', output: '17' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    long best = 0;
    public long weightedTreeDiameter(int n, int[][] edges) {
        List<int[]>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(new int[]{e[1], e[2]}); g[e[1]].add(new int[]{e[0], e[2]}); }
        dfs(0, -1, g);
        return best;
    }
    long dfs(int u, int p, List<int[]>[] g) {
        long t1 = 0, t2 = 0;
        for (int[] nb : g[u]) if (nb[0] != p) {
            long d = dfs(nb[0], u, g) + nb[1];
            if (d > t1) { t2 = t1; t1 = d; }
            else if (d > t2) t2 = d;
        }
        best = Math.max(best, t1 + t2);
        return t1;
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def weightedTreeDiameter(n, edges):
    if n <= 1:
        return 0
    g = [[] for _ in range(n)]
    for u, v, w in edges:
        g[u].append((v, w))
        g[v].append((u, w))
    best = [0]
    def dfs(u, p):
        t1 = t2 = 0
        for v, w in g[u]:
            if v != p:
                d = dfs(v, u) + w
                if d > t1:
                    t2, t1 = t1, d
                elif d > t2:
                    t2 = d
        if t1 + t2 > best[0]:
            best[0] = t1 + t2
        return t1
    dfs(0, -1)
    return best[0]`
  },
  {
    number: 7,
    difficulty: 'HARD',
    title: 'Kruskal Second-Best Minimum Spanning Tree',
    fnName: 'secondBestMstWeight',
    description: 'Given a connected undirected weighted graph of <code>n</code> nodes and edges <code>[u, v, w]</code>, return the weight of the strictly second-best (or equal if multiple MSTs? strictly greater than MST weight if possible, else -1) spanning tree.',
    constraints: ['2 <= n <= 200', 'n - 1 <= len(edges) <= 2000', '1 <= w <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '4, [[0,1,1],[1,2,2],[2,3,3],[0,3,4],[1,3,5]]', output: '7' },
      { title: 'Tree only', input: '3, [[0,1,2],[1,2,3]]', output: '-1' },
      { title: 'Equal MST tie', input: '3, [[0,1,2],[1,2,2],[0,2,2]]', output: '-1' },
      { title: 'Triangle diff', input: '3, [[0,1,1],[1,2,2],[0,2,5]]', output: '6' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
    public int secondBestMstWeight(int n, int[][] edges) {
        Arrays.sort(edges, Comparator.comparingInt(a -> a[2]));
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        List<Integer> mstIdx = new ArrayList<>();
        int mstW = 0;
        for (int i = 0; i < edges.length; i++) {
            int a = find(p, edges[i][0]), b = find(p, edges[i][1]);
            if (a != b) { p[a] = b; mstW += edges[i][2]; mstIdx.add(i); }
        }
        int best2 = Integer.MAX_VALUE;
        for (int skip : mstIdx) {
            for (int i = 0; i < n; i++) p[i] = i;
            int w = 0, cnt = 0;
            for (int i = 0; i < edges.length; i++) {
                if (i == skip) continue;
                int a = find(p, edges[i][0]), b = find(p, edges[i][1]);
                if (a != b) { p[a] = b; w += edges[i][2]; cnt++; }
            }
            if (cnt == n - 1 && w > mstW) best2 = Math.min(best2, w);
        }
        return best2 == Integer.MAX_VALUE ? -1 : best2;
    }
}`,
    pythonSolution: `def secondBestMstWeight(n, edges):
    es = sorted((w, u, v, i) for i, (u, v, w) in enumerate(edges))
    def run_kruskal(skip_idx):
        p = list(range(n))
        def find(x):
            while p[x] != x:
                p[x] = p[p[x]]
                x = p[x]
            return x
        w_sum = cnt = 0
        used = []
        for w, u, v, idx in es:
            if idx == skip_idx:
                continue
            ru, rv = find(u), find(v)
            if ru != rv:
                p[ru] = rv
                w_sum += w
                cnt += 1
                used.append(idx)
        return (w_sum, used) if cnt == n - 1 else (10**18, [])
    mst_w, mst_edges = run_kruskal(-1)
    best2 = 10**18
    for skip in mst_edges:
        w, _ = run_kruskal(skip)
        if w > mst_w and w < best2:
            best2 = w
    return -1 if best2 == 10**18 else best2`
  },
  {
    number: 8,
    difficulty: 'HARD',
    title: 'Minimum Vertex Cover on Tree (Binary Cameras)',
    fnName: 'minTreeVertexCover',
    description: 'Given a tree of <code>n</code> nodes and undirected <code>edges</code>, select the minimum number of nodes such that every edge has at least one selected endpoint.',
    constraints: ['1 <= n <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '5, [[0,1],[0,2],[1,3],[1,4]]', output: '2' },
      { title: 'Star', input: '4, [[0,1],[0,2],[0,3]]', output: '1' },
      { title: 'Chain 4', input: '4, [[0,1],[1,2],[2,3]]', output: '2' },
      { title: 'Single', input: '1, []', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minTreeVertexCover(int n, int[][] edges) {
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        int[] r = dfs(0, -1, g);
        return Math.min(r[0], r[1]);
    }
    int[] dfs(int u, int p, List<Integer>[] g) {
        int off = 0, on = 1;
        for (int v : g[u]) if (v != p) {
            int[] ch = dfs(v, u, g);
            off += ch[1];
            on += Math.min(ch[0], ch[1]);
        }
        return new int[]{off, on};
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def minTreeVertexCover(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    def dfs(u, p):
        off, on = 0, 1
        for v in g[u]:
            if v != p:
                co, c1 = dfs(v, u)
                off += c1
                on += min(co, c1)
        return off, on
    return min(dfs(0, -1))`
  },
  {
    number: 9,
    difficulty: 'EXTREME',
    title: 'Z-Algorithm Total Longest Common Prefix Sum',
    fnName: 'sumZArray',
    description: 'Given a string <code>s</code> of length <code>n</code>, compute its Z-array where <code>Z[i]</code> is the length of the longest common prefix between <code>s</code> and <code>s[i:]</code> (with <code>Z[0] = n</code>), and return <code>sum(Z)</code>.',
    constraints: ['1 <= len(s) <= 2 * 10^5'],
    testCases: [
      { title: 'Sample 1', input: '"ababa"', output: '9' },
      { title: 'All same', input: '"aaaa"', output: '10' },
      { title: 'Distinct', input: '"abcd"', output: '4' },
      { title: 'Sample 4', input: '"aabcaabxaaaz"', output: '22' },
    ],
    javaSolution: `class Solution {
    public long sumZArray(String s) {
        int n = s.length();
        int[] z = new int[n];
        z[0] = n;
        int l = 0, r = 0;
        long sum = n;
        for (int i = 1; i < n; i++) {
            if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
            if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
            sum += z[i];
        }
        return sum;
    }
}`,
    pythonSolution: `def sumZArray(s):
    n = len(s)
    z = [0] * n
    z[0] = n
    l = r = 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1
    return sum(z)`
  },
  {
    number: 10,
    difficulty: 'EXTREME',
    title: 'Manacher Linear-Time Longest Palindromic Substring Length',
    fnName: 'longestPalindromeLengthManacher',
    description: 'Given a string <code>s</code>, return the length of the longest palindromic substring in strictly <code>O(n)</code> time using Manacher\'s algorithm.',
    constraints: ['1 <= len(s) <= 2 * 10^5'],
    testCases: [
      { title: 'Sample 1', input: '"babad"', output: '3' },
      { title: 'Even', input: '"cbbd"', output: '2' },
      { title: 'Full', input: '"abccba"', output: '6' },
      { title: 'Single', input: '"z"', output: '1' },
    ],
    javaSolution: `class Solution {
    public int longestPalindromeLengthManacher(String s) {
        StringBuilder t = new StringBuilder("^");
        for (char c : s.toCharArray()) t.append('#').append(c);
        t.append("#$");
        int n = t.length(), center = 0, right = 0, best = 0;
        int[] p = new int[n];
        for (int i = 1; i < n - 1; i++) {
            int mirror = 2 * center - i;
            if (i < right) p[i] = Math.min(right - i, p[mirror]);
            while (t.charAt(i + 1 + p[i]) == t.charAt(i - 1 - p[i])) p[i]++;
            if (i + p[i] > right) { center = i; right = i + p[i]; }
            best = Math.max(best, p[i]);
        }
        return best;
    }
}`,
    pythonSolution: `def longestPalindromeLengthManacher(s):
    t = "^#" + "#".join(s) + "#$"
    n = len(t)
    p = [0] * n
    center = right = best = 0
    for i in range(1, n - 1):
        if i < right:
            p[i] = min(right - i, p[2 * center - i])
        while t[i + 1 + p[i]] == t[i - 1 - p[i]]:
            p[i] += 1
        if i + p[i] > right:
            center, right = i, i + p[i]
        if p[i] > best:
            best = p[i]
    return best`
  },
  {
    number: 11,
    difficulty: 'HARD',
    title: 'Bipartite Graph Check With Odd Cycle Detection',
    fnName: 'isGraphBipartite',
    description: 'Given an undirected graph with <code>n</code> nodes and <code>edges</code> (possibly disconnected), return <code>true</code> iff the graph is 2-colorable (contains no odd-length cycles).',
    constraints: ['1 <= n <= 10^4', '0 <= len(edges) <= 10^5'],
    testCases: [
      { title: 'Even cycle', input: '4, [[0,1],[1,2],[2,3],[3,0]]', output: 'true' },
      { title: 'Odd cycle', input: '3, [[0,1],[1,2],[2,0]]', output: 'false' },
      { title: 'Disconnected', input: '5, [[0,1],[2,3],[3,4],[4,2]]', output: 'false' },
      { title: 'Forest', input: '4, [[0,1],[2,3]]', output: 'true' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public boolean isGraphBipartite(int n, int[][] edges) {
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        int[] color = new int[n];
        Arrays.fill(color, -1);
        for (int i = 0; i < n; i++) if (color[i] == -1) {
            Queue<Integer> q = new ArrayDeque<>();
            color[i] = 0; q.offer(i);
            while (!q.isEmpty()) {
                int u = q.poll();
                for (int v : g[u]) {
                    if (color[v] == -1) { color[v] = color[u] ^ 1; q.offer(v); }
                    else if (color[v] == color[u]) return false;
                }
            }
        }
        return true;
    }
}`,
    pythonSolution: `from collections import deque

def isGraphBipartite(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    color = [-1] * n
    for i in range(n):
        if color[i] == -1:
            color[i] = 0
            q = deque([i])
            while q:
                u = q.popleft()
                for v in g[u]:
                    if color[v] == -1:
                        color[v] = color[u] ^ 1
                        q.append(v)
                    elif color[v] == color[u]:
                        return False
    return True`
  },
  {
    number: 12,
    difficulty: 'HARD',
    title: 'Minimum Spanning Tree Kruskal Total Weight',
    fnName: 'mstTotalWeight',
    description: 'Given a connected undirected weighted graph of <code>n</code> nodes and edges <code>[u, v, w]</code>, return the minimum spanning tree weight (or <code>-1</code> if disconnected).',
    constraints: ['1 <= n <= 10^5', '0 <= len(edges) <= 2 * 10^5'],
    testCases: [
      { title: 'Sample 1', input: '4, [[0,1,1],[0,2,4],[1,2,2],[2,3,3]]', output: '6' },
      { title: 'Disconnected', input: '4, [[0,1,5],[2,3,5]]', output: '-1' },
      { title: 'Single', input: '1, []', output: '0' },
      { title: 'Parallel', input: '2, [[0,1,10],[0,1,3]]', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
    public long mstTotalWeight(int n, int[][] edges) {
        if (n <= 1) return 0;
        Arrays.sort(edges, Comparator.comparingInt(a -> a[2]));
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        long total = 0; int used = 0;
        for (int[] e : edges) {
            int a = find(p, e[0]), b = find(p, e[1]);
            if (a != b) { p[a] = b; total += e[2]; used++; }
        }
        return used == n - 1 ? total : -1;
    }
}`,
    pythonSolution: `def mstTotalWeight(n, edges):
    if n <= 1:
        return 0
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x
    total = used = 0
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        ru, rv = find(u), find(v)
        if ru != rv:
            p[ru] = rv
            total += w
            used += 1
            if used == n - 1:
                break
    return total if used == n - 1 else -1`
  },
  {
    number: 13,
    difficulty: 'EXTREME',
    title: 'Convex Hull Perimeter (Andrew Monotone Chain)',
    fnName: 'convexHullPointCount',
    description: 'Given a set of <code>n</code> distinct 2D points <code>[x, y]</code>, compute the convex hull using Andrew\'s Monotone Chain and return the number of vertices on the outer boundary (excluding strictly collinear interior points on edges).',
    constraints: ['1 <= n <= 10^4', '-10^4 <= x, y <= 10^4'],
    testCases: [
      { title: 'Square + center', input: '[[0,0],[0,4],[4,0],[4,4],[2,2]]', output: '4' },
      { title: 'Collinear edge', input: '[[0,0],[2,0],[4,0],[2,3]]', output: '3' },
      { title: 'Triangle', input: '[[0,0],[1,2],[3,1]]', output: '3' },
      { title: 'Two points', input: '[[0,0],[5,5]]', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    long cross(int[] o, int[] a, int[] b) {
        return (long)(a[0] - o[0]) * (b[1] - o[1]) - (long)(a[1] - o[1]) * (b[0] - o[0]);
    }
    public int convexHullPointCount(int[][] pts) {
        int n = pts.length;
        if (n <= 2) return n;
        Arrays.sort(pts, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        List<int[]> h = new ArrayList<>();
        for (int[] p : pts) {
            while (h.size() >= 2 && cross(h.get(h.size() - 2), h.get(h.size() - 1), p) <= 0) h.remove(h.size() - 1);
            h.add(p);
        }
        int lower = h.size();
        for (int i = n - 2; i >= 0; i--) {
            while (h.size() > lower && cross(h.get(h.size() - 2), h.get(h.size() - 1), pts[i]) <= 0) h.remove(h.size() - 1);
            h.add(pts[i]);
        }
        return Math.max(1, h.size() - 1);
    }
}`,
    pythonSolution: `def convexHullPointCount(pts):
    n = len(pts)
    if n <= 2:
        return n
    pts = sorted(pts)
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return len(lower[:-1] + upper[:-1])`
  },
  {
    number: 14,
    difficulty: 'HARD',
    title: '0-1 Knapsack With Exact Capacity Check',
    fnName: 'maxKnapsackValue',
    description: 'Given <code>n</code> items with weights <code>weights</code> and values <code>values</code>, and capacity <code>cap</code>, return the maximum total value achievable without exceeding <code>cap</code>.',
    constraints: ['1 <= n <= 200', '1 <= cap <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[1, 3, 4, 5], [1, 4, 5, 7], 7', output: '9' },
      { title: 'Single fits', input: '[5], [10], 5', output: '10' },
      { title: 'None fits', input: '[6, 8], [10, 20], 5', output: '0' },
      { title: 'All fit', input: '[2, 3, 4], [5, 6, 7], 10', output: '18' },
    ],
    javaSolution: `class Solution {
    public int maxKnapsackValue(int[] weights, int[] values, int cap) {
        int[] dp = new int[cap + 1];
        for (int i = 0; i < weights.length; i++) {
            for (int w = cap; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        return dp[cap];
    }
}`,
    pythonSolution: `def maxKnapsackValue(weights, values, cap):
    dp = [0] * (cap + 1)
    for wt, val in zip(weights, values):
        for w in range(cap, wt - 1, -1):
            if dp[w - wt] + val > dp[w]:
                dp[w] = dp[w - wt] + val
    return dp[cap]`
  },
  {
    number: 15,
    difficulty: 'HARD',
    title: 'Longest Increasing Subsequence O(n log n)',
    fnName: 'longestIncSubseq',
    description: 'Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence in <code>O(n log n)</code>.',
    constraints: ['1 <= len(nums) <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[10,9,2,5,3,7,101,18]', output: '4' },
      { title: 'Sample 2', input: '[0,1,0,3,2,3]', output: '4' },
      { title: 'All equal', input: '[7,7,7,7]', output: '1' },
      { title: 'Descending', input: '[5,4,3,2,1]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int longestIncSubseq(int[] nums) {
        int[] tails = new int[nums.length];
        int len = 0;
        for (int x : nums) {
            int idx = Arrays.binarySearch(tails, 0, len, x);
            if (idx < 0) idx = -idx - 1;
            tails[idx] = x;
            if (idx == len) len++;
        }
        return len;
    }
}`,
    pythonSolution: `import bisect

def longestIncSubseq(nums):
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)`
  },
  {
    number: 16,
    difficulty: 'HARD',
    title: 'Matrix Exponentiation N-th Fibonacci Modulo',
    fnName: 'fibMatrixPowerMod',
    description: 'Given a large integer <code>n</code> (up to <code>10^18</code>), compute the <code>n</code>-th Fibonacci number modulo <code>10^9 + 7</code> in <code>O(log n)</code> using 2x2 Matrix Exponentiation (<code>F(0)=0, F(1)=1</code>).',
    constraints: ['0 <= n <= 10^18'],
    testCases: [
      { title: 'F(10)', input: '10', output: '55' },
      { title: 'F(0)', input: '0', output: '0' },
      { title: 'F(1)', input: '1', output: '1' },
      { title: 'F(100)', input: '100', output: '687995182' },
    ],
    javaSolution: `class Solution {
    static final long MOD = 1_000_000_007L;
    long[][] mul(long[][] A, long[][] B) {
        return new long[][]{
            {(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % MOD, (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % MOD},
            {(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % MOD, (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % MOD}
        };
    }
    public long fibMatrixPowerMod(long n) {
        if (n == 0) return 0;
        long[][] res = {{1, 0}, {0, 1}}, base = {{1, 1}, {1, 0}};
        for (long e = n - 1; e > 0; e >>= 1) {
            if ((e & 1) == 1) res = mul(res, base);
            base = mul(base, base);
        }
        return res[0][0];
    }
}`,
    pythonSolution: `def fibMatrixPowerMod(n):
    MOD = 10**9 + 7
    if n == 0:
        return 0
    def mul(A, B):
        return [
            [(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % MOD, (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % MOD],
            [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % MOD, (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % MOD],
        ]
    res = [[1, 0], [0, 1]]
    base = [[1, 1], [1, 0]]
    e = n - 1
    while e:
        if e & 1:
            res = mul(res, base)
        base = mul(base, base)
        e >>= 1
    return res[0][0]`
  },
  {
    number: 17,
    difficulty: 'HARD',
    title: 'Count Inversions Using Merge Sort / Fenwick',
    fnName: 'countArrayInversions',
    description: 'Given an integer array <code>nums</code>, count the number of inversion pairs <code>(i, j)</code> with <code>i < j</code> and <code>nums[i] > nums[j]</code>.',
    constraints: ['1 <= len(nums) <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[2, 4, 1, 3, 5]', output: '3' },
      { title: 'Reversed', input: '[5, 4, 3, 2, 1]', output: '10' },
      { title: 'Sorted', input: '[1, 2, 3, 4]', output: '0' },
      { title: 'Duplicates', input: '[2, 2, 1, 1]', output: '4' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public long countArrayInversions(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        Map<Integer, Integer> rank = new HashMap<>();
        int r = 1;
        for (int x : sorted) if (!rank.containsKey(x)) rank.put(x, r++);
        int[] bit = new int[r + 1];
        long inv = 0;
        for (int i = nums.length - 1; i >= 0; i--) {
            int k = rank.get(nums[i]);
            for (int j = k - 1; j > 0; j -= j & -j) inv += bit[j];
            for (int j = k; j <= r; j += j & -j) bit[j]++;
        }
        return inv;
    }
}`,
    pythonSolution: `def countArrayInversions(nums):
    vals = sorted(set(nums))
    rank = {v: i + 1 for i, v in enumerate(vals)}
    m = len(vals)
    bit = [0] * (m + 1)
    inv = 0
    for x in reversed(nums):
        r = rank[x]
        j = r - 1
        while j > 0:
            inv += bit[j]
            j -= j & -j
        j = r
        while j <= m:
            bit[j] += 1
            j += j & -j
    return inv`
  },
  {
    number: 18,
    difficulty: 'EXTREME',
    title: 'Eulerian Circuit / Path Reconstruction (Hierholzer)',
    fnName: 'reconstructEulerianPath',
    description: 'Given directed edges <code>pairs[i] = [u, v]</code> forming a valid Eulerian path starting from the unique start node (or smallest node if Eulerian circuit), return the ordered sequence of vertices visited.',
    constraints: ['1 <= len(pairs) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[[5,1],[4,5],[11,9],[9,4]]', output: '[11, 9, 4, 5, 1]' },
      { title: 'Circuit', input: '[[1,2],[2,3],[3,1]]', output: '[1, 2, 3, 1]' },
      { title: 'Single edge', input: '[[0,1]]', output: '[0, 1]' },
      { title: 'Branching', input: '[[1,2],[2,1],[1,3]]', output: '[1, 2, 1, 3]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Integer> reconstructEulerianPath(int[][] pairs) {
        Map<Integer, PriorityQueue<Integer>> g = new HashMap<>();
        Map<Integer, Integer> deg = new HashMap<>();
        for (int[] p : pairs) {
            g.computeIfAbsent(p[0], k -> new PriorityQueue<>()).offer(p[1]);
            deg.put(p[0], deg.getOrDefault(p[0], 0) + 1);
            deg.put(p[1], deg.getOrDefault(p[1], 0) - 1);
        }
        int start = Integer.MAX_VALUE;
        for (int k : g.keySet()) start = Math.min(start, k);
        for (var e : deg.entrySet()) if (e.getValue() == 1) start = e.getKey();
        List<Integer> path = new ArrayList<>();
        Deque<Integer> st = new ArrayDeque<>();
        st.push(start);
        while (!st.isEmpty()) {
            int u = st.peek();
            PriorityQueue<Integer> pq = g.get(u);
            if (pq != null && !pq.isEmpty()) st.push(pq.poll());
            else path.add(st.pop());
        }
        Collections.reverse(path);
        return path;
    }
}`,
    pythonSolution: `from collections import defaultdict
import heapq

def reconstructEulerianPath(pairs):
    g = defaultdict(list)
    deg = defaultdict(int)
    for u, v in pairs:
        heapq.heappush(g[u], v)
        deg[u] += 1
        deg[v] -= 1
    start = min(g.keys())
    for k, d in deg.items():
        if d == 1:
            start = k
            break
    st = [start]
    path = []
    while st:
        u = st[-1]
        if g[u]:
            st.append(heapq.heappop(g[u]))
        else:
            path.append(st.pop())
    path.reverse()
    return path`
  },
  {
    number: 19,
    difficulty: 'HARD',
    title: 'Floyd-Warshall All-Pairs Shortest Path With Threshold',
    fnName: 'findCityWithSmallestReach',
    description: 'Given <code>n</code> nodes, undirected edges <code>[u, v, w]</code>, and <code>threshold</code>, compute all-pairs shortest paths and return the node with the smallest number of reachable neighbors within distance <code><= threshold</code> (break ties by largest node index).',
    constraints: ['2 <= n <= 100', '1 <= w <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '4, [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], 4', output: '3' },
      { title: 'Sample 2', input: '5, [[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], 2', output: '0' },
      { title: 'Disconnected', input: '3, [[0,1,1]], 2', output: '2' },
      { title: 'Zero thresh', input: '3, [[0,1,1],[1,2,1]], 0', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int findCityWithSmallestReach(int n, int[][] edges, int threshold) {
        int[][] d = new int[n][n];
        for (int i = 0; i < n; i++) { Arrays.fill(d[i], 100000000); d[i][i] = 0; }
        for (int[] e : edges) { d[e[0]][e[1]] = Math.min(d[e[0]][e[1]], e[2]); d[e[1]][e[0]] = Math.min(d[e[1]][e[0]], e[2]); }
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
        int bestCity = -1, minCnt = n + 1;
        for (int i = 0; i < n; i++) {
            int cnt = 0;
            for (int j = 0; j < n; j++) if (i != j && d[i][j] <= threshold) cnt++;
            if (cnt <= minCnt) { minCnt = cnt; bestCity = i; }
        }
        return bestCity;
    }
}`,
    pythonSolution: `def findCityWithSmallestReach(n, edges, threshold):
    INF = 10**9
    d = [[INF] * n for _ in range(n)]
    for i in range(n):
        d[i][i] = 0
    for u, v, w in edges:
        if w < d[u][v]:
            d[u][v] = d[v][u] = w
    for k in range(n):
        for i in range(n):
            dik = d[i][k]
            if dik == INF:
                continue
            for j in range(n):
                if dik + d[k][j] < d[i][j]:
                    d[i][j] = dik + d[k][j]
    best_city, min_cnt = -1, n + 1
    for i in range(n):
        cnt = sum(1 for j in range(n) if i != j and d[i][j] <= threshold)
        if cnt <= min_cnt:
            min_cnt = cnt
            best_city = i
    return best_city`
  },
  {
    number: 20,
    difficulty: 'EXTREME',
    title: 'SOS DP (Sum Over Subsets) Pairwise Zero-AND',
    fnName: 'countBitwiseAndZeroPairs',
    description: 'Given an integer array <code>nums</code> with <code>0 <= nums[i] < 2^12</code>, count the number of ordered pairs <code>(i, j)</code> such that <code>(nums[i] & nums[j]) == 0</code> using Sum Over Subsets (SOS) DP.',
    constraints: ['1 <= len(nums) <= 5 * 10^4', '0 <= nums[i] < 4096'],
    testCases: [
      { title: 'Sample 1', input: '[2, 1, 3]', output: '2' },
      { title: 'All zeros', input: '[0, 0]', output: '4' },
      { title: 'Disjoint bits', input: '[1, 2, 4]', output: '6' },
      { title: 'All 1s', input: '[1, 1, 1]', output: '0' },
    ],
    javaSolution: `class Solution {
    public long countBitwiseAndZeroPairs(int[] nums) {
        int B = 12, N = 1 << B;
        long[] dp = new long[N];
        for (int x : nums) dp[x]++;
        for (int b = 0; b < B; b++) {
            for (int mask = 0; mask < N; mask++) {
                if ((mask & (1 << b)) != 0) dp[mask] += dp[mask ^ (1 << b)];
            }
        }
        long ans = 0;
        int full = N - 1;
        for (int x : nums) ans += dp[full ^ x];
        return ans;
    }
}`,
    pythonSolution: `def countBitwiseAndZeroPairs(nums):
    B = 12
    N = 1 << B
    dp = [0] * N
    for x in nums:
        dp[x] += 1
    for b in range(B):
        bit = 1 << b
        for mask in range(N):
            if mask & bit:
                dp[mask] += dp[mask ^ bit]
    full = N - 1
    return sum(dp[full ^ x] for x in nums)`
  },
  {
    number: 21,
    difficulty: 'HARD',
    title: 'Maximum Subarray Sum With At Most One Deletion',
    fnName: 'maxSubarrayOneDeletion',
    description: 'Given an integer array <code>arr</code>, return the maximum sum of a non-empty subarray with at most one element deleted.',
    constraints: ['1 <= len(arr) <= 10^5', '-10^4 <= arr[i] <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[1, -2, 0, 3]', output: '4' },
      { title: 'Sample 2', input: '[1, -2, -2, 3]', output: '3' },
      { title: 'All negative', input: '[-1, -1, -1, -1]', output: '-1' },
      { title: 'All positive', input: '[2, 3, 4]', output: '9' },
    ],
    javaSolution: `class Solution {
    public int maxSubarrayOneDeletion(int[] arr) {
        int noDel = arr[0], oneDel = 0, ans = arr[0];
        for (int i = 1; i < arr.length; i++) {
            oneDel = Math.max(noDel, oneDel + arr[i]);
            noDel = Math.max(arr[i], noDel + arr[i]);
            ans = Math.max(ans, Math.max(noDel, oneDel));
        }
        return ans;
    }
}`,
    pythonSolution: `def maxSubarrayOneDeletion(arr):
    no_del = arr[0]
    one_del = -10**18
    ans = arr[0]
    for x in arr[1:]:
        one_del = max(no_del, one_del + x)
        no_del = max(x, no_del + x)
        ans = max(ans, no_del, one_del)
    return ans`
  },
  {
    number: 22,
    difficulty: 'HARD',
    title: 'Shortest Subarray With Sum At Least K (Monotonic Deque)',
    fnName: 'shortestSubarrayAtLeastK',
    description: 'Given an integer array <code>nums</code> (possibly containing negative numbers) and integer <code>k</code>, return the length of the shortest non-empty contiguous subarray with sum <code>>= k</code>, or <code>-1</code>.',
    constraints: ['1 <= len(nums) <= 10^5', '-10^5 <= nums[i] <= 10^5', '1 <= k <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[2, -1, 2], 3', output: '3' },
      { title: 'Impossible', input: '[1, 2], 4', output: '-1' },
      { title: 'Single', input: '[1], 1', output: '1' },
      { title: 'Negatives', input: '[84, -37, 32, 40, 95], 167', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int shortestSubarrayAtLeastK(int[] nums, int k) {
        int n = nums.length, ans = n + 1;
        long[] pref = new long[n + 1];
        for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + nums[i];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i <= n; i++) {
            while (!dq.isEmpty() && pref[i] - pref[dq.peekFirst()] >= k) ans = Math.min(ans, i - dq.pollFirst());
            while (!dq.isEmpty() && pref[i] <= pref[dq.peekLast()]) dq.pollLast();
            dq.addLast(i);
        }
        return ans <= n ? ans : -1;
    }
}`,
    pythonSolution: `from collections import deque

def shortestSubarrayAtLeastK(nums, k):
    n = len(nums)
    pref = [0] * (n + 1)
    for i, x in enumerate(nums):
        pref[i + 1] = pref[i] + x
    dq = deque()
    ans = n + 1
    for i, p in enumerate(pref):
        while dq and p - pref[dq[0]] >= k:
            ans = min(ans, i - dq.popleft())
        while dq and p <= pref[dq[-1]]:
            dq.pop()
        dq.append(i)
    return ans if ans <= n else -1`
  },
  {
    number: 23,
    difficulty: 'EXTREME',
    title: 'Minimum Number of Refueling / K-th Ancestor Binary Lifting',
    fnName: 'kthAncestorQueries',
    description: 'Given a tree of <code>n</code> nodes where <code>parent[i]</code> is the parent of node <code>i</code> (<code>parent[0] = -1</code>), answer queries <code>[node, k]</code> by returning the <code>k</code>-th ancestor of <code>node</code> (or <code>-1</code> if none exists).',
    constraints: ['1 <= n <= 5 * 10^4', '1 <= len(queries) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '7, [-1,0,0,1,1,2,2], [[3,1],[5,2],[6,3]]', output: '[1, 0, -1]' },
      { title: 'Root ancestor', input: '3, [-1,0,1], [[2,1],[2,2],[2,3]]', output: '[1, 0, -1]' },
      { title: 'Zero step', input: '2, [-1,0], [[1,0],[0,0]]', output: '[1, 0]' },
      { title: 'Single', input: '1, [-1], [[0,1]]', output: '[-1]' },
    ],
    javaSolution: `class Solution {
    public int[] kthAncestorQueries(int n, int[] parent, int[][] queries) {
        int LOG = 17;
        int[][] up = new int[n][LOG];
        for (int i = 0; i < n; i++) up[i][0] = parent[i];
        for (int j = 1; j < LOG; j++) {
            for (int i = 0; i < n; i++) {
                up[i][j] = up[i][j - 1] == -1 ? -1 : up[up[i][j - 1]][j - 1];
            }
        }
        int[] res = new int[queries.length];
        for (int qi = 0; qi < queries.length; qi++) {
            int node = queries[qi][0], k = queries[qi][1];
            for (int j = 0; j < LOG && node != -1; j++) {
                if (((k >> j) & 1) != 0) node = up[node][j];
            }
            res[qi] = node;
        }
        return res;
    }
}`,
    pythonSolution: `def kthAncestorQueries(n, parent, queries):
    LOG = 17
    up = [[-1] * LOG for _ in range(n)]
    for i in range(n):
        up[i][0] = parent[i]
    for j in range(1, LOG):
        for i in range(n):
            p = up[i][j - 1]
            if p != -1:
                up[i][j] = up[p][j - 1]
    res = []
    for node, k in queries:
        for j in range(LOG):
            if node == -1:
                break
            if (k >> j) & 1:
                node = up[node][j]
        res.append(node)
    return res`
  },
  {
    number: 24,
    difficulty: 'HARD',
    title: 'Minimum Cost to Make All Array Elements Equal (Weighted Median)',
    fnName: 'minCostMakeEqualWeighted',
    description: 'Given arrays <code>nums</code> and <code>cost</code>, increasing or decreasing <code>nums[i]</code> by 1 costs <code>cost[i]</code>. Return the minimum total cost to make all elements of <code>nums</code> equal.',
    constraints: ['1 <= len(nums) <= 10^5', '1 <= nums[i], cost[i] <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '[1,3,5,2], [2,3,1,14]', output: '8' },
      { title: 'Already equal', input: '[2,2,2,2], [4,2,8,1]', output: '0' },
      { title: 'Two', input: '[1, 10], [1, 100]', output: '9' },
      { title: 'Sample 4', input: '[1, 2, 3], [1, 1, 1]', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public long minCostMakeEqualWeighted(int[] nums, int[] cost) {
        int n = nums.length;
        int[][] pairs = new int[n][2];
        long totalCost = 0;
        for (int i = 0; i < n; i++) { pairs[i][0] = nums[i]; pairs[i][1] = cost[i]; totalCost += cost[i]; }
        Arrays.sort(pairs, Comparator.comparingInt(a -> a[0]));
        long acc = 0; int target = 0;
        for (int[] p : pairs) { acc += p[1]; if (acc * 2 >= totalCost) { target = p[0]; break; } }
        long ans = 0;
        for (int[] p : pairs) ans += (long) Math.abs(p[0] - target) * p[1];
        return ans;
    }
}`,
    pythonSolution: `def minCostMakeEqualWeighted(nums, cost):
    pairs = sorted(zip(nums, cost))
    total_c = sum(cost)
    acc = 0
    target = pairs[0][0]
    for x, c in pairs:
        acc += c
        if acc * 2 >= total_c:
            target = x
            break
    return sum(abs(x - target) * c for x, c in pairs)`
  },
  {
    number: 25,
    difficulty: 'EXTREME',
    title: 'Bitmask DP Partition Into K Equal Sum Subsets',
    fnName: 'canPartitionKEqualSubsets',
    description: 'Given an integer array <code>nums</code> and integer <code>k</code>, return <code>true</code> iff it is possible to divide <code>nums</code> into <code>k</code> non-empty subsets whose sums are all equal.',
    constraints: ['1 <= k <= len(nums) <= 16', '1 <= nums[i] <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[4,3,2,3,5,2,1], 4', output: 'true' },
      { title: 'Impossible', input: '[1,2,3,4], 3', output: 'false' },
      { title: 'k=1', input: '[5, 10], 1', output: 'true' },
      { title: 'Sample 4', input: '[2,2,2,2,3,4,5], 4', output: 'false' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public boolean canPartitionKEqualSubsets(int[] nums, int k) {
        int sum = 0, max = 0;
        for (int x : nums) { sum += x; max = Math.max(max, x); }
        if (sum % k != 0) return false;
        int target = sum / k;
        if (max > target) return false;
        int n = nums.length, N = 1 << n;
        int[] dp = new int[N];
        Arrays.fill(dp, -1);
        dp[0] = 0;
        for (int mask = 0; mask < N; mask++) {
            if (dp[mask] == -1) continue;
            for (int i = 0; i < n; i++) if ((mask & (1 << i)) == 0) {
                if (dp[mask] + nums[i] <= target) {
                    dp[mask | (1 << i)] = (dp[mask] + nums[i]) % target;
                }
            }
        }
        return dp[N - 1] == 0;
    }
}`,
    pythonSolution: `def canPartitionKEqualSubsets(nums, k):
    total = sum(nums)
    if total % k != 0:
        return False
    target = total // k
    if max(nums) > target:
        return False
    n = len(nums)
    N = 1 << n
    dp = [-1] * N
    dp[0] = 0
    for mask in range(N):
        if dp[mask] == -1:
            continue
        rem = dp[mask]
        for i in range(n):
            if not (mask & (1 << i)) and rem + nums[i] <= target:
                dp[mask | (1 << i)] = (rem + nums[i]) % target
    return dp[N - 1] == 0`
  }
];
