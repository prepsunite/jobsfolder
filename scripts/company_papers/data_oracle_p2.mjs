export const ORACLE_P2 = [
  {
    number: 31,
    title: 'B-Tree Leaf Page Utilization Count',
    fnName: 'countUnderutilizedPages',
    description: 'In an Oracle B-Tree index, each leaf page holds up to <code>maxKeys</code> keys. Pages with strictly fewer than <code>ceil(maxKeys / 2)</code> keys are underutilized and flagged for coalesce. Given key counts per page <code>pageKeys</code>, return how many pages are flagged.',
    constraints: ['1 <= pageKeys.length <= 10^5', '1 <= maxKeys <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'pageKeys = [10, 4, 5, 2, 8], maxKeys = 10', output: '2' },
      { title: 'Test Case 2', input: 'pageKeys = [3, 4, 5], maxKeys = 5', output: '0' },
      { title: 'Test Case 3', input: 'pageKeys = [0, 1, 2], maxKeys = 5', output: '3' },
      { title: 'Test Case 4', input: 'pageKeys = [1], maxKeys = 2', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countUnderutilizedPages(int[] pageKeys, int maxKeys) {
        int minReq = (maxKeys + 1) / 2, cnt = 0;
        for (int k : pageKeys) if (k < minReq) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countUnderutilizedPages(pageKeys, maxKeys):
    min_req = (maxKeys + 1) // 2
    return sum(1 for k in pageKeys if k < min_req)`
  },
  {
    number: 32,
    title: 'WAL Log Sequence Gap Detector',
    fnName: 'findMissingLsnList',
    description: 'Write-Ahead Log records arrive with LSNs in <code>lsns</code> (sorted, distinct, starting at <code>lsns[0]</code>). Return a sorted list of all missing LSN integers between <code>lsns[0]</code> and <code>lsns[-1]</code>.',
    constraints: ['1 <= lsns.length <= 10^4', 'lsns[-1] - lsns[0] <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'lsns = [100, 101, 103, 106]', output: '[102, 104, 105]' },
      { title: 'Test Case 2', input: 'lsns = [1, 2, 3]', output: '[]' },
      { title: 'Test Case 3', input: 'lsns = [10, 15]', output: '[11, 12, 13, 14]' },
      { title: 'Test Case 4', input: 'lsns = [5]', output: '[]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> findMissingLsnList(int[] lsns) {
        List<Integer> res = new ArrayList<>();
        for (int i = 1; i < lsns.length; i++) {
            for (int x = lsns[i - 1] + 1; x < lsns[i]; x++) res.add(x);
        }
        return res;
    }
}`,
    pythonSolution: `def findMissingLsnList(lsns):
    res = []
    for i in range(1, len(lsns)):
        res.extend(range(lsns[i - 1] + 1, lsns[i]))
    return res`
  },
  {
    number: 33,
    title: 'MVCC Snapshot Visibility Filter',
    fnName: 'countVisibleRowVersions',
    description: 'Under MVCC, a row version is visible to a transaction with snapshot ID <code>snapId</code> if <code>createdTx[i] &lt;= snapId</code> AND (<code>deletedTx[i] == -1</code> OR <code>deletedTx[i] &gt; snapId</code>). Return count of visible row versions.',
    constraints: ['1 <= createdTx.length == deletedTx.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'createdTx = [10, 20, 30, 15], deletedTx = [-1, 25, -1, 40], snapId = 25', output: '2' },
      { title: 'Test Case 2', input: 'createdTx = [1, 2], deletedTx = [-1, -1], snapId = 5', output: '2' },
      { title: 'Test Case 3', input: 'createdTx = [10], deletedTx = [15], snapId = 15', output: '0' },
      { title: 'Test Case 4', input: 'createdTx = [50], deletedTx = [-1], snapId = 10', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countVisibleRowVersions(int[] createdTx, int[] deletedTx, int snapId) {
        int vis = 0;
        for (int i = 0; i < createdTx.length; i++) {
            if (createdTx[i] <= snapId && (deletedTx[i] == -1 || deletedTx[i] > snapId)) vis++;
        }
        return vis;
    }
}`,
    pythonSolution: `def countVisibleRowVersions(createdTx, deletedTx, snapId):
    return sum(1 for c, d in zip(createdTx, deletedTx) if c <= snapId and (d == -1 or d > snapId))`
  },
  {
    number: 34,
    title: 'Hash-Partition Max Skew Imbalance',
    fnName: 'maxPartitionSkew',
    description: 'Given row keys <code>keys</code> distributed across <code>numParts</code> hash partitions via <code>key % numParts</code>, return <code>maxCount - minCount</code> across all <code>numParts</code> partitions.',
    constraints: ['1 <= keys.length <= 10^5', '1 <= numParts <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 'keys = [0, 4, 8, 1, 2], numParts = 4', output: '3' },
      { title: 'Test Case 2', input: 'keys = [0, 1, 2, 3], numParts = 4', output: '0' },
      { title: 'Test Case 3', input: 'keys = [5, 10, 15], numParts = 1', output: '0' },
      { title: 'Test Case 4', input: 'keys = [2, 2, 2], numParts = 3', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int maxPartitionSkew(int[] keys, int numParts) {
        int[] cnt = new int[numParts];
        for (int k : keys) cnt[((k % numParts) + numParts) % numParts]++;
        int mn = cnt[0], mx = cnt[0];
        for (int c : cnt) { mn = Math.min(mn, c); mx = Math.max(mx, c); }
        return mx - mn;
    }
}`,
    pythonSolution: `def maxPartitionSkew(keys, numParts):
    cnt = [0] * numParts
    for k in keys: cnt[k % numParts] += 1
    return max(cnt) - min(cnt)`
  },
  {
    number: 35,
    title: 'Index Range-Scan Selectivity Filter',
    fnName: 'countRangeMatches',
    description: 'Given a sorted B-Tree leaf key array <code>keys</code> and range predicates <code>queries</code> <code>[low, high]</code>, return an array with the exact number of keys in <code>[low, high]</code> inclusive for each query.',
    constraints: ['1 <= keys.length, queries.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'keys = [10, 20, 20, 30, 40], queries = [[15, 35], [20, 20], [50, 60]]', output: '[3, 2, 0]' },
      { title: 'Test Case 2', input: 'keys = [1, 2, 3], queries = [[1, 3]]', output: '[3]' },
      { title: 'Test Case 3', input: 'keys = [5], queries = [[0, 4], [5, 5]]', output: '[0, 1]' },
      { title: 'Test Case 4', input: 'keys = [1, 5, 10], queries = [[2, 9]]', output: '[1]' }
    ],
    javaSolution: `public class Solution {
    public static int[] countRangeMatches(int[] keys, int[][] queries) {
        int[] res = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            res[i] = upper(keys, queries[i][1]) - lower(keys, queries[i][0]);
        }
        return res;
    }
    private static int lower(int[] a, int x) {
        int l = 0, r = a.length;
        while (l < r) { int m = (l + r) >>> 1; if (a[m] < x) l = m + 1; else r = m; }
        return l;
    }
    private static int upper(int[] a, int x) {
        int l = 0, r = a.length;
        while (l < r) { int m = (l + r) >>> 1; if (a[m] <= x) l = m + 1; else r = m; }
        return l;
    }
}`,
    pythonSolution: `def countRangeMatches(keys, queries):
    import bisect
    return [bisect.bisect_right(keys, hi) - bisect.bisect_left(keys, lo) for lo, hi in queries]`
  },
  {
    number: 36,
    title: 'Checkpoint Dirty-Page Flush Batches',
    fnName: 'minCheckpointFlushes',
    description: 'A database bufferpool has dirty page IDs <code>dirtyPages</code>. A background writer flushes up to <code>batchSize</code> pages per I/O cycle, and contiguous runs of pages on disk (consecutive IDs) can be coalesced into a single I/O if sorted. Simpler rule: given sorted <code>dirtyPages</code>, split them into groups where consecutive pages differ by at most <code>maxGap</code> AND each group has at most <code>batchSize</code> pages. Return minimum I/O batches.',
    constraints: ['1 <= dirtyPages.length <= 10^5', '1 <= batchSize <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'dirtyPages = [1, 2, 3, 10, 11], maxGap = 1, batchSize = 2', output: '3' },
      { title: 'Test Case 2', input: 'dirtyPages = [1, 2, 3, 4], maxGap = 1, batchSize = 4', output: '1' },
      { title: 'Test Case 3', input: 'dirtyPages = [1, 5, 10], maxGap = 2, batchSize = 5', output: '3' },
      { title: 'Test Case 4', input: 'dirtyPages = [7], maxGap = 1, batchSize = 1', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int minCheckpointFlushes(int[] dirtyPages, int maxGap, int batchSize) {
        int batches = 1, curCnt = 1;
        for (int i = 1; i < dirtyPages.length; i++) {
            if (dirtyPages[i] - dirtyPages[i - 1] <= maxGap && curCnt < batchSize) curCnt++;
            else { batches++; curCnt = 1; }
        }
        return batches;
    }
}`,
    pythonSolution: `def minCheckpointFlushes(dirtyPages, maxGap, batchSize):
    batches = cur = 1
    for i in range(1, len(dirtyPages)):
        if dirtyPages[i] - dirtyPages[i - 1] <= maxGap and cur < batchSize: cur += 1
        else: batches += 1; cur = 1
    return batches`
  },
  {
    number: 37,
    title: 'Undo-Segment Retention Purge Count',
    fnName: 'countPurgeableUndoSegments',
    description: 'Undo segments have commit timestamps <code>commitTs</code>. A segment can be purged if <code>currentTs - commitTs[i] &gt;= retentionSec</code> AND its segment ID is not in <code>pinnedIds</code>. Given <code>segIds</code>, return purgeable count.',
    constraints: ['1 <= segIds.length == commitTs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'segIds = [1, 2, 3, 4], commitTs = [100, 200, 500, 900], pinnedIds = [1], currentTs = 1000, retentionSec = 500', output: '2' },
      { title: 'Test Case 2', input: 'segIds = [10, 20], commitTs = [900, 950], pinnedIds = [], currentTs = 1000, retentionSec = 200', output: '0' },
      { title: 'Test Case 3', input: 'segIds = [5], commitTs = [100], pinnedIds = [5], currentTs = 1000, retentionSec = 100', output: '0' },
      { title: 'Test Case 4', input: 'segIds = [7], commitTs = [500], pinnedIds = [], currentTs = 1000, retentionSec = 500', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countPurgeableUndoSegments(int[] segIds, int[] commitTs, int[] pinnedIds, int currentTs, int retentionSec) {
        Set<Integer> pin = new HashSet<>(); for (int p : pinnedIds) pin.add(p);
        int cnt = 0;
        for (int i = 0; i < segIds.length; i++) {
            if (!pin.contains(segIds[i]) && currentTs - commitTs[i] >= retentionSec) cnt++;
        }
        return cnt;
    }
}`,
    pythonSolution: `def countPurgeableUndoSegments(segIds, commitTs, pinnedIds, currentTs, retentionSec):
    pin = set(pinnedIds)
    return sum(1 for s, ts in zip(segIds, commitTs) if s not in pin and currentTs - ts >= retentionSec)`
  },
  {
    number: 38,
    title: 'SSTable Compaction Overlap Count',
    fnName: 'countOverlappingSSTables',
    description: 'In an LSM-tree storage engine, SSTables at Level 1 have sorted key ranges <code>tables</code> <code>[minKey, maxKey]</code>. Given an incoming flush range <code>[newMin, newMax]</code>, return how many Level 1 SSTables overlap with it.',
    constraints: ['1 <= tables.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tables = [[1, 10], [15, 25], [30, 40]], newMin = 8, newMax = 20', output: '2' },
      { title: 'Test Case 2', input: 'tables = [[1, 5], [10, 15]], newMin = 6, newMax = 9', output: '0' },
      { title: 'Test Case 3', input: 'tables = [[1, 100]], newMin = 50, newMax = 60', output: '1' },
      { title: 'Test Case 4', input: 'tables = [[1, 5], [5, 10]], newMin = 5, newMax = 5', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countOverlappingSSTables(int[][] tables, int newMin, int newMax) {
        int cnt = 0;
        for (int[] t : tables) if (Math.max(t[0], newMin) <= Math.min(t[1], newMax)) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countOverlappingSSTables(tables, newMin, newMax):
    return sum(1 for a, b in tables if max(a, newMin) <= min(b, newMax))`
  },
  {
    number: 39,
    title: 'Replication Lag Watermark Alert',
    fnName: 'maxReplicaLag',
    description: 'A primary DB is at commit LSN <code>primaryLsn</code> and <code>k</code> replicas report their applied LSNs <code>replicaLsns</code>. Return the maximum lag <code>primaryLsn - replicaLsns[i]</code> across all replicas.',
    constraints: ['1 <= replicaLsns.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'primaryLsn = 1000, replicaLsns = [995, 950, 1000]', output: '50' },
      { title: 'Test Case 2', input: 'primaryLsn = 500, replicaLsns = [500, 500]', output: '0' },
      { title: 'Test Case 3', input: 'primaryLsn = 100, replicaLsns = [0]', output: '100' },
      { title: 'Test Case 4', input: 'primaryLsn = 250, replicaLsns = [240, 245, 249]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long maxReplicaLag(long primaryLsn, long[] replicaLsns) {
        long mx = 0;
        for (long r : replicaLsns) mx = Math.max(mx, primaryLsn - r);
        return mx;
    }
}`,
    pythonSolution: `def maxReplicaLag(primaryLsn, replicaLsns):
    return max(primaryLsn - r for r in replicaLsns)`
  },
  {
    number: 40,
    title: 'Tablespace Free-Extent Coalescer',
    fnName: 'coalescedFreeBlocks',
    description: 'Given sorted free disk extents <code>extents</code> <code>[startBlock, blockCount]</code>, adjacent extents where <code>prevStart + prevCount == curStart</code> coalesce into one extent. Return the number of extents after coalescing.',
    constraints: ['1 <= extents.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'extents = [[0, 10], [10, 5], [20, 4], [24, 6]]', output: '2' },
      { title: 'Test Case 2', input: 'extents = [[0, 5], [5, 5], [10, 5]]', output: '1' },
      { title: 'Test Case 3', input: 'extents = [[1, 2], [5, 2], [10, 2]]', output: '3' },
      { title: 'Test Case 4', input: 'extents = [[0, 100]]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int coalescedFreeBlocks(int[][] extents) {
        int groups = 1;
        for (int i = 1; i < extents.length; i++) {
            if (extents[i - 1][0] + extents[i - 1][1] != extents[i][0]) groups++;
        }
        return groups;
    }
}`,
    pythonSolution: `def coalescedFreeBlocks(extents):
    return 1 + sum(1 for i in range(1, len(extents)) if extents[i-1][0] + extents[i-1][1] != extents[i][0])`
  },
  {
    number: 41,
    title: 'Bitmap Index AND-Merge Count',
    fnName: 'bitmapAndPopcount',
    description: 'Two database bitmap indexes for predicates A and B are stored as integer arrays <code>mapA</code> and <code>mapB</code> (each integer represents 32 row bits). Return the total number of rows matching BOTH predicates (total <code>1</code> bits in <code>mapA[i] &amp; mapB[i]</code>).',
    constraints: ['1 <= mapA.length == mapB.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'mapA = [15, 7], mapB = [10, 3]', output: '4' },
      { title: 'Test Case 2', input: 'mapA = [0, 0], mapB = [255, 255]', output: '0' },
      { title: 'Test Case 3', input: 'mapA = [255], mapB = [255]', output: '8' },
      { title: 'Test Case 4', input: 'mapA = [1, 2, 4], mapB = [1, 2, 4]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int bitmapAndPopcount(int[] mapA, int[] mapB) {
        int total = 0;
        for (int i = 0; i < mapA.length; i++) total += Integer.bitCount(mapA[i] & mapB[i]);
        return total;
    }
}`,
    pythonSolution: `def bitmapAndPopcount(mapA, mapB):
    return sum((a & b).bit_count() for a, b in zip(mapA, mapB))`
  },
  {
    number: 42,
    title: 'Connection-Pool Idle Reclaimer',
    fnName: 'countActiveAfterReclaim',
    description: 'A DB connection pool has connections with last-used timestamps <code>lastUsed</code> and busy flags <code>isBusy</code>. Any non-busy connection with <code>now - lastUsed[i] &gt;= idleTimeout</code> is closed, keeping at least <code>minIdle</code> total connections open (closing oldest idle first if needed, never closing busy connections). Return remaining open connections.',
    constraints: ['1 <= lastUsed.length == isBusy.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'lastUsed = [10, 20, 90, 95], isBusy = [false, false, false, true], now = 100, idleTimeout = 50, minIdle = 3', output: '3' },
      { title: 'Test Case 2', input: 'lastUsed = [10, 20], isBusy = [false, false], now = 100, idleTimeout = 50, minIdle = 0', output: '0' },
      { title: 'Test Case 3', input: 'lastUsed = [10, 20], isBusy = [true, true], now = 100, idleTimeout = 50, minIdle = 0', output: '2' },
      { title: 'Test Case 4', input: 'lastUsed = [80, 90], isBusy = [false, false], now = 100, idleTimeout = 50, minIdle = 1', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countActiveAfterReclaim(int[] lastUsed, boolean[] isBusy, int now, int idleTimeout, int minIdle) {
        int n = lastUsed.length, stale = 0;
        for (int i = 0; i < n; i++) if (!isBusy[i] && now - lastUsed[i] >= idleTimeout) stale++;
        return Math.max(minIdle, n - stale);
    }
}`,
    pythonSolution: `def countActiveAfterReclaim(lastUsed, isBusy, now, idleTimeout, minIdle):
    n = len(lastUsed)
    stale = sum(1 for lu, b in zip(lastUsed, isBusy) if not b and now - lu >= idleTimeout)
    return max(minIdle, n - stale)`
  },
  {
    number: 43,
    title: 'Shard-Split Midpoint Key Selector',
    fnName: 'findShardSplitKey',
    description: 'A sorted array of shard row keys <code>keys</code> (with possible duplicates) must be split at its median value <code>keys[n // 2]</code>. However, all identical keys equal to the split key must go to the right shard. Return how many keys end up in the left shard.',
    constraints: ['1 <= keys.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'keys = [1, 2, 2, 2, 3, 4]', output: '1' },
      { title: 'Test Case 2', input: 'keys = [1, 2, 3, 4, 5]', output: '2' },
      { title: 'Test Case 3', input: 'keys = [5, 5, 5, 5]', output: '0' },
      { title: 'Test Case 4', input: 'keys = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int findShardSplitKey(int[] keys) {
        int midVal = keys[keys.length / 2];
        int l = 0, r = keys.length;
        while (l < r) { int m = (l + r) >>> 1; if (keys[m] < midVal) l = m + 1; else r = m; }
        return l;
    }
}`,
    pythonSolution: `def findShardSplitKey(keys):
    import bisect
    return bisect.bisect_left(keys, keys[len(keys) // 2])`
  },
  {
    number: 44,
    title: 'Dead-Tuple Vacuum Reclaim Bytes',
    fnName: 'reclaimedPageBytes',
    description: 'Heap pages have live tuple bytes <code>liveBytes</code> and dead tuple bytes <code>deadBytes</code>. A vacuum pass only processes pages where <code>deadBytes[i] * 100 &gt;= (liveBytes[i] + deadBytes[i]) * bloatPct</code> (and total > 0). Return total dead bytes reclaimed.',
    constraints: ['1 <= liveBytes.length == deadBytes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'liveBytes = [800, 500, 900], deadBytes = [200, 500, 100], bloatPct = 20', output: '700' },
      { title: 'Test Case 2', input: 'liveBytes = [100], deadBytes = [0], bloatPct = 10', output: '0' },
      { title: 'Test Case 3', input: 'liveBytes = [0], deadBytes = [0], bloatPct = 0', output: '0' },
      { title: 'Test Case 4', input: 'liveBytes = [300], deadBytes = [700], bloatPct = 50', output: '700' }
    ],
    javaSolution: `public class Solution {
    public static long reclaimedPageBytes(int[] liveBytes, int[] deadBytes, int bloatPct) {
        long reclaimed = 0;
        for (int i = 0; i < liveBytes.length; i++) {
            long tot = (long) liveBytes[i] + deadBytes[i];
            if (tot > 0 && (long) deadBytes[i] * 100 >= tot * bloatPct) reclaimed += deadBytes[i];
        }
        return reclaimed;
    }
}`,
    pythonSolution: `def reclaimedPageBytes(liveBytes, deadBytes, bloatPct):
    return sum(d for l, d in zip(liveBytes, deadBytes) if (l + d) > 0 and d * 100 >= (l + d) * bloatPct)`
  },
  {
    number: 45,
    title: 'Columnar Run-Length Block Sum',
    fnName: 'columnarRleSum',
    description: 'A columnar database stores an integer column as run-length pairs <code>runs</code> <code>[value, count]</code>. Compute the sum of all elements in the column without expanding it.',
    constraints: ['1 <= runs.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'runs = [[10, 5], [20, 3], [-5, 2]]', output: '100' },
      { title: 'Test Case 2', input: 'runs = [[0, 1000]]', output: '0' },
      { title: 'Test Case 3', input: 'runs = [[7, 1]]', output: '7' },
      { title: 'Test Case 4', input: 'runs = [[100, 100000]]', output: '10000000' }
    ],
    javaSolution: `public class Solution {
    public static long columnarRleSum(int[][] runs) {
        long s = 0;
        for (int[] r : runs) s += (long) r[0] * r[1];
        return s;
    }
}`,
    pythonSolution: `def columnarRleSum(runs):
    return sum(v * c for v, c in runs)`
  },
  {
    number: 46,
    title: 'Query-Plan Predicate Pushdown Filter',
    fnName: 'countSurvivingRows',
    description: 'A storage scan applies two pushed-down column filters <code>val &gt;= minVal</code> AND <code>val &lt;= maxVal</code> on column <code>col</code>. Return the number of rows surviving the filter.',
    constraints: ['1 <= col.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'col = [5, 12, 18, 25, 30], minVal = 10, maxVal = 25', output: '3' },
      { title: 'Test Case 2', input: 'col = [1, 2, 3], minVal = 5, maxVal = 10', output: '0' },
      { title: 'Test Case 3', input: 'col = [10, 10, 10], minVal = 10, maxVal = 10', output: '3' },
      { title: 'Test Case 4', input: 'col = [-5, 0, 5], minVal = -5, maxVal = 0', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countSurvivingRows(int[] col, int minVal, int maxVal) {
        int cnt = 0;
        for (int x : col) if (x >= minVal && x <= maxVal) cnt++;
        return cnt;
    }
}`,
    pythonSolution: `def countSurvivingRows(col, minVal, maxVal):
    return sum(1 for x in col if minVal <= x <= maxVal)`
  },
  {
    number: 47,
    title: 'Bloom-Filter Bitmask Probe',
    fnName: 'countPossibleHits',
    description: 'A tiny 32-bit Bloom filter has bitmask <code>filterMask</code>. Each key <code>k</code> sets 2 bits: <code>k % 32</code> and <code>(k * 7 + 3) % 32</code>. Given probe keys <code>probes</code>, return how many probes might be in the set (both bits are 1 in <code>filterMask</code>).',
    constraints: ['1 <= probes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'filterMask = 4294967295, probes = [1, 2, 3]', output: '3' },
      { title: 'Test Case 2', input: 'filterMask = 0, probes = [1, 2, 3]', output: '0' },
      { title: 'Test Case 3', input: 'filterMask = 9, probes = [0, 1]', output: '1' },
      { title: 'Test Case 4', input: 'filterMask = 1, probes = [0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countPossibleHits(long filterMask, int[] probes) {
        int hits = 0;
        for (int k : probes) {
            int b1 = ((k % 32) + 32) % 32;
            int b2 = (((k * 7 + 3) % 32) + 32) % 32;
            if ((filterMask & (1L << b1)) != 0 && (filterMask & (1L << b2)) != 0) hits++;
        }
        return hits;
    }
}`,
    pythonSolution: `def countPossibleHits(filterMask, probes):
    return sum(1 for k in probes if (filterMask & (1 << (k % 32))) and (filterMask & (1 << ((k * 7 + 3) % 32))))`
  },
  {
    number: 48,
    title: 'Buffer-Cache Clock-Sweep Victim',
    fnName: 'clockSweepEvict',
    description: 'A clock-sweep buffer has <code>n</code> frames with reference bits <code>refBits</code> (0 or 1). Starting at hand <code>start</code>, the clock hand checks <code>refBits[pos]</code>: if 0, it evicts <code>pos</code> and stops; if 1, it clears <code>refBits[pos] = 0</code> and advances <code>(pos + 1) % n</code>. Return the evicted frame index.',
    constraints: ['1 <= refBits.length <= 10^4', '0 <= start < refBits.length'],
    testCases: [
      { title: 'Test Case 1', input: 'refBits = [1, 1, 0, 1], start = 0', output: '2' },
      { title: 'Test Case 2', input: 'refBits = [1, 1, 1], start = 1', output: '1' },
      { title: 'Test Case 3', input: 'refBits = [0, 1, 1], start = 0', output: '0' },
      { title: 'Test Case 4', input: 'refBits = [1], start = 0', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int clockSweepEvict(int[] refBits, int start) {
        int[] bits = refBits.clone();
        int n = bits.length, pos = start;
        while (true) {
            if (bits[pos] == 0) return pos;
            bits[pos] = 0;
            pos = (pos + 1) % n;
        }
    }
}`,
    pythonSolution: `def clockSweepEvict(refBits, start):
    bits = refBits[:]
    n, pos = len(bits), start
    while True:
        if bits[pos] == 0: return pos
        bits[pos] = 0
        pos = (pos + 1) % n`
  },
  {
    number: 49,
    title: 'Lock-Table Longest Wait Chain',
    fnName: 'longestLockWaitDepth',
    description: 'In a lock table of <code>n</code> transactions (0..n-1), <code>waitingFor[i]</code> is the transaction ID that transaction <code>i</code> is waiting on (or <code>-1</code> if running). Assume no cycles. Return the length (number of transactions) in the longest wait chain.',
    constraints: ['1 <= waitingFor.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'waitingFor = [-1, 0, 1, 2, 0]', output: '4' },
      { title: 'Test Case 2', input: 'waitingFor = [-1, -1, -1]', output: '1' },
      { title: 'Test Case 3', input: 'waitingFor = [1, 2, -1]', output: '3' },
      { title: 'Test Case 4', input: 'waitingFor = [-1]', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int longestLockWaitDepth(int[] waitingFor) {
        int n = waitingFor.length, best = 0;
        int[] d = new int[n];
        for (int i = 0; i < n; i++) best = Math.max(best, depth(i, waitingFor, d));
        return best;
    }
    private static int depth(int i, int[] w, int[] d) {
        if (d[i] != 0) return d[i];
        return d[i] = (w[i] == -1) ? 1 : 1 + depth(w[i], w, d);
    }
}`,
    pythonSolution: `def longestLockWaitDepth(waitingFor):
    n = len(waitingFor); d = [0]*n
    def get_d(i):
        if d[i]: return d[i]
        d[i] = 1 if waitingFor[i] == -1 else 1 + get_d(waitingFor[i])
        return d[i]
    return max(get_d(i) for i in range(n))`
  },
  {
    number: 50,
    title: 'Transaction Dirty-Read Violation Count',
    fnName: 'countDirtyReads',
    description: 'An audit log records operations <code>ops</code> as <code>["WRITE", txId, rowId]</code>, <code>["COMMIT", txId, 0]</code>, or <code>["READ", txId, rowId]</code>. A READ by <code>txId</code> is a dirty read if <code>rowId</code> currently has an uncommitted WRITE by a DIFFERENT transaction. Return total dirty reads.',
    constraints: ['1 <= ops.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'ops = [["WRITE", 1, 10], ["READ", 2, 10], ["COMMIT", 1, 0], ["READ", 3, 10]]', output: '1' },
      { title: 'Test Case 2', input: 'ops = [["WRITE", 1, 5], ["READ", 1, 5], ["COMMIT", 1, 0]]', output: '0' },
      { title: 'Test Case 3', input: 'ops = [["WRITE", 1, 5], ["COMMIT", 1, 0], ["READ", 2, 5]]', output: '0' },
      { title: 'Test Case 4', input: 'ops = [["WRITE", 1, 7], ["READ", 2, 7], ["READ", 3, 7]]', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countDirtyReads(String[][] ops) {
        Map<Integer, Integer> dirtyOwner = new HashMap<>();
        int dirty = 0;
        for (String[] op : ops) {
            int tx = Integer.parseInt(op[1]), row = Integer.parseInt(op[2]);
            if (op[0].equals("WRITE")) dirtyOwner.put(row, tx);
            else if (op[0].equals("COMMIT")) dirtyOwner.values().removeIf(v -> v == tx);
            else if (op[0].equals("READ") && dirtyOwner.containsKey(row) && dirtyOwner.get(row) != tx) dirty++;
        }
        return dirty;
    }
}`,
    pythonSolution: `def countDirtyReads(ops):
    dirty_owner, dirty = {}, 0
    for typ, tx, row in ops:
        if typ == 'WRITE': dirty_owner[row] = tx
        elif typ == 'COMMIT': dirty_owner = {r: t for r, t in dirty_owner.items() if t != tx}
        elif typ == 'READ' and row in dirty_owner and dirty_owner[row] != tx: dirty += 1
    return dirty`
  }
];
