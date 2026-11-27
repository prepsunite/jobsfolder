export const MICROSOFT_QUESTIONS = [
  {
    number: 1,
    title: 'Azure Region Failover Latency',
    fnName: 'minFailoverLatency',
    description: 'Microsoft Azure routes requests from a primary region to backup regions. Given an array <code>latencies</code> where <code>latencies[i]</code> is the round-trip latency to region <code>i</code> and <code>healthy[i]</code> is <code>1</code> if healthy else <code>0</code>, return the minimum latency among all healthy regions, or <code>-1</code> if none are healthy.',
    constraints: ['1 <= latencies.length == healthy.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'latencies = [45, 18, 30, 12], healthy = [1, 1, 0, 0]', output: '18' },
      { title: 'Test Case 2', input: 'latencies = [10, 20, 30], healthy = [0, 0, 0]', output: '-1' },
      { title: 'Test Case 3', input: 'latencies = [5], healthy = [1]', output: '5' },
      { title: 'Test Case 4', input: 'latencies = [100, 99, 101], healthy = [1, 1, 1]', output: '99' }
    ],
    javaSolution: `public class Solution {
    public static int minFailoverLatency(int[] latencies, int[] healthy) {
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < latencies.length; i++) {
            if (healthy[i] == 1 && latencies[i] < best) best = latencies[i];
        }
        return best == Integer.MAX_VALUE ? -1 : best;
    }
}`,
    pythonSolution: `def minFailoverLatency(latencies, healthy):
    vals = [l for l, h in zip(latencies, healthy) if h == 1]
    return min(vals) if vals else -1`
  },
  {
    number: 2,
    title: 'Teams Thread Mention Counter',
    fnName: 'countDirectMentions',
    description: 'In a Microsoft Teams channel log <code>messages</code>, a direct mention of user <code>target</code> occurs when <code>"@" + target</code> appears as a whitespace-delimited token. Count how many messages contain at least one direct mention of <code>target</code>.',
    constraints: ['1 <= messages.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'messages = ["hi @alex please check", "hello @alexa", "@alex @sam"], target = "alex"', output: '2' },
      { title: 'Test Case 2', input: 'messages = ["no tags here"], target = "alex"', output: '0' },
      { title: 'Test Case 3', input: 'messages = ["@dev"], target = "dev"', output: '1' },
      { title: 'Test Case 4', input: 'messages = ["ping @dev1 and @dev2"], target = "dev"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDirectMentions(String[] messages, String target) {
        String tag = "@" + target;
        int cnt = 0;
        for (String m : messages) {
            for (String tok : m.split("\\\\s+")) {
                if (tok.equals(tag)) { cnt++; break; }
            }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countDirectMentions(messages, target):
    tag = "@" + target
    return sum(1 for m in messages if tag in m.split())`
  },
  {
    number: 3,
    title: 'Windows Update Patch Dependency Count',
    fnName: 'countReachablePatches',
    description: 'Given <code>n</code> Windows patches (0..n-1) and directed prerequisites <code>deps</code> where <code>[a, b]</code> means installing <code>a</code> requires first installing <code>b</code>, return how many total patches (excluding <code>target</code>) must be installed before <code>target</code>.',
    constraints: ['1 <= n <= 500', '0 <= target < n'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, deps = [[0, 1], [1, 2], [2, 3]], target = 0', output: '3' },
      { title: 'Test Case 2', input: 'n = 4, deps = [[0, 1], [0, 2], [1, 3], [2, 3]], target = 0', output: '3' },
      { title: 'Test Case 3', input: 'n = 3, deps = [[1, 2]], target = 0', output: '0' },
      { title: 'Test Case 4', input: 'n = 2, deps = [[0, 1]], target = 1', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countReachablePatches(int n, int[][] deps, int target) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] d : deps) g.get(d[0]).add(d[1]);
        boolean[] vis = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();
        vis[target] = true; q.add(target);
        int cnt = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g.get(u)) if (!vis[v]) { vis[v] = true; cnt++; q.add(v); }
        }
        return cnt;
    }
}`,
    pythonSolution: `from collections import deque
def countReachablePatches(n, deps, target):
    g = [[] for _ in range(n)]
    for a, b in deps: g[a].append(b)
    vis = {target}
    q = deque([target])
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis:
                vis.add(v); q.append(v)
    return len(vis) - 1`
  },
  {
    number: 4,
    title: 'OneDrive Sync Delta Window',
    fnName: 'maxSyncedBytesInWindow',
    description: 'OneDrive logs uploaded file sizes <code>sizes</code> (MB) at timestamps <code>times</code> (sorted non-decreasing). Find the maximum total MB uploaded within any half-open time window <code>[t, t + window)</code>.',
    constraints: ['1 <= sizes.length == times.length <= 10^5', '1 <= window <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [1, 3, 4, 8, 9], sizes = [10, 20, 15, 30, 25], window = 4', output: '55' },
      { title: 'Test Case 2', input: 'times = [1, 2, 3], sizes = [5, 5, 5], window = 10', output: '15' },
      { title: 'Test Case 3', input: 'times = [0, 5, 10], sizes = [7, 12, 3], window = 5', output: '12' },
      { title: 'Test Case 4', input: 'times = [2], sizes = [42], window = 1', output: '42' }
    ],
    javaSolution: `public class Solution {
    public static long maxSyncedBytesInWindow(int[] times, int[] sizes, int window) {
        long cur = 0, best = 0;
        int l = 0;
        for (int r = 0; r < times.length; r++) {
            cur += sizes[r];
            while (times[r] - times[l] >= window) cur -= sizes[l++];
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def maxSyncedBytesInWindow(times, sizes, window):
    cur = best = l = 0
    for r in range(len(times)):
        cur += sizes[r]
        while times[r] - times[l] >= window:
            cur -= sizes[l]; l += 1
        best = max(best, cur)
    return best`
  },
  {
    number: 5,
    title: 'Office Ribbon Undo-Redo Depth',
    fnName: 'finalDocumentLength',
    description: 'An editor starts empty and executes commands in <code>ops</code>: <code>"ADD x"</code> appends string <code>x</code>, <code>"DEL k"</code> deletes the last <code>k</code> characters (clamped to current length), and <code>"UNDO"</code> reverts the most recent <code>ADD</code> or <code>DEL</code>. Return the final character count.',
    constraints: ['1 <= ops.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'ops = ["ADD hello", "ADD world", "DEL 3", "UNDO"]', output: '10' },
      { title: 'Test Case 2', input: 'ops = ["ADD abc", "UNDO", "UNDO"]', output: '0' },
      { title: 'Test Case 3', input: 'ops = ["DEL 5", "ADD hi"]', output: '2' },
      { title: 'Test Case 4', input: 'ops = ["ADD microsoft", "DEL 4", "ADD soft"]', output: '9' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int finalDocumentLength(String[] ops) {
        StringBuilder sb = new StringBuilder();
        Deque<String> hist = new ArrayDeque<>();
        for (String op : ops) {
            if (op.equals("UNDO")) {
                if (!hist.isEmpty()) sb = new StringBuilder(hist.pop());
            } else if (op.startsWith("ADD ")) {
                hist.push(sb.toString());
                sb.append(op.substring(4));
            } else if (op.startsWith("DEL ")) {
                hist.push(sb.toString());
                int k = Integer.parseInt(op.substring(4));
                int del = Math.min(k, sb.length());
                sb.setLength(sb.length() - del);
            }
        }
        return sb.length();
    }
}`,
    pythonSolution: `def finalDocumentLength(ops):
    s = ""
    hist = []
    for op in ops:
        if op == "UNDO":
            if hist: s = hist.pop()
        elif op.startswith("ADD "):
            hist.append(s)
            s += op[4:]
        elif op.startswith("DEL "):
            hist.append(s)
            k = int(op[4:])
            s = s[:-k] if k > 0 else s
    return len(s)`
  },
  {
    number: 6,
    title: 'VS Code Extension Conflict Pairs',
    fnName: 'countSafeExtensionSets',
    description: 'Given <code>n</code> extensions and a list of incompatible pairs <code>conflicts</code> <code>[u, v]</code>, count how many pairs of distinct extensions <code>(i, j)</code> with <code>i &lt; j</code> can be installed together without conflict.',
    constraints: ['2 <= n <= 10^5', '0 <= conflicts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, conflicts = [[0, 1], [2, 3]]', output: '4' },
      { title: 'Test Case 2', input: 'n = 3, conflicts = [[0, 1], [1, 2], [0, 2]]', output: '0' },
      { title: 'Test Case 3', input: 'n = 5, conflicts = []', output: '10' },
      { title: 'Test Case 4', input: 'n = 4, conflicts = [[0, 1], [0, 1]]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countSafeExtensionSets(int n, int[][] conflicts) {
        Set<Long> seen = new HashSet<>();
        for (int[] c : conflicts) {
            int a = Math.min(c[0], c[1]), b = Math.max(c[0], c[1]);
            seen.add(((long) a << 20) | b);
        }
        long total = (long) n * (n - 1) / 2;
        return total - seen.size();
    }
}`,
    pythonSolution: `def countSafeExtensionSets(n, conflicts):
    seen = {tuple(sorted(c)) for c in conflicts}
    return n * (n - 1) // 2 - len(seen)`
  },
  {
    number: 7,
    title: 'Excel Column Title to Index',
    fnName: 'excelColToIndex',
    description: 'Convert an uppercase Excel column label <code>col</code> (e.g., <code>"A"</code> -> 1, <code>"Z"</code> -> 26, <code>"AA"</code> -> 27) to its 1-based column number.',
    constraints: ['1 <= col.length <= 7', 'col consists of A-Z'],
    testCases: [
      { title: 'Test Case 1', input: 'col = "AA"', output: '27' },
      { title: 'Test Case 2', input: 'col = "ZY"', output: '701' },
      { title: 'Test Case 3', input: 'col = "A"', output: '1' },
      { title: 'Test Case 4', input: 'col = "XFD"', output: '16384' }
    ],
    javaSolution: `public class Solution {
    public static long excelColToIndex(String col) {
        long res = 0;
        for (int i = 0; i < col.length(); i++) res = res * 26 + (col.charAt(i) - 'A' + 1);
        return res;
    }
}`,
    pythonSolution: `def excelColToIndex(col):
    res = 0
    for ch in col:
        res = res * 26 + (ord(ch) - ord('A') + 1)
    return res`
  },
  {
    number: 8,
    title: 'Azure Container Pod Bin Packing',
    fnName: 'minNodesRequired',
    description: 'Given container memory requests <code>reqs</code> (in GB) sorted in non-increasing order, and uniform VM node capacity <code>cap</code>, greedily pack each container into the first node that fits (First-Fit). Return total VM nodes used.',
    constraints: ['1 <= reqs.length <= 2000', '1 <= reqs[i] <= cap <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'reqs = [7, 5, 5, 3, 2], cap = 10', output: '3' },
      { title: 'Test Case 2', input: 'reqs = [4, 4, 4], cap = 8', output: '2' },
      { title: 'Test Case 3', input: 'reqs = [10], cap = 10', output: '1' },
      { title: 'Test Case 4', input: 'reqs = [6, 6, 4, 4], cap = 10', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minNodesRequired(int[] reqs, int cap) {
        List<Integer> rem = new ArrayList<>();
        for (int r : reqs) {
            boolean placed = false;
            for (int i = 0; i < rem.size(); i++) {
                if (rem.get(i) >= r) { rem.set(i, rem.get(i) - r); placed = true; break; }
            }
            if (!placed) rem.add(cap - r);
        }
        return rem.size();
    }
}`,
    pythonSolution: `def minNodesRequired(reqs, cap):
    rem = []
    for r in reqs:
        for i in range(len(rem)):
            if rem[i] >= r:
                rem[i] -= r
                break
        else:
            rem.append(cap - r)
    return len(rem)`
  },
  {
    number: 9,
    title: 'Org-Chart Reporting Depth',
    fnName: 'maxReportingDepth',
    description: 'In Microsoft\'s org chart of <code>n</code> employees (0..n-1), <code>manager[i]</code> is employee <code>i</code>\'s direct manager (<code>-1</code> for CEO). Return the maximum number of managers between any employee and the CEO (CEO has depth 0).',
    constraints: ['1 <= n <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'manager = [-1, 0, 0, 1, 3]', output: '3' },
      { title: 'Test Case 2', input: 'manager = [-1]', output: '0' },
      { title: 'Test Case 3', input: 'manager = [1, -1, 1, 2]', output: '2' },
      { title: 'Test Case 4', input: 'manager = [-1, 0, 0, 0]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxReportingDepth(int[] manager) {
        int n = manager.length;
        int[] memo = new int[n];
        int best = 0;
        for (int i = 0; i < n; i++) best = Math.max(best, depth(i, manager, memo));
        return best;
    }
    private static int depth(int i, int[] m, int[] memo) {
        if (m[i] == -1) return 0;
        if (memo[i] != 0) return memo[i];
        return memo[i] = 1 + depth(m[i], m, memo);
    }
}`,
    pythonSolution: `def maxReportingDepth(manager):
    n = len(manager)
    memo = {}
    def d(i):
        if manager[i] == -1: return 0
        if i in memo: return memo[i]
        memo[i] = 1 + d(manager[i])
        return memo[i]
    return max(d(i) for i in range(n))`
  },
  {
    number: 10,
    title: 'Telemetry Heartbeat Gap Detector',
    fnName: 'countMissedHeartbeats',
    description: 'A Windows service sends heartbeats at sorted timestamps <code>beats</code>. Whenever the gap between consecutive heartbeats exceeds <code>timeout</code>, <code>(gap - 1) // timeout</code> missed beats are logged. Return total missed beats.',
    constraints: ['1 <= beats.length <= 10^5', '1 <= timeout <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'beats = [0, 5, 18, 23], timeout = 5', output: '2' },
      { title: 'Test Case 2', input: 'beats = [0, 10, 20], timeout = 10', output: '0' },
      { title: 'Test Case 3', input: 'beats = [0, 21], timeout = 5', output: '4' },
      { title: 'Test Case 4', input: 'beats = [7], timeout = 3', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countMissedHeartbeats(int[] beats, int timeout) {
        long missed = 0;
        for (int i = 1; i < beats.length; i++) {
            int gap = beats[i] - beats[i - 1];
            if (gap > timeout) missed += (gap - 1) / timeout;
        }
        return missed;
    }
}`,
    pythonSolution: `def countMissedHeartbeats(beats, timeout):
    return sum((beats[i] - beats[i - 1] - 1) // timeout for i in range(1, len(beats)) if beats[i] - beats[i - 1] > timeout)`
  },
  {
    number: 11,
    title: 'Git Commit Merge-Base Distance',
    fnName: 'minStepsToCommonAncestor',
    description: 'Given a commit DAG tree where <code>parent[i]</code> is the parent of commit <code>i</code> (root has <code>-1</code>), find the minimum total parent-hops from commit <code>u</code> and commit <code>v</code> to reach their lowest common ancestor.',
    constraints: ['1 <= parent.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 0, 1, 1, 2], u = 3, v = 5', output: '4' },
      { title: 'Test Case 2', input: 'parent = [-1, 0, 1, 2], u = 1, v = 3', output: '2' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 0], u = 2, v = 2', output: '0' },
      { title: 'Test Case 4', input: 'parent = [-1, 0, 1, 1], u = 2, v = 3', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minStepsToCommonAncestor(int[] parent, int u, int v) {
        Map<Integer, Integer> distU = new HashMap<>();
        int cur = u, d = 0;
        while (cur != -1) { distU.put(cur, d++); cur = parent[cur]; }
        cur = v; d = 0;
        while (cur != -1) {
            if (distU.containsKey(cur)) return distU.get(cur) + d;
            cur = parent[cur]; d++;
        }
        return -1;
    }
}`,
    pythonSolution: `def minStepsToCommonAncestor(parent, u, v):
    du = {}
    d = 0
    while u != -1:
        du[u] = d; u = parent[u]; d += 1
    d = 0
    while v != -1:
        if v in du: return du[v] + d
        v = parent[v]; d += 1
    return -1`
  },
  {
    number: 12,
    title: 'Compiler Dead-Code Reachability',
    fnName: 'countUnreachableBlocks',
    description: 'A compiler CFG has <code>n</code> basic blocks (0..n-1) with entry block <code>0</code> and directed edges <code>edges</code>. Return how many basic blocks are unreachable dead code.',
    constraints: ['1 <= n <= 10^4', '0 <= edges.length <= 5 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, edges = [[0, 1], [1, 2], [3, 4]]', output: '2' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1], [1, 2]]', output: '0' },
      { title: 'Test Case 3', input: 'n = 4, edges = []', output: '3' },
      { title: 'Test Case 4', input: 'n = 1, edges = []', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUnreachableBlocks(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) g.get(e[0]).add(e[1]);
        boolean[] vis = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();
        vis[0] = true; q.add(0);
        int reach = 1;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g.get(u)) if (!vis[v]) { vis[v] = true; reach++; q.add(v); }
        }
        return n - reach;
    }
}`,
    pythonSolution: `from collections import deque
def countUnreachableBlocks(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges: g[u].append(v)
    vis = {0}; q = deque([0])
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis: vis.add(v); q.append(v)
    return n - len(vis)`
  },
  {
    number: 13,
    title: 'Bitwise Flag Permission Mask',
    fnName: 'countAuthorizedUsers',
    description: 'Each user has permission mask <code>perms[i]</code>. A resource requires all bits in <code>requiredMask</code> AND none of the bits in <code>forbiddenMask</code>. Count how many users are authorized.',
    constraints: ['1 <= perms.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'perms = [7, 5, 3, 15], requiredMask = 5, forbiddenMask = 8', output: '2' },
      { title: 'Test Case 2', input: 'perms = [1, 2, 4], requiredMask = 1, forbiddenMask = 0', output: '1' },
      { title: 'Test Case 3', input: 'perms = [8, 9], requiredMask = 1, forbiddenMask = 8', output: '0' },
      { title: 'Test Case 4', input: 'perms = [0, 4], requiredMask = 0, forbiddenMask = 4', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countAuthorizedUsers(int[] perms, int requiredMask, int forbiddenMask) {
        int cnt = 0;
        for (int p : perms) {
            if ((p & requiredMask) == requiredMask && (p & forbiddenMask) == 0) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countAuthorizedUsers(perms, requiredMask, forbiddenMask):
    return sum(1 for p in perms if (p & requiredMask) == requiredMask and (p & forbiddenMask) == 0)`
  },
  {
    number: 14,
    title: 'Copilot Token Budget Truncator',
    fnName: 'maxKeptContextChunks',
    description: 'An LLM prompt builder keeps the most recent context chunks from the end of <code>tokenCounts</code> without exceeding <code>budget</code>. Return how many trailing chunks can be included.',
    constraints: ['1 <= tokenCounts.length <= 10^5', '0 <= budget <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'tokenCounts = [500, 300, 200, 400], budget = 650', output: '2' },
      { title: 'Test Case 2', input: 'tokenCounts = [100, 200, 300], budget = 600', output: '3' },
      { title: 'Test Case 3', input: 'tokenCounts = [800], budget = 500', output: '0' },
      { title: 'Test Case 4', input: 'tokenCounts = [10, 20, 30], budget = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxKeptContextChunks(int[] tokenCounts, int budget) {
        long sum = 0;
        int cnt = 0;
        for (int i = tokenCounts.length - 1; i >= 0; i--) {
            if (sum + tokenCounts[i] <= budget) { sum += tokenCounts[i]; cnt++; }
            else break;
        }
        return cnt;
    }
}`,
    pythonSolution: `def maxKeptContextChunks(tokenCounts, budget):
    s = cnt = 0
    for x in reversed(tokenCounts):
        if s + x <= budget: s += x; cnt += 1
        else: break
    return cnt`
  },
  {
    number: 15,
    title: 'String Template Variable Validator',
    fnName: 'countUnresolvedPlaceholders',
    description: 'A configuration string <code>tmpl</code> contains placeholders like <code>{db_host}</code> (no nested braces). Given an array of defined variable names <code>defined</code>, return how many placeholder occurrences in <code>tmpl</code> are NOT in <code>defined</code>.',
    constraints: ['1 <= tmpl.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'tmpl = "https://{host}:{port}/{env}", defined = ["host", "env"]', output: '1' },
      { title: 'Test Case 2', input: 'tmpl = "{a}/{b}/{a}", defined = ["b"]', output: '2' },
      { title: 'Test Case 3', input: 'tmpl = "plain-text", defined = []', output: '0' },
      { title: 'Test Case 4', input: 'tmpl = "{x}{y}", defined = ["x", "y"]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUnresolvedPlaceholders(String tmpl, String[] defined) {
        Set<String> set = new HashSet<>(Arrays.asList(defined));
        int bad = 0, i = 0;
        while (i < tmpl.length()) {
            if (tmpl.charAt(i) == '{') {
                int j = tmpl.indexOf('}', i + 1);
                if (j == -1) break;
                String name = tmpl.substring(i + 1, j);
                if (!set.contains(name)) bad++;
                i = j + 1;
            } else i++;
        }
        return bad;
    }
}`,
    pythonSolution: `def countUnresolvedPlaceholders(tmpl, defined):
    s = set(defined)
    bad = i = 0
    while i < len(tmpl):
        if tmpl[i] == '{':
            j = tmpl.find('}', i + 1)
            if j == -1: break
            if tmpl[i+1:j] not in s: bad += 1
            i = j + 1
        else:
            i += 1
    return bad`
  },
  {
    number: 16,
    title: 'Teams Breakout Room Balancer',
    fnName: 'minMovesToBalanceRooms',
    description: 'Given participant counts <code>rooms</code> across <code>k</code> breakout rooms where <code>sum(rooms)</code> is divisible by <code>k</code>, in one move you can move 1 person between any two rooms. Return the minimum moves needed so all rooms have equal size.',
    constraints: ['1 <= rooms.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'rooms = [1, 5, 3]', output: '2' },
      { title: 'Test Case 2', input: 'rooms = [4, 4, 4]', output: '0' },
      { title: 'Test Case 3', input: 'rooms = [10, 0]', output: '5' },
      { title: 'Test Case 4', input: 'rooms = [2, 6, 4, 8]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static long minMovesToBalanceRooms(int[] rooms) {
        long sum = 0; for (int r : rooms) sum += r;
        long avg = sum / rooms.length, moves = 0;
        for (int r : rooms) if (r > avg) moves += r - avg;
        return moves;
    }
}`,
    pythonSolution: `def minMovesToBalanceRooms(rooms):
    avg = sum(rooms) // len(rooms)
    return sum(r - avg for r in rooms if r > avg)`
  },
  {
    number: 17,
    title: 'Build Artifact Cache Eviction Count',
    fnName: 'countCacheMisses',
    description: 'Simulate an LRU cache of capacity <code>cap</code> processing artifact IDs <code>requests</code>. Return the total number of cache misses.',
    constraints: ['1 <= cap <= 10^4', '1 <= requests.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'requests = [1, 2, 1, 3, 2, 4], cap = 2', output: '5' },
      { title: 'Test Case 2', input: 'requests = [1, 2, 1, 2], cap = 2', output: '2' },
      { title: 'Test Case 3', input: 'requests = [5, 5, 5], cap = 1', output: '1' },
      { title: 'Test Case 4', input: 'requests = [1, 2, 3], cap = 3', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countCacheMisses(int[] requests, int cap) {
        LinkedHashSet<Integer> lru = new LinkedHashSet<>();
        int misses = 0;
        for (int r : requests) {
            if (lru.contains(r)) {
                lru.remove(r);
                lru.add(r);
            } else {
                misses++;
                if (lru.size() == cap) {
                    Iterator<Integer> it = lru.iterator();
                    it.next(); it.remove();
                }
                lru.add(r);
            }
        }
        return misses;
    }
}`,
    pythonSolution: `from collections import OrderedDict
def countCacheMisses(requests, cap):
    od = OrderedDict()
    misses = 0
    for r in requests:
        if r in od:
            od.move_to_end(r)
        else:
            misses += 1
            if len(od) == cap: od.popitem(last=False)
            od[r] = True
    return misses`
  },
  {
    number: 18,
    title: 'PowerPoint Slide Transition Cost',
    fnName: 'minSlideReorderCost',
    description: 'Each slide <code>i</code> has theme ID <code>themes[i]</code>. Switching theme between adjacent slides costs 1 unit. You may reorder slides arbitrarily; return the minimum total theme-switch cost.',
    constraints: ['1 <= themes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'themes = [1, 2, 1, 3, 2]', output: '2' },
      { title: 'Test Case 2', input: 'themes = [5, 5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'themes = [1, 2, 3, 4]', output: '3' },
      { title: 'Test Case 4', input: 'themes = [7]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minSlideReorderCost(int[] themes) {
        Set<Integer> s = new HashSet<>();
        for (int t : themes) s.add(t);
        return s.size() - 1;
    }
}`,
    pythonSolution: `def minSlideReorderCost(themes):
    return len(set(themes)) - 1`
  },
  {
    number: 19,
    title: 'CI/CD Pipeline Critical Path Duration',
    fnName: 'longestPipelineDuration',
    description: 'Given <code>n</code> build stages (0..n-1) with durations <code>dur</code> and DAG edges <code>deps</code> <code>[u, v]</code> (<code>u</code> must finish before <code>v</code> starts), return the minimum total time to finish all stages with unlimited parallelism.',
    constraints: ['1 <= n <= 10^4', '0 <= deps.length <= 5 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'dur = [3, 4, 2, 5], deps = [[0, 2], [1, 2], [2, 3]]', output: '11' },
      { title: 'Test Case 2', input: 'dur = [10, 5, 8], deps = []', output: '10' },
      { title: 'Test Case 3', input: 'dur = [2, 3, 4], deps = [[0, 1], [1, 2]]', output: '9' },
      { title: 'Test Case 4', input: 'dur = [7], deps = []', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long longestPipelineDuration(int[] dur, int[][] deps) {
        int n = dur.length;
        List<List<Integer>> g = new ArrayList<>();
        int[] ind = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] d : deps) { g.get(d[0]).add(d[1]); ind[d[1]]++; }
        long[] fin = new long[n];
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (ind[i] == 0) { fin[i] = dur[i]; q.add(i); }
        long ans = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            ans = Math.max(ans, fin[u]);
            for (int v : g.get(u)) {
                fin[v] = Math.max(fin[v], fin[u] + dur[v]);
                if (--ind[v] == 0) q.add(v);
            }
        }
        return ans;
    }
}`,
    pythonSolution: `from collections import deque
def longestPipelineDuration(dur, deps):
    n = len(dur)
    g = [[] for _ in range(n)]
    ind = [0] * n
    for u, v in deps: g[u].append(v); ind[v] += 1
    fin = [dur[i] if ind[i] == 0 else 0 for i in range(n)]
    q = deque([i for i in range(n) if ind[i] == 0])
    while q:
        u = q.popleft()
        for v in g[u]:
            fin[v] = max(fin[v], fin[u] + dur[v])
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return max(fin)`
  },
  {
    number: 20,
    title: 'Semantic Version Comparator Count',
    fnName: 'countNewerReleases',
    description: 'Given semantic version strings <code>versions</code> (<code>"major.minor.patch"</code>) and a baseline <code>baseVer</code>, return how many versions are strictly greater than <code>baseVer</code>.',
    constraints: ['1 <= versions.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'versions = ["1.2.10", "1.2.9", "1.10.0", "1.2.8"], baseVer = "1.2.9"', output: '2' },
      { title: 'Test Case 2', input: 'versions = ["2.0.0", "1.99.99"], baseVer = "2.0.0"', output: '0' },
      { title: 'Test Case 3', input: 'versions = ["3.0.0"], baseVer = "2.9.9"', output: '1' },
      { title: 'Test Case 4', input: 'versions = ["0.1.0", "0.0.9"], baseVer = "0.0.10"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countNewerReleases(String[] versions, String baseVer) {
        int[] b = parse(baseVer);
        int cnt = 0;
        for (String v : versions) {
            int[] p = parse(v);
            if (p[0] > b[0] || (p[0] == b[0] && (p[1] > b[1] || (p[1] == b[1] && p[2] > b[2])))) cnt++;
        }
        return cnt;
    }
    private static int[] parse(String s) {
        String[] sp = s.split("\\\\.");
        return new int[]{Integer.parseInt(sp[0]), Integer.parseInt(sp[1]), Integer.parseInt(sp[2])};
    }
}`,
    pythonSolution: `def countNewerReleases(versions, baseVer):
    b = tuple(map(int, baseVer.split('.')))
    return sum(1 for v in versions if tuple(map(int, v.split('.'))) > b)`
  },
  {
    number: 21,
    title: 'Azure Blob Prefix Tree Match',
    fnName: 'countMatchingBlobs',
    description: 'Given blob paths <code>paths</code> and a query prefix <code>prefix</code>, return how many paths start with <code>prefix</code>.',
    constraints: ['1 <= paths.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'paths = ["logs/2026/a.txt", "logs/2026/b.txt", "logs/2025/c.txt"], prefix = "logs/2026/"', output: '2' },
      { title: 'Test Case 2', input: 'paths = ["data/img.png"], prefix = "logs/"', output: '0' },
      { title: 'Test Case 3', input: 'paths = ["a", "ab", "abc"], prefix = "a"', output: '3' },
      { title: 'Test Case 4', input: 'paths = ["x"], prefix = ""', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countMatchingBlobs(String[] paths, String prefix) {
        int cnt = 0;
        for (String p : paths) if (p.startsWith(prefix)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countMatchingBlobs(paths, prefix):
    return sum(1 for p in paths if p.startswith(prefix))`
  },
  {
    number: 22,
    title: 'Outlook Calendar Free-Slot Finder',
    fnName: 'totalFreeMinutes',
    description: 'A workday runs from <code>0</code> to <code>dayEnd</code> minutes. Given meeting intervals <code>meetings</code> <code>[start, end]</code> (possibly overlapping), return total free minutes in the workday.',
    constraints: ['0 <= meetings.length <= 10^4', '1 <= dayEnd <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'meetings = [[60, 120], [90, 150], [300, 360]], dayEnd = 480', output: '330' },
      { title: 'Test Case 2', input: 'meetings = [[0, 480]], dayEnd = 480', output: '0' },
      { title: 'Test Case 3', input: 'meetings = [], dayEnd = 480', output: '480' },
      { title: 'Test Case 4', input: 'meetings = [[10, 20], [20, 30]], dayEnd = 50', output: '30' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int totalFreeMinutes(int[][] meetings, int dayEnd) {
        if (meetings.length == 0) return dayEnd;
        Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));
        int busy = 0, s = meetings[0][0], e = meetings[0][1];
        for (int i = 1; i < meetings.length; i++) {
            if (meetings[i][0] <= e) e = Math.max(e, meetings[i][1]);
            else { busy += e - s; s = meetings[i][0]; e = meetings[i][1]; }
        }
        busy += e - s;
        return dayEnd - busy;
    }
}`,
    pythonSolution: `def totalFreeMinutes(meetings, dayEnd):
    if not meetings: return dayEnd
    meetings.sort()
    busy = 0
    s, e = meetings[0]
    for a, b in meetings[1:]:
        if a <= e: e = max(e, b)
        else: busy += e - s; s, e = a, b
    busy += e - s
    return dayEnd - busy`
  },
  {
    number: 23,
    title: 'Memory Page Contiguous Block Finder',
    fnName: 'firstFitBlockStart',
    description: 'Given a binary array <code>pages</code> where <code>0</code> means free and <code>1</code> means occupied, return the smallest starting index of <code>k</code> consecutive free pages, or <code>-1</code> if none exists.',
    constraints: ['1 <= k <= pages.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pages = [1, 0, 0, 1, 0, 0, 0], k = 3', output: '4' },
      { title: 'Test Case 2', input: 'pages = [1, 0, 1, 0], k = 2', output: '-1' },
      { title: 'Test Case 3', input: 'pages = [0, 0, 0], k = 1', output: '0' },
      { title: 'Test Case 4', input: 'pages = [1, 1, 0, 0], k = 2', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int firstFitBlockStart(int[] pages, int k) {
        int run = 0;
        for (int i = 0; i < pages.length; i++) {
            if (pages[i] == 0) {
                run++;
                if (run == k) return i - k + 1;
            } else run = 0;
        }
        return -1;
    }
}`,
    pythonSolution: `def firstFitBlockStart(pages, k):
    run = 0
    for i, p in enumerate(pages):
        if p == 0:
            run += 1
            if run == k: return i - k + 1
        else:
            run = 0
    return -1`
  },
  {
    number: 24,
    title: 'Distributed Lock Lease Renewal',
    fnName: 'countLeaseExpirations',
    description: 'A lock with lease duration <code>lease</code> is acquired at <code>times[0]</code>. Each subsequent heartbeat at <code>times[i]</code> extends the lease to <code>times[i] + lease</code> if <code>times[i] &lt;= curExpiry</code>; otherwise the lock expired and is re-acquired (incrementing expiration count). Return total expirations.',
    constraints: ['1 <= times.length <= 10^5', '1 <= lease <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [0, 4, 9, 20, 22], lease = 5', output: '1' },
      { title: 'Test Case 2', input: 'times = [0, 5, 10], lease = 5', output: '0' },
      { title: 'Test Case 3', input: 'times = [0, 6, 12], lease = 5', output: '2' },
      { title: 'Test Case 4', input: 'times = [10], lease = 3', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countLeaseExpirations(int[] times, int lease) {
        int exp = times[0] + lease, drops = 0;
        for (int i = 1; i < times.length; i++) {
            if (times[i] > exp) drops++;
            exp = times[i] + lease;
        }
        return drops;
    }
}`,
    pythonSolution: `def countLeaseExpirations(times, lease):
    exp = times[0] + lease
    drops = 0
    for t in times[1:]:
        if t > exp: drops += 1
        exp = t + lease
    return drops`
  },
  {
    number: 25,
    title: 'Trie Autocomplete Weight Sum',
    fnName: 'sumWeightsWithPrefix',
    description: 'Given search terms <code>terms</code>, their popularity scores <code>scores</code>, and a query <code>prefix</code>, return the sum of scores of all terms that start with <code>prefix</code>.',
    constraints: ['1 <= terms.length == scores.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'terms = ["azure", "azcopy", "bing", "az"], scores = [10, 5, 20, 3], prefix = "az"', output: '18' },
      { title: 'Test Case 2', input: 'terms = ["word", "excel"], scores = [10, 20], prefix = "ppt"', output: '0' },
      { title: 'Test Case 3', input: 'terms = ["a"], scores = [7], prefix = "a"', output: '7' },
      { title: 'Test Case 4', input: 'terms = ["ms", "msn"], scores = [4, 6], prefix = ""', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long sumWeightsWithPrefix(String[] terms, int[] scores, String prefix) {
        long s = 0;
        for (int i = 0; i < terms.length; i++) if (terms[i].startsWith(prefix)) s += scores[i];
        return s;
    }
}`,
    pythonSolution: `def sumWeightsWithPrefix(terms, scores, prefix):
    return sum(sc for t, sc in zip(terms, scores) if t.startswith(prefix))`
  },
  {
    number: 26,
    title: 'Server Rack Power Cap Optimizer',
    fnName: 'maxActiveServersUnderCap',
    description: 'Given server power draws <code>watts</code> and rack limit <code>maxWatts</code>, return the maximum number of servers that can run simultaneously without exceeding <code>maxWatts</code>.',
    constraints: ['1 <= watts.length <= 10^5', '0 <= maxWatts <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'watts = [300, 150, 200, 100, 250], maxWatts = 500', output: '3' },
      { title: 'Test Case 2', input: 'watts = [600, 700], maxWatts = 500', output: '0' },
      { title: 'Test Case 3', input: 'watts = [100, 100, 100], maxWatts = 300', output: '3' },
      { title: 'Test Case 4', input: 'watts = [50], maxWatts = 50', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxActiveServersUnderCap(int[] watts, int maxWatts) {
        Arrays.sort(watts);
        long sum = 0; int cnt = 0;
        for (int w : watts) {
            if (sum + w <= maxWatts) { sum += w; cnt++; }
            else break;
        }
        return cnt;
    }
}`,
    pythonSolution: `def maxActiveServersUnderCap(watts, maxWatts):
    s = cnt = 0
    for w in sorted(watts):
        if s + w <= maxWatts: s += w; cnt += 1
        else: break
    return cnt`
  },
  {
    number: 27,
    title: 'Binary Tree Level Bandwidth Peak',
    fnName: 'maxLevelSumArrayTree',
    description: 'A complete binary tree is stored in 1-indexed-style level-order array <code>nodes</code> (where <code>-1</code> indicates an empty slot). Return the maximum sum of non-empty node values at any depth level.',
    constraints: ['1 <= nodes.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nodes = [10, 4, 8, 2, 3, -1, 9]', output: '14' },
      { title: 'Test Case 2', input: 'nodes = [5]', output: '5' },
      { title: 'Test Case 3', input: 'nodes = [1, 10, 20]', output: '30' },
      { title: 'Test Case 4', input: 'nodes = [100, -1, 50]', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static long maxLevelSumArrayTree(int[] nodes) {
        long best = Long.MIN_VALUE;
        int start = 0, len = 1;
        while (start < nodes.length) {
            long sum = 0; boolean any = false;
            for (int i = start; i < Math.min(nodes.length, start + len); i++) {
                if (nodes[i] != -1) { sum += nodes[i]; any = true; }
            }
            if (any) best = Math.max(best, sum);
            start += len; len *= 2;
        }
        return best;
    }
}`,
    pythonSolution: `def maxLevelSumArrayTree(nodes):
    best = float('-inf')
    start, length = 0, 1
    while start < len(nodes):
        vals = [x for x in nodes[start:start+length] if x != -1]
        if vals: best = max(best, sum(vals))
        start += length; length *= 2
    return best`
  },
  {
    number: 28,
    title: 'Task Scheduler Cooldown Minimum Time',
    fnName: 'minTimeWithCooldown',
    description: 'Given non-negative task cooldowns where identical tasks cannot run within <code>k</code> slots of each other: actually, given a single-threaded queue of task types <code>tasks</code> executed in order, if the same task type ran within the last <code>k</code> time units (at time <code>tPrev</code>, next allowed is <code>tPrev + k + 1</code>), the worker idles until then. Return total completion time.',
    constraints: ['1 <= tasks.length <= 10^5', '0 <= k <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'tasks = [1, 1, 2, 1], k = 2', output: '7' },
      { title: 'Test Case 2', input: 'tasks = [1, 2, 3], k = 5', output: '3' },
      { title: 'Test Case 3', input: 'tasks = [1, 1, 1], k = 1', output: '5' },
      { title: 'Test Case 4', input: 'tasks = [4], k = 10', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minTimeWithCooldown(int[] tasks, int k) {
        Map<Integer, Long> last = new HashMap<>();
        long time = 0;
        for (int t : tasks) {
            time++;
            if (last.containsKey(t) && time <= last.get(t) + k) {
                time = last.get(t) + k + 1;
            }
            last.put(t, time);
        }
        return time;
    }
}`,
    pythonSolution: `def minTimeWithCooldown(tasks, k):
    last = {}
    t = 0
    for task in tasks:
        t += 1
        if task in last and t <= last[task] + k:
            t = last[task] + k + 1
        last[task] = t
    return t`
  },
  {
    number: 29,
    title: 'Matrix Spiral Telemetry Readout',
    fnName: 'diagonalBorderSum',
    description: 'Given a square <code>n x n</code> telemetry matrix <code>grid</code>, compute the sum of all elements on the outer border (first/last row and first/last column) without double-counting corners.',
    constraints: ['1 <= n <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '40' },
      { title: 'Test Case 2', input: 'grid = [[5]]', output: '5' },
      { title: 'Test Case 3', input: 'grid = [[1, 2], [3, 4]]', output: '10' },
      { title: 'Test Case 4', input: 'grid = [[1, 1, 1, 1], [1, 9, 9, 1], [1, 9, 9, 1], [1, 1, 1, 1]]', output: '12' }
    ],
    javaSolution: `public class Solution {
    public static long diagonalBorderSum(int[][] grid) {
        int n = grid.length;
        long sum = 0;
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (r == 0 || r == n - 1 || c == 0 || c == n - 1) sum += grid[r][c];
            }
        }
        return sum;
    }
}`,
    pythonSolution: `def diagonalBorderSum(grid):
    n = len(grid)
    return sum(grid[r][c] for r in range(n) for c in range(n) if r in (0, n-1) or c in (0, n-1))`
  },
  {
    number: 30,
    title: 'Bitwise Parity Error Correction',
    fnName: 'countOddParityBytes',
    description: 'Given an array of integers <code>bytes</code>, count how many have an odd number of set bits (<code>1</code>s) in their binary representation.',
    constraints: ['1 <= bytes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bytes = [1, 2, 3, 7, 8]', output: '4' },
      { title: 'Test Case 2', input: 'bytes = [0, 3, 5]', output: '0' },
      { title: 'Test Case 3', input: 'bytes = [15]', output: '0' },
      { title: 'Test Case 4', input: 'bytes = [7]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countOddParityBytes(int[] bytes) {
        int cnt = 0;
        for (int b : bytes) if (Integer.bitCount(b) % 2 == 1) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countOddParityBytes(bytes):
    return sum(1 for b in bytes if b.bit_count() % 2 == 1)`
  },
  {
    number: 31,
    title: 'Longest Alternating Status Streak',
    fnName: 'longestAlternatingStreak',
    description: 'Given a binary health status array <code>status</code> (<code>0</code> or <code>1</code>), return the length of the longest contiguous subarray where adjacent elements differ.',
    constraints: ['1 <= status.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'status = [1, 0, 1, 0, 0, 1]', output: '4' },
      { title: 'Test Case 2', input: 'status = [0, 0, 0]', output: '1' },
      { title: 'Test Case 3', input: 'status = [1]', output: '1' },
      { title: 'Test Case 4', input: 'status = [0, 1, 0, 1, 0]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int longestAlternatingStreak(int[] status) {
        int cur = 1, best = 1;
        for (int i = 1; i < status.length; i++) {
            cur = (status[i] != status[i - 1]) ? cur + 1 : 1;
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def longestAlternatingStreak(status):
    cur = best = 1
    for i in range(1, len(status)):
        cur = cur + 1 if status[i] != status[i - 1] else 1
        best = max(best, cur)
    return best`
  },
  {
    number: 32,
    title: 'Event-Hub Partition Skew Metric',
    fnName: 'partitionLoadSkew',
    description: 'Events with partition keys <code>keys</code> are distributed across <code>p</code> partitions using <code>key % p</code>. Return the difference between the maximum and minimum number of events assigned to any partition.',
    constraints: ['1 <= keys.length <= 10^5', '1 <= p <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'keys = [0, 1, 2, 3, 4, 8], p = 4', output: '2' },
      { title: 'Test Case 2', input: 'keys = [0, 4, 8], p = 4', output: '3' },
      { title: 'Test Case 3', input: 'keys = [0, 1, 2, 3], p = 4', output: '0' },
      { title: 'Test Case 4', input: 'keys = [5, 10], p = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int partitionLoadSkew(int[] keys, int p) {
        int[] cnt = new int[p];
        for (int k : keys) cnt[((k % p) + p) % p]++;
        int mn = Integer.MAX_VALUE, mx = 0;
        for (int c : cnt) { mn = Math.min(mn, c); mx = Math.max(mx, c); }
        return mx - mn;
    }
}`,
    pythonSolution: `def partitionLoadSkew(keys, p):
    cnt = [0] * p
    for k in keys: cnt[k % p] += 1
    return max(cnt) - min(cnt)`
  },
  {
    number: 33,
    title: 'Path Normalization Depth',
    fnName: 'normalizedPathDepth',
    description: 'Given a Unix-like path <code>path</code> split by <code>"/"</code> containing directory names, <code>"."</code>, and <code>".."</code>, return the final directory depth from root (<code>0</code> at root; <code>".."</code> at root stays at <code>0</code>).',
    constraints: ['1 <= path.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'path = "/src/app/../lib/./utils"', output: '3' },
      { title: 'Test Case 2', input: 'path = "/../../a"', output: '1' },
      { title: 'Test Case 3', input: 'path = "/"', output: '0' },
      { title: 'Test Case 4', input: 'path = "/a/b/c/../.."', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int normalizedPathDepth(String path) {
        int depth = 0;
        for (String seg : path.split("/")) {
            if (seg.isEmpty() || seg.equals(".")) continue;
            if (seg.equals("..")) depth = Math.max(0, depth - 1);
            else depth++;
        }
        return depth;
    }
}`,
    pythonSolution: `def normalizedPathDepth(path):
    depth = 0
    for seg in path.split('/'):
        if not seg or seg == '.': continue
        if seg == '..': depth = max(0, depth - 1)
        else: depth += 1
    return depth`
  },
  {
    number: 34,
    title: 'Minimum Cost Tree Merge',
    fnName: 'minCombineFilesCost',
    description: 'Merging two sorted log shards of sizes <code>a</code> and <code>b</code> costs <code>a + b</code>. Given shard sizes <code>shards</code>, return the minimum total cost to merge all shards into one file.',
    constraints: ['1 <= shards.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'shards = [4, 3, 2, 6]', output: '29' },
      { title: 'Test Case 2', input: 'shards = [10]', output: '0' },
      { title: 'Test Case 3', input: 'shards = [1, 2, 3]', output: '9' },
      { title: 'Test Case 4', input: 'shards = [5, 5, 5, 5]', output: '40' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minCombineFilesCost(int[] shards) {
        PriorityQueue<Long> pq = new PriorityQueue<>();
        for (int s : shards) pq.add((long) s);
        long cost = 0;
        while (pq.size() > 1) {
            long m = pq.poll() + pq.poll();
            cost += m;
            pq.add(m);
        }
        return cost;
    }
}`,
    pythonSolution: `import heapq
def minCombineFilesCost(shards):
    h = list(shards)
    heapq.heapify(h)
    cost = 0
    while len(h) > 1:
        m = heapq.heappop(h) + heapq.heappop(h)
        cost += m
        heapq.heappush(h, m)
    return cost`
  },
  {
    number: 35,
    title: 'DP Maximum Non-Adjacent GPU Jobs',
    fnName: 'maxGpuClusterScore',
    description: 'A sequence of GPU jobs has reward <code>rewards[i]</code>, but adjacent jobs share thermal throttling and cannot both be scheduled. Return the maximum total reward.',
    constraints: ['1 <= rewards.length <= 10^5', '0 <= rewards[i] <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'rewards = [3, 2, 7, 10]', output: '13' },
      { title: 'Test Case 2', input: 'rewards = [5, 5, 10, 100, 10, 5]', output: '110' },
      { title: 'Test Case 3', input: 'rewards = [4]', output: '4' },
      { title: 'Test Case 4', input: 'rewards = [1, 2, 3, 1]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static long maxGpuClusterScore(int[] rewards) {
        long p2 = 0, p1 = 0;
        for (int r : rewards) {
            long cur = Math.max(p1, p2 + r);
            p2 = p1; p1 = cur;
        }
        return p1;
    }
}`,
    pythonSolution: `def maxGpuClusterScore(rewards):
    p2 = p1 = 0
    for r in rewards:
        p2, p1 = p1, max(p1, p2 + r)
    return p1`
  },
  {
    number: 36,
    title: 'Word Document Autocorrect Distance',
    fnName: 'countSingleCharTypos',
    description: 'Given a dictionary word <code>target</code> and candidate words <code>words</code>, count how many candidates have the exact same length as <code>target</code> and differ in at most 1 character position.',
    constraints: ['1 <= words.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'target = "cloud", words = ["cloud", "cload", "clods", "clout", "clou"]', output: '3' },
      { title: 'Test Case 2', input: 'target = "abc", words = ["def", "ab"]', output: '0' },
      { title: 'Test Case 3', input: 'target = "x", words = ["y", "z", "x"]', output: '3' },
      { title: 'Test Case 4', input: 'target = "test", words = ["tent", "text"]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countSingleCharTypos(String target, String[] words) {
        int cnt = 0;
        for (String w : words) {
            if (w.length() != target.length()) continue;
            int diff = 0;
            for (int i = 0; i < w.length(); i++) if (w.charAt(i) != target.charAt(i)) diff++;
            if (diff <= 1) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countSingleCharTypos(target, words):
    return sum(1 for w in words if len(w) == len(target) and sum(a != b for a, b in zip(w, target)) <= 1)`
  },
  {
    number: 37,
    title: 'Network Switch Spanning Cost',
    fnName: 'minSwitchBackboneCost',
    description: 'Given <code>n</code> racks (0..n-1) and undirected fiber links <code>links</code> <code>[u, v, cost]</code>, return the minimum cost to connect all racks into one network, or <code>-1</code> if impossible.',
    constraints: ['1 <= n <= 10^4', '0 <= links.length <= 5 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, links = [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]', output: '19' },
      { title: 'Test Case 2', input: 'n = 3, links = [[0, 1, 5]]', output: '-1' },
      { title: 'Test Case 3', input: 'n = 1, links = []', output: '0' },
      { title: 'Test Case 4', input: 'n = 3, links = [[0, 1, 2], [1, 2, 3], [0, 2, 10]]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minSwitchBackboneCost(int n, int[][] links) {
        if (n <= 1) return 0;
        Arrays.sort(links, (a, b) -> Integer.compare(a[2], b[2]));
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        long cost = 0; int used = 0;
        for (int[] e : links) {
            int ru = find(p, e[0]), rv = find(p, e[1]);
            if (ru != rv) { p[ru] = rv; cost += e[2]; if (++used == n - 1) return cost; }
        }
        return -1;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def minSwitchBackboneCost(n, links):
    if n <= 1: return 0
    p = list(range(n))
    def find(x):
        while p[x] != x: p[x] = p[p[x]]; x = p[x]
        return x
    cost = used = 0
    for u, v, w in sorted(links, key=lambda x: x[2]):
        ru, rv = find(u), find(v)
        if ru != rv:
            p[ru] = rv; cost += w; used += 1
            if used == n - 1: return cost
    return -1`
  },
  {
    number: 38,
    title: 'Bug-Fix: Binary Search Boundary',
    fnName: 'countElementsAtMost',
    description: 'Given a sorted non-decreasing array <code>nums</code> and a threshold <code>limit</code>, return how many elements are <code>&lt;= limit</code>.',
    constraints: ['0 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 2, 4, 7], limit = 2', output: '3' },
      { title: 'Test Case 2', input: 'nums = [5, 10, 15], limit = 3', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 3], limit = 10', output: '3' },
      { title: 'Test Case 4', input: 'nums = [], limit = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countElementsAtMost(int[] nums, int limit) {
        int l = 0, r = nums.length;
        while (l < r) {
            int m = l + (r - l) / 2;
            if (nums[m] <= limit) l = m + 1;
            else r = m;
        }
        return l;
    }
}`,
    pythonSolution: `import bisect
def countElementsAtMost(nums, limit):
    return bisect.bisect_right(nums, limit)`
  },
  {
    number: 39,
    title: 'Log-Line JSON Key Extractor Count',
    fnName: 'countMatchingAlerts',
    description: 'Given alert severity levels <code>levels</code> (1..5) and message lengths <code>lengths</code>, count alerts where <code>levels[i] >= minLevel</code> and <code>lengths[i] <= maxLen</code>.',
    constraints: ['1 <= levels.length == lengths.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'levels = [2, 4, 5, 3], lengths = [50, 120, 80, 90], minLevel = 3, maxLen = 100', output: '2' },
      { title: 'Test Case 2', input: 'levels = [1, 2], lengths = [10, 20], minLevel = 4, maxLen = 100', output: '0' },
      { title: 'Test Case 3', input: 'levels = [5], lengths = [10], minLevel = 5, maxLen = 10', output: '1' },
      { title: 'Test Case 4', input: 'levels = [3, 3, 3], lengths = [101, 100, 99], minLevel = 3, maxLen = 100', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countMatchingAlerts(int[] levels, int[] lengths, int minLevel, int maxLen) {
        int cnt = 0;
        for (int i = 0; i < levels.length; i++) if (levels[i] >= minLevel && lengths[i] <= maxLen) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countMatchingAlerts(levels, lengths, minLevel, maxLen):
    return sum(1 for lv, ln in zip(levels, lengths) if lv >= minLevel and ln <= maxLen)`
  },
  {
    number: 40,
    title: 'Substring Distinct Window Count',
    fnName: 'countGoodKSubstrings',
    description: 'Given string <code>s</code> and integer <code>k</code>, count how many substrings of exact length <code>k</code> contain all distinct characters.',
    constraints: ['1 <= k <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abacaba", k = 3', output: '2' },
      { title: 'Test Case 2', input: 's = "aaaa", k = 2', output: '0' },
      { title: 'Test Case 3', input: 's = "abcd", k = 4', output: '1' },
      { title: 'Test Case 4', input: 's = "abc", k = 1', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countGoodKSubstrings(String s, int k) {
        Map<Character, Integer> freq = new HashMap<>();
        int cnt = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            freq.put(c, freq.getOrDefault(c, 0) + 1);
            if (i >= k) {
                char out = s.charAt(i - k);
                if (freq.get(out) == 1) freq.remove(out);
                else freq.put(out, freq.get(out) - 1);
            }
            if (i >= k - 1 && freq.size() == k) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countGoodKSubstrings(s, k):
    freq = {}
    cnt = 0
    for i, c in enumerate(s):
        freq[c] = freq.get(c, 0) + 1
        if i >= k:
            o = s[i - k]
            if freq[o] == 1: del freq[o]
            else: freq[o] -= 1
        if i >= k - 1 and len(freq) == k: cnt += 1
    return cnt`
  },
  {
    number: 41,
    title: 'Cloud Storage Deduplication Savings',
    fnName: 'dedupBytesSaved',
    description: 'Files have content hashes <code>hashes</code> and sizes <code>sizes</code>. Only one copy of each unique hash needs to be stored. Return total bytes saved by deduplication.',
    constraints: ['1 <= hashes.length == sizes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'hashes = [10, 20, 10, 30, 20], sizes = [100, 200, 100, 50, 200]', output: '300' },
      { title: 'Test Case 2', input: 'hashes = [1, 2, 3], sizes = [10, 20, 30]', output: '0' },
      { title: 'Test Case 3', input: 'hashes = [5, 5, 5], sizes = [40, 40, 40]', output: '80' },
      { title: 'Test Case 4', input: 'hashes = [9], sizes = [99]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long dedupBytesSaved(int[] hashes, int[] sizes) {
        Set<Integer> seen = new HashSet<>();
        long saved = 0;
        for (int i = 0; i < hashes.length; i++) {
            if (!seen.add(hashes[i])) saved += sizes[i];
        }
        return saved;
    }
}`,
    pythonSolution: `def dedupBytesSaved(hashes, sizes):
    seen = set()
    saved = 0
    for h, s in zip(hashes, sizes):
        if h in seen: saved += s
        else: seen.add(h)
    return saved`
  },
  {
    number: 42,
    title: 'Grid Service Island Count',
    fnName: 'countIsolatedClusters',
    description: 'In a 2D datacenter grid <code>grid</code> (<code>1</code> = active rack, <code>0</code> = empty), two racks belong to the same cluster if connected 4-directionally. Return the number of clusters.',
    constraints: ['1 <= grid.length, grid[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 1, 0], [1, 0, 0], [0, 0, 1]]', output: '2' },
      { title: 'Test Case 2', input: 'grid = [[0, 0], [0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[1, 0, 1], [0, 1, 0]]', output: '3' },
      { title: 'Test Case 4', input: 'grid = [[1]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countIsolatedClusters(int[][] grid) {
        int R = grid.length, C = grid[0].length, cnt = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                if (grid[r][c] == 1) {
                    cnt++;
                    Queue<int[]> q = new ArrayDeque<>();
                    q.add(new int[]{r, c}); grid[r][c] = 0;
                    while (!q.isEmpty()) {
                        int[] cur = q.poll();
                        for (int[] d : dirs) {
                            int nr = cur[0] + d[0], nc = cur[1] + d[1];
                            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 1) {
                                grid[nr][nc] = 0; q.add(new int[]{nr, nc});
                            }
                        }
                    }
                }
            }
        }
        return cnt;
    }
}`,
    pythonSolution: `from collections import deque
def countIsolatedClusters(grid):
    R, C = len(grid), len(grid[0])
    g = [row[:] for row in grid]
    cnt = 0
    for r in range(R):
        for c in range(C):
            if g[r][c] == 1:
                cnt += 1; g[r][c] = 0; q = deque([(r, c)])
                while q:
                    cr, cc = q.popleft()
                    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                        nr, nc = cr+dr, cc+dc
                        if 0 <= nr < R and 0 <= nc < C and g[nr][nc] == 1:
                            g[nr][nc] = 0; q.append((nr, nc))
    return cnt`
  },
  {
    number: 43,
    title: 'API Rate-Limiter Token Bucket',
    fnName: 'countAcceptedRequests',
    description: 'A token bucket starts full with <code>cap</code> tokens and refills <code>rate</code> tokens per second (capped at <code>cap</code>). Given sorted request timestamps <code>times</code> (in seconds, each costing 1 token), return how many requests are accepted.',
    constraints: ['1 <= times.length <= 10^5', '1 <= cap <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [0, 0, 0, 1, 1], cap = 2, rate = 1', output: '3' },
      { title: 'Test Case 2', input: 'times = [0, 5, 10], cap = 1, rate = 1', output: '3' },
      { title: 'Test Case 3', input: 'times = [0, 0, 0, 0], cap = 2, rate = 5', output: '2' },
      { title: 'Test Case 4', input: 'times = [2], cap = 1, rate = 1', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countAcceptedRequests(int[] times, int cap, int rate) {
        long tokens = cap; int lastT = times[0], ok = 0;
        for (int t : times) {
            tokens = Math.min(cap, tokens + (long)(t - lastT) * rate);
            lastT = t;
            if (tokens > 0) { tokens--; ok++; }
        }
        return ok;
    }
}`,
    pythonSolution: `def countAcceptedRequests(times, cap, rate):
    tokens, last_t, ok = cap, times[0], 0
    for t in times:
        tokens = min(cap, tokens + (t - last_t) * rate)
        last_t = t
        if tokens > 0: tokens -= 1; ok += 1
    return ok`
  },
  {
    number: 44,
    title: 'Balanced Bracket Depth Peak',
    fnName: 'maxBracketNestingDepth',
    description: 'Given a valid parenthesis string <code>s</code>, return the maximum nesting depth of parentheses.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "((())())"', output: '3' },
      { title: 'Test Case 2', input: 's = "()()"', output: '1' },
      { title: 'Test Case 3', input: 's = "(((())))"', output: '4' },
      { title: 'Test Case 4', input: 's = "abc"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxBracketNestingDepth(String s) {
        int d = 0, best = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') best = Math.max(best, ++d);
            else if (c == ')') d--;
        }
        return best;
    }
}`,
    pythonSolution: `def maxBracketNestingDepth(s):
    d = best = 0
    for c in s:
        if c == '(': d += 1; best = max(best, d)
        elif c == ')': d -= 1
    return best`
  },
  {
    number: 45,
    title: 'Subarray Sum Divisible Count',
    fnName: 'countDivisibleSubarrays',
    description: 'Given integer array <code>nums</code> and positive integer <code>k</code>, return the number of contiguous subarrays whose sum is divisible by <code>k</code>.',
    constraints: ['1 <= nums.length <= 10^5', '1 <= k <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 5, 0, -2, -3, 1], k = 5', output: '7' },
      { title: 'Test Case 2', input: 'nums = [5], k = 9', output: '0' },
      { title: 'Test Case 3', input: 'nums = [2, 2, 2], k = 2', output: '6' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3], k = 3', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countDivisibleSubarrays(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        cnt.put(0, 1);
        long ans = 0; int pref = 0;
        for (int x : nums) {
            pref = ((pref + x) % k + k) % k;
            int c = cnt.getOrDefault(pref, 0);
            ans += c;
            cnt.put(pref, c + 1);
        }
        return ans;
    }
}`,
    pythonSolution: `def countDivisibleSubarrays(nums, k):
    cnt = {0: 1}
    ans = pref = 0
    for x in nums:
        pref = (pref + x) % k
        ans += cnt.get(pref, 0)
        cnt[pref] = cnt.get(pref, 0) + 1
    return ans`
  },
  {
    number: 46,
    title: 'Minimum Bandwidth Bottleneck Path',
    fnName: 'maxBottleneckPath',
    description: 'Given <code>n</code> servers (0..n-1) and bidirectional links <code>links</code> <code>[u, v, cap]</code>, find the maximum bottleneck capacity of any path from <code>0</code> to <code>n - 1</code> (or <code>0</code> if unreachable).',
    constraints: ['2 <= n <= 10^4', '0 <= links.length <= 5 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, links = [[0, 1, 5], [1, 3, 3], [0, 2, 4], [2, 3, 4]]', output: '4' },
      { title: 'Test Case 2', input: 'n = 3, links = [[0, 1, 10]]', output: '0' },
      { title: 'Test Case 3', input: 'n = 2, links = [[0, 1, 7]]', output: '7' },
      { title: 'Test Case 4', input: 'n = 3, links = [[0, 1, 8], [1, 2, 2], [0, 2, 5]]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxBottleneckPath(int n, int[][] links) {
        Arrays.sort(links, (a, b) -> Integer.compare(b[2], a[2]));
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        for (int[] e : links) {
            int ru = find(p, e[0]), rv = find(p, e[1]);
            if (ru != rv) p[ru] = rv;
            if (find(p, 0) == find(p, n - 1)) return e[2];
        }
        return 0;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def maxBottleneckPath(n, links):
    p = list(range(n))
    def find(x):
        while p[x] != x: p[x] = p[p[x]]; x = p[x]
        return x
    for u, v, w in sorted(links, key=lambda x: -x[2]):
        ru, rv = find(u), find(v)
        if ru != rv: p[ru] = rv
        if find(0) == find(n - 1): return w
    return 0`
  },
  {
    number: 47,
    title: 'Run-Length Encoded String Length',
    fnName: 'encodedLength',
    description: 'Compress string <code>s</code> using run-length encoding where each consecutive run of <code>k</code> identical characters becomes <code>char + str(k)</code> (even when <code>k == 1</code>). Return the length of the encoded string.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "aaabbc"', output: '6' },
      { title: 'Test Case 2', input: 's = "aaaaaaaaaa"', output: '3' },
      { title: 'Test Case 3', input: 's = "abc"', output: '6' },
      { title: 'Test Case 4', input: 's = "z"', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int encodedLength(String s) {
        int len = 0, i = 0;
        while (i < s.length()) {
            int j = i;
            while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;
            len += 1 + String.valueOf(j - i).length();
            i = j;
        }
        return len;
    }
}`,
    pythonSolution: `def encodedLength(s):
    res = i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]: j += 1
        res += 1 + len(str(j - i))
        i = j
    return res`
  },
  {
    number: 48,
    title: 'Minimum VM Upgrades for SLA',
    fnName: 'minSlaUpgrades',
    description: 'Each service node has current throughput <code>cur[i]</code> and SLA target <code>target[i]</code>. An upgrade doubles a node\'s throughput (can be applied multiple times to a node). Return the minimum total upgrades across all nodes so every node has <code>cur[i] >= target[i]</code>.',
    constraints: ['1 <= cur.length == target.length <= 10^5', '1 <= cur[i], target[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'cur = [5, 3, 10], target = [18, 3, 15]', output: '3' },
      { title: 'Test Case 2', input: 'cur = [10, 20], target = [5, 20]', output: '0' },
      { title: 'Test Case 3', input: 'cur = [1], target = [8]', output: '3' },
      { title: 'Test Case 4', input: 'cur = [2, 4], target = [3, 9]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static long minSlaUpgrades(int[] cur, int[] target) {
        long ops = 0;
        for (int i = 0; i < cur.length; i++) {
            long v = cur[i];
            while (v < target[i]) { v *= 2; ops++; }
        }
        return ops;
    }
}`,
    pythonSolution: `def minSlaUpgrades(cur, target):
    ops = 0
    for c, t in zip(cur, target):
        while c < t: c *= 2; ops += 1
    return ops`
  },
  {
    number: 49,
    title: 'Sorted Matrix Target Count',
    fnName: 'countLessOrEqualMatrix',
    description: 'Given a matrix <code>mat</code> where every row and every column is sorted in non-decreasing order, return how many entries are <code>&lt;= target</code>.',
    constraints: ['1 <= mat.length, mat[0].length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 5, 9], [2, 6, 10], [4, 8, 12]], target = 6', output: '5' },
      { title: 'Test Case 2', input: 'mat = [[1, 2], [3, 4]], target = 0', output: '0' },
      { title: 'Test Case 3', input: 'mat = [[1, 2], [3, 4]], target = 10', output: '4' },
      { title: 'Test Case 4', input: 'mat = [[5]], target = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countLessOrEqualMatrix(int[][] mat, int target) {
        int R = mat.length, C = mat[0].length, r = R - 1, c = 0, cnt = 0;
        while (r >= 0 && c < C) {
            if (mat[r][c] <= target) { cnt += r + 1; c++; }
            else r--;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countLessOrEqualMatrix(mat, target):
    R, C = len(mat), len(mat[0])
    r, c, cnt = R - 1, 0, 0
    while r >= 0 and c < C:
        if mat[r][c] <= target: cnt += r + 1; c += 1
        else: r -= 1
    return cnt`
  },
  {
    number: 50,
    title: 'Circular Buffer Read-Write Lag',
    fnName: 'maxBufferOccupancy',
    description: 'A circular telemetry buffer processes events <code>delta</code> (positive = bytes written, negative = bytes flushed). Return the peak buffer occupancy reached.',
    constraints: ['1 <= delta.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'delta = [10, 20, -15, 25, -30]', output: '40' },
      { title: 'Test Case 2', input: 'delta = [5, -5, 5, -5]', output: '5' },
      { title: 'Test Case 3', input: 'delta = [100]', output: '100' },
      { title: 'Test Case 4', input: 'delta = [0, 0, 0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long maxBufferOccupancy(int[] delta) {
        long cur = 0, best = 0;
        for (int d : delta) { cur = Math.max(0, cur + d); best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxBufferOccupancy(delta):
    cur = best = 0
    for d in delta:
        cur = max(0, cur + d); best = max(best, cur)
    return best`
  }
];
