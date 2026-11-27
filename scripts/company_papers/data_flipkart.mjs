export const FLIPKART_QUESTIONS = [
  {
    number: 1,
    title: 'Cart Free-Shipping Threshold Check',
    fnName: 'minExtraForFreeShipping',
    description: 'On Flipkart, free shipping applies when cart total is at least <code>threshold</code>. Given item prices <code>prices</code> and item quantities <code>qtys</code>, return the minimum additional amount needed for free shipping (<code>0</code> if already eligible).',
    constraints: ['1 <= prices.length == qtys.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [199, 120], qtys = [1, 2], threshold = 499', output: '60' },
      { title: 'Test Case 2', input: 'prices = [300, 250], qtys = [1, 1], threshold = 499', output: '0' },
      { title: 'Test Case 3', input: 'prices = [100], qtys = [5], threshold = 500', output: '0' },
      { title: 'Test Case 4', input: 'prices = [50, 50], qtys = [1, 1], threshold = 250', output: '150' }
    ],
    javaSolution: `public class Solution {
    public static long minExtraForFreeShipping(int[] prices, int[] qtys, long threshold) {
        long sum = 0;
        for (int i = 0; i < prices.length; i++) sum += (long) prices[i] * qtys[i];
        return Math.max(0L, threshold - sum);
    }
}`,
    pythonSolution: `def minExtraForFreeShipping(prices, qtys, threshold):
    return max(0, threshold - sum(p * q for p, q in zip(prices, qtys)))`
  },
  {
    number: 2,
    title: 'Warehouse Picker Shortest Aisle Path',
    fnName: 'minWarehouseSteps',
    description: 'In a Flipkart fulfillment center grid <code>grid</code> (<code>0</code> = walkable aisle, <code>1</code> = rack), a picker starts at <code>(0, 0)</code> and must reach <code>(R-1, C-1)</code> moving 4-directionally. Return the minimum number of steps, or <code>-1</code> if unreachable.',
    constraints: ['1 <= grid.length, grid[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 0, 1], [1, 0, 0], [0, 0, 0]]', output: '4' },
      { title: 'Test Case 2', input: 'grid = [[0, 1], [1, 0]]', output: '-1' },
      { title: 'Test Case 3', input: 'grid = [[0]]', output: '0' },
      { title: 'Test Case 4', input: 'grid = [[1, 0], [0, 0]]', output: '-1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minWarehouseSteps(int[][] grid) {
        int R = grid.length, C = grid[0].length;
        if (grid[0][0] == 1 || grid[R - 1][C - 1] == 1) return -1;
        if (R == 1 && C == 1) return 0;
        boolean[][] vis = new boolean[R][C];
        Queue<int[]> q = new ArrayDeque<>();
        vis[0][0] = true; q.add(new int[]{0, 0, 0});
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && !vis[nr][nc] && grid[nr][nc] == 0) {
                    if (nr == R - 1 && nc == C - 1) return cur[2] + 1;
                    vis[nr][nc] = true; q.add(new int[]{nr, nc, cur[2] + 1});
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque
def minWarehouseSteps(grid):
    R, C = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[R-1][C-1] == 1: return -1
    if R == 1 and C == 1: return 0
    vis = {(0, 0)}; q = deque([(0, 0, 0)])
    while q:
        r, c, d = q.popleft()
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in vis and grid[nr][nc] == 0:
                if nr == R - 1 and nc == C - 1: return d + 1
                vis.add((nr, nc)); q.append((nr, nc, d + 1))
    return -1`
  },
  {
    number: 3,
    title: 'Big Billion Days Flash Sale Queue',
    fnName: 'countFulfilledOrders',
    description: 'A flash-sale SKU has <code>stock</code> units. Orders arrive with requested quantities <code>orders</code> (processed FIFO). Each order is fulfilled only if remaining stock <code>&gt;= qty</code> (partial fulfillment is not allowed). Return how many orders are fulfilled.',
    constraints: ['1 <= orders.length <= 10^5', '0 <= stock <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'orders = [4, 7, 3, 2], stock = 10', output: '3' },
      { title: 'Test Case 2', input: 'orders = [5, 5, 5], stock = 10', output: '2' },
      { title: 'Test Case 3', input: 'orders = [10, 1], stock = 5', output: '1' },
      { title: 'Test Case 4', input: 'orders = [1, 2, 3], stock = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countFulfilledOrders(int[] orders, long stock) {
        int ok = 0;
        for (int q : orders) {
            if (stock >= q) { stock -= q; ok++; }
        }
        return ok;
    }
}`,
    pythonSolution: `def countFulfilledOrders(orders, stock):
    ok = 0
    for q in orders:
        if stock >= q: stock -= q; ok += 1
    return ok`
  },
  {
    number: 4,
    title: 'Delivery Van Greedy Slot Scheduling',
    fnName: 'maxNonOverlappingDeliveries',
    description: 'A Flipkart Ekart rider receives delivery windows <code>slots</code> <code>[start, end]</code>. A rider can complete one delivery at a time (<code>end1 <= start2</code> allowed). Return the maximum number of deliveries the rider can complete.',
    constraints: ['1 <= slots.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'slots = [[1, 4], [2, 3], [3, 5], [0, 6]]', output: '2' },
      { title: 'Test Case 2', input: 'slots = [[1, 2], [2, 3], [3, 4]]', output: '3' },
      { title: 'Test Case 3', input: 'slots = [[1, 10], [2, 9]]', output: '1' },
      { title: 'Test Case 4', input: 'slots = [[5, 8]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxNonOverlappingDeliveries(int[][] slots) {
        Arrays.sort(slots, (a, b) -> Integer.compare(a[1], b[1]));
        int cnt = 0, lastEnd = Integer.MIN_VALUE;
        for (int[] s : slots) {
            if (s[0] >= lastEnd) { cnt++; lastEnd = s[1]; }
        }
        return cnt;
    }
}`,
    pythonSolution: `def maxNonOverlappingDeliveries(slots):
    slots.sort(key=lambda x: x[1])
    cnt, last_end = 0, float('-inf')
    for s, e in slots:
        if s >= last_end: cnt += 1; last_end = e
    return cnt`
  },
  {
    number: 5,
    title: 'Combo Offer Bundle Savings',
    fnName: 'minCheckoutWithCombo',
    description: 'Given item prices <code>prices</code> and a "Buy 2 Get the Cheaper 1 Free" promotion applied after sorting prices in descending order and pairing consecutive items <code>(0,1), (2,3), ...</code>, return the minimum total amount payable.',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [100, 400, 200, 300]', output: '600' },
      { title: 'Test Case 2', input: 'prices = [50, 100, 200]', output: '250' },
      { title: 'Test Case 3', input: 'prices = [99]', output: '99' },
      { title: 'Test Case 4', input: 'prices = [10, 10, 10, 10]', output: '20' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minCheckoutWithCombo(int[] prices) {
        Arrays.sort(prices);
        long total = 0;
        for (int i = prices.length - 1; i >= 0; i -= 2) total += prices[i];
        return total;
    }
}`,
    pythonSolution: `def minCheckoutWithCombo(prices):
    p = sorted(prices, reverse=True)
    return sum(p[0::2])`
  },
  {
    number: 6,
    title: 'Seller Rating Weighted Score',
    fnName: 'countTopRatedSellers',
    description: 'Given seller positive reviews <code>pos[i]</code> and total reviews <code>tot[i]</code>, a seller qualifies for "Flipkart Assured" if <code>tot[i] >= minReviews</code> and <code>pos[i] * 100 >= pct * tot[i]</code>. Count qualifying sellers.',
    constraints: ['1 <= pos.length == tot.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pos = [90, 45, 80], tot = [100, 50, 100], minReviews = 60, pct = 85', output: '1' },
      { title: 'Test Case 2', input: 'pos = [10, 20], tot = [10, 25], minReviews = 10, pct = 80', output: '2' },
      { title: 'Test Case 3', input: 'pos = [5], tot = [10], minReviews = 20, pct = 50', output: '0' },
      { title: 'Test Case 4', input: 'pos = [85], tot = [100], minReviews = 100, pct = 85', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countTopRatedSellers(int[] pos, int[] tot, int minReviews, int pct) {
        int cnt = 0;
        for (int i = 0; i < pos.length; i++) {
            if (tot[i] >= minReviews && (long) pos[i] * 100 >= (long) pct * tot[i]) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countTopRatedSellers(pos, tot, minReviews, pct):
    return sum(1 for p, t in zip(pos, tot) if t >= minReviews and p * 100 >= pct * t)`
  },
  {
    number: 7,
    title: 'Hub-to-Hub Parcel Relay Hops',
    fnName: 'minRelayHops',
    description: 'Given <code>n</code> logistics hubs (0..n-1) and undirected routes <code>routes</code> <code>[u, v]</code>, return the minimum number of hops from hub <code>src</code> to hub <code>dst</code>, or <code>-1</code> if unreachable.',
    constraints: ['1 <= n <= 10^4', '0 <= routes.length <= 5 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, routes = [[0, 1], [1, 2], [2, 4], [0, 3], [3, 4]], src = 0, dst = 4', output: '2' },
      { title: 'Test Case 2', input: 'n = 4, routes = [[0, 1], [2, 3]], src = 0, dst = 3', output: '-1' },
      { title: 'Test Case 3', input: 'n = 3, routes = [[0, 1]], src = 1, dst = 1', output: '0' },
      { title: 'Test Case 4', input: 'n = 2, routes = [[0, 1]], src = 0, dst = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minRelayHops(int n, int[][] routes, int src, int dst) {
        if (src == dst) return 0;
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] r : routes) { g.get(r[0]).add(r[1]); g.get(r[1]).add(r[0]); }
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        Queue<Integer> q = new ArrayDeque<>();
        dist[src] = 0; q.add(src);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g.get(u)) if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                if (v == dst) return dist[v];
                q.add(v);
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque
def minRelayHops(n, routes, src, dst):
    if src == dst: return 0
    g = [[] for _ in range(n)]
    for u, v in routes: g[u].append(v); g[v].append(u)
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
    number: 8,
    title: 'SuperCoin Cashback DP Maximum',
    fnName: 'maxSuperCoinReward',
    description: 'A shopper has a budget <code>budget</code> and can pick at most one copy of each item <code>i</code> with cost <code>cost[i]</code> and SuperCoin reward <code>coins[i]</code>. Return the maximum SuperCoins earnable.',
    constraints: ['1 <= cost.length <= 200', '0 <= budget <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'cost = [10, 20, 30], coins = [60, 100, 120], budget = 50', output: '220' },
      { title: 'Test Case 2', input: 'cost = [15, 25], coins = [10, 20], budget = 10', output: '0' },
      { title: 'Test Case 3', input: 'cost = [5, 5, 5], coins = [10, 20, 30], budget = 10', output: '50' },
      { title: 'Test Case 4', input: 'cost = [4], coins = [9], budget = 4', output: '9' }
    ],
    javaSolution: `public class Solution {
    public static int maxSuperCoinReward(int[] cost, int[] coins, int budget) {
        int[] dp = new int[budget + 1];
        for (int i = 0; i < cost.length; i++) {
            for (int b = budget; b >= cost[i]; b--) {
                dp[b] = Math.max(dp[b], dp[b - cost[i]] + coins[i]);
            }
        }
        return dp[budget];
    }
}`,
    pythonSolution: `def maxSuperCoinReward(cost, coins, budget):
    dp = [0] * (budget + 1)
    for c, v in zip(cost, coins):
        for b in range(budget, c - 1, -1):
            if dp[b - c] + v > dp[b]: dp[b] = dp[b - c] + v
    return dp[budget]`
  },
  {
    number: 9,
    title: 'Delivery Crate Weight Balancing',
    fnName: 'minDeliveryTrips',
    description: 'Packages with weights <code>weights</code> must be shipped in vans of capacity <code>cap</code>. At most 2 packages fit per van. Return the minimum number of vans needed.',
    constraints: ['1 <= weights.length <= 10^5', 'max(weights) <= cap <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [3, 2, 2, 1], cap = 3', output: '3' },
      { title: 'Test Case 2', input: 'weights = [3, 5, 3, 4], cap = 5', output: '4' },
      { title: 'Test Case 3', input: 'weights = [1, 2], cap = 3', output: '1' },
      { title: 'Test Case 4', input: 'weights = [4], cap = 4', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minDeliveryTrips(int[] weights, int cap) {
        Arrays.sort(weights);
        int l = 0, r = weights.length - 1, vans = 0;
        while (l <= r) {
            if (l < r && weights[l] + weights[r] <= cap) l++;
            r--; vans++;
        }
        return vans;
    }
}`,
    pythonSolution: `def minDeliveryTrips(weights, cap):
    weights.sort()
    l, r, vans = 0, len(weights) - 1, 0
    while l <= r:
        if l < r and weights[l] + weights[r] <= cap: l += 1
        r -= 1; vans += 1
    return vans`
  },
  {
    number: 10,
    title: 'Product Search Autocomplete Prefix',
    fnName: 'countCategoryMatches',
    description: 'Given catalog SKUs <code>skus</code> and a search query <code>q</code> (case-insensitive), return how many SKUs contain <code>q</code> as a prefix.',
    constraints: ['1 <= skus.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'skus = ["PhoneCase", "phoneCharger", "LaptopBag"], q = "phone"', output: '2' },
      { title: 'Test Case 2', input: 'skus = ["Watch", "Wallet"], q = "shoe"', output: '0' },
      { title: 'Test Case 3', input: 'skus = ["TV"], q = "tv"', output: '1' },
      { title: 'Test Case 4', input: 'skus = ["a", "b"], q = ""', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countCategoryMatches(String[] skus, String q) {
        String ql = q.toLowerCase();
        int cnt = 0;
        for (String s : skus) if (s.toLowerCase().startsWith(ql)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countCategoryMatches(skus, q):
    ql = q.lower()
    return sum(1 for s in skus if s.lower().startswith(ql))`
  },
  {
    number: 11,
    title: 'Return-Window Abuse Detector',
    fnName: 'countHighReturnUsers',
    description: 'Given customer order logs <code>logs</code> <code>[userId, isReturned]</code> (where <code>isReturned</code> is 1 or 0), count how many distinct users have return rate strictly greater than 50% (i.e. <code>2 * returns > orders</code>).',
    constraints: ['1 <= logs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'logs = [[1, 1], [1, 1], [1, 0], [2, 1], [2, 0], [3, 1]]', output: '2' },
      { title: 'Test Case 2', input: 'logs = [[1, 0], [2, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'logs = [[5, 1], [5, 0]]', output: '0' },
      { title: 'Test Case 4', input: 'logs = [[7, 1]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countHighReturnUsers(int[][] logs) {
        Map<Integer, int[]> stats = new HashMap<>();
        for (int[] l : logs) {
            int[] st = stats.computeIfAbsent(l[0], k -> new int[2]);
            st[0] += l[1]; st[1]++;
        }
        int cnt = 0;
        for (int[] st : stats.values()) if (2L * st[0] > st[1]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `from collections import defaultdict
def countHighReturnUsers(logs):
    tot, ret = defaultdict(int), defaultdict(int)
    for u, r in logs:
        tot[u] += 1; ret[u] += r
    return sum(1 for u in tot if 2 * ret[u] > tot[u])`
  },
  {
    number: 12,
    title: 'Warehouse Shelf Restock Minimum',
    fnName: 'minRestockUnits',
    description: 'Each shelf <code>i</code> currently holds <code>stock[i]</code> units and needs at least <code>minTarget[i]</code> units. Return total units needed to restock all under-stocked shelves.',
    constraints: ['1 <= stock.length == minTarget.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'stock = [5, 12, 3], minTarget = [10, 10, 8]', output: '10' },
      { title: 'Test Case 2', input: 'stock = [20, 30], minTarget = [10, 20]', output: '0' },
      { title: 'Test Case 3', input: 'stock = [0], minTarget = [7]', output: '7' },
      { title: 'Test Case 4', input: 'stock = [4, 4], minTarget = [4, 4]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minRestockUnits(int[] stock, int[] minTarget) {
        long need = 0;
        for (int i = 0; i < stock.length; i++) if (stock[i] < minTarget[i]) need += minTarget[i] - stock[i];
        return need;
    }
}`,
    pythonSolution: `def minRestockUnits(stock, minTarget):
    return sum(max(0, t - s) for s, t in zip(stock, minTarget))`
  },
  {
    number: 13,
    title: 'Coupon Stack Discount Optimizer',
    fnName: 'finalPriceAfterBestCoupon',
    description: 'Given cart total <code>total</code> and coupons <code>[minSpend, flatOff]</code> (at most one coupon may be applied), return the minimum payable amount.',
    constraints: ['0 <= coupons.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'total = 1000, coupons = [[500, 100], [1200, 300], [800, 150]]', output: '850' },
      { title: 'Test Case 2', input: 'total = 400, coupons = [[500, 100]]', output: '400' },
      { title: 'Test Case 3', input: 'total = 200, coupons = [[100, 250]]', output: '0' },
      { title: 'Test Case 4', input: 'total = 500, coupons = []', output: '500' }
    ],
    javaSolution: `public class Solution {
    public static long finalPriceAfterBestCoupon(long total, int[][] coupons) {
        long bestOff = 0;
        for (int[] c : coupons) if (total >= c[0]) bestOff = Math.max(bestOff, c[1]);
        return Math.max(0L, total - bestOff);
    }
}`,
    pythonSolution: `def finalPriceAfterBestCoupon(total, coupons):
    best = max((off for mn, off in coupons if total >= mn), default=0)
    return max(0, total - best)`
  },
  {
    number: 14,
    title: 'Peak Traffic Hour Window',
    fnName: 'maxOrdersInKMinutes',
    description: 'Given per-minute order counts <code>orders</code> during a sale and window length <code>k</code>, return the maximum total orders in any <code>k</code> consecutive minutes.',
    constraints: ['1 <= k <= orders.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'orders = [10, 20, 5, 30, 15], k = 2', output: '45' },
      { title: 'Test Case 2', input: 'orders = [1, 2, 3], k = 3', output: '6' },
      { title: 'Test Case 3', input: 'orders = [7, 2, 9], k = 1', output: '9' },
      { title: 'Test Case 4', input: 'orders = [4, 4, 4, 4], k = 2', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static long maxOrdersInKMinutes(int[] orders, int k) {
        long cur = 0;
        for (int i = 0; i < k; i++) cur += orders[i];
        long best = cur;
        for (int i = k; i < orders.length; i++) {
            cur += orders[i] - orders[i - k];
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def maxOrdersInKMinutes(orders, k):
    cur = sum(orders[:k])
    best = cur
    for i in range(k, len(orders)):
        cur += orders[i] - orders[i - k]
        best = max(best, cur)
    return best`
  },
  {
    number: 15,
    title: 'Drone Pad Charging Station',
    fnName: 'canCompleteDeliveryLoop',
    description: 'A delivery drone visits <code>n</code> stations in a circle. At station <code>i</code> it gains <code>charge[i]</code> battery and spending <code>cost[i]</code> to reach <code>(i+1)%n</code>. Return the smallest starting index <code>i</code> to complete the full loop, or <code>-1</code>.',
    constraints: ['1 <= charge.length == cost.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'charge = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]', output: '3' },
      { title: 'Test Case 2', input: 'charge = [2, 3, 4], cost = [3, 4, 3]', output: '-1' },
      { title: 'Test Case 3', input: 'charge = [5], cost = [4]', output: '0' },
      { title: 'Test Case 4', input: 'charge = [3, 1, 2], cost = [2, 2, 2]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int canCompleteDeliveryLoop(int[] charge, int[] cost) {
        long total = 0, tank = 0; int start = 0;
        for (int i = 0; i < charge.length; i++) {
            int diff = charge[i] - cost[i];
            total += diff; tank += diff;
            if (tank < 0) { start = i + 1; tank = 0; }
        }
        return total >= 0 ? start : -1;
    }
}`,
    pythonSolution: `def canCompleteDeliveryLoop(charge, cost):
    total = tank = start = 0
    for i, (g, c) in enumerate(zip(charge, cost)):
        d = g - c; total += d; tank += d
        if tank < 0: start = i + 1; tank = 0
    return start if total >= 0 else -1`
  },
  {
    number: 16,
    title: 'PIN-Code Serviceability Clusters',
    fnName: 'countConnectedZones',
    description: 'Given <code>n</code> delivery zones (0..n-1) and undirected serviceable roads <code>roads</code> <code>[u, v]</code>, return how many disconnected delivery clusters exist.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, roads = [[0, 1], [1, 2], [3, 4]]', output: '2' },
      { title: 'Test Case 2', input: 'n = 3, roads = []', output: '3' },
      { title: 'Test Case 3', input: 'n = 3, roads = [[0, 1], [1, 2]]', output: '1' },
      { title: 'Test Case 4', input: 'n = 1, roads = []', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countConnectedZones(int n, int[][] roads) {
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        int comp = n;
        for (int[] r : roads) {
            int ru = find(p, r[0]), rv = find(p, r[1]);
            if (ru != rv) { p[ru] = rv; comp--; }
        }
        return comp;
    }
    private static int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
}`,
    pythonSolution: `def countConnectedZones(n, roads):
    p = list(range(n))
    def find(x):
        while p[x] != x: p[x] = p[p[x]]; x = p[x]
        return x
    comp = n
    for u, v in roads:
        ru, rv = find(u), find(v)
        if ru != rv: p[ru] = rv; comp -= 1
    return comp`
  },
  {
    number: 17,
    title: 'Cart Item Deduplication Sum',
    fnName: 'sumUniqueSkuTotals',
    description: 'Given scanned SKU IDs <code>skus</code> and prices <code>prices</code> (same SKU always has same price), return the sum of prices of distinct SKUs.',
    constraints: ['1 <= skus.length == prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'skus = [101, 102, 101, 103], prices = [50, 80, 50, 20]', output: '150' },
      { title: 'Test Case 2', input: 'skus = [1, 1, 1], prices = [10, 10, 10]', output: '10' },
      { title: 'Test Case 3', input: 'skus = [5], prices = [99]', output: '99' },
      { title: 'Test Case 4', input: 'skus = [1, 2, 3], prices = [1, 2, 3]', output: '6' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long sumUniqueSkuTotals(int[] skus, int[] prices) {
        Set<Integer> seen = new HashSet<>();
        long sum = 0;
        for (int i = 0; i < skus.length; i++) if (seen.add(skus[i])) sum += prices[i];
        return sum;
    }
}`,
    pythonSolution: `def sumUniqueSkuTotals(skus, prices):
    seen = set(); s = 0
    for sku, p in zip(skus, prices):
        if sku not in seen: seen.add(sku); s += p
    return s`
  },
  {
    number: 18,
    title: 'Express Delivery SLA Violations',
    fnName: 'countLateShipments',
    description: 'Shipments have promised times <code>promised</code> and actual delivery times <code>actual</code>. Count how many shipments arrived strictly after <code>promised</code>.',
    constraints: ['1 <= promised.length == actual.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'promised = [10, 20, 30], actual = [10, 25, 29]', output: '1' },
      { title: 'Test Case 2', input: 'promised = [5, 5], actual = [6, 7]', output: '2' },
      { title: 'Test Case 3', input: 'promised = [100], actual = [50]', output: '0' },
      { title: 'Test Case 4', input: 'promised = [10, 10], actual = [10, 10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countLateShipments(int[] promised, int[] actual) {
        int late = 0;
        for (int i = 0; i < promised.length; i++) if (actual[i] > promised[i]) late++;
        return late;
    }
}`,
    pythonSolution: `def countLateShipments(promised, actual):
    return sum(1 for p, a in zip(promised, actual) if a > p)`
  },
  {
    number: 19,
    title: 'Warehouse Conveyor Belt Sort',
    fnName: 'minSwapsToGroupPriority',
    description: 'A conveyor belt has binary priority flags <code>flags</code> (<code>1</code> = express, <code>0</code> = standard). Count the minimum swaps required to group all <code>1</code>s together anywhere in the array (circular NOT allowed).',
    constraints: ['1 <= flags.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'flags = [1, 0, 1, 0, 1]', output: '1' },
      { title: 'Test Case 2', input: 'flags = [0, 0, 0]', output: '0' },
      { title: 'Test Case 3', input: 'flags = [1, 1, 1]', output: '0' },
      { title: 'Test Case 4', input: 'flags = [1, 0, 0, 0, 1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minSwapsToGroupPriority(int[] flags) {
        int ones = 0;
        for (int f : flags) ones += f;
        if (ones <= 1) return 0;
        int cur = 0;
        for (int i = 0; i < ones; i++) cur += flags[i];
        int maxOnes = cur;
        for (int i = ones; i < flags.length; i++) {
            cur += flags[i] - flags[i - ones];
            maxOnes = Math.max(maxOnes, cur);
        }
        return ones - maxOnes;
    }
}`,
    pythonSolution: `def minSwapsToGroupPriority(flags):
    ones = sum(flags)
    if ones <= 1: return 0
    cur = sum(flags[:ones]); best = cur
    for i in range(ones, len(flags)):
        cur += flags[i] - flags[i - ones]
        best = max(best, cur)
    return ones - best`
  },
  {
    number: 20,
    title: 'Order Tracking Status Monotonicity',
    fnName: 'countOutOfOrderEvents',
    description: 'Order tracking events should have non-decreasing stage codes <code>stages</code>. Count how many transitions violate <code>stages[i] >= stages[i-1]</code>.',
    constraints: ['1 <= stages.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'stages = [1, 2, 4, 3, 5, 2]', output: '2' },
      { title: 'Test Case 2', input: 'stages = [1, 1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'stages = [5, 4, 3, 2, 1]', output: '4' },
      { title: 'Test Case 4', input: 'stages = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countOutOfOrderEvents(int[] stages) {
        int bad = 0;
        for (int i = 1; i < stages.length; i++) if (stages[i] < stages[i - 1]) bad++;
        return bad;
    }
}`,
    pythonSolution: `def countOutOfOrderEvents(stages):
    return sum(1 for i in range(1, len(stages)) if stages[i] < stages[i - 1])`
  },
  {
    number: 21,
    title: 'Packaging Box Volume Fit',
    fnName: 'countFittingItems',
    description: 'Given a shipping box of dimensions <code>[bx, by, bz]</code> and item dimensions <code>items</code> <code>[ix, iy, iz]</code> (items may be rotated along axes), count how many items fit inside the box.',
    constraints: ['1 <= items.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'box = [10, 20, 30], items = [[30, 10, 20], [15, 25, 10], [5, 5, 5]]', output: '3' },
      { title: 'Test Case 2', input: 'box = [5, 5, 5], items = [[6, 1, 1]]', output: '0' },
      { title: 'Test Case 3', input: 'box = [1, 2, 3], items = [[3, 2, 1]]', output: '1' },
      { title: 'Test Case 4', input: 'box = [10, 10, 10], items = [[10, 10, 11]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countFittingItems(int[] box, int[][] items) {
        int[] b = box.clone(); Arrays.sort(b);
        int cnt = 0;
        for (int[] it : items) {
            int[] x = it.clone(); Arrays.sort(x);
            if (x[0] <= b[0] && x[1] <= b[1] && x[2] <= b[2]) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countFittingItems(box, items):
    b = sorted(box)
    return sum(1 for it in items if all(x <= y for x, y in zip(sorted(it), b)))`
  },
  {
    number: 22,
    title: 'DP Minimum Coin Change for COD',
    fnName: 'minNotesForCod',
    description: 'A Cash-on-Delivery rider has infinite denominations <code>coins</code> and needs to give exact change <code>amount</code>. Return the minimum number of notes/coins, or <code>-1</code> if impossible.',
    constraints: ['1 <= coins.length <= 20', '0 <= amount <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'coins = [10, 20, 50], amount = 80', output: '3' },
      { title: 'Test Case 2', input: 'coins = [5, 10], amount = 3', output: '-1' },
      { title: 'Test Case 3', input: 'coins = [1, 5, 10], amount = 0', output: '0' },
      { title: 'Test Case 4', input: 'coins = [2, 3], amount = 7', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minNotesForCod(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int c : coins) {
            for (int a = c; a <= amount; a++) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    pythonSolution: `def minNotesForCod(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for c in coins:
        for a in range(c, amount + 1):
            if dp[a - c] + 1 < dp[a]: dp[a] = dp[a - c] + 1
    return -1 if dp[amount] > amount else dp[amount]`
  },
  {
    number: 23,
    title: 'Trending Search Frequency K',
    fnName: 'countQueriesAtLeastK',
    description: 'Given search query IDs <code>queries</code>, return how many distinct query IDs appeared at least <code>k</code> times.',
    constraints: ['1 <= queries.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'queries = [1, 2, 1, 3, 2, 1], k = 2', output: '2' },
      { title: 'Test Case 2', input: 'queries = [1, 2, 3], k = 2', output: '0' },
      { title: 'Test Case 3', input: 'queries = [5, 5, 5], k = 3', output: '1' },
      { title: 'Test Case 4', input: 'queries = [1], k = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countQueriesAtLeastK(int[] queries, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int q : queries) freq.put(q, freq.getOrDefault(q, 0) + 1);
        int cnt = 0;
        for (int c : freq.values()) if (c >= k) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `from collections import Counter
def countQueriesAtLeastK(queries, k):
    return sum(1 for c in Counter(queries).values() if c >= k)`
  },
  {
    number: 24,
    title: 'Multi-Warehouse Inventory Split',
    fnName: 'minWarehousesToFulfill',
    description: 'Given stock levels of a product across warehouses <code>stocks</code> and an order of size <code>qty</code>, return the minimum number of warehouses needed to fulfill <code>qty</code>, or <code>-1</code> if total stock is insufficient.',
    constraints: ['1 <= stocks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'stocks = [4, 10, 2, 8], qty = 15', output: '2' },
      { title: 'Test Case 2', input: 'stocks = [3, 4], qty = 10', output: '-1' },
      { title: 'Test Case 3', input: 'stocks = [5, 5], qty = 0', output: '0' },
      { title: 'Test Case 4', input: 'stocks = [20], qty = 20', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minWarehousesToFulfill(int[] stocks, long qty) {
        if (qty <= 0) return 0;
        Arrays.sort(stocks);
        long sum = 0; int cnt = 0;
        for (int i = stocks.length - 1; i >= 0; i--) {
            sum += stocks[i]; cnt++;
            if (sum >= qty) return cnt;
        }
        return -1;
    }
}`,
    pythonSolution: `def minWarehousesToFulfill(stocks, qty):
    if qty <= 0: return 0
    s = cnt = 0
    for st in sorted(stocks, reverse=True):
        s += st; cnt += 1
        if s >= qty: return cnt
    return -1`
  },
  {
    number: 25,
    title: 'Rider Route Manhattan Distance',
    fnName: 'totalRiderDistance',
    description: 'Starting at <code>(0, 0)</code>, a rider visits waypoints <code>pts</code> <code>[x, y]</code> in order using Manhattan distance. Return total distance traveled.',
    constraints: ['1 <= pts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pts = [[1, 2], [4, 6]]', output: '10' },
      { title: 'Test Case 2', input: 'pts = [[0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'pts = [[-3, 4], [0, 0]]', output: '14' },
      { title: 'Test Case 4', input: 'pts = [[2, 0], [5, 0]]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static long totalRiderDistance(int[][] pts) {
        long dist = 0; int cx = 0, cy = 0;
        for (int[] p : pts) {
            dist += Math.abs((long) p[0] - cx) + Math.abs((long) p[1] - cy);
            cx = p[0]; cy = p[1];
        }
        return dist;
    }
}`,
    pythonSolution: `def totalRiderDistance(pts):
    dist = cx = cy = 0
    for x, y in pts:
        dist += abs(x - cx) + abs(y - cy)
        cx, cy = x, y
    return dist`
  },
  {
    number: 26,
    title: 'Discount Tier Threshold Lookup',
    fnName: 'maxEligibleDiscount',
    description: 'Given sorted tier thresholds <code>tiers</code> and matching discount amounts <code>discounts</code>, return the discount for the highest tier <code>&lt;= spend</code> (or <code>0</code> if below lowest tier).',
    constraints: ['1 <= tiers.length == discounts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tiers = [500, 1000, 2000], discounts = [50, 150, 400], spend = 1500', output: '150' },
      { title: 'Test Case 2', input: 'tiers = [500, 1000], discounts = [50, 150], spend = 300', output: '0' },
      { title: 'Test Case 3', input: 'tiers = [100], discounts = [10], spend = 100', output: '10' },
      { title: 'Test Case 4', input: 'tiers = [100, 200], discounts = [10, 25], spend = 999', output: '25' }
    ],
    javaSolution: `public class Solution {
    public static int maxEligibleDiscount(int[] tiers, int[] discounts, int spend) {
        int l = 0, r = tiers.length - 1, idx = -1;
        while (l <= r) {
            int m = (l + r) / 2;
            if (tiers[m] <= spend) { idx = m; l = m + 1; }
            else r = m - 1;
        }
        return idx == -1 ? 0 : discounts[idx];
    }
}`,
    pythonSolution: `import bisect
def maxEligibleDiscount(tiers, discounts, spend):
    i = bisect.bisect_right(tiers, spend)
    return 0 if i == 0 else discounts[i - 1]`
  },
  {
    number: 27,
    title: 'Seller Inventory Sync Mismatch',
    fnName: 'countInventoryDiffs',
    description: 'Compare seller reported stock <code>reported</code> with warehouse actual stock <code>actual</code> across <code>n</code> SKUs. Return the sum of absolute differences <code>|reported[i] - actual[i]|</code>.',
    constraints: ['1 <= reported.length == actual.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'reported = [10, 5, 8], actual = [12, 5, 3]', output: '7' },
      { title: 'Test Case 2', input: 'reported = [4, 4], actual = [4, 4]', output: '0' },
      { title: 'Test Case 3', input: 'reported = [0], actual = [10]', output: '10' },
      { title: 'Test Case 4', input: 'reported = [1, 2, 3], actual = [3, 2, 1]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static long countInventoryDiffs(int[] reported, int[] actual) {
        long s = 0;
        for (int i = 0; i < reported.length; i++) s += Math.abs((long) reported[i] - actual[i]);
        return s;
    }
}`,
    pythonSolution: `def countInventoryDiffs(reported, actual):
    return sum(abs(r - a) for r, a in zip(reported, actual))`
  },
  {
    number: 28,
    title: 'Cart Abandonment Recovery Streak',
    fnName: 'maxDailyStreak',
    description: 'Given daily order counts <code>orders</code>, return the longest consecutive days with strictly increasing order counts.',
    constraints: ['1 <= orders.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'orders = [10, 15, 20, 18, 25, 30]', output: '3' },
      { title: 'Test Case 2', input: 'orders = [5, 5, 5]', output: '1' },
      { title: 'Test Case 3', input: 'orders = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 4', input: 'orders = [9]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxDailyStreak(int[] orders) {
        int cur = 1, best = 1;
        for (int i = 1; i < orders.length; i++) {
            cur = (orders[i] > orders[i - 1]) ? cur + 1 : 1;
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def maxDailyStreak(orders):
    cur = best = 1
    for i in range(1, len(orders)):
        cur = cur + 1 if orders[i] > orders[i - 1] else 1
        best = max(best, cur)
    return best`
  },
  {
    number: 29,
    title: 'Fulfillment Dock Assignment',
    fnName: 'minLoadingDocks',
    description: 'Trucks arrive and depart according to intervals <code>trucks</code> <code>[arrival, departure)</code>. Return the minimum number of loading docks required simultaneously.',
    constraints: ['1 <= trucks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'trucks = [[900, 930], [915, 1000], [930, 1030]]', output: '2' },
      { title: 'Test Case 2', input: 'trucks = [[1, 5], [2, 6], [3, 7]]', output: '3' },
      { title: 'Test Case 3', input: 'trucks = [[10, 20], [20, 30]]', output: '1' },
      { title: 'Test Case 4', input: 'trucks = [[5, 15]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minLoadingDocks(int[][] trucks) {
        int n = trucks.length;
        int[] a = new int[n], d = new int[n];
        for (int i = 0; i < n; i++) { a[i] = trucks[i][0]; d[i] = trucks[i][1]; }
        Arrays.sort(a); Arrays.sort(d);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (a[i] < d[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def minLoadingDocks(trucks):
    a = sorted(t[0] for t in trucks); d = sorted(t[1] for t in trucks)
    i = j = cur = best = 0
    while i < len(a):
        if a[i] < d[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 30,
    title: 'Price Drop Alert Triggers',
    fnName: 'countPriceDrops',
    description: 'Given historical prices <code>prices</code> of a product, count how many days the price was strictly lower than the minimum price seen on all previous days.',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [100, 95, 98, 90, 90, 85]', output: '3' },
      { title: 'Test Case 2', input: 'prices = [10, 20, 30]', output: '0' },
      { title: 'Test Case 3', input: 'prices = [50, 40, 30, 20]', output: '3' },
      { title: 'Test Case 4', input: 'prices = [100]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countPriceDrops(int[] prices) {
        int mn = prices[0], drops = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] < mn) { drops++; mn = prices[i]; }
        }
        return drops;
    }
}`,
    pythonSolution: `def countPriceDrops(prices):
    mn = prices[0]; drops = 0
    for p in prices[1:]:
        if p < mn: drops += 1; mn = p
    return drops`
  },
  {
    number: 31,
    title: 'Warehouse Robot Battery Swap',
    fnName: 'countBatterySwaps',
    description: 'A warehouse robot has max battery <code>cap</code> (starts full) and executes tasks with costs <code>tasks</code>. Before a task, if <code>battery &lt; tasks[i]</code>, it swaps to a full battery <code>cap</code>. Return total battery swaps.',
    constraints: ['1 <= tasks.length <= 10^5', 'max(tasks) <= cap <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'tasks = [4, 5, 3, 6], cap = 10', output: '1' },
      { title: 'Test Case 2', input: 'tasks = [2, 2, 2], cap = 6', output: '0' },
      { title: 'Test Case 3', input: 'tasks = [5, 5, 5], cap = 5', output: '2' },
      { title: 'Test Case 4', input: 'tasks = [10], cap = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countBatterySwaps(int[] tasks, int cap) {
        int bat = cap, swaps = 0;
        for (int t : tasks) {
            if (bat < t) { swaps++; bat = cap; }
            bat -= t;
        }
        return swaps;
    }
}`,
    pythonSolution: `def countBatterySwaps(tasks, cap):
    bat, swaps = cap, 0
    for t in tasks:
        if bat < t: swaps += 1; bat = cap
        bat -= t
    return swaps`
  },
  {
    number: 32,
    title: 'Wishlist Category Diversity',
    fnName: 'maxDistinctInWindow',
    description: 'Given product category IDs <code>cats</code> in a browsing history and window size <code>k</code>, return the maximum number of distinct categories in any contiguous window of length <code>k</code>.',
    constraints: ['1 <= k <= cats.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'cats = [1, 2, 1, 3, 4, 3], k = 3', output: '3' },
      { title: 'Test Case 2', input: 'cats = [5, 5, 5, 5], k = 2', output: '1' },
      { title: 'Test Case 3', input: 'cats = [1, 2, 3], k = 1', output: '1' },
      { title: 'Test Case 4', input: 'cats = [1, 2, 3, 4], k = 4', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxDistinctInWindow(int[] cats, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        int best = 0;
        for (int i = 0; i < cats.length; i++) {
            freq.put(cats[i], freq.getOrDefault(cats[i], 0) + 1);
            if (i >= k) {
                int out = cats[i - k];
                if (freq.get(out) == 1) freq.remove(out);
                else freq.put(out, freq.get(out) - 1);
            }
            if (i >= k - 1) best = Math.max(best, freq.size());
        }
        return best;
    }
}`,
    pythonSolution: `def maxDistinctInWindow(cats, k):
    freq = {}; best = 0
    for i, c in enumerate(cats):
        freq[c] = freq.get(c, 0) + 1
        if i >= k:
            o = cats[i - k]
            if freq[o] == 1: del freq[o]
            else: freq[o] -= 1
        if i >= k - 1: best = max(best, len(freq))
    return best`
  },
  {
    number: 33,
    title: 'Sortation Conveyor Pair Sum',
    fnName: 'countTargetWeightPairs',
    description: 'Given distinct package weights <code>weights</code> and target bin capacity <code>target</code>, count how many pairs <code>(i, j)</code> with <code>i &lt; j</code> have <code>weights[i] + weights[j] == target</code>.',
    constraints: ['1 <= weights.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [1, 4, 5, 6, 9], target = 10', output: '2' },
      { title: 'Test Case 2', input: 'weights = [2, 3, 4], target = 10', output: '0' },
      { title: 'Test Case 3', input: 'weights = [5], target = 10', output: '0' },
      { title: 'Test Case 4', input: 'weights = [3, 7, 2, 8], target = 10', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countTargetWeightPairs(int[] weights, int target) {
        Set<Integer> seen = new HashSet<>();
        int cnt = 0;
        for (int w : weights) {
            if (seen.contains(target - w)) cnt++;
            seen.add(w);
        }
        return cnt;
    }
}`,
    pythonSolution: `def countTargetWeightPairs(weights, target):
    seen = set(); cnt = 0
    for w in weights:
        if target - w in seen: cnt += 1
        seen.add(w)
    return cnt`
  },
  {
    number: 34,
    title: 'Last-Mile Hub Bottleneck',
    fnName: 'minHubLoad',
    description: 'Given <code>m</code> parcels distributed across <code>n</code> hubs where parcel <code>i</code> goes to hub <code>hubs[i]</code>, return the maximum load on any single hub.',
    constraints: ['1 <= hubs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'hubs = [1, 2, 1, 3, 1, 2]', output: '3' },
      { title: 'Test Case 2', input: 'hubs = [0]', output: '1' },
      { title: 'Test Case 3', input: 'hubs = [4, 5, 6]', output: '1' },
      { title: 'Test Case 4', input: 'hubs = [2, 2, 2, 2]', output: '4' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minHubLoad(int[] hubs) {
        Map<Integer, Integer> freq = new HashMap<>();
        int best = 0;
        for (int h : hubs) {
            int c = freq.getOrDefault(h, 0) + 1;
            freq.put(h, c);
            best = Math.max(best, c);
        }
        return best;
    }
}`,
    pythonSolution: `from collections import Counter
def minHubLoad(hubs):
    return max(Counter(hubs).values())`
  },
  {
    number: 35,
    title: 'Seller Payout Settlement Delay',
    fnName: 'totalNetPayout',
    description: 'Given order gross amounts <code>gross</code>, platform fee percent <code>feePct</code> (integer floor), and fixed shipping fee <code>shipFee</code> per order, return total net payout across all orders (clamping each order payout at <code>0</code> if negative).',
    constraints: ['1 <= gross.length <= 10^5', '0 <= feePct <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'gross = [1000, 100, 500], feePct = 10, shipFee = 50', output: '1290' },
      { title: 'Test Case 2', input: 'gross = [40], feePct = 10, shipFee = 50', output: '0' },
      { title: 'Test Case 3', input: 'gross = [200], feePct = 0, shipFee = 0', output: '200' },
      { title: 'Test Case 4', input: 'gross = [300, 300], feePct = 20, shipFee = 40', output: '400' }
    ],
    javaSolution: `public class Solution {
    public static long totalNetPayout(int[] gross, int feePct, int shipFee) {
        long tot = 0;
        for (int g : gross) {
            long net = g - ((long) g * feePct) / 100 - shipFee;
            tot += Math.max(0L, net);
        }
        return tot;
    }
}`,
    pythonSolution: `def totalNetPayout(gross, feePct, shipFee):
    return sum(max(0, g - (g * feePct) // 100 - shipFee) for g in gross)`
  },
  {
    number: 36,
    title: 'Warehouse Grid Cold-Storage Reach',
    fnName: 'countReachableColdRooms',
    description: 'In a warehouse grid <code>grid</code> (<code>0</code> = normal aisle, <code>1</code> = wall, <code>2</code> = cold storage), starting from <code>(0, 0)</code> (always 0), return how many cold-storage cells (<code>2</code>) are reachable 4-directionally.',
    constraints: ['1 <= grid.length, grid[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 2, 1], [0, 1, 2], [2, 0, 0]]', output: '3' },
      { title: 'Test Case 2', input: 'grid = [[0, 1], [1, 2]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[0, 2, 2]]', output: '2' },
      { title: 'Test Case 4', input: 'grid = [[0]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countReachableColdRooms(int[][] grid) {
        int R = grid.length, C = grid[0].length, cnt = 0;
        boolean[][] vis = new boolean[R][C];
        Queue<int[]> q = new ArrayDeque<>();
        vis[0][0] = true; q.add(new int[]{0, 0});
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            if (grid[cur[0]][cur[1]] == 2) cnt++;
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && !vis[nr][nc] && grid[nr][nc] != 1) {
                    vis[nr][nc] = true; q.add(new int[]{nr, nc});
                }
            }
        }
        return cnt;
    }
}`,
    pythonSolution: `from collections import deque
def countReachableColdRooms(grid):
    R, C = len(grid), len(grid[0])
    vis = {(0, 0)}; q = deque([(0, 0)]); cnt = 0
    while q:
        r, c = q.popleft()
        if grid[r][c] == 2: cnt += 1
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in vis and grid[nr][nc] != 1:
                vis.add((nr, nc)); q.append((nr, nc))
    return cnt`
  },
  {
    number: 37,
    title: 'Flash Sale Rate Limiter',
    fnName: 'countBlockedClicks',
    description: 'Given sorted click timestamps <code>clicks</code> (in ms) from a user, a click is blocked if fewer than <code>cooldown</code> ms have elapsed since the last ACCEPTED click (first click is always accepted). Return total blocked clicks.',
    constraints: ['1 <= clicks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'clicks = [0, 100, 250, 300, 600], cooldown = 200', output: '2' },
      { title: 'Test Case 2', input: 'clicks = [0, 200, 400], cooldown = 200', output: '0' },
      { title: 'Test Case 3', input: 'clicks = [10, 20, 30], cooldown = 100', output: '2' },
      { title: 'Test Case 4', input: 'clicks = [5], cooldown = 50', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countBlockedClicks(int[] clicks, int cooldown) {
        int last = clicks[0], blocked = 0;
        for (int i = 1; i < clicks.length; i++) {
            if (clicks[i] - last < cooldown) blocked++;
            else last = clicks[i];
        }
        return blocked;
    }
}`,
    pythonSolution: `def countBlockedClicks(clicks, cooldown):
    last, blocked = clicks[0], 0
    for c in clicks[1:]:
        if c - last < cooldown: blocked += 1
        else: last = c
    return blocked`
  },
  {
    number: 38,
    title: 'Category Tree Leaf Count',
    fnName: 'countLeafCategories',
    description: 'In Flipkart\'s category tree of <code>n</code> nodes (0..n-1), <code>parent[i]</code> is node <code>i</code>\'s parent (<code>-1</code> for root). Return how many leaf categories exist (nodes with no children).',
    constraints: ['1 <= parent.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 0, 1, 1]', output: '3' },
      { title: 'Test Case 2', input: 'parent = [-1]', output: '1' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 1, 2]', output: '1' },
      { title: 'Test Case 4', input: 'parent = [-1, 0, 0, 0]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int countLeafCategories(int[] parent) {
        int n = parent.length;
        boolean[] hasChild = new boolean[n];
        for (int p : parent) if (p != -1) hasChild[p] = true;
        int leaves = 0;
        for (boolean hc : hasChild) if (!hc) leaves++;
        return leaves;
    }
}`,
    pythonSolution: `def countLeafCategories(parent):
    n = len(parent)
    parents = set(p for p in parent if p != -1)
    return n - len(parents)`
  },
  {
    number: 39,
    title: 'Cart Weight Partition Feasibility',
    fnName: 'canSplitParcelExactly',
    description: 'Given parcel item weights <code>weights</code>, return <code>true</code> if a subset of items sums to exact target <code>target</code>, else <code>false</code>.',
    constraints: ['1 <= weights.length <= 100', '0 <= target <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [3, 5, 8, 2], target = 10', output: 'true' },
      { title: 'Test Case 2', input: 'weights = [2, 4, 6], target = 5', output: 'false' },
      { title: 'Test Case 3', input: 'weights = [1, 2, 3], target = 0', output: 'true' },
      { title: 'Test Case 4', input: 'weights = [7], target = 7', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean canSplitParcelExactly(int[] weights, int target) {
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int w : weights) {
            for (int s = target; s >= w; s--) if (dp[s - w]) dp[s] = true;
        }
        return dp[target];
    }
}`,
    pythonSolution: `def canSplitParcelExactly(weights, target):
    dp = [False] * (target + 1); dp[0] = True
    for w in weights:
        for s in range(target, w - 1, -1):
            if dp[s - w]: dp[s] = True
    return dp[target]`
  },
  {
    number: 40,
    title: 'Courier Shift Coverage Gap',
    fnName: 'countUncoveredHours',
    description: 'A 24-hour hub operates on hours <code>0..23</code>. Given courier shifts <code>shifts</code> <code>[start, end)</code> (within <code>0..24</code>), return how many hours have zero courier coverage.',
    constraints: ['0 <= shifts.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'shifts = [[0, 8], [12, 20]]', output: '8' },
      { title: 'Test Case 2', input: 'shifts = [[0, 24]]', output: '0' },
      { title: 'Test Case 3', input: 'shifts = []', output: '24' },
      { title: 'Test Case 4', input: 'shifts = [[2, 5], [4, 10]]', output: '16' }
    ],
    javaSolution: `public class Solution {
    public static int countUncoveredHours(int[][] shifts) {
        boolean[] cov = new boolean[24];
        for (int[] s : shifts) {
            for (int h = Math.max(0, s[0]); h < Math.min(24, s[1]); h++) cov[h] = true;
        }
        int miss = 0;
        for (boolean c : cov) if (!c) miss++;
        return miss;
    }
}`,
    pythonSolution: `def countUncoveredHours(shifts):
    cov = [False] * 24
    for a, b in shifts:
        for h in range(max(0, a), min(24, b)): cov[h] = True
    return cov.count(False)`
  },
  {
    number: 41,
    title: 'Buy-X-Get-1-Free Bill Calculator',
    fnName: 'minBillWithFreeEveryK',
    description: 'In a Flipkart clearance sale, for every <code>k</code> items bought (sorted in any order), the cheapest item in that group of <code>k</code> is free. Given <code>prices</code> and <code>k</code>, return the minimum total bill.',
    constraints: ['1 <= prices.length <= 10^5', '2 <= k <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [10, 20, 30, 40, 50, 60], k = 3', output: '160' },
      { title: 'Test Case 2', input: 'prices = [100, 200], k = 3', output: '300' },
      { title: 'Test Case 3', input: 'prices = [5, 5, 5, 5], k = 2', output: '10' },
      { title: 'Test Case 4', input: 'prices = [7], k = 2', output: '7' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minBillWithFreeEveryK(int[] prices, int k) {
        Arrays.sort(prices);
        long total = 0; int cnt = 0;
        for (int i = prices.length - 1; i >= 0; i--) {
            cnt++;
            if (cnt % k != 0) total += prices[i];
        }
        return total;
    }
}`,
    pythonSolution: `def minBillWithFreeEveryK(prices, k):
    p = sorted(prices, reverse=True)
    return sum(v for i, v in enumerate(p) if (i + 1) % k != 0)`
  },
  {
    number: 42,
    title: 'Warehouse Aisle Congestion Peak',
    fnName: 'maxPickerRowOverlap',
    description: 'Pickers stand at coordinates <code>x</code> in <code>positions</code>. A scanner covers range <code>[pos, pos + radius]</code>. Return the maximum number of pickers within any single scanner range.',
    constraints: ['1 <= positions.length <= 10^5', '0 <= radius <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'positions = [1, 3, 5, 8, 12], radius = 4', output: '3' },
      { title: 'Test Case 2', input: 'positions = [10, 20, 30], radius = 5', output: '1' },
      { title: 'Test Case 3', input: 'positions = [2, 2, 2], radius = 0', output: '3' },
      { title: 'Test Case 4', input: 'positions = [0, 10], radius = 10', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxPickerRowOverlap(int[] positions, int radius) {
        Arrays.sort(positions);
        int l = 0, best = 0;
        for (int r = 0; r < positions.length; r++) {
            while ((long) positions[r] - positions[l] > radius) l++;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def maxPickerRowOverlap(positions, radius):
    positions.sort()
    l = best = 0
    for r, x in enumerate(positions):
        while x - positions[l] > radius: l += 1
        best = max(best, r - l + 1)
    return best`
  },
  {
    number: 43,
    title: 'Order ID Checksum Validation',
    fnName: 'countValidOrderIds',
    description: 'A Flipkart order ID string is valid if it starts with <code>"OD"</code>, has length <code>8</code>, and its last 6 characters are all digits. Count valid IDs in <code>ids</code>.',
    constraints: ['1 <= ids.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = ["OD123456", "OD12345", "AB123456", "OD000001"]', output: '2' },
      { title: 'Test Case 2', input: 'ids = ["OD12A456"]', output: '0' },
      { title: 'Test Case 3', input: 'ids = ["OD999999"]', output: '1' },
      { title: 'Test Case 4', input: 'ids = ["od123456"]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countValidOrderIds(String[] ids) {
        int cnt = 0;
        for (String id : ids) {
            if (id.length() == 8 && id.startsWith("OD")) {
                boolean ok = true;
                for (int i = 2; i < 8; i++) if (!Character.isDigit(id.charAt(i))) { ok = false; break; }
                if (ok) cnt++;
            }
        }
        return cnt;
    }
}`,
    pythonSolution: `def countValidOrderIds(ids):
    return sum(1 for x in ids if len(x) == 8 and x.startswith("OD") and x[2:].isdigit())`
  },
  {
    number: 44,
    title: 'Seller Tier Upgrade Cost',
    fnName: 'minPointsToGoldTier',
    description: 'A seller has scores <code>scores</code> across <code>n</code> metrics and needs every metric to be at least <code>target</code>. Raising any metric by 1 costs 1 point. Return minimum points needed.',
    constraints: ['1 <= scores.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'scores = [70, 85, 60], target = 80', output: '30' },
      { title: 'Test Case 2', input: 'scores = [90, 95], target = 80', output: '0' },
      { title: 'Test Case 3', input: 'scores = [0], target = 100', output: '100' },
      { title: 'Test Case 4', input: 'scores = [50, 50], target = 50', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minPointsToGoldTier(int[] scores, int target) {
        long need = 0;
        for (int s : scores) if (s < target) need += target - s;
        return need;
    }
}`,
    pythonSolution: `def minPointsToGoldTier(scores, target):
    return sum(max(0, target - s) for s in scores)`
  },
  {
    number: 45,
    title: 'Cart Recommendation Pair Count',
    fnName: 'countCoPurchasedPairs',
    description: 'Given sorted product IDs <code>cart</code> and a list of frequently bought together pairs <code>bundles</code> <code>[a, b]</code>, count how many bundle pairs have BOTH <code>a</code> and <code>b</code> present in <code>cart</code>.',
    constraints: ['1 <= cart.length <= 10^4', '1 <= bundles.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'cart = [1, 3, 5, 7], bundles = [[1, 3], [3, 6], [5, 7]]', output: '2' },
      { title: 'Test Case 2', input: 'cart = [2, 4], bundles = [[1, 2], [2, 3]]', output: '0' },
      { title: 'Test Case 3', input: 'cart = [10, 20], bundles = [[10, 20]]', output: '1' },
      { title: 'Test Case 4', input: 'cart = [1], bundles = [[1, 2]]', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countCoPurchasedPairs(int[] cart, int[][] bundles) {
        Set<Integer> s = new HashSet<>();
        for (int x : cart) s.add(x);
        int cnt = 0;
        for (int[] b : bundles) if (s.contains(b[0]) && s.contains(b[1])) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countCoPurchasedPairs(cart, bundles):
    s = set(cart)
    return sum(1 for a, b in bundles if a in s and b in s)`
  },
  {
    number: 46,
    title: 'Inventory Stockout Day Predictor',
    fnName: 'daysUntilStockout',
    description: 'An item starts with <code>stock</code> units and daily demand is given in cyclic array <code>demand</code>. Return on which 1-based day stock drops to <code>&lt;= 0</code> (assuming <code>sum(demand) &gt; 0</code>).',
    constraints: ['1 <= demand.length <= 10^4', '1 <= stock <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'stock = 10, demand = [3, 4, 5]', output: '3' },
      { title: 'Test Case 2', input: 'stock = 25, demand = [10, 5]', output: '3' },
      { title: 'Test Case 3', input: 'stock = 5, demand = [5]', output: '1' },
      { title: 'Test Case 4', input: 'stock = 1, demand = [0, 0, 2]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static long daysUntilStockout(long stock, int[] demand) {
        long cycle = 0;
        for (int d : demand) cycle += d;
        long fullCycles = Math.max(0L, (stock - 1) / cycle);
        long rem = stock - fullCycles * cycle;
        long days = fullCycles * demand.length;
        for (int d : demand) {
            days++;
            rem -= d;
            if (rem <= 0) return days;
        }
        return days;
    }
}`,
    pythonSolution: `def daysUntilStockout(stock, demand):
    cyc = sum(demand)
    full = max(0, (stock - 1) // cyc)
    rem = stock - full * cyc
    days = full * len(demand)
    for d in demand:
        days += 1; rem -= d
        if rem <= 0: return days
    return days`
  },
  {
    number: 47,
    title: 'Courier Route Fuel Cost',
    fnName: 'minDeliveryFuelCost',
    description: 'A highway has <code>n</code> stops at positions <code>pos</code> (sorted). A van starts at <code>pos[0]</code> and must visit all stops up to <code>pos[n-1]</code>, paying <code>fuelPerKm</code> per unit distance. Return total fuel cost.',
    constraints: ['1 <= pos.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pos = [0, 5, 12, 20], fuelPerKm = 3', output: '60' },
      { title: 'Test Case 2', input: 'pos = [10], fuelPerKm = 5', output: '0' },
      { title: 'Test Case 3', input: 'pos = [2, 10], fuelPerKm = 4', output: '32' },
      { title: 'Test Case 4', input: 'pos = [0, 1, 2], fuelPerKm = 1', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static long minDeliveryFuelCost(int[] pos, int fuelPerKm) {
        return (long)(pos[pos.length - 1] - pos[0]) * fuelPerKm;
    }
}`,
    pythonSolution: `def minDeliveryFuelCost(pos, fuelPerKm):
    return (pos[-1] - pos[0]) * fuelPerKm`
  },
  {
    number: 48,
    title: 'Product Review Sentiment Balance',
    fnName: 'netSentimentScore',
    description: 'Given review star ratings <code>stars</code> (1..5), ratings <code>4..5</code> add <code>+1</code>, ratings <code>1..2</code> subtract <code>1</code>, and <code>3</code> is neutral (<code>0</code>). Return the net sentiment score.',
    constraints: ['1 <= stars.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'stars = [5, 4, 3, 1, 5]', output: '2' },
      { title: 'Test Case 2', input: 'stars = [3, 3, 3]', output: '0' },
      { title: 'Test Case 3', input: 'stars = [1, 2, 1]', output: '-3' },
      { title: 'Test Case 4', input: 'stars = [5]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int netSentimentScore(int[] stars) {
        int s = 0;
        for (int x : stars) {
            if (x >= 4) s++;
            else if (x <= 2) s--;
        }
        return s;
    }
}`,
    pythonSolution: `def netSentimentScore(stars):
    return sum(1 if x >= 4 else (-1 if x <= 2 else 0) for x in stars)`
  },
  {
    number: 49,
    title: 'Split Order Minimum Subarrays',
    fnName: 'minSubarraysBelowLimit',
    description: 'Partition array <code>weights</code> into the minimum number of contiguous subarrays such that each subarray has sum <code>&lt;= limit</code>.',
    constraints: ['1 <= weights.length <= 10^5', 'max(weights) <= limit <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [4, 2, 3, 5, 1], limit = 6', output: '3' },
      { title: 'Test Case 2', input: 'weights = [1, 1, 1], limit = 5', output: '1' },
      { title: 'Test Case 3', input: 'weights = [5, 5, 5], limit = 5', output: '3' },
      { title: 'Test Case 4', input: 'weights = [3], limit = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minSubarraysBelowLimit(int[] weights, long limit) {
        int parts = 1; long cur = 0;
        for (int w : weights) {
            if (cur + w > limit) { parts++; cur = w; }
            else cur += w;
        }
        return parts;
    }
}`,
    pythonSolution: `def minSubarraysBelowLimit(weights, limit):
    parts, cur = 1, 0
    for w in weights:
        if cur + w > limit: parts += 1; cur = w
        else: cur += w
    return parts`
  },
  {
    number: 50,
    title: 'Fulfillment Network Max Flow Bottleneck',
    fnName: 'maxDailyParcelThroughput',
    description: 'Given <code>n</code> hubs and directed conveyor capacities <code>edges</code> <code>[u, v, cap]</code>, return the maximum total capacity leaving source hub <code>0</code> minus total capacity entering sink? No: simply return the maximum flow from hub <code>0</code> to hub <code>n - 1</code>.',
    constraints: ['2 <= n <= 50', '0 <= edges.length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0, 1, 10], [0, 2, 5], [1, 3, 4], [2, 3, 8], [1, 2, 3]]', output: '12' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1, 10]]', output: '0' },
      { title: 'Test Case 3', input: 'n = 2, edges = [[0, 1, 25]]', output: '25' },
      { title: 'Test Case 4', input: 'n = 3, edges = [[0, 1, 5], [1, 2, 9]]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxDailyParcelThroughput(int n, int[][] edges) {
        int[][] cap = new int[n][n];
        for (int[] e : edges) cap[e[0]][e[1]] += e[2];
        int flow = 0;
        while (true) {
            int[] par = new int[n];
            Arrays.fill(par, -1);
            par[0] = 0;
            Queue<Integer> q = new ArrayDeque<>();
            q.add(0);
            while (!q.isEmpty() && par[n - 1] == -1) {
                int u = q.poll();
                for (int v = 0; v < n; v++) {
                    if (par[v] == -1 && cap[u][v] > 0) { par[v] = u; q.add(v); }
                }
            }
            if (par[n - 1] == -1) break;
            int push = Integer.MAX_VALUE;
            for (int v = n - 1; v != 0; v = par[v]) push = Math.min(push, cap[par[v]][v]);
            for (int v = n - 1; v != 0; v = par[v]) { cap[par[v]][v] -= push; cap[v][par[v]] += push; }
            flow += push;
        }
        return flow;
    }
}`,
    pythonSolution: `from collections import deque
def maxDailyParcelThroughput(n, edges):
    cap = [[0] * n for _ in range(n)]
    for u, v, c in edges: cap[u][v] += c
    flow = 0
    while True:
        par = [-1] * n; par[0] = 0
        q = deque([0])
        while q and par[n - 1] == -1:
            u = q.popleft()
            for v in range(n):
                if par[v] == -1 and cap[u][v] > 0:
                    par[v] = u; q.append(v)
        if par[n - 1] == -1: break
        push = 10**9; v = n - 1
        while v != 0: push = min(push, cap[par[v]][v]); v = par[v]
        v = n - 1
        while v != 0: cap[par[v]][v] -= push; cap[v][par[v]] += push; v = par[v]
        flow += push
    return flow`
  }
];
