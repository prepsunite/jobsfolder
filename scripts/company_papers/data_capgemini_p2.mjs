export const CAPGEMINI_P2 = [
  {
    number: 31,
    title: 'Barcode Checksum Parity Repair',
    fnName: 'countValidBarcodes',
    description: 'In a Capgemini retail POS pipeline, each 12-digit barcode string is valid if the weighted sum <code>sum(digit[i] * (1 if i is even else 3))</code> for <code>i = 0..10</code> modulo 10, subtracted from 10 (and modulo 10), equals <code>digit[11]</code>. Given an array of 12-digit barcode strings <code>codes</code>, return how many are valid.',
    constraints: ['1 <= codes.length <= 10^4', 'Each code has length 12 and consists of digits 0-9'],
    testCases: [
      { title: 'Test Case 1', input: 'codes = ["036000291458", "123456789012"]', output: '1' },
      { title: 'Test Case 2', input: 'codes = ["042100005266", "036000291458"]', output: '2' },
      { title: 'Test Case 3', input: 'codes = ["000000000000"]', output: '1' },
      { title: 'Test Case 4', input: 'codes = ["111111111111"]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countValidBarcodes(String[] codes) {
        int valid = 0;
        for (String c : codes) {
            int sum = 0;
            for (int i = 0; i < 11; i++) sum += (c.charAt(i) - '0') * (i % 2 == 0 ? 1 : 3);
            int check = (10 - (sum % 10)) % 10;
            if (check == (c.charAt(11) - '0')) valid++;
        }
        return valid;
    }
}`,
    pythonSolution: `def countValidBarcodes(codes):
    valid = 0
    for c in codes:
        s = sum(int(c[i]) * (1 if i % 2 == 0 else 3) for i in range(11))
        if (10 - (s % 10)) % 10 == int(c[11]):
            valid += 1
    return valid`
  },
  {
    number: 32,
    title: 'Warehouse Forklift Aisle Turn Counter',
    fnName: 'countDirectionChanges',
    description: 'A warehouse forklift logs its aisle movement as a string <code>moves</code> of <code>\'N\'</code>, <code>\'S\'</code>, <code>\'E\'</code>, <code>\'W\'</code>. Every time the forklift changes direction (excluding consecutive identical moves) AND makes a 90-degree turn (not a 180-degree reversal), it incurs a steering calibration check. Count total 90-degree turns.',
    constraints: ['1 <= moves.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'moves = "NNESW"', output: '3' },
      { title: 'Test Case 2', input: 'moves = "NSNS"', output: '0' },
      { title: 'Test Case 3', input: 'moves = "NESW"', output: '3' },
      { title: 'Test Case 4', input: 'moves = "EEEE"', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDirectionChanges(String moves) {
        int turns = 0;
        for (int i = 1; i < moves.length(); i++) {
            char a = moves.charAt(i - 1), b = moves.charAt(i);
            if (a == b) continue;
            boolean opp = (a=='N'&&b=='S')||(a=='S'&&b=='N')||(a=='E'&&b=='W')||(a=='W'&&b=='E');
            if (!opp) turns++;
        }
        return turns;
    }
}`,
    pythonSolution: `def countDirectionChanges(moves):
    opp = {('N','S'),('S','N'),('E','W'),('W','E')}
    return sum(1 for i in range(1, len(moves)) if moves[i] != moves[i-1] and (moves[i-1], moves[i]) not in opp)`
  },
  {
    number: 33,
    title: 'Legacy COBOL Date-Format Normalizer',
    fnName: 'normalizeCobolDates',
    description: 'Mainframe exports store dates as <code>"DD-MON-YYYY"</code> (uppercase 3-letter month, e.g. <code>"05-MAR-2026"</code>). Convert an array of such date strings into ISO format <code>"YYYY-MM-DD"</code>.',
    constraints: ['1 <= dates.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'dates = ["05-MAR-2026", "19-NOV-1999"]', output: '["2026-03-05", "1999-11-19"]' },
      { title: 'Test Case 2', input: 'dates = ["01-JAN-2000"]', output: '["2000-01-01"]' },
      { title: 'Test Case 3', input: 'dates = ["31-DEC-2025"]', output: '["2025-12-31"]' },
      { title: 'Test Case 4', input: 'dates = ["14-FEB-2024", "09-AUG-2024"]', output: '["2024-02-14", "2024-08-09"]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static String[] normalizeCobolDates(String[] dates) {
        Map<String, String> m = Map.ofEntries(
            Map.entry("JAN","01"), Map.entry("FEB","02"), Map.entry("MAR","03"), Map.entry("APR","04"),
            Map.entry("MAY","05"), Map.entry("JUN","06"), Map.entry("JUL","07"), Map.entry("AUG","08"),
            Map.entry("SEP","09"), Map.entry("OCT","10"), Map.entry("NOV","11"), Map.entry("DEC","12")
        );
        String[] res = new String[dates.length];
        for (int i = 0; i < dates.length; i++) {
            String[] p = dates[i].split("-");
            res[i] = p[2] + "-" + m.get(p[1]) + "-" + p[0];
        }
        return res;
    }
}`,
    pythonSolution: `def normalizeCobolDates(dates):
    m = {'JAN':'01','FEB':'02','MAR':'03','APR':'04','MAY':'05','JUN':'06','JUL':'07','AUG':'08','SEP':'09','OCT':'10','NOV':'11','DEC':'12'}
    return [f"{y}-{m[mon]}-{d}" for d, mon, y in (x.split('-') for x in dates)]`
  },
  {
    number: 34,
    title: 'Discount Coupon Stack Eligibility',
    fnName: 'maxFinalCartSavings',
    description: 'A retail checkout allows applying at most TWO non-stackable percentage coupons OR one flat-amount coupon on an order of <code>subtotal</code>. Given percentage coupons <code>pctCoupons</code> (each applies sequentially to the remaining price, integer floor) and flat coupons <code>flatCoupons</code>, return the maximum total discount achievable.',
    constraints: ['1 <= subtotal <= 10^6', '0 <= pctCoupons.length, flatCoupons.length <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'subtotal = 1000, pctCoupons = [10, 20], flatCoupons = [250]', output: '280' },
      { title: 'Test Case 2', input: 'subtotal = 500, pctCoupons = [10], flatCoupons = [120]', output: '120' },
      { title: 'Test Case 3', input: 'subtotal = 200, pctCoupons = [50, 50], flatCoupons = [160]', output: '160' },
      { title: 'Test Case 4', input: 'subtotal = 100, pctCoupons = [], flatCoupons = [150]', output: '100' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxFinalCartSavings(int subtotal, int[] pctCoupons, int[] flatCoupons) {
        int best = 0;
        for (int f : flatCoupons) best = Math.max(best, Math.min(subtotal, f));
        int[] p = pctCoupons.clone();
        Arrays.sort(p);
        int n = p.length;
        if (n >= 1) best = Math.max(best, subtotal - subtotal * (100 - p[n - 1]) / 100);
        if (n >= 2) {
            int rem = subtotal * (100 - p[n - 1]) / 100;
            rem = rem * (100 - p[n - 2]) / 100;
            best = Math.max(best, subtotal - rem);
        }
        return best;
    }
}`,
    pythonSolution: `def maxFinalCartSavings(subtotal, pctCoupons, flatCoupons):
    best = max([min(subtotal, f) for f in flatCoupons], default=0)
    p = sorted(pctCoupons, reverse=True)
    if len(p) >= 1:
        best = max(best, subtotal - (subtotal * (100 - p[0]) // 100))
    if len(p) >= 2:
        rem = (subtotal * (100 - p[0]) // 100) * (100 - p[1]) // 100
        best = max(best, subtotal - rem)
    return best`
  },
  {
    number: 35,
    title: 'Shift Handover Idle Gap Finder',
    fnName: 'longestIdleGap',
    description: 'Given unsorted shift intervals <code>shifts</code> <code>[start, end]</code> within a 24-hour window, merge overlapping shifts and return the duration of the longest continuous unstaffed gap strictly between the earliest shift start and latest shift end (0 if none).',
    constraints: ['1 <= shifts.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'shifts = [[1, 4], [6, 9], [12, 15]]', output: '3' },
      { title: 'Test Case 2', input: 'shifts = [[1, 5], [3, 8], [8, 12]]', output: '0' },
      { title: 'Test Case 3', input: 'shifts = [[10, 20]]', output: '0' },
      { title: 'Test Case 4', input: 'shifts = [[2, 5], [10, 12], [4, 7]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestIdleGap(int[][] shifts) {
        Arrays.sort(shifts, (a, b) -> Integer.compare(a[0], b[0]));
        int curEnd = shifts[0][1], bestGap = 0;
        for (int i = 1; i < shifts.length; i++) {
            if (shifts[i][0] > curEnd) bestGap = Math.max(bestGap, shifts[i][0] - curEnd);
            curEnd = Math.max(curEnd, shifts[i][1]);
        }
        return bestGap;
    }
}`,
    pythonSolution: `def longestIdleGap(shifts):
    s = sorted(shifts)
    cur_end, best = s[0][1], 0
    for a, b in s[1:]:
        if a > cur_end: best = max(best, a - cur_end)
        cur_end = max(cur_end, b)
    return best`
  },
  {
    number: 36,
    title: 'Conveyor Belt Weight Split Balance',
    fnName: 'minWeightImbalance',
    description: 'Parcels on a conveyor belt have weights <code>weights</code> in order. You must split the belt at a single point <code>i</code> (<code>1 &lt;= i &lt; n</code>) into a non-empty left section and non-empty right section. Return the minimum possible absolute difference between the two section weights.',
    constraints: ['2 <= weights.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [3, 1, 2, 4, 3]', output: '1' },
      { title: 'Test Case 2', input: 'weights = [10, 10]', output: '0' },
      { title: 'Test Case 3', input: 'weights = [1, 2, 3, 6]', output: '0' },
      { title: 'Test Case 4', input: 'weights = [100, 1]', output: '99' }
    ],
    javaSolution: `public class Solution {
    public static long minWeightImbalance(int[] weights) {
        long total = 0; for (int w : weights) total += w;
        long left = 0, best = Long.MAX_VALUE;
        for (int i = 0; i < weights.length - 1; i++) {
            left += weights[i];
            best = Math.min(best, Math.abs(total - 2 * left));
        }
        return best;
    }
}`,
    pythonSolution: `def minWeightImbalance(weights):
    total = sum(weights)
    left, best = 0, float('inf')
    for w in weights[:-1]:
        left += w
        best = min(best, abs(total - 2 * left))
    return best`
  },
  {
    number: 37,
    title: 'Duplicate SKU Canonicalizer',
    fnName: 'countDistinctCanonicalSkus',
    description: 'Product SKUs arrive with hyphens, spaces, and mixed case (e.g. <code>"ab-12 c"</code> and <code>"AB12C"</code>). Strip all spaces and hyphens and convert to uppercase. Return the number of unique canonical SKUs.',
    constraints: ['1 <= skus.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'skus = ["ab-12 c", "AB12C", "xy-99"]', output: '2' },
      { title: 'Test Case 2', input: 'skus = ["A-B", "a b", "ab"]', output: '1' },
      { title: 'Test Case 3', input: 'skus = ["SKU1", "SKU2", "SKU3"]', output: '3' },
      { title: 'Test Case 4', input: 'skus = ["---"]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDistinctCanonicalSkus(String[] skus) {
        Set<String> set = new HashSet<>();
        for (String s : skus) set.add(s.replace("-", "").replace(" ", "").toUpperCase());
        return set.size();
    }
}`,
    pythonSolution: `def countDistinctCanonicalSkus(skus):
    return len({s.replace('-', '').replace(' ', '').upper() for s in skus})`
  },
  {
    number: 38,
    title: 'Express Lane Checkout Queue Time',
    fnName: 'totalCheckoutTime',
    description: 'A store has <code>k</code> identical self-checkout kiosks. Customers arrive in order with item counts <code>items</code> (1 second per item). Each customer goes to the kiosk that becomes free earliest. Return the total time until the last customer finishes.',
    constraints: ['1 <= k <= 100', '1 <= items.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'items = [5, 3, 4], k = 2', output: '7' },
      { title: 'Test Case 2', input: 'items = [10, 2, 3, 3], k = 2', output: '10' },
      { title: 'Test Case 3', input: 'items = [2, 3, 10], k = 2', output: '12' },
      { title: 'Test Case 4', input: 'items = [5, 5, 5], k = 5', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long totalCheckoutTime(int[] items, int k) {
        PriorityQueue<Long> pq = new PriorityQueue<>();
        for (int i = 0; i < k; i++) pq.add(0L);
        long maxT = 0;
        for (int it : items) {
            long t = pq.poll() + it;
            maxT = Math.max(maxT, t);
            pq.add(t);
        }
        return maxT;
    }
}`,
    pythonSolution: `def totalCheckoutTime(items, k):
    import heapq
    h = [0] * k
    for it in items:
        t = heapq.heappop(h) + it
        heapq.heappush(h, t)
    return max(h)`
  },
  {
    number: 39,
    title: 'Pallet Stacking Height Limit',
    fnName: 'minPalletStacks',
    description: 'Given box weights <code>boxes</code>, you can stack boxes in any order as long as each stack has total weight <code>&lt;= maxLoad</code> and at most <code>3</code> boxes. Actually, simpler rule: pack boxes in the given order onto the current pallet until adding the next box exceeds <code>maxLoad</code>, then start a new pallet. Return total pallets used.',
    constraints: ['1 <= boxes.length <= 10^5', '1 <= boxes[i] <= maxLoad'],
    testCases: [
      { title: 'Test Case 1', input: 'boxes = [40, 30, 50, 20, 60], maxLoad = 80', output: '3' },
      { title: 'Test Case 2', input: 'boxes = [10, 10, 10, 10], maxLoad = 40', output: '1' },
      { title: 'Test Case 3', input: 'boxes = [50, 50, 50], maxLoad = 50', output: '3' },
      { title: 'Test Case 4', input: 'boxes = [25], maxLoad = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minPalletStacks(int[] boxes, int maxLoad) {
        int pallets = 1, cur = 0;
        for (int b : boxes) {
            if (cur + b > maxLoad) { pallets++; cur = b; }
            else cur += b;
        }
        return pallets;
    }
}`,
    pythonSolution: `def minPalletStacks(boxes, maxLoad):
    pallets, cur = 1, 0
    for b in boxes:
        if cur + b > maxLoad: pallets += 1; cur = b
        else: cur += b
    return pallets`
  },
  {
    number: 40,
    title: 'Promo Code Expiry Window Count',
    fnName: 'countActivePromos',
    description: 'Given promo active intervals <code>promos</code> <code>[startDay, endDay]</code> and query days <code>queries</code>, return an array where each element is the number of promos active on that query day.',
    constraints: ['1 <= promos.length, queries.length <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'promos = [[1, 5], [3, 8], [6, 10]], queries = [4, 7, 11]', output: '[2, 2, 0]' },
      { title: 'Test Case 2', input: 'promos = [[2, 2]], queries = [1, 2, 3]', output: '[0, 1, 0]' },
      { title: 'Test Case 3', input: 'promos = [[1, 10], [1, 10]], queries = [5]', output: '[2]' },
      { title: 'Test Case 4', input: 'promos = [[5, 6]], queries = [5, 6]', output: '[1, 1]' }
    ],
    javaSolution: `public class Solution {
    public static int[] countActivePromos(int[][] promos, int[] queries) {
        int[] res = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int q = queries[i], cnt = 0;
            for (int[] p : promos) if (p[0] <= q && q <= p[1]) cnt++;
            res[i] = cnt;
        }
        return res;
    }
}`,
    pythonSolution: `def countActivePromos(promos, queries):
    return [sum(1 for s, e in promos if s <= q <= e) for q in queries]`
  },
  {
    number: 41,
    title: 'Invoice Line-Item Rounding Drift',
    fnName: 'roundingDriftPaise',
    description: 'Given item prices in paise <code>paise</code>, each item is rounded individually to the nearest 100 paise (half-up: <code>(x + 50) // 100 * 100</code>). Return the absolute difference between the sum of individually rounded items and the rounded sum of all items.',
    constraints: ['1 <= paise.length <= 10^5', '0 <= paise[i] <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'paise = [140, 140, 140]', output: '100' },
      { title: 'Test Case 2', input: 'paise = [150, 150]', output: '100' },
      { title: 'Test Case 3', input: 'paise = [100, 200, 300]', output: '0' },
      { title: 'Test Case 4', input: 'paise = [49, 49]', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static long roundingDriftPaise(int[] paise) {
        long sumInd = 0, sumAll = 0;
        for (int x : paise) { sumInd += ((x + 50L) / 100) * 100; sumAll += x; }
        long roundedAll = ((sumAll + 50L) / 100) * 100;
        return Math.abs(sumInd - roundedAll);
    }
}`,
    pythonSolution: `def roundingDriftPaise(paise):
    sum_ind = sum(((x + 50) // 100) * 100 for x in paise)
    rounded_all = ((sum(paise) + 50) // 100) * 100
    return abs(sum_ind - rounded_all)`
  },
  {
    number: 42,
    title: 'Regional Hub Relay Hops',
    fnName: 'minRelayHops',
    description: 'Given <code>n</code> hubs (0..n-1) and bidirectional links <code>links</code>, return the minimum number of hops from hub <code>src</code> to hub <code>dst</code>, or <code>-1</code> if unreachable.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, links = [[0,1],[1,2],[2,3],[0,4],[4,3]], src = 0, dst = 3', output: '2' },
      { title: 'Test Case 2', input: 'n = 4, links = [[0,1],[2,3]], src = 0, dst = 3', output: '-1' },
      { title: 'Test Case 3', input: 'n = 3, links = [[0,1]], src = 0, dst = 0', output: '0' },
      { title: 'Test Case 4', input: 'n = 4, links = [[0,1],[1,2],[2,3]], src = 0, dst = 3', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minRelayHops(int n, int[][] links, int src, int dst) {
        if (src == dst) return 0;
        List<List<Integer>> g = new ArrayList<>(); for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : links) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        int[] dist = new int[n]; Arrays.fill(dist, -1); dist[src] = 0;
        Deque<Integer> q = new ArrayDeque<>(); q.add(src);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g.get(u)) if (dist[v] == -1) { dist[v] = dist[u] + 1; if (v == dst) return dist[v]; q.add(v); }
        }
        return -1;
    }
}`,
    pythonSolution: `def minRelayHops(n, links, src, dst):
    from collections import deque
    if src == dst: return 0
    g = [[] for _ in range(n)]
    for u, v in links: g[u].append(v); g[v].append(u)
    dist = [-1]*n; dist[src] = 0; q = deque([src])
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
    number: 43,
    title: 'Stock Replenishment Reorder Point',
    fnName: 'countLowStockItems',
    description: 'An inventory system tracks current stock <code>stock</code>, daily burn rate <code>burn</code>, and supplier lead time <code>leadDays</code>. An item must be reordered if <code>stock[i] &lt;= burn[i] * leadDays[i]</code>. Return the count of items needing reorder.',
    constraints: ['1 <= stock.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'stock = [50, 20, 100], burn = [10, 5, 10], leadDays = [5, 3, 12]', output: '2' },
      { title: 'Test Case 2', input: 'stock = [100, 200], burn = [5, 10], leadDays = [2, 5]', output: '0' },
      { title: 'Test Case 3', input: 'stock = [0], burn = [1], leadDays = [1]', output: '1' },
      { title: 'Test Case 4', input: 'stock = [15, 16], burn = [5, 5], leadDays = [3, 3]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countLowStockItems(int[] stock, int[] burn, int[] leadDays) {
        int cnt = 0;
        for (int i = 0; i < stock.length; i++) if ((long) stock[i] <= (long) burn[i] * leadDays[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countLowStockItems(stock, burn, leadDays):
    return sum(1 for s, b, l in zip(stock, burn, leadDays) if s <= b * l)`
  },
  {
    number: 44,
    title: 'Packaging Box Volume Fit',
    fnName: 'countFittingCartons',
    description: 'Given a product box of dimensions <code>[w, h, d]</code> (can be rotated orthogonally) and an array of shipping cartons <code>cartons</code> where each is <code>[W, H, D]</code>, return how many cartons can strictly fit the product inside (sorted dimensions of product &lt;= sorted dimensions of carton).',
    constraints: ['1 <= cartons.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'box = [10, 20, 5], cartons = [[25, 10, 5], [15, 15, 15], [20, 10, 4]]', output: '1' },
      { title: 'Test Case 2', input: 'box = [2, 3, 4], cartons = [[4, 3, 2], [5, 5, 5]]', output: '2' },
      { title: 'Test Case 3', input: 'box = [10, 10, 10], cartons = [[9, 10, 10]]', output: '0' },
      { title: 'Test Case 4', input: 'box = [1, 1, 1], cartons = [[1, 1, 1]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countFittingCartons(int[] box, int[][] cartons) {
        int[] b = box.clone(); Arrays.sort(b);
        int cnt = 0;
        for (int[] c : cartons) {
            int[] s = c.clone(); Arrays.sort(s);
            if (b[0] <= s[0] && b[1] <= s[1] && b[2] <= s[2]) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countFittingCartons(box, cartons):
    sb = sorted(box)
    return sum(1 for c in cartons if all(x <= y for x, y in zip(sb, sorted(c))))`
  },
  {
    number: 45,
    title: 'Store Footfall Peak Hour',
    fnName: 'peakFootfallHour',
    description: 'Given visitor entry/exit logs <code>visits</code> <code>[entryHour, exitHour]</code> (half-open <code>[entryHour, exitHour)</code>, hours 0..23), return the hour with the maximum concurrent visitors (break ties by earliest hour).',
    constraints: ['1 <= visits.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'visits = [[9, 12], [10, 14], [11, 13]]', output: '11' },
      { title: 'Test Case 2', input: 'visits = [[8, 10], [10, 12]]', output: '8' },
      { title: 'Test Case 3', input: 'visits = [[15, 18]]', output: '15' },
      { title: 'Test Case 4', input: 'visits = [[0, 24], [5, 10], [5, 8]]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int peakFootfallHour(int[][] visits) {
        int[] diff = new int[25];
        for (int[] v : visits) { diff[v[0]]++; diff[v[1]]--; }
        int cur = 0, bestH = 0, bestC = -1;
        for (int h = 0; h < 24; h++) {
            cur += diff[h];
            if (cur > bestC) { bestC = cur; bestH = h; }
        }
        return bestH;
    }
}`,
    pythonSolution: `def peakFootfallHour(visits):
    diff = [0] * 25
    for a, b in visits: diff[a] += 1; diff[b] -= 1
    cur = best_h = 0; best_c = -1
    for h in range(24):
        cur += diff[h]
        if cur > best_c: best_c, best_h = cur, h
    return best_h`
  },
  {
    number: 46,
    title: 'Loyalty Tier Upgrade Streak',
    fnName: 'longestQualifyingStreak',
    description: 'A customer earns a Gold-tier streak if their monthly spend <code>spends[i] &gt;= minSpend</code>. Return the longest consecutive months meeting <code>minSpend</code>.',
    constraints: ['1 <= spends.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'spends = [100, 250, 300, 150, 200, 220, 240], minSpend = 200', output: '3' },
      { title: 'Test Case 2', input: 'spends = [50, 60, 70], minSpend = 100', output: '0' },
      { title: 'Test Case 3', input: 'spends = [500, 500], minSpend = 500', output: '2' },
      { title: 'Test Case 4', input: 'spends = [300], minSpend = 100', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestQualifyingStreak(int[] spends, int minSpend) {
        int cur = 0, best = 0;
        for (int s : spends) { if (s >= minSpend) { cur++; best = Math.max(best, cur); } else cur = 0; }
        return best;
    }
}`,
    pythonSolution: `def longestQualifyingStreak(spends, minSpend):
    cur = best = 0
    for s in spends:
        cur = cur + 1 if s >= minSpend else 0
        if cur > best: best = cur
    return best`
  },
  {
    number: 47,
    title: 'Freight Surcharge Tier Calculator',
    fnName: 'totalFreightCharge',
    description: 'Shipping rates per kg are: first 5 kg at 10/kg, next 15 kg (6..20) at 8/kg, above 20 kg at 6/kg. Given an array of parcel weights <code>weights</code>, return the sum of shipping charges for all parcels.',
    constraints: ['1 <= weights.length <= 10^4', '0 <= weights[i] <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [3, 10, 25]', output: '320' },
      { title: 'Test Case 2', input: 'weights = [5]', output: '50' },
      { title: 'Test Case 3', input: 'weights = [20]', output: '170' },
      { title: 'Test Case 4', input: 'weights = [0, 1]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long totalFreightCharge(int[] weights) {
        long total = 0;
        for (int w : weights) {
            if (w <= 5) total += w * 10L;
            else if (w <= 20) total += 50L + (w - 5) * 8L;
            else total += 50L + 120L + (w - 20) * 6L;
        }
        return total;
    }
}`,
    pythonSolution: `def totalFreightCharge(weights):
    total = 0
    for w in weights:
        if w <= 5: total += w * 10
        elif w <= 20: total += 50 + (w - 5) * 8
        else: total += 170 + (w - 20) * 6
    return total`
  },
  {
    number: 48,
    title: 'Return-Policy Grace Window',
    fnName: 'countEligibleReturns',
    description: 'Given purchase days <code>buyDay</code>, return request days <code>retDay</code>, and <code>graceDays</code>, a return is eligible if <code>0 &lt;= retDay[i] - buyDay[i] &lt;= graceDays</code>. Return the count of eligible returns.',
    constraints: ['1 <= buyDay.length == retDay.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'buyDay = [1, 10, 20], retDay = [5, 25, 20], graceDays = 7', output: '2' },
      { title: 'Test Case 2', input: 'buyDay = [10], retDay = [9], graceDays = 5', output: '0' },
      { title: 'Test Case 3', input: 'buyDay = [1, 2], retDay = [8, 9], graceDays = 7', output: '2' },
      { title: 'Test Case 4', input: 'buyDay = [5], retDay = [10], graceDays = 3', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countEligibleReturns(int[] buyDay, int[] retDay, int graceDays) {
        int cnt = 0;
        for (int i = 0; i < buyDay.length; i++) {
            int d = retDay[i] - buyDay[i];
            if (d >= 0 && d <= graceDays) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countEligibleReturns(buyDay, retDay, graceDays):
    return sum(1 for b, r in zip(buyDay, retDay) if 0 <= r - b <= graceDays)`
  },
  {
    number: 49,
    title: 'Shelf Space Contiguous Allocation',
    fnName: 'firstFitShelfSlot',
    description: 'A retail shelf has <code>n</code> slots represented by binary array <code>occupied</code> (0 = free, 1 = used). Find the smallest starting index where <code>k</code> consecutive free slots exist, or <code>-1</code>.',
    constraints: ['1 <= k <= occupied.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'occupied = [1, 0, 0, 1, 0, 0, 0], k = 3', output: '4' },
      { title: 'Test Case 2', input: 'occupied = [0, 0, 1, 0, 0], k = 2', output: '0' },
      { title: 'Test Case 3', input: 'occupied = [1, 0, 1, 0], k = 2', output: '-1' },
      { title: 'Test Case 4', input: 'occupied = [0], k = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int firstFitShelfSlot(int[] occupied, int k) {
        int run = 0;
        for (int i = 0; i < occupied.length; i++) {
            if (occupied[i] == 0) { if (++run == k) return i - k + 1; }
            else run = 0;
        }
        return -1;
    }
}`,
    pythonSolution: `def firstFitShelfSlot(occupied, k):
    run = 0
    for i, x in enumerate(occupied):
        if x == 0:
            run += 1
            if run == k: return i - k + 1
        else:
            run = 0
    return -1`
  },
  {
    number: 50,
    title: 'Batch Job Dependency Chain Depth',
    fnName: 'longestJobChainDepth',
    description: 'Given <code>n</code> batch jobs (0..n-1) in a DAG with dependency edges <code>deps</code> <code>[u, v]</code> (<code>u</code> runs before <code>v</code>), return the length (number of jobs) in the longest dependency chain.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, deps = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 4]]', output: '4' },
      { title: 'Test Case 2', input: 'n = 3, deps = []', output: '1' },
      { title: 'Test Case 3', input: 'n = 4, deps = [[0, 1], [1, 2], [2, 3]]', output: '4' },
      { title: 'Test Case 4', input: 'n = 3, deps = [[0, 1], [0, 2]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestJobChainDepth(int n, int[][] deps) {
        List<List<Integer>> g = new ArrayList<>(); for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        int[] ind = new int[n], dp = new int[n];
        Arrays.fill(dp, 1);
        for (int[] d : deps) { g.get(d[0]).add(d[1]); ind[d[1]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (ind[i] == 0) q.add(i);
        int best = 1;
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
    pythonSolution: `def longestJobChainDepth(n, deps):
    from collections import deque
    g = [[] for _ in range(n)]; ind = [0]*n; dp = [1]*n
    for u, v in deps: g[u].append(v); ind[v] += 1
    q = deque(i for i in range(n) if ind[i] == 0)
    while q:
        u = q.popleft()
        for v in g[u]:
            dp[v] = max(dp[v], dp[u] + 1)
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return max(dp)`
  }
];
