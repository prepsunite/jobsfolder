export const WALMART_QUESTIONS = [
  {
    number: 1,
    title: 'Supercenter Checkout Lane Balance',
    fnName: 'minMaxLaneWait',
    description: 'A Walmart Supercenter has <code>k</code> open checkout lanes. Customers in <code>items</code> (in order) each join the lane with the smallest current total items. Return the maximum total items processed by any single lane.',
    constraints: ['1 <= items.length <= 10^5', '1 <= k <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'items = [10, 5, 8, 3, 7], k = 2', output: '20' },
      { title: 'Test Case 2', input: 'items = [4, 4, 4], k = 3', output: '4' },
      { title: 'Test Case 3', input: 'items = [12, 3], k = 1', output: '15' },
      { title: 'Test Case 4', input: 'items = [5], k = 4', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minMaxLaneWait(int[] items, int k) {
        PriorityQueue<Long> pq = new PriorityQueue<>();
        for (int i = 0; i < k; i++) pq.add(0L);
        long best = 0;
        for (int x : items) {
            long nxt = pq.poll() + x;
            best = Math.max(best, nxt);
            pq.add(nxt);
        }
        return best;
    }
}`,
    pythonSolution: `import heapq
def minMaxLaneWait(items, k):
    h = [0] * k
    for x in items:
        v = heapq.heappop(h) + x
        heapq.heappush(h, v)
    return max(h)`
  },
  {
    number: 2,
    title: 'Rollback Price Tag Savings',
    fnName: 'totalRollbackSavings',
    description: 'Given regular prices <code>reg</code>, rollback prices <code>sale</code>, and quantities bought <code>qtys</code>, return total customer savings across all items.',
    constraints: ['1 <= reg.length == sale.length == qtys.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'reg = [100, 50, 80], sale = [85, 50, 60], qtys = [2, 3, 1]', output: '50' },
      { title: 'Test Case 2', input: 'reg = [20], sale = [20], qtys = [5]', output: '0' },
      { title: 'Test Case 3', input: 'reg = [15, 30], sale = [10, 20], qtys = [4, 2]', output: '40' },
      { title: 'Test Case 4', input: 'reg = [100], sale = [1], qtys = [1]', output: '99' }
    ],
    javaSolution: `public class Solution {
    public static long totalRollbackSavings(int[] reg, int[] sale, int[] qtys) {
        long s = 0;
        for (int i = 0; i < reg.length; i++) s += (long)(reg[i] - sale[i]) * qtys[i];
        return s;
    }
}`,
    pythonSolution: `def totalRollbackSavings(reg, sale, qtys):
    return sum((r - s) * q for r, s, q in zip(reg, sale, qtys))`
  },
  {
    number: 3,
    title: 'Distribution Center Dock Schedule',
    fnName: 'maxTrucksUnloaded',
    description: 'Freight trucks have arrival/departure windows <code>trucks</code> <code>[start, end]</code>. One unloading bay processes one truck at a time (<code>end1 <= start2</code> allowed). Return maximum trucks unloaded.',
    constraints: ['1 <= trucks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'trucks = [[1, 4], [2, 3], [3, 6], [5, 7]]', output: '2' },
      { title: 'Test Case 2', input: 'trucks = [[0, 2], [2, 4], [4, 6]]', output: '3' },
      { title: 'Test Case 3', input: 'trucks = [[1, 10], [2, 5]]', output: '1' },
      { title: 'Test Case 4', input: 'trucks = [[8, 9]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxTrucksUnloaded(int[][] trucks) {
        Arrays.sort(trucks, (a, b) -> Integer.compare(a[1], b[1]));
        int cnt = 0, end = Integer.MIN_VALUE;
        for (int[] t : trucks) if (t[0] >= end) { cnt++; end = t[1]; }
        return cnt;
    }
}`,
    pythonSolution: `def maxTrucksUnloaded(trucks):
    trucks.sort(key=lambda x: x[1])
    cnt, end = 0, float('-inf')
    for s, e in trucks:
        if s >= end: cnt += 1; end = e
    return cnt`
  },
  {
    number: 4,
    title: 'Pallet Stack Height Limit',
    fnName: 'minPalletsNeeded',
    description: 'Boxes of heights <code>heights</code> (in order) are stacked onto pallets. Each pallet holds at most <code>maxH</code> total height. Return minimum pallets required.',
    constraints: ['1 <= heights.length <= 10^5', 'max(heights) <= maxH <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'heights = [4, 6, 3, 5, 2], maxH = 10', output: '2' },
      { title: 'Test Case 2', input: 'heights = [2, 2, 2], maxH = 6', output: '1' },
      { title: 'Test Case 3', input: 'heights = [5, 5, 5], maxH = 5', output: '3' },
      { title: 'Test Case 4', input: 'heights = [1], maxH = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minPalletsNeeded(int[] heights, int maxH) {
        int pal = 1; long cur = 0;
        for (int h : heights) {
            if (cur + h > maxH) { pal++; cur = h; } else cur += h;
        }
        return pal;
    }
}`,
    pythonSolution: `def minPalletsNeeded(heights, maxH):
    pal, cur = 1, 0
    for h in heights:
        if cur + h > maxH: pal += 1; cur = h
        else: cur += h
    return pal`
  },
  {
    number: 5,
    title: 'Store-to-Store Stock Transfer Hops',
    fnName: 'minTransferHops',
    description: 'Given <code>n</code> stores (0..n-1) and undirected supply routes <code>routes</code> <code>[u, v]</code>, return minimum hops from store <code>src</code> to store <code>dst</code>, or <code>-1</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, routes = [[0, 1], [1, 2], [2, 3], [0, 3]], src = 0, dst = 2', output: '2' },
      { title: 'Test Case 2', input: 'n = 3, routes = [[0, 1]], src = 0, dst = 2', output: '-1' },
      { title: 'Test Case 3', input: 'n = 2, routes = [[0, 1]], src = 1, dst = 1', output: '0' },
      { title: 'Test Case 4', input: 'n = 2, routes = [[0, 1]], src = 0, dst = 1', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minTransferHops(int n, int[][] routes, int src, int dst) {
        if (src == dst) return 0;
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] r : routes) { g.get(r[0]).add(r[1]); g.get(r[1]).add(r[0]); }
        int[] dist = new int[n]; Arrays.fill(dist, -1);
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
def minTransferHops(n, routes, src, dst):
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
    number: 6,
    title: 'POS Receipt Barcode Checksum',
    fnName: 'countValidUpcCheckDigits',
    description: 'A 10-digit receipt ID string is valid if the sum of its first 9 digits modulo 10 equals its 10th digit. Count valid 10-digit strings in <code>ids</code>.',
    constraints: ['1 <= ids.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = ["1234567895", "1111111110", "0000000000"]', output: '2' },
      { title: 'Test Case 2', input: 'ids = ["1234567890"]', output: '0' },
      { title: 'Test Case 3', input: 'ids = ["0000000011"]', output: '1' },
      { title: 'Test Case 4', input: 'ids = ["9999999991"]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countValidUpcCheckDigits(String[] ids) {
        int ok = 0;
        for (String id : ids) {
            if (id.length() != 10) continue;
            int s = 0;
            for (int i = 0; i < 9; i++) s += id.charAt(i) - '0';
            if (s % 10 == id.charAt(9) - '0') ok++;
        }
        return ok;
    }
}`,
    pythonSolution: `def countValidUpcCheckDigits(ids):
    return sum(1 for x in ids if len(x) == 10 and sum(int(c) for c in x[:9]) % 10 == int(x[9]))`
  },
  {
    number: 7,
    title: 'Curbside Pickup Slot Utilization',
    fnName: 'countFullPickupSlots',
    description: 'Given slot capacities <code>caps</code> and booked orders <code>booked</code>, count how many pickup slots are at full capacity (<code>booked[i] >= caps[i]</code>).',
    constraints: ['1 <= caps.length == booked.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'caps = [10, 15, 20], booked = [10, 12, 20]', output: '2' },
      { title: 'Test Case 2', input: 'caps = [5, 5], booked = [1, 2]', output: '0' },
      { title: 'Test Case 3', input: 'caps = [8], booked = [8]', output: '1' },
      { title: 'Test Case 4', input: 'caps = [0, 10], booked = [0, 15]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countFullPickupSlots(int[] caps, int[] booked) {
        int cnt = 0;
        for (int i = 0; i < caps.length; i++) if (booked[i] >= caps[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countFullPickupSlots(caps, booked):
    return sum(1 for c, b in zip(caps, booked) if b >= c)`
  },
  {
    number: 8,
    title: 'Perishable Cold-Chain Expiry',
    fnName: 'countSpoiledBatches',
    description: 'Produce batches have shelf-life <code>life[i]</code> hours and transit time <code>transit[i]</code> hours. A batch spoils if <code>transit[i] >= life[i]</code>. Count spoiled batches.',
    constraints: ['1 <= life.length == transit.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'life = [24, 48, 12], transit = [24, 30, 15]', output: '2' },
      { title: 'Test Case 2', input: 'life = [10, 20], transit = [5, 10]', output: '0' },
      { title: 'Test Case 3', input: 'life = [5], transit = [5]', output: '1' },
      { title: 'Test Case 4', input: 'life = [100], transit = [99]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countSpoiledBatches(int[] life, int[] transit) {
        int cnt = 0;
        for (int i = 0; i < life.length; i++) if (transit[i] >= life[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countSpoiledBatches(life, transit):
    return sum(1 for l, t in zip(life, transit) if t >= l)`
  },
  {
    number: 9,
    title: 'Forklift Battery Fleet Range',
    fnName: 'maxAislesVisited',
    description: 'Forklift aisles require battery costs <code>costs</code>. Given starting battery <code>bat</code>, you may visit any subset of aisles. Return maximum aisles visited.',
    constraints: ['1 <= costs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'costs = [40, 10, 30, 20], bat = 65', output: '3' },
      { title: 'Test Case 2', input: 'costs = [50, 60], bat = 40', output: '0' },
      { title: 'Test Case 3', input: 'costs = [10, 10, 10], bat = 30', output: '3' },
      { title: 'Test Case 4', input: 'costs = [5], bat = 5', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxAislesVisited(int[] costs, long bat) {
        Arrays.sort(costs);
        long s = 0; int cnt = 0;
        for (int c : costs) { if (s + c <= bat) { s += c; cnt++; } else break; }
        return cnt;
    }
}`,
    pythonSolution: `def maxAislesVisited(costs, bat):
    s = cnt = 0
    for c in sorted(costs):
        if s + c <= bat: s += c; cnt += 1
        else: break
    return cnt`
  },
  {
    number: 10,
    title: 'Grocery Basket Weight Split DP',
    fnName: 'minBagWeightDiff',
    description: 'Split grocery item weights <code>weights</code> (<code>sum <= 5000</code>) into two bags so the absolute difference of their total weights is minimized. Return that minimum difference.',
    constraints: ['1 <= weights.length <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [1, 6, 11, 5]', output: '1' },
      { title: 'Test Case 2', input: 'weights = [3, 3]', output: '0' },
      { title: 'Test Case 3', input: 'weights = [10]', output: '10' },
      { title: 'Test Case 4', input: 'weights = [2, 4, 8]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minBagWeightDiff(int[] weights) {
        int tot = 0; for (int w : weights) tot += w;
        int half = tot / 2;
        boolean[] dp = new boolean[half + 1];
        dp[0] = true;
        for (int w : weights) for (int s = half; s >= w; s--) if (dp[s - w]) dp[s] = true;
        for (int s = half; s >= 0; s--) if (dp[s]) return tot - 2 * s;
        return tot;
    }
}`,
    pythonSolution: `def minBagWeightDiff(weights):
    tot = sum(weights); half = tot // 2
    dp = [False] * (half + 1); dp[0] = True
    for w in weights:
        for s in range(half, w - 1, -1):
            if dp[s - w]: dp[s] = True
    for s in range(half, -1, -1):
        if dp[s]: return tot - 2 * s
    return tot`
  },
  {
    number: 11,
    title: 'POS Terminal Cash Register Balance',
    fnName: 'canMakeAllChange',
    description: 'Customers pay sequentially with bills in <code>bills</code> (only <code>5, 10, 20</code>) for $5 items. Starting with $0 change, return <code>true</code> if you can give exact change to every customer, else <code>false</code>.',
    constraints: ['1 <= bills.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bills = [5, 5, 5, 10, 20]', output: 'true' },
      { title: 'Test Case 2', input: 'bills = [5, 5, 10, 10, 20]', output: 'false' },
      { title: 'Test Case 3', input: 'bills = [10]', output: 'false' },
      { title: 'Test Case 4', input: 'bills = [5, 10, 5, 20]', output: 'true' }
    ],
    javaSolution: `public class Solution {
    public static boolean canMakeAllChange(int[] bills) {
        int f5 = 0, f10 = 0;
        for (int b : bills) {
            if (b == 5) f5++;
            else if (b == 10) { if (f5 == 0) return false; f5--; f10++; }
            else {
                if (f10 > 0 && f5 > 0) { f10--; f5--; }
                else if (f5 >= 3) f5 -= 3;
                else return false;
            }
        }
        return true;
    }
}`,
    pythonSolution: `def canMakeAllChange(bills):
    f5 = f10 = 0
    for b in bills:
        if b == 5: f5 += 1
        elif b == 10:
            if f5 == 0: return False
            f5 -= 1; f10 += 1
        else:
            if f10 > 0 and f5 > 0: f10 -= 1; f5 -= 1
            elif f5 >= 3: f5 -= 3
            else: return False
    return True`
  },
  {
    number: 12,
    title: 'Shelf Tag Price Match Violations',
    fnName: 'countOverchargedScans',
    description: 'Given shelf-tag prices <code>shelf</code> and POS register prices <code>pos</code>, count how many items were scanned higher than their shelf tag (<code>pos[i] > shelf[i]</code>).',
    constraints: ['1 <= shelf.length == pos.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'shelf = [100, 200, 300], pos = [100, 220, 290]', output: '1' },
      { title: 'Test Case 2', input: 'shelf = [50, 50], pos = [50, 50]', output: '0' },
      { title: 'Test Case 3', input: 'shelf = [10, 20], pos = [15, 25]', output: '2' },
      { title: 'Test Case 4', input: 'shelf = [99], pos = [98]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countOverchargedScans(int[] shelf, int[] pos) {
        int cnt = 0;
        for (int i = 0; i < shelf.length; i++) if (pos[i] > shelf[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countOverchargedScans(shelf, pos):
    return sum(1 for s, p in zip(shelf, pos) if p > s)`
  },
  {
    number: 13,
    title: 'Fleet Fuel Efficiency Filter',
    fnName: 'countEfficientTrucks',
    description: 'Given miles driven <code>miles</code> and gallons used <code>gallons</code>, count trucks achieving at least <code>minMpg</code> miles per gallon (<code>miles[i] >= minMpg * gallons[i]</code>).',
    constraints: ['1 <= miles.length == gallons.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'miles = [100, 150, 80], gallons = [10, 20, 8], minMpg = 10', output: '2' },
      { title: 'Test Case 2', input: 'miles = [50], gallons = [10], minMpg = 6', output: '0' },
      { title: 'Test Case 3', input: 'miles = [120], gallons = [10], minMpg = 12', output: '1' },
      { title: 'Test Case 4', input: 'miles = [9, 10], gallons = [1, 1], minMpg = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countEfficientTrucks(int[] miles, int[] gallons, int minMpg) {
        int cnt = 0;
        for (int i = 0; i < miles.length; i++) if (miles[i] >= (long) minMpg * gallons[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countEfficientTrucks(miles, gallons, minMpg):
    return sum(1 for m, g in zip(miles, gallons) if m >= minMpg * g)`
  },
  {
    number: 14,
    title: 'Store Aisle Shortest Manhattan Route',
    fnName: 'minShoppingWalk',
    description: 'Starting at entrance <code>(0, 0)</code>, a shopper visits item coordinates <code>items</code> <code>[x, y]</code> in order and returns to <code>(0, 0)</code>. Return total Manhattan distance.',
    constraints: ['1 <= items.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'items = [[1, 2], [4, 2]]', output: '12' },
      { title: 'Test Case 2', input: 'items = [[0, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'items = [[3, 0]]', output: '6' },
      { title: 'Test Case 4', input: 'items = [[1, 1], [2, 2]]', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static long minShoppingWalk(int[][] items) {
        long d = 0; int cx = 0, cy = 0;
        for (int[] p : items) { d += Math.abs((long) p[0] - cx) + Math.abs((long) p[1] - cy); cx = p[0]; cy = p[1]; }
        d += Math.abs((long) cx) + Math.abs((long) cy);
        return d;
    }
}`,
    pythonSolution: `def minShoppingWalk(items):
    d = cx = cy = 0
    for x, y in items: d += abs(x - cx) + abs(y - cy); cx, cy = x, y
    return d + abs(cx) + abs(cy)`
  },
  {
    number: 15,
    title: 'Warehouse Zone Density Peak',
    fnName: 'maxWorkersInZone',
    description: 'Workers are positioned along a conveyor at sorted coordinates <code>pos</code>. A supervisor monitors an interval of length <code>span</code> (inclusive). Return maximum workers monitored simultaneously.',
    constraints: ['1 <= pos.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pos = [1, 3, 4, 8, 9, 10], span = 3', output: '3' },
      { title: 'Test Case 2', input: 'pos = [0, 10, 20], span = 5', output: '1' },
      { title: 'Test Case 3', input: 'pos = [2, 2, 2], span = 0', output: '3' },
      { title: 'Test Case 4', input: 'pos = [5], span = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxWorkersInZone(int[] pos, int span) {
        int l = 0, best = 0;
        for (int r = 0; r < pos.length; r++) {
            while (pos[r] - pos[l] > span) l++;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def maxWorkersInZone(pos, span):
    l = best = 0
    for r, x in enumerate(pos):
        while x - pos[l] > span: l += 1
        best = max(best, r - l + 1)
    return best`
  },
  {
    number: 16,
    title: 'Gift Card Balance Remaining',
    fnName: 'countCoveredPurchases',
    description: 'A gift card starts with <code>balance</code>. Given purchase amounts <code>purchases</code> in order, each purchase is charged to the card if remaining balance <code>&gt;= amt</code> (otherwise skipped). Return how many purchases are covered.',
    constraints: ['1 <= purchases.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'balance = 100, purchases = [40, 70, 35, 25]', output: '3' },
      { title: 'Test Case 2', input: 'balance = 50, purchases = [60, 70]', output: '0' },
      { title: 'Test Case 3', input: 'balance = 20, purchases = [20]', output: '1' },
      { title: 'Test Case 4', input: 'balance = 0, purchases = [1, 2]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countCoveredPurchases(long balance, int[] purchases) {
        int cnt = 0;
        for (int p : purchases) if (balance >= p) { balance -= p; cnt++; }
        return cnt;
    }
}`,
    pythonSolution: `def countCoveredPurchases(balance, purchases):
    cnt = 0
    for p in purchases:
        if balance >= p: balance -= p; cnt += 1
    return cnt`
  },
  {
    number: 17,
    title: 'Store Inventory Restock Waves',
    fnName: 'countRestockOrders',
    description: 'An item starts with <code>stock</code> units and daily sales are <code>sales</code>. Whenever end-of-day stock drops strictly below <code>reorderPt</code>, a restock of <code>batchSize</code> arrives overnight. Return total restocks triggered.',
    constraints: ['1 <= sales.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'stock = 20, sales = [8, 8, 8, 8], reorderPt = 10, batchSize = 15', output: '2' },
      { title: 'Test Case 2', input: 'stock = 50, sales = [5, 5, 5], reorderPt = 10, batchSize = 20', output: '0' },
      { title: 'Test Case 3', input: 'stock = 10, sales = [1], reorderPt = 10, batchSize = 5', output: '1' },
      { title: 'Test Case 4', input: 'stock = 10, sales = [0], reorderPt = 10, batchSize = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countRestockOrders(int stock, int[] sales, int reorderPt, int batchSize) {
        int cur = stock, orders = 0;
        for (int s : sales) {
            cur -= s;
            if (cur < reorderPt) { orders++; cur += batchSize; }
        }
        return orders;
    }
}`,
    pythonSolution: `def countRestockOrders(stock, sales, reorderPt, batchSize):
    cur, orders = stock, 0
    for s in sales:
        cur -= s
        if cur < reorderPt: orders += 1; cur += batchSize
    return orders`
  },
  {
    number: 18,
    title: 'SKU Demand Forecasting Spike',
    fnName: 'countDemandSpikes',
    description: 'Given daily unit sales <code>sales</code>, day <code>i >= 1</code> is a spike if <code>sales[i] >= 2 * sales[i-1]</code>. Return total spike days.',
    constraints: ['1 <= sales.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'sales = [5, 10, 12, 25, 20]', output: '2' },
      { title: 'Test Case 2', input: 'sales = [10, 15, 20]', output: '0' },
      { title: 'Test Case 3', input: 'sales = [1, 2, 4, 8]', output: '3' },
      { title: 'Test Case 4', input: 'sales = [50]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countDemandSpikes(int[] sales) {
        int cnt = 0;
        for (int i = 1; i < sales.length; i++) if (sales[i] >= 2L * sales[i - 1]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countDemandSpikes(sales):
    return sum(1 for i in range(1, len(sales)) if sales[i] >= 2 * sales[i - 1])`
  },
  {
    number: 19,
    title: 'Cross-Docking Hub Peak Load',
    fnName: 'maxCrossDockOverlap',
    description: 'Given inbound-outbound shipment intervals <code>shipments</code> <code>[inTime, outTime)</code>, return the maximum number of shipments staged at the cross-dock simultaneously.',
    constraints: ['1 <= shipments.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'shipments = [[1, 5], [2, 6], [4, 8]]', output: '3' },
      { title: 'Test Case 2', input: 'shipments = [[1, 2], [2, 3], [3, 4]]', output: '1' },
      { title: 'Test Case 3', input: 'shipments = [[0, 10]]', output: '1' },
      { title: 'Test Case 4', input: 'shipments = [[1, 4], [2, 3], [5, 7]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxCrossDockOverlap(int[][] shipments) {
        int n = shipments.length;
        int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = shipments[i][0]; e[i] = shipments[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def maxCrossDockOverlap(shipments):
    s = sorted(x[0] for x in shipments); e = sorted(x[1] for x in shipments)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 20,
    title: 'Department Revenue Share Top-1',
    fnName: 'topRevenueDepartment',
    description: 'Given department IDs <code>depts</code> and sales <code>sales</code>, return the department ID with highest total sales (smallest ID on tie).',
    constraints: ['1 <= depts.length == sales.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'depts = [10, 20, 10, 30], sales = [100, 250, 200, 300]', output: '10' },
      { title: 'Test Case 2', input: 'depts = [5, 2], sales = [50, 50]', output: '2' },
      { title: 'Test Case 3', input: 'depts = [9], sales = [1]', output: '9' },
      { title: 'Test Case 4', input: 'depts = [3, 3, 1], sales = [10, 10, 15]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int topRevenueDepartment(int[] depts, int[] sales) {
        Map<Integer, Long> m = new HashMap<>();
        for (int i = 0; i < depts.length; i++) m.put(depts[i], m.getOrDefault(depts[i], 0L) + sales[i]);
        int bestId = depts[0]; long bestVal = -1;
        for (var e : m.entrySet()) {
            if (e.getValue() > bestVal || (e.getValue() == bestVal && e.getKey() < bestId)) {
                bestVal = e.getValue(); bestId = e.getKey();
            }
        }
        return bestId;
    }
}`,
    pythonSolution: `from collections import defaultdict
def topRevenueDepartment(depts, sales):
    m = defaultdict(int)
    for d, s in zip(depts, sales): m[d] += s
    return min(m.keys(), key=lambda d: (-m[d], d))`
  },
  {
    number: 21,
    title: 'Loyalty Points Tier Threshold',
    fnName: 'countPlusMembers',
    description: 'Given customer annual spend <code>spend</code>, return how many customers qualify for Walmart+ bonus tier (<code>spend[i] >= thresh</code>).',
    constraints: ['1 <= spend.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'spend = [400, 500, 1200, 300], thresh = 500', output: '2' },
      { title: 'Test Case 2', input: 'spend = [100, 200], thresh = 300', output: '0' },
      { title: 'Test Case 3', input: 'spend = [500], thresh = 500', output: '1' },
      { title: 'Test Case 4', input: 'spend = [0], thresh = 1', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countPlusMembers(int[] spend, int thresh) {
        int cnt = 0;
        for (int s : spend) if (s >= thresh) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countPlusMembers(spend, thresh):
    return sum(1 for s in spend if s >= thresh)`
  },
  {
    number: 22,
    title: 'Warehouse Aisle Clearance Width',
    fnName: 'countWideAisles',
    description: 'In an <code>R x C</code> floorplan <code>grid</code> (<code>0</code> = open, <code>1</code> = shelf), count how many rows have at least <code>k</code> consecutive <code>0</code> cells.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 0, 1, 0], [0, 0, 0, 1], [1, 0, 1, 0]], k = 3', output: '1' },
      { title: 'Test Case 2', input: 'grid = [[0, 0], [0, 0]], k = 2', output: '2' },
      { title: 'Test Case 3', input: 'grid = [[1, 1], [1, 1]], k = 1', output: '0' },
      { title: 'Test Case 4', input: 'grid = [[0, 1, 0, 0]], k = 2', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countWideAisles(int[][] grid, int k) {
        int rows = 0;
        for (int[] row : grid) {
            int run = 0;
            for (int v : row) {
                run = (v == 0) ? run + 1 : 0;
                if (run >= k) { rows++; break; }
            }
        }
        return rows;
    }
}`,
    pythonSolution: `def countWideAisles(grid, k):
    ans = 0
    for row in grid:
        run = 0
        for v in row:
            run = run + 1 if v == 0 else 0
            if run >= k: ans += 1; break
    return ans`
  },
  {
    number: 23,
    title: 'Delivery Van Route Fuel Stops',
    fnName: 'minFuelRefills',
    description: 'A truck needs to travel <code>dist</code> miles starting with full tank <code>tank</code>. Sorted gas stations are at <code>stations</code>. Return minimum stops to reach <code>dist</code>, or <code>-1</code> if impossible.',
    constraints: ['0 <= stations.length <= 10^5', '1 <= tank <= dist <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'dist = 100, tank = 40, stations = [30, 60, 90]', output: '2' },
      { title: 'Test Case 2', input: 'dist = 100, tank = 30, stations = [40, 70]', output: '-1' },
      { title: 'Test Case 3', input: 'dist = 50, tank = 50, stations = []', output: '0' },
      { title: 'Test Case 4', input: 'dist = 60, tank = 20, stations = [20, 40]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minFuelRefills(int dist, int tank, int[] stations) {
        int reach = tank, stops = 0, i = 0;
        while (reach < dist) {
            int best = -1;
            while (i < stations.length && stations[i] <= reach) { best = stations[i]; i++; }
            if (best == -1) return -1;
            reach = best + tank;
            stops++;
        }
        return stops;
    }
}`,
    pythonSolution: `def minFuelRefills(dist, tank, stations):
    reach, stops, i = tank, 0, 0
    while reach < dist:
        best = -1
        while i < len(stations) and stations[i] <= reach:
            best = stations[i]; i += 1
        if best == -1: return -1
        reach = best + tank; stops += 1
    return stops`
  },
  {
    number: 24,
    title: 'Bulk Pack Remainder Units',
    fnName: 'totalLooseUnits',
    description: 'Warehouses hold item counts <code>counts</code> packed into boxes of size <code>boxSize</code>. Return total leftover loose units across all warehouses.',
    constraints: ['1 <= counts.length <= 10^5', '1 <= boxSize <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'counts = [25, 14, 30], boxSize = 10', output: '9' },
      { title: 'Test Case 2', input: 'counts = [12, 24], boxSize = 12', output: '0' },
      { title: 'Test Case 3', input: 'counts = [7], boxSize = 5', output: '2' },
      { title: 'Test Case 4', input: 'counts = [0, 3], boxSize = 4', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static long totalLooseUnits(int[] counts, int boxSize) {
        long rem = 0;
        for (int c : counts) rem += c % boxSize;
        return rem;
    }
}`,
    pythonSolution: `def totalLooseUnits(counts, boxSize):
    return sum(c % boxSize for c in counts)`
  },
  {
    number: 25,
    title: 'Coupon Minimum Spend Pair',
    fnName: 'countEligiblePairs',
    description: 'Given item prices <code>prices</code> and minimum spend <code>minSpend</code>, count how many pairs of distinct items <code>(i, j)</code> with <code>i < j</code> have <code>prices[i] + prices[j] >= minSpend</code>.',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [10, 20, 30, 40], minSpend = 50', output: '4' },
      { title: 'Test Case 2', input: 'prices = [5, 10], minSpend = 20', output: '0' },
      { title: 'Test Case 3', input: 'prices = [25, 25, 25], minSpend = 50', output: '3' },
      { title: 'Test Case 4', input: 'prices = [100], minSpend = 50', output: '0' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countEligiblePairs(int[] prices, long minSpend) {
        Arrays.sort(prices);
        int l = 0, r = prices.length - 1; long cnt = 0;
        while (l < r) {
            if ((long) prices[l] + prices[r] >= minSpend) { cnt += r - l; r--; }
            else l++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countEligiblePairs(prices, minSpend):
    prices.sort()
    l, r, cnt = 0, len(prices) - 1, 0
    while l < r:
        if prices[l] + prices[r] >= minSpend: cnt += r - l; r -= 1
        else: l += 1
    return cnt`
  },
  {
    number: 26,
    title: 'Store Closing Shift Cleanup',
    fnName: 'totalCleanupMinutes',
    description: '<code>n</code> aisles have mess levels <code>mess</code>. A cleaner spends <code>ceil(mess[i] / rate)</code> minutes per aisle. Return total cleanup minutes.',
    constraints: ['1 <= mess.length <= 10^5', '1 <= rate <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'mess = [10, 7, 1], rate = 3', output: '8' },
      { title: 'Test Case 2', input: 'mess = [0, 0], rate = 5', output: '0' },
      { title: 'Test Case 3', input: 'mess = [12], rate = 4', output: '3' },
      { title: 'Test Case 4', input: 'mess = [5, 5], rate = 2', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static long totalCleanupMinutes(int[] mess, int rate) {
        long t = 0;
        for (int m : mess) t += (m + rate - 1L) / rate;
        return t;
    }
}`,
    pythonSolution: `def totalCleanupMinutes(mess, rate):
    return sum((m + rate - 1) // rate for m in mess)`
  },
  {
    number: 27,
    title: 'Price Elasticity Revenue Max',
    fnName: 'bestSinglePriceRevenue',
    description: 'Customers have max willingness-to-pay <code>budgets</code>. If you set one uniform price <code>P</code> (chosen from <code>budgets</code>), every customer with <code>budgets[i] >= P</code> buys 1 unit. Return maximum total revenue.',
    constraints: ['1 <= budgets.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'budgets = [30, 20, 53, 14]', output: '60' },
      { title: 'Test Case 2', input: 'budgets = [10, 10, 10]', output: '30' },
      { title: 'Test Case 3', input: 'budgets = [100]', output: '100' },
      { title: 'Test Case 4', input: 'budgets = [5, 20, 20]', output: '40' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long bestSinglePriceRevenue(int[] budgets) {
        Arrays.sort(budgets);
        int n = budgets.length; long best = 0;
        for (int i = 0; i < n; i++) best = Math.max(best, (long) budgets[i] * (n - i));
        return best;
    }
}`,
    pythonSolution: `def bestSinglePriceRevenue(budgets):
    budgets.sort(); n = len(budgets)
    return max(budgets[i] * (n - i) for i in range(n))`
  },
  {
    number: 28,
    title: 'Automated Conveyor Jam Count',
    fnName: 'countConveyorJams',
    description: 'Packages have sorted arrival times <code>times</code>. A jam occurs whenever two consecutive packages arrive within strictly less than <code>minGap</code> seconds (<code>times[i] - times[i-1] < minGap</code>). Return jam count.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [0, 2, 5, 6, 10], minGap = 3', output: '2' },
      { title: 'Test Case 2', input: 'times = [0, 5, 10], minGap = 5', output: '0' },
      { title: 'Test Case 3', input: 'times = [1, 1, 1], minGap = 1', output: '2' },
      { title: 'Test Case 4', input: 'times = [7], minGap = 5', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countConveyorJams(int[] times, int minGap) {
        int jams = 0;
        for (int i = 1; i < times.length; i++) if (times[i] - times[i - 1] < minGap) jams++;
        return jams;
    }
}`,
    pythonSolution: `def countConveyorJams(times, minGap):
    return sum(1 for i in range(1, len(times)) if times[i] - times[i - 1] < minGap)`
  },
  {
    number: 29,
    title: 'Inventory Shrinkage Audit',
    fnName: 'countShrinkageSkus',
    description: 'Given expected stock <code>expected</code> and counted stock <code>counted</code>, count SKUs with strictly missing inventory (<code>counted[i] < expected[i]</code>).',
    constraints: ['1 <= expected.length == counted.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'expected = [10, 20, 30], counted = [8, 20, 25]', output: '2' },
      { title: 'Test Case 2', input: 'expected = [5, 5], counted = [5, 6]', output: '0' },
      { title: 'Test Case 3', input: 'expected = [1], counted = [0]', output: '1' },
      { title: 'Test Case 4', input: 'expected = [100], counted = [100]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countShrinkageSkus(int[] expected, int[] counted) {
        int cnt = 0;
        for (int i = 0; i < expected.length; i++) if (counted[i] < expected[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countShrinkageSkus(expected, counted):
    return sum(1 for e, c in zip(expected, counted) if c < e)`
  },
  {
    number: 30,
    title: 'Multi-Stop Delivery Time Window',
    fnName: 'totalWaitAtStops',
    description: 'A truck arrives at stop <code>i</code> at cumulative travel time <code>travel[i]</code> (say <code>sum(drive[0..i])</code>), and must wait until opening time <code>open[i]</code> if arriving early (no waiting if arriving at or after <code>open[i]</code>). Return total wait time.',
    constraints: ['1 <= drive.length == open.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'drive = [5, 5, 10], open = [10, 12, 25]', output: '5' },
      { title: 'Test Case 2', input: 'drive = [10, 10], open = [5, 10]', output: '0' },
      { title: 'Test Case 3', input: 'drive = [3], open = [10]', output: '7' },
      { title: 'Test Case 4', input: 'drive = [5, 5], open = [5, 10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalWaitAtStops(int[] drive, int[] open) {
        long t = 0, wait = 0;
        for (int i = 0; i < drive.length; i++) {
            t += drive[i];
            if (t < open[i]) { wait += open[i] - t; t = open[i]; }
        }
        return wait;
    }
}`,
    pythonSolution: `def totalWaitAtStops(drive, open):
    t = wait = 0
    for d, o in zip(drive, open):
        t += d
        if t < o: wait += o - t; t = o
    return wait`
  },
  {
    number: 31,
    title: 'Storefront Promo Banner Rotation',
    fnName: 'finalBannerIndex',
    description: 'There are <code>n</code> banners (<code>0..n-1</code>). Starting at <code>0</code>, apply <code>k</code> rotation shifts <code>shifts</code> (positive = right, negative = left). Return final banner index.',
    constraints: ['1 <= n <= 10^5', '1 <= shifts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 5, shifts = [2, 4, -1]', output: '0' },
      { title: 'Test Case 2', input: 'n = 4, shifts = [-1]', output: '3' },
      { title: 'Test Case 3', input: 'n = 1, shifts = [10, -5]', output: '0' },
      { title: 'Test Case 4', input: 'n = 3, shifts = [1, 1]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int finalBannerIndex(int n, int[] shifts) {
        long pos = 0;
        for (int s : shifts) pos = ((pos + s) % n + n) % n;
        return (int) pos;
    }
}`,
    pythonSolution: `def finalBannerIndex(n, shifts):
    return sum(shifts) % n`
  },
  {
    number: 32,
    title: 'Receipt Tax-Exempt Item Sum',
    fnName: 'taxableSubtotal',
    description: 'Given item prices <code>prices</code> and boolean flags <code>exempt</code> (<code>1</code> = tax-exempt, <code>0</code> = taxable), return the sum of taxable item prices.',
    constraints: ['1 <= prices.length == exempt.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [100, 50, 200], exempt = [0, 1, 0]', output: '300' },
      { title: 'Test Case 2', input: 'prices = [40, 60], exempt = [1, 1]', output: '0' },
      { title: 'Test Case 3', input: 'prices = [25], exempt = [0]', output: '25' },
      { title: 'Test Case 4', input: 'prices = [10, 20, 30], exempt = [0, 0, 1]', output: '30' }
    ],
    javaSolution: `public class Solution {
    public static long taxableSubtotal(int[] prices, int[] exempt) {
        long s = 0;
        for (int i = 0; i < prices.length; i++) if (exempt[i] == 0) s += prices[i];
        return s;
    }
}`,
    pythonSolution: `def taxableSubtotal(prices, exempt):
    return sum(p for p, e in zip(prices, exempt) if e == 0)`
  },
  {
    number: 33,
    title: 'Vendor Delivery Lead-Time Max',
    fnName: 'worstVendorDelay',
    description: 'Given vendor promised days <code>promised</code> and actual days <code>actual</code>, return the maximum delay <code>max(0, actual[i] - promised[i])</code> across all vendors.',
    constraints: ['1 <= promised.length == actual.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'promised = [5, 10, 7], actual = [4, 15, 9]', output: '5' },
      { title: 'Test Case 2', input: 'promised = [10, 10], actual = [8, 10]', output: '0' },
      { title: 'Test Case 3', input: 'promised = [2], actual = [10]', output: '8' },
      { title: 'Test Case 4', input: 'promised = [3, 3], actual = [3, 3]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int worstVendorDelay(int[] promised, int[] actual) {
        int best = 0;
        for (int i = 0; i < promised.length; i++) best = Math.max(best, actual[i] - promised[i]);
        return best;
    }
}`,
    pythonSolution: `def worstVendorDelay(promised, actual):
    return max([0] + [a - p for p, a in zip(promised, actual)])`
  },
  {
    number: 34,
    title: 'Shopping Cart Duplicate SKU Merge',
    fnName: 'countMergedCartLines',
    description: 'Given scanned SKU IDs <code>skus</code>, consecutive identical SKUs merge into one line item? No: return the number of distinct SKUs in the cart.',
    constraints: ['1 <= skus.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'skus = [10, 20, 10, 30, 20]', output: '3' },
      { title: 'Test Case 2', input: 'skus = [5, 5, 5]', output: '1' },
      { title: 'Test Case 3', input: 'skus = [1, 2, 3, 4]', output: '4' },
      { title: 'Test Case 4', input: 'skus = [99]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countMergedCartLines(int[] skus) {
        Set<Integer> s = new HashSet<>();
        for (int x : skus) s.add(x);
        return s.size();
    }
}`,
    pythonSolution: `def countMergedCartLines(skus):
    return len(set(skus))`
  },
  {
    number: 35,
    title: 'Warehouse Energy Peak Shaving',
    fnName: 'totalExcessKilowatts',
    description: 'Given hourly power readings <code>kw</code> and grid threshold <code>cap</code>, return total kWh above <code>cap</code> across all hours.',
    constraints: ['1 <= kw.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'kw = [100, 150, 120, 80], cap = 110', output: '50' },
      { title: 'Test Case 2', input: 'kw = [50, 60], cap = 100', output: '0' },
      { title: 'Test Case 3', input: 'kw = [200], cap = 150', output: '50' },
      { title: 'Test Case 4', input: 'kw = [100, 100], cap = 100', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalExcessKilowatts(int[] kw, int cap) {
        long s = 0;
        for (int x : kw) if (x > cap) s += x - cap;
        return s;
    }
}`,
    pythonSolution: `def totalExcessKilowatts(kw, cap):
    return sum(max(0, x - cap) for x in kw)`
  },
  {
    number: 36,
    title: 'Supply Chain Bottleneck Link',
    fnName: 'maxDailyShipmentCap',
    description: 'A serial supply chain has <code>n</code> stages with capacities <code>caps</code>. Return the end-to-end throughput capacity (minimum stage capacity).',
    constraints: ['1 <= caps.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'caps = [50, 20, 80, 35]', output: '20' },
      { title: 'Test Case 2', input: 'caps = [100]', output: '100' },
      { title: 'Test Case 3', input: 'caps = [10, 10, 10]', output: '10' },
      { title: 'Test Case 4', input: 'caps = [99, 1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int maxDailyShipmentCap(int[] caps) {
        int mn = caps[0];
        for (int c : caps) mn = Math.min(mn, c);
        return mn;
    }
}`,
    pythonSolution: `def maxDailyShipmentCap(caps):
    return min(caps)`
  },
  {
    number: 37,
    title: 'Black Friday Doorbuster Queue',
    fnName: 'lastServedCustomerIndex',
    description: 'Customers wait with requested quantities <code>req</code>. Store has <code>stock</code> units and serves customers in order until remaining stock is strictly less than the next customer\'s <code>req[i]</code> (stopping immediately). Return how many customers are served.',
    constraints: ['1 <= req.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'req = [3, 4, 5, 2], stock = 8', output: '2' },
      { title: 'Test Case 2', input: 'req = [10, 1], stock = 5', output: '0' },
      { title: 'Test Case 3', input: 'req = [2, 2, 2], stock = 6', output: '3' },
      { title: 'Test Case 4', input: 'req = [1], stock = 10', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int lastServedCustomerIndex(int[] req, long stock) {
        int cnt = 0;
        for (int r : req) {
            if (stock < r) break;
            stock -= r; cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def lastServedCustomerIndex(req, stock):
    cnt = 0
    for r in req:
        if stock < r: break
        stock -= r; cnt += 1
    return cnt`
  },
  {
    number: 38,
    title: 'Store Layout Walkable Cells',
    fnName: 'countWalkableTiles',
    description: 'Given a binary store map <code>grid</code> (<code>0</code> = walkable, <code>1</code> = fixture), return total walkable tiles.',
    constraints: ['1 <= grid.length, grid[0].length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 1, 0], [0, 0, 1]]', output: '4' },
      { title: 'Test Case 2', input: 'grid = [[1, 1], [1, 1]]', output: '0' },
      { title: 'Test Case 3', input: 'grid = [[0]]', output: '1' },
      { title: 'Test Case 4', input: 'grid = [[0, 0], [0, 0]]', output: '4' }
    ],
    javaSolution: `public class Solution {
    public static int countWalkableTiles(int[][] grid) {
        int cnt = 0;
        for (int[] row : grid) for (int v : row) if (v == 0) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countWalkableTiles(grid):
    return sum(1 for row in grid for v in row if v == 0)`
  },
  {
    number: 39,
    title: 'Bulk Discount Tier Difference',
    fnName: 'countEligibleBulkItems',
    description: 'Given item quantities <code>qtys</code> and bulk threshold <code>minQty</code>, return how many line items qualify for bulk pricing (<code>qtys[i] >= minQty</code>).',
    constraints: ['1 <= qtys.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'qtys = [5, 12, 10, 3], minQty = 10', output: '2' },
      { title: 'Test Case 2', input: 'qtys = [1, 2], minQty = 5', output: '0' },
      { title: 'Test Case 3', input: 'qtys = [10], minQty = 10', output: '1' },
      { title: 'Test Case 4', input: 'qtys = [20, 30], minQty = 1', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countEligibleBulkItems(int[] qtys, int minQty) {
        int cnt = 0;
        for (int q : qtys) if (q >= minQty) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countEligibleBulkItems(qtys, minQty):
    return sum(1 for q in qtys if q >= minQty)`
  },
  {
    number: 40,
    title: 'Regional Warehouse Coverage Radius',
    fnName: 'countCoveredStores',
    description: 'Stores sit at 1D coordinates <code>stores</code> and a single hub is at <code>hub</code> with service radius <code>rad</code>. Return how many stores satisfy <code>|stores[i] - hub| <= rad</code>.',
    constraints: ['1 <= stores.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'stores = [10, 25, 30, 50], hub = 25, rad = 10', output: '2' },
      { title: 'Test Case 2', input: 'stores = [0, 100], hub = 50, rad = 40', output: '0' },
      { title: 'Test Case 3', input: 'stores = [15], hub = 15, rad = 0', output: '1' },
      { title: 'Test Case 4', input: 'stores = [5, 15], hub = 10, rad = 5', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countCoveredStores(int[] stores, int hub, int rad) {
        int cnt = 0;
        for (int s : stores) if (Math.abs((long) s - hub) <= rad) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countCoveredStores(stores, hub, rad):
    return sum(1 for s in stores if abs(s - hub) <= rad)`
  },
  {
    number: 41,
    title: 'Inventory Reorder Cost DP',
    fnName: 'maxProfitSelectedSkus',
    description: 'Select non-adjacent SKUs on a shelf with profits <code>profits</code> to maximize total profit (adjacent SKUs cannot both be promoted).',
    constraints: ['1 <= profits.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'profits = [4, 1, 1, 9, 1]', output: '13' },
      { title: 'Test Case 2', input: 'profits = [10, 20, 15]', output: '25' },
      { title: 'Test Case 3', input: 'profits = [7]', output: '7' },
      { title: 'Test Case 4', input: 'profits = [5, 5]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static long maxProfitSelectedSkus(int[] profits) {
        long p2 = 0, p1 = 0;
        for (int x : profits) { long c = Math.max(p1, p2 + x); p2 = p1; p1 = c; }
        return p1;
    }
}`,
    pythonSolution: `def maxProfitSelectedSkus(profits):
    p2 = p1 = 0
    for x in profits: p2, p1 = p1, max(p1, p2 + x)
    return p1`
  },
  {
    number: 42,
    title: 'Pallet Weight Balance Check',
    fnName: 'countHeavyPallets',
    description: 'Given pallet weights <code>weights</code> and safety limit <code>maxW</code>, return how many pallets exceed <code>maxW</code>.',
    constraints: ['1 <= weights.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'weights = [400, 600, 500, 750], maxW = 500', output: '2' },
      { title: 'Test Case 2', input: 'weights = [100, 200], maxW = 300', output: '0' },
      { title: 'Test Case 3', input: 'weights = [501], maxW = 500', output: '1' },
      { title: 'Test Case 4', input: 'weights = [500], maxW = 500', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countHeavyPallets(int[] weights, int maxW) {
        int cnt = 0;
        for (int w : weights) if (w > maxW) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countHeavyPallets(weights, maxW):
    return sum(1 for w in weights if w > maxW)`
  },
  {
    number: 43,
    title: 'Checkout Scan Throughput Rate',
    fnName: 'countFastCashiers',
    description: 'Cashiers scanned <code>items[i]</code> items in <code>mins[i]</code> minutes. Count cashiers scanning at least <code>rate</code> items/min (<code>items[i] >= rate * mins[i]</code>).',
    constraints: ['1 <= items.length == mins.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'items = [100, 50, 120], mins = [10, 10, 10], rate = 10', output: '2' },
      { title: 'Test Case 2', input: 'items = [9], mins = [1], rate = 10', output: '0' },
      { title: 'Test Case 3', input: 'items = [30], mins = [3], rate = 10', output: '1' },
      { title: 'Test Case 4', input: 'items = [20, 40], mins = [1, 2], rate = 20', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countFastCashiers(int[] items, int[] mins, int rate) {
        int cnt = 0;
        for (int i = 0; i < items.length; i++) if (items[i] >= (long) rate * mins[i]) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countFastCashiers(items, mins, rate):
    return sum(1 for it, m in zip(items, mins) if it >= rate * m)`
  },
  {
    number: 44,
    title: 'Store Closing Sale Markdown',
    fnName: 'finalMarkdownTotal',
    description: 'Given item prices <code>prices</code> and discount percent <code>pct</code> (integer floor per item), return total payable.',
    constraints: ['1 <= prices.length <= 10^5', '0 <= pct <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [100, 200, 50], pct = 20', output: '280' },
      { title: 'Test Case 2', input: 'prices = [100], pct = 100', output: '0' },
      { title: 'Test Case 3', input: 'prices = [50, 50], pct = 0', output: '100' },
      { title: 'Test Case 4', input: 'prices = [15], pct = 10', output: '14' }
    ],
    javaSolution: `public class Solution {
    public static long finalMarkdownTotal(int[] prices, int pct) {
        long tot = 0;
        for (int p : prices) tot += p - ((long) p * pct) / 100;
        return tot;
    }
}`,
    pythonSolution: `def finalMarkdownTotal(prices, pct):
    return sum(p - (p * pct) // 100 for p in prices)`
  },
  {
    number: 45,
    title: 'Supply Route Cycle Check',
    fnName: 'hasDirectedSupplyCycle',
    description: 'Given <code>n</code> nodes and directed supply edges <code>edges</code> <code>[u, v]</code>, return <code>true</code> if a directed cycle exists, else <code>false</code>.',
    constraints: ['1 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, edges = [[0, 1], [1, 2], [2, 0]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 3, edges = [[0, 1], [1, 2]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 1, edges = []', output: 'false' },
      { title: 'Test Case 4', input: 'n = 2, edges = [[0, 1], [1, 0]]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean hasDirectedSupplyCycle(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        int[] ind = new int[n];
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); ind[e[1]]++; }
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (ind[i] == 0) q.add(i);
        int vis = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); vis++;
            for (int v : g.get(u)) if (--ind[v] == 0) q.add(v);
        }
        return vis < n;
    }
}`,
    pythonSolution: `from collections import deque
def hasDirectedSupplyCycle(n, edges):
    g = [[] for _ in range(n)]; ind = [0] * n
    for u, v in edges: g[u].append(v); ind[v] += 1
    q = deque([i for i in range(n) if ind[i] == 0]); vis = 0
    while q:
        u = q.popleft(); vis += 1
        for v in g[u]:
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return vis < n`
  },
  {
    number: 46,
    title: 'Express Lane Item Cap Check',
    fnName: 'countExpressEligible',
    description: 'An express lane allows baskets with at most <code>limit</code> items. Given item counts <code>baskets</code>, return how many baskets can use the express lane.',
    constraints: ['1 <= baskets.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'baskets = [5, 10, 11, 2], limit = 10', output: '3' },
      { title: 'Test Case 2', input: 'baskets = [20, 30], limit = 10', output: '0' },
      { title: 'Test Case 3', input: 'baskets = [1], limit = 1', output: '1' },
      { title: 'Test Case 4', input: 'baskets = [0, 5], limit = 5', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countExpressEligible(int[] baskets, int limit) {
        int cnt = 0;
        for (int b : baskets) if (b <= limit) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countExpressEligible(baskets, limit):
    return sum(1 for b in baskets if b <= limit)`
  },
  {
    number: 47,
    title: 'Warehouse Shift Overtime Hours',
    fnName: 'totalOvertimeHours',
    description: 'Given hours worked by employees <code>hours</code> and standard shift <code>stdHours</code>, return total overtime hours <code>sum(max(0, h - stdHours))</code>.',
    constraints: ['1 <= hours.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'hours = [40, 45, 38, 50], stdHours = 40', output: '15' },
      { title: 'Test Case 2', input: 'hours = [30, 35], stdHours = 40', output: '0' },
      { title: 'Test Case 3', input: 'hours = [48], stdHours = 40', output: '8' },
      { title: 'Test Case 4', input: 'hours = [40, 40], stdHours = 40', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalOvertimeHours(int[] hours, int stdHours) {
        long ot = 0;
        for (int h : hours) if (h > stdHours) ot += h - stdHours;
        return ot;
    }
}`,
    pythonSolution: `def totalOvertimeHours(hours, stdHours):
    return sum(max(0, h - stdHours) for h in hours)`
  },
  {
    number: 48,
    title: 'Price Match Guarantee Refund',
    fnName: 'totalPriceMatchRefund',
    description: 'Given paid prices <code>paid</code> and competitor prices <code>comp</code>, Walmart refunds <code>max(0, paid[i] - comp[i])</code> per item. Return total refund.',
    constraints: ['1 <= paid.length == comp.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'paid = [100, 50, 80], comp = [90, 60, 75]', output: '15' },
      { title: 'Test Case 2', input: 'paid = [20, 30], comp = [25, 35]', output: '0' },
      { title: 'Test Case 3', input: 'paid = [50], comp = [10]', output: '40' },
      { title: 'Test Case 4', input: 'paid = [10], comp = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long totalPriceMatchRefund(int[] paid, int[] comp) {
        long ref = 0;
        for (int i = 0; i < paid.length; i++) if (paid[i] > comp[i]) ref += paid[i] - comp[i];
        return ref;
    }
}`,
    pythonSolution: `def totalPriceMatchRefund(paid, comp):
    return sum(max(0, p - c) for p, c in zip(paid, comp))`
  },
  {
    number: 49,
    title: 'Pallet Forklift Shortest Grid Exit',
    fnName: 'minStepsToLoadingDock',
    description: 'In an <code>R x C</code> warehouse <code>grid</code> (<code>0</code> = aisle, <code>1</code> = rack), a forklift starts at <code>(0, 0)</code> and must reach dock <code>(R-1, C-1)</code>. Can it reach in at most <code>maxSteps</code>? Return <code>true</code> or <code>false</code>.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[0, 0, 0], [1, 1, 0], [0, 0, 0]], maxSteps = 4', output: 'true' },
      { title: 'Test Case 2', input: 'grid = [[0, 0, 0], [1, 1, 0], [0, 0, 0]], maxSteps = 3', output: 'false' },
      { title: 'Test Case 3', input: 'grid = [[0, 1], [1, 0]], maxSteps = 10', output: 'false' },
      { title: 'Test Case 4', input: 'grid = [[0]], maxSteps = 0', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean minStepsToLoadingDock(int[][] grid, int maxSteps) {
        int R = grid.length, C = grid[0].length;
        if (grid[0][0] == 1 || grid[R - 1][C - 1] == 1) return false;
        if (R == 1 && C == 1) return maxSteps >= 0;
        boolean[][] vis = new boolean[R][C];
        Queue<int[]> q = new ArrayDeque<>();
        vis[0][0] = true; q.add(new int[]{0, 0, 0});
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            if (cur[2] >= maxSteps) continue;
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && !vis[nr][nc] && grid[nr][nc] == 0) {
                    if (nr == R - 1 && nc == C - 1) return true;
                    vis[nr][nc] = true; q.add(new int[]{nr, nc, cur[2] + 1});
                }
            }
        }
        return false;
    }
}`,
    pythonSolution: `from collections import deque
def minStepsToLoadingDock(grid, maxSteps):
    R, C = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[R-1][C-1] == 1: return False
    if R == 1 and C == 1: return maxSteps >= 0
    vis = {(0, 0)}; q = deque([(0, 0, 0)])
    while q:
        r, c, d = q.popleft()
        if d >= maxSteps: continue
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and (nr, nc) not in vis and grid[nr][nc] == 0:
                if nr == R - 1 and nc == C - 1: return True
                vis.add((nr, nc)); q.append((nr, nc, d + 1))
    return False`
  },
  {
    number: 50,
    title: 'Multi-Store Inventory Equilibrium',
    fnName: 'minTransfersToEqualize',
    description: '<code>n</code> stores have stock <code>stocks</code> (total divisible by <code>n</code>). In one move, 1 unit moves from any store to any other. Return minimum moves to equalize all stores.',
    constraints: ['1 <= stocks.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'stocks = [10, 2, 6]', output: '4' },
      { title: 'Test Case 2', input: 'stocks = [5, 5, 5]', output: '0' },
      { title: 'Test Case 3', input: 'stocks = [0, 8]', output: '4' },
      { title: 'Test Case 4', input: 'stocks = [7]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static long minTransfersToEqualize(int[] stocks) {
        long s = 0; for (int x : stocks) s += x;
        long avg = s / stocks.length, moves = 0;
        for (int x : stocks) if (x > avg) moves += x - avg;
        return moves;
    }
}`,
    pythonSolution: `def minTransfersToEqualize(stocks):
    avg = sum(stocks) // len(stocks)
    return sum(x - avg for x in stocks if x > avg)`
  }
];
