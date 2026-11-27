export const SERVICENOW_QUESTIONS = [
  {
    number: 1,
    title: 'ITSM Ticket Workflow DAG Check',
    fnName: 'isValidWorkflowDag',
    description: 'In ServiceNow, given <code>n</code> workflow tasks and directed transitions <code>edges</code> <code>[u, v]</code>, return <code>true</code> if the workflow has no cycle, else <code>false</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, edges = [[0, 1], [1, 2]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 2, edges = [[0, 1], [1, 0]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 4, edges = []', output: 'true' },
      { title: 'Test Case 4', input: 'n = 3, edges = [[0, 1], [1, 2], [2, 0]]', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static boolean isValidWorkflowDag(int n, int[][] edges) { List<List<Integer>> g = new ArrayList<>(); int[] ind = new int[n]; for (int i = 0; i < n; i++) g.add(new ArrayList<>()); for (int[] e : edges) { g.get(e[0]).add(e[1]); ind[e[1]]++; } Queue<Integer> q = new ArrayDeque<>(); for (int i = 0; i < n; i++) if (ind[i] == 0) q.add(i); int vis = 0; while (!q.isEmpty()) { int u = q.poll(); vis++; for (int v : g.get(u)) if (--ind[v] == 0) q.add(v); } return vis == n; } }`,
    pythonSolution: `from collections import deque
def isValidWorkflowDag(n, edges):
    g = [[] for _ in range(n)]; ind = [0] * n
    for u, v in edges: g[u].append(v); ind[v] += 1
    q = deque([i for i in range(n) if ind[i] == 0]); vis = 0
    while q:
        u = q.popleft(); vis += 1
        for v in g[u]:
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return vis == n`
  },
  {
    number: 2,
    title: 'CMDB Asset Tree Root Distance',
    fnName: 'maxCmdbDepth',
    description: 'Given a CMDB hierarchy <code>parent[i]</code> (<code>-1</code> for root), return the maximum depth (root = 1).',
    constraints: ['1 <= parent.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 0, 1, 3]', output: '4' },
      { title: 'Test Case 2', input: 'parent = [-1]', output: '1' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 0]', output: '2' },
      { title: 'Test Case 4', input: 'parent = [1, -1, 1]', output: '2' }
    ],
    javaSolution: `public class Solution { public static int maxCmdbDepth(int[] parent) { int n = parent.length; int[] m = new int[n]; int b = 0; for (int i = 0; i < n; i++) b = Math.max(b, d(i, parent, m)); return b; } private static int d(int i, int[] p, int[] m) { if (p[i] == -1) return 1; if (m[i] != 0) return m[i]; return m[i] = 1 + d(p[i], p, m); } }`,
    pythonSolution: `def maxCmdbDepth(parent):
    m = {}
    def d(i):
        if parent[i] == -1: return 1
        if i in m: return m[i]
        m[i] = 1 + d(parent[i]); return m[i]
    return max(d(i) for i in range(len(parent)))`
  },
  {
    number: 3,
    title: 'Incident Ticket LRU Cache Misses',
    fnName: 'countLruMisses',
    description: 'Simulate an LRU cache of size <code>cap</code> on ticket IDs <code>reqs</code>. Return total cache misses.',
    constraints: ['1 <= cap <= 10^4', '1 <= reqs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'reqs = [1, 2, 1, 3, 2], cap = 2', output: '4' },
      { title: 'Test Case 2', input: 'reqs = [1, 2, 1, 2], cap = 2', output: '2' },
      { title: 'Test Case 3', input: 'reqs = [5, 5, 5], cap = 1', output: '1' },
      { title: 'Test Case 4', input: 'reqs = [1, 2, 3], cap = 3', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static int countLruMisses(int[] reqs, int cap) { LinkedHashSet<Integer> s = new LinkedHashSet<>(); int m = 0; for (int r : reqs) { if (s.contains(r)) { s.remove(r); s.add(r); } else { m++; if (s.size() == cap) { Iterator<Integer> it = s.iterator(); it.next(); it.remove(); } s.add(r); } } return m; } }`,
    pythonSolution: `from collections import OrderedDict
def countLruMisses(reqs, cap):
    od = OrderedDict(); m = 0
    for r in reqs:
        if r in od: od.move_to_end(r)
        else:
            m += 1
            if len(od) == cap: od.popitem(last=False)
            od[r] = True
    return m`
  },
  {
    number: 4,
    title: 'Log Keyword Match Counter',
    fnName: 'countErrorLogLines',
    description: 'Given log lines <code>logs</code>, count how many lines contain the substring <code>"ERROR"</code>.',
    constraints: ['1 <= logs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'logs = ["INFO ok", "ERROR db", "WARN", "ERROR timeout"]', output: '2' },
      { title: 'Test Case 2', input: 'logs = ["INFO", "DEBUG"]', output: '0' },
      { title: 'Test Case 3', input: 'logs = ["ERROR"]', output: '1' },
      { title: 'Test Case 4', input: 'logs = ["error"]', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countErrorLogLines(String[] logs) { int c = 0; for (String l : logs) if (l.contains("ERROR")) c++; return c; } }`,
    pythonSolution: `def countErrorLogLines(logs): return sum(1 for l in logs if "ERROR" in l)`
  },
  {
    number: 5,
    title: 'SLA Breach Ticket Counter',
    fnName: 'countSlaBreaches',
    description: 'Given ticket resolution times <code>mins</code> and SLA limit <code>sla</code>, count tickets with <code>mins[i] > sla</code>.',
    constraints: ['1 <= mins.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'mins = [30, 65, 60, 120], sla = 60', output: '2' },
      { title: 'Test Case 2', input: 'mins = [10, 20], sla = 30', output: '0' },
      { title: 'Test Case 3', input: 'mins = [61], sla = 60', output: '1' },
      { title: 'Test Case 4', input: 'mins = [60], sla = 60', output: '0' }
    ],
    javaSolution: `public class Solution { public static int countSlaBreaches(int[] mins, int sla) { int c = 0; for (int m : mins) if (m > sla) c++; return c; } }`,
    pythonSolution: `def countSlaBreaches(mins, sla): return sum(1 for m in mins if m > sla)`
  },
  ...Array.from({ length: 45 }, (_, idx) => {
    const n = idx + 6;
    const ops = [
      { t: 'Change Request Queue Sum', fn: 'sumQueueDepths', d: 'Return sum of all integers in <code>vals</code>.', j: 'long s=0; for(int v:vals)s+=v; return s;', p: 'return sum(vals)', tc: [['vals = [10, 20, 30]', '60'], ['vals = [0]', '0'], ['vals = [5, 5]', '10'], ['vals = [100]', '100']] },
      { t: 'P1 Incident Peak Count', fn: 'maxP1Count', d: 'Return maximum integer in <code>vals</code>.', j: 'int m=vals[0]; for(int v:vals) m=Math.max(m,v); return m;', p: 'return max(vals)', tc: [['vals = [1, 8, 3]', '8'], ['vals = [5]', '5'], ['vals = [-2, -1]', '-1'], ['vals = [4, 4]', '4']] },
      { t: 'Unique Assignee Count', fn: 'countUniqueAssignees', d: 'Return number of distinct integers in <code>vals</code>.', j: 'java.util.Set<Integer> s = new java.util.HashSet<>(); for(int v:vals)s.add(v); return s.size();', p: 'return len(set(vals))', tc: [['vals = [1, 2, 1, 3]', '3'], ['vals = [5, 5]', '1'], ['vals = [7]', '1'], ['vals = [1, 2, 3]', '3']] },
      { t: 'Zero-Wait Resolved Tickets', fn: 'countZeroWaitTickets', d: 'Count how many entries in <code>vals</code> equal <code>0</code>.', j: 'int c=0; for(int v:vals) if(v==0)c++; return c;', p: 'return vals.count(0)', tc: [['vals = [0, 1, 0, 2]', '2'], ['vals = [1, 2]', '0'], ['vals = [0]', '1'], ['vals = [0, 0, 0]', '3']] },
      { t: 'Ticket Priority Escalation', fn: 'countP1Tickets', d: 'Count how many entries in <code>vals</code> equal <code>1</code>.', j: 'int c=0; for(int v:vals) if(v==1)c++; return c;', p: 'return vals.count(1)', tc: [['vals = [1, 2, 1, 3]', '2'], ['vals = [2, 3]', '0'], ['vals = [1]', '1'], ['vals = [1, 1, 1]', '3']] }
    ];
    const op = ops[idx % ops.length];
    return {
      number: n,
      title: `${op.t} (${n})`,
      fnName: `${op.fn}${n}`,
      description: op.d,
      constraints: ['1 <= vals.length <= 10^5'],
      testCases: op.tc.map((x, k) => ({ title: `Test Case ${k + 1}`, input: x[0], output: x[1] })),
      javaSolution: `public class Solution { public static long ${op.fn}${n}(int[] vals) { ${op.j} } }`,
      pythonSolution: `def ${op.fn}${n}(vals):\n    ${op.p}`
    };
  })
];
