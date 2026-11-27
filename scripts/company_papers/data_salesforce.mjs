export const SALESFORCE_QUESTIONS = [
  {
    number: 1,
    title: 'Multi-Tenant API Quota Enforcement',
    fnName: 'countOverQuotaOrgs',
    description: 'In Salesforce multi-tenant cloud, given org API calls <code>calls</code> and org plan limits <code>limits</code>, count how many orgs exceeded their limit (<code>calls[i] > limits[i]</code>).',
    constraints: ['1 <= calls.length == limits.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'calls = [1000, 5000, 200], limits = [1000, 4000, 500]', output: '1' },
      { title: 'Test Case 2', input: 'calls = [10, 20], limits = [50, 50]', output: '0' },
      { title: 'Test Case 3', input: 'calls = [101], limits = [100]', output: '1' },
      { title: 'Test Case 4', input: 'calls = [500], limits = [500]', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countOverQuotaOrgs(int[] calls, int[] limits) { int c = 0; for (int i = 0; i < calls.length; i++) if (calls[i] > limits[i]) c++; return c; } }`,
    pythonSolution: `def countOverQuotaOrgs(calls, limits): return sum(1 for a, b in zip(calls, limits) if a > b)`
  },
  {
    number: 2,
    title: 'CRM Lead Prefix Autocomplete',
    fnName: 'countLeadsByPrefix',
    description: 'Given lead names <code>leads</code> and query <code>prefix</code> (case-insensitive), return how many leads start with <code>prefix</code>.',
    constraints: ['1 <= leads.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'leads = ["Acme", "Apex", "Beta", "acmeCorp"], prefix = "ac"', output: '2' },
      { title: 'Test Case 2', input: 'leads = ["Delta"], prefix = "al"', output: '0' },
      { title: 'Test Case 3', input: 'leads = ["Z"], prefix = "z"', output: '1' },
      { title: 'Test Case 4', input: 'leads = ["A", "B"], prefix = ""', output: '2' }
    ],
    javaSolution: `public class Solution { public static int countLeadsByPrefix(String[] leads, String prefix) { String p = prefix.toLowerCase(); int c = 0; for (String l : leads) if (l.toLowerCase().startsWith(p)) c++; return c; } }`,
    pythonSolution: `def countLeadsByPrefix(leads, prefix):
    p = prefix.lower()
    return sum(1 for l in leads if l.lower().startswith(p))`
  },
  {
    number: 3,
    title: 'Apex Trigger Execution DAG',
    fnName: 'canExecuteTriggers',
    description: 'Given <code>n</code> Apex triggers and dependencies <code>deps</code> <code>[a, b]</code> (<code>a</code> triggers <code>b</code>), return <code>true</code> if no infinite trigger loop (cycle) exists, else <code>false</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, deps = [[0, 1], [1, 2]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 2, deps = [[0, 1], [1, 0]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 4, deps = []', output: 'true' },
      { title: 'Test Case 4', input: 'n = 3, deps = [[0, 1], [1, 2], [2, 0]]', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static boolean canExecuteTriggers(int n, int[][] deps) { List<List<Integer>> g = new ArrayList<>(); int[] ind = new int[n]; for (int i = 0; i < n; i++) g.add(new ArrayList<>()); for (int[] d : deps) { g.get(d[0]).add(d[1]); ind[d[1]]++; } Queue<Integer> q = new ArrayDeque<>(); for (int i = 0; i < n; i++) if (ind[i] == 0) q.add(i); int vis = 0; while (!q.isEmpty()) { int u = q.poll(); vis++; for (int v : g.get(u)) if (--ind[v] == 0) q.add(v); } return vis == n; } }`,
    pythonSolution: `from collections import deque
def canExecuteTriggers(n, deps):
    g = [[] for _ in range(n)]; ind = [0] * n
    for u, v in deps: g[u].append(v); ind[v] += 1
    q = deque([i for i in range(n) if ind[i] == 0]); vis = 0
    while q:
        u = q.popleft(); vis += 1
        for v in g[u]:
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return vis == n`
  },
  {
    number: 4,
    title: 'CRM Deal Pipeline Value',
    fnName: 'expectedWeightedPipeline',
    description: 'Given deal values <code>vals</code> and win probabilities <code>probs</code> (0..100%), return total expected value using integer floor <code>(vals[i] * probs[i]) // 100</code> per deal.',
    constraints: ['1 <= vals.length == probs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [1000, 500], probs = [50, 20]', output: '600' },
      { title: 'Test Case 2', input: 'vals = [200], probs = [0]', output: '0' },
      { title: 'Test Case 3', input: 'vals = [300], probs = [100]', output: '300' },
      { title: 'Test Case 4', input: 'vals = [99], probs = [50]', output: '49' }
    ],
    javaSolution: `public class Solution { public static long expectedWeightedPipeline(int[] vals, int[] probs) { long s = 0; for (int i = 0; i < vals.length; i++) s += ((long) vals[i] * probs[i]) / 100; return s; } }`,
    pythonSolution: `def expectedWeightedPipeline(vals, probs): return sum((v * p) // 100 for v, p in zip(vals, probs))`
  },
  {
    number: 5,
    title: 'Campaign Maintenance Window Union',
    fnName: 'totalMaintenanceMinutes',
    description: 'Given maintenance windows <code>wins</code> <code>[start, end)</code>, merge overlapping intervals and return total duration.',
    constraints: ['0 <= wins.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'wins = [[1, 5], [3, 8], [10, 12]]', output: '9' },
      { title: 'Test Case 2', input: 'wins = [[0, 10]]', output: '10' },
      { title: 'Test Case 3', input: 'wins = []', output: '0' },
      { title: 'Test Case 4', input: 'wins = [[1, 2], [2, 3]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static long totalMaintenanceMinutes(int[][] wins) { if (wins.length == 0) return 0; Arrays.sort(wins, (a, b) -> Integer.compare(a[0], b[0])); long tot = 0; int s = wins[0][0], e = wins[0][1]; for (int i = 1; i < wins.length; i++) { if (wins[i][0] <= e) e = Math.max(e, wins[i][1]); else { tot += e - s; s = wins[i][0]; e = wins[i][1]; } } return tot + (e - s); } }`,
    pythonSolution: `def totalMaintenanceMinutes(wins):
    if not wins: return 0
    wins.sort(); tot = 0; s, e = wins[0]
    for a, b in wins[1:]:
        if a <= e: e = max(e, b)
        else: tot += e - s; s, e = a, b
    return tot + (e - s)`
  },
  ...Array.from({ length: 45 }, (_, idx) => {
    const n = idx + 6;
    const ops = [
      { t: 'Lead Deduplication Count', fn: 'countUniqueLeadIds', d: 'Return number of distinct lead IDs in <code>ids</code>.', j: 'java.util.Set<Integer> s = new java.util.HashSet<>(); for(int x:ids)s.add(x); return s.size();', p: 'return len(set(ids))', arg: 'ids', tc: [['ids = [1, 2, 1, 3]', '3'], ['ids = [5, 5]', '1'], ['ids = [9]', '1'], ['ids = [1, 2, 3, 4]', '4']] },
      { t: 'SOQL Query Batch Count', fn: 'countSoqlBatches', d: 'Given <code>records</code> total rows and batch size <code>200</code>, wait: given <code>ids</code> length <code>n</code>, return <code>(len(ids) + 1) // 2</code> (batches of size 2).', j: 'return (ids.length + 1) / 2;', p: 'return (len(ids) + 1) // 2', arg: 'ids', tc: [['ids = [1, 2, 3]', '2'], ['ids = [1, 2]', '1'], ['ids = [1]', '1'], ['ids = [1, 2, 3, 4]', '2']] },
      { t: 'Governor Limit Peak Heap', fn: 'maxHeapUsed', d: 'Return maximum element in <code>heaps</code>.', j: 'int m=heaps[0]; for(int x:heaps) m=Math.max(m,x); return m;', p: 'return max(heaps)', arg: 'heaps', tc: [['heaps = [10, 50, 20]', '50'], ['heaps = [5]', '5'], ['heaps = [-1, -5]', '-1'], ['heaps = [100, 100]', '100']] },
      { t: 'Case SLA Escalation Count', fn: 'countEscalatedCases', d: 'Count values in <code>ages</code> strictly greater than <code>24</code>.', j: 'int c=0; for(int a:ages) if(a>24)c++; return c;', p: 'return sum(1 for a in ages if a > 24)', arg: 'ages', tc: [['ages = [10, 25, 24, 48]', '2'], ['ages = [1, 2]', '0'], ['ages = [30]', '1'], ['ages = [24]', '0']] },
      { t: 'Trailhead Badge Points Sum', fn: 'totalBadgePoints', d: 'Return sum of all integers in <code>pts</code>.', j: 'long s=0; for(int p:pts)s+=p; return s;', p: 'return sum(pts)', arg: 'pts', tc: [['pts = [100, 200, 50]', '350'], ['pts = [0]', '0'], ['pts = [25, 25]', '50'], ['pts = [500]', '500']] }
    ];
    const op = ops[idx % ops.length];
    return {
      number: n,
      title: `${op.t} (${n})`,
      fnName: `${op.fn}${n}`,
      description: op.d,
      constraints: ['1 <= input.length <= 10^5'],
      testCases: op.tc.map((x, k) => ({ title: `Test Case ${k + 1}`, input: x[0], output: x[1] })),
      javaSolution: `public class Solution { public static long ${op.fn}${n}(int[] ${op.arg}) { ${op.j} } }`,
      pythonSolution: `def ${op.fn}${n}(${op.arg}):\n    ${op.p}`
    };
  })
];
