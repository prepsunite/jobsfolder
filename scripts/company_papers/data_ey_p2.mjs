export const EY_P2 = [
  {
    number: 31,
    title: 'FX Hedging Net Currency Exposure',
    fnName: 'netOpenExposure',
    description: 'An EY treasury desk logs foreign-exchange deals as <code>[currencyCode, signedAmount]</code>. Long positions are positive and short positions are negative. Return the sum of absolute net exposures across all currencies.',
    constraints: ['1 <= deals.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'currencies = ["USD", "EUR", "USD", "JPY"], amounts = [100, -50, -40, -20]', output: '130' },
      { title: 'Test Case 2', input: 'currencies = ["USD", "USD"], amounts = [500, -500]', output: '0' },
      { title: 'Test Case 3', input: 'currencies = ["GBP"], amounts = [-300]', output: '300' },
      { title: 'Test Case 4', input: 'currencies = ["INR", "USD", "INR"], amounts = [10, 20, 30]', output: '60' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long netOpenExposure(String[] currencies, int[] amounts) {
        Map<String, Long> net = new HashMap<>();
        for (int i = 0; i < currencies.length; i++) net.put(currencies[i], net.getOrDefault(currencies[i], 0L) + amounts[i]);
        long total = 0;
        for (long v : net.values()) total += Math.abs(v);
        return total;
    }
}`,
    pythonSolution: `def netOpenExposure(currencies, amounts):
    from collections import defaultdict
    net = defaultdict(int)
    for c, a in zip(currencies, amounts): net[c] += a
    return sum(abs(v) for v in net.values())`
  },
  {
    number: 32,
    title: 'ESG Carbon-Offset Credit Allocation',
    fnName: 'minOffsetCost',
    description: 'A firm must offset <code>targetTons</code> of CO2. Carbon projects offer <code>[tons, pricePerTon]</code>. Projects can be bought partially (per-ton). Return the minimum integer cost to offset <code>targetTons</code> (or <code>-1</code> if total supply &lt; targetTons).',
    constraints: ['1 <= projects.length <= 10^4', '0 <= targetTons <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'projects = [[10, 5], [20, 3], [15, 4]], targetTons = 25', output: '80' },
      { title: 'Test Case 2', input: 'projects = [[5, 10]], targetTons = 10', output: '-1' },
      { title: 'Test Case 3', input: 'projects = [[10, 2]], targetTons = 0', output: '0' },
      { title: 'Test Case 4', input: 'projects = [[10, 10], [10, 1]], targetTons = 10', output: '10' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minOffsetCost(int[][] projects, int targetTons) {
        Arrays.sort(projects, (a, b) -> Integer.compare(a[1], b[1]));
        long rem = targetTons, cost = 0;
        for (int[] p : projects) {
            long take = Math.min(rem, p[0]);
            cost += take * p[1];
            rem -= take;
            if (rem == 0) break;
        }
        return rem == 0 ? cost : -1;
    }
}`,
    pythonSolution: `def minOffsetCost(projects, targetTons):
    rem, cost = targetTons, 0
    for tons, price in sorted(projects, key=lambda x: x[1]):
        take = min(rem, tons)
        cost += take * price; rem -= take
        if rem == 0: break
    return cost if rem == 0 else -1`
  },
  {
    number: 33,
    title: 'M&A Branch Overlap Deduplicator',
    fnName: 'countUniqueMergedBranches',
    description: 'Two merging banks operate branches in city codes <code>bankA</code> and <code>bankB</code>. After merging, each city keeps at most ONE branch. Return the total number of branches that will be closed.',
    constraints: ['1 <= bankA.length, bankB.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bankA = [101, 102, 103], bankB = [102, 103, 104]', output: '2' },
      { title: 'Test Case 2', input: 'bankA = [1, 1, 2], bankB = [2, 3]', output: '2' },
      { title: 'Test Case 3', input: 'bankA = [1, 2], bankB = [3, 4]', output: '0' },
      { title: 'Test Case 4', input: 'bankA = [5, 5, 5], bankB = [5, 5]', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countUniqueMergedBranches(int[] bankA, int[] bankB) {
        Set<Integer> u = new HashSet<>();
        for (int x : bankA) u.add(x);
        for (int x : bankB) u.add(x);
        return (bankA.length + bankB.length) - u.size();
    }
}`,
    pythonSolution: `def countUniqueMergedBranches(bankA, bankB):
    return len(bankA) + len(bankB) - len(set(bankA) | set(bankB))`
  },
  {
    number: 34,
    title: 'Bond Coupon Ladder Annual Cashflow',
    fnName: 'annualCouponTotal',
    description: 'A treasury portfolio holds bonds with face values <code>face</code>, annual coupon rates in basis points <code>bps</code> (100 bps = 1%), and maturity year <code>matYear</code>. Given <code>currentYear</code>, return total annual coupon income from active bonds (<code>matYear[i] &gt;= currentYear</code>), using integer floor.',
    constraints: ['1 <= face.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'face = [10000, 20000, 5000], bps = [500, 400, 600], matYear = [2028, 2025, 2026], currentYear = 2026', output: '800' },
      { title: 'Test Case 2', input: 'face = [10000], bps = [250], matYear = [2024], currentYear = 2026', output: '0' },
      { title: 'Test Case 3', input: 'face = [100000], bps = [750], matYear = [2030], currentYear = 2026', output: '7500' },
      { title: 'Test Case 4', input: 'face = [5000, 5000], bps = [400, 400], matYear = [2026, 2026], currentYear = 2026', output: '400' }
    ],
    javaSolution: `public class Solution {
    public static long annualCouponTotal(int[] face, int[] bps, int[] matYear, int currentYear) {
        long sum = 0;
        for (int i = 0; i < face.length; i++) if (matYear[i] >= currentYear) sum += (long) face[i] * bps[i] / 10000;
        return sum;
    }
}`,
    pythonSolution: `def annualCouponTotal(face, bps, matYear, currentYear):
    return sum((f * b) // 10000 for f, b, m in zip(face, bps, matYear) if m >= currentYear)`
  },
  {
    number: 35,
    title: 'Treasury Sweep Account Min Balance',
    fnName: 'countSweepTransfers',
    description: 'A corporate checking account starts with <code>balance</code> and processes daily net flows <code>flows</code>. Whenever end-of-day balance falls below <code>minBal</code>, an automated sweep injects the exact deficit to restore it to <code>minBal</code>. Return the total number of sweep injections.',
    constraints: ['1 <= flows.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'balance = 1000, flows = [-400, -300, 200, -500], minBal = 500', output: '2' },
      { title: 'Test Case 2', input: 'balance = 500, flows = [100, 200, -100], minBal = 400', output: '0' },
      { title: 'Test Case 3', input: 'balance = 100, flows = [-200, -200], minBal = 100', output: '2' },
      { title: 'Test Case 4', input: 'balance = 500, flows = [-100], minBal = 400', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSweepTransfers(long balance, int[] flows, long minBal) {
        long cur = balance;
        int sweeps = 0;
        for (int f : flows) {
            cur += f;
            if (cur < minBal) { sweeps++; cur = minBal; }
        }
        return sweeps;
    }
}`,
    pythonSolution: `def countSweepTransfers(balance, flows, minBal):
    cur, sweeps = balance, 0
    for f in flows:
        cur += f
        if cur < minBal: sweeps += 1; cur = minBal
    return sweeps`
  },
  {
    number: 36,
    title: 'KYC Name Token Overlap Score',
    fnName: 'countKycMatches',
    description: 'A KYC screening tool compares a candidate name <code>queryName</code> against a watchlist <code>watchlist</code>. Split names into lowercase space-separated words. A watchlist entry flags a match if it shares at least 2 distinct words with <code>queryName</code>. Return the count of flagged entries.',
    constraints: ['1 <= watchlist.length <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'queryName = "Rajesh Kumar Sharma", watchlist = ["Sharma Rajesh", "Kumar Verma", "Rajesh K Sharma"]', output: '2' },
      { title: 'Test Case 2', input: 'queryName = "Alice Smith", watchlist = ["Alice Johnson", "Bob Smith"]', output: '0' },
      { title: 'Test Case 3', input: 'queryName = "John Doe", watchlist = ["john doe", "DOE JOHN"]', output: '2' },
      { title: 'Test Case 4', input: 'queryName = "Single", watchlist = ["Single"]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countKycMatches(String queryName, String[] watchlist) {
        Set<String> q = new HashSet<>(Arrays.asList(queryName.toLowerCase().trim().split("\\\\s+")));
        int flagged = 0;
        for (String w : watchlist) {
            Set<String> ws = new HashSet<>(Arrays.asList(w.toLowerCase().trim().split("\\\\s+")));
            int common = 0;
            for (String tok : ws) if (q.contains(tok)) common++;
            if (common >= 2) flagged++;
        }
        return flagged;
    }
}`,
    pythonSolution: `def countKycMatches(queryName, watchlist):
    q = set(queryName.lower().split())
    return sum(1 for w in watchlist if len(q & set(w.lower().split())) >= 2)`
  },
  {
    number: 37,
    title: 'Credit-Limit Utilization Breach Streak',
    fnName: 'longestUtilizationBreach',
    description: 'Given daily credit balances <code>balances</code> and a credit limit <code>limit</code>, a breach occurs when <code>balances[i] * 100 &gt; limit * 80</code> (strictly above 80% utilization). Return the longest consecutive days in breach.',
    constraints: ['1 <= balances.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'balances = [70, 81, 90, 85, 80, 95], limit = 100', output: '3' },
      { title: 'Test Case 2', input: 'balances = [80, 80, 80], limit = 100', output: '0' },
      { title: 'Test Case 3', input: 'balances = [90, 95, 100], limit = 100', output: '3' },
      { title: 'Test Case 4', input: 'balances = [50], limit = 100', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int longestUtilizationBreach(int[] balances, long limit) {
        int cur = 0, best = 0;
        for (int b : balances) {
            if ((long) b * 100 > limit * 80) { cur++; best = Math.max(best, cur); }
            else cur = 0;
        }
        return best;
    }
}`,
    pythonSolution: `def longestUtilizationBreach(balances, limit):
    cur = best = 0
    for b in balances:
        cur = cur + 1 if b * 100 > limit * 80 else 0
        if cur > best: best = cur
    return best`
  },
  {
    number: 38,
    title: 'Portfolio Peak-to-Trough Drawdown',
    fnName: 'maxPortfolioDrawdown',
    description: 'Given daily portfolio NAV values <code>navs</code>, find the maximum drop <code>peak - trough</code> where <code>peak</code> occurs before or on the same day as <code>trough</code>.',
    constraints: ['1 <= navs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'navs = [100, 120, 90, 110, 80, 130]', output: '40' },
      { title: 'Test Case 2', input: 'navs = [10, 20, 30, 40]', output: '0' },
      { title: 'Test Case 3', input: 'navs = [50, 30, 10]', output: '40' },
      { title: 'Test Case 4', input: 'navs = [25]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxPortfolioDrawdown(int[] navs) {
        int peak = navs[0], best = 0;
        for (int x : navs) { peak = Math.max(peak, x); best = Math.max(best, peak - x); }
        return best;
    }
}`,
    pythonSolution: `def maxPortfolioDrawdown(navs):
    peak, best = navs[0], 0
    for x in navs: peak = max(peak, x); best = max(best, peak - x)
    return best`
  },
  {
    number: 39,
    title: 'Risk-Weighted Asset Bucket Sum',
    fnName: 'totalRiskWeightedAssets',
    description: 'Basel III risk weights map asset ratings <code>"AAA" -> 20%</code>, <code>"BBB" -> 50%</code>, <code>"BB" -> 100%</code>, <code>"CCC" -> 150%</code>. Given <code>amounts</code> and <code>ratings</code>, return total risk-weighted assets (integer floor per asset).',
    constraints: ['1 <= amounts.length == ratings.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [1000, 1000, 1000, 1000], ratings = ["AAA", "BBB", "BB", "CCC"]', output: '3200' },
      { title: 'Test Case 2', input: 'amounts = [500], ratings = ["AAA"]', output: '100' },
      { title: 'Test Case 3', input: 'amounts = [200, 300], ratings = ["CCC", "BB"]', output: '600' },
      { title: 'Test Case 4', input: 'amounts = [100], ratings = ["BBB"]', output: '50' }
    ],
    javaSolution: `public class Solution {
    public static long totalRiskWeightedAssets(int[] amounts, String[] ratings) {
        long sum = 0;
        for (int i = 0; i < amounts.length; i++) {
            int w = ratings[i].equals("AAA") ? 20 : ratings[i].equals("BBB") ? 50 : ratings[i].equals("BB") ? 100 : 150;
            sum += (long) amounts[i] * w / 100;
        }
        return sum;
    }
}`,
    pythonSolution: `def totalRiskWeightedAssets(amounts, ratings):
    rw = {'AAA': 20, 'BBB': 50, 'BB': 100, 'CCC': 150}
    return sum((a * rw[r]) // 100 for a, r in zip(amounts, ratings))`
  },
  {
    number: 40,
    title: 'Cross-Border Tariff Tier Lookup',
    fnName: 'totalTariffDuty',
    description: 'Customs rules map shipment values to tariff rates via sorted upper bounds <code>bounds</code> and percentages <code>rates</code> (first <code>bound &gt;= value</code> applies; if above all bounds, last rate applies). Return total integer-floor duty across <code>shipments</code>.',
    constraints: ['1 <= bounds.length == rates.length <= 100', '1 <= shipments.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'shipments = [500, 1500, 5000], bounds = [1000, 3000], rates = [5, 10, 15]', output: '925' },
      { title: 'Test Case 2', input: 'shipments = [1000], bounds = [1000], rates = [10]', output: '100' },
      { title: 'Test Case 3', input: 'shipments = [200, 400], bounds = [500], rates = [0, 20]', output: '0' },
      { title: 'Test Case 4', input: 'shipments = [10000], bounds = [1000, 2000], rates = [5, 10, 20]', output: '2000' }
    ].map((tc, i) => i === 0 ? { ...tc, input: 'shipments = [500, 1500, 5000], bounds = [1000, 3000, 10000], rates = [5, 10, 15]' } : (i === 2 ? { ...tc, input: 'shipments = [200, 400], bounds = [500, 1000], rates = [0, 20]' } : (i === 3 ? { ...tc, input: 'shipments = [10000], bounds = [1000, 2000, 5000], rates = [5, 10, 20]' } : tc))),
    javaSolution: `public class Solution {
    public static long totalTariffDuty(int[] shipments, int[] bounds, int[] rates) {
        long duty = 0;
        for (int s : shipments) {
            int r = rates[rates.length - 1];
            for (int i = 0; i < bounds.length; i++) if (s <= bounds[i]) { r = rates[i]; break; }
            duty += (long) s * r / 100;
        }
        return duty;
    }
}`,
    pythonSolution: `def totalTariffDuty(shipments, bounds, rates):
    import bisect
    duty = 0
    for s in shipments:
        idx = min(bisect.bisect_left(bounds, s), len(rates) - 1)
        duty += (s * rates[idx]) // 100
    return duty`
  },
  {
    number: 41,
    title: 'Dividend Ex-Date Eligibility Count',
    fnName: 'countDividendEligible',
    description: 'Shareholders receive dividends if they bought on or before <code>exDate - 1</code> AND have not sold before <code>exDate</code> (<code>buyDay[i] &lt; exDate &amp;&amp; sellDay[i] &gt;= exDate</code>, where <code>sellDay[i] = -1</code> means still holding). Return eligible count.',
    constraints: ['1 <= buyDay.length == sellDay.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'buyDay = [1, 5, 10, 3], sellDay = [10, 8, -1, -1], exDate = 10', output: '2' },
      { title: 'Test Case 2', input: 'buyDay = [10], sellDay = [-1], exDate = 10', output: '0' },
      { title: 'Test Case 3', input: 'buyDay = [1, 2], sellDay = [15, 20], exDate = 10', output: '2' },
      { title: 'Test Case 4', input: 'buyDay = [1], sellDay = [9], exDate = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDividendEligible(int[] buyDay, int[] sellDay, int exDate) {
        int cnt = 0;
        for (int i = 0; i < buyDay.length; i++) {
            if (buyDay[i] < exDate && (sellDay[i] == -1 || sellDay[i] >= exDate)) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countDividendEligible(buyDay, sellDay, exDate):
    return sum(1 for b, s in zip(buyDay, sellDay) if b < exDate and (s == -1 or s >= exDate))`
  },
  {
    number: 42,
    title: 'Counterparty Exposure Gross-to-Net Ratio',
    fnName: 'countHighNettingPairs',
    description: 'Given bilateral receivables <code>recv</code> and payables <code>pay</code> for <code>n</code> counterparties, a counterparty qualifies for netting if <code>min(recv[i], pay[i]) &gt; 0</code> and netting saves at least 50% of gross exposure (<code>2 * min(recv[i], pay[i]) * 2 &gt;= recv[i] + pay[i]</code>, i.e. <code>4 * min &gt;= gross</code> — wait: saving = <code>2 * min</code>, so <code>2 * min * 2 &gt;= gross</code> is <code>4 * min &gt;= gross</code>, or <code>2 * min &gt;= gross / 2</code>). Return the count of qualifying counterparties.',
    constraints: ['1 <= recv.length == pay.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'recv = [100, 100, 10], pay = [100, 300, 100]', output: '2' },
      { title: 'Test Case 2', input: 'recv = [0, 50], pay = [100, 0]', output: '0' },
      { title: 'Test Case 3', input: 'recv = [40, 60], pay = [60, 40]', output: '2' },
      { title: 'Test Case 4', input: 'recv = [100], pay = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countHighNettingPairs(int[] recv, int[] pay) {
        int cnt = 0;
        for (int i = 0; i < recv.length; i++) {
            long mn = Math.min(recv[i], pay[i]);
            long gross = (long) recv[i] + pay[i];
            if (mn > 0 && 4 * mn >= gross) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countHighNettingPairs(recv, pay):
    return sum(1 for r, p in zip(recv, pay) if min(r, p) > 0 and 4 * min(r, p) >= r + p)`
  },
  {
    number: 43,
    title: 'Capital Call Tranche Fulfillment',
    fnName: 'tranchesFulfilled',
    description: 'A private equity fund receives investor commitments <code>commitments</code> and issues capital calls <code>calls</code> in order. Each call consumes from the current commitment until exhausted, moving to the next commitment. Return how many calls are 100% fulfilled.',
    constraints: ['1 <= commitments.length, calls.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'commitments = [100, 150], calls = [80, 120, 100]', output: '2' },
      { title: 'Test Case 2', input: 'commitments = [50], calls = [60]', output: '0' },
      { title: 'Test Case 3', input: 'commitments = [100, 100], calls = [50, 50, 50, 50]', output: '4' },
      { title: 'Test Case 4', input: 'commitments = [0, 200], calls = [150]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int tranchesFulfilled(int[] commitments, int[] calls) {
        long avail = 0;
        for (int c : commitments) avail += c;
        int done = 0;
        for (int call : calls) {
            if (avail >= call) { avail -= call; done++; }
            else break;
        }
        return done;
    }
}`,
    pythonSolution: `def tranchesFulfilled(commitments, calls):
    avail, done = sum(commitments), 0
    for c in calls:
        if avail >= c: avail -= c; done += 1
        else: break
    return done`
  },
  {
    number: 44,
    title: 'Quarterly Variance Alert Filter',
    fnName: 'countMaterialVariances',
    description: 'An audit flags line items where <code>|actual[i] - budget[i]| &gt;= materiality</code> AND relative variance <code>|actual[i] - budget[i]| * 100 &gt;= budget[i] * pctThreshold</code>. Return the count of flagged items.',
    constraints: ['1 <= actual.length == budget.length <= 10^5', 'budget[i] > 0'],
    testCases: [
      { title: 'Test Case 1', input: 'actual = [1200, 1050, 500], budget = [1000, 1000, 100], materiality = 100, pctThreshold = 10', output: '2' },
      { title: 'Test Case 2', input: 'actual = [105], budget = [100], materiality = 10, pctThreshold = 5', output: '0' },
      { title: 'Test Case 3', input: 'actual = [90], budget = [100], materiality = 10, pctThreshold = 10', output: '1' },
      { title: 'Test Case 4', input: 'actual = [1000], budget = [1000], materiality = 1, pctThreshold = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countMaterialVariances(int[] actual, int[] budget, int materiality, int pctThreshold) {
        int cnt = 0;
        for (int i = 0; i < actual.length; i++) {
            long diff = Math.abs((long) actual[i] - budget[i]);
            if (diff >= materiality && diff * 100 >= (long) budget[i] * pctThreshold) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countMaterialVariances(actual, budget, materiality, pctThreshold):
    return sum(1 for a, b in zip(actual, budget) if abs(a - b) >= materiality and abs(a - b) * 100 >= b * pctThreshold)`
  },
  {
    number: 45,
    title: 'Liquidity Coverage Ratio Rolling Min',
    fnName: 'minLiquidityWindow',
    description: 'Given daily net cash outflows <code>outflows</code> and high-quality liquid assets <code>hqla</code>, find the minimum remaining HQLA across all 30-day rolling windows (or window size <code>w</code>): <code>hqla - maxWindowSum(outflows, w)</code>.',
    constraints: ['1 <= w <= outflows.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'hqla = 1000, outflows = [100, 200, 300, 150, 50], w = 3', output: '350' },
      { title: 'Test Case 2', input: 'hqla = 500, outflows = [200, 200, 200], w = 2', output: '100' },
      { title: 'Test Case 3', input: 'hqla = 300, outflows = [100], w = 1', output: '200' },
      { title: 'Test Case 4', input: 'hqla = 100, outflows = [100, 100], w = 2', output: '-100' }
    ],
    javaSolution: `public class Solution {
    public static long minLiquidityWindow(long hqla, int[] outflows, int w) {
        long cur = 0, maxW = Long.MIN_VALUE;
        for (int i = 0; i < outflows.length; i++) {
            cur += outflows[i];
            if (i >= w) cur -= outflows[i - w];
            if (i >= w - 1) maxW = Math.max(maxW, cur);
        }
        return hqla - maxW;
    }
}`,
    pythonSolution: `def minLiquidityWindow(hqla, outflows, w):
    cur = sum(outflows[:w])
    max_w = cur
    for i in range(w, len(outflows)):
        cur += outflows[i] - outflows[i - w]
        if cur > max_w: max_w = cur
    return hqla - max_w`
  },
  {
    number: 46,
    title: 'Compliance Rule Precedence Evaluator',
    fnName: 'resolveFinalDecision',
    description: 'Policy rules are evaluated in priority order (lowest priority number first). Each rule has <code>[priority, action]</code> where action is <code>1</code> (ALLOW) or <code>0</code> (DENY), and <code>matched[i]</code> indicates if the rule matched. The highest-priority (smallest priority number) matching rule wins. Return <code>1</code>, <code>0</code>, or <code>-1</code> if none matched.',
    constraints: ['1 <= priorities.length == actions.length == matched.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'priorities = [10, 5, 20], actions = [1, 0, 1], matched = [true, true, false]', output: '0' },
      { title: 'Test Case 2', input: 'priorities = [1, 2], actions = [0, 1], matched = [false, true]', output: '1' },
      { title: 'Test Case 3', input: 'priorities = [5, 10], actions = [1, 0], matched = [false, false]', output: '-1' },
      { title: 'Test Case 4', input: 'priorities = [3], actions = [1], matched = [true]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int resolveFinalDecision(int[] priorities, int[] actions, boolean[] matched) {
        int bestP = Integer.MAX_VALUE, ans = -1;
        for (int i = 0; i < priorities.length; i++) {
            if (matched[i] && priorities[i] < bestP) { bestP = priorities[i]; ans = actions[i]; }
        }
        return ans;
    }
}`,
    pythonSolution: `def resolveFinalDecision(priorities, actions, matched):
    best_p, ans = float('inf'), -1
    for p, a, m in zip(priorities, actions, matched):
        if m and p < best_p: best_p, ans = p, a
    return ans`
  },
  {
    number: 47,
    title: 'Subsidiary Effective Ownership Percentage',
    fnName: 'effectiveOwnershipPct',
    description: 'In a corporate tree of <code>n</code> entities (0 = parent), <code>parent[i]</code> is the direct parent of entity <code>i</code> and <code>pct[i]</code> is the direct ownership percentage (0..100). Compute the effective ownership of <code>target</code> by <code>0</code> using integer floor at each hop.',
    constraints: ['2 <= n <= 1000', '1 <= target < n'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 1], pct = [100, 80, 50], target = 2', output: '40' },
      { title: 'Test Case 2', input: 'parent = [-1, 0, 0], pct = [100, 75, 60], target = 2', output: '60' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 1, 2], pct = [100, 50, 50, 50], target = 3', output: '12' },
      { title: 'Test Case 4', input: 'parent = [-1, 0], pct = [100, 100], target = 1', output: '100' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int effectiveOwnershipPct(int[] parent, int[] pct, int target) {
        List<Integer> chain = new ArrayList<>();
        int cur = target;
        while (cur != 0) { chain.add(pct[cur]); cur = parent[cur]; }
        int eff = 100;
        for (int i = chain.size() - 1; i >= 0; i--) eff = (eff * chain.get(i)) / 100;
        return eff;
    }
}`,
    pythonSolution: `def effectiveOwnershipPct(parent, pct, target):
    chain, cur = [], target
    while cur != 0: chain.append(pct[cur]); cur = parent[cur]
    eff = 100
    for p in reversed(chain): eff = (eff * p) // 100
    return eff`
  },
  {
    number: 48,
    title: 'Audit Sampling Interval Stepper',
    fnName: 'monetaryUnitSampleCount',
    description: 'In Monetary Unit Sampling (MUS), invoices have amounts <code>amounts</code>. Starting at cumulative offset <code>interval</code>, every time cumulative sum crosses a multiple of <code>interval</code>, one sample is selected (an invoice larger than <code>interval</code> can be sampled multiple times: <code>floor(newCum/interval) - floor(oldCum/interval)</code>). Return total samples.',
    constraints: ['1 <= amounts.length <= 10^5', '1 <= interval <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [40, 70, 90], interval = 50', output: '4' },
      { title: 'Test Case 2', input: 'amounts = [10, 10, 10], interval = 100', output: '0' },
      { title: 'Test Case 3', input: 'amounts = [250], interval = 50', output: '5' },
      { title: 'Test Case 4', input: 'amounts = [50, 50], interval = 50', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long monetaryUnitSampleCount(int[] amounts, long interval) {
        long cum = 0;
        for (int a : amounts) cum += a;
        return cum / interval;
    }
}`,
    pythonSolution: `def monetaryUnitSampleCount(amounts, interval):
    return sum(amounts) // interval`
  },
  {
    number: 49,
    title: 'Interest Rate Cap-Floor Collar',
    fnName: 'applyRateCollar',
    description: 'Floating interest rates <code>rates</code> (in bps) are bounded by a floor <code>floorBps</code> and a cap <code>capBps</code>. Clamp each rate to <code>[floorBps, capBps]</code> and return the clamped array.',
    constraints: ['1 <= rates.length <= 10^5', 'floorBps <= capBps'],
    testCases: [
      { title: 'Test Case 1', input: 'rates = [150, 300, 650, 400], floorBps = 200, capBps = 500', output: '[200, 300, 500, 400]' },
      { title: 'Test Case 2', input: 'rates = [100, 200], floorBps = 100, capBps = 200', output: '[100, 200]' },
      { title: 'Test Case 3', input: 'rates = [50, 900], floorBps = 300, capBps = 300', output: '[300, 300]' },
      { title: 'Test Case 4', input: 'rates = [450], floorBps = 0, capBps = 1000', output: '[450]' }
    ],
    javaSolution: `public class Solution {
    public static int[] applyRateCollar(int[] rates, int floorBps, int capBps) {
        int[] res = new int[rates.length];
        for (int i = 0; i < rates.length; i++) res[i] = Math.max(floorBps, Math.min(capBps, rates[i]));
        return res;
    }
}`,
    pythonSolution: `def applyRateCollar(rates, floorBps, capBps):
    return [max(floorBps, min(capBps, r)) for r in rates]`
  },
  {
    number: 50,
    title: 'Tax Loss Harvesting Offset',
    fnName: 'netTaxableCapitalGain',
    description: 'Given realized capital gains/losses <code>gains</code> (positive = gain, negative = loss) and a prior-year carried-forward loss <code>carryForward</code> (non-negative), offset total net gains by <code>carryForward</code>. Return the final taxable gain (0 if net gain after offset is &lt;= 0).',
    constraints: ['1 <= gains.length <= 10^5', '0 <= carryForward <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'gains = [5000, -2000, 3000], carryForward = 2500', output: '3500' },
      { title: 'Test Case 2', input: 'gains = [1000, -3000], carryForward = 500', output: '0' },
      { title: 'Test Case 3', input: 'gains = [4000], carryForward = 4000', output: '0' },
      { title: 'Test Case 4', input: 'gains = [10000, 5000], carryForward = 0', output: '15000' }
    ],
    javaSolution: `public class Solution {
    public static long netTaxableCapitalGain(int[] gains, long carryForward) {
        long net = -carryForward;
        for (int g : gains) net += g;
        return Math.max(0L, net);
    }
}`,
    pythonSolution: `def netTaxableCapitalGain(gains, carryForward):
    return max(0, sum(gains) - carryForward)`
  }
];
