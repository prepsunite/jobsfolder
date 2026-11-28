// 50 Original Medium, Hard & Extreme Questions for Google SWE OA & Onsite
export const GOOGLE_QUESTIONS = [
  // ── ROUND 1: Google SWE Online Assessment — Medium & Hard (Q1–Q15) ────────
  {
    number: 1,
    difficulty: 'MEDIUM',
    title: 'YouTube Frame Buffer Minimum Amplitude',
    fnName: 'minAmplitudeThreeChanges',
    description: 'Given an integer array <code>nums</code> representing frame jitter latencies, in one move you can change any element to any value. Return the minimum difference between the largest and smallest value of <code>nums</code> after performing at most 3 moves.',
    constraints: ['1 <= len(nums) <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[5, 3, 2, 4]', output: '0' },
      { title: 'Sample 2', input: '[1, 5, 0, 10, 14]', output: '1' },
      { title: 'Sample 3', input: '[3, 100, 20]', output: '0' },
      { title: 'Sample 4', input: '[6, 6, 0, 1, 1, 4, 6]', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minAmplitudeThreeChanges(int[] nums) {
        int n = nums.length;
        if (n <= 4) return 0;
        Arrays.sort(nums);
        int ans = Integer.MAX_VALUE;
        for (int i = 0; i <= 3; i++) {
            ans = Math.min(ans, nums[n - 4 + i] - nums[i]);
        }
        return ans;
    }
}`,
    pythonSolution: `def minAmplitudeThreeChanges(nums):
    n = len(nums)
    if n <= 4:
        return 0
    nums.sort()
    return min(nums[n - 4 + i] - nums[i] for i in range(4))`
  },
  {
    number: 2,
    difficulty: 'MEDIUM',
    title: 'Google Docs Split String Equal Distinct Characters',
    fnName: 'countGoodDocumentSplits',
    description: 'Given a string <code>s</code>, a split into two non-empty substrings <code>sLeft</code> and <code>sRight</code> is good if they have the exact same number of distinct characters. Return the number of good splits.',
    constraints: ['1 <= len(s) <= 10^5', 's consists of lowercase English letters'],
    testCases: [
      { title: 'Sample 1', input: '"aacaba"', output: '2' },
      { title: 'Sample 2', input: '"abcd"', output: '1' },
      { title: 'All same', input: '"aaaaa"', output: '4' },
      { title: 'Single', input: '"a"', output: '0' },
    ],
    javaSolution: `class Solution {
    public int countGoodDocumentSplits(String s) {
        int[] right = new int[26], left = new int[26];
        int rDist = 0, lDist = 0, ans = 0;
        for (char c : s.toCharArray()) if (right[c - 'a']++ == 0) rDist++;
        for (int i = 0; i < s.length() - 1; i++) {
            int idx = s.charAt(i) - 'a';
            if (left[idx]++ == 0) lDist++;
            if (--right[idx] == 0) rDist--;
            if (lDist == rDist) ans++;
        }
        return ans;
    }
}`,
    pythonSolution: `from collections import Counter

def countGoodDocumentSplits(s):
    right = Counter(s)
    left = Counter()
    r_dist = len(right)
    l_dist = 0
    ans = 0
    for ch in s[:-1]:
        if left[ch] == 0:
            l_dist += 1
        left[ch] += 1
        right[ch] -= 1
        if right[ch] == 0:
            r_dist -= 1
        if l_dist == r_dist:
            ans += 1
    return ans`
  },
  {
    number: 3,
    difficulty: 'MEDIUM',
    title: 'Search Autocomplete Longest Common Subsequence',
    fnName: 'longestCommonSubseq',
    description: 'Given two query strings <code>text1</code> and <code>text2</code>, return the length of their longest common subsequence.',
    constraints: ['1 <= len(text1), len(text2) <= 1000'],
    testCases: [
      { title: 'Sample 1', input: '"abcde", "ace"', output: '3' },
      { title: 'Identical', input: '"abc", "abc"', output: '3' },
      { title: 'Disjoint', input: '"abc", "def"', output: '0' },
      { title: 'Interleaved', input: '"bsbininm", "jmjkbkjkv"', output: '1' },
    ],
    javaSolution: `class Solution {
    public int longestCommonSubseq(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[] dp = new int[n + 1];
        for (int i = 1; i <= m; i++) {
            int prev = 0;
            for (int j = 1; j <= n; j++) {
                int tmp = dp[j];
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) dp[j] = prev + 1;
                else dp[j] = Math.max(dp[j], dp[j - 1]);
                prev = tmp;
            }
        }
        return dp[n];
    }
}`,
    pythonSolution: `def longestCommonSubseq(text1, text2):
    m, n = len(text1), len(text2)
    dp = [0] * (n + 1)
    for i in range(1, m + 1):
        prev = 0
        for j in range(1, n + 1):
            tmp = dp[j]
            if text1[i - 1] == text2[j - 1]:
                dp[j] = prev + 1
            else:
                if dp[j - 1] > dp[j]:
                    dp[j] = dp[j - 1]
            prev = tmp
    return dp[n]`
  },
  {
    number: 4,
    difficulty: 'MEDIUM',
    title: 'Borg Job Scheduler Minimum Intervals Merge',
    fnName: 'mergeComputeIntervals',
    description: 'Given an array of Borg compute intervals <code>[start, end]</code>, merge all overlapping intervals and return the sorted non-overlapping intervals.',
    constraints: ['1 <= len(intervals) <= 10^4', '0 <= start <= end <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1, 6], [8, 10], [15, 18]]' },
      { title: 'Touching', input: '[[1,4],[4,5]]', output: '[[1, 5]]' },
      { title: 'Unsorted', input: '[[6,8],[1,3],[2,4]]', output: '[[1, 4], [6, 8]]' },
      { title: 'Single', input: '[[5,10]]', output: '[[5, 10]]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int[][] mergeComputeIntervals(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        List<int[]> res = new ArrayList<>();
        for (int[] iv : intervals) {
            if (res.isEmpty() || res.get(res.size() - 1)[1] < iv[0]) res.add(iv);
            else res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], iv[1]);
        }
        return res.toArray(new int[0][]);
    }
}`,
    pythonSolution: `def mergeComputeIntervals(intervals):
    intervals.sort()
    res = []
    for s, e in intervals:
        if not res or res[-1][1] < s:
            res.append([s, e])
        else:
            if e > res[-1][1]:
                res[-1][1] = e
    return res`
  },
  {
    number: 5,
    difficulty: 'MEDIUM',
    title: 'Maps Shortest Path in Binary Matrix',
    fnName: 'shortestClearPath8Dir',
    description: 'Given an <code>n x n</code> binary grid where <code>0</code> is passable and <code>1</code> is blocked, return the length of the shortest 8-directional path from <code>(0, 0)</code> to <code>(n-1, n-1)</code>, or <code>-1</code> if none exists.',
    constraints: ['1 <= n <= 100'],
    testCases: [
      { title: 'Sample 1', input: '[[0,1],[1,0]]', output: '2' },
      { title: 'Sample 2', input: '[[0,0,0],[1,1,0],[1,1,0]]', output: '4' },
      { title: 'Blocked', input: '[[1,0,0],[1,1,0],[1,1,0]]', output: '-1' },
      { title: '1x1', input: '[[0]]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int shortestClearPath8Dir(int[][] grid) {
        int n = grid.length;
        if (grid[0][0] == 1 || grid[n - 1][n - 1] == 1) return -1;
        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0, 1});
        grid[0][0] = 1;
        while (!q.isEmpty()) {
            int[] c = q.poll();
            if (c[0] == n - 1 && c[1] == n - 1) return c[2];
            for (int dr = -1; dr <= 1; dr++) for (int dc = -1; dc <= 1; dc++) {
                int nr = c[0] + dr, nc = c[1] + dc;
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                    grid[nr][nc] = 1;
                    q.offer(new int[]{nr, nc, c[2] + 1});
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque

def shortestClearPath8Dir(grid):
    n = len(grid)
    if grid[0][0] == 1 or grid[n - 1][n - 1] == 1:
        return -1
    g = [row[:] for row in grid]
    g[0][0] = 1
    q = deque([(0, 0, 1)])
    while q:
        r, c, d = q.popleft()
        if r == n - 1 and c == n - 1:
            return d
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and g[nr][nc] == 0:
                    g[nr][nc] = 1
                    q.append((nr, nc, d + 1))
    return -1`
  },
  {
    number: 6,
    difficulty: 'HARD',
    title: 'Android Lock Pattern Key Combinations',
    fnName: 'countAndroidPatterns',
    description: 'On a 3x3 Android lock grid (digits 1..9), count the number of valid unlock patterns of length between <code>m</code> and <code>n</code> inclusive (a jump over an unvisited center cell is invalid unless that center cell was already visited).',
    constraints: ['1 <= m <= n <= 9'],
    testCases: [
      { title: 'Length 1', input: '1, 1', output: '9' },
      { title: 'Length 1..2', input: '1, 2', output: '65' },
      { title: 'Length 2..2', input: '2, 2', output: '56' },
      { title: 'Length 3..3', input: '3, 3', output: '320' },
    ],
    javaSolution: `class Solution {
    int[][] skip = new int[10][10];
    boolean[] vis = new boolean[10];
    public int countAndroidPatterns(int m, int n) {
        skip[1][3] = skip[3][1] = 2; skip[1][7] = skip[7][1] = 4;
        skip[3][9] = skip[9][3] = 6; skip[7][9] = skip[9][7] = 8;
        skip[1][9] = skip[9][1] = skip[2][8] = skip[8][2] = skip[3][7] = skip[7][3] = skip[4][6] = skip[6][4] = 5;
        int res = 0;
        for (int len = m; len <= n; len++) {
            res += dfs(1, len - 1) * 4 + dfs(2, len - 1) * 4 + dfs(5, len - 1);
        }
        return res;
    }
    int dfs(int cur, int rem) {
        if (rem == 0) return 1;
        vis[cur] = true;
        int ans = 0;
        for (int nxt = 1; nxt <= 9; nxt++) {
            if (!vis[nxt] && (skip[cur][nxt] == 0 || vis[skip[cur][nxt]])) ans += dfs(nxt, rem - 1);
        }
        vis[cur] = false;
        return ans;
    }
}`,
    pythonSolution: `def countAndroidPatterns(m, n):
    skip = [[0] * 10 for _ in range(10)]
    skip[1][3] = skip[3][1] = 2
    skip[1][7] = skip[7][1] = 4
    skip[3][9] = skip[9][3] = 6
    skip[7][9] = skip[9][7] = 8
    for a, b in ((1, 9), (2, 8), (3, 7), (4, 6)):
        skip[a][b] = skip[b][a] = 5
    vis = [False] * 10
    def dfs(cur, rem):
        if rem == 0:
            return 1
        vis[cur] = True
        ans = 0
        for nxt in range(1, 10):
            if not vis[nxt] and (skip[cur][nxt] == 0 or vis[skip[cur][nxt]]):
                ans += dfs(nxt, rem - 1)
        vis[cur] = False
        return ans
    return sum(dfs(1, L - 1) * 4 + dfs(2, L - 1) * 4 + dfs(5, L - 1) for L in range(m, n + 1))`
  },
  {
    number: 7,
    difficulty: 'HARD',
    title: 'Waymo Lidar Minimum Refuel / Obstacles Path',
    fnName: 'shortestPathWithEliminations',
    description: 'Given an <code>m x n</code> grid of <code>0</code> (empty) and <code>1</code> (obstacle) and integer <code>k</code>, return the minimum number of 4-directional steps from <code>(0, 0)</code> to <code>(m-1, n-1)</code> eliminating at most <code>k</code> obstacles, or <code>-1</code>.',
    constraints: ['1 <= m, n <= 40', '1 <= k <= m * n'],
    testCases: [
      { title: 'Sample 1', input: '[[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], 1', output: '6' },
      { title: 'Impossible', input: '[[0,1,1],[1,1,1],[1,0,0]], 1', output: '-1' },
      { title: '1x1', input: '[[0]], 1', output: '0' },
      { title: 'k=0', input: '[[0,0],[0,0]], 0', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int shortestPathWithEliminations(int[][] grid, int k) {
        int m = grid.length, n = grid[0].length;
        if (k >= m + n - 2) return m + n - 2;
        int[][] bestK = new int[m][n];
        for (int[] r : bestK) Arrays.fill(r, -1);
        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0, k, 0});
        bestK[0][0] = k;
        int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
        while (!q.isEmpty()) {
            int[] c = q.poll();
            if (c[0] == m - 1 && c[1] == n - 1) return c[3];
            for (int d = 0; d < 4; d++) {
                int nr = c[0] + dr[d], nc = c[1] + dc[d];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    int nk = c[2] - grid[nr][nc];
                    if (nk >= 0 && nk > bestK[nr][nc]) {
                        bestK[nr][nc] = nk;
                        q.offer(new int[]{nr, nc, nk, c[3] + 1});
                    }
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque

def shortestPathWithEliminations(grid, k):
    m, n = len(grid), len(grid[0])
    if k >= m + n - 2:
        return m + n - 2
    best_k = [[-1] * n for _ in range(m)]
    best_k[0][0] = k
    q = deque([(0, 0, k, 0)])
    while q:
        r, c, rem, steps = q.popleft()
        if r == m - 1 and c == n - 1:
            return steps
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                nk = rem - grid[nr][nc]
                if nk >= 0 and nk > best_k[nr][nc]:
                    best_k[nr][nc] = nk
                    q.append((nr, nc, nk, steps + 1))
    return -1`
  },
  {
    number: 8,
    difficulty: 'MEDIUM',
    title: 'Calendar Conflicting Meeting Rooms',
    fnName: 'minMeetingRoomsRequired',
    description: 'Given Google Calendar meeting intervals <code>[start, end]</code>, return the minimum number of conference rooms required so no two meetings overlap in the same room.',
    constraints: ['1 <= len(intervals) <= 10^4', '0 <= start < end <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '[[0,30],[5,10],[15,20]]', output: '2' },
      { title: 'Sequential', input: '[[7,10],[2,4]]', output: '1' },
      { title: 'Boundary', input: '[[1,5],[5,10]]', output: '1' },
      { title: 'Three', input: '[[1,10],[2,10],[3,10]]', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minMeetingRoomsRequired(int[][] intervals) {
        int n = intervals.length;
        int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = intervals[i][0]; e[i] = intervals[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int rooms = 0, endIdx = 0;
        for (int i = 0; i < n; i++) {
            if (s[i] < e[endIdx]) rooms++;
            else endIdx++;
        }
        return rooms;
    }
}`,
    pythonSolution: `def minMeetingRoomsRequired(intervals):
    s = sorted(iv[0] for iv in intervals)
    e = sorted(iv[1] for iv in intervals)
    rooms = end_idx = 0
    for start in s:
        if start < e[end_idx]:
            rooms += 1
        else:
            end_idx += 1
    return rooms`
  },
  {
    number: 9,
    difficulty: 'MEDIUM',
    title: 'BigQuery Evaluate Division Equations',
    fnName: 'evalRatioQueries',
    description: 'Given equations <code>equations[i] = [A, B]</code> with values <code>A / B = values[i]</code>, evaluate each query <code>[C, D]</code>. Return <code>-1.0</code> if any variable is unknown or disconnected.',
    constraints: ['1 <= len(equations) <= 20', '0.0 < values[i] <= 20.0'],
    testCases: [
      { title: 'Sample 1', input: '[["a","b"],["b","c"]], [2.0, 3.0], [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]', output: '[6.0, 0.5, -1.0, 1.0, -1.0]' },
      { title: 'Single', input: '[["a","b"]], [0.5], [["a","b"],["b","a"]]', output: '[0.5, 2.0]' },
      { title: 'Disconnected', input: '[["a","b"],["c","d"]], [2.0, 3.0], [["a","d"]]', output: '[-1.0]' },
      { title: 'Self', input: '[["a","b"]], [4.0], [["b","b"]]', output: '[1.0]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public double[] evalRatioQueries(List<List<String>> equations, double[] values, List<List<String>> queries) {
        Map<String, Map<String, Double>> g = new HashMap<>();
        for (int i = 0; i < equations.size(); i++) {
            String u = equations.get(i).get(0), v = equations.get(i).get(1);
            g.computeIfAbsent(u, k -> new HashMap<>()).put(v, values[i]);
            g.computeIfAbsent(v, k -> new HashMap<>()).put(u, 1.0 / values[i]);
        }
        double[] res = new double[queries.size()];
        for (int i = 0; i < queries.size(); i++) {
            res[i] = bfs(g, queries.get(i).get(0), queries.get(i).get(1));
        }
        return res;
    }
    double bfs(Map<String, Map<String, Double>> g, String src, String dst) {
        if (!g.containsKey(src) || !g.containsKey(dst)) return -1.0;
        if (src.equals(dst)) return 1.0;
        Queue<String> q = new ArrayDeque<>();
        Queue<Double> val = new ArrayDeque<>();
        Set<String> vis = new HashSet<>();
        q.offer(src); val.offer(1.0); vis.add(src);
        while (!q.isEmpty()) {
            String u = q.poll(); double d = val.poll();
            if (u.equals(dst)) return d;
            for (var e : g.get(u).entrySet()) {
                if (vis.add(e.getKey())) { q.offer(e.getKey()); val.offer(d * e.getValue()); }
            }
        }
        return -1.0;
    }
}`,
    pythonSolution: `from collections import defaultdict, deque

def evalRatioQueries(equations, values, queries):
    g = defaultdict(dict)
    for (u, v), val in zip(equations, values):
        g[u][v] = val
        g[v][u] = 1.0 / val
    def solve(s, d):
        if s not in g or d not in g:
            return -1.0
        if s == d:
            return 1.0
        q = deque([(s, 1.0)])
        vis = {s}
        while q:
            u, cur = q.popleft()
            if u == d:
                return round(cur, 6)
            for nxt, w in g[u].items():
                if nxt not in vis:
                    vis.add(nxt)
                    q.append((nxt, cur * w))
        return -1.0
    return [solve(s, d) for s, d in queries]`
  },
  {
    number: 10,
    difficulty: 'MEDIUM',
    title: 'Chrome Tab History Snapshot Array',
    fnName: 'simulateSnapshotArray',
    description: 'Simulate a SnapshotArray of length <code>n</code> initialized to zeros. Operations: <code>["SET", idx, val]</code>, <code>["SNAP"]</code> (returns snapshot ID starting at 0), and <code>["GET", idx, snapId]</code>. Return a list of outputs for <code>SNAP</code> and <code>GET</code>.',
    constraints: ['1 <= n <= 5 * 10^4', '1 <= len(ops) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '3, [["SET",0,5],["SNAP"],["SET",0,6],["GET",0,0]]', output: '[0, 5]' },
      { title: 'Multiple snaps', input: '2, [["SET",1,4],["SNAP"],["SNAP"],["SET",1,9],["GET",1,1],["GET",1,0]]', output: '[0, 1, 4, 4]' },
      { title: 'Unset index', input: '3, [["SNAP"],["GET",2,0]]', output: '[0, 0]' },
      { title: 'Overwrite', input: '1, [["SET",0,1],["SET",0,2],["SNAP"],["GET",0,0]]', output: '[0, 2]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Integer> simulateSnapshotArray(int n, List<List<Object>> ops) {
        TreeMap<Integer, Integer>[] arr = new TreeMap[n];
        for (int i = 0; i < n; i++) { arr[i] = new TreeMap<>(); arr[i].put(0, 0); }
        int snap = 0;
        List<Integer> res = new ArrayList<>();
        for (List<Object> op : ops) {
            String cmd = (String) op.get(0);
            if ("SET".equals(cmd)) arr[(Integer) op.get(1)].put(snap, (Integer) op.get(2));
            else if ("SNAP".equals(cmd)) res.add(snap++);
            else res.add(arr[(Integer) op.get(1)].floorEntry((Integer) op.get(2)).getValue());
        }
        return res;
    }
}`,
    pythonSolution: `import bisect

def simulateSnapshotArray(n, ops):
    hist = [[[0, 0]] for _ in range(n)]
    snap = 0
    res = []
    for op in ops:
        if op[0] == "SET":
            idx, val = op[1], op[2]
            if hist[idx][-1][0] == snap:
                hist[idx][-1][1] = val
            else:
                hist[idx].append([snap, val])
        elif op[0] == "SNAP":
            res.append(snap)
            snap += 1
        else:
            idx, sid = op[1], op[2]
            pos = bisect.bisect_right(hist[idx], [sid, 10**18]) - 1
            res.append(hist[idx][pos][1])
    return res`
  },
  {
    number: 11,
    difficulty: 'HARD',
    title: 'Google Photos Split Array Largest Sum',
    fnName: 'splitArrayMinMaxSum',
    description: 'Given an integer array <code>nums</code> and integer <code>k</code>, split <code>nums</code> into <code>k</code> non-empty contiguous subarrays to minimize the largest sum among these <code>k</code> subarrays.',
    constraints: ['1 <= len(nums) <= 1000', '1 <= k <= min(50, len(nums))'],
    testCases: [
      { title: 'Sample 1', input: '[7,2,5,10,8], 2', output: '18' },
      { title: 'Sample 2', input: '[1,2,3,4,5], 2', output: '9' },
      { title: 'Sample 3', input: '[1,4,4], 3', output: '4' },
      { title: 'Zeros', input: '[0,0,0], 2', output: '0' },
    ],
    javaSolution: `class Solution {
    public int splitArrayMinMaxSum(int[] nums, int k) {
        int lo = 0, hi = 0;
        for (int x : nums) { lo = Math.max(lo, x); hi += x; }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2, parts = 1, cur = 0;
            for (int x : nums) {
                if (cur + x > mid) { parts++; cur = x; }
                else cur += x;
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
                cur = x
            else:
                cur += x
        if parts <= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },
  {
    number: 12,
    difficulty: 'HARD',
    title: 'TPU Cluster Minimum Cost Hire K Engineers',
    fnName: 'minCostHireKWorkers',
    description: 'Given <code>quality[i]</code> and <code>wage[i]</code> for <code>n</code> engineers, hire exactly <code>k</code> engineers such that every hired engineer is paid at least their minimum <code>wage[i]</code> and pay is proportional to <code>quality[i]</code>. Return the minimum total cost rounded to 2 decimals.',
    constraints: ['1 <= k <= n <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[10, 20, 5], [70, 50, 30], 2', output: '105.0' },
      { title: 'Sample 2', input: '[3, 1, 10, 10, 1], [4, 8, 2, 2, 7], 3', output: '30.67' },
      { title: 'Single', input: '[5], [25], 1', output: '25.0' },
      { title: 'Equal', input: '[10, 10], [20, 30], 2', output: '60.0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public double minCostHireKWorkers(int[] quality, int[] wage, int k) {
        int n = quality.length;
        double[][] workers = new double[n][2];
        for (int i = 0; i < n; i++) {
            workers[i][0] = (double) wage[i] / quality[i];
            workers[i][1] = quality[i];
        }
        Arrays.sort(workers, Comparator.comparingDouble(a -> a[0]));
        PriorityQueue<Double> pq = new PriorityQueue<>(Collections.reverseOrder());
        double qSum = 0, ans = Double.MAX_VALUE;
        for (double[] w : workers) {
            pq.offer(w[1]); qSum += w[1];
            if (pq.size() > k) qSum -= pq.poll();
            if (pq.size() == k) ans = Math.min(ans, qSum * w[0]);
        }
        return Math.round(ans * 100.0) / 100.0;
    }
}`,
    pythonSolution: `import heapq

def minCostHireKWorkers(quality, wage, k):
    workers = sorted((w / q, q) for q, w in zip(quality, wage))
    pq = []
    q_sum = 0
    ans = float('inf')
    for ratio, q in workers:
        heapq.heappush(pq, -q)
        q_sum += q
        if len(pq) > k:
            q_sum += heapq.heappop(pq)
        if len(pq) == k:
            ans = min(ans, q_sum * ratio)
    return round(ans, 2)`
  },
  {
    number: 13,
    difficulty: 'HARD',
    title: 'Data Center Minimum Refueling / Server Racks',
    fnName: 'longestIncreasingMatrixPath',
    description: 'Given an <code>m x n</code> integer matrix, return the length of the longest strictly increasing 4-directional path in the matrix.',
    constraints: ['1 <= m, n <= 200', '0 <= matrix[i][j] <= 2^31 - 1'],
    testCases: [
      { title: 'Sample 1', input: '[[9,9,4],[6,6,8],[2,1,1]]', output: '4' },
      { title: 'Sample 2', input: '[[3,4,5],[3,2,6],[2,2,1]]', output: '4' },
      { title: 'Single', input: '[[1]]', output: '1' },
      { title: 'All equal', input: '[[7,7],[7,7]]', output: '1' },
    ],
    javaSolution: `class Solution {
    int[][] memo;
    public int longestIncreasingMatrixPath(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length, ans = 0;
        memo = new int[m][n];
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) ans = Math.max(ans, dfs(matrix, i, j));
        return ans;
    }
    int dfs(int[][] a, int r, int c) {
        if (memo[r][c] != 0) return memo[r][c];
        int best = 1;
        int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < a.length && nc >= 0 && nc < a[0].length && a[nr][nc] > a[r][c]) {
                best = Math.max(best, 1 + dfs(a, nr, nc));
            }
        }
        return memo[r][c] = best;
    }
}`,
    pythonSolution: `from functools import lru_cache
import sys
sys.setrecursionlimit(100000)

def longestIncreasingMatrixPath(matrix):
    m, n = len(matrix), len(matrix[0])
    @lru_cache(None)
    def dfs(r, c):
        best = 1
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        return best
    return max(dfs(i, j) for i in range(m) for j in range(n))`
  },
  {
    number: 14,
    difficulty: 'MEDIUM',
    title: 'GKE Pod Allocation Maximum Ice Bars / Tasks',
    fnName: 'maxPodsScheduled',
    description: 'Given pod memory costs <code>costs</code> and total available cluster memory <code>budget</code>, return the maximum number of pods that can be scheduled simultaneously.',
    constraints: ['1 <= len(costs) <= 10^5', '1 <= budget <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[1, 3, 2, 4, 1], 7', output: '4' },
      { title: 'Zero fit', input: '[10, 6, 8, 7, 7, 8], 5', output: '0' },
      { title: 'All fit', input: '[1, 6, 3, 1, 2, 5], 20', output: '6' },
      { title: 'Exact', input: '[5, 5, 5], 10', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxPodsScheduled(int[] costs, int budget) {
        Arrays.sort(costs);
        int cnt = 0;
        for (int c : costs) {
            if (budget >= c) { budget -= c; cnt++; }
            else break;
        }
        return cnt;
    }
}`,
    pythonSolution: `def maxPodsScheduled(costs, budget):
    costs.sort()
    cnt = 0
    for c in costs:
        if budget >= c:
            budget -= c
            cnt += 1
        else:
            break
    return cnt`
  },
  {
    number: 15,
    difficulty: 'HARD',
    title: 'Gmail Smart Compose KMP Pattern Count',
    fnName: 'countPatternOccurrencesKMP',
    description: 'Given strings <code>text</code> and <code>pattern</code>, use KMP prefix function to return the count of all (possibly overlapping) occurrences of <code>pattern</code> in <code>text</code>.',
    constraints: ['1 <= len(text), len(pattern) <= 10^5'],
    testCases: [
      { title: 'Overlapping', input: '"ababa", "aba"', output: '2' },
      { title: 'All a', input: '"aaaa", "aa"', output: '3' },
      { title: 'None', input: '"abcdef", "gh"', output: '0' },
      { title: 'Exact', input: '"google", "google"', output: '1' },
    ],
    javaSolution: `class Solution {
    public int countPatternOccurrencesKMP(String text, String pattern) {
        int m = pattern.length(), n = text.length();
        int[] lps = new int[m];
        for (int i = 1, len = 0; i < m; ) {
            if (pattern.charAt(i) == pattern.charAt(len)) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
        int cnt = 0;
        for (int i = 0, j = 0; i < n; ) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++; j++;
                if (j == m) { cnt++; j = lps[j - 1]; }
            } else if (j > 0) j = lps[j - 1];
            else i++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countPatternOccurrencesKMP(text, pattern):
    m, n = len(pattern), len(text)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length > 0:
            length = lps[length - 1]
        else:
            i += 1
    cnt = i = j = 0
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                cnt += 1
                j = lps[j - 1]
        elif j > 0:
            j = lps[j - 1]
        else:
            i += 1
    return cnt`
  },

  // ── ROUND 2: Google L3/L4 Technical Onsite — Hard (Q16–Q35) ──────────────
  {
    number: 16,
    difficulty: 'HARD',
    title: 'Colossus Swim in Rising Water',
    fnName: 'minTimeReachCorner',
    description: 'Given an <code>n x n</code> elevation grid where each cell <code>grid[r][c]</code> becomes passable at time <code>t >= grid[r][c]</code>, return the minimum time to travel from <code>(0, 0)</code> to <code>(n-1, n-1)</code> moving in 4 directions.',
    constraints: ['1 <= n <= 50', '0 <= grid[i][j] < n^2'],
    testCases: [
      { title: 'Sample 1', input: '[[0,2],[1,3]]', output: '3' },
      { title: 'Sample 2', input: '[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]', output: '16' },
      { title: '1x1', input: '[[0]]', output: '0' },
      { title: '2x2', input: '[[3,2],[0,1]]', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minTimeReachCorner(int[][] grid) {
        int n = grid.length;
        boolean[][] vis = new boolean[n][n];
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{grid[0][0], 0, 0});
        vis[0][0] = true;
        int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
        while (!pq.isEmpty()) {
            int[] c = pq.poll();
            if (c[1] == n - 1 && c[2] == n - 1) return c[0];
            for (int d = 0; d < 4; d++) {
                int nr = c[1] + dr[d], nc = c[2] + dc[d];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && !vis[nr][nc]) {
                    vis[nr][nc] = true;
                    pq.offer(new int[]{Math.max(c[0], grid[nr][nc]), nr, nc});
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `import heapq

def minTimeReachCorner(grid):
    n = len(grid)
    vis = [[False] * n for _ in range(n)]
    vis[0][0] = True
    pq = [(grid[0][0], 0, 0)]
    while pq:
        t, r, c = heapq.heappop(pq)
        if r == n - 1 and c == n - 1:
            return t
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not vis[nr][nc]:
                vis[nr][nc] = True
                heapq.heappush(pq, (max(t, grid[nr][nc]), nr, nc))
    return -1`
  },
  {
    number: 17,
    difficulty: 'HARD',
    title: 'Waymo Maximum Visible Points',
    fnName: 'maxVisiblePointsInFOV',
    description: 'Given coordinates <code>points</code>, field-of-view <code>angle</code> in degrees, and camera <code>location = [x, y]</code>, return the maximum number of points visible simultaneously in one camera orientation (points at <code>location</code> are always visible).',
    constraints: ['1 <= len(points) <= 10^5', '0 <= angle < 360'],
    testCases: [
      { title: 'Sample 1', input: '[[2,1],[2,2],[3,3]], 90, [1,1]', output: '3' },
      { title: 'Sample 2', input: '[[2,1],[2,2],[3,4],[1,1]], 90, [1,1]', output: '4' },
      { title: 'Opposite', input: '[[1,0],[2,1]], 13, [1,1]', output: '1' },
      { title: 'Same loc', input: '[[0,0],[0,0]], 10, [0,0]', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxVisiblePointsInFOV(List<List<Integer>> points, int angle, List<Integer> location) {
        List<Double> angles = new ArrayList<>();
        int same = 0, lx = location.get(0), ly = location.get(1);
        for (List<Integer> p : points) {
            int dx = p.get(0) - lx, dy = p.get(1) - ly;
            if (dx == 0 && dy == 0) same++;
            else angles.add(Math.toDegrees(Math.atan2(dy, dx)));
        }
        Collections.sort(angles);
        int m = angles.size();
        for (int i = 0; i < m; i++) angles.add(angles.get(i) + 360.0);
        int best = 0, l = 0;
        for (int r = 0; r < angles.size(); r++) {
            while (angles.get(r) - angles.get(l) > angle + 1e-9) l++;
            best = Math.max(best, r - l + 1);
        }
        return best + same;
    }
}`,
    pythonSolution: `import math

def maxVisiblePointsInFOV(points, angle, location):
    lx, ly = location
    angles = []
    same = 0
    for x, y in points:
        dx, dy = x - lx, y - ly
        if dx == 0 and dy == 0:
            same += 1
        else:
            angles.append(math.degrees(math.atan2(dy, dx)))
    angles.sort()
    angles = angles + [a + 360.0 for a in angles]
    best = l = 0
    for r, a in enumerate(angles):
        while a - angles[l] > angle + 1e-9:
            l += 1
        best = max(best, r - l + 1)
    return best + same`
  },
  {
    number: 18,
    difficulty: 'HARD',
    title: 'Google Sheets Range Module Intervals',
    fnName: 'simulateRangeModule',
    description: 'Track half-open intervals <code>[left, right)</code>. Process operations: <code>["ADD", l, r]</code>, <code>["REMOVE", l, r]</code>, <code>["QUERY", l, r]</code> (returns <code>true</code> iff every real number in <code>[l, r)</code> is tracked). Return list of boolean query results.',
    constraints: ['1 <= len(ops) <= 10^4', '1 <= l < r <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[["ADD",10,20],["REMOVE",14,16],["QUERY",10,14],["QUERY",13,15],["QUERY",16,17]]', output: '[true, false, true]' },
      { title: 'Merge', input: '[["ADD",1,5],["ADD",5,10],["QUERY",2,9]]', output: '[true]' },
      { title: 'Empty', input: '[["QUERY",1,2]]', output: '[false]' },
      { title: 'Split', input: '[["ADD",1,10],["REMOVE",3,6],["QUERY",1,3],["QUERY",6,10],["QUERY",2,7]]', output: '[true, true, false]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Boolean> simulateRangeModule(List<List<Object>> ops) {
        TreeMap<Integer, Integer> map = new TreeMap<>();
        List<Boolean> res = new ArrayList<>();
        for (List<Object> op : ops) {
            String cmd = (String) op.get(0);
            int l = (Integer) op.get(1), r = (Integer) op.get(2);
            if ("ADD".equals(cmd)) {
                Integer s = map.floorKey(l), e = map.floorKey(r);
                if (s != null && map.get(s) >= l) l = s;
                if (e != null && map.get(e) > r) r = map.get(e);
                map.subMap(l, true, r, true).clear();
                map.put(l, r);
            } else if ("REMOVE".equals(cmd)) {
                Integer s = map.floorKey(l), e = map.floorKey(r);
                if (e != null && map.get(e) > r) map.put(r, map.get(e));
                if (s != null && map.get(s) > l) map.put(s, l);
                map.subMap(l, true, r, false).clear();
            } else {
                Integer s = map.floorKey(l);
                res.add(s != null && map.get(s) >= r);
            }
        }
        return res;
    }
}`,
    pythonSolution: `import bisect

def simulateRangeModule(ops):
    track = []
    res = []
    for cmd, l, r in ops:
        if cmd == "ADD":
            i = bisect.bisect_left(track, l)
            j = bisect.bisect_right(track, r)
            sub = ([l] if i % 2 == 0 else []) + ([r] if j % 2 == 0 else [])
            track[i:j] = sub
        elif cmd == "REMOVE":
            i = bisect.bisect_left(track, l)
            j = bisect.bisect_right(track, r)
            sub = ([l] if i % 2 == 1 else []) + ([r] if j % 2 == 1 else [])
            track[i:j] = sub
        else:
            i = bisect.bisect_right(track, l)
            j = bisect.bisect_left(track, r)
            res.append(i == j and i % 2 == 1)
    return res`
  },
  {
    number: 19,
    difficulty: 'HARD',
    title: 'Android Gesture Odd-Even Jump Reach',
    fnName: 'countOddEvenStartIndices',
    description: 'Given integer array <code>arr</code>, from index <code>i</code> odd-numbered jumps go to the smallest <code>arr[j] >= arr[i]</code> (with smallest <code>j > i</code>), and even-numbered jumps go to the largest <code>arr[j] <= arr[i]</code> (with smallest <code>j > i</code>). Return how many starting indices can reach <code>n - 1</code>.',
    constraints: ['1 <= len(arr) <= 2 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[10, 13, 12, 14, 15]', output: '2' },
      { title: 'Sample 2', input: '[2, 3, 1, 1, 4]', output: '3' },
      { title: 'Sample 3', input: '[5, 1, 3, 4, 2]', output: '3' },
      { title: 'Single', input: '[42]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int countOddEvenStartIndices(int[] arr) {
        int n = arr.length, ans = 1;
        boolean[] odd = new boolean[n], even = new boolean[n];
        odd[n - 1] = even[n - 1] = true;
        TreeMap<Integer, Integer> map = new TreeMap<>();
        map.put(arr[n - 1], n - 1);
        for (int i = n - 2; i >= 0; i--) {
            Map.Entry<Integer, Integer> hi = map.ceilingEntry(arr[i]);
            Map.Entry<Integer, Integer> lo = map.floorEntry(arr[i]);
            if (hi != null) odd[i] = even[hi.getValue()];
            if (lo != null) even[i] = odd[lo.getValue()];
            if (odd[i]) ans++;
            map.put(arr[i], i);
        }
        return ans;
    }
}`,
    pythonSolution: `def countOddEvenStartIndices(arr):
    n = len(arr)
    def make_next(indices):
        nxt = [-1] * n
        st = []
        for i in indices:
            while st and st[-1] < i:
                nxt[st.pop()] = i
            st.append(i)
        return nxt
    odd_nxt = make_next(sorted(range(n), key=lambda i: (arr[i], i)))
    even_nxt = make_next(sorted(range(n), key=lambda i: (-arr[i], i)))
    odd = [False] * n
    even = [False] * n
    odd[-1] = even[-1] = True
    for i in range(n - 2, -1, -1):
        if odd_nxt[i] != -1:
            odd[i] = even[odd_nxt[i]]
        if even_nxt[i] != -1:
            even[i] = odd[even_nxt[i]]
    return sum(odd)`
  },
  {
    number: 20,
    difficulty: 'HARD',
    title: 'Google Meet Employee Free Time',
    fnName: 'findCommonFreeIntervals',
    description: 'Given a list of employee schedules (each a sorted list of non-overlapping intervals <code>[start, end]</code>), return the finite intervals <code>[start, end]</code> representing common free time for all employees.',
    constraints: ['1 <= len(schedules) <= 50', '0 <= start < end <= 10^8'],
    testCases: [
      { title: 'Sample 1', input: '[[[1,2],[5,6]],[[1,3]],[[4,10]]]', output: '[[3, 4]]' },
      { title: 'Sample 2', input: '[[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]', output: '[[5, 6], [7, 9]]' },
      { title: 'No gap', input: '[[[1,5]],[[2,6]]]', output: '[]' },
      { title: 'Single emp', input: '[[[1,2],[4,5]]]', output: '[[2, 4]]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int[][] findCommonFreeIntervals(List<List<int[]>> schedules) {
        List<int[]> all = new ArrayList<>();
        for (List<int[]> s : schedules) all.addAll(s);
        all.sort((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        List<int[]> res = new ArrayList<>();
        int maxEnd = all.get(0)[1];
        for (int[] iv : all) {
            if (iv[0] > maxEnd) res.add(new int[]{maxEnd, iv[0]});
            maxEnd = Math.max(maxEnd, iv[1]);
        }
        return res.toArray(new int[0][]);
    }
}`,
    pythonSolution: `def findCommonFreeIntervals(schedules):
    all_iv = sorted(iv for s in schedules for iv in s)
    res = []
    max_end = all_iv[0][1]
    for s, e in all_iv:
        if s > max_end:
            res.append([max_end, s])
        if e > max_end:
            max_end = e
    return res`
  },
  {
    number: 21,
    difficulty: 'HARD',
    title: 'YouTube Ads Optimal Car Race Steps',
    fnName: 'minRaceCarInstructions',
    description: 'A car starts at position <code>0</code> with speed <code>+1</code>. Command <code>A</code> moves to <code>pos + speed</code> and doubles <code>speed</code>; command <code>R</code> resets <code>speed</code> to <code>-1</code> if positive else <code>+1</code>. Return the shortest sequence length to reach <code>target</code>.',
    constraints: ['1 <= target <= 10^4'],
    testCases: [
      { title: 'Target 3', input: '3', output: '2' },
      { title: 'Target 6', input: '6', output: '5' },
      { title: 'Target 1', input: '1', output: '1' },
      { title: 'Target 5', input: '5', output: '7' },
    ],
    javaSolution: `class Solution {
    public int minRaceCarInstructions(int target) {
        int[] dp = new int[target + 1];
        for (int t = 1; t <= target; t++) {
            int k = 32 - Integer.numberOfLeadingZeros(t);
            if (t == (1 << k) - 1) { dp[t] = k; continue; }
            dp[t] = (k + 1) + dp[(1 << k) - 1 - t];
            for (int j = 0; j < k - 1; j++) {
                dp[t] = Math.min(dp[t], (k - 1) + 1 + j + 1 + dp[t - ((1 << (k - 1)) - 1) + ((1 << j) - 1)]);
            }
        }
        return dp[target];
    }
}`,
    pythonSolution: `def minRaceCarInstructions(target):
    dp = [0] * (target + 1)
    for t in range(1, target + 1):
        k = t.bit_length()
        if t == (1 << k) - 1:
            dp[t] = k
            continue
        dp[t] = (k + 1) + dp[(1 << k) - 1 - t]
        for j in range(k - 1):
            dp[t] = min(dp[t], (k - 1) + 1 + j + 1 + dp[t - ((1 << (k - 1)) - 1) + ((1 << j) - 1)])
    return dp[target]`
  },
  {
    number: 22,
    difficulty: 'HARD',
    title: 'Google Fonts Word Square Builder',
    fnName: 'countValidWordSquares',
    description: 'Given a set of unique words of the same length <code>L</code>, count how many valid word squares of size <code>L x L</code> can be formed (row <code>k</code> equals column <code>k</code> for all <code>0 <= k < L</code>).',
    constraints: ['1 <= len(words) <= 500', '1 <= len(words[i]) <= 4'],
    testCases: [
      { title: 'Sample 1', input: '["area","lead","wall","lady","ball"]', output: '2' },
      { title: 'Sample 2', input: '["abat","baba","atan","atal"]', output: '2' },
      { title: 'Single char', input: '["a","b"]', output: '2' },
      { title: 'None', input: '["abc","def"]', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int countValidWordSquares(String[] words) {
        int L = words[0].length();
        Map<String, List<String>> pref = new HashMap<>();
        for (String w : words) {
            for (int i = 0; i <= L; i++) {
                pref.computeIfAbsent(w.substring(0, i), k -> new ArrayList<>()).add(w);
            }
        }
        return backtrack(0, L, new ArrayList<>(), pref);
    }
    int backtrack(int step, int L, List<String> cur, Map<String, List<String>> pref) {
        if (step == L) return 1;
        StringBuilder sb = new StringBuilder();
        for (String s : cur) sb.append(s.charAt(step));
        int cnt = 0;
        for (String cand : pref.getOrDefault(sb.toString(), Collections.emptyList())) {
            cur.add(cand);
            cnt += backtrack(step + 1, L, cur, pref);
            cur.remove(cur.size() - 1);
        }
        return cnt;
    }
}`,
    pythonSolution: `from collections import defaultdict

def countValidWordSquares(words):
    L = len(words[0])
    pref = defaultdict(list)
    for w in words:
        for i in range(L + 1):
            pref[w[:i]].append(w)
    def dfs(step, cur):
        if step == L:
            return 1
        p = ''.join(w[step] for w in cur)
        return sum(dfs(step + 1, cur + [cand]) for cand in pref[p])
    return dfs(0, [])`
  },
  {
    number: 23,
    difficulty: 'HARD',
    title: 'Google Maps Shortest Distance From All Buildings',
    fnName: 'shortestDistanceAllBuildings',
    description: 'Given a grid with <code>0</code> (empty), <code>1</code> (building), and <code>2</code> (obstacle), find an empty land cell <code>0</code> that minimizes the sum of 4-directional distances to all buildings, or <code>-1</code> if unreachable.',
    constraints: ['1 <= m, n <= 50'],
    testCases: [
      { title: 'Sample 1', input: '[[1,0,2,0,1],[0,0,0,0,0],[0,0,1,0,0]]', output: '7' },
      { title: 'Single building', input: '[[1,0]]', output: '1' },
      { title: 'Impossible', input: '[[1,2,0]]', output: '-1' },
      { title: 'Blocked', input: '[[1]]', output: '-1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int shortestDistanceAllBuildings(int[][] grid) {
        int m = grid.length, n = grid[0].length, emptyVal = 0, minDist = -1;
        int[][] total = new int[m][n];
        int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    minDist = Integer.MAX_VALUE;
                    Queue<int[]> q = new ArrayDeque<>();
                    q.offer(new int[]{i, j, 0});
                    while (!q.isEmpty()) {
                        int[] c = q.poll();
                        for (int d = 0; d < 4; d++) {
                            int nr = c[0] + dr[d], nc = c[1] + dc[d];
                            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == emptyVal) {
                                grid[nr][nc] = emptyVal - 1;
                                total[nr][nc] += c[2] + 1;
                                minDist = Math.min(minDist, total[nr][nc]);
                                q.offer(new int[]{nr, nc, c[2] + 1});
                            }
                        }
                    }
                    emptyVal--;
                }
            }
        }
        return minDist == Integer.MAX_VALUE ? -1 : minDist;
    }
}`,
    pythonSolution: `from collections import deque

def shortestDistanceAllBuildings(grid):
    m, n = len(grid), len(grid[0])
    g = [row[:] for row in grid]
    total = [[0] * n for _ in range(m)]
    empty_val = 0
    best = -1
    for i in range(m):
        for j in range(n):
            if g[i][j] == 1:
                best = 10**9
                q = deque([(i, j, 0)])
                while q:
                    r, c, d = q.popleft()
                    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < m and 0 <= nc < n and g[nr][nc] == empty_val:
                            g[nr][nc] = empty_val - 1
                            total[nr][nc] += d + 1
                            if total[nr][nc] < best:
                                best = total[nr][nc]
                            q.append((nr, nc, d + 1))
                empty_val -= 1
    return -1 if best == 10**9 else best`
  },
  {
    number: 24,
    difficulty: 'HARD',
    title: 'Protobuf Text Justification',
    fnName: 'justifyLines',
    description: 'Given words and <code>maxWidth</code>, pack words greedily into lines and fully justify each line (extra spaces distributed evenly, leftmost gaps get extra space; last line left-justified).',
    constraints: ['1 <= len(words) <= 300', '1 <= len(words[i]) <= maxWidth <= 100'],
    testCases: [
      { title: 'Sample 1', input: '["This","is","an","example","of","text","justification."], 16', output: '["This    is    an", "example  of text", "justification.  "]' },
      { title: 'Sample 2', input: '["What","must","be","acknowledgment","shall","be"], 16', output: '["What   must   be", "acknowledgment  ", "shall be        "]' },
      { title: 'Single word', input: '["hello"], 7', output: '["hello  "]' },
      { title: 'Exact fit', input: '["a","b"], 3', output: '["a b"]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<String> justifyLines(String[] words, int maxWidth) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < words.length) {
            int j = i + 1, len = words[i].length();
            while (j < words.length && len + 1 + words[j].length() <= maxWidth) {
                len += 1 + words[j++].length();
            }
            StringBuilder sb = new StringBuilder(words[i]);
            int gaps = j - i - 1;
            if (j == words.length || gaps == 0) {
                for (int k = i + 1; k < j; k++) sb.append(' ').append(words[k]);
                while (sb.length() < maxWidth) sb.append(' ');
            } else {
                int totalSpaces = maxWidth - (len - gaps), each = totalSpaces / gaps, extra = totalSpaces % gaps;
                for (int k = i + 1; k < j; k++) {
                    for (int s = 0; s < each + (k - i <= extra ? 1 : 0); s++) sb.append(' ');
                    sb.append(words[k]);
                }
            }
            res.add(sb.toString());
            i = j;
        }
        return res;
    }
}`,
    pythonSolution: `def justifyLines(words, maxWidth):
    res = []
    cur = []
    num_chars = 0
    for w in words:
        if num_chars + len(w) + len(cur) > maxWidth:
            gaps = len(cur) - 1
            if gaps == 0:
                res.append(cur[0].ljust(maxWidth))
            else:
                spaces = maxWidth - num_chars
                each, extra = divmod(spaces, gaps)
                line = []
                for idx, cw in enumerate(cur[:-1]):
                    line.append(cw + ' ' * (each + (1 if idx < extra else 0)))
                line.append(cur[-1])
                res.append(''.join(line))
            cur, num_chars = [], 0
        cur.append(w)
        num_chars += len(w)
    res.append(' '.join(cur).ljust(maxWidth))
    return res`
  },
  {
    number: 25,
    difficulty: 'HARD',
    title: 'Google Cloud Subarrays With K Different Integers',
    fnName: 'subarraysExactKDistinct',
    description: 'Given an array of tenant IDs <code>nums</code> and integer <code>k</code>, return the number of contiguous subarrays with exactly <code>k</code> distinct integers.',
    constraints: ['1 <= len(nums) <= 2 * 10^4', '1 <= k <= len(nums)'],
    testCases: [
      { title: 'Sample 1', input: '[1,2,1,2,3], 2', output: '7' },
      { title: 'Sample 2', input: '[1,2,1,3,4], 3', output: '3' },
      { title: 'All equal', input: '[5,5,5], 1', output: '6' },
      { title: 'Impossible', input: '[1,2], 3', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    private int atMost(int[] a, int k) {
        Map<Integer, Integer> c = new HashMap<>();
        int l = 0, res = 0;
        for (int r = 0; r < a.length; r++) {
            c.put(a[r], c.getOrDefault(a[r], 0) + 1);
            while (c.size() > k) {
                c.put(a[l], c.get(a[l]) - 1);
                if (c.get(a[l]) == 0) c.remove(a[l]);
                l++;
            }
            res += r - l + 1;
        }
        return res;
    }
    public int subarraysExactKDistinct(int[] nums, int k) {
        return atMost(nums, k) - atMost(nums, k - 1);
    }
}`,
    pythonSolution: `from collections import defaultdict

def subarraysExactKDistinct(nums, k):
    def at_most(limit):
        cnt = defaultdict(int)
        l = distinct = res = 0
        for r, x in enumerate(nums):
            if cnt[x] == 0:
                distinct += 1
            cnt[x] += 1
            while distinct > limit:
                cnt[nums[l]] -= 1
                if cnt[nums[l]] == 0:
                    distinct -= 1
                l += 1
            res += r - l + 1
        return res
    return at_most(k) - at_most(k - 1)`
  },
  {
    number: 26,
    difficulty: 'HARD',
    title: 'Colab String Transforms Into Another String',
    fnName: 'canTransformStrings',
    description: 'Given two equal-length lowercase strings <code>str1</code> and <code>str2</code>, in one conversion you can replace all occurrences of one character in <code>str1</code> with any lowercase character. Return <code>true</code> iff <code>str1</code> can become <code>str2</code>.',
    constraints: ['1 <= len(str1) == len(str2) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '"aabcc", "ccdee"', output: 'true' },
      { title: 'All 26 used', input: '"abcdefghijklmnopqrstuvwxyz", "bcdefghijklmnopqrstuvwxyza"', output: 'false' },
      { title: 'Identical', input: '"abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz"', output: 'true' },
      { title: 'Conflict', input: '"aa", "ab"', output: 'false' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public boolean canTransformStrings(String str1, String str2) {
        if (str1.equals(str2)) return true;
        Map<Character, Character> map = new HashMap<>();
        Set<Character> used = new HashSet<>();
        for (int i = 0; i < str1.length(); i++) {
            char a = str1.charAt(i), b = str2.charAt(i);
            if (map.containsKey(a) && map.get(a) != b) return false;
            map.put(a, b);
            used.add(b);
        }
        return used.size() < 26;
    }
}`,
    pythonSolution: `def canTransformStrings(str1, str2):
    if str1 == str2:
        return True
    mapping = {}
    for a, b in zip(str1, str2):
        if a in mapping and mapping[a] != b:
            return False
        mapping[a] = b
    return len(set(str2)) < 26`
  },
  {
    number: 27,
    difficulty: 'HARD',
    title: 'Maps Max Points on a Line',
    fnName: 'maxCollinearPoints',
    description: 'Given <code>n</code> 2D integer points <code>points[i] = [x, y]</code>, return the maximum number of points that lie on the same straight line.',
    constraints: ['1 <= n <= 300', '-10^4 <= x, y <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[[1,1],[2,2],[3,3]]', output: '3' },
      { title: 'Sample 2', input: '[[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]', output: '4' },
      { title: 'Single', input: '[[0,0]]', output: '1' },
      { title: 'Vertical', input: '[[2,1],[2,5],[2,9],[3,1]]', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    public int maxCollinearPoints(int[][] points) {
        int n = points.length, ans = 1;
        for (int i = 0; i < n; i++) {
            Map<String, Integer> map = new HashMap<>();
            for (int j = i + 1; j < n; j++) {
                int dx = points[j][0] - points[i][0], dy = points[j][1] - points[i][1];
                int g = gcd(Math.abs(dx), Math.abs(dy));
                dx /= g; dy /= g;
                if (dx < 0 || (dx == 0 && dy < 0)) { dx = -dx; dy = -dy; }
                String key = dx + "," + dy;
                int c = map.getOrDefault(key, 0) + 1;
                map.put(key, c);
                ans = Math.max(ans, c + 1);
            }
        }
        return ans;
    }
}`,
    pythonSolution: `from collections import Counter
import math

def maxCollinearPoints(points):
    n = len(points)
    if n <= 2:
        return n
    ans = 1
    for i in range(n):
        cnt = Counter()
        x1, y1 = points[i]
        for j in range(i + 1, n):
            dx, dy = points[j][0] - x1, points[j][1] - y1
            g = math.gcd(abs(dx), abs(dy))
            dx //= g
            dy //= g
            if dx < 0 or (dx == 0 and dy < 0):
                dx, dy = -dx, -dy
            cnt[(dx, dy)] += 1
        if cnt:
            ans = max(ans, max(cnt.values()) + 1)
    return ans`
  },
  {
    number: 28,
    difficulty: 'HARD',
    title: 'Spanner Russian Doll Envelopes',
    fnName: 'maxNestedContainers',
    description: 'Given 2D container dimensions <code>[w, h]</code>, one container fits inside another iff both its width and height are strictly smaller. Return the maximum number of containers you can nest.',
    constraints: ['1 <= len(envelopes) <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '[[5,4],[6,4],[6,7],[2,3]]', output: '3' },
      { title: 'Equal', input: '[[1,1],[1,1],[1,1]]', output: '1' },
      { title: 'Increasing', input: '[[1,2],[2,3],[3,4],[4,5]]', output: '4' },
      { title: 'Tie width', input: '[[4,5],[4,6],[6,7],[2,3],[1,1]]', output: '4' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxNestedContainers(int[][] envelopes) {
        Arrays.sort(envelopes, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(b[1], a[1]));
        int[] tails = new int[envelopes.length];
        int len = 0;
        for (int[] e : envelopes) {
            int idx = Arrays.binarySearch(tails, 0, len, e[1]);
            if (idx < 0) idx = -idx - 1;
            tails[idx] = e[1];
            if (idx == len) len++;
        }
        return len;
    }
}`,
    pythonSolution: `import bisect

def maxNestedContainers(envelopes):
    envelopes.sort(key=lambda e: (e[0], -e[1]))
    tails = []
    for _, h in envelopes:
        idx = bisect.bisect_left(tails, h)
        if idx == len(tails):
            tails.append(h)
        else:
            tails[idx] = h
    return len(tails)`
  },
  {
    number: 29,
    difficulty: 'HARD',
    title: 'Android Making A Large Island',
    fnName: 'largestIslandAfterOneFlip',
    description: 'Given an <code>n x n</code> binary grid, you may change at most one <code>0</code> to <code>1</code>. Return the size of the largest 4-directionally connected island of <code>1</code>s.',
    constraints: ['1 <= n <= 500'],
    testCases: [
      { title: 'Sample 1', input: '[[1,0],[0,1]]', output: '3' },
      { title: 'Sample 2', input: '[[1,1],[1,0]]', output: '4' },
      { title: 'All ones', input: '[[1,1],[1,1]]', output: '4' },
      { title: 'All zeros', input: '[[0,0],[0,0]]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int largestIslandAfterOneFlip(int[][] grid) {
        int n = grid.length, id = 2, best = 0;
        Map<Integer, Integer> area = new HashMap<>();
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) {
            if (grid[i][j] == 1) {
                int sz = dfs(grid, i, j, id);
                area.put(id++, sz);
                best = Math.max(best, sz);
            }
        }
        int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) {
            if (grid[i][j] == 0) {
                Set<Integer> seen = new HashSet<>();
                int cur = 1;
                for (int d = 0; d < 4; d++) {
                    int nr = i + dr[d], nc = j + dc[d];
                    if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] > 1 && seen.add(grid[nr][nc])) {
                        cur += area.get(grid[nr][nc]);
                    }
                }
                best = Math.max(best, cur);
            }
        }
        return best;
    }
    int dfs(int[][] g, int r, int c, int id) {
        if (r < 0 || r >= g.length || c < 0 || c >= g.length || g[r][c] != 1) return 0;
        g[r][c] = id;
        return 1 + dfs(g, r + 1, c, id) + dfs(g, r - 1, c, id) + dfs(g, r, c + 1, id) + dfs(g, r, c - 1, id);
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(300000)

def largestIslandAfterOneFlip(grid):
    n = len(grid)
    g = [row[:] for row in grid]
    area = {}
    cid = 2
    best = 0
    def dfs(r, c, idx):
        if r < 0 or r >= n or c < 0 or c >= n or g[r][c] != 1:
            return 0
        g[r][c] = idx
        return 1 + dfs(r + 1, c, idx) + dfs(r - 1, c, idx) + dfs(r, c + 1, idx) + dfs(r, c - 1, idx)
    for i in range(n):
        for j in range(n):
            if g[i][j] == 1:
                sz = dfs(i, j, cid)
                area[cid] = sz
                best = max(best, sz)
                cid += 1
    for i in range(n):
        for j in range(n):
            if g[i][j] == 0:
                seen = set()
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = i + dr, j + dc
                    if 0 <= nr < n and 0 <= nc < n and g[nr][nc] > 1:
                        seen.add(g[nr][nc])
                best = max(best, 1 + sum(area[x] for x in seen))
    return best`
  },
  {
    number: 30,
    difficulty: 'HARD',
    title: 'YouTube Video Minimum Window Subsequence',
    fnName: 'minWindowSubsequence',
    description: 'Given strings <code>s1</code> and <code>s2</code>, return the minimum-length contiguous substring of <code>s1</code> such that <code>s2</code> is a subsequence of that substring (if tie, earliest start; if none, <code>""</code>).',
    constraints: ['1 <= len(s1) <= 2 * 10^4', '1 <= len(s2) <= 100'],
    testCases: [
      { title: 'Sample 1', input: '"abcdebdde", "bde"', output: 'bcde' },
      { title: 'Sample 2', input: '"cnhczmccqouqadqtmjjzl", "mm"', output: 'mccqouqadqtm' },
      { title: 'Exact', input: '"google", "gle"', output: 'gle' },
      { title: 'Single', input: '"abc", "b"', output: 'b' },
    ],
    javaSolution: `class Solution {
    public String minWindowSubsequence(String s1, String s2) {
        int m = s1.length(), n = s2.length(), bestStart = 0, bestLen = Integer.MAX_VALUE;
        int i = 0;
        while (i < m) {
            int j = 0;
            while (i < m && j < n) {
                if (s1.charAt(i) == s2.charAt(j)) j++;
                i++;
            }
            if (j < n) break;
            int end = i - 1;
            j = n - 1;
            while (j >= 0) {
                if (s1.charAt(end) == s2.charAt(j)) j--;
                end--;
            }
            int start = end + 1;
            if (i - start < bestLen) { bestLen = i - start; bestStart = start; }
            i = start + 1;
        }
        return bestLen == Integer.MAX_VALUE ? "" : s1.substring(bestStart, bestStart + bestLen);
    }
}`,
    pythonSolution: `def minWindowSubsequence(s1, s2):
    m, n = len(s1), len(s2)
    best_start, best_len = 0, 10**9
    i = 0
    while i < m:
        j = 0
        while i < m and j < n:
            if s1[i] == s2[j]:
                j += 1
            i += 1
        if j < n:
            break
        end = i - 1
        j = n - 1
        while j >= 0:
            if s1[end] == s2[j]:
                j -= 1
            end -= 1
        start = end + 1
        if i - start < best_len:
            best_len = i - start
            best_start = start
        i = start + 1
    return "" if best_len == 10**9 else s1[best_start:best_start + best_len]`
  },
  {
    number: 31,
    difficulty: 'HARD',
    title: 'Borg Fleet Minimum Refueling / Candy Rating',
    fnName: 'minPriorityTokens',
    description: 'Given <code>n</code> servers with priority ratings <code>ratings</code>, each server gets at least 1 token, and any server with a strictly higher rating than an adjacent neighbor must get strictly more tokens. Return the minimum total tokens required.',
    constraints: ['1 <= len(ratings) <= 2 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[1, 0, 2]', output: '5' },
      { title: 'Sample 2', input: '[1, 2, 2]', output: '4' },
      { title: 'Decreasing', input: '[5, 4, 3, 2, 1]', output: '15' },
      { title: 'Single', input: '[7]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minPriorityTokens(int[] ratings) {
        int n = ratings.length;
        int[] c = new int[n];
        Arrays.fill(c, 1);
        for (int i = 1; i < n; i++) if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
        for (int i = n - 2; i >= 0; i--) if (ratings[i] > ratings[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
        int sum = 0;
        for (int x : c) sum += x;
        return sum;
    }
}`,
    pythonSolution: `def minPriorityTokens(ratings):
    n = len(ratings)
    c = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            c[i] = c[i - 1] + 1
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            c[i] = max(c[i], c[i + 1] + 1)
    return sum(c)`
  },
  {
    number: 32,
    difficulty: 'HARD',
    title: 'Google Drive Frog River Crossing',
    fnName: 'canCrossRiverStones',
    description: 'Given sorted stone positions <code>stones</code> starting at <code>0</code>, the frog jumps 1 unit first. If its last jump was <code>k</code> units, its next jump must be <code>k - 1</code>, <code>k</code>, or <code>k + 1</code> units forward. Return <code>true</code> iff it can reach the last stone.',
    constraints: ['2 <= len(stones) <= 2000', 'stones[0] == 0'],
    testCases: [
      { title: 'Sample 1', input: '[0,1,3,5,6,8,12,17]', output: 'true' },
      { title: 'Sample 2', input: '[0,1,2,3,4,8,9,11]', output: 'false' },
      { title: 'Two stones', input: '[0,1]', output: 'true' },
      { title: 'Gap at start', input: '[0,2]', output: 'false' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public boolean canCrossRiverStones(int[] stones) {
        Map<Integer, Set<Integer>> dp = new HashMap<>();
        for (int s : stones) dp.put(s, new HashSet<>());
        dp.get(0).add(0);
        for (int s : stones) {
            for (int k : dp.get(s)) {
                for (int step = k - 1; step <= k + 1; step++) {
                    if (step > 0 && dp.containsKey(s + step)) dp.get(s + step).add(step);
                }
            }
        }
        return !dp.get(stones[stones.length - 1]).isEmpty();
    }
}`,
    pythonSolution: `def canCrossRiverStones(stones):
    dp = {s: set() for s in stones}
    dp[0].add(0)
    for s in stones:
        for k in dp[s]:
            for step in (k - 1, k, k + 1):
                if step > 0 and s + step in dp:
                    dp[s + step].add(step)
    return len(dp[stones[-1]]) > 0`
  },
  {
    number: 33,
    difficulty: 'HARD',
    title: 'TPU Minimum Cost to Reach Destination in Time',
    fnName: 'minCostReachInTime',
    description: 'Given <code>maxTime</code>, undirected edges <code>[u, v, time]</code>, and node entry fees <code>passingFees</code> (always pay <code>passingFees[0]</code> at start), return the minimum total fee to reach node <code>n - 1</code> from <code>0</code> within <code>maxTime</code>, or <code>-1</code>.',
    constraints: ['1 <= maxTime <= 1000', '2 <= len(passingFees) <= 1000'],
    testCases: [
      { title: 'Sample 1', input: '30, [[0,1,10],[1,2,10],[2,5,10],[0,3,1],[3,4,10],[4,5,15]], [5,1,2,20,20,3]', output: '11' },
      { title: 'Sample 2', input: '29, [[0,1,10],[1,2,10],[2,5,10],[0,3,1],[3,4,10],[4,5,15]], [5,1,2,20,20,3]', output: '48' },
      { title: 'Impossible', input: '25, [[0,1,10],[1,2,10],[2,5,10],[0,3,1],[3,4,10],[4,5,15]], [5,1,2,20,20,3]', output: '-1' },
      { title: 'Direct', input: '10, [[0,1,5]], [3, 7]', output: '10' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minCostReachInTime(int maxTime, int[][] edges, int[] passingFees) {
        int n = passingFees.length;
        List<int[]>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(new int[]{e[1], e[2]}); g[e[1]].add(new int[]{e[0], e[2]}); }
        int[] minTime = new int[n];
        Arrays.fill(minTime, Integer.MAX_VALUE);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{passingFees[0], 0, 0});
        minTime[0] = 0;
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int cost = cur[0], t = cur[1], u = cur[2];
            if (u == n - 1) return cost;
            for (int[] nb : g[u]) {
                int v = nb[0], nt = t + nb[1];
                if (nt <= maxTime && nt < minTime[v]) {
                    minTime[v] = nt;
                    pq.offer(new int[]{cost + passingFees[v], nt, v});
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `import heapq

def minCostReachInTime(maxTime, edges, passingFees):
    n = len(passingFees)
    g = [[] for _ in range(n)]
    for u, v, t in edges:
        g[u].append((v, t))
        g[v].append((u, t))
    min_t = [10**9] * n
    min_t[0] = 0
    pq = [(passingFees[0], 0, 0)]
    while pq:
        cost, t, u = heapq.heappop(pq)
        if u == n - 1:
            return cost
        for v, dt in g[u]:
            nt = t + dt
            if nt <= maxTime and nt < min_t[v]:
                min_t[v] = nt
                heapq.heappush(pq, (cost + passingFees[v], nt, v))
    return -1`
  },
  {
    number: 34,
    difficulty: 'HARD',
    title: 'TensorFlow Range Sum Query 2D Mutable',
    fnName: 'rangeSum2DMutable',
    description: 'Given a 2D integer matrix, process operations: <code>["UPDATE", r, c, val]</code> sets <code>matrix[r][c] = val</code>; <code>["SUM", r1, c1, r2, c2]</code> returns the sum of the subrectangle <code>[r1..r2, c1..c2]</code>. Return a list of <code>SUM</code> results.',
    constraints: ['1 <= m, n <= 200', '1 <= len(ops) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]], [["SUM",2,1,4,3],["UPDATE",3,2,2],["SUM",2,1,4,3]]', output: '[8, 10]' },
      { title: '1x1', input: '[[5]], [["SUM",0,0,0,0],["UPDATE",0,0,9],["SUM",0,0,0,0]]', output: '[5, 9]' },
      { title: 'Full grid', input: '[[1,2],[3,4]], [["SUM",0,0,1,1],["UPDATE",0,0,10],["SUM",0,0,1,1]]', output: '[10, 19]' },
      { title: 'Row query', input: '[[1,2,3]], [["SUM",0,1,0,2]]', output: '[5]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int[][] tree, nums;
    int m, n;
    void add(int r, int c, int delta) {
        for (int i = r + 1; i <= m; i += i & -i)
            for (int j = c + 1; j <= n; j += j & -j) tree[i][j] += delta;
    }
    int sum(int r, int c) {
        int s = 0;
        for (int i = r + 1; i > 0; i -= i & -i)
            for (int j = c + 1; j > 0; j -= j & -j) s += tree[i][j];
        return s;
    }
    public List<Integer> rangeSum2DMutable(int[][] matrix, List<List<Object>> ops) {
        m = matrix.length; n = matrix[0].length;
        tree = new int[m + 1][n + 1]; nums = new int[m][n];
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) { nums[i][j] = matrix[i][j]; add(i, j, matrix[i][j]); }
        List<Integer> res = new ArrayList<>();
        for (List<Object> op : ops) {
            if ("UPDATE".equals(op.get(0))) {
                int r = (Integer) op.get(1), c = (Integer) op.get(2), val = (Integer) op.get(3);
                add(r, c, val - nums[r][c]); nums[r][c] = val;
            } else {
                int r1 = (Integer) op.get(1), c1 = (Integer) op.get(2), r2 = (Integer) op.get(3), c2 = (Integer) op.get(4);
                res.add(sum(r2, c2) - sum(r1 - 1, c2) - sum(r2, c1 - 1) + sum(r1 - 1, c1 - 1));
            }
        }
        return res;
    }
}`,
    pythonSolution: `def rangeSum2DMutable(matrix, ops):
    m, n = len(matrix), len(matrix[0])
    bit = [[0] * (n + 1) for _ in range(m + 1)]
    vals = [[0] * n for _ in range(m)]
    def add(r, c, delta):
        i = r + 1
        while i <= m:
            j = c + 1
            while j <= n:
                bit[i][j] += delta
                j += j & -j
            i += i & -i
    def query(r, c):
        s = 0
        i = r + 1
        while i > 0:
            j = c + 1
            while j > 0:
                s += bit[i][j]
                j -= j & -j
            i -= i & -i
        return s
    for i in range(m):
        for j in range(n):
            vals[i][j] = matrix[i][j]
            add(i, j, matrix[i][j])
    res = []
    for op in ops:
        if op[0] == "UPDATE":
            _, r, c, v = op
            add(r, c, v - vals[r][c])
            vals[r][c] = v
        else:
            _, r1, c1, r2, c2 = op
            res.append(query(r2, c2) - query(r1 - 1, c2) - query(r2, c1 - 1) + query(r1 - 1, c1 - 1))
    return res`
  },
  {
    number: 35,
    difficulty: 'HARD',
    title: 'DeepMind Tallest Billboard Two Equal Supports',
    fnName: 'tallestEqualBillboard',
    description: 'Given steel rod lengths <code>rods</code>, weld two subsets of rods to form two disjoint supports of equal height. Return the largest possible height of each support (0 if impossible).',
    constraints: ['1 <= len(rods) <= 20', '1 <= rods[i] <= 1000', 'sum(rods) <= 5000'],
    testCases: [
      { title: 'Sample 1', input: '[1,2,3,6]', output: '6' },
      { title: 'Sample 2', input: '[1,2,3,4,5,6]', output: '10' },
      { title: 'Impossible', input: '[1,2]', output: '0' },
      { title: 'Single', input: '[5]', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int tallestEqualBillboard(int[] rods) {
        Map<Integer, Integer> dp = new HashMap<>();
        dp.put(0, 0);
        for (int r : rods) {
            Map<Integer, Integer> cur = new HashMap<>(dp);
            for (var e : cur.entrySet()) {
                int diff = e.getKey(), h = e.getValue();
                dp.put(diff + r, Math.max(dp.getOrDefault(diff + r, 0), h));
                int nd = Math.abs(diff - r);
                dp.put(nd, Math.max(dp.getOrDefault(nd, 0), h + Math.min(diff, r)));
            }
        }
        return dp.getOrDefault(0, 0);
    }
}`,
    pythonSolution: `def tallestEqualBillboard(rods):
    dp = {0: 0}
    for r in rods:
        nxt = dp.copy()
        for diff, h in dp.items():
            nxt[diff + r] = max(nxt.get(diff + r, 0), h)
            nd = abs(diff - r)
            nxt[nd] = max(nxt.get(nd, 0), h + min(diff, r))
        dp = nxt
    return dp.get(0, 0)`
  },

  // ── ROUND 3: Google L4/L5 Bar-Raiser — Extreme (Q36–Q50) ─────────────────
  {
    number: 36,
    difficulty: 'EXTREME',
    title: 'Bitmask DP Hamiltonian Path Shortest Cost',
    fnName: 'shortestVisitingAllNodes',
    description: 'Given an unweighted undirected graph <code>graph</code> of <code>n</code> nodes (adjacency list), return the length of the shortest path that visits every node at least once (revisiting nodes and edges allowed).',
    constraints: ['1 <= n <= 12'],
    testCases: [
      { title: 'Sample 1', input: '[[1,2,3],[0],[0],[0]]', output: '4' },
      { title: 'Sample 2', input: '[[1],[0,2,4],[1,3,4],[2],[1,2]]', output: '4' },
      { title: 'Single', input: '[[]]', output: '0' },
      { title: 'Line', input: '[[1],[0,2],[1]]', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int shortestVisitingAllNodes(int[][] graph) {
        int n = graph.length, target = (1 << n) - 1;
        if (n == 1) return 0;
        boolean[][] vis = new boolean[n][1 << n];
        Queue<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) { q.offer(new int[]{i, 1 << i, 0}); vis[i][1 << i] = true; }
        while (!q.isEmpty()) {
            int[] c = q.poll();
            if (c[1] == target) return c[2];
            for (int nb : graph[c[0]]) {
                int nm = c[1] | (1 << nb);
                if (!vis[nb][nm]) { vis[nb][nm] = true; q.offer(new int[]{nb, nm, c[2] + 1}); }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque

def shortestVisitingAllNodes(graph):
    n = len(graph)
    if n == 1:
        return 0
    target = (1 << n) - 1
    vis = {(i, 1 << i) for i in range(n)}
    q = deque((i, 1 << i, 0) for i in range(n))
    while q:
        u, mask, dist = q.popleft()
        if mask == target:
            return dist
        for v in graph[u]:
            nm = mask | (1 << v)
            if (v, nm) not in vis:
                vis.add((v, nm))
                q.append((v, nm, dist + 1))
    return -1`
  },
  {
    number: 37,
    difficulty: 'EXTREME',
    title: 'Cherry Pickup Dual-Path Grid DP',
    fnName: 'maxDualPathCherries',
    description: 'Given an <code>n x n</code> grid with <code>0</code> (empty), <code>1</code> (cherry), and <code>-1</code> (thorn), travel from <code>(0,0)</code> to <code>(n-1,n-1)</code> (right/down) and back to <code>(0,0)</code> (left/up), collecting cherries at most once per cell. Return maximum cherries collected (0 if blocked).',
    constraints: ['1 <= n <= 50'],
    testCases: [
      { title: 'Sample 1', input: '[[0,1,-1],[1,0,-1],[1,1,1]]', output: '5' },
      { title: 'Blocked', input: '[[1,1,-1],[1,-1,1],[-1,1,1]]', output: '0' },
      { title: '1x1', input: '[[1]]', output: '1' },
      { title: '2x2', input: '[[1,1],[1,1]]', output: '4' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxDualPathCherries(int[][] grid) {
        int n = grid.length;
        int[][] dp = new int[n][n];
        for (int[] r : dp) Arrays.fill(r, Integer.MIN_VALUE);
        dp[0][0] = grid[0][0];
        for (int t = 1; t <= 2 * n - 2; t++) {
            int[][] ndp = new int[n][n];
            for (int[] r : ndp) Arrays.fill(r, Integer.MIN_VALUE);
            for (int r1 = Math.max(0, t - n + 1); r1 <= Math.min(n - 1, t); r1++) {
                for (int r2 = Math.max(0, t - n + 1); r2 <= Math.min(n - 1, t); r2++) {
                    int c1 = t - r1, c2 = t - r2;
                    if (grid[r1][c1] == -1 || grid[r2][c2] == -1) continue;
                    int best = Integer.MIN_VALUE;
                    for (int pr1 : new int[]{r1, r1 - 1}) for (int pr2 : new int[]{r2, r2 - 1}) {
                        if (pr1 >= 0 && pr2 >= 0) best = Math.max(best, dp[pr1][pr2]);
                    }
                    if (best != Integer.MIN_VALUE) {
                        ndp[r1][r2] = best + grid[r1][c1] + (r1 != r2 ? grid[r2][c2] : 0);
                    }
                }
            }
            dp = ndp;
        }
        return Math.max(0, dp[n - 1][n - 1]);
    }
}`,
    pythonSolution: `def maxDualPathCherries(grid):
    n = len(grid)
    NEG = -10**9
    dp = [[NEG] * n for _ in range(n)]
    dp[0][0] = grid[0][0]
    for t in range(1, 2 * n - 1):
        ndp = [[NEG] * n for _ in range(n)]
        lo = max(0, t - n + 1)
        hi = min(n - 1, t)
        for r1 in range(lo, hi + 1):
            c1 = t - r1
            if grid[r1][c1] == -1:
                continue
            for r2 in range(lo, hi + 1):
                c2 = t - r2
                if grid[r2][c2] == -1:
                    continue
                best = NEG
                for pr1 in (r1, r1 - 1):
                    if pr1 < 0:
                        continue
                    for pr2 in (r2, r2 - 1):
                        if pr2 >= 0 and dp[pr1][pr2] > best:
                            best = dp[pr1][pr2]
                if best > NEG:
                    ndp[r1][r2] = best + grid[r1][c1] + (grid[r2][c2] if r1 != r2 else 0)
        dp = ndp
    return max(0, dp[n - 1][n - 1])`
  },
  {
    number: 38,
    difficulty: 'EXTREME',
    title: 'Segment Tree Falling Squares Max Height',
    fnName: 'fallingSquaresHeights',
    description: 'Drop squares onto an infinite X-axis where <code>positions[i] = [left, sideLength]</code>. Return an array of the maximum stack height across the entire X-axis after each square lands.',
    constraints: ['1 <= len(positions) <= 1000', '1 <= left <= 10^8', '1 <= sideLength <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '[[1,2],[2,3],[6,1]]', output: '[2, 5, 5]' },
      { title: 'Touch edge', input: '[[100,100],[200,100]]', output: '[100, 100]' },
      { title: 'Stack', input: '[[1,5],[2,2],[3,1]]', output: '[5, 7, 8]' },
      { title: 'Single', input: '[[0,4]]', output: '[4]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Integer> fallingSquaresHeights(int[][] positions) {
        int n = positions.length;
        int[] heights = new int[n];
        List<Integer> res = new ArrayList<>();
        int maxH = 0;
        for (int i = 0; i < n; i++) {
            int l1 = positions[i][0], r1 = l1 + positions[i][1], base = 0;
            for (int j = 0; j < i; j++) {
                int l2 = positions[j][0], r2 = l2 + positions[j][1];
                if (l1 < r2 && l2 < r1) base = Math.max(base, heights[j]);
            }
            heights[i] = base + positions[i][1];
            maxH = Math.max(maxH, heights[i]);
            res.add(maxH);
        }
        return res;
    }
}`,
    pythonSolution: `def fallingSquaresHeights(positions):
    coords = sorted({p[0] for p in positions} | {p[0] + p[1] for p in positions})
    idx = {x: i for i, x in enumerate(coords)}
    m = len(coords)
    heights = [0] * m
    res = []
    max_h = 0
    for l, side in positions:
        li, ri = idx[l], idx[l + side]
        base = max(heights[li:ri])
        nh = base + side
        for k in range(li, ri):
            heights[k] = nh
        if nh > max_h:
            max_h = nh
        res.append(max_h)
    return res`
  },
  {
    number: 39,
    difficulty: 'EXTREME',
    title: 'Bitmask DP Sticker Spelling Minimum',
    fnName: 'minStickersToSpell',
    description: 'Given a list of lowercase sticker strings <code>stickers</code> and a <code>target</code> string, return the minimum number of stickers needed to spell <code>target</code> (each sticker can be cut into letters and used unlimited times), or <code>-1</code> if impossible.',
    constraints: ['1 <= len(stickers) <= 50', '1 <= len(target) <= 15'],
    testCases: [
      { title: 'Sample 1', input: '["with","example","science"], "thehat"', output: '3' },
      { title: 'Impossible', input: '["notice","possible"], "basicbasic"', output: '-1' },
      { title: 'Single', input: '["google"], "ggo"', output: '1' },
      { title: 'Exact', input: '["abc"], "cba"', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minStickersToSpell(String[] stickers, String target) {
        int n = target.length(), N = 1 << n;
        int[] dp = new int[N];
        Arrays.fill(dp, -1);
        dp[0] = 0;
        for (int mask = 0; mask < N; mask++) {
            if (dp[mask] == -1) continue;
            for (String st : stickers) {
                int cur = mask;
                for (char c : st.toCharArray()) {
                    for (int i = 0; i < n; i++) {
                        if ((cur & (1 << i)) == 0 && target.charAt(i) == c) {
                            cur |= (1 << i);
                            break;
                        }
                    }
                }
                if (dp[cur] == -1 || dp[cur] > dp[mask] + 1) dp[cur] = dp[mask] + 1;
            }
        }
        return dp[N - 1];
    }
}`,
    pythonSolution: `def minStickersToSpell(stickers, target):
    n = len(target)
    N = 1 << n
    dp = [-1] * N
    dp[0] = 0
    for mask in range(N):
        if dp[mask] == -1:
            continue
        for st in stickers:
            cur = mask
            for ch in st:
                for i in range(n):
                    if not (cur & (1 << i)) and target[i] == ch:
                        cur |= 1 << i
                        break
            if dp[cur] == -1 or dp[cur] > dp[mask] + 1:
                dp[cur] = dp[mask] + 1
    return dp[N - 1]`
  },
  {
    number: 40,
    difficulty: 'EXTREME',
    title: 'DP on Trees Sum of Distances to All Nodes',
    fnName: 'sumOfDistancesInTree',
    description: 'Given an undirected tree of <code>n</code> nodes (0 to n-1) and <code>edges</code>, return an array <code>ans</code> of length <code>n</code> where <code>ans[i]</code> is the sum of distances between node <code>i</code> and all other nodes.',
    constraints: ['1 <= n <= 3 * 10^4', 'len(edges) == n - 1'],
    testCases: [
      { title: 'Sample 1', input: '6, [[0,1],[0,2],[2,3],[2,4],[2,5]]', output: '[8, 12, 6, 10, 10, 10]' },
      { title: 'Single', input: '1, []', output: '[0]' },
      { title: 'Two', input: '2, [[1,0]]', output: '[1, 1]' },
      { title: 'Line', input: '3, [[0,1],[1,2]]', output: '[3, 2, 3]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    List<Integer>[] g;
    int[] count, ans;
    int n;
    public int[] sumOfDistancesInTree(int n, int[][] edges) {
        this.n = n; g = new ArrayList[n]; count = new int[n]; ans = new int[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        dfs1(0, -1);
        dfs2(0, -1);
        return ans;
    }
    void dfs1(int u, int p) {
        count[u] = 1;
        for (int v : g[u]) if (v != p) {
            dfs1(v, u);
            count[u] += count[v];
            ans[u] += ans[v] + count[v];
        }
    }
    void dfs2(int u, int p) {
        for (int v : g[u]) if (v != p) {
            ans[v] = ans[u] - count[v] + (n - count[v]);
            dfs2(v, u);
        }
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def sumOfDistancesInTree(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    count = [1] * n
    ans = [0] * n
    def dfs1(u, p):
        for v in g[u]:
            if v != p:
                dfs1(v, u)
                count[u] += count[v]
                ans[u] += ans[v] + count[v]
    def dfs2(u, p):
        for v in g[u]:
            if v != p:
                ans[v] = ans[u] - count[v] + (n - count[v])
                dfs2(v, u)
    dfs1(0, -1)
    dfs2(0, -1)
    return ans`
  },
  {
    number: 41,
    difficulty: 'EXTREME',
    title: 'Digit DP Numbers At Most N Given Digit Set',
    fnName: 'countNumbersAtMostN',
    description: 'Given a sorted array of distinct digit strings <code>digits</code> (from <code>"1".."9"</code>) and an integer <code>n</code>, return how many positive integers <code><= n</code> can be formed using only digits from <code>digits</code> (repetition allowed).',
    constraints: ['1 <= len(digits) <= 9', '1 <= n <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '["1","3","5","7"], 100', output: '20' },
      { title: 'Sample 2', input: '["1","4","9"], 1000000000', output: '29523' },
      { title: 'Sample 3', input: '["7"], 8', output: '1' },
      { title: 'Smaller', input: '["5","6"], 4', output: '0' },
    ],
    javaSolution: `class Solution {
    public int countNumbersAtMostN(String[] digits, int n) {
        String s = String.valueOf(n);
        int k = s.length(), d = digits.length, ans = 0;
        for (int i = 1; i < k; i++) ans += (int) Math.pow(d, i);
        for (int i = 0; i < k; i++) {
            boolean same = false;
            for (String dig : digits) {
                if (dig.charAt(0) < s.charAt(i)) ans += (int) Math.pow(d, k - i - 1);
                else if (dig.charAt(0) == s.charAt(i)) same = true;
            }
            if (!same) return ans;
        }
        return ans + 1;
    }
}`,
    pythonSolution: `def countNumbersAtMostN(digits, n):
    s = str(n)
    k = len(s)
    d = len(digits)
    ans = sum(d ** i for i in range(1, k))
    for i, ch in enumerate(s):
        same = False
        for dig in digits:
            if dig < ch:
                ans += d ** (k - i - 1)
            elif dig == ch:
                same = True
        if not same:
            return ans
    return ans + 1`
  },
  {
    number: 42,
    difficulty: 'EXTREME',
    title: 'Min-Cost Max-Flow / Campus Bike Assignment',
    fnName: 'assignBikesMinManhattan',
    description: 'Given <code>n</code> workers and <code>m >= n</code> bikes with 2D coordinates, assign each worker a distinct bike to minimize the sum of Manhattan distances <code>|wx - bx| + |wy - by|</code>.',
    constraints: ['1 <= n <= m <= 10', '0 <= x, y < 1000'],
    testCases: [
      { title: 'Sample 1', input: '[[0,0],[2,1]], [[1,2],[3,3]]', output: '6' },
      { title: 'Sample 2', input: '[[0,0],[1,1],[2,0]], [[1,0],[2,2],[2,1]]', output: '4' },
      { title: 'Single', input: '[[0,0]], [[3,4]]', output: '7' },
      { title: 'Extra bikes', input: '[[0,0],[1,0]], [[10,0],[0,1],[1,1]]', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int assignBikesMinManhattan(int[][] workers, int[][] bikes) {
        int n = workers.length, m = bikes.length, M = 1 << m;
        int[] dp = new int[M];
        Arrays.fill(dp, Integer.MAX_VALUE / 2);
        dp[0] = 0;
        int ans = Integer.MAX_VALUE;
        for (int mask = 0; mask < M; mask++) {
            int w = Integer.bitCount(mask);
            if (w == n) { ans = Math.min(ans, dp[mask]); continue; }
            if (w > n) continue;
            for (int b = 0; b < m; b++) if ((mask & (1 << b)) == 0) {
                int d = Math.abs(workers[w][0] - bikes[b][0]) + Math.abs(workers[w][1] - bikes[b][1]);
                dp[mask | (1 << b)] = Math.min(dp[mask | (1 << b)], dp[mask] + d);
            }
        }
        return ans;
    }
}`,
    pythonSolution: `def assignBikesMinManhattan(workers, bikes):
    n, m = len(workers), len(bikes)
    M = 1 << m
    INF = 10**9
    dp = [INF] * M
    dp[0] = 0
    ans = INF
    for mask in range(M):
        w = mask.bit_count()
        if w == n:
            if dp[mask] < ans:
                ans = dp[mask]
            continue
        if w > n or dp[mask] == INF:
            continue
        wx, wy = workers[w]
        for b in range(m):
            if not (mask & (1 << b)):
                nm = mask | (1 << b)
                d = abs(wx - bikes[b][0]) + abs(wy - bikes[b][1])
                if dp[mask] + d < dp[nm]:
                    dp[nm] = dp[mask] + d
    return ans`
  },
  {
    number: 43,
    difficulty: 'EXTREME',
    title: 'Shortest Palindrome Via KMP Prefix Mirror',
    fnName: 'shortestPalindromePrepend',
    description: 'Given string <code>s</code>, return the shortest palindrome you can find by adding characters only in front of <code>s</code>.',
    constraints: ['0 <= len(s) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '"aacecaaa"', output: 'aaacecaaa' },
      { title: 'Sample 2', input: '"abcd"', output: 'dcbabcd' },
      { title: 'Already palindrome', input: '"racecar"', output: 'racecar' },
      { title: 'Two chars', input: '"ba"', output: 'aba' },
    ],
    javaSolution: `class Solution {
    public String shortestPalindromePrepend(String s) {
        String rev = new StringBuilder(s).reverse().toString();
        String comb = s + "#" + rev;
        int[] lps = new int[comb.length()];
        for (int i = 1, len = 0; i < comb.length(); ) {
            if (comb.charAt(i) == comb.charAt(len)) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
        return rev.substring(0, s.length() - lps[comb.length() - 1]) + s;
    }
}`,
    pythonSolution: `def shortestPalindromePrepend(s):
    if not s:
        return ""
    rev = s[::-1]
    comb = s + "#" + rev
    lps = [0] * len(comb)
    length = 0
    i = 1
    while i < len(comb):
        if comb[i] == comb[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length > 0:
            length = lps[length - 1]
        else:
            i += 1
    return rev[:len(s) - lps[-1]] + s`
  },
  {
    number: 44,
    difficulty: 'EXTREME',
    title: 'Tarjan Articulation Points in Cloud Mesh',
    fnName: 'countArticulationNodes',
    description: 'Given <code>n</code> servers and undirected fiber edges <code>edges</code>, return the number of articulation points (critical servers whose removal increases the number of connected components).',
    constraints: ['1 <= n <= 10^4', '0 <= len(edges) <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '5, [[0,1],[1,2],[2,0],[1,3],[3,4]]', output: '2' },
      { title: 'Cycle', input: '4, [[0,1],[1,2],[2,3],[3,0]]', output: '0' },
      { title: 'Star', input: '4, [[0,1],[0,2],[0,3]]', output: '1' },
      { title: 'Line', input: '4, [[0,1],[1,2],[2,3]]', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int timer = 0;
    public int countArticulationNodes(int n, int[][] edges) {
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        int[] tin = new int[n], low = new int[n];
        Arrays.fill(tin, -1);
        boolean[] isCut = new boolean[n];
        for (int i = 0; i < n; i++) if (tin[i] == -1) dfs(i, -1, g, tin, low, isCut);
        int cnt = 0;
        for (boolean b : isCut) if (b) cnt++;
        return cnt;
    }
    void dfs(int u, int p, List<Integer>[] g, int[] tin, int[] low, boolean[] isCut) {
        tin[u] = low[u] = timer++;
        int children = 0;
        for (int v : g[u]) {
            if (v == p) continue;
            if (tin[v] != -1) low[u] = Math.min(low[u], tin[v]);
            else {
                dfs(v, u, g, tin, low, isCut);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] >= tin[u] && p != -1) isCut[u] = true;
                children++;
            }
        }
        if (p == -1 && children > 1) isCut[u] = true;
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def countArticulationNodes(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    tin = [-1] * n
    low = [0] * n
    is_cut = [False] * n
    timer = [0]
    def dfs(u, p):
        tin[u] = low[u] = timer[0]
        timer[0] += 1
        children = 0
        for v in g[u]:
            if v == p:
                continue
            if tin[v] != -1:
                low[u] = min(low[u], tin[v])
            else:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] >= tin[u] and p != -1:
                    is_cut[u] = True
                children += 1
        if p == -1 and children > 1:
            is_cut[u] = True
    for i in range(n):
        if tin[i] == -1:
            dfs(i, -1)
    return sum(is_cut)`
  },
  {
    number: 45,
    difficulty: 'EXTREME',
    title: 'Longest Duplicate Substring Rolling Hash',
    fnName: 'longestDupSubstr',
    description: 'Given a string <code>s</code>, consider all duplicated substrings (occurring 2 or more times, possibly overlapping). Return any duplicated substring with the longest possible length, or <code>""</code> if none exists.',
    constraints: ['2 <= len(s) <= 3 * 10^4', 's consists of lowercase English letters'],
    testCases: [
      { title: 'Sample 1', input: '"banana"', output: 'ana' },
      { title: 'Short repeat', input: '"abcab"', output: 'ab' },
      { title: 'All same', input: '"aaaaa"', output: 'aaaa' },
      { title: 'Two chars', input: '"ababa"', output: 'aba' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public String longestDupSubstr(String s) {
        int n = s.length(), lo = 1, hi = n - 1, bestStart = 0, bestLen = 0;
        long MOD = (1L << 61) - 1, BASE = 131L;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int idx = search(s, mid);
            if (idx != -1) { bestStart = idx; bestLen = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return s.substring(bestStart, bestStart + bestLen);
    }
    int search(String s, int L) {
        long mod = 1_000_000_007L, base = 31L, h = 0, pow = 1;
        for (int i = 0; i < L; i++) { h = (h * base + s.charAt(i)) % mod; if (i > 0) pow = (pow * base) % mod; }
        Map<Long, List<Integer>> seen = new HashMap<>();
        seen.computeIfAbsent(h, k -> new ArrayList<>()).add(0);
        for (int i = L; i < s.length(); i++) {
            h = (h - s.charAt(i - L) * pow % mod + mod) % mod;
            h = (h * base + s.charAt(i)) % mod;
            int start = i - L + 1;
            if (seen.containsKey(h)) {
                String cand = s.substring(start, start + L);
                for (int prev : seen.get(h)) if (s.substring(prev, prev + L).equals(cand)) return start;
            }
            seen.computeIfAbsent(h, k -> new ArrayList<>()).add(start);
        }
        return -1;
    }
}`,
    pythonSolution: `def longestDupSubstr(s):
    n = len(s)
    nums = [ord(c) - 97 for c in s]
    MOD = (1 << 61) - 1
    BASE = 26
    def check(L):
        h = 0
        for i in range(L):
            h = (h * BASE + nums[i]) % MOD
        seen = {h: 0}
        powL = pow(BASE, L, MOD)
        for start in range(1, n - L + 1):
            h = (h * BASE - nums[start - 1] * powL + nums[start + L - 1]) % MOD
            if h in seen:
                prev = seen[h]
                if s[prev:prev + L] == s[start:start + L]:
                    return start
            else:
                seen[h] = start
        return -1
    lo, hi = 1, n - 1
    best_s = best_len = 0
    while lo <= hi:
        mid = (lo + hi) // 2
        idx = check(mid)
        if idx != -1:
            best_s, best_len = idx, mid
            lo = mid + 1
        else:
            hi = mid - 1
    return s[best_s:best_s + best_len]`
  },
  {
    number: 46,
    difficulty: 'HARD',
    title: 'Minimum Cost to Make At Least One Valid Path',
    fnName: 'minArrowChangesGrid',
    description: 'Given an <code>m x n</code> grid of directions (<code>1</code>: right, <code>2</code>: left, <code>3</code>: down, <code>4</code>: up), return the minimum number of cells whose direction you must modify so a valid path exists from <code>(0,0)</code> to <code>(m-1,n-1)</code>.',
    constraints: ['1 <= m, n <= 100'],
    testCases: [
      { title: 'Sample 1', input: '[[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]', output: '3' },
      { title: 'Zero cost', input: '[[1,1,3],[3,2,2],[1,1,4]]', output: '0' },
      { title: 'Sample 3', input: '[[1,2],[4,3]]', output: '1' },
      { title: '1x1', input: '[[1]]', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minArrowChangesGrid(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[][] dist = new int[m][n];
        for (int[] r : dist) Arrays.fill(r, Integer.MAX_VALUE);
        Deque<int[]> dq = new ArrayDeque<>();
        dist[0][0] = 0; dq.offerFirst(new int[]{0, 0});
        int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
        while (!dq.isEmpty()) {
            int[] c = dq.pollFirst();
            int r = c[0], col = c[1];
            if (r == m - 1 && col == n - 1) return dist[r][col];
            for (int d = 0; d < 4; d++) {
                int nr = r + dirs[d][0], nc = col + dirs[d][1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    int cost = (grid[r][col] == d + 1) ? 0 : 1;
                    if (dist[r][col] + cost < dist[nr][nc]) {
                        dist[nr][nc] = dist[r][col] + cost;
                        if (cost == 0) dq.offerFirst(new int[]{nr, nc});
                        else dq.offerLast(new int[]{nr, nc});
                    }
                }
            }
        }
        return dist[m - 1][n - 1];
    }
}`,
    pythonSolution: `from collections import deque

def minArrowChangesGrid(grid):
    m, n = len(grid), len(grid[0])
    INF = 10**9
    dist = [[INF] * n for _ in range(m)]
    dist[0][0] = 0
    dq = deque([(0, 0)])
    dirs = ((0, 1), (0, -1), (1, 0), (-1, 0))
    while dq:
        r, c = dq.popleft()
        if r == m - 1 and c == n - 1:
            return dist[r][c]
        for d, (dr, dc) in enumerate(dirs, start=1):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                cost = 0 if grid[r][c] == d else 1
                if dist[r][c] + cost < dist[nr][nc]:
                    dist[nr][nc] = dist[r][c] + cost
                    if cost == 0:
                        dq.appendleft((nr, nc))
                    else:
                        dq.append((nr, nc))
    return dist[m - 1][n - 1]`
  },
  {
    number: 47,
    difficulty: 'HARD',
    title: 'Google Calendar My Calendar III K-Booking',
    fnName: 'myCalendarThreeBookings',
    description: 'Given a sequence of event intervals <code>[start, end)</code> added one by one, return an array where the <code>i</code>-th value is the maximum number of overlapping events (k-booking) after adding the <code>i</code>-th event.',
    constraints: ['1 <= len(events) <= 400', '0 <= start < end <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[[10,20],[50,60],[10,40],[5,15],[5,10],[25,55]]', output: '[1, 1, 2, 3, 3, 3]' },
      { title: 'Disjoint', input: '[[1,2],[2,3],[3,4]]', output: '[1, 1, 1]' },
      { title: 'All same', input: '[[0,5],[0,5],[0,5]]', output: '[1, 2, 3]' },
      { title: 'Single', input: '[[10,20]]', output: '[1]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Integer> myCalendarThreeBookings(int[][] events) {
        TreeMap<Integer, Integer> diff = new TreeMap<>();
        List<Integer> res = new ArrayList<>();
        for (int[] ev : events) {
            diff.put(ev[0], diff.getOrDefault(ev[0], 0) + 1);
            diff.put(ev[1], diff.getOrDefault(ev[1], 0) - 1);
            int cur = 0, best = 0;
            for (int v : diff.values()) { cur += v; best = Math.max(best, cur); }
            res.add(best);
        }
        return res;
    }
}`,
    pythonSolution: `from collections import defaultdict

def myCalendarThreeBookings(events):
    diff = defaultdict(int)
    res = []
    for s, e in events:
        diff[s] += 1
        diff[e] -= 1
        cur = best = 0
        for k in sorted(diff):
            cur += diff[k]
            if cur > best:
                best = cur
        res.append(best)
    return res`
  },
  {
    number: 48,
    difficulty: 'HARD',
    title: 'Maximum Number of Robots Within Budget',
    fnName: 'maxRobotsWithinBudget',
    description: 'Given <code>chargeTimes</code>, <code>runningCosts</code>, and <code>budget</code>, running <code>k</code> consecutive robots from <code>[l..r]</code> costs <code>max(chargeTimes[l..r]) + k * sum(runningCosts[l..r])</code>. Return the maximum number of consecutive robots that can run within <code>budget</code>.',
    constraints: ['1 <= len(chargeTimes) <= 5 * 10^4', '1 <= budget <= 10^15'],
    testCases: [
      { title: 'Sample 1', input: '[3,6,1,3,4], [2,1,3,4,5], 25', output: '3' },
      { title: 'Impossible', input: '[11,12,19], [10,8,7], 19', output: '0' },
      { title: 'Single', input: '[5,10], [2,2], 8', output: '1' },
      { title: 'All fit', input: '[1,2,3], [1,1,1], 20', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxRobotsWithinBudget(int[] chargeTimes, int[] runningCosts, long budget) {
        Deque<Integer> dq = new ArrayDeque<>();
        int l = 0, ans = 0;
        long sum = 0;
        for (int r = 0; r < chargeTimes.length; r++) {
            sum += runningCosts[r];
            while (!dq.isEmpty() && chargeTimes[dq.peekLast()] <= chargeTimes[r]) dq.pollLast();
            dq.addLast(r);
            while (!dq.isEmpty() && chargeTimes[dq.peekFirst()] + (long)(r - l + 1) * sum > budget) {
                sum -= runningCosts[l++];
                if (dq.peekFirst() < l) dq.pollFirst();
            }
            ans = Math.max(ans, r - l + 1);
        }
        return ans;
    }
}`,
    pythonSolution: `from collections import deque

def maxRobotsWithinBudget(chargeTimes, runningCosts, budget):
    dq = deque()
    l = ans = run_sum = 0
    for r, (ct, rc) in enumerate(zip(chargeTimes, runningCosts)):
        run_sum += rc
        while dq and chargeTimes[dq[-1]] <= ct:
            dq.pop()
        dq.append(r)
        while dq and chargeTimes[dq[0]] + (r - l + 1) * run_sum > budget:
            run_sum -= runningCosts[l]
            l += 1
            if dq[0] < l:
                dq.popleft()
        ans = max(ans, r - l + 1)
    return ans`
  },
  {
    number: 49,
    difficulty: 'HARD',
    title: 'Find Building Where Two Engineers Can Meet',
    fnName: 'leftmostMeetingBuilding',
    description: 'Given building heights <code>heights</code> and queries <code>[a, b]</code>, two engineers at <code>a</code> and <code>b</code> can move right to any building <code>j > max(a, b)</code> with <code>heights[j] > max(heights[a], heights[b])</code> (or stay if <code>a == b</code> or the rightmost one is strictly taller). Return the leftmost meeting index for each query, or <code>-1</code>.',
    constraints: ['1 <= len(heights) <= 5 * 10^4', '1 <= len(queries) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[6,4,8,5,2,7], [[0,1],[0,3],[2,4],[3,4],[2,2]]', output: '[2, 5, -1, 5, 2]' },
      { title: 'Sample 2', input: '[5,3,8,2,6,1,4,6], [[0,7],[3,5],[5,2],[3,0],[1,6]]', output: '[7, 6, -1, 4, 6]' },
      { title: 'Single', input: '[10], [[0,0]]', output: '[0]' },
      { title: 'None', input: '[5,4,3], [[0,1]]', output: '[-1]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int[] leftmostMeetingBuilding(int[] heights, int[][] queries) {
        int n = heights.length, qn = queries.length;
        int[] ans = new int[qn];
        Arrays.fill(ans, -1);
        List<int[]>[] byRight = new ArrayList[n];
        for (int i = 0; i < n; i++) byRight[i] = new ArrayList<>();
        for (int i = 0; i < qn; i++) {
            int a = Math.min(queries[i][0], queries[i][1]), b = Math.max(queries[i][0], queries[i][1]);
            if (a == b || heights[b] > heights[a]) ans[i] = b;
            else byRight[b].add(new int[]{heights[a], i});
        }
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(x -> x[0]));
        for (int i = 0; i < n; i++) {
            while (!pq.isEmpty() && pq.peek()[0] < heights[i]) ans[pq.poll()[1]] = i;
            for (int[] q : byRight[i]) pq.offer(q);
        }
        return ans;
    }
}`,
    pythonSolution: `import heapq

def leftmostMeetingBuilding(heights, queries):
    n = len(heights)
    ans = [-1] * len(queries)
    by_right = [[] for _ in range(n)]
    for qi, (u, v) in enumerate(queries):
        a, b = min(u, v), max(u, v)
        if a == b or heights[b] > heights[a]:
            ans[qi] = b
        else:
            by_right[b].append((heights[a], qi))
    pq = []
    for i, h in enumerate(heights):
        while pq and pq[0][0] < h:
            _, qi = heapq.heappop(pq)
            ans[qi] = i
        for item in by_right[i]:
            heapq.heappush(pq, item)
    return ans`
  },
  {
    number: 50,
    difficulty: 'EXTREME',
    title: 'Count Subsequences With Equal GCD',
    fnName: 'countEqualGcdPairs',
    description: 'Given an integer array <code>nums</code>, count the number of pairs of non-empty disjoint subsequences <code>(seq1, seq2)</code> such that <code>gcd(seq1) == gcd(seq2)</code>, modulo <code>10^9 + 7</code>.',
    constraints: ['1 <= len(nums) <= 200', '1 <= nums[i] <= 200'],
    testCases: [
      { title: 'Sample 1', input: '[1, 2, 3, 4]', output: '10' },
      { title: 'Sample 2', input: '[10, 20, 30]', output: '2' },
      { title: 'Single', input: '[1]', output: '0' },
      { title: 'All equal', input: '[2, 2]', output: '2' },
    ],
    javaSolution: `class Solution {
    static final int MOD = 1_000_000_007;
    int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    public int countEqualGcdPairs(int[] nums) {
        int maxV = 0;
        for (int x : nums) maxV = Math.max(maxV, x);
        int[][] dp = new int[maxV + 1][maxV + 1];
        dp[0][0] = 1;
        for (int x : nums) {
            int[][] ndp = new int[maxV + 1][maxV + 1];
            for (int g1 = 0; g1 <= maxV; g1++) {
                for (int g2 = 0; g2 <= maxV; g2++) {
                    int v = dp[g1][g2];
                    if (v == 0) continue;
                    ndp[g1][g2] = (ndp[g1][g2] + v) % MOD;
                    int ng1 = g1 == 0 ? x : gcd(g1, x);
                    ndp[ng1][g2] = (ndp[ng1][g2] + v) % MOD;
                    int ng2 = g2 == 0 ? x : gcd(g2, x);
                    ndp[g1][ng2] = (ndp[g1][ng2] + v) % MOD;
                }
            }
            dp = ndp;
        }
        long ans = 0;
        for (int g = 1; g <= maxV; g++) ans = (ans + dp[g][g]) % MOD;
        return (int) ans;
    }
}`,
    pythonSolution: `import math

def countEqualGcdPairs(nums):
    MOD = 10**9 + 7
    M = max(nums)
    g_tbl = [[0] * (M + 1) for _ in range(M + 1)]
    for i in range(M + 1):
        for j in range(M + 1):
            g_tbl[i][j] = math.gcd(i, j)
    dp = [[0] * (M + 1) for _ in range(M + 1)]
    dp[0][0] = 1
    for x in nums:
        ndp = [row[:] for row in dp]
        for g1 in range(M + 1):
            row = dp[g1]
            ng1 = g_tbl[g1][x]
            nrow1 = ndp[ng1]
            for g2 in range(M + 1):
                v = row[g2]
                if v:
                    nrow1[g2] = (nrow1[g2] + v) % MOD
                    ng2 = g_tbl[g2][x]
                    ndp[g1][ng2] = (ndp[g1][ng2] + v) % MOD
        dp = ndp
    return sum(dp[g][g] for g in range(1, M + 1)) % MOD`
  }
];
