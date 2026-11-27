export const IBM_P2 = [
  {
    number: 31,
    title: 'MQ Message Dead-Letter Retry Simulator',
    fnName: 'countDeadLetterMessages',
    description: 'An IBM MQ broker processes message retry counts <code>retries</code>. Each message is retried up to <code>maxRetries</code> times; if <code>retries[i] &gt; maxRetries</code>, it moves to the Dead-Letter Queue (DLQ). Return total messages routed to DLQ.',
    constraints: ['1 <= retries.length <= 10^5', '0 <= maxRetries <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'retries = [0, 3, 4, 2, 5], maxRetries = 3', output: '2' },
      { title: 'Test Case 2', input: 'retries = [1, 2, 3], maxRetries = 3', output: '0' },
      { title: 'Test Case 3', input: 'retries = [1], maxRetries = 0', output: '1' },
      { title: 'Test Case 4', input: 'retries = [0, 0], maxRetries = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDeadLetterMessages(int[] retries, int maxRetries) {
        int dlq = 0;
        for (int r : retries) if (r > maxRetries) dlq++;
        return dlq;
    }
}`,
    pythonSolution: `def countDeadLetterMessages(retries, maxRetries):
    return sum(1 for r in retries if r > maxRetries)`
  },
  {
    number: 32,
    title: 'Kubernetes Pod Affinity Placement',
    fnName: 'countPlacedPods',
    description: 'A cluster has <code>nodes</code> worker nodes each with CPU capacity <code>nodeCpu[j]</code>. Pod requests <code>podCpu</code> arrive in order; each pod is placed on the first node with enough remaining CPU. Return how many pods are placed.',
    constraints: ['1 <= nodeCpu.length, podCpu.length <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'nodeCpu = [8, 8], podCpu = [5, 4, 3, 5]', output: '3' },
      { title: 'Test Case 2', input: 'nodeCpu = [4], podCpu = [5, 2]', output: '1' },
      { title: 'Test Case 3', input: 'nodeCpu = [10, 10], podCpu = [10, 10]', output: '2' },
      { title: 'Test Case 4', input: 'nodeCpu = [2], podCpu = [3, 4]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countPlacedPods(int[] nodeCpu, int[] podCpu) {
        int[] rem = nodeCpu.clone();
        int placed = 0;
        for (int p : podCpu) {
            for (int j = 0; j < rem.length; j++) {
                if (rem[j] >= p) { rem[j] -= p; placed++; break; }
            }
        }
        return placed;
    }
}`,
    pythonSolution: `def countPlacedPods(nodeCpu, podCpu):
    rem = nodeCpu[:]
    placed = 0
    for p in podCpu:
        for j in range(len(rem)):
            if rem[j] >= p: rem[j] -= p; placed += 1; break
    return placed`
  },
  {
    number: 33,
    title: 'COBOL Signed Trailing-Overpunch Unpacker',
    fnName: 'unpackZonedDecimals',
    description: 'Mainframe zoned decimal strings end with a digit or a sign-encoded char: <code>\'+\'</code> or <code>\'-\'</code> prefix? Here simplified: strings end with <code>\'C\'</code> (positive) or <code>\'D\'</code> (negative), preceded by digits. Parse an array of such strings and return their integer sum.',
    constraints: ['1 <= records.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'records = ["100C", "050D", "025C"]', output: '75' },
      { title: 'Test Case 2', input: 'records = ["500D", "500C"]', output: '0' },
      { title: 'Test Case 3', input: 'records = ["000C"]', output: '0' },
      { title: 'Test Case 4', input: 'records = ["123D"]', output: '-123' }
    ],
    javaSolution: `public class Solution {
    public static long unpackZonedDecimals(String[] records) {
        long sum = 0;
        for (String r : records) {
            int val = Integer.parseInt(r.substring(0, r.length() - 1));
            sum += r.endsWith("D") ? -val : val;
        }
        return sum;
    }
}`,
    pythonSolution: `def unpackZonedDecimals(records):
    return sum((-int(r[:-1]) if r[-1] == 'D' else int(r[:-1])) for r in records)`
  },
  {
    number: 34,
    title: 'Distributed Trace Unaccounted Span Gap',
    fnName: 'unaccountedTraceTime',
    description: 'A parent RPC span runs from <code>0</code> to <code>totalMs</code>. Child spans <code>children</code> <code>[start, end]</code> execute inside it (possibly overlapping). Return total milliseconds within <code>[0, totalMs]</code> where NO child span is active.',
    constraints: ['1 <= totalMs <= 10^6', '0 <= children.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'totalMs = 100, children = [[10, 30], [20, 50], [70, 90]]', output: '40' },
      { title: 'Test Case 2', input: 'totalMs = 50, children = [[0, 50]]', output: '0' },
      { title: 'Test Case 3', input: 'totalMs = 50, children = []', output: '50' },
      { title: 'Test Case 4', input: 'totalMs = 20, children = [[5, 10], [10, 15]]', output: '10' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int unaccountedTraceTime(int totalMs, int[][] children) {
        if (children.length == 0) return totalMs;
        Arrays.sort(children, (a, b) -> Integer.compare(a[0], b[0]));
        int covered = 0, curS = children[0][0], curE = children[0][1];
        for (int i = 1; i < children.length; i++) {
            if (children[i][0] <= curE) curE = Math.max(curE, children[i][1]);
            else { covered += curE - curS; curS = children[i][0]; curE = children[i][1]; }
        }
        covered += curE - curS;
        return totalMs - covered;
    }
}`,
    pythonSolution: `def unaccountedTraceTime(totalMs, children):
    if not children: return totalMs
    ch = sorted(children)
    covered, s, e = 0, ch[0][0], ch[0][1]
    for a, b in ch[1:]:
        if a <= e: e = max(e, b)
        else: covered += e - s; s, e = a, b
    return totalMs - (covered + e - s)`
  },
  {
    number: 35,
    title: 'TLS Certificate Chain Validity Window',
    fnName: 'commonCertValidityWindow',
    description: 'A TLS handshake validates <code>n</code> certificates in a chain, each valid during <code>[notBefore, notAfter]</code>. Return the number of days in the intersection where ALL certificates are simultaneously valid (0 if disjoint).',
    constraints: ['1 <= certs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'certs = [[1, 100], [20, 80], [50, 120]]', output: '30' },
      { title: 'Test Case 2', input: 'certs = [[1, 10], [20, 30]]', output: '0' },
      { title: 'Test Case 3', input: 'certs = [[10, 50]]', output: '40' },
      { title: 'Test Case 4', input: 'certs = [[5, 15], [15, 25]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int commonCertValidityWindow(int[][] certs) {
        int lo = certs[0][0], hi = certs[0][1];
        for (int[] c : certs) { lo = Math.max(lo, c[0]); hi = Math.min(hi, c[1]); }
        return Math.max(0, hi - lo);
    }
}`,
    pythonSolution: `def commonCertValidityWindow(certs):
    lo = max(c[0] for c in certs)
    hi = min(c[1] for c in certs)
    return max(0, hi - lo)`
  },
  {
    number: 36,
    title: 'Event-Bus Partition Rebalance Moves',
    fnName: 'minPartitionMoves',
    description: 'A Kafka/Event-Bus cluster has <code>n</code> brokers currently holding <code>counts[i]</code> partitions. To balance the cluster, every broker must hold either <code>floor(avg)</code> or <code>ceil(avg)</code> partitions. Return the minimum number of partition moves needed.',
    constraints: ['1 <= counts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'counts = [10, 0, 0, 2]', output: '7' },
      { title: 'Test Case 2', input: 'counts = [4, 4, 4]', output: '0' },
      { title: 'Test Case 3', input: 'counts = [5, 4]', output: '0' },
      { title: 'Test Case 4', input: 'counts = [7, 1, 1]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static long minPartitionMoves(int[] counts) {
        long sum = 0; for (int c : counts) sum += c;
        int n = counts.length;
        long lo = sum / n, hi = (sum + n - 1) / n;
        long excess = 0, deficit = 0;
        for (int c : counts) {
            if (c > hi) excess += c - hi;
            if (c < lo) deficit += lo - c;
        }
        return Math.max(excess, deficit);
    }
}`,
    pythonSolution: `def minPartitionMoves(counts):
    n, s = len(counts), sum(counts)
    lo, hi = s // n, (s + n - 1) // n
    excess = sum(c - hi for c in counts if c > hi)
    deficit = sum(lo - c for c in counts if c < lo)
    return max(excess, deficit)`
  },
  {
    number: 37,
    title: 'Container Image CVE Gate Score',
    fnName: 'countBlockedImages',
    description: 'A CI/CD security gate blocks container images if they have ANY <code>"CRITICAL"</code> CVE OR more than 3 <code>"HIGH"</code> CVEs. Given parallel arrays <code>criticalCnt</code> and <code>highCnt</code>, return how many images are blocked.',
    constraints: ['1 <= criticalCnt.length == highCnt.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'criticalCnt = [0, 1, 0, 0], highCnt = [2, 0, 4, 3]', output: '2' },
      { title: 'Test Case 2', input: 'criticalCnt = [0, 0], highCnt = [0, 3]', output: '0' },
      { title: 'Test Case 3', input: 'criticalCnt = [2], highCnt = [10]', output: '1' },
      { title: 'Test Case 4', input: 'criticalCnt = [0], highCnt = [4]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countBlockedImages(int[] criticalCnt, int[] highCnt) {
        int blocked = 0;
        for (int i = 0; i < criticalCnt.length; i++) if (criticalCnt[i] > 0 || highCnt[i] > 3) blocked++;
        return blocked;
    }
}`,
    pythonSolution: `def countBlockedImages(criticalCnt, highCnt):
    return sum(1 for c, h in zip(criticalCnt, highCnt) if c > 0 or h > 3)`
  },
  {
    number: 38,
    title: 'Canary Rollout Error-Budget Rollback',
    fnName: 'shouldRollbackCanary',
    description: 'During a canary deployment, requests are logged as <code>1</code> (success) or <code>0</code> (error). Trigger rollback (return <code>true</code>) if ANY contiguous window of <code>w</code> requests has more than <code>maxErr</code> errors.',
    constraints: ['1 <= w <= results.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'results = [1, 1, 0, 0, 1, 0], w = 3, maxErr = 1', output: 'true' },
      { title: 'Test Case 2', input: 'results = [1, 0, 1, 1, 0], w = 3, maxErr = 1', output: 'false' },
      { title: 'Test Case 3', input: 'results = [0, 0], w = 2, maxErr = 2', output: 'false' },
      { title: 'Test Case 4', input: 'results = [0], w = 1, maxErr = 0', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean shouldRollbackCanary(int[] results, int w, int maxErr) {
        int errs = 0;
        for (int i = 0; i < results.length; i++) {
            if (results[i] == 0) errs++;
            if (i >= w && results[i - w] == 0) errs--;
            if (i >= w - 1 && errs > maxErr) return true;
        }
        return false;
    }
}`,
    pythonSolution: `def shouldRollbackCanary(results, w, maxErr):
    errs = 0
    for i, r in enumerate(results):
        if r == 0: errs += 1
        if i >= w and results[i - w] == 0: errs -= 1
        if i >= w - 1 and errs > maxErr: return True
    return False`
  },
  {
    number: 39,
    title: 'DB2 Bufferpool Hit-Ratio Percentage',
    fnName: 'bufferpoolHitPercent',
    description: 'Given logical reads <code>logicalReads</code> and physical disk reads <code>physicalReads</code> (<code>0 &lt;= physicalReads &lt;= logicalReads</code>), return the integer-floor bufferpool hit ratio percentage <code>((logical - physical) * 100) // logical</code> (100 if logical == 0).',
    constraints: ['0 <= physicalReads <= logicalReads <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'logicalReads = 1000, physicalReads = 50', output: '95' },
      { title: 'Test Case 2', input: 'logicalReads = 200, physicalReads = 200', output: '0' },
      { title: 'Test Case 3', input: 'logicalReads = 0, physicalReads = 0', output: '100' },
      { title: 'Test Case 4', input: 'logicalReads = 3, physicalReads = 1', output: '66' }
    ],
    javaSolution: `public class Solution {
    public static long bufferpoolHitPercent(long logicalReads, long physicalReads) {
        if (logicalReads == 0) return 100;
        return ((logicalReads - physicalReads) * 100) / logicalReads;
    }
}`,
    pythonSolution: `def bufferpoolHitPercent(logicalReads, physicalReads):
    return 100 if logicalReads == 0 else ((logicalReads - physicalReads) * 100) // logicalReads`
  },
  {
    number: 40,
    title: 'IAM Policy Least-Privilege Pruner',
    fnName: 'countUnusedPermissions',
    description: 'A service is granted permissions <code>granted</code>, and audit logs record actually used permissions <code>used</code>. Return the number of granted permissions that were never used.',
    constraints: ['1 <= granted.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'granted = ["s3:Get", "s3:Put", "ec2:Run", "iam:Admin"], used = ["s3:Get", "ec2:Run"]', output: '2' },
      { title: 'Test Case 2', input: 'granted = ["read", "write"], used = ["read", "write", "delete"]', output: '0' },
      { title: 'Test Case 3', input: 'granted = ["a", "b"], used = []', output: '2' },
      { title: 'Test Case 4', input: 'granted = ["x"], used = ["x"]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUnusedPermissions(String[] granted, String[] used) {
        Set<String> u = new HashSet<>(Arrays.asList(used));
        int unused = 0;
        for (String g : granted) if (!u.contains(g)) unused++;
        return unused;
    }
}`,
    pythonSolution: `def countUnusedPermissions(granted, used):
    u = set(used)
    return sum(1 for g in granted if g not in u)`
  },
  {
    number: 41,
    title: 'API Token Bucket Refill Simulator',
    fnName: 'countAcceptedApiCalls',
    description: 'A token bucket starts full with <code>cap</code> tokens and refills <code>refillPerSec</code> tokens at the start of each second (capped at <code>cap</code>). Given requests per second <code>reqs</code> (1 token per request), each second processes as many requests as available tokens (dropping excess). Return total accepted requests.',
    constraints: ['1 <= reqs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cap = 10, refillPerSec = 3, reqs = [8, 6, 4]', output: '16' },
      { title: 'Test Case 2', input: 'cap = 5, refillPerSec = 5, reqs = [5, 5, 5]', output: '15' },
      { title: 'Test Case 3', input: 'cap = 4, refillPerSec = 1, reqs = [10, 10]', output: '5' },
      { title: 'Test Case 4', input: 'cap = 10, refillPerSec = 2, reqs = [0, 0, 10]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long countAcceptedApiCalls(int cap, int refillPerSec, int[] reqs) {
        long tokens = cap, accepted = 0;
        for (int i = 0; i < reqs.length; i++) {
            if (i > 0) tokens = Math.min(cap, tokens + refillPerSec);
            long take = Math.min(tokens, reqs[i]);
            accepted += take;
            tokens -= take;
        }
        return accepted;
    }
}`,
    pythonSolution: `def countAcceptedApiCalls(cap, refillPerSec, reqs):
    tokens, accepted = cap, 0
    for i, r in enumerate(reqs):
        if i > 0: tokens = min(cap, tokens + refillPerSec)
        take = min(tokens, r)
        accepted += take; tokens -= take
    return accepted`
  },
  {
    number: 42,
    title: 'Batch JCL Step Return-Code Gate',
    fnName: 'stepsExecutedBeforeAbort',
    description: 'A mainframe JCL job runs steps with return codes <code>rc</code> and max allowed codes <code>maxRc</code>. Steps run in order; if <code>rc[i] &gt; maxRc[i]</code>, that step runs and then the job aborts immediately. Return total steps executed.',
    constraints: ['1 <= rc.length == maxRc.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'rc = [0, 4, 8, 0], maxRc = [4, 4, 4, 4]', output: '3' },
      { title: 'Test Case 2', input: 'rc = [0, 0, 0], maxRc = [0, 0, 0]', output: '3' },
      { title: 'Test Case 3', input: 'rc = [12, 0], maxRc = [4, 4]', output: '1' },
      { title: 'Test Case 4', input: 'rc = [4], maxRc = [4]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int stepsExecutedBeforeAbort(int[] rc, int[] maxRc) {
        int cnt = 0;
        for (int i = 0; i < rc.length; i++) { cnt++; if (rc[i] > maxRc[i]) break; }
        return cnt;
    }
}`,
    pythonSolution: `def stepsExecutedBeforeAbort(rc, maxRc):
    cnt = 0
    for r, m in zip(rc, maxRc):
        cnt += 1
        if r > m: break
    return cnt`
  },
  {
    number: 43,
    title: 'Feature-Flag Hash Rollout Counter',
    fnName: 'countEnabledUsers',
    description: 'A feature flag is enabled for user ID <code>uid</code> if <code>(uid * 31 + 7) % 100 &lt; rolloutPct</code>. Given <code>userIds</code> and <code>rolloutPct</code>, return how many users see the feature.',
    constraints: ['1 <= userIds.length <= 10^5', '0 <= rolloutPct <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'userIds = [1, 2, 3, 4, 5], rolloutPct = 50', output: '3' },
      { title: 'Test Case 2', input: 'userIds = [10, 20, 30], rolloutPct = 100', output: '3' },
      { title: 'Test Case 3', input: 'userIds = [10, 20, 30], rolloutPct = 0', output: '0' },
      { title: 'Test Case 4', input: 'userIds = [0], rolloutPct = 8', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countEnabledUsers(int[] userIds, int rolloutPct) {
        int cnt = 0;
        for (int u : userIds) if ((Math.abs((long) u * 31 + 7) % 100) < rolloutPct) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countEnabledUsers(userIds, rolloutPct):
    return sum(1 for u in userIds if ((u * 31 + 7) % 100) < rolloutPct)`
  },
  {
    number: 44,
    title: 'Secret Rotation Dual-Key Overlap',
    fnName: 'countAuthSuccesses',
    description: 'An auth service accepts a request if its token key matches <code>activeKey</code> OR matches <code>prevKey</code> while <code>reqTime &lt;= graceEnd</code>. Given requests <code>reqs</code> <code>[reqTime, keyId]</code>, return total successful authentications.',
    constraints: ['1 <= reqs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'reqs = [[10, 2], [15, 1], [25, 1], [30, 2]], activeKey = 2, prevKey = 1, graceEnd = 20', output: '3' },
      { title: 'Test Case 2', input: 'reqs = [[5, 3]], activeKey = 2, prevKey = 1, graceEnd = 10', output: '0' },
      { title: 'Test Case 3', input: 'reqs = [[20, 1]], activeKey = 2, prevKey = 1, graceEnd = 20', output: '1' },
      { title: 'Test Case 4', input: 'reqs = [[100, 2]], activeKey = 2, prevKey = 1, graceEnd = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countAuthSuccesses(int[][] reqs, int activeKey, int prevKey, int graceEnd) {
        int ok = 0;
        for (int[] r : reqs) {
            if (r[1] == activeKey || (r[1] == prevKey && r[0] <= graceEnd)) ok++;
        }
        return ok;
    }
}`,
    pythonSolution: `def countAuthSuccesses(reqs, activeKey, prevKey, graceEnd):
    return sum(1 for t, k in reqs if k == activeKey or (k == prevKey and t <= graceEnd))`
  },
  {
    number: 45,
    title: 'Schema Registry Backward Compatibility',
    fnName: 'isSchemaBackwardCompatible',
    description: 'A new event schema <code>newFields</code> is backward compatible with <code>oldFields</code> if EVERY field in <code>oldFields</code> is still present in <code>newFields</code>. Return <code>true</code> or <code>false</code>.',
    constraints: ['1 <= oldFields.length, newFields.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'oldFields = ["id", "name"], newFields = ["id", "name", "email"]', output: 'true' },
      { title: 'Test Case 2', input: 'oldFields = ["id", "age"], newFields = ["id", "name"]', output: 'false' },
      { title: 'Test Case 3', input: 'oldFields = ["a"], newFields = ["a"]', output: 'true' },
      { title: 'Test Case 4', input: 'oldFields = ["x", "y"], newFields = ["x"]', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean isSchemaBackwardCompatible(String[] oldFields, String[] newFields) {
        Set<String> nf = new HashSet<>(Arrays.asList(newFields));
        for (String f : oldFields) if (!nf.contains(f)) return false;
        return true;
    }
}`,
    pythonSolution: `def isSchemaBackwardCompatible(oldFields, newFields):
    return set(oldFields).issubset(newFields)`
  },
  {
    number: 46,
    title: 'Thread-Pool Queue Saturation Count',
    fnName: 'countRejectedTasks',
    description: 'A thread pool with <code>workers</code> threads processes 1 task per worker per second and has a waiting queue of size <code>qCap</code>. Given incoming tasks per second <code>arrivals</code>, any tasks beyond <code>workers + qCap</code> in a second (including queued from prior seconds) are rejected. Return total rejected tasks.',
    constraints: ['1 <= arrivals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'arrivals = [6, 6, 6], workers = 2, qCap = 3', output: '9' },
      { title: 'Test Case 2', input: 'arrivals = [2, 2, 2], workers = 2, qCap = 0', output: '0' },
      { title: 'Test Case 3', input: 'arrivals = [10], workers = 4, qCap = 4', output: '2' },
      { title: 'Test Case 4', input: 'arrivals = [5, 0, 0], workers = 2, qCap = 3', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countRejectedTasks(int[] arrivals, int workers, int qCap) {
        long q = 0, rej = 0;
        for (int a : arrivals) {
            long total = q + a;
            long afterWorkers = Math.max(0L, total - workers);
            if (afterWorkers > qCap) { rej += afterWorkers - qCap; q = qCap; }
            else q = afterWorkers;
        }
        return rej;
    }
}`,
    pythonSolution: `def countRejectedTasks(arrivals, workers, qCap):
    q = rej = 0
    for a in arrivals:
        rem = max(0, q + a - workers)
        if rem > qCap: rej += rem - qCap; q = qCap
        else: q = rem
    return rej`
  },
  {
    number: 47,
    title: 'Spot-Instance Fallback Cost',
    fnName: 'minCloudComputeCost',
    description: 'A batch job needs <code>hours</code> compute hours. Spot instances cost <code>spotCost</code>/hr for up to <code>spotAvail</code> hours; remaining hours must use on-demand at <code>onDemandCost</code>/hr. Return total compute cost.',
    constraints: ['0 <= hours, spotAvail <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'hours = 100, spotAvail = 60, spotCost = 10, onDemandCost = 30', output: '1800' },
      { title: 'Test Case 2', input: 'hours = 40, spotAvail = 100, spotCost = 5, onDemandCost = 20', output: '200' },
      { title: 'Test Case 3', input: 'hours = 50, spotAvail = 0, spotCost = 10, onDemandCost = 25', output: '1250' },
      { title: 'Test Case 4', input: 'hours = 0, spotAvail = 10, spotCost = 5, onDemandCost = 15', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minCloudComputeCost(long hours, long spotAvail, long spotCost, long onDemandCost) {
        long spotUsed = Math.min(hours, spotAvail);
        return spotUsed * spotCost + (hours - spotUsed) * onDemandCost;
    }
}`,
    pythonSolution: `def minCloudComputeCost(hours, spotAvail, spotCost, onDemandCost):
    spot_used = min(hours, spotAvail)
    return spot_used * spotCost + (hours - spot_used) * onDemandCost`
  },
  {
    number: 48,
    title: 'Circuit-Breaker Trip Counter',
    fnName: 'countCircuitTrips',
    description: 'A circuit breaker starts CLOSED. Consecutive failures <code>== thresh</code> trip it OPEN for the next <code>openLen</code> calls (which are fast-failed and ignored), then it resets to CLOSED. Given call outcomes <code>outcomes</code> (1=ok, 0=fail), return how many times it trips OPEN.',
    constraints: ['1 <= thresh <= outcomes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'outcomes = [0, 0, 1, 0, 0, 0, 0, 0], thresh = 2, openLen = 2', output: '2' },
      { title: 'Test Case 2', input: 'outcomes = [1, 0, 1, 0], thresh = 2, openLen = 3', output: '0' },
      { title: 'Test Case 3', input: 'outcomes = [0, 0, 0], thresh = 1, openLen = 1', output: '2' },
      { title: 'Test Case 4', input: 'outcomes = [0, 0], thresh = 2, openLen = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countCircuitTrips(int[] outcomes, int thresh, int openLen) {
        int fails = 0, trips = 0, i = 0;
        while (i < outcomes.length) {
            if (outcomes[i] == 0) {
                if (++fails == thresh) { trips++; fails = 0; i += openLen + 1; continue; }
            } else fails = 0;
            i++;
        }
        return trips;
    }
}`,
    pythonSolution: `def countCircuitTrips(outcomes, thresh, openLen):
    fails = trips = i = 0
    while i < len(outcomes):
        if outcomes[i] == 0:
            fails += 1
            if fails == thresh: trips += 1; fails = 0; i += openLen + 1; continue
        else:
            fails = 0
        i += 1
    return trips`
  },
  {
    number: 49,
    title: 'Audit-Log Merkle Tree Height',
    fnName: 'merkleTreeLevels',
    description: 'Given <code>n</code> audit log leaf records, a binary Merkle tree repeatedly pairs adjacent nodes (duplicating an odd trailing node) until 1 root remains. Return the number of levels (including leaves and root).',
    constraints: ['1 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 1', output: '1' },
      { title: 'Test Case 2', input: 'n = 4', output: '3' },
      { title: 'Test Case 3', input: 'n = 5', output: '4' },
      { title: 'Test Case 4', input: 'n = 8', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int merkleTreeLevels(long n) {
        int levels = 1;
        while (n > 1) { n = (n + 1) / 2; levels++; }
        return levels;
    }
}`,
    pythonSolution: `def merkleTreeLevels(n):
    levels = 1
    while n > 1: n = (n + 1) // 2; levels += 1
    return levels`
  },
  {
    number: 50,
    title: 'gRPC Stream Backpressure Stall',
    fnName: 'maxQueueDepth',
    description: 'A producer pushes <code>pushed[i]</code> messages at second <code>i</code> and a consumer drains up to <code>drained[i]</code> messages at second <code>i</code>. Starting from 0 queued messages, return the peak queue depth reached.',
    constraints: ['1 <= pushed.length == drained.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pushed = [10, 10, 2], drained = [4, 5, 10]', output: '11' },
      { title: 'Test Case 2', input: 'pushed = [5, 5], drained = [5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'pushed = [3, 4], drained = [10, 10]', output: '0' },
      { title: 'Test Case 4', input: 'pushed = [20], drained = [5]', output: '15' }
    ],
    javaSolution: `public class Solution {
    public static long maxQueueDepth(int[] pushed, int[] drained) {
        long q = 0, peak = 0;
        for (int i = 0; i < pushed.length; i++) {
            q = Math.max(0L, q + pushed[i] - drained[i]);
            peak = Math.max(peak, q);
        }
        return peak;
    }
}`,
    pythonSolution: `def maxQueueDepth(pushed, drained):
    q = peak = 0
    for p, d in zip(pushed, drained):
        q = max(0, q + p - d)
        if q > peak: peak = q
    return peak`
  }
];
