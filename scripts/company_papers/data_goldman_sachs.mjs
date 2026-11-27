export const GOLDMAN_SACHS_QUESTIONS = [
  {
    number: 1,
    title: 'Tick-Stream Run-Length Compression',
    fnName: 'compressTickerStream',
    description: 'In a Goldman Sachs market-data feed, consecutive identical symbols in string <code>s</code> are compressed as <code>char + count</code> (even for count 1). Return the compressed string.',
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "aaabbcc"', output: 'a3b2c2' },
      { title: 'Test Case 2', input: 's = "abc"', output: 'a1b1c1' },
      { title: 'Test Case 3', input: 's = "zzzz"', output: 'z4' },
      { title: 'Test Case 4', input: 's = "x"', output: 'x1' }
    ],
    javaSolution: `public class Solution {
    public static String compressTickerStream(String s) {
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;
            sb.append(s.charAt(i)).append(j - i);
            i = j;
        }
        return sb.toString();
    }
}`,
    pythonSolution: `def compressTickerStream(s):
    out = []; i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]: j += 1
        out.append(f"{s[i]}{j - i}")
        i = j
    return "".join(out)`
  },
  {
    number: 2,
    title: 'Quant Portfolio Combinatorial Pairs',
    fnName: 'countBalancedAssetPairs',
    description: 'Given asset risk scores <code>risks</code>, count how many pairs <code>(i, j)</code> with <code>i &lt; j</code> have <code>risks[i] + risks[j] == 0</code> (hedged zero-beta pairs).',
    constraints: ['1 <= risks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'risks = [-3, 1, 3, -1, 3]', output: '3' },
      { title: 'Test Case 2', input: 'risks = [0, 0, 0]', output: '3' },
      { title: 'Test Case 3', input: 'risks = [1, 2, 3]', output: '0' },
      { title: 'Test Case 4', input: 'risks = [-5, 5]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countBalancedAssetPairs(int[] risks) {
        Map<Integer, Integer> cnt = new HashMap<>();
        long ans = 0;
        for (int r : risks) {
            ans += cnt.getOrDefault(-r, 0);
            cnt.put(r, cnt.getOrDefault(r, 0) + 1);
        }
        return ans;
    }
}`,
    pythonSolution: `def countBalancedAssetPairs(risks):
    cnt = {}; ans = 0
    for r in risks:
        ans += cnt.get(-r, 0)
        cnt[r] = cnt.get(r, 0) + 1
    return ans`
  },
  {
    number: 3,
    title: 'Order-Book Max Drawdown',
    fnName: 'maxPortfolioDrawdown',
    description: 'Given daily NAV values <code>nav</code>, return the maximum peak-to-trough drop <code>nav[i] - nav[j]</code> where <code>i &lt;= j</code>.',
    constraints: ['1 <= nav.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nav = [100, 120, 85, 110, 70]', output: '50' },
      { title: 'Test Case 2', input: 'nav = [10, 20, 30, 40]', output: '0' },
      { title: 'Test Case 3', input: 'nav = [50, 10]', output: '40' },
      { title: 'Test Case 4', input: 'nav = [25]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxPortfolioDrawdown(int[] nav) {
        int peak = nav[0], best = 0;
        for (int x : nav) {
            peak = Math.max(peak, x);
            best = Math.max(best, peak - x);
        }
        return best;
    }
}`,
    pythonSolution: `def maxPortfolioDrawdown(nav):
    peak = nav[0]; best = 0
    for x in nav:
        peak = max(peak, x)
        best = max(best, peak - x)
    return best`
  },
  {
    number: 4,
    title: 'Matrix Risk-Grid Max Yield Path',
    fnName: 'maxYieldGridPath',
    description: 'In an <code>R x C</code> payoff matrix <code>grid</code>, a quant starts at <code>(0, 0)</code> and moves only right or down to <code>(R-1, C-1)</code>. Return the maximum total payoff.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]', output: '12' },
      { title: 'Test Case 2', input: 'grid = [[5]]', output: '5' },
      { title: 'Test Case 3', input: 'grid = [[1, 2], [3, 4]]', output: '8' },
      { title: 'Test Case 4', input: 'grid = [[0, 10, 0], [5, 0, 1]]', output: '11' }
    ],
    javaSolution: `public class Solution {
    public static long maxYieldGridPath(int[][] grid) {
        int R = grid.length, C = grid[0].length;
        long[] dp = new long[C];
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                long up = r > 0 ? dp[c] : Long.MIN_VALUE / 2;
                long left = c > 0 ? dp[c - 1] : Long.MIN_VALUE / 2;
                if (r == 0 && c == 0) dp[c] = grid[0][0];
                else dp[c] = grid[r][c] + Math.max(up, left);
            }
        }
        return dp[C - 1];
    }
}`,
    pythonSolution: `def maxYieldGridPath(grid):
    R, C = len(grid), len(grid[0])
    dp = [0] * C
    for r in range(R):
        for c in range(C):
            if r == 0 and c == 0: dp[0] = grid[0][0]
            elif r == 0: dp[c] = dp[c - 1] + grid[r][c]
            elif c == 0: dp[c] = dp[c] + grid[r][c]
            else: dp[c] = max(dp[c], dp[c - 1]) + grid[r][c]
    return dp[-1]`
  },
  {
    number: 5,
    title: 'Combinatorial Ways to Form Committee',
    fnName: 'nCrMod',
    description: 'Compute the number of ways to choose <code>r</code> analysts from <code>n</code> candidates, <code>C(n, r) mod (10^9 + 7)</code>.',
    constraints: ['0 <= r <= n <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, r = 2', output: '10' },
      { title: 'Test Case 2', input: 'n = 10, r = 0', output: '1' },
      { title: 'Test Case 3', input: 'n = 6, r = 6', output: '1' },
      { title: 'Test Case 4', input: 'n = 20, r = 10', output: '184756' }
    ],
    javaSolution: `public class Solution {
    public static long nCrMod(int n, int r) {
        long MOD = 1_000_000_007L;
        long[][] C = new long[n + 1][r + 1];
        for (int i = 0; i <= n; i++) {
            C[i][0] = 1;
            for (int j = 1; j <= Math.min(i, r); j++) {
                C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;
            }
        }
        return C[n][r];
    }
}`,
    pythonSolution: `import math
def nCrMod(n, r):
    return math.comb(n, r) % (10**9 + 7)`
  },
  {
    number: 6,
    title: 'Expected Value Dice Payoff Scaled',
    fnName: 'expectedPayoffTimesSix',
    description: 'A fair 6-sided die is rolled once; rolling face <code>f</code> (1..6) pays <code>payoffs[f-1]</code>. Return <code>6 * E[payoff]</code> (an exact integer).',
    constraints: ['payoffs.length == 6'],
    testCases: [
      { title: 'Test Case 1', input: 'payoffs = [1, 2, 3, 4, 5, 6]', output: '21' },
      { title: 'Test Case 2', input: 'payoffs = [10, 10, 10, 10, 10, 10]', output: '60' },
      { title: 'Test Case 3', input: 'payoffs = [0, 0, 0, 0, 0, 100]', output: '100' },
      { title: 'Test Case 4', input: 'payoffs = [0, 0, 0, 0, 0, 0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long expectedPayoffTimesSix(int[] payoffs) {
        long s = 0;
        for (int p : payoffs) s += p;
        return s;
    }
}`,
    pythonSolution: `def expectedPayoffTimesSix(payoffs):
    return sum(payoffs)`
  },
  {
    number: 7,
    title: 'Limit Order-Book Buy/Sell Match',
    fnName: 'maxMatchedShares',
    description: 'Given sorted buy bid prices <code>bids</code> and sorted sell ask prices <code>asks</code> (1 share per order), a buy order matches a sell order if <code>bid >= ask</code>. Return the maximum number of matched share pairs.',
    constraints: ['0 <= bids.length, asks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bids = [98, 100, 105], asks = [99, 101, 110]', output: '2' },
      { title: 'Test Case 2', input: 'bids = [50, 60], asks = [70, 80]', output: '0' },
      { title: 'Test Case 3', input: 'bids = [100, 100], asks = [100, 100]', output: '2' },
      { title: 'Test Case 4', input: 'bids = [], asks = [10]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxMatchedShares(int[] bids, int[] asks) {
        Arrays.sort(bids); Arrays.sort(asks);
        int i = 0, j = 0, matches = 0;
        while (i < bids.length && j < asks.length) {
            if (bids[i] >= asks[j]) { matches++; i++; j++; }
            else i++;
        }
        return matches;
    }
}`,
    pythonSolution: `def maxMatchedShares(bids, asks):
    bids.sort(); asks.sort()
    i = j = m = 0
    while i < len(bids) and j < len(asks):
        if bids[i] >= asks[j]: m += 1; i += 1; j += 1
        else: i += 1
    return m`
  },
  {
    number: 8,
    title: 'Option Expiry Staircase Ways',
    fnName: 'countTradingStepPaths',
    description: 'A trader can adjust a position by <code>+1</code> or <code>+2</code> lots per step. How many distinct step sequences sum to exact target <code>n</code> modulo <code>10^9 + 7</code>?',
    constraints: ['1 <= n <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4', output: '5' },
      { title: 'Test Case 2', input: 'n = 1', output: '1' },
      { title: 'Test Case 3', input: 'n = 2', output: '2' },
      { title: 'Test Case 4', input: 'n = 6', output: '13' }
    ],
    javaSolution: `public class Solution {
    public static long countTradingStepPaths(int n) {
        long MOD = 1_000_000_007L;
        long a = 1, b = 1;
        for (int i = 2; i <= n; i++) { long c = (a + b) % MOD; a = b; b = c; }
        return b;
    }
}`,
    pythonSolution: `def countTradingStepPaths(n):
    MOD = 10**9 + 7
    a, b = 1, 1
    for _ in range(2, n + 1): a, b = b, (a + b) % MOD
    return b`
  },
  {
    number: 9,
    title: 'VWAP Above-Average Tick Count',
    fnName: 'countAboveVwapTicks',
    description: 'Given trade prices <code>prices</code> and volumes <code>vols</code>, a trade is above VWAP if <code>prices[i] * sum(vols) > sum(prices[j] * vols[j])</code>. Count such trades.',
    constraints: ['1 <= prices.length == vols.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [10, 20, 30], vols = [1, 2, 1]', output: '1' },
      { title: 'Test Case 2', input: 'prices = [50, 50], vols = [5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'prices = [100], vols = [10]', output: '0' },
      { title: 'Test Case 4', input: 'prices = [10, 30], vols = [3, 1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countAboveVwapTicks(int[] prices, int[] vols) {
        long num = 0, den = 0;
        for (int i = 0; i < prices.length; i++) {
            num += (long) prices[i] * vols[i];
            den += vols[i];
        }
        int cnt = 0;
        for (int p : prices) if ((long) p * den > num) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countAboveVwapTicks(prices, vols):
    num = sum(p * v for p, v in zip(prices, vols))
    den = sum(vols)
    return sum(1 for p in prices if p * den > num)`
  },
  {
    number: 10,
    title: 'Modular Exponentiation Factor',
    fnName: 'modPow',
    description: 'Compute <code>(base ^ exp) mod MOD</code> where <code>MOD = 10^9 + 7</code>.',
    constraints: ['0 <= base <= 10^9', '0 <= exp <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'base = 2, exp = 10', output: '1024' },
      { title: 'Test Case 2', input: 'base = 3, exp = 0', output: '1' },
      { title: 'Test Case 3', input: 'base = 10, exp = 9', output: '1000000000' },
      { title: 'Test Case 4', input: 'base = 2, exp = 30', output: '73741817' }
    ],
    javaSolution: `public class Solution {
    public static long modPow(long base, long exp) {
        long MOD = 1_000_000_007L, res = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1) == 1) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return res;
    }
}`,
    pythonSolution: `def modPow(base, exp):
    return pow(base, exp, 10**9 + 7)`
  },
  {
    number: 11,
    title: 'Currency Arbitrage Cycle Sign',
    fnName: 'hasPositiveLogCycle',
    description: 'Given <code>n</code> currencies and directed exchange edges <code>edges</code> <code>[u, v, logRate]</code>, return <code>true</code> if there exists a directed cycle with strictly positive total <code>logRate</code> (arbitrage opportunity), else <code>false</code>.',
    constraints: ['1 <= n <= 100', '0 <= edges.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, edges = [[0, 1, 2], [1, 2, 2], [2, 0, -1]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1, 1], [1, 2, 1], [2, 0, -5]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 2, edges = [[0, 1, 5]]', output: 'false' },
      { title: 'Test Case 4', input: 'n = 1, edges = [[0, 0, 1]]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean hasPositiveLogCycle(int n, int[][] edges) {
        long[] dist = new long[n];
        for (int iter = 0; iter < n; iter++) {
            boolean updated = false;
            for (int[] e : edges) {
                if (dist[e[0]] + e[2] > dist[e[1]]) {
                    dist[e[1]] = dist[e[0]] + e[2];
                    updated = true;
                    if (iter == n - 1) return true;
                }
            }
            if (!updated) break;
        }
        return false;
    }
}`,
    pythonSolution: `def hasPositiveLogCycle(n, edges):
    dist = [0] * n
    for it in range(n):
        upd = False
        for u, v, w in edges:
            if dist[u] + w > dist[v]:
                dist[v] = dist[u] + w; upd = True
                if it == n - 1: return True
        if not upd: break
    return False`
  },
  {
    number: 12,
    title: 'Prime Factor Risk Decomposition',
    fnName: 'countDistinctPrimeFactors',
    description: 'Given a positive integer <code>n</code>, return the number of distinct prime factors of <code>n</code>.',
    constraints: ['1 <= n <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 60', output: '3' },
      { title: 'Test Case 2', input: 'n = 17', output: '1' },
      { title: 'Test Case 3', input: 'n = 1', output: '0' },
      { title: 'Test Case 4', input: 'n = 64', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countDistinctPrimeFactors(int n) {
        int cnt = 0;
        for (int p = 2; (long) p * p <= n; p++) {
            if (n % p == 0) {
                cnt++;
                while (n % p == 0) n /= p;
            }
        }
        if (n > 1) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countDistinctPrimeFactors(n):
    cnt = 0; p = 2
    while p * p <= n:
        if n % p == 0:
            cnt += 1
            while n % p == 0: n //= p
        p += 1
    if n > 1: cnt += 1
    return cnt`
  },
  {
    number: 13,
    title: 'Trading Desk Pivot Equilibrium',
    fnName: 'countEquilibriumDays',
    description: 'Given daily net P&amp;L <code>pnl</code>, count how many indices <code>i</code> have strictly equal sum of elements to the left of <code>i</code> and to the right of <code>i</code>.',
    constraints: ['1 <= pnl.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pnl = [1, 7, 3, 6, 5, 6]', output: '1' },
      { title: 'Test Case 2', input: 'pnl = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'pnl = [0, 0, 0]', output: '3' },
      { title: 'Test Case 4', input: 'pnl = [5]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countEquilibriumDays(int[] pnl) {
        long tot = 0; for (int x : pnl) tot += x;
        long left = 0; int cnt = 0;
        for (int x : pnl) {
            if (left == tot - left - x) cnt++;
            left += x;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countEquilibriumDays(pnl):
    tot = sum(pnl); left = cnt = 0
    for x in pnl:
        if left == tot - left - x: cnt += 1
        left += x
    return cnt`
  },
  {
    number: 14,
    title: 'Subarray Max Volatility Window',
    fnName: 'maxWindowSpread',
    description: 'Given price series <code>prices</code> and window size <code>k</code>, return the maximum <code>max(window) - min(window)</code> over all contiguous windows of size <code>k</code>.',
    constraints: ['1 <= k <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [10, 14, 12, 20, 11], k = 3', output: '9' },
      { title: 'Test Case 2', input: 'prices = [5, 5, 5], k = 2', output: '0' },
      { title: 'Test Case 3', input: 'prices = [1, 100], k = 1', output: '0' },
      { title: 'Test Case 4', input: 'prices = [3, 8, 2, 9], k = 4', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxWindowSpread(int[] prices, int k) {
        Deque<Integer> mx = new ArrayDeque<>(), mn = new ArrayDeque<>();
        int best = 0;
        for (int i = 0; i < prices.length; i++) {
            while (!mx.isEmpty() && prices[mx.peekLast()] <= prices[i]) mx.pollLast();
            while (!mn.isEmpty() && prices[mn.peekLast()] >= prices[i]) mn.pollLast();
            mx.addLast(i); mn.addLast(i);
            if (mx.peekFirst() <= i - k) mx.pollFirst();
            if (mn.peekFirst() <= i - k) mn.pollFirst();
            if (i >= k - 1) best = Math.max(best, prices[mx.peekFirst()] - prices[mn.peekFirst()]);
        }
        return best;
    }
}`,
    pythonSolution: `from collections import deque
def maxWindowSpread(prices, k):
    mx, mn = deque(), deque()
    best = 0
    for i, p in enumerate(prices):
        while mx and prices[mx[-1]] <= p: mx.pop()
        while mn and prices[mn[-1]] >= p: mn.pop()
        mx.append(i); mn.append(i)
        if mx[0] <= i - k: mx.popleft()
        if mn[0] <= i - k: mn.popleft()
        if i >= k - 1: best = max(best, prices[mx[0]] - prices[mn[0]])
    return best`
  },
  {
    number: 15,
    title: 'Derangement Permutations Mod',
    fnName: 'countDerangements',
    description: 'In a secret portfolio swap among <code>n</code> traders, no trader may receive their own portfolio. Return the number of valid permutations modulo <code>10^9 + 7</code>.',
    constraints: ['1 <= n <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3', output: '2' },
      { title: 'Test Case 2', input: 'n = 4', output: '9' },
      { title: 'Test Case 3', input: 'n = 1', output: '0' },
      { title: 'Test Case 4', input: 'n = 2', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countDerangements(int n) {
        if (n == 1) return 0;
        if (n == 2) return 1;
        long MOD = 1_000_000_007L, d1 = 0, d2 = 1;
        for (int i = 3; i <= n; i++) {
            long cur = ((i - 1) * ((d1 + d2) % MOD)) % MOD;
            d1 = d2; d2 = cur;
        }
        return d2;
    }
}`,
    pythonSolution: `def countDerangements(n):
    if n == 1: return 0
    if n == 2: return 1
    MOD = 10**9 + 7; d1, d2 = 0, 1
    for i in range(3, n + 1):
        d1, d2 = d2, ((i - 1) * (d1 + d2)) % MOD
    return d2`
  },
  {
    number: 16,
    title: 'Order-Book Median Price',
    fnName: 'twiceMedianPrice',
    description: 'Given trade prices <code>prices</code>, return <code>2 * median</code> as an exact integer (for even length <code>n</code>, median is average of the two middle elements, so <code>2 * median</code> is their sum).',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [10, 30, 20]', output: '40' },
      { title: 'Test Case 2', input: 'prices = [10, 20, 30, 40]', output: '50' },
      { title: 'Test Case 3', input: 'prices = [7]', output: '14' },
      { title: 'Test Case 4', input: 'prices = [5, 15]', output: '20' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long twiceMedianPrice(int[] prices) {
        Arrays.sort(prices);
        int n = prices.length;
        if (n % 2 == 1) return 2L * prices[n / 2];
        return (long) prices[n / 2 - 1] + prices[n / 2];
    }
}`,
    pythonSolution: `def twiceMedianPrice(prices):
    p = sorted(prices); n = len(p)
    return 2 * p[n // 2] if n % 2 == 1 else p[n // 2 - 1] + p[n // 2]`
  },
  {
    number: 17,
    title: 'Grid Risk-Score Diagonal Balance',
    fnName: 'diagonalDiffAbs',
    description: 'Given a square <code>n x n</code> correlation matrix <code>mat</code>, return the absolute difference between the sum of the main diagonal and the anti-diagonal.',
    constraints: ['1 <= n <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[11, 2, 4], [4, 5, 6], [10, 8, -12]]', output: '15' },
      { title: 'Test Case 2', input: 'mat = [[5]]', output: '0' },
      { title: 'Test Case 3', input: 'mat = [[1, 2], [3, 4]]', output: '0' },
      { title: 'Test Case 4', input: 'mat = [[10, 0], [0, 0]]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long diagonalDiffAbs(int[][] mat) {
        int n = mat.length;
        long d1 = 0, d2 = 0;
        for (int i = 0; i < n; i++) { d1 += mat[i][i]; d2 += mat[i][n - 1 - i]; }
        return Math.abs(d1 - d2);
    }
}`,
    pythonSolution: `def diagonalDiffAbs(mat):
    n = len(mat)
    return abs(sum(mat[i][i] - mat[i][n - 1 - i] for i in range(n)))`
  },
  {
    number: 18,
    title: 'Bond Coupon Schedule GCD',
    fnName: 'commonCouponInterval',
    description: 'Bonds pay coupons every <code>periods[i]</code> days. Return the greatest common divisor (GCD) of all periods.',
    constraints: ['1 <= periods.length <= 10^5', '1 <= periods[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'periods = [90, 180, 360]', output: '90' },
      { title: 'Test Case 2', input: 'periods = [14, 21, 35]', output: '7' },
      { title: 'Test Case 3', input: 'periods = [13, 17]', output: '1' },
      { title: 'Test Case 4', input: 'periods = [42]', output: '42' }
    ],
    javaSolution: `public class Solution {
    public static int commonCouponInterval(int[] periods) {
        int g = periods[0];
        for (int p : periods) g = gcd(g, p);
        return g;
    }
    private static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
}`,
    pythonSolution: `import math
def commonCouponInterval(periods):
    g = 0
    for p in periods: g = math.gcd(g, p)
    return g`
  },
  {
    number: 19,
    title: 'High-Frequency Order Burst Peak',
    fnName: 'maxOrdersPerSecond',
    description: 'Given sorted order timestamps in milliseconds <code>ts</code>, return the maximum number of orders within any 1000ms closed interval <code>[t, t + 1000]</code>.',
    constraints: ['1 <= ts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ts = [100, 500, 1000, 1100, 2500]', output: '4' },
      { title: 'Test Case 2', input: 'ts = [0, 1001]', output: '1' },
      { title: 'Test Case 3', input: 'ts = [0, 1000]', output: '2' },
      { title: 'Test Case 4', input: 'ts = [42]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxOrdersPerSecond(int[] ts) {
        int l = 0, best = 0;
        for (int r = 0; r < ts.length; r++) {
            while (ts[r] - ts[l] > 1000) l++;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def maxOrdersPerSecond(ts):
    l = best = 0
    for r, t in enumerate(ts):
        while t - ts[l] > 1000: l += 1
        best = max(best, r - l + 1)
    return best`
  },
  {
    number: 20,
    title: 'Sharpe Ratio Positive Days',
    fnName: 'countExcessReturnDays',
    description: 'Given daily portfolio returns <code>ret</code> and risk-free benchmark <code>rf</code> (in basis points), count how many days beat the benchmark (<code>ret[i] > rf</code>).',
    constraints: ['1 <= ret.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ret = [12, 5, 20, -3, 10], rf = 10', output: '2' },
      { title: 'Test Case 2', input: 'ret = [1, 2, 3], rf = 5', output: '0' },
      { title: 'Test Case 3', input: 'ret = [100], rf = 99', output: '1' },
      { title: 'Test Case 4', input: 'ret = [0, 0], rf = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countExcessReturnDays(int[] ret, int rf) {
        int cnt = 0;
        for (int r : ret) if (r > rf) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countExcessReturnDays(ret, rf):
    return sum(1 for r in ret if r > rf)`
  },
  {
    number: 21,
    title: 'Minimum Trades to Zero Inventory',
    fnName: 'minTradesToClear',
    description: 'A market maker holds inventory <code>inv</code> (positive = long, negative = short). Each trade can change inventory by any amount up to <code>maxLot</code>. Return minimum trades needed to reach 0.',
    constraints: ['1 <= maxLot <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'inv = 25, maxLot = 10', output: '3' },
      { title: 'Test Case 2', input: 'inv = -20, maxLot = 10', output: '2' },
      { title: 'Test Case 3', input: 'inv = 0, maxLot = 5', output: '0' },
      { title: 'Test Case 4', input: 'inv = 7, maxLot = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long minTradesToClear(long inv, long maxLot) {
        long a = Math.abs(inv);
        return (a + maxLot - 1) / maxLot;
    }
}`,
    pythonSolution: `def minTradesToClear(inv, maxLot):
    a = abs(inv)
    return (a + maxLot - 1) // maxLot`
  },
  {
    number: 22,
    title: 'Pascal Triangle Portfolio Weights',
    fnName: 'pascalRowSum',
    description: 'Return the sum of elements in the <code>k</code>-th 0-indexed row of Pascal\'s Triangle modulo <code>10^9 + 7</code>.',
    constraints: ['0 <= k <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'k = 0', output: '1' },
      { title: 'Test Case 2', input: 'k = 4', output: '16' },
      { title: 'Test Case 3', input: 'k = 10', output: '1024' },
      { title: 'Test Case 4', input: 'k = 30', output: '73741817' }
    ],
    javaSolution: `public class Solution {
    public static long pascalRowSum(long k) {
        long MOD = 1_000_000_007L, res = 1, base = 2;
        while (k > 0) {
            if ((k & 1) == 1) res = (res * base) % MOD;
            base = (base * base) % MOD;
            k >>= 1;
        }
        return res;
    }
}`,
    pythonSolution: `def pascalRowSum(k):
    return pow(2, k, 10**9 + 7)`
  },
  {
    number: 23,
    title: 'Desk Capital Allocation Max Return',
    fnName: 'maxCapitalReturn',
    description: 'Given desk projects with capital required <code>cap[i]</code> and profit <code>prof[i]</code>, and total available capital <code>budget</code>, pick any subset of projects (at most once each) to maximize total profit.',
    constraints: ['1 <= cap.length <= 100', '0 <= budget <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'cap = [10, 20, 30], prof = [60, 100, 120], budget = 50', output: '220' },
      { title: 'Test Case 2', input: 'cap = [50, 60], prof = [10, 20], budget = 40', output: '0' },
      { title: 'Test Case 3', input: 'cap = [5, 10], prof = [15, 25], budget = 15', output: '40' },
      { title: 'Test Case 4', input: 'cap = [1], prof = [99], budget = 1', output: '99' }
    ],
    javaSolution: `public class Solution {
    public static int maxCapitalReturn(int[] cap, int[] prof, int budget) {
        int[] dp = new int[budget + 1];
        for (int i = 0; i < cap.length; i++) {
            for (int b = budget; b >= cap[i]; b--) dp[b] = Math.max(dp[b], dp[b - cap[i]] + prof[i]);
        }
        return dp[budget];
    }
}`,
    pythonSolution: `def maxCapitalReturn(cap, prof, budget):
    dp = [0] * (budget + 1)
    for c, p in zip(cap, prof):
        for b in range(budget, c - 1, -1):
            if dp[b - c] + p > dp[b]: dp[b] = dp[b - c] + p
    return dp[budget]`
  },
  {
    number: 24,
    title: 'Order-Book Price Level Count',
    fnName: 'countUniquePriceLevels',
    description: 'Given active limit order prices <code>prices</code>, return how many distinct price levels exist.',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [100, 101, 100, 102, 101]', output: '3' },
      { title: 'Test Case 2', input: 'prices = [50, 50, 50]', output: '1' },
      { title: 'Test Case 3', input: 'prices = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 4', input: 'prices = [99]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUniquePriceLevels(int[] prices) {
        Set<Integer> s = new HashSet<>();
        for (int p : prices) s.add(p);
        return s.size();
    }
}`,
    pythonSolution: `def countUniquePriceLevels(prices):
    return len(set(prices))`
  },
  {
    number: 25,
    title: 'Catalan Balanced Trade Sequences',
    fnName: 'countBalancedBuySell',
    description: 'Return the number of valid sequences of <code>n</code> buys and <code>n</code> sells such that cumulative buys are always <code>&gt;=</code> cumulative sells (the <code>n</code>-th Catalan number) modulo <code>10^9 + 7</code>.',
    constraints: ['0 <= n <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3', output: '5' },
      { title: 'Test Case 2', input: 'n = 4', output: '14' },
      { title: 'Test Case 3', input: 'n = 0', output: '1' },
      { title: 'Test Case 4', input: 'n = 1', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countBalancedBuySell(int n) {
        long MOD = 1_000_000_007L;
        long[] dp = new long[n + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) dp[i] = (dp[i] + dp[j] * dp[i - 1 - j]) % MOD;
        }
        return dp[n];
    }
}`,
    pythonSolution: `def countBalancedBuySell(n):
    MOD = 10**9 + 7
    dp = [0] * (n + 1); dp[0] = 1
    for i in range(1, n + 1):
        for j in range(i): dp[i] = (dp[i] + dp[j] * dp[i - 1 - j]) % MOD
    return dp[n]`
  },
  {
    number: 26,
    title: 'Spread Tightness Filter',
    fnName: 'countTightSpreads',
    description: 'Given bid prices <code>bids</code> and ask prices <code>asks</code>, count how many quotes have spread <code>asks[i] - bids[i] <= maxSpread</code>.',
    constraints: ['1 <= bids.length == asks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bids = [100, 200, 300], asks = [102, 210, 301], maxSpread = 3', output: '2' },
      { title: 'Test Case 2', input: 'bids = [10, 20], asks = [20, 30], maxSpread = 5', output: '0' },
      { title: 'Test Case 3', input: 'bids = [50], asks = [50], maxSpread = 0', output: '1' },
      { title: 'Test Case 4', input: 'bids = [1, 2], asks = [3, 4], maxSpread = 2', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countTightSpreads(int[] bids, int[] asks, int maxSpread) {
        int cnt = 0;
        for (int i = 0; i < bids.length; i++) if (asks[i] - bids[i] <= maxSpread) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countTightSpreads(bids, asks, maxSpread):
    return sum(1 for b, a in zip(bids, asks) if a - b <= maxSpread)`
  },
  {
    number: 27,
    title: 'Margin Call Threshold Breaches',
    fnName: 'countMarginCalls',
    description: 'An account starts with equity <code>equity</code> and experiences daily P&amp;L deltas <code>deltas</code>. Count how many days the end-of-day equity is strictly below <code>minMaint</code>.',
    constraints: ['1 <= deltas.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'equity = 1000, deltas = [-300, -300, 500, -400], minMaint = 500', output: '1' },
      { title: 'Test Case 2', input: 'equity = 500, deltas = [0, 0], minMaint = 500', output: '0' },
      { title: 'Test Case 3', input: 'equity = 100, deltas = [-50, -50], minMaint = 60', output: '2' },
      { title: 'Test Case 4', input: 'equity = 200, deltas = [100], minMaint = 150', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countMarginCalls(long equity, int[] deltas, long minMaint) {
        int calls = 0;
        for (int d : deltas) {
            equity += d;
            if (equity < minMaint) calls++;
        }
        return calls;
    }
}`,
    pythonSolution: `def countMarginCalls(equity, deltas, minMaint):
    calls = 0
    for d in deltas:
        equity += d
        if equity < minMaint: calls += 1
    return calls`
  },
  {
    number: 28,
    title: 'Fibonacci Lattice Price Levels',
    fnName: 'countLevelsInRange',
    description: 'Given sorted price levels <code>levels</code> and a target band <code>[low, high]</code>, return how many levels lie inside <code>[low, high]</code> inclusive.',
    constraints: ['1 <= levels.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'levels = [10, 20, 30, 40, 50], low = 15, high = 40', output: '3' },
      { title: 'Test Case 2', input: 'levels = [1, 2, 3], low = 10, high = 20', output: '0' },
      { title: 'Test Case 3', input: 'levels = [5, 10, 15], low = 5, high = 15', output: '3' },
      { title: 'Test Case 4', input: 'levels = [25], low = 25, high = 25', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countLevelsInRange(int[] levels, int low, int high) {
        int l = lowerBound(levels, low), r = lowerBound(levels, high + 1);
        return Math.max(0, r - l);
    }
    private static int lowerBound(int[] a, int target) {
        int l = 0, r = a.length;
        while (l < r) { int m = (l + r) / 2; if (a[m] < target) l = m + 1; else r = m; }
        return l;
    }
}`,
    pythonSolution: `import bisect
def countLevelsInRange(levels, low, high):
    return bisect.bisect_right(levels, high) - bisect.bisect_left(levels, low)`
  },
  {
    number: 29,
    title: 'Quant Desk Best Two-Stock Trade',
    fnName: 'maxSingleBuySellProfit',
    description: 'Given daily stock prices <code>prices</code>, return the maximum profit from at most one buy followed by one sell (<code>0</code> if no profit possible).',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [7, 1, 5, 3, 6, 4]', output: '5' },
      { title: 'Test Case 2', input: 'prices = [7, 6, 4, 3, 1]', output: '0' },
      { title: 'Test Case 3', input: 'prices = [1, 10]', output: '9' },
      { title: 'Test Case 4', input: 'prices = [5]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxSingleBuySellProfit(int[] prices) {
        int mn = prices[0], best = 0;
        for (int p : prices) { mn = Math.min(mn, p); best = Math.max(best, p - mn); }
        return best;
    }
}`,
    pythonSolution: `def maxSingleBuySellProfit(prices):
    mn = prices[0]; best = 0
    for p in prices: mn = min(mn, p); best = max(best, p - mn)
    return best`
  },
  {
    number: 30,
    title: 'Weighted Average Coupon Yield',
    fnName: 'weightedYieldFloor',
    description: 'Given bond notionals <code>notionals</code> and yields in bps <code>yields</code>, return the floor of the notional-weighted average yield.',
    constraints: ['1 <= notionals.length == yields.length <= 10^5', 'sum(notionals) > 0'],
    testCases: [
      { title: 'Test Case 1', input: 'notionals = [100, 300], yields = [400, 600]', output: '550' },
      { title: 'Test Case 2', input: 'notionals = [10, 10], yields = [100, 101]', output: '100' },
      { title: 'Test Case 3', input: 'notionals = [500], yields = [325]', output: '325' },
      { title: 'Test Case 4', input: 'notionals = [1, 2, 3], yields = [10, 20, 30]', output: '23' }
    ],
    javaSolution: `public class Solution {
    public static long weightedYieldFloor(int[] notionals, int[] yields) {
        long num = 0, den = 0;
        for (int i = 0; i < notionals.length; i++) {
            num += (long) notionals[i] * yields[i];
            den += notionals[i];
        }
        return num / den;
    }
}`,
    pythonSolution: `def weightedYieldFloor(notionals, yields):
    return sum(n * y for n, y in zip(notionals, yields)) // sum(notionals)`
  },
  {
    number: 31,
    title: 'Settlement Batch Netting Sum',
    fnName: 'netCounterpartyExposure',
    description: 'Given trades <code>trades</code> <code>[partyId, signedAmount]</code>, return the maximum absolute net exposure across any single counterparty.',
    constraints: ['1 <= trades.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'trades = [[1, 100], [2, -500], [1, -40], [2, 100]]', output: '400' },
      { title: 'Test Case 2', input: 'trades = [[1, 50], [1, -50]]', output: '0' },
      { title: 'Test Case 3', input: 'trades = [[3, 250]]', output: '250' },
      { title: 'Test Case 4', input: 'trades = [[1, -10], [2, 20], [3, -30]]', output: '30' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long netCounterpartyExposure(int[][] trades) {
        Map<Integer, Long> net = new HashMap<>();
        for (int[] t : trades) net.put(t[0], net.getOrDefault(t[0], 0L) + t[1]);
        long best = 0;
        for (long v : net.values()) best = Math.max(best, Math.abs(v));
        return best;
    }
}`,
    pythonSolution: `from collections import defaultdict
def netCounterpartyExposure(trades):
    net = defaultdict(int)
    for p, a in trades: net[p] += a
    return max(abs(v) for v in net.values())`
  },
  {
    number: 32,
    title: 'Option Grid Binomial Probability Sum',
    fnName: 'countBullishOutcomes',
    description: 'An asset moves up (<code>+1</code>) or down (<code>-1</code>) over <code>n</code> steps. How many of the <code>2^n</code> step sequences end with net move <code>&gt;= k</code> (exact integer, <code>n &lt;= 20</code>)?',
    constraints: ['1 <= n <= 20', '-n <= k <= n'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, k = 1', output: '4' },
      { title: 'Test Case 2', input: 'n = 2, k = 2', output: '1' },
      { title: 'Test Case 3', input: 'n = 4, k = 0', output: '11' },
      { title: 'Test Case 4', input: 'n = 1, k = -1', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long countBullishOutcomes(int n, int k) {
        long[][] C = new long[n + 1][n + 1];
        for (int i = 0; i <= n; i++) {
            C[i][0] = 1;
            for (int j = 1; j <= i; j++) C[i][j] = C[i - 1][j - 1] + C[i - 1][j];
        }
        long ans = 0;
        for (int u = 0; u <= n; u++) {
            if (2 * u - n >= k) ans += C[n][u];
        }
        return ans;
    }
}`,
    pythonSolution: `import math
def countBullishOutcomes(n, k):
    return sum(math.comb(n, u) for u in range(n + 1) if 2 * u - n >= k)`
  },
  {
    number: 33,
    title: 'Ticker Symbol Anagram Groups',
    fnName: 'countDistinctAnagramGroups',
    description: 'Given uppercase ticker codes <code>tickers</code>, group codes that are anagrams of each other and return the number of distinct anagram groups.',
    constraints: ['1 <= tickers.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'tickers = ["GS", "SG", "AAPL", "LPAA", "MSFT"]', output: '3' },
      { title: 'Test Case 2', input: 'tickers = ["A", "B", "C"]', output: '3' },
      { title: 'Test Case 3', input: 'tickers = ["XYZ", "ZYX", "YZX"]', output: '1' },
      { title: 'Test Case 4', input: 'tickers = ["Q"]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDistinctAnagramGroups(String[] tickers) {
        Set<String> groups = new HashSet<>();
        for (String t : tickers) {
            char[] arr = t.toCharArray();
            Arrays.sort(arr);
            groups.add(new String(arr));
        }
        return groups.size();
    }
}`,
    pythonSolution: `def countDistinctAnagramGroups(tickers):
    return len({"".join(sorted(t)) for t in tickers})`
  },
  {
    number: 34,
    title: 'Quant Signal Zero-Crossing Count',
    fnName: 'countSignFlips',
    description: 'Given a non-zero momentum signal series <code>signals</code>, count how many times consecutive elements have opposite signs.',
    constraints: ['1 <= signals.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'signals = [1, -2, -3, 4, -5]', output: '3' },
      { title: 'Test Case 2', input: 'signals = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'signals = [-1, 1, -1, 1]', output: '3' },
      { title: 'Test Case 4', input: 'signals = [-10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSignFlips(int[] signals) {
        int flips = 0;
        for (int i = 1; i < signals.length; i++) {
            if ((signals[i] > 0) != (signals[i - 1] > 0)) flips++;
        }
        return flips;
    }
}`,
    pythonSolution: `def countSignFlips(signals):
    return sum(1 for i in range(1, len(signals)) if (signals[i] > 0) != (signals[i - 1] > 0))`
  },
  {
    number: 35,
    title: 'Floor-Trader Staircase Profit',
    fnName: 'maxMultiDayProfit',
    description: 'Given daily stock prices <code>prices</code>, you may buy and sell as many times as you like (holding at most 1 share at a time). Return the maximum total profit.',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [7, 1, 5, 3, 6, 4]', output: '7' },
      { title: 'Test Case 2', input: 'prices = [1, 2, 3, 4, 5]', output: '4' },
      { title: 'Test Case 3', input: 'prices = [5, 4, 3, 2, 1]', output: '0' },
      { title: 'Test Case 4', input: 'prices = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long maxMultiDayProfit(int[] prices) {
        long p = 0;
        for (int i = 1; i < prices.length; i++) if (prices[i] > prices[i - 1]) p += prices[i] - prices[i - 1];
        return p;
    }
}`,
    pythonSolution: `def maxMultiDayProfit(prices):
    return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))`
  },
  {
    number: 36,
    title: 'Modular Inverse Sum Check',
    fnName: 'sumPowersMod',
    description: 'Return <code>(1^k + 2^k + ... + n^k) mod (10^9 + 7)</code>.',
    constraints: ['1 <= n <= 10^4', '0 <= k <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, k = 2', output: '14' },
      { title: 'Test Case 2', input: 'n = 4, k = 1', output: '10' },
      { title: 'Test Case 3', input: 'n = 5, k = 0', output: '5' },
      { title: 'Test Case 4', input: 'n = 2, k = 3', output: '9' }
    ],
    javaSolution: `public class Solution {
    public static long sumPowersMod(int n, long k) {
        long MOD = 1_000_000_007L, ans = 0;
        for (int i = 1; i <= n; i++) ans = (ans + pow(i, k, MOD)) % MOD;
        return ans;
    }
    private static long pow(long b, long e, long m) {
        long r = 1; b %= m;
        while (e > 0) { if ((e & 1) == 1) r = (r * b) % m; b = (b * b) % m; e >>= 1; }
        return r;
    }
}`,
    pythonSolution: `def sumPowersMod(n, k):
    MOD = 10**9 + 7
    return sum(pow(i, k, MOD) for i in range(1, n + 1)) % MOD`
  },
  {
    number: 37,
    title: 'Risk-Matrix Saddle Point Count',
    fnName: 'countSaddlePoints',
    description: 'In an <code>R x C</code> matrix <code>mat</code> of distinct integers, a cell is a saddle point if it is the minimum in its row AND the maximum in its column. Count saddle points.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[3, 7, 8], [9, 11, 13], [15, 16, 17]]', output: '1' },
      { title: 'Test Case 2', input: 'mat = [[1, 10, 4, 2], [9, 3, 8, 7], [15, 16, 17, 12]]', output: '1' },
      { title: 'Test Case 3', input: 'mat = [[5]]', output: '1' },
      { title: 'Test Case 4', input: 'mat = [[1, 4], [3, 2]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSaddlePoints(int[][] mat) {
        int R = mat.length, C = mat[0].length;
        int[] rowMin = new int[R], colMax = new int[C];
        for (int r = 0; r < R; r++) {
            rowMin[r] = mat[r][0];
            for (int c = 1; c < C; c++) rowMin[r] = Math.min(rowMin[r], mat[r][c]);
        }
        for (int c = 0; c < C; c++) {
            colMax[c] = mat[0][c];
            for (int r = 1; r < R; r++) colMax[c] = Math.max(colMax[c], mat[r][c]);
        }
        int cnt = 0;
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (mat[r][c] == rowMin[r] && mat[r][c] == colMax[c]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countSaddlePoints(mat):
    rmin = [min(row) for row in mat]
    cmax = [max(mat[r][c] for r in range(len(mat))) for c in range(len(mat[0]))]
    return sum(1 for r in range(len(mat)) for c in range(len(mat[0])) if mat[r][c] == rmin[r] == cmax[c])`
  },
  {
    number: 38,
    title: 'Order-Book Queue Depth Peak',
    fnName: 'maxOrderBacklog',
    description: 'Each second, <code>incoming[i]</code> orders arrive and up to <code>capacity</code> orders are processed. Return the maximum backlog size at the end of any second.',
    constraints: ['1 <= incoming.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'incoming = [10, 8, 2, 1], capacity = 5', output: '8' },
      { title: 'Test Case 2', input: 'incoming = [3, 4, 5], capacity = 5', output: '0' },
      { title: 'Test Case 3', input: 'incoming = [10], capacity = 3', output: '7' },
      { title: 'Test Case 4', input: 'incoming = [0, 0], capacity = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long maxOrderBacklog(int[] incoming, int capacity) {
        long q = 0, best = 0;
        for (int x : incoming) {
            q = Math.max(0L, q + x - capacity);
            best = Math.max(best, q);
        }
        return best;
    }
}`,
    pythonSolution: `def maxOrderBacklog(incoming, capacity):
    q = best = 0
    for x in incoming:
        q = max(0, q + x - capacity); best = max(best, q)
    return best`
  },
  {
    number: 39,
    title: 'Coprime Pair Count in Desk IDs',
    fnName: 'countCoprimePairs',
    description: 'Given positive integer IDs <code>ids</code>, count how many pairs <code>(i, j)</code> with <code>i &lt; j</code> have <code>gcd(ids[i], ids[j]) == 1</code>.',
    constraints: ['1 <= ids.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = [2, 3, 4, 9]', output: '4' },
      { title: 'Test Case 2', input: 'ids = [2, 4, 6]', output: '0' },
      { title: 'Test Case 3', input: 'ids = [1, 10, 20]', output: '2' },
      { title: 'Test Case 4', input: 'ids = [7]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countCoprimePairs(int[] ids) {
        int cnt = 0;
        for (int i = 0; i < ids.length; i++)
            for (int j = i + 1; j < ids.length; j++)
                if (gcd(ids[i], ids[j]) == 1) cnt++;
        return cnt;
    }
    private static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
}`,
    pythonSolution: `import math
def countCoprimePairs(ids):
    return sum(1 for i in range(len(ids)) for j in range(i + 1, len(ids)) if math.gcd(ids[i], ids[j]) == 1)`
  },
  {
    number: 40,
    title: 'Trade Execution Window Overlap',
    fnName: 'totalOverlappingTradeMinutes',
    description: 'Two desks have sorted non-overlapping trading windows <code>deskA</code> and <code>deskB</code> (<code>[start, end]</code>). Return total overlapping minutes.',
    constraints: ['0 <= deskA.length, deskB.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'deskA = [[0, 10], [15, 25]], deskB = [[5, 20]]', output: '10' },
      { title: 'Test Case 2', input: 'deskA = [[0, 5]], deskB = [[5, 10]]', output: '0' },
      { title: 'Test Case 3', input: 'deskA = [[1, 8]], deskB = [[2, 6]]', output: '4' },
      { title: 'Test Case 4', input: 'deskA = [], deskB = [[1, 5]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalOverlappingTradeMinutes(int[][] deskA, int[][] deskB) {
        int i = 0, j = 0; long ans = 0;
        while (i < deskA.length && j < deskB.length) {
            int lo = Math.max(deskA[i][0], deskB[j][0]);
            int hi = Math.min(deskA[i][1], deskB[j][1]);
            if (lo < hi) ans += hi - lo;
            if (deskA[i][1] < deskB[j][1]) i++; else j++;
        }
        return ans;
    }
}`,
    pythonSolution: `def totalOverlappingTradeMinutes(deskA, deskB):
    i = j = ans = 0
    while i < len(deskA) and j < len(deskB):
        lo = max(deskA[i][0], deskB[j][0]); hi = min(deskA[i][1], deskB[j][1])
        if lo < hi: ans += hi - lo
        if deskA[i][1] < deskB[j][1]: i += 1
        else: j += 1
    return ans`
  },
  {
    number: 41,
    title: 'Portfolio Rebalance Minimum Delta',
    fnName: 'minRebalanceVolume',
    description: 'Given current holdings <code>cur</code> and target holdings <code>target</code> (same total sum), return the total units bought (<code>sum(max(0, target[i] - cur[i]))</code>).',
    constraints: ['1 <= cur.length == target.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cur = [10, 20, 30], target = [25, 15, 20]', output: '15' },
      { title: 'Test Case 2', input: 'cur = [5, 5], target = [5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'cur = [0, 100], target = [100, 0]', output: '100' },
      { title: 'Test Case 4', input: 'cur = [10], target = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minRebalanceVolume(int[] cur, int[] target) {
        long buy = 0;
        for (int i = 0; i < cur.length; i++) if (target[i] > cur[i]) buy += target[i] - cur[i];
        return buy;
    }
}`,
    pythonSolution: `def minRebalanceVolume(cur, target):
    return sum(max(0, t - c) for c, t in zip(cur, target))`
  },
  {
    number: 42,
    title: 'Josephus Desk Rotation Winner',
    fnName: 'lastAnalystStanding',
    description: '<code>n</code> analysts sit in a circle (1..n). Starting at 1, every <code>k</code>-th analyst is eliminated until one remains. Return the 1-based position of the survivor.',
    constraints: ['1 <= n <= 10^4', '1 <= k <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, k = 2', output: '3' },
      { title: 'Test Case 2', input: 'n = 6, k = 5', output: '1' },
      { title: 'Test Case 3', input: 'n = 1, k = 3', output: '1' },
      { title: 'Test Case 4', input: 'n = 7, k = 3', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int lastAnalystStanding(int n, int k) {
        int res = 0;
        for (int i = 2; i <= n; i++) res = (res + k) % i;
        return res + 1;
    }
}`,
    pythonSolution: `def lastAnalystStanding(n, k):
    res = 0
    for i in range(2, n + 1): res = (res + k) % i
    return res + 1`
  },
  {
    number: 43,
    title: 'Credit Rating Migration Count',
    fnName: 'countDowngrades',
    description: 'Given historical rating ranks <code>ratings</code> (where smaller number = better rating, e.g. 1 = AAA), count how many consecutive transitions were downgrades (<code>ratings[i] > ratings[i-1]</code>).',
    constraints: ['1 <= ratings.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ratings = [1, 2, 2, 4, 3]', output: '2' },
      { title: 'Test Case 2', input: 'ratings = [5, 4, 3, 1]', output: '0' },
      { title: 'Test Case 3', input: 'ratings = [1, 3, 5]', output: '2' },
      { title: 'Test Case 4', input: 'ratings = [2]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDowngrades(int[] ratings) {
        int cnt = 0;
        for (int i = 1; i < ratings.length; i++) if (ratings[i] > ratings[i - 1]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countDowngrades(ratings):
    return sum(1 for i in range(1, len(ratings)) if ratings[i] > ratings[i - 1])`
  },
  {
    number: 44,
    title: 'Subarray Sum Equal to Target Risk',
    fnName: 'countSubarraysWithSum',
    description: 'Given integer returns <code>nums</code> and target <code>k</code>, return the number of contiguous subarrays whose sum equals <code>k</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 1, 1], k = 2', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3], k = 3', output: '2' },
      { title: 'Test Case 3', input: 'nums = [1, -1, 0], k = 0', output: '3' },
      { title: 'Test Case 4', input: 'nums = [5], k = 10', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countSubarraysWithSum(int[] nums, long k) {
        Map<Long, Integer> cnt = new HashMap<>();
        cnt.put(0L, 1);
        long pref = 0, ans = 0;
        for (int x : nums) {
            pref += x;
            ans += cnt.getOrDefault(pref - k, 0);
            cnt.put(pref, cnt.getOrDefault(pref, 0) + 1);
        }
        return ans;
    }
}`,
    pythonSolution: `def countSubarraysWithSum(nums, k):
    cnt = {0: 1}; pref = ans = 0
    for x in nums:
        pref += x
        ans += cnt.get(pref - k, 0)
        cnt[pref] = cnt.get(pref, 0) + 1
    return ans`
  },
  {
    number: 45,
    title: 'FX Cross-Rate Triangular Check',
    fnName: 'countTriangularInconsistencies',
    description: 'Given <code>n</code> triples <code>[ab, bc, ac]</code> of integer exchange ratios, a triple is consistent if <code>ab * bc == ac</code>. Return how many triples are INCONSISTENT.',
    constraints: ['1 <= triples.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'triples = [[2, 3, 6], [2, 4, 9], [5, 5, 25]]', output: '1' },
      { title: 'Test Case 2', input: 'triples = [[1, 1, 1], [3, 3, 9]]', output: '0' },
      { title: 'Test Case 3', input: 'triples = [[2, 2, 5]]', output: '1' },
      { title: 'Test Case 4', input: 'triples = [[10, 10, 100]]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countTriangularInconsistencies(int[][] triples) {
        int bad = 0;
        for (int[] t : triples) if ((long) t[0] * t[1] != t[2]) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countTriangularInconsistencies(triples):
    return sum(1 for a, b, c in triples if a * b != c)`
  },
  {
    number: 46,
    title: 'Top-K Quant Desk Performers',
    fnName: 'sumTopKBonuses',
    description: 'Given analyst performance scores <code>scores</code> and integer <code>k</code>, return the sum of the top <code>k</code> scores.',
    constraints: ['1 <= k <= scores.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'scores = [10, 50, 20, 40, 30], k = 3', output: '120' },
      { title: 'Test Case 2', input: 'scores = [5, 5], k = 1', output: '5' },
      { title: 'Test Case 3', input: 'scores = [1, 2, 3], k = 3', output: '6' },
      { title: 'Test Case 4', input: 'scores = [100], k = 1', output: '100' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long sumTopKBonuses(int[] scores, int k) {
        Arrays.sort(scores);
        long s = 0;
        for (int i = scores.length - k; i < scores.length; i++) s += scores[i];
        return s;
    }
}`,
    pythonSolution: `def sumTopKBonuses(scores, k):
    return sum(sorted(scores, reverse=True)[:k])`
  },
  {
    number: 47,
    title: 'Algorithmic Trading Cooldown DP',
    fnName: 'maxProfitWithOneDayCooldown',
    description: 'Given daily prices <code>prices</code>, you may buy and sell multiple times, but after selling you must wait 1 day before buying again. Return maximum profit.',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [1, 2, 3, 0, 2]', output: '3' },
      { title: 'Test Case 2', input: 'prices = [1]', output: '0' },
      { title: 'Test Case 3', input: 'prices = [5, 4, 3]', output: '0' },
      { title: 'Test Case 4', input: 'prices = [1, 4, 2, 7]', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static long maxProfitWithOneDayCooldown(int[] prices) {
        long hold = -prices[0], sold = 0, rest = 0;
        for (int i = 1; i < prices.length; i++) {
            long prevSold = sold;
            sold = hold + prices[i];
            hold = Math.max(hold, rest - prices[i]);
            rest = Math.max(rest, prevSold);
        }
        return Math.max(sold, rest);
    }
}`,
    pythonSolution: `def maxProfitWithOneDayCooldown(prices):
    hold, sold, rest = -prices[0], 0, 0
    for p in prices[1:]:
        hold, sold, rest = max(hold, rest - p), hold + p, max(rest, sold)
    return max(sold, rest)`
  },
  {
    number: 48,
    title: 'Dividend Yield Digit Sum Check',
    fnName: 'countDivisibleByDigitSum',
    description: 'Given positive integers <code>nums</code>, count how many are Harshad numbers (divisible by the sum of their decimal digits).',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [18, 19, 21, 12]', output: '3' },
      { title: 'Test Case 2', input: 'nums = [11, 13, 14]', output: '0' },
      { title: 'Test Case 3', input: 'nums = [1, 2, 10]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [100]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countDivisibleByDigitSum(int[] nums) {
        int cnt = 0;
        for (int x : nums) {
            int s = 0, t = x;
            while (t > 0) { s += t % 10; t /= 10; }
            if (x % s == 0) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countDivisibleByDigitSum(nums):
    return sum(1 for x in nums if x % sum(int(d) for d in str(x)) == 0)`
  },
  {
    number: 49,
    title: 'Order-Book Imbalance Peak',
    fnName: 'maxAbsImbalance',
    description: 'Given buy volumes <code>buys</code> and sell volumes <code>sells</code> at <code>n</code> price levels, return the maximum absolute volume imbalance <code>|buys[i] - sells[i]|</code>.',
    constraints: ['1 <= buys.length == sells.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'buys = [100, 50, 200], sells = [80, 120, 190]', output: '70' },
      { title: 'Test Case 2', input: 'buys = [10, 10], sells = [10, 10]', output: '0' },
      { title: 'Test Case 3', input: 'buys = [5], sells = [25]', output: '20' },
      { title: 'Test Case 4', input: 'buys = [50, 0], sells = [0, 40]', output: '50' }
    ],
    javaSolution: `public class Solution {
    public static int maxAbsImbalance(int[] buys, int[] sells) {
        int best = 0;
        for (int i = 0; i < buys.length; i++) best = Math.max(best, Math.abs(buys[i] - sells[i]));
        return best;
    }
}`,
    pythonSolution: `def maxAbsImbalance(buys, sells):
    return max(abs(b - s) for b, s in zip(buys, sells))`
  },
  {
    number: 50,
    title: 'Quant Backtest Maximum Sharpe Streak',
    fnName: 'maxPositivePrefixSum',
    description: 'Given daily returns <code>ret</code>, you may reorder the array arbitrarily. Return the maximum number of positive prefix sums achievable (<code>sum(ret[0..i]) &gt; 0</code>).',
    constraints: ['1 <= ret.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ret = [2, -1, 0, -3, 3]', output: '5' },
      { title: 'Test Case 2', input: 'ret = [-1, -2, -3]', output: '0' },
      { title: 'Test Case 3', input: 'ret = [5, 5, 5]', output: '3' },
      { title: 'Test Case 4', input: 'ret = [0, 0]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxPositivePrefixSum(int[] ret) {
        Arrays.sort(ret);
        long s = 0; int cnt = 0;
        for (int i = ret.length - 1; i >= 0; i--) {
            s += ret[i];
            if (s > 0) cnt++;
            else break;
        }
        return cnt;
    }
}`,
    pythonSolution: `def maxPositivePrefixSum(ret):
    s = cnt = 0
    for x in sorted(ret, reverse=True):
        s += x
        if s > 0: cnt += 1
        else: break
    return cnt`
  }
];
