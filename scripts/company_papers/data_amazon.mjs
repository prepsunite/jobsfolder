// 50 Original Medium, Hard & Extreme Questions for Amazon SDE OA & Interviews
export const AMAZON_QUESTIONS = [
  // ── ROUND 1: OA Coding — Medium & Hard (Q1–Q15) ──────────────────────────
  {
    number: 1,
    difficulty: 'MEDIUM',
    title: 'Fulfillment Center Parcel Consolidation',
    fnName: 'minParcelMergeCost',
    description: 'An Amazon fulfillment center has <code>n</code> parcel bins with weights <code>weights[i]</code>. In one operation you merge any two adjacent bins into one bin with weight equal to their sum, paying a cost equal to the new bin weight. Return the minimum total cost to merge all bins into a single bin.',
    constraints: ['1 <= n <= 100', '1 <= weights[i] <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[4, 3, 2, 6]', output: '29' },
      { title: 'Sample 2', input: '[1, 2, 3]', output: '9' },
      { title: 'Single bin', input: '[10]', output: '0' },
      { title: 'Two bins', input: '[5, 8]', output: '13' },
    ],
    javaSolution: `class Solution {
    public int minParcelMergeCost(int[] weights) {
        int n = weights.length;
        if (n <= 1) return 0;
        int[] pref = new int[n + 1];
        for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + weights[i];
        int[][] dp = new int[n][n];
        for (int len = 2; len <= n; len++) {
            for (int l = 0; l + len - 1 < n; l++) {
                int r = l + len - 1;
                dp[l][r] = Integer.MAX_VALUE;
                int sum = pref[r + 1] - pref[l];
                for (int k = l; k < r; k++) {
                    dp[l][r] = Math.min(dp[l][r], dp[l][k] + dp[k + 1][r] + sum);
                }
            }
        }
        return dp[0][n - 1];
    }
}`,
    pythonSolution: `def minParcelMergeCost(weights):
    n = len(weights)
    if n <= 1:
        return 0
    pref = [0] * (n + 1)
    for i, w in enumerate(weights):
        pref[i + 1] = pref[i] + w
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for l in range(n - length + 1):
            r = l + length - 1
            total = pref[r + 1] - pref[l]
            best = 10**18
            for k in range(l, r):
                cost = dp[l][k] + dp[k + 1][r] + total
                if cost < best:
                    best = cost
            dp[l][r] = best
    return dp[0][n - 1]`
  },
  {
    number: 2,
    difficulty: 'MEDIUM',
    title: 'Prime Video Adaptive Bitrate Window',
    fnName: 'maxQualityWindow',
    description: 'Given streaming segment bitrates <code>rates</code> and a bandwidth variance limit <code>k</code>, return the length of the longest contiguous subarray where <code>max(subarray) - min(subarray) <= k</code>.',
    constraints: ['1 <= len(rates) <= 10^5', '0 <= k <= 10^9', '1 <= rates[i] <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[8, 2, 4, 7], 4', output: '2' },
      { title: 'Sample 2', input: '[10, 1, 2, 4, 7, 2], 5', output: '4' },
      { title: 'All equal', input: '[5, 5, 5, 5], 0', output: '4' },
      { title: 'Zero variance', input: '[1, 3, 2, 4], 0', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxQualityWindow(int[] rates, int k) {
        Deque<Integer> maxD = new ArrayDeque<>(), minD = new ArrayDeque<>();
        int l = 0, ans = 0;
        for (int r = 0; r < rates.length; r++) {
            while (!maxD.isEmpty() && rates[maxD.peekLast()] <= rates[r]) maxD.pollLast();
            while (!minD.isEmpty() && rates[minD.peekLast()] >= rates[r]) minD.pollLast();
            maxD.addLast(r); minD.addLast(r);
            while (rates[maxD.peekFirst()] - rates[minD.peekFirst()] > k) {
                l++;
                if (maxD.peekFirst() < l) maxD.pollFirst();
                if (minD.peekFirst() < l) minD.pollFirst();
            }
            ans = Math.max(ans, r - l + 1);
        }
        return ans;
    }
}`,
    pythonSolution: `from collections import deque

def maxQualityWindow(rates, k):
    max_d, min_d = deque(), deque()
    l = 0
    ans = 0
    for r, v in enumerate(rates):
        while max_d and rates[max_d[-1]] <= v:
            max_d.pop()
        while min_d and rates[min_d[-1]] >= v:
            min_d.pop()
        max_d.append(r)
        min_d.append(r)
        while rates[max_d[0]] - rates[min_d[0]] > k:
            l += 1
            if max_d[0] < l:
                max_d.popleft()
            if min_d[0] < l:
                min_d.popleft()
        ans = max(ans, r - l + 1)
    return ans`
  },
  {
    number: 3,
    difficulty: 'MEDIUM',
    title: 'AWS Auto-Scaling Fleet Capacity',
    fnName: 'minMaxLoadPerServer',
    description: 'You have <code>tasks</code> where <code>tasks[i]</code> is the CPU load of task <code>i</code>, and <code>k</code> identical EC2 instances. Each instance must execute a contiguous block of tasks (or 0 tasks). Minimize the maximum total load assigned to any single instance.',
    constraints: ['1 <= len(tasks) <= 10^5', '1 <= k <= len(tasks)', '1 <= tasks[i] <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '[7, 2, 5, 10, 8], 2', output: '18' },
      { title: 'Sample 2', input: '[1, 2, 3, 4, 5], 2', output: '9' },
      { title: 'One per server', input: '[10, 20, 30], 3', output: '30' },
      { title: 'Single server', input: '[4, 6, 5], 1', output: '15' },
    ],
    javaSolution: `class Solution {
    public int minMaxLoadPerServer(int[] tasks, int k) {
        int lo = 0, hi = 0;
        for (int t : tasks) { lo = Math.max(lo, t); hi += t; }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int needed = 1, cur = 0;
            for (int t : tasks) {
                if (cur + t > mid) { needed++; cur = t; }
                else cur += t;
            }
            if (needed <= k) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def minMaxLoadPerServer(tasks, k):
    lo, hi = max(tasks), sum(tasks)
    while lo < hi:
        mid = (lo + hi) // 2
        needed, cur = 1, 0
        for t in tasks:
            if cur + t > mid:
                needed += 1
                cur = t
            else:
                cur += t
        if needed <= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },
  {
    number: 4,
    difficulty: 'MEDIUM',
    title: 'DynamoDB Partition Hot-Key Throttling',
    fnName: 'minDispatchTime',
    description: 'Given a list of partition key characters <code>keys</code> and a cooldown <code>n</code> between identical partition writes, each write or idle slot takes 1 unit of time. Return the minimum total time units required to finish all writes.',
    constraints: ['1 <= len(keys) <= 10^4', '0 <= n <= 100'],
    testCases: [
      { title: 'Sample 1', input: '["A","A","A","B","B","B"], 2', output: '8' },
      { title: 'Zero cooldown', input: '["A","A","A","B","B","B"], 0', output: '6' },
      { title: 'High cooldown', input: '["A","A","A","B","B","B"], 3', output: '10' },
      { title: 'All unique', input: '["A","B","C","D"], 2', output: '4' },
    ],
    javaSolution: `class Solution {
    public int minDispatchTime(String[] keys, int n) {
        int[] freq = new int[26];
        int maxF = 0, countMax = 0;
        for (String k : keys) {
            int idx = k.charAt(0) - 'A';
            freq[idx]++;
            if (freq[idx] > maxF) { maxF = freq[idx]; countMax = 1; }
            else if (freq[idx] == maxF) countMax++;
        }
        return Math.max(keys.length, (maxF - 1) * (n + 1) + countMax);
    }
}`,
    pythonSolution: `from collections import Counter

def minDispatchTime(keys, n):
    counts = Counter(keys)
    max_f = max(counts.values())
    count_max = sum(1 for v in counts.values() if v == max_f)
    return max(len(keys), (max_f - 1) * (n + 1) + count_max)`
  },
  {
    number: 5,
    difficulty: 'MEDIUM',
    title: 'Kiva Robot Warehouse Grid Paths',
    fnName: 'uniqueRobotRoutes',
    description: 'A Kiva robot starts at <code>(0, 0)</code> in an <code>m x n</code> warehouse grid where <code>1</code> marks blocked shelving and <code>0</code> marks an open aisle. Moving only right or down, return the number of distinct routes to <code>(m-1, n-1)</code>.',
    constraints: ['1 <= m, n <= 100', 'grid[i][j] in {0, 1}'],
    testCases: [
      { title: 'Sample 1', input: '[[0,0,0],[0,1,0],[0,0,0]]', output: '2' },
      { title: 'Blocked start', input: '[[1,0],[0,0]]', output: '0' },
      { title: 'Open 2x2', input: '[[0,0],[0,0]]', output: '2' },
      { title: 'Blocked end', input: '[[0,0],[0,1]]', output: '0' },
    ],
    javaSolution: `class Solution {
    public int uniqueRobotRoutes(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] dp = new int[n];
        dp[0] = grid[0][0] == 0 ? 1 : 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) dp[j] = 0;
                else if (j > 0) dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }
}`,
    pythonSolution: `def uniqueRobotRoutes(grid):
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    dp[0] = 1 if grid[0][0] == 0 else 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j - 1]
    return dp[n - 1]`
  },
  {
    number: 6,
    difficulty: 'HARD',
    title: 'Delivery Drone Battery Charging Stops',
    fnName: 'minChargingStops',
    description: 'An Amazon Prime Air drone must fly <code>target</code> miles starting with <code>startFuel</code> units of charge. Charging stations along the route are given as <code>[position, charge]</code>. Return the minimum number of stops required to reach <code>target</code>, or <code>-1</code> if impossible.',
    constraints: ['1 <= target, startFuel <= 10^9', '0 <= len(stations) <= 500'],
    testCases: [
      { title: 'Sample 1', input: '100, 10, [[10,60],[20,30],[30,30],[60,40]]', output: '2' },
      { title: 'Impossible', input: '100, 1, [[10,100]]', output: '-1' },
      { title: 'Direct flight', input: '50, 50, []', output: '0' },
      { title: 'Single stop', input: '100, 50, [[25,25],[50,50]]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minChargingStops(int target, int startFuel, int[][] stations) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        int fuel = startFuel, stops = 0, i = 0;
        while (fuel < target) {
            while (i < stations.length && stations[i][0] <= fuel) pq.offer(stations[i++][1]);
            if (pq.isEmpty()) return -1;
            fuel += pq.poll();
            stops++;
        }
        return stops;
    }
}`,
    pythonSolution: `import heapq

def minChargingStops(target, startFuel, stations):
    pq = []
    fuel = startFuel
    stops = 0
    i = 0
    while fuel < target:
        while i < len(stations) and stations[i][0] <= fuel:
            heapq.heappush(pq, -stations[i][1])
            i += 1
        if not pq:
            return -1
        fuel += -heapq.heappop(pq)
        stops += 1
    return stops`
  },
  {
    number: 7,
    difficulty: 'HARD',
    title: 'S3 Glacier Storage Minimum Cost Merge',
    fnName: 'minKWayMergeCost',
    description: 'Given object shard sizes <code>stones</code> and an integer <code>k</code>, in one move you merge <code>k</code> consecutive shards into one shard of their sum, paying that sum. Return the minimum cost to merge all shards into one, or <code>-1</code> if impossible.',
    constraints: ['1 <= len(stones) <= 30', '2 <= k <= 30', '1 <= stones[i] <= 100'],
    testCases: [
      { title: 'Sample 1', input: '[3, 2, 4, 1], 2', output: '20' },
      { title: 'Impossible', input: '[3, 2, 4, 1], 3', output: '-1' },
      { title: 'Sample 3', input: '[3, 5, 1, 2, 6], 3', output: '25' },
      { title: 'Single shard', input: '[5], 2', output: '0' },
    ],
    javaSolution: `class Solution {
    public int minKWayMergeCost(int[] stones, int k) {
        int n = stones.length;
        if ((n - 1) % (k - 1) != 0) return -1;
        int[] pref = new int[n + 1];
        for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + stones[i];
        int[][] dp = new int[n][n];
        for (int len = k; len <= n; len++) {
            for (int l = 0; l + len - 1 < n; l++) {
                int r = l + len - 1;
                dp[l][r] = Integer.MAX_VALUE;
                for (int mid = l; mid < r; mid += k - 1) {
                    dp[l][r] = Math.min(dp[l][r], dp[l][mid] + dp[mid + 1][r]);
                }
                if ((r - l) % (k - 1) == 0) dp[l][r] += pref[r + 1] - pref[l];
            }
        }
        return dp[0][n - 1];
    }
}`,
    pythonSolution: `def minKWayMergeCost(stones, k):
    n = len(stones)
    if (n - 1) % (k - 1) != 0:
        return -1
    pref = [0] * (n + 1)
    for i, s in enumerate(stones):
        pref[i + 1] = pref[i] + s
    dp = [[0] * n for _ in range(n)]
    for length in range(k, n + 1):
        for l in range(n - length + 1):
            r = l + length - 1
            best = 10**18
            for mid in range(l, r, k - 1):
                val = dp[l][mid] + dp[mid + 1][r]
                if val < best:
                    best = val
            if (r - l) % (k - 1) == 0:
                best += pref[r + 1] - pref[l]
            dp[l][r] = best
    return dp[0][n - 1]`
  },
  {
    number: 8,
    difficulty: 'MEDIUM',
    title: 'CloudWatch Log Burst Anomaly Count',
    fnName: 'countSubarraysWithKDistinct',
    description: 'Given a stream of service error codes <code>codes</code> and an integer <code>k</code>, return the number of contiguous subarrays that contain <strong>exactly</strong> <code>k</code> distinct error codes.',
    constraints: ['1 <= len(codes) <= 2 * 10^4', '1 <= k <= len(codes)'],
    testCases: [
      { title: 'Sample 1', input: '[1, 2, 1, 2, 3], 2', output: '7' },
      { title: 'Sample 2', input: '[1, 2, 1, 3, 4], 3', output: '3' },
      { title: 'Single code', input: '[1, 1, 1], 1', output: '6' },
      { title: 'No match', input: '[1, 2, 1], 3', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    private int atMost(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        int l = 0, res = 0;
        for (int r = 0; r < nums.length; r++) {
            cnt.put(nums[r], cnt.getOrDefault(nums[r], 0) + 1);
            while (cnt.size() > k) {
                cnt.put(nums[l], cnt.get(nums[l]) - 1);
                if (cnt.get(nums[l]) == 0) cnt.remove(nums[l]);
                l++;
            }
            res += r - l + 1;
        }
        return res;
    }
    public int countSubarraysWithKDistinct(int[] codes, int k) {
        return atMost(codes, k) - atMost(codes, k - 1);
    }
}`,
    pythonSolution: `from collections import defaultdict

def countSubarraysWithKDistinct(codes, k):
    def at_most(limit):
        cnt = defaultdict(int)
        l = 0
        res = 0
        distinct = 0
        for r, x in enumerate(codes):
            if cnt[x] == 0:
                distinct += 1
            cnt[x] += 1
            while distinct > limit:
                cnt[codes[l]] -= 1
                if cnt[codes[l]] == 0:
                    distinct -= 1
                l += 1
            res += r - l + 1
        return res
    return at_most(k) - at_most(k - 1)`
  },
  {
    number: 9,
    difficulty: 'HARD',
    title: 'Prime Logistics Route Minimum Cost With Discounts',
    fnName: 'minRouteCostWithDiscounts',
    description: 'Given <code>n</code> hubs, undirected weighted routes <code>[u, v, cost]</code>, and <code>k</code> discount vouchers (each halves a single edge cost using integer floor division <code>cost // 2</code>), return the minimum cost from hub <code>0</code> to hub <code>n - 1</code>, or <code>-1</code> if unreachable.',
    constraints: ['1 <= n <= 500', '0 <= k <= 10', '1 <= cost <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '3, [[0,1,10],[1,2,10],[0,2,25]], 1', output: '12' },
      { title: 'No discounts', input: '3, [[0,1,10],[1,2,10]], 0', output: '20' },
      { title: 'Unreachable', input: '3, [[0,1,5]], 1', output: '-1' },
      { title: 'Two discounts', input: '3, [[0,1,10],[1,2,10]], 2', output: '10' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minRouteCostWithDiscounts(int n, int[][] edges, int k) {
        List<int[]>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(new int[]{e[1], e[2]}); g[e[1]].add(new int[]{e[0], e[2]}); }
        int[][] dist = new int[n][k + 1];
        for (int[] r : dist) Arrays.fill(r, Integer.MAX_VALUE);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        dist[0][0] = 0; pq.offer(new int[]{0, 0, 0});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], u = cur[1], used = cur[2];
            if (d > dist[u][used]) continue;
            if (u == n - 1) return d;
            for (int[] nb : g[u]) {
                int v = nb[0], w = nb[1];
                if (d + w < dist[v][used]) {
                    dist[v][used] = d + w;
                    pq.offer(new int[]{d + w, v, used});
                }
                if (used < k && d + w / 2 < dist[v][used + 1]) {
                    dist[v][used + 1] = d + w / 2;
                    pq.offer(new int[]{d + w / 2, v, used + 1});
                }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `import heapq

def minRouteCostWithDiscounts(n, edges, k):
    g = [[] for _ in range(n)]
    for u, v, w in edges:
        g[u].append((v, w))
        g[v].append((u, w))
    INF = 10**18
    dist = [[INF] * (k + 1) for _ in range(n)]
    dist[0][0] = 0
    pq = [(0, 0, 0)]
    while pq:
        d, u, used = heapq.heappop(pq)
        if d > dist[u][used]:
            continue
        if u == n - 1:
            return d
        for v, w in g[u]:
            if d + w < dist[v][used]:
                dist[v][used] = d + w
                heapq.heappush(pq, (d + w, v, used))
            if used < k and d + (w // 2) < dist[v][used + 1]:
                dist[v][used + 1] = d + (w // 2)
                heapq.heappush(pq, (d + (w // 2), v, used + 1))
    return -1`
  },
  {
    number: 10,
    difficulty: 'MEDIUM',
    title: 'Order Book Monotonic Histogram',
    fnName: 'largestRectangleArea',
    description: 'Given bar heights representing warehouse rack capacities <code>heights</code> of width 1, return the area of the largest contiguous rectangular storage block.',
    constraints: ['1 <= len(heights) <= 10^5', '0 <= heights[i] <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[2, 1, 5, 6, 2, 3]', output: '10' },
      { title: 'Sample 2', input: '[2, 4]', output: '4' },
      { title: 'Single bar', input: '[7]', output: '7' },
      { title: 'Flat', input: '[3, 3, 3]', output: '9' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int largestRectangleArea(int[] heights) {
        Deque<Integer> st = new ArrayDeque<>();
        int maxA = 0, n = heights.length;
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!st.isEmpty() && heights[st.peek()] >= h) {
                int height = heights[st.pop()];
                int width = st.isEmpty() ? i : i - st.peek() - 1;
                maxA = Math.max(maxA, height * width);
            }
            st.push(i);
        }
        return maxA;
    }
}`,
    pythonSolution: `def largestRectangleArea(heights):
    st = []
    max_a = 0
    for i, h in enumerate(heights + [0]):
        while st and heights[st[-1]] >= h:
            height = heights[st.pop()]
            width = i if not st else i - st[-1] - 1
            max_a = max(max_a, height * width)
        st.append(i)
    return max_a`
  },
  {
    number: 11,
    difficulty: 'MEDIUM',
    title: 'Kindle Page Pagination Minimum Days',
    fnName: 'minDaysToReadChapters',
    description: 'You have <code>n</code> chapters with page counts <code>pages</code> and <code>d</code> days. Each day you read at least one chapter in order, and a day cost is the maximum pages among chapters read that day. Return the minimum total sum of daily costs over <code>d</code> days, or <code>-1</code> if <code>n < d</code>.',
    constraints: ['1 <= len(pages) <= 300', '1 <= d <= 10', '0 <= pages[i] <= 1000'],
    testCases: [
      { title: 'Sample 1', input: '[6, 5, 4, 3, 2, 1], 2', output: '7' },
      { title: 'Impossible', input: '[9, 9, 9], 4', output: '-1' },
      { title: 'Single day', input: '[1, 1, 1], 3', output: '3' },
      { title: 'Sample 4', input: '[7, 1, 7, 1, 7, 1], 3', output: '15' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minDaysToReadChapters(int[] pages, int d) {
        int n = pages.length;
        if (n < d) return -1;
        int[][] dp = new int[d + 1][n + 1];
        for (int[] r : dp) Arrays.fill(r, 100000000);
        dp[0][0] = 0;
        for (int day = 1; day <= d; day++) {
            for (int i = day; i <= n; i++) {
                int maxP = 0;
                for (int j = i - 1; j >= day - 1; j--) {
                    maxP = Math.max(maxP, pages[j]);
                    dp[day][i] = Math.min(dp[day][i], dp[day - 1][j] + maxP);
                }
            }
        }
        return dp[d][n];
    }
}`,
    pythonSolution: `def minDaysToReadChapters(pages, d):
    n = len(pages)
    if n < d:
        return -1
    INF = 10**9
    dp = [INF] * (n + 1)
    dp[0] = 0
    for day in range(1, d + 1):
        ndp = [INF] * (n + 1)
        for i in range(day, n + 1):
            max_p = 0
            for j in range(i - 1, day - 2, -1):
                max_p = max(max_p, pages[j])
                ndp[i] = min(ndp[i], dp[j] + max_p)
        dp = ndp
    return dp[n]`
  },
  {
    number: 12,
    difficulty: 'HARD',
    title: 'SQS Dead-Letter Queue Dependency Order',
    fnName: 'minTimeParallelJobs',
    description: 'Given <code>n</code> microservices, prerequisite pairs <code>[u, v]</code> (service <code>u</code> before <code>v</code>), and execution times <code>time[i]</code> (1-indexed), return the minimum total time to complete all services assuming unlimited parallelism, or <code>-1</code> if a cycle exists.',
    constraints: ['1 <= n <= 5 * 10^4', '0 <= len(relations) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '3, [[1,3],[2,3]], [3, 2, 5]', output: '8' },
      { title: 'Sample 2', input: '5, [[1,5],[2,5],[3,5],[3,4],[4,5]], [1, 2, 3, 4, 5]', output: '12' },
      { title: 'Cycle', input: '2, [[1,2],[2,1]], [1, 2]', output: '-1' },
      { title: 'Independent', input: '3, [], [2, 9, 4]', output: '9' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minTimeParallelJobs(int n, int[][] relations, int[] time) {
        List<Integer>[] g = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) g[i] = new ArrayList<>();
        int[] indeg = new int[n + 1], dist = new int[n + 1];
        for (int[] r : relations) { g[r[0]].add(r[1]); indeg[r[1]]++; }
        Queue<Integer> q = new ArrayDeque<>();
        int seen = 0, ans = 0;
        for (int i = 1; i <= n; i++) if (indeg[i] == 0) { dist[i] = time[i - 1]; q.offer(i); }
        while (!q.isEmpty()) {
            int u = q.poll(); seen++;
            ans = Math.max(ans, dist[u]);
            for (int v : g[u]) {
                dist[v] = Math.max(dist[v], dist[u] + time[v - 1]);
                if (--indeg[v] == 0) q.offer(v);
            }
        }
        return seen == n ? ans : -1;
    }
}`,
    pythonSolution: `from collections import deque

def minTimeParallelJobs(n, relations, time):
    g = [[] for _ in range(n + 1)]
    indeg = [0] * (n + 1)
    for u, v in relations:
        g[u].append(v)
        indeg[v] += 1
    dist = [0] * (n + 1)
    q = deque()
    for i in range(1, n + 1):
        if indeg[i] == 0:
            dist[i] = time[i - 1]
            q.append(i)
    seen = 0
    while q:
        u = q.popleft()
        seen += 1
        for v in g[u]:
            if dist[u] + time[v - 1] > dist[v]:
                dist[v] = dist[u] + time[v - 1]
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return max(dist) if seen == n else -1`
  },
  {
    number: 13,
    difficulty: 'MEDIUM',
    title: 'Marketplace Category Discount Stack',
    fnName: 'sumSubarrayRanges',
    description: 'Given product price history <code>prices</code>, the volatility of a contiguous window is <code>max(window) - min(window)</code>. Return the sum of volatilities across all contiguous subarrays in <code>O(n)</code>.',
    constraints: ['1 <= len(prices) <= 10^4', '-10^9 <= prices[i] <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[1, 2, 3]', output: '4' },
      { title: 'Sample 2', input: '[1, 3, 3]', output: '4' },
      { title: 'Sample 3', input: '[4, -2, -3, 4, 1]', output: '59' },
      { title: 'Single', input: '[10]', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public long sumSubarrayRanges(int[] nums) {
        int n = nums.length;
        long sumMax = 0, sumMin = 0;
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i <= n; i++) {
            while (!st.isEmpty() && (i == n || nums[st.peek()] < nums[i])) {
                int mid = st.pop(), l = st.isEmpty() ? -1 : st.peek();
                sumMax += (long) nums[mid] * (mid - l) * (i - mid);
            }
            st.push(i);
        }
        st.clear();
        for (int i = 0; i <= n; i++) {
            while (!st.isEmpty() && (i == n || nums[st.peek()] > nums[i])) {
                int mid = st.pop(), l = st.isEmpty() ? -1 : st.peek();
                sumMin += (long) nums[mid] * (mid - l) * (i - mid);
            }
            st.push(i);
        }
        return sumMax - sumMin;
    }
}`,
    pythonSolution: `def sumSubarrayRanges(prices):
    n = len(prices)
    sum_max = sum_min = 0
    st = []
    for i in range(n + 1):
        while st and (i == n or prices[st[-1]] < prices[i]):
            mid = st.pop()
            l = st[-1] if st else -1
            sum_max += prices[mid] * (mid - l) * (i - mid)
        st.append(i)
    st.clear()
    for i in range(n + 1):
        while st and (i == n or prices[st[-1]] > prices[i]):
            mid = st.pop()
            l = st[-1] if st else -1
            sum_min += prices[mid] * (mid - l) * (i - mid)
        st.append(i)
    return sum_max - sum_min`
  },
  {
    number: 14,
    difficulty: 'HARD',
    title: 'CloudFront Edge Cache LRU + Frequency',
    fnName: 'simulateEdgeCache',
    description: 'Simulate a cache of capacity <code>cap</code> supporting operations <code>["PUT", k, v]</code> and <code>["GET", k]</code> (evicting the least recently used key on overflow). Return a list of all <code>GET</code> results (<code>-1</code> if miss).',
    constraints: ['1 <= cap <= 3000', '1 <= len(ops) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '2, [["PUT",1,1],["PUT",2,2],["GET",1],["PUT",3,3],["GET",2],["PUT",4,4],["GET",1],["GET",3],["GET",4]]', output: '[1, -1, -1, 3, 4]' },
      { title: 'Update existing', input: '1, [["PUT",1,10],["PUT",1,20],["GET",1]]', output: '[20]' },
      { title: 'Miss only', input: '2, [["GET",5]]', output: '[-1]' },
      { title: 'Promote on get', input: '2, [["PUT",1,1],["PUT",2,2],["GET",1],["PUT",3,3],["GET",1]]', output: '[1, 1]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Integer> simulateEdgeCache(int cap, List<List<Object>> ops) {
        LinkedHashMap<Integer, Integer> map = new LinkedHashMap<>(cap, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> e) { return size() > cap; }
        };
        List<Integer> res = new ArrayList<>();
        for (List<Object> op : ops) {
            if ("PUT".equals(op.get(0))) map.put((Integer) op.get(1), (Integer) op.get(2));
            else res.add(map.getOrDefault((Integer) op.get(1), -1));
        }
        return res;
    }
}`,
    pythonSolution: `from collections import OrderedDict

def simulateEdgeCache(cap, ops):
    cache = OrderedDict()
    res = []
    for op in ops:
        if op[0] == "PUT":
            k, v = op[1], op[2]
            if k in cache:
                cache.move_to_end(k)
            cache[k] = v
            if len(cache) > cap:
                cache.popitem(last=False)
        else:
            k = op[1]
            if k not in cache:
                res.append(-1)
            else:
                cache.move_to_end(k)
                res.append(cache[k])
    return res`
  },
  {
    number: 15,
    difficulty: 'HARD',
    title: 'Alexa Wake-Word Minimum Edit Cost',
    fnName: 'minWeightedEditDistance',
    description: 'Given strings <code>s1</code> and <code>s2</code>, inserting a character costs <code>1</code>, deleting costs <code>1</code>, and substituting a different character costs <code>2</code>. Return the minimum cost to transform <code>s1</code> into <code>s2</code>.',
    constraints: ['0 <= len(s1), len(s2) <= 500'],
    testCases: [
      { title: 'Sample 1', input: '"horse", "ros"', output: '4' },
      { title: 'Sample 2', input: '"intention", "execution"', output: '8' },
      { title: 'Empty', input: '"", "abc"', output: '3' },
      { title: 'Identical', input: '"alexa", "alexa"', output: '0' },
    ],
    javaSolution: `class Solution {
    public int minWeightedEditDistance(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[] dp = new int[n + 1];
        for (int j = 0; j <= n; j++) dp[j] = j;
        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = i;
            for (int j = 1; j <= n; j++) {
                int tmp = dp[j];
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[j] = prev;
                else dp[j] = Math.min(prev + 2, Math.min(dp[j] + 1, dp[j - 1] + 1));
                prev = tmp;
            }
        }
        return dp[n];
    }
}`,
    pythonSolution: `def minWeightedEditDistance(s1, s2):
    m, n = len(s1), len(s2)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            tmp = dp[j]
            if s1[i - 1] == s2[j - 1]:
                dp[j] = prev
            else:
                dp[j] = min(prev + 2, dp[j] + 1, dp[j - 1] + 1)
            prev = tmp
    return dp[n]`
  },

  // ── ROUND 2: SDE-1/2 Technical Interviews — Hard (Q16–Q35) ───────────────
  {
    number: 16,
    difficulty: 'HARD',
    title: 'EC2 Cluster Critical Network Bridges',
    fnName: 'countCriticalLinks',
    description: 'Given <code>n</code> EC2 nodes and undirected fiber links <code>connections</code>, return the count of critical links (bridges) whose removal disconnects any pair of nodes.',
    constraints: ['2 <= n <= 10^5', 'n - 1 <= len(connections) <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '4, [[0,1],[1,2],[2,0],[1,3]]', output: '1' },
      { title: 'Single link', input: '2, [[0,1]]', output: '1' },
      { title: 'Cycle', input: '3, [[0,1],[1,2],[2,0]]', output: '0' },
      { title: 'Line graph', input: '4, [[0,1],[1,2],[2,3]]', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int timer = 0, bridges = 0;
    public int countCriticalLinks(int n, int[][] connections) {
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] c : connections) { g[c[0]].add(c[1]); g[c[1]].add(c[0]); }
        int[] tin = new int[n], low = new int[n];
        Arrays.fill(tin, -1);
        dfs(0, -1, g, tin, low);
        return bridges;
    }
    void dfs(int u, int p, List<Integer>[] g, int[] tin, int[] low) {
        tin[u] = low[u] = timer++;
        for (int v : g[u]) {
            if (v == p) continue;
            if (tin[v] != -1) low[u] = Math.min(low[u], tin[v]);
            else {
                dfs(v, u, g, tin, low);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > tin[u]) bridges++;
            }
        }
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def countCriticalLinks(n, connections):
    g = [[] for _ in range(n)]
    for u, v in connections:
        g[u].append(v)
        g[v].append(u)
    tin = [-1] * n
    low = [0] * n
    timer = [0]
    bridges = [0]
    def dfs(u, p):
        tin[u] = low[u] = timer[0]
        timer[0] += 1
        for v in g[u]:
            if v == p:
                continue
            if tin[v] != -1:
                low[u] = min(low[u], tin[v])
            else:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > tin[u]:
                    bridges[0] += 1
    for i in range(n):
        if tin[i] == -1:
            dfs(i, -1)
    return bridges[0]`
  },
  {
    number: 17,
    difficulty: 'HARD',
    title: 'Prime Video Concurrent Stream Peak',
    fnName: 'maxConcurrentStreams',
    description: 'Given stream intervals <code>[start, end)</code>, return the maximum number of concurrent streams active at any instant.',
    constraints: ['1 <= len(intervals) <= 10^5', '0 <= start < end <= 10^9'],
    testCases: [
      { title: 'Sample 1', input: '[[0,30],[5,10],[15,20]]', output: '2' },
      { title: 'Disjoint', input: '[[1,5],[5,10],[10,15]]', output: '1' },
      { title: 'All overlap', input: '[[1,10],[2,9],[3,8]]', output: '3' },
      { title: 'Single', input: '[[4,9]]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxConcurrentStreams(int[][] intervals) {
        int n = intervals.length;
        int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = intervals[i][0]; e[i] = intervals[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, ans = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; ans = Math.max(ans, cur); i++; }
            else { cur--; j++; }
        }
        return ans;
    }
}`,
    pythonSolution: `def maxConcurrentStreams(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort()
    cur = ans = 0
    for _, delta in events:
        cur += delta
        if cur > ans:
            ans = cur
    return ans`
  },
  {
    number: 18,
    difficulty: 'HARD',
    title: 'Warehouse Median Item Price Stream',
    fnName: 'slidingWindowMedians',
    description: 'Given an array of item prices <code>nums</code> and window size <code>k</code>, return the median of each sliding window of size <code>k</code> rounded down to 1 decimal place? Return exact integer or float (if <code>k</code> is even, average of two middle elements).',
    constraints: ['1 <= k <= len(nums) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[1, 3, -1, -3, 5, 3, 6, 7], 3', output: '[1, -1, -1, 3, 5, 6]' },
      { title: 'Even k', input: '[1, 4, 2, 3], 4', output: '[2.5]' },
      { title: 'k=1', input: '[5, 2, 9], 1', output: '[5, 2, 9]' },
      { title: 'Duplicates', input: '[2, 2, 2, 2], 2', output: '[2.0, 2.0, 2.0]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public double[] slidingWindowMedians(int[] nums, int k) {
        int n = nums.length;
        double[] res = new double[n - k + 1];
        List<Integer> win = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int pos = Collections.binarySearch(win, nums[i]);
            if (pos < 0) pos = -pos - 1;
            win.add(pos, nums[i]);
            if (win.size() > k) {
                int rem = Collections.binarySearch(win, nums[i - k]);
                win.remove(rem);
            }
            if (win.size() == k) {
                res[i - k + 1] = k % 2 == 1 ? win.get(k / 2) : ((double) win.get(k / 2 - 1) + win.get(k / 2)) / 2.0;
            }
        }
        return res;
    }
}`,
    pythonSolution: `import bisect

def slidingWindowMedians(nums, k):
    win = []
    res = []
    for i, x in enumerate(nums):
        bisect.insort(win, x)
        if len(win) > k:
            idx = bisect.bisect_left(win, nums[i - k])
            win.pop(idx)
        if len(win) == k:
            if k % 2 == 1:
                res.append(win[k // 2])
            else:
                res.append((win[k // 2 - 1] + win[k // 2]) / 2)
    return res`
  },
  {
    number: 19,
    difficulty: 'HARD',
    title: 'Fulfillment Robot Minimum Obstacles Removed',
    fnName: 'minObstaclesToCorner',
    description: 'Given an <code>m x n</code> warehouse grid of <code>0</code> (empty) and <code>1</code> (obstacle), return the minimum number of obstacles to remove so a robot can travel from <code>(0, 0)</code> to <code>(m-1, n-1)</code> moving in 4 directions.',
    constraints: ['1 <= m, n <= 300', 'grid[0][0] == grid[m-1][n-1] == 0'],
    testCases: [
      { title: 'Sample 1', input: '[[0,1,1],[1,1,0],[1,1,0]]', output: '2' },
      { title: 'Sample 2', input: '[[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0]]', output: '0' },
      { title: '1x1', input: '[[0]]', output: '0' },
      { title: 'All blocked mid', input: '[[0,1],[1,0]]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minObstaclesToCorner(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[][] dist = new int[m][n];
        for (int[] r : dist) Arrays.fill(r, Integer.MAX_VALUE);
        Deque<int[]> dq = new ArrayDeque<>();
        dist[0][0] = 0; dq.offerFirst(new int[]{0, 0});
        int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
        while (!dq.isEmpty()) {
            int[] c = dq.pollFirst();
            int r = c[0], col = c[1];
            if (r == m - 1 && col == n - 1) return dist[r][col];
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = col + dc[d];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    int nd = dist[r][col] + grid[nr][nc];
                    if (nd < dist[nr][nc]) {
                        dist[nr][nc] = nd;
                        if (grid[nr][nc] == 0) dq.offerFirst(new int[]{nr, nc});
                        else dq.offerLast(new int[]{nr, nc});
                    }
                }
            }
        }
        return dist[m - 1][n - 1];
    }
}`,
    pythonSolution: `from collections import deque

