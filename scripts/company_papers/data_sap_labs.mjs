export const SAP_LABS_QUESTIONS = [
  {
    number: 1,
    title: 'ERP BOM Component Total Cost',
    fnName: 'totalBomCost',
    description: 'In SAP S/4HANA, a product Bill of Materials (BOM) lists component unit prices <code>prices</code> and required quantities <code>qtys</code>. Return total material cost.',
    constraints: ['1 <= prices.length == qtys.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [10, 25, 5], qtys = [2, 3, 4]', output: '115' },
      { title: 'Test Case 2', input: 'prices = [100], qtys = [0]', output: '0' },
      { title: 'Test Case 3', input: 'prices = [7, 8], qtys = [1, 1]', output: '15' },
      { title: 'Test Case 4', input: 'prices = [50], qtys = [10]', output: '500' }
    ],
    javaSolution: `public class Solution {
    public static long totalBomCost(int[] prices, int[] qtys) {
        long s = 0;
        for (int i = 0; i < prices.length; i++) s += (long) prices[i] * qtys[i];
        return s;
    }
}`,
    pythonSolution: `def totalBomCost(prices, qtys):
    return sum(p * q for p, q in zip(prices, qtys))`
  },
  {
    number: 2,
    title: 'Transport Request Dependency Order',
    fnName: 'canImportTransports',
    description: 'Given <code>n</code> SAP transport requests and dependencies <code>deps</code> <code>[a, b]</code> (<code>b</code> must be imported before <code>a</code>), return <code>true</code> if a valid import order exists (no cycle), else <code>false</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, deps = [[1, 0], [2, 1]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 2, deps = [[0, 1], [1, 0]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 4, deps = []', output: 'true' },
      { title: 'Test Case 4', input: 'n = 3, deps = [[0, 1], [1, 2], [2, 0]]', output: 'false' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean canImportTransports(int n, int[][] deps) {
        List<List<Integer>> g = new ArrayList<>();
        int[] ind = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] d : deps) { g.get(d[1]).add(d[0]); ind[d[0]]++; }
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
def canImportTransports(n, deps):
    g = [[] for _ in range(n)]; ind = [0] * n
    for a, b in deps: g[b].append(a); ind[a] += 1
    q = deque([i for i in range(n) if ind[i] == 0]); vis = 0
    while q:
        u = q.popleft(); vis += 1
        for v in g[u]:
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return vis == n`
  },
  {
    number: 3,
    title: 'Cost-Center Budget Overrun Count',
    fnName: 'countOverBudgetCenters',
    description: 'Given allocated budgets <code>budget</code> and actual expenses <code>actual</code>, count how many cost centers exceeded their budget (<code>actual[i] > budget[i]</code>).',
    constraints: ['1 <= budget.length == actual.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'budget = [100, 200, 300], actual = [110, 200, 350]', output: '2' },
      { title: 'Test Case 2', input: 'budget = [50, 50], actual = [40, 50]', output: '0' },
      { title: 'Test Case 3', input: 'budget = [10], actual = [11]', output: '1' },
      { title: 'Test Case 4', input: 'budget = [0], actual = [0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countOverBudgetCenters(int[] budget, int[] actual) {
        int cnt = 0;
        for (int i = 0; i < budget.length; i++) if (actual[i] > budget[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countOverBudgetCenters(budget, actual):
    return sum(1 for b, a in zip(budget, actual) if a > b)`
  },
  {
    number: 4,
    title: 'SAP Table Join Matching Keys',
    fnName: 'countInnerJoinRows',
    description: 'Given primary-key arrays <code>tableA</code> and <code>tableB</code> (each with unique keys), return how many keys appear in BOTH tables (inner join count).',
    constraints: ['0 <= tableA.length, tableB.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tableA = [1, 2, 3, 4], tableB = [3, 4, 5, 6]', output: '2' },
      { title: 'Test Case 2', input: 'tableA = [1, 2], tableB = [3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'tableA = [], tableB = [1, 2]', output: '0' },
      { title: 'Test Case 4', input: 'tableA = [10], tableB = [10]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countInnerJoinRows(int[] tableA, int[] tableB) {
        Set<Integer> s = new HashSet<>();
        for (int a : tableA) s.add(a);
        int cnt = 0;
        for (int b : tableB) if (s.contains(b)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countInnerJoinRows(tableA, tableB):
    return len(set(tableA) & set(tableB))`
  },
  {
    number: 5,
    title: 'ERP Purchase Order Approval Chain',
    fnName: 'countApprovalLevels',
    description: 'A PO of amount <code>amt</code> requires 1 approval for each sorted threshold in <code>limits</code> that satisfies <code>amt >= limits[i]</code>. Return total approvals needed.',
    constraints: ['1 <= limits.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'limits = [100, 500, 2000, 10000], amt = 1500', output: '2' },
      { title: 'Test Case 2', input: 'limits = [100, 200], amt = 50', output: '0' },
      { title: 'Test Case 3', input: 'limits = [10, 20, 30], amt = 30', output: '3' },
      { title: 'Test Case 4', input: 'limits = [500], amt = 500', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countApprovalLevels(int[] limits, int amt) {
        int l = 0, r = limits.length;
        while (l < r) {
            int m = (l + r) / 2;
            if (limits[m] <= amt) l = m + 1; else r = m;
        }
        return l;
    }
}`,
    pythonSolution: `import bisect
def countApprovalLevels(limits, amt):
    return bisect.bisect_right(limits, amt)`
  },
  {
    number: 6,
    title: 'Warehouse Bin Capacity Packing',
    fnName: 'minStorageBins',
    description: 'Pack items with sizes <code>sizes</code> (in order) into bins of capacity <code>cap</code> (start a new bin if current bin cannot fit the item). Return total bins used.',
    constraints: ['1 <= sizes.length <= 10^5', 'max(sizes) <= cap <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'sizes = [3, 5, 4, 2, 6], cap = 8', output: '3' },
      { title: 'Test Case 2', input: 'sizes = [2, 2, 2], cap = 6', output: '1' },
      { title: 'Test Case 3', input: 'sizes = [5, 5, 5], cap = 5', output: '3' },
      { title: 'Test Case 4', input: 'sizes = [1], cap = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minStorageBins(int[] sizes, int cap) {
        int bins = 1; long cur = 0;
        for (int s : sizes) {
            if (cur + s > cap) { bins++; cur = s; } else cur += s;
        }
        return bins;
    }
}`,
    pythonSolution: `def minStorageBins(sizes, cap):
    bins, cur = 1, 0
    for s in sizes:
        if cur + s > cap: bins += 1; cur = s
        else: cur += s
    return bins`
  },
  {
    number: 7,
    title: 'GL Account Hierarchy Depth',
    fnName: 'maxAccountTreeDepth',
    description: 'Given a General Ledger tree where <code>parent[i]</code> is the parent of account <code>i</code> (<code>-1</code> for root), return the maximum depth (root = 1).',
    constraints: ['1 <= parent.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 0, 1, 3]', output: '4' },
      { title: 'Test Case 2', input: 'parent = [-1]', output: '1' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 0, 0]', output: '2' },
      { title: 'Test Case 4', input: 'parent = [1, -1, 1]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int maxAccountTreeDepth(int[] parent) {
        int n = parent.length; int[] memo = new int[n]; int best = 0;
        for (int i = 0; i < n; i++) best = Math.max(best, depth(i, parent, memo));
        return best;
    }
    private static int depth(int i, int[] p, int[] memo) {
        if (p[i] == -1) return 1;
        if (memo[i] != 0) return memo[i];
        return memo[i] = 1 + depth(p[i], p, memo);
    }
}`,
    pythonSolution: `def maxAccountTreeDepth(parent):
    memo = {}
    def d(i):
        if parent[i] == -1: return 1
        if i in memo: return memo[i]
        memo[i] = 1 + d(parent[i])
        return memo[i]
    return max(d(i) for i in range(len(parent)))`
  },
  {
    number: 8,
    title: 'Payroll Overtime Multiplier',
    fnName: 'totalPayrollPay',
    description: 'Given employee hours <code>hours</code>, hourly rate <code>rate</code>, and standard hours <code>stdH</code> (hours beyond <code>stdH</code> are paid at <code>2 * rate</code>), return total payroll.',
    constraints: ['1 <= hours.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'hours = [40, 45, 30], stdH = 40, rate = 10', output: '1200' },
      { title: 'Test Case 2', input: 'hours = [50], stdH = 40, rate = 20', output: '1200' },
      { title: 'Test Case 3', input: 'hours = [10], stdH = 40, rate = 5', output: '50' },
      { title: 'Test Case 4', input: 'hours = [40, 40], stdH = 40, rate = 10', output: '800' }
    ],
    javaSolution: `public class Solution {
    public static long totalPayrollPay(int[] hours, int stdH, int rate) {
        long pay = 0;
        for (int h : hours) {
            int reg = Math.min(h, stdH), ot = Math.max(0, h - stdH);
            pay += (long) reg * rate + (long) ot * rate * 2;
        }
        return pay;
    }
}`,
    pythonSolution: `def totalPayrollPay(hours, stdH, rate):
    return sum((min(h, stdH) + 2 * max(0, h - stdH)) * rate for h in hours)`
  },
  {
    number: 9,
    title: 'ABAP String CamelCase Splitter',
    fnName: 'countCamelWords',
    description: 'Given a non-empty identifier string <code>s</code> in camelCase (first letter lowercase, each subsequent word starts with an uppercase letter), return the number of words.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "savePurchaseOrder"', output: '3' },
      { title: 'Test Case 2', input: 's = "sap"', output: '1' },
      { title: 'Test Case 3', input: 's = "getCustomerBillingInfo"', output: '4' },
      { title: 'Test Case 4', input: 's = "aBC"', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countCamelWords(String s) {
        int cnt = 1;
        for (int i = 0; i < s.length(); i++) if (Character.isUpperCase(s.charAt(i))) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countCamelWords(s):
    return 1 + sum(1 for c in s if c.isupper())`
  },
  {
    number: 10,
    title: 'Production Line Bottleneck',
    fnName: 'minMaxLineTime',
    description: 'Given <code>n</code> manufacturing steps with times <code>times</code>, return the bottleneck step duration (maximum of <code>times</code>).',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [12, 45, 30, 18]', output: '45' },
      { title: 'Test Case 2', input: 'times = [7]', output: '7' },
      { title: 'Test Case 3', input: 'times = [10, 10, 10]', output: '10' },
      { title: 'Test Case 4', input: 'times = [1, 99]', output: '99' }
    ],
    javaSolution: `public class Solution {
    public static int minMaxLineTime(int[] times) {
        int mx = times[0];
        for (int t : times) mx = Math.max(mx, t);
        return mx;
    }
}`,
    pythonSolution: `def minMaxLineTime(times):
    return max(times)`
  },
  {
    number: 11,
    title: 'ERP Batch Job Peak Concurrency',
    fnName: 'maxConcurrentJobs',
    description: 'Given background batch job intervals <code>jobs</code> <code>[start, end)</code>, return the maximum number of jobs running at the same time.',
    constraints: ['1 <= jobs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'jobs = [[1, 5], [2, 6], [4, 7]]', output: '3' },
      { title: 'Test Case 2', input: 'jobs = [[0, 2], [2, 4]]', output: '1' },
      { title: 'Test Case 3', input: 'jobs = [[5, 10]]', output: '1' },
      { title: 'Test Case 4', input: 'jobs = [[1, 4], [2, 3], [6, 8]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxConcurrentJobs(int[][] jobs) {
        int n = jobs.length;
        int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = jobs[i][0]; e[i] = jobs[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def maxConcurrentJobs(jobs):
    s = sorted(j[0] for j in jobs); e = sorted(j[1] for j in jobs)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 12,
    title: 'Material Stock Safety Margin',
    fnName: 'countBelowSafetyStock',
    description: 'Given current warehouse quantities <code>qty</code> and safety minimums <code>safety</code>, count how many materials are strictly below safety stock.',
    constraints: ['1 <= qty.length == safety.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'qty = [10, 50, 20], safety = [15, 50, 10]', output: '1' },
      { title: 'Test Case 2', input: 'qty = [5, 5], safety = [10, 10]', output: '2' },
      { title: 'Test Case 3', input: 'qty = [100], safety = [50]', output: '0' },
      { title: 'Test Case 4', input: 'qty = [0], safety = [0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countBelowSafetyStock(int[] qty, int[] safety) {
        int cnt = 0;
        for (int i = 0; i < qty.length; i++) if (qty[i] < safety[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countBelowSafetyStock(qty, safety):
    return sum(1 for q, s in zip(qty, safety) if q < s)`
  },
  {
    number: 13,
    title: 'Invoice Early-Pay Discount',
    fnName: 'totalAfterEarlyPayDiscount',
    description: 'Invoices <code>[amount, paidDays]</code> earn a <code>pct</code>% (integer floor) discount if <code>paidDays <= maxDays</code>. Return total net payable across all invoices.',
    constraints: ['1 <= invoices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'invoices = [[1000, 5], [500, 15], [200, 10]], maxDays = 10, pct = 10', output: '1580' },
      { title: 'Test Case 2', input: 'invoices = [[100, 20]], maxDays = 10, pct = 5', output: '100' },
      { title: 'Test Case 3', input: 'invoices = [[200, 1]], maxDays = 5, pct = 25', output: '150' },
      { title: 'Test Case 4', input: 'invoices = [[100, 5]], maxDays = 5, pct = 0', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static long totalAfterEarlyPayDiscount(int[][] invoices, int maxDays, int pct) {
        long tot = 0;
        for (int[] inv : invoices) {
            long disc = (inv[1] <= maxDays) ? ((long) inv[0] * pct) / 100 : 0;
            tot += inv[0] - disc;
        }
        return tot;
    }
}`,
    pythonSolution: `def totalAfterEarlyPayDiscount(invoices, maxDays, pct):
    return sum(a - ((a * pct) // 100 if d <= maxDays else 0) for a, d in invoices)`
  },
  {
    number: 14,
    title: 'HANA In-Memory Column Compression',
    fnName: 'countDictionaryEntries',
    description: 'In column-store dictionary encoding, distinct values are stored once. Given column values <code>col</code>, return the dictionary size.',
    constraints: ['1 <= col.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'col = [10, 20, 10, 30, 20, 10]', output: '3' },
      { title: 'Test Case 2', input: 'col = [5, 5, 5]', output: '1' },
      { title: 'Test Case 3', input: 'col = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 4', input: 'col = [99]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDictionaryEntries(int[] col) {
        Set<Integer> s = new HashSet<>();
        for (int v : col) s.add(v);
        return s.size();
    }
}`,
    pythonSolution: `def countDictionaryEntries(col):
    return len(set(col))`
  },
  {
    number: 15,
    title: 'OOP Access Control Role Check',
    fnName: 'countAuthorizedActions',
    description: 'Users have role bitmasks <code>roles</code> and an action requires all bits in <code>reqMask</code>. Count authorized users.',
    constraints: ['1 <= roles.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'roles = [7, 5, 3, 15], reqMask = 5', output: '3' },
      { title: 'Test Case 2', input: 'roles = [1, 2], reqMask = 4', output: '0' },
      { title: 'Test Case 3', input: 'roles = [0, 8], reqMask = 0', output: '2' },
      { title: 'Test Case 4', input: 'roles = [12], reqMask = 12', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countAuthorizedActions(int[] roles, int reqMask) {
        int cnt = 0;
        for (int r : roles) if ((r & reqMask) == reqMask) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAuthorizedActions(roles, reqMask):
    return sum(1 for r in roles if (r & reqMask) == reqMask)`
  },
  {
    number: 16,
    title: 'Document Number Range Gaps',
    fnName: 'countMissingDocNumbers',
    description: 'Given sorted distinct document numbers <code>nums</code>, return how many integer numbers are missing between <code>nums[0]</code> and <code>nums[n-1]</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [101, 102, 105, 107]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [10]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [5, 10]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static long countMissingDocNumbers(int[] nums) {
        return (long) nums[nums.length - 1] - nums[0] + 1 - nums.length;
    }
}`,
    pythonSolution: `def countMissingDocNumbers(nums):
    return nums[-1] - nums[0] + 1 - len(nums)`
  },
  {
    number: 17,
    title: 'Plant-to-Plant Transfer Distance',
    fnName: 'minPlantHopDistance',
    description: 'Given <code>n</code> plants (0..n-1) and undirected roads <code>roads</code> <code>[u, v]</code>, return shortest hop count from <code>src</code> to <code>dst</code>, or <code>-1</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, roads = [[0, 1], [1, 2], [2, 3]], src = 0, dst = 3', output: '3' },
      { title: 'Test Case 2', input: 'n = 3, roads = [[0, 1]], src = 0, dst = 2', output: '-1' },
      { title: 'Test Case 3', input: 'n = 2, roads = [[0, 1]], src = 1, dst = 1', output: '0' },
      { title: 'Test Case 4', input: 'n = 3, roads = [[0, 1], [0, 2], [1, 2]], src = 0, dst = 2', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minPlantHopDistance(int n, int[][] roads, int src, int dst) {
        if (src == dst) return 0;
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] r : roads) { g.get(r[0]).add(r[1]); g.get(r[1]).add(r[0]); }
        int[] dist = new int[n]; Arrays.fill(dist, -1);
        Queue<Integer> q = new ArrayDeque<>(); dist[src] = 0; q.add(src);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g.get(u)) if (dist[v] == -1) {
                dist[v] = dist[u] + 1; if (v == dst) return dist[v]; q.add(v);
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque
def minPlantHopDistance(n, roads, src, dst):
    if src == dst: return 0
    g = [[] for _ in range(n)]
    for u, v in roads: g[u].append(v); g[v].append(u)
    dist = [-1] * n; dist[src] = 0; q = deque([src])
    while q:
        u = q.popleft()
        for v in g[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                if v == dst: return dist[v]
                q.append(v)
    return -1`
  },
  {
    number: 18,
    title: 'Sales Order Fulfillment Ratio',
    fnName: 'countFullyShippedOrders',
    description: 'Given ordered quantities <code>ordered</code> and shipped quantities <code>shipped</code>, count fully shipped orders (<code>shipped[i] >= ordered[i]</code>).',
    constraints: ['1 <= ordered.length == shipped.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ordered = [10, 20, 30], shipped = [10, 15, 30]', output: '2' },
      { title: 'Test Case 2', input: 'ordered = [5, 5], shipped = [4, 4]', output: '0' },
      { title: 'Test Case 3', input: 'ordered = [1], shipped = [2]', output: '1' },
      { title: 'Test Case 4', input: 'ordered = [8], shipped = [8]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countFullyShippedOrders(int[] ordered, int[] shipped) {
        int cnt = 0;
        for (int i = 0; i < ordered.length; i++) if (shipped[i] >= ordered[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countFullyShippedOrders(ordered, shipped):
    return sum(1 for o, s in zip(ordered, shipped) if s >= o)`
  },
  {
    number: 19,
    title: 'Fiscal Quarter Revenue Peak',
    fnName: 'maxQuarterRevenue',
    description: 'Given monthly revenues <code>rev</code> (length divisible by 3), partition into consecutive 3-month quarters and return the maximum quarter revenue.',
    constraints: ['3 <= rev.length <= 10^5', 'rev.length % 3 == 0'],
    testCases: [
      { title: 'Test Case 1', input: 'rev = [10, 20, 30, 50, 10, 10]', output: '70' },
      { title: 'Test Case 2', input: 'rev = [5, 5, 5]', output: '15' },
      { title: 'Test Case 3', input: 'rev = [100, 0, 0, 40, 40, 40]', output: '120' },
      { title: 'Test Case 4', input: 'rev = [1, 2, 3, 4, 5, 6]', output: '15' }
    ],
    javaSolution: `public class Solution {
    public static long maxQuarterRevenue(int[] rev) {
        long best = Long.MIN_VALUE;
        for (int i = 0; i < rev.length; i += 3) {
            best = Math.max(best, (long) rev[i] + rev[i + 1] + rev[i + 2]);
        }
        return best;
    }
}`,
    pythonSolution: `def maxQuarterRevenue(rev):
    return max(sum(rev[i:i+3]) for i in range(0, len(rev), 3))`
  },
  {
    number: 20,
    title: 'Vendor Lead-Time Stability',
    fnName: 'maxConsecutiveOnTime',
    description: 'Given delivery delays <code>delays</code> (<code>0</code> = on time, <code>&gt; 0</code> = late), return the longest streak of consecutive on-time deliveries.',
    constraints: ['1 <= delays.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'delays = [0, 0, 2, 0, 0, 0, 1]', output: '3' },
      { title: 'Test Case 2', input: 'delays = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'delays = [0, 0, 0]', output: '3' },
      { title: 'Test Case 4', input: 'delays = [0]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxConsecutiveOnTime(int[] delays) {
        int cur = 0, best = 0;
        for (int d : delays) { cur = (d == 0) ? cur + 1 : 0; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxConsecutiveOnTime(delays):
    cur = best = 0
    for d in delays:
        cur = cur + 1 if d == 0 else 0
        best = max(best, cur)
    return best`
  },
  {
    number: 21,
    title: 'Cloud Tenant Storage Quota',
    fnName: 'countOverQuotaTenants',
    description: 'Given tenant usage <code>used</code> and quota <code>quota</code>, count tenants exceeding quota (<code>used[i] > quota[i]</code>).',
    constraints: ['1 <= used.length == quota.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'used = [100, 250, 300], quota = [100, 200, 400]', output: '1' },
      { title: 'Test Case 2', input: 'used = [50, 60], quota = [100, 100]', output: '0' },
      { title: 'Test Case 3', input: 'used = [11], quota = [10]', output: '1' },
      { title: 'Test Case 4', input: 'used = [0], quota = [0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countOverQuotaTenants(int[] used, int[] quota) {
        int cnt = 0;
        for (int i = 0; i < used.length; i++) if (used[i] > quota[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countOverQuotaTenants(used, quota):
    return sum(1 for u, q in zip(used, quota) if u > q)`
  },
  {
    number: 22,
    title: 'ERP Migration Table Row Check',
    fnName: 'sumTableDiff',
    description: 'Given source table row counts <code>src</code> and target table row counts <code>dst</code>, return total absolute discrepancy <code>sum(|src[i] - dst[i]|)</code>.',
    constraints: ['1 <= src.length == dst.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'src = [100, 200], dst = [98, 205]', output: '7' },
      { title: 'Test Case 2', input: 'src = [50, 50], dst = [50, 50]', output: '0' },
      { title: 'Test Case 3', input: 'src = [0], dst = [10]', output: '10' },
      { title: 'Test Case 4', input: 'src = [10, 0], dst = [0, 10]', output: '20' }
    ],
    javaSolution: `public class Solution {
    public static long sumTableDiff(int[] src, int[] dst) {
        long s = 0;
        for (int i = 0; i < src.length; i++) s += Math.abs((long) src[i] - dst[i]);
        return s;
    }
}`,
    pythonSolution: `def sumTableDiff(src, dst):
    return sum(abs(a - b) for a, b in zip(src, dst))`
  },
  {
    number: 23,
    title: 'SAP Fiori Tile Grid Perimeter',
    fnName: 'countTileGridCols',
    description: 'Given <code>n</code> dashboard tiles arranged in rows of width <code>cols</code>, return how many rows are needed (<code>ceil(n / cols)</code>).',
    constraints: ['0 <= n <= 10^9', '1 <= cols <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 10, cols = 4', output: '3' },
      { title: 'Test Case 2', input: 'n = 8, cols = 4', output: '2' },
      { title: 'Test Case 3', input: 'n = 0, cols = 5', output: '0' },
      { title: 'Test Case 4', input: 'n = 1, cols = 3', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countTileGridCols(long n, long cols) {
        return (n + cols - 1) / cols;
    }
}`,
    pythonSolution: `def countTileGridCols(n, cols):
    return (n + cols - 1) // cols`
  },
  {
    number: 24,
    title: 'Subarray Maximum Profit Window',
    fnName: 'maxSubarrayProfit',
    description: 'Given daily net P&amp;L <code>pnl</code>, return the maximum sum of any non-empty contiguous subarray.',
    constraints: ['1 <= pnl.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pnl = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6' },
      { title: 'Test Case 2', input: 'pnl = [-5, -1, -3]', output: '-1' },
      { title: 'Test Case 3', input: 'pnl = [10, 20, 30]', output: '60' },
      { title: 'Test Case 4', input: 'pnl = [42]', output: '42' }
    ],
    javaSolution: `public class Solution {
    public static long maxSubarrayProfit(int[] pnl) {
        long cur = pnl[0], best = pnl[0];
        for (int i = 1; i < pnl.length; i++) {
            cur = Math.max(pnl[i], cur + pnl[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def maxSubarrayProfit(pnl):
    cur = best = pnl[0]
    for x in pnl[1:]: cur = max(x, cur + x); best = max(best, cur)
    return best`
  },
  {
    number: 25,
    title: 'Inventory Valuation FIFO Cost',
    fnName: 'fifoCostOfGoodsSold',
    description: 'Inventory lots arrive with quantities <code>qtys</code> and unit prices <code>prices</code>. When <code>sellQty</code> units are sold using FIFO (oldest lots first), return total COGS.',
    constraints: ['1 <= qtys.length == prices.length <= 10^5', '0 <= sellQty <= sum(qtys)'],
    testCases: [
      { title: 'Test Case 1', input: 'qtys = [10, 20, 30], prices = [5, 8, 10], sellQty = 25', output: '170' },
      { title: 'Test Case 2', input: 'qtys = [5, 5], prices = [10, 20], sellQty = 0', output: '0' },
      { title: 'Test Case 3', input: 'qtys = [10], prices = [12], sellQty = 10', output: '120' },
      { title: 'Test Case 4', input: 'qtys = [4, 6], prices = [3, 5], sellQty = 7', output: '27' }
    ],
    javaSolution: `public class Solution {
    public static long fifoCostOfGoodsSold(int[] qtys, int[] prices, long sellQty) {
        long cost = 0;
        for (int i = 0; i < qtys.length && sellQty > 0; i++) {
            long take = Math.min(sellQty, qtys[i]);
            cost += take * prices[i];
            sellQty -= take;
        }
        return cost;
    }
}`,
    pythonSolution: `def fifoCostOfGoodsSold(qtys, prices, sellQty):
    cost = 0
    for q, p in zip(qtys, prices):
        take = min(sellQty, q)
        cost += take * p; sellQty -= take
        if sellQty == 0: break
    return cost`
  },
  {
    number: 26,
    title: 'Duplicate Material Code Cleanup',
    fnName: 'countDuplicateCodes',
    description: 'Given material codes <code>codes</code>, return how many redundant duplicate entries exist (<code>len(codes) - uniqueCount</code>).',
    constraints: ['1 <= codes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'codes = [1, 2, 1, 3, 2]', output: '2' },
      { title: 'Test Case 2', input: 'codes = [10, 20, 30]', output: '0' },
      { title: 'Test Case 3', input: 'codes = [7, 7, 7]', output: '2' },
      { title: 'Test Case 4', input: 'codes = [5]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDuplicateCodes(int[] codes) {
        Set<Integer> s = new HashSet<>();
        for (int c : codes) s.add(c);
        return codes.length - s.size();
    }
}`,
    pythonSolution: `def countDuplicateCodes(codes):
    return len(codes) - len(set(codes))`
  },
  {
    number: 27,
    title: 'Cost-Center Pair Budget Match',
    fnName: 'countMatchingBudgetPairs',
    description: 'Given department surplus/deficit values <code>vals</code>, count pairs <code>(i, j)</code> with <code>i &lt; j</code> and <code>vals[i] + vals[j] == 0</code>.',
    constraints: ['1 <= vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [5, -5, 10, -5]', output: '2' },
      { title: 'Test Case 2', input: 'vals = [0, 0, 0]', output: '3' },
      { title: 'Test Case 3', input: 'vals = [1, 2, 3]', output: '0' },
      { title: 'Test Case 4', input: 'vals = [-7, 7]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countMatchingBudgetPairs(int[] vals) {
        Map<Integer, Integer> m = new HashMap<>();
        long ans = 0;
        for (int v : vals) { ans += m.getOrDefault(-v, 0); m.put(v, m.getOrDefault(v, 0) + 1); }
        return ans;
    }
}`,
    pythonSolution: `def countMatchingBudgetPairs(vals):
    m = {}; ans = 0
    for v in vals: ans += m.get(-v, 0); m[v] = m.get(v, 0) + 1
    return ans`
  },
  {
    number: 28,
    title: 'Workflow Step Transition Check',
    fnName: 'countInvalidTransitions',
    description: 'In an approval workflow, stage IDs must be strictly increasing in <code>stages</code>. Count how many consecutive steps fail <code>stages[i] > stages[i-1]</code>.',
    constraints: ['1 <= stages.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'stages = [1, 2, 2, 4, 3]', output: '2' },
      { title: 'Test Case 2', input: 'stages = [1, 3, 5]', output: '0' },
      { title: 'Test Case 3', input: 'stages = [5, 4, 3]', output: '2' },
      { title: 'Test Case 4', input: 'stages = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countInvalidTransitions(int[] stages) {
        int bad = 0;
        for (int i = 1; i < stages.length; i++) if (stages[i] <= stages[i - 1]) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countInvalidTransitions(stages):
    return sum(1 for i in range(1, len(stages)) if stages[i] <= stages[i - 1])`
  },
  {
    number: 29,
    title: 'SQL GROUP BY Top Customer',
    fnName: 'topCustomerBySpend',
    description: 'Given customer IDs <code>custs</code> and order totals <code>totals</code>, return the customer ID with highest total spend (smallest ID on tie).',
    constraints: ['1 <= custs.length == totals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'custs = [1, 2, 1, 3], totals = [100, 250, 200, 300]', output: '1' },
      { title: 'Test Case 2', input: 'custs = [5, 3], totals = [50, 50]', output: '3' },
      { title: 'Test Case 3', input: 'custs = [8], totals = [99]', output: '8' },
      { title: 'Test Case 4', input: 'custs = [2, 2, 1], totals = [10, 20, 25]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int topCustomerBySpend(int[] custs, int[] totals) {
        Map<Integer, Long> m = new HashMap<>();
        for (int i = 0; i < custs.length; i++) m.put(custs[i], m.getOrDefault(custs[i], 0L) + totals[i]);
        int bestId = custs[0]; long bestVal = -1;
        for (var e : m.entrySet()) {
            if (e.getValue() > bestVal || (e.getValue() == bestVal && e.getKey() < bestId)) {
                bestVal = e.getValue(); bestId = e.getKey();
            }
        }
        return bestId;
    }
}`,
    pythonSolution: `from collections import defaultdict
def topCustomerBySpend(custs, totals):
    m = defaultdict(int)
    for c, t in zip(custs, totals): m[c] += t
    return min(m.keys(), key=lambda c: (-m[c], c))`
  },
  {
    number: 30,
    title: 'OData Query Pagination Slice',
    fnName: 'countReturnedRecords',
    description: 'An OData endpoint has <code>total</code> records and receives <code>skip</code> and <code>top</code> parameters. Return how many records are actually returned.',
    constraints: ['0 <= total, skip, top <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'total = 25, skip = 20, top = 10', output: '5' },
      { title: 'Test Case 2', input: 'total = 100, skip = 10, top = 20', output: '20' },
      { title: 'Test Case 3', input: 'total = 10, skip = 15, top = 5', output: '0' },
      { title: 'Test Case 4', input: 'total = 10, skip = 0, top = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long countReturnedRecords(long total, long skip, long top) {
        return Math.min(top, Math.max(0L, total - skip));
    }
}`,
    pythonSolution: `def countReturnedRecords(total, skip, top):
    return min(top, max(0, total - skip))`
  },
  {
    number: 31,
    title: 'Production Order Knapsack DP',
    fnName: 'maxOrderProfitInCapacity',
    description: 'Given production orders with machine-hours <code>hrs[i]</code> and profit <code>prof[i]</code>, and total available hours <code>cap</code>, maximize profit.',
    constraints: ['1 <= hrs.length <= 100', '0 <= cap <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'hrs = [3, 4, 5], prof = [30, 50, 60], cap = 8', output: '90' },
      { title: 'Test Case 2', input: 'hrs = [10, 20], prof = [5, 10], cap = 5', output: '0' },
      { title: 'Test Case 3', input: 'hrs = [2, 3], prof = [10, 20], cap = 5', output: '30' },
      { title: 'Test Case 4', input: 'hrs = [4], prof = [15], cap = 4', output: '15' }
    ],
    javaSolution: `public class Solution {
    public static int maxOrderProfitInCapacity(int[] hrs, int[] prof, int cap) {
        int[] dp = new int[cap + 1];
        for (int i = 0; i < hrs.length; i++)
            for (int h = cap; h >= hrs[i]; h--) dp[h] = Math.max(dp[h], dp[h - hrs[i]] + prof[i]);
        return dp[cap];
    }
}`,
    pythonSolution: `def maxOrderProfitInCapacity(hrs, prof, cap):
    dp = [0] * (cap + 1)
    for hr, pr in zip(hrs, prof):
        for h in range(cap, hr - 1, -1):
            if dp[h - hr] + pr > dp[h]: dp[h] = dp[h - hr] + pr
    return dp[cap]`
  },
  {
    number: 32,
    title: 'ERP User Session Timeout Count',
    fnName: 'countTimedOutSessions',
    description: 'Given sorted activity timestamps <code>times</code> of a user session, a timeout occurs whenever <code>times[i] - times[i-1] > ttl</code>. Return total timeouts.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [0, 10, 50, 60, 120], ttl = 30', output: '2' },
      { title: 'Test Case 2', input: 'times = [0, 30, 60], ttl = 30', output: '0' },
      { title: 'Test Case 3', input: 'times = [10], ttl = 5', output: '0' },
      { title: 'Test Case 4', input: 'times = [0, 31], ttl = 30', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countTimedOutSessions(int[] times, int ttl) {
        int cnt = 0;
        for (int i = 1; i < times.length; i++) if (times[i] - times[i - 1] > ttl) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countTimedOutSessions(times, ttl):
    return sum(1 for i in range(1, len(times)) if times[i] - times[i - 1] > ttl)`
  },
  {
    number: 33,
    title: 'Ledger Balance Sheet Symmetry',
    fnName: 'countUnbalancedEntries',
    description: 'Given debit totals <code>debits</code> and credit totals <code>credits</code> per journal batch, count how many batches do NOT balance (<code>debits[i] != credits[i]</code>).',
    constraints: ['1 <= debits.length == credits.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'debits = [100, 200, 300], credits = [100, 190, 300]', output: '1' },
      { title: 'Test Case 2', input: 'debits = [50, 50], credits = [50, 50]', output: '0' },
      { title: 'Test Case 3', input: 'debits = [10], credits = [20]', output: '1' },
      { title: 'Test Case 4', input: 'debits = [0, 0], credits = [0, 1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countUnbalancedEntries(int[] debits, int[] credits) {
        int bad = 0;
        for (int i = 0; i < debits.length; i++) if (debits[i] != credits[i]) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countUnbalancedEntries(debits, credits):
    return sum(1 for d, c in zip(debits, credits) if d != c)`
  },
  {
    number: 34,
    title: 'Warehouse Picking Zone Grid',
    fnName: 'countEmptyZones',
    description: 'In an <code>R x C</code> warehouse matrix <code>grid</code> (<code>0</code> = empty, <code>1</code> = occupied), return total empty cells.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 0, 1], [0, 0, 1]]', output: '3' },
      { title: 'Test Case 2', input: 'grid = [[1, 1], [1, 1]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[0]]', output: '1' },
      { title: 'Test Case 4', input: 'grid = [[0, 0], [0, 0]]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int countEmptyZones(int[][] grid) {
        int cnt = 0;
        for (int[] r : grid) for (int v : r) if (v == 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countEmptyZones(grid):
    return sum(1 for r in grid for v in r if v == 0)`
  },
  {
    number: 35,
    title: 'PO Line-Item Tax Calculation',
    fnName: 'totalInvoiceTax',
    description: 'Given line-item totals <code>totals</code> and tax percentages <code>taxPct</code> (integer floor per line), return total tax.',
    constraints: ['1 <= totals.length == taxPct.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'totals = [100, 200, 50], taxPct = [10, 5, 20]', output: '30' },
      { title: 'Test Case 2', input: 'totals = [100], taxPct = [0]', output: '0' },
      { title: 'Test Case 3', input: 'totals = [9], taxPct = [10]', output: '0' },
      { title: 'Test Case 4', input: 'totals = [500], taxPct = [18]', output: '90' }
    ],
    javaSolution: `public class Solution {
    public static long totalInvoiceTax(int[] totals, int[] taxPct) {
        long s = 0;
        for (int i = 0; i < totals.length; i++) s += ((long) totals[i] * taxPct[i]) / 100;
        return s;
    }
}`,
    pythonSolution: `def totalInvoiceTax(totals, taxPct):
    return sum((t * p) // 100 for t, p in zip(totals, taxPct))`
  },
  {
    number: 36,
    title: 'Software License Seat Utilization',
    fnName: 'unusedLicenseSeats',
    description: 'Given purchased seats <code>purchased</code> and active users <code>active</code> across modules, return total unused seats <code>sum(max(0, purchased[i] - active[i]))</code>.',
    constraints: ['1 <= purchased.length == active.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'purchased = [50, 100, 30], active = [40, 110, 10]', output: '30' },
      { title: 'Test Case 2', input: 'purchased = [20, 20], active = [20, 20]', output: '0' },
      { title: 'Test Case 3', input: 'purchased = [10], active = [0]', output: '10' },
      { title: 'Test Case 4', input: 'purchased = [10], active = [15]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long unusedLicenseSeats(int[] purchased, int[] active) {
        long s = 0;
        for (int i = 0; i < purchased.length; i++) if (purchased[i] > active[i]) s += purchased[i] - active[i];
        return s;
    }
}`,
    pythonSolution: `def unusedLicenseSeats(purchased, active):
    return sum(max(0, p - a) for p, a in zip(purchased, active))`
  },
  {
    number: 37,
    title: 'Delivery Schedule Window Overlap',
    fnName: 'countConflictingDeliveries',
    description: 'Given sorted delivery windows <code>wins</code> <code>[start, end)</code>, count how many windows overlap with the preceding window (<code>wins[i][0] < maxEndSoFar</code>).',
    constraints: ['1 <= wins.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'wins = [[1, 5], [4, 8], [8, 10], [9, 12]]', output: '2' },
      { title: 'Test Case 2', input: 'wins = [[1, 2], [2, 3], [3, 4]]', output: '0' },
      { title: 'Test Case 3', input: 'wins = [[0, 10]]', output: '0' },
      { title: 'Test Case 4', input: 'wins = [[0, 5], [1, 2], [3, 4]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countConflictingDeliveries(int[][] wins) {
        int maxEnd = wins[0][1], bad = 0;
        for (int i = 1; i < wins.length; i++) {
            if (wins[i][0] < maxEnd) bad++;
            maxEnd = Math.max(maxEnd, wins[i][1]);
        }
        return bad;
    }
}`,
    pythonSolution: `def countConflictingDeliveries(wins):
    mx = wins[0][1]; bad = 0
    for s, e in wins[1:]:
        if s < mx: bad += 1
        mx = max(mx, e)
    return bad`
  },
  {
    number: 38,
    title: 'ERP Audit Log Filter Count',
    fnName: 'countCriticalEvents',
    description: 'Given log severity codes <code>sev</code> and module IDs <code>mods</code>, count logs where <code>sev[i] >= minSev</code> AND <code>mods[i] == targetMod</code>.',
    constraints: ['1 <= sev.length == mods.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sev = [1, 4, 5, 3], mods = [2, 2, 1, 2], minSev = 3, targetMod = 2', output: '2' },
      { title: 'Test Case 2', input: 'sev = [5, 5], mods = [1, 1], minSev = 3, targetMod = 2', output: '0' },
      { title: 'Test Case 3', input: 'sev = [3], mods = [7], minSev = 3, targetMod = 7', output: '1' },
      { title: 'Test Case 4', input: 'sev = [2], mods = [7], minSev = 3, targetMod = 7', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countCriticalEvents(int[] sev, int[] mods, int minSev, int targetMod) {
        int cnt = 0;
        for (int i = 0; i < sev.length; i++) if (sev[i] >= minSev && mods[i] == targetMod) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countCriticalEvents(sev, mods, minSev, targetMod):
    return sum(1 for s, m in zip(sev, mods) if s >= minSev and m == targetMod)`
  },
  {
    number: 39,
    title: 'SAP Module Dependency Reach',
    fnName: 'countImpactedModules',
    description: 'Given <code>n</code> modules (0..n-1) and directed impact edges <code>edges</code> <code>[u, v]</code> (if <code>u</code> changes, <code>v</code> is impacted), return total impacted modules starting from module <code>0</code> (including <code>0</code>).',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, edges = [[0, 1], [1, 2], [3, 4]]', output: '3' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[1, 2]]', output: '1' },
      { title: 'Test Case 3', input: 'n = 3, edges = [[0, 1], [0, 2]]', output: '3' },
      { title: 'Test Case 4', input: 'n = 1, edges = []', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countImpactedModules(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) g.get(e[0]).add(e[1]);
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
def countImpactedModules(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges: g[u].append(v)
    vis = {0}; q = deque([0])
    while q:
        u = q.popleft()
        for v in g[u]:
            if v not in vis: vis.add(v); q.append(v)
    return len(vis)`
  },
  {
    number: 40,
    title: 'Sales Commission Bracket Sum',
    fnName: 'totalSalesCommissions',
    description: 'Sales reps achieved revenues <code>revs</code>. Commission is <code>rate1</code>% (integer floor) if <code>revs[i] < target</code> else <code>rate2</code>%. Return total commission.',
    constraints: ['1 <= revs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'revs = [100, 500, 200], target = 200, rate1 = 5, rate2 = 10', output: '75' },
      { title: 'Test Case 2', input: 'revs = [50, 50], target = 100, rate1 = 2, rate2 = 10', output: '2' },
      { title: 'Test Case 3', input: 'revs = [1000], target = 500, rate1 = 1, rate2 = 8', output: '80' },
      { title: 'Test Case 4', input: 'revs = [0], target = 10, rate1 = 5, rate2 = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalSalesCommissions(int[] revs, int target, int rate1, int rate2) {
        long s = 0;
        for (int r : revs) {
            int pct = (r < target) ? rate1 : rate2;
            s += ((long) r * pct) / 100;
        }
        return s;
    }
}`,
    pythonSolution: `def totalSalesCommissions(revs, target, rate1, rate2):
    return sum((r * (rate1 if r < target else rate2)) // 100 for r in revs)`
  },
  {
    number: 41,
    title: 'Database Index Cardinality Check',
    fnName: 'isHighCardinalityColumn',
    description: 'A column has values <code>vals</code>. Return <code>true</code> if at least half of the entries are distinct (<code>distinct * 2 >= len(vals)</code>), else <code>false</code>.',
    constraints: ['1 <= vals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'vals = [1, 2, 1, 3]', output: 'true' },
      { title: 'Test Case 2', input: 'vals = [1, 1, 1, 2]', output: 'true' },
      { title: 'Test Case 3', input: 'vals = [1, 1, 1, 1, 1]', output: 'false' },
      { title: 'Test Case 4', input: 'vals = [7]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean isHighCardinalityColumn(int[] vals) {
        Set<Integer> s = new HashSet<>();
        for (int v : vals) s.add(v);
        return s.size() * 2 >= vals.length;
    }
}`,
    pythonSolution: `def isHighCardinalityColumn(vals):
    return len(set(vals)) * 2 >= len(vals)`
  },
  {
    number: 42,
    title: 'Work Center Utilization Peak',
    fnName: 'maxDailyUtilization',
    description: 'Given work center hours used <code>hours</code> and window <code>k</code> days, return maximum total hours in any <code>k</code> consecutive days.',
    constraints: ['1 <= k <= hours.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'hours = [4, 8, 2, 9, 6], k = 2', output: '15' },
      { title: 'Test Case 2', input: 'hours = [5, 5, 5], k = 3', output: '15' },
      { title: 'Test Case 3', input: 'hours = [1, 10, 2], k = 1', output: '10' },
      { title: 'Test Case 4', input: 'hours = [7, 7], k = 2', output: '14' }
    ],
    javaSolution: `public class Solution {
    public static long maxDailyUtilization(int[] hours, int k) {
        long cur = 0;
        for (int i = 0; i < k; i++) cur += hours[i];
        long best = cur;
        for (int i = k; i < hours.length; i++) { cur += hours[i] - hours[i - k]; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def maxDailyUtilization(hours, k):
    cur = sum(hours[:k]); best = cur
    for i in range(k, len(hours)):
        cur += hours[i] - hours[i - k]; best = max(best, cur)
    return best`
  },
  {
    number: 43,
    title: 'Order Backlog Aging Count',
    fnName: 'countAgedOrders',
    description: 'Given order creation days <code>created</code> and current day <code>today</code>, count how many orders are older than <code>maxAge</code> days (<code>today - created[i] > maxAge</code>).',
    constraints: ['1 <= created.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'created = [10, 25, 40], today = 50, maxAge = 20', output: '2' },
      { title: 'Test Case 2', input: 'created = [30, 40], today = 50, maxAge = 20', output: '0' },
      { title: 'Test Case 3', input: 'created = [0], today = 10, maxAge = 9', output: '1' },
      { title: 'Test Case 4', input: 'created = [10], today = 20, maxAge = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countAgedOrders(int[] created, int today, int maxAge) {
        int cnt = 0;
        for (int c : created) if (today - c > maxAge) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAgedOrders(created, today, maxAge):
    return sum(1 for c in created if today - c > maxAge)`
  },
  {
    number: 44,
    title: 'SAP Cloud Service Uptime',
    fnName: 'longestUptimeStreak',
    description: 'Given hourly health checks <code>up</code> (<code>1</code> = up, <code>0</code> = down), return the longest consecutive uptime streak.',
    constraints: ['1 <= up.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'up = [1, 1, 0, 1, 1, 1, 0]', output: '3' },
      { title: 'Test Case 2', input: 'up = [0, 0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'up = [1, 1, 1]', output: '3' },
      { title: 'Test Case 4', input: 'up = [1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestUptimeStreak(int[] up) {
        int cur = 0, best = 0;
        for (int x : up) { cur = (x == 1) ? cur + 1 : 0; best = Math.max(best, cur); }
        return best;
    }
}`,
    pythonSolution: `def longestUptimeStreak(up):
    cur = best = 0
    for x in up:
        cur = cur + 1 if x == 1 else 0
        best = max(best, cur)
    return best`
  },
  {
    number: 45,
    title: 'Currency Exchange Fee Rounding',
    fnName: 'totalConversionFees',
    description: 'Convert amounts <code>amts</code> using integer rate <code>rate</code> and deduct <code>fee</code> per conversion (minimum 0). Actually, return total <code>max(0, amts[i] * rate - fee)</code>? No: simply return <code>sum(min(amts[i] * rate, fee))</code> (the total fees collected).',
    constraints: ['1 <= amts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amts = [10, 50, 100], rate = 2, fee = 50', output: '120' },
      { title: 'Test Case 2', input: 'amts = [5, 5], rate = 1, fee = 10', output: '10' },
      { title: 'Test Case 3', input: 'amts = [100], rate = 3, fee = 20', output: '20' },
      { title: 'Test Case 4', input: 'amts = [0], rate = 5, fee = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalConversionFees(int[] amts, int rate, int fee) {
        long s = 0;
        for (int a : amts) s += Math.min((long) a * rate, (long) fee);
        return s;
    }
}`,
    pythonSolution: `def totalConversionFees(amts, rate, fee):
    return sum(min(a * rate, fee) for a in amts)`
  },
  {
    number: 46,
    title: 'Master Data Duplicate Check',
    fnName: 'hasDuplicateMasterIds',
    description: 'Return <code>true</code> if array <code>ids</code> contains any duplicate integer, else <code>false</code>.',
    constraints: ['1 <= ids.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = [10, 20, 30, 10]', output: 'true' },
      { title: 'Test Case 2', input: 'ids = [1, 2, 3, 4]', output: 'false' },
      { title: 'Test Case 3', input: 'ids = [5]', output: 'false' },
      { title: 'Test Case 4', input: 'ids = [9, 9]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean hasDuplicateMasterIds(int[] ids) {
        Set<Integer> s = new HashSet<>();
        for (int id : ids) if (!s.add(id)) return true;
        return false;
    }
}`,
    pythonSolution: `def hasDuplicateMasterIds(ids):
    return len(set(ids)) < len(ids)`
  },
  {
    number: 47,
    title: 'ERP Shipment Weight Limit',
    fnName: 'countValidContainers',
    description: 'Given container weights <code>weights</code> and valid range <code>[minW, maxW]</code> inclusive, count containers within range.',
    constraints: ['1 <= weights.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [10, 25, 30, 50], minW = 20, maxW = 40', output: '2' },
      { title: 'Test Case 2', input: 'weights = [5, 60], minW = 10, maxW = 50', output: '0' },
      { title: 'Test Case 3', input: 'weights = [20, 40], minW = 20, maxW = 40', output: '2' },
      { title: 'Test Case 4', input: 'weights = [15], minW = 15, maxW = 15', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countValidContainers(int[] weights, int minW, int maxW) {
        int cnt = 0;
        for (int w : weights) if (w >= minW && w <= maxW) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countValidContainers(weights, minW, maxW):
    return sum(1 for w in weights if minW <= w <= maxW)`
  },
  {
    number: 48,
    title: 'Invoice Prefix Filter Count',
    fnName: 'countInvoicesWithPrefix',
    description: 'Given invoice codes <code>codes</code> and prefix <code>prefix</code>, return how many codes start with <code>prefix</code>.',
    constraints: ['1 <= codes.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'codes = ["INV-101", "INV-102", "PO-201"], prefix = "INV-"', output: '2' },
      { title: 'Test Case 2', input: 'codes = ["PO-1", "PO-2"], prefix = "INV-"', output: '0' },
      { title: 'Test Case 3', input: 'codes = ["A"], prefix = "A"', output: '1' },
      { title: 'Test Case 4', input: 'codes = ["X", "Y"], prefix = ""', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countInvoicesWithPrefix(String[] codes, String prefix) {
        int cnt = 0;
        for (String c : codes) if (c.startsWith(prefix)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countInvoicesWithPrefix(codes, prefix):
    return sum(1 for c in codes if c.startswith(prefix))`
  },
  {
    number: 49,
    title: 'Database Partition Load Balance',
    fnName: 'maxShardSkew',
    description: 'Records with keys <code>keys</code> are sharded across <code>s</code> shards via <code>key % s</code>. Return <code>maxShardCount - minShardCount</code>.',
    constraints: ['1 <= keys.length <= 10^5', '1 <= s <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'keys = [0, 1, 2, 3, 6], s = 3', output: '2' },
      { title: 'Test Case 2', input: 'keys = [0, 3, 6], s = 3', output: '3' },
      { title: 'Test Case 3', input: 'keys = [0, 1, 2], s = 3', output: '0' },
      { title: 'Test Case 4', input: 'keys = [10], s = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxShardSkew(int[] keys, int s) {
        int[] cnt = new int[s];
        for (int k : keys) cnt[((k % s) + s) % s]++;
        int mn = Integer.MAX_VALUE, mx = 0;
        for (int c : cnt) { mn = Math.min(mn, c); mx = Math.max(mx, c); }
        return mx - mn;
    }
}`,
    pythonSolution: `def maxShardSkew(keys, s):
    cnt = [0] * s
    for k in keys: cnt[k % s] += 1
    return max(cnt) - min(cnt)`
  },
  {
    number: 50,
    title: 'ERP Migration Cutover Steps',
    fnName: 'minCutoverStages',
    description: 'Given <code>n</code> subsystems and DAG dependencies <code>deps</code> <code>[u, v]</code> (<code>u</code> before <code>v</code>), each stage can migrate any number of ready subsystems in parallel. Return minimum stages needed to migrate all <code>n</code> subsystems.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, deps = [[0, 1], [1, 2], [2, 3]]', output: '4' },
      { title: 'Test Case 2', input: 'n = 3, deps = []', output: '1' },
      { title: 'Test Case 3', input: 'n = 4, deps = [[0, 2], [1, 2], [2, 3]]', output: '3' },
      { title: 'Test Case 4', input: 'n = 1, deps = []', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minCutoverStages(int n, int[][] deps) {
        List<List<Integer>> g = new ArrayList<>();
        int[] ind = new int[n], lvl = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] d : deps) { g.get(d[0]).add(d[1]); ind[d[1]]++; }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (ind[i] == 0) { lvl[i] = 1; q.add(i); }
        int best = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); best = Math.max(best, lvl[u]);
            for (int v : g.get(u)) {
                lvl[v] = Math.max(lvl[v], lvl[u] + 1);
                if (--ind[v] == 0) q.add(v);
            }
        }
        return best;
    }
}`,
    pythonSolution: `from collections import deque
def minCutoverStages(n, deps):
    g = [[] for _ in range(n)]; ind = [0] * n; lvl = [1] * n
    for u, v in deps: g[u].append(v); ind[v] += 1
    q = deque([i for i in range(n) if ind[i] == 0])
    while q:
        u = q.popleft()
        for v in g[u]:
            lvl[v] = max(lvl[v], lvl[u] + 1); ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return max(lvl)`
  }
];
