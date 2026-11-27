export const ATLASSIAN_QUESTIONS = [
  {
    number: 1,
    title: 'Sliding-Window API Rate Limiter',
    fnName: 'countAllowedApiCalls',
    description: 'An Atlassian Jira API gateway allows at most <code>limit</code> calls per <code>window</code> seconds per tenant. Given sorted request timestamps <code>times</code> for one tenant, accept a call if fewer than <code>limit</code> accepted calls occurred in <code>[t - window, t]</code>. Return total accepted calls.',
    constraints: ['1 <= times.length <= 10^5', '1 <= limit <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [1, 2, 3, 4, 8], window = 4, limit = 2', output: '3' },
      { title: 'Test Case 2', input: 'times = [0, 10, 20], window = 5, limit = 1', output: '3' },
      { title: 'Test Case 3', input: 'times = [1, 1, 1, 1], window = 10, limit = 3', output: '3' },
      { title: 'Test Case 4', input: 'times = [5], window = 1, limit = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countAllowedApiCalls(int[] times, int window, int limit) {
        Deque<Integer> q = new ArrayDeque<>();
        int ok = 0;
        for (int t : times) {
            while (!q.isEmpty() && t - q.peekFirst() > window) q.pollFirst();
            if (q.size() < limit) { q.addLast(t); ok++; }
        }
        return ok;
    }
}`,
    pythonSolution: `from collections import deque
def countAllowedApiCalls(times, window, limit):
    q = deque(); ok = 0
    for t in times:
        while q and t - q[0] > window: q.popleft()
        if len(q) < limit: q.append(t); ok += 1
    return ok`
  },
  {
    number: 2,
    title: 'Jira Sprint Story-Point Capacity',
    fnName: 'maxTicketsInSprint',
    description: 'Given backlog ticket story points <code>pts</code> and sprint capacity <code>cap</code>, return the maximum number of tickets that can fit in the sprint.',
    constraints: ['1 <= pts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pts = [5, 2, 8, 3, 1], cap = 7', output: '3' },
      { title: 'Test Case 2', input: 'pts = [10, 20], cap = 5', output: '0' },
      { title: 'Test Case 3', input: 'pts = [3, 3, 3], cap = 9', output: '3' },
      { title: 'Test Case 4', input: 'pts = [4], cap = 4', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxTicketsInSprint(int[] pts, int cap) {
        Arrays.sort(pts);
        long s = 0; int cnt = 0;
        for (int p : pts) { if (s + p <= cap) { s += p; cnt++; } else break; }
        return cnt;
    }
}`,
    pythonSolution: `def maxTicketsInSprint(pts, cap):
    s = cnt = 0
    for p in sorted(pts):
        if s + p <= cap: s += p; cnt += 1
        else: break
    return cnt`
  },
  {
    number: 3,
    title: 'Confluence Page Tree Ancestors',
    fnName: 'countCommonAncestors',
    description: 'In a Confluence space tree where <code>parent[i]</code> is page <code>i</code>\'s parent (<code>-1</code> for root), return how many pages (including themselves) are ancestors of BOTH page <code>u</code> and page <code>v</code>.',
    constraints: ['1 <= parent.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 0, 1, 1], u = 3, v = 4', output: '2' },
      { title: 'Test Case 2', input: 'parent = [-1, 0, 1, 2], u = 2, v = 3', output: '3' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 0], u = 1, v = 2', output: '1' },
      { title: 'Test Case 4', input: 'parent = [-1], u = 0, v = 0', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countCommonAncestors(int[] parent, int u, int v) {
        Set<Integer> anc = new HashSet<>();
        while (u != -1) { anc.add(u); u = parent[u]; }
        int cnt = 0;
        while (v != -1) { if (anc.contains(v)) cnt++; v = parent[v]; }
        return cnt;
    }
}`,
    pythonSolution: `def countCommonAncestors(parent, u, v):
    anc = set()
    while u != -1: anc.add(u); u = parent[u]
    cnt = 0
    while v != -1:
        if v in anc: cnt += 1
        v = parent[v]
    return cnt`
  },
  {
    number: 4,
    title: 'Router Wildcard Path Matcher',
    fnName: 'countMatchingRoutes',
    description: 'A service router has a pattern <code>pat</code> of slash-separated segments (where <code>"*"</code> matches any single segment) and candidate paths <code>paths</code>. Return how many paths match <code>pat</code>.',
    constraints: ['1 <= paths.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'pat = "/api/*/users", paths = ["/api/v1/users", "/api/v2/users", "/api/v1/posts", "/api/users"]', output: '2' },
      { title: 'Test Case 2', input: 'pat = "/*", paths = ["/a", "/b", "/a/b"]', output: '2' },
      { title: 'Test Case 3', input: 'pat = "/health", paths = ["/health"]', output: '1' },
      { title: 'Test Case 4', input: 'pat = "/a/*/b", paths = ["/a/x/c"]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countMatchingRoutes(String pat, String[] paths) {
        String[] pSeg = pat.split("/");
        int cnt = 0;
        for (String path : paths) {
            String[] s = path.split("/");
            if (s.length != pSeg.length) continue;
            boolean ok = true;
            for (int i = 0; i < s.length; i++) {
                if (!pSeg[i].equals("*") && !pSeg[i].equals(s[i])) { ok = false; break; }
            }
            if (ok) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countMatchingRoutes(pat, paths):
    pseg = pat.split('/')
    cnt = 0
    for path in paths:
        s = path.split('/')
        if len(s) == len(pseg) and all(p == '*' or p == x for p, x in zip(pseg, s)):
            cnt += 1
    return cnt`
  },
  {
    number: 5,
    title: 'Bitbucket PR Approval Quorum',
    fnName: 'countMergeReadyPrs',
    description: 'Each pull request has current approvals <code>approvals[i]</code>, required approvals <code>minReq</code>, and failing CI check count <code>failed[i]</code>. A PR is merge-ready if <code>approvals[i] >= minReq</code> AND <code>failed[i] == 0</code>. Count merge-ready PRs.',
    constraints: ['1 <= approvals.length == failed.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'approvals = [2, 3, 1, 2], failed = [0, 1, 0, 0], minReq = 2', output: '2' },
      { title: 'Test Case 2', input: 'approvals = [1, 1], failed = [0, 0], minReq = 2', output: '0' },
      { title: 'Test Case 3', input: 'approvals = [5], failed = [0], minReq = 3', output: '1' },
      { title: 'Test Case 4', input: 'approvals = [3], failed = [2], minReq = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countMergeReadyPrs(int[] approvals, int[] failed, int minReq) {
        int cnt = 0;
        for (int i = 0; i < approvals.length; i++) if (approvals[i] >= minReq && failed[i] == 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countMergeReadyPrs(approvals, failed, minReq):
    return sum(1 for a, f in zip(approvals, failed) if a >= minReq and f == 0)`
  },
  {
    number: 6,
    title: 'Team Vote Winner Tie-Break',
    fnName: 'winningOptionId',
    description: 'In a team poll, ballots cast option IDs <code>votes</code>. Return the option ID with the highest vote count (smallest ID on tie).',
    constraints: ['1 <= votes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'votes = [2, 1, 2, 3, 1]', output: '1' },
      { title: 'Test Case 2', input: 'votes = [5, 5, 5]', output: '5' },
      { title: 'Test Case 3', input: 'votes = [10, 20, 20]', output: '20' },
      { title: 'Test Case 4', input: 'votes = [7]', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int winningOptionId(int[] votes) {
        Map<Integer, Integer> freq = new HashMap<>();
        int bestId = votes[0], bestCnt = 0;
        for (int v : votes) {
            int c = freq.getOrDefault(v, 0) + 1;
            freq.put(v, c);
            if (c > bestCnt || (c == bestCnt && v < bestId)) { bestCnt = c; bestId = v; }
        }
        return bestId;
    }
}`,
    pythonSolution: `from collections import Counter
def winningOptionId(votes):
    cnt = Counter(votes)
    return min(cnt.keys(), key=lambda x: (-cnt[x], x))`
  },
  {
    number: 7,
    title: 'Trello Board Card Moves',
    fnName: 'countCardsInDoneColumn',
    description: 'There are <code>n</code> cards initially in column <code>0</code>. Given moves <code>moves</code> <code>[cardId, targetCol]</code>, return how many cards end up in column <code>2</code> ("Done") after all moves.',
    constraints: ['1 <= n <= 10^4', '0 <= moves.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, moves = [[0, 1], [1, 2], [0, 2], [2, 1]]', output: '2' },
      { title: 'Test Case 2', input: 'n = 3, moves = [[0, 2], [0, 1]]', output: '0' },
      { title: 'Test Case 3', input: 'n = 2, moves = []', output: '0' },
      { title: 'Test Case 4', input: 'n = 2, moves = [[0, 2], [1, 2]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countCardsInDoneColumn(int n, int[][] moves) {
        int[] col = new int[n];
        for (int[] m : moves) col[m[0]] = m[1];
        int done = 0;
        for (int c : col) if (c == 2) done++;
        return done;
    }
}`,
    pythonSolution: `def countCardsInDoneColumn(n, moves):
    col = [0] * n
    for card, tgt in moves: col[card] = tgt
    return col.count(2)`
  },
  {
    number: 8,
    title: 'Opsgenie On-Call Coverage Gaps',
    fnName: 'countUncoveredMinutes',
    description: 'An on-call day spans minutes <code>[0, totalMins)</code>. Given engineer shift intervals <code>shifts</code> <code>[start, end)</code>, merge overlapping shifts and return total uncovered minutes.',
    constraints: ['0 <= shifts.length <= 10^4', '1 <= totalMins <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'shifts = [[0, 60], [30, 120], [200, 300]], totalMins = 400', output: '180' },
      { title: 'Test Case 2', input: 'shifts = [[0, 100]], totalMins = 100', output: '0' },
      { title: 'Test Case 3', input: 'shifts = [], totalMins = 60', output: '60' },
      { title: 'Test Case 4', input: 'shifts = [[10, 20], [20, 30]], totalMins = 50', output: '30' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUncoveredMinutes(int[][] shifts, int totalMins) {
        if (shifts.length == 0) return totalMins;
        Arrays.sort(shifts, (a, b) -> Integer.compare(a[0], b[0]));
        int cov = 0, s = shifts[0][0], e = shifts[0][1];
        for (int i = 1; i < shifts.length; i++) {
            if (shifts[i][0] <= e) e = Math.max(e, shifts[i][1]);
            else { cov += e - s; s = shifts[i][0]; e = shifts[i][1]; }
        }
        cov += e - s;
        return totalMins - cov;
    }
}`,
    pythonSolution: `def countUncoveredMinutes(shifts, totalMins):
    if not shifts: return totalMins
    shifts.sort()
    cov = 0; s, e = shifts[0]
    for a, b in shifts[1:]:
        if a <= e: e = max(e, b)
        else: cov += e - s; s, e = a, b
    cov += e - s
    return totalMins - cov`
  },
  {
    number: 9,
    title: 'File-System Directory Size Sum',
    fnName: 'totalDirectoryBytes',
    description: 'Given file paths <code>paths</code>, file sizes <code>sizes</code>, and target folder prefix <code>dir</code> (e.g., <code>"/docs/"</code>), return the sum of sizes of all files whose path starts with <code>dir</code>.',
    constraints: ['1 <= paths.length == sizes.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'paths = ["/docs/a.md", "/docs/sub/b.md", "/src/c.ts"], sizes = [100, 250, 500], dir = "/docs/"', output: '350' },
      { title: 'Test Case 2', input: 'paths = ["/a.txt"], sizes = [50], dir = "/b/"', output: '0' },
      { title: 'Test Case 3', input: 'paths = ["/x/1", "/x/2"], sizes = [10, 20], dir = "/x/"', output: '30' },
      { title: 'Test Case 4', input: 'paths = ["/root"], sizes = [7], dir = "/"', output: '7' }
    ],
    javaSolution: `public class Solution {
    public static long totalDirectoryBytes(String[] paths, int[] sizes, String dir) {
        long s = 0;
        for (int i = 0; i < paths.length; i++) if (paths[i].startsWith(dir)) s += sizes[i];
        return s;
    }
}`,
    pythonSolution: `def totalDirectoryBytes(paths, sizes, dir):
    return sum(sz for p, sz in zip(paths, sizes) if p.startswith(dir))`
  },
  {
    number: 10,
    title: 'Jira Issue Cycle Time Median',
    fnName: 'twiceMedianCycleTime',
    description: 'Given issue resolution durations <code>days</code>, return <code>2 * median</code> as an exact integer.',
    constraints: ['1 <= days.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'days = [5, 1, 3]', output: '6' },
      { title: 'Test Case 2', input: 'days = [2, 4, 6, 8]', output: '10' },
      { title: 'Test Case 3', input: 'days = [10]', output: '20' },
      { title: 'Test Case 4', input: 'days = [1, 9]', output: '10' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long twiceMedianCycleTime(int[] days) {
        Arrays.sort(days);
        int n = days.length;
        return (n % 2 == 1) ? 2L * days[n / 2] : (long) days[n / 2 - 1] + days[n / 2];
    }
}`,
    pythonSolution: `def twiceMedianCycleTime(days):
    d = sorted(days); n = len(d)
    return 2 * d[n // 2] if n % 2 == 1 else d[n // 2 - 1] + d[n // 2]`
  },
  {
    number: 11,
    title: 'Statuspage Incident Cooldown',
    fnName: 'countSeparateIncidents',
    description: 'Given sorted error-burst timestamps <code>times</code>, consecutive bursts within <code>cooldown</code> seconds (<code>times[i] - times[i-1] <= cooldown</code>) merge into the same incident. Return total distinct incidents.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [10, 15, 30, 32, 60], cooldown = 10', output: '3' },
      { title: 'Test Case 2', input: 'times = [0, 5, 10], cooldown = 5', output: '1' },
      { title: 'Test Case 3', input: 'times = [1, 100], cooldown = 10', output: '2' },
      { title: 'Test Case 4', input: 'times = [42], cooldown = 0', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countSeparateIncidents(int[] times, int cooldown) {
        int inc = 1;
        for (int i = 1; i < times.length; i++) if (times[i] - times[i - 1] > cooldown) inc++;
        return inc;
    }
}`,
    pythonSolution: `def countSeparateIncidents(times, cooldown):
    return 1 + sum(1 for i in range(1, len(times)) if times[i] - times[i - 1] > cooldown)`
  },
  {
    number: 12,
    title: 'Bitbucket Branch Protection Rules',
    fnName: 'countProtectedBranches',
    description: 'Given branch names <code>branches</code>, a branch is protected if it equals <code>"main"</code> or starts with <code>"release/"</code>. Count protected branches.',
    constraints: ['1 <= branches.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'branches = ["main", "feat/ui", "release/1.0", "fix/bug"]', output: '2' },
      { title: 'Test Case 2', input: 'branches = ["dev", "test"]', output: '0' },
      { title: 'Test Case 3', input: 'branches = ["release/"]', output: '1' },
      { title: 'Test Case 4', input: 'branches = ["main"]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countProtectedBranches(String[] branches) {
        int cnt = 0;
        for (String b : branches) if (b.equals("main") || b.startsWith("release/")) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countProtectedBranches(branches):
    return sum(1 for b in branches if b == "main" or b.startswith("release/"))`
  },
  {
    number: 13,
    title: 'Confluence Mention Notification Set',
    fnName: 'countDistinctMentionedUsers',
    description: 'Given space-separated mention tokens <code>tokens</code> (some starting with <code>"@"</code>), return how many distinct users are mentioned.',
    constraints: ['1 <= tokens.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'tokens = ["@alice", "hi", "@bob", "@alice"]', output: '2' },
      { title: 'Test Case 2', input: 'tokens = ["hello", "world"]', output: '0' },
      { title: 'Test Case 3', input: 'tokens = ["@dev"]', output: '1' },
      { title: 'Test Case 4', input: 'tokens = ["@a", "@b", "@c"]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDistinctMentionedUsers(String[] tokens) {
        Set<String> s = new HashSet<>();
        for (String t : tokens) if (t.startsWith("@")) s.add(t);
        return s.size();
    }
}`,
    pythonSolution: `def countDistinctMentionedUsers(tokens):
    return len({t for t in tokens if t.startswith('@')})`
  },
  {
    number: 14,
    title: 'Jira Epic Dependency Topological Check',
    fnName: 'canCompleteAllEpics',
    description: 'Given <code>n</code> epics and directed blocker edges <code>blockers</code> <code>[a, b]</code> (<code>a</code> blocks <code>b</code>), return <code>true</code> if all epics can be completed (no dependency cycle), else <code>false</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, blockers = [[0, 1], [1, 2]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 2, blockers = [[0, 1], [1, 0]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 4, blockers = []', output: 'true' },
      { title: 'Test Case 4', input: 'n = 3, blockers = [[0, 1], [1, 2], [2, 0]]', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean canCompleteAllEpics(int n, int[][] blockers) {
        List<List<Integer>> g = new ArrayList<>();
        int[] ind = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] b : blockers) { g.get(b[0]).add(b[1]); ind[b[1]]++; }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (ind[i] == 0) q.add(i);
        int vis = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); vis++;
            for (int v : g.get(u)) if (--ind[v] == 0) q.add(v);
        }
        return vis == n;
    }
}`,
    pythonSolution: `from collections import deque
def canCompleteAllEpics(n, blockers):
    g = [[] for _ in range(n)]; ind = [0] * n
    for a, b in blockers: g[a].append(b); ind[b] += 1
    q = deque([i for i in range(n) if ind[i] == 0]); vis = 0
    while q:
        u = q.popleft(); vis += 1
        for v in g[u]:
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return vis == n`
  },
  {
    number: 15,
    title: 'Bitbucket Pipeline Cache Hit Rate',
    fnName: 'countCacheHits',
    description: 'Given a FIFO cache of capacity <code>cap</code> and build dependency keys <code>keys</code>, return total cache hits.',
    constraints: ['1 <= cap <= 10^4', '1 <= keys.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'keys = [1, 2, 1, 3, 2], cap = 2', output: '2' },
      { title: 'Test Case 2', input: 'keys = [1, 2, 1, 2], cap = 2', output: '2' },
      { title: 'Test Case 3', input: 'keys = [5, 5, 5], cap = 1', output: '2' },
      { title: 'Test Case 4', input: 'keys = [1, 2, 3], cap = 1', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countCacheHits(int[] keys, int cap) {
        Set<Integer> set = new HashSet<>();
        Queue<Integer> q = new ArrayDeque<>();
        int hits = 0;
        for (int k : keys) {
            if (set.contains(k)) hits++;
            else {
                if (q.size() == cap) set.remove(q.poll());
                set.add(k); q.add(k);
            }
        }
        return hits;
    }
}`,
    pythonSolution: `from collections import deque
def countCacheHits(keys, cap):
    s = set(); q = deque(); hits = 0
    for k in keys:
        if k in s: hits += 1
        else:
            if len(q) == cap: s.remove(q.popleft())
            s.add(k); q.append(k)
    return hits`
  },
  {
    number: 16,
    title: 'Feature Flag Rollout Percentage',
    fnName: 'countFlaggedTenants',
    description: 'Given tenant IDs <code>tenants</code>, a feature is enabled if <code>tenantId % 100 < pct</code>. Return count of enabled tenants.',
    constraints: ['1 <= tenants.length <= 10^5', '0 <= pct <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'tenants = [105, 250, 319, 490], pct = 20', output: '2' },
      { title: 'Test Case 2', input: 'tenants = [10, 20], pct = 0', output: '0' },
      { title: 'Test Case 3', input: 'tenants = [99], pct = 100', output: '1' },
      { title: 'Test Case 4', input: 'tenants = [100, 200], pct = 1', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countFlaggedTenants(int[] tenants, int pct) {
        int cnt = 0;
        for (int t : tenants) if ((t % 100) < pct) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countFlaggedTenants(tenants, pct):
    return sum(1 for t in tenants if (t % 100) < pct)`
  },
  {
    number: 17,
    title: 'Token Bucket Burst Capacity',
    fnName: 'countThrottledRequests',
    description: 'A token bucket starts with <code>cap</code> tokens and refills <code>rate</code> tokens/sec (capped at <code>cap</code>). Given sorted request timestamps <code>times</code> (1 token per request), return total THROTTLED (rejected) requests.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [0, 0, 0, 1, 1], cap = 2, rate = 1', output: '2' },
      { title: 'Test Case 2', input: 'times = [0, 2, 4], cap = 1, rate = 1', output: '0' },
      { title: 'Test Case 3', input: 'times = [0, 0, 0], cap = 1, rate = 10', output: '2' },
      { title: 'Test Case 4', input: 'times = [5], cap = 1, rate = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countThrottledRequests(int[] times, int cap, int rate) {
        long tok = cap; int last = times[0], drop = 0;
        for (int t : times) {
            tok = Math.min(cap, tok + (long)(t - last) * rate);
            last = t;
            if (tok > 0) tok--; else drop++;
        }
        return drop;
    }
}`,
    pythonSolution: `def countThrottledRequests(times, cap, rate):
    tok, last, drop = cap, times[0], 0
    for t in times:
        tok = min(cap, tok + (t - last) * rate); last = t
        if tok > 0: tok -= 1
        else: drop += 1
    return drop`
  },
  {
    number: 18,
    title: 'Jira Board WIP Limit Violations',
    fnName: 'countWipBreaches',
    description: 'Given column card counts <code>counts</code> and WIP limit <code>wip</code>, count how many columns strictly exceed <code>wip</code>.',
    constraints: ['1 <= counts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'counts = [3, 6, 5, 8], wip = 5', output: '2' },
      { title: 'Test Case 2', input: 'counts = [1, 2, 3], wip = 5', output: '0' },
      { title: 'Test Case 3', input: 'counts = [10], wip = 9', output: '1' },
      { title: 'Test Case 4', input: 'counts = [5, 5], wip = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countWipBreaches(int[] counts, int wip) {
        int bad = 0;
        for (int c : counts) if (c > wip) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countWipBreaches(counts, wip):
    return sum(1 for c in counts if c > wip)`
  },
  {
    number: 19,
    title: 'Confluence Search Snippet Overlap',
    fnName: 'totalHighlightedChars',
    description: 'Given sorted or unsorted highlight intervals <code>spans</code> <code>[start, end)</code> in a document, merge overlaps and return total highlighted characters.',
    constraints: ['0 <= spans.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'spans = [[1, 5], [3, 8], [10, 12]]', output: '9' },
      { title: 'Test Case 2', input: 'spans = [[0, 4], [4, 6]]', output: '6' },
      { title: 'Test Case 3', input: 'spans = []', output: '0' },
      { title: 'Test Case 4', input: 'spans = [[2, 5]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long totalHighlightedChars(int[][] spans) {
        if (spans.length == 0) return 0;
        Arrays.sort(spans, (a, b) -> Integer.compare(a[0], b[0]));
        long tot = 0; int s = spans[0][0], e = spans[0][1];
        for (int i = 1; i < spans.length; i++) {
            if (spans[i][0] <= e) e = Math.max(e, spans[i][1]);
            else { tot += e - s; s = spans[i][0]; e = spans[i][1]; }
        }
        return tot + (e - s);
    }
}`,
    pythonSolution: `def totalHighlightedChars(spans):
    if not spans: return 0
    spans.sort()
    tot = 0; s, e = spans[0]
    for a, b in spans[1:]:
        if a <= e: e = max(e, b)
        else: tot += e - s; s, e = a, b
    return tot + (e - s)`
  },
  {
    number: 20,
    title: 'Bitbucket Repo Collaborator Graph',
    fnName: 'countTeamComponents',
    description: 'Given <code>n</code> engineers (0..n-1) and co-authored PR pairs <code>pairs</code> <code>[u, v]</code>, return the number of connected collaboration groups.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, pairs = [[0, 1], [1, 2], [3, 4]]', output: '2' },
      { title: 'Test Case 2', input: 'n = 3, pairs = []', output: '3' },
      { title: 'Test Case 3', input: 'n = 3, pairs = [[0, 1], [1, 2]]', output: '1' },
      { title: 'Test Case 4', input: 'n = 1, pairs = []', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countTeamComponents(int n, int[][] pairs) {
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        int comp = n;
        for (int[] e : pairs) {
            int ru = find(p, e[0]), rv = find(p, e[1]);
            if (ru != rv) { p[ru] = rv; comp--; }
        }
        return comp;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def countTeamComponents(n, pairs):
    p = list(range(n))
    def find(x):
        while p[x] != x: p[x] = p[p[x]]; x = p[x]
        return x
    comp = n
    for u, v in pairs:
        ru, rv = find(u), find(v)
        if ru != rv: p[ru] = rv; comp -= 1
    return comp`
  },
  {
    number: 21,
    title: 'CI Build Queue Wait Sum',
    fnName: 'minTotalBuildWait',
    description: 'Given build durations <code>durs</code> executed on 1 runner, schedule shortest-job-first to minimize total completion time. Return sum of completion times.',
    constraints: ['1 <= durs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'durs = [4, 2, 1]', output: '11' },
      { title: 'Test Case 2', input: 'durs = [5]', output: '5' },
      { title: 'Test Case 3', input: 'durs = [3, 3, 3]', output: '18' },
      { title: 'Test Case 4', input: 'durs = [1, 5]', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minTotalBuildWait(int[] durs) {
        Arrays.sort(durs);
        long cur = 0, tot = 0;
        for (int d : durs) { cur += d; tot += cur; }
        return tot;
    }
}`,
    pythonSolution: `def minTotalBuildWait(durs):
    cur = tot = 0
    for d in sorted(durs): cur += d; tot += cur
    return tot`
  },
  {
    number: 22,
    title: 'Tenant Quota Tier Upgrade',
    fnName: 'countNeedUpgrade',
    description: 'Given tenant seat counts <code>seats</code> and plan limit <code>maxSeats</code>, count how many tenants exceed <code>maxSeats</code>.',
    constraints: ['1 <= seats.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'seats = [5, 10, 15, 20], maxSeats = 10', output: '2' },
      { title: 'Test Case 2', input: 'seats = [1, 2], maxSeats = 5', output: '0' },
      { title: 'Test Case 3', input: 'seats = [11], maxSeats = 10', output: '1' },
      { title: 'Test Case 4', input: 'seats = [10], maxSeats = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countNeedUpgrade(int[] seats, int maxSeats) {
        int cnt = 0;
        for (int s : seats) if (s > maxSeats) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countNeedUpgrade(seats, maxSeats):
    return sum(1 for s in seats if s > maxSeats)`
  },
  {
    number: 23,
    title: 'Webhook Retry Queue Drain',
    fnName: 'secondsToDrainQueue',
    description: 'A webhook queue has <code>q</code> events. Each second <code>arr[i]</code> new events arrive (if <code>i < len(arr)</code>) and up to <code>rate</code> events are delivered. After all seconds in <code>arr</code> finish, if any events remain, continue delivering <code>rate</code> per second until 0. Return total seconds elapsed.',
    constraints: ['1 <= arr.length <= 10^5', '1 <= rate <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [10, 0, 5], rate = 4', output: '4' },
      { title: 'Test Case 2', input: 'arr = [3, 3, 3], rate = 3', output: '3' },
      { title: 'Test Case 3', input: 'arr = [0, 0], rate = 5', output: '2' },
      { title: 'Test Case 4', input: 'arr = [9], rate = 4', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static long secondsToDrainQueue(int[] arr, int rate) {
        long q = 0;
        for (int x : arr) q = Math.max(0L, q + x - rate);
        return arr.length + (q + rate - 1) / rate;
    }
}`,
    pythonSolution: `def secondsToDrainQueue(arr, rate):
    q = 0
    for x in arr: q = max(0, q + x - rate)
    return len(arr) + (q + rate - 1) // rate`
  },
  {
    number: 24,
    title: 'Permission Inheritance Bitmask',
    fnName: 'effectivePermissionMask',
    description: 'Given a chain of group permission masks <code>masks</code> from root to leaf, a user\'s effective permission is the bitwise OR of all masks. Return the effective mask.',
    constraints: ['1 <= masks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'masks = [1, 2, 4]', output: '7' },
      { title: 'Test Case 2', input: 'masks = [5, 3]', output: '7' },
      { title: 'Test Case 3', input: 'masks = [0, 0]', output: '0' },
      { title: 'Test Case 4', input: 'masks = [8]', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static int effectivePermissionMask(int[] masks) {
        int m = 0;
        for (int x : masks) m |= x;
        return m;
    }
}`,
    pythonSolution: `def effectivePermissionMask(masks):
    m = 0
    for x in masks: m |= x
    return m`
  },
  {
    number: 25,
    title: 'Jira Ticket Label Filter',
    fnName: 'countMatchingTickets',
    description: 'Each ticket has label mask <code>labels[i]</code>. Count tickets having ALL bits in <code>reqMask</code> and NONE of the bits in <code>exclMask</code>.',
    constraints: ['1 <= labels.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'labels = [7, 5, 3, 13], reqMask = 5, exclMask = 2', output: '2' },
      { title: 'Test Case 2', input: 'labels = [3, 7], reqMask = 1, exclMask = 2', output: '0' },
      { title: 'Test Case 3', input: 'labels = [0, 1], reqMask = 0, exclMask = 0', output: '2' },
      { title: 'Test Case 4', input: 'labels = [4], reqMask = 4, exclMask = 8', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countMatchingTickets(int[] labels, int reqMask, int exclMask) {
        int cnt = 0;
        for (int l : labels) if ((l & reqMask) == reqMask && (l & exclMask) == 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countMatchingTickets(labels, reqMask, exclMask):
    return sum(1 for l in labels if (l & reqMask) == reqMask and (l & exclMask) == 0)`
  },
  {
    number: 26,
    title: 'Sprint Velocity Rolling Average',
    fnName: 'maxKSprintVelocity',
    description: 'Given completed story points per sprint <code>pts</code>, return the maximum sum of any <code>k</code> consecutive sprints.',
    constraints: ['1 <= k <= pts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pts = [20, 35, 15, 40, 25], k = 2', output: '65' },
      { title: 'Test Case 2', input: 'pts = [10, 10, 10], k = 3', output: '30' },
      { title: 'Test Case 3', input: 'pts = [5, 50, 5], k = 1', output: '50' },
      { title: 'Test Case 4', input: 'pts = [12, 18], k = 2', output: '30' }
    ],
    javaSolution: `public class Solution {
    public static long maxKSprintVelocity(int[] pts, int k) {
        long cur = 0;
        for (int i = 0; i < k; i++) cur += pts[i];
        long best = cur;
        for (int i = k; i < pts.length; i++) { cur += pts[i] - pts[i - k]; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxKSprintVelocity(pts, k):
    cur = sum(pts[:k]); best = cur
    for i in range(k, len(pts)):
        cur += pts[i] - pts[i - k]; best = max(best, cur)
    return best`
  },
  {
    number: 27,
    title: 'Code Review Load Balancer',
    fnName: 'minMaxReviewerLoad',
    description: 'Given PR sizes <code>sizes</code> (assigned greedily in order to the lighter of <code>2</code> reviewers), return the maximum load assigned to either reviewer.',
    constraints: ['1 <= sizes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sizes = [10, 5, 8, 3]', output: '13' },
      { title: 'Test Case 2', input: 'sizes = [4, 4]', output: '4' },
      { title: 'Test Case 3', input: 'sizes = [20]', output: '20' },
      { title: 'Test Case 4', input: 'sizes = [3, 3, 3]', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static long minMaxReviewerLoad(int[] sizes) {
        long a = 0, b = 0;
        for (int s : sizes) { if (a <= b) a += s; else b += s; }
        return Math.max(a, b);
    }
}`,
    pythonSolution: `def minMaxReviewerLoad(sizes):
    a = b = 0
    for s in sizes:
        if a <= b: a += s
        else: b += s
    return max(a, b)`
  },
  {
    number: 28,
    title: 'Confluence Markdown Heading Depth',
    fnName: 'maxHeadingLevel',
    description: 'Given markdown lines <code>lines</code>, a heading line starts with 1..6 <code>#</code> characters followed by a space. Return the deepest (largest) heading level found (<code>0</code> if none).',
    constraints: ['1 <= lines.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'lines = ["# Title", "## Sub", "text", "#### Deep"]', output: '4' },
      { title: 'Test Case 2', input: 'lines = ["plain", "text"]', output: '0' },
      { title: 'Test Case 3', input: 'lines = ["#hashtag"]', output: '0' },
      { title: 'Test Case 4', input: 'lines = ["###### H6"]', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static int maxHeadingLevel(String[] lines) {
        int best = 0;
        for (String l : lines) {
            int h = 0;
            while (h < l.length() && h < 6 && l.charAt(h) == '#') h++;
            if (h >= 1 && h < l.length() && l.charAt(h) == ' ') best = Math.max(best, h);
        }
        return best;
    }
}`,
    pythonSolution: `def maxHeadingLevel(lines):
    best = 0
    for l in lines:
        h = 0
        while h < len(l) and h < 6 and l[h] == '#': h += 1
        if 1 <= h < len(l) and l[h] == ' ': best = max(best, h)
    return best`
  },
  {
    number: 29,
    title: 'Service Mesh Circuit Open Duration',
    fnName: 'totalOutageSeconds',
    description: 'Given sorted event pairs <code>[time, state]</code> (<code>0</code> = down, <code>1</code> = up) starting at <code>0</code> in up state and ending at <code>endTime</code>, return total seconds spent in down state.',
    constraints: ['0 <= events.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'events = [[10, 0], [25, 1], [40, 0]], endTime = 50', output: '25' },
      { title: 'Test Case 2', input: 'events = [[5, 1]], endTime = 20', output: '0' },
      { title: 'Test Case 3', input: 'events = [], endTime = 100', output: '0' },
      { title: 'Test Case 4', input: 'events = [[0, 0], [10, 1]], endTime = 10', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static int totalOutageSeconds(int[][] events, int endTime) {
        int state = 1, lastT = 0, down = 0;
        for (int[] e : events) {
            if (state == 0) down += e[0] - lastT;
            state = e[1]; lastT = e[0];
        }
        if (state == 0) down += endTime - lastT;
        return down;
    }
}`,
    pythonSolution: `def totalOutageSeconds(events, endTime):
    state, last_t, down = 1, 0, 0
    for t, st in events:
        if state == 0: down += t - last_t
        state, last_t = st, t
    if state == 0: down += endTime - last_t
    return down`
  },
  {
    number: 30,
    title: 'Sprint Task Pair Synergy',
    fnName: 'countSynergyPairs',
    description: 'Given developer skill ratings <code>skills</code> and target pair sum <code>target</code>, count pairs <code>(i, j)</code> with <code>i < j</code> and <code>skills[i] + skills[j] == target</code>.',
    constraints: ['1 <= skills.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'skills = [1, 5, 7, -1, 5], target = 6', output: '3' },
      { title: 'Test Case 2', input: 'skills = [1, 2, 3], target = 10', output: '0' },
      { title: 'Test Case 3', input: 'skills = [3, 3, 3], target = 6', output: '3' },
      { title: 'Test Case 4', input: 'skills = [5], target = 10', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countSynergyPairs(int[] skills, int target) {
        Map<Integer, Integer> m = new HashMap<>();
        long cnt = 0;
        for (int s : skills) { cnt += m.getOrDefault(target - s, 0); m.put(s, m.getOrDefault(s, 0) + 1); }
        return cnt;
    }
}`,
    pythonSolution: `def countSynergyPairs(skills, target):
    m = {}; cnt = 0
    for s in skills: cnt += m.get(target - s, 0); m[s] = m.get(s, 0) + 1
    return cnt`
  },
  {
    number: 31,
    title: 'Bitbucket Commit Diff Line Balance',
    fnName: 'netCodebaseGrowth',
    description: 'Given commits <code>[addedLines, deletedLines]</code> in <code>commits</code>, return net line change across all commits.',
    constraints: ['1 <= commits.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'commits = [[100, 20], [50, 80], [10, 0]]', output: '60' },
      { title: 'Test Case 2', input: 'commits = [[10, 10]]', output: '0' },
      { title: 'Test Case 3', input: 'commits = [[0, 50]]', output: '-50' },
      { title: 'Test Case 4', input: 'commits = [[25, 5]]', output: '20' }
    ],
    javaSolution: `public class Solution {
    public static long netCodebaseGrowth(int[][] commits) {
        long net = 0;
        for (int[] c : commits) net += c[0] - c[1];
        return net;
    }
}`,
    pythonSolution: `def netCodebaseGrowth(commits):
    return sum(a - d for a, d in commits)`
  },
  {
    number: 32,
    title: 'Opsgenie Escalation Policy Steps',
    fnName: 'minMinutesToAck',
    description: 'An alert escalates through responders with response delays <code>delays</code> (stop as soon as responder <code>k</code> acknowledges, 0-indexed). Return total wait before responder <code>k</code> is reached.',
    constraints: ['0 <= k < delays.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'delays = [5, 10, 15, 20], k = 2', output: '15' },
      { title: 'Test Case 2', input: 'delays = [5, 10], k = 0', output: '0' },
      { title: 'Test Case 3', input: 'delays = [3, 3, 3], k = 2', output: '6' },
      { title: 'Test Case 4', input: 'delays = [10], k = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minMinutesToAck(int[] delays, int k) {
        long s = 0;
        for (int i = 0; i < k; i++) s += delays[i];
        return s;
    }
}`,
    pythonSolution: `def minMinutesToAck(delays, k):
    return sum(delays[:k])`
  },
  {
    number: 33,
    title: 'Distributed Lock Contention Count',
    fnName: 'maxOverlappingLocks',
    description: 'Given lock hold intervals <code>locks</code> <code>[acquire, release)</code> on different keys? No, all on the same key if overlapping? Simply return the maximum number of intervals active at the same moment.',
    constraints: ['1 <= locks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'locks = [[1, 4], [2, 5], [4, 6]]', output: '2' },
      { title: 'Test Case 2', input: 'locks = [[0, 10], [1, 9], [2, 8]]', output: '3' },
      { title: 'Test Case 3', input: 'locks = [[1, 2], [2, 3]]', output: '1' },
      { title: 'Test Case 4', input: 'locks = [[5, 6]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxOverlappingLocks(int[][] locks) {
        int n = locks.length;
        int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = locks[i][0]; e[i] = locks[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def maxOverlappingLocks(locks):
    s = sorted(l[0] for l in locks); e = sorted(l[1] for l in locks)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 34,
    title: 'Jira Ticket Key Parser',
    fnName: 'countProjectTickets',
    description: 'Given Jira ticket keys <code>keys</code> (like <code>"ENG-123"</code>) and project prefix <code>proj</code> (like <code>"ENG"</code>), count tickets belonging to <code>proj + "-"</code>.',
    constraints: ['1 <= keys.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'keys = ["ENG-1", "ENG-42", "ENG2-5", "OPS-9"], proj = "ENG"', output: '2' },
      { title: 'Test Case 2', input: 'keys = ["OPS-1"], proj = "ENG"', output: '0' },
      { title: 'Test Case 3', input: 'keys = ["PM-10"], proj = "PM"', output: '1' },
      { title: 'Test Case 4', input: 'keys = ["A-1", "A-2"], proj = "A"', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countProjectTickets(String[] keys, String proj) {
        String p = proj + "-"; int cnt = 0;
        for (String k : keys) if (k.startsWith(p)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countProjectTickets(keys, proj):
    p = proj + "-"
    return sum(1 for k in keys if k.startswith(p))`
  },
  {
    number: 35,
    title: 'Bitbucket Build Matrix Combinations',
    fnName: 'totalTestMatrixJobs',
    description: 'A CI matrix runs across <code>osCount</code> OSes, <code>langCount</code> language versions, and <code>dbCount</code> databases. Return total jobs.',
    constraints: ['0 <= osCount, langCount, dbCount <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'osCount = 3, langCount = 4, dbCount = 2', output: '24' },
      { title: 'Test Case 2', input: 'osCount = 1, langCount = 1, dbCount = 1', output: '1' },
      { title: 'Test Case 3', input: 'osCount = 0, langCount = 5, dbCount = 2', output: '0' },
      { title: 'Test Case 4', input: 'osCount = 2, langCount = 3, dbCount = 5', output: '30' }
    ],
    javaSolution: `public class Solution {
    public static long totalTestMatrixJobs(long osCount, long langCount, long dbCount) {
        return osCount * langCount * dbCount;
    }
}`,
    pythonSolution: `def totalTestMatrixJobs(osCount, langCount, dbCount):
    return osCount * langCount * dbCount`
  },
  {
    number: 36,
    title: 'Cloud Shard Rebalance Moves',
    fnName: 'minShardMovesToBalance',
    description: 'Given tenant counts across <code>n</code> shards <code>counts</code> (sum divisible by <code>n</code>), return minimum single-tenant moves to equalize all shards.',
    constraints: ['1 <= counts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'counts = [1, 5, 3]', output: '2' },
      { title: 'Test Case 2', input: 'counts = [4, 4, 4]', output: '0' },
      { title: 'Test Case 3', input: 'counts = [10, 0]', output: '5' },
      { title: 'Test Case 4', input: 'counts = [8]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minShardMovesToBalance(int[] counts) {
        long s = 0; for (int c : counts) s += c;
        long avg = s / counts.length, moves = 0;
        for (int c : counts) if (c > avg) moves += c - avg;
        return moves;
    }
}`,
    pythonSolution: `def minShardMovesToBalance(counts):
    avg = sum(counts) // len(counts)
    return sum(c - avg for c in counts if c > avg)`
  },
  {
    number: 37,
    title: 'Confluence Version History Size',
    fnName: 'countNonEmptyEdits',
    description: 'Given revision byte deltas <code>deltas</code>, count how many revisions actually changed size (<code>deltas[i] != 0</code>).',
    constraints: ['1 <= deltas.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'deltas = [10, 0, -5, 0, 3]', output: '3' },
      { title: 'Test Case 2', input: 'deltas = [0, 0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'deltas = [-1]', output: '1' },
      { title: 'Test Case 4', input: 'deltas = [1, 2, 3]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countNonEmptyEdits(int[] deltas) {
        int cnt = 0;
        for (int d : deltas) if (d != 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countNonEmptyEdits(deltas):
    return sum(1 for d in deltas if d != 0)`
  },
  {
    number: 38,
    title: 'Service Dependency Max Fan-Out',
    fnName: 'maxServiceFanOut',
    description: 'Given <code>n</code> microservices (0..n-1) and directed call edges <code>calls</code> <code>[u, v]</code>, return the maximum out-degree of any service.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, calls = [[0, 1], [0, 2], [0, 3], [1, 2]]', output: '3' },
      { title: 'Test Case 2', input: 'n = 3, calls = []', output: '0' },
      { title: 'Test Case 3', input: 'n = 2, calls = [[0, 1], [1, 0]]', output: '1' },
      { title: 'Test Case 4', input: 'n = 1, calls = []', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxServiceFanOut(int n, int[][] calls) {
        int[] out = new int[n];
        for (int[] c : calls) out[c[0]]++;
        int best = 0;
        for (int x : out) best = Math.max(best, x);
        return best;
    }
}`,
    pythonSolution: `def maxServiceFanOut(n, calls):
    out = [0] * n
    for u, _ in calls: out[u] += 1
    return max(out)`
  },
  {
    number: 39,
    title: 'Jira Burndown Remaining Points',
    fnName: 'remainingStoryPoints',
    description: 'A sprint starts with <code>total</code> story points and daily completed points are <code>done</code>. Return remaining points (clamped at 0).',
    constraints: ['1 <= done.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'total = 50, done = [10, 15, 8]', output: '17' },
      { title: 'Test Case 2', input: 'total = 20, done = [15, 10]', output: '0' },
      { title: 'Test Case 3', input: 'total = 30, done = [0, 0]', output: '30' },
      { title: 'Test Case 4', input: 'total = 10, done = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long remainingStoryPoints(long total, int[] done) {
        long s = 0; for (int d : done) s += d;
        return Math.max(0L, total - s);
    }
}`,
    pythonSolution: `def remainingStoryPoints(total, done):
    return max(0, total - sum(done))`
  },
  {
    number: 40,
    title: 'API Response Time SLA Percentile',
    fnName: 'countWithinLatencyTarget',
    description: 'Given response times <code>latencies</code>, return how many are <code>&lt;= targetMs</code>.',
    constraints: ['1 <= latencies.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'latencies = [50, 120, 99, 100], targetMs = 100', output: '3' },
      { title: 'Test Case 2', input: 'latencies = [200, 300], targetMs = 100', output: '0' },
      { title: 'Test Case 3', input: 'latencies = [10], targetMs = 10', output: '1' },
      { title: 'Test Case 4', input: 'latencies = [1, 2, 3], targetMs = 5', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countWithinLatencyTarget(int[] latencies, int targetMs) {
        int cnt = 0;
        for (int l : latencies) if (l <= targetMs) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countWithinLatencyTarget(latencies, targetMs):
    return sum(1 for l in latencies if l <= targetMs)`
  },
  {
    number: 41,
    title: 'Sprint Carryover Ticket Count',
    fnName: 'countIncompleteTickets',
    description: 'Given ticket statuses <code>statuses</code> (<code>0</code> = ToDo, <code>1</code> = InProgress, <code>2</code> = Done), return how many tickets are NOT Done.',
    constraints: ['1 <= statuses.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'statuses = [2, 0, 1, 2, 0]', output: '3' },
      { title: 'Test Case 2', input: 'statuses = [2, 2, 2]', output: '0' },
      { title: 'Test Case 3', input: 'statuses = [0]', output: '1' },
      { title: 'Test Case 4', input: 'statuses = [1, 1]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countIncompleteTickets(int[] statuses) {
        int cnt = 0;
        for (int s : statuses) if (s != 2) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countIncompleteTickets(statuses):
    return sum(1 for s in statuses if s != 2)`
  },
  {
    number: 42,
    title: 'Duplicate File Path Normalization',
    fnName: 'countUniqueNormalizedPaths',
    description: 'Given paths <code>paths</code> containing redundant trailing slashes (e.g. <code>"/a/b/"</code> -> <code>"/a/b"</code>, keeping <code>"/"</code> intact), return number of distinct normalized paths.',
    constraints: ['1 <= paths.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'paths = ["/a/b/", "/a/b", "/c/"]', output: '2' },
      { title: 'Test Case 2', input: 'paths = ["/", "//"]', output: '1' },
      { title: 'Test Case 3', input: 'paths = ["/x", "/y", "/z"]', output: '3' },
      { title: 'Test Case 4', input: 'paths = ["/docs///"]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUniqueNormalizedPaths(String[] paths) {
        Set<String> s = new HashSet<>();
        for (String p : paths) {
            int end = p.length();
            while (end > 1 && p.charAt(end - 1) == '/') end--;
            s.add(p.substring(0, end));
        }
        return s.size();
    }
}`,
    pythonSolution: `def countUniqueNormalizedPaths(paths):
    return len({p.rstrip('/') or '/' for p in paths})`
  },
  {
    number: 43,
    title: 'Release Train Deployment Windows',
    fnName: 'maxDeploymentsInWindow',
    description: 'Given sorted deployment timestamps <code>times</code>, return maximum deployments inside any closed window <code>[t, t + span]</code>.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [1, 3, 5, 10, 11], span = 4', output: '3' },
      { title: 'Test Case 2', input: 'times = [0, 10, 20], span = 5', output: '1' },
      { title: 'Test Case 3', input: 'times = [2, 2, 2], span = 0', output: '3' },
      { title: 'Test Case 4', input: 'times = [5], span = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxDeploymentsInWindow(int[] times, int span) {
        int l = 0, best = 0;
        for (int r = 0; r < times.length; r++) {
            while (times[r] - times[l] > span) l++;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def maxDeploymentsInWindow(times, span):
    l = best = 0
    for r, t in enumerate(times):
        while t - times[l] > span: l += 1
        best = max(best, r - l + 1)
    return best`
  },
  {
    number: 44,
    title: 'Bitbucket Merge Conflict File Count',
    fnName: 'countConflictFiles',
    description: 'Given file IDs modified in Branch A <code>filesA</code> and Branch B <code>filesB</code>, return how many distinct files were modified in BOTH branches.',
    constraints: ['0 <= filesA.length, filesB.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'filesA = [1, 2, 3, 2], filesB = [2, 3, 4]', output: '2' },
      { title: 'Test Case 2', input: 'filesA = [1, 2], filesB = [3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'filesA = [], filesB = [1]', output: '0' },
      { title: 'Test Case 4', input: 'filesA = [5], filesB = [5, 5]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countConflictFiles(int[] filesA, int[] filesB) {
        Set<Integer> a = new HashSet<>(), b = new HashSet<>();
        for (int x : filesA) a.add(x);
        for (int x : filesB) if (a.contains(x)) b.add(x);
        return b.size();
    }
}`,
    pythonSolution: `def countConflictFiles(filesA, filesB):
    return len(set(filesA) & set(filesB))`
  },
  {
    number: 45,
    title: 'Team Capacity PTO Deduction',
    fnName: 'netSprintCapacityHours',
    description: 'Each of <code>n</code> engineers has <code>baseHours</code> capacity, minus their PTO hours in <code>pto</code> (clamped at 0 per engineer). Return total team capacity hours.',
    constraints: ['1 <= pto.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pto = [0, 8, 50], baseHours = 40', output: '72' },
      { title: 'Test Case 2', input: 'pto = [40, 40], baseHours = 40', output: '0' },
      { title: 'Test Case 3', input: 'pto = [10], baseHours = 30', output: '20' },
      { title: 'Test Case 4', input: 'pto = [0, 0], baseHours = 20', output: '40' }
    ],
    javaSolution: `public class Solution {
    public static long netSprintCapacityHours(int[] pto, int baseHours) {
        long tot = 0;
        for (int p : pto) tot += Math.max(0, baseHours - p);
        return tot;
    }
}`,
    pythonSolution: `def netSprintCapacityHours(pto, baseHours):
    return sum(max(0, baseHours - p) for p in pto)`
  },
  {
    number: 46,
    title: 'Log Stream Deduplication Window',
    fnName: 'countUniqueLogWindows',
    description: 'Given integer log hashes <code>hashes</code>, drop any log if it equals the immediately preceding log hash. Return count of kept logs.',
    constraints: ['1 <= hashes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'hashes = [1, 1, 2, 2, 2, 1]', output: '3' },
      { title: 'Test Case 2', input: 'hashes = [5, 5, 5]', output: '1' },
      { title: 'Test Case 3', input: 'hashes = [1, 2, 3]', output: '3' },
      { title: 'Test Case 4', input: 'hashes = [9]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countUniqueLogWindows(int[] hashes) {
        int kept = 1;
        for (int i = 1; i < hashes.length; i++) if (hashes[i] != hashes[i - 1]) kept++;
        return kept;
    }
}`,
    pythonSolution: `def countUniqueLogWindows(hashes):
    return 1 + sum(1 for i in range(1, len(hashes)) if hashes[i] != hashes[i - 1])`
  },
  {
    number: 47,
    title: 'DP Non-Adjacent Sprint Releases',
    fnName: 'maxReleaseImpact',
    description: 'Given release impact scores <code>scores</code>, you cannot ship major releases in consecutive weeks. Return maximum total impact.',
    constraints: ['1 <= scores.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'scores = [3, 2, 5, 10, 7]', output: '15' },
      { title: 'Test Case 2', input: 'scores = [10, 20, 15]', output: '25' },
      { title: 'Test Case 3', input: 'scores = [8]', output: '8' },
      { title: 'Test Case 4', input: 'scores = [1, 9, 1]', output: '9' }
    ],
    javaSolution: `public class Solution {
    public static long maxReleaseImpact(int[] scores) {
        long p2 = 0, p1 = 0;
        for (int s : scores) { long c = Math.max(p1, p2 + s); p2 = p1; p1 = c; }
        return p1;
    }
}`,
    pythonSolution: `def maxReleaseImpact(scores):
    p2 = p1 = 0
    for s in scores: p2, p1 = p1, max(p1, p2 + s)
    return p1`
  },
  {
    number: 48,
    title: 'Bitbucket Webhook Signature Match',
    fnName: 'countValidWebhooks',
    description: 'Given expected signature strings <code>expected</code> and received signatures <code>received</code>, return how many match exactly.',
    constraints: ['1 <= expected.length == received.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'expected = ["abc", "def", "ghi"], received = ["abc", "xyz", "ghi"]', output: '2' },
      { title: 'Test Case 2', input: 'expected = ["a"], received = ["b"]', output: '0' },
      { title: 'Test Case 3', input: 'expected = ["ok"], received = ["ok"]', output: '1' },
      { title: 'Test Case 4', input: 'expected = ["1", "2"], received = ["1", "2"]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countValidWebhooks(String[] expected, String[] received) {
        int ok = 0;
        for (int i = 0; i < expected.length; i++) if (expected[i].equals(received[i])) ok++;
        return ok;
    }
}`,
    pythonSolution: `def countValidWebhooks(expected, received):
    return sum(1 for a, b in zip(expected, received) if a == b)`
  },
  {
    number: 49,
    title: 'Tenant Tier Downgrade Count',
    fnName: 'countDowngradedTenants',
    description: 'Given previous seat counts <code>prev</code> and current seat counts <code>cur</code>, count tenants that shrank (<code>cur[i] < prev[i]</code>).',
    constraints: ['1 <= prev.length == cur.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prev = [10, 20, 30], cur = [8, 25, 29]', output: '2' },
      { title: 'Test Case 2', input: 'prev = [5, 5], cur = [5, 10]', output: '0' },
      { title: 'Test Case 3', input: 'prev = [10], cur = [9]', output: '1' },
      { title: 'Test Case 4', input: 'prev = [0], cur = [0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDowngradedTenants(int[] prev, int[] cur) {
        int cnt = 0;
        for (int i = 0; i < prev.length; i++) if (cur[i] < prev[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countDowngradedTenants(prev, cur):
    return sum(1 for p, c in zip(prev, cur) if c < p)`
  },
  {
    number: 50,
    title: 'Microservice Shortest Hop Latency',
    fnName: 'minServiceCallLatency',
    description: 'Given <code>n</code> microservices (0..n-1) and directed weighted RPC edges <code>edges</code> <code>[u, v, ms]</code>, return minimum total latency from gateway <code>0</code> to service <code>n - 1</code>, or <code>-1</code> if unreachable.',
    constraints: ['2 <= n <= 500', '0 <= edges.length <= 2000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0, 1, 5], [1, 3, 10], [0, 2, 3], [2, 3, 4]]', output: '7' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1, 10]]', output: '-1' },
      { title: 'Test Case 3', input: 'n = 2, edges = [[0, 1, 15]]', output: '15' },
      { title: 'Test Case 4', input: 'n = 3, edges = [[0, 2, 10], [0, 1, 2], [1, 2, 3]]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minServiceCallLatency(int n, int[][] edges) {
        List<List<int[]>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) g.get(e[0]).add(new int[]{e[1], e[2]});
        long[] dist = new long[n]; Arrays.fill(dist, Long.MAX_VALUE); dist[0] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        pq.add(new long[]{0, 0});
        while (!pq.isEmpty()) {
            long[] cur = pq.poll(); int u = (int) cur[1];
            if (cur[0] > dist[u]) continue;
            for (int[] e : g.get(u)) if (dist[u] + e[1] < dist[e[0]]) {
                dist[e[0]] = dist[u] + e[1]; pq.add(new long[]{dist[e[0]], e[0]});
            }
        }
        return dist[n - 1] == Long.MAX_VALUE ? -1 : dist[n - 1];
    }
}`,
    pythonSolution: `import heapq
def minServiceCallLatency(n, edges):
    g = [[] for _ in range(n)]
    for u, v, w in edges: g[u].append((v, w))
    dist = [float('inf')] * n; dist[0] = 0; pq = [(0, 0)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in g[u]:
            if d + w < dist[v]: dist[v] = d + w; heapq.heappush(pq, (dist[v], v))
    return -1 if dist[n - 1] == float('inf') else dist[n - 1]`
  }
];