def minObstaclesToCorner(grid):
    m, n = len(grid), len(grid[0])
    INF = 10**9
    dist = [[INF] * n for _ in range(m)]
    dist[0][0] = 0
    dq = deque([(0, 0)])
    while dq:
        r, c = dq.popleft()
        if r == m - 1 and c == n - 1:
            return dist[r][c]
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                nd = dist[r][c] + grid[nr][nc]
                if nd < dist[nr][nc]:
                    dist[nr][nc] = nd
                    if grid[nr][nc] == 0:
                        dq.appendleft((nr, nc))
                    else:
                        dq.append((nr, nc))
    return dist[m - 1][n - 1]`
  },
  {
    number: 20,
    difficulty: 'HARD',
    title: 'Route Optimization With At Most K Stops',
    fnName: 'cheapestDeliveryRoute',
    description: 'Given <code>n</code> cities, directed flights <code>[from, to, price]</code>, <code>src</code>, <code>dst</code>, and <code>k</code> stops, return the cheapest price from <code>src</code> to <code>dst</code> with at most <code>k</code> intermediate stops, or <code>-1</code>.',
    constraints: ['1 <= n <= 100', '0 <= k < n'],
    testCases: [
      { title: 'Sample 1', input: '4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1', output: '700' },
      { title: 'Sample 2', input: '3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1', output: '200' },
      { title: 'Zero stops', input: '3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 0', output: '500' },
      { title: 'Unreachable', input: '3, [[0,1,100]], 0, 2, 1', output: '-1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int cheapestDeliveryRoute(int n, int[][] flights, int src, int dst, int k) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        for (int i = 0; i <= k; i++) {
            int[] next = dist.clone();
            for (int[] f : flights) {
                if (dist[f[0]] != Integer.MAX_VALUE && dist[f[0]] + f[2] < next[f[1]]) {
                    next[f[1]] = dist[f[0]] + f[2];
                }
            }
            dist = next;
        }
        return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
    }
}`,
    pythonSolution: `def cheapestDeliveryRoute(n, flights, src, dst, k):
    INF = 10**18
    dist = [INF] * n
    dist[src] = 0
    for _ in range(k + 1):
        nxt = dist[:]
        for u, v, w in flights:
            if dist[u] != INF and dist[u] + w < nxt[v]:
                nxt[v] = dist[u] + w
        dist = nxt
    return -1 if dist[dst] == INF else dist[dst]`
  },
  {
    number: 21,
    difficulty: 'HARD',
    title: 'Kinesis Shard Rebalance Minimum Moves',
    fnName: 'minSwapsToGroupOnes',
    description: 'Given a circular binary array <code>shards</code> where <code>1</code> represents an active shard, return the minimum number of swaps required to group all <code>1</code>s together anywhere in the circular array.',
    constraints: ['1 <= len(shards) <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '[0, 1, 0, 1, 1, 0, 0]', output: '1' },
      { title: 'Circular wrap', input: '[0, 1, 1, 1, 0, 0, 1, 1, 0]', output: '2' },
      { title: 'Already grouped', input: '[1, 1, 0, 0, 1]', output: '0' },
      { title: 'All zeros', input: '[0, 0, 0]', output: '0' },
    ],
    javaSolution: `class Solution {
    public int minSwapsToGroupOnes(int[] shards) {
        int ones = 0, n = shards.length;
        for (int x : shards) ones += x;
        if (ones <= 1 || ones == n) return 0;
        int cur = 0;
        for (int i = 0; i < ones; i++) cur += shards[i];
        int maxOnes = cur;
        for (int i = ones; i < n + ones; i++) {
            cur += shards[i % n] - shards[(i - ones) % n];
            maxOnes = Math.max(maxOnes, cur);
        }
        return ones - maxOnes;
    }
}`,
    pythonSolution: `def minSwapsToGroupOnes(shards):
    ones = sum(shards)
    n = len(shards)
    if ones <= 1 or ones == n:
        return 0
    cur = sum(shards[:ones])
    best = cur
    for i in range(ones, n + ones):
        cur += shards[i % n] - shards[(i - ones) % n]
        if cur > best:
            best = cur
    return ones - best`
  },
  {
    number: 22,
    difficulty: 'HARD',
    title: 'Cloud Security Group Shortest Path With Keys',
    fnName: 'shortestPathAllKeys',
    description: 'Given a <code>m x n</code> grid with <code>@</code> (start), <code>.</code> (empty), <code>#</code> (wall), lowercase keys <code>a-f</code>, and uppercase locks <code>A-F</code>, return the minimum steps to collect all keys, or <code>-1</code>.',
    constraints: ['1 <= m, n <= 30', '1 <= number of keys <= 6'],
    testCases: [
      { title: 'Sample 1', input: '["@.a..","###.#","b.A.B"]', output: '8' },
      { title: 'Sample 2', input: '["@..aA","..B#.","....b"]', output: '6' },
      { title: 'Impossible', input: '["@Aa"]', output: '-1' },
      { title: 'Single key', input: '["@a"]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int shortestPathAllKeys(String[] grid) {
        int m = grid.length, n = grid[0].length(), sr = 0, sc = 0, allMask = 0;
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
            char c = grid[i].charAt(j);
            if (c == '@') { sr = i; sc = j; }
            else if (c >= 'a' && c <= 'f') allMask |= (1 << (c - 'a'));
        }
        boolean[][][] vis = new boolean[m][n][1 << 6];
        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{sr, sc, 0, 0});
        vis[sr][sc][0] = true;
        int[] dr = {1, -1, 0, 0}, dc = {0, 0, 1, -1};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            if (cur[2] == allMask) return cur[3];
            for (int d = 0; d < 4; d++) {
                int nr = cur[0] + dr[d], nc = cur[1] + dc[d], mask = cur[2];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                char ch = grid[nr].charAt(nc);
                if (ch == '#') continue;
                if (ch >= 'A' && ch <= 'F' && (mask & (1 << (ch - 'A'))) == 0) continue;
                if (ch >= 'a' && ch <= 'f') mask |= (1 << (ch - 'a'));
                if (!vis[nr][nc][mask]) { vis[nr][nc][mask] = true; q.offer(new int[]{nr, nc, mask, cur[3] + 1}); }
            }
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import deque

def shortestPathAllKeys(grid):
    m, n = len(grid), len(grid[0])
    sr = sc = all_mask = 0
    for i in range(m):
        for j in range(n):
            c = grid[i][j]
            if c == '@':
                sr, sc = i, j
            elif 'a' <= c <= 'f':
                all_mask |= 1 << (ord(c) - ord('a'))
    vis = {(sr, sc, 0)}
    q = deque([(sr, sc, 0, 0)])
    while q:
        r, c, mask, steps = q.popleft()
        if mask == all_mask:
            return steps
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                ch = grid[nr][nc]
                if ch == '#':
                    continue
                if 'A' <= ch <= 'F' and not (mask & (1 << (ord(ch) - ord('A')))):
                    continue
                nmask = mask | (1 << (ord(ch) - ord('a'))) if 'a' <= ch <= 'f' else mask
                if (nr, nc, nmask) not in vis:
                    vis.add((nr, nc, nmask))
                    q.append((nr, nc, nmask, steps + 1))
    return -1`
  },
  {
    number: 23,
    difficulty: 'HARD',
    title: 'Recommendation Engine Word Transformation',
    fnName: 'minMutationSteps',
    description: 'Given <code>beginWord</code>, <code>endWord</code>, and a dictionary <code>wordList</code>, return the length of the shortest transformation sequence changing one character at a time (each intermediate word must be in <code>wordList</code>), or <code>0</code> if impossible.',
    constraints: ['1 <= len(beginWord) <= 10', '1 <= len(wordList) <= 5000'],
    testCases: [
      { title: 'Sample 1', input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', output: '5' },
      { title: 'Missing target', input: '"hit", "cog", ["hot","dot","dog","lot","log"]', output: '0' },
      { title: 'One step', input: '"cat", "bat", ["bat"]', output: '2' },
      { title: 'Same', input: '"hit", "hit", ["hit"]', output: '1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minMutationSteps(String beginWord, String endWord, List<String> wordList) {
        if (beginWord.equals(endWord)) return 1;
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(endWord)) return 0;
        Queue<String> q = new ArrayDeque<>();
        q.offer(beginWord);
        int steps = 1;
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int s = 0; s < sz; s++) {
                char[] arr = q.poll().toCharArray();
                for (int i = 0; i < arr.length; i++) {
                    char orig = arr[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        arr[i] = c;
                        String nxt = new String(arr);
                        if (nxt.equals(endWord)) return steps + 1;
                        if (dict.remove(nxt)) q.offer(nxt);
                    }
                    arr[i] = orig;
                }
            }
            steps++;
        }
        return 0;
    }
}`,
    pythonSolution: `from collections import deque

def minMutationSteps(beginWord, endWord, wordList):
    if beginWord == endWord:
        return 1
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    q = deque([(beginWord, 1)])
    while q:
        word, steps = q.popleft()
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                nxt = word[:i] + c + word[i + 1:]
                if nxt == endWord:
                    return steps + 1
                if nxt in word_set:
                    word_set.remove(nxt)
                    q.append((nxt, steps + 1))
    return 0`
  },
  {
    number: 24,
    difficulty: 'HARD',
    title: 'Inventory Stockout Burst Balloons DP',
    fnName: 'maxLiquidationValue',
    description: 'Given shelf values <code>nums</code>, liquidating shelf <code>i</code> yields <code>nums[left] * nums[i] * nums[right]</code> where <code>left</code> and <code>right</code> are current adjacent shelves (out-of-bounds treated as <code>1</code>). Return the maximum total liquidation value.',
    constraints: ['1 <= len(nums) <= 300', '0 <= nums[i] <= 100'],
    testCases: [
      { title: 'Sample 1', input: '[3, 1, 5, 8]', output: '167' },
      { title: 'Sample 2', input: '[1, 5]', output: '10' },
      { title: 'Single', input: '[7]', output: '7' },
      { title: 'Zeros', input: '[0, 5, 0]', output: '5' },
    ],
    javaSolution: `class Solution {
    public int maxLiquidationValue(int[] nums) {
        int n = nums.length;
        int[] a = new int[n + 2];
        a[0] = a[n + 1] = 1;
        for (int i = 0; i < n; i++) a[i + 1] = nums[i];
        int[][] dp = new int[n + 2][n + 2];
        for (int len = 1; len <= n; len++) {
            for (int l = 1; l + len - 1 <= n; l++) {
                int r = l + len - 1;
                for (int k = l; k <= r; k++) {
                    dp[l][r] = Math.max(dp[l][r], dp[l][k - 1] + a[l - 1] * a[k] * a[r + 1] + dp[k + 1][r]);
                }
            }
        }
        return dp[1][n];
    }
}`,
    pythonSolution: `def maxLiquidationValue(nums):
    a = [1] + nums + [1]
    n = len(a)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):
        for l in range(0, n - length):
            r = l + length
            best = 0
            for k in range(l + 1, r):
                val = dp[l][k] + a[l] * a[k] * a[r] + dp[k][r]
                if val > best:
                    best = val
            dp[l][r] = best
    return dp[0][n - 1]`
  },
  {
    number: 25,
    difficulty: 'HARD',
    title: 'Marketplace Search Minimum Window Substring',
    fnName: 'minQueryWindow',
    description: 'Given strings <code>s</code> and <code>t</code>, return the minimum-length contiguous substring of <code>s</code> that contains every character of <code>t</code> (with multiplicity), or <code>""</code> if none exists.',
    constraints: ['1 <= len(s), len(t) <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '"ADOBECODEBANC", "ABC"', output: 'BANC' },
      { title: 'Exact match', input: '"a", "a"', output: 'a' },
      { title: 'Minimal', input: '"abbc", "bc"', output: 'bc' },
      { title: 'Duplicates', input: '"aaflslflsldkalskaaa", "aaa"', output: 'aaa' },
    ],
    javaSolution: `class Solution {
    public String minQueryWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int req = t.length(), l = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;
        for (int r = 0; r < s.length(); r++) {
            if (need[s.charAt(r)]-- > 0) req--;
            while (req == 0) {
                if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestStart = l; }
                if (++need[s.charAt(l++)] > 0) req++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}`,
    pythonSolution: `from collections import Counter

def minQueryWindow(s, t):
    need = Counter(t)
    missing = len(t)
    l = best_l = 0
    best_len = 10**9
    for r, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        while missing == 0:
            if r - l + 1 < best_len:
                best_len = r - l + 1
                best_l = l
            need[s[l]] += 1
            if need[s[l]] > 0:
                missing += 1
            l += 1
    return "" if best_len == 10**9 else s[best_l:best_l + best_len]`
  },
  {
    number: 26,
    difficulty: 'HARD',
    title: 'Supply Chain Max Profit K Transactions',
    fnName: 'maxProfitKTrades',
    description: 'Given daily commodity prices <code>prices</code> and max transactions <code>k</code>, return the maximum profit achievable with at most <code>k</code> buy-sell transactions (no overlapping holdings).',
    constraints: ['0 <= k <= 100', '0 <= len(prices) <= 1000'],
    testCases: [
      { title: 'Sample 1', input: '2, [2, 4, 1]', output: '2' },
      { title: 'Sample 2', input: '2, [3, 2, 6, 5, 0, 3]', output: '7' },
      { title: 'Zero k', input: '0, [1, 5, 10]', output: '0' },
      { title: 'Decreasing', input: '3, [5, 4, 3, 2]', output: '0' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxProfitKTrades(int k, int[] prices) {
        if (k == 0 || prices.length == 0) return 0;
        int[] buy = new int[k + 1], sell = new int[k + 1];
        Arrays.fill(buy, Integer.MIN_VALUE);
        for (int p : prices) {
            for (int t = 1; t <= k; t++) {
                buy[t] = Math.max(buy[t], sell[t - 1] - p);
                sell[t] = Math.max(sell[t], buy[t] + p);
            }
        }
        return sell[k];
    }
}`,
    pythonSolution: `def maxProfitKTrades(k, prices):
    if k == 0 or not prices:
        return 0
    if k >= len(prices) // 2:
        return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))
    buy = [-10**9] * (k + 1)
    sell = [0] * (k + 1)
    for p in prices:
        for t in range(1, k + 1):
            buy[t] = max(buy[t], sell[t - 1] - p)
            sell[t] = max(sell[t], buy[t] + p)
    return sell[k]`
  },
  {
    number: 27,
    difficulty: 'HARD',
    title: 'Warehouse Rainwater Roof Trapping',
    fnName: 'trapWarehouseWater',
    description: 'Given roof elevation heights <code>height</code> of width 1 per unit, return how much rainwater can be trapped between roof ridges after rain.',
    constraints: ['1 <= len(height) <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { title: 'Sample 2', input: '[4,2,0,3,2,5]', output: '9' },
      { title: 'Monotonic', input: '[1,2,3,4]', output: '0' },
      { title: 'Valley', input: '[5,0,5]', output: '5' },
    ],
    javaSolution: `class Solution {
    public int trapWarehouseWater(int[] height) {
        int l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                lMax = Math.max(lMax, height[l]);
                water += lMax - height[l++];
            } else {
                rMax = Math.max(rMax, height[r]);
                water += rMax - height[r--];
            }
        }
        return water;
    }
}`,
    pythonSolution: `def trapWarehouseWater(height):
    l, r = 0, len(height) - 1
    l_max = r_max = water = 0
    while l < r:
        if height[l] < height[r]:
            l_max = max(l_max, height[l])
            water += l_max - height[l]
            l += 1
        else:
            r_max = max(r_max, height[r])
            water += r_max - height[r]
            r -= 1
    return water`
  },
  {
    number: 28,
    difficulty: 'HARD',
    title: 'IAM Policy Regex Wildcard Matcher',
    fnName: 'matchPolicyPattern',
    description: 'Given an ARN string <code>s</code> and wildcard pattern <code>p</code> where <code>?</code> matches any single character and <code>*</code> matches any sequence of characters (including empty), return <code>true</code> if <code>p</code> matches the entire string <code>s</code>.',
    constraints: ['0 <= len(s), len(p) <= 2000'],
    testCases: [
      { title: 'Sample 1', input: '"aa", "*"', output: 'true' },
      { title: 'Sample 2', input: '"cb", "?a"', output: 'false' },
      { title: 'Sample 3', input: '"adceb", "*a*b"', output: 'true' },
      { title: 'Mismatch', input: '"acdcb", "a*c?b"', output: 'false' },
    ],
    javaSolution: `class Solution {
    public boolean matchPolicyPattern(String s, String p) {
        int i = 0, j = 0, star = -1, match = 0;
        while (i < s.length()) {
            if (j < p.length() && (p.charAt(j) == '?' || p.charAt(j) == s.charAt(i))) { i++; j++; }
            else if (j < p.length() && p.charAt(j) == '*') { star = j++; match = i; }
            else if (star != -1) { j = star + 1; i = ++match; }
            else return false;
        }
        while (j < p.length() && p.charAt(j) == '*') j++;
        return j == p.length();
    }
}`,
    pythonSolution: `def matchPolicyPattern(s, p):
    i = j = match = 0
    star = -1
    while i < len(s):
        if j < len(p) and (p[j] == '?' or p[j] == s[i]):
            i += 1
            j += 1
        elif j < len(p) and p[j] == '*':
            star = j
            match = i
            j += 1
        elif star != -1:
            j = star + 1
            match += 1
            i = match
        else:
            return False
    while j < len(p) and p[j] == '*':
        j += 1
    return j == len(p)`
  },
  {
    number: 29,
    difficulty: 'HARD',
    title: 'VPC Subnet Alien Dictionary Order',
    fnName: 'alienOrder',
    description: 'Given a sorted list of words from a custom protocol <code>words</code>, derive a valid character ordering string. If no valid order exists (cycle or invalid prefix), return <code>""</code>.',
    constraints: ['1 <= len(words) <= 100', '1 <= len(words[i]) <= 100'],
    testCases: [
      { title: 'Sample 1', input: '["wrt","wrf","er","ett","rftt"]', output: 'wertf' },
      { title: 'Sample 2', input: '["z","x"]', output: 'zx' },
      { title: 'Three', input: '["baa","abcd","abca","cab","cad"]', output: 'bdac' },
      { title: 'Two words', input: '["caa","aaa","aab"]', output: 'cab' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> g = new HashMap<>();
        Map<Character, Integer> indeg = new HashMap<>();
        for (String w : words) for (char c : w.toCharArray()) { g.putIfAbsent(c, new HashSet<>()); indeg.putIfAbsent(c, 0); }
        for (int i = 0; i < words.length - 1; i++) {
            String a = words[i], b = words[i + 1];
            if (a.length() > b.length() && a.startsWith(b)) return "";
            for (int j = 0; j < Math.min(a.length(), b.length()); j++) {
                if (a.charAt(j) != b.charAt(j)) {
                    if (g.get(a.charAt(j)).add(b.charAt(j))) indeg.put(b.charAt(j), indeg.get(b.charAt(j)) + 1);
                    break;
                }
            }
        }
        PriorityQueue<Character> q = new PriorityQueue<>();
        for (var e : indeg.entrySet()) if (e.getValue() == 0) q.offer(e.getKey());
        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) {
            char u = q.poll(); sb.append(u);
            for (char v : g.get(u)) {
                indeg.put(v, indeg.get(v) - 1);
                if (indeg.get(v) == 0) q.offer(v);
            }
        }
        return sb.length() == indeg.size() ? sb.toString() : "";
    }
}`,
    pythonSolution: `import heapq

def alienOrder(words):
    g = {c: set() for w in words for c in w}
    indeg = {c: 0 for c in g}
    for i in range(len(words) - 1):
        a, b = words[i], words[i + 1]
        if len(a) > len(b) and a.startswith(b):
            return ""
        for ca, cb in zip(a, b):
            if ca != cb:
                if cb not in g[ca]:
                    g[ca].add(cb)
                    indeg[cb] += 1
                break
    pq = [c for c, d in indeg.items() if d == 0]
    heapq.heapify(pq)
    res = []
    while pq:
        u = heapq.heappop(pq)
        res.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                heapq.heappush(pq, v)
    return "".join(res) if len(res) == len(indeg) else ""`
  },
  {
    number: 30,
    difficulty: 'HARD',
    title: 'Lambda Cold-Start Minimum Refuel / Jump',
    fnName: 'minJumpsToEnd',
    description: 'Given an array <code>arr</code> where from index <code>i</code> you can jump to <code>i + 1</code>, <code>i - 1</code>, or any index <code>j</code> with <code>arr[j] == arr[i]</code>, return the minimum jumps to reach the last index.',
    constraints: ['1 <= len(arr) <= 5 * 10^4', '-10^8 <= arr[i] <= 10^8'],
    testCases: [
      { title: 'Sample 1', input: '[100,-23,-23,404,100,23,23,23,3,404]', output: '3' },
      { title: 'Single', input: '[7]', output: '0' },
      { title: 'Direct match', input: '[7,6,9,6,9,6,9,7]', output: '1' },
      { title: 'Step by step', input: '[1,2,3,4]', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minJumpsToEnd(int[] arr) {
        int n = arr.length;
        if (n <= 1) return 0;
        Map<Integer, List<Integer>> byVal = new HashMap<>();
        for (int i = 0; i < n; i++) byVal.computeIfAbsent(arr[i], k -> new ArrayList<>()).add(i);
        boolean[] vis = new boolean[n];
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(0); vis[0] = true;
        int steps = 0;
        while (!q.isEmpty()) {
            for (int sz = q.size(); sz > 0; sz--) {
                int u = q.poll();
                if (u == n - 1) return steps;
                List<Integer> nexts = byVal.getOrDefault(arr[u], Collections.emptyList());
                nexts.add(u + 1);
                if (u - 1 >= 0) nexts.add(u - 1);
                for (int v : nexts) {
                    if (v >= 0 && v < n && !vis[v]) { vis[v] = true; q.offer(v); }
                }
                byVal.remove(arr[u]);
            }
            steps++;
        }
        return -1;
    }
}`,
    pythonSolution: `from collections import defaultdict, deque

def minJumpsToEnd(arr):
    n = len(arr)
    if n <= 1:
        return 0
    by_val = defaultdict(list)
    for i, v in enumerate(arr):
        by_val[v].append(i)
    vis = {0}
    q = deque([(0, 0)])
    while q:
        u, steps = q.popleft()
        if u == n - 1:
            return steps
        for v in by_val[arr[u]] + [u - 1, u + 1]:
            if 0 <= v < n and v not in vis:
                vis.add(v)
                q.append((v, steps + 1))
        by_val[arr[u]].clear()
    return -1`
  },
  {
    number: 31,
    difficulty: 'HARD',
    title: 'EBS Snapshot Count of Smaller After Self',
    fnName: 'countSmallerAfter',
    description: 'Given an integer array <code>nums</code>, return an array <code>counts</code> where <code>counts[i]</code> is the number of smaller elements strictly to the right of <code>nums[i]</code>.',
    constraints: ['1 <= len(nums) <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[5, 2, 6, 1]', output: '[2, 1, 1, 0]' },
      { title: 'Single', input: '[-1]', output: '[0]' },
      { title: 'Duplicates', input: '[-1, -1]', output: '[0, 0]' },
      { title: 'Descending', input: '[4, 3, 2, 1]', output: '[3, 2, 1, 0]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Integer> countSmallerAfter(int[] nums) {
        int n = nums.length, offset = 10001;
        int[] bit = new int[20005];
        Integer[] res = new Integer[n];
        for (int i = n - 1; i >= 0; i--) {
            int x = nums[i] + offset;
            int sum = 0;
            for (int j = x - 1; j > 0; j -= j & -j) sum += bit[j];
            res[i] = sum;
            for (int j = x; j < bit.length; j += j & -j) bit[j]++;
        }
        return Arrays.asList(res);
    }
}`,
    pythonSolution: `def countSmallerAfter(nums):
    vals = sorted(set(nums))
    rank = {v: i + 1 for i, v in enumerate(vals)}
    m = len(vals)
    bit = [0] * (m + 1)
    def add(i):
        while i <= m:
            bit[i] += 1
            i += i & -i
    def query(i):
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s
    res = [0] * len(nums)
    for i in range(len(nums) - 1, -1, -1):
        r = rank[nums[i]]
        res[i] = query(r - 1)
        add(r)
    return res`
  },
  {
    number: 32,
    difficulty: 'HARD',
    title: 'Delivery Van Maximum Sum Submatrix',
    fnName: 'maxSumSubmatrixLimit',
    description: 'Given an <code>m x n</code> matrix of integers and an integer <code>k</code>, return the maximum sum of a non-empty submatrix no larger than <code>k</code>.',
    constraints: ['1 <= m, n <= 100', '-100 <= matrix[i][j] <= 100', '-10^5 <= k <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '[[1,0,1],[0,-2,3]], 2', output: '2' },
      { title: 'Sample 2', input: '[[2,2,-1]], 3', output: '3' },
      { title: 'Single', input: '[[5]], 5', output: '5' },
      { title: 'Negative', input: '[[2,2,-1]], 0', output: '-1' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxSumSubmatrixLimit(int[][] matrix, int k) {
        int m = matrix.length, n = matrix[0].length, ans = Integer.MIN_VALUE;
        for (int top = 0; top < m; top++) {
            int[] col = new int[n];
            for (int bot = top; bot < m; bot++) {
                for (int c = 0; c < n; c++) col[c] += matrix[bot][c];
                TreeSet<Integer> set = new TreeSet<>();
                set.add(0);
                int pref = 0;
                for (int v : col) {
                    pref += v;
                    Integer ceil = set.ceiling(pref - k);
                    if (ceil != null) ans = Math.max(ans, pref - ceil);
                    set.add(pref);
                }
            }
        }
        return ans;
    }
}`,
    pythonSolution: `import bisect

def maxSumSubmatrixLimit(matrix, k):
    m, n = len(matrix), len(matrix[0])
    ans = -10**9
    for top in range(m):
        col = [0] * n
        for bot in range(top, m):
            for c in range(n):
                col[c] += matrix[bot][c]
            prefs = [0]
            cur = 0
            for v in col:
                cur += v
                idx = bisect.bisect_left(prefs, cur - k)
                if idx < len(prefs):
                    ans = max(ans, cur - prefs[idx])
                bisect.insort(prefs, cur)
    return ans`
  },
  {
    number: 33,
    difficulty: 'HARD',
    title: 'Fresh Grocery Shelf Skyline Silhouette',
    fnName: 'maxShelfCapacityDrops',
    description: 'Given building/rack intervals <code>[left, right, height]</code>, return the skyline key points <code>[[x, y], ...]</code> where the maximum height changes.',
    constraints: ['1 <= len(buildings) <= 10^4', '0 <= left < right <= 2^31 - 1'],
    testCases: [
      { title: 'Sample 1', input: '[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]', output: '[[2, 10], [3, 15], [7, 12], [12, 0], [15, 10], [20, 8], [24, 0]]' },
      { title: 'Two adjacent', input: '[[0,2,3],[2,5,3]]', output: '[[0, 3], [5, 0]]' },
      { title: 'Single', input: '[[1,5,4]]', output: '[[1, 4], [5, 0]]' },
      { title: 'Nested', input: '[[1,10,5],[3,6,8]]', output: '[[1, 5], [3, 8], [6, 5], [10, 0]]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<List<Integer>> maxShelfCapacityDrops(int[][] buildings) {
        List<int[]> events = new ArrayList<>();
        for (int[] b : buildings) { events.add(new int[]{b[0], -b[2]}); events.add(new int[]{b[1], b[2]}); }
        events.sort((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        TreeMap<Integer, Integer> pq = new TreeMap<>(Collections.reverseOrder());
        pq.put(0, 1);
        int prev = 0;
        List<List<Integer>> res = new ArrayList<>();
        for (int[] e : events) {
            if (e[1] < 0) pq.put(-e[1], pq.getOrDefault(-e[1], 0) + 1);
            else {
                int c = pq.get(e[1]);
                if (c == 1) pq.remove(e[1]); else pq.put(e[1], c - 1);
            }
            int cur = pq.firstKey();
            if (cur != prev) { res.add(Arrays.asList(e[0], cur)); prev = cur; }
        }
        return res;
    }
}`,
    pythonSolution: `import heapq

def maxShelfCapacityDrops(buildings):
    events = []
    for l, r, h in buildings:
        events.append((l, -h, r))
        events.append((r, 0, 0))
    events.sort()
    res = [[0, 0]]
    live = [(0, float('inf'))]
    for x, neg_h, r in events:
        while live[0][1] <= x:
            heapq.heappop(live)
        if neg_h:
            heapq.heappush(live, (neg_h, r))
        if res[-1][1] != -live[0][0]:
            res.append([x, -live[0][0]])
    return res[1:]`
  },
  {
    number: 34,
    difficulty: 'HARD',
    title: 'Cloud Billing Expression Evaluator',
    fnName: 'evaluateBillingExpr',
    description: 'Evaluate a mathematical expression string containing non-negative integers, <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> (truncating toward zero), parentheses <code>(</code> and <code>)</code>, and spaces.',
    constraints: ['1 <= len(s) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '"2*(5+5*2)/3+(6/2+8)"', output: '21' },
      { title: 'Sample 2', input: '"(2+6*3+5-(3*14/7+2)*5)+3"', output: '-12' },
      { title: 'Simple', input: '"1 + 1"', output: '2' },
      { title: 'Nested', input: '"((3+2)*4)"', output: '20' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int idx = 0;
    public int evaluateBillingExpr(String s) {
        idx = 0;
        return parse(s);
    }
    int parse(String s) {
        Deque<Integer> st = new ArrayDeque<>();
        int num = 0; char op = '+';
        while (idx < s.length()) {
            char c = s.charAt(idx++);
            if (Character.isDigit(c)) num = num * 10 + (c - '0');
            if (c == '(') num = parse(s);
            if ((idx == s.length() || !Character.isDigit(c)) && c != ' ' || c == ')') {
                if (op == '+') st.push(num);
                else if (op == '-') st.push(-num);
                else if (op == '*') st.push(st.pop() * num);
                else if (op == '/') st.push(st.pop() / num);
                op = c; num = 0;
                if (c == ')') break;
            }
        }
        int sum = 0;
        for (int v : st) sum += v;
        return sum;
    }
}`,
    pythonSolution: `def evaluateBillingExpr(s):
    it = iter(s)
    def calc():
        def update(op, num):
            if op == '+': stack.append(num)
            elif op == '-': stack.append(-num)
            elif op == '*': stack.append(stack.pop() * num)
            elif op == '/': stack.append(int(stack.pop() / num))
        stack = []
        num = 0
        op = '+'
        for ch in it:
            if ch.isdigit():
                num = num * 10 + int(ch)
            elif ch in '+-*/':
                update(op, num)
                num, op = 0, ch
            elif ch == '(':
                num = calc()
            elif ch == ')':
                update(op, num)
                return sum(stack)
        update(op, num)
        return sum(stack)
    return calc()`
  },
  {
    number: 35,
    difficulty: 'HARD',
    title: 'K-th Smallest Distance Pair in Catalog',
    fnName: 'kthSmallestPairDistance',
    description: 'Given an integer array <code>nums</code> and integer <code>k</code>, return the <code>k</code>-th smallest absolute difference <code>|nums[i] - nums[j]|</code> among all pairs <code>0 <= i < j < n</code>.',
    constraints: ['2 <= len(nums) <= 10^4', '1 <= k <= n*(n-1)/2'],
    testCases: [
      { title: 'Sample 1', input: '[1, 3, 1], 1', output: '0' },
      { title: 'Sample 2', input: '[1, 1, 1], 2', output: '0' },
      { title: 'Sample 3', input: '[1, 6, 1], 3', output: '5' },
      { title: 'Sorted', input: '[1, 2, 4, 8], 4', output: '4' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int kthSmallestPairDistance(int[] nums, int k) {
        Arrays.sort(nums);
        int lo = 0, hi = nums[nums.length - 1] - nums[0];
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2, count = 0, l = 0;
            for (int r = 0; r < nums.length; r++) {
                while (nums[r] - nums[l] > mid) l++;
                count += r - l;
            }
            if (count >= k) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def kthSmallestPairDistance(nums, k):
    nums.sort()
    lo, hi = 0, nums[-1] - nums[0]
    while lo < hi:
        mid = (lo + hi) // 2
        count = l = 0
        for r, x in enumerate(nums):
            while x - nums[l] > mid:
                l += 1
            count += r - l
        if count >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },

  // ── ROUND 3: SDE-2 / Bar-Raiser — Extreme (Q36–Q50) ──────────────────────
  {
    number: 36,
    difficulty: 'EXTREME',
    title: 'Distributed Lock Bitmask DP Task Assignment',
    fnName: 'minWorkersCostBitmask',
    description: 'Given a <code>n x n</code> cost matrix where <code>cost[i][j]</code> is the cost of worker <code>i</code> performing task <code>j</code>, assign each worker a unique task to minimize the total cost using Bitmask DP.',
    constraints: ['1 <= n <= 16', '1 <= cost[i][j] <= 10^5'],
    testCases: [
      { title: 'Sample 1', input: '[[9,2,7,8],[6,4,3,7],[5,8,1,8],[7,6,9,4]]', output: '13' },
      { title: '2x2', input: '[[1,2],[2,1]]', output: '2' },
      { title: 'Identity', input: '[[1,9],[9,1]]', output: '2' },
      { title: '3x3', input: '[[10,2,3],[2,10,3],[3,2,10]]', output: '7' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minWorkersCostBitmask(int[][] cost) {
        int n = cost.length, N = 1 << n;
        int[] dp = new int[N];
        Arrays.fill(dp, Integer.MAX_VALUE / 2);
        dp[0] = 0;
        for (int mask = 0; mask < N; mask++) {
            int worker = Integer.bitCount(mask);
            if (worker >= n) continue;
            for (int t = 0; t < n; t++) {
                if ((mask & (1 << t)) == 0) {
                    dp[mask | (1 << t)] = Math.min(dp[mask | (1 << t)], dp[mask] + cost[worker][t]);
                }
            }
        }
        return dp[N - 1];
    }
}`,
    pythonSolution: `def minWorkersCostBitmask(cost):
    n = len(cost)
    N = 1 << n
    INF = 10**18
    dp = [INF] * N
    dp[0] = 0
    for mask in range(N):
        w = mask.bit_count()
        if w >= n:
            continue
        base = dp[mask]
        if base == INF:
            continue
        for t in range(n):
            if not (mask & (1 << t)):
                nm = mask | (1 << t)
                val = base + cost[w][t]
                if val < dp[nm]:
                    dp[nm] = val
    return dp[N - 1]`
  },
  {
    number: 37,
    difficulty: 'EXTREME',
    title: 'Segment Tree Range Max With Lazy Add',
    fnName: 'rangeAddMaxQueries',
    description: 'Maintain an array of <code>n</code> zeros. Process queries: <code>[1, l, r, val]</code> adds <code>val</code> to indices <code>[l..r]</code>; <code>[2, l, r]</code> returns the maximum value in <code>[l..r]</code>. Return a list of answers for all type-2 queries.',
    constraints: ['1 <= n <= 10^5', '1 <= len(queries) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '5, [[1,0,2,5],[2,1,3],[1,2,4,3],[2,0,4]]', output: '[5, 8]' },
      { title: 'Negative add', input: '4, [[1,0,3,10],[1,1,2,-4],[2,1,2],[2,0,3]]', output: '[6, 10]' },
      { title: 'Single elem', input: '1, [[1,0,0,7],[2,0,0]]', output: '[7]' },
      { title: 'No updates', input: '3, [[2,0,2]]', output: '[0]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    long[] tree, lazy;
    void push(int node) {
        if (lazy[node] != 0) {
            tree[2 * node] += lazy[node]; lazy[2 * node] += lazy[node];
            tree[2 * node + 1] += lazy[node]; lazy[2 * node + 1] += lazy[node];
            lazy[node] = 0;
        }
    }
    void update(int node, int l, int r, int ql, int qr, long val) {
        if (ql <= l && r <= qr) { tree[node] += val; lazy[node] += val; return; }
        push(node);
        int mid = (l + r) / 2;
        if (ql <= mid) update(2 * node, l, mid, ql, qr, val);
        if (qr > mid) update(2 * node + 1, mid + 1, r, ql, qr, val);
        tree[node] = Math.max(tree[2 * node], tree[2 * node + 1]);
    }
    long query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        push(node);
        int mid = (l + r) / 2;
        long ans = Long.MIN_VALUE;
        if (ql <= mid) ans = Math.max(ans, query(2 * node, l, mid, ql, qr));
        if (qr > mid) ans = Math.max(ans, query(2 * node + 1, mid + 1, r, ql, qr));
        return ans;
    }
    public List<Long> rangeAddMaxQueries(int n, int[][] queries) {
        tree = new long[4 * n]; lazy = new long[4 * n];
        List<Long> res = new ArrayList<>();
        for (int[] q : queries) {
            if (q[0] == 1) update(1, 0, n - 1, q[1], q[2], q[3]);
            else res.add(query(1, 0, n - 1, q[1], q[2]));
        }
        return res;
    }
}`,
    pythonSolution: `def rangeAddMaxQueries(n, queries):
    tree = [0] * (4 * n)
    lazy = [0] * (4 * n)
    def push(node):
        if lazy[node]:
            v = lazy[node]
            tree[2 * node] += v
            lazy[2 * node] += v
            tree[2 * node + 1] += v
            lazy[2 * node + 1] += v
            lazy[node] = 0
    def update(node, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            tree[node] += val
            lazy[node] += val
            return
        push(node)
        mid = (l + r) // 2
        if ql <= mid:
            update(2 * node, l, mid, ql, qr, val)
        if qr > mid:
            update(2 * node + 1, mid + 1, r, ql, qr, val)
        tree[node] = max(tree[2 * node], tree[2 * node + 1])
    def query(node, l, r, ql, qr):
        if ql <= l and r <= qr:
            return tree[node]
        push(node)
        mid = (l + r) // 2
        ans = -10**18
        if ql <= mid:
            ans = max(ans, query(2 * node, l, mid, ql, qr))
        if qr > mid:
            ans = max(ans, query(2 * node + 1, mid + 1, r, ql, qr))
        return ans
    res = []
    for q in queries:
        if q[0] == 1:
            update(1, 0, n - 1, q[1], q[2], q[3])
        else:
            res.append(query(1, 0, n - 1, q[1], q[2]))
    return res`
  },
  {
    number: 38,
    difficulty: 'EXTREME',
    title: 'Digit DP Restricted Order IDs',
    fnName: 'countOrderIdsWithoutAdjacentEqual',
    description: 'Given a positive integer string <code>nStr</code>, count how many positive integers in <code>[1, nStr]</code> have no two adjacent identical digits (modulo <code>10^9 + 7</code>).',
    constraints: ['1 <= len(nStr) <= 100'],
    testCases: [
      { title: 'Sample 1', input: '"20"', output: '19' },
      { title: 'Sample 2', input: '"100"', output: '90' },
      { title: 'Single digit', input: '"9"', output: '9' },
      { title: 'Sample 4', input: '"11"', output: '10' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    static final int MOD = 1_000_000_007;
    String s;
    int[][][][] memo;
    public int countOrderIdsWithoutAdjacentEqual(String nStr) {
        s = nStr;
        memo = new int[s.length()][11][2][2];
        for (int[][][] a : memo) for (int[][] b : a) for (int[] c : b) Arrays.fill(c, -1);
        return dp(0, 10, 1, 0);
    }
    int dp(int pos, int prev, int tight, int started) {
        if (pos == s.length()) return started;
        if (memo[pos][prev][tight][started] != -1) return memo[pos][prev][tight][started];
        int limit = tight == 1 ? s.charAt(pos) - '0' : 9;
        long res = 0;
        for (int d = 0; d <= limit; d++) {
            int nStarted = (started == 1 || d > 0) ? 1 : 0;
            if (started == 1 && d == prev) continue;
            int nPrev = nStarted == 1 ? d : 10;
            res = (res + dp(pos + 1, nPrev, (tight == 1 && d == limit) ? 1 : 0, nStarted)) % MOD;
        }
        return memo[pos][prev][tight][started] = (int) res;
    }
}`,
    pythonSolution: `from functools import lru_cache

def countOrderIdsWithoutAdjacentEqual(nStr):
    MOD = 10**9 + 7
    digits = [int(c) for c in nStr]
    @lru_cache(None)
    def dp(pos, prev, tight, started):
        if pos == len(digits):
            return started
        limit = digits[pos] if tight else 9
        res = 0
        for d in range(limit + 1):
            n_started = started or (d > 0)
            if started and d == prev:
                continue
            n_prev = d if n_started else 10
            res = (res + dp(pos + 1, n_prev, tight and (d == limit), n_started)) % MOD
        return res
    return dp(0, 10, True, False)`
  },
  {
    number: 39,
    difficulty: 'EXTREME',
    title: 'Dinic Max Flow Warehouse Bottleneck',
    fnName: 'maxWarehouseThroughput',
    description: 'Given <code>n</code> nodes, directed capacity pipes <code>[u, v, cap]</code>, source <code>0</code>, and sink <code>n - 1</code>, compute the maximum flow throughput from <code>0</code> to <code>n - 1</code>.',
    constraints: ['2 <= n <= 100', '1 <= cap <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '4, [[0,1,3],[0,2,2],[1,2,5],[1,3,2],[2,3,3]]', output: '5' },
      { title: 'Parallel', input: '2, [[0,1,4],[0,1,6]]', output: '10' },
      { title: 'Disconnected', input: '3, [[0,1,5]]', output: '0' },
      { title: 'Diamond', input: '4, [[0,1,10],[0,2,10],[1,3,4],[2,3,8],[1,2,2]]', output: '12' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxWarehouseThroughput(int n, int[][] pipes) {
        int[][] cap = new int[n][n];
        for (int[] p : pipes) cap[p[0]][p[1]] += p[2];
        int flow = 0;
        int[] parent = new int[n];
        while (true) {
            Arrays.fill(parent, -1);
            parent[0] = 0;
            Queue<Integer> q = new ArrayDeque<>();
            q.offer(0);
            while (!q.isEmpty() && parent[n - 1] == -1) {
                int u = q.poll();
                for (int v = 0; v < n; v++) {
                    if (parent[v] == -1 && cap[u][v] > 0) {
                        parent[v] = u;
                        q.offer(v);
                    }
                }
            }
            if (parent[n - 1] == -1) break;
            int push = Integer.MAX_VALUE;
            for (int v = n - 1; v != 0; v = parent[v]) push = Math.min(push, cap[parent[v]][v]);
            for (int v = n - 1; v != 0; v = parent[v]) {
                cap[parent[v]][v] -= push;
                cap[v][parent[v]] += push;
            }
            flow += push;
        }
        return flow;
    }
}`,
    pythonSolution: `from collections import deque

def maxWarehouseThroughput(n, pipes):
    cap = [[0] * n for _ in range(n)]
    for u, v, c in pipes:
        cap[u][v] += c
    flow = 0
    while True:
        parent = [-1] * n
        parent[0] = 0
        q = deque([0])
        while q and parent[n - 1] == -1:
            u = q.popleft()
            for v in range(n):
                if parent[v] == -1 and cap[u][v] > 0:
                    parent[v] = u
                    q.append(v)
        if parent[n - 1] == -1:
            break
        push = 10**18
        v = n - 1
        while v != 0:
            u = parent[v]
            if cap[u][v] < push:
                push = cap[u][v]
            v = u
        v = n - 1
        while v != 0:
            u = parent[v]
            cap[u][v] -= push
            cap[v][u] += push
            v = u
        flow += push
    return flow`
  },
  {
    number: 40,
    difficulty: 'EXTREME',
    title: 'DP on Trees Max Independent Service Weight',
    fnName: 'maxNonAdjacentTreeWeight',
    description: 'Given a tree of <code>n</code> services with weights <code>weights[i]</code> and undirected edges <code>edges</code>, select a subset of services such that no two directly connected services are both selected, maximizing total weight.',
    constraints: ['1 <= n <= 10^5', '0 <= weights[i] <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[[0,1],[0,2],[1,3],[1,4]], [3, 4, 5, 1, 2]', output: '9' },
      { title: 'Star', input: '[[0,1],[0,2],[0,3]], [10, 3, 3, 3]', output: '10' },
      { title: 'Single', input: '[], [42]', output: '42' },
      { title: 'Line', input: '[[0,1],[1,2],[2,3]], [5, 1, 1, 5]', output: '10' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxNonAdjacentTreeWeight(int[][] edges, int[] weights) {
        int n = weights.length;
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        int[] r = dfs(0, -1, g, weights);
        return Math.max(r[0], r[1]);
    }
    int[] dfs(int u, int p, List<Integer>[] g, int[] w) {
        int skip = 0, take = w[u];
        for (int v : g[u]) if (v != p) {
            int[] ch = dfs(v, u, g, w);
            skip += Math.max(ch[0], ch[1]);
            take += ch[0];
        }
        return new int[]{skip, take};
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def maxNonAdjacentTreeWeight(edges, weights):
    n = len(weights)
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    def dfs(u, p):
        skip, take = 0, weights[u]
        for v in g[u]:
            if v != p:
                cs, ct = dfs(v, u)
                skip += max(cs, ct)
                take += cs
        return skip, take
    return max(dfs(0, -1))`
  },
  {
    number: 41,
    difficulty: 'EXTREME',
    title: 'Aho-Corasick Multi-Pattern Log Scanner',
    fnName: 'countMatchedLogPatterns',
    description: 'Given a log string <code>text</code> and a list of distinct signature strings <code>patterns</code>, return how many distinct patterns from <code>patterns</code> appear at least once as a substring in <code>text</code>.',
    constraints: ['1 <= len(text) <= 5 * 10^4', '1 <= sum(len(p)) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '"ahishers", ["he","she","hers","his"]', output: '4' },
      { title: 'No match', input: '"abcdef", ["xyz","pq"]', output: '0' },
      { title: 'All match', input: '"banana", ["ban","ana","na"]', output: '3' },
      { title: 'Overlap', input: '"aaaa", ["aa","aaa","aaaaa"]', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int countMatchedLogPatterns(String text, String[] patterns) {
        int count = 0;
        for (String p : patterns) if (text.contains(p)) count++;
        return count;
    }
}`,
    pythonSolution: `from collections import deque

def countMatchedLogPatterns(text, patterns):
    next_node = [{}]
    fail = [0]
    out = [[]]
    for idx, pat in enumerate(patterns):
        cur = 0
        for ch in pat:
            if ch not in next_node[cur]:
                next_node[cur][ch] = len(next_node)
                next_node.append({})
                fail.append(0)
                out.append([])
            cur = next_node[cur][ch]
        out[cur].append(idx)
    q = deque()
    for ch, nxt in next_node[0].items():
        q.append(nxt)
    while q:
        u = q.popleft()
        for ch, v in next_node[u].items():
            f = fail[u]
            while f and ch not in next_node[f]:
                f = fail[f]
            fail[v] = next_node[f].get(ch, 0)
            out[v].extend(out[fail[v]])
            q.append(v)
    found = set()
    cur = 0
    for ch in text:
        while cur and ch not in next_node[cur]:
            cur = fail[cur]
        cur = next_node[cur].get(ch, 0)
        for p_idx in out[cur]:
            found.add(p_idx)
    return len(found)`
  },
  {
    number: 42,
    difficulty: 'EXTREME',
    title: 'Bipartite Matching Courier Assignment',
    fnName: 'maxCouriersAssigned',
    description: 'Given <code>n</code> couriers, <code>m</code> delivery zones, and compatibility edges <code>[courier, zone]</code>, return the maximum number of couriers that can each be assigned to a distinct compatible zone.',
    constraints: ['1 <= n, m <= 200', '0 <= len(edges) <= n * m'],
    testCases: [
      { title: 'Sample 1', input: '3, 3, [[0,0],[0,1],[1,0],[2,1],[2,2]]', output: '3' },
      { title: 'Contention', input: '3, 2, [[0,0],[1,0],[2,0]]', output: '1' },
      { title: 'Empty', input: '2, 2, []', output: '0' },
      { title: 'Sample 4', input: '4, 4, [[0,1],[1,0],[1,2],[2,1],[3,2],[3,3]]', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int maxCouriersAssigned(int n, int m, int[][] edges) {
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) g[e[0]].add(e[1]);
        int[] match = new int[m];
        Arrays.fill(match, -1);
        int res = 0;
        for (int u = 0; u < n; u++) {
            boolean[] vis = new boolean[m];
            if (dfs(u, g, vis, match)) res++;
        }
        return res;
    }
    boolean dfs(int u, List<Integer>[] g, boolean[] vis, int[] match) {
        for (int v : g[u]) {
            if (!vis[v]) {
                vis[v] = true;
                if (match[v] == -1 || dfs(match[v], g, vis, match)) { match[v] = u; return true; }
            }
        }
        return false;
    }
}`,
    pythonSolution: `def maxCouriersAssigned(n, m, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
    match = [-1] * m
    def dfs(u, vis):
        for v in g[u]:
            if not vis[v]:
                vis[v] = True
                if match[v] == -1 or dfs(match[v], vis):
                    match[v] = u
                    return True
        return False
    res = 0
    for u in range(n):
        if dfs(u, [False] * m):
            res += 1
    return res`
  },
  {
    number: 43,
    difficulty: 'EXTREME',
    title: 'Bitmask DP Shortest Superstring',
    fnName: 'shortestSuperstringLength',
    description: 'Given an array of strings <code>words</code> where no string is a substring of another, return the minimum length of a superstring that contains every string in <code>words</code> as a substring.',
    constraints: ['1 <= len(words) <= 12', '1 <= len(words[i]) <= 20'],
    testCases: [
      { title: 'Sample 1', input: '["alex","loves","leetcode"]', output: '17' },
      { title: 'Overlap', input: '["catg","ctaagt","gcta","ttca","atgcatc"]', output: '16' },
      { title: 'Single', input: '["amazon"]', output: '6' },
      { title: 'Chain', input: '["abc","bcd","cde"]', output: '5' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int shortestSuperstringLength(String[] words) {
        int n = words.length;
        int[][] ov = new int[n][n];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) if (i != j) {
            int maxK = Math.min(words[i].length(), words[j].length());
            for (int k = maxK; k >= 0; k--) {
                if (words[i].endsWith(words[j].substring(0, k))) { ov[i][j] = k; break; }
            }
        }
        int N = 1 << n;
        int[][] dp = new int[N][n];
        for (int[] r : dp) Arrays.fill(r, Integer.MAX_VALUE / 2);
        for (int i = 0; i < n; i++) dp[1 << i][i] = words[i].length();
        for (int mask = 1; mask < N; mask++) {
            for (int last = 0; last < n; last++) if ((mask & (1 << last)) != 0) {
                for (int nxt = 0; nxt < n; nxt++) if ((mask & (1 << nxt)) == 0) {
                    int nm = mask | (1 << nxt);
                    dp[nm][nxt] = Math.min(dp[nm][nxt], dp[mask][last] + words[nxt].length() - ov[last][nxt]);
                }
            }
        }
        int ans = Integer.MAX_VALUE;
        for (int i = 0; i < n; i++) ans = Math.min(ans, dp[N - 1][i]);
        return ans;
    }
}`,
    pythonSolution: `def shortestSuperstringLength(words):
    n = len(words)
    ov = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                for k in range(min(len(words[i]), len(words[j])), 0, -1):
                    if words[i].endswith(words[j][:k]):
                        ov[i][j] = k
                        break
    N = 1 << n
    INF = 10**9
    dp = [[INF] * n for _ in range(N)]
    for i in range(n):
        dp[1 << i][i] = len(words[i])
    for mask in range(1, N):
        for last in range(n):
            if not (mask & (1 << last)) or dp[mask][last] == INF:
                continue
            for nxt in range(n):
                if not (mask & (1 << nxt)):
                    nm = mask | (1 << nxt)
                    val = dp[mask][last] + len(words[nxt]) - ov[last][nxt]
                    if val < dp[nm][nxt]:
                        dp[nm][nxt] = val
    return min(dp[N - 1])`
  },
  {
    number: 44,
    difficulty: 'EXTREME',
    title: 'Tarjan Strongly Connected Microservices',
    fnName: 'countStronglyConnected',
    description: 'Given <code>n</code> microservices and directed RPC call edges <code>[u, v]</code>, return the number of Strongly Connected Components (SCCs) in the dependency graph.',
    constraints: ['1 <= n <= 10^5', '0 <= len(edges) <= 2 * 10^5'],
    testCases: [
      { title: 'Sample 1', input: '5, [[0,1],[1,2],[2,0],[1,3],[3,4]]', output: '3' },
      { title: 'DAG', input: '4, [[0,1],[1,2],[2,3]]', output: '4' },
      { title: 'Full cycle', input: '3, [[0,1],[1,2],[2,0]]', output: '1' },
      { title: 'Disconnected', input: '3, []', output: '3' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int timer = 0, scc = 0;
    public int countStronglyConnected(int n, int[][] edges) {
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) g[e[0]].add(e[1]);
        int[] tin = new int[n], low = new int[n];
        Arrays.fill(tin, -1);
        boolean[] onSt = new boolean[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (tin[i] == -1) dfs(i, g, tin, low, onSt, st);
        return scc;
    }
    void dfs(int u, List<Integer>[] g, int[] tin, int[] low, boolean[] onSt, Deque<Integer> st) {
        tin[u] = low[u] = timer++;
        st.push(u); onSt[u] = true;
        for (int v : g[u]) {
            if (tin[v] == -1) { dfs(v, g, tin, low, onSt, st); low[u] = Math.min(low[u], low[v]); }
            else if (onSt[v]) low[u] = Math.min(low[u], tin[v]);
        }
        if (low[u] == tin[u]) {
            scc++;
            while (true) { int w = st.pop(); onSt[w] = false; if (w == u) break; }
        }
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def countStronglyConnected(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
    tin = [-1] * n
    low = [0] * n
    on_st = [False] * n
    st = []
    timer = [0]
    scc = [0]
    def dfs(u):
        tin[u] = low[u] = timer[0]
        timer[0] += 1
        st.append(u)
        on_st[u] = True
        for v in g[u]:
            if tin[v] == -1:
                dfs(v)
                low[u] = min(low[u], low[v])
            elif on_st[v]:
                low[u] = min(low[u], tin[v])
        if low[u] == tin[u]:
            scc[0] += 1
            while True:
                w = st.pop()
                on_st[w] = False
                if w == u:
                    break
    for i in range(n):
        if tin[i] == -1:
            dfs(i)
    return scc[0]`
  },
  {
    number: 45,
    difficulty: 'EXTREME',
    title: 'Max Path Sum Between Any Two Tree Nodes',
    fnName: 'maxTreePathWeight',
    description: 'Given a tree of <code>n</code> nodes with signed integer weights <code>vals</code> (possibly negative) and edges <code>edges</code>, return the maximum sum of node weights along any simple path (containing at least one node).',
    constraints: ['1 <= n <= 10^5', '-10^4 <= vals[i] <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[[0,1],[0,2],[2,3],[2,4]], [-10, 9, 20, 15, 7]', output: '42' },
      { title: 'All negative', input: '[[0,1]], [-3, -1]', output: '-1' },
      { title: 'Single', input: '[], [5]', output: '5' },
      { title: 'Chain', input: '[[0,1],[1,2]], [2, -1, 3]', output: '4' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    int best = Integer.MIN_VALUE;
    public int maxTreePathWeight(int[][] edges, int[] vals) {
        int n = vals.length;
        List<Integer>[] g = new ArrayList[n];
        for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
        for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
        dfs(0, -1, g, vals);
        return best;
    }
    int dfs(int u, int p, List<Integer>[] g, int[] vals) {
        int top1 = 0, top2 = 0;
        for (int v : g[u]) if (v != p) {
            int d = Math.max(0, dfs(v, u, g, vals));
            if (d > top1) { top2 = top1; top1 = d; }
            else if (d > top2) top2 = d;
        }
        best = Math.max(best, vals[u] + top1 + top2);
        return vals[u] + top1;
    }
}`,
    pythonSolution: `import sys
sys.setrecursionlimit(200000)

def maxTreePathWeight(edges, vals):
    n = len(vals)
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)
    best = [-10**18]
    def dfs(u, p):
        t1 = t2 = 0
        for v in g[u]:
            if v != p:
                d = max(0, dfs(v, u))
                if d > t1:
                    t2, t1 = t1, d
                elif d > t2:
                    t2 = d
        best[0] = max(best[0], vals[u] + t1 + t2)
        return vals[u] + t1
    dfs(0, -1)
    return best[0]`
  },
  {
    number: 46,
    difficulty: 'HARD',
    title: 'Dynamic Median of Unbounded Stream',
    fnName: 'runningMedianQueries',
    description: 'Process a stream of operations: <code>["ADD", x]</code> inserts integer <code>x</code>; <code>["MEDIAN"]</code> outputs the current median (if even count, average of two middle integers). Return the list of median outputs.',
    constraints: ['1 <= len(ops) <= 5 * 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[["ADD",1],["ADD",2],["MEDIAN"],["ADD",3],["MEDIAN"]]', output: '[1.5, 2]' },
      { title: 'Negatives', input: '[["ADD",-1],["MEDIAN"],["ADD",-2],["MEDIAN"],["ADD",-3],["MEDIAN"]]', output: '[-1, -1.5, -2]' },
      { title: 'Single', input: '[["ADD",10],["MEDIAN"]]', output: '[10]' },
      { title: 'Unsorted', input: '[["ADD",5],["ADD",1],["ADD",3],["MEDIAN"]]', output: '[3]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public List<Double> runningMedianQueries(List<List<Object>> ops) {
        PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> hi = new PriorityQueue<>();
        List<Double> res = new ArrayList<>();
        for (List<Object> op : ops) {
            if ("ADD".equals(op.get(0))) {
                lo.offer((Integer) op.get(1));
                hi.offer(lo.poll());
                if (lo.size() < hi.size()) lo.offer(hi.poll());
            } else {
                res.add(lo.size() > hi.size() ? (double) lo.peek() : (lo.peek() + hi.peek()) / 2.0);
            }
        }
        return res;
    }
}`,
    pythonSolution: `import heapq

def runningMedianQueries(ops):
    lo, hi = [], []
    res = []
    for op in ops:
        if op[0] == "ADD":
            heapq.heappush(lo, -op[1])
            heapq.heappush(hi, -heapq.heappop(lo))
            if len(lo) < len(hi):
                heapq.heappush(lo, -heapq.heappop(hi))
        else:
            if len(lo) > len(hi):
                res.append(-lo[0])
            else:
                res.append((-lo[0] + hi[0]) / 2)
    return res`
  },
  {
    number: 47,
    difficulty: 'HARD',
    title: 'Word Search Trie Matrix Recovery',
    fnName: 'findCatalogWordsInGrid',
    description: 'Given an <code>m x n</code> board of characters and a list of <code>words</code>, return all words from <code>words</code> that can be formed by sequentially adjacent cells (without reusing a cell in the same word), sorted alphabetically.',
    constraints: ['1 <= m, n <= 12', '1 <= len(words) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]', output: '["eat", "oath"]' },
      { title: 'None', input: '[["a","b"],["c","d"]], ["abcb"]', output: '[]' },
      { title: 'Single cell', input: '[["a"]], ["a","b"]', output: '["a"]' },
      { title: 'Multi match', input: '[["a","b"],["c","d"]], ["ab","ac","abd"]', output: '["ab", "abd", "ac"]' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    static class Node { Node[] ch = new Node[26]; String word; }
    public List<String> findCatalogWordsInGrid(char[][] board, String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node cur = root;
            for (char c : w.toCharArray()) {
                if (cur.ch[c - 'a'] == null) cur.ch[c - 'a'] = new Node();
                cur = cur.ch[c - 'a'];
            }
            cur.word = w;
        }
        List<String> res = new ArrayList<>();
        for (int i = 0; i < board.length; i++)
            for (int j = 0; j < board[0].length; j++) dfs(board, i, j, root, res);
        Collections.sort(res);
        return res;
    }
    void dfs(char[][] b, int r, int c, Node node, List<String> res) {
        char ch = b[r][c];
        if (ch == '#' || node.ch[ch - 'a'] == null) return;
        node = node.ch[ch - 'a'];
        if (node.word != null) { res.add(node.word); node.word = null; }
        b[r][c] = '#';
        if (r > 0) dfs(b, r - 1, c, node, res);
        if (c > 0) dfs(b, r, c - 1, node, res);
        if (r + 1 < b.length) dfs(b, r + 1, c, node, res);
        if (c + 1 < b[0].length) dfs(b, r, c + 1, node, res);
        b[r][c] = ch;
    }
}`,
    pythonSolution: `def findCatalogWordsInGrid(board, words):
    trie = {}
    for w in words:
        cur = trie
        for ch in w:
            cur = cur.setdefault(ch, {})
        cur['#'] = w
    m, n = len(board), len(board[0])
    res = []
    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node:
            return
        nxt = node[ch]
        if '#' in nxt:
            res.append(nxt.pop('#'))
        board[r][c] = '*'
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and board[nr][nc] != '*':
                dfs(nr, nc, nxt)
        board[r][c] = ch
        if not nxt:
            node.pop(ch)
    for i in range(m):
        for j in range(n):
            dfs(i, j, trie)
    res.sort()
    return res`
  },
  {
    number: 48,
    difficulty: 'HARD',
    title: 'Minimum Cost to Connect All Warehouses',
    fnName: 'minCostConnectHubs',
    description: 'Given coordinates of <code>n</code> warehouse hubs <code>points[i] = [x, y]</code>, the cost to build a fiber link between two hubs is the Manhattan distance <code>|x1 - x2| + |y1 - y2|</code>. Return the minimum total cost to connect all hubs.',
    constraints: ['1 <= n <= 1000', '-10^6 <= x, y <= 10^6'],
    testCases: [
      { title: 'Sample 1', input: '[[0,0],[2,2],[3,10],[5,2],[7,0]]', output: '20' },
      { title: 'Sample 2', input: '[[3,12],[-2,5],[-4,1]]', output: '18' },
      { title: 'Single', input: '[[0,0]]', output: '0' },
      { title: 'Two', input: '[[0,0],[1,1]]', output: '2' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minCostConnectHubs(int[][] points) {
        int n = points.length, total = 0;
        int[] minD = new int[n];
        Arrays.fill(minD, Integer.MAX_VALUE);
        boolean[] vis = new boolean[n];
        minD[0] = 0;
        for (int step = 0; step < n; step++) {
            int u = -1;
            for (int i = 0; i < n; i++) if (!vis[i] && (u == -1 || minD[i] < minD[u])) u = i;
            vis[u] = true;
            total += minD[u];
            for (int v = 0; v < n; v++) {
                if (!vis[v]) {
                    int d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
                    minD[v] = Math.min(minD[v], d);
                }
            }
        }
        return total;
    }
}`,
    pythonSolution: `def minCostConnectHubs(points):
    n = len(points)
    min_d = [10**18] * n
    vis = [False] * n
    min_d[0] = 0
    total = 0
    for _ in range(n):
        u = -1
        for i in range(n):
            if not vis[i] and (u == -1 or min_d[i] < min_d[u]):
                u = i
        vis[u] = True
        total += min_d[u]
        ux, uy = points[u]
        for v in range(n):
            if not vis[v]:
                d = abs(ux - points[v][0]) + abs(uy - points[v][1])
                if d < min_d[v]:
                    min_d[v] = d
    return total`
  },
  {
    number: 49,
    difficulty: 'HARD',
    title: 'Split Array Into Consecutive Subsequences',
    fnName: 'canSplitConsecutiveBatches',
    description: 'Given a non-decreasing integer array <code>nums</code>, return <code>true</code> if it can be partitioned into one or more subsequences such that each subsequence is strictly increasing by 1 and has length at least 3.',
    constraints: ['1 <= len(nums) <= 10^4'],
    testCases: [
      { title: 'Sample 1', input: '[1,2,3,3,4,5]', output: 'true' },
      { title: 'Sample 2', input: '[1,2,3,3,4,4,5,5]', output: 'true' },
      { title: 'Impossible', input: '[1,2,3,4,4,5]', output: 'false' },
      { title: 'Too short', input: '[1,2]', output: 'false' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public boolean canSplitConsecutiveBatches(int[] nums) {
        Map<Integer, Integer> freq = new HashMap<>(), need = new HashMap<>();
        for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
        for (int x : nums) {
            if (freq.get(x) == 0) continue;
            if (need.getOrDefault(x, 0) > 0) {
                need.put(x, need.get(x) - 1);
                need.put(x + 1, need.getOrDefault(x + 1, 0) + 1);
            } else if (freq.getOrDefault(x + 1, 0) > 0 && freq.getOrDefault(x + 2, 0) > 0) {
                freq.put(x + 1, freq.get(x + 1) - 1);
                freq.put(x + 2, freq.get(x + 2) - 1);
                need.put(x + 3, need.getOrDefault(x + 3, 0) + 1);
            } else return false;
            freq.put(x, freq.get(x) - 1);
        }
        return true;
    }
}`,
    pythonSolution: `from collections import Counter

def canSplitConsecutiveBatches(nums):
    freq = Counter(nums)
    need = Counter()
    for x in nums:
        if freq[x] == 0:
            continue
        if need[x] > 0:
            need[x] -= 1
            need[x + 1] += 1
        elif freq[x + 1] > 0 and freq[x + 2] > 0:
            freq[x + 1] -= 1
            freq[x + 2] -= 1
            need[x + 3] += 1
        else:
            return False
        freq[x] -= 1
    return True`
  },
  {
    number: 50,
    difficulty: 'EXTREME',
    title: 'Minimum Cost to Cut Prime Packaging Tape',
    fnName: 'minTapeCutCost',
    description: 'Given a packaging tape of length <code>n</code> and cut positions <code>cuts</code>, each cut costs the current length of the tape segment being cut. Return the minimum total cost to perform all cuts in any order.',
    constraints: ['2 <= n <= 10^6', '1 <= len(cuts) <= 100'],
    testCases: [
      { title: 'Sample 1', input: '7, [1, 3, 4, 5]', output: '16' },
      { title: 'Sample 2', input: '9, [5, 6, 1, 4, 2]', output: '22' },
      { title: 'Single cut', input: '10, [4]', output: '10' },
      { title: 'Two cuts', input: '6, [2, 4]', output: '10' },
    ],
    javaSolution: `import java.util.*;
class Solution {
    public int minTapeCutCost(int n, int[] cuts) {
        int m = cuts.length;
        int[] c = new int[m + 2];
        c[0] = 0; c[m + 1] = n;
        for (int i = 0; i < m; i++) c[i + 1] = cuts[i];
        Arrays.sort(c);
        int[][] dp = new int[m + 2][m + 2];
        for (int len = 2; len <= m + 1; len++) {
            for (int l = 0; l + len <= m + 1; l++) {
                int r = l + len;
                dp[l][r] = Integer.MAX_VALUE;
                for (int k = l + 1; k < r; k++) {
                    dp[l][r] = Math.min(dp[l][r], dp[l][k] + dp[k][r] + c[r] - c[l]);
                }
            }
        }
        return dp[0][m + 1];
    }
}`,
    pythonSolution: `def minTapeCutCost(n, cuts):
    c = [0] + sorted(cuts) + [n]
    m = len(c)
    dp = [[0] * m for _ in range(m)]
    for length in range(2, m):
        for l in range(m - length):
            r = l + length
            best = 10**18
            for k in range(l + 1, r):
                val = dp[l][k] + dp[k][r] + (c[r] - c[l])
                if val < best:
                    best = val
            dp[l][r] = best
    return dp[0][m - 1]`
  }
];
