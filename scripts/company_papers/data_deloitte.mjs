export const DELOITTE_QUESTIONS = [
  {
    number: 1,
    title: 'Audit Ledger Inversion Count',
    fnName: 'countAuditInversions',
    description: 'In a Deloitte financial audit pipeline, two ledger timestamps <code>a[i]</code> and <code>a[j]</code> form an out-of-order inversion if <code>i &lt; j</code> and <code>a[i] &gt; a[j]</code>. Count the total number of inversions in <code>arr</code>.',
    constraints: ['1 <= arr.length <= 10^5', '1 <= arr[i] <= 10^9'],
    testCases: [
      { title: 'Test Case 1', input: 'arr = [2, 4, 1, 3, 5]', output: '3' },
      { title: 'Test Case 2', input: 'arr = [2, 3, 4, 5, 6]', output: '0' },
      { title: 'Test Case 3', input: 'arr = [10, 10, 10]', output: '0' },
      { title: 'Test Case 4', input: 'arr = [5, 4, 3, 2, 1]', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static long countAuditInversions(int[] arr) {
        return mergeSort(arr, 0, arr.length - 1);
    }
    private static long mergeSort(int[] a, int l, int r) {
        if (l >= r) return 0;
        int m = l + (r - l) / 2;
        long c = mergeSort(a, l, m) + mergeSort(a, m + 1, r);
        int[] tmp = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) {
            if (a[i] <= a[j]) tmp[k++] = a[i++];
            else { tmp[k++] = a[j++]; c += (m - i + 1); }
        }
        while (i <= m) tmp[k++] = a[i++];
        while (j <= r) tmp[k++] = a[j++];
        System.arraycopy(tmp, 0, a, l, tmp.length);
        return c;
    }
}`,
    pythonSolution: `def countAuditInversions(arr):
    def ms(a):
        if len(a) <= 1:
            return a, 0
        m = len(a) // 2
        L, cl = ms(a[:m])
        R, cr = ms(a[m:])
        merged, inv, i, j = [], cl + cr, 0, 0
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                merged.append(L[i]); i += 1
            else:
                merged.append(R[j]); inv += len(L) - i; j += 1
        return merged + L[i:] + R[j:], inv
    return ms(arr)[1]`
  },
  {
    number: 2,
    title: 'Invoice Reconciliation Pair Finder',
    fnName: 'findInvoicePairs',
    description: 'A Deloitte accounts-payable bot reconciles positive/negative invoice adjustments <code>amounts</code> against a target settlement <code>target</code>. Count the number of distinct index pairs <code>(i, j)</code> with <code>i &lt; j</code> such that <code>amounts[i] + amounts[j] == target</code>.',
    constraints: ['1 <= amounts.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'amounts = [1, 5, 7, -1, 5], target = 6', output: '3' },
      { title: 'Test Case 2', input: 'amounts = [1, 1, 1, 1], target = 2', output: '6' },
      { title: 'Test Case 3', input: 'amounts = [10, 20, 30], target = 100', output: '0' },
      { title: 'Test Case 4', input: 'amounts = [-5, 5, 0, 0], target = 0', output: '2' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static long findInvoicePairs(int[] amounts, int target) {
        Map<Integer, Long> freq = new HashMap<>();
        long count = 0;
        for (int x : amounts) {
            count += freq.getOrDefault(target - x, 0L);
            freq.put(x, freq.getOrDefault(x, 0L) + 1);
        }
        return count;
    }
}`,
    pythonSolution: `def findInvoicePairs(amounts, target):
    freq = {}
    count = 0
    for x in amounts:
        count += freq.get(target - x, 0)
        freq[x] = freq.get(x, 0) + 1
    return count`
  },
  {
    number: 3,
    title: 'Duplicate Vendor ID Deduplicator',
    fnName: 'dedupVendorIds',
    description: 'Given an array of vendor IDs <code>ids</code>, remove duplicates while preserving the exact order of first appearance.',
    constraints: ['1 <= ids.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'ids = [101, 205, 101, 309, 205, 412]', output: '[101, 205, 309, 412]' },
      { title: 'Test Case 2', input: 'ids = [7, 7, 7]', output: '[7]' },
      { title: 'Test Case 3', input: 'ids = [1, 2, 3]', output: '[1, 2, 3]' },
      { title: 'Test Case 4', input: 'ids = [99]', output: '[99]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static List<Integer> dedupVendorIds(int[] ids) {
        Set<Integer> seen = new HashSet<>();
        List<Integer> res = new ArrayList<>();
        for (int id : ids) if (seen.add(id)) res.add(id);
        return res;
    }
}`,
    pythonSolution: `def dedupVendorIds(ids):
    seen = set()
    res = []
    for x in ids:
        if x not in seen:
            seen.add(x)
            res.append(x)
    return res`
  },
  {
    number: 4,
    title: 'Tax Bracket Progressive Calculator',
    fnName: 'computeTaxPayable',
    description: 'Compute annual tax using progressive slabs: 0% on first 300,000; 5% on next 300,000 (300,001–600,000); 10% on next 400,000 (600,001–1,000,000); 20% above 1,000,000. Return the integer floor of total tax for integer <code>income</code>.',
    constraints: ['0 <= income <= 10^8'],
    testCases: [
      { title: 'Test Case 1', input: 'income = 250000', output: '0' },
      { title: 'Test Case 2', input: 'income = 500000', output: '10000' },
      { title: 'Test Case 3', input: 'income = 800000', output: '35000' },
      { title: 'Test Case 4', input: 'income = 1200000', output: '95000' }
    ],
    javaSolution: `public class Solution {
    public static long computeTaxPayable(long income) {
        long tax = 0;
        if (income > 1000000) { tax += (income - 1000000) * 20 / 100; income = 1000000; }
        if (income > 600000) { tax += (income - 600000) * 10 / 100; income = 600000; }
        if (income > 300000) { tax += (income - 300000) * 5 / 100; }
        return tax;
    }
}`,
    pythonSolution: `def computeTaxPayable(income):
    tax = 0
    if income > 1000000:
        tax += (income - 1000000) * 20 // 100
        income = 1000000
    if income > 600000:
        tax += (income - 600000) * 10 // 100
        income = 600000
    if income > 300000:
        tax += (income - 300000) * 5 // 100
    return tax`
  },
  {
    number: 5,
    title: 'Highest Risk Score in Rolling Audit Window',
    fnName: 'maxRiskWindow',
    description: 'A compliance monitor computes the maximum risk score across every contiguous window of <code>k</code> transactions in <code>scores</code>. Return the list of window maximums.',
    constraints: ['1 <= k <= scores.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'scores = [1, 3, -1, -3, 5, 3, 6, 7], k = 3', output: '[3, 3, 5, 5, 6, 7]' },
      { title: 'Test Case 2', input: 'scores = [9, 11], k = 2', output: '[11]' },
      { title: 'Test Case 3', input: 'scores = [4, 2, 12, 3], k = 1', output: '[4, 2, 12, 3]' },
      { title: 'Test Case 4', input: 'scores = [10, 9, 8, 7], k = 2', output: '[10, 9, 8]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] maxRiskWindow(int[] scores, int k) {
        int n = scores.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
            while (!dq.isEmpty() && scores[dq.peekLast()] <= scores[i]) dq.pollLast();
            dq.addLast(i);
            if (i >= k - 1) res[i - k + 1] = scores[dq.peekFirst()];
        }
        return res;
    }
}`,
    pythonSolution: `def maxRiskWindow(scores, k):
    from collections import deque
    dq, res = deque(), []
    for i, x in enumerate(scores):
        while dq and dq[0] <= i - k:
            dq.popleft()
        while dq and scores[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            res.append(scores[dq[0]])
    return res`
  },
  {
    number: 6,
    title: 'Client Tag Normalization & Grouping',
    fnName: 'countNormalizedTags',
    description: 'Deloitte CRM exports client tags with inconsistent casing and leading/trailing spaces. Given <code>tags</code>, normalize each tag by trimming whitespace and lowercasing, then return the number of distinct non-empty tags.',
    constraints: ['1 <= tags.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'tags = [" FinTech ", "fintech", "Cloud", "  ", "CLOUD "]', output: '2' },
      { title: 'Test Case 2', input: 'tags = ["AI", "ML", "Data"]', output: '3' },
      { title: 'Test Case 3', input: 'tags = ["   ", ""]', output: '0' },
      { title: 'Test Case 4', input: 'tags = ["ESG", "esg", "EsG"]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int countNormalizedTags(String[] tags) {
        Set<String> set = new HashSet<>();
        for (String t : tags) {
            String norm = t.trim().toLowerCase();
            if (!norm.isEmpty()) set.add(norm);
        }
        return set.size();
    }
}`,
    pythonSolution: `def countNormalizedTags(tags):
    return len({t.strip().lower() for t in tags if t.strip()})`
  },
  {
    number: 7,
    title: 'Top-K Frequent Error Codes',
    fnName: 'topKErrorCodes',
    description: 'Given an array of integer HTTP/audit error codes <code>codes</code> and an integer <code>k</code>, return the <code>k</code> most frequent error codes. Break ties by smaller error code value.',
    constraints: ['1 <= k <= distinct(codes) <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'codes = [500, 404, 500, 403, 404, 500], k = 2', output: '[500, 404]' },
      { title: 'Test Case 2', input: 'codes = [200, 201, 200, 201], k = 2', output: '[200, 201]' },
      { title: 'Test Case 3', input: 'codes = [401], k = 1', output: '[401]' },
      { title: 'Test Case 4', input: 'codes = [10, 20, 30, 20, 30, 30], k = 1', output: '[30]' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int[] topKErrorCodes(int[] codes, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int c : codes) freq.put(c, freq.getOrDefault(c, 0) + 1);
        List<Integer> keys = new ArrayList<>(freq.keySet());
        keys.sort((a, b) -> {
            int cmp = Integer.compare(freq.get(b), freq.get(a));
            return cmp != 0 ? cmp : Integer.compare(a, b);
        });
        int[] res = new int[k];
        for (int i = 0; i < k; i++) res[i] = keys.get(i);
        return res;
    }
}`,
    pythonSolution: `def topKErrorCodes(codes, k):
    from collections import Counter
    cnt = Counter(codes)
    return sorted(cnt.keys(), key=lambda x: (-cnt[x], x))[:k]`
  },
  {
    number: 8,
    title: 'Balanced Partition of Audit Workloads',
    fnName: 'canSplitEqualWork',
    description: 'Two audit teams must split a list of task hours <code>hours</code> into two subsets with identical total hours. Return <code>true</code> if an exact equal-sum partition is possible, otherwise <code>false</code>.',
    constraints: ['1 <= hours.length <= 100', '1 <= hours[i] <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'hours = [1, 5, 11, 5]', output: 'true' },
      { title: 'Test Case 2', input: 'hours = [1, 2, 3, 5]', output: 'false' },
      { title: 'Test Case 3', input: 'hours = [2, 2, 1, 1]', output: 'true' },
      { title: 'Test Case 4', input: 'hours = [10]', output: 'false' }
    ],
    javaSolution: `public class Solution {
    public static boolean canSplitEqualWork(int[] hours) {
        int sum = 0;
        for (int h : hours) sum += h;
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int h : hours) {
            for (int s = target; s >= h; s--) dp[s] |= dp[s - h];
        }
        return dp[target];
    }
}`,
    pythonSolution: `def canSplitEqualWork(hours):
    s = sum(hours)
    if s % 2:
        return False
    target = s // 2
    dp = {0}
    for h in hours:
        dp |= {x + h for x in dp if x + h <= target}
    return target in dp`
  },
  {
    number: 9,
    title: 'Anomalous Spike Detector in Revenue Series',
    fnName: 'countRevenueSpikes',
    description: 'In a daily revenue series <code>rev</code>, day <code>i</code> (<code>0 &lt; i &lt; n - 1</code>) is an anomaly spike if <code>rev[i] &gt; rev[i-1]</code> and <code>rev[i] &gt; rev[i+1]</code> and <code>rev[i] &gt;= 2 * min(rev[i-1], rev[i+1])</code>. Return the count of anomaly spikes.',
    constraints: ['1 <= rev.length <= 10^5', '1 <= rev[i] <= 10^6'],
    testCases: [
      { title: 'Test Case 1', input: 'rev = [10, 25, 12, 15, 40, 18]', output: '2' },
      { title: 'Test Case 2', input: 'rev = [10, 15, 12]', output: '0' },
      { title: 'Test Case 3', input: 'rev = [5, 10, 5]', output: '1' },
      { title: 'Test Case 4', input: 'rev = [100, 200]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int countRevenueSpikes(int[] rev) {
        int count = 0;
        for (int i = 1; i < rev.length - 1; i++) {
            if (rev[i] > rev[i - 1] && rev[i] > rev[i + 1] && rev[i] >= 2 * Math.min(rev[i - 1], rev[i + 1])) {
                count++;
            }
        }
        return count;
    }
}`,
    pythonSolution: `def countRevenueSpikes(rev):
    return sum(
        1 for i in range(1, len(rev) - 1)
        if rev[i] > rev[i - 1] and rev[i] > rev[i + 1] and rev[i] >= 2 * min(rev[i - 1], rev[i + 1])
    )`
  },
  {
    number: 10,
    title: 'Consultant Meeting Room Allocation',
    fnName: 'minAuditRooms',
    description: 'Given client review meeting intervals <code>meetings</code> where each element is <code>[start, end]</code>, find the minimum number of conference rooms required so all meetings can run without conflict. A room freed at time <code>t</code> can be reused at time <code>t</code>.',
    constraints: ['1 <= meetings.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'meetings = [[0, 30], [5, 10], [15, 20]]', output: '2' },
      { title: 'Test Case 2', input: 'meetings = [[7, 10], [2, 4]]', output: '1' },
      { title: 'Test Case 3', input: 'meetings = [[1, 5], [5, 10], [10, 15]]', output: '1' },
      { title: 'Test Case 4', input: 'meetings = [[1, 10], [2, 10], [3, 10]]', output: '3' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int minAuditRooms(int[][] meetings) {
        int n = meetings.length;
        int[] starts = new int[n], ends = new int[n];
        for (int i = 0; i < n; i++) { starts[i] = meetings[i][0]; ends[i] = meetings[i][1]; }
        Arrays.sort(starts);
        Arrays.sort(ends);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (starts[i] < ends[j]) { cur++; best = Math.max(best, cur); i++; }
            else { cur--; j++; }
        }
        return best;
    }
}`,
    pythonSolution: `def minAuditRooms(meetings):
    s = sorted(m[0] for m in meetings)
    e = sorted(m[1] for m in meetings)
    i = j = cur = best = 0
    while i < len(s):
        if s[i] < e[j]:
            cur += 1
            best = max(best, cur)
            i += 1
        else:
            cur -= 1
            j += 1
    return best`
  },
  {
    number: 11,
    title: 'Missing Sequence Numbers in Batch',
    fnName: 'findMissingRangeIds',
    description: 'Given a sorted or unsorted array <code>nums</code> containing distinct integers in the range <code>[0, n]</code> where <code>n = nums.length</code>, return the only number in <code>[0, n]</code> missing from the array.',
    constraints: ['1 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [3, 0, 1]', output: '2' },
      { title: 'Test Case 2', input: 'nums = [0, 1]', output: '2' },
      { title: 'Test Case 3', input: 'nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]', output: '8' },
      { title: 'Test Case 4', input: 'nums = [1]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int findMissingRangeIds(int[] nums) {
        int xor = nums.length;
        for (int i = 0; i < nums.length; i++) xor ^= i ^ nums[i];
        return xor;
    }
}`,
    pythonSolution: `def findMissingRangeIds(nums):
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)`
  },
  {
    number: 12,
    title: 'String Masking for PII Compliance',
    fnName: 'maskAccountId',
    description: 'A GDPR/PII compliance filter masks an account string <code>acc</code> by keeping only the last 4 characters visible and replacing all preceding characters with <code>\'*\'</code>. If length &lt;= 4, return <code>acc</code> unchanged.',
    constraints: ['1 <= acc.length <= 100'],
    testCases: [
      { title: 'Test Case 1', input: 'acc = "4111111111111234"', output: '************1234' },
      { title: 'Test Case 2', input: 'acc = "98765"', output: '*8765' },
      { title: 'Test Case 3', input: 'acc = "1234"', output: '1234' },
      { title: 'Test Case 4', input: 'acc = "AB"', output: 'AB' }
    ],
    javaSolution: `public class Solution {
    public static String maskAccountId(String acc) {
        if (acc.length() <= 4) return acc;
        return "*".repeat(acc.length() - 4) + acc.substring(acc.length() - 4);
    }
}`,
    pythonSolution: `def maskAccountId(acc):
    if len(acc) <= 4:
        return acc
    return '*' * (len(acc) - 4) + acc[-4:]`
  },
  {
    number: 13,
    title: 'Majority Stakeholder Vote',
    fnName: 'majorityStakeholder',
    description: 'In a board resolution vote <code>votes</code>, find the candidate ID that appears strictly more than <code>n / 2</code> times. It is guaranteed that a majority candidate always exists.',
    constraints: ['1 <= votes.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'votes = [3, 2, 3]', output: '3' },
      { title: 'Test Case 2', input: 'votes = [2, 2, 1, 1, 1, 2, 2]', output: '2' },
      { title: 'Test Case 3', input: 'votes = [10]', output: '10' },
      { title: 'Test Case 4', input: 'votes = [5, 5, 5, 1, 2]', output: '5' }
    ],
    javaSolution: `public class Solution {
    public static int majorityStakeholder(int[] votes) {
        int cand = 0, count = 0;
        for (int v : votes) {
            if (count == 0) cand = v;
            count += (v == cand) ? 1 : -1;
        }
        return cand;
    }
}`,
    pythonSolution: `def majorityStakeholder(votes):
    cand = count = 0
    for v in votes:
        if count == 0:
            cand = v
        count += 1 if v == cand else -1
    return cand`
  },
  {
    number: 14,
    title: 'Minimum Deletions for Alternating Audit Flags',
    fnName: 'minFlagDeletions',
    description: 'Given a string <code>flags</code> consisting of <code>\'A\'</code> and <code>\'B\'</code>, return the minimum number of characters to delete so that no two adjacent characters are equal.',
    constraints: ['1 <= flags.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'flags = "AAABBB"', output: '4' },
      { title: 'Test Case 2', input: 'flags = "ABABAB"', output: '0' },
      { title: 'Test Case 3', input: 'flags = "AAAA"', output: '3' },
      { title: 'Test Case 4', input: 'flags = "BBABAA"', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minFlagDeletions(String flags) {
        int del = 0;
        for (int i = 1; i < flags.length(); i++) {
            if (flags.charAt(i) == flags.charAt(i - 1)) del++;
        }
        return del;
    }
}`,
    pythonSolution: `def minFlagDeletions(flags):
    return sum(1 for i in range(1, len(flags)) if flags[i] == flags[i - 1])`
  },
  {
    number: 15,
    title: 'Prefix-Product Exclusion Array',
    fnName: 'productExcludingSelf',
    description: 'Given an array of multipliers <code>nums</code>, return an array <code>res</code> where <code>res[i]</code> is the product of all elements except <code>nums[i]</code>, without using division.',
    constraints: ['2 <= nums.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [1, 2, 3, 4]', output: '[24, 12, 8, 6]' },
      { title: 'Test Case 2', input: 'nums = [-1, 1, 0, -3, 3]', output: '[0, 0, 9, 0, 0]' },
      { title: 'Test Case 3', input: 'nums = [2, 5]', output: '[5, 2]' },
      { title: 'Test Case 4', input: 'nums = [0, 0, 4]', output: '[0, 0, 0]' }
    ],
    javaSolution: `public class Solution {
    public static int[] productExcludingSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int left = 1;
        for (int i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
        return res;
    }
}`,
    pythonSolution: `def productExcludingSelf(nums):
    n = len(nums)
    res = [1] * n
    left = 1
    for i in range(n):
        res[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        res[i] *= right
        right *= nums[i]
    return res`
  },
  {
    number: 16,
    title: 'Zero-Sum Subarray Existence Check',
    fnName: 'hasZeroNetSubarray',
    description: 'In reconciliation auditing, determine if there exists a non-empty contiguous subarray of <code>entries</code> whose sum equals <code>0</code>.',
    constraints: ['1 <= entries.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'entries = [4, 2, -3, 1, 6]', output: 'true' },
      { title: 'Test Case 2', input: 'entries = [4, 2, 0, 1, 6]', output: 'true' },
      { title: 'Test Case 3', input: 'entries = [-3, 2, 3, 1, 6]', output: 'false' },
      { title: 'Test Case 4', input: 'entries = [1, -1]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean hasZeroNetSubarray(int[] entries) {
        Set<Long> seen = new HashSet<>();
        seen.add(0L);
        long s = 0;
        for (int x : entries) {
            s += x;
            if (!seen.add(s)) return true;
        }
        return false;
    }
}`,
    pythonSolution: `def hasZeroNetSubarray(entries):
    seen = {0}
    s = 0
    for x in entries:
        s += x
        if s in seen:
            return True
        seen.add(s)
    return False`
  },
  {
    number: 17,
    title: 'Longest Balanced Debit-Credit Span',
    fnName: 'longestBalancedSpan',
    description: 'Given a binary array <code>tx</code> where <code>1</code> is a credit and <code>0</code> is a debit, find the maximum length of a contiguous subarray with an equal number of <code>0</code>s and <code>1</code>s.',
    constraints: ['1 <= tx.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'tx = [0, 1]', output: '2' },
      { title: 'Test Case 2', input: 'tx = [0, 1, 0, 1, 1, 1, 0, 0]', output: '8' },
      { title: 'Test Case 3', input: 'tx = [1, 1, 1]', output: '0' },
      { title: 'Test Case 4', input: 'tx = [0, 0, 1, 0, 0, 0, 1, 1]', output: '6' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestBalancedSpan(int[] tx) {
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);
        int bal = 0, best = 0;
        for (int i = 0; i < tx.length; i++) {
            bal += (tx[i] == 1 ? 1 : -1);
            if (first.containsKey(bal)) best = Math.max(best, i - first.get(bal));
            else first.put(bal, i);
        }
        return best;
    }
}`,
    pythonSolution: `def longestBalancedSpan(tx):
    first = {0: -1}
    bal = best = 0
    for i, v in enumerate(tx):
        bal += 1 if v == 1 else -1
        if bal in first:
            best = max(best, i - first[bal])
        else:
            first[bal] = i
    return best`
  },
  {
    number: 18,
    title: 'Minimum Job Shifts to Complete Deliverables',
    fnName: 'minDailyCapacity',
    description: 'An audit team has <code>tasks</code> with effort weights in order and must finish all within <code>days</code> days. Each day they process a contiguous prefix of remaining tasks up to capacity <code>C</code>. Find the minimum capacity <code>C</code> needed.',
    constraints: ['1 <= days <= tasks.length <= 5 * 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'tasks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days = 5', output: '15' },
      { title: 'Test Case 2', input: 'tasks = [3, 2, 2, 4, 1, 4], days = 3', output: '6' },
      { title: 'Test Case 3', input: 'tasks = [1, 2, 3, 1, 1], days = 4', output: '3' },
      { title: 'Test Case 4', input: 'tasks = [10], days = 1', output: '10' }
    ],
    javaSolution: `public class Solution {
    public static int minDailyCapacity(int[] tasks, int days) {
        int lo = 0, hi = 0;
        for (int t : tasks) { lo = Math.max(lo, t); hi += t; }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int need = 1, cur = 0;
            for (int t : tasks) {
                if (cur + t > mid) { need++; cur = 0; }
                cur += t;
            }
            if (need <= days) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
}`,
    pythonSolution: `def minDailyCapacity(tasks, days):
    lo, hi = max(tasks), sum(tasks)
    while lo < hi:
        mid = (lo + hi) // 2
        need, cur = 1, 0
        for t in tasks:
            if cur + t > mid:
                need += 1
                cur = 0
            cur += t
        if need <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo`
  },
  {
    number: 19,
    title: 'Circular Gas/Budget Station Route',
    fnName: 'canCompleteAuditCircuit',
    description: 'An auditor visits <code>n</code> regional offices in a circle. At office <code>i</code> they gain <code>gain[i]</code> budget and spend <code>cost[i]</code> to travel to office <code>(i+1)%n</code>. Return the lowest starting index from which the full circuit can be completed with non-negative budget, or <code>-1</code>.',
    constraints: ['1 <= gain.length == cost.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'gain = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]', output: '3' },
      { title: 'Test Case 2', input: 'gain = [2, 3, 4], cost = [3, 4, 3]', output: '-1' },
      { title: 'Test Case 3', input: 'gain = [5, 1, 2, 3, 4], cost = [4, 4, 1, 5, 1]', output: '4' },
      { title: 'Test Case 4', input: 'gain = [4], cost = [4]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int canCompleteAuditCircuit(int[] gain, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gain.length; i++) {
            int diff = gain[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) { start = i + 1; tank = 0; }
        }
        return total >= 0 ? start : -1;
    }
}`,
    pythonSolution: `def canCompleteAuditCircuit(gain, cost):
    total = tank = start = 0
    for i in range(len(gain)):
        diff = gain[i] - cost[i]
        total += diff
        tank += diff
        if tank < 0:
            start = i + 1
            tank = 0
    return start if total >= 0 else -1`
  },
  {
    number: 20,
    title: 'Word Segmentation Against Compliance Dictionary',
    fnName: 'canSegmentDocument',
    description: 'Given a concatenated string <code>s</code> and a list of valid dictionary tokens <code>dictWords</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.',
    constraints: ['1 <= s.length <= 300', '1 <= dictWords.length <= 1000'],
    testCases: [
      { title: 'Test Case 1', input: 's = "deloitteaudit", dictWords = ["deloitte", "audit"]', output: 'true' },
      { title: 'Test Case 2', input: 's = "applepenapple", dictWords = ["apple", "pen"]', output: 'true' },
      { title: 'Test Case 3', input: 's = "catsandog", dictWords = ["cats", "dog", "sand", "and", "cat"]', output: 'false' },
      { title: 'Test Case 4', input: 's = "a", dictWords = ["a"]', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean canSegmentDocument(String s, String[] dictWords) {
        Set<String> set = new HashSet<>(Arrays.asList(dictWords));
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && set.contains(s.substring(j, i))) { dp[i] = true; break; }
            }
        }
        return dp[s.length()];
    }
}`,
    pythonSolution: `def canSegmentDocument(s, dictWords):
    wset = set(dictWords)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in wset:
                dp[i] = True
                break
    return dp[-1]`
  },
  {
    number: 21,
    title: 'Dependency Cycle Check in ETL Pipeline',
    fnName: 'canFinishEtlJobs',
    description: 'An ETL pipeline has <code>numJobs</code> jobs labeled <code>0..numJobs-1</code> and prerequisite pairs <code>prereqs</code> where <code>[a, b]</code> means job <code>b</code> must run before job <code>a</code>. Return <code>true</code> if all jobs can be scheduled without a cycle.',
    constraints: ['1 <= numJobs <= 2000', '0 <= prereqs.length <= 5000'],
    testCases: [
      { title: 'Test Case 1', input: 'numJobs = 2, prereqs = [[1, 0]]', output: 'true' },
      { title: 'Test Case 2', input: 'numJobs = 2, prereqs = [[1, 0], [0, 1]]', output: 'false' },
      { title: 'Test Case 3', input: 'numJobs = 4, prereqs = [[1, 0], [2, 1], [3, 2]]', output: 'true' },
      { title: 'Test Case 4', input: 'numJobs = 3, prereqs = []', output: 'true' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static boolean canFinishEtlJobs(int numJobs, int[][] prereqs) {
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < numJobs; i++) g.add(new ArrayList<>());
        int[] indeg = new int[numJobs];
        for (int[] p : prereqs) { g.get(p[1]).add(p[0]); indeg[p[0]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numJobs; i++) if (indeg[i] == 0) q.add(i);
        int done = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); done++;
            for (int v : g.get(u)) if (--indeg[v] == 0) q.add(v);
        }
        return done == numJobs;
    }
}`,
    pythonSolution: `def canFinishEtlJobs(numJobs, prereqs):
    from collections import deque
    g = [[] for _ in range(numJobs)]
    indeg = [0] * numJobs
    for a, b in prereqs:
        g[b].append(a)
        indeg[a] += 1
    q = deque(i for i in range(numJobs) if indeg[i] == 0)
    done = 0
    while q:
        u = q.popleft()
        done += 1
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return done == numJobs`
  },
  {
    number: 22,
    title: 'Minimum Cost Path in Audit Grid',
    fnName: 'minAuditGridCost',
    description: 'Given a non-negative <code>R x C</code> matrix <code>grid</code> of audit effort scores, find a path from top-left <code>(0,0)</code> to bottom-right <code>(R-1,C-1)</code> moving only right or down that minimizes the sum of cells.',
    constraints: ['1 <= R, C <= 200'],
    testCases: [
      { title: 'Test Case 1', input: 'grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]', output: '7' },
      { title: 'Test Case 2', input: 'grid = [[1, 2, 3], [4, 5, 6]]', output: '12' },
      { title: 'Test Case 3', input: 'grid = [[5]]', output: '5' },
      { title: 'Test Case 4', input: 'grid = [[1, 100], [1, 1]]', output: '3' }
    ],
    javaSolution: `public class Solution {
    public static int minAuditGridCost(int[][] grid) {
        int r = grid.length, c = grid[0].length;
        int[] dp = new int[c];
        dp[0] = grid[0][0];
        for (int j = 1; j < c; j++) dp[j] = dp[j - 1] + grid[0][j];
        for (int i = 1; i < r; i++) {
            dp[0] += grid[i][0];
            for (int j = 1; j < c; j++) dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
        }
        return dp[c - 1];
    }
}`,
    pythonSolution: `def minAuditGridCost(grid):
    r, c = len(grid), len(grid[0])
    dp = grid[0][:]
    for j in range(1, c):
        dp[j] += dp[j - 1]
    for i in range(1, r):
        dp[0] += grid[i][0]
        for j in range(1, c):
            dp[j] = min(dp[j], dp[j - 1]) + grid[i][j]
    return dp[-1]`
  },
  {
    number: 23,
    title: 'Maximum Profit from Single Buy-Sell Window',
    fnName: 'maxAssetProfit',
    description: 'Given daily asset valuations <code>prices</code>, find the maximum profit from buying on one day and selling on a later day. If no profit is possible, return <code>0</code>.',
    constraints: ['1 <= prices.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'prices = [7, 1, 5, 3, 6, 4]', output: '5' },
      { title: 'Test Case 2', input: 'prices = [7, 6, 4, 3, 1]', output: '0' },
      { title: 'Test Case 3', input: 'prices = [2, 4, 1, 7]', output: '6' },
      { title: 'Test Case 4', input: 'prices = [10]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int maxAssetProfit(int[] prices) {
        int minP = prices[0], best = 0;
        for (int p : prices) {
            minP = Math.min(minP, p);
            best = Math.max(best, p - minP);
        }
        return best;
    }
}`,
    pythonSolution: `def maxAssetProfit(prices):
    min_p, best = prices[0], 0
    for p in prices:
        if p < min_p:
            min_p = p
        elif p - min_p > best:
            best = p - min_p
    return best`
  },
  {
    number: 24,
    title: 'Longest Increasing Performance Trend',
    fnName: 'longestGrowthStreak',
    description: 'Given quarterly KPI scores <code>scores</code>, return the length of the longest strictly increasing subsequence (not necessarily contiguous).',
    constraints: ['1 <= scores.length <= 2500'],
    testCases: [
      { title: 'Test Case 1', input: 'scores = [10, 9, 2, 5, 3, 7, 101, 18]', output: '4' },
      { title: 'Test Case 2', input: 'scores = [0, 1, 0, 3, 2, 3]', output: '4' },
      { title: 'Test Case 3', input: 'scores = [7, 7, 7, 7]', output: '1' },
      { title: 'Test Case 4', input: 'scores = [1, 2, 3, 4, 5]', output: '5' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int longestGrowthStreak(int[] scores) {
        List<Integer> tails = new ArrayList<>();
        for (int x : scores) {
            int idx = Collections.binarySearch(tails, x);
            if (idx < 0) idx = -(idx + 1);
            if (idx == tails.size()) tails.add(x);
            else tails.set(idx, x);
        }
        return tails.size();
    }
}`,
    pythonSolution: `def longestGrowthStreak(scores):
    import bisect
    tails = []
    for x in scores:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)`
  },
  {
    number: 25,
    title: 'Minimum Swaps to Group Compliance Flags',
    fnName: 'minSwapsToGroupOnes',
    description: 'Given a binary array <code>data</code>, return the minimum number of swaps required to group all <code>1</code>s together in any contiguous block.',
    constraints: ['1 <= data.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'data = [1, 0, 1, 0, 1]', output: '1' },
      { title: 'Test Case 2', input: 'data = [0, 0, 0, 1, 0]', output: '0' },
      { title: 'Test Case 3', input: 'data = [1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1]', output: '3' },
      { title: 'Test Case 4', input: 'data = [0, 0, 0]', output: '0' }
    ],
    javaSolution: `public class Solution {
    public static int minSwapsToGroupOnes(int[] data) {
        int ones = 0;
        for (int x : data) ones += x;
        if (ones <= 1) return 0;
        int cur = 0, maxOnes = 0;
        for (int i = 0; i < data.length; i++) {
            cur += data[i];
            if (i >= ones) cur -= data[i - ones];
            maxOnes = Math.max(maxOnes, cur);
        }
        return ones - maxOnes;
    }
}`,
    pythonSolution: `def minSwapsToGroupOnes(data):
    ones = sum(data)
    if ones <= 1:
        return 0
    cur = max_ones = 0
    for i, x in enumerate(data):
        cur += x
        if i >= ones:
            cur -= data[i - ones]
        if cur > max_ones:
            max_ones = cur
    return ones - max_ones`
  },
  {
    number: 26,
    title: 'Version Number Comparison Engine',
    fnName: 'compareDocVersions',
    description: 'Compare two dot-separated software/document version strings <code>v1</code> and <code>v2</code>. Return <code>1</code> if <code>v1 &gt; v2</code>, <code>-1</code> if <code>v1 &lt; v2</code>, and <code>0</code> if equal (trailing <code>.0</code> segments are equivalent).',
    constraints: ['1 <= v1.length, v2.length <= 500'],
    testCases: [
      { title: 'Test Case 1', input: 'v1 = "1.01", v2 = "1.001"', output: '0' },
      { title: 'Test Case 2', input: 'v1 = "1.0", v2 = "1.0.0"', output: '0' },
      { title: 'Test Case 3', input: 'v1 = "0.1", v2 = "1.1"', output: '-1' },
      { title: 'Test Case 4', input: 'v1 = "2.10", v2 = "2.2"', output: '1' }
    ],
    javaSolution: `public class Solution {
    public static int compareDocVersions(String v1, String v2) {
        String[] a = v1.split("\\\\."), b = v2.split("\\\\.");
        int n = Math.max(a.length, b.length);
        for (int i = 0; i < n; i++) {
            int x = i < a.length ? Integer.parseInt(a[i]) : 0;
            int y = i < b.length ? Integer.parseInt(b[i]) : 0;
            if (x != y) return x > y ? 1 : -1;
        }
        return 0;
    }
}`,
    pythonSolution: `def compareDocVersions(v1, v2):
    a = [int(x) for x in v1.split('.')]
    b = [int(x) for x in v2.split('.')]
    n = max(len(a), len(b))
    a += [0] * (n - len(a))
    b += [0] * (n - len(b))
    return 1 if a > b else (-1 if a < b else 0)`
  },
  {
    number: 27,
    title: 'Department Hierarchy Maximum Depth',
    fnName: 'maxOrgDepth',
    description: 'An organization chart is given as an array <code>parent</code> where <code>parent[i]</code> is the manager of employee <code>i</code> (and <code>-1</code> for the CEO). Return the maximum depth (number of nodes from CEO to deepest employee).',
    constraints: ['1 <= parent.length <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'parent = [-1, 0, 0, 1, 1, 3]', output: '4' },
      { title: 'Test Case 2', input: 'parent = [-1]', output: '1' },
      { title: 'Test Case 3', input: 'parent = [-1, 0, 1, 2]', output: '4' },
      { title: 'Test Case 4', input: 'parent = [-1, 0, 0, 0]', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int maxOrgDepth(int[] parent) {
        int n = parent.length, best = 0;
        int[] depth = new int[n];
        for (int i = 0; i < n; i++) best = Math.max(best, getDepth(i, parent, depth));
        return best;
    }
    private static int getDepth(int i, int[] p, int[] d) {
        if (d[i] != 0) return d[i];
        if (p[i] == -1) return d[i] = 1;
        return d[i] = 1 + getDepth(p[i], p, d);
    }
}`,
    pythonSolution: `def maxOrgDepth(parent):
    n = len(parent)
    depth = [0] * n
    def get_d(i):
        if depth[i]:
            return depth[i]
        depth[i] = 1 if parent[i] == -1 else 1 + get_d(parent[i])
        return depth[i]
    return max(get_d(i) for i in range(n))`
  },
  {
    number: 28,
    title: 'Distinct Ways to Decode Numeric Ledger',
    fnName: 'countNumericDecodings',
    description: 'A legacy encoding maps <code>A->1, B->2, ..., Z->26</code>. Given a non-empty digit string <code>s</code>, return the total number of ways to decode it.',
    constraints: ['1 <= s.length <= 45', 's contains only digits'],
    testCases: [
      { title: 'Test Case 1', input: 's = "12"', output: '2' },
      { title: 'Test Case 2', input: 's = "226"', output: '3' },
      { title: 'Test Case 3', input: 's = "06"', output: '0' },
      { title: 'Test Case 4', input: 's = "11106"', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int countNumericDecodings(String s) {
        if (s.charAt(0) == '0') return 0;
        int prev2 = 1, prev1 = 1;
        for (int i = 1; i < s.length(); i++) {
            int cur = 0;
            if (s.charAt(i) != '0') cur += prev1;
            int two = Integer.parseInt(s.substring(i - 1, i + 1));
            if (two >= 10 && two <= 26) cur += prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
    pythonSolution: `def countNumericDecodings(s):
    if s[0] == '0':
        return 0
    prev2, prev1 = 1, 1
    for i in range(1, len(s)):
        cur = 0
        if s[i] != '0':
            cur += prev1
        if 10 <= int(s[i-1:i+1]) <= 26:
            cur += prev2
        prev2, prev1 = prev1, cur
    return prev1`
  },
  {
    number: 29,
    title: 'Smallest Subarray Exceeding Audit Threshold',
    fnName: 'minWindowAboveThreshold',
    description: 'Given an array of positive transaction amounts <code>nums</code> and a threshold <code>target</code>, return the minimal length of a contiguous subarray whose sum is <code>&gt;= target</code>. Return <code>0</code> if none exists.',
    constraints: ['1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^4'],
    testCases: [
      { title: 'Test Case 1', input: 'nums = [2, 3, 1, 2, 4, 3], target = 7', output: '2' },
      { title: 'Test Case 2', input: 'nums = [1, 4, 4], target = 4', output: '1' },
      { title: 'Test Case 3', input: 'nums = [1, 1, 1, 1], target = 11', output: '0' },
      { title: 'Test Case 4', input: 'nums = [5, 1, 3, 5, 10, 7, 4, 9, 2, 8], target = 15', output: '2' }
    ],
    javaSolution: `public class Solution {
    public static int minWindowAboveThreshold(int[] nums, int target) {
        int left = 0, sum = 0, best = Integer.MAX_VALUE;
        for (int right = 0; right < nums.length; right++) {
            sum += nums[right];
            while (sum >= target) {
                best = Math.min(best, right - left + 1);
                sum -= nums[left++];
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}`,
    pythonSolution: `def minWindowAboveThreshold(nums, target):
    left = s = 0
    best = float('inf')
    for right, x in enumerate(nums):
        s += x
        while s >= target:
            best = min(best, right - left + 1)
            s -= nums[left]
            left += 1
    return 0 if best == float('inf') else best`
  },
  {
    number: 30,
    title: 'Maximum Non-Overlapping Audit Engagements',
    fnName: 'maxNonOverlappingEngagements',
    description: 'Given engagement intervals <code>engagements</code> where each is <code>[start, end]</code>, return the maximum number of non-overlapping engagements a consultant can attend. Engagements touching at endpoints (e.g. <code>[1, 3]</code> and <code>[3, 5]</code>) do not overlap.',
    constraints: ['1 <= engagements.length <= 10^5'],
    testCases: [
      { title: 'Test Case 1', input: 'engagements = [[1, 2], [2, 3], [3, 4], [1, 3]]', output: '3' },
      { title: 'Test Case 2', input: 'engagements = [[1, 2], [1, 2], [1, 2]]', output: '1' },
      { title: 'Test Case 3', input: 'engagements = [[1, 10], [2, 3], [4, 5], [6, 7]]', output: '3' },
      { title: 'Test Case 4', input: 'engagements = [[5, 8]]', output: '1' }
    ],
    javaSolution: `import java.util.*;
public class Solution {
    public static int maxNonOverlappingEngagements(int[][] engagements) {
        Arrays.sort(engagements, (a, b) -> Integer.compare(a[1], b[1]));
        int count = 0, end = Integer.MIN_VALUE;
        for (int[] e : engagements) {
            if (e[0] >= end) { count++; end = e[1]; }
        }
        return count;
    }
}`,
    pythonSolution: `def maxNonOverlappingEngagements(engagements):
    engs = sorted(engagements, key=lambda x: x[1])
    count = 0
    end = float('-inf')
    for s, e in engs:
        if s >= end:
            count += 1
            end = e
    return count`
  }
];
