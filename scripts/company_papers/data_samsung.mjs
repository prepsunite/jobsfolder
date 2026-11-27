export const SAMSUNG_QUESTIONS = [
  {
    number: 1,
    title: 'Robot Vacuum Cleanable Cells',
    fnName: 'countReachableCleanCells',
    description: 'In a Samsung robot-vacuum simulation on an <code>R x C</code> grid <code>room</code> (<code>0</code> = cleanable floor, <code>1</code> = obstacle), starting at <code>(sr, sc)</code> (always 0), return how many floor cells can be reached 4-directionally.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'room = [[0, 0, 1], [1, 0, 0], [0, 1, 0]], sr = 0, sc = 0', output: '5' },
      { title: 'Test Case 2', input: 'room = [[0, 1], [1, 0]], sr = 0, sc = 0', output: '1' },
      { title: 'Test Case 3', input: 'room = [[0, 0], [0, 0]], sr = 1, sc = 1', output: '4' },
      { title: 'Test Case 4', input: 'room = [[0]], sr = 0, sc = 0', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countReachableCleanCells(int[][] room, int sr, int sc) {
        int R = room.length, C = room[0].length, cnt = 0;
        boolean[][] vis = new boolean[R][C];
        Queue<int[]> q = new ArrayDeque<>();
        vis[sr][sc] = true; q.add(new int[]{sr, sc});
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll(); cnt++;
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && !vis[nr][nc] && room[nr][nc] == 0) {
                    vis[nr][nc] = true; q.add(new int[]{nr, nc});
                }
            }
        }
        return cnt;
    }
}`,
    pythonSolution: `from collections import deque
def countReachableCleanCells(room, sr, sc):
    R, C = len(room), len(room[0])
    vis = {(sr, sc)}; q = deque([(sr, sc)])
    while q:
        r, c = q.popleft()
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in vis and room[nr][nc] == 0:
                vis.add((nr, nc)); q.append((nr, nc))
    return len(vis)`
  },
  {
    number: 2,
    title: 'Wafer Die Defect Contiguous Regions',
    fnName: 'countDefectClusters',
    description: 'Given a silicon wafer bitmap <code>wafer</code> (<code>1</code> = defective die, <code>0</code> = good die), count how many 4-connected defective clusters exist.',
    constraints: ['1 <= wafer.length, wafer[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'wafer = [[1, 1, 0], [0, 1, 0], [1, 0, 1]]', output: '3' },
      { title: 'Test Case 2', input: 'wafer = [[0, 0], [0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'wafer = [[1, 1], [1, 1]]', output: '1' },
      { title: 'Test Case 4', input: 'wafer = [[1]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDefectClusters(int[][] wafer) {
        int R = wafer.length, C = wafer[0].length, cnt = 0;
        boolean[][] vis = new boolean[R][C];
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (wafer[r][c] == 1 && !vis[r][c]) {
            cnt++; vis[r][c] = true;
            Queue<int[]> q = new ArrayDeque<>(); q.add(new int[]{r, c});
            while (!q.isEmpty()) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int nr = cur[0] + d[0], nc = cur[1] + d[1];
                    if (nr >= 0 && nr < R && nc >= 0 && nc < C && !vis[nr][nc] && wafer[nr][nc] == 1) {
                        vis[nr][nc] = true; q.add(new int[]{nr, nc});
                    }
                }
            }
        }
        return cnt;
    }
}`,
    pythonSolution: `from collections import deque
def countDefectClusters(wafer):
    R, C = len(wafer), len(wafer[0])
    vis = set(); cnt = 0
    for r in range(R):
        for c in range(C):
            if wafer[r][c] == 1 and (r, c) not in vis:
                cnt += 1; vis.add((r, c)); q = deque([(r, c)])
                while q:
                    cr, cc = q.popleft()
                    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                        nr, nc = cr+dr, cc+dc
                        if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in vis and wafer[nr][nc] == 1:
                            vis.add((nr, nc)); q.append((nr, nc))
    return cnt`
  },
  {
    number: 3,
    title: '2048-Style Tile Slide Left',
    fnName: 'slideRowLeftSum',
    description: 'In a single row <code>row</code> (non-negative ints, 0 = empty), slide all non-zero numbers left, merging at most once per adjacent equal pair from left to right (like 2048). Return the number of merges performed.',
    constraints: ['1 <= row.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'row = [2, 0, 2, 4, 4]', output: '2' },
      { title: 'Test Case 2', input: 'row = [2, 2, 2, 2]', output: '2' },
      { title: 'Test Case 3', input: 'row = [2, 4, 8]', output: '0' },
      { title: 'Test Case 4', input: 'row = [0, 0, 0]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int slideRowLeftSum(int[] row) {
        List<Integer> vals = new ArrayList<>();
        for (int x : row) if (x != 0) vals.add(x);
        int merges = 0, i = 0;
        while (i + 1 < vals.size()) {
            if (vals.get(i).equals(vals.get(i + 1))) { merges++; i += 2; }
            else i++;
        }
        return merges;
    }
}`,
    pythonSolution: `def slideRowLeftSum(row):
    vals = [x for x in row if x != 0]
    merges = i = 0
    while i + 1 < len(vals):
        if vals[i] == vals[i + 1]: merges += 1; i += 2
        else: i += 1
    return merges`
  },
  {
    number: 4,
    title: 'Bitmask Sensor Subset Cover',
    fnName: 'countFullCoverageSubsets',
    description: 'Given <code>m</code> sensors (<code>m <= 15</code>), each covering a bitmask of <code>n</code> zones <code>masks[i]</code> (<code>n <= 12</code>), count how many non-empty subsets of sensors cover all <code>n</code> zones.',
    constraints: ['1 <= m <= 15', '1 <= n <= 12'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 2, masks = [1, 2, 3]', output: '5' },
      { title: 'Test Case 2', input: 'n = 3, masks = [1, 2]', output: '0' },
      { title: 'Test Case 3', input: 'n = 1, masks = [1]', output: '1' },
      { title: 'Test Case 4', input: 'n = 2, masks = [3, 3]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countFullCoverageSubsets(int n, int[] masks) {
        int full = (1 << n) - 1, m = masks.length, cnt = 0;
        for (int sub = 1; sub < (1 << m); sub++) {
            int cov = 0;
            for (int i = 0; i < m; i++) if ((sub & (1 << i)) != 0) cov |= masks[i];
            if (cov == full) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countFullCoverageSubsets(n, masks):
    full = (1 << n) - 1; m = len(masks); cnt = 0
    for sub in range(1, 1 << m):
        cov = 0
        for i in range(m):
            if sub & (1 << i): cov |= masks[i]
        if cov == full: cnt += 1
    return cnt`
  },
  {
    number: 5,
    title: 'BFS Multi-Source Fire Spread',
    fnName: 'minutesToBurnGrid',
    description: 'In an <code>R x C</code> fab grid <code>grid</code> (<code>2</code> = fire source, <code>1</code> = flammable, <code>0</code> = fireproof wall), fire spreads 4-directionally each minute to adjacent <code>1</code> cells. Return minutes until all reachable <code>1</code>s burn, or <code>-1</code> if any <code>1</code> remains unreachable.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[2, 1, 1], [1, 1, 0], [0, 1, 1]]', output: '4' },
      { title: 'Test Case 2', input: 'grid = [[2, 0, 1]]', output: '-1' },
      { title: 'Test Case 3', input: 'grid = [[2, 0, 2]]', output: '0' },
      { title: 'Test Case 4', input: 'grid = [[0, 0]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minutesToBurnGrid(int[][] grid) {
        int R = grid.length, C = grid[0].length, fresh = 0;
        Queue<int[]> q = new ArrayDeque<>();
        int[][] g = new int[R][C];
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
            g[r][c] = grid[r][c];
            if (g[r][c] == 2) q.add(new int[]{r, c, 0});
            else if (g[r][c] == 1) fresh++;
        }
        int ans = 0; int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            ans = Math.max(ans, cur[2]);
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] == 1) {
                    g[nr][nc] = 2; fresh--; q.add(new int[]{nr, nc, cur[2] + 1});
                }
            }
        }
        return fresh == 0 ? ans : -1;
    }
}`,
    pythonSolution: `from collections import deque
