export const PAYPAL_QUESTIONS = [
  {
    number: 1,
    title: 'Idempotency Key Deduplication',
    fnName: 'uniqueChargeAmount',
    description: 'PayPal\'s payment gateway receives charge requests with idempotency keys <code>keys</code> and amounts <code>amounts</code> (duplicate keys represent network retries of the same amount). Return the sum of amounts for distinct idempotency keys.',
    constraints: ['1 <= keys.length == amounts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'keys = [101, 102, 101, 103], amounts = [500, 200, 500, 100]', output: '800' },
      { title: 'Test Case 2', input: 'keys = [7, 7, 7], amounts = [99, 99, 99]', output: '99' },
      { title: 'Test Case 3', input: 'keys = [1], amounts = [42]', output: '42' },
      { title: 'Test Case 4', input: 'keys = [1, 2, 3], amounts = [10, 20, 30]', output: '60' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long uniqueChargeAmount(int[] keys, int[] amounts) {
        Set<Integer> seen = new HashSet<>();
        long tot = 0;
        for (int i = 0; i < keys.length; i++) if (seen.add(keys[i])) tot += amounts[i];
        return tot;
    }
}`,
    pythonSolution: `def uniqueChargeAmount(keys, amounts):
    seen = set(); tot = 0
    for k, a in zip(keys, amounts):
        if k not in seen: seen.add(k); tot += a
    return tot`
  },
  {
    number: 2,
    title: 'Checkout Rate-Limiter Window',
    fnName: 'countAcceptedRequests',
    description: 'A merchant endpoint allows at most <code>limit</code> requests in any sliding window <code>[t - window, t]</code>. Given sorted request timestamps <code>times</code>, process each request: accept if fewer than <code>limit</code> accepted requests exist in <code>[t - window, t]</code>, else drop. Return total accepted requests.',
    constraints: ['1 <= times.length <= 10^5', '1 <= limit <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [1, 2, 3, 4, 10], window = 5, limit = 2', output: '3' },
      { title: 'Test Case 2', input: 'times = [0, 10, 20], window = 5, limit = 1', output: '3' },
      { title: 'Test Case 3', input: 'times = [1, 1, 1], window = 10, limit = 2', output: '2' },
      { title: 'Test Case 4', input: 'times = [5], window = 1, limit = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countAcceptedRequests(int[] times, int window, int limit) {
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
def countAcceptedRequests(times, window, limit):
    q = deque(); ok = 0
    for t in times:
        while q and t - q[0] > window: q.popleft()
        if len(q) < limit: q.append(t); ok += 1
    return ok`
  },
  {
    number: 3,
    title: 'Fraud Velocity Spike Detector',
    fnName: 'countVelocityBreaches',
    description: 'Given sorted transaction timestamps <code>times</code> and amounts <code>amts</code>, flag transaction <code>i</code> if the total amount in <code>[times[i] - win, times[i]]</code> strictly exceeds <code>maxAmt</code>. Return total flagged transactions.',
    constraints: ['1 <= times.length == amts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [1, 3, 4, 10], amts = [300, 400, 500, 200], win = 3, maxAmt = 800', output: '1' },
      { title: 'Test Case 2', input: 'times = [0, 5, 10], amts = [100, 100, 100], win = 2, maxAmt = 100', output: '0' },
      { title: 'Test Case 3', input: 'times = [1, 2], amts = [500, 500], win = 5, maxAmt = 900', output: '1' },
      { title: 'Test Case 4', input: 'times = [1], amts = [1000], win = 1, maxAmt = 500', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countVelocityBreaches(int[] times, int[] amts, int win, long maxAmt) {
        long cur = 0; int l = 0, flags = 0;
        for (int r = 0; r < times.length; r++) {
            cur += amts[r];
            while (times[r] - times[l] > win) cur -= amts[l++];
            if (cur > maxAmt) flags++;
        }
        return flags;
    }
}`,
    pythonSolution: `def countVelocityBreaches(times, amts, win, maxAmt):
    cur = l = flags = 0
    for r, (t, a) in enumerate(zip(times, amts)):
        cur += a
        while t - times[l] > win: cur -= amts[l]; l += 1
        if cur > maxAmt: flags += 1
    return flags`
  },
  {
    number: 4,
    title: 'Merchant Fee Tiered Deduction',
    fnName: 'netMerchantSettlement',
    description: 'For each payment in <code>amounts</code>, PayPal deducts <code>pct</code>% (integer floor) plus flat fee <code>flat</code> (clamped at 0 if negative). Return total net settlement.',
    constraints: ['1 <= amounts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [1000, 50, 200], pct = 3, flat = 30', output: '1123' },
      { title: 'Test Case 2', input: 'amounts = [20], pct = 5, flat = 30', output: '0' },
      { title: 'Test Case 3', input: 'amounts = [100], pct = 0, flat = 0', output: '100' },
      { title: 'Test Case 4', input: 'amounts = [500, 500], pct = 2, flat = 10', output: '960' }
    ],
    javaSolution: `public class Solution {
    public static long netMerchantSettlement(int[] amounts, int pct, int flat) {
        long tot = 0;
        for (int a : amounts) {
            long net = a - ((long) a * pct) / 100 - flat;
            tot += Math.max(0L, net);
        }
        return tot;
    }
}`,
    pythonSolution: `def netMerchantSettlement(amounts, pct, flat):
    return sum(max(0, a - (a * pct) // 100 - flat) for a in amounts)`
  },
  {
    number: 5,
    title: 'Escrow Hold Release Sum',
    fnName: 'releasedEscrowTotal',
    description: 'Given escrow records <code>[amount, releaseDay]</code> in <code>holds</code> and current day <code>today</code>, return the total amount eligible for release (<code>releaseDay <= today</code>).',
    constraints: ['1 <= holds.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'holds = [[500, 10], [300, 15], [200, 12]], today = 12', output: '700' },
      { title: 'Test Case 2', input: 'holds = [[100, 20]], today = 10', output: '0' },
      { title: 'Test Case 3', input: 'holds = [[250, 5], [250, 5]], today = 5', output: '500' },
      { title: 'Test Case 4', input: 'holds = [[40, 1]], today = 100', output: '40' }
    ],
    javaSolution: `public class Solution {
    public static long releasedEscrowTotal(int[][] holds, int today) {
        long s = 0;
        for (int[] h : holds) if (h[1] <= today) s += h[0];
        return s;
    }
}`,
    pythonSolution: `def releasedEscrowTotal(holds, today):
    return sum(a for a, d in holds if d <= today)`
  },
  {
    number: 6,
    title: 'Ledger Reconciliation Mismatch',
    fnName: 'countUnmatchedSettlements',
    description: 'Given authorized transaction IDs <code>authIds</code> and settled transaction IDs <code>settledIds</code>, return how many authorized IDs are NOT yet settled.',
    constraints: ['1 <= authIds.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'authIds = [10, 20, 30, 40], settledIds = [20, 40]', output: '2' },
      { title: 'Test Case 2', input: 'authIds = [1, 2], settledIds = [1, 2]', output: '0' },
      { title: 'Test Case 3', input: 'authIds = [5, 6], settledIds = []', output: '2' },
      { title: 'Test Case 4', input: 'authIds = [9], settledIds = [9, 10]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUnmatchedSettlements(int[] authIds, int[] settledIds) {
        Set<Integer> s = new HashSet<>();
        for (int id : settledIds) s.add(id);
        int miss = 0;
        for (int id : authIds) if (!s.contains(id)) miss++;
        return miss;
    }
}`,
    pythonSolution: `def countUnmatchedSettlements(authIds, settledIds):
    s = set(settledIds)
    return sum(1 for x in authIds if x not in s)`
  },
  {
    number: 7,
    title: 'Chargeback Dispute Rate Alert',
    fnName: 'countHighDisputeMerchants',
    description: 'Given merchant dispute counts <code>disputes</code> and total transactions <code>txns</code>, flag merchants with dispute rate strictly above <code>maxPct</code>% (<code>disputes[i] * 100 > maxPct * txns[i]</code>). Count flagged merchants.',
    constraints: ['1 <= disputes.length == txns.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'disputes = [5, 1, 10], txns = [100, 100, 500], maxPct = 2', output: '1' },
      { title: 'Test Case 2', input: 'disputes = [2, 2], txns = [100, 200], maxPct = 2', output: '0' },
      { title: 'Test Case 3', input: 'disputes = [3], txns = [100], maxPct = 2', output: '1' },
      { title: 'Test Case 4', input: 'disputes = [0], txns = [50], maxPct = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countHighDisputeMerchants(int[] disputes, int[] txns, int maxPct) {
        int cnt = 0;
        for (int i = 0; i < disputes.length; i++) if ((long) disputes[i] * 100 > (long) maxPct * txns[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countHighDisputeMerchants(disputes, txns, maxPct):
    return sum(1 for d, t in zip(disputes, txns) if d * 100 > maxPct * t)`
  },
  {
    number: 8,
    title: 'Peer-to-Peer Split Payment',
    fnName: 'countOverpaidParticipants',
    description: 'A group dinner bill is split equally among <code>n</code> friends who paid <code>paid[i]</code> each (total divisible by <code>n</code>). Return how many friends paid strictly more than their fair share.',
    constraints: ['1 <= paid.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'paid = [10, 30, 20]', output: '1' },
      { title: 'Test Case 2', input: 'paid = [25, 25, 25]', output: '0' },
      { title: 'Test Case 3', input: 'paid = [0, 40, 20]', output: '1' },
      { title: 'Test Case 4', input: 'paid = [100]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countOverpaidParticipants(int[] paid) {
        long s = 0; for (int p : paid) s += p;
        long share = s / paid.length;
        int cnt = 0;
        for (int p : paid) if (p > share) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countOverpaidParticipants(paid):
    share = sum(paid) // len(paid)
    return sum(1 for p in paid if p > share)`
  },
  {
    number: 9,
    title: 'Webhook Delivery Retry Backoff',
    fnName: 'totalRetryDelaySeconds',
    description: 'Failed webhook attempts wait <code>base * 2^i</code> seconds before retry <code>i</code> (<code>i = 0..retries-1</code>). Given <code>base</code> and <code>retries</code>, return total wait seconds.',
    constraints: ['1 <= base <= 10^4', '0 <= retries <= 30'],
    testCases: [
      { title: 'Test Case 1', input: 'base = 5, retries = 3', output: '35' },
      { title: 'Test Case 2', input: 'base = 10, retries = 0', output: '0' },
      { title: 'Test Case 3', input: 'base = 1, retries = 4', output: '15' },
      { title: 'Test Case 4', input: 'base = 2, retries = 1', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long totalRetryDelaySeconds(long base, int retries) {
        return base * ((1L << retries) - 1);
    }
}`,
    pythonSolution: `def totalRetryDelaySeconds(base, retries):
    return base * ((1 << retries) - 1)`
  },
  {
    number: 10,
    title: 'Multi-Currency Wallet Total',
    fnName: 'totalWalletValueInUsd',
    description: 'Given wallet balances <code>bals</code> in different currencies and integer exchange multipliers <code>rates</code> to USD cents, return total USD cents.',
    constraints: ['1 <= bals.length == rates.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bals = [100, 50], rates = [1, 2]', output: '200' },
      { title: 'Test Case 2', input: 'bals = [0, 10], rates = [5, 0]', output: '0' },
      { title: 'Test Case 3', input: 'bals = [25], rates = [4]', output: '100' },
      { title: 'Test Case 4', input: 'bals = [1, 2, 3], rates = [10, 20, 30]', output: '140' }
    ],
    javaSolution: `public class Solution {
    public static long totalWalletValueInUsd(int[] bals, int[] rates) {
        long tot = 0;
        for (int i = 0; i < bals.length; i++) tot += (long) bals[i] * rates[i];
        return tot;
    }
}`,
    pythonSolution: `def totalWalletValueInUsd(bals, rates):
    return sum(b * r for b, r in zip(bals, rates))`
  },
  {
    number: 11,
    title: 'Pay-In-4 Installment Schedule',
    fnName: 'countOnTimeInstallments',
    description: 'An installment is on time if <code>paidDay[i] <= dueDay[i]</code>. Return how many installments were paid on time.',
    constraints: ['1 <= paidDay.length == dueDay.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'paidDay = [10, 25, 30, 45], dueDay = [10, 20, 35, 45]', output: '3' },
      { title: 'Test Case 2', input: 'paidDay = [15, 25], dueDay = [10, 20]', output: '0' },
      { title: 'Test Case 3', input: 'paidDay = [5], dueDay = [5]', output: '1' },
      { title: 'Test Case 4', input: 'paidDay = [1, 2], dueDay = [2, 3]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countOnTimeInstallments(int[] paidDay, int[] dueDay) {
        int ok = 0;
        for (int i = 0; i < paidDay.length; i++) if (paidDay[i] <= dueDay[i]) ok++;
        return ok;
    }
}`,
    pythonSolution: `def countOnTimeInstallments(paidDay, dueDay):
    return sum(1 for p, d in zip(paidDay, dueDay) if p <= d)`
  },
  {
    number: 12,
    title: 'Micro-Deposit Account Verification',
    fnName: 'matchesVerificationDeposits',
    description: 'A bank verification sends 2 micro-deposits <code>[d1, d2]</code>. Given user-entered amounts <code>[u1, u2]</code> (in any order), return <code>true</code> if they match the multiset <code>{d1, d2}</code>, else <code>false</code>.',
    constraints: ['1 <= d1, d2, u1, u2 <= 99'],
    testCases: [
      { title: 'Test Case 1', input: 'd1 = 12, d2 = 34, u1 = 34, u2 = 12', output: 'true' },
      { title: 'Test Case 2', input: 'd1 = 10, d2 = 10, u1 = 10, u2 = 20', output: 'false' },
      { title: 'Test Case 3', input: 'd1 = 5, d2 = 9, u1 = 5, u2 = 9', output: 'true' },
      { title: 'Test Case 4', input: 'd1 = 1, d2 = 2, u1 = 3, u2 = 4', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean matchesVerificationDeposits(int d1, int d2, int u1, int u2) {
        return (d1 == u1 && d2 == u2) || (d1 == u2 && d2 == u1);
    }
}`,
    pythonSolution: `def matchesVerificationDeposits(d1, d2, u1, u2):
    return sorted([d1, d2]) == sorted([u1, u2])`
  },
  {
    number: 13,
    title: 'Subscription Billing Active Count',
    fnName: 'countActiveSubscriptions',
    description: 'Given subscription intervals <code>subs</code> <code>[startDay, endDay]</code> (inclusive) and query day <code>day</code>, return how many subscriptions are active on <code>day</code>.',
    constraints: ['1 <= subs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'subs = [[1, 10], [5, 20], [15, 30]], day = 10', output: '2' },
      { title: 'Test Case 2', input: 'subs = [[1, 5]], day = 6', output: '0' },
      { title: 'Test Case 3', input: 'subs = [[10, 10]], day = 10', output: '1' },
      { title: 'Test Case 4', input: 'subs = [[1, 100], [50, 60]], day = 55', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countActiveSubscriptions(int[][] subs, int day) {
        int cnt = 0;
        for (int[] s : subs) if (s[0] <= day && day <= s[1]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countActiveSubscriptions(subs, day):
    return sum(1 for a, b in subs if a <= day <= b)`
  },
  {
    number: 14,
    title: 'Tokenized Card Vault Collision',
    fnName: 'countTokenCollisions',
    description: 'Given generated card token IDs <code>tokens</code>, return how many tokens appear more than once.',
    constraints: ['1 <= tokens.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tokens = [10, 20, 10, 30, 20, 10]', output: '2' },
      { title: 'Test Case 2', input: 'tokens = [1, 2, 3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'tokens = [5, 5, 5]', output: '1' },
      { title: 'Test Case 4', input: 'tokens = [9]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countTokenCollisions(int[] tokens) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int t : tokens) freq.put(t, freq.getOrDefault(t, 0) + 1);
        int dup = 0;
        for (int c : freq.values()) if (c > 1) dup++;
        return dup;
    }
}`,
    pythonSolution: `from collections import Counter
def countTokenCollisions(tokens):
    return sum(1 for c in Counter(tokens).values() if c > 1)`
  },
  {
    number: 15,
    title: 'Cross-Border Remittance Cap',
    fnName: 'minTransfersForAmount',
    description: 'A user must remit <code>target</code> total using transfers of at most <code>maxPerTxn</code> each. Return minimum transfers needed.',
    constraints: ['0 <= target <= 10^9', '1 <= maxPerTxn <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'target = 2500, maxPerTxn = 1000', output: '3' },
      { title: 'Test Case 2', input: 'target = 0, maxPerTxn = 500', output: '0' },
      { title: 'Test Case 3', input: 'target = 1000, maxPerTxn = 1000', output: '1' },
      { title: 'Test Case 4', input: 'target = 1, maxPerTxn = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long minTransfersForAmount(long target, long maxPerTxn) {
        return (target + maxPerTxn - 1) / maxPerTxn;
    }
}`,
    pythonSolution: `def minTransfersForAmount(target, maxPerTxn):
    return (target + maxPerTxn - 1) // maxPerTxn`
  },
  {
    number: 16,
    title: 'Refund Chain Net Balance',
    fnName: 'finalCustomerNetSpend',
    description: 'Given signed ledger events <code>events</code> (positive = purchase, negative = refund), return net spend (or <code>0</code> if negative).',
    constraints: ['1 <= events.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'events = [100, 200, -50, -30]', output: '220' },
      { title: 'Test Case 2', input: 'events = [50, -100]', output: '0' },
      { title: 'Test Case 3', input: 'events = [10, 20]', output: '30' },
      { title: 'Test Case 4', input: 'events = [-10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long finalCustomerNetSpend(int[] events) {
        long s = 0;
        for (int e : events) s += e;
        return Math.max(0L, s);
    }
}`,
    pythonSolution: `def finalCustomerNetSpend(events):
    return max(0, sum(events))`
  },
  {
    number: 17,
    title: 'API Gateway Latency P99 Proxy',
    fnName: 'countSlaViolations',
    description: 'Given API response latencies <code>ms</code> and SLA threshold <code>slaMs</code>, return how many requests exceeded <code>slaMs</code>.',
    constraints: ['1 <= ms.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ms = [120, 250, 180, 310], slaMs = 200', output: '2' },
      { title: 'Test Case 2', input: 'ms = [50, 100], slaMs = 100', output: '0' },
      { title: 'Test Case 3', input: 'ms = [500], slaMs = 100', output: '1' },
      { title: 'Test Case 4', input: 'ms = [10, 20], slaMs = 30', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSlaViolations(int[] ms, int slaMs) {
        int bad = 0;
        for (int x : ms) if (x > slaMs) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countSlaViolations(ms, slaMs):
    return sum(1 for x in ms if x > slaMs)`
  },
  {
    number: 18,
    title: 'Merchant Payout Batch Split',
    fnName: 'minPayoutBatches',
    description: 'Merchants have payout amounts <code>payouts</code> (in order). Each bank wire batch can hold at most <code>cap</code> total amount. Return minimum batches needed.',
    constraints: ['1 <= payouts.length <= 10^5', 'max(payouts) <= cap <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'payouts = [400, 500, 300, 600], cap = 900', output: '2' },
      { title: 'Test Case 2', input: 'payouts = [100, 200, 300], cap = 600', output: '1' },
      { title: 'Test Case 3', input: 'payouts = [500, 500], cap = 500', output: '2' },
      { title: 'Test Case 4', input: 'payouts = [50], cap = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minPayoutBatches(int[] payouts, long cap) {
        int batches = 1; long cur = 0;
        for (int p : payouts) {
            if (cur + p > cap) { batches++; cur = p; } else cur += p;
        }
        return batches;
    }
}`,
    pythonSolution: `def minPayoutBatches(payouts, cap):
    b, cur = 1, 0
    for p in payouts:
        if cur + p > cap: b += 1; cur = p
        else: cur += p
    return b`
  },
  {
    number: 19,
    title: 'Fraud Graph Connected Rings',
    fnName: 'countFraudRings',
    description: 'Given <code>n</code> accounts (0..n-1) and shared-device links <code>links</code> <code>[u, v]</code>, count how many connected components have size at least <code>2</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, links = [[0, 1], [1, 2], [3, 4]]', output: '2' },
      { title: 'Test Case 2', input: 'n = 4, links = []', output: '0' },
      { title: 'Test Case 3', input: 'n = 3, links = [[0, 1], [1, 2]]', output: '1' },
      { title: 'Test Case 4', input: 'n = 1, links = []', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countFraudRings(int n, int[][] links) {
        int[] p = new int[n], sz = new int[n];
        for (int i = 0; i < n; i++) { p[i] = i; sz[i] = 1; }
        for (int[] l : links) {
            int ru = find(p, l[0]), rv = find(p, l[1]);
            if (ru != rv) { p[ru] = rv; sz[rv] += sz[ru]; }
        }
        int rings = 0;
        for (int i = 0; i < n; i++) if (p[i] == i && sz[i] >= 2) rings++;
        return rings;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def countFraudRings(n, links):
    p = list(range(n)); sz = [1] * n
    def find(x):
        while p[x] != x: p[x] = p[p[x]]; x = p[x]
        return x
    for u, v in links:
        ru, rv = find(u), find(v)
        if ru != rv: p[ru] = rv; sz[rv] += sz[ru]
    return sum(1 for i in range(n) if p[i] == i and sz[i] >= 2)`
  },
  {
    number: 20,
    title: 'Zero-Fee Promo Eligibility',
    fnName: 'totalZeroFeeSavings',
    description: 'PayPal waives the fee <code>fees[i]</code> on transactions where <code>amounts[i] >= minAmt</code>. Return total fees waived.',
    constraints: ['1 <= amounts.length == fees.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [50, 150, 200], fees = [2, 5, 8], minAmt = 100', output: '13' },
      { title: 'Test Case 2', input: 'amounts = [10, 20], fees = [1, 2], minAmt = 50', output: '0' },
      { title: 'Test Case 3', input: 'amounts = [100], fees = [3], minAmt = 100', output: '3' },
      { title: 'Test Case 4', input: 'amounts = [500, 500], fees = [10, 10], minAmt = 1', output: '20' }
    ],
    javaSolution: `public class Solution {
    public static long totalZeroFeeSavings(int[] amounts, int[] fees, int minAmt) {
        long s = 0;
        for (int i = 0; i < amounts.length; i++) if (amounts[i] >= minAmt) s += fees[i];
        return s;
    }
}`,
    pythonSolution: `def totalZeroFeeSavings(amounts, fees, minAmt):
    return sum(f for a, f in zip(amounts, fees) if a >= minAmt)`
  },
  {
    number: 21,
    title: 'Instant Transfer Fee Cap',
    fnName: 'totalInstantFees',
    description: 'Instant transfer charges <code>pct</code>% (integer floor) of each amount in <code>amounts</code>, capped at <code>maxFee</code> per transfer. Return total fees.',
    constraints: ['1 <= amounts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [100, 1000, 5000], pct = 2, maxFee = 25', output: '47' },
      { title: 'Test Case 2', input: 'amounts = [50, 50], pct = 10, maxFee = 100', output: '10' },
      { title: 'Test Case 3', input: 'amounts = [10000], pct = 5, maxFee = 15', output: '15' },
      { title: 'Test Case 4', input: 'amounts = [0], pct = 2, maxFee = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalInstantFees(int[] amounts, int pct, int maxFee) {
        long tot = 0;
        for (int a : amounts) tot += Math.min((long) maxFee, ((long) a * pct) / 100);
        return tot;
    }
}`,
    pythonSolution: `def totalInstantFees(amounts, pct, maxFee):
    return sum(min(maxFee, (a * pct) // 100) for a in amounts)`
  },
  {
    number: 22,
    title: 'KYC Verification Queue Priority',
    fnName: 'countVipVerifiedFirst',
    description: 'Given user tiers <code>tiers</code> (<code>1</code> = VIP, <code>0</code> = standard) and verification limit <code>k</code>, if all VIPs are processed before standard users, how many VIPs get verified within the first <code>k</code> slots?',
    constraints: ['1 <= tiers.length <= 10^5', '0 <= k <= tiers.length'],
    testCases: [
      { title: 'Test Case 1', input: 'tiers = [0, 1, 0, 1, 1], k = 2', output: '2' },
      { title: 'Test Case 2', input: 'tiers = [0, 1, 0], k = 3', output: '1' },
      { title: 'Test Case 3', input: 'tiers = [1, 1, 1], k = 0', output: '0' },
      { title: 'Test Case 4', input: 'tiers = [0, 0], k = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countVipVerifiedFirst(int[] tiers, int k) {
        int vips = 0;
        for (int t : tiers) if (t == 1) vips++;
        return Math.min(vips, k);
    }
}`,
    pythonSolution: `def countVipVerifiedFirst(tiers, k):
    return min(sum(tiers), k)`
  },
  {
    number: 23,
    title: 'Rolling 24h Transaction Peak',
    fnName: 'maxDailyVolume',
    description: 'Given hourly transaction volumes <code>vols</code>, return the maximum total volume over any <code>k</code> consecutive hours.',
    constraints: ['1 <= k <= vols.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vols = [10, 50, 20, 60, 10], k = 2', output: '80' },
      { title: 'Test Case 2', input: 'vols = [5, 5, 5], k = 3', output: '15' },
      { title: 'Test Case 3', input: 'vols = [100, 1, 1], k = 1', output: '100' },
      { title: 'Test Case 4', input: 'vols = [3, 7, 2], k = 2', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long maxDailyVolume(int[] vols, int k) {
        long cur = 0;
        for (int i = 0; i < k; i++) cur += vols[i];
        long best = cur;
        for (int i = k; i < vols.length; i++) { cur += vols[i] - vols[i - k]; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxDailyVolume(vols, k):
    cur = sum(vols[:k]); best = cur
    for i in range(k, len(vols)):
        cur += vols[i] - vols[i - k]; best = max(best, cur)
    return best`
  },
  {
    number: 24,
    title: 'Split Tender Gift Card + Card',
    fnName: 'remainingCardCharge',
    description: 'A buyer has order total <code>total</code> and applies gift card balances <code>cards</code> in order until <code>total</code> reaches 0. Return the remaining amount to charge to credit card.',
    constraints: ['0 <= cards.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'total = 500, cards = [100, 250]', output: '150' },
      { title: 'Test Case 2', input: 'total = 200, cards = [150, 100]', output: '0' },
      { title: 'Test Case 3', input: 'total = 100, cards = []', output: '100' },
      { title: 'Test Case 4', input: 'total = 0, cards = [50]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long remainingCardCharge(long total, int[] cards) {
        for (int c : cards) total = Math.max(0L, total - c);
        return total;
    }
}`,
    pythonSolution: `def remainingCardCharge(total, cards):
    return max(0, total - sum(cards))`
  },
  {
    number: 25,
    title: 'Payment Link Expiry Check',
    fnName: 'countValidLinks',
    description: 'Payment links have creation times <code>created</code> and TTL <code>ttl</code>. At current time <code>now</code>, a link is valid if <code>now < created[i] + ttl</code>. Count valid links.',
    constraints: ['1 <= created.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'created = [100, 150, 200], ttl = 60, now = 200', output: '2' },
      { title: 'Test Case 2', input: 'created = [10, 20], ttl = 10, now = 30', output: '0' },
      { title: 'Test Case 3', input: 'created = [50], ttl = 10, now = 59', output: '1' },
      { title: 'Test Case 4', input: 'created = [50], ttl = 10, now = 60', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countValidLinks(int[] created, int ttl, int now) {
        int cnt = 0;
        for (int c : created) if ((long) now < (long) c + ttl) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countValidLinks(created, ttl, now):
    return sum(1 for c in created if now < c + ttl)`
  },
  {
    number: 26,
    title: 'Two-Sum Gift Voucher Match',
    fnName: 'hasExactVoucherPair',
    description: 'Given distinct voucher values <code>vouchers</code> and target cart price <code>target</code>, return <code>true</code> if two distinct vouchers sum to <code>target</code>, else <code>false</code>.',
    constraints: ['1 <= vouchers.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vouchers = [10, 25, 40, 75], target = 100', output: 'true' },
      { title: 'Test Case 2', input: 'vouchers = [5, 15, 20], target = 50', output: 'false' },
      { title: 'Test Case 3', input: 'vouchers = [50], target = 100', output: 'false' },
      { title: 'Test Case 4', input: 'vouchers = [1, 2], target = 3', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean hasExactVoucherPair(int[] vouchers, int target) {
        Set<Integer> s = new HashSet<>();
        for (int v : vouchers) { if (s.contains(target - v)) return true; s.add(v); }
        return false;
    }
}`,
    pythonSolution: `def hasExactVoucherPair(vouchers, target):
    s = set()
    for v in vouchers:
        if target - v in s: return True
        s.add(v)
    return False`
  },
  {
    number: 27,
    title: 'Gateway Circuit Breaker Trips',
    fnName: 'countCircuitTrips',
    description: 'Upstream API status array <code>ok</code> has <code>1</code> for success and <code>0</code> for failure. Whenever <code>k</code> consecutive failures occur, the circuit breaker trips and resets its failure counter to 0. Return total trips.',
    constraints: ['1 <= k <= ok.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ok = [0, 0, 1, 0, 0, 0, 0], k = 2', output: '3' },
      { title: 'Test Case 2', input: 'ok = [1, 0, 1, 0], k = 2', output: '0' },
      { title: 'Test Case 3', input: 'ok = [0, 0, 0], k = 3', output: '1' },
      { title: 'Test Case 4', input: 'ok = [1, 1], k = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countCircuitTrips(int[] ok, int k) {
        int fail = 0, trips = 0;
        for (int x : ok) {
            if (x == 0) { fail++; if (fail == k) { trips++; fail = 0; } }
            else fail = 0;
        }
        return trips;
    }
}`,
    pythonSolution: `def countCircuitTrips(ok, k):
    fail = trips = 0
    for x in ok:
        if x == 0:
            fail += 1
            if fail == k: trips += 1; fail = 0
        else: fail = 0
    return trips`
  },
  {
    number: 28,
    title: 'Account Balance Lowest Dip',
    fnName: 'lowestAccountBalance',
    description: 'An account starts with <code>initBal</code> and applies signed transactions <code>txns</code>. Return the lowest balance reached at any point (including initial).',
    constraints: ['1 <= txns.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'initBal = 100, txns = [-40, -80, 150, -30]', output: '-20' },
      { title: 'Test Case 2', input: 'initBal = 50, txns = [10, 20, 30]', output: '50' },
      { title: 'Test Case 3', input: 'initBal = 0, txns = [-5]', output: '-5' },
      { title: 'Test Case 4', input: 'initBal = 200, txns = [-100, 50]', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static long lowestAccountBalance(long initBal, int[] txns) {
        long cur = initBal, best = initBal;
        for (int t : txns) { cur += t; best = Math.min(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def lowestAccountBalance(initBal, txns):
    cur = best = initBal
    for t in txns: cur += t; best = min(best, cur)
    return best`
  },
  {
    number: 29,
    title: 'Cashback Tier Maximum Earned',
    fnName: 'totalTieredCashback',
    description: 'Each purchase <code>p</code> in <code>purchases</code> earns <code>highPct</code>% (integer floor) if <code>p >= thresh</code> else <code>lowPct</code>%. Return total cashback earned.',
    constraints: ['1 <= purchases.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'purchases = [100, 500, 200], thresh = 200, lowPct = 1, highPct = 5', output: '36' },
      { title: 'Test Case 2', input: 'purchases = [50, 50], thresh = 100, lowPct = 2, highPct = 10', output: '2' },
      { title: 'Test Case 3', input: 'purchases = [1000], thresh = 100, lowPct = 1, highPct = 3', output: '30' },
      { title: 'Test Case 4', input: 'purchases = [0], thresh = 10, lowPct = 5, highPct = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalTieredCashback(int[] purchases, int thresh, int lowPct, int highPct) {
        long tot = 0;
        for (int p : purchases) {
            int r = (p >= thresh) ? highPct : lowPct;
            tot += ((long) p * r) / 100;
        }
        return tot;
    }
}`,
    pythonSolution: `def totalTieredCashback(purchases, thresh, lowPct, highPct):
    return sum((p * (highPct if p >= thresh else lowPct)) // 100 for p in purchases)`
  },
  {
    number: 30,
    title: 'Invoice Rounding Penny Diff',
    fnName: 'totalRoundingAdjustment',
    description: 'Given exact amounts in tenths of a cent <code>tenths</code>, each rounded to nearest 10 (round half up: <code>((x + 5) // 10) * 10</code>). Return sum of <code>rounded - x</code>.',
    constraints: ['1 <= tenths.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tenths = [105, 102, 108]', output: '5' },
      { title: 'Test Case 2', input: 'tenths = [100, 200]', output: '0' },
      { title: 'Test Case 3', input: 'tenths = [14]', output: '-4' },
      { title: 'Test Case 4', input: 'tenths = [15]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static long totalRoundingAdjustment(int[] tenths) {
        long diff = 0;
        for (int x : tenths) {
            long r = ((x + 5L) / 10) * 10;
            diff += r - x;
        }
        return diff;
    }
}`,
    pythonSolution: `def totalRoundingAdjustment(tenths):
    return sum(((x + 5) // 10) * 10 - x for x in tenths)`
  },
  {
    number: 31,
    title: 'Merchant Payout Hold Days',
    fnName: 'maxConcurrentHolds',
    description: 'Given payout hold intervals <code>holds</code> <code>[startDay, endDay)</code>, return maximum holds active on the same day.',
    constraints: ['1 <= holds.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'holds = [[1, 5], [2, 6], [4, 7]]', output: '3' },
      { title: 'Test Case 2', input: 'holds = [[1, 3], [3, 5]]', output: '1' },
      { title: 'Test Case 3', input: 'holds = [[0, 10]]', output: '1' },
      { title: 'Test Case 4', input: 'holds = [[1, 4], [2, 3], [5, 8]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxConcurrentHolds(int[][] holds) {
        int n = holds.length;
        int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = holds[i][0]; e[i] = holds[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def maxConcurrentHolds(holds):
    s = sorted(h[0] for h in holds); e = sorted(h[1] for h in holds)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 32,
    title: 'P2P Transfer Graph Longest Chain',
    fnName: 'longestMoneyTrail',
    description: 'Given <code>n</code> accounts and directed DAG money-transfer edges <code>edges</code> <code>[u, v]</code>, return the maximum number of hops in any directed path.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0, 1], [1, 2], [2, 3], [0, 3]]', output: '3' },
      { title: 'Test Case 2', input: 'n = 3, edges = []', output: '0' },
      { title: 'Test Case 3', input: 'n = 3, edges = [[0, 1], [0, 2]]', output: '1' },
      { title: 'Test Case 4', input: 'n = 1, edges = []', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestMoneyTrail(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        int[] ind = new int[n], dp = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); ind[e[1]]++; }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (ind[i] == 0) q.add(i);
        int best = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            best = Math.max(best, dp[u]);
            for (int v : g.get(u)) {
                dp[v] = Math.max(dp[v], dp[u] + 1);
                if (--ind[v] == 0) q.add(v);
            }
        }
        return best;
    }
}`,
    pythonSolution: `from collections import deque
def longestMoneyTrail(n, edges):
    g = [[] for _ in range(n)]; ind = [0] * n; dp = [0] * n
    for u, v in edges: g[u].append(v); ind[v] += 1
    q = deque([i for i in range(n) if ind[i] == 0])
    while q:
        u = q.popleft()
        for v in g[u]:
            dp[v] = max(dp[v], dp[u] + 1); ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return max(dp)`
  },
  {
    number: 33,
    title: 'Checkout Coupon Stack Limit',
    fnName: 'maxCouponDiscount',
    description: 'A buyer has coupons <code>discounts</code> and can apply at most <code>k</code> coupons. Return maximum total discount.',
    constraints: ['1 <= discounts.length <= 10^5', '0 <= k <= discounts.length'],
    testCases: [
      { title: 'Test Case 1', input: 'discounts = [10, 50, 20, 40], k = 2', output: '90' },
      { title: 'Test Case 2', input: 'discounts = [5, 10], k = 0', output: '0' },
      { title: 'Test Case 3', input: 'discounts = [15, 25], k = 2', output: '40' },
      { title: 'Test Case 4', input: 'discounts = [30], k = 1', output: '30' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long maxCouponDiscount(int[] discounts, int k) {
        Arrays.sort(discounts);
        long s = 0;
        for (int i = discounts.length - k; i < discounts.length; i++) s += discounts[i];
        return s;
    }
}`,
    pythonSolution: `def maxCouponDiscount(discounts, k):
    return sum(sorted(discounts, reverse=True)[:k])`
  },
  {
    number: 34,
    title: 'Card BIN Prefix Match',
    fnName: 'countMatchingBinCards',
    description: 'Given card numbers <code>cards</code> and issuer BIN prefix <code>bin</code>, return how many cards start with <code>bin</code>.',
    constraints: ['1 <= cards.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'cards = ["41111100", "51001200", "41119999"], bin = "4111"', output: '2' },
      { title: 'Test Case 2', input: 'cards = ["370000"], bin = "4111"', output: '0' },
      { title: 'Test Case 3', input: 'cards = ["4111"], bin = "4111"', output: '1' },
      { title: 'Test Case 4', input: 'cards = ["1234", "5678"], bin = ""', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countMatchingBinCards(String[] cards, String bin) {
        int cnt = 0;
        for (String c : cards) if (c.startsWith(bin)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countMatchingBinCards(cards, bin):
    return sum(1 for c in cards if c.startswith(bin))`
  },
  {
    number: 35,
    title: 'Batch Settlement Success Ratio',
    fnName: 'countFailedBatches',
    description: 'Given batch success counts <code>ok</code> and total counts <code>tot</code>, a batch fails SLA if <code>ok[i] * 100 < minPct * tot[i]</code>. Return count of failed batches.',
    constraints: ['1 <= ok.length == tot.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ok = [95, 80, 99], tot = [100, 100, 100], minPct = 90', output: '1' },
      { title: 'Test Case 2', input: 'ok = [90, 95], tot = [100, 100], minPct = 90', output: '0' },
      { title: 'Test Case 3', input: 'ok = [0], tot = [10], minPct = 1', output: '1' },
      { title: 'Test Case 4', input: 'ok = [50], tot = [50], minPct = 100', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countFailedBatches(int[] ok, int[] tot, int minPct) {
        int bad = 0;
        for (int i = 0; i < ok.length; i++) if ((long) ok[i] * 100 < (long) minPct * tot[i]) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countFailedBatches(ok, tot, minPct):
    return sum(1 for o, t in zip(ok, tot) if o * 100 < minPct * t)`
  },
  {
    number: 36,
    title: 'Wallet Top-Up Minimum Operations',
    fnName: 'minTopUpsNeeded',
    description: 'A wallet has <code>bal</code> and needs at least <code>target</code>. Each top-up adds <code>step</code>. Return minimum top-ups needed.',
    constraints: ['0 <= bal <= 10^9', '1 <= step <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'bal = 20, target = 55, step = 10', output: '4' },
      { title: 'Test Case 2', input: 'bal = 100, target = 50, step = 10', output: '0' },
      { title: 'Test Case 3', input: 'bal = 0, target = 30, step = 15', output: '2' },
      { title: 'Test Case 4', input: 'bal = 10, target = 10, step = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minTopUpsNeeded(long bal, long target, long step) {
        if (bal >= target) return 0;
        return (target - bal + step - 1) / step;
    }
}`,
    pythonSolution: `def minTopUpsNeeded(bal, target, step):
    return 0 if bal >= target else (target - bal + step - 1) // step`
  },
  {
    number: 37,
    title: 'Duplicate Merchant Account Merge',
    fnName: 'countUniqueMerchants',
    description: 'Given lowercase merchant emails <code>emails</code> (exact string match after trimming spaces), return number of unique emails.',
    constraints: ['1 <= emails.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'emails = ["a@b.com", " a@b.com ", "c@d.com"]', output: '2' },
      { title: 'Test Case 2', input: 'emails = ["x@y.com"]', output: '1' },
      { title: 'Test Case 3', input: 'emails = ["a@a.com", "b@b.com"]', output: '2' },
      { title: 'Test Case 4', input: 'emails = ["z@z.com", "z@z.com"]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUniqueMerchants(String[] emails) {
        Set<String> s = new HashSet<>();
        for (String e : emails) s.add(e.trim());
        return s.size();
    }
}`,
    pythonSolution: `def countUniqueMerchants(emails):
    return len({e.strip() for e in emails})`
  },
  {
    number: 38,
    title: 'Fraud Rule Bitmask Flags',
    fnName: 'countFlaggedByAllRules',
    description: 'Each transaction has risk bitmask <code>flags</code>. Return how many transactions trigger every rule in <code>mask</code>.',
    constraints: ['1 <= flags.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'flags = [7, 5, 3, 15], mask = 5', output: '3' },
      { title: 'Test Case 2', input: 'flags = [1, 2], mask = 4', output: '0' },
      { title: 'Test Case 3', input: 'flags = [0], mask = 0', output: '1' },
      { title: 'Test Case 4', input: 'flags = [6, 7], mask = 6', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countFlaggedByAllRules(int[] flags, int mask) {
        int cnt = 0;
        for (int f : flags) if ((f & mask) == mask) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countFlaggedByAllRules(flags, mask):
    return sum(1 for f in flags if (f & mask) == mask)`
  },
  {
    number: 39,
    title: 'Cross-Currency Arbitrage Check',
    fnName: 'maxSingleConversionGain',
    description: 'Given conversion rates <code>rates</code> (in basis points) over <code>n</code> days, return maximum gain <code>rates[j] - rates[i]</code> for <code>i <= j</code>.',
    constraints: ['1 <= rates.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'rates = [8200, 8100, 8350, 8300]', output: '250' },
      { title: 'Test Case 2', input: 'rates = [100, 90, 80]', output: '0' },
      { title: 'Test Case 3', input: 'rates = [50, 150]', output: '100' },
      { title: 'Test Case 4', input: 'rates = [75]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxSingleConversionGain(int[] rates) {
        int mn = rates[0], best = 0;
        for (int r : rates) { mn = Math.min(mn, r); best = Math.max(best, r - mn); }
        return best;
    }
}`,
    pythonSolution: `def maxSingleConversionGain(rates):
    mn = rates[0]; best = 0
    for r in rates: mn = min(mn, r); best = max(best, r - mn)
    return best`
  },
  {
    number: 40,
    title: 'Dispute Resolution Queue Time',
    fnName: 'totalResolutionTime',
    description: 'Disputes take durations <code>durs</code> sequentially on 1 agent. To minimize total completion time across all disputes, process shortest first. Return total sum of completion times.',
    constraints: ['1 <= durs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'durs = [5, 2, 3]', output: '17' },
      { title: 'Test Case 2', input: 'durs = [10]', output: '10' },
      { title: 'Test Case 3', input: 'durs = [1, 1, 1]', output: '6' },
      { title: 'Test Case 4', input: 'durs = [4, 2]', output: '8' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long totalResolutionTime(int[] durs) {
        Arrays.sort(durs);
        long cur = 0, tot = 0;
        for (int d : durs) { cur += d; tot += cur; }
        return tot;
    }
}`,
    pythonSolution: `def totalResolutionTime(durs):
    cur = tot = 0
    for d in sorted(durs): cur += d; tot += cur
    return tot`
  },
  {
    number: 41,
    title: 'Daily Settlement Cutoff Count',
    fnName: 'countSameDaySettlements',
    description: 'Given submission minutes-from-midnight <code>times</code> and cutoff minute <code>cutoff</code>, count how many transactions settle same-day (<code>times[i] <= cutoff</code>).',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [500, 1020, 1021, 900], cutoff = 1020', output: '3' },
      { title: 'Test Case 2', input: 'times = [1200], cutoff = 1000', output: '0' },
      { title: 'Test Case 3', input: 'times = [0, 100], cutoff = 100', output: '2' },
      { title: 'Test Case 4', input: 'times = [600], cutoff = 599', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSameDaySettlements(int[] times, int cutoff) {
        int cnt = 0;
        for (int t : times) if (t <= cutoff) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countSameDaySettlements(times, cutoff):
    return sum(1 for t in times if t <= cutoff)`
  },
  {
    number: 42,
    title: 'Promo Code Balance Partition',
    fnName: 'canSplitGiftBudget',
    description: 'Given reward amounts <code>rewards</code> (<code>sum <= 5000</code>), return <code>true</code> if they can be partitioned into two subsets with equal sum, else <code>false</code>.',
    constraints: ['1 <= rewards.length <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'rewards = [1, 5, 11, 5]', output: 'true' },
      { title: 'Test Case 2', input: 'rewards = [1, 2, 3, 5]', output: 'false' },
      { title: 'Test Case 3', input: 'rewards = [2, 2]', output: 'true' },
      { title: 'Test Case 4', input: 'rewards = [10]', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean canSplitGiftBudget(int[] rewards) {
        int tot = 0; for (int r : rewards) tot += r;
        if (tot % 2 != 0) return false;
        int half = tot / 2;
        boolean[] dp = new boolean[half + 1]; dp[0] = true;
        for (int r : rewards) for (int s = half; s >= r; s--) if (dp[s - r]) dp[s] = true;
        return dp[half];
    }
}`,
    pythonSolution: `def canSplitGiftBudget(rewards):
    tot = sum(rewards)
    if tot % 2 != 0: return False
    half = tot // 2
    dp = [False] * (half + 1); dp[0] = True
    for r in rewards:
        for s in range(half, r - 1, -1):
            if dp[s - r]: dp[s] = True
    return dp[half]`
  },
  {
    number: 43,
    title: 'API Key Rotation Window',
    fnName: 'countExpiredKeys',
    description: 'API keys have issue times <code>issued</code> and max age <code>maxAge</code>. At time <code>now</code>, a key is expired if <code>now - issued[i] >= maxAge</code>. Count expired keys.',
    constraints: ['1 <= issued.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'issued = [10, 50, 90], maxAge = 40, now = 90', output: '2' },
      { title: 'Test Case 2', input: 'issued = [80, 90], maxAge = 50, now = 100', output: '0' },
      { title: 'Test Case 3', input: 'issued = [0], maxAge = 10, now = 10', output: '1' },
      { title: 'Test Case 4', input: 'issued = [10], maxAge = 10, now = 19', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countExpiredKeys(int[] issued, int maxAge, int now) {
        int cnt = 0;
        for (int t : issued) if ((long) now - t >= maxAge) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countExpiredKeys(issued, maxAge, now):
    return sum(1 for t in issued if now - t >= maxAge)`
  },
  {
    number: 44,
    title: 'Transaction Tag Frequency Top-1',
    fnName: 'mostFrequentPaymentTag',
    description: 'Given integer payment category tags <code>tags</code>, return the most frequent tag (smallest tag on tie).',
    constraints: ['1 <= tags.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tags = [3, 1, 2, 1, 3]', output: '1' },
      { title: 'Test Case 2', input: 'tags = [5]', output: '5' },
      { title: 'Test Case 3', input: 'tags = [4, 4, 2]', output: '4' },
      { title: 'Test Case 4', input: 'tags = [9, 8, 7]', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int mostFrequentPaymentTag(int[] tags) {
        Map<Integer, Integer> freq = new HashMap<>();
        int bestTag = tags[0], bestCnt = 0;
        for (int t : tags) {
            int c = freq.getOrDefault(t, 0) + 1;
            freq.put(t, c);
            if (c > bestCnt || (c == bestCnt && t < bestTag)) { bestCnt = c; bestTag = t; }
        }
        return bestTag;
    }
}`,
    pythonSolution: `from collections import Counter
def mostFrequentPaymentTag(tags):
    cnt = Counter(tags)
    return min(cnt.keys(), key=lambda x: (-cnt[x], x))`
  },
  {
    number: 45,
    title: 'Merchant Reserve Ratio Check',
    fnName: 'totalReserveHold',
    description: 'PayPal holds <code>pct</code>% (integer floor) of each payment in <code>amounts</code> as a rolling reserve. Return total reserve held.',
    constraints: ['1 <= amounts.length <= 10^5', '0 <= pct <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [100, 250, 50], pct = 10', output: '40' },
      { title: 'Test Case 2', input: 'amounts = [9, 9], pct = 10', output: '0' },
      { title: 'Test Case 3', input: 'amounts = [1000], pct = 5', output: '50' },
      { title: 'Test Case 4', input: 'amounts = [200], pct = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalReserveHold(int[] amounts, int pct) {
        long s = 0;
        for (int a : amounts) s += ((long) a * pct) / 100;
        return s;
    }
}`,
    pythonSolution: `def totalReserveHold(amounts, pct):
    return sum((a * pct) // 100 for a in amounts)`
  },
  {
    number: 46,
    title: 'Subarray Sum At Least K',
    fnName: 'minWindowForTargetSpend',
    description: 'Given positive daily spends <code>spends</code> and target <code>target</code>, return the minimum length of a contiguous subarray with sum <code>&gt;= target</code>, or <code>0</code> if impossible.',
    constraints: ['1 <= spends.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'spends = [2, 3, 1, 2, 4, 3], target = 7', output: '2' },
      { title: 'Test Case 2', input: 'spends = [1, 1, 1], target = 10', output: '0' },
      { title: 'Test Case 3', input: 'spends = [5, 5], target = 5', output: '1' },
      { title: 'Test Case 4', input: 'spends = [1, 4, 4], target = 4', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minWindowForTargetSpend(int[] spends, long target) {
        long sum = 0; int l = 0, best = Integer.MAX_VALUE;
        for (int r = 0; r < spends.length; r++) {
            sum += spends[r];
            while (sum >= target) { best = Math.min(best, r - l + 1); sum -= spends[l++]; }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}`,
    pythonSolution: `def minWindowForTargetSpend(spends, target):
    s = l = 0; best = float('inf')
    for r, x in enumerate(spends):
        s += x
        while s >= target:
            best = min(best, r - l + 1); s -= spends[l]; l += 1
    return 0 if best == float('inf') else best`
  },
  {
    number: 47,
    title: 'Chargeback Alert Consecutive Days',
    fnName: 'hasConsecutiveBreaches',
    description: 'Given daily chargeback counts <code>counts</code> and threshold <code>thresh</code>, return <code>true</code> if <code>counts[i] > thresh</code> occurs for <code>k</code> consecutive days, else <code>false</code>.',
    constraints: ['1 <= k <= counts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'counts = [1, 5, 6, 7, 2], thresh = 4, k = 3', output: 'true' },
      { title: 'Test Case 2', input: 'counts = [5, 1, 5, 1], thresh = 4, k = 2', output: 'false' },
      { title: 'Test Case 3', input: 'counts = [10], thresh = 9, k = 1', output: 'true' },
      { title: 'Test Case 4', input: 'counts = [4, 4, 4], thresh = 4, k = 2', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean hasConsecutiveBreaches(int[] counts, int thresh, int k) {
        int run = 0;
        for (int c : counts) {
            run = (c > thresh) ? run + 1 : 0;
            if (run >= k) return true;
        }
        return false;
    }
}`,
    pythonSolution: `def hasConsecutiveBreaches(counts, thresh, k):
    run = 0
    for c in counts:
        run = run + 1 if c > thresh else 0
        if run >= k: return True
    return False`
  },
  {
    number: 48,
    title: 'Payment Method Fallback Count',
    fnName: 'countSuccessfulCheckouts',
    description: 'Each user has a list of payment methods represented as a string of <code>\'0\'</code> (declined) and <code>\'1\'</code> (approved). Return how many users have at least one <code>\'1\'</code>.',
    constraints: ['1 <= users.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'users = ["001", "000", "1", "010"]', output: '3' },
      { title: 'Test Case 2', input: 'users = ["00", "0"]', output: '0' },
      { title: 'Test Case 3', input: 'users = ["1"]', output: '1' },
      { title: 'Test Case 4', input: 'users = ["111"]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countSuccessfulCheckouts(String[] users) {
        int cnt = 0;
        for (String u : users) if (u.indexOf('1') != -1) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countSuccessfulCheckouts(users):
    return sum(1 for u in users if '1' in u)`
  },
  {
    number: 49,
    title: 'Account Merge Union Count',
    fnName: 'countMergedUsers',
    description: 'Given <code>n</code> user IDs (0..n-1) and verified same-owner pairs <code>same</code> <code>[u, v]</code>, return the number of distinct owners after merging.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, same = [[0, 1], [1, 2], [3, 4]]', output: '2' },
      { title: 'Test Case 2', input: 'n = 4, same = []', output: '4' },
      { title: 'Test Case 3', input: 'n = 3, same = [[0, 1], [1, 2]]', output: '1' },
      { title: 'Test Case 4', input: 'n = 1, same = []', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countMergedUsers(int n, int[][] same) {
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        int comp = n;
        for (int[] e : same) {
            int ru = find(p, e[0]), rv = find(p, e[1]);
            if (ru != rv) { p[ru] = rv; comp--; }
        }
        return comp;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def countMergedUsers(n, same):
    p = list(range(n))
    def find(x):
        while p[x] != x: p[x] = p[p[x]]; x = p[x]
        return x
    comp = n
    for u, v in same:
        ru, rv = find(u), find(v)
        if ru != rv: p[ru] = rv; comp -= 1
    return comp`
  },
  {
    number: 50,
    title: 'Ledger Daily Balance Reconciliation',
    fnName: 'countBalancedDays',
    description: 'Given opening balances <code>open</code>, net flows <code>flow</code>, and closing balances <code>close</code>, count how many days satisfy <code>open[i] + flow[i] == close[i]</code>.',
    constraints: ['1 <= open.length == flow.length == close.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'open = [100, 200, 300], flow = [50, -50, 100], close = [150, 140, 400]', output: '2' },
      { title: 'Test Case 2', input: 'open = [0], flow = [0], close = [0]', output: '1' },
      { title: 'Test Case 3', input: 'open = [10, 20], flow = [5, 5], close = [10, 20]', output: '0' },
      { title: 'Test Case 4', input: 'open = [500], flow = [-500], close = [0]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countBalancedDays(int[] open, int[] flow, int[] close) {
        int ok = 0;
        for (int i = 0; i < open.length; i++) if ((long) open[i] + flow[i] == close[i]) ok++;
        return ok;
    }
}`,
    pythonSolution: `def countBalancedDays(open, flow, close):
    return sum(1 for o, f, c in zip(open, flow, close) if o + f == c)`
  }
];
