export const ORACLE_QUESTIONS = [
  {
    number: 1,
    title: 'Database Lock Deadlock Cycle Detector',
    fnName: 'hasLockDeadlock',
    description: 'Oracle DB tracks wait-for edges <code>waits</code> <code>[t1, t2]</code> meaning transaction <code>t1</code> is waiting for a lock held by <code>t2</code> (IDs <code>0..n-1</code>). Return <code>true</code> if a deadlock cycle exists.',
    constraints: ['1 <= n <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 3, waits = [[0, 1], [1, 2], [2, 0]]', output: 'true' },
      { title: 'Test Case 2', input: 'n = 4, waits = [[0, 1], [1, 2], [2, 3]]', output: 'false' },
      { title: 'Test Case 3', input: 'n = 2, waits = []', output: 'false' },
      { title: 'Test Case 4', input: 'n = 3, waits = [[0, 1], [1, 1]]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean hasLockDeadlock(int n, int[][] waits) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] w : waits) { g.get(w[0]).add(w[1]); indeg[w[1]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
        int seen = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); seen++;
            for (int v : g.get(u)) if (--indeg[v] == 0) q.add(v);
        }
        return seen != n;
    }
}`,
    pythonSolution: `def hasLockDeadlock(n, waits):
    from collections import deque
    g = [[] for _ in range(n)]
    indeg = [0] * n
    for u, v in waits:
        g[u].append(v); indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    seen = 0
    while q:
        u = q.popleft(); seen += 1
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return seen != n`
  },
  {
    number: 2,
    title: 'Redo-Log Write-Ahead Compaction',
    fnName: 'compactWriteAheadLog',
    description: 'Given a sequence of key-value writes <code>ops</code> formatted as <code>["SET", key, val]</code>, compact the log by keeping only the latest value for each key, returned as <code>[[key, val], ...]</code> sorted by ascending key.',
    constraints: ['1 <= ops.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'ops = [["SET", "k2", "10"], ["SET", "k1", "5"], ["SET", "k2", "20"]]', output: '[["k1", "5"], ["k2", "20"]]' },
      { title: 'Test Case 2', input: 'ops = [["SET", "a", "1"]]', output: '[["a", "1"]]' },
      { title: 'Test Case 3', input: 'ops = [["SET", "x", "1"], ["SET", "x", "2"], ["SET", "x", "3"]]', output: '[["x", "3"]]' },
      { title: 'Test Case 4', input: 'ops = [["SET", "b", "2"], ["SET", "a", "1"]]', output: '[["a", "1"], ["b", "2"]]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static String[][] compactWriteAheadLog(String[][] ops) {
        TreeMap<String, String> map = new TreeMap<>();
        for (String[] op : ops) map.put(op[1], op[2]);
        String[][] res = new String[map.size()][2];
        int i = 0;
        for (Map.Entry<String, String> e : map.entrySet()) {
            res[i][0] = e.getKey(); res[i][1] = e.getValue(); i++;
        }
        return res;
    }
}`,
    pythonSolution: `def compactWriteAheadLog(ops):
    latest = {}
    for _, k, v in ops:
        latest[k] = v
    return [[k, latest[k]] for k in sorted(latest.keys())]`
  },
  {
    number: 3,
    title: 'B-Tree Page Split Median Finder',
    fnName: 'medianOfTwoSortedPages',
    description: 'Given two sorted index pages <code>a</code> and <code>b</code>, return the median of the combined sorted sequence as a floating-point number (if even total length, average of the two middle elements; format exact integer if whole else decimal, or return integer/float—here both arrays have odd combined length or even).',
    constraints: ['1 <= a.length + b.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'a = [1, 3], b = [2]', output: '2.0' },
      { title: 'Test Case 2', input: 'a = [1, 2], b = [3, 4]', output: '2.5' },
      { title: 'Test Case 3', input: 'a = [0, 0], b = [0, 0]', output: '0.0' },
      { title: 'Test Case 4', input: 'a = [], b = [5]', output: '5.0' }
    ],
    javaSolution: `public class Solution {
    public static double medianOfTwoSortedPages(int[] a, int[] b) {
        if (a.length > b.length) return medianOfTwoSortedPages(b, a);
        int m = a.length, n = b.length, lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = (m + n + 1) / 2 - i;
            int aL = i == 0 ? Integer.MIN_VALUE : a[i - 1];
            int aR = i == m ? Integer.MAX_VALUE : a[i];
            int bL = j == 0 ? Integer.MIN_VALUE : b[j - 1];
            int bR = j == n ? Integer.MAX_VALUE : b[j];
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2 == 1) return Math.max(aL, bL);
                return (Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;
            } else if (aL > bR) hi = i - 1;
            else lo = i + 1;
        }
        return 0.0;
    }
}`,
    pythonSolution: `def medianOfTwoSortedPages(a, b):
    if len(a) > len(b): a, b = b, a
    m, n = len(a), len(b)
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = (m + n + 1) // 2 - i
        aL = float('-inf') if i == 0 else a[i - 1]
        aR = float('inf') if i == m else a[i]
        bL = float('-inf') if j == 0 else b[j - 1]
        bR = float('inf') if j == n else b[j]
        if aL <= bR and bL <= aR:
            if (m + n) % 2 == 1:
                return float(max(aL, bL))
            return (max(aL, bL) + min(aR, bR)) / 2.0
        elif aL > bR:
            hi = i - 1
        else:
            lo = i + 1
    return 0.0`
  },
  {
    number: 4,
    title: 'Consistent Hashing Ring Lookup',
    fnName: 'routeKeyToNode',
    description: 'Given sorted server ring positions <code>ring</code> and a request hash <code>keyHash</code>, route the request to the first server with position <code>&gt;= keyHash</code> (wrapping around to <code>ring[0]</code> if <code>keyHash &gt; ring[-1]</code>). Return the server position.',
    constraints: ['1 <= ring.length <= 10^5', 'ring is strictly increasing'],
    testCases: [
      { title: 'Test Case 1', input: 'ring = [10, 30, 60, 90], keyHash = 45', output: '60' },
      { title: 'Test Case 2', input: 'ring = [10, 30, 60, 90], keyHash = 95', output: '10' },
      { title: 'Test Case 3', input: 'ring = [10, 30, 60, 90], keyHash = 30', output: '30' },
      { title: 'Test Case 4', input: 'ring = [5], keyHash = 100', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int routeKeyToNode(int[] ring, int keyHash) {
        int lo = 0, hi = ring.length - 1, ans = 0;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (ring[mid] >= keyHash) { ans = mid; hi = mid - 1; }
            else lo = mid + 1;
        }
        return ring[ans];
    }
}`,
    pythonSolution: `def routeKeyToNode(ring, keyHash):
    import bisect
    idx = bisect.bisect_left(ring, keyHash)
    return ring[0] if idx == len(ring) else ring[idx]`
  },
  {
    number: 5,
    title: 'LRU Cache Hit Counter',
    fnName: 'countLruCacheHits',
    description: 'Simulate an LRU cache of capacity <code>cap</code> on a sequence of integer page requests <code>pages</code>. Return the total number of cache hits.',
    constraints: ['1 <= cap <= 1000', '1 <= pages.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'pages = [1, 2, 3, 1, 4, 2], cap = 3', output: '1' },
      { title: 'Test Case 2', input: 'pages = [1, 2, 1, 2], cap = 2', output: '2' },
      { title: 'Test Case 3', input: 'pages = [1, 2, 3, 4], cap = 2', output: '0' },
      { title: 'Test Case 4', input: 'pages = [5, 5, 5], cap = 1', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countLruCacheHits(int[] pages, int cap) {
        LinkedHashMap<Integer, Boolean> cache = new LinkedHashMap<>(cap, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<Integer, Boolean> e) { return size() > cap; }
        };
        int hits = 0;
        for (int p : pages) {
            if (cache.containsKey(p)) hits++;
            cache.put(p, true);
        }
        return hits;
    }
}`,
    pythonSolution: `def countLruCacheHits(pages, cap):
    from collections import OrderedDict
    cache = OrderedDict()
    hits = 0
    for p in pages:
        if p in cache:
            hits += 1
            cache.move_to_end(p)
        else:
            if len(cache) >= cap:
                cache.popitem(last=False)
            cache[p] = True
    return hits`
  },
  {
    number: 6,
    title: 'SQL-Style Hash Join Row Count',
    fnName: 'hashJoinCount',
    description: 'Given two integer key columns <code>leftKeys</code> and <code>rightKeys</code> from two database tables, return the exact number of output rows produced by an inner equijoin <code>leftKeys[i] == rightKeys[j]</code>.',
    constraints: ['1 <= leftKeys.length, rightKeys.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'leftKeys = [1, 2, 2, 3], rightKeys = [2, 2, 4]', output: '4' },
      { title: 'Test Case 2', input: 'leftKeys = [1, 2], rightKeys = [3, 4]', output: '0' },
      { title: 'Test Case 3', input: 'leftKeys = [5, 5], rightKeys = [5, 5, 5]', output: '6' },
      { title: 'Test Case 4', input: 'leftKeys = [10], rightKeys = [10]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long hashJoinCount(int[] leftKeys, int[] rightKeys) {
        Map<Integer, Long> cnt = new HashMap<>();
        for (int k : leftKeys) cnt.put(k, cnt.getOrDefault(k, 0L) + 1);
        long total = 0;
        for (int k : rightKeys) total += cnt.getOrDefault(k, 0L);
        return total;
    }
}`,
    pythonSolution: `def hashJoinCount(leftKeys, rightKeys):
    from collections import Counter
    cnt = Counter(leftKeys)
    return sum(cnt[k] for k in rightKeys)`
  },
  {
    number: 7,
    title: 'Minimum Query-Plan Merge Cost',
    fnName: 'minJoinTableCost',
    description: 'Joining two intermediate tables of sizes <code>a</code> and <code>b</code> produces a table of size <code>a + b</code> at cost <code>a + b</code>. Given table sizes <code>sizes</code>, return the minimum total cost to join all tables.',
    constraints: ['1 <= sizes.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'sizes = [20, 30, 10, 5]', output: '115' },
      { title: 'Test Case 2', input: 'sizes = [5, 5, 5]', output: '25' },
      { title: 'Test Case 3', input: 'sizes = [100]', output: '0' },
      { title: 'Test Case 4', input: 'sizes = [1, 2, 3, 4]', output: '19' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long minJoinTableCost(int[] sizes) {
        PriorityQueue<Long> pq = new PriorityQueue<>();
        for (int s : sizes) pq.add((long) s);
        long cost = 0;
        while (pq.size() > 1) {
            long s = pq.poll() + pq.poll();
            cost += s; pq.add(s);
        }
        return cost;
    }
}`,
    pythonSolution: `def minJoinTableCost(sizes):
    import heapq
    h = list(sizes)
    heapq.heapify(h)
    cost = 0
    while len(h) > 1:
        s = heapq.heappop(h) + heapq.heappop(h)
        cost += s
        heapq.heappush(h, s)
    return cost`
  },
  {
    number: 8,
    title: 'Concurrent Transaction Peak Count',
    fnName: 'maxConcurrentTxns',
    description: 'Given transaction intervals <code>txns</code> <code>[start, end]</code> (half-open <code>[start, end)</code>), return the maximum number of transactions active simultaneously.',
    constraints: ['1 <= txns.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'txns = [[1, 5], [2, 6], [4, 8], [6, 9]]', output: '3' },
      { title: 'Test Case 2', input: 'txns = [[1, 2], [2, 3], [3, 4]]', output: '1' },
      { title: 'Test Case 3', input: 'txns = [[0, 10]]', output: '1' },
      { title: 'Test Case 4', input: 'txns = [[1, 10], [1, 10], [1, 10]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxConcurrentTxns(int[][] txns) {
        int n = txns.length;
        int[] s = new int[n], e = new int[n];
        for (int i = 0; i < n; i++) { s[i] = txns[i][0]; e[i] = txns[i][1]; }
        Arrays.sort(s); Arrays.sort(e);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (s[i] < e[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def maxConcurrentTxns(txns):
    s = sorted(t[0] for t in txns)
    e = sorted(t[1] for t in txns)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]:
            cur += 1; best = max(best, cur); i += 1
        else:
            cur -= 1; j += 1
    return best`
  },
  {
    number: 9,
    title: 'Serialize BST Preorder Validation',
    fnName: 'isValidBstPreorder',
    description: 'Given an array of distinct integers <code>preorder</code>, return <code>true</code> if it can represent the preorder traversal of a valid Binary Search Tree.',
    constraints: ['1 <= preorder.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'preorder = [5, 2, 1, 3, 6]', output: 'true' },
      { title: 'Test Case 2', input: 'preorder = [5, 2, 6, 1, 3]', output: 'false' },
      { title: 'Test Case 3', input: 'preorder = [1]', output: 'true' },
      { title: 'Test Case 4', input: 'preorder = [1, 3, 2]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean isValidBstPreorder(int[] preorder) {
        Deque<Integer> st = new ArrayDeque<>();
        int low = Integer.MIN_VALUE;
        for (int x : preorder) {
            if (x < low) return false;
            while (!st.isEmpty() && x > st.peek()) low = st.pop();
            st.push(x);
        }
        return true;
    }
}`,
    pythonSolution: `def isValidBstPreorder(preorder):
    st, low = [], float('-inf')
    for x in preorder:
        if x < low: return False
        while st and x > st[-1]:
            low = st.pop()
        st.append(x)
    return True`
  },
  {
    number: 10,
    title: 'Trie Prefix Autocomplete Counter',
    fnName: 'countPrefixMatches',
    description: 'Given a list of table column names <code>words</code> and prefix queries <code>queries</code>, return an array where each entry is the number of words starting with that query prefix.',
    constraints: ['1 <= words.length, queries.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'words = ["user_id", "user_name", "order_id", "user_role"], queries = ["user", "ord", "x"]', output: '[3, 1, 0]' },
      { title: 'Test Case 2', input: 'words = ["a", "ab", "abc"], queries = ["a", "ab", "abc"]', output: '[3, 2, 1]' },
      { title: 'Test Case 3', input: 'words = ["sql"], queries = ["sql_"]', output: '[0]' },
      { title: 'Test Case 4', input: 'words = ["id", "id"], queries = ["id"]', output: '[2]' }
    ],
    javaSolution: `public class Solution {
    public static int[] countPrefixMatches(String[] words, String[] queries) {
        int[] res = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int c = 0;
            for (String w : words) if (w.startsWith(queries[i])) c++;
            res[i] = c;
        }
        return res;
    }
}`,
    pythonSolution: `def countPrefixMatches(words, queries):
    return [sum(1 for w in words if w.startswith(q)) for q in queries]`
  },
  {
    number: 11,
    title: 'Count Primes Using Segmented Sieve Range',
    fnName: 'countPrimesInRange',
    description: 'Given two integers <code>low</code> and <code>high</code> (<code>2 &lt;= low &lt;= high</code>), return the count of prime numbers in the inclusive range <code>[low, high]</code>.',
    constraints: ['2 <= low <= high <= 10^6', 'high - low <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'low = 10, high = 30', output: '6' },
      { title: 'Test Case 2', input: 'low = 2, high = 10', output: '4' },
      { title: 'Test Case 3', input: 'low = 24, high = 28', output: '0' },
      { title: 'Test Case 4', input: 'low = 97, high = 97', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countPrimesInRange(int low, int high) {
        int lim = (int) Math.sqrt(high);
        boolean[] small = new boolean[lim + 1];
        Arrays.fill(small, true);
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= lim; i++) {
            if (small[i]) {
                primes.add(i);
                for (int j = i * i; j <= lim; j += i) small[j] = false;
            }
        }
        boolean[] isP = new boolean[high - low + 1];
        Arrays.fill(isP, true);
        for (int p : primes) {
            int start = Math.max(p * p, ((low + p - 1) / p) * p);
            for (int j = start; j <= high; j += p) isP[j - low] = false;
        }
        int cnt = 0;
        for (boolean b : isP) if (b) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countPrimesInRange(low, high):
    import math
    lim = int(math.isqrt(high))
    small = [True] * (lim + 1)
    primes = []
    for i in range(2, lim + 1):
        if small[i]:
            primes.append(i)
            for j in range(i * i, lim + 1, i):
                small[j] = False
    is_p = [True] * (high - low + 1)
    for p in primes:
        start = max(p * p, ((low + p - 1) // p) * p)
        for j in range(start, high + 1, p):
            is_p[j - low] = False
    return sum(is_p)`
  },
  {
    number: 12,
    title: 'Longest Substring With At Most Two Distinct Chars',
    fnName: 'longestTwoDistinct',
    description: 'Given string <code>s</code>, return the length of the longest contiguous substring containing at most 2 distinct characters.',
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "eceba"', output: '3' },
      { title: 'Test Case 2', input: 's = "ccaabbb"', output: '5' },
      { title: 'Test Case 3', input: 's = "aaaa"', output: '4' },
      { title: 'Test Case 4', input: 's = "abcdef"', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestTwoDistinct(String s) {
        Map<Character, Integer> cnt = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            cnt.put(c, cnt.getOrDefault(c, 0) + 1);
            while (cnt.size() > 2) {
                char lc = s.charAt(left++);
                if (cnt.get(lc) == 1) cnt.remove(lc);
                else cnt.put(lc, cnt.get(lc) - 1);
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
    pythonSolution: `def longestTwoDistinct(s):
    from collections import defaultdict
    cnt = defaultdict(int)
    left = best = 0
    for right, c in enumerate(s):
        cnt[c] += 1
        while len(cnt) > 2:
            lc = s[left]
            cnt[lc] -= 1
            if cnt[lc] == 0: del cnt[lc]
            left += 1
        best = max(best, right - left + 1)
    return best`
  },
  {
    number: 13,
    title: 'Minimum Time to Finish K-Cores',
    fnName: 'minMaxLoadPerCore',
    description: 'Distribute <code>tasks</code> (preserving contiguous blocks) across <code>k</code> CPU cores so the maximum load on any core is minimized. Return the minimized maximum load.',
    constraints: ['1 <= k <= tasks.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'tasks = [12, 34, 67, 90], k = 2', output: '113' },
      { title: 'Test Case 2', input: 'tasks = [10, 20, 30, 40], k = 2', output: '60' },
      { title: 'Test Case 3', input: 'tasks = [5, 5, 5, 5], k = 4', output: '5' },
      { title: 'Test Case 4', input: 'tasks = [100], k = 1', output: '100' }
    ],
    javaSolution: `public class Solution {
    public static int minMaxLoadPerCore(int[] tasks, int k) {
        int lo = 0, hi = 0;
        for (int t : tasks) { lo = Math.max(lo, t); hi += t; }
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            int cores = 1, cur = 0;
            for (int t : tasks) {
                if (cur + t > mid) { cores++; cur = 0; }
                cur += t;
            }
            if (cores <= k) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def minMaxLoadPerCore(tasks, k):
    lo, hi = max(tasks), sum(tasks)
    while lo < hi:
        mid = (lo + hi) // 2
        cores, cur = 1, 0
        for t in tasks:
            if cur + t > mid:
                cores += 1; cur = 0
            cur += t
        if cores <= k: hi = mid
        else: lo = mid + 1
    return lo`
  },
  {
    number: 14,
    title: 'Number of Distinct Islands',
    fnName: 'countDistinctIslandShapes',
    description: 'Given a binary grid <code>grid</code>, count the number of distinct island shapes (two islands are the same if one can be translated to equal the other without rotation/reflection).',
    constraints: ['1 <= R, C <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]', output: '1' },
      { title: 'Test Case 2', input: 'grid = [[1,1,0,1,1],[1,0,0,0,0],[0,0,0,0,1],[1,1,0,1,1]]', output: '3' },
      { title: 'Test Case 3', input: 'grid = [[0,0],[0,0]]', output: '0' },
      { title: 'Test Case 4', input: 'grid = [[1,0,1]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDistinctIslandShapes(int[][] grid) {
        int r = grid.length, c = grid[0].length;
        Set<String> shapes = new HashSet<>();
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                if (grid[i][j] == 1) {
                    StringBuilder sb = new StringBuilder();
                    dfs(grid, i, j, i, j, sb);
                    shapes.add(sb.toString());
                }
            }
        }
        return shapes.size();
    }
    private static void dfs(int[][] g, int i, int j, int r0, int c0, StringBuilder sb) {
        if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != 1) return;
        g[i][j] = 0;
        sb.append(i - r0).append(',').append(j - c0).append(';');
        dfs(g,i+1,j,r0,c0,sb); dfs(g,i-1,j,r0,c0,sb); dfs(g,i,j+1,r0,c0,sb); dfs(g,i,j-1,r0,c0,sb);
    }
}`,
    pythonSolution: `def countDistinctIslandShapes(grid):
    r, c = len(grid), len(grid[0])
    g = [row[:] for row in grid]
    shapes = set()
    for i in range(r):
        for j in range(c):
            if g[i][j] == 1:
                st, pts = [(i, j)], []
                g[i][j] = 0
                while st:
                    x, y = st.pop()
                    pts.append((x - i, y - j))
                    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                        if 0 <= nx < r and 0 <= ny < c and g[nx][ny] == 1:
                            g[nx][ny] = 0; st.append((nx, ny))
                shapes.add(tuple(sorted(pts)))
    return len(shapes)`
  },
  {
    number: 15,
    title: 'Sliding Window Median',
    fnName: 'slidingWindowMedians',
    description: 'Given integer array <code>nums</code> and window size <code>k</code>, return an array of medians (as floats) for each contiguous window of size <code>k</code>.',
    constraints: ['1 <= k <= nums.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3', output: '[1.0, -1.0, -1.0, 3.0, 5.0, 6.0]' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 4], k = 2', output: '[1.5, 2.5, 3.5]' },
      { title: 'Test Case 3', input: 'nums = [10], k = 1', output: '[10.0]' },
      { title: 'Test Case 4', input: 'nums = [5, 1, 3], k = 3', output: '[3.0]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static double[] slidingWindowMedians(int[] nums, int k) {
        int n = nums.length;
        double[] res = new double[n - k + 1];
        List<Integer> win = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int pos = Collections.binarySearch(win, nums[i]);
            if (pos < 0) pos = -(pos + 1);
            win.add(pos, nums[i]);
            if (win.size() > k) {
                int rem = Collections.binarySearch(win, nums[i - k]);
                win.remove(rem);
            }
            if (win.size() == k) {
                res[i - k + 1] = (k % 2 == 1) ? win.get(k / 2) : (win.get(k / 2 - 1) + (double) win.get(k / 2)) / 2.0;
            }
        }
        return res;
    }
}`,
    pythonSolution: `def slidingWindowMedians(nums, k):
    import bisect
    win, res = [], []
    for i, x in enumerate(nums):
        bisect.insort(win, x)
        if len(win) > k:
            idx = bisect.bisect_left(win, nums[i - k])
            win.pop(idx)
        if len(win) == k:
            res.append(float(win[k // 2]) if k % 2 else (win[k // 2 - 1] + win[k // 2]) / 2.0)
    return res`
  },
  {
    number: 16,
    title: 'All-Pairs Shortest Latency (Floyd-Warshall)',
    fnName: 'minThresholdCity',
    description: 'Given <code>n</code> cities (0..n-1), undirected weighted edges <code>edges</code> <code>[u, v, w]</code>, and <code>threshold</code>, return the city with the smallest number of other cities reachable with distance <code>&lt;= threshold</code> (break ties by largest city ID).',
    constraints: ['2 <= n <= 100', '1 <= threshold <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], threshold = 4', output: '3' },
      { title: 'Test Case 2', input: 'n = 5, edges = [[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], threshold = 2', output: '0' },
      { title: 'Test Case 3', input: 'n = 2, edges = [[0,1,5]], threshold = 3', output: '1' },
      { title: 'Test Case 4', input: 'n = 3, edges = [[0,1,1],[1,2,1]], threshold = 10', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minThresholdCity(int n, int[][] edges, int threshold) {
        int INF = 1_000_000_000;
        int[][] d = new int[n][n];
        for (int i = 0; i < n; i++) { Arrays.fill(d[i], INF); d[i][i] = 0; }
        for (int[] e : edges) { d[e[0]][e[1]] = e[2]; d[e[1]][e[0]] = e[2]; }
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
        int bestCity = 0, bestCnt = n + 1;
        for (int i = 0; i < n; i++) {
            int cnt = 0;
            for (int j = 0; j < n; j++) if (i != j && d[i][j] <= threshold) cnt++;
            if (cnt <= bestCnt) { bestCnt = cnt; bestCity = i; }
        }
        return bestCity;
    }
}`,
    pythonSolution: `def minThresholdCity(n, edges, threshold):
    INF = 10**9
    d = [[INF] * n for _ in range(n)]
    for i in range(n): d[i][i] = 0
    for u, v, w in edges:
        d[u][v] = d[v][u] = w
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    best_city, best_cnt = 0, n + 1
    for i in range(n):
        cnt = sum(1 for j in range(n) if i != j and d[i][j] <= threshold)
        if cnt <= best_cnt:
            best_cnt, best_city = cnt, i
    return best_city`
  },
  {
    number: 17,
    title: 'Wildcard Pattern Matcher',
    fnName: 'isWildcardMatch',
    description: 'Given string <code>s</code> and pattern <code>p</code> where <code>?</code> matches any single character and <code>*</code> matches any sequence of characters (including empty), return <code>true</code> if <code>p</code> matches the entire string <code>s</code>.',
    constraints: ['0 <= s.length, p.length <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 's = "aa", p = "*"', output: 'true' },
      { title: 'Test Case 2', input: 's = "cb", p = "?a"', output: 'false' },
      { title: 'Test Case 3', input: 's = "adceb", p = "*a*b"', output: 'true' },
      { title: 'Test Case 4', input: 's = "acdcb", p = "a*c?b"', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean isWildcardMatch(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;
        for (int j = 1; j <= n; j++) if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                char pc = p.charAt(j - 1);
                if (pc == '*') dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
                else if (pc == '?' || pc == s.charAt(i - 1)) dp[i][j] = dp[i - 1][j - 1];
            }
        }
        return dp[m][n];
    }
}`,
    pythonSolution: `def isWildcardMatch(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(1, n + 1):
        if p[j - 1] == '*': dp[0][j] = dp[0][j - 1]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                dp[i][j] = dp[i - 1][j] or dp[i][j - 1]
            elif p[j - 1] == '?' or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[m][n]`
  },
  {
    number: 18,
    title: 'Maximum Sum Rectangle in Matrix (2D Kadane)',
    fnName: 'maxSubmatrixSum',
    description: 'Given a non-empty 2D integer matrix <code>mat</code>, return the maximum sum of any non-empty rectangular submatrix.',
    constraints: ['1 <= R, C <= 60'],
    testCases: [
      { title: 'Test Case 1', input: 'mat = [[1, 2, -1, -4, -20], [-8, -3, 4, 2, 1], [3, 8, 10, 1, 3], [-4, -1, 1, 7, -6]]', output: '29' },
      { title: 'Test Case 2', input: 'mat = [[-1, -2], [-3, -4]]', output: '-1' },
      { title: 'Test Case 3', input: 'mat = [[5]]', output: '5' },
      { title: 'Test Case 4', input: 'mat = [[2, 1], [-1, 4]]', output: '6' }
    ],
    javaSolution: `public class Solution {
    public static int maxSubmatrixSum(int[][] mat) {
        int r = mat.length, c = mat[0].length, best = mat[0][0];
        for (int top = 0; top < r; top++) {
            int[] col = new int[c];
            for (int bot = top; bot < r; bot++) {
                for (int j = 0; j < c; j++) col[j] += mat[bot][j];
                int cur = col[0], mx = col[0];
                for (int j = 1; j < c; j++) { cur = Math.max(col[j], cur + col[j]); mx = Math.max(mx, cur); }
                best = Math.max(best, mx);
            }
        }
        return best;
    }
}`,
    pythonSolution: `def maxSubmatrixSum(mat):
    r, c = len(mat), len(mat[0])
    best = mat[0][0]
    for top in range(r):
        col = [0] * c
        for bot in range(top, r):
            for j in range(c): col[j] += mat[bot][j]
            cur = mx = col[0]
            for x in col[1:]:
                cur = max(x, cur + x)
                mx = max(mx, cur)
            best = max(best, mx)
    return best`
  },
  {
    number: 19,
    title: 'Minimum Deletions to Make String Palindrome',
    fnName: 'minDeletionsForPalindrome',
    description: 'Given string <code>s</code>, return the minimum number of character deletions required to make <code>s</code> a palindrome.',
    constraints: ['1 <= s.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 's = "aebcbda"', output: '2' },
      { title: 'Test Case 2', input: 's = "aba"', output: '0' },
      { title: 'Test Case 3', input: 's = "abcde"', output: '4' },
      { title: 'Test Case 4', input: 's = "mbadm"', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minDeletionsForPalindrome(String s) {
        int n = s.length();
        int[] dp = new int[n];
        for (int i = n - 1; i >= 0; i--) {
            dp[i] = 1;
            int prev = 0;
            for (int j = i + 1; j < n; j++) {
                int tmp = dp[j];
                if (s.charAt(i) == s.charAt(j)) dp[j] = prev + 2;
                else dp[j] = Math.max(dp[j], dp[j - 1]);
                prev = tmp;
            }
        }
        return n - dp[n - 1];
    }
}`,
    pythonSolution: `def minDeletionsForPalindrome(s):
    n = len(s)
    dp = [0] * n
    for i in range(n - 1, -1, -1):
        dp[i] = 1
        prev = 0
        for j in range(i + 1, n):
            tmp = dp[j]
            dp[j] = prev + 2 if s[i] == s[j] else max(dp[j], dp[j - 1])
            prev = tmp
    return n - dp[-1]`
  },
  {
    number: 20,
    title: 'Count Pairs With Sum Less Than Target',
    fnName: 'countPairsUnderTarget',
    description: 'Given integer array <code>nums</code> and integer <code>target</code>, return the number of pairs <code>(i, j)</code> with <code>0 &lt;= i &lt; j &lt; n</code> and <code>nums[i] + nums[j] &lt; target</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [-1, 1, 2, 3, 1], target = 2', output: '3' },
      { title: 'Test Case 2', input: 'nums = [-6, 2, 5, -2, -7, -1, 3], target = -2', output: '10' },
      { title: 'Test Case 3', input: 'nums = [5, 6, 7], target = 5', output: '0' },
      { title: 'Test Case 4', input: 'nums = [1, 2], target = 4', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long countPairsUnderTarget(int[] nums, int target) {
        Arrays.sort(nums);
        int l = 0, r = nums.length - 1;
        long ans = 0;
        while (l < r) {
            if (nums[l] + nums[r] < target) { ans += (r - l); l++; }
            else r--;
        }
        return ans;
    }
}`,
    pythonSolution: `def countPairsUnderTarget(nums, target):
    a = sorted(nums)
    l, r, ans = 0, len(a) - 1, 0
    while l < r:
        if a[l] + a[r] < target:
            ans += r - l; l += 1
        else:
            r -= 1
    return ans`
  },
  {
    number: 21,
    title: 'Distinct Ways to Climb With Variable Steps',
    fnName: 'countStepWays',
    description: 'You are climbing a staircase of <code>n</code> steps. From any step, you can take any jump size from array <code>jumps</code>. Return the number of distinct ordered sequences to reach step <code>n</code> (modulo <code>10^9 + 7</code>).',
    constraints: ['1 <= n <= 10^4', '1 <= jumps.length <= 50'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, jumps = [1, 2]', output: '5' },
      { title: 'Test Case 2', input: 'n = 4, jumps = [1, 3, 5]', output: '3' },
      { title: 'Test Case 3', input: 'n = 3, jumps = [2]', output: '0' },
      { title: 'Test Case 4', input: 'n = 0, jumps = [1, 2]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int countStepWays(int n, int[] jumps) {
        int MOD = 1_000_000_007;
        int[] dp = new int[n + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            for (int j : jumps) if (i >= j) dp[i] = (dp[i] + dp[i - j]) % MOD;
        }
        return dp[n];
    }
}`,
    pythonSolution: `def countStepWays(n, jumps):
    MOD = 10**9 + 7
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for j in jumps:
            if i >= j:
                dp[i] = (dp[i] + dp[i - j]) % MOD
    return dp[n]`
  },
  {
    number: 22,
    title: 'Minimum Cost to Hire Workers (Quality-Wage)',
    fnName: 'minTimeToCompleteJobs',
    description: 'Given integer array <code>bloomDay</code> where <code>bloomDay[i]</code> is the day item <code>i</code> is ready, you need <code>m</code> bundles of <code>k</code> adjacent ready items. Return the minimum day to make <code>m</code> bundles, or <code>-1</code>.',
    constraints: ['1 <= bloomDay.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'bloomDay = [1, 10, 3, 10, 2], m = 3, k = 1', output: '3' },
      { title: 'Test Case 2', input: 'bloomDay = [1, 10, 3, 10, 2], m = 3, k = 2', output: '-1' },
      { title: 'Test Case 3', input: 'bloomDay = [7, 7, 7, 7, 12, 7, 7], m = 2, k = 3', output: '12' },
      { title: 'Test Case 4', input: 'bloomDay = [1000000000, 1000000000], m = 1, k = 1', output: '1000000000' }
    ],
    javaSolution: `public class Solution {
    public static int minTimeToCompleteJobs(int[] bloomDay, int m, int k) {
        if ((long) m * k > bloomDay.length) return -1;
        int lo = 1, hi = 0;
        for (int b : bloomDay) hi = Math.max(hi, b);
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            int bundles = 0, run = 0;
            for (int b : bloomDay) {
                if (b <= mid) { if (++run == k) { bundles++; run = 0; } }
                else run = 0;
            }
            if (bundles >= m) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def minTimeToCompleteJobs(bloomDay, m, k):
    if m * k > len(bloomDay): return -1
    lo, hi = 1, max(bloomDay)
    while lo < hi:
        mid = (lo + hi) // 2
        bundles = run = 0
        for b in bloomDay:
            if b <= mid:
                run += 1
                if run == k:
                    bundles += 1; run = 0
            else:
                run = 0
        if bundles >= m: hi = mid
        else: lo = mid + 1
    return lo`
  },
  {
    number: 23,
    title: 'Maximum Number of Vowels in K-Window',
    fnName: 'maxVowelsInWindow',
    description: 'Given lowercase string <code>s</code> and integer <code>k</code>, return the maximum number of vowel letters (<code>a,e,i,o,u</code>) in any substring of length <code>k</code>.',
    constraints: ['1 <= k <= s.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 's = "abciiidef", k = 3', output: '3' },
      { title: 'Test Case 2', input: 's = "aeiou", k = 2', output: '2' },
      { title: 'Test Case 3', input: 's = "leetcode", k = 3', output: '2' },
      { title: 'Test Case 4', input: 's = "rhythms", k = 4', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxVowelsInWindow(String s, int k) {
        int cur = 0, best = 0;
        for (int i = 0; i < s.length(); i++) {
            if ("aeiou".indexOf(s.charAt(i)) >= 0) cur++;
            if (i >= k && "aeiou".indexOf(s.charAt(i - k)) >= 0) cur--;
            if (i >= k - 1) best = Math.max(best, cur);
        }
        return best;
    }
}`,
    pythonSolution: `def maxVowelsInWindow(s, k):
    v = set('aeiou')
    cur = best = 0
    for i, c in enumerate(s):
        if c in v: cur += 1
        if i >= k and s[i - k] in v: cur -= 1
        if i >= k - 1: best = max(best, cur)
    return best`
  },
  {
    number: 24,
    title: 'Critical Connections (Bridges) Count',
    fnName: 'countNetworkBridges',
    description: 'Given <code>n</code> servers (0..n-1) and undirected links <code>edges</code>, return the number of critical connections (bridges) whose removal disconnects the network.',
    constraints: ['2 <= n <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'n = 4, edges = [[0, 1], [1, 2], [2, 0], [1, 3]]', output: '1' },
      { title: 'Test Case 2', input: 'n = 2, edges = [[0, 1]]', output: '1' },
      { title: 'Test Case 3', input: 'n = 3, edges = [[0, 1], [1, 2], [2, 0]]', output: '0' },
      { title: 'Test Case 4', input: 'n = 4, edges = [[0, 1], [1, 2], [2, 3]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    static int timer;
    public static int countNetworkBridges(int n, int[][] edges) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
        int[] tin = new int[n], low = new int[n];
        Arrays.fill(tin, -1);
        timer = 0;
        int[] ans = {0};
        for (int i = 0; i < n; i++) if (tin[i] == -1) dfs(i, -1, g, tin, low, ans);
        return ans[0];
    }
    private static void dfs(int u, int p, List<List<Integer>> g, int[] tin, int[] low, int[] ans) {
        tin[u] = low[u] = timer++;
        for (int v : g.get(u)) {
            if (v == p) continue;
            if (tin[v] != -1) low[u] = Math.min(low[u], tin[v]);
            else {
                dfs(v, u, g, tin, low, ans);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > tin[u]) ans[0]++;
            }
        }
    }
}`,
    pythonSolution: `def countNetworkBridges(n, edges):
    import sys
    sys.setrecursionlimit(20000)
    g = [[] for _ in range(n)]
    for u, v in edges: g[u].append(v); g[v].append(u)
    tin, low = [-1] * n, [0] * n
    timer, ans = [0], [0]
    def dfs(u, p):
        tin[u] = low[u] = timer[0]; timer[0] += 1
        for v in g[u]:
            if v == p: continue
            if tin[v] != -1:
                low[u] = min(low[u], tin[v])
            else:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > tin[u]: ans[0] += 1
    for i in range(n):
        if tin[i] == -1: dfs(i, -1)
    return ans[0]`
  },
  {
    number: 25,
    title: 'Longest Valid Parentheses Span',
    fnName: 'longestValidParens',
    description: 'Given a string containing just <code>(</code> and <code>)</code>, return the length of the longest valid (well-formed) parentheses substring.',
    constraints: ['0 <= s.length <= 3 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 's = "(()"', output: '2' },
      { title: 'Test Case 2', input: 's = ")()())"', output: '4' },
      { title: 'Test Case 3', input: 's = ""', output: '0' },
      { title: 'Test Case 4', input: 's = "()(())"', output: '6' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestValidParens(String s) {
        Deque<Integer> st = new ArrayDeque<>();
        st.push(-1);
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') st.push(i);
            else {
                st.pop();
                if (st.isEmpty()) st.push(i);
                else best = Math.max(best, i - st.peek());
            }
        }
        return best;
    }
}`,
    pythonSolution: `def longestValidParens(s):
    st, best = [-1], 0
    for i, c in enumerate(s):
        if c == '(':
            st.append(i)
        else:
            st.pop()
            if not st: st.append(i)
            else: best = max(best, i - st[-1])
    return best`
  },
  {
    number: 26,
    title: 'Minimum Operations to Make Array Continuous',
    fnName: 'minOpsContinuousArray',
    description: 'Given integer array <code>nums</code> of length <code>n</code>, you can replace any element with any integer. Return the minimum operations so that all elements are unique AND <code>max(nums) - min(nums) == n - 1</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [4, 2, 5, 3]', output: '0' },
      { title: 'Test Case 2', input: 'nums = [1, 2, 3, 5, 6]', output: '1' },
      { title: 'Test Case 3', input: 'nums = [1, 10, 100, 1000]', output: '3' },
      { title: 'Test Case 4', input: 'nums = [5, 5, 5]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minOpsContinuousArray(int[] nums) {
        int n = nums.length;
        int[] uniq = Arrays.stream(nums).distinct().sorted().toArray();
        int ans = n, j = 0;
        for (int i = 0; i < uniq.length; i++) {
            while (j < uniq.length && uniq[j] < uniq[i] + n) j++;
            ans = Math.min(ans, n - (j - i));
        }
        return ans;
    }
}`,
    pythonSolution: `def minOpsContinuousArray(nums):
    n = len(nums)
    uniq = sorted(set(nums))
    ans, j = n, 0
    for i, x in enumerate(uniq):
        while j < len(uniq) and uniq[j] < x + n:
            j += 1
        ans = min(ans, n - (j - i))
    return ans`
  },
  {
    number: 27,
    title: 'Count Subarrays With Fixed Bounds',
    fnName: 'countFixedBoundSubarrays',
    description: 'Given integer array <code>nums</code> and bounds <code>minK</code>, <code>maxK</code>, return the number of contiguous subarrays whose minimum element equals <code>minK</code> and maximum element equals <code>maxK</code>.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 3, 5, 2, 7, 5], minK = 1, maxK = 5', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 1, 1, 1], minK = 1, maxK = 1', output: '10' },
      { title: 'Test Case 3', input: 'nums = [2, 3, 4], minK = 1, maxK = 5', output: '0' },
      { title: 'Test Case 4', input: 'nums = [1, 5], minK = 1, maxK = 5', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static long countFixedBoundSubarrays(int[] nums, int minK, int maxK) {
        long ans = 0;
        int bad = -1, lastMin = -1, lastMax = -1;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] < minK || nums[i] > maxK) bad = i;
            if (nums[i] == minK) lastMin = i;
            if (nums[i] == maxK) lastMax = i;
            ans += Math.max(0, Math.min(lastMin, lastMax) - bad);
        }
        return ans;
    }
}`,
    pythonSolution: `def countFixedBoundSubarrays(nums, minK, maxK):
    ans = 0
    bad = last_min = last_max = -1
    for i, x in enumerate(nums):
        if x < minK or x > maxK: bad = i
        if x == minK: last_min = i
        if x == maxK: last_max = i
        ans += max(0, min(last_min, last_max) - bad)
    return ans`
  },
  {
    number: 28,
    title: 'Minimum Time to Repair All Cars',
    fnName: 'minCarRepairTime',
    description: 'Given mechanic ranks <code>ranks</code> and <code>cars</code> cars, a mechanic with rank <code>r</code> repairs <code>n</code> cars in <code>r * n^2</code> minutes concurrently. Return the minimum minutes to repair all <code>cars</code>.',
    constraints: ['1 <= ranks.length <= 10^5', '1 <= cars <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'ranks = [4, 2, 3, 1], cars = 10', output: '16' },
      { title: 'Test Case 2', input: 'ranks = [5, 1, 8], cars = 6', output: '16' },
      { title: 'Test Case 3', input: 'ranks = [1], cars = 5', output: '25' },
      { title: 'Test Case 4', input: 'ranks = [2, 2], cars = 4', output: '8' }
    ],
    javaSolution: `public class Solution {
    public static long minCarRepairTime(int[] ranks, int cars) {
        long minR = ranks[0];
        for (int r : ranks) minR = Math.min(minR, r);
        long lo = 1, hi = minR * cars * cars;
        while (lo < hi) {
            long mid = (lo + hi) >>> 1;
            long fixed = 0;
            for (int r : ranks) {
                fixed += (long) Math.sqrt((double) mid / r);
                if (fixed >= cars) break;
            }
            if (fixed >= cars) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def minCarRepairTime(ranks, cars):
    import math
    lo, hi = 1, min(ranks) * cars * cars
    while lo < hi:
        mid = (lo + hi) // 2
        if sum(math.isqrt(mid // r) for r in ranks) >= cars:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },
  {
    number: 29,
    title: 'Kth Missing Positive Integer',
    fnName: 'kthMissingPositive',
    description: 'Given a strictly increasing array of positive integers <code>arr</code> and integer <code>k</code>, return the <code>k</code>-th positive integer missing from <code>arr</code>.',
    constraints: ['1 <= arr.length <= 10^4', '1 <= k <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [2, 3, 4, 7, 11], k = 5', output: '9' },
      { title: 'Test Case 2', input: 'arr = [1, 2, 3, 4], k = 2', output: '6' },
      { title: 'Test Case 3', input: 'arr = [5, 6, 7], k = 3', output: '3' },
      { title: 'Test Case 4', input: 'arr = [10], k = 1', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int kthMissingPositive(int[] arr, int k) {
        int lo = 0, hi = arr.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (arr[mid] - (mid + 1) < k) lo = mid + 1;
            else hi = mid;
        }
        return lo + k;
    }
}`,
    pythonSolution: `def kthMissingPositive(arr, k):
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] - (mid + 1) < k: lo = mid + 1
        else: hi = mid
    return lo + k`
  },
  {
    number: 30,
    title: 'Maximum Sum of Subarray With At Most One Deletion',
    fnName: 'maxSumOneDeletion',
    description: 'Given integer array <code>arr</code>, return the maximum sum of a non-empty subarray after optionally deleting at most one element.',
    constraints: ['1 <= arr.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [1, -2, 0, 3]', output: '4' },
      { title: 'Test Case 2', input: 'arr = [1, -2, -2, 3]', output: '3' },
      { title: 'Test Case 3', input: 'arr = [-1, -1, -1]', output: '-1' },
      { title: 'Test Case 4', input: 'arr = [10, -5, 10]', output: '20' }
    ],
    javaSolution: `public class Solution {
    public static int maxSumOneDeletion(int[] arr) {
        int noDel = arr[0], oneDel = 0, best = arr[0];
        for (int i = 1; i < arr.length; i++) {
            oneDel = Math.max(noDel, oneDel + arr[i]);
            noDel = Math.max(arr[i], noDel + arr[i]);
            best = Math.max(best, Math.max(noDel, oneDel));
        }
        return best;
    }
}`,
    pythonSolution: `def maxSumOneDeletion(arr):
    no_del, one_del, best = arr[0], 0, arr[0]
    for x in arr[1:]:
        one_del = max(no_del, one_del + x)
        no_del = max(x, no_del + x)
        best = max(best, no_del, one_del)
    return best`
  }
];
