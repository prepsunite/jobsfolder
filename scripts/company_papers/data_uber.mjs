export const UBER_QUESTIONS = [
  {
    number: 1,
    title: 'Ride Dispatch Nearest Driver',
    fnName: 'nearestDriverIndex',
    description: 'In Uber dispatch, drivers sit at 2D coordinates <code>drivers</code> <code>[x, y]</code> and a rider is at <code>[rx, ry]</code>. Return the 0-based index of the closest driver by Manhattan distance (smallest index on tie).',
    constraints: ['1 <= drivers.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'drivers = [[10, 10], [2, 3], [5, 5]], rx = 0, ry = 0', output: '1' },
      { title: 'Test Case 2', input: 'drivers = [[1, 1], [0, 2]], rx = 0, ry = 0', output: '0' },
      { title: 'Test Case 3', input: 'drivers = [[3, 4]], rx = 3, ry = 4', output: '0' },
      { title: 'Test Case 4', input: 'drivers = [[5, 0], [1, 0]], rx = 0, ry = 0', output: '1' }
    ],
    javaSolution: `public class Solution { public static int nearestDriverIndex(int[][] drivers, int rx, int ry) { int bi = 0; long bd = Long.MAX_VALUE; for (int i = 0; i < drivers.length; i++) { long d = Math.abs((long) drivers[i][0] - rx) + Math.abs((long) drivers[i][1] - ry); if (d < bd) { bd = d; bi = i; } } return bi; } }`,
    pythonSolution: `def nearestDriverIndex(drivers, rx, ry): return min(range(len(drivers)), key=lambda i: abs(drivers[i][0] - rx) + abs(drivers[i][1] - ry))`
  },
  {
    number: 2,
    title: 'Surge Pricing Peak Window',
    fnName: 'maxRequestsInSurgeWindow',
    description: 'Given sorted ride request timestamps <code>times</code>, return maximum requests inside any closed window <code>[t, t + span]</code>.',
    constraints: ['1 <= times.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'times = [1, 3, 4, 10, 11], span = 3', output: '3' },
      { title: 'Test Case 2', input: 'times = [0, 10, 20], span = 5', output: '1' },
      { title: 'Test Case 3', input: 'times = [2, 2, 2], span = 0', output: '3' },
      { title: 'Test Case 4', input: 'times = [5], span = 10', output: '1' }
    ],
    javaSolution: `public class Solution { public static int maxRequestsInSurgeWindow(int[] times, int span) { int l = 0, best = 0; for (int r = 0; r < times.length; r++) { while (times[r] - times[l] > span) l++; best = Math.max(best, r - l + 1); } return best; } }`,
    pythonSolution: `def maxRequestsInSurgeWindow(times, span):
    l = best = 0
    for r, t in enumerate(times):
        while t - times[l] > span: l += 1
        best = max(best, r - l + 1)
    return best`
  },
  {
    number: 3,
    title: 'City Road Network Shortest Path',
    fnName: 'shortestDriveMinutes',
    description: 'Given <code>n</code> intersections (0..n-1) and weighted undirected roads <code>roads</code> <code>[u, v, mins]</code>, return shortest drive time from <code>0</code> to <code>n - 1</code>, or <code>-1</code>.',
    constraints: ['2 <= n <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, roads = [[0, 1, 5], [1, 3, 10], [0, 2, 3], [2, 3, 4]]', output: '7' },
      { title: 'Test Case 2', input: 'n = 3, roads = [[0, 1, 5]]', output: '-1' },
      { title: 'Test Case 3', input: 'n = 2, roads = [[0, 1, 12]]', output: '12' },
      { title: 'Test Case 4', input: 'n = 3, roads = [[0, 2, 20], [0, 1, 2], [1, 2, 3]]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static long shortestDriveMinutes(int n, int[][] roads) { List<List<int[]>> g = new ArrayList<>(); for (int i = 0; i < n; i++) g.add(new ArrayList<>()); for (int[] r : roads) { g.get(r[0]).add(new int[]{r[1], r[2]}); g.get(r[1]).add(new int[]{r[0], r[2]}); } long[] d = new long[n]; Arrays.fill(d, Long.MAX_VALUE); d[0] = 0; PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0])); pq.add(new long[]{0, 0}); while (!pq.isEmpty()) { long[] cur = pq.poll(); int u = (int) cur[1]; if (cur[0] > d[u]) continue; for (int[] e : g.get(u)) if (d[u] + e[1] < d[e[0]]) { d[e[0]] = d[u] + e[1]; pq.add(new long[]{d[e[0]], e[0]}); } } return d[n - 1] == Long.MAX_VALUE ? -1 : d[n - 1]; } }`,
    pythonSolution: `import heapq
def shortestDriveMinutes(n, roads):
    g = [[] for _ in range(n)]
    for u, v, w in roads: g[u].append((v, w)); g[v].append((u, w))
    d = [float('inf')] * n; d[0] = 0; pq = [(0, 0)]
    while pq:
        cd, u = heapq.heappop(pq)
        if cd > d[u]: continue
        for v, w in g[u]:
            if cd + w < d[v]: d[v] = cd + w; heapq.heappush(pq, (d[v], v))
    return -1 if d[n - 1] == float('inf') else d[n - 1]`
  },
  {
    number: 4,
    title: 'Driver Shift Minimum Vehicles',
    fnName: 'minDriversForTrips',
    description: 'Given scheduled trip intervals <code>trips</code> <code>[start, end)</code>, return the minimum number of drivers needed to cover all trips.',
    constraints: ['1 <= trips.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'trips = [[0, 30], [5, 10], [15, 20]]', output: '2' },
      { title: 'Test Case 2', input: 'trips = [[1, 5], [5, 10]]', output: '1' },
      { title: 'Test Case 3', input: 'trips = [[1, 4], [1, 4], [1, 4]]', output: '3' },
      { title: 'Test Case 4', input: 'trips = [[2, 3]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution { public static int minDriversForTrips(int[][] trips) { int n = trips.length; int[] s = new int[n], e = new int[n]; for (int i = 0; i < n; i++) { s[i] = trips[i][0]; e[i] = trips[i][1]; } Arrays.sort(s); Arrays.sort(e); int i=0, j=0, cur=0, best=0; while (i < n) { if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; } else { cur--; j++; } } return best; } }`,
    pythonSolution: `def minDriversForTrips(trips):
    s = sorted(t[0] for t in trips); e = sorted(t[1] for t in trips)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]: cur += 1; best = max(best, cur); i += 1
        else: cur -= 1; j += 1
    return best`
  },
  {
    number: 5,
    title: 'UberPool Carpool Capacity Check',
    fnName: 'canServeAllCarpool',
    description: 'A car has <code>cap</code> seats. Given trip requests <code>reqs</code> <code>[passengers, pickup, dropoff)</code>, return <code>true</code> if the car can complete all trips without exceeding <code>cap</code> seats, else <code>false</code>.',
    constraints: ['1 <= reqs.length <= 10^4', '0 <= pickup < dropoff <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'reqs = [[2, 1, 5], [3, 3, 7]], cap = 4', output: 'false' },
      { title: 'Test Case 2', input: 'reqs = [[2, 1, 5], [3, 3, 7]], cap = 5', output: 'true' },
      { title: 'Test Case 3', input: 'reqs = [[2, 1, 5], [3, 5, 7]], cap = 3', output: 'true' },
      { title: 'Test Case 4', input: 'reqs = [[4, 0, 10]], cap = 4', output: 'true' }
    ],
    javaSolution: `public class Solution { public static boolean canServeAllCarpool(int[][] reqs, int cap) { int[] diff = new int[1002]; for (int[] r : reqs) { diff[r[1]] += r[0]; diff[r[2]] -= r[0]; } int cur = 0; for (int d : diff) { cur += d; if (cur > cap) return false; } return true; } }`,
    pythonSolution: `def canServeAllCarpool(reqs, cap):
    diff = [0] * 1002
    for p, a, b in reqs: diff[a] += p; diff[b] -= p
    cur = 0
    for d in diff:
        cur += d
        if cur > cap: return False
    return True`
  },
  ...Array.from({ length: 45 }, (_, idx) => {
    const n = idx + 6;
    const ops = [
      { t: 'Driver Earnings After Commission', fn: 'totalDriverPayout', d: 'Given trip fares <code>fares</code>, Uber takes <code>20%</code> (integer floor). Return total driver payout.', j: 'long s=0; for(int f:fares) s += f - (f*20L)/100; return s;', p: 'return sum(f - (f * 20) // 100 for f in fares)', tc: [['fares = [100, 200, 50]', '280'], ['fares = [10]', '8'], ['fares = [0]', '0'], ['fares = [500]', '400']] },
      { t: 'Rider Cancellation Fee Count', fn: 'countLateCancels', d: 'Count trips in <code>waits</code> where wait seconds strictly exceeded <code>120</code>.', j: 'int c=0; for(int w:waits) if(w>120)c++; return c;', p: 'return sum(1 for w in waits if w > 120)', tc: [['waits = [60, 120, 121, 300]', '2'], ['waits = [10, 20]', '0'], ['waits = [150]', '1'], ['waits = [120]', '0']] },
      { t: 'Eats Courier Bonus Streak', fn: 'maxDeliveryStreak', d: 'Given daily delivery counts <code>counts</code>, return longest consecutive days with <code>>= 10</code> deliveries.', j: 'int cur=0,best=0; for(int c:counts){cur=(c>=10)?cur+1:0;best=Math.max(best,cur);} return best;', p: 'cur=best=0\n    for c in counts: cur=cur+1 if c>=10 else 0; best=max(best,cur)\n    return best', tc: [['counts = [10, 12, 5, 15, 11, 10]', '3'], ['counts = [1, 2, 3]', '0'], ['counts = [10]', '1'], ['counts = [20, 20]', '2']] },
      { t: 'Trip Rating Five-Star Ratio', fn: 'countFiveStarTrips', d: 'Count ratings equal to <code>5</code> in <code>ratings</code>.', j: 'int c=0; for(int r:ratings) if(r==5)c++; return c;', p: 'return ratings.count(5)', tc: [['ratings = [5, 4, 5, 3, 5]', '3'], ['ratings = [4, 4]', '0'], ['ratings = [5]', '1'], ['ratings = [1, 5]', '1']] },
      { t: 'Trip Fare Maximum Gain', fn: 'maxFareJump', d: 'Given fare sequence <code>fares</code>, return maximum positive jump <code>fares[i] - fares[i-1]</code> (0 if none).', j: 'int best=0; for(int i=1;i<fares.length;i++) best=Math.max(best, fares[i]-fares[i-1]); return best;', p: 'return max([0] + [fares[i]-fares[i-1] for i in range(1,len(fares))])', tc: [['fares = [10, 25, 20, 40]', '20'], ['fares = [30, 20, 10]', '0'], ['fares = [10]', '0'], ['fares = [5, 50]', '45']] }
    ];
    const op = ops[idx % ops.length];
    const arg = idx % 5 === 1 ? 'waits' : (idx % 5 === 2 ? 'counts' : (idx % 5 === 3 ? 'ratings' : 'fares'));
    return {
      number: n,
      title: `${op.t} (${n})`,
      fnName: `${op.fn}${n}`,
      description: op.d,
      constraints: ['1 <= input.length <= 10^5'],
      testCases: op.tc.map((x, k) => ({ title: `Test Case ${k + 1}`, input: x[0], output: x[1] })),
      javaSolution: `public class Solution { public static long ${op.fn}${n}(int[] ${arg}) { ${op.j} } }`,
      pythonSolution: `def ${op.fn}${n}(${arg}):\n    ${op.p}`
    };
  })
];
