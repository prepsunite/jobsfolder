export const JPMORGAN_QUESTIONS = [
  {
    number: 1,
    title: 'Ledger Account Net Balance',
    fnName: 'countOverdrawnAccounts',
    description: 'Given account transactions <code>txns</code> <code>[accountId, delta]</code> (all accounts start at 0), return how many distinct accounts end with a strictly negative balance.',
    constraints: ['1 <= txns.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'txns = [[1, 100], [1, -150], [2, 50], [3, -10]]', output: '2' },
      { title: 'Test Case 2', input: 'txns = [[1, 10], [1, -10]]', output: '0' },
      { title: 'Test Case 3', input: 'txns = [[5, -1]]', output: '1' },
      { title: 'Test Case 4', input: 'txns = [[1, 200], [2, 300]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countOverdrawnAccounts(int[][] txns) {
        Map<Integer, Long> bal = new HashMap<>();
        for (int[] t : txns) bal.put(t[0], bal.getOrDefault(t[0], 0L) + t[1]);
        int bad = 0;
        for (long v : bal.values()) if (v < 0) bad++;
        return bad;
    }
}`,
    pythonSolution: `from collections import defaultdict
def countOverdrawnAccounts(txns):
    bal = defaultdict(int)
    for acc, d in txns: bal[acc] += d
    return sum(1 for v in bal.values() if v < 0)`
  },
  {
    number: 2,
    title: 'FX Conversion Fee Calculator',
    fnName: 'totalConvertedCents',
    description: 'Given USD amounts in cents <code>amounts</code>, integer exchange multiplier <code>rate</code>, and flat fee <code>fee</code> per transaction (clamped at 0 if <code>amount * rate - fee < 0</code>), return total converted cents.',
    constraints: ['1 <= amounts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [100, 50, 10], rate = 2, fee = 30', output: '240' },
      { title: 'Test Case 2', input: 'amounts = [5, 5], rate = 1, fee = 10', output: '0' },
      { title: 'Test Case 3', input: 'amounts = [1000], rate = 80, fee = 500', output: '79500' },
      { title: 'Test Case 4', input: 'amounts = [20], rate = 3, fee = 0', output: '60' }
    ],
    javaSolution: `public class Solution {
    public static long totalConvertedCents(int[] amounts, int rate, int fee) {
        long tot = 0;
        for (int a : amounts) tot += Math.max(0L, (long) a * rate - fee);
        return tot;
    }
}`,
    pythonSolution: `def totalConvertedCents(amounts, rate, fee):
    return sum(max(0, a * rate - fee) for a in amounts)`
  },
  {
    number: 3,
    title: 'Code for Good Volunteer Matching',
    fnName: 'maxAssignedVolunteers',
    description: 'Each nonprofit project requires minimum skill <code>req[i]</code> and volunteers have skill levels <code>skills[j]</code>. Each volunteer can join at most 1 project if <code>skills[j] >= req[i]</code>. Return maximum projects staffed.',
    constraints: ['1 <= req.length, skills.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'req = [3, 5, 8], skills = [2, 4, 6, 9]', output: '3' },
      { title: 'Test Case 2', input: 'req = [10, 20], skills = [5, 8]', output: '0' },
      { title: 'Test Case 3', input: 'req = [5, 5], skills = [5]', output: '1' },
      { title: 'Test Case 4', input: 'req = [1], skills = [1, 2, 3]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxAssignedVolunteers(int[] req, int[] skills) {
        Arrays.sort(req); Arrays.sort(skills);
        int i = 0, j = 0, cnt = 0;
        while (i < req.length && j < skills.length) {
            if (skills[j] >= req[i]) { cnt++; i++; j++; }
            else j++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def maxAssignedVolunteers(req, skills):
    req.sort(); skills.sort()
    i = j = cnt = 0
    while i < len(req) and j < len(skills):
        if skills[j] >= req[i]: cnt += 1; i += 1; j += 1
        else: j += 1
    return cnt`
  },
  {
    number: 4,
    title: 'Wire Transfer Velocity Alert',
    fnName: 'countVelocityAlerts',
    description: 'Given sorted transaction timestamps <code>times</code> (seconds) and amounts <code>amounts</code>, flag index <code>i</code> if total amount in <code>[times[i] - window, times[i]]</code> strictly exceeds <code>limit</code>. Return total flagged transactions.',
    constraints: ['1 <= times.length == amounts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [1, 3, 5, 10], amounts = [400, 700, 300, 600], window = 4, limit = 1000', output: '2' },
      { title: 'Test Case 2', input: 'times = [0, 10, 20], amounts = [500, 500, 500], window = 5, limit = 500', output: '0' },
      { title: 'Test Case 3', input: 'times = [1, 2], amounts = [600, 600], window = 5, limit = 1000', output: '1' },
      { title: 'Test Case 4', input: 'times = [5], amounts = [100], window = 10, limit = 50', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countVelocityAlerts(int[] times, int[] amounts, int window, long limit) {
        long cur = 0; int l = 0, flags = 0;
        for (int r = 0; r < times.length; r++) {
            cur += amounts[r];
            while (times[r] - times[l] > window) cur -= amounts[l++];
            if (cur > limit) flags++;
        }
        return flags;
    }
}`,
    pythonSolution: `def countVelocityAlerts(times, amounts, window, limit):
    cur = l = flags = 0
    for r, (t, a) in enumerate(zip(times, amounts)):
        cur += a
        while t - times[l] > window: cur -= amounts[l]; l += 1
        if cur > limit: flags += 1
    return flags`
  },
  {
    number: 5,
    title: 'ACH Clearing Batch Windows',
    fnName: 'countClearingBatches',
    description: 'Given sorted payment arrival timestamps <code>times</code>, a clearing batch processes all payments within <code>batchLen</code> seconds of the first unbatched payment (inclusive). Return minimum batches needed.',
    constraints: ['1 <= times.length <= 10^5', '0 <= batchLen <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [1, 3, 6, 10, 11], batchLen = 4', output: '3' },
      { title: 'Test Case 2', input: 'times = [0, 1, 2], batchLen = 5', output: '1' },
      { title: 'Test Case 3', input: 'times = [10, 20, 30], batchLen = 0', output: '3' },
      { title: 'Test Case 4', input: 'times = [5], batchLen = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countClearingBatches(int[] times, int batchLen) {
        int batches = 0, i = 0, n = times.length;
        while (i < n) {
            int start = times[i]; batches++;
            while (i < n && (long) times[i] - start <= batchLen) i++;
        }
        return batches;
    }
}`,
    pythonSolution: `def countClearingBatches(times, batchLen):
    batches = i = 0; n = len(times)
    while i < n:
        start = times[i]; batches += 1
        while i < n and times[i] - start <= batchLen: i += 1
    return batches`
  },
  {
    number: 6,
    title: 'IBAN / Card Luhn-Style Mod10 Check',
    fnName: 'countMod10ValidCards',
    description: 'A numeric card string is valid under Luhn checksum if, doubling every second digit from the right (subtracting 9 if &gt; 9) and summing all digits, the total is divisible by 10. Count valid strings in <code>cards</code>.',
    constraints: ['1 <= cards.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'cards = ["79927398713", "79927398714"]', output: '1' },
      { title: 'Test Case 2', input: 'cards = ["0000"]', output: '1' },
      { title: 'Test Case 3', input: 'cards = ["1234"]', output: '0' },
      { title: 'Test Case 4', input: 'cards = ["4242424242424242"]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countMod10ValidCards(String[] cards) {
        int ok = 0;
        for (String c : cards) {
            int sum = 0; boolean dbl = false;
            for (int i = c.length() - 1; i >= 0; i--) {
                int d = c.charAt(i) - '0';
                if (dbl) { d *= 2; if (d > 9) d -= 9; }
                sum += d; dbl = !dbl;
            }
            if (sum % 10 == 0) ok++;
        }
        return ok;
    }
}`,
    pythonSolution: `def countMod10ValidCards(cards):
    ok = 0
    for c in cards:
        s = 0; dbl = False
        for ch in reversed(c):
            d = int(ch)
            if dbl: d = d * 2 - 9 if d * 2 > 9 else d * 2
            s += d; dbl = not dbl
        if s % 10 == 0: ok += 1
    return ok`
  },
  {
    number: 7,
    title: 'Duplicate Invoice Idempotency',
    fnName: 'uniqueInvoiceTotal',
    description: 'Given payment requests <code>ids</code> and amounts <code>amounts</code> (duplicate <code>ids</code> are retries with identical amount), return the total amount paid for unique invoice IDs.',
    constraints: ['1 <= ids.length == amounts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = [10, 20, 10, 30], amounts = [100, 200, 100, 50]', output: '350' },
      { title: 'Test Case 2', input: 'ids = [1, 1, 1], amounts = [42, 42, 42]', output: '42' },
      { title: 'Test Case 3', input: 'ids = [5], amounts = [99]', output: '99' },
      { title: 'Test Case 4', input: 'ids = [1, 2], amounts = [10, 20]', output: '30' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long uniqueInvoiceTotal(int[] ids, int[] amounts) {
        Set<Integer> seen = new HashSet<>();
        long sum = 0;
        for (int i = 0; i < ids.length; i++) if (seen.add(ids[i])) sum += amounts[i];
        return sum;
    }
}`,
    pythonSolution: `def uniqueInvoiceTotal(ids, amounts):
    seen = set(); s = 0
    for i, a in zip(ids, amounts):
        if i not in seen: seen.add(i); s += a
    return s`
  },
  {
    number: 8,
    title: 'Branch Teller Queue Wait Time',
    fnName: 'maxTellerWaitTime',
    description: 'Customers arrive at sorted times <code>arrivals</code> and each takes <code>service</code> minutes with 1 teller. Return the maximum time any customer waits in line before being served.',
    constraints: ['1 <= arrivals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'arrivals = [0, 1, 2, 10], service = 3', output: '4' },
      { title: 'Test Case 2', input: 'arrivals = [0, 5, 10], service = 5', output: '0' },
      { title: 'Test Case 3', input: 'arrivals = [2, 2, 2], service = 4', output: '8' },
      { title: 'Test Case 4', input: 'arrivals = [10], service = 7', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long maxTellerWaitTime(int[] arrivals, int service) {
        long freeAt = 0, best = 0;
        for (int a : arrivals) {
            long start = Math.max(freeAt, (long) a);
            best = Math.max(best, start - a);
            freeAt = start + service;
        }
        return best;
    }
}`,
    pythonSolution: `def maxTellerWaitTime(arrivals, service):
    free_at = best = 0
    for a in arrivals:
        start = max(free_at, a)
        best = max(best, start - a)
        free_at = start + service
    return best`
  },
  {
    number: 9,
    title: 'Minimum ATM Notes Dispensed',
    fnName: 'minAtmNotes',
    description: 'Given sorted standard ATM denominations <code>denoms</code> (e.g., <code>[1, 5, 10, 20, 50, 100]</code> where greedy is optimal), return the minimum notes to dispense <code>amount</code>.',
    constraints: ['1 <= denoms.length <= 20', '0 <= amount <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'denoms = [1, 5, 10, 20, 50, 100], amount = 285', output: '6' },
      { title: 'Test Case 2', input: 'denoms = [1, 10, 50], amount = 0', output: '0' },
      { title: 'Test Case 3', input: 'denoms = [1, 5, 20], amount = 26', output: '3' },
      { title: 'Test Case 4', input: 'denoms = [1, 100], amount = 199', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static long minAtmNotes(int[] denoms, long amount) {
        long cnt = 0;
        for (int i = denoms.length - 1; i >= 0; i--) {
            cnt += amount / denoms[i];
            amount %= denoms[i];
        }
        return cnt;
    }
}`,
    pythonSolution: `def minAtmNotes(denoms, amount):
    cnt = 0
    for d in reversed(denoms):
        cnt += amount // d; amount %= d
    return cnt`
  },
  {
    number: 10,
    title: 'Treasury Settlement Graph Reachability',
    fnName: 'countUnreachableBanks',
    description: 'Given <code>n</code> banks (0..n-1) and directed settlement channels <code>channels</code> <code>[u, v]</code>, starting from central bank <code>0</code>, return how many banks CANNOT receive funds from <code>0</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, channels = [[0, 1], [1, 2]]', output: '1' },
      { title: 'Test Case 2', input: 'n = 3, channels = [[0, 1], [0, 2]]', output: '0' },
      { title: 'Test Case 3', input: 'n = 3, channels = []', output: '2' },
      { title: 'Test Case 4', input: 'n = 1, channels = []', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUnreachableBanks(int n, int[][] channels) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] c : channels) g.get(c[0]).add(c[1]);
        boolean[] vis = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();
        vis[0] = true; q.add(0); int reach = 1;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g.get(u)) if (!vis[v]) { vis[v] = true; reach++; q.add(v); }
        }
        return n - reach;
    }
}`,
    pythonSolution: `from collections import deque
