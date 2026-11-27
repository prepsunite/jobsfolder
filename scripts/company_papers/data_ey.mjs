export const EY_QUESTIONS = [
  {
    number: 1,
    title: 'GDS Transaction Batch Splitter',
    fnName: 'maxBalancedBatches',
    description: 'EY GDS processes a stream of incoming ledger flags <code>s</code> consisting of <code>\'C\'</code> (credit) and <code>\'D\'</code> (debit). Split <code>s</code> into the maximum number of contiguous non-empty batches such that every batch has an equal number of <code>C</code>s and <code>D</code>s. Return the maximum batch count.',
    constraints: ['2 <= s.length <= 10^5', 's has equal total C and D'],
    testCases: [
      { title: 'Test Case 1', input: 's = "CDCCDDCD"', output: '3' },
      { title: 'Test Case 2', input: 's = "CCDDCD"', output: '2' },
      { title: 'Test Case 3', input: 's = "CCCDDD"', output: '1' },
      { title: 'Test Case 4', input: 's = "CDCDCD"', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int maxBalancedBatches(String s) {
        int bal = 0, batches = 0;
        for (char c : s.toCharArray()) {
            bal += (c == 'C' ? 1 : -1);
            if (bal == 0) batches++;
        }
        return batches;
    }
}`,
    pythonSolution: `def maxBalancedBatches(s):
    bal = batches = 0
    for c in s:
        bal += 1 if c == 'C' else -1
        if bal == 0:
            batches += 1
    return batches`
  },
  {
    number: 2,
    title: 'Compliance Rule Priority Queue',
    fnName: 'minComplianceViolations',
    description: 'A financial compliance engine checks daily balances <code>balances</code>. Whenever the running prefix sum becomes strictly negative, a compliance alert is triggered and you must waive (remove) the smallest negative entry seen so far in the prefix to restore non-negative balance. Return the minimum number of waivers needed.',
    constraints: ['1 <= balances.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'balances = [10, -10, -1, -1, 10]', output: '1' },
      { title: 'Test Case 2', input: 'balances = [-1, -1, 10]', output: '2' },
      { title: 'Test Case 3', input: 'balances = [5, 3, -2, -4]', output: '0' },
      { title: 'Test Case 4', input: 'balances = [-5]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minComplianceViolations(int[] balances) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        long sum = 0;
        int waivers = 0;
        for (int b : balances) {
            sum += b;
            if (b < 0) pq.add(b);
            while (sum < 0 && !pq.isEmpty()) {
                sum -= pq.poll();
                waivers++;
            }
        }
        return waivers;
    }
}`,
    pythonSolution: `def minComplianceViolations(balances):
    import heapq
    h = []
    s = waivers = 0
    for b in balances:
        s += b
        if b < 0:
            heapq.heappush(h, b)
        while s < 0 and h:
            s -= heapq.heappop(h)
            waivers += 1
    return waivers`
  },
  {
    number: 3,
    title: 'SLA Breach Window Counter',
    fnName: 'countSlaBreaches',
    description: 'Given response times <code>latencies</code> (in ms), a rolling window size <code>k</code>, and an SLA limit <code>limit</code>, count how many contiguous windows of size <code>k</code> have an average latency strictly greater than <code>limit</code>.',
    constraints: ['1 <= k <= latencies.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'latencies = [200, 300, 400, 100, 500], k = 3, limit = 250', output: '3' },
      { title: 'Test Case 2', input: 'latencies = [100, 100, 100], k = 2, limit = 100', output: '0' },
      { title: 'Test Case 3', input: 'latencies = [500, 600], k = 1, limit = 400', output: '2' },
      { title: 'Test Case 4', input: 'latencies = [10, 20, 30, 40], k = 4, limit = 25', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSlaBreaches(int[] latencies, int k, int limit) {
        long sum = 0, thresh = (long) k * limit;
        int count = 0;
        for (int i = 0; i < latencies.length; i++) {
            sum += latencies[i];
            if (i >= k) sum -= latencies[i - k];
            if (i >= k - 1 && sum > thresh) count++;
        }
        return count;
    }
}`,
    pythonSolution: `def countSlaBreaches(latencies, k, limit):
    s = count = 0
    thresh = k * limit
    for i, x in enumerate(latencies):
        s += x
        if i >= k:
            s -= latencies[i - k]
        if i >= k - 1 and s > thresh:
            count += 1
    return count`
  },
  {
    number: 4,
    title: 'Portfolio Rebalance Peak Gain',
    fnName: 'maxPortfolioGain',
    description: 'An EY wealth-advisory model can buy and sell a stock multiple times (holding at most 1 share at a time). Given daily prices <code>prices</code>, return the maximum total profit achievable.',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [7, 1, 5, 3, 6, 4]', output: '7' },
      { title: 'Test Case 2', input: 'prices = [1, 2, 3, 4, 5]', output: '4' },
      { title: 'Test Case 3', input: 'prices = [7, 6, 4, 3, 1]', output: '0' },
      { title: 'Test Case 4', input: 'prices = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxPortfolioGain(int[] prices) {
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
        }
        return profit;
    }
}`,
    pythonSolution: `def maxPortfolioGain(prices):
    return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))`
  },
  {
    number: 5,
    title: 'Fraud Ring Union-Find Clusters',
    fnName: 'countFraudClusters',
    description: 'Given <code>n</code> accounts (0 to n-1) and a list of shared-device links <code>links</code> where each pair <code>[u, v]</code> connects two accounts, return the number of connected account clusters.',
    constraints: ['1 <= n <= 10^4', '0 <= links.length <= 2 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, links = [[0, 1], [1, 2], [3, 4]]', output: '2' },
      { title: 'Test Case 2', input: 'n = 4, links = []', output: '4' },
      { title: 'Test Case 3', input: 'n = 4, links = [[0, 1], [1, 2], [2, 3]]', output: '1' },
      { title: 'Test Case 4', input: 'n = 3, links = [[0, 1], [0, 1]]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countFraudClusters(int n, int[][] links) {
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        int comps = n;
        for (int[] e : links) {
            int r1 = find(p, e[0]), r2 = find(p, e[1]);
            if (r1 != r2) { p[r1] = r2; comps--; }
        }
        return comps;
    }
    private static int find(int[] p, int x) {
        return p[x] == x ? x : (p[x] = find(p, p[x]));
    }
}`,
    pythonSolution: `def countFraudClusters(n, links):
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x
    comps = n
    for u, v in links:
        ru, rv = find(u), find(v)
        if ru != rv:
            p[ru] = rv
            comps -= 1
    return comps`
  },
  {
    number: 6,
    title: 'Audit Trail Palindrome Check',
    fnName: 'isAlnumPalindrome',
    description: 'Given a log string <code>s</code>, consider only alphanumeric characters (case-insensitive) and return <code>true</code> if it reads the same forward and backward.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
      { title: 'Test Case 2', input: 's = "EY-GDS-2026"', output: 'false' },
      { title: 'Test Case 3', input: 's = " "', output: 'true' },
      { title: 'Test Case 4', input: 's = "0P0"', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean isAlnumPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`,
    pythonSolution: `def isAlnumPalindrome(s):
    t = [c.lower() for c in s if c.isalnum()]
    return t == t[::-1]`
  },
  {
    number: 7,
    title: 'Quarterly Revenue Pivot Merger',
    fnName: 'mergeSortedSnapshots',
    description: 'Given two sorted arrays of transaction timestamps <code>a</code> and <code>b</code>, merge them into a single sorted array.',
    constraints: ['0 <= a.length, b.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [1, 3, 5], b = [2, 4, 6]', output: '[1, 2, 3, 4, 5, 6]' },
      { title: 'Test Case 2', input: 'a = [], b = [10, 20]', output: '[10, 20]' },
      { title: 'Test Case 3', input: 'a = [1, 2, 2], b = [2, 3]', output: '[1, 2, 2, 2, 3]' },
      { title: 'Test Case 4', input: 'a = [5], b = []', output: '[5]' }
    ],
    javaSolution: `public class Solution {
    public static int[] mergeSortedSnapshots(int[] a, int[] b) {
        int[] res = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
        while (i < a.length) res[k++] = a[i++];
        while (j < b.length) res[k++] = b[j++];
        return res;
    }
}`,
    pythonSolution: `def mergeSortedSnapshots(a, b):
    res = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            res.append(a[i]); i += 1
        else:
            res.append(b[j]); j += 1
    res.extend(a[i:]); res.extend(b[j:])
    return res`
  },
  {
    number: 8,
    title: 'Minimum Edit Distance for Record Matching',
    fnName: 'minRecordEditDistance',
    description: 'An EY master-data-management (MDM) service matches messy client names <code>w1</code> and <code>w2</code>. Return the minimum number of single-character insertions, deletions, or replacements required to convert <code>w1</code> into <code>w2</code>.',
    constraints: ['0 <= w1.length, w2.length <= 300'],
    testCases: [
      { title: 'Test Case 1', input: 'w1 = "horse", w2 = "ros"', output: '3' },
      { title: 'Test Case 2', input: 'w1 = "intention", w2 = "execution"', output: '5' },
      { title: 'Test Case 3', input: 'w1 = "deloitte", w2 = "deloitte"', output: '0' },
      { title: 'Test Case 4', input: 'w1 = "", w2 = "abc"', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int minRecordEditDistance(String w1, String w2) {
        int m = w1.length(), n = w2.length();
        int[] dp = new int[n + 1];
        for (int j = 0; j <= n; j++) dp[j] = j;
        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = i;
            for (int j = 1; j <= n; j++) {
                int tmp = dp[j];
                if (w1.charAt(i - 1) == w2.charAt(j - 1)) dp[j] = prev;
                else dp[j] = 1 + Math.min(prev, Math.min(dp[j], dp[j - 1]));
                prev = tmp;
            }
        }
        return dp[n];
    }
}`,
    pythonSolution: `def minRecordEditDistance(w1, w2):
    m, n = len(w1), len(w2)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            tmp = dp[j]
            if w1[i - 1] == w2[j - 1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(prev, dp[j], dp[j - 1])
            prev = tmp
    return dp[n]`
  },
  {
    number: 9,
    title: 'Access Control Role Permission Check',
    fnName: 'countAuthorizedUsers',
    description: 'A security audit gives a list of user roles <code>userRoles</code> (each is a list of permission strings) and a list of required permissions <code>required</code>. Count how many users possess ALL required permissions.',
    constraints: ['1 <= userRoles.length <= 10^4', '1 <= required.length <= 20'],
    testCases: [
      { title: 'Test Case 1', input: 'userRoles = [["read", "write", "audit"], ["read"], ["audit", "write", "read", "admin"]], required = ["read", "audit"]', output: '2' },
      { title: 'Test Case 2', input: 'userRoles = [["read"], ["write"]], required = ["admin"]', output: '0' },
      { title: 'Test Case 3', input: 'userRoles = [["a", "b"]], required = ["a", "b"]', output: '1' },
      { title: 'Test Case 4', input: 'userRoles = [[]], required = ["read"]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countAuthorizedUsers(String[][] userRoles, String[] required) {
        int count = 0;
        for (String[] roles : userRoles) {
            Set<String> s = new HashSet<>(Arrays.asList(roles));
            boolean ok = true;
            for (String req : required) if (!s.contains(req)) { ok = false; break; }
            if (ok) count++;
        }
        return count;
    }
}`,
    pythonSolution: `def countAuthorizedUsers(userRoles, required):
    req = set(required)
    return sum(1 for roles in userRoles if req.issubset(roles))`
  },
  {
    number: 10,
    title: 'Submatrix Audit Sum Queries',
    fnName: 'rangeMatrixSum',
    description: 'Given a 2D integer matrix <code>mat</code> and a list of rectangular queries <code>queries</code> where each query is <code>[r1, c1, r2, c2]</code> (0-indexed inclusive), return an array with the sum of elements inside each rectangle.',
    constraints: ['1 <= R, C <= 200', '1 <= queries.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]], queries = [[0, 0, 1, 1], [1, 1, 2, 2]]', output: '[12, 28]' },
      { title: 'Test Case 2', input: 'mat = [[5, 5], [5, 5]], queries = [[0, 0, 1, 1]]', output: '[20]' },
      { title: 'Test Case 3', input: 'mat = [[10]], queries = [[0, 0, 0, 0]]', output: '[10]' },
      { title: 'Test Case 4', input: 'mat = [[1, -1], [-1, 1]], queries = [[0, 0, 0, 1], [0, 0, 1, 1]]', output: '[0, 0]' }
    ],
    javaSolution: `public class Solution {
    public static int[] rangeMatrixSum(int[][] mat, int[][] queries) {
        int r = mat.length, c = mat[0].length;
        int[][] p = new int[r + 1][c + 1];
        for (int i = 1; i <= r; i++)
            for (int j = 1; j <= c; j++)
                p[i][j] = mat[i-1][j-1] + p[i-1][j] + p[i][j-1] - p[i-1][j-1];
        int[] res = new int[queries.length];
        for (int k = 0; k < queries.length; k++) {
            int r1 = queries[k][0], c1 = queries[k][1], r2 = queries[k][2], c2 = queries[k][3];
            res[k] = p[r2+1][c2+1] - p[r1][c2+1] - p[r2+1][c1] + p[r1][c1];
        }
        return res;
    }
}`,
    pythonSolution: `def rangeMatrixSum(mat, queries):
    r, c = len(mat), len(mat[0])
    p = [[0] * (c + 1) for _ in range(r + 1)]
    for i in range(1, r + 1):
        for j in range(1, c + 1):
            p[i][j] = mat[i-1][j-1] + p[i-1][j] + p[i][j-1] - p[i-1][j-1]
    return [p[r2+1][c2+1] - p[r1][c2+1] - p[r2+1][c1] + p[r1][c1] for r1, c1, r2, c2 in queries]`
  },
  {
    number: 11,
    title: 'Minimum Coins for Exact Audit Change',
    fnName: 'countChangeWays',
    description: 'Given distinct coin denominations <code>coins</code> and a target <code>amount</code>, return the number of combinations that make up that amount (order of coins does not matter).',
    constraints: ['1 <= coins.length <= 20', '0 <= amount <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'coins = [1, 2, 5], amount = 5', output: '4' },
      { title: 'Test Case 2', input: 'coins = [2], amount = 3', output: '0' },
      { title: 'Test Case 3', input: 'coins = [10], amount = 10', output: '1' },
      { title: 'Test Case 4', input: 'coins = [1, 2, 3], amount = 0', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countChangeWays(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int c : coins)
            for (int a = c; a <= amount; a++) dp[a] += dp[a - c];
        return dp[amount];
    }
}`,
    pythonSolution: `def countChangeWays(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for c in coins:
        for a in range(c, amount + 1):
            dp[a] += dp[a - c]
    return dp[amount]`
  },
  {
    number: 12,
    title: 'First Unique Transaction ID',
    fnName: 'firstUniqueTxn',
    description: 'Given a list of transaction IDs <code>txns</code>, return the first transaction ID that appears exactly once. If none exists, return <code>-1</code>.',
    constraints: ['1 <= txns.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'txns = [4, 5, 1, 2, 0, 4]', output: '5' },
      { title: 'Test Case 2', input: 'txns = [1, 1, 2, 2]', output: '-1' },
      { title: 'Test Case 3', input: 'txns = [99]', output: '99' },
      { title: 'Test Case 4', input: 'txns = [3, 3, 7, 8, 7]', output: '8' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int firstUniqueTxn(int[] txns) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int t : txns) cnt.put(t, cnt.getOrDefault(t, 0) + 1);
        for (int t : txns) if (cnt.get(t) == 1) return t;
        return -1;
    }
}`,
    pythonSolution: `def firstUniqueTxn(txns):
    from collections import Counter
    cnt = Counter(txns)
    for t in txns:
        if cnt[t] == 1:
            return t
    return -1`
  },
  {
    number: 13,
    title: 'Interval Intersection of Auditor Shifts',
    fnName: 'intersectShifts',
    description: 'Given two sorted lists of disjoint closed time intervals <code>a</code> and <code>b</code> representing two auditors\' availability, return the list of their overlapping time intervals.',
    constraints: ['0 <= a.length, b.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [[0, 2], [5, 10], [13, 23]], b = [[1, 5], [8, 12], [15, 24]]', output: '[[1, 2], [5, 5], [8, 10], [15, 23]]' },
      { title: 'Test Case 2', input: 'a = [[1, 3], [5, 9]], b = []', output: '[]' },
      { title: 'Test Case 3', input: 'a = [[1, 7]], b = [[3, 10]]', output: '[[3, 7]]' },
      { title: 'Test Case 4', input: 'a = [[1, 2]], b = [[3, 4]]', output: '[]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[][] intersectShifts(int[][] a, int[][] b) {
        List<int[]> res = new ArrayList<>();
        int i = 0, j = 0;
        while (i < a.length && j < b.length) {
            int lo = Math.max(a[i][0], b[j][0]);
            int hi = Math.min(a[i][1], b[j][1]);
            if (lo <= hi) res.add(new int[]{lo, hi});
            if (a[i][1] < b[j][1]) i++; else j++;
        }
        return res.toArray(new int[0][]);
    }
}`,
    pythonSolution: `def intersectShifts(a, b):
    res = []
    i = j = 0
    while i < len(a) and j < len(b):
        lo, hi = max(a[i][0], b[j][0]), min(a[i][1], b[j][1])
        if lo <= hi:
            res.append([lo, hi])
        if a[i][1] < b[j][1]:
            i += 1
        else:
            j += 1
    return res`
  },
  {
    number: 14,
    title: 'Maximum Sum Circular Ledger Window',
    fnName: 'maxCircularNetFlow',
    description: 'Given a circular array of net cash flows <code>nums</code>, find the maximum possible sum of a non-empty contiguous subarray (wrapping around the end is allowed, but an element may be used at most once).',
    constraints: ['1 <= nums.length <= 3 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, -2, 3, -2]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [5, -3, 5]', output: '10' },
      { title: 'Test Case 3', input: 'nums = [-3, -2, -3]', output: '-2' },
      { title: 'Test Case 4', input: 'nums = [3, -1, 2, -1]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int maxCircularNetFlow(int[] nums) {
        int total = 0, curMax = 0, maxSum = nums[0], curMin = 0, minSum = nums[0];
        for (int x : nums) {
            curMax = Math.max(curMax + x, x);
            maxSum = Math.max(maxSum, curMax);
            curMin = Math.min(curMin + x, x);
            minSum = Math.min(minSum, curMin);
            total += x;
        }
        return maxSum > 0 ? Math.max(maxSum, total - minSum) : maxSum;
    }
}`,
    pythonSolution: `def maxCircularNetFlow(nums):
    total = cur_max = cur_min = 0
    max_s = min_s = nums[0]
    for x in nums:
        cur_max = max(cur_max + x, x)
        max_s = max(max_s, cur_max)
        cur_min = min(cur_min + x, x)
        min_s = min(min_s, cur_min)
        total += x
    return max(max_s, total - min_s) if max_s > 0 else max_s`
  },
  {
    number: 15,
    title: 'K-Diff Pairs in Risk Ratings',
    fnName: 'countKDiffPairs',
    description: 'Given an array of risk ratings <code>nums</code> and a non-negative integer <code>k</code>, return the number of unique pairs <code>(a, b)</code> (ignoring order, so <code>(a, b)</code> and <code>(b, a)</code> are the same pair) such that <code>|a - b| == k</code>.',
    constraints: ['1 <= nums.length <= 10^4', '0 <= k <= 10^7'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 1, 4, 1, 5], k = 2', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 4, 5], k = 1', output: '4' },
      { title: 'Test Case 3', input: 'nums = [1, 3, 1, 5, 4], k = 0', output: '1' },
      { title: 'Test Case 4', input: 'nums = [1, 1, 1], k = 2', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countKDiffPairs(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) cnt.put(x, cnt.getOrDefault(x, 0) + 1);
        int res = 0;
        for (int x : cnt.keySet()) {
            if (k == 0) { if (cnt.get(x) > 1) res++; }
            else if (cnt.containsKey(x + k)) res++;
        }
        return res;
    }
}`,
    pythonSolution: `def countKDiffPairs(nums, k):
    from collections import Counter
    cnt = Counter(nums)
    if k == 0:
        return sum(1 for v in cnt.values() if v > 1)
    return sum(1 for x in cnt if x + k in cnt)`
  },
  {
    number: 16,
    title: 'Shortest Path in Corporate Campus Grid',
    fnName: 'shortestCampusPath',
    description: 'Given an <code>R x C</code> grid where <code>0</code> is a walkable corridor and <code>1</code> is a locked zone, find the minimum number of steps (4-directional) from <code>(0,0)</code> to <code>(R-1,C-1)</code>. Return <code>-1</code> if unreachable.',
    constraints: ['1 <= R, C <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 0, 0], [1, 1, 0], [0, 0, 0]]', output: '4' },
      { title: 'Test Case 2', input: 'grid = [[0, 1], [1, 0]]', output: '-1' },
      { title: 'Test Case 3', input: 'grid = [[0]]', output: '0' },
      { title: 'Test Case 4', input: 'grid = [[0, 0, 0], [0, 1, 0], [0, 0, 0]]', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int shortestCampusPath(int[][] grid) {
        int r = grid.length, c = grid[0].length;
        if (grid[0][0] == 1 || grid[r-1][c-1] == 1) return -1;
        if (r == 1 && c == 1) return 0;
        boolean[][] vis = new boolean[r][c];
        Deque<int[]> q = new ArrayDeque<>();
        q.add(new int[]{0, 0, 0});
        vis[0][0] = true;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int nx = cur[0] + d[0], ny = cur[1] + d[1];
                if (nx >= 0 && ny >= 0 && nx < r && ny < c && grid[nx][ny] == 0 && !vis[nx][ny]) {
                    if (nx == r - 1 && ny == c - 1) return cur[2] + 1;
                    vis[nx][ny] = true;
                    q.add(new int[]{nx, ny, cur[2] + 1});
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `def shortestCampusPath(grid):
    from collections import deque
    r, c = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[-1][-1] == 1:
        return -1
    if r == 1 and c == 1:
        return 0
    vis = {(0, 0)}
    q = deque([(0, 0, 0)])
    while q:
        x, y, d = q.popleft()
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < r and 0 <= ny < c and grid[nx][ny] == 0 and (nx, ny) not in vis:
                if nx == r - 1 and ny == c - 1:
                    return d + 1
                vis.add((nx, ny))
                q.append((nx, ny, d + 1))
    return -1`
  },
  {
    number: 17,
    title: 'Longest Common Subsequence of Audit Logs',
    fnName: 'longestCommonLogSeq',
    description: 'Compare two system event strings <code>s1</code> and <code>s2</code> and return the length of their longest common subsequence.',
    constraints: ['1 <= s1.length, s2.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 's1 = "abcde", s2 = "ace"', output: '3' },
      { title: 'Test Case 2', input: 's1 = "abc", s2 = "def"', output: '0' },
      { title: 'Test Case 3', input: 's1 = "aggtab", s2 = "gxtxayb"', output: '4' },
      { title: 'Test Case 4', input: 's1 = "xyz", s2 = "xyz"', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int longestCommonLogSeq(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[] dp = new int[n + 1];
        for (int i = 1; i <= m; i++) {
            int prev = 0;
            for (int j = 1; j <= n; j++) {
                int tmp = dp[j];
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[j] = prev + 1;
                else dp[j] = Math.max(dp[j], dp[j - 1]);
                prev = tmp;
            }
        }
        return dp[n];
    }
}`,
    pythonSolution: `def longestCommonLogSeq(s1, s2):
    m, n = len(s1), len(s2)
    dp = [0] * (n + 1)
    for i in range(1, m + 1):
        prev = 0
        for j in range(1, n + 1):
            tmp = dp[j]
            dp[j] = prev + 1 if s1[i-1] == s2[j-1] else max(dp[j], dp[j-1])
            prev = tmp
    return dp[n]`
  },
  {
    number: 18,
    title: 'Weighted Task Selection Without Overlap',
    fnName: 'maxConsultingRevenue',
    description: 'Given consulting projects <code>projects</code> where each is <code>[start, end, profit]</code>, select non-overlapping projects to maximize total profit. Return the maximum profit.',
    constraints: ['1 <= projects.length <= 2 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'projects = [[1, 3, 50], [2, 5, 20], [4, 6, 70], [6, 7, 60]]', output: '180' },
      { title: 'Test Case 2', input: 'projects = [[1, 2, 50], [3, 5, 20], [6, 19, 100], [2, 100, 200]]', output: '250' },
      { title: 'Test Case 3', input: 'projects = [[1, 5, 10]]', output: '10' },
      { title: 'Test Case 4', input: 'projects = [[1, 4, 30], [2, 4, 40], [3, 4, 20]]', output: '40' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxConsultingRevenue(int[][] projects) {
        Arrays.sort(projects, (a, b) -> Integer.compare(a[1], b[1]));
        int n = projects.length;
        int[] dp = new int[n];
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) ends[i] = projects[i][1];
        dp[0] = projects[0][2];
        for (int i = 1; i < n; i++) {
            int prof = projects[i][2];
            int l = 0, r = i - 1, idx = -1;
            while (l <= r) {
                int m = (l + r) >>> 1;
                if (ends[m] <= projects[i][0]) { idx = m; l = m + 1; }
                else r = m - 1;
            }
            if (idx != -1) prof += dp[idx];
            dp[i] = Math.max(dp[i - 1], prof);
        }
        return dp[n - 1];
    }
}`,
    pythonSolution: `def maxConsultingRevenue(projects):
    import bisect
    jobs = sorted(projects, key=lambda x: x[1])
    ends = [j[1] for j in jobs]
    dp = [0] * len(jobs)
    dp[0] = jobs[0][2]
    for i in range(1, len(jobs)):
        idx = bisect.bisect_right(ends, jobs[i][0], 0, i) - 1
        prof = jobs[i][2] + (dp[idx] if idx >= 0 else 0)
        dp[i] = max(dp[i - 1], prof)
    return dp[-1]`
  },
  {
    number: 19,
    title: 'Minimum Removals to Make Mountain Array',
    fnName: 'minMountainRemovals',
    description: 'An array <code>arr</code> is a mountain array if it has length >= 3 and strictly increases up to a peak index <code>i</code> (0 < i < len-1) then strictly decreases. Return the minimum number of elements to remove from <code>arr</code> to make it a mountain array.',
    constraints: ['3 <= arr.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [2, 1, 1, 5, 6, 2, 3, 1]', output: '3' },
      { title: 'Test Case 2', input: 'arr = [1, 3, 1]', output: '0' },
      { title: 'Test Case 3', input: 'arr = [4, 3, 2, 1, 1, 2, 3, 1]', output: '4' },
      { title: 'Test Case 4', input: 'arr = [1, 2, 3, 4, 3, 2, 1]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minMountainRemovals(int[] arr) {
        int n = arr.length;
        int[] lis = new int[n], lds = new int[n];
        Arrays.fill(lis, 1); Arrays.fill(lds, 1);
        for (int i = 0; i < n; i++)
            for (int j = 0; j < i; j++)
                if (arr[j] < arr[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
        for (int i = n - 1; i >= 0; i--)
            for (int j = n - 1; j > i; j--)
                if (arr[j] < arr[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
        int maxM = 0;
        for (int i = 1; i < n - 1; i++)
            if (lis[i] > 1 && lds[i] > 1) maxM = Math.max(maxM, lis[i] + lds[i] - 1);
        return n - maxM;
    }
}`,
    pythonSolution: `def minMountainRemovals(arr):
    n = len(arr)
    lis, lds = [1] * n, [1] * n
    for i in range(n):
        for j in range(i):
            if arr[j] < arr[i]:
                lis[i] = max(lis[i], lis[j] + 1)
    for i in range(n - 1, -1, -1):
        for j in range(n - 1, i, -1):
            if arr[j] < arr[i]:
                lds[i] = max(lds[i], lds[j] + 1)
    best = max((lis[i] + lds[i] - 1 for i in range(1, n - 1) if lis[i] > 1 and lds[i] > 1), default=0)
    return n - best`
  },
  {
    number: 20,
    title: 'Subarray Product Strictly Under Cap',
    fnName: 'countSubarraysUnderCap',
    description: 'Given positive integers <code>nums</code> and a cap <code>k</code>, return the number of contiguous subarrays where the product of all elements is strictly less than <code>k</code>.',
    constraints: ['1 <= nums.length <= 3 * 10^4', '1 <= nums[i] <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [10, 5, 2, 6], k = 100', output: '8' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3], k = 0', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 1, 1], k = 2', output: '6' },
      { title: 'Test Case 4', input: 'nums = [5, 10, 2], k = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSubarraysUnderCap(int[] nums, int k) {
        if (k <= 1) return 0;
        long prod = 1;
        int left = 0, count = 0;
        for (int right = 0; right < nums.length; right++) {
            prod *= nums[right];
            while (prod >= k) prod /= nums[left++];
            count += right - left + 1;
        }
        return count;
    }
}`,
    pythonSolution: `def countSubarraysUnderCap(nums, k):
    if k <= 1:
        return 0
    prod, left, count = 1, 0, 0
    for right, x in enumerate(nums):
        prod *= x
        while prod >= k:
            prod //= nums[left]
            left += 1
        count += right - left + 1
    return count`
  },
  {
    number: 21,
    title: 'Kth Smallest Element in Sorted Audit Matrix',
    fnName: 'kthSmallestInMatrix',
    description: 'Given an <code>n x n</code> matrix <code>matrix</code> where every row and column is sorted in ascending order, return the <code>k</code>-th smallest element (1-indexed).',
    constraints: ['1 <= n <= 300', '1 <= k <= n*n'],
    testCases: [
      { title: 'Test Case 1', input: 'matrix = [[1, 5, 9], [10, 11, 13], [12, 13, 15]], k = 8', output: '13' },
      { title: 'Test Case 2', input: 'matrix = [[-5]], k = 1', output: '-5' },
      { title: 'Test Case 3', input: 'matrix = [[1, 2], [1, 3]], k = 2', output: '1' },
      { title: 'Test Case 4', input: 'matrix = [[1, 2], [3, 4]], k = 4', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int kthSmallestInMatrix(int[][] matrix, int k) {
        int n = matrix.length, lo = matrix[0][0], hi = matrix[n - 1][n - 1];
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int cnt = 0, j = n - 1;
            for (int i = 0; i < n; i++) {
                while (j >= 0 && matrix[i][j] > mid) j--;
                cnt += (j + 1);
            }
            if (cnt < k) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
}`,
    pythonSolution: `def kthSmallestInMatrix(matrix, k):
    n = len(matrix)
    lo, hi = matrix[0][0], matrix[-1][-1]
    while lo < hi:
        mid = (lo + hi) // 2
        cnt, j = 0, n - 1
        for i in range(n):
            while j >= 0 and matrix[i][j] > mid:
                j -= 1
            cnt += j + 1
        if cnt < k:
            lo = mid + 1
        else:
            hi = mid
    return lo`
  },
  {
    number: 22,
    title: 'Minimum Arrow Shots to Cover Audit Windows',
    fnName: 'minAuditCheckpoints',
    description: 'Given horizontal intervals <code>intervals</code> <code>[start, end]</code>, a checkpoint at coordinate <code>x</code> covers all intervals with <code>start &lt;= x &lt;= end</code>. Return the minimum number of checkpoints needed to cover all intervals.',
    constraints: ['1 <= intervals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'intervals = [[10, 16], [2, 8], [1, 6], [7, 12]]', output: '2' },
      { title: 'Test Case 2', input: 'intervals = [[1, 2], [3, 4], [5, 6]]', output: '3' },
      { title: 'Test Case 3', input: 'intervals = [[1, 5], [2, 6], [3, 7]]', output: '1' },
      { title: 'Test Case 4', input: 'intervals = [[1, 2], [2, 3]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minAuditCheckpoints(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int shots = 1, end = intervals[0][1];
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] > end) { shots++; end = intervals[i][1]; }
        }
        return shots;
    }
}`,
    pythonSolution: `def minAuditCheckpoints(intervals):
    ivs = sorted(intervals, key=lambda x: x[1])
    shots, end = 1, ivs[0][1]
    for s, e in ivs[1:]:
        if s > end:
            shots += 1
            end = e
    return shots`
  },
  {
    number: 23,
    title: 'Distinct Pairs With Target XOR',
    fnName: 'countXorPairs',
    description: 'Given an array of distinct security tokens <code>tokens</code> and an integer <code>target</code>, count the number of unordered pairs <code>(i, j)</code> with <code>i &lt; j</code> such that <code>tokens[i] ^ tokens[j] == target</code>.',
    constraints: ['1 <= tokens.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tokens = [5, 4, 10, 15, 7, 2], target = 5', output: '2' },
      { title: 'Test Case 2', input: 'tokens = [3, 6, 8, 10, 15, 50], target = 5', output: '2' },
      { title: 'Test Case 3', input: 'tokens = [1, 2, 3], target = 10', output: '0' },
      { title: 'Test Case 4', input: 'tokens = [1, 2], target = 3', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countXorPairs(int[] tokens, int target) {
        Set<Integer> seen = new HashSet<>();
        int count = 0;
        for (int t : tokens) {
            if (seen.contains(t ^ target)) count++;
            seen.add(t);
        }
        return count;
    }
}`,
    pythonSolution: `def countXorPairs(tokens, target):
    seen = set()
    count = 0
    for t in tokens:
        if (t ^ target) in seen:
            count += 1
        seen.add(t)
    return count`
  },
  {
    number: 24,
    title: 'Single Non-Duplicate in Sorted Audit Log',
    fnName: 'findSingleAuditEntry',
    description: 'Every ID in a sorted array <code>nums</code> appears twice except for one ID that appears once. Find and return that single ID in <code>O(log n)</code> time.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 2, 3, 3, 4, 4, 8, 8]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [3, 3, 7, 7, 10, 11, 11]', output: '10' },
      { title: 'Test Case 3', input: 'nums = [42]', output: '42' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 2]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int findSingleAuditEntry(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if ((mid & 1) == 1) mid--;
            if (nums[mid] == nums[mid + 1]) lo = mid + 2;
            else hi = mid;
        }
        return nums[lo];
    }
}`,
    pythonSolution: `def findSingleAuditEntry(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if mid % 2 == 1:
            mid -= 1
        if nums[mid] == nums[mid + 1]:
            lo = mid + 2
        else:
            hi = mid
    return nums[lo]`
  },
  {
    number: 25,
    title: 'Maximum Area of Rectangular Plot',
    fnName: 'maxPlotArea',
    description: 'Given an array <code>heights</code> representing vertical boundary posts along a 1D axis, find two posts that together with the x-axis hold the maximum rectangular area <code>min(heights[i], heights[j]) * (j - i)</code>.',
    constraints: ['2 <= heights.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]', output: '49' },
      { title: 'Test Case 2', input: 'heights = [1, 1]', output: '1' },
      { title: 'Test Case 3', input: 'heights = [4, 3, 2, 1, 4]', output: '16' },
      { title: 'Test Case 4', input: 'heights = [1, 2, 1]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int maxPlotArea(int[] heights) {
        int l = 0, r = heights.length - 1, best = 0;
        while (l < r) {
            best = Math.max(best, Math.min(heights[l], heights[r]) * (r - l));
            if (heights[l] < heights[r]) l++; else r--;
        }
        return best;
    }
}`,
    pythonSolution: `def maxPlotArea(heights):
    l, r, best = 0, len(heights) - 1, 0
    while l < r:
        best = max(best, min(heights[l], heights[r]) * (r - l))
        if heights[l] < heights[r]:
            l += 1
        else:
            r -= 1
    return best`
  },
  {
    number: 26,
    title: 'Minimum Operations to Equalize Ledger Balances',
    fnName: 'minOpsToEqualize',
    description: 'Given an array of account balances <code>nums</code>, in one operation you can increment or decrement any element by 1. Return the minimum total operations needed to make all elements equal.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 10, 2, 9]', output: '16' },
      { title: 'Test Case 3', input: 'nums = [5, 5, 5]', output: '0' },
      { title: 'Test Case 4', input: 'nums = [100]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minOpsToEqualize(int[] nums) {
        Arrays.sort(nums);
        int med = nums[nums.length / 2];
        long ops = 0;
        for (int x : nums) ops += Math.abs(x - med);
        return ops;
    }
}`,
    pythonSolution: `def minOpsToEqualize(nums):
    s = sorted(nums)
    med = s[len(s) // 2]
    return sum(abs(x - med) for x in s)`
  },
  {
    number: 27,
    title: 'Valid Stack Sequence of Audit Actions',
    fnName: 'isValidAuditSequence',
    description: 'Given two integer arrays <code>pushed</code> and <code>popped</code> with distinct values, return <code>true</code> if this could have been the result of a sequence of push and pop operations on an initially empty stack.',
    constraints: ['1 <= pushed.length == popped.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'pushed = [1, 2, 3, 4, 5], popped = [4, 5, 3, 2, 1]', output: 'true' },
      { title: 'Test Case 2', input: 'pushed = [1, 2, 3, 4, 5], popped = [4, 3, 5, 1, 2]', output: 'false' },
      { title: 'Test Case 3', input: 'pushed = [1], popped = [1]', output: 'true' },
      { title: 'Test Case 4', input: 'pushed = [1, 2], popped = [2, 1]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean isValidAuditSequence(int[] pushed, int[] popped) {
        Deque<Integer> st = new ArrayDeque<>();
        int j = 0;
        for (int x : pushed) {
            st.push(x);
            while (!st.isEmpty() && st.peek() == popped[j]) { st.pop(); j++; }
        }
        return st.isEmpty();
    }
}`,
    pythonSolution: `def isValidAuditSequence(pushed, popped):
    st, j = [], 0
    for x in pushed:
        st.append(x)
        while st and st[-1] == popped[j]:
            st.pop()
            j += 1
    return len(st) == 0`
  },
  {
    number: 28,
    title: 'Smallest Missing Positive Invoice Number',
    fnName: 'firstMissingInvoice',
    description: 'Given an unsorted integer array <code>nums</code>, find the smallest strictly positive integer (<code>&gt;= 1</code>) that does not appear in <code>nums</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 0]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [3, 4, -1, 1]', output: '2' },
      { title: 'Test Case 3', input: 'nums = [7, 8, 9, 11, 12]', output: '1' },
      { title: 'Test Case 4', input: 'nums = [1, 2, 3]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int firstMissingInvoice(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int t = nums[nums[i] - 1];
                nums[nums[i] - 1] = nums[i];
                nums[i] = t;
            }
        }
        for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
}`,
    pythonSolution: `def firstMissingInvoice(nums):
    a = nums[:]
    n = len(a)
    for i in range(n):
        while 1 <= a[i] <= n and a[a[i] - 1] != a[i]:
            idx = a[i] - 1
            a[i], a[idx] = a[idx], a[i]
    for i in range(n):
        if a[i] != i + 1:
            return i + 1
    return n + 1`
  },
  {
    number: 29,
    title: 'Longest Consecutive Audit Sequence',
    fnName: 'longestConsecutiveIds',
    description: 'Given an unsorted array of integer IDs <code>nums</code>, return the length of the longest sequence of consecutive integers (in any order in the array).',
    constraints: ['0 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [100, 4, 200, 1, 3, 2]', output: '4' },
      { title: 'Test Case 2', input: 'nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', output: '9' },
      { title: 'Test Case 3', input: 'nums = []', output: '0' },
      { title: 'Test Case 4', input: 'nums = [10, 30, 20]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestConsecutiveIds(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(x);
        int best = 0;
        for (int x : s) {
            if (!s.contains(x - 1)) {
                int y = x;
                while (s.contains(y)) y++;
                best = Math.max(best, y - x);
            }
        }
        return best;
    }
}`,
    pythonSolution: `def longestConsecutiveIds(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 not in s:
            y = x
            while y in s:
                y += 1
            best = max(best, y - x)
    return best`
  },
  {
    number: 30,
    title: 'Minimum Cost to Hire K Audit Analysts',
    fnName: 'minAnalystTeamCost',
    description: 'Given <code>costs</code> of <code>n</code> analysts and an integer <code>k</code>, you must select <code>k</code> analysts. However, to ensure diversity across regions, you can only pick from the first <code>candidates</code> or last <code>candidates</code> remaining analysts at each step (picking the cheaper one, breaking ties by smaller index). Return total cost.',
    constraints: ['1 <= k <= costs.length <= 10^5', '1 <= candidates <= costs.length'],
    testCases: [
      { title: 'Test Case 1', input: 'costs = [17, 12, 10, 2, 7, 2, 11, 20, 8], k = 3, candidates = 4', output: '11' },
      { title: 'Test Case 2', input: 'costs = [1, 2, 4, 1], k = 3, candidates = 3', output: '4' },
      { title: 'Test Case 3', input: 'costs = [10, 20, 30], k = 2, candidates = 1', output: '30' },
      { title: 'Test Case 4', input: 'costs = [5], k = 1, candidates = 1', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minAnalystTeamCost(int[] costs, int k, int candidates) {
        PriorityQueue<Integer> left = new PriorityQueue<>(), right = new PriorityQueue<>();
        int i = 0, j = costs.length - 1;
        long total = 0;
        while (k-- > 0) {
            while (left.size() < candidates && i <= j) left.add(costs[i++]);
            while (right.size() < candidates && i <= j) right.add(costs[j--]);
            int l = left.isEmpty() ? Integer.MAX_VALUE : left.peek();
            int r = right.isEmpty() ? Integer.MAX_VALUE : right.peek();
            if (l <= r) total += left.poll(); else total += right.poll();
        }
        return total;
    }
}`,
    pythonSolution: `def minAnalystTeamCost(costs, k, candidates):
    import heapq
    left, right = [], []
    i, j = 0, len(costs) - 1
    total = 0
    for _ in range(k):
        while len(left) < candidates and i <= j:
            heapq.heappush(left, costs[i]); i += 1
        while len(right) < candidates and i <= j:
            heapq.heappush(right, costs[j]); j -= 1
        lv = left[0] if left else float('inf')
        rv = right[0] if right else float('inf')
        if lv <= rv:
            total += heapq.heappop(left)
        else:
            total += heapq.heappop(right)
    return total`
  }
];
