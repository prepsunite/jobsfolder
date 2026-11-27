export const DELOITTE_P2 = [
  {
    number: 31,
    title: 'General Ledger Trial-Balance Discrepancy',
    fnName: 'unbalancedAccountIds',
    description: 'In a Deloitte ERP audit, each ledger entry is <code>[accountId, debit, credit]</code>. An account is out of balance if its total debits do not equal its total credits. Return a sorted list of out-of-balance account IDs.',
    constraints: ['1 <= entries.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'entries = [[101, 500, 0], [101, 0, 500], [102, 300, 100]]', output: '[102]' },
      { title: 'Test Case 2', input: 'entries = [[1, 100, 100]]', output: '[]' },
      { title: 'Test Case 3', input: 'entries = [[5, 10, 0], [2, 20, 0], [5, 0, 10]]', output: '[2]' },
      { title: 'Test Case 4', input: 'entries = [[9, 1, 2], [3, 5, 4]]', output: '[3, 9]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> unbalancedAccountIds(int[][] entries) {
        Map<Integer, Long> net = new TreeMap<>();
        for (int[] e : entries) net.put(e[0], net.getOrDefault(e[0], 0L) + e[1] - e[2]);
        List<Integer> res = new ArrayList<>();
        for (Map.Entry<Integer, Long> en : net.entrySet()) if (en.getValue() != 0) res.add(en.getKey());
        return res;
    }
}`,
    pythonSolution: `def unbalancedAccountIds(entries):
    from collections import defaultdict
    net = defaultdict(int)
    for acc, d, c in entries: net[acc] += d - c
    return sorted(acc for acc, v in net.items() if v != 0)`
  },
  {
    number: 32,
    title: 'Inter-Company Transfer Elimination',
    fnName: 'netExternalRevenue',
    description: 'Consolidated financial reporting must exclude transfers between parent and subsidiaries. Given transfers <code>txns</code> <code>[fromId, toId, amount]</code> and an array of internal company IDs <code>internalIds</code>, return total amount where at least one party is external.',
    constraints: ['1 <= txns.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'txns = [[1, 2, 100], [2, 3, 250], [4, 1, 150]], internalIds = [1, 2]', output: '400' },
      { title: 'Test Case 2', input: 'txns = [[1, 2, 500]], internalIds = [1, 2]', output: '0' },
      { title: 'Test Case 3', input: 'txns = [[10, 20, 300]], internalIds = [1]', output: '300' },
      { title: 'Test Case 4', input: 'txns = [[1, 1, 900]], internalIds = [1]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long netExternalRevenue(int[][] txns, int[] internalIds) {
        Set<Integer> intl = new HashSet<>();
        for (int id : internalIds) intl.add(id);
        long sum = 0;
        for (int[] t : txns) if (!(intl.contains(t[0]) && intl.contains(t[1]))) sum += t[2];
        return sum;
    }
}`,
    pythonSolution: `def netExternalRevenue(txns, internalIds):
    intl = set(internalIds)
    return sum(amt for u, v, amt in txns if not (u in intl and v in intl))`
  },
  {
    number: 33,
    title: 'Fiscal Quarter Rollover Mapper',
    fnName: 'mapFiscalQuarters',
    description: 'An Indian enterprise fiscal year starts in April (Month 4 = Q1: Apr-Jun, Q2: Jul-Sep, Q3: Oct-Dec, Q4: Jan-Mar). Given month numbers <code>months</code> (1..12), return their fiscal quarter strings (e.g. <code>"Q1"</code>).',
    constraints: ['1 <= months.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'months = [4, 7, 10, 1]', output: '["Q1", "Q2", "Q3", "Q4"]' },
      { title: 'Test Case 2', input: 'months = [3, 6, 9, 12]', output: '["Q4", "Q1", "Q2", "Q3"]' },
      { title: 'Test Case 3', input: 'months = [5]', output: '["Q1"]' },
      { title: 'Test Case 4', input: 'months = [2, 11]', output: '["Q4", "Q3"]' }
    ],
    javaSolution: `public class Solution {
    public static String[] mapFiscalQuarters(int[] months) {
        String[] res = new String[months.length];
        for (int i = 0; i < months.length; i++) {
            int shifted = (months[i] + 8) % 12;
            res[i] = "Q" + (shifted / 3 + 1);
        }
        return res;
    }
}`,
    pythonSolution: `def mapFiscalQuarters(months):
    return [f"Q{((m + 8) % 12) // 3 + 1}" for m in months]`
  },
  {
    number: 34,
    title: 'SOX Segregation-of-Duties Conflict',
    fnName: 'countSoxViolations',
    description: 'SOX compliance forbids any user from holding both roles in any conflict pair <code>conflicts</code> <code>[roleA, roleB]</code>. Given each user\'s role list <code>userRoles</code>, return how many users have at least one SOX conflict.',
    constraints: ['1 <= userRoles.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'userRoles = [["CREATE_PO", "APPROVE_PO"], ["VIEW_PO", "CREATE_PO"]], conflicts = [["CREATE_PO", "APPROVE_PO"]]', output: '1' },
      { title: 'Test Case 2', input: 'userRoles = [["A", "B", "C"]], conflicts = [["A", "D"], ["B", "C"]]', output: '1' },
      { title: 'Test Case 3', input: 'userRoles = [["A"], ["B"]], conflicts = [["A", "B"]]', output: '0' },
      { title: 'Test Case 4', input: 'userRoles = [[]], conflicts = [["A", "B"]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countSoxViolations(String[][] userRoles, String[][] conflicts) {
        int bad = 0;
        for (String[] roles : userRoles) {
            Set<String> s = new HashSet<>(Arrays.asList(roles));
            for (String[] c : conflicts) {
                if (s.contains(c[0]) && s.contains(c[1])) { bad++; break; }
            }
        }
        return bad;
    }
}`,
    pythonSolution: `def countSoxViolations(userRoles, conflicts):
    return sum(1 for r in userRoles if any(a in r and b in r for a, b in conflicts))`
  },
  {
    number: 35,
    title: 'Vendor Payment Net-30 Penalty',
    fnName: 'totalLatePenalties',
    description: 'Invoices due in 30 days incur a 2% penalty (integer floor: <code>amount * 2 // 100</code>) per 15-day late block (<code>ceil(lateDays / 15)</code>) when <code>paidDay - issueDay &gt; 30</code>. Given <code>amounts</code>, <code>issueDays</code>, and <code>paidDays</code>, return total penalty.',
    constraints: ['1 <= amounts.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [1000, 2000], issueDays = [1, 1], paidDays = [31, 47]', output: '80' },
      { title: 'Test Case 2', input: 'amounts = [5000], issueDays = [10], paidDays = [40]', output: '0' },
      { title: 'Test Case 3', input: 'amounts = [1000], issueDays = [0], paidDays = [45]', output: '20' },
      { title: 'Test Case 4', input: 'amounts = [1000], issueDays = [0], paidDays = [60]', output: '40' }
    ],
    javaSolution: `public class Solution {
    public static long totalLatePenalties(int[] amounts, int[] issueDays, int[] paidDays) {
        long pen = 0;
        for (int i = 0; i < amounts.length; i++) {
            int late = paidDays[i] - issueDays[i] - 30;
            if (late > 0) {
                int blocks = (late + 14) / 15;
                pen += (amounts[i] * 2L / 100) * blocks;
            }
        }
        return pen;
    }
}`,
    pythonSolution: `def totalLatePenalties(amounts, issueDays, paidDays):
    pen = 0
    for amt, iss, paid in zip(amounts, issueDays, paidDays):
        late = paid - iss - 30
        if late > 0:
            blocks = (late + 14) // 15
            pen += (amt * 2 // 100) * blocks
    return pen`
  },
  {
    number: 36,
    title: 'Benford Leading Digit Audit Check',
    fnName: 'leadingDigitCounts',
    description: 'Forensic accountants check Benford\'s Law on positive transaction amounts <code>amounts</code>. Return a 9-element array where index <code>d - 1</code> is the count of amounts whose most significant digit is <code>d</code> (1..9).',
    constraints: ['1 <= amounts.length <= 10^5', '1 <= amounts[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [120, 19, 250, 999, 10]', output: '[3, 1, 0, 0, 0, 0, 0, 0, 1]' },
      { title: 'Test Case 2', input: 'amounts = [5, 50, 500]', output: '[0, 0, 0, 0, 3, 0, 0, 0, 0]' },
      { title: 'Test Case 3', input: 'amounts = [1, 2, 3, 4, 5, 6, 7, 8, 9]', output: '[1, 1, 1, 1, 1, 1, 1, 1, 1]' },
      { title: 'Test Case 4', input: 'amounts = [876]', output: '[0, 0, 0, 0, 0, 0, 0, 1, 0]' }
    ],
    javaSolution: `public class Solution {
    public static int[] leadingDigitCounts(int[] amounts) {
        int[] cnt = new int[9];
        for (int x : amounts) {
            while (x >= 10) x /= 10;
            cnt[x - 1]++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def leadingDigitCounts(amounts):
    cnt = [0] * 9
    for x in amounts: cnt[int(str(x)[0]) - 1] += 1
    return cnt`
  },
  {
    number: 37,
    title: 'Expense Receipt Duplicate Flagging',
    fnName: 'countDuplicateReceipts',
    description: 'Employees submit receipts as <code>[employeeId, day, amount]</code>. Any submission with the exact same <code>(employeeId, day, amount)</code> as an earlier submission is flagged as a duplicate. Return the total number of flagged duplicates.',
    constraints: ['1 <= receipts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'receipts = [[1, 10, 500], [1, 10, 500], [2, 10, 500], [1, 10, 500]]', output: '2' },
      { title: 'Test Case 2', input: 'receipts = [[1, 1, 100], [1, 2, 100]]', output: '0' },
      { title: 'Test Case 3', input: 'receipts = [[5, 5, 5]]', output: '0' },
      { title: 'Test Case 4', input: 'receipts = [[3, 4, 50], [3, 4, 50]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDuplicateReceipts(int[][] receipts) {
        Set<String> seen = new HashSet<>();
        int dup = 0;
        for (int[] r : receipts) if (!seen.add(r[0] + ":" + r[1] + ":" + r[2])) dup++;
        return dup;
    }
}`,
    pythonSolution: `def countDuplicateReceipts(receipts):
    seen, dup = set(), 0
    for r in receipts:
        t = tuple(r)
        if t in seen: dup += 1
        else: seen.add(t)
    return dup`
  },
  {
    number: 38,
    title: 'Payroll Overtime Slab Calculator',
    fnName: 'totalWeeklyPay',
    description: 'For each employee\'s weekly hours <code>hours</code> and hourly rate <code>rate</code>: first 40 hours pay <code>1x</code> rate, next 10 hours (41..50) pay <code>1.5x</code> (<code>3*rate/2</code>), and hours above 50 pay <code>2x</code>. Return total integer-floor pay across all employees.',
    constraints: ['1 <= hours.length == rate.length <= 10^4', 'rate[i] is even'],
    testCases: [
      { title: 'Test Case 1', input: 'hours = [40, 45, 55], rate = [100, 100, 100]', output: '15250' },
      { title: 'Test Case 2', input: 'hours = [30], rate = [200]', output: '6000' },
      { title: 'Test Case 3', input: 'hours = [50], rate = [100]', output: '5500' },
      { title: 'Test Case 4', input: 'hours = [0], rate = [500]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalWeeklyPay(int[] hours, int[] rate) {
        long total = 0;
        for (int i = 0; i < hours.length; i++) {
            int h = hours[i], r = rate[i];
            if (h <= 40) total += (long) h * r;
            else if (h <= 50) total += 40L * r + (h - 40L) * r * 3 / 2;
            else total += 40L * r + 10L * r * 3 / 2 + (h - 50L) * r * 2;
        }
        return total;
    }
}`,
    pythonSolution: `def totalWeeklyPay(hours, rate):
    total = 0
    for h, r in zip(hours, rate):
        if h <= 40: total += h * r
        elif h <= 50: total += 40 * r + (h - 40) * r * 3 // 2
        else: total += 40 * r + 15 * r + (h - 50) * r * 2
    return total`
  },
  {
    number: 39,
    title: 'Cost-Center Allocation Remainder',
    fnName: 'allocateBudgetShares',
    description: 'A shared IT cost <code>totalCost</code> must be split across <code>n</code> departments proportional to <code>weights</code> using floor division <code>(totalCost * weights[i]) // sum(weights)</code>, and any leftover remainder units are distributed +1 each to the first <code>rem</code> departments. Return the allocated array.',
    constraints: ['1 <= weights.length <= 10^4', 'sum(weights) > 0'],
    testCases: [
      { title: 'Test Case 1', input: 'totalCost = 100, weights = [1, 1, 1]', output: '[34, 33, 33]' },
      { title: 'Test Case 2', input: 'totalCost = 100, weights = [1, 2, 1]', output: '[25, 50, 25]' },
      { title: 'Test Case 3', input: 'totalCost = 10, weights = [1, 2, 3]', output: '[2, 3, 5]' },
      { title: 'Test Case 4', input: 'totalCost = 50, weights = [5]', output: '[50]' }
    ],
    javaSolution: `public class Solution {
    public static long[] allocateBudgetShares(long totalCost, int[] weights) {
        long wSum = 0; for (int w : weights) wSum += w;
        long[] res = new long[weights.length];
        long used = 0;
        for (int i = 0; i < weights.length; i++) {
            res[i] = (totalCost * weights[i]) / wSum;
            used += res[i];
        }
        long rem = totalCost - used;
        for (int i = 0; i < rem; i++) res[i]++;
        return res;
    }
}`,
    pythonSolution: `def allocateBudgetShares(totalCost, weights):
    wsum = sum(weights)
    res = [(totalCost * w) // wsum for w in weights]
    rem = totalCost - sum(res)
    for i in range(rem): res[i] += 1
    return res`
  },
  {
    number: 40,
    title: 'Related-Party Ownership Indirect Control',
    fnName: 'countControlledSubsidiaries',
    description: 'Given <code>n</code> companies (0..n-1) and directed ownership edges <code>stakes</code> <code>[parent, child]</code>, company <code>0</code> controls all companies reachable from <code>0</code> (excluding <code>0</code> itself). Return how many subsidiaries company <code>0</code> controls.',
    constraints: ['1 <= n <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, stakes = [[0, 1], [1, 2], [2, 3], [4, 3]]', output: '3' },
      { title: 'Test Case 2', input: 'n = 4, stakes = [[1, 2], [2, 3]]', output: '0' },
      { title: 'Test Case 3', input: 'n = 3, stakes = [[0, 1], [0, 2], [1, 2]]', output: '2' },
      { title: 'Test Case 4', input: 'n = 1, stakes = []', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countControlledSubsidiaries(int n, int[][] stakes) {
        List<List<Integer>> g = new ArrayList<>(); for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] s : stakes) g.get(s[0]).add(s[1]);
        boolean[] vis = new boolean[n]; vis[0] = true;
        Deque<Integer> q = new ArrayDeque<>(); q.add(0);
        int cnt = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g.get(u)) if (!vis[v]) { vis[v] = true; cnt++; q.add(v); }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countControlledSubsidiaries(n, stakes):
    from collections import deque
    g = [[] for _ in range(n)]
    for u, v in stakes: g[u].append(v)
    vis = {0}; q = deque([0])
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis: vis.add(v); q.append(v)
    return len(vis) - 1`
  },
  {
    number: 41,
    title: 'Inventory FIFO Cost of Goods Sold',
    fnName: 'fifoCogsValue',
    description: 'A warehouse receives inventory batches <code>batches</code> <code>[qty, unitCost]</code> in chronological order. Given <code>soldQty</code> units sold under FIFO (First-In, First-Out), return the total Cost of Goods Sold.',
    constraints: ['1 <= batches.length <= 10^4', '0 <= soldQty <= sum(qty)'],
    testCases: [
      { title: 'Test Case 1', input: 'batches = [[10, 50], [20, 60]], soldQty = 15', output: '800' },
      { title: 'Test Case 2', input: 'batches = [[5, 100], [5, 200]], soldQty = 10', output: '1500' },
      { title: 'Test Case 3', input: 'batches = [[10, 20]], soldQty = 0', output: '0' },
      { title: 'Test Case 4', input: 'batches = [[3, 10], [4, 20], [5, 30]], soldQty = 8', output: '140' }
    ],
    javaSolution: `public class Solution {
    public static long fifoCogsValue(int[][] batches, int soldQty) {
        long cogs = 0, rem = soldQty;
        for (int[] b : batches) {
            long take = Math.min(rem, b[0]);
            cogs += take * b[1];
            rem -= take;
            if (rem == 0) break;
        }
        return cogs;
    }
}`,
    pythonSolution: `def fifoCogsValue(batches, soldQty):
    cogs, rem = 0, soldQty
    for qty, cost in batches:
        take = min(rem, qty)
        cogs += take * cost
        rem -= take
        if rem == 0: break
    return cogs`
  },
  {
    number: 42,
    title: 'Contract Auto-Renewal Alert Window',
    fnName: 'countMissedNotices',
    description: 'Contracts have <code>expiryDay</code> and <code>noticePeriod</code> (must cancel at least <code>noticePeriod</code> days before expiry). Given cancellation request day <code>cancelDay</code>, return how many contracts missed the cancellation deadline (<code>cancelDay &gt; expiryDay - noticePeriod</code>).',
    constraints: ['1 <= expiryDay.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'expiryDay = [100, 100], noticePeriod = [30, 10], cancelDay = [75, 85]', output: '1' },
      { title: 'Test Case 2', input: 'expiryDay = [50], noticePeriod = [10], cancelDay = [40]', output: '0' },
      { title: 'Test Case 3', input: 'expiryDay = [30, 40], noticePeriod = [5, 10], cancelDay = [26, 35]', output: '2' },
      { title: 'Test Case 4', input: 'expiryDay = [60], noticePeriod = [15], cancelDay = [45]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countMissedNotices(int[] expiryDay, int[] noticePeriod, int[] cancelDay) {
        int missed = 0;
        for (int i = 0; i < expiryDay.length; i++) if (cancelDay[i] > expiryDay[i] - noticePeriod[i]) missed++;
        return missed;
    }
}`,
    pythonSolution: `def countMissedNotices(expiryDay, noticePeriod, cancelDay):
    return sum(1 for e, n, c in zip(expiryDay, noticePeriod, cancelDay) if c > e - n)`
  },
  {
    number: 43,
    title: 'Tax Withholding Threshold Crossing',
    fnName: 'firstWithholdingTxn',
    description: 'Vendor payments <code>payments</code> accumulate over a fiscal year. Once cumulative payments strictly exceed <code>threshold</code>, tax withholding begins from that payment onward. Return the 0-based index of the first payment that triggers withholding, or <code>-1</code>.',
    constraints: ['1 <= payments.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'payments = [10000, 15000, 8000, 5000], threshold = 30000', output: '2' },
      { title: 'Test Case 2', input: 'payments = [100, 200], threshold = 300', output: '-1' },
      { title: 'Test Case 3', input: 'payments = [500], threshold = 400', output: '0' },
      { title: 'Test Case 4', input: 'payments = [10, 20, 30], threshold = 100', output: '-1' }
    ],
    javaSolution: `public class Solution {
    public static int firstWithholdingTxn(int[] payments, long threshold) {
        long s = 0;
        for (int i = 0; i < payments.length; i++) { s += payments[i]; if (s > threshold) return i; }
        return -1;
    }
}`,
    pythonSolution: `def firstWithholdingTxn(payments, threshold):
    s = 0
    for i, p in enumerate(payments):
        s += p
        if s > threshold: return i
    return -1`
  },
  {
    number: 44,
    title: 'Audit Sample Stratified Picker',
    fnName: 'stratifiedSampleCount',
    description: 'An auditor must sample at least <code>minPerBucket</code> items from each department bucket <code>counts</code> (taking all items if a bucket has fewer than <code>minPerBucket</code>), plus <code>extraPct</code>% (integer floor) of any remaining items in each bucket. Return total sampled items.',
    constraints: ['1 <= counts.length <= 10^4', '0 <= extraPct <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'counts = [100, 5, 50], minPerBucket = 10, extraPct = 10', output: '38' },
      { title: 'Test Case 2', input: 'counts = [20, 20], minPerBucket = 20, extraPct = 50', output: '40' },
      { title: 'Test Case 3', input: 'counts = [3, 4], minPerBucket = 10, extraPct = 20', output: '7' },
      { title: 'Test Case 4', input: 'counts = [100], minPerBucket = 0, extraPct = 25', output: '25' }
    ],
    javaSolution: `public class Solution {
    public static long stratifiedSampleCount(int[] counts, int minPerBucket, int extraPct) {
        long total = 0;
        for (int c : counts) {
            int base = Math.min(c, minPerBucket);
            int rem = c - base;
            total += base + (rem * (long) extraPct) / 100;
        }
        return total;
    }
}`,
    pythonSolution: `def stratifiedSampleCount(counts, minPerBucket, extraPct):
    return sum(min(c, minPerBucket) + ((c - min(c, minPerBucket)) * extraPct) // 100 for c in counts)`
  },
  {
    number: 45,
    title: 'Compliance Checklist Version Diff',
    fnName: 'countRuleChanges',
    description: 'Given sorted integer rule IDs from old policy <code>oldRules</code> and new policy <code>newRules</code>, return <code>[addedCount, removedCount]</code>.',
    constraints: ['0 <= oldRules.length, newRules.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'oldRules = [1, 2, 4, 5], newRules = [2, 3, 5, 6]', output: '[2, 2]' },
      { title: 'Test Case 2', input: 'oldRules = [1, 2], newRules = [1, 2]', output: '[0, 0]' },
      { title: 'Test Case 3', input: 'oldRules = [], newRules = [10, 20]', output: '[2, 0]' },
      { title: 'Test Case 4', input: 'oldRules = [7, 8], newRules = []', output: '[0, 2]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] countRuleChanges(int[] oldRules, int[] newRules) {
        Set<Integer> o = new HashSet<>(), n = new HashSet<>();
        for (int x : oldRules) o.add(x);
        for (int x : newRules) n.add(x);
        int added = 0, removed = 0;
        for (int x : n) if (!o.contains(x)) added++;
        for (int x : o) if (!n.contains(x)) removed++;
        return new int[]{added, removed};
    }
}`,
    pythonSolution: `def countRuleChanges(oldRules, newRules):
    o, n = set(oldRules), set(newRules)
    return [len(n - o), len(o - n)]`
  },
  {
    number: 46,
    title: 'Revenue Recognition Milestone Split',
    fnName: 'recognizedRevenueByDay',
    description: 'A contract of <code>totalRev</code> is recognized evenly across milestones <code>milestones</code> (percentage integers summing to 100). Given completed milestone flags <code>done</code> (boolean array), return total recognized revenue (integer floor of <code>totalRev * sum(completedPct) / 100</code>).',
    constraints: ['1 <= milestones.length == done.length <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'totalRev = 10000, milestones = [20, 30, 50], done = [true, false, true]', output: '7000' },
      { title: 'Test Case 2', input: 'totalRev = 5000, milestones = [25, 25, 25, 25], done = [false, false, false, false]', output: '0' },
      { title: 'Test Case 3', input: 'totalRev = 1234, milestones = [100], done = [true]', output: '1234' },
      { title: 'Test Case 4', input: 'totalRev = 999, milestones = [33, 67], done = [true, false]', output: '329' }
    ],
    javaSolution: `public class Solution {
    public static long recognizedRevenueByDay(long totalRev, int[] milestones, boolean[] done) {
        long pct = 0;
        for (int i = 0; i < milestones.length; i++) if (done[i]) pct += milestones[i];
        return (totalRev * pct) / 100;
    }
}`,
    pythonSolution: `def recognizedRevenueByDay(totalRev, milestones, done):
    pct = sum(m for m, d in zip(milestones, done) if d)
    return (totalRev * pct) // 100`
  },
  {
    number: 47,
    title: 'Fixed-Asset Straight-Line Write-Off',
    fnName: 'bookValueAfterYears',
    description: 'An asset with initial cost <code>cost</code>, salvage value <code>salvage</code>, and useful life <code>lifeYears</code> depreciates by <code>(cost - salvage) // lifeYears</code> each year. Return its book value after <code>years</code> years (never dropping below <code>salvage</code>).',
    constraints: ['1 <= lifeYears <= 100', '0 <= salvage <= cost <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'cost = 10000, salvage = 1000, lifeYears = 5, years = 3', output: '4600' },
      { title: 'Test Case 2', input: 'cost = 10000, salvage = 1000, lifeYears = 5, years = 8', output: '1000' },
      { title: 'Test Case 3', input: 'cost = 5000, salvage = 5000, lifeYears = 10, years = 4', output: '5000' },
      { title: 'Test Case 4', input: 'cost = 1200, salvage = 0, lifeYears = 4, years = 0', output: '1200' }
    ],
    javaSolution: `public class Solution {
    public static long bookValueAfterYears(long cost, long salvage, int lifeYears, int years) {
        long dep = (cost - salvage) / lifeYears;
        return Math.max(salvage, cost - dep * years);
    }
}`,
    pythonSolution: `def bookValueAfterYears(cost, salvage, lifeYears, years):
    dep = (cost - salvage) // lifeYears
    return max(salvage, cost - dep * years)`
  },
  {
    number: 48,
    title: 'Subledger Reconciliation Match Rate',
    fnName: 'countMatchedEntries',
    description: 'Given two multisets of transaction amounts <code>subledger</code> and <code>bank</code>, count how many entries in <code>subledger</code> can be matched 1-to-1 with an identical amount in <code>bank</code>.',
    constraints: ['1 <= subledger.length, bank.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'subledger = [100, 200, 200, 300], bank = [200, 300, 400]', output: '2' },
      { title: 'Test Case 2', input: 'subledger = [50, 50], bank = [50, 50, 50]', output: '2' },
      { title: 'Test Case 3', input: 'subledger = [10], bank = [20]', output: '0' },
      { title: 'Test Case 4', input: 'subledger = [1, 2, 3], bank = [3, 2, 1]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countMatchedEntries(int[] subledger, int[] bank) {
        Map<Integer, Integer> b = new HashMap<>();
        for (int x : bank) b.put(x, b.getOrDefault(x, 0) + 1);
        int matched = 0;
        for (int x : subledger) {
            int c = b.getOrDefault(x, 0);
            if (c > 0) { matched++; b.put(x, c - 1); }
        }
        return matched;
    }
}`,
    pythonSolution: `def countMatchedEntries(subledger, bank):
    from collections import Counter
    cb = Counter(bank)
    matched = 0
    for x in subledger:
        if cb[x] > 0: matched += 1; cb[x] -= 1
    return matched`
  },
  {
    number: 49,
    title: 'Regulatory Filing Deadline Buffer',
    fnName: 'maxBufferDays',
    description: 'A compliance team has <code>n</code> filings with preparation durations <code>prepDays</code> and due dates <code>dueDays</code>. Starting on day 0 and working on one filing at a time, what is the maximum uniform delay <code>D</code> (or 0 if tight) or simply: if they process filings in earliest-due-date order, return the minimum slack <code>dueDay - finishDay</code> across all filings (negative if any filing is late).',
    constraints: ['1 <= prepDays.length == dueDays.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prepDays = [3, 2, 4], dueDays = [5, 3, 10]', output: '0' },
      { title: 'Test Case 2', input: 'prepDays = [5, 5], dueDays = [4, 10]', output: '-1' },
      { title: 'Test Case 3', input: 'prepDays = [2], dueDays = [2]', output: '0' },
      { title: 'Test Case 4', input: 'prepDays = [1, 2, 3], dueDays = [10, 10, 10]', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxBufferDays(int[] prepDays, int[] dueDays) {
        int n = prepDays.length;
        int[][] tasks = new int[n][2];
        for (int i = 0; i < n; i++) { tasks[i][0] = dueDays[i]; tasks[i][1] = prepDays[i]; }
        Arrays.sort(tasks, (a, b) -> Integer.compare(a[0], b[0]));
        int time = 0, minSlack = Integer.MAX_VALUE;
        for (int[] t : tasks) {
            time += t[1];
            minSlack = Math.min(minSlack, t[0] - time);
        }
        return minSlack;
    }
}`,
    pythonSolution: `def maxBufferDays(prepDays, dueDays):
    time = 0
    min_slack = float('inf')
    for due, prep in sorted(zip(dueDays, prepDays)):
        time += prep
        min_slack = min(min_slack, due - time)
    return min_slack`
  },
  {
    number: 50,
    title: 'Journal Entry Approval Hierarchy Sum',
    fnName: 'countAutoApprovedEntries',
    description: 'An approval matrix specifies each manager\'s approval limit <code>limits[level]</code>. Given transaction amounts <code>amounts</code> and the submitter\'s level <code>levels</code>, an entry is auto-approved if <code>amounts[i] &lt;= limits[levels[i]]</code>. Return the count of auto-approved entries.',
    constraints: ['1 <= amounts.length == levels.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [500, 2000, 15000], levels = [0, 1, 1], limits = [1000, 5000, 20000]', output: '2' },
      { title: 'Test Case 2', input: 'amounts = [100], levels = [0], limits = [50]', output: '0' },
      { title: 'Test Case 3', input: 'amounts = [5000, 20000], levels = [1, 2], limits = [1000, 5000, 20000]', output: '2' },
      { title: 'Test Case 4', input: 'amounts = [10, 20, 30], levels = [0, 0, 0], limits = [20]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countAutoApprovedEntries(int[] amounts, int[] levels, int[] limits) {
        int cnt = 0;
        for (int i = 0; i < amounts.length; i++) if (amounts[i] <= limits[levels[i]]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAutoApprovedEntries(amounts, levels, limits):
    return sum(1 for a, lvl in zip(amounts, levels) if a <= limits[lvl])`
  }
];