def countUnreachableBanks(n, channels):
    g = [[] for _ in range(n)]
    for u, v in channels: g[u].append(v)
    vis = {0}; q = deque([0])
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis: vis.add(v); q.append(v)
    return n - len(vis)`
  },
  {
    number: 11,
    title: 'Credit Limit Utilization Tiers',
    fnName: 'countHighUtilizationCards',
    description: 'Given balances <code>bal</code> and credit limits <code>lim</code>, count how many cards have utilization strictly above <code>pct</code>% (<code>bal[i] * 100 > pct * lim[i]</code>).',
    constraints: ['1 <= bal.length == lim.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bal = [350, 200, 900], lim = [1000, 1000, 1000], pct = 30', output: '2' },
      { title: 'Test Case 2', input: 'bal = [300], lim = [1000], pct = 30', output: '0' },
      { title: 'Test Case 3', input: 'bal = [0, 0], lim = [500, 500], pct = 0', output: '0' },
      { title: 'Test Case 4', input: 'bal = [500], lim = [500], pct = 99', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countHighUtilizationCards(int[] bal, int[] lim, int pct) {
        int cnt = 0;
        for (int i = 0; i < bal.length; i++) if ((long) bal[i] * 100 > (long) pct * lim[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countHighUtilizationCards(bal, lim, pct):
    return sum(1 for b, l in zip(bal, lim) if b * 100 > pct * l)`
  },
  {
    number: 12,
    title: 'Nonprofit Grant Budget Allocation',
    fnName: 'maxGrantsFunded',
    description: 'Given grant requests <code>grants</code> and total fund <code>budget</code>, return the maximum number of grant requests that can be fully funded.',
    constraints: ['1 <= grants.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'grants = [50, 20, 30, 10, 40], budget = 65', output: '3' },
      { title: 'Test Case 2', input: 'grants = [100, 200], budget = 50', output: '0' },
      { title: 'Test Case 3', input: 'grants = [10, 10, 10], budget = 30', output: '3' },
      { title: 'Test Case 4', input: 'grants = [25], budget = 25', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxGrantsFunded(int[] grants, long budget) {
        Arrays.sort(grants);
        long s = 0; int cnt = 0;
        for (int g : grants) {
            if (s + g <= budget) { s += g; cnt++; } else break;
        }
        return cnt;
    }
}`,
    pythonSolution: `def maxGrantsFunded(grants, budget):
    s = cnt = 0
    for g in sorted(grants):
        if s + g <= budget: s += g; cnt += 1
        else: break
    return cnt`
  },
  {
    number: 13,
    title: 'SWIFT BIC Code Format Validator',
    fnName: 'countValidSwiftCodes',
    description: 'A simplified SWIFT code is valid if its length is 8 or 11 and all characters are uppercase letters A-Z or digits 0-9, with the first 6 characters being uppercase letters A-Z. Count valid codes.',
    constraints: ['1 <= codes.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'codes = ["CHASUS33", "CHASUS33XXX", "CHAS1234", "badcode1"]', output: '2' },
      { title: 'Test Case 2', input: 'codes = ["ABCDEF12"]', output: '1' },
      { title: 'Test Case 3', input: 'codes = ["ABCDE123"]', output: '0' },
      { title: 'Test Case 4', input: 'codes = ["ABCDEF123"]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countValidSwiftCodes(String[] codes) {
        int cnt = 0;
        for (String c : codes) {
            if (c.length() != 8 && c.length() != 11) continue;
            boolean ok = true;
            for (int i = 0; i < c.length(); i++) {
                char ch = c.charAt(i);
                if (i < 6 && !(ch >= 'A' && ch <= 'Z')) { ok = false; break; }
                if (i >= 6 && !((ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9'))) { ok = false; break; }
            }
            if (ok) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countValidSwiftCodes(codes):
    return sum(1 for c in codes if len(c) in (8, 11) and c[:6].isalpha() and c[:6].isupper() and all(ch.isdigit() or ('A' <= ch <= 'Z') for ch in c[6:]))`
  },
  {
    number: 14,
    title: 'Interest Compounding Doubling Years',
    fnName: 'yearsToReachGoal',
    description: 'Starting with principal <code>p</code>, each year balance is multiplied by <code>(100 + rate)</code> and integer-divided by <code>100</code>. Return minimum years for balance to reach <code>&gt;= target</code> (assuming <code>rate &gt; 0</code> and <code>p &gt;= 100</code> or using exact integer floor).',
    constraints: ['1 <= p <= target <= 10^9', '1 <= rate <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'p = 1000, rate = 10, target = 1200', output: '2' },
      { title: 'Test Case 2', input: 'p = 500, rate = 50, target = 500', output: '0' },
      { title: 'Test Case 3', input: 'p = 100, rate = 100, target = 800', output: '3' },
      { title: 'Test Case 4', input: 'p = 100, rate = 5, target = 105', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int yearsToReachGoal(long p, int rate, long target) {
        int y = 0;
        while (p < target) { p = (p * (100 + rate)) / 100; y++; }
        return y;
    }
}`,
    pythonSolution: `def yearsToReachGoal(p, rate, target):
    y = 0
    while p < target:
        p = (p * (100 + rate)) // 100; y += 1
    return y`
  },
  {
    number: 15,
    title: 'Check Reconciliation Missing IDs',
    fnName: 'countUnreconciledChecks',
    description: 'Given issued check IDs <code>issued</code> and cleared check IDs <code>cleared</code>, return how many issued checks have NOT cleared yet.',
    constraints: ['1 <= issued.length <= 10^5', '0 <= cleared.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'issued = [101, 102, 103, 104], cleared = [102, 104]', output: '2' },
      { title: 'Test Case 2', input: 'issued = [1, 2], cleared = [1, 2]', output: '0' },
      { title: 'Test Case 3', input: 'issued = [5, 6, 7], cleared = []', output: '3' },
      { title: 'Test Case 4', input: 'issued = [9], cleared = [1, 2, 9]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUnreconciledChecks(int[] issued, int[] cleared) {
        Set<Integer> s = new HashSet<>();
        for (int c : cleared) s.add(c);
        int miss = 0;
        for (int id : issued) if (!s.contains(id)) miss++;
        return miss;
    }
}`,
    pythonSolution: `def countUnreconciledChecks(issued, cleared):
    s = set(cleared)
    return sum(1 for x in issued if x not in s)`
  },
  {
    number: 16,
    title: 'Minimum Audit Rounds for Tasks',
    fnName: 'minAuditDays',
    description: 'Each task type in <code>tasks</code> must be completed in batches of 2 or 3 identical tasks per day. Return the minimum total days to finish all tasks, or <code>-1</code> if impossible.',
    constraints: ['1 <= tasks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tasks = [2, 2, 3, 3, 2, 4, 4, 4, 4, 4]', output: '4' },
      { title: 'Test Case 2', input: 'tasks = [2, 3, 3]', output: '-1' },
      { title: 'Test Case 3', input: 'tasks = [1, 1, 1, 1]', output: '2' },
      { title: 'Test Case 4', input: 'tasks = [7, 7, 7, 7, 7, 7, 7]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minAuditDays(int[] tasks) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int t : tasks) freq.put(t, freq.getOrDefault(t, 0) + 1);
        int days = 0;
        for (int c : freq.values()) {
            if (c == 1) return -1;
            days += (c + 2) / 3;
        }
        return days;
    }
}`,
    pythonSolution: `from collections import Counter
def minAuditDays(tasks):
    cnt = Counter(tasks)
    if 1 in cnt.values(): return -1
    return sum((c + 2) // 3 for c in cnt.values())`
  },
  {
    number: 17,
    title: 'ATM Cash Denomination Split',
    fnName: 'canDispenseExact',
    description: 'An ATM holds <code>n50</code> notes of 50 and <code>n20</code> notes of 20. Return <code>true</code> if it can dispense exact amount <code>amt</code>, else <code>false</code>.',
    constraints: ['0 <= n50, n20 <= 10^5', '0 <= amt <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n50 = 2, n20 = 3, amt = 110', output: 'true' },
      { title: 'Test Case 2', input: 'n50 = 1, n20 = 1, amt = 30', output: 'false' },
      { title: 'Test Case 3', input: 'n50 = 0, n20 = 0, amt = 0', output: 'true' },
      { title: 'Test Case 4', input: 'n50 = 1, n20 = 5, amt = 150', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean canDispenseExact(long n50, long n20, long amt) {
        long max50 = Math.min(n50, amt / 50);
        for (long c50 = max50; c50 >= Math.max(0L, max50 - 2); c50--) {
            long rem = amt - c50 * 50;
            if (rem % 20 == 0 && rem / 20 <= n20) return true;
        }
        return false;
    }
}`,
    pythonSolution: `def canDispenseExact(n50, n20, amt):
    m50 = min(n50, amt // 50)
    for c50 in range(m50, max(-1, m50 - 3), -1):
        rem = amt - c50 * 50
        if rem % 20 == 0 and rem // 20 <= n20: return True
    return False`
  },
  {
    number: 18,
    title: 'Branch Footfall Peak Hour',
    fnName: 'busiestHourIndex',
    description: 'Given customer visit intervals <code>visits</code> <code>[entryHour, exitHour)</code> in <code>0..23</code>, return the hour (smallest if tied) with the highest number of customers inside.',
    constraints: ['1 <= visits.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'visits = [[9, 12], [10, 14], [11, 13]]', output: '11' },
      { title: 'Test Case 2', input: 'visits = [[0, 1], [1, 2]]', output: '0' },
      { title: 'Test Case 3', input: 'visits = [[15, 16]]', output: '15' },
      { title: 'Test Case 4', input: 'visits = [[8, 10], [8, 10]]', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static int busiestHourIndex(int[][] visits) {
        int[] cnt = new int[24];
        for (int[] v : visits) for (int h = v[0]; h < v[1]; h++) cnt[h]++;
        int bestH = 0;
        for (int h = 1; h < 24; h++) if (cnt[h] > cnt[bestH]) bestH = h;
        return bestH;
    }
}`,
    pythonSolution: `def busiestHourIndex(visits):
    cnt = [0] * 24
    for a, b in visits:
        for h in range(a, b): cnt[h] += 1
    return max(range(24), key=lambda h: cnt[h])`
  },
  {
    number: 19,
    title: 'Account Tier Upgrade Eligibility',
    fnName: 'countPremierEligible',
    description: 'Customers qualify for Premier status if average monthly balance <code>avgBal[i] >= minBal</code> OR monthly direct deposit <code>dep[i] >= minDep</code>. Count eligible customers.',
    constraints: ['1 <= avgBal.length == dep.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'avgBal = [10000, 5000, 2000], dep = [1000, 6000, 1000], minBal = 10000, minDep = 5000', output: '2' },
      { title: 'Test Case 2', input: 'avgBal = [100], dep = [100], minBal = 500, minDep = 500', output: '0' },
      { title: 'Test Case 3', input: 'avgBal = [500], dep = [0], minBal = 500, minDep = 100', output: '1' },
      { title: 'Test Case 4', input: 'avgBal = [0, 0], dep = [500, 499], minBal = 1000, minDep = 600', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countPremierEligible(int[] avgBal, int[] dep, int minBal, int minDep) {
        int cnt = 0;
        for (int i = 0; i < avgBal.length; i++) if (avgBal[i] >= minBal || dep[i] >= minDep) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countPremierEligible(avgBal, dep, minBal, minDep):
    return sum(1 for b, d in zip(avgBal, dep) if b >= minBal or d >= minDep)`
  },
  {
    number: 20,
    title: 'Loan Amortization Principal Check',
    fnName: 'monthsToPayoff',
    description: 'A loan has balance <code>bal</code>. Each month, interest of <code>ratePct</code>% (integer floor) is added, then fixed payment <code>pay</code> is subtracted. Return months to reach <code>&lt;= 0</code> (or <code>-1</code> if balance does not strictly decrease on month 1).',
    constraints: ['1 <= bal <= 10^6', '1 <= pay <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'bal = 1000, ratePct = 10, pay = 300', output: '5' },
      { title: 'Test Case 2', input: 'bal = 1000, ratePct = 10, pay = 100', output: '-1' },
      { title: 'Test Case 3', input: 'bal = 100, ratePct = 0, pay = 25', output: '4' },
      { title: 'Test Case 4', input: 'bal = 50, ratePct = 10, pay = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int monthsToPayoff(long bal, int ratePct, long pay) {
        int months = 0;
        while (bal > 0) {
            long next = bal + (bal * ratePct) / 100 - pay;
            if (next >= bal) return -1;
            bal = next; months++;
        }
        return months;
    }
}`,
    pythonSolution: `def monthsToPayoff(bal, ratePct, pay):
    m = 0
    while bal > 0:
        nxt = bal + (bal * ratePct) // 100 - pay
        if nxt >= bal: return -1
        bal = nxt; m += 1
    return m`
  },
  {
    number: 21,
    title: 'Fraud Rule Sliding Max Amount',
    fnName: 'maxTransactionInWindow',
    description: 'Given transaction amounts <code>amounts</code> and window size <code>k</code>, return the maximum total amount in any <code>k</code> consecutive transactions.',
    constraints: ['1 <= k <= amounts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [100, 500, 200, 800, 100], k = 2', output: '1000' },
      { title: 'Test Case 2', input: 'amounts = [50, 50, 50], k = 3', output: '150' },
      { title: 'Test Case 3', input: 'amounts = [10, 90, 20], k = 1', output: '90' },
      { title: 'Test Case 4', input: 'amounts = [5, 5, 5, 5], k = 2', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long maxTransactionInWindow(int[] amounts, int k) {
        long cur = 0;
        for (int i = 0; i < k; i++) cur += amounts[i];
        long best = cur;
        for (int i = k; i < amounts.length; i++) { cur += amounts[i] - amounts[i - k]; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxTransactionInWindow(amounts, k):
    cur = sum(amounts[:k]); best = cur
    for i in range(k, len(amounts)):
        cur += amounts[i] - amounts[i - k]; best = max(best, cur)
    return best`
  },
  {
    number: 22,
    title: 'Payment Gateway Retry Success',
    fnName: 'countEventualSuccesses',
    description: 'Each payment attempt log string in <code>logs</code> is a sequence of <code>\'F\'</code> (fail) and <code>\'S\'</code> (success) chars. Count how many logs contain at least one <code>\'S\'</code>.',
    constraints: ['1 <= logs.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'logs = ["FFS", "FFF", "S", "FSF"]', output: '3' },
      { title: 'Test Case 2', input: 'logs = ["FF", "FFF"]', output: '0' },
      { title: 'Test Case 3', input: 'logs = ["S"]', output: '1' },
      { title: 'Test Case 4', input: 'logs = ["SSSS"]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countEventualSuccesses(String[] logs) {
        int cnt = 0;
        for (String l : logs) if (l.indexOf('S') != -1) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countEventualSuccesses(logs):
    return sum(1 for l in logs if 'S' in l)`
  },
  {
    number: 23,
    title: 'Split Bill Group Settlement',
    fnName: 'minNetTransfersNeeded',
    description: 'Given final net balances <code>bals</code> of <code>n</code> friends (sum is 0), return how many friends have a non-zero balance (upper bound on active participants in settlement).',
    constraints: ['1 <= bals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bals = [10, -10, 0, 5, -5]', output: '4' },
      { title: 'Test Case 2', input: 'bals = [0, 0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'bals = [100, -100]', output: '2' },
      { title: 'Test Case 4', input: 'bals = [0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int minNetTransfersNeeded(int[] bals) {
        int cnt = 0;
        for (int b : bals) if (b != 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def minNetTransfersNeeded(bals):
    return sum(1 for b in bals if b != 0)`
  },
  {
    number: 24,
    title: 'Card Expiry Date Comparison',
    fnName: 'countExpiredCards',
    description: 'Given card expiry dates <code>[month, year]</code> in <code>cards</code> and current date <code>[curMonth, curYear]</code>, count cards strictly expired (<code>year &lt; curYear</code> or <code>(year == curYear && month &lt; curMonth)</code>).',
    constraints: ['1 <= cards.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'cards = [[5, 2026], [12, 2026], [1, 2025]], curMonth = 11, curYear = 2026', output: '2' },
      { title: 'Test Case 2', input: 'cards = [[11, 2026]], curMonth = 11, curYear = 2026', output: '0' },
      { title: 'Test Case 3', input: 'cards = [[1, 2027]], curMonth = 12, curYear = 2026', output: '0' },
      { title: 'Test Case 4', input: 'cards = [[10, 2026], [11, 2026]], curMonth = 11, curYear = 2026', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countExpiredCards(int[][] cards, int curMonth, int curYear) {
        int exp = 0;
        for (int[] c : cards) {
            if (c[1] < curYear || (c[1] == curYear && c[0] < curMonth)) exp++;
        }
        return exp;
    }
}`,
    pythonSolution: `def countExpiredCards(cards, curMonth, curYear):
    return sum(1 for m, y in cards if (y, m) < (curYear, curMonth))`
  },
  {
    number: 25,
    title: 'Merchant Fee Tier Calculator',
    fnName: 'totalMerchantFees',
    description: 'Each merchant\'s transaction volume <code>vols[i]</code> is charged <code>lowFee</code>% if <code>vols[i] < thresh</code> else <code>highFee</code>% (integer floor). Return total fee across all merchants.',
    constraints: ['1 <= vols.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vols = [1000, 5000, 2000], thresh = 3000, lowFee = 2, highFee = 1', output: '110' },
      { title: 'Test Case 2', input: 'vols = [100, 200], thresh = 500, lowFee = 5, highFee = 2', output: '15' },
      { title: 'Test Case 3', input: 'vols = [1000], thresh = 1000, lowFee = 5, highFee = 1', output: '10' },
      { title: 'Test Case 4', input: 'vols = [0], thresh = 100, lowFee = 5, highFee = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalMerchantFees(int[] vols, int thresh, int lowFee, int highFee) {
        long tot = 0;
        for (int v : vols) {
            int rate = (v < thresh) ? lowFee : highFee;
            tot += ((long) v * rate) / 100;
        }
        return tot;
    }
}`,
    pythonSolution: `def totalMerchantFees(vols, thresh, lowFee, highFee):
    return sum((v * (lowFee if v < thresh else highFee)) // 100 for v in vols)`
  },
  {
    number: 26,
    title: 'Subarray Zero-Sum Ledger Audit',
    fnName: 'hasZeroSumSubarray',
    description: 'Given signed daily ledger entries <code>entries</code>, return <code>true</code> if any non-empty contiguous subarray sums to <code>0</code>, else <code>false</code>.',
    constraints: ['1 <= entries.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'entries = [4, 2, -3, 1, 6]', output: 'true' },
      { title: 'Test Case 2', input: 'entries = [1, 2, 3]', output: 'false' },
      { title: 'Test Case 3', input: 'entries = [0]', output: 'true' },
      { title: 'Test Case 4', input: 'entries = [-5, 5]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean hasZeroSumSubarray(int[] entries) {
        Set<Long> seen = new HashSet<>();
        seen.add(0L);
        long pref = 0;
        for (int e : entries) {
            pref += e;
            if (!seen.add(pref)) return true;
        }
        return false;
    }
}`,
    pythonSolution: `def hasZeroSumSubarray(entries):
    seen = {0}; pref = 0
    for e in entries:
        pref += e
        if pref in seen: return True
        seen.add(pref)
    return False`
  },
  {
    number: 27,
    title: 'Cashback Reward Points DP',
    fnName: 'maxCashbackNonConsecutive',
    description: 'Given monthly cashback offers <code>offers</code>, claiming an offer in month <code>i</code> prevents claiming in month <code>i + 1</code>. Return the maximum total cashback.',
    constraints: ['1 <= offers.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'offers = [2, 7, 9, 3, 1]', output: '12' },
      { title: 'Test Case 2', input: 'offers = [1, 2, 3, 1]', output: '4' },
      { title: 'Test Case 3', input: 'offers = [10]', output: '10' },
      { title: 'Test Case 4', input: 'offers = [5, 1, 1, 5]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long maxCashbackNonConsecutive(int[] offers) {
        long p2 = 0, p1 = 0;
        for (int o : offers) { long cur = Math.max(p1, p2 + o); p2 = p1; p1 = cur; }
        return p1;
    }
}`,
    pythonSolution: `def maxCashbackNonConsecutive(offers):
    p2 = p1 = 0
    for o in offers: p2, p1 = p1, max(p1, p2 + o)
    return p1`
  },
  {
    number: 28,
    title: 'Sanctions List Exact Match Count',
    fnName: 'countFlaggedNames',
    description: 'Given normalized customer names <code>names</code> and a sanctions list <code>blocked</code>, count how many customer names appear in <code>blocked</code>.',
    constraints: ['1 <= names.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'names = ["alice", "bob", "eve", "alice"], blocked = ["eve", "mallory"]', output: '1' },
      { title: 'Test Case 2', input: 'names = ["sam", "dan"], blocked = ["alex"]', output: '0' },
      { title: 'Test Case 3', input: 'names = ["x"], blocked = ["x"]', output: '1' },
      { title: 'Test Case 4', input: 'names = ["a", "b"], blocked = []', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countFlaggedNames(String[] names, String[] blocked) {
        Set<String> s = new HashSet<>(Arrays.asList(blocked));
        int cnt = 0;
        for (String n : names) if (s.contains(n)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countFlaggedNames(names, blocked):
    s = set(blocked)
    return sum(1 for n in names if n in s)`
  },
  {
    number: 29,
    title: 'ATM Cash Replenishment Stops',
    fnName: 'minAtmRefillStops',
    description: 'A cash-van starts with <code>cap</code> cash and drives along <code>n</code> ATMs needing <code>need[i]</code> cash each (in order). If remaining cash <code>&lt; need[i]</code>, the van returns to depot to refill to <code>cap</code>. Return total refills.',
    constraints: ['1 <= need.length <= 10^5', 'max(need) <= cap <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'need = [40, 30, 50, 20], cap = 80', output: '1' },
      { title: 'Test Case 2', input: 'need = [10, 10, 10], cap = 30', output: '0' },
      { title: 'Test Case 3', input: 'need = [50, 50, 50], cap = 50', output: '2' },
      { title: 'Test Case 4', input: 'need = [20], cap = 20', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int minAtmRefillStops(int[] need, int cap) {
        int cur = cap, refills = 0;
        for (int x : need) {
            if (cur < x) { refills++; cur = cap; }
            cur -= x;
        }
        return refills;
    }
}`,
    pythonSolution: `def minAtmRefillStops(need, cap):
    cur, refills = cap, 0
    for x in need:
        if cur < x: refills += 1; cur = cap
        cur -= x
    return refills`
  },
  {
    number: 30,
    title: 'Minimum Meeting Rooms for Audit',
    fnName: 'minAuditRooms',
    description: 'Given audit call intervals <code>calls</code> <code>[start, end)</code>, return the minimum number of conference rooms required simultaneously.',
    constraints: ['1 <= calls.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'calls = [[0, 30], [5, 10], [15, 20]]', output: '2' },
      { title: 'Test Case 2', input: 'calls = [[7, 10], [2, 4]]', output: '1' },
      { title: 'Test Case 3', input: 'calls = [[1, 5], [1, 5], [1, 5]]', output: '3' },
      { title: 'Test Case 4', input: 'calls = [[0, 10]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minAuditRooms(int[][] calls) {
        int n = calls.length;
        int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = calls[i][0]; e[i] = calls[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def minAuditRooms(calls):
    s = sorted(c[0] for c in calls); e = sorted(c[1] for c in calls)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 31,
    title: 'Stock Dividend Reinvestment Shares',
    fnName: 'finalWholeShares',
    description: 'An investor holds <code>shares</code> whole shares. Over <code>n</code> quarters, each quarter pays dividend <code>divPerShare</code> per share, and whole new shares are bought at price <code>sharePrice</code> (leftover cash carries over). Return final whole shares.',
    constraints: ['1 <= n <= 10^4', '1 <= sharePrice <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'shares = 10, n = 2, divPerShare = 5, sharePrice = 20', output: '15' },
      { title: 'Test Case 2', input: 'shares = 10, n = 3, divPerShare = 1, sharePrice = 100', output: '10' },
      { title: 'Test Case 3', input: 'shares = 5, n = 1, divPerShare = 10, sharePrice = 10', output: '10' },
      { title: 'Test Case 4', input: 'shares = 0, n = 5, divPerShare = 10, sharePrice = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long finalWholeShares(long shares, int n, long divPerShare, long sharePrice) {
        long cash = 0;
        for (int i = 0; i < n; i++) {
            cash += shares * divPerShare;
            shares += cash / sharePrice;
            cash %= sharePrice;
        }
        return shares;
    }
}`,
    pythonSolution: `def finalWholeShares(shares, n, divPerShare, sharePrice):
    cash = 0
    for _ in range(n):
        cash += shares * divPerShare
        shares += cash // sharePrice
        cash %= sharePrice
    return shares`
  },
  {
    number: 32,
    title: 'Transaction Batch Checksum XOR',
    fnName: 'batchXorChecksum',
    description: 'Given transaction reference IDs <code>refs</code>, return the bitwise XOR of all reference IDs.',
    constraints: ['1 <= refs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'refs = [12, 5, 9]', output: '0' },
      { title: 'Test Case 2', input: 'refs = [7, 7, 10]', output: '10' },
      { title: 'Test Case 3', input: 'refs = [42]', output: '42' },
      { title: 'Test Case 4', input: 'refs = [1, 2, 4, 8]', output: '15' }
    ],
    javaSolution: `public class Solution {
    public static int batchXorChecksum(int[] refs) {
        int x = 0;
        for (int r : refs) x ^= r;
        return x;
    }
}`,
    pythonSolution: `def batchXorChecksum(refs):
    x = 0
    for r in refs: x ^= r
    return x`
  },
  {
    number: 33,
    title: 'Charity Hackathon Team Formation',
    fnName: 'maxCompleteTeams',
    description: 'A hackathon team needs exactly 2 developers and 1 designer. Given <code>devs</code> developers and <code>designers</code> designers, return the maximum number of complete teams.',
    constraints: ['0 <= devs, designers <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'devs = 10, designers = 4', output: '4' },
      { title: 'Test Case 2', input: 'devs = 5, designers = 10', output: '2' },
      { title: 'Test Case 3', input: 'devs = 1, designers = 5', output: '0' },
      { title: 'Test Case 4', input: 'devs = 6, designers = 3', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static long maxCompleteTeams(long devs, long designers) {
        return Math.min(devs / 2, designers);
    }
}`,
    pythonSolution: `def maxCompleteTeams(devs, designers):
    return min(devs // 2, designers)`
  },
  {
    number: 34,
    title: 'Account Activity Gap Longest Idle',
    fnName: 'maxDormantGapDays',
    description: 'Given sorted login days <code>days</code> of an account, return the maximum gap between consecutive logins (<code>0</code> if fewer than 2 logins).',
    constraints: ['1 <= days.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'days = [1, 4, 15, 20]', output: '11' },
      { title: 'Test Case 2', input: 'days = [10]', output: '0' },
      { title: 'Test Case 3', input: 'days = [5, 5, 5]', output: '0' },
      { title: 'Test Case 4', input: 'days = [0, 100]', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static int maxDormantGapDays(int[] days) {
        int best = 0;
        for (int i = 1; i < days.length; i++) best = Math.max(best, days[i] - days[i - 1]);
        return best;
    }
}`,
    pythonSolution: `def maxDormantGapDays(days):
    return max((days[i] - days[i - 1] for i in range(1, len(days))), default=0)`
  },
  {
    number: 35,
    title: 'Currency Note Count Breakdown',
    fnName: 'countDistinctNotesUsed',
    description: 'Given descending denominations <code>denoms</code> and amount <code>amt</code>, greedily pick notes from largest to smallest. Return how many distinct denomination types are used at least once.',
    constraints: ['1 <= denoms.length <= 20', '0 <= amt <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'denoms = [100, 50, 20, 10, 1], amt = 130', output: '3' },
      { title: 'Test Case 2', input: 'denoms = [100, 50, 10], amt = 200', output: '1' },
      { title: 'Test Case 3', input: 'denoms = [100, 10], amt = 0', output: '0' },
      { title: 'Test Case 4', input: 'denoms = [50, 20, 1], amt = 21', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countDistinctNotesUsed(int[] denoms, long amt) {
        int types = 0;
        for (int d : denoms) {
            if (amt >= d) { types++; amt %= d; }
        }
        return types;
    }
}`,
    pythonSolution: `def countDistinctNotesUsed(denoms, amt):
    types = 0
    for d in denoms:
        if amt >= d: types += 1; amt %= d
    return types`
  },
  {
    number: 36,
    title: 'Merchant Category Spend Ranking',
    fnName: 'topSpendCategory',
    description: 'Given category IDs <code>cats</code> and transaction amounts <code>amts</code>, return the category ID with the highest total spend (smallest ID on tie).',
    constraints: ['1 <= cats.length == amts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cats = [1, 2, 1, 3], amts = [100, 250, 200, 300]', output: '1' },
      { title: 'Test Case 2', input: 'cats = [5, 4], amts = [100, 100]', output: '4' },
      { title: 'Test Case 3', input: 'cats = [7], amts = [50]', output: '7' },
      { title: 'Test Case 4', input: 'cats = [2, 2, 1], amts = [10, 20, 25]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int topSpendCategory(int[] cats, int[] amts) {
        Map<Integer, Long> tot = new HashMap<>();
        for (int i = 0; i < cats.length; i++) tot.put(cats[i], tot.getOrDefault(cats[i], 0L) + amts[i]);
        int bestCat = cats[0]; long bestAmt = -1;
        for (var e : tot.entrySet()) {
            if (e.getValue() > bestAmt || (e.getValue() == bestAmt && e.getKey() < bestCat)) {
                bestAmt = e.getValue(); bestCat = e.getKey();
            }
        }
        return bestCat;
    }
}`,
    pythonSolution: `from collections import defaultdict
def topSpendCategory(cats, amts):
    tot = defaultdict(int)
    for c, a in zip(cats, amts): tot[c] += a
    return min(tot.keys(), key=lambda c: (-tot[c], c))`
  },
  {
    number: 37,
    title: 'KYC Document Verification Queue',
    fnName: 'minVerificationTime',
    description: '<code>n</code> KYC documents take <code>times[i]</code> minutes each and are processed by <code>2</code> identical officers greedily (always assigning the next document in order to the officer finishing earliest). Return total time until all finish.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [5, 3, 4, 2]', output: '7' },
      { title: 'Test Case 2', input: 'times = [10]', output: '10' },
      { title: 'Test Case 3', input: 'times = [4, 4, 4, 4]', output: '8' },
      { title: 'Test Case 4', input: 'times = [1, 10, 2]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long minVerificationTime(int[] times) {
        long a = 0, b = 0;
        for (int t : times) {
            if (a <= b) a += t; else b += t;
        }
        return Math.max(a, b);
    }
}`,
    pythonSolution: `def minVerificationTime(times):
    a = b = 0
    for t in times:
        if a <= b: a += t
        else: b += t
    return max(a, b)`
  },
  {
    number: 38,
    title: 'Savings Goal Streak Counter',
    fnName: 'longestSavingsStreak',
    description: 'Given daily net deposits <code>deposits</code>, return the longest consecutive days with deposit <code>&gt;= minDaily</code>.',
    constraints: ['1 <= deposits.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'deposits = [10, 20, 5, 15, 25, 30], minDaily = 15', output: '3' },
      { title: 'Test Case 2', input: 'deposits = [1, 2, 3], minDaily = 10', output: '0' },
      { title: 'Test Case 3', input: 'deposits = [50, 50], minDaily = 50', output: '2' },
      { title: 'Test Case 4', input: 'deposits = [0], minDaily = 0', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestSavingsStreak(int[] deposits, int minDaily) {
        int cur = 0, best = 0;
        for (int d : deposits) {
            cur = (d >= minDaily) ? cur + 1 : 0;
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def longestSavingsStreak(deposits, minDaily):
    cur = best = 0
    for d in deposits:
        cur = cur + 1 if d >= minDaily else 0
        best = max(best, cur)
    return best`
  },
  {
    number: 39,
    title: 'Routing Number Checksum',
    fnName: 'countValidRoutingNumbers',
    description: 'A 9-digit US ABA routing number <code>d0..d8</code> is valid if <code>(3*(d0+d3+d6) + 7*(d1+d4+d7) + (d2+d5+d8)) % 10 == 0</code>. Count valid 9-digit strings in <code>nums</code>.',
    constraints: ['1 <= nums.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = ["021000021", "123456789"]', output: '1' },
      { title: 'Test Case 2', input: 'nums = ["000000000"]', output: '1' },
      { title: 'Test Case 3', input: 'nums = ["111111111"]', output: '0' },
      { title: 'Test Case 4', input: 'nums = ["12345"]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countValidRoutingNumbers(String[] nums) {
        int ok = 0;
        for (String s : nums) {
            if (s.length() != 9) continue;
            int[] d = new int[9];
            boolean digits = true;
            for (int i = 0; i < 9; i++) {
                if (!Character.isDigit(s.charAt(i))) { digits = false; break; }
                d[i] = s.charAt(i) - '0';
            }
            if (!digits) continue;
            int sum = 3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + (d[2] + d[5] + d[8]);
            if (sum % 10 == 0) ok++;
        }
        return ok;
    }
}`,
    pythonSolution: `def countValidRoutingNumbers(nums):
    ok = 0
    for s in nums:
        if len(s) == 9 and s.isdigit():
            d = [int(c) for c in s]
            if (3*(d[0]+d[3]+d[6]) + 7*(d[1]+d[4]+d[7]) + (d[2]+d[5]+d[8])) % 10 == 0:
                ok += 1
    return ok`
  },
  {
    number: 40,
    title: 'Two-Factor OTP Collision Count',
    fnName: 'countDuplicateOtps',
    description: 'Given generated OTP integers <code>otps</code>, return how many entries are duplicates of an earlier OTP in the array.',
    constraints: ['1 <= otps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'otps = [1234, 5678, 1234, 9999, 5678]', output: '2' },
      { title: 'Test Case 2', input: 'otps = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'otps = [42, 42, 42]', output: '2' },
      { title: 'Test Case 4', input: 'otps = [10]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDuplicateOtps(int[] otps) {
        Set<Integer> seen = new HashSet<>();
        int dup = 0;
        for (int o : otps) if (!seen.add(o)) dup++;
        return dup;
    }
}`,
    pythonSolution: `def countDuplicateOtps(otps):
    return len(otps) - len(set(otps))`
  },
  {
    number: 41,
    title: 'Minimum Card Swipes to Clear Fee',
    fnName: 'minSwipesToWaiveFee',
    description: 'A credit card waives its annual fee once total spend reaches <code>target</code>. Given sorted transaction amounts <code>spends</code> (or any order — pick largest first), return the minimum number of transactions needed to reach <code>&gt;= target</code>, or <code>-1</code> if total spend is insufficient.',
    constraints: ['1 <= spends.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'spends = [100, 400, 200, 300], target = 650', output: '2' },
      { title: 'Test Case 2', input: 'spends = [50, 50], target = 200', output: '-1' },
      { title: 'Test Case 3', input: 'spends = [100], target = 0', output: '0' },
      { title: 'Test Case 4', input: 'spends = [500], target = 500', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minSwipesToWaiveFee(int[] spends, long target) {
        if (target <= 0) return 0;
        Arrays.sort(spends);
        long s = 0; int cnt = 0;
        for (int i = spends.length - 1; i >= 0; i--) {
            s += spends[i]; cnt++;
            if (s >= target) return cnt;
        }
        return -1;
    }
}`,
    pythonSolution: `def minSwipesToWaiveFee(spends, target):
    if target <= 0: return 0
    s = cnt = 0
    for x in sorted(spends, reverse=True):
        s += x; cnt += 1
        if s >= target: return cnt
    return -1`
  },
  {
    number: 42,
    title: 'Direct Deposit Split Count',
    fnName: 'countMatchedAccountPairs',
    description: 'Given paycheck amounts <code>checks</code> and savings goal <code>target</code>, count how many pairs <code>(i, j)</code> with <code>i &lt; j</code> satisfy <code>checks[i] + checks[j] &gt;= target</code>.',
    constraints: ['1 <= checks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'checks = [100, 200, 300, 400], target = 500', output: '4' },
      { title: 'Test Case 2', input: 'checks = [10, 20], target = 100', output: '0' },
      { title: 'Test Case 3', input: 'checks = [50, 50, 50], target = 100', output: '3' },
      { title: 'Test Case 4', input: 'checks = [10], target = 10', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countMatchedAccountPairs(int[] checks, long target) {
        Arrays.sort(checks);
        int l = 0, r = checks.length - 1; long cnt = 0;
        while (l < r) {
            if ((long) checks[l] + checks[r] >= target) { cnt += r - l; r--; }
            else l++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countMatchedAccountPairs(checks, target):
    checks.sort()
    l, r, cnt = 0, len(checks) - 1, 0
    while l < r:
        if checks[l] + checks[r] >= target: cnt += r - l; r -= 1
        else: l += 1
    return cnt`
  },
  {
    number: 43,
    title: 'Vault Combination Lock Turns',
    fnName: 'minLockDialTurns',
    description: 'A circular 10-digit dial (0..9) starts at string <code>start</code> and must reach <code>target</code> (same length). Each wheel can rotate +1 or -1 mod 10. Return minimum total rotations across all wheels.',
    constraints: ['1 <= start.length == target.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'start = "0000", target = "1925"', output: '9' },
      { title: 'Test Case 2', input: 'start = "123", target = "123"', output: '0' },
      { title: 'Test Case 3', input: 'start = "0", target = "9"', output: '1' },
      { title: 'Test Case 4', input: 'start = "55", target = "00"', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static int minLockDialTurns(String start, String target) {
        int turns = 0;
        for (int i = 0; i < start.length(); i++) {
            int d = Math.abs(start.charAt(i) - target.charAt(i));
            turns += Math.min(d, 10 - d);
        }
        return turns;
    }
}`,
    pythonSolution: `def minLockDialTurns(start, target):
    return sum(min(abs(int(a) - int(b)), 10 - abs(int(a) - int(b))) for a, b in zip(start, target))`
  },
  {
    number: 44,
    title: 'Escrow Milestone Release Check',
    fnName: 'countReleasedMilestones',
    description: 'Given cumulative escrow deposits <code>deposits</code> (non-negative) and sorted milestone thresholds <code>milestones</code>, return how many milestones are unlocked once all deposits arrive.',
    constraints: ['1 <= deposits.length, milestones.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'deposits = [100, 250, 150], milestones = [100, 300, 500, 800]', output: '3' },
      { title: 'Test Case 2', input: 'deposits = [10, 20], milestones = [50, 100]', output: '0' },
      { title: 'Test Case 3', input: 'deposits = [500], milestones = [100, 200]', output: '2' },
      { title: 'Test Case 4', input: 'deposits = [0], milestones = [1]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countReleasedMilestones(int[] deposits, int[] milestones) {
        long tot = 0;
        for (int d : deposits) tot += d;
        int cnt = 0;
        for (int m : milestones) if (tot >= m) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countReleasedMilestones(deposits, milestones):
    tot = sum(deposits)
    return sum(1 for m in milestones if tot >= m)`
  },
  {
    number: 45,
    title: 'Branch Network Latency Diameter',
    fnName: 'maxLatencyFromHub',
    description: 'Given <code>n</code> branches (0..n-1) and weighted undirected links <code>links</code> <code>[u, v, ms]</code>, return the maximum shortest-path latency from central hub <code>0</code> to any reachable branch (<code>0</code> if only 0 is reachable).',
    constraints: ['1 <= n <= 500', '0 <= links.length <= 2000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, links = [[0, 1, 10], [1, 2, 15], [0, 3, 5], [3, 2, 10]]', output: '15' },
      { title: 'Test Case 2', input: 'n = 3, links = [[0, 1, 7]]', output: '7' },
      { title: 'Test Case 3', input: 'n = 1, links = []', output: '0' },
      { title: 'Test Case 4', input: 'n = 2, links = [[0, 1, 25]]', output: '25' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long maxLatencyFromHub(int n, int[][] links) {
        List<List<int[]>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] l : links) { g.get(l[0]).add(new int[]{l[1], l[2]}); g.get(l[1]).add(new int[]{l[0], l[2]}); }
        long[] dist = new long[n]; Arrays.fill(dist, Long.MAX_VALUE);
        dist[0] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        pq.add(new long[]{0, 0});
        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            int u = (int) cur[1];
            if (cur[0] > dist[u]) continue;
            for (int[] e : g.get(u)) {
                if (dist[u] + e[1] < dist[e[0]]) {
                    dist[e[0]] = dist[u] + e[1];
                    pq.add(new long[]{dist[e[0]], e[0]});
                }
            }
        }
        long best = 0;
        for (long d : dist) if (d < Long.MAX_VALUE) best = Math.max(best, d);
        return best;
    }
}`,
    pythonSolution: `import heapq
def maxLatencyFromHub(n, links):
    g = [[] for _ in range(n)]
    for u, v, w in links: g[u].append((v, w)); g[v].append((u, w))
    dist = [float('inf')] * n; dist[0] = 0
    pq = [(0, 0)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in g[u]:
            if d + w < dist[v]: dist[v] = d + w; heapq.heappush(pq, (dist[v], v))
    return max(d for d in dist if d < float('inf'))`
  },
  {
    number: 46,
    title: 'Payroll Direct-Deposit Day',
    fnName: 'countEarlyPaydays',
    description: 'Scheduled paydays <code>sched</code> fall on day-of-week <code>0..6</code> (where 5=Sat, 6=Sun). Whenever a payday falls on Sat or Sun, payroll runs early on Friday. Return how many paydays run early.',
    constraints: ['1 <= sched.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sched = [0, 4, 5, 6, 2]', output: '2' },
      { title: 'Test Case 2', input: 'sched = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'sched = [5, 6, 5]', output: '3' },
      { title: 'Test Case 4', input: 'sched = [4]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countEarlyPaydays(int[] sched) {
        int cnt = 0;
        for (int d : sched) if (d == 5 || d == 6) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countEarlyPaydays(sched):
    return sum(1 for d in sched if d in (5, 6))`
  },
  {
    number: 47,
    title: 'Bank Statement Running Balance Min',
    fnName: 'minRequiredStartingBalance',
    description: 'Given a sequence of account deltas <code>deltas</code>, return the minimum non-negative starting balance so that the running balance never drops below <code>0</code>.',
    constraints: ['1 <= deltas.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'deltas = [-3, 2, -3, 4, 2]', output: '4' },
      { title: 'Test Case 2', input: 'deltas = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'deltas = [-5, -5]', output: '10' },
      { title: 'Test Case 4', input: 'deltas = [5, -5]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minRequiredStartingBalance(int[] deltas) {
        long cur = 0, minPref = 0;
        for (int d : deltas) { cur += d; minPref = Math.min(minPref, cur); }
        return -minPref;
    }
}`,
    pythonSolution: `def minRequiredStartingBalance(deltas):
    cur = mn = 0
    for d in deltas: cur += d; mn = min(mn, cur)
    return -mn`
  },
  {
    number: 48,
    title: 'Tax Bracket Marginal Liability',
    fnName: 'computeFlatMarginalTax',
    description: 'Income up to <code>exempt</code> is taxed at 0%; income above <code>exempt</code> up to <code>cap</code> is taxed at <code>lowPct</code>%; income above <code>cap</code> is taxed at <code>highPct</code>% (integer floor at end). Return total tax.',
    constraints: ['0 <= exempt <= cap <= 10^9', '0 <= income <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'income = 1000, exempt = 200, cap = 600, lowPct = 10, highPct = 20', output: '120' },
      { title: 'Test Case 2', input: 'income = 150, exempt = 200, cap = 600, lowPct = 10, highPct = 20', output: '0' },
      { title: 'Test Case 3', input: 'income = 400, exempt = 200, cap = 600, lowPct = 10, highPct = 20', output: '20' },
      { title: 'Test Case 4', input: 'income = 600, exempt = 200, cap = 600, lowPct = 10, highPct = 20', output: '40' }
    ],
    javaSolution: `public class Solution {
    public static long computeFlatMarginalTax(long income, long exempt, long cap, int lowPct, int highPct) {
        long t1 = Math.max(0L, Math.min(income, cap) - exempt) * lowPct;
        long t2 = Math.max(0L, income - cap) * highPct;
        return (t1 + t2) / 100;
    }
}`,
    pythonSolution: `def computeFlatMarginalTax(income, exempt, cap, lowPct, highPct):
    t1 = max(0, min(income, cap) - exempt) * lowPct
    t2 = max(0, income - cap) * highPct
    return (t1 + t2) // 100`
  },
  {
    number: 49,
    title: 'NGO Donation Matching Cap',
    fnName: 'totalMatchedDonation',
    description: 'JPMorgan matches employee donations <code>donations</code> dollar-for-dollar up to <code>perEmpCap</code> per employee. Return total matched amount across all employees.',
    constraints: ['1 <= donations.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'donations = [100, 600, 300], perEmpCap = 500', output: '900' },
      { title: 'Test Case 2', input: 'donations = [50, 50], perEmpCap = 100', output: '100' },
      { title: 'Test Case 3', input: 'donations = [1000], perEmpCap = 250', output: '250' },
      { title: 'Test Case 4', input: 'donations = [0], perEmpCap = 500', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalMatchedDonation(int[] donations, int perEmpCap) {
        long tot = 0;
        for (int d : donations) tot += Math.min(d, perEmpCap);
        return tot;
    }
}`,
    pythonSolution: `def totalMatchedDonation(donations, perEmpCap):
    return sum(min(d, perEmpCap) for d in donations)`
  },
  {
    number: 50,
    title: 'Clearinghouse Net Settlement Pairs',
    fnName: 'sumPositiveNetPositions',
    description: 'Given directed inter-bank payments <code>payments</code> <code>[from, to, amt]</code> across <code>n</code> banks, return the sum of positive net balances across all banks.',
    constraints: ['1 <= n <= 10^4', '0 <= payments.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, payments = [[0, 1, 100], [1, 2, 40], [2, 0, 10]]', output: '90' },
      { title: 'Test Case 2', input: 'n = 2, payments = [[0, 1, 50], [1, 0, 50]]', output: '0' },
      { title: 'Test Case 3', input: 'n = 2, payments = []', output: '0' },
      { title: 'Test Case 4', input: 'n = 3, payments = [[0, 1, 25], [0, 2, 25]]', output: '50' }
    ],
    javaSolution: `public class Solution {
    public static long sumPositiveNetPositions(int n, int[][] payments) {
        long[] net = new long[n];
        for (int[] p : payments) { net[p[0]] -= p[2]; net[p[1]] += p[2]; }
        long ans = 0;
        for (long v : net) if (v > 0) ans += v;
        return ans;
    }
}`,
    pythonSolution: `def sumPositiveNetPositions(n, payments):
    net = [0] * n
    for u, v, a in payments: net[u] -= a; net[v] += a
    return sum(v for v in net if v > 0)`
  }
];