def minutesToBurnGrid(grid):
    R, C = len(grid), len(grid[0])
    g = [row[:] for row in grid]
    q = deque(); fresh = 0
    for r in range(R):
        for c in range(C):
            if g[r][c] == 2: q.append((r, c, 0))
            elif g[r][c] == 1: fresh += 1
    ans = 0
    while q:
        r, c, t = q.popleft()
        ans = max(ans, t)
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and g[nr][nc] == 1:
                g[nr][nc] = 2; fresh -= 1; q.append((nr, nc, t + 1))
    return ans if fresh == 0 else -1`
  },
  {
    number: 6,
    title: 'Backtracking N-Chip Placement',
    fnName: 'countNonAttackingChips',
    description: 'Place <code>n</code> chips on an <code>n x n</code> board so no two chips share the same row, column, or diagonal (N-Queens). Return the number of valid placements for <code>n <= 10</code>.',
    constraints: ['1 <= n <= 10'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4', output: '2' },
      { title: 'Test Case 2', input: 'n = 1', output: '1' },
      { title: 'Test Case 3', input: 'n = 2', output: '0' },
      { title: 'Test Case 4', input: 'n = 5', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static int countNonAttackingChips(int n) {
        return dfs(0, n, 0, 0, 0);
    }
    private static int dfs(int r, int n, int cols, int d1, int d2) {
        if (r == n) return 1;
        int cnt = 0;
        for (int c = 0; c < n; c++) {
            int b = 1 << c, a1 = 1 << (r + c), a2 = 1 << (r - c + n);
            if ((cols & b) == 0 && (d1 & a1) == 0 && (d2 & a2) == 0) {
                cnt += dfs(r + 1, n, cols | b, d1 | a1, d2 | a2);
            }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countNonAttackingChips(n):
    def dfs(r, cols, d1, d2):
        if r == n: return 1
        cnt = 0
        for c in range(n):
            b, a1, a2 = 1 << c, 1 << (r + c), 1 << (r - c + n)
            if not (cols & b or d1 & a1 or d2 & a2):
                cnt += dfs(r + 1, cols | b, d1 | a1, d2 | a2)
        return cnt
    return dfs(0, 0, 0, 0)`
  },
  {
    number: 7,
    title: 'TSP Bitmask Shortest Circuit',
    fnName: 'minDroneTourCost',
    description: 'A drone starts at node <code>0</code>, visits all <code>n</code> nodes (<code>n <= 10</code>) using distance matrix <code>dist</code>, and returns to <code>0</code>. Return the minimum total tour cost.',
    constraints: ['1 <= n <= 10'],
    testCases: [
      { title: 'Test Case 1', input: 'dist = [[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]]', output: '80' },
      { title: 'Test Case 2', input: 'dist = [[0, 5], [5, 0]]', output: '10' },
      { title: 'Test Case 3', input: 'dist = [[0]]', output: '0' },
      { title: 'Test Case 4', input: 'dist = [[0, 1, 2], [1, 0, 3], [2, 3, 0]]', output: '6' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minDroneTourCost(int[][] dist) {
        int n = dist.length;
        if (n == 1) return 0;
        int full = (1 << n) - 1;
        int[][] dp = new int[1 << n][n];
        for (int[] row : dp) Arrays.fill(row, 1000000000);
        dp[1][0] = 0;
        for (int m = 1; m <= full; m++) {
            for (int u = 0; u < n; u++) {
                if (dp[m][u] >= 1000000000) continue;
                for (int v = 0; v < n; v++) {
                    if ((m & (1 << v)) == 0) {
                        dp[m | (1 << v)][v] = Math.min(dp[m | (1 << v)][v], dp[m][u] + dist[u][v]);
                    }
                }
            }
        }
        int best = 1000000000;
        for (int u = 1; u < n; u++) best = Math.min(best, dp[full][u] + dist[u][0]);
        return best;
    }
}`,
    pythonSolution: `def minDroneTourCost(dist):
    n = len(dist)
    if n == 1: return 0
    INF = 10**9; full = (1 << n) - 1
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for m in range(1, full + 1):
        for u in range(n):
            if dp[m][u] >= INF: continue
            for v in range(n):
                if not (m & (1 << v)):
                    nm = m | (1 << v)
                    if dp[m][u] + dist[u][v] < dp[nm][v]: dp[nm][v] = dp[m][u] + dist[u][v]
    return min(dp[full][u] + dist[u][0] for u in range(1, n))`
  },
  {
    number: 8,
    title: 'Gear Wheel Rotation Propagation',
    fnName: 'countTurnedGears',
    description: '<code>n</code> gears in a row have tooth-teeth ratios? Wait: in a row of <code>n</code> gears (0..n-1), adjacent gears <code>i</code> and <code>i+1</code> mesh unless <code>broken[i] == 1</code> (gap between <code>i</code> and <code>i+1</code>). If gear <code>start</code> is turned, return how many gears spin.',
    constraints: ['1 <= broken.length == n - 1 <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'broken = [0, 1, 0, 0], start = 2', output: '3' },
      { title: 'Test Case 2', input: 'broken = [1, 1], start = 1', output: '1' },
      { title: 'Test Case 3', input: 'broken = [0, 0, 0], start = 0', output: '4' },
      { title: 'Test Case 4', input: 'broken = [], start = 0', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countTurnedGears(int[] broken, int start) {
        int cnt = 1;
        int i = start - 1;
        while (i >= 0 && broken[i] == 0) { cnt++; i--; }
        i = start;
        while (i < broken.length && broken[i] == 0) { cnt++; i++; }
        return cnt;
    }
}`,
    pythonSolution: `def countTurnedGears(broken, start):
    cnt = 1
    i = start - 1
    while i >= 0 and broken[i] == 0: cnt += 1; i -= 1
    i = start
    while i < len(broken) and broken[i] == 0: cnt += 1; i += 1
    return cnt`
  },
  {
    number: 9,
    title: 'Matrix Gravity Drop Simulation',
    fnName: 'countBottomRowBlocks',
    description: 'In a <code>R x C</code> grid <code>board</code> (<code>1</code> = block, <code>0</code> = empty), gravity pulls every block straight down to the bottom of its column. Return how many blocks end up in the bottom row <code>R - 1</code>.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'board = [[1, 0, 1], [0, 0, 1], [0, 0, 0]]', output: '2' },
      { title: 'Test Case 2', input: 'board = [[0, 0], [0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'board = [[1, 1], [1, 1]]', output: '2' },
      { title: 'Test Case 4', input: 'board = [[1], [0], [1]]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countBottomRowBlocks(int[][] board) {
        int R = board.length, C = board[0].length, cnt = 0;
        for (int c = 0; c < C; c++) {
            for (int r = 0; r < R; r++) if (board[r][c] == 1) { cnt++; break; }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countBottomRowBlocks(board):
    R, C = len(board), len(board[0])
    return sum(1 for c in range(C) if any(board[r][c] == 1 for r in range(R)))`
  },
  {
    number: 10,
    title: 'CCTV Camera Blind Spot Count',
    fnName: 'countBlindCells',
    description: 'In a <code>R x C</code> hallway <code>grid</code> (<code>0</code> = empty, <code>1</code> = wall, <code>2</code> = 4-way camera), cameras see straight up/down/left/right until hitting a wall. Count empty cells (<code>0</code>) NOT seen by any camera.',
    constraints: ['1 <= R, C <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[2, 0, 1], [0, 0, 0], [0, 1, 0]]', output: '3' },
      { title: 'Test Case 2', input: 'grid = [[2, 0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[0, 0], [0, 0]]', output: '4' },
      { title: 'Test Case 4', input: 'grid = [[2]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countBlindCells(int[][] grid) {
        int R = grid.length, C = grid[0].length;
        boolean[][] seen = new boolean[R][C];
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (grid[r][c] == 2) {
            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                while (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1) {
                    seen[nr][nc] = true; nr += d[0]; nc += d[1];
                }
            }
        }
        int blind = 0;
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (grid[r][c] == 0 && !seen[r][c]) blind++;
        return blind;
    }
}`,
    pythonSolution: `def countBlindCells(grid):
    R, C = len(grid), len(grid[0])
    seen = [[False] * C for _ in range(R)]
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 2:
                for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                    nr, nc = r+dr, c+dc
                    while 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != 1:
                        seen[nr][nc] = True; nr += dr; nc += dc
    return sum(1 for r in range(R) for c in range(C) if grid[r][c] == 0 and not seen[r][c])`
  },
  {
    number: 11,
    title: 'Dice Roll Grid Final Position',
    fnName: 'finalGridDistanceFromOrigin',
    description: 'Starting at <code>(0, 0)</code> on an infinite grid, execute commands in string <code>cmds</code> (<code>\'U\', \'D\', \'L\', \'R\'</code>). Return Manhattan distance <code>|x| + |y|</code> from origin.',
    constraints: ['1 <= cmds.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cmds = "UURDDL"', output: '0' },
      { title: 'Test Case 2', input: 'cmds = "RRRUU"', output: '5' },
      { title: 'Test Case 3', input: 'cmds = "LLLL"', output: '4' },
      { title: 'Test Case 4', input: 'cmds = "UD"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int finalGridDistanceFromOrigin(String cmds) {
        int x = 0, y = 0;
        for (int i = 0; i < cmds.length(); i++) {
            char c = cmds.charAt(i);
            if (c == 'U') y++; else if (c == 'D') y--; else if (c == 'R') x++; else if (c == 'L') x--;
        }
        return Math.abs(x) + Math.abs(y);
    }
}`,
    pythonSolution: `def finalGridDistanceFromOrigin(cmds):
    return abs(cmds.count('R') - cmds.count('L')) + abs(cmds.count('U') - cmds.count('D'))`
  },
  {
    number: 12,
    title: 'OLED Display Dead-Pixel Box',
    fnName: 'deadPixelBoundingArea',
    description: 'Given a binary OLED panel <code>panel</code> (<code>1</code> = dead pixel, <code>0</code> = ok), return the area of the smallest axis-aligned rectangle enclosing all dead pixels (<code>0</code> if none).',
    constraints: ['1 <= panel.length, panel[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'panel = [[0, 1, 0], [0, 0, 1], [0, 0, 0]]', output: '4' },
      { title: 'Test Case 2', input: 'panel = [[0, 0], [0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'panel = [[1]]', output: '1' },
      { title: 'Test Case 4', input: 'panel = [[1, 0, 0, 1]]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int deadPixelBoundingArea(int[][] panel) {
        int R = panel.length, C = panel[0].length;
        int minR = R, maxR = -1, minC = C, maxC = -1;
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (panel[r][c] == 1) {
            minR = Math.min(minR, r); maxR = Math.max(maxR, r);
            minC = Math.min(minC, c); maxC = Math.max(maxC, c);
        }
        return maxR == -1 ? 0 : (maxR - minR + 1) * (maxC - minC + 1);
    }
}`,
    pythonSolution: `def deadPixelBoundingArea(panel):
    pts = [(r, c) for r in range(len(panel)) for c in range(len(panel[0])) if panel[r][c] == 1]
    if not pts: return 0
    rs, cs = zip(*pts)
    return (max(rs) - min(rs) + 1) * (max(cs) - min(cs) + 1)`
  },
  {
    number: 13,
    title: 'Snake Game Body Collision',
    fnName: 'stepsBeforeCollision',
    description: 'On an <code>n x n</code> board, a snake starts at <code>(0, 0)</code> (length 1, no growth) and moves according to <code>cmds</code> (<code>U, D, L, R</code>). Return how many valid moves it makes before hitting a wall (leaving <code>0..n-1</code>).',
    constraints: ['1 <= n <= 10^4', '1 <= cmds.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, cmds = "RRDLUU"', output: '5' },
      { title: 'Test Case 2', input: 'n = 2, cmds = "U"', output: '0' },
      { title: 'Test Case 3', input: 'n = 4, cmds = "RD"', output: '2' },
      { title: 'Test Case 4', input: 'n = 1, cmds = "R"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int stepsBeforeCollision(int n, String cmds) {
        int r = 0, c = 0, steps = 0;
        for (int i = 0; i < cmds.length(); i++) {
            char ch = cmds.charAt(i);
            if (ch == 'U') r--; else if (ch == 'D') r++; else if (ch == 'L') c--; else if (ch == 'R') c++;
            if (r < 0 || r >= n || c < 0 || c >= n) return steps;
            steps++;
        }
        return steps;
    }
}`,
    pythonSolution: `def stepsBeforeCollision(n, cmds):
    r = c = steps = 0
    for ch in cmds:
        if ch == 'U': r -= 1
        elif ch == 'D': r += 1
        elif ch == 'L': c -= 1
        elif ch == 'R': c += 1
        if not (0 <= r < n and 0 <= c < n): return steps
        steps += 1
    return steps`
  },
  {
    number: 14,
    title: 'Chess Knight Minimum Hops',
    fnName: 'minKnightMoves',
    description: 'On an <code>n x n</code> board, return the minimum knight moves from <code>(0, 0)</code> to <code>(tr, tc)</code>, or <code>-1</code> if impossible.',
    constraints: ['1 <= n <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, tr = 4, tc = 4', output: '4' },
      { title: 'Test Case 2', input: 'n = 3, tr = 1, tc = 1', output: '-1' },
      { title: 'Test Case 3', input: 'n = 4, tr = 0, tc = 0', output: '0' },
      { title: 'Test Case 4', input: 'n = 4, tr = 2, tc = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minKnightMoves(int n, int tr, int tc) {
        if (tr == 0 && tc == 0) return 0;
        boolean[][] vis = new boolean[n][n];
        Queue<int[]> q = new ArrayDeque<>();
        vis[0][0] = true; q.add(new int[]{0, 0, 0});
        int[][] dirs = {{2,1},{2,-1},{-2,1},{-2,-1},{1,2},{1,-2},{-1,2},{-1,-2}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && !vis[nr][nc]) {
                    if (nr == tr && nc == tc) return cur[2] + 1;
                    vis[nr][nc] = true; q.add(new int[]{nr, nc, cur[2] + 1});
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque
def minKnightMoves(n, tr, tc):
    if tr == 0 and tc == 0: return 0
    vis = {(0, 0)}; q = deque([(0, 0, 0)])
    while q:
        r, c, d = q.popleft()
        for dr, dc in ((2,1),(2,-1),(-2,1),(-2,-1),(1,2),(1,-2),(-1,2),(-1,-2)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in vis:
                if nr == tr and nc == tc: return d + 1
                vis.add((nr, nc)); q.append((nr, nc, d + 1))
    return -1`
  },
  {
    number: 15,
    title: 'Subgrid 2x2 Max Thermal Sum',
    fnName: 'max2x2BlockSum',
    description: 'Given a <code>R x C</code> chip thermal map <code>heat</code> (<code>R, C >= 2</code>), return the maximum sum of any <code>2 x 2</code> subgrid.',
    constraints: ['2 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'heat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '28' },
      { title: 'Test Case 2', input: 'heat = [[1, 1], [1, 1]]', output: '4' },
      { title: 'Test Case 3', input: 'heat = [[-1, -2], [-3, -4]]', output: '-10' },
      { title: 'Test Case 4', input: 'heat = [[5, 0, 5], [0, 5, 0]]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static int max2x2BlockSum(int[][] heat) {
        int best = Integer.MIN_VALUE;
        for (int r = 0; r + 1 < heat.length; r++) {
            for (int c = 0; c + 1 < heat[0].length; c++) {
                best = Math.max(best, heat[r][c] + heat[r][c+1] + heat[r+1][c] + heat[r+1][c+1]);
            }
        }
        return best;
    }
}`,
    pythonSolution: `def max2x2BlockSum(heat):
    return max(heat[r][c] + heat[r][c+1] + heat[r+1][c] + heat[r+1][c+1] for r in range(len(heat)-1) for c in range(len(heat[0])-1))`
  },
  {
    number: 16,
    title: 'Bitwise Register Parity Toggle',
    fnName: 'minBitFlipsToEqual',
    description: 'Given two 32-bit hardware registers <code>a</code> and <code>b</code>, return the minimum number of bit flips required to transform <code>a</code> into <code>b</code>.',
    constraints: ['0 <= a, b <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'a = 10, b = 7', output: '3' },
      { title: 'Test Case 2', input: 'a = 15, b = 15', output: '0' },
      { title: 'Test Case 3', input: 'a = 0, b = 8', output: '1' },
      { title: 'Test Case 4', input: 'a = 3, b = 4', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int minBitFlipsToEqual(int a, int b) {
        return Integer.bitCount(a ^ b);
    }
}`,
    pythonSolution: `def minBitFlipsToEqual(a, b):
    return (a ^ b).bit_count()`
  },
  {
    number: 17,
    title: 'Backtracking Target Subset Count',
    fnName: 'countSubsetsEqualTarget',
    description: 'Given positive integers <code>nums</code> (<code>n <= 20</code>) and <code>target</code>, count how many subsets sum to exact <code>target</code>.',
    constraints: ['1 <= nums.length <= 20'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 4], target = 5', output: '2' },
      { title: 'Test Case 2', input: 'nums = [2, 4, 6], target = 5', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 1, 1], target = 2', output: '3' },
      { title: 'Test Case 4', input: 'nums = [5], target = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countSubsetsEqualTarget(int[] nums, int target) {
        return dfs(nums, 0, target);
    }
    private static int dfs(int[] a, int i, int rem) {
        if (rem == 0) return 1;
        if (rem < 0 || i == a.length) return 0;
        return dfs(a, i + 1, rem) + dfs(a, i + 1, rem - a[i]);
    }
}`,
    pythonSolution: `def countSubsetsEqualTarget(nums, target):
    def dfs(i, rem):
        if rem == 0: return 1
        if rem < 0 or i == len(nums): return 0
        return dfs(i + 1, rem) + dfs(i + 1, rem - nums[i])
    return dfs(0, target)`
  },
  {
    number: 18,
    title: 'Galaxy Watch Step Goal Streak',
    fnName: 'countGoalDays',
    description: 'Given daily step counts <code>steps</code> and daily goal <code>goal</code>, return how many days met or exceeded <code>goal</code>.',
    constraints: ['1 <= steps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'steps = [8000, 12000, 10000, 5000], goal = 10000', output: '2' },
      { title: 'Test Case 2', input: 'steps = [100, 200], goal = 500', output: '0' },
      { title: 'Test Case 3', input: 'steps = [10000], goal = 10000', output: '1' },
      { title: 'Test Case 4', input: 'steps = [0, 0], goal = 0', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countGoalDays(int[] steps, int goal) {
        int cnt = 0;
        for (int s : steps) if (s >= goal) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countGoalDays(steps, goal):
    return sum(1 for s in steps if s >= goal)`
  },
  {
    number: 19,
    title: 'Memory Bank Bitmask Free Slots',
    fnName: 'countContiguousFreeBits',
    description: 'Given a 32-bit integer <code>mask</code> where bit <code>i</code> = 0 means slot <code>i</code> is free (for bits <code>0..n-1</code>), return the longest consecutive run of 0-bits in positions <code>0..n-1</code>.',
    constraints: ['1 <= n <= 30'],
    testCases: [
      { title: 'Test Case 1', input: 'mask = 17, n = 5', output: '3' },
      { title: 'Test Case 2', input: 'mask = 15, n = 4', output: '0' },
      { title: 'Test Case 3', input: 'mask = 0, n = 6', output: '6' },
      { title: 'Test Case 4', input: 'mask = 2, n = 4', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countContiguousFreeBits(int mask, int n) {
        int cur = 0, best = 0;
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) == 0) { cur++; best = Math.max(best, cur); }
            else cur = 0;
        }
        return best;
    }
}`,
    pythonSolution: `def countContiguousFreeBits(mask, n):
    cur = best = 0
    for i in range(n):
        if (mask & (1 << i)) == 0: cur += 1; best = max(best, cur)
        else: cur = 0
    return best`
  },
  {
    number: 20,
    title: 'Grid Laser Beam Reflections',
    fnName: 'countEmptyCellsInPath',
    description: 'A laser enters row <code>0</code> col <code>0</code> moving right in an <code>R x C</code> grid of mirrors (<code>0</code> = empty, <code>1</code> = <code>/</code> mirror, <code>2</code> = <code>\\</code> mirror). Return total cells visited before exiting the grid (at most <code>R * C * 4</code> steps; guaranteed to exit).',
    constraints: ['1 <= R, C <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 2, 0], [0, 1, 0], [0, 0, 0]]', output: '4' },
      { title: 'Test Case 2', input: 'grid = [[0, 0, 0]]', output: '3' },
      { title: 'Test Case 3', input: 'grid = [[1]]', output: '1' },
      { title: 'Test Case 4', input: 'grid = [[2, 0], [0, 0]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countEmptyCellsInPath(int[][] grid) {
        int R = grid.length, C = grid[0].length;
        int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};
        int r = 0, c = 0, d = 0, steps = 0;
        while (r >= 0 && r < R && c >= 0 && c < C) {
            steps++;
            if (grid[r][c] == 1) d ^= 3;
            else if (grid[r][c] == 2) d ^= 1;
            r += dirs[d][0]; c += dirs[d][1];
        }
        return steps;
    }
}`,
    pythonSolution: `def countEmptyCellsInPath(grid):
    R, C = len(grid), len(grid[0])
    dirs = ((0,1),(1,0),(0,-1),(-1,0))
    r = c = d = steps = 0
    while 0 <= r < R and 0 <= c < C:
        steps += 1
        if grid[r][c] == 1: d ^= 3
        elif grid[r][c] == 2: d ^= 1
        r += dirs[d][0]; c += dirs[d][1]
    return steps`
  },
  {
    number: 21,
    title: '5G Base Station Minimum Power',
    fnName: 'minTowerRadius',
    description: 'Houses sit at sorted positions <code>houses</code> and towers at sorted positions <code>towers</code>. Return the minimum uniform radius <code>R</code> so every house is within distance <code>R</code> of at least one tower.',
    constraints: ['1 <= houses.length, towers.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'houses = [1, 2, 3, 4], towers = [1, 4]', output: '1' },
      { title: 'Test Case 2', input: 'houses = [1, 5], towers = [2]', output: '3' },
      { title: 'Test Case 3', input: 'houses = [10], towers = [10]', output: '0' },
      { title: 'Test Case 4', input: 'houses = [1, 2, 3], towers = [2]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minTowerRadius(int[] houses, int[] towers) {
        int j = 0, best = 0;
        for (int h : houses) {
            while (j + 1 < towers.length && Math.abs(towers[j + 1] - h) <= Math.abs(towers[j] - h)) j++;
            best = Math.max(best, Math.abs(towers[j] - h));
        }
        return best;
    }
}`,
    pythonSolution: `def minTowerRadius(houses, towers):
    j = best = 0
    for h in houses:
        while j + 1 < len(towers) and abs(towers[j + 1] - h) <= abs(towers[j] - h): j += 1
        best = max(best, abs(towers[j] - h))
    return best`
  },
  {
    number: 22,
    title: 'DRAM Refresh Cycle Collision',
    fnName: 'countRefreshCollisions',
    description: 'Two memory controllers refresh every <code>a</code> and <code>b</code> cycles respectively. In cycles <code>1..N</code>, how many cycles do BOTH controllers refresh simultaneously?',
    constraints: ['1 <= a, b <= 10^6', '1 <= N <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'a = 4, b = 6, N = 24', output: '2' },
      { title: 'Test Case 2', input: 'a = 3, b = 5, N = 14', output: '0' },
      { title: 'Test Case 3', input: 'a = 2, b = 2, N = 10', output: '5' },
      { title: 'Test Case 4', input: 'a = 7, b = 11, N = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countRefreshCollisions(long a, long b, long N) {
        long g = gcd(a, b);
        long lcm = (a / g) * b;
        return N / lcm;
    }
    private static long gcd(long a, long b) { return b == 0 ? a : gcd(b, a % b); }
}`,
    pythonSolution: `import math
def countRefreshCollisions(a, b, N):
    return N // math.lcm(a, b)`
  },
  {
    number: 23,
    title: 'Exynos Core Frequency Scaling',
    fnName: 'totalPowerWatts',
    description: 'Given CPU core loads <code>loads</code>, a core consumes <code>lowW</code> if <code>loads[i] <= thresh</code> else <code>highW</code>. Return total power across all cores.',
    constraints: ['1 <= loads.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'loads = [20, 80, 50, 90], thresh = 50, lowW = 2, highW = 5', output: '14' },
      { title: 'Test Case 2', input: 'loads = [10, 10], thresh = 20, lowW = 1, highW = 3', output: '2' },
      { title: 'Test Case 3', input: 'loads = [100], thresh = 50, lowW = 1, highW = 10', output: '10' },
      { title: 'Test Case 4', input: 'loads = [0], thresh = 0, lowW = 1, highW = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long totalPowerWatts(int[] loads, int thresh, int lowW, int highW) {
        long s = 0;
        for (int l : loads) s += (l <= thresh) ? lowW : highW;
        return s;
    }
}`,
    pythonSolution: `def totalPowerWatts(loads, thresh, lowW, highW):
    return sum(lowW if l <= thresh else highW for l in loads)`
  },
  {
    number: 24,
    title: 'SmartThings Automation Trigger Graph',
    fnName: 'countTriggeredDevices',
    description: 'Given <code>n</code> IoT devices (0..n-1) and directed automation rules <code>rules</code> <code>[trigger, target]</code>, if device <code>0</code> fires, return total devices triggered (including <code>0</code>).',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, rules = [[0, 1], [1, 2], [3, 4]]', output: '3' },
      { title: 'Test Case 2', input: 'n = 3, rules = [[1, 2]]', output: '1' },
      { title: 'Test Case 3', input: 'n = 3, rules = [[0, 1], [0, 2]]', output: '3' },
      { title: 'Test Case 4', input: 'n = 1, rules = []', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countTriggeredDevices(int n, int[][] rules) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] r : rules) g.get(r[0]).add(r[1]);
        boolean[] vis = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();
        vis[0] = true; q.add(0); int cnt = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); cnt++;
            for (int v : g.get(u)) if (!vis[v]) { vis[v] = true; q.add(v); }
        }
        return cnt;
    }
}`,
    pythonSolution: `from collections import deque
def countTriggeredDevices(n, rules):
    g = [[] for _ in range(n)]
    for u, v in rules: g[u].append(v)
    vis = {0}; q = deque([0])
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis: vis.add(v); q.append(v)
    return len(vis)`
  },
  {
    number: 25,
    title: 'Matrix Perimeter of Active Cells',
    fnName: 'activeIslandPerimeter',
    description: 'Given a binary grid <code>grid</code> where <code>1</code> is an active chip cell and <code>0</code> is empty, return the total perimeter of all <code>1</code> cells (counting edges facing 0 or outside the grid).',
    constraints: ['1 <= grid.length, grid[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 1, 0], [1, 1, 1], [0, 1, 0]]', output: '12' },
      { title: 'Test Case 2', input: 'grid = [[1]]', output: '4' },
      { title: 'Test Case 3', input: 'grid = [[1, 1]]', output: '6' },
      { title: 'Test Case 4', input: 'grid = [[0, 0], [0, 0]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int activeIslandPerimeter(int[][] grid) {
        int R = grid.length, C = grid[0].length, per = 0;
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (grid[r][c] == 1) {
            per += 4;
            if (r > 0 && grid[r - 1][c] == 1) per -= 2;
            if (c > 0 && grid[r][c - 1] == 1) per -= 2;
        }
        return per;
    }
}`,
    pythonSolution: `def activeIslandPerimeter(grid):
    R, C = len(grid), len(grid[0]); per = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 1:
                per += 4
                if r > 0 and grid[r-1][c] == 1: per -= 2
                if c > 0 and grid[r][c-1] == 1: per -= 2
    return per`
  },
  {
    number: 26,
    title: 'Bitwise Hamming Distance Sum',
    fnName: 'consecutiveHammingSum',
    description: 'Given integers <code>nums</code>, return the sum of Hamming distances (differing bits) between consecutive elements <code>nums[i]</code> and <code>nums[i+1]</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 3, 7]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [5, 5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [0, 15]', output: '4' },
      { title: 'Test Case 4', input: 'nums = [9]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long consecutiveHammingSum(int[] nums) {
        long s = 0;
        for (int i = 1; i < nums.length; i++) s += Integer.bitCount(nums[i] ^ nums[i - 1]);
        return s;
    }
}`,
    pythonSolution: `def consecutiveHammingSum(nums):
    return sum((nums[i] ^ nums[i - 1]).bit_count() for i in range(1, len(nums)))`
  },
  {
    number: 27,
    title: 'Battery Charging Curve Time',
    fnName: 'minutesToFullCharge',
    description: 'A phone starts at <code>pct</code>% battery (0..100). Below 80%, it charges <code>fastRate</code>% per minute; at or above 80%, it charges <code>slowRate</code>% per minute (capped at 100%). Return minutes to reach 100%.',
    constraints: ['0 <= pct <= 100', '1 <= slowRate <= fastRate <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'pct = 60, fastRate = 10, slowRate = 5', output: '6' },
      { title: 'Test Case 2', input: 'pct = 100, fastRate = 10, slowRate = 5', output: '0' },
      { title: 'Test Case 3', input: 'pct = 80, fastRate = 10, slowRate = 4', output: '5' },
      { title: 'Test Case 4', input: 'pct = 75, fastRate = 10, slowRate = 5', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int minutesToFullCharge(int pct, int fastRate, int slowRate) {
        int mins = 0;
        while (pct < 100) {
            pct += (pct < 80) ? fastRate : slowRate;
            mins++;
        }
        return mins;
    }
}`,
    pythonSolution: `def minutesToFullCharge(pct, fastRate, slowRate):
    mins = 0
    while pct < 100:
        pct += fastRate if pct < 80 else slowRate
        mins += 1
    return mins`
  },
  {
    number: 28,
    title: 'Sudoku Row & Col Validity Check',
    fnName: 'countDuplicateRows',
    description: 'Given an <code>n x n</code> integer grid <code>grid</code>, return how many rows contain duplicate values.',
    constraints: ['1 <= n <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 2, 3], [1, 1, 2], [3, 2, 1]]', output: '1' },
      { title: 'Test Case 2', input: 'grid = [[1, 2], [3, 4]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[5, 5], [6, 6]]', output: '2' },
      { title: 'Test Case 4', input: 'grid = [[1]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDuplicateRows(int[][] grid) {
        int bad = 0;
        for (int[] row : grid) {
            Set<Integer> s = new HashSet<>();
            for (int x : row) if (!s.add(x)) { bad++; break; }
        }
        return bad;
    }
}`,
    pythonSolution: `def countDuplicateRows(grid):
    return sum(1 for row in grid if len(set(row)) < len(row))`
  },
  {
    number: 29,
    title: 'BFS Shortest Escape from Maze',
    fnName: 'minStepsToAnyBorder',
    description: 'In a binary <code>R x C</code> maze <code>maze</code> (<code>0</code> = open, <code>1</code> = wall), start at <code>(sr, sc)</code> (always 0). Return minimum 4-directional steps to reach any border cell (row 0, row R-1, col 0, or col C-1), or <code>-1</code> if impossible.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'maze = [[1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 1]], sr = 1, sc = 1', output: '2' },
      { title: 'Test Case 2', input: 'maze = [[1, 1, 1], [1, 0, 1], [1, 1, 1]], sr = 1, sc = 1', output: '-1' },
      { title: 'Test Case 3', input: 'maze = [[0, 1], [1, 1]], sr = 0, sc = 0', output: '0' },
      { title: 'Test Case 4', input: 'maze = [[1, 0, 1], [1, 0, 1], [1, 1, 1]], sr = 1, sc = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minStepsToAnyBorder(int[][] maze, int sr, int sc) {
        int R = maze.length, C = maze[0].length;
        if (sr == 0 || sr == R - 1 || sc == 0 || sc == C - 1) return 0;
        boolean[][] vis = new boolean[R][C];
        Queue<int[]> q = new ArrayDeque<>();
        vis[sr][sc] = true; q.add(new int[]{sr, sc, 0});
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && !vis[nr][nc] && maze[nr][nc] == 0) {
                    if (nr == 0 || nr == R - 1 || nc == 0 || nc == C - 1) return cur[2] + 1;
                    vis[nr][nc] = true; q.add(new int[]{nr, nc, cur[2] + 1});
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque
def minStepsToAnyBorder(maze, sr, sc):
    R, C = len(maze), len(maze[0])
    if sr in (0, R - 1) or sc in (0, C - 1): return 0
    vis = {(sr, sc)}; q = deque([(sr, sc, 0)])
    while q:
        r, c, d = q.popleft()
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in vis and maze[nr][nc] == 0:
                if nr in (0, R - 1) or nc in (0, C - 1): return d + 1
                vis.add((nr, nc)); q.append((nr, nc, d + 1))
    return -1`
  },
  {
    number: 30,
    title: 'Bitmask Subset XOR Zero Count',
    fnName: 'countZeroXorSubsets',
    description: 'Given integers <code>nums</code> (<code>n <= 15</code>), count how many non-empty subsets have bitwise XOR equal to <code>0</code>.',
    constraints: ['1 <= nums.length <= 15'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3]', output: '1' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 4]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [0, 0]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [5, 5]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countZeroXorSubsets(int[] nums) {
        int n = nums.length, cnt = 0;
        for (int sub = 1; sub < (1 << n); sub++) {
            int x = 0;
            for (int i = 0; i < n; i++) if ((sub & (1 << i)) != 0) x ^= nums[i];
            if (x == 0) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countZeroXorSubsets(nums):
    n = len(nums); cnt = 0
    for sub in range(1, 1 << n):
        x = 0
        for i in range(n):
            if sub & (1 << i): x ^= nums[i]
        if x == 0: cnt += 1
    return cnt`
  },
  {
    number: 31,
    title: 'Fab Conveyor Wafer Batching',
    fnName: 'minWaferBatches',
    description: 'Wafers arrive with processing times <code>times</code> (in order). Each oven batch holds at most <code>k</code> wafers and takes time equal to the maximum wafer time in that batch? No: simply group sequentially into batches of size at most <code>k</code> and return the sum of batch maxima.',
    constraints: ['1 <= k <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [10, 4, 7, 2, 9], k = 2', output: '26' },
      { title: 'Test Case 2', input: 'times = [5, 5, 5], k = 3', output: '5' },
      { title: 'Test Case 3', input: 'times = [1, 2, 3], k = 1', output: '6' },
      { title: 'Test Case 4', input: 'times = [8], k = 5', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static long minWaferBatches(int[] times, int k) {
        long tot = 0;
        for (int i = 0; i < times.length; i += k) {
            int mx = 0;
            for (int j = i; j < Math.min(times.length, i + k); j++) mx = Math.max(mx, times[j]);
            tot += mx;
        }
        return tot;
    }
}`,
    pythonSolution: `def minWaferBatches(times, k):
    return sum(max(times[i:i+k]) for i in range(0, len(times), k))`
  },
  {
    number: 32,
    title: 'DP Grid Minimum Energy Path',
    fnName: 'minEnergyGridPath',
    description: 'In an <code>R x C</code> energy-cost matrix <code>cost</code>, start at <code>(0, 0)</code> and move right or down to <code>(R-1, C-1)</code>. Return the minimum total energy cost.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'cost = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]', output: '7' },
      { title: 'Test Case 2', input: 'cost = [[5]]', output: '5' },
      { title: 'Test Case 3', input: 'cost = [[1, 2], [3, 4]]', output: '7' },
      { title: 'Test Case 4', input: 'cost = [[2, 2, 2], [1, 1, 1]]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static long minEnergyGridPath(int[][] cost) {
        int R = cost.length, C = cost[0].length;
        long[] dp = new long[C];
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
            if (r == 0 && c == 0) dp[0] = cost[0][0];
            else if (r == 0) dp[c] = dp[c - 1] + cost[r][c];
            else if (c == 0) dp[c] = dp[c] + cost[r][c];
            else dp[c] = Math.min(dp[c], dp[c - 1]) + cost[r][c];
        }
        return dp[C - 1];
    }
}`,
    pythonSolution: `def minEnergyGridPath(cost):
    R, C = len(cost), len(cost[0])
    dp = [0] * C
    for r in range(R):
        for c in range(C):
            if r == 0 and c == 0: dp[0] = cost[0][0]
            elif r == 0: dp[c] = dp[c - 1] + cost[r][c]
            elif c == 0: dp[c] = dp[c] + cost[r][c]
            else: dp[c] = min(dp[c], dp[c - 1]) + cost[r][c]
    return dp[-1]`
  },
  {
    number: 33,
    title: 'Antenna Signal Strength Peaks',
    fnName: 'countLocalSignalPeaks',
    description: 'Given signal readings <code>sig</code>, count how many interior indices <code>1 <= i <= n-2</code> are strictly greater than both neighbors.',
    constraints: ['1 <= sig.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sig = [1, 5, 2, 6, 3]', output: '2' },
      { title: 'Test Case 2', input: 'sig = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'sig = [10, 20]', output: '0' },
      { title: 'Test Case 4', input: 'sig = [2, 2, 2]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countLocalSignalPeaks(int[] sig) {
        int cnt = 0;
        for (int i = 1; i + 1 < sig.length; i++) if (sig[i] > sig[i - 1] && sig[i] > sig[i + 1]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countLocalSignalPeaks(sig):
    return sum(1 for i in range(1, len(sig) - 1) if sig[i] > sig[i - 1] and sig[i] > sig[i + 1])`
  },
  {
    number: 34,
    title: 'Bitwise Clock Divider Check',
    fnName: 'countPowersOfTwo',
    description: 'Given positive integers <code>freqs</code>, count how many are exact powers of 2.',
    constraints: ['1 <= freqs.length <= 10^5', '1 <= freqs[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'freqs = [1, 2, 3, 4, 6, 8]', output: '4' },
      { title: 'Test Case 2', input: 'freqs = [3, 5, 7]', output: '0' },
      { title: 'Test Case 3', input: 'freqs = [1024]', output: '1' },
      { title: 'Test Case 4', input: 'freqs = [16, 32, 64]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countPowersOfTwo(int[] freqs) {
        int cnt = 0;
        for (int f : freqs) if (f > 0 && (f & (f - 1)) == 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countPowersOfTwo(freqs):
    return sum(1 for f in freqs if f > 0 and (f & (f - 1)) == 0)`
  },
  {
    number: 35,
    title: 'Robot Arm Waypoint Reversals',
    fnName: 'countDirectionReversals',
    description: 'A 1D robot arm visits signed coordinates <code>pos</code> in order. Count how many times its direction reverses (i.e. <code>(pos[i]-pos[i-1])</code> and <code>(pos[i+1]-pos[i])</code> have opposite signs).',
    constraints: ['2 <= pos.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pos = [0, 5, 2, 8, 1]', output: '3' },
      { title: 'Test Case 2', input: 'pos = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'pos = [10, 5]', output: '0' },
      { title: 'Test Case 4', input: 'pos = [0, 10, 10, 5]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDirectionReversals(int[] pos) {
        int rev = 0;
        for (int i = 1; i + 1 < pos.length; i++) {
            long d1 = (long) pos[i] - pos[i - 1], d2 = (long) pos[i + 1] - pos[i];
            if ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) rev++;
        }
        return rev;
    }
}`,
    pythonSolution: `def countDirectionReversals(pos):
    rev = 0
    for i in range(1, len(pos) - 1):
        d1, d2 = pos[i] - pos[i-1], pos[i+1] - pos[i]
        if d1 * d2 < 0: rev += 1
    return rev`
  },
  {
    number: 36,
    title: 'Memory Page Alignment Padding',
    fnName: 'totalPaddingBytes',
    description: 'Each allocation in <code>sizes</code> must be rounded up to the next multiple of <code>align</code>. Return total wasted padding bytes across all allocations.',
    constraints: ['1 <= sizes.length <= 10^5', '1 <= align <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'sizes = [10, 16, 17], align = 8', output: '13' },
      { title: 'Test Case 2', input: 'sizes = [8, 16], align = 8', output: '0' },
      { title: 'Test Case 3', input: 'sizes = [1], align = 4', output: '3' },
      { title: 'Test Case 4', input: 'sizes = [5, 5], align = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalPaddingBytes(int[] sizes, int align) {
        long pad = 0;
        for (int s : sizes) {
            int rem = s % align;
            if (rem != 0) pad += align - rem;
        }
        return pad;
    }
}`,
    pythonSolution: `def totalPaddingBytes(sizes, align):
    return sum((align - (s % align)) % align for s in sizes)`
  },
  {
    number: 37,
    title: 'Cleanroom Airlock Pressure Steps',
    fnName: 'minPressureSteps',
    description: 'An airlock starts at pressure <code>start</code> and must reach <code>target</code>. Each step changes pressure by <code>+step</code> or <code>-step</code> (or a partial final step <code>&lt;= step</code>). Return minimum steps.',
    constraints: ['1 <= step <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'start = 10, target = 35, step = 10', output: '3' },
      { title: 'Test Case 2', input: 'start = 50, target = 50, step = 5', output: '0' },
      { title: 'Test Case 3', input: 'start = 100, target = 75, step = 10', output: '3' },
      { title: 'Test Case 4', input: 'start = 0, target = 1, step = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long minPressureSteps(long start, long target, long step) {
        long d = Math.abs(target - start);
        return (d + step - 1) / step;
    }
}`,
    pythonSolution: `def minPressureSteps(start, target, step):
    d = abs(target - start)
    return (d + step - 1) // step`
  },
  {
    number: 38,
    title: 'Grid Spiral Corner Sum',
    fnName: 'sumMatrixCorners',
    description: 'Given an <code>R x C</code> matrix <code>mat</code>, return the sum of its distinct corner elements.',
    constraints: ['1 <= R, C <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '20' },
      { title: 'Test Case 2', input: 'mat = [[5]]', output: '5' },
      { title: 'Test Case 3', input: 'mat = [[1, 2, 3]]', output: '4' },
      { title: 'Test Case 4', input: 'mat = [[1], [2], [3]]', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long sumMatrixCorners(int[][] mat) {
        int R = mat.length, C = mat[0].length;
        Set<Long> seen = new HashSet<>();
        int[][] pts = {{0,0},{0,C-1},{R-1,0},{R-1,C-1}};
        long s = 0;
        for (int[] p : pts) if (seen.add((long) p[0] * C + p[1])) s += mat[p[0]][p[1]];
        return s;
    }
}`,
    pythonSolution: `def sumMatrixCorners(mat):
    R, C = len(mat), len(mat[0])
    pts = {(0,0), (0,C-1), (R-1,0), (R-1,C-1)}
    return sum(mat[r][c] for r, c in pts)`
  },
  {
    number: 39,
    title: 'Chip Pinout Mirror Symmetry',
    fnName: 'isPalindromePinout',
    description: 'Given an array of pin voltages <code>pins</code>, return <code>true</code> if it reads the same forwards and backwards, else <code>false</code>.',
    constraints: ['1 <= pins.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pins = [1, 2, 3, 2, 1]', output: 'true' },
      { title: 'Test Case 2', input: 'pins = [1, 2, 3]', output: 'false' },
      { title: 'Test Case 3', input: 'pins = [5]', output: 'true' },
      { title: 'Test Case 4', input: 'pins = [4, 4]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isPalindromePinout(int[] pins) {
        int l = 0, r = pins.length - 1;
        while (l < r) if (pins[l++] != pins[r--]) return false;
        return true;
    }
}`,
    pythonSolution: `def isPalindromePinout(pins):
    return pins == pins[::-1]`
  },
  {
    number: 40,
    title: 'Firmware CRC Bit Count Parity',
    fnName: 'countEvenBitIntegers',
    description: 'Given integers <code>words</code>, count how many have an EVEN number of 1-bits in binary.',
    constraints: ['1 <= words.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'words = [0, 3, 5, 7, 15]', output: '4' },
      { title: 'Test Case 2', input: 'words = [1, 2, 4]', output: '0' },
      { title: 'Test Case 3', input: 'words = [6]', output: '1' },
      { title: 'Test Case 4', input: 'words = [8]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countEvenBitIntegers(int[] words) {
        int cnt = 0;
        for (int w : words) if (Integer.bitCount(w) % 2 == 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countEvenBitIntegers(words):
    return sum(1 for w in words if w.bit_count() % 2 == 0)`
  },
  {
    number: 41,
    title: 'Backtracking Expression Target Sign',
    fnName: 'countTargetSignWays',
    description: 'Given non-negative integers <code>nums</code> (<code>n <= 15</code>), assign <code>+</code> or <code>-</code> before each number. Return how many assignments evaluate to <code>target</code>.',
    constraints: ['1 <= nums.length <= 15'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 1, 1, 1], target = 3', output: '5' },
      { title: 'Test Case 2', input: 'nums = [1], target = 1', output: '1' },
      { title: 'Test Case 3', input: 'nums = [2, 2], target = 1', output: '0' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3], target = 0', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countTargetSignWays(int[] nums, int target) {
        return dfs(nums, 0, 0, target);
    }
    private static int dfs(int[] a, int i, int sum, int target) {
        if (i == a.length) return sum == target ? 1 : 0;
        return dfs(a, i + 1, sum + a[i], target) + dfs(a, i + 1, sum - a[i], target);
    }
}`,
    pythonSolution: `def countTargetSignWays(nums, target):
    def dfs(i, s):
        if i == len(nums): return 1 if s == target else 0
        return dfs(i + 1, s + nums[i]) + dfs(i + 1, s - nums[i])
    return dfs(0, 0)`
  },
  {
    number: 42,
    title: 'Thermal Throttling Cooldown Windows',
    fnName: 'countOverheatEvents',
    description: 'Given CPU temperatures <code>temps</code>, an overheat event triggers if <code>temps[i] >= crit</code> for <code>k</code> consecutive readings. Return how many indices complete such a streak of length <code>&gt;= k</code>.',
    constraints: ['1 <= k <= temps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'temps = [70, 85, 90, 88, 60, 95, 92], crit = 85, k = 2', output: '3' },
      { title: 'Test Case 2', input: 'temps = [80, 80, 80], crit = 85, k = 1', output: '0' },
      { title: 'Test Case 3', input: 'temps = [90, 90, 90], crit = 90, k = 3', output: '1' },
      { title: 'Test Case 4', input: 'temps = [100], crit = 100, k = 1', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countOverheatEvents(int[] temps, int crit, int k) {
        int run = 0, cnt = 0;
        for (int t : temps) {
            run = (t >= crit) ? run + 1 : 0;
            if (run >= k) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countOverheatEvents(temps, crit, k):
    run = cnt = 0
    for t in temps:
        run = run + 1 if t >= crit else 0
        if run >= k: cnt += 1
    return cnt`
  },
  {
    number: 43,
    title: 'Bitmask Permission Subset Check',
    fnName: 'countSupersetMasks',
    description: 'Given module capability masks <code>caps</code> and required capability mask <code>req</code>, count how many modules satisfy <code>(caps[i] &amp; req) == req</code>.',
    constraints: ['1 <= caps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'caps = [7, 5, 3, 15], req = 5', output: '3' },
      { title: 'Test Case 2', input: 'caps = [1, 2], req = 4', output: '0' },
      { title: 'Test Case 3', input: 'caps = [0, 1], req = 0', output: '2' },
      { title: 'Test Case 4', input: 'caps = [15], req = 15', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countSupersetMasks(int[] caps, int req) {
        int cnt = 0;
        for (int c : caps) if ((c & req) == req) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countSupersetMasks(caps, req):
    return sum(1 for c in caps if (c & req) == req)`
  },
  {
    number: 44,
    title: 'Grid Domino Tileable Check',
    fnName: 'maxDominoesInGrid',
    description: 'Given an <code>R x C</code> board with no obstacles, return the maximum number of <code>1 x 2</code> dominoes that can be placed without overlap.',
    constraints: ['1 <= R, C <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'R = 2, C = 4', output: '4' },
      { title: 'Test Case 2', input: 'R = 3, C = 3', output: '4' },
      { title: 'Test Case 3', input: 'R = 1, C = 1', output: '0' },
      { title: 'Test Case 4', input: 'R = 5, C = 2', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static long maxDominoesInGrid(long R, long C) {
        return (R * C) / 2;
    }
}`,
    pythonSolution: `def maxDominoesInGrid(R, C):
    return (R * C) // 2`
  },
  {
    number: 45,
    title: 'Sensor Calibration Median Drift',
    fnName: 'sumAbsoluteDeviations',
    description: 'Given sensor readings <code>readings</code> and calibrated baseline <code>base</code>, return the sum of absolute errors <code>|readings[i] - base|</code>.',
    constraints: ['1 <= readings.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'readings = [10, 15, 7], base = 10', output: '8' },
      { title: 'Test Case 2', input: 'readings = [5, 5], base = 5', output: '0' },
      { title: 'Test Case 3', input: 'readings = [0], base = 100', output: '100' },
      { title: 'Test Case 4', input: 'readings = [1, 2, 3], base = 2', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long sumAbsoluteDeviations(int[] readings, int base) {
        long s = 0;
        for (int r : readings) s += Math.abs((long) r - base);
        return s;
    }
}`,
    pythonSolution: `def sumAbsoluteDeviations(readings, base):
    return sum(abs(r - base) for r in readings)`
  },
  {
    number: 46,
    title: 'Cellular Tower Handover Count',
    fnName: 'countTowerHandovers',
    description: 'A moving Galaxy phone connects to the tower ID in <code>connected[i]</code> at minute <code>i</code>. Count how many handovers occur (<code>connected[i] != connected[i-1]</code>).',
    constraints: ['1 <= connected.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'connected = [1, 1, 2, 2, 1, 3]', output: '3' },
      { title: 'Test Case 2', input: 'connected = [5, 5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'connected = [1, 2, 3, 4]', output: '3' },
      { title: 'Test Case 4', input: 'connected = [7]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countTowerHandovers(int[] connected) {
        int cnt = 0;
        for (int i = 1; i < connected.length; i++) if (connected[i] != connected[i - 1]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countTowerHandovers(connected):
    return sum(1 for i in range(1, len(connected)) if connected[i] != connected[i - 1])`
  },
  {
    number: 47,
    title: 'Matrix Row-Wise Max Sum',
    fnName: 'maxRowSum',
    description: 'Given an <code>R x C</code> integer matrix <code>mat</code>, return the maximum sum of any single row.',
    constraints: ['1 <= R, C <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [10, -2, 4], [5, 5, 5]]', output: '15' },
      { title: 'Test Case 2', input: 'mat = [[-5, -1], [-10, -10]]', output: '-6' },
      { title: 'Test Case 3', input: 'mat = [[42]]', output: '42' },
      { title: 'Test Case 4', input: 'mat = [[0, 0], [1, 1]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long maxRowSum(int[][] mat) {
        long best = Long.MIN_VALUE;
        for (int[] row : mat) {
            long s = 0; for (int x : row) s += x;
            best = Math.max(best, s);
        }
        return best;
    }
}`,
    pythonSolution: `def maxRowSum(mat):
    return max(sum(row) for row in mat)`
  },
  {
    number: 48,
    title: 'Bitwise Gray Code Distance',
    fnName: 'isGrayCodePair',
    description: 'Return <code>true</code> if two non-negative integers <code>a</code> and <code>b</code> differ in exactly 1 bit position, else <code>false</code>.',
    constraints: ['0 <= a, b <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'a = 4, b = 6', output: 'true' },
      { title: 'Test Case 2', input: 'a = 3, b = 3', output: 'false' },
      { title: 'Test Case 3', input: 'a = 0, b = 3', output: 'false' },
      { title: 'Test Case 4', input: 'a = 8, b = 0', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isGrayCodePair(int a, int b) {
        return Integer.bitCount(a ^ b) == 1;
    }
}`,
    pythonSolution: `def isGrayCodePair(a, b):
    return (a ^ b).bit_count() == 1`
  },
  {
    number: 49,
    title: 'OLED Burn-In Static Pixel Count',
    fnName: 'countStaticPixels',
    description: 'Compare two <code>R x C</code> consecutive frames <code>f1</code> and <code>f2</code>. Count how many pixel positions <code>(r, c)</code> stayed identical (<code>f1[r][c] == f2[r][c]</code>).',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'f1 = [[1, 2], [3, 4]], f2 = [[1, 9], [3, 0]]', output: '2' },
      { title: 'Test Case 2', input: 'f1 = [[5, 5]], f2 = [[5, 5]]', output: '2' },
      { title: 'Test Case 3', input: 'f1 = [[1]], f2 = [[2]]', output: '0' },
      { title: 'Test Case 4', input: 'f1 = [[0, 1], [1, 0]], f2 = [[1, 0], [0, 1]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countStaticPixels(int[][] f1, int[][] f2) {
        int cnt = 0;
        for (int r = 0; r < f1.length; r++)
            for (int c = 0; c < f1[0].length; c++)
                if (f1[r][c] == f2[r][c]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countStaticPixels(f1, f2):
    return sum(1 for r in range(len(f1)) for c in range(len(f1[0])) if f1[r][c] == f2[r][c])`
  },
  {
    number: 50,
    title: 'Connected Component Max Grid Area',
    fnName: 'maxConnectedChipArea',
    description: 'Given a binary chip layout grid <code>grid</code> (<code>1</code> = active silicon, <code>0</code> = gap), return the maximum area (number of cells) of any 4-connected region of <code>1</code>s.',
    constraints: ['1 <= grid.length, grid[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 1, 0], [0, 1, 0], [1, 0, 1]]', output: '3' },
      { title: 'Test Case 2', input: 'grid = [[0, 0], [0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[1, 1], [1, 1]]', output: '4' },
      { title: 'Test Case 4', input: 'grid = [[1]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxConnectedChipArea(int[][] grid) {
        int R = grid.length, C = grid[0].length, best = 0;
        boolean[][] vis = new boolean[R][C];
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (grid[r][c] == 1 && !vis[r][c]) {
            int area = 0; vis[r][c] = true;
            Queue<int[]> q = new ArrayDeque<>(); q.add(new int[]{r, c});
            while (!q.isEmpty()) {
                int[] cur = q.poll(); area++;
                for (int[] d : dirs) {
                    int nr = cur[0] + d[0], nc = cur[1] + d[1];
                    if (nr >= 0 && nr < R && nc >= 0 && nc < C && !vis[nr][nc] && grid[nr][nc] == 1) {
                        vis[nr][nc] = true; q.add(new int[]{nr, nc});
                    }
                }
            }
            best = Math.max(best, area);
        }
        return best;
    }
}`,
    pythonSolution: `from collections import deque
def maxConnectedChipArea(grid):
    R, C = len(grid), len(grid[0])
    vis = set(); best = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 1 and (r, c) not in vis:
                area = 0; vis.add((r, c)); q = deque([(r, c)])
                while q:
                    cr, cc = q.popleft(); area += 1
                    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                        nr, nc = cr+dr, cc+dc
                        if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in vis and grid[nr][nc] == 1:
                            vis.add((nr, nc)); q.append((nr, nc))
                best = max(best, area)
    return best`
  }
];
